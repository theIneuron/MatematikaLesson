// Dars02 · Amaliyot 06 — Qo'yish qatorini tuzatish · 🟡 · tag: fix_substitution
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> BuildLine (answerSeq).
//
// 4x + 10, x = −3. Chet qator: 4 · 3 + 10 -- ishora yo'qolgan.
// To'g'ri qator: 4 · (−3) + 10.
// QAVS shart emas deb o'ylash mumkin, lekin qavssiz «· −3» yozilsa ikki
// belgi yonma-yon tushadi. Shuning uchun kartalar orasida qavs bor va
// hammasi ishlatiladi: javob KETMA-KETLIK bo'yicha tekshiriladi.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const CARDS = [
  { id: 'c4', label: '4' },
  { id: 'mul', label: '·' },
  { id: 'op', label: '(' },
  { id: 'nm3', label: '−3' },
  { id: 'cl', label: ')' },
  { id: 'plus', label: '+' },
  { id: 'c10', label: '10' },
];

const DATA = {
  tag: 'fix_substitution', level: '🟡', useAll: true,
  answerSeq: ['c4', 'mul', 'op', 'nm3', 'cl', 'plus', 'c10'],
  cards: CARDS,
  eyebrow: L('Xatoni tuzatish', 'Исправь ошибку', 'Fix the mistake'),
  setup: L(
    "Boshqa o'quvchi 4x + 10 ga x = −3 ni qo'ydi va shunday yozdi: 4 · 3 + 10. Bu qator xato.",
    'Другой ученик подставил x = −3 в 4x + 10 и написал так: 4 · 3 + 10. Эта строка неверна.',
    'Another student put x = −3 into 4x + 10 and wrote: 4 · 3 + 10. That line is wrong.'),
  given: [['x', '=', '−3']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  empty: L("Kartalarni bosib qator yig'ing", 'Собери строку, нажимая карточки', 'Build the line by tapping cards'),
  ask: L("To'g'ri qatorni kartalardan yig'ing. Kursorni ko'chirish uchun yozuvdagi belgini bosing.",
    'Собери верную строку из карточек. Чтобы передвинуть курсор, нажми знак в записи.',
    'Build the correct line from the cards. To move the cursor, tap a sign in the record.'),
  undo: L('Bitta orqaga', 'Шаг назад', 'One back'),
  valueLabel: L('Qiymat:', 'Значение:', 'Value:'),
  correctText: L(
    "To'g'ri. Manfiy son qavs ichida turadi, aks holda ko'paytirish belgisi bilan minus yonma-yon tushadi. Qiymati: −12 + 10 = −2.",
    'Верно. Отрицательное число ставится в скобки, иначе знак умножения и минус окажутся рядом. Значение: −12 + 10 = −2.',
    'Correct. A negative number goes in brackets, otherwise the multiplication sign and the minus end up side by side. Value: −12 + 10 = −2.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('op') > s.seq.indexOf('nm3'), text: L(
      "Qavs minus uchdan OLDIN ochiladi va undan keyin yopiladi: 4 · (−3).",
      'Скобка открывается ПЕРЕД минус тремя и закрывается после неё: 4 · (−3).',
      'The bracket opens BEFORE minus three and closes after it: 4 · (−3).') },
    { when: (s) => s.seq[0] !== 'c4', text: L(
      "Qator 4 dan boshlanadi: 4x bu 4 · x, ya'ni avval koeffitsiyent.",
      'Строка начинается с 4: 4x это 4 · x, то есть сначала коэффициент.',
      'The line starts with 4: 4x is 4 · x, so the coefficient comes first.') },
  ],
  wrongText: L(
    "Yozuvni qatorga aylantiring: 4x bu 4 · x, x o'rniga minus uch qo'yiladi va qavsga olinadi, keyin 10 qo'shiladi.",
    'Перепиши запись в строку: 4x это 4 · x, вместо x ставится минус три в скобках, потом прибавляется 10.',
    'Rewrite the record as a line: 4x is 4 · x, minus three in brackets replaces x, then 10 is added.'),
};

export default function D02_06(props) { return <BuildLine data={DATA} {...props} />; }
