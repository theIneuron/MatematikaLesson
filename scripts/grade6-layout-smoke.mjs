// 6-sinf nazariy darslari uchun VIZUAL joylashuv testi.
//
// Nima tekshiriladi (har bir slaydda):
//   1. matn bloklari ustma-ust tushmaydi (son o'qi belgilari, kasrlar, kartalar);
//   2. chizma o'z freymidan tashqariga chiqmaydi;
//   3. sahifada gorizontal skroll paydo bo'lmaydi (MOBIL_DESKTOP_MOSLASH talabi).
//
// Sabab: Dars07 ning «Turli yozuv — bitta nuqta» slaydida uchta kasr son o'qi
// chizig'iga tushib, o'rtadagi shtrixni bosib qolgan edi. Bunday xato faqat
// ko'z bilan topilardi; endi o'lchov bilan topiladi.
//
// Ishlatish:
//   npx vite --port 5199
//   node scripts/grade6-layout-smoke.mjs 1-46
import { chromium } from 'playwright';
import { grade6Nazariy } from '../src/lessons/grade6.js';
import { screenKey, stepForward, parseLessonArgs } from './grade6-lesson-walk.mjs';

const BASE = process.env.SMOKE_BASE || 'http://127.0.0.1:5199';
const VIEWPORTS = [
  { width: 1280, height: 900, name: 'desktop' },
  { width: 390, height: 844, name: 'mobil' },
];
const MAX_SCREENS = 26;
// Ustma-ust tushish shu qiymatdan katta bo'lsa xato deb hisoblanadi: 1-2px
// yumaloqlash va harf «qanoti» normal holat.
const OVERLAP_TOLERANCE = 3;


const MEASURE = (tolerance) => {
  const problems = [];
  const rect = (el) => el.getBoundingClientRect();
  const visible = (el) => {
    const r = rect(el);
    if (r.width < 1 || r.height < 1) return false;
    const st = getComputedStyle(el);
    return st.visibility !== 'hidden' && st.display !== 'none' && Number(st.opacity) > 0.05;
  };
  const label = (el) => {
    const cls = (el.className || '').toString().split(/\s+/).filter(Boolean)[0] || el.tagName.toLowerCase();
    return `${cls}"${(el.textContent || '').trim().slice(0, 18)}"`;
  };
  // Faqat MATN tashuvchi kichik bloklar tekshiriladi: konteynerlar bir-birini
  // o'z ichiga olishi normal, shuning uchun ular ro'yxatga kirmaydi.
  const nodes = [...document.querySelectorAll(
    '.lesson-root .fth-number-point span, .lesson-root .d7-line-fracs > *, '
    + '.lesson-root .fth-number-point i, .lesson-root .d7-zero, .lesson-root .d7-one',
  )].filter(visible);
  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const a = rect(nodes[i]);
      const b = rect(nodes[j]);
      const dx = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const dy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (dx > tolerance && dy > tolerance) {
        problems.push(`ustma-ust: ${label(nodes[i])} × ${label(nodes[j])} (${dx.toFixed(0)}×${dy.toFixed(0)}px)`);
      }
    }
  }
  // Chizma freymdan chiqmasligi kerak.
  for (const frame of document.querySelectorAll('.lesson-root .frame, .lesson-root .fth-figure-frame')) {
    const fr = rect(frame);
    for (const child of frame.querySelectorAll('*')) {
      if (!visible(child)) continue;
      const cr = rect(child);
      if (cr.height < 2 || cr.width < 2) continue;
      const outTop = fr.top - cr.top;
      const outBottom = cr.bottom - fr.bottom;
      if (outTop > tolerance || outBottom > tolerance) {
        problems.push(`freymdan chiqdi: ${label(child)} (tepa ${outTop.toFixed(0)}px, past ${outBottom.toFixed(0)}px)`);
        break;
      }
    }
  }
  const scroll = document.documentElement.scrollWidth - document.documentElement.clientWidth;
  if (scroll > 2) problems.push(`gorizontal skroll ${scroll}px`);
  return [...new Set(problems)];
};

async function runLesson(browser, lesson, vp) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await context.newPage();
  await page.goto(`${BASE}/6-sinf/matematika/nazariy/${lesson.slug}?lang=uz`, { waitUntil: 'networkidle' });
  await page.waitForSelector('.lesson-root', { timeout: 20000 });
  // Joylashuv testi uchun ovoz kerak emas, lekin ekran qulfi ovoz tugashini
  // kutadi va kezish o'nlab marta sekinlashadi. Shuning uchun ovozni
  // o'chiramiz: qulf `muted` holatida ishlamaydi (ovoz testi alohida).
  await page.locator('button[title="Sound off"]').first().click({ timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(300);

  const found = [];
  let prevKey = '';
  let stuck = 0;
  let screens = 0;
  for (let i = 0; i < MAX_SCREENS; i += 1) {
    await page.waitForTimeout(700);
    const key = await screenKey(page);
    if (key && key === prevKey) {
      stuck += 1;
      if (stuck >= 4) break;
    } else {
      stuck = 0;
      screens += 1;
      const problems = await page.evaluate(MEASURE, OVERLAP_TOLERANCE);
      for (const p of problems) found.push(`s${screens - 1}: ${p}`);
    }
    prevKey = key;
    // Ekran qulfi yoqilgan: topshiriqni bajarib, «Davom» ochilishini kutamiz.
    if (!await stepForward(page)) break;
  }
  await context.close();
  return { found, screens };
}

const wanted = parseLessonArgs(process.argv.slice(2), grade6Nazariy.length);
const browser = await chromium.launch();
let failures = 0;
for (const no of wanted) {
  const lesson = grade6Nazariy[no - 1];
  if (!lesson) { console.log(`Dars${no}: reyestrda yo'q`); continue; }
  for (const vp of VIEWPORTS) {
    const { found, screens } = await runLesson(browser, lesson, vp);
    if (found.length) failures += 1;
    const head = `Dars${String(no).padStart(2, '0')} ${vp.name}: ekran ${screens}`;
    console.log(`${found.length ? 'FAIL ' : 'OK   '}${head}${found.length ? ` — ${found.slice(0, 3).join(' | ')}` : ''}`);
  }
}
await browser.close();
console.log(failures ? `\nJoylashuv muammosi: ${failures} o'tishda` : '\nJoylashuv toza.');
process.exit(failures ? 1 : 0);
