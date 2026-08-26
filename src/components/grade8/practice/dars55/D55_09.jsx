// Dars55 · Amaliyot 09 — Skalyar · 🔴 🖼 · tag: dot_value
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §7 (55-dars, 9-pozitsiya)
//
// a(5;−2) · b(3;4) = 15 + (−8) = 7. Asosiy tuzoq — 23: ikkinchi
// ko'paytmada ishora yo'qolgan. Chizmada ikki vektor to'rda turadi:
// a pastga qiya, b yuqoriga — ishoralarning qayerdan kelgani ko'rinadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'dot_value', level: '🔴',
  target: 7, allowNeg: true,
  expr: [{
    fig: 'vec', w: 100, h: 104,
    grid: { x: [-1, 6], y: [-3, 5] },
    arrows: [
      { from: [0, 0], to: [5, -2], name: 'a' },
      { from: [0, 0], to: [3, 4], ref: true, name: 'b' },
    ],
  }],
  given: [['a(5; −2)'], ['b(3; 4)']],
  givenLabel: L('Berilgan', 'Дано', 'Given'),
  eyebrow: L('Skalyar', 'Скалярное', 'Dot product'),
  setup: L(
    "Ikki vektor koordinatalari bilan berilgan va chizmada to'rda ko'rsatilgan: a o'ngga va pastga ketadi, b esa o'ngga va yuqoriga. Ularning skalyar ko'paytmasini topish kerak. Diqqat: a ning ikkinchi koordinatasi manfiy.",
    'Два вектора заданы координатами и показаны на рисунке в клетках: a идёт вправо и вниз, а b вправо и вверх. Надо найти их скалярное произведение. Внимание: вторая координата a отрицательна.',
    'Two vectors are given by coordinates and shown on the grid: a runs right and down, b runs right and up. Find their dot product. Note: the second coordinate of a is negative.'),
  label: L("Skalyar ko'paytma", 'Скалярное произведение', 'The dot product'),
  ask: L('a · b nechaga teng?', 'Чему равно a · b?', 'What is a · b?'),
  correctText: L(
    "To'g'ri. Ikki ko'paytma: besh karra uch o'n besh, minus ikki karra to'rt minus sakkiz. Ularni qo'shamiz: o'n besh qo'shuv minus sakkiz yetti. Ikkinchi ko'paytma MANFIY chiqdi, chunki a pastga, b esa yuqoriga qaraydi — ularning ikkinchi koordinatalari qarama-qarshi ishorada. Shu sababdan natija o'n beshdan sezilarli kichik.",
    'Верно. Два произведения: пять на три пятнадцать, минус два на четыре минус восемь. Складываем: пятнадцать плюс минус восемь семь. Второе произведение вышло ОТРИЦАТЕЛЬНЫМ, потому что a смотрит вниз, а b вверх — их вторые координаты противоположны по знаку. Поэтому результат заметно меньше пятнадцати.',
    'Correct. Two products: five times three is fifteen, minus two times four is minus eight. Adding them: fifteen plus minus eight is seven. The second product came out NEGATIVE because a points down while b points up — their second coordinates have opposite signs. That is why the result is noticeably smaller than fifteen.'),
  wrongs: [
    { when: (s) => s.value === 23, text: L(
      "Ikkinchi ko'paytmada ishora yo'qolgan: siz o'n beshga sakkizni qo'shdingiz. Lekin a ning ikkinchi koordinatasi MINUS ikki, ya'ni ko'paytma minus sakkiz bo'ladi. Chizmaga qarang: a pastga qaraydi, b yuqoriga — ular bir-biriga qarshi ishlaydi, va shuning uchun ikkinchi qo'shiluvchi natijani KAMAYTIRADI.",
      'Во втором произведении потерян знак: ты прибавил к пятнадцати восемь. Но вторая координата a это МИНУС два, значит произведение равно минус восьми. Посмотри на рисунок: a смотрит вниз, b вверх — они работают друг против друга, и потому второе слагаемое УМЕНЬШАЕТ результат.',
      'The sign is lost in the second product: you added eight to fifteen. But the second coordinate of a is MINUS two, so the product is minus eight. Look at the drawing: a points down while b points up — they work against each other, so the second summand REDUCES the result.') },
    { when: (s) => s.value === 15, text: L(
      "Bu faqat birinchi ko'paytma. Skalyar ko'paytmada IKKI ko'paytma bor va ular qo'shiladi: besh karra uch va minus ikki karra to'rt. Ikkinchisini tashlab ketmang, u natijani sezilarli o'zgartiradi.",
      'Это только первое произведение. В скалярном произведении ДВА произведения, и они складываются: пять на три и минус два на четыре. Не пропускай второе, оно заметно меняет результат.',
      'This is only the first product. A dot product has TWO products and they are added: five times three and minus two times four. Do not skip the second, it changes the result noticeably.') },
    { when: (s) => s.value === -7, text: L(
      "Ishora teskari chiqdi. O'n besh qo'shuv minus sakkiz musbat yetti beradi, chunki o'n besh sakkizdan katta. Manfiy javob birinchi ko'paytma kichikroq bo'lganda chiqardi.",
      'Знак получился обратным. Пятнадцать плюс минус восемь даёт положительные семь, ведь пятнадцать больше восьми. Отрицательный ответ вышел бы, если бы первое произведение было меньше.',
      'The sign came out reversed. Fifteen plus minus eight gives positive seven, since fifteen is greater than eight. A negative answer would appear if the first product were smaller.') },
  ],
  wrongText: L(
    "Ikki ko'paytmani hisoblang va qo'shing. Ikkinchisida ishora manfiy.",
    'Посчитай два произведения и сложи. Во втором знак отрицательный.',
    'Compute the two products and add them. The sign of the second is negative.'),
};

export default function D55_09(props) { return <TypeValue data={DATA} {...props} />; }
