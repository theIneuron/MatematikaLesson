// Dars06 · Amaliyot 06 — Nollar · 🟡 · teg: belgi-almashtirish-notogri
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> TypeSet.
// Kontent: src/books/grade9/DARS06_AMALIYOT_KONTENT.md §06
//
// Tuzoqlarning asosiysi — ishoralarni teskari olish (−2; −6): yig'indi
// manfiy chiqardi, yozuvda esa minus sakkiz iks turibdi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { TypeSet } from '../asboblar9.jsx';

const DATA = {
  tag: 'belgi-almashtirish-notogri', level: '🟡',
  eyebrow: L('Nollar', 'Нули', 'Zeros'),
  setup: L(
    "Tengsizlikni yechish ko'paytuvchilarga ajratishdan boshlanadi.",
    'Решение неравенства начинается с разложения на множители.',
    'Solving the inequality starts from factoring.'),
  ask: L(
    'Kvadrat uch hadni nolga aylantiradigan sonlarni yozing.',
    'Выпиши числа, при которых квадратный трёхчлен обращается в нуль.',
    'Write the numbers at which the quadratic trinomial becomes zero.'),
  hint: L(
    "Bir nechta son bo'lsa, ularni nuqta-vergul bilan ajrating.",
    'Если чисел несколько, раздели их точкой с запятой.',
    'If there is more than one number, separate them with a semicolon.'),
  placeholder: '0; 0',
  expr: ['x² − 8x + 12 ≤ 0'],
  answer: [2, 6],
  correctText: L(
    "To'g'ri, ikkita son. Ko'paytmasi o'n ikki, yig'indisi sakkiz bo'lgan sonlar ikki va olti — demak uch had iks minus ikki ko'paytiruv iks minus oltiga ajraladi. Shu ikki son javobning chegaralari bo'ladi.",
    'Верно, два числа. Числа с произведением двенадцать и суммой восемь — это два и шесть, значит трёхчлен раскладывается на икс минус два умножить на икс минус шесть. Эти два числа и станут границами ответа.',
    'Correct, two numbers. The numbers with product twelve and sum eight are two and six, so the trinomial factors into x minus two times x minus six. Those two numbers become the boundaries of the answer.'),
  wrongs: [
    { when: (s) => s.has(-2) || s.has(-6), text: L(
      "Ishoralar teskari olindi. Qavslarni oching: minus ikki va minus olti bo'lganda yig'indi manfiy chiqardi, bu yerda esa minus sakkiz iks turibdi.",
      'Знаки взяты наоборот. Раскрой скобки: при минус двух и минус шести сумма вышла бы отрицательной, а здесь стоит минус восемь икс.',
      'The signs were taken the other way. Expand the brackets: with minus two and minus six the sum would be negative, but here it is minus eight x.') },
    { when: (s) => s.size === 1, text: L(
      "Bitta son topildi, ikkinchisi qoldi. Ko'paytmasi o'n ikki bo'lgan yana qaysi son bor?",
      'Одно число найдено, второе осталось. Какое ещё число даёт в произведении двенадцать?',
      'One number found, the other left behind. Which other number gives twelve in the product?') },
    { when: (s) => s.has(8) || s.has(12), text: L(
      "Sakkiz va o'n ikki — yozuvdagi koeffitsientlar, nollar emas. Ular orqali nollar topiladi: yig'indisi sakkiz, ko'paytmasi o'n ikki.",
      'Восемь и двенадцать — коэффициенты записи, а не нули. Через них нули и находят: сумма восемь, произведение двенадцать.',
      'Eight and twelve are the coefficients of the record, not the zeros. The zeros are found through them: sum eight, product twelve.') },
  ],
  wrongText: L(
    "Ikkita son qidiring: ularning yig'indisi sakkizga, ko'paytmasi esa o'n ikkiga teng bo'lsin.",
    'Ищи два числа: их сумма равна восьми, а произведение двенадцати.',
    'Look for two numbers: their sum is eight and their product is twelve.'),
};

export default function D06_06(props) { return <TypeSet data={DATA} {...props} />; }
