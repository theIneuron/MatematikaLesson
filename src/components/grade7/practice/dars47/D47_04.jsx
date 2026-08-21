// Dars47 · Amaliyot 04 — Ikki qadam · 🟡 · chain · tag: pyth_chain
// Mexanika: kit.jsx -> SlotsBank (ikki qator). Raskladka: 4-o'rin.
// Katetlar 9 va 12: c² = 81 + 144 = 225, c = 15.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'pyth_chain', level: '🟡',
  eyebrow: L('Ikki qadam', 'Два шага', 'Two steps'),
  setup: L(
    "Birinchi qadamda kvadratlar yig'indisi topiladi, ikkinchisida undan ildiz olinadi. Ikki qadamni aralashtirmaslik kerak.",
    'На первом шаге находится сумма квадратов, на втором из неё извлекается корень. Шаги нельзя смешивать.',
    'Step one gives the sum of squares, step two takes its root. Do not mix them.'),
  given: [['katetlar', '9', 'va', '12']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  rows: [
    [{ t: ['c²', '='] }, { slot: 0 }],
    [{ t: ['c', '='] }, { slot: 1 }],
  ],
  cards: ['225', '15', '21', '441'],
  answer: ['225', '15'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 81 + 144 = 225, keyin c = 15, chunki 15² = 225.",
    'Верно. 81 + 144 = 225, потом c = 15, ведь 15² = 225.',
    'Correct. 81 + 144 = 225, then c = 15 since 15² = 225.'),
  wrongs: [
    { when: (s) => s.slots[1] === '21', text: L(
      "21 bu 9 + 12. Gipotenuza kvadratlar yig'indisidan ildiz olish bilan topiladi: 15.",
      '21 это 9 + 12. Гипотенуза находится извлечением корня из суммы квадратов: 15.',
      '21 is 9 + 12. The hypotenuse comes from the root of the sum: 15.') },
    { when: (s) => s.slots[0] === '441', text: L(
      "441 bu 21². Bizda esa 81 + 144 = 225.",
      '441 это 21². А у нас 81 + 144 = 225.',
      '441 is 21². Ours is 81 + 144 = 225.') },
  ],
  wrongText: L(
    "9² va 12² ni qo'shing, keyin natijaning ildizini oling.",
    'Сложи 9² и 12², потом извлеки корень из результата.',
    'Add 9² and 12², then take the root.'),
};

export default function D47_04(props) { return <SlotsBank data={DATA} {...props} />; }
