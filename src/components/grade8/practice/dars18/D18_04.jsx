// Dars18 · Amaliyot 04 — Ikki ildiz · 🟡 · tag: two_roots_marked
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §6 (18-dars, 4-pozitsiya)
//
// OLTI TENGLAMA, OLTI HISOB — shuning uchun bu 🟡. Uchtasida D musbat,
// uchtasida esa nol yoki manfiy.
//
// OLDINGI BLOKDAN (TIPLAR §6): `y² + y − 1 = 0` da D beshga teng — ildizlar
// IRRATSIONAL sonlar (13-14 dars), lekin ular IKKITA. «Chiroyli emas» degani
// «yo'q» degani emas, va bu karta aynan shu farq uchun qo'yilgan.
// Ikkita karta D nolga teng: `y² − 4y + 4` va `3y² − 6y + 3` — ikkinchisi
// koeffitsiyentlari kattaroq, lekin natija o'sha (З9).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'two_roots_marked', level: '🟡',
  col: 164, itemSize: 14,
  items: [
    { id: 'i1', tokens: ['y² − 5y + 4 = 0'], hit: true },
    { id: 'i2', tokens: ['y² − 4y + 4 = 0'] },
    { id: 'i3', tokens: ['2y² + 3y − 2 = 0'], hit: true },
    { id: 'i4', tokens: ['y² + 2y + 5 = 0'] },
    { id: 'i5', tokens: ['y² + y − 1 = 0'], hit: true },
    { id: 'i6', tokens: ['3y² − 6y + 3 = 0'] },
  ],
  eyebrow: L('Ikki ildiz', 'Два корня', 'Two roots'),
  setup: L(
    "Ikki TURLI ildiz faqat diskriminant musbat bo'lganda bo'ladi. Ildizning butun yoki kasr bo'lishi esa ahamiyatsiz.",
    'Два РАЗЛИЧНЫХ корня бывают только при положительном дискриминанте. А целый корень или дробный — неважно.',
    'Two DIFFERENT roots happen only when the discriminant is positive. Whether a root is whole or not does not matter.'),
  ask: L(
    'Ikki TURLI ildizi bor 3 ta tenglamani belgilang.',
    'Отметь 3 уравнения, у которых два РАЗЛИЧНЫХ корня.',
    'Mark the 3 equations that have two DIFFERENT roots.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Uchtasida D musbat: yigirma besh minus o'n olti to'qqiz; to'qqiz qo'shuv o'n olti yigirma besh; bir qo'shuv to'rt besh.",
    'Верно. В трёх D положительно: двадцать пять минус шестнадцать девять; девять плюс шестнадцать двадцать пять; один плюс четыре пять.',
    'Correct. In three of them D is positive: twenty five minus sixteen is nine; nine plus sixteen is twenty five; one plus four is five.'),
  wrongs: [
    { when: (s) => s.miss.indexOf('i5') !== -1, text: L(
      "Beshinchi karta chetlab o'tildi. D ni hisoblang: bir qo'shuv to'rt besh — MUSBAT, demak ikki ildiz bor. Ildizlar butun emas, lekin bu ularni yo'q qilmaydi: 14-darsda irratsional sonlar ham son ekani ko'rilgan.",
      'Пятая карточка осталась в стороне. Посчитай D: один плюс четыре пять — ПОЛОЖИТЕЛЬНОЕ, значит корней два. Корни не целые, но это их не отменяет: в четырнадцатом уроке было видно, что иррациональные тоже числа.',
      'The fifth card was left out. Compute D: one plus four is five — POSITIVE, so there are two roots. The roots are not whole, but that does not cancel them: lesson fourteen showed that irrationals are numbers too.') },
    { when: (s) => s.extra.indexOf('i2') !== -1 || s.extra.indexOf('i6') !== -1, text: L(
      "Bu tenglamada D nolga teng: o'n olti minus o'n olti yoki o'ttiz olti minus o'ttiz olti. Nolda plyus-minus hech narsani o'zgartirmaydi — ildiz BITTA. Ikkinchisida koeffitsiyentlar kattaroq, lekin natija o'sha.",
      'В этом уравнении D равно нулю: шестнадцать минус шестнадцать или тридцать шесть минус тридцать шесть. При нуле плюс-минус ничего не меняет — корень ОДИН. Во втором коэффициенты больше, но результат тот же.',
      'In this equation D is zero: sixteen minus sixteen, or thirty six minus thirty six. With zero the plus-or-minus changes nothing — ONE root. In the second the coefficients are bigger but the result is the same.') },
    { when: (s) => s.extra.indexOf('i4') !== -1, text: L(
      "Bu tenglamada D manfiy: to'rt minus yigirma minus o'n olti. Manfiy sondan ildiz olinmaydi, demak haqiqiy ildiz umuman yo'q — bitta ham emas, ikkita ham emas.",
      'В этом уравнении D отрицательно: четыре минус двадцать минус шестнадцать. Из отрицательного числа корень не извлекается, значит действительных корней нет вовсе — ни одного, ни двух.',
      'In this equation D is negative: four minus twenty is minus sixteen. A negative number has no root, so there are no real roots at all — neither one nor two.') },
    { when: (s) => s.marked.length !== 3, text: L(
      "Aynan uchta tenglama kerak. Har birida D ni hisoblang va ishorasiga qarang: faqat MUSBAT D ikki turli ildiz beradi.",
      'Нужно ровно три уравнения. В каждом посчитай D и посмотри на знак: два различных корня даёт только ПОЛОЖИТЕЛЬНОЕ D.',
      'Exactly three equations are needed. Compute D in each and look at the sign: only a POSITIVE D gives two different roots.') },
  ],
  wrongText: L(
    "Har tenglamada D ni hisoblang. Musbat bo'lsa ikki ildiz, nol bo'lsa bitta, manfiy bo'lsa yo'q. Ildizning chiroyli bo'lishi shart emas.",
    'В каждом уравнении посчитай D. Положительное — два корня, нуль — один, отрицательное — ни одного. Корень не обязан быть красивым.',
    'Compute D in every equation. Positive means two roots, zero means one, negative means none. A root does not have to be neat.'),
};

export default function D18_04(props) { return <MarkAll data={DATA} {...props} />; }
