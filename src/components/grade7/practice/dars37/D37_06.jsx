// Dars37 · Amaliyot 06 — Kasr k bilan xato · 🟡 · fix · tag: prop_fix
// Mexanika: kit.jsx -> TapTerms. Raskladka: 6-o'rin `fix`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): manfiy va kasr koeffitsiyent,
// ikki qadamli savol, yaqin tuzoq -- PODXOD_7SINF.md 13-band.
// Chuqur yechim: y = 0,5x, x = −8 -> 0,5 · (−8) = −4. Xato javob 4: ishora tashlab ketilgan.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'prop_fix',
  level: '🟡',
  eyebrow: L(
    'Xato qadam',
    'Неверный шаг',
    'The wrong step'),
  setup: L(
    "Uch qadamdan biri noto'g'ri. Kasr koeffitsiyent manfiy songa ko'paytirilganda natija manfiy bo'ladi.",
    'Один из трёх шагов неверный. Дробный коэффициент, умноженный на отрицательное число, даёт отрицательный результат.',
    'One step is wrong. A fractional coefficient times a negative number gives a negative result.'),
  given: [['y = 0,5x', ',', 'x = −8']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  ask: L(
    "NOTO'G'RI qadamni belgilang.",
    'Отметь НЕВЕРНЫЙ шаг.',
    'Mark the WRONG step.'),
  note: L(
    'Bitta qadam.',
    'Один шаг.',
    'One step.'),
  parts: [
    { k: 'term', id: 't1', v: L("x = −8 qo'yiladi", 'подставляем x = −8', 'substitute x = −8') },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't2', v: '0,5 · (−8) = 4' },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't3', v: 'y = 4' },
  ],
  want: ['t2'],
  correctText: L(
    "To'g'ri. 0,5 · (−8) = −4: musbatni manfiyga ko'paytirsak manfiy chiqadi.",
    'Верно. 0,5 · (−8) = −4: положительное на отрицательное даёт отрицательное.',
    'Correct. 0.5 · (−8) = −4: positive times negative is negative.'),
  wrongs: [
    {
      when: (s) => s.extra.indexOf('t1') !== -1,
      text: L(
        "x = −8 shartda berilgan, uni qo'yish to'g'ri.",
        'x = −8 дано в условии, подстановка верна.',
        'x = −8 is given, so the substitution is right.'),
    },
    {
      when: (s) => s.extra.indexOf('t3') !== -1,
      text: L(
        'y = 4 ikkinchi qadamdan chiqdi. Sabab ikkinchi qadamda.',
        'y = 4 вытекает из второго шага. Причина во втором шаге.',
        'y = 4 follows the second step, where the flaw sits.'),
    },
    {
      when: (s) => s.miss.length > 0,
      text: L(
        "Ko'paytmaning ishorasini tekshiring.",
        'Проверь знак произведения.',
        'Check the sign of the product.'),
    },
  ],
  wrongText: L(
    "Kasr son ham ishorani o'zgartirmaydi: minus qoladi.",
    'Дробное число знак не отменяет: минус остаётся.',
    'A fraction does not cancel the sign: the minus stays.'),
};

export default function D37_06(props) { return <TapTerms data={DATA} {...props} />; }
