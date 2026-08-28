// Dars06 · Amaliyot 01 — Ha yoki yo'q · 🟢 · teg: javob-doim-tashqi-oraliq
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> TrueFalse.
// Kontent: src/books/grade9/DARS06_AMALIYOT_KONTENT.md §01
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, TrueFalse } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'javob-doim-tashqi-oraliq', level: '🟢',
  eyebrow: L('Ha yoki yo\'q', 'Да или нет', 'Yes or no'),
  setup: L(
    'Tengsizlik berilgan, uch mulohaza esa uning javobi haqida.',
    'Дано неравенство, а три суждения — про его ответ.',
    'An inequality is given, and three claims are about its answer.'),
  ask: L(
    "Har bir mulohaza uchun «Ha» yoki «Yo'q» ni tanlang.",
    'Для каждого суждения выбери «Да» или «Нет».',
    'Choose "Yes" or "No" for each claim.'),
  givenLabel: L('Berilgan', 'Дано', 'Given'),
  given: [['(x − 2)(x − 6) < 0']],
  itemSize: 16,
  items: [
    { id: 's1', tokens: ['2 < x < 6'], yes: true, claim: L(
      'javob shu oraliq.', 'ответ — этот промежуток.', 'the answer is this interval.') },
    { id: 's2', tokens: ['x < 2', 'yoki', 'x > 6'], yes: false, claim: L(
      'javob shu ikki nurdan iborat.', 'ответ состоит из этих двух лучей.', 'the answer is these two rays.') },
    { id: 's3', tokens: ['x = 2', ',', 'x = 6'], yes: false, claim: L(
      'chegara nuqtalari javobga kiradi.', 'граничные точки входят в ответ.', 'the boundary points belong to the answer.') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L('Yo\'q', 'Нет', 'No'),
  correctText: L(
    "To'g'ri, uchtasi ham. Tarmoqlar yuqoriga qaragan, demak parabola nollar ORASIDA Ox dan pastda turadi — aynan shu yerda ko'paytma manfiy. Tengsizlik qat'iy bo'lgani uchun ikki va olti javobga kirmaydi: u yerda ko'paytma nolga teng, nol esa manfiy emas.",
    'Верно, все три. Ветви направлены вверх, значит МЕЖДУ нулями парабола лежит ниже Ox — именно там произведение отрицательно. Неравенство строгое, поэтому двойка и шестёрка в ответ не входят: там произведение равно нулю, а нуль не отрицателен.',
    'Correct, all three. The branches point up, so BETWEEN the zeros the parabola lies below Ox — that is exactly where the product is negative. The inequality is strict, so two and six do not belong: there the product is zero, and zero is not negative.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Uchni qo'yib ko'ring: bir ko'paytiruv minus uch, ya'ni manfiy. Uch esa ikki bilan olti orasida turibdi.",
      'Подставь тройку: один умножить на минус три, то есть отрицательно. А тройка стоит между двойкой и шестёркой.',
      'Try three: one times minus three, which is negative. And three lies between two and six.') },
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Yettini qo'ying: besh ko'paytiruv bir, ya'ni musbat. Nollardan tashqarida ko'paytma manfiy emas, demak u yer javobga kirmaydi.",
      'Подставь семь: пять умножить на один, то есть положительно. Вне нулей произведение не отрицательно, значит туда ответ не заходит.',
      'Try seven: five times one, which is positive. Outside the zeros the product is not negative, so the answer does not reach there.') },
    { when: (s) => s.bad.indexOf('s3') !== -1, text: L(
      "Ikkini qo'ying: birinchi qavs nolga aylanadi va ko'paytma nol chiqadi. Tengsizlikda esa qat'iy kichik turibdi — nol bunga to'g'ri kelmaydi.",
      'Подставь двойку: первая скобка обращается в нуль и произведение равно нулю. А в неравенстве стоит строгое «меньше» — нуль ему не годится.',
      'Try two: the first bracket becomes zero and the product is zero. The inequality asks for strictly less — zero does not fit.') },
  ],
  wrongText: L(
    "Uchta sonni sinang: nollar orasidan bittasini, nollardan tashqaridan bittasini va nolning o'zini. Har birida ko'paytmaning ishorasini yozing.",
    'Испытай три числа: одно между нулями, одно вне нулей и сам нуль. Для каждого выпиши знак произведения.',
    'Test three numbers: one between the zeros, one outside them, and a zero itself. Write down the sign of the product for each.'),
};

export default function D06_01(props) { return <TrueFalse data={DATA} {...props} />; }
