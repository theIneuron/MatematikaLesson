// Dars15 · Amaliyot 10 — Bir hadning darajasi · 🔴 · tag: monomial_degree
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
//
// Bir hadning darajasi -- harflar ko'rsatkichlarining YIG'INDISI.
// Koeffitsiyent hisobga olinmaydi.
//   7mn    -> 1 + 1 = 2
//   −4a³   -> 3
//   5x²y³  -> 2 + 3 = 5
// 7mn ATAYLAB: yozilmagan ko'rsatkichlar 1 ga teng, ya'ni daraja 2.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'monomial_degree', level: '🔴', itemSize: 24, zoneLbl: 96,
  eyebrow: L('Bir hadning darajasi', 'Степень одночлена', 'The degree of a monomial'),
  setup: L(
    "Bir hadning darajasi -- harflar ko'rsatkichlarining yig'indisi. Koeffitsiyent bunga qo'shilmaydi, yozilmagan ko'rsatkich esa 1 ga teng.",
    'Степень одночлена — сумма показателей букв. Коэффициент в неё не входит, а ненаписанный показатель равен 1.',
    'The degree of a monomial is the sum of the exponents of its letters. The coefficient does not count, and an unwritten exponent is 1.'),
  zones: [
    { id: 'z2', label: L('2', '2', '2') },
    { id: 'z3', label: L('3', '3', '3') },
    { id: 'z5', label: L('5', '5', '5') },
  ],
  items: [
    { id: 'i1', tokens: ['7mn'], zone: 'z2' },
    { id: 'i2', tokens: ['−4a³'], zone: 'z3' },
    { id: 'i3', tokens: ['5x²y³'], zone: 'z5' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L('Bir hadlar', 'Одночлены', 'Monomials'),
  correctText: L(
    "To'g'ri. 7mn da ikki harf, ko'rsatkichlari 1 va 1 -- daraja 2. −4a³ da bitta harf, ko'rsatkichi 3. 5x²y³ da 2 + 3 = 5.",
    'Верно. В 7mn две буквы с показателями 1 и 1 — степень 2. В −4a³ одна буква с показателем 3. В 5x²y³ выходит 2 + 3 = 5.',
    'Correct. 7mn has two letters with exponents 1 and 1 — degree 2. −4a³ has one letter with exponent 3. 5x²y³ gives 2 + 3 = 5.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "7mn da ko'rsatkichlar yozilmagan, lekin ular bor va 1 ga teng: 1 + 1 = 2. Koeffitsiyent 7 darajaga qo'shilmaydi.",
      'В 7mn показатели не написаны, но они есть и равны 1: 1 + 1 = 2. Коэффициент 7 в степень не входит.',
      'In 7mn the exponents are not written but they are there and equal 1: 1 + 1 = 2. The coefficient 7 does not count.') },
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "5x²y³ da IKKI harf bor: ularning ko'rsatkichlari qo'shiladi, 2 + 3 = 5.",
      'В 5x²y³ ДВЕ буквы: их показатели складываются, 2 + 3 = 5.',
      '5x²y³ has TWO letters: their exponents add, 2 + 3 = 5.') },
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "−4a³ da bitta harf va uning ko'rsatkichi 3. Koeffitsiyentning ishorasi darajaga ta'sir qilmaydi.",
      'В −4a³ одна буква, её показатель 3. Знак коэффициента на степень не влияет.',
      '−4a³ has one letter with exponent 3. The sign of the coefficient does not affect the degree.') },
  ],
  wrongText: L(
    "Har bir hadda harflarning ko'rsatkichlarini qo'shing. Koeffitsiyentga qaramang.",
    'В каждом одночлене сложи показатели букв. На коэффициент не смотри.',
    'In each monomial add the exponents of the letters. Ignore the coefficient.'),
};

export default function D15_10(props) { return <Zones data={DATA} {...props} />; }
