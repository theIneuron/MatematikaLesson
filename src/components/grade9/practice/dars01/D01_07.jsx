// Dars01 · Amaliyot 07 — O'q · 🟡 · teg: domain_on_axis
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> DomainAxis.
// Kontent: src/books/grade9/DARS01_AMALIYOT_KONTENT.md §07
//
// Uchta shart ham tekshiriladi: chegara, nuqta turi va yo'nalish.
// `x ≥ −5` bilan `x > −5` — boshqa javob, va razbor NUQTA haqida gapiradi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { DomainAxis } from '../asboblar9.jsx';

const DATA = {
  tag: 'domain_on_axis', level: '🟡',
  eyebrow: L('O\'q', 'Ось', 'Axis'),
  setup: L(
    "O'qda uchta narsa ko'rsatiladi: chegara qayerda, u sohaga kiradimi va soha qaysi tomonga ketadi.",
    'На оси показывают три вещи: где граница, входит ли она в область и в какую сторону область идёт.',
    'The axis shows three things: where the boundary is, whether it belongs to the domain, and which way the domain runs.'),
  ask: L(
    "Funksiyaning aniqlanish sohasini o'qda belgilang.",
    'Отметь на оси область определения функции.',
    'Mark the domain of the function on the axis.'),
  expr: ['y =', { r: 'x + 5' }],
  axis: { from: -9, to: 3 },
  answer: { at: -5, closed: true, dir: 'right' },
  closedLabel: L('Bo\'yalgan', 'Закрашенная', 'Filled'),
  openLabel: L('Bo\'sh', 'Пустая', 'Hollow'),
  correctText: L(
    "To'g'ri. Chegara minus beshda, nuqta bo'yalgan, soha o'ngga ketadi. Minus beshda ildiz ostida nol turadi, noldan ildiz esa bor va u nolga teng — shuning uchun chegaraning o'zi ham sohaga kiradi.",
    'Верно. Граница в минус пяти, точка закрашена, область идёт вправо. При минус пяти под корнем стоит нуль, а корень из нуля существует и равен нулю — поэтому сама граница тоже входит в область.',
    'Correct. The boundary is at minus five, the point is filled, the domain runs to the right. At minus five the expression under the root is zero, and the root of zero exists and equals zero — so the boundary itself belongs to the domain as well.'),
  wrongs: [
    { when: (s) => s.atOk && !s.closedOk, text: L(
      "Chegara topildi, lekin nuqta bo'sh qoldi. Minus beshni ildiz ostiga qo'ying: nol hosil bo'ladi. Noldan ildiz bormi?",
      'Граница найдена, но точка осталась пустой. Подставь минус пять под корень: получится нуль. Существует ли корень из нуля?',
      'The boundary was found, but the point was left hollow. Put minus five under the root: you get zero. Does the root of zero exist?') },
    { when: (s) => s.at === 5, text: L(
      "Ildiz ostidagi ifoda nolga aylanadigan sonni toping: iks qo'shuv besh nolga teng bo'lsa, iks nimaga teng?",
      'Найди число, при котором подкоренное выражение обращается в нуль: если икс плюс пять равно нулю, чему равен икс?',
      'Find the number that makes the expression under the root zero: if x plus five equals zero, what does x equal?') },
    { when: (s) => s.atOk && s.closedOk && !s.dirOk, text: L(
      "Nolni qo'yib ko'ring: ildiz ostida besh chiqadi, demak nol sohaga kiradi. Nol chegaradan qaysi tomonda turibdi?",
      'Подставь нуль: под корнем получится пять, значит нуль входит в область. С какой стороны от границы стоит нуль?',
      'Try zero: five appears under the root, so zero belongs to the domain. On which side of the boundary does zero stand?') },
    { when: (s) => !s.atOk, text: L(
      "Chegara ildiz ostidagi ifodadan chiqadi, formulaning ko'rinishidan emas. Iks qo'shuv beshni nolga tenglashtiring.",
      'Граница берётся из подкоренного выражения, а не из вида формулы. Приравняй икс плюс пять к нулю.',
      'The boundary comes from the expression under the root, not from the look of the formula. Set x plus five equal to zero.') },
  ],
  wrongText: L(
    "Ikki savolga javob bering: ildiz ostidagi ifoda qayerda nolga aylanadi va o'sha nuqtaning o'zi sohaga kiradimi?",
    'Ответь на два вопроса: где подкоренное выражение обращается в нуль и входит ли сама эта точка в область.',
    'Answer two questions: where does the expression under the root become zero, and does that very point belong to the domain?'),
};

export default function D01_07(props) { return <DomainAxis data={DATA} {...props} />; }
