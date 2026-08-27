// Dars17 · Amaliyot 09 — Ikki qadamli zanjir · 🔴 · chain · tag: power_chain
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SlotsBank (ikki qatorli zanjir).
// Mexanika RASKLADKADAN: 17-dars, 9-o'rin `chain`.
//
// Birinchi qator: (2z⁵)⁴ = 16z²⁰     (2⁴ = 16, 5 · 4 = 20)
// Ikkinchi qator: (2z⁵)⁴ · 3z³ = 48z²³
//   birinchi qatorning natijasi ishlatiladi: 16 · 3 = 48, 20 + 3 = 23
// Ya'ni bitta topshiriqda ikki xil qoida: darajaga ko'tarish, keyin
// ko'paytirish. Uni tanib olish bilan yechib bo'lmaydi.
// Kartalar orasida 8 (2 · 4) va z⁶⁰ (20 · 3) turadi.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'power_chain', level: '🔴',
  eyebrow: L('Zanjir', 'Цепочка', 'A chain'),
  setup: L(
    "Ikki qator ketma-ket to'ldiriladi: birinchi qatorning natijasi ikkinchisida ishlatiladi. Birinchi qatorda darajaga ko'tarish, ikkinchisida ko'paytirish.",
    'Две строки заполняются подряд: результат первой используется во второй. В первой строке возведение в степень, во второй умножение.',
    'The two rows are filled in turn: the result of the first is used in the second. The first row raises to a power, the second multiplies.'),
  rows: [
    [{ t: ['(2z⁵)⁴', '='] }, { slot: 0 }, { slot: 1 }],
    [{ t: ['(2z⁵)⁴', '·', '3z³', '='] }, { slot: 2 }, { slot: 3 }],
  ],
  cards: ['16', 'z²⁰', '48', 'z²³', '8', 'z⁶⁰'],
  answer: ['16', 'z²⁰', '48', 'z²³'],
  ask: L("Kartani bosing, keyin bo'sh katakni bosing.", 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Birinchi qator: 2⁴ = 16 va 5 · 4 = 20. Ikkinchisi: 16 · 3 = 48 va 20 + 3 = 23. Ko'paytirishda ko'rsatkichlar qo'shiladi.",
    'Верно. Первая строка: 2⁴ = 16 и 5 · 4 = 20. Вторая: 16 · 3 = 48 и 20 + 3 = 23. При умножении показатели складываются.',
    'Correct. First row: 2⁴ = 16 and 5 · 4 = 20. Second: 16 · 3 = 48 and 20 + 3 = 23. In multiplication the exponents add.'),
  wrongs: [
    { when: (s) => s.slots[3] === 'z⁶⁰', text: L(
      "z⁶⁰ chiqishi uchun 20 ni 3 ga ko'paytirgan. Ikkinchi qatorda esa KO'PAYTMA turibdi, ya'ni ko'rsatkichlar qo'shiladi: 20 + 3 = 23.",
      'Чтобы вышло z⁶⁰, 20 умножили на 3. А во второй строке стоит ПРОИЗВЕДЕНИЕ, значит показатели складываются: 20 + 3 = 23.',
      'To get z⁶⁰ the 20 was multiplied by 3. But the second row is a PRODUCT, so the exponents add: 20 + 3 = 23.') },
    { when: (s) => s.slots[0] === '8', text: L(
      "8 bu 2 · 4. Birinchi qatorda son darajaga ko'tariladi: 2⁴ = 16.",
      '8 это 2 · 4. В первой строке число возводится в степень: 2⁴ = 16.',
      '8 is 2 · 4. In the first row the number is raised to the power: 2⁴ = 16.') },
    { when: (s) => s.slots[1] === 'z²³' || s.slots[3] === 'z²⁰', text: L(
      "Qatorlar almashib ketdi: z²⁰ birinchi qatorning javobi, z²³ esa ikkinchisining.",
      'Строки перепутались: z²⁰ это ответ первой строки, а z²³ второй.',
      'The rows got swapped: z²⁰ is the first row answer and z²³ the second.') },
    { when: (s) => s.slots[2] === '16' || s.slots[0] === '48', text: L(
      "Sonlar almashib ketdi: birinchi qatorda 16, ikkinchisida esa 16 · 3 = 48.",
      'Числа перепутались: в первой строке 16, а во второй 16 · 3 = 48.',
      'The numbers got swapped: the first row has 16, the second 16 · 3 = 48.') },
  ],
  wrongText: L(
    "Birinchi qatorni to'ldirib bo'lgach, uning natijasini ikkinchi qatorda 3z³ ga ko'paytiring.",
    'Заполнив первую строку, умножь её результат во второй строке на 3z³.',
    'After filling the first row, multiply its result by 3z³ in the second row.'),
};

export default function D17_09(props) { return <SlotsBank data={DATA} {...props} />; }
