// Dars05 · Amaliyot 10 — Yasash · 🔴 · teg: uchi-notogri-oqish
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> OrderLines.
// Kontent: src/books/grade9/DARS05_AMALIYOT_KONTENT.md §10
//
// Yasash SOLISHTIRISHDAN boshlanadi: yozuv qaysi ko'rinishda ekanini
// bilmasdan, undan son olib bo'lmaydi. Oxirgi qadam — bitta nuqta bilan
// tekshirish, va u ham qadamning o'zi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, OrderLines } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'uchi-notogri-oqish', level: '🔴',
  eyebrow: L('Yasash', 'Построение', 'Construction'),
  setup: L(
    'Beshta qadam aralashtirilgan. Ular yasash tartibini hosil qiladi.',
    'Пять шагов перемешаны. Вместе они составляют порядок построения.',
    'Five steps are shuffled. Together they make the order of building.'),
  ask: L('Qadamlarni to\'g\'ri tartibga soling.', 'Расставь шаги по порядку.', 'Put the steps in the right order.'),
  empty: L('Kartochkalarni tartib bilan bosing', 'Нажимай карточки по порядку', 'Tap the cards in order'),
  itemSize: 15,
  givenLabel: L('Yasang', 'Построить', 'Build'),
  given: [['y = (x + 1)² − 4']],
  lines: [
    { id: 'c1', label: L('Yozuvni solishtiramiz:', 'Сравниваем запись с видом:', 'Compare the record with the form:'), tokens: ['y = (x − x₀)² + y₀'] },
    { id: 'c2', tokens: ['x₀ = −1', ',', 'y₀ = −4'] },
    { id: 'c3', label: L("Uchini qo'yamiz:", 'Ставим вершину:', 'Place the vertex:'), tokens: ['(−1; −4)'] },
    { id: 'c4', label: L(
      "y = x² parabolasini shu uchidan chizamiz",
      'Строим параболу y = x² от этой вершины',
      'Draw the parabola y = x² from that vertex') },
    { id: 'c5', label: L('Tekshirish:', 'Проверка:', 'Check:'), tokens: ['x = 0', '→', 'y = −3'] },
  ],
  answer: ['c1', 'c2', 'c3', 'c4', 'c5'],
  correctText: L(
    "To'g'ri. Yasash solishtirishdan boshlanadi: yozuv qaysi ko'rinishda ekanini bilmasdan, undan son olib bo'lmaydi. Keyin ikkita son chiqadi, ular uchini beradi, uchidan esa parabolaning o'zi chiziladi. Oxirida bitta nuqta bilan tekshiriladi — bu ham qadam.",
    'Верно. Построение начинается со сравнения: не зная, в каком виде записана формула, из неё не взять чисел. Потом получаются два числа, они дают вершину, а от вершины уже строится сама парабола. В конце проверка одной точкой — это тоже шаг.',
    'Correct. Building starts from the comparison: without knowing which form the record is in, no numbers can be taken from it. Then two numbers appear, they give the vertex, and the parabola itself is drawn from the vertex. At the end it is checked with one point — that is a step too.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c2') < s.seq.indexOf('c1'), text: L(
      "Bu qator solishtirishning natijasi. Nima bilan solishtirilganini aytmasdan, iks nol qayerdan chiqadi?",
      'Эта строка — результат сравнения. Если не сказано, с чем сравнивали, откуда возьмётся икс нулевое?',
      'This line is the result of the comparison. If it is not said what was compared with what, where would x-nought come from?') },
    { when: (s) => s.seq.indexOf('c4') < s.seq.indexOf('c3'), text: L(
      "Parabola uchidan chiziladi. Uchi hali qo'yilmagan bo'lsa, chiziqni qayerdan boshlaysiz?",
      'Параболу строят от вершины. Если вершина ещё не поставлена, откуда начинать линию?',
      'A parabola is drawn from the vertex. If the vertex is not placed yet, where do you start the line?') },
    { when: (s) => s.seq[s.seq.length - 1] !== 'c5', text: L(
      "Tekshirish tayyor grafikni tekshiradi. Undan oldin tekshiradigan narsa yo'q.",
      'Проверка проверяет готовый график. До него проверять нечего.',
      'The check tests a finished graph. Before it there is nothing to check.') },
    { when: (s) => s.seq[0] !== 'c1', text: L(
      "Yasash nimadan boshlanadi? Avval yozuvning ko'rinishi aniqlanadi, keyin undan sonlar olinadi.",
      'С чего начинается построение? Сначала определяют вид записи, и только потом берут из неё числа.',
      'Where does building start? First the form of the record is settled, and only then numbers are taken from it.') },
  ],
  wrongText: L(
    "Zanjirni yuqoridan pastga o'qing: har qadam o'zidan oldingisining natijasidan foydalanadimi?",
    'Прочитай цепочку сверху вниз: пользуется ли каждый шаг результатом предыдущего?',
    'Read the chain from top to bottom: does every step use the result of the one before it?'),
};

export default function D05_10(props) { return <OrderLines data={DATA} {...props} />; }
