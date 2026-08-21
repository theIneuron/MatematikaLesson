// Dars22 · Amaliyot 09 — Umumiy ko'paytuvchi QAVS · 🔴 · build · tag: common_bracket
// Mexanika: kit.jsx -> BuildLine. Raskladka: 9-o'rin.
// x(x − 7) + 5(x − 7) = (x − 7)(x + 5). Umumiy ko'paytuvchi bir had emas,
// balki butun QAVS. Bu 23-darsdagi guruhlashga o'tish.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'common_bracket', level: '🔴',
  eyebrow: L('Umumiy qavs', 'Общая скобка', 'A common bracket'),
  setup: L(
    "Umumiy ko'paytuvchi bir had bo'lishi shart emas: bu yerda ikki hadda bir xil QAVS turibdi. Uni ham qavs oldiga chiqarish mumkin.",
    'Общий множитель не обязательно одночлен: здесь в обоих членах стоит одинаковая СКОБКА. Её тоже можно вынести.',
    'A common factor need not be a monomial: here both terms share the same BRACKET, which can be taken out too.'),
  expr: ['x(x', '−', '7)', '+', '5(x', '−', '7)'], exprSize: 26,
  cards: [
    { id: 'a', label: '(x − 7)' },
    { id: 'b', label: '(x + 5)' },
    { id: 'c', label: '(x + 7)' },
    { id: 'd', label: '(x − 5)' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Ikki ko'paytuvchini qo'ying", 'Поставь два множителя', 'Place the two factors'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Umumiy qavs (x − 7) chiqadi, ichida esa x va 5 qoladi: (x − 7)(x + 5).",
    'Верно. Общая скобка (x − 7) выносится, а внутри остаются x и 5: (x − 7)(x + 5).',
    'Correct. The common bracket (x − 7) comes out and x and 5 stay: (x − 7)(x + 5).'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "Ikki hadda ham (x − 7) turibdi, minus bilan. Qavsning ichini o'zgartirib bo'lmaydi.",
      'В обоих членах стоит (x − 7), с минусом. Содержимое скобки менять нельзя.',
      'Both terms hold (x − 7) with a minus. What is inside the bracket cannot be changed.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "Qavs oldidagi hadlar x va +5 edi, ya'ni ikkinchi ko'paytuvchi (x + 5).",
      'Перед скобками стояли x и +5, значит второй множитель это (x + 5).',
      'The terms in front were x and +5, so the second factor is (x + 5).') },
    { when: (s) => s.seq.length < 2, text: L(
      "Javob ikki qavsdan iborat: umumiy qavs va qolgan hadlar.",
      'Ответ состоит из двух скобок: общая и остальные члены.',
      'The answer has two brackets: the common one and what is left.') },
  ],
  wrongText: L(
    "Ikki hadda nima bir xil? Uni chiqaring, oldidagi hadlarni esa ikkinchi qavsga yozing.",
    'Что одинаково в двух членах? Вынеси это, а стоящие перед ними члены запиши во вторую скобку.',
    'What is the same in both terms? Take it out and put the front terms into the second bracket.'),
};

export default function D22_09(props) { return <BuildLine data={DATA} {...props} />; }
