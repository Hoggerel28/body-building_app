const KEY = "fittrack.local.v1";

const bodyParts = ["胸部", "背部", "腿部", "肩部", "手臂", "核心", "有氧"];
const actionsByPart = {
  胸部: [
    "杠铃卧推", "哑铃卧推", "上斜杠铃卧推", "上斜哑铃卧推", "下斜卧推",
    "器械推胸", "史密斯卧推", "双杠臂屈伸", "俯卧撑", "窄距俯卧撑",
    "绳索夹胸", "哑铃飞鸟", "蝴蝶机夹胸", "上斜飞鸟", "下斜飞鸟"
  ],
  背部: [
    "引体向上", "高位下拉", "反握高位下拉", "窄握下拉", "坐姿划船",
    "杠铃划船", "哑铃单臂划船", "T 杠划船", "器械划船", "绳索直臂下压",
    "硬拉", "罗马尼亚硬拉", "山羊挺身", "面拉", "反向飞鸟"
  ],
  腿部: [
    "深蹲", "前蹲", "史密斯深蹲", "腿举", "哈克深蹲",
    "箭步蹲", "保加利亚分腿蹲", "臀桥", "髋推", "罗马尼亚硬拉",
    "腿屈伸", "腿弯举", "坐姿提踵", "站姿提踵", "内收外展机"
  ],
  肩部: [
    "杠铃推举", "哑铃推举", "阿诺德推举", "史密斯推举", "器械推肩",
    "哑铃侧平举", "绳索侧平举", "前平举", "俯身侧平举", "反向飞鸟",
    "面拉", "杠铃耸肩", "哑铃耸肩", "直立划船", "Y 字上举"
  ],
  手臂: [
    "杠铃弯举", "哑铃弯举", "锤式弯举", "牧师凳弯举", "绳索弯举",
    "集中弯举", "反握弯举", "绳索下压", "直杆下压", "过顶臂屈伸",
    "窄距卧推", "双杠臂屈伸", "仰卧臂屈伸", "哑铃颈后臂屈伸", "绳索单臂下压"
  ],
  核心: [
    "卷腹", "仰卧起坐", "平板支撑", "侧平板支撑", "俄罗斯转体",
    "悬垂举腿", "仰卧举腿", "登山跑", "死虫", "鸟狗",
    "绳索卷腹", "健腹轮", "反向卷腹", "触脚卷腹", "负重卷腹"
  ],
  有氧: [
    "跑步机慢跑", "跑步机快走", "户外跑", "椭圆机", "动感单车",
    "划船机", "跳绳", "爬楼机", "HIIT 间歇", "波比跳",
    "开合跳", "战绳", "游泳", "骑行", "快走"
  ],
};

const today = () => new Date().toISOString().slice(0, 10);
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

const seed = {
  activePage: "home",
  goal: "减脂",
  selectedPart: "腿部",
  selectedParts: ["腿部"],
  selectedChartPart: "胸部",
  profile: { name: "张伟", level: 12, gender: "男", height: 178, weight: 75, targetWeight: 70, fat: 18 },
  records: [
    { id: uid(), date: "2026-05-28", part: "腿部", action: "深蹲", weight: 95, reps: 6, sets: 5, note: "膝盖稳定，节奏放慢。" },
    { id: uid(), date: "2026-05-25", part: "胸部", action: "上斜哑铃卧推", weight: 28, reps: 10, sets: 4, note: "" },
  ],
  plans: [
    { id: uid(), day: "周一", title: "胸 + 三头", detail: "卧推、上斜推、绳索下压" },
    { id: uid(), day: "周三", title: "背 + 二头", detail: "划船、高位下拉、弯举" },
    { id: uid(), day: "周五", title: "腿 + 核心", detail: "深蹲、腿举、平板支撑" },
  ],
  foods: [
    { id: uid(), date: today(), name: "鸡胸肉饭", kcal: 520 },
    { id: uid(), date: today(), name: "蛋白粉", kcal: 130 },
  ],
  bodyLogs: [
    { id: uid(), date: "2026-05-20", weight: 76.2 },
    { id: uid(), date: "2026-05-26", weight: 75.4 },
    { id: uid(), date: today(), weight: 75 },
  ],
  posts: [
    { id: uid(), date: today(), title: "腿部训练完成", text: "今天深蹲重量还可以，动作更稳了。下次尝试多做一组。", mood: "很满意" },
  ],
  selectedPostDate: today(),
  editingId: null,
};

let state = load();

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "{}");
    const merged = { ...seed, ...saved };
    merged.records = removeInitialDemoTodayRecords(merged.records || []);
    merged.selectedParts = Array.isArray(merged.selectedParts)
      ? merged.selectedParts
      : [merged.selectedPart || seed.selectedPart];
    merged.selectedPart = merged.selectedParts[0] || merged.selectedPart || seed.selectedPart;
    return merged;
  } catch {
    return seed;
  }
}

