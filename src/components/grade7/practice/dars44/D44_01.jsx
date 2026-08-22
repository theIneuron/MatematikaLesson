// Dars44 · Amaliyot 01 — Yig'indi qancha · 🟢 · choice · tag: sum_value
// Mexanika: kit.jsx -> Choice. Raskladka: 1-o'rin `choice`.
// Uchburchak burchaklari yig'indisi 180°, uchburchak turidan qat'i nazar.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'sum_value',
  level: '🟢',
  eyebrow: L(
    "Burchaklar yig'indisi",
    'Сумма углов',
    'Sum of angles'),
  setup: L(
    "Har qanday uchburchakda uch burchakning yig'indisi bir xil bo'ladi -- shakli va o'lchamiga qaramaydi.",
    'В любом треугольнике сумма трёх углов одна и та же — она не зависит от формы и размера.',
    'In every triangle the three angles add to the same value, whatever its shape or size.'),
  ask: L(
    "Uch burchakning yig'indisi qancha?",
    'Чему равна сумма трёх углов?',
    'What do the three angles add to?'),
  opts: [
    { label: '180°' },
    { label: '90°' },
    { label: '360°' },
    {
      label: L(
        'Turiga qarab',
        'Зависит от вида',
        'It depends'),
    },
  ],
  correct: 0,
  optCols: 2,
  correctText: L(
    "To'g'ri. Uch burchak birga 180 gradus beradi -- to'g'ri chiziq bilan bir xil.",
    'Верно. Три угла вместе дают 180 градусов — столько же, сколько прямая.',
    'Correct. The three angles give 180 degrees, the same as a straight line.'),
  wrongs: [
    {
      when: (s) => s.picked === 1,
      text: L(
        "90° faqat to'g'ri burchak. Yig'indi esa undan katta.",
        '90° это только прямой угол. Сумма больше.',
        '90° is just a right angle. The sum is larger.'),
    },
    {
      when: (s) => s.picked === 2,
      text: L(
        "360° -- to'liq aylana. Uchburchakda yig'indi ikki barobar kichik.",
        '360° это полный круг. В треугольнике сумма вдвое меньше.',
        '360° is a full circle. A triangle sums to half that.'),
    },
    {
      when: (s) => s.picked === 3,
      text: L(
        "Yig'indi turga qaramaydi: o'tkir, to'g'ri va o'tmas burchakli uchburchakda ham 180.",
        'Сумма не зависит от вида: и у остроугольного, и у прямоугольного, и у тупоугольного 180.',
        'The sum is independent of kind: acute, right and obtuse all give 180.'),
    },
  ],
  wrongText: L(
    "Uchburchakning burchaklarini yulib olib bir joyga qo'ysak, to'g'ri chiziq chiqadi.",
    'Если отрезать углы треугольника и сложить вместе, получится прямая.',
    'Tear off the angles and lay them together: they make a straight line.'),
};

export default function D44_01(props) { return <Choice data={DATA} {...props} />; }
