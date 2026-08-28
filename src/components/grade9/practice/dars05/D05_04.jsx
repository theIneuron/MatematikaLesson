// Dars05 · Amaliyot 04 — Uchi · 🟡 · teg: uchi-notogri-oqish
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> PlacePoint.
// Kontent: src/books/grade9/DARS05_AMALIYOT_KONTENT.md §04
//
// Ikki son ikki xil qoidaga bo'ysunadi: qavs ichidagisining ishorasi
// ALMASHADI, qavsdan tashqaridagisi esa qanday yozilgan bo'lsa, shunday
// qoladi. Uchta tuzoq shu ikki qoidaning uch xil buzilishi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { PlacePoint } from '../asboblar9.jsx';

const DATA = {
  tag: 'uchi-notogri-oqish', level: '🟡',
  eyebrow: L('Uchi', 'Вершина', 'Vertex'),
  setup: L(
    "Parabola formula bilan berilgan. Uchi — grafikning burilish nuqtasi.",
    'Парабола задана формулой. Вершина — точка поворота графика.',
    'The parabola is given by a formula. The vertex is the turning point of the graph.'),
  ask: L(
    "Parabolaning uchini tekislikka qo'ying.",
    'Поставь вершину параболы на плоскости.',
    'Place the vertex of the parabola on the plane.'),
  expr: ['y = (x + 2)² − 3'],
  plane: { x0: -5, x1: 4, y0: -5, y1: 4 },
  answer: [[-2, -3]],
  correctText: L(
    "To'g'ri. Qavs nolga aylanadigan son minus ikki — bu uchining abssissasi. Qavsdan tashqaridagi minus uch esa uni pastga tushiradi. Ikki son ikki xil yo'nalishni beradi: biri yon tomonga, ikkinchisi tikka.",
    'Верно. Число, при котором скобка обращается в нуль, — минус два, это абсцисса вершины. А минус три за скобкой опускает её вниз. Два числа задают два разных направления: одно вбок, другое вверх-вниз.',
    'Correct. The number that makes the bracket zero is minus two — that is the abscissa of the vertex. The minus three outside the bracket lowers it. The two numbers give two different directions: one sideways, one up and down.'),
  wrongs: [
    { when: (s) => s.has(2, -3), text: L(
      "Abssissaning ishorasi teskari olindi. Qavsda qo'shuv ikki turibdi: qavs nolga aylanishi uchun iks qanday bo'lishi kerak?",
      'Знак абсциссы взят наоборот. В скобке стоит плюс два: каким должен быть икс, чтобы скобка обратилась в нуль?',
      'The sign of the abscissa was taken the other way. The bracket holds plus two: what must x be for the bracket to become zero?') },
    { when: (s) => s.has(-2, 3), text: L(
      "Ordinataning ishorasi teskari olindi. Qavsdan tashqarida minus uch turibdi, demak parabola pastga tushgan.",
      'Знак ординаты взят наоборот. За скобкой стоит минус три, значит парабола опущена вниз.',
      'The sign of the ordinate was taken the other way. Outside the bracket stands minus three, so the parabola is lowered.') },
    { when: (s) => s.has(2, 3), text: L(
      "Ikkala sonning ham ishorasi teskari. Qavs ichidagi son ishorasi ALMASHADI, qavsdan tashqaridagisi esa qanday yozilgan bo'lsa, shunday qoladi.",
      'У обоих чисел знак наоборот. Знак числа в скобке МЕНЯЕТСЯ, а число за скобкой остаётся таким, как записано.',
      'Both signs are the other way round. The sign of the number inside the bracket FLIPS, while the number outside stays as written.') },
  ],
  wrongText: L(
    "Ikki savol: qavs qaysi sonda nolga aylanadi, va qavsdan tashqaridagi son parabolani qayoqqa suradi?",
    'Два вопроса: при каком числе скобка обращается в нуль и куда сдвигает параболу число за скобкой?',
    'Two questions: at which number does the bracket become zero, and where does the number outside the bracket move the parabola?'),
};

export default function D05_04(props) { return <PlacePoint data={DATA} {...props} />; }
