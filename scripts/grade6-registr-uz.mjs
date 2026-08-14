import fs from 'node:fs';
const src = fs.readFileSync('src/components/grade6/Dars01.jsx', 'utf8');

// Вежливое обращение в узбекском держится на окончании глагола, а не на
// местоимении: `qarang` вежливо, `qara` — нет; `bilasiz` вежливо, `bilasan` — нет.
const INFORMAL_IMP = ['qara', 'ko\'r', 'bo\'l', 'tanla', 'bos', 'top', 'yoz', 'sana', 'tekshir',
  'ayt', 'o\'yla', 'boshla', 'sur', 'qo\'y', 'oling', 'hisobla', 'solishtir', 'kirit', 'urin'];
const INFORMAL_FIN = /\b\w+(san|ding|gansan|yapsan|arsan)\b/g;
const PRON = /\b(sen|sening|senga|seni|sendan|sizlar|sizlarni|sizlar bilan)\b/gi;

const bad = [];
const push = (line, msg, t) => bad.push(`${line}  ${msg}: ${t.slice(0, 74)}`);

const check = (t, line) => {
  if (PRON.test(t)) push(line, 'местоимение не на siz', t);
  PRON.lastIndex = 0;
  const fin = t.match(INFORMAL_FIN);
  // «insan», «doston» и подобные не глаголы — отсекаем по списку исключений
  const finReal = (fin || []).filter((w) => !/^(insan|dostan|ehtimolsan)$/i.test(w));
  if (finReal.length) push(line, `глагол на «ты» (${finReal.join(', ')})`, t);
  for (const stem of INFORMAL_IMP) {
    const re = new RegExp(`(^|[.!?]\\s+)${stem}\\b`, 'i');
    if (re.test(t)) push(line, `повелительное без -ng (${stem})`, t);
  }
};

for (const m of src.matchAll(/\buz:\s*('([^']*)'|"([^"]*)")/g)) {
  const t = m[2] !== undefined ? m[2] : m[3];
  check(t, src.slice(0, m.index).split('\n').length);
}
for (const m of src.matchAll(/\buz:\s*\[([\s\S]{0,4000}?)\n\s*\]/g)) {
  const line = src.slice(0, m.index).split('\n').length;
  for (const q of m[1].matchAll(/('([^']*)'|"([^"]*)")/g)) {
    check(q[2] !== undefined ? q[2] : q[3], line);
  }
}

console.log(bad.length ? bad.join('\n') : 'узбекский: обращение везде на siz');
console.log(`всего замечаний: ${bad.length}`);
