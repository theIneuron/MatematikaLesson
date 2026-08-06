// Валидатор банка практики 3 класса. Контракт — src/books/grade3/TIPLAR_AMALIYOT_3SINF.md.
//
// Проверяет:
//   §5.1 раскладка — механика позиции совпадает с таблицей (расхождения показываются
//        отдельным списком, а не роняют проверку: осознанное отступление разрешено);
//   §5    уровни сложности 🟢🟢🟢🟡🟡🟡🟡🔴🔴🔴;
//   §3.1  в choice ровно 4 варианта и разбор на каждый неверный (`by`);
//   §6    RU и UZ заполнены, апострофы ASCII, кириллицы в UZ нет;
//   §3.5-3.7 поля механики на месте (left/right, tokens/zones, grid.cells/fill).
//
// Запуск: node scripts/grade3-practice-audit.mjs [номер урока ...]
//         node scripts/grade3-practice-audit.mjs            # все переведённые банки

import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const LEVELS = ['🟢', '🟢', '🟢', '🟡', '🟡', '🟡', '🟡', '🔴', '🔴', '🔴'];
const CYRILLIC = /[Ѐ-ӿ]/;
const NON_ASCII_APOSTROPHE = /[ʻʼ‘’]/;
const TEXT_KEYS = ['eyebrow', 'setup', 'ask', 'correct', 'wrong', 'rule', 'visual', 'placeholder'];

const layoutOf = (lesson) => {
  const rows = JSON.parse(execFileSync('node', ['scripts/grade3-practice-layout.mjs', '--json'], { encoding: 'utf8' }));
  return rows.find((row) => row.lesson === lesson)?.layout || [];
};

function strings(value) {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(strings);
  return [];
}

