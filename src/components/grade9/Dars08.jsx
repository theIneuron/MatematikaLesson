// ============================================================================
// 9-sinf, Dars 8. KASR-RATSIONAL TENGLAMALAR.
//
// REDAKSIYA 1, 2026-08-27. Bu mavzu ham Algebra 9 da, ham Algebra 8 da
// alohida bobga ega emas (grade8/Dars20.jsx ning o'z izohi: "o'zbek
// darsligida alohida paragraf yo'q"). Qoida shu yerda ham umumlashtiriladi:
// ODZ (aniqlanish sohasi cheklovi, maxraj nolga teng emas) + maxrajlarga
// ko'paytirib butun tenglamaga keltirish (7-darsdan tanish texnika) +
// topilgan ildizni ODZ bilan solishtirish.
//
// TRACK KENGAYTIRILDI: `checkAsk`/`checkFn` qo'shildi (asboblar.jsx,
// 2026-08-27). Endi maxrajga ko'paytirilgan ildiz ⚠ bilan belgilanadi va
// ALOHIDA "tekshirish" bosqichida o'quvchi bosgan tugma bilan ODZ ga
// solishtiriladi: mos kelmasa chiziladi (begona ildiz), mos kelsa
// tasdiqlanadi. Rad etish o'quvchining bosishi bilan sodir bo'ladi,
// avtomatik emas.
//
// TEGLAR (o'zining):
//   maxraj-nolga-teng          — ODZ topishda maxrajni nolga
//                                 tenglashtirishni unutish
//   begona-ildizni-qabul-qilish — topilgan ildizni ODZ bilan
//                                 solishtirmasdan javob deb qabul qilish
//   yechim-yoq-holati           — "yechim yo'q" haqiqiy javob bo'lishi
//                                 mumkinligini tan olmaslik
//   butun-deb-kasr-oqish        — maxrajida harf borligini payqamasdan
//                                 tenglamani butun tenglamadek yechish
//
// ASBOBLAR: `Track` (7-darsdan, endi ⚠ bilan). Yangi mustaqil asbob yo'q.
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, MATH_FONT, RuleCard, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { G9_RECOLOR, G9_STYLES, RecallMC, Track } from './asboblar.jsx'

export const META = {
  id: 'grade9-08',
  n: 8,
  row: 8,
  block: 'Б2',
  topic: L('Kasr-ratsional tenglamalar', 'Дробно-рациональные уравнения', 'Fractional-rational equations'),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "Maxrajida harf bo'lgan tenglamaning ODZ si maxrajni nolga aylantiradigan qiymatlardan tashqari barcha sonlardan iborat",
    'ОДЗ уравнения с буквой в знаменателе состоит из всех чисел, кроме тех, что обращают знаменатель в нуль',
    'The domain of an equation with a letter in the denominator consists of all numbers except those that make the denominator zero',
  ),
  L(
    "Maxrajlarga ko'paytirilgach hosil bo'lgan har bir ildiz ODZ bilan solishtiriladi: ODZ dan chetga chiqqan ildiz begona ildiz deyiladi va rad etiladi",
    'Каждый корень, полученный после умножения на знаменатели, сравнивается с ОДЗ: корень, выходящий за пределы ОДЗ, называют посторонним и отбрасывают',
    "Every root obtained after multiplying by the denominators is compared with the domain: a root falling outside the domain is called extraneous and is rejected",
  ),
  L(
    "Agar topilgan yagona ildiz begona bo'lib chiqsa, tenglamaning yechimi yo'q, va bu ham to'liq javobdir",
    'Если единственный найденный корень оказывается посторонним, у уравнения решений нет, и это тоже полноценный ответ',
    'If the only root found turns out to be extraneous, the equation has no solution, and that too is a complete answer',
  ),
]

