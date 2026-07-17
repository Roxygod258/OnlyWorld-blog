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
      <p>很多知识在第一次理解时似乎很清楚，隔一段时间再回头，却只剩下模糊的结论。真正值得保存的，是我被过往牵住的时光</p>
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

const appearanceDefaults = {
  wallpaper: "",
  shade: 32,
  blur: 0,
  contentOpacity: 70,
  navOpacity: 88,
  musicVolume: 80,
  sakura: true,
  ...(configuredContent.appearance || {}),
};

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
  birthday: "7.21",
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
  musicAudio: document.querySelector("#musicAudio"),
  directory: document.querySelector("#directory"),
  noteCount: document.querySelector("#noteCount"),
  thoughtsDirectory: document.querySelector("#thoughtsDirectory"),
  thoughtCount: document.querySelector("#thoughtCount"),
  searchInput: document.querySelector("#searchInput"),
  sidebar: document.querySelector("#sidebar"),
  scrim: document.querySelector("#scrim"),
  wallpaper: document.querySelector(".wallpaper-main"),
  sakuraCanvas: document.querySelector("#sakuraCanvas"),
  brandAvatar: document.querySelector("#brandAvatar"),
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
  profileBirthdayInput: document.querySelector("#profileBirthdayInput"),
  profileGithubInput: document.querySelector("#profileGithubInput"),
  profileDirectionInput: document.querySelector("#profileDirectionInput"),
  profileTopicsInput: document.querySelector("#profileTopicsInput"),
  profileStatusInput: document.querySelector("#profileStatusInput"),
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
          <p class="eyebrow">ONLYWORLD / MY LITTLE WORLD</p>
          <h1>只是在想，<br /><em>有在做些事。</em></h1>
          <p class="lead">因为记性太差了，所以想在这里写下一些感兴趣的东西</p>
        </div>
        <div class="focus-panel">
          <span>CURRENT FOCUS</span>
          <strong>Probably Anything</strong>
          <small>（不要在意）</small>
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
        <p>持续学习过程中的整理和复盘。</p>
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

function safeAudioSource(value) {
  const source = String(value || "").trim();
  return /^(data:audio\/|https?:\/\/|assets\/|\.\/|\.\.\/)/i.test(source) ? source : "";
}

function getMusicVolumePercent() {
  const savedValue = localStorage.getItem("onlyworld-music-volume");
  const value = savedValue === null ? appearanceDefaults.musicVolume : savedValue;
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(100, Math.max(0, number)) : 80;
}

function formatPlaybackTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

function updateMusicPlayerUi(audio) {
  const playButton = document.querySelector('[data-action="music-toggle"]');
  const player = document.querySelector(".single-track-player");
  const progress = document.querySelector("#musicProgress");
  const currentTime = document.querySelector("#musicCurrentTime");
  const duration = document.querySelector("#musicDuration");
  const status = document.querySelector("#musicStatus");
  if (!playButton || !player || !progress || !currentTime || !duration || !status) return;
  playButton.textContent = audio.paused ? "▶" : "Ⅱ";
  playButton.setAttribute("aria-label", audio.paused ? "播放" : "暂停");
  player.classList.toggle("is-playing", !audio.paused);
  progress.max = Number.isFinite(audio.duration) ? audio.duration : 0;
  progress.value = audio.currentTime || 0;
  currentTime.textContent = formatPlaybackTime(audio.currentTime);
  duration.textContent = formatPlaybackTime(audio.duration);
  if (audio.error) status.textContent = "音频加载失败，请检查歌曲路径";
  else status.textContent = audio.paused ? "已暂停 · 单曲循环" : "正在播放 · 单曲循环";
}

function initializeMusicAudio() {
  const audio = elements.musicAudio;
  audio.loop = true;
  audio.volume = getMusicVolumePercent() / 100;
  ["play", "pause", "timeupdate", "loadedmetadata", "durationchange", "error"].forEach((eventName) => {
    audio.addEventListener(eventName, () => updateMusicPlayerUi(audio));
  });
}

