// ============================================================================
// 9-sinf, Dars 27. CHEKSIZ KAMAYUVCHI GEOMETRIK PROGRESSIYA.
//
// REDAKSIYA 1, 2026-08-27. Darslik: Algebra 9, 33-§ (171-174-bet).
//   Kirish (171-bet, 84-rasm): tomoni 1 bo'lgan kvadrat ichma-ich
//       quriladi, tomonlari 1, 1/2, 1/4, ... (q = 1/2), yuzlari esa
//       1, 1/4, 1/16, ... (q = 1/4). Ikkalasi ham nolga yaqinlashadi.
//   (3) misol (171-bet): 1, −1/3, 1/9, −1/27, ... — MANFIY maxrajli,
//       lekin baribir cheksiz kamayuvchi, chunki MODULI birdan kichik.
//   Ta'rif (172-bet): maxrajining MODULI birdan kichik bo'lgan
//       geometrik progressiya cheksiz kamayuvchi deyiladi.
//   1-masala (172-bet): b_n = 3/5ⁿ uchun q = 1/5, demak cheksiz
//       kamayuvchi.
//   85-rasm (172-bet): tomoni 1 bo'lgan kvadratning yarmi, keyin
//       qolganining yarmi shtrixlanadi: 1/2 + 1/4 + 1/8 + ... = 1.
//       S_n = 1 − 1/2ⁿ, va n o'sganda S_n birga intiladi. DARSNING
//       XUKI shu chizmadan olindi: cheksiz ko'p qo'shiluvchi CHEKLI
//       yig'indi berishi mumkinligi shu yerda ko'z bilan ko'rinadi.
//   Limit (173-bet): n → ∞ da 1/2ⁿ → 0. Bu 9-sinfda limitning
//       BIRINCHI uchrashi, shuning uchun 2- va 5-ekranda u faqat
//       «nolga intiladi» darajasida, ta'rifsiz beriladi.
//   Formula (5) (174-bet): S = b_1/(1 − q), faqat |q| < 1 da.
//       Xususiy hol b_1 = 1: 1 + q + q² + ... = 1/(1 − q).
//   2-masala (174-bet): 1/2, −1/6, 1/18, ... → q = −1/3, S = 3/8.
//   3-masala (174-bet): b_3 = −1, q = 1/7 → b_1 = −49, S = −343/6.
//   4-masala (174-175-bet): 0,(15) cheksiz davriy kasr → 15/99 = 5/33.
//
// TUZOQ (12-ekran) FORMULANING SHARTIGA QURILGAN. Kamron 1, 2, 4, 8
// qatoriga (5) formulani qo'llab, S = 1/(1 − 2) = −1 chiqargan. Javob
// nafaqat noto'g'ri, balki BEMA'NI: musbat sonlar yig'indisi manfiy
// bo'lishi mumkin emas. Shart buzilganda formula jim qolmaydi, u son
// beradi — shuning uchun shartni O'ZI tekshirish kerak. Bu 25-darsdagi
// q = 1 holidan kuchliroq: u yerda nolga bo'lish darrov ko'rinardi.
//
// TRANSFER — darslikning 4-masalasi: 0,151515... ni oddiy kasrga
// aylantirish. Davriy kasr aslida cheksiz kamayuvchi progressiyaning
// yig'indisi ekanini ko'rish — mavzuning butunlay boshqa sohaga
// (sonlarga) o'tishi.
//
// YANGI ASBOB YO'Q: barcha ekranlar `RecallMC` va `Drill` ustida.
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, RuleCard, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { G9_RECOLOR, G9_STYLES, RecallMC } from './asboblar.jsx'

export const META = {
  id: 'grade9-27',
  n: 27,
  row: 27,
  block: 'Б4',
  topic: L(
    'Cheksiz kamayuvchi geometrik progressiya',
    'Бесконечно убывающая геометрическая прогрессия',
    'An infinitely decreasing geometric progression',
  ),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "Maxrajining moduli birdan kichik bo'lgan geometrik progressiya cheksiz kamayuvchi deyiladi",
    'Геометрическая прогрессия, у которой модуль знаменателя меньше единицы, называется бесконечно убывающей',
    'A geometric progression whose ratio has modulus less than one is called infinitely decreasing',
  ),
  L(
    "Cheksiz ko'p qo'shiluvchi chekli yig'indi berishi mumkin, chunki hadlar nolga intiladi",
    'Бесконечно много слагаемых могут дать конечную сумму, потому что члены стремятся к нулю',
    'Infinitely many summands can give a finite sum, because the terms tend to zero',
  ),
  L(
    "Bunday progressiyaning yig'indisi b_1 ni bir minus q ga bo'lish bilan topiladi",
    'Сумма такой прогрессии находится делением b_1 на один минус q',
    'The sum of such a progression is found by dividing b_1 by one minus q',
  ),
]

