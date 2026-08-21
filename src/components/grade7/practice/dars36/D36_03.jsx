// Dars36 · Amaliyot 03 — Nuqta grafikda yotadimi · 🟢 · build · tag: point_on_line
// Mexanika: kit.jsx -> BuildLine. Raskladka: 3-o'rin.
// y = 3x + 1, nuqta (2; 7): 3 · 2 + 1 = 7 -- yotadi.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'point_on_line', level: '🟢',
  eyebrow: L('Tekshirish', 'Проверка', 'Checking'),
  setup: L(
    "Nuqta grafikda yotishini tekshirish uchun uning abssissasi formulaga qo'yiladi va natija ordinata bilan solishtiriladi.",
    'Чтобы проверить, лежит ли точка на графике, её абсциссу подставляют в формулу и сравнивают с ординатой.',
    'To check a point, substitute its abscissa into the rule and compare with the ordinate.'),
  given: [['y', '=', '3x', '+', '1'], ['(2;', '7)']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  cards: [
    { id: 'a', label: '3 · 2 + 1' },
    { id: 'b', label: '= 7' },
    { id: 'c', label: '= 8' },
    { id: 'd', label: '2 · 3 + 1' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Tekshirishni yozing", 'Запиши проверку', 'Write the check'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 3 · 2 + 1 = 7, ya'ni nuqtaning ordinatasi bilan mos keldi: nuqta grafikda yotadi.",
    'Верно. 3 · 2 + 1 = 7, совпало с ординатой точки: точка лежит на графике.',
    'Correct. 3 · 2 + 1 = 7 matches the ordinate: the point lies on the graph.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "3 · 2 + 1 = 7, 8 emas. Amallar tartibi: avval ko'paytirish.",
      '3 · 2 + 1 = 7, а не 8. Порядок действий: сначала умножение.',
      '3 · 2 + 1 = 7, not 8. Order of operations: multiply first.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "Formulada 3 koeffitsiyent, 2 esa x ning qiymati: 3 · 2 deb yozish aniqroq.",
      'В формуле 3 это коэффициент, а 2 значение x: записать 3 · 2 точнее.',
      'In the rule 3 is the coefficient and 2 the value of x: 3 · 2 is the clearer record.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Ikki bo'lak kerak: hisoblash va natija.",
      'Нужны две части: вычисление и результат.',
      'Two parts are needed: the working and the result.') },
  ],
  wrongText: L(
    "Nuqtaning abssissasini formulaga qo'ying: natija 7 chiqadimi?",
    'Подставь абсциссу точки в формулу: выйдет ли 7?',
    "Put the point's abscissa into the rule: does it give 7?"),
};

export default function D36_03(props) { return <BuildLine data={DATA} {...props} />; }
