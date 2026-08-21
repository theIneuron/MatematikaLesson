// Dars26 · Amaliyot 09 — Ikki marta ajratish · 🔴 · build · tag: diff_sq_twice
// Mexanika: kit.jsx -> BuildLine. Raskladka: 9-o'rin.
// 16m⁴ − 81 = (4m² − 9)(4m² + 9) = (2m − 3)(2m + 3)(4m² + 9).
// Birinchi qavs YANA kvadratlar ayirmasi, ikkinchisi esa ajralmaydi.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'diff_sq_twice', level: '🔴',
  eyebrow: L('Ikki marta', 'Дважды', 'Twice'),
  setup: L(
    "Ajratgandan keyin birinchi qavs yana kvadratlar ayirmasi bo'lib chiqadi. Yig'indi esa ajralmaydi -- u shu holda qoladi.",
    'После разложения первая скобка снова оказывается разностью квадратов. А сумма не разлагается — она остаётся как есть.',
    'After the first split the first bracket is again a difference of squares. The sum does not split and stays as it is.'),
  expr: ['16m⁴', '−', '81'], exprSize: 32,
  cards: [
    { id: 'a', label: '(2m − 3)' },
    { id: 'b', label: '(2m + 3)' },
    { id: 'c', label: '(4m² + 9)' },
    { id: 'd', label: '(4m² − 9)' },
    { id: 'e', label: '(2m − 9)' },
  ],
  answerSeq: ['a', 'b', 'c'],
  empty: L("Oxirigacha ajratib yozing", 'Разложи до конца', 'Factorise it fully'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 16m⁴ − 81 = (4m² − 9)(4m² + 9), keyin 4m² − 9 = (2m − 3)(2m + 3). Yig'indi ajralmaydi.",
    'Верно. 16m⁴ − 81 = (4m² − 9)(4m² + 9), потом 4m² − 9 = (2m − 3)(2m + 3). Сумма не разлагается.',
    'Correct. 16m⁴ − 81 = (4m² − 9)(4m² + 9), then 4m² − 9 = (2m − 3)(2m + 3). The sum stays.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "4m² − 9 ni ham ajratish mumkin: u kvadratlar ayirmasi, (2m − 3)(2m + 3).",
      '4m² − 9 тоже разлагается: это разность квадратов, (2m − 3)(2m + 3).',
      '4m² − 9 splits too: it is a difference of squares, (2m − 3)(2m + 3).') },
    { when: (s) => s.seq.indexOf('e') !== -1, text: L(
      "9 ning ildizi 3: qavsda 3 turadi, 9 emas.",
      'Корень из 9 это 3: в скобке стоит 3, а не 9.',
      'The root of 9 is 3: the bracket holds 3, not 9.') },
    { when: (s) => s.seq.length < 3, text: L(
      "Javobda uch ko'paytuvchi bo'ladi: ikki qavs ayirmadan, bitta yig'indi.",
      'В ответе три множителя: две скобки из разности и одна сумма.',
      'The answer has three factors: two from the difference and the sum.') },
  ],
  wrongText: L(
    "16m⁴ nimaning kvadrati? Ajratgandan keyin qavslarni yana ko'ring: qaysi biri kvadratlar ayirmasi?",
    'Квадрат чего такое 16m⁴? После разложения снова посмотри на скобки: какая из них разность квадратов?',
    '16m⁴ is the square of what? After splitting look again: which bracket is a difference of squares?'),
};

export default function D26_09(props) { return <BuildLine data={DATA} {...props} />; }
