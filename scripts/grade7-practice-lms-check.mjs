// LMS uchun yig'ilgan 7-sinf amaliyot fayllarini TEKSHIRADI.
//
// NEGA. `build-grade7-practice-lms.mjs` faqat matnni tekshiradi (lokal import
// yo'q, React default importi bor, nom takrorlanmagan). Lekin LMS da fayl
// RENDER bo'lishi va platforma proplari bilan ishlashi kerak. Bu skript har
// faylni brauzerda mount qiladi: platforma o'rnida minimal host turadi va
// javob tekshiruvi `registerCheck` orqali chaqiriladi -- LMS ham shunday.
//
// Nima tekshiriladi: fayl yuklanadi (lokal import bo'lsa shu yerda yiqiladi),
// ekranga matn chiqadi, konsolda xato yo'q, `registerCheck` ulanadi va uni
// chaqirish sahifani yiqitmaydi.
//
// DEV SERVER kerak: npm run dev (odatda 5262-port).
//
// Ishlatish:
//   node scripts/grade7-practice-lms-check.mjs            // har darsdan bittasi
//   node scripts/grade7-practice-lms-check.mjs --all      // 140 fayl
//   node scripts/grade7-practice-lms-check.mjs dars03     // bitta dars
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const lmsDir = path.join(rootDir, 'src', 'components', 'grade7', 'practice', 'lms-grade7-practice-standalone');
const PORT = process.env.PORT || '5262';
const PROBE = `http://localhost:${PORT}/.tmp/lms7/probe.html?f=`;

const args = process.argv.slice(2);
const all = args.includes('--all');
const onlyLesson = args.find((a) => /^dars[0-9][0-9]$/.test(a));

const pickFiles = async () => {
  const dirs = (await fs.readdir(lmsDir, { withFileTypes: true }))
    .filter((e) => e.isDirectory() && /^dars[0-9][0-9]$/.test(e.name)).map((e) => e.name).sort();
  const out = [];
  for (const dir of dirs) {
    if (onlyLesson && dir !== onlyLesson) continue;
    const files = (await fs.readdir(path.join(lmsDir, dir))).filter((f) => f.endsWith('.jsx')).sort();
    out.push(...(all || onlyLesson ? files : files.slice(0, 1)).map((f) => dir + '/' + f));
  }
  return out;
};

const run = async () => {
  const files = await pickFiles();
  if (!files.length) {
    console.error("XATO: yig'ilgan fayl topilmadi. Avval build-grade7-practice-lms.mjs ni ishlating.");
    process.exit(1);
  }
  const browser = await chromium.launch({ headless: true });
  let bad = 0;
  for (const rel of files) {
    const page = await browser.newPage({ viewport: { width: 1000, height: 700 } });
    const errs = [];
    page.on('pageerror', (e) => errs.push(e.message.slice(0, 140)));
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 140)); });
    await page.goto(PROBE + rel, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(900);
    const info = await page.evaluate(() => ({
      len: (document.getElementById('root')?.innerText || '').replace(/s+/g, ' ').trim().length,
      json: document.getElementById('host-json')?.textContent || '',
    }));
    if (!errs.length && info.len > 30) {
      await page.click('#host-check').catch(() => {});
      await page.waitForTimeout(350);
    }
    const after = await page.evaluate(() => ({
      json: document.getElementById('host-json')?.textContent || '',
      len: (document.getElementById('root')?.innerText || '').trim().length,
    }));
    await page.close();
    // `registered` ni bosishdan KEYIN o'qiymiz: ref o'zgarishi qayta render
    // qilmaydi, ya'ni bosishdan oldin json hali yangilanmagan bo'ladi.
    const ok = !errs.length && info.len > 30 && after.json.includes('"registered":true');
    if (!ok) bad += 1;
    console.log((ok ? 'ok   ' : 'XATO ') + rel.padEnd(22) + ' matn:' + String(info.len).padStart(4)
      + ' ' + after.json + (errs.length ? ' | ' + errs[0] : ''));
  }
  await browser.close();
  console.log(bad ? `
MUAMMOLAR: ${bad} fayl` : `
OK: ${files.length} fayl LMS rejimida render bo'ldi`);
  if (bad) process.exit(1);
};

run().catch((e) => { console.error('XATO:', e.message); process.exit(1); });
