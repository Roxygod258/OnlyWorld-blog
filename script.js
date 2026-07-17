const notes = window.ONLYWORLD_POSTS?.notes || [
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
];

const thoughts = window.ONLYWORLD_POSTS?.thoughts || [
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
];

const configuredContent = window.ONLYWORLD_CONTENT || {};

const welcomeDefaults = {
  kicker: "WELCOME TO MY PERSONAL BLOG",
  title: "OnlyWorld",
  subtitle: "在二进制世界里，记录每一次理解与突破。",
  button: "进入我的博客",
  ...(configuredContent.welcome || {}),
};

const profileContent = {
  avatar: "",
  greeting: "你好，我是 OnlyWorld。",
  bio: "一名持续学习网络安全的探索者，目前主要关注二进制安全与 Pwn。",
  direction: "Binary Pwn",
  topics: "安全与思考",
  status: "持续进行中",
  email: "",
  github: "",
  website: "学习区保存技术笔记与实验复盘，杂谈区记录技术之外的观察。",
  belief: "真正的理解来自不断提问、亲手验证和坦诚复盘。",
  ...(configuredContent.profile || {}),
};

const allEntries = [...notes, ...thoughts];

const elements = {
  welcomeScreen: document.querySelector("#welcomeScreen"),
  welcomeCanvas: document.querySelector("#welcomeCanvas"),
  enterSite: document.querySelector("#enterSite"),
  content: document.querySelector("#content"),
  directory: document.querySelector("#directory"),
  noteCount: document.querySelector("#noteCount"),
  thoughtsDirectory: document.querySelector("#thoughtsDirectory"),
  thoughtCount: document.querySelector("#thoughtCount"),
  searchInput: document.querySelector("#searchInput"),
  sidebar: document.querySelector("#sidebar"),
  scrim: document.querySelector("#scrim"),
  settingsDialog: document.querySelector("#settingsDialog"),
  backgroundInput: document.querySelector("#backgroundInput"),
  backgroundPreview: document.querySelector("#backgroundPreview"),
  wallpaper: document.querySelector(".wallpaper-main"),
  readingProgress: document.querySelector("#readingProgress"),
  liveClock: document.querySelector("#liveClock"),
  welcomeKicker: document.querySelector("#welcomeKicker"),
  welcomeTitle: document.querySelector("#welcomeTitle"),
  welcomeSubtitle: document.querySelector("#welcomeSubtitle"),
  enterButtonText: document.querySelector("#enterButtonText"),
  welcomeEditorDialog: document.querySelector("#welcomeEditorDialog"),
  welcomeEditorForm: document.querySelector("#welcomeEditorForm"),
  welcomeKickerInput: document.querySelector("#welcomeKickerInput"),
  welcomeTitleInput: document.querySelector("#welcomeTitleInput"),
  welcomeSubtitleInput: document.querySelector("#welcomeSubtitleInput"),
  enterButtonInput: document.querySelector("#enterButtonInput"),
  profileEditorDialog: document.querySelector("#profileEditorDialog"),
  profileEditorForm: document.querySelector("#profileEditorForm"),
  profileAvatarInput: document.querySelector("#profileAvatarInput"),
  profileAvatarPreview: document.querySelector("#profileAvatarPreview"),
  profileGreetingInput: document.querySelector("#profileGreetingInput"),
  profileBioInput: document.querySelector("#profileBioInput"),
  profileEmailInput: document.querySelector("#profileEmailInput"),
  profileGithubInput: document.querySelector("#profileGithubInput"),
  profileDirectionInput: document.querySelector("#profileDirectionInput"),
  profileTopicsInput: document.querySelector("#profileTopicsInput"),
  profileStatusInput: document.querySelector("#profileStatusInput"),
  shadeInput: document.querySelector("#shadeInput"),
  shadeValue: document.querySelector("#shadeValue"),
  blurInput: document.querySelector("#blurInput"),
  blurValue: document.querySelector("#blurValue"),
  contentOpacityInput: document.querySelector("#contentOpacityInput"),
  contentOpacityValue: document.querySelector("#contentOpacityValue"),
  navOpacityInput: document.querySelector("#navOpacityInput"),
  navOpacityValue: document.querySelector("#navOpacityValue"),
};

const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character]);
}

