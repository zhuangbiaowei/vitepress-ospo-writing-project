# Gemini CLI 用户交互时序图

## 1. 完整用户对话流程 (Complete User Conversation Flow)

```mermaid
sequenceDiagram
    participant User as 👤 用户
    participant Terminal as 🖥️ 终端
    participant App as 📱 App组件
    participant Config as ⚙️ Config
    participant Chat as 💬 GeminiChat
    participant ContentGen as 🤖 ContentGenerator
    participant ToolReg as 🔧 ToolRegistry
    participant Tool as 🛠️ 具体工具
    participant GeminiAPI as 🌐 Gemini API

    User->>Terminal: 启动 gemini 命令
    Terminal->>App: 初始化应用
    App->>Config: 加载配置和认证
    Config->>App: 配置完成
    App->>Terminal: 显示欢迎界面

    loop 对话循环
        User->>Terminal: 输入查询/命令
        Terminal->>App: 处理用户输入
        
        alt 斜杠命令处理
            App->>App: 处理特殊命令 (/help, /theme等)
            App->>Terminal: 显示命令结果
        else 普通对话
            App->>Chat: 发送用户消息
            Chat->>ContentGen: 生成内容请求
            ContentGen->>GeminiAPI: 调用 Gemini API
            GeminiAPI-->>ContentGen: 返回响应(可能包含工具调用)
            
            alt 包含工具调用
                ContentGen->>ToolReg: 执行工具调用
                ToolReg->>Tool: 调用具体工具
                
                alt 需要用户确认
                    Tool->>App: 请求确认
                    App->>Terminal: 显示确认对话框
                    Terminal->>User: 显示工具执行详情
                    User->>Terminal: 确认/取消
                    Terminal->>App: 用户选择
                    App->>Tool: 传递确认结果
                end
                
                Tool-->>ToolReg: 返回工具结果
                ToolReg-->>ContentGen: 工具执行完成
                ContentGen->>GeminiAPI: 发送工具结果
                GeminiAPI-->>ContentGen: 最终响应
            end
            
            ContentGen-->>Chat: 内容生成完成
            Chat-->>App: 响应准备就绪
            App->>Terminal: 渲染响应内容
            Terminal->>User: 显示AI响应
        end
    end

    User->>Terminal: Ctrl+C 或 退出命令
    Terminal->>App: 退出信号
    App->>Config: 清理资源
    App->>Terminal: 应用关闭
```

## 2. 工具调用确认流程 (Tool Call Confirmation Flow)

```mermaid
sequenceDiagram
    participant User as 👤 用户
    participant App as 📱 App组件
    participant ToolExecutor as 🔧 ToolExecutor
    participant Tool as 🛠️ 工具
    participant FileSystem as 📁 文件系统

    App->>ToolExecutor: 执行工具调用请求
    ToolExecutor->>Tool: shouldConfirmExecute(params)
    Tool-->>ToolExecutor: 返回确认详情

    alt 需要确认
        ToolExecutor->>App: 请求用户确认
        App->>User: 显示工具详情和确认对话框
        Note over User,App: 显示：工具名称、参数、预期操作
        
        User->>App: 选择确认/取消
        
        alt 用户确认
            App->>ToolExecutor: 确认执行
            ToolExecutor->>Tool: execute(params, signal)
            Tool->>FileSystem: 执行实际操作
            FileSystem-->>Tool: 操作结果
            Tool-->>ToolExecutor: 工具执行结果
            ToolExecutor-->>App: 执行完成
        else 用户取消
            App->>ToolExecutor: 取消执行
            ToolExecutor-->>App: 执行取消
        end
    else 自动执行(只读操作)
        ToolExecutor->>Tool: execute(params, signal)
        Tool->>FileSystem: 执行操作
        FileSystem-->>Tool: 操作结果
        Tool-->>ToolExecutor: 工具执行结果
        ToolExecutor-->>App: 执行完成
    end
```

## 3. 认证流程 (Authentication Flow)

```mermaid
sequenceDiagram
    participant User as 👤 用户
    participant App as 📱 App组件
    participant AuthManager as 🔐 AuthManager
    participant OAuth2Handler as 🌐 OAuth2Handler
    participant GeminiAPI as 🤖 Gemini API
    participant Browser as 🌏 浏览器

    User->>App: 启动应用
    App->>AuthManager: 检查认证状态
    
    alt 首次使用或token过期
        AuthManager->>App: 需要认证
        App->>User: 显示认证选项
        
        alt OAuth2 认证
            User->>App: 选择Google登录
            App->>OAuth2Handler: 开始OAuth流程
            OAuth2Handler->>Browser: 打开认证URL
            User->>Browser: 完成Google登录
            Browser->>OAuth2Handler: 返回授权码
            OAuth2Handler->>GeminiAPI: 交换访问令牌
            GeminiAPI-->>OAuth2Handler: 返回访问令牌
            OAuth2Handler-->>AuthManager: 认证完成
        else API密钥认证
            User->>App: 输入API密钥
            App->>AuthManager: 验证API密钥
            AuthManager->>GeminiAPI: 测试API调用
            GeminiAPI-->>AuthManager: 验证结果
        end
        
        AuthManager-->>App: 认证状态更新
    else 已认证
        AuthManager-->>App: 认证有效
    end
    
    App->>User: 显示就绪状态
```

