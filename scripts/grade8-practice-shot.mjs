// 8-sinf amaliyoti: BITTA TOPSHIRIQNING KADRI — javobdan oldin va keyin.
//
// NEGA. `grade8-practice-check.mjs` faqat O'LCHAYDI: kontent kadrga sig'dimi,
// ball berildimi, razbor bo'sh emasmi. U «ko'rinishi qanday» degan savolga
// javob bermaydi, va yangi mexanika qo'shilganda aynan shu savol qoladi.
// TIPLAR_AMALIYOT_8SINF.md §8 bu skriptni sanab o'tgan edi, lekin u
// yozilmagan edi — 2026-08-22 da yozildi.
//
// Ishlatish:
//   npx vite --port 5199                          (alohida terminalda)
//   node scripts/grade8-practice-shot.mjs dars01 04 ru
//   node scripts/grade8-practice-shot.mjs dars01 04,07,09 uz telefon
//
// Kadrlar `.tmp/shots/` ga tushadi: <dars>-<id>-<til>-<o'lcham>-{1,2}.png
// (1 — javob berilgan, tekshirilmagan; 2 — tekshirilgan, razbor ko'rinadi).
import fs from 'node:fs';
import { chromium } from 'playwright';
import { LESSONS, VIEWPORTS } from './grade8-practice-plan.mjs';

const BASE = process.env.G8_BASE || 'http://localhost:5199';
const [lessonId = 'dars01', idsRaw = '01', lang = 'uz', vpName = 'noutbuk'] = process.argv.slice(2);
const ids = idsRaw.split(',').map((s) => s.trim());
const lesson = LESSONS.find((l) => l.id === lessonId);
const vp = VIEWPORTS.find((v) => v.name === vpName);
if (!lesson || !lesson.plan) throw new Error(`dars topilmadi yoki rejasi yo'q: ${lessonId}`);
if (!vp) throw new Error(`o'lcham topilmadi: ${vpName} (${VIEWPORTS.map((v) => v.name).join(', ')})`);

const OUT = '.tmp/shots';
fs.mkdirSync(OUT, { recursive: true });

// Harakat tili `grade8-practice-plan.mjs` bilan bir xil bo'lishi kerak:
// ikki joyda ikki xil bo'lsa, kadr tekshiruv ko'rgan holatni ko'rsatmaydi.
async function act(page, step) {
  if (step.fill) {
    const [name, text] = step.fill;
    const fold = page.locator(`[data-fold="${name}"]`);
    if (await fold.count()) await fold.first().click();
    await page.locator(`input[data-input="${name}"]`).first().fill(text);
    return;
  }
  if (step.range !== undefined) { await page.locator('[data-slider="1"]').first().fill(String(step.range)); return; }
  if (step.tap) { for (const sel of step.tap) await page.locator(sel).first().click(); return; }
  await page.locator(step.click).first().click();
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
await page.goto(`${BASE}${lesson.route}?lang=${lang}`, { waitUntil: 'networkidle' });
await page.waitForSelector('.pq-fixroot', { timeout: 15000 });

for (const id of ids) {
  const task = lesson.plan.find((t) => t.id === id);
  if (!task) { process.stdout.write(`${id}: rejada yo'q, o'tkazib yuborildi\n`); continue; }
  await page.locator(`[data-q="${id}"]`).first().click();
  await page.waitForTimeout(150);
  for (const step of (process.env.G8_WRONG === '1' ? task.no : task.ok)) { await act(page, step); await page.waitForTimeout(70); }
  const stem = `${OUT}/${lessonId}-${id}-${lang}-${vpName}`;
  await page.screenshot({ path: `${stem}-1.png` });
  await page.locator('[data-check="1"]').click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${stem}-2.png` });
  process.stdout.write(`${stem}-1.png, ${stem}-2.png\n`);
}

await browser.close();
