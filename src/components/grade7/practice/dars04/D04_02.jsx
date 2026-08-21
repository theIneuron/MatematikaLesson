// Dars04 · Amaliyot 02 — Rad etuvchi son · 🟢 · bracket · tag: id_refute
// Mexanika: kit.jsx -> BuildLine (qavs kartalari). Raskladka: 2-o'rin.
// (a + b)² va a² + b² teng emas: a = 1, b = 1 da 4 va 2 chiqadi.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'id_refute', level: '🟢',
  eyebrow: L('Rad etish', 'Опровержение', 'Refuting'),
  setup: L(
    "Ikki yozuv teng emasligini ko'rsatish uchun BITTA son yetadi. a = 1 va b = 1 ni qo'yib ikki qiymatni solishtiring.",
    'Чтобы показать неравенство двух записей, достаточно ОДНОГО числа. Подставь a = 1 и b = 1 и сравни значения.',
    'Refuting an identity needs just ONE number. Put a = 1 and b = 1 and compare.'),
  given: [['(a + b)²', 'va', 'a² + b²']],
  givenLabel: L('Yozuvlar:', 'Записи:', 'Records:'),
  cards: [
    { id: 'a', label: '(1 + 1)² = 4' },
    { id: 'b', label: '1² + 1² = 2' },
    { id: 'c', label: '(1 + 1)² = 2' },
    { id: 'd', label: '1² + 1² = 4' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Ikki qiymatni hisoblang", 'Посчитай два значения', 'Work out both values'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 4 va 2 -- teng emas, ya'ni yozuvlar ayniy teng bo'lolmaydi. Bitta son rad etish uchun yetdi.",
    'Верно. 4 и 2 не равны, значит записи не тождественны. Одного числа хватило для опровержения.',
    'Correct. 4 and 2 differ, so the records are not identical. One number sufficed to refute.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "(1 + 1)² = 2² = 4, 2 emas: avval qavs ichi hisoblanadi, keyin kvadratga ko'tariladi.",
      '(1 + 1)² = 2² = 4, а не 2: сначала считается скобка, потом возводится в квадрат.',
      '(1 + 1)² = 2² = 4, not 2: the bracket comes first, then the square.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "1² + 1² = 1 + 1 = 2, 4 emas.",
      '1² + 1² = 1 + 1 = 2, а не 4.',
      '1² + 1² = 1 + 1 = 2, not 4.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Ikki qiymat kerak: har yozuv uchun bittasi.",
      'Нужны два значения: по одному на каждую запись.',
      'Two values are needed: one per record.') },
  ],
  wrongText: L(
    "Har yozuvga a = 1 va b = 1 ni qo'ying va alohida hisoblang.",
    'Подставь a = 1 и b = 1 в каждую запись и посчитай отдельно.',
    'Put a = 1 and b = 1 into each record and work them out separately.'),
};

export default function D04_02(props) { return <BuildLine data={DATA} {...props} />; }
