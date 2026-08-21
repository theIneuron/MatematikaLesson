// Dars29 · Amaliyot 01 — Uch qadam · 🟢 · order · tag: fact_order
// Mexanika: kit.jsx -> BuildLine (tartib muhim). Raskladka: 29-dars, 1-o'rin.
// 25 − b² = 5² − b² = (5 − b)(5 + b).
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'fact_order', level: '🟢',
  eyebrow: L('Uch qadam', 'Три шага', 'Three steps'),
  setup: L(
    "Ajratish uch qadamda boradi: sonni kvadrat ko'rinishida yozish, formulani tanish, ikki qavsni yozish.",
    'Разложение идёт в три шага: записать число как квадрат, узнать формулу, написать две скобки.',
    'Factorising takes three steps: write the number as a square, recognise the formula, write two brackets.'),
  expr: ['25', '−', 'b²'], exprSize: 34,
  cards: [
    { id: 'a', label: '5² − b²' },
    { id: 'b', label: '(5 − b)(5 + b)' },
    { id: 'c', label: '25 − b' },
    { id: 'd', label: '(5 − b)²' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Qadamlarni tartib bilan qo'ying", 'Поставь шаги по порядку', 'Place the steps in order'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 25 = 5², ya'ni kvadratlar ayirmasi: (5 − b)(5 + b).",
    'Верно. 25 = 5², значит это разность квадратов: (5 − b)(5 + b).',
    'Correct. 25 = 5², so it is a difference of squares: (5 − b)(5 + b).'),
  wrongs: [
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "(5 − b)² ochilsa o'rta had paydo bo'ladi: 25 − 10b + b². Bizda esa o'rta had yo'q.",
      'Раскрытие (5 − b)² даёт средний член: 25 − 10b + b². А у нас его нет.',
      'Opening (5 − b)² gives a middle term: 25 − 10b + b². We have none.') },
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "25 − b bu boshqa yozuv: bizda b KVADRATI turibdi.",
      '25 − b это другая запись: у нас стоит b в КВАДРАТЕ.',
      '25 − b is a different record: ours has b SQUARED.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Ikki qadam kerak: kvadratlar ko'rinishi va ikki qavs.",
      'Нужны два шага: вид квадратов и две скобки.',
      'Two steps are needed: the squares form and the two brackets.') },
  ],
  wrongText: L(
    "25 nimaning kvadrati? Ikki kvadrat ayirmasi qanday ajraladi?",
    'Квадрат чего такое 25? Как раскладывается разность двух квадратов?',
    '25 is the square of what? How does a difference of two squares split?'),
};

export default function D29_01(props) { return <BuildLine data={DATA} {...props} />; }
