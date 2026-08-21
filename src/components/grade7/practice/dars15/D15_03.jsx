// Dars15 · Amaliyot 03 — Bir hadlarni ko'paytirish · 🟡 · tag: mul_monomials
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SlotsBank.
//
// 3x² · 5x³. Ikki ish alohida bajariladi:
//   koeffitsiyentlar KO'PAYTIRILADI: 3 · 5 = 15
//   bir xil harfning ko'rsatkichlari QO'SHILADI: 2 + 3 = 5
//   javob: 15x⁵
// Kartalar orasida 8 (koeffitsiyentlarni qo'shgan), x⁶ (ko'rsatkichlarni
// ko'paytirgan) va 35 turadi.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'mul_monomials', level: '🟡',
  eyebrow: L("Ko'paytirish", 'Умножение одночленов', 'Multiplying monomials'),
  setup: L(
    "Bir hadlarni ko'paytirganda koeffitsiyentlar ko'paytiriladi, bir xil harfning ko'rsatkichlari esa qo'shiladi.",
    'При умножении одночленов коэффициенты перемножаются, а показатели одинаковой буквы складываются.',
    'When monomials are multiplied the coefficients multiply and the exponents of the same letter add.'),
  rows: [
    [{ t: ['3x²', '·', '5x³', '='] }, { slot: 0 }, { slot: 1 }],
  ],
  cards: ['15', 'x⁵', '8', 'x⁶', '35', 'x⁹'],
  answer: ['15', 'x⁵'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 3 · 5 = 15, ko'rsatkichlar esa 2 + 3 = 5. Javob 15x⁵.",
    'Верно. 3 · 5 = 15, а показатели 2 + 3 = 5. Ответ 15x⁵.',
    'Correct. 3 · 5 = 15, and the exponents 2 + 3 = 5. The answer is 15x⁵.'),
  wrongs: [
    { when: (s) => s.slots[0] === '8', text: L(
      "Koeffitsiyentlar KO'PAYTIRILADI, qo'shilmaydi: 3 · 5 = 15.",
      'Коэффициенты ПЕРЕМНОЖАЮТСЯ, а не складываются: 3 · 5 = 15.',
      'The coefficients MULTIPLY, they do not add: 3 · 5 = 15.') },
    { when: (s) => s.slots[1] === 'x⁶', text: L(
      "Ko'rsatkichlar QO'SHILADI: 2 + 3 = 5. Ko'paytirish darajaning darajasida bo'ladi.",
      'Показатели СКЛАДЫВАЮТСЯ: 2 + 3 = 5. Перемножение бывает при возведении степени в степень.',
      'The exponents ADD: 2 + 3 = 5. Multiplying them belongs to a power of a power.') },
    { when: (s) => s.slots[0] === '35' || s.slots[1] === 'x⁹', text: L(
      "Sonlarni aniq oling: koeffitsiyentlar 3 va 5, ko'rsatkichlar 2 va 3.",
      'Возьми числа точно: коэффициенты 3 и 5, показатели 2 и 3.',
      'Take the numbers exactly: coefficients 3 and 5, exponents 2 and 3.') },
  ],
  wrongText: L(
    "Ikki ishni alohida qiling: sonlarni ko'paytiring, ko'rsatkichlarni qo'shing.",
    'Сделай две вещи по отдельности: числа перемножь, показатели сложи.',
    'Do two things separately: multiply the numbers, add the exponents.'),
};

export default function D15_03(props) { return <SlotsBank data={DATA} {...props} />; }