export const MISS = {
  'maxraj-nolga-teng': {
    what: L(
      "ODZ topishda maxrajni nolga tenglashtirish unutildi",
      'при нахождении ОДЗ забыли приравнять знаменатель к нулю',
      'when finding the domain, setting the denominator equal to zero was forgotten',
    ),
    wrong: null,
    at: 0,
  },
  'begona-ildizni-qabul-qilish': {
    what: L(
      "topilgan ildiz ODZ bilan solishtirilmasdan javob deb qabul qilindi",
      'найденный корень принят за ответ без сравнения с ОДЗ',
      'the found root was taken as the answer without comparing it with the domain',
    ),
    wrong: null,
    at: 0,
  },
  'yechim-yoq-holati': {
    what: L(
      "yagona ildiz begona bo'lib chiqqanda yechim borligiga ishonib qolindi",
      "когда единственный корень оказался посторонним, всё равно считали, что решение есть",
      'when the only root turned out to be extraneous, it was still believed that a solution exists',
    ),
    wrong: null,
    at: 0,
  },
  'butun-deb-kasr-oqish': {
    what: L(
      "maxrajida harf borligi payqalmay, tenglama butun tenglamadek yechildi",
      'не заметили букву в знаменателе и решили уравнение как целое',
      'the letter in the denominator went unnoticed and the equation was solved as if it were whole',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// EKRAN 1. XUK.
// ============================================================
const S1 = {
  eyebrow: L('ISHONISH MUMKINMI', 'МОЖНО ЛИ ДОВЕРЯТЬ', 'CAN WE TRUST IT'),
  title: L(
    "Maxrajlarni tozalab, javobga ishonaveramizmi",
    'Очистив знаменатели, можно ли сразу доверять ответу',
    'After clearing denominators, can we trust the answer right away',
  ),
  audio: [
    A('mount',
      "Yangi tenglama: ikki x minus bir, bo'lingan x minus uch, teng besh, bo'lingan x minus uch.",
      'Новое уравнение: два x минус один, делённое на x минус три, равно пять, делённое на x минус три.',
      'A new equation: two x minus one, divided by x minus three, equals five, divided by x minus three.'),
    A('why',
      "Ikkala tomonni ham x minus uchga ko'paytirsak, maxrajlar yo'qoladi. Lekin natijada chiqqan songa darrov ishonish mumkinmi?",
      'Если умножить обе части на x минус три, знаменатели исчезнут. Но можно ли сразу доверять получившемуся числу?',
      'If we multiply both sides by x minus three, the denominators disappear. But can we trust the resulting number right away?'),
  ],
  props: {
    askClass: 'g9-ask-big',
    cardsClass: 'g9-cards-small',
    ask: L(
      "Maxrajlarni tozalab topilgan songa darrov ishonish mumkinmi?",
      'Можно ли сразу доверять числу, найденному после очистки знаменателей?',
      'Can we trust the number found right after clearing the denominators?',
    ),
    items: [
      { id: 'right', right: true, show: L("Yo'q, avval tekshirish kerak", 'Нет, сначала нужно проверить', 'No, it must be checked first') },
      {
        id: 'wrong',
        show: L('Ha, u har doim to\'g\'ri javob', 'Да, это всегда верный ответ', 'Yes, it is always the correct answer'),
        hint: L(
          "Maxrajga ko'paytirish yangi, kattaroq tenglama beradi, va u ba'zan asl tenglamada bo'lmagan qo'shimcha son beradi.",
          'Умножение на знаменатель даёт новое, более широкое уравнение, и оно иногда даёт лишнее число, которого не было в исходном.',
          'Multiplying by the denominator gives a new, wider equation, and it sometimes produces an extra number that was not in the original.',
        ),
      },
    ],
    after: L(
      "To'g'ri. Bugun aynan shu tekshiruvni: topilgan sonni ODZ bilan solishtirishni o'rganamiz.",
      'Верно. Сегодня разберём именно эту проверку: сравнение найденного числа с ОДЗ.',
      'Correct. Today we work out exactly this check: comparing the found number with the domain.',
    ),
  },
}

// ============================================================
// EKRAN 2. TAYANCH — ODZ: maxraj nolga teng bo'lmasligi kerak.
// ============================================================
const S2 = {
  eyebrow: L('ODZ', 'ОДЗ', 'THE DOMAIN'),
  title: L(
    "Qaysi x taqiqlangan",
    'Какой x запрещён',
    'Which x is forbidden',
  ),
  audio: [
    A('mount',
      "Besh, bo'lingan x minus uchga. Bo'lishda maxraj nolga aylanishi mumkin emas.",
      'Пять, делённое на x минус три. При делении знаменатель не может быть равен нулю.',
      'Five, divided by x minus three. In division, the denominator cannot equal zero.'),
    A('why',
      "X qanday qiymatda maxraj nolga aylanadi, o'sha qiymat taqiqlanadi.",
      'При каком значении x знаменатель обращается в нуль, то значение и запрещено.',
      'Whichever value of x makes the denominator zero, that value is forbidden.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('5 / (x − 3)', '5 / (x − 3)', '5 / (x − 3)')}
      steps={[
        { id: 'zero', head: L('Maxraj nol', 'Знаменатель ноль', 'Denominator zero'), lines: ['x − 3 = 0', 'x = 3'] },
      ]}
      ask={L(
        "Qaysi x qiymatida bu ifoda ma'noga ega bo'lmaydi?",
        'При каком значении x это выражение теряет смысл?',
        'At what value of x does this expression lose its meaning?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: 'x = 3' },
        {
          id: 'wrong',
          label: 'x = 5',
          hint: L(
            "Besh son suratda turibdi, maxraj emas. Maxrajni nolga tenglashtiring: x minus uch nol, x uch.",
            'Пятёрка стоит в числителе, а не в знаменателе. Приравняй знаменатель к нулю: x минус три равно нулю, x равно трём.',
            'Five stands in the numerator, not the denominator. Set the denominator to zero: x minus three equals zero, x equals three.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. X uch taqiqlangan. Bu tenglamaning ODZ si: x uchdan boshqa barcha sonlar.",
        'Верно. x равно трём запрещено. ОДЗ этого уравнения: все числа, кроме трёх.',
        'Correct. x equals three is forbidden. The domain of this equation: all numbers except three.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — Track BIRINCHI ISHLASH: ⚠ va tekshirish.
// (2x − 1)/(x − 3) = 5/(x − 3), begona ildiz, yechim yo'q.
// ============================================================
const S3 = {
  eyebrow: L('BOSH ASBOB', 'ГЛАВНЫЙ ПРИБОР', 'THE MAIN TOOL'),
  title: L(
    "Topilgan ildizni ODZ bilan solishtiramiz",
    'Сравниваем найденный корень с ОДЗ',
    'We compare the found root with the domain',
  ),
  audio: [
    A('mount',
      "ODZ topilgan edi: x uch bo'lishi mumkin emas. Endi ikkala tomonni ham x minus uchga ko'paytiring.",
      'ОДЗ уже найдена: x не может быть равно трём. Теперь умножь обе части на x минус три.',
      'The domain is already found: x cannot equal three. Now multiply both sides by x minus three.'),
    W('mul',
      "Maxrajlar yo'qoldi, lekin bu yangi tenglama ODZ dan tashqari ildiz berishi mumkin, shuning uchun natija ogohlantirish belgisi bilan kuzatiladi.",
      'Знаменатели исчезли, но это новое уравнение может дать корень вне ОДЗ, поэтому результат отслеживается со знаком предупреждения.',
      'The denominators are gone, but this new equation might give a root outside the domain, so the result is tracked with a warning mark.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <Track
      start={{ left: '(2x − 1) / (x − 3)', right: '5 / (x − 3)', set: [] }}
      steps={[
        {
          ask: L(
            "Ikkala tomonni ham x minus uchga ko'paytiring",
            'Умножь обе части на x минус три',
            'Multiply both sides by x minus three',
          ),
          actions: [
            {
              id: 'right', right: true,
              label: '2x − 1 = 5',
              to: { left: '2x − 1', right: '5', set: [] },
              note: L(
                "To'g'ri. Ikkala tomondagi maxraj ham qisqardi, oddiy butun tenglama qoldi.",
                'Верно. Знаменатели с обеих сторон сократились, осталось простое целое уравнение.',
                'Correct. The denominators on both sides cancelled, leaving a simple whole equation.',
              ),
            },
            {
              id: 'wrong1',
              label: '2x − 1 = 5(x − 3)',
              hint: L(
                "O'ng tomonda ham maxraj bor edi, u ham x minus uchga ko'paytirilganda qisqarishi kerak, qolmasligi kerak.",
                'Справа тоже был знаменатель, он тоже должен сократиться при умножении на x минус три, а не остаться.',
                'The right side also had a denominator, it too should cancel when multiplied by x minus three, not remain.',
              ),
            },
            {
              id: 'wrong2',
              label: '(2x − 1)(x − 3) = 5',
              hint: L(
                "Chap tomonda allaqachon maxraj x minus uch bor edi: ko'paytirilganda u qisqaradi, qo'shilmaydi.",
                'Слева уже был знаменатель x минус три: при умножении он сокращается, а не добавляется ещё раз.',
                'The left side already had the denominator x minus three: when multiplied it cancels, it does not get added again.',
              ),
            },
          ],
        },
        {
          ask: L(
            "Hosil bo'lgan butun tenglamani yeching",
            'Реши получившееся целое уравнение',
            'Solve the resulting whole equation',
          ),
          actions: [
            {
              id: 'right', right: true,
              label: 'x = 3',
              to: { left: 'x', right: '3', set: [{ value: '3', risky: true }] },
              note: L(
                "To'g'ri. Ikki x oltiga teng, x uchga teng chiqdi. Lekin bu son ⚠ bilan belgilandi, chunki u maxrajga ko'paytirishdan chiqqan.",
                'Верно. Два x равно шести, x получился равным трём. Но это число отмечено ⚠, потому что оно возникло из умножения на знаменатель.',
                'Correct. Two x equals six, x came out equal to three. But this number is flagged with ⚠, because it came from multiplying by the denominator.',
              ),
            },
            {
              id: 'wrong1',
              label: 'x = 2',
              hint: L(
                "Qayta hisoblang: ikki x qo'shi bir teng besh emas, ikki x teng besh qo'shi bir, ya'ni olti.",
                'Пересчитай: не два x плюс один равно пяти, а два x равно пяти плюс один, то есть шести.',
                'Recompute: not two x plus one equals five, but two x equals five plus one, that is six.',
              ),
            },
            {
              id: 'wrong2',
              label: 'x = 6',
              hint: L(
                "Ikki x olti bo'lgach, x ni topish uchun oltini ikkiga bo'ling, ikki bilan ko'paytirmang.",
                'Когда два x равно шести, чтобы найти x, шесть нужно разделить на два, а не умножить.',
                'When two x equals six, to find x you divide six by two, not multiply.',
              ),
            },
          ],
        },
      ]}
      checkAsk={L(
        "Uchni ODZ bilan solishtiring: u taqiqlanganmi?",
        'Сравни тройку с ОДЗ: она запрещена?',
        'Compare three with the domain: is it forbidden?',
      )}
      checkFn={(v) => Number(v) !== 3}
      note={L(
        "Uch aynan taqiqlangan qiymat edi. Bu ildiz begona, u rad etiladi: demak tenglamaning yechimi yo'q.",
        'Три и было тем самым запрещённым значением. Этот корень посторонний, он отбрасывается: значит, у уравнения решений нет.',
        'Three was exactly the forbidden value. This root is extraneous, it is rejected: so the equation has no solution.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — NEGA UCH ISHLAMAYDI: asl tenglamaga qo'yish.
// ============================================================
const S4 = {
  eyebrow: L('NEGA ISHLAMAYDI', 'ПОЧЕМУ НЕ ПОДХОДИТ', 'WHY IT DOES NOT WORK'),
  title: L(
    "Uchni asl tenglamaga qo'yib ko'ramiz",
    'Подставим тройку в исходное уравнение',
    'Let us substitute three into the original equation',
  ),
  audio: [
    A('mount',
      "Uchni ODZ dan tashqari deb topdik. Endi shuni asl, hali maxraj tozalanmagan tenglamaga qo'ying.",
      'Мы нашли, что тройка вне ОДЗ. Теперь подставь её в исходное уравнение, ещё с знаменателем.',
      'We found that three is outside the domain. Now substitute it into the original equation, still with the denominator.'),
    A('why',
      "Maxrajga uch minus uch qo'yilsa, nol chiqadi. Nolga bo'lish esa umuman aniqlanmagan.",
      'Если в знаменатель подставить три минус три, получится нуль. А деление на нуль вообще не определено.',
      'If three minus three is substituted into the denominator, it gives zero. And division by zero is undefined at all.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('(2x − 1) / (x − 3),  x = 3', '(2x − 1) / (x − 3),  x = 3', '(2x − 1) / (x − 3),  x = 3')}
      steps={[
        { id: 'denom', head: L('Maxraj', 'Знаменатель', 'Denominator'), lines: ['3 − 3 = 0'] },
      ]}
      ask={L(
        "Uchni qo'yganda maxrajda nima chiqadi?",
        'Что получается в знаменателе при подстановке тройки?',
        'What does the denominator become when three is substituted?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '0' },
        {
          id: 'wrong',
          label: '3',
          hint: L(
            "Maxraj x minus uch edi: uch o'rniga uch qo'ysangiz, uch minus uch, nol chiqadi.",
            'Знаменатель был x минус три: подставив тройку вместо x, получаешь три минус три, нуль.',
            'The denominator was x minus three: substituting three for x gives three minus three, zero.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Maxraj nolga aylanadi, demak bu yerda ifoda umuman ma'noga ega emas: uch haqiqatan ham begona ildiz.",
        'Верно. Знаменатель обращается в нуль, значит здесь выражение вообще не имеет смысла: тройка действительно посторонний корень.',
        'Correct. The denominator becomes zero, so the expression has no meaning there at all: three really is an extraneous root.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — "YECHIM YO'Q" HAQIQIY JAVOB.
// ============================================================
const S5 = {
  eyebrow: L("YECHIM YO'Q", 'РЕШЕНИЙ НЕТ', 'NO SOLUTION'),
  title: L(
    "Bu ham to'liq javob",
    'Это тоже полноценный ответ',
    'This too is a complete answer',
  ),
  audio: [
    A('mount',
      "Yagona topilgan ildiz begona bo'lib chiqdi, boshqa nomzod yo'q.",
      'Единственный найденный корень оказался посторонним, других кандидатов нет.',
      'The only root found turned out to be extraneous, there are no other candidates.'),
    A('why',
      "Bunday holatda tenglama umuman yechimga ega emas, va bu to'liq, tayyor javob, davom ettirish shart emas.",
      'В этом случае уравнение вообще не имеет решения, и это полный, готовый ответ, продолжать не нужно.',
      'In this case the equation has no solution at all, and that is a complete, ready answer, no need to continue.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      steps={[]}
      ask={L(
        "Yagona ildiz begona bo'lib chiqsa, nima deb yozish kerak?",
        'Если единственный корень оказался посторонним, что нужно записать?',
        'If the only root turns out to be extraneous, what should be written?',
      )}
      cols={1}
      items={[
        { id: 'right', right: true, label: L("Tenglamaning yechimi yo'q", 'У уравнения нет решений', 'The equation has no solution') },
        {
          id: 'wrong',
          label: L("Boshqa ildiz izlash kerak, biror joyda xato bor", 'Нужно искать другой корень, где-то ошибка', 'Another root must be sought, there is a mistake somewhere'),
          hint: L(
            "Hisobda xato yo'q: tenglama shunchaki shu yagona nomzoddan boshqa yechimga ega emas. Yechim yo'qligi ham qonuniy javob.",
            'В вычислениях ошибки нет: у уравнения просто нет решения, кроме этого единственного кандидата. Отсутствие решения тоже законный ответ.',
            'There is no mistake in the computation: the equation simply has no solution besides this one candidate. No solution is also a legitimate answer.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Har bir tenglama yechimga ega bo'lishi shart emas, va buni topib, aynan shunday yozish kerak.",
        'Верно. Не каждое уравнение обязано иметь решение, и, обнаружив это, так и нужно записать.',
        'Correct. Not every equation has to have a solution, and upon finding this, it should be written exactly so.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — IKKI MAXRAJ, IKKI SHART.
// ============================================================
const S6 = {
  eyebrow: L('IKKI SHART', 'ДВА УСЛОВИЯ', 'TWO CONDITIONS'),
  title: L(
    "Ikkita maxraj, ikkita taqiq",
    'Два знаменателя, два запрета',
    'Two denominators, two forbidden values',
  ),
  audio: [
    A('mount',
      "Yangi tenglama: uch, bo'lingan x minus bir, teng ikki, bo'lingan x qo'shi besh.",
      'Новое уравнение: три, делённое на x минус один, равно два, делённое на x плюс пять.',
      'A new equation: three, divided by x minus one, equals two, divided by x plus five.'),
    A('why',
      "Bu safar ikkita har xil maxraj bor, demak ikkita shart tekshiriladi.",
      'На этот раз два разных знаменателя, значит проверяются два условия.',
      'This time there are two different denominators, so two conditions are checked.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('3 / (x − 1) = 2 / (x + 5)', '3 / (x − 1) = 2 / (x + 5)', '3 / (x − 1) = 2 / (x + 5)')}
      steps={[
        { id: 'first', head: L('Birinchi maxraj', 'Первый знаменатель', 'First denominator'), lines: ['x − 1 = 0', 'x = 1'] },
        { id: 'second', head: L('Ikkinchi maxraj', 'Второй знаменатель', 'Second denominator'), lines: ['x + 5 = 0', 'x = −5'] },
      ]}
      ask={L(
        "Bu tenglamaning ODZ sida qaysi ikki son taqiqlangan?",
        'Какие два числа запрещены в ОДЗ этого уравнения?',
        'Which two numbers are forbidden in the domain of this equation?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '1  ·  −5' },
        {
          id: 'wrong',
          label: '1  ·  5',
          hint: L(
            "Ikkinchi maxrajni qayta tekshiring: x qo'shi besh nolga teng bo'lishi uchun x manfiy beshga teng bo'lishi kerak, musbat beshga emas.",
            'Перепроверь второй знаменатель: чтобы x плюс пять равнялось нулю, x должен быть равен минус пяти, а не плюс пяти.',
            'Recheck the second denominator: for x plus five to equal zero, x must equal minus five, not plus five.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Har bir maxraj o'z shartini beradi, ODZ ikkalasini ham hisobga oladi.",
        'Верно. Каждый знаменатель даёт своё условие, ОДЗ учитывает оба.',
        'Correct. Each denominator gives its own condition, the domain accounts for both.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — BUTUN VA KASR TENGLAMANI CHALKASHTIRMASLIK.
// ============================================================
const S7 = {
  eyebrow: L('DIQQAT', 'ВНИМАНИЕ', 'BE CAREFUL'),
  title: L(
    "Maxrajni ko'rmasdan qolib ketmang",
    'Не пропустите знаменатель',
    "Don't miss the denominator",
  ),
  audio: [
    A('mount',
      "7-darsda butun tenglamalarni yechdik, ularda ODZ tekshiruvi kerak emas edi.",
      'На 7 уроке мы решали целые уравнения, там проверка ОДЗ не требовалась.',
      'In lesson 7 we solved whole equations, there checking the domain was not needed.'),
    A('why',
      "Endi tenglamada maxrajida harf bor bo'lsa, ODZ topish HAR DOIM birinchi qadam bo'lishi kerak, buni unutish bo'lmaydi.",
      'Теперь, если в знаменателе уравнения есть буква, нахождение ОДЗ ВСЕГДА должно быть первым шагом, забывать об этом нельзя.',
      'Now, if the equation has a letter in the denominator, finding the domain must ALWAYS be the first step, this cannot be forgotten.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      steps={[]}
      ask={L(
        "X qo'shi to'rt, bo'lingan x minus ikki, teng uch tenglamasini yechishni boshlashdan oldin birinchi qadam nima?",
        'Прежде чем начать решать уравнение x плюс четыре, делённое на x минус два, равно трём, каким должен быть первый шаг?',
        'Before starting to solve the equation x plus four, divided by x minus two, equals three, what should the first step be?',
      )}
      cols={1}
      items={[
        { id: 'right', right: true, label: L("ODZ topish: x ikkiga teng emasligini belgilash", 'Найти ОДЗ: отметить, что x не равно двум', 'Find the domain: note that x does not equal two') },
        {
          id: 'wrong',
          label: L("Darrov qavsni ochib yechishga o'tish", 'Сразу приступить к решению, раскрыв скобки', 'Go straight to solving by opening brackets'),
          hint: L(
            "Maxrajda harf borligini ko'ring: bu butun tenglama emas, ODZ topmasdan yechish begona ildizni ko'rib qolish xavfini beradi.",
            'Обрати внимание: в знаменателе буква, это не целое уравнение, решение без ОДЗ рискует пропустить посторонний корень.',
            'Notice the letter in the denominator: this is not a whole equation, solving without the domain risks missing an extraneous root.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Maxrajda harf ko'rinishi bilanoq, birinchi ish ODZ ni topish.",
        'Верно. Как только в знаменателе видна буква, первым делом находится ОДЗ.',
        'Correct. As soon as a letter appears in a denominator, the first thing to do is find the domain.',
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
    "Algebra 8, 1-6-darslar (ODZ), 15-19-darslar (kvadrat tenglama), darsda umumlashtirilgan",
    'Алгебра 8, уроки 1-6 (ОДЗ), уроки 15-19 (квадратное уравнение), обобщено на уроке',
    'Algebra 8, lessons 1-6 (domain), lessons 15-19 (quadratic equation), synthesized in the lesson',
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
          "Kasr-ratsional tenglamani yechishning nechta bosqichi bo'ldi bugun?",
          'Сколько этапов было сегодня в решении дробно-рационального уравнения?',
          'How many stages were there today in solving a fractional-rational equation?',
        )}
        cols={1}
        items={[
          {
            id: 'right', right: true,
            label: L("Uchta: ODZ topish, maxrajlarni tozalab yechish, ildizni ODZ bilan solishtirish", 'Три: найти ОДЗ, решить, очистив знаменатели, сравнить корень с ОДЗ', 'Three: find the domain, solve by clearing denominators, compare the root with the domain'),
          },
          {
            id: 'wrong',
            label: L('Ikkita: ODZ topish va yechish', 'Два: найти ОДЗ и решить', 'Two: find the domain and solve'),
            hint: L(
              "3-ekranni eslang: yechimni topgandan keyin ham uni ODZ bilan solishtirib tekshirgan edingiz, bu alohida bosqich edi.",
              'Вспомни 3 экран: даже после нахождения решения ты сравнил его с ОДЗ, это был отдельный этап.',
              'Recall screen 3: even after finding the solution, you compared it with the domain, that was a separate stage.',
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
    "ODZ, yechish va tekshirish",
    'ОДЗ, решение и проверка',
    'The domain, solving, and checking',
  ),
  audio: [
    A('mount',
      "Olti ekranda siz ODZ topishni, maxrajlarni tozalashni va ildizni tekshirishni o'z qo'lingiz bilan bajardingiz. Endi ular qoida sifatida.",
      'На шести экранах ты сам находил ОДЗ, очищал знаменатели и проверял корень. Теперь они в виде правила.',
      'On six screens you found the domain, cleared denominators, and checked the root with your own hands. Now here they are as a rule.'),
    W('card',
      "Qoida ochildi. Uchtasi ham darsda umumlashtirilgan.",
      'Правило открылось. Все три обобщены на уроке.',
      'The rule is open. All three are synthesized in the lesson.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — Track TAKRORI, TESKARI NATIJA: ildiz ODZ ga mos
// keladi, haqiqiy yechim. (x + 4)/(x − 1) = 6/(x − 1), x = 2.
// ============================================================
const S9 = {
  eyebrow: L('TAKROR', 'ПОВТОР', 'REPEAT'),
  title: L(
    "Bu safar ildiz omon qoladi",
    'На этот раз корень выживает',
    'This time the root survives',
  ),
  audio: [
    A('mount',
      "Yangi tenglama, xuddi shu qadamlar: ODZ, tozalash, yechish, tekshirish.",
      'Новое уравнение, те же шаги: ОДЗ, очистка, решение, проверка.',
      'A new equation, the same steps: domain, clearing, solving, checking.'),
    A('why',
      "Bu safar natija boshqacha chiqishi mumkin: ⚠ belgisi doim begona ildiz degani emas, u faqat TEKSHIRISH kerakligini bildiradi.",
      'На этот раз результат может получиться другим: значок ⚠ не всегда означает посторонний корень, он лишь говорит о необходимости ПРОВЕРКИ.',
      'This time the result may turn out different: the ⚠ mark does not always mean an extraneous root, it only means CHECKING is required.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <Track
      start={{ left: '(x + 4) / (x − 1)', right: '6 / (x − 1)', set: [] }}
      steps={[
        {
          ask: L(
            "Ikkala tomonni ham x minus birga ko'paytiring",
            'Умножь обе части на x минус один',
            'Multiply both sides by x minus one',
          ),
          actions: [
            {
              id: 'right', right: true,
              label: 'x + 4 = 6',
              to: { left: 'x + 4', right: '6', set: [] },
              note: L(
                "To'g'ri. Ikkala tomondagi maxraj ham qisqardi.",
                'Верно. Знаменатели с обеих сторон сократились.',
                'Correct. The denominators on both sides cancelled.',
              ),
            },
            {
              id: 'wrong1',
              label: 'x + 4 = 6(x − 1)',
              hint: L(
                "O'ng tomonda ham maxraj bor edi, u ham qisqarishi kerak, qolmasligi kerak.",
                'Справа тоже был знаменатель, он тоже должен сократиться, а не остаться.',
                'The right side also had a denominator, it too should cancel, not remain.',
              ),
            },
          ],
        },
        {
          ask: L(
            "Hosil bo'lgan butun tenglamani yeching",
            'Реши получившееся целое уравнение',
            'Solve the resulting whole equation',
          ),
          actions: [
            {
              id: 'right', right: true,
              label: 'x = 2',
              to: { left: 'x', right: '2', set: [{ value: '2', risky: true }] },
              note: L(
                "To'g'ri. X ikkiga teng chiqdi. Bu son ham ⚠ bilan belgilandi, chunki u maxrajga ko'paytirishdan chiqqan.",
                'Верно. x получился равным двум. Это число тоже отмечено ⚠, потому что оно возникло из умножения на знаменатель.',
                'Correct. x came out equal to two. This number is also flagged with ⚠, because it came from multiplying by the denominator.',
              ),
            },
            {
              id: 'wrong1',
              label: 'x = 10',
              hint: L(
                "To'rtni narigi tomonga o'tkazing: x teng olti minus to'rt, ikki, olti qo'shi to'rt emas.",
                'Перенеси четвёрку на другую сторону: x равно шесть минус четыре, два, а не шесть плюс четыре.',
                'Move the four to the other side: x equals six minus four, two, not six plus four.',
              ),
            },
          ],
        },
      ]}
      checkAsk={L(
        "Ikkini ODZ bilan solishtiring: u taqiqlanganmi?",
        'Сравни двойку с ОДЗ: она запрещена?',
        'Compare two with the domain: is it forbidden?',
      )}
      checkFn={(v) => Number(v) !== 1}
      note={L(
        "Ikki taqiqlangan songa teng emas, u bir emas. Demak bu ildiz haqiqiy: x ikkiga teng, tenglamaning yechimi shu.",
        'Два не равно запрещённому числу, оно не равно единице. Значит этот корень настоящий: x равен двум, это и есть решение уравнения.',
        'Two does not equal the forbidden number, it is not one. So this root is real: x equals two, that is the solution of the equation.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 10. MASHQ — ZANJIR: ODZ topish, to'rtta misol.
// ============================================================
const S10 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "Tez ODZ topish",
    'Быстро находим ОДЗ',
    'Quickly finding the domain',
  ),
  audio: [
    A('mount',
      "To'rtta tenglama ketma-ket. Har birida taqiqlangan x ni toping.",
      'Четыре уравнения подряд. В каждом найди запрещённый x.',
      'Four equations in a row. In each, find the forbidden x.'),
    A('why',
      "Har safar maxrajni nolga tenglashtiring va tenglamani yeching.",
      'Каждый раз приравнивай знаменатель к нулю и решай уравнение.',
      'Each time, set the denominator to zero and solve the equation.'),
  ],
  props: {
    stepLabel: L('Tenglama', 'Уравнение', 'Equation'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "To'rttasi ham topildi. Har safar bir xil yo'l: maxrajni nolga tenglashtirish.",
      'Все четыре найдены. Каждый раз один путь: приравнять знаменатель к нулю.',
      'All four are found. Same path every time: set the denominator to zero.',
    ),
    tasks: [
      {
        expr: '7 / (x − 4) = 1',
        question: L('Qaysi x taqiqlangan?', 'Какой x запрещён?', 'Which x is forbidden?'),
        ok: L('Ha. Maxraj nolga teng: x to\'rt.', 'Да. Знаменатель равен нулю: x равен четырём.', 'Yes. The denominator equals zero: x equals four.'),
        items: [
          { id: 'a', right: true, label: '4' },
          { id: 'b', label: '7', hint: L("Yetti son suratda turibdi, maxrajda emas. Maxraj x minus to'rt.", 'Семёрка стоит в числителе, а не в знаменателе. Знаменатель это x минус четыре.', 'Seven stands in the numerator, not the denominator. The denominator is x minus four.') },
        ],
        solution: ['x − 4 = 0', 'x = 4'],
      },
      {
        expr: '2 / (x + 6) = 3',
        question: L('Qaysi x taqiqlangan?', 'Какой x запрещён?', 'Which x is forbidden?'),
        ok: L("Ha. X qo'shi olti nolga teng: x minus olti.", 'Да. x плюс шесть равно нулю: x равен минус шести.', 'Yes. x plus six equals zero: x equals minus six.'),
        items: [
          { id: 'a', right: true, label: '−6' },
          { id: 'b', label: '6', hint: L("X qo'shi olti nolga teng bo'lishi uchun x manfiy oltiga teng bo'lishi kerak.", 'Чтобы x плюс шесть равнялось нулю, x должен быть равен минус шести.', 'For x plus six to equal zero, x must equal minus six.') },
        ],
        solution: ['x + 6 = 0', 'x = −6'],
      },
      {
        expr: '(x + 1) / (2x − 8) = 4',
        question: L('Qaysi x taqiqlangan?', 'Какой x запрещён?', 'Which x is forbidden?'),
        ok: L("Ha. Ikki x sakkizga teng, x to'rtga teng.", 'Да. Два x равно восьми, x равно четырём.', 'Yes. Two x equals eight, x equals four.'),
        items: [
          { id: 'a', right: true, label: '4' },
          { id: 'b', label: '8', hint: L("Ikki x sakkizga teng bo'lgach, x ni topish uchun sakkizni ikkiga bo'ling.", 'Когда два x равно восьми, чтобы найти x, раздели восемь на два.', 'When two x equals eight, to find x divide eight by two.') },
        ],
        solution: ['2x − 8 = 0', '2x = 8', 'x = 4'],
      },
      {
        expr: '5 / (3x) = 2',
        question: L('Qaysi x taqiqlangan?', 'Какой x запрещён?', 'Which x is forbidden?'),
        ok: L("Ha. Uch x nolga teng bo'lishi uchun x nolga teng bo'lishi kerak.", 'Да. Чтобы три x равнялось нулю, x должен быть равен нулю.', 'Yes. For three x to equal zero, x must equal zero.'),
        items: [
          { id: 'a', right: true, label: '0' },
          { id: 'b', label: '3', hint: L("Uch bu koeffitsient, taqiqlangan qiymat emas. Uch x nolga teng bo'lishi uchun x ning o'zi nol bo'lishi kerak.", 'Тройка это коэффициент, а не запрещённое значение. Чтобы три x равнялось нулю, сам x должен быть равен нулю.', 'Three is the coefficient, not the forbidden value. For three x to equal zero, x itself must equal zero.') },
        ],
        solution: ['3x = 0', 'x = 0'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — QOG'OZDA: ildizni ODZ bilan solishtirish.
// ============================================================
const S11 = {
  eyebrow: L('QOG\'OZDA', 'НА БУМАГЕ', 'ON PAPER'),
  title: L(
    "Ildiz va ODZ: mos keladimi",
    'Корень и ОДЗ: совпадают ли',
    'The root and the domain: do they clash',
  ),
  audio: [
    A('mount',
      "Har savolda ODZ va topilgan ildiz berilgan. Ular mos kelmasligini tekshiring.",
      'В каждом вопросе даны ОДЗ и найденный корень. Проверь, не совпадают ли они.',
      'Each question gives the domain and the found root. Check whether they clash.'),
    A('why',
      "Ildiz aynan taqiqlangan songa teng bo'lsa, u begona. Boshqa har qanday songa teng bo'lsa, u haqiqiy.",
      'Если корень равен именно запрещённому числу, он посторонний. Если равен любому другому числу, он настоящий.',
      'If the root equals exactly the forbidden number, it is extraneous. If it equals any other number, it is real.'),
  ],
  props: {
    stepLabel: L('Savol', 'Вопрос', 'Question'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham tekshirildi: taqiqlangan songa teng ildiz begona, boshqa son bo'lsa haqiqiy.",
      'Все три проверены: корень, равный запрещённому числу, посторонний, любое другое число, настоящее.',
      'All three are checked: a root equal to the forbidden number is extraneous, any other number is real.',
    ),
    tasks: [
      {
        expr: 'x ≠ 5,  x = 5',
        question: L(
          "ODZ besh taqiqlaydi, topilgan ildiz ham beshga teng. Bu ildiz javobga kiradimi?",
          'ОДЗ запрещает пятёрку, найденный корень тоже равен пяти. Этот корень входит в ответ?',
          'The domain forbids five, and the found root also equals five. Does this root belong to the answer?',
        ),
        ok: L("Yo'q. Ildiz aynan taqiqlangan songa teng, u begona, rad etiladi.", 'Нет. Корень равен именно запрещённому числу, он посторонний, отбрасывается.', 'No. The root equals exactly the forbidden number, it is extraneous, it is rejected.'),
        items: [
          { id: 'a', label: L('Ha, kiradi', 'Да, входит', 'Yes, it does') },
          { id: 'b', right: true, label: L("Yo'q, begona ildiz", 'Нет, посторонний корень', 'No, extraneous root') },
        ],
        solution: ['x = 5 ODZ dan tashqarida', "Begona ildiz, javob: yechim yo'q"],
      },
      {
        expr: 'x ≠ −2,  x = 4',
        question: L(
          "ODZ minus ikkini taqiqlaydi, topilgan ildiz to'rtga teng. Bu ildiz javobga kiradimi?",
          'ОДЗ запрещает минус два, найденный корень равен четырём. Этот корень входит в ответ?',
          'The domain forbids minus two, and the found root equals four. Does this root belong to the answer?',
        ),
        ok: L("Ha. To'rt taqiqlangan songa teng emas, ildiz haqiqiy.", 'Да. Четыре не равно запрещённому числу, корень настоящий.', 'Yes. Four does not equal the forbidden number, the root is real.'),
        items: [
          { id: 'a', right: true, label: L('Ha, kiradi', 'Да, входит', 'Yes, it does') },
          { id: 'b', label: L("Yo'q, begona ildiz", 'Нет, посторонний корень', 'No, extraneous root'), hint: L("To'rt va minus ikki har xil sonlar: ildiz taqiqlangan qiymatga teng emas.", 'Четыре и минус два, разные числа: корень не равен запрещённому значению.', 'Four and minus two are different numbers: the root does not equal the forbidden value.') },
        ],
        solution: ['x = 4 ODZ ichida', 'Haqiqiy ildiz, javob: x = 4'],
      },
      {
        expr: 'x ≠ 0,  x ≠ 1,  x = 0,  x = 6',
        question: L(
          "ODZ nol va birni taqiqlaydi, topilgan ildizlar nol va olti. Ikkala ildiz ham javobga kiradimi?",
          'ОДЗ запрещает нуль и единицу, найденные корни ноль и шесть. Оба корня входят в ответ?',
          'The domain forbids zero and one, the found roots are zero and six. Do both roots belong to the answer?',
        ),
        ok: L("Yo'q, faqat oltita. Nol taqiqlangan, begona; olti esa taqiqlanmagan, haqiqiy.", 'Нет, только шесть. Нуль запрещён, посторонний; шесть не запрещено, настоящий.', 'No, only six. Zero is forbidden, extraneous; six is not forbidden, real.'),
        items: [
          { id: 'a', label: L('Ha, ikkalasi ham', 'Да, оба', 'Yes, both') },
          { id: 'b', right: true, label: L('Faqat olti', 'Только шесть', 'Only six') },
        ],
        solution: ['x = 0 taqiqlangan, begona', 'x = 6 taqiqlanmagan, haqiqiy', 'Javob: x = 6'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ. Madinaning "yechimida" ODZ tekshirilmagan.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "ODZ siz qoldirilgan javob",
    'Ответ, оставленный без ОДЗ',
    'An answer left without checking the domain',
  ),
  audio: [
    A('mount',
      "Madinaning yechimi. U to'rt, bo'lingan x minus ikkiga, teng ikki tenglamasini yechib, x ikkiga teng, deb yozdi va shu bilan tugatdi.",
      'Решение Мадины. Она решила уравнение четыре, делённое на x минус два, равно двум, получила x равным двум, и на этом закончила.',
      "Madina's solution. She solved the equation four, divided by x minus two, equals two, got x equals two, and stopped there."),
    A('why',
      "Uning javobini ODZ bilan solishtiring: bu tenglamada qaysi x taqiqlangan edi?",
      'Сравни её ответ с ОДЗ: какой x был запрещён в этом уравнении?',
      "Compare her answer with the domain: which x was forbidden in this equation?"),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Madina to'g'ri hisoblagan, lekin ODZ ni tekshirmagan: bu tenglamada aynan ikki taqiqlangan edi.",
      'Мадина посчитала верно, но не проверила ОДЗ: в этом уравнении запрещена была именно двойка.',
      "Madina computed correctly but did not check the domain: in this equation exactly two was forbidden.",
    ),
    tasks: [
      {
        expr: '4 / (x − 2) = 2, Madina: x = 2',
        question: L(
          "Madinaning javobini tekshiring: bu tenglamada qaysi x taqiqlangan edi?",
          'Проверь ответ Мадины: какой x был запрещён в этом уравнении?',
          "Check Madina's answer: which x was forbidden in this equation?",
        ),
        ok: L(
          "Ikki taqiqlangan edi, chunki maxraj x minus ikki. Madinaning javobi aynan shu songa teng, demak u begona ildiz, javob emas.",
          'Запрещена была двойка, потому что знаменатель x минус два. Ответ Мадины равен именно этому числу, значит это посторонний корень, а не ответ.',
          "Two was forbidden, because the denominator is x minus two. Madina's answer equals exactly this number, so it is an extraneous root, not an answer.",
        ),
        items: [
          {
            id: 'a', right: true,
            label: L("Ikki taqiqlangan, Madinaning javobi begona ildiz", 'Запрещена двойка, ответ Мадины посторонний корень', "Two is forbidden, Madina's answer is an extraneous root"),
          },
          {
            id: 'b',
            label: L("To'rt taqiqlangan, Madinaning javobi to'g'ri", 'Запрещена четвёрка, ответ Мадины верен', "Four is forbidden, Madina's answer is correct"),
            hint: L("To'rt suratda turibdi, maxrajda emas. Maxrajni nolga tenglang: x minus ikki nol, x ikki.", 'Четвёрка стоит в числителе, а не в знаменателе. Приравняй знаменатель к нулю: x минус два равно нулю, x равно двум.', 'Four stands in the numerator, not the denominator. Set the denominator to zero: x minus two equals zero, x equals two.'),
          },
        ],
        solution: [
          'x − 2 = 0 → x = 2 taqiqlangan',
          "Madinaning javobi x = 2, aynan taqiqlangan songa teng",
          "To'g'ri javob: yechim yo'q",
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TESKARI TOPSHIRIQ — ODZ dan tenglamaga.
// ============================================================
const S13 = {
  eyebrow: L('TESKARI', 'ОБРАТНОЕ', 'THE REVERSE'),
  title: L(
    "ODZ dan tenglamaga",
    'От ОДЗ к уравнению',
    'From the domain to the equation',
  ),
  audio: [
    A('mount',
      "Bu safar boshqa tomondan: taqiqlangan son berilgan, qaysi tenglama shu sonni taqiqlashini siz tanlaysiz.",
      'На этот раз наоборот: дано запрещённое число, а какое уравнение его запрещает, выбираешь ты.',
      'This time it is the other way round: the forbidden number is given, you choose which equation forbids it.'),
    A('why',
      "Har bir nomzodda maxrajni nolga tenglashtirib, berilgan songa mos kelishini tekshiring.",
      'В каждом кандидате приравнивай знаменатель к нулю и проверяй совпадение с данным числом.',
      'In each candidate, set the denominator to zero and check whether it matches the given number.',
    ),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Topildi: taqiqlangan sondan orqaga qaytib, mos maxrajni tanlash ham xuddi shu qoidaga tayanadi.",
      'Найдено: путь от запрещённого числа назад к знаменателю опирается на то же самое правило.',
      'Found: going backward from the forbidden number to the denominator relies on the same rule.',
    ),
    tasks: [
      {
        expr: 'x ≠ 7',
        question: L(
          "X yetti bo'lishi taqiqlangan bo'lishi kerak. Qaysi tenglama mos keladi?",
          'x равное семи должно быть запрещено. Какое уравнение подходит?',
          'x equal to seven must be forbidden. Which equation fits?',
        ),
        ok: L("Ha. X minus yetti nolga teng bo'lishi uchun x yetti bo'lishi kerak.", 'Да. Чтобы x минус семь равнялось нулю, x должен быть равен семи.', 'Yes. For x minus seven to equal zero, x must equal seven.'),
        items: [
          { id: 'a', right: true, label: '3 / (x − 7) = 1' },
          { id: 'b', label: '3 / (x + 7) = 1', hint: L("Bu yerda x minus yetti taqiqlanadi, plyus yetti emas.", 'Здесь запрещается x равное минус семи, а не семи.', 'Here x equal to minus seven is forbidden, not seven.') },
        ],
        solution: ['x − 7 = 0', 'x = 7'],
      },
      {
        expr: 'x ≠ −4',
        question: L(
          "X minus to'rt bo'lishi taqiqlangan bo'lishi kerak. Qaysi tenglama mos keladi?",
          'x равное минус четырём должно быть запрещено. Какое уравнение подходит?',
          'x equal to minus four must be forbidden. Which equation fits?',
        ),
        ok: L("Ha. X qo'shi to'rt nolga teng bo'lishi uchun x minus to'rtga teng bo'lishi kerak.", 'Да. Чтобы x плюс четыре равнялось нулю, x должен быть равен минус четырём.', 'Yes. For x plus four to equal zero, x must equal minus four.'),
        items: [
          { id: 'a', right: true, label: '5 / (x + 4) = 2' },
          { id: 'b', label: '5 / (x − 4) = 2', hint: L("Bu yerda x plyus to'rt taqiqlanadi, minus to'rt emas.", 'Здесь запрещается x равное четырём, а не минус четырём.', 'Here x equal to four is forbidden, not minus four.') },
        ],
        solution: ['x + 4 = 0', 'x = −4'],
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
    "Blits: ODZ, begona ildiz, yechim yo'q",
    'Блиц: ОДЗ, посторонний корень, решений нет',
    'Blitz: domain, extraneous root, no solution',
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
        tag: 'maxraj-nolga-teng',
        ask: L(
          "ODZ topish uchun birinchi ish nima: maxrajni nolga tenglashtirishmi yoki suratni?",
          'Что нужно сделать первым для нахождения ОДЗ: приравнять к нулю знаменатель или числитель?',
          'What is the first thing to find the domain: set the denominator to zero, or the numerator?',
        ),
        options: [
          { id: 'denom', right: true, label: L('Maxrajni', 'Знаменатель', 'The denominator') },
          { id: 'num', label: L('Suratni', 'Числитель', 'The numerator') },
        ],
        ok: L(
          "To'g'ri. Aynan maxraj nolga aylanganda ifoda ma'nosini yo'qotadi.",
          'Верно. Именно когда знаменатель обращается в нуль, выражение теряет смысл.',
          'Correct. It is exactly when the denominator becomes zero that the expression loses meaning.',
        ),
        hint: L(
          "Surat nolga teng bo'lishi hech qanday muammo emas, faqat maxraj nolga aylanishi taqiqlangan.",
          'Если числитель равен нулю, проблемы нет, запрещён только нуль в знаменателе.',
          'If the numerator equals zero there is no problem, only a zero denominator is forbidden.',
        ),
      },
      {
        id: 'q2',
        tag: 'begona-ildizni-qabul-qilish',
        ask: L(
          "Maxrajlarni tozalab topilgan ildizni darrov javob deb yozsa bo'ladimi?",
          'Можно ли сразу записать в ответ корень, найденный после очистки знаменателей?',
          'Can the root found after clearing denominators be written as the answer right away?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q, avval ODZ bilan solishtirish kerak", 'Нет, сначала нужно сравнить с ОДЗ', 'No, it must be compared with the domain first') },
          { id: 'yes', label: L('Ha, darrov bo\'ladi', 'Да, можно сразу', 'Yes, right away') },
        ],
        ok: L(
          "To'g'ri. Har bir topilgan ildiz ODZ bilan solishtiriladi, shundagina javobga kiradi.",
          'Верно. Каждый найденный корень сравнивается с ОДЗ, только тогда он входит в ответ.',
          'Correct. Every found root is compared with the domain, only then does it belong to the answer.',
        ),
        hint: L(
          "3-ekranni eslang: uch topilgandan keyin ham u ODZ bilan solishtirilgan va rad etilgan edi.",
          'Вспомни 3 экран: даже после того как нашлась тройка, её сравнили с ОДЗ и отбросили.',
          'Recall screen 3: even after three was found, it was compared with the domain and rejected.',
        ),
      },
      {
        id: 'q3',
        tag: 'yechim-yoq-holati',
        ask: L(
          "Yagona topilgan ildiz begona bo'lib chiqsa, tenglama yechimga egami?",
          'Если единственный найденный корень оказался посторонним, есть ли у уравнения решение?',
          'If the only root found turns out to be extraneous, does the equation have a solution?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q, yechim yo'q", 'Нет, решений нет', 'No, no solution') },
          { id: 'yes', label: L("Ha, o'sha ildizning o'zi", 'Да, тот же самый корень', 'Yes, that same root') },
        ],
        ok: L(
          "To'g'ri. Begona ildiz rad etilgach, boshqa nomzod qolmasa, tenglamaning yechimi yo'q.",
          'Верно. Если после отбрасывания постороннего корня других кандидатов нет, у уравнения нет решения.',
          'Correct. If after rejecting the extraneous root no other candidates remain, the equation has no solution.',
        ),
        hint: L(
          "Begona ildiz javobga kirmaydi: u ODZ dan tashqarida, demak asl tenglamada ma'noga ega emas.",
          'Посторонний корень не входит в ответ: он вне ОДЗ, значит не имеет смысла в исходном уравнении.',
          'An extraneous root does not belong to the answer: it is outside the domain, so it has no meaning in the original equation.',
        ),
      },
      {
        id: 'q4',
        tag: 'butun-deb-kasr-oqish',
        ask: L(
          "X kvadrat bo'lingan x minus bir, teng x tenglamasida ODZ tekshirish kerakmi?",
          'В уравнении x в квадрате, делённое на x минус один, равно x, нужно ли проверять ОДЗ?',
          'In the equation x squared divided by x minus one equals x, does the domain need checking?',
        ),
        options: [
          { id: 'yes', right: true, label: L('Ha, kerak', 'Да, нужно', 'Yes, it does') },
          { id: 'no', label: L("Yo'q, bu butun tenglama", 'Нет, это целое уравнение', 'No, this is a whole equation') },
        ],
        ok: L(
          "To'g'ri. X minus bir maxrajda turibdi, demak bu kasr-ratsional tenglama, ODZ shart.",
          'Верно. x минус один стоит в знаменателе, значит это дробно-рациональное уравнение, ОДЗ обязательна.',
          'Correct. x minus one stands in the denominator, so this is a fractional-rational equation, the domain is required.',
        ),
        hint: L(
          "Maxrajga qarang: u yerda harf bormi? Bo'lsa, bu butun tenglama emas.",
          'Посмотри в знаменатель: есть ли там буква? Если есть, это не целое уравнение.',
          'Look at the denominator: is there a letter there? If so, this is not a whole equation.',
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
    "Kasr-ratsional tenglama: uch bosqich",
    'Дробно-рациональное уравнение: три этапа',
    'The fractional-rational equation: three stages',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda maxrajlarni tozalab topilgan songa darrov ishonib bo'lmasligini taxmin qildingiz. Bugun aynan shu ehtiyotkorlikni to'liq egallidingiz.",
      'На первом экране ты предположил, что числу, найденному после очистки знаменателей, сразу доверять нельзя. Сегодня ты полностью освоил именно эту осторожность.',
      'On the first screen you guessed that a number found after clearing denominators cannot be trusted right away. Today you fully mastered exactly this caution.'),
    A('s1',
      "Siz ODZ topishni, maxrajlarni tozalab yechishni va topilgan ildizni ODZ bilan solishtirishni o'rgandingiz.",
      'Ты освоил нахождение ОДЗ, решение с очисткой знаменателей и сравнение найденного корня с ОДЗ.',
      'You learned finding the domain, solving by clearing denominators, and comparing the found root with the domain.'),
    A('s2',
      "Keyingi darsda tenglamalar sistemasi: ikkita tenglama bir vaqtda qanoatlantirilishi kerak bo'ladi.",
      'В следующем уроке системы уравнений: два уравнения должны выполняться одновременно.',
      'The next lesson covers systems of equations: two equations must be satisfied at the same time.'),
  ],
  props: {
    mark: 'x ≠ 3',
    markNote: L(
      "ODZ dan tashqari qiymat",
      'значение вне ОДЗ',
      'a value outside the domain',
    ),
    lines: [
      L(
        "ODZ: maxrajni nolga aylantiradigan qiymatlar taqiqlanadi",
        'ОДЗ: запрещены значения, обращающие знаменатель в нуль',
        'The domain: values that make the denominator zero are forbidden',
      ),
      L(
        "Topilgan ildiz ODZ dan chetga chiqsa, u begona, rad etiladi",
        'Если найденный корень выходит за пределы ОДЗ, он посторонний, отбрасывается',
        'If the found root falls outside the domain, it is extraneous, it is rejected',
      ),
      L(
        "Yagona ildiz begona bo'lsa, javob: yechim yo'q",
        'Если единственный корень посторонний, ответ: решений нет',
        'If the only root is extraneous, the answer is: no solution',
      ),
    ],
    bridge: L(
      'Keyingi dars: tenglamalar sistemasi',
      'Следующий урок: система уравнений',
      'Next lesson: systems of equations',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     tool: 'pick', ...S1 },
  { role: 'support',  tag: 'maxraj-nolga-teng', ...S2 },
  { role: 'explain',  tag: 'begona-ildizni-qabul-qilish', ...S3 },
  { role: 'explain',  tag: 'begona-ildizni-qabul-qilish', ...S4 },
  { role: 'explain',  tag: 'yechim-yoq-holati', ...S5 },
  { role: 'explain',  tag: 'maxraj-nolga-teng', ...S6 },
  { role: 'explain',  tag: 'butun-deb-kasr-oqish', ...S7 },
  { role: 'rule',     tag: 'begona-ildizni-qabul-qilish', ...S8 },
  { role: 'practice', tool: 'track', tag: 'begona-ildizni-qabul-qilish', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'maxraj-nolga-teng', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'begona-ildizni-qabul-qilish', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'begona-ildizni-qabul-qilish', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'maxraj-nolga-teng', ...S13 },
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
