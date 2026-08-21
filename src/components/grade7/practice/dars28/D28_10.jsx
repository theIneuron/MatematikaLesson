// Dars28 · Amaliyot 10 — Ajratib yozish · 🔴 · bracket · tag: formula_bracket
// Mexanika: kit.jsx -> BuildLine (qavs kartalari). Raskladka: 10-o'rin.
// 9m² − 4 = (3m − 2)(3m + 2). Formulani teskari tomonga qo'llash.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'formula_bracket', level: '🔴',
  eyebrow: L('Teskari tomonga', 'В обратную сторону', 'The other way round'),
  setup: L(
    "Formula ikki tomonga ishlaydi: qavsni ochish uchun ham, ko'paytuvchilarga ajratish uchun ham. Bu yerda ikkinchi yo'l kerak.",
    'Формула работает в две стороны: и раскрыть скобку, и разложить на множители. Здесь нужен второй путь.',
    'The formula works both ways: expanding and factorising. Here the second way is needed.'),
  expr: ['9m²', '−', '4'], exprSize: 34,
  cards: [
    { id: 'a', label: '(3m − 2)' },
    { id: 'b', label: '(3m + 2)' },
    { id: 'c', label: '(3m − 4)' },
    { id: 'd', label: '(9m − 2)' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Ikki qavsni qo'ying", 'Поставь две скобки', 'Place the two brackets'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 9m² = (3m)² va 4 = 2², ya'ni (3m − 2)(3m + 2).",
    'Верно. 9m² = (3m)² и 4 = 2², значит (3m − 2)(3m + 2).',
    'Correct. 9m² = (3m)² and 4 = 2², so (3m − 2)(3m + 2).'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "4 ning ildizi 2: qavsda 2 turadi, 4 emas.",
      'Корень из 4 это 2: в скобке стоит 2, а не 4.',
      'The root of 4 is 2: the bracket holds 2, not 4.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "9m² ning ildizi 3m: 3 · 3 = 9. 9m esa kvadratga ko'tarilsa 81m² beradi.",
      'Корень из 9m² это 3m: 3 · 3 = 9. А 9m в квадрате даёт 81m².',
      'The root of 9m² is 3m: 3 · 3 = 9. But 9m squared gives 81m².') },
    { when: (s) => s.seq.length < 2, text: L(
      "Javob ikki qavsdan iborat: biri minus, biri plyus bilan.",
      'Ответ состоит из двух скобок: одна с минусом, другая с плюсом.',
      'The answer has two brackets: one with a minus, one with a plus.') },
  ],
  wrongText: L(
    "Har haddan ildiz oling, keyin ikki qavs yozing: biri ayirma, biri yig'indi.",
    'Извлеки корни, потом напиши две скобки: разность и сумму.',
    'Take the roots, then write two brackets: a difference and a sum.'),
};

export default function D28_10(props) { return <BuildLine data={DATA} {...props} />; }
