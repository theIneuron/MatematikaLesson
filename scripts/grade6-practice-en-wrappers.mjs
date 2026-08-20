// Amaliyot sahifasining qobig'ini uch tilga o'tkazadi: sarlavhaga inglizchasi
// qo'shiladi, PracticeHost esa uchta til tugmasini chiqaradi.
// Bir marta ishlatiladi, lekin qayta ishga tushirsa ham zarari yo'q.
//
//   node scripts/grade6-practice-en-wrappers.mjs
import fs from 'node:fs';
import path from 'node:path';
import { CR, LF, PRACTICE_DIR, TOTAL_LESSONS, pad } from './grade6-practice-en-lib.mjs';

const TITLES_EN = {
  1: 'Divisors and multiples',
  2: 'Divisibility by 2, 5 and 10',
  3: 'Divisibility by 3 and 9',
  4: 'Prime and composite numbers',
  5: 'The greatest common divisor',
  6: 'The least common multiple',
  7: 'The basic property of a fraction',
  8: 'Reducing fractions',
  9: 'Bringing fractions to a common denominator',
  10: 'Adding and subtracting fractions',
  11: 'Multiplying common fractions',
  12: 'Dividing common fractions',
  13: 'Reciprocals and finding the whole',
  14: 'Multiplying and dividing decimals',
  15: 'Repeating decimals and rounding',
  16: 'Problems with fractions and decimals',
  17: 'Ratio',
  18: 'Proportion',
  19: 'Direct and inverse proportion',
  20: 'Scale',
  21: 'Percentages',
  22: 'Percentage problems',
  23: 'Proportion problems',
  24: 'The coordinate line',
  25: 'The modulus of a number',
  26: 'Comparing rational numbers',
  27: 'Adding rational numbers',
  28: 'Subtracting rational numbers',
  29: 'Multiplying and dividing rational numbers',
  30: 'The coordinate plane',
  31: 'Expressions with letters',
  32: 'Opening brackets',
  33: 'Collecting like terms',
  34: 'Linear equations',
  35: 'Solving problems with equations',
  36: 'Money problems and work problems',
  37: 'The circle and the disc',
  38: 'The circumference of a circle',
  39: 'The area of a disc',
  40: 'Line symmetry',
  41: 'Point symmetry',
  42: 'Elements, kinds and perimeter of a triangle',
  43: 'The area of a triangle and of compound shapes',
  44: 'The volume of solids and units of measure',
  45: 'Working with data',
  46: 'Wrap-up of the geometry and data block',
};

const TITLE_BLOCK = /^const TITLE = \{[\s\S]*?^\};$/m;
let patched = 0;

for (let lesson = 1; lesson <= TOTAL_LESSONS; lesson += 1) {
  const file = path.join(PRACTICE_DIR, `dars${pad(lesson)}`, `Dars${pad(lesson)}Practice.jsx`);
  const src = fs.readFileSync(file, 'utf8');
  const crlf = src.includes(CR + LF);
  let out = src.split(CR).join('');

  const block = out.match(TITLE_BLOCK);
  if (!block) throw new Error(`${file}: TITLE bloki topilmadi`);
  const literal = block[0].replace(/^const TITLE = /, '').replace(/;$/, '');
  // eslint-disable-next-line no-new-func
  const title = new Function(`return ${literal}`)();
  const next = { uz: title.uz, ru: title.ru, en: `Lesson ${lesson} practice. ${TITLES_EN[lesson]}` };
  out = out.replace(block[0], `const TITLE = ${JSON.stringify(next, null, 2)};`);

  if (!out.includes('langs={')) {
    out = out.replace('          showLanguageSwitch\n', "          showLanguageSwitch\n          langs={['uz', 'ru', 'en']}\n");
    if (!out.includes('langs={')) throw new Error(`${file}: showLanguageSwitch topilmadi`);
  }

  fs.writeFileSync(file, crlf ? out.split(LF).join(CR + LF) : out, 'utf8');
  patched += 1;
}

console.log(`qobiq yangilandi: ${patched} dars`);
