# Web 应用

[English](./README.md) | [简体中文](./README.zh-CN.md)

<!-- #region docs -->

`apps/web` 用于存放此 Monorepo 中通用且可独立部署的 Nuxt 应用。应用配置可参考
[Vitesse for Nuxt](https://github.com/antfu/vitesse-nuxt)，但整个仓库应只保留
一个 pnpm workspace。

## 为什么使用 `apps/web`？

`web` 描述的是部署平台，不会限制应用的产品职责。它既可以从网站逐步发展为
需要登录的产品应用或全栈 Nuxt 服务，也方便将来并列添加 `apps/mobile`、
`apps/desktop` 或 `apps/admin`。

只有当应用明确是营销站、内容站或企业官网，并且未来可能同时存在独立的产品
Web 应用时，才建议使用 `apps/site`。不要命名为 `apps/nuxt`：应用目录应该
表达职责或平台，而不是所使用的框架。

## 推荐的初始化方式

先将 Vitesse Nuxt 初始化到临时目录，以便合并前检查它包含的仓库级文件：

```bash
pnpm dlx degit antfu/vitesse-nuxt temp/vitesse-nuxt
```

将与应用直接相关的内容迁移到此目录：

- `app/`：页面、布局、组件、组合式函数与应用资源
- `server/`：Nitro API 路由与仅服务端使用的代码
- `public/`：无需构建处理、直接对外提供的静态文件
- `nuxt.config.ts`、`uno.config.ts` 与 `tsconfig.json`
- 仅在使用对应部署平台，并根据 Monorepo 调整构建上下文、workspace filter 与
  输出路径后，才迁移 `Dockerfile` 或 `netlify.toml` 等文件

不要复制模板中的 `.git/`、`pnpm-lock.yaml`、`pnpm-workspace.yaml`、根级
ESLint 配置、GitHub workflows 或编辑器设置。这些配置由 Monorepo 根目录统一
管理。所需的 Nuxt 或 UnoCSS ESLint 支持也应合并到根配置中，使 `pnpm lint`
保持为唯一的代码检查入口。

检查模板中的 `.gitignore`，并将 `.nuxt`、`.output`、`.data` 与本地 `.env`
等 Nuxt 专用规则合并到根 `.gitignore`。如果应用使用已提交的 `.env.example`
说明环境变量，应为其保留例外规则。不要原样复制部署文件：上游文件假设
Vitesse Nuxt 位于仓库根目录，并独占 workspace 文件和 lockfile。

## 接入 Monorepo

参考上游模板创建私有的 `apps/web/package.json`：

```json
{
  "name": "web",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "nuxt build",
    "dev": "nuxt dev",
    "generate": "nuxt generate",
    "prepare": "nuxt prepare",
    "preview": "nuxt preview",
    "typecheck": "nuxt typecheck"
  }
}
```

从 Vitesse Nuxt 迁移依赖时：

1. 将共享的依赖版本添加到根目录 `pnpm-workspace.yaml` 的 catalog 中。Vitesse
   Nuxt 当前使用 `build`、`dev`、`frontend` 和 `icons` 具名 catalogs；可以在
   根目录添加这些 catalogs，也可以将其引用改写为本仓库现有的 catalog。
2. 在 `apps/web/package.json` 中引用最终采用的 catalog 条目。
3. 通过 `workspace:*` 引用 `packages/*` 中的本地包。
4. 不要在子项目中添加 `packageManager` 和依赖 `resolutions`；包管理器策略与
   overrides 由仓库根目录统一维护。
5. 从仓库根目录执行 `pnpm install`，确保整个仓库只生成一个 lockfile。

同时检查模板中的 workspace 行为配置，例如依赖构建白名单。仅将所选 Nuxt
模块确实需要的设置合并到根 `pnpm-workspace.yaml`，不要在 `apps/web` 中保留
第二个 workspace 文件。

根目录 workspace 已包含 `apps/*`，因此不需要再添加 package glob。

## 建议的目录结构

Nuxt 4 默认使用 `app/` 作为源码目录。建议保留清晰的运行时边界，不要将所有
内容移动到通用的 `src/` 目录下：

```text
apps/web/
├── app/                 # 面向浏览器的 Vue 应用
│   ├── assets/
│   ├── components/
│   ├── composables/
│   ├── layouts/
│   ├── pages/
│   └── plugins/
├── public/              # 直接对外提供的静态文件
├── server/              # Nitro 路由与仅服务端使用的工具
├── shared/              # 与运行时无关的类型和工具
├── nuxt.config.ts
├── package.json
├── README.md
└── README.zh-CN.md
```

从必要的目录开始，只在确实包含内容时增加其他约定目录。应用专用的 UI、组合式
函数与服务端代码应保留在这里；只有当 Web 应用、文档、示例或其他应用需要共同
使用同一份代码时，才将其提取到 `packages/*`。

现有顶层目录按以下职责使用：

- `apps/web`：可独立部署的产品应用
- `docs`：用于库文档的 VitePress 站点
- `playground`：轻量的手动集成与联调环境
- `examples/*`：目标单一、可以独立理解的示例
- `packages/*`：可发布或真正需要复用的模块

Nitro 路由应保留在 `apps/web/server`，直到它们需要独立发布或部署。不要提前
创建 `packages/ui` 或 `packages/shared`；出现第二个真实使用方时再提取会更稳妥。

## 常用命令

添加 `package.json` 与 Nuxt 源码后，可以从仓库根目录执行：

```bash
pnpm --filter web dev
pnpm --filter web typecheck
pnpm --filter web build
```

首次迁移后，按以下顺序从仓库根目录验证：

```bash
pnpm install
pnpm --filter web prepare
pnpm --filter web typecheck
pnpm --filter web build
pnpm lint
```

根目录的 `pnpm dev` 与 `pnpm build` 也会通过递归 workspace scripts 包含此
应用。

## 按需启用功能

Vitesse Nuxt 演示了 Pinia、UnoCSS、颜色模式、PWA、图标和 VueUse。它们是可选
示例，不是必须保留的默认配置。请根据产品需求逐项引入；尤其是 PWA 与全局状态
管理会增加运行行为与维护成本，小型站点未必需要。

<!-- #endregion docs -->
