// Dars08 · Amaliyot 05 — Ko'chirishda ishora · 🟡 · tag: fix_move_sign
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> BuildLine (answerSeq).
//
// Chet yechim: 7x + 4 = 2x − 11 dan 7x − 2x = −11 + 4 chiqargan. Bu darsning
// ASOSIY xatosi: 2x ning ishorasi o'zgargan, 4 ning ishorasi esa o'zgarmagan.
// To'g'ri qator: 7x − 2x = −11 − 4.
// Kartalar orasida ikki minus bor va ular ALOHIDA joyga tushadi -- biri
// noma'lumlar orasida, biri sonlar orasida.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const CARDS = [
  { id: 'x7', label: '7x' },
  { id: 'm1', label: '−' },
  { id: 'x2', label: '2x' },
  { id: 'eq', label: '=' },
  { id: 'n11', label: '−11' },
  { id: 'm2', label: '−' },
  { id: 'n4', label: '4' },
];

const DATA = {
  tag: 'fix_move_sign', level: '🟡', useAll: true,
  answerSeq: ['x7', 'm1', 'x2', 'eq', 'n11', 'm2', 'n4'],
  cards: CARDS,
  eyebrow: L('Xatoni tuzatish', 'Исправь ошибку', 'Fix the mistake'),
  setup: L(
    "7x + 4 = 2x − 11 tenglamasidan boshqa o'quvchi shunday qator chiqardi: 7x − 2x = −11 + 4. Bu qator xato.",
    'Из уравнения 7x + 4 = 2x − 11 другой ученик получил такую строку: 7x − 2x = −11 + 4. Эта строка неверна.',
    'From the equation 7x + 4 = 2x − 11 another student produced this line: 7x − 2x = −11 + 4. That line is wrong.'),
  empty: L("Kartalarni bosib qator yig'ing", 'Собери строку, нажимая карточки', 'Build the line by tapping cards'),
  ask: L("To'g'ri qatorni yig'ing. Kursorni ko'chirish uchun yozuvdagi belgini bosing.",
    'Собери верную строку. Чтобы передвинуть курсор, нажми знак в записи.',
    'Build the correct line. To move the cursor, tap a sign in the record.'),
  undo: L('Bitta orqaga', 'Шаг назад', 'One back'),
  valueLabel: L('Qiymat:', 'Значение:', 'Value:'),
  correctText: L(
    "To'g'ri. Chap tomonda 4 QO'SHILGAN edi, ya'ni o'ngga ko'chganda AYIRILADI: 7x − 2x = −11 − 4.",
    'Верно. Слева 4 была ПРИБАВЛЕНА, значит при переносе направо она ВЫЧИТАЕТСЯ: 7x − 2x = −11 − 4.',
    'Correct. On the left the 4 was ADDED, so moving right it is SUBTRACTED: 7x − 2x = −11 − 4.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('eq') < s.seq.indexOf('x2'), text: L(
      "Noma'lumlar tenglik belgisidan CHAPDA to'planadi: 7x − 2x, keyin tenglik.",
      'Неизвестные собираются СЛЕВА от знака равенства: 7x − 2x, а потом равенство.',
      'The unknowns gather on the LEFT of the equals sign: 7x − 2x, then the equality.') },
    { when: (s) => s.seq.indexOf('n4') < s.seq.indexOf('n11'), text: L(
      "−11 o'z joyida qoldi, ya'ni u birinchi turadi. 4 esa ko'chib keldi va undan keyin yoziladi.",
      '−11 осталось на месте, значит оно идёт первым. А 4 перенесли, и она пишется после.',
      '−11 stayed where it was, so it comes first. The 4 moved over and is written after it.') },
    { when: (s) => s.seq[0] !== 'x7', text: L(
      "Qator 7x dan boshlanadi: u chap tomonda o'z joyida qolgan had.",
      'Строка начинается с 7x: это слагаемое осталось на месте в левой части.',
      'The line starts with 7x: that term stayed in place on the left.') },
  ],
  wrongText: L(
    "Ikki ko'chirishni ham eslang: 2x manfiy bo'lib chapga o'tdi, 4 esa manfiy bo'lib o'ngga o'tdi.",
    'Вспомни оба переноса: 2x ушло влево с минусом, а 4 ушла вправо тоже с минусом.',
    'Recall both moves: 2x went left with a minus, and the 4 went right with a minus too.'),
};

export default function D08_05(props) { return <BuildLine data={DATA} {...props} />; }
