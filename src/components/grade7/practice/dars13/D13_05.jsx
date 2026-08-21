// Dars13 · Amaliyot 05 — Qavs bor va qavs yo'q · 🟡 · tag: bracket_vs_none
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SlotsBank.
//
// DARAJA KO'TARILDI (PODXOD_7SINF.md §13): qiymatlar besh xonali.
//
// Bu darsning eng nozik joyi:
//   (−10)⁴ = 10000    qavs manfiy sonni butunligi bilan asos qildi
//   −10⁴  = −10000    daraja faqat 10 ga tegishli, minus tashqarida qoldi
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
    [{ t: ['(−10)⁴', '='] }, { slot: 0 }],
    [{ t: ['−10⁴', '='] }, { slot: 1 }],
  ],
  cards: ['10000', '−10000', '1000', '−1000', '40', '−40'],
  answer: ['10000', '−10000'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. (−10)⁴ da to'rtta minus ko'paytiriladi -- juft son, natija musbat: 10000. −10⁴ da esa avval 10⁴ = 10000 hisoblanadi, keyin minus qo'yiladi: −10000.",
    'Верно. В (−10)⁴ перемножаются четыре минуса — чётное число, результат положительный: 10000. А в −10⁴ сначала считается 10⁴ = 10000, потом ставится минус: −10000.',
    'Correct. In (−10)⁴ four minuses multiply — an even number, so the result is positive: 10000. In −10⁴ the 10⁴ = 10000 is worked out first, then the minus is applied: −10000.'),
  wrongs: [
    { when: (s) => s.slots[0] === '−10000', text: L(
      "Qavs ichida manfiy son turibdi va u TO'RT marta ko'paytiriladi: minuslar juft, natija musbat.",
      'В скобке стоит отрицательное число, и оно умножается ЧЕТЫРЕ раза: минусов чётное число, результат положительный.',
      'The bracket holds a negative number multiplied FOUR times: an even number of minuses, so the result is positive.') },
    { when: (s) => s.slots[1] === '10000', text: L(
      "Ikkinchi yozuvda qavs YO'Q: daraja faqat o'nga tegishli, minus esa tashqarida qoladi. Javob manfiy.",
      'Во второй записи скобки НЕТ: степень относится только к десятке, а минус остаётся снаружи. Ответ отрицательный.',
      'The second record has NO bracket: the power applies to the ten only and the minus stays outside. The answer is negative.') },
    { when: (s) => s.slots[0] === '1000' || s.slots[0] === '−1000' || s.slots[1] === '1000' || s.slots[1] === '−1000', text: L(
      "Ko'paytuvchilarni sanang: to'rtta o'nlik to'rtta nol beradi, 1000 esa uchtasidan chiqadi.",
      'Посчитай множители: четыре десятки дают четыре нуля, а 1000 выходит из трёх.',
      'Count the factors: four tens give four zeros, while 1000 comes from three.') },
  ],
  wrongText: L(
    "Ikki yozuvni alohida o'qing: qavs ichida nima turibdi va daraja nimaga tegishli?",
    'Прочитай обе записи по отдельности: что стоит в скобке и к чему относится степень?',
    'Read the two records separately: what is inside the bracket and what does the power apply to?'),
};

export default function D13_05(props) { return <SlotsBank data={DATA} {...props} />; }
