// Dars35 · Amaliyot 05 — Kesish nuqtasida xato · 🟡 · fix · tag: lin_fix
// Mexanika: kit.jsx -> TapTerms. Raskladka: 5-o'rin `fix`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): k manfiy va kasr bo'ladi,
// savol ikki qadamli -- PODXOD_7SINF.md 13-band.
// Chuqur yechim: y = 7x − 12 grafigi y o'qini (0; 12) da kesadi -- XATO, (0; −12).
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'lin_fix',
  level: '🟡',
  eyebrow: L(
    'Xato qadam',
    'Неверный шаг',
    'The wrong step'),
  setup: L(
    "Uch qadamdan biri noto'g'ri. y o'qini kesish nuqtasi b ning o'zi bo'ladi, ishorasi bilan.",
    'Один из трёх шагов неверный. Точка пересечения с осью y это сам b, вместе со знаком.',
    'One of the three steps is wrong. The y intercept is b itself, sign included.'),
  given: [['y = 7x − 12']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  ask: L(
    "NOTO'G'RI qadamni belgilang.",
    'Отметь НЕВЕРНЫЙ шаг.',
    'Mark the WRONG step.'),
  note: L(
    'Bitta qadam.',
    'Один шаг.',
    'One step.'),
  parts: [
    { k: 'term', id: 't1', v: "x = 0 qo'yiladi" },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't2', v: 'y = 7 · 0 − 12' },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't3', v: 'nuqta (0; 12)' },
  ],
  want: ['t3'],
  correctText: L(
    "To'g'ri. 7 · 0 − 12 = −12, ya'ni nuqta (0; −12). Minus yo'qolgan.",
    'Верно. 7 · 0 − 12 = −12, значит точка (0; −12). Минус потерялся.',
    'Correct. 7 · 0 − 12 = −12, so the point is (0; −12). The minus was dropped.'),
  wrongs: [
    {
      when: (s) => s.extra.indexOf('t1') !== -1,
      text: L(
        "y o'qida abssissa nol, ya'ni x = 0 qo'yish to'g'ri.",
        'На оси y абсцисса ноль, значит подстановка x = 0 верна.',
        'On the y axis the abscissa is zero, so x = 0 is right.'),
    },
    {
      when: (s) => s.extra.indexOf('t2') !== -1,
      text: L(
        "Qo'yish to'g'ri yozilgan: 7 · 0 − 12. Xato natijada.",
        'Подстановка записана верно: 7 · 0 − 12. Ошибка в результате.',
        'The substitution is written right: 7 · 0 − 12. The flaw is in the result.'),
    },
    {
      when: (s) => s.miss.length > 0,
      text: L(
        'Natijaning ishorasini tekshiring: 0 − 12 qancha?',
        'Проверь знак результата: сколько будет 0 − 12?',
        'Check the sign of the result: what is 0 − 12?'),
    },
  ],
  wrongText: L(
    "b ning ishorasi kesish nuqtasiga ko'chadi.",
    'Знак b переходит в точку пересечения.',
    'The sign of b carries into the intercept.'),
};

export default function D35_05(props) { return <TapTerms data={DATA} {...props} />; }
