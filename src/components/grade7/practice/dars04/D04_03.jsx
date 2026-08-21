// Dars04 · Amaliyot 03 — Xossa bilan qayta yozish · 🟢 · build · tag: id_rewrite
// Mexanika: kit.jsx -> BuildLine. Raskladka: 3-o'rin.
// 4(x + 3) = 4x + 12 -- taqsimot xossasi. Bu ayniy o'zgartirish: qiymat
// hech qanday x uchun o'zgarmaydi.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'id_rewrite', level: '🟢',
  eyebrow: L('Qayta yozish', 'Переписать', 'Rewriting'),
  setup: L(
    "Ayniy o'zgartirish -- yozuvni xossa bilan boshqa ko'rinishga keltirish. Qiymat hamma x uchun bir xil qoladi.",
    'Тождественное преобразование это переписывание записи по свойству. Значение остаётся тем же при любом x.',
    'An identity transformation rewrites a record by a property. The value stays the same for every x.'),
  expr: ['4(x', '+', '3)'], exprSize: 32,
  cards: [
    { id: 'a', label: '4x' },
    { id: 'b', label: '+12' },
    { id: 'c', label: '+3' },
    { id: 'd', label: '7x' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Qavsni ochib yozing", 'Раскрой скобку', 'Open the bracket'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 4 · x = 4x va 4 · 3 = 12. Tekshirish: x = 2 da 4 · 5 = 20 va 8 + 12 = 20.",
    'Верно. 4 · x = 4x и 4 · 3 = 12. Проверка: при x = 2 выходит 4 · 5 = 20 и 8 + 12 = 20.',
    'Correct. 4 · x = 4x and 4 · 3 = 12. Check: at x = 2 both give 20.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "+3 ko'paytirilmagan: 4 ni qavs ichidagi HAR hadga ko'paytirish kerak.",
      '+3 не умножено: 4 надо умножить на КАЖДЫЙ член скобки.',
      '+3 was not multiplied: the 4 must meet EVERY term inside.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "7x chiqishi uchun 4 va 3 qo'shilgan. Taqsimot xossasida esa ko'paytirish bo'ladi.",
      'Чтобы вышло 7x, сложили 4 и 3. А в распределительном свойстве умножение.',
      'To get 7x the 4 and 3 were added. The distributive property multiplies.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Javobda ikki had bo'ladi.",
      'В ответе два члена.',
      'The answer has two terms.') },
  ],
  wrongText: L(
    "4 ni qavs ichidagi nechta hadga ko'paytirish kerak?",
    'На сколько членов скобки надо умножить 4?',
    'How many terms inside must the 4 multiply?'),
};

export default function D04_03(props) { return <BuildLine data={DATA} {...props} />; }
