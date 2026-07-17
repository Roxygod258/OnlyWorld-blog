window.ONLYWORLD_POSTS = {
  notes: [
    {
      id: "pwn-roadmap",
      title: "Pwn 学习路线与环境准备",
      date: "2026-07-17",
      tags: ["Pwn", "入门", "环境"],
      summary: "从工具链、Linux 基础到二进制漏洞利用，整理一条可以持续推进的学习路径。",
      readTime: "6 分钟",
      content: `
        <p>Pwn 的核心是理解程序在底层如何运行，再利用实现中的缺陷改变程序原本的执行流程。开始练习前，先把分析环境固定下来，能显著减少重复配置带来的干扰。</p>
        <h2>基础环境</h2>
        <p>当前学习环境以 Linux 为主，保留不同版本的 glibc，便于复现题目。常用工具包括：</p>
        <ul>
          <li><code>checksec</code>：快速查看 ELF 的安全保护。</li>
          <li><code>GDB + pwndbg</code>：动态调试、查看寄存器与内存。</li>
          <li><code>pwntools</code>：编写利用脚本并与程序交互。</li>
          <li><code>Ghidra</code>：进行静态分析和伪代码阅读。</li>
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
      readTime: "5 分钟",
      content: `
        <p><code>checksec</code> 的输出不是利用方法的答案，但它能帮助快速排除不适用的思路。分析时要把保护信息和实际漏洞结合起来看。</p>
        <h2>常见保护</h2>
        <ul>
          <li><strong>Canary</strong>：函数返回前检查栈上的随机值，直接覆盖返回地址通常会触发异常。</li>
          <li><strong>NX</strong>：栈等数据区域不可执行，需要考虑复用已有代码。</li>
          <li><strong>PIE</strong>：程序加载基址随机化，代码地址不再固定。</li>
          <li><strong>RELRO</strong>：限制 GOT 表的可写性；Full RELRO 会在启动后将 GOT 设为只读。</li>
        </ul>
        <pre><code>Arch:     amd64-64-little
RELRO:    Full RELRO
Stack:    Canary found
NX:       NX enabled
PIE:      PIE enabled</code></pre>
        <h2>分析顺序</h2>
        <p>先确认架构和位数，再看保护机制，然后寻找信息泄露、任意读写或控制流劫持原语。保护机制提高利用门槛，但不等于程序没有漏洞。</p>
      `,
    },
  ],

  thoughts: [
    {
      id: "why-i-keep-notes",
      kind: "thought",
      title: "为什么我想持续记录",
      date: "2026-07-16",
      tags: ["杂谈", "记录"],
      summary: "记录不只是保存答案，也是保留自己如何一步步理解问题的过程。",
      readTime: "3 分钟",
      content: `
        <p>很多知识在第一次理解时似乎很清楚，隔一段时间再回头，却只剩下模糊的结论。真正值得保存的，往往不是最后那一句答案，而是从困惑到理解之间的路径。</p>
        <h2>留下思考的过程</h2>
        <p>我希望这里不仅有整理好的技术笔记，也能留下遇到问题时的判断、走过的弯路，以及一些暂时没有标准答案的想法。</p>
        <div class="callout"><strong>给自己的提醒</strong><p>记录可以不完整，但要真实；观点可以改变，但要保留改变发生的原因。</p></div>
      `,
    },
    {
      id: "learning-and-curiosity",
      kind: "thought",
      title: "学习来自好奇，而不是完成清单",
      date: "2026-07-10",
      tags: ["杂谈", "学习"],
      summary: "比起机械地完成计划，我更在意自己是否还对问题保持好奇。",
      readTime: "4 分钟",
      content: `
        <p>学习计划可以提供方向，但清单本身不应该成为目的。真正推动理解的，往往是一个具体的问题：程序为什么在这里崩溃？这段保护为什么有效？还有没有另一种解释？</p>
        <h2>允许计划发生变化</h2>
        <p>当一个问题值得深入时，暂时偏离原计划并不是浪费时间。重要的是在探索之后重新整理，把零散发现变成下一次可以使用的经验。</p>
      `,
    },
  ],
};
