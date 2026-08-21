// Dars29 · Amaliyot 04 — Formula almashgan · 🟡 · fix · tag: fact_fix
// Mexanika: kit.jsx -> TapTerms. Raskladka: 4-o'rin.
// Chuqur yechim: 9y² − 30y + 25 = (3y)² − 30y + 5² = (3y − 5)(3y + 5)
//   Ikki qadam to'g'ri, uchinchisi NOTO'G'RI: o'rta had bor, ya'ni bu
//   to'liq kvadrat: (3y − 5)².
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'fact_fix', level: '🟡',
  eyebrow: L('Xato qadam', 'Неверный шаг', 'The wrong step'),
  setup: L(
    "Boshqa o'quvchi ajratdi, lekin formulani almashtirib yubordi. O'rta had bor ekanini hisobga olmadi.",
    'Другой ученик разложил, но перепутал формулу: он не учёл, что средний член есть.',
    'Another pupil factorised it but mixed up the formula, ignoring that a middle term is present.'),
  given: [['9y²', '−', '30y', '+', '25']],
  givenLabel: L('Masala:', 'Задание:', 'The task:'),
  ask: L("NOTO'G'RI qadamni belgilang.", 'Отметь НЕВЕРНЫЙ шаг.', 'Mark the WRONG step.'),
  note: L('Bitta qadam.', 'Один шаг.', 'One step.'),
  parts: [
    { k: 'term', id: 't1', v: '(3y)²' },
    { k: 'sign', v: '·' },
    { k: 'term', id: 't2', v: '5²' },
    { k: 'sign', v: '=' },
    { k: 'term', id: 't3', v: '(3y − 5)(3y + 5)' },
  ],
  want: ['t3'],
  correctText: L(
    "To'g'ri. O'rta had −30y = −2 · 3y · 5, ya'ni bu to'liq kvadrat: (3y − 5)². Kvadratlar ayirmasida o'rta had bo'lmaydi.",
    'Верно. Средний член −30y = −2 · 3y · 5, значит это полный квадрат: (3y − 5)². В разности квадратов среднего члена нет.',
    'Correct. The middle term −30y = −2 · 3y · 5, so this is a perfect square: (3y − 5)². A difference of squares has no middle term.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('t1') !== -1, text: L(
      "(3y)² to'g'ri: 9y² = 3² · y².",
      '(3y)² верно: 9y² = 3² · y².',
      '(3y)² is right: 9y² = 3² · y².') },
    { when: (s) => s.extra.indexOf('t2') !== -1, text: L(
      "5² ham to'g'ri: 25 = 5 · 5.",
      '5² тоже верно: 25 = 5 · 5.',
      '5² is right too: 25 = 5 · 5.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Oxirgi qadamni tekshiring: (3y − 5)(3y + 5) ochilsa o'rta had chiqadimi?",
      'Проверь последний шаг: даст ли (3y − 5)(3y + 5) средний член?',
      'Check the last step: does (3y − 5)(3y + 5) give a middle term?') },
  ],
  wrongText: L(
    "Yozuvda uch had bor. Kvadratlar ayirmasida nechta had bo'ladi?",
    'В записи три члена. Сколько членов в разности квадратов?',
    'The record has three terms. How many does a difference of squares have?'),
};

export default function D29_04(props) { return <TapTerms data={DATA} {...props} />; }
