// Dars09 · Amaliyot 02 — Tenglama · 🟢 · teg: vieta-teskari-notogri
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> Choice.
//
// Viyet teoremasining teskarisi: yig'indi MINUS ishora bilan, ko'paytma
// esa QO'SHUV bilan tushadi. Uchta noto'g'ri variant uchta chalkashlik:
// yig'indining ishorasi, yig'indi bilan ko'paytmaning o'rni, ko'paytmaning
// ishorasi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'vieta-teskari-notogri', level: '🟢',
  correct: 0, optCols: 1, optSize: 17,
  eyebrow: L('Tenglama', 'Уравнение', 'Equation'),
  setup: L(
    "Ikki sonning yig'indisi va ko'paytmasi ma'lum. Ular bitta kvadrat tenglamaning ildizlari.",
    'Известны сумма и произведение двух чисел. Они — корни одного квадратного уравнения.',
    'The sum and the product of two numbers are known. They are the roots of one quadratic equation.'),
  ask: L(
    'Bu sonlar qaysi tenglamaning ildizlari?',
    'Корнями какого уравнения являются эти числа?',
    'Which equation has these numbers as its roots?'),
  givenLabel: L('Berilgan', 'Дано', 'Given'),
  given: [['x + y = 10'], ['xy = 21']],
  opts: [
    { label: ['z² − 10z + 21 = 0'] },
    { label: ['z² + 10z + 21 = 0'] },
    { label: ['z² − 21z + 10 = 0'] },
    { label: ['z² − 10z − 21 = 0'] },
  ],
  correctText: L(
    "To'g'ri. Yig'indi tenglamaga QARAMA-QARSHI ishora bilan, ko'paytma esa o'z ishorasida tushadi. Tekshirish oson: uch va yetti — ularning yig'indisi o'n, ko'paytmasi yigirma bir, va ikkalasi ham shu tenglamani nolga aylantiradi.",
    'Верно. Сумма входит в уравнение с ПРОТИВОПОЛОЖНЫМ знаком, произведение — со своим. Проверка: три и семь дают в сумме десять, в произведении двадцать один, и оба обращают его в нуль.',
    'Correct. The sum enters with the OPPOSITE sign, the product keeps its own. Check: three and seven sum to ten and multiply to twenty-one, and both make the equation zero.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Yig'indi qarama-qarshi ishora bilan tushadi. Uchni bu tenglamaga qo'ying: to'qqiz qo'shuv o'ttiz qo'shuv yigirma bir nolga teng emas.",
      'Сумма входит с противоположным знаком. Подставь тройку в это уравнение: девять плюс тридцать плюс двадцать один нулю не равно.',
      'The sum enters with the opposite sign. Put three into this equation: nine plus thirty plus twenty-one is not zero.') },
    { when: (s) => s.picked === 2, text: L(
      "Yig'indi bilan ko'paytma o'rin almashdi. Iks oldida yig'indi, ozod hadda esa ko'paytma turishi kerak.",
      'Сумма и произведение поменялись местами. Перед иксом должна стоять сумма, а в свободном члене — произведение.',
      'The sum and the product changed places. The sum belongs in front of x, the product in the constant term.') },
    { when: (s) => s.picked === 3, text: L(
      "Ko'paytma o'z ishorasida tushadi, teskarisida emas. Uchni qo'ying: to'qqiz minus o'ttiz minus yigirma bir nolga teng emas.",
      'Произведение входит со своим знаком, а не с обратным. Подставь тройку: девять минус тридцать минус двадцать один нулю не равно.',
      'The product keeps its own sign, not the opposite one. Put three in: nine minus thirty minus twenty-one is not zero.') },
  ],
  wrongText: L(
    "Uch va yettini har bir variantga qo'yib ko'ring. Faqat bitta tenglamada ikkalasi ham nol beradi.",
    'Подставь тройку и семёрку в каждый вариант. Только в одном уравнении оба дадут нуль.',
    'Put three and seven into every option. Only one equation gives zero for both.'),
};

export default function D09_02(props) { return <Choice data={DATA} {...props} />; }
