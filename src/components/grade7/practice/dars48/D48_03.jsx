// Dars48 · Amaliyot 03 — Teng yonli va yig'indi · 🟢 · slots · tag: rev_iso_sum
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 3-o'rin `slots`.
// Uchidagi burchak 40° -> asosdagi burchaklar (180 − 40) : 2 = 70° va 70°.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rev_iso_sum',
  level: '🟢',
  eyebrow: L(
    'Ikki fakt birga',
    'Два факта вместе',
    'Two facts at once'),
  setup: L(
    "Ikki fakt kerak: asosdagi burchaklar teng va uch burchakning yig'indisi 180.",
    'Нужны два факта: углы при основании равны и сумма трёх углов 180.',
    'Two facts are needed: the base angles are equal and the three angles add to 180.'),
  given: [[L('uchidagi burchak = 40°', 'угол при вершине = 40°', 'apex angle = 40°')]],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  rows: [
    [
      { t: [L('birinchi', 'первая', 'the first'), L('asos', 'основание', 'base'), L('burchagi', 'угол', 'angle'), '='] },
      { slot: 0 },
      { t: [L('ikkinchisi', 'вторая', 'the second'), '='] },
      { slot: 1 },
    ],
  ],
  cards: ['70°', L('70° ham', 'ещё 70°', '70° too'), '140°', '50°'],
  answer: ['70°', '70° ham'],
  ask: L(
    'Kartani bosing, keyin uyani bosing.',
    'Нажми карточку, затем клетку.',
    'Tap a card, then tap a cell.'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. 180 − 40 = 140, bu ikki teng burchakka bo'linadi: 70 va 70.",
    'Верно. 180 − 40 = 140, это делится на два равных угла: 70 и 70.',
    'Correct. 180 − 40 = 140, split between two equal angles: 70 and 70.'),
  wrongs: [
    {
      when: (s) => s.slots[0] === '140°',
      text: L(
        "140 bu IKKI burchakning yig'indisi. Ular teng, ya'ni har biri 70.",
        '140 это сумма ДВУХ углов. Они равны, значит каждый 70.',
        '140 is the sum of BOTH angles. They are equal, so each is 70.'),
    },
    {
      when: (s) => s.slots[0] === '50°' || s.slots[1] === '50°',
      text: L(
        '50 bu 90 − 40. Bu yerda 90 emas, 180 dan ayiriladi.',
        '50 это 90 − 40. Здесь вычитают из 180, а не из 90.',
        '50 is 90 − 40. Here the subtraction starts from 180, not 90.'),
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
    "180 dan uchidagi burchakni ayiring, qolganini ikkiga bo'ling.",
    'Вычти из 180 угол при вершине, остаток раздели на два.',
    'Subtract the apex angle from 180 and halve the rest.'),
};

export default function D48_03(props) { return <SlotsBank data={DATA} {...props} />; }
