// Раскладка механик по позициям банка практики 3 класса.
// Контракт — src/books/grade3/TIPLAR_AMALIYOT_3SINF.md §5.
//
// Зачем: ребёнок не должен предсказывать механику по номеру задания. Ось сложности
// одинаковая во всех уроках (🟢🟢🟢🟡🟡🟡🟡🔴🔴🔴), ось механик — своя в каждом.
//
// Запуск:
//   node scripts/grade3-practice-layout.mjs            # таблица уроков 1-19 (markdown)
//   node scripts/grade3-practice-layout.mjs --all      # все 51
//   node scripts/grade3-practice-layout.mjs --json     # машинный вывод
//   node scripts/grade3-practice-layout.mjs --check    # только проверка У1-У7
//
// Раскладка детерминирована номером урока: пересборка даёт тот же результат, дифф не шумит.
//
// ВАЖНО про метод. Первая версия раскладывала механики циклом перестановки
// (позиция i получала perm[i % длина]). Ограничения У1-У6 она выполняла, но внутри урока
// получался читаемый ритм: order dnd multi input order dnd multi input... — ребёнок
// предсказывает механику через одно, то есть ровно то, ради чего раскладка и делалась,
// не достигалось. Поэтому здесь мультимножество с заданными счётчиками перемешивается
// целиком, а правило У7 запрещает повтор любой пары соседей.

const BASE = ['choice', 'input', 'multi', 'order', 'match', 'dnd'];
// Уроки письменных приёмов, сверено по реестру src/lessons/grade3.js 2026-08-06:
// 7 — письменные + и −, 21 — ustunda ko'paytirish, 22 — ikki xonaliga ko'paytirish.
const GRID_LESSONS = [7, 21, 22];
const POSITIONS = 10;
const LEVELS = ['🟢', '🟢', '🟢', '🟡', '🟡', '🟡', '🟡', '🔴', '🔴', '🔴'];
const LESSONS = 51;

const pool = (lesson) => (GRID_LESSONS.includes(lesson) ? [...BASE, 'grid'] : BASE);

/* ------------------------- детерминированный генератор ------------------------- */
function hash(text) {
  let state = 2166136261 >>> 0;
  const source = String(text);
  for (let i = 0; i < source.length; i += 1) {
    state ^= source.charCodeAt(i);
    state = Math.imul(state, 16777619);
  }
  return state >>> 0 || 1;
}

function rng(seedText) {
  let state = hash(seedText);
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function shuffle(items, next) {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(next() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// Мультимножество на 10 позиций: механики пула получают счётчики, сумма — ровно 10.
// 6 механик -> 2,2,2,2,1,1 · 7 механик -> 2,2,2,1,1,1,1. Grid, если он есть, всегда 2.
function multiset(lesson, next) {
  const items = pool(lesson);
  const order = GRID_LESSONS.includes(lesson)
    ? ['grid', ...shuffle(items.filter((m) => m !== 'grid'), next)]
    : shuffle(items, next);
  const counts = order.map(() => 1);
  let left = POSITIONS - order.length;
  for (let i = 0; left > 0; i += 1, left -= 1) counts[i] += 1;
  return order.flatMap((mechanic, i) => Array.from({ length: counts[i] }, () => mechanic));
}

/* --------------------------------- проверка У1-У7 --------------------------------- */
function violations(lesson, layout, previous) {
  const bad = [];
  if (previous) {
    const same = layout.map((m, i) => (m === previous[i] ? i + 1 : 0)).filter(Boolean);
    if (same.length) bad.push(`У1 позиции ${same.join(',')} совпали с уроком ${lesson - 1}`);
  }
  if (new Set(layout).size < 4) bad.push('У2 меньше четырёх разных механик');
  const counts = layout.reduce((acc, m) => ({ ...acc, [m]: (acc[m] || 0) + 1 }), {});
  Object.entries(counts).forEach(([m, n]) => { if (n > 3) bad.push(`У3 ${m} встречается ${n} раз`); });
  layout.forEach((m, i) => { if (i && m === layout[i - 1]) bad.push(`У4 позиции ${i},${i + 1} одинаковы`); });
  if (layout[0] === 'grid' || layout[0] === 'dnd') bad.push(`У5 первая позиция ${layout[0]}`);
  layout.forEach((m, i) => {
    if (m === 'grid' && !GRID_LESSONS.includes(lesson)) bad.push(`У6 grid в уроке ${lesson}, позиция ${i + 1}`);
  });
  // У7 — ни одна пара соседей не повторяется: это и убивает читаемый ритм внутри урока.
  const bigrams = layout.slice(0, -1).map((m, i) => `${m}>${layout[i + 1]}`);
  const repeated = bigrams.filter((b, i) => bigrams.indexOf(b) !== i);
  if (repeated.length) bad.push(`У7 пара повторяется: ${[...new Set(repeated)].join(', ')}`);
  return bad;
}

/* --------------------------------- генерация --------------------------------- */
function build(count) {
  const rows = [];
  let previous = null;
  for (let lesson = 1; lesson <= count; lesson += 1) {
    let chosen = null;
    for (let seed = 0; seed < 50000 && !chosen; seed += 1) {
      const next = rng(`g3-amaliyot:${lesson}:${seed}`);
      const candidate = shuffle(multiset(lesson, next), next);
      if (violations(lesson, candidate, previous).length === 0) chosen = { candidate, seed };
    }
    if (!chosen) throw new Error(`Урок ${lesson}: раскладка не найдена за 50000 попыток`);
    rows.push({ lesson, seed: chosen.seed, layout: chosen.candidate });
    previous = chosen.candidate;
  }
  return rows;
}

/* ---------------------------------- вывод ---------------------------------- */
const args = process.argv.slice(2);
const full = args.includes('--all') || args.includes('--json') || args.includes('--check');
const rows = build(full ? LESSONS : 19);

if (args.includes('--check')) {
  let bad = 0;
  rows.forEach((row, i) => {
    const problems = violations(row.lesson, row.layout, i ? rows[i - 1].layout : null);
    if (problems.length) { bad += 1; console.log(`урок ${row.lesson}: ${problems.join('; ')}`); }
  });
  console.log(bad ? `НАРУШЕНИЙ В УРОКАХ: ${bad}` : `У1-У7 выполнены во всех ${rows.length} уроках`);
} else if (args.includes('--json')) {
  console.log(JSON.stringify(rows.map(({ lesson, layout }) => ({ lesson, layout, levels: LEVELS })), null, 2));
} else {
  console.log('| урок | 1 🟢 | 2 🟢 | 3 🟢 | 4 🟡 | 5 🟡 | 6 🟡 | 7 🟡 | 8 🔴 | 9 🔴 | 10 🔴 |');
  console.log('|---|---|---|---|---|---|---|---|---|---|---|');
  rows.forEach(({ lesson, layout }) => console.log(`| **${lesson}** | ${layout.join(' | ')} |`));
  const counts = {};
  rows.forEach(({ layout }) => layout.forEach((m) => { counts[m] = (counts[m] || 0) + 1; }));
  console.log('\nвсего заданий по механикам: ' + Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([m, n]) => `${m} ${n}`).join(', '));
}
