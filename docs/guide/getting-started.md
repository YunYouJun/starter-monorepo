# Getting Started

## Prerequisites

- Node.js `^22.18.0 || ^24.11.0 || >=26.0.0`
- pnpm `11.21.0` (pinned by the root `packageManager` field)

## Installation

### Clone the Repository

```bash
git clone https://github.com/YunYouJun/starter-monorepo.git
cd starter-monorepo
```

### Install Dependencies

```bash
pnpm install
```

## Project Structure

```
starter-monorepo/
├── apps/
│   └── web/                # Optional deployable Nuxt application
├── docs/                   # Documentation site
│   ├── .vitepress/        # VitePress config
│   ├── guide/             # English guides
│   ├── zh/guide/          # Chinese guides
│   ├── api/               # API docs (auto-generated)
│   └── public/            # Static assets
├── packages/
│   └── pkg-placeholder/   # Example package
│       ├── src/           # Source code
│       ├── test/          # Tests
│       ├── tsdown.config.ts # Build configuration
│       └── dist/          # Build output
├── package.json           # Root package.json
├── pnpm-workspace.yaml    # pnpm workspace config
└── tsconfig.json          # TypeScript config
```

### Optional Nuxt application

Use `apps/web` for a general deployable Nuxt application. The name `web`
describes its platform while leaving room for its role to grow and for sibling
applications such as `apps/mobile`, `apps/desktop`, or `apps/admin`.

Reserve `apps/site` for an explicitly content, marketing, or corporate website
that may coexist with a separate product web app. Avoid framework-based names
such as `apps/nuxt`; application directories should communicate their
responsibility or platform.

The workspace already includes the `apps/*` package glob. Once
`apps/web/package.json` exists, pnpm will discover it automatically. See the
[Nuxt Web Application guide](/guide/web-app) for the recommended Nuxt 4
structure and instructions for adapting Vitesse Nuxt without creating a nested
workspace or lockfile.

## Development

### Build All Packages

```bash
pnpm build
```

### Run in Development Mode

```bash
pnpm dev
```

### Run Tests

```bash
pnpm test
```

### Type Check

```bash
pnpm typecheck
```

### Lint Code

```bash
pnpm lint
```

## Working with Documentation

### Start Documentation Site

```bash
pnpm docs:dev
```

Visit `http://localhost:5173` to view the documentation.

### Generate API Documentation

```bash
pnpm predocs
```

This will:
1. Read source code from `packages/*/src`
2. Parse JSDoc comments and TypeScript types
3. Generate Markdown docs in `docs/api/`

### Build Documentation

```bash
pnpm docs:build
```

### Preview Built Documentation

```bash
pnpm docs:preview
```

## Creating a New Package

1. Create a new directory in `packages/`:

```bash
mkdir packages/my-package
cd packages/my-package
```

2. Initialize package.json:

```json
{
  "name": "my-package",
  "version": "0.0.0",
  "type": "module",
  "exports": {
    ".": "./dist/index.mjs",
    "./package.json": "./package.json"
  },
  "types": "./dist/index.d.mts",
  "files": ["dist"]
}
```

3. Create source files:

```bash
mkdir src
echo "export const hello = 'world'" > src/index.ts
```

4. Add build config (`tsdown.config.ts`):

```typescript
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  dts: true,
  exports: true,
  publint: true,
})
```

## Next Steps

- Learn about [Configuration](/guide/configuration)
- Explore the [API Reference](/api/)
- Read the [Changelog](/changelog)
