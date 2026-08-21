// Dars32 · Amaliyot 04 — Avval ko'paytuvchi ko'rinishi · 🟡 · bracket · tag: frac_bracket
// Mexanika: kit.jsx -> BuildLine (qavs kartalari). Raskladka: 4-o'rin.
// (6y + 9) : 3 ni qisqartirish uchun avval 3(2y + 3) ko'rinishida yozish
// kerak: shundagina 3 KO'PAYTUVCHI bo'ladi.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'frac_bracket', level: '🟡',
  eyebrow: L('Ko\'paytuvchi ko\'rinishi', 'Вид произведения', 'Product form'),
  setup: L(
    "Qisqartirish uchun bo'linuvchini ko'paytma ko'rinishida yozish kerak. Shundagina bo'luvchi ko'paytuvchi bo'lib ko'rinadi.",
    'Чтобы сократить, делимое надо записать произведением. Только тогда делитель окажется множителем.',
    'To cancel, the dividend must be written as a product. Only then is the divisor a factor.'),
  expr: ['(6y', '+', '9)', ':', '3'], exprSize: 30,
  cards: [
    { id: 'a', label: '3(2y + 3)' },
    { id: 'b', label: ': 3' },
    { id: 'c', label: '3(2y + 9)' },
    { id: 'd', label: '(6y + 9)' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Ko'paytma ko'rinishida yozing", 'Запиши в виде произведения', 'Write it as a product'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 6y + 9 = 3(2y + 3), ya'ni 3(2y + 3) : 3 = 2y + 3. Endi 3 ko'paytuvchi va qisqaradi.",
    'Верно. 6y + 9 = 3(2y + 3), значит 3(2y + 3) : 3 = 2y + 3. Теперь 3 множитель и сокращается.',
    'Correct. 6y + 9 = 3(2y + 3), so 3(2y + 3) : 3 = 2y + 3. Now the 3 is a factor and cancels.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "3(2y + 9) ochilsa 6y + 27 chiqadi. To'g'risi 3(2y + 3): 9 : 3 = 3.",
      'Раскрытие 3(2y + 9) даёт 6y + 27. Верно 3(2y + 3): 9 : 3 = 3.',
      'Opening 3(2y + 9) gives 6y + 27. The right one is 3(2y + 3): 9 : 3 = 3.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "Yig'indi ko'rinishida qisqartirib bo'lmaydi: avval umumiy ko'paytuvchini chiqarish kerak.",
      'В виде суммы сокращать нельзя: сначала надо вынести общий множитель.',
      'A sum cannot be cancelled: the common factor must come out first.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Yozuv ikki bo'lakdan iborat: ko'paytma va bo'luvchi.",
      'Запись состоит из двух частей: произведение и делитель.',
      'The record has two parts: the product and the divisor.') },
  ],
  wrongText: L(
    "6y va 9 da nima umumiy? Uni qavs oldiga chiqaring.",
    'Что общего у 6y и 9? Вынеси это за скобку.',
    'What do 6y and 9 share? Take it out front.'),
};

export default function D32_04(props) { return <BuildLine data={DATA} {...props} />; }
