// Dars48 · Amaliyot 02 — Formulani yozish · 🟢 · bracket · tag: area_formula
// Mexanika: kit.jsx -> BuildLine (qavs kartalari). Raskladka: 2-o'rin.
// Uchburchak yuzasi: S = a · h : 2.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'area_formula', level: '🟢',
  eyebrow: L('Uchburchak yuzasi', 'Площадь треугольника', 'Area of a triangle'),
  setup: L(
    "Uchburchak to'rtburchakning yarmi bo'ladi: asos va balandlik ko'paytiriladi, keyin ikkiga bo'linadi.",
    'Треугольник это половина прямоугольника: основание и высоту перемножают, потом делят на два.',
    'A triangle is half a rectangle: multiply base by height, then halve.'),
  cards: [
    { id: 'a', label: 'S' },
    { id: 'b', label: '= a · h : 2' },
    { id: 'c', label: '= a · h' },
    { id: 'd', label: '= a + h' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Formulani tuzing", 'Составь формулу', 'Build the formula'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. S = a · h : 2. Ikkiga bo'lish shart: uchburchak to'rtburchakning yarmi.",
    'Верно. S = a · h : 2. Деление на два обязательно: треугольник это половина прямоугольника.',
    'Correct. S = a · h : 2. The halving matters: a triangle is half a rectangle.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "a · h bu TO'RTBURCHAK yuzasi. Uchburchak uchun uni ikkiga bo'lish kerak.",
      'a · h это площадь ПРЯМОУГОЛЬНИКА. Для треугольника надо разделить на два.',
      'a · h is the RECTANGLE area. A triangle needs it halved.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "Qo'shish yuza bermaydi: yuza uchun ko'paytirish kerak.",
      'Сложение площади не даёт: для площади нужно умножение.',
      'Adding gives no area: area needs multiplication.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Formula ikki bo'lakdan iborat.",
      'Формула состоит из двух частей.',
      'The formula has two parts.') },
  ],
  wrongText: L(
    "Uchburchak to'rtburchakning qanday qismi? Formulada bu qanday ko'rinadi?",
    'Какую часть прямоугольника составляет треугольник? Как это видно в формуле?',
    'What fraction of a rectangle is a triangle? How does the formula show it?'),
};

export default function D48_02(props) { return <BuildLine data={DATA} {...props} />; }
