// Dars33 · Amaliyot 06 — Abssissa bo'yicha tartib · 🟡 · order · tag: point_order
// Mexanika: kit.jsx -> BuildLine. Raskladka: 6-o'rin `order`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): sonlar ikki xonali va manfiy,
// qadamlar soni ikkitadan boshlanadi -- PODXOD_7SINF.md 13-band.
// Abssissa o'sish tartibida: −17, −3, 8.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'point_order',
  level: '🟡',
  eyebrow: L(
    'Tartib',
    'Порядок',
    'Order'),
  setup: L(
    "Nuqtalarni abssissa o'sish tartibida qo'ying. Manfiy sonlarda katta modul KICHIK sonni beradi.",
    'Расставь точки по возрастанию абсциссы. У отрицательных чисел больший модуль даёт МЕНЬШЕЕ число.',
    'Order the points by increasing abscissa. Among negatives the larger modulus means the SMALLER number.'),
  cards: [{ id: 'a', label: '(−17; 2)' }, { id: 'b', label: '(−3; 5)' }, { id: 'c', label: '(8; −1)' }],
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
    "To'g'ri. −17 < −3 < 8: manfiy sonlarda modul katta bo'lsa son kichik bo'ladi.",
    'Верно. −17 < −3 < 8: у отрицательных чем больше модуль, тем меньше число.',
    'Correct. −17 < −3 < 8: for negatives a larger modulus means a smaller number.'),
  wrongs: [
    {
      when: (s) => s.seq.length === 3,
      text: L(
        'Tartib boshqa: −17 eng kichik, chunki u noldan eng uzoqda chapda.',
        'Порядок другой: −17 наименьшее, оно дальше всех влево от нуля.',
        'The order differs: −17 is the smallest, farthest to the left of zero.'),
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
    "Abssissalarni sanoq o'qida tasavvur qiling: chapdan o'ngga.",
    'Представь абсциссы на числовой прямой: слева направо.',
    'Picture the abscissas on a number line, left to right.'),
};

export default function D33_06(props) { return <BuildLine data={DATA} {...props} />; }
