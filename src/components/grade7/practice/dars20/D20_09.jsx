// Dars20 · Amaliyot 09 — Ikki qavs, keyin ixchamlash · 🔴 · build · tag: two_brackets
// Faqat MA'LUMOT. Mexanika: kit.jsx -> BuildLine. Raskladka: 9-o'rin.
//
// 3x(2x + 5) − 2x(x − 4) = 6x² + 15x − 2x² + 8x = 4x² + 23x
//   x²: 6 − 2 = 4
//   x:  15 + 8 = 23    (ikkinchi qavsda −2x · (−4) = +8x)
// Ortiqcha kartalar: +7x (8 ni ayirgan), 8x² (qavslarni qo'shgan), −23x.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'two_brackets', level: '🔴',
  eyebrow: L('Ikki qavs', 'Две скобки', 'Two brackets'),
  setup: L(
    "Ikki ko'paytma hisoblanadi, keyin o'xshash hadlar ixchamlanadi. Ikkinchi qavs oldida manfiy bir had turibdi -- uning ikkinchi ko'paytmasi musbat chiqadi.",
    'Считаются два произведения, потом приводятся подобные. Перед второй скобкой стоит отрицательный одночлен — его второе произведение выходит положительным.',
    'Two products are worked out, then like terms are collected. The second bracket has a negative monomial, so its second product comes out positive.'),
  expr: ['3x', '(2x', '+', '5)', '−', '2x', '(x', '−', '4)'], exprSize: 26,
  cards: [
    { id: 'a', label: '4x²' },
    { id: 'b', label: '+23x' },
    { id: 'c', label: '+7x' },
    { id: 'd', label: '8x²' },
    { id: 'e', label: '−23x' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Kartalarni bosib javobni tuzing", 'Нажимай карточки и собери ответ', 'Tap the cards to build the answer'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 6x² + 15x − 2x² + 8x. x²: 6 − 2 = 4. x: 15 + 8 = 23, chunki −2x · (−4) = +8x.",
    'Верно. 6x² + 15x − 2x² + 8x. x²: 6 − 2 = 4. x: 15 + 8 = 23, потому что −2x · (−4) = +8x.',
    'Correct. 6x² + 15x − 2x² + 8x. x²: 6 − 2 = 4. x: 15 + 8 = 23, because −2x · (−4) = +8x.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "+7x chiqishi uchun 15 dan 8 ayirilgan. Ikkinchi qavsda ikki minus bor: −2x · (−4) = +8x, ya'ni QO'SHILADI.",
      'Чтобы вышло +7x, из 15 вычли 8. Во второй скобке два минуса: −2x · (−4) = +8x, значит ПРИБАВЛЯЕТСЯ.',
      'To get +7x the 8 was subtracted from 15. The second bracket has two minuses: −2x · (−4) = +8x, so it ADDS.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "8x² chiqishi uchun 6 va 2 qo'shilgan. Ikkinchi ko'paytma AYIRILADI: 6 − 2 = 4.",
      'Чтобы вышло 8x², сложили 6 и 2. Второе произведение ВЫЧИТАЕТСЯ: 6 − 2 = 4.',
      'To get 8x² the 6 and 2 were added. The second product is SUBTRACTED: 6 − 2 = 4.') },
    { when: (s) => s.seq.indexOf('e') !== -1, text: L(
      "Ishorani tekshiring: 15x va 8x ikkisi ham musbat, ya'ni yig'indisi +23x.",
      'Проверь знак: 15x и 8x оба положительные, значит сумма +23x.',
      'Check the sign: 15x and 8x are both positive, so the sum is +23x.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Javobda ikki had bo'ladi: x² li va x li. Bittasi qo'yilmadi.",
      'В ответе два члена: с x² и с x. Одного не поставил.',
      'The answer has two terms: x² and x. One is missing.') },
  ],
  wrongText: L(
    "Ikki qavsni alohida ochib yozing, keyin x² larni va x larni ishorasi bilan qo'shing.",
    'Раскрой две скобки по отдельности, потом сложи x² и x со знаками.',
    'Open the two brackets separately, then add the x² and x terms with their signs.'),
};

export default function D20_09(props) { return <BuildLine data={DATA} {...props} />; }
