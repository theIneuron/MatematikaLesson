// Dars10 · Amaliyot 03 — Ikki holat · 🟡 · tag: mod_two_cases
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SlotsBank.
//
// |x − 3| = 5. Modul ichidagi ifoda 5 ga yoki −5 ga teng bo'lishi mumkin:
//   x − 3 = 5   -> x = 8
//   x − 3 = −5  -> x = −2
// Tekshirish: |8 − 3| = 5 va |−2 − 3| = |−5| = 5.
// Kartalar orasida 2 va −8 turadi -- ishorani chalkashtirganning javobi.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'mod_two_cases', level: '🟡',
  eyebrow: L('Ikki holat', 'Два случая', 'Two cases'),
  setup: L(
    "Modul ichidagi ifoda o'ng tomondagi songa yoki uning qarama-qarshisiga teng bo'ladi. Shuning uchun ikki holat qaraladi.",
    'Выражение под модулем равно правому числу или числу, ему противоположному. Поэтому разбирают два случая.',
    'The expression under the modulus equals the right-hand number or its opposite. So two cases are considered.'),
  rows: [
    [{ t: ['|x', '−', '3|', '=', '5'] }],
    [{ t: ['x', '−', '3', '=', '5', '→', 'x', '='] }, { slot: 0 }],
    [{ t: ['x', '−', '3', '=', '−5', '→', 'x', '='] }, { slot: 1 }],
  ],
  cards: ['8', '−2', '2', '−8', '15', '−15'],
  answer: ['8', '−2'],
  ask: L("Kartani bosing, keyin bo'sh katakni bosing.", 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Birinchi holatda x = 5 + 3 = 8, ikkinchisida x = −5 + 3 = −2. Tekshirish: |8 − 3| = 5 va |−2 − 3| = 5.",
    'Верно. В первом случае x = 5 + 3 = 8, во втором x = −5 + 3 = −2. Проверка: |8 − 3| = 5 и |−2 − 3| = 5.',
    'Correct. In the first case x = 5 + 3 = 8, in the second x = −5 + 3 = −2. Check: |8 − 3| = 5 and |−2 − 3| = 5.'),
  wrongs: [
    { when: (s) => s.slots[0] === '2', text: L(
      "Birinchi holatda 3 ni QO'SHISH kerak: x − 3 = 5 dan x = 5 + 3 = 8.",
      'В первом случае 3 надо ПРИБАВИТЬ: из x − 3 = 5 выходит x = 5 + 3 = 8.',
      'In the first case the 3 is ADDED: from x − 3 = 5 you get x = 5 + 3 = 8.') },
    { when: (s) => s.slots[1] === '−8', text: L(
      "Ikkinchi holatda ham 3 qo'shiladi: x = −5 + 3 = −2. Manfiy songa musbat son qo'shilsa, u nolga yaqinlashadi.",
      'Во втором случае 3 тоже прибавляется: x = −5 + 3 = −2. При прибавлении к отрицательному числу оно приближается к нулю.',
      'In the second case the 3 is added too: x = −5 + 3 = −2. Adding to a negative number moves it towards zero.') },
    { when: (s) => s.slots[0] === '15' || s.slots[1] === '−15', text: L(
      "Bu yerda ko'paytirish yo'q: modul ichidagi ifodadan 3 ni ko'chirish kerak, uni 3 ga ko'paytirmaslik kerak.",
      'Здесь нет умножения: тройку надо перенести из выражения под модулем, а не умножать на неё.',
      'There is no multiplication here: the 3 has to be moved across, not multiplied by.') },
  ],
  wrongText: L(
    "Ikki holatni alohida yechish: x − 3 = 5 va x − 3 = −5. Har ikkisida 3 ni o'ng tomonga ko'chirasiz.",
    'Реши два случая отдельно: x − 3 = 5 и x − 3 = −5. В обоих 3 переносится в правую часть.',
    'Solve the two cases separately: x − 3 = 5 and x − 3 = −5. In both the 3 moves to the right.'),
};

export default function D10_03(props) { return <SlotsBank data={DATA} {...props} />; }
