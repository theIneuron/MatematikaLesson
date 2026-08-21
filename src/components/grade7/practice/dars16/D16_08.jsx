// Dars16 · Amaliyot 08 — Uchta ko'paytuvchi · 🔴 · tag: mul_three_signs
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SlotsBank.
//
// (−5a²) · 12a³ · (−2a) = 120a⁶.
//   son: −5 · 12 · (−2): ikkita minus, ya'ni musbat 120
//   ko'rsatkich: 2 + 3 + 1 = 6
// Kartalar orasida −120 (bir minus deb hisoblagan), a⁵ (yozilmagan
// ko'rsatkichni hisobga olmagan) va 19 (qo'shgan) turadi.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'mul_three_signs', level: '🔴',
  eyebrow: L("Uchta ko'paytuvchi", 'Три множителя', 'Three factors'),
  setup: L(
    "Ko'paytuvchi uchta bo'lsa ham qoida o'sha: sonlar ko'paytiriladi, ko'rsatkichlar qo'shiladi. Minuslar sonini sanash kerak: ikkita minus musbat beradi.",
    'Даже с тремя множителями правило то же: числа перемножаются, показатели складываются. Минусы надо посчитать: два минуса дают плюс.',
    'Even with three factors the rule holds: numbers multiply, exponents add. Count the minuses: two minuses give a plus.'),
  rows: [
    [{ t: ['(−5a²)', '·', '12a³', '·', '(−2a)', '='] }, { slot: 0 }, { slot: 1 }],
  ],
  cards: ['120', 'a⁶', '−120', 'a⁵', '19', 'a⁷'],
  answer: ['120', 'a⁶'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Minuslar ikkita, ya'ni son musbat: 5 · 12 · 2 = 120. Ko'rsatkichlar 2 + 3 + 1 = 6.",
    'Верно. Минусов два, значит число положительное: 5 · 12 · 2 = 120. Показатели 2 + 3 + 1 = 6.',
    'Correct. There are two minuses, so the number is positive: 5 · 12 · 2 = 120. The exponents 2 + 3 + 1 = 6.'),
  wrongs: [
    { when: (s) => s.slots[0] === '−120', text: L(
      "Minuslarni sanang: ular IKKITA, ya'ni juft. Juft sondagi minus musbat beradi.",
      'Посчитай минусы: их ДВА, то есть чётное число. Чётное число минусов даёт плюс.',
      'Count the minuses: there are TWO, an even number. An even number of minuses gives a plus.') },
    { when: (s) => s.slots[1] === 'a⁵', text: L(
      "Uchinchi hadda ham a bor: (−2a) da ko'rsatkich yozilmagan, ya'ni u bir. 2 + 3 + 1 = 6.",
      'В третьем одночлене тоже есть a: в (−2a) показатель не написан, значит он один. 2 + 3 + 1 = 6.',
      'The third monomial has a too: in (−2a) the exponent is not written, so it is one. 2 + 3 + 1 = 6.') },
    { when: (s) => s.slots[1] === 'a⁷', text: L(
      "Ko'rsatkichlarni qayta qo'shing: 2 + 3 + 1 = 6, yetti emas.",
      'Сложи показатели заново: 2 + 3 + 1 = 6, а не семь.',
      'Add the exponents again: 2 + 3 + 1 = 6, not seven.') },
    { when: (s) => s.slots[0] === '19', text: L(
      "19 bu 5 + 12 + 2, ya'ni qo'shish. Koeffitsiyentlar ko'paytiriladi.",
      '19 это 5 + 12 + 2, то есть сложение. Коэффициенты перемножаются.',
      '19 is 5 + 12 + 2, an addition. Coefficients are multiplied.') },
  ],
  wrongText: L(
    "Ikki ishni bajaring: uch sonni ko'paytirib ishorani aniqlang, keyin uch ko'rsatkichni qo'shing.",
    'Сделай два дела: перемножь три числа и определи знак, потом сложи три показателя.',
    'Do two things: multiply the three numbers and find the sign, then add the three exponents.'),
};

export default function D16_08(props) { return <SlotsBank data={DATA} {...props} />; }
