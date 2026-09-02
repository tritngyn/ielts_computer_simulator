# Backend Production Build Tracker

This is the single active tracker for making the IELTS Computer Simulator
backend ready for a senior-engineer portfolio review.

## Status legend

- `TODO`: not started
- `IN PROGRESS`: being implemented in the current stage
- `BLOCKED`: needs an external decision, credential, or production action
- `DONE`: implemented and verified with evidence

## Current architecture

```text
Browser
  -> Next.js frontend on Vercel
     -> NestJS REST API on Google Cloud Run (asia-northeast1)
        -> Prisma -> Supabase PostgreSQL
        -> Supabase Auth JWT
        -> Supabase Storage

GitHub main push
  -> Google Cloud Build
     -> build backend/Dockerfile
     -> container image in Artifact Registry
     -> immutable Cloud Run revision
```

Backend scope: validation, authorization, grading, persistence, API contracts,
tests, observability, and delivery. AI features, admin tools, and analytics are
deferred.

## Stage history

### M0 — Documentation and current-state baseline — IN PROGRESS

- [x] Replace the previous broad roadmap with this backend-focused tracker.
- [x] Document the current Vercel -> Cloud Run -> Supabase architecture.
- [x] Rewrite the root and backend READMEs.
- [x] Correct Cloud Run documentation to `asia-northeast1` (Tokyo).
- [x] Explain Connect Repository, Cloud Build, Docker images, revisions, and rollback.
- [x] Document Prisma migration history and production baseline workflow.
- [ ] Record the production URL, healthy revision, image digest, trigger identity,
      and runtime service account.

Evidence:

- Repository documentation links are listed in the root README.
- Local GCP inventory is blocked because Google Cloud CLI is not installed. Run
  the inventory commands in Cloud Shell and add the results to the evidence log.

Acceptance criteria:

- A reviewer can understand the system, run both applications locally, and
  explain the delivery path without relying on chat history.
- Documentation contains no Singapore-region or direct-source execution claims.

### M1 — Request foundation and API v1 — DONE

- [x] Add global DTO validation with whitelist and rejection of unknown fields.
- [x] Replace untyped request bodies with validated DTOs.
- [x] Add `/api/v1`; keep legacy routes for one transition release.
- [x] Standardize errors as `{ error: { code, message, details?, requestId } }`.
- [x] Standardize collections as `{ data, pageInfo }` with cursor pagination.
- [x] Add Helmet, explicit CORS allowlist, request IDs, and a basic quality gate.

Implementation notes:

- V1 controllers were added beside unchanged legacy controllers so old deployed
  frontend revisions do not fail immediately.
- The active frontend now calls `/api/v1` and unwraps collection envelopes.
- Attempt, comment, and profile request bodies use validated DTOs; unknown fields
  are rejected globally.
- Request IDs are returned in response headers and error envelopes. HTTP logs
  contain method, path, status, and duration without logging bodies or tokens.
- GitHub Actions now runs lint, typecheck, unit tests, and both production builds.
- Client-owned score fields intentionally remain in M1 for compatibility. M3 is
  the security boundary change that removes them and moves grading to NestJS.

Acceptance criteria:

- Invalid or extra fields receive a predictable HTTP 400 response.
- Legacy clients remain usable during the documented transition window.
- Lint, typecheck, tests, and build pass before this stage is committed.

### M2 — Prisma migration baseline and data safety — TODO

- [ ] Export a logical backup of the current Supabase database.
- [ ] Compare the live schema with `prisma/schema.prisma` and resolve drift.
- [ ] Generate and review an initial baseline migration.
- [ ] Prove the history can create a new empty test database.
- [ ] Mark the baseline applied on the existing production database.
- [ ] Consolidate seed scripts into one idempotent seed command.

Acceptance criteria:

- `prisma migrate deploy` can reproduce the schema on an empty PostgreSQL database.
- Production rows are unchanged by the baseline operation.
- `_prisma_migrations` records the reviewed baseline.

### M3 — Server-owned grading — TODO

- [ ] Separate public test content from the private answer key with an
      expand-migrate-contract rollout.
- [ ] Backfill existing JSON without losing production data.
- [ ] Ensure public test APIs never serialize an answer key.
- [ ] Accept only test ID, answers, mode, and elapsed time on submission.
- [ ] Calculate score and total questions inside NestJS.
- [ ] Add idempotent submission handling.
- [ ] Update the frontend to trust the server result, then remove the legacy flow.

Acceptance criteria:

- Sending client-controlled `score`, `totalQuestions`, or `userId` is rejected.
- The same idempotency key cannot create duplicate attempts.
- Reading test data never reveals the private answer key.

### M4 — Authentication and authorization — TODO

- [ ] Verify Supabase JWTs through JWKS.
- [ ] Validate algorithm, issuer, audience, and expiry.
- [ ] Add typed current-user claims.
- [ ] Enforce ownership in attempt, profile, and comment queries.
- [ ] Test invalid tokens and cross-user resource access.

Acceptance criteria:

- An authenticated user cannot read or mutate another user's private resources.
- The backend never trusts a user ID supplied in a request body.

### M5 — OpenAPI and stable contracts — TODO

