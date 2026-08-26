// Dars43 · Amaliyot 08 — Harf bilan tomonlar · 🔴 · build · tag: iso_letter_sides
// Mexanika: kit.jsx -> BuildLine. Raskladka: 8-o'rin `build`.
// Yon tomonlar 2x, asos x + 6, P = 41: 5x + 6 = 41 -> x = 7. Yon tomon 14, asos 13.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'iso_letter_sides',
  level: '🔴',
  eyebrow: L(
    'Harf bilan',
    'С буквой',
    'With a letter'),
  setup: L(
    'Yon tomonlar 2x, asos esa x + 6. Ikki javob kerak: x va asos.',
    'Боковые равны 2x, основание x + 6. Нужны два ответа: x и основание.',
    'The legs are 2x and the base is x + 6. Two answers: x and the base.'),
  given: [['2x, 2x', L('va', 'и', 'and'), 'x + 6', ';', 'P = 41']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [
    { id: 'a', label: 'x = 7' },
    { id: 'b', label: L('asos = 13', 'основание = 13', 'base = 13') },
    { id: 'c', label: 'x = 8,2' },
    { id: 'd', label: L('asos = 14', 'основание = 14', 'base = 14') },
  ],
  answerSeq: ['a', 'b'],
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
    "To'g'ri. 2x + 2x + (x + 6) = 41, ya'ni 5x = 35 va x = 7. Asos 7 + 6 = 13.",
    'Верно. 2x + 2x + (x + 6) = 41, значит 5x = 35 и x = 7. Основание 7 + 6 = 13.',
    'Correct. 2x + 2x + (x + 6) = 41 gives 5x = 35 and x = 7. The base is 7 + 6 = 13.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        "8,2 chiqishi uchun 41 beshga bo'lingan, lekin +6 ayirilmagan: avval 41 − 6 = 35.",
        'Чтобы вышло 8,2, разделили 41 на пять, не вычтя +6: сначала 41 − 6 = 35.',
        '8.2 divides 41 by five without removing the +6: first 41 − 6 = 35.'),
    },
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        '14 bu yon tomon (2 · 7). Asos esa x + 6 = 13.',
        '14 это боковая (2 · 7). А основание x + 6 = 13.',
        '14 is the leg (2 · 7). The base is x + 6 = 13.'),
    },
    {
      when: (s) => s.seq.length < 2,
      text: L(
        'Ikki karta kerak.',
        'Нужны две карточки.',
        'Two cards are needed.'),
    },
  ],
  wrongText: L(
    "Uch tomonni qo'shing: 2x + 2x + (x + 6) = 41.",
    'Сложи три стороны: 2x + 2x + (x + 6) = 41.',
    'Add the three sides: 2x + 2x + (x + 6) = 41.'),
};

export default function D43_08(props) { return <BuildLine data={DATA} {...props} />; }
