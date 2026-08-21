// Dars15 · Amaliyot 02 — Koeffitsiyent · 🟢 · tag: coefficient
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
//
// −7a²b ning koeffitsiyenti −7: minus koeffitsiyentning bir qismi.
// Xato variantlar: 7 (minusni tashlab ketgan) va 2 (ko'rsatkichni
// koeffitsiyent deb olgan).
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'coefficient', level: '🟢', optCols: 3,
  eyebrow: L('Koeffitsiyent', 'Коэффициент', 'The coefficient'),
  setup: L(
    "Bir hadning oldidagi son -- uning koeffitsiyenti. Minus ham koeffitsiyentning bir qismi.",
    'Число перед одночленом — его коэффициент. Минус тоже часть коэффициента.',
    'The number in front of a monomial is its coefficient. The minus is part of it too.'),
  expr: ['−7a²b'], exprSize: 38,
  ask: L('Bu bir hadning koeffitsiyenti qanday?', 'Каков коэффициент этого одночлена?', 'What is the coefficient of this monomial?'),
  opts: [{ label: ['−7'] }, { label: ['7'] }, { label: ['2'] }],
  correct: 0,
  correctText: L(
    "To'g'ri. Koeffitsiyent −7: minus songa tegishli, harflarga emas.",
    'Верно. Коэффициент −7: минус относится к числу, а не к буквам.',
    'Correct. The coefficient is −7: the minus belongs to the number, not to the letters.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Minus yo'qolib qoldi. U harfning oldida emas, SONNING oldida turibdi: koeffitsiyent −7.",
      'Минус потерялся. Он стоит не перед буквой, а перед ЧИСЛОМ: коэффициент −7.',
      'The minus got lost. It stands before the NUMBER, not the letter: the coefficient is −7.') },
    { when: (s) => s.picked === 2, text: L(
      "2 bu a ning KO'RSATKICHI, koeffitsiyent emas. Koeffitsiyent harflardan oldin turadi.",
      '2 это ПОКАЗАТЕЛЬ у a, а не коэффициент. Коэффициент стоит перед буквами.',
      '2 is the EXPONENT of a, not the coefficient. The coefficient stands before the letters.') },
  ],
  wrongText: L(
    "Harflardan oldin turgan songa qarang -- ishorasi bilan birga.",
    'Смотри на число перед буквами — вместе с его знаком.',
    'Look at the number before the letters — together with its sign.'),
};

export default function D15_02(props) { return <Choice data={DATA} {...props} />; }
