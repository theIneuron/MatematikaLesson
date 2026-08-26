// Dars47 · Amaliyot 05 — Yasashdagi xato · 🟡 · fix · tag: comp_fix
// Mexanika: kit.jsx -> TapTerms. Raskladka: 5-o'rin `fix`.
// O'rta perpendikulyar yasashda yoy radiusi kesmaning YARMIDAN katta bo'lishi kerak, aks holda yoylar kesishmaydi.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'comp_fix',
  level: '🟡',
  eyebrow: L(
    'Yasashdagi xato',
    'Ошибка в построении',
    'A flaw in the construction'),
  setup: L(
    "O'quvchi o'rta perpendikulyar yasadi. Uch qadamdan biri noto'g'ri: bir shart buzilsa yoylar umuman kesishmaydi.",
    'Ученик строил серединный перпендикуляр. Один из трёх шагов неверный: при нарушении условия дуги вообще не пересекутся.',
    'A pupil built a perpendicular bisector. One of the three steps is wrong: break that condition and the arcs never meet.'),
  given: [['AB = 10']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  ask: L(
    "NOTO'G'RI qadamni belgilang.",
    'Отметь НЕВЕРНЫЙ шаг.',
    'Mark the WRONG step.'),
  note: L(
    'Bitta qadam.',
    'Один шаг.',
    'One step.'),
  parts: [
    { k: 'term', id: 't1', v: L('A dan yoy, radius 4', 'дуга из A, радиус 4', 'arc from A, radius 4') },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't2', v: L('B dan yoy, radius 4', 'дуга из B, радиус 4', 'arc from B, radius 4') },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't3', v: L('kesishgan nuqtalarni ulash', 'соединить точки пересечения', 'join the crossing points') },
  ],
  want: ['t1'],
  correctText: L(
    "To'g'ri. Radius 4, kesmaning yarmi esa 5. 4 < 5 bo'lgani uchun yoylar kesishmaydi: radius yarmidan katta bo'lishi kerak.",
    'Верно. Радиус 4, а половина отрезка 5. Так как 4 < 5, дуги не пересекутся: радиус должен быть больше половины.',
    'Correct. The radius is 4 while half the segment is 5. Since 4 < 5 the arcs cannot meet: the radius must exceed half.'),
  wrongs: [
    {
      when: (s) => s.extra.indexOf('t2') !== -1,
      text: L(
        "Ikkinchi yoy birinchisi bilan bir xil radiusda chizilgan -- bu to'g'ri, xato radiusning O'ZIDA.",
        'Вторая дуга проведена тем же радиусом — это верно, ошибка в САМОМ радиусе.',
        'The second arc uses the same radius, which is right; the flaw is in the radius itself.'),
    },
    {
      when: (s) => s.extra.indexOf('t3') !== -1,
      text: L(
        "Kesishgan nuqtalarni ulash -- yasashning oxirgi to'g'ri qadami.",
        'Соединение точек пересечения это верный последний шаг.',
        'Joining the crossing points is the correct final step.'),
    },
    {
      when: (s) => s.miss.length > 0,
      text: L(
        'Radiusni kesmaning yarmi bilan solishtiring: 10 : 2 = 5.',
        'Сравни радиус с половиной отрезка: 10 : 2 = 5.',
        'Compare the radius with half the segment: 10 : 2 = 5.'),
    },
  ],
  wrongText: L(
    "Yoylar kesishishi uchun radius kesmaning yarmidan katta bo'lishi kerak.",
    'Чтобы дуги пересеклись, радиус должен быть больше половины отрезка.',
    'For the arcs to meet, the radius must exceed half the segment.'),
};

export default function D47_05(props) { return <TapTerms data={DATA} {...props} />; }
