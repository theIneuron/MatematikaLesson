// Dars33 · Amaliyot 02 — Nuqta qayerda · 🟢 · choice · tag: point_where
// Mexanika: kit.jsx -> Choice. Raskladka: 2-o'rin `choice`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): sonlar ikki xonali va manfiy,
// qadamlar soni ikkitadan boshlanadi -- PODXOD_7SINF.md 13-band.
// (−18; 0) -- ordinata nol, ya'ni nuqta x o'qida, nolning chapida.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'point_where',
  level: '🟢',
  eyebrow: L(
    'Nuqta qayerda',
    'Где точка',
    'Where the point is'),
  setup: L(
    "Koordinatalardan biri nol bo'lsa, nuqta o'qda yotadi. Qaysi o'qda -- shuni NOL bo'lgan koordinata hal qiladi.",
    'Если одна из координат ноль, точка лежит на оси. На какой именно — решает та координата, что равна нулю.',
    'A zero coordinate puts the point on an axis. Which axis is decided by which coordinate is zero.'),
  given: [['(−18; 0)']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  ask: L(
    'Bu nuqta qayerda yotadi?',
    'Где лежит эта точка?',
    'Where does this point lie?'),
  opts: [
    {
      label: L(
        "x o'qida, noldan chapda",
        'На оси x, левее нуля',
        'On the x axis, left of zero'),
    },
    {
      label: L(
        "y o'qida, noldan pastda",
        'На оси y, ниже нуля',
        'On the y axis, below zero'),
    },
    {
      label: L(
        'Uchinchi chorakda',
        'В третьей четверти',
        'In the third quadrant'),
    },
    {
      label: L(
        'Koordinatalar boshida',
        'В начале координат',
        'At the origin'),
    },
  ],
  correct: 0,
  optCols: 1,
  correctText: L(
    "To'g'ri. Ordinata nol -- nuqta x o'qida; abssissa manfiy -- noldan chapda.",
    'Верно. Ордината ноль — точка на оси x; абсцисса отрицательная — левее нуля.',
    'Correct. A zero ordinate puts it on the x axis; the negative abscissa puts it left of zero.'),
  wrongs: [
    {
      when: (s) => s.picked === 1,
      text: L(
        "y o'qida yotishi uchun ABSSISSA nol bo'lishi kerak. Bu yerda nol -- ordinata.",
        'Чтобы лежать на оси y, нулём должна быть АБСЦИССА. Здесь ноль это ордината.',
        'Lying on the y axis needs a zero ABSCISSA. Here the ordinate is zero.'),
    },
    {
      when: (s) => s.picked === 2,
      text: L(
        'Chorakda yotish uchun ikki koordinata ham noldan farq qilishi kerak.',
        'Чтобы лежать в четверти, обе координаты должны быть не нулевые.',
        'A quadrant needs both coordinates non-zero.'),
    },
    {
      when: (s) => s.picked === 3,
      text: L(
        'Koordinatalar boshi (0; 0). Bu yerda abssissa −18.',
        'Начало координат это (0; 0). Здесь абсцисса −18.',
        'The origin is (0; 0). Here the abscissa is −18.'),
    },
  ],
  wrongText: L(
    "Qaysi koordinata nol? Nuqta shu koordinataga MOS BO'LMAGAN o'qda yotadi.",
    'Какая координата ноль? Точка лежит на оси, которой эта координата НЕ соответствует.',
    'Which coordinate is zero? The point sits on the other axis.'),
};

export default function D33_02(props) { return <Choice data={DATA} {...props} />; }
