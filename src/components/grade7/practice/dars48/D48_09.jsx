// Dars48 · Amaliyot 09 — Ikkiga bo'lish tashlab ketilgan · 🔴 · fix · tag: area_fix
// Mexanika: kit.jsx -> TapTerms. Raskladka: 9-o'rin.
// Uchburchak asos 10, balandlik 4: S = 20. Chuqur javob 40 -- ikkiga bo'lish
// tashlab ketilgan.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'area_fix', level: '🔴',
  eyebrow: L('Xato bo\'lak', 'Неверная часть', 'The wrong part'),
  setup: L(
    "Boshqa o'quvchi uchburchak yuzasini hisobladi. Ko'paytirish to'g'ri, oxirgi qadam esa tushib qolgan.",
    'Другой ученик посчитал площадь треугольника. Умножение верное, а последний шаг потерян.',
    'Another pupil found a triangle area. The multiplication is right; the last step went missing.'),
  given: [['asos', '=', '10'], ['balandlik', '=', '4']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  ask: L("NOTO'G'RI bo'lakni belgilang.", 'Отметь НЕВЕРНУЮ часть.', 'Mark the WRONG part.'),
  note: L('Bitta bo\'lak.', 'Одна часть.', 'One part.'),
  parts: [
    { k: 'term', id: 't1', v: '10 · 4 = 40' },
    { k: 'sign', v: '→' },
    { k: 'term', id: 't2', v: 'S = 40' },
  ],
  want: ['t2'],
  correctText: L(
    "To'g'ri. 40 bu to'rtburchak yuzasi. Uchburchak uning yarmi: S = 20.",
    'Верно. 40 это площадь прямоугольника. Треугольник это половина: S = 20.',
    'Correct. 40 is the rectangle area. The triangle is half: S = 20.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('t1') !== -1, text: L(
      "10 · 4 = 40 to'g'ri hisoblangan: xato keyingi qadamda.",
      '10 · 4 = 40 посчитано верно: ошибка на следующем шаге.',
      '10 · 4 = 40 is right: the error is in the next step.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Uchburchak formulasini eslang: oxirida qanday amal turadi?",
      'Вспомни формулу треугольника: какое действие стоит в конце?',
      'Recall the triangle formula: which action comes last?') },
  ],
  wrongText: L(
    "Uchburchak yuzasi to'rtburchakning qanchasi? Formulada oxirgi amal qanday?",
    'Какую часть прямоугольника составляет треугольник? Какое действие в формуле последнее?',
    'What part of a rectangle is a triangle? What is the last step in the formula?'),
};

export default function D48_09(props) { return <TapTerms data={DATA} {...props} />; }
