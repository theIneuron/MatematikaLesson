// Dars15 · Amaliyot 07 — Bir hadni darajaga ko'tarish · 🔴 · tag: monomial_power
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SlotsBank.
//
// (2x³)⁴. Har ko'paytuvchi darajaga ko'tariladi:
//   2⁴ = 16   va   (x³)⁴ = x¹²
//   javob: 16x¹²
// Kartalar orasida 8 (2³), x⁷ (ko'rsatkichlarni qo'shgan) va x¹⁶ turadi.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'monomial_power', level: '🔴',
  eyebrow: L('Darajaga ko\'tarish', 'Возведение в степень', 'Raising to a power'),
  setup: L(
    "Bir hadni darajaga ko'targanda koeffitsiyent ham, har harf ham darajaga ko'tariladi.",
    'При возведении одночлена в степень возводятся и коэффициент, и каждая буква.',
    'When a monomial is raised to a power both the coefficient and each letter are raised.'),
  rows: [
    [{ t: ['(2x³)⁴', '='] }, { slot: 0 }, { slot: 1 }],
  ],
  cards: ['16', 'x¹²', '8', 'x⁷', '2', 'x¹⁶'],
  answer: ['16', 'x¹²'],
  ask: L("Kartani bosing, keyin bo'sh katakni bosing.", 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 2⁴ = 16 va (x³)⁴ = x¹² (3 · 4 = 12). Javob 16x¹².",
    'Верно. 2⁴ = 16 и (x³)⁴ = x¹² (3 · 4 = 12). Ответ 16x¹².',
    'Correct. 2⁴ = 16 and (x³)⁴ = x¹² (3 · 4 = 12). The answer is 16x¹².'),
  wrongs: [
    { when: (s) => s.slots[0] === '2', text: L(
      "Koeffitsiyent ham darajaga ko'tariladi: 2⁴ = 16.",
      'Коэффициент тоже возводится в степень: 2⁴ = 16.',
      'The coefficient is raised as well: 2⁴ = 16.') },
    { when: (s) => s.slots[0] === '8', text: L(
      "8 bu 2³. Qavs tashqarisidagi ko'rsatkich 4, ya'ni 2⁴ = 16.",
      '8 это 2³. Показатель снаружи скобки равен 4, значит 2⁴ = 16.',
      '8 is 2³. The exponent outside the bracket is 4, so 2⁴ = 16.') },
    { when: (s) => s.slots[1] === 'x⁷', text: L(
      "Darajaning darajasida ko'rsatkichlar KO'PAYTIRILADI: 3 · 4 = 12, qo'shilmaydi.",
      'При возведении степени в степень показатели ПЕРЕМНОЖАЮТСЯ: 3 · 4 = 12, а не складываются.',
      'For a power of a power the exponents MULTIPLY: 3 · 4 = 12, they do not add.') },
    { when: (s) => s.slots[1] === 'x¹⁶', text: L(
      "x ning ko'rsatkichi 3, qavs tashqarisidagi 4: 3 · 4 = 12. 16 esa 4 · 4 dan chiqadi.",
      'У x показатель 3, снаружи 4: 3 · 4 = 12. А 16 выходит из 4 · 4.',
      'The x has exponent 3 and the outside is 4: 3 · 4 = 12. The 16 comes from 4 · 4.') },
  ],
  wrongText: L(
    "Ikki ishni alohida qiling: 2⁴ ni hisoblang va (x³)⁴ ning ko'rsatkichini ko'paytiring.",
    'Сделай две вещи отдельно: посчитай 2⁴ и перемножь показатели в (x³)⁴.',
    'Do two things separately: work out 2⁴ and multiply the exponents in (x³)⁴.'),
};

export default function D15_07(props) { return <SlotsBank data={DATA} {...props} />; }
