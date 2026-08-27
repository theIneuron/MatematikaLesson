// Dars28 · Amaliyot 06 — Ikki harfli kvadrat · 🟡 · slots · tag: formula_two_letters
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 6-o'rin.
// (5c + 4d)² = 25c² + 40cd + 16d².
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'formula_two_letters', level: '🟡',
  eyebrow: L('Ikki harf', 'Две буквы', 'Two letters'),
  setup: L(
    "Ikki harf va ikki koeffitsiyent: chetdagi hadlarda ikkovi ham kvadratga ko'tariladi, o'rtada esa ikki karra ko'paytma.",
    'Две буквы и два коэффициента: в крайних членах оба возводятся в квадрат, в среднем двойное произведение.',
    'Two letters and two coefficients: both are squared in the outer terms, and the middle is twice the product.'),
  rows: [
    [{ t: ['(5c', '+', '4d)²', '='] }, { slot: 0 }, { slot: 1 }, { slot: 2 }],
  ],
  cards: ['25c²', '+40cd', '+16d²', '+20cd', '5c²', '+4d²'],
  answer: ['25c²', '+40cd', '+16d²'],
  ask: L("Kartani bosing, keyin bo'sh katakni bosing.", 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. (5c)² = 25c², 2 · 5c · 4d = 40cd, (4d)² = 16d².",
    'Верно. (5c)² = 25c², 2 · 5c · 4d = 40cd, (4d)² = 16d².',
    'Correct. (5c)² = 25c², 2 · 5c · 4d = 40cd, (4d)² = 16d².'),
  wrongs: [
    { when: (s) => s.slots[1] === '+20cd', text: L(
      "20cd da ikki karra yo'q: 5 · 4 = 20, keyin yana 2 ga ko'paytiriladi -- 40cd.",
      'В 20cd нет двойки: 5 · 4 = 20, потом ещё умножается на 2 — 40cd.',
      '20cd misses the doubling: 5 · 4 = 20, then times 2 — 40cd.') },
    { when: (s) => s.slots[0] === '5c²', text: L(
      "(5c)² da koeffitsiyent ham kvadratga ko'tariladi: 25c².",
      'В (5c)² коэффициент тоже возводится в квадрат: 25c².',
      'In (5c)² the coefficient is squared too: 25c².') },
    { when: (s) => s.slots[2] === '+4d²', text: L(
      "(4d)² da 4 ham kvadratga ko'tariladi: 16d².",
      'В (4d)² четвёрка тоже возводится в квадрат: 16d².',
      'In (4d)² the four is squared as well: 16d².') },
  ],
  wrongText: L(
    "Uch hadni alohida hisoblang: (5c)², 2 · 5c · 4d, (4d)².",
    'Посчитай три члена по отдельности: (5c)², 2 · 5c · 4d, (4d)².',
    'Work out three terms separately: (5c)², 2 · 5c · 4d, (4d)².'),
};

export default function D28_06(props) { return <SlotsBank data={DATA} {...props} />; }
