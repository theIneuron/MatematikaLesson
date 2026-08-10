// Сколько заданий уже переведено на английский. EN необязателен: если блока нет,
// движок подставляет русский (см. banks/_helpers.js). Скрипт показывает, где ещё пусто,
// и ловит две ошибки перевода: пропущенный разбор на неверный вариант и русские буквы
// в английском тексте.
//
// Запуск: node scripts/grade3-practice-en.mjs [номер урока ...]

import { existsSync } from 'node:fs';

const CYRILLIC = /[Ѐ-ӿ]/;
const asked = process.argv.slice(2).map(Number).filter(Boolean);
const lessons = (asked.length ? asked : Array.from({ length: 51 }, (_, i) => i + 1))
  .filter((n) => existsSync(`src/components/grade3/practice/banks/dars${String(n).padStart(2, '0')}.js`));

const strings = (value) => {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(strings);
  return [];
};

let done = 0;
let total = 0;
const errors = [];

for (const lesson of lessons) {
  const nn = String(lesson).padStart(2, '0');
  const module = await import(`../src/components/grade3/practice/banks/dars${nn}.js`);
  const bank = module.default || Object.values(module)[0];
  let translated = 0;

  bank.items.forEach((item) => {
    total += 1;
    const en = item.text.en;
    const ru = item.text.ru;
    // EN блока нет — движок подставил RU, значит ask совпадает дословно.
    if (en.ask === ru.ask && en.setup === ru.setup) return;
    translated += 1;
    done += 1;

    strings(en).forEach((value) => {
      if (CYRILLIC.test(value)) errors.push(`У${lesson}/${item.id}: кириллица в EN — «${value.slice(0, 46)}»`);
    });
    if (item.type === 'choice') {
      const by = en.wrongBy;
      if (!by) errors.push(`У${lesson}/${item.id}: в EN нет разбора на неверные варианты`);
      else (en.options || []).forEach((_, i) => {
        if (i !== item.correct && !by[i]) errors.push(`У${lesson}/${item.id}: в EN нет разбора на вариант ${i + 1}`);
      });
    }
    ['options', 'left', 'right', 'tokens', 'zones'].forEach((key) => {
      if ((en[key] || []).length !== (ru[key] || []).length) {
        errors.push(`У${lesson}/${item.id}: EN.${key} другой длины, чем RU`);
      }
    });
  });

  console.log(`урок ${String(lesson).padStart(2)}: EN ${translated}/${bank.items.length}${translated === bank.items.length ? '' : ' ·'}`);
}

console.log(`\nпереведено ${done} из ${total} заданий`);
errors.forEach((e) => console.log('  ОШИБКА  ' + e));
process.exit(errors.length ? 1 : 0);
