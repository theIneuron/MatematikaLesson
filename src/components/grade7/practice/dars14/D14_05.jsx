// Dars14 · Amaliyot 05 — Qaysilarni birlashtirish mumkin · 🟡 · tag: same_base_only
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TapTerms.
//
// a³ · b² · a⁴. Xossa faqat ASOSLARI BIR XIL darajalar uchun ishlaydi:
// a³ va a⁴ birlashadi (a⁷ bo'ladi), b² esa alohida qoladi.
// Eng ko'p uchraydigan xato: hamma ko'rsatkichni qo'shib yuborish.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'same_base_only', level: '🟡', exprSize: 30,
  eyebrow: L('Asoslar bir xilmi', 'Одинаковы ли основания', 'Are the bases the same'),
  setup: L(
    "Ko'rsatkichlarni qo'shish xossasi faqat asoslari BIR XIL darajalar uchun ishlaydi. Boshqa asos alohida qoladi.",
    'Свойство сложения показателей работает только для степеней с ОДИНАКОВЫМ основанием. Другое основание остаётся отдельно.',
    'The rule of adding exponents works only for powers with the SAME base. A different base stays apart.'),
  ask: L("Ko'rsatkichlari QO'SHILADIGAN ko'paytuvchilarni belgilang.", 'Отметь множители, показатели которых СКЛАДЫВАЮТСЯ.', 'Mark the factors whose exponents ADD.'),
  note: L("Ularning asosi bir xil bo'lishi kerak.", 'У них должно быть одинаковое основание.', 'They must share the same base.'),
  parts: [
    { k: 'term', id: 't1', v: 'a³' },
    { k: 'sign', v: '·' },
    { k: 'term', id: 't2', v: 'b²' },
    { k: 'sign', v: '·' },
    { k: 'term', id: 't3', v: 'a⁴' },
  ],
  want: ['t1', 't3'],
  correctText: L(
    "To'g'ri. a³ va a⁴ ning asosi bir xil: 3 + 4 = 7, ya'ni a⁷. Yozuv a⁷ · b² bo'lib qoladi.",
    'Верно. У a³ и a⁴ основание одно: 3 + 4 = 7, то есть a⁷. Запись становится a⁷ · b².',
    'Correct. a³ and a⁴ share a base: 3 + 4 = 7, that is a⁷. The record becomes a⁷ · b².'),
  wrongs: [
    { when: (s) => s.extra.indexOf('t2') !== -1, text: L(
      "b² ning asosi boshqa harf. Uning ko'rsatkichini a ning ko'rsatkichlariga qo'shib bo'lmaydi.",
      'У b² основание — другая буква. Её показатель нельзя складывать с показателями a.',
      'The base of b² is a different letter. Its exponent cannot join the exponents of a.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Bittasi qoldi: a asosli IKKI ko'paytuvchi bor, ikkovini ham belgilash kerak.",
      'Одно осталось: множителей с основанием a ДВА, отметить нужно оба.',
      'One is left: there are TWO factors with base a, and both must be marked.') },
  ],
  wrongText: L(
    "Har ko'paytuvchining ASOSINI solishtiring: qaysilarida bir xil harf turibdi?",
    'Сравни ОСНОВАНИЯ множителей: где стоит одна и та же буква?',
    'Compare the BASES of the factors: which have the same letter?'),
};

export default function D14_05(props) { return <TapTerms data={DATA} {...props} />; }
