// Dars26 · Amaliyot 08 — Uch qadamli og'zaki hisob · 🔴 · order · tag: mental_order
// Mexanika: kit.jsx -> BuildLine (tartib muhim). Raskladka: 8-o'rin.
// 84 · 76 = (80 + 4)(80 − 4) = 6400 − 16 = 6384.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'mental_order', level: '🔴',
  eyebrow: L('Uch qadam', 'Три шага', 'Three steps'),
  setup: L(
    "84 va 76 ning o'rtasi 80, ikkovi ham undan to'rt qadam uzoqda. Uch qadamni tartib bilan qo'yish kerak.",
    'Середина между 84 и 76 это 80, оба на четыре шага от неё. Три шага надо расставить по порядку.',
    'The midpoint of 84 and 76 is 80, each four steps away. Place the three steps in order.'),
  expr: ['84', '·', '76'], exprSize: 34,
  cards: [
    { id: 'a', label: '(80 + 4)(80 − 4)' },
    { id: 'b', label: '6400 − 16' },
    { id: 'c', label: '6384' },
    { id: 'd', label: '6400 − 8' },
    { id: 'e', label: '6392' },
  ],
  answerSeq: ['a', 'b', 'c'],
  empty: L("Uch qadamni tartib bilan qo'ying", 'Поставь три шага по порядку', 'Place the three steps in order'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. (80 + 4)(80 − 4) = 80² − 4² = 6400 − 16 = 6384.",
    'Верно. (80 + 4)(80 − 4) = 80² − 4² = 6400 − 16 = 6384.',
    'Correct. (80 + 4)(80 − 4) = 80² − 4² = 6400 − 16 = 6384.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('d') !== -1 || s.seq.indexOf('e') !== -1, text: L(
      "6400 − 8 da to'rt kvadratga ko'tarilmagan: 4² = 16, 8 emas. To'g'ri javob 6384.",
      'В 6400 − 8 четвёрка не возведена в квадрат: 4² = 16, а не 8. Верный ответ 6384.',
      'In 6400 − 8 the four was not squared: 4² = 16, not 8. The right answer is 6384.') },
    { when: (s) => s.seq.length === 3, text: L(
      "Qadamlar to'g'ri, tartibi boshqa: avval qavslar, keyin kvadratlar ayirmasi, oxirida son.",
      'Шаги верные, но порядок другой: сначала скобки, потом разность квадратов, в конце число.',
      'The steps are right but the order is not: brackets, then the difference of squares, then the number.') },
    { when: (s) => s.seq.length < 3, text: L(
      "Uch qadam bo'lishi kerak.",
      'Должно быть три шага.',
      'There must be three steps.') },
  ],
  wrongText: L(
    "80² nechchi? 4² nechchi? Ularning ayirmasini toping.",
    'Чему равно 80²? А 4²? Найди их разность.',
    'What is 80²? And 4²? Take their difference.'),
};

export default function D26_08(props) { return <BuildLine data={DATA} {...props} />; }
