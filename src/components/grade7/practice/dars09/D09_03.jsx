// Dars09 · Amaliyot 03 — To'liq yechim · 🟡 · tag: full_solution
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SlotsBank.
//
// 2(x + 5) = 3x − 4 (1-topshiriqdagi tenglama, endi oxirigacha).
//   qavs:        2x + 10 = 3x − 4
//   ko'chirish:  2x − 3x = −4 − 10
//   yig'ish:     −x = −14
//   bo'lish:     x = 14
// Tekshirish: 2 · (14 + 5) = 38 va 3 · 14 − 4 = 38.
// −x = −14 dan x = 14 chiqishi -- eng nozik joy: ikki tomon (−1) ga
// bo'linadi. Kartalar orasida −14 ham bor, ya'ni «ishorani ko'chirmaslik»
// xatosi tutiladi.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'full_solution', level: '🟡',
  eyebrow: L("To'liq yechim", 'Полное решение', 'The full solution'),
  setup: L(
    "Qavs ochildi va hadlar ko'chirildi. Endi o'xshashlarni yig'ish va ildizni topish qoldi.",
    'Скобка раскрыта, слагаемые перенесены. Осталось привести подобные и найти корень.',
    'The bracket is open and the terms have moved. What is left is collecting like terms and finding the root.'),
  rows: [
    [{ t: ['2x', '+', '10', '=', '3x', '−', '4'] }],
    [{ t: ['2x', '−', '3x', '=', '−4', '−', '10'] }],
    [{ slot: 0 }, { t: ['=', '−14'] }],
    [{ t: ['x', '='] }, { slot: 1 }],
  ],
  cards: ['−x', '14', '5x', '−14', 'x', '−6'],
  answer: ['−x', '14'],
  ask: L("Kartani bosing, keyin bo'sh katakni bosing.", 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 2x − 3x = −x, −4 − 10 = −14. So'ng ikki tomon (−1) ga bo'linadi va x = 14 chiqadi. Tekshirish: ikki tomon ham 38.",
    'Верно. 2x − 3x = −x, −4 − 10 = −14. Затем обе части делятся на (−1) и выходит x = 14. Проверка: обе части дают 38.',
    'Correct. 2x − 3x = −x, −4 − 10 = −14. Then both sides are divided by (−1) and x = 14. Check: both sides give 38.'),
  wrongs: [
    { when: (s) => s.slots[0] === '5x', text: L(
      "3x ko'chirilganda ishorasi o'zgargan: 2x − 3x = −x, ya'ni koeffitsiyent manfiy.",
      'При переносе 3x знак поменялся: 2x − 3x = −x, то есть коэффициент отрицательный.',
      'When 3x moved its sign flipped: 2x − 3x = −x, so the coefficient is negative.') },
    { when: (s) => s.slots[0] === 'x', text: L(
      "Chap tomonda koeffitsiyent manfiy: 2x − 3x = −x, oddiy x emas.",
      'Слева коэффициент отрицательный: 2x − 3x = −x, а не просто x.',
      'The coefficient on the left is negative: 2x − 3x = −x, not just x.') },
    { when: (s) => s.slots[1] === '−14', text: L(
      "−x = −14 hali javob emas: chap tomonda MINUS x turibdi. Ikki tomonni (−1) ga bo'lsak x = 14 chiqadi.",
      '−x = −14 это ещё не ответ: слева стоит МИНУС x. Разделив обе части на (−1), получаем x = 14.',
      '−x = −14 is not the answer yet: the left side is MINUS x. Dividing both sides by (−1) gives x = 14.') },
  ],
  wrongText: L(
    "Har tomonni yig'ing, keyin chap tomondagi minusdan qutuling: ikki tomonni (−1) ga bo'ling.",
    'Собери каждую часть, потом избавься от минуса слева: раздели обе части на (−1).',
    'Collect each side, then get rid of the minus on the left: divide both sides by (−1).'),
};

export default function D09_03(props) { return <SlotsBank data={DATA} {...props} />; }
