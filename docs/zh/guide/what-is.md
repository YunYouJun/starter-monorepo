# 什么是 starter-monorepo？

starter-monorepo 是一个现代化的 TypeScript Monorepo 起始模板，用于高效构建和管理多个包。

## 功能特性

### 📦 Monorepo 管理

基于 pnpm workspace，可在单个代码仓库中管理多个包并共享依赖。

### 🚀 高速开发

- **tsdown**——由 Rolldown 驱动的 TypeScript 库构建工具
- **Vite**——新一代前端工具链
- **模块热更新**——在开发过程中即时获得反馈

### 📝 TypeScript 优先

完整支持 TypeScript，包括：

- 严格类型检查
- 类型声明生成
- IntelliSense 支持

### ✅ 测试与质量

- **Vitest**——快速的单元测试框架
- **ESLint**——使用 @antfu/eslint-config 检查代码
- **Git Hooks**——使用 simple-git-hooks 执行提交前检查

### 📚 文档

- **VitePress**——现代化的静态站点生成器
- **TypeDoc**——根据源代码自动生成 API 文档
- **实时预览**——实时查看文档改动

## 适用场景

- 构建组件库
- 创建工具包
- 开发设计系统
- 管理共享配置

## 为什么选择 Monorepo？

Monorepo 架构具有以下优势：

1. **代码共享**——便于在多个包之间共享代码
2. **原子化变更**——在一次提交中修改多个包
3. **统一工具链**——多个包共用一套配置
4. **更好的依赖管理**——避免版本冲突

## 后续步骤

- [快速开始](/zh/guide/getting-started)——创建并运行你的第一个项目
- [配置](/zh/guide/configuration)——自定义项目配置
- [API 参考（英文）](/api/)——浏览 API 文档
