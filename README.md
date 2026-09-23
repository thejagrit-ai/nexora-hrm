# NEXORA HR

NEXORA HR is one unified HRM application for core HR, attendance, leave, recruitment, payroll, employee self-service, and administration.

The repository has one web application and three internal API packages. Users never switch products or frontends: recruitment and payroll screens live inside the same navigation, session, and design system as Core HR.

## Repository layout

```text
apps/
  web/             One React frontend for every HRM module
  core-api/        Identity, employees, attendance, leave, and platform API
  recruit-api/     Recruitment business engine
  payroll-api/     Payroll business engine
packages/
  core-shared/     Core contracts and validation
  recruit-shared/  Recruitment contracts
  payroll-shared/  Payroll contracts and calculations
database/          Database maintenance scripts
docs/              Product and engineering documentation
e2e/               End-to-end tests
infra/             Local infrastructure and container configuration
```

## Requirements

- Node.js 20 or newer
- pnpm 9 or newer
- MySQL 8
- Redis 7 (needed by queued/background features)

## Setup

```bash
pnpm install
```

Copy `.env.example` to `.env` and configure the database and service settings. API-specific examples also live in each API package.

Initialize all databases from the repository root:

```bash
pnpm db:migrate
pnpm db:seed
```

## Development

Start the complete HRM with one command:

```bash
pnpm dev
```

The single web application runs at `http://localhost:5173`. Its development proxy connects internally to:

- Core API: `http://localhost:3000`
- Payroll API: `http://localhost:4000`
- Recruitment API: `http://localhost:4500`

Useful focused commands:

```bash
pnpm dev:web
pnpm dev:apis
pnpm build
pnpm build:all
pnpm typecheck
pnpm test
```

`pnpm build` creates the deployable unified web app. `pnpm build:all` validates every shared package and API as well.

## Architecture rule

There is exactly one user-facing frontend: `apps/web`. Payroll and recruitment remain separate internal API packages because their business logic, compliance rules, and data schemas are specialized, but they are part of this workspace and are consumed only through the unified HRM shell.

Authentication is issued by the Core API. The web shell exchanges that identity internally when it calls the payroll and recruitment APIs, so users keep one login and one continuous navigation experience.

## Deployment

The root `vercel.json` builds `apps/web`. Deploy the three API packages from the same revision and provide their URLs through the platform environment. Do not deploy additional payroll or recruitment frontends; they were intentionally removed during consolidation.

## License

GPL-3.0. See [LICENSE](LICENSE).
