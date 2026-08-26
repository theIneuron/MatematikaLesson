// Dars38 · Amaliyot 05 — Nechta yechim · 🟡 · sort · tag: sys_zones
// Mexanika: kit.jsx -> Zones. Raskladka: 5-o'rin `sort`.
// y = 2x + 1 va y = 3x -> bitta; y = 2x + 1 va y = 2x + 5 -> yo'q (parallel); y = 2x + 1 va 2y = 4x + 2 -> cheksiz (bir xil chiziq).
// TARTIB SAQLANADI (`noShuffle`): razbor yozuvlarga TARTIB bilan murojaat
// qiladi, aralashtirilsa izoh ekrandagiga mos kelmaydi.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'sys_zones', noShuffle: true,
  level: '🟡',
  eyebrow: L(
    'Nechta yechim',
    'Сколько решений',
    'How many solutions'),
  setup: L(
    "Ikki chiziq kesishishi, parallel bo'lishi yoki ustma-ust tushishi mumkin. Uchinchi holatni sinchiklab tekshirish kerak: yozuv boshqacha, chiziq esa bitta.",
    'Две прямые могут пересечься, быть параллельны или совпасть. Третий случай надо проверить внимательно: запись другая, а прямая та же.',
    'Two lines may cross, be parallel, or coincide. The third case needs care: a different record, the same line.'),
  itemSize: 15,
  zoneLbl: 108,
  zones: [
    {
      id: 'z1',
      label: L(
        'Bitta yechim',
        'Одно решение',
        'One solution'),
    },
    {
      id: 'z0',
      label: L(
        "Yechim yo'q",
        'Решений нет',
        'No solution'),
    },
    {
      id: 'zi',
      label: L(
        "Cheksiz ko'p",
        'Бесконечно много',
        'Infinitely many'),
    },
  ],
  items: [
    { id: 'i1', tokens: ['y = 2x + 1; y = 3x'], zone: 'z1' },
    { id: 'i2', tokens: ['y = 2x + 1; y = 2x + 5'], zone: 'z0' },
    { id: 'i3', tokens: ['y = 2x + 1; 2y = 4x + 2'], zone: 'zi' },
  ],
  bank: L(
    'Sistemalar',
    'Системы',
    'Systems'),
  ask: L(
    'Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  correctText: L(
    "To'g'ri. Turli k -- kesishadi; bir xil k va boshqa b -- parallel; ikkinchi tenglama birinchisining ikki barobari -- bir xil chiziq.",
    'Верно. Разные k — пересекаются; одинаковый k и другой b — параллельны; второе уравнение это первое, умноженное на два — одна прямая.',
    'Correct. Different k cross; equal k with different b are parallel; the second equation is twice the first, so one line.'),
  wrongs: [
    {
      when: (s) => s.bad.indexOf('i3') !== -1,
      text: L(
        "2y = 4x + 2 ni ikkiga bo'lsak y = 2x + 1 chiqadi -- bu bitta chiziq, ya'ni yechim cheksiz ko'p.",
        'Разделив 2y = 4x + 2 на два, получим y = 2x + 1 — это одна прямая, значит решений бесконечно много.',
        'Halving 2y = 4x + 2 gives y = 2x + 1: one line, so infinitely many solutions.'),
    },
    {
      when: (s) => s.bad.indexOf('i2') !== -1,
      text: L(
        'k lar bir xil, b lar boshqa: chiziqlar parallel, kesishmaydi.',
        'k одинаковые, b разные: прямые параллельны и не пересекаются.',
        'Equal k with different b: the lines are parallel and never meet.'),
    },
    {
      when: (s) => s.bad.indexOf('i1') !== -1,
      text: L(
        "k lar boshqa (2 va 3), ya'ni chiziqlar bir nuqtada kesishadi.",
        'k разные (2 и 3), значит прямые пересекаются в одной точке.',
        'The k differ (2 and 3), so the lines cross once.'),
    },
  ],
  wrongText: L(
    "Har sistemada k larni solishtiring, keyin b larni. Ikkinchi tenglamani soddalashtirib ko'ring.",
    'Сравни в каждой системе k, потом b. Второе уравнение попробуй упростить.',
    'Compare the k, then the b. Try simplifying the second equation.'),
};

export default function D38_05(props) { return <Zones data={DATA} {...props} />; }