function formatDate(value) {
  return dateFormatter.format(new Date(`${value}T00:00:00`));
}

function noteRow(note) {
  return `
    <button class="note-row" type="button" data-note-id="${note.id}">
      <time class="note-date" datetime="${note.date}">${formatDate(note.date)}</time>
      <span>
        <h3>${note.title}</h3>
        <p>${note.summary}</p>
      </span>
      <span class="row-arrow" aria-hidden="true">→</span>
    </button>
  `;
}

function renderDirectory(activeId = "") {
  elements.noteCount.textContent = String(notes.length);
  elements.thoughtCount.textContent = String(thoughts.length);
  elements.directory.innerHTML = notes.map((note) => `
    <button class="directory-item${note.id === activeId ? " is-active" : ""}" type="button" data-note-id="${note.id}">
      <strong>${note.title}</strong>
      <time datetime="${note.date}">${formatDate(note.date)}</time>
    </button>
  `).join("");
  elements.thoughtsDirectory.innerHTML = thoughts.map((note) => `
    <button class="directory-item${note.id === activeId ? " is-active" : ""}" type="button" data-note-id="${note.id}">
      <strong>${note.title}</strong>
      <time datetime="${note.date}">${formatDate(note.date)}</time>
    </button>
  `).join("");
}

function setActiveRoute(route) {
  document.querySelectorAll("[data-route]").forEach((item) => {
    const isNavigation = item.classList.contains("nav-item") || item.classList.contains("top-nav-item");
    item.classList.toggle("is-active", item.dataset.route === route && isNavigation);
  });
}

function renderHome() {
  setActiveRoute("home");
  renderDirectory();
  elements.content.innerHTML = `
    <section class="home-view">
      <div class="home-intro">
        <div>
          <p class="eyebrow">ONLYWORLD / PERSONAL BLOG</p>
          <h1>在二进制世界里，<br /><em>追踪每一个细节。</em></h1>
          <p class="lead">记录网络安全与 Pwn 学习过程中的概念、实验和复盘。把零散的问题整理成可以反复查阅的知识路径。</p>
        </div>
        <div class="focus-panel">
          <span>CURRENT FOCUS</span>
          <strong>Binary Pwn</strong>
          <small>栈 · ELF · 漏洞利用</small>
        </div>
      </div>

      <div class="notes-section">
        <div class="section-heading">
          <div>
            <p class="eyebrow">RECENT NOTES</p>
            <h2>最近记录</h2>
          </div>
          <button type="button" data-route="archive">查看归档</button>
        </div>
        <div class="note-list">${notes.map(noteRow).join("")}</div>
      </div>
    </section>
  `;
  focusContent();
}

function renderArticles() {
  setActiveRoute("articles");
  renderDirectory();
  elements.content.innerHTML = `
    <section class="articles-view">
      <header class="page-header">
        <div>
          <p class="eyebrow">LEARNING NOTES</p>
          <h1>文章</h1>
        </div>
        <p>网络安全、Pwn 与持续学习过程中的整理和复盘。</p>
      </header>
      <div class="note-list">${notes.map(noteRow).join("")}</div>
    </section>
  `;
  focusContent();
}

function renderArchive() {
  setActiveRoute("archive");
  renderDirectory();

  const groups = allEntries.reduce((result, note) => {
    const [year, month] = note.date.split("-");
    result[year] ??= {};
    result[year][month] ??= [];
    result[year][month].push(note);
    return result;
  }, {});

  const archive = Object.entries(groups).sort(([a], [b]) => b.localeCompare(a)).map(([year, months]) => `
    <section class="archive-year">
      <h2>${year}</h2>
      <div>
        ${Object.entries(months).sort(([a], [b]) => b.localeCompare(a)).map(([month, monthNotes]) => `
          <div class="archive-month">
            <h3>${Number(month)} 月 · ${monthNotes.length} 篇</h3>
            ${monthNotes.map(noteRow).join("")}
          </div>
        `).join("")}
      </div>
    </section>
  `).join("");

  elements.content.innerHTML = `
    <section class="archive-view">
      <header class="archive-header">
        <p class="eyebrow">ARCHIVE</p>
        <h1>日期归档</h1>
      </header>
      ${archive}
    </section>
  `;
  focusContent();
}

