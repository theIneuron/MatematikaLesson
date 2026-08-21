// Dars06 · Amaliyot 06 — Avval soddalashtirish · 🟡 · tag: simplify_then_value
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
//
// 6a − 2a + 3a, a = −4. Ikki yo'l bor:
//   uzun:  6 · (−4) − 2 · (−4) + 3 · (−4) = −24 + 8 − 12 = −28
//   qisqa: 6 − 2 + 3 = 7, ya'ni 7a; keyin 7 · (−4) = −28
// Ikkisi ham bir xil javob beradi -- va aynan shu o'xshash hadlarni
// yig'ishning MA'NOSI: uchta ko'paytirish o'rniga bitta.
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'simplify_then_value', level: '🟡', allowNeg: true, target: -28,
  eyebrow: L('Avval soddalashtirish', 'Сначала упростить', 'Simplify first'),
  setup: L(
    "Uchta hadni alohida hisoblash mumkin, lekin ularni avval yig'ish qisqaroq: uch ko'paytirish o'rniga bitta qoladi.",
    'Можно посчитать три слагаемых по отдельности, но короче сначала их собрать: вместо трёх умножений останется одно.',
    'You can work out the three terms one by one, but collecting them first is shorter: one multiplication instead of three.'),
  given: [['a', '=', '−4']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  expr: ['6a', '−', '2a', '+', '3a'], exprSize: 34,
  label: L('Qiymatni yozing:', 'Запиши значение:', 'Write the value:'),
  correctText: L(
    "To'g'ri. 6 − 2 + 3 = 7, ya'ni yozuv 7a. Keyin 7 · (−4) = −28.",
    'Верно. 6 − 2 + 3 = 7, то есть запись это 7a. Затем 7 · (−4) = −28.',
    'Correct. 6 − 2 + 3 = 7, so the record is 7a. Then 7 · (−4) = −28.'),
  wrongs: [
    { when: (s) => s.value === 28, text: L(
      "Ishora: a manfiy, ya'ni 7 · (−4) manfiy son beradi.",
      'Знак: a отрицательное, значит 7 · (−4) даёт отрицательное число.',
      'The sign: a is negative, so 7 · (−4) gives a negative number.') },
    { when: (s) => s.value === -44, text: L(
      "Koeffitsiyentlar ishorasi bilan yig'iladi: 6 − 2 + 3 = 7, 11 emas.",
      'Коэффициенты собираются со знаками: 6 − 2 + 3 = 7, а не 11.',
      'Coefficients are collected with their signs: 6 − 2 + 3 = 7, not 11.') },
    { when: (s) => s.value === 7 || s.value === -7, text: L(
      "Yozuv 7a ga soddalashdi, lekin qiymat hali hisoblanmadi: 7 ni −4 ga ko'paytirish kerak.",
      'Запись упростилась до 7a, но значение ещё не посчитано: 7 надо умножить на −4.',
      'The record simplified to 7a, but the value is not worked out yet: 7 must be multiplied by −4.') },
  ],
  wrongText: L(
    "Avval koeffitsiyentlarni yig'ing: 6 − 2 + 3. Keyin chiqqan sonni −4 ga ko'paytiring.",
    'Сначала собери коэффициенты: 6 − 2 + 3. Потом умножь полученное число на −4.',
    'First collect the coefficients: 6 − 2 + 3. Then multiply the result by −4.'),
};

export default function D06_06(props) { return <TypeValue data={DATA} {...props} />; }
