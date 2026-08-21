// Dars47 · Amaliyot 07 — Katetni topish · 🟡 · build · tag: pyth_leg
// Mexanika: kit.jsx -> BuildLine. Raskladka: 7-o'rin.
// Gipotenuza 13, katet 5: 169 − 25 = 144, ikkinchi katet 12.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'pyth_leg', level: '🟡',
  eyebrow: L('Katetni topish', 'Найти катет', 'Find the leg'),
  setup: L(
    "Gipotenuza va bitta katet ma'lum. Ikkinchi katetni topish uchun kvadratlar AYIRILADI.",
    'Известны гипотенуза и один катет. Чтобы найти второй, квадраты ВЫЧИТАЮТСЯ.',
    'The hypotenuse and one leg are known. Finding the other SUBTRACTS the squares.'),
  given: [['c', '=', '13'], ['a', '=', '5']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  cards: [
    { id: 'a', label: '169 − 25 = 144' },
    { id: 'b', label: '12' },
    { id: 'c', label: '169 + 25 = 194' },
    { id: 'd', label: '8' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Hisoblab yozing", 'Запиши вычисление', 'Write the working'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 13² − 5² = 169 − 25 = 144, ildizi 12.",
    'Верно. 13² − 5² = 169 − 25 = 144, корень 12.',
    'Correct. 13² − 5² = 169 − 25 = 144, whose root is 12.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "Qo'shish gipotenuzani topish uchun. Katet uchun kvadratlar ayiriladi.",
      'Сложение нужно для гипотенузы. Для катета квадраты вычитаются.',
      'Adding is for the hypotenuse. For a leg the squares subtract.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "8 bu 13 − 5. Tomonlarning o'zi ayirilmaydi: kvadratlar ayiriladi, keyin ildiz olinadi.",
      '8 это 13 − 5. Вычитаются не сами стороны, а квадраты, потом берётся корень.',
      '8 is 13 − 5. It is the squares that subtract, then a root is taken.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Ikki bo'lak kerak: hisoblash va natija.",
      'Нужны две части: вычисление и результат.',
      'Two parts are needed: the working and the result.') },
  ],
  wrongText: L(
    "13² va 5² nechchi? Ularning ayirmasidan ildiz oling.",
    'Чему равны 13² и 5²? Извлеки корень из их разности.',
    'What are 13² and 5²? Take the root of their difference.'),
};

export default function D47_07(props) { return <BuildLine data={DATA} {...props} />; }
