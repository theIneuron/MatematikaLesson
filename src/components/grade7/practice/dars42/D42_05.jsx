// Dars42 · Amaliyot 05 — To'g'ri burchakli uchburchak · 🟡 · slots · tag: tri_right
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 5-o'rin.
// 90° va 35° -> uchinchisi 55°. Uning tashqi burchagi 180 − 55 = 125°.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'tri_right', level: '🟡',
  eyebrow: L("To'g'ri burchakli", 'Прямоугольный', 'Right-angled'),
  setup: L(
    "Bir burchak 90 gradus bo'lsa, qolgan ikkovi birga 90 beradi. Tashqi burchak esa qo'shni burchak sifatida topiladi.",
    'Если один угол 90 градусов, два остальных вместе дают 90. А внешний угол находится как смежный.',
    'With one angle at 90, the other two make 90 together. The exterior angle comes as the adjacent one.'),
  given: [['90°', 'va', '35°']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  rows: [
    [{ t: ['uchinchisi', '='] }, { slot: 0 }, { t: ['tashqi', 'burchagi', '='] }, { slot: 1 }],
  ],
  cards: ['55°', '125°', '145°', '35°'],
  answer: ['55°', '125°'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 180 − 90 − 35 = 55, keyin 180 − 55 = 125.",
    'Верно. 180 − 90 − 35 = 55, потом 180 − 55 = 125.',
    'Correct. 180 − 90 − 35 = 55, then 180 − 55 = 125.'),
  wrongs: [
    { when: (s) => s.slots[0] === '145°', text: L(
      "145 chiqishi uchun faqat 35 ayirilgan. To'g'ri burchak ham hisobga olinishi kerak.",
      'Чтобы вышло 145, вычли только 35. Прямой угол тоже надо учесть.',
      'To get 145 only the 35 was subtracted. The right angle counts too.') },
    { when: (s) => s.slots[1] === '35°', text: L(
      "Tashqi burchak uchinchi burchakning qo'shnisi: 180 − 55 = 125.",
      'Внешний угол смежный третьему: 180 − 55 = 125.',
      'The exterior angle is adjacent to the third: 180 − 55 = 125.') },
  ],
  wrongText: L(
    "180 dan ikki burchakni ayiring, keyin natijaning qo'shnisini toping.",
    'Вычти из 180 два угла, потом найди смежный к результату.',
    'Subtract both angles from 180, then take the adjacent of the result.'),
};

export default function D42_05(props) { return <SlotsBank data={DATA} {...props} />; }