export const MISS = {
  'modul-shartini-unutish': {
    what: L(
      "formula moduli birdan kichik bo'lmagan maxrajga qo'llanildi",
      'формула применена к знаменателю, модуль которого не меньше единицы',
      'the formula was applied to a ratio whose modulus is not less than one',
    ),
    wrong: null,
    at: 0,
  },
  'cheksiz-yigindi-cheksiz': {
    what: L(
      "cheksiz ko'p qo'shiluvchining yig'indisi ham cheksiz deb hisoblandi",
      'сумма бесконечного числа слагаемых сочтена бесконечной',
      'the sum of infinitely many summands was taken to be infinite',
    ),
    wrong: null,
    at: 0,
  },
  'birinchi-hadni-topmaslik': {
    what: L(
      "b_1 topilmasdan formulaga boshqa had qo'yildi",
      'в формулу подставлен другой член, а b_1 не найден',
      'another term was put into the formula without finding b_1',
    ),
    wrong: null,
    at: 0,
  },
  'davriy-kasrni-tanimaslik': {
    what: L(
      "davriy kasr ortida progressiya turgani ko'rilmadi",
      'за периодической дробью не увидена прогрессия',
      'the progression hidden behind a repeating decimal was not seen',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// EKRAN 1. XUK — darslikning 85-rasmi: kvadratni yarmilash.
// ============================================================
const S1 = {
  eyebrow: L('CHEKSIZ, LEKIN CHEKLI', 'БЕСКОНЕЧНО, НО КОНЕЧНО', 'INFINITE YET FINITE'),
  title: L(
    "Kvadratni yarmilab bo'lmaydi degan gap yo'q",
    'Делить квадрат пополам можно без конца',
    'A square can be halved without end',
  ),
  audio: [
    A('mount',
      "Tomoni bir bo'lgan kvadrat. Yarmini bo'yaymiz, bu bir ikkidan. Qolganining yarmini bo'yaymiz, bu bir to'rtdan. Yana yarmini, bir sakkizdan.",
      'Квадрат со стороной один. Закрасим половину, это одна вторая. Закрасим половину остатка, это одна четвёртая. Ещё половину, одна восьмая.',
      'A square of side one. Shade half of it, that is one half. Shade half of what is left, one quarter. Half again, one eighth.'),
    A('why',
      "Bunday cheksiz davom etish mumkin. Bo'yalgan bo'laklarning yuzlari qo'shiladi va kvadratni to'ldirib boradi.",
      'Так можно продолжать бесконечно. Площади закрашенных кусков складываются и заполняют квадрат.',
      'This can go on forever. The areas of the shaded pieces add up and fill the square.'),
  ],
  props: {
    askClass: 'g9-ask-big',
    cardsClass: 'g9-cards-small',
    ask: L(
      "Bir ikkidan qo'shuv bir to'rtdan qo'shuv bir sakkizdan va shu tarzda cheksiz. Yig'indi nimaga teng bo'ladi?",
      'Одна вторая плюс одна четвёртая плюс одна восьмая и так до бесконечности. Чему будет равна сумма?',
      'One half plus one quarter plus one eighth and so on forever. What will the sum be?',
    ),
    items: [
      {
        id: 'right', right: true,
        show: L(
          "Birga: butun kvadrat bo'yaladi",
          'Единице: закрасится весь квадрат',
          'One: the whole square gets shaded',
        ),
      },
      {
        id: 'wrong',
        show: L(
          "Cheksizlikka: qo'shiluvchilar cheksiz ko'p",
          'Бесконечности: слагаемых бесконечно много',
          'Infinity: there are infinitely many summands',
        ),
        hint: L(
          "Bo'yalgan bo'laklar kvadratning ichida. Ular hech qachon kvadratdan chiqib keta olmaydi, demak yig'indi birdan katta bo'lolmaydi.",
          'Закрашенные куски лежат внутри квадрата. Они никогда не выйдут за его пределы, значит сумма не может превысить единицу.',
          'The shaded pieces lie inside the square. They can never leave it, so the sum cannot exceed one.',
        ),
      },
    ],
    after: L(
      "Ha. Qo'shiluvchilar cheksiz ko'p, lekin ular tobora kichrayadi va butun kvadratdan chiqmaydi. Bugun shu narsani hisoblashni o'rganamiz.",
      'Да. Слагаемых бесконечно много, но они всё мельче и не выходят за квадрат. Сегодня научимся такое считать.',
      'Yes. There are infinitely many summands, but they shrink and never leave the square. Today we learn to compute such a thing.',
    ),
  },
}

// ============================================================
// EKRAN 2. TAYANCH — S_n = 1 − 1/2ⁿ.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Qismiy yig'indilar birga yaqinlashadi",
    'Частичные суммы подходят к единице',
    'The partial sums close in on one',
  ),
  audio: [
    A('mount',
      "25-darsning formulasi bilan dastlabki n ta bo'lakning yig'indisini hisoblaymiz. U bir minus bir ikkining n darajasidan chiqadi.",
      'По формуле 25 урока посчитаем сумму первых n кусков. Она равна единице минус одна вторая в степени n.',
      'By the lesson 25 formula, the sum of the first n pieces equals one minus one half to the n.'),
    A('why',
      "Bir ikkidan, uch to'rtdan, yetti sakkizdan, o'n besh o'n oltidan. Bu sonlar qayerga borayapti?",
      'Одна вторая, три четвёртых, семь восьмых, пятнадцать шестнадцатых. Куда идут эти числа?',
      'One half, three quarters, seven eighths, fifteen sixteenths. Where are these numbers heading?'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('Sₙ = 1 − 1/2ⁿ', 'Sₙ = 1 − 1/2ⁿ', 'Sₙ = 1 − 1/2ⁿ')}
      steps={[
        { id: 'a', head: L('Qismiy yigindilar', 'Частичные суммы', 'Partial sums'), lines: ['1/2,  3/4,  7/8,  15/16, ...'] },
      ]}
      ask={L(
        "n o'sganda ayiriladigan bir ikkining n darajasi nima bo'ladi?",
        'Что происходит с вычитаемым одна вторая в степени n при росте n?',
        'What happens to the subtracted one half to the n as n grows?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L("Nolga yaqinlashadi, lekin nolga aylanmaydi", 'Приближается к нулю, но нулём не становится', 'It closes in on zero without ever becoming zero'),
        },
        {
          id: 'wrong',
          label: L("Birga yaqinlashadi", 'Приближается к единице', 'It closes in on one'),
          hint: L(
            "Sonlarni ko'ring: bir ikkidan, bir to'rtdan, bir sakkizdan, bir o'n oltidan. Ular kattalashyaptimi yoki kichrayyaptimi?",
            'Посмотри на числа: одна вторая, одна четвёртая, одна восьмая, одна шестнадцатая. Они растут или уменьшаются?',
            'Look at the numbers: one half, one quarter, one eighth, one sixteenth. Are they growing or shrinking?',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Ayiriladigan qism nolga intiladi, demak yig'indining o'zi birga intiladi. Xukdagi kvadrat aynan shuni ko'rsatgandi.",
        'Верно. Вычитаемое стремится к нулю, значит сама сумма стремится к единице. Квадрат из хука показывал именно это.',
        'Correct. The subtracted part tends to zero, so the sum itself tends to one. The square in the opening showed exactly that.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — ta'rif: MODUL.
// ============================================================
const S3 = {
  eyebrow: L('MODUL MUHIM', 'ВАЖЕН МОДУЛЬ', 'THE MODULUS MATTERS'),
  title: L(
    "Manfiy maxraj ham kamayuvchi bo'lishi mumkin",
    'Отрицательный знаменатель тоже может убывать',
    'A negative ratio can also be decreasing',
  ),
  audio: [
    A('mount',
      "Bir, minus bir uchdan, bir to'qqizdan, minus bir yigirma yettidan. Hadlar navbatma-navbat musbat va manfiy.",
      'Один, минус одна третья, одна девятая, минус одна двадцать седьмая. Члены чередуются: положительный, отрицательный.',
      'One, minus one third, one ninth, minus one twenty seventh. The terms alternate positive and negative.'),
    A('why',
      "Qator kamayyaptimi? Ishoralarni chetga qo'yib, sonlarning kattaligiga qarang.",
      'Убывает ли ряд? Отбрось знаки и посмотри на величину чисел.',
      'Is the row decreasing? Set the signs aside and look at the magnitudes.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('1, −1/3, 1/9, −1/27, ...', '1, −1/3, 1/9, −1/27, ...', '1, −1/3, 1/9, −1/27, ...')}
      steps={[
        { id: 'a', head: L('Maxraj', 'Знаменатель', 'The ratio'), lines: ['q = −1/3'] },
      ]}
      ask={L(
        "Bu progressiya cheksiz kamayuvchimi?",
        'Является ли эта прогрессия бесконечно убывающей?',
        'Is this progression infinitely decreasing?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('Ha', 'Да', 'Yes') },
        {
          id: 'wrong',
          label: L("Yo'q, maxraj manfiy", 'Нет, знаменатель отрицателен', 'No, the ratio is negative'),
          hint: L(
            "Shart maxrajning o'zi haqida emas, uning MODULI haqida. Minus bir uchdanning moduli bir uchdan, u birdan kichik.",
            'Условие не о самом знаменателе, а о его МОДУЛЕ. Модуль минус одной третьей это одна третья, она меньше единицы.',
            'The condition is not about the ratio itself but about its MODULUS. The modulus of minus one third is one third, which is less than one.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Hadlar ishorasini almashtirsa ham, kattaligi bo'yicha nolga yaqinlashadi. Shart shunday yoziladi: q ning moduli birdan kichik.",
        'Верно. Члены меняют знак, но по величине приближаются к нулю. Условие пишется так: модуль q меньше единицы.',
        'Correct. The terms change sign but shrink towards zero in magnitude. The condition reads: the modulus of q is less than one.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — darslikning 1-masalasi.
// ============================================================
const S4 = {
  eyebrow: L('FORMULA ORQALI BERILGAN', 'ЗАДАНА ФОРМУЛОЙ', 'GIVEN BY A FORMULA'),
  title: L(
    "Qator yozilmagan, faqat formula berilgan",
    'Ряд не выписан, дана только формула',
    'The row is not written out, only a formula',
  ),
  audio: [
    A('mount',
      "N-hadi uch bo'lingan beshning n darajasi formulasi bilan berilgan. Bu progressiya cheksiz kamayuvchimi?",
      'N-й член задан формулой три делить на пять в степени n. Бесконечно убывающая ли эта прогрессия?',
      'The n-th term is given by three over five to the n. Is this progression infinitely decreasing?'),
    A('why',
      "Ikkita hadni yozib, ularning nisbatini oling.",
      'Выпиши два члена и возьми их отношение.',
      'Write out two terms and take their ratio.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('bₙ = 3/5ⁿ', 'bₙ = 3/5ⁿ', 'bₙ = 3/5ⁿ')}
      steps={[
        { id: 'a', head: L('Ikkita had', 'Два члена', 'Two terms'), lines: ['b₁ = 3/5', 'b₂ = 3/25'] },
      ]}
      ask={L(
        "Maxraj nechaga teng?",
        'Чему равен знаменатель?',
        'What does the ratio equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: 'q = 1/5' },
        {
          id: 'wrong',
          label: 'q = 3/5',
          hint: L(
            "Uch beshdan bu BIRINCHI had, maxraj emas. Maxraj ikkinchi hadni birinchisiga bo'lgandan chiqadi.",
            'Три пятых это ПЕРВЫЙ член, а не знаменатель. Знаменатель выходит делением второго члена на первый.',
            'Three fifths is the FIRST term, not the ratio. The ratio comes from dividing the second term by the first.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bir beshdanning moduli birdan kichik, demak progressiya cheksiz kamayuvchi. Uchlar qisqarib ketdi.",
        'Верно. Модуль одной пятой меньше единицы, значит прогрессия бесконечно убывающая. Тройки сократились.',
        'Correct. The modulus of one fifth is less than one, so the progression is infinitely decreasing. The threes cancelled.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — formulaning chiqarilishi.
// ============================================================
const S5 = {
  eyebrow: L('FORMULA QAYERDAN', 'ОТКУДА ФОРМУЛА', 'WHERE THE FORMULA COMES FROM'),
  title: L(
    "Ikkinchi qo'shiluvchi yo'qoladi",
    'Второе слагаемое исчезает',
    'The second summand vanishes',
  ),
  audio: [
    A('mount',
      "25-darsning formulasini boshqacha yozamiz: b bir bo'lingan bir minus q, minus b bir bo'lingan bir minus q, karra q ning n darajasi.",
      'Запишем формулу 25 урока иначе: b один делить на один минус q, минус b один делить на один минус q, умножить на q в степени n.',
      'Write the lesson 25 formula differently: b one over one minus q, minus b one over one minus q, times q to the n.'),
    A('why',
      "q ning moduli birdan kichik bo'lgani uchun uning n darajasi nolga intiladi.",
      'Так как модуль q меньше единицы, его степень n стремится к нулю.',
      'Since the modulus of q is less than one, its n-th power tends to zero.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L(
        'Sₙ = b₁ : (1 − q)  −  b₁ : (1 − q) · qⁿ',
        'Sₙ = b₁ : (1 − q)  −  b₁ : (1 − q) · qⁿ',
        'Sₙ = b₁ : (1 − q)  −  b₁ : (1 − q) · qⁿ',
      )}
      steps={[
        { id: 'a', head: L('Ikkinchi qoshiluvchi', 'Второе слагаемое', 'The second summand'), lines: ['qⁿ → 0'] },
      ]}
      ask={L(
        "n cheksiz o'sganda nima qoladi?",
        'Что останется, когда n бесконечно вырастет?',
        'What remains when n grows without bound?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: 'S = b₁ : (1 − q)' },
        {
          id: 'wrong',
          label: 'S = 0',
          hint: L(
            "Nolga intiladigani faqat IKKINCHI qo'shiluvchi. Birinchisi n ga umuman bog'liq emas, u joyida qoladi.",
            'К нулю стремится только ВТОРОЕ слагаемое. Первое от n вообще не зависит и остаётся на месте.',
            'Only the SECOND summand tends to zero. The first does not depend on n at all and stays put.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Birinchi qo'shiluvchi n ga bog'liq emas, ikkinchisi esa yo'qoladi. Cheksiz kamayuvchi progressiyaning yig'indisi shu.",
        'Верно. Первое слагаемое от n не зависит, а второе исчезает. Это и есть сумма бесконечно убывающей прогрессии.',
        'Correct. The first summand does not depend on n, and the second vanishes. That is the sum of an infinitely decreasing progression.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — darslikning 2-masalasi.
// ============================================================
const S6 = {
  eyebrow: L('MANFIY MAXRAJ BILAN', 'С ОТРИЦАТЕЛЬНЫМ ЗНАМЕНАТЕЛЕМ', 'WITH A NEGATIVE RATIO'),
  title: L(
    "Minusni maxrajga qo'yganda plyusga aylanadi",
    'Минус в знаменателе превращается в плюс',
    'The minus in the denominator turns into a plus',
  ),
  audio: [
    A('mount',
      "Bir ikkidan, minus bir oltidan, bir o'n sakkizdan. Maxraj minus bir uchdanga teng.",
      'Одна вторая, минус одна шестая, одна восемнадцатая. Знаменатель равен минус одной третьей.',
      'One half, minus one sixth, one eighteenth. The ratio equals minus one third.'),
    A('why',
      "Formulada bir minus q turibdi. q ning o'zi manfiy, demak ayirish qo'shishga aylanadi.",
      'В формуле стоит один минус q. Сам q отрицателен, значит вычитание превращается в сложение.',
      'The formula has one minus q. Since q itself is negative, the subtraction becomes an addition.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('1/2, −1/6, 1/18, ...', '1/2, −1/6, 1/18, ...', '1/2, −1/6, 1/18, ...')}
      steps={[
        { id: 'a', head: L('Maxraj', 'Знаменатель', 'The ratio'), lines: ['q = −1/3'] },
        { id: 'b', head: L('Formulaga', 'В формулу', 'Into the formula'), lines: ['S = (1/2) : (1 + 1/3)'] },
      ]}
      ask={L(
        "Yig'indi nechaga teng?",
        'Чему равна сумма?',
        'What does the sum equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: 'S = 3/8' },
        {
          id: 'wrong',
          label: 'S = 3/4',
          hint: L(
            "Uch to'rtdan maxrajga bir minus bir uchdan qo'yilganda chiqadi. Lekin q manfiy, demak bir MINUS minus bir uchdan, ya'ni bir qo'shuv bir uchdan.",
            'Три четвёртых выходят, если в знаменателе один минус одна третья. Но q отрицателен, значит один МИНУС минус одна третья, то есть один плюс одна третья.',
            'Three quarters appear if the denominator is one minus one third. But q is negative, so it is one MINUS minus one third, that is one plus one third.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Maxrajda to'rt uchdan, bir ikkidanni unga bo'lsak uch sakkizdan chiqadi.",
        'Верно. В знаменателе четыре третьих, делим на них одну вторую и получаем три восьмых.',
        'Correct. The denominator is four thirds, dividing one half by it gives three eighths.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — darslikning 3-masalasi: avval b_1.
// ============================================================
const S7 = {
  eyebrow: L('AVVAL BIRINCHI HAD', 'СНАЧАЛА ПЕРВЫЙ ЧЛЕН', 'THE FIRST TERM FIRST'),
  title: L(
    "Formulaga faqat birinchi had kiradi",
    'В формулу входит только первый член',
    'Only the first term goes into the formula',
  ),
  audio: [
    A('mount',
      "Uchinchi had minus bir, maxraj bir yettidan. Yig'indini toping.",
      'Третий член минус один, знаменатель одна седьмая. Найди сумму.',
      'The third term is minus one, the ratio is one seventh. Find the sum.'),
    A('why',
      "Formulada b bir turibdi, bizda esa b uch bor. Uchinchidan birinchisiga qaytish kerak.",
      'В формуле стоит b один, а у нас b три. Нужно вернуться от третьего к первому.',
      'The formula wants b one, and we have b three. We must walk back from the third to the first.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('b₃ = −1,  q = 1/7', 'b₃ = −1,  q = 1/7', 'b₃ = −1,  q = 1/7')}
      steps={[
        { id: 'a', head: L('Uchinchi had', 'Третий член', 'The third term'), lines: ['−1 = b₁ · (1/7)²', '−1 = b₁ : 49'] },
      ]}
      ask={L(
        "Birinchi had nechaga teng?",
        'Чему равен первый член?',
        'What does the first term equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: 'b₁ = −49' },
        {
          id: 'wrong',
          label: 'b₁ = −1/49',
          hint: L(
            "Progressiya kamayuvchi, demak birinchi had uchinchisidan KATTA bo'lishi kerak, kichik emas. Bo'lish o'rniga ko'paytirish kerak.",
            'Прогрессия убывающая, значит первый член должен быть БОЛЬШЕ третьего по величине, а не меньше. Нужно умножать, а не делить.',
            'The progression is decreasing, so the first term must be LARGER in magnitude than the third, not smaller. Multiply rather than divide.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Endi formulaga qo'yamiz: minus qirq to'qqiz bo'lingan olti yettidan, natija minus ellik yetti butun bir oltidan.",
        'Верно. Теперь в формулу: минус сорок девять делить на шесть седьмых, получается минус пятьдесят семь целых одна шестая.',
        'Correct. Now into the formula: minus forty nine over six sevenths gives minus fifty seven and one sixth.',
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
    "Algebra 9, 33-§, ta'rif va 1-3-masalalar (171-174-bet)",
    'Алгебра 9, §33, определение и задачи 1-3 (стр. 171-174)',
    'Algebra 9, §33, the definition and problems 1-3 (p. 171-174)',
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
          "Formulani qo'llashdan oldin nima tekshiriladi?",
          'Что проверяется перед применением формулы?',
          'What is checked before the formula is applied?',
        )}
        cols={1}
        items={[
          {
            id: 'right', right: true,
            label: L("Maxrajning moduli birdan kichikmi", 'Меньше ли модуль знаменателя единицы', 'Whether the modulus of the ratio is less than one'),
          },
          {
            id: 'wrong',
            label: L("Birinchi had musbatmi", 'Положителен ли первый член', 'Whether the first term is positive'),
            hint: L(
              "7-ekranda birinchi had minus qirq to'qqiz edi, va formula bemalol ishladi. Ishora emas, maxrajning kattaligi muhim.",
              'На 7 экране первый член был минус сорок девять, и формула прекрасно сработала. Важен не знак, а величина знаменателя.',
              'On screen 7 the first term was minus forty nine and the formula worked fine. What matters is the size of the ratio, not a sign.',
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
    "Modul, nolga intilish va bitta kasr",
    'Модуль, стремление к нулю и одна дробь',
    'The modulus, the tending to zero, and one fraction',
  ),
  audio: [
    A('mount',
      "Yetti ekranda siz cheksiz yig'indi chekli bo'lishini ko'rdingiz, shartni modul orqali yozdingiz va formulani chiqardingiz.",
      'На семи экранах ты увидел, что бесконечная сумма бывает конечной, записал условие через модуль и вывел формулу.',
      'On seven screens you saw an infinite sum come out finite, wrote the condition through the modulus, and derived the formula.'),
    W('card',
      "Qoida ochildi. Barchasi darslikdan.",
      'Правило открылось. Всё из учебника.',
      'The rule is open. Everything is from the textbook.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — ZANJIR: cheksiz kamayuvchimi.
// ============================================================
const S9 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "Shart bajarilyaptimi",
    'Выполняется ли условие',
    'Is the condition met',
  ),
  audio: [
    A('mount',
      "Uchta progressiya. Har birida shart bajarilishini tekshiring.",
      'Три прогрессии. В каждой проверь выполнение условия.',
      'Three progressions. Check the condition in each.'),
    A('why',
      "Maxrajning o'zini emas, uning modulini birga solishtiring.",
      'Сравнивай с единицей не сам знаменатель, а его модуль.',
      'Compare not the ratio itself with one, but its modulus.'),
  ],
  props: {
    stepLabel: L('Progressiya', 'Прогрессия', 'Progression'),
    solutionLabel: L('TEKSHIRUV', 'ПРОВЕРКА', 'THE CHECK'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham tekshirildi. Ishora hech narsani hal qilmaydi, faqat modul hal qiladi.",
      'Все три проверены. Знак ничего не решает, решает только модуль.',
      'All three are checked. The sign decides nothing, only the modulus does.',
    ),
    tasks: [
      {
        expr: '8, 4, 2, 1, ...',
        question: L('Bu progressiya cheksiz kamayuvchimi?', 'Является ли эта прогрессия бесконечно убывающей?', 'Is this progression infinitely decreasing?'),
        ok: L("Ha. Maxraj bir ikkidan, uning moduli birdan kichik.", 'Да. Знаменатель одна вторая, его модуль меньше единицы.', 'Yes. The ratio is one half, and its modulus is less than one.'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Hadlar sakkizdan bittagacha tushyapti, ya'ni kamayyapti. Maxrajni hisoblang: to'rt bo'lingan sakkiz.", 'Члены падают с восьми до единицы, то есть убывают. Посчитай знаменатель: четыре делить на восемь.', 'The terms fall from eight to one, so they decrease. Compute the ratio: four over eight.') },
        ],
        solution: ['q = 4 : 8 = 1/2', '|1/2| < 1'],
      },
      {
        expr: '2, −3, 4,5, ...',
        question: L('Bu progressiya cheksiz kamayuvchimi?', 'Является ли эта прогрессия бесконечно убывающей?', 'Is this progression infinitely decreasing?'),
        ok: L("Yo'q. Maxraj minus bir butun besh o'ndan, uning moduli birdan katta, hadlar o'sib boradi.", 'Нет. Знаменатель минус одна целая пять десятых, его модуль больше единицы, члены растут.', 'No. The ratio is minus one point five, its modulus exceeds one, and the terms grow.'),
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Hadlarning kattaligiga qarang: ikki, uch, to'rt butun besh o'ndan. Ular kichrayayotgani yo'q, aksincha o'syapti.", 'Посмотри на величину членов: два, три, четыре целых пять десятых. Они не уменьшаются, а растут.', 'Look at the magnitudes: two, three, four point five. They are not shrinking, they are growing.') },
        ],
        solution: ['q = (−3) : 2 = −1,5', '|−1,5| > 1'],
      },
      {
        expr: '−1, 1/4, −1/16, ...',
        question: L('Bu progressiya cheksiz kamayuvchimi?', 'Является ли эта прогрессия бесконечно убывающей?', 'Is this progression infinitely decreasing?'),
        ok: L("Ha. Maxraj minus bir to'rtdan, moduli bir to'rtdan, u birdan kichik.", 'Да. Знаменатель минус одна четвёртая, модуль одна четвёртая, он меньше единицы.', 'Yes. The ratio is minus one quarter, its modulus is one quarter, less than one.'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q, ishoralar almashyapti", 'Нет, знаки чередуются', 'No, the signs alternate'), hint: L("Ishoralarning almashishi shartga kirmaydi. 3-ekranni eslang: u yerda ham ishoralar almashardi va progressiya kamayuvchi edi.", 'Чередование знаков в условие не входит. Вспомни 3 экран: там знаки тоже чередовались, а прогрессия была убывающей.', 'Alternating signs are not part of the condition. Recall screen 3: the signs alternated there too and the progression was decreasing.') },
        ],
        solution: ['q = (1/4) : (−1) = −1/4', '|−1/4| < 1'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ — ZANJIR: yig'indini topish.
// ============================================================
const S10 = {
  eyebrow: L("YIG'INDI", 'СУММА', 'THE SUM'),
  title: L(
    "Formula bo'yicha yig'indi",
    'Сумма по формуле',
    'The sum by the formula',
  ),
  audio: [
    A('mount',
      "Uchta progressiya, uchtasida ham cheksiz yig'indi so'ralgan.",
      'Три прогрессии, во всех трёх спрашивают бесконечную сумму.',
      'Three progressions, and all three ask for the infinite sum.'),
    A('why',
      "Avval maxrajni toping, keyin bir minus q ni hisoblang.",
      'Сначала найди знаменатель, потом вычисли один минус q.',
      'Find the ratio first, then compute one minus q.'),
  ],
  props: {
    stepLabel: L('Progressiya', 'Прогрессия', 'Progression'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham topildi. Maxraj manfiy bo'lganda bo'luvchi kattalashadi, shuning uchun yig'indi kichikroq chiqadi.",
      'Все три найдены. При отрицательном знаменателе делитель растёт, поэтому сумма выходит меньше.',
      'All three are found. With a negative ratio the divisor grows, so the sum comes out smaller.',
    ),
    tasks: [
      {
        expr: '−1/2, −1/4, −1/8, ...',
        question: L('Cheksiz yig\'indi nechaga teng?', 'Чему равна бесконечная сумма?', 'What does the infinite sum equal?'),
        ok: L("Ha. Maxraj bir ikkidan, bir minus bir ikkidan yana bir ikkidan, minus bir ikkidanni unga bo'lsak minus bir chiqadi.", 'Да. Знаменатель одна вторая, один минус одна вторая снова одна вторая, минус одну вторую делим на неё и получаем минус один.', 'Yes. The ratio is one half, one minus one half is one half again, and minus one half over that is minus one.'),
        items: [
          { id: 'a', right: true, label: 'S = −1' },
          { id: 'b', label: 'S = −1/2', hint: L("Minus bir ikkidan bu birinchi hadning o'zi. Qolgan hadlar ham qo'shiladi, demak yig'indi undan kattaroq bo'lishi kerak.", 'Минус одна вторая это сам первый член. Остальные тоже прибавляются, значит сумма должна быть больше по величине.', 'Minus one half is the first term itself. The rest add on, so the sum must be larger in magnitude.') },
        ],
        solution: ['q = 1/2', 'S = (−1/2) : (1/2) = −1'],
      },
      {
        expr: '7, 1, 1/7, ...',
        question: L('Cheksiz yig\'indi nechaga teng?', 'Чему равна бесконечная сумма?', 'What does the infinite sum equal?'),
        ok: L("Ha. Maxraj bir yettidan, bir minus bir yettidan olti yettidan, yettini unga bo'lsak qirq to'qqiz oltidan.", 'Да. Знаменатель одна седьмая, один минус одна седьмая шесть седьмых, семь делим на них и получаем сорок девять шестых.', 'Yes. The ratio is one seventh, one minus one seventh is six sevenths, and seven over that is forty nine sixths.'),
        items: [
          { id: 'a', right: true, label: 'S = 49/6' },
          { id: 'b', label: 'S = 8', hint: L("Sakkiz bu dastlabki ikkita hadning yig'indisi. Uchinchisi va undan keyingilari ham bor, ular yig'indini bir oz oshiradi.", 'Восемь это сумма первых двух членов. Есть ещё третий и следующие, они немного увеличат сумму.', 'Eight is the sum of the first two terms. The third and the rest exist too and raise the sum a little.') },
        ],
        solution: ['q = 1/7', 'S = 7 : (6/7) = 49/6'],
      },
      {
        expr: '−1, 1/4, −1/16, ...',
        question: L('Cheksiz yig\'indi nechaga teng?', 'Чему равна бесконечная сумма?', 'What does the infinite sum equal?'),
        ok: L("Ha. Maxraj minus bir to'rtdan, maxrajda bir qo'shuv bir to'rtdan, ya'ni besh to'rtdan. Javob minus to'rt beshdan.", 'Да. Знаменатель минус одна четвёртая, в делителе один плюс одна четвёртая, то есть пять четвёртых. Ответ минус четыре пятых.', 'Yes. The ratio is minus one quarter, the divisor is one plus one quarter, that is five quarters. The answer is minus four fifths.'),
        items: [
          { id: 'a', right: true, label: 'S = −4/5' },
          { id: 'b', label: 'S = −4/3', hint: L("Minus to'rt uchdan maxrajga bir minus bir to'rtdan qo'yilganda chiqadi. Lekin q manfiy, ayirish qo'shishga aylanadi.", 'Минус четыре третьих выходят, если в делителе один минус одна четвёртая. Но q отрицателен, вычитание превращается в сложение.', 'Minus four thirds appear if the divisor is one minus one quarter. But q is negative, so subtraction becomes addition.') },
        ],
        solution: ['q = −1/4', 'S = (−1) : (5/4) = −4/5'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — TESKARISIGA: yig'indi ma'lum.
// ============================================================
const S11 = {
  eyebrow: L('TESKARISIGA', 'В ОБРАТНУЮ СТОРОНУ', 'THE OTHER WAY ROUND'),
  title: L(
    "Yig'indi berilgan, had noma'lum",
    'Сумма дана, член неизвестен',
    'The sum is given, the term is not',
  ),
  audio: [
    A('mount',
      "Endi yig'indi berilgan, topish kerak bo'lgani esa birinchi had.",
      'Теперь дана сумма, а найти нужно первый член.',
      'Now the sum is given and the first term must be found.'),
    A('why',
      "Formulani teskarisiga o'qing. B bir teng S karra bir minus q.",
      'Прочти формулу в обратную сторону. B один равно S на один минус q.',
      'Read the formula backwards. B one equals S times one minus q.'),
  ],
  props: {
    stepLabel: L('Masala', 'Задача', 'Problem'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkalasi ham topildi. Maxraj manfiy bo'lganda ko'paytuvchi birdan katta bo'ladi, shuning uchun birinchi had yig'indidan katta chiqadi.",
      'Обе найдены. При отрицательном знаменателе множитель больше единицы, поэтому первый член выходит больше суммы.',
      'Both are found. With a negative ratio the factor exceeds one, so the first term comes out larger than the sum.',
    ),
    tasks: [
      {
        expr: 'S = 12,  q = 1/3,  b₁ = ?',
        question: L('Birinchi had nechaga teng?', 'Чему равен первый член?', 'What does the first term equal?'),
        ok: L("Ha. O'n ikkini ikki uchdanga ko'paytirsak sakkiz chiqadi.", 'Да. Двенадцать умножить на две трети равно восьми.', 'Yes. Twelve times two thirds is eight.'),
        items: [
          { id: 'a', right: true, label: 'b₁ = 8' },
          { id: 'b', label: 'b₁ = 18', hint: L("O'n sakkiz o'n ikkini ikki uchdanga BO'LGANDA chiqadi. Bu yerda esa ko'paytirish kerak, chunki yig'indi birinchi haddan katta.", 'Восемнадцать выходит при ДЕЛЕНИИ двенадцати на две трети. Здесь нужно умножать, ведь сумма больше первого члена.', 'Eighteen comes from DIVIDING twelve by two thirds. Here we must multiply, since the sum exceeds the first term.') },
        ],
        solution: ['b₁ = 12 · (1 − 1/3)', 'b₁ = 12 · 2/3 = 8'],
      },
      {
        expr: 'S = 5,  q = −1/2,  b₁ = ?',
        question: L('Birinchi had nechaga teng?', 'Чему равен первый член?', 'What does the first term equal?'),
        ok: L("Ha. Bir minus minus bir ikkidan bir butun bir ikkidan, beshni unga ko'paytirsak yetti butun bir ikkidan.", 'Да. Один минус минус одна вторая это одна целая одна вторая, пять на неё даёт семь целых одна вторая.', 'Yes. One minus minus one half is one and a half, and five times that is seven and a half.'),
        items: [
          { id: 'a', right: true, label: 'b₁ = 7,5' },
          { id: 'b', label: 'b₁ = 2,5', hint: L("Ikki butun besh o'ndan maxrajga bir minus bir ikkidan qo'yilganda chiqadi. q ning ishorasini unutmang.", 'Две целых пять десятых выходят, если взять один минус одна вторая. Не забывай про знак q.', 'Two point five comes from taking one minus one half. Do not forget the sign of q.') },
        ],
        solution: ['b₁ = 5 · (1 + 1/2)', 'b₁ = 5 · 1,5 = 7,5'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ — formula shartsiz qo'llanilgan.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Formula shartni o'zi tekshirmaydi",
    'Формула сама условие не проверяет',
    'The formula does not check its own condition',
  ),
  audio: [
    A('mount',
      "Kamronning yechimi. Unga bir qo'shuv ikki qo'shuv to'rt qo'shuv sakkiz va hokazo berilgan. U formulaga maxraj ikkini qo'yib, minus bir chiqargan.",
      'Решение Камрона. Ему дано один плюс два плюс четыре плюс восемь и так далее. Он подставил в формулу знаменатель два и получил минус один.',
      "Kamron's solution. He was given one plus two plus four plus eight and so on. He put the ratio two into the formula and got minus one."),
    A('why',
      "Hisobda arifmetik xato yo'q. Lekin javobga bir qarang. Musbat sonlarni qo'shib manfiy son chiqdi.",
      'Арифметической ошибки в счёте нет. Но взгляни на ответ. Сложили положительные числа и получили отрицательное.',
      'There is no arithmetic slip in the computation. But look at the answer. Adding positive numbers gave a negative one.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI XULOSA", 'ВЕРНЫЙ ВЫВОД', 'THE CORRECT CONCLUSION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Formula shart buzilganda xato aytmaydi, u shunchaki son beradi. Ma'nosiz sonni ushlash o'quvchining ishi: musbat qo'shiluvchilar manfiy yig'indi bera olmaydi.",
      'При нарушенном условии формула не сообщает об ошибке, она просто выдаёт число. Поймать бессмысленное число это работа ученика: положительные слагаемые не дают отрицательной суммы.',
      'When the condition is broken the formula reports no error, it simply returns a number. Catching the meaningless number is the student work: positive summands cannot give a negative sum.',
    ),
    tasks: [
      {
        expr: '1 + 2 + 4 + 8 + ...   →   S = 1 : (1 − 2) = −1',
        question: L(
          "Kamronning hisobida arifmetik xato yo'q. Xato qayerda?",
          'В счёте Камрона нет арифметической ошибки. Где ошибка?',
          "There is no arithmetic slip in Kamron's computation. Where is the mistake?",
        ),
        ok: L(
          "To'g'ri. Maxrajning moduli ikkiga teng, u birdan kichik emas, demak formulani qo'llash mumkin emas. Bu qatorning cheksiz yig'indisi yo'q, hadlar o'sib boradi.",
          'Верно. Модуль знаменателя равен двум, он не меньше единицы, значит формулу применять нельзя. У этого ряда нет бесконечной суммы, члены растут.',
          'Correct. The modulus of the ratio is two, not less than one, so the formula may not be used. This row has no infinite sum, its terms grow.',
        ),
        items: [
          {
            id: 'a', right: true,
            label: L("Formulani qo'llab bo'lmaydi: maxrajning moduli ikki", 'Формулу применять нельзя: модуль знаменателя два', 'The formula does not apply: the modulus of the ratio is two'),
          },
          {
            id: 'b',
            label: L("Xato yo'q, javob minus bir", 'Ошибки нет, ответ минус один', 'There is no mistake, the answer is minus one'),
            hint: L(
              "Birinchi to'rtta qo'shiluvchining o'zi o'n beshga teng. Yig'indi undan faqat kattaroq bo'lishi mumkin, minus bir esa undan kichik.",
              'Одни только первые четыре слагаемых дают пятнадцать. Сумма может быть только больше, а минус один меньше.',
              'The first four summands alone give fifteen. The sum can only be larger, and minus one is smaller.',
            ),
          },
        ],
        solution: [
          '|q| = 2,   |q| < 1 ?',
          '1 + 2 + 4 + 8 = 15',
          L('Yigindi cheksiz osadi', 'Сумма растёт неограниченно', 'The sum grows without bound'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TRANSFER — darslikning 4-masalasi: davriy kasr.
// ============================================================
const S13 = {
  eyebrow: L('TRANSFER', 'ПЕРЕНОС', 'TRANSFER'),
  title: L(
    "Davriy kasrning ichida progressiya yashaydi",
    'Внутри периодической дроби живёт прогрессия',
    'A progression lives inside a repeating decimal',
  ),
  audio: [
    A('mount',
      "Nol butun o'n besh yuzdan, o'n besh o'n mingdan va shu tarzda cheksiz. Bu nol butun davriy o'n besh degan sonning o'zi.",
      'Ноль целых пятнадцать сотых, пятнадцать десятитысячных и так до бесконечности. Это и есть число ноль целых пятнадцать в периоде.',
      'Fifteen hundredths, fifteen ten thousandths, and so on forever. This is exactly the number nought point one five repeating.'),
    A('why',
      "Har safar oldingisi yuzga bo'linyapti. Demak bu geometrik progressiya.",
      'Каждый раз предыдущее делится на сто. Значит это геометрическая прогрессия.',
      'Each time the previous one is divided by a hundred. So this is a geometric progression.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Cheksiz davriy kasr oddiy kasrga aylandi. Har qanday davriy kasrni shu yo'l bilan yozish mumkin, chunki uning ortida har doim cheksiz kamayuvchi progressiya turadi.",
      'Бесконечная периодическая дробь превратилась в обыкновенную. Так можно записать любую периодическую дробь, ведь за ней всегда стоит бесконечно убывающая прогрессия.',
      'An infinite repeating decimal turned into a common fraction. Any repeating decimal can be written this way, since an infinitely decreasing progression always stands behind it.',
    ),
    tasks: [
      {
        expr: '0,151515...  =  15/100 + 15/10000 + ...',
        question: L(
          "Bu progressiyaning maxraji nechaga teng?",
          'Чему равен знаменатель этой прогрессии?',
          'What does the ratio of this progression equal?',
        ),
        ok: L(
          "To'g'ri, bir yuzdan. Endi formulaga qo'yamiz va oddiy kasr chiqadi.",
          'Верно, одна сотая. Теперь подставим в формулу и получим обыкновенную дробь.',
          'Correct, one hundredth. Now substitute into the formula and a common fraction appears.',
        ),
        items: [
          { id: 'a', right: true, label: 'q = 1/100' },
          {
            id: 'b',
            label: 'q = 1/10',
            hint: L(
              "Har bir keyingi qo'shiluvchida vergul ortidagi nollar IKKITAGA ko'payadi, bittaga emas. O'n mingdan bu yuzdanning yuzdan bir qismi.",
              'В каждом следующем слагаемом нулей после запятой становится на ДВА больше, а не на один. Десятитысячная это сотая часть сотой.',
              'Each next summand has TWO more zeros after the point, not one. A ten thousandth is one hundredth of a hundredth.',
            ),
          },
        ],
        solution: [
          'b₁ = 15/100,  q = 1/100',
          'S = (15/100) : (99/100)',
          'S = 15/99 = 5/33',
        ],
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
    "Blits: shart, chegara, birinchi had",
    'Блиц: условие, предел, первый член',
    'Blitz: the condition, the limit, the first term',
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
        tag: 'modul-shartini-unutish',
        ask: L(
          "Maxraj minus nol butun to'qqiz o'ndan. Progressiya cheksiz kamayuvchimi?",
          'Знаменатель минус ноль целых девять десятых. Бесконечно убывающая ли прогрессия?',
          'The ratio is minus zero point nine. Is the progression infinitely decreasing?',
        ),
        options: [
          { id: 'yes', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
        ],
        ok: L(
          "To'g'ri. Moduli nol butun to'qqiz o'ndan, u birdan kichik. Sekin bo'lsa ham kamayadi.",
          'Верно. Модуль ноль целых девять десятых, он меньше единицы. Убывает медленно, но убывает.',
          'Correct. Its modulus is zero point nine, which is less than one. It shrinks slowly, but it shrinks.',
        ),
        hint: L(
          "3-ekranni eslang: ishora shartga kirmaydi, faqat modul kiradi.",
          'Вспомни 3 экран: знак в условие не входит, входит только модуль.',
          'Recall screen 3: the sign is not part of the condition, only the modulus is.',
        ),
      },
      {
        id: 'q2',
        tag: 'cheksiz-yigindi-cheksiz',
        ask: L(
          "Cheksiz ko'p musbat sonning yig'indisi chekli bo'la oladimi?",
          'Может ли сумма бесконечного числа положительных чисел быть конечной?',
          'Can a sum of infinitely many positive numbers be finite?',
        ),
        options: [
          { id: 'yes', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
        ],
        ok: L(
          "To'g'ri. Hadlar yetarlicha tez kichraysa, yig'indi chekli songa intiladi.",
          'Верно. Если члены достаточно быстро уменьшаются, сумма стремится к конечному числу.',
          'Correct. If the terms shrink fast enough, the sum tends to a finite number.',
        ),
        hint: L(
          "1-ekranni eslang: cheksiz ko'p bo'lak butun kvadratni to'ldirgandi, undan chiqib ketmagandi.",
          'Вспомни 1 экран: бесконечно много кусков заполнили квадрат, но за него не вышли.',
          'Recall screen 1: infinitely many pieces filled the square without leaving it.',
        ),
      },
      {
        id: 'q3',
        tag: 'birinchi-hadni-topmaslik',
        ask: L(
          "Ikkinchi had berilgan bo'lsa, uni to'g'ridan-to'g'ri formulaga qo'yish mumkinmi?",
          'Если дан второй член, можно ли подставить его прямо в формулу?',
          'If the second term is given, can it be put straight into the formula?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q, avval b bir topiladi", 'Нет, сначала находится b один', 'No, b one is found first') },
          { id: 'yes', label: L('Ha, farqi yo\'q', 'Да, без разницы', 'Yes, it makes no difference') },
        ],
        ok: L(
          "To'g'ri. Formulada aynan birinchi had turibdi, boshqasi mos kelmaydi.",
          'Верно. В формуле стоит именно первый член, другой не подойдёт.',
          'Correct. The formula holds precisely the first term, no other will do.',
        ),
        hint: L(
          "7-ekranni eslang: u yerda uchinchi had berilgandi va avval minus qirq to'qqiz topilgandi.",
          'Вспомни 7 экран: там был дан третий член и сначала нашли минус сорок девять.',
          'Recall screen 7: the third term was given there and minus forty nine was found first.',
        ),
      },
      {
        id: 'q4',
        tag: 'davriy-kasrni-tanimaslik',
        ask: L(
          "Cheksiz davriy o'nli kasrni oddiy kasr shaklida yozish mumkinmi?",
          'Можно ли записать бесконечную периодическую дробь в виде обыкновенной?',
          'Can an infinite repeating decimal be written as a common fraction?',
        ),
        options: [
          { id: 'yes', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q, u cheksiz", 'Нет, она бесконечна', 'No, it is infinite') },
        ],
        ok: L(
          "To'g'ri. Uning ortida cheksiz kamayuvchi progressiya turadi, uning yig'indisi esa oddiy kasr.",
          'Верно. За ней стоит бесконечно убывающая прогрессия, а её сумма это обыкновенная дробь.',
          'Correct. An infinitely decreasing progression stands behind it, and its sum is a common fraction.',
        ),
        hint: L(
          "13-ekranni eslang: nol butun davriy o'n besh besh o'ttiz uchdanga aylangandi.",
          'Вспомни 13 экран: ноль целых пятнадцать в периоде превратился в пять тридцать третьих.',
          'Recall screen 13: nought point one five repeating turned into five thirty thirds.',
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
    "Cheksiz qo'shish chekli javob beradi",
    'Бесконечное сложение даёт конечный ответ',
    'Endless adding gives a finite answer',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda cheksiz ko'p bo'lak bitta kvadratni to'ldirdi va undan chiqib ketmadi. Bugungi butun dars shu kuzatuv ustiga qurildi.",
      'На первом экране бесконечно много кусков заполнили один квадрат и не вышли за него. Весь сегодняшний урок построен на этом наблюдении.',
      'On the first screen infinitely many pieces filled one square without leaving it. The whole lesson was built on that observation.'),
    A('s1',
      "Siz shartni modul orqali yozdingiz, formulani chiqardingiz va davriy kasr ichidan progressiyani topdingiz.",
      'Ты записал условие через модуль, вывел формулу и нашёл прогрессию внутри периодической дроби.',
      'You wrote the condition through the modulus, derived the formula, and found a progression inside a repeating decimal.'),
    A('s2',
      "Bu blok tugadi. Keyingi darsda statistik xarakteristikalar.",
      'Этот блок завершён. В следующем уроке статистические характеристики.',
      'This block is complete. The next lesson covers statistical measures.'),
  ],
  props: {
    mark: 'S = b₁ : (1 − q),   |q| < 1',
    markNote: L(
      "shart bajarilmasa formula ishlamaydi",
      'если условие нарушено, формула не работает',
      'if the condition fails, the formula does not apply',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      'Keyingi dars: statistik xarakteristikalar',
      'Следующий урок: статистические характеристики',
      'Next lesson: statistical measures',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     tool: 'pick', ...S1 },
  { role: 'support',  tag: 'cheksiz-yigindi-cheksiz', ...S2 },
  { role: 'explain',  tag: 'modul-shartini-unutish', ...S3 },
  { role: 'explain',  tag: 'modul-shartini-unutish', ...S4 },
  { role: 'explain',  tag: 'cheksiz-yigindi-cheksiz', ...S5 },
  { role: 'explain',  tag: 'modul-shartini-unutish', ...S6 },
  { role: 'explain',  tag: 'birinchi-hadni-topmaslik', ...S7 },
  { role: 'rule',     tag: 'modul-shartini-unutish', ...S8 },
  { role: 'practice', tool: 'drill', tag: 'modul-shartini-unutish', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'modul-shartini-unutish', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'birinchi-hadni-topmaslik', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'modul-shartini-unutish', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'davriy-kasrni-tanimaslik', ...S13 },
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
