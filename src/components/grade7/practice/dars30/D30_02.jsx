// Dars30 · Amaliyot 02 — Ikki qavs · 🟢 · build · tag: whole_build
// Mexanika: kit.jsx -> BuildLine. Raskladka: 2-o'rin.
// 3(x + 2) − (x − 4) = 3x + 6 − x + 4 = 2x + 10.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'whole_build', level: '🟢',
  eyebrow: L('Ixchamlash', 'Упрощение', 'Simplifying'),
  setup: L(
    "Birinchi qavs ko'paytuvchi bilan ochiladi, ikkinchisi minus bilan: uning ikki hadi ishorasini almashtiradi.",
    'Первая скобка раскрывается множителем, вторая минусом: оба её члена меняют знак.',
    'The first bracket opens with a factor, the second with a minus: both its terms flip.'),
  expr: ['3(x', '+', '2)', '−', '(x', '−', '4)'], exprSize: 26,
  cards: [
    { id: 'a', label: '2x' },
    { id: 'b', label: '+10' },
    { id: 'c', label: '4x' },
    { id: 'd', label: '+2' },
    { id: 'e', label: '−10' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Kartalarni bosib javobni tuzing", 'Нажимай карточки и собери ответ', 'Tap the cards to build the answer'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 3x + 6 − x + 4: x lar 3 − 1 = 2, sonlar 6 + 4 = 10.",
    'Верно. 3x + 6 − x + 4: иксы 3 − 1 = 2, числа 6 + 4 = 10.',
    'Correct. 3x + 6 − x + 4: the x give 3 − 1 = 2 and the numbers 6 + 4 = 10.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "4x chiqishi uchun x lar qo'shilgan. Ikkinchi qavs oldida MINUS turibdi: 3x − x = 2x.",
      'Чтобы вышло 4x, иксы сложили. Перед второй скобкой МИНУС: 3x − x = 2x.',
      'To get 4x the x were added. The second bracket has a MINUS: 3x − x = 2x.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "+2 chiqishi uchun 6 dan 4 ayirilgan. Ikkinchi qavsdagi −4 ag'darilib +4 bo'ladi: 6 + 4 = 10.",
      'Чтобы вышло +2, из 6 вычли 4. А −4 второй скобки переворачивается в +4: 6 + 4 = 10.',
      'To get +2 the 4 was subtracted from 6. The −4 flips to +4: 6 + 4 = 10.') },
    { when: (s) => s.seq.indexOf('e') !== -1, text: L(
      "Ishorani tekshiring: 6 va +4 yig'indisi musbat.",
      'Проверь знак: сумма 6 и +4 положительна.',
      'Check the sign: 6 plus 4 is positive.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Javobda ikki had bo'ladi: x li va son.",
      'В ответе два члена: с x и число.',
      'The answer has two terms: the x term and a number.') },
  ],
  wrongText: L(
    "Ikki qavsni oching: birinchisini 3 ga ko'paytiring, ikkinchisining ishoralarini ag'daring.",
    'Раскрой две скобки: первую умножь на 3, у второй переверни знаки.',
    'Open both brackets: multiply the first by 3 and flip the signs of the second.'),
};

export default function D30_02(props) { return <BuildLine data={DATA} {...props} />; }
