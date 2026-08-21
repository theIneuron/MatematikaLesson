// Dars14 · Amaliyot 01 — Ko'rsatkichlar qo'shiladi · 🟢 · tag: mul_same_base
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
//
// DARAJA KO'TARILDI (PODXOD_7SINF.md §13): ko'rsatkichlar kattaroq, ya'ni
// ularni yodda sanash emas, qo'shish kerak.
//
// a⁸ · a⁵ = a¹³. Sakkizta a va beshta a birga o'n uchta a beradi, ya'ni
// ko'rsatkichlar QO'SHILADI. Xato variantlar: a⁴⁰ (ko'rsatkichlarni
// ko'paytirgan) va a³ (ayirgan).
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'mul_same_base', level: '🟢', optCols: 3,
  eyebrow: L("Ko'paytirish", 'Умножение степеней', 'Multiplying powers'),
  setup: L(
    "Asoslari bir xil darajalar ko'paytirilsa, ko'paytuvchilar soni ortadi. Ularni sanab chiqish yetarli.",
    'Если умножаются степени с одинаковым основанием, число множителей растёт. Достаточно их пересчитать.',
    'When powers with the same base are multiplied the number of factors grows. Counting them is enough.'),
  expr: ['a⁸', '·', 'a⁵'], exprSize: 36,
  ask: L('Ko\'paytma qanday yoziladi?', 'Как записывается произведение?', 'How is the product written?'),
  opts: [{ label: ['a¹³'] }, { label: ['a⁴⁰'] }, { label: ['a³'] }],
  correct: 0,
  correctText: L(
    "To'g'ri. a⁸ bu sakkizta a, a⁵ bu beshtasi. Birga o'n uchta a bo'ladi: a¹³. Ko'rsatkichlar qo'shiladi.",
    'Верно. a⁸ это восемь a, a⁵ это пять. Вместе тринадцать a: a¹³. Показатели складываются.',
    'Correct. a⁸ is eight a, a⁵ is five. Together thirteen a: a¹³. The exponents add.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "a⁴⁰ chiqishi uchun ko'rsatkichlar ko'paytirilgan. Ko'paytmada esa ular QO'SHILADI: 8 + 5 = 13.",
      'Чтобы вышло a⁴⁰, показатели перемножили. А в произведении они СКЛАДЫВАЮТСЯ: 8 + 5 = 13.',
      'To get a⁴⁰ the exponents were multiplied. In a product they ADD: 8 + 5 = 13.') },
    { when: (s) => s.picked === 2, text: L(
      "Ayirish bo'lishda bo'ladi. Ko'paytirishda ko'paytuvchilar soni ortadi: 8 + 5 = 13.",
      'Вычитание бывает при делении. При умножении число множителей растёт: 8 + 5 = 13.',
      'Subtraction happens in division. In multiplication the number of factors grows: 8 + 5 = 13.') },
  ],
  wrongText: L(
    "Ko'rsatkichlarni qo'shing: sakkiz qo'shuv besh. Nechta a bor?",
    'Сложи показатели: восемь плюс пять. Сколько всего a?',
    'Add the exponents: eight plus five. How many a in total?'),
};

export default function D14_01(props) { return <Choice data={DATA} {...props} />; }
