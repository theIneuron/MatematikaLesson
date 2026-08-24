// Dars07 · Amaliyot 10 — Tartib · 🔴 · tag: graph_steps · CHIZMALI
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §5 (7-dars, 10-pozitsiya), §4a
//
// Grafik qurishning to'rt qadami. OXIRGI IKKI KARTADA CHIZMA (metodist
// qarori 2026-08-24): uchinchi kartada jadvalning nuqtalari, to'rtinchisida
// esa o'sha nuqtalardan o'tgan ikki tarmoq. Shunda tartib SO'Z bilan emas,
// ko'z bilan ham ko'rinadi: tarmoq nuqtasiz chizilmaydi.
//
// Boshlang'ich tartib QAT'IY (`start`), tasodifiy emas: aralashtirish ba'zan
// to'g'ri tartibni berib qo'yardi va topshiriq bir bosishda yopilardi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const FIG = { w: 62, h: 48, grid: false, R: 7 };

const DATA = {
  tag: 'graph_steps', level: '🔴',
  expr: ['y', '=', { n: '6', d: 'x' }], exprSize: 24,
  itemSize: 13,
  cards: [
    { id: 'l1', tokens: ['x ≠ 0'],
      label: L('sohani yozamiz', 'записываем область', 'write the domain') },
    { id: 'l2', tokens: ['1, 2, 3, 6'],
      label: L('jadval tuzamiz', 'составляем таблицу', 'build the table') },
    { id: 'l3', tokens: [{ fig: 'pts', pts: [{ x: 1, y: 6 }, { x: 2, y: 3 }, { x: 3, y: 2 }, { x: 6, y: 1 }], ...FIG }],
      label: L("nuqtalarni qo'yamiz", 'ставим точки', 'plot the points') },
    { id: 'l4', tokens: [{ fig: 'hyp', k: 6, ...FIG }],
      label: L('tarmoqlarni chizamiz', 'проводим ветви', 'draw the branches') },
  ],
  start: ['l3', 'l1', 'l4', 'l2'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Grafik qurishning to'rt qadami bir qatorda turadi, lekin tartibi buzilgan.",
    'Четыре шага построения графика стоят в одну строку, но порядок нарушен.',
    'The four steps of drawing the graph stand in one row, but their order is broken.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Avval soha: nol chiqarib tashlanadi, chunki u yerda qiymat yo'q — shuning uchun jadvalga nol yozilmaydi. Keyin jadval: x ga bir, ikki, uch, olti qo'yiladi va y hisoblanadi. Undan keyin nuqtalar qo'yiladi, va faqat oxirida shu nuqtalardan ikki tarmoq o'tkaziladi. Tarmoqlar o'qlarga tegmaydi, chunki nolda nuqta yo'q.",
    'Верно. Сначала область: нуль исключается, потому что там нет значения — поэтому в таблицу нуль не пишут. Потом таблица: в x подставляются один, два, три, шесть и считается y. Затем ставятся точки, и лишь в конце через них проводятся две ветви. Осей ветви не касаются, потому что в нуле точки нет.',
    'Correct. First the domain: zero is excluded because there is no value there, so zero never goes into the table. Then the table: one, two, three, six are put into x and y is computed. Then the points are plotted, and only at the end are the two branches drawn through them. The branches never touch the axes because there is no point at zero.'),
  wrongs: [
    { when: (s) => s.seq[0] === 'l4', text: L(
      "Tarmoqdan boshlab bo'lmaydi: chizish uchun qaysi nuqtalardan o'tish kerakligini bilish shart. Tarmoq — natija, birinchi qadam emas.",
      'Начинать с ветвей нельзя: чтобы их провести, надо знать, через какие точки они идут. Ветви — результат, а не первый шаг.',
      'You cannot start from the branches: to draw them you must know which points they pass through. The branches are the result, not the first step.') },
    { when: (s) => s.pos.l4 < s.pos.l3, text: L(
      "Tarmoqlar nuqtalardan O'TADI, demak nuqtalar oldin qo'yilishi kerak. Nuqtasiz chizilgan chiziq taxmin bo'ladi: chizmada uni tekshirish uchun hech narsa qolmaydi.",
      'Ветви ПРОХОДЯТ через точки, значит точки должны стоять раньше. Линия без точек это догадка: на чертеже нечем её проверить.',
      'The branches PASS THROUGH the points, so the points must come first. A line drawn without points is a guess: nothing on the plot can check it.') },
    { when: (s) => s.pos.l3 < s.pos.l2, text: L(
      "Nuqtani qo'yish uchun uning koordinatalari kerak, koordinatalarni esa jadval beradi. Jadvalsiz nuqtaning y i qaydan olinadi?",
      'Чтобы поставить точку, нужны её координаты, а их даёт таблица. Откуда взять y точки без таблицы?',
      'To plot a point you need its coordinates, and the table is what gives them. Without the table, where would the y of the point come from?') },
    { when: (s) => s.pos.l1 > s.pos.l2, text: L(
      "Soha jadvaldan OLDIN yoziladi: aks holda jadvalga nol tushib qolishi mumkin, u yerda esa qiymat yo'q. Olti bo'lingan nolni hisoblab ko'ring.",
      'Область записывается ДО таблицы: иначе в таблицу может попасть нуль, а там значения нет. Попробуй посчитать шесть делить на нуль.',
      'The domain is written BEFORE the table: otherwise zero may end up in the table, and there is no value there. Try computing six over zero.') },
  ],
  wrongText: L(
    "Har qadamdan bitta savol so'rang: buni bajarish uchun nima allaqachon ma'lum bo'lishi kerak? Javobi yo'q qadam birinchi turadi.",
    'Спроси у каждого шага: что должно быть уже известно, чтобы его сделать? Шаг без такого требования и стоит первым.',
    'Ask every step: what must already be known to do it? The step with no such requirement stands first.'),
};

export default function D07_10(props) { return <SwapOrder data={DATA} {...props} />; }
