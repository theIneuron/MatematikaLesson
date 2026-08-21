// Dars19 · Amaliyot 08 — Bir had yo'qoladi · 🔴 · build · tag: term_cancels
// Faqat MA'LUMOT. Mexanika: kit.jsx -> BuildLine. Raskladka: 8-o'rin.
//
// (4c² − 5c + 2) − (4c² + 5c − 9) = −10c + 11
//   c²: 4 − 4 = 0     c: −5 − 5 = −10     ozod: 2 + 9 = 11
// c² butunlay yo'qoladi -- javobda u YOZILMAYDI. Kartalar orasida 0c²
// ataylab turadi: nol had yozilmaydi.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'term_cancels', level: '🔴',
  eyebrow: L('Had yo\'qoladi', 'Член исчезает', 'A term cancels'),
  setup: L(
    "Ayirmada bir had butunlay yo'qolishi mumkin: koeffitsiyenti nol chiqsa, u yozuvda umuman ko'rinmaydi. Nol koeffitsiyentli had yozilmaydi.",
    'В разности член может исчезнуть совсем: если коэффициент вышел нулевым, в записи его не пишут. Член с нулевым коэффициентом не записывается.',
    'A term can vanish in a difference: with a zero coefficient it is not written at all.'),
  expr: ['(4c²', '−', '5c', '+', '2)', '−', '(4c²', '+', '5c', '−', '9)'], exprSize: 24,
  cards: [
    { id: 'c10', label: '−10c' },
    { id: 'p11', label: '+11' },
    { id: 'z', label: '0c²' },
    { id: 'p10', label: '+10c' },
    { id: 'm7', label: '−7' },
  ],
  answerSeq: ['c10', 'p11'],
  empty: L("Kartalarni bosib javobni tuzing", 'Нажимай карточки и собери ответ', 'Tap the cards to build the answer'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. c² lar yo'qoldi: 4 − 4 = 0. c lar: −5 − 5 = −10. Ozod hadlar: 2 + 9 = 11. Javob −10c + 11.",
    'Верно. c² исчезли: 4 − 4 = 0. Члены с c: −5 − 5 = −10. Свободные: 2 + 9 = 11. Ответ −10c + 11.',
    'Correct. The c² cancelled: 4 − 4 = 0. The c terms: −5 − 5 = −10. The free terms: 2 + 9 = 11. The answer is −10c + 11.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('z') !== -1, text: L(
      "Koeffitsiyenti nol bo'lgan had yozilmaydi: 0c² yozuvga qo'shilmaydi, u shunchaki yo'qoladi.",
      'Член с нулевым коэффициентом не пишут: 0c² в запись не добавляется, он просто исчезает.',
      'A term with a zero coefficient is not written: 0c² does not go into the record, it simply vanishes.') },
    { when: (s) => s.seq.indexOf('p10') !== -1, text: L(
      "+10c chiqishi uchun 5c lar qo'shilgan deb olingan. Ikkinchi qavs ochilganda +5c manfiy bo'ldi: −5 − 5 = −10.",
      'Чтобы вышло +10c, посчитали, что 5c складываются. При раскрытии второй скобки +5c стало отрицательным: −5 − 5 = −10.',
      'To get +10c the 5c terms were added. Opening the second bracket made +5c negative: −5 − 5 = −10.') },
    { when: (s) => s.seq.indexOf('m7') !== -1, text: L(
      "−7 chiqishi uchun 2 dan 9 ayirilgan. Ikkinchi qavsda −9 turgan, ag'darilib +9 bo'ladi: 2 + 9 = 11.",
      'Чтобы вышло −7, из 2 вычли 9. Во второй скобке стоит −9, оно переворачивается в +9: 2 + 9 = 11.',
      'To get −7 the 9 was subtracted from 2. The second bracket has −9, which flips to +9: 2 + 9 = 11.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Javobda ikki had bo'ladi: c li had va ozod had. Bittasi qo'yilmadi.",
      'В ответе два члена: с c и свободный. Одного не поставил.',
      'The answer has two terms: the c term and the free one. One is missing.') },
  ],
  wrongText: L(
    "Uch guruhni alohida hisoblang: c², c va ozod hadlar. Nol chiqqan guruh yozilmaydi.",
    'Посчитай три группы по отдельности: c², c и свободные. Группа с нулём не записывается.',
    'Work out three groups separately: c², c and the free terms. A group that gives zero is not written.'),
};

export default function D19_08(props) { return <BuildLine data={DATA} {...props} />; }
