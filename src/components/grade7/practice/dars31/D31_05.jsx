// Dars31 · Amaliyot 05 — Son oldinda · 🟡 · build · tag: cube_num_first
// Mexanika: kit.jsx -> BuildLine. Raskladka: 5-o'rin.
// 27 + t³ = (3 + t)(9 − 3t + t²). Tartib teskari bo'lsa ham qoida o'sha.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'cube_num_first', level: '🟡',
  eyebrow: L('Son oldinda', 'Число впереди', 'Number first'),
  setup: L(
    "Yozuvda son oldinda turadi, lekin bu formulaga ta'sir qilmaydi: asoslar 3 va t.",
    'В записи число стоит впереди, но на формулу это не влияет: основания 3 и t.',
    'The number comes first here, but that does not change the formula: the bases are 3 and t.'),
  expr: ['27', '+', 't³'], exprSize: 34,
  cards: [
    { id: 'a', label: '(3 + t)' },
    { id: 'b', label: '(9 − 3t + t²)' },
    { id: 'c', label: '(3 − t)' },
    { id: 'd', label: '(9 + 3t + t²)' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Ikki ko'paytuvchini qo'ying", 'Поставь два множителя', 'Place the two factors'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 27 = 3³, ya'ni (3 + t)(9 − 3t + t²): yig'indi uchun to'liqsiz kvadratda minus.",
    'Верно. 27 = 3³, значит (3 + t)(9 − 3t + t²): для суммы в неполном квадрате минус.',
    'Correct. 27 = 3³, so (3 + t)(9 − 3t + t²): for a sum the incomplete square takes a minus.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "Yozuvda yig'indi turibdi, ya'ni birinchi qavs ham yig'indi: (3 + t).",
      'В записи сумма, значит и первая скобка сумма: (3 + t).',
      'The record is a sum, so the first bracket is a sum too: (3 + t).') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "Ishoralar qarama-qarshi: yig'indi uchun to'liqsiz kvadratda minus bo'ladi.",
      'Знаки противоположны: для суммы в неполном квадрате минус.',
      'The signs are opposite: for a sum the incomplete square takes a minus.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Javob ikki qavsdan iborat.",
      'Ответ состоит из двух скобок.',
      'The answer has two brackets.') },
  ],
  wrongText: L(
    "Asoslarni toping: 27 va t³ nimaning kubi? Keyin ishoralarni qo'ying.",
    'Найди основания: куб чего такое 27 и t³? Потом расставь знаки.',
    'Find the bases: 27 and t³ are cubes of what? Then set the signs.'),
};

export default function D31_05(props) { return <BuildLine data={DATA} {...props} />; }
