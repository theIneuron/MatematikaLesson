// Dars06 · Amaliyot 02 — Koeffitsiyentlar bilan ish · 🟢 · tag: collect_coef
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
//
// DARAJA KO'TARILDI (PODXOD_7SINF.md §13): koeffitsiyentlar uch xonali,
// hisob esa og'zaki qoladi: 120 − 45 = 75, keyin bir.
//
// 120x − 45x + x. Uchta had ham o'xshash, ya'ni koeffitsiyentlar bilan
// ishlanadi: 120 − 45 + 1 = 76, javob 76x. Harf QOLADI -- u yo'qolmaydi.
// Xato variantlar: 76 (harfni tashlab ketgan), 74x (oxirgi x ni ayirgan),
// 166x (hamma koeffitsiyentni qo'shgan).
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'collect_coef', level: '🟢',
  eyebrow: L("O'xshashlarni yig'ish", 'Приведение подобных', 'Collecting like terms'),
  setup: L(
    "O'xshash hadlarda faqat koeffitsiyentlar qo'shiladi yoki ayiriladi, harf esa qoladi.",
    'У подобных слагаемых складываются и вычитаются только коэффициенты, буква остаётся.',
    'In like terms only the coefficients are added or subtracted; the letter stays.'),
  expr: ['120x', '−', '45x', '+', 'x'], exprSize: 30,
  ask: L('Yozuv qanday soddalashadi?', 'Как упрощается запись?', 'How does the record simplify?'),
  opts: [{ label: ['76x'] }, { label: ['74x'] }, { label: ['76'] }, { label: ['166x'] }],
  correct: 0, optCols: 2,
  correctText: L(
    "To'g'ri. Koeffitsiyentlar: 120 − 45 + 1 = 76. Oxirgi x ning koeffitsiyenti 1, u yozilmaydi lekin hisobga olinadi.",
    'Верно. Коэффициенты: 120 − 45 + 1 = 76. У последнего x коэффициент 1, его не пишут, но учитывают.',
    'Correct. The coefficients: 120 − 45 + 1 = 76. The last x has coefficient 1 — not written, but counted.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "74x chiqishi uchun oxirgi x ayirilgan. Uning oldida esa PLYUS turibdi: 120 − 45 + 1 = 76.",
      'Чтобы вышло 74x, последний x вычли. А перед ним стоит ПЛЮС: 120 − 45 + 1 = 76.',
      'To get 74x the last x was subtracted. But it has a PLUS before it: 120 − 45 + 1 = 76.') },
    { when: (s) => s.picked === 2, text: L(
      "Harf yo'qolib qoldi. Koeffitsiyentlar bilan ishlanadi, lekin natijada harf saqlanadi: 76x.",
      'Буква потерялась. Работаем с коэффициентами, но в ответе буква остаётся: 76x.',
      'The letter got lost. We work with the coefficients, but the answer keeps the letter: 76x.') },
    { when: (s) => s.picked === 3, text: L(
      "166x bu 120 + 45 + 1: ayirish qo'shishga aylanib ketgan. Ikkinchi hadning oldida minus turibdi.",
      '166x это 120 + 45 + 1: вычитание превратилось в сложение. Перед вторым слагаемым стоит минус.',
      '166x is 120 + 45 + 1: the subtraction turned into addition. The second term has a minus before it.') },
  ],
  wrongText: L(
    "Koeffitsiyentlarni ishorasi bilan hisoblang: 120 − 45 + 1. Harf o'zgarmaydi.",
    'Посчитай коэффициенты со знаками: 120 − 45 + 1. Буква не меняется.',
    'Work out the coefficients with their signs: 120 − 45 + 1. The letter does not change.'),
};

export default function D06_02(props) { return <Choice data={DATA} {...props} />; }
