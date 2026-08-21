// Dars40 · Amaliyot 07 — Uch holat · 🟡 · sort · tag: seg_zones
// Mexanika: kit.jsx -> Zones. Raskladka: 7-o'rin.
// AB = 20, AC = 12 -> CB = 8;  AB = 20, AC = 8 -> CB = 12;
// AC = 8, CB = 12 -> AB = 20.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'seg_zones', level: '🟡', itemSize: 19, zoneLbl: 74,
  eyebrow: L('Uch holat', 'Три случая', 'Three cases'),
  setup: L(
    "Uch holatda bir xil sonlar: 8, 12 va 20. Har holatda nima so'ralganiga qarab amal o'zgaradi.",
    'В трёх случаях одни числа: 8, 12 и 20. Действие меняется в зависимости от того, что спрашивают.',
    'The three cases share 8, 12 and 20. The operation depends on what is asked.'),
  zones: [
    { id: 'z8', label: L('8', '8', '8') },
    { id: 'z12', label: L('12', '12', '12') },
    { id: 'z20', label: L('20', '20', '20') },
  ],
  items: [
    { id: 'i1', tokens: ['AB', '=', '20,', 'AC', '=', '12', '→', 'CB'], zone: 'z8' },
    { id: 'i2', tokens: ['AB', '=', '20,', 'AC', '=', '8', '→', 'CB'], zone: 'z12' },
    { id: 'i3', tokens: ['AC', '=', '8,', 'CB', '=', '12', '→', 'AB'], zone: 'z20' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L('Holatlar', 'Случаи', 'Cases'),
  correctText: L(
    "To'g'ri. Butun so'ralganda qo'shiladi, bo'lak so'ralganda ayiriladi.",
    'Верно. Когда спрашивают целое — складывают, когда часть — вычитают.',
    'Correct. Asking for the whole means adding; asking for a part means subtracting.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "Uchinchi holatda BUTUN kesma so'ralgan: 8 + 12 = 20.",
      'В третьем случае спрашивают ВЕСЬ отрезок: 8 + 12 = 20.',
      'The third case asks for the WHOLE: 8 + 12 = 20.') },
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "Birinchi holatda bo'lak so'ralgan: 20 − 12 = 8.",
      'В первом случае спрашивают часть: 20 − 12 = 8.',
      'The first case asks for a part: 20 − 12 = 8.') },
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "Ikkinchi holatda 20 − 8 = 12.",
      'Во втором случае 20 − 8 = 12.',
      'The second case gives 20 − 8 = 12.') },
  ],
  wrongText: L(
    "Har holatda so'ralgan narsa butunmi yoki bo'lak? Shu amalni belgilaydi.",
    'В каждом случае спрашивают целое или часть? Это и задаёт действие.',
    'In each case, is the whole or a part asked? That sets the operation.'),
};

export default function D40_07(props) { return <Zones data={DATA} {...props} />; }
