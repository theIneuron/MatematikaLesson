// Dars44 · Amaliyot 10 — Nisbat bilan · 🔴 · build · tag: sum_ratio
// Mexanika: kit.jsx -> BuildLine. Raskladka: 10-o'rin `build`.
// Burchaklar 1 : 2 : 3 -> x + 2x + 3x = 180 -> x = 30 -> 30°, 60°, 90°: to'g'ri burchakli.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'sum_ratio',
  level: '🔴',
  eyebrow: L(
    'Nisbat bilan',
    'По отношению',
    'By ratio'),
  setup: L(
    'Burchaklar 1 : 2 : 3 nisbatda. Ikki javob kerak: burchaklar va uchburchakning turi.',
    'Углы в отношении 1 : 2 : 3. Нужны два ответа: углы и вид треугольника.',
    'The angles are in ratio 1 : 2 : 3. Two answers: the angles and the kind of triangle.'),
  given: [['1 : 2 : 3']],
  givenLabel: L(
    'Nisbat:',
    'Отношение:',
    'Ratio:'),
  cards: [
    { id: 'a', label: '30°, 60°, 90°' },
    { id: 'b', label: "to'g'ri burchakli" },
    { id: 'c', label: '20°, 40°, 60°' },
    { id: 'd', label: "o'tkir burchakli" },
  ],
  answerSeq: ['a', 'b'],
  fieldH: 52,
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
    "To'g'ri. x + 2x + 3x = 180, ya'ni 6x = 180 va x = 30. Burchaklar 30, 60, 90 -- uchburchak to'g'ri burchakli.",
    'Верно. x + 2x + 3x = 180, значит 6x = 180 и x = 30. Углы 30, 60, 90 — треугольник прямоугольный.',
    'Correct. x + 2x + 3x = 180 gives 6x = 180 and x = 30. The angles 30, 60, 90 make it right-angled.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        "20 + 40 + 60 = 120, 180 emas. Bo'laklar soni 1 + 2 + 3 = 6, ya'ni 180 : 6 = 30.",
        '20 + 40 + 60 = 120, а не 180. Частей 1 + 2 + 3 = 6, значит 180 : 6 = 30.',
        '20 + 40 + 60 = 120, not 180. There are 1 + 2 + 3 = 6 parts, so 180 : 6 = 30.'),
    },
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        "90 gradusli burchak bor, ya'ni uchburchak to'g'ri burchakli, o'tkir emas.",
        'Есть угол 90 градусов, значит треугольник прямоугольный, а не остроугольный.',
        'A 90 degree angle is present, so it is right-angled, not acute.'),
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
    "Bo'laklarni qo'shing: 1 + 2 + 3. 180 ni shu songa bo'ling.",
    'Сложи части: 1 + 2 + 3. Раздели 180 на это число.',
    'Add the parts: 1 + 2 + 3, then divide 180 by it.'),
};

export default function D44_10(props) { return <BuildLine data={DATA} {...props} />; }
