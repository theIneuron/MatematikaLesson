// Dars34 · Amaliyot 04 — Ikki hadli funksiya · 🟡 · build · tag: fn_two_terms
// Mexanika: kit.jsx -> BuildLine. Raskladka: 4-o'rin `build`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): sonlar ikki xonali va manfiy,
// qadamlar soni ikkitadan boshlanadi -- PODXOD_7SINF.md 13-band.
// f(x) = x² − 4x, f(−3) = 9 + 12 = 21. Ikki joyda ham manfiy son qo'yiladi.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'fn_two_terms',
  level: '🟡',
  eyebrow: L(
    'Ikki had',
    'Два члена',
    'Two terms'),
  setup: L(
    "Manfiy son ikki joyga ham qo'yiladi. Kvadrat musbat chiqadi, ikkinchi hadda esa ikki minus plyus beradi.",
    'Отрицательное число подставляется в оба места. Квадрат выходит положительным, а во втором члене два минуса дают плюс.',
    'The negative goes into both places. The square turns positive, and in the second term two minuses make a plus.'),
  given: [['f(x) = x² − 4x', ',', 'x = −3']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [
    { id: 'a', label: '21' },
    { id: 'b', label: '−3' },
    { id: 'c', label: '9' },
    { id: 'd', label: '−21' },
  ],
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
    "To'g'ri. (−3)² = 9, keyin −4 · (−3) = +12, ya'ni 9 + 12 = 21.",
    'Верно. (−3)² = 9, потом −4 · (−3) = +12, значит 9 + 12 = 21.',
    'Correct. (−3)² = 9, then −4 · (−3) = +12, so 9 + 12 = 21.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('b') !== -1,
      text: L(
        '−3 chiqishi uchun 9 − 12 hisoblangan: ikkinchi hadda ikki minus PLYUS beradi.',
        'Чтобы вышло −3, считали 9 − 12: во втором члене два минуса дают ПЛЮС.',
        '−3 comes from 9 − 12, but two minuses in the second term give a PLUS.'),
    },
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        '9 bu faqat kvadrat. Ikkinchi had ham hisobga olinadi.',
        '9 это только квадрат. Второй член тоже учитывается.',
        '9 is only the square. The second term counts too.'),
    },
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        "Kvadrat manfiy bo'lmaydi: (−3)² = +9.",
        'Квадрат не бывает отрицательным: (−3)² = +9.',
        'A square is never negative: (−3)² = +9.'),
    },
  ],
  wrongText: L(
    "Avval kvadratni hisoblang, keyin −4 ni manfiy songa ko'paytiring.",
    'Сначала посчитай квадрат, потом умножь −4 на отрицательное число.',
    'Compute the square first, then multiply −4 by the negative number.'),
};

export default function D34_04(props) { return <BuildLine data={DATA} {...props} />; }
