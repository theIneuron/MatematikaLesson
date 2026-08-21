// Dars31 · Amaliyot 10 — Ikki harfli kublar · 🔴 · build · tag: cube_two_letters
// Mexanika: kit.jsx -> BuildLine. Raskladka: 10-o'rin.
// 125x³ + 8y³ = (5x + 2y)(25x² − 10xy + 4y²).
//   Asoslar 5x va 2y. To'liqsiz kvadrat: (5x)² = 25x², 5x · 2y = 10xy, (2y)² = 4y².
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'cube_two_letters', level: '🔴',
  eyebrow: L('Ikki harf', 'Две буквы', 'Two letters'),
  setup: L(
    "Ikki asos ham koeffitsiyentli: 5x va 2y. To'liqsiz kvadratda ularning kvadratlari va ko'paytmasi turadi.",
    'Оба основания с коэффициентами: 5x и 2y. В неполном квадрате стоят их квадраты и произведение.',
    'Both bases carry coefficients: 5x and 2y. The incomplete square holds their squares and product.'),
  expr: ['125x³', '+', '8y³'], exprSize: 32,
  cards: [
    { id: 'a', label: '(5x + 2y)' },
    { id: 'b', label: '(25x² − 10xy + 4y²)' },
    { id: 'c', label: '(5x − 2y)' },
    { id: 'd', label: '(25x² + 10xy + 4y²)' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Ikki ko'paytuvchini qo'ying", 'Поставь два множителя', 'Place the two factors'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 125x³ = (5x)³, 8y³ = (2y)³. Yig'indi uchun to'liqsizda minus: 25x² − 10xy + 4y².",
    'Верно. 125x³ = (5x)³, 8y³ = (2y)³. Для суммы в неполном минус: 25x² − 10xy + 4y².',
    'Correct. 125x³ = (5x)³, 8y³ = (2y)³. For a sum the incomplete square takes a minus.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "Yozuvda yig'indi turibdi: 125x³ + 8y³, ya'ni (5x + 2y).",
      'В записи сумма: 125x³ + 8y³, значит (5x + 2y).',
      'The record is a sum: 125x³ + 8y³, so (5x + 2y).') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "Ishoralar qarama-qarshi: birinchi qavsda plyus bo'lsa, to'liqsizda minus.",
      'Знаки противоположны: если в первой скобке плюс, то в неполном минус.',
      'The signs are opposite: a plus in the first bracket means a minus inside.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Javob ikki qavsdan iborat.",
      'Ответ состоит из двух скобок.',
      'The answer has two brackets.') },
  ],
  wrongText: L(
    "125x³ va 8y³ nimaning kubi? To'liqsiz kvadratni shu asoslardan yig'ing.",
    'Куб чего такое 125x³ и 8y³? Собери неполный квадрат из этих оснований.',
    '125x³ and 8y³ are cubes of what? Build the incomplete square from those bases.'),
};

export default function D31_10(props) { return <BuildLine data={DATA} {...props} />; }
