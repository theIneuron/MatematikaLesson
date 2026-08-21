// Dars43 · Amaliyot 04 — Qaysi belgi · 🟡 · sort · tag: eq_signs_zones
// Mexanika: kit.jsx -> Zones. Raskladka: 4-o'rin.
// 5, 7 va orasidagi 40° -> ikki tomon va burchak belgisi
// 6, 30°, 50° -> tomon va ikki burchak belgisi
// 3, 4, 5 -> uch tomon belgisi
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'eq_signs_zones', level: '🟡', itemSize: 19, zoneLbl: 108,
  eyebrow: L('Qaysi belgi', 'Какой признак', 'Which criterion'),
  setup: L(
    "Uchburchaklar tengligining uch belgisi bor. Berilgan uchlik qaysi belgiga to'g'ri kelishini aniqlash kerak.",
    'Есть три признака равенства треугольников. Надо определить, какому признаку отвечает данная тройка.',
    'There are three criteria for equal triangles. Match each set of data to its criterion.'),
  zones: [
    { id: 'z1', label: L('Ikki tomon va burchak', 'Две стороны и угол', 'Two sides and the angle') },
    { id: 'z2', label: L('Tomon va ikki burchak', 'Сторона и два угла', 'A side and two angles') },
    { id: 'z3', label: L('Uch tomon', 'Три стороны', 'Three sides') },
  ],
  items: [
    { id: 'i1', tokens: ['5,', '7,', '40°'], zone: 'z1' },
    { id: 'i2', tokens: ['6,', '30°,', '50°'], zone: 'z2' },
    { id: 'i3', tokens: ['3,', '4,', '5'], zone: 'z3' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L('Berilganlar', 'Данные', 'Given data'),
  correctText: L(
    "To'g'ri. Sonlar orasida nechta burchak bor -- shu belgini beradi: bitta burchak, ikki burchak yoki burchaksiz.",
    'Верно. Сколько углов среди данных — тот и признак: один угол, два угла или без углов.',
    'Correct. The number of angles in the data picks the criterion: one, two, or none.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "5, 7 va 40°: ikki tomon va bitta burchak, ya'ni birinchi belgi.",
      '5, 7 и 40°: две стороны и один угол, значит первый признак.',
      '5, 7 and 40°: two sides and one angle — the first criterion.') },
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "6, 30°, 50°: bitta tomon va ikki burchak, ya'ni ikkinchi belgi.",
      '6, 30°, 50°: одна сторона и два угла, значит второй признак.',
      '6, 30°, 50°: one side and two angles — the second criterion.') },
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "3, 4, 5: burchak yo'q, faqat tomonlar -- uchinchi belgi.",
      '3, 4, 5: углов нет, только стороны — третий признак.',
      '3, 4, 5: no angles, only sides — the third criterion.') },
  ],
  wrongText: L(
    "Har to'plamda nechta son burchak, nechtasi tomon ekanini sanang.",
    'В каждом наборе посчитай, сколько чисел это углы и сколько стороны.',
    'In each set count how many numbers are angles and how many sides.'),
};

export default function D43_04(props) { return <Zones data={DATA} {...props} />; }
