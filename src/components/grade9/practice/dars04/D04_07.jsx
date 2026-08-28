// Dars04 · Amaliyot 07 — Simmetriya · 🟡 · teg: nosimmetrik-nuqtalar
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> PlacePoint.
// Kontent: src/books/grade9/DARS04_AMALIYOT_KONTENT.md §07
//
// ASOSIY TUZOQ (1; 0): nuqta Oy o'qiga nisbatan aks ettirilgan, simmetriya
// o'qiga emas. Aynan shu `simmetriya-oqi-vertikal` bilan
// `nosimmetrik-nuqtalar` ning kesishgan joyi.
//
// FUNKSIYA: y = x² + 6x + 5 , nollari −5 va −1, uchi (−3; −4).
// Belgilangan nuqta (−1; 0), unga simmetrigi (−5; 0).
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { PlacePoint } from '../asboblar9.jsx';

const F = (x) => x * x + 6 * x + 5;

const DATA = {
  tag: 'nosimmetrik-nuqtalar', level: '🟡',
  eyebrow: L('Simmetriya', 'Симметрия', 'Symmetry'),
  setup: L(
    "Parabola chizilgan, uning bitta nuqtasi belgilangan. Simmetriya o'qi uchidan tik o'tadi.",
    'Парабола построена, одна её точка отмечена. Ось симметрии проходит вертикально через вершину.',
    'A parabola is drawn and one of its points is marked. The axis of symmetry runs vertically through the vertex.'),
  ask: L(
    "Belgilangan nuqtaga simmetrik nuqtani qo'ying.",
    'Поставь точку, симметричную отмеченной.',
    'Place the point symmetric to the marked one.'),
  curve: F,
  marks: [[-1, 0]],
  plane: { x0: -7, x1: 2, y0: -5, y1: 4 },
  answer: [[-5, 0]],
  correctText: L(
    "To'g'ri. Simmetriya o'qi minus uchda turibdi. Belgilangan nuqta undan ikki birlik o'ngda, demak juftlik ikki birlik chapda: minus besh. Balandligi esa o'zgarmaydi — simmetriya faqat gorizontal bo'ylab ishlaydi.",
    'Верно. Ось симметрии стоит в минус трёх. Отмеченная точка на две единицы правее, значит пара — на две единицы левее: минус пять. Высота при этом не меняется — симметрия работает только по горизонтали.',
    'Correct. The axis of symmetry stands at minus three. The marked point is two units to its right, so its partner is two units to the left: minus five. The height does not change — symmetry works along the horizontal only.'),
  wrongs: [
    { when: (s) => s.has(1, 0), text: L(
      "Nuqta Oy o'qiga nisbatan aks ettirildi. Simmetriya o'qi esa Oy emas, u uchidan o'tadi va minus uchda turibdi.",
      'Точка отражена относительно оси Oy. А ось симметрии — не Oy: она проходит через вершину и стоит в минус трёх.',
      'The point was reflected in the Oy axis. But the axis of symmetry is not Oy: it runs through the vertex and stands at minus three.') },
    { when: (s) => s.has(-3, 0), text: L(
      "Bu simmetriya o'qining o'zida turgan nuqta. Sizdan esa juftlik so'ralyapti: o'qning IKKINCHI tomonidagi nuqta.",
      'Это точка на самой оси симметрии. А спрашивают пару: точку по ДРУГУЮ сторону от оси.',
      'That point lies on the axis of symmetry itself. What is asked for is the partner: the point on the OTHER side of the axis.') },
  ],
  wrongText: L(
    "Belgilangan nuqta simmetriya o'qidan necha birlik uzoqda? Xuddi shuncha masofani o'qning ikkinchi tomoniga o'lchang, balandligi esa o'zgarmaydi.",
    'На сколько единиц отмеченная точка удалена от оси симметрии? Отложи ровно столько же по другую сторону оси, а высота не меняется.',
    'How many units is the marked point from the axis of symmetry? Lay off the same distance on the other side of the axis; the height stays the same.'),
};

export default function D04_07(props) { return <PlacePoint data={DATA} {...props} />; }
