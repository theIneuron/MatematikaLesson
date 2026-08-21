// Dars06 · Amaliyot 08 — Soddalashmaydigan yozuvlar · 🔴 · tag: cannot_simplify
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
//
// Bu topshiriq TESKARI tomondan tekshiradi: o'quvchi qaysi yozuvni
// soddalashtirib BO'LMASLIGINI aniqlashi kerak. Eng ko'p uchraydigan xato
// aynan shu: har qanday ikki hadni qo'shib «soddalashtirish».
//   3a + 5b  -- harflar boshqa           soddalashmaydi   HA
//   2x − 7   -- biri harfli, biri son    soddalashmaydi   HA
//   4m + 4   -- koeffitsiyent bir xil, lekin ikkinchisida harf yo'q   HA
//   3a + 5a  -- o'xshash                 8a               yo'q
//   9k − 2k  -- o'xshash                 7k               yo'q
//   6p + p   -- o'xshash                 7p               yo'q
// 4m + 4 ATAYLAB turadi: sonlar bir xil bo'lgani uchun uni «4m + 4 = 8m»
// deb yozib yuborish oson.
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'cannot_simplify', level: '🔴', col: 165, itemSize: 22,
  eyebrow: L("Soddalashmaydiganlar", 'Что не упрощается', 'What does not simplify'),
  setup: L(
    "Hamma yozuv soddalashmaydi. Hadlar o'xshash bo'lmasa, ular yonma-yon qoladi -- va bu ham javob.",
    'Не всякая запись упрощается. Если слагаемые не подобны, они остаются рядом — и это тоже ответ.',
    'Not every record simplifies. If the terms are not alike they stay side by side — and that is an answer too.'),
  ask: L('Soddalashtirib BO\'LMAYDIGAN hamma yozuvni belgilang.', 'Отметь все записи, которые упростить НЕЛЬЗЯ.', 'Mark every record that CANNOT be simplified.'),
  note: L("Bir nechta bo'lishi mumkin.", 'Их может быть несколько.', 'There can be several.'),
  items: [
    { id: 'p1', tokens: ['3a', '+', '5b'], hit: true },
    { id: 'n1', tokens: ['3a', '+', '5a'], hit: false },
    { id: 'p2', tokens: ['2x', '−', '7'], hit: true },
    { id: 'n2', tokens: ['9k', '−', '2k'], hit: false },
    { id: 'p3', tokens: ['4m', '+', '4'], hit: true },
    { id: 'n3', tokens: ['6p', '+', 'p'], hit: false },
  ],
  correctText: L(
    "To'g'ri. Harflari boshqa bo'lsa yoki biri harfsiz bo'lsa, hadlar o'xshash emas -- yozuv o'sha holda qoladi.",
    'Верно. Если буквы разные или у одного слагаемого буквы нет, слагаемые не подобны — запись остаётся как есть.',
    'Correct. Different letters, or one term without a letter, mean the terms are not alike — the record stays as it is.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('n3') !== -1, text: L(
      "6p + p soddalashadi: oxirgi p ning koeffitsiyenti 1, ya'ni 6 + 1 = 7, javob 7p.",
      '6p + p упрощается: у последнего p коэффициент 1, значит 6 + 1 = 7, ответ 7p.',
      '6p + p does simplify: the last p has coefficient 1, so 6 + 1 = 7, the answer is 7p.') },
    { when: (s) => s.extra.indexOf('n1') !== -1 || s.extra.indexOf('n2') !== -1, text: L(
      "Belgilanganlar orasida harflari BIR XIL bo'lgan yozuv bor. Bunday hadlar o'xshash va ular yig'iladi.",
      'Среди отмеченных есть запись, где буквы ОДИНАКОВЫ. Такие слагаемые подобны и они собираются.',
      'Among the marked ones there is a record with the SAME letters. Such terms are alike and they do collect.') },
    { when: (s) => s.miss.indexOf('p3') !== -1, text: L(
      "4m + 4 ni tekshirmadingiz: sonlar bir xil, lekin ikkinchi hadda harf YO'Q. Ular o'xshash emas.",
      'Ты не проверил 4m + 4: числа одинаковые, но у второго слагаемого буквы НЕТ. Они не подобны.',
      'You did not check 4m + 4: the numbers match, but the second term has NO letter. They are not alike.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Bittasi belgilanmadi: harfli qismlar mos kelmasa, hadlarni qo'shib bo'lmaydi.",
      'Одну пропустил: если буквенные части не совпадают, слагаемые сложить нельзя.',
      'One is missing: if the letter parts do not match, the terms cannot be added.') },
  ],
  wrongText: L(
    "Har yozuvdagi ikki hadning HARFINI solishtiring. Harflar bir xil bo'lsa -- yig'iladi, boshqa bo'lsa -- yo'q.",
    'Сравни БУКВЫ у двух слагаемых в каждой записи. Совпали — собираются, разные — нет.',
    'Compare the LETTERS of the two terms in each record. Matching letters collect, different ones do not.'),
};

export default function D06_08(props) { return <MarkAll data={DATA} {...props} />; }
