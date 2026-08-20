// Dars02 · Amaliyot 02 — Manfiy son qo'yish · 🟢 · tag: substitute_neg
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
//
// 5x − 8, x = −6. Qoida o'zgarmaydi: avval ikkinchi bosqich.
//   5 · (−6) = −30, so'ng −30 − 8 = −38.
// Manfiy son qo'yish -- 6-sinf takrorlashi, lekin aynan shu joyda ishora
// yo'qoladi: o'quvchi 5 · 6 = 30 deb hisoblab, 22 ni yozadi.
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'substitute_neg', level: '🟢', allowNeg: true, target: -38,
  eyebrow: L("Son qo'yib hisoblash", 'Подставить и посчитать', 'Substitute and work out'),
  setup: L(
    "Harf o'rniga son qo'yiladi va yozuv oddiy sonli ifodaga aylanadi. Manfiy sonni qavs ichida qo'yish qulay.",
    'Вместо буквы ставится число, и запись становится обычной числовой. Отрицательное число удобно ставить в скобках.',
    'A number replaces the letter and the record becomes an ordinary numeric one. A negative number is easier to put in brackets.'),
  given: [['x', '=', '−6']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  expr: ['5x', '−', '8'], exprSize: 34,
  label: L('Qiymatni yozing:', 'Запиши значение:', 'Write the value:'),
  correctText: L(
    "To'g'ri. 5 · (−6) = −30, keyin −30 − 8 = −38.",
    'Верно. 5 · (−6) = −30, затем −30 − 8 = −38.',
    'Correct. 5 · (−6) = −30, then −30 − 8 = −38.'),
  wrongs: [
    { when: (s) => s.value === 22, text: L(
      "Ishora yo'qoldi: 5 ni minus oltiga ko'paytirsa minus o'ttiz chiqadi, o'ttiz emas.",
      'Потерялся знак: пять умножить на минус шесть даёт минус тридцать, а не тридцать.',
      'The sign got lost: five times minus six is minus thirty, not thirty.') },
    { when: (s) => s.value === -30, text: L(
      "Ikkinchi amal bajarilmadi: minus o'ttizdan yana 8 ayiriladi.",
      'Второе действие не сделано: от минус тридцати ещё вычитается 8.',
      'The second step is missing: 8 is still to be taken from minus thirty.') },
    { when: (s) => s.value === -23, text: L(
      "5x bu 5 · x, 5 + x emas. Avval ko'paytirish.",
      '5x это 5 · x, а не 5 + x. Сначала умножение.',
      '5x means 5 · x, not 5 + x. Multiplication first.') },
  ],
  wrongText: L(
    "Avval ko'paytirish: 5 · (−6). Keyin 8 ayiriladi. Manfiy sondan ayirganda son yana kichrayadi.",
    'Сначала умножение: 5 · (−6). Потом вычитается 8. При вычитании из отрицательного числа оно становится меньше.',
    'Multiplication first: 5 · (−6). Then 8 is taken away. Taking from a negative number makes it smaller still.'),
};

export default function D02_02(props) { return <TypeValue data={DATA} {...props} />; }
