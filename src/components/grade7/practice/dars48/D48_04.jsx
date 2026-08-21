// Dars48 · Amaliyot 04 — Uchburchak yuzasi · 🟡 · build · tag: area_tri
// Mexanika: kit.jsx -> BuildLine. Raskladka: 4-o'rin.
// Asos 10, balandlik 6: S = 10 · 6 : 2 = 30.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'area_tri', level: '🟡',
  eyebrow: L('Uchburchak yuzasi', 'Площадь треугольника', 'Triangle area'),
  setup: L(
    "Asos va balandlik ko'paytiriladi, keyin ikkiga bo'linadi. Ikkiga bo'lishni tashlab ketish -- eng ko'p uchraydigan xato.",
    'Основание и высота перемножаются, потом делятся на два. Забыть деление на два — самая частая ошибка.',
    'Multiply base by height, then halve. Forgetting the halving is the most common slip.'),
  given: [['asos', '=', '10'], ['balandlik', '=', '6']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  cards: [
    { id: 'a', label: '10 · 6 : 2' },
    { id: 'b', label: '30' },
    { id: 'c', label: '10 · 6' },
    { id: 'd', label: '60' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Hisoblab yozing", 'Запиши вычисление', 'Write the working'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 10 · 6 = 60, keyin 60 : 2 = 30.",
    'Верно. 10 · 6 = 60, потом 60 : 2 = 30.',
    'Correct. 10 · 6 = 60, then 60 : 2 = 30.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1 || s.seq.indexOf('d') !== -1, text: L(
      "60 bu TO'RTBURCHAK yuzasi. Uchburchak uning yarmi: 30.",
      '60 это площадь ПРЯМОУГОЛЬНИКА. Треугольник это его половина: 30.',
      '60 is the RECTANGLE area. The triangle is half: 30.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Ikki bo'lak kerak: hisoblash va natija.",
      'Нужны две части: вычисление и результат.',
      'Two parts are needed: the working and the result.') },
  ],
  wrongText: L(
    "Asos va balandlikni ko'paytiring, keyin ikkiga bo'lishni unutmang.",
    'Умножь основание на высоту и не забудь разделить на два.',
    'Multiply base by height and remember to halve.'),
};

export default function D48_04(props) { return <BuildLine data={DATA} {...props} />; }
