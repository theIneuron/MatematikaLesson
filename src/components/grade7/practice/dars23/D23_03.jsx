// Dars23 · Amaliyot 03 — Umumiy qavsni chiqarish · 🟢 · build · tag: group_build
// Mexanika: kit.jsx -> BuildLine. Raskladka: 3-o'rin.
// x(y + 4) + 3(y + 4) = (y + 4)(x + 3). Guruhlashning ikkinchi yarmi.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'group_build', level: '🟢',
  eyebrow: L('Umumiy qavs', 'Общая скобка', 'The common bracket'),
  setup: L(
    "Ikki hadda bir xil qavs turibdi. U umumiy ko'paytuvchi bo'lib chiqadi, oldidagi hadlar esa ikkinchi qavsni tashkil qiladi.",
    'В двух членах стоит одинаковая скобка. Она и выносится как общий множитель, а стоящие перед ней члены образуют вторую скобку.',
    'Both terms hold the same bracket. It comes out as the common factor, and the front terms form the second bracket.'),
  expr: ['x(y', '+', '4)', '+', '3(y', '+', '4)'], exprSize: 26,
  cards: [
    { id: 'a', label: '(y + 4)' },
    { id: 'b', label: '(x + 3)' },
    { id: 'c', label: '(y + 3)' },
    { id: 'd', label: '(x + 4)' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Ikki ko'paytuvchini qo'ying", 'Поставь два множителя', 'Place the two factors'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. (y + 4) umumiy, oldidagi hadlar x va 3: javob (y + 4)(x + 3).",
    'Верно. (y + 4) общая, перед ней стоят x и 3: ответ (y + 4)(x + 3).',
    'Correct. (y + 4) is common and the front terms are x and 3: the answer is (y + 4)(x + 3).'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1 || s.seq.indexOf('d') !== -1, text: L(
      "Qavslarning ichi aralashib ketdi: umumiy qavs (y + 4), qavs oldidagi hadlardan esa (x + 3) yig'iladi.",
      'Содержимое скобок перепуталось: общая скобка (y + 4), а из членов перед ней собирается (x + 3).',
      'The brackets got mixed: the common one is (y + 4), and the front terms make (x + 3).') },
    { when: (s) => s.seq.length < 2, text: L(
      "Javob ikki qavsdan iborat: umumiy qavs va oldidagi hadlar.",
      'Ответ состоит из двух скобок: общая и члены перед ней.',
      'The answer has two brackets: the common one and the front terms.') },
  ],
  wrongText: L(
    "Ikki hadda nima bir xil? U birinchi ko'paytuvchi bo'ladi.",
    'Что одинаково в двух членах? Это и будет первый множитель.',
    'What is the same in both terms? That becomes the first factor.'),
};

export default function D23_03(props) { return <BuildLine data={DATA} {...props} />; }
