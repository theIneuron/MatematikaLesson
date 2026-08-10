// Хук-экраны уроков 2–9 не влезали в окно: под сценой стоит ещё одна панель, а размер сцены
// считался формулой «высота окна минус 570px под остальное» — она этой панели не ждала.
// Решение без магических чисел: рамка со сценой получает класс `lm-scene-host` и тянется по
// остатку места, сцена занимает ровно столько, сколько осталось (до эталонных 372px).
import fs from 'node:fs';
import path from 'node:path';

const LESSONS = ['Dars02', 'Dars03', 'Dars04', 'Dars05', 'Dars06', 'Dars07', 'Dars08', 'Dars09'];
const DIR = 'src/components/grade3';
let n = 0;

for (const name of LESSONS) {
  const file = path.join(DIR, `${name}.jsx`);
  const src = fs.readFileSync(file, 'utf8');
  const at = src.indexOf('const Screen0 = ');
  if (at < 0) { console.log(`${name}: Screen0 не найден`); continue; }
  const end = src.indexOf('\nconst Screen1', at);
  const body = src.slice(at, end < 0 ? src.length : end);
  const m = body.match(/<div className="frame fade-up delay-1" style=\{\{ padding: '[^']*', overflow: 'hidden'[^}]*\}\}>/);
  if (!m) { console.log(`${name}: рамка сцены на хуке не опознана`); continue; }
  if (m[0].includes('lm-scene-host')) { console.log(`${name}: уже поправлен`); continue; }
  const patched = m[0]
    .replace('className="frame fade-up delay-1"', 'className="frame fade-up delay-1 lm-scene-host"')
    .replace(/, '--scene-reserve': '\d+px', '--scene-floor': '\d+px'/, '')
    .replace(/, flex: '1 1 auto', minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'/, '');
  fs.writeFileSync(file, src.slice(0, at) + body.replace(m[0], patched) + src.slice(at + body.length), 'utf8');
  n++;
  console.log(`${name}: сцена по остатку места`);
}
console.log(`\nэкранов правлено: ${n}`);
