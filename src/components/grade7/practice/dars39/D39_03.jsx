// Dars39 · Amaliyot 03 — Yozib hisoblash · 🟢 · build · tag: comb_build
// Mexanika: kit.jsx -> BuildLine. Raskladka: 3-o'rin.
// 5 ta yo'l va 6 ta qaytish yo'li: 5 · 6 = 30 variant.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'comb_build', level: '🟢',
  eyebrow: L("Borish va qaytish", 'Туда и обратно', 'There and back'),
  setup: L(
    "Borish uchun besh yo'l, qaytish uchun olti yo'l. Sayohat ikki qismdan iborat, ya'ni variantlar ko'paytiriladi.",
    'Туда пять дорог, обратно шесть. Поездка состоит из двух частей, значит варианты умножаются.',
    'Five roads out and six back. The trip has two parts, so the counts multiply.'),
  cards: [
    { id: 'a', label: '5 · 6' },
    { id: 'b', label: '30' },
    { id: 'c', label: '5 + 6' },
    { id: 'd', label: '11' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Hisoblab yozing", 'Запиши вычисление', 'Write the working'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 5 · 6 = 30: har borish yo'liga olti qaytish yo'li mos keladi.",
    'Верно. 5 · 6 = 30: каждой дороге туда соответствуют шесть дорог обратно.',
    'Correct. 5 · 6 = 30: each road out pairs with six roads back.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1 || s.seq.indexOf('d') !== -1, text: L(
      "Qo'shish variantlarni birlashtirmaydi: bu yerda ikki tanlov BIRGA amalga oshadi.",
      'Сложение здесь не подходит: два выбора делаются ВМЕСТЕ.',
      'Adding does not fit: the two choices happen TOGETHER.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Ikki bo'lak kerak: hisoblash va natija.",
      'Нужны две части: вычисление и результат.',
      'Two parts are needed: the working and the result.') },
  ],
  wrongText: L(
    "Bitta borish yo'lini tanlab, nechta sayohat chiqadi?",
    'Выбрав одну дорогу туда, сколько получается поездок?',
    'With one road out chosen, how many trips are there?'),
};

export default function D39_03(props) { return <BuildLine data={DATA} {...props} />; }
