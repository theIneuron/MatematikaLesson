// Правка методиста 2026-08-10: строка «опирается на … / дальше …» с экрана 15 убирается.
// Убираем только РИСОВАНИЕ: тексты в CONTENT остаются, они нужны озвучке мостиков.
import fs from 'node:fs';
import path from 'node:path';

const DIR = 'src/components/grade3';
const files = [...fs.readdirSync(DIR).filter((x) => /^Dars\d+\.jsx$/.test(x)).sort().map((f) => path.join(DIR, f)),
  path.join(DIR, '_kit/index.jsx')];
const RE = /[ \t]*<div className="fade-up delay-2"[^\r\n]*\r?\n[^\r\n]*conn_label_refs[^\r\n]*\r?\n[^\r\n]*conn_label_next[^\r\n]*\r?\n[ \t]*<\/div>\r?\n/g;

let n = 0;
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  if (!RE.test(src)) { RE.lastIndex = 0; continue; }
  RE.lastIndex = 0;
  fs.writeFileSync(f, src.replace(RE, ''), 'utf8');
  n++;
  console.log(`${path.basename(f)}: строка связей убрана`);
}
console.log(`\nфайлов правлено: ${n}`);
