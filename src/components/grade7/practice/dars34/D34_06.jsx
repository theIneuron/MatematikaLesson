// Dars34 · Amaliyot 06 — Teskari savol · 🟡 · build · tag: fn_reverse
// Mexanika: kit.jsx -> BuildLine. Raskladka: 6-o'rin `build`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): sonlar ikki xonali va manfiy,
// qadamlar soni ikkitadan boshlanadi -- PODXOD_7SINF.md 13-band.
// f(x) = 4x − 28, f(x) = 0 -> 4x = 28 -> x = 7.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'fn_reverse',
  level: '🟡',
  eyebrow: L(
    'Teskari savol',
    'Обратный вопрос',
    'The reverse question'),
  setup: L(
    "Bu yerda javob berilgan, argument esa so'raladi: f(x) = 0 bo'ladigan x ni toping.",
    'Здесь дано значение, а спрашивают аргумент: найди x, при котором f(x) = 0.',
    'Here the value is given and the argument is asked: find x with f(x) = 0.'),
  given: [['f(x) = 4x − 28', ',', 'f(x) = 0']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [{ id: 'a', label: 'x = 7' }, { id: 'b', label: 'x = −28' }, { id: 'c', label: 'x = 28' }],
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
    "To'g'ri. 4x − 28 = 0, ya'ni 4x = 28 va x = 7.",
    'Верно. 4x − 28 = 0, значит 4x = 28 и x = 7.',
    'Correct. 4x − 28 = 0 gives 4x = 28 and x = 7.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('b') !== -1,
      text: L(
        "−28 bu ozod had. Uni chapdan o'ngga ko'chirganda ishora almashadi, keyin 4 ga bo'linadi.",
        '−28 это свободный член. При переносе он меняет знак, потом делим на 4.',
        '−28 is the constant. Moving it flips the sign, then divide by 4.'),
    },
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        "28 chiqishi uchun 4 ga bo'lish tashlab ketilgan: 28 : 4 = 7.",
        'Чтобы вышло 28, забыли поделить на 4: 28 : 4 = 7.',
        '28 skips the division by 4: 28 : 4 = 7.'),
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
    'Yozuvni nolga tenglashtiring va tenglamani yeching.',
    'Приравняй запись к нулю и решай уравнение.',
    'Set the expression to zero and solve.'),
};

export default function D34_06(props) { return <BuildLine data={DATA} {...props} />; }
