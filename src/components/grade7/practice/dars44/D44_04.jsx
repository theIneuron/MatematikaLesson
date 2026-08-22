// Dars44 · Amaliyot 04 — Bunday uchburchak bormi · 🟡 · fix · tag: sum_fix
// Mexanika: kit.jsx -> TapTerms. Raskladka: 4-o'rin `fix`.
// 70 + 80 + 40 = 190 -- bunday uchburchak yo'q. Uch to'plamdan xatosini belgilash.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'sum_fix',
  level: '🟡',
  eyebrow: L(
    'Bunday uchburchak',
    'Такой треугольник',
    'Such a triangle'),
  setup: L(
    "Uch to'plamdan bittasi uchburchak bermaydi: burchaklar yig'indisi 180 dan farq qiladi.",
    'Один из трёх наборов не даёт треугольника: сумма углов отличается от 180.',
    'One of the three sets gives no triangle: the angles do not add to 180.'),
  ask: L(
    "Uchburchak BO'LMAYDIGAN to'plamni belgilang.",
    'Отметь набор, который НЕ даёт треугольника.',
    'Mark the set that gives NO triangle.'),
  note: L(
    "Bitta to'plam.",
    'Один набор.',
    'One set.'),
  parts: [
    { k: 'term', id: 't1', v: '60, 60, 60' },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't2', v: '70, 80, 40' },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't3', v: '90, 45, 45' },
  ],
  want: ['t2'],
  correctText: L(
    "To'g'ri. 70 + 80 + 40 = 190, ya'ni 180 dan katta. Bunday uchburchak yo'q.",
    'Верно. 70 + 80 + 40 = 190, больше 180. Такого треугольника нет.',
    'Correct. 70 + 80 + 40 = 190, above 180. No such triangle exists.'),
  wrongs: [
    {
      when: (s) => s.extra.indexOf('t1') !== -1,
      text: L(
        '60 + 60 + 60 = 180: bu teng tomonli uchburchak.',
        '60 + 60 + 60 = 180: это равносторонний треугольник.',
        '60 + 60 + 60 = 180: that is the equilateral triangle.'),
    },
    {
      when: (s) => s.extra.indexOf('t3') !== -1,
      text: L(
        "90 + 45 + 45 = 180: bu to'g'ri burchakli teng yonli uchburchak.",
        '90 + 45 + 45 = 180: это прямоугольный равнобедренный треугольник.',
        '90 + 45 + 45 = 180: that is the right isosceles triangle.'),
    },
    {
      when: (s) => s.miss.length > 0,
      text: L(
        "Har to'plamni qo'shib ko'ring va 180 bilan solishtiring.",
        'Сложи каждый набор и сравни с 180.',
        'Add each set and compare with 180.'),
    },
  ],
  wrongText: L(
    "Uch sonni qo'shing. 180 chiqmasa, uchburchak yo'q.",
    'Сложи три числа. Если не 180, треугольника нет.',
    'Add the three numbers. If it is not 180, there is no triangle.'),
};

export default function D44_04(props) { return <TapTerms data={DATA} {...props} />; }
