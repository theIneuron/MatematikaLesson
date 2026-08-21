// Dars32 · Amaliyot 09 — To'liq kvadrat bilan · 🔴 · build · tag: frac_square
// Mexanika: kit.jsx -> BuildLine. Raskladka: 9-o'rin.
// (m² + 6m + 9) : (m + 3) = m + 3, chunki m² + 6m + 9 = (m + 3)².
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'frac_square', level: '🔴',
  eyebrow: L('Kvadrat bilan', 'С квадратом', 'With a square'),
  setup: L(
    "Bo'linuvchi to'liq kvadrat: (m + 3)². Bir qavs bo'luvchi bilan qisqaradi, ikkinchisi javobda qoladi.",
    'Делимое это полный квадрат: (m + 3)². Одна скобка сокращается с делителем, вторая остаётся в ответе.',
    'The dividend is a perfect square: (m + 3)². One bracket cancels with the divisor, the other stays.'),
  expr: ['(m²', '+', '6m', '+', '9)', ':', '(m', '+', '3)'], exprSize: 24,
  cards: [
    { id: 'a', label: 'm' },
    { id: 'b', label: '+3' },
    { id: 'c', label: '+9' },
    { id: 'd', label: 'm²' },
    { id: 'e', label: '+6' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Kartalarni bosib javobni tuzing", 'Нажимай карточки и собери ответ', 'Tap the cards to build the answer'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. m² + 6m + 9 = (m + 3)², ya'ni (m + 3)² : (m + 3) = m + 3.",
    'Верно. m² + 6m + 9 = (m + 3)², значит (m + 3)² : (m + 3) = m + 3.',
    'Correct. m² + 6m + 9 = (m + 3)², so dividing by (m + 3) leaves m + 3.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "+9 hadini alohida bo'lib bo'lmaydi: bo'luvchi yig'indi, ya'ni avval ajratish kerak.",
      'Член +9 нельзя делить отдельно: делитель это сумма, значит сначала надо разложить.',
      'The +9 cannot be divided on its own: the divisor is a sum, so factorise first.') },
    { when: (s) => s.seq.indexOf('d') !== -1 || s.seq.indexOf('e') !== -1, text: L(
      "Hadlarni birma-bir bo'lish bu yerda ishlamaydi: bo'luvchi yig'indi. Bo'linuvchini kvadrat ko'rinishida yozing.",
      'Делить члены по одному здесь нельзя: делитель это сумма. Запиши делимое в виде квадрата.',
      'Dividing term by term does not work here: the divisor is a sum. Write the dividend as a square.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Javobda ikki had bo'ladi: m va son.",
      'В ответе два члена: m и число.',
      'The answer has two terms: m and a number.') },
  ],
  wrongText: L(
    "Bo'linuvchi to'liq kvadratmi? 9 = 3² va o'rta had 2 · m · 3 = 6m.",
    'Полный ли квадрат делимое? 9 = 3², а средний член 2 · m · 3 = 6m.',
    'Is the dividend a perfect square? 9 = 3² and the middle term is 2 · m · 3 = 6m.'),
};

export default function D32_09(props) { return <BuildLine data={DATA} {...props} />; }
