// Dars36 · Amaliyot 09 — Tekshirish yozuvi · 🔴 · bracket · tag: graph_check_write
// Mexanika: kit.jsx -> BuildLine. Raskladka: 9-o'rin `bracket`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): k manfiy va kasr bo'ladi,
// savol ikki qadamli -- PODXOD_7SINF.md 13-band.
// (−4; 17) nuqtasini y = −3x + 5 uchun tekshirish: 17 = −3 · (−4) + 5.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'graph_check_write',
  level: '🔴',
  eyebrow: L(
    'Tekshirish yozuvi',
    'Запись проверки',
    'The check written out'),
  setup: L(
    "Nuqtani tekshirish uchun ordinata bir tomonda, formulaga qo'yilgan abssissa ikkinchi tomonda yoziladi.",
    'Для проверки точки ордината пишется с одной стороны, а подставленная в формулу абсцисса с другой.',
    'To check a point, put the ordinate on one side and the substituted formula on the other.'),
  given: [['y = −3x + 5', ',', '(−4; 17)']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [
    { id: 'a', label: '17 =' },
    { id: 'b', label: '−3 · (−4) + 5' },
    { id: 'c', label: '−3 · 4 + 5' },
    { id: 'd', label: '−4 =' },
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
    "To'g'ri. 17 = −3 · (−4) + 5, ya'ni 17 = 12 + 5.",
    'Верно. 17 = −3 · (−4) + 5, то есть 17 = 12 + 5.',
    'Correct. 17 = −3 · (−4) + 5, i.e. 17 = 12 + 5.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        'Abssissa manfiy: qavs bilan (−4) yozilishi kerak.',
        'Абсцисса отрицательная: надо писать (−4) в скобках.',
        'The abscissa is negative: write (−4) in brackets.'),
    },
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        "−4 bu abssissa, u formulaga QO'YILADI. Chap tomonda ordinata turadi.",
        '−4 это абсцисса, её ПОДСТАВЛЯЮТ в формулу. Слева стоит ордината.',
        '−4 is the abscissa and goes INTO the formula. The ordinate stands on the left.'),
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
    "Ordinata tenglikning chap tomonida, qo'yilgan formula o'ng tomonida.",
    'Ордината слева от равенства, подставленная формула справа.',
    'Ordinate on the left, the substituted formula on the right.'),
};

export default function D36_09(props) { return <BuildLine data={DATA} {...props} />; }
