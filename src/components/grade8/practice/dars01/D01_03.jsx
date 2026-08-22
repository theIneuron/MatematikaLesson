// Dars01 · Amaliyot 03 — Shartni bosqichma-bosqich yozish · 🟢 · teg: odz_steps
// Faqat MA'LUMOT. Tip: `practice/kit.jsx` -> Slots.
//
// TASDIQ 2: ruxsat etilgan qiymatlarni MAXRAJ beradi, uning nollari mumkin emas.
//
// Bankda ORTIQCHA kartalar bor va har biri o'z adashishiga javob beradi:
//   '='   -> ildizni SHART deb yozish (Z2 ning eng keng tarqalgan shakli)
//   '24'  -> 28 ni to'rtga bo'lish o'rniga to'rtni ayirish
//   '−7'  -> ishorani almashtirish
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { E, F, L, Slots } from '../kit.jsx'

const DATA = {
  tag: 'odz_steps',
  level: '🟢',
  eyebrow: L('Yechim satrlari', 'Строки решения', 'Solution lines'),
  setup: L(
    "Kasr maxraji nolga aylanadigan qiymatda qiymatga ega bo'lmaydi. Shu qiymatni topish uchun maxraj nolga tenglashtiriladi — va yechimning oxirgi satri TAQIQ bo'ladi, ildiz emas.",
    'Дробь не имеет значения там, где её знаменатель обращается в нуль. Чтобы найти это значение, знаменатель приравнивают к нулю — и последняя строка решения это ЗАПРЕТ, а не корень.',
    'A fraction has no value where its denominator becomes zero. To find that value the denominator is set to zero — and the last line of the solution is a RESTRICTION, not a root.',
  ),
  expr: <E>{F('10', '4x − 28')}</E>,
  rows: [
    [{ t: '4x − 28 = 0' }],
    [{ t: '4x =' }, { slot: 0 }],
    [{ t: 'x =' }, { slot: 1 }],
    [{ t: 'x' }, { slot: 2 }, { t: '7' }],
  ],
  cards: ['28', '7', '≠', '=', '24', '−7', '4'],
  answer: ['28', '7', '≠'],
  bank: L('Kartalar', 'Карточки', 'Cards'),
  wrongs: [
    {
      when: (s) => s.slots[2] === '=',
      text: L(
        "Yettini TOPDINGIZ, lekin yozib qo'ydingiz: x = 7. Yetti — bu maxrajni nolga aylantiradigan qiymat, ya'ni uni QO'YISH mumkin emas. Oxirgi satr: x ≠ 7.",
        'Семь ты НАШЁЛ, но записал как разрешение: x = 7. Семь — это значение, обращающее знаменатель в нуль, значит его как раз и НЕЛЬЗЯ подставлять. Последняя строка: x ≠ 7.',
        'You FOUND the seven but wrote it as permission: x = 7. Seven is the value that makes the denominator zero, so it is exactly what must NOT be substituted. The last line reads x ≠ 7.',
      ),
    },
    {
      when: (s) => s.slots[0] === '24',
      text: L(
        "28 butunligicha o'ng tomonga o'tadi: 4x = 28. To'rtni ayirish mumkin emas — u 28 ga emas, x ga ko'paytirilgan.",
        '28 переходит вправо целиком: 4x = 28. Вычесть четыре нельзя — она умножена на x, а не на 28.',
        'The 28 moves to the right whole: 4x = 28. Subtracting four is not allowed — it multiplies x, not the 28.',
      ),
    },
    {
      when: (s) => s.slots[1] === '−7',
      text: L(
        "Minus yetti berilsa maxraj 4 · (−7) − 28, ya'ni −56 bo'ladi, nol emas. Bo'lganda ishora o'zgarmaydi: 28 : 4 = 7.",
        'При минус семи знаменатель равен 4 · (−7) − 28, то есть −56, а не нулю. При делении знак не меняется: 28 : 4 = 7.',
        'At minus seven the denominator equals 4 · (−7) − 28, that is −56, not zero. Division does not flip the sign: 28 : 4 = 7.',
      ),
    },
  ],
  wrongText: L(
    "Maxrajni nolga tenglashtiring, tenglamani yeching va topilgan sonni TAQIQ qilib yozing.",
    'Приравняй знаменатель к нулю, реши уравнение и запиши найденное число как ЗАПРЕТ.',
    'Set the denominator to zero, solve the equation and write the value found as a RESTRICTION.',
  ),
  correctText: L(
    "To'g'ri. 4x = 28, x = 7, ya'ni x ≠ 7. Son bilan tekshirish: x = 7 da maxraj 4 · 7 − 28 = 0, kasr qiymatga ega emas; x = 8 da esa maxraj 4 va kasr 2,5 ga teng.",
    'Верно. 4x = 28, x = 7, значит x ≠ 7. Проверка числом: при x = 7 знаменатель 4 · 7 − 28 = 0, дробь значения не имеет; при x = 8 знаменатель равен 4, а дробь 2,5.',
    'Correct. 4x = 28, x = 7, so x ≠ 7. Check with a number: at x = 7 the denominator is 4 · 7 − 28 = 0 and the fraction has no value; at x = 8 the denominator is 4 and the fraction equals 2.5.',
  ),
}

export default function D01_03(props) { return <Slots data={DATA} {...props} /> }
