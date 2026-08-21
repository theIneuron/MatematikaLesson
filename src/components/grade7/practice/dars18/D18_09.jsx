// Dars18 · Amaliyot 09 — Ikki harfli hadlar · 🔴 · build · tag: poly_two_letters
// Faqat MA'LUMOT. Mexanika: kit.jsx -> BuildLine. Raskladka: 9-o'rin.
//
// 2a²b − 5ab² + 4a²b + ab = 6a²b − 5ab² + ab.
// O'xshash faqat a²b lar: 2 + 4 = 6. a²b va ab² -- BOSHQA hadlar, harflar
// bir xil, lekin ko'rsatkichlar joyi boshqa.
// Ortiqcha kartalar: 8a²b (ab² ni ham qo'shgan), −ab, +5ab².
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'poly_two_letters', level: '🔴',
  eyebrow: L('Ikki harf', 'Две буквы', 'Two letters'),
  setup: L(
    "Harflari bir xil bo'lsa ham hadlar o'xshash bo'lmasligi mumkin: a²b da a ikki marta, ab² da b ikki marta. Ular qo'shilmaydi.",
    'Даже при одинаковых буквах члены могут не быть подобными: в a²b дважды a, в ab² дважды b. Они не складываются.',
    'Even with the same letters terms may not be alike: a²b has two a, ab² has two b. They do not combine.'),
  expr: ['2a²b', '−', '5ab²', '+', '4a²b', '+', 'ab'], exprSize: 28,
  cards: [
    { id: 'a6', label: '6a²b' },
    { id: 'b5', label: '−5ab²' },
    { id: 'ab', label: '+ab' },
    { id: 'a8', label: '8a²b' },
    { id: 'mab', label: '−ab' },
    { id: 'pb5', label: '+5ab²' },
  ],
  answerSeq: ['a6', 'b5', 'ab'],
  empty: L("Kartalarni bosib javobni tuzing", 'Нажимай карточки и собери ответ', 'Tap the cards to build the answer'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. O'xshash faqat a²b lar: 2 + 4 = 6. −5ab² va +ab ning o'xshashi yo'q, ular o'z ishorasi bilan qoladi.",
    'Верно. Подобны только a²b: 2 + 4 = 6. У −5ab² и +ab подобных нет, они остаются со своими знаками.',
    'Correct. Only the a²b terms are alike: 2 + 4 = 6. −5ab² and +ab have no like terms and keep their signs.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('a8') !== -1, text: L(
      "8a²b chiqishi uchun ab ham qo'shilgan. ab da b bitta, a ham bitta -- bu boshqa had.",
      'Чтобы вышло 8a²b, прибавили ещё и ab. В ab по одной букве — это другой член.',
      'To get 8a²b the ab was added too. In ab each letter appears once — a different term.') },
    { when: (s) => s.seq.indexOf('pb5') !== -1, text: L(
      "5ab² manfiy edi. O'xshashi yo'q had ishorasini o'zgartirmaydi.",
      '5ab² был отрицательным. Член без подобных знак не меняет.',
      '5ab² was negative. A term with no like term keeps its sign.') },
    { when: (s) => s.seq.indexOf('mab') !== -1, text: L(
      "ab musbat edi: asl yozuvda uning oldida plyus turgan.",
      'ab был положительным: в исходной записи перед ним плюс.',
      'ab was positive: the original has a plus before it.') },
    { when: (s) => s.seq.length < 3, text: L(
      "Javobda uch had bo'ladi: a²b, ab² va ab. Bittasi qo'yilmadi.",
      'В ответе три члена: a²b, ab² и ab. Одного не поставил.',
      'The answer has three terms: a²b, ab² and ab. One is missing.') },
  ],
  wrongText: L(
    "Har hadda a nechta, b nechta -- shuni solishtiring. Faqat to'liq mos kelganlari o'xshash.",
    'Сравни, сколько в каждом члене a и сколько b. Подобны только полностью совпавшие.',
    'Compare how many a and how many b each term has. Only a full match makes them alike.'),
};

export default function D18_09(props) { return <BuildLine data={DATA} {...props} />; }
