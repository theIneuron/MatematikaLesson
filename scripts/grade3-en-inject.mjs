// grade3-en-inject.mjs — вписывает английский в урок рядом с русским и узбекским.
//
// Работает по тексту файла, чтобы не переписывать форматирование:
//   { ru: 'X', uz: "Y" }              -> { ru: 'X', uz: "Y", en: 'Z' }
//   ru: 'X',\n uz: "Y"                -> ru: 'X',\n uz: "Y",\n en: 'Z'
//   ключ: 'X', ключ_uz: "Y"           -> добавляется ключ_en: 'Z'
//   lang === 'ru' ? 'X' : 'Y'         -> tri(lang, 'X', 'Y', 'Z')
//
// Перевод берётся из JSON вида { "русская строка": "english string" }.
// Запуск: node scripts/grade3-en-inject.mjs src/components/grade3/Dars01.jsx c:/tmp/en-01.json
import fs from 'node:fs';

const [file, mapFile] = process.argv.slice(2);
if (!file || !mapFile) { console.error('нужно: <урок.jsx> <перевод.json>'); process.exit(1); }
const map = JSON.parse(fs.readFileSync(mapFile, 'utf8'));
let src = fs.readFileSync(file, 'utf8');

// Повторный запуск безопасен: тело строкового литерала в выражениях ниже не откатывается
// назад и не может закрыться на экранированном апострофе. Пока это не было починено, второй
// проход вписывал английский ВНУТРЬ узбекского слова, и урок 10 переставал собираться.

// строка в JS: одинарные кавычки, если внутри нет апострофа, иначе двойные
const q = (s) => (s.includes("'") ? `"${s.replace(/"/g, '\\"')}"` : `'${s}'`);
const miss = new Set();
const en = (ru) => {
  const v = map[ru];
  if (v === undefined || v === '') { miss.add(ru); return null; }
  return v;
};

let added = 0;

// 1) пара { ru: …, uz: … } в одну или две строки, без уже стоящего en
src = src.replace(/(\bru: (['"])((?:\\.|(?!\2)[^\\])*)\2,(\s*)uz: (['"])((?:\\.|(?!\5)[^\\])*)\5)(?!\s*,\s*en:)/g,
  (m, whole, _q1, ruRaw, gap, _q2) => {
    const ru = ruRaw.replace(/\\'/g, "'").replace(/\\"/g, '"');
    const v = en(ru);
    if (v === null) return m;
    added++;
    return `${whole},${gap}en: ${q(v)}`;
  });

// 2) массивы: ru: [...], uz: [...]
src = src.replace(/(\bru: \[([^\]]*)\],(\s*)uz: \[([^\]]*)\])(?!\s*,\s*en:)/g, (m, whole, ruBody, gap) => {
  const parts = ruBody.split(/,\s*(?=['"])/).map((x) => x.trim()).filter(Boolean);
  const vals = parts.map((p) => {
    const mm = p.match(/^(['"])((?:\\.|(?!\1)[^\\])*)\1$/);
    if (!mm) return null;
    return en(mm[2].replace(/\\'/g, "'").replace(/\\"/g, '"'));
  });
  if (vals.some((v) => v === null)) return m;
  added++;
  return `${whole},${gap}en: [${vals.map(q).join(', ')}]`;
});

// 3) сестра ключ_uz -> ключ_en (строка и массив), в том числе вид `labels_ru` / `labels_uz`
src = src.replace(/^(\s*)([\w]+): (['"])((?:\\.|(?!\3)[^\\])*)\3,(\s*\n\s*)([\w]+)_uz: (['"])((?:\\.|(?!\7)[^\\])*)\7,?$/gm,
  (m, ind, key, _q1, ruRaw, gap, baseKey) => {
    if (key !== baseKey && key !== `${baseKey}_ru`) return m;
    if (new RegExp(`\\b${baseKey}_en:`).test(src)) return m;
    const v = en(ruRaw.replace(/\\'/g, "'").replace(/\\"/g, '"'));
    if (v === null) return m;
    added++;
    return `${m.replace(/,?$/, ',')}${gap.replace(/\n\s*$/, '\n')}${ind}${baseKey}_en: ${q(v)},`;
  });

// 3b) сестра-массив: `labels_ru: [...]` рядом с `labels_uz: [...]`
src = src.replace(/^(\s*)([\w]+)(_ru)?: \[([^\]]*)\],(\s*\n\s*)([\w]+)_uz: \[([^\]]*)\],?$/gm,
  (m, ind, key, ruSuffix, ruBody, gap, baseKey) => {
    if (key !== baseKey) return m;
    if (new RegExp(`\\b${baseKey}_en:`).test(src)) return m;
    const parts = ruBody.split(/,\s*(?=['"])/).map((x) => x.trim()).filter(Boolean);
    const vals = parts.map((p) => {
      const mm = p.match(/^(['"])((?:\\.|(?!\1)[^\\])*)\1$/);
      return mm ? en(mm[2].replace(/\\'/g, "'")) : null;
    });
    if (vals.some((v) => v === null)) return m;
    added++;
    return `${m.replace(/,?$/, ',')}${gap.replace(/\n\s*$/, '\n')}${ind}${baseKey}_en: [${vals.map(q).join(', ')}],`;
  });

// 4) подписи в коде рисунка
src = src.replace(/lang === 'ru' \? (['"])((?:\\.|(?!\1)[^\\])*)\1 : (['"])((?:\\.|(?!\3)[^\\])*)\3/g, (m, _q1, ru, _q2, uz) => {
  const v = en(ru);
  if (v === null) return m;
  added++;
  return `tri(lang, ${q(ru)}, ${q(uz)}, ${q(v)})`;
});

fs.writeFileSync(file, src, 'utf8');
console.log(`вписано английских строк: ${added}`);
if (miss.size) {
  console.log(`без перевода осталось: ${miss.size}`);
  [...miss].slice(0, 10).forEach((m) => console.log('  ' + m.slice(0, 70)));
}
