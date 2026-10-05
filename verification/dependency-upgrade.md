# 依赖升级验证记录

验证日期：2026-10-05（Asia/Shanghai）。沿用 Node.js v24.18.0、pnpm 11.24.0。

## 升级范围

通过 `pnpm update -r --latest '!typescript'` 更新 20 个 catalog 项及关联锁文件，
保留各 package.json 中的 `catalog:` 引用。`pnpm outdated -r --format json` 仅剩
TypeScript 7.0.2：按现有 Dependabot 兼容性约束保留 TypeScript 6.0.3，当前
TypeDoc 0.28.20 的 peerDependencies 最高为 TypeScript 6.0.x。

| 依赖 | 升级前 | 升级后 |
| --- | --- | --- |
| `@antfu/eslint-config` | `^9.3.0` | `^9.5.1` |
| `@antfu/ni` | `^30.5.0` | `^30.6.0` |
| `@shikijs/vitepress-twoslash` | `^4.4.3` | `^4.5.0` |
| `@types/node` | `^26.4.0` | `^26.6.4` |
| `@unocss/reset` | `^66.8.1` | `^66.10.5` |
| `@vueuse/core` | `^14.4.0` | `^15.0.0` |
| `bumpp` | `^12.2.2` | `^12.3.0` |
| `eslint` | `^10.9.1` | `^10.12.0` |
| `floating-vue` | `^5.2.2` | `^5.4.0` |
| `lint-staged` | `^17.4.1` | `^17.6.0` |
| `publint` | `^0.3.24` | `^0.3.25` |
| `tsdown` | `^0.22.14` | `^0.23.0` |
| `tsx` | `^4.23.13` | `^4.23.15` |
| `typedoc-plugin-markdown` | `^4.13.0` | `^4.13.1` |
| `typedoc-vitepress-theme` | `^1.1.3` | `^1.1.4` |
| `unocss` | `^66.8.1` | `^66.10.5` |
| `vite` | `^8.2.2` | `^8.3.2` |
| `vitepress` | `^2.0.0-alpha.19` | `2.0.0-alpha.20` |
| `vitest` | `^4.1.11` | `^5.0.3` |
| `vue` | `^3.5.42` | `^3.5.43` |

新版 @antfu/eslint-config 要求规范 pnpm YAML 的顺序/空行，并启用
`minimumReleaseAgeExcludePrune: true`，已同步。保留现有最小发布时间、信任策略与构建许可。
文档构建同时更新了已纳入版本管理的组件声明文件中的依赖路径。

## 验证结果

- 模板通过 `pnpm lint`、`pnpm typecheck`、`pnpm test`（40 个测试）。
- `pnpm docs:build` 包含库构建、publint、TypeDoc、VitePress，全部成功。
- `pnpm verify:init` 从新的临时目录重新执行完整验收，14 个步骤全部退出 0。
- 新项目使用 `pnpm install --frozen-lockfile`，库测试 2 个通过。
- 独立消费者安装本地 tgz，运行输出 `consumer runtime OK: 1 + 2 = 3`，NodeNext/Bundler 两种类型检查通过。
- 模板 README 的 Modify 和 Sponsors 保留，生成新项目时排除模板专用段落，已有回归断言覆盖。
- 未发布 npm 包，未推送远程。

[完整验收输出](./dependency-upgrade-output.txt)（已清理终端颜色与行尾空白）。
本地项目、tarball、消费者及原始报告保留于：

```text
/var/folders/tx/zs0fhdtn52l29nbtqby57qlh0000gn/T/starter-monorepo-acceptance-pJVgv5
```

| 验收步骤 | 退出码 | 耗时（ms） |
| --- | --- | --- |
| pnpm-version | 0 | 301 |
| initialize | 0 | 75 |
| install | 0 | 4665 |
| typecheck | 0 | 1595 |
| test | 0 | 1893 |
| lint | 0 | 4443 |
| build | 0 | 2463 |
| docs-build | 0 | 7748 |
| pack | 0 | 1464 |
| consumer-install | 0 | 512 |
| consumer-runtime | 0 | 41 |
| consumer-typescript-install | 0 | 1121 |
| consumer-types-nodenext | 0 | 1328 |
| consumer-types-bundler | 0 | 933 |
