# 快速开始

## 环境要求

- Node.js `^22.18.0 || ^24.11.0 || >=26.0.0`
- pnpm `11.21.0`（由根目录的 `packageManager` 字段固定版本）

## 安装

### 克隆仓库

```bash
git clone https://github.com/YunYouJun/starter-monorepo.git
cd starter-monorepo
```

### 安装依赖

```bash
pnpm install
```

## 项目结构

```
starter-monorepo/
├── apps/
│   └── web/                # 可选且可独立部署的 Nuxt 应用
├── docs/                   # 文档站点
│   ├── .vitepress/        # VitePress 配置
│   ├── guide/             # 英文指南
│   ├── zh/guide/          # 中文指南
│   ├── api/               # 自动生成的 API 文档
│   └── public/            # 静态资源
├── packages/
│   └── pkg-placeholder/   # 示例包
│       ├── src/           # 源代码
│       ├── test/          # 测试
│       ├── tsdown.config.ts # 构建配置
│       └── dist/          # 构建产物
├── package.json           # 根目录 package.json
├── pnpm-workspace.yaml    # pnpm workspace 配置
└── tsconfig.json          # TypeScript 配置
```

### 可选的 Nuxt 应用

通用且可独立部署的 Nuxt 应用建议命名为 `apps/web`。`web` 描述其运行平台，不会
限制应用未来的产品职责，也方便并列添加 `apps/mobile`、`apps/desktop` 或
`apps/admin`。

如果应用明确是内容站、营销站或企业官网，并且未来可能与独立的产品 Web 应用
并存，可以使用 `apps/site`。应避免 `apps/nuxt` 这类基于框架的名称；应用目录
应该表达职责或平台。

workspace 已配置 `apps/*` package glob。创建 `apps/web/package.json` 后，pnpm
会自动识别该应用。Nuxt 4 目录结构以及在不创建嵌套 workspace 和 lockfile 的
前提下接入 Vitesse Nuxt 的步骤，请参阅 [Nuxt Web 应用指南](/zh/guide/web-app)。

## 开发

### 构建所有包

```bash
pnpm build
```

### 启动开发模式

```bash
pnpm dev
```

### 运行测试

```bash
pnpm test
```

### 类型检查

```bash
pnpm typecheck
```

### 代码检查

```bash
pnpm lint
```

## 使用文档站点

### 启动文档站点

```bash
pnpm docs:dev
```

访问 `http://localhost:5173` 查看文档。

### 生成 API 文档

```bash
pnpm predocs
```

此命令将：

1. 读取 `packages/*/src` 中的源代码
2. 解析 JSDoc 注释和 TypeScript 类型
3. 在 `docs/api/` 中生成 Markdown 文档

### 构建文档

```bash
pnpm docs:build
```

### 预览构建结果

```bash
pnpm docs:preview
```

## 创建新包

1. 在 `packages/` 中创建目录：

```bash
mkdir packages/my-package
cd packages/my-package
```

2. 初始化 package.json：

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

3. 创建源文件：

```bash
mkdir src
echo "export const hello = 'world'" > src/index.ts
```

4. 添加构建配置（`tsdown.config.ts`）：

```typescript
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  dts: true,
  exports: true,
  publint: true,
})
```

## 后续步骤

- 了解[配置](/zh/guide/configuration)
- 浏览 [API 参考（英文）](/api/)
- 阅读[更新日志（英文）](/changelog)
