# Deployment / Migration Guide (Backend)

This document explains safe steps to deploy the backend and apply Prisma migrations in a production environment.

IMPORTANT: Always backup your database before applying migrations in prod.

## 1) Backup database (Postgres example)

Replace DB_HOST, DB_PORT, DB_NAME, DB_USER with your environment values.

```powershell
# Dump an SQL backup to file
pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -Fc -f ./backups/dale-$(date -u +%Y%m%d%H%M%S).dump $DB_NAME
```

Or using docker:

```powershell
docker exec -t your_db_container pg_dump -U $DB_USER -Fc $DB_NAME > dale-backup-$(date -u +%Y%m%d%H%M%S).dump
```

## 2) Prepare the application on the server

- Make sure code is pulled from the correct branch.
- Ensure `.env` is correctly set (DATABASE_URL, JWT_SECRET, etc.)

## 3) Regenerate Prisma client & run migrations in **Production**

On the server (or CI), after pulling changes and ensuring `.env` points to the production DB and you made a backup, run:

```powershell
# install deps if needed
npm ci
# run database migrations (safe for production)
npm run prisma:migrate:prod
# regenerate client
npm run prisma:generate
# restart service (systemd, pm2, docker, etc.)
# example with pm2
pm run build
pm stop your-app || true
pm run start
```

> Note: `prisma migrate deploy` applies already-created migrations; it will not create new development-only ones. Make sure migrations in `migrations/` are the ones you want to run in prod.

## 4) Rollback guidelines

If a migration fails or you need to rollback a schema change, restore from the backup created in step 1 (e.g. `pg_restore`), and revert the code (checkout previous tag/commit) and restart services.

---

If you want I can create a GitHub Pull Request with these changes and prepare a release branch. I can also run `prisma migrate deploy` on a supplied remote environment if you grant me access/le me know the deployment environment (or run the commands yourself by copy-pasting the steps above).

## Local helper: backup + (optional) migrate script

To make safe backups and optionally run migrations locally using docker containers, the repository contains a helper script:

	backend/scripts/backup_and_migrate.ps1

This PowerShell script will:
- Create a compressed dump inside the `dale_db` container and copy it into `backend/backups/` with a timestamp
- Optionally run `npx prisma migrate deploy` and `npx prisma generate` inside the `dale_backend` container when you ask for it
- Remove old backup files older than a configurable number of days (defaults to 30)

Example usage (PowerShell):

```powershell
# create a timestamped backup only
./backend/scripts/backup_and_migrate.ps1

# create backup and apply migrations (will prompt for confirmation)
./backend/scripts/backup_and_migrate.ps1 -RunMigrations
```

Note: this helper uses docker/docker-compose so you do not need a host-side `pg_dump` client to create backups.

## CI / automation-friendly scripts

Two scripts are provided to make backups and optionally run migrations in CI pipelines (non-interactive):

- `backend/scripts/backup_and_migrate_ci.ps1` — PowerShell script friendly for Windows agents and GitHub Actions running Windows runners.
- `backend/scripts/backup_and_migrate_ci.sh` — Bash script for Linux-based runners.

Both scripts perform a compressed pg_dump inside the Postgres container and copy the dump to `backend/backups/`, then (optionally) apply migrations in the backend container.

Examples (non-interactive):

PowerShell (CI job):
```powershell
# create backup only
./backend/scripts/backup_and_migrate_ci.ps1

# create backup and run migrations
./backend/scripts/backup_and_migrate_ci.ps1 -RunMigrations
```

Bash (CI job):
```bash
# create backup only
./backend/scripts/backup_and_migrate_ci.sh

# create backup + migrations
./backend/scripts/backup_and_migrate_ci.sh --run-migrations
```

Make sure the CI runner has docker (and docker-compose if you rely on services from docker-compose) available and that container names align with the Compose file.

## Staging environment setup (recommended)

This repo includes a staging workflow that targets a protected `staging` environment in GitHub Actions (`.github/workflows/staging-backup-and-migrate.yml`).

To configure it:

1. In your repository settings -> Environments, create an environment named `staging` and configure required reviewers to protect it (this will require manual approval before the job runs).
2. Add a repository secret `STAGING_DATABASE_URL` with the staging database connection string.
3. When you run the workflow, choose whether to run migrations after backup. Manual approval is required to use the `staging` environment if you protected it.

Note on repo secrets and local dev
- Do NOT store secrets directly in `docker-compose.yml` or committed `.env` files. Instead:
	- Use a `.env` file locally (add sensitive values to `.env`) and ensure `.env` is in `.gitignore`.
	- In CI/staging/production use repository Secrets (Settings → Secrets) and reference them from workflows.
	- A `.env.example` file is included in the repository to document required variables without containing secrets.

This gives you a safe, auditable way to test backups and runs in staging with approval gates before applying anything to production.

## Preparing production migrations (safety checklist)

Before you apply migrations to production, follow this checklist:

1. Create a full, tested backup and verify the dump is restorable (use the `restore-verify` workflow above against staging).  
2. Protect the `production` environment in GitHub (Settings → Environments) and add `PRODUCTION_DATABASE_URL` as a secret. Require at least one reviewer for running the workflow.  
3. Use the manual workflow `Production — Backup + Migrate (manual with environment protection)` available in Actions. This will allow you to create a final backup and run `npx prisma migrate deploy` inside CI with the protected production secret.  
4. Monitor logs and, if anything goes wrong, restore from the verified backup using `pg_restore` and revert code.

When you are ready I can run the production workflow for you — I will NOT apply migrations without explicit confirmation and the target environment details.