// Dars18 · Amaliyot 07 — Manfiy koeffitsiyent · 🟡 · build · tag: poly_neg_coef
// Faqat MA'LUMOT. Mexanika: kit.jsx -> BuildLine. Raskladka: 7-o'rin.
//
// 3p³ − 5p³ + 5p = −2p³ + 5p. Koeffitsiyent MANFIY chiqadi: 3 − 5 = −2.
// Ortiqcha kartalar: +2p³ (ishorani tashlagan), 8p³ (ayirish o'rniga
// qo'shgan), −5p (ishora).
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'poly_neg_coef', level: '🟡',
  eyebrow: L('Manfiy koeffitsiyent', 'Отрицательный коэффициент', 'A negative coefficient'),
  setup: L(
    "O'xshash hadlarni ixchamlaganda koeffitsiyent manfiy ham chiqishi mumkin. Bunda had yozuvda minus bilan turadi.",
    'При приведении подобных коэффициент может выйти и отрицательным. Тогда член стоит в записи с минусом.',
    'Collecting like terms can give a negative coefficient. Then the term stands with a minus in the record.'),
  expr: ['3p³', '−', '5p³', '+', '5p'], exprSize: 32,
  cards: [
    { id: 'm2p3', label: '−2p³' },
    { id: 'p5p', label: '+5p' },
    { id: 'p2p3', label: '+2p³' },
    { id: 'c8p3', label: '8p³' },
    { id: 'm5p', label: '−5p' },
  ],
  answerSeq: ['m2p3', 'p5p'],
  empty: L("Kartalarni bosib javobni tuzing", 'Нажимай карточки и собери ответ', 'Tap the cards to build the answer'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 3 − 5 = −2, ya'ni −2p³. 5p ning o'xshashi yo'q, u o'z ishorasi bilan qoladi.",
    'Верно. 3 − 5 = −2, то есть −2p³. У 5p подобных нет, он остаётся со своим знаком.',
    'Correct. 3 − 5 = −2, giving −2p³. 5p has no like term and keeps its sign.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('p2p3') !== -1, text: L(
      "Ishora yo'qoldi: 3 dan 5 ni ayirsa −2 chiqadi, ya'ni had manfiy.",
      'Потерялся знак: если из 3 вычесть 5, выйдет −2, то есть член отрицательный.',
      'The sign got lost: 3 minus 5 is −2, so the term is negative.') },
    { when: (s) => s.seq.indexOf('c8p3') !== -1, text: L(
      "8p³ chiqishi uchun 3 va 5 qo'shilgan. Ikkinchi had oldida esa MINUS turibdi.",
      'Чтобы вышло 8p³, сложили 3 и 5. А перед вторым членом стоит МИНУС.',
      'To get 8p³ the 3 and 5 were added. But the second term has a MINUS before it.') },
    { when: (s) => s.seq.indexOf('m5p') !== -1, text: L(
      "5p musbat edi: o'xshashi bo'lmagan had ishorasini o'zgartirmaydi.",
      '5p был положительным: член без подобных знак не меняет.',
      '5p was positive: a term with no like term does not change its sign.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Javobda ikki had bo'ladi: p³ va p. Bittasi qo'yilmadi.",
      'В ответе два члена: p³ и p. Одного не поставил.',
      'The answer has two terms: p³ and p. One is missing.') },
  ],
  wrongText: L(
    "Koeffitsiyentlarni ishorasi bilan hisoblang: 3 − 5. Natija musbatmi yoki manfiy?",
    'Посчитай коэффициенты со знаками: 3 − 5. Результат положительный или отрицательный?',
    'Work out the coefficients with signs: 3 − 5. Is the result positive or negative?'),
};

export default function D18_07(props) { return <BuildLine data={DATA} {...props} />; }
