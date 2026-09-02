# Google Cloud Run backend runbook

Operational runbook for the NestJS service `ai-eo-api` in project
`ieltsbackend-507207`.

## Deployment model

```text
push to main
  -> Cloud Run Connect Repository trigger
  -> Cloud Build checks out GitHub
  -> Cloud Build builds backend/Dockerfile with backend/ as context
  -> image is pushed to Artifact Registry
  -> Cloud Run creates an immutable revision
```

Connect Repository is the entry point, but the deployed artifact is still a
container image. Keep `backend/Dockerfile` and `backend/.dockerignore`.

## Service configuration

| Setting | Value |
| --- | --- |
| Project | `ieltsbackend-507207` |
| Service | `ai-eo-api` |
| Region | `asia-northeast1` (Tokyo) |
| Container port | `8080` |
| Ingress/auth at Cloud Run | Public invocation |
| Minimum instances | `0` |
| Maximum instances | `3` |
| Memory | `512 MiB` initially; adjust from metrics |

Public Cloud Run invocation does not make protected NestJS routes anonymous.
Those routes must still verify Supabase JWTs and ownership.

## Repository connection

- Repository: `tritngyn/ielts_computer_simulator`
- Branch regex: `^main$`
- Dockerfile: `/backend/Dockerfile`
- Build context: `/backend`
- Include filter when supported: `backend/**`

Vercel independently builds only `frontend/`. The same Git push may trigger both
platforms without mixing their runtime artifacts.

## Runtime configuration

Normal variables:

```text
NODE_ENV=production
ALLOWED_ORIGINS=https://ielts-simulator.vercel.app
```

Secret Manager mappings currently required by the deployed backend:

| Environment variable | Secret resource |
| --- | --- |
| `DATABASE_URL` | `ai-eo-database-url` |
| `DIRECT_URL` | `ai-eo-direct-url` |
| `SUPABASE_JWT_SECRET` | `ai-eo-supabase-jwt-secret` during the legacy JWT stage |

M4 will replace the shared JWT secret with `SUPABASE_URL` plus JWKS verification.
Do not remove the secret mapping before the new revision and Supabase signing-key
mode have been verified together.

The runtime service account needs Secret Manager access only to secrets consumed
by the application. Cloud Build does not need to read application secrets.

## Verification

After a deployment:

```bash
curl -fsS https://<service-url>/health/live
curl -fsS https://<service-url>/health/ready
```

Then verify one public test route and one authenticated route from the production
Vercel application. Record the commit SHA, image digest, revision, and health
result in `PRODUCTION_BUILD_PLAN.md`.

## Cloud inventory

Run in Google Cloud Shell before changing or deleting resources:

```bash
gcloud run services describe ai-eo-api \
  --project=ieltsbackend-507207 \
  --region=asia-northeast1 \
  --format='yaml(status.url,status.latestReadyRevisionName,spec.template.spec.serviceAccountName,spec.template.spec.containers[0].image)'

gcloud builds triggers list --project=ieltsbackend-507207
gcloud artifacts repositories list --project=ieltsbackend-507207
gcloud iam service-accounts list --project=ieltsbackend-507207
gcloud iam workload-identity-pools list \
  --project=ieltsbackend-507207 \
  --location=global
```

Keep the repository containing the current image, the trigger identity, runtime
identity, service, and secrets. Delete `ai-eo-deploy`, an old Workload Identity
provider, or a custom `ai-eo` image repository only after the inventory proves
the current trigger and revision do not reference them. Resource deletion is a
separate approval step.

## Rollback

Route traffic back to the last known-good Cloud Run revision. This rolls back
application code and configuration, not database changes. Database changes must
remain backward compatible; otherwise use a reviewed forward-fix or restore a
verified backup after stopping writes.

## Troubleshooting

- `path "backend" not found`: the branch/commit did not contain the backend
  directory or the trigger used the wrong context.
- Container did not listen on `PORT=8080`: inspect revision logs; NestJS must
  listen on `process.env.PORT` and `0.0.0.0`.
- Prisma `P1001`: verify the real database hostname, pooler port, secret version,
  network reachability, and runtime secret mapping.
- CORS failure: add the exact Vercel origin to `ALLOWED_ORIGINS`; CORS is not an
  authentication replacement.
