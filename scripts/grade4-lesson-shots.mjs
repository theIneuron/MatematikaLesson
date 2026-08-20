#!/usr/bin/env node
// Dars ekranlarining suratini oladi va har ekranning o'lchovini bosib chiqaradi.
// Vizual ko'rikni tez qilish uchun: ramka balandligi, skroll, sarlavha.
//
// Ishlatish:
//   npx vite --port 5179 --strictPort
//   node scripts/grade4-lesson-shots.mjs /4-sinf/matematika/nazariy/<slug> [papka]
import { mkdirSync } from 'node:fs';
import process from 'node:process';
import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://localhost:5179';
const ROUTE = process.argv[2];
const OUT = process.argv[3] || 'tmp-shots';
const WIDTH = Number(process.env.W || 1440);
const HEIGHT = Number(process.env.H || 900);

if (!ROUTE) {
  console.error('Marshrut kerak: node scripts/grade4-lesson-shots.mjs /4-sinf/...');
  process.exit(2);
}
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT } });
const errors = [];
page.on('pageerror', (error) => errors.push(String(error)));
page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });

await page.goto(BASE + ROUTE, { waitUntil: 'networkidle' });
await page.waitForSelector('.stage', { timeout: 30000 });
const mute = page.locator('.audio-controls button').first();
if (await mute.count()) await mute.click();
await page.waitForTimeout(400);

for (let screen = 0; screen < 40; screen += 1) {
  // Ovoz o'chirilgan bo'lsa ham kadrlar 900 ms dan qadam tashlaydi:
  // surat to'liq ochilgan holatda olinishi uchun kutamiz.
  await page.waitForTimeout(Number(process.env.WAIT || 4200));
  const info = await page.evaluate(() => {
    const stage = document.querySelector('.stage');
    const body = document.querySelector('.stage-body');
    const card = document.querySelector('.model-card, .hero-scene');
    const rect = card?.getBoundingClientRect();
    return {
      count: document.querySelector('.screen-count')?.textContent?.trim() ?? '',
      title: (document.querySelector('.screen-title, .final-mission-heading h1')?.textContent ?? '').trim(),
      over: Math.max(
        stage ? stage.scrollHeight - stage.clientHeight : 0,
        body ? body.scrollHeight - body.clientHeight : 0,
      ),
      frame: rect ? `${Math.round(rect.width)}x${Math.round(rect.height)}` : '-',
      last: document.querySelector('.btn-next')?.textContent?.includes('yakunlash') ?? false,
    };
  });
  console.log(`${info.count.padEnd(8)} frame ${info.frame.padEnd(9)} over ${String(info.over).padEnd(3)} ${info.title.slice(0, 40)}`);
  await page.screenshot({ path: `${OUT}/s${String(screen).padStart(2, '0')}.png` });
  if (info.last) break;
  const next = page.locator('.btn-next');
  if (await next.isDisabled()) {
    const right = page.locator('[data-g4-correct="true"]');
    if (await right.count()) await right.first().click({ force: true });
    else {
      const any = page.locator('.slot:not(:disabled), .option:not(:disabled)');
      if (await any.count()) await any.first().click({ force: true });
    }
    await page.waitForTimeout(500);
  }
  if (await next.isDisabled()) { console.log(`   -> ${info.count}: "Davom" ochilmadi`); break; }
  await next.click({ force: true });
}

console.log(errors.length ? `konsol xatolari: ${errors.length}` : 'konsol toza');
await browser.close();
