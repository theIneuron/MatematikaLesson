#!/usr/bin/env node

// ============================================================================
// 4-SINF AMALIYOTI 41-51 — MEXANIKA RASKLADKASI
//
// Nima uchun skript, qo'lda yozilgan jadval emas. 22-30 amaliyotlarida
// to'qqizta darsning hammasi bir xil beshta mexanikani bir xil tartibda
// ishlatgan (mc, match, missing, numpad, order): bola ikkinchi darsdan
// keyin topshiriq turini raqamiga qarab taxmin qilaveradi. 3-sinf
// (TIPLAR_AMALIYOT_3SINF.md §5) buni generator bilan yechgan — shu yerda
// ham xuddi shunday.
//
// IKKI O'Q MUSTAQIL:
//   qiyinlik — hamma darsda BIR XIL: 2 green, 5 yellow, 3 red
//              (ETALON_4SINF §9 va D22-30 auditi shuni talab qiladi);
//   janr     — hamma darsda BIR XIL: 4sinf_metodologiya §13 dagi o'nlik;
//   mexanika — har darsda BOSHQA.
//
// Zerno — dars raqami, shuning uchun natija takrorlanadi: qayta ishga
// tushirilganda bir xil jadval chiqadi va diff shovqin qilmaydi.
//
// node scripts/grade4-practice-41-51-layout.mjs           # markdown jadval
// node scripts/grade4-practice-41-51-layout.mjs --check   # Y1-Y7 tekshiruvi
// node scripts/grade4-practice-41-51-layout.mjs --json     # mashina uchun
// ============================================================================

import process from 'node:process';

const LESSONS = Array.from({ length: 11 }, (_, index) => index + 41);

export const LEVELS = ['green', 'green', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'red', 'red', 'red'];

// Janr o'qi — 4sinf_metodologiya.md §13. Har pozitsiya nimani tekshiradi.
export const GENRES = [
  'tanib olish',
  'tayanch bilan qo\'llash',
  'tasvirlar orasida o\'tish',
  'hisoblash yoki o\'lchash',
  'tushib qolganini tiklash',
  'matnli masala',
  'saralash, moslashtirish, tartib',
  'chegaraviy holat',
  'xatoni tahlil qilish',
  'ko\'chirish',
];

// Janr qanday mexanikalar bilan berilishi mumkin. Janr — nima tekshiriladi,
// mexanika — bola nima qiladi; bittasi ikkinchisini to'liq belgilamaydi.
const GENRE_MECHANICS = {
  0: ['mc', 'sort', 'match', 'ticks', 'gap'],
  1: ['numpad', 'missing', 'slots', 'shade', 'ticks', 'fracbuild', 'gap'],
  2: ['match', 'slots', 'fracbuild', 'shade', 'order', 'numpad'],
  3: ['numpad', 'missing', 'slots', 'ticks'],
  4: ['missing', 'slots', 'numpad', 'gap', 'fracbuild'],
  5: ['mc', 'numpad', 'missing', 'match'],
  6: ['match', 'order', 'sort', 'slots'],
  7: ['mc', 'ticks', 'sort', 'numpad', 'gap', 'shade'],
  8: ['mc', 'order', 'sort', 'match'],
  9: ['mc', 'numpad', 'missing', 'match', 'order', 'sort', 'ticks', 'shade', 'gap', 'slots', 'fracbuild'],
};

// Mavzu qanday mexanikani ko'taradi. Bu ro'yxat mavzudan chiqadi, tasodifiy emas:
// simmetriyada kasr quruvchi yo'q, tengsizlikda son o'qi bor.
const LESSON_POOLS = {
  41: ['mc', 'gap', 'shade', 'match', 'order', 'numpad', 'sort'],
  42: ['mc', 'slots', 'numpad', 'missing', 'match', 'order', 'sort'],
  43: ['mc', 'order', 'numpad', 'missing', 'match', 'slots', 'sort'],
  44: ['mc', 'order', 'numpad', 'missing', 'match', 'slots', 'sort'],
  45: ['mc', 'ticks', 'numpad', 'missing', 'match', 'order', 'sort'],
  46: ['mc', 'shade', 'fracbuild', 'numpad', 'missing', 'match', 'order'],
  47: ['mc', 'ticks', 'sort', 'numpad', 'missing', 'match', 'order'],
  48: ['mc', 'match', 'order', 'slots', 'numpad', 'missing', 'sort'],
  // 49-darsda `gap` yo'q: raqamlar orasidagi bo'shliqqa tegish mexanikasi
  // sonli yozuv uchun, mulohaza matni uchun emas. Uning o'rniga `slots` —
  // mulohazani rost yoki yolg'on uyasiga qo'yish.
  49: ['mc', 'sort', 'match', 'missing', 'order', 'numpad', 'slots'],
  50: ['mc', 'ticks', 'match', 'numpad', 'missing', 'order', 'sort'],
  51: ['mc', 'numpad', 'shade', 'ticks', 'match', 'order', 'missing', 'slots'],
};

// Pozitsiya 1 boshqarishni o'rgatishni talab qilmasligi kerak (Y5).
const OPENERS = new Set(['mc', 'match', 'sort', 'ticks']);

