// Dars03 · Amaliyot 07 — Yaqin yumaloq son · 🔴 · tag: round_neighbour
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SlotsBank.
//
// 48 · 37. 48 ni 50 − 2 deb olamiz (yaqin yumaloq son) va taqsimlaymiz:
//   50 · 37 = 1850,  2 · 37 = 74,  1850 − 74 = 1776
// Tekshirish: 48 · 37 = 1776.
// Kartalar orasida 1800 (50 · 36 dan), 72 (2 · 36 dan) va 1926 (ayirish
// o'rniga qo'shgan) turadi.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'round_neighbour', level: '🔴',
  eyebrow: L('Yaqin yumaloq son', 'Соседнее круглое', 'The round neighbour'),
  setup: L(
    "Ikki xonali sonni ko'paytirish uchun yonidagi yumaloq sonni olamiz va ortiqchasini ayiramiz. Ish ikki oson amalga bo'linadi.",
    'Чтобы умножить двузначное число, берём соседнее круглое и вычитаем лишнее. Работа распадается на два простых действия.',
    'To multiply a two-digit number we take the round neighbour and subtract the extra. The work splits into two easy steps.'),
  rows: [
    [{ t: ['48', '·', '37', '=', '(', '50', '−', '2', ')', '·', '37'] }],
    [{ t: ['='] }, { slot: 0 }, { t: ['−'] }, { slot: 1 }, { t: ['='] }, { slot: 2 }],
  ],
  cards: ['1850', '74', '1776', '1800', '72', '1926'],
  answer: ['1850', '74', '1776'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 50 · 37 = 1850 va 2 · 37 = 74. Ayirmasi 1776, ya'ni 48 · 37 ning o'zi.",
    'Верно. 50 · 37 = 1850 и 2 · 37 = 74. Разность 1776 — это и есть 48 · 37.',
    'Correct. 50 · 37 = 1850 and 2 · 37 = 74. The difference 1776 is exactly 48 · 37.'),
  wrongs: [
    { when: (s) => s.slots[0] === '1800' || s.slots[1] === '72', text: L(
      "Ikkinchi ko'paytiruvchi 37, 36 emas: 50 · 37 = 1850 va 2 · 37 = 74.",
      'Второй множитель 37, а не 36: 50 · 37 = 1850 и 2 · 37 = 74.',
      'The second factor is 37, not 36: 50 · 37 = 1850 and 2 · 37 = 74.') },
    { when: (s) => s.slots[2] === '1926', text: L(
      "48 bu 50 dan IKKI KAM, shuning uchun 2 · 37 ayiriladi, qo'shilmaydi.",
      '48 это на ДВА МЕНЬШЕ пятидесяти, поэтому 2 · 37 вычитается, а не прибавляется.',
      '48 is TWO LESS than fifty, so 2 · 37 is subtracted, not added.') },
    { when: (s) => s.slots[0] === '74' || s.slots[1] === '1850', text: L(
      "Uyalar joyi almashdi: avval katta bo'lak (50 · 37), keyin ortiqcha bo'lak (2 · 37) ayiriladi.",
      'Клетки перепутаны: сначала большая часть (50 · 37), потом вычитается лишняя (2 · 37).',
      'The cells are swapped: the big part (50 · 37) comes first, then the extra part (2 · 37) is subtracted.') },
  ],
  wrongText: L(
    "50 ni 37 ga ko'paytiring, keyin 2 ni 37 ga ko'paytiring va ikkinchisini birinchisidan ayiring.",
    'Умножь 50 на 37, потом 2 на 37 и вычти второе из первого.',
    'Multiply 50 by 37, then 2 by 37, and take the second from the first.'),
};

export default function D03_07(props) { return <SlotsBank data={DATA} {...props} />; }
