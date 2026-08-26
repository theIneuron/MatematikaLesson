// Dars43 · Amaliyot 07 — Yon tomonni topish · 🟡 · order · tag: iso_leg_order
// Mexanika: kit.jsx -> BuildLine. Raskladka: 7-o'rin `order`.
// P = 38, asos 14 -> 38 − 14 = 24 -> 24 : 2 = 12.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'iso_leg_order',
  level: '🟡',
  eyebrow: L(
    'Uch qadam',
    'Три шага',
    'Three steps'),
  setup: L(
    'Perimetr va asos berilgan. Yon tomonni uch qadamda toping.',
    'Даны периметр и основание. Найди боковую сторону в три шага.',
    'The perimeter and base are given. Find the leg in three steps.'),
  given: [['P = 38', ',', L('asos 14', 'основание 14', 'base 14')]],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [
    { id: 'a', label: '38 − 14 = 24' },
    { id: 'b', label: '24 : 2 = 12' },
    { id: 'c', label: L('yon tomon 12', 'боковая 12', 'leg 12') },
    { id: 'd', label: '38 : 2 = 19' },
    { id: 'e', label: L('yon tomon 24', 'боковая 24', 'leg 24') },
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
    "To'g'ri. Asosni ayirgach ikki yon tomon qoladi: 24, ya'ni bittasi 12.",
    'Верно. После вычитания основания остались две боковые: 24, значит одна 12.',
    'Correct. Removing the base leaves both legs: 24, so one is 12.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        '38 : 2 = 19 -- asos hisobga olinmagan. Avval uni ayirish kerak.',
        '38 : 2 = 19 не учитывает основание. Сначала его надо вычесть.',
        '38 : 2 = 19 ignores the base. Subtract it first.'),
    },
    {
      when: (s) => s.seq.indexOf('e') !== -1,
      text: L(
        '24 -- ikki yon tomon birga.',
        '24 это две боковые вместе.',
        '24 is both legs together.'),
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
    "Perimetrdan asosni ayiring, keyin ikkiga bo'ling.",
    'Вычти из периметра основание, потом раздели на два.',
    'Subtract the base from the perimeter, then halve.'),
};

export default function D43_07(props) { return <BuildLine data={DATA} {...props} />; }