function removeInitialDemoTodayRecords(records) {
  const demoToday = today();
  return records.filter((r) => {
    const isDemoChest =
      r.date === demoToday &&
      r.part === "胸部" &&
      r.action === "杠铃卧推" &&
      Number(r.weight) === 80 &&
      Number(r.reps) === 8 &&
      Number(r.sets) === 4 &&
      r.note === "状态不错，最后一组有点吃力。";
    const isDemoBack =
      r.date === demoToday &&
      r.part === "背部" &&
      r.action === "高位下拉" &&
      Number(r.weight) === 55 &&
      Number(r.reps) === 10 &&
      Number(r.sets) === 4 &&
      r.note === "注意肩胛收紧。";
    return !isDemoChest && !isDemoBack;
  });
}
function save() {
  localStorage.setItem(KEY, JSON.stringify(state));
}

function getRecordParts(record) {
  if (Array.isArray(record.parts) && record.parts.length) return record.parts;
  return record.part ? [record.part] : [];
}

function partsText(record) {
  return getRecordParts(record).join("、") || "-";
}
function toast(text) {
  const el = document.querySelector(".toast");
  el.textContent = text;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 1800);
}

function icon(name) {
  const map = { home: "⌂", data: "↗", plan: "▣", feed: "✎", me: "☻" };
  return map[name] || "•";
}

