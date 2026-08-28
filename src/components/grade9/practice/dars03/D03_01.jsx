// Dars03 · Amaliyot 01 — Ha yoki yo'q · 🟢 · teg: tenglama-vs-funksiya
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> TrueFalse.
// Kontent: src/books/grade9/DARS03_AMALIYOT_KONTENT.md §01
//
// Uchta hukm bitta yozuv haqida: birinchisi ta'rifni tasdiqlaydi,
// ikkinchisi funksiyani TENGLAMADAN ajratadi, uchinchisi a ≠ 0 shartini
// tekshiradi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, TrueFalse } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'tenglama-vs-funksiya', level: '🟢',
  eyebrow: L('Ha yoki yo\'q', 'Да или нет', 'Yes or no'),
  setup: L(
    'Bitta yozuv berilgan, uch mulohaza esa uning haqida.',
    'Дана одна запись, а три суждения — про неё.',
    'One record is given, and three claims are about it.'),
  ask: L(
    "Har bir mulohaza uchun «Ha» yoki «Yo'q» ni tanlang.",
    'Для каждого суждения выбери «Да» или «Нет».',
    'Choose "Yes" or "No" for each claim.'),
  givenLabel: L('Berilgan', 'Дано', 'Given'),
  given: [['y = 3x² − 12']],
  itemSize: 16,
  items: [
    { id: 's1', tokens: ['y = 3x² − 12'], yes: true, claim: L(
      'bu yozuv kvadrat funksiya.',
      'эта запись — квадратичная функция.',
      'this record is a quadratic function.') },
    { id: 's2', tokens: ['3x² − 12 = 0'], yes: false, claim: L(
      'bu yozuv ham kvadrat funksiya.',
      'эта запись тоже квадратичная функция.',
      'this record is a quadratic function too.') },
    { id: 's3', tokens: ['a = 0'], yes: false, claim: L(
      "bo'lganda ham funksiya kvadrat bo'lib qolaveradi.",
      'даже при этом функция останется квадратичной.',
      'even then the function stays quadratic.') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L('Yo\'q', 'Нет', 'No'),
  correctText: L(
    "To'g'ri, uchtasi ham. Funksiyada har bir iks ga igrek mos keladi, tenglamada esa igrek yo'q: u faqat ma'lum iks larda bajariladi. Ikkinchisi birinchisidan chiqadi — tenglama funksiyaning nollarini topayotganda paydo bo'ladi. a nolga teng bo'lsa esa iks kvadrat butunlay yo'qoladi va chiziqli funksiya qoladi.",
    'Верно, все три. У функции каждому икс отвечает игрек, а в уравнении игрека нет: оно выполняется лишь при некоторых икс. Второе получается из первого — уравнение появляется, когда ищут нули функции. А если a равно нулю, икс в квадрате исчезает совсем и остаётся линейная функция.',
    'Correct, all three. A function gives a y for every x, while an equation has no y: it holds only at particular x. The second comes out of the first — an equation appears when the zeros of the function are being found. And if a is zero, x squared disappears altogether and a linear function is left.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Bu yozuvda igrek yo'q. Tenglama faqat ayrim iks larda bajariladi, funksiya esa har bir iks ga qiymat beradi.",
      'В этой записи нет игрека. Уравнение выполняется лишь при отдельных икс, а функция даёт значение при каждом икс.',
      'This record has no y. An equation holds only at particular x, while a function gives a value at every x.') },
    { when: (s) => s.bad.indexOf('s3') !== -1, text: L(
      "a ni nolga tenglashtiring va yozuvni qaytadan o'qing: iks kvadrat qoladimi? Uchni nolga ko'paytiring.",
      'Приравняй a к нулю и перечитай запись: останется ли икс в квадрате? Умножь тройку на нуль.',
      'Set a to zero and read the record again: is x squared still there? Multiply the three by zero.') },
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Yozuvda iks kvadrat bor, uning oldidagi son nolga teng emas. Kvadrat funksiyaning ta'rifi shundan boshqa narsa talab qilmaydi.",
      'В записи есть икс в квадрате, и число перед ним не равно нулю. Больше определение квадратичной функции ничего не требует.',
      'The record has x squared and the number in front of it is not zero. The definition of a quadratic function asks for nothing more.') },
  ],
  wrongText: L(
    "Ikkita savol bering: yozuvda igrek bormi, va iks kvadrat oldidagi son nolga teng emasmi?",
    'Задай два вопроса: есть ли в записи игрек и не равно ли нулю число перед икс в квадрате?',
    'Ask two questions: does the record have a y, and is the number in front of x squared non-zero?'),
};

export default function D03_01(props) { return <TrueFalse data={DATA} {...props} />; }
