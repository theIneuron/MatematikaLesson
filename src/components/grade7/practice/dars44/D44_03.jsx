// Dars44 · Amaliyot 03 — Uchinchi va tashqi · 🟢 · slots · tag: sum_third_ext
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 3-o'rin `slots`.
// 55° va 65° -> uchinchisi 180 − 120 = 60°; uning tashqi burchagi 180 − 60 = 120°.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'sum_third_ext',
  level: '🟢',
  eyebrow: L(
    'Uchinchi burchak',
    'Третий угол',
    'The third angle'),
  setup: L(
    "Ikki burchak berilgan. Uchinchisini toping, keyin uning tashqi burchagini yozing: tashqi burchak ichkisining qo'shnisi.",
    'Даны два угла. Найди третий, потом запиши его внешний угол: внешний это смежный с внутренним.',
    'Two angles are given. Find the third, then its exterior angle: the exterior is adjacent to the interior.'),
  given: [['55°', L('va', 'и', 'and'), '65°']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  rows: [[{ t: [L('uchinchi', 'третья', 'the third'), '='] }, { slot: 0 }, { t: [L('tashqi', 'внешний', 'exterior'), '='] }, { slot: 1 }]],
  cards: ['60°', '120°', '70°', '110°'],
  answer: ['60°', '120°'],
  ask: L(
    "Kartani bosing, keyin bo'sh katakni bosing.",
    'Нажми карточку, затем клетку.',
    'Tap a card, then tap a cell.'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. 55 + 65 = 120, ya'ni uchinchisi 180 − 120 = 60. Tashqi burchak 180 − 60 = 120.",
    'Верно. 55 + 65 = 120, значит третий 180 − 120 = 60. Внешний угол 180 − 60 = 120.',
    'Correct. 55 + 65 = 120, so the third is 180 − 120 = 60. The exterior is 180 − 60 = 120.'),
  wrongs: [
    {
      when: (s) => s.slots[0] === '70°',
      text: L(
        "70° chiqishi uchun ayirish 190 dan qilingan. Yig'indi 180.",
        'Чтобы вышло 70, вычитали из 190. Сумма равна 180.',
        '70° subtracts from 190. The sum is 180.'),
    },
    {
      when: (s) => s.slots[1] === '110°',
      text: L(
        "110° bu 180 − 70. Tashqi burchak uchinchi burchakning (60) qo'shnisi.",
        '110° это 180 − 70. Внешний угол смежный с третьим углом (60).',
        '110° is 180 − 70. The exterior is adjacent to the third angle (60).'),
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
    "Ikki burchakni qo'shib 180 dan ayiring, keyin natijani yana 180 dan ayiring.",
    'Сложи два угла, вычти из 180, потом полученное снова вычти из 180.',
    'Add the two angles, subtract from 180, then subtract that result from 180 again.'),
};

export default function D44_03(props) { return <SlotsBank data={DATA} {...props} />; }
