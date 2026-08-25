// Dars09 · Amaliyot 05 — Chegaralar · 🟡 · tag: between_which
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §7 (9-dars, 5-pozitsiya)
//
// Darsning uchinchi tasdig'i: butun chiqmagan ildiz ikki butun son orasida
// turadi. Variantlar SO'Z emas, TENGSIZLIK — o'quvchi javobni aytmaydi, uni
// yozuv bilan ko'rsatadi.
// Uch xato variant: chegarani bir qadam pastga, bir qadam yuqoriga surish va
// ildiz ostini ikkiga bo'lish (yigirma yetti bilan yigirma sakkiz).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const R = { r: '54' };

const DATA = {
  tag: 'between_which', level: '🟡',
  correct: 0, optCols: 2, optSize: 17,
  expr: [R], exprSize: 32,
  eyebrow: L('Chegaralar', 'Границы', 'Bounds'),
  setup: L(
    "Ellik to'rt to'liq kvadrat emas, demak ildizi butun chiqmaydi. Uni ikki butun son orasiga qo'yish kerak.",
    'Пятьдесят четыре не полный квадрат, значит корень не будет целым. Его надо поместить между двумя целыми.',
    'Fifty four is not a perfect square, so its root will not be whole. It has to be placed between two integers.'),
  ask: L('Qaysi tengsizlik to\'g\'ri?', 'Какое неравенство верно?', 'Which inequality is true?'),
  opts: [
    { label: ['7 <', R, '< 8'] },
    { label: ['6 <', R, '< 7'] },
    { label: ['8 <', R, '< 9'] },
    { label: ['26 <', R, '< 28'] },
  ],
  correctText: L(
    "To'g'ri. Kvadratlarni sanaymiz: yetti karra yetti qirq to'qqiz, sakkiz karra sakkiz oltmish to'rt. Ellik to'rt qirq to'qqizdan katta, oltmish to'rtdan kichik — demak ildizi yetti bilan sakkiz orasida. Yaqinroq qarasa, ellik to'rt qirq to'qqizga yaqinroq, ya'ni ildiz yettiga yaqin.",
    'Верно. Считаем квадраты: семь на семь сорок девять, восемь на восемь шестьдесят четыре. Пятьдесят четыре больше сорока девяти и меньше шестидесяти четырёх — значит корень между семью и восемью. Если приглядеться, пятьдесят четыре ближе к сорока девяти, то есть корень ближе к семи.',
    'Correct. Count the squares: seven times seven is forty nine, eight times eight is sixty four. Fifty four is more than forty nine and less than sixty four, so the root lies between seven and eight. Looking closer, fifty four is nearer to forty nine, so the root is nearer to seven.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Chegarani bir qadam pastga surdingiz. Yettining kvadratini sanang: qirq to'qqiz, va u ellik to'rtdan KICHIK — demak ildiz yettidan katta. Chegara ellik to'rtni ushlab turishi kerak.",
      'Ты сдвинул границу на шаг вниз. Посчитай квадрат семи: сорок девять, и он МЕНЬШЕ пятидесяти четырёх — значит корень больше семи. Границы должны удерживать пятьдесят четыре.',
      'You moved the bound one step down. Count the square of seven: forty nine, and it is LESS than fifty four, so the root is more than seven. The bounds must hold fifty four between them.') },
    { when: (s) => s.picked === 2, text: L(
      "Chegarani bir qadam yuqoriga surdingiz. Sakkizning kvadratini sanang: oltmish to'rt, va u ellik to'rtdan KATTA — demak ildiz sakkizdan kichik.",
      'Ты сдвинул границу на шаг вверх. Посчитай квадрат восьми: шестьдесят четыре, и он БОЛЬШЕ пятидесяти четырёх — значит корень меньше восьми.',
      'You moved the bound one step up. Count the square of eight: sixty four, and it is MORE than fifty four, so the root is less than eight.') },
    { when: (s) => s.picked === 3, text: L(
      "Bu chegaralar ellik to'rtning yarmi atrofida turadi, ildiz esa bo'lish emas. Yigirma yettining kvadratini sanang: yetti yuz yigirma to'qqiz — ellik to'rtdan o'n uch barobar katta.",
      'Эти границы стоят около половины пятидесяти четырёх, а корень это не деление. Посчитай квадрат двадцати семи: семьсот двадцать девять — в тринадцать раз больше пятидесяти четырёх.',
      'Those bounds sit around half of fifty four, and a root is not division. Count the square of twenty seven: seven hundred twenty nine, thirteen times more than fifty four.') },
  ],
  wrongText: L(
    "Butun sonlarni kvadratga oshirib ellik to'rtga yaqinlashing: qaysi ikki kvadrat orasida qoladi? Ularning asoslari chegara bo'ladi.",
    'Возводи целые числа в квадрат, приближаясь к пятидесяти четырём: между какими двумя квадратами оно окажется? Их основания и есть границы.',
    'Square whole numbers as you approach fifty four: between which two squares does it fall? Their bases are the bounds.'),
};

export default function D09_05(props) { return <Choice data={DATA} {...props} />; }
