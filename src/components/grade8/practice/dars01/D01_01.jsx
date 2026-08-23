// Dars01 * Amaliyot 01 -- Butun yoki kasr ifoda * 🟢 * tag: whole_or_fraction
// Faqat MA'LUMOT. Tip: kit.jsx -> Abcd (bitta to'g'ri, 4 variant).
// TASDIQ 1 + ADASHISH Z19 (songa bo'lish harfga bo'lish deb olinadi).
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Abcd, L } from '../kit.jsx';

const DATA = {
  tag: 'whole_or_fraction', level: '🟢',
  eyebrow: L('Butun yoki kasr', 'Целое или дробное', 'Integral or fractional'),
  ask: L('Qaysi yozuv KASR ifoda?', 'Какая запись ДРОБНОЕ выражение?', 'Which record is FRACTIONAL?'),
  opts: [
    { label: [{ n: '3m - 8', d: '4' }] },
    { label: [{ n: '12', d: 'm + 5' }] },
    { label: ['m'] },
    { label: [{ n: 'm · m', d: '7' }, ' - m'] },
  ],
  correct: 1,
  hints: {
    0: L(
      "Bu yerda chiziq ostida to'rt turadi -- SON. Bo'lish har doim bajariladi, ya'ni bu butun ifoda.",
      'Здесь под чертой стоит четыре -- ЧИСЛО. Деление выполняется всегда, значит это целое выражение.',
      'Here below the bar stands four -- a NUMBER. Division always works, so this is an integral expression.',
    ),
    2: L(
      "Bu yerda umuman bo'lish yo'q, faqat harfning o'zi turibdi.",
      'Здесь деления вообще нет, стоит просто буква.',
      'There is no division here at all, just the letter itself.',
    ),
    3: L(
      "Chiziq ostida yetti turadi -- SON. m · m chiziq USTIDA, ya'ni bu butun ifoda.",
      'Под чертой стоит семь -- ЧИСЛО. m · m стоит НАД чертой, значит это целое выражение.',
      'Below the bar stands seven -- a NUMBER. m times m is ABOVE the bar, so this is an integral expression.',
    ),
  },
  correctText: L(
    "To'g'ri. 12 ni (m + 5) ga bo'lish -- chiziq ostida HARF, ya'ni bu ratsional kasr. m = -5 bo'lsa bo'lish bajarilmaydi.",
    'Верно. 12 делится на (m + 5) -- под чертой БУКВА, значит это рациональная дробь. При m = -5 деление не выполняется.',
    'Correct. 12 divided by (m + 5) has a LETTER below the bar, so it is a rational fraction. At m = -5 the division fails.',
  ),
  wrongText: L(
    "Har yozuvda chiziq ostiga qarang: son bo'lsa -- butun, harf bo'lsa -- kasr.",
    'В каждой записи смотри под черту: число -- целое, буква -- дробное.',
    'In each record look below the bar: a number means integral, a letter means fractional.',
  ),
};

export default function D01_01(props) { return <Abcd data={DATA} {...props} />; }
