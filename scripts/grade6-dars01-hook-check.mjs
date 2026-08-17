// ⚠ СКРИПТ БОЛЬШЕ НЕ НУЖЕН И НЕ ЗАПУСКАЕТСЯ. 2026-08-15 всё ценное из него
// перенесено в `scripts/grade6-dars01-smoke.mjs` (глубокие проверки экранов 4,
// 7 и 13) и пересчитано под нынешние номера экранов. Файл оставлен только как
// история; удалять его — решение методиста.
//
// ВНИМАНИЕ: ЭТОТ СКРИПТ УСТАРЕЛ ПОСЛЕ ПЕРЕСБОРКИ УРОКА В 15 ЭКРАНОВ (v4).
// Его проверки хука (строки 103-138) устарели ВТОРОЙ раз: 2026-08-14 методист
// снял с хука разбор. Хук принимает прогноз и заканчивается, поэтому команд,
// скамейки, формулы, сравнения двух случаев и блока «где это ещё нужно» на нём
// БОЛЬШЕ НЕТ — их отсутствие теперь и есть контракт. Актуальная проверка хука
// живёт в `scripts/grade6-dars01-smoke.mjs`; восстанавливать проверки отсюда
// нельзя.
// Он написан под прежнюю структуру из 17 экранов и обращается к номерам,
// которых больше нет: хук был 02 (стал 01), инструмент 07 (стал 04), пары 09
// (стали 05), две прямые 13 (стали 07), а экран «а если остаётся лишнее»
// убран совсем. Запускать его сейчас БЕСПОЛЕЗНО: он падает на несовпадении
// номеров, а не на дефекте урока.
// Актуальная проверка всех 15 экранов — `scripts/grade6-dars01-smoke.mjs`.
// Глубокие проверки (кадры фильмов, разборы ответов) из этого файла нужно
// перенести в smoke по новым номерам — работа не сделана.
//
// 6-sinf, 1-dars: XUK, UCHTA KINO va «ko'rsat, keyin o'zi» ekranini tekshirish.
// Ekranlar: 02 xuk, 06 qatorlar (kino), 07 ko'rsat-keyin-o'zi, 09 juftliklar
// (kino), 13 ikki chiziq (kino). Jami 17.
// Nima tekshiriladi:
//   1. dars ochiladi, konsolda xato yo'q;
//   2. xuk ekrani (02/17) chiqadi, variantlar bosilishga tayyor;
//   3. javob tanlanmaguncha komanda qutilari BO'SH (spoyler yo'q);
//   4. tanlovdan keyin figuralar joyiga keladi, zaxira holati to'g'ri;
//   5. "Davom" tugmasi HAR DOIM ochiq (metodist qarori 2026-08-13: qulf yo'q);
//   6. hech bir element sahnadan chiqib ketmaydi (desktop 1366x768 va 390x844);
//   7. yakuniy ekranda BALL qatori yo'q;
//   8. kino ekranlarida (06, 09, 13) INTERAKTIV QOLMAGAN: slayder, son tugmalari
//      va strelkalar yo'q, kadrlar o'zi ketadi va natija harakatdan OLDIN
//      ko'rinmaydi;
//   9. ekran 07 ko'rsatishdan boshlanadi (24 va 6), erkin kiritish maydoni yo'q,
//      keyin bolaning navbati keladi (son 25 qat'iy, u bo'luvchini tanlaydi).
// Ovoz o'chirilgan holatda kadrlarni TAYMER suradi, shuning uchun kino
// ekranlarida kutish uzun: bu sekinlik emas, o'qish tezligi bo'yicha hisob.
//
// Ishga tushirish:
//   npx vite --port 5199        (alohida terminalda)
//   node scripts/grade6-dars01-hook-check.mjs
import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://localhost:5199';
const SLUG = 'dars01-boluvchilar-va-karrali-sonlar';
const problems = [];
const note = (m) => console.log('  ' + m);
const fail = (m) => { problems.push(m); console.log('  XATO: ' + m); };

