// Dars08 · Amaliyot 01 — Nechta son · 🟢 · tag: one_number
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §6 (8-dars, 1-pozitsiya)
//
// Darsning birinchi tasdig'i: arifmetik ildiz — BITTA nomanfiy son. Uch xato
// variant uch xil adashish:
//   ±6 — З29, ildiz belgisi ikki son beradi deb o'ylash;
//   −6 — kvadrati o'sha, lekin arifmetik ildiz manfiy bo'lmaydi;
//   18 — ildiz o'rniga ikkiga bo'lish.
// Ildiz USTKI CHIZIQ bilan (`frac.jsx` -> Root, metodist qarori 2026-08-24).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'one_number', level: '🟢',
  correct: 0, optCols: 2, optSize: 22,
  expr: [{ r: '36' }], exprSize: 34,
  eyebrow: L('Nechta son', 'Сколько чисел', 'How many numbers'),
  setup: L(
    "Ildiz belgisi ostida o'ttiz olti turadi. Kvadrati o'ttiz oltiga teng bo'lgan ikki son bor, ildiz belgisi esa bittasini tanlaydi.",
    'Под знаком корня стоит тридцать шесть. Чисел, чей квадрат равен тридцати шести, два, а знак корня выбирает одно.',
    'Thirty six stands under the root sign. There are two numbers whose square is thirty six, and the root sign picks one of them.'),
  ask: L('Bu yozuv nimaga teng?', 'Чему равна эта запись?', 'What does this record equal?'),
  opts: [
    { label: ['6'] },
    { label: ['±6'] },
    { label: ['−6'] },
    { label: ['18'] },
  ],
  correctText: L(
    "To'g'ri. Arifmetik ildiz — kvadrati ildiz ostidagi songa teng bo'lgan NOMANFIY son. Olti shu shartni bajaradi: olti karra olti o'ttiz olti va oltining o'zi manfiy emas. Minus olti ham kvadratga oshirilganda o'ttiz olti beradi, lekin u manfiy, shuning uchun ildiz belgisi uni tanlamaydi.",
    'Верно. Арифметический корень это НЕОТРИЦАТЕЛЬНОЕ число, квадрат которого равен подкоренному. Шесть подходит: шесть на шесть тридцать шесть, и само шесть не отрицательно. Минус шесть в квадрате тоже даёт тридцать шесть, но оно отрицательно, поэтому знак корня его не выбирает.',
    'Correct. An arithmetic root is the NON-NEGATIVE number whose square equals the radicand. Six fits: six times six is thirty six, and six itself is not negative. Minus six squared also gives thirty six, but it is negative, so the root sign does not pick it.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Ikki son — bu boshqa savolning javobi. x kvadrati o'ttiz oltiga teng tenglamaning ikki yechimi bor, ildiz BELGISI esa har doim bitta son beradi. Aks holda ikki ildizni qo'shib bo'lmas edi: qaysi qiymatni olardik?",
      'Два числа — ответ на другой вопрос. У уравнения x в квадрате равно тридцати шести два решения, а ЗНАК корня всегда даёт одно число. Иначе корни нельзя было бы складывать: какое значение брать?',
      'Two numbers answer a different question. The equation x squared equals thirty six has two solutions, while the root SIGN always gives one number. Otherwise roots could not be added: which value would you take?') },
    { when: (s) => s.picked === 2, text: L(
      "Kvadratga oshirsangiz haqiqatan o'ttiz olti chiqadi, lekin ta'rifda ikki shart bor: kvadrati ildiz ostiga teng bo'lsin VA sonning o'zi nomanfiy bo'lsin. Minus olti ikkinchi shartni bajarmaydi.",
      'В квадрате действительно выходит тридцать шесть, но в определении два условия: квадрат равен подкоренному И само число неотрицательно. Минус шесть не выполняет второе.',
      'Squared it does give thirty six, but the definition has two conditions: the square equals the radicand AND the number itself is non-negative. Minus six fails the second.') },
    { when: (s) => s.picked === 3, text: L(
      "O'n sakkiz — o'ttiz oltining yarmi, ildiz esa bo'lish emas. Tekshiring: o'n sakkiz karra o'n sakkiz uch yuz yigirma to'rt, o'ttiz olti emas.",
      'Восемнадцать — половина тридцати шести, а корень это не деление. Проверь: восемнадцать на восемнадцать — триста двадцать четыре, а не тридцать шесть.',
      'Eighteen is half of thirty six, and a root is not division. Check: eighteen times eighteen is three hundred twenty four, not thirty six.') },
  ],
  wrongText: L(
    "Har variantni kvadratga oshirib ko'ring: o'ttiz olti chiqishi kerak. Keyin ikkinchi shartni tekshiring — son manfiy bo'lmasin.",
    'Возведи каждый вариант в квадрат: должно выйти тридцать шесть. Потом проверь второе условие — число не должно быть отрицательным.',
    'Square every option: thirty six must come out. Then check the second condition — the number must not be negative.'),
};

export default function D08_01(props) { return <Choice data={DATA} {...props} />; }
