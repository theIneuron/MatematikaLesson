// Dars43 · Amaliyot 10 — Moslikni yozish · 🔴 · bracket · tag: eq_bracket
// Mexanika: kit.jsx -> BuildLine (qavs kartalari). Raskladka: 10-o'rin.
// Teng uchburchaklarda mos tomonlar tengligi: AB = A₁B₁.
// Tuzoq: AB = B₁C₁ -- mos bo'lmagan tomonlar.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'eq_bracket', level: '🔴',
  eyebrow: L('Moslik', 'Соответствие', 'Correspondence'),
  setup: L(
    "Teng uchburchaklarda MOS tomonlar teng bo'ladi. Harflar tartibi mosligni ko'rsatadi: A ga A₁, B ga B₁.",
    'У равных треугольников равны СООТВЕТСТВЕННЫЕ стороны. Порядок букв показывает соответствие: A с A₁, B с B₁.',
    'Equal triangles have equal CORRESPONDING sides. The letter order shows the match: A with A₁, B with B₁.'),
  given: [['ABC', '=', 'A₁B₁C₁']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  cards: [
    { id: 'a', label: 'AB' },
    { id: 'b', label: '= A₁B₁' },
    { id: 'c', label: '= B₁C₁' },
    { id: 'd', label: 'BC' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Tenglikni tuzing", 'Составь равенство', 'Build the equality'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. AB = A₁B₁: harflar joyi bir xil, ya'ni tomonlar mos.",
    'Верно. AB = A₁B₁: буквы на тех же местах, значит стороны соответственные.',
    'Correct. AB = A₁B₁: the letters sit in the same places, so the sides correspond.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1 && s.seq.indexOf('a') !== -1, text: L(
      "AB va B₁C₁ mos tomonlar emas: AB ga A₁B₁ mos keladi, BC ga esa B₁C₁.",
      'AB и B₁C₁ не соответственные: AB отвечает A₁B₁, а BC отвечает B₁C₁.',
      'AB and B₁C₁ do not correspond: AB matches A₁B₁, and BC matches B₁C₁.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Tenglik ikki bo'lakdan iborat.",
      'Равенство состоит из двух частей.',
      'The equality has two parts.') },
  ],
  wrongText: L(
    "Uchburchaklar yozuvidagi harflar tartibiga qarang: AB ga qaysi tomon mos keladi?",
    'Смотри на порядок букв в записи треугольников: какая сторона отвечает AB?',
    'Look at the letter order in the triangle names: which side matches AB?'),
};

export default function D43_10(props) { return <BuildLine data={DATA} {...props} />; }
