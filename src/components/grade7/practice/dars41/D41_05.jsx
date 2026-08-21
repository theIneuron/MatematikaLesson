// Dars41 · Amaliyot 05 — Uch burchak turi · 🟡 · sort · tag: ang_zones
// Mexanika: kit.jsx -> Zones. Raskladka: 5-o'rin.
// 35° -> o'tkir;  90° -> to'g'ri;  120° -> o'tmas.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'ang_zones', level: '🟡', itemSize: 24, zoneLbl: 84,
  eyebrow: L('Burchak turlari', 'Виды углов', 'Kinds of angles'),
  setup: L(
    "Har burchakni o'z turiga ajratish kerak. Chegara 90 daraja: undan kichik, teng yoki katta.",
    'Каждый угол надо отнести к своему виду. Граница 90 градусов: меньше, равно или больше.',
    'Sort each angle by kind. The boundary is 90 degrees: below, equal, or above.'),
  zones: [
    { id: 'zo', label: L("O'tkir", 'Острый', 'Acute') },
    { id: 'zt', label: L("To'g'ri", 'Прямой', 'Right') },
    { id: 'zm', label: L("O'tmas", 'Тупой', 'Obtuse') },
  ],
  items: [
    { id: 'i1', tokens: ['35°'], zone: 'zo' },
    { id: 'i2', tokens: ['90°'], zone: 'zt' },
    { id: 'i3', tokens: ['120°'], zone: 'zm' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L('Burchaklar', 'Углы', 'Angles'),
  correctText: L(
    "To'g'ri. 35 < 90 -- o'tkir; 90 -- to'g'ri; 120 > 90 -- o'tmas.",
    'Верно. 35 < 90 — острый; 90 — прямой; 120 > 90 — тупой.',
    'Correct. 35 < 90 acute; 90 right; 120 > 90 obtuse.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "120 > 90, ya'ni o'tmas burchak. Yoyilgan bo'lishi uchun u 180 bo'lishi kerak edi.",
      '120 > 90, значит тупой. Развёрнутым он был бы при 180.',
      '120 > 90, so obtuse. It would be straight only at 180.') },
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "35 < 90, ya'ni o'tkir burchak.",
      '35 < 90, значит острый угол.',
      '35 < 90, so an acute angle.') },
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "90 aynan to'g'ri burchak: na o'tkir, na o'tmas.",
      '90 это ровно прямой угол: ни острый, ни тупой.',
      '90 is exactly a right angle: neither acute nor obtuse.') },
  ],
  wrongText: L(
    "Har burchakni 90 daraja bilan solishtiring.",
    'Сравни каждый угол с 90 градусами.',
    'Compare each angle with 90 degrees.'),
};

export default function D41_05(props) { return <Zones data={DATA} {...props} />; }
