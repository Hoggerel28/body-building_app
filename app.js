import { getSupabaseClient, getSupabaseStatus } from "./src/lib/supabase.js";
import {
  foodCalorieReferenceMeta,
  foodReferenceSources,
  foodReferences,
} from "./src/data/food-calorie-reference.js";
import { actionsByPart, bodyParts, partGuides } from "./src/data/exercise-library.js";

const muscleMapAssets = {
  male: {
    base: new URL("./assets/muscle-maps/male-base.jpg", import.meta.url).href,
    cut: {
      胸部: new URL("./assets/muscle-maps/male-cut-chest.png", import.meta.url).href,
      背部: new URL("./assets/muscle-maps/male-cut-back.png", import.meta.url).href,
      腿部: new URL("./assets/muscle-maps/male-cut-legs.png", import.meta.url).href,
      肩部: new URL("./assets/muscle-maps/male-cut-shoulders.png", import.meta.url).href,
      手臂: new URL("./assets/muscle-maps/male-cut-arms.png", import.meta.url).href,
      核心: new URL("./assets/muscle-maps/male-cut-core.png", import.meta.url).href,
      有氧: new URL("./assets/muscle-maps/male-cut-cardio.png", import.meta.url).href,
    },
    bulk: {
      胸部: new URL("./assets/muscle-maps/male-bulk-chest.png", import.meta.url).href,
      背部: new URL("./assets/muscle-maps/male-bulk-back.png", import.meta.url).href,
      腿部: new URL("./assets/muscle-maps/male-bulk-legs.png", import.meta.url).href,
      肩部: new URL("./assets/muscle-maps/male-bulk-shoulders.png", import.meta.url).href,
      手臂: new URL("./assets/muscle-maps/male-bulk-arms.png", import.meta.url).href,
      核心: new URL("./assets/muscle-maps/male-bulk-core.png", import.meta.url).href,
      有氧: new URL("./assets/muscle-maps/male-bulk-cardio.png", import.meta.url).href,
    },
  },
  female: {
    base: new URL("./assets/muscle-maps/female-base.jpg", import.meta.url).href,
    cut: {
      胸部: new URL("./assets/muscle-maps/female-cut-chest.png", import.meta.url).href,
      背部: new URL("./assets/muscle-maps/female-cut-back.png", import.meta.url).href,
      腿部: new URL("./assets/muscle-maps/female-cut-legs.png", import.meta.url).href,
      肩部: new URL("./assets/muscle-maps/female-cut-shoulders.png", import.meta.url).href,
      手臂: new URL("./assets/muscle-maps/female-cut-arms.png", import.meta.url).href,
      核心: new URL("./assets/muscle-maps/female-cut-core.png", import.meta.url).href,
      有氧: new URL("./assets/muscle-maps/female-cut-cardio.png", import.meta.url).href,
    },
    bulk: {
      胸部: new URL("./assets/muscle-maps/female-bulk-chest.png", import.meta.url).href,
      背部: new URL("./assets/muscle-maps/female-bulk-back.png", import.meta.url).href,
      腿部: new URL("./assets/muscle-maps/female-bulk-legs.png", import.meta.url).href,
      肩部: new URL("./assets/muscle-maps/female-bulk-shoulders.png", import.meta.url).href,
      手臂: new URL("./assets/muscle-maps/female-bulk-arms.png", import.meta.url).href,
      核心: new URL("./assets/muscle-maps/female-bulk-core.png", import.meta.url).href,
      有氧: new URL("./assets/muscle-maps/female-bulk-cardio.png", import.meta.url).href,
    },
  },
};

const KEY = "fittrack.local.v2";
const LEGACY_KEY = "fittrack.local.v1";

const daysOfWeek = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
const visibilityOptions = ["private", "friends", "public"];
const visibilityText = { private: "仅自己", friends: "好友可见", public: "公开" };
const musicPlatforms = ["网易云音乐", "QQ 音乐", "酷我音乐", "酷狗音乐", "汽水音乐", "其他"];
const bodyPartSet = new Set(bodyParts);
const goals = ["减脂", "增肌"];
const pageNames = ["home", "data", "plan", "feed", "friends", "music", "me"];
const APP_VERSION = "0.2.1";
const APP_VERSION_CODE = 2;
const LOCAL_VERSION_MANIFEST_URL = new URL("./version.json", window.location.href).href;
const VERSION_MANIFEST_URLS = buildVersionManifestUrls();
const BUILT_IN_VERSION_MANIFEST = {
  latestVersion: APP_VERSION,
  latestVersionCode: APP_VERSION_CODE,
  title: "练了没 0.2.1 测试版",
  releaseNotes: ["当前安装包已内置本版本信息。"],
  releaseDate: "2026-07-27",
  downloadPageUrl: "",
  apkUrl: "",
  mandatory: false,
};
const sponsorConfig = {
  title: "支持赞助",
  note: "感谢您使用“练了没”\n赞助完全自愿，不影响您使用本项目的任何功能\n您的每一份支持都是对“练了没”最大的鼓励",
  methods: [
    { name: "微信赞助", detail: "打开微信扫一扫", qr: new URL("./assets/sponsor-wechat.jpg", import.meta.url).href, url: "" },
    { name: "支付宝赞助", detail: "打开支付宝扫一扫", qr: new URL("./assets/sponsor-alipay.jpg", import.meta.url).href, url: "" },
  ],
};
const appNotices = [
  {
    id: "notice-0-2-0",
    date: "2026-07-27",
    title: "0.2.1 测试版",
    text: "邮箱账号、好友、训练复盘可见性、头像同步、歌单外部打开和移动端抽屉已进入测试。",
  },
  {
    id: "notice-feedback",
    date: "2026-07-27",
    title: "新增反馈入口",
    text: "现在可以在更多里提交问题反馈和功能建议，登录后会同步到 Supabase。",
  },
];
const goalConfig = {
  减脂: {
    accent: "cut",
    label: "减脂",
    focus: "热量赤字、有氧完成、体重趋势",
    targetHint: "建议把有氧和饮食记录补齐，观察 7 日体重变化。",
    metrics: [
      { key: "cardio", label: "本周有氧", unit: "次" },
      { key: "kcal", label: "今日摄入", unit: "kcal" },
      { key: "weightDelta", label: "7 日体重", unit: "kg" },
    ],
  },
  增肌: {
    accent: "bulk",
    label: "增肌",
    focus: "训练容量、有效组、渐进超负荷",
    targetHint: "建议记录重量、次数和组数，优先追踪总训练量和 PB。",
    metrics: [
      { key: "volume", label: "本周训练量", unit: "kg" },
      { key: "sets", label: "本周有效组", unit: "组" },
      { key: "pb", label: "最高估算 1RM", unit: "kg" },
    ],
  },
};

const fitnessKnowledge = [
  { title: "渐进超负荷", part: "增肌", text: "在动作稳定的前提下，逐步增加重量、次数、组数或动作质量，是力量和肌肉增长的核心。" },
  { title: "减脂热量赤字", part: "减脂", text: "减脂需要长期热量赤字。训练记录能帮助你保持运动消耗，饮食记录帮助你控制摄入。" },
  { title: "卧推肩胛稳定", part: "胸部", text: "卧推时保持肩胛后收下沉，手腕中立，避免肩部前顶。" },
  { title: "深蹲膝盖轨迹", part: "腿部", text: "深蹲时膝盖方向与脚尖大致一致，核心收紧，优先保证动作深度和稳定。" },
  { title: "背部发力感", part: "背部", text: "划船和下拉前先做肩胛下沉/后收，减少手臂代偿。" },
  { title: "有氧安排", part: "有氧", text: "减脂期可安排中低强度有氧或间歇训练；增肌期有氧不宜影响主要力量训练恢复。" },
  { title: "训练复盘", part: "复盘", text: "复盘记录状态、疼痛、动作质量和下次调整点，比只记重量更能长期进步。" },
];

const pad2 = (value) => String(value).padStart(2, "0");
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
const formatDateLocal = (date = new Date()) =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
const today = () => formatDateLocal();
const dayMs = 24 * 60 * 60 * 1000;

const seed = {
  schemaVersion: 2,
  activePage: "home",
  goal: "减脂",
  selectedPart: "胸部",
  selectedParts: ["胸部"],
  selectedChartPart: "胸部",
  selectedActionFilter: "全部",
  selectedPostDate: today(),
  diaryPostFilter: "all",
  diaryFriendId: "all",
  editingPostId: null,
  selectedBodyView: "front",
  searchQuery: "",
  friendSearchQuery: "",
  friendSearchResults: [],
  friendPostFriendId: "all",
  friendPostDate: "",
  friendPostRange: "all",
  foodRefCategory: "全部",
  foodRefQuery: "",
  selectedFoodRefId: "",
  activeUtilityModal: "",
  timerConfirmAction: "",
  playlistDeleteId: "",
  feedbackSubmitting: false,
  versionChecking: false,
  versionStatus: "",
  versionCheckedAt: "",
  versionUpdate: {
    available: false,
    latestVersion: "",
    latestVersionCode: 0,
    releaseDate: "",
    releaseNotes: [],
    downloadUrl: "",
  },
  notificationReadIds: [],
  trainingTimer: { date: today(), elapsedSeconds: 0, startedAt: "", running: false, savedSeconds: 0, savedAt: "" },
  authMode: "login",
  editingId: null,
  profile: { name: "未命名", level: 1, gender: "男", height: 170, weight: 0, targetWeight: 0, fat: 0, searchable: false, avatarUrl: "" },
  auth: { email: "", userId: "", loggedIn: false },
  cloud: { syncing: false, lastSyncAt: "", lastError: "" },
  records: [],
  plans: [],
  foods: [],
  bodyLogs: [],
  posts: [],
  friendPosts: [],
  playlists: [],
  feedbackReports: [],
  friends: [],
  friendRequests: [],
};

function escapeHtml(value = "") {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char]));
}

const escapeAttr = escapeHtml;
const toNumber = (value) => Number(value) || 0;
const isObject = (value) => value && typeof value === "object" && !Array.isArray(value);
const asArray = (value) => Array.isArray(value) ? value : [];

function sanitizeText(value = "", max = 200) {
  return String(value ?? "").trim().slice(0, max);
}

function clampNumber(value, min = 0, max = 100000) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.min(max, Math.max(min, number));
}

function parseDateValue(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ""));
  if (!match) return null;
  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return null;
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return date;
}

function isDateKey(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || "")) && Boolean(parseDateValue(value));
}

function normalizeDate(value, fallback = today()) {
  return isDateKey(value) ? String(value) : fallback;
}

function addDays(date, amount) {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  copy.setDate(copy.getDate() + amount);
  return copy;
}

function dateKey(date) {
  return formatDateLocal(date);
}

function normalizeId(value) {
  const text = sanitizeText(value, 80);
  return /^[a-zA-Z0-9_-]+$/.test(text) ? text : uid();
}

function normalizeParts(parts, fallback = "胸部") {
  const list = asArray(parts).map((part) => sanitizeText(part, 20)).filter((part) => bodyPartSet.has(part));
  if (!list.length && bodyPartSet.has(fallback)) list.push(fallback);
  return [...new Set(list)];
}

function isSafeUrl(url) {
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

function normalizedPlaylistUrl(url) {
  try {
    const parsed = new URL(sanitizeText(url, 500));
    if (!["http:", "https:"].includes(parsed.protocol)) return "";
    const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
    const path = parsed.pathname.replace(/\/+$/, "");
    const hashQuery = parsed.hash.includes("?") ? parsed.hash.slice(parsed.hash.indexOf("?") + 1) : "";
    const allParams = new URLSearchParams(`${parsed.searchParams.toString()}&${hashQuery}`);
    const playlistId = allParams.get("id") || allParams.get("playlistId") || allParams.get("disstid") || allParams.get("pid");
    if (host.includes("music.163.com") && playlistId) return `netease:playlist:${playlistId}`;
    if ((host.includes("qq.com") || host.includes("y.qq.com")) && playlistId) return `qqmusic:playlist:${playlistId}`;
    if (host.includes("kuwo.cn") && playlistId) return `kuwo:playlist:${playlistId}`;
    if (host.includes("kugou.com") && playlistId) return `kugou:playlist:${playlistId}`;
    if (host.includes("music.douyin.com") && playlistId) return `qishui:playlist:${playlistId}`;

    const ignored = new Set(["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "uct2", "share", "userid"]);
    [...parsed.searchParams.keys()].forEach((key) => {
      if (key.startsWith("utm_") || ignored.has(key.toLowerCase())) parsed.searchParams.delete(key);
    });
    parsed.protocol = parsed.protocol.toLowerCase();
    parsed.hostname = host;
    parsed.pathname = path || "/";
    parsed.hash = "";
    parsed.searchParams.sort();
    return parsed.href;
  } catch {
    return "";
  }
}

function dedupePlaylists(playlists) {
  const unique = new Map();
  for (const playlist of playlists) {
    const key = normalizedPlaylistUrl(playlist?.url);
    if (key && !unique.has(key)) unique.set(key, playlist);
  }
  return Array.from(unique.values());
}

function isSafeAvatarUrl(url) {
  const text = String(url || "");
  if (isSafeUrl(text)) return true;
  return /^data:image\/(?:jpeg|jpg|png|webp|gif);base64,[a-z0-9+/=\s]+$/i.test(text) && text.length <= 350000;
}

function normalizeRecord(record) {
  if (!isObject(record)) return null;
  const originalPart = bodyPartSet.has(record.part) ? record.part : normalizeParts(record.parts, seed.selectedPart)[0];
  const partActions = asArray(actionsByPart[originalPart]);
  const requestedAction = sanitizeText(record.action, 50);
  const action = partActions.includes(requestedAction) ? requestedAction : (partActions[0] || "");
  const matchingParts = bodyParts.filter((part) => asArray(actionsByPart[part]).includes(action));
  const part = matchingParts.includes(originalPart) ? originalPart : (matchingParts[0] || originalPart);
  const candidateParts = normalizeParts([part, ...asArray(record.parts)], part);
  const parts = matchingParts.length
    ? candidateParts.filter((item) => matchingParts.includes(item))
    : candidateParts;
  return {
    id: normalizeId(record.id),
    date: normalizeDate(record.date),
    part,
    parts: parts.length ? parts : [part],
    action,
    weight: clampNumber(record.weight, 0, 2000),
    reps: Math.round(clampNumber(record.reps, 0, 10000)),
    sets: Math.round(clampNumber(record.sets, 0, 500)),
    note: sanitizeText(record.note, 240),
  };
}

function normalizeCloud(cloud) {
  const source = isObject(cloud) ? cloud : {};
  return {
    syncing: Boolean(source.syncing),
    lastSyncAt: sanitizeText(source.lastSyncAt, 40),
    lastError: sanitizeText(source.lastError, 160),
  };
}

function normalizeTrainingTimer(timer) {
  const source = isObject(timer) ? timer : {};
  const date = normalizeDate(source.date, today());
  const sameDay = date === today();
  return {
    date: sameDay ? date : today(),
    elapsedSeconds: sameDay ? Math.round(clampNumber(source.elapsedSeconds, 0, 24 * 60 * 60)) : 0,
    startedAt: sameDay ? sanitizeText(source.startedAt, 40) : "",
    running: sameDay && Boolean(source.running && source.startedAt),
    savedSeconds: sameDay ? Math.round(clampNumber(source.savedSeconds, 0, 24 * 60 * 60)) : 0,
    savedAt: sameDay ? sanitizeText(source.savedAt, 40) : "",
  };
}

function normalizePlan(plan) {
  if (!isObject(plan)) return null;
  return {
    id: normalizeId(plan.id),
    day: daysOfWeek.includes(plan.day) ? plan.day : "周一",
    title: sanitizeText(plan.title, 60),
    detail: sanitizeText(plan.detail, 240),
    goal: goals.includes(plan.goal) ? plan.goal : seed.goal,
  };
}

function normalizeFood(food) {
  if (!isObject(food)) return null;
  return {
    id: normalizeId(food.id),
    date: normalizeDate(food.date),
    name: sanitizeText(food.name, 60),
    kcal: Math.round(clampNumber(food.kcal, 0, 20000)),
    protein: Math.round(clampNumber(food.protein, 0, 1000)),
  };
}

function normalizeBodyLog(log) {
  if (!isObject(log)) return null;
  return {
    id: normalizeId(log.id),
    date: normalizeDate(log.date),
    weight: clampNumber(log.weight, 0, 500),
    fat: clampNumber(log.fat, 0, 80),
  };
}

function normalizePost(post) {
  if (!isObject(post)) return null;
  return {
    id: normalizeId(post.id),
    authorId: sanitizeText(post.authorId, 120),
    authorName: sanitizeText(post.authorName, 40),
    date: normalizeDate(post.date),
    title: sanitizeText(post.title, 80),
    text: sanitizeText(post.text, 1200),
    mood: sanitizeText(post.mood || "一般", 20),
    visibility: visibilityOptions.includes(post.visibility) ? post.visibility : "private",
  };
}

function normalizePlaylist(item) {
  if (!isObject(item)) return null;
  const url = sanitizeText(item.url, 500);
  if (!isSafeUrl(url) || !normalizedPlaylistUrl(url)) return null;
  return {
    id: normalizeId(item.id),
    platform: musicPlatforms.includes(item.platform) ? item.platform : "其他",
    name: sanitizeText(item.name || "训练歌单", 80),
    url,
    date: normalizeDate(item.date),
  };
}

function normalizeFeedbackReport(item) {
  if (!isObject(item)) return null;
  const message = sanitizeText(item.message, 1200);
  if (!message) return null;
  return {
    id: normalizeId(item.id),
    category: ["bug", "idea", "content", "other"].includes(item.category) ? item.category : "bug",
    message,
    contact: sanitizeText(item.contact, 120),
    status: ["pending", "synced", "failed"].includes(item.status) ? item.status : "pending",
    error: sanitizeText(item.error, 180),
    includeDiagnostics: Boolean(item.includeDiagnostics || item.include_diagnostics),
    createdAt: sanitizeText(item.createdAt || item.created_at || new Date().toISOString(), 40),
    appVersion: sanitizeText(item.appVersion || item.app_version || APP_VERSION, 40),
    platform: sanitizeText(item.platform || navigator.userAgent, 220),
  };
}

function normalizeFriend(friend) {
  if (!isObject(friend)) return null;
  return {
    id: normalizeId(friend.id),
    userId: sanitizeText(friend.userId, 120),
    name: sanitizeText(friend.name, 40),
    friendCode: normalizeFriendCode(friend.friendCode || friend.friend_code),
    status: sanitizeText(friend.status || "好友", 20),
    direction: sanitizeText(friend.direction, 20),
  };
}

function normalizeFriendCandidate(candidate) {
  if (!isObject(candidate)) return null;
  const id = sanitizeText(candidate.id, 120);
  const name = sanitizeText(candidate.name || candidate.display_name, 40);
  if (!id || !name) return null;
  return {
    id,
    name,
    friendCode: normalizeFriendCode(candidate.friendCode || candidate.friend_code),
    status: sanitizeText(candidate.status || "可添加", 20),
  };
}

function normalizeProfile(profile) {
  const source = isObject(profile) ? profile : {};
  return {
    name: sanitizeText(source.name || seed.profile.name, 32) || seed.profile.name,
    level: Math.round(clampNumber(source.level || 1, 1, 999)),
    gender: source.gender === "女" ? "女" : "男",
    height: clampNumber(source.height || seed.profile.height, 0, 260),
    weight: clampNumber(source.weight || 0, 0, 500),
    targetWeight: clampNumber(source.targetWeight || 0, 0, 500),
    fat: clampNumber(source.fat || 0, 0, 80),
    searchable: Boolean(source.searchable),
    avatarUrl: isSafeAvatarUrl(source.avatarUrl || source.avatar_url) ? sanitizeText(source.avatarUrl || source.avatar_url, 350000) : "",
    friendCode: normalizeFriendCode(source.friendCode || source.friend_code),
  };
}

function normalizeFriendCode(value = "") {
  const cleaned = String(value || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12);
  return cleaned;
}

function friendCodeText(value = "") {
  const code = normalizeFriendCode(value);
  return code || "同步后生成";
}

function friendCodeBadge(value = "") {
  const code = friendCodeText(value);
  return `<small class="friend-code">UID ${escapeHtml(code)}</small>`;
}

const transparentPixel = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";
const avatarBlobUrlCache = new Map();

function avatarContent(size = "small") {
  if (state.auth.loggedIn && state.profile.avatarUrl) {
    return `<img src="${transparentPixel}" alt="${escapeAttr(state.profile.name)}的头像" data-avatar-url="${escapeAttr(state.profile.avatarUrl)}" data-avatar-img>`;
  }
  if (size === "large") return state.auth.loggedIn ? "✓" : "访";
  return state.auth.loggedIn ? "✓" : "访";
}

function avatarFallbackText() {
  return state.auth.loggedIn ? "✓" : "访";
}

function normalizeAuth(auth) {
  const source = isObject(auth) ? auth : {};
  return {
    email: sanitizeText(source.email, 120),
    userId: sanitizeText(source.userId, 120),
    loggedIn: Boolean(source.loggedIn && source.email),
  };
}

function isLegacyDemoRecord(record) {
  const partText = partsText(record);
  return (
    (record.date === "2026-05-28" && partText === "腿部" && record.action === "深蹲" && Number(record.weight) === 95) ||
    (record.date === "2026-05-25" && partText === "胸部" && record.action === "上斜哑铃卧推" && Number(record.weight) === 28) ||
    (record.part === "胸部" && record.action === "杠铃卧推" && Number(record.weight) === 80 && record.note === "状态不错，最后一组有点吃力。") ||
    (record.part === "背部" && record.action === "高位下拉" && Number(record.weight) === 55 && record.note === "注意肩胛收紧。")
  );
}

function removeLegacyDemoData(data) {
  data.records = data.records.filter((record) => !isLegacyDemoRecord(record));
  data.plans = data.plans.filter((plan) => !(
    (plan.day === "周一" && plan.title === "胸 + 三头") ||
    (plan.day === "周三" && plan.title === "背 + 二头") ||
    (plan.day === "周五" && plan.title === "腿 + 核心")
  ));
  data.foods = data.foods.filter((food) => !(["鸡胸肉饭", "蛋白粉"].includes(food.name)));
  data.bodyLogs = data.bodyLogs.filter((log) => !(
    (log.date === "2026-05-20" && Number(log.weight) === 76.2) ||
    (log.date === "2026-05-26" && Number(log.weight) === 75.4) ||
    (Number(log.weight) === 75 && !data.records.length)
  ));
  data.posts = data.posts.filter((post) => !(post.title === "腿部训练完成" && post.text.includes("今天深蹲重量还可以")));
}

function normalizeVersionUpdate(update = {}) {
  const source = isObject(update) ? update : {};
  const latestVersion = sanitizeText(source.latestVersion, 40);
  const latestVersionCode = Math.max(0, Math.trunc(Number(source.latestVersionCode) || 0));
  const releaseNotes = asArray(source.releaseNotes)
    .map((note) => sanitizeText(note, 160))
    .filter(Boolean)
    .slice(0, 8);
  const downloadUrl = isSafeUrl(source.downloadUrl) ? source.downloadUrl : "";
  const available = Boolean(source.available) && (
    latestVersionCode > APP_VERSION_CODE ||
    (!latestVersionCode && compareSemver(latestVersion, APP_VERSION) > 0)
  );
  return {
    available,
    latestVersion,
    latestVersionCode,
    releaseDate: sanitizeText(source.releaseDate, 24),
    releaseNotes,
    downloadUrl,
  };
}

function normalizeState(input = {}) {
  const source = isObject(input) ? input : {};
  const merged = { ...seed, ...source };
  merged.schemaVersion = seed.schemaVersion;
  merged.goal = goals.includes(source.goal) ? source.goal : seed.goal;
  const normalizedActivePage = source.activePage === "search" ? "friends" : source.activePage;
  merged.activePage = pageNames.includes(normalizedActivePage) ? normalizedActivePage : seed.activePage;
  merged.profile = normalizeProfile({ ...seed.profile, ...source.profile });
  merged.auth = normalizeAuth(source.auth);
  merged.cloud = normalizeCloud(source.cloud);
  merged.selectedPart = bodyPartSet.has(source.selectedPart) ? source.selectedPart : seed.selectedPart;
  merged.selectedParts = normalizeParts(source.selectedParts, merged.selectedPart);
  merged.selectedPart = merged.selectedParts[0] || seed.selectedPart;
  merged.selectedChartPart = bodyPartSet.has(source.selectedChartPart) ? source.selectedChartPart : seed.selectedChartPart;
  merged.selectedActionFilter = sanitizeText(source.selectedActionFilter || "全部", 50);
  merged.diaryPostFilter = ["all", "mine", "friends"].includes(source.diaryPostFilter) ? source.diaryPostFilter : "all";
  merged.diaryFriendId = sanitizeText(source.diaryFriendId || "all", 120) || "all";
  merged.editingPostId = sanitizeText(source.editingPostId, 120);
  merged.selectedBodyView = source.selectedBodyView === "back" ? "back" : "front";
  merged.searchQuery = sanitizeText(source.searchQuery, 80);
  merged.friendSearchQuery = sanitizeText(source.friendSearchQuery, 40);
  merged.friendSearchResults = asArray(source.friendSearchResults).map(normalizeFriendCandidate).filter(Boolean);
  merged.friendPostFriendId = sanitizeText(source.friendPostFriendId || "all", 120) || "all";
  merged.friendPostDate = source.friendPostDate && isDateKey(source.friendPostDate) ? source.friendPostDate : "";
  merged.friendPostRange = ["all", "today", "7", "30"].includes(source.friendPostRange) ? source.friendPostRange : "all";
  merged.foodRefCategory = ["全部", ...foodReferenceCategories()].includes(source.foodRefCategory) ? source.foodRefCategory : "全部";
  merged.foodRefQuery = sanitizeText(source.foodRefQuery, 40);
  merged.selectedFoodRefId = sanitizeText(source.selectedFoodRefId, 120);
  merged.activeUtilityModal = ["feedback", "notices", "sponsor", "version", "calories"].includes(source.activeUtilityModal) ? source.activeUtilityModal : "";
  merged.timerConfirmAction = ["finish", "reset"].includes(source.timerConfirmAction) ? source.timerConfirmAction : "";
  merged.playlistDeleteId = sanitizeText(source.playlistDeleteId, 120);
  merged.feedbackSubmitting = false;
  merged.versionChecking = false;
  merged.versionStatus = sanitizeText(source.versionStatus, 240);
  merged.versionCheckedAt = sanitizeText(source.versionCheckedAt, 40);
  merged.versionUpdate = normalizeVersionUpdate(source.versionUpdate);
  merged.notificationReadIds = asArray(source.notificationReadIds).map((id) => sanitizeText(id, 80)).filter(Boolean);
  merged.trainingTimer = normalizeTrainingTimer(source.trainingTimer);
  merged.authMode = source.authMode === "signup" ? "signup" : "login";
  merged.records = asArray(source.records).map(normalizeRecord).filter(Boolean).sort(sortByDateDesc);
  merged.plans = asArray(source.plans).map(normalizePlan).filter((item) => item && (item.title || item.detail));
  merged.foods = asArray(source.foods).map(normalizeFood).filter((item) => item && item.name).sort(sortByDateDesc);
  merged.bodyLogs = asArray(source.bodyLogs).map(normalizeBodyLog).filter(Boolean).sort(sortByDateDesc);
  merged.posts = asArray(source.posts).map(normalizePost).filter((item) => item && (item.title || item.text)).sort(sortByDateDesc);
  merged.friendPosts = asArray(source.friendPosts).map(normalizePost).filter((item) => item && (item.title || item.text)).sort(sortByDateDesc);
  merged.playlists = dedupePlaylists(asArray(source.playlists).map(normalizePlaylist).filter(Boolean).sort(sortByDateDesc));
  if (!foodReferenceGroups().some((item) => item.id === merged.selectedFoodRefId)) merged.selectedFoodRefId = "";
  if (!merged.playlists.some((item) => item.id === merged.playlistDeleteId)) merged.playlistDeleteId = "";
  merged.feedbackReports = asArray(source.feedbackReports).map(normalizeFeedbackReport).filter(Boolean).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  merged.friends = asArray(source.friends).map(normalizeFriend).filter((item) => item && item.name);
  merged.friendRequests = asArray(source.friendRequests).map(normalizeFriend).filter((item) => item && item.name);
  merged.selectedPostDate = normalizeDate(source.selectedPostDate, merged.posts[0]?.date || merged.records[0]?.date || today());
  if (!merged.posts.some((post) => post.id === merged.editingPostId)) merged.editingPostId = null;
  merged.editingId = merged.records.some((record) => record.id === source.editingId) ? source.editingId : null;
  return merged;
}

function normalizeLegacyState(input = {}) {
  const migrated = normalizeState(input);
  removeLegacyDemoData(migrated);
  return migrated;
}

function sortByDateDesc(a, b) {
  return String(b.date || "").localeCompare(String(a.date || ""));
}

function load() {
  try {
    const current = localStorage.getItem(KEY);
    if (current) return normalizeState(JSON.parse(current));
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const migrated = normalizeLegacyState(JSON.parse(legacy));
      localStorage.setItem(KEY, JSON.stringify(migrated));
      return migrated;
    }
  } catch {
    return normalizeState();
  }
  return normalizeState();
}

function save() {
  try {
    state = normalizeState(state);
    localStorage.setItem(KEY, JSON.stringify(state));
    return true;
  } catch {
    toast("保存失败，请先导出备份或清理浏览器存储空间");
    return false;
  }
}

function clearAccountScopedData() {
  state.profile = normalizeProfile(seed.profile);
  state.goal = seed.goal;
  state.cloud = normalizeCloud();
  state.records = [];
  state.plans = [];
  state.foods = [];
  state.bodyLogs = [];
  state.posts = [];
  state.friendPosts = [];
  state.friends = [];
  state.friendRequests = [];
  state.friendSearchResults = [];
  state.friendSearchQuery = "";
  state.friendPostFriendId = "all";
  state.friendPostDate = "";
  state.friendPostRange = "all";
  state.activeUtilityModal = "";
  state.feedbackSubmitting = false;
  state.versionChecking = false;
  state.versionCheckedAt = "";
  state.editingId = null;
  state.editingPostId = null;
}

function getRecordParts(record) {
  if (Array.isArray(record.parts) && record.parts.length) return record.parts;
  return record.part ? [record.part] : [];
}

function partsText(record) {
  return getRecordParts(record).join("、") || "-";
}

function recordVolume(record) {
  return toNumber(record.weight) * toNumber(record.reps) * toNumber(record.sets);
}

function estimateOneRepMax(record) {
  const weight = toNumber(record.weight);
  const reps = toNumber(record.reps);
  if (!weight || !reps) return 0;
  return Math.round(weight * (1 + reps / 30));
}

function todayCheckedIn() {
  return state.records.some((record) => record.date === today());
}

function uniqueRecordDates() {
  return new Set(state.records.map((record) => record.date).filter(Boolean));
}

function streakDays() {
  const dates = uniqueRecordDates();
  if (!dates.size) return 0;
  const now = parseDateValue(today());
  const start = dates.has(today()) ? now : addDays(now, -1);
  if (!dates.has(dateKey(start))) return 0;
  let count = 0;
  for (let cursor = start; dates.has(dateKey(cursor)); cursor = addDays(cursor, -1)) count += 1;
  return count;
}

function weekDots() {
  const dates = uniqueRecordDates();
  const start = addDays(parseDateValue(today()), -6);
  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(start, index);
    const key = dateKey(date);
    const checked = dates.has(key);
    const label = ["日", "一", "二", "三", "四", "五", "六"][date.getDay()];
    return `<span class="dot ${checked ? "done" : ""}" title="${key}">${checked ? "✓" : label}</span>`;
  }).join("");
}

