// Dars16 · Amaliyot 08 — Guruhlar · 🔴 · tag: two_roots_or_none
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §4 (16-dars, 8-pozitsiya)
//
// З41 SAKKIZ KARTADA. Kartalar juft-juft: `m² − 16` va `m² + 16`, `m² + 1` va
// `2m² = 50`, ya'ni ishora hamma narsani hal qiladi. Uchta karta esa qo'shimcha
// qadam talab qiladi: `3m² − 27` va `4m² + 9` da koeffitsiyentdan xalos bo'lish,
// `m² = −25` da o'ng tomonni o'qish.
//
// OLDINGI BLOKDAN (TIPLAR §6): `m² − 5 = 0` ning ildizlari `±√5` — butun
// emas, hatto ratsional ham emas (13-14 dars), LEKIN ular bor. «Chiroyli emas»
// degani «yo'q» degani emas — bu karta aynan shu farq uchun qo'yilgan.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'two_roots_or_none', level: '🔴',
  zoneSize: 15, itemSize: 15,
  zones: [
    { id: 'z1', label: L('IKKI ILDIZ', 'ДВА КОРНЯ', 'TWO ROOTS') },
    { id: 'z2', label: L("ILDIZ YO'Q", 'КОРНЕЙ НЕТ', 'NO ROOTS') },
  ],
  items: [
    { id: 'i1', tokens: ['m² − 16 = 0'], zone: 'z1' },
    { id: 'i2', tokens: ['m² + 16 = 0'], zone: 'z2' },
    { id: 'i3', tokens: ['3m² − 27 = 0'], zone: 'z1' },
    { id: 'i4', tokens: ['m² + 1 = 0'], zone: 'z2' },
    { id: 'i5', tokens: ['m² − 5 = 0'], zone: 'z1' },
    { id: 'i6', tokens: ['4m² + 9 = 0'], zone: 'z2' },
    { id: 'i7', tokens: ['2m² = 50'], zone: 'z1' },
    { id: 'i8', tokens: ['m² = −25'], zone: 'z2' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Sakkiz tenglamada ikkinchi koeffitsiyent yo'q. Har birida m kvadratni yolg'iz qoldirsangiz, o'ng tomonning ishorasi javobni beradi.",
    'В восьми уравнениях нет второго коэффициента. Если в каждом оставить m квадрат в одиночестве, знак правой части и даст ответ.',
    'None of the eight equations has a second coefficient. Leave m squared alone in each, and the sign of the right side gives the answer.'),
  ask: L(
    "Tenglamani bosing, keyin guruhini bosing.",
    'Нажми уравнение, потом его группу.',
    'Tap an equation, then its group.'),
  bank: L('Tenglamalar', 'Уравнения', 'Equations'),
  correctText: L(
    "To'g'ri. Har tenglamada m kvadrat yolg'iz qoldiriladi: o'n olti, to'qqiz, besh va yigirma besh — musbat, demak ikki ildiz; minus o'n olti, minus bir, minus to'qqiz choragi va minus yigirma besh — manfiy, demak ildiz yo'q. Beshdan ildiz butun emas, lekin u SON, va ikki ildiz bor: minus beshdan ildiz va arti beshdan ildiz.",
    'Верно. В каждом уравнении m квадрат остаётся в одиночестве: шестнадцать, девять, пять и двадцать пять — положительные, значит два корня; минус шестнадцать, минус один, минус девять четвертых и минус двадцать пять — отрицательные, значит корней нет. Корень из пяти не целый, но это ЧИСЛО, и корней два: минус корень из пяти и плюс корень из пяти.',
    'Correct. In every equation m squared is left alone: sixteen, nine, five and twenty five are positive, so two roots; minus sixteen, minus one, minus nine quarters and minus twenty five are negative, so no roots. The root of five is not whole, but it is a NUMBER, and there are two roots: minus the root of five and plus the root of five.'),
  wrongs: [
    { when: (s) => s.place.i5 === 'z2', text: L(
      "Beshni o'ng tomonga o'tkazsangiz m kvadrat beshga teng bo'ladi — bu MUSBAT son, demak ikki ildiz bor. Ular butun emas: minus beshdan ildiz va beshdan ildiz, taxminan minus ikki butun yigirma uch va ikki butun yigirma uch. Butun bo'lmagani ildizni yo'q qilmaydi — 14-darsda irratsional sonlar ham son ekani ko'rilgan.",
      'Перенеси пять вправо — выйдет m квадрат равно пяти, это ПОЛОЖИТЕЛЬНОЕ число, значит корней два. Они не целые: минус корень из пяти и корень из пяти, примерно минус два и двадцать три и два и двадцать три. Нецелость корень не отменяет — в четырнадцатом уроке было видно, что иррациональные тоже числа.',
      'Move five to the right and m squared equals five — a POSITIVE number, so there are two roots. They are not whole: minus the root of five and the root of five, about minus two point two three and two point two three. Not being whole does not cancel a root — lesson fourteen showed that irrationals are numbers too.') },
    { when: (s) => s.place.i2 === 'z1' || s.place.i4 === 'z1' || s.place.i6 === 'z1' || s.place.i8 === 'z1', text: L(
      "Bu tenglamada m kvadrat MANFIY songa teng bo'lib chiqadi. O'n oltini o'ngga o'tkazing: m kvadrat minus o'n oltiga teng. Har qanday sonning kvadrati nomanfiy, demak bunday m yo'q. To'rtta karta shu turga tegishli, va ularni o'ng tomondagi ishora ajratib turadi.",
      'В этом уравнении m квадрат оказывается равен ОТРИЦАТЕЛЬНОМУ числу. Перенеси шестнадцать вправо: m квадрат равно минус шестнадцати. Квадрат любого числа неотрицателен, значит такого m нет. К этому виду относятся четыре карточки, и различает их знак правой части.',
      'In this equation m squared turns out to equal a NEGATIVE number. Move sixteen to the right: m squared equals minus sixteen. Any square is non-negative, so no such m exists. Four cards belong to this kind, told apart by the sign of the right side.') },
    { when: (s) => s.place.i3 === 'z2' || s.place.i7 === 'z2', text: L(
      "Bu tenglamada koeffitsiyent chalg'itdi. Avval undan xalos bo'ling: yigirma yettini o'ngga o'tkazib uchga bo'lsangiz m kvadrat to'qqizga teng bo'ladi — musbat, ikki ildiz. Ikkinchisida ellikni ikkiga bo'lsangiz yigirma besh chiqadi. Koeffitsiyent musbat bo'lsa ishorani o'zgartirmaydi.",
      'В этом уравнении сбил с толку коэффициент. Сначала избавься от него: перенеси двадцать семь вправо и раздели на три — выйдет m квадрат равно девяти, положительное, два корня. Во втором раздели пятьдесят на два — двадцать пять. Положительный коэффициент знака не меняет.',
      'The coefficient threw you off here. Get rid of it first: move twenty seven right and divide by three — m squared equals nine, positive, two roots. In the other, fifty over two is twenty five. A positive coefficient does not change the sign.') },
    { when: (s) => s.bad.length >= 4, text: L(
      "Har tenglamada bir xil ish qiling: m kvadratni yolg'iz qoldiring — hadni o'ngga o'tkazib koeffitsiyentga bo'ling. Keyin o'ng tomondagi ishoraga qarang.",
      'С каждым уравнением делай одно и то же: оставь m квадрат в одиночестве — перенеси слагаемое вправо и раздели на коэффициент. Потом смотри на знак правой части.',
      'Do the same with every equation: leave m squared alone — move the term right and divide by the coefficient. Then look at the sign of the right side.') },
  ],
  wrongText: L(
    "m kvadratni yolg'iz qoldiring va o'ng tomonning ISHORASIGA qarang: musbat — ikki ildiz, manfiy — ildiz yo'q. Javobning butun bo'lishi shart emas.",
    'Оставь m квадрат в одиночестве и смотри на ЗНАК правой части: положительный — два корня, отрицательный — корней нет. Целым ответ быть не обязан.',
    'Leave m squared alone and look at the SIGN of the right side: positive means two roots, negative means none. The answer does not have to be whole.'),
};

export default function D16_08(props) { return <Zones data={DATA} {...props} />; }
