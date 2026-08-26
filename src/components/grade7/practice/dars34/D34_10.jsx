// Dars34 · Amaliyot 10 — Ikki qadamli zanjir · 🔴 · chain · tag: fn_chain
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 10-o'rin `chain`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): sonlar ikki xonali va manfiy,
// qadamlar soni ikkitadan boshlanadi -- PODXOD_7SINF.md 13-band.
// f(x) = 2x − 9: f(7) = 5, keyin f(5) = 1. Birinchi natija ikkinchi qatorda ARGUMENT bo'ladi.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'fn_chain',
  level: '🔴',
  eyebrow: L(
    'Zanjir',
    'Цепочка',
    'A chain'),
  setup: L(
    "Birinchi qatorning natijasi ikkinchi qatorda argument bo'ladi. Ikki qadamni ketma-ket bajaring.",
    'Результат первой строки становится аргументом во второй. Выполни два шага подряд.',
    "The first row's result becomes the second row's argument. Do both steps in turn."),
  given: [['f(x) = 2x − 9']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  rows: [
    [{ t: ['f(7)', '='] }, { slot: 0 }],
    [{ t: [L('undan', 'от него', 'from it'), L('keyin', 'потом', 'then'), L('f(natija)', 'f(результат)', 'f(result)'), '='] }, { slot: 1 }],
  ],
  cards: ['5', '1', '−9', '11'],
  answer: ['5', '1'],
  ask: L(
    'Kartani bosing, keyin uyani bosing.',
    'Нажми карточку, затем клетку.',
    'Tap a card, then tap a cell.'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. f(7) = 14 − 9 = 5, keyin f(5) = 10 − 9 = 1.",
    'Верно. f(7) = 14 − 9 = 5, затем f(5) = 10 − 9 = 1.',
    'Correct. f(7) = 14 − 9 = 5, then f(5) = 10 − 9 = 1.'),
  wrongs: [
    {
      when: (s) => s.slots[1] === '11',
      text: L(
        '11 chiqishi uchun f(10) hisoblangan. Ikkinchi qatorda argument BIRINCHI natija: 5.',
        'Чтобы вышло 11, считали f(10). Во второй строке аргумент это ПЕРВЫЙ результат: 5.',
        '11 comes from f(10). The second row takes the FIRST result, 5, as its argument.'),
    },
    {
      when: (s) => s.slots[0] === '−9',
      text: L(
        '−9 bu f(0). Bizga f(7) kerak: 2 · 7 = 14.',
        '−9 это f(0). А нам нужно f(7): 2 · 7 = 14.',
        '−9 is f(0). We need f(7): 2 · 7 = 14.'),
    },
    {
      when: (s) => s.slots.indexOf(null) !== -1,
      text: L(
        "Hamma uya to'ldirilishi kerak.",
        'Надо заполнить все клетки.',
        'Every cell must be filled.'),
    },
  ],
  wrongText: L(
    "Avval f(7) ni hisoblang, chiqqan sonni yana funksiyaga qo'ying.",
    'Сначала посчитай f(7), потом подставь результат снова в функцию.',
    'Compute f(7) first, then feed that result back into the function.'),
};

export default function D34_10(props) { return <SlotsBank data={DATA} {...props} />; }
