// ============================================================================
// 8-sinf AMALIYOTI: HECH BIR TOPSHIRIQ SKROLL BO'LMASIN.
//
// Metodist talabi (2026-08-22): 8-sinfning HAMMA amaliy darslarida topshiriq
// skroll qilinmasin. Shu sababli tekshiruv bitta darsni emas, REYESTRDAGI
// hamma amaliyotni aylanadi.
//
// ---------------------------------------------------------------------------
// BU SKRIPTNING BIRINCHI TAHRIRI YOLG'ON YASHIL BERGAN EDI, VA SABABI SHU:
// skroll qutisi `root.children[1]` deb olingan edi. Lekin `.pq-fixroot` ning
// birinchi bolasi -- `<style>` elementi, ikkinchisi esa SARLAVHA qatori.
// Ya'ni o'lchov 1875 nuqtada sarlavhaning balandligini o'lchagan va tabiiyki
// hech qachon oshib ketmagan. Skroll esa ekranda bor edi.
// Endi quti INDEKS bilan emas, `overflow-y: auto|scroll` bo'yicha TOPILADI.
// ---------------------------------------------------------------------------
//
// Uch xil buzilish o'lchanadi:
//   1. ichki quti (`overflow: auto`) -- kontent sig'masa SKROLL chiqadi;
//   2. `.pq-fixroot` (`overflow: hidden`) -- sig'magani KESILADI, skroll ham,
//      xabar ham yo'q, ya'ni ko'z bilan bilinmaydi;
//   3. sahifa darajasidagi skroll.
// Ustiga «Tekshirish» tugmasi kadrda turibdimi -- skroll yo'q, lekin tugma
// pastda qolsa, o'quvchi javobni tekshira olmaydi.
//
// HAR QADAMDA o'lchanadi: topshiriq oxirida sig'ib, o'rtasida sig'masligi
// mumkin. Eng zich holat -- RAZBOR ochilgan payt.
//
// Ishga tushirish:
//   npx vite --port 5199
//   node scripts/grade8-practice-noscroll.mjs
//   G8_VP=telefon G8_LANG=en node scripts/grade8-practice-noscroll.mjs
// ============================================================================
import { chromium } from 'playwright';
import { LESSONS, VIEWPORTS, LANGS } from './grade8-practice-plan.mjs';

const BASE = process.env.G8_BASE || 'http://localhost:5199';
const vpFilter = process.env.G8_VP;
const langFilter = process.env.G8_LANG;
const viewports = VIEWPORTS.filter((v) => !vpFilter || v.name === vpFilter);
const langs = LANGS.filter((l) => !langFilter || l === langFilter);

// Darslar ro'yxati rejadan keladi: `plan` bo'lsa -- aniq javob yo'llari,
// bo'lmasa -- «turtki» rejimi (pastga qarang).

const problems = [];
let measurements = 0;
let worst = { over: 0, where: '' };
const note = (m) => process.stdout.write(m + '\n');

const PROBE = () => {
  const root = document.querySelector('.pq-fixroot');
  if (!root) return null;
  // Quti INDEKS bilan emas, xossasi bilan topiladi.
  const box = [...root.querySelectorAll('*')].find((el) => {
    const cs = getComputedStyle(el);
    return cs.overflowY === 'auto' || cs.overflowY === 'scroll';
  });
  const clipped = [];
  document.querySelectorAll('.pq-fixroot *').forEach((el) => {
    const cs = getComputedStyle(el);
    const hy = cs.overflowY === 'hidden' || cs.overflowY === 'clip';
    const hx = cs.overflowX === 'hidden' || cs.overflowX === 'clip';
    if ((!hy && !hx) || cs.textOverflow === 'ellipsis') return;
    if (!el.clientHeight || !el.clientWidth) return;
    const oy = hy ? el.scrollHeight - el.clientHeight : 0;
    const ox = hx ? el.scrollWidth - el.clientWidth : 0;
    if (oy > 4 || ox > 4) clipped.push(`${el.tagName}(${ox}x${oy})`);
  });
  const btn = document.querySelector('[data-check="1"]') || document.querySelector('[data-result]');
  return {
    over: box ? box.scrollHeight - box.clientHeight : 0,
    overX: box ? box.scrollWidth - box.clientWidth : 0,
    budget: box ? box.clientHeight : 0,
    noBox: !box,
    rootOver: root.scrollHeight - root.clientHeight,
    docOverY: document.documentElement.scrollHeight - window.innerHeight,
    docOverX: document.documentElement.scrollWidth - window.innerWidth,
    clipped: [...new Set(clipped)].slice(0, 3),
    btnBelow: btn ? Math.round(btn.getBoundingClientRect().bottom - window.innerHeight) : null,
  };
};

