// Dars35 · Amaliyot 06 — Manfiy x · 🟡 · order · tag: lin_order
// Mexanika: kit.jsx -> BuildLine (tartib muhim). Raskladka: 6-o'rin.
// y = −3x + 4, x = −2: −3 · (−2) + 4 -> 6 + 4 -> 10.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'lin_order', level: '🟡',
  eyebrow: L('Manfiy x', 'Отрицательный x', 'A negative x'),
  setup: L(
    "Manfiy son manfiy koeffitsiyentga ko'paytiriladi -- natija musbat chiqadi. Uch qadamni tartib bilan qo'ying.",
    'Отрицательное число умножается на отрицательный коэффициент — результат положительный. Расставь три шага по порядку.',
    'A negative number times a negative coefficient gives a positive. Place the three steps in order.'),
  given: [['y', '=', '−3x', '+', '4']],
  givenLabel: L('Formula:', 'Формула:', 'The rule:'),
  cards: [
    { id: 'a', label: '−3 · (−2) + 4' },
    { id: 'b', label: '6 + 4' },
    { id: 'c', label: '10' },
    { id: 'd', label: '−6 + 4' },
    { id: 'e', label: '−2' },
  ],
  answerSeq: ['a', 'b', 'c'],
  empty: L("Uch qadamni tartib bilan qo'ying", 'Поставь три шага по порядку', 'Place the three steps in order'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. −3 · (−2) = +6, keyin 6 + 4 = 10.",
    'Верно. −3 · (−2) = +6, потом 6 + 4 = 10.',
    'Correct. −3 · (−2) = +6, then 6 + 4 = 10.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('d') !== -1 || s.seq.indexOf('e') !== -1, text: L(
      "Ikki minus musbat beradi: −3 · (−2) = +6, −6 emas.",
      'Два минуса дают плюс: −3 · (−2) = +6, а не −6.',
      'Two minuses give a plus: −3 · (−2) = +6, not −6.') },
    { when: (s) => s.seq.length === 3, text: L(
      "Qadamlar to'g'ri, tartibi boshqa: qo'yish, ko'paytirish, qo'shish.",
      'Шаги верные, но порядок другой: подстановка, умножение, сложение.',
      'The steps are right but the order is not: substitute, multiply, add.') },
    { when: (s) => s.seq.length < 3, text: L(
      "Uch qadam bo'lishi kerak.",
      'Должно быть три шага.',
      'There must be three steps.') },
  ],
  wrongText: L(
    "−3 ni −2 ga ko'paytirganda qanday ishora chiqadi?",
    'Какой знак выходит при умножении −3 на −2?',
    'What sign comes from −3 times −2?'),
};

export default function D35_06(props) { return <BuildLine data={DATA} {...props} />; }
