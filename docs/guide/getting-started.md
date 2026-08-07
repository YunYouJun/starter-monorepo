# Getting Started

## Prerequisites

- Node.js `^22.18.0 || ^24.11.0 || >=26.0.0`
- pnpm `11.20.0` (pinned by the root `packageManager` field)

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
├── apps/                   # Optional applications and integration playgrounds
├── docs/                   # Documentation site
│   ├── .vitepress/        # VitePress config
│   ├── guide/             # Guide docs
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
