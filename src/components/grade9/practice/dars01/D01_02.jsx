// Dars01 · Amaliyot 02 — Jadval · 🟢 · teg: table_both_ways
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> RowTable.
// Kontent: src/books/grade9/DARS01_AMALIYOT_KONTENT.md §02
//
// Uchta bo'sh katakdan BITTASI argument qatorida: u yerda qiymat berilgan
// va argument tenglamadan topiladi. Aynan shu katak «argument bilan qiymat
// almashtirildi» xatosini tutadi — ikkala qator ham to'ldirilmasa, jadval
// bu adashishni umuman tekshirmaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { RowTable } from '../asboblar9.jsx';

const DATA = {
  tag: 'table_both_ways', level: '🟢',
  eyebrow: L('Jadval', 'Таблица', 'Table'),
  setup: L(
    "Yuqori qator — argument, pastki qator — qiymat. Jadval formuladan to'ldiriladi.",
    'Верхняя строка — аргумент, нижняя — значение. Таблица заполняется по формуле.',
    'The top row is the argument, the bottom row is the value. The table is filled from the formula.'),
  ask: L('Uchta bo\'sh katakni to\'ldiring.', 'Заполни три пустые клетки.', 'Fill in the three empty cells.'),
  expr: ['y = 3x − 5'],
  xLabel: 'x', yLabel: 'y',
  cols: [
    { id: 'c1', x: '1', y: '−2' },
    { id: 'c2', x: '2', y: '1' },
    { id: 'c3', x: '3', y: '', ans: 4, hole: 'y' },
    { id: 'c4', x: '', y: '10', ans: 5, hole: 'x' },
    { id: 'c5', x: '6', y: '', ans: 13, hole: 'y' },
  ],
  correctText: L(
    "To'g'ri. Ikkita katakda argument berilgan edi va qiymat hisoblandi, bitta katakda esa teskarisi: qiymat berilgan, argument tenglamadan topildi. Jadval ikki tomonga ham o'qiladi.",
    'Верно. В двух клетках был дан аргумент и вычислялось значение, а в одной наоборот: дано значение, а аргумент найден из уравнения. Таблица читается в обе стороны.',
    'Correct. In two cells the argument was given and the value was computed; in one cell it was the other way round: the value was given and the argument came from an equation. The table reads both ways.'),
  wrongs: [
    { when: (s) => s.vals.c4 === 10, text: L(
      "Bu katak yuqori qatorda turibdi, u yerga argument yoziladi. O'n — bu qiymat; undan argumentga o'tish uchun uch iks minus besh o'nga teng degan tenglamani yeching.",
      'Эта клетка в верхней строке, туда пишут аргумент. Десять — это значение; чтобы перейти к аргументу, реши уравнение три икс минус пять равно десяти.',
      'This cell is in the top row, and the argument goes there. Ten is a value; to get to the argument, solve three x minus five equals ten.') },
    { when: (s) => s.vals.c4 === 15, text: L(
      "Minus besh o'ng tomonga to'g'ri o'tkazildi, lekin uchga bo'lish qolib ketdi. Uch iks o'n beshga teng bo'lsa, iks nimaga teng?",
      'Минус пять перенесено верно, но деление на три пропущено. Если три икс равно пятнадцати, чему равен икс?',
      'The minus five was moved correctly, but the division by three was skipped. If three x equals fifteen, what does x equal?') },
    { when: (s) => s.vals.c4 !== null && s.vals.c4 !== 5, text: L(
      "Bu katakda tenglama yechiladi: uch iks minus besh o'nga teng. Avval minus beshni o'ng tomonga o'tkazing, keyin uchga bo'ling.",
      'В этой клетке решается уравнение: три икс минус пять равно десяти. Сначала перенеси минус пять вправо, потом раздели на три.',
      'This cell needs an equation solved: three x minus five equals ten. First move the minus five to the right, then divide by three.') },
    { when: (s) => s.vals.c3 === 9, text: L(
      "Ko'paytirish bajarildi, ayirish qolib ketdi. Formulada uchga ko'paytirishdan keyin yana bitta amal bor.",
      'Умножение сделано, вычитание пропущено. После умножения на три в формуле есть ещё одно действие.',
      'The multiplication was done, the subtraction was skipped. After multiplying by three the formula has one more operation.') },
    { when: (s) => s.vals.c3 === 14, text: L(
      'Belgi teskari olindi: formulada besh qo\'shilmaydi, ayriladi.',
      'Знак взят наоборот: в формуле пять не прибавляется, а вычитается.',
      'The sign was taken the other way: the formula subtracts five, it does not add it.') },
    { when: (s) => s.vals.c5 === 23 || s.vals.c5 === 18, text: L(
      "Oltinchi katakda ham xuddi shu formula ishlaydi: avval uchga ko'paytiring, keyin besh ayiring.",
      'В шестой клетке работает та же формула: сначала умножь на три, потом вычти пять.',
      'The same formula works in the sixth cell: multiply by three first, then subtract five.') },
    { when: (s) => s.bad.indexOf('c5') !== -1, text: L(
      "Katak oldingi katakka qarab emas, formulaga qarab to'ldiriladi. Oltini formulaga qo'ying.",
      'Клетка заполняется по формуле, а не по предыдущей клетке. Подставь шесть в формулу.',
      'A cell is filled from the formula, not from the previous cell. Put six into the formula.') },
  ],
  wrongText: L(
    "To'ldirgan har bir katagingizni formulaga qo'yib tekshiring: shu songa uchni ko'paytirib, besh ayirsangiz nima chiqadi?",
    'Проверь каждую заполненную клетку подстановкой: что даёт это число, умноженное на три, минус пять?',
    'Check every cell you filled by substitution: what does this number times three, minus five, give?'),
};

export default function D01_02(props) { return <RowTable data={DATA} {...props} />; }
