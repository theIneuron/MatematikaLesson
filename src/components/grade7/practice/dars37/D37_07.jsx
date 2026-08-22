// Dars37 · Amaliyot 07 — Formula va qiymat · 🟡 · build · tag: prop_build
// Mexanika: kit.jsx -> BuildLine. Raskladka: 7-o'rin `build`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): manfiy va kasr koeffitsiyent,
// ikki qadamli savol, yaqin tuzoq -- PODXOD_7SINF.md 13-band.
// (−3; 21): k = 21 : (−3) = −7, y = −7x. x = 5 da y = −35.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'prop_build',
  level: '🟡',
  eyebrow: L(
    'Formula va qiymat',
    'Формула и значение',
    'Formula and value'),
  setup: L(
    "Avval koeffitsiyentni toping, keyin topilgan formulaga yangi x ni qo'ying. Ikki javob kerak.",
    'Сначала найди коэффициент, потом подставь в найденную формулу новый x. Нужны два ответа.',
    'Find the coefficient first, then put a new x into that formula. Two answers.'),
  given: [['(−3; 21)', ';', 'x = 5']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [
    { id: 'a', label: 'k = −7' },
    { id: 'b', label: 'y = −35' },
    { id: 'c', label: 'k = 7' },
    { id: 'd', label: 'y = 35' },
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
    "To'g'ri. 21 : (−3) = −7, keyin −7 · 5 = −35.",
    'Верно. 21 : (−3) = −7, затем −7 · 5 = −35.',
    'Correct. 21 : (−3) = −7, then −7 · 5 = −35.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        "Abssissa manfiy, ya'ni k manfiy chiqadi.",
        'Абсцисса отрицательная, значит k выйдет отрицательным.',
        'The abscissa is negative, so k is negative.'),
    },
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        "k manfiy bo'lgani uchun musbat x da qiymat manfiy chiqadi.",
        'Так как k отрицательный, при положительном x значение отрицательное.',
        'With a negative k a positive x gives a negative value.'),
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
    "Avval k, keyin y = kx ga yangi x ni qo'ying.",
    'Сначала k, потом подставь новый x в y = kx.',
    'First k, then put the new x into y = kx.'),
};

export default function D37_07(props) { return <BuildLine data={DATA} {...props} />; }
