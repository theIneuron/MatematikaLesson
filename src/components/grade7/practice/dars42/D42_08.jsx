// Dars42 · Amaliyot 08 — Perimetrdan mos tomon · 🔴 · chain · tag: eq_chain
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 8-o'rin `chain`.
// P = 32, ikki tomon 9 va 12 -> uchinchisi 11; teng uchburchakda mos tomon ham 11.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'eq_chain',
  level: '🔴',
  eyebrow: L(
    'Ikki qadam',
    'Два шага',
    'Two steps'),
  setup: L(
    'Birinchi qatorda uchinchi tomonni hisoblang, ikkinchi qatorda esa ikkinchi uchburchakdagi mos tomonni yozing.',
    'В первой строке вычисли третью сторону, во второй запиши соответственную сторону второго треугольника.',
    'Compute the third side in the first row, then give the matching side of the second triangle.'),
  given: [['P = 32', ',', '9', ',', '12']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  rows: [[{ t: [L('uchinchi', 'третья', 'the third'), L('tomon', 'сторона', 'side'), '='] }, { slot: 0 }], [{ t: [L('mos', 'соответственный', 'matching'), L('tomon', 'сторона', 'side'), '='] }, { slot: 1 }]],
  cards: ['11', '21', '32', L('11 ham', 'ещё 11', '11 too')],
  answer: ['11', '11 ham'],
  ask: L(
    "Kartani bosing, keyin bo'sh katakni bosing.",
    'Нажми карточку, затем клетку.',
    'Tap a card, then tap a cell.'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. 32 − 9 − 12 = 11. Uchburchaklar teng, ya'ni mos tomon ham 11.",
    'Верно. 32 − 9 − 12 = 11. Треугольники равны, значит соответственная сторона тоже 11.',
    'Correct. 32 − 9 − 12 = 11. The triangles are equal, so the matching side is 11 too.'),
  wrongs: [
    {
      when: (s) => s.slots[0] === '21',
      text: L(
        '21 bu 9 + 12. Uchinchi tomon perimetrdan ayirish bilan topiladi.',
        '21 это 9 + 12. Третья сторона находится вычитанием из периметра.',
        '21 is 9 + 12. The third side comes from subtracting from the perimeter.'),
    },
    {
      when: (s) => s.slots[1] === '32',
      text: L(
        "32 bu perimetr. Ikkinchi qatorda TOMON so'raladi.",
        '32 это периметр. Во второй строке спрашивают СТОРОНУ.',
        '32 is the perimeter. The second row asks for a SIDE.'),
    },
    {
      when: (s) => s.slots.indexOf(null) !== -1,
      text: L(
        "Hamma bo'sh katak to'ldirilishi kerak.",
        'Надо заполнить все клетки.',
        'Every cell must be filled.'),
    },
  ],
  wrongText: L(
    "Perimetrdan ikki tomonni ayiring. Teng uchburchakda mos tomon o'zgarmaydi.",
    'Вычти из периметра две стороны. В равном треугольнике соответственная сторона та же.',
    'Subtract the two sides from the perimeter. In an equal triangle the matching side is unchanged.'),
};

export default function D42_08(props) { return <SlotsBank data={DATA} {...props} />; }
