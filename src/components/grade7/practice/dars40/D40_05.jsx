// Dars40 · Amaliyot 05 — Tenglikni tuzish · 🟡 · bracket · tag: seg_equality
// Mexanika: kit.jsx -> BuildLine (qavs kartalari). Raskladka: 5-o'rin.
// C nuqta AB ichida bo'lsa: AB = AC + CB. Tuzoq: AB = AC − CB.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'seg_equality', level: '🟡',
  eyebrow: L('Tenglikni tuzish', 'Составить равенство', 'Build the equality'),
  setup: L(
    "C nuqta AB ichida yotadi. Bu holatni tenglik bilan yozish kerak: butun kesma bo'laklar yig'indisiga teng.",
    'Точка C лежит внутри AB. Это надо записать равенством: весь отрезок равен сумме частей.',
    'C lies inside AB. Write that as an equality: the whole equals the sum of the parts.'),
  cards: [
    { id: 'a', label: 'AB' },
    { id: 'b', label: '= AC + CB' },
    { id: 'c', label: '= AC − CB' },
    { id: 'd', label: 'AC' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Tenglikni tuzing", 'Составь равенство', 'Build the equality'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. AB = AC + CB: ikki bo'lak birga butun kesmani beradi.",
    'Верно. AB = AC + CB: две части вместе дают весь отрезок.',
    'Correct. AB = AC + CB: the two parts make the whole.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "Ayirish noto'g'ri: bo'laklar butunni QO'SHIB beradi. Ayirish bitta bo'lakni topish uchun ishlatiladi.",
      'Вычитание неверно: части СКЛАДЫВАЮТСЯ в целое. Вычитание нужно, чтобы найти одну часть.',
      'Subtraction is wrong: the parts ADD to the whole. Subtraction finds one part.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "Chap tomonda butun kesma turishi kerak: AB.",
      'Слева должен стоять весь отрезок: AB.',
      'The left side must hold the whole segment: AB.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Tenglik ikki bo'lakdan iborat.",
      'Равенство состоит из двух частей.',
      'The equality has two parts.') },
  ],
  wrongText: L(
    "Butun kesma qaysi tomonda turadi? Bo'laklar qanday amal bilan birlashadi?",
    'На какой стороне стоит весь отрезок? Каким действием соединяются части?',
    'Which side holds the whole? Which operation joins the parts?'),
};

export default function D40_05(props) { return <BuildLine data={DATA} {...props} />; }
