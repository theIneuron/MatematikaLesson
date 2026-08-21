// Dars26 · Amaliyot 10 — Formula almashib ketgan · 🔴 · fix · tag: diff_sq_fix
// Mexanika: kit.jsx -> TapTerms. Raskladka: 10-o'rin.
// Chuqur yechim: 25y² − 36 = (5y)² − 6² = (5y − 6)²
//   (5y)² TO'G'RI, 6² TO'G'RI, oxirgi qadam NOTO'G'RI: kvadrat emas,
//   (5y − 6)(5y + 6) bo'lishi kerak.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'diff_sq_fix', level: '🔴',
  eyebrow: L('Xato qadam', 'Неверный шаг', 'The wrong step'),
  setup: L(
    "Boshqa o'quvchi ikki qadamni to'g'ri qildi, uchinchisida esa formulani almashtirib yubordi. Ayirma kvadratga aylanib qolgan.",
    'Другой ученик сделал два шага верно, а на третьем перепутал формулу. Разность превратилась в квадрат.',
    'Another pupil got two steps right, then mixed up the formula: the difference turned into a square.'),
  given: [['25y²', '−', '36']],
  givenLabel: L('Masala:', 'Задание:', 'The task:'),
  ask: L("NOTO'G'RI qadamni belgilang.", 'Отметь НЕВЕРНЫЙ шаг.', 'Mark the WRONG step.'),
  note: L('Bitta qadam.', 'Один шаг.', 'One step.'),
  parts: [
    { k: 'term', id: 't1', v: '(5y)²' },
    { k: 'sign', v: '−' },
    { k: 'term', id: 't2', v: '6²' },
    { k: 'sign', v: '=' },
    { k: 'term', id: 't3', v: '(5y − 6)²' },
  ],
  want: ['t3'],
  correctText: L(
    "To'g'ri. Kvadratlar ayirmasi ikki QARAMA-QARSHI qavsga ajraladi: (5y − 6)(5y + 6). Kvadrat esa boshqa formula.",
    'Верно. Разность квадратов раскладывается на две ПРОТИВОПОЛОЖНЫЕ скобки: (5y − 6)(5y + 6). А квадрат это другая формула.',
    'Correct. A difference of squares splits into two OPPOSITE brackets: (5y − 6)(5y + 6). A square is another formula.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('t1') !== -1, text: L(
      "(5y)² to'g'ri: 25y² = 5² · y².",
      '(5y)² верно: 25y² = 5² · y².',
      '(5y)² is right: 25y² = 5² · y².') },
    { when: (s) => s.extra.indexOf('t2') !== -1, text: L(
      "6² ham to'g'ri: 36 = 6 · 6.",
      '6² тоже верно: 36 = 6 · 6.',
      '6² is right too: 36 = 6 · 6.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Oxirgi qadamni tekshiring: (5y − 6)² ochilsa o'rta had paydo bo'ladi, bizda esa u yo'q.",
      'Проверь последний шаг: раскрытие (5y − 6)² даёт средний член, а у нас его нет.',
      'Check the last step: opening (5y − 6)² gives a middle term, but we have none.') },
  ],
  wrongText: L(
    "Har qadamni asl yozuv bilan solishtiring. Kvadratni ochsa nima chiqadi?",
    'Сверь каждый шаг с исходной записью. Что выйдет, если раскрыть квадрат?',
    'Compare each step with the original. What comes out if you expand the square?'),
};

export default function D26_10(props) { return <TapTerms data={DATA} {...props} />; }
