// Dars42 · Amaliyot 02 — Tenglikni tuzish · 🟢 · bracket · tag: tri_equality
// Mexanika: kit.jsx -> BuildLine (qavs kartalari). Raskladka: 2-o'rin.
// ∠A + ∠B + ∠C = 180°.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'tri_equality', level: '🟢',
  eyebrow: L('Tenglikni tuzish', 'Составить равенство', 'Build the equality'),
  setup: L(
    "Uchburchak burchaklari haqidagi qoidani tenglik bilan yozish kerak.",
    'Правило про углы треугольника надо записать равенством.',
    'Write the rule about a triangle\'s angles as an equality.'),
  cards: [
    { id: 'a', label: '∠A + ∠B + ∠C' },
    { id: 'b', label: '= 180°' },
    { id: 'c', label: '= 360°' },
    { id: 'd', label: '∠A + ∠B' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Tenglikni tuzing", 'Составь равенство', 'Build the equality'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. ∠A + ∠B + ∠C = 180°: uch burchakning hammasi hisobga olinadi.",
    'Верно. ∠A + ∠B + ∠C = 180°: учитываются все три угла.',
    'Correct. ∠A + ∠B + ∠C = 180°: all three angles count.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "Ikki burchak yetmaydi: uchburchakda uchta burchak bor.",
      'Двух углов мало: в треугольнике их три.',
      'Two angles are not enough: a triangle has three.') },
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "360 gradus to'rtburchak uchun. Uchburchakda 180.",
      '360 градусов у четырёхугольника. У треугольника 180.',
      '360 is for a quadrilateral. A triangle gives 180.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Tenglik ikki bo'lakdan iborat.",
      'Равенство состоит из двух частей.',
      'The equality has two parts.') },
  ],
  wrongText: L(
    "Nechta burchak qo'shiladi va natija nechchi bo'ladi?",
    'Сколько углов складывается и чему равен результат?',
    'How many angles add up, and to what?'),
};

export default function D42_02(props) { return <BuildLine data={DATA} {...props} />; }
