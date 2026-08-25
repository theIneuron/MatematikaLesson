// Dars07 · Amaliyot 06 — Qaysi chizma · 🟡 · tag: which_graph · CHIZMALI
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §5 (7-dars, 6-pozitsiya), §4a
//
// TO'RT VARIANT — TO'RT CHIZMA (metodist qarori 2026-08-24). Bu darsning
// yagona joyi, u yerda tanlov CHIZMA bo'yicha boradi, so'z bo'yicha emas.
// Uch xato variant — uch adashish, har biri ko'z bilan ko'rinadi:
//   1  tarmoqlar 2 va 4 chorakda — З28 (k ning ishorasi);
//   2  to'g'ri chiziq — З27 (to'g'ri proporsionallik);
//   3  tarmoqlari o'qqa TEGADIGAN egri — З2 (nolda qiymat bor deb o'ylash).
// Variantlar aralashtiriladi (Choice ichida), razbor shartlari esa ASL
// raqamda qoladi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const FIG = { w: 138, h: 94 };

const DATA = {
  tag: 'which_graph', level: '🟡',
  correct: 0, optCols: 2,
  expr: ['y', '=', { n: '6', d: 'x' }], exprSize: 24,
  eyebrow: L('Qaysi chizma', 'Какой чертёж', 'Which plot'),
  setup: L(
    "To'rt chizma. Bittasi shu formulaning grafigi, uchtasi esa boshqa narsani ko'rsatadi.",
    'Четыре чертежа. Один из них график этой формулы, три показывают другое.',
    'Four plots. One of them is the graph of this formula, three show something else.'),
  ask: L('Qaysi chizma shu formulaning grafigi?', 'Какой чертёж — график этой формулы?', 'Which plot is the graph of this formula?'),
  opts: [
    { label: [{ fig: 'hyp', k: 6, ...FIG }] },
    { label: [{ fig: 'hyp', k: -6, ...FIG }] },
    { label: [{ fig: 'lin', k: 1.4, ...FIG }] },
    { label: [{ fig: 'hyp', k: 6, touch: true, ...FIG }] },
  ],
  correctText: L(
    "To'g'ri. k musbat, demak x va y bir xil ishorada: tarmoqlar birinchi va uchinchi chorakda turadi. Nuqta bilan tekshiring: x ni ikkiga qo'ysangiz uch, uchga qo'ysangiz ikki. Tarmoqlar o'qlarga tegmaydi ham: y nol bo'lishi uchun olti bo'lingan x nolga aylanishi kerak, bu esa hech qachon bo'lmaydi.",
    'Верно. k положительное, значит x и y одного знака: ветви лежат в первой и третьей четверти. Проверь точкой: при x равном двум выйдет три, при трёх — два. Осей ветви тоже не касаются: чтобы y стало нулём, шесть делить на x должно обратиться в нуль, а это невозможно.',
    'Correct. k is positive, so x and y share a sign: the branches lie in the first and third quadrants. Check with a point: x equal to two gives three, x equal to three gives two. The branches never touch the axes either: for y to be zero, six over x would have to become zero, and that never happens.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Bu chizmada tarmoqlar ikkinchi va to'rtinchi chorakda, ya'ni x musbat bo'lganda y manfiy. Formulani tekshiring: x ikkiga teng bo'lganda olti bo'lingan ikki arti uch chiqadi, manfiy emas. Bunday chizma minus olti bo'lingan x ga tegishli.",
      'На этом чертеже ветви во второй и четвёртой четверти, то есть при положительном x значение отрицательно. Проверь формулу: при x равном двум шесть делить на два даёт плюс три, а не минус. Такой чертёж принадлежит минус шесть делить на x.',
      'On this plot the branches are in the second and fourth quadrants, so a positive x gives a negative value. Check the formula: at x equal to two, six over two is plus three, not minus. That plot belongs to minus six over x.') },
    { when: (s) => s.picked === 2, text: L(
      "Bu to'g'ri chiziq, ya'ni to'g'ri proporsionallik: x o'sganda y ham o'sadi. Formulada esa harf chiziq TAGIDA, x o'sganda y kamayadi. Sanab ko'ring: bir da olti, ikki da uch, uch da ikki.",
      'Это прямая, то есть прямая пропорциональность: с ростом x растёт y. А в формуле буква ПОД чертой, и с ростом x значение убывает. Посчитай: при одном шесть, при двух три, при трёх два.',
      'That is a straight line, that is direct proportionality: as x grows y grows. In the formula the letter is BELOW the bar, so as x grows the value drops. Count it: at one six, at two three, at three two.') },
    { when: (s) => s.picked === 3, text: L(
      "Bu chizmada tarmoqlar o'qlarga TEGIB turadi. O'qqa tegish x nolga teng bo'lganda qiymat bor degani, olti bo'lingan nol esa yo'q. Ikkinchi tomondan y nol bo'lishi kerak bo'lardi, buning uchun surat nolga aylanishi shart — surat esa olti.",
      'На этом чертеже ветви КАСАЮТСЯ осей. Касание оси значит, что при x равном нулю значение есть, а шесть делить на нуль не существует. С другой стороны y должно стать нулём, для этого числитель обязан обратиться в нуль — а числитель шесть.',
      'On this plot the branches TOUCH the axes. Touching the y axis would mean a value exists at x equal to zero, but six over zero does not exist. Touching the x axis would need y to be zero, and for that the numerator must vanish — but the numerator is six.') },
  ],
  wrongText: L(
    "Ikki savol bering: k musbatmi (tarmoqlar qaysi chorakda) va chizma o'qlarga tegadimi. x ni ikkiga qo'yib qiymatni hisoblang.",
    'Задай два вопроса: положительно ли k (в каких четвертях ветви) и касается ли чертёж осей. Подставь x равное двум и посчитай значение.',
    'Ask two questions: is k positive (which quadrants hold the branches) and does the plot touch the axes. Put x equal to two and compute the value.'),
};

export default function D07_06(props) { return <Choice data={DATA} {...props} />; }
