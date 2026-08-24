// Dars39 · Amaliyot 05 — Takrorlash mumkin · 🟡 · build · tag: comb_repeat
// Mexanika: kit.jsx -> BuildLine. Raskladka: 5-o'rin `build`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): manfiy va kasr koeffitsiyent,
// ikki qadamli savol, yaqin tuzoq -- PODXOD_7SINF.md 13-band.
// 1, 2, 3, 4 raqamlaridan ikki xonali son, raqam takrorlanishi mumkin: 4 · 4 = 16.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'comb_repeat',
  level: '🟡',
  eyebrow: L(
    'Takrorlash mumkin',
    'С повторением',
    'Repeats allowed'),
  setup: L(
    "To'rt raqamdan ikki xonali son tuziladi va raqam TAKRORLANISHI mumkin, ya'ni ikkinchi o'rinda ham to'rt variant qoladi.",
    'Из четырёх цифр составляют двузначное число, и цифра МОЖЕТ повторяться, значит на втором месте тоже четыре варианта.',
    'A two-digit number is built from four digits and repeats ARE allowed, so the second place still has four options.'),
  given: [['1, 2, 3, 4']],
  givenLabel: L(
    'Raqamlar:',
    'Цифры:',
    'Digits:'),
  cards: [{ id: 'a', label: '16' }, { id: 'b', label: '12' }, { id: 'c', label: '8' }],
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
    "To'g'ri. 4 · 4 = 16: har o'rinda to'rt variant.",
    'Верно. 4 · 4 = 16: на каждом месте четыре варианта.',
    'Correct. 4 · 4 = 16: four options in each place.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('b') !== -1,
      text: L(
        "12 bu 4 · 3, ya'ni takrorlash TAQIQLANGAN holat. Bu yerda takrorlash mumkin.",
        '12 это 4 · 3, случай БЕЗ повторений. А здесь повторять можно.',
        '12 is 4 · 3, the no-repeat case. Here repeats are allowed.'),
    },
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        "8 bu 4 + 4. O'rinlar ketma-ket, ya'ni ko'paytiriladi.",
        '8 это 4 + 4. Места идут подряд, значит умножаем.',
        '8 is 4 + 4. The places follow each other, so multiply.'),
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
    "Ikkinchi o'rinda nechta variant qoladi, agar takrorlash mumkin bo'lsa?",
    'Сколько вариантов на втором месте, если повторять можно?',
    'How many options remain in the second place when repeats are allowed?'),
};

export default function D39_05(props) { return <BuildLine data={DATA} {...props} />; }
