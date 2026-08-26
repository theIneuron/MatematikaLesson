// Dars40 · Amaliyot 07 — Uch juftlik · 🟡 · sort · tag: ang_pair_zones
// Mexanika: kit.jsx -> Zones. Raskladka: 7-o'rin `sort`.
// Vertikal juft teng; qo'shni juft 180 beradi; 47° va 43° hech qaysi turga kirmaydi (90 ga to'ldiradi).
// TARTIB SAQLANADI (`noShuffle`): razbor yozuvlarga TARTIB bilan murojaat
// qiladi, aralashtirilsa izoh ekrandagiga mos kelmaydi.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'ang_pair_zones', noShuffle: true,
  level: '🟡',
  eyebrow: L(
    'Uch juftlik',
    'Три пары',
    'Three pairs'),
  setup: L(
    "Har juftlikni turiga ko'ra joylashtiring. Uchinchi juftlik na teng, na 180 beradi: u 90 gradusga to'ldiradi.",
    'Размести каждую пару по её типу. Третья пара ни равна, ни даёт 180: она дополняет до 90 градусов.',
    'Sort each pair by its kind. The third pair is neither equal nor 180: it completes 90 degrees.'),
  itemSize: 20,
  zoneLbl: 104,
  zones: [
    {
      id: 'zt',
      label: L(
        'Teng',
        'Равны',
        'Equal'),
    },
    {
      id: 'zs',
      label: L(
        "Yig'indisi 180°",
        'В сумме 180°',
        'Sum is 180°'),
    },
    {
      id: 'zn',
      label: L(
        'Boshqa holat',
        'Другой случай',
        'Neither'),
    },
  ],
  items: [
    { id: 'i1', tokens: [L('47° va 47°', '47° и 47°', '47° and 47°')], zone: 'zt' },
    { id: 'i2', tokens: [L('47° va 133°', '47° и 133°', '47° and 133°')], zone: 'zs' },
    { id: 'i3', tokens: [L('47° va 43°', '47° и 43°', '47° and 43°')], zone: 'zn' },
  ],
  bank: L(
    'Juftliklar',
    'Пары',
    'Pairs'),
  ask: L(
    'Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  correctText: L(
    "To'g'ri. Vertikal burchaklar teng, qo'shni burchaklar 180 beradi, 47 va 43 esa faqat 90 ga to'ldiradi.",
    'Верно. Вертикальные равны, смежные дают 180, а 47 и 43 дополняют только до 90.',
    'Correct. Vertical angles are equal, adjacent ones give 180, while 47 and 43 only make 90.'),
  wrongs: [
    {
      when: (s) => s.bad.indexOf('i3') !== -1,
      text: L(
        "47 + 43 = 90. Bu qo'shni burchaklar emas, chunki ular to'g'ri chiziqni to'ldirmaydi.",
        '47 + 43 = 90. Это не смежные углы: они не дополняют до прямой.',
        '47 + 43 = 90. These are not adjacent: they do not make a straight line.'),
    },
    {
      when: (s) => s.bad.indexOf('i2') !== -1,
      text: L(
        "47 + 133 = 180, ya'ni bu qo'shni burchaklar juftligi.",
        '47 + 133 = 180, значит это пара смежных углов.',
        '47 + 133 = 180, so this pair is adjacent.'),
    },
    {
      when: (s) => s.bad.indexOf('i1') !== -1,
      text: L(
        "Bir xil ikki son -- bu teng burchaklar, vertikal juftlik shunday bo'ladi.",
        'Два одинаковых числа это равные углы, так бывает у вертикальной пары.',
        'Two equal numbers mean equal angles, as a vertical pair gives.'),
    },
  ],
  wrongText: L(
    "Har juftlikni qo'shib ko'ring: 180 chiqsa -- qo'shni, sonlar bir xil bo'lsa -- teng.",
    'Сложи каждую пару: вышло 180 это смежные, числа одинаковы это равные.',
    'Add each pair: 180 means adjacent, identical numbers mean equal.'),
};

export default function D40_07(props) { return <Zones data={DATA} {...props} />; }
