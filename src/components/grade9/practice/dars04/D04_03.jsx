// Dars04 · Amaliyot 03 — Jadval · 🟢 · teg: nosimmetrik-nuqtalar
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> RowTable.
// Kontent: src/books/grade9/DARS04_AMALIYOT_KONTENT.md §03
//
// Jadval simmetriyani KO'RSATIB turadi: chetlarda ikkala qiymat ham uch,
// nollar uchidan teng uzoqlikda. Teskari katak uchiga qo'yilgan — u
// yagona, chunki qolgan qiymatlar ikkita x da uchraydi.
//
// FUNKSIYA: y = x² + 4x + 3 , nollari −3 va −1, uchi (−2; −1).
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { RowTable } from '../asboblar9.jsx';

const DATA = {
  tag: 'nosimmetrik-nuqtalar', level: '🟢',
  eyebrow: L('Jadval', 'Таблица', 'Table'),
  setup: L(
    "Yuqori qator — argument, pastki qator — qiymat. Jadval formuladan to'ldiriladi.",
    'Верхняя строка — аргумент, нижняя — значение. Таблица заполняется по формуле.',
    'The top row is the argument, the bottom row is the value. The table is filled from the formula.'),
  ask: L("Ikkita bo'sh katakni to'ldiring.", 'Заполни две пустые клетки.', 'Fill in the two empty cells.'),
  expr: ['y = x² + 4x + 3'],
  xLabel: 'x', yLabel: 'y',
  cols: [
    { id: 'c1', x: '−4', y: '3' },
    { id: 'c2', x: '−3', y: '0' },
    { id: 'c3', x: '', y: '−1', ans: -2, hole: 'x' },
    { id: 'c4', x: '−1', y: '0' },
    { id: 'c5', x: '0', y: '', ans: 3, hole: 'y' },
  ],
  correctText: L(
    "To'g'ri. Minus bir qiymati faqat bitta joyda, minus ikkida chiqadi — bu uchi. Jadvalning o'zi simmetriyani ko'rsatib turibdi: chetlarda ikkala qiymat ham uchga teng, nollar esa uchidan teng uzoqlikda, bittasi chapda, bittasi o'ngda.",
    'Верно. Значение минус один получается только в одном месте, при минус двух — это вершина. Сама таблица показывает симметрию: по краям оба значения равны трём, а нули стоят на равном расстоянии от вершины, один слева, другой справа.',
    'Correct. The value minus one appears in one place only, at minus two — that is the vertex. The table itself shows the symmetry: at both ends the value is three, and the zeros stand at equal distance from the vertex, one on the left and one on the right.'),
  wrongs: [
    { when: (s) => s.vals.c3 === -1, text: L(
      "Bu katak yuqori qatorda, u yerga argument yoziladi. Minus bir — qiymat; savol esa u qaysi iks da chiqishi haqida.",
      'Эта клетка в верхней строке, туда пишут аргумент. Минус один — это значение; вопрос в том, при каком икс оно получается.',
      'This cell is in the top row, and the argument goes there. Minus one is a value; the question is at which x it appears.') },
    { when: (s) => s.vals.c3 === 2, text: L(
      "Ishora tushib qoldi. Jadvalning yuqori qatoriga qarang: qolgan sonlar qaysi tomonda turibdi?",
      'Знак потерялся. Посмотри на верхнюю строку таблицы: с какой стороны стоят остальные числа?',
      'The sign was lost. Look at the top row of the table: on which side do the other numbers stand?') },
    { when: (s) => s.vals.c5 === 0, text: L(
      "Nolni formulaga qo'ying: birinchi ikki had yo'qoladi, oxirgi son esa qoladi.",
      'Подставь нуль в формулу: первые два слагаемых исчезнут, а последнее число останется.',
      'Put zero into the formula: the first two terms vanish, but the last number stays.') },
    { when: (s) => s.vals.c5 === 7, text: L(
      "To'rtni ham qo'shib yubordingiz. Nolni to'rtga ko'paytirsangiz nima chiqadi?",
      'Ты прибавил ещё и четвёрку. Что получится, если умножить нуль на четыре?',
      'You added the four as well. What do you get when you multiply zero by four?') },
  ],
  wrongText: L(
    "To'ldirgan katagingizni formulaga qo'ying va tekshiring. Jadvalning chap va o'ng chetidagi sonlar bir xil ekaniga ham e'tibor bering.",
    'Подставь заполненную клетку в формулу и проверь. Обрати внимание и на то, что числа по краям таблицы одинаковы.',
    'Put the cell you filled into the formula and check. Notice too that the numbers at the two ends of the table are the same.'),
};

export default function D04_03(props) { return <RowTable data={DATA} {...props} />; }
