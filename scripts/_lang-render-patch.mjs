// Разовая правка: места, где текст урока рисуется МИМО перевода, начинают звать t().
// t() пропускает обычную строку без изменений, поэтому правка безопасна и до перевода данных.
import fs from 'node:fs';
import path from 'node:path';

const DIR = 'src/components/grade3';
const files = [...fs.readdirSync(DIR).filter((x) => /^Dars\d+\.jsx$/.test(x)).sort().map((f) => path.join(DIR, f)),
  path.join(DIR, '_kit/index.jsx')];

// Компоненты без своего t(): стрелка со скобочным телом. Переводим в блок и добавляем хук.
const toBlock = (src, head) => {
  const at = src.indexOf(head);
  if (at < 0) return src;
  const open = src.indexOf('=> (', at);
  if (open < 0 || open > at + head.length + 4) return src;
  // конец компонента: строка ');' с начала строки
  const end = src.indexOf('\n);', open);
  if (end < 0) return src;
  const body = src.slice(open + 4, end);
  return `${src.slice(0, open)}=> {\n  const t = useT();\n  return (${body}\n  );\n}${src.slice(end + 2)}`;
};

const RE = [
  [/className="mono d16-plate">\{label\}</g, 'className="mono d16-plate">{t(label)}<'],
  [/errline">\{figLine\}</g, 'errline">{t(figLine)}<'],
  [/\{c\.res\}/g, '{t(c.res)}'],
  [/\{c\.step1\}/g, '{t(c.step1)}'],
  [/\{c\.step2\}/g, '{t(c.step2)}'],
  [/\{c\.swap_line\}/g, '{t(c.swap_line)}'],
  [/\{c\.rule_ex\}/g, '{t(c.rule_ex)}'],
  [/<span className="mono d15-check-expr">\{expr\}<\/span>/g, '<span className="mono d15-check-expr">{t(expr)}</span>'],
  [/role="cell">\{c\}</g, 'role="cell">{t(c)}<']
];

let total = 0;
for (const f of files) {
  let src = fs.readFileSync(f, 'utf8');
  const before = src;
  // сперва даём t() тем компонентам, у которых его нет
  if (/const MeasureCell = \(\{ head/.test(src) && !/const MeasureCell = [\s\S]{0,400}useT\(\)/.test(src)) src = toBlock(src, 'const MeasureCell = ({ head');
  if (/const LgMeasureCell = \(\{ head/.test(src) && !/const LgMeasureCell = [\s\S]{0,400}useT\(\)/.test(src)) src = toBlock(src, 'const LgMeasureCell = ({ head');
  if (/const CheckStrip = \(\{ expr/.test(src) && !/const CheckStrip = [\s\S]{0,300}useT\(\)/.test(src)) src = toBlock(src, 'const CheckStrip = ({ expr');
  if (/const TaskTable = \(\{ heads/.test(src) && !/const TaskTable = [\s\S]{0,300}useT\(\)/.test(src)) src = toBlock(src, 'const TaskTable = ({ heads');
  let n = 0;
  for (const [re, to] of RE) { const m = src.match(re); if (m) { n += m.length; src = src.replace(re, to); } }
  if (src !== before) { fs.writeFileSync(f, src, 'utf8'); total += n; console.log(`${path.basename(f)}: ${n}`); }
}
console.log(`\nвсего мест: ${total}`);
