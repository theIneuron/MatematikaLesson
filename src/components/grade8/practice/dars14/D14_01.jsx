// Dars14 · Amaliyot 01 — Belgilash · 🟢 · tag: rational_marked
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS12_14_AMALIYOT_SKELET.md §5 (14-dars, 1-pozitsiya)
//
// UCHTA RATSIONAL SONNING IKKITASI ATAYLAB «IRRATSIONALGA O'XSHAB» TURADI:
//   √49 — ildiz belgisi bor, lekin qiymati yetti (З36: har qanday ildizni
//         irratsional deb o'ylash);
//   1/3 — onli yozuvi cheksiz, lekin takrorlanuvchi bo'lagi bor (З35:
//         cheksizlikni irratsionallik belgisi deb olish).
// Uchinchisi — 0,25, ya'ni ochiq holat: yozuvi tugaydi.
// Uchta irratsional son esa oddiy: √2, √11, √30 — to'liq kvadrat emas.
//
// Darsning ta'rifi bo'yicha son ratsional bo'lsa, uni KASR ko'rinishida
// yozish mumkin: yetti bu yetti bo'lingan bir, nol butun yigirma besh bu
// bir bo'lingan to'rt.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'rational_marked', level: '🟢',
  col: 150, itemSize: 20,
  items: [
    { id: 'i1', tokens: ['0,25'], hit: true },
    { id: 'i2', tokens: [{ r: '2' }] },
    { id: 'i3', tokens: [{ r: '49' }], hit: true },
    { id: 'i4', tokens: [{ r: '11' }] },
    { id: 'i5', tokens: [{ n: '1', d: '3' }], hit: true },
    { id: 'i6', tokens: [{ r: '30' }] },
  ],
  eyebrow: L('Belgilash', 'Отметить', 'Mark'),
  // MATN QISQA: o'lchov 2026-08-24 (grade8-practice-panel.mjs) — telefonda RU
  // razborining oxiri 88px panel ostida qolardi, ya'ni ekranda ko'rinmasdi.
  // Setup ham, razbor ham qisqartirildi; tafsilot `wrongs` da qoldi.
  setup: L(
    "Oltita son. Ratsional son — kasr ko'rinishida yozilishi mumkin bo'lgan son. Ildiz belgisining o'zi hech narsani hal qilmaydi.",
    'Шесть чисел. Рациональное число — то, которое можно записать дробью. Сам знак корня ничего не решает.',
    'Six numbers. A rational number is one that can be written as a fraction. The root sign alone decides nothing.'),
  ask: L(
    'Ratsional bo\'lgan 3 ta sonni belgilang.',
    'Отметь 3 числа, которые рациональны.',
    'Mark the 3 numbers that are rational.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Nol butun yigirma besh bu bir bo'lingan to'rt. Qirq to'qqizdan ildiz yetti — ildiz belgisi sonni irratsional qilmaydi. Bir uchdan ning yozuvi cheksiz, lekin uchlar takrorlanadi.",
    'Верно. Нуль целых двадцать пять сотых это одна четвёртая. Корень из сорока девяти равен семи — знак корня иррациональным не делает. У одной третьей запись бесконечна, но тройки повторяются.',
    'Correct. Zero point two five is one over four. The root of forty nine is seven — a root sign does not make a number irrational. One third has an endless record, but the threes repeat.'),
  wrongs: [
    { when: (s) => s.miss.indexOf('i3') !== -1, text: L(
      "Qirq to'qqizdan ildiz chetlab o'tildi, lekin uning qiymati yetti: yetti karra yetti qirq to'qqiz. Yetti esa butun son, ya'ni yetti bo'lingan bir kasri. Ildiz belgisi sonni irratsional qilmaydi — irratsional qiladigan narsa ildiz ostidagi son to'liq kvadrat EMASLIGI.",
      'Корень из сорока девяти остался в стороне, а его значение семь: семь на семь сорок девять. Семь — целое число, дробь семь на один. Иррациональным число делает то, что подкоренное НЕ полный квадрат.',
      'The root of forty nine was left out, but its value is seven: seven times seven is forty nine. Seven is a whole number, that is the fraction seven over one. A root sign does not make a number irrational — what does is the radicand NOT being a perfect square.') },
    { when: (s) => s.miss.indexOf('i5') !== -1, text: L(
      "Bir uchdan chetlab o'tildi. Uning onli yozuvi haqiqatan cheksiz: nol butun uch uch uch va shu kabi. Lekin cheksizlik o'zi belgi emas — takrorlanuvchi bo'lak bor, va eng muhimi, son KASR ko'rinishida yozilgan, ta'rif esa aynan shuni talab qiladi.",
      'Одна третья осталась в стороне. Её десятичная запись действительно бесконечна: нуль целых три три три и так далее. Но бесконечность сама по себе не признак — есть повторяющаяся часть, и главное, число записано ДРОБЬЮ, а определение требует именно этого.',
      'One third was left out. Its decimal record really is endless: zero point three three three and so on. But endlessness alone is not the mark — there is a repeating part, and above all the number is written as a FRACTION, which is exactly what the definition asks for.') },
    { when: (s) => s.extra.indexOf('i2') !== -1 || s.extra.indexOf('i4') !== -1 || s.extra.indexOf('i6') !== -1, text: L(
      "Belgilangan sonlardan biri irratsional. Ildiz ostidagi sonni tekshiring: ikki, o'n bir va o'ttiz to'liq kvadrat emas — birdan ildiz bir, to'rtdan ildiz ikki, ya'ni ikkidan ildiz bir va ikki orasida turadi va butun emas. Bunday sonni kasr ko'rinishida yozib bo'lmaydi.",
      'Одно из отмеченных чисел иррационально. Проверь подкоренное: два, одиннадцать и тридцать не полные квадраты — корень из одного один, из четырёх два, значит корень из двух лежит между одним и двумя и не целый. Такое число дробью не записать.',
      'One of the marked numbers is irrational. Check the radicand: two, eleven and thirty are not perfect squares — the root of one is one, of four is two, so the root of two lies between one and two and is not whole. Such a number cannot be written as a fraction.') },
    { when: (s) => s.marked.length !== 3, text: L(
      "Aynan uchta son kerak. Har birida bitta savol bering: bu sonni kasr ko'rinishida yozish mumkinmi? Ildizni avval hisoblab ko'ring — javob butun chiqsa, kasr topilgan.",
      'Нужно ровно три числа. С каждым задай один вопрос: можно ли записать это число дробью? Корень сначала посчитай — если вышло целое, дробь найдена.',
      'Exactly three numbers are needed. Ask one question of each: can this number be written as a fraction? Compute the root first — if it comes out whole, the fraction is found.') },
  ],
  wrongText: L(
    "Ildiz belgisiga qaramang, ildiz OSTIDAGI songa qarang: to'liq kvadrat bo'lsa ildiz butun chiqadi va son ratsional. Kasrning cheksiz yozuvi ham hech narsani buzmaydi.",
    'Смотри не на знак корня, а на число ПОД корнем: полный квадрат — корень выйдет целым и число рационально. Бесконечная запись дроби тоже ничего не портит.',
    'Look not at the root sign but at the number UNDER it: a perfect square gives a whole root and a rational number. An endless decimal record spoils nothing either.'),
};

export default function D14_01(props) { return <MarkAll data={DATA} {...props} />; }
