// Dars25 · Amaliyot 10 — Ochish, keyin tekshirish · 🔴 · chain · tag: sq_chain
// Mexanika: kit.jsx -> SlotsBank (ikki qator). Raskladka: 10-o'rin.
// 1-qator: (2x + 5)² = 4x² va +20x + 25
// 2-qator: x = 1 bo'lganda 4 + 20 + 25 = 49; tekshirish (2 + 5)² = 49.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'sq_chain', level: '🔴',
  eyebrow: L('Son bilan tekshirish', 'Проверка числом', 'Checking with a number'),
  setup: L(
    "Formula to'g'ri ishlaganini son bilan tekshirish mumkin: ikki tomonga bir xil son qo'yiladi va natijalar solishtiriladi.",
    'Правильность формулы можно проверить числом: в обе части подставляется одно значение и результаты сравниваются.',
    'A formula can be checked with a number: put the same value into both sides and compare.'),
  rows: [
    [{ t: ['(2x', '+', '5)²', '='] }, { slot: 0 }, { slot: 1 }],
    [{ t: ['x', '=', '1', '→'] }, { slot: 2 }],
  ],
  cards: ['4x²', '+20x + 25', '49', '2x²', '+10x + 25', '29'],
  answer: ['4x²', '+20x + 25', '49'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 4x² + 20x + 25; x = 1 bo'lganda 4 + 20 + 25 = 49. Asl yozuvda ham (2 + 5)² = 49.",
    'Верно. 4x² + 20x + 25; при x = 1 выходит 4 + 20 + 25 = 49. В исходной записи тоже (2 + 5)² = 49.',
    'Correct. 4x² + 20x + 25; with x = 1 it gives 4 + 20 + 25 = 49. The original also gives (2 + 5)² = 49.'),
  wrongs: [
    { when: (s) => s.slots[0] === '2x²', text: L(
      "(2x)² da koeffitsiyent ham kvadratga ko'tariladi: 2² = 4, ya'ni 4x².",
      'В (2x)² коэффициент тоже возводится в квадрат: 2² = 4, значит 4x².',
      'In (2x)² the coefficient is squared too: 2² = 4, giving 4x².') },
    { when: (s) => s.slots[1] === '+10x + 25', text: L(
      "O'rta hadda ikki karra yo'q: 2 · 2x · 5 = 20x.",
      'В среднем члене нет двойки: 2 · 2x · 5 = 20x.',
      'The middle term misses the doubling: 2 · 2x · 5 = 20x.') },
    { when: (s) => s.slots[2] === '29', text: L(
      "x = 1 bo'lganda uch hadni ham qo'shing: 4 + 20 + 25 = 49.",
      'При x = 1 сложи все три члена: 4 + 20 + 25 = 49.',
      'With x = 1 add all three terms: 4 + 20 + 25 = 49.') },
  ],
  wrongText: L(
    "Birinchi qatorda formulani qo'llang, keyin x o'rniga bir qo'yib ikki tomonni solishtiring.",
    'В первой строке примени формулу, потом подставь x = 1 и сравни обе части.',
    'Apply the formula in the first row, then put x = 1 and compare both sides.'),
};

export default function D25_10(props) { return <SlotsBank data={DATA} {...props} />; }
