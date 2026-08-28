// Dars05 · Amaliyot 05 — O'q · 🟡 · teg: uchi-notogri-oqish
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> DomainAxis,
// `ray` rejimida (chegara + nuqta turi + yo'nalish).
// Kontent: src/books/grade9/DARS05_AMALIYOT_KONTENT.md §05
//
// Ikkita tuzoq formulaning ikki qismidan chiqadi: chegarani qavsdan emas,
// qavsdan tashqaridagi sondan olish, va qavsdagi ishorani teskari o'qish.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { DomainAxis } from '../asboblar9.jsx';

const DATA = {
  tag: 'uchi-notogri-oqish', level: '🟡',
  eyebrow: L('O\'q', 'Ось', 'Axis'),
  setup: L(
    "Parabola uchidan chapda kamayadi, o'ngda o'sadi.",
    'Слева от вершины парабола убывает, справа возрастает.',
    'To the left of the vertex the parabola decreases, to the right it increases.'),
  ask: L(
    "Funksiya o'suvchi bo'lgan oraliqni o'qda ko'rsating.",
    'Отметь на оси промежуток, на котором функция возрастает.',
    'Mark on the axis the interval where the function is increasing.'),
  expr: ['y = (x − 3)² + 1'],
  mode: 'ray',
  axis: { from: -2, to: 8 },
  answer: { at: 3, closed: true, dir: 'right' },
  closedLabel: L('Bo\'yalgan', 'Закрашенная', 'Filled'),
  openLabel: L('Bo\'sh', 'Пустая', 'Hollow'),
  correctText: L(
    "To'g'ri. Qavs uchda nolga aylanadi, demak uchi shu yerda. Undan o'ngda parabola ko'tariladi, va uchining o'zi ham oraliqqa kiradi.",
    'Верно. Скобка обращается в нуль при трёх, значит вершина там. Правее парабола поднимается, и сама вершина тоже входит в промежуток.',
    'Correct. The bracket becomes zero at three, so the vertex is there. To the right the parabola rises, and the vertex itself belongs to the interval.'),
  wrongs: [
    { when: (s) => s.at === -3, text: L(
      "Qavsda minus turibdi, demak qavs nolga aylanadigan son musbat. Iks minus uch nolga teng bo'lsa, iks nimaga teng?",
      'В скобке стоит минус, значит число, при котором она обращается в нуль, положительное. Если икс минус три равно нулю, чему равен икс?',
      'The bracket has a minus, so the number that makes it zero is positive. If x minus three is zero, what does x equal?') },
    { when: (s) => s.at === 1, text: L(
      "Bir — qavsdan tashqaridagi son, u parabolani tikka ko'taradi. Uchining abssissasi qavs ichidan chiqadi.",
      'Единица — это число за скобкой, оно поднимает параболу по вертикали. Абсцисса вершины берётся из скобки.',
      'One is the number outside the bracket; it lifts the parabola vertically. The abscissa of the vertex comes from inside the bracket.') },
    { when: (s) => s.atOk && s.closedOk && !s.dirOk, text: L(
      "Uchidan chapda parabola pastga tushadi — bu kamayish oralig'i. To'rt va beshni formulaga qo'yib solishtiring.",
      'Левее вершины парабола опускается — это промежуток убывания. Подставь четыре и пять и сравни.',
      'To the left of the vertex the parabola falls — that is the decreasing interval. Put in four and five and compare.') },
    { when: (s) => s.atOk && !s.closedOk, text: L(
      "Uchining o'zi ham o'sish oralig'iga kiradi: aynan undan boshlab qiymatlar ortadi.",
      'Сама вершина тоже входит в промежуток возрастания: именно с неё значения начинают расти.',
      'The vertex itself belongs to the increasing interval: the values start growing exactly from it.') },
  ],
  wrongText: L(
    "Avval qavs nolga aylanadigan sonni toping, keyin uchining qaysi tomonida parabola ko'tarilishini aniqlang.",
    'Сначала найди число, при котором скобка обращается в нуль, потом определи, с какой стороны от вершины парабола поднимается.',
    'First find the number that makes the bracket zero, then work out on which side of the vertex the parabola rises.'),
};

export default function D05_05(props) { return <DomainAxis data={DATA} {...props} />; }
