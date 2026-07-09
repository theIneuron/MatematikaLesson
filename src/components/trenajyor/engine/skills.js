// Trenajyor engine — ko'nikma (skill) konfiglari + savol generatorlari.
// Har skill mustaqil generator; scope 1-sinf (100 gacha, столбiksiz).
// Generator qaytaradi: { mode:'num'|'pick', view, answer, options? }
//   view.type: 'expr' | 'cmp' | 'count' | 'odd'  (QuestionView shularni chizadi)
// Ko'nikma xaritasi: TRENAJYOR_APP_REJA.md §1.

const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1)); // [a,b]
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const KINDS = ['circle', 'triangle', 'square', 'rect'];

const expr = (text, answer) => ({ mode: 'num', view: { type: 'expr', text }, answer });

// ── Generatorlar ─────────────────────────────────────────────────────────────
const GEN = {
  add10() { const a = ri(1, 9), b = ri(1, 10 - a); return expr(`${a} + ${b}`, a + b); },
  sub10() { const a = ri(2, 10), b = ri(1, a - 1); return expr(`${a} − ${b}`, a - b); },
  add20() { // o'nlikdan o'tmasdan: 12 + 3
    const a = ri(11, 18), b = ri(1, Math.min(9 - (a % 10), 19 - a));
    return expr(`${a} + ${b}`, a + b);
  },
  sub20() { // qarzsiz: 18 − 5
    const a = ri(11, 19), ones = a % 10, b = ri(1, Math.max(1, ones));
    return expr(`${a} − ${b}`, a - b);
  },
  addcross() { const a = ri(2, 9), b = ri(11 - a, 9); return expr(`${a} + ${b}`, a + b); }, // 8 + 5
  subcross() { const a = ri(11, 17), b = ri((a % 10) + 1, 9); return expr(`${a} − ${b}`, a - b); }, // 12 − 5
  tens100() {
    if (Math.random() < 0.5) { const a = ri(1, 8) * 10, b = ri(1, 9 - a / 10) * 10; return expr(`${a} + ${b}`, a + b); }
    const a = ri(2, 9) * 10, b = ri(1, a / 10 - 1) * 10; return expr(`${a} − ${b}`, a - b);
  },
  missing() {
    const a = ri(1, 9), b = ri(1, Math.min(9, 20 - a));
    const hideA = Math.random() < 0.5;
    return expr(hideA ? `? + ${b} = ${a + b}` : `${a} + ? = ${a + b}`, hideA ? a : b);
  },
  compose() { const n = ri(5, 10), x = ri(1, n - 1); return expr(`${n} = ${x} + ?`, n - x); }, // son tarkibi
  seq(level) {
    const d = pick(level >= 2 ? [2, 5, 10] : [1, 2]);
    const start = ri(1, Math.max(1, (level >= 3 ? 100 : 40) - 4 * d));
    return expr(`${start}, ${start + d}, ${start + 2 * d}, ?`, start + 3 * d);
  },
  cmp(level) {
    const cap = level >= 3 ? 100 : level === 2 ? 50 : 20;
    const a = ri(1, cap), b = ri(1, cap);
    return { mode: 'pick', view: { type: 'cmp', a, b }, answer: a > b ? '>' : a < b ? '<' : '=', options: ['<', '=', '>'] };
  },
  count(level) {
    const target = pick(KINDS);
    const total = ri(4, level >= 2 ? 9 : 7);
    const cnt = ri(1, Math.min(total, level >= 2 ? 9 : 6));
    const items = [];
    for (let i = 0; i < cnt; i++) items.push(target);
    for (let i = cnt; i < total; i++) items.push(pick(KINDS.filter((k) => k !== target)));
    return { mode: 'num', view: { type: 'count', items: shuffle(items), target }, answer: cnt };
  },
  odd() {
    const common = pick(KINDS);
    const odd = pick(KINDS.filter((k) => k !== common));
    const oddIdx = ri(0, 3);
    const tiles = Array.from({ length: 4 }, (_, i) => (i === oddIdx ? odd : common));
    return { mode: 'pick', view: { type: 'odd', tiles }, answer: oddIdx, options: tiles };
  },
};

// ── Skill registri ───────────────────────────────────────────────────────────
// unlockLesson: bola shu darsni o'tgach ochiladi (backend kelganda gating uchun).
// group: sessiya xulosasida guruhlash uchun.
export const SKILLS = [
  { id: 'count',    group: 'shakl',   unlockLesson: 1 },
  { id: 'cmp',      group: 'sonlar',  unlockLesson: 4 },
  { id: 'compose',  group: 'sonlar',  unlockLesson: 6 },
  { id: 'seq',      group: 'sonlar',  unlockLesson: 5 },
  { id: 'add10',    group: 'hisob',   unlockLesson: 8 },
  { id: 'sub10',    group: 'hisob',   unlockLesson: 9 },
  { id: 'missing',  group: 'hisob',   unlockLesson: 16 },
  { id: 'add20',    group: 'hisob',   unlockLesson: 15 },
  { id: 'subcross', group: 'hisob',   unlockLesson: 20 },
  { id: 'addcross', group: 'hisob',   unlockLesson: 18 },
  { id: 'sub20',    group: 'hisob',   unlockLesson: 17 },
  { id: 'tens100',  group: 'hisob',   unlockLesson: 21 },
  { id: 'odd',      group: 'shakl',   unlockLesson: 33 },
];

export const SKILL_IDS = SKILLS.map((s) => s.id);

// Bola qaysi darslarni o'tgan bo'lsa (completedLesson), shu skillar ochiq.
// completedLesson=null → hammasi ochiq (pilot/backendsiz standart).
export function availableSkillIds(completedLesson = null) {
  if (completedLesson == null) return SKILL_IDS;
  return SKILLS.filter((s) => s.unlockLesson <= completedLesson).map((s) => s.id);
}

export function generate(skillId, level = 1) {
  const g = GEN[skillId];
  if (!g) return GEN.add10(level);
  return g(level);
}
