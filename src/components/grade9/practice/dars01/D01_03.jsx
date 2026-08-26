// Dars01 · Amaliyot 03 — Ha yoki yo'q · 🟢 · teg: graph_claims
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> TrueFalse,
// grafik esa `asboblar9.jsx` -> FuncGraph (`Given` ning `fig` sloti orqali).
// Kontent: src/books/grade9/DARS01_AMALIYOT_KONTENT.md §03
//
// UCHTA hukm (metodist, 2026-08-26: «3 ta qator berilsin, 4 ta emas»).
// Har biri boshqa narsani tekshiradi: ta'rifni (s1), grafikni rasm deb
// o'qishni (s2) va «bitta qiymat ikki xil argumentda» ruxsat etilganini (s3).
//
// OLIB TASHLANGANI: «x = 8 da funksiya aniqlangan» hukmi. U aniqlanish
// sohasining chegarasini (T2) tekshirardi, lekin T2 ni 07 va 10-topshiriqlar
// ham yopadi. Qolgan uchtasi esa yagona: s2 dan boshqa joyda `grafik-rasm`
// tekshirilmaydi, s1 bilan s3 esa juft bo'lib ishlaydi — shart argumentga
// qo'yiladi, teskarisiga emas.
//
// FUNKSIYA: aniqlanish sohasi [0; 6], eng yuqori nuqta (3; 7), chetlari
// (0; 1) va (6; 1). y = 4 chizig'i grafikni IKKI joyda kesadi — s3 shu
// yerdan chiqadi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, TrueFalse } from '../../../grade8/practice/kit.jsx';
import { FuncGraph } from '../asboblar9.jsx';

const F = (x) => 1 + 6 * (1 - ((x - 3) / 3) * ((x - 3) / 3));

const DATA = {
  tag: 'graph_claims', level: '🟢',
  eyebrow: L('Ha yoki yo\'q', 'Да или нет', 'Yes or no'),
  setup: L(
    "Grafikda y = f(x) chizilgan, aniqlanish sohasi 0 dan 6 gacha.",
    'На графике построена y = f(x), область определения от 0 до 6.',
    'The graph shows y = f(x), the domain runs from 0 to 6.'),
  ask: L(
    "Har bir mulohaza uchun «Ha» yoki «Yo'q» ni tanlang.",
    'Для каждого суждения выбери «Да» или «Нет».',
    'Choose "Yes" or "No" for each claim.'),
  fig: <FuncGraph f={F} domain={[0, 6]} plane={{ x0: -1, x1: 7, y0: -1, y1: 8 }} step={13} />,
  itemSize: 15,
  items: [
    { id: 's1', tokens: ['x → y'], yes: true, claim: L(
      "Har bir x ga aynan bitta y mos keladi.",
      'Каждому x отвечает ровно один y.',
      'Each x gets exactly one y.') },
    { id: 's2', tokens: ['(3; 7)'], yes: false, claim: L(
      "Grafikning eng yuqori nuqtasi funksiyaning eng katta argumentini ko'rsatadi.",
      'Самая высокая точка графика показывает наибольший аргумент функции.',
      'The highest point of the graph shows the largest argument of the function.') },
    { id: 's3', tokens: ['y = 4'], yes: true, claim: L(
      "qiymati ikki xil x da uchraydi.",
      'встречается при двух разных x.',
      'occurs at two different x.') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L('Yo\'q', 'Нет', 'No'),
  correctText: L(
    "To'g'ri, uchtasi ham. Grafikni ikki chiziq bilan o'qidingiz: tik chiziq bitta argumentga nechta qiymat borligini, gorizontal chiziq bitta qiymatga nechta argument borligini ko'rsatadi. Bu ikki savolning javobi bir xil bo'lishi shart emas.",
    'Верно, все три. Ты прочитал график двумя линиями: вертикальная показывает, сколько значений у одного аргумента, горизонтальная — сколько аргументов у одного значения. Ответы на эти два вопроса не обязаны совпадать.',
    'Correct, all three. You read the graph with two lines: the vertical one shows how many values one argument has, the horizontal one shows how many arguments one value has. The two answers need not agree.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Eng yuqori nuqta — uch va yetti. Ulardan qaysi biri argument? Argument gorizontal o'qdan o'qiladi, va bu funksiyada eng katta argument oltiga teng.",
      'Самая высокая точка — три и семь. Что из них аргумент? Аргумент читается с горизонтальной оси, и наибольший здесь равен шести.',
      'The highest point is three and seven. Which of them is the argument? The argument is read off the horizontal axis, and the largest one here equals six.') },
    { when: (s) => s.bad.indexOf('s3') !== -1, text: L(
      "Igrek to'rtga teng gorizontal chiziqni o'tkazing va u grafikni necha joyda kesishini sanang. Ta'rif bir xil qiymatning ikki marta uchrashini taqiqlamaydi.",
      'Проведи горизонтальную линию игрек равно четырём и посчитай, в скольких местах она пересекает график. Определение не запрещает одному значению встречаться дважды.',
      'Draw the horizontal line y equals four and count how many places it crosses the graph. The definition does not forbid one value from occurring twice.') },
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Grafikning istalgan nuqtasidan tik chiziq o'tkazing. U grafikni necha marta kesadi? Bitta x dan ikkita nuqta chiqqanda funksiya buzilgan bo'lardi.",
      'Проведи вертикальную линию через любую точку графика. Сколько раз она пересечёт график? Если бы из одного x выходили две точки, функция была бы нарушена.',
      'Draw a vertical line through any point of the graph. How many times does it cross the graph? If one x gave two points, the function would be broken.') },
  ],
  wrongText: L(
    "Ikki chiziq bilan tekshiring: tik chiziq — bitta argumentga nechta qiymat, gorizontal chiziq — bitta qiymatga nechta argument.",
    'Проверяй двумя линиями: вертикальная — сколько значений у одного аргумента, горизонтальная — сколько аргументов у одного значения.',
    'Check with two lines: vertical — how many values one argument has, horizontal — how many arguments one value has.'),
};

export default function D01_03(props) { return <TrueFalse data={DATA} {...props} />; }
