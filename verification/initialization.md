# 初始化模板验证记录

验收完成：2026-10-05（Asia/Shanghai）。本次保持 TypeScript 库模板定位，没有执行 npm publish、release、Git 提交或推送。

依赖升级后的复验结果见[依赖升级验证记录](./dependency-upgrade.md)。下文保留升级前的首次验收记录。

## 环境与复现

- macOS / darwin arm64，Node.js v24.18.0，pnpm 11.24.0。
- 工具链沿用现有锁文件与 catalog，没有新增第三方依赖，也没有更新依赖版本。
- 从模板根目录运行 `pnpm verify:init`，每次创建新的临时目录，保留项目、日志、tgz、独立消费者及 JSON/Markdown 报告。
- 主验收时间：2026-10-05 06:03:35–06:04:09（Asia/Shanghai）。机器记录使用 UTC。
- [完整命令、参数、工作目录、退出码及耗时](./initialization-run.json)。每步命令输出见下表（归档时清理终端颜色与行尾空白）。

主验收保留目录：

```text
/var/folders/tx/zs0fhdtn52l29nbtqby57qlh0000gn/T/starter-monorepo-acceptance-xJz3Kw/
├── project/     # 生成的 TypeScript 库项目及构建结果
├── consumer/    # 位于该 workspace 以外的独立消费者
├── artifacts/acceptance-core-0.0.0.tgz
├── logs/
├── report.json
└── report.md
```

## 主验收：scoped 包，无仓库和作者信息

通过公开 CLI 创建 `acceptance-library`，包名 `@acceptance/core`，目录 `packages/core`。
描述含中文、双引号、美元替换标记 `$&` 与反斜杠，确认保存与构建不受影响。
未提供仓库/作者，验证不依赖已有 Git checkout 或生成的 API 文档。

| 步骤 | 退出码 | 耗时（ms） | 完整输出 |
| --- | --- | --- | --- |
| pnpm-version | 0 | 781 | [日志](initialization-output/01-pnpm-version.txt) |
| initialize | 0 | 95 | [日志](initialization-output/02-initialize.txt) |
| install | 0 | 5023 | [日志](initialization-output/03-install.txt) |
| typecheck | 0 | 2385 | [日志](initialization-output/04-typecheck.txt) |
| test | 0 | 2042 | [日志](initialization-output/05-test.txt) |
| lint | 0 | 5934 | [日志](initialization-output/06-lint.txt) |
| build | 0 | 3423 | [日志](initialization-output/07-build.txt) |
| docs-build | 0 | 8139 | [日志](initialization-output/08-docs-build.txt) |
| pack | 0 | 1585 | [日志](initialization-output/09-pack.txt) |
| consumer-install | 0 | 557 | [日志](initialization-output/10-consumer-install.txt) |
| consumer-runtime | 0 | 55 | [日志](initialization-output/11-consumer-runtime.txt) |
| consumer-typescript-install | 0 | 1400 | [日志](initialization-output/12-consumer-typescript-install.txt) |
| consumer-types-nodenext | 0 | 1530 | [日志](initialization-output/13-consumer-types-nodenext.txt) |
| consumer-types-bundler | 0 | 1130 | [日志](initialization-output/14-consumer-types-bundler.txt) |

所有步骤退出码均为 0。`install --frozen-lockfile` 直接通过，无需重建锁文件。
生成项目的 2 个库测试通过；tsdown 输出 `index.mjs` 与 `index.d.mts`，publint 无问题。
TypeDoc、英文首页、中文首页和 API 页面均成功生成。

## 打包及消费者验证

- `.tgz` 仅包含 `dist/index.mjs`、`dist/index.d.mts`、`LICENSE`、`package.json`、`README.md`。
- 独立目录通过 `pnpm add <绝对路径>/acceptance-core-0.0.0.tgz` 安装真实打包产物。
- 运行时断言 `one === 1`、`two === 2`、`one + two === 3`，输出 `consumer runtime OK: 1 + 2 = 3`。
- 安装与模板一致的 TypeScript 6.0.3，分别以 NodeNext 与 Bundler 模式进行严格类型检查。
- 错误赋值配合 `@ts-expect-error`，同时验证声明不会退化为 `any`。
- 检查消费者实际解析路径独立于 workspace；核对双语 HTML 名称、import 示例和无模板占位符残留。

详见[产物检查记录](./initialization-output/15-artifact-inspection.txt)。

## 交互输入与无 scope 包

在真实 PTY 中逐项输入项目名、包名与描述，退出码 0。项目名与包名均为
`interactive-library`，根私有包自动命名为 `interactive-library-workspace`，库目录为
`packages/interactive-library`。同时传入自己的 `--repository` 与 `--author`，覆盖元数据分支。
临时项目保留在 `/tmp/starter-interactive-20261005`。

冻结锁文件安装、类型检查、lint 和文档构建的命令及结果见[交互项目验证日志](./initialization-output/16-interactive-project.txt)。

## 回归测试与模板检查

模板的 40 个测试通过（38 个初始化测试、2 个库测试）。覆盖：

- 普通/scoped 包名、最大长度、大小写、非法字符、路径越界、Windows 保留名、Node 内置名。
- 缺少必填项、未知参数、空描述、多行描述、非法仓库地址与依赖名称冲突。
- 带空格的目标目录、重复执行、已有目录保护及源模板保持不变。
- 包目录、workspace 依赖、冻结锁文件引用、TypeScript 别名、TypeDoc、文档示例与徽章同步。
- 特殊字符描述、可选作者/仓库清理、MIT 文件、复制主题 CSS、排除 Git/依赖/构建缓存。
- 用户仓库名包含模板关键字时不会被二次替换。

模板自身通过 `pnpm typecheck`、`pnpm test`、`pnpm lint`、`pnpm docs:build`（包含库构建与 publint）及 `git diff --check`。

## 验证中发现并修复

首轮验收的文档构建失败：初始化文件白名单漏掉主题 `style.css`。
补齐 CSS 复制规则，并增加原文件与生成文件一致性断言后，从新的临时目录重跑上述完整流程通过。
[首轮失败输出](./initialization-output/00-first-attempt-docs-build.txt)保留供核对。

检查时也发现干净 checkout 尚无 `docs/api/typedoc-sidebar.json`，会导致类型检查失败；
现改为按需读取生成的侧栏，未生成时使用空侧栏。主验收在生成 API 文档之前执行类型检查并通过。

无 Git 目录时 simple-git-hooks 会打印跳过提示，这是预期行为且安装退出码为 0。
本次实际执行环境为 macOS；跨平台名称与路径有测试覆盖，未声称已在 Windows/Linux 实机验收。
名称校验不查询 npm 名称占用或 scope 所有权；不发布包，也不验证托管站点部署。
