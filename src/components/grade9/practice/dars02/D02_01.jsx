// Dars02 · Amaliyot 01 — Jadval · 🟢 · teg: oyna-vs-burilish
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> RowTable.
// Kontent: src/books/grade9/DARS02_AMALIYOT_KONTENT.md §01
//
// Toqlik SONLARDA ko'rsatiladi, hali so'z aytilmasdan: chap tomondagi
// qiymatlar o'ng tomondagilarning qarama-qarshisi. Ikkinchi bo'sh katak
// ATAYIN argument qatorida (TIPLAR §2.1 p. 6).
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { RowTable } from '../asboblar9.jsx';

const DATA = {
  tag: 'oyna-vs-burilish', level: '🟢',
  eyebrow: L('Jadval', 'Таблица', 'Table'),
  setup: L(
    "Yuqori qator — argument, pastki qator — qiymat. Jadval formuladan to'ldiriladi.",
    'Верхняя строка — аргумент, нижняя — значение. Таблица заполняется по формуле.',
    'The top row is the argument, the bottom row is the value. The table is filled from the formula.'),
  ask: L("Ikkita bo'sh katakni to'ldiring.", 'Заполни две пустые клетки.', 'Fill in the two empty cells.'),
  expr: ['y = 5x'],
  xLabel: 'x', yLabel: 'y',
  cols: [
    { id: 'c1', x: '−2', y: '', ans: -10, hole: 'y' },
    { id: 'c2', x: '−1', y: '−5' },
    { id: 'c3', x: '1', y: '5' },
    { id: 'c4', x: '', y: '10', ans: 2, hole: 'x' },
  ],
  correctText: L(
    "To'g'ri. Minus ikkida qiymat minus o'nga teng, ikkida esa o'nga. Ikkala qiymat faqat ishora bilan farq qiladi. Butun jadval shu naqshda: chap tomondagi sonlar o'ng tomondagilarning qarama-qarshisi.",
    'Верно. При минус двух значение равно минус десяти, а при двух — десяти. Оба значения отличаются только знаком. Вся таблица устроена так: числа слева противоположны числам справа.',
    'Correct. At minus two the value is minus ten, at two it is ten. The two values differ only in sign. The whole table works that way: the numbers on the left are the opposites of those on the right.'),
  wrongs: [
    { when: (s) => s.vals.c1 === 10, text: L(
      "Ishora tushib qoldi. Minus ikkini beshga ko'paytiring: ko'paytuvchilardan bittasi manfiy bo'lsa, ko'paytma qanday bo'ladi?",
      'Знак потерялся. Умножь минус два на пять: каким будет произведение, если один из множителей отрицательный?',
      'The sign was lost. Multiply minus two by five: what is a product when one factor is negative?') },
    { when: (s) => s.vals.c4 === 10, text: L(
      "Bu katak yuqori qatorda, u yerga argument yoziladi. O'n — bu qiymat; undan argumentga o'tish uchun besh iks o'nga teng degan tenglamani yeching.",
      'Эта клетка в верхней строке, туда пишут аргумент. Десять — это значение; чтобы перейти к аргументу, реши уравнение пять икс равно десяти.',
      'This cell is in the top row, and the argument goes there. Ten is a value; to get to the argument, solve five x equals ten.') },
    { when: (s) => s.vals.c4 === 50, text: L(
      "O'nni beshga ko'paytirdingiz. Bu katakda esa aksincha amal kerak: qiymatdan argumentga qaytish uchun beshga bo'linadi.",
      'Ты умножил десять на пять. А в этой клетке нужно обратное действие: чтобы вернуться от значения к аргументу, делят на пять.',
      'You multiplied ten by five. This cell needs the opposite operation: to get back from the value to the argument you divide by five.') },
  ],
  wrongText: L(
    "To'ldirgan har bir katagingizni formulaga qo'yib tekshiring: shu sonni beshga ko'paytirsangiz nima chiqadi?",
    'Проверь каждую заполненную клетку подстановкой: что получится, если это число умножить на пять?',
    'Check every cell you filled by substitution: what do you get if you multiply that number by five?'),
};

export default function D02_01(props) { return <RowTable data={DATA} {...props} />; }
