// Dars25 · Amaliyot 08 — Harf va koeffitsiyent · 🔴 · build · tag: sq_letters_coef
// Mexanika: kit.jsx -> BuildLine. Raskladka: 8-o'rin.
// (a + 3b)² = a² + 6ab + 9b². O'rta had 2 · a · 3b = 6ab, oxirgisi (3b)² = 9b².
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'sq_letters_coef', level: '🔴',
  eyebrow: L('Harf va koeffitsiyent', 'Буква и коэффициент', 'Letter and coefficient'),
  setup: L(
    "Ikkinchi hadda koeffitsiyent bor: (3b)² da 3 ham kvadratga ko'tariladi. O'rta hadda esa u faqat bir marta ishlatiladi.",
    'Во втором члене есть коэффициент: в (3b)² тройка тоже возводится в квадрат. А в среднем члене она берётся один раз.',
    'The second term has a coefficient: in (3b)² the 3 is squared too. In the middle term it appears once.'),
  expr: ['(a', '+', '3b)²'], exprSize: 34,
  cards: [
    { id: 'a', label: 'a²' },
    { id: 'b', label: '+6ab' },
    { id: 'c', label: '+9b²' },
    { id: 'd', label: '+3ab' },
    { id: 'e', label: '+6b²' },
  ],
  answerSeq: ['a', 'b', 'c'],
  empty: L("Kartalarni bosib javobni tuzing", 'Нажимай карточки и собери ответ', 'Tap the cards to build the answer'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. a², keyin 2 · a · 3b = 6ab, oxirida (3b)² = 9b².",
    'Верно. a², потом 2 · a · 3b = 6ab, в конце (3b)² = 9b².',
    'Correct. a², then 2 · a · 3b = 6ab, and finally (3b)² = 9b².'),
  wrongs: [
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "+3ab da ikki karra yo'q: 2 · a · 3b = 6ab.",
      'В +3ab нет двойки: 2 · a · 3b = 6ab.',
      '+3ab misses the doubling: 2 · a · 3b = 6ab.') },
    { when: (s) => s.seq.indexOf('e') !== -1, text: L(
      "+6b² da koeffitsiyent kvadratga ko'tarilmagan: (3b)² = 9b², 6b² emas.",
      'В +6b² коэффициент не возведён в квадрат: (3b)² = 9b², а не 6b².',
      'In +6b² the coefficient was not squared: (3b)² = 9b², not 6b².') },
    { when: (s) => s.seq.length < 3, text: L(
      "Uch had bo'lishi kerak.",
      'Должно быть три члена.',
      'There must be three terms.') },
  ],
  wrongText: L(
    "Ikkinchi hadni butunligi bilan oling: 3b. Uning kvadrati nechchi, ikki karra ko'paytma nechchi?",
    'Возьми второй член целиком: 3b. Чему равен его квадрат и чему двойное произведение?',
    'Take the second term whole: 3b. What is its square and what is twice the product?'),
};

export default function D25_08(props) { return <BuildLine data={DATA} {...props} />; }
