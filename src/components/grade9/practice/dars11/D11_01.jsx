// Dars11 · Amaliyot 01 — Jadval · 🟢 · teg: ozgaruvchini-ifodalash-xatosi
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> RowTable.
//
// Jadval o'rniga qo'yishning BIRINCHI qadamini ushlaydi: `x + y = 5` dan
// ifodalangan `y = 5 − x`. Bo'sh katak ikkala qatorda ham turadi, ya'ni
// ifoda ikki tomonga ham ishlatiladi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { RowTable } from '../asboblar9.jsx';

const DATA = {
  tag: 'ozgaruvchini-ifodalash-xatosi', level: '🟢',
  eyebrow: L('Jadval', 'Таблица', 'Table'),
  setup: L(
    "Birinchi tenglamadan igrek ifodalandi. Jadval shu ifoda bo'yicha to'ldiriladi.",
    'Из первого уравнения выражен игрек. Таблица заполняется по этому выражению.',
    'y has been expressed from the first equation. The table is filled from that expression.'),
  ask: L("Ikkita bo'sh katakni to'ldiring.", 'Заполни две пустые клетки.', 'Fill in the two empty cells.'),
  expr: ['y = 5 − x'],
  xLabel: 'x', yLabel: 'y',
  cols: [
    { id: 'c1', x: '1', y: '4' },
    { id: 'c2', x: '2', y: '', ans: 3, hole: 'y' },
    { id: 'c3', x: '', y: '1', ans: 4, hole: 'x' },
    { id: 'c4', x: '5', y: '0' },
  ],
  correctText: L(
    "To'g'ri. Ikkinchi ustunda igrek besh minus ikki, ya'ni uch; uchinchisida esa igrek berilgan va iks so'ralgan, yig'indi beshga teng bo'lishi uchun iks to'rtga teng. Ifodaning kuchi ana shunda: u iksdan igrekni ham, igrekdan iksni ham beradi. Aynan shu ifoda ikkinchi tenglamaga qo'yiladi.",
    'Верно. Во втором столбце игрек равен пять минус два, то есть трём; в третьем дан игрек, а спрашивают икс, и чтобы сумма была пять, икс равен четырём. В этом и сила выражения: оно даёт и игрек по иксу, и икс по игреку. Именно это выражение подставляют во второе уравнение.',
    'Correct. In the second column y is five minus two, that is three; in the third y is given and x is asked, and for the sum to be five, x is four. That is the power of the expression: it gives y from x and x from y alike. This very expression is what gets substituted into the second equation.'),
  wrongs: [
    { when: (s) => s.vals.c2 === 7, text: L(
      "Ikkinchi ustunda qo'shildi, ayirilmadi. Ifodada besh MINUS iks turibdi: besh minus ikki uchga teng.",
      'Во втором столбце сложили, а не вычли. В выражении стоит пять МИНУС икс: пять минус два — три.',
      'In the second column you added instead of subtracting. The expression says five MINUS x: five minus two is three.') },
    { when: (s) => s.vals.c3 === 6, text: L(
      "Uchinchi ustunda igrek berilgan, iks so'ralyapti. Iks bilan igrekning yig'indisi beshga teng: bir qo'shuv nechchi besh beradi?",
      'В третьем столбце дан игрек, а спрашивают икс. Сумма икса и игрека равна пяти: один плюс сколько даёт пять?',
      'In the third column y is given and x is asked. The sum of x and y is five: one plus what makes five?') },
    { when: (s) => s.vals.c3 === -4, text: L(
      "Uchinchi ustunda ishora tushib qoldi. Ifodani teskari o'qing: iks besh minus igrekka teng, ya'ni besh minus bir.",
      'В третьем столбце потерялся знак. Прочитай выражение в обратную сторону: икс равен пять минус игрек, то есть пять минус один.',
      'A sign was lost in the third column. Read the expression backwards: x equals five minus y, that is five minus one.') },
    { when: (s) => s.vals.c2 === 2 || s.vals.c3 === 1, text: L(
      "Katakka ustunning ikkinchi soni ko'chirilgan. Har katakni jadval tepasidagi ifoda bilan hisoblang, qo'shni katakdan ko'chirmang.",
      'В клетку переписано второе число того же столбца. Считай каждую клетку по выражению над таблицей, а не переписывай из соседней.',
      'The other number of the same column was copied into the cell. Compute each cell from the expression above the table, do not copy from the neighbour.') },
  ],
  wrongText: L(
    "Har katakni jadval tepasidagi ifoda bilan tekshiring: igrek besh minus iks. Berilgan sonni ifodaga qo'ying va ikkinchisini toping.",
    'Проверяй каждую клетку по выражению над таблицей: игрек равен пять минус икс. Подставь известное число и найди второе.',
    'Check each cell against the expression above the table: y equals five minus x. Substitute the known number and find the other.'),
};

export default function D11_01(props) { return <RowTable data={DATA} {...props} />; }
