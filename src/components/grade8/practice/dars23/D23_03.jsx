// Dars23 · Amaliyot 03 — Musbat ayirma · 🟢 · tag: positive_difference
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §5 (23-dars, 3-pozitsiya)
//
// З49 SOF HOLDA. Oltita ayirma uch juftlikdan iborat, va har juftlikda
// AYNI O'SHA ikki son, faqat tartibi almashgan:
//   7 − 4      va  4 − 7
//   −2 − (−5)  va  −5 − (−2)
//   0,3 − 0,25 va  0,25 − 0,3
// Ya'ni ayirmaning tartibi natijaning ishorasini almashtiradi, va shu
// bilan birga taqqoslashning xulosasini ham.
//
// Ikkinchi juftlik alohida qiyin: ikkala son ham manfiy, va manfiy sonni
// ayirish qo'shishga aylanadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'positive_difference', level: '🟢',
  col: 158, itemSize: 16,
  items: [
    { id: 'i1', tokens: ['7 − 4'], hit: true },
    { id: 'i2', tokens: ['4 − 7'] },
    { id: 'i3', tokens: ['−2 − (−5)'], hit: true },
    { id: 'i4', tokens: ['−5 − (−2)'] },
    { id: 'i5', tokens: ['0,3 − 0,25'], hit: true },
    { id: 'i6', tokens: ['0,25 − 0,3'] },
  ],
  eyebrow: L('Musbat ayirma', 'Положительная разность', 'Positive difference'),
  setup: L(
    "Oltita ayirma uch juftlikdan iborat: har juftlikda o'sha ikki son, faqat tartibi boshqa.",
    'Шесть разностей составляют три пары: в каждой те же два числа, только порядок другой.',
    'The six differences form three pairs: each pair holds the same two numbers in a different order.'),
  ask: L(
    'Qiymati MUSBAT bo\'lgan 3 ta ayirmani belgilang.',
    'Отметь 3 разности, значение которых ПОЛОЖИТЕЛЬНО.',
    'Mark the 3 differences whose value is POSITIVE.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Uchala musbat ayirmada birinchi son kattaroq. Manfiy sonni ayirish qo'shishga aylanadi: minus ikki qo'shuv besh uch. Tartib almashsa, ishora ham almashadi.",
    'Верно. Во всех трёх положительных разностях первое число больше. Вычитание отрицательного превращается в сложение: минус два плюс пять три. Сменится порядок — сменится знак.',
    'Correct. In all three positive differences the first number is greater. Subtracting a negative turns into addition: minus two plus five is three. Swap the order and the sign swaps.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('i4') !== -1, text: L(
        "Bu ayirmada minus besh BIRINCHI turibdi: minus besh qo'shuv ikki minus uch. Demak minus besh minus ikkidan kichik.",
        'Здесь минус пять стоит ПЕРВЫМ: минус пять плюс два это минус три. Значит минус пять меньше минус двух.',
        'Here minus five comes FIRST: minus five plus two is minus three. So minus five is smaller than minus two.') },
    { when: (s) => s.extra.indexOf('i2') !== -1, text: L(
      "Bu ayirmada to'rt birinchi turibdi: to'rt minus yetti minus uch. Manfiy son, ya'ni to'rt yettidan kichik. O'sha ikki son bilan boshqa tartibdagi ayirma musbat chiqadi — tartib hal qiladi.",
      'В этой разности четыре стоит первым: четыре минус семь минус три. Число отрицательное, то есть четыре меньше семи. Разность из тех же чисел в другом порядке выйдет положительной — решает порядок.',
      'In this difference four comes first: four minus seven is minus three. A negative number, so four is smaller than seven. The difference of the same numbers in the other order comes out positive — the order decides.') },
    { when: (s) => s.extra.indexOf('i6') !== -1, text: L(
      "Bu ayirmada nol butun yigirma besh birinchi turibdi, va u nol butun uchdan kichik: yigirma besh yuzdan o'ttiz yuzdandan kichik. Natija minus nol butun nol besh, ya'ni manfiy.",
      'В этой разности первым стоит ноль целых двадцать пять, и оно меньше ноля целых трёх: двадцать пять сотых меньше тридцати сотых. Результат минус ноль целых ноль пять, то есть отрицательный.',
      'In this difference zero point two five comes first, and it is smaller than zero point three: twenty five hundredths is less than thirty hundredths. The result is minus zero point zero five, that is negative.') },
    { when: (s) => s.miss.indexOf('i3') !== -1, text: L(
      "Bu ayirma chetlab o'tildi, lekin uning qiymati MUSBAT. Manfiy sonni ayirish qo'shishga aylanadi: minus ikki minus minus besh bu minus ikki qo'shuv besh, ya'ni uch. Ikkala son manfiy bo'lsa ham, minus ikki minus beshdan katta — u son o'qida o'ngroqda turadi.",
      'Эта разность осталась в стороне, а её значение ПОЛОЖИТЕЛЬНО. Вычитание отрицательного превращается в сложение: минус два минус минус пять это минус два плюс пять, то есть три. Хотя оба числа отрицательны, минус два больше минус пяти — на числовой прямой он правее.',
      'This difference was left out, yet its value is POSITIVE. Subtracting a negative turns into addition: minus two minus minus five is minus two plus five, that is three. Although both numbers are negative, minus two is greater than minus five — it lies further right on the number line.') },
    { when: (s) => s.marked.length !== 3, text: L(
      "Aynan uchta ayirma kerak. Har biri bilan bitta ish qiling: hisoblang va natijaning ishorasiga qarang. Manfiy sonni ayirishda ishorani ikki marta o'zgartirishni unutmang.",
      'Нужно ровно три разности. С каждой делай одно: вычисли и посмотри на знак результата. При вычитании отрицательного не забудь про двойную смену знака.',
      'Exactly three differences are needed. Do one thing with each: compute it and look at the sign of the result. When subtracting a negative, remember the double sign change.') },
  ],
  wrongText: L(
    "Har ayirmani hisoblang va ishorasiga qarang. Ayirmaning tartibi ishorani almashtiradi. Manfiy sonni ayirish esa qo'shishga aylanadi.",
    'Вычисли каждую разность и посмотри на знак. Порядок в разности меняет знак. А вычитание отрицательного превращается в сложение.',
    'Compute each difference and look at the sign. Swapping the order flips the sign. And subtracting a negative turns into addition.'),
};

export default function D23_03(props) { return <MarkAll data={DATA} {...props} />; }
