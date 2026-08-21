// Dars38 · Amaliyot 01 — Yechim nima · 🟢 · choice · tag: sys_what_solution
// Mexanika: kit.jsx -> Choice. Raskladka: 38-dars, 1-o'rin (isinish).
// Sistemaning yechimi -- IKKI tenglamani ham bajaradigan juftlik.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'sys_what_solution', level: '🟢',
  eyebrow: L('Sistemaning yechimi', 'Решение системы', 'A solution of a system'),
  setup: L(
    "Sistemada ikki tenglama birga turadi. Yechim ikkovini ham bajarishi kerak: bittasini bajarish yetarli emas.",
    'В системе два уравнения стоят вместе. Решение должно подходить обоим: одного мало.',
    'A system holds two equations at once. A solution must satisfy both: one is not enough.'),
  ask: L('Sistemaning yechimi nima?', 'Что такое решение системы?', 'What is a solution of a system?'),
  opts: [
    { label: L("Ikki tenglamani ham bajaradigan juftlik", 'Пара, подходящая обоим уравнениям', 'A pair that fits both equations') },
    { label: L("Bittasini bajaradigan juftlik", 'Пара, подходящая одному', 'A pair that fits one') },
    { label: L("O'qdagi har qanday nuqta", 'Любая точка на оси', 'Any point on an axis') },
  ],
  correct: 0,
  correctText: L(
    "To'g'ri. Yechim ikki tenglamani ham to'g'ri tenglikka aylantiradi. Grafikda bu ikki chiziqning kesishish nuqtasi.",
    'Верно. Решение обращает оба уравнения в верные равенства. На графике это точка пересечения двух прямых.',
    'Correct. A solution makes both equations true. On a graph it is where the two lines cross.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Bittasini bajarish yetmaydi: bunday juftliklar cheksiz ko'p. Sistema ikkovini birga so'raydi.",
      'Подходить одному недостаточно: таких пар бесконечно много. Система требует оба сразу.',
      'Fitting one is not enough: there are infinitely many such pairs. A system needs both.') },
    { when: (s) => s.picked === 2, text: L(
      "O'qdagi nuqtalar tenglamalarga bog'liq emas: yechim tenglamalardan chiqadi.",
      'Точки на осях не связаны с уравнениями: решение выходит из самих уравнений.',
      'Points on an axis have nothing to do with it: the solution comes from the equations.') },
  ],
  wrongText: L(
    "Sistemada nechta tenglama bor? Yechim nechtasini bajarishi kerak?",
    'Сколько уравнений в системе? Скольким должно подходить решение?',
    'How many equations are in a system? How many must the solution satisfy?'),
};

export default function D38_01(props) { return <Choice data={DATA} {...props} />; }
