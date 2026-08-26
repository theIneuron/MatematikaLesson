// Dars36 · Amaliyot 10 — Qiymatda xato · 🔴 · fix · tag: graph_fix
// Mexanika: kit.jsx -> TapTerms. Raskladka: 10-o'rin `fix`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): k manfiy va kasr bo'ladi,
// savol ikki qadamli -- PODXOD_7SINF.md 13-band.
// Chuqur yechim: y = −5x + 2, x = 4 -> −20 + 2 = −18. Xato javob 22: minus tashlab ketilgan.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'graph_fix',
  level: '🔴',
  eyebrow: L(
    'Xato qadam',
    'Неверный шаг',
    'The wrong step'),
  setup: L(
    "Uch qadamdan biri noto'g'ri. k manfiy, ya'ni ko'paytma ham manfiy chiqadi.",
    'Один из трёх шагов неверный. k отрицательный, значит и произведение отрицательное.',
    'One of the three steps is wrong. k is negative, so the product is negative too.'),
  given: [['y = −5x + 2', ',', 'x = 4']],
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
    { k: 'term', id: 't1', v: L("x = 4 qo'yiladi", 'подставляем x = 4', 'substitute x = 4') },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't2', v: '−5 · 4 = 20' },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't3', v: 'y = 22' },
  ],
  want: ['t2'],
  correctText: L(
    "To'g'ri. −5 · 4 = −20, ya'ni y = −20 + 2 = −18.",
    'Верно. −5 · 4 = −20, значит y = −20 + 2 = −18.',
    'Correct. −5 · 4 = −20, so y = −20 + 2 = −18.'),
  wrongs: [
    {
      when: (s) => s.extra.indexOf('t1') !== -1,
      text: L(
        "x = 4 ni qo'yish to'g'ri: shart shunday.",
        'Подстановка x = 4 верна: так дано в условии.',
        'Substituting x = 4 is right: the task says so.'),
    },
    {
      when: (s) => s.extra.indexOf('t3') !== -1,
      text: L(
        '22 ikkinchi qadamdan chiqdi. Sabab esa aynan ikkinchi qadamda.',
        '22 вытекает из второго шага. Причина именно во втором шаге.',
        '22 follows the second step, and that is where the flaw is.'),
    },
    {
      when: (s) => s.miss.length > 0,
      text: L(
        "Manfiy k ni musbat songa ko'paytirsak qanday ishora chiqadi?",
        'Какой знак даёт отрицательный k, умноженный на положительное число?',
        'What sign comes from a negative k times a positive number?'),
    },
  ],
  wrongText: L(
    "Manfiy va musbat sonning ko'paytmasi manfiy bo'ladi.",
    'Произведение отрицательного и положительного отрицательно.',
    'A negative times a positive is negative.'),
};

export default function D36_10(props) { return <TapTerms data={DATA} {...props} />; }
