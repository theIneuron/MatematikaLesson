// Dars03 · Amaliyot 03 — Nolga aylanadigan juftlik · 🟡 · tag: pair_to_zero
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TapTerms.
//
// DARAJA KO'TARILDI (metodist qarori 2026-08-21): sonlar to'rt xonali.
//
// 1480 + (−625) + 520 + 625. Ikki qulay juftlik bor:
//   −625 va 625  -> 0      (qarama-qarshi sonlar, so'raladigani)
//   1480 va 520  -> 2000   (yumaloq son, lekin nol emas)
// Yozuvning qiymati: 0 + 2000 = 2000.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'pair_to_zero', level: '🟡', exprSize: 24,
  eyebrow: L('Nol beradigan juftlik', 'Пара, дающая нуль', 'The pair that makes zero'),
  setup: L(
    "Qo'shiluvchilarning o'rnini almashtirish qiymatni o'zgartirmaydi. Qarama-qarshi sonlar birga NOL beradi va yozuvdan butunlay chiqib ketadi.",
    'Перестановка слагаемых не меняет значение. Противоположные числа вместе дают НУЛЬ и уходят из записи совсем.',
    'Swapping terms does not change the value. Opposite numbers make ZERO together and leave the record entirely.'),
  ask: L('Birga NOL beradigan ikki qo\'shiluvchini belgilang.', 'Отметь два слагаемых, которые вместе дают НУЛЬ.', 'Mark the two terms that together make ZERO.'),
  note: L("Hadni bosib belgilanadi. Yozuvda boshqa qulay juftlik ham bor.", 'Слагаемое отмечается нажатием. В записи есть и другая удобная пара.', 'Tap a term to mark it. The record has another handy pair too.'),
  parts: [
    { k: 'term', id: 't1', v: '1480' },
    { k: 'sign', v: '+' },
    { k: 'term', id: 't2', v: '(−625)' },
    { k: 'sign', v: '+' },
    { k: 'term', id: 't3', v: '520' },
    { k: 'sign', v: '+' },
    { k: 'term', id: 't4', v: '625' },
  ],
  want: ['t2', 't4'],
  correctText: L(
    "To'g'ri. −625 va 625 qarama-qarshi, ular nol beradi. Qolgan 1480 + 520 = 2000, ya'ni butun yozuvning qiymati 2000.",
    'Верно. −625 и 625 противоположны и дают нуль. Остаётся 1480 + 520 = 2000, то есть значение всей записи 2000.',
    'Correct. −625 and 625 are opposites and make zero. What is left is 1480 + 520 = 2000, so the whole record is 2000.'),
  wrongs: [
    { when: (s) => s.marked.indexOf('t1') !== -1 && s.marked.indexOf('t3') !== -1, text: L(
      "1480 + 520 = 2000 -- bu ham qulay juftlik, lekin nol emas. Nol beradigan juftlik yozuvdan butunlay chiqib ketadi.",
      '1480 + 520 = 2000 — тоже удобная пара, но не нуль. Пара, дающая нуль, уходит из записи совсем.',
      '1480 + 520 = 2000 is a handy pair too, but not zero. The pair that makes zero leaves the record entirely.') },
    { when: (s) => s.marked.length !== 2, text: L(
      "Aynan ikkita qo'shiluvchi belgilanadi -- moduli teng, ishorasi qarama-qarshi bo'lganlari.",
      'Отмечаются ровно два слагаемых — с равным модулем и противоположными знаками.',
      'Exactly two terms are marked — equal in size, opposite in sign.') },
  ],
  wrongText: L(
    "Modullari teng, ishoralari qarama-qarshi sonlarni qidiring: 625 va minus 625.",
    'Ищи числа с равным модулем и противоположными знаками: 625 и минус 625.',
    'Look for numbers of equal size with opposite signs: 625 and minus 625.'),
};

export default function D03_03(props) { return <TapTerms data={DATA} {...props} />; }
