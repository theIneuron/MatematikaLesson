// Dars46 · Amaliyot 06 — Uch qadam · 🟡 · order · tag: rt_order
// Mexanika: kit.jsx -> BuildLine. Raskladka: 6-o'rin `order`.
// O'tkir burchak 28° -> 28 + x = 90 -> x = 62.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'rt_order',
  level: '🟡',
  eyebrow: L(
    'Uch qadam',
    'Три шага',
    'Three steps'),
  setup: L(
    "To'g'ri burchakli uchburchakda bir o'tkir burchak 28 gradus. Ikkinchisini uch qadamda toping.",
    'В прямоугольном треугольнике один острый угол 28 градусов. Найди второй в три шага.',
    'A right triangle has one acute angle of 28 degrees. Find the other in three steps.'),
  given: [['28°']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [
    { id: 'a', label: '28 + x = 90' },
    { id: 'b', label: 'x = 62' },
    { id: 'c', label: L("o'tkir burchak 62°", 'острый угол 62°', 'acute angle 62°') },
    { id: 'd', label: '28 + x = 180' },
    { id: 'e', label: 'x = 152' },
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
    "To'g'ri. O'tkir burchaklar birga 90 beradi, ya'ni 90 − 28 = 62.",
    'Верно. Острые углы вместе дают 90, значит 90 − 28 = 62.',
    'Correct. The acute angles give 90 together, so 90 − 28 = 62.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('d') !== -1 || s.seq.indexOf('e') !== -1,
      text: L(
        "180 uch burchakning yig'indisi. To'g'ri burchak 90 ni olib qo'ygan, o'tkirlarga 90 qoladi.",
        '180 это сумма трёх углов. Прямой угол забрал 90, острым остаётся 90.',
        '180 is the sum of all three. The right angle takes 90, leaving 90 for the acute ones.'),
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
    "To'g'ri burchakni 180 dan ayiring: o'tkir burchaklarga qancha qoladi?",
    'Вычти прямой угол из 180: сколько остаётся острым?',
    'Subtract the right angle from 180: what is left for the acute ones?'),
};

export default function D46_06(props) { return <BuildLine data={DATA} {...props} />; }
