// Dars10 · Amaliyot 02 — Test · 🟢 · tag: square_of_negative
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §8 (10-dars, 2-pozitsiya)
//
// Darsning birinchi tasdig'i: kvadratdan olingan ildiz sonning MODULINI
// beradi. Uch xato variant uch adashish:
//   −9  — З31, modul tushib qoldi va minus «o'tib ketdi»;
//   ±9  — З29, ildiz belgisi ikki son beradi deb o'ylash;
//   81  — ildiz umuman olinmadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'square_of_negative', level: '🟢',
  correct: 0, optCols: 2, optSize: 22,
  expr: [{ r: '(−9)²' }], exprSize: 32,
  eyebrow: L('Test', 'Тест', 'Test'),
  setup: L(
    "Ildiz ostida minus to'qqizning kvadrati turadi. Ikki amal ketma-ket bajariladi: avval kvadrat, keyin ildiz.",
    'Под корнем стоит квадрат минус девяти. Два действия выполняются подряд: сначала квадрат, потом корень.',
    'The square of minus nine stands under the root. Two actions run in order: the square first, then the root.'),
  ask: L('Bu yozuv nimaga teng?', 'Чему равна эта запись?', 'What does this record equal?'),
  opts: [
    { label: ['9'] },
    { label: ['−9'] },
    { label: ['±9'] },
    { label: ['81'] },
  ],
  correctText: L(
    "To'g'ri. Avval kvadrat: minus to'qqiz karra minus to'qqiz sakson bir. Keyin ildiz: sakson birdan ildiz to'qqiz, chunki arifmetik ildiz nomanfiy. Ya'ni kvadratdan olingan ildiz minus to'qqizning MODULINI berdi. Qoida shu: ildiz ostidagi kvadratdan sonning o'zi emas, uning moduli chiqadi.",
    'Верно. Сначала квадрат: минус девять на минус девять восемьдесят один. Потом корень: корень из восьмидесяти одного девять, ведь арифметический корень неотрицателен. То есть корень из квадрата дал МОДУЛЬ минус девяти. Правило такое: из квадрата под корнем выходит не само число, а его модуль.',
    'Correct. First the square: minus nine times minus nine is eighty one. Then the root: the root of eighty one is nine, since an arithmetic root is non-negative. So the root of the square gave the MODULUS of minus nine. That is the rule: a square under a root yields not the number itself but its modulus.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Ildiz ostidagi minus javobga o'tib ketdi. Amallarni tartib bilan bajaring: minus to'qqizning kvadrati sakson bir, sakson bir esa musbat. Musbat sondan olingan arifmetik ildiz manfiy bo'la olmaydi.",
      'Минус из-под корня перешёл в ответ. Выполни действия по порядку: квадрат минус девяти восемьдесят один, а восемьдесят один положительно. Арифметический корень из положительного числа не может быть отрицательным.',
      'The minus from under the root slipped into the answer. Do the actions in order: minus nine squared is eighty one, and eighty one is positive. An arithmetic root of a positive number cannot be negative.') },
    { when: (s) => s.picked === 2, text: L(
      "Ikki javob tenglamaga tegishli, ildiz belgisiga emas. x kvadrati sakson birga teng tenglamada haqiqatan ikki yechim bor, lekin ildiz belgisi ulardan NOMANFIYini tanlaydi va bitta son beradi.",
      'Два ответа относятся к уравнению, а не к знаку корня. У уравнения x в квадрате равно восьмидесяти одному действительно два решения, но знак корня выбирает из них НЕОТРИЦАТЕЛЬНОЕ и даёт одно число.',
      'Two answers belong to an equation, not to the root sign. The equation x squared equals eighty one really does have two solutions, but the root sign picks the NON-NEGATIVE one and gives a single number.') },
    { when: (s) => s.picked === 3, text: L(
      "Sakson bir — ildiz ostidagi son, javob emas: kvadrat bajarildi, ildiz esa qoldi. Sakson birdan ildiz oling.",
      'Восемьдесят один — подкоренное число, а не ответ: квадрат выполнен, а корень нет. Возьми корень из восьмидесяти одного.',
      'Eighty one is the radicand, not the answer: the square was done but the root was not. Take the root of eighty one.') },
  ],
  wrongText: L(
    "Ikki amalni tartib bilan bajaring: avval ildiz ostidagi kvadratni, keyin ildizni. Javob nomanfiy bo'lishi kerak.",
    'Выполни два действия по порядку: сначала квадрат под корнем, потом корень. Ответ должен быть неотрицательным.',
    'Do the two actions in order: the square under the root first, then the root. The answer must be non-negative.'),
};

export default function D10_02(props) { return <Choice data={DATA} {...props} />; }