function configureMusicSource(source) {
  const audio = elements.musicAudio;
  if (source && audio.getAttribute("src") !== source) {
    audio.setAttribute("src", source);
    audio.load();
  } else if (!source && audio.getAttribute("src")) {
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
  }
}

function renderMusic() {
  const title = String(configuredContent.music?.title || "我的单曲").trim();
  const artist = String(configuredContent.music?.artist || "未知歌手").trim();
  const source = safeAudioSource(configuredContent.music?.src);
  const coverSource = safeAvatarSource(configuredContent.music?.cover);
  const cover = coverSource
    ? `<img src="${escapeHtml(coverSource)}" alt="${escapeHtml(title)} 封面" />`
    : '<span aria-hidden="true">♪</span>';
  configureMusicSource(source);

  setActiveRoute("music");
  renderDirectory();
  elements.content.innerHTML = `
    <section class="music-view">
      <header class="page-header">
        <div>
          <p class="eyebrow">SINGLE LOOP</p>
          <h1>音乐</h1>
        </div>
        <p>默认关闭，点击播放后单曲循环</p>
      </header>
      <div class="music-player">
        <div class="single-track-player${source ? "" : " is-unconfigured"}">
          <div class="single-disc" aria-hidden="true">
            <div class="single-cover">${cover}</div>
          </div>
          <div class="single-track-copy">
            <p class="eyebrow">NOW PLAYING</p>
            <h2>${escapeHtml(title)}</h2>
            <p>${escapeHtml(artist)}</p>
            <span id="musicStatus">${source ? "已暂停 · 单曲循环" : "尚未配置音频，请填写歌曲路径"}</span>
          </div>
          <div class="music-progress-row">
            <time id="musicCurrentTime">00:00</time>
            <input id="musicProgress" type="range" min="0" max="0" value="0" step="0.1" aria-label="播放进度"${source ? "" : " disabled"} />
            <time id="musicDuration">00:00</time>
          </div>
          <div class="single-music-controls">
            <button class="player-button play-button" type="button" data-action="music-toggle" aria-label="播放" title="播放或暂停"${source ? "" : " disabled"}>▶</button>
            <label class="volume-control"><span>音量</span><input id="musicVolume" type="range" min="0" max="1" value="${getMusicVolumePercent() / 100}" step="0.05" aria-label="音量" /></label>
          </div>
        </div>
      </div>
    </section>
  `;
  focusContent();
  updateMusicPlayerUi(elements.musicAudio);
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

function updateBrandAvatar() {
  const profile = getProfileContent();
  const source = safeAvatarSource(profile.avatar);
  elements.brandAvatar.replaceChildren();
  if (source) {
    const image = document.createElement("img");
    image.src = source;
    image.alt = "";
    elements.brandAvatar.append(image);
  } else {
    elements.brandAvatar.textContent = "O";
  }
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
  updateBrandAvatar();
  const avatarSource = safeAvatarSource(profile.avatar);
  const githubUsername = normalizeGithubUsername(profile.github);
  const email = String(profile.email || "").trim();
  const emailAddress = email.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || "";
  const birthday = String(profile.birthday || "").trim();
  const contactLinks = [
    email ? `<a href="${emailAddress ? `mailto:${escapeHtml(emailAddress)}` : "#"}">${escapeHtml(email)}</a>` : "",
    birthday ? `<span class="profile-birthday">生日：${escapeHtml(birthday)}</span>` : "",
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

function getAppearanceSettings() {
  return {
    shade: localStorage.getItem("onlyworld-shade") ?? String(appearanceDefaults.shade),
    blur: localStorage.getItem("onlyworld-blur") ?? String(appearanceDefaults.blur),
    contentOpacity: localStorage.getItem("onlyworld-content-opacity") ?? String(appearanceDefaults.contentOpacity),
    navOpacity: localStorage.getItem("onlyworld-nav-opacity") ?? String(appearanceDefaults.navOpacity),
    musicVolume: String(getMusicVolumePercent()),
    sakura: localStorage.getItem("onlyworld-sakura") === null
      ? Boolean(appearanceDefaults.sakura)
      : localStorage.getItem("onlyworld-sakura") === "true",
  };
}

function renderSettings() {
  const settings = getAppearanceSettings();
  setActiveRoute("settings");
  renderDirectory();
  elements.content.innerHTML = `
    <section class="settings-view">
      <header class="page-header settings-page-header">
        <div>
          <p class="eyebrow">PREFERENCES</p>
          <h1>设置</h1>
        </div>
        <button class="text-button secondary" type="button" data-action="reset-settings">恢复默认</button>
      </header>

      <section class="settings-section" aria-labelledby="appearanceSettingsTitle">
        <div class="settings-section-copy">
          <p class="eyebrow">APPEARANCE</p>
          <h2 id="appearanceSettingsTitle">显示</h2>
          <p>调整页面背景与内容层次。</p>
        </div>
        <div class="settings-controls">
          <label class="range-control">
            <span>遮罩强度 <output id="shadeValue">${settings.shade}%</output></span>
            <input id="shadeInput" type="range" min="10" max="72" value="${settings.shade}" />
          </label>
          <label class="range-control">
            <span>背景柔化 <output id="blurValue">${settings.blur}px</output></span>
            <input id="blurInput" type="range" min="0" max="16" value="${settings.blur}" />
          </label>
          <label class="range-control">
            <span>内容不透明度 <output id="contentOpacityValue">${settings.contentOpacity}%</output></span>
            <input id="contentOpacityInput" type="range" min="38" max="100" value="${settings.contentOpacity}" />
          </label>
          <label class="range-control">
            <span>导航不透明度 <output id="navOpacityValue">${settings.navOpacity}%</output></span>
            <input id="navOpacityInput" type="range" min="45" max="100" value="${settings.navOpacity}" />
          </label>
        </div>
      </section>

      <section class="settings-section" aria-labelledby="motionSettingsTitle">
        <div class="settings-section-copy">
          <p class="eyebrow">MOTION</p>
          <h2 id="motionSettingsTitle">动态效果</h2>
          <p>控制页面上的环境动画。</p>
        </div>
        <div class="settings-controls">
          <label class="toggle-control">
            <span><strong>樱花飘落</strong><small>在全站显示轻量樱花飘落效果</small></span>
            <input id="sakuraToggle" type="checkbox"${settings.sakura ? " checked" : ""} />
            <span class="toggle-track" aria-hidden="true"><span></span></span>
          </label>
        </div>
      </section>

      <section class="settings-section" aria-labelledby="audioSettingsTitle">
        <div class="settings-section-copy">
          <p class="eyebrow">AUDIO</p>
          <h2 id="audioSettingsTitle">音乐</h2>
          <p>设置单曲播放器的默认音量。</p>
        </div>
        <div class="settings-controls">
          <label class="range-control">
            <span>音乐播放音量 <output id="musicVolumeValue">${settings.musicVolume}%</output></span>
            <input id="musicVolumeInput" type="range" min="0" max="100" value="${settings.musicVolume}" />
          </label>
        </div>
      </section>
    </section>
  `;
  focusContent();
}

function setBackground(source, persist = false) {
  const safeSource = safeAvatarSource(source);
  const backgroundValue = safeSource ? `url(${JSON.stringify(safeSource)})` : "";
  elements.wallpaper.style.backgroundImage = backgroundValue;
  if (persist) localStorage.setItem("onlyworld-background", safeSource);
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
    || localStorage.getItem("onlyworld-background-right")
    || appearanceDefaults.wallpaper;
  const settings = getAppearanceSettings();

  setBackground(background);
  updateShade(settings.shade);
  updateBlur(settings.blur);
  updateContentOpacity(settings.contentOpacity);
  updateNavOpacity(settings.navOpacity);
  updateMusicVolume(settings.musicVolume);
  updateSakura(settings.sakura);
}

function updateShade(value) {
  document.documentElement.style.setProperty("--shade-opacity", Number(value) / 100);
  const output = document.querySelector("#shadeValue");
  if (output) output.textContent = `${value}%`;
}

function updateBlur(value) {
  document.documentElement.style.setProperty("--backdrop-blur", `${value}px`);
  const output = document.querySelector("#blurValue");
  if (output) output.textContent = `${value}px`;
}

function updateContentOpacity(value) {
  document.documentElement.style.setProperty("--content-opacity", Number(value) / 100);
  const output = document.querySelector("#contentOpacityValue");
  if (output) output.textContent = `${value}%`;
}

function updateNavOpacity(value) {
  document.documentElement.style.setProperty("--nav-opacity", Number(value) / 100);
  const output = document.querySelector("#navOpacityValue");
  if (output) output.textContent = `${value}%`;
}

function updateMusicVolume(value) {
  const percent = Math.min(100, Math.max(0, Number(value)));
  const settingsInput = document.querySelector("#musicVolumeInput");
  const settingsOutput = document.querySelector("#musicVolumeValue");
  if (settingsInput) settingsInput.value = String(percent);
  if (settingsOutput) settingsOutput.textContent = `${Math.round(percent)}%`;
  const audio = document.querySelector("#musicAudio");
  const playerVolume = document.querySelector("#musicVolume");
  if (audio) audio.volume = percent / 100;
  if (playerVolume) playerVolume.value = String(percent / 100);
}

let sakuraEnabled = false;

function updateSakura(enabled) {
  sakuraEnabled = Boolean(enabled);
  elements.sakuraCanvas.hidden = !sakuraEnabled;
  if (!sakuraEnabled) {
    const context = elements.sakuraCanvas.getContext("2d");
    context.clearRect(0, 0, elements.sakuraCanvas.width, elements.sakuraCanvas.height);
  }
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
  elements.profileBirthdayInput.value = profile.birthday || "";
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
    birthday: elements.profileBirthdayInput.value.trim() || profileContent.birthday,
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
  const lunarParts = new Intl.DateTimeFormat("zh-CN-u-ca-chinese", {
    month: "long",
    day: "numeric",
  }).formatToParts(now);
  const lunarMonth = lunarParts.find((part) => part.type === "month")?.value || "";
  const lunarDayNumber = Number(lunarParts.find((part) => part.type === "day")?.value || 1);
  const lunarDay = lunarDayNumber <= 10
    ? `初${["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"][lunarDayNumber - 1]}`
    : lunarDayNumber < 20
      ? `十${["一", "二", "三", "四", "五", "六", "七", "八", "九"][lunarDayNumber - 11]}`
      : lunarDayNumber === 20
        ? "二十"
        : lunarDayNumber < 30
          ? `廿${["一", "二", "三", "四", "五", "六", "七", "八", "九"][lunarDayNumber - 21]}`
          : "三十";
  const solarDate = `${now.getFullYear()}/${pad(now.getMonth() + 1)}/${pad(now.getDate())}`;
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  elements.liveClock.textContent = `${solarDate}  ${time}  农历${lunarMonth}${lunarDay}`;
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

function setupSakuraEffect() {
  const canvas = elements.sakuraCanvas;
  const context = canvas.getContext("2d");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let petals = [];
  let width = 0;
  let height = 0;

  function createPetal(fromTop = false) {
    return {
      x: Math.random() * width,
      y: fromTop ? -20 - Math.random() * height * 0.2 : Math.random() * height,
      size: 5 + Math.random() * 7,
      speed: 0.35 + Math.random() * 0.7,
      sway: 0.5 + Math.random() * 1.2,
      phase: Math.random() * Math.PI * 2,
      rotation: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.018,
      alpha: 0.32 + Math.random() * 0.38,
    };
  }

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const targetCount = Math.max(16, Math.min(38, Math.round(width / 42)));
    petals = Array.from({ length: targetCount }, () => createPetal());
  }

  function drawPetal(petal) {
    context.save();
    context.translate(petal.x, petal.y);
    context.rotate(petal.rotation);
    context.fillStyle = `rgba(242, 151, 174, ${petal.alpha})`;
    context.beginPath();
    context.moveTo(0, -petal.size);
    context.bezierCurveTo(petal.size * 0.9, -petal.size * 0.45, petal.size * 0.7, petal.size * 0.55, 0, petal.size);
    context.bezierCurveTo(-petal.size * 0.7, petal.size * 0.55, -petal.size * 0.9, -petal.size * 0.45, 0, -petal.size);
    context.fill();
    context.restore();
  }

  function draw(timestamp) {
    context.clearRect(0, 0, width, height);
    if (sakuraEnabled && !reducedMotion.matches) {
      petals.forEach((petal) => {
        petal.y += petal.speed;
        petal.x += Math.sin(timestamp * 0.001 + petal.phase) * petal.sway;
        petal.rotation += petal.spin;
        if (petal.y > height + 24 || petal.x < -30 || petal.x > width + 30) {
          Object.assign(petal, createPetal(true));
        }
        drawPetal(petal);
      });
    }
    window.requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", resize);
  window.requestAnimationFrame(draw);
}

document.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-action]");
  if (actionButton?.dataset.action === "edit-profile") {
    openProfileEditor();
    return;
  }
  if (actionButton?.dataset.action === "music-toggle") {
    const audio = elements.musicAudio;
    if (!audio?.getAttribute("src")) return;
    if (audio.paused) audio.play().catch(() => updateMusicPlayerUi(audio));
    else audio.pause();
    return;
  }
  if (actionButton?.dataset.action === "reset-settings") {
    localStorage.removeItem("onlyworld-shade");
    localStorage.removeItem("onlyworld-blur");
    localStorage.removeItem("onlyworld-content-opacity");
    localStorage.removeItem("onlyworld-nav-opacity");
    localStorage.removeItem("onlyworld-music-volume");
    localStorage.removeItem("onlyworld-sakura");
    applyAppearance();
    renderSettings();
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
      settings: renderSettings,
    };
    (routes[routeButton.dataset.route] || renderHome)();
  }
});

