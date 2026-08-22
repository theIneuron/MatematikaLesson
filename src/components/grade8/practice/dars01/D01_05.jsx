// Dars01 · Amaliyot 05 — Qiymat VA shart · 🟡 · teg: value_and_odz
// Faqat MA'LUMOT. Tip: `practice/kit.jsx` -> Odz (ikki maydon).
//
// TASDIQ 2 + ADASHISH Z2 (shart yo'qoladi) + Z16 (javob son bilan
// tekshirilmaydi). Ikki maydon ATAYLAB birga: qiymatni topib, shartni
// yozmaslik — 8-sinfning eng qimmat xatosi, va u aynan shu yerda ko'rinadi.
//
// x = 2:  surat 2 + 5 = 7,  maxraj 2 − 3 = −1,  kasr 7 : (−1) = −7.
// Shart: maxraj x = 3 da nolga aylanadi, ya'ni x ≠ 3.
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { E, F, L, Odz } from '../kit.jsx'

const DATA = {
  tag: 'value_and_odz',
  level: '🟡',
  varName: 'x',
  eyebrow: L('Ikki javob', 'Два ответа', 'Two answers'),
  setup: L(
    "Kasr haqida to'liq javob ikkitadan iborat: qiymati QANCHA va qaysi qiymatda umuman qiymati YO'Q. Ikkinchisini yozmaslik — javobni yarim qoldirish.",
    'Полный ответ про дробь состоит из двух: СКОЛЬКО она равна и при каком значении её вообще НЕТ. Не написать второе — оставить ответ наполовину.',
    'A full answer about a fraction has two parts: what it EQUALS and where it has NO value at all. Leaving out the second means half an answer.',
  ),
  expr: <E>{F('x + 5', 'x − 3')}</E>,
  fields: [
    {
      kind: 'number',
      ask: L('x = 2 da qiymat', 'Значение при x = 2', 'Value at x = 2'),
      label: L('qiymat', 'значение', 'value'),
      answer: '-7',
      hints: {
        '7': L(
          "Maxraj x = 2 da 2 − 3, ya'ni MINUS bir. Musbatni manfiyga bo'lsa natija manfiy: −7.",
          'Знаменатель при x = 2 равен 2 − 3, то есть МИНУС единице. Положительное на отрицательное даёт отрицательное: −7.',
          'At x = 2 the denominator is 2 − 3, that is MINUS one. A positive divided by a negative is negative: −7.',
        ),
        '1': L(
          "Bir — bu maxrajning moduli. Surat 7 ga teng, uni maxrajga bo'lish kerak: 7 : (−1).",
          'Единица — это знаменатель без знака. Числитель равен 7, его надо разделить на знаменатель: 7 : (−1).',
          'One is the denominator without its sign. The numerator is 7 and must be divided by it: 7 : (−1).',
        ),
      },
    },
    {
      kind: 'odz',
      ask: L('Qaysi qiymatda kasr qiymatga ega emas?', 'При каком значении дроби нет?', 'At what value does the fraction have no value?'),
      label: L('shart', 'условие', 'condition'),
      excluded: [3],
      none: true,
      noneRight: false,
      noneWrong: L(
        "Taqiq bor: maxraj x − 3 uchda nolga aylanadi. Uni tekshirib ko'ring — 3 − 3 = 0.",
        'Запрет есть: знаменатель x − 3 обращается в нуль при трёх. Проверь: 3 − 3 = 0.',
        'There is a restriction: the denominator x − 3 becomes zero at three. Check it: 3 − 3 = 0.',
      ),
      hints: {
        'x != -3': L(
          "Minus uchda maxraj −3 − 3, ya'ni −6 ga teng, nolga emas. Nolga aylanadigan qiymat MUSBAT uch.",
          'При минус трёх знаменатель равен −3 − 3, то есть −6, а не нулю. В нуль обращается ПОЛОЖИТЕЛЬНАЯ тройка.',
          'At minus three the denominator equals −3 − 3, that is −6, not zero. The value that gives zero is POSITIVE three.',
        ),
        'x != -5': L(
          "Minus beshda nolga SURAT aylanadi, maxraj emas. Unda kasr bor va u nolga teng.",
          'При минус пяти в нуль обращается ЧИСЛИТЕЛЬ, а не знаменатель. Дробь при нём есть, и она равна нулю.',
          'At minus five the NUMERATOR becomes zero, not the denominator. The fraction exists there and equals zero.',
        ),
      },
    },
  ],
  fieldOk: L('to\'g\'ri', 'верно', 'correct'),
  wrongs: [
    {
      when: (s) => s.res[0].ok && !s.res[1].ok,
      text: L(
        "Qiymat to'g'ri topildi, shart esa yo'qoldi. Kasr uchun ikkinchi javob ham shart: maxraj nolga aylanadigan qiymat CHIQARIB TASHLANADI.",
        'Значение найдено верно, а условие потерялось. Для дроби второй ответ обязателен: значение, обращающее знаменатель в нуль, ИСКЛЮЧАЕТСЯ.',
        'The value is right but the condition got lost. For a fraction the second answer is required: the value making the denominator zero is EXCLUDED.',
      ),
    },
    {
      when: (s) => !s.res[0].ok && s.res[1].ok,
      text: L(
        "Shart to'g'ri, hisobda esa xato. Ikki qavatni alohida hisoblang: surat 2 + 5, maxraj 2 − 3.",
        'Условие верное, а в счёте ошибка. Посчитай два этажа отдельно: числитель 2 + 5, знаменатель 2 − 3.',
        'The condition is right but the arithmetic slipped. Compute the two levels separately: numerator 2 + 5, denominator 2 − 3.',
      ),
    },
  ],
  wrongText: L(
    "Ikki ish: to'g'ri qiymatni hisoblash va maxrajni nolga aylantiradigan qiymatni topish. Ular BOSHQA-BOSHQA sonlar.",
    'Две работы: посчитать значение и найти значение, обращающее знаменатель в нуль. Это РАЗНЫЕ числа.',
    'Two jobs: compute the value and find the value making the denominator zero. These are DIFFERENT numbers.',
  ),
  correctText: L(
    "To'g'ri. x = 2 da kasr 7 : (−1) = −7, x = 3 da esa maxraj nolga aylanadi, ya'ni x ≠ 3. Ikki javob birga to'liq javob beradi.",
    'Верно. При x = 2 дробь равна 7 : (−1) = −7, а при x = 3 знаменатель обращается в нуль, значит x ≠ 3. Два ответа вместе и дают полный ответ.',
    'Correct. At x = 2 the fraction equals 7 : (−1) = −7, and at x = 3 the denominator becomes zero, so x ≠ 3. The two answers together make the full answer.',
  ),
}

export default function D01_05(props) { return <Odz data={DATA} {...props} /> }
