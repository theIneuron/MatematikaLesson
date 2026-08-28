// Dars10 · Amaliyot 07 — Belgilash · 🟡 · teg: grafik-kesishish-nuqtasi
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> PlacePoint.
//
// Bu darsning YAGONA topshirig'i, unda ikkala grafik ham CHIZILGAN:
// `curves` sloti shu uchun qo'shildi (asboblar9.jsx, PlacePoint).
// O'quvchi kesishishlarni o'qiydi, hisoblamaydi — grafik usulning o'zi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { PlacePoint } from '../asboblar9.jsx';

const DATA = {
  tag: 'grafik-kesishish-nuqtasi', level: '🟡',
  eyebrow: L('Belgilash', 'Отметка', 'Marking'),
  setup: L(
    "Ikkala grafik chizilgan: to'g'ri chiziq va parabola.",
    'Оба графика построены: прямая и парабола.',
    'Both graphs are drawn: the line and the parabola.'),
  ask: L(
    "Ikkala kesishish nuqtasini ham qo'ying.",
    'Поставь обе точки пересечения.',
    'Place both crossing points.'),
  givenLabel: L('Sistema', 'Система', 'System'),
  given: [['y = x + 1'], ['y = x² − 1']],
  plane: { x0: -3, x1: 4, y0: -2, y1: 5 },
  curves: [
    { f: (x) => x + 1 },
    { f: (x) => x * x - 1, dash: '5 4' },
  ],
  answer: [[2, 3], [-1, 0]],
  correctText: L(
    "To'g'ri. Uzluksiz chiziq va punktir parabola ikki joyda kesishadi: minus bir-nol va ikki-uch. Ikkalasini ham tenglamalarga qo'yib tekshirish mumkin: minus bir qo'shuv bir nol, minus bir kvadrat minus bir ham nol; ikki qo'shuv bir uch, ikki kvadrat minus bir ham uch. Grafik yechimni KO'RSATADI, tekshiruv esa uni TASDIQLAYDI.",
    'Верно. Сплошная прямая и пунктирная парабола пересекаются в двух местах: минус один-нуль и два-три. Обе можно подставить в уравнения: минус один плюс один — нуль, минус один в квадрате минус один — тоже нуль; два плюс один — три, два в квадрате минус один — тоже три. График ПОКАЗЫВАЕТ решение, а проверка его ПОДТВЕРЖДАЕТ.',
    'Correct. The solid line and the dashed parabola cross in two places: minus one-zero and two-three. Both can be substituted: minus one plus one is zero, minus one squared minus one is zero as well; two plus one is three, two squared minus one is three as well. The graph SHOWS the solution, the check CONFIRMS it.'),
  wrongs: [
    { when: (s) => s.has(3, 2), text: L(
      "Koordinatalar o'rin almashdi. Birinchi son har doim abssissa: gorizontal o'q bo'ylab qancha yurilganini bildiradi.",
      'Координаты поменялись местами. Первое число — всегда абсцисса: сколько прошли по горизонтальной оси.',
      'The coordinates swapped places. The first number is always the abscissa: how far you went along the horizontal axis.') },
    { when: (s) => s.has(0, -1), text: L(
      "Bu parabolaning uchi, kesishish emas — va ayni paytda minus bir-nolning teskarisi. Chiziq u yerdan o'tmaydi: nolda chiziqning igregi birga teng.",
      'Это вершина параболы, а не пересечение, и заодно перевёрнутая пара минус один-нуль. Прямая через неё не проходит: в нуле у прямой игрек равен единице.',
      'That is the vertex of the parabola, not a crossing — and also minus one-zero written backwards. The line does not pass through it: at zero the line has y equal to one.') },
    { when: (s) => s.pts.length === 1, text: L(
      "Bitta nuqta qo'yildi, ikkinchisi qoldi. Grafikka yana bir bor qarang: chiziq parabolani nechta joyda kesib o'tyapti?",
      'Поставлена одна точка, вторая осталась. Посмотри на график ещё раз: в скольких местах прямая пересекает параболу?',
      'One point was placed and the other left out. Look at the graph again: in how many places does the line cross the parabola?') },
    { when: (s) => s.has(0, 1) || s.has(1, 2), text: L(
      "Bu nuqta chiziqda yotadi, lekin parabolada emas. Kesishish uchun u IKKALA chiziqda ham bo'lishi kerak.",
      'Эта точка лежит на прямой, но не на параболе. Для пересечения она должна быть на ОБЕИХ линиях.',
      'This point lies on the line but not on the parabola. For a crossing it must be on BOTH curves.') },

  ],
  wrongText: L(
    "Grafikda ikkala chiziq bir joyda uchrashgan nuqtalarni qidiring va har birining koordinatalarini o'qda sanab oling.",
    'Ищи на графике точки, где обе линии сошлись в одном месте, и считай координаты каждой по осям.',
    'Look for the points where both curves meet, and read each one\'s coordinates off the axes.'),
};

export default function D10_07(props) { return <PlacePoint data={DATA} {...props} />; }
