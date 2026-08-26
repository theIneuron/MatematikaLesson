// Dars35 · Amaliyot 09 — Ikki nuqtadan formula · 🔴 · order · tag: lin_from_points
// Mexanika: kit.jsx -> BuildLine. Raskladka: 9-o'rin `order`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): k manfiy va kasr bo'ladi,
// savol ikki qadamli -- PODXOD_7SINF.md 13-band.
// (0; −5) va (4; 7): b = −5; k = (7 − (−5)) : 4 = 3, ya'ni y = 3x − 5.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'lin_from_points',
  level: '🔴',
  eyebrow: L(
    'Ikki nuqtadan',
    'По двум точкам',
    'From two points'),
  setup: L(
    "Birinchi nuqtaning abssissasi nol, ya'ni u b ni beradi. k esa qiymat o'zgarishini abssissa o'zgarishiga bo'lib topiladi.",
    'У первой точки абсцисса ноль, значит она даёт b. А k находим, разделив изменение значения на изменение абсциссы.',
    'The first point has zero abscissa, so it gives b. k comes from the change in value over the change in x.'),
  given: [['(0; −5)', L('va', 'и', 'and'), '(4; 7)']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [
    { id: 'a', label: 'b = −5' },
    { id: 'b', label: 'k = 3' },
    { id: 'c', label: 'y = 3x − 5' },
    { id: 'd', label: 'k = 1,75' },
    { id: 'e', label: 'b = 5' },
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
    "To'g'ri. b = −5, keyin 7 − (−5) = 12 va 12 : 4 = 3, ya'ni y = 3x − 5.",
    'Верно. b = −5, потом 7 − (−5) = 12 и 12 : 4 = 3, значит y = 3x − 5.',
    'Correct. b = −5, then 7 − (−5) = 12 and 12 : 4 = 3, so y = 3x − 5.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        "1,75 chiqishi uchun 7 ni 4 ga bo'lgan, lekin b hisobga olinmagan: o'zgarish 7 − (−5) = 12.",
        'Чтобы вышло 1,75, делили 7 на 4, не учтя b: изменение равно 7 − (−5) = 12.',
        '1.75 divides 7 by 4 ignoring b: the change is 7 − (−5) = 12.'),
    },
    {
      when: (s) => s.seq.indexOf('e') !== -1,
      text: L(
        "Ishora yo'qolgan: birinchi nuqtada ordinata −5.",
        'Потерян знак: у первой точки ордината −5.',
        'The sign is lost: the first point has ordinate −5.'),
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
    "x = 0 dagi nuqta b ni beradi. Keyin ordinatalar ayirmasini abssissalar ayirmasiga bo'ling.",
    'Точка при x = 0 даёт b. Потом раздели разность ординат на разность абсцисс.',
    'The point at x = 0 gives b. Then divide the change in y by the change in x.'),
};

export default function D35_09(props) { return <BuildLine data={DATA} {...props} />; }
