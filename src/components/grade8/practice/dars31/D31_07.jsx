// Dars31 · Amaliyot 07 — Pazl · 🟡 · tag: base_to_value
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §3 (31-dars, 7-pozitsiya)
//
// UCH JUFTLIKDA BITTA RAQAM — TO'RT. Farq faqat asosning shaklida:
//   4⁻¹    -> butun son ag'dariladi   -> 1/4
//   (¼)⁻¹  -> kasr ag'dariladi        -> 4
//   (−4)⁻¹ -> manfiy son ag'dariladi  -> −1/4
// Ikkinchisi eng qimmat: manfiy ko'rsatkich «kichraytiradi» degan tasavvur
// aynan shu yerda sinadi — natija asosdan KATTA chiqdi.
//
// Kartalarda yozuv BO'SHLIQSIZ (skelet §0a.5): telefonda karta 54px.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'base_to_value', level: '🟡',
  faceSize: 13, faceSizePhone: 11,
  cards: [
    { id: 'f1', side: 0, tokens: ['4⁻¹'] },
    { id: 'f2', side: 0, tokens: ['(¼)⁻¹'] },
    { id: 'f3', side: 0, tokens: ['(−4)⁻¹'] },
    { id: 'v1', side: 1, v: '1/4' },
    { id: 'v2', side: 1, v: '4' },
    { id: 'v3', side: 1, v: '−1/4' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Uch yozuvda bitta raqam turibdi — to'rt, — va uch joyda ham ko'rsatkich minus bir. Farq faqat asosning shaklida: butun son, kasr va manfiy son.",
    'В трёх записях стоит одна цифра — четыре, — и во всех трёх показатель минус один. Различие только в виде основания: целое число, дробь и отрицательное число.',
    'The three records hold one digit — four — and in all three the exponent is minus one. They differ only in the shape of the base: a whole number, a fraction, and a negative number.'),
  ask: L(
    'Yozuvni bosing, keyin uyani bosing.',
    'Нажми запись, потом ячейку.',
    'Tap a record, then a slot.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Minus birinchi daraja bitta ish qiladi — sonni AG'DARADI. To'rtni ag'darsangiz bir to'rtdan chiqadi. Bir to'rtdan ni ag'darsangiz to'rt chiqadi, ya'ni natija asosdan KATTA bo'ldi: «manfiy ko'rsatkich kichraytiradi» degan tasavvur shu yerda sinadi. Minus to'rtni ag'darsangiz minus bir to'rtdan chiqadi — ishora saqlanadi, chunki teskari sonni topish ishorani o'zgartirmaydi. Har javobni tekshirish oson: asosni javobga ko'paytiring, bir chiqishi kerak.",
    'Верно. Минус первая степень делает одно — ПЕРЕВОРАЧИВАЕТ число. Перевернёшь четыре — получишь одну четвёртую. Перевернёшь одну четвёртую — получишь четыре, то есть результат оказался БОЛЬШЕ основания: представление «отрицательный показатель уменьшает» ломается именно здесь. Перевернёшь минус четыре — получишь минус одну четвёртую: знак сохраняется, потому что переход к обратному числу знака не меняет. Каждый ответ легко проверить: умножь основание на ответ, должна получиться единица.',
    'Correct. The minus first power does one thing — it TURNS the number over. Turn four over and you get one quarter. Turn one quarter over and you get four, so the result came out LARGER than the base: the idea that «a negative exponent makes things smaller» breaks right here. Turn minus four over and you get minus one quarter: the sign is kept, because taking the reciprocal does not change it. Every answer is easy to check: multiply the base by the answer and you should get one.'),
  wrongs: [
    { when: (s) => s.mate.f2 !== 'v2', text: L(
      "Ikkinchi yozuvda asos KASR: bir to'rtdan. Uni ag'darsangiz surat va maxraj o'rin almashadi, ya'ni to'rt bo'lib qoladi. Natija asosdan katta chiqdi, va bu to'g'ri: manfiy ko'rsatkich sonni kichraytirmaydi, u AG'DARADI. Tekshiring — bir to'rtdan ni to'rtga ko'paytiring, bir chiqadi.",
      'Во второй записи основание ДРОБЬ: одна четвёртая. Перевернёшь её — числитель и знаменатель поменяются местами, то есть получится четыре. Результат оказался больше основания, и это верно: отрицательный показатель не уменьшает число, он его ПЕРЕВОРАЧИВАЕТ. Проверь — умножь одну четвёртую на четыре, получится единица.',
      'In the second record the base is a FRACTION: one quarter. Turn it over and the numerator and denominator swap, giving four. The result came out larger than the base, and that is right: a negative exponent does not shrink a number, it TURNS IT OVER. Check — multiply one quarter by four and you get one.') },
    { when: (s) => s.mate.f3 !== 'v3', text: L(
      "Uchinchi yozuvda minus QAVS ICHIDA, ya'ni asos manfiy. Teskari songa o'tish ishorani o'zgartirmaydi: minus to'rtning teskarisi minus bir to'rtdan. Tekshiring — minus to'rtni minus bir to'rtdan ga ko'paytiring, bir chiqadi. Agar javob musbat bo'lganda edi, ko'paytma manfiy chiqib qolardi.",
      'В третьей записи минус стоит ВНУТРИ СКОБКИ, то есть основание отрицательное. Переход к обратному числу знака не меняет: обратное к минус четырём это минус одна четвёртая. Проверь — умножь минус четыре на минус одну четвёртую, получится единица. Будь ответ положительным, произведение вышло бы отрицательным.',
      'In the third record the minus is INSIDE THE BRACKET, so the base is negative. Taking the reciprocal does not change the sign: the reciprocal of minus four is minus one quarter. Check — multiply minus four by minus one quarter and you get one. Were the answer positive, the product would come out negative.') },
    { when: (s) => s.mate.f1 !== 'v1', text: L(
      "Birinchi yozuv eng oddiysi: to'rtning minus birinchi darajasi bir bo'lingan to'rt. Butun sonni ag'darish uni maxrajga tushiradi. Tekshiring — to'rtni bir to'rtdan ga ko'paytiring, bir chiqadi. Qolgan ikki karta boshqa shakldagi asoslar, lekin amal ularda ham o'sha.",
      'Первая запись самая простая: четыре в минус первой это единица делить на четыре. Переворот целого числа уводит его в знаменатель. Проверь — умножь четыре на одну четвёртую, получится единица. Остальные две карточки — основания другого вида, но действие в них то же самое.',
      'The first record is the simplest: four to the minus one is one divided by four. Turning a whole number over sends it into the denominator. Check — multiply four by one quarter and you get one. The other two cards carry bases of a different shape, but the operation there is the same.') },
  ],
  wrongText: L(
    "Minus birinchi daraja sonni ag'daradi. Har javobni ko'paytirib tekshiring: asosni javobga ko'paytirsangiz bir chiqishi kerak.",
    'Минус первая степень переворачивает число. Проверяй каждый ответ умножением: основание, умноженное на ответ, должно дать единицу.',
    'The minus first power turns the number over. Check each answer by multiplying: the base times the answer must give one.'),
};

export default function D31_07(props) { return <PairSlots data={DATA} {...props} />; }
