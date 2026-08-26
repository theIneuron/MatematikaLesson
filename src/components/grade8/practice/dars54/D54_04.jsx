// Dars54 · Amaliyot 04 — Modul · 🟡 · tag: which_length
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §6 (54-dars, 4-pozitsiya)
//
// T1 NING MODUL TOMONI: |k·a⃗| = |k|·|a⃗|, ya'ni koeffitsiyent MODUL
// ostiga kiradi. Asosiy tuzoq — −18 (З114 ning modul tomoni).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'which_length', level: '🟡',
  correct: 0, optCols: 2, optSize: 20,
  given: [['|a| = 6']],
  givenLabel: L('Berilgan', 'Дано', 'Given'),
  eyebrow: L('Modul', 'Модуль', 'The modulus'),
  setup: L(
    "a vektorining moduli olti, ya'ni uning uzunligi olti birlik. Uni minus uchga ko'paytirdik. Yangi vektorning MODULINI, ya'ni uzunligini topish kerak.",
    'Модуль вектора a равен шести, то есть его длина шесть единиц. Его умножили на минус три. Надо найти МОДУЛЬ нового вектора, то есть его длину.',
    'The modulus of the vector a is six, that is, its length is six units. It was multiplied by minus three. Find the MODULUS, that is, the length, of the new vector.'),
  ask: L(
    '|−3a| nechaga teng?',
    'Чему равен |−3a|?',
    'What is |−3a|?'),
  opts: [
    { label: ['18'] },
    { label: ['−18'] },
    { label: ['3'] },
    { label: ['9'] },
  ],
  correctText: L(
    "To'g'ri. Formula: k karra a ning moduli k ning moduli karra a ning moduliga teng. Minus uchning moduli uch, oltiga ko'paytiramiz — o'n sakkiz. Minus faqat YO'NALISHGA ta'sir qiladi: vektor teskari buriladi. Uzunligi esa uch barobar oshadi va manfiy bo'lolmaydi.",
    'Верно. Формула: модуль k на a равен модулю k на модуль a. Модуль минус трёх это три, умножаем на шесть — восемнадцать. Минус влияет только на НАПРАВЛЕНИЕ: вектор разворачивается. А длина увеличивается втрое и отрицательной быть не может.',
    'Correct. The formula: the modulus of k times a equals the modulus of k times the modulus of a. The modulus of minus three is three, multiplied by six gives eighteen. The minus affects only the DIRECTION: the vector reverses. The length grows threefold and cannot be negative.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Modul manfiy bo'lolmaydi. Modul — bu UZUNLIK, va uzunlik hech qachon noldan kichik bo'lmaydi: minus o'n sakkiz santimetrlik kesma yo'q. Formulada koeffitsiyent modul ostiga kiradi, ya'ni minus u yerda yo'qoladi. Minus vektorning o'zida qoladi va uni teskari buradi, lekin uzunligiga tegmaydi.",
      'Модуль не бывает отрицательным. Модуль это ДЛИНА, а длина никогда не меньше нуля: отрезка в минус восемнадцать сантиметров не существует. В формуле коэффициент входит под модуль, то есть минус там исчезает. Минус остаётся у самого вектора и разворачивает его, но длины не касается.',
      'A modulus is never negative. A modulus is a LENGTH, and a length is never less than zero: there is no segment of minus eighteen centimetres. In the formula the coefficient goes under the modulus, so the minus disappears there. The minus stays with the vector itself and reverses it, but it does not touch the length.') },
    { when: (s) => s.picked === 2, text: L(
      "Bu koeffitsiyentning o'zi, javob emas. Uch — bu necha barobar ko'paytirilgani, olti esa dastlabki uzunlik. Ikkovini ko'paytirish kerak: uch karra olti o'n sakkiz.",
      'Это сам коэффициент, а не ответ. Три это во сколько раз умножили, а шесть это исходная длина. Их надо перемножить: три на шесть восемнадцать.',
      'This is the coefficient itself, not the answer. Three is how many times over, and six is the original length. The two must be multiplied: three times six is eighteen.') },
    { when: (s) => s.picked === 3, text: L(
      "To'qqiz — bu uch qo'shuv olti, ya'ni qo'shish. Bu yerda esa ko'paytirish: vektorni songa ko'paytirganda uzunlik shu songa KO'PAYADI, qo'shilmaydi. Uch karra olti o'n sakkiz.",
      'Девять это три плюс шесть, то есть сложение. А здесь умножение: при умножении вектора на число длина УМНОЖАЕТСЯ на это число, а не складывается с ним. Три на шесть восемнадцать.',
      'Nine is three plus six, that is, addition. But here it is multiplication: when a vector is multiplied by a number the length is MULTIPLIED by that number, not added to it. Three times six is eighteen.') },
  ],
  wrongText: L(
    "Koeffitsiyent modul ostiga kiradi: minus uchning moduli uch. Uch karra olti.",
    'Коэффициент входит под модуль: модуль минус трёх это три. Три на шесть.',
    'The coefficient goes under the modulus: the modulus of minus three is three. Three times six.'),
};

export default function D54_04(props) { return <Choice data={DATA} {...props} />; }