## 4. MCP 服务器集成流程 (MCP Server Integration Flow)

```mermaid
sequenceDiagram
    participant App as 📱 App组件
    participant MCPClient as 🔌 MCPClient
    participant MCPServer as 🖥️ MCP服务器
    participant ToolRegistry as 🔧 ToolRegistry
    participant User as 👤 用户

    App->>MCPClient: 初始化MCP客户端
    MCPClient->>MCPServer: 连接到MCP服务器
    MCPServer-->>MCPClient: 连接确认
    
    MCPClient->>MCPServer: 请求可用工具列表
    MCPServer-->>MCPClient: 返回工具定义
    MCPClient->>ToolRegistry: 注册发现的工具
    ToolRegistry-->>MCPClient: 注册完成
    
    loop 工具调用循环
        User->>App: 发起需要MCP工具的请求
        App->>ToolRegistry: 查找并执行工具
        ToolRegistry->>MCPClient: 调用MCP工具
        MCPClient->>MCPServer: 发送工具调用请求
        MCPServer->>MCPServer: 执行实际操作(如图像生成)
        MCPServer-->>MCPClient: 返回执行结果
        MCPClient-->>ToolRegistry: 工具结果
        ToolRegistry-->>App: 完成执行
        App->>User: 显示结果
    end
```

## 5. 流式响应处理 (Streaming Response Handling)

```mermaid
sequenceDiagram
    participant User as 👤 用户
    participant App as 📱 App组件
    participant Chat as 💬 GeminiChat
    participant GeminiAPI as 🌐 Gemini API
    participant Terminal as 🖥️ 终端

    User->>App: 发送长文本请求
    App->>Chat: 开始流式对话
    Chat->>GeminiAPI: 发起流式请求
    
    loop 流式响应
        GeminiAPI-->>Chat: 流式数据块
        Chat->>App: 更新流式状态
        App->>Terminal: 实时渲染内容
        Terminal->>User: 显示逐步响应
    end
    
    GeminiAPI-->>Chat: 流结束
    Chat->>App: 流式完成
    App->>Terminal: 渲染最终内容
```

## 6. 错误处理流程 (Error Handling Flow)

```mermaid
sequenceDiagram
    participant User as 👤 用户
    participant App as 📱 App组件
    participant Component as 🔧 组件
    participant ErrorHandler as ⚠️ 错误处理器
    participant Logger as 📝 日志记录器

    Component->>Component: 发生错误
    Component->>ErrorHandler: 抛出错误
    ErrorHandler->>Logger: 记录错误日志
    
    alt 可恢复错误
        ErrorHandler->>App: 错误信息
        App->>User: 显示友好错误消息
        App->>User: 提供重试选项
        User->>App: 选择重试/继续
    else 严重错误
        ErrorHandler->>App: 严重错误
        App->>User: 显示错误详情
        App->>User: 提供帮助信息
        Note over User,App: 可能需要重启或配置修复
    end
```

## 交互流程说明

### 1. 用户体验设计原则
- **即时反馈**：用户输入后立即显示处理状态
- **流式渲染**：长响应内容逐步显示，提升感知性能
- **确认机制**：危险操作需要用户明确确认
- **错误恢复**：友好的错误提示和恢复建议

### 2. 工具调用安全机制
- **权限分级**：只读操作自动执行，修改操作需要确认
- **详细预览**：显示工具将要执行的具体操作
- **取消机制**：用户可以随时取消工具执行

### 3. 认证流程特点
- **多种方式**：支持OAuth2、API密钥等多种认证
- **状态管理**：持久化认证状态，避免重复登录
- **安全存储**：安全存储认证凭据

### 4. MCP集成优势
- **动态发现**：自动发现和注册MCP工具
- **透明调用**：MCP工具与内置工具统一接口
- **错误处理**：完善的MCP连接和执行错误处理

### 5. 流式处理优化
- **渐进式渲染**：长响应内容逐步显示
- **用户体验**：避免长时间等待的感觉
- **资源管理**：高效的内存和网络资源使用