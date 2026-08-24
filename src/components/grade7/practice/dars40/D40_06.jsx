// Dars40 · Amaliyot 06 — Bissektrisa va qo'shni · 🟡 · build · tag: ang_bisector
// Mexanika: kit.jsx -> BuildLine. Raskladka: 6-o'rin `build`.
// AOB = 124° -> bissektrisa 62° -> uning qo'shnisi 180 − 62 = 118°.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'ang_bisector',
  level: '🟡',
  eyebrow: L(
    'Bissektrisa',
    'Биссектриса',
    'The bisector'),
  setup: L(
    "Bissektrisa burchakni ikki teng bo'lakka bo'ladi. Ikki qiymat so'raladi: bissektrisa bergan burchak va uning qo'shnisi.",
    'Биссектриса делит угол на две равные части. Спрашивают два значения: угол от биссектрисы и его смежный.',
    'A bisector splits the angle in half. Two values are asked: the half-angle and its adjacent angle.'),
  given: [['124°']],
  givenLabel: L(
    'Burchak AOB:',
    'Угол AOB:',
    'Angle AOB:'),
  cards: [
    { id: 'a', label: '62°' },
    { id: 'b', label: '118°' },
    { id: 'c', label: '56°' },
    { id: 'd', label: '28°' },
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
    "To'g'ri. 124 : 2 = 62, keyin 180 − 62 = 118.",
    'Верно. 124 : 2 = 62, затем 180 − 62 = 118.',
    'Correct. 124 : 2 = 62, then 180 − 62 = 118.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        "56° bu 180 − 124, ya'ni butun burchakning qo'shnisi. Bissektrisadan keyin 62 bilan ishlanadi.",
        '56° это 180 − 124, смежный целого угла. После биссектрисы работаем с 62.',
        '56° is 180 − 124, adjacent to the whole angle. After the bisector we work with 62.'),
    },
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        "28° chiqishi uchun 56 ikkiga bo'lingan. Bissektrisa berilgan burchakni bo'ladi: 124 : 2.",
        'Чтобы вышло 28, делили 56. Биссектриса делит данный угол: 124 : 2.',
        '28° halves 56. The bisector halves the given angle: 124 : 2.'),
    },
    {
      when: (s) => s.seq.length < 2,
      text: L(
        "Ikki karta kerak: bissektrisa bergan burchak va uning qo'shnisi.",
        'Нужны две карточки: угол от биссектрисы и его смежный.',
        'Two cards are needed: the half-angle and its adjacent angle.'),
    },
  ],
  wrongText: L(
    "Avval 124 ni ikkiga bo'ling, keyin chiqqan burchakni 180 dan ayiring.",
    'Сначала раздели 124 на два, потом вычти полученный угол из 180.',
    'Halve 124 first, then subtract that angle from 180.'),
};

export default function D40_06(props) { return <BuildLine data={DATA} {...props} />; }
