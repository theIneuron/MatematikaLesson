// Dars07 · Amaliyot 02 — Jadval · 🟢 · teg: had-kochirish-ishorasi
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> RowTable.
//
// Teskari katakda tenglama yechiladi: 4x − 9 = 11. Aynan shu yerda had
// ko'chirish ishorasi tekshiriladi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { RowTable } from '../asboblar9.jsx';

const DATA = {
  tag: 'had-kochirish-ishorasi', level: '🟢',
  eyebrow: L('Jadval', 'Таблица', 'Table'),
  setup: L(
    "Yuqori qator — argument, pastki qator — qiymat. Jadval formuladan to'ldiriladi.",
    'Верхняя строка — аргумент, нижняя — значение. Таблица заполняется по формуле.',
    'The top row is the argument, the bottom row is the value. The table is filled from the formula.'),
  ask: L("Ikkita bo'sh katakni to'ldiring.", 'Заполни две пустые клетки.', 'Fill in the two empty cells.'),
  expr: ['y = 4x − 9'],
  xLabel: 'x', yLabel: 'y',
  cols: [
    { id: 'c1', x: '1', y: '−5' },
    { id: 'c2', x: '3', y: '3' },
    { id: 'c3', x: '', y: '11', ans: 5, hole: 'x' },
    { id: 'c4', x: '6', y: '', ans: 15, hole: 'y' },
  ],
  correctText: L(
    "To'g'ri. Bitta katakda argument berilgan edi va qiymat hisoblandi, ikkinchisida esa teskarisi: qiymat berilgan, argument tenglamadan topildi. Minus to'qqiz o'ng tomonga o'tganda qo'shuv to'qqiz bo'ldi — ko'chirilgan hadning ishorasi almashadi.",
    'Верно. В одной клетке был дан аргумент и вычислялось значение, в другой наоборот: дано значение, а аргумент найден из уравнения. Минус девять при переносе вправо стало плюс девять — у перенесённого слагаемого знак меняется.',
    'Correct. In one cell the argument was given and the value computed; in the other it was the other way round: the value was given and the argument came from an equation. Minus nine became plus nine when moved to the right — a term that moves changes sign.'),
  wrongs: [
    { when: (s) => s.vals.c3 === 11, text: L(
      "Bu katak yuqori qatorda, u yerga argument yoziladi. O'n bir — qiymat; undan argumentga o'tish uchun to'rt iks minus to'qqiz o'n birga teng degan tenglamani yeching.",
      'Эта клетка в верхней строке, туда пишут аргумент. Одиннадцать — это значение; чтобы перейти к аргументу, реши уравнение четыре икс минус девять равно одиннадцати.',
      'This cell is in the top row, and the argument goes there. Eleven is a value; to get to the argument, solve four x minus nine equals eleven.') },
    { when: (s) => s.vals.c3 === 20, text: L(
      "Minus to'qqiz to'g'ri o'tkazildi, lekin to'rtga bo'lish qolib ketdi. To'rt iks yigirmaga teng bo'lsa, iks nimaga teng?",
      'Минус девять перенесено верно, но деление на четыре пропущено. Если четыре икс равно двадцати, чему равен икс?',
      'The minus nine was moved correctly, but the division by four was skipped. If four x equals twenty, what does x equal?') },
    { when: (s) => s.vals.c3 !== null && s.vals.c3 !== 5, text: L(
      "Minus to'qqizni o'ng tomonga o'tkazing va ishorasini almashtiring, keyin to'rtga bo'ling.",
      'Перенеси минус девять вправо, поменяв знак, потом раздели на четыре.',
      'Move the minus nine to the right changing its sign, then divide by four.') },
    { when: (s) => s.vals.c4 === 33, text: L(
      "Bu ko'paytirish emas: to'rt oltiga ko'paytirilgach, to'qqiz AYIRILADI.",
      'Это не умножение: после умножения четырёх на шесть девять ВЫЧИТАЕТСЯ.',
      'This is not just multiplication: after four times six, nine is SUBTRACTED.') },
  ],
  wrongText: L(
    "To'ldirgan katagingizni formulaga qo'ying: shu sonni to'rtga ko'paytirib, to'qqiz ayirsangiz nima chiqadi?",
    'Подставь заполненную клетку в формулу: что получится, если это число умножить на четыре и вычесть девять?',
    'Put the cell you filled into the formula: what do you get if you multiply that number by four and subtract nine?'),
};

export default function D07_02(props) { return <RowTable data={DATA} {...props} />; }
