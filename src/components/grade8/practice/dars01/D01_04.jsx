// Dars01 · Amaliyot 04 — Suratdagi nol · 🟡 · teg: zero_numerator
// Faqat MA'LUMOT. Tip: `practice/kit.jsx` -> Input (kind number) + tugma.
//
// TASDIQ 3: suratdagi nol — qiymat nol, maxrajdagi nol — qiymat yo'q.
// ADASHISH Z18: suratdagi nol va maxrajdagi nol aralashtiriladi.
//
// «Qiymat yo'q» tugmasi ATAYLAB turadi va u NOTO'G'RI javob. Aynan shu
// yerda Z18 ko'rinadi: x = 9 da nol CHIZIQ USTIDA paydo bo'ladi, maxraj esa
// 13 ga teng — kasr hisoblanadi va noldir.
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { E, F, Input, L } from '../kit.jsx'

const DATA = {
  tag: 'zero_numerator',
  level: '🟡',
  kind: 'number',
  answer: '0',
  eyebrow: L('Nol qayerda', 'Где нуль', 'Where the zero is'),
  setup: L(
    "Nol yozuvni har xil buzadi. Chiziq ostidagi nol kasrni yo'q qiladi, chiziq ustidagi nol esa uni shunchaki nolga aylantiradi. Qaysi biri shu yerda ro'y beradi?",
    'Нуль ломает запись по-разному. Нуль под чертой уничтожает дробь, нуль над чертой просто обращает её в нуль. Что из этого происходит здесь?',
    'A zero breaks a record in different ways. Below the bar it destroys the fraction; above the bar it merely turns it into zero. Which of the two happens here?',
  ),
  expr: <E>{F('x − 9', 'x + 4')}</E>,
  ask: L('x = 9 bo\'lganda kasrning qiymati qancha?', 'Чему равно значение дроби при x = 9?', 'What is the value of the fraction at x = 9?'),
  label: L('qiymat', 'значение', 'value'),
  none: true,
  noneRight: false,
  noneLabel: L("Qiymat yo'q", 'Значения нет', 'No value'),
  noneWrong: L(
    "Nol CHIZIQ USTIDA paydo bo'ldi, ostida emas. Qiymat yo'q deyish faqat maxraj nolga aylanganda mumkin, bu yerda esa maxraj 9 + 4, ya'ni 13. Nolni 13 ga bo'lish mumkin: 0 : 13 = 0.",
    'Нуль появился НАД чертой, а не под ней. Сказать «значения нет» можно только когда в нуль обращается знаменатель, а здесь знаменатель это 9 + 4, то есть 13. Нуль на 13 делить можно: 0 : 13 = 0.',
    'The zero appeared ABOVE the bar, not below it. Saying there is no value is only right when the denominator becomes zero, and here the denominator is 9 + 4, that is 13. Zero divided by 13 is allowed: 0 : 13 = 0.',
  ),
  hints: {
    '13': L(
      "13 — bu maxraj, kasrning qiymati emas. Suratda 9 − 9, ya'ni nol turadi, va 0 : 13 = 0.",
      '13 — это знаменатель, а не значение дроби. В числителе 9 − 9, то есть нуль, и 0 : 13 = 0.',
      '13 is the denominator, not the value of the fraction. The numerator is 9 − 9, that is zero, and 0 : 13 = 0.',
    ),
    '9': L(
      "To'qqiz — bu x ning qiymati. Kasrning qiymatini topish uchun to'qqizni ikki joyga QO'YIB, keyin bo'lish kerak.",
      'Девять — это значение x. Чтобы получить значение дроби, девятку надо ПОДСТАВИТЬ в оба места и потом разделить.',
      'Nine is the value of x. To get the value of the fraction, SUBSTITUTE the nine in both places and then divide.',
    ),
  },
  correctText: L(
    "To'g'ri. Surat 9 − 9 = 0, maxraj 9 + 4 = 13, ya'ni kasr 0 : 13 = 0. Bu kasrning qiymati yo'q bo'ladigan yagona joy — x = −4: unda maxraj nolga aylanadi.",
    'Верно. Числитель 9 − 9 = 0, знаменатель 9 + 4 = 13, значит дробь равна 0 : 13 = 0. Единственное место, где у этой дроби значения нет, это x = −4: там в нуль обращается знаменатель.',
    'Correct. The numerator is 9 − 9 = 0, the denominator is 9 + 4 = 13, so the fraction equals 0 : 13 = 0. The only place this fraction has no value is x = −4, where the denominator becomes zero.',
  ),
  wrongText: L(
    "Ikki joyga ham to'qqizni qo'ying: alohida suratni, alohida maxrajni hisoblang. Keyin biri ikkinchisiga bo'linadi.",
    'Подставь девятку в оба места: посчитай отдельно числитель и отдельно знаменатель. Потом одно делится на другое.',
    'Substitute the nine in both places: compute the numerator and the denominator separately. Then one divides by the other.',
  ),
}

export default function D01_04(props) { return <Input data={DATA} {...props} /> }
