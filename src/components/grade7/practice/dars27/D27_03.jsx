// Dars27 · Amaliyot 03 — Ochish, keyin tekshirish · 🟢 · chain · tag: cube_chain
// Mexanika: kit.jsx -> SlotsBank (ikki qator). Raskladka: 3-o'rin.
// 1-qator: (m + 5)³ = m³ + 15m² va +75m + 125
// 2-qator: m = 1 bo'lganda 1 + 15 + 75 + 125 = 216 = 6³.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'cube_chain', level: '🟢',
  eyebrow: L('Son bilan tekshirish', 'Проверка числом', 'Checking with a number'),
  setup: L(
    "Kubni ochib, keyin son qo'yib tekshirish mumkin: m = 1 bo'lganda ikki tomon bir xil chiqishi kerak.",
    'Куб можно раскрыть, а потом проверить числом: при m = 1 обе части должны совпасть.',
    'Expand the cube, then check with a number: at m = 1 both sides must match.'),
  rows: [
    [{ t: ['(m', '+', '5)³', '='] }, { slot: 0 }, { slot: 1 }],
    [{ t: ['m', '=', '1', '→'] }, { slot: 2 }],
  ],
  cards: ['m³ + 15m²', '+75m + 125', '216', 'm³ + 5m²', '+25m + 125', '146'],
  answer: ['m³ + 15m²', '+75m + 125', '216'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 3 · m² · 5 = 15m², 3 · m · 25 = 75m, 5³ = 125. m = 1 bo'lganda 1 + 15 + 75 + 125 = 216, va 6³ = 216.",
    'Верно. 3 · m² · 5 = 15m², 3 · m · 25 = 75m, 5³ = 125. При m = 1 выходит 1 + 15 + 75 + 125 = 216, и 6³ = 216.',
    'Correct. 3 · m² · 5 = 15m², 3 · m · 25 = 75m, 5³ = 125. At m = 1 we get 216, and 6³ = 216.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'm³ + 5m²', text: L(
      "Ikkinchi hadda uchlik yo'q: 3 · m² · 5 = 15m².",
      'Во втором члене нет тройки: 3 · m² · 5 = 15m².',
      'The second term misses the three: 3 · m² · 5 = 15m².') },
    { when: (s) => s.slots[1] === '+25m + 125', text: L(
      "Uchinchi hadda uchlik yo'q: 3 · m · 5² = 75m.",
      'В третьем члене нет тройки: 3 · m · 5² = 75m.',
      'The third term misses the three: 3 · m · 5² = 75m.') },
    { when: (s) => s.slots[2] === '146', text: L(
      "m = 1 bo'lganda to'rt hadni ham qo'shing: 1 + 15 + 75 + 125 = 216.",
      'При m = 1 сложи все четыре члена: 1 + 15 + 75 + 125 = 216.',
      'At m = 1 add all four terms: 1 + 15 + 75 + 125 = 216.') },
  ],
  wrongText: L(
    "O'rtadagi ikki hadning koeffitsiyenti uch. Keyin m = 1 qo'yib to'rt hadni qo'shing.",
    'У двух средних членов коэффициент три. Потом подставь m = 1 и сложи четыре члена.',
    'The two middle coefficients are three. Then put m = 1 and add the four terms.'),
};

export default function D27_03(props) { return <SlotsBank data={DATA} {...props} />; }
