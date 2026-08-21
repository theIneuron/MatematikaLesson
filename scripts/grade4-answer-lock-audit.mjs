#!/usr/bin/env node
// 4-sinf nazariy darslarining javob xatti-harakati auditi.
//
// Metodist qarori (2026-08-21) ikki qoida beradi:
//   1) Xato javob tanlansa, variant QISQA VAQT qizaradi va neytral holatiga
//      qaytadi — aynan o'sha variantni yana tanlash mumkin bo'ladi.
//   2) To'g'ri javob tanlansa, boshqa variantni tanlash mumkin BO'LMAYDI.
//
// Skript har darsning har variantli ekranida: xato variantni bosadi, flash
// tugashini kutadi va o'sha variant yana bosiladigan holatga qaytganini
// tekshiradi; keyin to'g'ri variantni bosib, hamma variant qulflanganini
// tekshiradi.
//
// Ishlatish:
//   npx vite preview --port 4173 --strictPort
//   node scripts/grade4-answer-lock-audit.mjs [11 12 ...]
//   LANG_G4=ru node scripts/grade4-answer-lock-audit.mjs   # rus tilida
import process from 'node:process';
import { writeFileSync } from 'node:fs';
import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://localhost:4173';
const JOBS = Number(process.env.JOBS || 4);
const OUT = process.env.OUT || '.tmp-answer-lock.json';
// `WRONG_FLASH_MS` = 1400; ustiga zapas qo'shamiz.
const FLASH_WAIT = Number(process.env.FLASH_WAIT || 2100);
// Til platformadan '?lang=' bilan keladi. Mexanika tildan mustaqil, lekin
// variant tartibi va matnlar tilga bog'liq — shuning uchun uchala tilda ham
// yugurtirish mumkin: LANG_G4=ru node scripts/grade4-answer-lock-audit.mjs
// (nomi LANG_G4, chunki LANG tizim o'zgaruvchisi va allaqachon to'ldirilgan)
const LANG = process.env.LANG_G4 || '';

