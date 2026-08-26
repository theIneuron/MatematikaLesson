// Dars39 · Amaliyot 02 — Qo'shish yoki ko'paytirish · 🟢 · choice · tag: comb_choice
// Mexanika: kit.jsx -> Choice. Raskladka: 2-o'rin `choice`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): manfiy va kasr koeffitsiyent,
// ikki qadamli savol, yaqin tuzoq -- PODXOD_7SINF.md 13-band.
// Bir yo'lni tanlash -- YOKI, ya'ni qo'shish: 3 + 5 = 8. Ketma-ket tanlash bo'lsa ko'paytirilardi.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'comb_choice',
  level: '🟢',
  eyebrow: L(
    "Qo'shish yoki ko'paytirish",
    'Сложить или умножить',
    'Add or multiply'),
  setup: L(
    "Uchta avtobus va beshta poyezd bor. Bolaga BITTA yo'l kerak: avtobusda yoki poyezdda.",
    'Есть три автобуса и пять поездов. Нужен ОДИН способ доехать: на автобусе или на поезде.',
    'Three buses and five trains. Only ONE way is needed: by bus or by train.'),
  given: [['3', L('avtobus', 'автобус', 'bus'), ',', '5', L('poyezd', 'поезд', 'train')]],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  ask: L(
    "Nechta yo'l bor?",
    'Сколько всего способов?',
    'How many ways in all?'),
  opts: [{ label: '8' }, { label: '15' }, { label: '35' }, { label: '2' }],
  correct: 0,
  optCols: 2,
  correctText: L(
    "To'g'ri. Bitta yo'l tanlanadi: avtobus YOKI poyezd, ya'ni 3 + 5 = 8.",
    'Верно. Выбирается один способ: автобус ИЛИ поезд, значит 3 + 5 = 8.',
    'Correct. One way is chosen: bus OR train, so 3 + 5 = 8.'),
  wrongs: [
    {
      when: (s) => s.picked === 1,
      text: L(
        "15 bu 3 · 5. Ko'paytirish avtobusda VA poyezdda ketma-ket yurganda bo'ladi.",
        '15 это 3 · 5. Умножение подходит, когда едут на автобусе И потом на поезде.',
        '15 is 3 · 5. Multiplying fits a bus AND then a train.'),
    },
    {
      when: (s) => s.picked === 2,
      text: L(
        "35 hech qaysi qoidaga to'g'ri kelmaydi.",
        '35 не отвечает ни одному правилу.',
        '35 matches no rule here.'),
    },
    {
      when: (s) => s.picked === 3,
      text: L(
        "2 bu transport TURLARI soni, yo'llar soni emas.",
        '2 это число ВИДОВ транспорта, а не число способов.',
        '2 counts the KINDS of transport, not the ways.'),
    },
  ],
  wrongText: L(
    "«Yoki» -- qo'shish, «va» -- ko'paytirish.",
    '«Или» это сложение, «и» это умножение.',
    '"Or" adds, "and" multiplies.'),
};

export default function D39_02(props) { return <Choice data={DATA} {...props} />; }
