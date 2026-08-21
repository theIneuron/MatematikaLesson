// Dars08 · Amaliyot 04 — Yechim qadamlari · 🟡 · tag: solve_steps
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SlotsBank.
//
// 7x + 4 = 2x − 11 (3-topshiriqdagi tenglama, endi oxirigacha).
//   ko'chirish:  7x − 2x = −11 − 4
//   yig'ish:     5x = −15
//   bo'lish:     x = −3
// Tekshirish: 7 · (−3) + 4 = −17 va 2 · (−3) − 11 = −17.
// Kartalar orasida 9x (ayirish o'rniga qo'shgan), −7 (11 dan 4 ayirgan),
// 3 (ishorani tashlab ketgan) turadi.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'solve_steps', level: '🟡',
  eyebrow: L('Yechim qadamlari', 'Шаги решения', 'The steps of the solution'),
  setup: L(
    "Hadlar ko'chirildi. Endi har tomonni yig'ish va koeffitsiyentga bo'lish qoldi.",
    'Слагаемые перенесены. Осталось собрать каждую часть и разделить на коэффициент.',
    'The terms have moved. What is left is collecting each side and dividing by the coefficient.'),
  rows: [
    [{ t: ['7x', '+', '4', '=', '2x', '−', '11'] }],
    [{ t: ['7x', '−', '2x', '=', '−11', '−', '4'] }],
    [{ slot: 0 }, { t: ['='] }, { slot: 1 }],
    [{ t: ['x', '='] }, { slot: 2 }],
  ],
  cards: ['5x', '−15', '−3', '9x', '−7', '3'],
  answer: ['5x', '−15', '−3'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 7x − 2x = 5x, −11 − 4 = −15, keyin −15 : 5 = −3. Tekshirish: 7 · (−3) + 4 = −17 va 2 · (−3) − 11 = −17.",
    'Верно. 7x − 2x = 5x, −11 − 4 = −15, затем −15 : 5 = −3. Проверка: 7 · (−3) + 4 = −17 и 2 · (−3) − 11 = −17.',
    'Correct. 7x − 2x = 5x, −11 − 4 = −15, then −15 : 5 = −3. Check: 7 · (−3) + 4 = −17 and 2 · (−3) − 11 = −17.'),
  wrongs: [
    { when: (s) => s.slots[0] === '9x', text: L(
      "2x ko'chirilganda ishorasi o'zgardi, ya'ni u AYIRILADI: 7x − 2x = 5x.",
      'При переносе 2x знак поменялся, значит оно ВЫЧИТАЕТСЯ: 7x − 2x = 5x.',
      'When 2x moved its sign flipped, so it is SUBTRACTED: 7x − 2x = 5x.') },
    { when: (s) => s.slots[1] === '−7', text: L(
      "O'ng tomonda ikki son ham manfiy: −11 − 4 = −15. Ular bir-biridan ayirilmaydi.",
      'Справа оба числа отрицательные: −11 − 4 = −15. Их не вычитают друг из друга.',
      'Both numbers on the right are negative: −11 − 4 = −15. They are not taken from each other.') },
    { when: (s) => s.slots[2] === '3', text: L(
      "Ishora: −15 ni 5 ga bo'lsak manfiy son chiqadi, x = −3.",
      'Знак: если −15 разделить на 5, получится отрицательное число, x = −3.',
      'The sign: −15 divided by 5 is a negative number, x = −3.') },
  ],
  wrongText: L(
    "Har tomonni alohida yig'ing: chapda o'xshash hadlar, o'ngda sonlar. Keyin koeffitsiyentga bo'ling.",
    'Собери каждую часть отдельно: слева подобные слагаемые, справа числа. Потом раздели на коэффициент.',
    'Collect each side separately: like terms on the left, numbers on the right. Then divide by the coefficient.'),
};

export default function D08_04(props) { return <SlotsBank data={DATA} {...props} />; }
