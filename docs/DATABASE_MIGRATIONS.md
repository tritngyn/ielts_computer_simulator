# Prisma migration and production baseline runbook

This runbook versions the PostgreSQL schema used by Supabase. It does not move
the application to another database and does not copy application data between
providers.

## Environment hygiene

Use exactly one local environment file: `backend/.env`. Do not keep a second
`backend/prisma/.env`; Prisma reports conflicts when the same variables are
defined in both locations. Move any required values into `backend/.env`, verify
the application, and then remove the duplicate local file. Both paths are
ignored by Git and must never be committed.

Runtime requests use `DATABASE_URL` with the Supabase pooler. Prisma migrations
use `DIRECT_URL`. Never print either value in logs or screenshots.

## What has been baselined

The committed baseline is:

```text
backend/prisma/migrations/20260902000000_baseline/migration.sql
```

It is the SQL required to create the current schema in an empty PostgreSQL
database. The production Supabase database already has these tables, so do not
execute this table-creation SQL against production.

## 1. Create and verify a backup

Before modifying production migration metadata, create a logical backup with a
PostgreSQL client version compatible with Supabase:

```bash
pg_dump "$DIRECT_URL" \
  --format=custom \
  --no-owner \
  --no-privileges \
  --file="ai-eo-before-prisma-baseline.dump"
```

The backup is not verified until it can be restored into a temporary database:

```bash
createdb ai_eo_restore_check
pg_restore \
  --dbname=ai_eo_restore_check \
  --no-owner \
  --no-privileges \
  ai-eo-before-prisma-baseline.dump
```

Store the dump outside Git and record its location and restore result in the
private deployment log, not in the public repository.

## 2. Inspect production drift

From `backend/`, compare the live database with the committed Prisma schema:

```bash
npx prisma migrate diff \
  --from-url "$DIRECT_URL" \
  --to-schema-datamodel prisma/schema.prisma \
  --script
```

No executable SQL should be produced when the schemas match. If SQL is produced,
stop and review each difference. Do not mark the baseline applied until drift is
understood and either reflected in `schema.prisma` or deliberately corrected.

## 3. Verify the history on an empty database

Create a disposable PostgreSQL database, point both URLs at it, then run:

```bash
npm run prisma:migrate:deploy
npm run prisma:seed
npm run prisma:migrate:status
```

Expected result:

- all four current tables are created;
- `_prisma_migrations` contains `20260902000000_baseline`;
- the demo test `demo-reading-001` exists exactly once even after running the seed twice;
- migration status reports no pending migration.

Never use the production URL for this empty-database test.

## 4. Register the baseline on existing production

Only after backup, restore verification, and zero unexplained drift:

```bash
npx prisma migrate resolve \
  --applied 20260902000000_baseline

npm run prisma:migrate:status
```

`migrate resolve --applied` inserts migration metadata. It does not execute the
baseline's `CREATE TABLE` statements and does not rewrite application rows.

## 5. Future schema changes

Development:

```bash
npm run prisma:migrate:dev -- --name <descriptive_name>
```

Review both `schema.prisma` and generated SQL. Test on an empty database and on a
restored production-like database. Production releases later run:

```bash
npm run prisma:migrate:deploy
```

Use expand-migrate-contract for changes that overlap old and new Cloud Run
revisions. Prefer a forward-fix migration over deleting or editing a migration
that has already been applied.
