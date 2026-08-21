// Dars11 · Amaliyot 09 — Yegan va qolgan · 🔴 · tag: build_boxes_eaten
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> BuildLine (answerSeq).
//
// «Ikki qutida x dona konfet bor edi, 5 donasi yeyildi, 31 donasi qoldi.»
// Tenglama: 2x − 5 = 31. (Bundan 2x = 36, x = 18.)
// Kartalar aynan beshta. Ish ikki joyda: «ikki quti» 2x ga aylanadi va
// yeyilganlar AYIRILADI.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const CARDS = [
  { id: 'x2', label: '2x' },
  { id: 'minus', label: '−' },
  { id: 'n5', label: '5' },
  { id: 'eq', label: '=' },
  { id: 'n31', label: '31' },
];

const DATA = {
  tag: 'build_boxes_eaten', level: '🔴', useAll: true,
  answerSeq: ['x2', 'minus', 'n5', 'eq', 'n31'],
  cards: CARDS,
  eyebrow: L('Yegan va qolgan', 'Съели и осталось', 'Eaten and left'),
  setup: L(
    "Ikki bir xil qutida x dona konfet bor edi. 5 donasi yeyildi va 31 donasi qoldi.",
    'В двух одинаковых коробках было по x конфет. Съели 5, и осталось 31.',
    'Two identical boxes had x sweets each. Five were eaten and 31 were left.'),
  empty: L("Kartalarni bosib tenglama yig'ing", 'Собери уравнение, нажимая карточки', 'Build the equation by tapping cards'),
  ask: L("Masalaning tenglamasini yig'ing. Hamma karta ishlatiladi.",
    'Собери уравнение к задаче. Используются все карточки.',
    'Build the equation for the problem. Every card is used.'),
  undo: L('Bitta orqaga', 'Шаг назад', 'One back'),
  valueLabel: L('Qiymat:', 'Значение:', 'Value:'),
  correctText: L(
    "To'g'ri. Ikki quti 2x, yeyilganlar ayiriladi, qolgani 31: 2x − 5 = 31. Bundan 2x = 36 va x = 18.",
    'Верно. Две коробки это 2x, съеденные вычитаются, осталось 31: 2x − 5 = 31. Отсюда 2x = 36 и x = 18.',
    'Correct. Two boxes are 2x, the eaten ones are subtracted, 31 are left: 2x − 5 = 31. Hence 2x = 36 and x = 18.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('minus') > s.seq.indexOf('eq'), text: L(
      "Yeyilgan konfetlar chap tomonda ayiriladi: ular boshlang'ich sondan ketdi, natija esa 31.",
      'Съеденные конфеты вычитаются в левой части: они ушли из начального числа, а результат 31.',
      'The eaten sweets are subtracted on the left: they went from the starting number, and the result is 31.') },
    { when: (s) => s.seq[0] !== 'x2', text: L(
      "Tenglama qutilardan boshlanadi: ikki qutida x dona, ya'ni 2x.",
      'Уравнение начинается с коробок: в двух коробках по x, то есть 2x.',
      'The equation starts with the boxes: two boxes of x each, that is 2x.') },
    { when: (s) => s.seq.indexOf('n31') < s.seq.indexOf('eq'), text: L(
      "31 bu QOLGAN konfetlar soni, ya'ni natija. U tenglik belgisidan keyin turadi.",
      '31 это ОСТАВШИЕСЯ конфеты, то есть результат. Они стоят после знака равенства.',
      '31 is what was LEFT, that is the result. It goes after the equals sign.') },
  ],
  wrongText: L(
    "Chap tomonda boshlang'ich son va undan ketgani, o'ng tomonda qolgani yoziladi.",
    'Слева записывают начальное число и то, что из него ушло, справа — остаток.',
    'On the left write the starting amount and what left it; on the right what remains.'),
};

export default function D11_09(props) { return <BuildLine data={DATA} {...props} />; }
