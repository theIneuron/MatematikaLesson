// Dars26 · Amaliyot 05 — Ko'paytuvchilarga ajratish · 🟡 · build · tag: diff_sq_factor
// Mexanika: kit.jsx -> BuildLine. Raskladka: 5-o'rin.
// 100a² − 9 = (10a − 3)(10a + 3). Ikki hadning ham ildizi olinadi:
// 100a² dan 10a, 9 dan 3.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'diff_sq_factor', level: '🟡',
  eyebrow: L("Ko'paytuvchilarga ajratish", 'Разложить на множители', 'Factorise it'),
  setup: L(
    "Ikki had ham kvadrat: 100a² va 9. Har biridan ildiz olinadi va ikki qavs yoziladi -- biri minus, biri plyus bilan.",
    'Оба члена квадраты: 100a² и 9. Из каждого извлекается корень и пишутся две скобки — одна с минусом, другая с плюсом.',
    'Both terms are squares: 100a² and 9. Take the root of each and write two brackets, one with a minus and one with a plus.'),
  expr: ['100a²', '−', '9'], exprSize: 34,
  cards: [
    { id: 'a', label: '(10a − 3)' },
    { id: 'b', label: '(10a + 3)' },
    { id: 'c', label: '(10a − 9)' },
    { id: 'd', label: '(50a + 3)' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Ikki qavsni qo'ying", 'Поставь две скобки', 'Place the two brackets'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 100a² = (10a)² va 9 = 3². Ya'ni (10a − 3)(10a + 3).",
    'Верно. 100a² = (10a)² и 9 = 3². Значит (10a − 3)(10a + 3).',
    'Correct. 100a² = (10a)² and 9 = 3². So (10a − 3)(10a + 3).'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "9 ning o'zi emas, ildizi yoziladi: 9 = 3², ya'ni qavsda 3 turadi.",
      'В скобку пишется не 9, а её корень: 9 = 3², значит стоит 3.',
      'The bracket takes the root, not the 9: 9 = 3², so 3 stands there.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "100a² ning ildizi 10a: 10 · 10 = 100. 50a esa kvadratga ko'tarilsa 2500a² beradi.",
      'Корень из 100a² это 10a: 10 · 10 = 100. А 50a в квадрате даёт 2500a².',
      'The root of 100a² is 10a: 10 · 10 = 100. But 50a squared gives 2500a².') },
    { when: (s) => s.seq.length < 2, text: L(
      "Javob ikki qavsdan iborat: biri minus, biri plyus bilan.",
      'Ответ состоит из двух скобок: одна с минусом, другая с плюсом.',
      'The answer has two brackets: one with a minus, one with a plus.') },
  ],
  wrongText: L(
    "Har haddan ildiz oling: nimaning kvadrati 100a², nimaning kvadrati 9?",
    'Извлеки корни: чей квадрат 100a² и чей 9?',
    'Take the roots: 100a² is the square of what, and 9?'),
};

export default function D26_05(props) { return <BuildLine data={DATA} {...props} />; }
