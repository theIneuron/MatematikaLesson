// Dars08 · Amaliyot 01 — Jadval · 🟢 · teg: butun-deb-kasr-oqish
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> RowTable.
//
// Jadval kasrning o'zini hisoblashni talab qiladi: maxraj har katakda
// qayta hisoblanadi. Teskari katak esa tenglamani beradi: 12/(x−2) = −12.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { RowTable } from '../asboblar9.jsx';

const DATA = {
  tag: 'butun-deb-kasr-oqish', level: '🟢',
  eyebrow: L('Jadval', 'Таблица', 'Table'),
  setup: L(
    "Yuqori qator — argument, pastki qator — qiymat. Har katakda avval maxraj hisoblanadi.",
    'Верхняя строка — аргумент, нижняя — значение. В каждой клетке сначала считают знаменатель.',
    'The top row is the argument, the bottom row is the value. In each cell the denominator is computed first.'),
  ask: L("Ikkita bo'sh katakni to'ldiring.", 'Заполни две пустые клетки.', 'Fill in the two empty cells.'),
  expr: ['y =', { n: '12', d: 'x − 2' }],
  xLabel: 'x', yLabel: 'y',
  cols: [
    { id: 'c1', x: '−1', y: '−4' },
    { id: 'c2', x: '', y: '−12', ans: 1, hole: 'x' },
    { id: 'c3', x: '4', y: '6' },
    { id: 'c4', x: '5', y: '', ans: 4, hole: 'y' },
  ],
  correctText: L(
    "To'g'ri. Birda maxraj minus birga aylanadi, o'n ikkini unga bo'lsak minus o'n ikki chiqadi. Beshda esa maxraj uch, o'n ikkini uchga bo'lsak to'rt. Har katakda avval maxraj hisoblanadi, keyin bo'lish bajariladi — kasrni butun ifoda kabi o'qib bo'lmaydi.",
    'Верно. При единице знаменатель обращается в минус один, и двенадцать, делённое на него, даёт минус двенадцать. При пяти знаменатель равен трём, и двенадцать делить на три — четыре. В каждой клетке сначала считают знаменатель, потом делят: дробь нельзя читать как целое выражение.',
    'Correct. At one the denominator becomes minus one, and twelve divided by it gives minus twelve. At five the denominator is three, and twelve divided by three is four. In every cell the denominator comes first and then the division: a fraction cannot be read like an integer expression.'),
  wrongs: [
    { when: (s) => s.vals.c2 === -12, text: L(
      "Bu katak yuqori qatorda, u yerga argument yoziladi. Minus o'n ikki — qiymat; savol esa u qaysi iks da chiqishi haqida.",
      'Эта клетка в верхней строке, туда пишут аргумент. Минус двенадцать — это значение; вопрос в том, при каком икс оно получается.',
      'This cell is in the top row, and the argument goes there. Minus twelve is a value; the question is at which x it appears.') },
    { when: (s) => s.vals.c2 === -10, text: L(
      "Maxrajni minus o'n ikkiga teng deb oldingiz. To'g'ri savol boshqa: maxraj qanday bo'lganda o'n ikkini unga bo'lganda minus o'n ikki chiqadi?",
      'Ты приравнял к минус двенадцати сам знаменатель. Верный вопрос другой: каким должен быть знаменатель, чтобы двенадцать, делённое на него, дало минус двенадцать?',
      'You set the denominator itself to minus twelve. The right question is different: what must the denominator be so that twelve divided by it gives minus twelve?') },
    { when: (s) => s.vals.c4 === 12, text: L(
      "Maxraj hisobga olinmadi: beshda u uchga teng. O'n ikkini uchga bo'ling.",
      'Знаменатель не учтён: при пяти он равен трём. Раздели двенадцать на три.',
      'The denominator was ignored: at five it equals three. Divide twelve by three.') },
    { when: (s) => s.vals.c4 !== null && s.vals.c4 !== 4, text: L(
      "Avval maxrajni hisoblang: besh minus ikki. Keyin o'n ikkini shu songa bo'ling.",
      'Сначала посчитай знаменатель: пять минус два. Потом раздели на него двенадцать.',
      'Compute the denominator first: five minus two. Then divide twelve by that number.') },
  ],
  wrongText: L(
    "Har katakda ikki qadam bor: avval maxrajni hisoblang, keyin o'n ikkini unga bo'ling. Ishorani ham unutmang.",
    'В каждой клетке два шага: сначала посчитай знаменатель, потом раздели на него двенадцать. Не забывай про знак.',
    'Every cell has two steps: compute the denominator first, then divide twelve by it. Do not forget the sign.'),
};

export default function D08_01(props) { return <RowTable data={DATA} {...props} />; }
