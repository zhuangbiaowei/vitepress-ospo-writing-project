# Gemini CLI 用户交互时序图

## 1. 完整用户对话流程 (Complete User Conversation Flow)

```mermaid
sequenceDiagram
    participant User as User 用户
    participant Terminal as Terminal 终端
    participant App as App组件
    participant Config as Config 配置
    participant Chat as GeminiChat
    participant ContentGen as ContentGenerator
    participant ToolReg as ToolRegistry
    participant Tool as Tool 工具
    participant GeminiAPI as Gemini API

    User->>Terminal: Start gemini command 启动命令
    Terminal->>App: Initialize application 初始化应用
    App->>Config: Load config and auth 加载配置认证
    Config->>App: Configuration complete 配置完成
    App->>Terminal: Show welcome screen 显示欢迎界面

    loop Conversation Loop 对话循环
        User->>Terminal: Input query/command 输入查询命令
        Terminal->>App: Process user input 处理用户输入
        
        alt Slash command processing 斜杠命令处理
            App->>App: Handle special commands 处理特殊命令
            App->>Terminal: Show command result 显示命令结果
        else Normal conversation 普通对话
            App->>Chat: Send user message 发送用户消息
            Chat->>ContentGen: Generate content request 生成内容请求
            ContentGen->>GeminiAPI: Call Gemini API 调用API
            GeminiAPI-->>ContentGen: Return response 返回响应
            
            alt Contains tool calls 包含工具调用
                ContentGen->>ToolReg: Execute tool calls 执行工具调用
                ToolReg->>Tool: Call specific tool 调用具体工具
                
                alt Requires user confirmation 需要用户确认
                    Tool->>App: Request confirmation 请求确认
                    App->>Terminal: Show confirmation dialog 显示确认对话框
                    Terminal->>User: Show tool execution details 显示工具执行详情
                    User->>Terminal: Confirm/Cancel 确认或取消
                    Terminal->>App: User choice 用户选择
                    App->>Tool: Pass confirmation result 传递确认结果
                end
                
                Tool-->>ToolReg: Return tool result 返回工具结果
                ToolReg-->>ContentGen: Tool execution complete 工具执行完成
                ContentGen->>GeminiAPI: Send tool results 发送工具结果
                GeminiAPI-->>ContentGen: Final response 最终响应
            end
            
            ContentGen-->>Chat: Content generation complete 内容生成完成
            Chat-->>App: Response ready 响应准备就绪
            App->>Terminal: Render response content 渲染响应内容
            Terminal->>User: Display AI response 显示AI响应
        end
    end

    User->>Terminal: Ctrl+C or exit command 退出命令
    Terminal->>App: Exit signal 退出信号
    App->>Config: Cleanup resources 清理资源
    App->>Terminal: Application shutdown 应用关闭
```

## 2. 工具调用确认流程 (Tool Call Confirmation Flow)

```mermaid
sequenceDiagram
    participant User as User 用户
    participant App as App组件
    participant ToolExecutor as ToolExecutor
    participant Tool as Tool 工具
    participant FileSystem as FileSystem 文件系统

    App->>ToolExecutor: Execute tool call request 执行工具调用请求
    ToolExecutor->>Tool: shouldConfirmExecute(params)
    Tool-->>ToolExecutor: Return confirmation details 返回确认详情

    alt Requires confirmation 需要确认
        ToolExecutor->>App: Request user confirmation 请求用户确认
        App->>User: Show tool details and confirmation dialog 显示工具详情确认对话框
        Note over User,App: Display: tool name, params, expected operation 显示工具名称参数预期操作
        
        User->>App: Choose confirm/cancel 选择确认或取消
        
        alt User confirms 用户确认
            App->>ToolExecutor: Confirm execution 确认执行
            ToolExecutor->>Tool: execute(params, signal)
            Tool->>FileSystem: Execute actual operation 执行实际操作
            FileSystem-->>Tool: Operation result 操作结果
            Tool-->>ToolExecutor: Tool execution result 工具执行结果
            ToolExecutor-->>App: Execution complete 执行完成
        else User cancels 用户取消
            App->>ToolExecutor: Cancel execution 取消执行
            ToolExecutor-->>App: Execution cancelled 执行取消
        end
    else Auto execute (read-only) 自动执行只读操作
        ToolExecutor->>Tool: execute(params, signal)
        Tool->>FileSystem: Execute operation 执行操作
        FileSystem-->>Tool: Operation result 操作结果
        Tool-->>ToolExecutor: Tool execution result 工具执行结果
        ToolExecutor-->>App: Execution complete 执行完成
    end
```

## 3. 认证流程 (Authentication Flow)

