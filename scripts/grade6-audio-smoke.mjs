// 6-sinf nazariy darslari uchun OVOZ smoke-testi.
//
// Nima tekshiriladi: darsning HAR BIR ekranida TTS navbati matn bilan
// boshlanadimi. Ilgari ba'zi slaydlarda `audio`/`intro` bo'sh qolib, ekran
// jimjit o'tib ketardi va bu faqat platformada sezilardi.
//
// Qanday: dev-server ustida Playwright darsni ochadi, brauzer ichida
// speechSynthesis.speak (lokal preview yo'li) ushlanadi va har bir ekranda
// nima o'qilgani yozib olinadi. Keyin "Davom" bosilib, oxirgi ekrangacha
// yuriladi.
//
// Ishlatish:
//   npx vite --port 5199        (alohida terminalda)
//   node scripts/grade6-audio-smoke.mjs 1-46
//   node scripts/grade6-audio-smoke.mjs 7 8 27
import { chromium } from 'playwright';
import { grade6Nazariy } from '../src/lessons/grade6.js';

const BASE = process.env.SMOKE_BASE || 'http://127.0.0.1:5199';
const LANGS = ['uz', 'ru'];
const MAX_SCREENS = 24;

function parseArgs(argv) {
  const list = [];
  for (const arg of argv) {
    const range = arg.match(/^(\d+)-(\d+)$/);
    if (range) {
      for (let i = Number(range[1]); i <= Number(range[2]); i += 1) list.push(i);
    } else if (/^\d+$/.test(arg)) {
      list.push(Number(arg));
    }
  }
  return list.length ? list : Array.from({ length: grade6Nazariy.length }, (_, i) => i + 1);
}

