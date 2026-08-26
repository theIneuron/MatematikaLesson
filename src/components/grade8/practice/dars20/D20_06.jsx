// Dars20 · Amaliyot 06 — Yechish · 🟡 · tag: solve_frac
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §8 (20-dars, 6-pozitsiya)
//
// ODDIY KASR-RATSIONAL TENGLAMA, lekin javob ikki qadamda topiladi:
// maxrajga ko'paytirib x qo'shuv bir to'rtga teng, keyin bir ayirilib x uch
// bo'ladi. Eng ko'p uchraydigan xato — birinchi qadamda TO'XTASH: to'rt deb
// yozib qo'yish.
//
// Javob taqiqqa tushmaydi: taqiq minus birda, javob esa uchda — shuning uchun
// bu topshiriqda begona ildiz yo'q. Begona ildiz 07 va 09 da.
// `TypeValue` faqat butun son oladi, javob esa butun — 3.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'solve_frac', level: '🟡',
  target: 3, allowNeg: true,
  expr: [{ n: '12', d: 'x + 1' }, '= 3'], exprSize: 28,
  eyebrow: L('Yechish', 'Решение', 'Solve'),
  setup: L(
    "Avval ruhsat etilgan qiymatlarni yozib olish kerak, keyin maxrajga ko'paytirish. Javobni oxirida shart bilan solishtirish shart.",
    'Сначала надо выписать допустимые значения, потом умножить на знаменатель. В конце ответ обязательно сверяется с условием.',
    'First write down the admissible values, then multiply by the denominator. At the end the answer must be checked against the condition.'),
  label: L('x ning qiymati', 'значение x', 'the value of x'),
  ask: L('Tenglamani yeching: x nimaga teng?', 'Решь уравнение: чему равен x?', 'Solve the equation: what does x equal?'),
  correctText: L(
    "To'g'ri. Shart: x minus birga teng bo'lmasligi kerak. Maxrajga ko'paytiramiz: o'n ikki uch karra x qo'shuv birga teng, ya'ni x qo'shuv bir to'rtga teng. Bittani ayiramiz: x uchga teng. Uch minus birga teng emas, demak shart bajarilgan va javob haqiqiy. Tekshirish: uch qo'shuv bir to'rt, o'n ikki bo'lingan to'rt uch.",
    'Верно. Условие: x не равен минус одному. Умножаем на знаменатель: двенадцать равно три на скобку x плюс один, то есть x плюс один равно четырём. Вычитаем единицу: x равен трём. Три не равно минус одному, значит условие выполнено и ответ настоящий. Проверка: три плюс один четыре, двенадцать делить на четыре три.',
    'Correct. The condition: x must not equal minus one. Multiply by the denominator: twelve equals three times the bracket x plus one, so x plus one equals four. Subtract one: x is three. Three is not minus one, so the condition holds and the answer is genuine. Check: three plus one is four, twelve over four is three.'),
  wrongs: [
    { when: (s) => s.value === 4, text: L(
      "To'rt — bu MAXRAJNING qiymati, x ning o'zi emas. O'n ikkini uchga bo'lsangiz to'rt chiqadi, lekin to'rtga teng bo'lgan narsa x qo'shuv bir. Bittani ayirish qoldi: x uchga teng. To'rtni qo'yib tekshiring: to'rt qo'shuv bir besh, o'n ikki bo'lingan besh esa uchga teng emas.",
      'Четыре — это значение ЗНАМЕНАТЕЛЯ, а не самого x. Двенадцать разделить на три даёт четыре, но четырём равно x плюс один. Осталось вычесть единицу: x равен трём. Подставь четыре и проверь: четыре плюс один пять, а двенадцать делить на пять не равно трём.',
      'Four is the value of the DENOMINATOR, not of x. Twelve over three is four, but what equals four is x plus one. One subtraction remains: x is three. Substitute four and check: four plus one is five, and twelve over five is not three.') },
    { when: (s) => s.value === 35 || s.value === 36, text: L(
      "Bu ko'paytirishdan chiqqan son, lekin maxrajga ko'paytirish TENGLAMANING IKKI TOMONIGA tegishli. O'ng tomonda uch turadi, va u x qo'shuv birga ko'paytiriladi: o'n ikki uch karra x qo'shuv birga teng. Shundan x qo'shuv bir to'rt, x uch.",
      'Это число из умножения, но умножение на знаменатель относится к ОБЕИМ частям уравнения. Справа стоит три, и оно умножается на x плюс один: двенадцать равно три на скобку x плюс один. Отсюда x плюс один четыре, x три.',
      'That number came from multiplying, but multiplying by the denominator applies to BOTH sides. The right side is three and it gets multiplied by x plus one: twelve equals three times the bracket x plus one. Hence x plus one is four and x is three.') },
    { when: (s) => s.value === -5 || s.value === 11, text: L(
      "Bu son ikki qadamning birini o'tkazib yuborishdan chiqadi. To'g'ri yo'l: maxrajga ko'paytirish, keyin bittani ayirish. O'n ikki bo'lingan uch to'rt, to'rt minus bir uch. Javobni qo'yib tekshiring: uch qo'shuv bir to'rt, o'n ikki bo'lingan to'rt uch.",
      'Это число выходит, если пропустить один из двух шагов. Верный путь: умножить на знаменатель, потом вычесть единицу. Двенадцать делить на три четыре, четыре минус один три. Проверь ответ подстановкой: три плюс один четыре, двенадцать делить на четыре три.',
      'That number comes from skipping one of the two steps. The right route: multiply by the denominator, then subtract one. Twelve over three is four, four minus one is three. Check by substituting: three plus one is four, twelve over four is three.') },
  ],
  wrongText: L(
    "Maxrajga ko'paytirib x qo'shuv birni toping, keyin bittani ayiring. Javobni tenglamaga qo'yib tekshiring va shart bilan solishtiring.",
    'Умножь на знаменатель, найди x плюс один, потом вычти единицу. Ответ подставь в уравнение и сверь с условием.',
    'Multiply by the denominator to find x plus one, then subtract one. Substitute the answer back and compare it with the condition.'),
};

export default function D20_06(props) { return <TypeValue data={DATA} {...props} />; }
