// Dars34 · Amaliyot 06 — Teskari savol · 🟡 · build · tag: fn_reverse
// Mexanika: kit.jsx -> BuildLine. Raskladka: 6-o'rin.
// f(x) = 2x − 8. f(x) = 0 bo'lgan x: 2x − 8 = 0 -> x = 4.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'fn_reverse', level: '🟡',
  eyebrow: L('Teskari savol', 'Обратный вопрос', 'The reverse question'),
  setup: L(
    "Bu yerda y berilgan, x so'ralgan. Formulani tenglamaga aylantirib yechish kerak.",
    'Здесь дано y, а спрашивается x. Формулу надо превратить в уравнение и решить.',
    'Here y is given and x is asked. Turn the rule into an equation and solve it.'),
  given: [['f(x)', '=', '2x', '−', '8'], ['f(x)', '=', '0']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  cards: [
    { id: 'a', label: '2x − 8 = 0' },
    { id: 'b', label: 'x = 4' },
    { id: 'c', label: 'x = −4' },
    { id: 'd', label: '2x = −8' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Tenglamani tuzib yeching", 'Составь уравнение и реши', 'Set up the equation and solve'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 2x − 8 = 0 -> 2x = 8 -> x = 4. Tekshirish: f(4) = 8 − 8 = 0.",
    'Верно. 2x − 8 = 0 → 2x = 8 → x = 4. Проверка: f(4) = 8 − 8 = 0.',
    'Correct. 2x − 8 = 0 → 2x = 8 → x = 4. Check: f(4) = 8 − 8 = 0.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "2x = −8 noto'g'ri: −8 ni o'ng tomonga ko'chirsa u +8 bo'ladi.",
      '2x = −8 неверно: при переносе −8 вправо она становится +8.',
      '2x = −8 is wrong: moving −8 to the right makes it +8.') },
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "x = −4 bo'lsa f(−4) = −8 − 8 = −16, nol emas.",
      'При x = −4 выходит f(−4) = −8 − 8 = −16, а не нуль.',
      'With x = −4 we get f(−4) = −8 − 8 = −16, not zero.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Ikki qadam kerak: tenglama va ildiz.",
      'Нужны два шага: уравнение и корень.',
      'Two steps are needed: the equation and the root.') },
  ],
  wrongText: L(
    "Formulani nolga tenglashtiring va tenglamani yeching.",
    'Приравняй формулу к нулю и реши уравнение.',
    'Set the rule equal to zero and solve.'),
};

export default function D34_06(props) { return <BuildLine data={DATA} {...props} />; }
