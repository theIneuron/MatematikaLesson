#!/usr/bin/env node
// Umumiy qobiq (`kit/`) ustida qurilgan 4-sinf darslari uchun statik tekshiruv.
//
// Nega kerak: 41-darsni yig'ishda takrorlanadigan xatolar chiqdi va ularning
// har biri faqat brauzerda ko'rindi. Bu skript ularni yozish paytida ushlaydi:
//
//   1) SVG chizmasiga son o'rniga SATR berilishi — `x="150"` keyin `x + w`
//      qilinsa, "150" + 10 = "15010" bo'lib ramka 77 000 px ga cho'ziladi;
//   2) yopilmagan CSS qoidasi — qolgan barcha uslublar yo'qoladi;
//   3) UZ satrlarida kirill harf yoki ASCII bo'lmagan apostrof;
//   4) ekran kontrakti: TOTAL_SCREENS = SCREEN_META = FRAME_COUNTS = SCREENS;
//   5) FRAME_COUNTS ovoz bo'laklari soniga mos emasligi — chizma kadri
//      ovozdan ajralib qoladi;
//   6) ovozda belgi yoki raqamli yozuv (audio_rules);
//   7) har noto'g'ri variantga izoh yo'qligi;
//   8) matn juda uzun — sarlavha ramkadan chiqadi;
//   9) qobiq fayllarida bir xil yordamchining ikki marta e'lon qilinishi.
//
// Ishlatish:  node scripts/grade4-kit-lesson-guard.mjs Dars41 Dars42 ...
//             node scripts/grade4-kit-lesson-guard.mjs            (barchasi)
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import vm from 'node:vm';

const ROOT = process.cwd();
const DIR = path.join(ROOT, 'src/components/grade4');
const KIT = path.join(DIR, 'kit');

const APOSTROPHES = /[ʻʼ‘’‛]/;
const CYRILLIC = /[Ѐ-ӿ]/;
const AUDIO_BANNED = /[×÷=<>%$°«»—]|[0-9]/;
// "sen" murojaati: faqat to'liq so'z. "sanaymiz", "sanalgan" kabi so'zlar
// tushib qolmasligi uchun ikki tomondan chegara qo'yiladi.
const UZ_SEN = /\b(sen|sana|senga|sening|seni|sizlar)\b|\b(top|ayt|o'yla|qara|sana)\b\s*[.!?]/;

// Ekran matni chegaralari: bulardan oshsa ramka yoki sarlavha buziladi.
const MAX_TITLE = 46;
const MAX_LEAD = 150;
const MAX_QUESTION = 86;
const MAX_OPTION = 64;

const problems = [];
const notes = [];
const add = (file, message) => problems.push(`${file}: ${message}`);
const note = (file, message) => notes.push(`${file}: ${message}`);

// --------------------------------------------------------------------------
// Obyekt literalini matndan ajratib, sandboxda hisoblaymiz. CONTENT — sof
// ma'lumot (chaqiruv ham, JSX ham yo'q), shuning uchun bu xavfsiz.
// --------------------------------------------------------------------------
const extractObject = (source, name) => {
  const start = source.indexOf(`const ${name} = {`);
  if (start < 0) return null;
  let depth = 0;
  for (let i = source.indexOf('{', start); i < source.length; i += 1) {
    if (source[i] === '{') depth += 1;
    else if (source[i] === '}') {
      depth -= 1;
      if (depth === 0) {
        try {
          return vm.runInNewContext(`(${source.slice(source.indexOf('{', start), i + 1)})`, {}, { timeout: 3000 });
        } catch (error) {
          return { __error: error.message };
        }
      }
    }
  }
  return null;
};

// FRAME_COUNTS — sonlar ro'yxati, uni to'g'ridan-to'g'ri o'qiymiz.
const readFrameCounts = (source) => {
  const match = source.match(/const\s+FRAME_COUNTS\s*=\s*\[([^\]]*)\]/);
  if (!match) return null;
  return match[1].split(',').map((x) => Number(x.trim())).filter((x) => !Number.isNaN(x));
};

