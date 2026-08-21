// Dars27 · Amaliyot 04 — Uchinchi hadda xato · 🟡 · fix · tag: cube_fix
// Mexanika: kit.jsx -> TapTerms. Raskladka: 4-o'rin.
// Chuqur yechim: (n + 2)³ = n³ + 6n² + 6n + 8
//   n³, 6n², 8 TO'G'RI; 6n NOTO'G'RI: 3 · n · 2² = 12n.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'cube_fix', level: '🟡',
  eyebrow: L('Xato had', 'Неверный член', 'The wrong term'),
  setup: L(
    "Boshqa o'quvchi kubni ochdi. Uch had to'g'ri, bittasida esa ikkinchi son kvadratga ko'tarilmagan.",
    'Другой ученик раскрыл куб. Три члена верные, а в одном второе число не возведено в квадрат.',
    'Another pupil expanded the cube. Three terms are right; in one the second number was not squared.'),
  given: [['(n', '+', '2)³']],
  givenLabel: L('Masala:', 'Задание:', 'The task:'),
  ask: L("Javobdagi NOTO'G'RI hadni belgilang.", 'Отметь НЕВЕРНЫЙ член в ответе.', 'Mark the WRONG term in the answer.'),
  note: L('Bitta had.', 'Один член.', 'One term.'),
  parts: [
    { k: 'term', id: 't1', v: 'n³' },
    { k: 'sign', v: '+' },
    { k: 'term', id: 't2', v: '6n²' },
    { k: 'sign', v: '+' },
    { k: 'term', id: 't3', v: '6n' },
    { k: 'sign', v: '+' },
    { k: 'term', id: 't4', v: '8' },
  ],
  want: ['t3'],
  correctText: L(
    "To'g'ri. Uchinchi had 3 · n · 2² = 12n: bu yerda ikki KVADRATGA ko'tariladi. Javob n³ + 6n² + 12n + 8.",
    'Верно. Третий член 3 · n · 2² = 12n: здесь двойка возводится в КВАДРАТ. Ответ n³ + 6n² + 12n + 8.',
    'Correct. The third term is 3 · n · 2² = 12n: the two is SQUARED there. The answer is n³ + 6n² + 12n + 8.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('t2') !== -1, text: L(
      "6n² to'g'ri: 3 · n² · 2 = 6n².",
      '6n² верно: 3 · n² · 2 = 6n².',
      '6n² is right: 3 · n² · 2 = 6n².') },
    { when: (s) => s.extra.indexOf('t4') !== -1, text: L(
      "8 ham to'g'ri: 2³ = 8.",
      '8 тоже верно: 2³ = 8.',
      '8 is right too: 2³ = 8.') },
    { when: (s) => s.extra.indexOf('t1') !== -1, text: L(
      "n³ to'g'ri: birinchi had har doim kub bo'ladi.",
      'n³ верно: первый член всегда куб.',
      'n³ is right: the first term is always the cube.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Uchinchi hadni hisoblang: 3 · n · 2² nechchi?",
      'Посчитай третий член: чему равно 3 · n · 2²?',
      'Work out the third term: what is 3 · n · 2²?') },
  ],
  wrongText: L(
    "Har hadda ikkinchi sonning darajasi ortadi: 2⁰, 2¹, 2², 2³. Qaysi hadda bu buzilgan?",
    'В каждом члене степень второго числа растёт: 2⁰, 2¹, 2², 2³. Где это нарушено?',
    'The power of the second number grows: 2⁰, 2¹, 2², 2³. Where is that broken?'),
};

export default function D27_04(props) { return <TapTerms data={DATA} {...props} />; }
