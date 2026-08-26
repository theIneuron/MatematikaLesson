// Dars12 · Amaliyot 10 — Uch tenglama, uch javob · 🔴 · tag: word_answer_zones
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
//
// Uch masaladan uch tenglama (tekshirilgan):
//   4x = 96     -> x = 24
//   2x = 72     -> x = 36
//   x : 2 = 30  -> x = 60
// Uchinchisi ATAYLAB bo'lish bilan: «x ni ikkiga bo'lsak 30» degan shart
// javobni KO'PAYTIRISH bilan beradi -- ko'p uchraydigan chalkashlik.
// TARTIB SAQLANADI (`noShuffle`): razbor yozuvlarga TARTIB bilan murojaat
// qiladi («ikkinchi tenglamada...»), aralashtirilsa izoh ekrandagiga mos
// kelmay qoladi.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'word_answer_zones', level: '🔴', noShuffle: true, itemSize: 20, zoneLbl: 96,
  eyebrow: L('Uch javob', 'Три ответа', 'Three answers'),
  setup: L(
    "Uch masaladan uch tenglama chiqdi. Har birini yechib, javobi bo'yicha zonaga qo'ying.",
    'Из трёх задач вышли три уравнения. Реши каждое и положи в зону своего ответа.',
    'Three problems gave three equations. Solve each and put it in the zone of its answer.'),
  zones: [
    { id: 'z24', label: L('24', '24', '24') },
    { id: 'z36', label: L('36', '36', '36') },
    { id: 'z60', label: L('60', '60', '60') },
  ],
  items: [
    { id: 'i1', tokens: ['4x', '=', '96'], zone: 'z24' },
    { id: 'i2', tokens: ['2x', '=', '72'], zone: 'z36' },
    { id: 'i3', tokens: ['x', ':', '2', '=', '30'], zone: 'z60' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L('Tenglamalar', 'Уравнения', 'Equations'),
  correctText: L(
    "To'g'ri. 96 : 4 = 24; 72 : 2 = 36; oxirgisida esa bo'lish teskarisiga aylanadi: x = 30 · 2 = 60.",
    'Верно. 96 : 4 = 24; 72 : 2 = 36; а в последнем деление обращается умножением: x = 30 · 2 = 60.',
    'Correct. 96 : 4 = 24; 72 : 2 = 36; and in the last one the division turns into a multiplication: x = 30 · 2 = 60.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "Uchinchi tenglamada noma'lum BO'LINADI: x : 2 = 30. Uni topish uchun 30 ni 2 ga KO'PAYTIRISH kerak.",
      'В третьем уравнении неизвестное ДЕЛИТСЯ: x : 2 = 30. Чтобы его найти, 30 надо УМНОЖИТЬ на 2.',
      'In the third equation the unknown is DIVIDED: x : 2 = 30. To find it, 30 is MULTIPLIED by 2.') },
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "Ikkinchi tenglamada 2x = 72, ya'ni x = 72 : 2 = 36.",
      'Во втором уравнении 2x = 72, значит x = 72 : 2 = 36.',
      'In the second equation 2x = 72, so x = 72 : 2 = 36.') },
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "Birinchi tenglamada 4x = 96, ya'ni x = 96 : 4 = 24.",
      'В первом уравнении 4x = 96, значит x = 96 : 4 = 24.',
      'In the first equation 4x = 96, so x = 96 : 4 = 24.') },
  ],
  wrongText: L(
    "Har tenglamada noma'lum ko'paytiriladimi yoki bo'linadimi -- shunga qarab teskari amalni bajaring.",
    'Смотри, умножается неизвестное или делится, — и выполняй обратное действие.',
    'See whether the unknown is multiplied or divided, and do the opposite operation.'),
};

export default function D12_10(props) { return <Zones data={DATA} {...props} />; }
