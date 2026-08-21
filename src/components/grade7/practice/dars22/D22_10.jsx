// Dars22 · Amaliyot 10 — Qaysi ko'paytuvchi chiqadi · 🔴 · sort · tag: common_zones
// Mexanika: kit.jsx -> Zones. Raskladka: 10-o'rin.
// 8a³ + 12a² -> 4a²(2a + 3)     umumiy 4a²
// 8a³ + 12a  -> 4a(2a² + 3)     umumiy 4a
// 8a³ + 10a² -> 2a²(4a + 5)     umumiy 2a²
// Uch yozuv juda yaqin: birinchi had bir xil, farq ikkinchi hadda.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'common_zones', level: '🔴', itemSize: 21, zoneLbl: 76,
  eyebrow: L('Qaysi ko\'paytuvchi', 'Какой множитель', 'Which factor'),
  setup: L(
    "Uch yozuvning birinchi hadi bir xil, ikkinchisi esa boshqa. Umumiy ko'paytuvchi shu ikkinchi hadga qarab o'zgaradi.",
    'Первый член у трёх записей одинаковый, а второй разный. Общий множитель меняется именно из-за второго члена.',
    'The three records share the first term but differ in the second. The common factor changes because of that second term.'),
  zones: [
    { id: 'z4a2', label: L('4a²', '4a²', '4a²') },
    { id: 'z4a', label: L('4a', '4a', '4a') },
    { id: 'z2a2', label: L('2a²', '2a²', '2a²') },
  ],
  items: [
    { id: 'i1', tokens: ['8a³', '+', '12a²'], zone: 'z4a2' },
    { id: 'i2', tokens: ['8a³', '+', '12a'], zone: 'z4a' },
    { id: 'i3', tokens: ['8a³', '+', '10a²'], zone: 'z2a2' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L('Yozuvlar', 'Записи', 'Records'),
  correctText: L(
    "To'g'ri. Birinchisida a ning eng kichik darajasi ikki, ikkinchisida bir. Uchinchisida esa 8 va 10 ning umumiy bo'luvchisi 2, 4 emas.",
    'Верно. В первой наименьшая степень a вторая, во второй первая. А в третьей общий делитель 8 и 10 это 2, а не 4.',
    'Correct. The first has lowest power two, the second one. In the third the common divisor of 8 and 10 is 2, not 4.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "8a³ + 10a² da sonlarni tekshiring: 10 to'rtga bo'linmaydi. Umumiy bo'luvchi 2, ya'ni 2a².",
      'В 8a³ + 10a² проверь числа: 10 на четыре не делится. Общий делитель 2, значит 2a².',
      'In 8a³ + 10a² check the numbers: 10 is not divisible by four. The common divisor is 2, so 2a².') },
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "8a³ + 12a da ikkinchi hadda a faqat bitta: eng kichik daraja bir, ya'ni 4a.",
      'В 8a³ + 12a во втором члене только одна a: наименьшая степень первая, значит 4a.',
      'In 8a³ + 12a the second term has one a: the lowest power is one, so 4a.') },
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "8a³ + 12a² da 8 va 12 ning umumiy bo'luvchisi 4, a ning eng kichik darajasi ikki: 4a².",
      'В 8a³ + 12a² общий делитель 8 и 12 это 4, наименьшая степень a вторая: 4a².',
      'In 8a³ + 12a² the common divisor of 8 and 12 is 4 and the lowest power of a is two: 4a².') },
  ],
  wrongText: L(
    "Har yozuvda ikki savolga javob bering: sonlarning umumiy bo'luvchisi nechchi, a ning eng kichik darajasi qanday?",
    'В каждой записи ответь на два вопроса: каков общий делитель чисел и наименьшая степень a?',
    'For each record answer two questions: the common divisor of the numbers and the lowest power of a.'),
};

export default function D22_10(props) { return <Zones data={DATA} {...props} />; }
