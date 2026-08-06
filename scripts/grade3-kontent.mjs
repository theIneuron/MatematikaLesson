// KONTENT_3SINF.md uchun dars bo'limini YIG'ILGAN darsdan chiqaradi.
//
// Nima uchun: 18-darsgacha bo'lim qo'lda yozilgan edi va matn jsx bilan ajralib ketdi
// (ovozda ikki nuqta darsda qolib, hujjatda tuzatilgan bo'lib chiqdi). Endi manba bitta:
// nima yig'ilgan bo'lsa, hujjatda ham o'sha turadi.
//
// Ishlatish:
//   node scripts/grade3-kontent.mjs src/components/grade3/Dars22.jsx            -> stdout
//   node scripts/grade3-kontent.mjs src/components/grade3/Dars22.jsx --write    -> KONTENT'ga qo'shadi
//   node scripts/grade3-kontent.mjs src/components/grade3/Dars22.jsx --check    -> mavjud bo'lim bilan solishtiradi
import fs from 'node:fs';
import path from 'node:path';

const file = process.argv[2];
if (!file) { console.error('dars fayli ko\'rsatilmadi'); process.exit(2); }
const MODE = process.argv.includes('--write') ? 'write' : process.argv.includes('--check') ? 'check' : 'print';
const KONTENT = 'src/books/grade3/KONTENT_3SINF.md';

const src = fs.readFileSync(file, 'utf8');
const num = Number(path.basename(file).replace(/\D+/g, ''));

// --- CONTENT ob'ektini matndan kesib olish (sof ma'lumot, JSX yo'q) ---
const takeObject = (name) => {
  const at = src.indexOf(`const ${name} = {`);
  if (at < 0) return null;
  let i = src.indexOf('{', at), depth = 0, inStr = null, esc = false;
  for (let j = i; j < src.length; j++) {
    const ch = src[j];
    if (esc) { esc = false; continue; }
    if (ch === '\\') { esc = true; continue; }
    if (inStr) { if (ch === inStr) inStr = null; continue; }
    if (ch === '"' || ch === "'" || ch === '`') { inStr = ch; continue; }
    if (ch === '{') depth++;
    else if (ch === '}') { depth--; if (!depth) return src.slice(i, j + 1); }
  }
  return null;
};
const evalObject = (name) => {
  const body = takeObject(name);
  if (!body) return null;
  try { return new Function(`return (${body});`)(); }
  catch (e) { console.error(`${name} hisoblanmadi: ${e.message}`); process.exit(1); }
};

const CONTENT = evalObject('CONTENT');
if (!CONTENT) { console.error('CONTENT topilmadi'); process.exit(1); }
const META = evalObject('LESSON_META') || {};

// --- ekran nomlari: darsdagi `// sN — NOM` izohlaridan ---
const labels = {};
for (const m of src.matchAll(/^\/\/ (s\d+) — ([^\n\r]+)/gm)) {
  const head = m[2].split(':')[0].split('.')[0].split('(')[0].trim();
  if (!labels[m[1]]) labels[m[1]] = head;
}
// xuk ekranida izoh yo'q — turini SCREEN_META'dan olamiz
const BY_TYPE = { hook: 'XUK', exploration: 'OCHISH', rule: 'QOIDA', test: 'TEST', case: 'MASALA', summary: 'YAKUN' };
for (const m of src.matchAll(/id:\s*'(s\d+)'[^\n\r]*?type:\s*'(\w+)'/g)) {
  if (!labels[m[1]]) labels[m[1]] = BY_TYPE[m[2]] || m[2].toUpperCase();
}

// --- sarlavha izohi (fayl boshidagi blok) ---
const headComment = (src.match(/^\/\/ =+[\s\S]*?^\/\/ =+/m) || [''])[0]
  .split(/\r?\n/).map((l) => '> ' + l.replace(/^\/\/ ?/, '')).join('\n');

// --- qiymatni satrga aylantirish ---
const isPair = (v) => v && typeof v === 'object' && !Array.isArray(v)
  && 'ru' in v && 'uz' in v && Object.keys(v).length === 2;
