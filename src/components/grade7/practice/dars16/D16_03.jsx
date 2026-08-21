// Dars16 · Amaliyot 03 — Ikki uyani to'ldirish · 🟡 · tag: mul_two_slots
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SlotsBank.
//
// 12b⁴ · 8b³ = 96b⁷. Koeffitsiyent: 12 · 8 = 96. Ko'rsatkich: 4 + 3 = 7.
// Kartalar orasida 20 (12 + 8) va b¹² (4 · 3) turadi.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'mul_two_slots', level: '🟡',
  eyebrow: L('Son va harf', 'Число и буква', 'Number and letter'),
  setup: L(
    "Javob ikki bo'lakdan yig'iladi: son va harf. Har bo'lak o'z qoidasi bilan topiladi.",
    'Ответ собирается из двух частей: число и буква. Каждая часть находится по своему правилу.',
    'The answer is built from two parts: a number and a letter. Each part follows its own rule.'),
  rows: [
    [{ t: ['12b⁴', '·', '8b³', '='] }, { slot: 0 }, { slot: 1 }],
  ],
  cards: ['96', 'b⁷', '20', 'b¹²', '4', 'b¹'],
  answer: ['96', 'b⁷'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 12 · 8 = 96, ko'rsatkichlar esa 4 + 3 = 7. Javob 96b⁷.",
    'Верно. 12 · 8 = 96, а показатели 4 + 3 = 7. Ответ 96b⁷.',
    'Correct. 12 · 8 = 96, and the exponents 4 + 3 = 7. The answer is 96b⁷.'),
  wrongs: [
    { when: (s) => s.slots[0] === '20', text: L(
      "20 bu 12 + 8. Sonlar qo'shilmaydi, ko'paytiriladi: 12 · 8 = 96.",
      '20 это 12 + 8. Числа не складываются, а перемножаются: 12 · 8 = 96.',
      '20 is 12 + 8. Numbers are not added but multiplied: 12 · 8 = 96.') },
    { when: (s) => s.slots[1] === 'b¹²', text: L(
      "b¹² chiqishi uchun ko'rsatkichlar ko'paytirilgan: 4 · 3. Ko'paytmada esa ular qo'shiladi: 4 + 3 = 7.",
      'Чтобы вышло b¹², показатели перемножили: 4 · 3. А в произведении они складываются: 4 + 3 = 7.',
      'To get b¹² the exponents were multiplied: 4 · 3. In a product they add: 4 + 3 = 7.') },
    { when: (s) => s.slots[1] === 'b¹', text: L(
      "b¹ ko'rsatkichlarni ayirishdan chiqadi: 4 − 3. Ayirish bo'lishda bo'ladi, ko'paytirishda emas.",
      'b¹ выходит из вычитания показателей: 4 − 3. Вычитание бывает при делении, а не при умножении.',
      'b¹ comes from subtracting the exponents: 4 − 3. Subtraction happens in division, not multiplication.') },
    { when: (s) => s.slots[0] === '4', text: L(
      "4 bu birinchi hadning ko'rsatkichi, koeffitsiyent emas. Koeffitsiyent sonlarning ko'paytmasi: 96.",
      '4 это показатель первого одночлена, а не коэффициент. Коэффициент это произведение чисел: 96.',
      '4 is the exponent of the first monomial, not a coefficient. The coefficient is the product of the numbers: 96.') },
  ],
  wrongText: L(
    "Ikki uyani alohida to'ldiring: birinchisiga sonlar ko'paytmasi, ikkinchisiga qo'shilgan ko'rsatkichli harf.",
    'Заполни две клетки по отдельности: в первую произведение чисел, во вторую букву со сложенным показателем.',
    'Fill the two cells separately: the product of the numbers first, then the letter with the added exponent.'),
};

export default function D16_03(props) { return <SlotsBank data={DATA} {...props} />; }
