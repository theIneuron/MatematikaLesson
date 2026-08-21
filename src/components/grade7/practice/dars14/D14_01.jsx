// Dars14 · Amaliyot 01 — Ko'rsatkichlar qo'shiladi · 🟢 · tag: mul_same_base
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
//
// a³ · a⁴ = a⁷. Uchta a va to'rtta a birga yettita a beradi, ya'ni
// ko'rsatkichlar QO'SHILADI. Xato variantlar: a¹² (ko'rsatkichlarni
// ko'paytirgan) va a¹ (ayirgan).
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'mul_same_base', level: '🟢', optCols: 3,
  eyebrow: L("Ko'paytirish", 'Умножение степеней', 'Multiplying powers'),
  setup: L(
    "Asoslari bir xil darajalar ko'paytirilsa, ko'paytuvchilar soni ortadi. Ularni sanab chiqish yetarli.",
    'Если умножаются степени с одинаковым основанием, число множителей растёт. Достаточно их пересчитать.',
    'When powers with the same base are multiplied the number of factors grows. Counting them is enough.'),
  expr: ['a³', '·', 'a⁴'], exprSize: 36,
  ask: L('Ko\'paytma qanday yoziladi?', 'Как записывается произведение?', 'How is the product written?'),
  opts: [{ label: ['a⁷'] }, { label: ['a¹²'] }, { label: ['a¹'] }],
  correct: 0,
  correctText: L(
    "To'g'ri. a³ bu uchta a, a⁴ bu to'rttasi. Birga yettita a bo'ladi: a⁷. Ko'rsatkichlar qo'shiladi.",
    'Верно. a³ это три a, a⁴ это четыре. Вместе семь a: a⁷. Показатели складываются.',
    'Correct. a³ is three a, a⁴ is four. Together seven a: a⁷. The exponents add.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "a¹² chiqishi uchun ko'rsatkichlar ko'paytirilgan. Ko'paytmada esa ular QO'SHILADI: 3 + 4 = 7.",
      'Чтобы вышло a¹², показатели перемножили. А в произведении они СКЛАДЫВАЮТСЯ: 3 + 4 = 7.',
      'To get a¹² the exponents were multiplied. In a product they ADD: 3 + 4 = 7.') },
    { when: (s) => s.picked === 2, text: L(
      "Ayirish bo'lishda bo'ladi. Ko'paytirishda ko'paytuvchilar soni ortadi: 3 + 4 = 7.",
      'Вычитание бывает при делении. При умножении число множителей растёт: 3 + 4 = 7.',
      'Subtraction happens in division. In multiplication the number of factors grows: 3 + 4 = 7.') },
  ],
  wrongText: L(
    "Yozib chiqing: (a·a·a) · (a·a·a·a). Nechta a bor?",
    'Распиши: (a·a·a) · (a·a·a·a). Сколько всего a?',
    'Write it out: (a·a·a) · (a·a·a·a). How many a in total?'),
};

export default function D14_01(props) { return <Choice data={DATA} {...props} />; }
