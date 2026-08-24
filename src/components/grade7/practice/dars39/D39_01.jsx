// Dars39 · Amaliyot 01 — Ikki bosqich · 🟢 · slots · tag: comb_slots
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 1-o'rin `slots`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): manfiy va kasr koeffitsiyent,
// ikki qadamli savol, yaqin tuzoq -- PODXOD_7SINF.md 13-band.
// 4 ko'ylak va 6 shim -> 24; ustiga 2 shlyapa -> 48.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'comb_slots',
  level: '🟢',
  eyebrow: L(
    'Ikki bosqich',
    'Два этапа',
    'Two stages'),
  setup: L(
    "Har bosqichdagi variantlar KO'PAYTIRILADI. Ikki uyani to'ldiring: avval ikki bosqich, keyin uchinchisi qo'shilgan holat.",
    'Варианты каждого этапа УМНОЖАЮТСЯ. Заполни две клетки: сначала два этапа, потом с добавленным третьим.',
    'Choices at each stage MULTIPLY. Fill both cells: two stages first, then with a third added.'),
  given: [['4', ',', '6', ',', '2']],
  givenLabel: L(
    'Variantlar:',
    'Варианты:',
    'Choices:'),
  rows: [
    [{ t: ["ko'ylak", 'va', 'shim', '='] }, { slot: 0 }],
    [{ t: ['shlyapa', 'bilan', '='] }, { slot: 1 }],
  ],
  cards: ['24', '48', '10', '12'],
  answer: ['24', '48'],
  ask: L(
    'Kartani bosing, keyin uyani bosing.',
    'Нажми карточку, затем клетку.',
    'Tap a card, then tap a cell.'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. 4 · 6 = 24, keyin 24 · 2 = 48.",
    'Верно. 4 · 6 = 24, затем 24 · 2 = 48.',
    'Correct. 4 · 6 = 24, then 24 · 2 = 48.'),
  wrongs: [
    {
      when: (s) => s.slots[0] === '10',
      text: L(
        "10 bu 4 + 6. Bosqichlar KO'PAYTIRILADI, qo'shilmaydi.",
        '10 это 4 + 6. Этапы УМНОЖАЮТСЯ, а не складываются.',
        '10 is 4 + 6. Stages MULTIPLY, not add.'),
    },
    {
      when: (s) => s.slots[1] === '12',
      text: L(
        "12 bu 4 · 2 yoki 6 · 2. Uchinchi bosqich JAMI variantga ko'paytiriladi: 24 · 2.",
        '12 это 4 · 2 или 6 · 2. Третий этап умножается на ВСЁ количество: 24 · 2.',
        '12 is 4 · 2 or 6 · 2. The third stage multiplies the WHOLE count: 24 · 2.'),
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
    "Har bosqichda variantlar ko'paytiriladi.",
    'На каждом этапе варианты умножаются.',
    'Each stage multiplies the count.'),
};

export default function D39_01(props) { return <SlotsBank data={DATA} {...props} />; }
