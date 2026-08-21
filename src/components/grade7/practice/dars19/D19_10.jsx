// Dars19 · Amaliyot 10 — Uch ishora ag'dariladi · 🔴 · build · tag: all_signs_flip
// Faqat MA'LUMOT. Mexanika: kit.jsx -> BuildLine. Raskladka: 10-o'rin.
//
// (a³ − 2a² + 6) − (−a³ + 2a² − 6) = 2a³ − 4a² + 12
//   a³: 1 + 1 = 2      a²: −2 − 2 = −4      ozod: 6 + 6 = 12
// Ikkinchi qavs birinchisining ishorasi teskarisi, shuning uchun «qavslar
// bir-birini yo'qotadi» degan taassurot paydo bo'ladi -- aslida hammasi
// IKKI BAROBAR bo'ladi. Karta 0 ataylab turadi.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'all_signs_flip', level: '🔴',
  eyebrow: L('Uch ishora', 'Три знака', 'Three signs'),
  setup: L(
    "Ikkinchi qavsdagi uch hadning uchtasi ham ishorasini o'zgartiradi. Ikki qavs bir-biriga o'xshab turadi, lekin ayirma nolga teng emas.",
    'Все три члена второй скобки меняют знак. Скобки похожи друг на друга, но разность не равна нулю.',
    'All three terms of the second bracket flip their signs. The brackets look alike, but the difference is not zero.'),
  expr: ['(a³', '−', '2a²', '+', '6)', '−', '(−a³', '+', '2a²', '−', '6)'], exprSize: 24,
  cards: [
    { id: 'a2', label: '2a³' },
    { id: 'a4', label: '−4a²' },
    { id: 'p12', label: '+12' },
    { id: 'zero', label: '0' },
    { id: 'ma2', label: '−2a³' },
    { id: 'p4', label: '+4a²' },
  ],
  answerSeq: ['a2', 'a4', 'p12'],
  empty: L("Kartalarni bosib javobni tuzing", 'Нажимай карточки и собери ответ', 'Tap the cards to build the answer'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Uch had ham ag'darildi: +a³, −2a², +6. Keyin a³: 1 + 1 = 2, a²: −2 − 2 = −4, ozod: 6 + 6 = 12.",
    'Верно. Все три члена перевернулись: +a³, −2a², +6. Потом a³: 1 + 1 = 2, a²: −2 − 2 = −4, свободные: 6 + 6 = 12.',
    'Correct. All three flipped: +a³, −2a², +6. Then a³: 1 + 1 = 2, a²: −2 − 2 = −4, free: 6 + 6 = 12.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('zero') !== -1, text: L(
      "Nol chiqishi uchun qavslar teng deb olingan. Ular teng emas: ikkinchisining ishoralari teskari, ayirmada esa yana ag'dariladi -- natijada har had IKKI BAROBAR bo'ladi.",
      'Нуль выходит, если считать скобки равными. Они не равны: у второй знаки противоположные, а при вычитании они переворачиваются снова — каждый член УДВАИВАЕТСЯ.',
      'Zero comes from treating the brackets as equal. They are not: the second has opposite signs, and subtracting flips them again — each term DOUBLES.') },
    { when: (s) => s.seq.indexOf('ma2') !== -1, text: L(
      "Ikkinchi qavsda −a³ turgan, minus uni ag'daradi va +a³ bo'ladi: 1 + 1 = 2, ya'ni 2a³.",
      'Во второй скобке стоит −a³, минус его переворачивает в +a³: 1 + 1 = 2, то есть 2a³.',
      'The second bracket has −a³; the minus flips it to +a³: 1 + 1 = 2, giving 2a³.') },
    { when: (s) => s.seq.indexOf('p4') !== -1, text: L(
      "Ikkinchi qavsda +2a² turgan, ag'darilib −2a² bo'ladi: −2 − 2 = −4.",
      'Во второй скобке стоит +2a², он переворачивается в −2a²: −2 − 2 = −4.',
      'The second bracket has +2a², which flips to −2a²: −2 − 2 = −4.') },
    { when: (s) => s.seq.length < 3, text: L(
      "Javobda uch had bo'ladi: a³, a² va ozod had. Bittasi qo'yilmadi.",
      'В ответе три члена: a³, a² и свободный. Одного не поставил.',
      'The answer has three terms: a³, a² and the free one. One is missing.') },
  ],
  wrongText: L(
    "Ikkinchi qavsning uch hadini ham ag'daring, keyin o'xshashlarni qo'shing. Ishora teskari bo'lgani ularni yo'qotmaydi.",
    'Переверни все три члена второй скобки, потом сложи подобные. Противоположные знаки их не уничтожают.',
    'Flip all three terms of the second bracket, then collect like terms. Opposite signs do not cancel them.'),
};

export default function D19_10(props) { return <BuildLine data={DATA} {...props} />; }
