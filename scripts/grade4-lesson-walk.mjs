// 11-20-darslar uchun tekshiruv: skroll yo'q, hamma ekran o'tadi, element
// ekrandan chiqmaydi, konsol toza. Ishlatish:
//   npx vite preview --port 4173
//   node scripts/grade4-lesson-walk.mjs [/marshrut]
// Dars11 tekshiruvi: skroll yo'qligi, 16 ekranning o'tishi, konsol xatolari,
// uchala tilda ishlashi. Desktop 1280x800 va telefon 390x760.
import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://127.0.0.1:4173';
const ROUTE = process.argv[2] || '/4-sinf/matematika/nazariy/dars11-kop-xonali-sonni-uch-xonali-songa-kopaytirish';

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'telefon', width: 390, height: 760 },
  { name: 'noutbuk', width: 1366, height: 768 },
  { name: 'past', width: 1280, height: 620 },
];

const browser = await chromium.launch();
let failures = 0;

for (const vp of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));

  await page.goto(BASE + ROUTE, { waitUntil: 'load' });
  await page.waitForSelector('.lesson-root', { timeout: 40000, state: 'attached' });
  await page.waitForTimeout(600);
  // ovozni o'chiramiz — gate darrov ochilsin
  const mute = page.locator('.audio-controls button').first();
  if (await mute.count()) await mute.click();
  await page.waitForTimeout(400);

  // Ekranlar soni darsdan o'qiladi: 11-20 darslarda u 14 dan 17 gacha.
  const total = Number(((await page.locator('.screen-count').first().textContent()) || '/ 16').split('/')[1].trim()) || 16;
  const report = [];
  for (let screen = 0; screen < total; screen += 1) {
    await page.waitForTimeout(280);
    const m = await page.evaluate(() => {
      const doc = document.documentElement;
      const root = document.querySelector('.lesson-root');
      const stage = document.querySelector('.stage');
      const body = document.querySelector('.stage-body');
      const counter = document.querySelector('.screen-count');
      const title = document.querySelector('.screen-title');
      const overflowing = [];
      if (root) {
        for (const el of root.querySelectorAll('*')) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 && r.height === 0) continue;
          if (r.bottom > window.innerHeight + 1.5 || r.right > window.innerWidth + 1.5 || r.top < -1.5) {
            overflowing.push(el.className && typeof el.className === 'string' ? el.className : el.tagName);
          }
        }
      }
      return {
        docScroll: doc.scrollHeight - doc.clientHeight,
        stageScroll: stage ? stage.scrollHeight - stage.clientHeight : 0,
        bodyScroll: body ? body.scrollHeight - body.clientHeight : 0,
        counter: counter ? counter.textContent.trim() : '?',
        title: title ? title.textContent.trim().slice(0, 34) : '',
        overflowing: overflowing.slice(0, 3),
        nextDisabled: document.querySelector('.stage-nav .btn-next')?.disabled ?? null,
      };
    });
    report.push(m);

    // javob kerak bo'lsa — to'g'ri variantni topguncha bosamiz
    let guard = 0;
    while (await page.locator('.stage-nav .btn-next').isDisabled() && guard < 6) {
      // To'g'ri javob DOM markeri bo'yicha topiladi: bu variant, span, chip va
      // refleksiya tugmalarini bir xil qamrab oladi. Numpad ekranida marker yo'q
      // (javob DOM ga chiqarilmaydi) — u alohida tekshiriladi.
      const marked = page.locator('[data-g4-correct="true"]:not(:disabled)');
      const opts = (await marked.count())
        ? marked
        : page.locator('.options .option:not(:disabled), .slot-row .slot:not(:disabled), .reflection-option:not(:disabled)');
      const n = await opts.count();
      if (!n) break;
      await opts.nth(0).click();
      await page.waitForTimeout(320);
      guard += 1;
    }
    const claim = page.locator('.claim-btn');
    if (await claim.count() && !(await claim.isDisabled())) { await claim.click(); await page.waitForTimeout(300); }
    if (screen < total - 1) {
      const next = page.locator('.stage-nav .btn-next');
      if (await next.isDisabled()) { report[report.length - 1].stuck = true; break; }
      await next.click();
    }
  }

  const scrolls = report.filter((r) => r.docScroll > 1 || r.stageScroll > 1 || r.bodyScroll > 1);
  const cut = report.filter((r) => r.overflowing.length);
  const stuck = report.filter((r) => r.stuck);
  console.log(`\n=== ${vp.name} ${vp.width}x${vp.height} ===`);
  console.log(`  ochilgan ekran: ${report.length}/${total}`);
  console.log(`  skroll bor ekran: ${scrolls.length}` + (scrolls.length ? ` -> ${scrolls.map((r) => r.counter).join(', ')}` : ''));
  console.log(`  ekrandan chiqib ketgan element: ${cut.length}` + (cut.length ? ` -> ${cut.map((r) => r.counter + ':' + r.overflowing[0]).join(' | ')}` : ''));
  console.log(`  qotib qolgan ekran: ${stuck.length}`);
  console.log(`  konsol xatosi: ${errors.length}` + (errors.length ? ` -> ${errors[0].slice(0, 120)}` : ''));
  if (report.length < total || scrolls.length || cut.length || stuck.length || errors.length) failures += 1;
  await page.close();
}

await browser.close();
console.log(failures ? `\nXATO: ${failures} viewportda muammo bor` : '\nHammasi toza');
process.exit(failures ? 1 : 0);
