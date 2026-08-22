// Dars47 · Amaliyot 03 — Tenglikni yozish · 🟢 · bracket · tag: comp_bracket
// Mexanika: kit.jsx -> BuildLine. Raskladka: 3-o'rin `bracket`.
// Ikki yoy kesishgan nuqta uchun PA = PB. Tuzoq: PA = AB va PA + PB = AB.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'comp_bracket',
  level: '🟢',
  eyebrow: L(
    'Tenglikni yozish',
    'Записать равенство',
    'Write the equality'),
  setup: L(
    'A va B dan bir xil ochilish bilan chizilgan yoylar P nuqtada kesishdi. Shu holatning tengligini yozing.',
    'Дуги из A и B одним раствором пересеклись в точке P. Запиши равенство этого случая.',
    'Arcs from A and B with the same opening meet at P. Write the equality for that case.'),
  cards: [
    { id: 'a', label: 'PA' },
    { id: 'b', label: '= PB' },
    { id: 'c', label: '= AB' },
    { id: 'd', label: '+ PB = AB' },
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
    "To'g'ri. Ikki yoyning ochilishi bir xil, ya'ni PA = PB.",
    'Верно. Раствор обеих дуг одинаков, значит PA = PB.',
    'Correct. Both arcs share the opening, so PA = PB.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        "AB -- kesmaning o'zi. Yoylar esa P dan A gacha va P dan B gacha masofani tenglashtiradi.",
        'AB это сам отрезок. А дуги уравнивают расстояния от P до A и от P до B.',
        'AB is the segment itself. The arcs equate the distances from P to A and to B.'),
    },
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        "P kesmada yotishi shart emas, ya'ni PA + PB = AB bo'lmaydi.",
        'P не обязана лежать на отрезке, значит PA + PB = AB не выполняется.',
        'P need not lie on the segment, so PA + PB = AB does not hold.'),
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
    'Ikki yoyning ochilishi bir xil edi. Bu qanday tenglik beradi?',
    'Раствор обеих дуг был одинаков. Какое равенство это даёт?',
    'Both arcs had the same opening. What equality follows?'),
};

export default function D47_03(props) { return <BuildLine data={DATA} {...props} />; }
