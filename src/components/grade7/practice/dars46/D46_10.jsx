// Dars46 · Amaliyot 10 — Eng katta tomon qarshisida · 🔴 · build · tag: side_biggest
// Mexanika: kit.jsx -> BuildLine. Raskladka: 10-o'rin.
// Ikki burchak 40° va 60° -> uchinchisi 80°, ya'ni eng katta tomon
// 80° qarshisida yotadi.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'side_biggest', level: '🔴',
  eyebrow: L('Eng katta tomon', 'Наибольшая сторона', 'The largest side'),
  setup: L(
    "Ikki burchak ma'lum. Uchinchisini topgandan keyin eng katta burchak ko'rinadi -- eng katta tomon uning qarshisida yotadi.",
    'Известны два угла. Найдя третий, увидим наибольший угол — против него и лежит наибольшая сторона.',
    'Two angles are known. Finding the third reveals the largest angle, which faces the largest side.'),
  given: [['40°', 'va', '60°']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  cards: [
    { id: 'a', label: '180° − 100°' },
    { id: 'b', label: '80°' },
    { id: 'c', label: '180° − 60°' },
    { id: 'd', label: '120°' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Uchinchi burchakni hisoblang", 'Посчитай третий угол', 'Work out the third angle'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 40 + 60 = 100, uchinchisi 80°. Eng katta burchak 80°, ya'ni eng katta tomon uning qarshisida.",
    'Верно. 40 + 60 = 100, третий угол 80°. Наибольший угол 80°, значит наибольшая сторона против него.',
    'Correct. 40 + 60 = 100, the third is 80°. That is the largest angle, so it faces the largest side.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1 || s.seq.indexOf('d') !== -1, text: L(
      "Faqat bitta burchak ayirilgan. Ikkovini qo'shib 180 dan ayirish kerak.",
      'Вычли только один угол. Надо сложить оба и вычесть из 180.',
      'Only one angle was subtracted. Add both and subtract from 180.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Ikki bo'lak kerak: hisoblash va natija.",
      'Нужны две части: вычисление и результат.',
      'Two parts are needed: the working and the result.') },
  ],
  wrongText: L(
    "Uchinchi burchakni toping, keyin eng kattasini aniqlang.",
    'Найди третий угол, потом определи наибольший.',
    'Find the third angle, then decide which is largest.'),
};

export default function D46_10(props) { return <BuildLine data={DATA} {...props} />; }
