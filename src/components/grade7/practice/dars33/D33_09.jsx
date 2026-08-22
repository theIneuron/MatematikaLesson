// Dars33 · Amaliyot 09 — Uch chorak · 🔴 · sort · tag: quadrant_zones
// Mexanika: kit.jsx -> Zones. Raskladka: 9-o'rin `sort`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): sonlar ikki xonali va manfiy,
// qadamlar soni ikkitadan boshlanadi -- PODXOD_7SINF.md 13-band.
// (13; −8) -> IV; (−13; −8) -> III; (−13; 8) -> II. Sonlar bir xil, faqat ishoralar boshqa.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'quadrant_zones',
  level: '🔴',
  eyebrow: L(
    'Uch chorak',
    'Три четверти',
    'Three quadrants'),
  setup: L(
    'Uch nuqtada sonlar bir xil, faqat ishoralar boshqa. Chorakni ishoralar jufti hal qiladi.',
    'В трёх точках числа одинаковые, различаются только знаки. Четверть решает пара знаков.',
    'The three points share their numbers and differ only in signs. The sign pair decides the quadrant.'),
  itemSize: 20,
  zoneLbl: 104,
  zones: [
    {
      id: 'z2',
      label: L(
        'II chorak',
        'II четверть',
        'Quadrant II'),
    },
    {
      id: 'z3',
      label: L(
        'III chorak',
        'III четверть',
        'Quadrant III'),
    },
    {
      id: 'z4',
      label: L(
        'IV chorak',
        'IV четверть',
        'Quadrant IV'),
    },
  ],
  items: [
    { id: 'i1', tokens: ['(13; −8)'], zone: 'z4' },
    { id: 'i2', tokens: ['(−13; −8)'], zone: 'z3' },
    { id: 'i3', tokens: ['(−13; 8)'], zone: 'z2' },
  ],
  bank: L(
    'Nuqtalar',
    'Точки',
    'Points'),
  ask: L(
    'Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  correctText: L(
    "To'g'ri. Musbat va manfiy -- IV; ikki manfiy -- III; manfiy va musbat -- II.",
    'Верно. Плюс и минус — IV; два минуса — III; минус и плюс — II.',
    'Correct. Plus then minus gives IV; two minuses give III; minus then plus gives II.'),
  wrongs: [
    {
      when: (s) => s.bad.indexOf('i1') !== -1,
      text: L(
        "Abssissa musbat, ordinata manfiy: o'ngda va pastda -- IV chorak.",
        'Абсцисса положительная, ордината отрицательная: справа и внизу — IV четверть.',
        'Positive abscissa with negative ordinate sits right and below: quadrant IV.'),
    },
    {
      when: (s) => s.bad.indexOf('i2') !== -1,
      text: L(
        'Ikkovi ham manfiy: chapda va pastda -- III chorak.',
        'Оба отрицательные: слева и внизу — III четверть.',
        'Both negative sits left and below: quadrant III.'),
    },
    {
      when: (s) => s.bad.indexOf('i3') !== -1,
      text: L(
        'Abssissa manfiy, ordinata musbat: chapda va yuqorida -- II chorak.',
        'Абсцисса отрицательная, ордината положительная: слева и вверху — II четверть.',
        'Negative abscissa with positive ordinate sits left and above: quadrant II.'),
    },
  ],
  wrongText: L(
    "Birinchi ishora chap yoki o'ngni, ikkinchisi past yoki yuqorini beradi.",
    'Первый знак даёт лево или право, второй низ или верх.',
    'The first sign gives left or right, the second down or up.'),
};

export default function D33_09(props) { return <Zones data={DATA} {...props} />; }
