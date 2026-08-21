// Dars08 · Amaliyot 03 — Nimani ko'chirish kerak · 🟡 · tag: what_to_move
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TapTerms.
//
// 7x + 4 = 2x − 11. Maqsad: noma'lumlar CHAP tomonda, sonlar O'NG tomonda
// to'plansin. Ya'ni ko'chirish kerak:
//   4   -- chap tomondan o'ngga (son)
//   2x  -- o'ng tomondan chapga (noma'lum)
// 7x va −11 esa o'z joyida qoladi.
// Xato: hamma hadni belgilash yoki faqat bittasini belgilash.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'what_to_move', level: '🟡', exprSize: 27,
  eyebrow: L("Nimani ko'chirish", 'Что переносить', 'What to move'),
  setup: L(
    "Tenglamani yechish uchun noma'lumlarni bir tomonga, sonlarni ikkinchi tomonga to'playmiz. Hamma had ko'chmaydi -- ba'zilari o'z joyida qoladi.",
    'Чтобы решить уравнение, неизвестные собирают в одну часть, а числа в другую. Переносятся не все слагаемые — часть остаётся на месте.',
    'To solve the equation the unknowns go to one side and the numbers to the other. Not every term moves — some stay where they are.'),
  ask: L("Boshqa tomonga KO'CHIRISH kerak bo'lgan hadlarni belgilang.", 'Отметь слагаемые, которые надо ПЕРЕНЕСТИ в другую часть.', 'Mark the terms that must MOVE to the other side.'),
  note: L("Noma'lumlar chapda, sonlar o'ngda to'planadi.", 'Неизвестные собираем слева, числа справа.', 'Unknowns go left, numbers go right.'),
  parts: [
    { k: 'term', id: 't1', v: '7x' },
    { k: 'sign', v: '+' },
    { k: 'term', id: 't2', v: '4' },
    { k: 'op', v: '=' },
    { k: 'term', id: 't3', v: '2x' },
    { k: 'sign', v: '−' },
    { k: 'term', id: 't4', v: '11' },
  ],
  want: ['t2', 't3'],
  correctText: L(
    "To'g'ri. 4 chap tomondan o'ngga, 2x esa o'ng tomondan chapga ko'chadi. 7x va −11 o'z joyida qoladi: 7x − 2x = −11 − 4.",
    'Верно. Четвёрка уходит слева направо, а 2x справа налево. 7x и −11 остаются на месте: 7x − 2x = −11 − 4.',
    'Correct. The 4 goes from left to right and 2x from right to left. The 7x and −11 stay: 7x − 2x = −11 − 4.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('t1') !== -1 || s.extra.indexOf('t4') !== -1, text: L(
      "7x allaqachon chapda, −11 esa allaqachon o'ngda: ular kerakli tomonda turibdi, ko'chirish shart emas.",
      '7x уже слева, а −11 уже справа: они стоят в нужной части, переносить их незачем.',
      '7x is already on the left and −11 already on the right: they are on the right side, no need to move them.') },
    { when: (s) => s.miss.length === 1, text: L(
      "Bittasi qoldi: IKKI had ko'chadi -- chapdagi son va o'ngdagi noma'lum.",
      'Одно осталось: переносятся ДВА слагаемых — число слева и неизвестное справа.',
      'One is left: TWO terms move — the number on the left and the unknown on the right.') },
  ],
  wrongText: L(
    "Har hadga qarang: u KERAKLI tomondami? Son o'ngda, noma'lum chapda bo'lishi kerak.",
    'Смотри на каждое слагаемое: оно в НУЖНОЙ части? Число должно быть справа, неизвестное слева.',
    'Look at each term: is it on the RIGHT side? Numbers belong right, unknowns left.'),
};

export default function D08_03(props) { return <TapTerms data={DATA} {...props} />; }