// RAZBOR KADRDA QANDAY TURIBDI. Javobdan keyin talab boshqa: razbor
// kadrga sig'sa — to'liq ko'rinsin (sticky panel ostida ham qolmasin),
// sig'masa — BOSHI ko'rinsin (host uni yuqoriga qo'yadi, o'quvchi pastga
// o'qib boradi). Izohi: DARS41_50_AMALIYOT_SKELET.md §16a.3.
const RAZBOR = () => {
  const root = document.querySelector('.pq-fixroot');
  const box = [...root.querySelectorAll('*')].find((el) => {
    const cs = getComputedStyle(el);
    return cs.overflowY === 'auto' || cs.overflowY === 'scroll';
  });
  if (!box) return { missing: true };
  const rz = box.querySelector('[data-razbor]');
  if (!rz || (rz.textContent || '').trim().length < 25) return { missing: true };
  const r = rz.getBoundingClientRect();
  const b = box.getBoundingClientRect();
  const bar = box.querySelector('[data-bar="1"]');
  const floor = bar ? Math.min(b.bottom, bar.getBoundingClientRect().top) : b.bottom;
  const room = floor - b.top;
  const above = Math.max(0, b.top - r.top);
  if (r.height <= room + 4) return { cut: Math.round(above + Math.max(0, r.bottom - floor)), tall: false };
  return { cut: Math.round(above), tall: true, h: Math.round(r.height), room: Math.round(room) };
};

async function measure(page, where, post) {
  const m = await page.evaluate(PROBE);
  if (!m) { problems.push(`${where}: .pq-fixroot topilmadi`); return; }
  measurements += 1;
  if (m.noBox) problems.push(`${where}: skroll qutisi topilmadi — o'lchov ishonchsiz`);
  if (post) {
    const z = await page.evaluate(RAZBOR);
    if (z.missing) problems.push(`${where}: razbor bloki topilmadi`);
    else if (z.cut > 0) problems.push(`${where}: razborning boshi ${z.cut}px kadrdan chiqdi`);
  } else if (m.over > 1) {
    problems.push(`${where}: SKROLL ${m.over}px (maydon ${m.budget}px)`);
    if (m.over > worst.over) worst = { over: m.over, where };
  }
  if (m.overX > 1) problems.push(`${where}: gorizontal skroll ${m.overX}px`);
  if (m.rootOver > 1) problems.push(`${where}: ildizda ${m.rootOver}px KESILDI`);
  if (m.docOverY > 1) problems.push(`${where}: sahifa vertikal skroll ${m.docOverY}px`);
  if (m.docOverX > 1) problems.push(`${where}: sahifa gorizontal skroll ${m.docOverX}px`);
  if (m.clipped.length) problems.push(`${where}: kesilgan quti — ${m.clipped.join(', ')}`);
  if (m.btnBelow !== null && m.btnBelow > 1) problems.push(`${where}: tugma kadrdan ${m.btnBelow}px pastda`);
}

async function act(page, step) {
  if (step.fill) {
    const [name, text] = step.fill;
    const fold = page.locator(`[data-fold="${name}"]`);
    if (await fold.count()) await fold.first().click();
    await page.locator(`input[data-input="${name}"]`).first().fill(text);
    return;
  }
  if (step.range !== undefined) {
    const s = page.locator('[data-slider="1"]').first();
    await s.fill(String(step.range));
    return;
  }
  if (step.tap) { for (const s of step.tap) { await page.locator(s).first().click(); await page.waitForTimeout(45); } return; }
  await page.locator(step.click).first().click();
}

const checkBtn = (page) => page.locator('[data-check="1"]');

