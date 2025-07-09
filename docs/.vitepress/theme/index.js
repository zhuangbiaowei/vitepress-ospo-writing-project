import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    // 扩展应用实例
    // 可以在这里注册全局组件或添加全局属性
  }
}