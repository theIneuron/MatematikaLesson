// Dars46 · Amaliyot 06 — Uch qadamli tekshirish · 🟡 · order · tag: ineq_order
// Mexanika: kit.jsx -> BuildLine (tartib muhim). Raskladka: 6-o'rin.
// 6, 7, 15: 6 + 7 = 13, 13 < 15 -> uchburchak yo'q.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'ineq_order', level: '🟡',
  eyebrow: L('Uch qadam', 'Три шага', 'Three steps'),
  setup: L(
    "Tekshirish uch qadamda: ikki kichik tomonni qo'shish, eng katta bilan solishtirish, xulosa.",
    'Проверка в три шага: сложить две меньшие стороны, сравнить с наибольшей, сделать вывод.',
    'The check takes three steps: add the two shorter sides, compare with the longest, conclude.'),
  given: [['6,', '7,', '15']],
  givenLabel: L('Tomonlar:', 'Стороны:', 'Sides:'),
  cards: [
    { id: 'a', label: '6 + 7 = 13' },
    { id: 'b', label: '13 < 15' },
    { id: 'c', label: "uchburchak yo'q" },
    { id: 'd', label: '13 > 15' },
    { id: 'e', label: 'uchburchak bor' },
  ],
  answerSeq: ['a', 'b', 'c'],
  empty: L("Uch qadamni tartib bilan qo'ying", 'Поставь три шага по порядку', 'Place the three steps in order'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 6 + 7 = 13, 13 < 15, ya'ni tomonlar tutashmaydi -- bunday uchburchak yo'q.",
    'Верно. 6 + 7 = 13, 13 < 15, значит стороны не сомкнутся — такого треугольника нет.',
    'Correct. 6 + 7 = 13 and 13 < 15, so the sides cannot meet — no such triangle.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('d') !== -1 || s.seq.indexOf('e') !== -1, text: L(
      "13 va 15 ni solishtiring: 13 kichik, ya'ni shart bajarilmadi.",
      'Сравни 13 и 15: тринадцать меньше, значит условие не выполнено.',
      'Compare 13 with 15: thirteen is less, so the condition fails.') },
    { when: (s) => s.seq.length === 3, text: L(
      "Qadamlar to'g'ri, tartibi boshqa: yig'indi, solishtirish, xulosa.",
      'Шаги верные, но порядок другой: сумма, сравнение, вывод.',
      'The steps are right but the order is not: sum, comparison, conclusion.') },
    { when: (s) => s.seq.length < 3, text: L(
      "Uch qadam bo'lishi kerak.",
      'Должно быть три шага.',
      'There must be three steps.') },
  ],
  wrongText: L(
    "Ikki kichik tomonni qo'shing va eng katta bilan solishtiring.",
    'Сложи две меньшие стороны и сравни с наибольшей.',
    'Add the two shorter sides and compare with the longest.'),
};

export default function D46_06(props) { return <BuildLine data={DATA} {...props} />; }
