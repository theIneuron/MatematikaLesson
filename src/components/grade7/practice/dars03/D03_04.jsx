// Dars03 · Amaliyot 04 — Manfiy ko'paytuvchi bilan taqsimlash · 🟡 · tag: distribute_negative
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SlotsBank.
//
// DARAJA KO'TARILDI (metodist qarori 2026-08-21): sonlar to'rt-besh xonali.
//
// 4800 · (−7) = (5000 − 200) · (−7)
//   5000 · (−7) = −35000
//   200 · (−7) = −1400, lekin u AYIRILADI: −(−1400) = +1400
//   −35000 + 1400 = −33600
// Tekshirish: 4800 · 7 = 33600, ya'ni javob −33600.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'distribute_negative', level: '🟡',
  eyebrow: L("Manfiy ko'paytuvchi", 'Отрицательный множитель', 'A negative factor'),
  setup: L(
    "4800 ni 5000 − 200 deb yozsak, ko'paytirish ikki oson amalga bo'linadi. Ko'paytuvchi manfiy, shuning uchun har bo'lakning ishorasini alohida kuzatish kerak.",
    'Если записать 4800 как 5000 − 200, умножение распадается на два простых действия. Множитель отрицательный, поэтому знак каждой части надо следить отдельно.',
    'Writing 4800 as 5000 − 200 splits the multiplication in two. The factor is negative, so each part needs its own sign check.'),
  rows: [
    [{ t: ['4800', '·', '(−7)', '=', '(', '5000', '−', '200', ')', '·', '(−7)'] }],
    [{ t: ['='] }, { slot: 0 }, { t: ['+'] }, { slot: 1 }, { t: ['='] }, { slot: 2 }],
  ],
  cards: ['−35000', '1400', '−33600', '35000', '−1400', '−36400'],
  answer: ['−35000', '1400', '−33600'],
  ask: L("Kartani bosing, keyin bo'sh katakni bosing.", 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 5000 · (−7) = −35000 va 200 · (−7) = −1400, lekin u ayiriladi: −35000 + 1400 = −33600. Tekshirish: 4800 · 7 = 33600.",
    'Верно. 5000 · (−7) = −35000 и 200 · (−7) = −1400, но оно вычитается: −35000 + 1400 = −33600. Проверка: 4800 · 7 = 33600.',
    'Correct. 5000 · (−7) = −35000 and 200 · (−7) = −1400, but it is subtracted: −35000 + 1400 = −33600. Check: 4800 · 7 = 33600.'),
  wrongs: [
    { when: (s) => s.slots[0] === '35000', text: L(
      "Birinchi bo'lakda ishora yo'qoldi: 5000 ni manfiy songa ko'paytirsa manfiy chiqadi, −35000.",
      'В первой части потерялся знак: 5000 умножить на отрицательное даёт отрицательное, −35000.',
      'The sign is lost in the first part: 5000 times a negative gives a negative, −35000.') },
    { when: (s) => s.slots[1] === '−1400', text: L(
      "200 · (−7) = −1400, lekin qavs ichida AYIRISH turgan edi. Manfiy sonni ayirish qo'shishga aylanadi: +1400.",
      '200 · (−7) = −1400, но в скобке было ВЫЧИТАНИЕ. А вычитание отрицательного превращается в сложение: +1400.',
      '200 · (−7) = −1400, but the bracket had a SUBTRACTION. Subtracting a negative turns into adding: +1400.') },
    { when: (s) => s.slots[2] === '−36400', text: L(
      "−36400 chiqishi uchun 1400 ayirilgan. Ikkinchi bo'lak esa qo'shiladi: −35000 + 1400 = −33600.",
      'Чтобы вышло −36400, тысяча четыреста вычли. А вторая часть прибавляется: −35000 + 1400 = −33600.',
      'To get −36400 the 1400 was subtracted. The second part is added: −35000 + 1400 = −33600.') },
  ],
  wrongText: L(
    "Qavs ichidagi har songa (−7) ni ko'paytiring, keyin ikki bo'lakni qavsdagi belgi bilan bog'lang -- va manfiy sonni ayirish qo'shishga aylanadi.",
    'Умножь каждое число в скобке на (−7), потом соедини части знаком из скобки — а вычитание отрицательного превращается в сложение.',
    'Multiply each number in the bracket by (−7), then join the parts with the sign from the bracket — and subtracting a negative turns into adding.'),
};

export default function D03_04(props) { return <SlotsBank data={DATA} {...props} />; }
