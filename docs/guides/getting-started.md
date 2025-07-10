# 开始写作

欢迎使用专业写作平台！本指南将帮助您快速上手，开始创作高质量的技术文档和文章。

## 🚀 快速开始

### 环境准备

确保您的开发环境已安装以下工具：

- **Node.js** (v18或更高版本)
- **npm** 或 **yarn** 包管理器
- 文本编辑器（推荐VSCode）

### 启动开发服务器

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

开发服务器启动后，访问 `http://localhost:5173` 即可预览您的内容。

## 📝 创建文章

### 1. 新建文章文件

在 `docs/articles/` 目录下创建新的Markdown文件：

```bash
touch docs/articles/my-new-article.md
```

### 2. 编写文章内容

使用以下模板开始编写：

```markdown
# 文章标题

文章摘要和介绍内容...

## 章节标题

章节内容...

### 子章节

更详细的内容...
```

### 3. 配置导航

在 `docs/.vitepress/config.js` 中添加您的文章到导航：

```javascript
sidebar: {
  '/articles/': [
    {
      text: '技术文章',
      items: [
        { text: '我的新文章', link: '/articles/my-new-article' }
      ]
    }
  ]
}
```

## 🎨 内容格式化

### 代码块

支持语法高亮的代码块：

```javascript
console.log('Hello, World!')
```

### 提示框

::: tip 提示
这是一个提示框
:::

::: warning 警告
这是一个警告框
:::

::: danger 危险
这是一个危险提示框
:::

### 数学公式

支持LaTeX数学公式：

行内公式：$E = mc^2$

块级公式：
$$
\sum_{i=1}^n x_i = x_1 + x_2 + \cdots + x_n
$$

## 🔧 高级功能

### 自定义容器

您可以使用自定义容器来突出重要内容：

::: details 点击展开详细信息
这里是详细信息的内容...
:::

### 代码组

````md
::: code-group

```js [config.js]
export default {
  name: 'MyConfig'
}
```

```ts [config.ts]
export default {
  name: 'MyConfig'
} as const
```

:::
````

## 📖 最佳实践

1. **清晰的标题结构** - 使用层次化的标题组织内容
2. **适当的代码示例** - 提供实用的代码片段
3. **丰富的视觉元素** - 使用图片、图表增强理解
4. **交互式内容** - 利用VitePress的特性增加互动性

## 🚀 发布内容

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

构建完成后，所有静态文件将生成在 `docs/.vitepress/dist/` 目录中，可以直接部署到任何静态托管服务。

---

现在您已经准备好开始专业写作了！如有任何问题，请参考[Markdown指南](/guides/markdown-guide)了解更多语法详情。