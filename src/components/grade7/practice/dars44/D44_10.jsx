// Dars44 · Amaliyot 10 — Asosni topish · 🔴 · build · tag: iso_base_find
// Mexanika: kit.jsx -> BuildLine. Raskladka: 10-o'rin.
// P = 50, yon tomon 15 -> asos 50 − 30 = 20.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'iso_base_find', level: '🔴',
  eyebrow: L('Asosni topish', 'Найти основание', 'Find the base'),
  setup: L(
    "Perimetr va yon tomon ma'lum. Yon tomon ikki marta olinadi, qolgani asos bo'ladi.",
    'Известны периметр и боковая сторона. Боковая берётся дважды, остаток и есть основание.',
    'The perimeter and the leg are known. The leg counts twice; what remains is the base.'),
  given: [['P', '=', '50'], ['yon', '=', '15']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  cards: [
    { id: 'a', label: '50 − 30' },
    { id: 'b', label: '20' },
    { id: 'c', label: '50 − 15' },
    { id: 'd', label: '35' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Hisoblab yozing", 'Запиши вычисление', 'Write the working'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Ikki yon tomon 15 + 15 = 30, asos esa 50 − 30 = 20.",
    'Верно. Две боковые 15 + 15 = 30, а основание 50 − 30 = 20.',
    'Correct. The two legs give 15 + 15 = 30, so the base is 50 − 30 = 20.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1 || s.seq.indexOf('d') !== -1, text: L(
      "Bitta yon tomon ayirilgan. Ular IKKITA: 15 + 15 = 30.",
      'Вычли одну боковую сторону. Их ДВЕ: 15 + 15 = 30.',
      'Only one leg was subtracted. There are TWO: 15 + 15 = 30.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Ikki bo'lak kerak: hisoblash va natija.",
      'Нужны две части: вычисление и результат.',
      'Two parts are needed: the working and the result.') },
  ],
  wrongText: L(
    "Perimetrda uzunligi 15 bo'lgan tomon nechta?",
    'Сколько в периметре сторон длиной 15?',
    'How many sides of length 15 does the perimeter hold?'),
};

export default function D44_10(props) { return <BuildLine data={DATA} {...props} />; }
