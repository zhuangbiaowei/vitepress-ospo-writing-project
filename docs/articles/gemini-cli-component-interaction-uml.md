# Gemini CLI 组件交互 UML 图

## 1. 核心类图 (Core Class Diagram)

```mermaid
classDiagram
    class Config {
        -toolRegistry: ToolRegistry
        -sessionId: string
        -contentGeneratorConfig: ContentGeneratorConfig
        -embeddingModel: string
        +initialize(): Promise~void~
        +getGeminiClient(): GeminiClient
        +getToolRegistry(): ToolRegistry
        +getApprovalMode(): ApprovalMode
        +getSandbox(): SandboxConfig
    }

    class GeminiClient {
        -config: Config
        -authType: AuthType
        +generateContent(contents: Content[], config: GenerateContentConfig): Promise~GenerateContentResponse~
        +authenticate(): Promise~void~
    }

    class GeminiChat {
        -config: Config
        -contentGenerator: ContentGenerator
        -history: Content[]
        -sendPromise: Promise~void~
        +sendMessage(message: string): Promise~GenerateContentResponse~
        +getHistory(): Content[]
        +extractCuratedHistory(): Content[]
    }

    class ContentGenerator {
        -client: GeminiClient
        -config: ContentGeneratorConfig
        +generateContent(request: GenerateContentRequest): Promise~GenerateContentResponse~
        +handleToolCalls(tools: ToolCall[]): Promise~ToolResult[]~
    }

    class ToolRegistry {
        -tools: Map~string, Tool~
        -mcpTools: DiscoveredMCPTool[]
        +registerTool(tool: Tool): void
        +getTool(name: string): Tool
        +executeTools(toolCalls: ToolCall[]): Promise~ToolResult[]~
        +discoverMcpTools(): Promise~void~
    }

    class BaseTool {
        <<abstract>>
        +name: string
        +displayName: string
        +description: string
        +schema: FunctionDeclaration
        +validateToolParams(params: any): string|null
        +shouldConfirmExecute(params: any): Promise~boolean~
        +execute(params: any, signal: AbortSignal): Promise~ToolResult~
    }

    class ReadFileTool {
        +execute(params: ReadFileParams): Promise~ToolResult~
    }

    class WriteFileTool {
        +execute(params: WriteFileParams): Promise~ToolResult~
    }

    class EditTool {
        +execute(params: EditParams): Promise~ToolResult~
    }

    class ShellTool {
        +execute(params: ShellParams): Promise~ToolResult~
    }

    class WebSearchTool {
        +execute(params: WebSearchParams): Promise~WebSearchToolResult~
    }

    class MCPClient {
        -servers: Map~string, MCPServerConfig~
        -clients: Map~string, Client~
        +connectAndDiscover(serverName: string): Promise~void~
        +executeToolCall(toolCall: ToolCall): Promise~ToolResult~
        +discoverMcpTools(): Promise~DiscoveredMCPTool[]~
    }

    class App {
        -config: Config
        -settings: LoadedSettings
        -history: HistoryItem[]
        +handleUserInput(input: string): void
        +processSlashCommand(command: string): void
        +displayResponse(response: string): void
    }

    %% 继承关系
    BaseTool <|-- ReadFileTool
    BaseTool <|-- WriteFileTool
    BaseTool <|-- EditTool
    BaseTool <|-- ShellTool
    BaseTool <|-- WebSearchTool

    %% 依赖关系
    Config --> ToolRegistry
    Config --> GeminiClient
    GeminiChat --> ContentGenerator
    GeminiChat --> Config
    ContentGenerator --> GeminiClient
    ContentGenerator --> ToolRegistry
    ToolRegistry --> BaseTool
    ToolRegistry --> MCPClient
    App --> Config
    App --> GeminiChat
```

## 2. 工具系统交互图 (Tool System Interaction)

```mermaid
classDiagram
    class ToolCall {
        +name: string
        +args: Record~string, any~
        +id: string
    }

    class ToolResult {
        +llmContent: string
        +returnDisplay: string
        +toolCallId?: string
    }

    class ToolCallConfirmationDetails {
        +confirmationMessage: string
        +confirmationPrompt: string
        +requiresConfirmation: boolean
    }

    class ToolExecutor {
        -toolRegistry: ToolRegistry
        -approvalMode: ApprovalMode
        +executeToolCalls(toolCalls: ToolCall[]): Promise~ToolResult[]~
        +confirmExecution(tool: Tool, params: any): Promise~boolean~
    }

    class ModifiableTool {
        <<interface>>
        +isModifying: boolean
        +requiresConfirmation(): boolean
    }

    %% 关系
    ToolExecutor --> ToolRegistry
    ToolExecutor --> ToolCall
    ToolExecutor --> ToolResult
    BaseTool --> ToolCallConfirmationDetails
    ModifiableTool <|.. EditTool
    ModifiableTool <|.. WriteFileTool
    ModifiableTool <|.. ShellTool
```

## 3. 认证系统类图 (Authentication System)

