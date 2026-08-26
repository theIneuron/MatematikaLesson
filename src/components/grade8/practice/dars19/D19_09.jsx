// Dars19 · Amaliyot 09 — Ishoralar · 🔴 · tag: same_or_different_sign
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §7 (19-dars, 9-pozitsiya)
//
// ILDIZLARNING ISHORASINI KO'PAYTMA HAL QILADI, ya'ni q. q musbat bo'lsa
// ildizlar bir xil ishorada (ikkalasi musbat yoki ikkalasi manfiy), manfiy
// bo'lsa har xil. p ning ishorasi esa QAYSI ishora ekanini aytadi, lekin
// «bir xilmi yoki har xilmi» degan savolga javob bermaydi — shuning uchun u
// bu topshiriqda chalg'ituvchi.
//
// `x² − 4x + 4` KARTASI T3 UCHUN: ildizlar teng (ikki va ikki), va ular ham
// bir xil ishorada. Viyet teng ildizlarda ham ishlaydi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'same_or_different_sign', level: '🔴',
  zoneSize: 14, itemSize: 14,
  zones: [
    { id: 'z1', label: L('BIR XIL ISHORA', 'ОДИНАКОВЫЕ ЗНАКИ', 'SAME SIGN') },
    { id: 'z2', label: L('HAR XIL ISHORA', 'РАЗНЫЕ ЗНАКИ', 'DIFFERENT SIGNS') },
  ],
  items: [
    { id: 'i1', tokens: ['x² − 7x + 12 = 0'], zone: 'z1' },
    { id: 'i2', tokens: ['x² − x − 12 = 0'], zone: 'z2' },
    { id: 'i3', tokens: ['x² + 7x + 12 = 0'], zone: 'z1' },
    { id: 'i4', tokens: ['x² + x − 12 = 0'], zone: 'z2' },
    { id: 'i5', tokens: ['x² − 4x + 4 = 0'], zone: 'z1' },
    { id: 'i6', tokens: ['x² − 6x − 7 = 0'], zone: 'z2' },
    { id: 'i7', tokens: ['x² + 8x + 7 = 0'], zone: 'z1' },
    { id: 'i8', tokens: ['x² + 6x − 7 = 0'], zone: 'z2' },
  ],
  eyebrow: L('Ishoralar', 'Знаки', 'Signs'),
  setup: L(
    "Ildizlarni topmasdan ham ularning ishorasi haqida gapirish mumkin. Buni bitta koeffitsiyent hal qiladi — qaysi biri?",
    'О знаках корней можно говорить, не находя сами корни. Это решает один коэффициент — какой?',
    'You can speak about the signs of the roots without finding them. One coefficient decides it — which one?'),
  ask: L(
    "Tenglamani bosing, keyin guruhini bosing.",
    'Нажми уравнение, потом его группу.',
    'Tap an equation, then its group.'),
  bank: L('Tenglamalar', 'Уравнения', 'Equations'),
  correctText: L(
    "To'g'ri. Ishorani KO'PAYTMA hal qiladi, ya'ni ozod had. q musbat bo'lsa ikki ildizning ko'paytmasi musbat — bu faqat ishoralari bir xil bo'lganda mumkin. q manfiy bo'lsa ko'paytma manfiy, demak ishoralar har xil. p esa faqat qaysi ishora ekanini aytadi: birinchi kartada ildizlar uch va to'rt, uchinchisida minus uch va minus to'rt — ikkalasida ham q arti o'n ikki.",
    'Верно. Знак решает ПРОИЗВЕДЕНИЕ, то есть свободный член. Если q положительно, произведение двух корней положительно — а это возможно только при одинаковых знаках. Если q отрицательно, произведение отрицательно, значит знаки разные. А p говорит лишь о том, какой это знак: в первой карточке корни три и четыре, в третьей минус три и минус четыре — и там, и там q плюс двенадцать.',
    'Correct. The PRODUCT decides the signs, that is the constant term. If q is positive the product of the two roots is positive — possible only when their signs match. If q is negative the product is negative, so the signs differ. p only says which sign it is: the first card has roots three and four, the third minus three and minus four — both with q plus twelve.'),
  wrongs: [
    { when: (s) => s.place.i3 === 'z2' || s.place.i7 === 'z2', text: L(
      "Bu tenglamada p musbat, lekin savol p haqida emas. Ozod hadga qarang: arti o'n ikki yoki arti yetti — MUSBAT, demak ko'paytma musbat va ishoralar bir xil. Ildizlar minus uch va minus to'rt: ikkalasi manfiy, ya'ni bir xil ishorada.",
      'В этом уравнении p положительно, но вопрос не про p. Смотри на свободный член: плюс двенадцать или плюс семь — ПОЛОЖИТЕЛЬНЫЙ, значит произведение положительно и знаки одинаковы. Корни минус три и минус четыре: оба отрицательны, то есть одного знака.',
      'In this equation p is positive, but the question is not about p. Look at the constant term: plus twelve or plus seven — POSITIVE, so the product is positive and the signs match. The roots are minus three and minus four: both negative, hence the same sign.') },
    { when: (s) => s.place.i2 === 'z1' || s.place.i4 === 'z1' || s.place.i6 === 'z1' || s.place.i8 === 'z1', text: L(
      "Bu tenglamada ozod had MANFIY, demak ildizlarning ko'paytmasi manfiy. Manfiy ko'paytma faqat bitta ildiz musbat, ikkinchisi manfiy bo'lganda chiqadi. Misol: minus o'n ikki bu to'rt karra minus uch, ildizlar to'rt va minus uch.",
      'В этом уравнении свободный член ОТРИЦАТЕЛЬНЫЙ, значит произведение корней отрицательно. Отрицательное произведение бывает только когда один корень положителен, а другой отрицателен. Пример: минус двенадцать это четыре на минус три, корни четыре и минус три.',
      'In this equation the constant term is NEGATIVE, so the product of the roots is negative. A negative product happens only when one root is positive and the other negative. Example: minus twelve is four times minus three, roots four and minus three.') },
    { when: (s) => s.place.i5 === 'z2', text: L(
      "Bu tenglamada ildizlar TENG: ikki va ikki, chunki ko'paytma to'rt va yig'indi to'rt. Teng ildizlar albatta bir xil ishorada. Viyet teoremasi teng ildizlarda ham ishlaydi: ikki qo'shuv ikki to'rt, ikki karra ikki to'rt.",
      'В этом уравнении корни РАВНЫ: два и два, ведь произведение четыре и сумма четыре. Равные корни, конечно, одного знака. Теорема Виета работает и при равных корнях: два плюс два четыре, два на два четыре.',
      'In this equation the roots are EQUAL: two and two, since the product is four and the sum is four. Equal roots share a sign, of course. Vieta\'s theorem holds for equal roots as well: two plus two is four, two times two is four.') },
    { when: (s) => s.bad.length >= 4, text: L(
      "Har tenglamada bitta joyga qarang: ozod hadning ishorasi. Musbat — bir xil ishora, manfiy — har xil. Ikkinchi koeffitsiyent bu savolga javob bermaydi.",
      'В каждом уравнении смотри в одно место: знак свободного члена. Положительный — знаки одинаковы, отрицательный — разные. Второй коэффициент на этот вопрос не отвечает.',
      'Look at one place in every equation: the sign of the constant term. Positive means the same sign, negative means different. The second coefficient does not answer this question.') },
  ],
  wrongText: L(
    "Ozod hadning ISHORASIGA qarang: u ko'paytmani beradi. Musbat ko'paytma — ishoralar bir xil, manfiy — har xil. Ikkinchi koeffitsiyent chalg'ituvchi.",
    'Смотри на ЗНАК свободного члена: он даёт произведение. Положительное произведение — знаки одинаковы, отрицательное — разные. Второй коэффициент отвлекает.',
    'Look at the SIGN of the constant term: it gives the product. A positive product means matching signs, a negative one means differing signs. The second coefficient is a distraction.'),
};

export default function D19_09(props) { return <Zones data={DATA} {...props} />; }
