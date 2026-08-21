// Dars11 · Amaliyot 01 — Masalaning tenglamasi · 🟢 · tag: pick_equation
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
//
// «Sinfda x o'quvchi bor edi, yana 4 nafari keldi va 27 nafar bo'ldi.»
// Tenglama: x + 4 = 27.
// Xato variantlar: x − 4 = 27 (kelganlarni ketgan deb o'qigan) va 4x = 27
// («yana 4 nafar» ni «to'rt barobar» deb o'qigan).
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'pick_equation', level: '🟢', optCols: 3,
  eyebrow: L('Masala va tenglama', 'Задача и уравнение', 'A problem and its equation'),
  setup: L(
    "Sinfda x nafar o'quvchi bor edi. Yana 4 nafari keldi va sinfda 27 nafar bo'ldi.",
    'В классе было x учеников. Пришли ещё 4, и в классе стало 27.',
    'A class had x pupils. Another 4 came, making 27 in the class.'),
  ask: L('Qaysi tenglama shu masalaga mos?', 'Какое уравнение соответствует задаче?', 'Which equation matches the problem?'),
  opts: [
    { label: ['x', '+', '4', '=', '27'] },
    { label: ['x', '−', '4', '=', '27'] },
    { label: ['4x', '=', '27'] },
  ],
  correct: 0,
  correctText: L(
    "To'g'ri. Kelganlar QO'SHILADI: boshlang'ich son x ga 4 qo'shilib 27 bo'ldi.",
    'Верно. Пришедшие ПРИБАВЛЯЮТСЯ: к начальному числу x прибавили 4 и получили 27.',
    'Correct. Those who came are ADDED: 4 added to the starting number x makes 27.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Ayirish ketganlar uchun bo'lardi. Bu masalada esa o'quvchilar KELDI, ya'ni son ortdi.",
      'Вычитание было бы, если бы ученики ушли. А в этой задаче они ПРИШЛИ, значит число выросло.',
      'Subtraction would fit pupils leaving. Here they ARRIVED, so the number grew.') },
    { when: (s) => s.picked === 2, text: L(
      "4x bu «to'rt barobar ko'p» degani. Masalada esa «yana 4 nafar», ya'ni qo'shiluvchi 4.",
      '4x значит «в четыре раза больше». А в задаче «ещё 4 ученика», то есть слагаемое 4.',
      '4x means "four times as many". The problem says "another 4 pupils", that is a term of 4.') },
  ],
  wrongText: L(
    "Masalani o'qing: son ortdimi yoki kamaydimi? Ortgan bo'lsa, qo'shish yoziladi.",
    'Прочитай задачу: число выросло или уменьшилось? Если выросло, пишется сложение.',
    'Read the problem: did the number grow or shrink? If it grew, an addition is written.'),
};

export default function D11_01(props) { return <Choice data={DATA} {...props} />; }
