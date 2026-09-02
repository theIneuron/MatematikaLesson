// ============================================================================
// 9-sinf, Dars 11. O'RNIGA QO'YISH USULI.
//
// REDAKSIYA 1, 2026-08-27. Darslik: II bob, 14-§ «Sistemalarni yechishning
// turli usullari», 2-masala (72-bet) — bosh misol: x minus y kvadrat teng
// uch, x y kvadrat teng yigirma sakkiz. Y kvadratni birinchi tenglamadan
// ifodalab, ikkinchisiga qo'yish; x ning bir qiymatida y kvadrat manfiy
// chiqib, haqiqiy yechim yo'qligi ko'rsatiladi — bu darslikning O'Z
// diqqat markazi (68-69-bet, Zadacha 2 dagi uslub bilan bir xil). 3-masala
// (72-73-bet) — ikkinchi misol: kasr tenglamani yig'indi-ko'paytma
// ko'rinishiga keltirib, Dars09dagi Viyet teoremasi teskarisiga ulanadi.
//
// ASBOB: Track (7-8-darsdan) BU DARSDA ISHLATILMADI. Ilgari (Dars09
// izohida) o'rniga qo'yish va qo'shish usullari Trackka qoldirilgan edi,
// lekin darslikning o'zi bu ikkalasini ham YOZMA HISOB sifatida beradi
// (amal menyusi emas), Dars09dagidek. Shuning uchun bu yerda ham RecallMC
// intro/steps qatlami ishlatildi — Dars09 bilan bir xil qaror, faqat u
// yerda aniqlanmagan edi.
//
// TEGLAR (o'zining):
//   ozgaruvchini-ifodalash-xatosi — o'zgaruvchini ifodalashda ishora yoki
//                                  amal xatosi
//   manfiy-kvadrat-holati         — y kvadrat (yoki x kvadrat) manfiy
//                                  chiqqanda haqiqiy yechim yo'qligini
//                                  tan olmaslik
//   notogri-orniga-qoyish         — ifodani noto'g'ri tenglamaga yoki
//                                  noto'g'ri joyga qo'yish
//   kasr-birlashtirish-xatosi     — bir bo'lingan x qo'shi bir bo'lingan
//                                  y ni yig'indi-ko'paytma ko'rinishiga
//                                  noto'g'ri keltirish
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, MATH_FONT, RuleCard, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { G9_RECOLOR, G9_STYLES, RecallMC } from './asboblar.jsx'

export const META = {
  id: 'grade9-11',
  n: 11,
  row: 11,
  block: 'Б2',
  topic: L("O'rniga qo'yish usuli", 'Способ подстановки', 'The substitution method'),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "O'rniga qo'yish usulida bitta o'zgaruvchi (yoki uning darajasi) bir tenglamadan ifodalanadi va ikkinchi tenglamaga qo'yiladi",
    'В способе подстановки одна переменная (или её степень) выражается из одного уравнения и подставляется во второе',
    "In the substitution method, one variable (or its power) is expressed from one equation and substituted into the second",
  ),
  L(
    "Agar o'zgaruvchining kvadrati manfiy songa teng chiqsa, bu qiymatga mos haqiqiy yechim yo'q",
    'Если квадрат переменной оказывается равным отрицательному числу, для этого значения действительного решения нет',
    "If the square of a variable turns out to equal a negative number, there is no real solution for that value",
  ),
  L(
    "Bir bo'lingan x qo'shi bir bo'lingan y, x qo'shi y, bo'lingan x y ko'paytmasiga teng",
    'Единица, делённая на x, плюс единица, делённая на y, равна x плюс y, делённому на произведение x y',
    'One over x plus one over y equals x plus y, divided by the product xy',
  ),
]

