// Dars43 · Amaliyot 10 — Xossani yozish · 🔴 · bracket · tag: iso_bracket
// Mexanika: kit.jsx -> BuildLine. Raskladka: 10-o'rin `bracket`.
// Asosi AC bo'lgan teng yonli uchburchakda asosdagi burchaklar A va C: burchak A = burchak C.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'iso_bracket',
  level: '🔴',
  eyebrow: L(
    'Xossani yozish',
    'Записать свойство',
    'Write the property'),
  setup: L(
    "Asos AC, ya'ni asosdagi burchaklar A va C uchida turadi. B esa uchidagi burchak.",
    'Основание AC, значит углы при основании стоят при A и C. А B это угол при вершине.',
    'The base is AC, so the base angles sit at A and C. B is the apex angle.'),
  given: [[L('asos', 'основание', 'base'), '=', 'AC']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [
    { id: 'a', label: L('burchak A', 'угол A', 'angle A') },
    { id: 'b', label: L('= burchak C', '= угол C', '= angle C') },
    { id: 'c', label: L('= burchak B', '= угол B', '= angle B') },
    { id: 'd', label: '= 90°' },
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
    "To'g'ri. Asos AC bo'lsa, asosdagi burchaklar A va C, ya'ni burchak A = burchak C.",
    'Верно. Если основание AC, то углы при основании это A и C, значит угол A = угол C.',
    'Correct. With base AC the base angles are A and C, so angle A equals angle C.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        'B -- uchidagi burchak, u asosdagi burchaklardan farq qiladi.',
        'B это угол при вершине, он отличается от углов при основании.',
        'B is the apex angle and differs from the base angles.'),
    },
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        "90° hech qanday shartda berilmagan: teng yonli uchburchak to'g'ri burchakli bo'lishi shart emas.",
        '90° нигде не дано: равнобедренный не обязан быть прямоугольным.',
        '90° is nowhere given: an isosceles triangle need not be right-angled.'),
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
    'Asosning uchlarini qarang: qaysi harflar asosda turibdi?',
    'Посмотри на концы основания: какие буквы стоят при нём?',
    'Look at the ends of the base: which letters sit there?'),
};

export default function D43_10(props) { return <BuildLine data={DATA} {...props} />; }
