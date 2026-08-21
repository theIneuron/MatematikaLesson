// Dars28 · Amaliyot 07 — 63 · 57 og'zaki · 🟡 · order · tag: formula_order
// Mexanika: kit.jsx -> BuildLine (tartib muhim). Raskladka: 7-o'rin.
// 63 · 57 = (60 + 3)(60 − 3) = 3600 − 9 = 3591.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'formula_order', level: '🟡',
  eyebrow: L('Uch qadam', 'Три шага', 'Three steps'),
  setup: L(
    "63 va 57 ning o'rtasi 60. Formulani ishlatsa ustunda ko'paytirish kerak bo'lmaydi.",
    'Середина между 63 и 57 это 60. С формулой умножать в столбик не придётся.',
    'The midpoint of 63 and 57 is 60. With the formula no long multiplication is needed.'),
  expr: ['63', '·', '57'], exprSize: 34,
  cards: [
    { id: 'a', label: '(60 + 3)(60 − 3)' },
    { id: 'b', label: '3600 − 9' },
    { id: 'c', label: '3591' },
    { id: 'd', label: '3600 − 6' },
    { id: 'e', label: '3594' },
  ],
  answerSeq: ['a', 'b', 'c'],
  empty: L("Uch qadamni tartib bilan qo'ying", 'Поставь три шага по порядку', 'Place the three steps in order'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. (60 + 3)(60 − 3) = 60² − 3² = 3600 − 9 = 3591.",
    'Верно. (60 + 3)(60 − 3) = 60² − 3² = 3600 − 9 = 3591.',
    'Correct. (60 + 3)(60 − 3) = 60² − 3² = 3600 − 9 = 3591.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('d') !== -1 || s.seq.indexOf('e') !== -1, text: L(
      "3600 − 6 da uchlik kvadratga ko'tarilmagan: 3² = 9, 6 emas.",
      'В 3600 − 6 тройка не возведена в квадрат: 3² = 9, а не 6.',
      'In 3600 − 6 the three was not squared: 3² = 9, not 6.') },
    { when: (s) => s.seq.length === 3, text: L(
      "Qadamlar to'g'ri, tartibi boshqa: qavslar, ayirma, natija.",
      'Шаги верные, но порядок другой: скобки, разность, результат.',
      'The steps are right but the order is not: brackets, difference, result.') },
    { when: (s) => s.seq.length < 3, text: L(
      "Uch qadam bo'lishi kerak.",
      'Должно быть три шага.',
      'There must be three steps.') },
  ],
  wrongText: L(
    "60² nechchi, 3² nechchi? Ularning ayirmasini toping.",
    'Чему равно 60² и чему 3²? Найди разность.',
    'What is 60² and what is 3²? Take the difference.'),
};

export default function D28_07(props) { return <BuildLine data={DATA} {...props} />; }
