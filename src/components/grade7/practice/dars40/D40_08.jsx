// Dars40 · Amaliyot 08 — Ikki marta o'rta nuqta · 🔴 · order · tag: seg_half_twice
// Mexanika: kit.jsx -> BuildLine. Raskladka: 8-o'rin `order`.
// AB = 48, M -- AB o'rtasi (MB = 24), K -- MB o'rtasi (MK = 12) -> AK = 24 + 12 = 36.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'seg_half_twice',
  level: '🔴',
  eyebrow: L(
    'Uch qadam',
    'Три шага',
    'Three steps'),
  setup: L(
    "M nuqta AB ning o'rtasi, K nuqta esa MB ning o'rtasi. Uch qadamni tartib bilan qo'ying: har qadam keyingisiga kerak.",
    'Точка M середина AB, а K середина MB. Поставь три шага по порядку: каждый нужен следующему.',
    'M is the midpoint of AB and K the midpoint of MB. Place the three steps in order: each feeds the next.'),
  given: [['AB = 48']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [
    { id: 'a', label: 'MB = 24' },
    { id: 'b', label: 'MK = 12' },
    { id: 'c', label: 'AK = 36' },
    { id: 'd', label: 'AK = 24' },
    { id: 'e', label: 'MK = 24' },
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
    "To'g'ri. 48 : 2 = 24, keyin 24 : 2 = 12, va AK = AM + MK = 24 + 12 = 36.",
    'Верно. 48 : 2 = 24, затем 24 : 2 = 12, и AK = AM + MK = 24 + 12 = 36.',
    'Correct. 48 : 2 = 24, then 24 : 2 = 12, and AK = AM + MK = 24 + 12 = 36.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        "AK = 24 bu AM ning o'zi. K nuqta M dan o'ngda, ya'ni AK dan MK ham qo'shiladi.",
        'AK = 24 это сам AM. Точка K правее M, значит к AK добавляется ещё MK.',
        'AK = 24 is AM itself. K lies right of M, so MK is added on top.'),
    },
    {
      when: (s) => s.seq.indexOf('e') !== -1,
      text: L(
        "MK = 24 bu MB. K MB ning o'rtasi, ya'ni MK = 24 : 2 = 12.",
        'MK = 24 это MB. K середина MB, значит MK = 24 : 2 = 12.',
        'MK = 24 is MB. K is the midpoint of MB, so MK = 24 : 2 = 12.'),
    },
    {
      when: (s) => s.seq.length < 3,
      text: L(
        'Uch qadam kerak: MB, keyin MK, keyin AK.',
        'Нужны три шага: MB, затем MK, затем AK.',
        'Three steps are needed: MB, then MK, then AK.'),
    },
  ],
  wrongText: L(
    "Ikki marta ikkiga bo'ling, keyin AM va MK ni qo'shing.",
    'Дважды раздели на два, потом сложи AM и MK.',
    'Halve twice, then add AM and MK.'),
};

export default function D40_08(props) { return <BuildLine data={DATA} {...props} />; }
