// Dars27 · Amaliyot 08 — Kubni tiklash · 🔴 · bracket · tag: cube_restore
// Mexanika: kit.jsx -> BuildLine (qavs kartalari). Raskladka: 8-o'rin.
// 8 + 12y + 6y² + y³ = (2 + y)³. Hadlar TESKARI tartibda yozilgan:
// 2³ = 8, 3 · 2² · y = 12y, 3 · 2 · y² = 6y², y³.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'cube_restore', level: '🔴',
  eyebrow: L('Kubni tiklash', 'Восстановить куб', 'Restore the cube'),
  setup: L(
    "To'rt had berilgan, lekin tartibi teskari: son oldinda, harf oxirida. Koeffitsiyentlar 1, 3, 3, 1 ekanini tekshirib ko'ring.",
    'Даны четыре члена, но порядок обратный: число впереди, буква в конце. Проверь, что коэффициенты идут 1, 3, 3, 1.',
    'Four terms are given in reverse order: the number first, the letter last. Check that the coefficients run 1, 3, 3, 1.'),
  expr: ['8', '+', '12y', '+', '6y²', '+', 'y³'], exprSize: 26,
  cards: [
    { id: 'op', label: '(' },
    { id: 'in', label: '2 + y' },
    { id: 'cl', label: ')' },
    { id: 'p3', label: '³' },
    { id: 'in2', label: '2 − y' },
    { id: 'p2', label: '²' },
  ],
  answerSeq: ['op', 'in', 'cl', 'p3'],
  empty: L("Kub ko'rinishini tuzing", 'Собери запись в виде куба', 'Build it as a cube'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. (2 + y)³ = 8 + 12y + 6y² + y³: 2³ = 8, 3 · 4 · y = 12y, 3 · 2 · y² = 6y².",
    'Верно. (2 + y)³ = 8 + 12y + 6y² + y³: 2³ = 8, 3 · 4 · y = 12y, 3 · 2 · y² = 6y².',
    'Correct. (2 + y)³ = 8 + 12y + 6y² + y³: 2³ = 8, 3 · 4 · y = 12y, 3 · 2 · y² = 6y².'),
  wrongs: [
    { when: (s) => s.seq.indexOf('in2') !== -1, text: L(
      "(2 − y)³ da ishoralar navbatlashardi: 8 − 12y + 6y² − y³. Bizda esa hammasi plyus.",
      'В (2 − y)³ знаки чередовались бы: 8 − 12y + 6y² − y³. А у нас все плюсы.',
      'In (2 − y)³ the signs would alternate: 8 − 12y + 6y² − y³. Here all are plus.') },
    { when: (s) => s.seq.indexOf('p2') !== -1, text: L(
      "Kvadratda uch had bo'lardi. Bizda to'rtta, ya'ni bu kub.",
      'У квадрата было бы три члена. У нас четыре, значит это куб.',
      'A square would give three terms. We have four, so this is a cube.') },
    { when: (s) => s.seq.indexOf('p3') === -1 || s.seq.indexOf('cl') === -1, text: L(
      "Yozuv to'liq emas: qavs yopilishi va ustiga uch qo'yilishi kerak.",
      'Запись не полная: скобку надо закрыть и поставить тройку.',
      'The record is incomplete: close the bracket and set the three.') },
  ],
  wrongText: L(
    "Chetdagi hadlardan asos toping: 8 nimaning kubi, y³ nimaning kubi?",
    'Найди основания по крайним членам: чей куб 8 и чей y³?',
    'Find the bases from the outer terms: 8 is the cube of what, and y³?'),
};

export default function D27_08(props) { return <BuildLine data={DATA} {...props} />; }
