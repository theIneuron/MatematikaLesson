// Dars19 · Amaliyot 03 — Ochish, keyin ixchamlash · 🟢 · chain · tag: open_then_collect
// Faqat MA'LUMOT. Mexanika: kit.jsx -> SlotsBank (ikki qator). Raskladka: 3-o'rin.
//
// 1-qator: (6y − 5) − (2y + 7) ochilsa 6y − 5 − 2y − 7
// 2-qator: ixchamlansa 4y − 12   (6 − 2 = 4, −5 − 7 = −12)
// Ikkinchi qator birinchisining natijasidan chiqadi.
// Kartalar orasida −2y ning o'rniga +2y, va −12 ning o'rniga +2 turadi.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'open_then_collect', level: '🟢',
  eyebrow: L('Ikki qadam', 'Два шага', 'Two steps'),
  setup: L(
    "Avval qavslar ochiladi, keyin o'xshash hadlar ixchamlanadi. Ikki qadamni aralashtirmaslik kerak: ishora birinchi qadamda hal bo'ladi.",
    'Сначала раскрываются скобки, потом приводятся подобные. Два шага не смешиваются: знак решается на первом шаге.',
    'First the brackets are opened, then like terms are collected. Do not mix the steps: the sign is decided in the first.'),
  rows: [
    [{ t: ['(6y', '−', '5)', '−', '(2y', '+', '7)', '='] }, { slot: 0 }, { slot: 1 }],
    [{ t: ['6y', '−', '5', '−', '2y', '−', '7', '='] }, { slot: 2 }, { slot: 3 }],
  ],
  cards: ['−2y', '−7', '4y', '−12', '+2y', '+2'],
  answer: ['−2y', '−7', '4y', '−12'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Minus ikki hadni ham ag'dardi: −2y va −7. Keyin 6y − 2y = 4y, −5 − 7 = −12.",
    'Верно. Минус перевернул оба члена: −2y и −7. Потом 6y − 2y = 4y, −5 − 7 = −12.',
    'Correct. The minus flipped both terms: −2y and −7. Then 6y − 2y = 4y and −5 − 7 = −12.'),
  wrongs: [
    { when: (s) => s.slots[0] === '+2y', text: L(
      "Qavs oldida minus turibdi: 2y manfiy bo'ladi. Plyus qolsa, bu qo'shish bo'lardi.",
      'Перед скобкой стоит минус: 2y становится отрицательным. Если оставить плюс, это было бы сложение.',
      'The bracket has a minus before it: 2y becomes negative. Keeping the plus would make it an addition.') },
    { when: (s) => s.slots[3] === '+2', text: L(
      "+2 chiqishi uchun −5 va 7 qo'shilgan. Ikkinchi qavs ochilganda 7 MANFIY bo'ldi: −5 − 7 = −12.",
      'Чтобы вышло +2, сложили −5 и 7. При раскрытии второй скобки 7 стало ОТРИЦАТЕЛЬНЫМ: −5 − 7 = −12.',
      'To get +2 the −5 and 7 were added. Opening the second bracket made 7 NEGATIVE: −5 − 7 = −12.') },
    { when: (s) => s.slots[1] === '−12' || s.slots[2] === '−2y', text: L(
      "Qatorlar almashib ketdi: birinchi qatorda qavs ochiladi, ikkinchisida ixchamlanadi.",
      'Строки перепутались: в первой раскрываются скобки, во второй приводятся подобные.',
      'The rows got swapped: the first opens the brackets, the second collects like terms.') },
  ],
  wrongText: L(
    "Birinchi qatorda ikkinchi qavsning ikki hadini ag'daring, keyin ikkinchi qatorda o'xshashlarni qo'shing.",
    'В первой строке переверни оба члена второй скобки, потом во второй сложи подобные.',
    'In the first row flip both terms of the second bracket, then collect like terms in the second.'),
};

export default function D19_03(props) { return <SlotsBank data={DATA} {...props} />; }
