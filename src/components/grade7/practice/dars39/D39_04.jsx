// Dars39 · Amaliyot 04 — Uch bosqich · 🟡 · order · tag: comb_order
// Mexanika: kit.jsx -> BuildLine. Raskladka: 4-o'rin `order`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): manfiy va kasr koeffitsiyent,
// ikki qadamli savol, yaqin tuzoq -- PODXOD_7SINF.md 13-band.
// 2 · 3 · 5: avval 2 · 3 = 6, keyin 6 · 5 = 30.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'comb_order',
  level: '🟡',
  eyebrow: L(
    'Uch bosqich',
    'Три этапа',
    'Three stages'),
  setup: L(
    'Uch bosqichli tanlov: 2, 3 va 5 variant. Hisobni tartib bilan yozing.',
    'Выбор в три этапа: 2, 3 и 5 вариантов. Запиши вычисление по порядку.',
    'A three-stage choice: 2, 3 and 5 options. Write the computation in order.'),
  given: [['2', ',', '3', ',', '5']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [
    { id: 'a', label: '2 · 3 = 6' },
    { id: 'b', label: '6 · 5 = 30' },
    { id: 'c', label: L('jami 30', 'всего 30', '30 in all') },
    { id: 'd', label: '2 + 3 = 5' },
    { id: 'e', label: L('jami 10', 'всего 10', '10 in all') },
  ],
  answerSeq: ['a', 'b', 'c'],
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
    "To'g'ri. 2 · 3 = 6, keyin 6 · 5 = 30.",
    'Верно. 2 · 3 = 6, затем 6 · 5 = 30.',
    'Correct. 2 · 3 = 6, then 6 · 5 = 30.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('d') !== -1 || s.seq.indexOf('e') !== -1,
      text: L(
        "Bosqichlar ko'paytiriladi. Qo'shish faqat «yoki» bo'lganda ishlatiladi.",
        'Этапы умножаются. Сложение только при «или».',
        'Stages multiply. Adding belongs to "or".'),
    },
    {
      when: (s) => s.seq.length < 3,
      text: L(
        'Uch karta kerak.',
        'Нужны три карточки.',
        'Three cards are needed.'),
    },
  ],
  wrongText: L(
    "Uch sonni ketma-ket ko'paytiring.",
    'Умножь три числа подряд.',
    'Multiply the three numbers in turn.'),
};

export default function D39_04(props) { return <BuildLine data={DATA} {...props} />; }
