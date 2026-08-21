// Dars19 · Amaliyot 01 — Yig'indini yig'ish · 🟢 · order · tag: add_order
// Faqat MA'LUMOT. Mexanika: kit.jsx -> BuildLine (tartib muhim). Raskladka: 1-o'rin.
//
// (5x + 3) + (2x − 8) = 7x − 5. Plyusli qavs ishoralarni o'zgartirmaydi:
// 5x + 2x = 7x, 3 − 8 = −5.
// Ortiqcha kartalar: +11 (3 + 8), 3x (5 − 2), −11.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'add_order', level: '🟢',
  eyebrow: L("Ko'phadlarni qo'shish", 'Сложение многочленов', 'Adding polynomials'),
  setup: L(
    "Plyus turgan qavs ichidagi ishoralarni o'zgartirmaydi. Qo'shilgandan keyin o'xshash hadlar ixchamlanadi: darajasi katta had oldinda turadi.",
    'Скобка с плюсом знаки внутри не меняет. После сложения приводятся подобные: старший член стоит впереди.',
    'A bracket with a plus leaves the signs alone. After adding, like terms are collected and the higher term goes first.'),
  expr: ['(5x', '+', '3)', '+', '(2x', '−', '8)'], exprSize: 28,
  cards: [
    { id: 'x7', label: '7x' },
    { id: 'm5', label: '−5' },
    { id: 'p11', label: '+11' },
    { id: 'x3', label: '3x' },
    { id: 'm11', label: '−11' },
  ],
  answerSeq: ['x7', 'm5'],
  empty: L("Javobni tartib bilan tuzing", 'Собери ответ по порядку', 'Build the answer in order'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 5x + 2x = 7x, ozod hadlar esa 3 − 8 = −5. Javob 7x − 5.",
    'Верно. 5x + 2x = 7x, а свободные члены 3 − 8 = −5. Ответ 7x − 5.',
    'Correct. 5x + 2x = 7x, and the free terms give 3 − 8 = −5. The answer is 7x − 5.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('p11') !== -1 || s.seq.indexOf('m11') !== -1, text: L(
      "11 chiqishi uchun 3 va 8 qo'shilgan. Ikkinchi qavsda esa −8 turibdi: 3 − 8 = −5.",
      'Чтобы вышло 11, сложили 3 и 8. А во второй скобке стоит −8: 3 − 8 = −5.',
      'To get 11 the 3 and 8 were added. But the second bracket holds −8: 3 − 8 = −5.') },
    { when: (s) => s.seq.indexOf('x3') !== -1, text: L(
      "3x chiqishi uchun 5x dan 2x ayirilgan. Qavslar orasida PLYUS turibdi, ya'ni qo'shiladi: 7x.",
      'Чтобы вышло 3x, из 5x вычли 2x. Между скобками стоит ПЛЮС, значит складываем: 7x.',
      'To get 3x the 2x was subtracted from 5x. The brackets are joined by a PLUS, so add: 7x.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Javobda ikki had bo'ladi: x li had va ozod had. Bittasi qo'yilmadi.",
      'В ответе два члена: с x и свободный. Одного не поставил.',
      'The answer has two terms: the x term and the free one. One is missing.') },
  ],
  wrongText: L(
    "Ikki guruhni alohida qo'shing: x li hadlarni va ozod hadlarni.",
    'Сложи две группы по отдельности: члены с x и свободные члены.',
    'Add the two groups separately: the x terms and the free terms.'),
};

export default function D19_01(props) { return <BuildLine data={DATA} {...props} />; }
