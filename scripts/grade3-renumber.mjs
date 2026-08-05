// grade3-renumber.mjs — 3-sinf NAZARIY darslarini KETMA-KET raqamlash (metodist 2026-08-05).
// Sabab: rejada 3-sinfda 58 satr, ulardan 7 tasi ПК/ИК. Metodist qarori: nazorat darslari
// QILINMAYDI, kurs 51 darsdan iborat. Shu sababli reja satri bo'yicha raqamlash bolaga
// bo'shliq ko'rsatardi (8 -> 10 -> ... -> 17 -> 19). AMALIYOT allaqachon ketma-ket raqamlangan
// («Dars 9 amaliyoti — Ko'paytirish jadvali»), nazariya endi unga tenglashtiriladi.
//
// XARITA (reja satri -> yangi raqam): 1..8 o'zgarmaydi, 10->9, 11->10, 12->11, 13->12,
// 14->13, 15->14, 16->15, 17->16. Keyingi yangi dars (reja satri 19) -> 17.
//
// NIMA O'ZGARADI: bolaga va metodistga KO'RINADIGAN raqamlar —
//   1) `src/lessons/grade3.js` dagi nazariy darslar sarlavhalari;
//   2) har `DarsNN.jsx` dagi `LESSON_META.lessonTitle` (RU «Урок N.», UZ «N-dars.»);
//   3) CONTENT ichidagi boshqa darsga havolalar (RU «урок 15», UZ «15-dars»).
// NIMA O'ZGARMAYDI (ataylab): fayl nomlari, `slug` va `lessonId` — ular chop etilgan
//   havolalar va statistika kaliti. Moslik jadvali START_GRADE3.md da yozilgan.
//
// Ishlatish: node scripts/grade3-renumber.mjs [--dry]
import fs from 'node:fs';
import path from 'node:path';

const DRY = process.argv.includes('--dry');
const DIR = path.resolve('src/components/grade3');
const MAP = { 10: 9, 11: 10, 12: 11, 13: 12, 14: 13, 15: 14, 16: 15, 17: 16 };
const newNum = (n) => (MAP[n] !== undefined ? MAP[n] : n);

// Havolalarni faqat MATN bloklarida almashtiramiz (izohlarda `Dars14.jsx` kabi fayl
// havolalari bor — ularga tegilmaydi).
// DIQQAT (o'z xatoyimdan saboq): almashtirishlar KETMA-KET qilinsa, «уроки 12 и 13» avval
// «11 va 12» ga aylanadi, keyin ikkinchi qoida O'SHA natijani yana qayta hisoblaydi. Shuning
// uchun hamma shakl BITTA regexda, BITTA yurishda almashtiriladi.
// Yana bir tuzoq: JS da `\b` faqat ASCII uchun, kirillcha «Урок» oldida chegara topilmaydi —
// lookbehind ishlatiladi.
const RE = /(?<![А-Яа-яЁё])(урок(?:а|и|е|ах|ов)?\s+)(\d{1,2})(\s+и\s+)(\d{1,2})|(?<![А-Яа-яЁё])(урок(?:а|и|е|ах|ов)?\s+)(\d{1,2})|(\d{1,2})(\s+va\s+)(\d{1,2})(-darsl?a?r?)|(\d{1,2})(-dars(?:l?a?r?|da|dan|ga|ning|i)?)(?![a-z0-9])/gi;
const renumberText = (txt) => txt.replace(RE, (m, ruP1, ruA, ruMid, ruB, ruP2, ruSingle, uzA, uzMid, uzB, uzTail, uzOne, uzOneTail) => {
  if (ruP1) return `${ruP1}${newNum(+ruA)}${ruMid}${newNum(+ruB)}`;
  if (ruP2) return `${ruP2}${newNum(+ruSingle)}`;
  if (uzA) return `${newNum(+uzA)}${uzMid}${newNum(+uzB)}${uzTail}`;
  if (uzOne) return `${newNum(+uzOne)}${uzOneTail}`;
  return m;
});

const report = [];

for (const f of fs.readdirSync(DIR).filter((x) => /^Dars\d+\.jsx$/.test(x)).sort()) {
  const full = path.join(DIR, f);
  const CR = String.fromCharCode(13);
  const src = fs.readFileSync(full, 'utf8');
  const eol = src.includes(CR) ? CR + '\n' : '\n';
  let s = src.split(CR).join('');

  const before = s;
  // 1) LESSON_META.lessonTitle
  const lm = s.match(/const LESSON_META = \{[\s\S]*?\n\};/);
  if (lm) {
    const fixed = renumberText(lm[0]);
    if (fixed !== lm[0]) s = s.replace(lm[0], fixed);
  }
  // 2) CONTENT bloki
  const ci = s.indexOf('const CONTENT = {');
  const ce = s.indexOf('\n};', ci);
  if (ci >= 0 && ce > ci) {
    const block = s.slice(ci, ce);
    const fixed = renumberText(block);
    if (fixed !== block) s = s.slice(0, ci) + fixed + s.slice(ce);
  }
  if (s !== before) {
    const changes = [];
    const oldTitle = (before.match(/lessonTitle: \{ ru: '([^']+)'/) || [])[1];
    const newTitle = (s.match(/lessonTitle: \{ ru: '([^']+)'/) || [])[1];
    if (oldTitle !== newTitle) changes.push(`${oldTitle} -> ${newTitle}`);
    const refsOld = (before.match(/урок\s+\d{1,2}/gi) || []).length;
    changes.push(`matn havolalari: ${refsOld}`);
    report.push(`${f}: ${changes.join(' | ')}`);
    if (!DRY) fs.writeFileSync(full, eol === '\n' ? s : s.split('\n').join(eol), 'utf8');
  }
}

// 3) reyestr sarlavhalari (faqat NAZARIY massiv; amaliyot allaqachon ketma-ket)
{
  const p = path.resolve('src/lessons/grade3.js');
  const CR = String.fromCharCode(13);
  const src = fs.readFileSync(p, 'utf8');
  const eol = src.includes(CR) ? CR + '\n' : '\n';
  let s = src.split(CR).join('');
  const a = s.indexOf('export const grade3Nazariy = [');
  const b = s.indexOf('export const grade3Amaliy = [');
  if (a < 0 || b < 0) throw new Error('reyestr massivlari topilmadi');
  const head = s.slice(0, a), mid = s.slice(a, b), tail = s.slice(b);
  const fixedMid = mid.replace(/(title: "Dars )(\d{1,2})(\.)/g, (m, p1, n, p3) => `${p1}${newNum(+n)}${p3}`);
  if (fixedMid !== mid) {
    s = head + fixedMid + tail;
    report.push(`grade3.js: nazariy sarlavhalar qayta raqamlandi`);
    if (!DRY) fs.writeFileSync(p, eol === '\n' ? s : s.split('\n').join(eol), 'utf8');
  }
}

console.log(report.join('\n') || 'o\'zgarish yo\'q');
console.log(`\n${DRY ? 'DRY RUN (fayl yozilmadi)' : 'yozildi'}: ${report.length} joy`);
