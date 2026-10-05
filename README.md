# starter-monorepo

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

TypeScript Monorepo Starter with VitePress Documentation

## Create a project

<!-- template-only:start -->

Run the initializer before installing dependencies (Node.js as specified in `.node-version`):

```bash
node scripts/init.mjs --project-name my-library --package-name @acme/core \
  --description "My TypeScript library"
cd ../my-library
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
pnpm build
pnpm docs:build
```

Use `node scripts/init.mjs` for interactive prompts, or `pnpm run init --help` for all options.
The destination must not exist. `--dir` chooses another destination; `--repository` and
`--author` set your own metadata. No installation, Git initialization, or publishing is automatic.

Full initialization guide: [English](./docs/guide/initialization.md) · [简体中文](./docs/zh/guide/initialization.md).

Maintainers: run `pnpm verify:init` to repeat the complete acceptance check. See the
[verification record](./verification/initialization.md) for the recorded results.

<!-- template-only:end -->

Develop from the repository root using `pnpm typecheck`, `pnpm test`, `pnpm build`,
and `pnpm docs:build`. Use `pnpm test:watch` for watch mode.

## 📚 Documentation

Run `pnpm predocs` then `pnpm docs:dev` to view the documentation locally.
Configure your own hosting URL after deployment.

## ✨ Features

- 📦 Monorepo architecture with pnpm workspaces
- 🚀 Rolldown-powered library builds with tsdown
- 📝 Full TypeScript support
- ✅ Vitest testing framework
- 📚 Auto-generated API docs (TypeDoc + VitePress)
- 🔧 ESLint + Git hooks for code quality
- 🎨 Modern documentation site

## 📦 Library Usage

After publishing your package, consumers can install it from npm. Before publishing,
use `pnpm pack` in its package directory and install the resulting `.tgz` locally.

### Installation

```bash
pnpm add pkg-placeholder
```

## 🚀 Quick Start

```typescript
import { one, two } from 'pkg-placeholder'

console.log(one, two) // 1 2
```

## 📖 More

For detailed documentation, see [Getting Started](./docs/guide/getting-started.md).

## Optional Nuxt App

This template stays focused on TypeScript libraries and does not bundle an application by default. If you need a deployable SSR or full-stack application, you can add one under the preconfigured `apps/*` workspace using [Vitesse for Nuxt](https://github.com/antfu/vitesse-nuxt) as a reference:

See the `apps/web` integration guide in
[English](./apps/web/README.md) or
[简体中文](./apps/web/README.zh-CN.md) for the recommended Nuxt 4 structure,
dependency catalog setup, and the repository-level files that should not be
copied from the standalone template.

<!-- template-only:start -->

## Modify

The initializer updates `pkg-placeholder` and `starter-monorepo` automatically.
For a manual setup without the initializer:

- [ ] replace `pkg-placeholder` `starter-monorepo` in repo

## [Sponsors](https://www.yunyoujun.cn/sponsors/)

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/YunYouJun/sponsors/public/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/YunYouJun/sponsors/public/sponsors.svg' alt='Sponsors'/>
  </a>
</p>

<!-- template-only:end -->

## License

[MIT](./LICENSE) License © [YunYouJun](https://github.com/YunYouJun)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/pkg-placeholder?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/pkg-placeholder
[npm-downloads-src]: https://img.shields.io/npm/dm/pkg-placeholder?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/pkg-placeholder
[bundle-src]: https://img.shields.io/bundlephobia/minzip/pkg-placeholder?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=pkg-placeholder
[license-src]: https://img.shields.io/github/license/YunYouJun/starter-monorepo.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/YunYouJun/starter-monorepo/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/pkg-placeholder
