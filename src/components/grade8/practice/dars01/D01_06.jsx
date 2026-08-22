// Dars01 · Amaliyot 06 — Berilgan shartga kasr yig'ish · 🟡 · teg: build_odz
// Faqat MA'LUMOT. Tip: `practice/kit.jsx` -> Build (andoza bilan).
//
// TESKARI topshiriq: odatda kasr berilib shart topiladi, bu yerda SHART
// berilgan va kasr yig'iladi. To'g'ri javob bitta emas, shuning uchun satr
// solishtirilmaydi: maxrajning NOLLARI tekshiriladi.
//
// O'quvchi faqat MAXRAJNI yig'adi (`wrap`), surat joyida turadi. Sabab:
// butun kasr yig'ilganda topshiriq qavslar kuchi haqida bo'lib qolardi.
//   x · (x − 6)  -> nollar 0 va 6   TO'G'RI
//   x + (x − 6)  -> 2x − 6, nol 3
//   x · (x + 6)  -> nollar 0 va −6
//   (x − 6)      -> faqat 6
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { Build, Frac, L } from '../kit.jsx'

const DATA = {
  tag: 'build_odz',
  level: '🟡',
  varName: 'x',
  wrap: '5 / (%s)',
  want: { holes: [0, 6] },
  eyebrow: L('Teskari ish', 'Обратная работа', 'The other way round'),
  setup: L(
    "Shart tayyor: kasr x = 0 va x = 6 da qiymatga ega bo'lmasligi kerak, boshqa hamma joyda esa hisoblanishi kerak. Shunday maxraj yig'ing.",
    'Условие готово: дробь не должна иметь значения при x = 0 и при x = 6, а во всех остальных точках должна считаться. Собери такой знаменатель.',
    'The condition is given: the fraction must have no value at x = 0 and at x = 6, and must compute everywhere else. Build such a denominator.',
  ),
  frame: (den) => <Frac num="5" den={den} size="big" />,
  placeholder: L('maxrajni yig\'ing', 'собери знаменатель', 'build the denominator'),
  cards: ['x', '(x − 6)', '(x + 6)', '·', '+', '6'],
  ask: L('Kartani bosing — u maxrajga qo\'shiladi.', 'Нажми карточку — она встанет в знаменатель.', 'Tap a card and it goes into the denominator.'),
  wrongs: [
    {
      when: (s) => s.holes.length === 1 && Math.abs(s.holes[0] - 6) < 1e-9,
      text: L(
        "Bitta nol chiqdi — oltida. Nolda esa maxraj hisoblanadi, ya'ni x = 0 RUXSAT ETILGAN bo'lib qoldi. Nolda ham nolga aylanadigan ko'paytuvchi kerak: bu x ning o'zi.",
        'Вышел один нуль — в шестёрке. А при нуле знаменатель считается, то есть x = 0 остался РАЗРЕШЁННЫМ. Нужен множитель, который обращается в нуль и при нуле: это сам x.',
        'One zero came out, at six. At zero the denominator still computes, so x = 0 stayed ALLOWED. A factor that vanishes at zero is needed too: that is x itself.',
      ),
    },
    {
      when: (s) => s.holes.some((v) => Math.abs(v + 6) < 1e-9),
      text: L(
        "(x + 6) minus oltida nolga aylanadi, oltida esa 12 ga teng. Oltida nolga aylanishi uchun (x − 6) kerak.",
        '(x + 6) обращается в нуль при минус шести, а при шести равно 12. Чтобы нуль был при шести, нужно (x − 6).',
        '(x + 6) becomes zero at minus six, and at six it equals 12. To get a zero at six you need (x − 6).',
      ),
    },
    {
      when: (s) => s.holes.length === 1 && Math.abs(s.holes[0] - 3) < 1e-9,
      text: L(
        "Ko'paytuvchilar PLUS bilan bog'langan: x + (x − 6) bu 2x − 6 va u faqat uchda nolga aylanadi. Ikki nol KO'PAYTMADA paydo bo'ladi — ko'paytma bitta ko'paytuvchi nol bo'lishi bilanoq nolga aylanadi.",
        'Множители соединены ПЛЮСОМ: x + (x − 6) это 2x − 6, и он обращается в нуль только при трёх. Два нуля даёт ПРОИЗВЕДЕНИЕ — оно обращается в нуль, едва один множитель стал нулём.',
        'The factors are joined by a PLUS: x + (x − 6) is 2x − 6 and it vanishes only at three. Two zeros come from a PRODUCT — it vanishes as soon as one factor does.',
      ),
    },
    {
      when: (s) => s.holes.length === 1 && Math.abs(s.holes[0]) < 1e-9,
      text: L(
        "Nol topildi, olti esa qoldi: maxrajda oltida nolga aylanadigan ko'paytuvchi yo'q. U (x − 6).",
        'Нуль есть, а шестёрка потеряна: в знаменателе нет множителя, обращающегося в нуль при шести. Это (x − 6).',
        'The zero is there but the six is missing: the denominator has no factor vanishing at six. That factor is (x − 6).',
      ),
    },
    {
      when: (s) => s.holes.length === 0,
      text: L(
        "Bunday maxraj hech qachon nolga aylanmaydi, ya'ni kasr hamma joyda hisoblanadi. Maxrajda HARF bo'lishi kerak.",
        'Такой знаменатель не обращается в нуль никогда, значит дробь считается всюду. В знаменателе должна быть БУКВА.',
        'Such a denominator never becomes zero, so the fraction computes everywhere. The denominator must contain a LETTER.',
      ),
    },
  ],
  wrongText: L(
    "Ikki nol kerak: biri nolda, biri oltida. Ularni KO'PAYTIRIB qo'shing — ko'paytma bitta ko'paytuvchi nolga aylanishi bilan nol bo'ladi.",
    'Нужны два нуля: один при нуле, другой при шести. Соедини множители УМНОЖЕНИЕМ — произведение обращается в нуль, едва один множитель стал нулём.',
    'Two zeros are needed: one at zero, one at six. Join the factors by MULTIPLICATION — a product vanishes as soon as one factor does.',
  ),
  correctText: L(
    "To'g'ri. x · (x − 6) nolda ham, oltida ham nolga aylanadi, boshqa joyda esa yo'q. Tekshirish: x = 1 da maxraj 1 · (−5) = −5 va kasr −1 ga teng, ya'ni bir ruxsat etilgan.",
    'Верно. x · (x − 6) обращается в нуль и при нуле, и при шести, а больше нигде. Проверка: при x = 1 знаменатель равен 1 · (−5) = −5, а дробь равна −1, то есть единица разрешена.',
    'Correct. x · (x − 6) vanishes at zero and at six and nowhere else. Check: at x = 1 the denominator is 1 · (−5) = −5 and the fraction equals −1, so one is allowed.',
  ),
  parseWrong: L(
    "Yozuv o'qilmadi: ko'paytuvchilar orasida amal belgisi turishi kerak.",
    'Запись не читается: между множителями должен стоять знак действия.',
    'The record cannot be read: an operation sign must stand between the factors.',
  ),
}

export default function D01_06(props) { return <Build data={DATA} {...props} /> }
