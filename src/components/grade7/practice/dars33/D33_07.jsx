// Dars33 · Amaliyot 07 — O'qdagi nuqta · 🟡 · bracket · tag: point_on_axis
// Mexanika: kit.jsx -> BuildLine (qavs kartalari). Raskladka: 7-o'rin.
// x o'qida abssissasi −6 bo'lgan nuqta: (−6; 0). Ordinata NOL.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'point_on_axis', level: '🟡',
  eyebrow: L("O'qdagi nuqta", 'Точка на оси', 'A point on an axis'),
  setup: L(
    "x o'qida yotgan nuqtaning ordinatasi nol: u yuqoriga ham pastga ham siljimaydi.",
    'У точки на оси x ордината равна нулю: она не сдвигается ни вверх, ни вниз.',
    'A point on the x axis has ordinate zero: no shift up or down.'),
  given: [['x', '=', '−6']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  cards: [
    { id: 'a', label: '(−6;' },
    { id: 'b', label: '0)' },
    { id: 'c', label: '(0;' },
    { id: 'd', label: '−6)' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Nuqtaning yozuvini tuzing", 'Составь запись точки', 'Build the point record'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. (−6; 0): abssissa −6, ordinata nol -- nuqta x o'qida, noldan chapda.",
    'Верно. (−6; 0): абсцисса −6, ордината нуль — точка на оси x, левее нуля.',
    'Correct. (−6; 0): abscissa −6 and ordinate zero — on the x axis, left of zero.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1 || s.seq.indexOf('d') !== -1, text: L(
      "(0; −6) bu y o'qidagi nuqta. Bizga x o'qi kerak, ya'ni nol IKKINCHI o'rinda turadi.",
      '(0; −6) это точка на оси y. Нам нужна ось x, значит нуль стоит ВТОРЫМ.',
      '(0; −6) sits on the y axis. We need the x axis, so the zero comes SECOND.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Yozuv ikki bo'lakdan iborat: abssissa va ordinata.",
      'Запись состоит из двух частей: абсцисса и ордината.',
      'The record has two parts: abscissa and ordinate.') },
  ],
  wrongText: L(
    "x o'qida qaysi koordinata nol bo'ladi?",
    'Какая координата равна нулю на оси x?',
    'Which coordinate is zero on the x axis?'),
};

export default function D33_07(props) { return <BuildLine data={DATA} {...props} />; }
