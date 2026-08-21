// Dars47 · Amaliyot 01 — Gipotenuzani topish · 🟢 · slots · tag: pyth_slots
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 47-dars, 1-o'rin.
// Katetlar 6 va 8: 36 + 64 = 100, gipotenuza 10.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'pyth_slots', level: '🟢',
  eyebrow: L('Pifagor teoremasi', 'Теорема Пифагора', 'The Pythagorean theorem'),
  setup: L(
    "Gipotenuzaning kvadrati katetlar kvadratlarining yig'indisiga teng. Avval kvadratlar qo'shiladi, keyin ildiz olinadi.",
    'Квадрат гипотенузы равен сумме квадратов катетов. Сначала складываются квадраты, потом извлекается корень.',
    'The square of the hypotenuse equals the sum of the legs squared. Add the squares first, then take the root.'),
  given: [['katetlar', '6', 'va', '8']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  rows: [
    [{ t: ['36', '+', '64', '='] }, { slot: 0 }, { t: ['gipotenuza', '='] }, { slot: 1 }],
  ],
  cards: ['100', '10', '14', '50'],
  answer: ['100', '10'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 6² + 8² = 36 + 64 = 100, gipotenuza esa 10, chunki 10² = 100.",
    'Верно. 6² + 8² = 36 + 64 = 100, а гипотенуза 10, ведь 10² = 100.',
    'Correct. 6² + 8² = 36 + 64 = 100, and the hypotenuse is 10 since 10² = 100.'),
  wrongs: [
    { when: (s) => s.slots[1] === '14', text: L(
      "14 bu 6 + 8. Gipotenuza katetlar yig'indisi emas: kvadratlar qo'shiladi, keyin ildiz olinadi.",
      '14 это 6 + 8. Гипотенуза не сумма катетов: складываются квадраты, потом берётся корень.',
      '14 is 6 + 8. The hypotenuse is not the sum of the legs: squares add, then a root.') },
    { when: (s) => s.slots[0] === '50', text: L(
      "50 emas: 36 + 64 = 100. Kvadratlarni qayta qo'shing.",
      'Не 50: 36 + 64 = 100. Пересложи квадраты.',
      'Not 50: 36 + 64 = 100. Add the squares again.') },
  ],
  wrongText: L(
    "6² va 8² nechchi? Ularni qo'shib, natijaning ildizini oling.",
    'Чему равны 6² и 8²? Сложи их и извлеки корень.',
    'What are 6² and 8²? Add them and take the root.'),
};

export default function D47_01(props) { return <SlotsBank data={DATA} {...props} />; }
