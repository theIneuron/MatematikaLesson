// Dars17 · Amaliyot 07 — Bo'lishda ko'rsatkich · 🟡 · slots · tag: div_slots
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SlotsBank.
// Mexanika RASKLADKADAN: 17-dars, 7-o'rin `slots`.
//
// 24n⁷ : 6n² = 4n⁵. Sonlar BO'LINADI (24 : 6 = 4), ko'rsatkichlar
// AYIRILADI (7 − 2 = 5).
// Kartalar orasida 18 (24 − 6), n⁹ (7 + 2), 144 (24 · 6), n³ turadi.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'div_slots', level: '🟡',
  eyebrow: L('Bo\'lish', 'Деление', 'Division'),
  setup: L(
    "Bo'lishda amallar teskari bo'ladi: sonlar bo'linadi, ko'rsatkichlar esa ayiriladi. Ko'paytirishda ular qo'shilgan edi.",
    'При делении действия обратные: числа делятся, а показатели вычитаются. При умножении они складывались.',
    'Division reverses the actions: the numbers are divided and the exponents subtracted. In multiplication they were added.'),
  rows: [
    [{ t: ['24n⁷', ':', '6n²', '='] }, { slot: 0 }, { slot: 1 }],
  ],
  cards: ['4', 'n⁵', '18', 'n⁹', '144', 'n³'],
  answer: ['4', 'n⁵'],
  ask: L("Kartani bosing, keyin bo'sh katakni bosing.", 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 24 : 6 = 4, ko'rsatkichlar esa 7 − 2 = 5. Javob 4n⁵.",
    'Верно. 24 : 6 = 4, а показатели 7 − 2 = 5. Ответ 4n⁵.',
    'Correct. 24 : 6 = 4, and the exponents 7 − 2 = 5. The answer is 4n⁵.'),
  wrongs: [
    { when: (s) => s.slots[0] === '18', text: L(
      "18 bu 24 − 6. Ayirish ko'rsatkichlarda bo'ladi, sonlarda esa bo'lish: 24 : 6 = 4.",
      '18 это 24 − 6. Вычитание бывает у показателей, а числа делятся: 24 : 6 = 4.',
      '18 is 24 − 6. Subtraction is for the exponents; the numbers are divided: 24 : 6 = 4.') },
    { when: (s) => s.slots[0] === '144', text: L(
      "144 bu 24 · 6. Bu yerda bo'lish turibdi, ko'paytirish emas.",
      '144 это 24 · 6. Здесь стоит деление, а не умножение.',
      '144 is 24 · 6. This is a division, not a multiplication.') },
    { when: (s) => s.slots[1] === 'n⁹', text: L(
      "n⁹ chiqishi uchun ko'rsatkichlar qo'shilgan: 7 + 2. Bo'lishda ular ayiriladi: 7 − 2 = 5.",
      'Чтобы вышло n⁹, показатели сложили: 7 + 2. При делении они вычитаются: 7 − 2 = 5.',
      'To get n⁹ the exponents were added: 7 + 2. In division they subtract: 7 − 2 = 5.') },
    { when: (s) => s.slots[1] === 'n³', text: L(
      "Ko'rsatkichlarni qayta ayiring: 7 − 2 = 5, uch emas.",
      'Вычти показатели заново: 7 − 2 = 5, а не три.',
      'Subtract the exponents again: 7 − 2 = 5, not three.') },
  ],
  wrongText: L(
    "Ikki amalni alohida bajaring: sonlarni bo'ling, ko'rsatkichlarni ayiring.",
    'Сделай два действия по отдельности: числа раздели, показатели вычти.',
    'Do the two actions separately: divide the numbers, subtract the exponents.'),
};

export default function D17_07(props) { return <SlotsBank data={DATA} {...props} />; }
