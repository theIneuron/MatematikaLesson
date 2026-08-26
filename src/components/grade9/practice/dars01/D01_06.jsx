// Dars01 · Amaliyot 06 — Taqiq · 🟡 · teg: both_bans
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> TypeSet.
// Kontent: src/books/grade9/DARS01_AMALIYOT_KONTENT.md §06
//
// Javob IKKITA son, va shu darsning metodik nuqtasi shunda: maxraj
// ko'paytma bo'lganda taqiq bitta emas. Umumiy qatlamdagi `TypeValue`
// faqat bitta butun son o'qiydi, shuning uchun bu yerda `TypeSet`.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { TypeSet } from '../asboblar9.jsx';

const DATA = {
  tag: 'both_bans', level: '🟡',
  eyebrow: L('Taqiq', 'Запрет', 'Ban'),
  setup: L(
    "Funksiya aniqlanmagan sonlar maxrajdan chiqadi.",
    'Числа, при которых функция не определена, ищут в знаменателе.',
    'The numbers where the function is undefined come from the denominator.'),
  ask: L(
    "Funksiya qaysi x larda aniqlanmagan? Hammasini yozing.",
    'При каких x функция не определена? Выпиши все.',
    'At which x is the function undefined? Write them all.'),
  hint: L(
    "Bir nechta son bo'lsa, ularni nuqta-vergul bilan ajrating.",
    'Если чисел несколько, раздели их точкой с запятой.',
    'If there is more than one number, separate them with a semicolon.'),
  placeholder: '0; 0',
  expr: ['y =', { n: '8', d: 'x² − 7x' }],
  answer: [0, 7],
  correctText: L(
    "To'g'ri, ikkita son. Maxrajdan iksni qavsdan chiqarsak, iks ko'paytiruv iks minus yetti hosil bo'ladi. Ko'paytma nolga aylanishi uchun bitta ko'paytuvchining nol bo'lishi kifoya, shuning uchun taqiq ikkita.",
    'Верно, два числа. Если вынести икс за скобку, знаменатель станет икс умножить на икс минус семь. Чтобы произведение обратилось в нуль, достаточно одного нулевого множителя, поэтому запретов два.',
    'Correct, two numbers. Taking x out as a factor turns the denominator into x times x minus seven. A product becomes zero as soon as one factor is zero, so there are two bans.'),
  wrongs: [
    { when: (s) => s.size === 2 && s.has(7) && s.has(-7), text: L(
      "Maxraj iks kvadrat minus qirq to'qqiz emas, iks kvadrat minus yetti iks. Ikkinchi hadda ham iks bor, shuning uchun uni qavsdan chiqarish mumkin.",
      'Знаменатель не икс в квадрате минус сорок девять, а икс в квадрате минус семь икс. Во втором слагаемом тоже есть икс, поэтому его можно вынести.',
      'The denominator is not x squared minus forty-nine, it is x squared minus seven x. The second term has an x as well, so it can be taken out.') },
    { when: (s) => s.size === 1 && s.has(7), text: L(
      "Bitta son topildi, ikkinchisi qoldi. Maxrajdan iksni qavsdan chiqaring: ikkita ko'paytuvchi hosil bo'ladi va ularning har biri alohida nolga aylanishi mumkin.",
      'Одно число найдено, второе осталось. Вынеси икс за скобку: получатся два множителя, и каждый может обратиться в нуль отдельно.',
      'One number found, the other left behind. Take x out as a factor: two factors appear, and each can become zero on its own.') },
    { when: (s) => s.size === 1 && s.has(0), text: L(
      "Ikkinchi ko'paytuvchi qaysi sonda nolga aylanadi? Iks minus yettini nolga tenglashtiring.",
      'При каком числе обращается в нуль второй множитель? Приравняй икс минус семь к нулю.',
      'At which number does the second factor become zero? Set x minus seven equal to zero.') },
    { when: (s) => s.has(-7), text: L(
      'Belgi teskari olindi. Iks minus yetti nolga teng bo\'lsa, iks nimaga teng?',
      'Знак взят наоборот. Если икс минус семь равно нулю, чему равен икс?',
      'The sign was taken the other way. If x minus seven equals zero, what does x equal?') },
    { when: (s) => s.has(8), text: L(
      "Sakkiz — surat. Surat qiymatni nolga aylantirishi mumkin, lekin qiymatni yo'qota olmaydi.",
      'Восемь — числитель. Числитель может обратить значение в нуль, но не может его убрать.',
      'Eight is the numerator. A numerator can make the value zero, but it cannot remove the value.') },
    { when: (s) => s.has(49), text: L(
      "Qirq to'qqiz bu yozuvda umuman yo'q. Maxrajni yana bir marta o'qing.",
      'Сорока девяти в этой записи нет вовсе. Перечитай знаменатель.',
      'There is no forty-nine in this record at all. Read the denominator again.') },
  ],
  wrongText: L(
    "Topgan har bir soningizni maxrajga qo'ying. Nol chiqdimi? Chiqmagan bo'lsa, u son taqiq emas.",
    'Подставь каждое найденное число в знаменатель. Получился нуль? Если нет, это число не запрет.',
    'Put each number you found into the denominator. Did you get zero? If not, that number is not a ban.'),
};

export default function D01_06(props) { return <TypeSet data={DATA} {...props} />; }
