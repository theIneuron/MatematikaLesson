// Dars38 · Amaliyot 02 — Juftlikni tekshirish · 🟢 · build · tag: sys_check
// Mexanika: kit.jsx -> BuildLine. Raskladka: 2-o'rin `build`.
// (2; −3): x + y = −1 -> 2 + (−3) = −1 TO'G'RI; x − y = 5 -> 2 − (−3) = 5 TO'G'RI.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'sys_check',
  level: '🟢',
  eyebrow: L(
    'Tekshirish',
    'Проверка',
    'The check'),
  setup: L(
    "Juftlikni ikki tenglamaga ham qo'yish kerak. Manfiy son qavs bilan qo'yiladi.",
    'Пару надо подставить в оба уравнения. Отрицательное число подставляется в скобках.',
    'The pair goes into both equations, with the negative in brackets.'),
  given: [['x + y = −1', ';', 'x − y = 5', ';', '(2; −3)']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [
    { id: 'a', label: 'juftlik mos keladi' },
    { id: 'b', label: 'faqat birinchisi bajariladi' },
    { id: 'c', label: 'hech qaysi bajarilmaydi' },
  ],
  answerSeq: ['a'],
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
    "To'g'ri. 2 + (−3) = −1 va 2 − (−3) = 5: ikkovi ham bajarildi.",
    'Верно. 2 + (−3) = −1 и 2 − (−3) = 5: оба выполнены.',
    'Correct. 2 + (−3) = −1 and 2 − (−3) = 5: both hold.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('b') !== -1,
      text: L(
        "Ikkinchisini tekshiring: 2 − (−3) = 2 + 3 = 5, ya'ni u ham bajariladi.",
        'Проверь второе: 2 − (−3) = 2 + 3 = 5, значит и оно выполняется.',
        'Check the second: 2 − (−3) = 2 + 3 = 5, so it holds too.'),
    },
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        'Birinchisi ham bajariladi: 2 + (−3) = −1.',
        'Первое тоже выполняется: 2 + (−3) = −1.',
        'The first holds as well: 2 + (−3) = −1.'),
    },
    {
      when: (s) => s.seq.length < 1,
      text: L(
        'Bitta karta kerak.',
        'Нужна одна карточка.',
        'One card is needed.'),
    },
  ],
  wrongText: L(
    "Har tenglamaga alohida qo'ying, ishoralarga diqqat.",
    'Подставь в каждое уравнение отдельно, следи за знаками.',
    'Substitute into each equation separately and watch the signs.'),
};

export default function D38_02(props) { return <BuildLine data={DATA} {...props} />; }
