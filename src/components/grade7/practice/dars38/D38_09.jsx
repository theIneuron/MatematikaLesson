// Dars38 · Amaliyot 09 — Ikki qadamli zanjir · 🔴 · chain · tag: sys_chain
// Mexanika: kit.jsx -> SlotsBank (ikki qator). Raskladka: 9-o'rin.
// y = 2x − 3 va y = 5: 1-qator x = 4; 2-qator yechim (4; 5).
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'sys_chain', level: '🔴',
  eyebrow: L('Zanjir', 'Цепочка', 'A chain'),
  setup: L(
    "Birinchi qatorda x topiladi, ikkinchisida esa javob juftlik qilib yoziladi. Ikkinchi qadamni tashlab ketmaslik kerak.",
    'В первой строке находится x, во второй ответ записывается парой. Второй шаг забывать нельзя.',
    'The first row finds x, the second writes the pair. Do not skip the second step.'),
  given: [['y', '=', '2x', '−', '3'], ['y', '=', '5']],
  givenLabel: L('Sistema:', 'Система:', 'The system:'),
  rows: [
    [{ t: ['x', '='] }, { slot: 0 }],
    [{ t: ['yechim', '='] }, { slot: 1 }],
  ],
  cards: ['4', '(4; 5)', '1', '(5; 4)'],
  answer: ['4', '(4; 5)'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 2x − 3 = 5 -> 2x = 8 -> x = 4. Yechim (4; 5).",
    'Верно. 2x − 3 = 5 → 2x = 8 → x = 4. Решение (4; 5).',
    'Correct. 2x − 3 = 5 → 2x = 8 → x = 4. The solution is (4; 5).'),
  wrongs: [
    { when: (s) => s.slots[0] === '1', text: L(
      "1 emas: 2x = 5 + 3 = 8, ya'ni x = 4. Ko'chirishda ishora almashadi.",
      'Не 1: 2x = 5 + 3 = 8, значит x = 4. При переносе знак меняется.',
      'Not 1: 2x = 5 + 3 = 8, so x = 4. Moving flips the sign.') },
    { when: (s) => s.slots[1] === '(5; 4)', text: L(
      "Tartib buzilgan: birinchi o'rinda x = 4, ikkinchisida y = 5.",
      'Порядок нарушен: на первом месте x = 4, на втором y = 5.',
      'The order is wrong: x = 4 first, then y = 5.') },
  ],
  wrongText: L(
    "Birinchi qatorda tenglamani yeching, keyin javobni juftlik qilib yozing.",
    'В первой строке реши уравнение, потом запиши ответ парой.',
    'Solve the equation in the first row, then write the pair.'),
};

export default function D38_09(props) { return <SlotsBank data={DATA} {...props} />; }
