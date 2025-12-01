param(
    [switch] $RunMigrations,
    [int] $KeepDays = 30
)

function Log($s) { Write-Host "[backup_and_migrate] $s" }

if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Error "Docker is not available in PATH. Install Docker Desktop or ensure 'docker' is on PATH."
    exit 1
}

Log "Ensuring backup folder exists: ./backups"
$backupDir = "$(Split-Path -Parent $MyInvocation.MyCommand.Definition)\..\backups" | Resolve-Path -Relative -ErrorAction SilentlyContinue
if (-not $backupDir) {
    $backupDir = Join-Path -Path (Split-Path -Parent $MyInvocation.MyCommand.Definition) -ChildPath '..\backups'
}
$backupDir = (Resolve-Path $backupDir).ProviderPath
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

$dbContainer = 'dale_db'
Log "Checking for container '$dbContainer'"
$containerFound = docker ps --format "{{.Names}}" | Where-Object { $_ -eq $dbContainer }
if (-not $containerFound) {
    Write-Warning "Container '$dbContainer' is not running. Attempting to start postgres service via docker-compose..."
    docker-compose up -d postgres
    Start-Sleep -Seconds 2
    $containerFound = docker ps --format "{{.Names}}" | Where-Object { $_ -eq $dbContainer }
    if (-not $containerFound) {
        Write-Error "Postgres container '$dbContainer' still not available. Aborting."
        exit 2
    }
}

$timestamp = (Get-Date).ToString('yyyyMMddHHmmss')
$remoteTmp = "/tmp/dale-backup-$timestamp.dump"
$localFile = Join-Path $backupDir "dale-backup-$timestamp.dump"

Log "Creating dump inside container $dbContainer at $remoteTmp"
docker exec -t $dbContainer sh -c "pg_dump -U joao -Fc dale_db -f $remoteTmp"
if ($LASTEXITCODE -ne 0) {
    Write-Error "pg_dump inside container failed. Check container logs and permissions."
    exit 3
}

Log "Copying dump from container to host: $localFile"
# ensure PowerShell doesn't misinterpret $container:$path as a variable with a drive-like token
docker cp "$($dbContainer):$remoteTmp" "$localFile"
if ($LASTEXITCODE -ne 0) {
    Write-Error "docker cp failed. The dump file may not have been copied correctly."
    exit 4
}

Log "Cleaning up temporary file inside container"
docker exec -t $dbContainer rm -f $remoteTmp

if ($RunMigrations) {
    # avoid non-ASCII em-dash which can cause parsing on older PowerShell; use plain hyphen
    Log "RunMigrations requested - will run Prisma migrations inside backend container (dale_backend)."
    $backendContainer = 'dale_backend'
    $backendFound = docker ps --format "{{.Names}}" | Where-Object { $_ -eq $backendContainer }
    if (-not $backendFound) {
        Log "Backend container '$backendContainer' is not running; attempting to start it (no-deps)"
        docker-compose up --no-deps --build -d backend
        Start-Sleep -Seconds 3
        $backendFound = docker ps --format "{{.Names}}" | Where-Object { $_ -eq $backendContainer }
        if (-not $backendFound) {
            Write-Error "Backend container '$backendContainer' unavailable. Cannot run migrations."
            exit 5
        }
    }

    $ans = Read-Host "Apply migrations now against the DB? Type 'YES' to continue"
    if ($ans -ne 'YES') {
        Log "Skipping migration because confirmation was not YES."
    } else {
        Log 'Running migrations: npx prisma migrate deploy && npx prisma generate'
        # Use single quotes around the sh -c payload so PowerShell does not try to parse '&&'
        docker exec -t $backendContainer sh -c 'npx prisma migrate deploy && npx prisma generate'
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Prisma migrate / generate failed. Check backend logs: docker logs $backendContainer"
            exit 6
        }
        Log "Migrations applied and client generated successfully."
    }
}

if ($KeepDays -gt 0) {
    Log "Removing backups older than $KeepDays days (from $backupDir)"
    Get-ChildItem -Path $backupDir -Filter "*.dump" | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-$KeepDays) } | ForEach-Object {
        Log "Deleting old backup: $($_.FullName)"
        Remove-Item $_.FullName -Force -ErrorAction SilentlyContinue
    }
}

Log "Backup complete: $localFile"
Write-Host "Done."
