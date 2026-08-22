#!/usr/bin/env node
// 4-sinf nazariy darslarining QOIDA ekrani: hamma qator ochiladimi?
//
// Nima uchun kerak (2026-08-21 auditi): `kit/blocks.jsx` dagi `RuleRows` da bir
// qadamlik xato bor edi — qator `index` ovozning `index + 1` segmentida
// ochilardi. Lekin kontentda segment 0 aynan BIRINCHI qadamni ta'riflaydi
// ("Birinchi qadam: ..."), shuning uchun OXIRGI qator hech qachon ochilmasdi va
// bola qoidaning bir qismini ko'rmasdi. 16-20 darslarda 4 qatordan 3 tasi,
// 42-51 darslarda 3 dan 2 tasi ochilardi; faqat Dars30 to'g'ri ishlardi, chunki
// unda `frame + 1` deb vaqtinchalik kompensatsiya qilingan edi.
//
// Tekshiruv oddiy: ovoz o'chirilgan holatda kadrlar oxirigacha o'tadi, so'ng
// `.kit-rule-row` va `.kit-rule-row.is-open` soni taqqoslanadi. Ular teng
// bo'lishi shart.
//
// Ishlatish:
//   npx vite preview --port 4173 --strictPort
//   node scripts/grade4-rule-rows-audit.mjs
import process from 'node:process';
import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://localhost:4173';
const JOBS = Number(process.env.JOBS || 4);

// Faqat `RuleRows` ishlatadigan kit-darslari. Ro'yxat qo'lda emas, kodning
// o'zidan olinishi kerak bo'lsa — `grep -l RuleRows src/components/grade4`.
const SLUGS = {
  16: 'dars16-formulalar',
  17: 'dars17-shkalalar',
  18: 'dars18-kasr-tushunchasi',
  19: 'dars19-kasrlarni-taqqoslash',
  20: 'dars20-kasrlarni-qoshish',
  30: 'dars30-kattalik-birliklarini-aylantirish',
  42: 'dars42-tenglamalar',
  43: 'dars43-tenglamalarni-yechish-va-tekshirish',
  44: 'dars44-murakkab-masalalar',
  45: 'dars45-harakatga-doir-masalalar',
  46: 'dars46-qism-va-butunni-topish',
  47: 'dars47-tengsizliklarni-tanlash-usuli',
  48: 'dars48-qoshish-xossalari',
  49: 'dars49-mulohazalar-va-hukmlar',
  50: 'dars50-grafiklar-va-malumotlar',
  51: 'dars51-yakuniy-takrorlash',
};

const lessons = process.argv.slice(2).length
  ? process.argv.slice(2).map(Number)
  : Object.keys(SLUGS).map(Number);

const browser = await chromium.launch();
const results = [];

const auditLesson = async (lesson) => {
  const slug = SLUGS[lesson];
  if (!slug) { results.push({ lesson, note: 'slug topilmadi' }); return; }
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  try {
    await page.goto(`${BASE}/4-sinf/matematika/nazariy/${slug}`, { waitUntil: 'load' });
    await page.waitForSelector('.stage', { timeout: 40000 });
    await page.waitForTimeout(500);
    const mute = page.locator('.audio-controls button, .audio-indicator button').first();
    if (await mute.count()) await mute.click();
    await page.waitForTimeout(400);
    const total = Number((((await page.locator('.screen-count').first().textContent()) || '/ 16').split('/')[1] || '16').trim()) || 16;

    let found = null;
    for (let screen = 0; screen < total; screen += 1) {
      await page.waitForTimeout(380);
      if (await page.locator('.kit-rule-row').count()) {
        // Kadrlar ovoz o'chirilganda ham qadam bilan ochiladi — kutamiz.
        await page.waitForTimeout(2500);
        found = await page.evaluate(() => ({
          rows: document.querySelectorAll('.kit-rule-row').length,
          open: document.querySelectorAll('.kit-rule-row.is-open').length,
          screen: document.querySelector('.screen-count')?.textContent?.trim() ?? '',
        }));
        break;
      }
      const next = page.locator('.stage-nav button:last-child, .btn-next').last();
      if (!(await next.count())) break;
      if (await next.isDisabled().catch(() => true)) {
        const any = page.locator([
          '[data-g4-correct="true"]:not([disabled])', '.option:not([disabled])',
          '.tile:not([disabled])', '.slot:not([disabled])', '.chip:not([disabled])',
          '.token:not([disabled])', '.order-card:not([disabled])',
          '.span-cell:not([disabled])', '.level-tick:not([disabled])',
        ].join(', '));
        const n = Math.min(await any.count(), 10);
        for (let k = 0; k < n; k += 1) {
          await any.nth(k).click().catch(() => {});
          await page.waitForTimeout(300);
          if (!(await next.isDisabled().catch(() => true))) break;
        }
      }
      if (await next.isDisabled().catch(() => true)) break;
      await next.click().catch(() => {});
    }
    results.push({ lesson, found });
  } catch (error) {
    results.push({ lesson, error: String(error).slice(0, 120) });
  }
  await page.close();
};

const queue = [...lessons];
await Promise.all(Array.from({ length: Math.min(JOBS, queue.length) }, async () => {
  while (queue.length) await auditLesson(queue.shift());
}));
await browser.close();

results.sort((a, b) => a.lesson - b.lesson);
let bad = 0;
for (const item of results) {
  if (item.error) { bad += 1; console.log(`Dars${item.lesson}: XATO ${item.error}`); continue; }
  if (item.note) { bad += 1; console.log(`Dars${item.lesson}: ${item.note}`); continue; }
  if (!item.found) { bad += 1; console.log(`Dars${item.lesson}: qoida ekrani topilmadi`); continue; }
  const { rows, open, screen } = item.found;
  const ok = open === rows && rows > 0;
  if (!ok) bad += 1;
  console.log(`Dars${item.lesson} (${screen}): ${rows} qator, ${open} ochilgan${ok ? '' : "  <-- MUAMMO: qator ochilmay qoldi"}`);
}
console.log(`\n${results.length} dars, ${bad} tasida muammo.`);
process.exit(bad ? 1 : 0);
