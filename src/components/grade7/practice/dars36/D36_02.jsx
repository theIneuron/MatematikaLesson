// Dars36 · Amaliyot 02 — Qurish qadamlari · 🟢 · order · tag: draw_order
// Mexanika: kit.jsx -> BuildLine (tartib muhim). Raskladka: 2-o'rin.
// y = 2x + 3: x = 0 -> y = 3; x = 1 -> y = 5; ikki nuqtadan chiziq.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'draw_order', level: '🟢',
  eyebrow: L('Qadamlar', 'Шаги', 'The steps'),
  setup: L(
    "Grafik qurish tartibi: bir nuqta, ikkinchi nuqta, keyin ular orqali to'g'ri chiziq.",
    'Порядок построения: одна точка, вторая точка, потом прямая через них.',
    'The order: one point, a second point, then the line through them.'),
  given: [['y', '=', '2x', '+', '3']],
  givenLabel: L('Formula:', 'Формула:', 'The rule:'),
  cards: [
    { id: 'a', label: '(0; 3)' },
    { id: 'b', label: '(1; 5)' },
    { id: 'c', label: '(0; 2)' },
    { id: 'd', label: '(1; 3)' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Ikki nuqtani toping", 'Найди две точки', 'Find two points'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Nuqtalar', 'Точки', 'Points'),
  correctText: L(
    "To'g'ri. x = 0 da y = 3, x = 1 da y = 5. Shu ikki nuqtadan to'g'ri chiziq o'tkaziladi.",
    'Верно. При x = 0 выходит y = 3, при x = 1 выходит y = 5. Через эти точки проводится прямая.',
    'Correct. At x = 0, y = 3; at x = 1, y = 5. The line goes through those points.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "(0; 2) noto'g'ri: x = 0 da y = 3, ozod had 3 ga teng.",
      '(0; 2) неверно: при x = 0 выходит y = 3, свободный член равен 3.',
      '(0; 2) is wrong: at x = 0, y = 3, the free term is 3.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "(1; 3) noto'g'ri: x = 1 da 2 · 1 + 3 = 5.",
      '(1; 3) неверно: при x = 1 выходит 2 · 1 + 3 = 5.',
      '(1; 3) is wrong: at x = 1 we get 2 · 1 + 3 = 5.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Ikki nuqta kerak.",
      'Нужны две точки.',
      'Two points are needed.') },
  ],
  wrongText: L(
    "x = 0 va x = 1 uchun y ni hisoblang.",
    'Посчитай y для x = 0 и x = 1.',
    'Work out y for x = 0 and x = 1.'),
};

export default function D36_02(props) { return <BuildLine data={DATA} {...props} />; }
