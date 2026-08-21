// Dars45 · Amaliyot 10 — Uch juftlik · 🔴 · sort · tag: par_zones
// Mexanika: kit.jsx -> Zones. Raskladka: 10-o'rin.
// 70° va 70° -> teng juft;  70° va 110° -> yig'indisi 180;
// 70° va 50° -> parallel chiziqlarda bunday juft yo'q.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'par_zones', level: '🔴', itemSize: 20, zoneLbl: 104,
  eyebrow: L('Uch juftlik', 'Три пары', 'Three pairs'),
  setup: L(
    "Parallel chiziqlarda burchaklar yo teng, yo 180 gradusga to'ldiradi. Uchinchi juftlik ikkalasiga ham to'g'ri kelmaydi.",
    'При параллельных прямых углы либо равны, либо дополняют до 180. Третья пара не подходит ни под одно.',
    'With parallel lines angles are either equal or complete 180. The third pair fits neither.'),
  zones: [
    { id: 'zt', label: L('Teng', 'Равны', 'Equal') },
    { id: 'zs', label: L("Yig'indisi 180°", 'В сумме 180°', 'Sum is 180°') },
    { id: 'zn', label: L("Bunday juft yo'q", 'Такой пары нет', 'No such pair') },
  ],
  items: [
    { id: 'i1', tokens: ['70°', 'va', '70°'], zone: 'zt' },
    { id: 'i2', tokens: ['70°', 'va', '110°'], zone: 'zs' },
    { id: 'i3', tokens: ['70°', 'va', '50°'], zone: 'zn' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L('Juftliklar', 'Пары', 'Pairs'),
  correctText: L(
    "To'g'ri. 70 va 70 teng; 70 + 110 = 180; 70 va 50 esa na teng, na 180 beradi -- parallel chiziqlarda bunday juft chiqmaydi.",
    'Верно. 70 и 70 равны; 70 + 110 = 180; а 70 и 50 ни равны, ни дают 180 — при параллельных такой пары нет.',
    'Correct. 70 and 70 are equal; 70 + 110 = 180; but 70 and 50 are neither — no such pair with parallel lines.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "70 va 50: yig'indisi 120, teng ham emas. Parallel chiziqlarda bunday juftlik bo'lmaydi.",
      '70 и 50: сумма 120, и не равны. При параллельных прямых такой пары не бывает.',
      '70 and 50: they sum to 120 and are not equal. Parallel lines never give such a pair.') },
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "70 + 110 = 180: bu bir tomonli burchaklar juftligi.",
      '70 + 110 = 180: это пара односторонних углов.',
      '70 + 110 = 180: a pair of same-side angles.') },
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "70 va 70 teng: bu mos yoki almashinuvchi burchaklar.",
      '70 и 70 равны: это соответственные или накрест лежащие углы.',
      '70 and 70 are equal: corresponding or alternate angles.') },
  ],
  wrongText: L(
    "Har juftlikni ikki savol bilan tekshiring: teng emasmi, yig'indisi 180 emasmi?",
    'Проверь каждую пару двумя вопросами: не равны ли, не даёт ли сумма 180?',
    'Test each pair twice: are they equal, or do they sum to 180?'),
};

export default function D45_10(props) { return <Zones data={DATA} {...props} />; }