function render() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="app">
      <aside class="sidebar">
        <div class="brand"><span class="brand-mark">⌁</span><span>FIT TRACK</span></div>
        <nav class="nav">
          ${navButton("home", "首页打卡")}
          ${navButton("data", "数据")}
          ${navButton("plan", "计划饮食")}
          ${navButton("feed", "动态复盘")}
          ${navButton("me", "我的")}
        </nav>
        <div class="streak-card">
          <div class="muted">连续打卡</div>
          <div><span class="streak-num">${streakDays()}</span> 天</div>
          <div class="week">${["一","二","三","四","五","六","日"].map((d, i) => `<span class="dot">${i < 6 ? "✓" : d}</span>`).join("")}</div>
          <div class="muted">自律给我自由</div>
          <div class="progress-line"><span></span></div>
        </div>
      </aside>
      <main class="main">
        <header class="topbar">
          <div class="goal-switch">
            <span>当前目标</span>
            <span class="seg">
              <button class="${state.goal === "减脂" ? "on" : ""}" data-goal="减脂">减脂</button>
              <button class="${state.goal === "增肌" ? "on" : ""}" data-goal="增肌">增肌</button>
            </span>
          </div>
          <div class="user"><span>🔔</span><span class="avatar">🏋️</span><span>${state.profile.name} · Lv.${state.profile.level}</span></div>
        </header>
        ${homePage()}
        ${dataPage()}
        ${planPage()}
        ${feedPage()}
        ${mePage()}
        <div class="footer-note">数据保存在本机浏览器，后续可封装成安卓 App 并接入账号同步。</div>
      </main>
    </div>
    <div class="toast"></div>
  `;
  bindEvents();
}

function navButton(page, text) {
  return `<button class="${state.activePage === page ? "active" : ""}" data-page="${page}"><span class="icon">${icon(page)}</span><span>${text}</span></button>`;
}

function homePage() {
  const todayRecords = state.records.filter(r => r.date === today());
  return `
    <section class="page ${state.activePage === "home" ? "active" : ""}">
      <div class="grid">
        <div class="panel muscle-card">
          <div class="workout-head">
            <div>
              <h2>今日训练打卡</h2>
              <p class="hint">选择今天要练的部位，保存记录后肌肉图会被点亮。</p>
            </div>
            <div class="energy-badge">燃烧状态 · ${state.goal}</div>
          </div>
          <div class="muscle-layout">
            <div class="muscle-list">${bodyParts.map(muscleButton).join("")}</div>
            ${bodySvg()}
          </div>
          <div class="selected-tip">💡 当前训练部位：<b>${state.selectedParts.join("、") || "未选择"}</b>，保存记录后会计入数据页和复盘页。</div>
        </div>
        <div class="panel">
          <h2>⚡ 快速记录</h2>
          ${recordForm()}
        </div>
        <div class="panel">
          <h2>🔥 今日训练摘要</h2>
          ${summary(todayRecords)}
          <div style="margin-top:16px" class="chips">${[...new Set(todayRecords.flatMap(getRecordParts))].map(p => `<span class="chip">${p}</span>`).join("") || `<span class="muted">今天还没有记录，先完成一次打卡吧。</span>`}</div>
        </div>
        <div class="panel">
          <h2>🧾 最近记录</h2>
          ${recordsTable(state.records.slice(0, 6))}
        </div>
      </div>
    </section>
  `;
}

function muscleButton(part) {
  const trained = state.records.some(r => r.date === today() && getRecordParts(r).includes(part));
  const chosen = state.selectedParts.includes(part);
  return `<button class="muscle-btn ${trained ? "trained" : ""} ${chosen ? "chosen" : ""}" data-muscle="${part}">${partEmoji(part)} ${part}</button>`;
}
function partEmoji(part) {
  return ({ 胸部: "🦺", 背部: "🪽", 腿部: "🦵", 肩部: "💪", 手臂: "💪", 核心: "▦", 有氧: "💙" })[part] || "•";
}

function bodySvg() {
  const hot = p => {
    const trained = state.records.some(r => r.date === today() && getRecordParts(r).includes(p));
    const chosen = state.selectedParts.includes(p);
    return trained || chosen ? "hot" : "";
  };
  const female = state.profile.gender === "女";
  const viewBox = female ? "0 0 260 420" : "0 0 260 420";
  const front = female
    ? {
        head: `<circle cx="130" cy="34" r="19" class="figure-base"/><path d="M111 34 C112 12,148 12,149 34 C145 25,115 25,111 34 Z" class="hair-shape"/>`,
        neck: "M114 57 C122 51,138 51,146 57 L144 80 C138 88,122 88,116 80 Z",
        chestL: "M88 96 C101 74,123 76,128 100 C119 116,96 123,84 111 C79 104,81 99,88 96 Z",
        chestR: "M172 96 C159 74,137 76,132 100 C141 116,164 123,176 111 C181 104,179 99,172 96 Z",
        shoulderL: "M73 93 C56 101,47 116,43 136 C61 139,78 127,91 106 C88 98,82 93,73 93 Z",
        shoulderR: "M187 93 C204 101,213 116,217 136 C199 139,182 127,169 106 C172 98,178 93,187 93 Z",
        core: "M97 124 C111 133,149 133,163 124 L157 203 C147 219,113 219,103 203 Z",
        armL: "M49 136 C38 177,42 219,55 255 L78 250 C70 207,74 169,89 119 C73 135,61 140,49 136 Z",
        armR: "M211 136 C222 177,218 219,205 255 L182 250 C190 207,186 169,171 119 C187 135,199 140,211 136 Z",
        legL: "M98 215 C111 230,124 236,130 236 L121 383 L91 383 C85 314,82 258,98 215 Z",
        legR: "M162 215 C149 230,136 236,130 236 L139 383 L169 383 C175 314,178 258,162 215 Z",
        cuts: `<path d="M130 66 L130 218"/><path d="M91 99 C106 110,119 112,128 100"/><path d="M169 99 C154 110,141 112,132 100"/><path d="M106 146 L154 146"/><path d="M106 169 L154 169"/><path d="M111 132 L106 203"/><path d="M149 132 L154 203"/><path d="M109 238 L101 368"/><path d="M151 238 L159 368"/>`
      }
    : {
        head: `<circle cx="130" cy="34" r="21" class="figure-base"/>`,
        neck: "M112 58 C120 52,140 52,148 58 L145 82 C139 90,121 90,115 82 Z",
        chestL: "M80 94 C96 64,124 67,128 97 C114 119,89 128,75 111 C69 103,72 97,80 94 Z",
        chestR: "M180 94 C164 64,136 67,132 97 C146 119,171 128,185 111 C191 103,188 97,180 94 Z",
        shoulderL: "M64 87 C42 94,31 114,28 140 C52 145,78 131,93 101 C88 92,78 87,64 87 Z",
        shoulderR: "M196 87 C218 94,229 114,232 140 C208 145,182 131,167 101 C172 92,182 87,196 87 Z",
        core: "M88 121 C105 133,155 133,172 121 L164 211 C153 232,107 232,96 211 Z",
        armL: "M34 138 C22 184,28 232,45 270 L76 263 C66 213,72 170,90 117 C70 136,52 144,34 138 Z",
        armR: "M226 138 C238 184,232 232,215 270 L184 263 C194 213,188 170,170 117 C190 136,208 144,226 138 Z",
        legL: "M94 222 C111 240,124 247,130 247 L119 389 L84 389 C78 320,75 264,94 222 Z",
        legR: "M166 222 C149 240,136 247,130 247 L141 389 L176 389 C182 320,185 264,166 222 Z",
        cuts: `<path d="M130 66 L130 230"/><path d="M80 96 C101 111,119 114,128 97"/><path d="M180 96 C159 111,141 114,132 97"/><path d="M97 145 L163 145"/><path d="M96 170 L164 170"/><path d="M100 195 L160 195"/><path d="M110 132 L102 214"/><path d="M150 132 L158 214"/><path d="M106 246 L96 374"/><path d="M154 246 L164 374"/>`
      };
  const back = female
    ? {
        back: "M83 94 C99 71,118 72,130 91 C142 72,161 71,177 94 C172 140,157 171,130 181 C103 171,88 140,83 94 Z",
        shoulderL: "M73 93 C56 101,47 116,43 136 C61 139,78 127,91 106 C88 98,82 93,73 93 Z",
        shoulderR: "M187 93 C204 101,213 116,217 136 C199 139,182 127,169 106 C172 98,178 93,187 93 Z",
        core: "M103 181 C116 190,144 190,157 181 L156 213 C146 224,114 224,104 213 Z",
        cuts: `<path d="M130 66 L130 214"/><path d="M88 98 C105 116,119 125,130 142"/><path d="M172 98 C155 116,141 125,130 142"/><path d="M101 119 C112 137,121 150,130 178"/><path d="M159 119 C148 137,139 150,130 178"/><path d="M109 238 L101 368"/><path d="M151 238 L159 368"/>`
      }
    : {
        back: "M74 92 C94 62,116 63,130 87 C144 63,166 62,186 92 C181 145,164 178,130 190 C96 178,79 145,74 92 Z",
        shoulderL: "M64 87 C42 94,31 114,28 140 C52 145,78 131,93 101 C88 92,78 87,64 87 Z",
        shoulderR: "M196 87 C218 94,229 114,232 140 C208 145,182 131,167 101 C172 92,182 87,196 87 Z",
        core: "M99 184 C113 195,147 195,161 184 L160 218 C149 231,111 231,100 218 Z",
        cuts: `<path d="M130 66 L130 218"/><path d="M80 96 C100 115,118 126,130 145"/><path d="M180 96 C160 115,142 126,130 145"/><path d="M94 118 C107 138,119 154,130 187"/><path d="M166 118 C153 138,141 154,130 187"/><path d="M106 246 L96 374"/><path d="M154 246 L164 374"/>`
      };
  return `
    <div class="body-stage anatomy-board">
      <div class="anatomy-title-row">
        <span>${state.profile.gender}性肌肉剖析图</span>
        <small>高亮 = 当前选择 / 今日已训练</small>
      </div>
      <div class="anatomy-duo">
      <svg class="body-svg anatomy-svg ${female ? "female" : "male"}" viewBox="${viewBox}" aria-label="正面肌肉解剖图">
        <defs>
          <linearGradient id="skinGrey" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#c4ccd8"/><stop offset="100%" stop-color="#566171"/></linearGradient>
          <linearGradient id="aquaHot" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#44f5e3"/><stop offset="100%" stop-color="#0da9a5"/></linearGradient>
        </defs>
        <g class="human-figure">
          ${front.head}
          <path d="${front.neck}" class="figure-base"/>
          <path class="figure-muscle ${hot("胸部")}" d="${front.chestL}"/>
          <path class="figure-muscle ${hot("胸部")}" d="${front.chestR}"/>
          <path class="figure-muscle ${hot("肩部")}" d="${front.shoulderL}"/>
          <path class="figure-muscle ${hot("肩部")}" d="${front.shoulderR}"/>
          <path class="figure-muscle ${hot("核心")}" d="${front.core}"/>
          <path class="figure-muscle ${hot("手臂")}" d="${front.armL}"/>
          <path class="figure-muscle ${hot("手臂")}" d="${front.armR}"/>
          <path class="figure-muscle ${hot("腿部")}" d="${front.legL}"/>
          <path class="figure-muscle ${hot("腿部")}" d="${front.legR}"/>
          <path class="figure-muscle ${hot("有氧")}" d="M117 34 C124 24,136 24,143 34 C138 42,122 42,117 34 Z"/>
          <g class="anatomy-cutlines">
            ${front.cuts}
          </g>
        </g>
        <text x="130" y="414" text-anchor="middle" class="figure-label">正面</text>
      </svg>
      <svg class="body-svg anatomy-svg ${female ? "female" : "male"}" viewBox="${viewBox}" aria-label="背面肌肉解剖图">
        <g class="human-figure">
          ${front.head}
          <path d="${front.neck}" class="figure-base"/>
          <path class="figure-muscle ${hot("背部")}" d="${back.back}"/>
          <path class="figure-muscle ${hot("肩部")}" d="${back.shoulderL}"/>
          <path class="figure-muscle ${hot("肩部")}" d="${back.shoulderR}"/>
          <path class="figure-muscle ${hot("核心")}" d="${back.core}"/>
          <path class="figure-muscle ${hot("手臂")}" d="${front.armL}"/>
          <path class="figure-muscle ${hot("手臂")}" d="${front.armR}"/>
          <path class="figure-muscle ${hot("腿部")}" d="${front.legL}"/>
          <path class="figure-muscle ${hot("腿部")}" d="${front.legR}"/>
          <path class="figure-muscle ${hot("有氧")}" d="M117 34 C124 24,136 24,143 34 C138 42,122 42,117 34 Z"/>
          <g class="anatomy-cutlines">
            ${back.cuts}
          </g>
        </g>
        <text x="130" y="414" text-anchor="middle" class="figure-label">背面</text>
      </svg>
      </div>
      <div class="legend-row"><span class="legend-hot"></span>当前选择 / 今日已训练</div>
    </div>
  `;
}

function recordForm(record = null) {
  const primaryPart = record ? getRecordParts(record)[0] : (state.selectedPart || state.selectedParts[0] || "胸部");
  const r = record || { date: today(), part: primaryPart, parts: state.selectedParts, action: actionsByPart[primaryPart][0], weight: "", reps: "", sets: "", note: "" };
  const actions = actionsByPart[r.part] || [];
  return `
    <form id="recordForm" class="form-grid">
      <input type="hidden" name="id" value="${r.id || ""}">
      <div class="field full"><label>日期</label><input name="date" type="date" value="${r.date}" required></div>
      <div class="field"><label>主要动作部位</label><select name="part">${bodyParts.map(p => `<option ${p === r.part ? "selected" : ""}>${p}</option>`).join("")}</select></div>
      <div class="field"><label>动作</label><select name="action">${actions.map(a => `<option ${a === r.action ? "selected" : ""}>${a}</option>`).join("")}</select></div>
      <div class="field"><label>重量 kg</label><input name="weight" type="number" min="0" step="0.5" placeholder="如：60" value="${r.weight}"></div>
      <div class="field"><label>次数</label><input name="reps" type="number" min="0" placeholder="如：12" value="${r.reps}"></div>
      <div class="field"><label>组数</label><input name="sets" type="number" min="0" placeholder="如：4" value="${r.sets}"></div>
      <div class="field full"><label>备注 / 练后评价</label><textarea name="note" maxlength="200" placeholder="记录你的感受或备注...">${r.note || ""}</textarea></div>
      <div class="actions">
        <button type="button" class="btn ghost" data-reset-form>重置</button>
        <button class="btn primary">${r.id ? "保存修改" : "保存记录"}</button>
      </div>
    </form>
  `;
}

function summary(list) {
  const volume = list.reduce((s, r) => s + Number(r.weight || 0) * Number(r.reps || 0) * Number(r.sets || 0), 0);
  const sets = list.reduce((s, r) => s + Number(r.sets || 0), 0);
  const reps = list.reduce((s, r) => s + Number(r.reps || 0) * Number(r.sets || 0), 0);
  const kcal = Math.round(volume / 15 + list.length * 40);
  return `<div class="summary-grid">
    <div class="stat"><span class="muted">记录数</span><strong>${list.length}</strong></div>
    <div class="stat"><span class="muted">总重量</span><strong>${volume}</strong><small> kg</small></div>
    <div class="stat"><span class="muted">总组数</span><strong>${sets}</strong></div>
    <div class="stat"><span class="muted">总次数</span><strong>${reps}</strong></div>
    <div class="stat"><span class="muted">估算消耗</span><strong>${kcal}</strong><small> kcal</small></div>
  </div>`;
}

function recordsTable(list) {
  if (!list.length) return `<p class="muted">暂无记录。</p>`;
  return `<table class="table">
    <thead><tr><th>日期</th><th>部位</th><th>动作</th><th>重量</th><th>次数/组</th><th>操作</th></tr></thead>
    <tbody>${list.map(r => `<tr>
      <td>${r.date}</td><td>${partsText(r)}</td><td>${r.action}</td><td>${r.weight || "-"}kg</td><td>${r.reps || "-"}×${r.sets || "-"}</td>
      <td><span class="row-actions"><button class="mini" data-edit="${r.id}">改</button><button class="mini" data-copy-post="${r.id}">复盘</button></span></td>
    </tr>`).join("")}</tbody>
  </table>`;
}

function dataPage() {
  const part = state.selectedChartPart;
  const filtered = state.records.filter(r => getRecordParts(r).includes(part));
  return `
    <section class="page ${state.activePage === "data" ? "active" : ""}">
      <div class="two-col">
        <div class="panel">
          <h2>📈 身体与训练数据</h2>
          <div class="cards">
            <div class="data-card"><span class="muted">身高</span><h2>${state.profile.height} cm</h2></div>
            <div class="data-card"><span class="muted">当前体重</span><h2>${state.profile.weight} kg</h2></div>
            <div class="data-card"><span class="muted">目标体重</span><h2>${state.profile.targetWeight} kg</h2></div>
          </div>
          <h3 style="margin-top:18px">按部位查看</h3>
          <div class="chips">${bodyParts.map(p => `<button class="chip" data-chart-part="${p}" style="${p === part ? "border-color:var(--green);color:var(--green)" : ""}">${p}</button>`).join("")}</div>
          <h3 style="margin-top:18px">${part} 力量趋势</h3>
          <div class="chart-wrap">${chart(filtered)}</div>
        </div>
        <div class="panel">
          <h2>📚 ${part} 历史记录</h2>
          ${recordsTable(filtered)}
        </div>
      </div>
    </section>
  `;
}

function chart(list) {
  const points = list.slice().reverse().map(r => Number(r.weight || 0) * Number(r.reps || 0) * Number(r.sets || 0));
  if (!points.length) return `<p class="muted">这个部位还没有数据。新增训练后会自动生成曲线。</p>`;
  const max = Math.max(...points, 1);
  const w = 720, h = 240, pad = 30;
  const xy = points.map((v, i) => {
    const x = pad + (i * (w - pad * 2)) / Math.max(points.length - 1, 1);
    const y = h - pad - (v / max) * (h - pad * 2);
    return [x, y, v];
  });
  const d = xy.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(" ");
  return `<svg class="chart" viewBox="0 0 ${w} ${h}">
    ${[0,1,2,3].map(i => `<line x1="20" x2="${w-20}" y1="${pad+i*55}" y2="${pad+i*55}" stroke="rgba(255,255,255,.08)"/>`).join("")}
    <path d="${d}" fill="none" stroke="var(--green)" stroke-width="4" stroke-linecap="round"/>
    ${xy.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="6" fill="var(--green)"/><text x="${p[0]}" y="${p[1]-12}" fill="#dfffb2" font-size="12" text-anchor="middle">${p[2]}</text>`).join("")}
  </svg>`;
}

