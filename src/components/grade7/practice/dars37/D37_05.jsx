// Dars37 · Amaliyot 05 — Qoidani yozish · 🟡 · bracket · tag: prop_rule
// Mexanika: kit.jsx -> BuildLine. Raskladka: 5-o'rin `bracket`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): manfiy va kasr koeffitsiyent,
// ikki qadamli savol, yaqin tuzoq -- PODXOD_7SINF.md 13-band.
// k = y : x. Tuzoq: k = x : y va k = x · y.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'prop_rule',
  level: '🟡',
  eyebrow: L(
    'Qoidani yozish',
    'Записать правило',
    'Write the rule'),
  setup: L(
    "To'g'ri proporsionallikda koeffitsiyent har nuqta uchun bir xil chiqadi. Uni topish qoidasini yig'ing.",
    'В прямой пропорциональности коэффициент одинаков для каждой точки. Собери правило его нахождения.',
    'In direct proportion the coefficient is the same at every point. Build the rule for finding it.'),
  cards: [
    { id: 'a', label: 'k =' },
    { id: 'b', label: 'y : x' },
    { id: 'c', label: 'x : y' },
    { id: 'd', label: 'x · y' },
  ],
  answerSeq: ['a', 'b'],
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
    "To'g'ri. k = y : x: har nuqtada bir xil son chiqadi.",
    'Верно. k = y : x: в каждой точке выходит одно и то же число.',
    'Correct. k = y : x gives the same number at every point.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        "Bu teskari nisbat. Formulada y = kx, ya'ni k = y : x.",
        'Это обратное отношение. В формуле y = kx, значит k = y : x.',
        'That is the inverse ratio. From y = kx we get k = y : x.'),
    },
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        "Ko'paytma nuqtadan nuqtaga o'zgaradi, ya'ni u koeffitsiyent bo'lolmaydi.",
        'Произведение меняется от точки к точке, значит коэффициентом быть не может.',
        'The product changes point to point, so it cannot be the coefficient.'),
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
    'y = kx dan k ni ajratib oling.',
    'Вырази k из y = kx.',
    'Solve y = kx for k.'),
};

export default function D37_05(props) { return <BuildLine data={DATA} {...props} />; }
