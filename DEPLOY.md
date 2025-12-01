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