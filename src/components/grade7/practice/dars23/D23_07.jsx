// Dars23 · Amaliyot 07 — Uch qadam tartib bilan · 🟡 · order · tag: group_order
// Mexanika: kit.jsx -> BuildLine (tartib muhim). Raskladka: 7-o'rin.
// 6x² + 9x + 4x + 6: 3x(2x + 3), keyin 2(2x + 3), natija (2x + 3)(3x + 2).
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'group_order', level: '🟡',
  eyebrow: L('Uch qadam', 'Три шага', 'Three steps'),
  setup: L(
    "Uch qadamni tartib bilan qo'yish kerak: birinchi guruh, ikkinchi guruh, keyin umumiy qavs chiqarilgan natija.",
    'Три шага надо расставить по порядку: первая группа, вторая группа, потом результат с вынесенной общей скобкой.',
    'Three steps in order: the first group, the second group, then the result with the common bracket taken out.'),
  expr: ['6x²', '+', '9x', '+', '4x', '+', '6'], exprSize: 28,
  cards: [
    { id: 'a', label: '3x(2x + 3)' },
    { id: 'b', label: '+2(2x + 3)' },
    { id: 'c', label: '(2x + 3)(3x + 2)' },
    { id: 'd', label: '3x(2x + 2)' },
    { id: 'e', label: '(2x + 3)(3x + 3)' },
  ],
  answerSeq: ['a', 'b', 'c'],
  empty: L("Qadamlarni tartib bilan qo'ying", 'Поставь шаги по порядку', 'Place the steps in order'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 6x² + 9x = 3x(2x + 3), 4x + 6 = 2(2x + 3). Umumiy qavs chiqsa (2x + 3)(3x + 2).",
    'Верно. 6x² + 9x = 3x(2x + 3), 4x + 6 = 2(2x + 3). После выноса общей скобки (2x + 3)(3x + 2).',
    'Correct. 6x² + 9x = 3x(2x + 3), 4x + 6 = 2(2x + 3). Taking out the bracket gives (2x + 3)(3x + 2).'),
  wrongs: [
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "3x(2x + 2) ochilsa 6x² + 6x chiqadi, bizda esa 9x. To'g'risi 3x(2x + 3).",
      'Раскрытие 3x(2x + 2) даёт 6x² + 6x, а у нас 9x. Верно 3x(2x + 3).',
      'Opening 3x(2x + 2) gives 6x² + 6x, but we have 9x. The right one is 3x(2x + 3).') },
    { when: (s) => s.seq.indexOf('e') !== -1, text: L(
      "Ikkinchi qavsga qavs oldidagi hadlar tushadi: 3x va 2, ya'ni (3x + 2).",
      'Во вторую скобку попадают члены перед скобками: 3x и 2, то есть (3x + 2).',
      'The second bracket takes the front terms: 3x and 2, giving (3x + 2).') },
    { when: (s) => s.seq.length === 3, text: L(
      "Qadamlar to'g'ri, tartibi boshqa: avval ikki guruh, keyin umumiy qavs chiqarilgan natija.",
      'Шаги верные, но порядок другой: сначала две группы, потом результат.',
      'The steps are right but the order is not: the two groups first, then the result.') },
    { when: (s) => s.seq.length < 3, text: L(
      "Uch qadam bo'lishi kerak: birinchi guruh, ikkinchi guruh, natija.",
      'Должно быть три шага: первая группа, вторая группа, результат.',
      'There must be three steps: first group, second group, result.') },
  ],
  wrongText: L(
    "Birinchi ikki hadda nima umumiy? Keyingi ikkitasida-chi? Ikki qavs bir xil chiqishi kerak.",
    'Что общее в первых двух членах? А в следующих двух? Скобки должны выйти одинаковыми.',
    'What do the first two share? And the next two? The brackets must match.'),
};

export default function D23_07(props) { return <BuildLine data={DATA} {...props} />; }
