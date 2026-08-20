// Dars02 · Amaliyot 04 — Belgi qayerda yashiringan · 🟡 · tag: sign_places
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TapTerms.
//
// 7a − 4b + 12. Ko'paytirish belgisi IKKI joyda yashiringan: 7a va 4b.
// 12 da harf yo'q, ya'ni yashiringan belgi ham yo'q -- eng ko'p uchraydigan
// xato aynan shu: o'quvchi «hamma joyda» deb belgilaydi.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'sign_places', level: '🟡',
  eyebrow: L('Yashiringan belgi', 'Спрятанный знак', 'The hidden sign'),
  setup: L(
    "Ko'paytirish belgisi son bilan harf orasida yozilmaydi. Lekin u hamma joyda yashirinmagan.",
    'Знак умножения между числом и буквой не пишут. Но спрятан он не везде.',
    'The multiplication sign between a number and a letter is not written. But it is not hidden everywhere.'),
  ask: L("Ko'paytirish belgisi YASHIRINGAN hadlarni belgilang.", 'Отметь слагаемые, в которых СПРЯТАН знак умножения.', 'Mark the terms with a HIDDEN multiplication sign.'),
  note: L("Hadni bosib belgilanadi. Bir nechta bo'lishi mumkin.", 'Слагаемое отмечается нажатием. Их может быть несколько.', 'Tap a term to mark it. There can be several.'),
  parts: [
    { k: 'term', id: 't1', v: '7a' },
    { k: 'sign', v: '−' },
    { k: 'term', id: 't2', v: '4b' },
    { k: 'sign', v: '+' },
    { k: 'term', id: 't3', v: '12' },
  ],
  want: ['t1', 't2'],
  correctText: L(
    "To'g'ri. 7a bu 7 · a, 4b bu 4 · b. 12 da harf yo'q, u shunchaki son.",
    'Верно. 7a это 7 · a, 4b это 4 · b. В 12 буквы нет, это просто число.',
    'Correct. 7a is 7 · a, 4b is 4 · b. There is no letter in 12, it is just a number.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('t3') !== -1, text: L(
      "12 da harf yo'q. Yashiringan ko'paytirish faqat son va harf yonma-yon turganda paydo bo'ladi.",
      'В 12 нет буквы. Спрятанное умножение появляется только там, где число и буква стоят рядом.',
      'There is no letter in 12. A hidden multiplication appears only where a number and a letter stand together.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Bittasi belgilanmadi: harf oldida son turgan HAR joyda ko'paytirish yashiringan.",
      'Одно пропустил: умножение спрятано в КАЖДОМ месте, где перед буквой стоит число.',
      'One is missing: the multiplication is hidden in EVERY place where a number stands before a letter.') },
  ],
  wrongText: L(
    "Har hadga qarang: unda son va harf yonma-yon turibdimi? Agar turgan bo'lsa, ular ko'paytiriladi.",
    'Смотри на каждое слагаемое: стоят ли в нём число и буква рядом? Если стоят — они умножаются.',
    'Look at each term: do a number and a letter stand together in it? If they do, they are multiplied.'),
};

export default function D02_04(props) { return <TapTerms data={DATA} {...props} />; }
