// AMALIYOT TEKSHIRUVINING UMUMIY YURUVCHISI — SINFLARGA BITTA.
//
// NEGA. Yuruvchi 8-sinf uchun yozilgan edi va 9-sinfga o'sha ish kerak:
// har bosishdan keyin kadr o'lchovi, to'g'ri yo'l bilan 10/10, noto'g'ri
// yo'lda razborning bo'shligi va yashil rangning qolib ketishi. Ikkinchi
// nusxa CLAUDE.md §5 ga zid bo'lardi: bitta nuqson ikki joyda tuzatilardi.
//
// Sinfga xos narsa faqat REJA (sinfning '-practice-plan.mjs' fayli) va env prefiksi.
// Chaqiruvchi: grade8-practice-check.mjs, grade9-practice-check.mjs.
import { chromium } from 'playwright';

export async function runPracticeCheck(opts) {
  const { LESSONS, VIEWPORTS, LANGS } = opts;
  const BASE = opts.base;
  const WRONG = opts.wrong;
  const viewports = VIEWPORTS.filter((v) => !opts.vp || v.name === opts.vp);
  const langs = LANGS.filter((l) => !opts.lang || l === opts.lang);
  const fails = [];
  // Javobdan keyingi chiqish — NUQSON EMAS, eslatma: razbor ko'rinib turadi,
  // yuqoriga esa yig'ilgan shart ketadi. Ro'yxat oxirida sanab o'tiladi.
  const overs = [];
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

  // RAZBOR KADRDA TO'LIQ TURIBDIMI. Razbor bloki (HFB) foni bilan tanaladi:
  // to'g'ri javobda okBg, xatoda noBg. Bir topshiriqda shu ranglar boshqa
  // joyda ham uchraydi (natija qatorlari), shuning uchun eng UZUN matnli
  // nomzod olinadi — razbor har doim eng uzun.
  async function razborSeen(page) {
    return page.evaluate(() => {
      const root = document.querySelector('.pq-fixroot');
      if (!root) return { missing: true };
      const box = [...root.querySelectorAll('*')].find((el) => {
        const cs = getComputedStyle(el);
        return cs.overflowY === 'auto' || cs.overflowY === 'scroll';
      });
      if (!box) return { missing: true };
      // Razbor bloki o'z belgisi bilan turadi (kit.jsx -> HFB). Rang bilan
      // izlash kerak emas: bir topshiriqda o'sha ranglar boshqa joyda ham bor.
      const rz = box.querySelector('[data-razbor]');
      if (!rz || (rz.textContent || '').trim().length < 25) return { missing: true };
      const r = rz.getBoundingClientRect();
      const b = box.getBoundingClientRect();
      // Pastdagi tugma paneli STICKY: u kadrning pastini bosib turadi, ya'ni
      // «quti ichida» degani hali «ko'rinadi» degani emas.
      const bar = box.querySelector('[data-bar="1"]')
        || [...box.querySelectorAll('*')].find((el) => getComputedStyle(el).position === 'sticky');
      const floor = bar ? Math.min(b.bottom, bar.getBoundingClientRect().top) : b.bottom;
      const room = floor - b.top;
      const above = Math.max(0, b.top - r.top);
      // IKKI BOSQICHLI TALAB.
      //   Razbor kadrga sig'sa — to'liq ko'rinishi shart (bir piksel ham
      //   panel ostida qolmasin).
      //   Razbor kadrdan baland bo'lsa — uning BOSHI ko'rinishi shart: host
      //   shunday suradi, o'quvchi matnni boshidan o'qib, pastga skroll
      //   qilib davom etadi. Boshi kesilgan razbor — nuqson.
      if (r.height <= room + 4) {
        return { cut: Math.round(above + Math.max(0, r.bottom - floor)), h: Math.round(r.height), tall: false };
      }
      return { cut: Math.round(above), h: Math.round(r.height), room: Math.round(room), tall: true };
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

    // JAVOBDAN KEYIN TALAB BOSHQA. Ilgari bu yerda ham «0px chiqish» turardi
    // va razborlar SHU o'lchov uchun qisqartirilardi: ya'ni kadr metodik
    // matnni kesardi (metodist, 2026-08-25: «muammolarni hal qil»). Endi talab
    // aniqroq va qattiqroq: RAZBOR TO'LIQ KO'RINSIN. Host natija chiqqanda
    // pastga suradi (PracticeHost), shart esa telefonda bir qatorga yig'iladi
    // va bir teginishda qaytadi — ya'ni yuqoriga ketadigan narsa o'quvchi
    // allaqachon o'qigan matn, razbor esa hech qachon qidirilmaydi.
    // JAVOBDAN OLDIN esa qat'iy nol bo'lib qoladi (yuqoridagi halqa).
    await page.waitForTimeout(900);        // avtoskroll ikki qadamda: 0 va 700ms
    const seen = await razborSeen(page);
    if (seen.missing) { fails.push(`${where}: razbor bloki topilmadi`); return; }
    if (seen.cut > 0) fails.push(`${where}: razborning boshi ${seen.cut}px kadrdan chiqib ketdi`);
    if (seen.tall && !seen.cut) overs.push(`${where}: razbor uzun (${seen.h}px, kadr ${seen.room}px) — boshidan ko'rinadi`);
    const after = await overflow(page);
    if (!after.missing && after.over > 0) overs.push(`${where}: ${after.over}px`);
  }

  const browser = await chromium.launch();
  // Reja yozilgan HAMMA dars aylanadi: 2-darsdan boshlab har amaliyot shu
  // yerdan tekshiriladi, alohida skript yozilmaydi.
  const planned = LESSONS.filter((l) => l.plan);
  const only = opts.lesson;
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
    return false;
  }
  if (overs.length) {
    note(`
  Eslatma: ${overs.length} joyda razbordan keyin kadr skrollanadi (razborning o'zi ko'rinadi, tepadagi yig'ilgan shart yuqoriga ketadi):`);
    overs.slice(0, 12).forEach((o) => note('  · ' + o));
    if (overs.length > 12) note(`  · ... yana ${overs.length - 12} ta`);
  }
  note('Hammasi joyida.');
  return true;

}
