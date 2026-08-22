// Dars42 · Amaliyot 06 — Uchinchi tomon · 🟡 · build · tag: eq_third_side
// Mexanika: kit.jsx -> BuildLine. Raskladka: 6-o'rin `build`.
// Teng uchburchaklarning perimetri teng: P = 30, ikki tomon 9 va 11 -> uchinchisi 10, ikkinchi uchburchakda ham 10.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'eq_third_side',
  level: '🟡',
  eyebrow: L(
    'Uchinchi tomon',
    'Третья сторона',
    'The third side'),
  setup: L(
    "Uchburchaklar teng, ya'ni perimetrlari ham teng. Uchinchi tomonni toping va ikkinchi uchburchakdagi mos tomonni aytib bering.",
    'Треугольники равны, значит равны и периметры. Найди третью сторону и назови соответственную во втором треугольнике.',
    'The triangles are equal, so are their perimeters. Find the third side and name the matching one in the second triangle.'),
  given: [['P = 30', ',', '9', ',', '11']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [
    { id: 'a', label: 'BC = 10' },
    { id: 'b', label: 'B₁C₁ = 10' },
    { id: 'c', label: 'BC = 20' },
    { id: 'd', label: 'B₁C₁ = 30' },
  ],
  answerSeq: ['a', 'b'],
  fieldH: 44,
  ask: L(
    "Kartani bosish uni chiziqqa qo'yadi.",
    'Нажатие на карточку ставит её в строку.',
    'Tapping a card puts it in the line.'),
  empty: L(
    'Kartalarni bosib javobni tuzing',
    'Нажимай карточки и собери ответ',
    'Tap the cards to build the answer'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. 30 − 9 − 11 = 10, va mos tomon ham 10 ga teng.",
    'Верно. 30 − 9 − 11 = 10, и соответственная сторона тоже 10.',
    'Correct. 30 − 9 − 11 = 10, and the matching side is 10 as well.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        "20 bu 9 + 11, ya'ni ikki tomonning yig'indisi. Uchinchisi perimetrdan ayirish bilan chiqadi.",
        '20 это 9 + 11, сумма двух сторон. Третья получается вычитанием из периметра.',
        '20 is 9 + 11, the sum of two sides. The third comes from subtracting from the perimeter.'),
    },
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        '30 bu butun perimetr, bitta tomon emas.',
        '30 это весь периметр, а не одна сторона.',
        '30 is the whole perimeter, not one side.'),
    },
    {
      when: (s) => s.seq.length < 2,
      text: L(
        'Ikki karta kerak.',
        'Нужны две карточки.',
        'Two cards are needed.'),
    },
  ],
  wrongText: L(
    "Perimetrdan ikki ma'lum tomonni ayiring, keyin moslikni yozing.",
    'Вычти из периметра две известные стороны, потом запиши соответствие.',
    'Subtract the two known sides from the perimeter, then write the correspondence.'),
};

export default function D42_06(props) { return <BuildLine data={DATA} {...props} />; }
