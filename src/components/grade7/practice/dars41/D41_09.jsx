// Dars41 · Amaliyot 09 — Yon tomonni topish · 🔴 · order · tag: kind_leg_from_p
// Mexanika: kit.jsx -> BuildLine. Raskladka: 9-o'rin `order`.
// Teng yonli, P = 40, asos 16 -> 40 − 16 = 24 -> 24 : 2 = 12. Uch qadam tartib bilan.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'kind_leg_from_p',
  level: '🔴',
  eyebrow: L(
    'Uch qadam',
    'Три шага',
    'Three steps'),
  setup: L(
    'Teng yonli uchburchakning perimetri va asosi berilgan. Yon tomonni uch qadamda toping: qadamlar tartibi muhim.',
    'Даны периметр и основание равнобедренного треугольника. Найди боковую сторону в три шага: порядок важен.',
    'The perimeter and base of an isosceles triangle are given. Find the leg in three ordered steps.'),
  given: [['P = 40', ',', L('asos 16', 'основание 16', 'base 16')]],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [
    { id: 'a', label: '40 − 16 = 24' },
    { id: 'b', label: '24 : 2 = 12' },
    { id: 'c', label: L('yon tomon 12', 'боковая 12', 'leg 12') },
    { id: 'd', label: '40 : 2 = 20' },
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
    "To'g'ri. Asosni ayirsak ikki yon tomon qoladi: 24. Ular teng, ya'ni har biri 12.",
    'Верно. Вычли основание — остались две боковые: 24. Они равны, значит каждая 12.',
    'Correct. Removing the base leaves the two legs: 24. They are equal, so each is 12.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        '40 : 2 = 20 -- perimetrning yarmi, lekin asos hisobga olinmagan. Avval asosni ayirish kerak.',
        '40 : 2 = 20 это половина периметра, но основание не учли. Сначала вычти основание.',
        '40 : 2 = 20 halves the perimeter without removing the base first.'),
    },
    {
      when: (s) => s.seq.indexOf('e') !== -1,
      text: L(
        '24 bu IKKI yon tomon birga. Bittasi 24 : 2 = 12.',
        '24 это ДВЕ боковые вместе. Одна равна 24 : 2 = 12.',
        '24 is BOTH legs together. One of them is 24 : 2 = 12.'),
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
    "Perimetrdan asosni ayiring, qolganini ikkiga bo'ling.",
    'Вычти из периметра основание, остаток раздели на два.',
    'Subtract the base from the perimeter, then halve the rest.'),
};

export default function D41_09(props) { return <BuildLine data={DATA} {...props} />; }
