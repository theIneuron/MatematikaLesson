// Dars14 · Amaliyot 07 — Ko'paytmani darajaga ko'tarish · 🔴 · tag: power_of_product
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SlotsBank.
//
// (2a³)². Qavs ichidagi HAR ko'paytuvchi darajaga ko'tariladi:
//   2² = 4  va  (a³)² = a⁶
//   javob: 4a⁶
// Eng ko'p uchraydigan xato: koeffitsiyentni darajaga ko'tarmaslik, ya'ni
// 2a⁶ deb yozish.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'power_of_product', level: '🔴',
  eyebrow: L("Ko'paytma darajasi", 'Степень произведения', 'A power of a product'),
  setup: L(
    "Qavs ichidagi har ko'paytuvchi darajaga ko'tariladi -- koeffitsiyent ham. Uni tashlab ketish eng ko'p uchraydigan xato.",
    'В степень возводится каждый множитель в скобке — коэффициент тоже. Забыть его — самая частая ошибка.',
    'Every factor inside the bracket is raised to the power — the coefficient too. Forgetting it is the commonest slip.'),
  rows: [
    [{ t: ['(2a³)²', '='] }, { slot: 0 }, { slot: 1 }],
  ],
  cards: ['4', 'a⁶', '2', 'a⁵', 'a⁹', '8'],
  answer: ['4', 'a⁶'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 2² = 4 va (a³)² = a⁶, ya'ni javob 4a⁶. Ikki ko'paytuvchi ham darajaga ko'tarildi.",
    'Верно. 2² = 4 и (a³)² = a⁶, значит ответ 4a⁶. В степень возведены оба множителя.',
    'Correct. 2² = 4 and (a³)² = a⁶, so the answer is 4a⁶. Both factors were raised.'),
  wrongs: [
    { when: (s) => s.slots[0] === '2', text: L(
      "Koeffitsiyent ham darajaga ko'tariladi: 2² = 4. U qavs ichida turgan, ya'ni daraja unga ham tegishli.",
      'Коэффициент тоже возводится в степень: 2² = 4. Он стоит в скобке, значит степень относится и к нему.',
      'The coefficient is raised too: 2² = 4. It stands inside the bracket, so the power reaches it.') },
    { when: (s) => s.slots[1] === 'a⁵', text: L(
      "(a³)² da ko'rsatkichlar KO'PAYTIRILADI: 3 · 2 = 6. Qo'shish ko'paytmada bo'ladi.",
      'В (a³)² показатели ПЕРЕМНОЖАЮТСЯ: 3 · 2 = 6. Сложение бывает в произведении.',
      'In (a³)² the exponents MULTIPLY: 3 · 2 = 6. Addition belongs to a product.') },
    { when: (s) => s.slots[0] === '8', text: L(
      "8 bu 2³. Qavs tashqarisidagi ko'rsatkich 2, ya'ni 2² = 4.",
      '8 это 2³. Показатель снаружи скобки равен 2, значит 2² = 4.',
      '8 is 2³. The exponent outside the bracket is 2, so 2² = 4.') },
  ],
  wrongText: L(
    "Qavs ichidagi ikki ko'paytuvchini alohida darajaga ko'taring: 2² va (a³)².",
    'Возведи в степень оба множителя из скобки по отдельности: 2² и (a³)².',
    'Raise both factors from the bracket separately: 2² and (a³)².'),
};

export default function D14_07(props) { return <SlotsBank data={DATA} {...props} />; }
