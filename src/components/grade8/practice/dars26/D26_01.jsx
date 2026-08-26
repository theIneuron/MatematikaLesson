// Dars26 · Amaliyot 01 — Yechimlar · 🟢 · tag: both_true_marked
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §8 (26-dars, 1-pozitsiya)
//
// T1 NING TA'RIFI: sistemaning yechimi HAR IKKI tengsizlikni to'g'ri
// qiladigan qiymat. Ya'ni tekshirish ikki qadamli — bitta emas.
//
// Uch rad etilgan son uch xil sabab bilan:
//   1 va 6 — chegaralar, tengsizliklar QAT'IY (З54);
//   0      — faqat IKKINCHI tengsizlikni qanoatlantiradi, birinchisini
//            esa yo'q. Bu З55 ning ildizi: bitta tengsizlik yetarli emas.
// Sistemaning yozuvi darsdagi kabi — vergul bilan (`Dars26.jsx`).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'both_true_marked', level: '🟢',
  col: 120, itemSize: 19,
  given: [['x > 1,   x < 6']],
  givenLabel: L('Sistema', 'Система', 'The system'),
  items: [
    { id: 'i1', tokens: ['2'], hit: true },
    { id: 'i2', tokens: ['1'] },
    { id: 'i3', tokens: ['4'], hit: true },
    { id: 'i4', tokens: ['6'] },
    { id: 'i5', tokens: ['5,5'], hit: true },
    { id: 'i6', tokens: ['0'] },
  ],
  eyebrow: L('Yechimlar', 'Решения', 'Solutions'),
  setup: L(
    "Sistemaning yechimi — har IKKI tengsizlikni ham to'g'ri qiladigan qiymat.",
    'Решение системы — значение, обращающее в верные ОБА неравенства.',
    'A solution of the system is a value making BOTH inequalities true.'),
  ask: L(
    "Sistemaning yechimi bo'lgan 3 ta sonni belgilang.",
    'Отметь 3 числа, которые являются решениями системы.',
    'Mark the 3 numbers that are solutions of the system.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Uchala son ham birdan katta VA oltidan kichik. Bir va olti chegaralar — tengsizliklar qat'iy. Nol esa faqat ikkinchi shartni bajaradi, birinchisini yo'q: bitta tengsizlik yetarli emas.",
    'Верно. Все три числа больше одного И меньше шести. Один и шесть — границы, а неравенства строгие. Нуль же выполняет только второе условие, но не первое: одного неравенства мало.',
    'Correct. All three numbers are greater than one AND less than six. One and six are the boundaries, and the inequalities are strict. Zero satisfies only the second condition, not the first: one inequality is not enough.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('i6') !== -1, text: L(
        'Nol faqat ikkinchi shartni bajaradi: nol oltidan kichik, lekin birdan katta emas. Ikkalasi ham kerak.',
        'Нуль выполняет только второе условие: нуль меньше шести, но не больше одного. Нужны оба.',
        'Zero satisfies only the second condition: zero is less than six but not greater than one. Both are needed.') },
    { when: (s) => s.extra.indexOf('i2') !== -1 || s.extra.indexOf('i4') !== -1, text: L(
      "Bu son — CHEGARA, va tengsizliklar qat'iy. Qo'yib tekshiring: bir birdan katta emas, u unga teng; olti ham oltidan kichik emas. Belgining ostida chiziq yo'q, ya'ni tenglik yaramaydi. Agar sistema x birdan katta yoki teng deb yozilganida, bir yechim bo'lardi.",
      'Это число — ГРАНИЦА, а неравенства строгие. Проверь подстановкой: один не больше одного, он ему равен; шесть тоже не меньше шести. Под знаком нет черты, значит равенство не годится. Будь в системе записано «x больше или равен одному», единица была бы решением.',
      'That number is a BOUNDARY, and the inequalities are strict. Check by substitution: one is not greater than one, it equals it; six is not less than six either. There is no line under the sign, so equality does not qualify. Had the system said «x greater than or equal to one», one would be a solution.') },
    { when: (s) => s.miss.indexOf('i5') !== -1, text: L(
      "Bu son chetlab o'tildi, lekin u yechim: besh butun besh birdan katta va oltidan kichik. Yechim butun son bo'lishi shart emas — sistemaning yechimi bir bilan olti orasidagi HAMMA son, kasrlari ham.",
      'Это число осталось в стороне, а оно решение: пять целых пять больше одного и меньше шести. Решение не обязано быть целым — решением системы являются ВСЕ числа между одним и шестью, включая дробные.',
      'This number was left out, yet it is a solution: five point five is greater than one and less than six. A solution need not be a whole number — the solutions of the system are ALL numbers between one and six, fractional ones included.') },
    { when: (s) => s.marked.length !== 3, text: L(
      "Aynan uchta son kerak. Har birini IKKI marta tekshiring: birinchi tengsizlikka qo'ying, keyin ikkinchisiga. Faqat ikkalasi ham to'g'ri chiqsa, son yechim bo'ladi.",
      'Нужно ровно три числа. Проверяй каждое ДВАЖДЫ: подставь в первое неравенство, потом во второе. Только если оба вышли верными, число является решением.',
      'Exactly three numbers are needed. Test each one TWICE: substitute it into the first inequality, then into the second. Only if both come out true is the number a solution.') },
  ],
  wrongText: L(
    "Har sonni ikkala tengsizlikka ham qo'ying. Bitta shart bajarilgani yetarli emas, va qat'iy tengsizlikda chegara yechim bo'lmaydi.",
    'Подставляй каждое число в оба неравенства. Выполнения одного условия мало, а в строгом неравенстве граница решением не является.',
    'Substitute every number into both inequalities. Satisfying one condition is not enough, and in a strict inequality the boundary is not a solution.'),
};

export default function D26_01(props) { return <MarkAll data={DATA} {...props} />; }
