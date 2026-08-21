#!/usr/bin/env node

// 4-sinf amaliyoti, 31-40 darslar: mexanika raskladkasi.
//
// NEGA BU SKRIPT BOR. 22-30 amaliyotlarining barchasi bir xil beshlikka
// (mc · match · order · numpad · missing) tushib qolgan va pozitsiyalar ham
// deyarli qotib qolgan: bola 3-topshiriq har doim `order` ekanini bilib oladi.
// 3-sinf kontrakti (TIPLAR_AMALIYOT_3SINF.md §5) buni taqiqlaydi. Bu skript
// 31-40 uchun raskladkani dars nomeridan olingan urug' bilan hisoblaydi:
// natija takrorlanadigan, dars qayta yig'ilganda dif shovqin bermaydi.
//
// Qiyinlik o'qi QOTGAN (grade4 audit talabi): 1-2 green, 3-7 yellow, 8-10 red.
// Mexanika o'qi esa har darsda boshqacha.
//
// Foydalanish:
//   node scripts/grade4-practice-31-40-layout.mjs            # markdown jadval
//   node scripts/grade4-practice-31-40-layout.mjs --json     # mashina uchun
//   node scripts/grade4-practice-31-40-layout.mjs --check    # Q1-Q7 tekshiruvi

import process from 'node:process';

// Chizma mexanikalari: bola raqam yoki matn emas, CHIZMA bilan ishlaydi.
// 31-40 mavzulari geometriya, shuning uchun har darsda kamida ikkitasi shart.
const DRAWING_KINDS = new Set(['sort', 'slots', 'shade', 'ticks', 'placepick', 'construct', 'gap']);

// Birinchi topshiriq: browser-solver wrong-first tekshiruvini qo'llaydigan va
// boshqarishni o'rgatishni talab qilmaydigan mexanikalar.
const FIRST_SAFE = new Set(['mc', 'sign', 'numpad', 'match', 'order']);

// JANR O'QI QOTGAN — 4sinf_metodologiya.md §13. Pozitsiya janrini o'zgartirmaydi,
// faqat o'sha janrni BOSHQA mexanika bilan beradi. Shuning uchun har pozitsiyada
// janrga mos mexanikalar ro'yxati bor: "tushib qolganini tiklash" ni `sort` bilan
// berib bo'lmaydi, "hisoblash yoki yasash" ni esa `mc` bilan.
const GENRES = [
  { id: 'recognition', uz: 'tanib olish', allowed: ['mc', 'sign', 'match'] },
  { id: 'guided-apply', uz: 'tayanch bilan qo\'llash', allowed: ['mc', 'sign', 'numpad', 'missing', 'slots', 'ticks', 'shade', 'placepick', 'match', 'order'] },
  { id: 'representation-shift', uz: 'tasvirlar orasida o\'tish', allowed: ['match', 'slots', 'sort', 'construct', 'placepick', 'ticks', 'shade', 'mc'] },
  { id: 'compute-or-build', uz: 'hisoblash, o\'lchash yoki yasash', allowed: ['numpad', 'ticks', 'construct', 'placepick', 'shade', 'slots', 'order'] },
  { id: 'restore-gap', uz: 'tushib qolganini tiklash', allowed: ['missing', 'numpad', 'slots', 'mc', 'sign', 'gap'] },
  { id: 'word-problem', uz: 'matnli masala', allowed: ['mc', 'numpad', 'missing', 'sign', 'order', 'match'] },
  { id: 'sort-match-order', uz: 'saralash, moslashtirish, tartib', allowed: ['sort', 'match', 'order', 'slots'] },
  { id: 'boundary', uz: 'chegaraviy holat yoki tuzoq', allowed: ['mc', 'sign', 'missing', 'sort'] },
  { id: 'error-analysis', uz: 'xato tahlili', allowed: ['mc', 'missing', 'order', 'match', 'sort', 'ticks', 'construct', 'shade', 'placepick', 'slots'] },
  { id: 'transfer', uz: 'ko\'chirish yoki strategiyani izohlash', allowed: ['mc', 'sign', 'numpad', 'missing', 'match', 'order', 'slots', 'sort', 'shade', 'ticks', 'placepick', 'construct', 'gap'] },
];

