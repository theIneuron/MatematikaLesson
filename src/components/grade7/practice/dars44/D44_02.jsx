// Dars44 · Amaliyot 02 — Tenglikni yozish · 🟢 · bracket · tag: sum_bracket
// Mexanika: kit.jsx -> BuildLine. Raskladka: 2-o'rin `bracket`.
// Uch burchakni qo'shib 180 ga tenglashtirish: burchak A + burchak B + burchak C = 180°.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'sum_bracket',
  level: '🟢',
  eyebrow: L(
    'Tenglikni yozish',
    'Записать равенство',
    'Write the equality'),
  setup: L(
    "Uchburchakning uch burchagi qo'shiladi va 180 ga tenglashtiriladi.",
    'Три угла треугольника складываются и приравниваются к 180.',
    'The three angles of a triangle add up and equal 180.'),
  cards: [
    { id: 'a', label: 'A + B + C' },
    { id: 'b', label: '= 180°' },
    { id: 'c', label: '= 360°' },
    { id: 'd', label: 'A + B' },
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
    "To'g'ri. A + B + C = 180 gradus -- bu uchburchakning asosiy tengligi.",
    'Верно. A + B + C = 180 градусов — это главное равенство треугольника.',
    'Correct. A + B + C = 180 degrees is the key equality of a triangle.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        "360° to'liq aylana. Uchburchakda 180.",
        '360° это полный круг. В треугольнике 180.',
        '360° is a full circle. A triangle gives 180.'),
    },
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        'Ikki burchak yetmaydi: tenglikda uch burchak ham qatnashadi.',
        'Двух углов мало: в равенстве участвуют все три.',
        'Two angles are not enough: all three take part.'),
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
    "Nechta burchak bor? Hammasini qo'shing.",
    'Сколько углов? Сложи все.',
    'How many angles are there? Add them all.'),
};

export default function D44_02(props) { return <BuildLine data={DATA} {...props} />; }
