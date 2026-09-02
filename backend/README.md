# IELTS Simulator NestJS API

The backend owns API validation, Supabase identity verification, authorization,
grading, persistence, and operational health checks. It runs as a container on
Google Cloud Run.

## Setup

```bash
npm ci
cp .env.example .env
npm run start:dev
```

Use a pooled PostgreSQL URL for normal application traffic and reserve the
direct URL for controlled Prisma operations.

## Commands

```bash
npm run lint:check
npm run typecheck
npm test -- --runInBand
npm run test:e2e -- --runInBand
npm run build
npm run start:prod
npm run prisma:migrate:status
npm run prisma:seed
```

## Database workflow

`prisma/schema.prisma` is the desired current schema. Files under
`prisma/migrations/` are the ordered, committed SQL history.

```bash
npx prisma migrate dev --name <descriptive_name>
npx prisma migrate deploy
```

Do not use `prisma db push` as a production release mechanism. Do not run
migrations during NestJS startup. The existing Supabase database must be backed
up, checked for drift, and baselined before automated migrations are enabled.

Keep local variables only in `backend/.env`; a second `prisma/.env` conflicts
with Prisma CLI loading. See the complete
[migration runbook](../docs/DATABASE_MIGRATIONS.md) before touching production.

## API and health

- `/health/live`: process can answer HTTP.
- `/health/ready`: process can query PostgreSQL.
- `/api/docs`: planned public Swagger UI.
- `/api/openapi.json`: planned OpenAPI contract.

Protected routes require a Supabase Bearer JWT. Public Cloud Run invocation and
application authentication are separate security layers.

## Deployment

The GitHub repository connection invokes Cloud Build. Cloud Build uses this
directory as the Docker context, builds `Dockerfile`, stores the image in
Artifact Registry, and deploys an immutable Cloud Run revision. See the
[deployment runbook](../docs/GOOGLE_CLOUD_RUN_BACKEND_DEPLOYMENT.md).
