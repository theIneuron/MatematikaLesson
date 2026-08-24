// Dars12 · Amaliyot 02 — Qiymat · 🟢 · tag: product_value
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS12_14_AMALIYOT_SKELET.md §3 (12-dars, 2-pozitsiya)
//
// Xossani ISHLATISH: 36 va 49 ning ikkalasi ham to'liq kvadrat, demak
// o'n yetti yuz oltmish to'rtni hisoblash shart emas — olti karra yetti
// kifoya. Uchta xato javob uch xil yo'l:
//   13   — ildizlar QO'SHILDI (amal almashdi);
//   1764 — ko'paytma hisoblandi, ildiz olinmadi;
//   85   — ildiz ostidagi sonlar qo'shildi.
// `TypeValue` faqat butun son oladi, javob esa butun — 42.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'product_value', level: '🟢',
  target: 42, allowNeg: false,
  expr: [{ r: '36 · 49' }], exprSize: 34,
  eyebrow: L('Qiymat', 'Значение', 'Value'),
  setup: L(
    "Ildiz ostida ikki son ko'paytiriladi, va ikkalasi ham to'liq kvadrat. Katta ko'paytmani hisoblash kerak emas: har ko'paytuvchidan alohida ildiz olinadi.",
    'Под корнем перемножаются два числа, и оба — полные квадраты. Считать большое произведение не нужно: корень берётся из каждого множителя отдельно.',
    'Two numbers are multiplied under the root, and both are perfect squares. There is no need to compute the big product: the root is taken from each factor separately.'),
  label: L('ildizning qiymati', 'значение корня', 'the value of the root'),
  ask: L('Bu yozuv nimaga teng?', 'Чему равна эта запись?', 'What does this record equal?'),
  correctText: L(
    "To'g'ri. O'ttiz oltidan ildiz olti, qirq to'qqizdan ildiz yetti, olti karra yetti qirq ikki. Tekshiring: qirq ikkini kvadratga oshirsangiz o'n yetti yuz oltmish to'rt chiqadi, o'ttiz olti karra qirq to'qqiz ham o'n yetti yuz oltmish to'rt. Katta sonni umuman hisoblamasdan javobga yetdik.",
    'Верно. Корень из тридцати шести — шесть, корень из сорока девяти — семь, шесть на семь — сорок два. Проверь: сорок два в квадрате даёт тысяча семьсот шестьдесят четыре, и тридцать шесть на сорок девять тоже тысяча семьсот шестьдесят четыре. До ответа дошли, вообще не считая большое число.',
    'Correct. The root of thirty six is six, the root of forty nine is seven, six times seven is forty two. Check: forty two squared is one thousand seven hundred sixty four, and thirty six times forty nine is also one thousand seven hundred sixty four. We reached the answer without computing the big number at all.'),
  wrongs: [
    { when: (s) => s.value === 13, text: L(
      "Ildizlar QO'SHILDI: olti qo'shuv yetti o'n uch. Lekin ildiz ostida qo'shish emas, ko'paytirish turadi, demak ildizlar ham ko'paytiriladi. Tekshiring: o'n uchni kvadratga oshirsangiz yuz oltmish to'qqiz chiqadi, o'ttiz olti karra qirq to'qqiz esa undan ancha katta.",
      'Корни СЛОЖЕНЫ: шесть плюс семь — тринадцать. Но под корнем не сложение, а умножение, значит и корни перемножаются. Проверь: тринадцать в квадрате — сто шестьдесят девять, а тридцать шесть на сорок девять намного больше.',
      'The roots were ADDED: six plus seven is thirteen. But under the root there is a product, not a sum, so the roots multiply too. Check: thirteen squared is one hundred sixty nine, while thirty six times forty nine is far bigger.') },
    { when: (s) => s.value === 1764, text: L(
      "Bu ildiz ostidagi ko'paytmaning o'zi: o'ttiz olti karra qirq to'qqiz o'n yetti yuz oltmish to'rt. Ildiz belgisi esa hali olinmagan. Kvadrati o'n yetti yuz oltmish to'rtga teng sonni topish kerak, sonning o'zini emas.",
      'Это само произведение под корнем: тридцать шесть на сорок девять — тысяча семьсот шестьдесят четыре. А корень ещё не взят. Нужно найти число, чей квадрат равен тысяче семисот шестидесяти четырём, а не само это число.',
      'That is the product under the root itself: thirty six times forty nine is one thousand seven hundred sixty four. The root has not been taken yet. You need the number whose square equals it, not the number itself.') },
    { when: (s) => s.value === 85, text: L(
      "Bu ildiz ostidagi sonlarning yig'indisi: o'ttiz olti qo'shuv qirq to'qqiz sakson besh. Yozuvda esa qo'shish yo'q, ko'paytirish bor. Tekshiring: sakson beshni kvadratga oshirsangiz yetti ming ikki yuz yigirma besh chiqadi.",
      'Это сумма чисел под корнем: тридцать шесть плюс сорок девять — восемьдесят пять. А в записи не сложение, а умножение. Проверь: восемьдесят пять в квадрате — семь тысяч двести двадцать пять.',
      'That is the sum of the numbers under the root: thirty six plus forty nine is eighty five. But the record has a product, not a sum. Check: eighty five squared is seven thousand two hundred twenty five.') },
    { when: (s) => s.value === 6 || s.value === 7, text: L(
      "Bu faqat bitta ko'paytuvchining ildizi. Ikkinchisi ham hisoblanishi va birinchisiga ko'paytirilishi kerak. Tekshiring: oltini kvadratga oshirsangiz o'ttiz olti chiqadi, qirq to'qqiz esa yo'qolib qoldi.",
      'Это корень только из одного множителя. Второй тоже надо посчитать и умножить на первый. Проверь: шесть в квадрате даёт тридцать шесть, а сорок девять пропало.',
      'That is the root of only one factor. The second must be computed too and multiplied by the first. Check: six squared is thirty six, and forty nine has gone missing.') },
  ],
  wrongText: L(
    "Har ko'paytuvchidan alohida ildiz oling va ikki javobni ko'paytiring. Javobni kvadratga oshirib tekshiring: ildiz ostidagi ko'paytma chiqishi kerak.",
    'Возьми корень из каждого множителя отдельно и перемножь два ответа. Проверь возведением в квадрат: должно выйти произведение под корнем.',
    'Take the root of each factor separately and multiply the two answers. Check by squaring: the product under the root must come out.'),
};

export default function D12_02(props) { return <TypeValue data={DATA} {...props} />; }
