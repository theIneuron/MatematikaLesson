import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { parse } from '@babel/parser';

const root = process.cwd();
const lessons = [17, 18, 19, 20, 21];
const expected = {
  17: { id: 'num-4-17-practice', exportName: 'Grade4Dars17Practice', slug: 'dars17-amaliyot-shkalalar', snippets: ["answer: '42'", "answer: '12'", "answer: '90'", "answer: '280'", '(400 − 250) ÷ 5 = 30'] },
  18: { id: 'num-4-18-practice', exportName: 'Grade4Dars18Practice', slug: 'dars18-amaliyot-kasr-tushunchasi', snippets: ['answer: { n: 4, d: 9 }', 'selectCount: 5', "answer: '8'", '7/10'] },
  19: { id: 'num-4-19-practice', exportName: 'Grade4Dars19Practice', slug: 'dars19-amaliyot-kasrlarni-taqqoslash', snippets: ['2/9', '4/5', '5/9', '7/12'] },
  20: { id: 'num-4-20-practice', exportName: 'Grade4Dars20Practice', slug: 'dars20-amaliyot-kasrlarni-qoshish', snippets: ['selectCount: 3', "answer: '9'", "answer: '4'", "answer: '8'", '11/15'] },
  21: { id: 'num-4-21-practice', exportName: 'Grade4Dars21Practice', slug: 'dars21-amaliyot-kasrlarni-ayirish', snippets: ['selectCount: 2', "answer: '7'", "answer: '3'", '0/7 = 0', '7/12 + 3/12 = 10/12'] },
};

const failures = [];
const pass = (condition, message) => { if (!condition) failures.push(message); };
const count = (source, pattern) => (source.match(pattern) || []).length;

for (const lesson of lessons) {
  const file = path.join(root, `src/components/grade4/Dars${lesson}Practice.jsx`);
  const source = fs.readFileSync(file, 'utf8');
  try {
    parse(source, { sourceType: 'module', plugins: ['jsx'] });
  } catch (error) {
    failures.push(`D${lesson}: JSX parse xatosi — ${error.message}`);
    continue;
  }

  const taskBlock = source.match(/const TASKS = \[([\s\S]*?)\n\];/)?.[1] || '';
  const screenBlock = source.match(/const SCREEN_META = \[([\s\S]*?)\r?\n\];\r?\n\r?\nconst TASKS/)?.[1] || '';
  const taskCount = count(taskBlock, /\n\s+id: '(?:0[1-9]|10)', level:/g);
  const levels = {
    green: count(taskBlock, /level: 'green'/g),
    yellow: count(taskBlock, /level: 'yellow'/g),
    red: count(taskBlock, /level: 'red'/g),
  };
  const kinds = new Set([...taskBlock.matchAll(/kind: '([^']+)'/g)].map((match) => match[1]));

  pass(taskCount === 10, `D${lesson}: ${taskCount} ta TASK, 10 emas`);
  pass(count(screenBlock, /scored: true/g) === 10, `D${lesson}: SCREEN_META scored soni 10 emas`);
  pass(count(screenBlock, /scope: 'final'/g) === 1, `D${lesson}: final scope aynan 1 emas`);
  pass(levels.green === 2 && levels.yellow === 5 && levels.red === 3, `D${lesson}: daraja taqsimoti ${JSON.stringify(levels)}`);
  pass(kinds.size >= 4, `D${lesson}: mexanika soni ${kinds.size}, kamida 4 emas`);
  pass(count(taskBlock, /secondHint:/g) === 10, `D${lesson}: secondHint soni 10 emas`);
  pass(count(taskBlock, /thirdHint:/g) === 10, `D${lesson}: thirdHint soni 10 emas`);
  pass(count(taskBlock, /correctText:/g) === 10, `D${lesson}: correctText soni 10 emas`);
  pass(count(taskBlock, /rule:/g) === 10, `D${lesson}: rule soni 10 emas`);
  pass(source.includes(`lessonId: '${expected[lesson].id}'`), `D${lesson}: lessonId noto'g'ri`);
  pass(source.includes(`export default function ${expected[lesson].exportName}`), `D${lesson}: export nomi noto'g'ri`);
  pass(/const b = \(ru, uz, en\) => \(\{ ru, uz, en \}\);/.test(source), `D${lesson}: UZ/RU/EN helper kontrakti yo'q`);
  pass(source.includes("['uz', 'ru', 'en']"), `D${lesson}: standalone UZ/RU/EN selector yo'q`);
  pass(!/Audio|useAudio|BitSVG|<Bit/.test(source), `D${lesson}: amaliyotda audio yoki Bit topildi`);
  pass(source.includes('aria-live="polite"'), `D${lesson}: aria-live yo'q`);
  pass(source.includes('@media(prefers-reduced-motion:reduce)'), `D${lesson}: reduced-motion yo'q`);
  pass(source.includes('min-width:44px') && source.includes('min-height:44px'), `D${lesson}: 44px touch target kontrakti yo'q`);
  pass(source.includes('firstTryCorrect') && source.includes('attemptsTotal') && source.includes('levelBreakdown') && source.includes('screenMeta: SCREEN_META'), `D${lesson}: LMS diagnostik payload to'liq emas`);
  for (const snippet of expected[lesson].snippets) pass(source.includes(snippet), `D${lesson}: tayanch mazmun topilmadi — ${snippet}`);
  console.log(`✓ Dars${lesson}Practice: 10 topshiriq, 2/5/3, ${kinds.size} mexanika, JSX parse`);
}

const registry = fs.readFileSync(path.join(root, 'src/lessons/grade4.js'), 'utf8');
for (const lesson of lessons) {
  pass(registry.includes(`slug: '${expected[lesson].slug}'`), `Registry: D${lesson} slug yo'q`);
  pass(registry.includes(`Dars${lesson}Practice.jsx`), `Registry: D${lesson} import yo'q`);
}

if (failures.length) {
  console.error(`\n${failures.length} ta audit xatosi:`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('\n✓ D17–D21 amaliy darslar auditi muvaffaqiyatli yakunlandi.');
