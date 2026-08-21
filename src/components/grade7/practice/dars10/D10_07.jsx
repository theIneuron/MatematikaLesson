// Dars10 · Amaliyot 07 — Modulni ajratish · 🔴 · tag: mod_isolate
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SlotsBank.
//
// 3|x| − 5 = 16. Ikki holatga bo'lishdan OLDIN modulni yolg'iz qoldirish kerak:
//   3|x| = 21
//   |x| = 7
//   x = 7 yoki x = −7
// Eng ko'p uchraydigan xato: darhol «x = 16 yoki x = −16» deb yozish, ya'ni
// 3 va −5 ni hisobga olmaslik.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'mod_isolate', level: '🔴',
  eyebrow: L('Modulni ajratish', 'Оставить модуль один', 'Isolating the modulus'),
  setup: L(
    "Ikki holatga bo'lishdan oldin modul yolg'iz qolishi kerak: qo'shiluvchi ko'chiriladi, ko'paytuvchiga bo'linadi.",
    'Прежде чем разбивать на два случая, модуль должен остаться один: слагаемое переносят, на множитель делят.',
    'Before splitting into two cases the modulus must stand alone: move the term, divide by the factor.'),
  rows: [
    [{ t: ['3|x|', '−', '5', '=', '16'] }],
    [{ t: ['3|x|', '='] }, { slot: 0 }],
    [{ t: ['|x|', '='] }, { slot: 1 }],
  ],
  cards: ['21', '7', '11', '63', '3', '−7'],
  answer: ['21', '7'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 3|x| = 16 + 5 = 21, keyin |x| = 21 : 3 = 7. Endi ikki holat: x = 7 yoki x = −7.",
    'Верно. 3|x| = 16 + 5 = 21, затем |x| = 21 : 3 = 7. Теперь два случая: x = 7 или x = −7.',
    'Correct. 3|x| = 16 + 5 = 21, then |x| = 21 : 3 = 7. Now two cases: x = 7 or x = −7.'),
  wrongs: [
    { when: (s) => s.slots[0] === '11', text: L(
      "−5 ni o'ng tomonga ko'chirsa u QO'SHILADI: 16 + 5 = 21.",
      'При переносе −5 в правую часть она ПРИБАВЛЯЕТСЯ: 16 + 5 = 21.',
      'Moving the −5 to the right side ADDS it: 16 + 5 = 21.') },
    { when: (s) => s.slots[1] === '63', text: L(
      "3 ga KO'PAYTIRISH emas, BO'LISH kerak: |x| = 21 : 3 = 7.",
      'Нужно не УМНОЖИТЬ на 3, а РАЗДЕЛИТЬ: |x| = 21 : 3 = 7.',
      'It needs DIVIDING by 3, not multiplying: |x| = 21 : 3 = 7.') },
    { when: (s) => s.slots[1] === '−7', text: L(
      "Modulning qiymati manfiy bo'lmaydi: |x| = 7. Manfiy son keyingi qadamda, ILDIZ sifatida paydo bo'ladi.",
      'Значение модуля не бывает отрицательным: |x| = 7. Отрицательное число появится на следующем шаге, как КОРЕНЬ.',
      'The value of a modulus is never negative: |x| = 7. The negative number appears at the next step, as a ROOT.') },
  ],
  wrongText: L(
    "Avval −5 ni ko'chiring, keyin ikki tomonni 3 ga bo'ling. Shundan keyin ikki holat qaraladi.",
    'Сначала перенеси −5, потом раздели обе части на 3. И только после этого два случая.',
    'First move the −5, then divide both sides by 3. Only after that come the two cases.'),
};

export default function D10_07(props) { return <SlotsBank data={DATA} {...props} />; }
