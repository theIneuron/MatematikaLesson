// Dars11 · Amaliyot 06 — Alida nechta marka · 🟡 · tag: solve_twice
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
//
// x + 2x = 36 -> 3x = 36 -> x = 12. Ya'ni Alida 12 dona, Boburda 24 dona.
// Savol ALI haqida: 24 deb javob berish -- eng ko'p uchraydigan xato, chunki
// tenglamani yechgandan keyin «kimning soni so'ralgani» esdan chiqadi.
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'solve_twice', level: '🟡', allowNeg: false, target: 12,
  eyebrow: L('Kimning soni', 'Чьё число', 'Whose number'),
  setup: L(
    "Alida x dona marka, Boburda ikki barobar ko'p, ikkovida 36 dona. Tenglama: x + 2x = 36.",
    'У Али x марок, у Бобура в два раза больше, вместе 36. Уравнение: x + 2x = 36.',
    'Ali has x stamps, Bobur twice as many, together 36. The equation: x + 2x = 36.'),
  expr: ['x', '+', '2x', '=', '36'], exprSize: 30,
  label: L('Alida nechta marka bor?', 'Сколько марок у Али?', 'How many stamps does Ali have?'),
  correctText: L(
    "To'g'ri. 3x = 36, x = 12. Alida 12 dona, Boburda 24 dona; ikkovida 36 -- shart bajarildi.",
    'Верно. 3x = 36, x = 12. У Али 12, у Бобура 24; вместе 36 — условие выполнено.',
    'Correct. 3x = 36, x = 12. Ali has 12, Bobur 24; together 36 — the condition holds.'),
  wrongs: [
    { when: (s) => s.value === 24, text: L(
      "24 bu BOBURNING markasi. Savol Alida nechta bor degani, ya'ni x ning o'zi: 12.",
      '24 это марки БОБУРА. Вопрос про Али, то есть про сам x: 12.',
      '24 is BOBUR\'S stamps. The question is about Ali, that is x itself: 12.') },
    { when: (s) => s.value === 36, text: L(
      "36 bu ikkovining markasi. Alining ulushi esa uchdan biri.",
      '36 это марки обоих. А доля Али — треть от этого.',
      '36 is both boys\' stamps. Ali\'s share is a third of it.') },
    { when: (s) => s.value === 18, text: L(
      "18 chiqishi uchun 36 ikkiga bo'lingan. Lekin markalar TENG emas: Boburda ikki barobar ko'p, ya'ni jami uchta ulush bor.",
      'Чтобы вышло 18, 36 разделили на два. Но марок не равное число: у Бобура вдвое больше, то есть всего три доли.',
      'To get 18 the 36 was halved. But the stamps are not equal: Bobur has twice as many, so there are three shares in all.') },
  ],
  wrongText: L(
    "x + 2x ni yig'ing: 3x = 36. Keyin x ni topib, savolga qaytib qarang -- kim so'ralgan?",
    'Собери x + 2x: 3x = 36. Потом найди x и вернись к вопросу — про кого спрашивают?',
    'Collect x + 2x: 3x = 36. Then find x and look back at the question — who is asked about?'),
};

export default function D11_06(props) { return <TypeValue data={DATA} {...props} />; }
