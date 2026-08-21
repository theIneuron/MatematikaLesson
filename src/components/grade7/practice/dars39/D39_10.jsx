// Dars39 · Amaliyot 10 — Uch xonali son · 🔴 · build · tag: comb_three_digit
// Mexanika: kit.jsx -> BuildLine. Raskladka: 10-o'rin.
// 1, 2, 3 raqamlaridan takrorsiz uch xonali son: 3 · 2 · 1 = 6.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'comb_three_digit', level: '🔴',
  eyebrow: L('Takrorsiz uch xona', 'Три разряда без повторов', 'Three places, no repeats'),
  setup: L(
    "Uch raqamdan uch xonali son tuziladi, raqamlar takrorlanmaydi. Har qadamda tanlov kamayadi: 3, keyin 2, keyin 1.",
    'Из трёх цифр составляется трёхзначное число, цифры не повторяются. На каждом шаге выбор уменьшается: 3, потом 2, потом 1.',
    'A three-digit number from three digits with no repeats. The choices shrink: 3, then 2, then 1.'),
  given: [['1,', '2,', '3']],
  givenLabel: L('Raqamlar:', 'Цифры:', 'Digits:'),
  cards: [
    { id: 'a', label: '3 · 2 · 1' },
    { id: 'b', label: '6' },
    { id: 'c', label: '3 · 3 · 3' },
    { id: 'd', label: '27' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Hisoblab yozing", 'Запиши вычисление', 'Write the working'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 3 · 2 · 1 = 6: bu 123, 132, 213, 231, 312, 321 sonlari.",
    'Верно. 3 · 2 · 1 = 6: это числа 123, 132, 213, 231, 312, 321.',
    'Correct. 3 · 2 · 1 = 6: the numbers 123, 132, 213, 231, 312, 321.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1 || s.seq.indexOf('d') !== -1, text: L(
      "3 · 3 · 3 takrorlash mumkin bo'lganda to'g'ri: 111 kabi sonlar ham hisoblanardi. Bizda esa raqamlar takrorlanmaydi.",
      '3 · 3 · 3 верно при повторах: тогда считались бы и числа вида 111. А у нас цифры не повторяются.',
      '3 · 3 · 3 fits when repeats are allowed, counting numbers like 111. Here digits cannot repeat.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Ikki bo'lak kerak: hisoblash va natija.",
      'Нужны две части: вычисление и результат.',
      'Two parts are needed: the working and the result.') },
  ],
  wrongText: L(
    "Birinchi raqamni qo'ygandan keyin nechta raqam qoladi? Uchinchisi uchun-chi?",
    'Сколько цифр остаётся после первой? А для третьей?',
    'How many digits remain after the first? And for the third?'),
};

export default function D39_10(props) { return <BuildLine data={DATA} {...props} />; }
