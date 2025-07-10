# Gemini CLI 用户交互时序图

## 1. 完整用户对话流程 (Complete User Conversation Flow)

```mermaid
sequenceDiagram
    participant User as User
    participant Terminal as Terminal
    participant App as App
    participant Config as Config
    participant Chat as GeminiChat
    participant ContentGen as ContentGenerator
    participant ToolReg as ToolRegistry
    participant Tool as Tool
    participant GeminiAPI as Gemini API

    User->>Terminal: Start gemini command
    Terminal->>App: Initialize application
    App->>Config: Load config and auth
    Config->>App: Configuration complete
    App->>Terminal: Show welcome screen

    loop Conversation Loop
        User->>Terminal: Input query/command
        Terminal->>App: Process user input
        
        alt Slash command processing
            App->>App: Handle special commands
            App->>Terminal: Show command result
        else Normal conversation
            App->>Chat: Send user message
            Chat->>ContentGen: Generate content request
            ContentGen->>GeminiAPI: Call Gemini API
            GeminiAPI-->>ContentGen: Return response
            
            alt Contains tool calls
                ContentGen->>ToolReg: Execute tool calls
                ToolReg->>Tool: Call specific tool
                
                alt Requires user confirmation
                    Tool->>App: Request confirmation
                    App->>Terminal: Show confirmation dialog
                    Terminal->>User: Show tool execution details
                    User->>Terminal: Confirm/Cancel
                    Terminal->>App: User choice
                    App->>Tool: Pass confirmation result
                end
                
                Tool-->>ToolReg: Return tool result
                ToolReg-->>ContentGen: Tool execution complete
                ContentGen->>GeminiAPI: Send tool results
                GeminiAPI-->>ContentGen: Final response
            end
            
            ContentGen-->>Chat: Content generation complete
            Chat-->>App: Response ready
            App->>Terminal: Render response content
            Terminal->>User: Display AI response
        end
    end

    User->>Terminal: Ctrl+C or exit command
    Terminal->>App: Exit signal
    App->>Config: Cleanup resources
    App->>Terminal: Application shutdown
```

## 2. 工具调用确认流程 (Tool Call Confirmation Flow)

```mermaid
sequenceDiagram
    participant User as User
    participant App as App
    participant ToolExecutor as ToolExecutor
    participant Tool as Tool
    participant FileSystem as FileSystem

    App->>ToolExecutor: Execute tool call request
    ToolExecutor->>Tool: shouldConfirmExecute(params)
    Tool-->>ToolExecutor: Return confirmation details

    alt Requires confirmation
        ToolExecutor->>App: Request user confirmation
        App->>User: Show tool details and confirmation dialog
        Note over User,App: Display: tool name, params, expected operation
        
        User->>App: Choose confirm/cancel
        
        alt User confirms
            App->>ToolExecutor: Confirm execution
            ToolExecutor->>Tool: execute(params, signal)
            Tool->>FileSystem: Execute actual operation
            FileSystem-->>Tool: Operation result
            Tool-->>ToolExecutor: Tool execution result
            ToolExecutor-->>App: Execution complete
        else User cancels
            App->>ToolExecutor: Cancel execution
            ToolExecutor-->>App: Execution cancelled
        end
    else Auto execute (read-only)
        ToolExecutor->>Tool: execute(params, signal)
        Tool->>FileSystem: Execute operation
        FileSystem-->>Tool: Operation result
        Tool-->>ToolExecutor: Tool execution result
        ToolExecutor-->>App: Execution complete
    end
```

## 3. 认证流程 (Authentication Flow)

```mermaid
sequenceDiagram
    participant User as User
    participant App as App
    participant AuthManager as AuthManager
    participant OAuth2Handler as OAuth2Handler
    participant GeminiAPI as Gemini API
    participant Browser as Browser

    User->>App: Start application
    App->>AuthManager: Check authentication status
    
    alt First use or token expired
        AuthManager->>App: Authentication required
        App->>User: Show authentication options
        
        alt OAuth2 authentication
            User->>App: Choose Google login
            App->>OAuth2Handler: Start OAuth flow
            OAuth2Handler->>Browser: Open authentication URL
            User->>Browser: Complete Google login
            Browser->>OAuth2Handler: Return authorization code
            OAuth2Handler->>GeminiAPI: Exchange access token
            GeminiAPI-->>OAuth2Handler: Return access token
            OAuth2Handler-->>AuthManager: Authentication complete
        else API key authentication
            User->>App: Input API key
            App->>AuthManager: Validate API key
            AuthManager->>GeminiAPI: Test API call
            GeminiAPI-->>AuthManager: Validation result
        end
        
        AuthManager-->>App: Authentication status updated
    else Already authenticated
        AuthManager-->>App: Authentication valid
    end
    
    App->>User: Show ready status
```

## 4. MCP 服务器集成流程 (MCP Server Integration Flow)

```mermaid
sequenceDiagram
    participant App as App
    participant MCPClient as MCPClient
    participant MCPServer as MCPServer
    participant ToolRegistry as ToolRegistry
    participant User as User

    App->>MCPClient: Initialize MCP client
    MCPClient->>MCPServer: Connect to MCP server
    MCPServer-->>MCPClient: Connection confirmed
    
    MCPClient->>MCPServer: Request available tools
    MCPServer-->>MCPClient: Return tool definitions
    MCPClient->>ToolRegistry: Register discovered tools
    ToolRegistry-->>MCPClient: Registration complete
    
    loop Tool Call Loop
        User->>App: Request requiring MCP tool
        App->>ToolRegistry: Find and execute tool
        ToolRegistry->>MCPClient: Call MCP tool
        MCPClient->>MCPServer: Send tool call request
        MCPServer->>MCPServer: Execute actual operation
        MCPServer-->>MCPClient: Return execution result
        MCPClient-->>ToolRegistry: Tool result
        ToolRegistry-->>App: Complete execution
        App->>User: Display result
    end
```

## 5. 流式响应处理 (Streaming Response Handling)

```mermaid
sequenceDiagram
    participant User as User
    participant App as App
    participant Chat as GeminiChat
    participant GeminiAPI as Gemini API
    participant Terminal as Terminal

    User->>App: Send long text request
    App->>Chat: Start streaming conversation
    Chat->>GeminiAPI: Initiate streaming request
    
    loop Streaming Response
        GeminiAPI-->>Chat: Streaming data chunk
        Chat->>App: Update streaming status
        App->>Terminal: Real-time render content
        Terminal->>User: Display progressive response
    end
    
    GeminiAPI-->>Chat: Stream ended
    Chat->>App: Streaming complete
    App->>Terminal: Render final content
```

## 6. 错误处理流程 (Error Handling Flow)

```mermaid
sequenceDiagram
    participant User as User
    participant App as App
    participant ErrorHandler as ErrorHandler
    participant Logger as Logger
    participant Terminal as Terminal

    User->>App: Send request that causes error
    App->>App: Error occurs during processing
    App->>ErrorHandler: Handle error
    ErrorHandler->>Logger: Log error details
    
    alt Recoverable error
        ErrorHandler->>App: Provide fallback solution
        App->>Terminal: Show warning and continue
        Terminal->>User: Display warning message
    else Critical error
        ErrorHandler->>App: Graceful shutdown preparation
        App->>Terminal: Show error message
        Terminal->>User: Display error and exit guidance
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