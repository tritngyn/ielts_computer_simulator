# Google Cloud Run learning notes

These notes explain the Cloud Run concepts used to deploy the IELTS Computer
Simulator. They are intended as a learning companion to
[`GOOGLE_CLOUD_RUN_BACKEND_DEPLOYMENT.md`](GOOGLE_CLOUD_RUN_BACKEND_DEPLOYMENT.md),
which contains the operational deployment checklist.

## 1. Project architecture

```text
User browser
  -> Vercel
     -> Next.js frontend
  -> Google Cloud Run
     -> NestJS REST API container
        -> Prisma
           -> Supabase PostgreSQL
        -> Supabase JWT verification

GitHub push
  -> Google Cloud Build trigger
     -> Docker image
     -> Google Artifact Registry
     -> immutable Cloud Run revision

The same push can also notify Vercel. Vercel builds only `frontend/`, while the
Cloud Build trigger builds the Docker context in `backend/`.
```

Cloud Run does not replace NestJS. It supplies managed infrastructure that runs
the NestJS Docker container. NestJS still owns routing, validation,
authentication, authorization and business logic.

## 2. Why a container is used

A container packages the Node.js runtime, production dependencies, generated
Prisma client, compiled NestJS code and startup command into one immutable
artifact.

The same image is promoted into Cloud Run instead of compiling source code on
the production instance. This reduces differences between CI and production and
makes rollback deterministic.

This project uses a multi-stage Docker build:

1. Install all dependencies.
2. Generate Prisma Client during `npm ci`.
3. Compile TypeScript into `dist/main.js`.
4. Remove development dependencies.
5. Copy only production artifacts into the runtime stage.
6. Run the process as the non-root `node` user.

## 3. Cloud Run service and revision

A **service** is the stable logical API, for example `ai-eo-api`. It owns the
public URL, scaling configuration, IAM policy and traffic routing.

A **revision** is an immutable version of that service. Deploying a new image or
changing environment configuration creates a new revision. An older revision
can remain available for rollback.

Cloud Build associates each build with its source commit, while Cloud Run keeps
the deployed image digest and immutable revision. This creates traceability:

```text
Git commit SHA -> Cloud Build record -> image digest -> Cloud Run revision
```

Never rely only on a mutable `latest` tag for production rollback.

## 4. Request-based billing and scale-to-zero

The service uses request-based billing with:

| Setting           | Project value     | Reason                                          |
| ----------------- | ----------------- | ----------------------------------------------- |
| Minimum instances | `0`               | Scale to zero while idle                        |
| Maximum instances | `3`               | Limit cost and database connections             |
| CPU               | `1`               | Sufficient starting point for NestJS            |
| Memory            | `512 MiB`         | Sufficient starting point; measure after deploy |
| Concurrency       | `40`              | Bound concurrent requests per instance          |
| Timeout           | `60 seconds`      | Prevent unexpectedly long HTTP work             |
| Region            | `asia-southeast1` | Singapore, close to Vietnamese users            |

Scale-to-zero can cause a **cold start**: Cloud Run starts a new container before
serving the first request after an idle period. Startup time includes Node.js,
NestJS initialization and Prisma's initial database connection.

Do not use keep-alive bots merely to avoid cold starts. They defeat
scale-to-zero and distort observability. Measure real cold-start latency before
deciding whether a minimum instance is worth its cost.

## 5. Port and process lifecycle

Cloud Run injects the `PORT` environment variable. The application must:

- listen on `process.env.PORT`;
- listen on `0.0.0.0`, not only `localhost`;
- start within the platform startup deadline;
- handle termination signals and stop cleanly.

NestJS calls `app.enableShutdownHooks()` so Prisma and other providers can clean
up when an instance is terminated.

The production container starts the already-compiled application:

```text
node dist/main.js
```

It does not run TypeScript compilation or database migrations at application
startup.

## 6. Health endpoints

The API exposes two different signals:

| Endpoint        | Meaning                                |
| --------------- | -------------------------------------- |
| `/health/live`  | The NestJS process can respond to HTTP |
| `/health/ready` | The process can also query PostgreSQL  |

A liveness failure suggests the process is unhealthy. A readiness failure while
liveness succeeds usually suggests a database or external dependency problem.

Health responses must not expose credentials, full connection strings, stack
traces or internal infrastructure details.

## 7. Artifact Registry