const mulberry32 = (seed) => () => {
  seed = (seed + 0x6D2B79F5) | 0;
  let t = seed;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const shuffled = (items, random) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

// Bitta darsning raskladkasini backtracking bilan yig'adi. Har pozitsiyada
// ruxsat etilgan mexanikalar tasodifiy tartibda sinaladi, cheklov buzilsa
// orqaga qaytadi. Zerno bir xil bo'lgani uchun natija ham bir xil.
function layoutFor(lesson, previous) {
  const pool = LESSON_POOLS[lesson];
  const random = mulberry32(lesson * 7919);

  for (let attempt = 0; attempt < 4000; attempt += 1) {
    const seedRandom = mulberry32(lesson * 7919 + attempt);
    const row = [];
    const counts = new Map();
    const pairs = new Set();

    const place = (position) => {
      if (position === 10) return new Set(row).size >= 6;
      const allowed = shuffled(
        pool.filter((kind) => GENRE_MECHANICS[position].includes(kind)),
        seedRandom,
      );
      for (const kind of allowed) {
        if (position === 0 && !OPENERS.has(kind)) continue;
        if ((counts.get(kind) ?? 0) >= 2) continue;                    // Y3
        if (position > 0 && row[position - 1] === kind) continue;      // Y4
        if (position > 1 && row[position - 2] === kind) continue;      // Y6
        if (previous && previous[position] === kind) continue;         // Y1
        const pair = position > 0 ? `${row[position - 1]}>${kind}` : null;
        if (pair && pairs.has(pair)) continue;                         // Y7
        row.push(kind);
        counts.set(kind, (counts.get(kind) ?? 0) + 1);
        if (pair) pairs.add(pair);
        if (place(position + 1)) return true;
        row.pop();
        counts.set(kind, counts.get(kind) - 1);
        if (pair) pairs.delete(pair);
      }
      return false;
    };

    if (place(0)) return row;
    void random;
  }
  throw new Error(`${lesson}-dars uchun raskladka topilmadi`);
}

export function buildLayout() {
  const result = {};
  let previous = null;
  for (const lesson of LESSONS) {
    const row = layoutFor(lesson, previous);
    result[lesson] = row;
    previous = row;
  }
  return result;
}

function check(layout) {
  const failures = [];
  const lessons = Object.keys(layout).map(Number);
  for (const lesson of lessons) {
    const row = layout[lesson];
    const counts = row.reduce((map, kind) => map.set(kind, (map.get(kind) ?? 0) + 1), new Map());
    if (row.length !== 10) failures.push(`${lesson}: 10 pozitsiya emas`);
    if (new Set(row).size < 6) failures.push(`Y2 ${lesson}: mexanika soni ${new Set(row).size}, 6 dan kam`);
    for (const [kind, count] of counts) {
      if (count > 2) failures.push(`Y3 ${lesson}: ${kind} ${count} marta`);
    }
    row.forEach((kind, index) => {
      if (index > 0 && row[index - 1] === kind) failures.push(`Y4 ${lesson}: ${index + 1}-pozitsiyada qo'shni takror — ${kind}`);
      if (index > 1 && row[index - 2] === kind) failures.push(`Y6 ${lesson}: ${index + 1}-pozitsiyada oralab takror — ${kind}`);
      if (!LESSON_POOLS[lesson].includes(kind)) failures.push(`${lesson}: ${kind} mavzu puliga kirmaydi`);
      if (!GENRE_MECHANICS[index].includes(kind)) failures.push(`${lesson}: ${index + 1}-pozitsiya janri ${kind} ni ko'tarmaydi`);
    });
    if (!OPENERS.has(row[0])) failures.push(`Y5 ${lesson}: birinchi topshiriq ${row[0]} — boshqarishni o'rgatishni talab qiladi`);
    const pairs = row.slice(1).map((kind, index) => `${row[index]}>${kind}`);
    if (new Set(pairs).size !== pairs.length) failures.push(`Y7 ${lesson}: qo'shnilar jufti ichkarida takrorlangan`);
    const previous = layout[lesson - 1];
    if (previous) {
      row.forEach((kind, index) => {
        if (previous[index] === kind) failures.push(`Y1 ${lesson}: ${index + 1}-pozitsiya oldingi dars bilan bir xil — ${kind}`);
      });
    }
  }
  return failures;
}

// CLI faqat skript to'g'ridan-to'g'ri ishga tushirilganda ishlaydi: audit bu
// modulni import qiladi va o'sha paytda jadval chiqmasligi kerak.
const invokedDirectly = process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('grade4-practice-41-51-layout.mjs');
const layout = buildLayout();
const mode = process.argv[2];

if (!invokedDirectly) {
  // faqat eksport
} else if (mode === '--json') {
  console.log(JSON.stringify({ levels: LEVELS, genres: GENRES, layout }, null, 2));
} else if (mode === '--check') {
  const failures = check(layout);
  if (failures.length) {
    console.error(`${failures.length} ta raskladka xatosi:`);
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exit(1);
  }
  const kinds = new Set(Object.values(layout).flat());
  console.log(`✓ Y1-Y7 bajarildi: 11 dars, 110 topshiriq, ${kinds.size} xil mexanika (${[...kinds].sort().join(', ')})`);
} else {
  const header = LEVELS.map((level, index) => `${index + 1} ${level === 'green' ? '🟢' : level === 'yellow' ? '🟡' : '🔴'}`);
  console.log(`| dars | ${header.join(' | ')} |`);
  console.log(`|---|${LEVELS.map(() => '---').join('|')}|`);
  for (const lesson of Object.keys(layout).map(Number)) {
    console.log(`| **${lesson}** | ${layout[lesson].join(' | ')} |`);
  }
  console.log('');
  GENRES.forEach((genre, index) => console.log(`${index + 1}. ${genre}`));
}
