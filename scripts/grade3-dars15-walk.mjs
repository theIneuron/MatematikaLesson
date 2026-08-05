// grade3-dars15-walk.mjs — 15-darsni OVOZSIZ boshidan oxirigacha bosib o'tadi (QA, etap 4).
// Har ekranda: ovoz o'chiriladi, topshiriq HAQIQIY kliklar bilan yechiladi, keyin o'lchanadi
//   .stage-content skrolli (0 bo'lishi kerak) · konsol xatolari · «Davom» ochilganmi.
// Topshiriq turlari: MC variantlar (sinab), TAP qadamlar (btn-white-accent), NumPad (javob
//   CLI/ANSWERS dan), yopiq maydon (to'g'ri/noto'g'ri), final panel (num + mc).
//
// Ishlatish (npx vite --port 5179 --strictPort ko'tarilgan bo'lsin):
//   node scripts/grade3-dars15-walk.mjs
//   node scripts/grade3-dars15-walk.mjs --lang uz --size 390x844
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : d; };
const PORT = arg('port', '5179');
const SLUG = arg('slug', 'dars15-komponentlar-boglanishi');
const LANG = arg('lang', 'ru');
const [VW, VH] = arg('size', '1440x900').split('x').map(Number);
// NumPad javoblari: s8 (7,5,32) · s11 (48,6,4) · s12 (6) · s13 (9, 7)
const NUMS = arg('nums', '7,5,32,48,6,4,6,9,7').split(',');
const DBG = process.argv.includes('--debug');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: VW, height: VH } });
const errs = [];
page.on('pageerror', (e) => errs.push(`[pageerror] ${e.message.slice(0, 90)}`));
page.on('console', (m) => { if (m.type() === 'error') errs.push(`[console] ${m.text().slice(0, 90)}`); });

const mute = async () => {
  const b = page.locator('button[title="Sound off"]');
  if (await b.count()) { await b.first().click({ force: true }).catch(() => {}); await page.waitForTimeout(60); }
};
const state = () => page.evaluate(() => {
  const sc = document.querySelector('.stage-content');
  const nx = Array.from(document.querySelectorAll('button')).find((b) => /^(Дальше|Davom etish|Завершить|Tugatish)$/.test((b.textContent || '').trim()));
  return {
    over: sc ? sc.scrollHeight - sc.clientHeight : null,
    screen: (document.querySelector('.stage-top .mono, .mono') || {}).textContent || '',
    title: (document.querySelector('.stage-content h1.title, .stage-content h2.title') || {}).textContent || '',
    opts: document.querySelectorAll('button.option:not([disabled])').length,
    // TAP tugmalari: navigatsiya va «Проверить» dan boshqa hammasi (matn AYNAN mos kelsa chiqarib tashlanadi:
    // «Проверить деление» — bu qadam tugmasi, «Проверить» — javob tugmasi).
    taps: Array.from(document.querySelectorAll('button.btn-white-accent')).filter((b) => !b.disabled && !/^(Дальше|Davom etish|Завершить|Tugatish|Проверить|Tekshir)$/.test((b.textContent || '').trim())).length,
    // MUHIM: javobdan keyin oxirgi savol EKRANDA QOLADI (metodist qoidasi), NumPad esa
    // O'CHIQ turadi — shuning uchun faqat FAOL (disabled emas) tugmalar hisobga olinadi.
    numpad: Array.from(document.querySelectorAll('button')).some((b) => /^[0-9]$/.test((b.textContent || '').trim()) && !b.disabled),
    check: Array.from(document.querySelectorAll('button')).some((b) => /Проверить|Tekshir/.test(b.textContent || '') && !b.disabled),
    cards: document.querySelectorAll('button.d12-card:not([disabled])').length,
    clock: !!document.querySelector('.lm-clock'),
    success: !!document.querySelector('.frame-success'),
    factcard: !!document.querySelector('.d2-factcard'),
    nextOn: nx ? !nx.disabled : false
  };
});

