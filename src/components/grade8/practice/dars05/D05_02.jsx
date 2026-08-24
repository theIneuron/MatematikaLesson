// Dars05 · Amaliyot 02 — Guruhlar · 🟢 · tag: mul_div_correct
//
// KETMA-KETLIK O'ZGARDI (metodist, 2026-08-24): bu topshiriq ilgari 3-o'rinda
// turgan, endi 2-o'rinda. Mexanikasi va matematikasi o'sha — 2-6 darslar
// 1-darsning o'nta mexanikasidan har xil tartibda foydalanadi
// (`DARS02_06_AMALIYOT_SKELET.md` §2).
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
//
// Sakkiz tenglik, to'rt-to'rt. Tuzoqlar:
//   maxrajlar ko'paytirilmadi:     2/g · 3/g = 6/g
//   bo'lish o'rniga ko'paytirildi: (2/g) : (3/g) = 6/g²
//   songa bo'lishda son tepaga:    (5/g) : 5 = 25/g
//   songa ko'paytirishda maxrajga: (g/3) · 3 = g/9
// DIQQAT: (2/g) : (3/g) = 6/g² yozuvi g = 3 da TASODIFAN mos tushadi,
// shuning uchun razbor g = 2 ga yuboradi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'mul_div_correct', level: '🟢',
  zoneLbl: 92, itemSize: 14,
  zones: [
    { id: 'yes', label: L("TO'G'RI", 'ВЕРНО', 'CORRECT') },
    { id: 'no', label: L("NOTO'G'RI", 'НЕВЕРНО', 'WRONG') },
  ],
  items: [
    { id: 'i1', tokens: [{ n: '2', d: 'g' }, '·', { n: '3', d: 'g' }, '=', { n: '6', d: 'g²' }], zone: 'yes' },
    { id: 'i2', tokens: [{ n: '2', d: 'g' }, ':', { n: '3', d: 'g' }, '=', { n: '2', d: '3' }], zone: 'yes' },
    { id: 'i3', tokens: [{ n: 'g', d: '4' }, '·', { n: '4', d: 'g' }, '=', '1'], zone: 'yes' },
    { id: 'i4', tokens: [{ n: '5', d: 'g' }, ':', '5', '=', { n: '1', d: 'g' }], zone: 'yes' },
    { id: 'i5', tokens: [{ n: '2', d: 'g' }, '·', { n: '3', d: 'g' }, '=', { n: '6', d: 'g' }], zone: 'no' },
    { id: 'i6', tokens: [{ n: '2', d: 'g' }, ':', { n: '3', d: 'g' }, '=', { n: '6', d: 'g²' }], zone: 'no' },
    { id: 'i7', tokens: [{ n: '5', d: 'g' }, ':', '5', '=', { n: '25', d: 'g' }], zone: 'no' },
    { id: 'i8', tokens: [{ n: 'g', d: '3' }, '·', '3', '=', { n: 'g', d: '9' }], zone: 'no' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Sakkizta tenglik. Ba'zilarida ko'paytirish, ba'zilarida bo'lish — va to'rttasida xato bor.",
    'Восемь равенств. Где-то умножение, где-то деление — и в четырёх есть ошибка.',
    'Eight equalities. Some multiply, some divide — and four contain an error.'),
  ask: L(
    "Kartani bosing, keyin zonani bosing. Sakkizala tenglik ham joyini topishi kerak.",
    'Нажми карточку, потом зону. Все восемь равенств обязаны найти место.',
    'Tap a card, then a zone. All eight equalities must find a place.'),
  bank: L('Tengliklar', 'Равенства', 'Equalities'),
  correctText: L(
    "To'g'ri. Ko'paytirishda tepa tepaga, past pastga ko'paytiriladi. Bo'lishda esa ikkinchi kasr AG'DARILADI va shundan keyin ko'paytiriladi. Songa bo'lish — bir bo'lingan o'sha songa ko'paytirish, songa ko'paytirish esa suratga tegishli.",
    'Верно. При умножении верх идёт на верх, низ на низ. При делении вторую дробь ПЕРЕВОРАЧИВАЮТ и только потом умножают. Деление на число — это умножение на единицу, делённую на него, а умножение на число относится к числителю.',
    'Correct. In multiplication top goes with top and bottom with bottom. In division the second fraction is FLIPPED and only then multiplied. Dividing by a number is multiplying by one over it, and multiplying by a number affects the numerator.'),
  wrongs: [
    { when: (s) => s.place.i5 === 'yes', text: L(
      "Maxrajlar ham ko'paytiriladi: g karra g bu g kvadrat. G ni ikkiga teng qo'ying: bir karra bir yarim bu bir yarim, uch emas.",
      'Знаменатели тоже перемножаются: g на g — это g в квадрате. Подставь g равное двум: один на полтора — это полтора, а не три.',
      'Denominators multiply too: g times g is g squared. Put g equal to two: one times one and a half is one and a half, not three.') },
    { when: (s) => s.place.i6 === 'yes', text: L(
      "Bu ko'paytirishning javobi. Bo'lishda ikkinchi kasr ag'dariladi: ikki bo'lingan g karra g bo'lingan uch, ya'ni ikki uchdan. G ni IKKIGA teng qo'ying va ikkala tomonni solishtiring.",
      'Это ответ умножения. При делении вторую дробь переворачивают: два делить на g на g делить на три — две трети. Подставь g равное ДВУМ и сравни обе стороны.',
      'That is the answer to a multiplication. In division the second fraction is flipped: two over g times g over three is two thirds. Put g equal to TWO and compare both sides.') },
    { when: (s) => s.place.i7 === 'yes', text: L(
      "Songa bo'lish uni tepaga chiqarmaydi. Beshga bo'lish — bir beshdan ga ko'paytirish, ya'ni maxraj kattalashadi, surat emas.",
      'Деление на число не поднимает его наверх. Делить на пять — значит умножить на одну пятую, то есть растёт знаменатель, а не числитель.',
      'Dividing by a number does not move it upstairs. Dividing by five is multiplying by one fifth, so the denominator grows, not the numerator.') },
    { when: (s) => s.place.i8 === 'yes', text: L(
      "Songa ko'paytirish suratga tegishli, maxrajga emas: g bo'lingan uch karra uch bu g. G ni uchga teng qo'ying: bir karra uch bu uch, uch to'qqizdan emas.",
      'Умножение на число относится к числителю, а не к знаменателю: g делить на три на три — это g. Подставь g равное трём: один на три — три, а не три девятых.',
      'Multiplying by a number affects the numerator, not the denominator: g over three times three is g. Put g equal to three: one times three is three, not three ninths.') },
    { when: (s) => s.place.i2 === 'no', text: L(
      "Bu to'g'ri: ikkinchi kasr ag'darilganda g qisqaradi va ikki uchdan qoladi. Harflar yo'qolib ketgani xato belgisi emas.",
      'Это верно: при перевороте второй дроби g сокращается и остаётся две трети. Исчезновение буквы — не признак ошибки.',
      'This is right: when the second fraction is flipped the g cancels and two thirds is left. A letter disappearing is not a sign of error.') },
    { when: (s) => s.place.i3 === 'no' || s.place.i4 === 'no', text: L(
      "Bu ikkisi ham to'g'ri. Birinchisida g va to'rtlik o'zaro qisqaradi, ikkinchisida esa beshga bo'lish beshlikni yo'qotadi.",
      'Оба верны. В первом g и четвёрка взаимно сокращаются, во втором деление на пять убирает пятёрку.',
      'Both are right. In the first, g and the four cancel each other; in the second, dividing by five removes the five.') },
  ],
  wrongText: L(
    "Har tenglikda avval amalni aniqlang: ko'paytirishmi yoki bo'lish? Bo'lish bo'lsa, ikkinchi kasrni ag'daring va shundan keyin ko'paytiring.",
    'В каждом равенстве сначала определи действие: умножение или деление? Если деление — переверни вторую дробь и только потом умножай.',
    'In each equality first name the operation: multiply or divide? If divide, flip the second fraction and only then multiply.'),
};

export default function D05_02(props) { return <Zones data={DATA} {...props} />; }
