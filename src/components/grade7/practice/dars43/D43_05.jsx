// Dars43 · Amaliyot 05 — Xato xulosa · 🟡 · fix · tag: iso_fix
// Mexanika: kit.jsx -> TapTerms. Raskladka: 5-o'rin `fix`.
// Xato xulosa: asos har doim yon tomondan kichik. 6, 6, 10 da asos KATTA.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'iso_fix',
  level: '🟡',
  eyebrow: L(
    'Xato xulosa',
    'Неверный вывод',
    'The wrong claim'),
  setup: L(
    "Uch xulosadan biri noto'g'ri. Teng yonli uchburchakda asos yon tomondan katta ham, kichik ham bo'lishi mumkin.",
    'Один из трёх выводов неверный. В равнобедренном треугольнике основание может быть и больше, и меньше боковой.',
    'One of the three claims is wrong. The base of an isosceles triangle may be larger or smaller than the leg.'),
  ask: L(
    "NOTO'G'RI xulosani belgilang.",
    'Отметь НЕВЕРНЫЙ вывод.',
    'Mark the WRONG claim.'),
  note: L(
    'Bitta xulosa.',
    'Один вывод.',
    'One claim.'),
  parts: [
    { k: 'term', id: 't1', v: 'asosdagi burchaklar teng' },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't2', v: 'asos yon tomondan kichik' },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't3', v: 'yon tomonlar teng' },
  ],
  want: ['t2'],
  correctText: L(
    "To'g'ri. 6, 6 va 10 tomonli uchburchak teng yonli, lekin asosi yon tomondan KATTA.",
    'Верно. Треугольник со сторонами 6, 6 и 10 равнобедренный, но основание БОЛЬШЕ боковой.',
    'Correct. A 6, 6, 10 triangle is isosceles, yet its base is LARGER than the leg.'),
  wrongs: [
    {
      when: (s) => s.extra.indexOf('t1') !== -1,
      text: L(
        'Asosdagi burchaklarning tengligi -- teng yonli uchburchakning asosiy xossasi.',
        'Равенство углов при основании это главное свойство равнобедренного.',
        'Equal base angles are the main property of an isosceles triangle.'),
    },
    {
      when: (s) => s.extra.indexOf('t3') !== -1,
      text: L(
        "Yon tomonlarning tengligi -- teng yonlilikning ta'rifi.",
        'Равенство боковых сторон это определение равнобедренности.',
        'Equal legs are the definition of isosceles.'),
    },
    {
      when: (s) => s.miss.length > 0,
      text: L(
        'Bitta xulosa asos va yon tomonni solishtiradi. Shunday cheklov bormi?',
        'Один из выводов сравнивает основание и боковую. Есть ли такое ограничение?',
        'One claim compares base and leg. Does such a limit exist?'),
    },
  ],
  wrongText: L(
    '6, 6, 10 uchburchagini tasavvur qiling: u teng yonlimi, asosi qanday?',
    'Представь треугольник 6, 6, 10: он равнобедренный, а каково основание?',
    'Picture a 6, 6, 10 triangle: is it isosceles, and how big is the base?'),
};

export default function D43_05(props) { return <TapTerms data={DATA} {...props} />; }
