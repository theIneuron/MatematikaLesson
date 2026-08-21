// Dars34 · Amaliyot 04 — Kvadratli funksiya · 🟡 · build · tag: fn_square
// Mexanika: kit.jsx -> BuildLine. Raskladka: 4-o'rin.
// f(x) = x² − 1, f(4) = 4² − 1 = 15.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'fn_square', level: '🟡',
  eyebrow: L('Kvadrat bilan', 'С квадратом', 'With a square'),
  setup: L(
    "Formulada daraja bor: avval kvadrat hisoblanadi, keyin ayirish. Amallar tartibi o'zgarmaydi.",
    'В формуле есть степень: сначала квадрат, потом вычитание. Порядок действий не меняется.',
    'The rule has a power: square first, then subtract. The order of operations holds.'),
  given: [['f(x)', '=', 'x²', '−', '1']],
  givenLabel: L('Formula:', 'Формула:', 'The rule:'),
  cards: [
    { id: 'a', label: '4² − 1' },
    { id: 'b', label: '15' },
    { id: 'c', label: '2 · 4 − 1' },
    { id: 'd', label: '7' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("f(4) ni hisoblab yozing", 'Запиши вычисление f(4)', 'Write out f(4)'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. f(4) = 4² − 1 = 16 − 1 = 15.",
    'Верно. f(4) = 4² − 1 = 16 − 1 = 15.',
    'Correct. f(4) = 4² − 1 = 16 − 1 = 15.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1 || s.seq.indexOf('d') !== -1, text: L(
      "x² bu x · x, 2 · x emas. 4² = 16, ya'ni javob 15.",
      'x² это x · x, а не 2 · x. 4² = 16, значит ответ 15.',
      'x² means x · x, not 2 · x. 4² = 16, so the answer is 15.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Ikki bo'lak kerak: hisoblash va natija.",
      'Нужны две части: вычисление и результат.',
      'Two parts are needed: the working and the result.') },
  ],
  wrongText: L(
    "4² nechchi? Keyin undan birni ayiring.",
    'Чему равно 4²? Потом вычти единицу.',
    'What is 4²? Then take one away.'),
};

export default function D34_04(props) { return <BuildLine data={DATA} {...props} />; }
