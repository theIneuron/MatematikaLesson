// Dars20 · Amaliyot 07 — Ikki harf qavsda · 🟡 · slots · tag: mul_two_letters
// Faqat MA'LUMOT. Mexanika: kit.jsx -> SlotsBank. Raskladka: 7-o'rin.
//
// 5xy(2x − 3y) = 10x²y − 15xy².
//   5xy · 2x = 10x²y   (x: 1 + 1 = 2, y qoladi)
//   5xy · 3y = 15xy²   (y: 1 + 1 = 2, x qoladi)
// Kartalar orasida 10xy va −15xy turadi: harf qo'shilmagan variantlar.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'mul_two_letters', level: '🟡',
  eyebrow: L('Ikki harf', 'Две буквы', 'Two letters'),
  setup: L(
    "Qavs oldidagi hadda ikki harf bor. Ko'paytirganda har harfning ko'rsatkichi o'zi bilan qo'shiladi: x ga x, y ga y.",
    'В одночлене перед скобкой две буквы. При умножении показатель каждой складывается со своим: x с x, y с y.',
    'The monomial in front has two letters. When multiplying, each letter adds its own exponents: x with x, y with y.'),
  rows: [
    [{ t: ['5xy', '(2x', '−', '3y)', '='] }, { slot: 0 }, { slot: 1 }],
  ],
  cards: ['10x²y', '−15xy²', '10xy', '−15xy', '7x²y', '−8xy²'],
  answer: ['10x²y', '−15xy²'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 5xy · 2x = 10x²y: x ikkita bo'ldi, y bittalik qoldi. 5xy · 3y = 15xy²: endi y ikkita.",
    'Верно. 5xy · 2x = 10x²y: иксов стало два, y осталась одна. 5xy · 3y = 15xy²: теперь два y.',
    'Correct. 5xy · 2x = 10x²y: two x, one y. 5xy · 3y = 15xy²: now two y.'),
  wrongs: [
    { when: (s) => s.slots[0] === '10xy', text: L(
      "10xy da x qo'shilmagan: 5xy da bitta x, 2x da yana bitta -- birga x².",
      'В 10xy не добавлен x: в 5xy один x, в 2x ещё один — вместе x².',
      'In 10xy the x was not added: 5xy has one x and 2x another — together x².') },
    { when: (s) => s.slots[1] === '−15xy', text: L(
      "−15xy da y qo'shilmagan: 5xy da bitta y, 3y da yana bitta -- birga y².",
      'В −15xy не добавлен y: в 5xy один y, в 3y ещё один — вместе y².',
      'In −15xy the y was not added: 5xy has one y and 3y another — together y².') },
    { when: (s) => s.slots[0] === '7x²y' || s.slots[1] === '−8xy²', text: L(
      "Koeffitsiyentlar qo'shilgan: 5 + 2 = 7 va 5 + 3 = 8. Ular ko'paytiriladi: 10 va 15.",
      'Коэффициенты сложили: 5 + 2 = 7 и 5 + 3 = 8. А они перемножаются: 10 и 15.',
      'The coefficients were added: 5 + 2 = 7 and 5 + 3 = 8. They are multiplied: 10 and 15.') },
  ],
  wrongText: L(
    "Har ko'paytmada uch narsani qiling: sonlarni ko'paytiring, x larni sanang, y larni sanang.",
    'В каждом произведении сделай три дела: перемножь числа, посчитай иксы, посчитай y.',
    'In each product do three things: multiply the numbers, count the x, count the y.'),
};

export default function D20_07(props) { return <SlotsBank data={DATA} {...props} />; }
