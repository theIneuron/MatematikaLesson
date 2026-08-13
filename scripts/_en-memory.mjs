// Память переводов: собирает пары «русский -> английский» из уже переведённых уроков
// и применяет их ко всем остальным. Повторов в курсе много («Проверить», «Верно.»,
// «Опирается на», числа, названия разрядов), и переводить их по второму разу незачем.
//
// node scripts/_en-memory.mjs --build   — собрать память в c:/tmp/en-memory.json
// node scripts/_en-memory.mjs --apply   — применить ко всем урокам, где английского нет
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

// Класс задаётся флагом --dir=<папка>; по умолчанию 3 класс, откуда память и начиналась.
// Память общая на все классы: повторов между классами много («Верно.», «десятки», «Проверить»).
const dirArg = process.argv.find((a) => a.startsWith('--dir='));
const DIR = dirArg ? dirArg.slice('--dir='.length) : 'src/components/grade3';
const MEM = 'c:/tmp/en-memory.json';
const files = fs.readdirSync(DIR).filter((x) => /^Dars\d+\.jsx$/.test(x)).sort();

const build = () => {
  const mem = fs.existsSync(MEM) ? JSON.parse(fs.readFileSync(MEM, 'utf8')) : {};
  let n = 0;
  for (const f of files) {
    const src = fs.readFileSync(path.join(DIR, f), 'utf8');
    // тройка { ru, uz, en } — берём ru и en
    for (const m of src.matchAll(/\bru: (['"])((?:\\.|(?!\1)[^\\])*)\1,\s*uz: (['"])((?:\\.|(?!\3)[^\\])*)\3,\s*en: (['"])((?:\\.|(?!\5)[^\\])*)\5/g)) {
      const ru = m[2].replace(/\\'/g, "'").replace(/\\"/g, '"');
      const en = m[6].replace(/\\'/g, "'").replace(/\\"/g, '"');
      if (!mem[ru]) { mem[ru] = en; n++; }
    }
    // tri(lang, ru, uz, en)
    for (const m of src.matchAll(/tri\(lang, (['"])((?:(?!\1).)*)\1, (['"])((?:(?!\3).)*)\3, (['"])((?:(?!\5).)*)\5\)/g)) {
      const ru = m[2];
      const en = m[6];
      if (!mem[ru]) { mem[ru] = en; n++; }
    }
  }
  fs.writeFileSync(MEM, JSON.stringify(mem, null, 1), 'utf8');
  console.log(`в памяти пар: ${Object.keys(mem).length} (добавлено ${n})`);
};

const apply = () => {
  const mem = JSON.parse(fs.readFileSync(MEM, 'utf8'));
  let done = 0;
  let left = 0;
  for (const f of files) {
    const file = path.join(DIR, f);
    const need = JSON.parse(execFileSync('node', ['scripts/grade3-en-extract.mjs', file], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));
    const keys = Object.keys(need);
    if (!keys.length) continue;
    const hit = {};
    let got = 0;
    for (const k of keys) {
      // числа и формулы переводить не нужно — они одинаковы
      if (!/[A-Za-zА-Яа-яЁё]{2,}/.test(k)) { hit[k] = k; got++; continue; }
      if (mem[k] !== undefined) { hit[k] = mem[k]; got++; }
    }
    if (!got) { left += keys.length; continue; }
    const tmp = `c:/tmp/en-mem-${f.replace('.jsx', '')}.json`;
    fs.writeFileSync(tmp, JSON.stringify(hit, null, 1), 'utf8');
    const out = execFileSync('node', ['scripts/grade3-en-inject.mjs', file, tmp], { encoding: 'utf8' });
    const added = Number((out.match(/вписано английских строк: (\d+)/) || [, 0])[1]);
    done += added;
    left += keys.length - got;
    console.log(`${f}: из памяти ${got} из ${keys.length}, вписано ${added}`);
  }
  console.log(`\nвсего вписано из памяти: ${done}, осталось перевести: ${left}`);
};

if (process.argv.includes('--build')) build();
else if (process.argv.includes('--apply')) apply();
else console.log('нужен ключ --build или --apply');
