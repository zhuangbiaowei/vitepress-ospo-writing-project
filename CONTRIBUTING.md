# 贡献指南

感谢您对本项目的关注！这个指南将帮助您快速了解如何为本项目贡献内容。

## 🛠️ 开发环境设置

### 先决条件

- Node.js (v18或更高版本)
- npm或yarn

### 环境搭建

1. 克隆仓库

```bash
git clone https://github.com/your-username/markdown-writing-project.git
cd markdown-writing-project
```

2. 安装依赖

```bash
npm install
```

3. 启动开发服务器

```bash
npm run dev
```

服务器启动后，访问`http://localhost:5173`查看网站。

## 📝 内容贡献流程

### 创建新文章

您可以使用我们的脚本工具快速创建新文章：

```bash
npm run new:article
```

按照提示输入文章标题，脚本会自动生成markdown文件和基本模板。

### 手动创建

1. 在`docs/articles/`目录下创建新的markdown文件
2. 使用以下模板开始编写：

```markdown
# 文章标题

:::tip 摘要
文章摘要...
:::

## 目录

[[toc]]

## 正文内容
...
```

3. 编辑`docs/.vitepress/config.js`文件，将新文章添加到导航菜单

## ✅ 提交指南

1. 创建一个功能分支

```bash
git checkout -b feature/your-feature-name
```

2. 提交更改

```bash
git add .
git commit -m "feat: add new article about xyz"
```

请遵循[约定式提交](https://www.conventionalcommits.org/zh-hans/v1.0.0/)规范。

3. 推送到远程仓库

```bash
git push origin feature/your-feature-name
```

4. 创建Pull Request

## 📋 内容规范

- 使用中文撰写文章，标题和文本应清晰简洁
- 使用Markdown语法格式化内容，保持结构清晰
- 为每篇文章添加适当的摘要和目录
- 参考资料部分列出所有引用的外部资源
- 图片应放在`docs/public/images/`目录下，并使用相对路径引用

## 🚀 实用脚本

本项目提供了多个实用脚本，可以通过npm运行：

- `npm run dev` - 启动开发服务器
- `npm run dev:host` - 启动可从局域网访问的开发服务器
- `npm run build` - 构建生产版本
- `npm run preview` - 预览生产构建
- `npm run clean` - 清理构建缓存
- `npm run lint:markdown` - 检查Markdown文件格式
- `npm run new:article` - 创建新文章

## 🙏 感谢

感谢您的贡献！如有任何问题，请随时开issue或与团队联系。