- [ ] Publish Swagger UI at `/api/docs`.
- [ ] Publish the machine-readable contract at `/api/openapi.json`.
- [ ] Document Bearer JWT security, DTOs, pagination, and error responses.
- [ ] Add an OpenAPI contract test for critical routes and schemas.

Acceptance criteria:

- A reviewer can understand and exercise API v1 from Swagger without reading controllers.
- Protected operations remain protected when invoked from Swagger.

### M6 — Tests, observability, and abuse controls — TODO

- [ ] Unit-test grading, validation, and authorization policies.
- [ ] Add Prisma integration tests against isolated PostgreSQL.
- [ ] Add the authenticated test-submission E2E flow.
- [ ] Emit structured request logs without secrets, tokens, bodies, or answer keys.
- [ ] Add rate limits and retain `/health/live` and `/health/ready`.
- [ ] Replace the service-role keep-alive workflow with a Cloud Run readiness monitor.

Acceptance criteria:

- Critical business paths have unit, integration, and E2E evidence.
- Every error can be correlated by request ID.

### M7 — Production delivery and cloud cleanup — TODO

- [ ] Control the Connect Repository trigger through `cloudbuild.yaml`.
- [ ] Run lint, typecheck, and tests before image build.
- [ ] Build and push the Docker image tagged with the commit SHA.
- [ ] Run `prisma migrate deploy` in a dedicated Cloud Run migration job.
- [ ] Deploy only after migration success and smoke-test readiness.
- [ ] Inventory dependencies before deleting old IAM, WIF, or image repositories.

Acceptance criteria:

- A failing quality gate or migration prevents deployment.
- The running revision is traceable to a Git commit and immutable image digest.
- No production resource is deleted without separate approval.

### M8 — Portfolio release — TODO

- [ ] Add architecture and request-flow diagrams.
- [ ] Add ADRs for Cloud Run, Supabase, grading, and migrations.
- [ ] Publish CI, production API, and Swagger evidence in the README.
- [ ] Document the Prisma P1001 startup incident and root-cause analysis.
- [ ] Perform a backup/restore drill and document service objectives and cost controls.

## Prisma migration history

`schema.prisma` describes the desired current schema. A migration history records
the ordered SQL changes that produced it:

```text
prisma/migrations/<timestamp>_<name>/migration.sql
```

The database table `_prisma_migrations` records which committed migrations have
run. This is schema versioning, not moving the application to another database,
and it is not a backup.

Use `prisma migrate dev` to create migrations locally and `prisma migrate deploy`
to apply committed migrations during a release. Do not use `prisma db push` as
the production release mechanism.

The existing Supabase database needs a baseline because it predates migration
history. After backup and drift inspection, generate the empty-to-current SQL,
test it on an empty database, then mark that migration as already applied on the
existing production database. Marking a baseline does not rerun table creation
SQL and does not modify existing rows.

### Senior review answers

**How was production created?** The repository cannot currently prove the full
history; it was likely created through `db push` or manual operations. M2 replaces
that ambiguity with a reviewed baseline and committed migrations.

**Can a new developer recreate it?** Not reliably yet. M2 is complete only when
an empty PostgreSQL instance can be created with `prisma migrate deploy` and the
idempotent seed command.

**How is a schema change rolled out?** Use expand-migrate-contract: add a
backward-compatible shape, backfill, deploy readers/writers, verify, then remove
the old shape in a later release.

**How is it rolled back?** A Cloud Run revision rollback is safe only while the
schema remains backward compatible. Prefer a forward-fix migration. Restore a
verified backup for destructive data loss; never delete an applied migration to
pretend it did not run.

## Decision log

| ID | Decision | Reason |
| --- | --- | --- |
| ADR-001 | Next.js on Vercel; NestJS on Cloud Run | Independent frontend/backend learning and deployment boundaries |
| ADR-002 | Supabase remains PostgreSQL/Auth/Storage | Stable infrastructure while NestJS owns business logic |
| ADR-003 | Keep Connect Repository | Simple GitHub integration managed inside Google Cloud |
| ADR-004 | Keep `backend/Dockerfile` | Connect Repository still builds and runs a container image |
| ADR-005 | Server owns grading | Prevent clients from choosing persisted scores |
| ADR-006 | Implement and review one stage per commit | Credible, reviewable Git history |

## Evidence log

| Date | Stage | Commit/revision | Evidence |
| --- | --- | --- | --- |
| 2026-09-02 | M0 | `e9d8897` | Documentation rewritten; GCP inventory pending Cloud Shell |
| 2026-09-02 | M1 | pending commit | Backend/frontend lint and typecheck pass; 7 unit tests pass; both production builds pass |

## Definition of Done

- The client cannot submit its own score or read private answer keys.
- Database history can reproduce an empty environment.
- Inputs, identity, ownership, API contracts, and errors are explicit and tested.
- A failed test or migration blocks a production release.
- Documentation matches the deployed region and delivery pipeline.
- Each stage has a focused commit and evidence entry before the next stage starts.

## Deferred backlog

- Full attempt lifecycle and resumable sessions
- AI-assisted feedback
- Admin content management
- Product analytics and experimentation
