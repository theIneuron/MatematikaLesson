// Правка методиста 2026-08-10: узбекский обращается к ученику на «siz».
// Меняем ТОЛЬКО команду в конце предложения: «Ustunda ayir.» → «Ustunda ayiring.».
// Слова счёта не трогаем: в «besh ayir bir» ayir — это «минус».
//
// Работаем не по тексту файла, а по ЗНАЧЕНИЯМ узбекских строк: иначе регулярка задела бы код
// (`top,` в JS выглядит так же, как узбекская команда «top,»).
import fs from 'node:fs';
import path from 'node:path';

const FORMS = {
  ayir: 'ayiring', bos: 'bosing', esla: 'eslang', hisobla: 'hisoblang', "o'qi": "o'qing",
  qara: 'qarang', "qo'sh": "qo'shing", sana: 'sanang', solishtir: 'solishtiring',
  tanla: 'tanlang', ter: 'tering', top: 'toping', unutma: 'unutmang', yaxlitla: 'yaxlitlang',
  boshla: 'boshlang', taqqosla: 'taqqoslang', tekshir: 'tekshiring', yoz: 'yozing', ayt: 'ayting',
  "bo'l": "bo'ling", "ko'paytir": "ko'paytiring", belgila: 'belgilang', joyla: 'joylang',
  sur: 'suring', yech: 'yeching', kirit: 'kiriting'
};
const NEEDS_OBJ = new Set(["o'qi", 'sana']);   // ось и дата — омонимы, нужен объект на -ni

const fixText = (s) => {
  let out = s;
  for (const [stem, siz] of Object.entries(FORMS)) {
    const head = NEEDS_OBJ.has(stem) ? '(\\S*ni\\s)' : '()';
    const re = new RegExp(`(^|\\s)${head}${stem}([.!?:]|$)`, 'g');
    out = out.replace(re, (m, sp, obj, tail) => `${sp}${obj}${siz}${tail}`);
  }
  return out;
};

const readObj = (src, decl) => {
  const a = src.indexOf(decl);
  if (a < 0) return null;
  const open = decl.trim().endsWith('[') ? '\n];' : '\n};';
  const b = src.indexOf(open, a);
  if (b < 0) return null;
  try { return eval(`(${src.slice(a + decl.length - 1, b + 2)})`); } catch { return null; }
};

const DIR = 'src/components/grade3';
const files = fs.readdirSync(DIR).filter((x) => /^Dars\d+\.jsx$/.test(x)).sort().map((f) => path.join(DIR, f));
const DECLS = ['const CONTENT = {', 'const LESSON_META = {', 'const SCREEN_META = [', 'const BRIDGES = {', 'const S14_PAYOFF = {'];

let total = 0;
const missed = [];
for (const file of files) {
  let src = fs.readFileSync(file, 'utf8');
  const changes = [];
  const walk = (node, lang) => {
    if (typeof node === 'string') { if (lang === 'uz') { const f = fixText(node); if (f !== node) changes.push([node, f]); } return; }
    if (!node || typeof node !== 'object') return;
    for (const [k, v] of Object.entries(node)) walk(v, k === 'uz' || k.endsWith('_uz') ? 'uz' : (k === 'ru' || k.endsWith('_ru') ? 'ru' : lang));
  };
  for (const d of DECLS) { const o = readObj(src, d); if (o) walk(o, null); }
  let n = 0;
  for (const [oldV, newV] of changes) {
    // строка в файле может быть в двойных кавычках (как есть) либо в одинарных с \'
    const esc = (x) => x.replace(/'/g, "\\'");
    if (src.includes(oldV)) { src = src.split(oldV).join(newV); n++; }
    else if (src.includes(esc(oldV))) { src = src.split(esc(oldV)).join(esc(newV)); n++; }
    else missed.push(`${path.basename(file)}: не нашли в тексте — «${oldV.slice(0, 50)}»`);
  }
  if (n) { fs.writeFileSync(file, src, 'utf8'); total += n; console.log(`${path.basename(file)}: ${n}`); }
}
console.log(`\nисправлено строк: ${total}`);
missed.forEach((m) => console.log(m));
