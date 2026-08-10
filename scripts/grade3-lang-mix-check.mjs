// grade3-lang-mix-check.mjs — на экране не должно быть текста ЧУЖОГО языка.
//
// Замечание методиста 2026-08-10: на русском экране урока 51 в сцене висела узбекская
// подпись «xonalardan diagrammagacha». Причина: текст был вшит прямо в SVG сцены и рисуется
// одинаково при любом языке, минуя перевод.
//
// Скрипт ищет в файле урока строковые литералы внутри <text>…</text> (сцена, фигуры экранов,
// герой карточки факта) и делит их на три вида:
//   - нейтральные: цифры, знаки, латинские сокращения мер (sm, dm, kg, m²) — их можно;
//   - русские: содержат кириллицу;
//   - узбекские: слова латиницей длиннее двух букв.
// Урок обязан быть либо полностью нейтральным в рисунках, либо брать подписи из данных.
//
// Запуск: node scripts/grade3-lang-mix-check.mjs [--dir src/components/grade3]
import fs from 'node:fs';
import path from 'node:path';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : d; };
const DIR = arg('dir', 'src/components/grade3');

// что считается нейтральным: числа, знаки действий, единицы измерения, одиночные буквы
const NEUTRAL = /^[\s0-9+\-−·:×÷=<>≤≥?.,()[\]{}/|°'’«»%№a-zA-Z²³]*$/;
// одинаковые в обоих языках: единицы, буквы, римские цифры, исторические термины
const UNITS = new Set(['sm', 'dm', 'm', 'km', 'g', 'kg', 'mm', 'sm²', 'm²', 'x', 'a', 'b', 'S', 'P',
  'XII', 'IX', 'XIV', 'al-jabr', 'algebra']);
const CYR = /[А-Яа-яЁё]/;

let bad = 0;
const rows = [];

for (const f of fs.readdirSync(DIR).filter((x) => /^Dars\d+\.jsx$/.test(x)).sort()) {
  const src = fs.readFileSync(path.join(DIR, f), 'utf8');
  const lines = src.split(/\r?\n/);
  lines.forEach((l, i) => {
    if (/<text[^>]*>\{/.test(l)) return;   // подпись приходит выражением — язык выбирает урок
    for (const m of l.matchAll(/<text[^>]*>([^<{][^<]*)<\/text>/g)) {
      const txt = m[1].trim();
      if (!txt || UNITS.has(txt)) continue;
      // «>» встречается и внутри атрибута-выражения (fontSize={t.length > 3 ? …}),
      // тогда в захват попадает кусок разметки, а не подпись
      if (/[{}"=]/.test(txt)) continue;
      const isCyr = CYR.test(txt);
      const isWord = /[a-zA-Z]{3,}/.test(txt);
      if (!isCyr && !isWord) continue;
      if (NEUTRAL.test(txt) && !isCyr && !isWord) continue;
      rows.push(`${f}:${i + 1} — ${isCyr ? 'РУС' : 'UZB'} «${txt}»`);
      bad++;
    }
  });
}

rows.forEach((r) => console.log(r));
console.log(bad ? `\nтекста чужого языка в рисунках: ${bad}` : 'чисто: в рисунках только нейтральные подписи');
process.exit(bad ? 1 : 0);
