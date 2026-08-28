// Dars16 · Amaliyot 07 — Belgilash · 🟡 · teg: faqat-bitta-tengsizlikni-tekshirish
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> PlacePoint.
//
// IKKALA grafik ham chizilgan: parabola y = x² − 4 va chiziq y = x + 1.
// Ox bilan kesishish nuqtalari — aynan sistemaning ikki tengsizligining
// CHEGARALARI: parabola minus ikki va ikkida, chiziq minus birda.
// Ya'ni topshiriq chegaralarni chizmadan o'qishga o'rgatadi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { PlacePoint } from '../asboblar9.jsx';

const DATA = {
  tag: 'faqat-bitta-tengsizlikni-tekshirish', level: '🟡',
  eyebrow: L('Belgilash', 'Отметка', 'Marking'),
  // SHART QISQA: uzunroq varianti telefonda kadrdan 19px chiqib ketardi
  // (tekshiruv 2026-08-28). Chegaralar haqidagi gap razborga ko'chdi.
  setup: L(
    "Uzluksiz chiziq va punktir parabola chizilgan.",
    'Построены сплошная прямая и пунктирная парабола.',
    'A solid line and a dashed parabola are drawn.'),
  ask: L(
    "Ikkala grafikning Ox bilan kesishgan BARCHA nuqtalarini qo'ying.",
    'Поставь ВСЕ точки, где оба графика пересекают Ox.',
    'Place ALL the points where the two graphs cross Ox.'),
  expr: ['y = x² − 4', ',', 'y = x + 1'],
  plane: { x0: -4, x1: 4, y0: -5, y1: 4 },
  curves: [
    { f: (x) => x + 1 },
    { f: (x) => x * x - 4, dash: '5 4' },
  ],
  answer: [[-2, 0], [2, 0], [-1, 0]],
  correctText: L(
    "To'g'ri, uchta nuqta. Parabola Ox ni minus ikkida va ikkida kesib o'tadi — bu iks kvadrat minus to'rt tengsizligining chegaralari; chiziq esa minus birda — bu iks qo'shuv bir tengsizligining chegarasi. Uchala son sistemaning javobini bo'lib chiqadi. Faqat parabolaning nuqtalarini olsak, chiziqning chegarasi tushib qoladi va javob noto'g'ri bo'lib chiqadi.",
    'Верно, три точки. Парабола пересекает Ox при минус двух и двух — это границы неравенства с икс в квадрате минус четыре; а прямая — при минус одном, это граница неравенства икс плюс один. Все три числа и разбивают ответ системы. Если взять только точки параболы, граница прямой потеряется и ответ выйдет неверным.',
    'Correct, three points. The parabola crosses Ox at minus two and two — the boundaries of the inequality with x squared minus four; and the line at minus one, the boundary of the x plus one inequality. All three numbers cut up the answer of the system. Taking only the parabola points loses the boundary of the line, and the answer comes out wrong.'),
  // RAZBOR SHARTLARI FAQAT YETILADIGAN HOLATLARGA QO'YILGAN: mexanika
  // aynan UCHTA nuqta qo'yilmaguncha «Tekshirish» ni ochmaydi, shuning
  // uchun «nuqta yetmaydi» degan shart hech qachon bajarilmasdi
  // (tekshiruv 2026-08-28).
  wrongs: [
    { when: (s) => !s.has(-1, 0), text: L(
      "Chiziqning chegarasi tushib qoldi: uzluksiz chiziq ham Ox ni kesib o'tadi. Chizmada u qayerda o'qni kesib o'tganiga qarang — parabolaning ikki nuqtasidan tashqari yana bittasi bor.",
      'Граница прямой потеряна: сплошная прямая тоже пересекает Ox. Посмотри на чертёж, где именно — кроме двух точек параболы есть ещё одна.',
      'The boundary of the line was lost: the solid line crosses Ox as well. Look at the drawing to see where — besides the two parabola points there is one more.') },
    { when: (s) => s.has(0, -4) || s.has(0, 1), text: L(
      "Bu nuqtalar grafiklarning Oy bilan kesishishi, Ox bilan emas. Ox bilan kesishishda IGREK nolga teng.",
      'Это точки пересечения графиков с Oy, а не с Ox. При пересечении с Ox ИГРЕК равен нулю.',
      'These are where the graphs meet Oy, not Ox. At a crossing with Ox, Y equals zero.') },
    { when: (s) => s.has(1, 0) || s.has(-4, 0) || s.has(4, 0), text: L(
      "Bu son ildiz emas. Har bir grafikni alohida nolga tenglashtiring: iks kvadrat minus to'rt nolga teng, va iks qo'shuv bir nolga teng.",
      'Это число не корень. Приравняй каждый график к нулю по отдельности: икс в квадрате минус четыре равно нулю, и икс плюс один равно нулю.',
      'That number is not a root. Set each graph to zero separately: x squared minus four equals zero, and x plus one equals zero.') },
  ],
  wrongText: L(
    "Chizmada ikkala egri chiziqni alohida kuzatib boring: har biri Ox ni qayerda kesib o'tadi? Parabola ikki joyda, chiziq bir joyda.",
    'Проследи на чертеже за каждой линией по отдельности: где каждая пересекает Ox? Парабола в двух местах, прямая в одном.',
    'Follow each curve separately on the drawing: where does each cross Ox? The parabola in two places, the line in one.'),
};

export default function D16_07(props) { return <PlacePoint data={DATA} {...props} />; }
