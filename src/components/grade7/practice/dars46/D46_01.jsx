// Dars46 · Amaliyot 01 — Katta burchak qarshisida · 🟢 · choice · tag: side_angle
// Mexanika: kit.jsx -> Choice. Raskladka: 46-dars, 1-o'rin (isinish).
// Katta burchak qarshisida katta tomon yotadi.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'side_angle', level: '🟢',
  eyebrow: L('Tomon va burchak', 'Сторона и угол', 'Side and angle'),
  setup: L(
    "Uchburchakda tomonlar va burchaklar bog'liq: qaysi burchak katta bo'lsa, uning qarshisidagi tomon ham katta bo'ladi.",
    'В треугольнике стороны и углы связаны: чем больше угол, тем больше сторона против него.',
    'Sides and angles are linked: the larger the angle, the larger the side facing it.'),
  ask: L('Katta burchak qarshisida qanday tomon yotadi?', 'Какая сторона лежит против большего угла?', 'Which side lies opposite the larger angle?'),
  opts: [
    { label: L('Katta tomon', 'Большая сторона', 'The larger side') },
    { label: L('Kichik tomon', 'Меньшая сторона', 'The smaller side') },
    { label: L('Har qanday tomon', 'Любая сторона', 'Any side') },
  ],
  correct: 0,
  correctText: L(
    "To'g'ri. Katta burchak qarshisida katta tomon yotadi -- bu tomonlar va burchaklarni solishtirishga imkon beradi.",
    'Верно. Против большего угла лежит большая сторона — это позволяет сравнивать стороны и углы.',
    'Correct. The larger angle faces the larger side, which lets sides and angles be compared.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Teskari: kichik tomon KICHIK burchak qarshisida yotadi.",
      'Наоборот: меньшая сторона лежит против МЕНЬШЕГО угла.',
      'The other way round: the smaller side faces the SMALLER angle.') },
    { when: (s) => s.picked === 2, text: L(
      "Bog'lanish qat'iy: burchaklar tartibi tomonlar tartibini takrorlaydi.",
      'Связь строгая: порядок углов повторяет порядок сторон.',
      'The link is strict: the order of angles matches the order of sides.') },
  ],
  wrongText: L(
    "Teng yonli uchburchakni eslang: teng tomonlar qarshisida teng burchaklar yotadi. Katta burchak-chi?",
    'Вспомни равнобедренный: против равных сторон равные углы. А против большего угла?',
    'Recall the isosceles case: equal sides face equal angles. And a larger angle?'),
};

export default function D46_01(props) { return <Choice data={DATA} {...props} />; }
