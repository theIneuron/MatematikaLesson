// Dars22 · Amaliyot 02 — Guruhlar · 🟢 · tag: t_possible
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §4 (22-dars, 2-pozitsiya)
//
// T3 SOF HOLDA (З48). Bikvadrat tenglamada belgilashdan keyin t topiladi,
// va undan x ni QAYTA olish kerak: x kvadrat t ga teng. Kvadrat manfiy
// bo'lmagani uchun manfiy t dan haqiqiy x chiqmaydi.
//
// Kartalar juft-juft, faqat ishora farq qiladi: sonning kattaligi hech
// narsani hal qilmaydi, ishorasi hal qiladi. `t = 0` alohida turadi va u
// BITTA ildiz beradi — bu 04-topshiriqda ochiladi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 't_possible', level: '🟢',
  zoneSize: 15, itemSize: 15, zoneLbl: 104,
  given: [['x² = t']],
  givenLabel: L('Belgilash', 'Замена', 'Substitution'),
  zones: [
    { id: 'z1', label: L('x TOPILADI', 'x НАХОДИТСЯ', 'x CAN BE FOUND') },
    { id: 'z2', label: L('x TOPILMAYDI', 'x НЕ НАХОДИТСЯ', 'x CANNOT BE FOUND') },
  ],
  items: [
    { id: 'i1', tokens: ['t = 9'], zone: 'z1' },
    { id: 'i2', tokens: ['t = −9'], zone: 'z2' },
    { id: 'i3', tokens: ['t = 0'], zone: 'z1' },
    { id: 'i4', tokens: ['t = −1'], zone: 'z2' },
    { id: 'i5', tokens: ['t = 4'], zone: 'z1' },
    { id: 'i6', tokens: ['t = −4'], zone: 'z2' },
    { id: 'i7', tokens: ['t = 1'], zone: 'z1' },
    { id: 'i8', tokens: ['t = −16'], zone: 'z2' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Bikvadrat tenglamada x² = t belgilash qilingan va t ning qiymatlari topilgan. Endi har t dan x ni qaytarish kerak: x kvadrat t ga teng.",
    'В биквадратном уравнении сделана замена x² = t и найдены значения t. Теперь из каждого t надо вернуть x: x в квадрате равен t.',
    'In a biquadratic equation the substitution x² = t was made and the values of t were found. Now x must be recovered from each t: x squared equals t.'),
  ask: L(
    't ni bosing, keyin guruhini bosing.',
    'Нажми t, потом его группу.',
    'Tap a t, then its group.'),
  bank: L('Qiymatlar', 'Значения', 'Values'),
  correctText: L(
    "To'g'ri. Kvadrat manfiy bo'lmaydi, shuning uchun manfiy t dan haqiqiy x chiqmaydi. Musbat t ikki x beradi — biri musbat, biri manfiy. Nol alohida: kvadrati nol bo'lgan yagona son — nolning o'zi.",
    'Верно. Квадрат неотрицателен, поэтому из отрицательного t действительный x не выходит. Положительное t даёт два x — один положительный, другой отрицательный. Нуль особый: единственное число с нулевым квадратом это сам нуль.',
    'Correct. A square is never negative, so a negative t yields no real x. A positive t gives two values of x — one positive, one negative. Zero is special: the only number squaring to zero is zero itself.'),
  wrongs: [
    { when: (s) => s.place.i2 === 'z1' || s.place.i4 === 'z1' || s.place.i6 === 'z1' || s.place.i8 === 'z1', text: L(
        "Bu t MANFIY, ya'ni undan x topilmaydi: x kvadrat degani x karra x, va bu ko'paytma hech qachon noldan kichik bo'lmaydi — musbatni musbatga ham, manfiyni manfiyga ham ko'paytirsangiz musbat chiqadi.",
        'Это t ОТРИЦАТЕЛЬНО, значит x из него не находится: x квадрат это x на x, и такое произведение никогда не меньше нуля — и положительное на положительное, и отрицательное на отрицательное дают положительное.',
        'This t is NEGATIVE, so x cannot be found from it: x squared is x times x, and such a product is never below zero — positive times positive and negative times negative are both positive.') },
    { when: (s) => s.place.i3 === 'z2', text: L(
      "Nol manfiy emas, shuning uchun undan x topiladi. x kvadrat nolga teng bo'lsa, x ning o'zi ham nol: kvadrati nolga aylanadigan boshqa son yo'q. Bu holda ildiz BITTA — musbati ham, manfiysi ham emas, nol.",
      'Нуль не отрицателен, поэтому x из него находится. Если x квадрат равен нулю, то и сам x равен нулю: другого числа с нулевым квадратом нет. В этом случае корень ОДИН — не положительный и не отрицательный, а нуль.',
      'Zero is not negative, so x can be found from it. If x squared is zero then x itself is zero: no other number squares to zero. In this case there is ONE root — neither positive nor negative, but zero.') },
    { when: (s) => s.place.i1 === 'z2' || s.place.i5 === 'z2' || s.place.i7 === 'z2', text: L(
      "Bu t MUSBAT, ya'ni undan x bemalol topiladi, va hatto ikkita: masalan x kvadrat to'qqizga teng bo'lsa, x uch yoki minus uch. Ikkalasining ham kvadrati to'qqiz.",
      'Это t ПОЛОЖИТЕЛЬНО, значит x из него находится, и даже два: например если x квадрат равен девяти, то x равен трём или минус трём. У обоих квадрат девять.',
      'This t is POSITIVE, so x can be found from it — two values in fact: if x squared is nine, then x is three or minus three. Both have square nine.') },
    { when: (s) => s.bad.length >= 4, text: L(
      "Har t bilan bitta savolni bering: kvadrati shu songa teng bo'lgan son bormi. Manfiy sonda yo'q, musbatda ikkita, nolda bitta. Sonning kattaligi ahamiyatsiz — faqat ishorasi hal qiladi.",
      'С каждым t задай один вопрос: есть ли число, квадрат которого равен этому значению. У отрицательного нет, у положительного два, у нуля одно. Величина числа не важна — решает только знак.',
      'Ask one question of every t: is there a number whose square equals it. For a negative there is none, for a positive there are two, for zero there is one. The size of the number does not matter — only its sign decides.') },
  ],
  wrongText: L(
    "x kvadrat manfiy bo'lmaydi, shuning uchun manfiy t dan haqiqiy x chiqmaydi. Musbat t ikki ildiz beradi, nol esa bitta.",
    'x в квадрате не бывает отрицательным, поэтому из отрицательного t действительный x не выходит. Положительное t даёт два корня, а нуль один.',
    'x squared is never negative, so a negative t yields no real x. A positive t gives two roots, and zero gives one.'),
};

export default function D22_02(props) { return <Zones data={DATA} {...props} />; }
