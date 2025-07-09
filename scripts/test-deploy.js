#!/usr/bin/env node

/**
 * 部署测试脚本
 * 验证构建输出和部署配置
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

function log(message, color = RESET) {
  console.log(`${color}${message}${RESET}`);
}

function checkFile(path, description) {
  if (existsSync(path)) {
    log(`✓ ${description}`, GREEN);
    return true;
  } else {
    log(`✗ ${description}`, RED);
    return false;
  }
}

async function main() {
  log('🚀 开始部署测试...', YELLOW);

  // 检查必要文件
  const checks = [
    ['.github/workflows/deploy.yml', 'GitHub Actions 工作流配置'],
    ['docs/.vitepress/config.js', 'VitePress 配置文件'],
    ['docs/public/.nojekyll', '.nojekyll 文件'],
    ['package.json', 'package.json 文件']
  ];

  let allPassed = true;
  for (const [path, description] of checks) {
    if (!checkFile(path, description)) {
      allPassed = false;
    }
  }

  // 检查构建输出
  try {
    log('\n📦 运行构建测试...', YELLOW);
    execSync('npm run build', { stdio: 'inherit' });
    
    // 检查构建产物
    const distFiles = [
      'dist/index.html',
      'dist/assets',
      'dist/articles/index.html',
      'dist/.nojekyll'
    ];

    log('\n🔍 检查构建产物...', YELLOW);
    for (const file of distFiles) {
      if (!checkFile(file, `构建文件: ${file}`)) {
        allPassed = false;
      }
    }

  } catch (error) {
    log('✗ 构建失败', RED);
    allPassed = false;
  }

  // 检查 GitHub Actions 配置
  try {
    const workflowContent = readFileSync('.github/workflows/deploy.yml', 'utf-8');
    if (workflowContent.includes('actions/checkout@v4') && 
        workflowContent.includes('actions/setup-node@v4') &&
        workflowContent.includes('actions/upload-pages-artifact@v3')) {
      log('✓ GitHub Actions 使用最新版本', GREEN);
    } else {
      log('✗ GitHub Actions 版本需要更新', RED);
      allPassed = false;
    }
  } catch (error) {
    log('✗ 无法读取 GitHub Actions 配置', RED);
    allPassed = false;
  }

  // 总结
  log('\n📋 测试总结:', YELLOW);
  if (allPassed) {
    log('🎉 所有检查通过！部署配置正确。', GREEN);
    log('\n下一步操作：');
    log('1. 将代码推送到 GitHub 仓库');
    log('2. 在仓库设置中启用 GitHub Pages');
    log('3. 选择 "GitHub Actions" 作为部署源');
    log('4. 推送到 main 分支触发自动部署');
  } else {
    log('❌ 存在配置问题，请检查上述错误。', RED);
    process.exit(1);
  }
}

main().catch(console.error);