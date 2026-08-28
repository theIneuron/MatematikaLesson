// Dars03 · Amaliyot 03 — Jadval · 🟢 · teg: nol-vs-vershina
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> RowTable.
// Kontent: src/books/grade9/DARS03_AMALIYOT_KONTENT.md §03
//
// Teskari katak ATAYIN uchiga qo'yilgan. Sabab matematik: kvadrat
// funksiyada qolgan har qanday qiymat IKKITA x da uchraydi, ya'ni katak
// ikki javobli bo'lib qolardi. Uchining qiymati esa bitta x da — katak
// bir qiymatli bo'ladi va `nol-vs-vershina` o'z-o'zidan ochiladi:
// jadvalda nollar (−3 va 3) ham, uchi (0) ham ko'rinib turibdi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { RowTable } from '../asboblar9.jsx';

const DATA = {
  tag: 'nol-vs-vershina', level: '🟢',
  eyebrow: L('Jadval', 'Таблица', 'Table'),
  setup: L(
    "Yuqori qator — argument, pastki qator — qiymat. Jadval formuladan to'ldiriladi.",
    'Верхняя строка — аргумент, нижняя — значение. Таблица заполняется по формуле.',
    'The top row is the argument, the bottom row is the value. The table is filled from the formula.'),
  ask: L("Ikkita bo'sh katakni to'ldiring.", 'Заполни две пустые клетки.', 'Fill in the two empty cells.'),
  expr: ['y = x² − 9'],
  xLabel: 'x', yLabel: 'y',
  cols: [
    { id: 'c1', x: '−3', y: '0' },
    { id: 'c2', x: '', y: '−9', ans: 0, hole: 'x' },
    { id: 'c3', x: '2', y: '', ans: -5, hole: 'y' },
    { id: 'c4', x: '3', y: '0' },
  ],
  correctText: L(
    "To'g'ri. Minus to'qqiz qiymati faqat bitta joyda, nolda chiqadi — bu parabolaning uchi. Nol qiymati esa ikki joyda: minus uchda va uchda. Ular funksiyaning nollari. Jadvalning o'zi uchini nollardan ajratib turibdi.",
    'Верно. Значение минус девять получается только в одном месте, при нуле — это вершина параболы. А значение нуль — в двух: при минус трёх и при трёх. Это нули функции. Сама таблица отделяет вершину от нулей.',
    'Correct. The value minus nine appears in one place only, at zero — that is the vertex of the parabola. The value zero appears in two: at minus three and at three. Those are the zeros of the function. The table itself separates the vertex from the zeros.'),
  wrongs: [
    { when: (s) => s.vals.c2 === -9, text: L(
      "Bu katak yuqori qatorda, u yerga argument yoziladi. Minus to'qqiz — qiymat; savol esa u qaysi iks da chiqishi haqida.",
      'Эта клетка в верхней строке, туда пишут аргумент. Минус девять — это значение; вопрос в том, при каком икс оно получается.',
      'This cell is in the top row, and the argument goes there. Minus nine is a value; the question is at which x it appears.') },
    { when: (s) => s.vals.c2 === 3 || s.vals.c2 === -3, text: L(
      "Uch va minus uchda qiymat nolga teng, minus to'qqizga emas. Ular funksiyaning nollari, uchi esa boshqa joyda.",
      'При трёх и минус трёх значение равно нулю, а не минус девяти. Это нули функции, а вершина в другом месте.',
      'At three and minus three the value is zero, not minus nine. Those are the zeros of the function; the vertex is elsewhere.') },
    { when: (s) => s.vals.c3 === 5, text: L(
      "Ishora teskari olindi: to'rtdan to'qqiz ayrilyapti, teskarisi emas.",
      'Знак взят наоборот: из четырёх вычитают девять, а не наоборот.',
      'The sign was taken the other way: nine is subtracted from four, not the reverse.') },
    { when: (s) => s.vals.c3 === 13 || s.vals.c3 === -13, text: L(
      "Ikkining kvadrati to'rt. Undan to'qqizni ayiring: natija musbat bo'ladimi yoki manfiy?",
      'Два в квадрате — четыре. Вычти из неё девять: результат будет положительным или отрицательным?',
      'Two squared is four. Subtract nine from it: is the result positive or negative?') },
  ],
  wrongText: L(
    "To'ldirgan katagingizni formulaga qo'yib tekshiring: shu sonning kvadratidan to'qqiz ayirilsa nima chiqadi?",
    'Проверь заполненную клетку подстановкой: что выйдет, если из квадрата этого числа вычесть девять?',
    'Check the cell you filled by substitution: what do you get if you subtract nine from the square of that number?'),
};

export default function D03_03(props) { return <RowTable data={DATA} {...props} />; }