function planPage() {
  return `
    <section class="page ${state.activePage === "plan" ? "active" : ""}">
      <div class="two-col">
        <div class="panel">
          <h2>🗓️ 训练计划</h2>
          <form id="planForm" class="form-grid">
            <div class="field"><label>星期</label><select name="day">${["周一","周二","周三","周四","周五","周六","周日"].map(d => `<option>${d}</option>`).join("")}</select></div>
            <div class="field"><label>计划名称</label><input name="title" placeholder="如：胸 + 三头" required></div>
            <div class="field full"><label>动作安排</label><textarea name="detail" placeholder="从动作库选择或自己填写"></textarea></div>
            <button class="btn primary field full">添加计划</button>
          </form>
          <div class="list" style="margin-top:16px">${state.plans.map(p => `<div class="plan-item"><strong>${p.day}</strong><h3>${p.title}</h3><p class="muted">${p.detail}</p></div>`).join("")}</div>
        </div>
        <div class="panel">
          <h2>🍱 饮食与体重</h2>
          <form id="foodForm" class="form-grid">
            <div class="field"><label>食物</label><input name="name" placeholder="如：鸡胸肉饭" required></div>
            <div class="field"><label>热量 kcal</label><input name="kcal" type="number" min="0" placeholder="如：520" required></div>
            <button class="btn primary field full">记录饮食</button>
          </form>
          <form id="weightForm" class="form-grid" style="margin-top:14px">
            <div class="field"><label>今日体重 kg</label><input name="weight" type="number" step="0.1" value="${state.profile.weight}" required></div>
            <button class="btn ghost field">保存体重</button>
          </form>
          <h3 style="margin-top:18px">今日摄入：${state.foods.filter(f => f.date === today()).reduce((s, f) => s + Number(f.kcal), 0)} kcal</h3>
          <div class="list">${state.foods.slice(0, 8).map(f => `<div class="plan-item"><strong>${f.date}</strong> ${f.name}<span style="float:right;color:var(--orange)">${f.kcal} kcal</span></div>`).join("")}</div>
        </div>
      </div>
    </section>
  `;
}