Artifact Registry stores private Docker images. For this project:

```text
Region:     asia-southeast1
Repository: ai-eo
Image:      backend:<git-commit-sha>
```

The full image name follows this format:

```text
asia-southeast1-docker.pkg.dev/ieltsbackend-507207/ai-eo/backend:<sha>
```

Artifact Registry is not the running server. It is the versioned storage from
which Cloud Run obtains the selected image.

## 8. Service accounts and least privilege

The project separates the build/deployment identity from runtime identity.

### Cloud Build service account

It is used by the Google-managed repository trigger and needs permission to:

- build and store images;
- create and update Cloud Run revisions;
- deploy using the runtime service account.

It should not receive permission to read production application secrets merely
because it performs deployments.

### Runtime service account

```text
ai-eo-runtime@ieltsbackend-507207.iam.gserviceaccount.com
```

It is attached to running Cloud Run instances. It needs permission to access
only the secrets consumed by NestJS. It does not need permission to deploy or
push images.

This separation limits the impact if either identity is compromised.

## 9. GitHub connection and Cloud Build trigger

Cloud Run's **Connect repository** flow creates a Cloud Build trigger linked to
the GitHub repository. GitHub notifies Google of a matching push; Google then
checks out the source, builds the Dockerfile and deploys a revision.

This is simpler than maintaining a custom GitHub Actions workflow with Workload
Identity Federation. Authentication and the deployment runner remain inside
Google Cloud, so this repository needs no Google service-account key and no GCP
variables in GitHub Actions.

The trigger must be restricted to the production branch and backend source:

```text
Repository:     tritngyn/ielts_computer_simulator
Branch regex:   ^main$
Dockerfile:     backend/Dockerfile
Build context:  backend
Included files: backend/** (when supported by the generated trigger)
```

Branch protection remains important because merging into `main` becomes a
production deployment event.

## 10. Secret Manager

Production secrets are stored as versioned Secret Manager resources:

| Google secret               | Container environment variable |
| --------------------------- | ------------------------------ |
| `ai-eo-database-url`        | `DATABASE_URL`                 |
| `ai-eo-direct-url`          | `DIRECT_URL`                   |
| `ai-eo-supabase-jwt-secret` | `SUPABASE_JWT_SECRET`          |

`ALLOWED_ORIGINS` and `NODE_ENV` are configuration rather than credentials, so
they are normal environment variables.

Secrets must never be placed in:

- the Dockerfile;
- the Docker image;
- Git commits;
- Cloud Build logs;
- public health responses;
- screenshots or chat messages.

Secret versions support rotation. A new version can be added without changing
the secret resource name.

## 11. Public Cloud Run URL versus API authentication

The Cloud Run service allows unauthenticated invocation at the platform layer so
the public website can reach it. This does not mean every application endpoint
is anonymous.

Protected NestJS routes still require a Supabase Bearer token and enforce user
authorization inside the backend. These are different security layers:

```text
Cloud Run IAM: may this network caller invoke the service?
NestJS auth:   which application user is making the request?
Authorization: may this user access this resource?
```

Public read endpoints and health endpoints can remain unguarded intentionally.

## 12. CORS

CORS controls which browser origins may call the backend. Production currently
allows exactly:

```text
https://ielts-simulator.vercel.app
```

CORS is enforced by browsers; it is not authentication. Server-to-server
clients are not protected by CORS, so sensitive endpoints still require JWT and
authorization checks.

Avoid allowing every `*.vercel.app` preview because other or stale deployments
could then call the production API from a browser.

## 13. Prisma and Supabase connections

Cloud Run can start multiple instances, and each instance creates database
connections. `DATABASE_URL` therefore uses the Supabase pooled endpoint.

The maximum Cloud Run instance count is also a database safety control. Estimate
the worst-case connection count before increasing it.

`DIRECT_URL` exists for controlled Prisma migration operations. Application
deployments do not run migrations automatically yet because the repository does
not contain a reviewed migration history.

A safer future release sequence is:

```text
test -> build image -> reviewed migration job -> deploy revision -> verify
```

Schema changes must be backward-compatible while old and new revisions may both
receive traffic.

## 14. CI/CD stages

The current continuous-deployment path performs:

