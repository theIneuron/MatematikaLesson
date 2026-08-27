// Dars23 · Amaliyot 01 — Ikki guruh · 🟢 · slots · tag: group_slots
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 23-dars, 1-o'rin.
// 3m + 3n + km + kn = 3(m + n) + k(m + n). Ikki guruhda bir xil qavs paydo
// bo'ladi -- guruhlash usuli shuning uchun ishlaydi.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'group_slots', level: '🟢',
  eyebrow: L('Guruhlash', 'Группировка', 'Grouping'),
  setup: L(
    "To'rt hadni ikki guruhga bo'lib, har guruhdan umumiy ko'paytuvchi chiqariladi. To'g'ri guruhlansa, ikki qavs bir xil chiqadi.",
    'Четыре члена делятся на две группы, из каждой выносится общий множитель. При верной группировке скобки выходят одинаковыми.',
    'The four terms split into two groups and each gives up its common factor. Grouped rightly, both brackets come out the same.'),
  rows: [
    [{ t: ['3m', '+', '3n', '+', 'km', '+', 'kn', '='] }, { slot: 0 }, { slot: 1 }],
  ],
  cards: ['3(m + n)', '+k(m + n)', '3(m + k)', '+n(m + k)'],
  answer: ['3(m + n)', '+k(m + n)'],
  ask: L("Kartani bosing, keyin bo'sh katakni bosing.", 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Birinchi ikki hadda 3 umumiy, keyingi ikkitasida k umumiy. Ikki qavs ham (m + n) chiqdi.",
    'Верно. В первых двух членах общий 3, в следующих двух общий k. Обе скобки вышли (m + n).',
    'Correct. The first two share 3, the next two share k. Both brackets came out as (m + n).'),
  wrongs: [
    { when: (s) => s.slots[0] === '3(m + k)' || s.slots[1] === '+n(m + k)', text: L(
      "Bu guruhlash boshqa hadlarni birlashtiradi: 3m va km, keyin 3n va kn. Unda qavslar (3 + k) chiqadi, m va n emas.",
      'Такая группировка объединяет другие члены: 3m с km, потом 3n с kn. Тогда скобки выйдут (3 + k), а не m и n.',
      'That grouping pairs 3m with km and 3n with kn. Then the brackets come out as (3 + k), not m and n.') },
    { when: (s) => s.slots[0] == null || s.slots[1] == null, text: L(
      "Ikki guruh ham to'ldirilishi kerak: to'rt haddan ikki juft.",
      'Надо заполнить обе группы: из четырёх членов две пары.',
      'Both groups must be filled: four terms make two pairs.') },
  ],
  wrongText: L(
    "Birinchi ikki hadda nima umumiy? Keyingi ikkitasida-chi?",
    'Что общее в первых двух членах? А в следующих двух?',
    'What do the first two share? And the next two?'),
};

export default function D23_01(props) { return <SlotsBank data={DATA} {...props} />; }