function feedPage() {
  const grouped = groupPostsByDate();
  const selectedDate = state.selectedPostDate || grouped[0]?.date || today();
  const selectedPosts = state.posts.filter(p => p.date === selectedDate);
  const dayRecords = state.records.filter(r => r.date === selectedDate);
  return `
    <section class="page ${state.activePage === "feed" ? "active" : ""}">
      <div class="feed-grid">
        <div class="panel">
          <h2>📝 发布训练复盘</h2>
          <form id="postForm" class="form-grid">
            <div class="field"><label>标题</label><input name="title" placeholder="如：今天练胸完成" required></div>
            <div class="field"><label>感受</label><select name="mood"><option>很满意</option><option>一般</option><option>有点累</option><option>需要调整</option></select></div>
            <div class="field full"><label>练后评价</label><textarea name="text" placeholder="写下今天训练体验、动作感受、下次改进点..." required></textarea></div>
            <button class="btn primary field full">发布复盘</button>
          </form>
        </div>
        <div class="panel">
          <h2>📚 历史复盘</h2>
          <p class="hint">点击某一天，查看当天复盘和具体训练内容。</p>
          <div class="review-list">
            ${grouped.map(day => `
              <button class="review-day ${day.date === selectedDate ? "active" : ""}" data-post-date="${day.date}">
                <span><b>${day.date}</b><small>${day.count} 条复盘 · ${day.recordCount} 条训练</small></span>
                <span>${day.moods.join(" / ")}</span>
              </button>
            `).join("") || `<p class="muted">暂无复盘记录。</p>`}
          </div>
        </div>
        <div class="panel review-detail">
          <h2>🔎 ${selectedDate} 复盘详情</h2>
          <div class="detail-section">
            <h3>当天复盘</h3>
            <div class="list">${selectedPosts.map(p => `<article class="post"><div class="post-head"><span>${p.date}</span><span>${p.mood}</span></div><h3>${p.title}</h3><p>${p.text}</p></article>`).join("") || `<p class="muted">这一天还没有发布复盘。</p>`}</div>
          </div>
          <div class="detail-section">
            <h3>具体训练内容</h3>
            ${recordsTable(dayRecords)}
          </div>
        </div>
      </div>
    </section>
  `;
}

