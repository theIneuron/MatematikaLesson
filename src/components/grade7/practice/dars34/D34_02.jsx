// Dars34 · Amaliyot 02 — Uch qiymat · 🟢 · sort · tag: fn_values_zones
// Mexanika: kit.jsx -> Zones. Raskladka: 2-o'rin.
// f(x) = 2x: f(3) = 6, f(0) = 0, f(−1) = −2.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'fn_values_zones', level: '🟢', itemSize: 22, zoneLbl: 74,
  eyebrow: L('Qiymatlar', 'Значения', 'Values'),
  setup: L(
    "f(x) = 2x formulasi har songa o'z qiymatini beradi. Har yozuvni hisoblab, javobiga qo'ying.",
    'Формула f(x) = 2x даёт каждому числу своё значение. Посчитай каждую запись и поставь к ответу.',
    'The rule f(x) = 2x gives each number its value. Work each out and place it.'),
  zones: [
    { id: 'z6', label: L('6', '6', '6') },
    { id: 'z0', label: L('0', '0', '0') },
    { id: 'zm', label: L('−2', '−2', '−2') },
  ],
  items: [
    { id: 'i1', tokens: ['f(3)'], zone: 'z6' },
    { id: 'i2', tokens: ['f(0)'], zone: 'z0' },
    { id: 'i3', tokens: ['f(−1)'], zone: 'zm' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L('Yozuvlar', 'Записи', 'Records'),
  correctText: L(
    "To'g'ri. 2 · 3 = 6, 2 · 0 = 0, 2 · (−1) = −2.",
    'Верно. 2 · 3 = 6, 2 · 0 = 0, 2 · (−1) = −2.',
    'Correct. 2 · 3 = 6, 2 · 0 = 0, 2 · (−1) = −2.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "f(−1) da manfiy son qo'yiladi: 2 · (−1) = −2.",
      'В f(−1) подставляется отрицательное число: 2 · (−1) = −2.',
      'In f(−1) a negative number goes in: 2 · (−1) = −2.') },
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "f(0) da 2 · 0 = 0: nol nol beradi.",
      'В f(0) выходит 2 · 0 = 0: нуль даёт нуль.',
      'In f(0) we get 2 · 0 = 0: zero gives zero.') },
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "f(3) da 2 · 3 = 6.",
      'В f(3) выходит 2 · 3 = 6.',
      'In f(3) we get 2 · 3 = 6.') },
  ],
  wrongText: L(
    "Qavs ichidagi sonni formulaga qo'ying va ikkiga ko'paytiring.",
    'Подставь число из скобки в формулу и умножь на два.',
    'Put the number from the bracket into the rule and double it.'),
};

export default function D34_02(props) { return <Zones data={DATA} {...props} />; }
