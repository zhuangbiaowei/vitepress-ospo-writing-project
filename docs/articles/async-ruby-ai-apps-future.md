# 异步Ruby是AI应用的未来（它已经到来）

作为一名在Python异步生态系统中浸润了十年的机器学习工程师/科学家，重返Ruby就像是倒退了一个时代。异步革命在哪里？为什么大家仍然在使用线程处理一切？SolidQueue、Sidekiq、GoodJob——都是基于线程的。即使是较新的解决方案也默认使用相同的并发模型。

来自Python的我，见证了整个社区围绕`asyncio`重新组织，这看起来很奇怪。FastAPI取代了Flask。每个库都催生了异步孪生体。这种转变是彻底且必要的。

然后，在构建[RubyLLM](https://rubyllm.com/)和[Chat with Work](https://chatwithwork.com/)的过程中，我注意到*LLM通信是异步Ruby的杀手级应用*。流式AI响应的独特需求——长连接、逐token传输、数千个并发对话——恰好暴露了异步为什么重要。

这里有个令人兴奋的发现：一旦我理解了Ruby的异步方法，我意识到它实际上*优于*Python的方法。当Python强制所有人重写整个技术栈时，Ruby悄悄地构建了更好的东西。你现有的代码就能正常工作。没有语法改变。没有库迁移。只是在需要时获得更好的性能。

[Samuel Williams](https://github.com/ioquatix)和其他人多年来一直在构建的异步生态系统突然变得完全合理。我们只是需要正确的用例来看到它。

## 为什么LLM通信会破坏一切

LLM应用创造了一个完美风暴的挑战，暴露了基于线程的并发的每一个弱点：

### 1. 槽位饥饿

为任何基于线程的作业队列配置25个工作者：

```ruby
class StreamAIResponseJob < ApplicationJob
  def perform(chat, message)
    # 这个作业占用你25个槽位中的1个...
    chat.ask(message) do |chunk|
      # ...在整个流式传输期间（30-60秒）
      broadcast_chunk(chunk)
      # 线程99%的时间都在空闲，只是等待token
    end
    # 只有在完整响应后才释放槽位
  end
end
```

你的第26个用户？他们在排队等候。不是因为服务器忙碌，而是因为所有工作者都被等待token的作业占用了。

### 2. 资源倍增

每个线程都需要自己的：

- 数据库连接（25个线程 = 至少25个连接）
- 栈内存分配
- 操作系统线程管理开销

对于1000个并发对话，你需要1000个线程。每个线程都需要自己的数据库连接。那就是1000个数据库连接，用于99%时间都在空闲的线程。

### 3. 性能开销

真实基准测试显示：

- 创建一个线程：约80μs
- 线程上下文切换：约1.3μs
- 最大吞吐量：约5,000请求/秒

当你在处理数千个流式连接时，这些微秒累积成真正的延迟。

### 4. 可扩展性挑战

尝试创建10,000个线程，操作系统调度器开始遇到困难。开销变得压倒性。然而现代AI应用需要处理数千个并发对话。

这些不是独立的问题——它们都是相同架构不匹配的症状。LLM通信与传统后台作业根本不同。

## 理解并发：线程vs异步

要理解为什么LLM应用是异步的完美用例——以及为什么Ruby的实现如此优雅——我们需要从第一原理开始构建。

### 层次结构：进程、线程和纤程

把你的计算机想象成一栋办公楼：

- **进程**就像独立的办公室——每个都有自己锁着的门、家具和文件。它们看不到彼此的空间（内存隔离）。
- **线程**就像共享同一个办公室的工作者——他们可以访问相同的文件柜（共享内存），但需要协调以避免冲突。
- **纤程**就像一个工作者在桌子上处理多个任务——在等待某些东西（如电话）时手动在它们之间切换。

### 调度：核心区别

并发的基本问题是：谁决定何时在任务之间切换？

#### 线程：抢占式多任务

对于线程，操作系统是老板。它强制中断正在运行的线程，让其他线程轮流执行：

```ruby
# 你启动线程，但操作系统控制它们
threads = 10.times.map do |i|
  Thread.new do
    # 这可能在任何时刻被中断
    expensive_calculation(i)
    fetch_from_api(i)  # 每个线程在这里单独阻塞
    process_result(i)
  end
end
```

每个线程：

- 由操作系统内核调度
- 可以在执行中被中断（在Ruby中，100ms后）
- 在I/O操作上单独阻塞
- 需要操作系统资源和内核数据结构
- 需要自己的资源（如数据库连接）

#### 纤程：协作式并发

对于纤程，切换是自愿的——它们只在I/O边界让出：

```ruby
# 纤程协作地让出控制权
Async do
  fibers = 10.times.map do |i|
    Async do
      expensive_calculation(i)  # 运行到完成
      fetch_from_api(i)         # 在这里让出，其他纤程运行
      process_result(i)         # I/O完成后继续
    end
  end
end
```

每个纤程：

- 通过在I/O期间让出来调度自己
- 永远不会在计算中被中断
- 完全在用户空间管理（无内核参与）
- 通过事件循环共享资源

### Ruby的GVL：为什么纤程更有意义

Ruby的全局VM锁（GVL）意味着一次只有一个线程可以执行Ruby代码。线程在100ms时间片后被抢占。

这创造了一个有趣的动态：

```ruby
# CPU工作：由于GVL，线程帮助不大
threads = 4.times.map do
  Thread.new { calculate_fibonacci(40) }
end
# 耗时大约与顺序执行相同！

# I/O工作：线程确实并行化（I/O期间释放GVL）
threads = 4.times.map do
  Thread.new { Net::HTTP.get(uri) }
end
# 耗时为顺序执行的1/4
```

但问题是：如果线程只对I/O有帮助，*为什么要承担它们的开销*？

### I/O多路复用优势

这是纤程真正闪耀的地方。线程使用"一个线程，一个I/O操作"模型：

```ruby
# 传统线程方法
thread1 = Thread.new { socket1.read }  # 阻塞这个线程
thread2 = Thread.new { socket2.read }  # 阻塞这个线程
thread3 = Thread.new { socket3.read }  # 阻塞这个线程
# 需要3个线程处理3个并发I/O操作
```

纤程使用I/O多路复用——一个线程监控*所有*I/O：

```ruby
# Async的方法（简化）
Async do
  # 一个线程，多个I/O操作
  task1 = Async { socket1.read }  # 向选择器注册
  task2 = Async { socket2.read }  # 向选择器注册
  task3 = Async { socket3.read }  # 向选择器注册

  # 事件循环使用epoll/kqueue监控所有套接字
  # 当数据可用时恢复纤程
end
```

内核（通过`epoll`、`kqueue`或`io_uring`）可以通过单次系统调用监控数千个文件描述符。不需要每连接一个线程。

### 为什么纤程获胜：完整图景

让我们看看比较纤程和线程的真实基准数据：

**性能优势（Ruby 3.4数据）**：

- **20倍快的分配**：创建纤程需要约3μs vs 线程的约80μs
- **10倍快的上下文切换**：纤程切换约0.1μs vs 线程的约1.3μs
- **15倍高的吞吐量**：约80,000 vs 约5,000请求/秒

但真正的优势是**可扩展性**：

1. **更少的操作系统资源**：纤程在用户空间管理，避免内核开销
2. **高效调度**：无内核参与意味着更少开销
3. **I/O多路复用**：一个线程通过`epoll`/`kqueue`/`io_uring`监控数千个I/O操作
4. **GVL友好**：协作调度与Ruby的并发模型自然配合
5. **资源共享**：数据库连接和内存池自然共享

虽然纤程和线程之间的内存使用相当，但纤程不依赖操作系统资源。你可以创建比线程多得多的纤程，在它们之间更快地切换，并更高效地管理它们，同时监控数千个连接——全部来自用户空间。

## 异步如何解决每个LLM挑战

记住那四个问题吗？这里是异步如何解决每一个：

1. **不再有槽位饥饿**：纤程按需创建并立即销毁。没有固定的工作者池。
2. **共享资源**：一个进程配合少量池化数据库连接可以处理数千个对话。
3. **改进的性能**：创建快20倍，切换快10倍，调度开销少15倍（综合上限）。
4. **大幅改进的可扩展性**：10,000+并发纤程？没问题。操作系统甚至不知道它们的存在。

## Ruby的异步生态系统

Ruby的[async](https://github.com/socketry/async)之美在于其透明性。与Python要求到处使用`async`/`await`不同，Ruby代码就是能工作：

### 基础：[async](https://github.com/socketry/async) gem

```ruby
require 'async'
require 'net/http'

# 这段代码处理1000个并发请求
# 使用一个线程和最少的内存
Async do
  responses = 1000.times.map do |i|
    Async do
      uri = URI("https://api.openai.com/v1/chat/completions")
      # Net::HTTP在I/O期间自动让出
      response = Net::HTTP.post(uri, data.to_json, headers)
      JSON.parse(response.body)
    end
  end.map(&:wait)

  # 所有1000个请求并发完成
  process_responses(responses)
end
```

没有回调。没有promise。没有async/await关键字。只是能扩展的Ruby代码。

### 为什么RubyLLM就是能工作™

这里有个让我在发现时微笑的事情：[RubyLLM](https://rubyllm.com/)*免费*获得异步性能。不需要特殊的RubyLLM-async版本。不需要更改库代码。不需要配置。什么都不需要。

为什么？因为RubyLLM在内部使用`Net::HTTP`。当你把RubyLLM调用包装在Async块中时，`Net::HTTP`在网络I/O期间自动让出，允许数千个并发LLM对话在单个线程上发生。

```ruby
# 这就是并发LLM调用所需的全部
Async do
  10.times.map do
    Async do
      # RubyLLM自动变成非阻塞的
      # 因为Net::HTTP知道如何向纤程让出
      message = RubyLLM.chat.ask "解释量子计算"
      puts message.content
    end
  end.map(&:wait)
end
```

这是Ruby的最佳表现。遵循约定的库无需尝试就获得了超能力。它就是能工作，因为它建立在坚实的基础上。

### 生态系统的其余部分

- **[Falcon](https://github.com/socketry/falcon)**：为流式构建的多进程、多纤程Web服务器
- **[async-job](https://github.com/socketry/async-job)**：使用纤程的后台作业处理
- **[async-cable](https://github.com/socketry/async-cable)**：基于纤程并发的ActionCable替代品
- **[async-http](https://github.com/socketry/async-http)**：支持流式的全功能HTTP客户端

……以及[Socketry](https://github.com/orgs/socketry/repositories)提供的更多功能。

## 将Rails应用迁移到异步

迁移几乎不需要代码更改：

### 步骤1：更新你的Gemfile

```ruby
# Gemfile
# 注释掉基于线程的gem
# gem "puma"
# gem "sidekiq" / "good_job" / "solid_queue"
# gem "solid_cable"

# 添加异步gem
gem "falcon"
gem "async-job-adapter-active_job"
gem "async-cable"
```

### 步骤2：一行配置

```ruby
# config/application.rb
require "async/cable"

# config/environments/production.rb
config.active_job.queue_adapter = :async_job
```

### 步骤3：没有步骤3！

你现有的作业保持不变。你的频道不需要更新。

只需部署并观察。你将获得更多性能、更多容量和更好的响应时间。

## 何时使用什么

让我们实际一点——异步并非总是答案：

**使用线程用于：**

- CPU密集型工作
- 需要真正隔离的任务
- 不兼容纤程的传统C扩展

**使用异步用于：**

- I/O绑定操作
- API调用
- WebSocket、SSE和其他形式的流式传输
- LLM应用

## Ruby的新篇章

在Python异步世界多年后，我见证了当语言强制语法更改以访问异步并发的好处时社区会发生什么。库分裂。代码库分割。开发者与新语法和概念斗争。

Ruby选择了不同的路径——这是正确的。

我们正在见证Ruby的下一个进化。不是通过破坏性更改或生态系统分裂，而是通过深思熟虑的添加来让我们现有的代码更好。当与传统线程相比时似乎不必要的异步生态系统，当你遇到正确用例时突然变得至关重要。

LLM应用就是那个用例。长连接、流式响应和大规模并发的结合创造了完美风暴，让异步的好处变得不可否认。

[Samuel Williams](https://github.com/ioquatix)和[async](https://github.com/socketry/async)社区给了我们令人难以置信的工具。与Python不同，你不必重写一切来使用它。

对于那些构建下一代AI驱动应用的人来说，[async](https://github.com/socketry/async) Ruby不仅仅是一个选择——它是一个竞争优势。更低的成本、更好的性能、更简单的操作，而且你保留了现有的代码库。

未来是并发的。未来是流式的。未来是[async](https://github.com/socketry/async)的。

在Ruby中，那个未来与你已有的代码一起工作。

---

*[RubyLLM](https://rubyllm.com/)在生产中使用[async](https://github.com/socketry/async)为[Chat with Work](https://chatwithwork.com/)提供数千个并发AI对话。想要在Ruby中优雅的AI集成？查看[RubyLLM](https://rubyllm.com/)。*

*特别感谢[Samuel Williams](https://github.com/ioquatix)审阅这篇文章并提供证实这些性能声明的[纤程vs线程基准测试](https://github.com/socketry/performance/tree/adfd780c6b4842b9534edfa15e383e5dfd4b4137/fiber-vs-thread)。*

**加入对话：**我将在[EuRuKo 2025](https://2025.euruko.org/)、[San Francisco Ruby Conference 2025](https://sfruby.com/)和[RubyConf Thailand 2026](https://rubyconfth.com/)谈论异步Ruby和AI。让我们一起构建未来。