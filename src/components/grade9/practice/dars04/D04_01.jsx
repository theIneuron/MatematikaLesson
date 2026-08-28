// Dars04 · Amaliyot 01 — Ikki parabola · 🟢 · teg: x0-formula-belgisi
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> Choice.
// Kontent: src/books/grade9/DARS04_AMALIYOT_KONTENT.md §01
//
// Savol MANTIQIY (TIPLAR §2.1 p. 1): javob to'rtta tayyor sondan emas,
// formulaning TUZILISHIDAN chiqadi — x₀ = −b/(2a) da c umuman
// qatnashmaydi. Birinchi variantda bu «uchi qaysi x da?» degan hisob
// savoli edi va qoidani buzardi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'x0-formula-belgisi', level: '🟢',
  correct: 0, optCols: 1,
  eyebrow: L('Ikki parabola', 'Две параболы', 'Two parabolas'),
  setup: L(
    'Ikki formulada faqat oxirgi son farq qiladi.',
    'В двух формулах различается только последнее число.',
    'The two formulas differ only in the last number.'),
  ask: L(
    'Bu ikki parabolaning uchlari haqida nima deyish mumkin?',
    'Что можно сказать о вершинах этих двух парабол?',
    'What can be said about the vertices of these two parabolas?'),
  givenLabel: L('Berilgan', 'Дано', 'Given'),
  given: [['y = 2x² − 8x + 1'], ['y = 2x² − 8x + 9']],
  opts: [
    { label: L('Uchlarining abssissalari bir xil.', 'Абсциссы вершин одинаковы.', 'Their abscissas are the same.') },
    { label: L('Uchlarining ordinatalari bir xil.', 'Ординаты вершин одинаковы.', 'Their ordinates are the same.') },
    { label: L("Ikkalasining ham uchi Oy o'qida.", 'У обеих вершина лежит на оси Oy.', 'Both vertices lie on the Oy axis.') },
    { label: L('Uchlari bir-biriga umuman bog\'liq emas.', 'Вершины никак не связаны между собой.', 'The vertices are not related at all.') },
  ],
  correctText: L(
    "To'g'ri. Uchining abssissasi faqat a va b dan hisoblanadi, ozod had formulaga umuman kirmaydi. Shuning uchun oxirgi sonni o'zgartirsangiz, parabola yuqoriga yoki pastga siljiydi, lekin uchi o'sha tik chiziqda qoladi. Ordinata esa o'zgaradi — u formulaga qo'yib topiladi.",
    'Верно. Абсцисса вершины считается только по a и b, свободный член в формулу вообще не входит. Поэтому если поменять последнее число, парабола сдвинется вверх или вниз, а вершина останется на той же вертикальной прямой. Ордината при этом меняется — её находят подстановкой в формулу.',
    'Correct. The abscissa of the vertex is computed from a and b only; the constant term does not enter the formula at all. So changing the last number shifts the parabola up or down while the vertex stays on the same vertical line. The ordinate does change — it is found by substituting into the formula.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Ordinata uchining abssissasini formulaga qo'yib topiladi, formulada esa oxirgi son bor. Ikki formulaga bir xil abssissani qo'ying va natijalarni solishtiring.",
      'Ординату находят подстановкой абсциссы вершины в формулу, а в формуле последнее число есть. Подставь одну и ту же абсциссу в обе формулы и сравни.',
      'The ordinate is found by putting the vertex abscissa into the formula, and the formula does contain the last number. Put the same abscissa into both formulas and compare.') },
    { when: (s) => s.picked === 2, text: L(
      "Uchi Oy o'qida faqat b nolga teng bo'lganda turadi. Bu yerda b minus sakkizga teng, ya'ni nol emas.",
      'Вершина лежит на оси Oy только когда b равно нулю. Здесь b равно минус восьми, то есть не нуль.',
      'The vertex lies on the Oy axis only when b is zero. Here b is minus eight, which is not zero.') },
    { when: (s) => s.picked === 3, text: L(
      "Ikki formulada a ham, b ham bir xil. Uchining abssissasi esa aynan shu ikki sondan hisoblanadi.",
      'В обеих формулах и a, и b одинаковы. А абсцисса вершины считается как раз по этим двум числам.',
      'Both formulas have the same a and the same b. And the abscissa of the vertex is computed from exactly those two numbers.') },
  ],
  wrongText: L(
    "Uchining abssissasi formulasini yozing va unda qaysi harflar borligiga qarang. Ozod had u yerda bormi?",
    'Выпиши формулу абсциссы вершины и посмотри, какие буквы в ней стоят. Есть ли там свободный член?',
    'Write out the formula for the abscissa of the vertex and see which letters appear in it. Is the constant term there?'),
};

export default function D04_01(props) { return <Choice data={DATA} {...props} />; }
