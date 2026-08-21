// Dars41 · Amaliyot 07 — Tenglikni tuzish · 🟡 · bracket · tag: ang_equality
// Mexanika: kit.jsx -> BuildLine (qavs kartalari). Raskladka: 7-o'rin.
// Qo'shni burchaklar uchun: ∠1 + ∠2 = 180°. Tuzoq: 90° yoki ayirma.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'ang_equality', level: '🟡',
  eyebrow: L('Tenglikni tuzish', 'Составить равенство', 'Build the equality'),
  setup: L(
    "Ikki burchak qo'shni. Bu holatni tenglik bilan yozish kerak.",
    'Два угла смежные. Это надо записать равенством.',
    'Two angles are adjacent. Write that as an equality.'),
  cards: [
    { id: 'a', label: '∠1 + ∠2' },
    { id: 'b', label: '= 180°' },
    { id: 'c', label: '= 90°' },
    { id: 'd', label: '∠1 − ∠2' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Tenglikni tuzing", 'Составь равенство', 'Build the equality'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. ∠1 + ∠2 = 180°: qo'shni burchaklar birga yoyilgan burchak beradi.",
    'Верно. ∠1 + ∠2 = 180°: смежные углы вместе дают развёрнутый угол.',
    'Correct. ∠1 + ∠2 = 180°: adjacent angles form a straight angle.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "90 gradus to'ldiruvchi burchaklar uchun. Qo'shni burchaklar 180 beradi.",
      '90 градусов для дополнительных углов. Смежные дают 180.',
      '90 is for complementary angles. Adjacent ones give 180.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "Ayirma emas: qo'shni burchaklar QO'SHILADI.",
      'Не разность: смежные углы СКЛАДЫВАЮТСЯ.',
      'Not a difference: adjacent angles ADD.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Tenglik ikki bo'lakdan iborat.",
      'Равенство состоит из двух частей.',
      'The equality has two parts.') },
  ],
  wrongText: L(
    "Qo'shni burchaklar qanday amal bilan birlashadi va nechchi beradi?",
    'Каким действием соединяются смежные углы и что они дают?',
    'Which operation joins adjacent angles, and what do they give?'),
};

export default function D41_07(props) { return <BuildLine data={DATA} {...props} />; }
