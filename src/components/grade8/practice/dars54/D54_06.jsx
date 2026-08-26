// Dars54 · Amaliyot 06 — O'rta chiziq · 🟡 🖼 · tag: midline
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §6 (54-dars, 6-pozitsiya)
//
// T3 NING IKKINCHI YARMI, va u 43-darsdan tanish (oldingi blokdan).
// Asosiy tuzoq — 28: yarimlash o'rniga ikkilash (З115 ning teskari
// tomoni). Chizmada o'rta chiziq punktir bilan ko'rsatilgan.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'midline', level: '🟡',
  target: 7, allowNeg: false,
  // A(8,52) B(34,10) C(86,52). O'rta chiziq: AB va BC ning o'rtalari,
  // ya'ni (21,31) va (60,31) — AC ga parallel va uning yarmi.
  expr: [{
    fig: 'poly', w: 94, h: 62,
    pts: [[8, 52], [34, 10], [86, 52]], names: ['A', 'B', 'C'],
    segs: [{ from: [21, 31], to: [60, 31], dash: true }],
  }],
  given: [['AC = 14']],
  givenLabel: L('Asos', 'Основание', 'The base'),
  eyebrow: L("O'rta chiziq", 'Средняя линия', 'The midline'),
  setup: L(
    "ABC uchburchakda AC tomoni o'n to'rt santimetr. Punktir bilan o'rta chiziq chizilgan: u AB va BC tomonlarining o'rtalarini tutashtiradi va AC ga parallel. Uning uzunligini topish kerak.",
    'В треугольнике ABC сторона AC равна четырнадцати сантиметрам. Пунктиром проведена средняя линия: она соединяет середины сторон AB и BC и параллельна AC. Надо найти её длину.',
    'In the triangle ABC the side AC is fourteen centimetres. The midline is drawn dashed: it joins the midpoints of the sides AB and BC and runs parallel to AC. Find its length.'),
  label: L("O'rta chiziq, sm", 'Средняя линия, см', 'The midline, cm'),
  ask: L("O'rta chiziq nechaga teng?", 'Чему равна средняя линия?', 'What is the midline?'),
  correctText: L(
    "To'g'ri. O'rta chiziq uchinchi tomonning yarmiga teng: o'n to'rtning yarmi yetti. Buni vektor tilida ham ko'rsatish mumkin — o'rta chiziq yarim AC ga teng vektor, va yarim koeffitsiyent aynan shu formuladan keladi. Chizmaga qarang: punktir kesma pastki tomondan sezilarli qisqa, taxminan ikki barobar.",
    'Верно. Средняя линия равна половине третьей стороны: половина четырнадцати это семь. То же можно показать на языке векторов — средняя линия это вектор, равный половине AC, и коэффициент половина берётся именно из этой формулы. Посмотри на рисунок: пунктирный отрезок заметно короче нижней стороны, примерно вдвое.',
    'Correct. The midline equals half the third side: half of fourteen is seven. The same can be shown in the language of vectors — the midline is a vector equal to half of AC, and the coefficient of a half comes from exactly that formula. Look at the drawing: the dashed segment is noticeably shorter than the bottom side, about twice.'),
  wrongs: [
    { when: (s) => s.value === 28, text: L(
      "Amal teskari tomonga ketdi: siz ikkiladingiz. O'rta chiziq uchinchi tomondan KICHIK bo'lishi kerak, chunki u uchburchakning ichida yotadi. Chizmaga qarang: punktir kesma pastki tomondan qisqa. O'n to'rtni ikkiga bo'ling.",
      'Действие пошло в обратную сторону: ты удвоил. Средняя линия должна быть МЕНЬШЕ третьей стороны, ведь она лежит внутри треугольника. Посмотри на рисунок: пунктирный отрезок короче нижней стороны. Раздели четырнадцать на два.',
      'The operation went the wrong way: you doubled. The midline must be SMALLER than the third side, since it lies inside the triangle. Look at the drawing: the dashed segment is shorter than the bottom side. Divide fourteen by two.') },
    { when: (s) => s.value === 14, text: L(
      "Bu AC tomonining o'zi. O'rta chiziq unga PARALLEL, lekin TENG emas: u ikki barobar qisqa. Parallellik va tenglik ikki boshqa narsa — chizmada punktir kesma pastki tomondan aniq qisqaroq.",
      'Это сама сторона AC. Средняя линия ей ПАРАЛЛЕЛЬНА, но не РАВНА: она вдвое короче. Параллельность и равенство это разные вещи — на рисунке пунктирный отрезок явно короче нижней стороны.',
      'This is the side AC itself. The midline is PARALLEL to it but not EQUAL: it is twice as short. Parallelism and equality are different things — in the drawing the dashed segment is clearly shorter than the bottom side.') },
    { when: () => true, text: L(
      "O'rta chiziq uchinchi tomonning yarmiga teng. O'n to'rtni ikkiga bo'ling.",
      'Средняя линия равна половине третьей стороны. Раздели четырнадцать на два.',
      'The midline equals half the third side. Divide fourteen by two.') },
  ],
  wrongText: L(
    "O'rta chiziq uchinchi tomonning yarmi. Chizmada u pastki tomondan qisqa.",
    'Средняя линия это половина третьей стороны. На рисунке она короче нижней стороны.',
    'The midline is half the third side. In the drawing it is shorter than the bottom side.'),
};

export default function D54_06(props) { return <TypeValue data={DATA} {...props} />; }
