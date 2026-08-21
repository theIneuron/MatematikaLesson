// Dars12 · Amaliyot 06 — Lentani bo'lish · 🟡 · tag: ribbon_parts
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
//
// «84 sm lenta ikki bo'lakka bo'lindi, biri ikkinchisidan 12 sm uzun.»
// Qisqasi x bo'lsa: x + (x + 12) = 84 -> 2x = 72 -> x = 36.
// Uzun bo'lak 36 + 12 = 48. Tekshirish: 36 + 48 = 84 va 48 − 36 = 12.
// So'raladigan javob -- QISQA bo'lak.
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'ribbon_parts', level: '🟡', allowNeg: false, target: 36,
  eyebrow: L('Ikki bo\'lak', 'Две части', 'Two parts'),
  setup: L(
    "84 sm lenta ikki bo'lakka bo'lindi. Bir bo'lak ikkinchisidan 12 sm uzun. Qisqa bo'lakni x deb oling.",
    'Ленту 84 см разрезали на две части. Одна часть на 12 см длиннее другой. Обозначь короткую часть через x.',
    'A ribbon of 84 cm was cut into two parts. One is 12 cm longer than the other. Call the short part x.'),
  expr: ['x', '+', '(', 'x', '+', '12', ')', '=', '84'], exprSize: 26,
  label: L('Qisqa bo\'lak necha sm?', 'Сколько сантиметров в короткой части?', 'How many centimetres is the short part?'),
  correctText: L(
    "To'g'ri. 2x + 12 = 84, 2x = 72, x = 36. Uzun bo'lak 48 sm. Tekshirish: 36 + 48 = 84.",
    'Верно. 2x + 12 = 84, 2x = 72, x = 36. Длинная часть 48 см. Проверка: 36 + 48 = 84.',
    'Correct. 2x + 12 = 84, 2x = 72, x = 36. The long part is 48 cm. Check: 36 + 48 = 84.'),
  wrongs: [
    { when: (s) => s.value === 42, text: L(
      "42 bu 84 ning yarmi. Lekin bo'laklar TENG emas: biri 12 sm uzun, shuning uchun avval 12 ni ayirish kerak.",
      '42 это половина 84. Но части НЕ равны: одна на 12 см длиннее, поэтому сначала надо вычесть 12.',
      '42 is half of 84. But the parts are NOT equal: one is 12 cm longer, so subtract 12 first.') },
    { when: (s) => s.value === 48, text: L(
      "48 bu UZUN bo'lak. Savol qisqa bo'lak haqida: u 12 sm kamroq.",
      '48 это ДЛИННАЯ часть. Вопрос про короткую: она на 12 см меньше.',
      '48 is the LONG part. The question is about the short one: it is 12 cm less.') },
    { when: (s) => s.value === 72, text: L(
      "72 bu 12 ni ayirgandan keyingi son, ya'ni IKKI qisqa bo'lak. Uni yana ikkiga bo'lish kerak.",
      '72 это число после вычитания 12, то есть ДВЕ короткие части. Его надо ещё разделить на два.',
      '72 is the number after taking 12 away, that is TWO short parts. It still has to be halved.') },
  ],
  wrongText: L(
    "Avval 12 ni ayirib teng ikki bo'lak qoldiring, keyin ikkiga bo'ling.",
    'Сначала вычти 12, чтобы остались две равные части, потом раздели на два.',
    'First take the 12 away so two equal parts are left, then halve it.'),
};

export default function D12_06(props) { return <TypeValue data={DATA} {...props} />; }
