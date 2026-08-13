// grade3-en-extract.mjs — собирает из урока всё, что ждёт английского.
//
// Английский делается ТЕМ ЖЕ механизмом, что узбекский:
//   - пара { ru, uz } получает третий ключ `en`;
//   - сестра `ключ_uz` получает `ключ_en`;
//   - подпись в коде `lang === 'ru' ? 'РУС' : 'UZB'` становится выбором из трёх.
//
// Ищем ТЕМИ ЖЕ выражениями, что вписывает grade3-en-inject: иначе находится одно, а
// вписывается другое. Так на уроке 10 пропустили `RZ_LBL` — пару, объявленную вне CONTENT.
//
// Запуск: node scripts/grade3-en-extract.mjs src/components/grade3/Dars01.jsx > c:/tmp/en-01.json
import fs from 'node:fs';

const file = process.argv[2];
if (!file) { console.error('нужен путь к уроку'); process.exit(1); }
const src = fs.readFileSync(file, 'utf8');

const out = {};
const unesc = (s) => s.replace(/\\'/g, "'").replace(/\\"/g, '"');
const add = (ru) => { const v = unesc(ru); if (v.trim() && out[v] === undefined) out[v] = ''; };

// 1) пара { ru: …, uz: … } без английского
for (const m of src.matchAll(/\bru: (['"])((?:\\.|(?!\1)[^\\])*)\1,(\s*)uz: (['"])((?:\\.|(?!\4)[^\\])*)\4(?!\s*,\s*en:)/g)) add(m[2]);

// 2) массивы ru: [...] , uz: [...]
for (const m of src.matchAll(/\bru: \[([^\]]*)\],(\s*)uz: \[([^\]]*)\](?!\s*,\s*en:)/g)) {
  m[1].split(/,\s*(?=['"])/).forEach((p) => {
    const mm = p.trim().match(/^(['"])((?:\\.|(?!\1)[^\\])*)\1$/);
    if (mm) add(mm[2]);
  });
}

// 3) сестра ключ_uz (в том числе labels_ru / labels_uz), строка и массив
for (const m of src.matchAll(/^(\s*)([\w]+): (['"])((?:\\.|(?!\3)[^\\])*)\3,\s*\n\s*([\w]+)_uz: /gm)) {
  if (m[2] === m[5] || m[2] === `${m[5]}_ru`) { if (!new RegExp(`\\b${m[5]}_en:`).test(src)) add(m[4]); }
}
for (const m of src.matchAll(/^(\s*)([\w]+)(_ru)?: \[([^\]]*)\],\s*\n\s*([\w]+)_uz: \[/gm)) {
  if (m[2] !== m[5]) continue;
  if (new RegExp(`\\b${m[5]}_en:`).test(src)) continue;
  m[4].split(/,\s*(?=['"])/).forEach((p) => {
    const mm = p.trim().match(/^(['"])((?:\\.|(?!\1)[^\\])*)\1$/);
    if (mm) add(mm[2]);
  });
}

// 4) подписи, вшитые в код рисунков
for (const m of src.matchAll(/lang === 'ru' \? (['"])((?:\\.|(?!\1)[^\\])*)\1 : (['"])((?:\\.|(?!\3)[^\\])*)\3/g)) add(m[2]);

console.log(JSON.stringify(out, null, 1));
console.error(`строк без английского: ${Object.keys(out).length}`);
