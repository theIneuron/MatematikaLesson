// Dars11 · Amaliyot 08 — Uch ketma-ket son · 🔴 · tag: consecutive_three
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
//
// «Uch ketma-ket sonning yig'indisi 48.» Kichigi x bo'lsa, keyingilari
// x + 1 va x + 2:
//   x + (x + 1) + (x + 2) = 48
// Yig'ilgan ko'rinishi 3x + 3 = 48, bundan x = 15, sonlar 15, 16, 17.
// «3x = 48» varianti ATAYLAB turadi: u ham 16 beradi, lekin 16 -- O'RTADAGI
// son, ya'ni bu tenglama boshqa masalaning tenglamasi (o'rtadagini x deb
// olganda). Shart «kichigi x» deganda u xato.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'consecutive_three', level: '🔴',
  eyebrow: L('Ketma-ket sonlar', 'Последовательные числа', 'Consecutive numbers'),
  setup: L(
    "Uch ketma-ket sonning yig'indisi 48. Eng KICHIK sonni x deb oldik.",
    'Сумма трёх последовательных чисел равна 48. Самое МАЛЕНЬКОЕ число обозначили x.',
    'The sum of three consecutive numbers is 48. The SMALLEST one is called x.'),
  ask: L('Qaysi tenglama shu shartga mos?', 'Какое уравнение соответствует условию?', 'Which equation matches?'),
  opts: [
    { label: ['x', '+', '(', 'x', '+', '1', ')', '+', '(', 'x', '+', '2', ')', '=', '48'] },
    { label: ['3x', '=', '48'] },
    { label: ['x', '+', '3', '=', '48'] },
  ],
  correct: 0,
  correctText: L(
    "To'g'ri. Ketma-ket sonlar birdan farq qiladi: x, x + 1, x + 2. Yig'indisi 3x + 3 = 48, bundan x = 15 va sonlar 15, 16, 17.",
    'Верно. Последовательные числа отличаются на единицу: x, x + 1, x + 2. Их сумма 3x + 3 = 48, отсюда x = 15, а числа 15, 16, 17.',
    'Correct. Consecutive numbers differ by one: x, x + 1, x + 2. Their sum is 3x + 3 = 48, so x = 15 and the numbers are 15, 16, 17.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "3x = 48 dan x = 16 chiqadi, lekin 16 bu O'RTADAGI son. Shartda esa x eng kichik son deb olingan, ya'ni bu tenglama boshqa belgilashga mos.",
      'Из 3x = 48 выходит x = 16, но 16 это СРЕДНЕЕ число. А по условию x — самое маленькое, значит это уравнение к другому обозначению.',
      '3x = 48 gives x = 16, but 16 is the MIDDLE number. Here x is the smallest, so that equation belongs to a different labelling.') },
    { when: (s) => s.picked === 2, text: L(
      "x + 3 = 48 da faqat BITTA son va uchlik bor. Uch sonning yig'indisi esa uchta hadni talab qiladi.",
      'В x + 3 = 48 только ОДНО число и тройка. А сумма трёх чисел требует трёх слагаемых.',
      'x + 3 = 48 has only ONE number and a three. The sum of three numbers needs three terms.') },
  ],
  wrongText: L(
    "Uch ketma-ket sonni yozing: x, x + 1, x + 2. Keyin ularni qo'shib 48 ga tenglashtiring.",
    'Запиши три последовательных числа: x, x + 1, x + 2. Потом сложи их и приравняй к 48.',
    'Write the three consecutive numbers: x, x + 1, x + 2. Then add them and set the sum to 48.'),
};

export default function D11_08(props) { return <Choice data={DATA} {...props} />; }
