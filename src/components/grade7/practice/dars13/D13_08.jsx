// Dars13 · Amaliyot 08 — Darajalar ko'paytmasi · 🔴 · tag: powers_product
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SlotsBank.
//
// 3² · 2³. ASOSLARI BOSHQA, shuning uchun ko'rsatkichlarni qo'shib
// bo'lmaydi: har darajani alohida hisoblash kerak.
//   3² = 9,  2³ = 8,  9 · 8 = 72
// Kartalar orasida 6 (3 · 2), 12 va 36 turadi.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'powers_product', level: '🔴',
  eyebrow: L("Darajalar ko'paytmasi", 'Произведение степеней', 'A product of powers'),
  setup: L(
    "Asoslar har xil bo'lsa, ko'rsatkichlarni qo'shib bo'lmaydi. Har darajani alohida hisoblab, keyin ko'paytiriladi.",
    'Если основания разные, показатели складывать нельзя. Каждую степень считают отдельно, а потом перемножают.',
    'When the bases differ the exponents cannot be added. Each power is worked out on its own and then they are multiplied.'),
  rows: [
    [{ t: ['3²', '·', '2³', '='] }, { slot: 0 }, { t: ['·'] }, { slot: 1 }, { t: ['='] }, { slot: 2 }],
  ],
  cards: ['9', '8', '72', '6', '12', '36'],
  answer: ['9', '8', '72'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 3² = 9, 2³ = 8, keyin 9 · 8 = 72. Asoslar boshqa bo'lgani uchun boshqa yo'l yo'q.",
    'Верно. 3² = 9, 2³ = 8, затем 9 · 8 = 72. Основания разные, поэтому другого пути нет.',
    'Correct. 3² = 9, 2³ = 8, then 9 · 8 = 72. The bases differ, so there is no shortcut.'),
  wrongs: [
    { when: (s) => s.slots[0] === '6' || s.slots[1] === '6', text: L(
      "6 bu 3 · 2, ya'ni asos ko'rsatkichga ko'paytirilgan. 3² esa 3 · 3 = 9.",
      '6 это 3 · 2, то есть основание умножили на показатель. А 3² это 3 · 3 = 9.',
      '6 is 3 · 2, the base times the exponent. But 3² is 3 · 3 = 9.') },
    { when: (s) => s.slots[2] === '36', text: L(
      "36 chiqishi uchun 6 · 6 hisoblangan. To'g'ri yo'l: 9 · 8 = 72.",
      'Чтобы вышло 36, посчитали 6 · 6. Верный путь: 9 · 8 = 72.',
      'To get 36 the 6 · 6 was worked out. The right way: 9 · 8 = 72.') },
    { when: (s) => s.slots[2] === '12', text: L(
      "12 bu 3 · 4 yoki 2 · 6. Darajalarni hisoblab ko'paytirsak 72 chiqadi.",
      '12 это 3 · 4 или 2 · 6. Если посчитать степени и перемножить, выйдет 72.',
      '12 is 3 · 4 or 2 · 6. Working out the powers and multiplying gives 72.') },
  ],
  wrongText: L(
    "Avval 3² ni, keyin 2³ ni hisoblang. Ikki natijani ko'paytiring.",
    'Сначала посчитай 3², потом 2³. Перемножь два результата.',
    'Work out 3² first, then 2³. Multiply the two results.'),
};

export default function D13_08(props) { return <SlotsBank data={DATA} {...props} />; }
