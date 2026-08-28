// Dars04 · Amaliyot 08 — Yasash · 🔴 · teg: nollarsiz-grafik
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> OrderLines.
// Kontent: src/books/grade9/DARS04_AMALIYOT_KONTENT.md §08
//
// Uchi BIRINCHI topiladi, chunki qolgan hamma narsa unga tayanadi:
// qo'shimcha nuqtalar aynan uchiga nisbatan simmetrik olinadi. Faqat uchi
// bilan chizilgan grafik — grafik emas, taxmin.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, OrderLines } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'nollarsiz-grafik', level: '🔴',
  eyebrow: L('Yasash', 'Построение', 'Construction'),
  setup: L(
    'Beshta qadam aralashtirilgan. Ular grafikni yasash tartibini hosil qiladi.',
    'Пять шагов перемешаны. Вместе они составляют порядок построения графика.',
    'Five steps are shuffled. Together they make the order of building the graph.'),
  ask: L('Qadamlarni to\'g\'ri tartibga soling.', 'Расставь шаги по порядку.', 'Put the steps in the right order.'),
  empty: L('Kartochkalarni tartib bilan bosing', 'Нажимай карточки по порядку', 'Tap the cards in order'),
  itemSize: 15,
  givenLabel: L('Yasang', 'Построить', 'Build'),
  given: [['y = x² − 4x']],
  lines: [
    { id: 'c1', label: L('Uchini topamiz:', 'Находим вершину:', 'Find the vertex:'), tokens: ['x₀ = −b/(2a)'] },
    { id: 'c2', tokens: ['x₀ = 2', ',', 'y₀ = −4'] },
    { id: 'c3', label: L('Nollarni topamiz:', 'Находим нули:', 'Find the zeros:'), tokens: ['x = 0', 'va', 'x = 4'] },
    { id: 'c4', label: L('Uchiga simmetrik ikki nuqta:', 'Две точки, симметричные вершине:', 'Two points symmetric about the vertex:'), tokens: ['(1; −3)', '(3; −3)'] },
    { id: 'c5', label: L(
      "Besh nuqtadan parabolani o'tkazamiz",
      'Проводим параболу через пять точек',
      'Draw the parabola through the five points') },
  ],
  answer: ['c1', 'c2', 'c3', 'c4', 'c5'],
  correctText: L(
    "To'g'ri. Uchi birinchi topiladi, chunki qolgan hamma narsa unga tayanadi: qo'shimcha nuqtalar aynan uchiga nisbatan simmetrik olinadi. Nollar grafikning gorizontal o'q bilan kesishgan joyini beradi. Faqat uchi bilan chizilgan grafik — bu grafik emas, taxmin.",
    'Верно. Вершина находится первой, потому что на неё опирается всё остальное: дополнительные точки берут симметрично именно относительно вершины. Нули дают места пересечения графика с горизонтальной осью. График, построенный по одной вершине, — это не график, а догадка.',
    'Correct. The vertex is found first because everything else rests on it: the extra points are taken symmetric about the vertex. The zeros give the places where the graph crosses the horizontal axis. A graph drawn from the vertex alone is not a graph but a guess.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c4') < s.seq.indexOf('c2'), text: L(
      "Qo'shimcha nuqtalar uchiga NISBATAN olinadi. Uchi hali topilmagan bo'lsa, nimaga nisbatan simmetrik olasiz?",
      'Дополнительные точки берут ОТНОСИТЕЛЬНО вершины. Если вершина ещё не найдена, относительно чего брать симметрию?',
      'The extra points are taken RELATIVE to the vertex. If the vertex is not found yet, relative to what will you take the symmetry?') },
    { when: (s) => s.seq[s.seq.length - 1] !== 'c5', text: L(
      "Chiziq oxirida o'tkaziladi, hamma nuqta joyiga qo'yilgandan keyin.",
      'Линию проводят в конце, когда все точки уже расставлены.',
      'The line is drawn at the end, once all the points are in place.') },
    { when: (s) => s.seq.indexOf('c3') < s.seq.indexOf('c1'), text: L(
      "Yasash uchidan boshlanadi: u parabolaning o'rnini belgilaydi, nollar esa uning kengligini.",
      'Построение начинается с вершины: она задаёт место параболы, а нули — её ширину.',
      'Building starts from the vertex: it sets where the parabola is, while the zeros set how wide it is.') },
    { when: (s) => s.seq.indexOf('c2') < s.seq.indexOf('c1'), text: L(
      "Bu qator formulani QO'LLASH natijasi. Formulaning o'zi undan oldin yozilishi kerak.",
      'Эта строка — результат ПРИМЕНЕНИЯ формулы. Сама формула должна стоять раньше.',
      'This line is the result of APPLYING the formula. The formula itself must come first.') },
  ],
  wrongText: L(
    "Zanjirni yuqoridan pastga o'qing: har qadam o'zidan oldingisining natijasidan foydalanadimi?",
    'Прочитай цепочку сверху вниз: пользуется ли каждый шаг результатом предыдущего?',
    'Read the chain from top to bottom: does every step use the result of the one before it?'),
};

export default function D04_08(props) { return <OrderLines data={DATA} {...props} />; }
