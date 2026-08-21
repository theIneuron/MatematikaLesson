// Dars42 · Amaliyot 01 — Burchaklar yig'indisi · 🟢 · choice · tag: tri_sum
// Mexanika: kit.jsx -> Choice. Raskladka: 42-dars, 1-o'rin (isinish).
// Uchburchak burchaklari yig'indisi 180°.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'tri_sum', level: '🟢', optCols: 3,
  eyebrow: L("Burchaklar yig'indisi", 'Сумма углов', 'Sum of angles'),
  setup: L(
    "Har qanday uchburchakda uch burchak bor va ularning yig'indisi o'zgarmaydi. Uchburchak katta yoki kichik bo'lishi ahamiyatsiz.",
    'В любом треугольнике три угла, и их сумма не меняется. Размер треугольника значения не имеет.',
    'Every triangle has three angles and their sum never changes, whatever its size.'),
  ask: L("Uchburchak burchaklari yig'indisi nechchi?", 'Чему равна сумма углов треугольника?', 'What is the sum of a triangle\'s angles?'),
  opts: [{ label: ['180°'] }, { label: ['360°'] }, { label: ['90°'] }],
  correct: 0,
  correctText: L(
    "To'g'ri. Uch burchak birga 180 gradus beradi -- yoyilgan burchak kabi.",
    'Верно. Три угла вместе дают 180 градусов — как развёрнутый угол.',
    'Correct. The three angles make 180 degrees, like a straight angle.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "360 gradus to'rtburchak uchun. Uchburchakda esa 180.",
      '360 градусов у четырёхугольника. У треугольника 180.',
      '360 belongs to a quadrilateral. A triangle has 180.') },
    { when: (s) => s.picked === 2, text: L(
      "90 gradus faqat BITTA burchak bo'lishi mumkin -- to'g'ri burchak. Uchtasining yig'indisi esa 180.",
      '90 градусов может быть только ОДИН угол — прямой. А сумма трёх равна 180.',
      '90 can be ONE angle, a right one. The three together make 180.') },
  ],
  wrongText: L(
    "Uchburchakning uch burchagini bir joyga qo'ysak qanday burchak chiqadi?",
    'Если сложить три угла треугольника вместе, какой угол выйдет?',
    "Placing the three angles together, what angle appears?"),
};

export default function D42_01(props) { return <Choice data={DATA} {...props} />; }
