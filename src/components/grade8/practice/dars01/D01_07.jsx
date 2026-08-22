// Dars01 · Amaliyot 07 — Ikki maxraj, ikki shart · 🟡 · teg: two_denominators
// Faqat MA'LUMOT. Tip: `practice/kit.jsx` -> Odz (ikki maydon).
//
// ADASHISH Z2 ning eng qimmat shakli: shart YO'QOLADI, chunki u bitta emas.
// Ifodada ikki kasr bor, ya'ni ikki maxraj — va shart ikkisidan YIG'ILADI.
// Javobning o'zida buni ko'rish mumkin emas.
//
// x = 6:  12 : 6 = 2,  2 : (6 − 5) = 2,  yig'indi 4.
// Shart: birinchi maxraj x da, ikkinchisi x − 5 da nolga aylanadi ->
//        x ≠ 0 va x ≠ 5.
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { E, F, L, Odz } from '../kit.jsx'

const DATA = {
  tag: 'two_denominators',
  level: '🟡',
  varName: 'x',
  eyebrow: L('Ikki kasr', 'Две дроби', 'Two fractions'),
  setup: L(
    "Ifodada ikki kasr turadi. Har birining o'z maxraji bor, ya'ni har biri o'z taqiqini keltiradi. Yig'indining shartini ikkisidan yig'ish kerak.",
    'В записи две дроби. У каждой свой знаменатель, значит каждая приносит свой запрет. Условие для суммы собирается из обоих.',
    'The record holds two fractions. Each has its own denominator, so each brings its own restriction. The condition for the sum is collected from both.',
  ),
  expr: <E>{F('12', 'x')} + {F('2', 'x − 5')}</E>,
  fields: [
    {
      kind: 'number',
      ask: L('x = 6 da qiymat', 'Значение при x = 6', 'Value at x = 6'),
      label: L('qiymat', 'значение', 'value'),
      answer: '4',
      hints: {
        '2': L(
          "Bu faqat bitta qo'shiluvchi. Ikkinchi kasr ham hisoblanadi: 2 : (6 − 5) = 2, va ikkisi qo'shiladi.",
          'Это только одно слагаемое. Вторая дробь тоже считается: 2 : (6 − 5) = 2, и они складываются.',
          'That is only one summand. The second fraction also computes: 2 : (6 − 5) = 2, and the two are added.',
        ),
        '14': L(
          "12 va 2 qo'shilgan, lekin bo'lish bajarilmagan. Har kasr avval BO'LINADI: 12 : 6 va 2 : 1.",
          '12 и 2 сложены, но деление не выполнено. Каждая дробь сначала ДЕЛИТСЯ: 12 : 6 и 2 : 1.',
          'The 12 and the 2 were added but the division was skipped. Each fraction is DIVIDED first: 12 : 6 and 2 : 1.',
        ),
      },
    },
    {
      kind: 'odz',
      ask: L('Qaysi qiymatlarda ifoda qiymatga ega emas?', 'При каких значениях записи нет?', 'At what values does the record have no value?'),
      label: L('shart', 'условие', 'condition'),
      excluded: [0, 5],
      none: true,
      noneRight: false,
      noneWrong: L(
        "Taqiq bor va ikkita: nolda birinchi maxraj, beshda ikkinchisi nolga aylanadi.",
        'Запрет есть, и он двойной: при нуле в нуль обращается первый знаменатель, при пяти — второй.',
        'There are restrictions, and two of them: at zero the first denominator vanishes, at five the second.',
      ),
      hints: {
        'x != 5': L(
          "Beshni topdingiz, nol esa qoldi. Birinchi kasrning maxraji x ning O'ZI: nolda u nolga aylanadi va 12 : 0 ni hisoblab bo'lmaydi.",
          'Пятёрку нашёл, а нуль потерялся. У первой дроби знаменатель это САМ x: при нуле он обращается в нуль, и 12 : 0 посчитать нельзя.',
          'You found the five but lost the zero. The first fraction has x ITSELF below the bar: at zero it vanishes and 12 : 0 cannot be computed.',
        ),
        'x != 0': L(
          "Nolni topdingiz, beshni esa qoldirdingiz. Ikkinchi maxraj x − 5, va u beshda nolga aylanadi.",
          'Нуль нашёл, а пятёрку оставил. Второй знаменатель это x − 5, и он обращается в нуль при пяти.',
          'You found the zero but left out the five. The second denominator is x − 5 and it vanishes at five.',
        ),
        'x != 0, x != -5': L(
          "Minus beshda x − 5 minus o'nga teng, nolga emas. Nolga aylanadigan qiymat MUSBAT besh.",
          'При минус пяти x − 5 равно минус десяти, а не нулю. В нуль обращается ПОЛОЖИТЕЛЬНАЯ пятёрка.',
          'At minus five, x − 5 equals minus ten, not zero. The value giving zero is POSITIVE five.',
        ),
      },
    },
  ],
  fieldOk: L('to\'g\'ri', 'верно', 'correct'),
  wrongs: [
    {
      when: (s) => s.res[0].ok && !s.res[1].ok,
      text: L(
        "Qiymat to'g'ri, shart esa to'liq emas. Ifodada ikki maxraj bor — ikkisi ham tekshirilishi kerak, hatto biri shunchaki x bo'lsa ham.",
        'Значение верное, а условие неполное. В записи два знаменателя — проверить надо оба, даже если один это просто x.',
        'The value is right but the condition is incomplete. The record has two denominators — both must be checked, even when one is just x.',
      ),
    },
    {
      when: (s) => !s.res[0].ok && s.res[1].ok,
      text: L(
        "Shart to'g'ri yig'ildi, hisobda esa xato. Har kasrni alohida hisoblang, keyin qo'shing.",
        'Условие собрано верно, а в счёте ошибка. Посчитай каждую дробь отдельно, потом сложи.',
        'The condition is collected correctly but the arithmetic slipped. Compute each fraction separately, then add.',
      ),
    },
  ],
  wrongText: L(
    "Har kasrga alohida qaraysiz: maxrajni nolga tenglashtirib, o'z taqiqini olasiz. Ikki taqiq birga ifodaning shartini beradi.",
    'Смотри на каждую дробь отдельно: приравняй знаменатель к нулю и получи её собственный запрет. Два запрета вместе и дают условие записи.',
    'Look at each fraction separately: set its denominator to zero and get its own restriction. The two together make the condition of the record.',
  ),
  correctText: L(
    "To'g'ri. x = 6 da 2 + 2 = 4, shart esa ikkitadan yig'iladi: x ≠ 0 va x ≠ 5. Tekshirish: x = 5 da ikkinchi kasr 2 : 0 bo'lib qoladi, ya'ni butun ifoda qiymatsiz — birinchi kasr hisoblansa ham.",
    'Верно. При x = 6 выходит 2 + 2 = 4, а условие собирается из двух: x ≠ 0 и x ≠ 5. Проверка: при x = 5 вторая дробь превращается в 2 : 0, значит вся запись без значения — даже если первая дробь считается.',
    'Correct. At x = 6 it gives 2 + 2 = 4, and the condition comes from both: x ≠ 0 and x ≠ 5. Check: at x = 5 the second fraction becomes 2 : 0, so the whole record has no value even though the first fraction computes.',
  ),
}

export default function D01_07(props) { return <Odz data={DATA} {...props} /> }
