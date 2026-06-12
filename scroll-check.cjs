const { chromium } = require('playwright');
const BASE = 'http://localhost:5174';
const VIEWPORT = { width: 1366, height: 768 };
const TOL = 2;
const LESSONS = [
  { n: 6,  slug: 'kasr-nima' }, { n: 7, slug: 'kasr-son-oqida' }, { n: 8, slug: 'kasr-bolish' },
  { n: 9,  slug: 'kasr-taqqoslash-maxraj' }, { n: 10, slug: 'kasr-taqqoslash-surat' },
  { n: 11, slug: 'kasr-taqqoslash-harxil' }, { n: 12, slug: 'kasr-ekvivalent' },
  { n: 13, slug: 'kasr-qisqartirish' }, { n: 14, slug: 'kasr-qoshish-maxraj' },
  { n: 15, slug: 'kasr-ayirish-teng' }, { n: 16, slug: 'kasr-qoshish-harxil' },
];
async function measure(page) {
  return await page.evaluate(() => {
    const sc = document.querySelector('.stage-content');
    const c = document.querySelector('.stage-header .chrome .mono.small');
    if (!sc) return null;
    const m = (c ? c.textContent.trim() : '').match(/(\d+)\s*\/\s*(\d+)/);
    return { cur: m ? +m[1] : null, total: m ? +m[2] : null, scrollH: sc.scrollHeight, clientH: sc.clientHeight };
  });
}
async function setLang(page, lang) {
  await page.evaluate((l) => {
    const b = [...document.querySelectorAll('button')].find(x => x.textContent.trim().toUpperCase() === l.toUpperCase() && x.offsetParent !== null);
    if (b) b.click();
  }, lang);
}
async function runLesson(page, lesson, lang) {
  await page.goto(`${BASE}/dars/${lesson.slug}`, { waitUntil: 'networkidle' });
  await page.waitForSelector('.stage-content', { timeout: 10000 });
  if (lang === 'uz') { await setLang(page, 'uz'); await page.waitForTimeout(200); }
  const total = await page.evaluate(() => window.__total);
  const ps = {};
  for (let i = 0; i < total; i++) {
    await page.evaluate((idx) => window.__goScreen(idx), i);
    await page.waitForTimeout(520);
    const m = await measure(page);
    if (m) ps[m.cur] = { overflow: m.scrollH - m.clientH, scrollH: m.scrollH, clientH: m.clientH, total: m.total };
  }
  return ps;
}
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: VIEWPORT });
  const out = [];
  for (const lesson of LESSONS) for (const lang of ['ru', 'uz']) {
    const ps = await runLesson(page, lesson, lang);
    const screens = Object.keys(ps).map(Number).sort((a, b) => a - b);
    const scrolled = screens.filter(s => ps[s].overflow > TOL);
    out.push({ lesson, lang, seen: screens.length, total: screens.length ? ps[screens[0]].total : null, ps, scrolled });
  }
  await browser.close();
  console.log(`\n==== SCROLL (viewport ${VIEWPORT.width}x${VIEWPORT.height}, clientH~${out[0]?Object.values(out[0].ps)[0].clientH:'?'}) ====\n`);
  for (const r of out) {
    const tag = `Урок ${r.lesson.n} [${r.lang.toUpperCase()}]`;
    if (r.scrolled.length === 0) console.log(`OK     ${tag}  (${r.seen}/${r.total}) scroll YO'Q`);
    else console.log(`SCROLL ${tag}  -> ` + r.scrolled.map(s => `s${s}(+${r.ps[s].overflow})`).join(', '));
  }
})().catch(e => { console.error('FATAL', e); process.exit(1); });