const SLUGS = {
  11: 'dars11-kop-xonali-sonni-uch-xonali-songa-kopaytirish',
  12: 'dars12-kop-xonali-sonni-bir-xonali-songa-bolish',
  13: 'dars13-kop-xonali-sonni-ikki-xonali-songa-bolish',
  14: 'dars14-harakat-masalalari',
  15: 'dars15-ortacha-arifmetik',
  16: 'dars16-formulalar',
  17: 'dars17-shkalalar',
  18: 'dars18-kasr-tushunchasi',
  19: 'dars19-kasrlarni-taqqoslash',
  20: 'dars20-kasrlarni-qoshish',
  21: 'dars21-kasrlarni-ayirish',
  22: 'dars22-sonning-kasr-qismini-topish',
  23: 'dars23-kasrli-masalalar',
  24: 'dars24-onli-kasrlar',
  25: 'dars25-toplamlar-eyler-venn-diagrammasi',
  26: 'dars26-uzunlik-birliklari',
  27: 'dars27-massa-birliklari',
  28: 'dars28-vaqt-birliklari',
  29: 'dars29-yuza-birliklari',
  30: 'dars30-kattalik-birliklarini-aylantirish',
  31: 'dars31-kattaliklarga-doir-masalalar',
  32: 'dars32-hajm-birliklari',
  33: 'dars33-burchak-turlari',
  34: 'dars34-burchaklarni-yasash',
  35: 'dars35-uchburchak-turlari',
  36: 'dars36-togri-tortburchak-va-kvadrat',
  37: 'dars37-perimetr-va-yuza',
  38: 'dars38-geometrik-yasashlar',
  39: 'dars39-nuqta-koordinatalari',
  40: 'dars40-fazoviy-shakllar-va-yoyilmalar',
  41: 'dars41-simmetriya-va-burilish-simmetriyasi',
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
const report = [];

const auditLesson = async (lesson) => {
  const slug = SLUGS[lesson];
  if (!slug) return;
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  const problems = [];
  let tested = 0;

  try {
    await page.goto(`${BASE}/4-sinf/matematika/nazariy/${slug}${LANG ? `?lang=${LANG}` : ''}`, { waitUntil: 'load' });
    await page.waitForSelector('.stage', { timeout: 40000 });
    await page.waitForTimeout(500);
    const mute = page.locator('.audio-controls button, .audio-indicator button').first();
    if (await mute.count()) await mute.click();
    await page.waitForTimeout(400);
    const total = Number((((await page.locator('.screen-count').first().textContent()) || '/ 16').split('/')[1] || '16').trim()) || 16;

    for (let screen = 0; screen < total; screen += 1) {
      await page.waitForTimeout(420);
      // Faqat HAQIQIY variant tugmalari. Ikki sababdan:
      //  - shkaladagi belgilar SVG `rect`, ularga `disabled` ham qo'yilmaydi va
      //    `data-*` atributi bilan qizartirilmaydi (u yerda ko'rsatkich chizma
      //    ichida chiziladi);
      //  - `.token`, `.order-card`, `.tile` kabi KO'P QADAMLI mexanikalarda
      //    to'g'ri tanlovdan keyin navbatdagi qadam ochiladi, shuning uchun
      //    "to'g'ri javob hammasini qulflaydi" qoidasi ularga tegishli emas.
      const ONE_SHOT = 'button.option, button.reflection-option, button.repair-row, button.slot, button.chip, button.level-tick';
      const wrong = page.locator(`${ONE_SHOT.split(', ').map((s) => `${s}[data-g4-correct="false"]`).join(', ')}`);
      const right = page.locator(`${ONE_SHOT.split(', ').map((s) => `${s}[data-g4-correct="true"]`).join(', ')}`).first();
      const wrongCount = await wrong.count();

      if (wrongCount && await right.count()) {
        const target = wrong.first();
        if (!(await target.isDisabled().catch(() => true))) {
          tested += 1;
          await target.click().catch(() => {});
          await page.waitForTimeout(220);
          // 1-qoida, birinchi yarmi: bosilgan zahoti qizarib turadi.
          const flashed = await target.getAttribute('data-g4-wrong-flash').catch(() => null);
          if (flashed !== 'true') {
            problems.push({ screen: screen + 1, rule: 'flash-yoq', note: 'xato variant bosilganda data-g4-wrong-flash qo\'yilmadi' });
          }
          // 1-qoida, ikkinchi yarmi: flash tugagach neytral va yana bosiladi.
          await page.waitForTimeout(FLASH_WAIT);
          const stillFlashing = await target.getAttribute('data-g4-wrong-flash').catch(() => null);
          const stillLocked = await target.isDisabled().catch(() => true);
          if (stillFlashing === 'true') {
            problems.push({ screen: screen + 1, rule: 'flash-qolib-ketdi', note: 'qizil holat neytralga qaytmadi' });
          }
          if (stillLocked) {
            problems.push({ screen: screen + 1, rule: 'xato-qulflandi', note: 'xato variantni qayta tanlash mumkin emas' });
          }
        }
        // 2-qoida: to'g'ri javobdan keyin hech narsa tanlanmaydi.
        if (!(await right.isDisabled().catch(() => true))) {
          await right.click().catch(() => {});
          await page.waitForTimeout(450);
          const open = await page.locator(ONE_SHOT.split(', ').map((s) => `${s}[data-g4-correct="false"]:not([disabled])`).join(', ')).count();
          if (open > 0) {
            problems.push({ screen: screen + 1, rule: 'togri-javob-qulflamadi', note: `${open} variant hamon bosiladi` });
          }
        }
      }

      // Ko'p qadamli mexanikalar: faqat 1-qoida tekshiriladi (xato tanlov
      // qizarib, so'ng neytralga qaytishi kerak). Qulflash qoidasi bu yerda
      // qo'llanmaydi — to'g'ri tanlov navbatdagi qadamni ochadi.
      // MUHIM: selektorga `:not([disabled])` qo'shilmaydi. Bosilgandan keyin
      // element vaqtincha qulflanadi va lokator BOSHQA tugmaga ko'chib ketardi
      // — natijada tekshiruv o'zi bosmagan tugmani o'lchab, "flash yo'q" deb
      // yolg'on ogohlantirish berardi.
      const STEPWISE = 'button.token, button.order-card, button.tile, button.span-cell';
      const stepWrong = page.locator(STEPWISE.split(', ').map((s) => `${s}[data-g4-correct="false"]`).join(', ')).first();
      if (await stepWrong.count() && !(await stepWrong.isDisabled().catch(() => true))) {
        tested += 1;
        await stepWrong.click().catch(() => {});
        await page.waitForTimeout(220);
        if (await stepWrong.getAttribute('data-g4-wrong-flash').catch(() => null) !== 'true') {
          problems.push({ screen: screen + 1, rule: 'flash-yoq-qadamli', note: 'ko\'p qadamli mexanikada xato tanlov qizarmadi' });
        }
        await page.waitForTimeout(FLASH_WAIT);
        if (await stepWrong.getAttribute('data-g4-wrong-flash').catch(() => null) === 'true') {
          problems.push({ screen: screen + 1, rule: 'flash-qolib-ketdi-qadamli', note: 'qizil holat neytralga qaytmadi' });
        }
        if (await stepWrong.isDisabled().catch(() => true)) {
          problems.push({ screen: screen + 1, rule: 'xato-qulflandi-qadamli', note: 'xato tanlovni qayta bosish mumkin emas' });
        }
      }

      const next = page.locator('.stage-nav button:last-child, .btn-next, .btn-white-accent').last();
      if (!(await next.count())) break;
      if (await next.isDisabled().catch(() => true)) {
        const any = page.locator('.option:not([disabled]), .slot:not([disabled]), .chip:not([disabled]), .tile:not([disabled]), .repair-row:not([disabled]), .route-card:not([disabled]), .level-tick:not([disabled]), .span-cell:not([disabled])');
        const n = Math.min(await any.count(), 8);
        for (let k = 0; k < n; k += 1) {
          await any.nth(k).click().catch(() => {});
          await page.waitForTimeout(320);
          if (!(await next.isDisabled().catch(() => true))) break;
        }
      }
      if (await next.isDisabled().catch(() => true)) break;
      await next.click().catch(() => {});
    }
  } catch (error) {
    problems.push({ rule: 'fatal', note: String(error).slice(0, 200) });
  }
  await page.close();

  report.push({ lesson, tested, problems, consoleErrors: errors.slice(0, 4) });
  const tag = problems.length ? `${problems.length} MUAMMO` : 'toza';
  console.log(`${LANG ? LANG.toUpperCase() + ' ' : ''}Dars ${String(lesson).padStart(2, '0')}: ${tested} ekran sinaldi — ${tag}${errors.length ? `, ${errors.length} konsol xatosi` : ''}`);
};

const queue = [...lessons];
await Promise.all(Array.from({ length: Math.min(JOBS, queue.length) }, async () => {
  while (queue.length) await auditLesson(queue.shift());
}));

await browser.close();
writeFileSync(OUT, JSON.stringify(report, null, 2));
const bad = report.filter((r) => r.problems.length).length;
console.log(`\n${report.length} dars, ${bad} tasida muammo. To'liq hisobot: ${OUT}`);
process.exit(bad ? 1 : 0);
