// 6-sinf amaliyoti: EKRANDA tillar aralashib ketmasin.
//
// Statik tekshiruv fayl ichini ko'radi, bu esa ekranni: har bir topshiriqda
// uchta til ketma-ket bosiladi va ko'rinib turgan matn tekshiriladi.
//   uz — kirill harfi bo'lmasin;
//   ru — lotin so'zi bo'lmasin (o'lchov birligi, o'zgaruvchi va nuqta nomidan boshqa);
//   en — kirill harfi bo'lmasin.
//
// Ishlatish:
//   npx vite --port 5197
//   node scripts/grade6-practice-lang-smoke.mjs 1-46
import { chromium } from 'playwright';
import { grade6Amaliy } from '../src/lessons/grade6.js';
import { TASKS_PER_LESSON, parseLessons } from './grade6-practice-en-lib.mjs';

const BASE = process.env.SMOKE_BASE || 'http://127.0.0.1:5197';
const CYRILLIC = /[Ѐ-ӿ]/;
// Ruscha ekranda lotin yozuvi faqat shu ro'yxatdan bo'lishi mumkin.
const RU_LATIN_OK = new Set([
  'cm', 'km', 'mm', 'dm', 'm', 'kg', 'g', 'l', 'ml', 't', 'min', 's', 'h',
  'x', 'y', 'a', 'b', 'c', 'n', 'k', 'p', 'q', 'r', 'd', 'v', 'f',
  'ab', 'abc', 'ah', 'bh', 'pr', 'xy', 'ii', 'iii', 'iv', 'vi', 'vii', 'viii', 'ix',
]);

const lessons = parseLessons(process.argv.slice(2));
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
const errors = [];
let screens = 0;

const visible = () => page.evaluate(() => {
  // Ko'paytirish nuqtasi bo'sh span bo'lib chiziladi: matnda «p·n» «pn» ga aylanib,
  // formulani uzbekcha so'zga o'xshatib qo'yadi. Shuning uchun o'rniga bo'shliq qo'yamiz.
  const read = (node) => {
    if (!node) return '';
    const copy = node.cloneNode(true);
    copy.querySelectorAll('.g6q-multiply-dot, .g6q-frac i').forEach((dot) => {
      dot.replaceWith(document.createTextNode(' '));
    });
    return copy.textContent || '';
  };
  return [
    read(document.querySelector('.g6q-tag')),
    read(document.querySelector('.g6q h2')),
    read(document.querySelector('.g6q-explain')),
    ...[...document.querySelectorAll('.g6q-option, .g6q-card')].map(read),
    read(document.querySelector('.g6-body strong')),
  ].join(' · ');
});

for (const lesson of lessons) {
  const { slug } = grade6Amaliy[lesson - 1];
  await page.goto(`${BASE}/6-sinf/matematika/amaliy/${slug}`, { waitUntil: 'networkidle' });
  await page.waitForSelector('.g6q-tag', { timeout: 15000 });

  for (let task = 1; task <= TASKS_PER_LESSON; task += 1) {
    await page.locator('.g6-tabs button').nth(task - 1).click();
    await page.waitForSelector('.g6q-tag');

    for (const lang of ['uz', 'ru', 'en']) {
      const where = `dars ${lesson}/${task} ${lang.toUpperCase()}`;
      await page.getByRole('button', { name: lang.toUpperCase(), exact: true }).click();
      await page.waitForTimeout(80);
      const text = await visible();
      screens += 1;

      if (lang !== 'ru' && CYRILLIC.test(text)) {
        const hit = text.match(/[^\s·]*[Ѐ-ӿ][^\s·]*/)?.[0] || '';
        errors.push(`${where}: kirill harflari — «${hit}»`);
      }
      if (lang === 'ru') {
        for (const word of text.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, '').split(/[^A-Za-z]+/)) {
          if (word.length < 2 || word === word.toUpperCase()) continue;
          if (!RU_LATIN_OK.has(word.toLowerCase())) errors.push(`${where}: lotin so'z «${word}»`);
        }
      }
    }
  }
  console.log(`dars ${String(lesson).padStart(2)}: ${TASKS_PER_LESSON * 3} ekran${errors.length ? ` · xato ${errors.length}` : ''}`);
}

await context.close();
await browser.close();
console.log(`tekshirildi: ${screens} ekran`);
if (errors.length) {
  console.error(`\nXATO (${errors.length}):`);
  for (const line of [...new Set(errors)]) console.error(`  ${line}`);
  process.exit(1);
}
console.log('tillar aralashmagan');
