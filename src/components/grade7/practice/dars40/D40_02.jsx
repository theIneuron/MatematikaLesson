// Dars40 · Amaliyot 02 — Qo'shnisi, keyin yarmi · 🟢 · chain · tag: ang_chain
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 2-o'rin `chain`.
// 118° -> qo'shnisi 62° -> bissektrisa 31°. Ikki qadam ketma-ket.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'ang_chain',
  level: '🟢',
  eyebrow: L(
    'Ikki qadam',
    'Два шага',
    'Two steps'),
  setup: L(
    "Avval qo'shni burchak topiladi, keyin unga bissektrisa o'tkaziladi: bissektrisa burchakni ikki teng bo'lakka bo'ladi.",
    'Сначала находим смежный угол, потом проводим его биссектрису: она делит угол на две равные части.',
    'First find the adjacent angle, then draw its bisector: it splits the angle into two equal parts.'),
  given: [['118°']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  rows: [
    [{ t: [L("qo'shni", 'смежный', 'adjacent'), L('burchak', 'угол', 'angle'), '='] }, { slot: 0 }],
    [{ t: [L('bissektrisa', 'биссектриса', 'bisector'), L('bergan', 'полученный', 'resulting'), L('burchak', 'угол', 'angle'), '='] }, { slot: 1 }],
  ],
  cards: ['62°', '31°', '59°', '29°'],
  answer: ['62°', '31°'],
  ask: L(
    "Kartani bosing, keyin bo'sh katakni bosing.",
    'Нажми карточку, затем клетку.',
    'Tap a card, then tap a cell.'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. 180 − 118 = 62, keyin 62 : 2 = 31.",
    'Верно. 180 − 118 = 62, затем 62 : 2 = 31.',
    'Correct. 180 − 118 = 62, then 62 : 2 = 31.'),
  wrongs: [
    {
      when: (s) => s.slots[0] === '59°',
      text: L(
        "59° bu 118 : 2, ya'ni berilgan burchakning yarmi. Avval QO'SHNI burchak kerak.",
        '59° это 118 : 2, половина данного угла. Сначала нужен СМЕЖНЫЙ угол.',
        '59° is 118 : 2, half of the given angle. The ADJACENT angle comes first.'),
    },
    {
      when: (s) => s.slots[1] === '29°',
      text: L(
        "29° chiqishi uchun 58 ikkiga bo'lingan. Qo'shni burchak 62, uning yarmi 31.",
        'Чтобы вышло 29, делили 58. Смежный угол 62, его половина 31.',
        'To get 29 the halving used 58. The adjacent angle is 62 and its half is 31.'),
    },
    {
      when: (s) => s.slots.indexOf(null) !== -1,
      text: L(
        "Ikki bo'sh katak ham to'ldirilishi kerak.",
        'Надо заполнить обе клетки.',
        'Both cells must be filled.'),
    },
  ],
  wrongText: L(
    "Birinchi qatorda 180 dan ayiring, ikkinchi qatorda chiqqan sonni ikkiga bo'ling.",
    'В первой строке вычти из 180, во второй раздели полученное на два.',
    'Subtract from 180 in the first row, then halve that result in the second.'),
};

export default function D40_02(props) { return <SlotsBank data={DATA} {...props} />; }
