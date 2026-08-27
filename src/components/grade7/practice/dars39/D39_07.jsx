// Dars39 · Amaliyot 07 — Yana bir tanlov · 🟡 · chain · tag: comb_chain
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 7-o'rin `chain`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): manfiy va kasr koeffitsiyent,
// ikki qadamli savol, yaqin tuzoq -- PODXOD_7SINF.md 13-band.
// 3 · 5 = 15, keyin yana 2 variantli tanlov: 15 · 2 = 30.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'comb_chain',
  level: '🟡',
  eyebrow: L(
    'Zanjir',
    'Цепочка',
    'A chain'),
  setup: L(
    "Birinchi qatorda ikki bosqich, ikkinchi qatorda esa uchinchi tanlov qo'shiladi.",
    'В первой строке два этапа, во второй добавляется третий выбор.',
    'The first row has two stages, the second adds a third choice.'),
  given: [['3', ',', '5', ';', L('keyin', 'потом', 'then'), '2']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  rows: [
    [{ t: [L('ikki', 'два', 'two'), L('bosqich', 'этап', 'stage'), '='] }, { slot: 0 }],
    [{ t: [L('uchinchisi', 'третья', 'the third'), L('bilan', 'с', 'with'), '='] }, { slot: 1 }],
  ],
  cards: ['15', '30', '8', '10'],
  answer: ['15', '30'],
  ask: L(
    "Kartani bosing, keyin bo'sh katakni bosing.",
    'Нажми карточку, затем клетку.',
    'Tap a card, then tap a cell.'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. 3 · 5 = 15, keyin 15 · 2 = 30.",
    'Верно. 3 · 5 = 15, затем 15 · 2 = 30.',
    'Correct. 3 · 5 = 15, then 15 · 2 = 30.'),
  wrongs: [
    {
      when: (s) => s.slots[0] === '8',
      text: L(
        "8 bu 3 + 5. Bosqichlar ko'paytiriladi.",
        '8 это 3 + 5. Этапы умножаются.',
        '8 is 3 + 5. Stages multiply.'),
    },
    {
      when: (s) => s.slots[1] === '10',
      text: L(
        "10 bu 5 · 2. Uchinchi tanlov JAMI 15 ga ko'paytiriladi.",
        '10 это 5 · 2. Третий выбор умножается на ВСЕ 15.',
        '10 is 5 · 2. The third choice multiplies all 15.'),
    },
    {
      when: (s) => s.slots.indexOf(null) !== -1,
      text: L(
        "Hamma bo'sh katak to'ldirilishi kerak.",
        'Надо заполнить все клетки.',
        'Every cell must be filled.'),
    },
  ],
  wrongText: L(
    "Yangi tanlov jami variantga ko'paytiriladi.",
    'Новый выбор умножается на всё количество.',
    'A new choice multiplies the whole count.'),
};

export default function D39_07(props) { return <SlotsBank data={DATA} {...props} />; }
