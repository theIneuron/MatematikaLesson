// Dars06 · Amaliyot 07 — Kesishish · 🟡 · teg: chegara-nuqta-kiritish
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> PlacePoint.
// Kontent: src/books/grade9/DARS06_AMALIYOT_KONTENT.md §07
//
// IKKITA nuqta so'raladi. Asosiy tuzoq — uchini bosish: u grafikning eng
// past nuqtasi, lekin Ox da emas. Kesishish nuqtalari esa tengsizlikning
// chegaralari bo'ladi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { PlacePoint } from '../asboblar9.jsx';

const F = (x) => (x - 1) * (x - 5);

const DATA = {
  tag: 'chegara-nuqta-kiritish', level: '🟡',
  eyebrow: L('Kesishish', 'Пересечение', 'Crossings'),
  setup: L(
    "Tekislikda parabola chizilgan. U gorizontal o'qni ikki joyda kesadi.",
    'На плоскости построена парабола. Она пересекает горизонтальную ось в двух местах.',
    'A parabola is drawn on the plane. It crosses the horizontal axis in two places.'),
  ask: L(
    'Grafik Ox bilan kesishgan IKKALA nuqtani belgilang.',
    'Отметь ОБЕ точки пересечения графика с Ox.',
    'Mark BOTH points where the graph crosses Ox.'),
  curve: F,
  plane: { x0: -1, x1: 7, y0: -5, y1: 4 },
  answer: [[1, 0], [5, 0]],
  correctText: L(
    "To'g'ri. Bu ikki nuqta funksiyaning nollari: aynan ular tengsizlikning chegarasi bo'ladi. Ular orasida grafik Ox dan pastda, ya'ni qiymat manfiy; tashqarisida esa yuqorida.",
    'Верно. Эти две точки — нули функции: именно они становятся границами неравенства. Между ними график ниже Ox, то есть значение отрицательно; вне их — выше.',
    'Correct. These two points are the zeros of the function: they become the boundaries of the inequality. Between them the graph is below Ox, so the value is negative; outside them it is above.'),
  wrongs: [
    { when: (s) => s.has(3, -4), text: L(
      "Bu uchi — grafikning eng past nuqtasi, u Ox dan PASTDA. Kesishish esa o'qning o'zida, ya'ni qiymat nolga teng bo'lgan joyda.",
      'Это вершина — самая нижняя точка графика, она НИЖЕ Ox. А пересечение — на самой оси, там, где значение равно нулю.',
      'That is the vertex — the lowest point of the graph, BELOW Ox. A crossing is on the axis itself, where the value is zero.') },
    { when: (s) => s.has(1, 0) || s.has(5, 0), text: L(
      "Bitta kesishish topildi. Parabola gorizontal o'qni ikki joyda kesadi — ikkinchisini ham toping.",
      'Одно пересечение найдено. Парабола пересекает горизонтальную ось в двух местах — найди и второе.',
      'One crossing found. The parabola crosses the horizontal axis in two places — find the other one.') },
  ],
  wrongText: L(
    "Kesishish nuqtasining ordinatasi nolga teng: u aynan gorizontal o'qning ustida yotadi. Grafik o'qni qayerda kesib o'tadi?",
    'У точки пересечения ордината равна нулю: она лежит прямо на горизонтальной оси. Где график пересекает ось?',
    'The ordinate of a crossing point is zero: it lies right on the horizontal axis. Where does the graph cross it?'),
};

export default function D06_07(props) { return <PlacePoint data={DATA} {...props} />; }
