# Initialize a library project

The initializer creates a new TypeScript library workspace from the local template.
It reuses pnpm catalogs, tsdown, Vitest, ESLint, TypeDoc and VitePress. The Nuxt app
remains an optional guide; no application is installed.

## Command

Use the Node.js version in `.node-version` and pnpm from `package.json#packageManager`.
No `node_modules`, Git checkout or registry access is needed to initialize.

```bash
node scripts/init.mjs --project-name my-library --package-name @acme/core \
  --description "My TypeScript library" \
  --dir ../my-library \
  --repository https://github.com/acme/my-library --author "Acme"
```

`pnpm run init` is an alias. Use `pnpm run init`, not pnpm's built-in `pnpm init`.
Run without the three required values in a terminal to receive prompts.
In a non-interactive shell, missing values cause an error listing the missing flags.
Use `--help` for usage. A validation error exits with a nonzero status before creating files.

| Input | Meaning |
| --- | --- |
| `--project-name` | Project directory/site name and private root package name |
| `--package-name` | Importable npm package name, e.g. `my-library` or `@acme/core` |
| `--description` | Required non-empty single line, used in both manifests, README files and both docs homepages |
| `--dir` | New destination, relative to your current working directory; defaults to `../<project-name>` |
| `--repository` | Optional GitHub HTTPS URL (`https://github.com/owner/repo`, optional `.git` suffix) |
| `--author` | Optional package author; original MIT copyright stays intact |

This template intentionally accepts a portable subset of [npm names](https://docs.npmjs.com/cli/configuring-npm/package-json/#name):
lowercase ASCII letters/digits with `.`, `_`, `-`, beginning with a letter/digit, at
most 214 characters including any scope. No trailing dot, whitespace, paths, Windows
device names, `node_modules`, `favicon.ico`, or unscoped Node built-in names.
Package names colliding with template dependencies and unchanged placeholders are rejected.
Registry availability and npm ownership are not checked; a syntactically valid name
may already be taken.

A scoped name `@acme/core` maps to `packages/core`, while imports, aliases and dependencies
use the full name. If project and package names are identical, the private root package
uses `<project-name>-workspace` to avoid duplicate workspace names.

## What changes

The new project gets renamed package directories, root and library manifests,
workspace links in the existing lockfile, TypeScript aliases, TypeDoc entry points,
README examples, badges, bilingual documentation and project conventions.
Descriptions are escaped for Markdown/YAML; quotes, Chinese, dollar signs and backslashes
are supported. Dependency versions and catalog policies stay pinned.

If supplied, the repository URL updates package metadata, documentation links and TypeDoc
source links (the default branch remains `main`). Without it, repository links are removed
and TypeDoc source links are disabled. Add `repository`, `homepage`, `bugs` in both manifests
and replace `disableSources` with your `sourceLinkTemplate` in `typedoc.json` when ready.
VitePress reads repository, author and description from the root manifest. Update homepage
GitHub actions/README links as needed when adding a repository later.

The initializer removes inherited author/funding metadata and sponsor configuration,
preserves the upstream MIT license and includes it in the library package, and starts a
fresh changelog. Set your own author with `--author` or in the manifests. There is no
assumed deployment URL; configure hosting separately.

It copies template source/configuration and the existing toolchain only. Git history,
`node_modules`, build output, generated API docs, local environment files, initializer
scripts/tests and this template-only guide are excluded. Existing destinations (even
empty directories) are refused. A write failure removes only the newly created directory.
The source template is unchanged and reusable. This command does not rename an existing
project, install dependencies, initialize Git, create remotes, commit or publish.

## Verify your project

```bash
cd ../my-library
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
pnpm lint
pnpm build
pnpm docs:build
```

For local documentation development, run `pnpm predocs` once before `pnpm docs:dev`.
`pnpm test` runs once; `pnpm test:watch` watches for changes.

To check the actual package consumers receive:

```bash
# From the generated repository root; prepack also builds and runs publint.
pnpm -C packages/core pack --pack-destination /tmp/my-library-artifacts
mkdir /tmp/my-library-consumer
cd /tmp/my-library-consumer
printf '{"private":true,"type":"module"}\n' > package.json
pnpm add /tmp/my-library-artifacts/acme-core-0.0.0.tgz
node --input-type=module -e "import { one, two } from '@acme/core'; console.log(one + two)"
# Expected: 3
```

Choose unused temporary paths on your system and use the actual tarball filename printed
by `pnpm pack`. This installs a local tarball, without publishing to npm.

Template maintainers can reproduce the full acceptance run with `pnpm verify:init`.
It creates a temporary project and an independent consumer, logs every command, and
keeps the project, package tarball, consumer and report for inspection.