function renderThoughts() {
  setActiveRoute("thoughts");
  renderDirectory();
  elements.content.innerHTML = `
    <section class="thoughts-view">
      <header class="thoughts-header">
        <p class="eyebrow">PERSONAL JOURNAL</p>
        <h1>杂谈</h1>
        <p>技术之外的想法、学习过程中的感受，以及我想留给未来自己的片段。</p>
      </header>
      <div class="note-list">
        ${thoughts.map((note) => noteRow(note).replace('class="note-row"', 'class="note-row thought-row"')).join("")}
      </div>
    </section>
  `;
  focusContent();
}

function renderPhotos() {
  const photos = Array.isArray(configuredContent.photos) ? configuredContent.photos : [];
  const photoItems = photos.map((photo) => {
    const source = safeAvatarSource(photo.src);
    if (!source) return "";
    return `
      <figure class="photo-item">
        <img src="${escapeHtml(source)}" alt="${escapeHtml(photo.alt || photo.caption || "个人照片")}" loading="lazy" />
        <figcaption><span>${escapeHtml(photo.caption || "")}</span><time>${escapeHtml(photo.date || "")}</time></figcaption>
      </figure>
    `;
  }).filter(Boolean).join("");

  setActiveRoute("photos");
  renderDirectory();
  elements.content.innerHTML = `
    <section class="photos-view">
      <header class="page-header">
        <div>
          <p class="eyebrow">PHOTO JOURNAL</p>
          <h1>照片</h1>
        </div>
        <p>生活、学习与旅途中的片段。</p>
      </header>
      ${photoItems ? `<div class="photo-grid">${photoItems}</div>` : '<div class="empty-state"><strong>暂无照片</strong><span>照片内容尚未添加</span></div>'}
    </section>
  `;
  focusContent();
}

function getNeteasePlaylistId() {
  const localValue = localStorage.getItem("onlyworld-netease-playlist");
  const configuredValue = configuredContent.music?.neteasePlaylistId || "";
  return String(localValue ?? configuredValue).replace(/\D/g, "");
}

function renderMusic() {
  const playlistId = getNeteasePlaylistId();
  const playlistTitle = configuredContent.music?.title || "我的歌单";
  const player = playlistId
    ? `<iframe title="${escapeHtml(playlistTitle)}" src="https://music.163.com/outchain/player?type=0&id=${playlistId}&auto=0&height=430" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>
       <a class="music-external" href="https://music.163.com/#/playlist?id=${playlistId}" target="_blank" rel="noreferrer">在网易云音乐打开</a>`
    : '<div class="music-empty"><span>尚未设置网易云歌单</span></div>';

  setActiveRoute("music");
  renderDirectory();
  elements.content.innerHTML = `
    <section class="music-view">
      <header class="page-header">
        <div>
          <p class="eyebrow">NOW PLAYING</p>
          <h1>音乐</h1>
        </div>
        <p>${escapeHtml(playlistTitle)}</p>
      </header>
      <div class="music-config">
        <input id="neteasePlaylistInput" type="text" inputmode="numeric" value="${playlistId}" placeholder="网易云歌单 ID" aria-label="网易云歌单 ID" />
        <button class="text-button primary" type="button" data-action="load-music">载入歌单</button>
      </div>
      <div class="music-player">${player}</div>
    </section>
  `;
  focusContent();
}

function getProfileContent() {
  try {
    return { ...profileContent, ...JSON.parse(localStorage.getItem("onlyworld-profile") || "{}") };
  } catch {
    return { ...profileContent };
  }
}

function safeAvatarSource(value) {
  const source = String(value || "").trim();
  return /^(data:image\/|https?:\/\/|assets\/|\.\/|\.\.\/)/i.test(source) ? source : "";
}

