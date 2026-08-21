// Dars12 · Amaliyot 08 — Ota va o'g'il · 🔴 · tag: father_and_son
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
//
// «Otaning yoshi o'g'ilning yoshidan uch barobar katta, ikkovining yoshi
// birga 48.» O'g'ilni x deb olsak: x + 3x = 48, ya'ni 4x = 48, x = 12,
// ota 36 yoshda.
// 3x = 48 varianti ATAYLAB: u faqat OTANING yoshini yozadi, o'g'ilning
// yoshini yig'indiga qo'shmaydi.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'father_and_son', level: '🔴',
  eyebrow: L("Ota va o'g'il", 'Отец и сын', 'Father and son'),
  setup: L(
    "Otaning yoshi o'g'ilning yoshidan uch barobar katta. Ikkovining yoshi birga 48. O'g'ilning yoshini x deb oling.",
    'Отец в три раза старше сына. Вместе им 48 лет. Обозначь возраст сына через x.',
    'A father is three times as old as his son. Together they are 48. Call the son\'s age x.'),
  ask: L('Qaysi tenglama shu shartga mos?', 'Какое уравнение соответствует условию?', 'Which equation matches?'),
  opts: [
    { label: ['x', '+', '3x', '=', '48'] },
    { label: ['3x', '=', '48'] },
    { label: ['x', '+', '3', '=', '48'] },
  ],
  correct: 0,
  correctText: L(
    "To'g'ri. O'g'il x yoshda, ota 3x yoshda, ikkovi birga 48: x + 3x = 48. Bundan 4x = 48, x = 12 va ota 36 yoshda.",
    'Верно. Сыну x лет, отцу 3x, вместе 48: x + 3x = 48. Отсюда 4x = 48, x = 12, а отцу 36.',
    'Correct. The son is x, the father 3x, together 48: x + 3x = 48. Hence 4x = 48, x = 12 and the father is 36.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "3x = 48 da faqat OTANING yoshi yozilgan. Shartda esa ikkovining yoshi birga 48.",
      'В 3x = 48 записан только возраст ОТЦА. А по условию 48 это возраст обоих вместе.',
      'In 3x = 48 only the FATHER\'S age is written. The condition says 48 is both ages together.') },
    { when: (s) => s.picked === 2, text: L(
      "x + 3 bu «uch yil katta» degani. Shartda esa «uch barobar katta», ya'ni ko'paytirish.",
      'x + 3 значит «на три года старше». А в условии «в три раза старше», то есть умножение.',
      'x + 3 means "three years older". The condition says "three times as old", a multiplication.') },
  ],
  wrongText: L(
    "Ikki yoshni ham yozing: o'g'il x, ota 3x. Ular birga 48 beradi.",
    'Запиши оба возраста: сын x, отец 3x. Вместе они дают 48.',
    'Write both ages: the son x, the father 3x. Together they make 48.'),
};

export default function D12_08(props) { return <Choice data={DATA} {...props} />; }
