// Dars46 · Amaliyot 05 — Tengsizlikni yozish · 🟡 · bracket · tag: ineq_bracket
// Mexanika: kit.jsx -> BuildLine. Raskladka: 5-o'rin `bracket`.
// Uchburchak tengsizligi: a + b > c. Tuzoq: a + b = c va a + b < c.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'ineq_bracket',
  level: '🟡',
  eyebrow: L(
    'Tengsizlikni yozish',
    'Записать неравенство',
    'Write the inequality'),
  setup: L(
    'Uchburchak tengsizligini yozing: a va b -- kichik tomonlar, c -- eng katta tomon.',
    'Запиши неравенство треугольника: a и b меньшие стороны, c наибольшая.',
    'Write the triangle inequality: a and b are the shorter sides, c the longest.'),
  cards: [
    { id: 'a', label: 'a + b' },
    { id: 'b', label: '> c' },
    { id: 'c', label: '= c' },
    { id: 'd', label: '< c' },
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
    "To'g'ri. a + b > c: yig'indi qat'iy katta bo'lishi kerak.",
    'Верно. a + b > c: сумма должна быть строго больше.',
    'Correct. a + b > c: the sum must be strictly greater.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        'Tenglik holatida tomonlar bir chiziqqa tushadi, uchburchak chiqmaydi.',
        'При равенстве стороны ложатся на одну прямую, треугольника нет.',
        'With equality the sides fall in a line and no triangle forms.'),
    },
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        "Yig'indi kichik bo'lsa tomonlar tutashmaydi.",
        'Если сумма меньше, стороны не смыкаются.',
        'If the sum is smaller the sides never meet.'),
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
    "Ikki qisqa tomon uchinchisidan uzun bo'lishi kerak. Qanday belgi?",
    'Две короткие стороны должны быть длиннее третьей. Какой знак?',
    'The two short sides must exceed the third. Which sign?'),
};

export default function D46_05(props) { return <BuildLine data={DATA} {...props} />; }
