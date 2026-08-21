// Dars41 · Amaliyot 10 — Ikki qadamli zanjir · 🔴 · chain · tag: ang_chain
// Mexanika: kit.jsx -> SlotsBank (ikki qator). Raskladka: 10-o'rin.
// 1-qator: 118° ning qo'shnisi 62°. 2-qator: 62° ning yarmi 31°.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'ang_chain', level: '🔴',
  eyebrow: L('Zanjir', 'Цепочка', 'A chain'),
  setup: L(
    "Avval qo'shni burchak topiladi, keyin uning bissektrisasi. Ikkinchi qadam birinchisining natijasi bilan ishlaydi.",
    'Сначала находится смежный угол, потом его биссектриса. Второй шаг работает с результатом первого.',
    'First the adjacent angle, then its bisector. The second step uses the first result.'),
  rows: [
    [{ t: ['118°', "qo'shnisi", '='] }, { slot: 0 }],
    [{ t: ['uning', 'yarmi', '='] }, { slot: 1 }],
  ],
  cards: ['62°', '31°', '59°', '124°'],
  answer: ['62°', '31°'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 180 − 118 = 62, keyin 62 : 2 = 31.",
    'Верно. 180 − 118 = 62, потом 62 : 2 = 31.',
    'Correct. 180 − 118 = 62, then 62 : 2 = 31.'),
  wrongs: [
    { when: (s) => s.slots[1] === '59°', text: L(
      "59 bu 118 : 2. Bissektrisa QO'SHNI burchakka qo'yilgan, ya'ni 62 ni ikkiga bo'lish kerak.",
      '59 это 118 : 2. Биссектриса проведена в СМЕЖНОМ угле, значит делить надо 62.',
      '59 is 118 : 2. The bisector belongs to the ADJACENT angle, so halve 62.') },
    { when: (s) => s.slots[0] === '124°', text: L(
      "124 emas: qo'shni burchak 180 dan ayirish bilan topiladi, 180 − 118 = 62.",
      'Не 124: смежный угол находится вычитанием из 180, 180 − 118 = 62.',
      'Not 124: the adjacent angle is 180 − 118 = 62.') },
  ],
  wrongText: L(
    "Birinchi qatorda 180 dan ayiring, keyin natijani ikkiga bo'ling.",
    'В первой строке вычти из 180, потом раздели результат на два.',
    'Subtract from 180 in the first row, then halve the result.'),
};

export default function D41_10(props) { return <SlotsBank data={DATA} {...props} />; }
