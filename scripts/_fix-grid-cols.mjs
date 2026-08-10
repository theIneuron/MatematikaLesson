// Правка методиста 2026-08-10: ряд плиток. Четыре — два на два, три или пять — одной строкой.
// Раньше колонок было жёстко две, и тройка панелей вставала «2 + 1».
//
// Правим только сетки, где рядом видно, СКОЛЬКО плиток рисуется: по `.map(` под ней.
import fs from 'node:fs';
import path from 'node:path';

const DIR = 'src/components/grade3';
const files = [...fs.readdirSync(DIR).filter((x) => /^Dars\d+\.jsx$/.test(x)).sort().map((f) => path.join(DIR, f)),
  path.join(DIR, '_kit/index.jsx')];

let total = 0;
const unknown = [];
for (const file of files) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  let n = 0;
  let needImport = false;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/gridTemplateColumns: '?`?repeat\(2, ([^)]*)\)/);
    if (!m) continue;
    // сколько плиток: ищем ближайший .map( в следующих трёх строках
    let src = null;
    for (let k = i; k <= Math.min(i + 3, lines.length - 1); k++) {
      const mm = lines[k].match(/\{\s*([A-Za-z_$][\w.$[\]]*)\.map\(/);
      if (mm) { src = mm[1]; break; }
    }
    if (!src) { unknown.push(`${path.basename(file)}:${i + 1} — не видно, сколько плиток`); continue; }
    const inner = m[1];
    lines[i] = lines[i]
      .replace(/gridTemplateColumns: 'repeat\(2, [^)]*\)'/, `gridTemplateColumns: \`repeat(\${gridCols(${src}.length)}, ${inner})\``)
      .replace(/gridTemplateColumns: `repeat\(2, [^)]*\)`/, `gridTemplateColumns: \`repeat(\${gridCols(${src}.length)}, ${inner})\``);
    n++;
    needImport = true;
  }
  if (!n) continue;
  let out = lines.join('\n');
  // урокам нужен импорт помощника из кита; в самом ките он уже объявлен
  if (needImport && !/_kit\/index\.jsx/.test(out) === false && !/\bgridCols\b.*from '\.\/_kit/.test(out) && !path.basename(file).startsWith('index')) {
    out = out.replace(/(import \{[^}]*?)(\s*\} from '\.\/_kit\/index\.jsx';)/, (mm, head, tail) => (head.includes('gridCols') ? mm : `${head}, gridCols${tail}`));
  }
  fs.writeFileSync(file, out, 'utf8');
  total += n;
  console.log(`${path.basename(file)}: ${n}`);
}
console.log(`\nсеток поправлено: ${total}`);
unknown.forEach((u) => console.log(u));
