// Dars14 · Amaliyot 01 — Jadval · 🟢 · teg: urinish-notogri-oqish
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> RowTable.
//
// Jadval takroriy ildizni SONLAR bilan ko'rsatadi: nol faqat bitta joyda
// turadi, uning ikki tomonida esa bir xil qiymatlar — to'rt va to'rt.
// Ya'ni ishora almashmaydi, va buni jadvalning o'zi aytib beradi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { RowTable } from '../asboblar9.jsx';

const DATA = {
  tag: 'urinish-notogri-oqish', level: '🟢',
  eyebrow: L('Jadval', 'Таблица', 'Table'),
  setup: L(
    "Bu funksiyaning diskriminanti nolga teng. Jadval buni sonlarda ko'rsatadi.",
    'У этой функции дискриминант равен нулю. Таблица показывает это в числах.',
    'This function has discriminant zero. The table shows it in numbers.'),
  ask: L("Ikkita bo'sh katakni to'ldiring.", 'Заполни две пустые клетки.', 'Fill in the two empty cells.'),
  expr: ['y = (x − 5)²'],
  xLabel: 'x', yLabel: 'y',
  cols: [
    { id: 'c1', x: '3', y: '4' },
    { id: 'c2', x: '4', y: '1' },
    { id: 'c3', x: '', y: '0', ans: 5, hole: 'x' },
    { id: 'c4', x: '7', y: '', ans: 4, hole: 'y' },
  ],
  correctText: L(
    "To'g'ri. Nol faqat iks beshga teng bo'lganda chiqadi: kvadrat nolga aylanishi uchun qavsning ichi nol bo'lishi kerak. Endi jadvalning eng muhim gapi: uchda to'rt, yettida ham to'rt — beshning ikki tomonida bir xil qiymatlar turibdi, va ikkalasi ham MUSBAT. Kvadrat hech qachon manfiy bo'lmaydi, shuning uchun bu funksiya nolni faqat bir joyda ushlaydi va ishorasini hech qachon almashtirmaydi.",
    'Верно. Нуль выходит только при иксе, равном пяти: чтобы квадрат обратился в нуль, внутри скобки должен быть нуль. А теперь главное в таблице: при трёх — четыре, при семи — тоже четыре; по обе стороны от пяти стоят одинаковые значения, и оба ПОЛОЖИТЕЛЬНЫЕ. Квадрат никогда не бывает отрицательным, поэтому эта функция достаёт нуль лишь в одном месте и знак свой не меняет никогда.',
    'Correct. Zero appears only at x equal to five: for a square to become zero, the inside of the bracket must be zero. And now the main point of the table: at three it is four, at seven also four — the values on both sides of five are equal, and both POSITIVE. A square is never negative, so this function reaches zero in only one place and never changes its sign.'),
  wrongs: [
    { when: (s) => s.vals.c3 === -5, text: L(
      "Ishora almashdi. Qavsning ichi iks minus besh: u nolga aylanishi uchun iks BESHGA teng bo'lishi kerak, minus beshga emas.",
      'Сбился знак. Внутри скобки икс минус пять: чтобы это обратилось в нуль, икс должен быть равен ПЯТИ, а не минус пяти.',
      'A sign slipped. Inside the bracket is x minus five: for it to become zero, x must equal FIVE, not minus five.') },
    { when: (s) => s.vals.c3 === 0, text: L(
      "Nol pastki qatorda turibdi — bu funksiyaning QIYMATI. Yuqori qatorda esa shu qiymatni beradigan iks so'ralyapti.",
      'Нуль стоит в нижней строке — это ЗНАЧЕНИЕ функции. А в верхней строке спрашивают икс, дающий это значение.',
      'The zero sits in the bottom row — that is the VALUE of the function. The top row asks for the x that gives that value.') },
    { when: (s) => s.vals.c4 === 2, text: L(
      "Yetti minus besh ikkiga teng, lekin qavs KVADRATDA turibdi: ikkining kvadrati to'rt. Kvadratni olish qadami tushib qolgan.",
      'Семь минус пять равно двум, но скобка стоит в КВАДРАТЕ: два в квадрате — четыре. Пропущен шаг возведения в квадрат.',
      'Seven minus five is two, but the bracket is SQUARED: two squared is four. The squaring step was skipped.') },
    { when: (s) => s.vals.c4 === -4 || s.vals.c4 === 14, text: L(
      "Yettida qiymatni o'zingiz hisoblang: yetti minus besh ikki, ikkining kvadrati to'rt. Kvadrat manfiy chiqmaydi.",
      'Посчитай значение при семи сам: семь минус пять — два, два в квадрате — четыре. Квадрат отрицательным не выходит.',
      'Compute the value at seven yourself: seven minus five is two, two squared is four. A square never comes out negative.') },
  ],
  wrongText: L(
    "Har katakni formula bilan tekshiring: qavsning ichini hisoblang, keyin kvadratga ko'taring. Nol faqat qavs ichi nol bo'lganda chiqadi.",
    'Проверяй каждую клетку по формуле: посчитай внутри скобки, потом возведи в квадрат. Нуль выходит только когда внутри скобки нуль.',
    'Check each cell against the formula: compute the inside of the bracket, then square it. Zero appears only when the bracket is zero.'),
};

export default function D14_01(props) { return <RowTable data={DATA} {...props} />; }
