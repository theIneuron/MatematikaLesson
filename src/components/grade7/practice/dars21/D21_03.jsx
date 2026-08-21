// Dars21 · Amaliyot 03 — Natijani yig'ish · 🟢 · build · tag: product_build
// Faqat MA'LUMOT. Mexanika: kit.jsx -> BuildLine. Raskladka: 3-o'rin.
//
// (x + 5)(x + 2) = x² + 2x + 5x + 10 = x² + 7x + 10.
// Ortiqcha kartalar: +10x (o'rtadagi hadni ko'paytma deb olgan),
// +3x (ayirgan), x (kvadratni yozmagan).
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'product_build', level: '🟢',
  eyebrow: L("Ikki qavs ko'paytmasi", 'Произведение двух скобок', 'Product of two brackets'),
  setup: L(
    "To'rt ko'paytma hosil bo'ladi, so'ng o'rtadagi ikki had o'xshash bo'lib ixchamlanadi. Javob uch haddan iborat.",
    'Получаются четыре произведения, потом два средних оказываются подобными и приводятся. В ответе три члена.',
    'Four products appear, then the two middle ones turn out alike and collect. The answer has three terms.'),
  expr: ['(x', '+', '5)', '(x', '+', '2)'], exprSize: 30,
  cards: [
    { id: 'a', label: 'x²' },
    { id: 'b', label: '+7x' },
    { id: 'c', label: '+10' },
    { id: 'd', label: '+10x' },
    { id: 'e', label: '+3x' },
    { id: 'f', label: 'x' },
  ],
  answerSeq: ['a', 'b', 'c'],
  empty: L("Kartalarni bosib javobni tuzing", 'Нажимай карточки и собери ответ', 'Tap the cards to build the answer'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. x · x = x², o'rtada 2x + 5x = 7x, oxirida 5 · 2 = 10.",
    'Верно. x · x = x², в середине 2x + 5x = 7x, в конце 5 · 2 = 10.',
    'Correct. x · x = x², in the middle 2x + 5x = 7x, at the end 5 · 2 = 10.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "+10x da 5 va 2 ko'paytirilib x ga qo'shilgan. O'rtadagi hadlar QO'SHILADI: 2x + 5x = 7x.",
      'В +10x перемножили 5 и 2 и приписали x. Средние члены СКЛАДЫВАЮТСЯ: 2x + 5x = 7x.',
      'In +10x the 5 and 2 were multiplied and given an x. The middle terms ADD: 2x + 5x = 7x.') },
    { when: (s) => s.seq.indexOf('e') !== -1, text: L(
      "+3x chiqishi uchun 5 dan 2 ayirilgan. Ikki qavsda ham plyus turibdi, ya'ni qo'shiladi.",
      'Чтобы вышло +3x, из 5 вычли 2. В обеих скобках плюс, значит складываем.',
      'To get +3x the 2 was subtracted from 5. Both brackets have a plus, so add.') },
    { when: (s) => s.seq.indexOf('f') !== -1, text: L(
      "x · x = x², ya'ni birinchi had kvadrat bo'ladi.",
      'x · x = x², значит первый член это квадрат.',
      'x · x = x², so the first term is a square.') },
    { when: (s) => s.seq.length < 3, text: L(
      "Javobda uch had bo'ladi: x², o'rta had va son. Bittasi qo'yilmadi.",
      'В ответе три члена: x², средний и число. Одного не поставил.',
      'The answer has three terms: x², the middle one and the number. One is missing.') },
  ],
  wrongText: L(
    "To'rt ko'paytmani yozib chiqing: x·x, x·2, 5·x, 5·2. Keyin o'xshashlarni qo'shing.",
    'Распиши четыре произведения: x·x, x·2, 5·x, 5·2. Потом сложи подобные.',
    'Write the four products: x·x, x·2, 5·x, 5·2. Then collect the like ones.'),
};

export default function D21_03(props) { return <BuildLine data={DATA} {...props} />; }