function thisWeekRecords() {
  const now = parseDateValue(today());
  const day = now.getDay() || 7;
  const start = addDays(now, 1 - day);
  const startKey = dateKey(start);
  return state.records.filter((record) => record.date >= startKey && record.date <= today());
}

function weightDelta(days = 7) {
  const logs = state.bodyLogs.slice().sort((a, b) => a.date.localeCompare(b.date));
  if (logs.length < 2) return 0;
  const latest = logs.at(-1);
  const fromKey = dateKey(addDays(parseDateValue(latest.date), -(days - 1)));
  const base = logs.find((log) => log.date >= fromKey) || logs[0];
  return Math.round((toNumber(latest.weight) - toNumber(base.weight)) * 10) / 10;
}

function goalStats() {
  const weekRecords = thisWeekRecords();
  const todayFoods = state.foods.filter((food) => food.date === today());
  const volume = weekRecords.reduce((sum, record) => sum + recordVolume(record), 0);
  const strengthRecords = weekRecords.filter((record) =>
    !getRecordParts(record).includes("有氧") &&
    toNumber(record.weight) > 0 &&
    toNumber(record.reps) > 0 &&
    toNumber(record.sets) > 0
  );
  const sets = strengthRecords.reduce((sum, record) => sum + toNumber(record.sets), 0);
  const cardio = new Set(weekRecords.filter((record) => getRecordParts(record).includes("有氧")).map((record) => record.date)).size;
  const kcal = todayFoods.reduce((sum, food) => sum + toNumber(food.kcal), 0);
  const pb = Math.max(0, ...state.records.map(estimateOneRepMax));
  return { volume, sets, cardio, kcal, weightDelta: weightDelta(), pb };
}

function summaryStats(list) {
  return {
    count: list.length,
    volume: list.reduce((sum, record) => sum + recordVolume(record), 0),
    sets: list.reduce((sum, record) => sum + toNumber(record.sets), 0),
    reps: list.reduce((sum, record) => sum + toNumber(record.reps) * toNumber(record.sets), 0),
    kcal: Math.round(list.reduce((sum, record) => sum + recordVolume(record), 0) / 15 + list.length * 35),
  };
}

function currentTrainingSeconds() {
  const timer = normalizeTrainingTimer(state.trainingTimer);
  let seconds = timer.elapsedSeconds;
  if (timer.running && timer.startedAt) {
    const started = new Date(timer.startedAt).getTime();
    if (Number.isFinite(started)) seconds += Math.max(0, Math.floor((Date.now() - started) / 1000));
  }
  return Math.min(24 * 60 * 60, Math.max(0, seconds));
}

function formatDuration(seconds) {
  const totalSeconds = Math.max(0, Math.round(Number(seconds) || 0));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remain = totalSeconds % 60;
  if (hours) return `${pad2(hours)}:${pad2(minutes)}:${pad2(remain)}`;
  return `${pad2(minutes)}:${pad2(remain)}`;
}

function trainingDurationReviewLine() {
  const seconds = normalizeTrainingTimer(state.trainingTimer).savedSeconds;
  if (!seconds) return "";
  const minutes = Math.max(1, Math.round(seconds / 60));
  return `本次训练时长：约 ${minutes} 分钟`;
}

function withTrainingDuration(text) {
  const cleaned = sanitizeText(text, 1200);
  const line = trainingDurationReviewLine();
  if (!line || cleaned.includes("本次训练时长")) return cleaned;
  return sanitizeText(`${line}\n${cleaned}`, 1200);
}

function toast(text) {
  const el = document.querySelector(".toast");
  if (!el) return;
  el.textContent = text;
  el.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove("show"), 1800);
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ""));
}

function cloudId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  const bytes = globalThis.crypto?.getRandomValues
    ? globalThis.crypto.getRandomValues(new Uint8Array(16))
    : Array.from({ length: 16 }, () => Math.floor(Math.random() * 256));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function ensureCloudRecordIds() {
  let changed = false;
  state.records = state.records.map((record) => {
    if (isUuid(record.id)) return record;
    changed = true;
    return { ...record, id: cloudId() };
  });
  return changed;
}

function ensureCloudDataIds() {
  let changed = ensureCloudRecordIds();
  const ensureListIds = (list) => list.map((item) => {
    if (isUuid(item.id)) return item;
    changed = true;
    return { ...item, id: cloudId() };
  });
  state.plans = ensureListIds(state.plans);
  state.foods = ensureListIds(state.foods);
  state.bodyLogs = ensureListIds(state.bodyLogs);
  state.posts = ensureListIds(state.posts);
  state.playlists = ensureListIds(state.playlists);
  return changed;
}

function recordSignature(record) {
  return [
    record.date,
    record.part,
    getRecordParts(record).join("|"),
    record.action,
    toNumber(record.weight),
    toNumber(record.reps),
    toNumber(record.sets),
    record.note || "",
  ].join("::");
}

function planSignature(plan) {
  return [plan.day, plan.title, plan.detail || "", plan.goal || state.goal].join("::");
}

function foodSignature(food) {
  return [food.date, food.name, toNumber(food.kcal), toNumber(food.protein)].join("::");
}

function postSignature(post) {
  return [post.date, post.title, post.text || "", post.mood || "", post.visibility || "private"].join("::");
}

function playlistSignature(playlist) {
  return normalizedPlaylistUrl(playlist.url);
}

function workoutRowToRecord(row) {
  return normalizeRecord({
    id: row.id,
    date: row.trained_on,
    part: row.part,
    parts: row.parts,
    action: row.action,
    weight: row.weight,
    reps: row.reps,
    sets: row.sets,
    note: row.note,
  });
}

function recordToWorkoutRow(record, userId) {
  return {
    id: record.id,
    user_id: userId,
    trained_on: record.date,
    part: record.part,
    parts: getRecordParts(record),
    action: record.action,
    weight: toNumber(record.weight),
    reps: Math.round(toNumber(record.reps)),
    sets: Math.round(toNumber(record.sets)),
    note: record.note || "",
    updated_at: new Date().toISOString(),
  };
}

function bodyLogRowToLog(row) {
  return normalizeBodyLog({
    id: row.id,
    date: row.logged_on,
    weight: row.weight,
    fat: row.body_fat,
  });
}

function bodyLogToRow(log, userId) {
  return {
    id: log.id,
    user_id: userId,
    logged_on: log.date,
    weight: toNumber(log.weight),
    body_fat: toNumber(log.fat),
  };
}

function planRowToPlan(row) {
  return normalizePlan({
    id: row.id,
    day: row.weekday,
    title: row.title,
    detail: row.detail,
    goal: row.goal,
  });
}

function planToRow(plan, userId) {
  return {
    id: plan.id,
    user_id: userId,
    weekday: plan.day,
    title: plan.title,
    detail: plan.detail || "",
    goal: goals.includes(plan.goal) ? plan.goal : state.goal,
  };
}

function foodRowToFood(row) {
  return normalizeFood({
    id: row.id,
    date: row.eaten_on,
    name: row.name,
    kcal: row.kcal,
    protein: row.protein,
  });
}

function foodToRow(food, userId) {
  return {
    id: food.id,
    user_id: userId,
    eaten_on: food.date,
    name: food.name,
    kcal: Math.round(toNumber(food.kcal)),
    protein: Math.round(toNumber(food.protein)),
  };
}

function postRowToPost(row) {
  return normalizePost({
    id: row.id,
    authorId: row.author_id,
    authorName: row.authorName,
    date: row.trained_on,
    title: row.title,
    text: row.body,
    mood: row.mood,
    visibility: row.visibility,
  });
}

function isOwnPost(post, userId) {
  return !post.authorId || post.authorId === userId;
}

function postToRow(post, userId) {
  return {
    id: post.id,
    author_id: userId,
    trained_on: post.date,
    title: post.title,
    body: post.text,
    mood: post.mood || "一般",
    visibility: visibilityOptions.includes(post.visibility) ? post.visibility : "private",
    updated_at: new Date().toISOString(),
  };
}

function playlistRowToPlaylist(row) {
  return normalizePlaylist({
    id: row.id,
    platform: row.platform,
    name: row.name,
    url: row.url,
    date: String(row.created_at || "").slice(0, 10) || today(),
  });
}

function playlistToRow(playlist, userId) {
  return {
    id: playlist.id,
    user_id: userId,
    platform: playlist.platform,
    name: playlist.name,
    url: playlist.url,
  };
}

function trainingRecordLine(record) {
  const weight = record.weight ? `${record.weight}kg` : "自重/未填重量";
  const reps = record.reps ? `${record.reps}次` : "未填次数";
  const sets = record.sets ? `${record.sets}组` : "未填组数";
  const note = record.note ? `；备注：${record.note}` : "";
  return `${partsText(record)} · ${record.action}：${weight} x ${reps} x ${sets}${note}`;
}

function trainingSummaryText(records) {
  const list = asArray(records).filter(Boolean);
  if (!list.length) return "";
  const parts = [...new Set(list.flatMap(getRecordParts).filter(Boolean))].join("、") || "训练";
  const totalSets = list.reduce((sum, record) => sum + toNumber(record.sets), 0);
  const totalVolume = list.reduce((sum, record) => sum + recordVolume(record), 0);
  const lines = list.map((record, index) => `${index + 1}. ${trainingRecordLine(record)}`).join("\n");
  const durationLine = trainingDurationReviewLine();
  return `今日训练部位：${parts}\n${durationLine ? `${durationLine}\n` : ""}训练条目：${list.length} 条，有效组约 ${totalSets} 组，总训练量约 ${Math.round(totalVolume)}kg。\n\n${lines}\n\n复盘：`;
}

function buildPostFromRecords(date, records, visibility = "private") {
  const list = asArray(records).filter(Boolean);
  const parts = [...new Set(list.flatMap(getRecordParts).filter(Boolean))].join("、") || "训练";
  return normalizePost({
    id: cloudId(),
    authorId: state.auth.userId,
    date,
    title: `${parts}训练复盘`,
    text: trainingSummaryText(list),
    mood: "很满意",
    visibility,
  });
}

function hasDuplicateGeneratedPost(item) {
  return state.posts.some((post) => post.date === item.date && post.title === item.title && post.text === item.text);
}

async function createReviewFromRecords(date, records, visibility = "private") {
  const item = buildPostFromRecords(date, records, visibility);
  if (!item) return { ok: false, duplicate: false };
  const duplicate = state.posts.find((post) => post.date === item.date && post.title === item.title && post.text === item.text);
  if (duplicate) {
    state.activePage = "feed";
    state.selectedPostDate = duplicate.date;
    state.editingPostId = duplicate.id;
    state.diaryPostFilter = "all";
    save();
    render();
    document.getElementById("postEditForm")?.scrollIntoView({ behavior: "smooth", block: "center" });
    return { ok: true, duplicate: true, item: duplicate };
  }
  state.posts.unshift(item);
  state.activePage = "feed";
  state.selectedPostDate = item.date;
  state.editingPostId = item.id;
  state.diaryPostFilter = "all";
  save();
  render();
  try {
    const synced = await syncPostToCloud(item);
    toast(synced ? "已生成复盘草稿并同步，可继续编辑" : "已生成复盘草稿，可继续编辑");
  } catch (error) {
    markCloudSync({ error: error?.message || "复盘同步失败" });
    toast("复盘草稿已本地生成，云同步失败");
  }
  document.getElementById("postEditForm")?.scrollIntoView({ behavior: "smooth", block: "center" });
  return { ok: true, duplicate: false, item };
}

function markCloudSync({ syncing = false, error = "" } = {}) {
  state.cloud = normalizeCloud({
    syncing,
    lastSyncAt: error ? state.cloud.lastSyncAt : new Date().toISOString(),
    lastError: error,
  });
  save();
}

async function getCloudUser(client) {
  const { data, error } = await client.auth.getUser();
  if (error || !data?.user) return null;
  if (state.auth.userId && state.auth.userId !== data.user.id) {
    clearAccountScopedData();
  }
  state.auth = { email: data.user.email || state.auth.email, userId: data.user.id, loggedIn: true };
  return data.user;
}

async function syncProfileToCloud(client, user) {
  const currentUser = user || await getCloudUser(client);
  if (!currentUser) return false;
  const profilePayload = {
    id: currentUser.id,
    display_name: state.profile.name,
    avatar_url: state.profile.avatarUrl || null,
    searchable: Boolean(state.profile.searchable),
  };
  const metricsPayload = {
    user_id: currentUser.id,
    goal: state.goal,
    gender: state.profile.gender,
    height: state.profile.height || null,
    weight: state.profile.weight || null,
    target_weight: state.profile.targetWeight || null,
    body_fat: state.profile.fat || null,
    updated_at: new Date().toISOString(),
  };
  const profileResult = await client.from("profiles").upsert(profilePayload, { onConflict: "id" });
  if (profileResult.error) throw profileResult.error;
  await loadOwnFriendCode(client, currentUser);
  const metricsResult = await client.from("profile_private_metrics").upsert(metricsPayload, { onConflict: "user_id" });
  if (metricsResult.error) throw metricsResult.error;
  return true;
}

async function loadOwnFriendCode(client, user) {
  if (!client || !user) return "";
  const result = await client
    .from("profiles")
    .select("friend_code")
    .eq("id", user.id)
    .maybeSingle();
  if (!result.error) {
    state.profile.friendCode = normalizeFriendCode(result.data?.friend_code);
    return state.profile.friendCode;
  }
  return "";
}

async function loadCloudProfile(client, user) {
  let profileResult = await client
    .from("profiles")
    .select("display_name, avatar_url, searchable, friend_code")
    .eq("id", user.id)
    .maybeSingle();
  if (profileResult.error) {
    profileResult = await client
      .from("profiles")
      .select("display_name, avatar_url, searchable")
      .eq("id", user.id)
      .maybeSingle();
  }
  if (profileResult.error) throw profileResult.error;

  const metricsResult = await client
    .from("profile_private_metrics")
    .select("goal, gender, height, weight, target_weight, body_fat")
    .eq("user_id", user.id)
    .maybeSingle();
  if (metricsResult.error) throw metricsResult.error;

  const profileRow = profileResult.data;
  const metricsRow = metricsResult.data;
  const hasRemoteProfile = Boolean(profileRow || metricsRow);
  if (hasRemoteProfile) {
    state.profile = normalizeProfile({
      ...state.profile,
      name: profileRow?.display_name || state.profile.name,
      searchable: profileRow?.searchable ?? state.profile.searchable,
      avatarUrl: profileRow?.avatar_url || state.profile.avatarUrl,
      friendCode: profileRow?.friend_code || state.profile.friendCode,
      gender: metricsRow?.gender || state.profile.gender,
      height: metricsRow?.height ?? state.profile.height,
      weight: metricsRow?.weight ?? state.profile.weight,
      targetWeight: metricsRow?.target_weight ?? state.profile.targetWeight,
      fat: metricsRow?.body_fat ?? state.profile.fat,
    });
    if (goals.includes(metricsRow?.goal)) state.goal = metricsRow.goal;
  }
  await syncProfileToCloud(client, user);
}

function avatarFileExtension(file) {
  const map = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };
  return map[file?.type] || "";
}

let avatarRecoveryInFlight = false;

function storageAvatarPublicUrl(client, path) {
  return client.storage.from("avatars").getPublicUrl(path).data?.publicUrl || "";
}

function parseAvatarStoragePath(publicUrl) {
  if (!isSafeUrl(publicUrl)) return "";
  try {
    const parsed = new URL(publicUrl);
    const marker = "/storage/v1/object/public/avatars/";
    const markerIndex = parsed.pathname.indexOf(marker);
    if (markerIndex === -1) return "";
    return decodeURIComponent(parsed.pathname.slice(markerIndex + marker.length));
  } catch {
    return "";
  }
}

function loadImageElement(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("avatar image decode failed"));
    image.src = src;
  });
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("avatar file read failed"));
    reader.readAsDataURL(file);
  });
}

