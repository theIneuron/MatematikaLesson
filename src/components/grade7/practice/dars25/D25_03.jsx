// Dars25 · Amaliyot 03 — Uch had tartib bilan · 🟢 · order · tag: sq_order
// Mexanika: kit.jsx -> BuildLine (tartib muhim). Raskladka: 3-o'rin.
// (x + 9)² = x² + 18x + 81. Tartib: kvadrat, ikki karra ko'paytma, kvadrat.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'sq_order', level: '🟢',
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Uch had tartibi doim bir xil: birinchisining kvadrati, ikki karra ko'paytma, ikkinchisining kvadrati.",
    'Порядок трёх членов всегда один: квадрат первого, двойное произведение, квадрат второго.',
    'The order is always the same: the first squared, twice the product, the second squared.'),
  expr: ['(x', '+', '9)²'], exprSize: 34,
  cards: [
    { id: 'a', label: 'x²' },
    { id: 'b', label: '+18x' },
    { id: 'c', label: '+81' },
    { id: 'd', label: '+9x' },
    { id: 'e', label: '+18' },
  ],
  answerSeq: ['a', 'b', 'c'],
  empty: L("Uch hadni tartib bilan qo'ying", 'Поставь три члена по порядку', 'Place the three terms in order'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. x², keyin 2 · x · 9 = 18x, oxirida 9² = 81.",
    'Верно. x², потом 2 · x · 9 = 18x, в конце 9² = 81.',
    'Correct. x², then 2 · x · 9 = 18x, and finally 9² = 81.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "+9x da ikki karra yo'q: 2 · x · 9 = 18x.",
      'В +9x нет двойки: 2 · x · 9 = 18x.',
      '+9x misses the doubling: 2 · x · 9 = 18x.') },
    { when: (s) => s.seq.indexOf('e') !== -1, text: L(
      "+18 bu 2 · 9. Oxirgi had kvadrat bo'ladi: 81.",
      '+18 это 2 · 9. Последний член это квадрат: 81.',
      '+18 is 2 · 9. The last term is a square: 81.') },
    { when: (s) => s.seq.length === 3, text: L(
      "Hadlar to'g'ri, tartibi boshqa: kvadrat, ko'paytma, kvadrat.",
      'Члены верные, но порядок другой: квадрат, произведение, квадрат.',
      'The terms are right but the order is not: square, product, square.') },
    { when: (s) => s.seq.length < 3, text: L(
      "Uch had bo'lishi kerak.",
      'Должно быть три члена.',
      'There must be three terms.') },
  ],
  wrongText: L(
    "Birinchi had nima beradi, o'rtada nima turadi, oxirida nima?",
    'Что даёт первый член, что стоит в середине и что в конце?',
    'What does the first term give, what stands in the middle and what at the end?'),
};

export default function D25_03(props) { return <BuildLine data={DATA} {...props} />; }
