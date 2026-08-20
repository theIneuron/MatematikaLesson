// 6-sinf amaliyoti: inglizcha til brauzerda ishlayotganini tekshiradi.
//
// Nima tekshiriladi (har bir darsda, ikkita ekran o'lchamida):
//   1. tilni almashtirgichda EN tugmasi bor va bosilmoqda;
//   2. mavzu, savol, yo'riqnoma va variant yozuvlarida kirill harfi yo'q;
//   3. platforma tugmasi va fikr matni inglizcha ("Check", "Correct");
//   4. gorizontal skroll paydo bo'lmaydi (MOBIL_DESKTOP_MOSLASH).
//
// Ishlatish:
//   npx vite --port 5197
//   node scripts/grade6-practice-en-smoke.mjs 1-46 [--tasks 1,5,3]
import { chromium } from 'playwright';
import { grade6Amaliy } from '../src/lessons/grade6.js';
import { parseLessons } from './grade6-practice-en-lib.mjs';

const BASE = process.env.SMOKE_BASE || 'http://127.0.0.1:5197';
const VIEWPORTS = [
  { width: 1280, height: 900, name: 'desktop' },
  { width: 390, height: 844, name: 'mobil' },
];
const CYRILLIC = /[Ѐ-ӿ]/;

const args = process.argv.slice(2);
const taskArg = args.find((a) => a.startsWith('--tasks'));
const tasks = taskArg
  ? taskArg.split('=')[1].split(',').map(Number)
  : [1, 3, 5];
const lessons = parseLessons(args.filter((a) => !a.startsWith('--')));

const browser = await chromium.launch();
const errors = [];
let checked = 0;

for (const viewport of VIEWPORTS) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await context.newPage();
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`konsol xatosi: ${message.text().slice(0, 120)}`);
  });

  for (const lesson of lessons) {
    const { slug } = grade6Amaliy[lesson - 1];
    await page.goto(`${BASE}/6-sinf/matematika/amaliy/${slug}`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.g6q-tag', { timeout: 15000 });

    for (const task of tasks) {
      const where = `dars ${lesson}/${task} (${viewport.name})`;
      await page.locator('.g6-tabs button').nth(task - 1).click();
      await page.waitForSelector('.g6q-tag');

      const en = page.getByRole('button', { name: 'EN', exact: true });
      if (!await en.count()) { errors.push(`${where}: EN tugmasi yo'q`); continue; }
      await en.click();
      await page.waitForTimeout(120);

      const seen = await page.evaluate(() => ({
        topic: document.querySelector('.g6q-tag')?.textContent || '',
        prompt: document.querySelector('.g6q h2')?.textContent || '',
        guide: document.querySelector('.g6q-explain')?.textContent || '',
        labels: [...document.querySelectorAll('.g6q-option, .g6q-card')].map((n) => n.textContent),
        title: document.querySelector('.g6-body strong')?.textContent || '',
        buttons: [...document.querySelectorAll('button')].map((n) => n.textContent.trim()),
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      }));

      for (const [key, value] of Object.entries(seen)) {
        if (typeof value === 'string' && CYRILLIC.test(value)) {
          errors.push(`${where}: ${key} da kirill harflari — «${value.slice(0, 40)}»`);
        }
      }
      for (const label of seen.labels) {
        if (CYRILLIC.test(label)) errors.push(`${where}: variant yozuvida kirill — «${label.slice(0, 30)}»`);
      }
      if (!seen.topic.trim()) errors.push(`${where}: mavzu bo'sh`);
      if (!seen.prompt.trim()) errors.push(`${where}: savol bo'sh`);
      if (!seen.guide.trim()) errors.push(`${where}: yo'riqnoma bo'sh`);
      if (!seen.title.startsWith(`Lesson ${lesson} practice.`)) {
        errors.push(`${where}: sarlavha inglizcha emas — «${seen.title.slice(0, 40)}»`);
      }
      if (!seen.buttons.includes('Check')) errors.push(`${where}: «Check» tugmasi yo'q`);
      if (seen.overflow > 1) errors.push(`${where}: gorizontal skroll ${seen.overflow}px`);

      // Javob berib fikr matnini ham ko'ramiz: u ham inglizcha bo'lishi kerak.
      const option = page.locator('.g6q-option, .g6q-card').first();
      if (await option.count()) {
        await option.click();
        const input = page.locator('.g6q-input');
        if (await input.count()) await input.fill('1');
        const check = page.getByRole('button', { name: 'Check', exact: true });
        if (await check.isEnabled()) {
          await check.click();
          await page.waitForSelector('.g6q-feedback', { timeout: 4000 }).catch(() => {});
          const feedback = await page.locator('.g6q-feedback').textContent().catch(() => '');
          if (feedback && CYRILLIC.test(feedback)) {
            errors.push(`${where}: fikr matnida kirill — «${feedback.slice(0, 40)}»`);
          }
          if (feedback && !/Correct|not right/.test(feedback)) {
            errors.push(`${where}: fikr matni inglizcha emas — «${feedback.slice(0, 40)}»`);
          }
        }
      }
      checked += 1;
    }
    console.log(`dars ${String(lesson).padStart(2)} (${viewport.name}): ${tasks.length} ekran${errors.length ? ` · xato ${errors.length}` : ''}`);
  }
  await context.close();
}

await browser.close();
console.log(`tekshirildi: ${checked} topshiriq ekrani`);
if (errors.length) {
  console.error(`\nXATO (${errors.length}):`);
  for (const line of [...new Set(errors)]) console.error(`  ${line}`);
  process.exit(1);
}
console.log('xato yo\'q');
