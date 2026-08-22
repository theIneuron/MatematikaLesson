// Dars42 · Amaliyot 09 — Harf bilan moslik · 🔴 · build · tag: eq_letter
// Mexanika: kit.jsx -> BuildLine. Raskladka: 9-o'rin `build`.
// Teng uchburchaklarda AB = 3x, A₁B₁ = 2x + 7 -> x = 7, AB = 21.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'eq_letter',
  level: '🔴',
  eyebrow: L(
    'Harf bilan',
    'С буквой',
    'With a letter'),
  setup: L(
    "Mos tomonlar teng, ya'ni ikki yozuvni tenglashtirish mumkin. Ikki javob kerak: x va tomonning uzunligi.",
    'Соответственные стороны равны, значит две записи можно приравнять. Нужны два ответа: x и длина стороны.',
    'Matching sides are equal, so the expressions can be set equal. Two answers: x and the side length.'),
  given: [['AB = 3x', ',', 'A₁B₁ = 2x + 7']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [
    { id: 'a', label: 'x = 7' },
    { id: 'b', label: 'AB = 21' },
    { id: 'c', label: 'x = 1,4' },
    { id: 'd', label: 'AB = 14' },
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
    "To'g'ri. 3x = 2x + 7 dan x = 7, ya'ni AB = 3 · 7 = 21.",
    'Верно. Из 3x = 2x + 7 следует x = 7, значит AB = 3 · 7 = 21.',
    'Correct. 3x = 2x + 7 gives x = 7, so AB = 3 · 7 = 21.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        "1,4 chiqishi uchun 7 ni 5x ga bo'lgan. Tenglamada x lar AYIRILADI: 3x − 2x = x.",
        'Чтобы вышло 1,4, делили 7 на 5x. В уравнении иксы ВЫЧИТАЮТСЯ: 3x − 2x = x.',
        '1.4 divides 7 by 5x. In the equation the x SUBTRACT: 3x − 2x = x.'),
    },
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        "14 bu 2 · 7, ya'ni 2x ga qo'yilgan va +7 tashlab ketilgan: 2 · 7 + 7 = 21.",
        '14 это 2 · 7: подставили в 2x и потеряли +7: 2 · 7 + 7 = 21.',
        '14 is 2 · 7, using 2x and dropping the +7: 2 · 7 + 7 = 21.'),
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
    "Mos tomonlarni tenglashtiring, x ni toping, keyin uni 3x ga qo'ying.",
    'Приравняй соответственные стороны, найди x и подставь его в 3x.',
    'Set the matching sides equal, find x, then put it into 3x.'),
};

export default function D42_09(props) { return <BuildLine data={DATA} {...props} />; }
