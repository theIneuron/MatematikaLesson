// Dars01 · Amaliyot 02 — Butun yoki kasr ifoda · 🟢 · teg: whole_or_fraction
// Faqat MA'LUMOT. Tip: `practice/kit.jsx` -> Sort.
//
// TASDIQ 1: songa bo'linsa — butun ifoda, harfga bo'linsa — kasr ifoda.
// ADASHISH Z19: songa bo'lish harfli ifodaga bo'lish deb olinadi.
//
// Oltita yozuv, uchtasi u zonaga, uchtasi bu zonaga. Ataylab shunday
// tanlangan: uchta yozuvda ham harf CHIZIQ OSTIDA emas, faqat yonida —
// «harf bor, ya'ni kasr» degan yo'l shu yerda ishlamaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { Frac, L, Sort } from '../kit.jsx'

const DATA = {
  tag: 'whole_or_fraction',
  level: '🟢',
  eyebrow: L('Ikki zona', 'Две зоны', 'Two zones'),
  setup: L(
    "Yozuv chiziq ostiga nima tushganiga qarab ajraladi. Harfning yozuvda BO'LISHI hech narsani hal qilmaydi: muhimi — bo'linish nimaga ketgani.",
    'Запись делится по тому, что оказалось под чертой. Само НАЛИЧИЕ буквы ничего не решает: важно, на что идёт деление.',
    'A record is sorted by what ended up below the bar. The mere PRESENCE of a letter decides nothing: what matters is what the division is by.',
  ),
  zones: [
    { id: 'w', label: L('BUTUN IFODA', 'ЦЕЛОЕ ВЫРАЖЕНИЕ', 'INTEGRAL EXPRESSION') },
    { id: 'f', label: L('KASR IFODA', 'ДРОБНОЕ ВЫРАЖЕНИЕ', 'FRACTIONAL EXPRESSION') },
  ],
  items: [
    { id: 'a', zone: 'w', show: <Frac num="3m − 8" den="4" /> },
    { id: 'b', zone: 'f', show: <Frac num="12" den="m + 5" /> },
    { id: 'c', zone: 'w', show: <span><Frac num="m" den="9" /> + 4</span> },
    { id: 'd', zone: 'f', show: <Frac num="m + 1" den="m" /> },
    { id: 'e', zone: 'w', show: <span><Frac num="m · m" den="7" /> − m</span> },
    { id: 'g', zone: 'f', show: <Frac num="8" den="m · m" /> },
  ],
  ask: L('Yozuvni bosing, keyin zonani bosing.', 'Нажми запись, потом зону.', 'Tap a record, then a zone.'),
  wrongs: [
    {
      when: (s) => s.bad.indexOf('a') !== -1 || s.bad.indexOf('c') !== -1 || s.bad.indexOf('e') !== -1,
      text: L(
        "Uchta yozuvda harf CHIZIQ USTIDA turadi, ostida esa son: to'rt, to'qqiz, yetti. Son nolga aylanmaydi, ya'ni bunday ifoda butun.",
        'В трёх записях буква стоит НАД чертой, а под чертой число: четыре, девять, семь. Число в нуль не обращается — значит выражение целое.',
        'In three records the letter is ABOVE the bar and a number is below it: four, nine, seven. A number never becomes zero, so the expression is integral.',
      ),
    },
    {
      when: (s) => s.bad.indexOf('g') !== -1,
      text: L(
        "m · m ham harfli yozuv: chiziq ostida harf turgani uchun bu kasr ifoda. m nol bo'lsa maxraj nolga aylanadi.",
        'm · m — тоже буквенная запись: под чертой буква, значит выражение дробное. При m = 0 знаменатель обращается в нуль.',
        'm · m is a letter record too: a letter is below the bar, so the expression is fractional. At m = 0 the denominator becomes zero.',
      ),
    },
    {
      when: (s) => s.bad.indexOf('d') !== -1,
      text: L(
        "Oxirgi yozuvda surat ham, maxraj ham harfli. Ajratuvchi belgi — chiziq OSTI: unda m turgani uchun ifoda kasr.",
        'В этой записи и числитель, и знаменатель с буквой. Решает то, что стоит ПОД чертой: там m, значит выражение дробное.',
        'In that record both numerator and denominator hold a letter. What decides is below the bar: m is there, so the expression is fractional.',
      ),
    },
  ],
  wrongText: L(
    "Har yozuvda chiziq ostiga qaraysiz. Son turgan bo'lsa — butun ifoda, harf turgan bo'lsa — kasr ifoda.",
    'В каждой записи смотри под черту. Стоит число — целое выражение, стоит буква — дробное.',
    'In each record look below the bar. A number there means integral, a letter there means fractional.',
  ),
  correctText: L(
    "To'g'ri. Chiziq ostida son bo'lsa, bo'lish har doim bajariladi. Harf bo'lsa — bitta qiymatda maxraj nolga aylanishi mumkin, shuning uchun bunday ifoda alohida nom oladi: ratsional kasr.",
    'Верно. Если под чертой число, деление выполняется всегда. Если буква — при одном значении знаменатель может обратиться в нуль, поэтому такая запись получает отдельное имя: рациональная дробь.',
    'Correct. With a number below the bar the division always works. With a letter, at one value the denominator can become zero, so such a record gets its own name: a rational fraction.',
  ),
}

export default function D01_02(props) { return <Sort data={DATA} {...props} /> }
