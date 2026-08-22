// Dars38 · Amaliyot 07 — Qadamlar tartibi · 🟡 · order · tag: sys_order
// Mexanika: kit.jsx -> BuildLine. Raskladka: 7-o'rin `order`.
// y = 3 − x va x + 2y = 4: x + 2(3 − x) = 4 -> x + 6 − 2x = 4 -> x = 2, y = 1.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'sys_order',
  level: '🟡',
  eyebrow: L(
    'Qadamlar tartibi',
    'Порядок шагов',
    'Order of steps'),
  setup: L(
    "Qo'yish usulining qadamlarini tartib bilan qo'ying: qo'yish, qavs ochish, javob.",
    'Поставь по порядку шаги способа подстановки: подстановка, раскрытие скобки, ответ.',
    'Order the substitution steps: substitute, open the bracket, answer.'),
  given: [['y = 3 − x', ';', 'x + 2y = 4']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [
    { id: 'a', label: 'x + 2(3 − x) = 4' },
    { id: 'b', label: 'x + 6 − 2x = 4' },
    { id: 'c', label: 'x = 2, y = 1' },
    { id: 'd', label: 'x + 3 − x = 4' },
    { id: 'e', label: 'x = 2, y = 3' },
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
    "To'g'ri. Qavs ochilgach −x = −2, ya'ni x = 2 va y = 3 − 2 = 1.",
    'Верно. После раскрытия −x = −2, значит x = 2 и y = 3 − 2 = 1.',
    'Correct. Opening gives −x = −2, so x = 2 and y = 3 − 2 = 1.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        'Koeffitsiyent 2 tashlab ketilgan: 2y = 2(3 − x).',
        'Потерян коэффициент 2: 2y = 2(3 − x).',
        'The coefficient 2 is lost: 2y = 2(3 − x).'),
    },
    {
      when: (s) => s.seq.indexOf('e') !== -1,
      text: L(
        'y = 3 bu x = 0 dagi qiymat. x = 2 da y = 3 − 2 = 1.',
        'y = 3 это значение при x = 0. При x = 2 y = 3 − 2 = 1.',
        'y = 3 belongs to x = 0. At x = 2 we get y = 1.'),
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
    "y ni qavs bilan qo'ying va 2 ga ko'paytirishni unutmang.",
    'Подставь y в скобках и не забудь умножить на 2.',
    'Substitute y in brackets and remember the factor 2.'),
};

export default function D38_07(props) { return <BuildLine data={DATA} {...props} />; }
