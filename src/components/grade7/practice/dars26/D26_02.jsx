// Dars26 · Amaliyot 02 — Uch yozuv · 🟢 · sort · tag: diff_sq_zones
// Mexanika: kit.jsx -> Zones. Raskladka: 2-o'rin.
// (x − 5)(x + 5) = x² − 25;  (x + 5)² = x² + 10x + 25;  (x − 5)² = x² − 10x + 25.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'diff_sq_zones', level: '🟢', itemSize: 19, zoneLbl: 112,
  eyebrow: L('Uch yozuv', 'Три записи', 'Three records'),
  setup: L(
    "Ikki formula yonma-yon: kvadratlar ayirmasi va kvadrat. Farqi shundaki, ayirmada o'rta had yo'qoladi.",
    'Две формулы рядом: разность квадратов и квадрат. Разница в том, что в разности средний член исчезает.',
    'Two formulas side by side: difference of squares and a square. In the difference the middle term vanishes.'),
  zones: [
    { id: 'z1', label: L('x² − 25', 'x² − 25', 'x² − 25') },
    { id: 'z2', label: L('x² + 10x + 25', 'x² + 10x + 25', 'x² + 10x + 25') },
    { id: 'z3', label: L('x² − 10x + 25', 'x² − 10x + 25', 'x² − 10x + 25') },
  ],
  items: [
    { id: 'i1', tokens: ['(x', '−', '5)', '(x', '+', '5)'], zone: 'z1' },
    { id: 'i2', tokens: ['(x', '+', '5)²'], zone: 'z2' },
    { id: 'i3', tokens: ['(x', '−', '5)²'], zone: 'z3' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L('Yozuvlar', 'Записи', 'Records'),
  correctText: L(
    "To'g'ri. Ishoralari qarama-qarshi bo'lsa o'rta had yo'qoladi. Kvadratlarda esa u qoladi, ishorasi asosga qarab.",
    'Верно. При противоположных знаках средний член исчезает. А в квадратах он остаётся, со знаком основания.',
    'Correct. Opposite signs kill the middle term. In squares it stays, with the sign of the base.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "(x − 5)(x + 5) da +5x − 5x = 0: o'rta had yo'q, javob x² − 25.",
      'В (x − 5)(x + 5) выходит +5x − 5x = 0: среднего члена нет, ответ x² − 25.',
      'In (x − 5)(x + 5) we get +5x − 5x = 0: no middle term, so x² − 25.') },
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "(x + 5)² da o'rta had musbat: 2 · x · 5 = +10x.",
      'В (x + 5)² средний член положительный: 2 · x · 5 = +10x.',
      'In (x + 5)² the middle term is positive: 2 · x · 5 = +10x.') },
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "(x − 5)² da o'rta had manfiy, ozod had esa musbat: (−5)² = +25.",
      'В (x − 5)² средний член отрицательный, а свободный положительный: (−5)² = +25.',
      'In (x − 5)² the middle term is negative and the free one positive: (−5)² = +25.') },
  ],
  wrongText: L(
    "Har yozuvda o'rta hadni hisoblang: u nolga aylanadimi yoki qoladimi?",
    'В каждой записи посчитай средний член: он обращается в нуль или остаётся?',
    'Work out the middle term in each: does it become zero or stay?'),
};

export default function D26_02(props) { return <Zones data={DATA} {...props} />; }
