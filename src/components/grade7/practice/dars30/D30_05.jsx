// Dars30 · Amaliyot 05 — Ishorani joyiga qo'yish · 🟡 · bracket · tag: whole_bracket
// Mexanika: kit.jsx -> BuildLine (qavs kartalari). Raskladka: 5-o'rin.
// 8 dan 3(k − 2) ayirilishi kerak: 8 − 3(k − 2). Tuzoq: +3(k − 2) va
// −3(k + 2) boshqa yozuvlar.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'whole_bracket', level: '🟡',
  eyebrow: L('Yozuvni tuzish', 'Составить запись', 'Build the record'),
  setup: L(
    "Sakkizdan 3(k − 2) ni ayirish kerak. Ayirish qavs oldida minus bilan yoziladi, va bu ikki hadning ishorasiga ta'sir qiladi.",
    'Из восьми надо вычесть 3(k − 2). Вычитание записывается минусом перед скобкой, и это влияет на знаки обоих членов.',
    'Subtract 3(k − 2) from eight. The subtraction is a minus in front, and it affects both terms.'),
  expr: ['8', '...', '3(k', '−', '2)'], exprSize: 28,
  cards: [
    { id: 'a', label: '8' },
    { id: 'b', label: '− 3(k − 2)' },
    { id: 'c', label: '+ 3(k − 2)' },
    { id: 'd', label: '− 3(k + 2)' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Yozuvni tuzing", 'Составь запись', 'Build the record'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 8 − 3(k − 2). Ochilsa 8 − 3k + 6 = 14 − 3k: qavs ichidagi −2 minusga urilib +6 berdi.",
    'Верно. 8 − 3(k − 2). Раскрытие даёт 8 − 3k + 6 = 14 − 3k: −2 умножилось на минус и дало +6.',
    'Correct. 8 − 3(k − 2). Opening gives 8 − 3k + 6 = 14 − 3k: the −2 met the minus and became +6.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "Plyus qo'shishni bildiradi, bizda esa AYIRISH. Qavs oldida minus turishi kerak.",
      'Плюс означает прибавление, а у нас ВЫЧИТАНИЕ. Перед скобкой должен стоять минус.',
      'A plus means adding, but this is a SUBTRACTION. The bracket needs a minus.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "Qavs ichi o'zgarmaydi: u (k − 2) bo'lib qoladi. Ishora faqat qavs OLDIDA turadi.",
      'Содержимое скобки не меняется: там остаётся (k − 2). Знак стоит только ПЕРЕД скобкой.',
      'The bracket keeps (k − 2). The sign stands only IN FRONT of it.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Yozuv ikki bo'lakdan iborat: son va minusli qavs.",
      'Запись состоит из двух частей: число и скобка с минусом.',
      'The record has two parts: the number and the minus bracket.') },
  ],
  wrongText: L(
    "Ayirish qanday yoziladi -- qavs oldiga qanday ishora qo'yiladi?",
    'Как записывается вычитание — какой знак ставится перед скобкой?',
    'How is a subtraction written — which sign goes before the bracket?'),
};

export default function D30_05(props) { return <BuildLine data={DATA} {...props} />; }
