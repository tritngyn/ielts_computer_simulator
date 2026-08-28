# IELTS Computer Simulator

IELTS Computer Simulator is a client-server monorepo for practising computer-delivered IELTS tests.

## Architecture

```text
Browser
  -> Next.js frontend (port 3000)
  -> NestJS REST API (port 3001)
  -> Prisma
  -> Supabase PostgreSQL

Supabase Auth
  -> Next.js manages the session
  -> Bearer access token
  -> NestJS verifies the token
```

| Area | Technology | Directory |
| --- | --- | --- |
| Frontend | Next.js 16, React 19, Tailwind CSS, Zustand | `frontend/` |
| Backend | NestJS 11, Passport JWT, Prisma | `backend/` |
| Database/Auth/Storage | Supabase | External service |
| Build plan | Living production roadmap | `docs/PRODUCTION_BUILD_PLAN.md` |

Prisma and database access belong to the backend. The frontend communicates with the backend through REST APIs.

## Prerequisites

- Node.js `22.15.0`
- npm `10.9.2`
- A Supabase project with PostgreSQL, Auth and Storage configured

The repository includes `.nvmrc` and `.node-version`. If your version manager supports either file, activate the pinned Node version before installing dependencies.

Verify the toolchain:

```bash
node --version
npm --version
```

## Clean setup

1. Clone the repository and enter its root directory.
2. Activate Node.js `22.15.0`.
3. Create local environment files:

   ```bash
   cp frontend/.env.example frontend/.env.local
   cp backend/.env.example backend/.env
   ```

   On PowerShell:

   ```powershell
   Copy-Item frontend/.env.example frontend/.env.local
   Copy-Item backend/.env.example backend/.env
   ```

4. Replace every placeholder with values from the intended Supabase environment.
5. Install exactly the dependency versions recorded in each lockfile:

   ```bash
   npm run install:all
   ```

6. Generate the Prisma client:

   ```bash
   npm --prefix backend exec prisma generate
   ```

7. Start the backend and frontend in two terminals:

   ```bash
   npm run dev:backend
   ```

   ```bash
   npm run dev:frontend
   ```

8. Open `http://localhost:3000`. The backend listens on `http://localhost:3001` by default.

## Root commands

| Command | Purpose |
| --- | --- |
| `npm run install:all` | Clean-install frontend and backend from their lockfiles |
| `npm run dev:frontend` | Start Next.js in development mode |
| `npm run dev:backend` | Start NestJS in watch mode |
| `npm run build` | Build backend, then frontend |
| `npm run lint` | Run non-mutating lint checks in both apps |
| `npm run typecheck` | Type-check both apps without emitting files |
| `npm test` | Run backend unit tests serially |
| `npm run test:e2e` | Run backend E2E tests serially |

Each application keeps its own `package-lock.json`. Run dependency installation from the root command above or use `npm --prefix <app>`; do not create a third root lockfile.

## Environment boundaries

- Variables prefixed with `NEXT_PUBLIC_` may be included in browser bundles. They must never contain privileged secrets.
- `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET` and database URLs are server-only.
- Use separate Supabase resources or credentials for development, test, staging and production.
- Never commit `.env`, `.env.local` or real credentials. Only `.env.example` templates belong in Git.

## Build verification

Before opening a pull request or deploying:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

The current production-hardening roadmap and task acceptance criteria are maintained in [`docs/PRODUCTION_BUILD_PLAN.md`](docs/PRODUCTION_BUILD_PLAN.md).

## Deployment principle

CI should install and build once. Production should start the already-built artifact instead of running dependency installation or compilation during every application startup. Database changes will use committed Prisma migrations and a release-stage `prisma migrate deploy` command after Phase P1.6 is completed.
