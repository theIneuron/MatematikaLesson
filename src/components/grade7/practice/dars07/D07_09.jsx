// Dars07 · Amaliyot 09 — Shartdan tenglamaga · 🔴 · tag: compose_equation
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> BuildLine (answerSeq).
//
// «Bir son o'ylandi, u 4 ga ko'paytirildi va 9 ayirildi, natija 15 chiqdi.»
// Tenglama: 4x − 9 = 15.
// Bu teskari yo'l: hisoblash emas, MODEL tuzish. Kartalar aynan beshta,
// ya'ni ish tartibda: qaysi amal qaysi joyda turadi va tenglik belgisi
// qayerga tushadi.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const CARDS = [
  { id: 'x4', label: '4x' },
  { id: 'minus', label: '−' },
  { id: 'n9', label: '9' },
  { id: 'eq', label: '=' },
  { id: 'n15', label: '15' },
];

const DATA = {
  tag: 'compose_equation', level: '🔴', useAll: true,
  answerSeq: ['x4', 'minus', 'n9', 'eq', 'n15'],
  cards: CARDS,
  eyebrow: L('Shartdan tenglamaga', 'Из условия в уравнение', 'From words to an equation'),
  setup: L(
    "Bir son o'ylandi. U 4 ga ko'paytirildi, keyin natijadan 9 ayirildi va 15 chiqdi.",
    'Задумали число. Его умножили на 4, потом из результата вычли 9 и получили 15.',
    'A number was thought of. It was multiplied by 4, then 9 was taken from the result, giving 15.'),
  empty: L("Kartalarni bosib tenglama yig'ing", 'Собери уравнение, нажимая карточки', 'Build the equation by tapping cards'),
  ask: L("Shu shartning tenglamasini yig'ing. Hamma karta ishlatiladi.",
    'Собери уравнение по этому условию. Используются все карточки.',
    'Build the equation for these words. Every card is used.'),
  undo: L('Bitta orqaga', 'Шаг назад', 'One back'),
  valueLabel: L('Qiymat:', 'Значение:', 'Value:'),
  correctText: L(
    "To'g'ri. O'ylangan son x, uni 4 ga ko'paytirdik: 4x. Keyin 9 ayirildi va natija 15: 4x − 9 = 15.",
    'Верно. Задуманное число x, умножили на 4: 4x. Потом вычли 9, а результат 15: 4x − 9 = 15.',
    'Correct. The number is x, multiplied by 4 gives 4x. Then 9 was taken away and the result is 15: 4x − 9 = 15.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('eq') < s.seq.indexOf('n9'), text: L(
      "Tenglik belgisi natijadan OLDIN turadi: chap tomonda amallar, o'ng tomonda 15.",
      'Знак равенства стоит ПЕРЕД результатом: слева действия, справа 15.',
      'The equals sign goes BEFORE the result: the operations on the left, 15 on the right.') },
    { when: (s) => s.seq[0] !== 'x4', text: L(
      "Tenglama o'ylangan sondan boshlanadi: uni 4 ga ko'paytirdik, ya'ni 4x birinchi turadi.",
      'Уравнение начинается с задуманного числа: его умножили на 4, значит 4x стоит первым.',
      'The equation starts with the number thought of: it was multiplied by 4, so 4x comes first.') },
    { when: (s) => s.seq.indexOf('n15') < s.seq.indexOf('eq'), text: L(
      "15 bu NATIJA, u tenglik belgisidan keyin yoziladi.",
      '15 это РЕЗУЛЬТАТ, он пишется после знака равенства.',
      'The 15 is the RESULT, it goes after the equals sign.') },
  ],
  wrongText: L(
    "Shartni tartib bilan yozing: 4x, keyin 9 ayirildi, keyin tenglik va natija.",
    'Записывай условие по порядку: 4x, потом вычли 9, потом равенство и результат.',
    'Write the words in order: 4x, then 9 taken away, then the equals sign and the result.'),
};

export default function D07_09(props) { return <BuildLine data={DATA} {...props} />; }
