// Dars21 · Amaliyot 01 — Ko'paytmani tiklash · 🟢 · bracket · tag: restore_product
// Faqat MA'LUMOT. Mexanika: kit.jsx -> BuildLine. Raskladka: 21-dars, 1-o'rin.
//
// m² + 9m + 20 = (m + 4)(m + 5). Tekshirish: 4 · 5 = 20 va 4 + 5 = 9.
// Tuzoq kartalari: (m − 4) va (m − 5) -- ko'paytmasi 20, lekin yig'indisi −9.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'restore_product', level: '🟢',
  eyebrow: L("Ko'phadlar ko'paytmasi", 'Произведение многочленов', 'Product of polynomials'),
  setup: L(
    "Ikki qavsning ko'paytmasi berilgan yozuvni beradi. Ozod hadlar ko'paytmasi 20 ni, yig'indisi esa o'rtadagi 9 ni berishi kerak.",
    'Произведение двух скобок должно дать эту запись. Произведение свободных членов даёт 20, а их сумма — среднее число 9.',
    'The product of two brackets must give this record. The free terms multiply to 20 and add up to the middle number 9.'),
  expr: ['m²', '+', '9m', '+', '20'], exprSize: 32,
  cards: [
    { id: 'a', label: '(m + 4)' },
    { id: 'b', label: '(m + 5)' },
    { id: 'c', label: '(m − 4)' },
    { id: 'd', label: '(m − 5)' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Ikki qavsni tanlab qo'ying", 'Поставь две скобки', 'Place the two brackets'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 4 · 5 = 20 va 4 + 5 = 9, ya'ni (m + 4)(m + 5) = m² + 9m + 20.",
    'Верно. 4 · 5 = 20 и 4 + 5 = 9, значит (m + 4)(m + 5) = m² + 9m + 20.',
    'Correct. 4 · 5 = 20 and 4 + 5 = 9, so (m + 4)(m + 5) = m² + 9m + 20.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1 && s.seq.indexOf('d') !== -1, text: L(
      "Ko'paytmasi to'g'ri: (−4) · (−5) = 20. Lekin yig'indisi −9 chiqadi, ya'ni o'rtada −9m turgan bo'lardi.",
      'Произведение верное: (−4) · (−5) = 20. Но сумма выходит −9, то есть в середине стояло бы −9m.',
      'The product is right: (−4) · (−5) = 20. But the sum is −9, so the middle term would be −9m.') },
    { when: (s) => s.seq.length === 2, text: L(
      "Ikki sonni tekshiring: ko'paytmasi 20, yig'indisi 9 bo'lishi kerak. Bir xil ishorali ikki musbat son kerak.",
      'Проверь два числа: произведение 20, сумма 9. Нужны два положительных числа.',
      'Check the two numbers: they must multiply to 20 and add to 9. Two positive numbers are needed.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Ikki qavs kerak: ko'paytma ikki ko'paytuvchidan iborat.",
      'Нужны две скобки: произведение состоит из двух множителей.',
      'Two brackets are needed: a product has two factors.') },
  ],
  wrongText: L(
    "Qanday ikki son ko'paytirilganda 20, qo'shilganda 9 beradi?",
    'Какие два числа при умножении дают 20, а при сложении 9?',
    'Which two numbers multiply to 20 and add to 9?'),
};

export default function D21_01(props) { return <BuildLine data={DATA} {...props} />; }