function checkItem(item, index, expectedMechanic, errors, notes) {
  const at = `задание ${item.id || index + 1}`;

  if (item.level !== LEVELS[index]) errors.push(`${at}: уровень ${item.level}, по §5 должен быть ${LEVELS[index]}`);
  if (expectedMechanic && item.type !== expectedMechanic) {
    notes.push(`${at}: механика ${item.type}, по таблице §5.1 — ${expectedMechanic}`);
  }

  ['uz', 'ru'].forEach((lang) => {
    const text = item.text?.[lang];
    if (!text) { errors.push(`${at}: нет текста ${lang.toUpperCase()}`); return; }
    ['eyebrow', 'setup', 'ask'].forEach((key) => {
      if (!text[key]) errors.push(`${at}: ${lang}.${key} пустой`);
    });
    if (!text.correct || !text.wrong) errors.push(`${at}: ${lang} нет разбора верного или неверного ответа`);
  });

  const uzStrings = strings(item.text?.uz);
  uzStrings.forEach((value) => {
    if (CYRILLIC.test(value)) errors.push(`${at}: кириллица в UZ — «${value.slice(0, 48)}»`);
  });
  [...uzStrings, ...strings(item.text?.ru)].forEach((value) => {
    if (NON_ASCII_APOSTROPHE.test(value)) errors.push(`${at}: не-ASCII апостроф — «${value.slice(0, 48)}»`);
  });

  if (item.type === 'choice') {
    ['uz', 'ru'].forEach((lang) => {
      const options = item.text?.[lang]?.options || [];
      if (options.length !== 4) errors.push(`${at}: ${lang} вариантов ${options.length}, по §3.1 должно быть 4`);
      const by = item.text?.[lang]?.wrongBy;
      if (!by) { errors.push(`${at}: ${lang} нет разбора на каждый неверный вариант (by)`); return; }
      options.forEach((_, i) => {
        if (i !== item.correct && !by[i]) errors.push(`${at}: ${lang} нет разбора на вариант ${i + 1}`);
      });
    });
  }

  if (item.type === 'match') {
    ['uz', 'ru'].forEach((lang) => {
      const { left = [], right = [] } = item.text?.[lang] || {};
      if (!left.length || left.length !== right.length) errors.push(`${at}: ${lang} left/right неполные или разной длины`);
      if (left.length > 4) errors.push(`${at}: ${lang} пар ${left.length}, по §3.5 не больше 4`);
      // Повторяющийся ответ делает пару неоднозначной: ребёнок может соединить наугад
      // и оказаться прав. Ловилось только глазами — теперь проверкой.
      const dupRight = right.filter((v, i) => right.indexOf(v) !== i);
      if (dupRight.length) errors.push(`${at}: ${lang} правый столбец повторяется — «${[...new Set(dupRight)].join('», «')}»`);
      const dupLeft = left.filter((v, i) => left.indexOf(v) !== i);
      if (dupLeft.length) errors.push(`${at}: ${lang} левый столбец повторяется — «${[...new Set(dupLeft)].join('», «')}»`);
    });
    if (!Array.isArray(item.correct)) errors.push(`${at}: correct должен быть массивом «левый -> правый»`);
  }

  if (item.type === 'order') {
    ['uz', 'ru'].forEach((lang) => {
      const options = item.text?.[lang]?.options || [];
      const dup = options.filter((v, i) => options.indexOf(v) !== i);
      if (dup.length) errors.push(`${at}: ${lang} в упорядочивании повторяется карточка «${[...new Set(dup)].join('», «')}»`);
    });
  }

  if (item.type === 'dnd') {
    ['uz', 'ru'].forEach((lang) => {
      const { tokens = [], zones = [] } = item.text?.[lang] || {};
      if (!tokens.length || !zones.length) errors.push(`${at}: ${lang} нет tokens или zones`);
      if (tokens.length > 6 || zones.length > 3) errors.push(`${at}: ${lang} по §3.6 не больше 6 фишек и 3 зон`);
    });
  }

  if (item.type === 'grid') {
    const grid = item.grid;
    if (!grid) { errors.push(`${at}: нет объекта grid`); return; }
    if (!grid.cols || !Array.isArray(grid.rows)) errors.push(`${at}: в grid нет cols или rows`);
    const fillable = [grid.quotient, ...(grid.rows || [])].filter(Boolean)
      .reduce((sum, row) => sum + (row.fill === 'all' ? (row.cells || []).length : (row.fill || []).length), 0);
    if (!fillable) errors.push(`${at}: в grid нет ни одной заполняемой клетки`);
    if (grid.op === 'div' && !Array.isArray(grid.fillOrder)) {
      errors.push(`${at}: у уголка обязателен grid.fillOrder (§3.7)`);
    }
  }
}

async function auditLesson(lesson) {
  const path = `../src/components/grade3/practice/banks/dars${String(lesson).padStart(2, '0')}.js`;
  const file = `src/components/grade3/practice/banks/dars${String(lesson).padStart(2, '0')}.js`;
  if (!existsSync(file)) return null;

  const module = await import(path);
  const bank = module.default || Object.values(module)[0];
  const errors = [];
  const notes = [];
  const layout = layoutOf(lesson);

  if (bank.items.length !== 10) errors.push(`в банке ${bank.items.length} заданий, должно быть 10`);
  bank.items.forEach((item, i) => checkItem(item, i, layout[i], errors, notes));

  const mechanics = new Set(bank.items.map((i) => i.type));
  if (mechanics.size < 4) errors.push(`§5 У2: разных механик ${mechanics.size}, нужно не меньше четырёх`);

  return { lesson, title: bank.title, errors, notes };
}

const asked = process.argv.slice(2).map(Number).filter(Boolean);
const lessons = asked.length ? asked : Array.from({ length: 51 }, (_, i) => i + 1);
let total = 0;
let audited = 0;

for (const lesson of lessons) {
  const result = await auditLesson(lesson);
  if (!result) continue;
  audited += 1;
  total += result.errors.length;
  console.log(`\n=== Урок ${result.lesson} — ${result.title} ===`);
  if (!result.errors.length) console.log('  ошибок нет');
  result.errors.forEach((e) => console.log(`  ОШИБКА  ${e}`));
  result.notes.forEach((n) => console.log(`  отступление от раскладки  ${n}`));
}

console.log(`\nпроверено банков: ${audited}, ошибок: ${total}`);
process.exit(total ? 1 : 0);
