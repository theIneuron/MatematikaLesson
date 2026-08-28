// Dars03 · Amaliyot 06 — Uchi · 🟡 · teg: nol-vs-vershina
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> PlacePoint.
// Kontent: src/books/grade9/DARS03_AMALIYOT_KONTENT.md §06
//
// Parabola `curve` orqali tekislikka chiziladi. Tuzoqlar grafikning
// O'ZIDA turadi va o'quvchi ularni bosa oladi: nollar (−1; 0) va (3; 0),
// hamda (1; 0) — uchining faqat abssissasi olingan holat.
//
// FUNKSIYA: y = x² − 2x − 3 , nollari −1 va 3, uchi (1; −4).
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { PlacePoint } from '../asboblar9.jsx';

const F = (x) => x * x - 2 * x - 3;

const DATA = {
  tag: 'nol-vs-vershina', level: '🟡',
  eyebrow: L('Uchi', 'Вершина', 'Vertex'),
  setup: L(
    "Tekislikda parabola chizilgan. Uchi — grafikning burilish nuqtasi.",
    'На плоскости построена парабола. Вершина — это точка поворота графика.',
    'A parabola is drawn on the plane. The vertex is the turning point of the graph.'),
  ask: L(
    'Parabolaning uchini belgilang.',
    'Отметь вершину параболы.',
    'Mark the vertex of the parabola.'),
  curve: F,
  plane: { x0: -3, x1: 5, y0: -5, y1: 4 },
  answer: [[1, -4]],
  correctText: L(
    "To'g'ri. Uchi — grafik pastga tushishdan to'xtab, ko'tarila boshlaydigan nuqta. Uning ikkala soni ham bor: abssissasi bir, ordinatasi minus to'rt. Nollar esa boshqa nuqtalar — ular grafik gorizontal o'qni kesgan joyda turibdi.",
    'Верно. Вершина — точка, где график перестаёт опускаться и начинает подниматься. У неё есть оба числа: абсцисса единица, ордината минус четыре. А нули — другие точки, они там, где график пересекает горизонтальную ось.',
    'Correct. The vertex is where the graph stops falling and starts rising. It has both numbers: abscissa one, ordinate minus four. The zeros are different points — they sit where the graph crosses the horizontal axis.'),
  wrongs: [
    { when: (s) => s.has(-1, 0) || s.has(3, 0), text: L(
      "Bu nuqtalar funksiyaning NOLLARI: u yerda qiymat nolga teng. Uchi esa grafikning eng past nuqtasi, u gorizontal o'qdan pastda.",
      'Это НУЛИ функции: там значение равно нулю. А вершина — самая нижняя точка графика, она ниже горизонтальной оси.',
      'These are the ZEROS of the function: the value there is zero. The vertex is the lowest point of the graph, below the horizontal axis.') },
    { when: (s) => s.has(1, 0), text: L(
      "Abssissa to'g'ri topildi, ordinata esa gorizontal o'qdan olindi. Shu abssissada grafik qaysi balandlikda turibdi?",
      'Абсцисса найдена верно, а ордината взята с горизонтальной оси. На какой высоте стоит график при этой абсциссе?',
      'The abscissa is right, but the ordinate was taken from the horizontal axis. At what height does the graph stand at that abscissa?') },
  ],
  wrongText: L(
    "Grafikni chapdan o'ngga kuzating: u qaysi nuqtada tushishdan to'xtab, ko'tarila boshlaydi? Uchi grafikning O'ZIDA yotadi, gorizontal o'qda emas.",
    'Проследи график слева направо: в какой точке он перестаёт опускаться и начинает подниматься? Вершина лежит на САМОМ графике, а не на горизонтальной оси.',
    'Follow the graph from left to right: at which point does it stop falling and start rising? The vertex lies on the GRAPH itself, not on the horizontal axis.'),
};

export default function D03_06(props) { return <PlacePoint data={DATA} {...props} />; }
