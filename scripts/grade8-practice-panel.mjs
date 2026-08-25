// 8-sinf amaliyoti: PANEL OSTIDA QOLGAN KONTENTNI O'LCHASH.
//
// NEGA. `PracticeHost` ning pastdagi paneli `position: sticky` — u kontent
// ustiga chiqadi. `grade8-practice-check.mjs` faqat SKROLLNI o'lchaydi, panel
// ostida qolgan matn esa skroll bermaydi: razbor ekranda bo'lmasligi mumkin,
// tekshiruv esa yashil beradi (2026-08-22 da shu tarzda 1-darsda uch joyda
// razborning oxirgi satrlari yopilib turgani topildi).
//
// Ishlatish:
//   npx vite --port 5199                              (alohida terminalda)
//   node scripts/grade8-practice-panel.mjs             (dars01, hamma o'lcham)
//   G8_LESSON=dars04 G8_VP=telefon node scripts/grade8-practice-panel.mjs
//   G8_WRONG=1 node scripts/grade8-practice-panel.mjs  (razbor xato yo'lda)
//
// Natija: har topshiriq uchun panel ostida qolgan piksel. 10px dan kichigi —
// blokning ichki bo'shligi, undan kattasi MATN degani.
// Panel ostida qolgan kontentni o'lchash: razbor ko'rinadimi yoki yo'q.
import { chromium } from 'playwright';
import { LESSONS, VIEWPORTS } from './grade8-practice-plan.mjs';
const WRONG = process.env.G8_WRONG === '1';
const lesson = LESSONS.find((l) => l.id === (process.env.G8_LESSON || 'dars01'));
const vps = VIEWPORTS.filter((v) => !process.env.G8_VP || v.name === process.env.G8_VP);
async function act(page, step) {
  if (step.fill) { await page.locator(`input[data-input="${step.fill[0]}"]`).first().fill(step.fill[1]); return; }
  if (step.range !== undefined) { await page.locator('[data-slider="1"]').first().fill(String(step.range)); return; }
  if (step.tap) { for (const s of step.tap) await page.locator(s).first().click(); return; }
  await page.locator(step.click).first().click();
}
const b = await chromium.launch();
const bad = [];
for (const vp of vps) {
  for (const lang of ['uz', 'ru', 'en']) {
    const p = await b.newPage({ viewport: { width: vp.width, height: vp.height } });
    await p.goto(`http://localhost:5199${lesson.route}?lang=${lang}`, { waitUntil: 'networkidle' });
    await p.waitForSelector('.pq-fixroot');
    for (const task of lesson.plan) {
      await p.locator(`[data-q="${task.id}"]`).first().click();
      await p.waitForTimeout(120);
      for (const st of (WRONG ? task.no : task.ok)) { await act(p, st); await p.waitForTimeout(50); }
      await p.locator('[data-check="1"]:not([disabled])').waitFor({ timeout: 8000 });
      await p.locator('[data-check="1"]').click();
      await p.waitForTimeout(1200);
      const hid = await p.evaluate(() => {
        const root = document.querySelector('.pq-fixroot');
        const panel = [...root.querySelectorAll('div')].find((d) => getComputedStyle(d).position === 'sticky');
        if (!panel) return 0;
        const top = panel.getBoundingClientRect().top;
        let worst = 0;
        root.querySelectorAll('*').forEach((el) => {
          if (panel.contains(el)) return;
          const t = (el.textContent || '').trim();
          if (!t || el.children.length) return;
          const r = el.getBoundingClientRect();
          if (r.height === 0) return;
          worst = Math.max(worst, r.bottom - top);
        });
        return Math.round(worst);
      });
      if (hid > 0) bad.push(`${lesson.id}/${vp.name}/${lang}/${task.id}: panel ostida ${hid}px`);
    }
    await p.close();
  }
}
await b.close();
console.log((WRONG ? "NOTO'G'RI" : "TO'G'RI") + ` yo'l — panel ostida qolgan joylar: ${bad.length}`);
bad.forEach((x) => console.log('  - ' + x));
