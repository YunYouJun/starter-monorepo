# 开发

使用根目录 `package.json` 声明的 Node.js 范围和 pnpm 固定版本，从仓库根目录安装依赖并启动构建监听：

```bash
pnpm install
pnpm dev
```

每个库的源码、单元测试和 `tsdown.config.ts` 放在 `packages/<name>/` 下，公开 API 使用 JSDoc 注释。

## 检查

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:exports
```

`pnpm test` 单次执行 Vitest，`pnpm test:watch` 监听变更。单元测试直接导入源码，无需先构建。

`pnpm test:exports` 先构建，再使用 Node.js 原生导入检查示例包的公开入口，并确认声明文件存在。修改导出或构建配置时，两类测试都要运行；新增包或调整示例导出后，同步扩展 `test/exports.ts`。

## 文档

`pnpm docs:api` 根据 TypeDoc 入口生成 API Markdown 和侧边栏，`pnpm predocs` 保留为兼容别名。运行 `pnpm docs:dev` 会先生成 API 文档，再启动 VitePress，首次克隆后可直接使用。

修改公开 API 后，重新运行 `pnpm docs:api` 刷新页面。指南位于 `docs/guide/` 与 `docs/zh/guide/`；自动生成的 `docs/api/` 不提交到 Git。

新增包请参考[快速开始](/zh/guide/getting-started)，按需更新根目录 workspace 依赖、TypeScript paths 和 TypeDoc 入口。构建检查见[构建与验证](/zh/guide/build)。
