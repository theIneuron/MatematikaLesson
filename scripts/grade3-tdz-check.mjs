// grade3-tdz-check.mjs — ищет переменные, которые используются РАНЬШЕ своего объявления
// ВНУТРИ компонента. Такой экран падает всегда: useMemo считает значение прямо во время
// отрисовки, а const ниже ещё не существует («Cannot access X before initialization»).
// Найдено в уроке 6 (2026-08-09): экран не открывался вовсе, ни один прогон этого не ловил.
//
// Разбор кода не свой: работу делает eslint (no-use-before-define), он правильно понимает
// параметры функций и не путает их с внешними именами. Здесь только отбор: имена уровня
// файла (STYLES, LESSON_META, фигуры) — не ошибка, они читаются позже, когда всё определено.
// Ошибка — когда и обращение, и объявление внутри одного тела функции, то есть с отступом.
//
// Запуск: node scripts/grade3-tdz-check.mjs [--dir src/components/grade3]
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : d; };
const DIR = arg('dir', 'src/components/grade3');
const RULE = '{"no-use-before-define":["error",{"variables":true,"functions":false,"classes":false}]}';

const files = fs.readdirSync(DIR).filter((x) => /\.jsx$/.test(x)).sort().map((f) => path.join(DIR, f));
if (!files.length) { console.log('файлов нет'); process.exit(0); }

let out = '';
try {
  // maxBuffer: отчёт по 35 урокам — это мегабайты json, значения по умолчанию не хватает
  out = execFileSync('npx', ['eslint', '--no-ignore', '--rule', RULE, '-f', 'json', ...files], { encoding: 'utf8', shell: true, maxBuffer: 128 * 1024 * 1024 });
} catch (e) {
  out = e.stdout || '';   // eslint выходит с кодом 1, когда нашёл ошибки — это нормально
  if (!out) { console.log('eslint не отработал:', String(e.message).slice(0, 200)); process.exit(2); }
}
const report = JSON.parse(out.slice(out.indexOf('[')));

let bad = 0;
for (const file of report) {
  const lines = fs.readFileSync(file.filePath, 'utf8').split(/\r?\n/);
  for (const m of file.messages) {
    if (m.ruleId !== 'no-use-before-define') continue;
    const name = (m.message.match(/'([^']+)'/) || [])[1];
    if (!name) continue;
    // объявление ниже места обращения; важно только то, что с отступом (внутри функции)
    const declRe = new RegExp(`^(\\s*)(?:const|let)\\s+(?:\\[[^\\]]*\\]|\\{[^}]*\\}|${name}\\b)`);
    let declLine = -1;
    let indent = '';
    for (let i = m.line; i < lines.length; i++) {
      const d = lines[i].match(declRe);
      if (d && new RegExp(`\\b${name}\\b`).test(lines[i].split('=')[0])) { declLine = i + 1; indent = d[1]; break; }
    }
    if (declLine < 0 || indent === '') continue;          // имя уровня файла — читается позже, это не ошибка
    if (indent.length > 2) continue;                      // объявление внутри вложенной функции — своя область
    if (!/^ {2}\S/.test(lines[m.line - 1] || '')) continue; // обращение из обработчика: сработает уже после отрисовки
    console.log(`${path.basename(file.filePath)}:${m.line} — «${name}» берётся здесь, а объявлена ниже, в строке ${declLine} (экран упадёт при открытии)`);
    bad++;
  }
}
console.log(bad ? `\nнайдено: ${bad}` : `чисто: ранних обращений нет (файлов: ${files.length})`);
process.exit(bad ? 1 : 0);
