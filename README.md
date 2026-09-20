# NEXORA HR

> **"People. Process. Performance."**

NEXORA HR is an all-in-one, enterprise-grade Commercial Human Resource Management (HRM) SaaS platform. It seamlessly unifies Core HR & Workforce Administration, Talent Acquisition & Recruitment, and Multi-Currency Payroll Processing into a single, cohesive, modern platform experience.

---

## Table of Contents

- [Overview & Architecture](#overview--architecture)
- [Key Features](#key-features)
- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Development Startup](#development-startup)
- [Production Build](#production-build)
- [Authentication & Single Sign-On (SSO)](#authentication--single-sign-on-sso)
- [Multi-Tenancy & Security](#multi-tenancy--security)
- [Role-Based Access Control (RBAC)](#role-based-access-control-rbac)
- [Testing & Verification](#testing--verification)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Open Source Attributions & Licensing](#open-source-attributions--licensing)

---

## Overview & Architecture

NEXORA HR operates on a unified single-frontend shell (`http://localhost:5173`) powered by three microservice backend engines running on dedicated local ports:

```
                          ┌──────────────────────────┐
                          │   NEXORA HR Web Shell    │
                          │   http://localhost:5173   │
                          └─────────────┬────────────┘
                                        │
           ┌────────────────────────────┼────────────────────────────┐
           │                            │                            │
           ▼                            ▼                            ▼
┌──────────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐
│   NEXORA Cloud Core  │    │   NEXORA Recruit     │    │   NEXORA Payroll     │
│   http://localhost:3000   │    │   http://localhost:4500   │    │   http://localhost:4000   │
└──────────┬───────────┘    └──────────┬───────────┘    └──────────┬───────────┘
           │                           │                           │
           ▼                           ▼                           ▼
┌──────────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐
│ MySQL DB: empcloud   │    │ MySQL: emp_recruit   │    │ MySQL: emp_payroll   │
└──────────────────────┘    └──────────────────────┘    └──────────────────────┘
```

### Module Distribution
1. **Core HR (`emp-cloud-core`)**: User directory, organization management, attendance tracking, shift scheduling, leave policies, document vault, biometrics, helpdesk, announcements, and platform administration.
2. **Recruitment Module (`emp-recruit`)**: Job openings, applicant tracking system (ATS), candidate pipeline Kanban board, interview scheduling, and job offer generation.
3. **Payroll Module (`emp-payroll`)**: Salary structure definitions, compensation packages, tax withholding compliance, monthly payroll runs, and employee payslip generation.

---

## Key Features

- **Single Sign-On (SSO)**: RSA RS256 token verification with background ticket exchange for zero-friction navigation between modules.
- **Strict Multi-Tenancy**: Tenant context (`empcloudOrgId` / `organization_id`) enforced at the API database level across all queries.
- **Granular RBAC**: Role gates for Super Admin, Org Admin, HR Admin, HR Manager, Recruiter, Payroll Admin, Manager, and Employee.
- **Employee Self-Service**: Employee portal for viewing own profile, submitting leave requests, checking attendance, and downloading payslips.
- **Modern Design System**: Sleek modern UI inspired by Stripe, Linear, and Vercel aesthetics with dark and light theme toggles.

---

## Prerequisites

- **Node.js**: `v18.x` or `v20.x`
- **pnpm**: `v8.x` or `v9.x` (`npm i -g pnpm`)
- **MySQL**: `v8.0+` running on `localhost:3306`

---

## Environment Configuration

Copy the example environment files in each package:

```bash
# Core Server
emp-cloud-core/packages/server/.env

# Recruit Server
emp-recruit/packages/server/.env

# Payroll Server
emp-payroll/packages/server/.env
```

Ensure the following default values match your environment:
- **Core Server Port**: `3000`
- **Recruit Server Port**: `4500`
- **Payroll Server Port**: `4000`
- **Client Dev Port**: `5173`
- **MySQL Credentials**: `root` with password `""` (or as configured in `.env`).

---

## Database Setup

Initialize the three required MySQL databases:

```sql
CREATE DATABASE IF NOT EXISTS empcloud;
CREATE DATABASE IF NOT EXISTS emp_recruit;
CREATE DATABASE IF NOT EXISTS emp_payroll;
```

Run database migrations and seed scripts:

```bash
# Seed Cloud Core
cd emp-cloud-core/packages/server
pnpm db:migrate
pnpm db:seed

# Seed Recruit
cd ../../../emp-recruit/packages/server
pnpm db:migrate
pnpm db:seed

# Seed Payroll
cd ../../../emp-payroll/packages/server
pnpm db:migrate
pnpm db:seed
```

---

## Development Startup

Start the entire NEXORA HR platform (All 3 Backend APIs + Client Web Shell) from the project root:

```bash
# Start all dev servers concurrently
pnpm dev
```

The application will be accessible at:
👉 **`http://localhost:5173`**

### Pre-seeded Login Credentials:
- **Admin**: `admin@technova.com` / `Admin@123`
- **Employee**: `employee@technova.com` / `Employee@123`
- **Super Admin**: `superadmin@empcloud.com` / `SuperAdmin@123`

---

## Production Build

To compile production assets across all packages:

```bash
pnpm build
```

---

## Authentication & Single Sign-On (SSO)

NEXORA HR utilizes an RS256 asymmetric RSA keypair located at `emp-cloud-core/packages/server/keys/`.

1. **User Authentication**: User logs in at `http://localhost:5173/login`.
2. **Token Generation**: Cloud Core issues an RS256 JWT access token containing `sub`, `org_id`, and `role`.
3. **Module Exchange**: Behind the scenes, the web application requests an SSO ticket via `/api/v1/auth/sso/token` and exchanges it with Recruitment (`/api/recruit/auth/sso`) and Payroll (`/api/payroll/auth/sso`).
4. **API Requests**: Every module request passes verified claims, protecting cross-module data integrity.

---

## Multi-Tenancy & Security

Multi-tenancy is enforced **server-side** on all database queries:
- Every query includes `.where({ organization_id: user.org_id })` or `.where({ empcloud_org_id: user.empcloudOrgId })`.
- Cross-tenant requests attempt to access foreign organization data will return HTTP `403 Forbidden` or `404 Not Found`.

---

## Role-Based Access Control (RBAC)

Supported Roles:
1. **Super Admin**: Platform-wide tenant management and subscription administration.
2. **Org Admin / HR Admin**: Full administrative scope over organization employees, recruitment, and payroll.
3. **HR Manager / Recruiter / Payroll Admin**: Specialized access to recruitment pipelines and payroll runs.
4. **Employee**: Self-service portal for profile, attendance, leave, documents, and payslips.

---

## Testing & Verification

Run automated test suites across all integrated modules:

```bash
# Run Cloud Core tests
pnpm --filter @empcloud/server test

# Run Recruit tests
pnpm --filter @emp-recruit/server test

# Run Payroll tests
pnpm --filter @emp-payroll/server test
```

---

## Troubleshooting

### Common Issues & Fixes

1. **Port Conflicts**:
   - Ensure ports `3000`, `4500`, `4000`, and `5173` are not occupied by other software.
2. **RSA Keys Missing**:
   - Run `pnpm generate-keys` inside `emp-cloud-core/packages/server` if `keys/private.pem` is absent.
3. **Database Connection Error**:
   - Verify MySQL server is running on `127.0.0.1:3306`.

---

## Open Source Attributions & Licensing

NEXORA HR incorporates and builds upon the following open-source foundational projects:

1. **EMP Cloud Core** — [https://github.com/EmpCloud/EmpCloud](https://github.com/EmpCloud/EmpCloud)
   - *License*: MIT License (Copyright (c) EmpCloud Authors)
2. **EMP Recruit** — [https://github.com/EmpCloud/emp-recruit](https://github.com/EmpCloud/emp-recruit)
   - *License*: MIT License (Copyright (c) EmpCloud Authors)
3. **EMP Payroll** — [https://github.com/EmpCloud/emp-payroll](https://github.com/EmpCloud/emp-payroll)
   - *License*: MIT License (Copyright (c) EmpCloud Authors)

*All original copyright notices, license headers, and third-party notices contained within sub-packages remain preserved in compliance with their respective open-source licenses.*
