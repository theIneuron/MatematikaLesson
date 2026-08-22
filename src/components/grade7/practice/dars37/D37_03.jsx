// Dars37 · Amaliyot 03 — Uch qadam · 🟢 · order · tag: prop_order
// Mexanika: kit.jsx -> BuildLine. Raskladka: 3-o'rin `order`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): manfiy va kasr koeffitsiyent,
// ikki qadamli savol, yaqin tuzoq -- PODXOD_7SINF.md 13-band.
// (6; −42): k = y : x -> k = −42 : 6 -> k = −7, formula y = −7x.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'prop_order',
  level: '🟢',
  eyebrow: L(
    'Uch qadam',
    'Три шага',
    'Three steps'),
  setup: L(
    'Formulani uch qadamda tuzing: qoida, hisob, natija.',
    'Составь формулу в три шага: правило, вычисление, результат.',
    'Build the formula in three steps: rule, computation, result.'),
  given: [['(6; −42)']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [
    { id: 'a', label: 'k = y : x' },
    { id: 'b', label: 'k = −42 : 6' },
    { id: 'c', label: 'y = −7x' },
    { id: 'd', label: 'k = x : y' },
    { id: 'e', label: 'y = 7x' },
  ],
  answerSeq: ['a', 'b', 'c'],
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
    "To'g'ri. −42 : 6 = −7, ya'ni y = −7x.",
    'Верно. −42 : 6 = −7, значит y = −7x.',
    'Correct. −42 : 6 = −7, so y = −7x.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        'k = x : y teskari yozuv. Proporsionallikda k = y : x.',
        'k = x : y это обратная запись. В пропорциональности k = y : x.',
        'k = x : y is upside down. Proportion uses k = y : x.'),
    },
    {
      when: (s) => s.seq.indexOf('e') !== -1,
      text: L(
        "Ishora yo'qolgan: ordinata manfiy, ya'ni k = −7.",
        'Потерян знак: ордината отрицательная, значит k = −7.',
        'The sign is lost: the ordinate is negative, so k = −7.'),
    },
    {
      when: (s) => s.seq.length < 3,
      text: L(
        'Uch karta kerak.',
        'Нужны три карточки.',
        'Three cards are needed.'),
    },
  ],
  wrongText: L(
    "Avval qoidani yozing, keyin sonlarni qo'ying.",
    'Сначала запиши правило, потом подставь числа.',
    'Write the rule first, then the numbers.'),
};

export default function D37_03(props) { return <BuildLine data={DATA} {...props} />; }
