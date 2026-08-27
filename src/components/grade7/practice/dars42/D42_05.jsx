// Dars42 · Amaliyot 05 — Mos elementlar · 🟡 · slots · tag: eq_slots
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 5-o'rin `slots`.
// Teng uchburchaklar: AB = 8 -> A₁B₁ = 8; burchak C = 55° -> burchak C₁ = 55°.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'eq_slots',
  level: '🟡',
  eyebrow: L(
    'Mos elementlar',
    'Соответственные элементы',
    'Matching elements'),
  setup: L(
    "Uchburchaklar teng. Mos elementlarni to'ldiring: tomon tomonga, burchak burchakka.",
    'Треугольники равны. Заполни соответственные элементы: сторона к стороне, угол к углу.',
    'The triangles are equal. Fill in the matching elements: side to side, angle to angle.'),
  given: [['AB = 8', ',', L('burchak C = 55°', 'угол C = 55°', 'angle C = 55°')]],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  rows: [[{ t: ['A₁B₁', '='] }, { slot: 0 }, { t: [L('burchak', 'угол', 'angle'), 'C₁', '='] }, { slot: 1 }]],
  cards: ['8', '55°', '16', '35°'],
  answer: ['8', '55°'],
  ask: L(
    "Kartani bosing, keyin bo'sh katakni bosing.",
    'Нажми карточку, затем клетку.',
    'Tap a card, then tap a cell.'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. Teng uchburchaklarda mos tomonlar va mos burchaklar aynan teng.",
    'Верно. В равных треугольниках соответственные стороны и углы в точности равны.',
    'Correct. In equal triangles matching sides and angles are exactly equal.'),
  wrongs: [
    {
      when: (s) => s.slots[0] === '16',
      text: L(
        "16 bu 8 · 2. Teng uchburchaklar kattalashmaydi: tomon o'sha 8 bo'lib qoladi.",
        '16 это 8 · 2. Равные треугольники не увеличиваются: сторона остаётся 8.',
        '16 is 8 · 2. Equal triangles are not scaled: the side stays 8.'),
    },
    {
      when: (s) => s.slots[1] === '35°',
      text: L(
        "35° bu 90 − 55. Mos burchak aynan 55 gradus bo'ladi.",
        '35° это 90 − 55. Соответственный угол в точности 55 градусов.',
        '35° is 90 − 55. The matching angle is exactly 55 degrees.'),
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
    'Teng degani -- aynan bir xil son. Hech narsani hisoblash kerak emas.',
    'Равные значит в точности те же числа. Ничего вычислять не надо.',
    'Equal means exactly the same numbers. Nothing needs computing.'),
};

export default function D42_05(props) { return <SlotsBank data={DATA} {...props} />; }
