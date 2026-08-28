// Dars05 · Amaliyot 01 — Jadval · 🟢 · teg: uchi-notogri-oqish
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> RowTable.
// Kontent: src/books/grade9/DARS05_AMALIYOT_KONTENT.md §01
//
// Teskari katak uchiga qo'yilgan: −4 qiymati faqat bitta x da chiqadi,
// 0 esa ikkitasida. Jadvalning o'zi uchini nollardan ajratib turibdi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { RowTable } from '../asboblar9.jsx';

const DATA = {
  tag: 'uchi-notogri-oqish', level: '🟢',
  eyebrow: L('Jadval', 'Таблица', 'Table'),
  setup: L(
    "Yuqori qator — argument, pastki qator — qiymat. Jadval formuladan to'ldiriladi.",
    'Верхняя строка — аргумент, нижняя — значение. Таблица заполняется по формуле.',
    'The top row is the argument, the bottom row is the value. The table is filled from the formula.'),
  ask: L("Ikkita bo'sh katakni to'ldiring.", 'Заполни две пустые клетки.', 'Fill in the two empty cells.'),
  expr: ['y = (x − 1)² − 4'],
  xLabel: 'x', yLabel: 'y',
  cols: [
    { id: 'c1', x: '−1', y: '0' },
    { id: 'c2', x: '', y: '−4', ans: 1, hole: 'x' },
    { id: 'c3', x: '0', y: '', ans: -3, hole: 'y' },
    { id: 'c4', x: '3', y: '0' },
  ],
  correctText: L(
    "To'g'ri. Minus to'rt qiymati faqat bitta joyda, birda chiqadi — bu uchi. Nol esa ikki joyda: minus birda va uchda. Qavs ichida minus bir turgani uchun uchi o'ngga, birga siljigan.",
    'Верно. Значение минус четыре получается только в одном месте, при единице — это вершина. А нуль в двух: при минус единице и при трёх. В скобке стоит минус один, поэтому вершина сдвинута вправо, в единицу.',
    'Correct. The value minus four appears in one place only, at one — that is the vertex. Zero appears at two: at minus one and at three. The bracket holds x minus one, so the vertex is shifted to the right, to one.'),
  wrongs: [
    { when: (s) => s.vals.c2 === -4, text: L(
      "Bu katak yuqori qatorda, u yerga argument yoziladi. Minus to'rt — qiymat; savol esa u qaysi iks da chiqishi haqida.",
      'Эта клетка в верхней строке, туда пишут аргумент. Минус четыре — это значение; вопрос в том, при каком икс оно получается.',
      'This cell is in the top row, and the argument goes there. Minus four is a value; the question is at which x it appears.') },
    { when: (s) => s.vals.c2 === -1, text: L(
      "Ishora teskari olindi. Qavsda iks minus bir turibdi, demak qavs nolga aylanadigan son musbat.",
      'Знак взят наоборот. В скобке стоит икс минус один, значит число, при котором скобка обращается в нуль, положительное.',
      'The sign was taken the other way. The bracket holds x minus one, so the number that makes the bracket zero is positive.') },
    { when: (s) => s.vals.c3 === -4, text: L(
      "Nolni formulaga qo'ying: qavs ichida minus bir chiqadi, uning kvadrati bir, undan to'rt ayiriladi.",
      'Подставь нуль в формулу: в скобке получится минус один, его квадрат — единица, из неё вычитают четыре.',
      'Put zero into the formula: the bracket gives minus one, its square is one, and four is subtracted from it.') },
    { when: (s) => s.vals.c3 === -5, text: L(
      "Qavsning kvadratini oling: minus birning kvadrati manfiy emas.",
      'Возведи скобку в квадрат: квадрат минус единицы не отрицателен.',
      'Square the bracket: the square of minus one is not negative.') },
  ],
  wrongText: L(
    "To'ldirgan katagingizni formulaga qo'ying: qavs ichidagi ifodani hisoblang, kvadratga oshiring, keyin to'rt ayiring.",
    'Подставь заполненную клетку в формулу: посчитай скобку, возведи в квадрат, потом вычти четыре.',
    'Put the cell you filled into the formula: compute the bracket, square it, then subtract four.'),
};

export default function D05_01(props) { return <RowTable data={DATA} {...props} />; }
