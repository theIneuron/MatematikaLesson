// Dars06 · Amaliyot 02 — Koeffitsiyentlar bilan ish · 🟢 · tag: collect_coef
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
//
// 8x − 5x + x. Uchta had ham o'xshash, ya'ni koeffitsiyentlar bilan ishlanadi:
// 8 − 5 + 1 = 4, javob 4x. Harf QOLADI -- u yo'qolmaydi.
// Xato variantlar: 4 (harfni tashlab ketgan), 2x (oxirgi x ni ayirgan),
// 14x (hamma koeffitsiyentni qo'shgan).
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'collect_coef', level: '🟢',
  eyebrow: L("O'xshashlarni yig'ish", 'Приведение подобных', 'Collecting like terms'),
  setup: L(
    "O'xshash hadlarda faqat koeffitsiyentlar qo'shiladi yoki ayiriladi, harf esa qoladi.",
    'У подобных слагаемых складываются и вычитаются только коэффициенты, буква остаётся.',
    'In like terms only the coefficients are added or subtracted; the letter stays.'),
  expr: ['8x', '−', '5x', '+', 'x'], exprSize: 30,
  ask: L('Yozuv qanday soddalashadi?', 'Как упрощается запись?', 'How does the record simplify?'),
  opts: [{ label: ['4x'] }, { label: ['2x'] }, { label: ['4'] }, { label: ['14x'] }],
  correct: 0, optCols: 2,
  correctText: L(
    "To'g'ri. Koeffitsiyentlar: 8 − 5 + 1 = 4. Oxirgi x ning koeffitsiyenti 1, u yozilmaydi lekin hisobga olinadi.",
    'Верно. Коэффициенты: 8 − 5 + 1 = 4. У последнего x коэффициент 1, его не пишут, но учитывают.',
    'Correct. The coefficients: 8 − 5 + 1 = 4. The last x has coefficient 1 — not written, but counted.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "2x chiqishi uchun oxirgi x ayirilgan. Uning oldida esa PLYUS turibdi: 8 − 5 + 1 = 4.",
      'Чтобы вышло 2x, последний x вычли. А перед ним стоит ПЛЮС: 8 − 5 + 1 = 4.',
      'To get 2x the last x was subtracted. But it has a PLUS before it: 8 − 5 + 1 = 4.') },
    { when: (s) => s.picked === 2, text: L(
      "Harf yo'qolib qoldi. Koeffitsiyentlar bilan ishlanadi, lekin natijada harf saqlanadi: 4x.",
      'Буква потерялась. Работаем с коэффициентами, но в ответе буква остаётся: 4x.',
      'The letter got lost. We work with the coefficients, but the answer keeps the letter: 4x.') },
    { when: (s) => s.picked === 3, text: L(
      "14x bu 8 + 5 + 1: ayirish qo'shishga aylanib ketgan. Ikkinchi hadning oldida minus turibdi.",
      '14x это 8 + 5 + 1: вычитание превратилось в сложение. Перед вторым слагаемым стоит минус.',
      '14x is 8 + 5 + 1: the subtraction turned into addition. The second term has a minus before it.') },
  ],
  wrongText: L(
    "Koeffitsiyentlarni ishorasi bilan hisoblang: 8 − 5 + 1. Harf o'zgarmaydi.",
    'Посчитай коэффициенты со знаками: 8 − 5 + 1. Буква не меняется.',
    'Work out the coefficients with their signs: 8 − 5 + 1. The letter does not change.'),
};

export default function D06_02(props) { return <Choice data={DATA} {...props} />; }
