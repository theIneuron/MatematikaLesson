// Dars03 · Amaliyot 03 — Nolga aylanadigan juftlik · 🟡 · tag: pair_to_zero
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TapTerms.
//
// DARAJA KO'TARILDI (metodist qarori 2026-08-21): ilgari juftlik yuz berardi
// va ko'zga darhol tashlanardi. Endi yozuvda manfiy qo'shiluvchi bor va
// eng qulay juftlik NOL beradi.
//
// 48 + (−25) + 52 + 25. Ikki juftlik bor:
//   −25 va 25  -> 0     (qarama-qarshi sonlar, eng qulay)
//   48 va 52   -> 100
// So'raladigan juftlik -- nol beradigani. Ya'ni o'quvchi «yumaloq son»
// odatidan chiqib, qarama-qarshi sonlarni ko'rishi kerak.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'pair_to_zero', level: '🟡', exprSize: 26,
  eyebrow: L('Nol beradigan juftlik', 'Пара, дающая нуль', 'The pair that makes zero'),
  setup: L(
    "Qo'shiluvchilarning o'rnini almashtirish qiymatni o'zgartirmaydi. Yozuvda qarama-qarshi sonlar bo'lsa, ular birga NOL beradi va yozuvdan chiqib ketadi.",
    'Перестановка слагаемых не меняет значение. Если в записи есть противоположные числа, вместе они дают НУЛЬ и уходят из записи.',
    'Swapping terms does not change the value. If a record has opposite numbers, together they make ZERO and drop out.'),
  ask: L('Birga NOL beradigan ikki qo\'shiluvchini belgilang.', 'Отметь два слагаемых, которые вместе дают НУЛЬ.', 'Mark the two terms that together make ZERO.'),
  note: L("Hadni bosib belgilanadi.", 'Слагаемое отмечается нажатием.', 'Tap a term to mark it.'),
  parts: [
    { k: 'term', id: 't1', v: '48' },
    { k: 'sign', v: '+' },
    { k: 'term', id: 't2', v: '(−25)' },
    { k: 'sign', v: '+' },
    { k: 'term', id: 't3', v: '52' },
    { k: 'sign', v: '+' },
    { k: 'term', id: 't4', v: '25' },
  ],
  want: ['t2', 't4'],
  correctText: L(
    "To'g'ri. −25 va 25 qarama-qarshi sonlar, ular birga nol beradi. Qolgan 48 + 52 = 100, ya'ni butun yozuvning qiymati 100.",
    'Верно. −25 и 25 противоположны, вместе они дают нуль. Остаётся 48 + 52 = 100, то есть значение всей записи 100.',
    'Correct. −25 and 25 are opposites and make zero together. What is left is 48 + 52 = 100, so the whole record is 100.'),
  wrongs: [
    { when: (s) => s.marked.indexOf('t1') !== -1 && s.marked.indexOf('t3') !== -1, text: L(
      "48 + 52 = 100 -- bu ham qulay juftlik, lekin nol emas. Savol qarama-qarshi sonlar haqida: ular yozuvdan butunlay chiqib ketadi.",
      '48 + 52 = 100 — тоже удобная пара, но не нуль. Вопрос про противоположные числа: они уходят из записи совсем.',
      '48 + 52 = 100 is a handy pair too, but not zero. The question is about opposites: they leave the record entirely.') },
    { when: (s) => s.marked.length !== 2, text: L(
      "Aynan ikkita qo'shiluvchi belgilanadi -- moduli teng, ishorasi qarama-qarshi bo'lganlari.",
      'Отмечаются ровно два слагаемых — с равным модулем и противоположными знаками.',
      'Exactly two terms are marked — equal in size, opposite in sign.') },
  ],
  wrongText: L(
    "Modullari teng, ishoralari qarama-qarshi sonlarni qidiring: ular birga nol beradi.",
    'Ищи числа с равным модулем и противоположными знаками: вместе они дают нуль.',
    'Look for numbers of equal size with opposite signs: together they make zero.'),
};

export default function D03_03(props) { return <TapTerms data={DATA} {...props} />; }
