// Dars17 · Amaliyot 06 — Belgilash · 🟡 · teg: maxraj-nolini-javobga-kiritish
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> PlacePoint.
//
// Grafik y = (x − 3)/(x + 1) chizilgan. U Ox ni FAQAT uchda kesib o'tadi
// (surat noli). Minus birda esa grafik o'qni kesmaydi — u yerda kasrning
// qiymati yo'q, va grafik uzilib ketadi. Aynan shu farq topshiriqning
// mazmuni: nol nuqta ikki xil bo'ladi, lekin Ox da faqat bittasi yotadi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { PlacePoint } from '../asboblar9.jsx';

const DATA = {
  tag: 'maxraj-nolini-javobga-kiritish', level: '🟡',
  eyebrow: L('Belgilash', 'Отметка', 'Marking'),
  setup: L(
    "Kasrning grafigi chizilgan. Uning ikkita maxsus nuqtasi bor, lekin Ox o'qida faqat bittasi yotadi.",
    'Построен график дроби. У неё две особые точки, но на оси Ox лежит только одна.',
    'The graph of the fraction is drawn. It has two special points, but only one of them lies on Ox.'),
  ask: L(
    "Grafik Ox ni KESGAN nuqtani belgilang.",
    'Отметь точку, где график ПЕРЕСЕКАЕТ Ox.',
    'Mark the point where the graph CROSSES Ox.'),
  expr: ['y = (x − 3)/(x + 1)'],
  plane: { x0: -4, x1: 5, y0: -4, y1: 4 },
  curves: [
    { f: (x) => (x - 3) / (x + 1) },
  ],
  answer: [[3, 0]],
  correctText: L(
    "To'g'ri: uch va nol. Kasr nolga faqat SURAT nolga aylanganda teng bo'ladi, ya'ni uchda; maxraj esa nolga teng bo'lolmaydi. Minus birda grafik Ox ni kesib o'tmaydi — u yerda kasrning qiymati umuman yo'q, va grafik uzilib ketadi. Ikkala son ham o'qqa qo'yiladi, lekin faqat surat noli TEKISLIKDA nuqta beradi.",
    'Верно: три и нуль. Дробь равна нулю только тогда, когда в нуль обращается ЧИСЛИТЕЛЬ, то есть при трёх; знаменатель нулём быть не может. А при минус одном график не пересекает Ox — там у дроби нет значения вовсе, и график разрывается. Оба числа наносят на ось, но точку НА ПЛОСКОСТИ даёт только нуль числителя.',
    'Correct: three and zero. A fraction equals zero only when the NUMERATOR becomes zero, that is at three; the denominator can never be zero. At minus one the graph does not cross Ox — the fraction has no value there and the graph breaks. Both numbers go on the number line, but only the numerator zero gives a point ON THE PLANE.'),
  wrongs: [
    { when: (s) => s.has(-1, 0), text: L(
      "Minus bir — MAXRAJNING noli. U yerda kasrning qiymati yo'q, demak grafikda ham nuqta yo'q: chizmaga qarang, grafik o'sha joyda uzilib ketgan.",
      'Минус один — нуль ЗНАМЕНАТЕЛЯ. Там у дроби нет значения, значит и точки на графике нет: посмотри на чертёж, график в этом месте разорван.',
      'Minus one is the DENOMINATOR zero. The fraction has no value there, so there is no point on the graph either: look at the drawing, the graph is broken at that spot.') },
    { when: (s) => s.has(0, -3), text: L(
      "Bu grafikning Oy bilan kesishishi: nolda kasr minus uchga teng. Savolda esa Ox bilan kesishish so'ralgan, u yerda IGREK nolga teng.",
      'Это пересечение графика с Oy: в нуле дробь равна минус трём. А в вопросе спрашивают пересечение с Ox, где ИГРЕК равен нулю.',
      "That is where the graph meets Oy: at zero the fraction is minus three. The question asks about the crossing with Ox, where Y equals zero.") },
    { when: (s) => s.has(0, 3) || s.has(3, 3), text: L(
      "Ox bilan kesishish nuqtasining ikkinchi soni har doim NOL. Uchda kasr nolga teng: nol bo'lingan to'rt nol beradi.",
      'У точки пересечения с Ox второе число всегда НУЛЬ. При трёх дробь равна нулю: нуль делить на четыре — нуль.',
      'At a crossing with Ox the second number is always ZERO. At three the fraction equals zero: zero over four is zero.') },
    { when: (s) => s.has(-3, 0), text: L(
      "Ishora almashdi. Surat iks MINUS uch, u uchda nolga aylanadi. Minus uchda esa kasr olti bo'lingan minus ikki, ya'ni minus uch.",
      'Сбился знак. Числитель — икс МИНУС три, он обращается в нуль при трёх. А при минус трёх дробь равна шесть делить на минус два, то есть минус три.',
      'A sign slipped. The numerator is x MINUS three, which becomes zero at three. At minus three the fraction is six over minus two, that is minus three.') },
  ],
  wrongText: L(
    "Kasr qachon nolga teng bo'ladi? Faqat surati nol bo'lganda. Shu iksni toping va nuqtani Ox ustiga qo'ying.",
    'Когда дробь равна нулю? Только когда её числитель нуль. Найди этот икс и поставь точку на Ox.',
    'When does a fraction equal zero? Only when its numerator is zero. Find that x and put the point on Ox.'),
};

export default function D17_06(props) { return <PlacePoint data={DATA} {...props} />; }
