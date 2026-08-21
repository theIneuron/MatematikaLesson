// Dars47 · Amaliyot 02 — Nimaga teng · 🟢 · choice · tag: pyth_choice
// Mexanika: kit.jsx -> Choice. Raskladka: 2-o'rin (isinish).
// Gipotenuzaning KVADRATI katetlar KVADRATLARINING yig'indisiga teng.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'pyth_choice', level: '🟢',
  eyebrow: L('Teorema', 'Теорема', 'The theorem'),
  setup: L(
    "Pifagor teoremasi to'g'ri burchakli uchburchakda tomonlar orasidagi bog'lanishni beradi. Muhim: gap KVADRATLAR haqida.",
    'Теорема Пифагора связывает стороны прямоугольного треугольника. Важно: речь о КВАДРАТАХ.',
    'The Pythagorean theorem links the sides of a right triangle. Note: it is about SQUARES.'),
  ask: L('Gipotenuzaning kvadrati nimaga teng?', 'Чему равен квадрат гипотенузы?', 'What does the square of the hypotenuse equal?'),
  opts: [
    { label: L('Katetlar kvadratlari yig\'indisiga', 'Сумме квадратов катетов', 'The sum of the legs squared') },
    { label: L("Katetlar yig'indisiga", 'Сумме катетов', 'The sum of the legs') },
    { label: L('Katetlar ayirmasiga', 'Разности катетов', 'The difference of the legs') },
  ],
  correct: 0,
  correctText: L(
    "To'g'ri. c² = a² + b². Kvadratlar qo'shiladi, tomonlarning o'zi emas.",
    'Верно. c² = a² + b². Складываются квадраты, а не сами стороны.',
    'Correct. c² = a² + b². The squares add, not the sides themselves.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Katetlar yig'indisi gipotenuzadan katta bo'ladi: 6 + 8 = 14, gipotenuza esa 10.",
      'Сумма катетов больше гипотенузы: 6 + 8 = 14, а гипотенуза 10.',
      'The sum of the legs exceeds the hypotenuse: 6 + 8 = 14 while it is 10.') },
    { when: (s) => s.picked === 2, text: L(
      "Ayirma juda kichik bo'ladi: 8 − 6 = 2, gipotenuza esa 10. Teoremada kvadratlar QO'SHILADI.",
      'Разность слишком мала: 8 − 6 = 2, а гипотенуза 10. В теореме квадраты СКЛАДЫВАЮТСЯ.',
      'The difference is far too small: 8 − 6 = 2 versus 10. The theorem ADDS the squares.') },
  ],
  wrongText: L(
    "6 va 8 katetli uchburchakni eslang: gipotenuza 10. 14 yoki 2 emas.",
    'Вспомни треугольник с катетами 6 и 8: гипотенуза 10, а не 14 и не 2.',
    'Recall legs 6 and 8: the hypotenuse is 10, not 14 or 2.'),
};

export default function D47_02(props) { return <Choice data={DATA} {...props} />; }
