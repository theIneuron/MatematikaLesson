// Dars11 · Amaliyot 04 — Yechish va javob berish · 🟡 · tag: solve_books
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SlotsBank.
//
// 3x + 6000 = 51000.
//   3x = 45000
//   x = 15000
// Kartalar orasida 57000 (6000 ni qo'shgan), 19000 (57000 : 3) va 3
// turadi -- oxirgisi «bo'lishni teskari qilgan» xatosi.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'solve_books', level: '🟡',
  eyebrow: L('Tenglamani yechish', 'Решение уравнения', 'Solving the equation'),
  setup: L(
    "Tenglama tuzildi. Endi ozod hadni ko'chirib, koeffitsiyentga bo'lish qoldi.",
    'Уравнение составлено. Осталось перенести свободный член и разделить на коэффициент.',
    'The equation is set up. What is left is moving the free term and dividing by the coefficient.'),
  rows: [
    [{ t: ['3x', '+', '6000', '=', '51000'] }],
    [{ t: ['3x', '='] }, { slot: 0 }],
    [{ t: ['x', '='] }, { slot: 1 }],
  ],
  cards: ['45000', '15000', '57000', '19000', '3', '5000'],
  answer: ['45000', '15000'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 3x = 51000 − 6000 = 45000, keyin x = 45000 : 3 = 15000. Ya'ni bitta kitob 15000 so'm.",
    'Верно. 3x = 51000 − 6000 = 45000, затем x = 45000 : 3 = 15000. Значит одна книга стоит 15000 сум.',
    'Correct. 3x = 51000 − 6000 = 45000, then x = 45000 : 3 = 15000. So one book costs 15000.'),
  wrongs: [
    { when: (s) => s.slots[0] === '57000', text: L(
      "6000 chap tomonda QO'SHILGAN edi, ya'ni o'ngga ko'chganda ayiriladi: 51000 − 6000.",
      'Шесть тысяч были слева ПРИБАВЛЕНЫ, значит при переносе направо они вычитаются: 51000 − 6000.',
      'The 6000 was ADDED on the left, so moving right it is subtracted: 51000 − 6000.') },
    { when: (s) => s.slots[1] === '19000', text: L(
      "Bo'lish to'g'ri, lekin son xato: 45000 : 3 = 15000. 19000 esa 57000 : 3 dan chiqadi.",
      'Деление верное, но число не то: 45000 : 3 = 15000. А 19000 выходит из 57000 : 3.',
      'The division is right but the number is not: 45000 : 3 = 15000. The 19000 comes from 57000 : 3.') },
    { when: (s) => s.slots[1] === '5000', text: L(
      "5000 chiqishi uchun 45000 ni 9 ga bo'lgan. Kitoblar soni esa uchta: 45000 : 3 = 15000.",
      'Чтобы вышло 5000, 45000 разделили на 9. А книг три: 45000 : 3 = 15000.',
      'To get 5000 the 45000 was divided by 9. But there are three books: 45000 : 3 = 15000.') },
  ],
  wrongText: L(
    "Avval 6000 ni o'ng tomonga ko'chiring, keyin chiqqan sonni 3 ga bo'ling.",
    'Сначала перенеси 6000 в правую часть, потом раздели полученное число на 3.',
    'First move the 6000 to the right, then divide the result by 3.'),
};

export default function D11_04(props) { return <SlotsBank data={DATA} {...props} />; }
