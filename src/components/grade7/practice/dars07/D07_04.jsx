// Dars07 · Amaliyot 04 — Tekshirish qatorini yig'ish · 🟡 · tag: build_check_line
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> BuildLine (answerSeq).
//
// 5x + 3 tenglamaning chap tomoni, tekshirilayotgan son x = −2.
// To'g'ri qator: 5 · (−2) + 3.
// QAVS shart: qavssiz «5 · −2» yozilsa ikki belgi yonma-yon tushadi.
// Hamma karta ishlatiladi, tekshiruv KETMA-KETLIK bo'yicha.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const CARDS = [
  { id: 'n5', label: '5' },
  { id: 'mul', label: '·' },
  { id: 'op', label: '(' },
  { id: 'nm2', label: '−2' },
  { id: 'cl', label: ')' },
  { id: 'plus', label: '+' },
  { id: 'n3', label: '3' },
];

const DATA = {
  tag: 'build_check_line', level: '🟡', useAll: true,
  answerSeq: ['n5', 'mul', 'op', 'nm2', 'cl', 'plus', 'n3'],
  cards: CARDS,
  eyebrow: L('Tekshirish qatori', 'Строка проверки', 'The check line'),
  setup: L(
    "5x + 3 = −7 tenglamasini tekshiramiz. x = −2 ni chap tomonga qo'yish kerak, lekin avval QATORNI to'g'ri yozish lozim.",
    'Проверяем уравнение 5x + 3 = −7. Нужно подставить x = −2 в левую часть, но сначала правильно записать СТРОКУ.',
    'We are checking the equation 5x + 3 = −7. The x = −2 goes into the left side, but first the LINE must be written correctly.'),
  given: [['x', '=', '−2']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  empty: L("Kartalarni bosib qator yig'ing", 'Собери строку, нажимая карточки', 'Build the line by tapping cards'),
  ask: L("Chap tomonning tekshirish qatorini yig'ing. Kursorni ko'chirish uchun yozuvdagi belgini bosing.",
    'Собери строку проверки для левой части. Чтобы передвинуть курсор, нажми знак в записи.',
    'Build the check line for the left side. To move the cursor, tap a sign in the record.'),
  undo: L('Bitta orqaga', 'Шаг назад', 'One back'),
  valueLabel: L('Qiymat:', 'Значение:', 'Value:'),
  correctText: L(
    "To'g'ri. 5x bu 5 · x, x o'rniga −2 qo'yiladi va qavsga olinadi: 5 · (−2) + 3. Bu −10 + 3 = −7, ya'ni x = −2 ildiz.",
    'Верно. 5x это 5 · x, вместо x ставится −2 в скобках: 5 · (−2) + 3. Это −10 + 3 = −7, значит x = −2 корень.',
    'Correct. 5x is 5 · x, and −2 in brackets replaces x: 5 · (−2) + 3. That is −10 + 3 = −7, so x = −2 is a root.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('op') > s.seq.indexOf('nm2'), text: L(
      "Qavs manfiy sondan OLDIN ochiladi va undan keyin yopiladi: 5 · (−2).",
      'Скобка открывается ПЕРЕД отрицательным числом и закрывается после него: 5 · (−2).',
      'The bracket opens BEFORE the negative number and closes after it: 5 · (−2).') },
    { when: (s) => s.seq[0] !== 'n5', text: L(
      "Qator 5 dan boshlanadi: 5x bu 5 · x, ya'ni avval koeffitsiyent turadi.",
      'Строка начинается с 5: 5x это 5 · x, то есть сначала коэффициент.',
      'The line starts with 5: 5x is 5 · x, so the coefficient comes first.') },
    { when: (s) => s.seq.indexOf('plus') < s.seq.indexOf('cl'), text: L(
      "3 ni qavsning ICHIGA olib kirmang: u qavsdan tashqarida qo'shiladi.",
      'Не заводи 3 ВНУТРЬ скобки: она прибавляется вне скобки.',
      'Do not pull the 3 INSIDE the bracket: it is added outside it.') },
  ],
  wrongText: L(
    "5x ni 5 · x deb yozing, x o'rniga qavs ichida −2 qo'ying, keyin 3 ni qo'shing.",
    'Запиши 5x как 5 · x, вместо x поставь −2 в скобках, потом прибавь 3.',
    'Write 5x as 5 · x, put −2 in brackets in place of x, then add 3.'),
};

export default function D07_04(props) { return <BuildLine data={DATA} {...props} />; }
