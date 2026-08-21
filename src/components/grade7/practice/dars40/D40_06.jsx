// Dars40 · Amaliyot 06 — Harf bilan · 🟡 · build · tag: seg_letter
// Mexanika: kit.jsx -> BuildLine. Raskladka: 6-o'rin.
// AC = 3x, CB = 12, AB = 27 -> 3x + 12 = 27 -> 3x = 15 -> x = 5.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'seg_letter', level: '🟡',
  eyebrow: L('Harf bilan', 'С буквой', 'With a letter'),
  setup: L(
    "Bo'laklardan biri harf bilan berilgan. Kesma tengligi tenglama beradi va uni yechish kerak.",
    'Одна из частей задана буквой. Равенство отрезков даёт уравнение, его надо решить.',
    'One part carries a letter. The segment equality gives an equation to solve.'),
  given: [['AC', '=', '3x'], ['CB', '=', '12'], ['AB', '=', '27']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  cards: [
    { id: 'a', label: '3x + 12 = 27' },
    { id: 'b', label: '3x = 15' },
    { id: 'c', label: 'x = 5' },
    { id: 'd', label: '3x = 39' },
    { id: 'e', label: 'x = 13' },
  ],
  answerSeq: ['a', 'b', 'c'],
  empty: L("Uch qadamni tartib bilan qo'ying", 'Поставь три шага по порядку', 'Place the three steps in order'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 3x + 12 = 27 -> 3x = 15 -> x = 5. Tekshirish: AC = 15, 15 + 12 = 27.",
    'Верно. 3x + 12 = 27 → 3x = 15 → x = 5. Проверка: AC = 15, 15 + 12 = 27.',
    'Correct. 3x + 12 = 27 → 3x = 15 → x = 5. Check: AC = 15 and 15 + 12 = 27.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('d') !== -1 || s.seq.indexOf('e') !== -1, text: L(
      "Ko'chirishda ishora almashadi: 12 o'ng tomonga o'tsa ayiriladi, 27 − 12 = 15.",
      'При переносе знак меняется: 12 справа вычитается, 27 − 12 = 15.',
      'Moving flips the sign: the 12 is subtracted on the right, 27 − 12 = 15.') },
    { when: (s) => s.seq.length === 3, text: L(
      "Qadamlar to'g'ri, tartibi boshqa: tenglama, ko'chirish, ildiz.",
      'Шаги верные, но порядок другой: уравнение, перенос, корень.',
      'The steps are right but the order is not: equation, move, root.') },
    { when: (s) => s.seq.length < 3, text: L(
      "Uch qadam bo'lishi kerak.",
      'Должно быть три шага.',
      'There must be three steps.') },
  ],
  wrongText: L(
    "AC + CB = AB tengligini yozing va tenglamani yeching.",
    'Запиши равенство AC + CB = AB и реши уравнение.',
    'Write AC + CB = AB and solve the equation.'),
};

export default function D40_06(props) { return <BuildLine data={DATA} {...props} />; }
