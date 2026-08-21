// Dars37 · Amaliyot 03 — Manfiy k · 🟢 · order · tag: prop_order
// Mexanika: kit.jsx -> BuildLine (tartib muhim). Raskladka: 3-o'rin.
// (4; −12): k = y : x -> k = −12 : 4 -> k = −3.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'prop_order', level: '🟢',
  eyebrow: L('Manfiy k', 'Отрицательный k', 'A negative k'),
  setup: L(
    "Uch qadam: qoidani yozish, sonlarni qo'yish, natijani hisoblash. Ordinata manfiy bo'lsa k ham manfiy chiqadi.",
    'Три шага: записать правило, подставить числа, посчитать. Если ордината отрицательная, k тоже отрицательный.',
    'Three steps: write the rule, substitute, work it out. A negative ordinate gives a negative k.'),
  given: [['(4;', '−12)']],
  givenLabel: L('Nuqta:', 'Точка:', 'The point:'),
  cards: [
    { id: 'a', label: 'k = y : x' },
    { id: 'b', label: 'k = −12 : 4' },
    { id: 'c', label: 'k = −3' },
    { id: 'd', label: 'k = 4 : (−12)' },
    { id: 'e', label: 'k = 3' },
  ],
  answerSeq: ['a', 'b', 'c'],
  empty: L("Uch qadamni tartib bilan qo'ying", 'Поставь три шага по порядку', 'Place the three steps in order'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. k = −12 : 4 = −3, ya'ni y = −3x. Grafik pastga qarab ketadi.",
    'Верно. k = −12 : 4 = −3, значит y = −3x. График идёт вниз.',
    'Correct. k = −12 : 4 = −3, so y = −3x. The graph falls.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "Bo'linish tartibi teskari: k = y : x, ya'ni ordinata abssissaga bo'linadi.",
      'Порядок деления обратный: k = y : x, ордината делится на абсциссу.',
      'The division is reversed: k = y : x, the ordinate over the abscissa.') },
    { when: (s) => s.seq.indexOf('e') !== -1, text: L(
      "Ishora yo'qoldi: manfiyni musbatga bo'lsa manfiy chiqadi.",
      'Потерялся знак: отрицательное, делённое на положительное, даёт отрицательное.',
      'The sign got lost: a negative over a positive is negative.') },
    { when: (s) => s.seq.length === 3, text: L(
      "Qadamlar to'g'ri, tartibi boshqa: qoida, qo'yish, natija.",
      'Шаги верные, но порядок другой: правило, подстановка, результат.',
      'The steps are right but the order is not: rule, substitution, result.') },
    { when: (s) => s.seq.length < 3, text: L(
      "Uch qadam bo'lishi kerak.",
      'Должно быть три шага.',
      'There must be three steps.') },
  ],
  wrongText: L(
    "k = y : x. Qaysi son ordinata, qaysi biri abssissa?",
    'k = y : x. Какое число ордината, а какое абсцисса?',
    'k = y : x. Which number is the ordinate and which the abscissa?'),
};

export default function D37_03(props) { return <BuildLine data={DATA} {...props} />; }
