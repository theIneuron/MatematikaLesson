// Dars43 · Amaliyot 08 — Teng yonli va perimetr · 🔴 · build · tag: eq_isosceles_p
// Mexanika: kit.jsx -> BuildLine. Raskladka: 8-o'rin.
// Teng yonli uchburchak, P = 32, asos 12 -> yon tomon (32 − 12) : 2 = 10.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'eq_isosceles_p', level: '🔴',
  eyebrow: L('Yon tomon', 'Боковая сторона', 'The leg'),
  setup: L(
    "Teng yonli uchburchakda ikki yon tomon teng. Perimetrdan asosni ayirsak, qolgani ikki teng tomonga bo'linadi.",
    'В равнобедренном треугольнике две боковые стороны равны. Вычтя основание из периметра, остаток делим на две равные стороны.',
    'An isosceles triangle has two equal legs. Take the base from the perimeter and split the rest in two.'),
  given: [['P', '=', '32'], ['asos', '=', '12']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  cards: [
    { id: 'a', label: '32 − 12 = 20' },
    { id: 'b', label: '20 : 2 = 10' },
    { id: 'c', label: '32 − 12 = 20' },
    { id: 'd', label: '20' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Ikki qadamni qo'ying", 'Поставь два шага', 'Place the two steps'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 32 − 12 = 20 -- bu ikki yon tomon birga. Bittasi 20 : 2 = 10.",
    'Верно. 32 − 12 = 20 — это две боковые вместе. Одна равна 20 : 2 = 10.',
    'Correct. 32 − 12 = 20 covers both legs. One is 20 : 2 = 10.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "20 bu IKKI yon tomonning yig'indisi. Bitta tomon uning yarmi: 10.",
      '20 это сумма ДВУХ боковых сторон. Одна сторона это половина: 10.',
      '20 is the sum of BOTH legs. One leg is half of that: 10.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Ikki qadam kerak: ayirish va ikkiga bo'lish.",
      'Нужны два шага: вычитание и деление на два.',
      'Two steps: subtract, then halve.') },
  ],
  wrongText: L(
    "Perimetrdan asosni ayirsangiz nechta tomon qoladi?",
    'Сколько сторон останется, если вычесть основание из периметра?',
    'How many sides remain when the base is taken from the perimeter?'),
};

export default function D43_08(props) { return <BuildLine data={DATA} {...props} />; }
