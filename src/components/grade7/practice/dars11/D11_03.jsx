// Dars11 · Amaliyot 03 — Tenglamani tuzish · 🟡 · tag: build_equation_books
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> BuildLine (answerSeq).
//
// «Uchta bir xil kitob x so'mdan olindi, ustiga 6000 so'mlik daftar qo'shildi,
// jami 51000 so'm to'landi.»
// Tenglama: 3x + 6000 = 51000. (Bundan x = 15000.)
// Kartalar aynan beshta: ish tenglamaning TUZILISHIDA -- noma'lumli had,
// ozod had, natija.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const CARDS = [
  { id: 'x3', label: '3x' },
  { id: 'plus', label: '+' },
  { id: 'n6000', label: '6000' },
  { id: 'eq', label: '=' },
  { id: 'n51000', label: '51000' },
];

const DATA = {
  tag: 'build_equation_books', level: '🟡', useAll: true,
  answerSeq: ['x3', 'plus', 'n6000', 'eq', 'n51000'],
  cards: CARDS,
  eyebrow: L('Tenglamani tuzish', 'Составь уравнение', 'Set up the equation'),
  setup: L(
    "Uchta bir xil kitob x so'mdan olindi. Ustiga 6000 so'mlik daftar qo'shildi va jami 51000 so'm to'landi.",
    'Купили три одинаковые книги по x сум. Добавили тетрадь за 6000 сум, и всего заплатили 51000 сум.',
    'Three identical books were bought at x each. A notebook for 6000 was added, and 51000 was paid in all.'),
  empty: L("Kartalarni bosib tenglama yig'ing", 'Собери уравнение, нажимая карточки', 'Build the equation by tapping cards'),
  ask: L("Masalaning tenglamasini yig'ing. Hamma karta ishlatiladi.",
    'Собери уравнение к задаче. Используются все карточки.',
    'Build the equation for the problem. Every card is used.'),
  undo: L('Bitta orqaga', 'Шаг назад', 'One back'),
  valueLabel: L('Qiymat:', 'Значение:', 'Value:'),
  correctText: L(
    "To'g'ri. Uchta kitob 3x, daftar 6000 so'm, jami 51000: 3x + 6000 = 51000. Bundan x = 15000.",
    'Верно. Три книги это 3x, тетрадь 6000, всего 51000: 3x + 6000 = 51000. Отсюда x = 15000.',
    'Correct. Three books are 3x, the notebook 6000, the total 51000: 3x + 6000 = 51000. Hence x = 15000.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('eq') < s.seq.indexOf('n6000'), text: L(
      "Daftarning puli ham TO'LANGAN pulning ichida: u chap tomonda, tenglik belgisidan oldin turadi.",
      'Деньги за тетрадь тоже часть заплаченного: они слева, до знака равенства.',
      'The notebook money is part of what was paid: it belongs on the left, before the equals sign.') },
    { when: (s) => s.seq[0] !== 'x3', text: L(
      "Tenglama kitoblardan boshlanadi: uchta kitob x so'mdan, ya'ni 3x.",
      'Уравнение начинается с книг: три книги по x сум, то есть 3x.',
      'The equation starts with the books: three books at x each, that is 3x.') },
    { when: (s) => s.seq.indexOf('n51000') < s.seq.indexOf('eq'), text: L(
      "51000 bu JAMI to'langan pul, ya'ni natija. U tenglik belgisidan keyin yoziladi.",
      '51000 это ВСЯ заплаченная сумма, то есть результат. Она пишется после знака равенства.',
      '51000 is the TOTAL paid, that is the result. It goes after the equals sign.') },
  ],
  wrongText: L(
    "Chap tomonga to'lovning bo'laklarini yozing: kitoblar va daftar. O'ng tomonga jami summa.",
    'Слева запиши части оплаты: книги и тетрадь. Справа общую сумму.',
    'On the left write the parts of the payment: books and notebook. On the right the total.'),
};

export default function D11_03(props) { return <BuildLine data={DATA} {...props} />; }
