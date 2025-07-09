# Professional Writing Hub

[![Deploy VitePress](https://github.com/yourusername/markdown-writing-project/actions/workflows/deploy.yml/badge.svg)](https://github.com/yourusername/markdown-writing-project/actions/workflows/deploy.yml)

一个基于 VitePress 构建的专业 Markdown 写作平台，用于创建高质量的技术文档和文章。

## ✨ 特性

- **纯 Markdown 写作体验**：专注内容创作，支持数学公式、代码高亮等高级功能
- **现代化技术栈**：基于 VitePress 和 Vue 3 构建
- **专业设计**：清晰易读的排版设计，响应式布局，支持暗色/亮色主题切换
- **强大搜索**：内置全文搜索功能
- **结构化内容**：自动生成导航和目录
- **自动部署**：通过 GitHub Actions 自动部署到 GitHub Pages

## 📚 内容

- **OSPO 指南**：《如何在企业内部建立 OSPO（开源项目办公室）》全面指南
- **写作指南**：Markdown 语法和最佳实践
- **技术文章**：专业技术内容

## 🚀 快速开始

### 环境准备

- Node.js (v18 或更高版本)
- npm 或 yarn

### 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 🚀 部署

### 自动部署到 GitHub Pages

本项目配置了 GitHub Actions，可以自动部署到 GitHub Pages：

1. **推送到主分支**：将代码推送到 `main` 分支，GitHub Actions 会自动构建并部署站点
2. **GitHub Pages 设置**：确保在仓库设置中启用 GitHub Pages，选择 "GitHub Actions" 作为部署源
3. **访问站点**：部署完成后，可通过 `https://你的用户名.github.io/仓库名` 访问

### 配置说明

- **最新版本**：已更新所有 GitHub Actions 到最新版本，避免弃用警告
- **智能依赖管理**：自动检测锁文件存在性，兼容有无 package-lock.json 的情况
- **自动化流程**：包含构建、测试和部署的完整 CI/CD 流程
- **安全权限**：使用最小权限原则，确保部署安全

### 自定义域名

如果您想使用自定义域名：
1. 更新 `docs/public/CNAME` 文件为您的域名
2. 在 DNS 提供商处配置 CNAME 记录指向 GitHub Pages
3. 更新 `docs/.vitepress/config.js` 中的 `base` 配置

## 📝 贡献

欢迎贡献新文章和改进！请查看 [贡献指南](CONTRIBUTING.md) 了解更多信息。

## 📄 许可证

MIT 许可证

---

**注意**：本项目使用最新版本的 GitHub Actions，确保长期稳定运行。所有依赖项定期更新以保持安全性和兼容性。