async function overflow(page) {
  return page.evaluate(() => {
    const root = document.querySelector('.lesson-root');
    if (!root) return ['.lesson-root topilmadi'];
    const box = root.getBoundingClientRect();
    const bad = [];
    // Kesib turadigan ota element bo'lsa, element ekrandan CHIQMAYDI: u shunchaki
    // yashiringan. Magnit chizig'i (mg-rail) ataylab oynadan keng va mg-vp uni
    // kesadi — buni buzilish deb hisoblash noto'g'ri bo'lardi.
    const clipped = (el) => {
      let p = el.parentElement;
      while (p && p !== document.body) {
        const ov = getComputedStyle(p).overflowX;
        if (ov === 'hidden' || ov === 'clip' || ov === 'auto' || ov === 'scroll') return true;
        p = p.parentElement;
      }
      return false;
    };
    document.querySelectorAll('.lesson-root .stage-content *').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return;
      if (r.right > box.right + 1.5 || r.left < box.left - 1.5) {
        if (clipped(el)) return;
        bad.push((el.className || el.tagName) + ' gorizontal chiqib ketdi');
      }
    });
    return bad.slice(0, 5);
  });
}

async function run(lang, width, height) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width, height } });
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));

  console.log(`\n[${lang}] ${width}x${height}`);
  await page.goto(`${BASE}/6-sinf/matematika/nazariy/${SLUG}?lang=${lang}`, { waitUntil: 'networkidle' });
  await page.waitForSelector('.lesson-root', { timeout: 15000 });

  // Ovozni o'chiramiz: tekshiruv tez ketsin (qulf endi yo'q, lekin ovoz navbati bor).
  // Tugma sarlavhasi «Sound off» — ovoz YOQILGAN holatda shunday yoziladi.
  const mute = async () => {
    const b = page.locator('button[title="Sound off"]').first();
    if (await b.count()) await b.click().catch(() => {});
    await page.waitForTimeout(200);
  };
  await mute();

  // 01 -> 02: sarlavha ekranidagi tanlov darsni boshlaydi.
  const startOpt = page.locator('.ttl-opt').first();
  await startOpt.waitFor({ state: 'visible', timeout: 20000 });
  await startOpt.click();
  await page.waitForTimeout(900);

  const counter = (await page.locator('.chrome .mono').first().innerText()).trim();
  if (!counter.startsWith('02')) fail(`xuk ekrani 02 emas, hisoblagich: ${counter}`);
  else note(`hisoblagich ${counter}`);

  if (!(await page.locator('.hk').count())) { fail('xuk ekrani chiqmadi'); await browser.close(); return errors; }

  // Spoyler tekshiruvi: javobdan OLDIN komanda qutisi bo'lmasligi kerak.
  if (await page.locator('.hk-team').count()) fail('javobdan oldin komanda qutilari ko\'rinib turibdi');
  else note('javobdan oldin sahna bo\'sh — spoyler yo\'q');

  const pool = await page.locator('.hk-pool .hk-fig').count();
  if (pool !== 24) fail(`to'dada 24 figura emas, ${pool} ta`); else note('to\'dada 24 figura');

  await page.locator('.hk-opt').first().waitFor({ state: 'visible', timeout: 20000 });
  let bad = await overflow(page);
  bad.forEach(fail);

  // "Beshtadan" — qoldiq bo'lgan holat.
  await page.locator('.hk-opt').first().click();
  await page.waitForTimeout(1400);
  const teams = await page.locator('.hk-team').count();
  const benchBad = await page.locator('.hk-bench-bad .hk-fig').count();
  if (teams !== 4) fail(`beshtadan: 4 komanda emas, ${teams} ta`); else note('beshtadan: 4 komanda');
  if (benchBad !== 4) fail(`beshtadan: zaxirada 4 kishi emas, ${benchBad} ta`); else note('beshtadan: zaxirada 4 kishi');
  const eq = (await page.locator('.hk-eq').first().innerText()).trim();
  if (!eq.includes('24 : 5 = 4')) fail(`formula kutilganidan boshqa: ${eq}`); else note(`formula: ${eq}`);

  // Metodist qarori 2026-08-13: slayd o'tishi QULFLANMAYDI. Tugma har doim ochiq;
  // spoyler tekshiruvlari (natija harakatdan oldin ko'rinmasligi) qoladi.
  const next = page.locator('.stage-nav .btn-white-accent');
  if (await next.isDisabled()) fail('xuk: "Davom" yopiq, qulf o\'chirilgan bo\'lishi kerak');
  else note('xuk: "Davom" ochiq (qulf o\'chirilgan)');

  await page.locator('.hk-other').click();
  await page.waitForTimeout(1500);
  const scenes = await page.locator('.hk-both .hk-scene').count();
  if (scenes !== 2) fail(`taqqoslashda 2 sahna emas, ${scenes} ta`); else note('ikkala holat yonma-yon');
  if (!(await page.locator('.hk-bench-ok').count())) fail('oltitadan holatida yashil zaxira yo\'q');
  if (!(await page.locator('.hk-why').count())) fail('"nimaga kerak" bloki chiqmadi');
  else note('"nimaga kerak" bloki bor');
  if (await next.isDisabled()) fail('ikkala holat ko\'rilgandan keyin ham "Davom" yopiq');
  else note('"Davom" ochildi');

  bad = await overflow(page);
  bad.forEach(fail);
  await page.screenshot({ path: `.tmp-hook-${lang}-${width}.png`, fullPage: false });

  // Tartib: 03 — kashfiyot, 04 — mashq (navbat almashadi).
  await next.click();
  await page.waitForTimeout(900);
  const c3 = (await page.locator('.chrome .mono').first().innerText()).trim();
  if (!c3.startsWith('03')) fail(`xukdan keyin 03 emas: ${c3}`); else note(`xukdan keyin ${c3}`);

  // ---- EKRAN 06: 12 plitka qatorlarga qayta tiziladi ----
  // Oldingi ekranlar TO'G'RI javob talab qiladi, shuning uchun 06 ga preview
  // parametri bilan to'g'ridan-to'g'ri kiramiz (LMS da bu parametr yo'q).
  await page.goto(`${BASE}/6-sinf/matematika/nazariy/${SLUG}?lang=${lang}&screen=6`, { waitUntil: 'networkidle' });
  await page.waitForSelector('.rs-scene', { timeout: 15000 });
  await mute();
  await page.waitForTimeout(500);

  const c6 = (await page.locator('.chrome .mono').first().innerText()).trim();
  if (!c6.startsWith('06')) fail(`kutilgan 06, kelgan ${c6}`); else note(`ekran ${c6}`);
  if (!(await page.locator('.rs-scene').count())) { fail('06: interaktiv blok yo\'q'); await browser.close(); return errors; }

  const tileCount = await page.locator('.rs-tile').count();
  if (tileCount !== 12) fail(`06: 12 plitka emas, ${tileCount} ta`); else note("06: 12 plitka");
  // Interaktiv olib tashlangan (metodist 2026-08-13): slayder BO'LMASLIGI kerak.
  if (await page.locator('.rs-slider').count()) fail("06: slayder hali ham bor, kino bo'lishi kerak");
  else note("06: slayder yo'q — kino");

  // Kadr 0: natija harakatdan OLDIN chiqmaydi.
  const fOn = await page.locator('.rs-formula.rs-on').count();
  if (fOn) fail("06: birinchi kadrda formula ko'rinib turibdi"); else note("06: birinchi kadrda natija yo'q");

  const nx = page.locator('.stage-nav .btn-white-accent');
  if (await nx.isDisabled()) fail("06: \"Davom\" yopiq, qulf o'chirilgan bo'lishi kerak");
  else note("06: \"Davom\" ochiq");

  // Kadr 1: plitkalar HAQIQATDAN ko'chadi va uch qatorga tekis joylashadi.
  const before = await page.locator('.rs-tile').first().getAttribute('style');
  await page.waitForTimeout(5200);
  const after = await page.locator('.rs-tile').first().getAttribute('style');
  if (before === after) fail("06: plitka joyidan siljimadi"); else note("06: plitka joyini o'zgartirdi");
  const eq1 = (await page.locator('.rs-formula').innerText()).trim();
  if (!eq1.startsWith('12 : 3 = 4')) fail(`06: kutilgan 12 : 3 = 4, kelgan "${eq1}"`); else note(`06: ${eq1}`);

  // Kadr 2: besh qator — qoldiq.
  await page.waitForTimeout(9000);
  const eq2 = (await page.locator('.rs-formula').innerText()).trim();
  if (!eq2.includes('12 : 5 = 2')) fail(`06: qoldiq kadri chiqmadi, "${eq2}"`); else note(`06: ${eq2}`);
  if (!(await page.locator('.rs-zone-on').count())) fail("06: qoldiq zonasi ochilmadi");
  else note("06: qoldiq zonasi ochildi");
  const extra = await page.locator('.rs-tile-extra').count();
  if (extra !== 2) fail(`06: qoldiqda 2 plitka emas, ${extra} ta`); else note("06: qoldiqda 2 plitka");

  bad = await overflow(page);
  bad.forEach(fail);
  await page.screenshot({ path: `.tmp-rows-${lang}-${width}.png` });

  // ---- EKRAN 07: «avval ko'rsatamiz, keyin o'zi» ----
  // Metodist qarori 2026-08-13: erkin kiritish maydoni OLIB TASHLANDI.
  // Avval ko'rsatish (24 va 6) o'zi ketadi, keyin bolaning navbati (son 25).
  await page.goto(`${BASE}/6-sinf/matematika/nazariy/${SLUG}?lang=${lang}&screen=7`, { waitUntil: 'networkidle' });
  await page.waitForSelector('.tl-ctl', { timeout: 15000 });
  await mute();
  await page.waitForTimeout(400);

  const c7 = (await page.locator('.chrome .mono').first().innerText()).trim();
  if (!c7.startsWith('07')) fail(`kutilgan 07, kelgan ${c7}`); else note(`ekran ${c7}`);
  if (await page.locator('.tl-input').count()) fail("07: erkin kiritish maydoni hali ham bor");
  else note("07: erkin kiritish maydoni yo'q");
  if (!(await page.locator('.tl-banner').count())) fail("07: navbat banneri yo'q");
  else note('07: banner bor');
  if (await page.locator('.tl-banner-play').count()) fail("07: dars ko'rsatishdan emas, bolaning navbatidan boshlandi");
  else note("07: ko'rsatishdan boshlandi");
  const nx7 = page.locator('.stage-nav .btn-white-accent');
  if (await nx7.isDisabled()) fail('07: "Davom" yopiq, qulf o\'chirilgan bo\'lishi kerak');
  else note('07: "Davom" ochiq');

  // Ko'rsatish O'ZI ketadi: 24 plitka tushadi va oltitadan to'rt qatorga yotadi.
  await page.waitForTimeout(4200);
  const demoTiles = await page.locator('.rs-tile').count();
  if (demoTiles !== 24) fail(`07: ko'rsatishda 24 plitka emas, ${demoTiles} ta`); else note("07: ko'rsatishda 24 plitka");
  const demoEq = (await page.locator('.rs-formula').innerText()).trim();
  if (!demoEq.startsWith('24 : 6 = 4')) fail(`07: kutilgan 24 : 6 = 4, kelgan "${demoEq}"`); else note(`07: ${demoEq}`);
  if (await page.locator('.rs-tile-extra').count()) fail("07: ko'rsatishda qoldiq chiqdi, 24 oltiga tekis bo'linadi");
  else note('07: qoldiqsiz');
  const replayBtn = page.locator('.tl-replay');
  const nextBtn = page.locator('.tl-next');
  if (!(await replayBtn.count()) || !(await nextBtn.count())) fail("07: «Yana» va «Endi o'zim» tugmalari yo'q");
  else if (await nextBtn.isDisabled()) fail("07: ko'rsatish tugagach «Endi o'zim» hali yopiq");
  else note("07: ikkala tugma ochildi");

  bad = await overflow(page);
  bad.forEach(fail);
  await page.screenshot({ path: `.tmp-tool-demo-${lang}-${width}.png` });

  // Bolaning navbati: son 25 qat'iy, u faqat bo'luvchini tanlaydi.
  await nextBtn.click();
  await page.waitForTimeout(700);
  if (!(await page.locator('.tl-banner-play').count())) fail("07: bolaning navbati banneri chiqmadi");
  else note('07: bolaning navbati boshlandi');
  const playNum = (await page.locator('.tl-num').first().innerText()).trim();
  if (playNum !== '25') fail(`07: navbatda son 25 emas, "${playNum}"`); else note('07: son 25');
  if (await page.locator('.rs-tile').count()) fail('07: tekshirishdan oldin plitka bor');
  else note("07: tekshirishdan oldin sahna bo'sh");
  const go = page.locator('.tl-go');
  if (!(await go.isDisabled())) fail("07: bo'luvchi tanlanmasdan tugma faol");
  else note("07: bo'luvchi tanlanmaguncha tugma yopiq");

  // 25 va 6 — qoldiqli holat: bitta plitka ortib qoladi.
  await page.locator('.tl-div').nth(4).click();          // 6
  await page.waitForTimeout(200);
  if (await go.isDisabled()) fail("07: bo'luvchi tanlangach ham tugma yopiq");
  await go.click();
  // 25 plitka: tushish (24*30+440) + ko'chish (620+24*30) — 2,7 sekunddan ko'p.
  await page.waitForTimeout(3400);
  const eqT = (await page.locator('.rs-formula').innerText()).trim();
  if (!eqT.includes('25 : 6 = 4')) fail(`07: kutilgan 25 : 6 = 4, kelgan "${eqT}"`); else note(`07: ${eqT}`);
  const tl = await page.locator('.rs-tile').count();
  if (tl !== 25) fail(`07: 25 plitka emas, ${tl} ta`); else note('07: 25 plitka');
  const ex = await page.locator('.rs-tile-extra').count();
  if (ex !== 1) fail(`07: qoldiqda 1 plitka emas, ${ex} ta`); else note('07: qoldiqda 1 plitka');
  if (await nx7.isDisabled()) fail('07: tekshirgandan keyin ham "Davom" yopiq');
  else note('07: "Davom" ochildi');

  bad = await overflow(page);
  bad.forEach(fail);
  await page.screenshot({ path: `.tmp-tool-${lang}-${width}.png` });

  // ---- EKRAN 13: KINO — ikki chiziq (karralar cheksiz, bo'luvchilar tugaydi) ----
  // Metodist qarori 2026-08-13: sudrash olib tashlandi, chiziqlar o'zi ishlaydi.
  await page.goto(`${BASE}/6-sinf/matematika/nazariy/${SLUG}?lang=${lang}&screen=13`, { waitUntil: 'networkidle' });
  await page.waitForSelector('.mg-zone-a', { timeout: 15000 });
  await mute();
  await page.waitForTimeout(400);

  const c13 = (await page.locator('.chrome .mono').first().innerText()).trim();
  if (!c13.startsWith('13')) fail(`kutilgan 13, kelgan ${c13}`); else note(`ekran ${c13}`);
  if (!(await page.locator('.mg-zone-b').count())) fail("13: pastki chiziq yo'q");
  if (await page.locator('.mg-arrow').count()) fail('13: strelkalar hali ham bor, kino bo\'lishi kerak');
  else note("13: strelkalar yo'q — kino");
  if (await page.locator('.mg-cap.mg-on').count()) fail("13: harakatdan oldin xulosa ko'rinib turibdi");
  else note("13: harakatdan oldin xulosa yo'q");
  if (await page.locator('.mg-lb-hit').count()) fail('13: birinchi kadrda karralar allaqachon yoritilgan');
  else note('13: birinchi kadr toza');
  const nx13 = page.locator('.stage-nav .btn-white-accent');
  if (await nx13.isDisabled()) fail('13: "Davom" yopiq, qulf o\'chirilgan bo\'lishi kerak');
  else note('13: "Davom" ochiq');

  // Kadr 1: belgi O'ZI oltita karrali sondan o'tadi va chiziq siljiydi.
  const railBefore = await page.locator('.mg-zone-a .mg-rail').getAttribute('style');
  await page.waitForTimeout(16000);
  const hits = await page.locator('.mg-lb-hit').count();
  if (hits < 6) fail(`13: oltita karrali son yoritilmadi, ${hits} ta`); else note(`13: ${hits} karrali son yoritildi`);
  const railAfter = await page.locator('.mg-zone-a .mg-rail').getAttribute('style');
  if (railBefore === railAfter) fail('13: yuqori chiziq siljimadi'); else note('13: yuqori chiziq siljidi');
  if (!(await page.locator('.mg-cap.mg-on').count())) fail('13: cheksizlik xulosasi chiqmadi');
  else note('13: cheksizlik xulosasi chiqdi');

  // Kadr 2: pastda oltita bo'luvchi birma-bir yonadi, keyin devor.
  await page.waitForTimeout(20000);
  const okCount = await page.locator('.mg-lb-ok').count();
  if (okCount < 6) fail(`13: oltita bo'luvchi yonmadi, ${okCount} ta`); else note(`13: ${okCount} bo'luvchi yondi`);
  if (!(await page.locator('.mg-frame-on').count())) fail("13: bo'luvchilar ramkasi chiqmadi");
  else note("13: bo'luvchilar ramkasi chiqdi");
  const caps = await page.locator('.mg-cap.mg-on').count();
  if (caps < 2) fail(`13: ikkala xulosa chiqmadi, ${caps} ta`); else note('13: ikkala xulosa chiqdi');

  // Kadr 3: umumiy xulosa yashil ramkada.
  await page.waitForTimeout(13000);
  if (!(await page.locator('.frame-success').count())) fail('13: yakuniy xulosa chiqmadi');
  else note('13: yakuniy xulosa chiqdi');
  if (await nx13.isDisabled()) fail('13: kino tugagandan keyin ham "Davom" yopiq');
  else note('13: "Davom" ochiq');

  bad = await overflow(page);
  bad.forEach(fail);
  await page.screenshot({ path: `.tmp-magnet-${lang}-${width}.png` });

  // ---- EKRAN 09: KINO — juftliklar bir-biriga qarab yuradi ----
  // Metodist qarori 2026-08-13: bosish olib tashlandi, juftlar o'zi chiqadi.
  await page.goto(`${BASE}/6-sinf/matematika/nazariy/${SLUG}?lang=${lang}&screen=9`, { waitUntil: 'networkidle' });
  await page.waitForSelector('.pr-body', { timeout: 15000 });
  await mute();
  await page.waitForTimeout(400);

  const c9 = (await page.locator('.chrome .mono').first().innerText()).trim();
  if (!c9.startsWith('09')) fail(`kutilgan 09, kelgan ${c9}`); else note(`ekran ${c9}`);
  if (await page.locator('.pr-num').count()) fail("09: son tugmalari hali ham bor, kino bo'lishi kerak");
  else note("09: son tugmalari yo'q — kino");
  if (await page.locator('.pr-tile').count()) fail('09: birinchi kadrda plitka bor');
  else note("09: birinchi kadrda sahna bo'sh");
  const nx9 = page.locator('.stage-nav .btn-white-accent');
  if (await nx9.isDisabled()) fail('09: "Davom" yopiq, qulf o\'chirilgan bo\'lishi kerak');
  else note('09: "Davom" ochiq');

  // Kadr 1: bir va o'n ikki bir-biriga qarab chiqadi, ko'paytma yoziladi.
  await page.waitForTimeout(7600);
  const prodText = (await page.locator('.pr-prod').innerText()).trim();
  if (!prodText.startsWith('1 · 12')) fail(`09: ko'paytma kutilganidan boshqa: "${prodText}"`);
  else note(`09: ko'paytma ${prodText}`);
  await page.waitForTimeout(2600);
  const afterFirst = await page.locator('.pr-tile').count();
  if (afterFirst !== 2) fail(`09: birinchi juftlikdan keyin 2 plitka emas, ${afterFirst} ta`);
  else note('09: birinchi juftlik qatorga tushdi');

  // Kadr 2 va 3: qolgan juftliklar, oxirida uch va to'rt UCHRASHADI.
  await page.waitForTimeout(30000);
  const allTiles = await page.locator('.pr-tile').count();
  if (allTiles !== 6) fail(`09: oltita bo'luvchi yig'ilmadi, ${allTiles} ta`); else note("09: oltita bo'luvchi qatorda");
  const meetTxt = (await page.locator('.pr-note').innerText()).trim();
  if (!meetTxt) fail("09: uchrashuv izohi yo'q"); else note(`09: ${meetTxt.slice(0, 46)}…`);
  if (!(await page.locator('.pr-note-ok').count())) fail('09: uchrashuv izohi yashil emas');
  if (!(await page.locator('.fact-card').count())) fail('09: fakt kartochkasi chiqmadi');
  else note('09: fakt kartochkasi chiqdi');
  if (await nx9.isDisabled()) fail('09: kino tugagandan keyin ham "Davom" yopiq');
  else note('09: "Davom" ochiq');

  bad = await overflow(page);
  bad.forEach(fail);
  await page.screenshot({ path: `.tmp-pairs-${lang}-${width}.png` });

  await browser.close();
  return errors;
}

const allErrors = [];
for (const [lang, w, h] of [['ru', 1366, 768], ['uz', 1366, 768], ['ru', 390, 844]]) {
  allErrors.push(...(await run(lang, w, h)));
}

// Previewda TTS manzili berilmagan (`?tts=` yo'q), shuning uchun ovoz so'rovi
// 404 qaytaradi — bu darsning nuqsoni EMAS. Haqiqiy TTS ni tekshirish uchun
// `?tts=<baza>` bilan alohida prognoz kerak.
const real = allErrors.filter((e) => !/favicon|net::ERR_|Web Speech|speechSynthesis|Failed to load resource/i.test(e));
console.log('\n=== NATIJA ===');
console.log('konsol xatolari: ' + real.length);
real.slice(0, 8).forEach((e) => console.log('  ' + e));
console.log('muammolar: ' + problems.length);
problems.forEach((p) => console.log('  ' + p));
process.exit(problems.length || real.length ? 1 : 0);
