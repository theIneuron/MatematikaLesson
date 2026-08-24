// Dars07 · Amaliyot 04 — Koeffitsient · 🟡 · tag: find_k
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §5 (7-dars, 4-pozitsiya)
//
// Darsning birinchi tasdig'i: k = x·y. Nuqta manfiy y bilan berilgan, ya'ni
// javob manfiy son — `allowNeg` shart. Har xato javob SON bilan rad etiladi:
//   24  — ishora tushdi (З28);  −8 — bu y ning o'zi;
//   −5  — qo'shildi;            8  — ishora ham, amal ham;
//   3   — bu x.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'find_k', level: '🟡',
  target: -24, allowNeg: true,
  expr: ['y', '=', { n: 'k', d: 'x' }], exprSize: 28,
  given: [['x = 3'], ['y = −8']],
  givenLabel: L('Nuqta', 'Точка', 'Point'),
  eyebrow: L('Koeffitsient', 'Коэффициент', 'Coefficient'),
  setup: L(
    "Grafik shu nuqtadan o'tadi. Teskari proporsionallikda x va y ning ko'paytmasi hamma nuqtada bir xil va u k ga teng.",
    'График проходит через эту точку. При обратной пропорциональности произведение x на y одинаково во всех точках и равно k.',
    'The graph passes through this point. In inverse proportionality the product of x and y is the same at every point and equals k.'),
  label: L('k ning qiymati', 'значение k', 'the value of k'),
  ask: L('k nimaga teng?', 'Чему равно k?', 'What does k equal?'),
  correctText: L(
    "To'g'ri. k ni topish uchun nuqtaning koordinatalarini ko'paytiramiz: uch karra minus sakkiz minus yigirma to'rt. Tekshiring: minus yigirma to'rtni uchga bo'lsangiz minus sakkiz chiqadi, ya'ni nuqta haqiqatan grafikda turadi.",
    'Верно. Чтобы найти k, перемножаем координаты точки: три на минус восемь — минус двадцать четыре. Проверь: минус двадцать четыре разделить на три равно минус восьми, значит точка действительно лежит на графике.',
    'Correct. To find k we multiply the coordinates of the point: three times minus eight is minus twenty four. Check: minus twenty four over three is minus eight, so the point really does lie on the graph.'),
  wrongs: [
    { when: (s) => s.value === 24, text: L(
      "Kattaligi to'g'ri, ishorasi yo'q. Tekshirib ko'ring: yigirma to'rtni uchga bo'lsangiz arti sakkiz chiqadi, nuqtada esa y minus sakkizga teng. Manfiy songa ko'paytirilgan musbat son manfiy bo'ladi.",
      'Величина верна, а знака нет. Проверь: двадцать четыре разделить на три — плюс восемь, а в точке y равно минус восьми. Положительное на отрицательное даёт отрицательное.',
      'The size is right but the sign is missing. Check: twenty four over three is plus eight, while at the point y equals minus eight. A positive times a negative is negative.') },
    { when: (s) => s.value === -8, text: L(
      "Bu y ning o'zi, k emas. k ni topish uchun ikki koordinatani ko'paytirish kerak. Tekshirib ko'ring: minus sakkizni uchga bo'lsangiz minus sakkiz chiqmaydi.",
      'Это само y, а не k. Чтобы найти k, надо перемножить обе координаты. Проверь: минус восемь разделить на три не даёт минус восьми.',
      'That is y itself, not k. To find k you must multiply both coordinates. Check: minus eight over three does not give minus eight.') },
    { when: (s) => s.value === -5, text: L(
      "Bu qo'shish: uch qo'shuv minus sakkiz. Teskari proporsionallikda esa KO'PAYTMA o'zgarmaydi, yig'indi emas. Minus beshni uchga bo'lsangiz minus sakkiz chiqmaydi.",
      'Это сложение: три плюс минус восемь. А при обратной пропорциональности неизменно ПРОИЗВЕДЕНИЕ, не сумма. Минус пять разделить на три не даёт минус восьми.',
      'That is addition: three plus minus eight. In inverse proportionality it is the PRODUCT that stays constant, not the sum. Minus five over three does not give minus eight.') },
    { when: (s) => s.value === 8 || s.value === 3, text: L(
      "Bu son nuqtadan ko'chib qolgan, hisoblanmagan. k ni topish uchun x ni y ga ko'paytiring va javobni bo'lish bilan tekshiring: k ni uchga bo'lganda minus sakkiz chiqishi kerak.",
      'Это число просто перенесено из точки, а не посчитано. Найди k как x на y и проверь делением: k разделить на три должно дать минус восемь.',
      'That number was carried over from the point instead of being computed. Find k as x times y and check by dividing: k over three must give minus eight.') },
  ],
  wrongText: L(
    "Nuqtaning ikki koordinatasini ko'paytiring. Javobni tekshirish oson: k ni uchga bo'lsangiz minus sakkiz chiqishi kerak.",
    'Перемножь обе координаты точки. Проверить легко: k разделить на три должно дать минус восемь.',
    'Multiply the two coordinates of the point. Checking is easy: k divided by three must give minus eight.'),
};

export default function D07_04(props) { return <TypeValue data={DATA} {...props} />; }
