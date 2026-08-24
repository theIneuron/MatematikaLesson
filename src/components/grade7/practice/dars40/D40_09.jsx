// Dars40 · Amaliyot 09 — Nisbat bilan · 🔴 · build · tag: ang_ratio
// Mexanika: kit.jsx -> BuildLine. Raskladka: 9-o'rin `build`.
// Qo'shni burchaklar 4 : 5 nisbatda: 4x + 5x = 180 -> x = 20 -> 80° va 100°.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'ang_ratio',
  level: '🔴',
  eyebrow: L(
    'Nisbat bilan',
    'По отношению',
    'By ratio'),
  setup: L(
    "Qo'shni burchaklar 4 : 5 nisbatda. Nisbat bo'laklarni beradi: 4x va 5x, ularning yig'indisi esa 180 gradus.",
    'Смежные углы в отношении 4 : 5. Отношение задаёт части: 4x и 5x, а их сумма 180 градусов.',
    'The adjacent angles are in ratio 4 : 5. The ratio gives parts 4x and 5x whose sum is 180 degrees.'),
  given: [['4 : 5']],
  givenLabel: L(
    'Nisbat:',
    'Отношение:',
    'Ratio:'),
  cards: [
    { id: 'a', label: '80°' },
    { id: 'b', label: '100°' },
    { id: 'c', label: '72°' },
    { id: 'd', label: '90°' },
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
    "To'g'ri. 4x + 5x = 180, ya'ni 9x = 180 va x = 20. Burchaklar 80 va 100 gradus.",
    'Верно. 4x + 5x = 180, значит 9x = 180 и x = 20. Углы 80 и 100 градусов.',
    'Correct. 4x + 5x = 180, so 9x = 180 and x = 20. The angles are 80 and 100 degrees.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        "72° chiqishi uchun 360 ga bo'lingan. Qo'shni burchaklar yig'indisi 180.",
        'Чтобы вышло 72, делили 360. Сумма смежных углов 180.',
        '72° comes from dividing 360. Adjacent angles add to 180.'),
    },
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        "90° teng bo'linishni beradi, lekin nisbat 4 : 5 -- burchaklar teng emas.",
        '90° это равное деление, но отношение 4 : 5 значит углы не равны.',
        '90° means an equal split, yet the ratio 4 : 5 says the angles differ.'),
    },
    {
      when: (s) => s.seq.length < 2,
      text: L(
        "Ikki burchak so'raladi: kichigi va kattasi.",
        'Спрашивают два угла: меньший и больший.',
        'Two angles are asked: the smaller and the larger.'),
    },
  ],
  wrongText: L(
    "Bo'laklar sonini qo'shing: 4 + 5 = 9. 180 ni 9 ga bo'lib, bir bo'lakni toping.",
    'Сложи части: 4 + 5 = 9. Раздели 180 на 9 и найди одну часть.',
    'Add the parts: 4 + 5 = 9. Divide 180 by 9 to get one part.'),
};

export default function D40_09(props) { return <BuildLine data={DATA} {...props} />; }
