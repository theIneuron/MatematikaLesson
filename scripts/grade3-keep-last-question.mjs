// Metodist qarori 2026-08-05: ketma-ket savolli ekranlarda oxirgi savol EKRANDA QOLADI,
// natija boksi (Bit reaksiyasi + ball) esa PASTDA yumshoq paydo bo'ladi.
// Sabab: ilgari `{!done && it && (...)}` butun savol blokini yechib tashlardi — ekran
// bo'shab qolar, faqat «4 / 4» boksi qolardi (metodist skrinshoti, Dars01 s10).
//
// Nima o'zgaradi (har dars faylida, komponent-komponent):
//   1) `const it = items[idx]`      -> oxirgi elementga qisiladi (done bo'lganda ham `it` bor)
//   2) `{!done && it && (`          -> `{it && (`   (savol blokі doim render bo'ladi)
//   3) hisoblagich `idx + 1`        -> `Math.min(idx + 1, N)`   («4 / 3» chiqmasin)
//   4) MC: oxirgi to'g'ri javobda `okPick` TOZALANMAYDI -> yashil variant qolib turadi;
//      qaytib kelganda (`storedAnswer`) okPick oxirgi savolning to'g'ri indeksidan tiklanadi
//   5) NumPad: done bo'lganda maydonda javob turadi, klaviatura va tugma o'chadi
//   6) natija boksi `fade-up` -> `reveal-soft` (0.62s, yumshoq) + CSS qo'shiladi
//
// FINAL PANEL (FactCard bor ekran) TEGILMAYDI: u yerda savol + boks + faktkarta skrollga
// olib keladi (metodist qoidasi: skroll YO'Q). Bu chekinish hisobotda aytiladi.
//
// Ishlatish:  node scripts/grade3-keep-last-question.mjs [--dry] [Dars14.jsx ...]
import fs from 'node:fs';
import path from 'node:path';

const DIR = path.resolve('src/components/grade3');
const args = process.argv.slice(2);
const dry = args.includes('--dry');
const only = args.filter((a) => !a.startsWith('--'));
const files = (only.length ? only : fs.readdirSync(DIR).filter((f) => /^Dars\d+\.jsx$/.test(f))).sort();

const CSS_MARK = '.reveal-soft';
const CSS_ADD = `
/* Metodist 2026-08-05: natija boksi oxirgi savol ostida YUMSHOQ chiqadi (fade-up dan sekinroq). */
.reveal-soft { animation: revealSoft .62s cubic-bezier(.22,.61,.36,1) both; }
@keyframes revealSoft { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .reveal-soft { animation: none; } }
`;

let totalChunks = 0;
const report = [];

for (const file of files) {
  const full = path.join(DIR, file);
  let src = fs.readFileSync(full, 'utf8');
  if (src.includes('\r\n')) throw new Error(`${file}: CRLF topildi, skript LF bilan ishlaydi`);

  // Fayl top-level deklaratsiyalar bo'yicha bo'linadi (komponent = chunk).
  const lines = src.split('\n');
  const starts = [];
  lines.forEach((l, i) => { if (/^(const|function|export default function) [A-Za-z_$]/.test(l)) starts.push(i); });
  starts.push(lines.length);

  const patched = [];
  const skipped = [];
  const out = lines.slice();

  for (let s = 0; s < starts.length - 1; s++) {
    const a = starts[s], b = starts[s + 1];
    let chunk = out.slice(a, b).join('\n');
    if (!chunk.includes('{!done && it && (')) continue;
    const name = (lines[a].match(/^(?:const|function|export default function) ([A-Za-z_$0-9]+)/) || [, '?'])[1];

    if (chunk.includes('d2-factcard')) { skipped.push(`${name} (final panel, FactCard)`); continue; }

    const coll = /const it = c\.items\[idx\]/.test(chunk) ? 'c.items'
      : /const it = items\[idx\]/.test(chunk) ? 'items' : null;
    if (!coll) { skipped.push(`${name} (it = ? topilmadi)`); continue; }

    const before = chunk;

    // 1) it — oxirgi elementga qisiladi
    chunk = chunk.replace(
      `const it = ${coll}[idx];`,
      `const it = ${coll}[Math.min(idx, ${coll}.length - 1)];`
    );
    // 2) savol bloki doim render bo'ladi
    chunk = chunk.split('{!done && it && (').join('{it && (');
    // 3) hisoblagich
    chunk = chunk.split(`{idx + 1} / {${coll}.length}`).join(`{Math.min(idx + 1, ${coll}.length)} / {${coll}.length}`);
    // 4) MC: yashil javob oxirgi savolda qoladi
    if (chunk.includes('setOkPick')) {
      chunk = chunk.replace(
        /setTimeout\(\(\) => \{ setOkPick\(null\); /,
        `setTimeout(() => { if (idx + 1 < ${coll}.length) setOkPick(null); `
      );
      chunk = chunk.replace(
        /const \[okPick, setOkPick\] = useState\(null\);/,
        `const [okPick, setOkPick] = useState(props.storedAnswer && ${coll}.length ? ${coll}[${coll}.length - 1].ci : null);`
      );
    }
    // 5) NumPad: done bo'lganda javob ko'rinadi, kirish o'chadi
    if (chunk.includes('<NumPad ')) {
      chunk = chunk.replace(/<NumPad value=\{val\} setValue=\{setVal\} disabled=\{!canAct \|\| numLock\}/g,
        '<NumPad value={done ? String(it.ans) : val} setValue={setVal} disabled={!canAct || numLock || done}');
      chunk = chunk.replace(/disabled=\{!canAct \|\| numLock \|\| val === ''\}/g,
        "disabled={!canAct || numLock || done || val === ''}");
    }
    // 6) natija boksi yumshoq chiqadi
    chunk = chunk.split('className="frame-success fade-up"').join('className="frame-success reveal-soft"');

    if (chunk === before) { skipped.push(`${name} (o'zgarish yo'q)`); continue; }
    // Nazorat: eski shakl qolmasin
    if (chunk.includes('{!done && it && (')) throw new Error(`${file}/${name}: eski shart qoldi`);
    out.splice(a, b - a, ...chunk.split('\n'));
    // splice uzunlikni saqlaydi (qator soni o'zgarmaydi), aks holda indekslar buziladi
    if (out.length !== lines.length) throw new Error(`${file}/${name}: qator soni o'zgardi (${out.length} vs ${lines.length})`);
    patched.push(name);
    totalChunks++;
  }

  src = out.join('\n');
  if (patched.length && !src.includes(CSS_MARK)) {
    const i = src.lastIndexOf('const STYLES = `');
    if (i < 0) throw new Error(`${file}: STYLES topilmadi`);
    const j = src.indexOf('\n', i);
    src = src.slice(0, j + 1) + CSS_ADD.trimStart() + src.slice(j + 1);
  }
  if (patched.length && !dry) fs.writeFileSync(full, src, 'utf8');
  report.push({ file, patched, skipped });
}

for (const r of report) {
  if (!r.patched.length && !r.skipped.length) continue;
  console.log(`${r.file}: ${r.patched.length ? 'tuzatildi -> ' + r.patched.join(', ') : 'tuzatish yo\'q'}${r.skipped.length ? ' | o\'tkazildi -> ' + r.skipped.join(', ') : ''}`);
}
console.log(`\nJami komponent: ${totalChunks}${dry ? ' (DRY RUN, fayl yozilmadi)' : ''}`);
