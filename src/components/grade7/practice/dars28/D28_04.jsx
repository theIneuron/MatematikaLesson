// Dars28 · Amaliyot 04 — 98² og'zaki · 🟡 · slots · tag: formula_mental_98
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 4-o'rin.
// 98² = (100 − 2)² = 10000 − 400 + 4 = 9604.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'formula_mental_98', level: '🟡',
  eyebrow: L('Ayirma orqali', 'Через разность', 'Through a difference'),
  setup: L(
    "98 ni 100 − 2 deb yozish qulay: yuzning kvadrati oson. O'rta had manfiy, oxirgisi esa musbat.",
    'Удобно записать 98 как 100 − 2: квадрат сотни считается легко. Средний член отрицательный, последний положительный.',
    'Writing 98 as 100 − 2 is handy: the square of a hundred is easy. The middle term is negative, the last positive.'),
  rows: [
    [{ t: ['98²', '=', '(100', '−', '2)²', '='] }, { slot: 0 }, { slot: 1 }, { slot: 2 }],
  ],
  cards: ['10000', '−400', '+4', '−200', '+2', '−4'],
  answer: ['10000', '−400', '+4'],
  ask: L("Kartani bosing, keyin bo'sh katakni bosing.", 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 100² = 10000, o'rta had −2 · 100 · 2 = −400, oxirida (−2)² = +4. Yig'indisi 9604.",
    'Верно. 100² = 10000, средний член −2 · 100 · 2 = −400, в конце (−2)² = +4. Сумма 9604.',
    'Correct. 100² = 10000, the middle term −2 · 100 · 2 = −400, then (−2)² = +4. The sum is 9604.'),
  wrongs: [
    { when: (s) => s.slots[1] === '−200', text: L(
      "−200 da ikki karra yo'q: 2 · 100 · 2 = 400.",
      'В −200 нет двойки: 2 · 100 · 2 = 400.',
      '−200 misses the doubling: 2 · 100 · 2 = 400.') },
    { when: (s) => s.slots[2] === '−4', text: L(
      "Oxirgi had kvadrat: (−2)² = +4, musbat.",
      'Последний член это квадрат: (−2)² = +4, положительный.',
      'The last term is a square: (−2)² = +4, positive.') },
    { when: (s) => s.slots[2] === '+2', text: L(
      "+2 bu ikki karra emas, oxirgi had kvadrat bo'ladi: 4.",
      '+2 это не удвоение; последний член это квадрат: 4.',
      '+2 is not the doubling; the last term is a square: 4.') },
  ],
  wrongText: L(
    "Uch hadni alohida hisoblang: 100², 2 · 100 · 2 va 2².",
    'Посчитай три члена по отдельности: 100², 2 · 100 · 2 и 2².',
    'Work out three terms separately: 100², 2 · 100 · 2 and 2².'),
};

export default function D28_04(props) { return <SlotsBank data={DATA} {...props} />; }
