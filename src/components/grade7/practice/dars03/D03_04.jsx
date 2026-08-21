// Dars03 · Amaliyot 04 — Manfiy ko'paytuvchi bilan taqsimlash · 🟡 · tag: distribute_negative
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SlotsBank.
//
// DARAJA KO'TARILDI (metodist qarori 2026-08-21): ilgari 6 · 48 edi, ya'ni
// 5-sinf misoli. Endi ko'paytuvchi MANFIY va har qadamda ishora nazorat
// qilinadi.
//
// 48 · (−7) = (50 − 2) · (−7) = 50 · (−7) − 2 · (−7) = −350 + 14 = −336.
// Tekshirish: 48 · 7 = 336, ya'ni javob −336.
// Kartalar orasida −364 (14 ni ayirgan), 350 va −14 turadi.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'distribute_negative', level: '🟡',
  eyebrow: L("Manfiy ko'paytuvchi", 'Отрицательный множитель', 'A negative factor'),
  setup: L(
    "48 ni 50 − 2 deb yozsak, ko'paytirish ikki oson amalga bo'linadi. Ko'paytuvchi manfiy bo'lsa, har bo'lakning ishorasi ham o'zgaradi.",
    'Если записать 48 как 50 − 2, умножение распадается на два простых действия. Когда множитель отрицательный, знак меняется у каждой части.',
    'Writing 48 as 50 − 2 splits the multiplication in two. With a negative factor the sign of each part changes too.'),
  rows: [
    [{ t: ['48', '·', '(−7)', '=', '(', '50', '−', '2', ')', '·', '(−7)'] }],
    [{ t: ['='] }, { slot: 0 }, { t: ['+'] }, { slot: 1 }, { t: ['='] }, { slot: 2 }],
  ],
  cards: ['−350', '14', '−336', '350', '−14', '−364'],
  answer: ['−350', '14', '−336'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 50 · (−7) = −350 va 2 · (−7) = −14, lekin u AYIRILADI: −350 − (−14) = −350 + 14 = −336. Tekshirish: 48 · 7 = 336.",
    'Верно. 50 · (−7) = −350 и 2 · (−7) = −14, но оно ВЫЧИТАЕТСЯ: −350 − (−14) = −350 + 14 = −336. Проверка: 48 · 7 = 336.',
    'Correct. 50 · (−7) = −350 and 2 · (−7) = −14, but it is SUBTRACTED: −350 − (−14) = −350 + 14 = −336. Check: 48 · 7 = 336.'),
  wrongs: [
    { when: (s) => s.slots[0] === '350', text: L(
      "Birinchi bo'lakda ishora yo'qoldi: 50 ni manfiy songa ko'paytirsa manfiy chiqadi, −350.",
      'В первой части потерялся знак: 50 умножить на отрицательное даёт отрицательное, −350.',
      'The sign is lost in the first part: 50 times a negative gives a negative, −350.') },
    { when: (s) => s.slots[1] === '−14', text: L(
      "2 · (−7) = −14, lekin qavs ichida AYIRISH turgan edi. Manfiy sonni ayirish esa qo'shishga aylanadi: +14.",
      '2 · (−7) = −14, но в скобке было ВЫЧИТАНИЕ. А вычитание отрицательного превращается в сложение: +14.',
      '2 · (−7) = −14, but the bracket had a SUBTRACTION. And subtracting a negative turns into adding: +14.') },
    { when: (s) => s.slots[2] === '−364', text: L(
      "−364 chiqishi uchun 14 ayirilgan. Ikkinchi bo'lak esa qo'shiladi: −350 + 14 = −336.",
      'Чтобы вышло −364, четырнадцать вычли. А вторая часть прибавляется: −350 + 14 = −336.',
      'To get −364 the fourteen was subtracted. The second part is added: −350 + 14 = −336.') },
  ],
  wrongText: L(
    "Qavs ichidagi har songa (−7) ni ko'paytiring, keyin ikki bo'lakni qavsdagi belgi bilan bog'lang -- va manfiy sonni ayirish qo'shishga aylanadi.",
    'Умножь каждое число в скобке на (−7), потом соедини части знаком из скобки — а вычитание отрицательного превращается в сложение.',
    'Multiply each number in the bracket by (−7), then join the parts with the sign from the bracket — and subtracting a negative turns into adding.'),
};

export default function D03_04(props) { return <SlotsBank data={DATA} {...props} />; }
