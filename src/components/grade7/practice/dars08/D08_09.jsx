// Dars08 · Amaliyot 09 — Masaladan tenglamaga · 🔴 · tag: compose_linear
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> BuildLine (answerSeq).
//
// «Ikki bir xil qutida x dona olma bor, ustiga yana 7 dona qo'shildi,
// hammasi 43 dona bo'ldi.»
// Tenglama: 2x + 7 = 43.
// Bu chiziqli tenglamaning TUZILISHI: noma'lumli had, ozod had va natija.
// Kartalar aynan beshta -- ish tartibda.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const CARDS = [
  { id: 'x2', label: '2x' },
  { id: 'plus', label: '+' },
  { id: 'n7', label: '7' },
  { id: 'eq', label: '=' },
  { id: 'n43', label: '43' },
];

const DATA = {
  tag: 'compose_linear', level: '🔴', useAll: true,
  answerSeq: ['x2', 'plus', 'n7', 'eq', 'n43'],
  cards: CARDS,
  eyebrow: L('Masaladan tenglamaga', 'Из задачи в уравнение', 'From a problem to an equation'),
  setup: L(
    "Ikki bir xil qutida x dona olma bor edi. Ustiga yana 7 dona qo'shildi va hammasi 43 dona bo'ldi.",
    'В двух одинаковых ящиках было по x яблок. Добавили ещё 7 штук, и всего стало 43.',
    'Two identical boxes had x apples each. Another 7 were added, making 43 in all.'),
  empty: L("Kartalarni bosib tenglama yig'ing", 'Собери уравнение, нажимая карточки', 'Build the equation by tapping cards'),
  ask: L("Shu masalaning tenglamasini yig'ing. Hamma karta ishlatiladi.",
    'Собери уравнение к этой задаче. Используются все карточки.',
    'Build the equation for this problem. Every card is used.'),
  undo: L('Bitta orqaga', 'Шаг назад', 'One back'),
  valueLabel: L('Qiymat:', 'Значение:', 'Value:'),
  correctText: L(
    "To'g'ri. Ikki quti bu 2x, qo'shilgan 7 dona ozod had, 43 esa natija: 2x + 7 = 43. Bundan x = 18.",
    'Верно. Два ящика это 2x, добавленные 7 — свободный член, а 43 — результат: 2x + 7 = 43. Отсюда x = 18.',
    'Correct. Two boxes are 2x, the added 7 is the free term and 43 is the result: 2x + 7 = 43. Hence x = 18.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('eq') < s.seq.indexOf('n7'), text: L(
      "Tenglik belgisi natijadan oldin turadi: chap tomonda qutilar va qo'shilganlar, o'ng tomonda 43.",
      'Знак равенства стоит перед результатом: слева ящики и добавленные, справа 43.',
      'The equals sign comes before the result: boxes and added apples on the left, 43 on the right.') },
    { when: (s) => s.seq[0] !== 'x2', text: L(
      "Tenglama qutilardan boshlanadi: ikki qutida x dona, ya'ni 2x.",
      'Уравнение начинается с ящиков: в двух ящиках по x, то есть 2x.',
      'The equation starts with the boxes: two boxes of x each, that is 2x.') },
    { when: (s) => s.seq.indexOf('n43') < s.seq.indexOf('eq'), text: L(
      "43 bu HAMMASI, ya'ni natija. U tenglik belgisidan keyin yoziladi.",
      '43 это ВСЕГО, то есть результат. Он пишется после знака равенства.',
      '43 is the TOTAL, that is the result. It goes after the equals sign.') },
  ],
  wrongText: L(
    "Masalani tartib bilan yozing: ikki quti (2x), qo'shilgan 7, tenglik va hammasi 43.",
    'Записывай задачу по порядку: два ящика (2x), добавленные 7, равенство и всего 43.',
    'Write the problem in order: two boxes (2x), the added 7, the equals sign and the total 43.'),
};

export default function D08_09(props) { return <BuildLine data={DATA} {...props} />; }
