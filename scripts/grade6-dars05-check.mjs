// 6-sinf, 5-dars (EKUB) uchun QO'L BILAN O'TISH tekshiruvi.
//
// Nima uchun alohida skript. Bu darsning ekranlari o'ziniki (d5-* klasslar,
// hisoblar, savatlar, qadam-tugmalar), shuning uchun umumiy `grade6-lesson-walk`
// ularga javob bera olmaydi va darsni oxirigacha o'tolmaydi. Bu skript esa
// javoblarni BILADI: u o'quvchi bo'lib 15 ekranni to'liq bosib chiqadi.
//
// Nima o'lchanadi (metodist TZ si talabi: 1366x768 da skroll YO'Q):
//   1. sahifada vertikal skroll yo'q;
//   2. gorizontal skroll yo'q;
//   3. kontent pastdagi navigatsiya ustiga chiqmaydi;
//   4. .stage-content ichida yashirin skroll yo'q.
// O'lchov HAR BIR harakatdan keyin olinadi, chunki eng baland holat javobdan
// keyin ochiladigan yechim bilan birga keladi.
//
// `--audio` rejimi: ovoz o'chirilmaydi, TTS so'rovlari ushlanadi va HAR BIR
// ekranda ovoz borligi tekshiriladi. Umumiy `grade6-audio-smoke` bu darsda
// 2-ekrandan nariga o'tolmaydi (javoblarni bilmaydi), shuning uchun 15 ekranning
// ovoz qoplamasi faqat shu yerda o'lchanadi. Til markeri ham tekshiriladi
// (OVOZ_KONTRAKTI_6SINF.md, §1a).
//
// Ishlatish:
//   npx vite --port 5199
//   node scripts/grade6-dars05-check.mjs
//   node scripts/grade6-dars05-check.mjs --lang ru
//   node scripts/grade6-dars05-check.mjs --audio
import { chromium } from 'playwright';

const BASE = process.env.SMOKE_BASE || 'http://localhost:5199';
const SLUG = 'dars05-eng-katta-umumiy-boluvchi';
const VIEWPORT = { width: 1366, height: 768 };
// 1-2 px yumaloqlash normal holat.
const TOL = 2;

const argLang = (() => {
  const i = process.argv.indexOf('--lang');
  return i > -1 ? [process.argv[i + 1]] : ['uz', 'ru'];
})();
const AUDIO_MODE = process.argv.includes('--audio');
const MARKERS = { uz: "[O'zbekcha tallaffuz]", ru: '[Русское произношение]' };

