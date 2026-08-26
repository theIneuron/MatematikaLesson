// Dars48 · Amaliyot 02 — Tenglikni yozish · 🟢 · bracket · tag: rev_bracket
// Mexanika: kit.jsx -> BuildLine. Raskladka: 2-o'rin `bracket`.
// Tashqi burchak = A + B (qolgan ikki ichki burchak).
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'rev_bracket',
  level: '🟢',
  eyebrow: L(
    'Tenglikni yozish',
    'Записать равенство',
    'Write the equality'),
  setup: L(
    "Tashqi burchakning xossasini yozing: u qaysi burchaklardan yig'iladi.",
    'Запиши свойство внешнего угла: из каких углов он складывается.',
    'Write the property of the exterior angle: which angles make it.'),
  cards: [
    { id: 'a', label: L('tashqi burchak', 'внешний угол', 'exterior angle') },
    { id: 'b', label: '= A + B' },
    { id: 'c', label: '= A + B + C' },
    { id: 'd', label: '= C' },
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
    "To'g'ri. Tashqi burchak o'ziga qo'shni bo'lmagan ikki ichki burchakning yig'indisiga teng.",
    'Верно. Внешний угол равен сумме двух не смежных с ним внутренних углов.',
    'Correct. The exterior angle equals the sum of the two non-adjacent interior angles.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        "A + B + C = 180 -- butun yig'indi, tashqi burchak emas.",
        'A + B + C = 180 это вся сумма, а не внешний угол.',
        'A + B + C = 180 is the whole sum, not the exterior angle.'),
    },
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        "C tashqi burchakning qo'shnisi: ular birga 180 beradi, teng emas.",
        'C смежный с внешним: вместе они дают 180, а не равны.',
        'C is adjacent to the exterior: together they give 180, they are not equal.'),
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
    'Tashqi burchak 180 − C, va A + B ham 180 − C ga teng.',
    'Внешний угол равен 180 − C, и A + B тоже равно 180 − C.',
    'The exterior angle is 180 − C, and A + B equals 180 − C as well.'),
};

export default function D48_02(props) { return <BuildLine data={DATA} {...props} />; }
