# 部署指南

本文档说明如何将 VitePress 站点部署到 GitHub Pages。

## 🚀 自动部署（推荐）

项目已配置自动部署，每次推送到 `main` 分支时会自动构建和部署站点。

### 前提条件

1. **GitHub Pages 设置**：
   - 进入仓库设置 → Pages
   - 在 "Source" 下选择 "GitHub Actions"
   - 保存设置

2. **推送代码**：
   ```bash
   git add .
   git commit -m "Update content"
   git push origin main
   ```

3. **查看部署状态**：
   - 在仓库的 "Actions" 标签页查看部署进度
   - 部署成功后，站点将在 `https://你的用户名.github.io/仓库名` 可访问

## 🔧 GitHub Actions 配置说明

### 特性

- **最新版本**：使用 GitHub Actions v4 版本，避免弃用警告
- **智能依赖管理**：自动检测 `package-lock.json` 存在性
  - 如果存在锁文件：使用 `npm ci`（更快、更可靠）
  - 如果不存在锁文件：使用 `npm install`（兼容性更好）
- **缓存优化**：启用 npm 缓存以加速构建
- **安全配置**：使用最小权限原则

### 工作流触发条件

- 推送到 `main` 分支
- 手动触发（在 Actions 页面）

### 构建步骤

1. **代码检出**：获取最新代码
2. **Node.js 设置**：配置 Node.js 18 环境
3. **依赖安装**：智能选择安装方式
4. **站点构建**：运行 VitePress 构建
5. **artifact 上传**：准备部署文件
6. **Pages 部署**：发布到 GitHub Pages

## 🛠️ 手动部署

如果需要手动部署到其他平台：

```bash
# 构建站点
npm run build

# 手动部署到 GitHub Pages（需要 gh-pages 包）
npm run deploy
```

## 🧪 部署测试

在推送之前，可以运行部署测试：

```bash
npm run test:deploy
```

此命令会：
- 检查必要的配置文件
- 运行构建测试
- 验证构建产物
- 检查 GitHub Actions 配置

## 📁 项目结构

```
├── .github/workflows/
│   └── deploy.yml          # GitHub Actions 配置
├── docs/                   # VitePress 源文件
│   ├── .vitepress/
│   │   └── config.js       # VitePress 配置
│   └── public/
│       ├── .nojekyll       # GitHub Pages 配置
│       └── CNAME           # 自定义域名（可选）
├── dist/                   # 构建输出目录
├── package.json            # 项目配置
└── package-lock.json       # 依赖锁文件（现已包含）
```

## 🐛 常见问题

### 问题：GitHub Actions 报错 "Dependencies lock file is not found"

**解决方案**：
- 确保 `package-lock.json` 没有被 `.gitignore` 忽略
- 提交锁文件到版本控制：`git add package-lock.json`
- 我们的配置已经处理了无锁文件的情况

### 问题：站点无法访问或显示 404

**解决方案**：
1. 检查 GitHub Pages 设置是否正确
2. 确认 `docs/.vitepress/config.js` 中的 `base` 配置正确
3. 检查 `docs/public/.nojekyll` 文件是否存在

### 问题：构建失败

**解决方案**：
1. 在本地运行 `npm run build` 检查错误
2. 运行 `npm run test:deploy` 进行完整测试
3. 检查 Actions 页面的详细错误日志

## 🎯 自定义配置

### 自定义域名

如需使用自定义域名：

1. 更新 `docs/public/CNAME` 文件：
   ```
   your-domain.com
   ```

2. 更新 VitePress 配置中的 base：
   ```js
   // docs/.vitepress/config.js
   export default defineConfig({
     base: '/', // 自定义域名时设为根路径
     // ...
   })
   ```

3. 在 DNS 提供商配置 CNAME 记录

### 更改分支

如果主分支不是 `main`，更新 `.github/workflows/deploy.yml`：

```yaml
on:
  push:
    branches: [your-branch-name]
```

## 📚 相关资源

- [VitePress 官方文档](https://vitepress.dev/)
- [GitHub Pages 文档](https://docs.github.com/pages)
- [GitHub Actions 文档](https://docs.github.com/actions)

---

如有问题，请在 GitHub Issues 中提出。