function normalizeGithubUsername(value) {
  return String(value || "")
    .trim()
    .replace(/^https?:\/\/(www\.)?github\.com\//i, "")
    .replace(/^@/, "")
    .split("/")[0]
    .replace(/[^a-z0-9-]/gi, "");
}

function renderProfile() {
  const profile = getProfileContent();
  const avatarSource = safeAvatarSource(profile.avatar);
  const githubUsername = normalizeGithubUsername(profile.github);
  const email = String(profile.email || "").trim();
  const contactLinks = [
    email ? `<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>` : "",
    githubUsername ? `<a href="https://github.com/${escapeHtml(githubUsername)}" target="_blank" rel="noreferrer">GitHub · @${escapeHtml(githubUsername)}</a>` : "",
  ].filter(Boolean).join("");

  setActiveRoute("profile");
  renderDirectory();
  elements.content.innerHTML = `
    <section class="profile-view">
      <header class="profile-header">
        <div class="profile-header-row">
          <div>
            <p class="eyebrow">ABOUT ONLYWORLD</p>
            <h1>关于我</h1>
            <p>这里记录我是谁、正在关注什么，以及这个个人空间存在的原因。</p>
          </div>
          <button class="icon-button" type="button" data-action="edit-profile" aria-label="编辑个人资料" title="编辑个人资料"><span aria-hidden="true">✎</span></button>
        </div>
      </header>

      <div class="profile-hero">
        <div class="profile-avatar">${avatarSource ? `<img src="${escapeHtml(avatarSource)}" alt="OnlyWorld 的头像" />` : "<span aria-hidden=\"true\">OW</span>"}</div>
        <div class="profile-intro">
          <h2>${escapeHtml(profile.greeting)}</h2>
          <p>${escapeHtml(profile.bio)}</p>
          <div class="profile-contact-links">${contactLinks || '<span class="profile-contact-empty">尚未填写邮箱或 GitHub</span>'}</div>
        </div>
      </div>

      <dl class="profile-facts">
        <div><dt>当前方向</dt><dd>${escapeHtml(profile.direction)}</dd></div>
        <div><dt>记录主题</dt><dd>${escapeHtml(profile.topics)}</dd></div>
        <div><dt>学习状态</dt><dd>${escapeHtml(profile.status)}</dd></div>
      </dl>

      <section class="profile-section">
        <h3>这个网站</h3>
        <p>${escapeHtml(profile.website)}</p>
      </section>
      <section class="profile-section">
        <h3>我相信</h3>
        <p>${escapeHtml(profile.belief)}</p>
      </section>
    </section>
  `;
  focusContent();
}

function renderArticle(noteId) {
  const note = allEntries.find((item) => item.id === noteId);
  if (!note) {
    renderHome();
    return;
  }

  setActiveRoute(note.kind === "thought" ? "thoughts" : "articles");
  renderDirectory(note.id);
  elements.content.innerHTML = `
    <article class="article-view">
      <header class="article-head">
        <button class="back-link" type="button" data-route="${note.kind === "thought" ? "thoughts" : "home"}"><span aria-hidden="true">←</span> 返回${note.kind === "thought" ? "杂谈" : "首页"}</button>
        <div class="article-meta">
          <time datetime="${note.date}">${formatDate(note.date)}</time>
          <span>阅读约 ${note.readTime}</span>
          ${note.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
        </div>
        <h1>${note.title}</h1>
        <p class="article-summary">${note.summary}</p>
      </header>
      <div class="prose">${note.content}</div>
    </article>
  `;
  focusContent();
}

function renderSearch(query) {
  const normalized = query.trim().toLocaleLowerCase("zh-CN");
  if (!normalized) {
    renderHome();
    return;
  }

  const matches = allEntries.filter((note) => [note.title, note.summary, ...note.tags]
    .join(" ")
    .toLocaleLowerCase("zh-CN")
    .includes(normalized));

  setActiveRoute("");
  renderDirectory();
  elements.content.innerHTML = `
    <section class="search-view">
      <header class="search-header">
        <p class="eyebrow">SEARCH</p>
        <h1>“${escapeHtml(query.trim())}” 的搜索结果</h1>
      </header>
      <div class="search-results">
        ${matches.length ? matches.map(noteRow).join("") : `
          <div class="empty-state">
            <strong>没有找到相关笔记</strong>
            <span>试试更短的关键词</span>
          </div>
        `}
      </div>
    </section>
  `;
  focusContent();
}

function focusContent() {
  elements.content.scrollTop = 0;
  window.scrollTo({ top: 0, behavior: "auto" });
  elements.content.focus({ preventScroll: true });
  closeMenu();
  updateReadingProgress();
}

function openMenu() {
  elements.sidebar.classList.add("is-open");
  elements.scrim.hidden = false;
}

function closeMenu() {
  elements.sidebar.classList.remove("is-open");
  elements.scrim.hidden = true;
}

function setBackground(dataUrl) {
  const backgroundValue = dataUrl ? `url("${dataUrl}")` : "";
  elements.wallpaper.style.backgroundImage = backgroundValue;
  elements.backgroundPreview.style.backgroundImage = backgroundValue;
  localStorage.setItem("onlyworld-background", dataUrl || "");
}

function resizeImage(file, maxDimension = 1600, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const image = new Image();
      image.onerror = reject;
      image.onload = () => {
        const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function applyAppearance() {
  const background = localStorage.getItem("onlyworld-background")
    || localStorage.getItem("onlyworld-background-left")
    || localStorage.getItem("onlyworld-background-right");
  const shade = localStorage.getItem("onlyworld-shade") || "32";
  const blur = localStorage.getItem("onlyworld-blur") || "0";
  const contentOpacity = localStorage.getItem("onlyworld-content-opacity") || "70";
  const navOpacity = localStorage.getItem("onlyworld-nav-opacity") || "88";

  if (background) setBackground(background);
  elements.shadeInput.value = shade;
  elements.blurInput.value = blur;
  elements.contentOpacityInput.value = contentOpacity;
  elements.navOpacityInput.value = navOpacity;
  updateShade(shade);
  updateBlur(blur);
  updateContentOpacity(contentOpacity);
  updateNavOpacity(navOpacity);
}

function updateShade(value) {
  document.documentElement.style.setProperty("--shade-opacity", Number(value) / 100);
  elements.shadeValue.textContent = `${value}%`;
}

function updateBlur(value) {
  document.documentElement.style.setProperty("--backdrop-blur", `${value}px`);
  elements.blurValue.textContent = `${value}px`;
}

function updateContentOpacity(value) {
  document.documentElement.style.setProperty("--content-opacity", Number(value) / 100);
  elements.contentOpacityValue.textContent = `${value}%`;
}

function updateNavOpacity(value) {
  document.documentElement.style.setProperty("--nav-opacity", Number(value) / 100);
  elements.navOpacityValue.textContent = `${value}%`;
}

function getWelcomeCopy() {
  try {
    return { ...welcomeDefaults, ...JSON.parse(localStorage.getItem("onlyworld-welcome-copy") || "{}") };
  } catch {
    return { ...welcomeDefaults };
  }
}

function applyWelcomeCopy(copy) {
  elements.welcomeKicker.textContent = copy.kicker;
  elements.welcomeTitle.textContent = copy.title;
  elements.welcomeSubtitle.textContent = copy.subtitle;
  elements.enterButtonText.textContent = copy.button;
  elements.welcomeTitle.classList.toggle("is-long", copy.title.length > 12);
  elements.welcomeTitle.classList.toggle("is-very-long", copy.title.length > 18);
}

function openWelcomeEditor() {
  const copy = getWelcomeCopy();
  elements.welcomeKickerInput.value = copy.kicker;
  elements.welcomeTitleInput.value = copy.title;
  elements.welcomeSubtitleInput.value = copy.subtitle;
  elements.enterButtonInput.value = copy.button;
  elements.welcomeEditorDialog.showModal();
}

function saveWelcomeCopy() {
  const copy = {
    kicker: elements.welcomeKickerInput.value.trim() || welcomeDefaults.kicker,
    title: elements.welcomeTitleInput.value.trim() || welcomeDefaults.title,
    subtitle: elements.welcomeSubtitleInput.value.trim() || welcomeDefaults.subtitle,
    button: elements.enterButtonInput.value.trim() || welcomeDefaults.button,
  };
  localStorage.setItem("onlyworld-welcome-copy", JSON.stringify(copy));
  applyWelcomeCopy(copy);
}

let pendingProfileAvatar = "";

function updateProfileAvatarPreview(source) {
  elements.profileAvatarPreview.replaceChildren();
  const safeSource = safeAvatarSource(source);
  if (safeSource) {
    const image = document.createElement("img");
    image.src = safeSource;
    image.alt = "";
    elements.profileAvatarPreview.append(image);
  } else {
    elements.profileAvatarPreview.textContent = "OW";
  }
}

function populateProfileEditor(profile) {
  pendingProfileAvatar = safeAvatarSource(profile.avatar);
  updateProfileAvatarPreview(pendingProfileAvatar);
  elements.profileGreetingInput.value = profile.greeting || "";
  elements.profileBioInput.value = profile.bio || "";
  elements.profileEmailInput.value = profile.email || "";
  elements.profileGithubInput.value = profile.github || "";
  elements.profileDirectionInput.value = profile.direction || "";
  elements.profileTopicsInput.value = profile.topics || "";
  elements.profileStatusInput.value = profile.status || "";
}

function openProfileEditor() {
  populateProfileEditor(getProfileContent());
  elements.profileEditorDialog.showModal();
}

function saveProfile() {
  const current = getProfileContent();
  const profile = {
    ...current,
    avatar: pendingProfileAvatar,
    greeting: elements.profileGreetingInput.value.trim() || profileContent.greeting,
    bio: elements.profileBioInput.value.trim() || profileContent.bio,
    email: elements.profileEmailInput.value.trim(),
    github: normalizeGithubUsername(elements.profileGithubInput.value),
    direction: elements.profileDirectionInput.value.trim() || profileContent.direction,
    topics: elements.profileTopicsInput.value.trim() || profileContent.topics,
    status: elements.profileStatusInput.value.trim() || profileContent.status,
  };
  localStorage.setItem("onlyworld-profile", JSON.stringify(profile));
  renderProfile();
}

function showWelcome() {
  window.scrollTo({ top: 0, behavior: "auto" });
  elements.welcomeScreen.hidden = false;
  elements.welcomeScreen.classList.remove("is-leaving");
  document.body.classList.add("splash-active");
  window.setTimeout(() => elements.enterSite.focus({ preventScroll: true }), 80);
}

function enterSite() {
  elements.welcomeScreen.classList.add("is-leaving");
  document.body.classList.remove("splash-active");
  window.setTimeout(() => {
    elements.welcomeScreen.hidden = true;
    elements.searchInput.focus({ preventScroll: true });
  }, 540);
}

function updateReadingProgress() {
  const documentMax = document.documentElement.scrollHeight - window.innerHeight;
  const contentMax = elements.content.scrollHeight - elements.content.clientHeight;
  const documentProgress = documentMax > 0 ? window.scrollY / documentMax : 0;
  const contentProgress = contentMax > 0 ? elements.content.scrollTop / contentMax : 0;
  const progress = Math.max(documentProgress, contentProgress);
  elements.readingProgress.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
}

function updateClock() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  elements.liveClock.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

function updateWallpaperParallax(event) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const normalizedX = event.clientX / window.innerWidth;
  const normalizedY = event.clientY / window.innerHeight;
  const x = (normalizedX - 0.5) * 10;
  const y = (normalizedY - 0.5) * 8;
  document.documentElement.style.setProperty("--wallpaper-x", `${x.toFixed(2)}px`);
  document.documentElement.style.setProperty("--wallpaper-y", `${y.toFixed(2)}px`);
  if (!elements.welcomeScreen.hidden) {
    elements.welcomeScreen.style.setProperty("--welcome-x", `${(normalizedX * 100).toFixed(2)}%`);
    elements.welcomeScreen.style.setProperty("--welcome-y", `${(normalizedY * 100).toFixed(2)}%`);
    elements.welcomeScreen.style.setProperty("--welcome-tilt-x", `${((0.5 - normalizedY) * 3).toFixed(2)}deg`);
    elements.welcomeScreen.style.setProperty("--welcome-tilt-y", `${((normalizedX - 0.5) * 4).toFixed(2)}deg`);
  }
}

function setupWelcomeCanvas() {
  const canvas = elements.welcomeCanvas;
  const context = canvas.getContext("2d");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const ripples = [];
  let width = 0;
  let height = 0;
  let lastRippleAt = 0;

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function polygon(points, fill) {
    context.beginPath();
    context.moveTo(points[0][0], points[0][1]);
    points.slice(1).forEach(([x, y]) => context.lineTo(x, y));
    context.closePath();
    context.fillStyle = fill;
    context.fill();
  }

  function addRipple(event, force = false) {
    if (elements.welcomeScreen.hidden || reducedMotion.matches) return;
    const now = performance.now();
    if (!force && now - lastRippleAt < 95) return;
    lastRippleAt = now;
    ripples.push({ x: event.clientX, y: event.clientY, born: now });
    if (ripples.length > 12) ripples.shift();
  }

  function draw(timestamp) {
    if (!elements.welcomeScreen.hidden) {
      const time = reducedMotion.matches ? 0 : timestamp * 0.00018;
      context.clearRect(0, 0, width, height);
      context.fillStyle = "#edf8fd";
      context.fillRect(0, 0, width, height);

      context.save();
      context.globalCompositeOperation = "multiply";
      const driftX = Math.sin(time) * 34;
      const driftY = Math.cos(time * 0.8) * 24;
      polygon([
        [width * 0.58 + driftX, -40],
        [width * 0.94 + driftX, height * 0.12],
        [width * 0.76 + driftX, height * 0.54],
        [width * 0.48 + driftX, height * 0.28],
      ], "rgba(100, 183, 222, 0.13)");
      polygon([
        [-60, height * 0.52 + driftY],
        [width * 0.28, height * 0.32 + driftY],
        [width * 0.46, height * 0.88 + driftY],
        [width * 0.08, height + 50 + driftY],
      ], "rgba(245, 181, 151, 0.11)");
      polygon([
        [width * 0.67 - driftX * 0.4, height * 0.56],
        [width * 1.04, height * 0.42],
        [width * 0.93, height * 0.92],
        [width * 0.61 - driftX * 0.4, height * 0.78],
      ], "rgba(186, 224, 239, 0.16)");
      context.restore();

      for (let index = 0; index < 8; index += 1) {
        const baseY = height * (0.17 + index * 0.1);
        context.beginPath();
        for (let x = -20; x <= width + 20; x += 18) {
          const y = baseY + Math.sin(x * 0.009 + time * 8 + index * 0.65) * (5 + index * 0.7);
          if (x === -20) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.strokeStyle = `rgba(79, 154, 194, ${0.055 + index * 0.006})`;
        context.lineWidth = index % 3 === 0 ? 1.5 : 1;
        context.stroke();
      }

      for (let index = ripples.length - 1; index >= 0; index -= 1) {
        const ripple = ripples[index];
        const age = timestamp - ripple.born;
        if (age > 1500) {
          ripples.splice(index, 1);
          continue;
        }
        const progress = age / 1500;
        const radius = 18 + progress * 150;
        context.beginPath();
        context.arc(ripple.x, ripple.y, radius, 0, Math.PI * 2);
        context.strokeStyle = `rgba(68, 146, 190, ${0.24 * (1 - progress)})`;
        context.lineWidth = 1.6;
        context.stroke();
        context.beginPath();
        context.arc(ripple.x, ripple.y, radius * 0.66, 0, Math.PI * 2);
        context.strokeStyle = `rgba(223, 138, 114, ${0.12 * (1 - progress)})`;
        context.lineWidth = 1;
        context.stroke();
      }
    }
    window.requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", resize);
  elements.welcomeScreen.addEventListener("pointermove", addRipple, { passive: true });
  elements.welcomeScreen.addEventListener("pointerdown", (event) => addRipple(event, true), { passive: true });
  window.requestAnimationFrame(draw);
}

document.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-action]");
  if (actionButton?.dataset.action === "edit-profile") {
    openProfileEditor();
    return;
  }
  if (actionButton?.dataset.action === "load-music") {
    const input = document.querySelector("#neteasePlaylistInput");
    const playlistId = input.value.replace(/\D/g, "");
    if (playlistId) localStorage.setItem("onlyworld-netease-playlist", playlistId);
    else localStorage.removeItem("onlyworld-netease-playlist");
    renderMusic();
    return;
  }

  const noteButton = event.target.closest("[data-note-id]");
  if (noteButton) {
    renderArticle(noteButton.dataset.noteId);
    return;
  }

  const routeButton = event.target.closest("[data-route]");
  if (routeButton) {
    const routes = {
      home: renderHome,
      articles: renderArticles,
      archive: renderArchive,
      thoughts: renderThoughts,
      photos: renderPhotos,
      music: renderMusic,
      profile: renderProfile,
    };
    (routes[routeButton.dataset.route] || renderHome)();
  }
});

elements.searchInput.addEventListener("input", (event) => renderSearch(event.target.value));
document.querySelector("#menuButton").addEventListener("click", openMenu);
document.querySelector("#closeMenuButton").addEventListener("click", closeMenu);
elements.scrim.addEventListener("click", closeMenu);

document.querySelector("#backgroundButton").addEventListener("click", () => {
  elements.settingsDialog.showModal();
});

document.querySelector("#returnWelcomeButton").addEventListener("click", showWelcome);
document.querySelector("#welcomeEditButton").addEventListener("click", openWelcomeEditor);
document.querySelector("#editWelcomeButton").addEventListener("click", openWelcomeEditor);
document.querySelector("#saveWelcomeCopy").addEventListener("click", saveWelcomeCopy);
document.querySelector("#resetWelcomeCopy").addEventListener("click", () => {
  localStorage.removeItem("onlyworld-welcome-copy");
  applyWelcomeCopy(welcomeDefaults);
  elements.welcomeKickerInput.value = welcomeDefaults.kicker;
  elements.welcomeTitleInput.value = welcomeDefaults.title;
  elements.welcomeSubtitleInput.value = welcomeDefaults.subtitle;
  elements.enterButtonInput.value = welcomeDefaults.button;
});

elements.profileAvatarInput.addEventListener("change", async (event) => {
  const [file] = event.target.files;
  if (!file) return;
  try {
    pendingProfileAvatar = await resizeImage(file, 640, 0.86);
    updateProfileAvatarPreview(pendingProfileAvatar);
  } catch (error) {
    console.error("Unable to load profile image", error);
  }
});

document.querySelector("#removeProfileAvatar").addEventListener("click", () => {
  pendingProfileAvatar = "";
  elements.profileAvatarInput.value = "";
  updateProfileAvatarPreview("");
});

document.querySelector("#saveProfile").addEventListener("click", (event) => {
  if (!elements.profileEditorForm.reportValidity()) {
    event.preventDefault();
    return;
  }
  saveProfile();
});

document.querySelector("#resetProfile").addEventListener("click", () => {
  localStorage.removeItem("onlyworld-profile");
  populateProfileEditor(profileContent);
  renderProfile();
});

elements.backgroundInput.addEventListener("change", async (event) => {
  const [file] = event.target.files;
  if (!file) return;
  try {
    setBackground(await resizeImage(file));
  } catch (error) {
    console.error("Unable to load wallpaper image", error);
  }
});

elements.shadeInput.addEventListener("input", (event) => {
  updateShade(event.target.value);
  localStorage.setItem("onlyworld-shade", event.target.value);
});

elements.blurInput.addEventListener("input", (event) => {
  updateBlur(event.target.value);
  localStorage.setItem("onlyworld-blur", event.target.value);
});

elements.contentOpacityInput.addEventListener("input", (event) => {
  updateContentOpacity(event.target.value);
  localStorage.setItem("onlyworld-content-opacity", event.target.value);
});

elements.navOpacityInput.addEventListener("input", (event) => {
  updateNavOpacity(event.target.value);
  localStorage.setItem("onlyworld-nav-opacity", event.target.value);
});

document.querySelector("#resetBackground").addEventListener("click", () => {
  localStorage.removeItem("onlyworld-background");
  localStorage.removeItem("onlyworld-background-left");
  localStorage.removeItem("onlyworld-background-right");
  localStorage.removeItem("onlyworld-shade");
  localStorage.removeItem("onlyworld-blur");
  localStorage.removeItem("onlyworld-content-opacity");
  localStorage.removeItem("onlyworld-nav-opacity");
  elements.wallpaper.removeAttribute("style");
  elements.backgroundPreview.removeAttribute("style");
  elements.shadeInput.value = "32";
  elements.blurInput.value = "0";
  elements.contentOpacityInput.value = "70";
  elements.navOpacityInput.value = "88";
  updateShade("32");
  updateBlur("0");
  updateContentOpacity("70");
  updateNavOpacity("88");
});

elements.enterSite.addEventListener("click", enterSite);
window.addEventListener("pointermove", updateWallpaperParallax, { passive: true });
window.addEventListener("scroll", updateReadingProgress, { passive: true });
elements.content.addEventListener("scroll", updateReadingProgress, { passive: true });

applyAppearance();
applyWelcomeCopy(getWelcomeCopy());
setupWelcomeCanvas();
updateClock();
window.setInterval(updateClock, 250);
renderHome();
