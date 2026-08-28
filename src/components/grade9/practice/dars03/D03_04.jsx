// Dars03 · Amaliyot 04 — Nollar · 🟡 · teg: nol-vs-vershina
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> TypeSet.
// Kontent: src/books/grade9/DARS03_AMALIYOT_KONTENT.md §04
//
// Javob IKKITA son: iksni qavsdan chiqarish qadami shu yerda kerak.
// Tuzoqlardan biri — 3, ya'ni parabolaning uchi: `nol-vs-vershina`.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { TypeSet } from '../asboblar9.jsx';

const DATA = {
  tag: 'nol-vs-vershina', level: '🟡',
  eyebrow: L('Nollar', 'Нули', 'Zeros'),
  setup: L(
    "Funksiyaning noli — y nolga aylanadigan x qiymati.",
    'Нуль функции — это значение x, при котором y обращается в нуль.',
    'A zero of a function is a value of x at which y becomes zero.'),
  ask: L(
    'Funksiyaning barcha nollarini yozing.',
    'Выпиши все нули функции.',
    'Write all the zeros of the function.'),
  hint: L(
    "Bir nechta son bo'lsa, ularni nuqta-vergul bilan ajrating.",
    'Если чисел несколько, раздели их точкой с запятой.',
    'If there is more than one number, separate them with a semicolon.'),
  placeholder: '0; 0',
  expr: ['y = x² − 6x'],
  answer: [0, 6],
  correctText: L(
    "To'g'ri, ikkita nol. Iksni qavsdan chiqarsak, iks ko'paytiruv iks minus olti hosil bo'ladi. Ko'paytma nolga aylanishi uchun bitta ko'paytuvchining nol bo'lishi kifoya, shuning uchun nollar ham ikkita.",
    'Верно, два нуля. Если вынести икс за скобку, получится икс умножить на икс минус шесть. Чтобы произведение обратилось в нуль, достаточно одного нулевого множителя, поэтому и нулей два.',
    'Correct, two zeros. Taking x out as a factor gives x times x minus six. A product becomes zero as soon as one factor is zero, so there are two zeros as well.'),
  wrongs: [
    { when: (s) => s.size === 1 && s.has(6), text: L(
      "Bitta nol topildi, ikkinchisi qoldi. Iksni qavsdan chiqaring: ikkita ko'paytuvchi hosil bo'ladi, va ularning har biri alohida nolga aylanishi mumkin.",
      'Один нуль найден, второй остался. Вынеси икс за скобку: получатся два множителя, и каждый может обратиться в нуль отдельно.',
      'One zero found, the other left behind. Take x out as a factor: two factors appear, and each can become zero on its own.') },
    { when: (s) => s.size === 1 && s.has(0), text: L(
      "Ikkinchi ko'paytuvchi qaysi sonda nolga aylanadi? Iks minus oltini nolga tenglashtiring.",
      'При каком числе обращается в нуль второй множитель? Приравняй икс минус шесть к нулю.',
      'At which number does the second factor become zero? Set x minus six equal to zero.') },
    { when: (s) => s.has(3), text: L(
      "Uch — parabolaning uchi turgan joy, undagi qiymat esa nolga teng emas. Nol so'ralyapti, uchi emas.",
      'Три — это место вершины параболы, и значение там нулю не равно. Спрашивают нули, а не вершину.',
      'Three is where the vertex of the parabola stands, and the value there is not zero. Zeros are asked for, not the vertex.') },
    { when: (s) => s.has(-6), text: L(
      'Belgi teskari olindi. Iks minus olti nolga teng bo\'lsa, iks nimaga teng?',
      'Знак взят наоборот. Если икс минус шесть равно нулю, чему равен икс?',
      'The sign was taken the other way. If x minus six equals zero, what does x equal?') },
  ],
  wrongText: L(
    "Topgan har bir soningizni formulaga qo'ying. Igrek nol chiqdimi? Chiqmagan bo'lsa, u son nol emas.",
    'Подставь каждое найденное число в формулу. Получился ли игрек нуль? Если нет, это число не нуль функции.',
    'Put each number you found into the formula. Did y come out zero? If not, that number is not a zero.'),
};

export default function D03_04(props) { return <TypeSet data={DATA} {...props} />; }
