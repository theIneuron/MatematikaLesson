// Dars42 · Amaliyot 03 — Bunday uchburchak bormi · 🟢 · fix · tag: tri_impossible
// Mexanika: kit.jsx -> TapTerms. Raskladka: 3-o'rin.
// 70° + 80° + 40° = 190° -- bunday uchburchak yo'q.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'tri_impossible', level: '🟢',
  eyebrow: L('Xato yozuv', 'Неверная запись', 'The wrong record'),
  setup: L(
    "Uch to'plam burchaklardan biri uchburchak bo'lolmaydi: yig'indisi 180 dan farq qiladi.",
    'Один из трёх наборов углов не может быть треугольником: сумма отличается от 180.',
    'One of the three angle sets cannot be a triangle: the sum differs from 180.'),
  ask: L("Uchburchak bo'lolmaydigan to'plamni belgilang.", 'Отметь набор, который не может быть треугольником.', 'Mark the set that cannot be a triangle.'),
  note: L('Bitta to\'plam.', 'Один набор.', 'One set.'),
  parts: [
    { k: 'term', id: 't1', v: '60° 60° 60°' },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't2', v: '70° 80° 40°' },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't3', v: '90° 45° 45°' },
  ],
  want: ['t2'],
  correctText: L(
    "To'g'ri. 70 + 80 + 40 = 190, ya'ni 180 dan katta. Bunday uchburchak yo'q.",
    'Верно. 70 + 80 + 40 = 190, то есть больше 180. Такого треугольника нет.',
    'Correct. 70 + 80 + 40 = 190, more than 180. No such triangle exists.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('t1') !== -1, text: L(
      "60 + 60 + 60 = 180: bu teng tomonli uchburchak, u mavjud.",
      '60 + 60 + 60 = 180: это равносторонний треугольник, он существует.',
      '60 + 60 + 60 = 180: an equilateral triangle, which exists.') },
    { when: (s) => s.extra.indexOf('t3') !== -1, text: L(
      "90 + 45 + 45 = 180: bu to'g'ri burchakli teng yonli uchburchak.",
      '90 + 45 + 45 = 180: это прямоугольный равнобедренный треугольник.',
      '90 + 45 + 45 = 180: a right isosceles triangle.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Har to'plamning yig'indisini hisoblang: 180 dan farq qilgani mavjud emas.",
      'Посчитай сумму каждого набора: тот, что отличается от 180, невозможен.',
      'Add each set: the one that differs from 180 is impossible.') },
  ],
  wrongText: L(
    "Har uch burchakni qo'shing va 180 bilan solishtiring.",
    'Сложи каждые три угла и сравни с 180.',
    'Add each set of three and compare with 180.'),
};

export default function D42_03(props) { return <TapTerms data={DATA} {...props} />; }