function groupPostsByDate() {
  const dates = [...new Set([...state.posts.map(p => p.date), ...state.records.map(r => r.date)])].sort().reverse();
  return dates.map(date => {
    const posts = state.posts.filter(p => p.date === date);
    const records = state.records.filter(r => r.date === date);
    return {
      date,
      count: posts.length,
      recordCount: records.length,
      moods: [...new Set(posts.map(p => p.mood))].filter(Boolean),
    };
  });
}

function mePage() {
  return `
    <section class="page ${state.activePage === "me" ? "active" : ""}">
      <div class="profile">
        <div class="panel">
          <div class="big-avatar">🏋️</div>
          <h2>${state.profile.name}</h2>
          <p class="muted">模拟登录 · Lv.${state.profile.level} · 当前目标：${state.goal}</p>
          <p class="muted">第一版先本地保存。真正账号、好友、云同步和 AI 助手建议后续再接。</p>
        </div>
        <div class="panel">
          <h2>⚙️ 基本资料</h2>
          <form id="profileForm" class="form-grid">
            <div class="field"><label>昵称</label><input name="name" value="${state.profile.name}" required></div>
            <div class="field"><label>性别</label><select name="gender"><option ${state.profile.gender === "男" ? "selected" : ""}>男</option><option ${state.profile.gender === "女" ? "selected" : ""}>女</option></select></div>
            <div class="field"><label>身高 cm</label><input name="height" type="number" value="${state.profile.height}" required></div>
            <div class="field"><label>体重 kg</label><input name="weight" type="number" step="0.1" value="${state.profile.weight}" required></div>
            <div class="field"><label>目标体重 kg</label><input name="targetWeight" type="number" step="0.1" value="${state.profile.targetWeight}" required></div>
            <div class="field"><label>体脂率 %</label><input name="fat" type="number" step="0.1" value="${state.profile.fat}"></div>
            <button class="btn primary field full">保存资料</button>
          </form>
        </div>
      </div>
    </section>
  `;
}

