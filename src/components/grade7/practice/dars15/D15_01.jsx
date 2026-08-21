// Dars15 · Amaliyot 01 — Bu bir hadmi · 🟢 · tag: is_monomial
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
//
// Bir had -- son va harflarning KO'PAYTMASI. Qo'shish, ayirish yoki harfga
// bo'lish bo'lsa, bu bir had emas.
//   5x²  HA      3ab  HA      7  HA (son ham bir had)
//   x + 2 yo'q   x − y yo'q   2x : y yo'q
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'is_monomial', level: '🟢', col: 130, itemSize: 23,
  eyebrow: L('Bir had', 'Одночлен', 'A monomial'),
  setup: L(
    "Bir had -- son va harflarning ko'paytmasi. Unda qo'shish ham, ayirish ham, harfga bo'lish ham bo'lmaydi.",
    'Одночлен — это произведение числа и букв. В нём нет ни сложения, ни вычитания, ни деления на букву.',
    'A monomial is a product of a number and letters. It has no addition, no subtraction and no division by a letter.'),
  ask: L('Bir had bo\'lgan hamma yozuvni belgilang.', 'Отметь все записи, которые являются одночленами.', 'Mark every record that is a monomial.'),
  note: L("Bir nechta bo'lishi mumkin.", 'Их может быть несколько.', 'There can be several.'),
  items: [
    { id: 'p1', tokens: ['5x²'], hit: true },
    { id: 'n1', tokens: ['x', '+', '2'], hit: false },
    { id: 'p2', tokens: ['3ab'], hit: true },
    { id: 'n2', tokens: ['x', '−', 'y'], hit: false },
    { id: 'p3', tokens: ['7'], hit: true },
    { id: 'n3', tokens: ['2x', ':', 'y'], hit: false },
  ],
  correctText: L(
    "To'g'ri. 5x² va 3ab -- son va harflarning ko'paytmasi. 7 ham bir had: unda harf yo'q, lekin ko'paytma buzilmagan.",
    'Верно. 5x² и 3ab — произведение числа и букв. И 7 тоже одночлен: буквы нет, но произведение не нарушено.',
    'Correct. 5x² and 3ab are products of a number and letters. And 7 is a monomial too: no letter, but the product form holds.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('n1') !== -1 || s.extra.indexOf('n2') !== -1, text: L(
      "Belgilanganlar orasida QO'SHISH yoki AYIRISH bor. Bir hadda faqat ko'paytirish bo'ladi.",
      'Среди отмеченных есть СЛОЖЕНИЕ или ВЫЧИТАНИЕ. В одночлене бывает только умножение.',
      'Among the marked ones there is an ADDITION or a SUBTRACTION. A monomial has multiplication only.') },
    { when: (s) => s.extra.indexOf('n3') !== -1, text: L(
      "2x : y da HARFGA bo'lish bor. Bir hadda harf bo'luvchi bo'lolmaydi.",
      'В 2x : y есть деление НА БУКВУ. В одночлене буква не может быть делителем.',
      'In 2x : y there is a division BY A LETTER. In a monomial a letter cannot be a divisor.') },
    { when: (s) => s.miss.indexOf('p3') !== -1, text: L(
      "7 ni tekshirmadingiz: alohida son ham bir had hisoblanadi, uning harfli qismi yo'q.",
      'Ты не проверил 7: отдельное число тоже одночлен, просто без буквенной части.',
      'You did not check 7: a lone number is a monomial too, just without a letter part.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Bittasi belgilanmadi: yozuvda faqat ko'paytirish bo'lsa, u bir had.",
      'Одну пропустил: если в записи только умножение, это одночлен.',
      'One is missing: if a record has multiplication only, it is a monomial.') },
  ],
  wrongText: L(
    "Har yozuvdagi amallarga qarang: qo'shish, ayirish yoki harfga bo'lish bormi?",
    'Смотри на действия в каждой записи: есть ли сложение, вычитание или деление на букву?',
    'Look at the operations in each record: is there an addition, a subtraction or a division by a letter?'),
};

export default function D15_01(props) { return <MarkAll data={DATA} {...props} />; }
