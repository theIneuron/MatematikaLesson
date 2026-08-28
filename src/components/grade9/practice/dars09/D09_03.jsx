// Dars09 · Amaliyot 03 — Jadval · 🟢 · teg: sistema-ikkala-tenglama
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> RowTable.
//
// Jadval FAQAT birinchi tenglamadan tuzilgan: har ustun uni qanoatlantiradi.
// Lekin ular hali yechim emas — razbor aynan shuni ko'rsatadi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { RowTable } from '../asboblar9.jsx';

const DATA = {
  tag: 'sistema-ikkala-tenglama', level: '🟢',
  eyebrow: L('Jadval', 'Таблица', 'Table'),
  setup: L(
    "Jadval faqat birinchi tenglamadan tuzilgan: har ustunda yig'indi yettiga teng.",
    'Таблица составлена только по первому уравнению: в каждом столбце сумма равна семи.',
    'The table is built from the first equation only: in every column the sum is seven.'),
  ask: L("Ikkita bo'sh katakni to'ldiring.", 'Заполни две пустые клетки.', 'Fill in the two empty cells.'),
  expr: ['x + y = 7'],
  xLabel: 'x', yLabel: 'y',
  cols: [
    { id: 'c1', x: '1', y: '6' },
    { id: 'c2', x: '2', y: '5' },
    { id: 'c3', x: '', y: '3', ans: 4, hole: 'x' },
    { id: 'c4', x: '5', y: '', ans: 2, hole: 'y' },
  ],
  correctText: L(
    "To'g'ri. Jadvalning har bir ustuni birinchi tenglamani qanoatlantiradi, lekin ularning hammasi ham sistemaning yechimi emas. Ikkinchi tenglamani, ya'ni ko'paytmani ham tekshiring: to'rt karra uch o'n ikki — bu yechim; besh karra ikki esa o'n, o'n ikki emas.",
    'Верно. Каждый столбец таблицы удовлетворяет первому уравнению, но не все они — решения системы. Проверь и второе уравнение, произведение: четыре умножить на три — двенадцать, это решение; а пять умножить на два — десять, а не двенадцать.',
    'Correct. Every column of the table satisfies the first equation, but not all of them are solutions of the system. Check the second equation, the product, as well: four times three is twelve — that is a solution; five times two is ten, not twelve.'),
  wrongs: [
    { when: (s) => s.vals.c3 === 3, text: L(
      "Bu katak yuqori qatorda, u yerga iks yoziladi. Uch — bu igrek; iksni yig'indidan toping: nima qo'shsak uch bilan yetti chiqadi?",
      'Эта клетка в верхней строке, туда пишут икс. Тройка — это игрек; икс найди из суммы: что нужно прибавить к трём, чтобы вышло семь?',
      'This cell is in the top row, and x goes there. Three is the y; find x from the sum: what must be added to three to make seven?') },
    { when: (s) => s.vals.c3 === 10, text: L(
      "Yig'indi yettiga teng, ko'paytma emas. Yettidan uchni ayiring.",
      'Сумма равна семи, а не произведение. Вычти из семи тройку.',
      'The sum equals seven, not the product. Subtract three from seven.') },
    { when: (s) => s.vals.c4 === 12, text: L(
      "Bu ikkinchi tenglamaning soni. Jadval esa birinchisidan tuzilgan: yettidan beshni ayiring.",
      'Это число из второго уравнения. А таблица построена по первому: вычти из семи пятёрку.',
      'That is the number from the second equation. The table is built from the first: subtract five from seven.') },
    { when: (s) => s.vals.c4 !== null && s.vals.c4 !== 2, text: L(
      "Yig'indi yettiga teng bo'lishi kerak. Beshga nimani qo'shsak yetti chiqadi?",
      'Сумма должна равняться семи. Что нужно прибавить к пяти, чтобы вышло семь?',
      'The sum must be seven. What must be added to five to make seven?') },
  ],
  wrongText: L(
    "Jadval birinchi tenglamadan to'ldiriladi: har ustunda ikki son yettiga qo'shilishi kerak.",
    'Таблицу заполняют по первому уравнению: в каждом столбце два числа должны давать в сумме семь.',
    'The table is filled from the first equation: in every column the two numbers must add up to seven.'),
};

export default function D09_03(props) { return <RowTable data={DATA} {...props} />; }
