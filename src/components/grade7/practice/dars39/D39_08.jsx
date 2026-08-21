// Dars39 · Amaliyot 08 — Takrorsiz tanlash · 🔴 · bracket · tag: comb_no_repeat
// Mexanika: kit.jsx -> BuildLine (qavs kartalari). Raskladka: 8-o'rin.
// 4 kishidan uchtasini navbat bilan tanlash: 4 · 3 · 2 = 24.
// Har qadamda variant BITTAGA kamayadi.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'comb_no_repeat', level: '🔴',
  eyebrow: L('Takrorsiz', 'Без повторов', 'No repeats'),
  setup: L(
    "Bir odam ikki o'rinni egallay olmaydi, ya'ni har qadamda tanlov bittaga kamayadi.",
    'Один человек не может занять два места, значит на каждом шаге выбор уменьшается на один.',
    'One person cannot fill two places, so each step has one fewer choice.'),
  given: [['4', 'kishi,', '3', "o'rin"]],
  givenLabel: L('Masala:', 'Задание:', 'The task:'),
  cards: [
    { id: 'a', label: '4 · 3 · 2' },
    { id: 'b', label: '24' },
    { id: 'c', label: '4 · 4 · 4' },
    { id: 'd', label: '64' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Hisoblab yozing", 'Запиши вычисление', 'Write the working'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Birinchi o'ringa to'rt kishi, ikkinchisiga uchta, uchinchisiga ikkita: 4 · 3 · 2 = 24.",
    'Верно. На первое место четыре человека, на второе три, на третье два: 4 · 3 · 2 = 24.',
    'Correct. Four for the first place, three for the second, two for the third: 4 · 3 · 2 = 24.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1 || s.seq.indexOf('d') !== -1, text: L(
      "4 · 4 · 4 takrorlash mumkin bo'lganda to'g'ri bo'lardi. Bu yerda bir odam ikki o'rinni egallay olmaydi.",
      '4 · 4 · 4 было бы верно, если повтор разрешён. Но один человек не может занять два места.',
      '4 · 4 · 4 would fit if repeats were allowed. Here one person cannot take two places.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Ikki bo'lak kerak: hisoblash va natija.",
      'Нужны две части: вычисление и результат.',
      'Two parts are needed: the working and the result.') },
  ],
  wrongText: L(
    "Birinchi o'rinni egallagandan keyin nechta kishi qoladi?",
    'Сколько человек остаётся после занятия первого места?',
    'How many people remain after the first place is filled?'),
};

export default function D39_08(props) { return <BuildLine data={DATA} {...props} />; }
