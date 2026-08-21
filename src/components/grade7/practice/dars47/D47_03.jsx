// Dars47 · Amaliyot 03 — Formulani yozish · 🟢 · bracket · tag: pyth_formula
// Mexanika: kit.jsx -> BuildLine (qavs kartalari). Raskladka: 3-o'rin.
// c² = a² + b², c -- gipotenuza.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'pyth_formula', level: '🟢',
  eyebrow: L('Formula', 'Формула', 'The formula'),
  setup: L(
    "Formulani yozishda gipotenuza chap tomonda turadi: uning kvadrati katetlar kvadratlarining yig'indisiga teng.",
    'В формуле гипотенуза стоит слева: её квадрат равен сумме квадратов катетов.',
    'In the formula the hypotenuse stands on the left: its square equals the sum of the legs squared.'),
  given: [['c', '--', 'gipotenuza']],
  givenLabel: L('Belgilash:', 'Обозначение:', 'Notation:'),
  cards: [
    { id: 'a', label: 'c²' },
    { id: 'b', label: '= a² + b²' },
    { id: 'c', label: '= a + b' },
    { id: 'd', label: 'a²' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Formulani tuzing", 'Составь формулу', 'Build the formula'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. c² = a² + b²: chap tomonda gipotenuzaning kvadrati.",
    'Верно. c² = a² + b²: слева квадрат гипотенузы.',
    'Correct. c² = a² + b²: the hypotenuse squared on the left.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "Kvadratlar tushib qolgan: c² = a² + b², c = a + b emas.",
      'Пропали квадраты: c² = a² + b², а не c = a + b.',
      'The squares are missing: c² = a² + b², not c = a + b.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "Chap tomonda gipotenuza turishi kerak, katet emas.",
      'Слева должна стоять гипотенуза, а не катет.',
      'The left side takes the hypotenuse, not a leg.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Formula ikki bo'lakdan iborat.",
      'Формула состоит из двух частей.',
      'The formula has two parts.') },
  ],
  wrongText: L(
    "Qaysi tomon eng uzun? Uning kvadrati qaysi tomonda yoziladi?",
    'Какая сторона самая длинная? С какой стороны пишется её квадрат?',
    'Which side is longest? On which side does its square go?'),
};

export default function D47_03(props) { return <BuildLine data={DATA} {...props} />; }