// SCREEN_META va SCREENS — elementlar soni. SCREEN_META ichida obyektlar
// bo'lgani uchun vergul bo'yicha sanash yaramaydi: `{ id: 's` naqshini sanaymiz.
const countScreenMeta = (source) => {
  const match = source.match(/const\s+SCREEN_META\s*=\s*\[([\s\S]*?)\n\];/);
  if (!match) return null;
  return (match[1].match(/\{\s*id:\s*'s\d+'/g) || []).length;
};

const countScreens = (source) => {
  const match = source.match(/const\s+SCREENS\s*=\s*\[([\s\S]*?)\];/);
  if (!match) return null;
  return (match[1].match(/Screen\d+/g) || []).length;
};

const walkStrings = (node, at, lang, inAudio, out) => {
  if (typeof node === 'string') { out.push({ at, text: node, lang, inAudio }); return; }
  if (Array.isArray(node)) { node.forEach((item, i) => walkStrings(item, `${at}[${i}]`, lang, inAudio, out)); return; }
  if (node && typeof node === 'object') {
    for (const [key, value] of Object.entries(node)) {
      const nextLang = key === 'uz' || key === 'ru' || key === 'en' ? key : lang;
      walkStrings(value, at ? `${at}.${key}` : key, nextLang, inAudio || /audio/i.test(key), out);
    }
  }
};

// --------------------------------------------------------------------------
// 1. Custom komponentga sonli SATR berilishi
//
// `<PanelBox x="150" .../>` — komponent ichida `x + w` qilinsa satr ulanadi.
// Ichki SVG teglari (rect, circle, line, text, path...) uchun satr normal,
// shuning uchun faqat BOSH HARF bilan boshlanadigan komponentlar tekshiriladi.
// --------------------------------------------------------------------------
// Bu proplar bu kodbazada har doim koordinata: satr berilsa — xato.
const GEOMETRY_PROPS = ['x', 'y', 'w', 'h', 'cx', 'cy', 'col', 'row', 'gap'];
// Bular ma'noga qarab son ham, yorliq ham bo'lishi mumkin: eslatma sifatida.
const MAYBE_NUMERIC_PROPS = ['top', 'left', 'r', 'size', 'width', 'height', 'n', 'step'];

const checkNumericStringProps = (file, source) => {
  const tagRe = /<([A-Z][A-Za-z0-9_]*)\s([^>]*?)\/?>/gs;
  let match;
  while ((match = tagRe.exec(source)) !== null) {
    const [, tag, attrs] = match;
    const scan = (props, report) => {
      for (const prop of props) {
        const hit = attrs.match(new RegExp(`(?:^|\\s)${prop}="(-?\\d+(?:\\.\\d+)?)"`));
        if (hit) {
          report(file, `<${tag} ${prop}="${hit[1]}"> — son satr sifatida berilgan; komponent ichida qo'shuvga tushsa satr ulanadi, {${hit[1]}} deb yozing`);
        }
      }
    };
    scan(GEOMETRY_PROPS, add);
    scan(MAYBE_NUMERIC_PROPS, note);
  }
};

// --------------------------------------------------------------------------
// 2. CSS shablon satri butunligi
// --------------------------------------------------------------------------
const checkStyleBlocks = (file, source) => {
  const re = /const\s+(\w*STYLES\w*)\s*=\s*`([\s\S]*?)`;/g;
  let match;
  while ((match = re.exec(source)) !== null) {
    const [, name, css] = match;
    const open = (css.match(/\{/g) || []).length;
    const close = (css.match(/\}/g) || []).length;
    if (open !== close) add(file, `${name}: CSS qavslari teng emas (${open} ochilgan, ${close} yopilgan) — keyingi uslublar yo'qoladi`);
    const tail = css.replace(/\/\*[\s\S]*?\*\//g, '').trimEnd();
    if (tail && !tail.endsWith('}')) add(file, `${name}: oxirgi qoida yopilmagan — "${tail.slice(-40)}"`);
  }
};

// --------------------------------------------------------------------------
// 3-8. Kontent tekshiruvi
// --------------------------------------------------------------------------
const checkContent = (file, source) => {
  const content = extractObject(source, 'CONTENT');
  if (!content) { note(file, 'CONTENT topilmadi — faqat kod tekshirildi'); return; }
  if (content.__error) { add(file, `CONTENT hisoblanmadi: ${content.__error}`); return; }

  const strings = [];
  walkStrings(content, '', null, false, strings);

  for (const item of strings) {
    if (APOSTROPHES.test(item.text)) add(file, `${item.at}: ASCII bo'lmagan apostrof — faqat '`);
    if (item.lang === 'uz' && CYRILLIC.test(item.text)) add(file, `${item.at}: UZ satrida kirill harf`);
    if (item.lang === 'en' && CYRILLIC.test(item.text)) add(file, `${item.at}: EN satrida kirill harf`);
    if (item.lang === 'uz' && UZ_SEN.test(item.text)) add(file, `${item.at}: UZ da "sen" murojaati — "siz" kerak`);
    if (item.inAudio && AUDIO_BANNED.test(item.text)) {
      const bad = item.text.match(AUDIO_BANNED)[0];
      add(file, `${item.at}: ovozda "${bad}" — sonlar va belgilar so'z bilan yozilishi kerak`);
    }
  }

  const frames = readFrameCounts(source);
  const metaCount = countScreenMeta(source);
  const screensCount = countScreens(source);
  if (Array.isArray(frames) && metaCount && frames.length !== metaCount) {
    add(file, `FRAME_COUNTS (${frames.length}) va SCREEN_META (${metaCount}) soni teng emas`);
  }
  if (metaCount && screensCount && metaCount !== screensCount) {
    add(file, `SCREEN_META (${metaCount}) va SCREENS (${screensCount}) soni teng emas`);
  }

  // Har ekranda ovoz bo'laklari soni FRAME_COUNTS bilan, uchala tilda ham mos.
  if (Array.isArray(frames)) {
    frames.forEach((expected, index) => {
      const screen = content[`s${index}`];
      if (!screen) { add(file, `s${index} kontenti yo'q`); return; }
      const audio = screen.audio?.intro ?? screen.audio;
      if (!audio) { add(file, `s${index}: audio yo'q`); return; }
      for (const lang of ['uz', 'ru', 'en']) {
        const beats = audio[lang];
        if (!beats) { add(file, `s${index}.audio.${lang} yo'q`); continue; }
        const count = Array.isArray(beats) ? beats.length : 1;
        if (count !== expected) {
          add(file, `s${index}.audio.${lang}: ${count} bo'lak, FRAME_COUNTS ${expected} kutadi — chizma kadri ovozdan ajraladi`);
        }
      }
    });
  }

  // Variantlar: to'g'ri indeks joyida, har noto'g'risiga izoh bor.
  for (const [key, screen] of Object.entries(content)) {
    if (!screen || typeof screen !== 'object') continue;
    if (Array.isArray(screen.options)) {
      const n = screen.options.length;
      if (!Number.isInteger(screen.correctIndex) || screen.correctIndex < 0 || screen.correctIndex >= n) {
        add(file, `${key}: correctIndex variantlar sonidan tashqarida`);
      }
      if (n < 3) add(file, `${key}: variant soni ${n} — kamida uchta bo'lsin`);
      for (let i = 0; i < n; i += 1) {
        if (i === screen.correctIndex) continue;
        if (!screen.wrong || !screen.wrong[i]) add(file, `${key}.wrong[${i}]: noto'g'ri variantga izoh yo'q`);
      }
      screen.options.forEach((option, i) => {
        const uz = option?.uz ?? '';
        if (uz.length > MAX_OPTION) note(file, `${key}.options[${i}]: ${uz.length} belgi (${MAX_OPTION} dan ko'p) — variant ikki qatorga ketadi`);
      });
    }
    if (Array.isArray(screen.slots) && !Number.isInteger(screen.correctSlot)) {
      add(file, `${key}: slots bor, lekin correctSlot yo'q`);
    }
    const limits = [['title', MAX_TITLE], ['lead', MAX_LEAD], ['question', MAX_QUESTION]];
    for (const [field, limit] of limits) {
      const uz = screen[field]?.uz;
      if (typeof uz === 'string' && uz.length > limit) {
        note(file, `${key}.${field}: ${uz.length} belgi (chegara ${limit}) — matn ramkani siqib qo'yadi`);
      }
    }
  }
};

// --------------------------------------------------------------------------
// 9. Qobiqda takrorlangan top-level e'lonlar
// --------------------------------------------------------------------------
const checkKitDuplicates = async () => {
  const files = (await readdir(KIT)).filter((f) => /\.(js|jsx)$/.test(f));
  const seen = new Map();
  for (const file of files) {
    const source = await readFile(path.join(KIT, file), 'utf8');
    const re = /^(?:export\s+)?(?:const|function|class)\s+([A-Za-z_$][\w$]*)/gm;
    let match;
    while ((match = re.exec(source)) !== null) {
      const name = match[1];
      if (seen.has(name) && seen.get(name) !== file) {
        add('kit', `"${name}" ikki joyda e'lon qilingan: ${seen.get(name)} va ${file} — audit paketi parse xatosi beradi (CLAUDE.md §5)`);
      } else {
        seen.set(name, file);
      }
    }
  }
};

// --------------------------------------------------------------------------
const checkLesson = async (name) => {
  const file = `${name}.jsx`;
  const source = await readFile(path.join(DIR, file), 'utf8');
  if (!source.includes("from './kit/index.js'")) {
    note(file, 'qobiqdan foydalanmaydi — bu skript unga tegishli emas');
    return;
  }
  if (APOSTROPHES.test(source)) add(file, "faylda ASCII bo'lmagan apostrof bor");
  if (!source.includes('assertScreenTypeLabels(')) add(file, 'assertScreenTypeLabels chaqirilmagan');
  checkNumericStringProps(file, source);
  checkStyleBlocks(file, source);
  checkContent(file, source);
};

const args = process.argv.slice(2);
const targets = args.length
  ? args.map((value) => value.replace(/\.jsx$/, ''))
  : (await readdir(DIR)).filter((f) => /^Dars\d+\.jsx$/.test(f)).map((f) => f.replace('.jsx', ''));

for (const name of targets) await checkLesson(name);
await checkKitDuplicates();

if (notes.length) {
  console.log(`\nEslatma (${notes.length}):`);
  for (const item of notes) console.log(`  · ${item}`);
}
if (problems.length) {
  console.log(`\nXATO (${problems.length}):`);
  for (const item of problems) console.log(`  - ${item}`);
  process.exit(1);
}
console.log(`\nGuard o'tdi: ${targets.length} ta dars, xato yo'q.`);
