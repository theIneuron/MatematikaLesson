// Dars38 · Amaliyot 04 — Ikkinchi tenglama oson · 🟡 · build · tag: sys_easy
// Mexanika: kit.jsx -> BuildLine. Raskladka: 4-o'rin.
// y = x + 1 va y = 3: y ma'lum, ya'ni x + 1 = 3 -> x = 2. Yechim (2; 3).
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'sys_easy', level: '🟡',
  eyebrow: L('Bittasi ma\'lum', 'Одно известно', 'One is known'),
  setup: L(
    "Ikkinchi tenglama y ni to'g'ridan beradi. Uni birinchisiga qo'yib x topiladi.",
    'Второе уравнение сразу даёт y. Подставив его в первое, находим x.',
    'The second equation gives y outright. Put it into the first to find x.'),
  given: [['y', '=', 'x', '+', '1'], ['y', '=', '3']],
  givenLabel: L('Sistema:', 'Система:', 'The system:'),
  cards: [
    { id: 'a', label: 'x = 2' },
    { id: 'b', label: 'y = 3' },
    { id: 'c', label: 'x = 4' },
    { id: 'd', label: 'y = 2' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Yechimni yozing", 'Запиши решение', 'Write the solution'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. x + 1 = 3 dan x = 2. Yechim (2; 3): ikki tenglama ham bajarildi.",
    'Верно. Из x + 1 = 3 выходит x = 2. Решение (2; 3): оба уравнения выполнены.',
    'Correct. From x + 1 = 3 we get x = 2. The solution is (2; 3): both equations hold.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "x = 4 bo'lsa y = 5 chiqadi, uchga teng emas. x + 1 = 3 dan x = 2.",
      'При x = 4 выходит y = 5, а не три. Из x + 1 = 3 следует x = 2.',
      'With x = 4 we get y = 5, not three. From x + 1 = 3 comes x = 2.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "y allaqachon berilgan: y = 3. Uni o'zgartirish kerak emas.",
      'y уже дан: y = 3. Менять его не нужно.',
      'y is already given as 3. No need to change it.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Javobda ikki son bo'ladi: x va y.",
      'В ответе два числа: x и y.',
      'The answer has two numbers: x and y.') },
  ],
  wrongText: L(
    "y ni birinchi tenglamaga qo'ying va x ni toping.",
    'Подставь y в первое уравнение и найди x.',
    'Put y into the first equation and find x.'),
};

export default function D38_04(props) { return <BuildLine data={DATA} {...props} />; }
