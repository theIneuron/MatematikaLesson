// Trenajyor engine — progres saqlash (localStorage adapter), sessiya yozuvi, nishonlar.
// Data shakli: TRENAJYOR_APP_REJA.md §3. Faza 3 da shu adapter serverga almashtiriladi.

const KEY = 'trenajyor:1-sinf:profile';

export function defaultProfile() {
  return {
    xp: 0,
    streak: { count: 0, lastDate: null },
    best: { points: 0, correct: 0, mode: null },
    skills: {},              // { skillId: {mastery, level, seen, correct, lastStep} }
    history: [],             // [{date, mode, points, correct}]
    badges: [],              // earned badge id lari
  };
}

export function loadProfile() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...defaultProfile(), ...JSON.parse(raw) };
  } catch { /* localStorage yo'q — mayli */ }
  return defaultProfile();
}

export function saveProfile(profile) {
  try { localStorage.setItem(KEY, JSON.stringify(profile)); } catch { /* mayli */ }
}

// YYYY-MM-DD (mahalliy). Sana app-runtime'da ruxsat etilgan.
function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function isYesterday(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr + 'T00:00:00');
  const y = new Date(); y.setDate(y.getDate() - 1);
  return d.toDateString() === y.toDateString();
}

// Sessiya tugagach chaqiriladi. profile mutatsiya qilinadi. Qaytaradi: xulosa meta.
export function recordSession(profile, { points, correct, mode }) {
  profile.xp += points;

  const t = today();
  if (profile.streak.lastDate === t) { /* bugun allaqachon */ }
  else if (isYesterday(profile.streak.lastDate)) profile.streak.count += 1;
  else profile.streak.count = 1;
  profile.streak.lastDate = t;

  const isRecord = points > (profile.best.points || 0);
  if (isRecord) profile.best = { points, correct, mode };

  profile.history.push({ date: t, mode, points, correct });
  if (profile.history.length > 40) profile.history = profile.history.slice(-40);

  return { isRecord, streak: profile.streak.count, xpGained: points };
}

// ── Nishonlar (achievements) ─────────────────────────────────────────────────
function lifetimeCorrect(profile) {
  return Object.values(profile.skills).reduce((n, s) => n + (s.correct || 0), 0);
}

const BADGE_RULES = [
  { id: 'firstRecord', test: (p, s) => s.isRecord }, // birinchi rekordda (keyin dedup)
  { id: 'streak3',     test: (p) => p.streak.count >= 3 },
  { id: 'streak7',     test: (p) => p.streak.count >= 7 },
  { id: 'sprint20',    test: (p, s) => s.sessionCorrect >= 20 },
  { id: 'correct100',  test: (p) => lifetimeCorrect(p) >= 100 },
  { id: 'sharp',       test: (p) => Object.values(p.skills).some((sk) => sk.mastery >= 0.9 && sk.seen >= 5) },
];

// Yangi qo'lga kiritilgan nishonlarni qaytaradi va profile.badges ga qo'shadi.
export function evaluateBadges(profile, sessionMeta) {
  const ctx = { ...sessionMeta };
  const fresh = [];
  for (const rule of BADGE_RULES) {
    if (profile.badges.includes(rule.id)) continue;
    if (rule.test(profile, ctx)) { profile.badges.push(rule.id); fresh.push(rule.id); }
  }
  return fresh;
}
