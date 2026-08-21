// Dars32 · Amaliyot 02 — Qisqartirish va qiymat · 🟢 · chain · tag: frac_chain
// Mexanika: kit.jsx -> SlotsBank (ikki qator). Raskladka: 2-o'rin.
// 1-qator: (4a + 6) : 2 = 2a + 3
// 2-qator: a = 1 bo'lganda 5; tekshirish (4 + 6) : 2 = 5.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'frac_chain', level: '🟢',
  eyebrow: L('Ikki qadam', 'Два шага', 'Two steps'),
  setup: L(
    "Har had bo'luvchiga bo'linadi, keyin natijaga son qo'yib tekshiriladi. Tekshirish ikki tomonda bir xil son berishi kerak.",
    'Каждый член делится на делитель, потом результат проверяется подстановкой. Обе части должны дать одно число.',
    'Each term is divided, then the result is checked by substitution. Both sides must give the same number.'),
  rows: [
    [{ t: ['(4a', '+', '6)', ':', '2', '='] }, { slot: 0 }, { slot: 1 }],
    [{ t: ['a', '=', '1', '→'] }, { slot: 2 }],
  ],
  cards: ['2a', '+3', '5', '4a', '+6', '10'],
  answer: ['2a', '+3', '5'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 4a : 2 = 2a va 6 : 2 = 3. a = 1 bo'lganda 2 + 3 = 5, asl yozuvda ham (4 + 6) : 2 = 5.",
    'Верно. 4a : 2 = 2a и 6 : 2 = 3. При a = 1 выходит 2 + 3 = 5, и в исходной записи (4 + 6) : 2 = 5.',
    'Correct. 4a : 2 = 2a and 6 : 2 = 3. At a = 1 we get 5, and the original also gives 5.'),
  wrongs: [
    { when: (s) => s.slots[0] === '4a' || s.slots[1] === '+6', text: L(
      "Ikki hadning ham bo'linishi kerak: 4a : 2 = 2a, 6 : 2 = 3. Bitta had qolib ketmasin.",
      'Делиться должны оба члена: 4a : 2 = 2a, 6 : 2 = 3. Ни один не остаётся без деления.',
      'Both terms must be divided: 4a : 2 = 2a and 6 : 2 = 3. Neither stays undivided.') },
    { when: (s) => s.slots[2] === '10', text: L(
      "a = 1 bo'lganda 2a + 3 = 5, 10 emas. 10 bu bo'linmagan yig'indi.",
      'При a = 1 выходит 2a + 3 = 5, а не 10. Десять это сумма без деления.',
      'At a = 1 we get 2a + 3 = 5, not 10. Ten is the sum before dividing.') },
  ],
  wrongText: L(
    "Har hadni 2 ga bo'ling, keyin a = 1 qo'yib ikki tomonni solishtiring.",
    'Раздели каждый член на 2, потом подставь a = 1 и сравни обе части.',
    'Divide each term by 2, then put a = 1 and compare both sides.'),
};

export default function D32_02(props) { return <SlotsBank data={DATA} {...props} />; }
