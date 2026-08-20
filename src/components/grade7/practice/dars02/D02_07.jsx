// Dars02 · Amaliyot 07 — Bir harf ikki joyda · 🔴 · tag: chain_substitute
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SlotsBank.
//
// x · x − 5x, x = 4. Darsning 11-ekrani: iks ikki joyda, son esa BITTA.
//   4 · 4 = 16,  5 · 4 = 20,  16 − 20 = −4
// Kartalar orasida 8 turadi -- x · x ni x + x deb o'qiganning javobi,
// hamda 4: bu 16 − 20 ni 20 − 16 deb hisoblaganda chiqadi.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'chain_substitute', level: '🔴',
  eyebrow: L('Bir harf ikki joyda', 'Одна буква в двух местах', 'One letter in two places'),
  setup: L(
    "Harf yozuvda necha marta uchrasa ham, uning soni BITTA. Qator ostiga qator yozib hisoblanadi.",
    'Сколько бы раз буква ни встретилась в записи, число у неё ОДНО. Считаем строку под строкой.',
    'However many times the letter appears, its number is the SAME. We work it out line under line.'),
  given: [['x', '=', '4']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  rows: [
    [{ t: ['x', '·', 'x', '−', '5x'] }],
    [{ t: ['4', '·', '4', '−', '5', '·', '4', '='] }, { slot: 0 }, { t: ['−'] }, { slot: 1 }, { t: ['='] }, { slot: 2 }],
  ],
  cards: ['16', '20', '−4', '8', '9', '4'],
  answer: ['16', '20', '−4'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Avval ikkinchi bosqich: 4 · 4 = 16 va 5 · 4 = 20. So'ng 16 − 20 = −4: ayiriladigan son kattaroq edi.",
    'Верно. Сначала вторая ступень: 4 · 4 = 16 и 5 · 4 = 20. Затем 16 − 20 = −4: вычитаемое было больше.',
    'Correct. Second stage first: 4 · 4 = 16 and 5 · 4 = 20. Then 16 − 20 = −4: the number taken away was bigger.'),
  wrongs: [
    { when: (s) => s.slots[0] === '8', text: L(
      "x · x bu ko'paytirish: 4 · 4 = 16. 8 esa 4 + 4 dan chiqadi.",
      'x · x это умножение: 4 · 4 = 16. А 8 получается из 4 + 4.',
      'x · x is a multiplication: 4 · 4 = 16. The 8 comes from 4 + 4.') },
    { when: (s) => s.slots[2] === '4', text: L(
      "Oxirgi uyaga qarang: 16 dan 20 ayirilmoqda, ya'ni natija manfiy bo'ladi.",
      'Посмотри на последнюю клетку: из 16 вычитают 20, значит результат отрицательный.',
      'Look at the last cell: 20 is taken from 16, so the result is negative.') },
    { when: (s) => s.slots[1] === '9', text: L(
      "5x bu 5 · x, ya'ni 5 · 4 = 20. 9 esa 5 + 4 dan chiqadi.",
      '5x это 5 · x, то есть 5 · 4 = 20. А 9 получается из 5 + 4.',
      '5x is 5 · x, that is 5 · 4 = 20. The 9 comes from 5 + 4.') },
  ],
  wrongText: L(
    "Ikkinchi qatorda ikki ko'paytirish bor, ular birinchi hisoblanadi. Keyin ayirish qoladi.",
    'Во второй строке два умножения, они считаются первыми. Потом остаётся вычитание.',
    'The second line has two multiplications, they go first. The subtraction is what is left.'),
};

export default function D02_07(props) { return <SlotsBank data={DATA} {...props} />; }
