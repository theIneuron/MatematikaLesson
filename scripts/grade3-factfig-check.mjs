// grade3-factfig-check.mjs — карточка факта на экране-тренажёре обязана быть с картинкой,
// а картинка — не разъезжаться.
//
// Две проверки:
//   1. у каждой карточки факта есть .d2-fact-hero с фигурой (уроки 2-9 стояли без неё до
//      2026-08-09, методист заметил);
//   2. ни один элемент не несёт одновременно класс анимации (lm-ff-*, и любые *-orbit, *-glow,
//      *-tw, *-drift) и собственный transform="…". CSS-анимация ЗАМЕНЯЕТ transform целиком,
//      поэтому такая фигура улетает в угол кадра — ровно это случилось с каплей воды в уроке 6
//      и светлячками в уроке 9. Положение держит ВНЕШНЯЯ группа, анимация — внутренняя.
//
// Запуск: node scripts/grade3-factfig-check.mjs
import fs from 'node:fs';
import path from 'node:path';

const argi = process.argv.indexOf('--dir');
const DIR = argi > 0 ? process.argv[argi + 1] : 'src/components/grade3';
const ANIM = /className="[^"]*(lm-ff-[a-z]+|-orbit|star-tw|rd-glow|comet)[^"]*"/;
let bad = 0;
let cards = 0;

for (const f of fs.readdirSync(DIR).filter((x) => /^Dars\d+\.jsx$/.test(x)).sort()) {
  const p = path.join(DIR, f);
  const src = fs.readFileSync(p, 'utf8');
  const lines = src.split(/\r?\n/);

  // 1. карточка факта без картинки
  lines.forEach((l, i) => {
    if (!/<div className="d2-factcard/.test(l)) return;
    cards++;
    const near = lines.slice(i, i + 6).join('\n');
    if (!/d2-fact-hero/.test(near)) { console.log(`${f}:${i + 1} — карточка факта без картинки`); bad++; }
  });

  // 2. анимация и transform на одном элементе
  lines.forEach((l, i) => {
    if (!ANIM.test(l)) return;
    const tag = l.slice(l.indexOf('<'));
    if (/\stransform="/.test(tag.split('>')[0])) {
      console.log(`${f}:${i + 1} — анимация и собственный transform на одном элементе: фигура уедет`);
      bad++;
    }
  });
}
console.log(bad ? `\nнайдено: ${bad}` : `чисто: карточек ${cards}, у всех картинка, положение не спорит с анимацией`);
process.exit(bad ? 1 : 0);
