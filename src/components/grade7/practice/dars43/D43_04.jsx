// Dars43 · Amaliyot 04 — Teng yonlimi · 🟡 · sort · tag: iso_zones
// Mexanika: kit.jsx -> Zones. Raskladka: 4-o'rin `sort`.
// 7, 7, 10 -> tomonlar bo'yicha teng yonli; 40°, 40° -> burchaklar bo'yicha teng yonli; 6, 7, 8 -> teng yonli emas.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'iso_zones',
  level: '🟡',
  eyebrow: L(
    'Teng yonlimi',
    'Равнобедренный ли',
    'Isosceles or not'),
  setup: L(
    "Teng yonlilikni ikki yo'l bilan ko'rish mumkin: teng tomonlardan yoki teng burchaklardan. Uchinchi holatda ikkovi ham yo'q.",
    'Равнобедренность видно двумя путями: по равным сторонам или по равным углам. В третьем случае нет ни того, ни другого.',
    'Isosceles shows up two ways: equal sides or equal angles. The third case has neither.'),
  itemSize: 18,
  zoneLbl: 112,
  zones: [
    {
      id: 'zs',
      label: L(
        'Tomonlardan',
        'По сторонам',
        'By sides'),
    },
    {
      id: 'za',
      label: L(
        'Burchaklardan',
        'По углам',
        'By angles'),
    },
    {
      id: 'zn',
      label: L(
        'Teng yonli emas',
        'Не равнобедренный',
        'Not isosceles'),
    },
  ],
  items: [
    { id: 'i1', tokens: ['7, 7, 10'], zone: 'zs' },
    { id: 'i2', tokens: ['40°, 40°, 100°'], zone: 'za' },
    { id: 'i3', tokens: ['6, 7, 8'], zone: 'zn' },
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
    "To'g'ri. Ikki teng tomon yoki ikki teng burchak -- ikkovi ham teng yonlilikni beradi. 6, 7, 8 da esa hech narsa teng emas.",
    'Верно. Две равные стороны или два равных угла — и то и то даёт равнобедренность. А в 6, 7, 8 равных нет.',
    'Correct. Two equal sides or two equal angles both give isosceles. In 6, 7, 8 nothing is equal.'),
  wrongs: [
    {
      when: (s) => s.bad.indexOf('i1') !== -1,
      text: L(
        "7 va 7 -- teng tomonlar, ya'ni belgi TOMONLARDAN ko'rinadi.",
        '7 и 7 это равные стороны, значит признак виден ПО СТОРОНАМ.',
        '7 and 7 are equal sides, so the sign shows BY SIDES.'),
    },
    {
      when: (s) => s.bad.indexOf('i2') !== -1,
      text: L(
        '40 va 40 -- teng burchaklar, teskari xossa ishlaydi.',
        '40 и 40 это равные углы, работает обратное свойство.',
        '40 and 40 are equal angles, the converse applies.'),
    },
    {
      when: (s) => s.bad.indexOf('i3') !== -1,
      text: L(
        "6, 7, 8 -- uch tomon ham boshqa. Teng yonlilik yo'q.",
        '6, 7, 8 это три разные стороны. Равнобедренности нет.',
        '6, 7, 8 are three different sides. Not isosceles.'),
    },
  ],
  wrongText: L(
    "Har to'plamda bir xil ikki son borligini tekshiring va ular tomon yoki burchak ekanini qarang.",
    'Проверь в каждом наборе, есть ли два одинаковых числа, и посмотри, стороны это или углы.',
    'Check each set for two identical numbers and see whether they are sides or angles.'),
};

export default function D43_04(props) { return <Zones data={DATA} {...props} />; }
