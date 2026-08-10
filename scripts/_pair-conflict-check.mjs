// Проверка после правки языков: ключ не должен быть одновременно парой { ru, uz } и иметь
// сестринский key_uz — иначе одна из двух форм окажется мёртвой, а кит может отрисовать объект.
import fs from 'node:fs';
import path from 'node:path';

const DIR = 'src/components/grade3';
const KEYS = ['label', 'res', 'swap_line', 'check', 'step1', 'step2', 'rule_ex', 'fig_line', 'tbl_cells', 'stmts', 'lines', 'plate'];
const hits = [];

for (const f of fs.readdirSync(DIR).filter((x) => /^Dars\d+\.jsx$/.test(x)).sort()) {
  const lines = fs.readFileSync(path.join(DIR, f), 'utf8').split(/\r?\n/);
  lines.forEach((l, i) => {
    for (const k of KEYS) {
      if (!new RegExp(`\\b${k}: (\\{ ru:|\\[\\{ ru:)`).test(l)) continue;
      const win = lines.slice(Math.max(0, i - 40), i + 40).join('\n');
      if (new RegExp(`\\b${k}_uz:`).test(win)) hits.push(`${f}:${i + 1} ${k}`);
    }
  });
}
console.log(hits.length ? hits.join('\n') : 'конфликтов «пара + _uz» нет');
process.exit(hits.length ? 1 : 0);
