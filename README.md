# IELTS Computer Simulator

A portfolio project that separates a Next.js frontend from a NestJS backend so
application business rules can be designed, tested, and deployed independently.

## Architecture

```text
Next.js / Vercel
  -> NestJS / Google Cloud Run (Tokyo, asia-northeast1)
     -> Prisma -> Supabase PostgreSQL
     -> Supabase Auth and Storage
```

Google Cloud Run's **Connect Repository** flow checks out the GitHub commit and
uses Cloud Build to build `backend/Dockerfile`. The resulting container image is
stored in Artifact Registry and deployed as an immutable Cloud Run revision.
Connect Repository does not run the TypeScript source directly.

## Local development

Requirements: Node.js 22.15.x, npm 10.9.x, and a PostgreSQL/Supabase development
database.

```bash
npm run install:all
npm run dev:backend
npm run dev:frontend
```

Quality commands:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Never commit `.env` files, JWTs, database URLs, or Supabase service-role keys.

## Repository layout

```text
frontend/   Next.js application deployed by Vercel
backend/    NestJS API and Prisma schema deployed by Cloud Run
docs/       Production tracker, deployment runbook, and system design notes
```

## Documentation

- [Backend production tracker](docs/PRODUCTION_BUILD_PLAN.md)
- [Cloud Run deployment runbook](docs/GOOGLE_CLOUD_RUN_BACKEND_DEPLOYMENT.md)
- [Cloud Run learning notes](docs/CLOUD_RUN_LEARNING_NOTES.md)
- [Prisma migration runbook](docs/DATABASE_MIGRATIONS.md)
- [System-design notes](docs/backend-system-design/01-system-design-foundations.md)

The production tracker is the source of truth for stage status, acceptance
criteria, and review evidence.
