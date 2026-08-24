// 8-sinf amaliyoti: TEKSHIRUV. Bir vaqtda ikki ish qiladi (TIPLAR §8):
//   1) har bosishdan keyin kontent kadrga sig'adimi — 5 o'lcham x 3 til;
//   2) amaliyot to'g'ri javoblar bilan birinchi urinishda 10/10 beradimi.
//
// G8_WRONG=1 — o'sha o'nta topshiriq ATAYLAB noto'g'ri o'tiladi va uchta
// narsa talab qilinadi: ball berilmasin, razbor chiqsin va u BO'SH bo'lmasin.
// Bo'sh razbor eng sezilmas nuqson: qolgan tekshiruvlar yashil, ekranda esa
// hech narsa yo'q.
//
// Ishlatish:
//   npx vite --port 5199                            (alohida terminalda)
//   node scripts/grade8-practice-check.mjs
//   G8_WRONG=1 node scripts/grade8-practice-check.mjs
//   G8_VP=telefon G8_LANG=en node scripts/grade8-practice-check.mjs
import { chromium } from 'playwright';
import { LESSONS, VIEWPORTS, LANGS } from './grade8-practice-plan.mjs';

const BASE = process.env.G8_BASE || 'http://localhost:5199';
const WRONG = process.env.G8_WRONG === '1';
const vpFilter = process.env.G8_VP;
const langFilter = process.env.G8_LANG;
const viewports = VIEWPORTS.filter((v) => !vpFilter || v.name === vpFilter);
const langs = LANGS.filter((l) => !langFilter || l === langFilter);

const fails = [];
const note = (m) => process.stdout.write(m + '\n');

// Ishchi maydon — PracticeHost turgan skroll idishi. Kontent undan oshsa,
// o'quvchi javobni yoki razborni qidirib skrollaydi: bu nuqson.
async function overflow(page) {
  return page.evaluate(() => {
    const root = document.querySelector('.pq-fixroot');
    if (!root) return { missing: true };
    // Quti INDEKS bilan emas, xossasi bilan topiladi: `children[1]` sarlavha
    // qatori edi (birinchisi umuman <style>), va o'lchov yolg'on yashil berardi.
    const box = [...root.querySelectorAll('*')].find((el) => {
      const cs = getComputedStyle(el);
      return cs.overflowY === 'auto' || cs.overflowY === 'scroll';
    });
    if (!box) return { missing: true };
    return { over: Math.max(0, box.scrollHeight - box.clientHeight) };
  });
}

async function act(page, step) {
  if (step.fill) {
    const [name, text] = step.fill;
    const fold = page.locator(`[data-fold="${name}"]`);
    if (await fold.count()) await fold.first().click();   // telefonda maydon yig'ilgan turadi
    await page.locator(`input[data-input="${name}"]`).first().fill(text);
    return;
  }
  if (step.range !== undefined) {
    const s = page.locator('[data-slider="1"]').first();
    await s.fill(String(step.range));
    return;
  }
  if (step.tap) {
    for (const sel of step.tap) await page.locator(sel).first().click();
    return;
  }
  await page.locator(step.click).first().click();
}

