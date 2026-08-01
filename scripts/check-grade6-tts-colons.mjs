import { normalizeTtsColons } from '../src/components/grade6/ttsMathColon.js';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from '@babel/parser';

const options = {
  divisionWord: " bo'lingan ",
  ratioWord: ' nisbat ',
};

const cases = [
  ['Qoida: sonning oxirgi raqamiga qarang.', 'Qoida, sonning oxirgi raqamiga qarang.'],
  ['Masalan: 12 : 3 = 4.', "Masalan, 12 bo'lingan 3 = 4."],
  ['Bekatdan 7:00 da jo‘naydi.', 'Bekatdan 7 da jo‘naydi.'],
  ['d=C:π.', "d=C bo'lingan π."],
  ['x̄=(x₁+x₂):n.', "x̄=(x₁+x₂) bo'lingan n."],
  ['A(−3;2): O dan chapda.', 'A(−3;2), O dan chapda.'],
];

let failed = false;

for (const [input, expected] of cases) {
  const actual = normalizeTtsColons(input, options);
  const passed = actual === expected;
  console.log(`${passed ? 'PASS' : 'FAIL'} | ${input} => ${actual}`);
  if (!passed) failed = true;
}

const ratio = normalizeTtsColons('Nisbat 3 : 5 va a:b.', {
  ...options,
  ratioContext: true,
});
const ratioPassed = ratio === 'Nisbat 3 nisbat 5 va a nisbat b.';
console.log(`${ratioPassed ? 'PASS' : 'FAIL'} | ${ratio}`);
if (!ratioPassed) failed = true;

const grade6Dir = fileURLToPath(new URL('../src/components/grade6/', import.meta.url));
const lessonFiles = (await readdir(grade6Dir))
  .filter((name) =>
    /^Dars(?:0[1-9]|1[0-5])\.jsx$/.test(name) ||
    /^Grade6TheoryData(?:16_26|27_46)\.js$/.test(name) ||
    name === 'Grade6LifeContexts.js' ||
    name === 'Grade6ConceptBridges.js')
  .sort();

const punctuationColonRe = /\p{L}[\p{L}\p{M}'’ʻ‘-]*:\s+\p{L}/gu;
const timeColonRe = /\b(?:[01]?\d|2[0-3]):[0-5]\d\b/g;
let punctuationCount = 0;
let timeCount = 0;

function collectStrings(node, output) {
  if (!node || typeof node !== 'object') return;
  if (node.type === 'StringLiteral') output.push(node.value);
  if (node.type === 'TemplateElement') output.push(node.value.cooked || node.value.raw);
  for (const value of Object.values(node)) {
    if (Array.isArray(value)) value.forEach((item) => collectStrings(item, output));
    else if (value && typeof value === 'object') collectStrings(value, output);
  }
}

for (const fileName of lessonFiles) {
  const source = await readFile(join(grade6Dir, fileName), 'utf8');
  const ast = parse(source, {
    sourceType: 'module',
    plugins: ['jsx'],
  });
  const strings = [];
  collectStrings(ast, strings);

  for (const text of strings) {
    for (const match of text.matchAll(punctuationColonRe)) {
      punctuationCount += 1;
      const normalized = normalizeTtsColons(match[0], options);
      if (normalized.includes("bo'lingan") || normalized.includes(':')) {
        console.error(`FAIL | ${fileName} | tinish belgisi: ${match[0]} => ${normalized}`);
        failed = true;
      }
    }
    for (const match of text.matchAll(timeColonRe)) {
      timeCount += 1;
      const normalized = normalizeTtsColons(match[0], options);
      if (normalized.includes("bo'lingan") || normalized.includes(':')) {
        console.error(`FAIL | ${fileName} | vaqt: ${match[0]} => ${normalized}`);
        failed = true;
      }
    }
  }
}

console.log(
  `${failed ? 'FAIL' : 'PASS'} | 1–46 nazariy dars auditi: ` +
  `${punctuationCount} ta matn ikki nuqtasi, ${timeCount} ta vaqt yozuvi tekshirildi.`,
);

if (failed) process.exitCode = 1;
