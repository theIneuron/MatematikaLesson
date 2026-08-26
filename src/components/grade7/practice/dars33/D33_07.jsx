// Dars33 · Amaliyot 07 — O'qdagi nuqta · 🟡 · bracket · tag: point_on_axis
// Mexanika: kit.jsx -> BuildLine. Raskladka: 7-o'rin `bracket`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): sonlar ikki xonali va manfiy,
// qadamlar soni ikkitadan boshlanadi -- PODXOD_7SINF.md 13-band.
// x o'qida abssissasi −14 bo'lgan nuqta: (−14; 0).
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'point_on_axis',
  level: '🟡',
  eyebrow: L(
    "O'qdagi nuqta",
    'Точка на оси',
    'A point on an axis'),
  setup: L(
    "x o'qida yotgan nuqtaning ordinatasi nol. Yozuvni yig'ing.",
    'У точки на оси x ордината равна нулю. Собери запись.',
    'A point on the x axis has zero ordinate. Build the record.'),
  given: [[L("x o'qi", 'ось x', 'the x axis'), ',', L('abssissa −14', 'абсцисса −14', 'abscissa −14')]],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [
    { id: 'a', label: '(−14;' },
    { id: 'b', label: '0)' },
    { id: 'c', label: '−14)' },
    { id: 'd', label: '(0;' },
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
    "To'g'ri. (−14; 0): abssissa −14, ordinata nol.",
    'Верно. (−14; 0): абсцисса −14, ордината ноль.',
    'Correct. (−14; 0): abscissa −14, ordinate zero.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        "(0; −14) y o'qidagi nuqta. Bizga x o'qi kerak.",
        '(0; −14) это точка на оси y. А нам нужна ось x.',
        '(0; −14) sits on the y axis. We need the x axis.'),
    },
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        "Ikki koordinata ham −14 bo'lib qoldi. x o'qida ordinata NOL.",
        'Обе координаты стали −14. На оси x ордината НОЛЬ.',
        'Both coordinates became −14. On the x axis the ordinate is ZERO.'),
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
    "x o'qida ordinata qanday son bo'ladi?",
    'Какое число стоит ординатой на оси x?',
    'What is the ordinate on the x axis?'),
};

export default function D33_07(props) { return <BuildLine data={DATA} {...props} />; }
