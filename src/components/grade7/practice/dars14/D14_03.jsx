// Dars14 · Amaliyot 03 — Bo'lish va daraja darajasi · 🟡 · tag: div_and_power
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SlotsBank.
//
// Ikki xossa yonma-yon:
//   x⁷ : x⁴ = x³    bo'lishda ko'rsatkichlar AYIRILADI
//   (x²)⁵ = x¹⁰     darajaning darajasida KO'PAYTIRILADI
// Kartalar orasida x¹¹ (bo'lishda qo'shgan), x⁷ (darajada qo'shgan) va
// x²⁵ turadi.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'div_and_power', level: '🟡',
  eyebrow: L('Ikki xossa', 'Два свойства', 'Two properties'),
  setup: L(
    "Bo'lishda ko'rsatkichlar ayiriladi, darajaning darajasida esa ko'paytiriladi. Ikkovini aralashtirmaslik kerak.",
    'При делении показатели вычитаются, а при возведении степени в степень — перемножаются. Их важно не путать.',
    'In a division the exponents subtract; in a power of a power they multiply. The two must not be mixed up.'),
  rows: [
    [{ t: ['x⁷', ':', 'x⁴', '='] }, { slot: 0 }],
    [{ t: ['(x²)⁵', '='] }, { slot: 1 }],
  ],
  cards: ['x³', 'x¹⁰', 'x¹¹', 'x⁷', 'x²⁵', 'x²'],
  answer: ['x³', 'x¹⁰'],
  ask: L("Kartani bosing, keyin bo'sh katakni bosing.", 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Bo'lishda 7 − 4 = 3, ya'ni x³. Darajaning darajasida 2 · 5 = 10, ya'ni x¹⁰.",
    'Верно. При делении 7 − 4 = 3, то есть x³. При возведении в степень 2 · 5 = 10, то есть x¹⁰.',
    'Correct. In the division 7 − 4 = 3, that is x³. In the power of a power 2 · 5 = 10, that is x¹⁰.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'x¹¹', text: L(
      "Bo'lishda ko'rsatkichlar AYIRILADI: 7 − 4 = 3. Qo'shish ko'paytirishda bo'ladi.",
      'При делении показатели ВЫЧИТАЮТСЯ: 7 − 4 = 3. Сложение бывает при умножении.',
      'In a division the exponents SUBTRACT: 7 − 4 = 3. Addition happens in multiplication.') },
    { when: (s) => s.slots[1] === 'x⁷', text: L(
      "(x²)⁵ da ikkita x besh marta olinadi: 2 · 5 = 10. Qo'shish emas, ko'paytirish.",
      'В (x²)⁵ два x берутся пять раз: 2 · 5 = 10. Не сложение, а умножение.',
      'In (x²)⁵ two x are taken five times: 2 · 5 = 10. Not addition but multiplication.') },
    { when: (s) => s.slots[1] === 'x²⁵' || s.slots[0] === 'x²', text: L(
      "Ko'rsatkichlarni aniq oling: birinchi qatorda 7 va 4, ikkinchisida 2 va 5.",
      'Возьми показатели точно: в первой строке 7 и 4, во второй 2 и 5.',
      'Take the exponents exactly: 7 and 4 in the first line, 2 and 5 in the second.') },
  ],
  wrongText: L(
    "Birinchi qatorda ayirish, ikkinchisida ko'paytirish. Amalni aralashtirmang.",
    'В первой строке вычитание, во второй умножение. Не путай действия.',
    'Subtraction in the first line, multiplication in the second. Do not mix them up.'),
};

export default function D14_03(props) { return <SlotsBank data={DATA} {...props} />; }
