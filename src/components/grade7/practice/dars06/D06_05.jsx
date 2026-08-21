// Dars06 · Amaliyot 05 — Sonni koeffitsiyentga qo'shib qo'ygan · 🟡 · tag: fix_mixed_group
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> BuildLine (answerSeq).
//
// Chet yechim: 7c + 4 − 2c = 11c − 2c. O'quvchi 4 ni koeffitsiyentga qo'shib
// yuborgan: harfsiz son harfli hadga qo'shilmaydi.
// To'g'ri qadam -- hadlarni ishorasi bilan guruhlash: 7c − 2c + 4.
// Harf borligi uchun tekshiruv KETMA-KETLIK bo'yicha ketadi.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const CARDS = [
  { id: 'c7', label: '7c' },
  { id: 'minus', label: '−' },
  { id: 'c2', label: '2c' },
  { id: 'plus', label: '+' },
  { id: 'n4', label: '4' },
];

const DATA = {
  tag: 'fix_mixed_group', level: '🟡', useAll: true,
  answerSeq: ['c7', 'minus', 'c2', 'plus', 'n4'],
  cards: CARDS,
  eyebrow: L('Xatoni tuzatish', 'Исправь ошибку', 'Fix the mistake'),
  setup: L(
    "Boshqa o'quvchi 7c + 4 − 2c ni soddalashtirmoqchi bo'ldi va shunday yozdi: 11c − 2c. Bu qator xato.",
    'Другой ученик решил упростить 7c + 4 − 2c и написал так: 11c − 2c. Эта строка неверна.',
    'Another student set out to simplify 7c + 4 − 2c and wrote: 11c − 2c. That line is wrong.'),
  empty: L("Kartalarni bosib qator yig'ing", 'Собери строку, нажимая карточки', 'Build the line by tapping cards'),
  ask: L("O'xshash hadlarni yonma-yon qo'yib, to'g'ri qatorni yig'ing.",
    'Поставь подобные слагаемые рядом и собери верную строку.',
    'Put the like terms next to each other and build the correct line.'),
  undo: L('Bitta orqaga', 'Шаг назад', 'One back'),
  valueLabel: L('Qiymat:', 'Значение:', 'Value:'),
  correctText: L(
    "To'g'ri. 4 da harf yo'q, u 7c ga qo'shilmaydi. O'xshashlarni yonma-yon qo'yamiz: 7c − 2c + 4, ya'ni 5c + 4.",
    'Верно. У 4 нет буквы, к 7c её не прибавить. Ставим подобные рядом: 7c − 2c + 4, то есть 5c + 4.',
    'Correct. The 4 has no letter, it cannot join 7c. We put the like terms together: 7c − 2c + 4, that is 5c + 4.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('n4') < s.seq.indexOf('c2'), text: L(
      "4 ni harfli hadlar ORASIDA qoldirmang: o'xshashlar yonma-yon turishi kerak, 7c − 2c, keyin 4.",
      'Не оставляй 4 МЕЖДУ буквенными слагаемыми: подобные должны стоять рядом — 7c − 2c, а потом 4.',
      'Do not leave the 4 BETWEEN the letter terms: like terms belong together — 7c − 2c, then 4.') },
    { when: (s) => s.seq.indexOf('minus') > s.seq.indexOf('c2'), text: L(
      "2c ning ishorasi minus edi, ya'ni minus uning OLDIDA turishi kerak.",
      'У 2c был знак минус, значит минус должен стоять ПЕРЕД ним.',
      'The 2c had a minus sign, so the minus goes BEFORE it.') },
  ],
  wrongText: L(
    "Hadlarni o'z ishorasi bilan ko'chiring: 7c va −2c o'xshash, 4 esa alohida turadi.",
    'Переноси слагаемые вместе со знаком: 7c и −2c подобны, а 4 стоит отдельно.',
    'Move each term with its sign: 7c and −2c are alike, the 4 stands apart.'),
};

export default function D06_05(props) { return <BuildLine data={DATA} {...props} />; }
