// Dars12 · Amaliyot 03 — Sarflandi va qoldi · 🟡 · tag: build_spent
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> BuildLine (answerSeq).
//
// «Madinada x so'm bor edi, 4500 so'm sarfladi, 12500 so'm qoldi.»
// Tenglama: x − 4500 = 12500. (Bundan x = 17000.)
// Kartalar aynan beshta: ish sarflangan pulning AYIRILISHIDA.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const CARDS = [
  { id: 'x', label: 'x' },
  { id: 'minus', label: '−' },
  { id: 'n4500', label: '4500' },
  { id: 'eq', label: '=' },
  { id: 'n12500', label: '12500' },
];

const DATA = {
  tag: 'build_spent', level: '🟡', useAll: true,
  answerSeq: ['x', 'minus', 'n4500', 'eq', 'n12500'],
  cards: CARDS,
  eyebrow: L('Sarflandi va qoldi', 'Потратила и осталось', 'Spent and left'),
  setup: L(
    "Madinada x so'm bor edi. U 4500 so'm sarfladi va 12500 so'm qoldi.",
    'У Мадины было x сум. Она потратила 4500 сум, и осталось 12500 сум.',
    'Madina had x sum. She spent 4500 and 12500 were left.'),
  empty: L("Kartalarni bosib tenglama yig'ing", 'Собери уравнение, нажимая карточки', 'Build the equation by tapping cards'),
  ask: L("Masalaning tenglamasini yig'ing. Hamma karta ishlatiladi.",
    'Собери уравнение к задаче. Используются все карточки.',
    'Build the equation for the problem. Every card is used.'),
  undo: L('Bitta orqaga', 'Шаг назад', 'One back'),
  valueLabel: L('Qiymat:', 'Значение:', 'Value:'),
  correctText: L(
    "To'g'ri. Sarflangan pul boshlang'ich summadan AYIRILADI, qolgani esa natija: x − 4500 = 12500. Bundan x = 17000.",
    'Верно. Потраченное ВЫЧИТАЕТСЯ из начальной суммы, а остаток — результат: x − 4500 = 12500. Отсюда x = 17000.',
    'Correct. What was spent is SUBTRACTED from the starting amount and what is left is the result: x − 4500 = 12500. Hence x = 17000.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('minus') > s.seq.indexOf('eq'), text: L(
      "Sarflangan pul chap tomonda ayiriladi: u boshlang'ich summadan ketdi.",
      'Потраченное вычитается в левой части: оно ушло из начальной суммы.',
      'What was spent is subtracted on the left: it went from the starting amount.') },
    { when: (s) => s.seq[0] !== 'x', text: L(
      "Tenglama boshlang'ich summadan boshlanadi: bu x, ya'ni bizga noma'lum son.",
      'Уравнение начинается с начальной суммы: это x, неизвестное нам число.',
      'The equation starts with the starting amount: that is x, the number we do not know.') },
    { when: (s) => s.seq.indexOf('n12500') < s.seq.indexOf('eq'), text: L(
      "12500 bu QOLGAN pul, ya'ni natija. U tenglik belgisidan keyin yoziladi.",
      '12500 это ОСТАВШИЕСЯ деньги, то есть результат. Они пишутся после знака равенства.',
      '12500 is the money LEFT, that is the result. It goes after the equals sign.') },
  ],
  wrongText: L(
    "Chap tomonda: bor edi va sarflandi. O'ng tomonda: qolgani.",
    'Слева: было и потратили. Справа: осталось.',
    'On the left: what there was and what was spent. On the right: what remains.'),
};

export default function D12_03(props) { return <BuildLine data={DATA} {...props} />; }
