# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains a Luxury Lifestyle Dashboard as the main artifact.

## Stack

- **Monorepo tool**: pnpm workspaces (internal), npm-compatible for the dashboard
- **Node.js version**: 24
- **Package manager**: pnpm (workspace), npm (luxury-dashboard standalone)
- **TypeScript version**: 5.9
- **API framework**: Express 5 (api-server artifact)
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle for API server), Vite (frontend)

## Quick Start (npm)

From the project root, run:

```bash
npm start
```

This installs dependencies in `artifacts/luxury-dashboard` and starts the Vite dev server on port 3000.

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server
│   ├── luxury-dashboard/   # Luxury Lifestyle Dashboard (React + Vite)
│   └── mockup-sandbox/     # UI prototyping sandbox
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml     # pnpm workspace config
├── tsconfig.base.json      # Shared TS options
├── tsconfig.json           # Root TS project references
└── package.json            # Root package — "npm start" runs the dashboard
```

## Luxury Dashboard

- Location: `artifacts/luxury-dashboard/`
- Standalone npm project — no workspace:* dependencies
- All deps use real version numbers (no pnpm catalog: entries)
- Vite config uses defaults: PORT=3000, BASE_PATH=/ when env vars not set
- `npm start` from root: installs deps + starts dev server
- Replit preview: workflow runs `npm install && npm run dev` from within the artifact dir

## TypeScript & Composite Projects

Every library package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all library packages as project references.

- **Always typecheck from the root** — run `pnpm run typecheck`
- **`emitDeclarationOnly`** — only emit `.d.ts` files during typecheck

## Root Scripts

- `npm start` — installs luxury-dashboard deps and starts the dev server
- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references
