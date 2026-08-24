// Dars01 · Amaliyot 06 — Belgilash · 🟡 · tag: always_defined
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Kontent: src/books/grade8/DARS01_AMALIYOT_KONTENT.md §06
//
// «Har qanday a da ma'noga ega» uch xil sababdan chiqadi: a² + 1 va a² + 4
// nolga aylanmaydi, (a − 2)/7 da esa maxrajda umuman harf yo'q — З19 shu
// yerda o'ladi. Uchta noto'g'ri karta uch xil nol beradi: kvadratlar
// ayirmasi (ikkita nol), harfning o'zi (nol), chiziqli ifoda (bitta nol).
// «Hammasi yoki hech narsa»: uchta ham topilishi kerak.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'always_defined', level: '🟡',
  col: 168, itemSize: 21,
  items: [
    { id: 'i1', tokens: [{ n: '5', d: 'a² + 1' }], hit: true },
    { id: 'i2', tokens: [{ n: '8', d: 'a² − 25' }] },
    { id: 'i3', tokens: [{ n: 'a − 2', d: '7' }], hit: true },
    { id: 'i4', tokens: [{ n: '9', d: 'a' }] },
    { id: 'i5', tokens: [{ n: '3', d: 'a² + 4' }], hit: true },
    { id: 'i6', tokens: [{ n: '2', d: '5a − 10' }] },
  ],
  eyebrow: L('Belgilash', 'Отметить', 'Mark'),
  setup: L(
    "Oltita kasr. Ba'zilarida taqiqlangan qiymat bor, ba'zilarida umuman yo'q.",
    'Шесть дробей. У некоторых есть запрещённое значение, у некоторых нет вовсе.',
    'Six fractions. Some have a forbidden value, some have none at all.'),
  ask: L(
    "a ning ixtiyoriy qiymatida ham ma'noga ega bo'lgan 3 ta kasrni belgilang.",
    'Отметь 3 дроби, которые имеют смысл при любом значении a.',
    'Mark the 3 fractions that have a value for every a.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Uchtasining sababi uch xil: a kvadrat qo'shuv bir kamida birga teng, a kvadrat qo'shuv to'rt kamida to'rtga, uchinchisida esa maxrajda yetti turadi va harf umuman yo'q. Qolgan uchtasi nolga aylanadi: a kvadrat minus yigirma besh beshda va minus beshda, a nolda, besh a minus o'n ikkida.",
    'Верно. Причины разные: a в квадрате плюс один не меньше единицы, a в квадрате плюс четыре не меньше четырёх, а в третьей под чертой семь и буквы нет вовсе. Остальные три обращаются в нуль: при пяти и минус пяти, при нуле, при двух.',
    'Correct. The three have different reasons: a squared plus one is at least one, a squared plus four is at least four, and the third has seven below the bar with no letter there at all. The other three become zero: a squared minus twenty five at five and minus five, a at zero, five a minus ten at two.'),
  wrongs: [
    { when: (s) => s.miss.indexOf('i3') !== -1, text: L(
      "Maxrajda son turgan kasrni chetlab o'tdingiz. Yetti nolga aylanmaydi va o'zgarmaydi, a esa faqat suratda: bunday kasr har qanday a da hisoblanadi.",
      'Дробь с числом в знаменателе осталась в стороне. Семь в нуль не обращается и не меняется, a стоит только в числителе: такая дробь считается при любом a.',
      'The fraction with a number in the denominator was left out. Seven never becomes zero and never changes, and a stays only in the numerator: such a fraction is computed for every a.') },
    { when: (s) => s.extra.indexOf('i4') !== -1, text: L(
      "Nolni qo'yib ko'ring: chiziq tagida nolning o'zi qoladi va bo'lish to'xtaydi. Maxrajda faqat harf turishi — eng qisqa taqiq.",
      'Подставь нуль: под чертой останется сам нуль, и деление прекратится. Одна буква в знаменателе — самый короткий запрет.',
      'Substitute zero: the zero itself stays below the bar and the division stops. A single letter in the denominator is the shortest ban there is.') },
    { when: (s) => s.extra.indexOf('i2') !== -1 || s.extra.indexOf('i6') !== -1, text: L(
      "Bu maxrajlarni nolga tenglang. a kvadrat minus yigirma besh nolga ikki joyda aylanadi, besh a minus o'n esa bir joyda. Qo'yib tekshiring.",
      'Приравняй эти знаменатели к нулю. a в квадрате минус двадцать пять обращается в нуль в двух местах, пять a минус десять — в одном. Проверь подстановкой.',
      'Set these denominators to zero. a squared minus twenty five becomes zero in two places, five a minus ten in one. Check by substituting.') },
    { when: (s) => s.marked.length !== 3, text: L(
      "Aynan uchta kasr kerak. Har birini nolga tenglashga urinib ko'ring: tenglama yechimga ega bo'lsa, u kasr taqiqli.",
      'Нужно ровно три дроби. Попробуй приравнять каждый знаменатель к нулю: если уравнение имеет решение, у дроби есть запрет.',
      'Exactly three fractions are needed. Try setting each denominator to zero: if the equation has a solution, that fraction has a ban.') },
  ],
  wrongText: L(
    "Har maxrajni nolga tenglang. Yechimi yo'q bo'lsa — kasr har qanday a da ma'noga ega.",
    'Приравняй каждый знаменатель к нулю. Нет решения — дробь имеет смысл при любом a.',
    'Set each denominator to zero. No solution means the fraction has a value for every a.'),
};

export default function D01_06(props) { return <MarkAll data={DATA} {...props} />; }
