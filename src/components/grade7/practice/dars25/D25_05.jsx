// Dars25 · Amaliyot 05 — Ikki harf · 🟡 · slots · tag: sq_two_letters
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 5-o'rin.
// (5p + 2q)² = 25p² + 20pq + 4q². O'rta had 2 · 5p · 2q = 20pq.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'sq_two_letters', level: '🟡',
  eyebrow: L('Ikki harf', 'Две буквы', 'Two letters'),
  setup: L(
    "Ikki harf bo'lganda ham qoida o'sha: chetdagi hadlar kvadrat, o'rtadagisi ikki karra ko'paytma. Koeffitsiyentlar ham kvadratga ko'tariladi.",
    'С двумя буквами правило то же: крайние члены квадраты, средний двойное произведение. Коэффициенты тоже возводятся в квадрат.',
    'With two letters the rule holds: the outer terms are squares, the middle is twice the product. Coefficients are squared too.'),
  rows: [
    [{ t: ['(5p', '+', '2q)²', '='] }, { slot: 0 }, { slot: 1 }, { slot: 2 }],
  ],
  cards: ['25p²', '+20pq', '+4q²', '+10pq', '5p²', '+2q²'],
  answer: ['25p²', '+20pq', '+4q²'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. (5p)² = 25p², 2 · 5p · 2q = 20pq, (2q)² = 4q².",
    'Верно. (5p)² = 25p², 2 · 5p · 2q = 20pq, (2q)² = 4q².',
    'Correct. (5p)² = 25p², 2 · 5p · 2q = 20pq, (2q)² = 4q².'),
  wrongs: [
    { when: (s) => s.slots[1] === '+10pq', text: L(
      "10pq da ikki karra yo'q: 5 · 2 = 10, keyin yana 2 ga ko'paytiriladi -- 20pq.",
      'В 10pq нет двойки: 5 · 2 = 10, потом ещё умножается на 2 — выходит 20pq.',
      '10pq misses the doubling: 5 · 2 = 10, then times 2 again — 20pq.') },
    { when: (s) => s.slots[0] === '5p²', text: L(
      "(5p)² da koeffitsiyent ham kvadratga ko'tariladi: 5² = 25.",
      'В (5p)² коэффициент тоже возводится в квадрат: 5² = 25.',
      'In (5p)² the coefficient is squared too: 5² = 25.') },
    { when: (s) => s.slots[2] === '+2q²', text: L(
      "(2q)² da 2 ham kvadratga ko'tariladi: 4q².",
      'В (2q)² двойка тоже возводится в квадрат: 4q².',
      'In (2q)² the two is squared as well: 4q².') },
  ],
  wrongText: L(
    "Uch hadni alohida hisoblang: (5p)², 2 · 5p · 2q, (2q)².",
    'Посчитай три члена по отдельности: (5p)², 2 · 5p · 2q, (2q)².',
    'Work out the three terms separately: (5p)², 2 · 5p · 2q, (2q)².'),
};

export default function D25_05(props) { return <SlotsBank data={DATA} {...props} />; }
