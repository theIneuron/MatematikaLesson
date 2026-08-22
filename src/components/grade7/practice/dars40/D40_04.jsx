// Dars40 · Amaliyot 04 — Vertikal burchaklar va harf · 🟡 · build · tag: ang_vert_letter
// Mexanika: kit.jsx -> BuildLine. Raskladka: 4-o'rin `build`.
// Vertikal burchaklar teng: 5x = 3x + 40 -> 2x = 40 -> x = 20, burchak 5 · 20 = 100°.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'ang_vert_letter',
  level: '🟡',
  eyebrow: L(
    'Vertikal burchaklar',
    'Вертикальные углы',
    'Vertical angles'),
  setup: L(
    "Vertikal burchaklar teng, ya'ni ikki yozuvni tenglashtirish mumkin. Ikki qiymat so'raladi: x va burchakning o'zi.",
    'Вертикальные углы равны, значит две записи можно приравнять. Спрашивают два значения: x и сам угол.',
    'Vertical angles are equal, so the two expressions can be set equal. Two values are asked: x and the angle itself.'),
  given: [['5x', 'va', '3x + 40']],
  givenLabel: L(
    'Vertikal burchaklar:',
    'Вертикальные углы:',
    'Vertical angles:'),
  cards: [
    { id: 'a', label: 'x = 20' },
    { id: 'b', label: 'burchak = 100°' },
    { id: 'c', label: 'x = 40' },
    { id: 'd', label: 'burchak = 60°' },
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
    "To'g'ri. 5x = 3x + 40 dan 2x = 40, x = 20. Burchak 5 · 20 = 100 gradus.",
    'Верно. Из 5x = 3x + 40 следует 2x = 40, x = 20. Угол 5 · 20 = 100 градусов.',
    'Correct. 5x = 3x + 40 gives 2x = 40 and x = 20. The angle is 5 · 20 = 100 degrees.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        "x = 40 chiqishi uchun 40 ni ikkiga bo'lish esdan chiqqan: 2x = 40, x = 20.",
        'Чтобы вышло x = 40, забыли поделить: 2x = 40, значит x = 20.',
        'x = 40 skips the halving: 2x = 40, so x = 20.'),
    },
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        "60° chiqishi uchun x = 20 ni 3x ga qo'yilgan, lekin +40 tashlab ketilgan: 3 · 20 + 40 = 100.",
        'Чтобы вышло 60, подставили x = 20 в 3x и потеряли +40: 3 · 20 + 40 = 100.',
        '60 comes from putting x = 20 into 3x and dropping the +40: 3 · 20 + 40 = 100.'),
    },
    {
      when: (s) => s.seq.length < 2,
      text: L(
        'Ikki karta kerak: x ning qiymati va burchakning qiymati.',
        'Нужны две карточки: значение x и значение угла.',
        'Two cards are needed: the value of x and the value of the angle.'),
    },
  ],
  wrongText: L(
    "Vertikal burchaklar teng, ya'ni 5x = 3x + 40. x ni topgach, uni 5x ga qo'ying.",
    'Вертикальные углы равны, то есть 5x = 3x + 40. Найдя x, подставь его в 5x.',
    'Vertical angles are equal, so 5x = 3x + 40. Once x is found, put it into 5x.'),
};

export default function D40_04(props) { return <BuildLine data={DATA} {...props} />; }
