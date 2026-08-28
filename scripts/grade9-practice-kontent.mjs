// 9-sinf amaliyoti: KONTENT HUJJATINI TOPSHIRIQ FAYLLARIDAN YIG'ADI.
//
// NEGA. 1-6-darslarda kontent hujjati qo'lda yozilgan, keyin o'sha matn
// jsx ga ko'chirilgan. Ikki nusxa — ikki haqiqat: birinchi tuzatishdayoq
// hujjat bilan kod ajralib ketadi, va metodist O'QIGAN matn ekranda
// turganidan boshqa bo'lib qoladi. Endi manba BITTA: topshiriq fayli.
// Hujjat undan hosil qilinadi.
//
// Nima oladi: `tag`, `level`, va `L()` bilan yozilgan hamma matn — kalit
// nomi bilan birga (eyebrow, setup, ask, opt, claim, label, text, ...).
// Matematika (`expr`, `cols`, `items[].tokens`, `answer`) hujjatga
// tushmaydi: u tarjima emas va uni kodda ko'rish kerak.
//
// Ishlatish:
//   node scripts/grade9-practice-kontent.mjs 07 08
//   node scripts/grade9-practice-kontent.mjs --all

import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'src/components/grade9/practice';
const OUT = 'src/books/grade9';

// JS satr literalini o'qish: qaysi tirnoqda boshlangan bo'lsa, o'sha bilan
// tugaydi; `\` dan keyingi belgi matnning o'zi hisoblanadi.
function readString(src, i) {
  const q = src[i];
  if (q !== "'" && q !== '"' && q !== '`') return null;
  let out = '';
  i += 1;
  while (i < src.length) {
    const c = src[i];
    if (c === '\\') { out += src[i + 1]; i += 2; continue; }
    if (c === q) return { value: out, next: i + 1 };
    out += c;
    i += 1;
  }
  return null;
}

const skip = (src, i) => {
  while (i < src.length && /[\s,]/.test(src[i])) i += 1;
  return i;
};

// `L(uz, ru, en)` — uchta satr. Boshqasi bo'lsa, null qaytaradi.
function readL(src, i) {
  if (src.slice(i, i + 2) !== 'L(') return null;
  let j = skip(src, i + 2);
  const out = [];
  for (let k = 0; k < 3; k += 1) {
    const s = readString(src, j);
    if (!s) return null;
    out.push(s.value);
    j = skip(src, s.next);
  }
  if (src[j] !== ')') return null;
  return { value: out, next: j + 1 };
}

// Kalitni topish: `L(` dan chapga qarab eng yaqin `nom:` ni o'qiydi.
function keyBefore(src, i) {
  const head = src.slice(Math.max(0, i - 90), i);
  const m = head.match(/([A-Za-z_$][\w$]*)\s*:\s*$/);
  return m ? m[1] : '?';
}

function parseTask(file) {
  const src = fs.readFileSync(file, 'utf8');
  const tag = (src.match(/tag:\s*'([^']*)'/) || [])[1] || '';
  const level = (src.match(/level:\s*'([^']*)'/) || [])[1] || '';
  const mech = (src.match(/->\s*(\w+)/) || [])[1] || '';
  const rows = [];
  for (let i = 0; i < src.length; i += 1) {
    if (src[i] !== 'L' || src.slice(i, i + 2) !== 'L(') continue;
    const r = readL(src, i);
    if (!r) continue;
    rows.push({ key: keyBefore(src, i), uz: r.value[0], ru: r.value[1], en: r.value[2] });
    i = r.next - 1;
  }
  return { id: path.basename(file).replace(/\.jsx$/, '').slice(-2), tag, level, mech, rows };
}

const esc = (s) => String(s).replace(/\|/g, '\\|');

function render(n, tasks) {
  const out = [];
  out.push(`# DARS${n}_AMALIYOT_KONTENT — 9-sinf, ${Number(n)}-dars amaliyoti`);
  out.push('');
  out.push('> **HOSIL QILINGAN HUJJAT.** Uni qo\'lda tahrirlamang: manba —');
  out.push(`> \`src/components/grade9/practice/dars${n}/D${n}_01…10.jsx\`, hujjat esa`);
  out.push('> `node scripts/grade9-practice-kontent.mjs` bilan yig\'iladi. Matnni');
  out.push('> o\'zgartirish kerak bo\'lsa, topshiriq faylida o\'zgartiring va skriptni');
  out.push('> qayta ishga tushiring — shunda hujjat bilan ekran hech qachon ajralmaydi.');
  out.push('');
  out.push('> Matematika (yozuvlar, jadval sonlari, javoblar) bu yerga tushmaydi: u');
  out.push('> tarjima emas va uni kodda ko\'rish kerak. Bu yerda faqat SO\'ZLAR.');
  out.push('');
  for (const t of tasks) {
    out.push('---');
    out.push('');
    out.push(`## ${t.id} · \`${t.mech}\` · ${t.level} · teg \`${t.tag}\``);
    out.push('');
    out.push('| Kalit | UZ | RU | EN |');
    out.push('|---|---|---|---|');
    for (const r of t.rows) {
      out.push(`| \`${r.key}\` | ${esc(r.uz)} | ${esc(r.ru)} | ${esc(r.en)} |`);
    }
    out.push('');
  }
  return out.join('\n') + '\n';
}

const argv = process.argv.slice(2);
const dirs = fs.readdirSync(ROOT).filter((d) => /^dars\d\d$/.test(d)).map((d) => d.slice(4)).sort();
const list = argv.includes('--all') ? dirs : argv.filter((a) => /^\d\d$/.test(a));
if (!list.length) {
  process.stdout.write('Dars nomerini bering yoki --all: ' + dirs.join(' ') + '\n');
} else {
  for (const n of list) {
    const dir = path.join(ROOT, 'dars' + n);
    const files = fs.readdirSync(dir).filter((f) => /^D\d\d_\d\d\.jsx$/.test(f)).sort();
    const tasks = files.map((f) => parseTask(path.join(dir, f)));
    const total = tasks.reduce((a, t) => a + t.rows.length, 0);
    fs.writeFileSync(path.join(OUT, `DARS${n}_AMALIYOT_KONTENT.md`), render(n, tasks));
    process.stdout.write(`DARS${n}_AMALIYOT_KONTENT.md — ${tasks.length} topshiriq, ${total} matn qatori\n`);
  }
}