async function createLocalAvatarDataUrl(file) {
  const originalDataUrl = await readFileAsDataUrl(file);
  if (isSafeAvatarUrl(originalDataUrl)) return originalDataUrl;
  const image = await loadImageElement(originalDataUrl);
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas unavailable");
  const side = Math.min(image.naturalWidth || image.width, image.naturalHeight || image.height);
  const sx = ((image.naturalWidth || image.width) - side) / 2;
  const sy = ((image.naturalHeight || image.height) - side) / 2;
  ctx.drawImage(image, sx, sy, side, side, 0, 0, size, size);
  const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.86);
  if (!isSafeAvatarUrl(compressedDataUrl)) throw new Error("avatar image is too large");
  return compressedDataUrl;
}

async function avatarDisplayUrl(publicUrl) {
  if (String(publicUrl || "").startsWith("data:image/")) return publicUrl;
  if (!isSafeUrl(publicUrl)) return "";
  if (avatarBlobUrlCache.has(publicUrl)) return avatarBlobUrlCache.get(publicUrl);
  let blob = null;
  const storagePath = parseAvatarStoragePath(publicUrl);
  const client = storagePath ? await getSupabaseClient() : null;
  if (client && storagePath) {
    const downloadResult = await client.storage.from("avatars").download(storagePath);
    if (downloadResult.error) throw downloadResult.error;
    blob = downloadResult.data;
  } else {
    const response = await fetch(publicUrl, { cache: "no-store" });
    if (!response.ok) throw new Error(`avatar http ${response.status}`);
    blob = await response.blob();
  }
  if (!blob.type.startsWith("image/")) throw new Error("avatar is not an image");
  const objectUrl = URL.createObjectURL(blob);
  avatarBlobUrlCache.set(publicUrl, objectUrl);
  return objectUrl;
}

async function hydrateAvatarImage(img) {
  const publicUrl = img.dataset.avatarUrl || "";
  if (!publicUrl) return false;
  try {
    img.src = await avatarDisplayUrl(publicUrl);
    return true;
  } catch {
    return false;
  }
}

async function recoverLatestAvatarFromStorage() {
  if (avatarRecoveryInFlight || !state.auth.loggedIn) return false;
  avatarRecoveryInFlight = true;
  try {
    const client = await getSupabaseClient();
    if (!client) return false;
    const user = await getCloudUser(client);
    if (!user) return false;
    const result = await client.storage.from("avatars").list(user.id, {
      limit: 20,
      sortBy: { column: "created_at", order: "desc" },
    });
    if (result.error) throw result.error;
    const latest = asArray(result.data)
      .filter((item) => /^avatar-\d+\.(jpg|jpeg|png|webp|gif)$/i.test(item.name))
      .sort((a, b) => String(b.created_at || b.updated_at || b.name).localeCompare(String(a.created_at || a.updated_at || a.name)))[0];
    if (!latest) return false;
    const recoveredUrl = storageAvatarPublicUrl(client, `${user.id}/${latest.name}`);
    if (!recoveredUrl || recoveredUrl === state.profile.avatarUrl) return false;
    state.profile.avatarUrl = recoveredUrl;
    save();
    await syncProfileToCloud(client, user);
    markCloudSync();
    render();
    toast("已重新读取最新头像");
    return true;
  } catch (error) {
    markCloudSync({ error: error?.message || "头像读取失败" });
    return false;
  } finally {
    avatarRecoveryInFlight = false;
  }
}

async function uploadAvatarFile(file) {
  if (!file) return false;
  if (!state.auth.loggedIn) {
    toast("请先登录后再上传头像");
    return false;
  }
  const ext = avatarFileExtension(file);
  if (!ext) {
    toast("请选择 jpg、png、webp 或 gif 图片");
    return false;
  }
  if (file.size > 8 * 1024 * 1024) {
    toast("头像不能超过 8MB");
    return false;
  }
  const client = await getSupabaseClient();
  if (!client) {
    toast("请先配置 Supabase");
    return false;
  }
  const user = await getCloudUser(client);
  if (!user) {
    toast("请先登录后再上传头像");
    return false;
  }
  const localAvatarUrl = await createLocalAvatarDataUrl(file);
  if (!isSafeAvatarUrl(localAvatarUrl)) throw new Error("头像本地处理失败");
  state.profile.avatarUrl = localAvatarUrl;
  save();
  render();
  await syncProfileToCloud(client, user);
  const path = `${user.id}/avatar-${Date.now()}.${ext}`;
  try {
    await client.storage.from("avatars").upload(path, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    });
  } catch (error) {
    console.warn("Avatar backup upload failed.", error);
  }
  markCloudSync();
  render();
  toast("头像已上传并同步");
  return true;
}

async function loadAndMergeCloudRecords(client, user) {
  if (ensureCloudDataIds()) save();
  const result = await client
    .from("workout_records")
    .select("id, trained_on, part, parts, action, weight, reps, sets, note")
    .eq("user_id", user.id)
    .order("trained_on", { ascending: false })
    .order("created_at", { ascending: false });
  if (result.error) throw result.error;

  const remoteRecords = asArray(result.data).map(workoutRowToRecord).filter(Boolean);
  const mergedById = new Map(remoteRecords.map((record) => [record.id, record]));
  const remoteBySignature = new Map(remoteRecords.map((record) => [recordSignature(record), record]));

  for (const localRecord of state.records) {
    const remoteMatch = mergedById.get(localRecord.id) || remoteBySignature.get(recordSignature(localRecord));
    if (remoteMatch) mergedById.set(remoteMatch.id, { ...localRecord, id: remoteMatch.id });
    else mergedById.set(localRecord.id, localRecord);
  }

  state.records = Array.from(mergedById.values()).map(normalizeRecord).filter(Boolean).sort(sortByDateDesc);
  save();
  if (!state.records.length) return;

  const payload = state.records.map((record) => recordToWorkoutRow(record, user.id));
  const upsertResult = await client.from("workout_records").upsert(payload, { onConflict: "id" });
  if (upsertResult.error) throw upsertResult.error;
}

async function loadAndMergeCloudBodyLogs(client, user) {
  const result = await client
    .from("body_logs")
    .select("id, logged_on, weight, body_fat")
    .eq("user_id", user.id)
    .order("logged_on", { ascending: false });
  if (result.error) throw result.error;

  const remoteLogs = asArray(result.data).map(bodyLogRowToLog).filter(Boolean);
  const mergedByDate = new Map(remoteLogs.map((log) => [log.date, log]));
  for (const localLog of state.bodyLogs) {
    const existing = mergedByDate.get(localLog.date);
    mergedByDate.set(localLog.date, existing ? { ...localLog, id: existing.id } : localLog);
  }
  state.bodyLogs = Array.from(mergedByDate.values()).map(normalizeBodyLog).filter(Boolean).sort(sortByDateDesc);
  save();
  if (!state.bodyLogs.length) return;

  const payload = state.bodyLogs.map((log) => bodyLogToRow(log, user.id));
  const upsertResult = await client.from("body_logs").upsert(payload, { onConflict: "user_id,logged_on" });
  if (upsertResult.error) throw upsertResult.error;
}

async function loadAndMergeCloudPlans(client, user) {
  const result = await client
    .from("training_plans")
    .select("id, weekday, title, detail, goal")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });
  if (result.error) throw result.error;

  const remotePlans = asArray(result.data).map(planRowToPlan).filter(Boolean);
  const mergedById = new Map(remotePlans.map((plan) => [plan.id, plan]));
  const remoteBySignature = new Map(remotePlans.map((plan) => [planSignature(plan), plan]));
  for (const localPlan of state.plans) {
    const remoteMatch = mergedById.get(localPlan.id) || remoteBySignature.get(planSignature(localPlan));
    if (remoteMatch) mergedById.set(remoteMatch.id, { ...localPlan, id: remoteMatch.id });
    else mergedById.set(localPlan.id, localPlan);
  }
  state.plans = Array.from(mergedById.values()).map(normalizePlan).filter((item) => item && (item.title || item.detail));
  save();
  if (!state.plans.length) return;

  const payload = state.plans.map((plan) => planToRow(plan, user.id));
  const upsertResult = await client.from("training_plans").upsert(payload, { onConflict: "id" });
  if (upsertResult.error) throw upsertResult.error;
}

async function loadAndMergeCloudFoods(client, user) {
  const result = await client
    .from("food_logs")
    .select("id, eaten_on, name, kcal, protein")
    .eq("user_id", user.id)
    .order("eaten_on", { ascending: false })
    .order("created_at", { ascending: false });
  if (result.error) throw result.error;

  const remoteFoods = asArray(result.data).map(foodRowToFood).filter(Boolean);
  const mergedById = new Map(remoteFoods.map((food) => [food.id, food]));
  const remoteBySignature = new Map(remoteFoods.map((food) => [foodSignature(food), food]));
  for (const localFood of state.foods) {
    const remoteMatch = mergedById.get(localFood.id) || remoteBySignature.get(foodSignature(localFood));
    if (remoteMatch) mergedById.set(remoteMatch.id, { ...localFood, id: remoteMatch.id });
    else mergedById.set(localFood.id, localFood);
  }
  state.foods = Array.from(mergedById.values()).map(normalizeFood).filter((item) => item && item.name).sort(sortByDateDesc);
  save();
  if (!state.foods.length) return;

  const payload = state.foods.map((food) => foodToRow(food, user.id));
  const upsertResult = await client.from("food_logs").upsert(payload, { onConflict: "id" });
  if (upsertResult.error) throw upsertResult.error;
}