async function runTask(page, task, vp, lang) {
  const where = `${vp.name}/${lang}/${task.id}`;
  await page.locator(`[data-q="${task.id}"]`).first().click();
  await page.waitForTimeout(120);

  const steps = WRONG ? task.no : task.ok;
  for (const step of steps) {
    await act(page, step);
    // React `onReady` ni EFFEKTDA beradi: bosishdan keyin darhol so'rasak,
    // tugma hali yopiq turadi va tekshiruv yolg'on xato beradi.
    await page.waitForTimeout(60);
    const o = await overflow(page);
    if (o.missing) { fails.push(`${where}: ishchi maydon topilmadi`); return; }
    if (o.over > 0) fails.push(`${where}: bosishdan keyin ${o.over}px kadrdan chiqdi`);
  }

  const btn = page.locator('[data-check="1"]');
  await page.waitForTimeout(150);
  if (await btn.isDisabled()) { fails.push(`${where}: «Tekshirish» ochilmadi — onReady kelmadi`); return; }
  await btn.click();
  await page.waitForTimeout(400);

  const ok = await page.locator('[data-result="ok"]').count();
  const no = await page.locator('[data-result="no"]').count();
  if (!ok && !no) { fails.push(`${where}: tekshiruvdan keyin natija ko'rsatilmadi`); return; }

  if (WRONG) {
    if (ok) fails.push(`${where}: NOTO'G'RI javobga ball berildi`);
    // Razbor — HFB bloki. Bo'sh bo'lsa, xato razborsiz qoladi.
    const why = await page.evaluate(() => {
      const root = document.querySelector('.pq-fixroot');
      const spans = root ? [...root.querySelectorAll('span')] : [];
      const hit = spans.filter((s) => s.textContent && s.textContent.trim().length > 25);
      return hit.length ? hit[hit.length - 1].textContent.trim().length : 0;
    });
    if (why < 25) fails.push(`${where}: razbor bo'sh yoki juda qisqa (${why} belgi)`);

    // YASHIL QOLMASIN. Javob xato bo'lsa, savol maydonida yashil rang
    // bo'lmasligi kerak: yashil «to'g'ri» degani, va o'quvchi tegmagan
    // joyda chiqsa — bu to'g'ri javobni ko'rsatib qo'yish (metodist,
    // 2026-08-22). Razborni MATN beradi, ranglar emas.
    const green = await page.evaluate(() => {
      const root = document.querySelector('.pq-fixroot');
      const g = ['rgb(26, 127, 67)', 'rgb(232, 247, 238)'];
      const hits = [];
      root.querySelectorAll('*').forEach((el) => {
        const cs = getComputedStyle(el);
        if (g.includes(cs.borderTopColor) || g.includes(cs.backgroundColor) || g.includes(cs.color)) {
          hits.push(el.tagName + (el.getAttribute('data-part') || el.getAttribute('data-item') || el.getAttribute('data-opt') || el.getAttribute('data-tick') || ''));
        }
      });
      return [...new Set(hits)].slice(0, 3);
    });
    if (green.length) fails.push(`${where}: xato javobdan keyin YASHIL qoldi — ${green.join(', ')}`);
  } else if (!ok) {
    fails.push(`${where}: TO'G'RI javob qabul qilinmadi`);
  }

  const after = await overflow(page);
  if (!after.missing && after.over > 0) fails.push(`${where}: razbor bilan ${after.over}px kadrdan chiqdi`);
}

const browser = await chromium.launch();
// Reja yozilgan HAMMA dars aylanadi: 2-darsdan boshlab har amaliyot shu
// yerdan tekshiriladi, alohida skript yozilmaydi.
const planned = LESSONS.filter((l) => l.plan);
const only = process.env.G8_LESSON;
const list = planned.filter((l) => !only || l.id === only);
let runs = 0;
for (const lesson of list) {
  for (const vp of viewports) {
    for (const lang of langs) {
      const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
      const errs = [];
      page.on('pageerror', (e) => errs.push(String(e)));
      await page.goto(`${BASE}${lesson.route}?lang=${lang}`, { waitUntil: 'networkidle' });
      await page.waitForSelector('.pq-fixroot', { timeout: 15000 });
      for (const task of lesson.plan) { await runTask(page, task, { name: lesson.id + '/' + vp.name }, lang); runs += 1; }
      if (errs.length) fails.push(`${lesson.id}/${vp.name}/${lang}: konsolda runtime xato — ${errs[0]}`);
      await page.close();
    }
  }
}
await browser.close();

const mode = WRONG ? "NOTO'G'RI" : "TO'G'RI";
note(`${mode} yo'l: ${runs} o'tish (${list.length} dars x ${viewports.length} o'lcham x ${langs.length} til x 10 topshiriq)`);
if (fails.length) {
  note(`\nXATO ${fails.length} ta:`);
  fails.forEach((f) => note('  - ' + f));
  process.exit(1);
}
note('Hammasi joyida.');
