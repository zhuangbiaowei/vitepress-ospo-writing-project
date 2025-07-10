# Gemini CLI 系统架构图

```mermaid
graph TB
    subgraph "用户层 (User Layer)"
        U[用户终端 Terminal]
        CMD[命令行输入 CLI Commands]
    end

    subgraph "CLI 包 (packages/cli)"
        subgraph "用户界面层"
            APP[App.tsx - 主应用组件]
            UI[UI Components]
            THEME[主题管理 Theme Manager]
            INPUT[输入处理 Input Handler]
        end
        
        subgraph "配置管理"
            CONFIG[配置加载 Config Loader]
            SETTINGS[设置管理 Settings Manager]
            AUTH_CLI[认证配置 Auth Config]
        end
        
        subgraph "启动与生命周期"
            MAIN[主入口 main()]
            GEMINI_TSX[gemini.tsx]
            LIFECYCLE[生命周期管理]
        end
    end

    subgraph "Core 包 (packages/core)"
        subgraph "核心引擎"
            CLIENT[Gemini Client]
            CHAT[GeminiChat 会话管理]
            CONTENT_GEN[内容生成器 ContentGenerator]
            REQUEST[请求处理 GeminiRequest]
        end
        
        subgraph "工具系统 (Tools)"
            TOOL_REG[工具注册中心 ToolRegistry]
            
            subgraph "文件系统工具"
                READ_FILE[读取文件 ReadFileTool]
                WRITE_FILE[写入文件 WriteFileTool]
                EDIT_TOOL[编辑工具 EditTool]
                LS_TOOL[目录列表 LSTool]
                GLOB_TOOL[文件匹配 GlobTool]
            end
            
            subgraph "搜索与查询工具"
                GREP_TOOL[文本搜索 GrepTool]
                WEB_SEARCH[网络搜索 WebSearchTool]
                WEB_FETCH[网页获取 WebFetchTool]
            end
            
            subgraph "系统工具"
                SHELL_TOOL[Shell命令 ShellTool]
                MEMORY_TOOL[记忆工具 MemoryTool]
            end
            
            subgraph "MCP 集成"
                MCP_CLIENT[MCP客户端 MCPClient]
                MCP_TOOL[MCP工具 MCPTool]
            end
        end
        
        subgraph "服务层"
            FILE_DISCOVERY[文件发现服务]
            GIT_SERVICE[Git 服务]
            MEMORY_SERVICE[记忆服务]
        end
        
        subgraph "提示词工程"
            PROMPTS[系统提示词]
            CONTEXT_MGR[上下文管理]
            TURN_MGR[对话轮次管理]
        end
        
        subgraph "认证与安全"
            AUTH_CORE[认证核心]
            OAUTH[OAuth2 处理]
            API_KEY[API密钥管理]
            VERTEX_AI[Vertex AI 集成]
        end
    end

    subgraph "外部服务 (External Services)"
        subgraph "Google AI Services"
            GEMINI_API[Gemini API]
            VERTEX_API[Vertex AI API]
            SEARCH_API[Google Search API]
        end
        
        subgraph "MCP 服务器"
            IMAGEN[Imagen MCP Server]
            VEO[Veo MCP Server] 
            LYRIA[Lyria MCP Server]
            CUSTOM_MCP[自定义 MCP 服务器]
        end
        
        subgraph "系统资源"
            FILE_SYS[文件系统]
            SHELL[系统Shell]
            GIT_REPO[Git 仓库]
        end
    end

    subgraph "配置与数据"
        ENV_CONFIG[环境配置 .env]
        GEMINI_CONFIG[.gemini/ 配置目录]
        MEMORY_FILES[记忆文件]
        HISTORY[会话历史]
    end

    %% 用户交互流
    U --> CMD
    CMD --> APP
    APP --> UI
    UI --> INPUT
    
    %% CLI 到 Core 的通信
    APP --> CLIENT
    CONFIG --> AUTH_CORE
    SETTINGS --> AUTH_CORE
    
    %% Core 内部流程
    CLIENT --> CHAT
    CHAT --> CONTENT_GEN
    CONTENT_GEN --> REQUEST
    REQUEST --> GEMINI_API
    
    %% 工具系统流程
    CHAT --> TOOL_REG
    TOOL_REG --> READ_FILE
    TOOL_REG --> WRITE_FILE
    TOOL_REG --> EDIT_TOOL
    TOOL_REG --> SHELL_TOOL
    TOOL_REG --> WEB_SEARCH
    TOOL_REG --> MCP_CLIENT
    
    %% MCP 集成
    MCP_CLIENT --> IMAGEN
    MCP_CLIENT --> VEO
    MCP_CLIENT --> LYRIA
    MCP_CLIENT --> CUSTOM_MCP
    
    %% 外部服务交互
    WEB_SEARCH --> SEARCH_API
    AUTH_CORE --> VERTEX_API
    OAUTH --> GEMINI_API
    
    %% 系统资源访问
    READ_FILE --> FILE_SYS
    WRITE_FILE --> FILE_SYS
    SHELL_TOOL --> SHELL
    GIT_SERVICE --> GIT_REPO
    
    %% 配置数据流
    ENV_CONFIG --> CONFIG
    GEMINI_CONFIG --> SETTINGS
    MEMORY_FILES --> MEMORY_SERVICE
    HISTORY --> CHAT

    %% 样式定义
    classDef userLayer fill:#e1f5fe
    classDef cliLayer fill:#f3e5f5
    classDef coreLayer fill:#e8f5e8
    classDef externalLayer fill:#fff3e0
    classDef configLayer fill:#fce4ec
    
    class U,CMD userLayer
    class APP,UI,CONFIG,SETTINGS,AUTH_CLI,MAIN cliLayer
    class CLIENT,CHAT,TOOL_REG,AUTH_CORE coreLayer
    class GEMINI_API,VERTEX_API,SEARCH_API,FILE_SYS,SHELL externalLayer
    class ENV_CONFIG,GEMINI_CONFIG,MEMORY_FILES,HISTORY configLayer
```

## 架构说明

### 1. 分层架构
- **用户层**: 终端用户界面和命令输入
- **CLI包**: 用户界面、配置管理、应用生命周期
- **Core包**: 核心业务逻辑、工具系统、AI交互
- **外部服务**: Google AI服务、MCP服务器、系统资源
- **配置数据**: 环境配置、用户设置、会话数据

### 2. 核心组件
- **GeminiChat**: 管理与AI模型的对话会话
- **ToolRegistry**: 统一的工具注册和调度系统
- **ContentGenerator**: 处理AI内容生成请求
- **MCPClient**: Model Context Protocol 客户端集成

### 3. 工具生态系统
- **文件系统工具**: 文件读写、编辑、目录操作
- **搜索工具**: 文本搜索、网络搜索、内容获取
- **系统工具**: Shell命令执行、记忆管理
- **MCP集成**: 支持多媒体生成和外部服务

### 4. 认证体系
- **多重认证**: OAuth2、API密钥、Vertex AI
- **安全管理**: 凭证存储、权限控制
- **环境适配**: 支持多种部署环境