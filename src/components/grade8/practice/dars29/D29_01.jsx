// Dars29 · Amaliyot 01 — Qiymati besh · 🟢 · tag: equals_five_marked
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §11 (29-dars, 1-pozitsiya)
//
// T1 NING TA'RIFI ISHDA. Uch to'g'ri yozuv uch xil ko'rinishda beshni
// beradi: modul ichida musbat son, manfiy son va AYIRMA.
//
// Uch tuzoq esa hammasi minus beshga teng, va ular ikki xil narsani
// ko'rsatadi:
//   −|5| va −|−5|  — modul belgisining OLDIDAGI minus modul ichiga kirmaydi;
//   |2| − |7|      — modullar AYIRMASI modul ichidagi ayirma bilan bir xil
//                    emas: |2 − 7| besh, |2| − |7| esa minus besh.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'equals_five_marked', level: '🟢',
  col: 138, itemSize: 18,
  items: [
    { id: 'i1', tokens: ['|−5|'], hit: true },
    { id: 'i2', tokens: ['−|5|'] },
    { id: 'i3', tokens: ['|5|'], hit: true },
    { id: 'i4', tokens: ['−|−5|'] },
    { id: 'i5', tokens: ['|2 − 7|'], hit: true },
    { id: 'i6', tokens: ['|2| − |7|'] },
  ],
  eyebrow: L('Qiymati besh', 'Значение пять', 'The value is five'),
  setup: L(
    "Sonning moduli — uning son o'qidagi noldan uzoqligi, ya'ni modul hech qachon manfiy bo'lmaydi. Oltita yozuvdan uchtasining qiymati beshga teng.",
    'Модуль числа — это его удалённость от нуля на числовой прямой, то есть модуль никогда не бывает отрицательным. Из шести записей три равны пяти.',
    'The absolute value of a number is its distance from zero on the number line, so it is never negative. Of six records, three equal five.'),
  ask: L(
    "Qiymati 5 ga teng bo'lgan 3 ta yozuvni belgilang.",
    'Отметь 3 записи, значение которых равно 5.',
    'Mark the 3 records whose value is 5.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Modul ichida nima tursa ham, natija noldan uzoqlik bo'ladi. Rad etilgan uchtasi esa minus beshga teng: ikkitasida minus modulning OLDIDA turibdi, uchinchisida modullar ayirmasi hisoblangan.",
    'Верно. Что бы ни стояло внутри модуля, результат — удалённость от нуля. А три отброшенные равны минус пяти: в двух минус стоит ПЕРЕД модулем, в третьей вычислена разность модулей.',
    'Correct. Whatever stands inside the bars, the result is a distance from zero. The three rejected ones equal minus five: in two the minus stands BEFORE the bars, in the third a difference of absolute values was computed.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('i6') !== -1, text: L(
      "Bu yerda MODULLARNING ayirmasi turibdi, modul ichidagi ayirma emas. Har sonning moduli alohida olinadi: ikkiniki ikki, yettiniki yetti, va ular ayiriladi — ikki minus yetti minus besh. Modul ichidagi ayirma esa boshqa: ikki minus yetti minus besh, uning moduli besh. Belgilar qayerda turishi natijani almashtiradi.",
      'Здесь стоит разность МОДУЛЕЙ, а не разность внутри модуля. Модуль каждого числа берётся отдельно: у двух два, у семи семь, и они вычитаются — два минус семь минус пять. А разность внутри модуля другая: два минус семь минус пять, и её модуль пять. Где стоят знаки, то и решает результат.',
      'Here stands a difference OF absolute values, not a difference inside one. Each number takes its absolute value separately: two gives two, seven gives seven, and they subtract — two minus seven is minus five. The difference inside is different: two minus seven is minus five, whose absolute value is five. Where the signs stand decides the result.') },
    { when: (s) => s.extra.indexOf('i2') !== -1 || s.extra.indexOf('i4') !== -1, text: L(
      "Bu yozuvda minus modulning OLDIDA turibdi, ichida emas. Tartib shunday: avval modul hisoblanadi — beshning moduli besh, minus beshning moduli ham besh, — keyin oldidagi minus qo'llanadi va natija minus besh bo'ladi. Modul ichidagi minus esa yo'qoladi, tashqaridagisi qoladi.",
      'В этой записи минус стоит ПЕРЕД модулем, а не внутри. Порядок такой: сначала вычисляется модуль — у пяти пять, у минус пяти тоже пять, — а потом применяется стоящий перед ним минус, и результат становится минус пять. Минус внутри модуля исчезает, а снаружи остаётся.',
      'In this record the minus stands BEFORE the absolute value, not inside it. The order is: first the absolute value is computed — five gives five, minus five gives five — and then the minus in front is applied, making the result minus five. A minus inside the bars disappears; one outside stays.') },
    { when: (s) => s.miss.indexOf('i5') !== -1, text: L(
      "Bu yozuv chetlab o'tildi, lekin uning qiymati BESH. Avval modul ichini hisoblang: ikki minus yetti minus besh. Endi modul oling: minus beshning noldan uzoqligi besh. Modul ichida manfiy son chiqishi normal — modul aynan shuning uchun bor.",
      'Эта запись осталась в стороне, а её значение ПЯТЬ. Сначала вычисли то, что внутри: два минус семь минус пять. Теперь возьми модуль: удалённость минус пяти от нуля равна пяти. То, что внутри модуля выходит отрицательное число, нормально — модуль для этого и нужен.',
      'This record was left out, yet its value is FIVE. First compute what is inside: two minus seven is minus five. Now take the absolute value: the distance of minus five from zero is five. Getting a negative number inside is normal — that is exactly what the absolute value is for.') },
    { when: (s) => s.marked.length !== 3, text: L(
      "Aynan uchta yozuv kerak. Har biri bilan bir xil ish qiling: avval modul ICHINI hisoblang, keyin modul oling, va faqat oxirida oldidagi belgini qo'llang.",
      'Нужно ровно три записи. С каждой делай одно и то же: сначала вычисли то, что ВНУТРИ модуля, потом возьми модуль, и только в конце применяй знак перед ним.',
      'Exactly three records are needed. Do the same with each: first compute what is INSIDE, then take the absolute value, and only at the end apply the sign in front.') },
  ],
  wrongText: L(
    "Tartibga qarang: avval modul ichi hisoblanadi, keyin modul olinadi, oxirida esa oldidagi belgi qo'llanadi. Modul ichidagi minus yo'qoladi, tashqaridagisi qoladi.",
    'Смотри на порядок: сначала вычисляется то, что внутри модуля, потом берётся модуль, и в конце применяется знак перед ним. Минус внутри исчезает, снаружи остаётся.',
    'Watch the order: first what is inside is computed, then the absolute value is taken, and at the end the sign in front is applied. A minus inside disappears, one outside stays.'),
};

export default function D29_01(props) { return <MarkAll data={DATA} {...props} />; }
