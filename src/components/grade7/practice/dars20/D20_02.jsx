// Dars20 · Amaliyot 02 — Ko'paytirilmagan had · 🟢 · fix · tag: mul_fix
// Faqat MA'LUMOT. Mexanika: kit.jsx -> TapTerms. Raskladka: 2-o'rin.
//
// Boshqa o'quvchi: 4a(2a + 7) = 8a² + 7
//   8a² TO'G'RI (4a · 2a)
//   +7 NOTO'G'RI: 4a ga ko'paytirilmagan, 4a · 7 = 28a bo'lishi kerak.
// Bu blokning eng ko'p uchraydigan xatosi: qavsning oxirgi hadi tashlab
// ketiladi.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'mul_fix', level: '🟢',
  eyebrow: L('Xato had', 'Неверный член', 'The wrong term'),
  setup: L(
    "Boshqa o'quvchi qavsni ko'paytirdi, lekin bitta had noto'g'ri. Har hadni tekshiring: qavs oldidagi bir had hammasiga ko'paytirilishi kerak.",
    'Другой ученик умножил скобку, но один член неверный. Проверь каждый: одночлен перед скобкой должен умножиться на все члены.',
    'Another pupil multiplied the bracket, but one term is wrong. Check each one: the monomial in front must multiply every term.'),
  given: [['4a', '(2a', '+', '7)']],
  givenLabel: L('Masala:', 'Задание:', 'The task:'),
  ask: L("Javobdagi NOTO'G'RI hadni belgilang.", 'Отметь НЕВЕРНЫЙ член в ответе.', 'Mark the WRONG term in the answer.'),
  note: L('Bitta had.', 'Один член.', 'One term.'),
  parts: [
    { k: 'term', id: 't1', v: '8a²' },
    { k: 'sign', v: '+' },
    { k: 'term', id: 't2', v: '7' },
  ],
  want: ['t2'],
  correctText: L(
    "To'g'ri. 7 ni ham 4a ga ko'paytirish kerak edi: 4a · 7 = 28a. Javob 8a² + 28a.",
    'Верно. 7 тоже надо было умножить на 4a: 4a · 7 = 28a. Ответ 8a² + 28a.',
    'Correct. The 7 also had to be multiplied by 4a: 4a · 7 = 28a. The answer is 8a² + 28a.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('t1') !== -1, text: L(
      "8a² to'g'ri: 4a · 2a da koeffitsiyentlar 4 · 2 = 8, harflar esa a · a = a². Xato ikkinchi hadda.",
      '8a² верно: в 4a · 2a коэффициенты 4 · 2 = 8, а буквы a · a = a². Ошибка во втором члене.',
      '8a² is right: in 4a · 2a the coefficients give 4 · 2 = 8 and the letters a · a = a². The error is in the second term.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Ikkinchi hadni tekshiring: u qavs oldidagi 4a ga ko'paytirilganmi?",
      'Проверь второй член: он умножен на 4a, стоящее перед скобкой?',
      'Check the second term: was it multiplied by the 4a in front?') },
  ],
  wrongText: L(
    "Qavsdagi hadlar sonini sanang: ikkita. Javobda ham ikki KO'PAYTMA bo'lishi kerak.",
    'Посчитай члены в скобке: их два. В ответе тоже должно быть два ПРОИЗВЕДЕНИЯ.',
    'Count the terms in the bracket: two. The answer must hold two PRODUCTS as well.'),
};

export default function D20_02(props) { return <TapTerms data={DATA} {...props} />; }
