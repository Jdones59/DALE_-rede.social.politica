param(
    [string] $DbContainer = 'dale_db',
    [string] $BackendContainer = 'dale_backend',
    [switch] $RunMigrations = $false,
    [int] $KeepDays = 30,
    [string] $OutputDir = './backups'
)

# Non-interactive CI-friendly backup + optional migrations script
# - Exits with non-zero on failures
# - Uses docker exec / docker cp for portability (no host pg client needed)

function Log($s) { Write-Output "[ci-backup] $s" }

if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Error "Docker is not available in PATH."
    exit 1
}

# ensure output directory exists (create relative to script location)
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$outputAbs = (Resolve-Path (Join-Path $scriptDir $OutputDir)).ProviderPath
New-Item -ItemType Directory -Path $outputAbs -Force | Out-Null

Log "Using DB container: $DbContainer"

$containerFound = docker ps --format "{{.Names}}" | Where-Object { $_ -eq $DbContainer }
if (-not $containerFound) {
    Log "DB container not running, trying to start via docker-compose postgres service"
    docker-compose up -d postgres
    Start-Sleep -Seconds 2
    $containerFound = docker ps --format "{{.Names}}" | Where-Object { $_ -eq $DbContainer }
    if (-not $containerFound) {
        Write-Error "DB container not available: $DbContainer"
        exit 2
    }
}

$timestamp = (Get-Date).ToString('yyyyMMddHHmmss')
$remote = "/tmp/dale-backup-$timestamp.dump"
$local = Join-Path $outputAbs "dale-backup-$timestamp.dump"

Log "Creating dump inside $DbContainer -> $remote"
docker exec -t $DbContainer sh -c "pg_dump -U joao -Fc dale_db -f $remote"
if ($LASTEXITCODE -ne 0) { Write-Error "pg_dump failed inside $DbContainer"; exit 3 }

Log "Copying to host: $local"
docker cp "$($DbContainer):$remote" "$local"
if ($LASTEXITCODE -ne 0) { Write-Error "docker cp failed"; exit 4 }

docker exec -t $DbContainer rm -f $remote

if ($RunMigrations) {
    Log "RunMigrations enabled -> running migrations in $BackendContainer"
    $bFound = docker ps --format "{{.Names}}" | Where-Object { $_ -eq $BackendContainer }
    if (-not $bFound) {
        Log "Starting backend container"
        docker-compose up --no-deps --build -d backend
        Start-Sleep -Seconds 3
        $bFound = docker ps --format "{{.Names}}" | Where-Object { $_ -eq $BackendContainer }
        if (-not $bFound) { Write-Error "Backend container '$BackendContainer' not found"; exit 5 }
    }

    Log "Executing migrations (non-interactive)"
    docker exec -t $BackendContainer sh -c 'npx prisma migrate deploy && npx prisma generate'
    if ($LASTEXITCODE -ne 0) { Write-Error "Migrations failed"; exit 6 }

    Log "Migrations applied successfully"
}

# cleanup old backups
if ($KeepDays -gt 0) {
    Log "Cleaning backups older than $KeepDays days"
    Get-ChildItem -Path $outputAbs -Filter "*.dump" | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-$KeepDays) } | Remove-Item -Force
}

Log "Backup successful: $local"
Exit 0
