# Web app

[English](./README.md) | [简体中文](./README.zh-CN.md)

<!-- #region docs -->

`apps/web` is reserved for a general deployable Nuxt application in this monorepo.
Use [Vitesse for Nuxt](https://github.com/antfu/vitesse-nuxt) as a reference for
the application setup, but keep this repository as the only pnpm workspace.

## Why `apps/web`?

`web` describes the deployment platform without restricting the application's
product role. It can grow from a website into an authenticated application or
a full-stack Nuxt service, and it leaves clear room for sibling applications
such as `apps/mobile`, `apps/desktop`, or `apps/admin`.

Use `apps/site` instead only when the application is explicitly a marketing,
content, or corporate website and a separate product web app may coexist. Do
not name the directory `apps/nuxt`: application directories should describe
their responsibility or platform rather than the framework they use.

## Recommended setup

Scaffold Vitesse Nuxt into a temporary directory first so its repository-level
files can be reviewed before they are merged:

```bash
pnpm dlx degit antfu/vitesse-nuxt temp/vitesse-nuxt
```

Bring the application-specific parts into this directory:

- `app/` for pages, layouts, components, composables, and app assets
- `server/` for Nitro API routes and server-only code
- `public/` for files served without processing
- `nuxt.config.ts`, `uno.config.ts`, and `tsconfig.json`
- selected deployment files such as `Dockerfile` or `netlify.toml`, only when
  that deployment target is used and after adapting their build context,
  workspace filter, and output paths for this monorepo

Do not copy the template's `.git/`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`,
root ESLint config, GitHub workflows, or editor settings. Those concerns are
already owned by the monorepo root. Merge any required Nuxt or UnoCSS lint
support into the root ESLint config so `pnpm lint` remains the single lint
entry point.

Review the template's `.gitignore` and merge the Nuxt-specific rules into the
root `.gitignore`, including `.nuxt`, `.output`, `.data`, and local `.env`
files. Keep an exception for a committed `.env.example` when the application
documents its environment variables. Do not copy deployment files unchanged:
the upstream files assume Vitesse Nuxt is the repository root and owns the
workspace file and lockfile.

## Monorepo integration

Create a private `apps/web/package.json` based on the upstream template:

```json
{
  "name": "web",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "nuxt build",
    "dev": "nuxt dev",
    "generate": "nuxt generate",
    "prepare": "nuxt prepare",
    "preview": "nuxt preview",
    "typecheck": "nuxt typecheck"
  }
}
```

When copying dependencies from Vitesse Nuxt:

1. Add shared versions to the root `pnpm-workspace.yaml` catalog. Vitesse Nuxt
   currently uses the named `build`, `dev`, `frontend`, and `icons` catalogs;
   either add those catalogs at the root or rewrite their references to this
   repository's existing catalog.
2. Reference the resulting catalog entries from `apps/web/package.json`.
3. Use `workspace:*` for local packages from `packages/*`.
4. Omit a child `packageManager` field and dependency `resolutions`; keep
   package-manager policy and overrides at the repository root.
5. Run `pnpm install` from the repository root so there is one lockfile.

Also review workspace behavior settings from the template, such as dependency
build allowlists. Merge only the settings the selected Nuxt modules require
into the root `pnpm-workspace.yaml`; never keep a second workspace file under
`apps/web`.

The root workspace already includes `apps/*`, so no package glob needs to be
added.

## Suggested structure

Nuxt 4 uses `app/` as its default source directory. Keep runtime boundaries
visible instead of moving everything below a generic `src/` directory:

```text
apps/web/
├── app/                 # Browser-facing Vue application
│   ├── assets/
│   ├── components/
│   ├── composables/
│   ├── layouts/
│   ├── pages/
│   └── plugins/
├── public/              # Static files served as-is
├── server/              # Nitro routes and server-only utilities
├── shared/              # Runtime-neutral types and utilities
├── nuxt.config.ts
├── package.json
├── README.md
└── README.zh-CN.md
```

Start small and add conventional directories only when they have content.
Keep app-specific UI, composables, and server code here. Extract code into
`packages/*` only after it is shared by the web app, documentation, examples,
or another application.

Use the existing top-level directories by responsibility:

- `apps/web` is a deployable product.
- `docs` is the VitePress documentation site for the libraries.
- `playground` is a lightweight manual-integration environment.
- `examples/*` contains focused, independently understandable examples.
- `packages/*` contains publishable or genuinely reusable modules.

Keep Nitro routes in `apps/web/server` until they need an independent release
or deployment lifecycle. Avoid creating `packages/ui` or `packages/shared`
preemptively; a second real consumer is a useful extraction threshold.

## Commands

After `package.json` and the Nuxt source have been added:

```bash
pnpm --filter web dev
pnpm --filter web typecheck
pnpm --filter web build
```

After the initial migration, verify it from the repository root in this order:

```bash
pnpm install
pnpm --filter web prepare
pnpm --filter web typecheck
pnpm --filter web build
pnpm lint
```

The root `pnpm dev` and `pnpm build` commands will also include this app through
the recursive workspace scripts.

## What to keep optional

Vitesse Nuxt demonstrates Pinia, UnoCSS, color mode, PWA support, icons, and
VueUse. Treat these as examples rather than mandatory defaults. Add each module
only when the product needs it; in particular, PWA and global state management
carry behavior and maintenance costs that a small site may not need.

<!-- #endregion docs -->
