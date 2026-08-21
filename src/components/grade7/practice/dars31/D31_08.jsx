// Dars31 · Amaliyot 08 — Katta son · 🔴 · build · tag: cube_big
// Mexanika: kit.jsx -> BuildLine. Raskladka: 8-o'rin.
// p³ − 216 = (p − 6)(p² + 6p + 36). 216 = 6³.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'cube_big', level: '🔴',
  eyebrow: L('Katta son', 'Большое число', 'A big number'),
  setup: L(
    "216 nimaning kubi ekanini topish kerak: 6 · 6 = 36, 36 · 6 = 216. To'liqsiz kvadratda 6² = 36 turadi.",
    'Надо понять, куб чего такое 216: 6 · 6 = 36, 36 · 6 = 216. В неполном квадрате стоит 6² = 36.',
    'Find whose cube 216 is: 6 · 6 = 36, 36 · 6 = 216. The incomplete square holds 6² = 36.'),
  expr: ['p³', '−', '216'], exprSize: 34,
  cards: [
    { id: 'a', label: '(p − 6)' },
    { id: 'b', label: '(p² + 6p + 36)' },
    { id: 'c', label: '(p − 36)' },
    { id: 'd', label: '(p² − 6p + 36)' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Ikki ko'paytuvchini qo'ying", 'Поставь два множителя', 'Place the two factors'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 216 = 6³, ya'ni (p − 6)(p² + 6p + 36). Ayirma uchun to'liqsizda plyus.",
    'Верно. 216 = 6³, значит (p − 6)(p² + 6p + 36). Для разности в неполном плюс.',
    'Correct. 216 = 6³, so (p − 6)(p² + 6p + 36). For a difference the incomplete square takes a plus.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "36 bu 6², kub emas: 6³ = 216. Birinchi qavsda 6 turadi.",
      '36 это 6², а не куб: 6³ = 216. В первой скобке стоит 6.',
      '36 is 6², not the cube: 6³ = 216. The first bracket holds 6.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "Ishoralar qarama-qarshi bo'ladi: birinchi qavsda minus, to'liqsizda plyus.",
      'Знаки противоположны: в первой скобке минус, в неполном плюс.',
      'The signs are opposite: minus in the first bracket, plus inside.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Javob ikki qavsdan iborat.",
      'Ответ состоит из двух скобок.',
      'The answer has two brackets.') },
  ],
  wrongText: L(
    "216 ni uchta teng ko'paytuvchiga ajratib ko'ring.",
    'Разложи 216 на три равных множителя.',
    'Split 216 into three equal factors.'),
};

export default function D31_08(props) { return <BuildLine data={DATA} {...props} />; }
