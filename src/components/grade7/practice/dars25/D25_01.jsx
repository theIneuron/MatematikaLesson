// Dars25 · Amaliyot 01 — Kvadratni yig'ish · 🟢 · build · tag: sq_build
// Mexanika: kit.jsx -> BuildLine. Raskladka: 25-dars, 1-o'rin.
// (y + 8)² = y² + 16y + 64. O'rta had IKKI karra ko'paytma: 2 · y · 8 = 16y.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'sq_build', level: '🟢',
  eyebrow: L("Yig'indining kvadrati", 'Квадрат суммы', 'Square of a sum'),
  setup: L(
    "Kvadratda uch had bo'ladi: birinchisining kvadrati, ikki karra ko'paytma va ikkinchisining kvadrati.",
    'В квадрате три члена: квадрат первого, двойное произведение и квадрат второго.',
    'The square has three terms: the first squared, twice the product, and the second squared.'),
  expr: ['(y', '+', '8)²'], exprSize: 34,
  cards: [
    { id: 'a', label: 'y²' },
    { id: 'b', label: '+16y' },
    { id: 'c', label: '+64' },
    { id: 'd', label: '+8y' },
    { id: 'e', label: '+16' },
  ],
  answerSeq: ['a', 'b', 'c'],
  empty: L("Kartalarni bosib javobni tuzing", 'Нажимай карточки и собери ответ', 'Tap the cards to build the answer'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. y² + 2 · y · 8 + 8² = y² + 16y + 64.",
    'Верно. y² + 2 · y · 8 + 8² = y² + 16y + 64.',
    'Correct. y² + 2 · y · 8 + 8² = y² + 16y + 64.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "+8y da ikki karra yo'q. O'rta had 2 · y · 8 = 16y: (y + 8)(y + 8) da y sakkizga IKKI marta uchraydi.",
      'В +8y нет двойки. Средний член 2 · y · 8 = 16y: в (y + 8)(y + 8) игрек встречается с восьмёркой ДВА раза.',
      '+8y misses the doubling. The middle term is 2 · y · 8 = 16y: in (y + 8)(y + 8) the y meets the 8 TWICE.') },
    { when: (s) => s.seq.indexOf('e') !== -1, text: L(
      "+16 bu 2 · 8. Oxirgi had esa kvadrat: 8² = 64.",
      '+16 это 2 · 8. А последний член это квадрат: 8² = 64.',
      '+16 is 2 · 8. The last term is a square: 8² = 64.') },
    { when: (s) => s.seq.length < 3, text: L(
      "Javobda uch had bo'ladi. Bittasi qo'yilmadi.",
      'В ответе три члена. Одного не поставил.',
      'The answer has three terms. One is missing.') },
  ],
  wrongText: L(
    "Kvadratni ko'paytma sifatida yozing: (y + 8)(y + 8). To'rt ko'paytmadan ikkitasi o'xshash.",
    'Запиши квадрат как произведение: (y + 8)(y + 8). Из четырёх произведений два подобны.',
    'Write the square as a product: (y + 8)(y + 8). Two of the four products are alike.'),
};

export default function D25_01(props) { return <BuildLine data={DATA} {...props} />; }