// Har darsning pooli mavzudan kelib chiqadi, tasodifiy emas.
const POOLS = {
  31: ['mc', 'numpad', 'missing', 'match', 'order', 'slots', 'sign'],
  32: ['mc', 'numpad', 'missing', 'match', 'order', 'shade', 'sign'],
  33: ['mc', 'sign', 'match', 'order', 'missing', 'sort', 'ticks'],
  34: ['mc', 'order', 'match', 'missing', 'numpad', 'ticks', 'placepick'],
  35: ['mc', 'match', 'order', 'missing', 'sort', 'slots'],
  36: ['mc', 'match', 'order', 'missing', 'sort', 'slots'],
  37: ['mc', 'numpad', 'missing', 'match', 'order', 'shade', 'sign'],
  38: ['mc', 'match', 'order', 'missing', 'sort', 'construct', 'slots'],
  39: ['mc', 'match', 'order', 'missing', 'placepick', 'slots', 'construct'],
  40: ['mc', 'numpad', 'match', 'order', 'missing', 'sort', 'construct'],
};

// Q8: bitta mexanika bitta pozitsiyada 10 darsdan ko'pi bilan 4 tasida turadi.
// Ikkita mexanika navbatma-navbat almashib turishi ham ritm — bola pozitsiya
// bo'yicha taxmin qilishni o'rganadi.
const POSITION_CAP = 4;

const LESSONS = Object.keys(POOLS).map(Number).sort((a, b) => a - b);
const LEVELS = ['green', 'green', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'red', 'red', 'red'];

// Dars nomeridan olingan takrorlanadigan generator.
const makeRandom = (seedText) => {
  let state = 2166136261;
  for (let index = 0; index < seedText.length; index += 1) {
    state ^= seedText.charCodeAt(index);
    state = Math.imul(state, 16777619);
  }
  if (state === 0) state = 1;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
};

const shuffled = (items, random) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

// Poolni 10 pozitsiyaga bo'ladi: hech bir mexanika ikkitadan ko'p emas.
// 6 mexanikada 4 tasi ikki marta, 2 tasi bir marta; 7 mexanikada 3 tasi ikki marta.
const buildCounts = (pool, random) => {
  if (pool.length > 10 || pool.length * 2 < 10) return null;
  const counts = new Map(pool.map((kind) => [kind, 1]));
  let remaining = 10 - pool.length;
  for (const kind of shuffled(pool, random)) {
    if (remaining === 0) break;
    counts.set(kind, 2);
    remaining -= 1;
  }
  return remaining === 0 ? counts : null;
};

const pairKey = (a, b) => [a, b].sort().join('~');

// Pozitsiyalarni ketma-ket to'ldiradi va tiqilib qolsa ortga qaytadi. Tasodifiy
// almashtirishni rad qilish usuli bu yerda ishlamaydi: janr cheklovlari bilan
// tasodifiy permutatsiyaning o'tish ehtimoli juda kichik.
const fillPositions = (counts, previous, random, usage) => {
  const used = new Set();
  const row = [];
  const step = (position) => {
    if (position === 10) {
      if (new Set(row).size < 5) return false;
      if (row.filter((kind) => DRAWING_KINDS.has(kind)).length < 2) return false;
      return true;
    }
    const candidates = shuffled(
      GENRES[position].allowed.filter((kind) => (counts.get(kind) || 0) > 0),
      random,
    );
    for (const kind of candidates) {
      if (position === 0 && !FIRST_SAFE.has(kind)) continue;
      if (position > 0 && row[position - 1] === kind) continue;
      if (previous && previous[position] === kind) continue;
      if ((usage[position].get(kind) || 0) >= POSITION_CAP) continue;
      const key = position > 0 ? pairKey(row[position - 1], kind) : null;
      if (key && used.has(key)) continue;
      counts.set(kind, counts.get(kind) - 1);
      if (key) used.add(key);
      row.push(kind);
      if (step(position + 1)) return true;
      row.pop();
      if (key) used.delete(key);
      counts.set(kind, counts.get(kind) + 1);
    }
    return false;
  };
  return step(0) ? row : null;
};

// Bitta dars uchun bir nechta nomzod raskladka. Global cheklov (Q8) borligi uchun
// birinchi topilgan yechim to'g'ri kelmasligi mumkin: shuning uchun ro'yxat qaytadi
// va yuqoridagi izlov ortga qaytishi mumkin bo'ladi.
const candidateRows = (lesson, previous, usage, random, limit) => {
  const pool = POOLS[lesson];
  const seen = new Set();
  const rows = [];
  for (let attempt = 0; attempt < 600 && rows.length < limit; attempt += 1) {
    const counts = buildCounts(pool, random);
    if (!counts) break;
    const row = fillPositions(counts, previous, random, usage);
    if (!row) continue;
    const key = row.join('|');
    if (seen.has(key)) continue;
    seen.add(key);
    rows.push(row);
  }
  return rows;
};

