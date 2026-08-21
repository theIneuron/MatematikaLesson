// Dars35 · Amaliyot 07 — Kesish nuqtasi · 🟡 · bracket · tag: lin_cross
// Mexanika: kit.jsx -> BuildLine (qavs kartalari). Raskladka: 7-o'rin.
// y = 7x − 9: y o'qini (0; −9) nuqtasida kesadi.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'lin_cross', level: '🟡',
  eyebrow: L('Kesish nuqtasi', 'Точка пересечения', 'The crossing point'),
  setup: L(
    "Grafik y o'qini x = 0 bo'lgan joyda kesadi. U yerda y faqat ozod hadga teng bo'ladi.",
    'График пересекает ось y там, где x = 0. В этой точке y равен свободному члену.',
    'The graph meets the y axis where x = 0. There y equals the free term.'),
  given: [['y', '=', '7x', '−', '9']],
  givenLabel: L('Formula:', 'Формула:', 'The rule:'),
  cards: [
    { id: 'a', label: '(0;' },
    { id: 'b', label: '−9)' },
    { id: 'c', label: '(−9;' },
    { id: 'd', label: '0)' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Nuqtaning yozuvini tuzing", 'Составь запись точки', 'Build the point record'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. x = 0 bo'lganda y = −9, ya'ni nuqta (0; −9).",
    'Верно. При x = 0 выходит y = −9, значит точка (0; −9).',
    'Correct. At x = 0, y = −9, so the point is (0; −9).'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1 || s.seq.indexOf('d') !== -1, text: L(
      "(−9; 0) bu x o'qidagi nuqta. y o'qida abssissa nol bo'ladi, ya'ni nol BIRINCHI o'rinda.",
      '(−9; 0) это точка на оси x. На оси y нулём является абсцисса, значит нуль ПЕРВЫЙ.',
      '(−9; 0) sits on the x axis. On the y axis the abscissa is zero, so the zero comes FIRST.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Yozuv ikki bo'lakdan iborat.",
      'Запись состоит из двух частей.',
      'The record has two parts.') },
  ],
  wrongText: L(
    "y o'qida qaysi koordinata nol bo'ladi?",
    'Какая координата равна нулю на оси y?',
    'Which coordinate is zero on the y axis?'),
};

export default function D35_07(props) { return <BuildLine data={DATA} {...props} />; }
