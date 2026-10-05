# 初始化 TypeScript 库项目

初始化命令从本地模板创建新目录，复用 pnpm catalog、tsdown、Vitest、ESLint、
TypeDoc 和 VitePress。Nuxt 仍是可选接入指南，不会自动添加应用。

## 运行命令

使用 `.node-version` 指定的 Node.js，以及根 `package.json#packageManager` 固定的
pnpm 版本。初始化不需要提前安装依赖，也不要求 Git 仓库或访问 registry。

```bash
node scripts/init.mjs --project-name my-library --package-name @acme/core \
  --description "我的 TypeScript 工具库" \
  --dir ../my-library \
  --repository https://github.com/acme/my-library --author "Acme"
```

也可使用 `pnpm run init`。注意 `pnpm init` 是 pnpm 自带命令，必须加 `run`。
在终端中省略必填项会逐项提示；非交互环境缺少参数时会列出缺失的选项并退出。
`--help` 查看帮助。输入不合法时返回非零退出码，且不会创建项目文件。

| 参数 | 用途 |
| --- | --- |
| `--project-name` | 项目目录名、文档站点标题、根私有包名 |
| `--package-name` | npm 包名与 import 名称，支持 `my-library`、`@acme/core` |
| `--description` | 必填非空单行描述，写入根与库 package.json、README、双语文档首页 |
| `--dir` | 新目录路径，相对当前工作目录解析；默认 `../<project-name>` |
| `--repository` | 可选 GitHub HTTPS 地址，如 `https://github.com/acme/my-library`，允许 `.git` 后缀 |
| `--author` | 可选包作者；不会删除上游 MIT 版权声明 |

名称采用 [npm 规则](https://docs.npmjs.com/cli/configuring-npm/package-json/#name)的跨平台子集：
使用小写英文字母、数字、`.`、`_`、`-`，每一部分以字母或数字开头，总长不超过
214 字符（含 scope）。不允许末尾句点、空格、路径、Windows 设备名、
`node_modules`、`favicon.ico` 或无 scope 的 Node 内置模块名。与模板依赖冲突的包名、
未修改的模板占位符也会拒绝。此检查不查询 npm 名称是否已被占用或是否拥有 scope。

`@acme/core` 使用目录 `packages/core`，依赖、别名和示例 import 保留完整 scope。
项目名和包名相同时，根私有包名使用 `<project-name>-workspace`，避免 workspace 重名。

## 初始化范围

同步更新包目录、两级 package.json、现有 lockfile 中的 workspace 链接、TypeScript
别名、TypeDoc 入口、README 示例、徽章、双语文档与项目约定。描述支持中文、引号、
美元符号和反斜杠，写入 Markdown 与 YAML 时转义。工具链版本及 catalog 策略保持固定。

提供仓库地址时更新包元数据、文档链接和 TypeDoc 源码链接，默认分支仍为 `main`。
未提供时移除模板仓库链接，并通过 `disableSources` 关闭源码链接。后续请补齐两级
package.json 的 `repository`、`homepage`、`bugs`，在 `typedoc.json` 中将
`disableSources` 换为自己的 `sourceLinkTemplate`，并补齐 README 和文档首页的仓库入口。
VitePress 的仓库、作者及描述读取根 package.json。

未提供作者时移除模板作者的发布元数据与赞助配置，保留 MIT 许可证署名，并为库包
附带许可证。通过 `--author` 或两级 package.json 设置自己的作者信息。新项目会使用
新的 changelog，不预设已部署的文档网址，托管地址需部署后自行配置。

只复制模板源码及配置；排除 Git 历史、node_modules、构建产物、生成的 API 文档、
本地环境文件，以及初始化脚本、对应测试和本文等模板专用内容。已有目标目录（包括
空目录）会被拒绝。写入失败时仅清理本次新建目录。源模板不变，可重复用于创建新项目。
此命令不用于原地重命名已有项目，不会自动安装依赖、初始化 Git、创建远程仓库、提交或发布。

## 验证新项目

```bash
cd ../my-library
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
pnpm lint
pnpm build
pnpm docs:build
```

本地启动文档前先运行一次 `pnpm predocs`，再运行 `pnpm docs:dev`。
`pnpm test` 单次执行，`pnpm test:watch` 监听变更。

验证消费者实际使用的打包产物：

```bash
# 在生成的项目根目录运行，prepack 会构建并执行 publint。
pnpm -C packages/core pack --pack-destination /tmp/my-library-artifacts
mkdir /tmp/my-library-consumer
cd /tmp/my-library-consumer
printf '{"private":true,"type":"module"}\n' > package.json
pnpm add /tmp/my-library-artifacts/acme-core-0.0.0.tgz
node --input-type=module -e "import { one, two } from '@acme/core'; console.log(one + two)"
# 预期输出：3
```

请选择系统中尚未使用的临时路径，并以 `pnpm pack` 输出的实际文件名为准。
整个过程只安装本地 tgz，不发布到 npm。

模板维护者可执行 `pnpm verify:init` 重现完整验收：脚本创建临时项目和独立消费者，
记录每一步命令，并保留项目、tgz、消费者与验证报告供检查。
