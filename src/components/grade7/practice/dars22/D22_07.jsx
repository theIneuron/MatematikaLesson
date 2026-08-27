// Dars22 · Amaliyot 07 — Ajratish, keyin qiymat · 🟡 · chain · tag: factor_chain
// Mexanika: kit.jsx -> SlotsBank (ikki qator). Raskladka: 7-o'rin.
// 1-qator: 40n³ + 24n² = 8n²(5n + 3)
// 2-qator: n = 1 bo'lganda qiymat 8 · 8 = 64 (tekshirish: 40 + 24 = 64)
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'factor_chain', level: '🟡',
  eyebrow: L('Ikki qadam', 'Два шага', 'Two steps'),
  setup: L(
    "Avval ko'paytuvchilarga ajratiladi, keyin n o'rniga bir qo'yiladi. Ko'paytma ko'rinishida hisoblash ko'pincha qulayroq.",
    'Сначала разложение на множители, потом вместо n подставляется единица. В виде произведения считать часто проще.',
    'First the factorisation, then one is put in place of n. Counting a product is often easier.'),
  rows: [
    [{ t: ['40n³', '+', '24n²', '='] }, { slot: 0 }, { slot: 1 }],
    [{ t: ['n', '=', '1', '→'] }, { slot: 2 }],
  ],
  cards: ['8n²', '(5n + 3)', '64', '8n³', '(5n − 3)', '16'],
  answer: ['8n²', '(5n + 3)', '64'],
  ask: L("Kartani bosing, keyin bo'sh katakni bosing.", 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 8n²(5n + 3), n = 1 bo'lganda 8 · 8 = 64. Tekshirish: 40 + 24 = 64.",
    'Верно. 8n²(5n + 3), при n = 1 выходит 8 · 8 = 64. Проверка: 40 + 24 = 64.',
    'Correct. 8n²(5n + 3), and with n = 1 it gives 8 · 8 = 64. Check: 40 + 24 = 64.'),
  wrongs: [
    { when: (s) => s.slots[0] === '8n³', text: L(
      "8n³ ni chiqarib bo'lmaydi: ikkinchi hadda n faqat ikki marta. Eng kichik daraja n².",
      '8n³ вынести нельзя: во втором члене n только дважды. Наименьшая степень n².',
      '8n³ cannot be taken out: the second term has n twice. The lowest power is n².') },
    { when: (s) => s.slots[1] === '(5n − 3)', text: L(
      "Asl yozuvda yig'indi turibdi: 24n² : 8n² = +3, ya'ni qavsda plyus qoladi.",
      'В исходной записи сумма: 24n² : 8n² = +3, значит в скобке остаётся плюс.',
      'The original is a sum: 24n² : 8n² = +3, so the plus stays inside.') },
    { when: (s) => s.slots[2] === '16', text: L(
      "n = 1 bo'lganda 8n² = 8 va (5n + 3) = 8, ya'ni 8 · 8 = 64.",
      'При n = 1 выходит 8n² = 8 и (5n + 3) = 8, значит 8 · 8 = 64.',
      'With n = 1 you get 8n² = 8 and (5n + 3) = 8, so 8 · 8 = 64.') },
  ],
  wrongText: L(
    "Birinchi qatorda ajratib oling, keyin ikki ko'paytuvchining qiymatini alohida hisoblang.",
    'В первой строке разложи, потом посчитай значение двух множителей по отдельности.',
    'Factorise in the first row, then work out the value of each factor.'),
};

export default function D22_07(props) { return <SlotsBank data={DATA} {...props} />; }
