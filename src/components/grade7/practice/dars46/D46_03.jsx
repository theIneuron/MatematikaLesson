// Dars46 · Amaliyot 03 — Uch burchak, uch tomon · 🟢 · sort · tag: side_zones
// Mexanika: kit.jsx -> Zones. Raskladka: 3-o'rin.
// 85° -> eng katta tomon; 35° -> eng kichik; 60° -> o'rtadagi.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'side_zones', level: '🟢', itemSize: 24, zoneLbl: 100,
  eyebrow: L('Tomon qanday', 'Какая сторона', 'Which side'),
  setup: L(
    "Har burchak qarshisidagi tomonni aniqlash kerak: eng katta, eng kichik yoki o'rtadagi.",
    'Надо определить сторону против каждого угла: наибольшая, наименьшая или средняя.',
    'Decide the side facing each angle: largest, smallest or middle.'),
  zones: [
    { id: 'zb', label: L('Eng katta', 'Наибольшая', 'Largest') },
    { id: 'zs', label: L('Eng kichik', 'Наименьшая', 'Smallest') },
    { id: 'zm', label: L("O'rtadagi", 'Средняя', 'Middle') },
  ],
  items: [
    { id: 'i1', tokens: ['85°'], zone: 'zb' },
    { id: 'i2', tokens: ['35°'], zone: 'zs' },
    { id: 'i3', tokens: ['60°'], zone: 'zm' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L('Burchaklar', 'Углы', 'Angles'),
  correctText: L(
    "To'g'ri. 85 > 60 > 35, ya'ni tomonlar ham shu tartibda: katta, o'rta, kichik.",
    'Верно. 85 > 60 > 35, значит и стороны в том же порядке: большая, средняя, малая.',
    'Correct. 85 > 60 > 35, so the sides follow: largest, middle, smallest.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "85° eng katta burchak, ya'ni uning qarshisida eng katta tomon yotadi.",
      '85° наибольший угол, значит против него наибольшая сторона.',
      '85° is the largest angle, so it faces the largest side.') },
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "35° eng kichik burchak: qarshisida eng kichik tomon.",
      '35° наименьший угол: против него наименьшая сторона.',
      '35° is the smallest angle: it faces the smallest side.') },
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "60° o'rtada turadi: 35 dan katta, 85 dan kichik.",
      '60° стоит в середине: больше 35 и меньше 85.',
      '60° sits in the middle: above 35 and below 85.') },
  ],
  wrongText: L(
    "Burchaklarni kattalik bo'yicha tartiblang, keyin tomonlarni shu tartibda joylang.",
    'Упорядочи углы по величине, потом расставь стороны в том же порядке.',
    'Order the angles by size, then match the sides in the same order.'),
};

export default function D46_03(props) { return <Zones data={DATA} {...props} />; }
