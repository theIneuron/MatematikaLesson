// Dars13 · Amaliyot 02 — Darajani hisoblash · 🟢 · tag: power_value
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
//
// DARAJA KO'TARILDI (PODXOD_7SINF.md §13): javob to'rt xonali.
//
// 2¹⁰ = 1024. Ikkilikni o'nta ko'paytirish: 2, 4, 8, 16, 32, 64, 128, 256,
// 512, 1024. Har qadamda son ikki barobar oshadi.
// Xato javoblar: 20 (2 · 10), 512 (bir ko'paytuvchi kam, 2⁹), 100 (10²).
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'power_value', level: '🟢', allowNeg: false, target: 1024,
  eyebrow: L('Darajani hisoblash', 'Вычислить степень', 'Work out the power'),
  setup: L(
    "Asos ko'rsatkich necha marta bo'lsa, shuncha marta ko'paytuvchi bo'ladi. Ikkilikni ko'paytirganda son har qadamda ikki barobar oshadi.",
    'Основание берётся множителем столько раз, сколько показывает показатель. При умножении двойки число на каждом шаге удваивается.',
    'The base is a factor as many times as the exponent says. Doubling the two makes the number twice as big at each step.'),
  expr: ['2¹⁰'], exprSize: 40,
  label: L('Qiymatni yozing:', 'Запиши значение:', 'Write the value:'),
  correctText: L(
    "To'g'ri. 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024 -- o'nta ko'paytuvchi. 2¹⁰ = 1024.",
    'Верно. 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024 — десять множителей. 2¹⁰ = 1024.',
    'Correct. 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024 — ten factors. 2¹⁰ = 1024.'),
  wrongs: [
    { when: (s) => s.value === 20, text: L(
      "20 bu 2 · 10. Ko'rsatkich ko'paytiruvchi emas: u ko'paytirishlar SONINI aytadi.",
      '20 это 2 · 10. Показатель не множитель: он говорит, СКОЛЬКО раз умножать.',
      '20 is 2 · 10. The exponent is not a factor: it says HOW MANY times to multiply.') },
    { when: (s) => s.value === 512, text: L(
      "512 bu 2⁹, ya'ni to'qqizta ko'paytuvchi. Bittasi kam qoldi: 512 · 2 = 1024.",
      '512 это 2⁹, девять множителей. Одного не хватило: 512 · 2 = 1024.',
      '512 is 2⁹, nine factors. One is missing: 512 · 2 = 1024.') },
    { when: (s) => s.value === 100, text: L(
      "100 bu 10², ya'ni asos va ko'rsatkich almashgan. Pastda 2 turibdi.",
      '100 это 10², то есть основание и показатель перепутаны. Внизу стоит 2.',
      '100 is 10², so the base and the exponent got swapped. The 2 is below.') },
  ],
  wrongText: L(
    "Ikkini ikki barobarlab boring va qadamlarni sanang: o'nta ko'paytuvchi bo'lishi kerak.",
    'Удваивай двойку и считай шаги: множителей должно быть десять.',
    'Keep doubling the two and count the steps: there must be ten factors.'),
};

export default function D13_02(props) { return <TypeValue data={DATA} {...props} />; }