const INIT_SCRIPT = () => {
  window.__spoken = [];
  window.__ttsRequests = [];
  const record = (text) => {
    const value = String(text || '').trim();
    if (value) window.__spoken.push(value);
  };
  // HTTP TTS yo'li: Audio.src ga /api/tts?text=... yoziladi.
  const descriptor = Object.getOwnPropertyDescriptor(window.HTMLMediaElement.prototype, 'src');
  Object.defineProperty(window.HTMLMediaElement.prototype, 'src', {
    configurable: true,
    get() { return descriptor?.get?.call(this); },
    set(value) {
      const match = String(value).match(/[?&]text=([^&]*)/);
      if (match) {
        const text = decodeURIComponent(match[1]);
        record(text);
        // Til markeri HAR BIR yo'lakchada bo'lishi shart (ElevenLabs talaffuzi).
        window.__ttsRequests.push(text);
      }
      // Haqiqiy so'rov yubormaymiz: test ovoz borligini emas, navbat
      // to'ldirilganini tekshiradi.
      try { descriptor?.set?.call(this, 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA='); } catch (e) { /* no-op */ }
    },
  });
  // Preview yo'li: brauzer speechSynthesis.
  if (window.speechSynthesis) {
    const original = window.speechSynthesis.speak.bind(window.speechSynthesis);
    window.speechSynthesis.speak = (utterance) => {
      record(utterance?.text);
      // onend ni o'zimiz chaqiramiz, aks holda navbat qotib qoladi.
      setTimeout(() => { try { utterance.onend?.(); } catch (e) { /* no-op */ } }, 30);
      try { original(utterance); } catch (e) { /* no-op */ }
    };
  }
};

// Ekrandagi topshiriqni bajarishga urinadi. To'g'ri javobni bilmaydi, shuning
// uchun variantlarni navbat bilan sinaydi: xato variant o'chadi, keyingisiga
// o'tiladi. Bir nechta javobli ekranda («Tekshirish» tugmasi bor) bo'sh
// kartalar belgilanib, tekshirish bosiladi — to'g'rilari yashil qolib
// fiksatsiya bo'ladi.
async function solveScreen(page) {
  const navEnabled = async () => {
    const nav = page.locator('.stage-nav button, .fth-nav button').last();
    return await nav.count() > 0 && await nav.isEnabled().catch(() => false);
  };
  // Bir nechta javobli ekranda kartalar bittalab sinaladi, shuning uchun
  // urinishlar soni karta sonidan ko'p bo'lishi kerak.
  for (let attempt = 0; attempt < 14; attempt += 1) {
    if (await navEnabled()) return;
    const cards = page.locator('.lesson-root .pd-num:not([disabled])');
    const options = page.locator('.lesson-root button.option:not([disabled])');
    const check = page.locator('.lesson-root button', { hasText: /^(Tekshirish|Проверить)$/ }).first();

    if (await cards.count() > 0) {
      // BITTA kartani belgilab tekshiramiz: to'g'ri karta yashil bo'lib
      // qulflanadi, xato karta o'chadi — ikkalasi ham `disabled` bo'ladi.
      // Shu yo'l bilan javobni bilmasdan ham to'g'ri to'plam yig'iladi.
      // Hammasini birdan belgilash ishlamaydi: xato to'plamda tanlov bekor
      // bo'ladi va ekran joyida qoladi.
      await cards.first().click({ timeout: 3000 }).catch(() => {});
      await page.waitForTimeout(250);
      if (await check.count() > 0 && await check.isEnabled().catch(() => false)) {
        await check.click({ timeout: 3000 }).catch(() => {});
      }
      await page.waitForTimeout(1100);
      continue;
    }
    if (await options.count() > 0) {
      await options.first().click({ timeout: 3000 }).catch(() => {});
      await page.waitForTimeout(700);
      if (await check.count() > 0 && await check.isEnabled().catch(() => false)) {
        await check.click({ timeout: 3000 }).catch(() => {});
        await page.waitForTimeout(700);
      }
      continue;
    }
    if (await check.count() > 0 && await check.isEnabled().catch(() => false)) {
      await check.click({ timeout: 3000 }).catch(() => {});
      await page.waitForTimeout(700);
      continue;
    }
    return; // bajariladigan element yo'q (izoh ekrani)
  }
}

async function runLesson(browser, index, lesson, lang) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await context.addInitScript(INIT_SCRIPT);
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e.message)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

  // `tts` bazasi berilishi SHART: shundagina dvijok HTTP TTS yo'lidan yuradi va
  // til markerini qo'shadi. Haqiqiy so'rov ketmaydi — init-skript src ni ushlaydi.
  const url = `${BASE}/6-sinf/matematika/nazariy/${lesson.slug}?lang=${lang}&tts=${encodeURIComponent(`${BASE}/__tts-mock`)}`;
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForSelector('.lesson-root', { timeout: 20000 });

  const silent = [];
  const tagProblems = [];
  let tracks = 0;
  let screens = 0;
  const expectedTag = lang === 'uz' ? "[O'zbekcha tallaffuz]" : '[Русское произношение]';
  const otherTag = lang === 'uz' ? '[Русское произношение]' : "[O'zbekcha tallaffuz]";
  // Ekran o'zgargani DOM matni bo'yicha aniqlanadi: birinchi slaydda
  // navigatsiya paneli yo'q, oxirgisida esa «Davom» ekranni almashtirmaydi —
  // tugma borligiga qarab yurish ishonchsiz edi.
  let prevKey = '';
  let stuck = 0;
  for (let i = 0; i < MAX_SCREENS; i += 1) {
    await page.waitForTimeout(900);
    const { spoken, requests, key } = await page.evaluate(() => {
      const said = window.__spoken.slice();
      const reqs = window.__ttsRequests.slice();
      window.__spoken = [];
      window.__ttsRequests = [];
      // Ekran kaliti — BUTUN matn xeshi. Faqat boshidagi bir necha o'n belgi
      // olinganda ba'zi darslarning ketma-ket slaydlari bir xil ko'rinardi.
      const root = document.querySelector('.lesson-root');
      const text = root ? root.innerText : '';
      let hash = 0;
      for (let i = 0; i < text.length; i += 1) {
        hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
      }
      return { spoken: said, requests: reqs, key: text ? `${text.length}:${hash}` : '' };
    });

    // Marker HAR BIR yo'lakchada tekshiriladi, ekran yangimi yoki yo'qmi.
    for (const text of requests) {
      tracks += 1;
      if (!text.startsWith(expectedTag)) {
        tagProblems.push(`s${screens}: marker yo'q yoki boshida emas — ${JSON.stringify(text.slice(0, 60))}`);
      } else if (text.slice(expectedTag.length).includes(otherTag)) {
        tagProblems.push(`s${screens}: ikkita marker — ${JSON.stringify(text.slice(0, 80))}`);
      }
    }

    if (key && key === prevKey) {
      // Ekran almashmadi: dars tugagan, tugma qulflangan yoki mashina band
      // bo'lib render kechikdi. Ba'zi darslarning birinchi slaydi ikki tegishni
      // talab qiladi, shuning uchun chegara 5 — sekin mashinada ham yolg'on
      // «tugadi» xulosasi chiqmaydi.
      stuck += 1;
      if (stuck >= 5) break;
    } else {
      stuck = 0;
      screens += 1;
      if (!spoken.length) silent.push(screens - 1);
    }
    prevKey = key;

    // TOPSHIRIQNI YECHISH. «Davom» qulfi yoqilgandan keyin test topshiriqni
    // bajarmasa, ekran almashmaydi (ilgari qulf ishlamagani uchun test
    // topshiriqni yechmasdan ham o'tib ketardi va buni sezmasdik).
    await solveScreen(page);
    // Tugma yozuvi darsdan darsga farq qiladi («Davom etish», «Дальше»,
    // «Natijani ko'rish»...), shuning uchun navigatsiya qatorining OXIRGI
    // tugmasini olamiz: «Orqaga» chapda, «Davom» esa doim o'ngda.
    // «Davom» ovoz tugashini kutadi (ekran qulfi), shuning uchun tugma
    // ochilishini kutamiz — darhol tekshirsak, hali yopiq bo'lardi.
    const next = page.locator('.stage-nav button, .fth-nav button').last();
    const deadline = Date.now() + 22000;
    while (Date.now() < deadline) {
      if (await next.count() === 0) break;
      if (await next.isEnabled().catch(() => false)) break;
      await page.waitForTimeout(400);
    }
    if (await next.isVisible().catch(() => false) && await next.isEnabled().catch(() => false)) {
      await next.click({ timeout: 5000 }).catch(() => {});
    }
  }
  await context.close();
  return { silent, screens, errors, tagProblems, tracks };
}

const wanted = parseArgs(process.argv.slice(2));
const browser = await chromium.launch();
let failures = 0;
for (const no of wanted) {
  const lesson = grade6Nazariy[no - 1];
  if (!lesson) { console.log(`Dars${no}: reyestrda yo'q`); continue; }
  for (const lang of LANGS) {
    const { silent, screens, errors, tagProblems, tracks } = await runLesson(browser, no, lesson, lang);
    const bad = silent.length || errors.length || tagProblems.length;
    if (bad) failures += 1;
    const parts = [`Dars${String(no).padStart(2, '0')} ${lang}: ekran ${screens}, yo'lakcha ${tracks}`];
    if (silent.length) parts.push(`JIMJIT ekranlar: ${silent.join(', ')}`);
    if (tagProblems.length) parts.push(`MARKER: ${tagProblems.slice(0, 2).join(' | ')}`);
    if (errors.length) parts.push(`xatolar: ${errors.slice(0, 2).join(' | ')}`);
    console.log(`${bad ? 'FAIL ' : 'OK   '}${parts.join(' — ')}`);
  }
}
await browser.close();
console.log(failures ? `\nMuammoli o'tishlar: ${failures}` : '\nHammasi ovozli.');
process.exit(failures ? 1 : 0);
