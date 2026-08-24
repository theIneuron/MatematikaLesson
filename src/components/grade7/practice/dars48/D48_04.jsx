// Dars48 · Amaliyot 04 — Parallel chiziqlar va harf · 🟡 · build · tag: rev_par_letter
// Mexanika: kit.jsx -> BuildLine. Raskladka: 4-o'rin `build`.
// Ichki bir tomonli burchaklar 3x va 2x: 5x = 180 -> x = 36, katta burchak 108°.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'rev_par_letter',
  level: '🟡',
  eyebrow: L(
    'Parallel chiziqlar',
    'Параллельные прямые',
    'Parallel lines'),
  setup: L(
    "Parallel chiziqlarda ichki bir tomonli burchaklar yig'indisi 180. Ikki javob kerak: x va katta burchak.",
    'При параллельных прямых внутренние односторонние углы дают 180. Нужны два ответа: x и больший угол.',
    'With parallel lines the co-interior angles add to 180. Two answers: x and the larger angle.'),
  given: [['3x', 'va', '2x']],
  givenLabel: L(
    'Ichki bir tomonli:',
    'Внутренние односторонние:',
    'Co-interior angles:'),
  cards: [
    { id: 'a', label: 'x = 36' },
    { id: 'b', label: '108°' },
    { id: 'c', label: 'x = 18' },
    { id: 'd', label: '72°' },
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
    "To'g'ri. 3x + 2x = 180, ya'ni 5x = 180 va x = 36. Katta burchak 3 · 36 = 108.",
    'Верно. 3x + 2x = 180, значит 5x = 180 и x = 36. Больший угол 3 · 36 = 108.',
    'Correct. 3x + 2x = 180 gives 5x = 180 and x = 36. The larger angle is 3 · 36 = 108.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        "18 chiqishi uchun 90 beshga bo'lingan. Ichki bir tomonli burchaklar 180 beradi.",
        'Чтобы вышло 18, делили 90 на пять. Внутренние односторонние дают 180.',
        '18 divides 90 by five. Co-interior angles give 180.'),
    },
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        '72 bu 2x -- kichik burchak. Kattasi 3x = 108.',
        '72 это 2x, меньший угол. Больший это 3x = 108.',
        '72 is 2x, the smaller angle. The larger is 3x = 108.'),
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
    "Ikki burchakni qo'shib 180 ga tenglashtiring, keyin 3x ni hisoblang.",
    'Сложи два угла и приравняй к 180, потом посчитай 3x.',
    'Add the two angles to 180, then compute 3x.'),
};

export default function D48_04(props) { return <BuildLine data={DATA} {...props} />; }
