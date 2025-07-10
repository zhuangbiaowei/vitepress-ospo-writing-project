# 贡献指南

感谢您对我们项目的贡献！本指南将帮助您了解如何向本项目添加新的内容和修改现有内容。

## 文章添加流程

为了确保新增文章能够正确显示在网站中，请遵循以下完整流程：

### 1. 创建文章文件

您可以通过以下两种方式之一创建新文章：

#### 使用自动化脚本（推荐）

```bash
npm run new:article
```

根据提示输入文章标题，系统会自动生成文件名并创建带模板的文件。

#### 手动创建文件

在 `docs/articles/` 目录下创建一个新的 Markdown 文件，文件名建议使用英文，以 `.md` 为扩展名。例如：`recruiting-open-source-talent.md`。

### 2. 编写文章内容

按照 Markdown 格式编写您的文章内容。可参考 [Markdown 指南](/guides/markdown-guide) 了解语法详细信息。

### 3. 更新文章列表

这一步非常重要！必须完成以下两步操作，才能确保文章正确显示：

#### 3.1 添加到文章索引页

编辑 `docs/articles/index.md` 文件，将新文章添加到文章列表或相应分类中，例如：

```markdown
### 开源管理

- [如何在企业内部建立OSPO（开源项目办公室）](/articles/ospo-guide)  
  *深入探讨企业如何建立和运营开源项目办公室，包括组织架构、流程设计和最佳实践。*

- [如何从开源社区招募人才？](/articles/recruiting-open-source-talent)  
  *全面探讨从开源社区识别、吸引和招募优秀技术人才的策略、方法和最佳实践。*
```

#### 3.2 添加到侧边栏配置

编辑 `docs/.vitepress/config.js` 文件，将新文章添加到侧边栏配置项中：

```javascript
sidebar: {
  '/articles/': [
    {
      text: '技术文章',
      items: [
        { text: '如何在企业内部建立OSPO', link: '/articles/ospo-guide' },
        { text: '如何从开源社区招募人才', link: '/articles/recruiting-open-source-talent' }
        // 在这里添加新文章
      ]
    }
  ],
  // 其他侧边栏配置...
}
```

### 4. 本地预览

执行以下命令，在本地预览新增文章的显示效果：

```bash
npm run dev
```

访问 /articles/ 检查文章列表和侧边栏是否正确显示新文章。

### 5. 构建并部署

确认无误后，可以构建和部署站点：

```bash
npm run build
```

## 文章检查清单

在提交新文章前，请检查以下事项：

- [ ] 文章内容已完成并符合 Markdown 格式
- [ ] 文章已添加到 `docs/articles/index.md` 文件中的列表
- [ ] 文章已添加到 `docs/.vitepress/config.js` 的侧边栏配置
- [ ] 本地预览确认文章显示正常
- [ ] 确认文章在文章列表页可见
- [ ] 确认文章在侧边栏可见
- [ ] 确认文章的链接可正常访问

## 注意事项

- 文章使用中文时，文件名建议使用英文或拼音（避免 URL 编码问题）
- 链接路径不需要包含 `.md` 扩展名
- 文章图片应放在 `docs/public/images/` 目录下
- 代码示例建议使用代码块并指定语言，以启用语法高亮

## 帮助与支持

如果您在贡献过程中遇到任何问题，请参考 [VitePress 文档](https://vitepress.dev/) 或联系项目维护者获取支持。