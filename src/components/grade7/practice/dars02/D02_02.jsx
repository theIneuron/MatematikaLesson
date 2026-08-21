// Dars02 · Amaliyot 02 — Manfiy son qo'yish · 🟢 · tag: substitute_neg
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
//
// DARAJA KO'TARILDI (PODXOD_7SINF.md §13): koeffitsient va ozod had uch
// xonali, javob to'rt xonali, ishora esa saqlanadi.
//
// 40x − 850, x = −6. Qoida o'zgarmaydi: avval ikkinchi bosqich.
//   40 · (−6) = −240, so'ng −240 − 850 = −1090.
// Aynan shu joyda ishora yo'qoladi: o'quvchi 40 · 6 = 240 deb hisoblab,
// −610 ni yozadi.
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'substitute_neg', level: '🟢', allowNeg: true, target: -1090,
  eyebrow: L("Son qo'yib hisoblash", 'Подставить и посчитать', 'Substitute and work out'),
  setup: L(
    "Harf o'rniga son qo'yiladi va yozuv oddiy sonli ifodaga aylanadi. Manfiy sonni qavs ichida qo'yish qulay.",
    'Вместо буквы ставится число, и запись становится обычной числовой. Отрицательное число удобно ставить в скобках.',
    'A number replaces the letter and the record becomes an ordinary numeric one. A negative number is easier to put in brackets.'),
  given: [['x', '=', '−6']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  expr: ['40x', '−', '850'], exprSize: 34,
  label: L('Qiymatni yozing:', 'Запиши значение:', 'Write the value:'),
  correctText: L(
    "To'g'ri. 40 · (−6) = −240, keyin −240 − 850 = −1090.",
    'Верно. 40 · (−6) = −240, затем −240 − 850 = −1090.',
    'Correct. 40 · (−6) = −240, then −240 − 850 = −1090.'),
  wrongs: [
    { when: (s) => s.value === -610, text: L(
      "Ishora yo'qoldi: qirqni minus oltiga ko'paytirsa minus ikki yuz qirq chiqadi, ikki yuz qirq emas.",
      'Потерялся знак: сорок умножить на минус шесть даёт минус двести сорок, а не двести сорок.',
      'The sign got lost: forty times minus six is minus two hundred forty, not plus.') },
    { when: (s) => s.value === -240, text: L(
      "Ikkinchi amal bajarilmadi: minus ikki yuz qirqdan yana 850 ayiriladi.",
      'Второе действие не сделано: от минус двухсот сорока ещё вычитается 850.',
      'The second step is missing: 850 is still to be taken from minus two hundred forty.') },
    { when: (s) => s.value === -816, text: L(
      "40x bu 40 · x, 40 + x emas. Avval ko'paytirish.",
      '40x это 40 · x, а не 40 + x. Сначала умножение.',
      '40x means 40 · x, not 40 + x. Multiplication first.') },
  ],
  wrongText: L(
    "Avval ko'paytirish: 40 · (−6). Keyin 850 ayiriladi. Manfiy sondan ayirganda son yana kichrayadi.",
    'Сначала умножение: 40 · (−6). Потом вычитается 850. При вычитании из отрицательного числа оно становится меньше.',
    'Multiplication first: 40 · (−6). Then 850 is taken away. Taking from a negative number makes it smaller still.'),
};

export default function D02_02(props) { return <TypeValue data={DATA} {...props} />; }
