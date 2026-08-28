// ============================================================================
// 9-sinf, Dars 17. KASR-RATSIONAL TENGSIZLIKLAR.
//
// REDAKSIYA 1, 2026-08-27. Darslik: bu mavzu Algebra 9 da alohida bobga
// ega emas (DARSLAR_REJASI_9SINF.md: «внутри Алг. §8, отдельного нет»).
// Yagona darslik misoli — 8-§, 4-masala (35-bet): (x²+2x−3)/(x²−3x−4) ≥ 0,
// surat va maxraj ko'paytuvchilarga ajratilib (x+3)(x−1)/((x+1)(x−4)) ≥ 0
// ga keltiriladi. Surat nollari (−3, 1) — ODZ ga bog'liq (nostrogiy
// tengsizlikda javobga kiradi); maxraj nollari (−1, 4) — DOIM chiqarib
// tashlanadi, tengsizlik qat'iymi yoki yo'qmi, farqi yo'q. «Kasrga
// ko'paytirib yechish» usuli ATAYLAB ishlatilmaydi (PODXOD_9SINF.md §2:
// o'zgaruvchili ifodaga ko'paytirish yechimlar to'plamini o'zgartiradi) —
// buning o'rniga hammasi bitta tomonga ko'chiriladi.
//
// ASBOB: `SignAxis` KENGAYTIRILDI — `roots` elementi endi ODDIY SON yoki
// `{ x, excluded: true }` bo'lishi mumkin (asboblar.jsx, PODXOD_9SINF.md
// §4 da qayd etilgan, 14-15-darslardagi ogohlantirish aynan shu joy
// uchun edi: «17-darsda teshik nuqta ikki xil bo'ladi»). `excluded: true`
// nuqta HAR DOIM ochiq, `strict` qiymatidan qat'i nazar — bu maxrajning
// nol nuqtasi. Oddiy son esa odatdagidek `strict`ga bo'ysunadi — bu
// suratning nol nuqtasi. Ikkalasi bitta o'qda, bitta tugma bilan
// ishlaydi, mexanika o'zgarmadi.
//
// TEGLAR (o'zining):
//   maxrajga-korpaytirib-yechish     — kasrni maxrajga ko'paytirib
//                                      tenglamaga aylantirishga urinish
//   maxraj-nolini-javobga-kiritish   — maxrajning nol nuqtasini javobga
//                                      qo'shib yuborish (asosiy xato)
//   surat-maxrajni-qisqartirib-yoqotish — surat va maxrajdagi umumiy
//                                      ko'paytuvchini qisqartirib,
//                                      teshik nuqtani yo'qotib qo'yish
//   nollarni-toliq-belgilamaslik     — surat yoki maxrajning nolini
//                                      to'liq belgilamaslik (bittasini
//                                      unutish)
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, MATH_FONT, RuleCard, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { G9_RECOLOR, G9_STYLES, RecallMC, SignAxis } from './asboblar.jsx'

export const META = {
  id: 'grade9-17',
  n: 17,
  row: 17,
  block: 'Б3',
  topic: L('Kasr-ratsional tengsizliklar', 'Дробно-рациональные неравенства', 'Fractional-rational inequalities'),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "Kasrni maxrajga ko'paytirish emas, hammasini bitta tomonga ko'chirib, bitta kasr hosil qilish kerak",
    'Нельзя умножать на знаменатель, нужно перенести всё в одну сторону и получить одну дробь',
    'Do not multiply by the denominator, move everything to one side and form a single fraction',
  ),
  L(
    "Suratning nol nuqtasi qat'iy emas tengsizlikda javobga kiradi, maxrajning nol nuqtasi esa hech qachon kirmaydi",
    'Нуль числителя входит в ответ в нестрогом неравенстве, а нуль знаменателя не входит никогда',
    "A numerator's zero belongs in the answer for a non-strict inequality, but a denominator's zero never does",
  ),
  L(
    "Surat va maxrajdagi umumiy ko'paytuvchini qisqartirish mumkin emas: u teshik nuqtani yo'qotadi",
    'Общий множитель числителя и знаменателя сокращать нельзя: это стирает выколотую точку',
    'A common factor in the numerator and denominator cannot be cancelled: it erases the punctured point',
  ),
]