const flat = (v) => Array.isArray(v) ? v.join(',') : String(v);
const pair = (v) => `RU «${flat(v.ru)}» UZ "${flat(v.uz)}"`;

const lines = [];
const emit = (key, val, depth) => {
  const pad = '  '.repeat(depth);
  if (isPair(val)) { lines.push(`${pad}- **${key}:** ${pair(val)}`); return; }
  if (val === null || val === undefined || val === '') return;
  if (typeof val === 'boolean') return;                 // to'g'ri/noto'g'ri bayrog'i hujjatga chiqmaydi
  if (typeof val !== 'object') { lines.push(`${pad}- **${key}:** ${val}`); return; }
  // massiv o'z bandini ochmaydi: `steps[0]` shu darajada qoladi (qo'lda yozilgan shakl)
  if (Array.isArray(val)) {
    // variantlar ro'yxati bitta satrda: `- **opts:** RU «...» UZ "..." · RU «...» UZ "..."`
    if (val.length && val.every(isPair)) { lines.push(`${pad}- **${key}:** ${val.map(pair).join(' · ')}`); return; }
    if (val.length && val.every((v) => typeof v === 'string')) { lines.push(`${pad}- **${key}:** ${val.join(' · ')}`); return; }
    val.forEach((v, i) => emit(`${key}[${i}]`, v, depth));
    return;
  }
  lines.push(`${pad}- **${key}:**`);
  for (const [k, v] of Object.entries(val)) emit(k, v, depth + 1);
};

const screens = Object.keys(CONTENT).filter((k) => /^s\d+$/.test(k))
  .sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));

const topic = flat((CONTENT.s0 && CONTENT.s0.topic && CONTENT.s0.topic.uz) || META.title_uz || '');
const out = [];
out.push(`# Dars ${num} — ${topic} · KONTENT (etap 2)`);
out.push('');
out.push('> Karkas: `BLOK_B3_KARKAS.md`. Bo\'lim YIG\'ILGAN darsdan chiqarilgan');
out.push('> (`scripts/grade3-kontent.mjs`), shuning uchun matn dars fayli bilan aynan bir xil.');
out.push('');
if (headComment) out.push(headComment);
for (const s of screens) {
  const n = Number(s.slice(1)) + 1;
  out.push('');
  out.push('---');
  out.push('');
  out.push(`## Ekran ${n} (${s}) — ${labels[s] || ''}`.trimEnd());
  out.push('');
  lines.length = 0;
  for (const [k, v] of Object.entries(CONTENT[s])) emit(k, v, 0);
  out.push(...lines);
}
const text = out.join('\n') + '\n';

if (MODE === 'print') { process.stdout.write(text); process.exit(0); }

const md = fs.readFileSync(KONTENT, 'utf8');
const eol = md.includes('\r\n') ? '\r\n' : '\n';
const startRe = new RegExp(`^# Dars ${num} — .*$`, 'm');
const hit = md.match(startRe);

if (MODE === 'check') {
  if (!hit) { console.log(`Dars ${num}: bo'lim YO'Q`); process.exit(1); }
  console.log(`Dars ${num}: bo'lim bor (${md.slice(0, hit.index).split(/\r?\n/).length}-satr). Solishtirish uchun --write ni tekshiring.`);
  process.exit(0);
}

const body = text.split('\n').join(eol);
let next;
if (hit) {
  const from = hit.index;
  const rest = md.slice(from + hit[0].length);
  const nextHead = rest.search(/^# Dars \d+ — /m);
  const to = nextHead < 0 ? md.length : from + hit[0].length + nextHead;
  next = md.slice(0, from) + body + eol + md.slice(to);
  console.log(`Dars ${num}: bo'lim ALMASHTIRILDI`);
} else {
  next = md.replace(/\s*$/, '') + eol + eol + body;
  console.log(`Dars ${num}: bo'lim QO'SHILDI`);
}
fs.writeFileSync(KONTENT, next, 'utf8');
