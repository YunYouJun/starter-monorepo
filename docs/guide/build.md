# Build

```bash
pnpm build
```

Each library uses `tsdown.config.ts` to build ESM JavaScript and TypeScript declarations. The example package produces:

```text
packages/pkg-placeholder/dist/
├── index.mjs
└── index.d.mts
```

## Configuration

```typescript
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  dts: true,
  exports: true,
  publint: true,
})
```

`dts` generates declaration files, `exports` synchronizes the package manifest with build outputs, and `publint` validates package metadata after building. Keep the package's `files` list focused on the published output.

The example package's `prepack` hook builds it before packing or publishing. Use the same hook for new publishable packages so their archives contain current output.

## Validate the Package

```bash
pnpm test:exports
```

This command builds packages, then checks the example package's public entry point with a native Node.js import and verifies that its declaration file exists. Source unit tests can pass while an export path points to a missing file; these checks cover the build output. Extend `test/exports.ts` to cover additional packages.

## Build Documentation

```bash
pnpm docs:build
pnpm docs:preview
```

`docs:build` builds libraries, generates API docs with `docs:api`, and builds VitePress into `docs/.vitepress/dist/`. Keep the library build and package validation in your [release workflow](/guide/release).
