// 6-sinf, 1-dars: 15 ta ekranning HAMMASI ochiladimi va konsol tozami.
// Har ekranga kiramiz, hisoblagichni, konsolni va foldni o'qiymiz.
//
// 2026-08-15: eski `grade6-dars01-hook-check.mjs` dagi CHUQUR tekshiruvlar shu
// yerga ko'chirildi (birinchi o'tishda ishlaydi): ekran 04 ko'rsatishdan
// boshlanadimi va navbat bolaga o'tadimi, ekran 07 kinosi oxirigacha ketadimi,
// ekran 13 da javobdan keyin barcha juftliklar chiqadimi. Har qanday darsga
// yaraydigan tekshiruv — `grade6-lesson-smoke.mjs`.
//
// Ishga tushirish:
//   npx vite --port 5199        (alohida terminalda)
//   node scripts/grade6-dars01-smoke.mjs
import { chromium } from 'playwright';
import fs from 'node:fs';

// MANBA TEKSHIRUVI, brauzerdan OLDIN. `STYLES` — shablon satr, shuning uchun
// ikkita belgi butun darsni yiqitadi:
//   1) teskari qo'shtirnoq — satrni uzib qo'yadi
//      (2026-08-13: CSS izohiga tushib qoldi, 4-ekran qulab tushdi);
//   2) teskari chiziq — JS uni escape deb o'qiydi, `content: '\2014'` kabi
//      CSS kodi «Bad escape sequence» beradi
//      (2026-08-14: yakun ekranida tire CSS kodi bilan yozilgan edi).
// Ikkalasi ham brauzerda oq sahifa beradi, sababi esa ko'rinmaydi.
const SRC = fs.readFileSync('src/components/grade6/Dars01.jsx', 'utf8').split('\n');
{
  const a = SRC.findIndex((l) => l.startsWith('const STYLES = '));
  const b = SRC.findIndex((l, i) => i > a && l.trim() === '`;');
  const tick = [];
  const esc = [];
  for (let i = a + 1; i < b; i += 1) {
    if (SRC[i].includes('`')) tick.push(i + 1);
    // Shablon satrda ruxsat etilgani: \n \t \\ \` \${ va \uXXXX. Qolgani xato.
    if (/\\(?![nrt\\`$u])/.test(SRC[i])) esc.push(i + 1);
  }
  if (tick.length) console.log(`XATO: STYLES ichida teskari qo'shtirnoq, qatorlar: ${tick.join(', ')}`);
  if (esc.length) console.log(`XATO: STYLES ichida escape bo'ladigan teskari chiziq, qatorlar: ${esc.join(', ')}`);
  if (tick.length || esc.length) process.exit(1);
}

const BASE = process.env.BASE || 'http://localhost:5199';
const SLUG = 'dars01-boluvchilar-va-karrali-sonlar';
const TOTAL = 15;
const problems = [];
const note = (m) => console.log('  ' + m);
const fail = (m) => { problems.push(m); console.log('  XATO: ' + m); };

// Ekranlarning kutilgan «yuzi»: har birida shu selektor bo'lishi shart.
// DIQQAT: bu ro'yxat darsdan ORQADA QOLMASLIGI kerak. 2026-08-14 da 2-ekranda
// `.rc-grid` `.rc-teams` ga almashdi va tekshiruv «topilmadi» deb qichqirdi —
// xato darsda emas, shu yerda edi. Ekran ichini o'zgartirsangiz, shu qatorni ham.
const EXPECT = [
  ['.hk', 'xuk: turnir'],
  ['.rc-teams', 'eslaymiz: ko\'paytirish jadvali'],
  ['.rv-col', 'ikki nom'],
  ['.mc-card', 'usul 1: bo\'linadimi'],
  ['.mc-card', 'usul 2: juftliklar'],
  ['.sv-row', 'birga yechamiz: 24'],
  ['.mc-card', 'usul 3: karralar'],
  ['.rule-text-frame', 'qoida'],
  ['.pn-row', 'mashq: rollar'],
  ['.sv-opts', 'mashq: bo\'linadimi x4'],
  ['.ans-block', 'mashq: barcha bo\'luvchilar'],
  ['.fe-sheet', 'mashq: xatoni topish'],
  ['.gr-grid', 'masala: suratlar to\'ri'],
  ['.fn-pad', 'yakuniy test'],
  ['.sm-cards', 'xulosa: uch usul'],
];

// Indekslar (0 dan): kadrlari vaqt bilan ochiladigan ekranlar.
// 1 eslaymiz, 2 ikki nom, 4 juftliklar, 5 birga yechamiz, 6 ikki chiziq.
const FILM_SCREENS = [1, 2, 4, 5, 6];

async function run(lang, width, height, deep = false) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width, height } });
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));

  console.log(`\n[${lang}] ${width}x${height}`);
  for (let i = 0; i < TOTAL; i += 1) {
    const [sel, name] = EXPECT[i];
    // `?screen=` — это НОМЕР НА ЭКРАНЕ (1..15), а не индекс массива.
    await page.goto(`${BASE}/6-sinf/matematika/nazariy/${SLUG}?lang=${lang}&screen=${i + 1}`, { waitUntil: 'networkidle' });
    try {
      await page.waitForSelector('.lesson-root', { timeout: 12000 });
    } catch {
      fail(`ekran ${i + 1} (${name}) umuman ochilmadi`);
      continue;
    }
    // Ovozni o'chiramiz: kadrlar taymer bilan ketsin, tekshiruv tez bo'lsin.
    const b = page.locator('button[title="Sound off"]').first();
    if (await b.count()) await b.click().catch(() => {});
    await page.waitForTimeout(700);

    const counter = (await page.locator('.chrome .mono').first().innerText().catch(() => '')).trim();
    const want = String(i + 1).padStart(2, '0');
    if (!counter.startsWith(want)) fail(`ekran ${i + 1} (${name}): hisoblagich "${counter}", kutilgan ${want}`);
    if (!counter.includes(`/ ${TOTAL}`)) fail(`ekran ${i + 1}: jami ${TOTAL} emas, "${counter}"`);

    const seen = await page.locator(sel).count();
    if (!seen) fail(`ekran ${i + 1} (${name}): "${sel}" topilmadi`);
    else note(`${counter} — ${name}`);

    // Gorizontal chiqib ketish (kesib turadigan ota elementlar hisobga olinadi).
    const over = await page.evaluate(() => {
      const root = document.querySelector('.lesson-root');
      if (!root) return [];
      const box = root.getBoundingClientRect();
      const clipped = (el) => {
        let p = el.parentElement;
        while (p && p !== document.body) {
          const ov = getComputedStyle(p).overflowX;
          if (ov === 'hidden' || ov === 'clip' || ov === 'auto' || ov === 'scroll') return true;
          p = p.parentElement;
        }
        return false;
      };
      const bad = [];
      document.querySelectorAll('.lesson-root .stage-content *').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) return;
        if (r.right > box.right + 1.5 || r.left < box.left - 1.5) {
          if (!clipped(el)) bad.push((el.className || el.tagName) + '');
        }
      });
      return bad.slice(0, 3);
    });
    over.forEach((o) => fail(`ekran ${i + 1}: ${o} gorizontal chiqib ketdi`));

    // VERTIKAL fold: kontent pastki panel ostiga kirib ketmasligi kerak.
    // Aynan shu nuqson ikki marta o'tib ketdi (13 va 15-ekran), shuning uchun
    // u endi HAR ekranda tekshiriladi.
    // MUHIM: o'lchash KIRISH ANIMATSIYASI tugagandan keyin. `fade-up` bloklarni
    // pastdan olib chiqadi, va 700 ms da ular hali pastda turadi — shunda
    // tekshiruv aslida yo'q nuqsonni ko'rsatadi (8-ekranda shunday bo'ldi).
    // Ikkinchi o'lchov kinolar uchun: ularda kontent vaqt bilan o'sadi.
    // Skrollga ehtiyoj BOR-YO'QLIGI o'lchanadi, elementlar emas.
    // Avvalgi tekshiruv ota elementlar bo'ylab yurib `overflow` qidirardi va
    // `.stage-content` da `overflow-y: auto` ni topib, HAMMA narsani
    // «ko'rinmaydi» deb hisoblardi — ya'ni hech qachon ishlamasdi.
    const foldOverflow = () => page.evaluate(() => {
      const el = document.querySelector('.lesson-root .stage-content');
      if (!el) return 0;
      return Math.max(0, Math.round(el.scrollHeight - el.clientHeight));
    });
    await page.waitForTimeout(1300);
    let under = await foldOverflow();
    await page.waitForTimeout(4500);
    under = Math.max(under, await foldOverflow());
    // KINO ekranlarida kontent 30-soniyagacha o'sib boradi: ovoz o'chirilganda
    // kadrlar taymer bilan ketadi. Oltinchi soniyadagi o'lchov ularni
    // ko'rmaydi — 7-ekranda aynan shu tufayli kesilgan blok o'tib ketdi.
    if (FILM_SCREENS.includes(i)) {
      await page.waitForTimeout(26000);
      under = Math.max(under, await foldOverflow());
    }
    if (under) fail(`ekran ${i + 1} (${name}): kontent pastki paneldan ${under}px pastga chiqdi`);
  }

  // ---- XUK KONTRAKTI (metodist qarori 2026-08-14) ----
  // Xuk bolaning TAXMINI ni qabul qiladi va O'ZI yopiladi — sinfning qolgan
  // darslaridagidek (8-46 darslar movtori va 2-7 darslar bir xil ishlaydi).
  // Shuning uchun xukda BO'LMASLIGI kerak: komanda qutilari, zaxira, formula,
  // ikki holatning taqqoslanishi, xulosa, «bu yana qayerda kerak» va javob
  // rangi. Tanlovdan keyin dars keyingi ekranga o'tadi.
  await page.goto(`${BASE}/6-sinf/matematika/nazariy/${SLUG}?lang=${lang}&screen=1`, { waitUntil: 'networkidle' });
  await page.waitForSelector('.hk', { timeout: 12000 });
  {
    const b = page.locator('button[title="Sound off"]').first();
    if (await b.count()) await b.click().catch(() => {});
  }
  await page.waitForTimeout(900);
  const opts = page.locator('.g6-hook-options .option');
  if (await opts.count() !== 2) fail(`xuk: ikkita variant emas, ${await opts.count()} ta`);
  if (!(await page.locator('.g6-hook-note').count())) fail("xuk: «javobni hozir ochmaymiz» qatori yo'q");
  const underHook = await page.evaluate(() => {
    const el = document.querySelector('.lesson-root .stage-content');
    return el ? Math.max(0, Math.round(el.scrollHeight - el.clientHeight)) : 0;
  });
  if (underHook) fail(`xuk: kontent pastki paneldan ${underHook}px pastga chiqdi`);
  await opts.first().click();
  // Javob oshkor bo'lmasligi TANLOV PAYTIDA tekshiriladi: agar razbor qaytsa,
  // u aynan shu yerda, ekran yopilishidan oldin chiqadi.
  await page.waitForTimeout(260);
  for (const [sel, what] of [
    ['.hk-team', 'komanda qutilari'], ['.hk-bench', 'zaxira'], ['.hk-eq', 'formula'],
    ['.hk-both', 'ikki holat taqqoslanishi'], ['.hk-why', '«yana qayerda kerak» bloki'],
    ['.hk-other', '«ikkinchisida qanday» tugmasi'],
    ['.option-correct', "to'g'ri javob rangi"], ['.option-picked-wrong', 'xato javob rangi'],
  ]) {
    if (await page.locator(sel).count()) fail(`xuk: tanlovdan keyin ${what} chiqdi (javob oshkor bo'ldi)`);
  }
  note('xuk: javob oshkor qilinmadi');
  await page.waitForTimeout(1400);
  const afterPick = (await page.locator('.chrome .mono').first().innerText().catch(() => '')).trim();
  if (!afterPick.startsWith('02')) fail(`xuk: tanlovdan keyin dars o'tmadi, hisoblagich "${afterPick}"`);
  else note("xuk: taxmin qabul qilindi, dars 02 ga o'tdi");

  // ---- CHUQUR TEKSHIRUVLAR (2026-08-15) ----
  // Eski `grade6-dars01-hook-check.mjs` dagi tekshiruvlar shu yerga ko'chirildi
  // va YANGI ekran raqamlariga moslandi. Ular «ekran ochildimi» degan savolga
  // emas, «ekran O'Z ISHINI qildimi» degan savolga javob beradi.
  // Faqat BIRINCHI o'lchamda ishlaydi: kadrlar vaqt bilan ketadi, uch marta
  // takrorlash tekshiruvni ikki barobar uzaytiradi va yangi nuqson bermaydi.
  if (deep) {
    // Ekran 04 — «avval ko'rsatamiz, keyin o'zi». Erkin kiritish maydoni YO'Q,
    // dars KO'RSATISHDAN boshlanadi, keyin bolaning navbati keladi.
    await page.goto(`${BASE}/6-sinf/matematika/nazariy/${SLUG}?lang=${lang}&screen=4`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.tl-banner', { timeout: 12000 });
    {
      const b = page.locator('button[title="Sound off"]').first();
      if (await b.count()) await b.click().catch(() => {});
    }
    await page.waitForTimeout(400);
    if (await page.locator('.tl-input').count()) fail('04: erkin kiritish maydoni qaytib kelgan');
    if (await page.locator('.tl-banner-play').count()) fail("04: dars ko'rsatishdan emas, bolaning navbatidan boshlandi");
    await page.waitForTimeout(4200);
    const demoTiles = await page.locator('.rs-tile').count();
    if (demoTiles !== 24) fail(`04: ko'rsatishda 24 plitka emas, ${demoTiles} ta`);
    const demoEq = (await page.locator('.rs-formula').first().innerText().catch(() => '')).trim();
    if (!demoEq.startsWith('24 : 6 = 4')) fail(`04: kutilgan 24 : 6 = 4, kelgan "${demoEq}"`);
    if (await page.locator('.rs-tile-extra').count()) fail("04: ko'rsatishda qoldiq chiqdi, 24 oltiga tekis bo'linadi");
    const nextBtn = page.locator('.tl-next');
    if (!(await nextBtn.count()) || await nextBtn.isDisabled()) fail("04: «Endi o'zim» tugmasi ochilmadi");
    else {
      await nextBtn.click();
      await page.waitForTimeout(700);
      if (!(await page.locator('.tl-banner-play').count())) fail('04: bolaning navbati boshlanmadi');
      else note("04: ko'rsatish tugadi, navbat bolaga o'tdi");
    }

    // Ekran 07 — kino: bitta o'qda karralar va bo'luvchilar SHAG'ma-shag' ketadi.
    // Natija HARAKATDAN OLDIN ko'rinmasligi kerak, oxirida devor va cheksizlik
    // belgisi chiqadi.
    await page.goto(`${BASE}/6-sinf/matematika/nazariy/${SLUG}?lang=${lang}&screen=7`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ax-box', { timeout: 12000 });
    {
      const b = page.locator('button[title="Sound off"]').first();
      if (await b.count()) await b.click().catch(() => {});
    }
    await page.waitForTimeout(400);
    if (await page.locator('.ax-wall.ax-on').count()) fail("07: devor harakatdan oldin ko'rinib turibdi");
    if (await page.locator('.ax-slider, .ax-arrow').count()) fail("07: interaktiv qaytib kelgan, ekran kino bo'lishi kerak");
    // Kino oxirini KUTAMIZ, taymer bilan taxmin qilmaymiz: qat'iy 20 soniya
    // (2026-08-15) hali xulosa chiqmagan joyda tugab, yo'q nuqsonni ko'rsatdi.
    await page.locator('.frame-success').first().waitFor({ state: 'visible', timeout: 40000 }).catch(() => {});
    const dotsOn = await page.locator('.ax-dot.ax-on').count();
    if (dotsOn < 10) fail(`07: o'qda ${dotsOn} ta belgi yondi, kutilgan 12 ta`);
    if (!(await page.locator('.ax-wall.ax-on').count())) fail("07: bo'luvchilar devori chiqmadi");
    if (!(await page.locator('.ax-more.ax-on').count())) fail('07: cheksizlik belgisi chiqmadi');
    if (!(await page.locator('.frame-success').count())) fail('07: yakuniy xulosa chiqmadi');
    else note('07: kino oxirigacha ketdi, devor va cheksizlik joyida');

    // Ekran 13 — javobdan keyin BARCHA juftliklar qatori chiqadi: bola ularni
    // o'zi qayta sanay oladi.
    await page.goto(`${BASE}/6-sinf/matematika/nazariy/${SLUG}?lang=${lang}&screen=13`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.gr-opts', { timeout: 12000 });
    {
      const b = page.locator('button[title="Sound off"]').first();
      if (await b.count()) await b.click().catch(() => {});
    }
    await page.waitForTimeout(600);
    if (await page.locator('.gp-chip').count()) fail('13: juftliklar javobdan oldin ochiq');
    await page.locator('.gr-opts .option').nth(2).click();   // 8 — to'g'ri javob
    await page.waitForTimeout(1200);
    const chips = await page.locator('.gp-chip').count();
    if (chips !== 8) fail(`13: javobdan keyin 8 juftlik emas, ${chips} ta`);
    else note('13: sakkizta juftlik chiqdi');
  }

  await browser.close();
  return errors;
}

const all = [];
const PASSES = [['ru', 1366, 768], ['uz', 1366, 768], ['ru', 390, 844]];
for (let i = 0; i < PASSES.length; i += 1) {
  const [lang, w, h] = PASSES[i];
  // Chuqur tekshiruvlar faqat birinchi o'tishda: kadrlar vaqt bilan ketadi.
  all.push(...(await run(lang, w, h, i === 0)));
}
// Previewda TTS manzili yo'q — ovoz so'rovi 404 qaytaradi, bu dars nuqsoni emas.
const real = all.filter((e) => !/favicon|net::ERR_|Web Speech|speechSynthesis|Failed to load resource/i.test(e));
console.log('\n=== NATIJA ===');
console.log('konsol xatolari: ' + real.length);
real.slice(0, 10).forEach((e) => console.log('  ' + e));
console.log('muammolar: ' + problems.length);
problems.forEach((p) => console.log('  ' + p));
process.exit(problems.length || real.length ? 1 : 0);
