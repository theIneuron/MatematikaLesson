// Dars03 · Amaliyot 04 — Bo'lib ko'paytirish · 🟡 · tag: distribute_split
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SlotsBank.
//
// 6 · 48 ni og'zaki hisoblash uchun 48 ni 50 − 2 deb yozamiz va taqsimot
// qonunini ishlatamiz: 6 · 50 − 6 · 2.
//   6 · 50 = 300,  6 · 2 = 12,  300 − 12 = 288
// Tekshirish: 6 · 48 = 288.
// Kartalar orasida 250 va 18 turadi -- 6 ni 50 ga qo'shish yoki 6 va 2 ni
// qo'shib yuborishdan chiqadigan sonlar; 312 esa ayirish o'rniga qo'shgan.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'distribute_split', level: '🟡',
  eyebrow: L("Bo'lib ko'paytirish", 'Умножение по частям', 'Multiplying in parts'),
  setup: L(
    "48 ni 50 − 2 deb yozsak, ko'paytirish ikki oson amalga bo'linadi. Bu taqsimot qonuni.",
    'Если записать 48 как 50 − 2, умножение распадается на два простых действия. Это распределительный закон.',
    'Writing 48 as 50 − 2 splits the multiplication into two easy steps. That is the distributive law.'),
  rows: [
    [{ t: ['6', '·', '48', '=', '6', '·', '(', '50', '−', '2', ')'] }],
    [{ t: ['='] }, { slot: 0 }, { t: ['−'] }, { slot: 1 }, { t: ['='] }, { slot: 2 }],
  ],
  cards: ['300', '12', '288', '250', '18', '312'],
  answer: ['300', '12', '288'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 6 · 50 = 300 va 6 · 2 = 12. Ayirmasi 288, ya'ni 6 · 48 ning o'zi.",
    'Верно. 6 · 50 = 300 и 6 · 2 = 12. Разность 288 — это и есть 6 · 48.',
    'Correct. 6 · 50 = 300 and 6 · 2 = 12. The difference 288 is exactly 6 · 48.'),
  wrongs: [
    { when: (s) => s.slots[0] === '250', text: L(
      "Birinchi uyada ko'paytirish bo'lishi kerak: 6 · 50 = 300. 250 esa 200 ga 50 qo'shilganda chiqadi.",
      'В первой клетке должно быть умножение: 6 · 50 = 300. А 250 получается, если к 200 прибавить 50.',
      'The first cell needs a multiplication: 6 · 50 = 300. The 250 comes from adding 50 to 200.') },
    { when: (s) => s.slots[1] === '18', text: L(
      "Ikkinchi uyada ham ko'paytirish: 6 · 2 = 12. 18 esa 6 va 12 ni qo'shganda chiqadi.",
      'Во второй клетке тоже умножение: 6 · 2 = 12. А 18 получается при сложении 6 и 12.',
      'The second cell is a multiplication too: 6 · 2 = 12. The 18 comes from adding 6 and 12.') },
    { when: (s) => s.slots[2] === '312', text: L(
      "Qavs ichida AYIRISH turgan edi, shuning uchun 6 · 2 ham ayiriladi: 300 − 12.",
      'В скобке было ВЫЧИТАНИЕ, поэтому 6 · 2 тоже вычитается: 300 − 12.',
      'The bracket had a SUBTRACTION, so 6 · 2 is subtracted too: 300 − 12.') },
  ],
  wrongText: L(
    "Oltini qavs ichidagi har songa alohida ko'paytiring, keyin natijalarni o'sha belgi bilan qo'shing yoki ayiring.",
    'Умножь шесть на каждое число в скобке отдельно, потом соедини результаты тем же знаком.',
    'Multiply six by each number in the bracket separately, then join the results with the same sign.'),
};

export default function D03_04(props) { return <SlotsBank data={DATA} {...props} />; }
