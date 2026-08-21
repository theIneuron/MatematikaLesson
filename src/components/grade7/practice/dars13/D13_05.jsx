// Dars13 · Amaliyot 05 — Qavs bor va qavs yo'q · 🟡 · tag: bracket_vs_none
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SlotsBank.
//
// Bu darsning eng nozik joyi:
//   (−2)⁴ = 16    qavs manfiy sonni butunligi bilan asos qildi
//   −2⁴  = −16    daraja faqat 2 ga tegishli, minus tashqarida qoldi
// Ya'ni qavs bir belgi emas, MA'NO farqi.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'bracket_vs_none', level: '🟡',
  eyebrow: L('Qavs qayerda', 'Где скобка', 'Where the bracket is'),
  setup: L(
    "Qavs manfiy sonni butunligi bilan asos qiladi. Qavs bo'lmasa, daraja faqat songa tegishli bo'ladi, minus esa tashqarida qoladi.",
    'Скобка делает отрицательное число основанием целиком. Без скобки степень относится только к числу, а минус остаётся снаружи.',
    'A bracket makes the negative number the base as a whole. Without it the power applies to the number only and the minus stays outside.'),
  rows: [
    [{ t: ['(−2)⁴', '='] }, { slot: 0 }],
    [{ t: ['−2⁴', '='] }, { slot: 1 }],
  ],
  cards: ['16', '−16', '8', '−8', '32', '−32'],
  answer: ['16', '−16'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. (−2)⁴ da to'rtta minus ko'paytiriladi -- juft son, natija musbat: 16. −2⁴ da esa avval 2⁴ = 16 hisoblanadi, keyin minus qo'yiladi: −16.",
    'Верно. В (−2)⁴ перемножаются четыре минуса — чётное число, результат положительный: 16. А в −2⁴ сначала считается 2⁴ = 16, потом ставится минус: −16.',
    'Correct. In (−2)⁴ four minuses multiply — an even number, so the result is positive: 16. In −2⁴ the 2⁴ = 16 is worked out first, then the minus is applied: −16.'),
  wrongs: [
    { when: (s) => s.slots[0] === '−16', text: L(
      "Qavs ichida manfiy son turibdi va u TO'RT marta ko'paytiriladi: minuslar juft, natija musbat.",
      'В скобке стоит отрицательное число, и оно умножается ЧЕТЫРЕ раза: минусов чётное число, результат положительный.',
      'The bracket holds a negative number multiplied FOUR times: an even number of minuses, so the result is positive.') },
    { when: (s) => s.slots[1] === '16', text: L(
      "Ikkinchi yozuvda qavs YO'Q: daraja faqat ikkiga tegishli, minus esa tashqarida qoladi. Javob manfiy.",
      'Во второй записи скобки НЕТ: степень относится только к двойке, а минус остаётся снаружи. Ответ отрицательный.',
      'The second record has NO bracket: the power applies to the two only and the minus stays outside. The answer is negative.') },
    { when: (s) => s.slots[0] === '8' || s.slots[0] === '−8' || s.slots[1] === '8' || s.slots[1] === '−8', text: L(
      "Ko'paytuvchilarni sanang: to'rtta ikkilik 16 beradi, 8 esa uchtasidan chiqadi.",
      'Посчитай множители: четыре двойки дают 16, а 8 выходит из трёх.',
      'Count the factors: four twos give 16, while 8 comes from three.') },
  ],
  wrongText: L(
    "Ikki yozuvni alohida o'qing: qavs ichida nima turibdi va daraja nimaga tegishli?",
    'Прочитай обе записи по отдельности: что стоит в скобке и к чему относится степень?',
    'Read the two records separately: what is inside the bracket and what does the power apply to?'),
};

export default function D13_05(props) { return <SlotsBank data={DATA} {...props} />; }
