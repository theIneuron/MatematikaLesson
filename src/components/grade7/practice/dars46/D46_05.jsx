// Dars46 · Amaliyot 05 — Tengsizlikni yozish · 🟡 · bracket · tag: ineq_bracket
// Mexanika: kit.jsx -> BuildLine (qavs kartalari). Raskladka: 5-o'rin.
// Uchburchak tengsizligi: a + b > c.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'ineq_bracket', level: '🟡',
  eyebrow: L('Tengsizlikni yozish', 'Записать неравенство', 'Write the inequality'),
  setup: L(
    "Uchburchak tengsizligini harflar bilan yozish kerak: ikki tomon yig'indisi uchinchisi bilan solishtiriladi.",
    'Неравенство треугольника надо записать буквами: сумма двух сторон сравнивается с третьей.',
    'Write the triangle inequality with letters: the sum of two sides against the third.'),
  cards: [
    { id: 'a', label: 'a + b' },
    { id: 'b', label: '> c' },
    { id: 'c', label: '< c' },
    { id: 'd', label: 'a − b' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Tengsizlikni tuzing", 'Составь неравенство', 'Build the inequality'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. a + b > c: ikki tomon yig'indisi uchinchisidan katta bo'lishi kerak.",
    'Верно. a + b > c: сумма двух сторон должна быть больше третьей.',
    'Correct. a + b > c: two sides must exceed the third.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "Kichik bo'lsa uchburchak yopilmaydi: tomonlar tutashmaydi.",
      'Если меньше, треугольник не замкнётся: стороны не сойдутся.',
      'If it is less, the triangle cannot close: the sides never meet.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "Ayirma emas, YIG'INDI: ikki tomon birga uchinchisidan uzun bo'lishi kerak.",
      'Не разность, а СУММА: две стороны вместе должны быть длиннее третьей.',
      'Not a difference but a SUM: two sides together must be longer than the third.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Tengsizlik ikki bo'lakdan iborat.",
      'Неравенство состоит из двух частей.',
      'The inequality has two parts.') },
  ],
  wrongText: L(
    "Ikki tomon yig'indisi uchinchisidan katta bo'lishi kerakmi yoki kichik?",
    'Сумма двух сторон должна быть больше третьей или меньше?',
    'Must the sum of two sides be more than the third, or less?'),
};

export default function D46_05(props) { return <BuildLine data={DATA} {...props} />; }
