// Dars39 · Amaliyot 10 — Uch xonali son · 🔴 · build · tag: comb_three_digit
// Mexanika: kit.jsx -> BuildLine. Raskladka: 10-o'rin `build`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): manfiy va kasr koeffitsiyent,
// ikki qadamli savol, yaqin tuzoq -- PODXOD_7SINF.md 13-band.
// 1, 2, 3, 4 raqamlaridan takrorsiz uch xonali son: 4 · 3 · 2 = 24.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'comb_three_digit',
  level: '🔴',
  eyebrow: L(
    'Uch xonali son',
    'Трёхзначное число',
    'A three-digit number'),
  setup: L(
    "To'rt raqamdan takrorsiz uch xonali son tuziladi. Har o'rinda variant bittaga kamayadi.",
    'Из четырёх цифр составляют трёхзначное число без повторений. На каждом месте вариантов на один меньше.',
    'A three-digit number is built from four digits without repeats. Each place has one option fewer.'),
  given: [['1, 2, 3, 4']],
  givenLabel: L(
    'Raqamlar:',
    'Цифры:',
    'Digits:'),
  cards: [{ id: 'a', label: '24' }, { id: 'b', label: '64' }, { id: 'c', label: '12' }],
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
    "To'g'ri. 4 · 3 · 2 = 24.",
    'Верно. 4 · 3 · 2 = 24.',
    'Correct. 4 · 3 · 2 = 24.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('b') !== -1,
      text: L(
        "64 bu 4 · 4 · 4, ya'ni takrorlash mumkin bo'lgan holat.",
        '64 это 4 · 4 · 4, случай с повторениями.',
        '64 is 4 · 4 · 4, the case with repeats.'),
    },
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        "12 bu 4 · 3, ya'ni IKKI xonali son. Uchinchi o'rin ham bor: 4 · 3 · 2.",
        '12 это 4 · 3, то есть ДВУзначное число. Есть и третье место: 4 · 3 · 2.',
        '12 is 4 · 3, a TWO-digit count. There is a third place: 4 · 3 · 2.'),
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
    "Uch o'rin bor, har qadamda raqam bittaga kamayadi.",
    'Три места, на каждом шаге цифр на одну меньше.',
    'Three places, one digit fewer at each step.'),
};

export default function D39_10(props) { return <BuildLine data={DATA} {...props} />; }
