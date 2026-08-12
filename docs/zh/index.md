---
layout: home

hero:
  name: "starter-monorepo"
  text: "Monorepo 起始模板"
  tagline: 基于 TypeScript、内置 VitePress 文档的 Monorepo 起始模板
  image:
    src: /hero.png
    alt: 由多个相连包组成的 Monorepo 工作区
  actions:
    - theme: brand
      text: 快速开始
      link: /zh/guide/getting-started
    - theme: alt
      text: 在 GitHub 查看
      link: https://github.com/YunYouJun/starter-monorepo

features:
  - icon: 📦
    title: Monorepo 架构
    details: 使用 pnpm workspace 高效管理多个包
  - icon: 🚀
    title: 高速构建
    details: 由 tsdown 和 Rolldown 驱动，提供快速的开发体验
  - icon: 📝
    title: TypeScript
    details: 完整的 TypeScript 支持与类型安全保障
  - icon: ✅
    title: 测试
    details: 内置 Vitest 单元测试框架
  - icon: 📚
    title: 自动化文档
    details: 使用 TypeDoc 和 VitePress 自动生成 API 文档
  - icon: 🔧
    title: 开发体验
    details: 集成 ESLint、Git Hooks 与现代化工具链
---

## 快速开始

[![npm version](https://img.shields.io/npm/v/pkg-placeholder?style=flat&colorA=080f12&colorB=1fa669)](https://npmjs.com/package/pkg-placeholder)

[![npm downloads](https://img.shields.io/npm/dm/pkg-placeholder?style=flat&colorA=080f12&colorB=1fa669)](https://npmjs.com/package/pkg-placeholder)

[![bundle](https://img.shields.io/bundlephobia/minzip/pkg-placeholder?style=flat&colorA=080f12&colorB=1fa669&label=minzip)](https://bundlephobia.com/result?p=pkg-placeholder)

[![License](https://img.shields.io/github/license/YunYouJun/starter-monorepo.svg?style=flat&colorA=080f12&colorB=1fa669)](https://github.com/YunYouJun/starter-monorepo/blob/main/LICENSE)

```bash
pnpm add pkg-placeholder
```

```typescript
import { one, two } from 'pkg-placeholder'

console.log(one, two) // 1 2
```