export const MISS = {
  'maxrajga-korpaytirib-yechish': {
    what: L(
      "kasrni maxrajga ko'paytirib, tenglamadek yechishga urinildi",
      'предпринята попытка умножить дробь на знаменатель и решать как уравнение',
      'an attempt was made to multiply the fraction by the denominator and solve it like an equation',
    ),
    wrong: null,
    at: 0,
  },
  'maxraj-nolini-javobga-kiritish': {
    what: L(
      "maxrajning nol nuqtasi javobga qo'shib yuborildi",
      'нуль знаменателя добавлен в ответ',
      "the denominator's zero was added into the answer",
    ),
    wrong: null,
    at: 0,
  },
  'surat-maxrajni-qisqartirib-yoqotish': {
    what: L(
      "surat va maxrajdagi umumiy ko'paytuvchi qisqartirilib, teshik nuqta yo'qotildi",
      'общий множитель числителя и знаменателя сокращён, выколотая точка потеряна',
      'the common factor in the numerator and denominator was cancelled, the punctured point was lost',
    ),
    wrong: null,
    at: 0,
  },
  'nollarni-toliq-belgilamaslik': {
    what: L(
      "surat yoki maxrajning nol nuqtasi to'liq belgilanmadi, bittasi unutildi",
      'нуль числителя или знаменателя отмечен не полностью, один пропущен',
      "the numerator's or denominator's zero was not fully marked, one was forgotten",
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// DARSNING FUNKSIYALARI.
// ============================================================
// eslint-disable-next-line react-refresh/only-export-components
const F1 = (x) => (3 - x) / (x - 1)                                   // 2-ekran: (3-x)/(x-1) >= 0
// eslint-disable-next-line react-refresh/only-export-components
const F2 = (x) => ((x + 3) * (x - 1)) / ((x + 1) * (x - 4))           // darslikning o'z misoli (4-masala)
// eslint-disable-next-line react-refresh/only-export-components
const F3 = (x) => ((x - 2) * (x + 1)) / (x - 2)                       // qisqartirish tuzog'i
// eslint-disable-next-line react-refresh/only-export-components
const F4 = (x) => ((x + 2) * (x - 3)) / ((x - 1) * (x + 4))           // mustaqil mashq

// ============================================================
// EKRAN 1. XUK.
// ============================================================
const S1 = {
  eyebrow: L('KASRDA YANGI XAVF', 'НОВАЯ ОПАСНОСТЬ В ДРОБИ', 'A NEW DANGER IN A FRACTION'),
  title: L(
    "Kasrni maxrajga ko'paytirish xavfli",
    'Умножать дробь на знаменатель опасно',
    'Multiplying a fraction by the denominator is dangerous',
  ),
  audio: [
    A('mount',
      "Ikki bo'lingan x minus bir, katta yoki teng bir tengsizligini yeching. Maxrajni tashlab yuborish uchun ikkala tomonni ham x minus birga ko'paytirish mumkinmi?",
      'Реши неравенство два, делённое на x минус один, больше или равно единицы. Можно ли, чтобы избавиться от знаменателя, умножить обе части на x минус один?',
      'Solve the inequality two divided by x minus one, greater than or equal to one. To get rid of the denominator, can you multiply both sides by x minus one?'),
    A('why',
      "7-darsda tenglama uchun bu usul ishlagan edi. Tengsizlik uchun ham xuddi shundaymi?",
      'На 7 уроке этот способ работал для уравнения. А для неравенства так же?',
      'In lesson 7 this method worked for an equation. Does it work the same way for an inequality?'),
  ],
  props: {
    askClass: 'g9-ask-big',
    cardsClass: 'g9-cards-small',
    ask: L(
      "Tengsizlikning ikkala tomonini x minus birga ko'paytirish xavfsizmi?",
      'Безопасно ли умножать обе части неравенства на x минус один?',
      'Is it safe to multiply both sides of the inequality by x minus one?',
    ),
    items: [
      {
        id: 'right', right: true,
        show: L("Yo'q, x minus birning ishorasi noma'lum", 'Нет, знак x минус один неизвестен', 'No, the sign of x minus one is unknown'),
      },
      {
        id: 'wrong',
        show: L("Ha, tenglamadagidek ko'paytirsa bo'ladi", 'Да, можно умножить, как в уравнении', 'Yes, you can multiply, just like in an equation'),
        hint: L(
          "X ning qiymatiga qarab x minus bir musbat ham, manfiy ham bo'lishi mumkin. Manfiy songa ko'paytirilganda tengsizlik belgisi almashadi, lekin bu yerda ishora oldindan noma'lum.",
          'В зависимости от значения x, x минус один может быть и положительным, и отрицательным. При умножении на отрицательное число знак неравенства меняется, а здесь знак заранее неизвестен.',
          'Depending on the value of x, x minus one can be positive or negative. Multiplying by a negative number flips the inequality sign, and here the sign is unknown in advance.',
        ),
      },
    ],
    after: L(
      "To'g'ri. Bugun maxrajga ko'paytirmasdan, hammasini bitta tomonga ko'chirib yechishni o'rganamiz.",
      'Верно. Сегодня учимся решать без умножения на знаменатель, перенося всё в одну сторону.',
      'Correct. Today we learn to solve without multiplying by the denominator, moving everything to one side.',
    ),
  },
}

// ============================================================
// EKRAN 2. TAYANCH — ko'paytuvchilarga ajratish, nollarni to'liq topish.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Suratni ham, maxrajni ham ko'paytuvchilarga ajratish",
    'Раскладываем на множители и числитель, и знаменатель',
    'Factoring both the numerator and the denominator',
  ),
  audio: [
    A('mount',
      "X kvadrat qo'shi ikki x minus uch ni ko'paytuvchilarga ajrating. Bu suratning o'zi bo'ladi.",
      'Разложи на множители x в квадрате плюс два x минус три. Это и будет числитель.',
      'Factor x squared plus two x minus three. This will be the numerator.'),
    A('why',
      "17-darsda kasrning ham surati, ham maxraji ko'phad bo'ladi. Ikkalasini ham ajratish kerak, bittasini emas.",
      'На 17 уроке и числитель, и знаменатель дроби будут многочленами. Разложить нужно оба, а не один.',
      "In lesson 17 both the numerator and the denominator of the fraction will be polynomials. Both must be factored, not just one."),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('x² + 2x − 3', 'x² + 2x − 3', 'x² + 2x − 3')}
      steps={[
        { id: 'a', head: 'x1, x2', lines: ['x² + 2x − 3 = 0', 'x1 = −3, x2 = 1'] },
      ]}
      ask={L(
        "Ko'paytuvchilarga ajratilgan ko'rinishi qanday?",
        'Как выглядит разложение на множители?',
        'What does the factored form look like?',
      )}
      cols={1}
      items={[
        { id: 'right', right: true, label: L('(x + 3)(x − 1)', '(x + 3)(x − 1)', '(x + 3)(x − 1)') },
        {
          id: 'wrong',
          label: L('(x − 3)(x + 1)', '(x − 3)(x + 1)', '(x − 3)(x + 1)'),
          hint: L(
            "Ildizlarni tekshiring: minus uch va bir. Ko'paytuvchi x minus ildiz ko'rinishida bo'ladi: x minus minus uch, ya'ni x qo'shi uch.",
            'Проверь корни: минус три и один. Множитель имеет вид x минус корень: x минус минус три, то есть x плюс три.',
            'Check the roots: minus three and one. A factor has the form x minus the root: x minus minus three, that is x plus three.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bugun maxraj ham xuddi shunday ajratiladi: ikkalasining nollari birga o'qqa qo'yiladi, bittasi ham unutilmasligi kerak.",
        'Верно. Сегодня знаменатель раскладывается точно так же: нули обоих наносятся на ось вместе, ни один нельзя забыть.',
        'Correct. Today the denominator is factored the same way: the zeros of both are placed on the axis together, none can be forgotten.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — hammasini bitta tomonga ko'chirish.
// ============================================================
const S3 = {
  eyebrow: L("KO'CHIRISH, KO'PAYTIRISH EMAS", 'ПЕРЕНОС, А НЕ УМНОЖЕНИЕ', 'MOVING, NOT MULTIPLYING'),
  title: L(
    "Hammasi bitta tomonga, bitta kasr hosil bo'ladi",
    'Всё в одну сторону, получается одна дробь',
    'Everything to one side, one fraction results',
  ),
  audio: [
    A('mount',
      "Ikki bo'lingan x minus bir, katta yoki teng bir. Bir ni chapga ko'chiring: ikki bo'lingan x minus bir, minus bir, katta yoki teng nol.",
      'Два, делённое на x минус один, больше или равно единицы. Перенеси единицу влево: два, делённое на x минус один, минус один, больше или равно нулю.',
      'Two divided by x minus one, greater than or equal to one. Move the one to the left: two divided by x minus one, minus one, greater than or equal to zero.'),
    A('why',
      "Endi bittani umumiy maxrajga keltirib, bitta kasrga aylantiring.",
      'Теперь приведи единицу к общему знаменателю и получи одну дробь.',
      'Now bring the one to a common denominator and turn it into one fraction.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('2/(x − 1) ≥ 1', '2/(x − 1) ≥ 1', '2/(x − 1) ≥ 1')}
      steps={[
        { id: 'a', head: '1', lines: ['2/(x − 1) − 1 ≥ 0'] },
        { id: 'b', head: '2', lines: ['(2 − (x − 1))/(x − 1) ≥ 0'] },
        { id: 'c', head: '3', lines: ['(3 − x)/(x − 1) ≥ 0'] },
      ]}
      ask={L(
        "Endi qaysi ikkita nuqta o'qqa qo'yiladi?",
        'Какие теперь две точки наносятся на ось?',
        'Which two points are now placed on the axis?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('X = uch (surat) va x = bir (maxraj)', 'x = три (числитель) и x = один (знаменатель)', 'x = three (numerator) and x = one (denominator)') },
        {
          id: 'wrong',
          label: L('Faqat x = bir', 'Только x = один', 'Only x = one'),
          hint: L(
            "Suratning ham o'z nol nuqtasi bor: uch minus x nolga teng bo'lganda x uchga teng bo'ladi. Ikkala nuqta ham o'qqa qo'yiladi.",
            'У числителя тоже есть своя нулевая точка: три минус x равно нулю при x равном трём. Обе точки наносятся на ось.',
            'The numerator also has its own zero point: three minus x equals zero when x equals three. Both points go on the axis.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Ikkala nuqta ham bor, lekin ular BIR XIL emas: biri suratdan, biri maxrajdan. Bu farq keyingi ekranda ko'rinadi.",
        'Верно. Обе точки есть, но они НЕ ОДИНАКОВЫ: одна от числителя, другая от знаменателя. Эта разница видна на следующем экране.',
        'Correct. Both points exist, but they are NOT the same: one from the numerator, one from the denominator. This difference shows on the next screen.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — SignAxis: darslikning o'z misoli,
// BIRINCHI MARTA ikki xil nuqta turi (surat/maxraj).
// ============================================================
const S4 = {
  eyebrow: L('IKKI XIL NUQTA', 'ДВА РАЗНЫХ ВИДА ТОЧЕК', 'TWO KINDS OF POINTS'),
  title: L(
    "To'rtta nuqta, lekin ikkitasi boshqacha",
    'Четыре точки, но две из них другие',
    'Four points, but two of them are different',
  ),
  audio: [
    A('mount',
      "X qo'shi uch, ko'paytirilgan x minus bir, bo'lingan x qo'shi bir, ko'paytirilgan x minus to'rt, katta yoki teng nol. To'rtta nuqtani qo'ying: ikkitasi suratdan, ikkitasi maxrajdan.",
      'X плюс три, умножить на x минус один, делённое на x плюс один, умножить на x минус четыре, больше или равно нулю. Поставь четыре точки: две от числителя, две от знаменателя.',
      'X plus three, times x minus one, divided by x plus one, times x minus four, greater than or equal to zero. Place four points: two from the numerator, two from the denominator.'),
    W('sign',
      "Suratning nuqtalari yopiq bo'ladi, chunki tengsizlik qat'iy emas. Maxrajning nuqtalari esa har doim ochiq: u yerda kasr aniqlanmagan.",
      'Точки числителя будут закрытыми, ведь неравенство нестрогое. А точки знаменателя всегда открыты: там дробь не определена.',
      'The numerator points will be closed, since the inequality is not strict. The denominator points are always open: the fraction is undefined there.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <SignAxis
      f={F2}
      from={-5} to={6} yFrom={-6} yTo={6}
      roots={[-3, { x: -1, excluded: true }, 1, { x: 4, excluded: true }]}
      strict={false} target="ge"
      xLabel={L('x', 'x', 'x')} yLabel={L('y', 'y', 'y')}
      ask={L(
        "Kasr manfiy bo'lmagan qachon: to'rtta nuqtani qo'ying va oraliqlarni o'qing",
        'Когда дробь не отрицательна: поставь четыре точки и прочитай промежутки',
        'When is the fraction not negative: place four points and read the intervals',
      )}
      after={L(
        "Ana xolos. Minus uch va bir yopiq (suratdan), minus bir va to'rt esa ochiq qoldi (maxrajdan): javob minus uchdan boshlanib, to'rtdan keyin davom etadi.",
        'Вот и всё. Минус три и один закрыты (от числителя), минус один и четыре остались открытыми (от знаменателя): ответ начинается с минус трёх и продолжается после четырёх.',
        'That is all it takes. Minus three and one are closed (from the numerator), minus one and four stayed open (from the denominator): the answer starts at minus three and continues after four.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — nega maxraj nuqtasi HAR DOIM ochiq.
// ============================================================
const S5 = {
  eyebrow: L('NEGA HAR DOIM OCHIQ', 'ПОЧЕМУ ВСЕГДА ОТКРЫТА', 'WHY ALWAYS OPEN'),
  title: L(
    "Bu tengsizlikning qat'iyligiga bog'liq emas",
    'Это не зависит от строгости неравенства',
    'This does not depend on the strictness of the inequality',
  ),
  audio: [
    A('mount',
      "Minus bir nuqtasida maxraj x qo'shi bir nolga aylanadi. Kasrni nolga bo'lish mumkinmi?",
      'В точке минус один знаменатель x плюс один обращается в ноль. Можно ли делить дробь на ноль?',
      'At the point minus one, the denominator x plus one becomes zero. Can a fraction be divided by zero?'),
    A('why',
      "Tengsizlik qat'iy bo'lsa ham, qat'iy bo'lmasa ham bu savolga javob o'zgarmaydi.",
      'Строгое неравенство или нет, ответ на этот вопрос не меняется.',
      'Whether the inequality is strict or not, the answer to this question does not change.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      steps={[]}
      ask={L(
        "Tengsizlik qat'iy emas (katta yoki teng) bo'lsa, maxrajning nol nuqtasi javobga kiradimi?",
        'Если неравенство нестрогое (больше или равно), входит ли нулевая точка знаменателя в ответ?',
        'If the inequality is non-strict (greater than or equal), does the zero point of the denominator belong in the answer?',
      )}
      cols={1}
      items={[
        { id: 'right', right: true, label: L("Yo'q, u hech qachon kirmaydi", 'Нет, она не входит никогда', 'No, it never belongs there') },
        {
          id: 'wrong',
          label: L("Ha, chunki tenglik ruxsat etilgan", 'Да, ведь равенство разрешено', 'Yes, since equality is allowed'),
          hint: L(
            "\"Tenglik ruxsat etilgan\" degani kasr qiymati nolga teng bo'lishi mumkin degani, kasr aniqlanmagan degani emas. Nolga bo'lish umuman ma'noga ega emas.",
            'Разрешённое равенство означает, что значение дроби может быть равно нулю, а не то, что дробь не определена. Деление на ноль вообще не имеет смысла.',
            'Allowed equality means the value of the fraction can equal zero, not that the fraction is undefined. Dividing by zero has no meaning at all.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Suratning nol nuqtasi tengsizlikning turiga (qat'iy yoki emas) bog'liq, maxrajning nol nuqtasi esa bunga umuman bog'liq emas: u aniqlanish sohasining o'zidan tashqarida.",
        'Верно. Нулевая точка числителя зависит от типа неравенства (строгое или нет), а нулевая точка знаменателя от этого вообще не зависит: она вне самой области определения.',
        "Correct. The numerator's zero point depends on the type of inequality (strict or not), but the denominator's zero point does not depend on that at all: it lies outside the domain itself.",
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — SignAxis: XUDDI SHU MISOL, QAT'IY
// TENGSIZLIK (kontrast).
// ============================================================
const S6 = {
  eyebrow: L("QAT'IY BO'LSA", 'ЕСЛИ СТРОГО', 'IF STRICT'),
  title: L(
    "Faqat ikkita nuqta ko'rinishini o'zgartiradi",
    'Только две точки меняют вид',
    'Only two points change their appearance',
  ),
  audio: [
    A('mount',
      "Xuddi shu kasr, endi noldan katta so'ralsa, tenglik ruxsat etilmaydi.",
      'Та же дробь, теперь спрашивается больше нуля, равенство не разрешено.',
      'The same fraction, now greater than zero is asked, equality is not allowed.'),
    A('why',
      "4-ekrandagi to'rtta nuqtani eslang. Ulardan qaysi ikkitasi endi ko'rinishini o'zgartiradi, qaysi ikkitasi o'zgarmaydi?",
      'Вспомни четыре точки с 4 экрана. Какие две из них теперь изменят вид, а какие две нет?',
      'Recall the four points from screen 4. Which two of them will now change appearance, and which two will not?'),
  ],
  render: ({ audio, onSolved, step }) => (
    <SignAxis
      f={F2}
      from={-5} to={6} yFrom={-6} yTo={6}
      roots={[-3, { x: -1, excluded: true }, 1, { x: 4, excluded: true }]}
      strict target="gt"
      xLabel={L('x', 'x', 'x')} yLabel={L('y', 'y', 'y')}
      ask={L(
        "Kasr musbat qachon: to'rtta nuqtani qo'ying va oraliqlarni o'qing",
        'Когда дробь положительна: поставь четыре точки и прочитай промежутки',
        'When is the fraction positive: place four points and read the intervals',
      )}
      after={L(
        "Ana xolos. Minus uch va bir endi ochiq bo'ldi (suratdan, chunki endi qat'iy). Minus bir va to'rt esa avvalgidek ochiq qoldi: ular maxrajdan, ular hech qachon o'zgarmaydi.",
        'Вот и всё. Минус три и один теперь стали открытыми (от числителя, ведь теперь строго). Минус один и четыре остались открытыми, как и были: они от знаменателя, они никогда не меняются.',
        'That is all it takes. Minus three and one are now open (from the numerator, since it is strict now). Minus one and four stayed open just as before: they are from the denominator, they never change.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — QISQARTIRISH TUZOG'I.
// ============================================================
const S7 = {
  eyebrow: L("QISQARTIRISH XAVFLI", 'СОКРАЩАТЬ ОПАСНО', 'CANCELLING IS DANGEROUS'),
  title: L(
    "Umumiy ko'paytuvchini qisqartirish teshik nuqtani yashiradi",
    'Сокращение общего множителя прячет выколотую точку',
    'Cancelling the common factor hides the punctured point',
  ),
  audio: [
    A('mount',
      "X minus ikki, ko'paytirilgan x qo'shi bir, bo'lingan x minus ikki, katta yoki teng nol. Surat va maxrajda bir xil ko'paytuvchi bor: x minus ikki.",
      'X минус два, умножить на x плюс один, делённое на x минус два, больше или равно нулю. И в числителе, и в знаменателе есть одинаковый множитель: x минус два.',
      'X minus two, times x plus one, divided by x minus two, greater than or equal to zero. Both the numerator and the denominator have the same factor: x minus two.'),
    A('why',
      "Uni qisqartirib tashlasangiz, ifoda x qo'shi bir, katta yoki teng nolga aylanadi. Lekin x ikkiga teng bo'lganda dastlabki kasr nimaga teng bo'lardi?",
      'Если его сократить, выражение превратится в x плюс один больше или равно нулю. Но чему была бы равна исходная дробь при x равном двум?',
      'If you cancel it, the expression turns into x plus one greater than or equal to zero. But what would the original fraction equal when x equals two?'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      steps={[]}
      ask={L(
        "X ikkiga teng bo'lganda dastlabki kasrning maxraji nechaga teng bo'ladi?",
        'Чему равен знаменатель исходной дроби при x равном двум?',
        'What does the denominator of the original fraction equal when x equals two?',
      )}
      cols={1}
      items={[
        { id: 'right', right: true, label: L("Nolga, shuning uchun x = 2 aniqlanish sohasidan chiqarib tashlanadi", 'Нулю, поэтому x = 2 исключается из области определения', 'Zero, so x = 2 is excluded from the domain') },
        {
          id: 'wrong',
          label: L("Bir, shuning uchun muammo yo'q", 'Единице, поэтому проблемы нет', 'One, so there is no problem'),
          hint: L(
            "Maxraj x minus ikki edi. X ikkiga teng bo'lganda u aynan nolga aylanadi, qisqartirilganidan keyin ham bu haqiqat o'zgarmaydi.",
            'Знаменатель был x минус два. При x равном двум он обращается ровно в ноль, и это не меняется даже после сокращения.',
            'The denominator was x minus two. When x equals two it becomes exactly zero, and this stays true even after cancelling.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Qisqartirish ifodani soddalashtiradi, lekin aniqlanish sohasini o'zgartirmaydi: ikki baribir teshik nuqta bo'lib qoladi, javobda alohida chiqarib tashlanishi kerak.",
        'Верно. Сокращение упрощает выражение, но не меняет область определения: два всё равно остаётся выколотой точкой, её нужно отдельно исключить из ответа.',
        'Correct. Cancelling simplifies the expression, but does not change the domain: two still remains a punctured point, it must be excluded from the answer separately.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 8. QOIDA.
// ============================================================
const S8_RULE = {
  lines: [
    STATEMENTS[0],
    STATEMENTS[1],
    STATEMENTS[2],
  ],
  source: L(
    "Algebra 9, 8-§, 4-masala (35-bet)",
    'Алгебра 9, §8, задача 4 (стр. 35)',
    'Algebra 9, §8, problem 4 (p. 35)',
  ),
}

function RuleScreen({ audio, onSolved, step, rule }) {
  const t = useT()
  const [open, setOpen] = useState(false)
  return (
    <>
      <RecallMC
        intro={L(
          "Avval savolga javob bering, keyin qoida ochiladi",
          'Сначала ответь на вопрос, потом откроется правило',
          'Answer the question first, then the rule opens',
        )}
        steps={[]}
        ask={L(
          "Kasr-ratsional tengsizlikni yechishning birinchi qadami qaysi?",
          'Каков первый шаг решения дробно-рационального неравенства?',
          'What is the first step in solving a fractional-rational inequality?',
        )}
        cols={1}
        items={[
          {
            id: 'right', right: true,
            label: L("Hammasini bitta tomonga ko'chirib, bitta kasr hosil qilish", 'Перенести всё в одну сторону и получить одну дробь', 'Move everything to one side and form a single fraction'),
          },
          {
            id: 'wrong',
            label: L('Ikkala tomonni ham maxrajga ko\'paytirish', 'Умножить обе стороны на знаменатель', 'Multiply both sides by the denominator'),
            hint: L(
              "1-ekranni eslang: maxrajning ishorasi noma'lum, shuning uchun bunday ko'paytirish tengsizlikning yechimlar to'plamini buzadi.",
              'Вспомни 1 экран: знак знаменателя неизвестен, поэтому такое умножение искажает множество решений неравенства.',
              "Recall screen 1: the sign of the denominator is unknown, so such multiplication corrupts the inequality's solution set.",
            ),
          },
        ]}
        after={L(
          "To'g'ri. Endi to'liq qoida.",
          'Верно. Теперь полное правило.',
          'Correct. Now the full rule.',
        )}
        audio={audio}
        onSolved={(r) => { setOpen(true); if (onSolved) onSolved(r) }}
        onStep={step}
      />
      <RuleCard
        title={t(L('QOIDA', 'ПРАВИЛО', 'RULE')) + ' · ' + t(rule.source)}
        lines={rule.lines.map((l) => t(l))}
        masked={!open}
        lockLabel={L(
          "Qoida to'g'ri javobdan keyin ochiladi",
          'Правило откроется после верного ответа',
          'The rule opens after a correct answer',
        )}
      />
    </>
  )
}

const S8 = {
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L(
    "Surat va maxraj nollari: ikki xil qoida",
    'Нули числителя и знаменателя: два разных правила',
    'Zeros of the numerator and denominator: two different rules',
  ),
  audio: [
    A('mount',
      "Yetti ekranda siz ko'chirishni, ikki xil nuqta turini va qisqartirish tuzog'ini o'z qo'lingiz bilan ko'rdingiz. Endi ular qoida sifatida.",
      'На семи экранах ты сам увидел перенос, два разных вида точек и ловушку сокращения. Теперь они в виде правила.',
      'On seven screens you saw with your own hands the transfer, the two kinds of points, and the cancelling trap. Now here they are as a rule.'),
    W('card',
      "Qoida ochildi. Barchasi darslikdan va uning mantig'idan.",
      'Правило открылось. Всё из учебника и его логики.',
      'The rule is open. Everything from the textbook and its logic.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — SignAxis TAKRORI, mustaqil.
// ============================================================
const S9 = {
  eyebrow: L('TAKROR', 'ПОВТОР', 'REPEAT'),
  title: L(
    "Yana to'rtta nuqta, endi mustaqil",
    'Снова четыре точки, теперь самостоятельно',
    'Four points again, now on your own',
  ),
  audio: [
    A('mount',
      "Yangi kasr: x qo'shi ikki, ko'paytirilgan x minus uch, bo'lingan x minus bir, ko'paytirilgan x qo'shi to'rt, kichik nol. To'rtta nuqtani toping va turini aniqlang.",
      'Новая дробь: x плюс два, умножить на x минус три, делённое на x минус один, умножить на x плюс четыре, меньше нуля. Найди четыре точки и определи их вид.',
      'A new fraction: x plus two, times x minus three, divided by x minus one, times x plus four, less than zero. Find four points and determine their type.'),
    A('why',
      "Qat'iy tengsizlik: surat nuqtalari ham, maxraj nuqtalari ham ochiq bo'ladi, lekin sababi har xil.",
      'Строгое неравенство: точки и числителя, и знаменателя будут открытыми, но причина разная.',
      'A strict inequality: the points of both the numerator and the denominator will be open, but for different reasons.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <SignAxis
      f={F4}
      from={-6} to={5} yFrom={-6} yTo={6}
      roots={[{ x: -4, excluded: true }, -2, { x: 1, excluded: true }, 3]}
      strict target="lt"
      xLabel={L('x', 'x', 'x')} yLabel={L('y', 'y', 'y')}
      ask={L(
        "Kasr manfiy qachon: to'rtta nuqtani qo'ying va oraliqlarni o'qing",
        'Когда дробь отрицательна: поставь четыре точки и прочитай промежутки',
        'When is the fraction negative: place four points and read the intervals',
      )}
      after={L(
        "Ana xolos. Barcha to'rtta nuqta ham ochiq chiqdi, lekin turli sabab bilan: minus to'rt va bir da maxraj nolga aylangani uchun, minus ikki va uchda esa tengsizlik qat'iy bo'lgani uchun.",
        'Вот и всё. Все четыре точки оказались открытыми, но по разным причинам: в минус четырёх и одном потому что знаменатель обращается в ноль, в минус двух и трёх потому что неравенство строгое.',
        'That is all it takes. All four points came out open, but for different reasons: at minus four and one because the denominator becomes zero, at minus two and three because the inequality is strict.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 10. MASHQ — ZANJIR: surat/maxraj nollarini to'liq topish.
// ============================================================
const S10 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "Surat va maxrajning nollarini birga topish",
    'Находим нули числителя и знаменателя вместе',
    'Finding the zeros of the numerator and denominator together',
  ),
  audio: [
    A('mount',
      "To'rtta kasr. Har birida surat va maxrajning nollarini toping, qaysi biri qaysidan ekanini ayting.",
      'Четыре дроби. В каждой найди нули числителя и знаменателя, скажи, какой откуда.',
      'Four fractions. In each, find the zeros of the numerator and denominator, say which is which.'),
    A('why',
      "Suratni ham, maxrajni ham alohida ko'paytuvchilarga ajrating.",
      'Разложи на множители и числитель, и знаменатель отдельно.',
      'Factor both the numerator and the denominator separately.'),
  ],
  props: {
    stepLabel: L('Kasr', 'Дробь', 'Fraction'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "To'rttasi ham topildi: har bir kasrda ikkita nuqta turi bor, ikkalasini ham topish shart.",
      'Все четыре найдены: в каждой дроби есть два вида точек, обе нужно найти обязательно.',
      'All four are found: each fraction has two kinds of points, both must be found.',
    ),
    tasks: [
      {
        expr: '(x − 5)/(x + 2)',
        question: L('Surat va maxrajning nollari qaysi?', 'Каковы нули числителя и знаменателя?', 'What are the zeros of the numerator and denominator?'),
        ok: L("Ha. Surat nol beradi x besh bo'lganda, maxraj esa x minus ikki bo'lganda.", 'Да. Числитель даёт ноль при x равном пяти, знаменатель при x равном минус двум.', 'Yes. The numerator gives zero when x equals five, the denominator when x equals minus two.'),
        items: [
          { id: 'a', right: true, label: L('Surat: besh. Maxraj: minus ikki', 'Числитель: пять. Знаменатель: минус два', 'Numerator: five. Denominator: minus two') },
          { id: 'b', label: L('Surat: minus ikki. Maxraj: besh', 'Числитель: минус два. Знаменатель: пять', 'Numerator: minus two. Denominator: five'), hint: L("Surat yuqorida turibdi: x minus besh. Uning nol nuqtasi besh, minus ikki emas.", 'Числитель находится сверху: x минус пять. Его нулевая точка пять, а не минус два.', 'The numerator is on top: x minus five. Its zero point is five, not minus two.') },
        ],
        solution: [
          L('Surat: x − 5 = 0  →  x = 5', 'Числитель: x − 5 = 0  →  x = 5', 'Numerator: x − 5 = 0  →  x = 5'),
          L('Maxraj: x + 2 = 0  →  x = −2', 'Знаменатель: x + 2 = 0  →  x = −2', 'Denominator: x + 2 = 0  →  x = −2'),
        ],
      },
      {
        expr: '(x² − 4)/(x + 1)',
        question: L('Surat va maxrajning nollari qaysi?', 'Каковы нули числителя и знаменателя?', 'What are the zeros of the numerator and denominator?'),
        ok: L("Ha. Surat ayirmalar kvadrati, ikkita nol beradi: ikki va minus ikki. Maxraj esa minus bir.", 'Да. Числитель это разность квадратов, даёт два нуля: два и минус два. Знаменатель даёт минус один.', 'Yes. The numerator is a difference of squares, giving two zeros: two and minus two. The denominator gives minus one.'),
        items: [
          { id: 'a', right: true, label: L('Surat: ikki va minus ikki. Maxraj: minus bir', 'Числитель: два и минус два. Знаменатель: минус один', 'Numerator: two and minus two. Denominator: minus one') },
          { id: 'b', label: L('Surat: faqat ikki. Maxraj: minus bir', 'Числитель: только два. Знаменатель: минус один', 'Numerator: only two. Denominator: minus one'), hint: L("X kvadrat minus to'rt ayirmalar kvadrati: u x minus ikki va x qo'shi ikkiga ajraladi, ikkita nol beradi.", 'X в квадрате минус четыре это разность квадратов: раскладывается на x минус два и x плюс два, даёт два нуля.', 'X squared minus four is a difference of squares: it factors into x minus two and x plus two, giving two zeros.') },
        ],
        solution: [
          L('Surat: x² − 4 = (x − 2)(x + 2)  →  x = 2, x = −2', 'Числитель: x² − 4 = (x − 2)(x + 2)  →  x = 2, x = −2', 'Numerator: x² − 4 = (x − 2)(x + 2)  →  x = 2, x = −2'),
          L('Maxraj: x + 1 = 0  →  x = −1', 'Знаменатель: x + 1 = 0  →  x = −1', 'Denominator: x + 1 = 0  →  x = −1'),
        ],
      },
      {
        expr: '(x + 6)/(x² − x − 6)',
        question: L('Surat va maxrajning nollari qaysi?', 'Каковы нули числителя и знаменателя?', 'What are the zeros of the numerator and denominator?'),
        ok: L("Ha. Surat nol beradi x minus olti bo'lganda. Maxraj esa ikkiga ajralib, uch va minus ikkida nolga aylanadi.", 'Да. Числитель даёт ноль при x равном минус шести. Знаменатель раскладывается и обращается в ноль при трёх и минус двух.', 'Yes. The numerator gives zero when x equals minus six. The denominator factors and becomes zero at three and minus two.'),
        items: [
          { id: 'a', right: true, label: L('Surat: minus olti. Maxraj: uch va minus ikki', 'Числитель: минус шесть. Знаменатель: три и минус два', 'Numerator: minus six. Denominator: three and minus two') },
          { id: 'b', label: L('Surat: minus olti. Maxraj: faqat uch', 'Числитель: минус шесть. Знаменатель: только три', 'Numerator: minus six. Denominator: only three'), hint: L("Maxrajni ko'paytuvchilarga ajrating: x kvadrat minus x minus olti ikkita ildizga ega, faqat bittasi emas.", 'Разложи знаменатель на множители: x в квадрате минус x минус шесть имеет два корня, а не один.', 'Factor the denominator: x squared minus x minus six has two roots, not just one.') },
        ],
        solution: [
          L('Surat: x + 6 = 0  →  x = −6', 'Числитель: x + 6 = 0  →  x = −6', 'Numerator: x + 6 = 0  →  x = −6'),
          L('Maxraj: x² − x − 6 = (x − 3)(x + 2)  →  x = 3, x = −2', 'Знаменатель: x² − x − 6 = (x − 3)(x + 2)  →  x = 3, x = −2', 'Denominator: x² − x − 6 = (x − 3)(x + 2)  →  x = 3, x = −2'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — QOG'OZDA: nuqta turini aniqlash.
// ============================================================
const S11 = {
  eyebrow: L('QOG\'OZDA', 'НА БУМАГЕ', 'ON PAPER'),
  title: L(
    "Faqat mantiq: nuqta javobga kiradimi",
    'Только логика: входит ли точка в ответ',
    'Just logic: does the point belong in the answer',
  ),
  audio: [
    A('mount',
      "Har savolda kasr, tengsizlik turi va bitta nuqta berilgan. Bu nuqta javobga kirishi mumkinmi, umuman kira olmaydimi, shuni ayting.",
      'В каждом вопросе дана дробь, тип неравенства и одна точка. Скажи, может ли эта точка входить в ответ, или не может вообще.',
      'Each question gives a fraction, the type of inequality, and one point. Say whether this point can belong in the answer, or cannot at all.'),
    A('why',
      "Avval nuqta suratdanmi, maxrajdanmi, shuni aniqlang.",
      'Сначала определи, точка от числителя или от знаменателя.',
      'First determine whether the point is from the numerator or the denominator.'),
  ],
  props: {
    stepLabel: L('Savol', 'Вопрос', 'Question'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham aniqlandi: maxraj nuqtasi hech qachon kirmaydi, surat nuqtasi esa tengsizlik turiga qarab kiradi yoki kirmaydi.",
      'Все три определены: точка знаменателя не входит никогда, а точка числителя входит или нет в зависимости от типа неравенства.',
      'All three are determined: the denominator point never belongs, while the numerator point belongs or not depending on the type of inequality.',
    ),
    tasks: [
      {
        expr: '(x − 2)/(x − 5) ≥ 0,   x = 2',
        question: L('X ikkiga teng nuqta javobga kiradimi?', 'Входит ли точка x равное двум в ответ?', 'Does the point x equal to two belong in the answer?'),
        ok: L("Ha. Ikki suratning nol nuqtasi, tengsizlik esa qat'iy emas: tenglik ruxsat etiladi.", 'Да. Два это нулевая точка числителя, а неравенство нестрогое: равенство разрешено.', 'Yes. Two is the numerator\'s zero point, and the inequality is non-strict: equality is allowed.'),
        items: [
          { id: 'a', right: true, label: L("Ha, kiradi", 'Да, входит', 'Yes, it belongs') },
          { id: 'b', label: L("Yo'q, kirmaydi", 'Нет, не входит', 'No, it does not belong'), hint: L("Ikki suratda joylashgan (x minus ikki), maxrajda emas. Tengsizlik katta yoki teng bo'lgani uchun suratning nol nuqtasi javobga kiradi.", 'Два находится в числителе (x минус два), а не в знаменателе. Так как неравенство больше или равно, нулевая точка числителя входит в ответ.', 'Two sits in the numerator (x minus two), not the denominator. Since the inequality is greater than or equal, the numerator\'s zero point belongs in the answer.') },
        ],
        solution: [
          L('X = 2: surat nol nuqtasi', 'X = 2: нулевая точка числителя', 'X = 2: numerator zero point'),
          L("Tengsizlik qat'iy emas: nuqta kiradi", 'Неравенство нестрогое: точка входит', 'The inequality is not strict: the point belongs'),
        ],
      },
      {
        expr: '(x − 2)/(x − 5) ≥ 0,   x = 5',
        question: L('X beshga teng nuqta javobga kiradimi?', 'Входит ли точка x равное пяти в ответ?', 'Does the point x equal to five belong in the answer?'),
        ok: L("Yo'q. Besh maxrajning nol nuqtasi: u yerda kasr aniqlanmagan, tengsizlik turi bunga ta'sir qilmaydi.", 'Нет. Пять это нулевая точка знаменателя: там дробь не определена, тип неравенства на это не влияет.', 'No. Five is the denominator\'s zero point: the fraction is undefined there, the type of inequality does not affect this.'),
        items: [
          { id: 'a', right: true, label: L("Yo'q, kirmaydi", 'Нет, не входит', 'No, it does not belong') },
          { id: 'b', label: L("Ha, chunki tengsizlik qat'iy emas", 'Да, ведь неравенство нестрогое', 'Yes, since the inequality is non-strict'), hint: L("Besh maxrajda joylashgan (x minus besh). Maxraj nol nuqtasi tengsizlikning turidan qat'i nazar hech qachon javobga kirmaydi.", 'Пять находится в знаменателе (x минус пять). Нулевая точка знаменателя не входит в ответ независимо от типа неравенства.', 'Five sits in the denominator (x minus five). The denominator\'s zero point never belongs in the answer regardless of the type of inequality.') },
        ],
        solution: [
          L('X = 5: maxraj nol nuqtasi', 'X = 5: нулевая точка знаменателя', 'X = 5: denominator zero point'),
          L('Har doim chiqarib tashlanadi', 'Всегда исключается', 'Always excluded'),
        ],
      },
      {
        expr: '(x + 1)/(x − 3) > 0,   x = −1',
        question: L('X minus birga teng nuqta javobga kiradimi?', 'Входит ли точка x равное минус одному в ответ?', 'Does the point x equal to minus one belong in the answer?'),
        ok: L("Yo'q. Minus bir suratning nol nuqtasi, lekin tengsizlik qat'iy: tenglik ruxsat etilmaydi.", 'Нет. Минус один это нулевая точка числителя, но неравенство строгое: равенство не разрешено.', 'No. Minus one is the numerator\'s zero point, but the inequality is strict: equality is not allowed.'),
        items: [
          { id: 'a', right: true, label: L("Yo'q, kirmaydi", 'Нет, не входит', 'No, it does not belong') },
          { id: 'b', label: L("Ha, chunki bu surat nuqtasi", 'Да, ведь это точка числителя', 'Yes, since this is a numerator point'), hint: L("Surat nuqtasi bo'lishi kifoya emas: tengsizlik qat'iy (musbat, teng emas), shuning uchun tenglik holati javobga kirmaydi.", 'Быть точкой числителя недостаточно: неравенство строгое (больше, а не больше или равно), поэтому случай равенства не входит в ответ.', 'Being a numerator point is not enough: the inequality is strict (greater than, not greater than or equal), so the case of equality does not belong in the answer.') },
        ],
        solution: [
          L('X = −1: surat nol nuqtasi', 'X = −1: нулевая точка числителя', 'X = −1: numerator zero point'),
          L("Tengsizlik qat'iy: nuqta kirmaydi", 'Неравенство строгое: точка не входит', 'The inequality is strict: the point does not belong'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ. Farrux umumiy ko'paytuvchini qisqartirib,
// teshik nuqtani yo'qotgan.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Umumiy ko'paytuvchini qisqartirib, nuqtani yo'qotish",
    'Сократить общий множитель и потерять точку',
    'Cancelling the common factor and losing the point',
  ),
  audio: [
    A('mount',
      "Farruxning yechimi. X minus ikki, ko'paytirilgan x qo'shi bir, bo'lingan x minus ikki, katta yoki teng nol tengsizligi uchun u kasrni qisqartirib, javobni x katta yoki teng minus bir deb yozgan.",
      'Решение Фаррух. Для неравенства x минус два, умножить на x плюс один, делённое на x минус два, больше или равно нулю, он сократил дробь и записал ответ как x больше или равно минус одному.',
      "Farrux's solution. For the inequality x minus two, times x plus one, divided by x minus two, greater than or equal to zero, he cancelled the fraction and wrote the answer as x greater than or equal to minus one."),
    A('why',
      "7-ekranni eslang: qisqartirilgan ko'paytuvchi qayerdan chiqqan edi?",
      'Вспомни 7 экран: откуда взялся сокращённый множитель?',
      'Recall screen 7: where did the cancelled factor come from?'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Farrux nuqtani yo'qotgan: x ikkida maxraj nolga teng bo'ladi.",
      'Фаррух потерял точку: при x равном двум знаменатель равен нулю.',
      'Farrux lost the point: at x equal to two the denominator is zero.',
    ),
    tasks: [
      {
        expr: '(x − 2)(x + 1)/(x − 2) ≥ 0',
        question: L(
          "Farrux javobni x katta yoki teng minus bir deb yozdi. Dastlabki maxraj x ikkida nechaga aylanadi?",
          'Фаррух записал ответ как x больше или равно минус одному. Во что обращается исходный знаменатель при x равном двум?',
          'Farrux wrote the answer as x greater than or equal to minus one. What does the original denominator become at x equal to two?',
        ),
        ok: L(
          "To'g'ri: x ikkida maxraj nolga aylanadi, demak ikki javobga kirmaydi.",
          'Верно: при x равном двум знаменатель обращается в ноль, значит два не входит в ответ.',
          'Correct: at x equal to two the denominator becomes zero, so two is not in the answer.',
        ),
        items: [
          {
            id: 'a', right: true,
            label: L("Maxraj x minus ikki edi, x = 2 da nolga aylanadi", 'Знаменатель был x минус два, при x = 2 равен нулю', 'The denominator was x minus two, equal to zero at x = 2'),
          },
          {
            id: 'b',
            label: L("Qisqartirilgandan keyin maxraj yo'qoladi, demak muammo yo'q", 'После сокращения знаменатель исчезает, значит проблемы нет', 'After cancelling, the denominator disappears, so there is no problem'),
            hint: L("Qisqartirish faqat YOZUVNI soddalashtiradi. Dastlabki ifodaning o'zi x ikkida hali ham aniqlanmagan bo'lib qoladi.", 'Сокращение упрощает только ЗАПИСЬ. Само исходное выражение при x равном двум всё равно остаётся неопределённым.', 'Cancelling only simplifies the WRITING. The original expression itself still remains undefined at x equal to two.'),
          },
        ],
        solution: [
          L('Maxraj: x − 2, x = 2 da nolga teng', 'Знаменатель: x − 2, при x = 2 равен нулю', 'Denominator: x − 2, zero at x = 2'),
          L('Qisqartirilgan ifoda x + 1 ≥ 0 → x ≥ −1', 'Сокращённое выражение x + 1 ≥ 0 → x ≥ −1', 'Reduced expression x + 1 ≥ 0 → x ≥ −1'),
          L("To'g'ri javob: x ≥ −1, lekin x ≠ 2", 'Верный ответ: x ≥ −1, но x ≠ 2', 'Correct answer: x ≥ −1, but x ≠ 2'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TRANSFER — mustaqil, boshqa qat'iylik bilan.
// ============================================================
const S13 = {
  eyebrow: L('TRANSFER', 'ПЕРЕНОС', 'TRANSFER'),
  title: L(
    "Boshqa tengsizlik, xuddi shu ko'chirish",
    'Другое неравенство, тот же перенос',
    'A different inequality, the same transfer',
  ),
  audio: [
    A('mount',
      "Uch bo'lingan x qo'shi ikki, kichik ikki. Bu yerda ham maxrajga ko'paytirish emas, ko'chirish kerak.",
      'Три, делённое на x плюс два, меньше двух. Здесь тоже нужен не перенос умножением на знаменатель, а перенос вычитанием.',
      'Three divided by x plus two, less than two. Here too, not multiplication by the denominator, but a transfer is needed.'),
    A('why',
      "3-ekrandagi qadamlarni eslang: avval ikkini chapga ko'chiring, keyin umumiy maxrajga keltiring.",
      'Вспомни шаги с 3 экрана: сначала перенеси двойку влево, потом приведи к общему знаменателю.',
      'Recall the steps from screen 3: first move the two to the left, then bring to a common denominator.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Topildi: usul xuddi 3-ekrandagidek ishladi, faqat sonlar boshqacha.",
      'Найдено: способ сработал так же, как на 3 экране, только с другими числами.',
      'Found: the method worked the same way as on screen 3, only with different numbers.',
    ),
    tasks: [
      {
        expr: '3/(x + 2) < 2',
        question: L(
          "Ikkini chapga ko'chirib, umumiy maxrajga keltirilsa, qanday kasr hosil bo'ladi?",
          'Если перенести двойку влево и привести к общему знаменателю, какая дробь получится?',
          'If the two is moved to the left and brought to a common denominator, what fraction results?',
        ),
        ok: L(
          "Ha. Uch minus ikki ko'paytirilgan x qo'shi ikki, bo'lingan x qo'shi ikki, kichik nol: bu esa minus ikki x minus bir, bo'lingan x qo'shi ikki, kichik nol bo'ladi.",
          'Да. Три минус два, умноженное на x плюс два, делённое на x плюс два, меньше нуля: это даёт минус два x минус один, делённое на x плюс два, меньше нуля.',
          'Yes. Three minus two times x plus two, divided by x plus two, less than zero: this gives minus two x minus one, divided by x plus two, less than zero.',
        ),
        items: [
          { id: 'a', right: true, label: L('(−2x − 1)/(x + 2) < 0', '(−2x − 1)/(x + 2) < 0', '(−2x − 1)/(x + 2) < 0') },
          { id: 'b', label: L('3/(x + 2) − 2x < 0', '3/(x + 2) − 2x < 0', '3/(x + 2) − 2x < 0'), hint: L("Ikkini ko'chirganda u butun kasrdan emas, faqat tenglikning o'ng tomonidan chapga o'tadi, keyin umumiy maxrajga keltiriladi.", 'При переносе двойки она уходит влево только с правой стороны, а не из всей дроби, затем всё приводится к общему знаменателю.', 'When the two is moved, it only leaves the right side, not the whole fraction, then everything is brought to a common denominator.') },
        ],
        solution: ['3/(x + 2) − 2 < 0', '(3 − 2(x + 2))/(x + 2) < 0', '(−2x − 1)/(x + 2) < 0'],
      },
    ],
  },
}

// ============================================================
// EKRAN 14. BLITS.
// ============================================================
const S14 = {
  eyebrow: L('BLITS', 'БЛИЦ', 'BLITZ'),
  title: L(
    "Blits: ko'chirish, ikki nuqta, qisqartirish",
    'Блиц: перенос, две точки, сокращение',
    'Blitz: transfer, two points, cancelling',
  ),
  audio: [
    A('mount',
      "To'rtta savol birin ketin. Ular qoidani so'raydi, uzoq hisobni emas.",
      'Четыре вопроса один за другим. Они спрашивают про правило, а не про долгий счёт.',
      'Four questions one after another. They ask about the rule, not a long computation.'),
    A('why',
      "Hisob birinchi urinish bo'yicha yuradi.",
      'Счёт идёт по первой попытке.',
      'The count goes by the first attempt.'),
  ],
  props: {
    items: [
      {
        id: 'q1',
        tag: 'maxrajga-korpaytirib-yechish',
        ask: L(
          "Kasr-ratsional tengsizlikni yechishda ikkala tomonni ham maxrajga ko'paytirish xavfsizmi?",
          'Безопасно ли при решении дробно-рационального неравенства умножать обе части на знаменатель?',
          'When solving a fractional-rational inequality, is it safe to multiply both sides by the denominator?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'yes', label: L('Ha', 'Да', 'Yes') },
        ],
        ok: L(
          "To'g'ri. Maxrajning ishorasi noma'lum, shuning uchun bunday ko'paytirish yechimlar to'plamini buzadi.",
          'Верно. Знак знаменателя неизвестен, поэтому такое умножение искажает множество решений.',
          "Correct. The sign of the denominator is unknown, so such multiplication corrupts the solution set.",
        ),
        hint: L(
          "1-ekranni eslang: buning o'rniga hammasi bitta tomonga ko'chiriladi.",
          'Вспомни 1 экран: вместо этого всё переносится в одну сторону.',
          'Recall screen 1: instead, everything is moved to one side.',
        ),
      },
      {
        id: 'q2',
        tag: 'maxraj-nolini-javobga-kiritish',
        ask: L(
          "Tengsizlik qat'iy emas bo'lsa, maxrajning nol nuqtasi javobga kiradimi?",
          'Если неравенство нестрогое, входит ли нулевая точка знаменателя в ответ?',
          'If the inequality is non-strict, does the denominator\'s zero point belong in the answer?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'yes', label: L('Ha', 'Да', 'Yes') },
        ],
        ok: L(
          "To'g'ri. Maxraj nol nuqtasi tengsizlikning qat'iyligiga bog'liq emas: u hech qachon javobga kirmaydi.",
          'Верно. Нулевая точка знаменателя не зависит от строгости неравенства: она не входит в ответ никогда.',
          "Correct. The denominator's zero point does not depend on the strictness of the inequality: it never belongs in the answer.",
        ),
        hint: L(
          "5-ekranni eslang: u yerda kasr nolga bo'linadi, bu umuman ma'noga ega emas.",
          'Вспомни 5 экран: там дробь делится на ноль, это вообще не имеет смысла.',
          'Recall screen 5: there the fraction is divided by zero, which has no meaning at all.',
        ),
      },
      {
        id: 'q3',
        tag: 'surat-maxrajni-qisqartirib-yoqotish',
        ask: L(
          "Surat va maxrajdagi umumiy ko'paytuvchini qisqartirish teshik nuqtani yo'qotadimi?",
          'Сокращение общего множителя числителя и знаменателя стирает выколотую точку?',
          'Does cancelling the common factor in the numerator and denominator erase the punctured point?',
        ),
        options: [
          { id: 'yes', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
        ],
        ok: L(
          "To'g'ri. Qisqartirish faqat yozuvni soddalashtiradi, aniqlanish sohasini o'zgartirmaydi: nuqta alohida chiqarib tashlanishi kerak.",
          'Верно. Сокращение упрощает только запись, область определения не меняет: точку нужно исключить отдельно.',
          'Correct. Cancelling only simplifies the writing, it does not change the domain: the point must be excluded separately.',
        ),
        hint: L(
          "12-ekranni eslang: Farruxning xatosi aynan shu edi.",
          'Вспомни 12 экран: именно в этом была ошибка Фарруха.',
          "Recall screen 12: this was exactly Farrux's mistake.",
        ),
      },
      {
        id: 'q4',
        tag: 'nollarni-toliq-belgilamaslik',
        ask: L(
          "Kasrni o'qqa qo'yishda faqat suratning nollarini belgilash yetarlimi?",
          'Достаточно ли при нанесении дроби на ось отметить только нули числителя?',
          'When placing a fraction on the axis, is it enough to mark only the zeros of the numerator?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'yes', label: L('Ha', 'Да', 'Yes') },
        ],
        ok: L(
          "To'g'ri. Maxrajning nollari ham belgilanishi shart, aks holda ular tashlab ketilgan oraliqqa aylanib qolishi mumkin.",
          'Верно. Нули знаменателя тоже обязательно отмечаются, иначе они могут остаться незамеченным промежутком.',
          "Correct. The denominator's zeros must be marked too, otherwise they can turn into an overlooked interval.",
        ),
        hint: L(
          "4-ekranni eslang: to'rtta nuqta bor edi, ikkitasi suratdan, ikkitasi maxrajdan.",
          'Вспомни 4 экран: там было четыре точки, две от числителя, две от знаменателя.',
          'Recall screen 4: there were four points there, two from the numerator, two from the denominator.',
        ),
      },
    ],
  },
}

// ============================================================
// EKRAN 15. YAKUN.
// ============================================================
const S15 = {
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L(
    "Ko'chirish, ikki nuqta turi, qisqartirish xavfi",
    'Перенос, два вида точек, опасность сокращения',
    'Transfer, two kinds of points, the danger of cancelling',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda maxrajga ko'paytirish xavfli ekanini taxmin qildingiz. Bugun aynan shu xavfdan qanday qochishni to'liq egalladingiz.",
      'На первом экране ты предположил, что умножать на знаменатель опасно. Сегодня ты полностью освоил, как именно избегать этой опасности.',
      'On the first screen you guessed that multiplying by the denominator is dangerous. Today you fully mastered exactly how to avoid this danger.'),
    A('s1',
      "Siz hammasini bitta tomonga ko'chirishni, suratning nol nuqtasi bilan maxrajning nol nuqtasini farqlashni, va umumiy ko'paytuvchini qisqartirish xavfli ekanini o'rgandingiz.",
      'Ты освоил перенос всего в одну сторону, различение нулевой точки числителя от нулевой точки знаменателя, и понял, что сокращать общий множитель опасно.',
      'You learned to move everything to one side, to tell apart the numerator\'s zero point from the denominator\'s, and that cancelling a common factor is dangerous.'),
    A('s2',
      "Keyingi darsda tengsizliklar majmuasi: birlashma, kesishma emas.",
      'В следующем уроке совокупность неравенств: объединение, а не пересечение.',
      'The next lesson covers a collection of inequalities: union, not intersection.'),
  ],
  props: {
    mark: 'x ≠ −1, x ≠ 4',
    markNote: L(
      "maxrajning nol nuqtalari, hech qachon javobga kirmaydi",
      'нулевые точки знаменателя, никогда не входят в ответ',
      'the denominator\'s zero points, never belong in the answer',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      'Keyingi dars: tengsizliklar majmuasi',
      'Следующий урок: совокупность неравенств',
      'Next lesson: a collection of inequalities',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     tool: 'pick', ...S1 },
  { role: 'support',  tag: 'nollarni-toliq-belgilamaslik', ...S2 },
  { role: 'explain',  tag: 'maxrajga-korpaytirib-yechish', ...S3 },
  { role: 'explain',  tag: 'maxraj-nolini-javobga-kiritish', ...S4 },
  { role: 'explain',  tag: 'maxraj-nolini-javobga-kiritish', ...S5 },
  { role: 'explain',  tag: 'nollarni-toliq-belgilamaslik', ...S6 },
  { role: 'explain',  tag: 'surat-maxrajni-qisqartirib-yoqotish', ...S7 },
  { role: 'rule',     tag: 'maxraj-nolini-javobga-kiritish', ...S8 },
  { role: 'practice', tool: 'signaxis', tag: 'maxraj-nolini-javobga-kiritish', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'nollarni-toliq-belgilamaslik', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'maxraj-nolini-javobga-kiritish', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'surat-maxrajni-qisqartirib-yoqotish', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'maxrajga-korpaytirib-yechish', ...S13 },
  { role: 'blitz',    tool: 'blitz', ...S14,
    props: {
      ...S14.props,
      scoreLabel: L('birinchi urinishdan', 'с первой попытки', 'on the first try'),
      stepLabel: L('Savol', 'Вопрос', 'Question'),
    },
  },
  { role: 'summary',  tool: 'takeaway', ...S15 },
]

// PALITRA: sinf bo'yicha bitta konstanta, `asboblar.jsx`dagi `G9_RECOLOR`.
export default makeLesson({ META, STATEMENTS, MISS, SCREENS, styles: G9_STYLES, recolor: G9_RECOLOR })
