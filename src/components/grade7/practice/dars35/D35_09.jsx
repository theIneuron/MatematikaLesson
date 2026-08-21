// Dars35 · Amaliyot 09 — Nol qiymat · 🔴 · order · tag: lin_zero
// Mexanika: kit.jsx -> BuildLine (tartib muhim). Raskladka: 9-o'rin.
// y = 2x − 10, y = 0: 2x − 10 = 0 -> 2x = 10 -> x = 5.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'lin_zero', level: '🔴',
  eyebrow: L('Nol qiymat', 'Нулевое значение', 'A zero value'),
  setup: L(
    "y = 0 bo'lgan x grafikning x o'qini kesish nuqtasini beradi. Uni topish uchun tenglama yechiladi.",
    'Значение x при y = 0 даёт точку пересечения графика с осью x. Чтобы его найти, решается уравнение.',
    'The x with y = 0 gives where the graph meets the x axis. Solve an equation to find it.'),
  given: [['y', '=', '2x', '−', '10']],
  givenLabel: L('Formula:', 'Формула:', 'The rule:'),
  cards: [
    { id: 'a', label: '2x − 10 = 0' },
    { id: 'b', label: '2x = 10' },
    { id: 'c', label: 'x = 5' },
    { id: 'd', label: '2x = −10' },
    { id: 'e', label: 'x = −5' },
  ],
  answerSeq: ['a', 'b', 'c'],
  empty: L("Uch qadamni tartib bilan qo'ying", 'Поставь три шага по порядку', 'Place the three steps in order'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 2x − 10 = 0 -> 2x = 10 -> x = 5. Grafik x o'qini (5; 0) nuqtasida kesadi.",
    'Верно. 2x − 10 = 0 → 2x = 10 → x = 5. График пересекает ось x в точке (5; 0).',
    'Correct. 2x − 10 = 0 → 2x = 10 → x = 5. The graph meets the x axis at (5; 0).'),
  wrongs: [
    { when: (s) => s.seq.indexOf('d') !== -1 || s.seq.indexOf('e') !== -1, text: L(
      "Ko'chirishda ishora almashadi: −10 o'ng tomonga o'tsa +10 bo'ladi.",
      'При переносе знак меняется: −10 справа становится +10.',
      'Moving flips the sign: −10 becomes +10 on the right.') },
    { when: (s) => s.seq.length === 3, text: L(
      "Qadamlar to'g'ri, tartibi boshqa: tenglama, ko'chirish, ildiz.",
      'Шаги верные, но порядок другой: уравнение, перенос, корень.',
      'The steps are right but the order is not: equation, move, root.') },
    { when: (s) => s.seq.length < 3, text: L(
      "Uch qadam bo'lishi kerak.",
      'Должно быть три шага.',
      'There must be three steps.') },
  ],
  wrongText: L(
    "Formulani nolga tenglashtiring, keyin ozod hadni o'ng tomonga ko'chiring.",
    'Приравняй формулу к нулю, потом перенеси свободный член вправо.',
    'Set the rule to zero, then move the free term to the right.'),
};

export default function D35_09(props) { return <BuildLine data={DATA} {...props} />; }
