// Dars14 · Amaliyot 05 — Belgilash · 🟡 · teg: urinish-notogri-oqish
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> PlacePoint.
//
// Parabola y = (x + 3)² chizilgan: u Ox ga minus uchda TEGADI, kesmaydi.
// Chizmada bu ko'rinib turadi — grafik o'qqa tushadi va yana ko'tariladi,
// ikkinchi tomonga o'tmaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { PlacePoint } from '../asboblar9.jsx';

const DATA = {
  tag: 'urinish-notogri-oqish', level: '🟡',
  eyebrow: L('Belgilash', 'Отметка', 'Marking'),
  setup: L(
    "Grafik chizilgan. U Ox o'qiga bir joyda tegadi va ikkinchi tomonga o'tmaydi.",
    'График построен. Он касается оси Ox в одном месте и на другую сторону не переходит.',
    'The graph is drawn. It touches the Ox axis in one place and never crosses to the other side.'),
  ask: L(
    "Grafik Ox ga TEGGAN nuqtani belgilang.",
    'Отметь точку, где график КАСАЕТСЯ Ox.',
    'Mark the point where the graph TOUCHES Ox.'),
  expr: ['y = (x + 3)²'],
  // TEKISLIK MUSBAT TOMONGA UZAYTIRILDI (tekshiruv 2026-08-28): asosiy
  // tuzoq nuqtasi — ishora almashgan (3; 0) — ilgari tekislikdan tashqarida
  // qolardi, ya'ni razbor hech qachon chiqmasdi.
  plane: { x0: -6, x1: 4, y0: -1, y1: 6 },
  curves: [
    { f: (x) => (x + 3) * (x + 3) },
  ],
  answer: [[-3, 0]],
  correctText: L(
    "To'g'ri. Qavsning ichi minus uchda nolga aylanadi, demak urinish nuqtasi minus uch va nol. Chizmaga qarang: grafik o'qqa tushadi, unga tegadi va yana ko'tariladi — o'qning ostiga hech qachon tushmaydi. Aynan shu sababli bu nuqtada ishora almashmaydi: chap tomonda ham, o'ng tomonda ham funksiya musbat.",
    'Верно. Внутри скобки нуль получается при минус трёх, значит точка касания — минус три и нуль. Посмотри на чертёж: график опускается к оси, касается её и снова поднимается — под ось он не уходит никогда. Именно поэтому в этой точке знак не меняется: и слева, и справа функция положительна.',
    'Correct. The inside of the bracket becomes zero at minus three, so the point of tangency is minus three and zero. Look at the drawing: the graph comes down to the axis, touches it and rises again — it never goes below. That is exactly why the sign does not change here: the function is positive both to the left and to the right.'),
  wrongs: [
    { when: (s) => s.has(3, 0), text: L(
      "Ishora almashdi. Qavsda iks QO'SHUV uch turibdi: u nolga aylanishi uchun iks minus uchga teng bo'lishi kerak. Chizmada urinish nuqtasi noldan chapda.",
      'Сбился знак. В скобке икс ПЛЮС три: чтобы это обратилось в нуль, икс должен быть равен минус трём. На чертеже точка касания левее нуля.',
      'A sign slipped. The bracket has x PLUS three: for it to become zero, x must be minus three. On the drawing the point of tangency is to the left of zero.') },
    { when: (s) => s.has(0, -3) || s.has(0, 3), text: L(
      "Koordinatalar o'rin almashdi. Urinish nuqtasi Ox o'qida yotadi, demak uning ikkinchi soni har doim NOL.",
      'Координаты поменялись местами. Точка касания лежит на оси Ox, значит её второе число всегда НУЛЬ.',
      'The coordinates swapped places. The point of tangency lies on the Ox axis, so its second number is always ZERO.') },
    { when: (s) => s.has(-3, 1) || s.has(-3, -1), text: L(
      "Iks to'g'ri, lekin nuqta o'qdan chetda. Urinish o'qning USTIDA bo'ladi, ya'ni igrek nolga teng.",
      'Икс верен, но точка не на оси. Касание происходит НА оси, то есть игрек равен нулю.',
      'x is right, but the point is off the axis. Tangency happens ON the axis, that is, y equals zero.') },
    { when: (s) => s.has(0, 0), text: L(
      "Nolda grafik o'qdan ancha yuqorida: nol qo'shuv uch uch, uchning kvadrati to'qqiz. Chizmada grafikning o'qqa eng yaqin joyini qidiring.",
      'В нуле график намного выше оси: нуль плюс три — три, три в квадрате — девять. Ищи на чертеже место, где график ближе всего к оси.',
      'At zero the graph is far above the axis: zero plus three is three, three squared is nine. Look on the drawing for where the graph comes closest to the axis.') },
  ],
  wrongText: L(
    "Grafikning o'qqa tekkan joyini toping va uning ikkala koordinatasini o'qlar bo'ylab sanab oling. Urinish nuqtasining igregi nolga teng.",
    'Найди место, где график коснулся оси, и считай обе его координаты по осям. У точки касания игрек равен нулю.',
    'Find where the graph touches the axis and read both its coordinates off the axes. At a point of tangency y equals zero.'),
};

export default function D14_05(props) { return <PlacePoint data={DATA} {...props} />; }
