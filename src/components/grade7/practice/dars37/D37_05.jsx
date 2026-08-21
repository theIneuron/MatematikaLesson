// Dars37 · Amaliyot 05 — Grafik qayerdan o'tadi · 🟡 · bracket · tag: prop_origin
// Mexanika: kit.jsx -> BuildLine (qavs kartalari). Raskladka: 5-o'rin.
// y = kx grafigi har doim (0; 0) dan o'tadi: x = 0 bo'lganda y = 0.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'prop_origin', level: '🟡',
  eyebrow: L('Grafik qayerdan', 'Откуда график', 'Where the graph starts'),
  setup: L(
    "y = kx da ozod had yo'q, ya'ni x = 0 bo'lganda y ham nol bo'ladi. Bu nuqta hamma proporsionallik grafigida bor.",
    'В y = kx нет свободного члена, значит при x = 0 и y равен нулю. Эта точка есть у любого графика пропорциональности.',
    'y = kx has no free term, so x = 0 gives y = 0. Every proportion graph holds that point.'),
  given: [['y', '=', '8x']],
  givenLabel: L('Formula:', 'Формула:', 'The rule:'),
  cards: [
    { id: 'a', label: '(0;' },
    { id: 'b', label: '0)' },
    { id: 'c', label: '(1;' },
    { id: 'd', label: '8)' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Nuqtaning yozuvini tuzing", 'Составь запись точки', 'Build the point record'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. (0; 0): x = 0 bo'lganda 8 · 0 = 0. Har qanday k uchun shunday.",
    'Верно. (0; 0): при x = 0 выходит 8 · 0 = 0. Так при любом k.',
    'Correct. (0; 0): at x = 0 we get 8 · 0 = 0. True for any k.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1 || s.seq.indexOf('d') !== -1, text: L(
      "(1; 8) ham grafikda yotadi, lekin savol boshqa: grafik doim qaysi nuqtadan o'tadi?",
      '(1; 8) тоже лежит на графике, но вопрос другой: через какую точку график проходит всегда?',
      '(1; 8) does lie on the graph, but the question is which point is always there.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Yozuv ikki bo'lakdan iborat.",
      'Запись состоит из двух частей.',
      'The record has two parts.') },
  ],
  wrongText: L(
    "x = 0 qo'ysangiz y qanday chiqadi?",
    'Что выйдет для y, если подставить x = 0?',
    'What does y become when x = 0?'),
};

export default function D37_05(props) { return <BuildLine data={DATA} {...props} />; }
