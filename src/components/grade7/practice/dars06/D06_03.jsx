// Dars06 · Amaliyot 03 — Ikki guruh · 🟡 · tag: two_groups
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SlotsBank.
//
// 9m − 4 − 3m + 11. Ikki guruh alohida yig'iladi:
//   harflilar: 9m − 3m = 6m
//   sonlar:    −4 + 11 = 7
//   javob:     6m + 7
// Kartalar orasida 12m (ayirish o'rniga qo'shgan), m (?), −7 (4 dan 11
// ayirgan) va +15 (4 va 11 ni qo'shgan) turadi.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'two_groups', level: '🟡',
  eyebrow: L('Ikki guruh', 'Две группы', 'Two groups'),
  setup: L(
    "Yozuvda ikki guruh bor: harfli hadlar va sonlar. Har guruh alohida yig'iladi, keyin ular yonma-yon yoziladi.",
    'В записи две группы: буквенные слагаемые и числа. Каждая собирается отдельно, потом они пишутся рядом.',
    'The record has two groups: letter terms and numbers. Each is collected on its own, then they are written side by side.'),
  rows: [
    [{ t: ['9m', '−', '4', '−', '3m', '+', '11'] }],
    [{ t: ['='] }, { slot: 0 }, { slot: 1 }],
  ],
  cards: ['6m', '12m', 'm', '+7', '−7', '+15'],
  answer: ['6m', '+7'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Harflilar: 9m − 3m = 6m. Sonlar: −4 + 11 = 7. Javob 6m + 7 -- ikki had qoldi, ular o'xshash emas.",
    'Верно. Буквенные: 9m − 3m = 6m. Числа: −4 + 11 = 7. Ответ 6m + 7 — осталось два слагаемых, они не подобны.',
    'Correct. Letter terms: 9m − 3m = 6m. Numbers: −4 + 11 = 7. The answer 6m + 7 has two terms left, and they are not alike.'),
  wrongs: [
    { when: (s) => s.slots[0] === '12m', text: L(
      "3m ning oldida minus turibdi, ya'ni u AYIRILADI: 9m − 3m = 6m.",
      'Перед 3m стоит минус, значит оно ВЫЧИТАЕТСЯ: 9m − 3m = 6m.',
      'The 3m has a minus before it, so it is SUBTRACTED: 9m − 3m = 6m.') },
    { when: (s) => s.slots[1] === '−7', text: L(
      "Sonlarga qarang: 4 ayiriladi, 11 esa QO'SHILADI. −4 + 11 = 7, ya'ni musbat.",
      'Посмотри на числа: 4 вычитается, а 11 ПРИБАВЛЯЕТСЯ. −4 + 11 = 7, то есть положительное.',
      'Look at the numbers: 4 is subtracted, 11 is ADDED. −4 + 11 = 7, so it is positive.') },
    { when: (s) => s.slots[1] === '+15', text: L(
      "4 ning oldida minus turibdi: −4 + 11 = 7, 15 emas.",
      'Перед 4 стоит минус: −4 + 11 = 7, а не 15.',
      'The 4 has a minus before it: −4 + 11 = 7, not 15.') },
  ],
  wrongText: L(
    "Hadlarni ishorasi bilan ko'chirib guruhlang: 9m − 3m va −4 + 11.",
    'Перенеси слагаемые вместе со знаками и сгруппируй: 9m − 3m и −4 + 11.',
    'Move the terms with their signs and group them: 9m − 3m and −4 + 11.'),
};

export default function D06_03(props) { return <SlotsBank data={DATA} {...props} />; }