```mermaid
classDiagram
    class AuthType {
        <<enumeration>>
        LOGIN_WITH_GOOGLE
        USE_GEMINI
        USE_VERTEX_AI
        CLOUD_SHELL
    }

    class OAuth2Handler {
        -clientId: string
        -clientSecret: string
        -redirectUri: string
        +authenticate(): Promise~AccessToken~
        +refreshToken(refreshToken: string): Promise~AccessToken~
        +getAuthUrl(): string
    }

    class APIKeyAuth {
        -apiKey: string
        +validate(): boolean
        +getHeaders(): Record~string, string~
    }

    class VertexAIAuth {
        -projectId: string
        -location: string
        -credentials: ServiceAccountCredentials
        +authenticate(): Promise~AccessToken~
        +getClient(): VertexAIClient
    }

    class AuthManager {
        -authType: AuthType
        -oauth2Handler: OAuth2Handler
        -apiKeyAuth: APIKeyAuth
        -vertexAuth: VertexAIAuth
        +authenticate(): Promise~void~
        +validateAuthMethod(authType: string): string|null
        +getAuthenticatedClient(): GeminiClient
    }

    %% 关系
    AuthManager --> AuthType
    AuthManager --> OAuth2Handler
    AuthManager --> APIKeyAuth
    AuthManager --> VertexAIAuth
    GeminiClient --> AuthManager
```

## 4. MCP 集成系统 (MCP Integration System)

```mermaid
classDiagram
    class MCPServerConfig {
        +command?: string
        +args?: string[]
        +url?: string
        +httpUrl?: string
        +timeout?: number
        +trust?: boolean
        +includeTools?: string[]
        +excludeTools?: string[]
    }

    class MCPServerStatus {
        <<enumeration>>
        DISCONNECTED
        CONNECTING
        CONNECTED
    }

    class DiscoveredMCPTool {
        +name: string
        +description: string
        +schema: FunctionDeclaration
        +serverName: string
        +execute(params: any): Promise~ToolResult~
    }

    class MCPTransport {
        <<interface>>
        +connect(): Promise~void~
        +disconnect(): Promise~void~
        +sendRequest(request: any): Promise~any~
    }

    class StdioTransport {
        +command: string
        +args: string[]
        +connect(): Promise~void~
    }

    class SSETransport {
        +url: string
        +connect(): Promise~void~
    }

    class HTTPTransport {
        +httpUrl: string
        +headers: Record~string, string~
        +connect(): Promise~void~
    }

    %% 关系
    MCPClient --> MCPServerConfig
    MCPClient --> MCPServerStatus
    MCPClient --> DiscoveredMCPTool
    MCPTransport <|.. StdioTransport
    MCPTransport <|.. SSETransport
    MCPTransport <|.. HTTPTransport
    MCPClient --> MCPTransport
```

## 5. 用户界面组件关系 (UI Component Relations)

```mermaid
classDiagram
    class App {
        -config: Config
        -settings: LoadedSettings
        -history: HistoryItem[]
        -streamingState: StreamingState
        +render(): JSX.Element
        +handleUserInput(input: string): void
    }

    class InputPrompt {
        -value: string
        -onSubmit: (value: string) => void
        -placeholder: string
        +render(): JSX.Element
    }

    class HistoryItemDisplay {
        -item: HistoryItem
        -showDetails: boolean
        +render(): JSX.Element
    }

    class LoadingIndicator {
        -isLoading: boolean
        -message: string
        +render(): JSX.Element
    }

    class ThemeManager {
        -themes: Map~string, Theme~
        -activeTheme: string
        +setActiveTheme(name: string): boolean
        +getTheme(name: string): Theme
    }

    class StreamingContext {
        +streamingState: StreamingState
        +updateOutput: (output: string) => void
        +setStreamingState: (state: StreamingState) => void
    }

    %% 关系
    App --> InputPrompt
    App --> HistoryItemDisplay
    App --> LoadingIndicator
    App --> ThemeManager
    App --> StreamingContext
```

## 组件交互说明

### 1. 核心交互流程
- **Config** 作为中央配置管理器，协调各个组件
- **GeminiChat** 管理与AI的对话状态和历史
- **ToolRegistry** 统一管理和调度所有工具
- **ContentGenerator** 处理AI内容生成和工具调用

### 2. 工具系统设计
- **BaseTool** 提供统一的工具接口
- **ModifiableTool** 标识需要用户确认的工具
- **ToolExecutor** 负责工具调用的生命周期管理

### 3. 认证系统架构
- **AuthManager** 统一管理多种认证方式
- 支持OAuth2、API密钥、Vertex AI等多种认证
- 与GeminiClient紧密集成

### 4. MCP集成特点
- 支持多种传输协议（stdio、SSE、HTTP）
- 动态发现和注册MCP工具
- 状态管理和错误处理

### 5. UI组件架构
- 基于React和Ink构建的终端UI
- 流式输出和实时更新支持
- 主题系统和用户体验优化