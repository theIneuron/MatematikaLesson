// Dars15 · Amaliyot 09 — Ikki harfli bir had · 🔴 · tag: two_letter_value
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
//
// 5x²y, x = −2, y = 3.
//   x² = (−2)² = 4     (juft ko'rsatkich, natija musbat)
//   5 · 4 · 3 = 60
// Xato javoblar: −60 (x² ni manfiy deb olgan), −30 yoki 30 (x² o'rniga
// x ni qo'ygan).
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'two_letter_value', level: '🔴', allowNeg: true, target: 60,
  eyebrow: L('Ikki harf', 'Две буквы', 'Two letters'),
  setup: L(
    "Har harf o'z sonini oladi. Avval darajalar hisoblanadi, keyin hamma ko'paytuvchi ko'paytiriladi.",
    'Каждая буква получает своё число. Сначала считаются степени, потом перемножаются все множители.',
    'Each letter gets its own number. Powers are worked out first, then all the factors are multiplied.'),
  given: [['x', '=', '−2'], ['y', '=', '3']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  expr: ['5x²y'], exprSize: 38,
  label: L('Qiymatni yozing:', 'Запиши значение:', 'Write the value:'),
  correctText: L(
    "To'g'ri. x² = (−2)² = 4 -- juft ko'rsatkich, natija musbat. Keyin 5 · 4 · 3 = 60.",
    'Верно. x² = (−2)² = 4 — показатель чётный, результат положительный. Затем 5 · 4 · 3 = 60.',
    'Correct. x² = (−2)² = 4 — an even exponent, so positive. Then 5 · 4 · 3 = 60.'),
  wrongs: [
    { when: (s) => s.value === -60, text: L(
      "Ishorani tekshiring: (−2)² da ikki minus ko'paytiriladi, natija MUSBAT 4.",
      'Проверь знак: в (−2)² перемножаются два минуса, результат ПОЛОЖИТЕЛЬНЫЙ, 4.',
      'Check the sign: in (−2)² two minuses multiply, so the result is POSITIVE 4.') },
    { when: (s) => s.value === -30 || s.value === 30, text: L(
      "x KVADRATI kerak: (−2)² = 4, −2 emas. Ko'rsatkichni tashlab ketmang.",
      'Нужен КВАДРАТ x: (−2)² = 4, а не −2. Не теряй показатель.',
      'The SQUARE of x is needed: (−2)² = 4, not −2. Do not drop the exponent.') },
    { when: (s) => s.value === 20 || s.value === 12, text: L(
      "Uchta ko'paytuvchi bor: 5, x² va y. Ularning hammasi hisobga olinadi: 5 · 4 · 3.",
      'Множителей три: 5, x² и y. Учитываются все: 5 · 4 · 3.',
      'There are three factors: 5, x² and y. All of them count: 5 · 4 · 3.') },
  ],
  wrongText: L(
    "Avval x² ni hisoblang, keyin 5 va y ga ko'paytiring.",
    'Сначала посчитай x², потом умножь на 5 и на y.',
    'First work out x², then multiply by 5 and by y.'),
};

export default function D15_09(props) { return <TypeValue data={DATA} {...props} />; }
