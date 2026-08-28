// Dars14 · Amaliyot 02 — Test · 🟢 · teg: ikkita-ildiz-deb-oylash
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> Choice.
//
// MANTIQIY savol (TIPLAR_AMALIYOT_9SINF.md §2.1): grafik bilan o'q
// orasidagi JOYLASHUV so'ralyapti. To'rtala variant to'rtta boshqa
// joylashuvni taklif qiladi, va uchtasi darsning aniq adashishlariga
// tegadi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'ikkita-ildiz-deb-oylash', level: '🟢',
  correct: 0, optCols: 1, optSize: 15,
  eyebrow: L('Test', 'Тест', 'Test'),
  setup: L(
    "Kvadrat funksiyaning diskriminanti nolga teng.",
    'Дискриминант квадратичной функции равен нулю.',
    'The discriminant of a quadratic function is zero.'),
  ask: L(
    "Parabola Ox o'qi bilan qanday joylashadi?",
    'Как парабола расположена относительно оси Ox?',
    'How does the parabola sit relative to the Ox axis?'),
  givenLabel: L('Diskriminant', 'Дискриминант', 'Discriminant'),
  given: [['D = 0']],
  opts: [
    { label: L(
      "Bitta nuqtada tegadi",
      'Касается в одной точке',
      'It touches at one point') },
    { label: L(
      "Ikkita nuqtada kesadi",
      'Пересекает в двух точках',
      'It crosses at two points') },
    { label: L(
      "Umuman kesmaydi",
      'Не пересекает вовсе',
      'It does not meet it at all') },
    { label: L(
      "Ox bilan ustma-ust tushadi",
      'Совпадает с осью Ox',
      'It coincides with the Ox axis') },
  ],
  correctText: L(
    "To'g'ri. Diskriminant nechta ildiz borligini aytadi, ildiz esa Ox bilan kesishish nuqtasi. Nol diskriminant — ikkita ildiz bir joyga qo'shilib ketgani: parabola o'qqa tushadi, tegadi va yana ko'tariladi. Shu sababli bu nuqtada ishora almashmaydi — parabola o'qning ikkinchi tomoniga o'tmaydi.",
    'Верно. Дискриминант говорит, сколько корней, а корень — это точка пересечения с Ox. Нулевой дискриминант означает, что два корня слились в один: парабола опускается к оси, касается её и снова поднимается. Поэтому в этой точке знак не меняется — парабола не переходит на другую сторону оси.',
    'Correct. The discriminant tells how many roots there are, and a root is a point where the graph meets Ox. A zero discriminant means two roots merged into one: the parabola comes down to the axis, touches it and rises again. That is why the sign does not change at this point — the parabola never crosses to the other side.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Ikkita nuqta faqat diskriminant MUSBAT bo'lganda chiqadi. Nolda ikkita ildiz bir joyga qo'shilib, bitta urinish nuqtasi bo'lib qoladi.",
      'Две точки бывают только при ПОЛОЖИТЕЛЬНОМ дискриминанте. При нуле два корня сливаются в одну точку касания.',
      'Two points occur only when the discriminant is POSITIVE. At zero the two roots merge into a single point of tangency.') },
    { when: (s) => s.picked === 2, text: L(
      "Umuman kesmaslik — bu diskriminant MANFIY bo'lgan hol. Nol diskriminantda esa aynan bitta umumiy nuqta bor.",
      'Не пересекать вовсе — это случай ОТРИЦАТЕЛЬНОГО дискриминанта. А при нулевом общая точка ровно одна.',
      'Not meeting at all is the case of a NEGATIVE discriminant. With a zero discriminant there is exactly one common point.') },
    { when: (s) => s.picked === 3, text: L(
      "Parabola o'q bilan ustma-ust tushmaydi: o'q to'g'ri chiziq, parabola esa egri. Ular faqat nuqtalarda uchrashadi, va bu yerda bitta shunday nuqta bor.",
      'Парабола не совпадает с осью: ось — прямая, а парабола — кривая. Они встречаются только в точках, и здесь такая точка одна.',
      'A parabola does not coincide with the axis: the axis is a line, the parabola a curve. They meet only at points, and here there is one such point.') },
  ],
  wrongText: L(
    "Diskriminantning ishorasi ildizlar sonini beradi: musbat — ikkita, nol — bitta, manfiy — nolta. Ildiz esa Ox bilan umumiy nuqta.",
    'Знак дискриминанта даёт число корней: положительный — два, нуль — один, отрицательный — ни одного. А корень это общая точка с Ox.',
    'The sign of the discriminant gives the number of roots: positive — two, zero — one, negative — none. And a root is a common point with Ox.'),
};

export default function D14_02(props) { return <Choice data={DATA} {...props} />; }
