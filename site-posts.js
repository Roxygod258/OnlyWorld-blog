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
      id: "web-sqlmap-basics",
      title: "SQLMap 入门：从手动探测到自动化验证",
      date: "2026-07-22",
      category: "Web",
      tags: ["SQLMap", "SQL 注入", "自动化工具"],
      summary: "在理解手动 SQL 注入的基础上，学习 SQLMap 的帮助命令、URL 检测、请求包分析与数据库信息获取。",
      readTime: "7 分钟",
      content: `
        <p>上一篇文章介绍了如何手动判断 SQL 注入、分析闭合方式并观察页面回显。手动探测能帮助我们理解漏洞原理，而今天学习的 SQLMap 可以把大量重复的测试步骤自动化。使用工具时仍要先知道自己在验证什么，不能只看最终是否出现“存在漏洞”的提示。</p>
        <div class="callout"><strong>使用范围</strong><p>SQLMap 会自动发送大量测试请求，只能用于本地靶场、CTF 或明确授权的目标。未经授权不要对真实网站运行。</p></div>

        <h2>一、获取 SQLMap 与查看帮助</h2>
        <p>SQLMap 是开源工具，可以从 GitHub 官方仓库下载。进入包含 <code>sqlmap.py</code> 的目录后，通过 Python 运行：</p>
        <div class="resource-downloads" aria-label="SQLMap 学习资源">
          <a class="resource-download" href="https://github.com/sqlmapproject/sqlmap" target="_blank" rel="noopener noreferrer">
            <span class="resource-download-icon" aria-hidden="true">↗</span>
            <span><strong>获取 SQLMap 点这里</strong><small>前往 sqlmapproject 官方 GitHub 仓库</small></span>
          </a>
          <a class="resource-download" href="https://sqlmap.highlight.ink/" target="_blank" rel="noopener noreferrer">
            <span class="resource-download-icon" aria-hidden="true">↗</span>
            <span><strong>查看 SQLMap 手册</strong><small>查询参数说明与更多使用方法</small></span>
          </a>
        </div>
        <pre><code># 查看常用参数
python sqlmap.py -h

# 查看全部参数
python sqlmap.py -hh</code></pre>
        <p><code>-h</code> 适合日常快速查询，<code>-hh</code> 会显示更完整的高级选项。第一次接触某个参数时，应先阅读帮助信息，确认它的输入格式和作用。</p>

        <h2>二、使用 URL 检测 GET 参数</h2>
        <p>最常见的用法是通过 <code>-u</code> 提交一个带参数的 URL。SQLMap 需要知道测试入口，因此 URL 中应包含类似 <code>id=1</code> 的查询参数，而不能只填写网站首页：</p>
        <pre><code>python sqlmap.py -u "http://127.0.0.1:8080/item.php?id=1"

# 自动选择询问项的默认答案
python sqlmap.py -u "http://127.0.0.1:8080/item.php?id=1" --batch</code></pre>
        <p>不加 <code>--batch</code> 时，检测过程中可能出现测试范围、数据库类型或继续方式等问询，可以根据靶场情况选择；按 Enter 通常接受当前问题显示的默认值。加入 <code>--batch</code> 后，SQLMap 会自动使用默认答案，适合已经明确测试条件的重复实验。</p>

        <h2>三、正确阅读检测结果</h2>
        <p>SQLMap 会先判断目标是否可访问、页面是否稳定，再测试参数是否动态，最后尝试不同类型的注入技术。发现可利用参数时，输出通常会列出参数位置、注入类型、Payload 和后端数据库类型。</p>
        <div class="article-table-wrap">
          <table class="article-table">
            <thead>
              <tr>
                <th>输出情况</th>
                <th>应当如何理解</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>参数可注入</strong></td>
                <td>记录 SQLMap 给出的参数、注入类型与 Payload，再回到手动方法理解它为何成立。</td>
              </tr>
              <tr>
                <td><strong>未发现注入</strong></td>
                <td>只说明当前参数、配置和测试范围内没有发现，不等于目标一定不存在漏洞。</td>
              </tr>
              <tr>
                <td><strong>CRITICAL</strong></td>
                <td>表示本次运行遇到严重错误，例如连接失败、参数无效或请求无法解析。应阅读同一行及前后的具体原因，而不是直接把它理解为“没有漏洞”。</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>自动化工具可能受到登录状态、动态 Token、网络波动、WAF、页面不稳定和请求频率限制影响。工具没有找到不代表手动判断一定错误；反过来，工具给出结果后也应保留请求与响应证据。</p>

        <h2>四、使用请求包分析登录与 POST 场景</h2>
        <p>遇到 <code>login.php</code> 等登录页面时，参数通常位于 POST 正文中，还可能依赖 Cookie、Content-Type 或其他请求头。此时可以先用 Burp Suite 抓取完整请求，把原始 HTTP 请求保存为文本文件，再通过 <code>-r</code> 交给 SQLMap。</p>
        <pre><code># request.txt 放在 sqlmap.py 所在目录时
python sqlmap.py -r request.txt --batch

# 文件位于其他目录时，也可以填写相对路径或绝对路径
python sqlmap.py -r ./requests/login.txt --batch</code></pre>
        <p>请求文件应从请求行开始，并保留请求头、空行和请求正文。例如 POST 请求中的 Cookie、表单参数和必要的 CSRF Token 都可能影响目标能否正确响应。保存前可以先在 Burp Suite 中重放一次，确认请求仍然有效。</p>
        <div class="callout"><strong>注意会话有效期</strong><p>如果 Cookie 或 Token 已经过期，SQLMap 读到的只是登录失效页面。开始检测前应重新抓取请求，并确认响应内容与正常操作时一致。</p></div>

        <h2>五、在确认注入后获取数据库信息</h2>
        <p>只有在已经确认参数存在注入、且授权范围允许时，才继续枚举数据库信息。原文中的两个常用参数分别用于获取全部数据库名和当前数据库名：</p>
        <pre><code># 枚举数据库服务器中的数据库名
python sqlmap.py -u "http://127.0.0.1:8080/item.php?id=1" --dbs --batch

# 获取当前 Web 应用正在使用的数据库名
python sqlmap.py -u "http://127.0.0.1:8080/item.php?id=1" --current-db --batch

# 使用已保存的请求包时，同样可以追加对应参数
python sqlmap.py -r request.txt --current-db --batch</code></pre>
        <p><code>--dbs</code> 尝试枚举数据库服务器上可见的数据库，结果受当前数据库账号权限限制；<code>--current-db</code> 只查询当前连接使用的数据库。两者含义不同，练习时不要把“当前数据库”误认为服务器上唯一的数据库。</p>

        <h2>六、从手动探测过渡到自动化</h2>
        <ol>
          <li>先在靶场中确认正常请求，理解参数位于 URL、POST 正文还是 Cookie。</li>
          <li>用昨天的手动方法比较真假条件，尝试理解参数上下文与页面反馈。</li>
          <li>使用 <code>-u</code> 或 <code>-r</code> 让 SQLMap 对同一入口进行检测。</li>
          <li>对照 SQLMap 输出的 Payload 与手动判断，分析工具采用了哪种注入方式。</li>
          <li>确认注入后再使用 <code>--current-db</code> 或 <code>--dbs</code>，不要一开始就堆叠大量枚举参数。</li>
          <li>保存命令、请求包和关键输出，记录工具成功或失败的原因。</li>
        </ol>
        <p>今天的重点是在昨天手动操作的基础上学习自动化脚本。SQLMap 能提高测试效率，但手动基础决定了我们能否正确准备请求、解释输出，并在自动检测失败时找到问题所在。</p>
      `,
    },
    {
      id: "web-sql-injection-basics",
      title: "SQL 注入入门：从靶场搭建到联合查询",
      date: "2026-07-21",
      category: "Web",
      tags: ["SQL 注入", "MySQL", "Docker"],
      summary: "从 Docker 靶场、数字型与字符型判断出发，理解布尔盲注、时间盲注和联合查询的完整学习路径。",
      readTime: "11 分钟",
      content: `
        <p>SQL 注入的学习重点不是背下一串 Payload，而是先理解：用户输入最终被放进了 SQL 语句的哪个位置、原语句如何闭合，以及我们能通过页面观察到什么。本文以本地 Docker 靶场和 MySQL 为例，按照从判断到验证的顺序整理今天的课堂内容。</p>
        <div class="callout"><strong>练习范围</strong><p>以下语句仅用于本地靶场、CTF 或明确授权的安全测试。面对真实网站时，必须先取得授权并控制测试频率。</p></div>

        <h2>一、先搭好可重复的 Docker 靶场</h2>
        <p>Docker 镜像可以理解为创建环境的模板，容器则是由镜像启动的运行实例。导入镜像后，先确认镜像名称和标签，再把容器内的 Web 端口映射到本机端口。</p>
        <pre><code># 从压缩包导入镜像
docker load -i xxx.tar.gz  #-i可以用<代替

# 查看本机已有镜像
docker images

# 后台启动容器：本机 8080 端口映射到容器 80 端口
docker run --rm -d --name sql-lab -p 8080:80 image-name:tag

# 查看正在运行的容器
docker ps</code></pre>
        <ul>
          <li><code>-d</code> 表示后台运行，<code>--name</code> 为容器指定一个便于识别的名称。也就是说，"--name sql-lab"可以省略</li>
          <li><code>-p 8080:80</code> 的格式是“本机端口:容器端口”，启动后通常访问 <code>http://127.0.0.1:8080，如果是虚拟机，就查询本机ip，到本地浏览器之后，ip+端口访问</code>。</li>
          <li><code>--rm</code> 会在容器停止后自动删除容器实例，但不会删除原镜像。</li>
        </ul>

        <h2>二、SQL 注入为什么会发生</h2>
        <p>当后端把用户输入直接拼接进 SQL 字符串时，输入就可能从普通数据变成 SQL 语法的一部分。例如，下面两条查询分别代表常见的数字上下文和字符串上下文：</p>
        <pre><code>SELECT * FROM users WHERE cid = 2;
SELECT * FROM users WHERE name = 'admin';</code></pre>
        <p>如果其中的 <code>2</code> 或 <code>admin</code> 直接来自请求参数，攻击者就可能加入引号、逻辑运算符或查询片段，改变原语句的含义。因此，SQL 注入的根因通常是<strong>动态拼接 SQL</strong>；仅靠黑名单过滤某几个符号并不能从根本上解决问题。</p>
        <p>在 MySQL 中，<code>#</code> 和带有尾随空白的 <code>-- </code> 都可以开始注释。URL 里的 <code>#</code> 会被浏览器当成页面片段标记，不一定发送给服务器，因此需要写成 URL 编码 <code>%23</code>。练习中常见的 <code>-- -</code> 本质上仍是 <code>-- </code>：第二个短横线后有一个空格，最后的短横线只是让这个空格更容易被看见。</p>

        <h2>三、先确定是否可控，再判断闭合方式</h2>
        <p>测试时先记录一个能够正常返回内容的基准请求，例如 <code>cid=2</code>。随后只改变一个条件，比较响应内容、状态码、长度和耗时。单独看到一次数据库报错只能说明输入影响了查询，不能仅凭报错就断定注入类型。</p>
        <div class="article-table-wrap">
          <table class="article-table">
            <thead>
              <tr>
                <th>上下文</th>
                <th>真假条件示例</th>
                <th>最终结构</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>数字型</strong></td>
                <td><code>2 AND 11=11</code><br /><code>2 AND 11=22</code></td>
                <td><code>WHERE cid=2 AND 11=11</code></td>
              </tr>
              <tr>
                <td><strong>字符型</strong></td>
                <td><code>2' AND 11=11-- -</code><br /><code>2' AND 11=22-- -</code></td>
                <td><code>WHERE name='2' AND 11=11-- -'</code></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>字符型比数字型多了一步：先用匹配的引号结束原字符串，再在末尾注释掉原查询剩余的引号。真实语句还可能使用双引号、括号或多层括号，所以闭合方式要根据响应逐步判断，不能看到某个符号报错就机械地认定为数字型。</p>
        <div class="callout"><strong>真假判断的前提</strong><p><code>AND</code> 左侧的原条件必须先成立。如果选择了一个本来就不存在的用户或编号，那么真、假条件都可能返回空页面。此时应换回已知存在的基准值；必要时再谨慎使用 <code>OR</code> 比较响应差异。</p></div>

        <h2>四、根据页面反馈选择验证方式</h2>
        <p>同一个注入点可以有不同的观察通道。初学时应先找最直观、对服务影响最小的方式，再考虑只能依赖真假或耗时差异的盲注。</p>
        <div class="article-table-wrap">
          <table class="article-table">
            <thead>
              <tr>
                <th>方式</th>
                <th>页面特征</th>
                <th>判断重点</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>报错观察</strong></td>
                <td>页面直接显示数据库语法错误</td>
                <td>错误可帮助理解闭合位置，但生产环境可能隐藏错误信息。</td>
              </tr>
              <tr>
                <td><strong>布尔盲注</strong></td>
                <td>不显示查询结果，但真假条件对应两种稳定页面</td>
                <td>分别发送恒真和恒假条件，比较正文、长度或状态码。</td>
              </tr>
              <tr>
                <td><strong>时间盲注</strong></td>
                <td>真假条件没有可见差异</td>
                <td>让条件成立时执行延迟函数，例如 MySQL 的 <code>SLEEP()</code>，再比较多次请求耗时。</td>
              </tr>
              <tr>
                <td><strong>联合查询</strong></td>
                <td>查询结果中的部分字段会显示在页面</td>
                <td>让原查询与 <code>UNION SELECT</code> 的列数兼容，并找到可见列。</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>时间盲注可以使用类似 <code>2 AND IF(1=1,SLEEP(3),0)</code> 的条件验证，但网络波动也会造成延迟。应先测量正常请求耗时，再重复对比真、假条件，不能只凭一次慢响应下结论。字符型场景仍要先正确闭合字符串。</p>

        <h2>五、联合查询的完整步骤</h2>
        <p>联合查询适用于数据能够回显到页面的情况。它要求前后两条查询返回相同数量的列，并且对应列的数据类型可以兼容。下面假设参数处于数字上下文，原查询有三列。</p>
        <ol>
          <li><strong>确定列数：</strong>依次测试 <code>ORDER BY 1</code>、<code>ORDER BY 2</code>……当数字增加到某个值时报错时，前一个值通常就是列数，即使原页面正常的阈值(有时候会发现报错(也可以是异常)，直接在后面加上-- -注释掉再试试！)</li>
          <li><strong>寻找回显位：</strong>使用不存在的原编号，使原查询尽量不返回数据，再提交 <code>-1 UNION SELECT 1,2,3-- -</code>。页面显示哪个数字，哪个位置就是可利用的回显列。</li>
          <li><strong>读取基础信息：</strong>把可见位置换成 <code>database()</code>、<code>version()</code> 或 <code>current_user()</code>，分别查看当前库名、数据库版本和数据库用户。</li>
          <li><strong>按层级枚举：</strong>先找当前库中的表，再找目标表中的字段，最后读取需要验证的数据。</li>
        </ol>
        <pre><code>
        #注:这里要使用插件Hackbar，使用edge的可以去扩展设置里找有从chrome下载
        # 假设第 2 列能够回显
-1 UNION SELECT 1,database(),3-- -
-1 UNION SELECT 1,version(),3-- -
-1 UNION SELECT 1,current_user(),3-- -</code></pre>
        <p>将原编号改为 <code>-1</code> 的目的，是避免原查询结果占据页面的回显位置；它不是固定写法，只要选择一个确定不存在的值即可。若 <code>UNION SELECT</code> 始终失败，还要考虑列数、数据类型、闭合方式和关键字过滤，而不是直接认定没有注入。</p>

        <h2>六、通过 information_schema 理解数据库结构</h2>
        <p>MySQL 5.0 及以上版本提供系统数据库 <code>information_schema</code>，其中保存了库、表和字段等元数据。学习时可以把枚举过程理解为“当前数据库 → 数据表 → 字段 → 记录”四层。</p>
        <pre><code># 1. 获取当前数据库中的所有表名
-1 UNION SELECT 1,GROUP_CONCAT(table_name),3
FROM information_schema.tables
WHERE table_schema=database()-- -

# 2. 获取 cms_users 表中的所有字段名
-1 UNION SELECT 1,GROUP_CONCAT(column_name),3
FROM information_schema.columns
WHERE table_schema=database()
  AND table_name='cms_users'-- -

# 3. 在授权靶场中读取目标字段，0x3a 表示冒号
-1 UNION SELECT 1,GROUP_CONCAT(username,0x3a,password),3
FROM cms_users-- -</code></pre>
        <p><code>GROUP_CONCAT()</code> 用于把多行结果合并到一个回显位置。原笔记中的 <code>HEX()</code> 与 <code>UNHEX()</code> 可以在字符编码或过滤造成显示问题时辅助转换，比如unhex(hex())，但不是枚举表名的必需步骤，初学时先掌握直接查询更容易理解。</p>
        <p>字段名必须按实际结果填写，例如系统表中使用的是 <code>table_name</code>，不是 <code>tables_name</code>。读取多列时也不能用斜杠连接，因为 SQL 会把斜杠理解为除法；可以像示例一样使用十六进制的冒号 <code>0x3a</code> 分隔用户名和密码字段。</p>

        <h2>七、正确理解密码哈希</h2>
        <p>数据库中的密码通常不是明文，而是哈希值。MD5 是单向哈希算法，不能像密文一样直接“解密”。一些在线查询服务只是把哈希与已经收集的常见明文结果进行匹配，所以查不到是正常情况，也不应把真实系统中的敏感哈希上传到第三方网站。</p>
        <p>从防守角度看，MD5 计算速度快且抗碰撞能力不足，不适合保存密码。实际系统应使用专门的密码哈希算法，例如 Argon2、bcrypt 或 scrypt，并为每个密码使用独立盐值。</p>

        <h2>八、初学者复盘顺序</h2>
        <ol>
          <li>先用正常参数建立响应基线，确认输入对应的页面功能。</li>
          <li>判断输入是否影响 SQL，并推测数字、字符串和括号等上下文。</li>
          <li>用恒真、恒假条件验证闭合方式，确认页面是否存在稳定差异。</li>
          <li>根据回显条件选择布尔、时间或联合查询，不要一开始就混用所有方法。</li>
          <li>联合查询时依次确认列数、回显位、数据库名、表名和字段名。</li>
          <li>保存原始请求、响应和判断依据，实验结束后总结失败原因。</li>
        </ol>
        <div class="callout"><strong>修复原则</strong><p>防止 SQL 注入应优先使用参数化查询或预编译语句，并配合数据库最小权限、统一错误页面和输入类型检查。WAF 与关键字过滤只能作为补充，不能替代参数化查询。</p></div>
      `,
    },
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
        <p>抓包的重点是让目标程序的流量经过分析工具。Proxifier 可以按程序转发系统流量，Burp Suite 则负责拦截、查看和修改 HTTP 请求。常见链路和获取链接(有些太大本站放不下！)如下：</p>
        <div class="resource-downloads" aria-label="相关工具下载">
          <a class="resource-download" href="https://portswigger.net/burp/communitydownload" target="_blank" rel="noopener noreferrer">
            <span class="resource-download-icon" aria-hidden="true">↗</span>
            <span><strong>获取 Burp Suite 点这里</strong><small>前往 PortSwigger 官方下载页</small></span>
          </a>
          <a class="resource-download" href="Webtools/ProxyBridge.zip" download="ProxyBridge.zip">
            <span class="resource-download-icon" aria-hidden="true">↓</span>
            <span><strong>获取 ProxyBridge 点这里</strong><small>下载本站提供的 ZIP 文件 · 约 16.4 MB</small></span>
          </a>
        </div>
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
          <p>除去没什么记忆的小学，就只剩下了在故乡河南度过初中和高中的六年，初中是我为数不多感到幸福的日子，至于原因我想有了解本人的应该知道(笑。尽管一切都已经过去。但那些夏天，确实让我感受到了生命中那些有在跳动的日子。
          经历的事、认识的人，仍然可以成为我梦中忽然而起的幻觉。</p>
        <h2>失意的三年</h2>
        <p>我在高中的三年，可以用一个词概括，那就是"失意"的，被迫地去做了很多事，但那也总是好的，起码还有什么东西可以胁迫我去做些事。在那会看来，我也许只是想成为"不被降维打击的同龄人"吧(引自迷途猫hhh）。记得那会告诉自己，修学先修心，
            于是钻研了许多磨练心性的法子，可偏偏没想到，随着毕业还给学校的，不仅仅是知识，相比后者，还是前者更让我怅然。高中的三年，全然在失意中度过，于是乎便没有了什么记忆了，我总是趋向逃避痛苦，逃避痛苦的回忆。但是现在却逃不掉。
            唯一给我惊喜的是在23年看过的一部作品，我很喜欢。</p>
        <h2>meanless</h2>
        <p>然后就是上大学啊。我的选择决定后，误打误撞来到了西安，个人感受是相对自由的高中，因此失意延续、想象中的画面并没有发生，于是再次幻灭了，不再去想了。那就沉沦吧，没什么不好的。至少我仍然这样认为。沉沦中煎熬，仿佛比不沉沦还痛苦(?)，那我
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
        <p>当一个问题值得深入时，暂时偏离原计划并不是浪费时间。重要的是在探索之后重新整理，把零散发现变成下一次可以使用的经验。虽然这不是初衷，我只是想有个胡言乱语的地方而已。同时受到
        Wecedet的启发，这里也可以接受你们的想法</p>
      `,
    },
  ],
};
