# starter-monorepo

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

TypeScript Monorepo Starter with VitePress Documentation

## 📚 Documentation

Online documentation: https://starter-monorepo.pages.dev/

## ✨ Features

- 📦 Monorepo architecture with pnpm workspaces
- 🚀 Rolldown-powered library builds with tsdown
- 📝 Full TypeScript support
- ✅ Vitest testing framework
- 📚 Auto-generated API docs (TypeDoc + VitePress)
- 🔧 ESLint + Git hooks for code quality
- 🎨 Modern documentation site

## 📦 Installation

```bash
pnpm add pkg-placeholder
```

## 🚀 Quick Start

```typescript
import { one, two } from 'pkg-placeholder'

console.log(one, two) // 1 2
```

## 📖 More

For detailed documentation, visit: https://starter-monorepo.pages.dev

## Optional Nuxt App

This template stays focused on TypeScript libraries and does not bundle an application by default. If you need an SSR application or an integration playground, you can scaffold [Vitesse for Nuxt](https://github.com/antfu/vitesse-nuxt) under the preconfigured `apps/*` workspace:

```bash
pnpm dlx degit antfu/vitesse-nuxt apps/web
```

Before installing dependencies, adapt the generated project to the monorepo:

- Keep the repository root as the only pnpm workspace and lockfile.
- Merge Vitesse Nuxt's named catalogs into the root `pnpm-workspace.yaml` instead of keeping a nested workspace configuration.
- Remove the child package's `packageManager` field, then run `pnpm install` from the repository root.

## Modify

- [ ] replace `pkg-placeholder` `starter-monorepo` in repo

## [Sponsors](https://www.yunyoujun.cn/sponsors/)

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/YunYouJun/sponsors/public/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/YunYouJun/sponsors/public/sponsors.svg' alt='Sponsors'/>
  </a>
</p>

## License

[MIT](./LICENSE) License © [YunYouJun](https://github.com/YunYouJun)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/pkg-placeholder?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/pkg-placeholder
[npm-downloads-src]: https://img.shields.io/npm/dm/pkg-placeholder?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/pkg-placeholder
[bundle-src]: https://img.shields.io/bundlephobia/minzip/pkg-placeholder?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=pkg-placeholder
[license-src]: https://img.shields.io/github/license/YunYouJun/pkg-placeholder.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/YunYouJun/pkg-placeholder/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/pkg-placeholder
