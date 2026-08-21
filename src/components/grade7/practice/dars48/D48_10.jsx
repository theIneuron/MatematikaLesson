// Dars48 · Amaliyot 10 — Yuza bo'yicha tomonni topish · 🔴 · build · tag: area_side
// Mexanika: kit.jsx -> BuildLine. Raskladka: 10-o'rin.
// To'rtburchak S = 45, bir tomon 9 -> ikkinchisi 45 : 9 = 5.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'area_side', level: '🔴',
  eyebrow: L('Tomonni topish', 'Найти сторону', 'Find the side'),
  setup: L(
    "Yuza ko'paytma bo'lgani uchun tomonni topish uchun BO'LISH kerak. Perimetr bilan aralashtirmaslik kerak.",
    'Так как площадь это произведение, для поиска стороны нужно ДЕЛЕНИЕ. Не путать с периметром.',
    'Area is a product, so finding a side needs DIVISION. Do not confuse it with the perimeter.'),
  given: [['S', '=', '45'], ['a', '=', '9']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  cards: [
    { id: 'a', label: '45 : 9' },
    { id: 'b', label: '5' },
    { id: 'c', label: '45 − 9' },
    { id: 'd', label: '36' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Hisoblab yozing", 'Запиши вычисление', 'Write the working'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 45 : 9 = 5. Tekshirish: 9 · 5 = 45.",
    'Верно. 45 : 9 = 5. Проверка: 9 · 5 = 45.',
    'Correct. 45 : 9 = 5. Check: 9 · 5 = 45.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1 || s.seq.indexOf('d') !== -1, text: L(
      "Ayirish perimetr masalalarida ishlatiladi. Yuza ko'paytma, ya'ni teskarisi bo'lish.",
      'Вычитание нужно в задачах на периметр. Площадь это произведение, значит обратное действие деление.',
      'Subtraction belongs to perimeter tasks. Area is a product, so the inverse is division.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Ikki bo'lak kerak: hisoblash va natija.",
      'Нужны две части: вычисление и результат.',
      'Two parts are needed: the working and the result.') },
  ],
  wrongText: L(
    "Yuza qanday topilgan edi? Teskari amal qanday?",
    'Как находилась площадь? Каково обратное действие?',
    'How was the area found? What is the inverse action?'),
};

export default function D48_10(props) { return <BuildLine data={DATA} {...props} />; }
