// Dars01 · Amaliyot 10 — So'zlar · 🔴 · teg: rule_words
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> ClozeBank.
// Kontent: src/books/grade9/DARS01_AMALIYOT_KONTENT.md §10
//
// METODIST QARORI 2026-08-26 (ikkinchi): moslashtirish o'rniga NAZARIY
// QOIDA beriladi va tushib qolgan so'zlar joyiga qo'yiladi. Mexanika
// 8-sinf amaliyotidan olinadi (`ClozeBank`), nusxa yozilmaydi.
//
// QOIDA DARSNING UCHALA TASDIG'INI ham o'z ichiga oladi (`Dars01.jsx`
// dagi `STATEMENTS`): bitta qiymat, aniqlanish sohasi argumentniki,
// formula ma'noga ega bo'lgan joy. Uchta bo'shliq — uchta tasdiq.
//
// MUHIM: bu yerda kartalar SO'Z, ya'ni `L()` ICHIDA — matematika emas.
// `parts` uch tilda bir xil shaklda: matn, uya, matn, uya, matn, uya, matn.
// Shu sababli bo'shliqlarning tartibi UZ, RU va EN da mos tushadi.
//
// BANKDA UCHTA TUZOQ, har biri aniq bir adashishga tegadi:
//   «ikkita»  — ta'rifning o'zi buziladi (bitta x dan ikkita strelka);
//   «qiymat»  — soha argumentniki emas, qiymatlarniki deb o'ylanadi;
//   «nolga»   — formula nolga teng bo'lgan joyda aniqlangan deb o'ylanadi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🔴',
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Darsning qoidasi yozilgan, lekin uchta so'z tushib qolgan. Ularni pastdagi kartalardan qo'ying.",
    'Правило урока записано, но три слова выпали. Поставь их из карточек снизу.',
    'The rule of the lesson is written down, but three words fell out. Put them back from the cards below.'),
  ask: L(
    "Kartani bosing, keyin bo'sh kartochkani bosing.",
    'Нажми карточку, потом пустую клетку.',
    'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  parts: [
    { text: L(
      'Argumentning har bir qiymatiga funksiyaning aynan',
      'Каждому значению аргумента отвечает ровно',
      'Each value of the argument gets exactly') },
    { slot: 0 },
    { text: L(
      'qiymati mos keladi. Aniqlanish sohasi —',
      'значение функции. Область определения — это все значения, которые может принимать',
      'value of the function. The domain is every value that the') },
    { slot: 1 },
    { text: L(
      "qabul qilishi mumkin bo'lgan barcha qiymatlar. Formula bilan berilgan funksiya formula",
      '. Функция, заданная формулой, определена там, где формула',
      'may take. A function given by a formula is defined where the formula') },
    { slot: 2 },
    { text: L(
      "ega bo'lgan joyda aniqlangan.",
      '.',
      '.') },
  ],
  cards: [
    { id: 'w1', label: L('bitta', 'одно', 'one') },
    { id: 'w2', label: L('argument', 'аргумент', 'argument') },
    { id: 'w3', label: L("ma'noga", 'имеет смысл', 'makes sense') },
    { id: 'w4', label: L('ikkita', 'два', 'two') },
    { id: 'w5', label: L('qiymat', 'значение', 'value') },
    { id: 'w6', label: L('nolga', 'равна нулю', 'equals zero') },
  ],
  answer: ['w1', 'w2', 'w3'],
  correctText: L(
    "To'g'ri, uchala so'z ham joyida. Qoidaning uchta gapi darsning uchta ishini yopadi: birinchisi funksiyani mosliklardan ajratadi, ikkinchisi sohaning argumentniki ekanini aytadi, uchinchisi esa sohani qayerdan izlashni ko'rsatadi — formula hisoblanadigan joydan.",
    'Верно, все три слова на месте. Три предложения правила закрывают три дела урока: первое отделяет функцию от прочих соответствий, второе говорит, что область определения — про аргумент, а третье показывает, где её искать: там, где формула считается.',
    'Correct, all three words are in place. The three sentences of the rule cover the three jobs of the lesson: the first separates a function from other correspondences, the second says the domain is about the argument, and the third shows where to look for it — where the formula computes.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w4', text: L(
      "Ikkita qiymat bo'lsa, bu funksiya bo'lmasdi. Bitta x dan ikkita strelka chiqadigan taxtani eslang: u ta'rifni buzardi.",
      'Если бы значений было два, это не была бы функция. Вспомни доску, где из одного x выходили две стрелки: она нарушала определение.',
      'If there were two values, it would not be a function. Remember the board where two arrows left one x: it broke the definition.') },
    { when: (s) => s.slots[1] === 'w5', text: L(
      "Aniqlanish sohasi qiymatlar to'plami emas. U argument qabul qilishi mumkin bo'lgan sonlar haqida: grafikda bu gorizontal o'q.",
      'Область определения — не множество значений. Она про числа, которые может принимать аргумент: на графике это горизонтальная ось.',
      'The domain is not the set of values. It is about the numbers the argument may take: on a graph that is the horizontal axis.') },
    { when: (s) => s.slots[2] === 'w6', text: L(
      "Formula nolga teng bo'lgan joyda emas, hisoblanadigan joyda aniqlangan. Nol — bu ham qiymat, u sohani kesmaydi; sohani nolga BO'LISH kesadi.",
      'Функция определена не там, где формула равна нулю, а там, где формула вообще считается. Нуль — это тоже значение, он область не вырезает; вырезает деление на нуль.',
      'The function is defined not where the formula equals zero but where the formula computes at all. Zero is a value too, it does not cut the domain; division by zero does.') },
    { when: (s) => s.slots[0] === 'w2' || s.slots[1] === 'w1', text: L(
      "Ikki so'z joyini almashtirdi. Birinchi bo'shliqda NECHTA qiymat borligi, ikkinchisida esa soha KIMNIKI ekani aytiladi.",
      'Два слова поменялись местами. В первой клетке говорится, СКОЛЬКО значений, во второй — ЧЬЯ это область.',
      'Two words swapped places. The first blank says HOW MANY values there are, the second says WHOSE domain it is.') },
  ],
  wrongText: L(
    "Har bo'shliqni gapning o'zi bilan tekshiring: birinchisi nechta qiymat borligini, ikkinchisi soha kimniki ekanini, uchinchisi esa funksiya qayerda aniqlanganini aytadi.",
    'Проверяй каждую клетку самим предложением: первое говорит, сколько значений, второе — чья это область, третье — где функция определена.',
    'Check each blank against the sentence itself: the first says how many values, the second whose domain it is, the third where the function is defined.'),
};

export default function D01_10(props) { return <ClozeBank data={DATA} {...props} />; }
