// Dars34 · Amaliyot 09 — Harfli argument · 🔴 · build · tag: fn_letter_arg
// Mexanika: kit.jsx -> BuildLine. Raskladka: 9-o'rin `build`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): sonlar ikki xonali va manfiy,
// qadamlar soni ikkitadan boshlanadi -- PODXOD_7SINF.md 13-band.
// f(x) = 3x − 5, f(a + 2) = 3(a + 2) − 5 = 3a + 1.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'fn_letter_arg',
  level: '🔴',
  eyebrow: L(
    'Harfli argument',
    'Буквенный аргумент',
    'A letter argument'),
  setup: L(
    "x o'rniga son emas, YOZUV qo'yiladi. Qavs ochilib, o'xshash hadlar ixchamlanadi.",
    'Вместо x подставляется не число, а ЗАПИСЬ. Скобку раскрываем и приводим подобные.',
    'An EXPRESSION replaces x, not a number. Open the bracket and collect like terms.'),
  given: [['f(x) = 3x − 5', ',', 'f(a + 2)']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [
    { id: 'a', label: '3a + 1' },
    { id: 'b', label: '3a − 3' },
    { id: 'c', label: '3a + 6' },
    { id: 'd', label: 'a − 3' },
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
    "To'g'ri. 3(a + 2) − 5 = 3a + 6 − 5 = 3a + 1.",
    'Верно. 3(a + 2) − 5 = 3a + 6 − 5 = 3a + 1.',
    'Correct. 3(a + 2) − 5 = 3a + 6 − 5 = 3a + 1.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('b') !== -1,
      text: L(
        "3a − 3 chiqishi uchun 3 faqat a ga ko'paytirilgan: 3 · 2 = 6 ham qo'shiladi.",
        'Чтобы вышло 3a − 3, тройку умножили только на a: ещё есть 3 · 2 = 6.',
        '3a − 3 multiplies only the a: the 3 · 2 = 6 is missing.'),
    },
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        '3a + 6 -- bu qavs ochilgan holat, lekin −5 hisobga olinmagan.',
        '3a + 6 это раскрытая скобка, но −5 не учли.',
        '3a + 6 opens the bracket but forgets the −5.'),
    },
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        "Koeffitsiyent 3 yo'qolgan: har had 3 ga ko'paytiriladi.",
        'Потерян коэффициент 3: каждый член умножается на 3.',
        'The coefficient 3 is lost: every term is multiplied by 3.'),
    },
  ],
  wrongText: L(
    "x o'rniga (a + 2) ni qavs bilan qo'ying va qavsni to'liq ochib chiqing.",
    'Подставь (a + 2) в скобках и раскрой скобку полностью.',
    'Substitute (a + 2) in brackets and open it fully.'),
};

export default function D34_09(props) { return <BuildLine data={DATA} {...props} />; }
