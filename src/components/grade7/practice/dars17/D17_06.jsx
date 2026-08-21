// Dars17 · Amaliyot 06 — Uch natijani tartib bilan · 🟡 · order · tag: power_order
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> BuildLine (answerSeq: tartib muhim).
// Mexanika RASKLADKADAN: 17-dars, 6-o'rin `order`.
//
// (2c²d³)⁵ = 32c¹⁰d¹⁵. Uch natija TARTIB bilan qo'yiladi: son, c, d.
//   2⁵ = 32     c: 2 · 5 = 10     d: 3 · 5 = 15
// Ortiqcha kartalar: 10 (2 · 5), c⁷ (2 + 5), d⁸ (3 + 5).
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'power_order', level: '🟡',
  eyebrow: L('Tartib bilan', 'По порядку', 'In order'),
  setup: L(
    "Javob uch natijadan yig'iladi va tartibi muhim: avval son, keyin c, keyin d. Har bo'lak o'z qoidasi bilan topiladi.",
    'Ответ собирается из трёх результатов, и порядок важен: сначала число, потом c, потом d. Каждая часть находится по своему правилу.',
    'The answer is built from three results and the order matters: the number, then c, then d. Each part follows its own rule.'),
  expr: ['(2c²d³)⁵'], exprSize: 36,
  cards: [
    { id: 'c32', label: '32' },
    { id: 'c10', label: 'c¹⁰' },
    { id: 'd15', label: 'd¹⁵' },
    { id: 'n10', label: '10' },
    { id: 'c7', label: 'c⁷' },
    { id: 'd8', label: 'd⁸' },
  ],
  answerSeq: ['c32', 'c10', 'd15'],
  empty: L("Uch natijani tartib bilan qo'ying", 'Поставь три результата по порядку', 'Put the three results in order'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 2⁵ = 32, c da 2 · 5 = 10, d da 3 · 5 = 15. Javob 32c¹⁰d¹⁵.",
    'Верно. 2⁵ = 32, у c 2 · 5 = 10, у d 3 · 5 = 15. Ответ 32c¹⁰d¹⁵.',
    'Correct. 2⁵ = 32, for c 2 · 5 = 10, for d 3 · 5 = 15. The answer is 32c¹⁰d¹⁵.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('n10') !== -1, text: L(
      "10 bu 2 · 5. Son darajaga ko'tariladi: 2⁵ = 32.",
      '10 это 2 · 5. Число возводится в степень: 2⁵ = 32.',
      '10 is 2 · 5. The number is raised to the power: 2⁵ = 32.') },
    { when: (s) => s.seq.indexOf('c7') !== -1 || s.seq.indexOf('d8') !== -1, text: L(
      "c⁷ va d⁸ ko'rsatkichlarni qo'shishdan chiqadi: 2 + 5, 3 + 5. Darajaga ko'tarishda ular ko'paytiriladi.",
      'c⁷ и d⁸ выходят из сложения показателей: 2 + 5, 3 + 5. При возведении в степень они умножаются.',
      'c⁷ and d⁸ come from adding the exponents: 2 + 5, 3 + 5. Raising to a power multiplies them.') },
    { when: (s) => s.seq.length === 3, text: L(
      "Bo'laklar to'g'ri, lekin tartibi boshqa: avval son, keyin c, keyin d.",
      'Части верные, но порядок другой: сначала число, потом c, потом d.',
      'The parts are right but the order is not: the number first, then c, then d.') },
    { when: (s) => s.seq.length < 3, text: L(
      "Javob uch bo'lakdan iborat: son, c va d. Bittasi qo'yilmadi.",
      'Ответ состоит из трёх частей: число, c и d. Одну не поставил.',
      'The answer has three parts: the number, c and d. One is missing.') },
  ],
  wrongText: L(
    "Uch natijani alohida hisoblang, keyin tartib bilan qo'ying: son, c, d.",
    'Посчитай три результата по отдельности, потом поставь по порядку: число, c, d.',
    'Work out the three results separately, then place them in order: the number, c, d.'),
};

export default function D17_06(props) { return <BuildLine data={DATA} {...props} />; }
