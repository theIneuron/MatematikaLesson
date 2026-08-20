// Dars02 · Amaliyot 03 — Ikki o'zgaruvchi · 🟡 · tag: two_vars
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SlotsBank.
//
// 3a + 2b, a = −4, b = 5. Darsning 7-ekrani: ikki o'zgaruvchi, ikki joy.
//   3 · (−4) = −12,  2 · 5 = 10,  −12 + 10 = −2
// Kartalar orasida 12 va −10 turadi -- ishorani chalkashtirganning javobi,
// hamda 2: bu −12 + 10 ni 12 − 10 deb hisoblaganda chiqadi.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'two_vars', level: '🟡',
  eyebrow: L("Ikki o'zgaruvchi", 'Две переменные', 'Two variables'),
  setup: L(
    "Har harf o'z sonini oladi. Ikki qo'shiluvchi alohida hisoblanadi, keyin qo'shiladi.",
    'Каждая буква получает своё число. Два слагаемых считаются отдельно, потом складываются.',
    'Each letter gets its own number. The two terms are worked out separately, then added.'),
  given: [['a', '=', '−4'], ['b', '=', '5']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  rows: [
    [{ t: ['3a', '+', '2b', '='] }, { slot: 0 }, { t: ['+'] }, { slot: 1 }, { t: ['='] }, { slot: 2 }],
  ],
  cards: ['−12', '10', '−2', '12', '−10', '2'],
  answer: ['−12', '10', '−2'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 3 · (−4) = −12 va 2 · 5 = 10. Manfiy va musbat sonni qo'shganda katta modul yutadi: −2.",
    'Верно. 3 · (−4) = −12 и 2 · 5 = 10. При сложении чисел с разными знаками побеждает большее по модулю: −2.',
    'Correct. 3 · (−4) = −12 and 2 · 5 = 10. When adding numbers of different signs the larger magnitude wins: −2.'),
  wrongs: [
    { when: (s) => s.slots[0] === '12', text: L(
      "Birinchi uyada ishora yo'qoldi: 3 ni minus to'rtga ko'paytirsa manfiy son chiqadi.",
      'В первой клетке потерялся знак: 3 умножить на минус четыре даёт отрицательное число.',
      'The sign is lost in the first cell: 3 times minus four gives a negative number.') },
    { when: (s) => s.slots[1] === '−10', text: L(
      "Ikkinchi qo'shiluvchida manfiy son yo'q: b = 5, ya'ni 2 · 5 = 10.",
      'Во втором слагаемом отрицательного числа нет: b = 5, значит 2 · 5 = 10.',
      'There is no negative number in the second term: b = 5, so 2 · 5 = 10.') },
    { when: (s) => s.slots[2] === '2', text: L(
      "Oxirgi uyaga qarang: minus o'n ikkiga o'n qo'shilsa, minus ikki chiqadi. Modul kattasi manfiy edi.",
      'Посмотри на последнюю клетку: к минус двенадцати прибавили десять — получится минус два. Больший по модулю был отрицательным.',
      'Look at the last cell: ten added to minus twelve gives minus two. The larger magnitude was the negative one.') },
  ],
  wrongText: L(
    "Har qo'shiluvchini alohida hisoblang: 3a bu 3 · a, 2b bu 2 · b. Keyingina ularni qo'shing.",
    'Считай каждое слагаемое отдельно: 3a это 3 · a, 2b это 2 · b. И только потом складывай.',
    'Work out each term on its own: 3a is 3 · a, 2b is 2 · b. Only then add them.'),
};

export default function D02_03(props) { return <SlotsBank data={DATA} {...props} />; }
