// Dars18 · Amaliyot 02 — Ishora · 🟢 · tag: by_D_sign
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §6 (18-dars, 2-pozitsiya)
//
// Kartalar juft-juft: to'qqiz va minus to'qqiz, bir va minus bir, yuz va
// minus yuz — faqat ishora farq qiladi. Ya'ni javobni faqat ISHORA hal
// qiladi, sonning kattaligi emas.
//
// `D = 0` KARTASI BIRINCHI GURUHDA (З9): nolda ildiz bor va u bitta. Zonaning
// nomi ataylab «ildiz bor» — «ikki ildiz» emas, aks holda nol karta hech
// qayerga tushmasdi. Ildizlarning SONI 05, 06 va 09 topshiriqlarida.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'by_D_sign', level: '🟢',
  zoneSize: 16, itemSize: 17,
  zones: [
    { id: 'z1', label: L('ILDIZ BOR', 'КОРНИ ЕСТЬ', 'ROOTS EXIST') },
    { id: 'z2', label: L("ILDIZ YO'Q", 'КОРНЕЙ НЕТ', 'NO ROOTS') },
  ],
  items: [
    { id: 'i1', tokens: ['D = 9'], zone: 'z1' },
    { id: 'i2', tokens: ['D = −9'], zone: 'z2' },
    { id: 'i3', tokens: ['D = 0'], zone: 'z1' },
    { id: 'i4', tokens: ['D = −1'], zone: 'z2' },
    { id: 'i5', tokens: ['D = 1'], zone: 'z1' },
    { id: 'i6', tokens: ['D = −16'], zone: 'z2' },
    { id: 'i7', tokens: ['D = 100'], zone: 'z1' },
    { id: 'i8', tokens: ['D = −100'], zone: 'z2' },
  ],
  eyebrow: L('Ishora', 'Знак', 'Sign'),
  setup: L(
    "Sakkiz kartada diskriminantning qiymati turadi. Ildiz bor-yo'qligini sonning kattaligi emas, ISHORASI hal qiladi.",
    'На восьми карточках стоит значение дискриминанта. Есть корни или нет, решает не величина числа, а его ЗНАК.',
    'The eight cards hold values of the discriminant. Whether roots exist is decided not by the size of the number but by its SIGN.'),
  ask: L(
    "Kartani bosing, keyin guruhini bosing.",
    'Нажми карточку, потом её группу.',
    'Tap a card, then its group.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Formulada D ildiz ostida turadi, va ildiz faqat nomanfiy sondan olinadi. Demak D musbat yoki nol bo'lsa ildiz bor, manfiy bo'lsa yo'q. Kattaligi hech narsani hal qilmaydi: yuz ham, bir ham musbat, ikkalasida ham ildiz bor. Nol esa alohida hol — u yerda ildiz bitta, lekin BOR.",
    'Верно. В формуле D стоит под корнем, а корень извлекается только из неотрицательного числа. Значит при положительном D и при нуле корни есть, при отрицательном нет. Величина ничего не решает: и сто, и один положительны, корни есть в обоих. А нуль — особый случай: там корень один, но он ЕСТЬ.',
    'Correct. In the formula D sits under the root, and a root exists only for a non-negative number. So a positive D and a zero D give roots, a negative one does not. Size decides nothing: both one hundred and one are positive and both give roots. Zero is the special case: there the root is single, but it EXISTS.'),
  wrongs: [
    { when: (s) => s.place.i3 === 'z2', text: L(
      "Nol karta ikkinchi guruhga tushdi. Nol manfiy son emas: undan ildiz olinadi, va nolning ildizi nol. Formulaga qo'ysangiz plyus-minus nol chiqadi, ya'ni bitta javob. Ildiz bor — faqat bitta.",
      'Карточка с нулём попала во вторую группу. Нуль не отрицательное число: из него корень извлекается, и корень из нуля нуль. Подставь в формулу — выйдет плюс-минус нуль, то есть один ответ. Корень есть — просто один.',
      'The zero card went into the second group. Zero is not a negative number: its root exists and equals zero. Put it into the formula and you get plus or minus zero, that is one answer. The root exists — there is simply one of it.') },
    { when: (s) => s.place.i2 === 'z1' || s.place.i4 === 'z1' || s.place.i6 === 'z1' || s.place.i8 === 'z1', text: L(
      "Manfiy D birinchi guruhga tushdi. Formulada D ildiz ostida turadi, manfiy sondan esa ildiz olinmaydi: kvadrati minus to'qqizga teng son yo'q. Sonning kattaligi ahamiyatsiz — minus bir ham, minus yuz ham bir xil javob beradi: ildiz yo'q.",
      'Отрицательное D попало в первую группу. В формуле D стоит под корнем, а из отрицательного числа корень не извлекается: числа с квадратом минус девять нет. Величина неважна — и минус один, и минус сто дают один ответ: корней нет.',
      'A negative D went into the first group. In the formula D sits under the root, and a negative number has no root: nothing squares to minus nine. Size is irrelevant — minus one and minus one hundred give the same answer: no roots.') },
    { when: (s) => s.place.i1 === 'z2' || s.place.i5 === 'z2' || s.place.i7 === 'z2', text: L(
      "Musbat D ikkinchi guruhga tushdi. Musbat sondan ildiz har doim olinadi, va plyus-minus ikki javob beradi. Bir ham, to'qqiz ham, yuz ham musbat — uchalasida ikki ildiz bor.",
      'Положительное D попало во вторую группу. Из положительного числа корень извлекается всегда, и плюс-минус даёт два ответа. И один, и девять, и сто положительны — во всех трёх по два корня.',
      'A positive D went into the second group. A positive number always has a root, and the plus-or-minus yields two answers. One, nine and one hundred are all positive — all three give two roots.') },
    { when: (s) => s.bad.length >= 4, text: L(
      "Har kartada bitta savol: bu son manfiymi? Manfiy bo'lsa ildiz yo'q. Nol va musbat sonlarda ildiz bor.",
      'В каждой карточке один вопрос: отрицательно ли это число? Отрицательно — корней нет. При нуле и положительных корни есть.',
      'One question per card: is this number negative? Negative means no roots. Zero and positive numbers give roots.') },
  ],
  wrongText: L(
    "D ildiz ostida turadi, shuning uchun faqat ishora muhim: manfiy — ildiz yo'q, nol va musbat — bor. Nol manfiy son emas.",
    'D стоит под корнем, поэтому важен только знак: отрицательное — корней нет, нуль и положительное — есть. Нуль не отрицательное число.',
    'D sits under the root, so only the sign matters: negative means no roots, zero and positive mean roots. Zero is not a negative number.'),
};

export default function D18_02(props) { return <Zones data={DATA} {...props} />; }
