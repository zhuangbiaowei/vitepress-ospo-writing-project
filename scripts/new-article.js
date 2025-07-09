#!/usr/bin/env node

/**
 * 新建文章脚本
 * 
 * 使用方法: npm run new:article
 * 
 * 会提示输入文章标题，然后创建一个新的markdown文件，
 * 并填充基本模板，包括标题、日期和摘要部分
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARTICLES_DIR = path.join(__dirname, '..', 'docs', 'articles');

// 创建命令行交互接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 获取当前日期
const getFormattedDate = () => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

// 生成文件名
const generateFilename = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-') // 保留中文和英文字母数字
    .replace(/^-+|-+$/g, '') // 去除头尾横线
    .substring(0, 100) + '.md'; // 限制长度并添加后缀
};

// 生成文章模板
const generateTemplate = (title) => {
  const date = getFormattedDate();
  
  return `# ${title}

:::tip 摘要
这里是文章摘要，简要描述文章内容和主要观点。
:::

## 目录

[[toc]]

## 引言

在这里介绍文章背景和主要内容...

## 正文部分

### 第一部分

内容...

### 第二部分

内容...

## 结论

总结观点和结论...

## 参考资料

1. 参考资料1
2. 参考资料2
`;
};

// 主函数
const main = () => {
  // 确保文章目录存在
  if (!fs.existsSync(ARTICLES_DIR)) {
    fs.mkdirSync(ARTICLES_DIR, { recursive: true });
  }

  // 提示输入文章标题
  rl.question('请输入文章标题: ', (title) => {
    if (!title.trim()) {
      console.error('错误: 文章标题不能为空');
      rl.close();
      return;
    }

    const filename = generateFilename(title);
    const filePath = path.join(ARTICLES_DIR, filename);

    // 检查文件是否已经存在
    if (fs.existsSync(filePath)) {
      console.error(`错误: 文件 ${filename} 已经存在`);
      rl.close();
      return;
    }

    // 生成文章内容并写入文件
    const content = generateTemplate(title);
    fs.writeFileSync(filePath, content, 'utf8');

    console.log(`✅ 成功创建文章: ${filePath}`);
    console.log('');
    console.log('下一步:');
    console.log('1. 编辑文章内容');
    console.log(`2. 将文章链接添加到目录 (编辑 docs/.vitepress/config.js)`);
    console.log('3. 运行 npm run dev 预览文章');
    console.log('');

    rl.close();
  });
};

// 运行主函数
main();