// Dars03 · Amaliyot 07 — O'q · 🟡 · teg: nol-vs-vershina
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> DomainAxis.
// Kontent: src/books/grade9/DARS03_AMALIYOT_KONTENT.md §07
//
// Nuqta BO'SH: x = 2 da qiymat nolga teng, nol esa musbat emas. Aynan shu
// yerda funksiyaning noli chegarani KESADI — `nol-vs-vershina` ning
// sonli tomoni.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { DomainAxis } from '../asboblar9.jsx';

const DATA = {
  tag: 'nol-vs-vershina', level: '🟡',
  eyebrow: L('O\'q', 'Ось', 'Axis'),
  setup: L(
    "O'qda uchta narsa ko'rsatiladi: chegara qayerda, u oraliqqa kiradimi va oraliq qaysi tomonga ketadi.",
    'На оси показывают три вещи: где граница, входит ли она в промежуток и в какую сторону промежуток идёт.',
    'The axis shows three things: where the boundary is, whether it belongs to the interval, and which way the interval runs.'),
  ask: L(
    "Funksiya qaysi x lardan boshlab musbat qiymat oladi? O'qda ko'rsating.",
    'Начиная с каких x функция принимает положительные значения? Отметь на оси.',
    'From which x on does the function take positive values? Mark it on the axis.'),
  expr: ['y = x² − 4'],
  axis: { from: -6, to: 6 },
  answer: { at: 2, closed: false, dir: 'right' },
  closedLabel: L('Bo\'yalgan', 'Закрашенная', 'Filled'),
  openLabel: L('Bo\'sh', 'Пустая', 'Hollow'),
  correctText: L(
    "To'g'ri. Chegara ikkida, nuqta bo'sh, oraliq o'ngga ketadi. Ikkida qiymat nolga teng, nol esa musbat emas — shuning uchun chegaraning o'zi oraliqqa kirmaydi. Undan o'ngda esa iks kvadrat to'rtdan katta bo'lib qoladi.",
    'Верно. Граница в двойке, точка пустая, промежуток идёт вправо. При двух значение равно нулю, а нуль не положителен — поэтому сама граница в промежуток не входит. Правее икс в квадрате становится больше четырёх.',
    'Correct. The boundary is at two, the point is hollow, the interval runs to the right. At two the value is zero, and zero is not positive — so the boundary itself does not belong. To the right of it x squared becomes greater than four.'),
  wrongs: [
    { when: (s) => s.atOk && !s.closedOk, text: L(
      "Ikkini formulaga qo'ying: to'rt minus to'rt, ya'ni nol. Nol musbat sonmi?",
      'Подставь двойку в формулу: четыре минус четыре, то есть нуль. Является ли нуль положительным числом?',
      'Put two into the formula: four minus four, that is zero. Is zero a positive number?') },
    { when: (s) => s.at === 4, text: L(
      "Chegara iks ning qiymati, iks kvadratniki emas. Iks kvadrat to'rtga teng bo'lsa, iks nimaga teng?",
      'Граница — это значение икс, а не икс в квадрате. Если икс в квадрате равен четырём, чему равен икс?',
      'The boundary is a value of x, not of x squared. If x squared equals four, what does x equal?') },
    { when: (s) => s.atOk && s.closedOk && !s.dirOk, text: L(
      "Uchni qo'yib ko'ring: to'qqiz minus to'rt, ya'ni besh — musbat. Uch chegaradan qaysi tomonda turibdi?",
      'Подставь тройку: девять минус четыре, то есть пять — положительно. С какой стороны от границы стоит тройка?',
      'Try three: nine minus four is five, which is positive. On which side of the boundary does three stand?') },
    { when: (s) => !s.atOk, text: L(
      "Chegarani qiymat nolga aylanadigan sondan qidiring: iks kvadrat to'rtga teng bo'lgan joydan.",
      'Ищи границу там, где значение обращается в нуль: где икс в квадрате равен четырём.',
      'Look for the boundary where the value becomes zero: where x squared equals four.') },
  ],
  wrongText: L(
    "Ikkita savol: qiymat qaysi sonda nolga aylanadi, va o'sha sonning o'zi javobga kiradimi?",
    'Два вопроса: при каком числе значение обращается в нуль и входит ли само это число в ответ?',
    'Two questions: at which number does the value become zero, and does that number itself belong to the answer?'),
};

export default function D03_07(props) { return <DomainAxis data={DATA} {...props} />; }
