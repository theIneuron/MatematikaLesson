// Dars35 · Amaliyot 01 — Manfiy x da qiymat · 🟢 · build · tag: lin_value
// Mexanika: kit.jsx -> BuildLine. Raskladka: 1-o'rin `build`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): k manfiy va kasr bo'ladi,
// savol ikki qadamli -- PODXOD_7SINF.md 13-band.
// y = −4x + 13, x = −3: −4 · (−3) = 12, 12 + 13 = 25.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'lin_value',
  level: '🟢',
  eyebrow: L(
    'Qiymatni topish',
    'Найти значение',
    'Find the value'),
  setup: L(
    "Manfiy x qo'yilganda ikki minus plyus beradi. Qavsni yozib, keyin qo'shish bajariladi.",
    'При подстановке отрицательного x два минуса дают плюс. Пишем скобку, потом складываем.',
    'A negative x turns two minuses into a plus. Write the bracket, then add.'),
  given: [['y = −4x + 13', ',', 'x = −3']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [{ id: 'a', label: '25' }, { id: 'b', label: '1' }, { id: 'c', label: '−25' }],
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
    "To'g'ri. −4 · (−3) = 12, keyin 12 + 13 = 25.",
    'Верно. −4 · (−3) = 12, затем 12 + 13 = 25.',
    'Correct. −4 · (−3) = 12, then 12 + 13 = 25.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('b') !== -1,
      text: L(
        "1 chiqishi uchun −12 + 13 hisoblangan: ikki minus PLYUS beradi, ya'ni +12.",
        'Чтобы вышло 1, считали −12 + 13: два минуса дают ПЛЮС, то есть +12.',
        '1 comes from −12 + 13, but two minuses give a PLUS: +12.'),
    },
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        "−25 chiqishi uchun ikki hadning ham ishorasi almashgan. +13 o'z joyida qoladi.",
        'Чтобы вышло −25, поменяли знак у обоих членов. А +13 остаётся на месте.',
        '−25 flips both terms. The +13 stays as it is.'),
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
    "−4 ni (−3) ga ko'paytiring, keyin 13 ni qo'shing.",
    'Умножь −4 на (−3), потом прибавь 13.',
    'Multiply −4 by (−3), then add 13.'),
};

export default function D35_01(props) { return <BuildLine data={DATA} {...props} />; }
