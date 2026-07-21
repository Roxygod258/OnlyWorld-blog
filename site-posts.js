window.ONLYWORLD_POSTS = {   /*每次编辑前记得复制模板*/
  notes: [
    /* 文章模板：复制后取消注释并填写所有字段。
    {
      id: "unique-note-id",
      title: "文章标题",
      date: "2026-07-20",
      category: "Web",
      tags: ["", "", ""],
      summary: "文章摘要",
      readTime: "5 分钟",
      content: `<p>文章正文</p>`,
    },
    */
    {
      id: "web-security-basics",
      title: "Web 渗透测试基础：从请求分析到信息收集",
      date: "2026-07-20",
      category: "Web",
      tags: ["Web 安全", "Burp Suite", "信息收集"],
      summary: "整理 Web 安全学习中的核心术语、HTTP 报文、代理抓包、认证测试与信息收集流程。",
      readTime: "6 分钟",
      content: `
        <p>今天的内容从基础术语出发，依次梳理代理抓包、HTTP 报文、认证测试和信息收集。实践时应先确认授权范围，再按照“收集信息、分析请求、验证问题、记录结果”的顺序推进。</p>

        <h2>一、核心术语与测试模式</h2>
        <div class="article-table-wrap">
          <table class="article-table">
            <thead>
              <tr>
                <th>概念</th>
                <th>简要说明</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>POC / EXP</strong></td>
                <td>POC 用于证明漏洞存在；EXP 在确认漏洞后进一步验证其实际影响。</td>
              </tr>
              <tr>
                <td><strong>Payload</strong></td>
                <td>漏洞触发后执行的具体操作或数据，例如查询信息、执行命令或建立会话。</td>
              </tr>
              <tr>
                <td><strong>后门 / 木马 / 肉鸡</strong></td>
                <td>后门用于绕过正常认证维持访问；木马是伪装或隐藏恶意功能的程序；肉鸡是已被攻击者控制的主机。</td>
              </tr>
              <tr>
                <td><strong>提权</strong></td>
                <td>从 Web 服务的普通用户权限提升到更高权限。Windows 常见目标为 SYSTEM，Linux 常见目标为 root。</td>
              </tr>
              <tr>
                <td><strong>黑盒 / 白盒</strong></td>
                <td>黑盒测试只掌握有限目标信息；白盒测试可使用源码、账号和设计资料进行更深入的检查。</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>二、代理抓包与 HTTP 基础</h2>
        <p>抓包的重点是让目标程序的流量经过分析工具。Proxifier 可以按程序转发系统流量，Burp Suite 则负责拦截、查看和修改 HTTP 请求。常见链路如下：</p>
        <pre><code>目标程序 → Proxifier → Burp Suite（127.0.0.1:8080）→ 目标服务</code></pre>
        <p>没有出现流量时，优先检查程序规则、监听端口，以及 Proxifier、VPN 和系统代理之间是否发生冲突。</p>
        <ul>
          <li><strong>请求包：</strong>请求行、请求头、空行和请求正文。常见请求头包括 Host、Cookie 与 Referer。</li>
          <li><strong>响应包：</strong>状态行、响应头、空行和响应正文。Server、Location 等响应头可提供服务与跳转信息。</li>
          <li><strong>状态码：</strong>2xx 表示请求成功，3xx 表示重定向，4xx 表示客户端请求或权限问题，5xx 表示服务端异常。</li>
        </ul>
        <h2>三、身份认证与限制机制</h2>
        <p>弱口令测试先比较“用户不存在”和“密码错误”等响应差异，判断是否存在用户枚举，再通过状态码、响应长度、跳转位置和正文内容识别结果。以下验证只应在授权靶场中进行。</p>
        <div class="article-table-wrap">
          <table class="article-table">
            <thead>
              <tr>
                <th>机制</th>
                <th>测试时的观察点</th>
                <th>安全要点</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>IP 限制</strong></td>
                <td>检查服务端是否错误信任客户端提交的 <code>X-Forwarded-For</code>。Intruder 的 Pitchfork 模式可让测试 IP 与密码字典逐项对应。</td>
                <td>来源地址应由受控代理写入，同时结合账号、设备和请求频率进行限制。</td>
              </tr>
              <tr>
                <td><strong>动态 Token</strong></td>
                <td>在 Burp Suite 中从响应提取 Token，并让下一次请求携带新值；可使用 Grep - Extract 和递归提取完成验证。</td>
                <td>Token 应不可预测、及时失效，并与当前用户会话绑定。</td>
              </tr>
              <tr>
                <td><strong>图形验证码</strong></td>
                <td>可在本地靶场使用验证码插件配合 <code>ddddocr</code> 服务验证识别流程。</td>
                <td>免费识别方案准确率有限，复杂计算题和汉字验证码通常需要其他思路。</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>四、指纹识别与攻击面梳理</h2>
        <ul>
          <li><strong>技术栈指纹：</strong>识别编程语言、Web 中间件和数据库，再结合准确版本判断是否存在公开漏洞。Wappalyzer 可用于被动识别。</li>
          <li><strong>目录与文件：</strong>目录扫描工具可按目标和扩展名查找路径。200 表示资源可访问；403 也可能说明资源存在，可在授权范围内继续核查备份、临时和上传目录。</li>
          <li><strong>端口与服务：</strong>Nmap 可辅助发现 FTP、SSH、数据库等非 Web 服务。每个开放端口都应记录服务、版本和访问控制。</li>
          <li><strong>公开信息：</strong>检查 GitHub 等代码平台、搜索引擎结果和公开网盘中是否泄露源码、配置、密钥或内部路径。</li>
          <li><strong>前端资源：</strong>通过开发者工具的 Network 与 Sources 分析 JS 文件，整理 API、接口版本、IP、端口和未展示的功能路径；Find Something 可辅助提取这些信息。</li>
        </ul>

        <h2>五、今日学习流程</h2>
        <ul>
          <li>先明确授权范围，并区分黑盒或白盒测试条件。</li>
          <li>识别技术栈、目录、端口和公开信息，建立攻击面清单。</li>
          <li>通过代理抓包理解正常请求，再比较异常输入产生的响应差异。</li>
          <li>检查认证、限速、Token 和验证码等机制是否真正由服务端执行。</li>
          <li>记录证据、影响和复现条件，最后给出可验证的修复建议。</li>
        </ul>
      `,
    },
    {
      id: "pwn-roadmap",
      title: "Pwn 学习路线与环境准备",
      date: "2026-07-10",
      tags: ["Pwn", "入门", "环境"],
      summary: "从工具链、Linux 基础到 Binary 漏洞利用，整理一条可以持续推进的学习路径。",
      readTime: "6 分钟",
      content: `
        <p>Pwn 的核心是理解程序在底层如何运行，再利用实现中的缺陷改变程序原本的执行流程。开始练习前，先把分析环境固定下来，能显著减少重复配置带来的干扰。目前的练习一般以 i386（32 位）环境为主。</p>
        <h2>基础环境</h2>
        <p>当前学习环境以 Linux 为主，保留不同版本的 glibc，便于复现题目。常用工具包括：</p>
        <ul>
          <li><code>checksec</code>：快速查看 ELF 的安全保护。</li>
          <li><code>GDB + pwndbg</code>：动态调试、查看寄存器与内存。</li>
          <li><code>pwntools</code>：编写利用脚本并与程序交互。</li>
        </ul>
        <pre><code># 检查目标文件保护
checksec --file=./challenge

# 启动调试
gdb ./challenge</code></pre>
        <h2>阶段目标</h2>
        <p>先掌握栈布局、调用约定与基础汇编，再逐步学习栈溢出、格式化字符串、ROP 和堆利用。每学完一个知识点，都用一道小题验证，并记录失败原因。</p>
        <div class="callout"><strong>当前原则</strong><p>先理解崩溃现场，再写利用脚本；先在本地稳定复现，再处理远程差异。</p></div>
      `,
    },
    {
      id: "stack-frame",
      title: "从函数调用理解栈帧",
      date: "2026-07-15",
      tags: ["栈", "汇编", "基础"],
      summary: "记录 x86-64 函数调用时栈指针、返回地址和局部变量之间的关系。",
      readTime: "8 分钟",
      content: `
        <p>理解栈溢出的前提，是能够在调试器里认出一个函数的栈帧。x86-64 程序执行 <code>call</code> 时，会先把下一条指令的地址压栈，再跳转到目标函数。</p>
        <h2>需要关注的对象</h2>
        <ul>
          <li><code>RSP</code> 指向当前栈顶，压栈后数值减小。</li>
          <li><code>RBP</code> 常被用作当前栈帧的基准位置，但优化后可能省略。</li>
          <li>返回地址决定函数执行完毕后回到哪里。</li>
          <li>局部数组通常位于返回地址之前，越界写入可能覆盖控制数据。</li>
        </ul>
        <pre><code>push rbp
mov  rbp, rsp
sub  rsp, 0x40</code></pre>
        <p>这段序言保存旧的 <code>RBP</code>，建立新栈帧，并为局部变量预留 <code>0x40</code> 字节空间。实际分析时不能只依赖固定模板，要结合反汇编和运行时寄存器判断。</p>
        <h2>调试检查点</h2>
        <p>在函数入口、危险函数调用前和 <code>ret</code> 前分别设置断点。观察输入数据在内存中的位置，再计算它到返回地址之间的偏移。</p>
        <div class="callout"><strong>记录</strong><p>偏移量应通过调试结果验证，不要仅凭反编译器显示的数组长度推断。</p></div>
      `,
    },
    {
      id: "checksec-notes",
      title: "读懂 Checksec 的保护信息",
      date: "2026-07-12",
      tags: ["ELF", "保护机制"],
      summary: "梳理 Canary、NX、PIE、RELRO 对漏洞利用思路的影响。",
      readTime: "8 分钟",
      content: `
        <p><code>checksec</code> 的输出不是利用方法的答案，但它能帮助快速排除不适用的思路。分析时要把保护信息和实际漏洞结合起来看。</p>
        <h2>常见保护</h2>
        <ul>
          <li><strong>Canary（金丝雀）</strong>：函数返回前检查栈上的随机值，直接覆盖返回地址通常会触发异常。</li>
          <li><strong>NX</strong>：栈等数据区域不可执行，不能直接在栈上运行 Shellcode，通常需要考虑 ROP 或 ret2libc。</li>
          <li><strong>PIE</strong>：程序加载基址随机化，代码地址不再固定。</li>
          <li><strong>RELRO</strong>：限制 GOT 表的可写性；Full RELRO 会在启动后将 GOT 设为只读。</li>
        </ul>
        <pre><code>Arch:     i386-32-little
RELRO:    Full RELRO
Stack:    Canary found
NX:       NX enabled
PIE:      PIE enabled</code></pre>
        <h2>分析顺序</h2>
        <p>先确认架构和位数，再看保护机制，然后寻找信息泄露、任意读写或控制流劫持原语。保护机制提高利用门槛，但不等于程序没有漏洞。</p>
        <h2>常见利用结构</h2>
        <p>如果程序中已有可利用的代码片段，可以通过覆盖返回地址跳转到目标代码，这类思路通常称为 <code>ret2text</code>。当栈可执行时，可以考虑运行 Shellcode；开启 NX 后，则常通过 ROP 复用现有代码，其中 ret2libc 是常见形式。</p>
        <p>ret2libc 的关键是准备 <code>system</code> 与 <code>/bin/sh</code>：条件齐全时可以直接调用；缺少字符串时可先写入 <code>.bss</code> 等可写区域；libc 基址未知时，则先通过 PLT 调用输出函数、以对应 GOT 表项为参数泄露真实地址，再结合已知偏移计算 libc 基址。</p>
        <div class="article-table-wrap">
          <table class="article-table">
            <thead>
              <tr>
                <th>类型</th>
                <th>已知条件</th>
                <th>主要思路</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>ret2libc1</strong></td>
                <td>程序中已有可调用的 <code>system</code> 和 <code>/bin/sh</code></td>
                <td>构造调用参数并覆盖返回地址，直接执行 <code>system("/bin/sh")</code></td>
              </tr>
              <tr>
                <td><strong>ret2libc2</strong></td>
                <td>有 <code>system</code>，但缺少 <code>/bin/sh</code> 字符串</td>
                <td>先把字符串写入 <code>.bss</code> 等可写区域，再调用 <code>system</code></td>
              </tr>
              <tr>
                <td><strong>ret2libc3</strong></td>
                <td>libc 基址受 ASLR 影响而未知</td>
                <td>利用 PLT/GOT 泄露函数真实地址，计算 libc 基址、<code>system</code> 和 <code>/bin/sh</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      `,
    },
  ],

  thoughts: [
    {
      id: "20-years-old",
      kind: "thought",
      title: "杂谈记2——关于我人生的第二个十年",
      date: "2026-07-21",
      tags: ["杂谈", "记录"],
      summary: "时至2026年7月21日，我结束了人生的第二个十年，那些美好的时光，犹在昨日",
      readTime: "∞time",
          content: `
        <h2>懵懂的夏</h2>
          <p>除去没什么记忆的小学，就值剩下了在故乡河南度过初中和高中的六年，初中是我为数不多感到幸福的日子，至于原因我想有了解本人的应该知道(笑。尽管一切都已经过去。但那些夏天，确实让我感受到了生命中那些有在跳动的日子。
          经历的事、认识的人，仍然可以成为我梦中忽然而起的幻觉。</p>
        <h2>失意的三年</h2>
        <p>我在高中的三年，可以用一个词概括，那就是"失意"的，被迫地去做了很多事，但那也总是好的，起码还有什么东西可以胁迫我去做些事。在那会看来，我也许只是想成为"不被降维打击的同龄人"吧(引自迷途猫hhh）。记得那会告诉自己，修学先修心，
            于是钻研了许多磨练心性的法子，可偏偏没想到，随着毕业还给学校的，不仅仅是知识，相比后者，还是前者更让我怅然。高中的三年，全然在失意中度过，于是乎便没有了什么记忆了，我总是趋向逃避痛苦，逃避痛苦的回忆。但是现在却逃不掉。
            唯一给我惊喜的是在23年看过的一部作品，我很喜欢。</p>
        <h2>meanless</h2>
        <p>然后就是上大学啊。我的选择决定后，误打误撞来到了西安，个人感受是相对自由的高中，因此失意延续、想象中的画面并没有发生，于再是幻灭了，不再去想了。那就沉沦吧，没什么不好的。至少我仍然这样认为。沉沦中煎熬，仿佛比不沉沦还痛苦(?)，那我
        或许是要做出一些改变了。这些事情，高中的我处理起来绝对比我要得心应手……。总之现状就是，大学过了一半，还没有什么实感，回过神来，什么也没做。或许这也是可以改变的。不改变，生活就是死水。
        <div class="callout"><strong>给自己的提醒</strong><p>不管怎么样呀，祝你20岁生日快乐~。</p></div>
      `,
    },
    {
      id: "how-to -start",
      kind: "thought",
      title: "这个blog应该有怎么样的起点？",
      date: "2026-07-10",
      tags: ["杂谈", "起点"],
      summary: "对问题保持好奇，尝试各种各样的新奇事物",
      readTime: "1 分钟",
      content: `
        <p>可能没有什么大事件，我只是突发奇想，觉得拥有一个自己的网站这种事很酷，所以就借助了codex完成了这个项目(笑)，整个过程没有耗时多久，雏形只用了一下午，但是做出来的
        "AI"味儿太重，我想尽力消除这种味，形成符合自己口味的blog</p>
        <h2>仅仅是觉得记录挺好</h2>
        <p>当一个问题值得深入时，暂时偏离原计划并不是浪费时间。重要的是在探索之后重新整理，把零散发现变成下一次可以使用的经验。虽然这不是初衷，我只是想有个胡言乱语的地方而已。</p>
      `,
    },
  ],
};
