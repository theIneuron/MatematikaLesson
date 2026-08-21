// Dars11 · Amaliyot 01 — Masalaning tenglamasi · 🟢 · tag: pick_equation
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
//
// DARAJA KO'TARILDI (PODXOD_7SINF.md §13): shart uch va to'rt xonali
// sonlar bilan, hisob esa og'zaki: 1250 − 140 = 1110.
//
// «Maktabda x o'quvchi bor edi, yana 140 nafari keldi va 1250 nafar bo'ldi.»
// Tenglama: x + 140 = 1250.
// Xato variantlar: x − 140 = 1250 (kelganlarni ketgan deb o'qigan) va
// 140x = 1250 («yana 140 nafar» ni «140 barobar» deb o'qigan).
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'pick_equation', level: '🟢', optCols: 3,
  eyebrow: L('Masala va tenglama', 'Задача и уравнение', 'A problem and its equation'),
  setup: L(
    "Maktabda x nafar o'quvchi bor edi. Yana 140 nafari keldi va maktabda 1250 nafar bo'ldi.",
    'В школе было x учеников. Пришли ещё 140, и в школе стало 1250.',
    'A school had x pupils. Another 140 came, making 1250 in the school.'),
  ask: L('Qaysi tenglama shu masalaga mos?', 'Какое уравнение соответствует задаче?', 'Which equation matches the problem?'),
  opts: [
    { label: ['x', '+', '140', '=', '1250'] },
    { label: ['x', '−', '140', '=', '1250'] },
    { label: ['140x', '=', '1250'] },
  ],
  correct: 0,
  correctText: L(
    "To'g'ri. Kelganlar QO'SHILADI: boshlang'ich son x ga 140 qo'shilib 1250 bo'ldi.",
    'Верно. Пришедшие ПРИБАВЛЯЮТСЯ: к начальному числу x прибавили 140 и получили 1250.',
    'Correct. Those who came are ADDED: 140 added to the starting number x makes 1250.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Ayirish ketganlar uchun bo'lardi. Bu masalada esa o'quvchilar KELDI, ya'ni son ortdi.",
      'Вычитание было бы, если бы ученики ушли. А в этой задаче они ПРИШЛИ, значит число выросло.',
      'Subtraction would fit pupils leaving. Here they ARRIVED, so the number grew.') },
    { when: (s) => s.picked === 2, text: L(
      "140x bu «140 barobar ko'p» degani. Masalada esa «yana 140 nafar», ya'ni qo'shiluvchi 140.",
      '140x значит «в 140 раз больше». А в задаче «ещё 140 учеников», то есть слагаемое 140.',
      '140x means "140 times as many". The problem says "another 140 pupils", that is a term of 140.') },
  ],
  wrongText: L(
    "Masalani o'qing: son ortdimi yoki kamaydimi? Ortgan bo'lsa, qo'shish yoziladi.",
    'Прочитай задачу: число выросло или уменьшилось? Если выросло, пишется сложение.',
    'Read the problem: did the number grow or shrink? If it grew, an addition is written.'),
};

export default function D11_01(props) { return <Choice data={DATA} {...props} />; }
