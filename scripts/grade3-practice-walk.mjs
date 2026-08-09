// Прогон всей переведённой практики 3 класса по канону §1A: уроки 1-34.
//
// Запуск:
//   npx vite --port 5181 --strictPort
//   node scripts/grade3-practice-walk.mjs
//
// Готово = у всех уроков «недоступно 0 · нарушений 0 · скролл ≤ 2px» и errors 0.
// Проверяет: все 10 заданий достижимы (со стрелками на телефоне), вопрос выше сцены,
// раскладка вариантов (4 -> 2x2, до 5 -> одна строка), пары сопоставления в одну строку,
// отсутствие галочек-квадратиков и скролла в любом состоянии.
import { chromium } from 'playwright';

// Без аргументов — все уроки; с номерами — только они (догнать после сбоя сервера).
const asked = process.argv.slice(2).map(Number).filter(Boolean);
const LESSONS = asked.length ? asked : Array.from({ length: 34 }, (_, i) => i + 1);
const errors = [];
const b = await chromium.launch();

for (const n of LESSONS) {
  const slug = `dars${String(n).padStart(2, '0')}-amaliyot`;
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    p.on('pageerror', (e) => errors.push(`${slug} ${w}: ${e.message}`));
    p.on('console', (m) => { if (m.type() === 'error' && !/api\/tts|503/.test(m.text())) errors.push(`${slug} ${w}: ${m.text()}`); });
    await p.goto(`http://localhost:5181/3-sinf/matematika/amaliy/${slug}`, { waitUntil: 'networkidle' });
    await p.waitForTimeout(550);
    let worst = 0; let bad = 0; let missing = 0;
    for (let i = 1; i <= 10; i += 1) {
      for (let g = 0; g < 8; g += 1) {
        const c = p.locator('button', { hasText: new RegExp(`^${i}\\.`) }).first();
        if (await c.count()) {
          const ok = await c.evaluate((el) => {
            const v = el.parentElement.getBoundingClientRect();
            const x = el.getBoundingClientRect();
            return x.left >= v.left - 1 && x.right <= v.right + 1;
          }).catch(() => false);
          if (ok) break;
        }
        const a = p.locator('.g3-practice-nav-arrow.is-right');
        if (!(await a.count())) break;
        await a.click({ force: true });
        await p.waitForTimeout(320);
      }
      const c = p.locator('button', { hasText: new RegExp(`^${i}\\.`) }).first();
      if (!(await c.count())) { missing += 1; continue; }
      await c.click({ force: true });
      await p.waitForTimeout(400);
      const mb = p.locator('.g3-mobile-step-button');
      if (await mb.count()) { await mb.first().click({ force: true }); await p.waitForTimeout(210); }
      const r = await p.evaluate(() => {
        const ask = document.querySelector('.g3-question-ask-card');
        const stage = document.querySelector('.g3-practice-stage');
        const zone = document.querySelector('.g3-answer-zone');
        const opts = zone ? [...zone.children].filter((e) => e.tagName === 'BUTTON') : [];
        const rows = new Set(opts.map((e) => Math.round(e.getBoundingClientRect().top))).size;
        const pairRows = new Set([...document.querySelectorAll('.g3-match-row')].map((e) => Math.round(e.getBoundingClientRect().top))).size;
        const hidden = ask ? getComputedStyle(ask).display === 'none' || ask.getBoundingClientRect().height === 0 : true;
        const over = [...document.querySelectorAll('*')].reduce((m, el) => {
          // clientHeight <= 1 — ekran o'qigich uchun yashirin element (sr-only), skroll qutisi emas.
          const o = el.scrollHeight - el.clientHeight;
          return o > m && el.clientHeight > 1 && getComputedStyle(el).overflowY !== 'visible' && !el.matches('strong, nav, .g3-practice-bank-nav') ? o : m;
        }, 0);
        // □ в тексте — обозначение неизвестного из учебника (□ × 8 = 56), не галочка.
        // Галочка была отдельным элементом; проверяем именно её.
        const boxes = /☑/.test(zone?.textContent || '');
        return { order: hidden || !stage ? true : ask.getBoundingClientRect().top < stage.getBoundingClientRect().top, count: opts.length, rows, pairRows, over, boxes };
      });
      const want = r.count === 4 ? 2 : (r.count > 0 && r.count <= 5 ? 1 : r.rows);
      if (!r.order || r.boxes || (r.count && r.rows !== want) || r.pairRows > 1) bad += 1;
      if (r.over > worst) worst = r.over;
    }
    const flag = missing || bad || worst > 4 ? ' ⚠' : '';
    console.log(`${slug} ${w}: недоступно ${missing} · нарушений ${bad} · скролл ${worst}px${flag}`);
    await p.close();
  }
}
console.log(`errors: ${errors.length}`);
errors.slice(0, 8).forEach((e) => console.log('  ' + e));
await b.close();
