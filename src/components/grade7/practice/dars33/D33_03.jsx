// Dars33 · Amaliyot 03 — O'qda yotmaydigan nuqta · 🟢 · fix · tag: axis_fix
// Mexanika: kit.jsx -> TapTerms. Raskladka: 3-o'rin `fix`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): sonlar ikki xonali va manfiy,
// qadamlar soni ikkitadan boshlanadi -- PODXOD_7SINF.md 13-band.
// y o'qida yotishi uchun abssissa nol: A(0; 14) yotadi, B(14; 0) yotmaydi (u x o'qida), C(0; −9) yotadi.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'axis_fix',
  level: '🟢',
  eyebrow: L(
    "y o'qi",
    'Ось y',
    'The y axis'),
  setup: L(
    "Uch nuqtadan biri y o'qida YOTMAYDI. y o'qida yotish uchun abssissa nol bo'lishi kerak.",
    'Одна из трёх точек НЕ лежит на оси y. Для этого абсцисса должна быть нулём.',
    'One of the three points does NOT lie on the y axis. That needs a zero abscissa.'),
  ask: L(
    "y o'qida YOTMAYDIGAN nuqtani belgilang.",
    'Отметь точку, которая НЕ лежит на оси y.',
    'Mark the point NOT on the y axis.'),
  note: L(
    'Bitta nuqta.',
    'Одна точка.',
    'One point.'),
  parts: [
    { k: 'term', id: 't1', v: 'A(0; 14)' },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't2', v: 'B(14; 0)' },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't3', v: 'C(0; −9)' },
  ],
  want: ['t2'],
  correctText: L(
    "To'g'ri. B(14; 0) da nol -- ORDINATA, ya'ni nuqta x o'qida yotadi.",
    'Верно. У B(14; 0) ноль это ОРДИНАТА, значит точка лежит на оси x.',
    'Correct. In B(14; 0) the zero is the ORDINATE, so the point sits on the x axis.'),
  wrongs: [
    {
      when: (s) => s.extra.indexOf('t1') !== -1,
      text: L(
        "A(0; 14) da abssissa nol -- nuqta y o'qida yotadi.",
        'У A(0; 14) абсцисса ноль — точка на оси y.',
        'A(0; 14) has zero abscissa, so it lies on the y axis.'),
    },
    {
      when: (s) => s.extra.indexOf('t3') !== -1,
      text: L(
        "C(0; −9) da ham abssissa nol -- y o'qida, faqat noldan pastda.",
        'У C(0; −9) абсцисса тоже ноль — на оси y, только ниже нуля.',
        'C(0; −9) also has zero abscissa: on the y axis, below zero.'),
    },
    {
      when: (s) => s.miss.length > 0,
      text: L(
        'Har nuqtada BIRINCHI son nolmi -- shuni tekshiring.',
        'Проверь в каждой точке, ноль ли ПЕРВОЕ число.',
        'Check whether the FIRST number is zero in each point.'),
    },
  ],
  wrongText: L(
    "y o'qida abssissa nol bo'ladi. Birinchi songa qarang.",
    'На оси y абсцисса равна нулю. Смотри на первое число.',
    'On the y axis the abscissa is zero. Look at the first number.'),
};

export default function D33_03(props) { return <TapTerms data={DATA} {...props} />; }
