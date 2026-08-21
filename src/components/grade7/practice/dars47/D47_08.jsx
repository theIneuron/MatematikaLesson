// Dars47 · Amaliyot 08 — Uch qadam · 🔴 · order · tag: pyth_order
// Mexanika: kit.jsx -> BuildLine (tartib muhim). Raskladka: 8-o'rin.
// Katet 8, gipotenuza 17: 289 − 64 = 225 -> 15.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'pyth_order', level: '🔴',
  eyebrow: L('Uch qadam', 'Три шага', 'Three steps'),
  setup: L(
    "Uch qadam: kvadratlarni yozish, ayirish, ildiz olish. Tartibni buzsa javob boshqa chiqadi.",
    'Три шага: записать квадраты, вычесть, извлечь корень. При нарушении порядка ответ другой.',
    'Three steps: write the squares, subtract, take the root. Breaking the order changes the answer.'),
  given: [['a', '=', '8'], ['c', '=', '17']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  cards: [
    { id: 'a', label: '289 − 64' },
    { id: 'b', label: '225' },
    { id: 'c', label: '15' },
    { id: 'd', label: '17 − 8' },
    { id: 'e', label: '9' },
  ],
  answerSeq: ['a', 'b', 'c'],
  empty: L("Uch qadamni tartib bilan qo'ying", 'Поставь три шага по порядку', 'Place the three steps in order'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 17² − 8² = 289 − 64 = 225, ildizi 15. Tekshirish: 64 + 225 = 289.",
    'Верно. 17² − 8² = 289 − 64 = 225, корень 15. Проверка: 64 + 225 = 289.',
    'Correct. 17² − 8² = 289 − 64 = 225, root 15. Check: 64 + 225 = 289.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('d') !== -1 || s.seq.indexOf('e') !== -1, text: L(
      "Tomonlarning o'zini ayirib bo'lmaydi: 17 − 8 = 9, lekin 8² + 9² = 145, 289 emas.",
      'Сами стороны вычитать нельзя: 17 − 8 = 9, но 8² + 9² = 145, а не 289.',
      'The sides themselves cannot be subtracted: 17 − 8 = 9, yet 8² + 9² = 145, not 289.') },
    { when: (s) => s.seq.length === 3, text: L(
      "Qadamlar to'g'ri, tartibi boshqa: kvadratlar ayirmasi, natija, ildiz.",
      'Шаги верные, но порядок другой: разность квадратов, результат, корень.',
      'The steps are right but the order is not: difference of squares, result, root.') },
    { when: (s) => s.seq.length < 3, text: L(
      "Uch qadam bo'lishi kerak.",
      'Должно быть три шага.',
      'There must be three steps.') },
  ],
  wrongText: L(
    "Avval kvadratlarni hisoblang, keyin ayiring, oxirida ildiz oling.",
    'Сначала посчитай квадраты, потом вычти, в конце извлеки корень.',
    'Square first, then subtract, then take the root.'),
};

export default function D47_08(props) { return <BuildLine data={DATA} {...props} />; }
