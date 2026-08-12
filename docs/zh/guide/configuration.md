# 配置

## 构建配置

项目使用 `tsdown` 作为构建工具。每个包的配置都位于各自的 `tsdown.config.ts` 中。

### 默认配置

```typescript
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  dts: true,
  exports: true,
  publint: true,
})
```

### 配置项

- `entry`：入口文件
- `dts`：生成 TypeScript 类型声明文件
- `exports`：让包的导出配置与构建产物保持同步
- `publint`：构建后验证包的配置

## TypeScript 配置

TypeScript 配置位于 `tsconfig.json`：

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["ESNext"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "strict": true,
    "strictNullChecks": true,
    "noEmit": true,
    "esModuleInterop": true,
    "verbatimModuleSyntax": true,
    "skipDefaultLibCheck": true,
    "skipLibCheck": true
  }
}
```

## ESLint 配置

项目使用 `@antfu/eslint-config`，配置位于 `eslint.config.ts`：

```typescript
import antfu from '@antfu/eslint-config'

export default antfu({
  // 在此添加自定义配置
})
```

## 包管理器配置

项目使用 pnpm workspace，并在 `pnpm-workspace.yaml` 中配置：

```yaml
packages:
  - apps/*
  - playground
  - docs
  - packages/*
  - examples/*
```

## Git Hooks

项目使用 `simple-git-hooks` 和 `lint-staged` 执行提交前检查：

```json
{
  "simple-git-hooks": {
    "pre-commit": "pnpm lint-staged"
  },
  "lint-staged": {
    "*": "eslint --fix"
  }
}
```

## 文档配置

### VitePress 配置

文档使用 VitePress 构建，配置位于 `docs/.vitepress/config/index.ts`。

### TypeDoc 配置

API 文档使用 TypeDoc 生成，配置位于 `typedoc.json`：

```json
{
  "$schema": "https://typedoc.org/schema.json",
  "entryPoints": ["./packages/pkg-placeholder/src/index.ts"],
  "out": "./docs/api",
  "plugin": ["typedoc-plugin-markdown", "typedoc-vitepress-theme"],
  "readme": "none",
  "docsRoot": "docs",
  "gitRevision": "main",
  "sourceLinkTemplate": "https://github.com/YunYouJun/starter-monorepo/tree/{gitRevision}/{path}#L{line}",
  "sidebar": {
    "autoConfiguration": true,
    "format": "vitepress",
    "pretty": true,
    "collapsed": false
  }
}
```

### 自定义文档

如需为更多包生成 API 文档，请更新 `typedoc.json`：

```json
{
  "entryPoints": [
    "./packages/pkg-placeholder/src/index.ts",
    "./packages/another-package/src/index.ts"
  ]
}
```

## 环境变量

基本使用无需配置环境变量。部署相关配置请参考部署平台的说明。

## 后续步骤

- 阅读[快速开始指南](/zh/guide/getting-started)
- 浏览 [API 参考（英文）](/api/)
