// Dars42 · Amaliyot 07 — Uchburchak turlari · 🟡 · sort · tag: tri_zones
// Mexanika: kit.jsx -> Zones. Raskladka: 7-o'rin.
// 60/60/60 -> o'tkir burchakli; 90/45/45 -> to'g'ri burchakli;
// 120/30/30 -> o'tmas burchakli.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'tri_zones', level: '🟡', itemSize: 19, zoneLbl: 104,
  eyebrow: L('Uchburchak turi', 'Вид треугольника', 'Kind of triangle'),
  setup: L(
    "Turi eng KATTA burchakka qarab aytiladi: uchtasi ham o'tkir bo'lsa o'tkir burchakli, biri to'g'ri bo'lsa to'g'ri burchakli.",
    'Вид определяется по НАИБОЛЬШЕМУ углу: все острые — остроугольный, есть прямой — прямоугольный.',
    'The kind follows the LARGEST angle: all acute means acute-angled, one right means right-angled.'),
  zones: [
    { id: 'zo', label: L("O'tkir burchakli", 'Остроугольный', 'Acute-angled') },
    { id: 'zt', label: L("To'g'ri burchakli", 'Прямоугольный', 'Right-angled') },
    { id: 'zm', label: L("O'tmas burchakli", 'Тупоугольный', 'Obtuse-angled') },
  ],
  items: [
    { id: 'i1', tokens: ['60°', '60°', '60°'], zone: 'zo' },
    { id: 'i2', tokens: ['90°', '45°', '45°'], zone: 'zt' },
    { id: 'i3', tokens: ['120°', '30°', '30°'], zone: 'zm' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L('Uchburchaklar', 'Треугольники', 'Triangles'),
  correctText: L(
    "To'g'ri. Uch to'plamda ham yig'indi 180, farq esa eng katta burchakda.",
    'Верно. Во всех трёх наборах сумма 180, а разница в наибольшем угле.',
    'Correct. All three sum to 180; the difference is in the largest angle.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "120 > 90, ya'ni bu o'tmas burchakli uchburchak. Bitta o'tmas burchak yetadi.",
      '120 > 90, значит это тупоугольный треугольник. Одного тупого угла достаточно.',
      '120 > 90, so obtuse-angled. One obtuse angle is enough.') },
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "90 gradusli burchak bor, ya'ni to'g'ri burchakli uchburchak.",
      'Есть угол 90 градусов, значит прямоугольный треугольник.',
      'There is a 90-degree angle, so right-angled.') },
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "Uch burchak ham 90 dan kichik: o'tkir burchakli uchburchak.",
      'Все три угла меньше 90: остроугольный треугольник.',
      'All three are under 90: acute-angled.') },
  ],
  wrongText: L(
    "Har to'plamda eng katta burchakni toping va uni 90 bilan solishtiring.",
    'В каждом наборе найди наибольший угол и сравни с 90.',
    'Find the largest angle in each set and compare with 90.'),
};

export default function D42_07(props) { return <Zones data={DATA} {...props} />; }
