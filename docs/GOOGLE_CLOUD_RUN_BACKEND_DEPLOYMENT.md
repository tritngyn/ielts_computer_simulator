# Deploy the NestJS backend to Google Cloud Run

The repository contains two independently deployed applications:

```text
GitHub repository
  |-- frontend/** -> Vercel -> Next.js
  `-- backend/**  -> Cloud Build -> Cloud Run -> NestJS
```

Both platforms may receive the same GitHub push. Their configured root/build
directories decide which application they build. Cloud Run does not replace or
interfere with the existing Vercel project.

For explanations of the concepts and design choices used here, read
[`CLOUD_RUN_LEARNING_NOTES.md`](CLOUD_RUN_LEARNING_NOTES.md).

## 1. Vercel boundary

In the existing Vercel project, open **Settings -> Build and Deployment** and
set:

| Setting | Value |
| --- | --- |
| Root Directory | `frontend` |
| Framework Preset | Next.js |
| Production Branch | `main` |
| Build Command | Framework default (`next build`) |
| Output Directory | Framework default |

Enable the option to skip unaffected deployments for the Root Directory if it
is available. If Vercel still builds on backend-only commits, configure the
Ignored Build Step to build only when the current `frontend` directory changed.
This optimization is optional: with Root Directory set to `frontend`, Vercel
cannot accidentally run or publish the NestJS backend.

Do not create a second Vercel project for `backend`.

## 2. Connect GitHub to Cloud Run

In Google Cloud Console:

1. Open **Cloud Run -> Services**.
2. Choose **Connect repository** or **Continuously deploy from a repository**.
3. Select **Cloud Build** and connect GitHub when prompted.
4. Select repository `tritngyn/ielts_computer_simulator`.
5. Select branch `^main$`.
6. Choose **Dockerfile** as the build type.
7. Set the source/Dockerfile location to `backend/Dockerfile`. The directory
   containing that Dockerfile, `backend`, must be the Docker build context.
8. Continue to the Cloud Run service configuration.

Use these initial service values:

| Setting | Value |
| --- | --- |
| Service name | `ai-eo-api` |
| Region | `asia-southeast1` (Singapore) |
| Authentication | Allow public access |
| Container port | `8080` |
| CPU | 1 vCPU |
| Memory | 512 MiB |
| Minimum instances | 0 |
| Maximum instances | 3 |
| Concurrency | 40 |
| Request timeout | 60 seconds |
| Runtime service account | `ai-eo-runtime@ieltsbackend-507207.iam.gserviceaccount.com` |

Public Cloud Run invocation only makes the API reachable from the website.
Protected NestJS routes still verify Supabase JWTs.

Google creates and owns the Cloud Build trigger. Accept only the IAM grants the
Console explicitly requires for building an image and deploying this service.
The Cloud Build identity does not need permission to read application secrets.

## 3. Runtime configuration and secrets

Add these normal environment variables to the Cloud Run service:

| Variable | Value |
| --- | --- |
| `NODE_ENV` | `production` |
| `ALLOWED_ORIGINS` | `https://ielts-simulator.vercel.app` |

Map these existing Secret Manager resources to environment variables:

| Environment variable | Secret | Version |
| --- | --- | --- |
| `DATABASE_URL` | `ai-eo-database-url` | `latest` |
| `DIRECT_URL` | `ai-eo-direct-url` | `latest` |
| `SUPABASE_JWT_SECRET` | `ai-eo-supabase-jwt-secret` | `latest` |

The runtime service account must have **Secret Manager Secret Accessor** for
these three secrets. The running API uses the pooled database URL. The direct
URL is reserved for controlled Prisma migrations.

## 4. Avoid duplicate deployments

The repository intentionally does not contain a GitHub Actions workflow that
deploys Cloud Run. The Google-managed Cloud Build trigger is the single backend
deployment path:

```text
push to main -> Cloud Build trigger -> Docker build -> new Cloud Run revision
```

If a Workload Identity pool or deploy service account was created while trying
the previous GitHub Actions approach, it is not required by this flow. Keep it
temporarily until the first Cloud Build deployment succeeds; remove unused IAM
resources later as a separate, explicitly reviewed cleanup task.

After the trigger is created, open **Edit repo settings** in Cloud Run or edit
the trigger in Cloud Build and add an included-files filter for `backend/**` if
the generated trigger supports it. Without this optimization, frontend-only
pushes can rebuild the same backend; they do not change which code Cloud Run
runs.

## 5. Connect the frontend to the API

After the first successful deployment, copy the Cloud Run service URL and add
this Vercel Production environment variable:

```text
NEXT_PUBLIC_API_URL=https://<cloud-run-service-url>
```

Redeploy the frontend after changing an environment variable. Add explicit
Vercel preview origins to `ALLOWED_ORIGINS` only when previews need production
API access. Do not allow every `*.vercel.app` origin.

## 6. Verify the deployment

Cloud Run injects `PORT`; NestJS listens on that port and `0.0.0.0`. Verify:

```text
GET https://<cloud-run-service-url>/health/live
GET https://<cloud-run-service-url>/health/ready
```

`live` confirms the process responds. `ready` also performs a lightweight
PostgreSQL query and should return HTTP 200 with `database: connected`.

Then test one public API route and one protected route from the Vercel site.
Inspect Cloud Build History for image-build errors and Cloud Run Logs for
application startup or database errors.

## 7. Cost control and rollback

Create a billing budget with email alerts. A budget is not a hard spending cap,
so keep minimum instances at zero and maximum instances bounded while learning.

Every successful deployment creates an immutable Cloud Run revision. To roll
back, open the service's **Revisions** view and route 100% of traffic to the last
known-good revision. Application rollback does not undo a database migration.
