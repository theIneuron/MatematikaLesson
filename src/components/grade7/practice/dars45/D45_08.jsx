// Dars45 · Amaliyot 08 — Parallellik sharti · 🔴 · bracket · tag: par_condition
// Mexanika: kit.jsx -> BuildLine (qavs kartalari). Raskladka: 8-o'rin.
// Mos burchaklar teng bo'lsa chiziqlar parallel: x = 70 sharti.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'par_condition', level: '🔴',
  eyebrow: L('Parallellik sharti', 'Условие параллельности', 'The parallel condition'),
  setup: L(
    "Bir burchak 70°, ikkinchisi x -- ular mos burchaklar. Chiziqlar parallel bo'lishi uchun ular teng bo'lishi kerak.",
    'Один угол 70°, второй x — они соответственные. Чтобы прямые были параллельны, они должны быть равны.',
    'One angle is 70° and the other x — they correspond. For the lines to be parallel they must be equal.'),
  given: [['70°', L('va', 'и', 'and'), 'x', '--', L('mos', 'соответственный', 'matching')]],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  cards: [
    { id: 'a', label: 'x' },
    { id: 'b', label: '= 70°' },
    { id: 'c', label: '= 110°' },
    { id: 'd', label: '2x' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Shartni tuzing", 'Составь условие', 'Build the condition'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Mos burchaklar teng bo'lsa chiziqlar parallel: x = 70°.",
    'Верно. Если соответственные углы равны, прямые параллельны: x = 70°.',
    'Correct. Equal corresponding angles make the lines parallel: x = 70°.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "110° bir tomonli burchaklar uchun shart bo'lardi. Mos burchaklar esa TENG bo'ladi.",
      '110° было бы условием для односторонних углов. А соответственные РАВНЫ.',
      '110° would be the condition for same-side angles. Corresponding ones are EQUAL.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "2x shartda kerak emas: burchak x deb belgilangan.",
      '2x в условии не нужен: угол обозначен как x.',
      '2x is not needed: the angle is called x.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Shart ikki bo'lakdan iborat.",
      'Условие состоит из двух частей.',
      'The condition has two parts.') },
  ],
  wrongText: L(
    "Mos burchaklar uchun parallellik sharti qanday: teng bo'lishimi yoki 180 berishi?",
    'Каково условие параллельности для соответственных углов: равенство или сумма 180?',
    'What is the parallel condition for corresponding angles: equality or a sum of 180?'),
};

export default function D45_08(props) { return <BuildLine data={DATA} {...props} />; }
