// Dars39 · Amaliyot 04 — Uch bosqich · 🟡 · order · tag: comb_order
// Mexanika: kit.jsx -> BuildLine (tartib muhim). Raskladka: 4-o'rin.
// 2 · 3 · 4: avval 2 · 3 = 6, keyin 6 · 4 = 24.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'comb_order', level: '🟡',
  eyebrow: L('Uch bosqich', 'Три этапа', 'Three stages'),
  setup: L(
    "Yo'l uch bosqichdan iborat: 2, 3 va 4 variant. Ular ketma-ket ko'paytiriladi.",
    'Путь состоит из трёх этапов: 2, 3 и 4 варианта. Они перемножаются последовательно.',
    'The route has three stages: 2, 3 and 4 options. They multiply one after another.'),
  cards: [
    { id: 'a', label: '2 · 3' },
    { id: 'b', label: '6 · 4' },
    { id: 'c', label: '24' },
    { id: 'd', label: '2 + 3 + 4' },
    { id: 'e', label: '9' },
  ],
  answerSeq: ['a', 'b', 'c'],
  empty: L("Uch qadamni tartib bilan qo'ying", 'Поставь три шага по порядку', 'Place the three steps in order'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 2 · 3 = 6, keyin 6 · 4 = 24. Uch bosqich uchun uch ko'paytuvchi.",
    'Верно. 2 · 3 = 6, потом 6 · 4 = 24. Три этапа дают три множителя.',
    'Correct. 2 · 3 = 6, then 6 · 4 = 24. Three stages, three factors.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('d') !== -1 || s.seq.indexOf('e') !== -1, text: L(
      "Qo'shish bu yerda ishlamaydi: har bosqich oldingi variantlarni KO'PAYTIRADI.",
      'Сложение здесь не работает: каждый этап УМНОЖАЕТ прежние варианты.',
      'Adding does not work: each stage MULTIPLIES the options so far.') },
    { when: (s) => s.seq.length === 3, text: L(
      "Qadamlar to'g'ri, tartibi boshqa: avval birinchi ikki bosqich, keyin uchinchisi.",
      'Шаги верные, но порядок другой: сначала два первых этапа, потом третий.',
      'The steps are right but the order is not: the first two stages, then the third.') },
    { when: (s) => s.seq.length < 3, text: L(
      "Uch qadam bo'lishi kerak.",
      'Должно быть три шага.',
      'There must be three steps.') },
  ],
  wrongText: L(
    "Ikki bosqichni ko'paytiring, keyin natijani uchinchisiga ko'paytiring.",
    'Перемножь два этапа, потом результат умножь на третий.',
    'Multiply two stages, then multiply the result by the third.'),
};

export default function D39_04(props) { return <BuildLine data={DATA} {...props} />; }
