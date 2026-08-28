// Dars11 · Amaliyot 05 — Javobni kiritish · 🟡 · teg: kasr-birlashtirish-xatosi
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> TypeSet.
//
// MATEMATIKA. 1/x + 1/y = (x + y)/xy — darsning uchinchi tasdig'i.
// (x + y)/xy = 7/12 va x + y = 7, demak 7/xy = 7/12, ya'ni xy = 12.
// Yig'indisi 7, ko'paytmasi 12 bo'lgan sonlar: 3 va 4 (Viyet teoremasi
// teskarisi, 9-darsdan).
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { TypeSet } from '../asboblar9.jsx';

const DATA = {
  tag: 'kasr-birlashtirish-xatosi', level: '🟡',
  eyebrow: L('Qiymatlar', 'Значения', 'Values'),
  setup: L(
    "Ikkinchi tenglamadagi ikkita kasrni bitta kasrga birlashtiring: surat — yig'indi, maxraj — ko'paytma.",
    'Объедини две дроби во втором уравнении в одну: числитель — сумма, знаменатель — произведение.',
    'Combine the two fractions in the second equation into one: the numerator is the sum, the denominator is the product.'),
  ask: L(
    "Iks va igrekning BARCHA qiymatlarini yozing.",
    'Запиши ВСЕ значения икса и игрека.',
    'Write down ALL values of x and y.'),
  hint: L(
    "Ikkitasini nuqta-vergul bilan ajrating.",
    'Раздели их точкой с запятой.',
    'Separate them with a semicolon.'),
  placeholder: '0; 0',
  givenLabel: L('Sistema', 'Система', 'System'),
  given: [['x + y = 7'], ['1/x + 1/y = 7/12']],
  answer: [3, 4],
  correctText: L(
    "To'g'ri: uch va to'rt. Ikki kasr birlashganda surat iks qo'shuv igrek, maxraj esa iks karra igrek bo'ladi. Surat allaqachon ma'lum — yettiga teng, demak yetti bo'lingan iks karra igrek yetti bo'lingan o'n ikkiga teng, ya'ni ko'paytma o'n ikki. Yig'indisi yetti, ko'paytmasi o'n ikki bo'lgan sonlar uch va to'rt. Sistema simmetrik, shuning uchun ikkala tartib ham javob.",
    'Верно: три и четыре. При объединении двух дробей числителем становится икс плюс игрек, а знаменателем икс на игрек. Числитель уже известен — он равен семи, значит семь делить на икс игрек равно семи двенадцатым, то есть произведение двенадцать. Числа с суммой семь и произведением двенадцать — три и четыре. Система симметрична, поэтому годятся оба порядка.',
    'Correct: three and four. Combining the two fractions makes the numerator x plus y and the denominator x times y. The numerator is already known — it is seven, so seven over xy equals seven twelfths, that is the product is twelve. The numbers with sum seven and product twelve are three and four. The system is symmetric, so either order works.'),
  wrongs: [
    { when: (s) => s.has(12), text: L(
      "O'n ikki — bu KO'PAYTMA, javobning o'zi emas. Yig'indisi yetti, ko'paytmasi o'n ikki bo'lgan ikkita sonni toping.",
      'Двенадцать — это ПРОИЗВЕДЕНИЕ, а не сам ответ. Найди два числа с суммой семь и произведением двенадцать.',
      'Twelve is the PRODUCT, not the answer itself. Find the two numbers with sum seven and product twelve.') },
    { when: (s) => s.has(7) && s.size <= 2, text: L(
      "Yetti — bu yig'indi, u shartda allaqachon berilgan. Bu yig'indi bilan ko'paytmadan ikkita sonning o'zini topish kerak.",
      'Семь — это сумма, она уже дана в условии. По этой сумме и произведению нужно найти сами два числа.',
      'Seven is the sum and it was given in the statement. From that sum and the product you must find the two numbers themselves.') },
    { when: (s) => s.size === 1, text: L(
      "Bitta son yozildi. Sistemaning javobi ikkita sondan iborat: iks va igrek.",
      'Записано одно число. Ответ системы состоит из двух чисел: икс и игрек.',
      'One number was written. The answer of the system consists of two numbers: x and y.') },
    { when: (s) => s.has(2) && s.has(5), text: L(
      "Yig'indisi yetti bo'lgan har qanday juftlik yaramaydi: ikkinchi shart ham bajarilishi kerak. Ikki karra besh o'n, o'n ikki emas.",
      'Не всякая пара с суммой семь подходит: должно выполняться и второе условие. Дважды пять — десять, а не двенадцать.',
      'Not every pair with sum seven will do: the second condition must hold too. Two times five is ten, not twelve.') },
    { when: (s) => s.has(84), text: L(
      "Maxrajlarni ko'paytirib yubordingiz. Ikkinchi tenglama yetti bo'lingan ko'paytma yetti bo'lingan o'n ikkiga teng deydi: ikkala kasrning surati bir xil, demak maxrajlari ham bir xil.",
      'Знаменатели перемножились. Второе уравнение говорит: семь делить на произведение равно семи двенадцатым; числители одинаковы, значит одинаковы и знаменатели.',
      'The denominators got multiplied together. The second equation says seven over the product equals seven twelfths; the numerators match, so the denominators match too.') },
  ],
  wrongText: L(
    "Ikki kasrni bitta qilib yozing: surat iks qo'shuv igrek, maxraj iks karra igrek. Suratga yettini qo'ying va ko'paytmani toping, keyin yig'indi bilan ko'paytmadan sonlarni chiqaring.",
    'Запиши две дроби как одну: числитель икс плюс игрек, знаменатель икс на игрек. Подставь в числитель семь, найди произведение, а потом по сумме и произведению — сами числа.',
    'Write the two fractions as one: numerator x plus y, denominator x times y. Put seven into the numerator, find the product, then get the numbers from the sum and the product.'),
};

export default function D11_05(props) { return <TypeSet data={DATA} {...props} />; }
