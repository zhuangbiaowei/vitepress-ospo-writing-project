# Mermaid 图表指南

:::tip 摘要
本文介绍如何在 VitePress 中使用 Mermaid 创建各种类型的图表，包括流程图、序列图、甘特图等。
:::

## 目录

[[toc]]

## 什么是 Mermaid？

Mermaid 是一个基于 JavaScript 的图表生成工具，允许您使用简单的文本语法创建复杂的图表和图形。它特别适用于技术文档、流程说明和系统架构设计。

## 基本语法

### 流程图（Flowchart）

```mermaid
flowchart TD
    A[开始] --> B{是否有数据？}
    B -->|是| C[处理数据]
    B -->|否| D[获取数据]
    C --> E[分析结果]
    D --> C
    E --> F[结束]
```

### 序列图（Sequence Diagram）

```mermaid
sequenceDiagram
    participant 用户
    participant 系统
    participant 数据库
    
    用户->>系统: 登录请求
    系统->>数据库: 验证用户
    数据库-->>系统: 返回结果
    系统-->>用户: 登录成功/失败
```

### 类图（Class Diagram）

```mermaid
classDiagram
    class User {
        +String name
        +String email
        +login()
        +logout()
    }
    
    class Admin {
        +manageUsers()
        +viewReports()
    }
    
    User <|-- Admin
```

### 状态图（State Diagram）

```mermaid
stateDiagram-v2
    [*] --> 未登录
    未登录 --> 已登录: 输入凭证
    已登录 --> 未登录: 注销
    已登录 --> 操作中: 执行操作
    操作中 --> 已登录: 操作完成
    操作中 --> 错误: 操作失败
    错误 --> 已登录: 重试
```

### 甘特图（Gantt Chart）

```mermaid
gantt
    title 项目开发计划
    dateFormat  YYYY-MM-DD
    section 设计阶段
    需求分析           :2024-01-01, 7d
    UI设计            :2024-01-08, 5d
    section 开发阶段
    前端开发          :2024-01-15, 14d
    后端开发          :2024-01-15, 21d
    section 测试阶段
    单元测试          :2024-02-05, 7d
    集成测试          :2024-02-12, 5d
```

### 饼图（Pie Chart）

```mermaid
pie title 技术栈使用情况
    "JavaScript" : 45
    "Python" : 25
    "Java" : 15
    "Go" : 10
    "其他" : 5
```

### GitGraph

```mermaid
gitgraph
    commit
    branch develop
    checkout develop
    commit
    commit
    checkout main
    merge develop
    commit
    branch feature
    checkout feature
    commit
    commit
    checkout develop
    merge feature
    checkout main
    merge develop
```

### ER图（Entity Relationship Diagram）

```mermaid
erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses
    
    CUSTOMER {
        string name
        string custNumber
        string sector
    }
    ORDER {
        int orderNumber
        string deliveryAddress
    }
    LINE-ITEM {
        string productCode
        int quantity
        float pricePerUnit
    }
```

### 用户旅程图（User Journey）

```mermaid
journey
    title 用户购物体验
    section 发现产品
      浏览网站: 5: 用户
      搜索产品: 3: 用户
      查看详情: 4: 用户
    section 购买过程
      添加到购物车: 2: 用户
      结算: 1: 用户
      支付: 1: 用户
    section 售后服务
      收到商品: 5: 用户
      使用产品: 5: 用户
      客服支持: 3: 用户
```

## 高级功能

### 子图（Subgraphs）

```mermaid
flowchart TB
    subgraph "前端"
        A[React应用]
        B[状态管理]
        C[路由系统]
    end
    
    subgraph "后端"
        D[API服务]
        E[业务逻辑]
        F[数据访问层]
    end
    
    subgraph "数据库"
        G[MySQL]
        H[Redis缓存]
    end
    
    A --> D
    D --> E
    E --> F
    F --> G
    D --> H
```

### 样式定制

```mermaid
flowchart LR
    id1["正常节点"]
    id2["强调节点"]
    id3["警告节点"]
    
    id1 --> id2
    id2 --> id3
    
    classDef emphasized fill:#f9f,stroke:#333,stroke-width:4px
    classDef warning fill:#ff9999,stroke:#333,stroke-width:2px,stroke-dasharray: 5 5
    
    class id2 emphasized
    class id3 warning
```

## 最佳实践

### 1. 保持简洁
- 避免过于复杂的图表
- 使用清晰的标签和描述
- 合理控制图表大小

### 2. 一致性
- 在整个文档中保持相似的样式
- 使用统一的命名约定
- 保持颜色和形状的一致性

### 3. 可读性
- 使用有意义的节点名称
- 添加必要的注释和说明
- 确保文字大小适中

### 4. 维护性
- 定期检查和更新图表
- 使用版本控制跟踪变更
- 保持代码的可读性

## 常见问题解决

### 图表不显示
1. 检查 Mermaid 语法是否正确
2. 确认代码块标记为 `mermaid`
3. 验证 VitePress 配置是否正确

### 中文显示问题
1. 确保文件编码为 UTF-8
2. 在必要时使用引号包围中文标签
3. 考虑使用英文标签以避免兼容性问题

### 性能优化
1. 避免创建过大的图表
2. 考虑将复杂图表分解为多个小图
3. 在需要时使用懒加载

## 参考资源

- [Mermaid 官方文档](https://mermaid-js.github.io/mermaid/)
- [Mermaid Live Editor](https://mermaid.live/)
- [VitePress Mermaid 插件文档](https://github.com/emersonbottero/vitepress-plugin-mermaid)

通过本指南，您现在应该能够在 VitePress 文档中有效地使用 Mermaid 图表来增强内容的可视化效果。