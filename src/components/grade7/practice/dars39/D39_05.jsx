// Dars39 · Amaliyot 05 — Takrorlash mumkin · 🟡 · build · tag: comb_repeat
// Mexanika: kit.jsx -> BuildLine. Raskladka: 5-o'rin.
// 1, 2, 3 raqamlaridan ikki xonali son: raqam TAKRORLANISHI mumkin,
// ya'ni 3 · 3 = 9 ta son.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'comb_repeat', level: '🟡',
  eyebrow: L('Takrorlash mumkin', 'Повтор разрешён', 'Repeats allowed'),
  setup: L(
    "Ikki xonali son tuzilyapti va raqamlar takrorlanishi mumkin: 11 ham son. Har o'rin uchun uch variant bor.",
    'Составляется двузначное число, и цифры могут повторяться: 11 тоже число. Для каждого разряда три варианта.',
    'A two-digit number is built and digits may repeat: 11 counts. Each place has three options.'),
  given: [['1,', '2,', '3']],
  givenLabel: L('Raqamlar:', 'Цифры:', 'Digits:'),
  cards: [
    { id: 'a', label: '3 · 3' },
    { id: 'b', label: '9' },
    { id: 'c', label: '3 · 2' },
    { id: 'd', label: '6' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Hisoblab yozing", 'Запиши вычисление', 'Write the working'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Birinchi raqam uch xil, ikkinchisi ham uch xil: 3 · 3 = 9. 11, 22, 33 ham hisobga kiradi.",
    'Верно. Первая цифра три варианта, вторая тоже три: 3 · 3 = 9. Числа 11, 22, 33 тоже считаются.',
    'Correct. Three choices for the first digit and three for the second: 3 · 3 = 9, including 11, 22, 33.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1 || s.seq.indexOf('d') !== -1, text: L(
      "3 · 2 raqam takrorlanmasa to'g'ri bo'lardi. Bu yerda esa 11 kabi sonlar ham mumkin.",
      '3 · 2 было бы верно, если цифры не повторяются. А здесь допустимы и числа вида 11.',
      '3 · 2 would fit if digits could not repeat. Here numbers like 11 are allowed.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Ikki bo'lak kerak: hisoblash va natija.",
      'Нужны две части: вычисление и результат.',
      'Two parts are needed: the working and the result.') },
  ],
  wrongText: L(
    "Birinchi raqam uchun nechta variant bor? Ikkinchisi uchun-chi, agar takrorlash mumkin bo'lsa?",
    'Сколько вариантов для первой цифры? А для второй, если повтор разрешён?',
    'How many choices for the first digit? And for the second, with repeats allowed?'),
};

export default function D39_05(props) { return <BuildLine data={DATA} {...props} />; }
