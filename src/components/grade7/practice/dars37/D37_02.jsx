// Dars37 · Amaliyot 02 — Qaysi biri proporsionallik · 🟢 · choice · tag: which_prop
// Mexanika: kit.jsx -> Choice. Raskladka: 2-o'rin `choice`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): manfiy va kasr koeffitsiyent,
// ikki qadamli savol, yaqin tuzoq -- PODXOD_7SINF.md 13-band.
// y = −7x -- to'g'ri proporsionallik. y = −7x + 1 da ozod had bor, y = 7 : x va y = x² esa boshqa turdagi bog'lanish.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'which_prop',
  level: '🟢',
  eyebrow: L(
    'Qaysi biri',
    'Какая из них',
    'Which one'),
  setup: L(
    "To'g'ri proporsionallik faqat y = kx ko'rinishida bo'ladi: ozod had yo'q, x maxrajda ham, darajada ham turmaydi.",
    'Прямая пропорциональность это только вид y = kx: без свободного члена, x не в знаменателе и не в степени.',
    'Direct proportion means y = kx only: no constant, and x neither in a denominator nor a power.'),
  ask: L(
    "Qaysi biri to'g'ri proporsionallik?",
    'Какая из них прямая пропорциональность?',
    'Which one is direct proportion?'),
  opts: [{ label: 'y = −7x' }, { label: 'y = −7x + 1' }, { label: 'y = 7 : x' }, { label: 'y = x²' }],
  correct: 0,
  optCols: 2,
  correctText: L(
    "To'g'ri. y = −7x aynan y = kx ko'rinishida, k manfiy bo'lishi mumkin.",
    'Верно. y = −7x именно вида y = kx, а k может быть отрицательным.',
    'Correct. y = −7x is exactly y = kx, and k may be negative.'),
  wrongs: [
    {
      when: (s) => s.picked === 1,
      text: L(
        "+1 ozod had. U bo'lsa grafik koordinatalar boshidan o'tmaydi.",
        '+1 это свободный член. С ним график не проходит через начало координат.',
        'The +1 is a constant. With it the graph misses the origin.'),
    },
    {
      when: (s) => s.picked === 2,
      text: L(
        "y = 7 : x da x maxrajda: x o'sganda y KAMAYADI, bu boshqa bog'lanish.",
        'В y = 7 : x икс в знаменателе: с ростом x значение УБЫВАЕТ, это другая связь.',
        'In y = 7 : x the x sits below: growing x lowers y, a different relation.'),
    },
    {
      when: (s) => s.picked === 3,
      text: L(
        "y = x² da x darajada. Proporsionallikda x birinchi darajada bo'ladi.",
        'В y = x² икс в степени. В пропорциональности x в первой степени.',
        'In y = x² the x is squared. Proportion keeps x to the first power.'),
    },
  ],
  wrongText: L(
    "y = kx ko'rinishiga aynan tushadigan yozuvni tanlang.",
    'Выбери запись, которая точно ложится в вид y = kx.',
    'Pick the record that fits y = kx exactly.'),
};

export default function D37_02(props) { return <Choice data={DATA} {...props} />; }