// TTS so'rovlarini ushlaydi va haqiqiy so'rov yubormaydi: bizga navbat
// to'lganligi kerak, ovozning o'zi emas. `grade6-audio-smoke.mjs` bilan bir xil
// yo'l.
const INIT_SCRIPT = () => {
  window.__spoken = [];
  const record = (text) => { const v = String(text || '').trim(); if (v) window.__spoken.push(v); };
  const d = Object.getOwnPropertyDescriptor(window.HTMLMediaElement.prototype, 'src');
  Object.defineProperty(window.HTMLMediaElement.prototype, 'src', {
    configurable: true,
    get() { return d?.get?.call(this); },
    set(value) {
      const m = String(value).match(/[?&]text=([^&]*)/);
      if (m) record(decodeURIComponent(m[1]));
      try { d?.set?.call(this, 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA='); } catch (e) { /* no-op */ }
    },
  });
  if (window.speechSynthesis) {
    const orig = window.speechSynthesis.speak.bind(window.speechSynthesis);
    window.speechSynthesis.speak = (u) => {
      record(u?.text);
      setTimeout(() => { try { u.onend?.(); } catch (e) { /* no-op */ } }, 30);
      try { orig(u); } catch (e) { /* no-op */ }
    };
  }
};

const gcd = (a, b) => { let x = a, y = b; while (y) { const t = x % y; x = y; y = t; } return x; };

// ---------------------------------------------------------------
// O'LCHOV: brauzer ichida bajariladi
// ---------------------------------------------------------------
const MEASURE = (tol) => {
  const problems = [];
  const de = document.documentElement;
  if (de.scrollHeight > window.innerHeight + tol) {
    problems.push(`vertikal skroll: scrollHeight ${de.scrollHeight} > ${window.innerHeight}`);
  }
  if (de.scrollWidth > window.innerWidth + tol) {
    problems.push(`gorizontal skroll: scrollWidth ${de.scrollWidth} > ${window.innerWidth}`);
  }
  const content = document.querySelector('.stage-content');
  if (content && content.scrollHeight > content.clientHeight + tol) {
    problems.push(`.stage-content yashirin skroll: ${content.scrollHeight} > ${content.clientHeight}`);
  }
  const nav = document.querySelector('.stage-nav');
  if (nav && content) {
    const navTop = nav.getBoundingClientRect().top;
    const seen = new Set();
    content.querySelectorAll('*').forEach((el) => {
      // .amb — dekorativ fon dog'lari (aria-hidden), ular ataylab butun sahnani
      // egallaydi va kontent hisoblanmaydi.
      if (el.closest('.amb')) return;
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return;
      const st = getComputedStyle(el);
      if (st.visibility === 'hidden' || st.display === 'none' || Number(st.opacity) < 0.05) return;
      if (r.bottom > navTop + tol) {
        const key = (el.className || '').toString().split(/\s+/)[0] || el.tagName.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          problems.push(`navigatsiya ustiga chiqdi: .${key} pastki cheti ${Math.round(r.bottom)} > nav ${Math.round(navTop)}`);
        }
      }
    });
  }
  return problems;
};

// ---------------------------------------------------------------
// YORDAMCHILAR
// ---------------------------------------------------------------
async function check(page, report, screen, note) {
  await page.waitForTimeout(120);
  const problems = await page.evaluate(MEASURE, TOL);
  problems.forEach((p) => report.push({ screen, note, problem: p }));
}

// Matni aynan mos keladigan tugmani bosadi (variantlar, chiplar, tablar).
async function clickByText(page, selector, text) {
  const loc = page.locator(selector, { hasText: new RegExp(`^\\s*${text}\\s*$`) }).first();
  await loc.click({ timeout: 5000 });
}

async function clickNth(page, selector, n) {
  await page.locator(selector).nth(n).click({ timeout: 5000 });
}

// «Davom etish» / «Дальше». Ovozli rejimda tugma ovoz tugagach ochiladi,
// shuning uchun kutamiz (dvijokda 9 s zaxira qulf ochkichi bor).
async function nextScreen(page, waitMs = 0) {
  const btn = page.locator('.stage-nav .btn-white-accent');
  await btn.waitFor({ state: 'visible', timeout: 5000 });
  const deadline = Date.now() + waitMs;
  while (await btn.isDisabled()) {
    if (Date.now() > deadline) throw new Error('«Davom» tugmasi ochilmadi');
    await page.waitForTimeout(300);
  }
  await btn.click();
  await page.waitForTimeout(260);
}

// Seriya ekranlarida keyingi misolga o'tish
async function nextTask(page) {
  await page.locator('button.d5-btn.is-teal').first().click({ timeout: 5000 });
  await page.waitForTimeout(220);
}

// ---------------------------------------------------------------
// EKRANLAR: har biri o'z javobini biladi
// ---------------------------------------------------------------
const COPRIME_PAIRS = [[8, 9], [6, 10], [7, 12], [14, 21], [9, 15]];
const LIFE_PAIRS = [[30, 45], [24, 36], [18, 42], [16, 40], [27, 36]];
const SHORT_PAIRS = [[6, 18, [2, 3, 6, 18]], [7, 35, [7, 14, 21, 35]], [8, 32, [2, 4, 6, 8]], [9, 45, [3, 9, 15, 45]], [12, 60, [4, 6, 12, 60]]];
const MIX_PAIRS = [[12, 20, [2, 4, 6, 10]], [9, 15, [3, 5, 9, 15]], [18, 30, [2, 3, 6, 9]], [24, 36, [4, 6, 8, 12]], [25, 40, [1, 5, 8, 10]]];
const CLASSIFY_PAIRS = [[8, 9], [6, 10], [7, 12], [15, 20], [5, 9], [14, 21]];
const FINAL_CORRECT = [1, 2, 0, 1, 2];

const SCREENS = [
  // 1 — xuk: sonni tanlash, keyin ikkala hisobni bo'lish
  async (page, report) => {
    await check(page, report, 1, 'boshlanish');
    await clickByText(page, 'button.d5-opt', '6');
    await check(page, report, 1, 'son tanlandi');
    await page.locator('button.d5-btn').first().click();
    await page.waitForTimeout(1200); // odamlar bittalab chiqadi
    await check(page, report, 1, "bo'lindi");
  },
  // 2 — to'rtta qadam ketma-ket
  async (page, report) => {
    await check(page, report, 2, 'boshlanish');
    for (let i = 0; i < 4; i += 1) {
      await clickNth(page, 'button.d5-tab', i);
      await page.waitForTimeout(1250); // umumiylar ketma-ket bo'yaladi
      await check(page, report, 2, `qadam ${i + 1}`);
    }
  },
  // 3 — bo'luvchini qo'yish: avval 2 (umumiy, lekin eng katta emas), keyin 6
  async (page, report) => {
    await check(page, report, 3, 'boshlanish');
    await clickByText(page, 'button.d5-chip', '2');
    await page.waitForTimeout(1300);
    await check(page, report, 3, 'xato tanlov (2)');
    await clickByText(page, 'button.d5-chip', '6');
    await page.waitForTimeout(1300);
    await check(page, report, 3, "to'g'ri tanlov (6) + ta'rif");
  },
  // 4 — 8 va 12 ning umumiy bo'luvchisi = 4 (indeks 1)
  async (page, report) => {
    await check(page, report, 4, 'boshlanish');
    await clickNth(page, 'button.d5-opt', 0); // xato: 3
    await check(page, report, 4, 'xato javob');
    await clickNth(page, 'button.d5-opt', 1);
    await page.waitForTimeout(400);
    await check(page, report, 4, "to'g'ri javob + farq");
  },
  // 5 — EKUB(16;24) = 8 (indeks 3)
  async (page, report) => {
    await check(page, report, 5, 'boshlanish');
    await clickNth(page, 'button.d5-opt', 3);
    await page.waitForTimeout(2300); // uch bosqichli ochilish
    await check(page, report, 5, "to'g'ri javob + yechim");
  },
  // 6 — tub ko'paytuvchilar, javob 6 (indeks 2)
  async (page, report) => {
    await check(page, report, 6, 'boshlanish');
    await clickNth(page, 'button.d5-opt', 2);
    await page.waitForTimeout(2900); // to'rt bosqich + bonus fakt
    await check(page, report, 6, "yechim + Evklid fakti");
  },
  // 7 — ikki usul, javob = yoyish (indeks 1)
  async (page, report) => {
    await check(page, report, 7, 'boshlanish');
    await clickNth(page, 'button.d5-opt', 1);
    await page.waitForTimeout(400);
    await check(page, report, 7, 'ikki usul solishtirildi');
  },
  // 8 — ortiqcha son 5 (indeks 3), keyin uchta qoida ochiladi
  async (page, report) => {
    await check(page, report, 8, 'boshlanish');
    await clickNth(page, 'button.d5-opt', 3);
    await page.waitForTimeout(400);
    await check(page, report, 8, 'qoidalar yopiq');
    for (let i = 0; i < 3; i += 1) {
      await clickNth(page, 'button.d5-rule', i);
      await check(page, report, 8, `qoida ${i + 1} ochiq`);
    }
  },
  // 9 — beshta o'zaro tub tekshiruvi
  async (page, report) => {
    for (let k = 0; k < COPRIME_PAIRS.length; k += 1) {
      const [a, b] = COPRIME_PAIRS[k];
      await check(page, report, 9, `misol ${k + 1}`);
      await clickNth(page, 'button.d5-opt', gcd(a, b) === 1 ? 0 : 1);
      await page.waitForTimeout(360);
      await check(page, report, 9, `misol ${k + 1} yechildi`);
      if (k < COPRIME_PAIRS.length - 1) await nextTask(page);
    }
  },
  // 10 — beshta hayotiy masala, son kiritiladi
  async (page, report) => {
    for (let k = 0; k < LIFE_PAIRS.length; k += 1) {
      const [a, b] = LIFE_PAIRS[k];
      await check(page, report, 10, `masala ${k + 1}`);
      const input = page.locator('input.d5-input');
      if (k === 0) { // bir marta xato javobni ham ko'rsatamiz
        await input.fill('2');
        await page.locator('button.d5-btn', { hasText: /Tekshirish|Проверить/ }).first().click();
        await page.waitForTimeout(300);
        await check(page, report, 10, 'xato javob izohi');
        await input.fill('');
      }
      await input.fill(String(gcd(a, b)));
      await page.locator('button.d5-btn', { hasText: /Tekshirish|Проверить/ }).first().click();
      await page.waitForTimeout(360);
      await check(page, report, 10, `masala ${k + 1} yechildi`);
      if (k < LIFE_PAIRS.length - 1) await nextTask(page);
    }
  },
  // 11 — beshta qisqa holat: avval bo'linish tekshiriladi, keyin javob
  async (page, report) => {
    for (let k = 0; k < SHORT_PAIRS.length; k += 1) {
      const [small, , opts] = SHORT_PAIRS[k];
      await check(page, report, 11, `misol ${k + 1}`);
      await page.locator('button.d5-btn').first().click(); // «Bo'linishni tekshirish»
      await page.waitForTimeout(260);
      await check(page, report, 11, `misol ${k + 1} bo'linish tekshirildi`);
      await clickNth(page, 'button.d5-opt', opts.indexOf(small));
      await page.waitForTimeout(360);
      await check(page, report, 11, `misol ${k + 1} yechildi + qoida`);
      if (k < SHORT_PAIRS.length - 1) await nextTask(page);
    }
  },
  // 12 — beshta aralash juftlik
  async (page, report) => {
    for (let k = 0; k < MIX_PAIRS.length; k += 1) {
      const [a, b, opts] = MIX_PAIRS[k];
      await check(page, report, 12, `juftlik ${k + 1}`);
      await clickNth(page, 'button.d5-opt', opts.indexOf(gcd(a, b)));
      await page.waitForTimeout(360);
      await check(page, report, 12, `juftlik ${k + 1} yechildi + yoyilma`);
      if (k < MIX_PAIRS.length - 1) await nextTask(page);
    }
  },
  // 13 — oltita juftlik ikkita savatga, keyin bonus karta
  async (page, report) => {
    for (let k = 0; k < CLASSIFY_PAIRS.length; k += 1) {
      const [a, b] = CLASSIFY_PAIRS[k];
      await check(page, report, 13, `juftlik ${k + 1}`);
      const bin = gcd(a, b) === 1 ? 0 : 1;
      await clickNth(page, 'button.d5-btn.is-teal', bin);
      await page.waitForTimeout(240);
    }
    await page.waitForTimeout(1200); // bonus karta ochiladi
    await check(page, report, 13, 'hammasi ajratildi + bonus karta');
  },
  // 14 — yakuniy beshta topshiriq
  async (page, report) => {
    for (let k = 0; k < FINAL_CORRECT.length; k += 1) {
      await check(page, report, 14, `topshiriq ${k + 1}`);
      await clickNth(page, 'button.d5-opt', FINAL_CORRECT[k]);
      await page.waitForTimeout(360);
      await check(page, report, 14, `topshiriq ${k + 1} yechildi`);
      if (k < FINAL_CORRECT.length - 1) await nextTask(page);
    }
  },
  // 15 — yakun: kartalar navbat bilan chiqadi
  async (page, report) => {
    await page.waitForTimeout(3200);
    await check(page, report, 15, 'yakuniy ekran to\'liq');
  },
];

// ---------------------------------------------------------------
// YURISH
// ---------------------------------------------------------------
async function walk(browser, lang) {
  const report = [];
  const errors = [];
  const context = await browser.newContext({ viewport: VIEWPORT });
  if (AUDIO_MODE) await context.addInitScript(INIT_SCRIPT);
  const page = await context.newPage();
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

  // `tts` bazasi berilsa dvijok HTTP TTS yo'lidan yuradi va til markerini
  // qo'shadi. Haqiqiy so'rov ketmaydi — init-skript uni ushlaydi.
  const q = AUDIO_MODE ? `?lang=${lang}&tts=${encodeURIComponent(`${BASE}/__tts-mock`)}` : `?lang=${lang}`;
  await page.goto(`${BASE}/6-sinf/matematika/nazariy/${SLUG}${q}`, { waitUntil: 'networkidle' });
  await page.waitForSelector('.g6d05', { timeout: 20000 });

  if (!AUDIO_MODE) {
    // Ovozni o'chiramiz: TTS ni kutmasdan yuramiz, «Davom» qulfi ham ochiladi.
    const mute = page.locator('button[title="Sound off"]').first();
    if (await mute.count()) await mute.click();
    await page.waitForTimeout(200);
  }

  const spokenCount = async () => (AUDIO_MODE ? page.evaluate(() => window.__spoken.length) : 0);
  const spokenSlice = async (from) => (AUDIO_MODE ? page.evaluate((f) => window.__spoken.slice(f), from) : []);

  for (let i = 0; i < SCREENS.length; i += 1) {
    const before = await spokenCount();
    try {
      await SCREENS[i](page, report);
    } catch (e) {
      report.push({ screen: i + 1, note: 'BOSIB BO\'LMADI', problem: String(e.message || e).split('\n')[0] });
      break;
    }
    if (AUDIO_MODE) {
      await page.waitForTimeout(700);
      const said = await spokenSlice(before);
      if (said.length === 0) {
        report.push({ screen: i + 1, note: 'OVOZ', problem: 'ekran JIMJIT — bitta ham yo\'lakcha yo\'q' });
      }
      said.forEach((text) => {
        const marker = MARKERS[lang];
        if (!text.startsWith(marker)) {
          report.push({ screen: i + 1, note: 'OVOZ', problem: `til markeri matn boshida emas: ${text.slice(0, 42)}...` });
        } else if (text.slice(marker.length).includes(marker)) {
          report.push({ screen: i + 1, note: 'OVOZ', problem: `til markeri IKKI marta: ${text.slice(0, 42)}...` });
        }
      });
      if (said.length) console.log(`    ekran ${i + 1}: ${said.length} yo'lakcha`);
    }
    if (i < SCREENS.length - 1) {
      try {
        await nextScreen(page, AUDIO_MODE ? 12000 : 0);
      } catch (e) {
        report.push({ screen: i + 1, note: 'O\'TIB BO\'LMADI', problem: String(e.message || e).split('\n')[0] });
        break;
      }
    }
  }

  const reached = await page.locator('.stage .chrome .mono').first().textContent().catch(() => '?');
  await context.close();
  return { report, errors, reached };
}

const browser = await chromium.launch();
let bad = 0;
for (const lang of argLang) {
  const { report, errors, reached } = await walk(browser, lang);
  console.log(`\n=== ${lang.toUpperCase()} — 1366x768 — oxirgi ekran: ${(reached || '?').trim()} ===`);
  if (report.length === 0) console.log('  joylashuv: muammo yo\'q (15/15 ekran)');
  report.forEach((r) => console.log(`  [ekran ${r.screen}] ${r.note}: ${r.problem}`));
  if (errors.length) {
    console.log('  KONSOL XATOLARI:');
    [...new Set(errors)].forEach((e) => console.log(`    ${e}`));
  }
  bad += report.length + errors.length;
}
await browser.close();
console.log(bad === 0 ? '\nHAMMASI JOYIDA' : `\nMUAMMOLAR: ${bad}`);
process.exit(bad === 0 ? 0 : 1);
