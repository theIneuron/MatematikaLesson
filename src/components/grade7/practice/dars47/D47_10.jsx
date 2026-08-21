// Dars47 · Amaliyot 10 — Katta sonlar bilan · 🔴 · chain · tag: pyth_big
// Mexanika: kit.jsx -> SlotsBank (ikki qator). Raskladka: 10-o'rin.
// Katetlar 20 va 21: c² = 400 + 441 = 841, c = 29.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'pyth_big', level: '🔴',
  eyebrow: L('Katta sonlar', 'Большие числа', 'Bigger numbers'),
  setup: L(
    "Katetlar yaqin va katta. Kvadratlar to'rt xonali chiqadi, lekin qoida o'zgarmaydi.",
    'Катеты близкие и большие. Квадраты выходят трёхзначными, но правило то же.',
    'The legs are close and large. The squares grow, but the rule is unchanged.'),
  given: [['katetlar', '20', 'va', '21']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  rows: [
    [{ t: ['c²', '='] }, { slot: 0 }],
    [{ t: ['c', '='] }, { slot: 1 }],
  ],
  cards: ['841', '29', '41', '1681'],
  answer: ['841', '29'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 400 + 441 = 841, keyin c = 29, chunki 29² = 841.",
    'Верно. 400 + 441 = 841, потом c = 29, ведь 29² = 841.',
    'Correct. 400 + 441 = 841, then c = 29 since 29² = 841.'),
  wrongs: [
    { when: (s) => s.slots[1] === '41', text: L(
      "41 bu 20 + 21. Gipotenuza katetlar yig'indisi emas: 841 dan ildiz 29.",
      '41 это 20 + 21. Гипотенуза не сумма катетов: корень из 841 равен 29.',
      '41 is 20 + 21. The hypotenuse is not the sum: the root of 841 is 29.') },
    { when: (s) => s.slots[0] === '1681', text: L(
      "1681 bu 41². Kvadratlar yig'indisi esa 400 + 441 = 841.",
      '1681 это 41². А сумма квадратов 400 + 441 = 841.',
      '1681 is 41². The sum of squares is 400 + 441 = 841.') },
  ],
  wrongText: L(
    "20² va 21² ni qo'shing, keyin natijaning ildizini toping.",
    'Сложи 20² и 21², потом найди корень результата.',
    'Add 20² and 21², then find the root.'),
};

export default function D47_10(props) { return <SlotsBank data={DATA} {...props} />; }
