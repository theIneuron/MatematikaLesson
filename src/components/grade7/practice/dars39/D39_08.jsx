// Dars39 · Amaliyot 08 — Takrorsiz yozuv · 🔴 · bracket · tag: comb_no_repeat
// Mexanika: kit.jsx -> BuildLine. Raskladka: 8-o'rin `bracket`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): manfiy va kasr koeffitsiyent,
// ikki qadamli savol, yaqin tuzoq -- PODXOD_7SINF.md 13-band.
// Besh kishidan uchtasini navbat bilan tanlash: 5 · 4 · 3 = 60. Har qadamda variant bittaga kamayadi.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'comb_no_repeat',
  level: '🔴',
  eyebrow: L(
    'Takrorsiz yozuv',
    'Запись без повторений',
    'The no-repeat record'),
  setup: L(
    "Besh kishidan uchtasi navbat bilan tanlanadi. Tanlangan odam qaytib tanlanmaydi, ya'ni har qadamda variant kamayadi. Hisob yozuvini yig'ing.",
    'Из пяти человек по очереди выбирают трёх. Выбранный больше не участвует, значит на каждом шаге вариантов меньше. Собери запись вычисления.',
    'Three of five people are chosen in turn. A chosen one drops out, so options shrink each step. Build the computation.'),
  cards: [
    { id: 'a', label: '5 · 4 · 3' },
    { id: 'b', label: '= 60' },
    { id: 'c', label: '5 · 5 · 5' },
    { id: 'd', label: '= 125' },
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
    "To'g'ri. 5 · 4 · 3 = 60: har qadamda bitta odam kamayadi.",
    'Верно. 5 · 4 · 3 = 60: на каждом шаге на одного человека меньше.',
    'Correct. 5 · 4 · 3 = 60: one person fewer at each step.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('c') !== -1 || s.seq.indexOf('d') !== -1,
      text: L(
        "5 · 5 · 5 -- takrorlash mumkin bo'lgan holat. Odam ikki marta tanlanmaydi.",
        '5 · 5 · 5 это случай с повторениями. Человека дважды не выбирают.',
        '5 · 5 · 5 allows repeats, yet a person is not chosen twice.'),
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
    'Ikkinchi qadamda nechta odam qoladi?',
    'Сколько человек остаётся на втором шаге?',
    'How many people remain at the second step?'),
};

export default function D39_08(props) { return <BuildLine data={DATA} {...props} />; }