1. GitHub sends a `main` branch push event to Cloud Build.
2. Cloud Build checks out the commit.
3. Docker installs locked backend dependencies with `npm ci`.
4. Docker generates Prisma Client and compiles NestJS.
5. Cloud Build stores the image in Artifact Registry.
6. Cloud Run creates an immutable revision and moves traffic to it.

The Docker build verifies compilation but does not currently run the complete
type-check and unit-test suite as an independent CI gate. That is an intentional
trade-off of the simpler first-deployment path. Add a separate test-only CI job
or a reviewed `cloudbuild.yaml` before treating this as a mature production
pipeline.

## 15. Logging and observability

Cloud Run captures container stdout and stderr in Cloud Logging. Application
logs should eventually become structured JSON containing safe operational
fields such as:

- timestamp;
- severity;
- request ID;
- route template;
- status code;
- duration;
- authenticated user ID only when necessary and handled safely.

Do not log JWTs, database URLs, answer keys or request bodies containing private
data.

Useful production signals include:

- request count and error rate;
- p50/p95/p99 latency;
- cold-start latency;
- instance count;
- container startup failures;
- database connection errors;
- health-check failures.

## 16. Rollback and traffic

Cloud Run revisions are immutable and traffic can be reassigned between them.
An application rollback routes traffic to the last known-good revision.

Rollback does not automatically undo a database migration. This is why database
compatibility and reviewed migration procedures matter more than simply keeping
an old container image.

Cloud Run can also split traffic between revisions for canary releases, for
example 5% to a new revision and 95% to the stable revision.

## 17. Cost controls

Cost safety uses multiple controls:

- minimum instances set to zero;
- maximum instances capped at three;
- billing budget and email alerts;
- bounded request timeout;
- Artifact Registry cleanup policy in the future;
- log-retention review;
- monitoring outbound traffic to Supabase.

A billing budget is an alert, not a hard spending cap. Resource limits and
regular billing review remain necessary.

## 18. Current setup checklist

- [x] NestJS listens on injected `PORT` and `0.0.0.0`.
- [x] Graceful shutdown hooks enabled.
- [x] Production environment validation.
- [x] Restricted production CORS.
- [x] Liveness and readiness endpoints.
- [x] Multi-stage non-root Dockerfile.
- [x] Duplicate GitHub Actions deployment workflow removed.
- [x] Vercel/Cloud Run monorepo boundaries documented.
- [x] Cloud Run deployment and rollback documentation.
- [ ] Google APIs enabled.
- [ ] Artifact Registry repository created.
- [ ] Cloud Build and runtime service-account permissions verified.
- [ ] Least-privilege IAM roles assigned.
- [x] Three Secret Manager resources created.
- [ ] Enabled secret versions verified for all three resources.
- [ ] Runtime service account access verified for all three secrets.
- [ ] GitHub repository connected to Cloud Build.
- [ ] Trigger restricted to `main` and `backend/`.
- [ ] First container image built and pushed.
- [ ] First Cloud Run revision deployed.
- [ ] Vercel `NEXT_PUBLIC_API_URL` updated.
- [ ] Production health and authenticated API smoke tests completed.
- [ ] Billing budget and alerts configured.

### Setup evidence — 2026-08-31

The Google Cloud project `ieltsbackend-507207` contains these Secret Manager
resources, verified from Cloud Shell output:

```text
ai-eo-database-url
ai-eo-direct-url
ai-eo-supabase-jwt-secret
```

Listing a secret proves that its resource exists. It does not prove that an
enabled secret version contains the intended value or that the runtime service
account can access it. Those checks remain separate checklist items so secret
values never need to be printed.

### Deployment approach update — 2026-08-31

The project chose Cloud Run's direct **Connect repository** flow. The earlier
GitHub Actions/OIDC design was valid but added IAM and CI/CD concepts before the
first NestJS deployment. The Google-managed Cloud Build trigger is now the only
backend deployment path. Existing experimental Workload Identity or deploy
service-account resources, if any, are intentionally left untouched until the
first successful deployment proves they are unused.

## 19. Follow-up improvements

After the first deployment works, prioritize:

1. Commit an initial Prisma migration baseline.
2. Add DTO validation and global validation pipe.
3. Add structured logging and request IDs.
4. Add integration tests against a separate test database.
5. Add dependency and container vulnerability scanning.
6. Configure an Artifact Registry cleanup policy.
7. Measure cold starts and database connection usage.
8. Introduce staging before production traffic becomes important.
