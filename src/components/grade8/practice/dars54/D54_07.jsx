// Dars54 · Amaliyot 07 — Kod · 🟡 · tag: code_moduli
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §6 (54-dars, 7-pozitsiya)
//
// |a⃗| = 4. Uch koeffitsiyent ataylab uch xil: kasr, manfiy va butun.
//   |0,5a| = 2      |−2a| = 8      |3a| = 12
// Bankdagi `−8` — З114: manfiy koeffitsiyent modulga o'tkazilgan.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_moduli', level: '🟡',
  expr: ['|a| = 4', '   ', '0,5a,  −2a,  3a'], exprSize: 17,
  cards: ['2', '4', '6', '8', '12', '−8'],
  answer: ['2', '8', '12'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. a vektorining moduli to'rt. Uni uch xil songa ko'paytirdik: nol butun beshga, minus ikkiga va uchga. Har natijaning modulini topish kerak.",
    'В комнате сейф, код трёхзначный. Модуль вектора a равен четырём. Его умножили на три разных числа: на ноль целых пять, на минус два и на три. Надо найти модуль каждого результата.',
    'There is a safe in the room and its code has three places. The modulus of the vector a is four. It was multiplied by three different numbers: by nought point five, by minus two, and by three. Find the modulus of each result.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Uch modulni kodga o'sish tartibida yozing.",
    'Запиши три модуля в код по возрастанию.',
    'Write the three moduli into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Uch koeffitsiyent uch xil, lekin qoida bitta: koeffitsiyentning MODULINI vektorning moduliga ko'paytiramiz. Nol butun beshning moduli nol butun besh, to'rtga ko'paytirsak ikki. Minus ikkining moduli ikki, to'rtga ko'paytirsak sakkiz — manfiy emas. Uchning moduli uch, to'rtga ko'paytirsak o'n ikki. Uchala javob ham musbat, chunki modul uzunlikni bildiradi.",
    'Верно. Три коэффициента разные, но правило одно: МОДУЛЬ коэффициента умножаем на модуль вектора. Модуль ноль целых пяти это ноль целых пять, на четыре даёт два. Модуль минус двух это два, на четыре даёт восемь — не отрицательное. Модуль трёх это три, на четыре даёт двенадцать. Все три ответа положительны, ведь модуль означает длину.',
    'Correct. The three coefficients differ, but the rule is one: multiply the MODULUS of the coefficient by the modulus of the vector. The modulus of nought point five is nought point five, times four gives two. The modulus of minus two is two, times four gives eight — not negative. The modulus of three is three, times four gives twelve. All three answers are positive, since a modulus means a length.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('−8') !== -1, text: L(
      "Kodga minus sakkiz tushib qoldi. Modul manfiy bo'lolmaydi: u UZUNLIKNI bildiradi, uzunlik esa noldan kichik emas. Minus ikki karra a vektori haqiqatan ham teskari yo'nalgan, lekin uning UZUNLIGI sakkiz — teskari yo'nalgan strelka ham musbat uzunlikka ega.",
      'В код попало минус восемь. Модуль отрицательным не бывает: он означает ДЛИНУ, а длина не меньше нуля. Вектор минус два a действительно направлен обратно, но его ДЛИНА восемь — у стрелки, направленной обратно, длина тоже положительная.',
      'Minus eight got into the code. A modulus is never negative: it means a LENGTH, and a length is not less than zero. The vector minus two a does indeed point backwards, but its LENGTH is eight — an arrow pointing backwards still has a positive length.') },
    { when: (s) => s.slots.indexOf('2') === -1, text: L(
      "Ikki tushib qoldi. Nol butun besh — musbat kasr, ya'ni u vektorni QISQARTIRADI: to'rtning yarmi ikki. Kasr koeffitsiyent ham xuddi butun son kabi ishlaydi, faqat natija kichrayadi.",
      'Двойка выпала. Ноль целых пять это положительная дробь, то есть она УКОРАЧИВАЕТ вектор: половина четырёх это два. Дробный коэффициент работает так же, как целый, только результат уменьшается.',
      'The two is missing. Nought point five is a positive fraction, so it SHORTENS the vector: half of four is two. A fractional coefficient works just like a whole one, only the result gets smaller.') },
    { when: () => true, text: L(
      "Har koeffitsiyentning modulini to'rtga ko'paytiring: nol butun besh, ikki va uch. Chiqadi ikki, sakkiz va o'n ikki. Keyin ularni o'sish tartibida qo'ying.",
      'Умножь модуль каждого коэффициента на четыре: ноль целых пять, два и три. Выйдут два, восемь и двенадцать. Потом поставь их по возрастанию.',
      'Multiply the modulus of each coefficient by four: nought point five, two, and three. You get two, eight, and twelve. Then put them in increasing order.') },
  ],
  wrongText: L(
    "Koeffitsiyentning modulini vektorning moduliga ko'paytiring. Natija musbat bo'ladi.",
    'Умножь модуль коэффициента на модуль вектора. Результат положителен.',
    'Multiply the modulus of the coefficient by the modulus of the vector. The result is positive.'),
};

export default function D54_07(props) { return <CodeLock data={DATA} {...props} />; }
