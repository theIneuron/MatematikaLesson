// Dars44 · Amaliyot 06 — Teng yonli va yig'indi · 🟡 · build · tag: sum_iso
// Mexanika: kit.jsx -> BuildLine. Raskladka: 6-o'rin `build`.
// Uchidagi burchak 100° -> asosdagi burchaklar (180 − 100) : 2 = 40°.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'sum_iso',
  level: '🟡',
  eyebrow: L(
    'Teng yonli',
    'Равнобедренный',
    'Isosceles'),
  setup: L(
    'Teng yonli uchburchakda asosdagi burchaklar teng. Uchidagi burchak berilgan, asosdagi burchakni toping.',
    'В равнобедренном углы при основании равны. Дан угол при вершине, найди угол при основании.',
    'The base angles are equal. The apex angle is given; find a base angle.'),
  given: [['uchidagi burchak = 100°']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [{ id: 'a', label: '40°' }, { id: 'b', label: '80°' }, { id: 'c', label: '50°' }],
  answerSeq: ['a'],
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
    "To'g'ri. 180 − 100 = 80, bu ikki teng burchakka bo'linadi: 80 : 2 = 40.",
    'Верно. 180 − 100 = 80, это делится на два равных угла: 80 : 2 = 40.',
    'Correct. 180 − 100 = 80, split between two equal angles: 80 : 2 = 40.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('b') !== -1,
      text: L(
        "80 bu IKKI burchakning yig'indisi. Ular teng, ya'ni bittasi 40.",
        '80 это сумма ДВУХ углов. Они равны, значит один 40.',
        '80 is the sum of BOTH angles. They are equal, so one is 40.'),
    },
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        "50 chiqishi uchun 100 ikkiga bo'lingan. Avval 180 dan ayirish kerak.",
        'Чтобы вышло 50, делили 100. Сначала надо вычесть из 180.',
        '50 halves 100. The subtraction from 180 comes first.'),
    },
    {
      when: (s) => s.seq.length < 1,
      text: L(
        'Bitta karta kerak.',
        'Нужна одна карточка.',
        'One card is needed.'),
    },
  ],
  wrongText: L(
    "180 dan uchidagi burchakni ayiring, qolganini ikkiga bo'ling.",
    'Вычти из 180 угол при вершине, остаток раздели на два.',
    'Subtract the apex angle from 180 and halve the rest.'),
};

export default function D44_06(props) { return <BuildLine data={DATA} {...props} />; }
