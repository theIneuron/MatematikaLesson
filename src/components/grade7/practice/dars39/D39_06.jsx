// Dars39 · Amaliyot 06 — Nol birinchi o'rinda · 🟡 · fix · tag: comb_fix
// Mexanika: kit.jsx -> TapTerms. Raskladka: 6-o'rin `fix`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): manfiy va kasr koeffitsiyent,
// ikki qadamli savol, yaqin tuzoq -- PODXOD_7SINF.md 13-band.
// 0, 1, 2, 3 raqamlaridan takrorsiz ikki xonali son: birinchi o'rinda NOL bo'lmaydi, ya'ni 3 · 3 = 9, 4 · 3 = 12 emas.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'comb_fix',
  level: '🟡',
  eyebrow: L(
    'Xato qadam',
    'Неверный шаг',
    'The wrong step'),
  setup: L(
    "O'quvchi 0, 1, 2, 3 raqamlaridan takrorsiz ikki xonali son sanadi. Uch qadamdan biri noto'g'ri: nol birinchi o'rinda turolmaydi.",
    'Ученик считал двузначные числа без повторений из 0, 1, 2, 3. Один из трёх шагов неверный: ноль не может стоять первым.',
    'A pupil counted two-digit numbers from 0, 1, 2, 3 without repeats. One step is wrong: zero cannot lead.'),
  given: [['0, 1, 2, 3']],
  givenLabel: L(
    'Raqamlar:',
    'Цифры:',
    'Digits:'),
  ask: L(
    "NOTO'G'RI qadamni belgilang.",
    'Отметь НЕВЕРНЫЙ шаг.',
    'Mark the WRONG step.'),
  note: L(
    'Bitta qadam.',
    'Один шаг.',
    'One step.'),
  parts: [
    { k: 'term', id: 't1', v: "birinchi o'rin: 4 variant" },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't2', v: "ikkinchi o'rin: 3 variant" },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't3', v: 'jami 12' },
  ],
  want: ['t1'],
  correctText: L(
    "To'g'ri. Birinchi o'rinda nol turolmaydi, ya'ni 3 variant: 3 · 3 = 9.",
    'Верно. На первом месте ноль стоять не может, значит 3 варианта: 3 · 3 = 9.',
    'Correct. Zero cannot lead, so the first place has 3 options: 3 · 3 = 9.'),
  wrongs: [
    {
      when: (s) => s.extra.indexOf('t2') !== -1,
      text: L(
        "Ikkinchi o'rinda uch variant qoladi (bitta raqam ishlatilgan) -- bu qadam to'g'ri.",
        'На втором месте остаётся три варианта (одна цифра занята) — шаг верный.',
        'The second place keeps three options once one digit is used: right.'),
    },
    {
      when: (s) => s.extra.indexOf('t3') !== -1,
      text: L(
        '12 birinchi qadamdan chiqdi. Sabab birinchi qadamda.',
        '12 вытекает из первого шага. Причина в первом шаге.',
        '12 follows the first step, where the flaw sits.'),
    },
    {
      when: (s) => s.miss.length > 0,
      text: L(
        'Ikki xonali son nol bilan boshlanishi mumkinmi?',
        'Может ли двузначное число начинаться с нуля?',
        'Can a two-digit number start with zero?'),
    },
  ],
  wrongText: L(
    "Birinchi o'rinda qaysi raqam turolmaydi?",
    'Какая цифра не может стоять на первом месте?',
    'Which digit cannot lead?'),
};

export default function D39_06(props) { return <TapTerms data={DATA} {...props} />; }