document.addEventListener("input", (event) => {
  const { id, value, checked } = event.target;
  if (id === "shadeInput") {
    updateShade(value);
    localStorage.setItem("onlyworld-shade", value);
  } else if (id === "blurInput") {
    updateBlur(value);
    localStorage.setItem("onlyworld-blur", value);
  } else if (id === "contentOpacityInput") {
    updateContentOpacity(value);
    localStorage.setItem("onlyworld-content-opacity", value);
  } else if (id === "navOpacityInput") {
    updateNavOpacity(value);
    localStorage.setItem("onlyworld-nav-opacity", value);
  } else if (id === "musicVolumeInput") {
    updateMusicVolume(value);
    localStorage.setItem("onlyworld-music-volume", value);
  } else if (id === "musicProgress") {
    elements.musicAudio.currentTime = Number(value);
    updateMusicPlayerUi(elements.musicAudio);
  } else if (id === "musicVolume") {
    const percent = Math.round(Number(value) * 100);
    updateMusicVolume(percent);
    localStorage.setItem("onlyworld-music-volume", String(percent));
  } else if (id === "sakuraToggle") {
    updateSakura(checked);
    localStorage.setItem("onlyworld-sakura", String(checked));
  }
});

elements.searchInput.addEventListener("input", (event) => renderSearch(event.target.value));
document.querySelector("#menuButton").addEventListener("click", openMenu);
document.querySelector("#closeMenuButton").addEventListener("click", closeMenu);
elements.scrim.addEventListener("click", closeMenu);

document.querySelector("#returnWelcomeButton").addEventListener("click", showWelcome);
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

elements.enterSite.addEventListener("click", enterSite);
window.addEventListener("pointermove", updateWallpaperParallax, { passive: true });
window.addEventListener("scroll", updateReadingProgress, { passive: true });
elements.content.addEventListener("scroll", updateReadingProgress, { passive: true });

setupSakuraEffect();
initializeMusicAudio();
configureMusicSource(safeAudioSource(configuredContent.music?.src));
applyAppearance();
applyWelcomeCopy(getWelcomeCopy());
updateBrandAvatar();
setupWelcomeCanvas();
updateClock();
window.setInterval(updateClock, 250);
renderHome();