function streakDays() {
  return new Set(state.records.map(r => r.date)).size + 19;
}

function bindEvents() {
  document.querySelectorAll("[data-page]").forEach(btn => btn.onclick = () => {
    state.activePage = btn.dataset.page;
    save(); render();
  });
  document.querySelectorAll("[data-goal]").forEach(btn => btn.onclick = () => {
    state.goal = btn.dataset.goal;
    save(); render(); toast(`目标已切换为${state.goal}`);
  });
  document.querySelectorAll("[data-muscle]").forEach(btn => btn.onclick = () => {
    const part = btn.dataset.muscle;
    if (state.selectedParts.includes(part)) {
      state.selectedParts = state.selectedParts.filter(p => p !== part);
    } else {
      state.selectedParts = [...state.selectedParts, part];
    }
    if (!state.selectedParts.length) state.selectedParts = [part];
    state.selectedPart = state.selectedParts[0];
    save(); render();
  });
  document.querySelectorAll("[data-chart-part]").forEach(btn => btn.onclick = () => {
    state.selectedChartPart = btn.dataset.chartPart;
    save(); render();
  });
  document.querySelectorAll("[data-post-date]").forEach(btn => btn.onclick = () => {
    state.selectedPostDate = btn.dataset.postDate;
    save(); render();
  });

  const recordFormEl = document.getElementById("recordForm");
  if (recordFormEl) {
    const partSelect = recordFormEl.elements.part;
    partSelect.onchange = () => {
      state.selectedPart = partSelect.value;
      if (!state.selectedParts.includes(partSelect.value)) {
        state.selectedParts = [...state.selectedParts, partSelect.value];
      }
      save(); render();
    };
    recordFormEl.onsubmit = (e) => {
      e.preventDefault();
      const f = new FormData(recordFormEl);
      const item = {
        id: f.get("id") || uid(),
        date: f.get("date"),
        part: f.get("part"),
        parts: [...new Set([f.get("part"), ...state.selectedParts])],
        action: f.get("action"),
        weight: Number(f.get("weight")) || 0,
        reps: Number(f.get("reps")) || 0,
        sets: Number(f.get("sets")) || 0,
        note: f.get("note").trim(),
      };
      const idx = state.records.findIndex(r => r.id === item.id);
      if (idx >= 0) state.records[idx] = item;
      else state.records.unshift(item);
      state.selectedPart = item.part;
      state.selectedParts = item.parts;
      state.editingId = null;
      save(); render(); toast(idx >= 0 ? "记录已修改" : "训练记录已保存");
    };
  }
  document.querySelectorAll("[data-reset-form]").forEach(btn => btn.onclick = () => {
    state.editingId = null; render();
  });
  document.querySelectorAll("[data-edit]").forEach(btn => btn.onclick = () => {
    const r = state.records.find(x => x.id === btn.dataset.edit);
    if (!r) return;
    state.selectedParts = getRecordParts(r);
    state.selectedPart = state.selectedParts[0] || r.part;
    save();
    render();
    document.querySelector(".panel:nth-child(2)").scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      const holder = document.querySelector("#recordForm");
      holder.outerHTML = recordForm(r);
      bindEvents();
    }, 0);
  });
  document.querySelectorAll("[data-copy-post]").forEach(btn => btn.onclick = () => {
    const r = state.records.find(x => x.id === btn.dataset.copyPost);
    state.activePage = "feed";
    state.posts.unshift({ id: uid(), date: r.date, title: `${partsText(r)}训练完成`, text: r.note || `${r.action}：${r.weight}kg × ${r.reps}次 × ${r.sets}组。`, mood: "很满意" });
    state.selectedPostDate = r.date;
    save(); render(); toast("已生成一条复盘");
  });

  const planForm = document.getElementById("planForm");
  if (planForm) planForm.onsubmit = e => {
    e.preventDefault();
    const f = new FormData(planForm);
    state.plans.push({ id: uid(), day: f.get("day"), title: f.get("title"), detail: f.get("detail") });
    save(); render(); toast("训练计划已添加");
  };
  const foodForm = document.getElementById("foodForm");
  if (foodForm) foodForm.onsubmit = e => {
    e.preventDefault();
    const f = new FormData(foodForm);
    state.foods.unshift({ id: uid(), date: today(), name: f.get("name"), kcal: Number(f.get("kcal")) || 0 });
    save(); render(); toast("饮食已记录");
  };
  const weightForm = document.getElementById("weightForm");
  if (weightForm) weightForm.onsubmit = e => {
    e.preventDefault();
    const weight = Number(new FormData(weightForm).get("weight"));
    state.profile.weight = weight;
    state.bodyLogs.unshift({ id: uid(), date: today(), weight });
    save(); render(); toast("体重已保存");
  };
  const postForm = document.getElementById("postForm");
  if (postForm) postForm.onsubmit = e => {
    e.preventDefault();
    const f = new FormData(postForm);
    state.posts.unshift({ id: uid(), date: today(), title: f.get("title"), text: f.get("text"), mood: f.get("mood") });
    state.selectedPostDate = today();
    save(); render(); toast("复盘已发布到时间线");
  };
  const profileForm = document.getElementById("profileForm");
  if (profileForm) profileForm.onsubmit = e => {
    e.preventDefault();
    const f = new FormData(profileForm);
    state.profile = {
      ...state.profile,
      name: f.get("name"),
      gender: f.get("gender"),
      height: Number(f.get("height")),
      weight: Number(f.get("weight")),
      targetWeight: Number(f.get("targetWeight")),
      fat: Number(f.get("fat")),
    };
    save(); render(); toast("资料已保存");
  };
}

render();
