// Dars37 · Amaliyot 09 — Necha barobar · 🔴 · build · tag: prop_times
// Mexanika: kit.jsx -> BuildLine. Raskladka: 9-o'rin `build`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): manfiy va kasr koeffitsiyent,
// ikki qadamli savol, yaqin tuzoq -- PODXOD_7SINF.md 13-band.
// Proporsionallikda x uch barobar oshsa y ham uch barobar oshadi: x = 4 da y = 18 -> x = 12 da y = 54.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'prop_times',
  level: '🔴',
  eyebrow: L(
    'Necha barobar',
    'Во сколько раз',
    'How many times'),
  setup: L(
    "To'g'ri proporsionallikda x necha barobar oshsa, y ham shuncha barobar oshadi. Koeffitsiyentni hisoblash SHART emas.",
    'В прямой пропорциональности во сколько раз растёт x, во столько же растёт y. Считать коэффициент НЕ обязательно.',
    'In direct proportion y grows by the same factor as x. The coefficient need NOT be computed.'),
  given: [['x = 4', 'da', 'y = 18', ';', 'x = 12']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [{ id: 'a', label: 'y = 54' }, { id: 'b', label: 'y = 26' }, { id: 'c', label: 'y = 6' }],
  answerSeq: ['a'],
  fieldH: 44,
  ask: L(
    "Kartani bosish uni chiziqqa qo'yadi.",
    'Нажатие на карточку ставит её в строку.',
    'Tapping a card puts it in the line.'),
  empty: L(
    'Kartalarni bosib javobni tuzing',
    'Нажимай карточки и собери ответ',
    'Tap the cards to build the answer'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. 12 : 4 = 3, ya'ni x uch barobar oshdi va y ham: 18 · 3 = 54.",
    'Верно. 12 : 4 = 3, значит x вырос втрое и y тоже: 18 · 3 = 54.',
    'Correct. 12 : 4 = 3, so x tripled and y with it: 18 · 3 = 54.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('b') !== -1,
      text: L(
        "26 chiqishi uchun 18 ga 8 qo'shilgan. Proporsionallikda KO'PAYTIRILADI, qo'shilmaydi.",
        'Чтобы вышло 26, к 18 прибавили 8. В пропорциональности УМНОЖАЮТ, а не прибавляют.',
        '26 adds 8 to 18. Proportion MULTIPLIES rather than adds.'),
    },
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        "6 chiqishi uchun 18 uchga bo'lingan. x OSHDI, ya'ni y ham oshadi.",
        'Чтобы вышло 6, делили 18 на три. x ВЫРОС, значит и y растёт.',
        '6 divides 18 by three. x GREW, so y grows too.'),
    },
    {
      when: (s) => s.seq.length < 1,
      text: L(
        'Bitta karta kerak.',
        'Нужна одна карточка.',
        'One card is needed.'),
    },
  ],
  wrongText: L(
    'x necha barobar oshdi? Shuncha barobar y ni oshiring.',
    'Во сколько раз вырос x? Во столько же увеличь y.',
    'By what factor did x grow? Grow y by the same.'),
};

export default function D37_09(props) { return <BuildLine data={DATA} {...props} />; }
