# 发布

首次发布前替换模板元信息，确认包名、registry 权限和文档地址属于你的项目。根目录管理包保持 `private: true`。

## 发布前检查

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:exports
pnpm docs:build
```

检查变更，确保在预期发布分支上，工作区干净。

## 本地发布

```bash
pnpm release
```

脚本执行 `bumpp -r && pnpm -r publish`。当前 bumpp 默认会交互选择版本、递归更新包版本、生成提交和标签、推送到远端，随后递归发布符合条件的 workspace 包。包的 `prepack` 钩子在发布前构建产物。

该命令会写入远端 Git 和 npm；准备好发布并完成目标 registry 登录后再运行。成功执行即完成 npm 发布。

## GitHub 发布流程

仓库的 GitHub release workflow 由 `v*` 标签推送触发，执行项目检查、文档构建，并通过 `changelogithub` 生成 GitHub release notes。npm 发布步骤默认注释，由上述本地发布命令负责发布包。

如果启用 CI 的 npm 发布步骤，请先将本地 release 脚本改为仅更新版本和推送标签，并配置 CI registry 鉴权及包访问权限。每个版本选择一个发布入口，避免本地与 CI 重复发布。
