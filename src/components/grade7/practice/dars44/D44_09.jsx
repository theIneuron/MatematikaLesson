// Dars44 · Amaliyot 09 — Tashqi burchak · 🔴 · bracket · tag: sum_exterior
// Mexanika: kit.jsx -> BuildLine. Raskladka: 9-o'rin `bracket`.
// Tashqi burchak qolgan ikki ichki burchakning yig'indisiga teng: tashqi = A + B.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'sum_exterior',
  level: '🔴',
  eyebrow: L(
    'Tashqi burchak',
    'Внешний угол',
    'The exterior angle'),
  setup: L(
    "Uchburchakning tashqi burchagi -- ichki burchakning qo'shnisi. U qolgan IKKI ichki burchakning yig'indisiga teng bo'ladi.",
    'Внешний угол треугольника это смежный с внутренним. Он равен сумме ДВУХ остальных внутренних углов.',
    "A triangle's exterior angle is adjacent to an interior one. It equals the sum of the OTHER TWO interior angles."),
  cards: [
    { id: 'a', label: L('tashqi burchak', 'внешний угол', 'exterior angle') },
    { id: 'b', label: '= A + B' },
    { id: 'c', label: '= A + B + C' },
    { id: 'd', label: '= 180° − A' },
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
    "To'g'ri. Tashqi burchak C ning qo'shnisi: 180 − C. Lekin A + B ham 180 − C ga teng, ya'ni tashqi burchak A + B.",
    'Верно. Внешний угол смежен с C: 180 − C. Но A + B тоже равно 180 − C, значит внешний угол равен A + B.',
    'Correct. The exterior angle is 180 − C, and A + B equals 180 − C too, so it equals A + B.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        "A + B + C = 180 -- bu butun yig'indi, tashqi burchak emas.",
        'A + B + C = 180 это вся сумма, а не внешний угол.',
        'A + B + C = 180 is the whole sum, not the exterior angle.'),
    },
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        '180 − A bu A burchakning tashqi burchagi. Bizga C ning tashqi burchagi kerak.',
        '180 − A это внешний угол при A. А нам нужен внешний угол при C.',
        '180 − A is the exterior angle at A. We need the one at C.'),
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
    'Tashqi burchak 180 − C. Uchburchakda A + B ham 180 − C ga teng.',
    'Внешний угол равен 180 − C. В треугольнике A + B тоже равно 180 − C.',
    'The exterior angle is 180 − C, and A + B equals 180 − C as well.'),
};

export default function D44_09(props) { return <BuildLine data={DATA} {...props} />; }
