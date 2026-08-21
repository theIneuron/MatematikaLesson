// Dars46 · Amaliyot 07 — Yig'indi va chegara · 🟡 · chain · tag: ineq_chain
// Mexanika: kit.jsx -> SlotsBank (ikki qator). Raskladka: 7-o'rin.
// Tomonlar 4 va 9: yig'indisi 13, ya'ni uchinchi tomon 13 dan KICHIK
// bo'lishi kerak. 12 mos keladi.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'ineq_chain', level: '🟡',
  eyebrow: L('Chegara', 'Граница', 'The bound'),
  setup: L(
    "Ikki tomon ma'lum. Ularning yig'indisi uchinchi tomon uchun yuqori chegara beradi: uchinchisi undan kichik bo'lishi kerak.",
    'Две стороны известны. Их сумма даёт верхнюю границу для третьей: она должна быть меньше.',
    'Two sides are known. Their sum bounds the third from above: it must be smaller.'),
  given: [['4', 'va', '9']],
  givenLabel: L('Tomonlar:', 'Стороны:', 'Sides:'),
  rows: [
    [{ t: ['4', '+', '9', '='] }, { slot: 0 }],
    [{ t: ['uchinchi', 'tomon', '='] }, { slot: 1 }],
  ],
  cards: ['13', '12', '5', '14'],
  answer: ['13', '12'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Yig'indi 13, ya'ni uchinchi tomon 13 dan kichik bo'lishi kerak: 12 mos keladi.",
    'Верно. Сумма 13, значит третья сторона должна быть меньше 13: подходит 12.',
    'Correct. The sum is 13, so the third side must be under 13: 12 fits.'),
  wrongs: [
    { when: (s) => s.slots[1] === '14', text: L(
      "14 > 13, ya'ni tomonlar tutashmaydi: uchinchi tomon yig'indidan kichik bo'lishi kerak.",
      '14 > 13, значит стороны не сомкнутся: третья должна быть меньше суммы.',
      '14 > 13, so the sides cannot meet: the third must be under the sum.') },
    { when: (s) => s.slots[1] === '5', text: L(
      "5 ham bo'lishi mumkin, lekin u chegaraga yaqin emas -- bu topshiriqda 13 dan kichik eng katta variant so'ralgan.",
      '5 тоже возможно, но это не крайний случай — здесь нужен наибольший вариант меньше 13.',
      '5 is possible but not the tight case — here the largest option under 13 is wanted.') },
    { when: (s) => s.slots[0] === '5', text: L(
      "5 bu 9 − 4. Chegara uchun tomonlar QO'SHILADI: 4 + 9 = 13.",
      '5 это 9 − 4. Для границы стороны СКЛАДЫВАЮТСЯ: 4 + 9 = 13.',
      '5 is 9 − 4. The bound comes from ADDING: 4 + 9 = 13.') },
  ],
  wrongText: L(
    "Ikki tomonni qo'shing: uchinchisi shu sondan kichik bo'lishi kerak.",
    'Сложи две стороны: третья должна быть меньше этого числа.',
    'Add the two sides: the third must be less than that.'),
};

export default function D46_07(props) { return <SlotsBank data={DATA} {...props} />; }
