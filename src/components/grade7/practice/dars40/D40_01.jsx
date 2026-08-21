// Dars40 · Amaliyot 01 — Qolgan bo'lak · 🟢 · choice · tag: seg_rest
// Mexanika: kit.jsx -> Choice. Raskladka: 40-dars, 1-o'rin (isinish).
// AB = 12, C nuqta AB ichida, AC = 5 -> CB = 12 − 5 = 7.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'seg_rest', level: '🟢', optCols: 3,
  eyebrow: L('Kesma bo\'laklari', 'Части отрезка', 'Parts of a segment'),
  setup: L(
    "C nuqta AB kesmasida yotsa, ikki bo'lak birga butun kesmani beradi: AC va CB yig'indisi AB ga teng.",
    'Если точка C лежит на отрезке AB, две части вместе дают весь отрезок: сумма AC и CB равна AB.',
    'If C lies on AB, the two parts add up to the whole: AC plus CB equals AB.'),
  given: [['AB', '=', '12'], ['AC', '=', '5']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  ask: L('CB qanchaga teng?', 'Чему равно CB?', 'What is CB?'),
  opts: [{ label: ['7'] }, { label: ['17'] }, { label: ['5'] }],
  correct: 0,
  correctText: L(
    "To'g'ri. AC + CB = AB, ya'ni CB = 12 − 5 = 7.",
    'Верно. AC + CB = AB, значит CB = 12 − 5 = 7.',
    'Correct. AC + CB = AB, so CB = 12 − 5 = 7.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "17 chiqishi uchun bo'laklar qo'shilgan. Butun kesma 12 ga teng, ya'ni bo'lak undan katta bo'lolmaydi.",
      'Чтобы вышло 17, части сложили. Весь отрезок равен 12, значит часть не может быть больше.',
      'To get 17 the parts were added. The whole is 12, so no part can exceed it.') },
    { when: (s) => s.picked === 2, text: L(
      "5 bu AC ning o'zi. C nuqta o'rtada turgani aytilmagan, ya'ni bo'laklar teng emas.",
      '5 это само AC. Про середину не сказано, значит части не равны.',
      '5 is AC itself. Nothing says C is the midpoint, so the parts differ.') },
  ],
  wrongText: L(
    "Butun kesma va bitta bo'lak ma'lum. Ikkinchisini qanday amal bilan topadilar?",
    'Известны весь отрезок и одна часть. Каким действием находят вторую?',
    'The whole and one part are known. Which operation gives the other?'),
};

export default function D40_01(props) { return <Choice data={DATA} {...props} />; }
