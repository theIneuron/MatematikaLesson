// Dars30 · Amaliyot 10 — Ishorada xato · 🔴 · fix · tag: whole_fix
// Mexanika: kit.jsx -> TapTerms. Raskladka: 10-o'rin.
// Chuqur yechim: 4 − 2(x − 3) = 4 − 2x − 6
//   4 va −2x TO'G'RI, −6 NOTO'G'RI: −2 · (−3) = +6.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'whole_fix', level: '🔴',
  eyebrow: L('Xato had', 'Неверный член', 'The wrong term'),
  setup: L(
    "Boshqa o'quvchi qavsni ochdi. Ikki had to'g'ri, bittasida esa ikki minus hisobga olinmagan.",
    'Другой ученик раскрыл скобку. Два члена верные, а в одном не учтены два минуса.',
    'Another pupil opened the bracket. Two terms are right; one ignores the two minuses.'),
  given: [['4', '−', '2(x', '−', '3)']],
  givenLabel: L('Masala:', 'Задание:', 'The task:'),
  ask: L("NOTO'G'RI hadni belgilang.", 'Отметь НЕВЕРНЫЙ член.', 'Mark the WRONG term.'),
  note: L('Bitta had.', 'Один член.', 'One term.'),
  parts: [
    { k: 'term', id: 't1', v: '4' },
    { k: 'sign', v: '−' },
    { k: 'term', id: 't2', v: '2x' },
    { k: 'sign', v: '−' },
    { k: 'term', id: 't3', v: '6' },
  ],
  want: ['t3'],
  correctText: L(
    "To'g'ri. −2 · (−3) = +6, ya'ni oxirgi had musbat. Javob 4 − 2x + 6 = 10 − 2x.",
    'Верно. −2 · (−3) = +6, значит последний член положительный. Ответ 4 − 2x + 6 = 10 − 2x.',
    'Correct. −2 · (−3) = +6, so the last term is positive. The answer is 4 − 2x + 6 = 10 − 2x.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('t1') !== -1, text: L(
      "4 o'zgarmaydi: u qavs tashqarisida turadi.",
      '4 не меняется: оно стоит вне скобки.',
      'The 4 stays: it is outside the bracket.') },
    { when: (s) => s.extra.indexOf('t2') !== -1, text: L(
      "−2x to'g'ri: −2 · x = −2x, bir minus.",
      '−2x верно: −2 · x = −2x, один минус.',
      '−2x is right: −2 · x = −2x, one minus.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Oxirgi hadni tekshiring: −2 ni (−3) ga ko'paytirsa qanday ishora chiqadi?",
      'Проверь последний член: какой знак даёт −2, умноженное на (−3)?',
      'Check the last term: what sign does −2 times (−3) give?') },
  ],
  wrongText: L(
    "Har hadda minuslar sonini sanang: ikki minus musbat beradi.",
    'Посчитай минусы в каждом члене: два минуса дают плюс.',
    'Count the minuses in each term: two minuses give a plus.'),
};

export default function D30_10(props) { return <TapTerms data={DATA} {...props} />; }
