// Dars38 · Amaliyot 04 — Qo'yish usuli · 🟡 · build · tag: sys_substitution
// Mexanika: kit.jsx -> BuildLine. Raskladka: 4-o'rin `build`.
// y = x − 4 va 2x + y = 11: 2x + (x − 4) = 11 -> 3x = 15 -> x = 5, y = 1.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'sys_substitution',
  level: '🟡',
  eyebrow: L(
    "Qo'yish usuli",
    'Способ подстановки',
    'Substitution method'),
  setup: L(
    "Birinchi tenglamada y allaqachon ajratilgan, ya'ni uni ikkinchisiga QO'YISH mumkin. Ikki javob kerak.",
    'В первом уравнении y уже выражен, значит его можно ПОДСТАВИТЬ во второе. Нужны два ответа.',
    'The first equation already isolates y, so it can be SUBSTITUTED into the second. Two answers.'),
  given: [['y = x − 4', ';', '2x + y = 11']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [
    { id: 'a', label: 'x = 5' },
    { id: 'b', label: 'y = 1' },
    { id: 'c', label: 'x = 3,75' },
    { id: 'd', label: 'y = 5' },
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
    "To'g'ri. 2x + (x − 4) = 11, ya'ni 3x = 15 va x = 5. Keyin y = 5 − 4 = 1.",
    'Верно. 2x + (x − 4) = 11, значит 3x = 15 и x = 5. Затем y = 5 − 4 = 1.',
    'Correct. 2x + (x − 4) = 11 gives 3x = 15 and x = 5, then y = 5 − 4 = 1.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        "3,75 chiqishi uchun 15 to'rtga bo'lingan. Qo'yishdan keyin 3x qoladi: 15 : 3 = 5.",
        'Чтобы вышло 3,75, делили 15 на четыре. После подстановки остаётся 3x: 15 : 3 = 5.',
        '3.75 divides 15 by four. After substituting we have 3x: 15 : 3 = 5.'),
    },
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        "y = 5 bu x ning qiymati. y ni topish uchun uni birinchi tenglamaga qo'yish kerak.",
        'y = 5 это значение x. Чтобы найти y, подставь его в первое уравнение.',
        'y = 5 is the x value. Put it into the first equation to get y.'),
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
    "y ni ikkinchi tenglamaga qavs bilan qo'ying, keyin x ni toping.",
    'Подставь y во второе уравнение в скобках, потом найди x.',
    'Substitute y into the second equation in brackets, then find x.'),
};

export default function D38_04(props) { return <BuildLine data={DATA} {...props} />; }
