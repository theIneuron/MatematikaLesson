// Dars13 · Amaliyot 08 — Darajalar ko'paytmasi · 🔴 · tag: powers_product
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SlotsBank.
//
// DARAJA KO'TARILDI (PODXOD_7SINF.md §13): natija to'rt xonali, lekin
// og'zaki chiqadi: 125 · 16 = 125 · 8 · 2 = 1000 · 2.
//
// 5³ · 2⁴. ASOSLARI BOSHQA, shuning uchun ko'rsatkichlarni qo'shib
// bo'lmaydi: har darajani alohida hisoblash kerak.
//   5³ = 125,  2⁴ = 16,  125 · 16 = 2000
// Kartalar orasida 15 (5 · 3), 8 (2³) va 1000 (125 · 8) turadi.
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
    [{ t: ['5³', '·', '2⁴', '='] }, { slot: 0 }, { t: ['·'] }, { slot: 1 }, { t: ['='] }, { slot: 2 }],
  ],
  cards: ['125', '16', '2000', '15', '8', '1000'],
  answer: ['125', '16', '2000'],
  ask: L("Kartani bosing, keyin bo'sh katakni bosing.", 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 5³ = 125, 2⁴ = 16, keyin 125 · 16 = 2000. Asoslar boshqa bo'lgani uchun boshqa yo'l yo'q.",
    'Верно. 5³ = 125, 2⁴ = 16, затем 125 · 16 = 2000. Основания разные, поэтому другого пути нет.',
    'Correct. 5³ = 125, 2⁴ = 16, then 125 · 16 = 2000. The bases differ, so there is no shortcut.'),
  wrongs: [
    { when: (s) => s.slots[0] === '15' || s.slots[1] === '15', text: L(
      "15 bu 5 · 3, ya'ni asos ko'rsatkichga ko'paytirilgan. 5³ esa 5 · 5 · 5 = 125.",
      '15 это 5 · 3, то есть основание умножили на показатель. А 5³ это 5 · 5 · 5 = 125.',
      '15 is 5 · 3, the base times the exponent. But 5³ is 5 · 5 · 5 = 125.') },
    { when: (s) => s.slots[2] === '1000', text: L(
      "1000 chiqishi uchun 125 ni sakkizga ko'paytirgan. 2⁴ esa 16: 125 · 16 = 2000.",
      'Чтобы вышло 1000, умножили 125 на восемь. А 2⁴ это 16: 125 · 16 = 2000.',
      'To get 1000 the 125 was multiplied by eight. But 2⁴ is 16: 125 · 16 = 2000.') },
    { when: (s) => s.slots[0] === '8' || s.slots[1] === '8', text: L(
      "8 bu 2³, ya'ni bir ko'paytuvchi kam. 2⁴ da to'rtta ikkilik: 16.",
      '8 это 2³, то есть одного множителя не хватает. В 2⁴ четыре двойки: 16.',
      '8 is 2³, one factor short. In 2⁴ there are four twos: 16.') },
  ],
  wrongText: L(
    "Avval 5³ ni, keyin 2⁴ ni hisoblang. Ikki natijani ko'paytiring: 125 · 8 · 2.",
    'Сначала посчитай 5³, потом 2⁴. Перемножь два результата: 125 · 8 · 2.',
    'Work out 5³ first, then 2⁴. Multiply the two results: 125 · 8 · 2.'),
};

export default function D13_08(props) { return <SlotsBank data={DATA} {...props} />; }
