// Dars30 · Amaliyot 08 — Ikki ko'paytma ayirmasi · 🔴 · slots · tag: whole_slots
// Mexanika: kit.jsx -> SlotsBank (ikki qator). Raskladka: 8-o'rin.
// 1-qator: (a + 4)² = a² + 8a + 16;  (a + 1)(a + 7) = a² + 8a + 7
// 2-qator: ayirmasi 9. Harfli hadlar butunlay yo'qoladi.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'whole_slots', level: '🔴',
  eyebrow: L('Harflar yo\'qoladi', 'Буквы исчезают', 'The letters vanish'),
  setup: L(
    "Ikki ko'paytma ochiladi va ayiriladi. Harfli hadlar bir xil chiqadi, shuning uchun javobda faqat son qoladi.",
    'Два произведения раскрываются и вычитаются. Буквенные члены выходят одинаковыми, поэтому в ответе остаётся только число.',
    'Both products are expanded and subtracted. The letter terms match, so only a number remains.'),
  rows: [
    [{ t: ['(a', '+', '4)²', '='] }, { slot: 0 }],
    [{ t: ['(a', '+', '1)', '(a', '+', '7)', '='] }, { slot: 1 }],
    [{ t: ['ayirmasi', '='] }, { slot: 2 }],
  ],
  cards: ['a² + 8a + 16', 'a² + 8a + 7', '9', 'a² + 16', 'a² + 7a + 7', '23'],
  answer: ['a² + 8a + 16', 'a² + 8a + 7', '9'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Ikki yozuvda ham a² + 8a bor, faqat sonlar boshqa: 16 − 7 = 9.",
    'Верно. В обеих записях есть a² + 8a, различаются только числа: 16 − 7 = 9.',
    'Correct. Both hold a² + 8a and differ only in the numbers: 16 − 7 = 9.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'a² + 16', text: L(
      "Kvadratda o'rta had bor: (a + 4)² = a² + 8a + 16.",
      'В квадрате есть средний член: (a + 4)² = a² + 8a + 16.',
      'The square has a middle term: (a + 4)² = a² + 8a + 16.') },
    { when: (s) => s.slots[1] === 'a² + 7a + 7', text: L(
      "(a + 1)(a + 7) da o'rta had 7a + a = 8a, ozod had esa 7.",
      'В (a + 1)(a + 7) средний член 7a + a = 8a, а свободный 7.',
      'In (a + 1)(a + 7) the middle term is 7a + a = 8a and the free term 7.') },
    { when: (s) => s.slots[2] === '23', text: L(
      "23 chiqishi uchun sonlar qo'shilgan. Ayirma so'ralgan: 16 − 7 = 9.",
      'Чтобы вышло 23, числа сложили. Спрашивали разность: 16 − 7 = 9.',
      'To get 23 the numbers were added. The difference was asked: 16 − 7 = 9.') },
  ],
  wrongText: L(
    "Ikki yozuvni to'liq ochib yozing, keyin ularni solishtiring: nima farq qiladi?",
    'Раскрой обе записи полностью, потом сравни их: чем они различаются?',
    'Expand both records fully, then compare: what differs?'),
};

export default function D30_08(props) { return <SlotsBank data={DATA} {...props} />; }
