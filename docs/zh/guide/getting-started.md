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
├── apps/                   # 可选的应用与集成演练场
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
