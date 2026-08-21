// Dars33 · Amaliyot 02 — Nuqta qayerda · 🟢 · choice · tag: point_where
// Mexanika: kit.jsx -> Choice. Raskladka: 2-o'rin (isinish).
// (0; −6): abssissa nol, ya'ni nuqta y o'qida yotadi (nolning pastida).
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'point_where', level: '🟢',
  eyebrow: L('Nuqta qayerda', 'Где точка', 'Where the point is'),
  setup: L(
    "Nol koordinata nuqtani o'qqa olib chiqadi: abssissa nol bo'lsa nuqta y o'qida, ordinata nol bo'lsa x o'qida yotadi.",
    'Нулевая координата выводит точку на ось: если абсцисса нуль, точка на оси y, если ордината нуль — на оси x.',
    'A zero coordinate puts the point on an axis: zero abscissa means the y axis, zero ordinate the x axis.'),
  expr: ['(0;', '−6)'], exprSize: 34,
  ask: L('Bu nuqta qayerda yotadi?', 'Где лежит эта точка?', 'Where does this point lie?'),
  opts: [
    { label: L('y o\'qida', 'На оси y', 'On the y axis') },
    { label: L('x o\'qida', 'На оси x', 'On the x axis') },
    { label: L('Ikkinchi chorakda', 'Во второй четверти', 'In the second quadrant') },
  ],
  correct: 0,
  correctText: L(
    "To'g'ri. Abssissa nol, ya'ni nuqta o'ngga ham chapga ham siljimaydi: u y o'qida, noldan olti pastda.",
    'Верно. Абсцисса нуль, значит точка не сдвигается ни вправо, ни влево: она на оси y, на шесть ниже нуля.',
    'Correct. The abscissa is zero, so no shift left or right: the point sits on the y axis, six below zero.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "x o'qida yotish uchun ORDINATA nol bo'lishi kerak. Bizda esa abssissa nol.",
      'Чтобы лежать на оси x, нулём должна быть ОРДИНАТА. А у нас нуль абсцисса.',
      'To sit on the x axis the ORDINATE must be zero. Here the abscissa is.') },
    { when: (s) => s.picked === 2, text: L(
      "Choraklarda yotish uchun ikki koordinata ham noldan farqli bo'lishi kerak.",
      'Чтобы лежать в четверти, обе координаты должны быть отличны от нуля.',
      'To lie in a quadrant both coordinates must be non-zero.') },
  ],
  wrongText: L(
    "Qaysi koordinata nol? Nol siljish qaysi o'q bo'ylab yo'q degani?",
    'Какая координата нулевая? По какой оси нет сдвига?',
    'Which coordinate is zero? Along which axis is there no shift?'),
};

export default function D33_02(props) { return <Choice data={DATA} {...props} />; }
