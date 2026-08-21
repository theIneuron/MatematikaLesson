// Dars39 · Amaliyot 09 — Uch natija · 🔴 · sort · tag: comb_zones
// Mexanika: kit.jsx -> Zones. Raskladka: 9-o'rin.
// 4 · 3 = 12;  3 · 3 = 9;  3 · 2 = 6. Sonlar yaqin, farqi tanlov turida.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'comb_zones', level: '🔴', itemSize: 22, zoneLbl: 74,
  eyebrow: L('Uch natija', 'Три результата', 'Three results'),
  setup: L(
    "Uch yozuvda sonlar yaqin. Har birini hisoblab, natijasiga qo'ying.",
    'В трёх записях числа близкие. Посчитай каждую и поставь к своему результату.',
    'The three records have close numbers. Work each out and place it.'),
  zones: [
    { id: 'z12', label: L('12', '12', '12') },
    { id: 'z9', label: L('9', '9', '9') },
    { id: 'z6', label: L('6', '6', '6') },
  ],
  items: [
    { id: 'i1', tokens: ['4', '·', '3'], zone: 'z12' },
    { id: 'i2', tokens: ['3', '·', '3'], zone: 'z9' },
    { id: 'i3', tokens: ['3', '·', '2'], zone: 'z6' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L('Yozuvlar', 'Записи', 'Records'),
  correctText: L(
    "To'g'ri. 4 · 3 = 12, 3 · 3 = 9, 3 · 2 = 6. Bitta ko'paytuvchi o'zgarsa natija ham o'zgaradi.",
    'Верно. 4 · 3 = 12, 3 · 3 = 9, 3 · 2 = 6. Меняется один множитель — меняется и результат.',
    'Correct. 4 · 3 = 12, 3 · 3 = 9, 3 · 2 = 6. One factor changes, the result changes.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "4 · 3 = 12: birinchi tanlovda to'rt variant bor.",
      '4 · 3 = 12: в первом выборе четыре варианта.',
      '4 · 3 = 12: the first choice has four options.') },
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "3 · 3 = 9: ikki tanlov ham uch variantli, ya'ni takrorlash mumkin.",
      '3 · 3 = 9: у обоих выборов три варианта, значит повтор разрешён.',
      '3 · 3 = 9: both choices have three options, so repeats are allowed.') },
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "3 · 2 = 6: ikkinchi qadamda variant bittaga kamaygan.",
      '3 · 2 = 6: на втором шаге вариантов стало на один меньше.',
      '3 · 2 = 6: the second step has one fewer option.') },
  ],
  wrongText: L(
    "Har yozuvni oxirigacha hisoblang: ikki sonni ko'paytiring.",
    'Досчитай каждую запись: перемножь два числа.',
    'Finish each record: multiply the two numbers.'),
};

export default function D39_09(props) { return <Zones data={DATA} {...props} />; }
