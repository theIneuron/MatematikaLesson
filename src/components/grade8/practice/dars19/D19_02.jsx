// Dars19 · Amaliyot 02 — Yig'indi · 🟢 · tag: sum_of_roots
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §7 (19-dars, 2-pozitsiya)
//
// З45 IKKINCHI TOPSHIRIQDA. Yig'indi MINUS p ga teng, p ning o'ziga emas.
// Bu yerda p minus o'n bir, demak yig'indi arti o'n bir. Ildizlarni topish
// shart emas — teorema ularsiz javob beradi.
//
// Uchta xato javob uchta yo'l:
//   −11 — З45: p ni to'g'ridan-to'g'ri ko'chirish, ishora almashtirilmagan;
//   24  — yig'indi o'rniga KO'PAYTMA yozildi (q ning o'zi);
//   13  — yozuvdagi ikki sonni ayirish (yigirma to'rt minus o'n bir), ya'ni
//         teoremaga umuman murojaat qilmaslik. `35` ham shu turdan: o'sha ikki
//         sonni qo'shish.
// Ildizlar uch va sakkiz: yig'indi o'n bir, ko'paytma yigirma to'rt — razbor
// ikkisini ham ko'rsatadi.
// `TypeValue` faqat butun son oladi, javob esa butun — 11.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'sum_of_roots', level: '🟢',
  target: 11, allowNeg: true,
  expr: ['x² − 11x + 24 = 0'], exprSize: 28,
  eyebrow: L("Yig'indi", 'Сумма', 'Sum'),
  setup: L(
    "Viyet teoremasi ildizlarni topmasdan javob beradi: yig'indi ikkinchi koeffitsiyentning teskarisiga teng.",
    'Теорема Виета даёт ответ, не находя корней: сумма равна второму коэффициенту с противоположным знаком.',
    'Vieta\'s theorem answers without finding the roots: the sum equals the second coefficient with the opposite sign.'),
  label: L("ildizlar yig'indisi", 'сумма корней', 'the sum of the roots'),
  ask: L(
    "Ildizlarning yig'indisi nimaga teng?",
    'Чему равна сумма корней?',
    'What does the sum of the roots equal?'),
  correctText: L(
    "To'g'ri. Bu keltirilgan tenglama, p minus o'n birga teng. Yig'indi minus p ga teng, ya'ni arti o'n bir. Tekshirish: ildizlarni topsak uch va sakkiz chiqadi — uch qo'shuv sakkiz o'n bir, uch karra sakkiz yigirma to'rt, ya'ni ko'paytma ham q ga to'g'ri keladi. Ildizlarni topmasdan ham javob bir qarashda ko'rinadi.",
    'Верно. Это приведённое уравнение, p равно минус одиннадцати. Сумма равна минус p, то есть плюс одиннадцати. Проверка: если найти корни, выйдут три и восемь — три плюс восемь одиннадцать, три на восемь двадцать четыре, значит и произведение совпало с q. Ответ виден сразу, даже не находя корней.',
    'Correct. This is a reduced equation with p equal to minus eleven. The sum equals minus p, that is plus eleven. Check: finding the roots gives three and eight — three plus eight is eleven, three times eight is twenty four, so the product matches q as well. The answer is visible at a glance, without finding the roots.'),
  wrongs: [
    { when: (s) => s.value === -11, text: L(
      "Ishora almashtirilmagan. Teoremada yig'indi MINUS p ga teng, p esa bu tenglamada minus o'n bir — demak yig'indi arti o'n bir. Tekshirish: ildizlar uch va sakkiz, ikkalasi ham musbat, shuning uchun yig'indi manfiy bo'lolmaydi.",
      'Знак не изменён. В теореме сумма равна МИНУС p, а p в этом уравнении минус одиннадцать — значит сумма плюс одиннадцать. Проверка: корни три и восемь, оба положительные, поэтому сумма отрицательной быть не может.',
      'The sign was not flipped. In the theorem the sum equals MINUS p, and p here is minus eleven — so the sum is plus eleven. Check: the roots are three and eight, both positive, so their sum cannot be negative.') },
    { when: (s) => s.value === 24, text: L(
      "Yigirma to'rt — ildizlarning KO'PAYTMASI, yig'indisi emas. Teoremada ikki formula bor: yig'indi minus p ga, ko'paytma esa q ga teng. Bu yerda q yigirma to'rt, p minus o'n bir. Ildizlar uch va sakkiz: yig'indi o'n bir, ko'paytma yigirma to'rt.",
      'Двадцать четыре — это ПРОИЗВЕДЕНИЕ корней, а не сумма. В теореме две формулы: сумма равна минус p, произведение равно q. Здесь q двадцать четыре, p минус одиннадцать. Корни три и восемь: сумма одиннадцать, произведение двадцать четыре.',
      'Twenty four is the PRODUCT of the roots, not the sum. The theorem has two formulas: the sum equals minus p, the product equals q. Here q is twenty four and p is minus eleven. The roots are three and eight: sum eleven, product twenty four.') },
    { when: (s) => s.value === 13 || s.value === 35, text: L(
      "Bu son yozuvdagi ikki sondan yasalgan, lekin teoremadan chiqmagan. Yig'indi faqat ikkinchi koeffitsiyentga bog'liq: minus p, ya'ni arti o'n bir. Ozod had esa ko'paytmani beradi.",
      'Это число составлено из двух чисел записи, но из теоремы не выходит. Сумма зависит только от второго коэффициента: минус p, то есть плюс одиннадцать. А свободный член даёт произведение.',
      'That number was assembled from the two numbers in the record but does not follow from the theorem. The sum depends only on the second coefficient: minus p, that is plus eleven. The constant term gives the product.') },
  ],
  wrongText: L(
    "Ikkinchi koeffitsiyentni ishorasi bilan o'qing va TESKARISINI oling — bu yig'indi. Ozod had esa ko'paytmani beradi, ishorasi o'zgarmaydi.",
    'Прочти второй коэффициент со знаком и возьми ПРОТИВОПОЛОЖНОЕ — это сумма. А свободный член даёт произведение, и знак у него не меняется.',
    'Read the second coefficient with its sign and take the OPPOSITE — that is the sum. The constant term gives the product, with its sign unchanged.'),
};

export default function D19_02(props) { return <TypeValue data={DATA} {...props} />; }
