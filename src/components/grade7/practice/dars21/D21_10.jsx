// Dars21 · Amaliyot 10 — Ikki had uch hadga · 🔴 · build · tag: product_six
// Mexanika: kit.jsx -> BuildLine. Raskladka: 10-o'rin.
// (k + 3)(k² − 2k + 5) = k³ − 2k² + 5k + 3k² − 6k + 15 = k³ + k² − k + 15.
// Olti ko'paytma: 2 · 3 = 6.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'product_six', level: '🔴',
  eyebrow: L('Olti ko\'paytma', 'Шесть произведений', 'Six products'),
  setup: L(
    "Ikkinchi qavsda uch had bor, ya'ni olti ko'paytma chiqadi: 2 · 3. Keyin k² lar va k lar alohida ixchamlanadi.",
    'Во второй скобке три члена, значит выйдет шесть произведений: 2 · 3. Потом отдельно приводятся k² и k.',
    'The second bracket has three terms, so six products appear: 2 · 3. Then the k² and k terms collect separately.'),
  expr: ['(k', '+', '3)', '(k²', '−', '2k', '+', '5)'], exprSize: 26,
  cards: [
    { id: 'a', label: 'k³' },
    { id: 'b', label: '+k²' },
    { id: 'c', label: '−k' },
    { id: 'd', label: '+15' },
    { id: 'e', label: '−k²' },
    { id: 'f', label: '+11k' },
  ],
  answerSeq: ['a', 'b', 'c', 'd'],
  empty: L("Kartalarni bosib javobni tuzing", 'Нажимай карточки и собери ответ', 'Tap the cards to build the answer'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. k² lar: −2k² + 3k² = +k². k lar: 5k − 6k = −k. Ozod had 3 · 5 = 15.",
    'Верно. Члены k²: −2k² + 3k² = +k². Члены k: 5k − 6k = −k. Свободный член 3 · 5 = 15.',
    'Correct. The k² terms: −2k² + 3k² = +k². The k terms: 5k − 6k = −k. The free term is 3 · 5 = 15.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('e') !== -1, text: L(
      "k² larni qayta sanang: −2k² birinchi qavsning k sidan, +3k² esa 3 · k² dan. Yig'indisi +k².",
      'Пересчитай k²: −2k² выходит из k первой скобки, а +3k² из 3 · k². Сумма +k².',
      'Recount the k²: −2k² comes from the k of the first bracket, +3k² from 3 · k². The sum is +k².') },
    { when: (s) => s.seq.indexOf('f') !== -1, text: L(
      "+11k chiqishi uchun 5k va 6k qo'shilgan. Ikkinchisi manfiy: 5k − 6k = −k.",
      'Чтобы вышло +11k, сложили 5k и 6k. Второе отрицательное: 5k − 6k = −k.',
      'To get +11k the 5k and 6k were added. The second is negative: 5k − 6k = −k.') },
    { when: (s) => s.seq.length < 4, text: L(
      "Javobda to'rt had bo'ladi: k³, k², k va son. Bittasi qo'yilmadi.",
      'В ответе четыре члена: k³, k², k и число. Одного не поставил.',
      'The answer has four terms: k³, k², k and the number. One is missing.') },
  ],
  wrongText: L(
    "Olti ko'paytmani yozib chiqing, keyin k² larni va k larni alohida guruhlab qo'shing.",
    'Распиши шесть произведений, потом сложи k² и k по группам.',
    'Write the six products, then add the k² terms and the k terms in groups.'),
};

export default function D21_10(props) { return <BuildLine data={DATA} {...props} />; }
