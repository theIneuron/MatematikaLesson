// Dars48 · Amaliyot 08 — Uch to'plam, uch sabab · 🔴 · sort · tag: rev_zones
// Mexanika: kit.jsx -> Zones. Raskladka: 8-o'rin `sort`.
// 50/60/70 -> uchburchak bor; 90/60/40 = 190 -> yig'indi buzilgan; tomonlar 2, 3, 9 -> tengsizlik buzilgan.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'rev_zones',
  level: '🔴',
  eyebrow: L(
    "Nega bo'lmaydi",
    'Почему нельзя',
    'Why not'),
  setup: L(
    "Uchburchak ikki sababdan bo'lmasligi mumkin: burchaklar yig'indisi buzilsa yoki tomonlar tengsizligi buzilsa. Har to'plamni sababiga ko'ra joylashtiring.",
    'Треугольника может не быть по двум причинам: нарушена сумма углов или нарушено неравенство сторон. Размести каждый набор по причине.',
    'A triangle can fail for two reasons: the angle sum or the side inequality. Sort each set by its reason.'),
  itemSize: 17,
  zoneLbl: 112,
  zones: [
    {
      id: 'ze',
      label: L(
        'Uchburchak bor',
        'Треугольник есть',
        'It exists'),
    },
    {
      id: 'zs',
      label: L(
        "Yig'indi buzilgan",
        'Сумма нарушена',
        'Sum broken'),
    },
    {
      id: 'zi',
      label: L(
        'Tengsizlik buzilgan',
        'Неравенство нарушено',
        'Inequality broken'),
    },
  ],
  items: [
    { id: 'i1', tokens: ['50°, 60°, 70°'], zone: 'ze' },
    { id: 'i2', tokens: ['90°, 60°, 40°'], zone: 'zs' },
    { id: 'i3', tokens: [L('tomonlar 2, 3, 9', 'стороны 2, 3, 9', 'sides 2, 3, 9')], zone: 'zi' },
  ],
  bank: L(
    "To'plamlar",
    'Наборы',
    'Sets'),
  ask: L(
    'Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  correctText: L(
    "To'g'ri. 50 + 60 + 70 = 180 -- bor; 90 + 60 + 40 = 190 -- yig'indi buzilgan; 2 + 3 = 5 < 9 -- tengsizlik buzilgan.",
    'Верно. 50 + 60 + 70 = 180 — есть; 90 + 60 + 40 = 190 — нарушена сумма; 2 + 3 = 5 < 9 — нарушено неравенство.',
    'Correct. 50 + 60 + 70 = 180 exists; 90 + 60 + 40 = 190 breaks the sum; 2 + 3 = 5 < 9 breaks the inequality.'),
  wrongs: [
    {
      when: (s) => s.bad.indexOf('i1') !== -1,
      text: L(
        '50 + 60 + 70 = 180: shart bajarildi.',
        '50 + 60 + 70 = 180: условие выполнено.',
        '50 + 60 + 70 = 180: the condition holds.'),
    },
    {
      when: (s) => s.bad.indexOf('i2') !== -1,
      text: L(
        "Bu yerda burchaklar berilgan, ya'ni yig'indi tekshiriladi: 190 ko'p.",
        'Здесь даны углы, значит проверяется сумма: 190 это много.',
        'Angles are given here, so the sum is tested: 190 is too much.'),
    },
    {
      when: (s) => s.bad.indexOf('i3') !== -1,
      text: L(
        "Bu yerda tomonlar berilgan, ya'ni tengsizlik tekshiriladi: 2 + 3 < 9.",
        'Здесь даны стороны, значит проверяется неравенство: 2 + 3 < 9.',
        'Sides are given here, so the inequality is tested: 2 + 3 < 9.'),
    },
  ],
  wrongText: L(
    "Avval qarang: to'plamda burchaklar bormi yoki tomonlar. Tekshirish shundan keyin tanlanadi.",
    'Сначала посмотри: в наборе углы или стороны. Проверка выбирается уже потом.',
    'First see whether the set holds angles or sides; the test follows from that.'),
};

export default function D48_08(props) { return <Zones data={DATA} {...props} />; }
