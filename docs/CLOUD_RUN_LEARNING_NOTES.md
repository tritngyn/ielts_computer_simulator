# Cloud Run learning notes

## What Cloud Run runs

Cloud Run runs containers. It does not replace NestJS or execute this project's
TypeScript files directly. NestJS still owns routes, validation, authentication,
authorization, and business rules.

Connect Repository is a convenience workflow:

```text
GitHub commit -> Cloud Build -> container image -> Artifact Registry -> Cloud Run revision
```

The exact Artifact Registry repository and image URI must be read from the
current trigger/revision rather than hard-coded in learning notes.

## Services and revisions

A service owns the stable URL, scaling settings, IAM, and traffic allocation. A
revision is an immutable deployment created when an image or configuration
changes. The traceability chain is:

```text
Git commit SHA -> Cloud Build record -> image digest -> Cloud Run revision
```

That chain is stronger portfolio evidence than a mutable `latest` image tag.

## Scale to zero

With minimum instances set to zero, Cloud Run can stop all instances while idle.
The first later request may experience a cold start. Keeping the service awake
reduces cold starts but weakens the scale-to-zero cost benefit, so any synthetic
monitor must be described as an availability/database-activity trade-off, not a
free performance optimization.

## Port and process lifecycle

Cloud Run injects `PORT`. NestJS must listen on that value and `0.0.0.0`, start
within the platform deadline, and handle termination cleanly. The production
container starts compiled JavaScript; compilation and migrations do not belong
in application startup.

## Health signals

- `/health/live` proves the HTTP process responds.
- `/health/ready` also proves PostgreSQL can answer a lightweight query.

A healthy liveness response with failed readiness usually points to a database
or dependency problem. Health responses must not expose credentials or internal
connection strings.

## Identity boundaries

- Cloud Build identity: build, push, and deploy.
- Runtime service account: read only the application secrets it needs.
- Migration-job identity: future dedicated access for schema deployment.
- Supabase JWT: identifies the application user at NestJS routes.

Public Cloud Run invocation answers “may this network caller reach the service?”
JWT verification answers “which application user is calling?” Authorization
answers “may this user access this resource?”

## Secrets and CORS

Secrets belong in Secret Manager, never in source, images, build logs, screenshots,
or health responses. `NODE_ENV` and the CORS allowlist are configuration rather
than secrets.

CORS restricts browser origins. It does not protect endpoints from server-side
clients, so sensitive operations still require JWT verification and ownership
checks.

## Prisma with Cloud Run

Runtime requests should use the Supabase pooled connection. Controlled migration
jobs use the appropriate direct connection. Limit Cloud Run instances with the
database connection budget in mind.

Prisma migrations version database structure. They do not mean moving data away
from Supabase. A safe release sequence is:

```text
quality checks -> build immutable image -> run reviewed migration job -> deploy -> smoke test
```

Old and new revisions may overlap, so schema changes should follow
expand-migrate-contract.

## Observability

Useful logs include request ID, method, route template, status, latency, revision,
and severity. Never log JWTs, database URLs, private answer keys, or full request
bodies. Monitor request/error rate, latency percentiles, cold starts, instance
count, startup failures, and database connectivity.
