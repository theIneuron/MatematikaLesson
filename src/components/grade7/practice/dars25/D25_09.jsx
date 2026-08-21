// Dars25 · Amaliyot 09 — Kvadratni tiklash · 🔴 · bracket · tag: sq_restore
// Mexanika: kit.jsx -> BuildLine (qavs kartalari). Raskladka: 9-o'rin.
// 49 + 14t + t² = (7 + t)². Tekshirish: 7² = 49, 2 · 7 · t = 14t, t² = t².
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'sq_restore', level: '🔴',
  eyebrow: L('Kvadratni tiklash', 'Восстановить квадрат', 'Restore the square'),
  setup: L(
    "Uch had berilgan, ular kvadratdan chiqqanmi degan savol. Chetdagi hadlardan asos topiladi, o'rta had esa tekshiradi.",
    'Даны три члена, вопрос — вышли ли они из квадрата. Крайние члены дают основания, а средний это проверяет.',
    'Three terms are given; did they come from a square? The outer terms give the bases and the middle one checks it.'),
  expr: ['49', '+', '14t', '+', 't²'], exprSize: 30,
  cards: [
    { id: 'op', label: '(' },
    { id: 'in', label: '7 + t' },
    { id: 'cl', label: ')' },
    { id: 'p2', label: '²' },
    { id: 'in2', label: '7 − t' },
    { id: 'p3', label: '³' },
  ],
  answerSeq: ['op', 'in', 'cl', 'p2'],
  empty: L("Kvadrat ko'rinishini tuzing", 'Собери запись в виде квадрата', 'Build it as a square'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. (7 + t)² = 49 + 14t + t². O'rta had 2 · 7 · t = 14t, ya'ni mos keldi.",
    'Верно. (7 + t)² = 49 + 14t + t². Средний член 2 · 7 · t = 14t, значит совпало.',
    'Correct. (7 + t)² = 49 + 14t + t². The middle term 2 · 7 · t = 14t matches.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('in2') !== -1, text: L(
      "(7 − t)² ochilsa 49 − 14t + t² chiqadi: o'rta had manfiy bo'lardi. Bizda esa +14t.",
      'Раскрытие (7 − t)² даёт 49 − 14t + t²: средний член был бы отрицательным. А у нас +14t.',
      'Opening (7 − t)² gives 49 − 14t + t²: the middle term would be negative. But we have +14t.') },
    { when: (s) => s.seq.indexOf('p3') !== -1, text: L(
      "Kub bo'lsa to'rt had bo'lardi. Bizda uch had, ya'ni bu kvadrat.",
      'У куба было бы четыре члена. У нас три, значит это квадрат.',
      'A cube would give four terms. We have three, so this is a square.') },
    { when: (s) => s.seq.indexOf('p2') === -1 || s.seq.indexOf('cl') === -1, text: L(
      "Yozuv to'liq emas: qavs yopilishi va ustiga daraja qo'yilishi kerak.",
      'Запись не полная: скобку надо закрыть и поставить степень.',
      'The record is incomplete: close the bracket and set the power.') },
  ],
  wrongText: L(
    "Chetdagi hadlardan ildiz oling: 49 nimaning kvadrati, t² nimaning kvadrati?",
    'Извлеки корни из крайних членов: чей квадрат 49 и чей t²?',
    'Take the roots of the outer terms: 49 is the square of what, and t²?'),
};

export default function D25_09(props) { return <BuildLine data={DATA} {...props} />; }
