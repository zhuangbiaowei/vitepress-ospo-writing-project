#!/usr/bin/env node

/**
 * 文章检查工具
 * 
 * 该工具用于检查新添加的文章是否已正确配置：
 * 1. 检查文章文件是否存在
 * 2. 检查文章是否添加到文章索引页
 * 3. 检查文章是否添加到侧边栏配置
 * 
 * 使用方法: node scripts/article-checklist.js <article-filename-without-extension>
 * 
 * 例如: node scripts/article-checklist.js recruiting-open-source-talent
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const docsDir = path.join(rootDir, 'docs');
const articlesDir = path.join(docsDir, 'articles');
const configPath = path.join(docsDir, '.vitepress', 'config.js');
const indexPath = path.join(articlesDir, 'index.md');

// 获取要检查的文章
const articleId = process.argv[2];

if (!articleId) {
  console.error('错误: 请提供文章ID');
  console.log('使用方法: node scripts/article-checklist.js <article-id>');
  console.log('例如: node scripts/article-checklist.js recruiting-open-source-talent');
  process.exit(1);
}

// 检查结果
const results = {
  fileExists: false,
  inIndex: false,
  inSidebar: false
};

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

console.log(`${colors.blue}========== 文章检查工具 ==========${colors.reset}`);
console.log(`正在检查文章: ${colors.cyan}${articleId}${colors.reset}\n`);

// 1. 检查文章文件是否存在
const articlePath = path.join(articlesDir, `${articleId}.md`);
try {
  if (fs.existsSync(articlePath)) {
    results.fileExists = true;
    console.log(`${colors.green}✓${colors.reset} 文章文件存在: ${articlePath}`);
  } else {
    console.log(`${colors.red}✗${colors.reset} 文章文件不存在: ${articlePath}`);
  }
} catch (err) {
  console.error(`${colors.red}✗${colors.reset} 检查文件时出错:`, err);
}

// 2. 检查文章是否添加到索引页
try {
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  if (indexContent.includes(`/articles/${articleId}`)) {
    results.inIndex = true;
    console.log(`${colors.green}✓${colors.reset} 文章已添加到索引页`);
  } else {
    console.log(`${colors.red}✗${colors.reset} 文章未添加到索引页: ${indexPath}`);
    console.log(`  提示: 需要添加类似以下内容到文章列表:
    - [文章标题](/articles/${articleId})
      *文章描述*`);
  }
} catch (err) {
  console.error(`${colors.red}✗${colors.reset} 检查索引页时出错:`, err);
}

// 3. 检查文章是否添加到侧边栏配置
try {
  const configContent = fs.readFileSync(configPath, 'utf8');
  if (configContent.includes(`/articles/${articleId}`)) {
    results.inSidebar = true;
    console.log(`${colors.green}✓${colors.reset} 文章已添加到侧边栏配置`);
  } else {
    console.log(`${colors.red}✗${colors.reset} 文章未添加到侧边栏配置: ${configPath}`);
    console.log(`  提示: 需要添加类似以下内容到sidebar配置:
      { text: '文章标题', link: '/articles/${articleId}' }`);
  }
} catch (err) {
  console.error(`${colors.red}✗${colors.reset} 检查配置文件时出错:`, err);
}

// 总结结果
console.log(`\n${colors.blue}========== 检查结果 ==========${colors.reset}`);

if (results.fileExists && results.inIndex && results.inSidebar) {
  console.log(`${colors.green}✓ 恭喜! 文章 ${articleId} 配置完整${colors.reset}`);
} else {
  console.log(`${colors.yellow}⚠ 警告: 文章 ${articleId} 配置不完整${colors.reset}`);
  
  // 生成待办事项
  if (!results.fileExists) {
    console.log(`${colors.magenta}→ 待办:${colors.reset} 创建文章文件 ${articlePath}`);
  }
  if (!results.inIndex) {
    console.log(`${colors.magenta}→ 待办:${colors.reset} 将文章添加到索引页 ${indexPath}`);
  }
  if (!results.inSidebar) {
    console.log(`${colors.magenta}→ 待办:${colors.reset} 将文章添加到侧边栏配置 ${configPath}`);
  }
}

// 添加到new:article脚本的提示
if (results.fileExists) {
  console.log(`\n${colors.blue}提示:${colors.reset} 运行以下命令查看效果:`);
  console.log(`  npm run dev`);
  console.log(`  然后访问: /articles/${articleId}`);
}