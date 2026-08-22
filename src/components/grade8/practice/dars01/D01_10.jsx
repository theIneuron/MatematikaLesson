// Dars01 · Amaliyot 10 — Taqiq bormi · 🔴 · teg: no_forbidden
// Faqat MA'LUMOT. Tip: `practice/kit.jsx` -> Input (kind odz) + tugma.
//
// Amaliyotning eng qiyin topshirig'i va u SHU YERDA turadi: o'quvchi to'qqiz
// marta taqiq izladi, o'ninchida esa taqiq YO'Q. Javob «hech narsa yo'q»
// bo'lgani uchun tugma bilan beriladi — va shu tugma HAMMA ODZ
// topshirig'ida turgan edi (5, 7 va 10), aks holda uni PAYDO BO'LGANI uchun
// bosilardi.
//
// x · x hech qachon manfiy bo'lmaydi, ya'ni x · x + 16 hech qachon 16 dan
// kichik emas — nol bo'lishi mumkin emas. Kasr hamma joyda hisoblanadi,
// lekin ifoda kasr ifoda bo'lib qoladi: chiziq ostida harf turadi.
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { E, F, Input, L } from '../kit.jsx'

const DATA = {
  tag: 'no_forbidden',
  level: '🔴',
  kind: 'odz',
  varName: 'x',
  excluded: [],
  eyebrow: L('Taqiq bormi', 'Есть ли запрет', 'Is there a restriction'),
  setup: L(
    "Chiziq ostida harf turadi, ya'ni bu kasr ifoda. Lekin maxrajning nolini har doim topib bo'lmaydi: uni izlash kerak, borligini oldindan aytib bo'lmaydi.",
    'Под чертой стоит буква, значит запись дробная. Но нуль знаменателя находится не всегда: его надо искать, а не считать заранее существующим.',
    'A letter stands below the bar, so the record is fractional. But a zero of the denominator is not always there: it must be looked for, not assumed.',
  ),
  expr: <E>{F('8', 'x · x + 16')}</E>,
  ask: L('Qaysi qiymatlar taqiqlangan?', 'Какие значения запрещены?', 'Which values are forbidden?'),
  label: L('shart', 'условие', 'condition'),
  none: true,
  noneRight: true,
  noneLabel: L("Taqiqlangan qiymat yo'q", 'Запрещённых значений нет', 'No forbidden values'),
  hints: {
    'x != -16': L(
      "Minus o'n oltida x · x = 256 bo'ladi, maxraj esa 272. Nolga aylanishi uchun x · x = −16 kerak edi, bunday x esa yo'q.",
      'При минус шестнадцати x · x = 256, а знаменатель равен 272. Чтобы получился нуль, нужно было бы x · x = −16, а такого x нет.',
      'At minus sixteen x · x = 256 and the denominator is 272. A zero would need x · x = −16, and no such x exists.',
    ),
    'x != 16': L(
      "O'n oltida maxraj 256 + 16, ya'ni 272. O'n olti chiziq ostida QO'SHILADI, ko'paytirilmaydi.",
      'При шестнадцати знаменатель равен 256 + 16, то есть 272. Шестнадцать под чертой ПРИБАВЛЯЕТСЯ, а не умножается.',
      'At sixteen the denominator is 256 + 16, that is 272. The sixteen below the bar is ADDED, not multiplied.',
    ),
    'x != -4': L(
      "Minus to'rtda x · x = 16 va maxraj 32 ga teng. x · x har doim musbat yoki nol, shuning uchun x · x + 16 hech qachon nol emas.",
      'При минус четырёх x · x = 16, а знаменатель равен 32. x · x всегда неотрицательно, поэтому x · x + 16 никогда не нуль.',
      'At minus four x · x = 16 and the denominator equals 32. x · x is never negative, so x · x + 16 is never zero.',
    ),
    'x != 4': L(
      "To'rtda maxraj 16 + 16 = 32. Nolga aylanishi uchun x · x manfiy bo'lishi kerak edi, kvadrat esa manfiy bo'lmaydi.",
      'При четырёх знаменатель равен 16 + 16 = 32. Для нуля потребовалось бы отрицательное x · x, а квадрат отрицательным не бывает.',
      'At four the denominator is 16 + 16 = 32. A zero would require a negative x · x, and a square is never negative.',
    ),
    'x != 0': L(
      "Nolda maxraj 0 + 16, ya'ni 16 ga teng — kasr hisoblanadi va 0,5 chiqadi. Nol bu yerda xavfli emas: u SURATDA ham turmagan.",
      'При нуле знаменатель равен 0 + 16, то есть 16 — дробь считается и равна 0,5. Нуль здесь не опасен: он и в числителе не стоит.',
      'At zero the denominator is 0 + 16, that is 16 — the fraction computes and equals 0.5. Zero is harmless here.',
    ),
  },
  correctText: L(
    "To'g'ri. x · x manfiy bo'lmaydi, ya'ni x · x + 16 hech qachon 16 dan kichik emas va nolga aylanmaydi. Ifoda kasr, lekin taqiq yo'q. Tekshirish: x = 0 da maxraj 16 va kasr 0,5 ga teng.",
    'Верно. x · x не бывает отрицательным, значит x · x + 16 никогда не меньше 16 и в нуль не обращается. Запись дробная, а запрета нет. Проверка: при x = 0 знаменатель 16, дробь равна 0,5.',
    'Correct. x · x is never negative, so x · x + 16 is never below 16 and never zero. The record is fractional, yet there is no restriction. Check: at x = 0 the denominator is 16 and the fraction equals 0.5.',
  ),
  wrongText: L(
    "Maxrajni nolga tenglashtirib ko'ring: x · x + 16 = 0 dan x · x = −16 chiqadi. Kvadrat manfiy bo'ladimi?",
    'Приравняй знаменатель к нулю: из x · x + 16 = 0 выходит x · x = −16. Бывает ли квадрат отрицательным?',
    'Set the denominator to zero: x · x + 16 = 0 gives x · x = −16. Can a square be negative?',
  ),
}

export default function D01_10(props) { return <Input data={DATA} {...props} /> }
