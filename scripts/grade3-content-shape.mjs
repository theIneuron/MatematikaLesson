// grade3-content-shape.mjs — какие поля CONTENT реально читает каждый экран урока.
//
// Написано после сборки урока 36: экран 1 упал, потому что его аудио — массив из трёх
// реплик, а в контенте лежал объект. Догадываться о форме по соседнему уроку дорого:
// урок падает только в браузере и только на этом экране.
//
// Скрипт разбирает файл урока и печатает по каждому экрану список обращений вида `c.<...>`,
// а для донора и новичка — разницу: чего в новом контенте не хватает.
//
// Запуск:
//   node scripts/grade3-content-shape.mjs src/components/grade3/Dars35.jsx
//   node scripts/grade3-content-shape.mjs src/components/grade3/Dars36.jsx --vs src/components/grade3/Dars35.jsx
import fs from 'node:fs';

const file = process.argv[2] || 'src/components/grade3/Dars35.jsx';
const vsAt = process.argv.indexOf('--vs');
const vs = vsAt > 0 ? process.argv[vsAt + 1] : null;

// какие поля читает компонент, привязанный к CONTENT.sN
const shapeOf = (path) => {
  const src = fs.readFileSync(path, 'utf8');
  const lines = src.split(/\r?\n/);
  const starts = [];
  lines.forEach((l, i) => { if (/^const [A-Z][A-Za-z0-9]* = \(/.test(l)) starts.push(i); });
  starts.push(lines.length);

  const out = new Map();
  const rawOut = new Map();
  for (let b = 0; b < starts.length - 1; b++) {
    const body = lines.slice(starts[b], starts[b + 1]).join('\n');
    const bind = body.match(/const c = CONTENT\.(s\d+)/);
    if (!bind) continue;
    const key = bind[1];
    const fields = out.get(key) || new Set();
    // поля, которые экран показывает БЕЗ t(): в контенте они обязаны быть простой строкой,
    // иначе React получает объект {ru, uz} и экран падает
    const raw = rawOut.get(key) || new Set();
    // только то, что стоит МЕЖДУ тегами: `>{c.res}<`. Пропсы вида eyebrow={c.eyebrow}
    // переводит сам Stage, там объект и есть норма.
    for (const m of body.matchAll(/>\{c\.([A-Za-z_$][\w$]*)\}</g)) raw.add(m[1]);
    for (const m of body.matchAll(/\bt\(c\.([A-Za-z_$][\w$]*)/g)) raw.delete(m[1]);
    rawOut.set(key, raw);
    const METHOD = /\.(map|filter|slice|length|join|forEach|some|every|indexOf|find)$/;
    // c.audio[lang][0] — реплика за репликой: индекс стоит ПОСЛЕ языка
    for (const m of body.matchAll(/\bc\.([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)(\[lang\])?(\[\d+\])?/g)) {
      let f = m[1].replace(METHOD, '');
      if (!f) continue;
      if (m[3]) f += m[2] ? '[lang][]' : '[]';
      else if (m[2]) f += '[lang]';
      fields.add(f);
    }
    out.set(key, fields);
  }
  return { out, rawOut };
};

const { out: mine, rawOut: rawFields } = shapeOf(file);
if (!vs) {
  for (const [k, v] of [...mine].sort()) {
    const raw = [...(rawFields.get(k) || [])];
    console.log(`${k}: ${[...v].sort().join(', ')}${raw.length ? `\n     без перевода (простая строка): ${raw.sort().join(', ')}` : ''}`);
  }
  process.exit(0);
}

// сверка: то же ли читают экраны и есть ли поля в самом контенте
const src = fs.readFileSync(file, 'utf8');
const has = (expr) => {
  const leaf = expr.replace(/\[\]$/, '').replace(/\[lang\]$/, '').split('.').pop();
  return new RegExp(`\\b${leaf}\\s*:`).test(src);
};
let bad = 0;
for (const [k, v] of [...mine].sort()) {
  const miss = [...v].filter((f) => !has(f));
  if (miss.length) { console.log(`${k}: НЕТ В КОНТЕНТЕ -> ${miss.join(', ')}`); bad += miss.length; }
}
// массивы реплик: длина должна покрывать индексы, к которым обращается экран
for (const [k, v] of mine) {
  // проверяем только реплики по языку: c.audio[lang][0]. Поля вида hints[1] — это разбор
  // по номеру варианта, там объект и это правильно.
  const idx = [...v].filter((f) => f.endsWith('[lang][]')).map((f) => f.slice(0, -8));
  for (const f of idx) {
    const leaf = f.split('.').pop();
    // ищем поле ВНУТРИ своего экрана, а не первое попавшееся в файле
    const scr = src.indexOf(`  ${k}: {`);
    if (scr < 0) continue;
    const end = src.indexOf('\n  s', scr + 6);
    const own = src.slice(scr, end < 0 ? scr + 4000 : end);
    const at = own.indexOf(`${leaf}: {`);
    if (at < 0) continue;
    // список — только если СРАЗУ за открытием идёт `ru: [`
    const isArr = /^\s*(ru|uz):\s*\[/.test(own.slice(at + leaf.length + 3));
    if (!isArr) { console.log(`${k}: ${f} экран читает по номеру (реплика за репликой), а в контенте объект`); bad++; }
  }
}
// поля без t(): в контенте обязана лежать простая строка, иначе React получит {ru, uz}
for (const [k, raw] of rawFields) {
  const scr = src.indexOf(`  ${k}: {`);
  if (scr < 0) continue;
  const end = src.indexOf('\n  s', scr + 6);
  const own = src.slice(scr, end < 0 ? scr + 4000 : end);
  for (const f of raw) {
    const at = own.search(new RegExp(`^\\s{4}${f}:`, 'm'));
    if (at < 0) continue;
    const val = own.slice(at).replace(/^\s*\w+:\s*/, '');
    if (/^\{/.test(val)) { console.log(`${k}: ${f} экран показывает без перевода, значит нужна простая строка, а лежит объект`); bad++; }
  }
}
console.log(bad ? `\nрасхождений: ${bad}` : 'форма контента совпадает с тем, что читают экраны');
process.exit(bad ? 1 : 0);
