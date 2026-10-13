# Development

Use the Node.js range and pinned pnpm version in the root `package.json`. Install dependencies from the repository root:

```bash
pnpm install
pnpm dev
```

`pnpm dev` runs the package build watchers. Keep each library's source, unit tests, and `tsdown.config.ts` together under `packages/<name>/`. Add public API documentation with JSDoc comments.

## Checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:exports
```

`pnpm test` completes one Vitest run; `pnpm test:watch` watches for changes. Unit tests import source files and can run before building.

`pnpm test:exports` builds packages and checks the example package's production entry point with a native Node.js import, including the presence of its declaration file. Run both kinds of tests when changing exports or build configuration. Extend `test/exports.ts` when adding packages or changing the example exports.

## Documentation

```bash
pnpm docs:api
pnpm docs:dev
```

`docs:api` generates API Markdown and the sidebar from TypeDoc entry points. `predocs` remains an alias for this command. `docs:dev` generates the API docs before starting VitePress, so a fresh checkout can start the documentation site.

After changing public APIs, rerun `pnpm docs:api` to refresh the generated pages. Edit hand-written guides under `docs/guide/`; generated files under `docs/api/` stay out of Git.

To add a package, follow [Getting Started](/guide/getting-started), then update the root workspace dependency, TypeScript paths, and TypeDoc entry points as needed. See [Build](/guide/build) for output checks.
