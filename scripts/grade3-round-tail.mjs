// grade3-round-tail.mjs — ketma-ket savolli ekranning OXIRI tekshiriladi.
// Metodist qarori 2026-08-05: oxirgi savol javobdan keyin ham EKRANDA QOLADI, natija boksi
// esa uning OSTIDA yumshoq paydo bo'ladi. Ilgari savol yo'qolib, ekranda faqat boks qolardi.
//
// Skript: darsni ochadi, HAR ekranda ovozni o'chiradi, «Davom» bilan kerakli ekranga boradi,
// savollarni haqiqiy kliklar bilan yechadi (MC — variantlarni sinab, to'g'risi YASHIL bo'lguncha;
// NumPad — CLI dan berilgan javoblarni terib), keyin o'lchaydi:
//   savol matni bormi · yashil variant qolganmi · hisoblagich N / N · natija boksi bormi ·
//   .stage-content skroll (scrollHeight - clientHeight) · konsol xatolari.
//
// Ishlatish (превью ko'tarilgan bo'lsin: npx vite --port 5179 --strictPort):
//   node scripts/grade3-round-tail.mjs
//   node scripts/grade3-round-tail.mjs --sizes 1440x900,1366x768,390x844
//   node scripts/grade3-round-tail.mjs --cases "dars13-amallar-tartibi:10:17,9,16"
// case formati: slug:ekranIndeks[:numpadJavoblari]
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : d; };
const PORT = arg('port', '5179');
const BASE = `http://localhost:${PORT}`;
const SIZES = arg('sizes', '1440x900,1366x768,390x844').split(',').map((s) => s.split('x').map(Number));
const CASES = arg('cases', [
  'dars01-yuzlik-onlik-birlik:8',                       // son yig'ish (razryad konsoli, 3 raund)
  'dars01-yuzlik-onlik-birlik:9',                       // METODIST SKRINSHOTI: tasniflash «4 / 4»
  'dars01-yuzlik-onlik-birlik:10',                      // MC praktika ×3
  'dars01-yuzlik-onlik-birlik:11',                      // taqqoslash raundi (belgi)
  'dars02-oqish-yozish:9:268,410,700',                  // so'zdan raqamga (NumPad ×3)
  'dars03-razryad-qoshiluvchilari:8:463,529,780',       // yoyilmadan songa (NumPad ×3)
  'dars07-yozma-qoshish-ayirish:6:3777,5634,6902',      // ustun mashqi (NumPad ×3)
  'dars11-yigindini-kopaytirish:8',
  'dars12-yigindini-bolish:8',
  'dars13-amallar-tartibi:8',                           // test MC ×3
  'dars13-amallar-tartibi:10:17,9,16'                   // NumPad trenajyor ×3
].join('|')).split('|');
const LANG = arg('lang', 'ru');

const mute = async (page) => {
  const b = page.locator('button[title="Sound off"]');
  if (await b.count()) { await b.first().click({ force: true }).catch(() => {}); await page.waitForTimeout(80); }
};
const next = async (page) => {
  const nx = page.locator('button.btn-white-accent').last();
  if (!(await nx.count())) return false;
  await nx.click({ force: true });
  await page.waitForTimeout(240);
  await mute(page);
  return true;
};

const state = (page) => page.evaluate(() => {
  const sc = document.querySelector('.stage-content');
  const txt = (el) => (el ? el.textContent.trim().replace(/\s+/g, ' ') : null);
  return {
    over: sc ? sc.scrollHeight - sc.clientHeight : null,
    question: txt(document.querySelector('.stage-content h1.title, .stage-content h2.title')),
    counters: Array.from(document.querySelectorAll('.stage-content .mono')).map((e) => e.textContent.trim()).filter((s) => /\d\s*\/\s*\d/.test(s)),
    opts: document.querySelectorAll('button.option').length,
    green: document.querySelectorAll('button.option.option-correct').length,
    signs: document.querySelectorAll('button.lm-signbtn').length,
    signOk: document.querySelectorAll('button.lm-signbtn.lm-signbtn-ok').length,
    signSlot: (document.querySelector('.lm-cmpslot') || {}).textContent || null,
    factcard: !!document.querySelector('.d2-factcard'),
    success: !!document.querySelector('.frame-success'),
    successAnim: (() => { const e = document.querySelector('.frame-success'); return e ? [...e.classList].join(' ') : null; })(),
    numVal: (document.querySelector('.stage-content .mono[data-np], .np-display') || {}).textContent || null
  };
});

