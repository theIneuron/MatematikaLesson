// Dars06 · Amaliyot 02 — Jadval · 🟢 · teg: belgi-almashtirish-notogri
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> RowTable.
// Kontent: src/books/grade9/DARS06_AMALIYOT_KONTENT.md §02
//
// Teskari katak uchiga qo'yilgan: −9 faqat bitta x da chiqadi, 0 esa
// ikkitasida. Jadvalda ishora ikki marta almashadi — bu `belgi-almashtirish`
// ni sonlarda ko'rsatadi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { RowTable } from '../asboblar9.jsx';

const DATA = {
  tag: 'belgi-almashtirish-notogri', level: '🟢',
  eyebrow: L('Jadval', 'Таблица', 'Table'),
  setup: L(
    "Yuqori qator — argument, pastki qator — qiymat. Jadval ko'paytmadan to'ldiriladi.",
    'Верхняя строка — аргумент, нижняя — значение. Таблица заполняется по произведению.',
    'The top row is the argument, the bottom row is the value. The table is filled from the product.'),
  ask: L("Ikkita bo'sh katakni to'ldiring.", 'Заполни две пустые клетки.', 'Fill in the two empty cells.'),
  expr: ['y = (x + 1)(x − 5)'],
  xLabel: 'x', yLabel: 'y',
  cols: [
    { id: 'c1', x: '−2', y: '7' },
    { id: 'c2', x: '−1', y: '0' },
    { id: 'c3', x: '', y: '−9', ans: 2, hole: 'x' },
    { id: 'c4', x: '5', y: '0' },
    { id: 'c5', x: '6', y: '', ans: 7, hole: 'y' },
  ],
  correctText: L(
    "To'g'ri. Minus to'qqiz faqat bitta joyda, ikkida chiqadi — bu uchi. Nol esa ikki joyda: minus birda va beshda, bular nollar. Jadvalda ishora ikki marta almashadi: minus birgacha musbat, oraliqda manfiy, beshdan keyin yana musbat.",
    'Верно. Минус девять получается только в одном месте, при двух — это вершина. А нуль в двух: при минус единице и при пяти, это нули. В таблице знак меняется дважды: до минус единицы положительно, между — отрицательно, после пяти снова положительно.',
    'Correct. Minus nine appears in one place only, at two — that is the vertex. Zero appears at two places: at minus one and at five, those are the zeros. The sign changes twice across the table: positive before minus one, negative in between, positive again after five.'),
  wrongs: [
    { when: (s) => s.vals.c3 === -9, text: L(
      "Bu katak yuqori qatorda, u yerga argument yoziladi. Minus to'qqiz — qiymat; savol esa u qaysi iks da chiqishi haqida.",
      'Эта клетка в верхней строке, туда пишут аргумент. Минус девять — это значение; вопрос в том, при каком икс оно получается.',
      'This cell is in the top row, and the argument goes there. Minus nine is a value; the question is at which x it appears.') },
    { when: (s) => s.vals.c3 === -2 || s.vals.c3 === 5, text: L(
      "Bu sonlarda qiymat boshqa: jadvalda ular allaqachon yozilgan. Minus to'qqiz esa faqat bitta joyda chiqadi.",
      'При этих числах значение другое: они уже выписаны в таблице. А минус девять получается лишь в одном месте.',
      'At these numbers the value is different: they are already written in the table. Minus nine appears in one place only.') },
    { when: (s) => s.vals.c5 === -7, text: L(
      "Oltini ikkala qavsga qo'ying: yetti va bir. Ikkalasi ham musbat, demak ko'paytma ham musbat.",
      'Подставь шесть в обе скобки: семь и один. Обе положительны, значит и произведение положительно.',
      'Put six into both brackets: seven and one. Both are positive, so the product is positive too.') },
    { when: (s) => s.vals.c5 === 6 || s.vals.c5 === 11, text: L(
      "Bu qo'shish emas, KO'PAYTMA. Ikki qavsning qiymatini alohida hisoblab, keyin ko'paytiring.",
      'Это не сложение, а ПРОИЗВЕДЕНИЕ. Посчитай каждую скобку отдельно, потом перемножь.',
      'This is not addition but a PRODUCT. Compute each bracket separately, then multiply.') },
  ],
  wrongText: L(
    "Har katakda ikkala qavsni alohida hisoblang, keyin ko'paytiring. Ishorani ham unutmang: ikki manfiy son musbat beradi.",
    'В каждой клетке посчитай обе скобки отдельно, потом перемножь. Не забывай про знак: два отрицательных дают положительное.',
    'In each cell compute both brackets separately, then multiply. Do not forget the sign: two negatives give a positive.'),
};

export default function D06_02(props) { return <RowTable data={DATA} {...props} />; }
