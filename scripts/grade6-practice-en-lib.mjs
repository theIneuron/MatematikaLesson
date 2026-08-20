// 6-sinf amaliyoti: ingliz tilini qo'shish uchun umumiy qatlam.
// Bir joyda: topshiriq faylini o'qish, ITEM ob'ektini ajratish, qayta yozish.
// Uchta skript shundan foydalanadi: extract (matnni chiqarish), inject (EN ni yozish),
// grade6-practice-en (tekshirish).
import fs from 'node:fs';
import path from 'node:path';

export const TOTAL_LESSONS = 46;
export const TASKS_PER_LESSON = 10;
export const PRACTICE_DIR = path.join('src', 'components', 'grade6', 'practice');

export const pad = (n) => String(n).padStart(2, '0');
export const taskId = (lesson, task) => `D${pad(lesson)}_${pad(task)}`;
export const taskPath = (lesson, task) => path.join(
  PRACTICE_DIR,
  `dars${pad(lesson)}`,
  `${taskId(lesson, task)}.jsx`,
);

// ITEM — sof ma'lumot (funksiya ham, shablon satri ham yo'q), shuning uchun uni
// baholab olish xavfsiz. Faylning qolgan qismi tegilmaydi.
export const CR = String.fromCharCode(13);
export const LF = String.fromCharCode(10);

const ITEM_BLOCK = /^const ITEM = \{$[\s\S]*?^\};$/m;

export function readItem(file) {
  const src = fs.readFileSync(file, 'utf8');
  const block = src.match(ITEM_BLOCK);
  if (!block) throw new Error(`${file}: ITEM bloki topilmadi`);
  const literal = block[0].replace(/^const ITEM = /, '').replace(/;$/, '');
  // eslint-disable-next-line no-new-func
  const item = new Function(`return ${literal}`)();
  return { src, item, block: block[0] };
}

// Kalitlar tartibi: manba tartibi saqlanadi, yangi kalitlar juftining ortidan
// qo'yiladi (en -> ru dan keyin, translationsEn -> translationsRu dan keyin).
const LANG_ORDER = ['uz', 'ru', 'en'];

const orderLangs = (value) => {
  const out = {};
  for (const lang of LANG_ORDER) if (value[lang] !== undefined) out[lang] = value[lang];
  for (const key of Object.keys(value)) if (out[key] === undefined) out[key] = value[key];
  return out;
};

const TRI = new Set(['topic', 'prompt', 'explanation']);

export function serializeItem(item) {
  const out = {};
  for (const [key, value] of Object.entries(item)) {
    out[key] = TRI.has(key) ? orderLangs(value) : value;
    if (key === 'translationsRu' && item.translationsEn && !out.translationsEn) {
      out.translationsEn = item.translationsEn;
    }
  }
  if (item.translationsEn && !out.translationsEn) {
    // translationsRu bo'lmagan topshiriq: translationsEn explanation dan oldin turadi.
    const rebuilt = {};
    for (const [key, value] of Object.entries(out)) {
      if (key === 'explanation') rebuilt.translationsEn = item.translationsEn;
      if (key !== 'translationsEn') rebuilt[key] = value;
    }
    return JSON.stringify(rebuilt, null, 2);
  }
  return JSON.stringify(out, null, 2);
}

export function writeItem(file, src, block, item) {
  const next = src.replace(block, `const ITEM = ${serializeItem(item)};`);
  if (next === src) throw new Error(`${file}: ITEM bloki o'zgarmadi`);
  // Repozitoriyda fayllar CRLF bilan yotadi: aralash qatorlar chiqmasin.
  const crlf = src.includes(CR + LF);
  const unix = next.split(CR).join('');
  fs.writeFileSync(file, crlf ? unix.split(LF).join(CR + LF) : unix, 'utf8');
}


// Variant yozuvi tarjimani talab qiladimi? Son, o'lchov birligi va matematik
// belgilardan boshqa hech narsa qolmasa — talab qilmaydi ("4 km" ikki tilda ham bir xil).
const UNITS = new Set([
  'km', 'm', 'cm', 'dm', 'mm', 'kg', 'g', 'l', 'ml', 't', 'min', 's', 'h',
  'km2', 'm2', 'cm2', 'dm2', 'mm2', 'km3', 'm3', 'cm3', 'dm3',
  'x', 'y', 'a', 'b', 'c', 'n', 'k', 'p', 'q',
  // Chorak raqamlari ikki tilda ham bir xil yoziladi.
  'ii', 'iii', 'iv', 'vi', 'vii', 'viii', 'ix',
  // Harfli ifodalar: ko'paytma yozuvi tarjimani talab qilmaydi.
  'ab', 'abc', 'xy', 'ah', 'bh', 'pr',
]);

export function needsTranslation(label) {
  const bare = String(label)
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, '2')
    .replace(/[□→≈±°π]/g, ' ')
    .replace(/[0-9.,:;()[\]{}+\-–—−*/×÷·=<>%°'‘’"«»?!|\\\s]/g, ' ');
  return bare.split(/\s+/)
    // Bitta harf — o'zgaruvchi yoki nuqta nomi, u tarjima qilinmaydi.
    .filter((word) => word.length > 1)
    // Bosh harfli yozuv — nuqta, kesma yoki formula nomi: AB, CA, V. U ham tarjimasiz.
    .filter((word) => word !== word.toUpperCase())
    .some((word) => !UNITS.has(word.toLowerCase()));
}

export const labelsOf = (item) => [
  ...(item.options || []),
  ...(item.left || []),
  ...(item.right || []),
].map(String);

export function parseLessons(args) {
  const wanted = new Set();
  for (const value of args) {
    const match = /^(\d{1,2})(?:-(\d{1,2}))?$/.exec(value);
    if (!match) throw new Error(`Noto'g'ri diapazon: ${value}. Misol: 1-6`);
    const start = Number(match[1]);
    const end = Number(match[2] || match[1]);
    if (start < 1 || end > TOTAL_LESSONS || start > end) {
      throw new Error(`Diapazon 1-${TOTAL_LESSONS} ichida bo'lishi kerak: ${value}`);
    }
    for (let i = start; i <= end; i += 1) wanted.add(i);
  }
  return wanted.size
    ? [...wanted].sort((a, b) => a - b)
    : Array.from({ length: TOTAL_LESSONS }, (_, i) => i + 1);
}
