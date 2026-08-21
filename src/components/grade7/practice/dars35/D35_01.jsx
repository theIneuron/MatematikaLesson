// Dars35 · Amaliyot 01 — Qiymatni topish · 🟢 · build · tag: lin_value
// Mexanika: kit.jsx -> BuildLine. Raskladka: 35-dars, 1-o'rin.
// y = 3x − 2, x = 2 -> y = 4.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'lin_value', level: '🟢',
  eyebrow: L('Chiziqli funksiya', 'Линейная функция', 'A linear function'),
  setup: L(
    "Chiziqli funksiyada ikki son bor: x oldidagi k va ozod had b. Qiymat topish uchun x qo'yiladi.",
    'В линейной функции два числа: k перед x и свободный член b. Чтобы найти значение, подставляется x.',
    'A linear function has two numbers: k before x and the free term b. Substitute x to get the value.'),
  given: [['y', '=', '3x', '−', '2']],
  givenLabel: L('Formula:', 'Формула:', 'The rule:'),
  cards: [
    { id: 'a', label: '3 · 2 − 2' },
    { id: 'b', label: '4' },
    { id: 'c', label: '3 + 2 − 2' },
    { id: 'd', label: '3' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("x = 2 uchun hisoblang", 'Посчитай при x = 2', 'Work it out for x = 2'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 3 · 2 − 2 = 6 − 2 = 4, ya'ni grafikda (2; 4) nuqtasi bor.",
    'Верно. 3 · 2 − 2 = 6 − 2 = 4, значит на графике есть точка (2; 4).',
    'Correct. 3 · 2 − 2 = 6 − 2 = 4, so the graph passes through (2; 4).'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1 || s.seq.indexOf('d') !== -1, text: L(
      "3x bu 3 · x: avval ko'paytirish, keyin ayirish.",
      '3x это 3 · x: сначала умножение, потом вычитание.',
      '3x means 3 · x: multiply first, then subtract.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Ikki bo'lak kerak: hisoblash va natija.",
      'Нужны две части: вычисление и результат.',
      'Two parts are needed: the working and the result.') },
  ],
  wrongText: L(
    "x o'rniga 2 qo'ying: avval 3 ga ko'paytiring, keyin 2 ni ayiring.",
    'Подставь вместо x двойку: сначала умножь на 3, потом вычти 2.',
    'Put 2 in place of x: multiply by 3, then subtract 2.'),
};

export default function D35_01(props) { return <BuildLine data={DATA} {...props} />; }