// TURTKI REJIMI — javob yo'llari yozilmagan dars uchun (dars01).
// Savol maydonidagi tugmalar navbat bilan bosiladi va har bosishdan keyin
// o'lchanadi; «Tekshirish» ochilishi bilan bosiladi va RAZBOR o'lchanadi.
// Javob ataylab noto'g'ri chiqadi — bu yaxshi: razbor matni eng uzuni.
async function poke(page, tag) {
  // FAQAT SAVOL MAYDONI. Ilgari qidiruv butun `.pq-fixroot` bo'yicha borardi
  // va sarlavhadagi chip tugmalari ham unga tushardi. dars01 ning chiplarida
  // `data-q` yo'q, shuning uchun skript ularni topshiriq boshqaruvi deb bosib,
  // savolning o'ziga yetib bormasdi -- va razbor holati o'lchanmay qolardi.
  // Savol maydoni -- ildizning OXIRGI bolasi (birinchisi <style>, ikkinchisi sarlavha).
  const all = page.locator('.pq-fixroot > div:last-child input, .pq-fixroot > div:last-child button');
  const n = Math.min(await all.count(), 40);
  for (let i = 0; i < n; i += 1) {
    const el = all.nth(i);
    if (await el.isDisabled().catch(() => true)) continue;
    const isCheck = await el.getAttribute('data-check').catch(() => null);
    const isChip = await el.getAttribute('data-q').catch(() => null);
    if (isCheck || isChip) continue;
    const tn = await el.evaluate((x) => x.tagName).catch(() => '');
    if (tn === 'INPUT') await el.fill('1', { force: true }).catch(() => {});
    else await el.click({ timeout: 1200, force: true }).catch(() => {});
    await page.waitForTimeout(50);
    await measure(page, `${tag}/turtki-${i + 1}`);
    if (!(await checkBtn(page).isDisabled().catch(() => true))) break;
  }
  if (!(await checkBtn(page).isDisabled().catch(() => true))) {
    await checkBtn(page).click({ timeout: 3000, force: true }).catch(() => {});
    await page.waitForTimeout(450);
    await measure(page, `${tag}/razbor`, true);
  } else {
    problems.push(`${tag}: «Tekshirish» ochilmadi — RAZBOR holati o'lchanmadi`);
  }
}

const browser = await chromium.launch({ headless: true });
for (const lesson of LESSONS) {
  for (const vp of viewports) {
    for (const lang of langs) {
      const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
      const errs = [];
      page.on('pageerror', (e) => errs.push(String(e)));
      await page.goto(`${BASE}${lesson.route}?lang=${lang}`, { waitUntil: 'networkidle' });
      await page.waitForSelector('.pq-fixroot', { timeout: 15000 });
      await page.waitForTimeout(400);

      const chips = await page.locator('[data-q]').count();
      const count = chips || 10;
      for (let qi = 0; qi < count; qi += 1) {
        const qid = String(qi + 1).padStart(2, '0');
        const tag = `${lesson.id}/${vp.name}/${lang}/${qid}`;
        const openQ = async () => {
          if (chips) await page.locator('[data-q]').nth(qi).click();
          else await page.locator('.pq-fixroot > div:nth-child(2) button').nth(qi).click();
          await page.waitForTimeout(180);
        };
        await openQ();
        await measure(page, `${tag}/ochilish`);

        if (lesson.plan) {
          const task = lesson.plan[qi];
          for (const mode of ['ok', 'no']) {
            if (mode === 'no') { await page.reload({ waitUntil: 'networkidle' }); await page.waitForSelector('.pq-fixroot'); await openQ(); }
            let i = 0;
            for (const step of task[mode]) {
              await act(page, step);
              await page.waitForTimeout(55);
              i += 1;
              await measure(page, `${tag}/${mode}/qadam-${i}`);
            }
            await page.waitForTimeout(130);
            if (!(await checkBtn(page).isDisabled())) { await checkBtn(page).click(); await page.waitForTimeout(450); }
            await measure(page, `${tag}/${mode}/razbor`, true);
          }
        } else {
          // Turtki -- yordamchi yo'l, u yiqilsa butun o'lchov to'xtamasligi kerak.
          try { await poke(page, tag); }
          catch (e) { problems.push(`${tag}: turtki rejimi uzildi — ${String(e).slice(0, 90)}`); }
        }
        await page.reload({ waitUntil: 'networkidle' });
        await page.waitForSelector('.pq-fixroot');
        await page.waitForTimeout(250);
      }
      if (errs.length) problems.push(`${lesson.id}/${vp.name}/${lang}: konsolda runtime xato — ${errs[0]}`);
      await page.close();
    }
  }
}
await browser.close();

note(`O'lchov: ${measurements} nuqta — ${LESSONS.length} dars x ${viewports.length} o'lcham x ${langs.length} til`);
if (problems.length) {
  const uniq = [...new Set(problems)];
  note(`\nMUAMMO ${uniq.length} ta:`);
  uniq.forEach((p) => note('  - ' + p));
  if (worst.over) note(`\nEng yomoni: ${worst.over}px — ${worst.where}`);
  process.exit(1);
}
note("Skroll yo'q, kesilish yo'q, tugma kadrda.");
