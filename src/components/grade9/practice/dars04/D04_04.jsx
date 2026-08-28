// Dars04 · Amaliyot 04 — O'q · 🟡 · teg: x0-formula-belgisi
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> DomainAxis.
// Kontent: src/books/grade9/DARS04_AMALIYOT_KONTENT.md §04
//
// Chegara formuladan chiqadi: x₀ = −b/(2a). Ikki tuzoq ham formulaning
// ichida — ishorani unutish (−4) va maxrajda 2a o'rniga a olish (8).
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { DomainAxis } from '../asboblar9.jsx';

const DATA = {
  tag: 'x0-formula-belgisi', level: '🟡',
  eyebrow: L('O\'q', 'Ось', 'Axis'),
  setup: L(
    "Parabola uchidan chapda kamayadi, o'ngda o'sadi. Uchi formuladan topiladi.",
    'Слева от вершины парабола убывает, справа возрастает. Вершину находят по формуле.',
    'To the left of the vertex the parabola decreases, to the right it increases. The vertex comes from the formula.'),
  ask: L(
    "Funksiya qaysi x lardan boshlab o'sadi? O'qda ko'rsating.",
    'Начиная с каких x функция возрастает? Отметь на оси.',
    'From which x on does the function increase? Mark it on the axis.'),
  expr: ['y = x² − 8x + 12'],
  axis: { from: -2, to: 9 },
  answer: { at: 4, closed: true, dir: 'right' },
  closedLabel: L('Bo\'yalgan', 'Закрашенная', 'Filled'),
  openLabel: L('Bo\'sh', 'Пустая', 'Hollow'),
  correctText: L(
    "To'g'ri. Uchining abssissasi to'rt: minus sakkizning qarama-qarshisi sakkiz, uni ikki marta bir ga bo'lsak to'rt chiqadi. Undan o'ngda parabola ko'tariladi, va uchining o'zi ham oraliqqa kiradi.",
    'Верно. Абсцисса вершины — четыре: противоположное к минус восьми есть восемь, а делённое на два умножить на один даёт четыре. Правее парабола поднимается, и сама вершина тоже входит в промежуток.',
    'Correct. The abscissa of the vertex is four: the opposite of minus eight is eight, and divided by two times one it gives four. To the right the parabola rises, and the vertex itself belongs to the interval.'),
  wrongs: [
    { when: (s) => s.at === -4, text: L(
      "Formulada b ning oldida minus turibdi, b ning o'zi esa allaqachon manfiy. Ikki minus birga aylanadi.",
      'В формуле перед b стоит минус, а само b уже отрицательно. Два минуса дают плюс.',
      'The formula has a minus in front of b, and b itself is already negative. Two minuses make a plus.') },
    { when: (s) => s.at === 8, text: L(
      "Maxrajda a emas, ikki a turadi. Bu yerda a birga teng, demak maxraj ikkiga teng.",
      'В знаменателе стоит не a, а два a. Здесь a равно единице, значит знаменатель равен двум.',
      'The denominator is not a but two a. Here a is one, so the denominator is two.') },
    { when: (s) => s.atOk && s.closedOk && !s.dirOk, text: L(
      "Beshni formulaga qo'ying, keyin oltini: qiymat ortyaptimi yoki kamayyaptimi? Uchidan o'ngda parabola ko'tariladi.",
      'Подставь пять, потом шесть: значение растёт или убывает? Правее вершины парабола поднимается.',
      'Put in five, then six: does the value grow or fall? To the right of the vertex the parabola rises.') },
    { when: (s) => s.atOk && !s.closedOk, text: L(
      "Uchining o'zi ham o'sish oralig'iga kiradi: aynan undan boshlab qiymatlar ortadi.",
      'Сама вершина тоже входит в промежуток возрастания: именно с неё значения начинают расти.',
      'The vertex itself belongs to the increasing interval: the values start growing exactly from it.') },
  ],
  wrongText: L(
    "Avval uchining abssissasini formuladan toping, keyin uchining qaysi tomonida parabola ko'tarilishini aniqlang.",
    'Сначала найди абсциссу вершины по формуле, потом определи, с какой стороны от вершины парабола поднимается.',
    'First find the abscissa of the vertex from the formula, then work out on which side of the vertex the parabola rises.'),
};

export default function D04_04(props) { return <DomainAxis data={DATA} {...props} />; }