const buildAll = () => {
  const random = makeRandom('g4-practice-layout:31-40');
  const usage = Array.from({ length: 10 }, () => new Map());
  const table = {};
  const solve = (index, previous) => {
    if (index === LESSONS.length) return true;
    const lesson = LESSONS[index];
    for (const row of candidateRows(lesson, previous, usage, random, 24)) {
      row.forEach((kind, position) => usage[position].set(kind, (usage[position].get(kind) || 0) + 1));
      table[lesson] = row;
      if (solve(index + 1, row)) return true;
      delete table[lesson];
      row.forEach((kind, position) => usage[position].set(kind, usage[position].get(kind) - 1));
    }
    return false;
  };
  if (!solve(0, null)) throw new Error('Q1-Q8 shartlarini bajaruvchi raskladka topilmadi');
  return table;
};

const check = (table) => {
  const failures = [];
  const assert = (condition, message) => { if (!condition) failures.push(message); };
  let previous = null;
  for (const lesson of LESSONS) {
    const row = table[lesson];
    const counts = new Map();
    row.forEach((kind) => counts.set(kind, (counts.get(kind) || 0) + 1));
    assert(row.length === 10, `Dars ${lesson}: 10 pozitsiya emas`);
    assert(FIRST_SAFE.has(row[0]), `Dars ${lesson}: 1-topshiriq wrong-first qo'llamaydigan mexanika (${row[0]})`);
    assert(new Set(row).size >= 5, `Dars ${lesson}: Q2 — mexanika soni ${new Set(row).size}, 5 dan kam`);
    assert([...counts.values()].every((count) => count <= 2), `Dars ${lesson}: Q3 — bitta mexanika ikkitadan ko'p`);
    assert(row.every((kind, index) => index === 0 || kind !== row[index - 1]), `Dars ${lesson}: Q4 — qo'shni pozitsiyalar bir xil`);
    const pairs = row.slice(1).map((kind, index) => pairKey(row[index], kind));
    assert(new Set(pairs).size === pairs.length, `Dars ${lesson}: Q7 — qo'shni juftlik takrorlandi`);
    assert(row.every((kind) => POOLS[lesson].includes(kind)), `Dars ${lesson}: pooldan tashqari mexanika`);
    row.forEach((kind, index) => {
      assert(GENRES[index].allowed.includes(kind), `Dars ${lesson}: ${index + 1}-pozitsiya janri "${GENRES[index].uz}" ${kind} mexanikasiga to'g'ri kelmaydi`);
    });
    assert(row.filter((kind) => DRAWING_KINDS.has(kind)).length >= 2, `Dars ${lesson}: chizma mexanikasi ikkitadan kam`);
    if (previous) {
      const clash = row.findIndex((kind, index) => kind === previous[index]);
      assert(clash === -1, `Dars ${lesson}: Q1 — ${clash + 1}-pozitsiya oldingi dars bilan bir xil (${row[clash]})`);
    }
    previous = row;
  }
  for (let position = 0; position < 10; position += 1) {
    const counts = new Map();
    for (const lesson of LESSONS) {
      const kind = table[lesson][position];
      counts.set(kind, (counts.get(kind) || 0) + 1);
    }
    counts.forEach((count, kind) => {
      assert(count <= POSITION_CAP, `${position + 1}-pozitsiya: "${kind}" ${count} darsda takrorlandi, chegara ${POSITION_CAP}`);
    });
  }
  return failures;
};

const table = buildAll();

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ levels: LEVELS, layout: table }, null, 2));
} else if (process.argv.includes('--check')) {
  const failures = check(table);
  if (failures.length) {
    console.error(`${failures.length} ta raskladka xatosi:`);
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exit(1);
  }
  console.log('✓ Q1-Q7 va chizma-mexanika sharti 31-40 darslarda bajarildi');
} else {
  const header = LEVELS.map((level, index) => `${index + 1} ${level === 'green' ? '🟢' : level === 'yellow' ? '🟡' : '🔴'}`);
  console.log(`| dars | ${header.join(' | ')} |`);
  console.log(`|---|${'---|'.repeat(10)}`);
  for (const lesson of LESSONS) {
    console.log(`| **${lesson}** | ${table[lesson].join(' | ')} |`);
  }
  console.log(`| *janr* | ${GENRES.map((genre) => genre.uz).join(' | ')} |`);
}
