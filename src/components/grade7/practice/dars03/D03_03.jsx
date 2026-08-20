// Dars03 · Amaliyot 03 — Yumaloq juftlik · 🟡 · tag: pair_to_hundred
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TapTerms.
//
// 37 + 64 + 63 + 25. Qo'shishda ham o'rin almashtirish ishlaydi. Yumaloq
// son beradigan juftlik: 37 + 63 = 100. Qolganlari 64 + 25 = 89 -- yaqin,
// lekin yumaloq emas. Ya'ni o'quvchi to'rt sonni juftlab sinab ko'rishi
// kerak, birinchi ko'rinishga ishonib bo'lmaydi.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'pair_to_hundred', level: '🟡',
  eyebrow: L('Yumaloq juftlik', 'Круглая пара', 'The round pair'),
  setup: L(
    "Qo'shiluvchilarning o'rnini almashtirish qiymatni o'zgartirmaydi. Shuning uchun avval yumaloq son beradigan juftlikni qo'shish qulay.",
    'Перестановка слагаемых не меняет значение. Поэтому удобно сначала сложить пару, которая даёт круглое число.',
    'Swapping the terms does not change the value. So it is handy to add the pair that gives a round number first.'),
  ask: L("Birinchi qo'shish qulay bo'lgan IKKI qo'shiluvchini belgilang.", 'Отметь ДВА слагаемых, которые удобно сложить первыми.', 'Mark the TWO terms that are handy to add first.'),
  note: L('Hadni bosib belgilanadi.', 'Слагаемое отмечается нажатием.', 'Tap a term to mark it.'),
  parts: [
    { k: 'term', id: 't1', v: '37' },
    { k: 'sign', v: '+' },
    { k: 'term', id: 't2', v: '64' },
    { k: 'sign', v: '+' },
    { k: 'term', id: 't3', v: '63' },
    { k: 'sign', v: '+' },
    { k: 'term', id: 't4', v: '25' },
  ],
  want: ['t1', 't3'],
  correctText: L(
    "To'g'ri. 37 + 63 = 100. Keyin 100 + 64 + 25 = 189 og'zaki chiqadi.",
    'Верно. 37 + 63 = 100. Дальше 100 + 64 + 25 = 189 считается устно.',
    'Correct. 37 + 63 = 100. Then 100 + 64 + 25 = 189 comes out mentally.'),
  wrongs: [
    { when: (s) => s.marked.indexOf('t2') !== -1 && s.marked.indexOf('t4') !== -1, text: L(
      "64 + 25 = 89. Yumaloqqa yaqin, lekin yumaloq emas: birliklar 4 va 5, ular birga 9 beradi, 10 emas.",
      '64 + 25 = 89. Близко к круглому, но не круглое: единицы 4 и 5 дают 9, а не 10.',
      '64 + 25 = 89. Close to round but not round: the units 4 and 5 make 9, not 10.') },
    { when: (s) => s.marked.length !== 2, text: L(
      "Aynan ikkita qo'shiluvchi belgilanadi -- ular birga yumaloq son berishi kerak.",
      'Отмечаются ровно два слагаемых — вместе они должны дать круглое число.',
      'Exactly two terms are marked — together they must make a round number.') },
  ],
  wrongText: L(
    "Birliklarga qarang: qaysi ikki sonning birliklari birga 10 beradi? 7 va 3.",
    'Смотри на единицы: у каких двух чисел единицы вместе дают 10? У 7 и 3.',
    'Look at the units: which two numbers have units adding to 10? The 7 and the 3.'),
};

export default function D03_03(props) { return <TapTerms data={DATA} {...props} />; }
