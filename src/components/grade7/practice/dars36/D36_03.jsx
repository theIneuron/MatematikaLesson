// Dars36 · Amaliyot 03 — Nuqta grafikda yotadimi · 🟢 · build · tag: point_on_line
// Mexanika: kit.jsx -> BuildLine. Raskladka: 3-o'rin `build`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): k manfiy va kasr bo'ladi,
// savol ikki qadamli -- PODXOD_7SINF.md 13-band.
// y = −3x + 5, nuqta (−4; 17): −3 · (−4) + 5 = 12 + 5 = 17 -> yotadi.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'point_on_line',
  level: '🟢',
  eyebrow: L(
    'Nuqta grafikda',
    'Точка на графике',
    'A point on the graph'),
  setup: L(
    'Nuqta grafikda yotishi uchun uning koordinatalari formulani BAJARISHI kerak. Manfiy abssissaga diqqat.',
    'Чтобы точка лежала на графике, её координаты должны УДОВЛЕТВОРЯТЬ формуле. Внимание к отрицательной абсциссе.',
    'For a point to lie on the graph its coordinates must SATISFY the formula. Mind the negative abscissa.'),
  given: [['y = −3x + 5', ',', '(−4; 17)']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [
    { id: 'a', label: 'yotadi' },
    { id: 'b', label: 'yotmaydi' },
    { id: 'c', label: 'aniqlanmaydi' },
  ],
  answerSeq: ['a'],
  fieldH: 44,
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
    "To'g'ri. −3 · (−4) = 12, 12 + 5 = 17 -- ordinata bilan mos keldi.",
    'Верно. −3 · (−4) = 12, 12 + 5 = 17 — совпало с ординатой.',
    'Correct. −3 · (−4) = 12 and 12 + 5 = 17, matching the ordinate.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('b') !== -1,
      text: L(
        "Hisoblab ko'ring: −3 ni (−4) ga ko'paytirsak +12, keyin +5 bilan 17.",
        'Посчитай: −3 умножить на (−4) даёт +12, плюс 5 будет 17.',
        'Compute it: −3 times (−4) is +12, plus 5 gives 17.'),
    },
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        "Tekshirish mumkin: koordinatalarni formulaga qo'yish yetarli.",
        'Проверить можно: достаточно подставить координаты в формулу.',
        'It can be checked: just substitute the coordinates.'),
    },
    {
      when: (s) => s.seq.length < 1,
      text: L(
        'Bitta karta kerak.',
        'Нужна одна карточка.',
        'One card is needed.'),
    },
  ],
  wrongText: L(
    "Abssissani formulaga qo'ying va chiqqan sonni ordinata bilan solishtiring.",
    'Подставь абсциссу в формулу и сравни результат с ординатой.',
    'Put the abscissa into the formula and compare with the ordinate.'),
};

export default function D36_03(props) { return <BuildLine data={DATA} {...props} />; }
