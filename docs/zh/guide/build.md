# 构建与验证

```bash
pnpm build
```

每个库通过 `tsdown.config.ts` 输出 ESM JavaScript 和 TypeScript 声明。示例包生成 `dist/index.mjs` 与 `dist/index.d.mts`：

```typescript
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  dts: true,
  exports: true,
  publint: true,
})
```

`dts` 生成声明文件，`exports` 同步包导出，`publint` 在构建后验证包元信息。`files` 列表仅包含发布所需的产物。新增发布包时，沿用示例包的 `prepack` 构建钩子，打包和发布前会自动生成最新产物。

## 验证包入口

```bash
pnpm test:exports
```

该命令先构建，再检查示例包能否通过 Node.js 原生导入，以及声明文件是否存在。源码单元测试通过并不代表构建导出路径正确，两类检查覆盖不同环节。

## 构建文档

```bash
pnpm docs:build
pnpm docs:preview
```

`docs:build` 依次构建库、执行 `docs:api`、构建 VitePress，站点输出到 `docs/.vitepress/dist/`。发布前的完整检查见[发布指南](/zh/guide/release)。
