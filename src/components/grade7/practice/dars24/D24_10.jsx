// Dars24 · Amaliyot 10 — Bo'linuvchini tiklash · 🔴 · bracket · tag: div_restore
// Mexanika: kit.jsx -> BuildLine (qavs kartalari). Raskladka: 10-o'rin.
// Bo'linma 3b − 2, bo'luvchi 12b². Bo'linuvchi: 12b²(3b − 2) = 36b³ − 24b².
// Ya'ni yozuv (36b³ − 24b²) : 12b². Tuzoq: bo'luvchi 12b bo'lsa bo'linma
// boshqa chiqadi.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'div_restore', level: '🔴',
  eyebrow: L('Teskari tekshirish', 'Обратная проверка', 'Checking backwards'),
  setup: L(
    "Bo'linma va bo'luvchi berilgan, bo'linuvchini tiklash kerak. Bo'lishning tekshiruvi ko'paytirish: bo'linma ko'paytiriladi bo'luvchiga.",
    'Даны частное и делитель, надо восстановить делимое. Проверка деления это умножение: частное умножается на делитель.',
    'The quotient and divisor are given; restore the dividend. Division is checked by multiplying the quotient by the divisor.'),
  given: [['3b', '−', '2']],
  givenLabel: L("Bo'linma:", 'Частное:', 'Quotient:'),
  cards: [
    { id: 'a', label: '(36b³ − 24b²)' },
    { id: 'b', label: ': 12b²' },
    { id: 'c', label: ': 12b' },
    { id: 'd', label: '(36b³ + 24b²)' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Bo'linish yozuvini tuzing", 'Собери запись деления', 'Build the division record'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 12b²(3b − 2) = 36b³ − 24b², ya'ni (36b³ − 24b²) : 12b² = 3b − 2.",
    'Верно. 12b²(3b − 2) = 36b³ − 24b², значит (36b³ − 24b²) : 12b² = 3b − 2.',
    'Correct. 12b²(3b − 2) = 36b³ − 24b², so (36b³ − 24b²) : 12b² = 3b − 2.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "12b ga bo'lsak 36b³ : 12b = 3b², ya'ni bo'linma 3b² − 2b bo'lardi. Bizga esa 3b − 2 kerak.",
      'При делении на 12b выходит 36b³ : 12b = 3b², то есть частное 3b² − 2b. А нужно 3b − 2.',
      'Dividing by 12b gives 36b³ : 12b = 3b², so the quotient would be 3b² − 2b. We need 3b − 2.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "Yig'indini 12b² ga bo'lsak 3b + 2 chiqadi. Bo'linmada esa ayirma turibdi.",
      'Если сумму разделить на 12b², выйдет 3b + 2. А в частном стоит разность.',
      'Dividing the sum by 12b² gives 3b + 2. But the quotient is a difference.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Yozuv ikki bo'lakdan iborat: bo'linuvchi va bo'luvchi.",
      'Запись состоит из двух частей: делимое и делитель.',
      'The record has two parts: the dividend and the divisor.') },
  ],
  wrongText: L(
    "Bo'linmani bo'luvchiga ko'paytirib ko'ring: qaysi bo'linuvchi chiqadi?",
    'Умножь частное на делитель: какое делимое выходит?',
    'Multiply the quotient by the divisor: which dividend comes out?'),
};

export default function D24_10(props) { return <BuildLine data={DATA} {...props} />; }