const browser = await chromium.launch();
let fails = 0;
for (const [vw, vh] of SIZES) {
  console.log(`\n=== ${vw}x${vh} · ${LANG} ===`);
  for (const c of CASES) {
    const [slug, sIdxRaw, numRaw] = c.split(':');
    const sIdx = Number(sIdxRaw);
    const nums = (numRaw || '').split(',').filter(Boolean);
    const page = await browser.newPage({ viewport: { width: vw, height: vh } });
    const errs = [];
    page.on('pageerror', (e) => errs.push(e.message.slice(0, 80)));
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 80)); });
    try {
      await page.goto(`${BASE}/3-sinf/matematika/nazariy/${slug}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(900);
      await mute(page);
      if (LANG === 'uz') { const b = page.locator('button', { hasText: /^UZ$/ }); if (await b.count()) { await b.first().click({ force: true }); await page.waitForTimeout(200); } }
      for (let i = 0; i < sIdx; i += 1) { if (!(await next(page))) break; }
      await page.waitForTimeout(400);
      await mute(page);

      // savollarni yechish
      let guard = 0;
      let numI = 0;
      for (;;) {
        guard += 1; if (guard > 24) break;
        // DEMO fazasi (tap-to-bin ekranlari): «Теперь я сам» tugmasi ochilishini kutamiz
        const self = page.locator('button.btn-white-accent').filter({ hasText: /Теперь я сам|Endi o'zim/ });
        if (await self.count()) {
          for (let w = 0; w < 40 && await self.first().isDisabled().catch(() => false); w += 1) await page.waitForTimeout(400);
          await self.first().click({ force: true }); await page.waitForTimeout(400); await mute(page);
        }
        const st = await state(page);
        if (st.success) break;
        if (st.opts) {
          let solved = false;
          for (let i = 0; i < st.opts; i += 1) {
            const btn = page.locator('button.option').nth(i);
            if (await btn.isDisabled().catch(() => true)) continue;
            await btn.click({ force: true });
            await page.waitForTimeout(300);
            const s2 = await state(page);
            if (s2.green) { solved = true; await page.waitForTimeout(1500); break; }
          }
          if (!solved) break;
        } else if (st.signs) {
          let solved = false;
          for (let i = 0; i < st.signs; i += 1) {
            const btn = page.locator('button.lm-signbtn').nth(i);
            if (await btn.isDisabled().catch(() => true)) continue;
            await btn.click({ force: true });
            await page.waitForTimeout(300);
            const s2 = await state(page);
            if (s2.signOk) { solved = true; await page.waitForTimeout(1600); break; }
          }
          if (!solved) break;
        } else if (await page.locator('.lm-digtray').count()) {
          // raqamlarni xonalarga ajratish (tap-to-bin): demo -> o'zi
          const self = page.locator('button.btn-white-accent').filter({ hasText: /Теперь я сам|Endi o'zim/ });
          if (await self.count()) {
            for (let w = 0; w < 40 && await self.first().isDisabled().catch(() => false); w += 1) await page.waitForTimeout(400);
            await self.first().click({ force: true }); await page.waitForTimeout(400); await mute(page);
          }
          const head = await page.locator('.stage-content h1.title').innerText().catch(() => '');
          const num = (head.match(/(\d{3})/) || [])[1];
          if (num) {
            // 1-dars: uch xonali son -> raqamlar xonalar bo'yicha tarqatiladi
            for (const [bi, d] of [...num].entries()) {
              const chip = page.locator('button.lm-digchip', { hasText: new RegExp(`^${d}$`) }).first();
              if (!(await chip.count())) break;
              await chip.click({ force: true }); await page.waitForTimeout(180);
              await page.locator('button.lm-bin').nth(bi).click({ force: true }); await page.waitForTimeout(950);
            }
          } else {
            // 16 va 18-dars: chipda IFODA, tokchalar xossaga ko'ra. To'g'ri tokcha oldindan
            // ma'lum emas — birinchisini sinaymiz, qabul qilmasa ikkinchisini.
            for (let round = 0; round < 8; round += 1) {
              const chip = page.locator('button.lm-digchip:not([disabled])').first();
              if (!(await chip.count())) break;
              await chip.click({ force: true }); await page.waitForTimeout(200);
              const bins = await page.locator('button.lm-bin').count();
              for (let b = 0; b < bins; b += 1) {
                const bin = page.locator('button.lm-bin').nth(b);
                if (await bin.isDisabled().catch(() => true)) continue;
                await bin.click({ force: true }); await page.waitForTimeout(500);
                if (await page.locator('button.lm-bin.lm-bin-full').count()) break;
              }
              await page.waitForTimeout(1400);
            }
          }
          await page.waitForTimeout(1400);
        } else if (await page.locator('button.lm-cons-btn-up').count()) {
          // sonni yig'ish (razryad konsoli): «+» bosib har xonani yig'amiz
          const head = await page.locator('.stage-content h1.title').innerText().catch(() => '');
          const num = (head.match(/(\d{3})/) || [])[1];
          if (!num) break;
          for (const [ci, d] of [...num].entries()) {
            for (let k = 0; k < Number(d); k += 1) { await page.locator('button.lm-cons-btn-up').nth(ci).click({ force: true }); await page.waitForTimeout(45); }
          }
          const chk = page.locator('button.btn-white-accent').filter({ hasText: /Проверить|Tekshir/ }).first();
          if (await chk.count()) { await chk.click({ force: true }); await page.waitForTimeout(1300); } else break;
        } else if (nums.length) {
          const ans = nums[numI]; numI += 1;
          if (!ans) break;
          for (const d of ans.split('')) {
            const key = page.locator('button:visible').filter({ hasText: new RegExp(`^${d}$`) }).last();
            await key.click({ force: true, timeout: 4000 }).catch(() => {});
            await page.waitForTimeout(70);
          }
          const chk = page.locator('button.btn-white-accent').filter({ hasText: /Проверить|Tekshir/ }).first();
          if (await chk.count()) { await chk.click({ force: true }); await page.waitForTimeout(2600); } else break;
        } else break;
      }

      await page.waitForTimeout(700);
      const st = await state(page);
      const shot = arg('shot', '');
      if (shot) await page.screenshot({ path: `${shot}${CASES.length > 1 ? '-' + slug + '-s' + sIdx : ''}.png` });
      const marked = st.opts ? st.green === 1 : st.signs ? st.signOk === 1 : true;
      // FINAL PANEL istisnosi: u yerda savol o'rniga FactCard chiqadi (skroll bo'lmasligi uchun)
      const ok = st.factcard ? (st.success && st.over === 0) : (st.success && st.question && marked && st.over === 0);
      if (!ok) fails += 1;
      const mark = st.opts ? `yashil ${st.green}/${st.opts}` : st.signs ? `belgi ${st.signOk}/${st.signs} (${(st.signSlot || '').trim()})` : 'javob maydonda';
      console.log(`${(slug + ' s' + sIdx).padEnd(38)} ${ok ? 'OK ' : 'XATO'} | savol: ${st.question ? '"' + st.question.slice(0, 34) + '"' : 'YO\'Q'} | hisoblagich ${st.counters.join(' ') || '-'} | ${mark} | boks ${st.success ? st.successAnim : 'YO\'Q'} | skroll +${st.over}`);
      if (errs.length) console.log(`   KONSOL: ${[...new Set(errs)].slice(0, 2).join(' | ')}`);
    } catch (e) {
      fails += 1;
      console.log(`${(slug + ' s' + sIdxRaw).padEnd(38)} OCHILMADI: ${e.message.slice(0, 70)}`);
    }
    await page.close();
  }
}
await browser.close();
console.log(`\nXato holat: ${fails}`);
process.exit(fails ? 1 : 0);