async function loadAndMergeCloudPlaylists(client, user) {
  const result = await client
    .from("playlist_links")
    .select("id, platform, name, url, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (result.error) throw result.error;

  const remotePlaylists = dedupePlaylists(asArray(result.data).map(playlistRowToPlaylist).filter(Boolean));
  const mergedById = new Map(remotePlaylists.map((playlist) => [playlist.id, playlist]));
  const remoteBySignature = new Map(remotePlaylists.map((playlist) => [playlistSignature(playlist), playlist]));
  for (const localPlaylist of state.playlists) {
    const remoteMatch = mergedById.get(localPlaylist.id) || remoteBySignature.get(playlistSignature(localPlaylist));
    if (remoteMatch) mergedById.set(remoteMatch.id, { ...localPlaylist, id: remoteMatch.id });
    else mergedById.set(localPlaylist.id, localPlaylist);
  }
  state.playlists = dedupePlaylists(Array.from(mergedById.values()).map(normalizePlaylist).filter(Boolean).sort(sortByDateDesc));
  save();
  if (!state.playlists.length) return;

  const payload = state.playlists.map((playlist) => playlistToRow(playlist, user.id));
  const upsertResult = await client.from("playlist_links").upsert(payload, { onConflict: "id" });
  if (upsertResult.error) throw upsertResult.error;
}

async function loadAndMergeCloudWellnessData(client, user) {
  if (ensureCloudDataIds()) save();
  await loadAndMergeCloudBodyLogs(client, user);
  await loadAndMergeCloudPlans(client, user);
  await loadAndMergeCloudFoods(client, user);
  await loadAndMergeCloudPlaylists(client, user);
}

async function loadAndMergeCloudPosts(client, user) {
  if (ensureCloudDataIds()) save();
  const otherLocalPosts = state.posts.filter((post) => post.authorId && post.authorId !== user.id);
  if (otherLocalPosts.length) {
    const existingFriendIds = new Set(state.friendPosts.map((post) => post.id));
    state.friendPosts = [
      ...state.friendPosts,
      ...otherLocalPosts.filter((post) => !existingFriendIds.has(post.id)),
    ].map(normalizePost).filter(Boolean).sort(sortByDateDesc);
    state.posts = state.posts.filter((post) => !post.authorId || post.authorId === user.id);
    save();
  }
  const result = await client
    .from("review_posts")
    .select("id, trained_on, title, body, mood, visibility")
    .eq("author_id", user.id)
    .order("trained_on", { ascending: false })
    .order("created_at", { ascending: false });
  if (result.error) throw result.error;

  const remotePosts = asArray(result.data).map((row) => postRowToPost({ ...row, author_id: user.id })).filter(Boolean);
  const mergedById = new Map(remotePosts.map((post) => [post.id, post]));
  const remoteBySignature = new Map(remotePosts.map((post) => [postSignature(post), post]));
  const ownLocalPosts = state.posts.filter((post) => isOwnPost(post, user.id)).map((post) => ({ ...post, authorId: user.id, authorName: "" }));
  for (const localPost of ownLocalPosts) {
    const remoteMatch = mergedById.get(localPost.id) || remoteBySignature.get(postSignature(localPost));
    if (remoteMatch) mergedById.set(remoteMatch.id, { ...localPost, id: remoteMatch.id });
    else mergedById.set(localPost.id, localPost);
  }
  state.posts = Array.from(mergedById.values()).map(normalizePost).filter((item) => item && (item.title || item.text)).sort(sortByDateDesc);
  state.selectedPostDate = normalizeDate(state.selectedPostDate, state.posts[0]?.date || state.records[0]?.date || today());
  save();
  if (!state.posts.length) return;

  const payload = state.posts.filter((post) => post.authorId === user.id).map((post) => postToRow(post, user.id));
  const upsertResult = await client.from("review_posts").upsert(payload, { onConflict: "id" });
  if (upsertResult.error) throw upsertResult.error;
}

async function loadCloudVisiblePosts(client, user) {
  const friendIdList = [...new Set(state.friends.map((friend) => friend.userId || friend.id).filter(Boolean))];
  if (!friendIdList.length) {
    state.friendPosts = [];
    save();
    return;
  }
  const result = await client
    .from("review_posts")
    .select("id, author_id, trained_on, title, body, mood, visibility, created_at")
    .in("author_id", friendIdList)
    .order("trained_on", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(500);
  if (result.error) throw result.error;

  const rows = asArray(result.data);
  const authorIds = [...new Set(rows.map((row) => row.author_id).filter(Boolean))];
  let names = new Map();
  if (authorIds.length) {
    names = profileNameMap(await selectProfilesByIds(client, authorIds));
  }

  state.friendPosts = rows.map((row) => normalizePost({
    id: row.id,
    authorId: row.author_id,
    authorName: names.get(row.author_id)?.name || "训练好友",
    date: row.trained_on,
    title: row.title,
    text: row.body,
    mood: row.mood,
    visibility: row.visibility,
  })).filter(Boolean).sort(sortByDateDesc);
  save();
}

async function selectProfilesByIds(client, ids) {
  const cleanIds = [...new Set(asArray(ids).filter(Boolean))];
  if (!client || !cleanIds.length) return [];
  let result = await client
    .from("profiles")
    .select("id, display_name, friend_code")
    .in("id", cleanIds);
  if (result.error) {
    result = await client
      .from("profiles")
      .select("id, display_name")
      .in("id", cleanIds);
  }
  if (result.error) throw result.error;
  return asArray(result.data);
}

function profileNameMap(rows) {
  return new Map(asArray(rows).map((row) => [row.id, {
    name: sanitizeText(row.display_name || "未命名", 40) || "未命名",
    friendCode: normalizeFriendCode(row.friend_code),
  }]));
}

async function loadCloudFriends(client, user) {
  const friendshipsResult = await client
    .from("friendships")
    .select("friend_id, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (friendshipsResult.error) throw friendshipsResult.error;

  const friendIds = asArray(friendshipsResult.data).map((item) => item.friend_id).filter(Boolean);
  let friendNames = new Map();
  if (friendIds.length) {
    friendNames = profileNameMap(await selectProfilesByIds(client, friendIds));
  }
  state.friends = friendIds.map((id) => normalizeFriend({
    id,
    userId: id,
    name: friendNames.get(id)?.name || "未命名",
    friendCode: friendNames.get(id)?.friendCode || "",
    status: "好友",
  })).filter(Boolean);
  if (
    state.friendPostFriendId !== "all" &&
    !state.friends.some((friend) => (friend.userId || friend.id) === state.friendPostFriendId)
  ) {
    state.friendPostFriendId = "all";
  }

  const requestsResult = await client
    .from("friend_requests")
    .select("id, requester_id, addressee_id, status, created_at")
    .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
    .order("created_at", { ascending: false });
  if (requestsResult.error) throw requestsResult.error;

  const requests = asArray(requestsResult.data);
  const relatedIds = [...new Set(requests.flatMap((request) => [request.requester_id, request.addressee_id]).filter((id) => id && id !== user.id))];
  let requestNames = new Map();
  if (relatedIds.length) {
    requestNames = profileNameMap(await selectProfilesByIds(client, relatedIds));
  }

  state.friendRequests = requests
    .filter((request) => request.status === "pending")
    .map((request) => {
      const otherId = request.requester_id === user.id ? request.addressee_id : request.requester_id;
      return normalizeFriend({
        id: request.id,
        userId: otherId,
        name: requestNames.get(otherId)?.name || "未命名",
        friendCode: requestNames.get(otherId)?.friendCode || "",
        status: request.requester_id === user.id ? "等待对方通过" : "请求添加你",
        direction: request.requester_id === user.id ? "outgoing" : "incoming",
      });
    })
    .filter(Boolean);
  save();
}

async function searchCloudFriends(query) {
  const cleaned = sanitizeText(query, 40);
  state.friendSearchQuery = cleaned;
  state.friendSearchResults = [];
  if (!cleaned) {
    save();
    return [];
  }
  const client = await getSupabaseClient();
  if (!client) return [];
  const user = await getCloudUser(client);
  if (!user) return [];
  let rows = [];
  const rpcResult = await client.rpc("search_friend_profiles", { search_text: cleaned });
  if (rpcResult.error) {
    const fallbackResult = await client
      .from("profiles")
      .select("id, display_name")
      .eq("searchable", true)
      .ilike("display_name", `%${cleaned}%`)
      .neq("id", user.id)
      .limit(8);
    if (fallbackResult.error) throw rpcResult.error;
    rows = asArray(fallbackResult.data);
  } else {
    rows = asArray(rpcResult.data);
  }
  const existingIds = new Set([
    ...state.friends.map((friend) => friend.userId || friend.id),
    ...state.friendRequests.map((request) => request.userId),
  ]);
  state.friendSearchResults = rows
    .map((row) => normalizeFriendCandidate({
      id: row.id,
      name: row.display_name,
      friendCode: row.friend_code,
      status: existingIds.has(row.id) ? "已有关联" : "可添加",
    }))
    .filter(Boolean);
  save();
  return state.friendSearchResults;
}

async function sendFriendRequest(addresseeId) {
  const client = await getSupabaseClient();
  if (!client) return "";
  const user = await getCloudUser(client);
  if (!user) return "";
  const targetId = sanitizeText(addresseeId, 120);
  if (!targetId || targetId === user.id) return "";
  const result = await client.rpc("send_friend_request", { target_user_id: targetId });
  if (result.error) throw result.error;
  await refreshCloudSocial(client, user);
  markCloudSync();
  return sanitizeText(result.data || "pending", 40);
}

async function acceptFriendRequest(requestId) {
  const client = await getSupabaseClient();
  if (!client) return false;
  const user = await getCloudUser(client);
  if (!user) return false;
  const result = await client.rpc("accept_friend_request", { request_id: requestId });
  if (result.error) throw result.error;
  await refreshCloudSocial(client, user);
  markCloudSync();
  return true;
}

async function cancelFriendRequest(requestId) {
  const client = await getSupabaseClient();
  if (!client) return false;
  const user = await getCloudUser(client);
  if (!user) return false;
  const result = await client.rpc("cancel_friend_request", { request_id: requestId });
  if (result.error) throw result.error;
  await refreshCloudSocial(client, user);
  markCloudSync();
  return true;
}

async function rejectFriendRequest(requestId) {
  const client = await getSupabaseClient();
  if (!client) return false;
  const user = await getCloudUser(client);
  if (!user) return false;
  const result = await client.rpc("reject_friend_request", { request_id: requestId });
  if (result.error) throw result.error;
  await refreshCloudSocial(client, user);
  markCloudSync();
  return true;
}

async function removeFriend(friendUserId) {
  const client = await getSupabaseClient();
  if (!client) return false;
  const user = await getCloudUser(client);
  if (!user) return false;
  const result = await client.rpc("remove_friend", { friend_user_id: friendUserId });
  if (result.error) throw result.error;
  await refreshCloudSocial(client, user);
  markCloudSync();
  return true;
}

async function refreshCloudSocial(client, user) {
  if (!client || !user) return false;
  await loadCloudFriends(client, user);
  await loadCloudVisiblePosts(client, user);
  return true;
}

async function syncWorkoutRecordToCloud(record) {
  const client = await getSupabaseClient();
  if (!client) return false;
  const user = await getCloudUser(client);
  if (!user) return false;
  const normalized = normalizeRecord(record);
  if (!normalized) return false;
  const payload = recordToWorkoutRow(normalized, user.id);
  const result = await client.from("workout_records").upsert(payload, { onConflict: "id" });
  if (result.error) throw result.error;
  markCloudSync();
  return true;
}

async function syncBodyLogToCloud(log) {
  const client = await getSupabaseClient();
  if (!client) return false;
  const user = await getCloudUser(client);
  if (!user) return false;
  const normalized = normalizeBodyLog(log);
  if (!normalized) return false;
  const result = await client.from("body_logs").upsert(bodyLogToRow(normalized, user.id), { onConflict: "user_id,logged_on" });
  if (result.error) throw result.error;
  markCloudSync();
  return true;
}

async function syncPlanToCloud(plan) {
  const client = await getSupabaseClient();
  if (!client) return false;
  const user = await getCloudUser(client);
  if (!user) return false;
  const normalized = normalizePlan(plan);
  if (!normalized) return false;
  const result = await client.from("training_plans").upsert(planToRow(normalized, user.id), { onConflict: "id" });
  if (result.error) throw result.error;
  markCloudSync();
  return true;
}

async function syncFoodToCloud(food) {
  const client = await getSupabaseClient();
  if (!client) return false;
  const user = await getCloudUser(client);
  if (!user) return false;
  const normalized = normalizeFood(food);
  if (!normalized) return false;
  const result = await client.from("food_logs").upsert(foodToRow(normalized, user.id), { onConflict: "id" });
  if (result.error) throw result.error;
  markCloudSync();
  return true;
}

async function syncPostToCloud(post) {
  const client = await getSupabaseClient();
  if (!client) return false;
  const user = await getCloudUser(client);
  if (!user) return false;
  const normalized = normalizePost(post);
  if (!normalized) return false;
  const result = await client.from("review_posts").upsert(postToRow(normalized, user.id), { onConflict: "id" });
  if (result.error) throw result.error;
  markCloudSync();
  return true;
}

async function syncPlaylistToCloud(playlist) {
  const client = await getSupabaseClient();
  if (!client) return false;
  const user = await getCloudUser(client);
  if (!user) return false;
  const normalized = normalizePlaylist(playlist);
  if (!normalized) return false;
  const result = await client.from("playlist_links").upsert(playlistToRow(normalized, user.id), { onConflict: "id" });
  if (result.error) throw result.error;
  markCloudSync();
  return true;
}

async function openExternalPlaylist(playlistId) {
  const playlist = state.playlists.find((item) => item.id === playlistId);
  if (!playlist || !isSafeUrl(playlist.url)) {
    toast("歌单链接无效");
    return;
  }
  try {
    const capacitor = globalThis.Capacitor;
    if (capacitor?.isNativePlatform?.()) {
      const nativeOpened = await openNativePlaylist(playlist);
      if (nativeOpened) {
        toast("已尝试唤起本地音乐 App");
        return;
      }
      window.open(playlist.url, "_system", "noopener,noreferrer");
    } else {
      window.open(playlist.url, "_blank", "noopener,noreferrer");
    }
    toast("已请求外部打开歌单");
  } catch {
    window.location.href = playlist.url;
  }
}

async function openNativePlaylist(playlist) {
  const opener = globalThis.Capacitor?.Plugins?.NativeOpener;
  if (!opener?.open) return false;
  try {
    const result = await opener.open({ url: playlist.url, platform: playlist.platform });
    return Boolean(result?.opened);
  } catch {
    return false;
  }
}

function feedbackStatusText(status) {
  return { pending: "待同步", synced: "已提交", failed: "待重试" }[status] || "待同步";
}

function openExternalUrl(url) {
  if (!isSafeUrl(url)) return false;
  try {
    const capacitor = globalThis.Capacitor;
    if (capacitor?.isNativePlatform?.()) {
      window.open(url, "_system", "noopener,noreferrer");
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
    return true;
  } catch {
    window.location.href = url;
    return true;
  }
}

function feedbackDiagnostics() {
  return {
    appVersion: APP_VERSION,
    page: state.activePage,
    goal: state.goal,
    platform: navigator.userAgent,
    loggedIn: state.auth.loggedIn,
    recordCount: state.records.length,
    postCount: state.posts.length,
    friendCount: state.friends.length,
    lastSyncAt: state.cloud.lastSyncAt,
    lastError: state.cloud.lastError,
  };
}

async function submitFeedback(form) {
  const report = normalizeFeedbackReport({
    id: cloudId(),
    category: form.get("category"),
    message: form.get("message"),
    contact: form.get("contact"),
    status: "pending",
    createdAt: new Date().toISOString(),
    appVersion: APP_VERSION,
    platform: navigator.userAgent,
  });
  if (!report) {
    toast("请先填写反馈内容");
    return;
  }
  const includeDiagnostics = form.get("diagnostics") === "on";
  report.includeDiagnostics = includeDiagnostics;
  state.feedbackSubmitting = true;
  save();
  render();
  try {
    const synced = await syncFeedbackReportToCloud(report, includeDiagnostics ? feedbackDiagnostics() : null);
    state.feedbackReports.unshift({ ...report, status: synced ? "synced" : "pending" });
    state.feedbackReports = state.feedbackReports.map(normalizeFeedbackReport).filter(Boolean);
    state.feedbackSubmitting = false;
    save();
    render();
    toast(synced ? "反馈已提交" : "反馈已本地保存，登录后可同步");
  } catch (error) {
    state.feedbackReports.unshift({ ...report, status: "failed", error: error?.message || "反馈同步失败" });
    state.feedbackReports = state.feedbackReports.map(normalizeFeedbackReport).filter(Boolean);
    state.feedbackSubmitting = false;
    markCloudSync({ error: error?.message || "反馈同步失败" });
    render();
    toast("反馈已本地保存，云端提交失败");
  }
}

async function syncFeedbackReportToCloud(report, diagnostics = null) {
  if (!state.auth.loggedIn) return false;
  const client = await getSupabaseClient();
  if (!client) return false;
  const user = await getCloudUser(client);
  if (!user) return false;
  const payload = {
    id: isUuid(report.id) ? report.id : cloudId(),
    user_id: user.id,
    email: state.auth.email || user.email || "",
    category: report.category,
    message: report.message,
    contact: report.contact,
    diagnostics,
    app_version: report.appVersion || APP_VERSION,
    platform: report.platform,
  };
  const result = await client.from("feedback_reports").insert(payload);
  if (result.error) throw result.error;
  markCloudSync();
  return true;
}

async function syncPendingFeedbackReports(client, user) {
  const pending = state.feedbackReports.filter((item) => item.status !== "synced");
  if (!pending.length || !client || !user) return;
  for (const report of pending) {
    try {
      const payload = {
        id: isUuid(report.id) ? report.id : cloudId(),
        user_id: user.id,
        email: state.auth.email || user.email || "",
        category: report.category,
        message: report.message,
        contact: report.contact,
        diagnostics: report.includeDiagnostics ? feedbackDiagnostics() : null,
        app_version: report.appVersion || APP_VERSION,
        platform: report.platform,
      };
      const result = await client.from("feedback_reports").insert(payload);
      if (result.error) throw result.error;
      report.status = "synced";
      report.error = "";
    } catch (error) {
      report.status = "failed";
      report.error = sanitizeText(error?.message || "反馈同步失败", 180);
    }
  }
  state.feedbackReports = state.feedbackReports.map(normalizeFeedbackReport).filter(Boolean);
  save();
}

function compareSemver(a, b) {
  const left = String(a || "").split(".").map((part) => Number(part) || 0);
  const right = String(b || "").split(".").map((part) => Number(part) || 0);
  const length = Math.max(left.length, right.length);
  for (let index = 0; index < length; index += 1) {
    const delta = (left[index] || 0) - (right[index] || 0);
    if (delta) return delta;
  }
  return 0;
}

function readRuntimeEnv(name) {
  if (import.meta.env && import.meta.env[name]) return String(import.meta.env[name]).trim();
  if (typeof window !== "undefined" && window.__FITTRACK_ENV__ && window.__FITTRACK_ENV__[name]) {
    return String(window.__FITTRACK_ENV__[name]).trim();
  }
  return "";
}

function buildVersionManifestUrls() {
  const urls = [
    readRuntimeEnv("VITE_VERSION_MANIFEST_URL"),
    readRuntimeEnv("VITE_VERSION_MANIFEST_URLS"),
  ]
    .filter(Boolean)
    .join(",")
    .split(",")
    .map((url) => url.trim())
    .filter(isSafeUrl);
  urls.push(LOCAL_VERSION_MANIFEST_URL);
  return [...new Set(urls)];
}

function resolveVersionUrl(value, manifestUrl) {
  const text = String(value || "").trim();
  if (!text) return "";
  try {
    const parsed = new URL(text, manifestUrl);
    return ["http:", "https:"].includes(parsed.protocol) ? parsed.href : "";
  } catch {
    return "";
  }
}

function normalizeVersionManifest(manifest, manifestUrl = "") {
  const source = isObject(manifest) ? manifest : {};
  const latestVersion = sanitizeText(source.latestVersion || source.version, 40) || APP_VERSION;
  const latestVersionCode = Math.max(0, Math.trunc(Number(source.latestVersionCode) || 0));
  const releaseNotes = asArray(source.releaseNotes?.length ? source.releaseNotes : source.notes)
    .map((note) => sanitizeText(note, 160))
    .filter(Boolean)
    .slice(0, 8);
  const downloadPageUrl = resolveVersionUrl(source.downloadPageUrl || source.downloadUrl, manifestUrl);
  const apkUrl = resolveVersionUrl(source.apkUrl, manifestUrl);
  return {
    latestVersion,
    latestVersionCode,
    title: sanitizeText(source.title, 100),
    releaseNotes,
    releaseDate: sanitizeText(source.releaseDate, 24),
    downloadUrl: downloadPageUrl || apkUrl,
    mandatory: Boolean(source.mandatory),
  };
}

async function checkAppVersion({ interactive = true } = {}) {
  if (state.versionChecking) return;
  state.versionChecking = true;
  state.versionStatus = "正在检查更新...";
  if (interactive) state.activeUtilityModal = state.activeUtilityModal || "version";
  render();
  let manifest = normalizeVersionManifest(BUILT_IN_VERSION_MANIFEST);
  let source = "built-in";
  for (const url of VERSION_MANIFEST_URLS) {
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) throw new Error(`manifest ${response.status}`);
      manifest = normalizeVersionManifest(await response.json(), url);
      source = url === LOCAL_VERSION_MANIFEST_URL ? "local" : "remote";
      break;
    } catch {
      source = "built-in";
    }
  }
  const hasUpdate = manifest.latestVersionCode > 0
    ? manifest.latestVersionCode > APP_VERSION_CODE
    : compareSemver(manifest.latestVersion, APP_VERSION) > 0;
  state.versionCheckedAt = new Date().toISOString();
  if (!hasUpdate) {
    state.versionUpdate = normalizeVersionUpdate();
    state.versionStatus = source === "remote"
      ? `当前已是最新版本 v${APP_VERSION}（${APP_VERSION_CODE}）`
      : `当前已是本机最新版本 v${APP_VERSION}（${APP_VERSION_CODE}）；配置线上 version.json 后可检查新版本`;
    if (interactive) toast("当前已是最新版本");
  } else {
    const notes = sanitizeText(manifest.releaseNotes.join("；") || manifest.title || "发现新版本", 220);
    state.versionUpdate = normalizeVersionUpdate({
      available: true,
      latestVersion: manifest.latestVersion,
      latestVersionCode: manifest.latestVersionCode,
      releaseDate: manifest.releaseDate,
      releaseNotes: manifest.releaseNotes,
      downloadUrl: manifest.downloadUrl,
    });
    state.versionStatus = `已有新版本 v${manifest.latestVersion}（${manifest.latestVersionCode || "未提供版本码"}）：${notes}`;
    if (interactive) toast(manifest.downloadUrl ? "已有新版本，可前往下载" : "已有新版本，下载地址暂未配置");
  }
  state.versionChecking = false;
  save();
  render();
  return { hasUpdate, manifest, source };
}

async function deletePostFromCloud(postId) {
  const client = await getSupabaseClient();
  if (!client) return false;
  const user = await getCloudUser(client);
  if (!user || !isUuid(postId)) return false;
  const result = await client.from("review_posts").delete().eq("id", postId).eq("author_id", user.id);
  if (result.error) throw result.error;
  markCloudSync();
  return true;
}

async function deletePlaylistFromCloud(playlistId) {
  const client = await getSupabaseClient();
  if (!client) return false;
  const user = await getCloudUser(client);
  if (!user || !isUuid(playlistId)) return false;
  const result = await client.from("playlist_links").delete().eq("id", playlistId).eq("user_id", user.id);
  if (result.error) throw result.error;
  markCloudSync();
  return true;
}

async function deleteWorkoutRecordFromCloud(recordId) {
  if (!state.auth.loggedIn || !isUuid(recordId)) return false;
  const client = await getSupabaseClient();
  if (!client) return false;
  const result = await client.from("workout_records").delete().eq("id", recordId);
  if (result.error) throw result.error;
  markCloudSync();
  return true;
}

async function syncCloudAfterLogin(client, user, { silent = false } = {}) {
  if (!client || !user) return false;
  try {
    state.cloud = normalizeCloud({ ...state.cloud, syncing: true, lastError: "" });
    save();
    await loadCloudProfile(client, user);
    await loadAndMergeCloudRecords(client, user);
    await loadAndMergeCloudWellnessData(client, user);
    await loadAndMergeCloudPosts(client, user);
    await loadCloudFriends(client, user);
    await loadCloudVisiblePosts(client, user);
    await syncPendingFeedbackReports(client, user);
    markCloudSync();
    render();
    if (!silent) toast("账号数据已同步");
    return true;
  } catch (error) {
    const message = sanitizeText(error?.message || "云同步失败", 160);
    markCloudSync({ error: message });
    render();
    if (!silent) toast(`云同步失败：${message}`);
    return false;
  }
}

function icon(name) {
  const map = { home: "▣", data: "↗", plan: "□", feed: "✎", friends: "◎", music: "♪", me: "○" };
  return map[name] || "•";
}

function render() {
  const app = document.getElementById("app");
  const streak = streakDays();
  const progressWidth = Math.min(100, streak * 12);
  app.innerHTML = `
    <div class="app goal-${goalConfig[state.goal].accent}">
      <aside class="sidebar" id="appDrawer" aria-label="功能导航">
        <div class="drawer-head">
          <div class="brand"><img class="brand-mark brand-icon" src="${escapeAttr(new URL("./assets/app-icon.png", import.meta.url).href)}" alt="练了没"><span><strong>练了没</strong><small>藏器于身，伺时而动</small></span></div>
          <button class="drawer-close" type="button" data-menu-close aria-label="关闭菜单">×</button>
        </div>
        <nav class="nav">
          ${navButton("home", "训练")}
          ${navButton("data", "数据")}
          ${navButton("plan", "计划")}
          ${navButton("feed", "日记")}
          ${navButton("friends", "好友")}
          ${navButton("music", "音乐")}
          ${navButton("me", "我的")}
        </nav>
        <div class="drawer-tools" aria-label="快捷入口">
          <div class="drawer-section-label">快捷入口</div>
          <div class="drawer-tool-grid">
            ${drawerTool("feed", "训练复盘", "✎")}
            ${drawerTool("friends", "好友管理", "◎")}
            ${drawerTool("music", "训练歌单", "♪")}
            ${drawerTool("plan", "训练计划", "□")}
          </div>
          <div class="drawer-section-label">更多</div>
          <div class="drawer-link-list">
            ${drawerUtilityLink("feedback", "反馈", "问题反馈 / 功能建议")}
            ${drawerUtilityLink("notices", "通知", `${unreadNoticeCount()} 条未读`)}
            ${drawerUtilityLink("sponsor", "支持赞助", "完全自愿")}
          </div>
        </div>
        <div class="streak-card">
          <div class="muted">连续打卡</div>
          <div><span class="streak-num">${streak}</span> 天</div>
          <div class="week">${weekDots()}</div>
          <div class="muted">${todayCheckedIn() ? "今天已经练过" : "今天还没打卡"}</div>
          <div class="progress-line"><span style="width:${progressWidth}%"></span></div>
        </div>
      </aside>
      <button class="drawer-scrim" type="button" data-menu-close aria-label="关闭菜单"></button>
      <main class="main">
        <header class="topbar">
          <div class="goal-switch">
            <span>目标</span>
            <span class="seg">
              <button class="${state.goal === "减脂" ? "on" : ""}" data-goal="减脂">减脂</button>
              <button class="${state.goal === "增肌" ? "on" : ""}" data-goal="增肌">增肌</button>
            </span>
          </div>
          <div class="mobile-streak">连续 <b>${streak}</b> 天 · 本周 ${thisWeekRecords().length} 次</div>
          <div class="user"><span class="avatar">${avatarContent()}</span><span>${escapeHtml(state.profile.name)} · Lv.${state.profile.level}</span></div>
          <button class="menu-toggle" type="button" data-menu-open aria-controls="appDrawer" aria-expanded="false" aria-label="打开功能菜单">
            <span></span><span></span><span></span>
          </button>
        </header>
        ${homePage()}
        ${dataPage()}
        ${planPage()}
        ${feedPage()}
        ${friendsPage()}
        ${musicPage()}
        ${mePage()}
      </main>
    </div>
    ${utilityModal()}
    ${timerConfirmModal()}
    ${playlistDeleteConfirmModal()}
    <div class="toast" role="status" aria-live="polite"></div>
  `;
  bindEvents();
}

function navButton(page, text) {
  return `<button type="button" class="${state.activePage === page ? "active" : ""}" data-page="${page}"><span class="icon">${icon(page)}</span><span>${text}</span></button>`;
}

function drawerTool(page, text, symbol) {
  return `<button type="button" class="${state.activePage === page ? "active" : ""}" data-page="${page}"><span>${symbol}</span><b>${escapeHtml(text)}</b></button>`;
}

function drawerLink(page, text) {
  return `<button type="button" class="${state.activePage === page ? "active" : ""}" data-page="${page}"><span>${escapeHtml(text)}</span><span>›</span></button>`;
}

function drawerUtilityLink(type, text, detail = "") {
  return `
    <button type="button" data-utility-modal="${escapeAttr(type)}">
      <span><b>${escapeHtml(text)}</b>${detail ? `<small>${escapeHtml(detail)}</small>` : ""}</span>
      <span>›</span>
    </button>
  `;
}

function visibleAppNotices() {
  const update = state.versionUpdate;
  const updateNotice = update.available ? {
    id: `version-update-${update.latestVersionCode || update.latestVersion}`,
    date: update.releaseDate || today(),
    title: `已有新版本 v${update.latestVersion}`,
    text: update.releaseNotes[0] || "点击前往下载页，安装最新版 APK。",
    actionUrl: update.downloadUrl,
  } : null;
  return updateNotice ? [updateNotice, ...appNotices] : appNotices;
}

function unreadNoticeCount() {
  const read = new Set(state.notificationReadIds);
  return visibleAppNotices().filter((notice) => !read.has(notice.id)).length;
}

function sectionTitle(title, detail = "") {
  return `<div class="section-title"><h2>${escapeHtml(title)}</h2>${detail ? `<p>${escapeHtml(detail)}</p>` : ""}</div>`;
}

function foodReferenceGroups() {
  const groups = new Map();
  for (const item of asArray(foodReferences)) {
    if (!isObject(item) || !sanitizeText(item.name, 80)) continue;
    const category = sanitizeText(item.category || "其他", 40);
    const name = sanitizeText(item.name, 80);
    const foodKey = sanitizeText(item.foodId || item.id || name, 80);
    const categoryKey = sanitizeText(item.categoryId || category, 60);
    const id = `${categoryKey}::${foodKey}`;
    const variants = [
      ...asArray(item.variants),
      ...asArray(item.methods),
      ...asArray(item.preparations),
      ...asArray(item.cookingMethods),
    ];
    const sourceVariants = variants.length ? variants : [item];
    const group = groups.get(id) || {
      id,
      category,
      name,
      description: sanitizeText(item.description || item.introduction || item.summary || "", 240),
      aliases: [],
      variants: [],
    };
    group.aliases = [...new Set([...group.aliases, ...asArray(item.aliases).map((alias) => sanitizeText(alias, 40)).filter(Boolean)])];
    if (!group.description) {
      group.description = sanitizeText(item.description || item.introduction || item.summary || "", 240);
    }
    sourceVariants.forEach((variant, index) => {
      if (!isObject(variant)) return;
      const nutrition = isObject(variant.nutrition) ? variant.nutrition : variant;
      group.variants.push({
        id: sanitizeText(variant.id || `${id}-${group.variants.length}`, 140),
        method: sanitizeText(variant.method || variant.cooking || variant.label || variant.name || `做法 ${index + 1}`, 80),
        portion: sanitizeText(variant.portion || variant.serving || variant.amount || variant.weight || "参考份量", 80),
        kcal: clampNumber(nutrition.kcal ?? nutrition.calories, 0, 20000),
        protein: clampNumber(nutrition.protein, 0, 1000),
        carbs: clampNumber(nutrition.carbs ?? nutrition.carbohydrate, 0, 1000),
        fat: clampNumber(nutrition.fat, 0, 1000),
        note: sanitizeText(variant.note || variant.description || "", 180),
      });
    });
    groups.set(id, group);
  }
  return Array.from(groups.values());
}

function foodReferenceCategories() {
  return [...new Set(foodReferenceGroups().map((item) => item.category).filter(Boolean))];
}

function filteredFoodReferences() {
  const query = state.foodRefQuery.toLowerCase();
  return foodReferenceGroups().filter((item) => {
    const categoryMatch = state.foodRefCategory === "全部" || item.category === state.foodRefCategory;
    const queryText = `${item.name} ${item.description} ${item.aliases.join(" ")} ${item.variants.map((variant) => `${variant.method} ${variant.portion} ${variant.note}`).join(" ")}`.toLowerCase();
    return categoryMatch && (!query || queryText.includes(query));
  });
}

function nutritionValue(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "-";
  return Number.isInteger(number) ? String(number) : number.toFixed(1);
}

function foodReferenceListItem(item) {
  return `
    <button class="food-ref-list-item" type="button" data-food-ref-id="${escapeAttr(item.id)}">
      <span class="food-ref-list-copy">
        <small>${escapeHtml(item.category)}</small>
        <strong>${escapeHtml(item.name)}</strong>
        ${item.description ? `<span>${escapeHtml(item.description)}</span>` : ""}
      </span>
      <b>${item.variants.length} 种做法</b>
      <span class="food-ref-chevron" aria-hidden="true">›</span>
    </button>
  `;
}

function foodReferenceDetail(item) {
  if (!item) return "";
  const description = item.description || `${item.name}在不同做法和份量下，热量与三大营养素会有明显差异。`;
  return `
    <div class="food-ref-detail">
      <button class="food-ref-back" type="button" data-close-food-ref-detail aria-label="返回食物列表">← <span>返回食物列表</span></button>
      <article class="food-ref-card">
        <header class="food-ref-detail-head">
          <span>${escapeHtml(item.category)}</span>
          <h3>${escapeHtml(item.name)}</h3>
          <p>${escapeHtml(description)}</p>
        </header>
        <div class="food-method-list">
          ${item.variants.map((variant) => `
            <section class="food-method-row">
              <div class="food-method-title">
                <strong>${escapeHtml(variant.method)}</strong>
                <span>${escapeHtml(variant.portion)}</span>
              </div>
              <div class="food-method-macros">
                <b>${nutritionValue(variant.kcal)}<small>kcal</small></b>
                <b>${nutritionValue(variant.protein)}<small>g 蛋白质</small></b>
                <b>${nutritionValue(variant.carbs)}<small>g 碳水</small></b>
                <b>${nutritionValue(variant.fat)}<small>g 脂肪</small></b>
              </div>
              ${variant.note ? `<p>${escapeHtml(variant.note)}</p>` : ""}
            </section>
          `).join("")}
        </div>
      </article>
    </div>
  `;
}

function homePage() {
  const todayRecords = state.records.filter((record) => record.date === today());
  return `
    <section class="page ${state.activePage === "home" ? "active" : ""}">
      <div class="dashboard-strip">
        ${todayStatusTile()}
        ${statusTile("连续", `${streakDays()} 天`, "真实自然日计算")}
        ${statusTile("本周", `${thisWeekRecords().length} 次`, goalConfig[state.goal].focus)}
      </div>
      <div class="grid home-grid">
        <div class="panel muscle-card">
          ${sectionTitle("今天练什么？", "点选肌群或心肺训练，保存后会同步到数据和日记。")}
          ${bodySvg()}
          <div class="muscle-list">${bodyParts.map(muscleButton).join("")}</div>
          <div class="selected-tip">当前选择：<b>${escapeHtml(state.selectedParts.join("、") || "未选择")}</b></div>
        </div>
        <div class="panel">
          ${sectionTitle("记一组", state.editingId ? "正在编辑已有记录" : "重量、次数和组数会用于力量趋势。")}
          ${recordForm()}
        </div>
        <div class="panel">
          ${goalPanel()}
        </div>
        <div class="panel">
          ${sectionTitle("今天完成", "一眼看清今天的训练量。")}
          ${summary(todayRecords)}
          <div class="chips">${[...new Set(todayRecords.flatMap(getRecordParts))].map((part) => `<span class="chip">${escapeHtml(part)}</span>`).join("") || `<span class="muted">今天还没有记录。</span>`}</div>
        </div>
        <div class="panel wide">
          ${sectionTitle("最近练过", "补录历史日期后也会按日期排序。")}
          ${recordsTable(state.records.slice(0, 8))}
        </div>
      </div>
    </section>
  `;
}

function statusTile(label, value, detail) {
  return `<div class="status-tile"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong><small>${escapeHtml(detail)}</small></div>`;
}

function todayStatusTile() {
  const seconds = currentTrainingSeconds();
  const running = state.trainingTimer.running;
  const ended = Boolean(state.trainingTimer.savedSeconds && state.trainingTimer.savedAt && !running);
  const hasTimerValue = running || seconds > 0;
  const paused = Boolean(seconds && !running && !ended);
  return `
    <div class="status-tile today-tile">
      <div class="today-main">
        <span>今天</span>
        <strong>${escapeHtml(today())}</strong>
        <small>${todayCheckedIn() ? "已完成训练" : "还未打卡"}</small>
      </div>
      <div class="today-timer">
        <div class="timer-readout">
          <span>本次训练时长</span>
          <strong id="trainingTimerDisplay">${formatDuration(seconds)}</strong>
          <small>${running ? "正在计时" : ended ? "已结束" : seconds ? "已暂停" : "尚未开始"}</small>
        </div>
        <div class="timer-actions">
          <button class="mini ${running || paused ? "timer-active timer-primary" : ""}" type="button" data-timer-action="${running ? "pause" : "start"}">${running ? "暂停" : "开始"}</button>
          <button class="mini ${ended ? "timer-active timer-finished" : ""}" type="button" data-timer-action="finish" ${hasTimerValue ? "" : "disabled"}>结束锻炼</button>
          <button class="mini ${!hasTimerValue ? "timer-idle" : ""}" type="button" data-timer-action="reset" ${hasTimerValue ? "" : "disabled"}>清零</button>
        </div>
      </div>
    </div>
  `;
}

function goalPanel() {
  const config = goalConfig[state.goal];
  const stats = goalStats();
  return `
    ${sectionTitle(`${config.label}模式`, config.targetHint)}
    <div class="goal-metrics">
      ${config.metrics.map((metric) => `
        <div class="goal-metric">
          <span>${escapeHtml(metric.label)}</span>
          <strong>${stats[metric.key]}</strong>
          <small>${escapeHtml(metric.unit)}</small>
        </div>
      `).join("")}
    </div>
    <div class="goal-advice">
      ${state.goal === "减脂"
        ? "今天优先补充饮食热量记录；如果有氧为空，建议安排 20-40 分钟低中强度训练。"
        : "今天优先记录主项重量；若动作稳定，下次可尝试加 2.5kg 或多做 1-2 次。"}
    </div>
  `;
}

function muscleButton(part) {
  const trained = state.records.some((record) => record.date === today() && getRecordParts(record).includes(part));
  const chosen = state.selectedParts.includes(part);
  return `<button class="muscle-btn ${trained ? "trained" : ""} ${chosen ? "chosen" : ""}" data-muscle="${escapeAttr(part)}"><span>${partIcon(part)}</span>${escapeHtml(part)}</button>`;
}

function partIcon(part) {
  return ({ 胸部: "胸", 背部: "背", 腿部: "腿", 肩部: "肩", 手臂: "臂", 核心: "核", 有氧: "心" })[part] || "•";
}

function bodySvg() {
  const mode = state.goal === "减脂" ? "cut" : "bulk";
  const assetSet = state.profile.gender === "女" ? muscleMapAssets.female : muscleMapAssets.male;
  const hot = (part) => {
    const trained = state.records.some((record) => record.date === today() && getRecordParts(record).includes(part));
    const chosen = state.selectedParts.includes(part);
    return `${chosen ? "chosen" : ""} ${trained ? "trained" : ""}`.trim();
  };
  return `
    <div class="anatomy-board">
      <div class="anatomy-title-row">
        <span>${escapeHtml(state.profile.gender)}性肌肉负荷图</span>
      </div>
      <svg class="anatomy-figure anatomy-figure-dual mode-${mode}" viewBox="0 0 1280 1100" role="img" aria-label="${escapeAttr(state.profile.gender)}性正背面肌肉负荷图">
        <image class="anatomy-base-art" href="${escapeAttr(assetSet.base)}" x="0" y="0" width="1280" height="1100" preserveAspectRatio="xMidYMid meet"/>
        <g class="anatomy-tint-layer" aria-hidden="true">
          ${tintLayers(hot, assetSet[mode])}
        </g>
        <g class="anatomy-hit-layer" aria-label="可点击肌群">
          ${frontMuscles(hot)}
          ${backMuscles(hot)}
        </g>
      </svg>
      <div class="legend-row">
        <span class="legend chosen"></span>当前选择
        <span class="legend trained"></span>今日已练
        <span class="legend mode"></span>${escapeHtml(state.goal)}点亮
      </div>
    </div>
  `;
}

function muscleClipDefs() {
  return `
    <defs>
      <filter id="tint-cut-filter" color-interpolation-filters="sRGB">
        <feColorMatrix type="matrix" values="
          0    0    0    0 0.05
          0    0    0    0 0.88
          0    0    0    0 0.80
         -0.94 -0.94 -0.94 0 2.72"/>
      </filter>
      <filter id="tint-bulk-filter" color-interpolation-filters="sRGB">
        <feColorMatrix type="matrix" values="
          0    0    0    0 0.92
          0    0    0    0 0.22
          0    0    0    0 0.16
         -0.94 -0.94 -0.94 0 2.72"/>
      </filter>

      <clipPath id="clip-front-shoulders">
        <path d="M103 188 C157 143 226 145 276 184 L261 302 L170 337 L85 294 Z"/>
        <path d="M506 188 C452 143 383 145 333 184 L348 302 L439 337 L524 294 Z"/>
      </clipPath>
      <clipPath id="clip-front-chest">
        <path d="M188 203 C227 168 292 179 323 224 L319 359 L194 344 C169 293 173 235 188 203 Z"/>
        <path d="M421 203 C382 168 317 179 286 224 L290 359 L415 344 C440 293 436 235 421 203 Z"/>
      </clipPath>
      <clipPath id="clip-front-core">
        <path d="M188 341 L421 341 L445 594 L357 716 L305 688 L253 716 L164 594 Z"/>
      </clipPath>
      <clipPath id="clip-front-arms">
        <path d="M54 286 L202 327 L169 535 L123 628 L92 760 L42 815 L17 650 L45 455 Z"/>
        <path d="M555 286 L407 327 L440 535 L486 628 L517 760 L567 815 L592 650 L564 455 Z"/>
      </clipPath>
      <clipPath id="clip-front-legs">
        <path d="M162 604 L301 682 L286 1014 L230 1076 L163 1044 L158 856 Z"/>
        <path d="M447 604 L308 682 L323 1014 L379 1076 L446 1044 L451 856 Z"/>
      </clipPath>
      <clipPath id="clip-front-cardio">
        <path d="M90 178 C150 137 232 135 293 188 L288 158 C275 145 260 127 257 101 C253 71 270 48 300 45 C330 48 347 71 343 101 C340 127 325 145 312 158 L307 188 C372 136 458 139 520 178 L595 650 L565 817 L505 760 L474 634 L449 856 L446 1044 L379 1076 L323 1014 L305 688 L286 1014 L230 1076 L163 1044 L158 856 L104 760 L42 817 L14 650 Z"/>
      </clipPath>

      <clipPath id="clip-back-shoulders">
        <path d="M674 176 C736 133 811 142 860 184 L842 306 L746 340 L660 294 Z"/>
        <path d="M1116 176 C1054 133 979 142 930 184 L948 306 L1044 340 L1130 294 Z"/>
      </clipPath>
      <clipPath id="clip-back-back">
        <path d="M742 112 L895 72 L1048 112 L1110 292 L1055 575 L895 676 L735 575 L680 292 Z"/>
      </clipPath>
      <clipPath id="clip-back-core">
        <path d="M735 560 C797 511 862 524 895 573 C928 524 993 511 1055 560 L1040 725 L895 790 L750 725 Z"/>
      </clipPath>
      <clipPath id="clip-back-arms">
        <path d="M651 286 L795 327 L765 535 L719 628 L690 760 L641 815 L616 650 L643 455 Z"/>
        <path d="M1139 286 L995 327 L1025 535 L1071 628 L1100 760 L1149 815 L1174 650 L1147 455 Z"/>
      </clipPath>
      <clipPath id="clip-back-legs">
        <path d="M742 716 L888 790 L867 1014 L811 1076 L744 1044 L740 856 Z"/>
        <path d="M1048 716 L902 790 L923 1014 L979 1076 L1046 1044 L1050 856 Z"/>
      </clipPath>
      <clipPath id="clip-back-cardio">
        <path d="M680 178 C740 137 822 135 883 188 L878 158 C865 145 850 127 847 101 C843 71 860 48 890 45 C920 48 937 71 933 101 C930 127 915 145 902 158 L897 188 C962 136 1048 139 1110 178 L1185 650 L1155 817 L1095 760 L1064 856 L1046 1044 L979 1076 L923 1014 L895 790 L867 1014 L811 1076 L744 1044 L740 856 L690 760 L641 817 L606 650 Z"/>
      </clipPath>
    </defs>
  `;
}

function tintLayers(hot, overlayMap) {
  return bodyParts.map((part) => {
    const stateClass = hot(part);
    const overlay = overlayMap[part];
    if (!stateClass || !overlay) return "";
    return `
      <image class="tint-layer ${stateClass} ${part === "有氧" ? "cardio-tint" : ""}" href="${escapeAttr(overlay)}" x="0" y="0" width="1280" height="1100" preserveAspectRatio="xMidYMid meet"/>
    `;
  }).join("");
}

function frontMuscles(hot) {
  return `
    <g data-muscle="有氧" class="cardio-group ${hot("有氧")}">
      <rect class="cardio-hit" x="40" y="110" width="530" height="930" rx="180"/>
      <path class="cardio-zone" d="M169 352 L238 352 L268 307 L321 408 L361 329 L394 352 L466 352"/>
      <path class="cardio-zone" d="M202 590 C252 650 353 650 404 590"/>
    </g>

    <g data-muscle="肩部" class="muscle-group ${hot("肩部")}">
      <path class="muscle-hit" d="M90 176 C152 133 225 142 276 184 L261 302 L171 343 L84 296 Z M519 176 C457 133 384 142 333 184 L348 302 L438 343 L525 296 Z"/>
      <path class="muscle-zone" d="M111 207 C155 171 220 171 267 193 C259 235 232 280 184 303 C149 299 116 274 93 244 Z"/>
      <path class="muscle-zone" d="M498 207 C454 171 389 171 342 193 C350 235 377 280 425 303 C460 299 493 274 516 244 Z"/>
      <path class="muscle-zone" d="M149 245 C178 227 214 216 255 211 C246 250 221 281 187 296 C168 288 154 272 149 245 Z"/>
      <path class="muscle-zone" d="M460 245 C431 227 395 216 354 211 C363 250 388 281 422 296 C441 288 455 272 460 245 Z"/>
    </g>

    <g data-muscle="胸部" class="muscle-group ${hot("胸部")}">
      <path class="muscle-hit" d="M188 203 C227 168 292 179 323 224 L319 359 L194 344 C169 293 173 235 188 203 Z M421 203 C382 168 317 179 286 224 L290 359 L415 344 C440 293 436 235 421 203 Z"/>
      <path class="muscle-zone" d="M200 244 C233 203 290 204 321 233 C312 280 265 318 197 313 C184 287 185 262 200 244 Z"/>
      <path class="muscle-zone" d="M409 244 C376 203 319 204 288 233 C297 280 344 318 412 313 C425 287 424 262 409 244 Z"/>
      <path class="muscle-zone" d="M211 318 C251 317 285 331 315 351 C271 370 229 358 199 337 Z"/>
      <path class="muscle-zone" d="M398 318 C358 317 324 331 294 351 C338 370 380 358 410 337 Z"/>
    </g>

    <g data-muscle="核心" class="muscle-group ${hot("核心")}">
      <path class="muscle-hit" d="M188 341 L421 341 L445 594 L357 716 L305 688 L253 716 L164 594 Z"/>
      <path class="muscle-zone" d="M256 364 L300 356 L300 428 L246 438 L220 397 Z"/>
      <path class="muscle-zone" d="M354 364 L309 356 L309 428 L363 438 L389 397 Z"/>
      <path class="muscle-zone" d="M246 448 L300 437 L300 519 L240 536 L204 486 Z"/>
      <path class="muscle-zone" d="M364 448 L309 437 L309 519 L369 536 L405 486 Z"/>
      <path class="muscle-zone" d="M244 548 L300 528 L300 646 L255 681 L211 611 Z"/>
      <path class="muscle-zone" d="M366 548 L309 528 L309 646 L354 681 L398 611 Z"/>
      <path class="muscle-zone" d="M194 356 C230 401 226 507 183 587 C167 512 167 424 194 356 Z"/>
      <path class="muscle-zone" d="M416 356 C380 401 384 507 427 587 C443 512 443 424 416 356 Z"/>
    </g>

    <g data-muscle="手臂" class="muscle-group ${hot("手臂")}">
      <path class="muscle-hit" d="M54 286 L202 327 L169 535 L123 628 L92 760 L42 815 L17 650 L45 455 Z M555 286 L407 327 L440 535 L486 628 L517 760 L567 815 L592 650 L564 455 Z"/>
      <path class="muscle-zone" d="M78 313 C124 317 166 337 188 374 C166 422 129 470 91 502 C68 444 63 367 78 313 Z"/>
      <path class="muscle-zone" d="M531 313 C485 317 443 337 421 374 C443 422 480 470 518 502 C541 444 546 367 531 313 Z"/>
      <path class="muscle-zone" d="M103 506 C132 538 135 611 103 704 C78 683 57 647 48 604 C59 564 75 531 103 506 Z"/>
      <path class="muscle-zone" d="M506 506 C477 538 474 611 506 704 C531 683 552 647 561 604 C550 564 534 531 506 506 Z"/>
      <path class="muscle-zone" d="M38 650 C63 684 79 729 81 781 L44 817 C27 770 22 710 38 650 Z"/>
      <path class="muscle-zone" d="M571 650 C546 684 530 729 528 781 L565 817 C582 770 587 710 571 650 Z"/>
    </g>

    <g data-muscle="腿部" class="muscle-group ${hot("腿部")}">
      <path class="muscle-hit" d="M162 604 L301 682 L286 1014 L230 1076 L163 1044 L158 856 Z M447 604 L308 682 L323 1014 L379 1076 L446 1044 L451 856 Z"/>
      <path class="muscle-zone" d="M174 631 C226 663 267 695 294 733 L273 861 L202 825 C175 755 164 686 174 631 Z"/>
      <path class="muscle-zone" d="M435 631 C383 663 342 695 315 733 L336 861 L407 825 C434 755 445 686 435 631 Z"/>
      <path class="muscle-zone" d="M207 846 C236 871 255 913 260 978 L225 1062 L178 1036 L167 953 Z"/>
      <path class="muscle-zone" d="M402 846 C373 871 354 913 349 978 L384 1062 L431 1036 L442 953 Z"/>
      <path class="muscle-zone" d="M264 711 C286 760 294 856 283 984 L241 1017 C250 883 246 790 264 711 Z"/>
      <path class="muscle-zone" d="M345 711 C323 760 315 856 326 984 L368 1017 C359 883 363 790 345 711 Z"/>
    </g>
  `;
}

function backMuscles(hot) {
  return `
    <g data-muscle="有氧" class="cardio-group ${hot("有氧")}">
      <rect class="cardio-hit" x="626" y="110" width="530" height="930" rx="180"/>
      <path class="cardio-zone" d="M760 352 L829 352 L859 307 L912 408 L952 329 L985 352 L1057 352"/>
      <path class="cardio-zone" d="M793 590 C843 650 944 650 995 590"/>
    </g>

    <g data-muscle="肩部" class="muscle-group ${hot("肩部")}">
      <path class="muscle-hit" d="M674 176 C736 133 811 142 860 184 L842 306 L746 340 L660 294 Z M1116 176 C1054 133 979 142 930 184 L948 306 L1044 340 L1130 294 Z"/>
      <path class="muscle-zone" d="M693 207 C738 172 808 169 852 193 C843 242 809 287 754 309 C721 304 692 276 674 244 Z"/>
      <path class="muscle-zone" d="M1097 207 C1052 172 982 169 938 193 C947 242 981 287 1036 309 C1069 304 1098 276 1116 244 Z"/>
      <path class="muscle-zone" d="M724 245 C760 224 800 216 842 214 C829 254 799 286 760 300 C743 290 730 272 724 245 Z"/>
      <path class="muscle-zone" d="M1066 245 C1030 224 990 216 948 214 C961 254 991 286 1030 300 C1047 290 1060 272 1066 245 Z"/>
    </g>

    <g data-muscle="背部" class="muscle-group ${hot("背部")}">
      <path class="muscle-hit" d="M742 112 L895 72 L1048 112 L1110 292 L1055 575 L895 676 L735 575 L680 292 Z"/>
      <path class="muscle-zone" d="M794 122 C830 101 866 86 895 78 C924 86 960 101 996 122 L951 357 L895 471 L839 357 Z"/>
      <path class="muscle-zone" d="M720 251 C766 282 810 350 848 456 L736 574 C699 482 677 361 720 251 Z"/>
      <path class="muscle-zone" d="M1070 251 C1024 282 980 350 942 456 L1054 574 C1091 482 1113 361 1070 251 Z"/>
      <path class="muscle-zone" d="M841 369 L895 485 L888 648 L742 575 C782 512 815 444 841 369 Z"/>
      <path class="muscle-zone" d="M949 369 L895 485 L902 648 L1048 575 C1008 512 975 444 949 369 Z"/>
      <path class="muscle-zone" d="M781 197 L838 127 L838 320 L758 293 Z"/>
      <path class="muscle-zone" d="M1009 197 L952 127 L952 320 L1032 293 Z"/>
    </g>

    <g data-muscle="核心" class="muscle-group ${hot("核心")}">
      <path class="muscle-hit" d="M735 560 C797 511 862 524 895 573 C928 524 993 511 1055 560 L1040 725 L895 790 L750 725 Z"/>
      <path class="muscle-zone" d="M759 577 C801 540 861 548 892 592 L864 719 L748 711 C732 654 733 610 759 577 Z"/>
      <path class="muscle-zone" d="M1031 577 C989 540 929 548 898 592 L926 719 L1042 711 C1058 654 1057 610 1031 577 Z"/>
      <path class="muscle-zone" d="M792 720 L892 731 L888 790 L752 724 Z"/>
      <path class="muscle-zone" d="M998 720 L898 731 L902 790 L1038 724 Z"/>
    </g>

    <g data-muscle="手臂" class="muscle-group ${hot("手臂")}">
      <path class="muscle-hit" d="M651 286 L795 327 L765 535 L719 628 L690 760 L641 815 L616 650 L643 455 Z M1139 286 L995 327 L1025 535 L1071 628 L1100 760 L1149 815 L1174 650 L1147 455 Z"/>
      <path class="muscle-zone" d="M676 313 C722 317 762 336 786 374 C762 423 726 472 688 503 C665 443 660 368 676 313 Z"/>
      <path class="muscle-zone" d="M1114 313 C1068 317 1028 336 1004 374 C1028 423 1064 472 1102 503 C1125 443 1130 368 1114 313 Z"/>
      <path class="muscle-zone" d="M700 506 C730 538 732 611 700 704 C675 683 654 647 645 604 C656 564 673 531 700 506 Z"/>
      <path class="muscle-zone" d="M1090 506 C1060 538 1058 611 1090 704 C1115 683 1136 647 1145 604 C1134 564 1117 531 1090 506 Z"/>
      <path class="muscle-zone" d="M635 650 C660 684 676 729 678 781 L641 817 C624 770 619 710 635 650 Z"/>
      <path class="muscle-zone" d="M1155 650 C1130 684 1114 729 1112 781 L1149 817 C1166 770 1171 710 1155 650 Z"/>
    </g>

    <g data-muscle="腿部" class="muscle-group ${hot("腿部")}">
      <path class="muscle-hit" d="M742 716 L888 790 L867 1014 L811 1076 L744 1044 L740 856 Z M1048 716 L902 790 L923 1014 L979 1076 L1046 1044 L1050 856 Z"/>
      <path class="muscle-zone" d="M756 735 C806 758 849 785 882 821 L854 1005 L793 1061 L746 1037 L741 864 Z"/>
      <path class="muscle-zone" d="M1034 735 C984 758 941 785 908 821 L936 1005 L997 1061 L1044 1037 L1049 864 Z"/>
      <path class="muscle-zone" d="M816 782 C849 827 864 900 855 1000 L812 1059 C802 946 794 856 816 782 Z"/>
      <path class="muscle-zone" d="M974 782 C941 827 926 900 935 1000 L978 1059 C988 946 996 856 974 782 Z"/>
      <path class="muscle-zone" d="M760 845 C794 886 807 946 799 1028 L747 1042 L739 936 Z"/>
      <path class="muscle-zone" d="M1030 845 C996 886 983 946 991 1028 L1043 1042 L1051 936 Z"/>
    </g>
  `;
}

function recordForm() {
  const record = state.records.find((item) => item.id === state.editingId) || null;
  const primaryPart = record ? record.part : (state.selectedPart || state.selectedParts[0] || "胸部");
  const actions = asArray(actionsByPart[primaryPart]);
  const draft = record || { id: "", date: today(), part: primaryPart, action: actions[0] || "", weight: "", reps: "", sets: "", note: "" };
  const selectedAction = actions.includes(draft.action) ? draft.action : (actions[0] || "");
  return `
    <form id="recordForm" class="form-grid">
      <input type="hidden" name="id" value="${escapeAttr(draft.id)}">
      <div class="field full"><label>日期</label><input name="date" type="date" value="${escapeAttr(draft.date)}" required></div>
      <div class="field"><label>主要部位</label><select name="part">${bodyParts.map((part) => `<option ${part === draft.part ? "selected" : ""}>${escapeHtml(part)}</option>`).join("")}</select></div>
      <div class="field"><label>动作</label><select name="action" required>${actions.map((action) => `<option value="${escapeAttr(action)}" ${action === selectedAction ? "selected" : ""}>${escapeHtml(action)}</option>`).join("")}</select></div>
      <div class="field"><label>重量 kg</label><input name="weight" type="number" min="0" step="0.5" placeholder="60" value="${escapeAttr(draft.weight)}"></div>
      <div class="field"><label>次数</label><input name="reps" type="number" min="0" placeholder="12" value="${escapeAttr(draft.reps)}"></div>
      <div class="field"><label>组数</label><input name="sets" type="number" min="0" placeholder="4" value="${escapeAttr(draft.sets)}"></div>
      <div class="field full"><label>备注 / 练后评价</label><textarea name="note" maxlength="240" placeholder="动作感受、疼痛、下次调整点...">${escapeHtml(draft.note || "")}</textarea></div>
      <div class="actions">
        <button type="button" class="btn ghost" data-reset-form>${record ? "取消编辑" : "清空"}</button>
        <button class="btn primary">${record ? "保存修改" : "保存本组"}</button>
      </div>
    </form>
  `;
}

function summary(list) {
  const stats = summaryStats(list);
  return `<div class="summary-grid">
    <div class="stat"><span class="muted">记录</span><strong>${stats.count}</strong></div>
    <div class="stat"><span class="muted">总重量</span><strong>${stats.volume}</strong><small> kg</small></div>
    <div class="stat"><span class="muted">总组数</span><strong>${stats.sets}</strong></div>
    <div class="stat"><span class="muted">总次数</span><strong>${stats.reps}</strong></div>
    <div class="stat"><span class="muted">估算消耗</span><strong>${stats.kcal}</strong><small> kcal</small></div>
  </div>`;
}

function recordsTable(list) {
  if (!list.length) return `<p class="muted empty">暂无记录。</p>`;
  return `
    <div class="table-wrap">
      <table class="table">
        <thead><tr><th>日期</th><th>部位</th><th>动作</th><th>重量</th><th>次数/组</th><th>操作</th></tr></thead>
        <tbody>${list.map((record) => `<tr>
          <td>${escapeHtml(record.date)}</td>
          <td>${escapeHtml(partsText(record))}</td>
          <td>${escapeHtml(record.action)}</td>
          <td>${record.weight || "-"}kg</td>
          <td>${record.reps || "-"} x ${record.sets || "-"}</td>
          <td><span class="row-actions">${recordActions(record)}</span></td>
        </tr>`).join("")}</tbody>
      </table>
    </div>
    <div class="record-cards">${list.map(recordCard).join("")}</div>
  `;
}

function recordCard(record) {
  return `<article class="record-card">
    <div><strong>${escapeHtml(record.action)}</strong><span>${escapeHtml(partsText(record))} · ${escapeHtml(record.date)}</span></div>
    <p>${record.weight || "-"}kg · ${record.reps || "-"} 次 · ${record.sets || "-"} 组</p>
    <div class="row-actions">${recordActions(record)}</div>
  </article>`;
}

function recordActions(record) {
  return `
    <button class="mini" data-edit="${escapeAttr(record.id)}">改</button>
    <button class="mini" data-copy-post="${escapeAttr(record.id)}" data-post-visibility="private">私复盘</button>
    <button class="mini" data-copy-post="${escapeAttr(record.id)}" data-post-visibility="friends">友复盘</button>
    <button class="mini danger" data-delete-record="${escapeAttr(record.id)}">删</button>
  `;
}

function dataPage() {
  const part = state.selectedChartPart;
  const partRecords = state.records.filter((record) => record.part === part);
  const actionOptions = ["全部", ...new Set(partRecords.map((record) => record.action).filter(Boolean))];
  const filtered = partRecords.filter((record) => state.selectedActionFilter === "全部" || record.action === state.selectedActionFilter);
  return `
    <section class="page ${state.activePage === "data" ? "active" : ""}">
      <div class="two-col">
        <div class="panel">
          ${sectionTitle("你的进步", "按部位和动作查看力量变化。")}
          <div class="cards">
            <div class="data-card"><span class="muted">身高</span><h2>${state.profile.height || "-"} cm</h2></div>
            <div class="data-card"><span class="muted">当前体重</span><h2>${state.profile.weight || "-"} kg</h2></div>
            <div class="data-card"><span class="muted">目标体重</span><h2>${state.profile.targetWeight || "-"} kg</h2></div>
          </div>
          <h3>部位</h3>
          <div class="chips">${bodyParts.map((item) => `<button class="chip ${item === part ? "active" : ""}" data-chart-part="${escapeAttr(item)}">${escapeHtml(item)}</button>`).join("")}</div>
          <h3>动作</h3>
          <div class="chips">${actionOptions.map((item) => `<button class="chip ${item === state.selectedActionFilter ? "active" : ""}" data-action-filter="${escapeAttr(item)}">${escapeHtml(item)}</button>`).join("")}</div>
          <h3>${escapeHtml(part)}力量变化</h3>
          <div class="chart-wrap">${chart(filtered)}</div>
          <h3>体重变化</h3>
          <div class="chart-wrap">${weightChart()}</div>
        </div>
        <div class="panel">
          ${sectionTitle("训练明细", `${filtered.length} 条记录`)}
          ${summary(filtered)}
          ${recordsTable(filtered)}
        </div>
      </div>
    </section>
  `;
}

function chart(list) {
  const sorted = list.slice().sort((a, b) => a.date.localeCompare(b.date));
  const points = sorted.map(recordVolume);
  if (!points.length) return `<p class="muted empty">这个筛选还没有数据。新增训练后会自动生成曲线。</p>`;
  return lineChart(points, sorted.map((record) => record.date.slice(5)), "var(--accent)");
}

function weightChart() {
  const logs = state.bodyLogs.slice().sort((a, b) => a.date.localeCompare(b.date));
  if (logs.length < 2) return `<p class="muted empty">至少记录两次体重后会显示曲线。</p>`;
  return lineChart(logs.map((log) => log.weight), logs.map((log) => log.date.slice(5)), "var(--info)");
}

function lineChart(values, labels, color) {
  const w = 720, h = 240, pad = 30;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(1, max - min);
  const xy = values.map((value, index) => {
    const x = pad + (index * (w - pad * 2)) / Math.max(values.length - 1, 1);
    const y = h - pad - ((value - min) / span) * (h - pad * 2);
    return [x, y, value, labels[index]];
  });
  const d = xy.map((point, index) => `${index ? "L" : "M"}${point[0]},${point[1]}`).join(" ");
  return `<svg class="chart" viewBox="0 0 ${w} ${h}">
    ${[0, 1, 2, 3].map((index) => `<line x1="20" x2="${w - 20}" y1="${pad + index * 55}" y2="${pad + index * 55}" class="grid-line"/>`).join("")}
    <path d="${d}" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
    ${xy.map((point) => `<circle cx="${point[0]}" cy="${point[1]}" r="5" fill="${color}"/><text x="${point[0]}" y="${point[1] - 12}" class="chart-label" text-anchor="middle">${point[2]}</text>`).join("")}
  </svg>`;
}

function planPage() {
  const todayKcal = state.foods.filter((food) => food.date === today()).reduce((sum, food) => sum + food.kcal, 0);
  const protein = state.foods.filter((food) => food.date === today()).reduce((sum, food) => sum + food.protein, 0);
  return `
    <section class="page ${state.activePage === "plan" ? "active" : ""}">
      <div class="two-col">
        <div class="panel">
          ${sectionTitle("这周怎么练", state.goal === "减脂" ? "减脂期建议保留力量训练，同时安排有氧。" : "增肌期建议优先主项容量和渐进超负荷。")}
          <form id="planForm" class="form-grid">
            <div class="field"><label>星期</label><select name="day">${daysOfWeek.map((day) => `<option>${day}</option>`).join("")}</select></div>
            <div class="field"><label>计划名称</label><input name="title" placeholder="如：胸 + 三头" required></div>
            <div class="field full"><label>训练安排备注</label><textarea name="detail" placeholder="记录训练顺序、组数或注意事项"></textarea></div>
            <button class="btn primary field full">添加计划</button>
          </form>
          <div class="list">${state.plans.map((plan) => `<div class="plan-item"><strong>${escapeHtml(plan.day)}</strong><h3>${escapeHtml(plan.title)}</h3><p class="muted">${escapeHtml(plan.detail)}</p><small>${escapeHtml(plan.goal || state.goal)}计划</small></div>`).join("") || `<p class="muted empty">还没有训练计划。</p>`}</div>
        </div>
        <div class="panel">
          ${sectionTitle("饮食与体重", state.goal === "减脂" ? "关注热量摄入和体重趋势。" : "关注蛋白质和体重稳定增长。")}
          <div class="dashboard-strip small">
            ${statusTile("今日摄入", `${todayKcal}`, "kcal")}
            ${statusTile("蛋白质", `${protein}`, "g")}
          </div>
          <div class="panel-action-row">
            <span>常见食物热量、蛋白质和三大营养素估算。</span>
            <button class="btn ghost" type="button" data-open-calorie-reference>热量参考</button>
          </div>
          <form id="foodForm" class="form-grid">
            <div class="field"><label>食物</label><input name="name" placeholder="如：鸡胸肉饭" required></div>
            <div class="field"><label>热量 kcal</label><input name="kcal" type="number" min="0" placeholder="520" required></div>
            <div class="field"><label>蛋白质 g</label><input name="protein" type="number" min="0" placeholder="35"></div>
            <button class="btn primary field full">记录饮食</button>
          </form>
          <form id="weightForm" class="form-grid">
            <div class="field"><label>今日体重 kg</label><input name="weight" type="number" step="0.1" value="${state.profile.weight || ""}" required></div>
            <div class="field"><label>体脂率 %</label><input name="fat" type="number" step="0.1" value="${state.profile.fat || ""}"></div>
            <button class="btn ghost field">保存体重</button>
          </form>
          <div class="list">${state.foods.slice(0, 8).map((food) => `<div class="plan-item row"><strong>${escapeHtml(food.date)}</strong><span>${escapeHtml(food.name)}</span><span>${food.kcal} kcal · ${food.protein || 0}g 蛋白</span></div>`).join("") || `<p class="muted empty">今天还没有饮食记录。</p>`}</div>
        </div>
      </div>
    </section>
  `;
}

function feedPage() {
  const grouped = groupPostsByDate();
  const selectedDate = state.selectedPostDate || grouped[0]?.date || today();
  const selectedPosts = filteredDiaryPosts(selectedDate);
  const myPosts = selectedPosts.filter(isMinePost);
  const friendPosts = selectedPosts.filter((post) => !isMinePost(post));
  const ownDayPosts = state.posts.filter((post) => post.date === selectedDate);
  const dayRecords = state.records.filter((record) => record.date === selectedDate);
  const selectedSummary = grouped.find((day) => day.date === selectedDate);
  const editingPost = state.posts.find((post) => post.id === state.editingPostId);
  const allDayPosts = [...state.posts, ...state.friendPosts].filter((post) => post.date === selectedDate);
  const reviewDurationLine = trainingDurationReviewLine();
  return `
    <section class="page ${state.activePage === "feed" ? "active" : ""}">
      <div class="feed-grid">
        <div class="panel">
          ${sectionTitle("记下今天的状态", "新复盘默认发布到今天；历史复盘可在详情中编辑。")}
          <form id="postForm" class="form-grid">
            <div class="field"><label>标题</label><input name="title" placeholder="如：今天练胸完成" required></div>
            <div class="field"><label>感受</label><select name="mood"><option>很满意</option><option>一般</option><option>有点累</option><option>需要调整</option></select></div>
            <div class="field"><label>可见性</label><select name="visibility">${visibilityOptions.map((value) => `<option value="${value}">${visibilityText[value]}</option>`).join("")}</select></div>
            <div class="field full"><label>练后评价</label><textarea name="text" placeholder="训练体验、动作感受、下次改进点..." required>${escapeHtml(reviewDurationLine ? `${reviewDurationLine}\n` : "")}</textarea></div>
            <button class="btn primary field full">发布复盘</button>
          </form>
          ${postEditPanel(editingPost)}
        </div>
        <div class="panel">
          ${sectionTitle("训练日记", "先选日期，再查看当天复盘和训练明细。")}
          ${grouped.length ? `
            <div class="diary-picker">
              <label for="reviewDateSelect">选择日期</label>
              <select id="reviewDateSelect" name="reviewDate">
                ${grouped.map((day) => `<option value="${escapeAttr(day.date)}" ${day.date === selectedDate ? "selected" : ""}>${escapeHtml(day.date)} · ${day.count} 条复盘 · ${day.recordCount} 条训练</option>`).join("")}
              </select>
            </div>
            <div class="diary-summary">
              <div><strong>${escapeHtml(selectedDate)}</strong><span>${selectedSummary?.moods?.join(" / ") || "未复盘"}</span></div>
              <div><strong>${selectedSummary?.myCount || 0}/${selectedSummary?.friendCount || 0}</strong><span>我的/好友</span></div>
              <div><strong>${selectedSummary?.recordCount || 0}</strong><span>训练</span></div>
            </div>
          ` : `<p class="muted empty">暂无训练日记。发布复盘或保存训练后，这里会出现日期选择。</p>`}
        </div>
        <div class="panel review-detail">
          ${sectionTitle(`${selectedDate} 详情`, "按来源筛选复盘，训练明细始终保留。")}
          ${allDayPosts.length ? `
            <div class="diary-filter-grid">
              <div class="field">
                <label>复盘来源</label>
                <select id="diaryPostFilter">
                  <option value="all" ${state.diaryPostFilter === "all" ? "selected" : ""}>全部复盘</option>
                  <option value="mine" ${state.diaryPostFilter === "mine" ? "selected" : ""}>只看我的</option>
                  <option value="friends" ${state.diaryPostFilter === "friends" ? "selected" : ""}>只看好友</option>
                </select>
              </div>
              <div class="field">
                <label>好友</label>
                <select id="diaryFriendFilter" ${state.diaryPostFilter === "mine" ? "disabled" : ""}>
                  <option value="all" ${state.diaryFriendId === "all" ? "selected" : ""}>全部好友</option>
                  ${diaryFriendOptions(allDayPosts)}
                </select>
              </div>
              <button class="btn ghost" type="button" data-clear-diary-filter>清空筛选</button>
            </div>
          ` : ""}
          ${dayRecords.length && !ownDayPosts.length ? `
            <div class="review-helper">
              <div>
                <strong>这一天有 ${dayRecords.length} 条训练记录，还没写自己的复盘</strong>
                <span>自动带入当天训练概要，再继续补充主观感受。</span>
              </div>
              <label>
                <span>可见性</span>
                <select id="dayReviewVisibility">
                  ${visibilityOptions.map((value) => `<option value="${value}">${visibilityText[value]}</option>`).join("")}
                </select>
              </label>
              <button class="btn primary" type="button" data-generate-day-review="${escapeAttr(selectedDate)}">补写复盘</button>
            </div>
          ` : ""}
          <div class="detail-section">
            <h3>我的复盘</h3>
            <div class="list compact-list">${myPosts.map(postCard).join("") || `<p class="muted empty">当前筛选下没有我的复盘。</p>`}</div>
          </div>
          <div class="detail-section">
            <h3>好友复盘</h3>
            <div class="list compact-list">${friendPosts.map(postCard).join("") || `<p class="muted empty">当前筛选下没有好友复盘。</p>`}</div>
          </div>
          <div class="detail-section">
            <h3>具体训练内容</h3>
            ${recordsTable(dayRecords)}
          </div>
          ${trainingPartGuides(dayRecords)}
        </div>
      </div>
    </section>
  `;
}

function groupPostsByDate() {
  const allPosts = [...state.posts, ...state.friendPosts];
  const dates = [...new Set([...allPosts.map((post) => post.date), ...state.records.map((record) => record.date)])].sort().reverse();
  return dates.map((date) => {
    const posts = allPosts.filter((post) => post.date === date);
    const myPosts = posts.filter(isMinePost);
    const friendPosts = posts.filter((post) => !isMinePost(post));
    const records = state.records.filter((record) => record.date === date);
    return {
      date,
      count: posts.length,
      myCount: myPosts.length,
      friendCount: friendPosts.length,
      recordCount: records.length,
      moods: [...new Set(posts.map((post) => post.mood))].filter(Boolean),
    };
  });
}

function friendNameById(id) {
  const friend = state.friends.find((item) => (item.userId || item.id) === id);
  return friend?.name || "";
}

function isMinePost(post) {
  return !post.authorId || post.authorId === state.auth.userId;
}

function diaryFriendOptions(posts = []) {
  const friendIds = [...new Set(posts.filter((post) => !isMinePost(post)).map((post) => post.authorId).filter(Boolean))];
  return friendIds.map((id) => `<option value="${escapeAttr(id)}" ${state.diaryFriendId === id ? "selected" : ""}>${escapeHtml(friendNameById(id) || posts.find((post) => post.authorId === id)?.authorName || "训练好友")}</option>`).join("");
}

function filteredDiaryPosts(date) {
  const posts = [...state.posts, ...state.friendPosts].filter((post) => post.date === date).sort(sortByDateDesc);
  return posts.filter((post) => {
    const mine = isMinePost(post);
    if (state.diaryPostFilter === "mine" && !mine) return false;
    if (state.diaryPostFilter === "friends" && mine) return false;
    if (!mine && state.diaryFriendId !== "all" && post.authorId !== state.diaryFriendId) return false;
    return true;
  });
}

function trainingPartGuides(records) {
  const parts = [...new Set(records.flatMap(getRecordParts))].filter((part) => bodyPartSet.has(part));
  if (!parts.length) return "";
  return `
    <div class="detail-section training-part-guides">
      <div class="part-guide-heading">
        <h3>当天训练部位</h3>
        <span>结合训练明细查看部位重点，复盘动作质量和恢复情况。</span>
      </div>
      <div class="part-guide-list">
        ${parts.map((part) => trainingPartGuideCard(part)).join("")}
      </div>
    </div>
  `;
}

function trainingPartGuideCard(part) {
  const source = partGuides?.[part];
  const guide = typeof source === "string" ? { description: source } : (isObject(source) ? source : {});
  const description = sanitizeText(
    guide.text || guide.description || guide.introduction || guide.summary || guide.overview || guide.focus || "",
    360,
  );
  const tips = [
    ...asArray(guide.reviewTips),
    ...asArray(guide.tips),
    ...asArray(guide.reviewPoints),
    ...asArray(guide.checkpoints),
    ...asArray(guide.cues),
  ].map((tip) => sanitizeText(isObject(tip) ? (tip.text || tip.label || tip.title) : tip, 160)).filter(Boolean).slice(0, 4);
  const fallback = fitnessKnowledge.find((item) => item.part === part)?.text || "复盘当天动作控制、目标部位发力、疼痛情况和下次调整点。";
  return `
    <article class="part-guide-card">
      <div>
        <span>${escapeHtml(part)}</span>
        <h4>${escapeHtml(sanitizeText(guide.title || `${part}训练要点`, 80))}</h4>
      </div>
      <p>${escapeHtml(description || fallback)}</p>
      ${tips.length ? `<ul>${tips.map((tip) => `<li>${escapeHtml(tip)}</li>`).join("")}</ul>` : ""}
    </article>
  `;
}

function postEditPanel(post) {
  if (!post) return "";
  return `
    <div class="edit-panel">
      ${sectionTitle("编辑复盘", `${post.date} · 可修改内容和可见性。`)}
      <form id="postEditForm" class="form-grid">
        <input type="hidden" name="id" value="${escapeAttr(post.id)}">
        <div class="field"><label>日期</label><input name="date" type="date" value="${escapeAttr(post.date)}" required></div>
        <div class="field"><label>感受</label><select name="mood">${["很满意", "一般", "有点累", "需要调整"].map((mood) => `<option ${post.mood === mood ? "selected" : ""}>${escapeHtml(mood)}</option>`).join("")}</select></div>
        <div class="field"><label>可见性</label><select name="visibility">${visibilityOptions.map((value) => `<option value="${value}" ${post.visibility === value ? "selected" : ""}>${visibilityText[value]}</option>`).join("")}</select></div>
        <div class="field full"><label>标题</label><input name="title" value="${escapeAttr(post.title)}" required></div>
        <div class="field full"><label>练后评价</label><textarea name="text" required>${escapeHtml(post.text)}</textarea></div>
        <div class="actions">
          <button class="btn primary">保存修改</button>
          <button class="btn ghost" type="button" data-cancel-post-edit>取消编辑</button>
        </div>
      </form>
    </div>
  `;
}

function filteredFriendPosts() {
  const selectedFriend = state.friendPostFriendId || "all";
  const selectedDate = state.friendPostDate || "";
  const range = state.friendPostRange || "all";
  const now = parseDateValue(today());
  return state.friendPosts.filter((post) => {
    if (selectedFriend !== "all" && post.authorId !== selectedFriend) return false;
    if (selectedDate && post.date !== selectedDate) return false;
    if (range !== "all") {
      if (range === "today") return post.date === today();
      const days = Number(range);
      const postDate = parseDateValue(post.date);
      if (!postDate || !now) return false;
      const diff = Math.floor((now.getTime() - postDate.getTime()) / dayMs);
      if (diff < 0 || diff >= days) return false;
    }
    return true;
  }).sort(sortByDateDesc);
}

function postCard(post) {
  const isMine = isMinePost(post);
  const author = isMine ? "我" : (post.authorName || "训练好友");
  return `<article class="post">
    <div class="post-head">
      <span>${escapeHtml(author)} · ${escapeHtml(post.date)}</span>
      <span>${escapeHtml(visibilityText[post.visibility])}</span>
    </div>
    <h3>${escapeHtml(post.title)}</h3>
    <p>${escapeHtml(post.text)}</p>
    <small>${escapeHtml(post.mood)}</small>
    ${isMine ? `<div class="row-actions"><button class="mini" data-edit-post="${escapeAttr(post.id)}">编辑</button><button class="mini danger" data-delete-post="${escapeAttr(post.id)}">删</button></div>` : ""}
  </article>`;
}

function friendsPage() {
  const friendPostCount = state.friendPosts.length;
  const visibleFriendPosts = filteredFriendPosts();
  const friendOptions = state.friends.map((friend) => {
    const id = friend.userId || friend.id;
    return `<option value="${escapeAttr(id)}" ${state.friendPostFriendId === id ? "selected" : ""}>${escapeHtml(friend.name)}</option>`;
  }).join("");
  return `
    <section class="page ${state.activePage === "friends" ? "active" : ""}">
      <div class="friends-layout">
        <div class="panel">
          ${sectionTitle("好友管理", "用昵称搜索，或输入 UID 精确添加。")}
          <form id="friendForm" class="form-grid">
            <div class="field full"><label>搜索好友</label><input name="name" value="${escapeAttr(state.friendSearchQuery)}" placeholder="输入昵称或 UID，如 L8F3A2C"></div>
            <button class="btn ghost field full">搜索好友</button>
          </form>
          <div class="friend-section">
            <h3>搜索结果</h3>
            <div class="list">
              ${state.friendSearchResults.map((friend) => `
                <div class="plan-item row">
                  <strong>${escapeHtml(friend.name)}${friendCodeBadge(friend.friendCode)}</strong>
                  <span>${escapeHtml(friend.status)}</span>
                  <button class="mini" data-send-friend-request="${escapeAttr(friend.id)}" ${friend.status === "可添加" ? "" : "disabled"}>申请</button>
                </div>
              `).join("") || `<p class="muted empty">输入昵称或 UID 后搜索可添加的人。</p>`}
            </div>
          </div>
        </div>
        <div class="panel">
          ${sectionTitle("好友列表", `${state.friends.length} 位好友 · ${state.friendRequests.length} 条待处理`)}
          <div class="friend-section">
            <h3>好友申请</h3>
            <div class="list">
              ${state.friendRequests.map((request) => `
                <div class="plan-item row">
                  <strong>${escapeHtml(request.name)}${friendCodeBadge(request.friendCode)}</strong>
                  <span>${escapeHtml(request.status)}</span>
                  <div class="row-actions">
                    ${request.direction === "incoming" ? `<button class="mini" data-accept-friend-request="${escapeAttr(request.id)}">同意</button><button class="mini danger" data-reject-friend-request="${escapeAttr(request.id)}">拒绝</button>` : `<button class="mini" data-cancel-friend-request="${escapeAttr(request.id)}">取消</button>`}
                  </div>
                </div>
              `).join("") || `<p class="muted empty">暂无待处理好友申请。</p>`}
            </div>
          </div>
          <div class="friend-section">
            <h3>我的好友</h3>
            <div class="list">${state.friends.map((friend) => `
              <div class="plan-item row">
                <strong>${escapeHtml(friend.name)}${friendCodeBadge(friend.friendCode)}</strong>
                <span>${escapeHtml(friend.status)}</span>
                <button class="mini danger" data-remove-friend="${escapeAttr(friend.userId || friend.id)}">删除</button>
              </div>
            `).join("") || `<p class="muted empty">还没有好友。</p>`}</div>
          </div>
        </div>
        <div class="panel review-detail">
          ${sectionTitle("好友动态筛选", "单独查看好友开放的历史复盘。")}
          <div class="dashboard-strip small">
            <div class="status-tile"><span>可见复盘</span><strong>${friendPostCount}</strong><small>已同步</small></div>
            <div class="status-tile"><span>好友人数</span><strong>${state.friends.length}</strong><small>当前账号</small></div>
            <div class="status-tile"><span>筛选结果</span><strong>${visibleFriendPosts.length}</strong><small>条复盘</small></div>
          </div>
          <div class="friend-filter-grid">
            <div class="field">
              <label>好友</label>
              <select id="friendPostFriendFilter">
                <option value="all" ${state.friendPostFriendId === "all" ? "selected" : ""}>全部好友</option>
                ${friendOptions}
              </select>
            </div>
            <div class="field">
              <label>指定日期</label>
              <input id="friendPostDateFilter" type="date" value="${escapeAttr(state.friendPostDate)}">
            </div>
            <div class="field">
              <label>时间范围</label>
              <select id="friendPostRangeFilter">
                <option value="all" ${state.friendPostRange === "all" ? "selected" : ""}>全部时间</option>
                <option value="today" ${state.friendPostRange === "today" ? "selected" : ""}>今天</option>
                <option value="7" ${state.friendPostRange === "7" ? "selected" : ""}>近 7 天</option>
                <option value="30" ${state.friendPostRange === "30" ? "selected" : ""}>近 30 天</option>
              </select>
            </div>
            <button class="btn ghost" type="button" data-clear-friend-post-filter>清空筛选</button>
          </div>
          <div class="list">
            ${visibleFriendPosts.map((post) => postCard({ ...post, authorName: post.authorName || friendNameById(post.authorId) || "训练好友" })).join("") || `<p class="muted empty">当前筛选下没有好友动态。</p>`}
          </div>
        </div>
      </div>
    </section>
  `;
}

function musicPage() {
  return `
    <section class="page ${state.activePage === "music" ? "active" : ""}">
      <div class="two-col">
        <div class="panel">
          ${sectionTitle("训练音乐", "保存歌单链接，点击后优先交给本机音乐 App 打开。")}
          <form id="playlistForm" class="form-grid">
            <div class="field"><label>平台</label><select name="platform">${musicPlatforms.map((item) => `<option>${escapeHtml(item)}</option>`).join("")}</select></div>
            <div class="field"><label>歌单名称</label><input name="name" placeholder="腿日冲刺歌单" required></div>
            <div class="field full"><label>歌单链接</label><input name="url" type="url" placeholder="https://..." required></div>
            <button class="btn primary field full">保存歌单</button>
          </form>
        </div>
        <div class="panel">
          ${sectionTitle("已保存歌单", "网页端会调用系统打开链接，安卓端后续接 Intent 打开本地 App。")}
          <div class="list">${state.playlists.map((item) => `
            <div class="plan-item playlist">
              <strong>${escapeHtml(item.platform)}</strong>
              <h3>${escapeHtml(item.name)}</h3>
              <div class="playlist-actions">
                <button class="btn ghost" type="button" data-open-playlist="${escapeAttr(item.id)}">用外部 App 打开</button>
                <button class="btn danger" type="button" data-request-playlist-delete="${escapeAttr(item.id)}">删除</button>
              </div>
            </div>
          `).join("") || `<p class="muted empty">还没有保存歌单链接。</p>`}</div>
        </div>
      </div>
    </section>
  `;
}

function mePage() {
  const supabase = getSupabaseStatus();
  const syncText = state.cloud.lastError
    ? `云同步异常：${state.cloud.lastError}`
    : state.cloud.lastSyncAt
      ? `上次云同步：${new Date(state.cloud.lastSyncAt).toLocaleString()}`
      : "登录后资料、训练、体重、计划、饮食和复盘会自动同步到 Supabase。";
  return `
    <section class="page ${state.activePage === "me" ? "active" : ""}">
      <div class="profile">
        <div class="panel">
          <div class="big-avatar">${avatarContent("large")}</div>
          <h2>${escapeHtml(state.profile.name)}</h2>
          <p class="muted">${state.auth.loggedIn ? `已登录：${escapeHtml(state.auth.email)}` : "本地访客模式"} · Lv.${state.profile.level} · ${state.goal}</p>
          <p class="friend-code-line">UID <b>${escapeHtml(friendCodeText(state.profile.friendCode))}</b></p>
          <p class="muted">${supabase.configured ? "Supabase 配置已检测到，可尝试邮箱登录。" : "请先在 .env 配置 Supabase URL 和 anon key。"}</p>
          <p class="muted">${escapeHtml(syncText)}</p>
          <label class="btn ghost avatar-upload ${state.auth.loggedIn ? "" : "disabled"}">
            更换头像
            <input id="avatarInput" type="file" accept="image/png,image/jpeg,image/webp,image/gif" ${state.auth.loggedIn ? "" : "disabled"}>
          </label>
          <div class="version-strip">
            <div>
              <strong>版本检测</strong>
              <small>当前版本 v${escapeHtml(APP_VERSION)}（${APP_VERSION_CODE}）${state.versionCheckedAt ? ` · ${escapeHtml(new Date(state.versionCheckedAt).toLocaleString())}` : ""}</small>
            </div>
            ${state.versionUpdate.available && state.versionUpdate.downloadUrl
              ? `<button class="btn primary" type="button" data-open-version-update>下载新版</button>`
              : `<button class="btn ghost" type="button" data-check-version>${state.versionChecking ? "检查中..." : "检查更新"}</button>`}
          </div>
          ${state.versionStatus ? `<p class="muted">${escapeHtml(state.versionStatus)}</p>` : ""}
        </div>
        <div class="panel">
          ${sectionTitle("邮箱账号", "真实账号由 Supabase Auth 提供；当前不会要求 service_role 密钥。")}
          <form id="authForm" class="form-grid">
            <div class="field full"><label>邮箱</label><input name="email" type="email" value="${escapeAttr(state.auth.email)}" placeholder="you@example.com" autocomplete="email" required></div>
            <div class="field full"><label>密码</label><input name="password" type="password" minlength="6" placeholder="至少 6 位" autocomplete="current-password"></div>
            <div class="actions">
              <button class="btn primary" data-auth-action="login">登录</button>
              <button class="btn ghost" data-auth-action="signup">注册</button>
            </div>
            <button type="button" class="btn danger field full" data-auth-logout ${state.auth.loggedIn ? "" : "disabled"}>退出登录</button>
          </form>
        </div>
        <div class="panel">
          ${sectionTitle("基本资料", "这些数据属于个人健康信息，请谨慎分享。")}
          <form id="profileForm" class="form-grid">
            <div class="field"><label>昵称</label><input name="name" value="${escapeAttr(state.profile.name)}" required></div>
            <div class="field"><label>性别</label><select name="gender"><option ${state.profile.gender === "男" ? "selected" : ""}>男</option><option ${state.profile.gender === "女" ? "selected" : ""}>女</option></select></div>
            <div class="field"><label>身高 cm</label><input name="height" type="number" value="${state.profile.height || ""}" required></div>
            <div class="field"><label>体重 kg</label><input name="weight" type="number" step="0.1" value="${state.profile.weight || ""}"></div>
            <div class="field"><label>目标体重 kg</label><input name="targetWeight" type="number" step="0.1" value="${state.profile.targetWeight || ""}"></div>
            <div class="field"><label>体脂率 %</label><input name="fat" type="number" step="0.1" value="${state.profile.fat || ""}"></div>
            <label class="check-row field full"><input name="searchable" type="checkbox" ${state.profile.searchable ? "checked" : ""}>允许别人通过昵称搜索我；UID 始终可精确添加</label>
            <button class="btn primary field full">保存资料</button>
          </form>
        </div>
        <div class="panel">
          ${sectionTitle("数据安全", "导入覆盖会替换当前本地数据，操作前会二次确认。")}
          <div class="backup-actions">
            <button class="btn ghost" data-export-json>导出 JSON</button>
            <label class="file-button">导入 JSON<input id="importFile" type="file" accept="application/json,.json"></label>
          </div>
          <p class="muted">导出的文件包含训练、饮食、体重和复盘。分享前请确认没有隐私内容。</p>
        </div>
      </div>
    </section>
  `;
}

function utilityModal() {
  if (!state.activeUtilityModal) return "";
  const titleMap = { feedback: "反馈", notices: "通知", sponsor: "支持赞助", version: "版本检测", calories: "热量参考" };
  const contentMap = {
    feedback: feedbackModalContent(),
    notices: noticesModalContent(),
    sponsor: sponsorModalContent(),
    version: versionModalContent(),
    calories: calorieReferenceModalContent(),
  };
  return `
    <div class="modal-scrim" data-close-utility-modal>
      <section class="utility-modal ${state.activeUtilityModal === "calories" ? "calorie-reference-modal" : ""}" role="dialog" aria-modal="true" aria-label="${escapeAttr(titleMap[state.activeUtilityModal] || "窗口")}">
        <div class="modal-head">
          <strong>${escapeHtml(titleMap[state.activeUtilityModal] || "窗口")}</strong>
          <button type="button" class="drawer-close modal-close" data-close-utility-modal aria-label="关闭">×</button>
        </div>
        ${contentMap[state.activeUtilityModal] || ""}
      </section>
    </div>
  `;
}

function timerConfirmModal() {
  if (!["finish", "reset"].includes(state.timerConfirmAction)) return "";
  const isFinish = state.timerConfirmAction === "finish";
  return `
    <div class="modal-scrim confirm-scrim" data-close-timer-confirm>
      <section class="utility-modal confirm-modal" role="dialog" aria-modal="true" aria-label="${isFinish ? "确认结束锻炼" : "确认清零计时"}">
        <div class="modal-head">
          <strong>${isFinish ? "结束本次锻炼？" : "清零本次计时？"}</strong>
          <button type="button" class="drawer-close modal-close" data-close-timer-confirm aria-label="关闭">×</button>
        </div>
        <div class="modal-body confirm-body">
          <p>${isFinish ? "结束后会保存当前训练时长，并自动填入复盘日志。" : "清零后当前计时时长不会保留，已保存到复盘的内容不会被删除。"}</p>
          <div class="confirm-duration">
            <span>当前时长</span>
            <strong>${escapeHtml(formatDuration(currentTrainingSeconds()))}</strong>
          </div>
        </div>
        <div class="modal-actions confirm-actions">
          <button class="btn ghost" type="button" data-close-timer-confirm>取消</button>
          <button class="btn ${isFinish ? "primary" : "danger"}" type="button" data-confirm-timer-action>${isFinish ? "结束锻炼" : "确认清零"}</button>
        </div>
      </section>
    </div>
  `;
}

function playlistDeleteConfirmModal() {
  const playlist = state.playlists.find((item) => item.id === state.playlistDeleteId);
  if (!playlist) return "";
  return `
    <div class="modal-scrim confirm-scrim" data-close-playlist-delete>
      <section class="utility-modal confirm-modal" role="dialog" aria-modal="true" aria-label="确认删除歌单">
        <div class="modal-head">
          <strong>删除这个歌单？</strong>
          <button type="button" class="drawer-close modal-close" data-close-playlist-delete aria-label="关闭">×</button>
        </div>
        <div class="modal-body confirm-body">
          <p>将从已保存歌单中删除“${escapeHtml(playlist.name)}”。原音乐平台中的歌单不会受到影响。</p>
          <div class="confirm-duration playlist-confirm-name">
            <span>${escapeHtml(playlist.platform)}</span>
            <strong>${escapeHtml(playlist.name)}</strong>
          </div>
        </div>
        <div class="modal-actions confirm-actions">
          <button class="btn ghost" type="button" data-close-playlist-delete>取消</button>
          <button class="btn danger" type="button" data-confirm-playlist-delete>确认删除</button>
        </div>
      </section>
    </div>
  `;
}

function feedbackModalContent() {
  const recent = state.feedbackReports.slice(0, 3);
  return `
    <form id="feedbackForm" class="form-grid modal-body">
      <div class="field full">
        <label>反馈类型</label>
        <select name="category">
          <option value="bug">问题报错</option>
          <option value="idea">功能建议</option>
          <option value="content">内容补充</option>
          <option value="other">其他</option>
        </select>
      </div>
      <div class="field full">
        <label>反馈内容</label>
        <textarea name="message" rows="5" placeholder="写清楚你遇到的问题、希望新增的功能，或者哪里不好用。" required></textarea>
      </div>
      <div class="field full">
        <label>联系方式（可选）</label>
        <input name="contact" placeholder="邮箱 / QQ / 微信号，留空也可以">
      </div>
      <label class="check-row field full"><input name="diagnostics" type="checkbox"> 同时发送脱敏诊断信息</label>
      <div class="modal-actions field full">
        <button class="btn primary" ${state.feedbackSubmitting ? "disabled" : ""}>${state.feedbackSubmitting ? "提交中..." : "提交反馈"}</button>
        <button class="btn ghost" type="button" data-close-utility-modal>取消</button>
      </div>
    </form>
    <div class="modal-foot">
      ${recent.length ? `<strong>最近反馈</strong><div class="compact-list">${recent.map((item) => `<p><b>${feedbackStatusText(item.status)}</b> ${escapeHtml(item.message)}</p>`).join("")}</div>` : `<p class="muted">还没有本地反馈记录。</p>`}
    </div>
  `;
}

function noticesModalContent() {
  const notices = visibleAppNotices();
  return `
    <div class="modal-body notice-list">
      ${notices.map((notice) => `
        <article class="notice-item ${state.notificationReadIds.includes(notice.id) ? "" : "unread"}">
          <time>${escapeHtml(notice.date)}</time>
          <h3>${escapeHtml(notice.title)}</h3>
          <p>${escapeHtml(notice.text)}</p>
          ${notice.actionUrl ? `<button class="btn primary" type="button" data-open-version-update>打开下载页</button>` : ""}
        </article>
      `).join("") || `<p class="muted empty">暂无通知。</p>`}
    </div>
    <div class="modal-actions">
      <button class="btn ghost" type="button" data-mark-notices-read>全部标记已读</button>
      <button class="btn primary" type="button" data-close-utility-modal>知道了</button>
    </div>
  `;
}

function sponsorModalContent() {
  return `
    <div class="modal-body">
      <p class="sponsor-note">${escapeHtml(sponsorConfig.note).replace(/\n/g, "<br>")}</p>
      <div class="sponsor-grid">
        ${sponsorConfig.methods.map((method) => `
          <div class="sponsor-method">
            <img class="sponsor-qr" src="${escapeAttr(method.qr)}" alt="${escapeAttr(method.name)}二维码">
            <strong>${escapeHtml(method.name)}</strong>
            <p>${escapeHtml(method.detail)}</p>
            ${method.url ? `<button class="btn ghost" type="button" data-open-sponsor="${escapeAttr(method.url)}">打开</button>` : ""}
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function calorieReferenceModalContent() {
  const categories = foodReferenceCategories();
  const items = filteredFoodReferences();
  const selectedItem = foodReferenceGroups().find((item) => item.id === state.selectedFoodRefId);
  return `
    <div class="modal-body calorie-panel">
      ${selectedItem ? foodReferenceDetail(selectedItem) : `
        <div class="calorie-tools">
          <label class="field">
            <span>搜索食物</span>
            <input id="foodRefQuery" value="${escapeAttr(state.foodRefQuery)}" placeholder="鸡腿 / 米饭 / 蛋白">
          </label>
          <div class="calorie-cats">
            <button class="chip ${state.foodRefCategory === "全部" ? "active" : ""}" type="button" data-food-ref-category="全部">全部</button>
            ${categories.map((category) => `
              <button class="chip ${category === state.foodRefCategory ? "active" : ""}" type="button" data-food-ref-category="${escapeAttr(category)}">${escapeHtml(category)}</button>
            `).join("")}
          </div>
        </div>
        <div class="food-ref-list">
          ${items.map(foodReferenceListItem).join("") || `<p class="muted empty">没有找到匹配的食物。</p>`}
        </div>
      `}
      <div class="calorie-reference-notes">
        <p class="calorie-disclaimer">${escapeHtml(foodCalorieReferenceMeta.disclaimer)}</p>
        <p class="muted source-line">换算方式：${escapeHtml(foodCalorieReferenceMeta.calculation)}</p>
        <p class="muted source-line">参考：${foodReferenceSources.map((source) => `<a href="${escapeAttr(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.name)}</a>`).join(" / ")}</p>
      </div>
    </div>
    <div class="modal-actions">
      <button class="btn ghost" type="button" data-close-utility-modal>关闭</button>
    </div>
  `;
}

function versionModalContent() {
  const update = state.versionUpdate;
  return `
    <div class="modal-body version-panel">
      <div class="version-card">
        <span>当前版本</span>
        <strong>v${escapeHtml(APP_VERSION)} <small>${APP_VERSION_CODE}</small></strong>
      </div>
      ${update.available ? `
        <div class="version-card has-update">
          <span>最新版本</span>
          <strong>v${escapeHtml(update.latestVersion)} <small>${update.latestVersionCode || "-"}</small></strong>
        </div>
      ` : ""}
      ${state.versionCheckedAt ? `<p class="muted">最近检查：${escapeHtml(new Date(state.versionCheckedAt).toLocaleString())}</p>` : ""}
      <p class="muted">${state.versionStatus || "点击检查更新后，会读取版本清单并提示是否有新版本。"}</p>
      <div class="modal-actions">
        ${update.available && update.downloadUrl ? `<button class="btn primary" type="button" data-open-version-update>打开下载页</button>` : ""}
        <button class="btn primary" type="button" data-run-version-check ${state.versionChecking ? "disabled" : ""}>${state.versionChecking ? "检查中..." : "检查更新"}</button>
        <button class="btn ghost" type="button" data-close-utility-modal>关闭</button>
      </div>
    </div>
  `;
}

function bindEvents() {
  bindDrawerEvents();
  bindUtilityEvents();
  bindTrainingTimerEvents();
  bindTimerConfirmEvents();
  bindPlaylistDeleteEvents();
  document.querySelectorAll("[data-avatar-img]").forEach((img) => {
    const handleAvatarError = async () => {
      const recovered = await recoverLatestAvatarFromStorage();
      if (recovered) return;
      img.replaceWith(document.createTextNode(avatarFallbackText()));
      if (state.profile.avatarUrl) toast("头像暂时无法显示，请刷新或重新上传一次");
    };
    img.onerror = handleAvatarError;
    hydrateAvatarImage(img).then((ok) => {
      if (!ok) handleAvatarError();
    });
  });
  document.querySelectorAll("[data-page]").forEach((btn) => btn.onclick = () => {
    state.activePage = btn.dataset.page;
    save();
    render();
    if (state.activePage === "me") checkAppVersion({ interactive: false });
  });
  document.querySelectorAll("[data-goal]").forEach((btn) => btn.onclick = async () => {
    state.goal = btn.dataset.goal;
    save();
    render();
    try {
      const client = await getSupabaseClient();
      const synced = client ? await syncProfileToCloud(client) : false;
      if (synced) {
        markCloudSync();
        toast(`目标已切换为${state.goal}并同步`);
      } else {
        toast(`目标已切换为${state.goal}`);
      }
    } catch (error) {
      markCloudSync({ error: error?.message || "目标同步失败" });
      toast(`目标已本地保存，云同步失败`);
    }
  });
  document.querySelectorAll("[data-muscle], .muscle-zone, .cardio-zone").forEach((el) => el.onclick = () => toggleMuscle(el.dataset.muscle));
  document.querySelectorAll("[data-chart-part]").forEach((btn) => btn.onclick = () => {
    state.selectedChartPart = btn.dataset.chartPart;
    state.selectedActionFilter = "全部";
    save();
    render();
  });
  document.querySelectorAll("[data-action-filter]").forEach((btn) => btn.onclick = () => {
    state.selectedActionFilter = btn.dataset.actionFilter;
    save();
    render();
  });
  document.querySelectorAll("[data-post-date]").forEach((btn) => btn.onclick = () => {
    state.selectedPostDate = btn.dataset.postDate;
    save();
    render();
  });
  const reviewDateSelect = document.getElementById("reviewDateSelect");
  if (reviewDateSelect) reviewDateSelect.onchange = () => {
    state.selectedPostDate = reviewDateSelect.value;
    state.editingPostId = null;
    save();
    render();
  };
  const diaryPostFilter = document.getElementById("diaryPostFilter");
  if (diaryPostFilter) diaryPostFilter.onchange = () => {
    state.diaryPostFilter = diaryPostFilter.value;
    if (state.diaryPostFilter === "mine") state.diaryFriendId = "all";
    save();
    render();
  };
  const diaryFriendFilter = document.getElementById("diaryFriendFilter");
  if (diaryFriendFilter) diaryFriendFilter.onchange = () => {
    state.diaryFriendId = diaryFriendFilter.value || "all";
    save();
    render();
  };
  document.querySelectorAll("[data-clear-diary-filter]").forEach((btn) => btn.onclick = () => {
    state.diaryPostFilter = "all";
    state.diaryFriendId = "all";
    save();
    render();
  });
  document.querySelectorAll("[data-generate-day-review]").forEach((btn) => btn.onclick = async () => {
    const date = btn.dataset.generateDayReview;
    const records = state.records.filter((record) => record.date === date);
    if (!records.length) return toast("这一天还没有训练记录");
    const visibility = document.getElementById("dayReviewVisibility")?.value || "private";
    const result = await createReviewFromRecords(date, records, visibility);
    if (result.duplicate) toast("这一天的复盘草稿已存在，已打开编辑");
  });
  bindForms();
  bindRecordActions();
  bindBackupActions();
  bindAuthActions();
}

function closeUtilityModal() {
  state.activeUtilityModal = "";
  state.selectedFoodRefId = "";
  state.feedbackSubmitting = false;
  save();
  render();
}

let trainingTimerInterval = null;

function refreshTrainingTimerDisplay() {
  const display = document.getElementById("trainingTimerDisplay");
  if (!display) return;
  display.textContent = formatDuration(currentTrainingSeconds());
}

function persistTrainingTimerSnapshot() {
  state.trainingTimer = normalizeTrainingTimer({
    ...state.trainingTimer,
    elapsedSeconds: currentTrainingSeconds(),
    startedAt: "",
    running: false,
  });
  save();
}

function finishTrainingTimer() {
  const seconds = state.trainingTimer.running ? Math.max(1, currentTrainingSeconds()) : currentTrainingSeconds();
  if (!seconds) {
    toast("请先开始训练计时");
    return;
  }
  state.trainingTimer = normalizeTrainingTimer({
    ...state.trainingTimer,
    date: today(),
    elapsedSeconds: seconds,
    startedAt: "",
    running: false,
    savedSeconds: seconds,
    savedAt: new Date().toISOString(),
  });
  state.activePage = "feed";
  state.selectedPostDate = today();
  state.editingPostId = null;
  save();
  render();
  toast("已结束锻炼，训练时长已填入复盘");
}

function closeTimerConfirm() {
  state.timerConfirmAction = "";
  save();
  render();
}

function openTimerConfirm(action) {
  if (!["finish", "reset"].includes(action)) return;
  state.timerConfirmAction = action;
  save();
  render();
}

function resetTrainingTimer() {
  state.trainingTimer = normalizeTrainingTimer({ date: today(), elapsedSeconds: 0, startedAt: "", running: false, savedSeconds: 0, savedAt: "" });
  state.timerConfirmAction = "";
  save();
  render();
  toast("训练计时已清零");
}

function confirmTimerAction() {
  const action = state.timerConfirmAction;
  state.timerConfirmAction = "";
  if (action === "finish") {
    finishTrainingTimer();
    return;
  }
  if (action === "reset") resetTrainingTimer();
}

function bindTrainingTimerEvents() {
  clearInterval(trainingTimerInterval);
  trainingTimerInterval = null;
  if (state.trainingTimer.running) {
    trainingTimerInterval = setInterval(refreshTrainingTimerDisplay, 1000);
  }
  document.querySelectorAll("[data-timer-action]").forEach((btn) => btn.onclick = () => {
    const action = btn.dataset.timerAction;
    if (action === "start") {
      state.trainingTimer = normalizeTrainingTimer({
        ...state.trainingTimer,
        date: today(),
        startedAt: new Date().toISOString(),
        running: true,
        savedSeconds: 0,
        savedAt: "",
      });
      save();
      render();
      toast("训练计时已开始");
      return;
    }
    if (action === "pause") {
      persistTrainingTimerSnapshot();
      render();
      toast("训练计时已暂停");
      return;
    }
    if (action === "finish") {
      openTimerConfirm("finish");
      return;
    }
    if (action === "reset") {
      openTimerConfirm("reset");
    }
  });
}

function bindTimerConfirmEvents() {
  document.querySelectorAll("[data-close-timer-confirm]").forEach((el) => el.onclick = (event) => {
    if (event.currentTarget !== event.target && event.currentTarget.classList.contains("modal-scrim")) return;
    closeTimerConfirm();
  });
  document.querySelectorAll("[data-confirm-timer-action]").forEach((btn) => btn.onclick = () => {
    confirmTimerAction();
  });
}

function bindPlaylistDeleteEvents() {
  document.querySelectorAll("[data-request-playlist-delete]").forEach((btn) => btn.onclick = () => {
    if (!state.playlists.some((item) => item.id === btn.dataset.requestPlaylistDelete)) return;
    state.playlistDeleteId = btn.dataset.requestPlaylistDelete;
    save();
    render();
  });
  document.querySelectorAll("[data-close-playlist-delete]").forEach((el) => el.onclick = (event) => {
    if (event.currentTarget !== event.target && event.currentTarget.classList.contains("modal-scrim")) return;
    state.playlistDeleteId = "";
    save();
    render();
  });
  document.querySelectorAll("[data-confirm-playlist-delete]").forEach((btn) => btn.onclick = async () => {
    const playlist = state.playlists.find((item) => item.id === state.playlistDeleteId);
    if (!playlist) return;
    state.playlists = state.playlists.filter((item) => item.id !== playlist.id);
    state.playlistDeleteId = "";
    save();
    render();
    try {
      const synced = await deletePlaylistFromCloud(playlist.id);
      toast(synced ? "歌单已删除并同步" : "歌单已从本机删除");
    } catch (error) {
      markCloudSync({ error: error?.message || "歌单删除同步失败" });
      toast("歌单已从本机删除，云端删除失败");
    }
  });
}

function bindUtilityEvents() {
  document.querySelectorAll("[data-open-calorie-reference]").forEach((btn) => btn.onclick = () => {
    state.activeUtilityModal = "calories";
    state.selectedFoodRefId = "";
    save();
    render();
  });
  document.querySelectorAll("[data-utility-modal]").forEach((btn) => btn.onclick = () => {
    state.activeUtilityModal = btn.dataset.utilityModal;
    if (state.activeUtilityModal === "calories") state.selectedFoodRefId = "";
    if (state.activeUtilityModal === "notices") {
      state.notificationReadIds = [...new Set([...state.notificationReadIds, ...visibleAppNotices().map((notice) => notice.id)])];
    }
    document.querySelector(".app")?.classList.remove("menu-open");
    document.querySelector("[data-menu-open]")?.setAttribute("aria-expanded", "false");
    save();
    render();
    if (state.activeUtilityModal === "notices") checkAppVersion({ interactive: false });
  });
  document.querySelectorAll("[data-close-utility-modal]").forEach((el) => el.onclick = (event) => {
    if (event.currentTarget !== event.target && event.currentTarget.classList.contains("modal-scrim")) return;
    closeUtilityModal();
  });
  document.querySelectorAll(".utility-modal").forEach((modal) => modal.onclick = (event) => event.stopPropagation());
  const feedbackForm = document.getElementById("feedbackForm");
  if (feedbackForm) feedbackForm.onsubmit = async (event) => {
    event.preventDefault();
    await submitFeedback(new FormData(feedbackForm));
  };
  document.querySelectorAll("[data-mark-notices-read]").forEach((btn) => btn.onclick = () => {
    state.notificationReadIds = [...new Set([...state.notificationReadIds, ...visibleAppNotices().map((notice) => notice.id)])];
    save();
    render();
    toast("通知已标记为已读");
  });
  document.querySelectorAll("[data-food-ref-category]").forEach((btn) => btn.onclick = () => {
    state.foodRefCategory = btn.dataset.foodRefCategory || "全部";
    state.selectedFoodRefId = "";
    save();
    render();
  });
  document.querySelectorAll("[data-food-ref-id]").forEach((btn) => btn.onclick = () => {
    state.selectedFoodRefId = btn.dataset.foodRefId || "";
    save();
    render();
  });
  document.querySelectorAll("[data-close-food-ref-detail]").forEach((btn) => btn.onclick = () => {
    state.selectedFoodRefId = "";
    save();
    render();
  });
  const foodRefQuery = document.getElementById("foodRefQuery");
  if (foodRefQuery) {
    const syncFoodRefQuery = () => {
      state.foodRefQuery = sanitizeText(foodRefQuery.value, 40);
    };
    foodRefQuery.oninput = syncFoodRefQuery;
    foodRefQuery.onchange = () => {
      syncFoodRefQuery();
      save();
      render();
    };
    foodRefQuery.onkeydown = (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      syncFoodRefQuery();
      save();
      render();
    };
  }
  document.querySelectorAll("[data-check-version], [data-run-version-check]").forEach((btn) => btn.onclick = () => {
    checkAppVersion();
  });
  document.querySelectorAll("[data-open-version-update]").forEach((btn) => btn.onclick = () => {
    if (!openExternalUrl(state.versionUpdate.downloadUrl)) toast("下载地址暂未配置");
  });
  document.querySelectorAll("[data-open-sponsor]").forEach((btn) => btn.onclick = () => {
    const url = btn.dataset.openSponsor || "";
    if (!isSafeUrl(url)) return toast("赞助入口暂未配置");
    const ok = window.confirm("支持赞助完全自愿，不影响任何功能。确认打开外部支持入口吗？");
    if (ok) openExternalUrl(url);
  });
}

function bindDrawerEvents() {
  const shell = document.querySelector(".app");
  const toggle = document.querySelector("[data-menu-open]");
  const closeTargets = document.querySelectorAll("[data-menu-close]");
  if (!shell || !toggle) return;
  const close = () => {
    shell.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
  };
  toggle.onclick = () => {
    const willOpen = !shell.classList.contains("menu-open");
    shell.classList.toggle("menu-open", willOpen);
    toggle.setAttribute("aria-expanded", String(willOpen));
  };
  closeTargets.forEach((target) => target.onclick = close);
  document.onkeydown = (event) => {
    if (event.key === "Escape" && state.timerConfirmAction) closeTimerConfirm();
    else if (event.key === "Escape" && state.playlistDeleteId) {
      state.playlistDeleteId = "";
      save();
      render();
    }
    else if (event.key === "Escape" && state.activeUtilityModal) closeUtilityModal();
    else if (event.key === "Escape") close();
  };
}

function toggleMuscle(part) {
  if (!bodyPartSet.has(part)) return;
  if (state.selectedParts.includes(part)) {
    state.selectedParts = state.selectedParts.filter((item) => item !== part);
  } else {
    state.selectedParts = [...state.selectedParts, part];
  }
  state.selectedPart = state.selectedParts[0] || part;
  save();
  render();
}

function bindForms() {
  const recordFormEl = document.getElementById("recordForm");
  if (recordFormEl) {
    recordFormEl.elements.part.onchange = () => {
      state.selectedPart = recordFormEl.elements.part.value;
      state.selectedParts = [state.selectedPart];
      save();
      render();
    };
    recordFormEl.onsubmit = async (event) => {
      event.preventDefault();
      const form = new FormData(recordFormEl);
      const item = normalizeRecord({
        id: form.get("id") || cloudId(),
        date: form.get("date"),
        part: form.get("part"),
        parts: [...new Set([form.get("part"), ...state.selectedParts])],
        action: form.get("action"),
        weight: form.get("weight"),
        reps: form.get("reps"),
        sets: form.get("sets"),
        note: form.get("note"),
      });
      const idx = state.records.findIndex((record) => record.id === item.id);
      if (idx >= 0) state.records[idx] = item;
      else state.records.unshift(item);
      state.selectedPart = item.part;
      state.selectedParts = item.parts;
      state.editingId = null;
      save();
      render();
      try {
        const synced = await syncWorkoutRecordToCloud(item);
        if (synced) {
          toast(idx >= 0 ? "记录已修改并同步" : "训练记录已保存并同步");
        } else {
          toast(idx >= 0 ? "记录已修改" : "训练记录已保存");
        }
      } catch (error) {
        markCloudSync({ error: error?.message || "训练记录同步失败" });
        toast(idx >= 0 ? "记录已本地修改，云同步失败" : "训练已本地保存，云同步失败");
      }
    };
  }
  document.querySelectorAll("[data-reset-form]").forEach((btn) => btn.onclick = () => {
    state.editingId = null;
    render();
  });
  const planForm = document.getElementById("planForm");
  if (planForm) planForm.onsubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(planForm);
    const item = normalizePlan({ id: cloudId(), day: form.get("day"), title: form.get("title"), detail: form.get("detail"), goal: state.goal });
    state.plans.push(item);
    save();
    render();
    try {
      const synced = await syncPlanToCloud(item);
      if (synced) {
        toast("训练计划已添加并同步");
      } else {
        toast("训练计划已添加");
      }
    } catch (error) {
      markCloudSync({ error: error?.message || "训练计划同步失败" });
      toast("训练计划已本地添加，云同步失败");
    }
  };
  const foodForm = document.getElementById("foodForm");
  if (foodForm) foodForm.onsubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(foodForm);
    const item = normalizeFood({ id: cloudId(), date: today(), name: form.get("name"), kcal: form.get("kcal"), protein: form.get("protein") });
    state.foods.unshift(item);
    save();
    render();
    try {
      const synced = await syncFoodToCloud(item);
      if (synced) {
        toast("饮食已记录并同步");
      } else {
        toast("饮食已记录");
      }
    } catch (error) {
      markCloudSync({ error: error?.message || "饮食同步失败" });
      toast("饮食已本地记录，云同步失败");
    }
  };
  const weightForm = document.getElementById("weightForm");
  if (weightForm) weightForm.onsubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(weightForm);
    const log = upsertBodyLog(today(), form.get("weight"), form.get("fat"));
    save();
    render();
    try {
      const client = await getSupabaseClient();
      const profileSynced = client ? await syncProfileToCloud(client) : false;
      const bodySynced = await syncBodyLogToCloud(log);
      if (profileSynced || bodySynced) {
        toast("体重已保存并同步");
      } else {
        toast("体重已保存");
      }
    } catch (error) {
      markCloudSync({ error: error?.message || "体重同步失败" });
      toast("体重已本地保存，云同步失败");
    }
  };
  const postForm = document.getElementById("postForm");
  if (postForm) postForm.onsubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(postForm);
    const item = normalizePost({ id: cloudId(), authorId: state.auth.userId, date: today(), title: form.get("title"), text: withTrainingDuration(form.get("text")), mood: form.get("mood"), visibility: form.get("visibility") });
    state.posts.unshift(item);
    state.selectedPostDate = today();
    save();
    render();
    try {
      const synced = await syncPostToCloud(item);
      if (synced) toast("复盘已发布并同步");
      else toast("复盘已发布");
    } catch (error) {
      markCloudSync({ error: error?.message || "复盘同步失败" });
      toast("复盘已本地发布，云同步失败");
    }
  };
  const postEditForm = document.getElementById("postEditForm");
  if (postEditForm) postEditForm.onsubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(postEditForm);
    const id = sanitizeText(form.get("id"), 120);
    const idx = state.posts.findIndex((post) => post.id === id);
    if (idx < 0) return toast("没有找到要编辑的复盘");
    const original = state.posts[idx];
    const item = normalizePost({
      ...original,
      date: form.get("date"),
      title: form.get("title"),
      text: form.get("text"),
      mood: form.get("mood"),
      visibility: form.get("visibility"),
      authorId: state.auth.userId || original.authorId,
    });
    state.posts[idx] = item;
    state.posts.sort(sortByDateDesc);
    state.selectedPostDate = item.date;
    state.editingPostId = null;
    save();
    render();
    try {
      const synced = await syncPostToCloud(item);
      toast(synced ? "复盘已修改并同步" : "复盘已修改");
    } catch (error) {
      markCloudSync({ error: error?.message || "复盘修改同步失败" });
      toast("复盘已本地修改，云同步失败");
    }
  };
  document.querySelectorAll("[data-cancel-post-edit]").forEach((btn) => btn.onclick = () => {
    state.editingPostId = null;
    save();
    render();
  });
  document.querySelectorAll("[data-edit-post]").forEach((btn) => btn.onclick = () => {
    const post = state.posts.find((item) => item.id === btn.dataset.editPost);
    if (!post) return;
    state.editingPostId = post.id;
    state.selectedPostDate = post.date;
    state.diaryPostFilter = "all";
    save();
    render();
    document.getElementById("postEditForm")?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
  const friendForm = document.getElementById("friendForm");
  if (friendForm) friendForm.onsubmit = async (event) => {
    event.preventDefault();
    const name = sanitizeText(new FormData(friendForm).get("name"), 40);
    if (!name) return toast("请输入昵称或 UID");
    try {
      const results = await searchCloudFriends(name);
      render();
      toast(results.length ? `找到 ${results.length} 个可见用户` : "没有找到已开放搜索的用户");
    } catch (error) {
      markCloudSync({ error: error?.message || "好友搜索失败" });
      toast("好友搜索失败");
    }
  };
  document.querySelectorAll("[data-send-friend-request]").forEach((btn) => btn.onclick = async () => {
    try {
      const status = await sendFriendRequest(btn.dataset.sendFriendRequest);
      render();
      const message = {
        pending: "好友申请已发送",
        accepted: "对方已申请你，已直接添加好友",
        already_friends: "你们已经是好友",
      }[status] || "请先登录后再发送申请";
      toast(message);
    } catch (error) {
      markCloudSync({ error: error?.message || "好友申请失败" });
      toast("好友申请失败");
    }
  });
  document.querySelectorAll("[data-accept-friend-request]").forEach((btn) => btn.onclick = async () => {
    try {
      const ok = await acceptFriendRequest(btn.dataset.acceptFriendRequest);
      render();
      toast(ok ? "已添加好友" : "请先登录后再同意申请");
    } catch (error) {
      markCloudSync({ error: error?.message || "同意好友失败" });
      toast("同意好友失败");
    }
  });
  document.querySelectorAll("[data-cancel-friend-request]").forEach((btn) => btn.onclick = async () => {
    try {
      const ok = await cancelFriendRequest(btn.dataset.cancelFriendRequest);
      render();
      toast(ok ? "好友申请已取消" : "请先登录后再取消申请");
    } catch (error) {
      markCloudSync({ error: error?.message || "取消好友申请失败" });
      toast("取消好友申请失败");
    }
  });
  document.querySelectorAll("[data-reject-friend-request]").forEach((btn) => btn.onclick = async () => {
    try {
      const ok = await rejectFriendRequest(btn.dataset.rejectFriendRequest);
      render();
      toast(ok ? "已拒绝好友申请" : "请先登录后再拒绝申请");
    } catch (error) {
      markCloudSync({ error: error?.message || "拒绝好友申请失败" });
      toast("拒绝好友申请失败");
    }
  });
  document.querySelectorAll("[data-remove-friend]").forEach((btn) => btn.onclick = async () => {
    const friendId = btn.dataset.removeFriend;
    const friend = state.friends.find((item) => (item.userId || item.id) === friendId);
    if (!friend) return;
    const ok = window.confirm(`确认删除好友「${friend.name}」吗？删除后双方将不再互相查看好友可见复盘。`);
    if (!ok) return;
    try {
      const removed = await removeFriend(friendId);
      render();
      toast(removed ? "好友已删除" : "请先登录后再删除好友");
    } catch (error) {
      markCloudSync({ error: error?.message || "删除好友失败" });
      toast("删除好友失败");
    }
  });
  const friendPostFriendFilter = document.getElementById("friendPostFriendFilter");
  if (friendPostFriendFilter) friendPostFriendFilter.onchange = () => {
    state.friendPostFriendId = friendPostFriendFilter.value || "all";
    save();
    render();
  };
  const friendPostDateFilter = document.getElementById("friendPostDateFilter");
  if (friendPostDateFilter) friendPostDateFilter.onchange = () => {
    state.friendPostDate = isDateKey(friendPostDateFilter.value) ? friendPostDateFilter.value : "";
    save();
    render();
  };
  const friendPostRangeFilter = document.getElementById("friendPostRangeFilter");
  if (friendPostRangeFilter) friendPostRangeFilter.onchange = () => {
    state.friendPostRange = ["all", "today", "7", "30"].includes(friendPostRangeFilter.value) ? friendPostRangeFilter.value : "all";
    save();
    render();
  };
  document.querySelectorAll("[data-clear-friend-post-filter]").forEach((btn) => btn.onclick = () => {
    state.friendPostFriendId = "all";
    state.friendPostDate = "";
    state.friendPostRange = "all";
    save();
    render();
  });
  document.querySelectorAll("[data-open-playlist]").forEach((btn) => btn.onclick = () => {
    openExternalPlaylist(btn.dataset.openPlaylist);
  });
  document.querySelectorAll("[data-delete-post]").forEach((btn) => btn.onclick = async () => {
    const post = state.posts.find((item) => item.id === btn.dataset.deletePost);
    if (!post) return;
    const ok = window.confirm(`确认删除 ${post.date} 的「${post.title}」复盘吗？此操作只删除这一条复盘。`);
    if (!ok) return;
    state.posts = state.posts.filter((item) => item.id !== post.id);
    if (state.editingPostId === post.id) state.editingPostId = null;
    save();
    render();
    try {
      const synced = await deletePostFromCloud(post.id);
      toast(synced ? "复盘已删除并同步" : "复盘已本地删除");
    } catch (error) {
      markCloudSync({ error: error?.message || "复盘删除同步失败" });
      toast("复盘已本地删除，云端删除失败");
    }
  });
  const playlistForm = document.getElementById("playlistForm");
  if (playlistForm) playlistForm.onsubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(playlistForm);
    const item = normalizePlaylist({ id: cloudId(), date: today(), platform: form.get("platform"), name: form.get("name"), url: form.get("url") });
    if (!item) return toast("请输入有效的 http/https 歌单链接");
    if (state.playlists.some((playlist) => playlistSignature(playlist) === playlistSignature(item))) {
      return toast("这个歌单链接已经保存过了");
    }
    state.playlists.unshift(item);
    save();
    render();
    try {
      const synced = await syncPlaylistToCloud(item);
      toast(synced ? "歌单链接已保存并同步" : "歌单链接已保存");
    } catch (error) {
      markCloudSync({ error: error?.message || "歌单同步失败" });
      toast("歌单链接已本地保存，云同步失败");
    }
  };
  const profileForm = document.getElementById("profileForm");
  if (profileForm) profileForm.onsubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(profileForm);
    state.profile = normalizeProfile({
      ...state.profile,
      name: form.get("name"),
      gender: form.get("gender"),
      height: form.get("height"),
      weight: form.get("weight"),
      targetWeight: form.get("targetWeight"),
      fat: form.get("fat"),
      searchable: form.get("searchable") === "on",
    });
    const log = upsertBodyLog(today(), state.profile.weight, state.profile.fat);
    save();
    render();
    try {
      const client = await getSupabaseClient();
      const profileSynced = client ? await syncProfileToCloud(client) : false;
      const bodySynced = await syncBodyLogToCloud(log);
      if (profileSynced || bodySynced) {
        markCloudSync();
        toast("资料已保存并同步");
      } else {
        toast("资料已保存");
      }
    } catch (error) {
      markCloudSync({ error: error?.message || "资料同步失败" });
      toast("资料已本地保存，云同步失败");
    }
  };
  const avatarInput = document.getElementById("avatarInput");
  if (avatarInput) avatarInput.onchange = async () => {
    const file = avatarInput.files?.[0];
    if (!file) return;
    try {
      await uploadAvatarFile(file);
    } catch (error) {
      markCloudSync({ error: error?.message || "头像上传失败" });
      toast(`头像上传失败：${error?.message || "请检查 Storage 配置"}`);
    } finally {
      avatarInput.value = "";
    }
  };
}

function bindRecordActions() {
  document.querySelectorAll("[data-edit]").forEach((btn) => btn.onclick = () => {
    const record = state.records.find((item) => item.id === btn.dataset.edit);
    if (!record) return;
    state.editingId = record.id;
    state.selectedParts = getRecordParts(record);
    state.selectedPart = state.selectedParts[0] || record.part;
    state.activePage = "home";
    save();
    render();
    document.getElementById("recordForm")?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
  document.querySelectorAll("[data-delete-record]").forEach((btn) => btn.onclick = async () => {
    const record = state.records.find((item) => item.id === btn.dataset.deleteRecord);
    if (!record) return;
    const ok = window.confirm(`确认删除 ${record.date} 的「${record.action}」记录吗？此操作只删除这一条记录，无法撤销。`);
    if (!ok) return;
    state.records = state.records.filter((item) => item.id !== record.id);
    if (state.editingId === record.id) state.editingId = null;
    save();
    render();
    if (state.auth.loggedIn) {
      try {
        await deleteWorkoutRecordFromCloud(record.id);
        toast("记录已删除并同步");
      } catch (error) {
        markCloudSync({ error: error?.message || "删除同步失败" });
        toast("记录已本地删除，云端删除失败");
      }
    } else {
      toast("记录已删除");
    }
  });
  document.querySelectorAll("[data-copy-post]").forEach((btn) => btn.onclick = async () => {
    const record = state.records.find((item) => item.id === btn.dataset.copyPost);
    if (!record) return;
    const visibility = btn.dataset.postVisibility || "private";
    const result = await createReviewFromRecords(record.date, [record], visibility);
    if (result.duplicate) toast("这条训练的复盘草稿已存在，已打开编辑");
  });
}

function upsertBodyLog(date, weight, fat) {
  const normalized = normalizeBodyLog({ id: cloudId(), date, weight, fat });
  const idx = state.bodyLogs.findIndex((item) => item.date === normalized.date);
  if (idx >= 0) state.bodyLogs[idx] = { ...state.bodyLogs[idx], ...normalized, id: state.bodyLogs[idx].id };
  else state.bodyLogs.unshift(normalized);
  state.profile.weight = normalized.weight;
  state.profile.fat = normalized.fat;
  return idx >= 0 ? state.bodyLogs[idx] : normalized;
}

function bindBackupActions() {
  document.querySelectorAll("[data-export-json]").forEach((btn) => btn.onclick = exportJson);
  const fileInput = document.getElementById("importFile");
  if (fileInput) fileInput.onchange = importJsonFile;
}

function exportJson() {
  const ok = window.confirm("导出的 JSON 会包含训练、饮食、体重和复盘等敏感健康数据。确认现在导出吗？");
  if (!ok) return;
  const payload = {
    exportedAt: new Date().toISOString(),
    app: "练了没",
    schemaVersion: seed.schemaVersion,
    data: normalizeState(state),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `fittrack-backup-${today()}.json`;
  link.click();
  URL.revokeObjectURL(url);
  toast("备份已导出");
}

function importJsonFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (file.size > 1024 * 1024 * 2) {
    toast("备份文件过大，请检查文件");
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result || "{}"));
      const imported = normalizeState(parsed.data || parsed);
      const ok = window.confirm(`确认导入备份吗？将覆盖当前本地数据。备份中包含 ${imported.records.length} 条训练、${imported.posts.length} 条复盘。`);
      if (!ok) return;
      state = imported;
      save();
      render();
      toast("备份已导入");
    } catch {
      toast("导入失败：文件不是有效备份");
    }
  };
  reader.readAsText(file, "utf-8");
  event.target.value = "";
}

function bindAuthActions() {
  const authForm = document.getElementById("authForm");
  if (authForm) authForm.onsubmit = async (event) => {
    event.preventDefault();
    const submitter = event.submitter;
    const action = submitter?.dataset.authAction || "login";
    const form = new FormData(authForm);
    await handleAuth(action, form.get("email"), form.get("password"));
  };
  document.querySelectorAll("[data-auth-logout]").forEach((btn) => btn.onclick = async () => {
    const client = await getSupabaseClient();
    if (client) await client.auth.signOut();
    clearAccountScopedData();
    state.auth = { email: "", userId: "", loggedIn: false };
    save();
    render();
    toast("已退出登录");
  });
}

async function handleAuth(action, email, password) {
  const cleanedEmail = sanitizeText(email, 120);
  const cleanedPassword = String(password || "");
  if (!cleanedEmail || cleanedPassword.length < 6) {
    toast("请输入邮箱和至少 6 位密码");
    return;
  }
  const client = await getSupabaseClient();
  if (!client) {
    toast("Supabase 尚未配置，请先设置 .env");
    return;
  }
  const previousUserId = state.auth.userId;
  const result = action === "signup"
    ? await client.auth.signUp({ email: cleanedEmail, password: cleanedPassword })
    : await client.auth.signInWithPassword({ email: cleanedEmail, password: cleanedPassword });
  if (result.error) {
    toast(result.error.message || "认证失败");
    return;
  }
  const session = result.data?.session;
  const user = session?.user || null;
  if (user?.id && previousUserId && previousUserId !== user.id) {
    clearAccountScopedData();
  }
  state.auth = { email: user?.email || cleanedEmail, userId: user?.id || "", loggedIn: Boolean(user) };
  save();
  render();
  if (user) await syncCloudAfterLogin(client, user, { silent: action === "signup" });
  toast(action === "signup"
    ? (user ? "注册成功并已登录" : "注册请求已提交，请按邮箱提示确认")
    : "登录成功并同步");
}

let state = load();

render();
checkAppVersion({ interactive: false });

async function initializeAuthSession() {
  const client = await getSupabaseClient();
  if (!client) return;
  const { data } = await client.auth.getSession();
  const user = data?.session?.user;
  if (!user) return;
  const previousUserId = state.auth.userId;
  if (previousUserId && previousUserId !== user.id) {
    clearAccountScopedData();
  }
  state.auth = { email: user.email || state.auth.email, userId: user.id, loggedIn: true };
  save();
  render();
  await syncCloudAfterLogin(client, user, { silent: true });
}

initializeAuthSession();
