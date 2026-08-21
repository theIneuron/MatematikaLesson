// Dars43 · Amaliyot 07 — Uchinchi tomon · 🟡 · order · tag: eq_third_side
// Mexanika: kit.jsx -> BuildLine (tartib muhim). Raskladka: 7-o'rin.
// P = 30, ikki tomon 9 va 11 -> uchinchisi 30 − 20 = 10.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'eq_third_side', level: '🟡',
  eyebrow: L('Uchinchi tomon', 'Третья сторона', 'The third side'),
  setup: L(
    "Perimetr va ikki tomon ma'lum. Uchinchi tomonni topish uchun avval ikkovini qo'shib, keyin perimetrdan ayirish kerak.",
    'Известны периметр и две стороны. Чтобы найти третью, сначала сложи две, потом вычти из периметра.',
    'The perimeter and two sides are known. Add the two, then subtract from the perimeter.'),
  given: [['P', '=', '30'], ['9', 'va', '11']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  cards: [
    { id: 'a', label: '9 + 11 = 20' },
    { id: 'b', label: '30 − 20 = 10' },
    { id: 'c', label: '10' },
    { id: 'd', label: '30 − 9 = 21' },
    { id: 'e', label: '21' },
  ],
  answerSeq: ['a', 'b', 'c'],
  empty: L("Uch qadamni tartib bilan qo'ying", 'Поставь три шага по порядку', 'Place the three steps in order'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 9 + 11 = 20, keyin 30 − 20 = 10. Tekshirish: 9 + 11 + 10 = 30.",
    'Верно. 9 + 11 = 20, потом 30 − 20 = 10. Проверка: 9 + 11 + 10 = 30.',
    'Correct. 9 + 11 = 20, then 30 − 20 = 10. Check: 9 + 11 + 10 = 30.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('d') !== -1 || s.seq.indexOf('e') !== -1, text: L(
      "Faqat bitta tomon ayirilgan. Perimetrda uch tomon bor, ya'ni ikkovini birga ayirish kerak.",
      'Вычли только одну сторону. В периметре три стороны, значит вычитать надо обе.',
      'Only one side was subtracted. The perimeter holds three sides, so subtract both.') },
    { when: (s) => s.seq.length === 3, text: L(
      "Qadamlar to'g'ri, tartibi boshqa: yig'indi, ayirish, javob.",
      'Шаги верные, но порядок другой: сумма, вычитание, ответ.',
      'The steps are right but the order is not: sum, subtraction, answer.') },
    { when: (s) => s.seq.length < 3, text: L(
      "Uch qadam bo'lishi kerak.",
      'Должно быть три шага.',
      'There must be three steps.') },
  ],
  wrongText: L(
    "Perimetr uch tomonning yig'indisi. Ikkovi ma'lum bo'lsa, uchinchisi qanday topiladi?",
    'Периметр это сумма трёх сторон. Как найти третью, если две известны?',
    'The perimeter sums three sides. How do you find the third?'),
};

export default function D43_07(props) { return <BuildLine data={DATA} {...props} />; }
