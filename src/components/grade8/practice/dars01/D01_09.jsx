// Dars01 · Amaliyot 09 — Birinchi noto'g'ri satr · 🔴 · teg: first_wrong_line
// Faqat MA'LUMOT. Tip: `practice/kit.jsx` -> AuditRows.
//
// Har satr TO'G'RIDEK ko'rinadi, javob esa noto'g'ri. Izlanadigan narsa —
// BIRINCHI noto'g'ri satr, har qanday emas.
//
// Yechim 7/(x · x − 5x) uchun:
//   1  x · x − 5x = 0        to'g'ri
//   2  x(x − 5) = 0          to'g'ri
//   3  x − 5 = 0             BIRINCHI XATO: x ko'paytuvchisi tashlab ketildi
//   4  x = 5                 3-satrdan to'g'ri chiqadi
//   5  x ≠ 5                 4-satrdan to'g'ri chiqadi
//
// Kontrprimer 0 bo'lishi kerak: yechim NOLNI ruxsat etib qo'ydi, holbuki
// maxraj nolda ham nolga aylanadi. Beshni kontrprimer sifatida qabul
// qilmaydi (`proof.but`): beshni yechimning o'zi taqiqlagan.
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { AuditRows, E, F, L } from '../kit.jsx'

const DATA = {
  tag: 'first_wrong_line',
  level: '🔴',
  eyebrow: L('Tayyor yechim', 'Готовое решение', 'A ready solution'),
  setup: L(
    "Bu yechimning javobi to'liq emas. Har satr o'zidan oldingisidan kelib chiqadi, ya'ni bitta joyda ip uzilgan. Uzilgan joyni topib, buzilishni SON bilan ko'rsatish kerak.",
    'Ответ этого решения неполный. Каждая строка следует из предыдущей, значит нить оборвана в одном месте. Найди это место и покажи поломку ЧИСЛОМ.',
    'The answer of this solution is incomplete. Each line follows from the one above, so the thread breaks at a single place. Find it and show the break with a NUMBER.',
  ),
  expr: <E>{F('7', 'x · x − 5x')}</E>,
  rows: [
    { id: 'r1', show: 'x · x − 5x = 0' },
    { id: 'r2', show: 'x (x − 5) = 0' },
    { id: 'r3', show: 'x − 5 = 0' },
    { id: 'r4', show: 'x = 5' },
    { id: 'r5', show: 'x ≠ 5' },
  ],
  answerId: 'r3',
  ask: L(
    "Satrni bosing, keyin buzilishni ko'rsatadigan sonni yozing.",
    'Нажми строку, потом впиши число, на котором она ломается.',
    'Tap the line, then type the number where it breaks.',
  ),
  proof: {
    of: '7/(x*x - 5*x)',
    varName: 'x',
    but: [5],
    label: L('son', 'число', 'number'),
  },
  hints: {
    r1: L(
      "Birinchi satr to'g'ri: shartni topish uchun maxraj aynan nolga tenglashtiriladi.",
      'Первая строка верна: чтобы найти условие, знаменатель как раз и приравнивают к нулю.',
      'The first line is right: to find the condition the denominator is indeed set to zero.',
    ),
    r2: L(
      "Ikkinchi satr ham to'g'ri: x qavsdan tashqariga chiqarilgan. Tekshirib ko'ring, x(x − 5) yoyilsa x · x − 5x chiqadi.",
      'Вторая строка тоже верна: x вынесен за скобку. Проверь: если раскрыть x(x − 5), выйдет x · x − 5x.',
      'The second line is right too: x was factored out. Check it — expanding x(x − 5) gives x · x − 5x.',
    ),
    r4: L(
      "To'rtinchi satr uchinchisidan to'g'ri chiqadi: x − 5 = 0 dan x = 5. Xato undan OLDIN qilingan.",
      'Четвёртая строка следует из третьей верно: из x − 5 = 0 выходит x = 5. Ошибка сделана РАНЬШЕ.',
      'The fourth line follows from the third correctly: x − 5 = 0 gives x = 5. The error was made EARLIER.',
    ),
    r5: L(
      "Beshinchi satr to'rtinchisini taqiqqa aylantiradi va buni to'g'ri qiladi. Xato yuqorida.",
      'Пятая строка превращает четвёртую в запрет, и делает это верно. Ошибка выше.',
      'The fifth line turns the fourth into a restriction, and does so correctly. The error is higher up.',
    ),
  },
  proofWrong: L(
    "Satr to'g'ri topildi. Endi son kerak: yechim RUXSAT ETGAN, lekin maxrajni nolga aylantiradigan qiymat.",
    'Строка найдена верно. Теперь нужно число: значение, которое решение РАЗРЕШИЛО, а знаменатель при нём обращается в нуль.',
    'The line is found. Now the number: a value the solution ALLOWED where the denominator still becomes zero.',
  ),
  correctText: L(
    "To'g'ri. 3-satrda x ko'paytuvchisi tashlab ketilgan: ko'paytma x = 0 da ham nolga aylanadi. x = 0 da maxraj 0 · (−5) = 0, ya'ni javob: x ≠ 0 va x ≠ 5.",
    'Верно. В строке 3 отброшен множитель x: произведение обращается в нуль и при x = 0. При x = 0 знаменатель равен 0 · (−5) = 0, значит ответ: x ≠ 0 и x ≠ 5.',
    'Correct. Line 3 dropped the factor x: the product vanishes at x = 0 too. At x = 0 the denominator is 0 · (−5) = 0, so the answer is x ≠ 0 and x ≠ 5.',
  ),
  wrongText: L(
    "Har satrni yuqoridagisidan kelib chiqadimi deb tekshiring. Ko'paytma nolga aylanishi uchun BITTA ko'paytuvchi nol bo'lishi kifoya.",
    'Проверяй каждую строку: следует ли она из строки выше. Чтобы произведение стало нулём, достаточно, чтобы нулём стал ОДИН множитель.',
    'Check each line against the one above it. For a product to be zero it is enough that ONE factor is zero.',
  ),
}

export default function D01_09(props) { return <AuditRows data={DATA} {...props} /> }
