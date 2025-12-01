#!/usr/bin/env bash
# CI-friendly non-interactive backup and migration script
# Usage: backup_and_migrate_ci.sh [--db-container NAME] [--backend-container NAME] [--run-migrations]

set -euo pipefail

DB_CONTAINER="dale_db"
BACKEND_CONTAINER="dale_backend"
RUN_MIGRATIONS=false
KEEP_DAYS=30
OUTPUT_DIR="./backups"

while [[ $# -gt 0 ]]; do
  case $1 in
    --db-container) DB_CONTAINER="$2"; shift 2;;
    --backend-container) BACKEND_CONTAINER="$2"; shift 2;;
    --run-migrations) RUN_MIGRATIONS=true; shift;;
    --keep-days) KEEP_DAYS="$2"; shift 2;;
    --output-dir) OUTPUT_DIR="$2"; shift 2;;
    *) echo "Unknown arg: $1" >&2; exit 1;;
  esac
done

mkdir -p "$OUTPUT_DIR"

echo "[ci-backup] using DB container: $DB_CONTAINER"

if ! docker ps --format "{{.Names}}" | grep -q "^$DB_CONTAINER$"; then
  echo "[ci-backup] DB container not running; attempting docker-compose up -d postgres"
  docker-compose up -d postgres
  sleep 2
  if ! docker ps --format "{{.Names}}" | grep -q "^$DB_CONTAINER$"; then
    echo "DB container not available: $DB_CONTAINER" >&2
    exit 2
  fi
fi

timestamp=$(date -u +%Y%m%d%H%M%S)
remote="/tmp/dale-backup-$timestamp.dump"
local="$OUTPUT_DIR/dale-backup-$timestamp.dump"

echo "[ci-backup] Creating dump inside $DB_CONTAINER"
docker exec -t "$DB_CONTAINER" sh -c "pg_dump -U joao -Fc dale_db -f $remote"

echo "[ci-backup] Copying to host: $local"
docker cp "$DB_CONTAINER:$remote" "$local"
docker exec -t "$DB_CONTAINER" rm -f "$remote"

if [ "$RUN_MIGRATIONS" = true ]; then
  echo "[ci-backup] Running migrations in $BACKEND_CONTAINER"
  if ! docker ps --format "{{.Names}}" | grep -q "^$BACKEND_CONTAINER$"; then
    echo "Starting backend container"
    docker-compose up --no-deps --build -d backend
    sleep 3
  fi
  docker exec -t "$BACKEND_CONTAINER" sh -c 'npx prisma migrate deploy && npx prisma generate'
fi

if [ "$KEEP_DAYS" -gt 0 ]; then
  echo "[ci-backup] Removing old backups older than $KEEP_DAYS days"
  find "$OUTPUT_DIR" -name '*.dump' -mtime +$KEEP_DAYS -print -delete || true
fi

echo "[ci-backup] Backup created: $local"
