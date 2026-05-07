# CLAUDE.md

## Project Overview

TypeScript Monorepo Starter Template (`starter-monorepo`) by YunYouJun.

- **Purpose**: Reusable monorepo template for building TypeScript libraries
- **Architecture**: pnpm workspaces with catalog dependencies
- **Docs**: VitePress + TypeDoc auto-generated API docs
- **Build**: unbuild
- **Test**: vitest
- **Lint**: @antfu/eslint-config (flat config)

## Commands

```bash
pnpm build          # Build all packages
pnpm dev            # Dev mode (unbuild --stub)
pnpm test           # Run tests
pnpm lint           # Lint (eslint --cache)
pnpm typecheck      # Type check (tsc --noEmit)
pnpm docs:dev       # Dev documentation site
pnpm docs:build     # Build documentation (typedoc + vitepress)
pnpm release        # bumpp -r && publish
```

## Conventions

- Use `catalog:` in package.json for shared dependency versions (defined in `pnpm-workspace.yaml`)
- Use `@antfu/ni` commands (`nr`, `nci`) in scripts and CI
- ESM only (`"type": "module"`)
- Strict TypeScript
- Each package in `packages/` has its own `build.config.ts`, `src/`, `test/`

## Adding a New Package

1. Create `packages/<name>/` with: `src/index.ts`, `test/index.test.ts`, `build.config.ts`, `package.json`
2. Update `tsconfig.json` paths
3. Update `typedoc.json` entryPoints
4. Package exports should use: `"./dist/index.mjs"` (main) + `"./dist/index.d.mts"` (types)

## Code Style

- Follows @antfu/eslint-config defaults (no prettier, no semicolons, single quotes)
- Type-first: prefer explicit types on exports
- JSDoc comments on public APIs (TypeDoc will generate docs from them)
