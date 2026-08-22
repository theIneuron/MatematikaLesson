// Dars48 · Amaliyot 07 — Tenglik va perimetr · 🟡 · slots · tag: rev_eq_perimeter
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 7-o'rin `slots`.
// Teng uchburchaklar, P = 28, ikki tomon 8 va 9 -> uchinchisi 11; mos tomon ham 11.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rev_eq_perimeter',
  level: '🟡',
  eyebrow: L(
    'Tenglik va perimetr',
    'Равенство и периметр',
    'Equality and perimeter'),
  setup: L(
    'Uchburchaklar teng. Uchinchi tomonni toping va ikkinchi uchburchakdagi mos tomonni yozing.',
    'Треугольники равны. Найди третью сторону и запиши соответственную во втором треугольнике.',
    'The triangles are equal. Find the third side and give the matching one in the second triangle.'),
  given: [['P = 28', ',', '8', ',', '9']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  rows: [[{ t: ['uchinchi', '='] }, { slot: 0 }, { t: ['mos', 'tomon', '='] }, { slot: 1 }]],
  cards: ['11', '11 ham', '17', '28'],
  answer: ['11', '11 ham'],
  ask: L(
    'Kartani bosing, keyin uyani bosing.',
    'Нажми карточку, затем клетку.',
    'Tap a card, then tap a cell.'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. 28 − 8 − 9 = 11, va teng uchburchakda mos tomon ham 11.",
    'Верно. 28 − 8 − 9 = 11, и в равном треугольнике соответственная сторона тоже 11.',
    'Correct. 28 − 8 − 9 = 11, and the matching side of the equal triangle is 11 too.'),
  wrongs: [
    {
      when: (s) => s.slots[0] === '17',
      text: L(
        '17 bu 8 + 9. Uchinchi tomon perimetrdan ayirish bilan chiqadi.',
        '17 это 8 + 9. Третья сторона получается вычитанием из периметра.',
        '17 is 8 + 9. The third side comes from subtracting from the perimeter.'),
    },
    {
      when: (s) => s.slots[1] === '28',
      text: L(
        '28 bu perimetr, tomon emas.',
        '28 это периметр, а не сторона.',
        '28 is the perimeter, not a side.'),
    },
    {
      when: (s) => s.slots.indexOf(null) !== -1,
      text: L(
        "Hamma uya to'ldirilishi kerak.",
        'Надо заполнить все клетки.',
        'Every cell must be filled.'),
    },
  ],
  wrongText: L(
    "Perimetrdan ikki tomonni ayiring. Teng uchburchakda mos tomon o'sha son.",
    'Вычти из периметра две стороны. В равном треугольнике соответственная сторона та же.',
    'Subtract the two sides from the perimeter. The matching side keeps that value.'),
};

export default function D48_07(props) { return <SlotsBank data={DATA} {...props} />; }
