// Dars36 · Amaliyot 01 — Nechta nuqta kerak · 🟢 · choice · tag: how_many_points
// Mexanika: kit.jsx -> Choice. Raskladka: 1-o'rin `choice`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): k manfiy va kasr bo'ladi,
// savol ikki qadamli -- PODXOD_7SINF.md 13-band.
// To'g'ri chiziq uchun ikki nuqta kifoya, uchinchisi TEKSHIRISH uchun olinadi.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'how_many_points',
  level: '🟢',
  eyebrow: L(
    'Nechta nuqta',
    'Сколько точек',
    'How many points'),
  setup: L(
    "Chiziqli funksiyaning grafigi to'g'ri chiziq. Uni qurish uchun eng kam nechta nuqta kerak?",
    'График линейной функции это прямая. Сколько точек нужно как минимум, чтобы её построить?',
    'A linear graph is a straight line. What is the least number of points needed?'),
  ask: L(
    'Eng kam nechta nuqta kerak?',
    'Сколько точек нужно минимум?',
    'How many points at least?'),
  opts: [
    {
      label: L(
        'Ikkita',
        'Две',
        'Two'),
    },
    {
      label: L(
        'Bitta',
        'Одна',
        'One'),
    },
    {
      label: L(
        'Uchta',
        'Три',
        'Three'),
    },
    {
      label: L(
        'Kamida beshta',
        'Не меньше пяти',
        'At least five'),
    },
  ],
  correct: 0,
  optCols: 2,
  correctText: L(
    "To'g'ri. Ikki nuqta to'g'ri chiziqni bir qiymatli beradi. Uchinchisi xatoni tekshirish uchun olinadi.",
    'Верно. Две точки задают прямую однозначно. Третью берут, чтобы проверить себя.',
    'Correct. Two points fix a line. A third is taken as a check.'),
  wrongs: [
    {
      when: (s) => s.picked === 1,
      text: L(
        "Bitta nuqtadan cheksiz ko'p to'g'ri chiziq o'tadi.",
        'Через одну точку проходит бесконечно много прямых.',
        'Infinitely many lines pass through one point.'),
    },
    {
      when: (s) => s.picked === 2,
      text: L(
        'Uchinchi nuqta foydali, lekin SHART emas: ikkitasi yetadi.',
        'Третья точка полезна, но не обязательна: двух достаточно.',
        'A third point helps but is not required: two suffice.'),
    },
    {
      when: (s) => s.picked === 3,
      text: L(
        "Beshta nuqta ortiqcha ish: to'g'ri chiziq ikki nuqta bilan aniqlanadi.",
        'Пять точек это лишняя работа: прямая определяется двумя точками.',
        'Five points is wasted work: a line is set by two.'),
    },
  ],
  wrongText: L(
    "Bitta nuqtadan nechta to'g'ri chiziq o'tkazish mumkin?",
    'Сколько прямых можно провести через одну точку?',
    'How many lines can pass through a single point?'),
};

export default function D36_01(props) { return <Choice data={DATA} {...props} />; }
