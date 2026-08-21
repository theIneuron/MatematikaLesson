// Dars04 · Amaliyot 04 — Qavsga olish · 🟡 · bracket · tag: id_group
// Mexanika: kit.jsx -> BuildLine (qavs kartalari). Raskladka: 4-o'rin.
// 7a + 7b = 7(a + b) -- taqsimot xossasi teskari tomonga.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'id_group', level: '🟡',
  eyebrow: L('Teskari tomonga', 'В обратную сторону', 'The other way'),
  setup: L(
    "Taqsimot xossasi ikki tomonga ishlaydi: qavsni ochish uchun ham, umumiy ko'paytuvchini qavsga olish uchun ham.",
    'Распределительное свойство работает в две стороны: и раскрыть скобку, и вынести общий множитель.',
    'The distributive property works both ways: opening a bracket and taking a factor out.'),
  expr: ['7a', '+', '7b'], exprSize: 34,
  cards: [
    { id: 'a', label: '7' },
    { id: 'b', label: '(a + b)' },
    { id: 'c', label: '(7a + b)' },
    { id: 'd', label: '14' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Qavsli ko'rinishni tuzing", 'Собери запись со скобкой', 'Build the bracket form'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 7(a + b) ochilsa 7a + 7b beradi -- ya'ni bu ayniy o'zgartirish.",
    'Верно. Раскрытие 7(a + b) даёт 7a + 7b — это тождественное преобразование.',
    'Correct. Opening 7(a + b) gives 7a + 7b — an identity transformation.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "(7a + b) da yettilik qavs ichida qolib ketgan: umumiy ko'paytuvchi qavs OLDIGA chiqadi.",
      'В (7a + b) семёрка осталась внутри: общий множитель выносится ПЕРЕД скобку.',
      'In (7a + b) the seven stayed inside: the common factor goes OUT FRONT.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "14 bu 7 + 7. Umumiy ko'paytuvchi bir marta chiqariladi.",
      '14 это 7 + 7. Общий множитель выносится один раз.',
      '14 is 7 + 7. The common factor comes out once.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Yozuv ikki bo'lakdan iborat: ko'paytuvchi va qavs.",
      'Запись состоит из двух частей: множитель и скобка.',
      'The record has two parts: the factor and the bracket.') },
  ],
  wrongText: L(
    "Ikki hadda nima umumiy? Uni qavs oldiga chiqaring.",
    'Что общего у двух членов? Вынеси это перед скобку.',
    'What do the two terms share? Take it out front.'),
};

export default function D04_04(props) { return <BuildLine data={DATA} {...props} />; }
