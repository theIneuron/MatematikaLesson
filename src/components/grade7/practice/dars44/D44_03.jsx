// Dars44 · Amaliyot 03 — Ikki burchakni topish · 🟢 · slots · tag: iso_slots
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 3-o'rin.
// Asos burchagi 40° -> ikkinchi asos burchagi ham 40°, uchi 180 − 80 = 100°.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'iso_slots', level: '🟢',
  eyebrow: L('Ikki burchak', 'Два угла', 'Two angles'),
  setup: L(
    "Bitta asos burchagi ma'lum. Ikkinchisi unga teng, uchi esa 180 dan ikkovini ayirish bilan topiladi.",
    'Известен один угол при основании. Второй равен ему, а угол при вершине это 180 минус два первых.',
    'One base angle is known. The other equals it, and the apex is 180 minus both.'),
  given: [['asos', 'burchagi', '=', '40°']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  rows: [
    [{ t: ['ikkinchi', 'asos', 'burchagi', '='] }, { slot: 0 }, { t: ['uchi', '='] }, { slot: 1 }],
  ],
  cards: ['40°', '100°', '140°', '50°'],
  answer: ['40°', '100°'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Ikkinchi asos burchagi ham 40°, uchi esa 180 − 80 = 100°.",
    'Верно. Второй угол при основании тоже 40°, а угол при вершине 180 − 80 = 100°.',
    'Correct. The second base angle is 40° too, and the apex is 180 − 80 = 100°.'),
  wrongs: [
    { when: (s) => s.slots[1] === '140°', text: L(
      "140 chiqishi uchun faqat bitta 40 ayirilgan. Asos burchagi IKKITA.",
      'Чтобы вышло 140, вычли только одну сорокаградусную. Углов при основании ДВА.',
      'To get 140 only one 40 was subtracted. There are TWO base angles.') },
    { when: (s) => s.slots[0] === '50°' || s.slots[1] === '50°', text: L(
      "50 bu 90 − 40. Bu yerda to'g'ri burchak yo'q, uchburchak burchaklari 180 beradi.",
      '50 это 90 − 40. Здесь нет прямого угла, а сумма углов треугольника 180.',
      '50 is 90 − 40. There is no right angle here; the angles sum to 180.') },
  ],
  wrongText: L(
    "Asosdagi ikki burchak teng. Ularni qo'shib 180 dan ayiring.",
    'Два угла при основании равны. Сложи их и вычти из 180.',
    'The two base angles are equal. Add them and subtract from 180.'),
};

export default function D44_03(props) { return <SlotsBank data={DATA} {...props} />; }