export const MISS = {
  'ozgaruvchini-ifodalash-xatosi': {
    what: L(
      "o'zgaruvchini ifodalashda ishora yoki amal xatosi qilindi",
      'при выражении переменной допущена ошибка в знаке или действии',
      'a sign or operation mistake was made when expressing the variable',
    ),
    wrong: null,
    at: 0,
  },
  'manfiy-kvadrat-holati': {
    what: L(
      "o'zgaruvchining kvadrati manfiy chiqqanda haqiqiy yechim yo'qligi tan olinmadi",
      'когда квадрат переменной получился отрицательным, не было признано отсутствие действительного решения',
      'when the square of the variable came out negative, the absence of a real solution was not recognized',
    ),
    wrong: null,
    at: 0,
  },
  'notogri-orniga-qoyish': {
    what: L(
      "ifoda noto'g'ri tenglamaga yoki noto'g'ri joyga qo'yildi",
      'выражение подставлено не в то уравнение или не на то место',
      'the expression was substituted into the wrong equation or the wrong place',
    ),
    wrong: null,
    at: 0,
  },
  'kasr-birlashtirish-xatosi': {
    what: L(
      "ikki kasrni yig'indi-ko'paytma ko'rinishiga noto'g'ri keltirildi",
      'две дроби неверно приведены к виду сумма-произведение',
      'two fractions were incorrectly combined into sum-over-product form',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// EKRAN 1. XUK.
// ============================================================
const S1 = {
  eyebrow: L('IKKALASIDA HAM BOR', 'ЕСТЬ В ОБОИХ', 'IN BOTH OF THEM'),
  title: L(
    "Y kvadrat ikkala tenglamada ham bor",
    'y в квадрате есть в обоих уравнениях',
    'y squared appears in both equations',
  ),
  audio: [
    A('mount',
      "Sistema: x minus y kvadrat teng uch, x karra y kvadrat teng yigirma sakkiz. Ikkala tenglamada ham y kvadrat bor.",
      'Система: x минус y в квадрате равно трём, x, умноженное на y в квадрате, равно двадцати восьми. В обоих уравнениях есть y в квадрате.',
      'A system: x minus y squared equals three, x times y squared equals twenty-eight. Both equations have y squared.'),
    A('why',
      "Birinchi tenglamadan y kvadratni x orqali ifodalab, ikkinchisiga qo'yish mumkinmi?",
      'Можно ли выразить y в квадрате через x из первого уравнения и подставить во второе?',
      'Can y squared be expressed in terms of x from the first equation and substituted into the second?'),
  ],
  props: {
    askClass: 'g9-ask-big',
    cardsClass: 'g9-cards-small',
    ask: L(
      "Y kvadratni birinchi tenglamadan ifodalab, ikkinchisiga qo'yish mumkinmi?",
      'Можно ли выразить y в квадрате из первого уравнения и подставить во второе?',
      'Can y squared be expressed from the first equation and substituted into the second?',
    ),
    items: [
      { id: 'right', right: true, show: L('Ha, bu aynan usulning o\'zi', 'Да, это и есть сам способ', 'Yes, that is exactly the method') },
      {
        id: 'wrong',
        show: L("Yo'q, y kvadratni x bilan ifodalab bo'lmaydi", 'Нет, y в квадрате нельзя выразить через x', 'No, y squared cannot be expressed through x'),
        hint: L(
          "X minus y kvadrat uchga teng, demak y kvadrat x minus uchga teng: bu oddiy had ko'chirish.",
          'x минус y в квадрате равно трём, значит y в квадрате равно x минус три: это обычный перенос слагаемого.',
          'x minus y squared equals three, so y squared equals x minus three: this is ordinary transposition.',
        ),
      },
    ],
    after: L(
      "To'g'ri. Bugun aynan shu yo'l bilan sistemani bitta o'zgaruvchiga keltiramiz.",
      'Верно. Сегодня именно этим путём сводим систему к одной переменной.',
      'Correct. Today we reduce the system to one variable by exactly this path.',
    ),
  },
}

// ============================================================
// EKRAN 2. TAYANCH — had ko'chirish orqali ifodalash (7-8-darsdan).
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Had ko'chirishni eslash",
    'Вспоминаем перенос слагаемого',
    'Recalling transposition',
  ),
  audio: [
    A('mount',
      "7-darsdan savol: x minus y kvadrat teng uch tenglamasidan y kvadratni qanday ifodalaymiz?",
      'Вопрос с 7 урока: как выразить y в квадрате из уравнения x минус y в квадрате равно трём?',
      'A question from lesson 7: how do we express y squared from the equation x minus y squared equals three?'),
    A('why',
      "Minus y kvadratni narigi tomonga o'tkazing, ishorasi almashadi.",
      'Перенеси минус y в квадрате на другую сторону, знак поменяется.',
      'Move minus y squared to the other side, its sign flips.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('x − y² = 3', 'x − y² = 3', 'x − y² = 3')}
      steps={[
        { id: 'move', head: 'y²', lines: ['y² = x − 3'] },
      ]}
      ask={L(
        "Minus y kvadrat narigi tomonga o'tganda qanday bo'ladi?",
        'Каким становится минус y в квадрате при переносе на другую сторону?',
        'What does minus y squared become when moved to the other side?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: 'y² = x − 3' },
        {
          id: 'wrong',
          label: 'y² = x + 3',
          hint: L(
            "Tenglik belgisidan o'tgan had ishorasini almashtiradi: minus y kvadrat plyus y kvadrat bo'ladi, uchning o'zi esa o'z ishorasida qoladi.",
            'Слагаемое, переходя через знак равенства, меняет знак: минус y в квадрате становится плюс y в квадрате, а тройка остаётся со своим знаком.',
            'A term flips its sign when crossing the equals sign: minus y squared becomes plus y squared, while the three keeps its own sign.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Y kvadrat x minus uchga teng. Endi buni ikkinchi tenglamaga qo'yamiz.",
        'Верно. y в квадрате равно x минус три. Теперь подставим это во второе уравнение.',
        'Correct. y squared equals x minus three. Now we substitute this into the second equation.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — ORNIGA QO'YISH: bitta tenglama hosil bo'ladi.
// ============================================================
const S3 = {
  eyebrow: L("O'RNIGA QO'YISH", 'ПОДСТАНОВКА', 'SUBSTITUTION'),
  title: L(
    "Ikkinchi tenglamaga qo'yamiz",
    'Подставляем во второе уравнение',
    'We substitute into the second equation',
  ),
  audio: [
    A('mount',
      "Ikkinchi tenglama: x karra y kvadrat teng yigirma sakkiz. Y kvadrat o'rniga x minus uchni qo'ying.",
      'Второе уравнение: x, умноженное на y в квадрате, равно двадцати восьми. Вместо y в квадрате подставь x минус три.',
      'The second equation: x times y squared equals twenty-eight. Substitute x minus three in place of y squared.'),
    W('reduce',
      "Natijada faqat x qatnashgan tenglama qoladi: x karra, qavs, x minus uch, teng yigirma sakkiz.",
      'В результате остаётся уравнение только с x: x, умноженное на скобку x минус три, равно двадцати восьми.',
      'As a result, an equation with only x remains: x times the bracket x minus three, equals twenty-eight.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('xy² = 28,  y² = x − 3', 'xy² = 28,  y² = x − 3', 'xy² = 28,  y² = x − 3')}
      steps={[
        { id: 'sub', head: 'x(x − 3)', lines: ['x(x − 3) = 28'] },
        { id: 'open', head: 'x² − 3x', lines: ['x² − 3x − 28 = 0'] },
      ]}
      ask={L(
        "Nega y kvadrat o'rniga aynan x minus uch qo'yildi?",
        'Почему вместо y в квадрате подставили именно x минус три?',
        'Why was x minus three substituted in place of y squared?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L("Chunki birinchi tenglamadan y kvadrat aynan shunga teng ekani topilgan edi", 'Потому что из первого уравнения было найдено, что y в квадрате равно именно этому', 'Because from the first equation it was found that y squared equals exactly this'),
        },
        {
          id: 'wrong',
          label: L("Chunki x minus uch tasodifan mos keldi", 'Потому что x минус три случайно подошло', 'Because x minus three happened to fit by chance'),
          hint: L(
            "Bu tasodif emas: 2-ekranda y kvadrat x minus uchga teng ekani ko'chirish orqali aniq topilgan edi.",
            'Это не случайность: на 2 экране было точно найдено переносом, что y в квадрате равно x минус три.',
            'This is not chance: on screen 2 it was found exactly, by transposition, that y squared equals x minus three.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Endi sistemada faqat bitta o'zgaruvchi, x, qoldi: x kvadrat minus uch x minus yigirma sakkiz teng nol.",
        'Верно. Теперь в системе осталась только одна переменная, x: x в квадрате минус три x минус двадцать восемь равно нулю.',
        'Correct. Now only one variable, x, remains in the system: x squared minus three x minus twenty-eight equals zero.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — X NI TOPISH.
// ============================================================
const S4 = {
  eyebrow: L('X NI TOPISH', 'НАХОДИМ X', 'FINDING X'),
  title: L(
    "Hosil bo'lgan kvadrat tenglamani yechamiz",
    'Решаем получившееся квадратное уравнение',
    'We solve the resulting quadratic equation',
  ),
  audio: [
    A('mount',
      "X kvadrat minus uch x minus yigirma sakkiz teng nol. Ko'paytuvchilarga ajrating.",
      'x в квадрате минус три x минус двадцать восемь равно нулю. Разложи на множители.',
      'x squared minus three x minus twenty-eight equals zero. Factor it.'),
    A('why',
      "Ikkita son kerak: ko'paytmasi minus yigirma sakkiz, yig'indisi minus uch bo'lsin.",
      'Нужны два числа: их произведение минус двадцать восемь, а сумма минус три.',
      'Two numbers are needed: their product is minus twenty-eight, their sum is minus three.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('x² − 3x − 28 = 0', 'x² − 3x − 28 = 0', 'x² − 3x − 28 = 0')}
      steps={[
        { id: 'factor', head: 'x² − 3x − 28', lines: ['(x − 7)(x + 4) = 0'] },
        { id: 'roots', head: 'x', lines: ['x1 = 7,  x2 = −4'] },
      ]}
      ask={L(
        "Ikkita x qiymati topildi. Ikkalasi ham darrov javob deb qabul qilinadimi?",
        'Найдены два значения x. Оба сразу принимаются как ответ?',
        'Two values of x are found. Are both accepted as the answer right away?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L("Yo'q, har ikkalasi uchun y ni topib, mumkinligini tekshirish kerak", 'Нет, для каждого нужно найти y и проверить возможность', 'No, for each one y must be found and checked for possibility'),
        },
        {
          id: 'wrong',
          label: L("Ha, ikkalasi ham darrov x javobi", 'Да, оба сразу ответ для x', 'Yes, both are immediately the answer for x'),
          hint: L(
            "X faqat yordamchi o'zgaruvchi, asosiy javob (x; y) juftligi, shuning uchun har bir x uchun y ham topilishi kerak.",
            'x лишь вспомогательная переменная, основной ответ это пара (x; y), поэтому для каждого x нужно ещё найти y.',
            'x is only an auxiliary variable, the main answer is the pair (x; y), so y must still be found for each x.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. X ikkita qiymat oldi, lekin bu hali yakuniy javob emas: y ni topish kerak.",
        'Верно. x принял два значения, но это ещё не окончательный ответ: нужно найти y.',
        'Correct. x took two values, but this is not yet the final answer: y must be found.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — MANFIY KVADRAT: x = −4 RAD ETILADI.
// ============================================================
const S5 = {
  eyebrow: L('MANFIY KVADRAT', 'ОТРИЦАТЕЛЬНЫЙ КВАДРАТ', 'A NEGATIVE SQUARE'),
  title: L(
    "Y kvadrat manfiy bo'lsa, haqiqiy y yo'q",
    'Если y в квадрате отрицательно, действительного y нет',
    'If y squared is negative, there is no real y',
  ),
  audio: [
    A('mount',
      "X minus to'rt bo'lsa, y kvadrat x minus uchga teng, ya'ni minus to'rt minus uch, minus yetti.",
      'При x равном минус четырём, y в квадрате равно x минус три, то есть минус четыре минус три, минус семь.',
      'At x equal to minus four, y squared equals x minus three, that is minus four minus three, minus seven.'),
    A('why',
      "Har qanday haqiqiy sonning kvadrati manfiy bo'la olmaydi. Demak bu x qiymatiga mos y bormi?",
      'Квадрат любого действительного числа не может быть отрицательным. Значит, есть ли y для этого значения x?',
      'The square of any real number cannot be negative. So is there a y for this value of x?'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('x = −4,  y² = x − 3', 'x = −4,  y² = x − 3', 'x = −4,  y² = x − 3')}
      steps={[
        { id: 'calc', head: 'y²', lines: ['y² = −4 − 3', 'y² = −7'] },
      ]}
      ask={L(
        "Y kvadrat minus yettiga teng chiqdi. Bu x qiymatiga mos haqiqiy y bormi?",
        'y в квадрате получился равным минус семи. Есть ли действительный y для этого x?',
        'y squared came out equal to minus seven. Is there a real y for this x?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L("Yo'q, bunday y yo'q", 'Нет, такого y нет', 'No, there is no such y') },
        {
          id: 'wrong',
          label: L('Ha, y manfiy son bo\'ladi', 'Да, y будет отрицательным числом', 'Yes, y will be a negative number'),
          hint: L(
            "Savol y ning o'zi haqida emas, y kvadrat haqida: hech qanday haqiqiy sonning kvadrati manfiy bo'lmaydi, musbat son bo'lsa ham.",
            'Вопрос не про сам y, а про y в квадрате: квадрат никакого действительного числа не бывает отрицательным, даже если само число отрицательно.',
            "The question is not about y itself, but about y squared: the square of no real number is negative, even if the number itself is negative.",
          ),
        },
      ]}
      after={L(
        "To'g'ri. X minus to'rtga mos haqiqiy y yo'q, shuning uchun bu qiymat rad etiladi.",
        'Верно. Для x равного минус четырём действительного y нет, поэтому это значение отбрасывается.',
        'Correct. There is no real y for x equal to minus four, so this value is rejected.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — X=7 UCHUN Y NI TOPISH: IKKITA JAVOB.
// ============================================================
const S6 = {
  eyebrow: L('IKKI ISHORA', 'ДВА ЗНАКА', 'TWO SIGNS'),
  title: L(
    "Y kvadrat to'rtga teng bo'lganda ikkita y bor",
    'Когда y в квадрате равен четырём, есть два y',
    'When y squared equals four, there are two y',
  ),
  audio: [
    A('mount',
      "X yetti bo'lsa, y kvadrat yetti minus uch, ya'ni to'rt. Y ni topish uchun ildiz olamiz.",
      'При x равном семи, y в квадрате равно семь минус три, то есть четыре. Чтобы найти y, извлекаем корень.',
      'At x equal to seven, y squared equals seven minus three, that is four. To find y, we take the root.'),
    A('why',
      "To'rtning ildizi ikki, lekin y kvadrat ikkining ham, minus ikkining ham kvadratidan hosil bo'ladi.",
      'Корень из четырёх это два, но y в квадрате получается и из двух, и из минус двух.',
      'The root of four is two, but y squared results from both two and minus two.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('x = 7,  y² = 4', 'x = 7,  y² = 4', 'x = 7,  y² = 4')}
      steps={[
        { id: 'y', head: 'y', lines: [L('y = 2  yoki  y = −2', 'y = 2  или  y = −2', 'y = 2  or  y = −2')] },
      ]}
      ask={L(
        "Y kvadrat to'rtga teng bo'lganda y nechta qiymat oladi?",
        'Сколько значений принимает y, когда y в квадрате равен четырём?',
        'How many values does y take when y squared equals four?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('Ikkita: ikki va minus ikki', 'Два: два и минус два', 'Two: two and minus two') },
        {
          id: 'wrong',
          label: L('Bitta: faqat ikki', 'Одно: только два', 'One: only two'),
          hint: L(
            "Minus ikkining kvadratini ham hisoblang: minus ikki karra minus ikki ham to'rt beradi, demak u ham javob.",
            'Посчитай и квадрат минус двух: минус два на минус два тоже даёт четыре, значит это тоже ответ.',
            'Also compute the square of minus two: minus two times minus two also gives four, so it too is an answer.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. X yetti uchun ikkita javob bor: (yetti; ikki) va (yetti; minus ikki).",
        'Верно. Для x равного семи есть два ответа: (семь; два) и (семь; минус два).',
        'Correct. For x equal to seven there are two answers: (seven; two) and (seven; minus two).',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — IKKINCHI MISOL: KASRNI BIRLASHTIRISH,
// Dars09 BILAN BOG'LANISH.
// ============================================================
const S7 = {
  eyebrow: L('IKKINCHI MISOL', 'ВТОРОЙ ПРИМЕР', 'A SECOND EXAMPLE'),
  title: L(
    "Kasr sistemasi Viyet teoremasiga olib keladi",
    'Дробная система приводит к теореме Виета',
    'A fractional system leads to Vieta\'s theorem',
  ),
  audio: [
    A('mount',
      "Yangi sistema: x qo'shi y teng o'n ikki, bir bo'lingan x qo'shi bir bo'lingan y teng sakkizdan uch.",
      'Новая система: x плюс y равно двенадцати, единица делённая на x плюс единица делённая на y равно трём восьмым.',
      'A new system: x plus y equals twelve, one over x plus one over y equals three eighths.'),
    W('combine',
      "Ikkinchi tenglamadagi ikki kasrni birlashtiring: bir bo'lingan x qo'shi bir bo'lingan y, x qo'shi y, bo'lingan x y ga teng.",
      'Объедини две дроби во втором уравнении: единица делённая на x плюс единица делённая на y равно x плюс y, делённому на x y.',
      'Combine the two fractions in the second equation: one over x plus one over y equals x plus y, divided by x y.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('x + y = 12,  1/x + 1/y = 3/8', 'x + y = 12,  1/x + 1/y = 3/8', 'x + y = 12,  1/x + 1/y = 3/8')}
      steps={[
        { id: 'combine', head: '1/x + 1/y', lines: ['(x + y) / xy = 3/8'] },
        { id: 'sub', head: '(x + y) / xy', lines: ['12 / xy = 3/8', 'xy = 32'] },
      ]}
      ask={L(
        "Endi sistema qanday ko'rinishga keldi?",
        'В каком виде теперь система?',
        'What form does the system now take?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L("X qo'shi y o'n ikki, x y o'ttiz ikki: bu Viyet teoremasi teskarisi", 'x плюс y двенадцать, x y тридцать два: это теорема, обратная теореме Виета', 'x plus y twelve, x y thirty-two: this is the converse of Vieta\'s theorem'),
        },
        {
          id: 'wrong',
          label: L("Sistema butunlay yangi, hech narsaga o'xshamaydi", 'Система совершенно новая, ни на что не похожа', 'The system is completely new, unlike anything'),
          hint: L(
            "9-darsni eslang: x qo'shi y va x y berilgan sistema aynan Viyet teoremasi teskarisi bilan yechilar edi.",
            'Вспомни 9 урок: система с данными x плюс y и x y решалась именно теоремой, обратной теореме Виета.',
            'Recall lesson 9: a system with x plus y and x y given was solved exactly by the converse of Vieta\'s theorem.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. X qo'shi y o'n ikki, x y o'ttiz ikki, bu 9-darsdagi yo'l bilan yechiladi: z kvadrat minus o'n ikki z qo'shi o'ttiz ikki teng nol, ildizlari to'rt va sakkiz.",
        'Верно. x плюс y двенадцать, x y тридцать два, решается путём с 9 урока: z в квадрате минус двенадцать z плюс тридцать два равно нулю, корни четыре и восемь.',
        "Correct. x plus y twelve, x y thirty-two, solved by the path from lesson 9: z squared minus twelve z plus thirty-two equals zero, roots four and eight.",
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
    L(
      "Kasr tenglamalarda ikki kasrni yig'indi-ko'paytma ko'rinishiga keltirish ko'pincha sistemani soddalashtiradi",
      'В дробных уравнениях приведение двух дробей к виду сумма-произведение часто упрощает систему',
      'In fractional equations, combining two fractions into sum-over-product form often simplifies the system',
    ),
  ],
  source: L(
    "Algebra 9, 14-§, 2-3-masalalar (72-73-bet)",
    'Алгебра 9, §14, задачи 2-3 (стр. 72-73)',
    'Algebra 9, §14, problems 2-3 (p. 72-73)',
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
          "O'rniga qo'yish usulida x topilgach, yana nima qilish kerak?",
          'В способе подстановки, после того как найден x, что ещё нужно сделать?',
          'In the substitution method, after x is found, what else must be done?',
        )}
        cols={1}
        items={[
          {
            id: 'right', right: true,
            label: L("Har bir x uchun y ni topish va manfiy kvadratni tekshirish", 'Для каждого x найти y и проверить на отрицательный квадрат', 'Find y for each x and check for a negative square'),
          },
          {
            id: 'wrong',
            label: L("Hech narsa, x yakuniy javob", 'Ничего, x окончательный ответ', 'Nothing, x is the final answer'),
            hint: L(
              "4-5-ekranlarni eslang: x topilgandan keyin ham y kvadratni hisoblab, manfiy chiqmasligini tekshirgan edingiz.",
              'Вспомни 4-5 экраны: даже после нахождения x ты вычислял y в квадрате и проверял, не отрицательно ли оно.',
              'Recall screens 4-5: even after finding x, you computed y squared and checked it was not negative.',
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
    "O'rniga qo'yish va manfiy kvadrat tekshiruvi",
    'Подстановка и проверка на отрицательный квадрат',
    'Substitution and the negative-square check',
  ),
  audio: [
    A('mount',
      "Olti ekranda siz o'zgaruvchini ifodalashni, o'rniga qo'yishni va manfiy kvadratni tekshirishni o'z qo'lingiz bilan bajardingiz. Endi ular qoida sifatida.",
      'На шести экранах ты сам выражал переменную, подставлял и проверял на отрицательный квадрат. Теперь они в виде правила.',
      'On six screens you expressed the variable, substituted, and checked for a negative square with your own hands. Now here they are as a rule.'),
    W('card',
      "Qoida ochildi. Uchtasi ham darslikdan.",
      'Правило открылось. Все три из учебника.',
      'The rule is open. All three are from the textbook.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — ZANJIR: ifodalash, to'rtta.
// ============================================================
const S9 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "Tez ifodalash",
    'Быстро выражаем',
    'Quickly expressing',
  ),
  audio: [
    A('mount',
      "To'rtta tenglama ketma-ket. Har birida ko'rsatilgan o'zgaruvchini ifodalang.",
      'Четыре уравнения подряд. В каждом выражай указанную переменную.',
      'Four equations in a row. In each, express the indicated variable.'),
    A('why',
      "Had ko'chirish qoidasi bir xil: tenglik belgisidan o'tgan had ishorasini almashtiradi.",
      'Правило переноса одно: слагаемое, переходя через знак равенства, меняет знак.',
      'The transposition rule is the same: a term flips its sign when crossing the equals sign.'),
  ],
  props: {
    stepLabel: L('Tenglama', 'Уравнение', 'Equation'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "To'rttasi ham ifodalandi. Har safar bir xil yo'l: had ko'chirish.",
      'Все четыре выражены. Каждый раз один путь: перенос слагаемого.',
      'All four are expressed. Same path every time: transposition.',
    ),
    tasks: [
      {
        expr: 'x + y² = 10',
        question: L('Y kvadrat qanday ifodalanadi?', 'Как выражается y в квадрате?', 'How is y squared expressed?'),
        ok: L("Ha. X narigi tomonga o'tganda minus x bo'ladi.", 'Да. x при переносе на другую сторону становится минус x.', 'Yes. x becomes minus x when moved to the other side.'),
        items: [
          { id: 'a', right: true, label: 'y² = 10 − x' },
          { id: 'b', label: 'y² = 10 + x', hint: L("X ko'chirilganda ishorasini almashtiradi: plyus x emas, minus x bo'ladi.", 'x при переносе меняет знак: не плюс x, а минус x.', 'x flips sign when moved: not plus x, but minus x.') },
        ],
        solution: ['x + y² = 10', 'y² = 10 − x'],
      },
      {
        expr: '2x − y = 5',
        question: L('Y qanday ifodalanadi?', 'Как выражается y?', 'How is y expressed?'),
        ok: L("Ha. Minus y ko'chirilsa plyus y, besh esa minus besh bo'ladi, keyin ishora almashtiriladi.", 'Да. Минус y при переносе даёт плюс y, а пять становится минус пять, потом знак меняется.', 'Yes. Minus y when moved gives plus y, and five becomes minus five, then the sign is flipped.'),
        items: [
          { id: 'a', right: true, label: 'y = 2x − 5' },
          { id: 'b', label: 'y = 5 − 2x', hint: L("Qayta ko'chiring: ikki x o'z joyida qoladi, minus y ko'chirilganda plyus y bo'ladi, besh ham o'tkaziladi.", 'Перенеси заново: два x остаётся на месте, минус y при переносе становится плюс y, пять тоже переносится.', 'Redo the transposition: two x stays in place, minus y becomes plus y when moved, five is also transposed.') },
        ],
        solution: ['2x − y = 5', '−y = 5 − 2x', 'y = 2x − 5'],
      },
      {
        expr: 'x² − 3y = 7',
        question: L('X kvadrat qanday ifodalanadi?', 'Как выражается x в квадрате?', 'How is x squared expressed?'),
        ok: L("Ha. Minus uch y narigi tomonga o'tganda plyus uch y bo'ladi.", 'Да. Минус три y при переносе становится плюс три y.', 'Yes. Minus three y becomes plus three y when moved.'),
        items: [
          { id: 'a', right: true, label: 'x² = 7 + 3y' },
          { id: 'b', label: 'x² = 7 − 3y', hint: L("Uch y ning ishorasini tekshiring: u minus edi, ko'chirilganda plyus bo'ladi.", 'Проверь знак трёх y: он был минус, при переносе становится плюс.', 'Check the sign of three y: it was minus, it becomes plus when moved.') },
        ],
        solution: ['x² − 3y = 7', 'x² = 7 + 3y'],
      },
      {
        expr: '5 − y² = x',
        question: L('Y kvadrat qanday ifodalanadi?', 'Как выражается y в квадрате?', 'How is y squared expressed?'),
        ok: L("Ha. Ikkala hadni ham ko'chiring: besh o'ng tomonga, x chap tomonga, keyin ishorani tozalang.", 'Да. Перенеси оба слагаемых: пять направо, x налево, потом убери общий минус.', 'Yes. Transpose both terms: five to the right, x to the left, then clear the overall minus.'),
        items: [
          { id: 'a', right: true, label: 'y² = 5 − x' },
          { id: 'b', label: 'y² = x − 5', hint: L("Boshidan boshlang: minus y kvadrat x minus beshga teng, ikkala tomonni ham minus birga ko'paytiring.", 'Начни сначала: минус y в квадрате равно x минус пять, умножь обе части на минус один.', 'Start over: minus y squared equals x minus five, multiply both sides by minus one.') },
        ],
        solution: ['5 − y² = x', '−y² = x − 5', 'y² = 5 − x'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ — YO'NALTIRILGAN: yangi sistema, uch qadam.
// ============================================================
const S10 = {
  eyebrow: L('QADAMLAB', 'ПО ШАГАМ', 'STEP BY STEP'),
  title: L(
    "Yangi sistema: uch qadam",
    'Новая система: три шага',
    'A new system: three steps',
  ),
  audio: [
    A('mount',
      "Sistema: y minus x kvadrat teng minus besh, x y teng olti. Uch qadam, yordam yo'q, lekin har javobdan keyin yechim ochiladi.",
      'Система: y минус x в квадрате равно минус пяти, x y равно шести. Три шага, помощи нет, но после каждого ответа откроется решение.',
      'A system: y minus x squared equals minus five, x y equals six. Three steps, no help, but after each answer the solution opens.'),
    A('why',
      "Avval y ni ifodalang, keyin qo'ying, oxirida x ni toping.",
      'Сначала вырази y, потом подставь, в конце найди x.',
      'First express y, then substitute, finally find x.'),
  ],
  props: {
    stepLabel: L('Qadam', 'Шаг', 'Step'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uch qadam ham to'ldi: y ifodalandi, qo'yildi, x topildi.",
      'Все три шага пройдены: y выражен, подставлен, x найден.',
      'All three steps are done: y expressed, substituted, x found.',
    ),
    tasks: [
      {
        expr: 'y − x² = −5,  xy = 12',
        question: L('Y qanday ifodalanadi?', 'Как выражается y?', 'How is y expressed?'),
        ok: L("Ha. Minus x kvadrat ko'chirilganda plyus x kvadrat bo'ladi.", 'Да. Минус x в квадрате при переносе становится плюс x в квадрате.', 'Yes. Minus x squared becomes plus x squared when moved.'),
        items: [
          { id: 'a', right: true, label: 'y = x² − 5' },
          { id: 'b', label: 'y = −x² − 5', hint: L("X kvadratning ishorasini tekshiring: u minus edi, ko'chirilganda plyus bo'ladi.", 'Проверь знак x в квадрате: он был минус, при переносе становится плюс.', 'Check the sign of x squared: it was minus, it becomes plus when moved.') },
        ],
        solution: ['y − x² = −5', 'y = x² − 5'],
      },
      {
        expr: 'x(x² − 5) = 12',
        question: L('Qavs ochilgach qaysi tenglama hosil bo\'ladi?', 'Какое уравнение получается после раскрытия скобки?', 'Which equation is obtained after opening the bracket?'),
        ok: L("Ha. X karra x kvadrat, x kub. X karra minus besh, minus besh x.", 'Да. x на x в квадрате, x в кубе. x на минус пять, минус пять x.', 'Yes. x times x squared is x cubed. x times minus five is minus five x.'),
        items: [
          { id: 'a', right: true, label: 'x³ − 5x − 12 = 0' },
          { id: 'b', label: 'x³ − 5x + 12 = 0', hint: L("O'ng tomondagi o'n ikkini ko'chiring: u minus o'n ikkiga aylanadi, plyus o'n ikkiga emas.", 'Перенеси двенадцать справа: оно станет минус двенадцать, а не плюс двенадцать.', 'Transpose the twelve on the right: it becomes minus twelve, not plus twelve.') },
        ],
        solution: ['x(x² − 5) = 12', 'x³ − 5x − 12 = 0'],
      },
      {
        expr: 'x³ − 5x − 12 = 0,  x = 3',
        question: L('X uch bo\'lsa, tenglama to\'g\'ri chiqadimi?', 'Если x равен трём, уравнение верно?', 'If x equals three, does the equation hold?'),
        ok: L("Ha. Yigirma yetti minus o'n besh minus o'n ikki, nolga teng.", 'Да. Двадцать семь минус пятнадцать минус двенадцать, равно нулю.', 'Yes. Twenty-seven minus fifteen minus twelve, equals zero.'),
        items: [
          { id: 'a', right: true, label: L("Ha, to'g'ri", 'Да, верно', 'Yes, it holds') },
          { id: 'b', label: L("Yo'q, to'g'ri emas", 'Нет, неверно', 'No, it does not'), hint: L("Qo'yib hisoblang: uch kub yigirma yetti, besh karra uch o'n besh. Yigirma yetti minus o'n besh minus o'n ikki, nol.", 'Подставь и посчитай: три в кубе двадцать семь, пять на три пятнадцать. Двадцать семь минус пятнадцать минус двенадцать, ноль.', 'Substitute and compute: three cubed is twenty-seven, five times three is fifteen. Twenty-seven minus fifteen minus twelve is zero.') },
        ],
        solution: ['3³ − 5 · 3 − 12', '27 − 15 − 12 = 0', L("Demak x = 3 ildiz, y = 4", 'Значит x = 3 корень, y = 4', 'So x = 3 is a root, y = 4')],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — QOG'OZDA: manfiy kvadrat va y sonini topish.
// ============================================================
const S11 = {
  eyebrow: L('QOG\'OZDA', 'НА БУМАГЕ', 'ON PAPER'),
  title: L(
    "Faqat hisob: manfiy kvadrat va y",
    'Только счёт: отрицательный квадрат и y',
    'Just computation: negative square and y',
  ),
  audio: [
    A('mount',
      "Har savolda x qiymati berilgan, y kvadratni yoki y ni hisoblang.",
      'В каждом вопросе дано значение x, посчитай y в квадрате или y.',
      'Each question gives an x value, compute y squared or y.'),
    A('why',
      "Manfiy chiqsa, haqiqiy y yo'qligini unutmang.",
      'Не забудь: если получится отрицательным, действительного y нет.',
      'Do not forget: if it comes out negative, there is no real y.'),
  ],
  props: {
    stepLabel: L('Savol', 'Вопрос', 'Question'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham hisoblandi: ba'zida y bor, ba'zida yo'q, hisobning o'zi buni ko'rsatadi.",
      'Все три посчитаны: иногда y есть, иногда нет, сам счёт это показывает.',
      'All three are computed: sometimes y exists, sometimes not, the computation itself shows this.',
    ),
    tasks: [
      {
        expr: 'y² = x − 3,  x = 12',
        question: L('Y kvadrat nechiga teng, va haqiqiy y bormi?', 'Чему равен y в квадрате, и есть ли действительный y?', 'What does y squared equal, and is there a real y?'),
        ok: L("Ha. O'n ikki minus uch to'qqiz, musbat, demak y bor.", 'Да. Двенадцать минус три девять, положительно, значит y есть.', 'Yes. Twelve minus three is nine, positive, so y exists.'),
        items: [
          { id: 'a', right: true, label: L("To'qqiz, y bor", 'Девять, y есть', 'Nine, y exists') },
          { id: 'b', label: L("Minus to'qqiz, y yo'q", 'Минус девять, y нет', 'Minus nine, no y'), hint: L("Qo'yib hisoblang: o'n ikki minus uch, bu musbat to'qqiz beradi, minus emas.", 'Подставь и посчитай: двенадцать минус три, это даёт положительное девять, а не минус.', 'Substitute and compute: twelve minus three gives a positive nine, not minus.') },
        ],
        solution: ['y² = 12 − 3 = 9', L('Musbat, y = 3 yoki y = −3', 'Положительно, y = 3 или y = −3', 'Positive, y = 3 or y = −3')],
      },
      {
        expr: 'y² = x − 3,  x = 1',
        question: L('Y kvadrat nechiga teng, va haqiqiy y bormi?', 'Чему равен y в квадрате, и есть ли действительный y?', 'What does y squared equal, and is there a real y?'),
        ok: L("Yo'q. Bir minus uch minus ikki, manfiy, demak haqiqiy y yo'q.", 'Нет. Один минус три минус два, отрицательно, значит действительного y нет.', 'No. One minus three is minus two, negative, so there is no real y.'),
        items: [
          { id: 'a', label: L('Minus ikki, y bor', 'Минус два, y есть', 'Minus two, y exists'), hint: L("Y kvadrat manfiy chiqdi: hech qanday haqiqiy sonning kvadrati manfiy bo'lmaydi.", 'y в квадрате получился отрицательным: квадрат никакого действительного числа не бывает отрицательным.', 'y squared came out negative: the square of no real number is negative.') },
          { id: 'b', right: true, label: L("Minus ikki, y yo'q", 'Минус два, y нет', 'Minus two, no y') },
        ],
        solution: ['y² = 1 − 3 = −2', L("Manfiy, haqiqiy y yo'q", 'Отрицательно, действительного y нет', 'Negative, no real y')],
      },
      {
        expr: 'y = 2x² − 5,  x = 2',
        question: L('Y nechiga teng?', 'Чему равен y?', 'What does y equal?'),
        ok: L("Ha. Ikki karra to'rt sakkiz, sakkiz minus besh uch.", 'Да. Два на четыре восемь, восемь минус пять три.', 'Yes. Two times four is eight, eight minus five is three.'),
        items: [
          { id: 'a', right: true, label: '3' },
          { id: 'b', label: '−1', hint: L("Avval x kvadratni hisoblang: ikkining kvadrati to'rt, keyin ikkiga ko'paytiring, keyin beshni ayiring.", 'Сначала посчитай x в квадрате: квадрат двух равен четырём, потом умножь на два, потом вычти пять.', 'First compute x squared: the square of two is four, then multiply by two, then subtract five.') },
        ],
        solution: ['y = 2 · 2² − 5', 'y = 8 − 5 = 3'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ. Diyora manfiy kvadratni tekshirmasdan javob yozgan.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Tekshirilmagan manfiy kvadrat",
    'Непроверенный отрицательный квадрат',
    'An unchecked negative square',
  ),
  audio: [
    A('mount',
      "Diyoraning yechimi. U x minus y kvadrat teng olti, x y kvadrat teng yetti sistemasini yechib, x bir va x minus yetti ni topdi, ikkalasini ham javobga qo'shdi.",
      'Решение Диёры. Она решила систему x минус y в квадрате равно шести, x y в квадрате равно семи, нашла x равное одному и x равное минус семи, и добавила оба в ответ.',
      "Diyora's solution. She solved the system x minus y squared equals six, x y squared equals seven, found x equal to one and x equal to minus seven, and added both to the answer."),
    A('why',
      "X minus yetti uchun y kvadratni hisoblang: y kvadrat x minus oltiga teng edi.",
      'Посчитай y в квадрате для x равного минус семи: y в квадрате был равен x минус шести.',
      'Compute y squared for x equal to minus seven: y squared equaled x minus six.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "X minus yetti uchun y kvadrat manfiy chiqadi, demak bu qiymat rad etilishi kerak edi, Diyora buni tekshirmagan.",
      'Для x равного минус семи y в квадрате получается отрицательным, значит это значение нужно было отбросить, Диёра это не проверила.',
      'For x equal to minus seven, y squared comes out negative, so this value should have been rejected, Diyora did not check this.',
    ),
    tasks: [
      {
        expr: 'y² = x − 6,  x = −7',
        question: L(
          "X minus yetti uchun y kvadratni hisoblang. Bu qiymat javobga kirishi mumkinmi?",
          'Посчитай y в квадрате для x равного минус семи. Может ли это значение войти в ответ?',
          'Compute y squared for x equal to minus seven. Can this value belong to the answer?',
        ),
        ok: L(
          "Yo'q, kira olmaydi. Minus yetti minus olti minus o'n uch, manfiy: bunday y kvadrat bo'lishi mumkin emas, demak x minus yetti rad etiladi.",
          'Нет, не может. Минус семь минус шесть минус тринадцать, отрицательно: такого y в квадрате быть не может, значит x равное минус семи отбрасывается.',
          'No, it cannot. Minus seven minus six is minus thirteen, negative: y squared cannot be this, so x equal to minus seven is rejected.',
        ),
        items: [
          {
            id: 'a', right: true,
            label: L("Yo'q, y kvadrat manfiy chiqadi", 'Нет, y в квадрате отрицательно', 'No, y squared is negative'),
          },
          {
            id: 'b',
            label: L("Ha, kirishi mumkin, Diyora to'g'ri", 'Да, может войти, Диёра права', 'Yes, it can, Diyora is right'),
            hint: L("Hisoblang: minus yetti minus olti. Bu manfiy son beradi, y kvadrat esa manfiy bo'la olmaydi.", 'Посчитай: минус семь минус шесть. Это даёт отрицательное число, а y в квадрате не может быть отрицательным.', 'Compute: minus seven minus six. This gives a negative number, and y squared cannot be negative.'),
          },
        ],
        solution: [
          'y² = −7 − 6 = −13',
          L("Manfiy, haqiqiy y yo'q", 'Отрицательно, действительного y нет', 'Negative, no real y'),
          L("To'g'ri javob: faqat x = 1 dan chiqqan juftliklar", 'Верный ответ: только пары, полученные при x = 1', 'Correct answer: only the pairs coming from x = 1'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TESKARI TOPSHIRIQ — javobdan sistemaga.
// ============================================================
const S13 = {
  eyebrow: L('TESKARI', 'ОБРАТНОЕ', 'THE REVERSE'),
  title: L(
    "Javobdan sistemaga",
    'От ответа к системе',
    'From the answer to the system',
  ),
  audio: [
    A('mount',
      "Bu safar boshqa tomondan: y kvadratning qiymati berilgan, qaysi tenglama shu qiymatni berishini siz tanlaysiz.",
      'На этот раз наоборот: дано значение y в квадрате, а какое уравнение его даёт, выбираешь ты.',
      'This time it is the other way round: the value of y squared is given, you choose which equation gives it.'),
    A('why',
      "Har bir nomzodda x ni qo'yib, y kvadrat qanchaga teng chiqishini hisoblang.",
      'В каждом кандидате подставь x и посчитай, чему равен y в квадрате.',
      'In each candidate, substitute x and compute what y squared equals.',
    ),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Topildi: y kvadratning qiymatidan orqaga qaytib, mos tenglamani tanlash ham xuddi shu hisobga tayanadi.",
      'Найдено: путь от значения y в квадрате назад к уравнению опирается на тот же самый счёт.',
      'Found: going backward from the value of y squared to the equation relies on the same computation.',
    ),
    tasks: [
      {
        expr: 'x = 9, y² = 4',
        question: L(
          "X to'qqiz bo'lganda y kvadrat to'rtga teng bo'lishi kerak. Qaysi tenglama mos keladi?",
          'При x равном девяти y в квадрате должен быть равен четырём. Какое уравнение подходит?',
          'When x equals nine, y squared must equal four. Which equation fits?',
        ),
        ok: L("Ha. To'qqiz minus besh to'rtga teng.", 'Да. Девять минус пять равно четырём.', 'Yes. Nine minus five equals four.'),
        items: [
          { id: 'a', right: true, label: 'y² = x − 5' },
          { id: 'b', label: 'y² = x − 4', hint: L("Bu tenglamani sinab ko'ring: to'qqiz minus to'rt besh beradi, to'rt emas.", 'Проверь это уравнение: девять минус четыре даёт пять, а не четыре.', 'Check this equation: nine minus four gives five, not four.') },
        ],
        solution: ['y² = 9 − 5 = 4'],
      },
      {
        expr: 'x = 2, y² < 0',
        question: L(
          "X ikki bo'lganda y kvadrat manfiy bo'lishi, ya'ni yechim bo'lmasligi kerak. Qaysi tenglama mos keladi?",
          'При x равном двум y в квадрате должен быть отрицательным, то есть решения быть не должно. Какое уравнение подходит?',
          'When x equals two, y squared must be negative, that is, there should be no solution. Which equation fits?',
        ),
        ok: L("Ha. Ikki minus o'n manfiy sakkiz beradi.", 'Да. Два минус десять даёт минус восемь.', 'Yes. Two minus ten gives minus eight.'),
        items: [
          { id: 'a', right: true, label: 'y² = x − 10' },
          { id: 'b', label: 'y² = x + 10', hint: L("Bu tenglamani sinab ko'ring: ikki qo'shi o'n o'n ikki beradi, bu musbat, yechim bor bo'lib qoladi.", 'Проверь это уравнение: два плюс десять даёт двенадцать, это положительно, решение останется.', 'Check this equation: two plus ten gives twelve, this is positive, a solution would remain.') },
        ],
        solution: ['y² = 2 − 10 = −8', L("Manfiy, yechim yo'q", 'Отрицательно, решений нет', 'Negative, no solution')],
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
    "Blits: ifodalash, manfiy kvadrat, qo'yish",
    'Блиц: выражение, отрицательный квадрат, подстановка',
    'Blitz: expressing, negative square, substitution',
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
        tag: 'ozgaruvchini-ifodalash-xatosi',
        ask: L(
          "Minus x kvadrat had narigi tomonga o'tganda qanday ishora oladi?",
          'Какой знак получает слагаемое минус x в квадрате при переносе на другую сторону?',
          'What sign does the term minus x squared get when moved to the other side?',
        ),
        options: [
          { id: 'plus', right: true, label: L('Plyus', 'Плюс', 'Plus') },
          { id: 'minus', label: L('Minus', 'Минус', 'Minus') },
        ],
        ok: L(
          "To'g'ri. Tenglik belgisidan o'tgan har bir had ishorasini almashtiradi.",
          'Верно. Каждое слагаемое, переходя через знак равенства, меняет знак.',
          'Correct. Every term flips its sign when crossing the equals sign.',
        ),
        hint: L(
          "Had ko'chirish qoidasini eslang: narigi tomonga o'tganda ishora doim teskariga aylanadi.",
          'Вспомни правило переноса: при переходе на другую сторону знак всегда меняется на противоположный.',
          'Recall the transposition rule: crossing to the other side always flips the sign to the opposite.',
        ),
      },
      {
        id: 'q2',
        tag: 'manfiy-kvadrat-holati',
        ask: L(
          "Y kvadrat manfiy songa teng chiqsa, bu x qiymatiga mos haqiqiy y bormi?",
          'Если y в квадрате получается равным отрицательному числу, есть ли действительный y для этого x?',
          'If y squared comes out equal to a negative number, is there a real y for this x?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'yes', label: L('Ha', 'Да', 'Yes') },
        ],
        ok: L(
          "To'g'ri. Hech qanday haqiqiy sonning kvadrati manfiy bo'lmaydi, shuning uchun bunday x rad etiladi.",
          'Верно. Квадрат никакого действительного числа не бывает отрицательным, поэтому такой x отбрасывается.',
          'Correct. The square of no real number is negative, so such an x is rejected.',
        ),
        hint: L(
          "5-ekranni eslang: y kvadrat minus yettiga teng chiqqanda, bunday y yo'q edi.",
          'Вспомни 5 экран: когда y в квадрате получился равным минус семи, такого y не было.',
          'Recall screen 5: when y squared came out equal to minus seven, there was no such y.',
        ),
      },
      {
        id: 'q3',
        tag: 'notogri-orniga-qoyish',
        ask: L(
          "Ifoda birinchi tenglamadan topilgan bo'lsa, u qaysi tenglamaga qo'yiladi?",
          'Если выражение найдено из первого уравнения, в какое уравнение оно подставляется?',
          'If the expression is found from the first equation, into which equation is it substituted?',
        ),
        options: [
          { id: 'second', right: true, label: L('Ikkinchi tenglamaga', 'Во второе уравнение', 'Into the second equation') },
          { id: 'first', label: L('O\'sha birinchi tenglamaning o\'ziga', 'В то же первое уравнение', 'Into that same first equation') },
        ],
        ok: L(
          "To'g'ri. Ifoda topilgan tenglamaga emas, IKKINCHISIGA qo'yiladi, aks holda hech narsa soddalashmaydi.",
          'Верно. Выражение подставляется не в то же уравнение, а во ВТОРОЕ, иначе ничего не упростится.',
          'Correct. The expression is substituted not into the same equation but into the SECOND one, otherwise nothing simplifies.',
        ),
        hint: L(
          "3-ekranni eslang: y kvadrat birinchi tenglamadan topilib, ikkinchi tenglamaga qo'yilgan edi.",
          'Вспомни 3 экран: y в квадрате был найден из первого уравнения и подставлен во второе.',
          'Recall screen 3: y squared was found from the first equation and substituted into the second.',
        ),
      },
      {
        id: 'q4',
        tag: 'kasr-birlashtirish-xatosi',
        ask: L(
          "Bir bo'lingan x qo'shi bir bo'lingan y qanday yagona kasrga birlashadi?",
          'В какую единую дробь объединяется единица делённая на x плюс единица делённая на y?',
          'Into what single fraction do one over x plus one over y combine?',
        ),
        options: [
          { id: 'right', right: true, label: L("X qo'shi y, bo'lingan x y", '(x плюс y), делённое на x y', '(x plus y), divided by x y') },
          { id: 'wrong', label: L("X y, bo'lingan x qo'shi y", 'x y, делённое на (x плюс y)', 'x y, divided by (x plus y)') },
        ],
        ok: L(
          "To'g'ri. Umumiy maxraj x y, suratlar qo'shiladi: x qo'shi y.",
          'Верно. Общий знаменатель x y, числители складываются: x плюс y.',
          'Correct. The common denominator is x y, the numerators add: x plus y.',
        ),
        hint: L(
          "7-ekranni eslang: umumiy maxrajga keltirilganda surat x qo'shi y, maxraj x y bo'lgan edi.",
          'Вспомни 7 экран: при приведении к общему знаменателю числитель был x плюс y, знаменатель x y.',
          'Recall screen 7: when reduced to a common denominator, the numerator was x plus y, the denominator x y.',
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
    "O'rniga qo'yish: ifodalash, qo'yish, tekshirish",
    'Подстановка: выразить, подставить, проверить',
    'Substitution: express, substitute, check',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda y kvadratni ifodalab, o'rniga qo'yish mumkinligini taxmin qildingiz. Bugun aynan shu g'oyani to'liq egalladingiz.",
      'На первом экране ты предположил, что y в квадрате можно выразить и подставить. Сегодня ты полностью освоил именно эту идею.',
      'On the first screen you guessed that y squared could be expressed and substituted. Today you fully mastered exactly this idea.'),
    A('s1',
      "Siz o'zgaruvchini ifodalashni, o'rniga qo'yishni va manfiy kvadrat holatida haqiqiy yechim yo'qligini tan olishni o'rgandingiz.",
      'Ты освоил выражение переменной, подстановку и признание отсутствия действительного решения при отрицательном квадрате.',
      'You learned expressing a variable, substituting, and recognizing the absence of a real solution when the square is negative.'),
    A('s2',
      "Keyingi darsda qo'shish usuli: ikkala tenglamani birga qo'shib, o'zgaruvchilardan birini yo'qotish.",
      'В следующем уроке способ сложения: сложение обоих уравнений вместе, чтобы убрать одну из переменных.',
      'The next lesson covers the addition method: adding both equations together to eliminate one of the variables.'),
  ],
  props: {
    mark: 'y² = x − 3',
    markNote: L(
      "ifodalangan tenglama",
      'выраженное уравнение',
      'the expressed equation',
    ),
    lines: [
      L(
        "O'zgaruvchi bir tenglamadan ifodalanib, ikkinchisiga qo'yiladi",
        'Переменная выражается из одного уравнения и подставляется во второе',
        'The variable is expressed from one equation and substituted into the second',
      ),
      STATEMENTS[1],
      L(
        "Kasrlarni birlashtirish ko'pincha Viyet teoremasi teskarisiga olib keladi",
        'Объединение дробей часто приводит к теореме, обратной теореме Виета',
        "Combining fractions often leads to Vieta's converse",
      ),
    ],
    bridge: L(
      "Keyingi dars: qo'shish usuli",
      'Следующий урок: способ сложения',
      'Next lesson: the addition method',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     tool: 'pick', ...S1 },
  { role: 'support',  tag: 'ozgaruvchini-ifodalash-xatosi', ...S2 },
  { role: 'explain',  tag: 'notogri-orniga-qoyish', ...S3 },
  { role: 'explain',  tag: 'ozgaruvchini-ifodalash-xatosi', ...S4 },
  { role: 'explain',  tag: 'manfiy-kvadrat-holati', ...S5 },
  { role: 'explain',  tag: 'manfiy-kvadrat-holati', ...S6 },
  { role: 'explain',  tag: 'kasr-birlashtirish-xatosi', ...S7 },
  { role: 'rule',     tag: 'manfiy-kvadrat-holati', ...S8 },
  { role: 'practice', tool: 'drill', tag: 'ozgaruvchini-ifodalash-xatosi', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'notogri-orniga-qoyish', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'manfiy-kvadrat-holati', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'manfiy-kvadrat-holati', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'manfiy-kvadrat-holati', ...S13 },
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
