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

## 2. Inspect production drift against the baseline snapshot

The active `schema.prisma` now includes M3, so comparing production directly to
that file is expected to show the new secure-grading columns. Reconstruct the
immutable M2 schema from its commit and compare production to that snapshot:

```bash
git show 7a702d5:backend/prisma/schema.prisma \
  > /tmp/ai-eo-baseline.prisma

npx prisma migrate diff \
  --from-url "$DIRECT_URL" \
  --to-schema-datamodel /tmp/ai-eo-baseline.prisma \
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
- `_prisma_migrations` contains the baseline and secure-grading migration;
- the secure-grading columns and indexes exist;
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
After this command, status must show only
`20260902010000_secure_grading_expand` as pending.

## 5. Validate and apply the M3 expand migration

Before applying M3, use the Supabase SQL editor to find tests that cannot be
graded. Any returned row blocks the release until its answer key is repaired:

```sql
SELECT "id", "title"
FROM "Test"
WHERE NOT ("content" ? 'answers')
   OR jsonb_typeof("content" -> 'answers') <> 'object'
   OR "content" -> 'answers' = '{}'::jsonb;
```

Apply committed pending migrations from `backend/`:

```bash
npm run prisma:migrate:deploy
npm run prisma:migrate:status
```

Verify the backfill before deploying the M3 backend:

```sql
SELECT
  COUNT(*) FILTER (WHERE "publicContent" IS NULL) AS missing_public_content,
  COUNT(*) FILTER (WHERE "answerKey" IS NULL) AS missing_answer_key,
  COUNT(*) FILTER (WHERE "publicContent" ? 'answers') AS leaked_answer_keys
FROM "Test";
```

All three counts must be zero. Also confirm `_prisma_migrations` records both
migrations without a failed entry. This expand migration keeps the legacy
`content` column, so the currently running backend remains compatible.

## M3 release order

Do not let the M3 Vercel frontend become production before the M3 Cloud Run
backend is healthy. The two GitHub integrations deploy independently.

1. Confirm Vercel has `NEXT_PUBLIC_API_URL` set to the production Cloud Run URL.
2. Hold Vercel production auto-deployment using the project's chosen release
   control; do not change preview deployments unnecessarily.
3. Complete the backup, baseline registration, M3 migration, and SQL checks above.
4. Push `main` and wait for GitHub Quality Gate and the Cloud Run revision.
5. Smoke-test `/health/ready`, public Reading/Listening responses, authenticated
   submission, retry with one idempotency key, and owned attempt retrieval.
6. Release the same commit to Vercel and run one browser submission.
7. Re-enable the normal Vercel production deployment policy.

If the backend fails after the additive migration, route traffic back to the
previous Cloud Run revision. Do not remove the new nullable columns during the
incident; diagnose and forward-fix them.

## 6. Future schema changes

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
