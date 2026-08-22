// Dars38 · Amaliyot 01 — Yechim nima · 🟢 · choice · tag: sys_what
// Mexanika: kit.jsx -> Choice. Raskladka: 1-o'rin `choice`.
// Sistemaning yechimi -- IKKI tenglamani ham bajaradigan juftlik.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'sys_what',
  level: '🟢',
  eyebrow: L(
    'Yechim nima',
    'Что такое решение',
    'What a solution is'),
  setup: L(
    'Sistemada ikki tenglama birga turadi. Yechim -- ikkovini ham bajaradigan sonlar juftligi.',
    'В системе два уравнения стоят вместе. Решение это пара чисел, которая выполняет оба.',
    'A system holds two equations at once. A solution is a pair satisfying both.'),
  ask: L(
    'Sistemaning yechimi nima?',
    'Что такое решение системы?',
    'What is a solution of a system?'),
  opts: [
    {
      label: L(
        'Ikki tenglamani ham bajaradigan juftlik',
        'Пара, выполняющая оба уравнения',
        'A pair satisfying both equations'),
    },
    {
      label: L(
        'Birinchi tenglamaning ildizi',
        'Корень первого уравнения',
        'The root of the first equation'),
    },
    {
      label: L(
        "Ikki tenglamaning yig'indisi",
        'Сумма двух уравнений',
        'The sum of the equations'),
    },
    {
      label: L(
        'Har qanday son juftligi',
        'Любая пара чисел',
        'Any pair of numbers'),
    },
  ],
  correct: 0,
  optCols: 1,
  correctText: L(
    "To'g'ri. Juftlik ikki tenglamada ham to'g'ri tenglik berishi kerak.",
    'Верно. Пара должна давать верное равенство в обоих уравнениях.',
    'Correct. The pair must make both equations true.'),
  wrongs: [
    {
      when: (s) => s.picked === 1,
      text: L(
        'Bitta tenglamaning ildizi yetmaydi: ikkinchisi buzilishi mumkin.',
        'Корня одного уравнения мало: второе может нарушиться.',
        'One equation is not enough: the other may fail.'),
    },
    {
      when: (s) => s.picked === 2,
      text: L(
        "Yig'indi yechishning USULI, javobning o'zi emas.",
        'Сумма это СПОСОБ решения, а не сам ответ.',
        'Adding them is a METHOD, not the answer.'),
    },
    {
      when: (s) => s.picked === 3,
      text: L(
        'Har qanday juftlik emas: u tenglamalarni bajarishi shart.',
        'Не любая пара: она должна выполнять уравнения.',
        'Not any pair: it must satisfy the equations.'),
    },
  ],
  wrongText: L(
    'Nechta tenglama bor va nechtasi bajarilishi kerak?',
    'Сколько уравнений и сколько должно выполняться?',
    'How many equations, and how many must hold?'),
};

export default function D38_01(props) { return <Choice data={DATA} {...props} />; }
