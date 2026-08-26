// Dars11 · Amaliyot 07 — Ikki son, farqi ma'lum · 🔴 · tag: sum_and_diff
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SlotsBank.
//
// «Bir son ikkinchisidan 7 ga katta, ikkovi birga 43.»
// Kichigi x bo'lsa: x + (x + 7) = 43 -> 2x + 7 = 43 -> 2x = 36 -> x = 18,
// kattasi esa 18 + 7 = 25. Tekshirish: 18 + 25 = 43 va 25 − 18 = 7.
// Oxirgi uya ATAYLAB: tenglamaning ildizi 18, lekin masalaning javobi IKKI
// son. Ikkinchisini topmasdan javob to'liq bo'lmaydi.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'sum_and_diff', level: '🔴',
  eyebrow: L('Ikki son', 'Два числа', 'Two numbers'),
  setup: L(
    "Bir son ikkinchisidan 7 ga katta, ikkovi birga 43. Kichigi x, kattasi x + 7.",
    'Одно число на 7 больше другого, вместе 43. Меньшее x, большее x + 7.',
    'One number is 7 more than the other, together 43. The smaller is x, the larger x + 7.'),
  rows: [
    [{ t: ['x', '+', '(', 'x', '+', '7', ')', '=', '43'] }],
    [{ t: ['2x', '+', '7', '=', '43', '→', '2x', '='] }, { slot: 0 }],
    [{ t: [L('kichik', 'меньший', 'smaller'), L('son', 'число', 'number'), '='] }, { slot: 1 }],
    [{ t: [L('katta', 'больший', 'larger'), L('son', 'число', 'number'), '='] }, { slot: 2 }],
  ],
  cards: ['36', '18', '25', '50', '21', '22'],
  answer: ['36', '18', '25'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 2x = 43 − 7 = 36, x = 18 -- kichik son. Kattasi 18 + 7 = 25. Tekshirish: 18 + 25 = 43.",
    'Верно. 2x = 43 − 7 = 36, x = 18 — меньшее число. Большее 18 + 7 = 25. Проверка: 18 + 25 = 43.',
    'Correct. 2x = 43 − 7 = 36, x = 18 — the smaller number. The larger is 18 + 7 = 25. Check: 18 + 25 = 43.'),
  wrongs: [
    { when: (s) => s.slots[0] === '50', text: L(
      "7 chap tomonda qo'shilgan edi: o'ngga ko'chganda ayiriladi, 43 − 7 = 36.",
      'Семёрка была прибавлена слева: при переносе направо она вычитается, 43 − 7 = 36.',
      'The seven was added on the left: moving right it is subtracted, 43 − 7 = 36.') },
    { when: (s) => s.slots[1] === '21' || s.slots[1] === '22', text: L(
      "Kichik sonni topish uchun 36 ni 2 ga bo'lish kerak: x = 18. Ikki son teng emas, shuning uchun 43 ni yarmiga bo'lib bo'lmaydi.",
      'Чтобы найти меньшее число, надо 36 разделить на 2: x = 18. Числа не равны, поэтому 43 пополам делить нельзя.',
      'To find the smaller number divide 36 by 2: x = 18. The numbers are not equal, so halving 43 does not work.') },
    { when: (s) => s.slots[2] === '18' || s.slots[2] === '36', text: L(
      "Katta son x + 7 ga teng: 18 + 7 = 25. Tenglamaning ildizi faqat KICHIK sonni beradi.",
      'Большее число равно x + 7: 18 + 7 = 25. Корень уравнения даёт только МЕНЬШЕЕ число.',
      'The larger number is x + 7: 18 + 7 = 25. The root of the equation gives only the SMALLER number.') },
  ],
  wrongText: L(
    "7 ni ko'chirib 2x ni toping, keyin ikkiga bo'ling. Oxirida kattasini hisoblang: unga 7 qo'shiladi.",
    'Перенеси 7 и найди 2x, потом раздели на два. В конце посчитай большее: к нему прибавляется 7.',
    'Move the 7 to find 2x, then halve it. Finally work out the larger number: 7 is added to it.'),
};

export default function D11_07(props) { return <SlotsBank data={DATA} {...props} />; }
