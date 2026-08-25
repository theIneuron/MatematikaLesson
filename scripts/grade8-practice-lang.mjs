// 8-sinf amaliyoti: TIL TEKSHIRUVI.
//
// Ikki qoida, ikkalasi ham CLAUDE.md §7 dan:
//   1. UZ satrlarida kirillcha bo'lmasin. `L(uz, ru, en)` ning BIRINCHI
//      argumenti o'zbekcha — u lotin alifbosida yoziladi.
//   2. Apostrof ASCII `'` bo'lsin: `ʻ`, `ʼ`, `'`, `'` emas. Ular ko'zga
//      bir xil ko'rinadi, lekin qidiruv, saralash va TTS uchun boshqa belgi.
//
// Ishga tushirish:  node scripts/grade8-practice-lang.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'src/components/grade8/practice';
const BAD_APOSTROPHE = /[ʻʼ‘’]/;
const CYRILLIC = /[Ѐ-ӿ]/;
// L( dan keyingi BIRINCHI satr — o'zbekcha argument.
const L_FIRST = /L\(\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g;

const files = [];
for (const dir of fs.readdirSync(ROOT)) {
  const full = path.join(ROOT, dir);
  if (fs.statSync(full).isDirectory()) {
    for (const f of fs.readdirSync(full)) if (f.endsWith('.jsx')) files.push(path.join(full, f));
  } else if (dir.endsWith('.jsx')) files.push(full);
}

const bad = [];
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  src.split('\n').forEach((line, i) => {
    if (BAD_APOSTROPHE.test(line)) bad.push(`APOSTROF   ${f}:${i + 1}  ${line.trim().slice(0, 60)}`);
  });
  let m;
  L_FIRST.lastIndex = 0;
  while ((m = L_FIRST.exec(src))) {
    if (CYRILLIC.test(m[1])) {
      const line = src.slice(0, m.index).split('\n').length;
      bad.push(`KIRILL-UZ  ${f}:${line}  ${m[1].slice(0, 60)}`);
    }
  }
}

if (bad.length) {
  console.log(`MUAMMO ${bad.length} ta:`);
  bad.forEach((b) => console.log('  ' + b));
  process.exit(1);
}
console.log(`OK: ${files.length} fayl — UZ satrlarda kirillcha yo'q, apostroflar ASCII`);