const solveMC = async () => {
  const n = await page.locator('button.option:not([disabled])').count();
  for (let i = 0; i < n; i += 1) {
    const btn = page.locator('button.option:not([disabled])').first();
    if (!(await btn.count())) break;
    await btn.click({ force: true });
    await page.waitForTimeout(340);
    // to'g'ri javob YASHIL bo'ladi YOKI variantlar umuman yo'qoladi (masala ekranida yozuv tanlangach)
    if (await page.locator('button.option.option-correct').count()) { await page.waitForTimeout(1500); return true; }
    if ((await page.locator('button.option:not([disabled])').count()) === 0) { await page.waitForTimeout(600); return true; }
  }
  return false;
};
const typeNum = async (ans) => {
  for (const d of String(ans).split('')) {
    await page.locator('button:visible').filter({ hasText: new RegExp(`^${d}$`) }).last().click({ force: true, timeout: 4000 }).catch(() => {});
    await page.waitForTimeout(70);
  }
  const chk = page.locator('button').filter({ hasText: /Проверить|Tekshir/ }).first();
  if (await chk.count()) { await chk.click({ force: true }); await page.waitForTimeout(2600); }
};

await page.goto(`http://localhost:${PORT}/3-sinf/matematika/nazariy/${SLUG}`, { waitUntil: 'networkidle' });
await page.waitForTimeout(900);
await mute();
if (LANG === 'uz') { const b = page.locator('button', { hasText: /^UZ$/ }); if (await b.count()) { await b.first().click({ force: true }); await page.waitForTimeout(250); } }

let numI = 0;
let bad = 0;
for (let scr = 0; scr < 15; scr += 1) {
  await mute();
  await page.waitForTimeout(250);
  // ekrandagi ishni bajaramiz (bir necha marta: tap qadamlar + savol)
  for (let guard = 0; guard < 18; guard += 1) {
    await mute();
    const st = await state();
    if (st.clock) { await page.waitForTimeout(1200); continue; }   // 5 soniyalik soat tugashini kutamiz
    if (st.cards) {
      await page.locator('button.d12-card:not([disabled])').first().click({ force: true }).catch(() => {});
      await page.waitForTimeout(500);
      continue;
    }
    if (st.taps) {
      await page.locator('button.btn-white-accent').filter({ hasNotText: /^(Дальше|Davom etish|Завершить|Tugatish|Проверить|Tekshir)$/ }).first().click({ force: true }).catch(() => {});
      await page.waitForTimeout(420);
      continue;
    }
    if (st.numpad) {
      const ans = NUMS[numI]; numI += 1;
      if (!ans) { if (DBG) console.log(`   [dbg] javob tugadi (numI=${numI})`); break; }
      if (DBG) console.log(`   [dbg] ekran ${scr}: teramiz ${ans}`);
      await typeNum(ans);
      continue;
    }
    if (st.opts) { if (!(await solveMC())) break; continue; }
    break;
  }
  await page.waitForTimeout(400);
  const st = await state();
  const finished = st.success || st.factcard || !(st.opts || st.numpad || st.taps || st.cards || st.clock);
  const ok = st.over === 0 && st.nextOn && finished;
  if (!ok) bad += 1;
  console.log(`ekran ${String(scr).padStart(2)} | ${ok ? 'OK ' : 'XATO'} | skroll +${st.over} | «Davom» ${st.nextOn ? 'ochiq' : 'YOPIQ'} | ${st.success ? 'boks bor' : 'boks yo\'q'} | ${(st.title || '').slice(0, 44)}`);
  if (scr < 14) {
    const nx = page.locator('button').filter({ hasText: /^(Дальше|Davom etish)$/ }).last();
    if (!(await nx.count())) { console.log('   «Davom» topilmadi — to\'xtadik'); break; }
    await nx.click({ force: true });
    await page.waitForTimeout(420);
  }
}
if (errs.length) { console.log('\nKONSOL XATOLARI:'); [...new Set(errs)].slice(0, 6).forEach((e) => console.log('  ' + e)); }
console.log(`\n${LANG.toUpperCase()} ${VW}x${VH}: muammoli ekran ${bad}, konsol xatosi ${new Set(errs).size}`);
await browser.close();
process.exit(bad || errs.length ? 1 : 0);
