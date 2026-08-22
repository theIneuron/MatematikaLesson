// Dars34 · Amaliyot 07 — Manfiy sonda xato · 🟡 · fix · tag: fn_neg_fix
// Mexanika: kit.jsx -> TapTerms. Raskladka: 7-o'rin `fix`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): sonlar ikki xonali va manfiy,
// qadamlar soni ikkitadan boshlanadi -- PODXOD_7SINF.md 13-band.
// Chuqur yechim: f(x) = x² − 2x, f(−5) = 25 − 10 = 15. Xato: −2 · (−5) = +10, ya'ni 25 + 10 = 35.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'fn_neg_fix',
  level: '🟡',
  eyebrow: L(
    'Xato qadam',
    'Неверный шаг',
    'The wrong step'),
  setup: L(
    "Boshqa o'quvchining yechimi turibdi. Uch qadamdan biri noto'g'ri: minus ikki marta uchraganda natija musbat bo'ladi.",
    'Перед тобой решение другого ученика. Один из трёх шагов неверный: когда минус встречается дважды, результат положительный.',
    "Another pupil's work is shown. One of the three steps is wrong: two minuses give a plus."),
  given: [['f(x) = x² − 2x', ',', 'x = −5']],
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
    { k: 'term', id: 't1', v: '(−5)² = 25' },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't2', v: '−2 · (−5) = −10' },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't3', v: 'javob 15' },
  ],
  want: ['t2'],
  correctText: L(
    "To'g'ri. −2 · (−5) = +10, ya'ni javob 25 + 10 = 35, 15 emas.",
    'Верно. −2 · (−5) = +10, значит ответ 25 + 10 = 35, а не 15.',
    'Correct. −2 · (−5) = +10, so the answer is 25 + 10 = 35, not 15.'),
  wrongs: [
    {
      when: (s) => s.extra.indexOf('t1') !== -1,
      text: L(
        "(−5)² = 25 -- to'g'ri: juft ko'rsatkich natijani musbat qiladi.",
        '(−5)² = 25 верно: чётный показатель делает результат положительным.',
        '(−5)² = 25 is right: an even exponent gives a positive result.'),
    },
    {
      when: (s) => s.extra.indexOf('t3') !== -1,
      text: L(
        'Javob ikkinchi qadamdan chiqqan. Sabab esa aynan ikkinchi qadamda.',
        'Ответ вытекает из второго шага. Причина именно во втором шаге.',
        'The answer follows the second step, and that is where the flaw is.'),
    },
    {
      when: (s) => s.miss.length > 0,
      text: L(
        "Nechta minus ko'paytirilayotganini sanang.",
        'Посчитай, сколько минусов перемножается.',
        'Count how many minuses are multiplied.'),
    },
  ],
  wrongText: L(
    "Ikki manfiy sonning ko'paytmasi qanday ishora beradi?",
    'Какой знак даёт произведение двух отрицательных чисел?',
    'What sign does a product of two negatives give?'),
};

export default function D34_07(props) { return <TapTerms data={DATA} {...props} />; }
