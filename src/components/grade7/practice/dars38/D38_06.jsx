// Dars38 · Amaliyot 06 — Ikki tenglamaga qo'yish · 🟡 · slots · tag: sys_slots
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 6-o'rin.
// (3; 2): x + y = 5 va x − y = 1.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'sys_slots', level: '🟡',
  eyebrow: L('Ikki natija', 'Два результата', 'Two results'),
  setup: L(
    "Bir juftlik ikki tenglamaga qo'yiladi. Yig'indi va ayirma har xil natija beradi -- ikkovini alohida hisoblang.",
    'Одна пара подставляется в два уравнения. Сумма и разность дают разные результаты — считай их отдельно.',
    'One pair goes into two equations. The sum and the difference differ — work them out separately.'),
  given: [['(3;', '2)']],
  givenLabel: L('Juftlik:', 'Пара:', 'The pair:'),
  rows: [
    [{ t: ['x', '+', 'y', '='] }, { slot: 0 }, { t: ['x', '−', 'y', '='] }, { slot: 1 }],
  ],
  cards: ['5', '1', '6', '−1'],
  answer: ['5', '1'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 3 + 2 = 5 va 3 − 2 = 1.",
    'Верно. 3 + 2 = 5 и 3 − 2 = 1.',
    'Correct. 3 + 2 = 5 and 3 − 2 = 1.'),
  wrongs: [
    { when: (s) => s.slots[0] === '6', text: L(
      "6 bu 3 · 2. Bizda qo'shish turibdi: 3 + 2 = 5.",
      '6 это 3 · 2. У нас сложение: 3 + 2 = 5.',
      '6 is 3 · 2. This is an addition: 3 + 2 = 5.') },
    { when: (s) => s.slots[1] === '−1', text: L(
      "Tartibni tekshiring: x − y = 3 − 2 = 1, y − x emas.",
      'Проверь порядок: x − y = 3 − 2 = 1, а не y − x.',
      'Check the order: x − y = 3 − 2 = 1, not y − x.') },
  ],
  wrongText: L(
    "Juftlikda x = 3, y = 2. Ikki amalni alohida bajaring.",
    'В паре x = 3, y = 2. Выполни два действия по отдельности.',
    'In the pair x = 3 and y = 2. Do the two operations separately.'),
};

export default function D38_06(props) { return <SlotsBank data={DATA} {...props} />; }
