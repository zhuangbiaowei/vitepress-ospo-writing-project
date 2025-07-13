import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(defineConfig({
  // Site metadata
  title: 'Professional Writing Hub',
  description: 'A professional markdown writing platform for technical documentation and articles',
  
  // Clean URLs
  cleanUrls: true,
  
  // Base URL for GitHub Pages deployment
  // 注意：如果您的仓库名不是根域名，请设置为 /your-repo-name/
  base: '/vitepress-ospo-writing-project/',
  
  // Language and internationalization
  lang: 'zh-CN',
  
  // Head configuration
  head: [
    ['meta', { name: 'theme-color', content: '#3c3c3c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/vitepress-ospo-writing-project/logo.svg' }],
    ['meta', { name: 'author', content: 'Professional Writing Hub' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Professional Writing Hub' }],
    ['meta', { property: 'og:description', content: 'A professional markdown writing platform for technical documentation and articles' }],
  ],

  // Theme configuration
  themeConfig: {
    // Site title and logo
    siteTitle: 'Writing Hub',
    
    // Navigation
    nav: [
      { text: '首页', link: '/' },
      { 
        text: '文章', 
        items: [
          { text: 'OSPO指南', link: '/articles/ospo-guide' },
          { text: '所有文章', link: '/articles/' }
        ]
      },
      { text: '指南', link: '/guides/' },
      { text: '关于', link: '/about' }
    ],

    // Sidebar configuration
    sidebar: {
      '/articles/': [
        {
          text: '开源管理',
          items: [
            { text: '如何在企业内部建立OSPO', link: '/articles/ospo-guide' },
            { text: '如何从开源社区招募人才', link: '/articles/recruiting-open-source-talent' }
          ]
        },
        {
          text: '可视化与图表',
          items: [
            { text: 'Mermaid 图表指南', link: '/articles/mermaid-diagram-guide' }
          ]
        },
        {
          text: 'Gemini CLI 系统架构分析',
          items: [
            { text: 'Gemini CLI 深度分析报告', link: '/articles/gemini-cli-comprehensive-analysis-report' },
            { text: 'Gemini CLI 系统架构图', link: '/articles/gemini-cli-system-architecture' },
            { text: 'Gemini CLI 组件交互 UML 图', link: '/articles/gemini-cli-component-interaction-uml' },
            { text: 'Gemini CLI 用户交互时序图', link: '/articles/gemini-cli-user-interaction-sequence' },
            { text: 'Gemini CLI 数据流程图', link: '/articles/gemini-cli-data-flow-diagram' }
          ]
        }
      ],
      '/guides/': [
        {
          text: '写作指南',
          items: [
            { text: '开始写作', link: '/guides/getting-started' },
            { text: 'Markdown指南', link: '/guides/markdown-guide' }
          ]
        }
      ]
    },

    // Social links
    socialLinks: [
      { icon: 'github', link: 'https://github.com' }
    ],

    // Footer
    footer: {
      message: 'Built with VitePress',
      copyright: 'Copyright © 2024 Professional Writing Hub'
    },

    // Search configuration
    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                searchBox: {
                  resetButtonTitle: '清除查询条件',
                  resetButtonAriaLabel: '清除查询条件',
                  cancelButtonText: '取消',
                  cancelButtonAriaLabel: '取消'
                },
                startScreen: {
                  recentSearchesTitle: '搜索历史',
                  noRecentSearchesText: '没有搜索历史',
                  saveRecentSearchButtonTitle: '保存至搜索历史',
                  removeRecentSearchButtonTitle: '从搜索历史中移除',
                  favoriteSearchesTitle: '收藏',
                  removeFavoriteSearchButtonTitle: '从收藏中移除'
                },
                errorScreen: {
                  titleText: '无法获取结果',
                  helpText: '你可能需要检查你的网络连接'
                },
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭'
                },
                noResultsScreen: {
                  noResultsText: '无法找到相关结果',
                  suggestedQueryText: '你可以尝试查询',
                  reportMissingResultsText: '你认为该查询应该有结果？',
                  reportMissingResultsLinkText: '点击反馈'
                }
              }
            }
          }
        }
      }
    },

    // Edit link
    editLink: {
      pattern: 'https://github.com/your-username/your-repo/edit/main/docs/:path',
      text: '在GitHub上编辑此页面'
    },

    // Last updated
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },

    // Document outline
    outline: {
      level: [2, 3],
      label: '页面导航'
    },

    // Previous/Next links
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    // Return to top
    returnToTopLabel: '回到顶部',

    // External link icon
    externalLinkIcon: true
  },

  // Markdown configuration
  markdown: {
    // Code block line numbers
    lineNumbers: true,
    
    // Math support
    math: true,
    
    // Container configuration
    container: {
      tipLabel: '提示',
      warningLabel: '警告',
      dangerLabel: '危险',
      infoLabel: '信息',
      detailsLabel: '详细信息'
    }
  },

  // Mermaid configuration
  mermaid: {
    // Configuration options for Mermaid
    theme: 'default',
    startOnLoad: true,
    flowchart: {
      useMaxWidth: true,
      htmlLabels: true
    }
  },

  // Build configuration
  outDir: '../dist',
  assetsDir: 'assets',
  
  // Development server configuration
  server: {
    port: 3000,
    host: true
  }
}))