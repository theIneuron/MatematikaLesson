// Dars46 · Amaliyot 10 — Eng katta tomon qarshisida · 🔴 · build · tag: side_biggest
// Mexanika: kit.jsx -> BuildLine. Raskladka: 10-o'rin `build`.
// Ikki burchak 40° va 60° -> uchinchisi 80°, ya'ni eng katta tomon 80° qarshisida yotadi.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'side_biggest',
  level: '🔴',
  eyebrow: L(
    'Eng katta tomon',
    'Наибольшая сторона',
    'The largest side'),
  setup: L(
    'Ikki burchak berilgan. Uchinchisini toping, keyin eng katta tomon qaysi burchak qarshisida yotganini aytib bering.',
    'Даны два угла. Найди третий и скажи, против какого угла лежит наибольшая сторона.',
    'Two angles are given. Find the third, then say which angle faces the largest side.'),
  given: [['40°', 'va', '60°']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [
    { id: 'a', label: 'uchinchisi 80°' },
    { id: 'b', label: 'eng katta tomon 80° qarshisida' },
    { id: 'c', label: 'uchinchisi 100°' },
    { id: 'd', label: 'eng katta tomon 60° qarshisida' },
  ],
  answerSeq: ['a', 'b'],
  fieldH: 52,
  ask: L(
    "Kartani bosish uni chiziqqa qo'yadi.",
    'Нажатие на карточку ставит её в строку.',
    'Tapping a card puts it in the line.'),
  empty: L(
    'Kartalarni bosib javobni tuzing',
    'Нажимай карточки и собери ответ',
    'Tap the cards to build the answer'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. 180 − 100 = 80, va 80 eng katta burchak: uning qarshisida eng katta tomon.",
    'Верно. 180 − 100 = 80, и 80 наибольший угол: против него наибольшая сторона.',
    'Correct. 180 − 100 = 80, and 80 is the largest angle, so it faces the largest side.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        "100 bu 40 + 60, ya'ni ikki burchakning yig'indisi. Uchinchisi 180 − 100 = 80.",
        '100 это 40 + 60, сумма двух углов. Третий равен 180 − 100 = 80.',
        '100 is 40 + 60, the sum of two angles. The third is 180 − 100 = 80.'),
    },
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        '60 eng katta burchak emas: uchinchisi 80 undan katta.',
        '60 не наибольший угол: третий равен 80 и больше.',
        '60 is not the largest: the third angle 80 exceeds it.'),
    },
    {
      when: (s) => s.seq.length < 2,
      text: L(
        'Ikki karta kerak.',
        'Нужны две карточки.',
        'Two cards are needed.'),
    },
  ],
  wrongText: L(
    'Uchinchi burchakni hisoblang, keyin uch burchakni solishtiring.',
    'Вычисли третий угол, потом сравни все три.',
    'Compute the third angle, then compare all three.'),
};

export default function D46_10(props) { return <BuildLine data={DATA} {...props} />; }
