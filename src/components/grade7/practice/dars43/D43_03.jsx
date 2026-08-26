// Dars43 · Amaliyot 03 — Yon tomon va perimetr · 🟢 · build · tag: iso_side_p
// Mexanika: kit.jsx -> BuildLine. Raskladka: 3-o'rin `build`.
// Yon tomon 9 -> ikkinchi yon tomon ham 9; asos 4 -> P = 9 + 9 + 4 = 22.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'iso_side_p',
  level: '🟢',
  eyebrow: L(
    'Yon tomon va perimetr',
    'Боковая и периметр',
    'Leg and perimeter'),
  setup: L(
    'Yon tomonlar teng. Ikki javob kerak: ikkinchi yon tomon va perimetr.',
    'Боковые стороны равны. Нужны два ответа: вторая боковая и периметр.',
    'The legs are equal. Two answers: the second leg and the perimeter.'),
  given: [[L('yon tomon 9', 'боковая 9', 'leg 9'), ',', L('asos 4', 'основание 4', 'base 4')]],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [
    { id: 'a', label: L('yon tomon 9', 'боковая 9', 'leg 9') },
    { id: 'b', label: 'P = 22' },
    { id: 'c', label: 'P = 13' },
    { id: 'd', label: L('yon tomon 4', 'боковая 4', 'leg 4') },
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
    "To'g'ri. Ikkinchi yon tomon ham 9, va 9 + 9 + 4 = 22.",
    'Верно. Вторая боковая тоже 9, и 9 + 9 + 4 = 22.',
    'Correct. The second leg is 9 as well, and 9 + 9 + 4 = 22.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        "13 bu 9 + 4, ya'ni bitta yon tomon hisobga olinmagan. Yon tomon IKKITA.",
        '13 это 9 + 4: одну боковую не учли. Боковых ДВЕ.',
        '13 is 9 + 4, leaving out one leg. There are TWO legs.'),
    },
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        '4 bu asos. Yon tomonlar bir-biriga teng: 9.',
        '4 это основание. Боковые равны между собой: 9.',
        '4 is the base. The legs equal each other: 9.'),
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
    "Ikki yon tomon va bitta asosni qo'shing.",
    'Сложи две боковые и одно основание.',
    'Add the two legs and the single base.'),
};

export default function D43_03(props) { return <BuildLine data={DATA} {...props} />; }