```mermaid
sequenceDiagram
    participant User as User 用户
    participant App as App组件
    participant AuthManager as AuthManager
    participant OAuth2Handler as OAuth2Handler
    participant GeminiAPI as Gemini API
    participant Browser as Browser 浏览器

    User->>App: Start application 启动应用
    App->>AuthManager: Check authentication status 检查认证状态
    
    alt First use or token expired 首次使用或token过期
        AuthManager->>App: Authentication required 需要认证
        App->>User: Show authentication options 显示认证选项
        
        alt OAuth2 authentication OAuth2认证
            User->>App: Choose Google login 选择Google登录
            App->>OAuth2Handler: Start OAuth flow 开始OAuth流程
            OAuth2Handler->>Browser: Open authentication URL 打开认证URL
            User->>Browser: Complete Google login 完成Google登录
            Browser->>OAuth2Handler: Return authorization code 返回授权码
            OAuth2Handler->>GeminiAPI: Exchange access token 交换访问令牌
            GeminiAPI-->>OAuth2Handler: Return access token 返回访问令牌
            OAuth2Handler-->>AuthManager: Authentication complete 认证完成
        else API key authentication API密钥认证
            User->>App: Input API key 输入API密钥
            App->>AuthManager: Validate API key 验证API密钥
            AuthManager->>GeminiAPI: Test API call 测试API调用
            GeminiAPI-->>AuthManager: Validation result 验证结果
        end
        
        AuthManager-->>App: Authentication status updated 认证状态更新
    else Already authenticated 已认证
        AuthManager-->>App: Authentication valid 认证有效
    end
    
    App->>User: Show ready status 显示就绪状态
```

## 4. MCP 服务器集成流程 (MCP Server Integration Flow)

```mermaid
sequenceDiagram
    participant App as App组件
    participant MCPClient as MCPClient
    participant MCPServer as MCP Server MCP服务器
    participant ToolRegistry as ToolRegistry
    participant User as User 用户

    App->>MCPClient: Initialize MCP client 初始化MCP客户端
    MCPClient->>MCPServer: Connect to MCP server 连接到MCP服务器
    MCPServer-->>MCPClient: Connection confirmed 连接确认
    
    MCPClient->>MCPServer: Request available tools 请求可用工具列表
    MCPServer-->>MCPClient: Return tool definitions 返回工具定义
    MCPClient->>ToolRegistry: Register discovered tools 注册发现的工具
    ToolRegistry-->>MCPClient: Registration complete 注册完成
    
    loop Tool Call Loop 工具调用循环
        User->>App: Request requiring MCP tool 发起需要MCP工具的请求
        App->>ToolRegistry: Find and execute tool 查找并执行工具
        ToolRegistry->>MCPClient: Call MCP tool 调用MCP工具
        MCPClient->>MCPServer: Send tool call request 发送工具调用请求
        MCPServer->>MCPServer: Execute actual operation 执行实际操作
        MCPServer-->>MCPClient: Return execution result 返回执行结果
        MCPClient-->>ToolRegistry: Tool result 工具结果
        ToolRegistry-->>App: Complete execution 完成执行
        App->>User: Display result 显示结果
    end
```

## 5. 流式响应处理 (Streaming Response Handling)

```mermaid
sequenceDiagram
    participant User as User 用户
    participant App as App组件
    participant Chat as GeminiChat
    participant GeminiAPI as Gemini API
    participant Terminal as Terminal 终端

    User->>App: Send long text request 发送长文本请求
    App->>Chat: Start streaming conversation 开始流式对话
    Chat->>GeminiAPI: Initiate streaming request 发起流式请求
    
    loop Streaming Response 流式响应
        GeminiAPI-->>Chat: Streaming data chunk 流式数据块
        Chat->>App: Update streaming status 更新流式状态
        App->>Terminal: Real-time render content 实时渲染内容
        Terminal->>User: Display progressive response 显示逐步响应
    end
    
    GeminiAPI-->>Chat: Stream ended 流结束
    Chat->>App: Streaming complete 流式完成
    App->>Terminal: Render final content 渲染最终内容
```

## 6. 错误处理流程 (Error Handling Flow)

```mermaid
sequenceDiagram
    participant User as User 用户
    participant App as App组件
    participant ErrorHandler as ErrorHandler 错误处理器
    participant Logger as Logger 日志记录器
    participant Terminal as Terminal 终端

    User->>App: Send request that causes error 发送导致错误的请求
    App->>App: Error occurs during processing 处理过程中发生错误
    App->>ErrorHandler: Handle error 处理错误
    ErrorHandler->>Logger: Log error details 记录错误详情
    
    alt Recoverable error 可恢复错误
        ErrorHandler->>App: Provide fallback solution 提供回退解决方案
        App->>Terminal: Show warning and continue 显示警告并继续
        Terminal->>User: Display warning message 显示警告消息
    else Critical error 严重错误
        ErrorHandler->>App: Graceful shutdown preparation 优雅关闭准备
        App->>Terminal: Show error message 显示错误消息
        Terminal->>User: Display error and exit guidance 显示错误和退出指导
    end
```

## 交互特点说明

### 1. 异步处理
- 支持非阻塞的用户交互
- 流式响应提供实时反馈
- 工具执行可以并行处理

### 2. 用户确认机制
- 危险操作需要显式确认
- 提供详细的操作预览
- 支持操作取消和回滚

### 3. 错误恢复
- 多层次错误处理策略
- 优雅降级和用户指导
- 详细的错误日志记录

### 4. 扩展性设计
- 模块化的组件交互
- 标准化的工具接口
- 可插拔的MCP服务集成

### 5. 用户体验优化
- 清晰的状态反馈
- 响应式的界面更新
- 直观的操作流程

这些交互时序图展示了 Gemini CLI 如何通过精心设计的用户交互流程，提供高效、安全、用户友好的AI助手体验。