// ============================================================================
// 9-sinf, Dars 20. TENGSIZLIKLARNI ISBOTLASH. BLOK B3 SHU DARS BILAN YOPILADI.
//
// REDAKSIYA 1, 2026-08-27. Darslik: Algebra 9, 16-§ «Простейших неравенств
// доказательство» (80-83-bet). Darslik UCHTA NOMLI USULNI beradi va har
// birini o'z masalasida ko'rsatadi:
//   1-masala (80-81-bet) — TA'RIFGA ASOSLANIB: ayirma manfiy emasligini
//       ko'rsatish. Isbotlanadi: o'rta arifmetik o'rta geometrikdan kichik
//       emas, (a+b)/2 ≥ √(ab).
//   2-masala (81-bet) — OLDIN ISBOTLANGANDAN FOYDALANIB.
//   3-masala (81-82-bet) — TESKARISINI FARAZ QILIB: a + 1/a ≥ 2.
//   4-masala (82-83-bet) — amaliy: tarozi va olma, javob «продавец
//       останется в убытке». Bu darsning XUKI va yakuniy ekrani.
// Mashqlar: 183(1), 184(1), 184(2) — mashq va transfer ekranlarida.
//
// 19-darsda 208-209-mashqlar ATAYLAB QOLDIRILGAN edi (eng katta va eng
// kichik qiymat): ular aynan shu darsdagi o'rta arifmetik va o'rta
// geometrik tengsizligiga tayanadi. Endi ular o'z joyida.
//
// ASBOB: YANGI ASBOB YO'Q, va bu ataylab. Isbot — bu YOZMA CHIQARISH,
// darslik uni aynan shunday beradi; sinfda bunday holat uchun qaror
// allaqachon qabul qilingan (Dars09 shapkasi): yozma chiqarish uchun
// `RecallMC` ning intro/steps qatlami olinadi, `Track` emas. Darsning
// YANGI ko'nikmasi — qaysi usulni tanlashni bilish — `Drill` ga tushadi.
// `SignAxis` bu darsda ishlatilmaydi: bu yerda javob emas, DALIL so'raladi.
//
// TEGLAR (o'zining):
//   isbotni-tekshirish-bilan-almashtirish — bir nechta songa qo'yib
//                                   ko'rishni isbot deb hisoblash
//   isbotlanayotgandan-boshlash  — isbotlanishi kerak bo'lgan narsadan
//                                   boshlab, aylanma dalil qurish
//   kvadrat-manfiy-emasligini-unutish — (a−b)² ≥ 0 dalilini oxirigacha
//                                   aytmaslik
//   teskari-farazni-notogri-tuzish — teskarisini faraz qilganda belgini
//                                   noto'g'ri almashtirish
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, MATH_FONT, RuleCard, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { G9_RECOLOR, G9_STYLES, RecallMC } from './asboblar.jsx'

export const META = {
  id: 'grade9-20',
  n: 20,
  row: 20,
  block: 'Б3',
  topic: L('Tengsizliklarni isbotlash', 'Доказательство неравенств', 'Proving inequalities'),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "Isbot bu bir necha sonni tekshirish emas: dalil BARCHA qiymatlar uchun bir yo'la ishlashi kerak",
    'Доказательство это не проверка нескольких чисел: рассуждение должно работать сразу для всех значений',
    'A proof is not checking a few numbers: the argument must work for all values at once',
  ),
  L(
    "Ta'rifga asoslanish: ayirmani yozib, uni kvadrat ko'rinishiga keltirish va kvadrat manfiy emasligiga tayanish",
    'По определению: записать разность, привести её к виду квадрата и опереться на то, что квадрат неотрицателен',
    'By definition: write the difference, reduce it to a square, and rely on a square being non-negative',
  ),
  L(
    "Teskarisini faraz qilib: qarama-qarshi tengsizlikdan yolg'on natija chiqsa, dastlabki tengsizlik to'g'ri",
    'От противного: если из обратного неравенства следует ложный вывод, исходное неравенство верно',
    'By contradiction: if the opposite inequality leads to a false result, the original inequality is true',
  ),
]

export const MISS = {
  'isbotni-tekshirish-bilan-almashtirish': {
    what: L(
      "bir nechta songa qo'yib ko'rish isbot deb hisoblandi",
      'подстановка нескольких чисел принята за доказательство',
      'substituting a few numbers was taken for a proof',
    ),
    wrong: null,
    at: 0,
  },
  'isbotlanayotgandan-boshlash': {
    what: L(
      "isbot isbotlanishi kerak bo'lgan narsadan boshlandi, dalil aylanma bo'lib qoldi",
      'доказательство начато с того, что нужно доказать, рассуждение вышло круговым',
      'the proof started from what had to be proven, making the argument circular',
    ),
    wrong: null,
    at: 0,
  },
  'kvadrat-manfiy-emasligini-unutish': {
    what: L(
      "kvadrat manfiy emasligi dalili oxirigacha aytilmadi",
      'довод о неотрицательности квадрата не доведён до конца',
      'the argument that a square is non-negative was not carried through',
    ),
    wrong: null,
    at: 0,
  },
  'teskari-farazni-notogri-tuzish': {
    what: L(
      "teskarisini faraz qilganda belgi noto'g'ri almashtirildi",
      'при допущении противного знак заменён неверно',
      'when assuming the opposite, the sign was flipped incorrectly',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// EKRAN 1. XUK — darslikning 4-masalasi: tarozi va olma.
// ============================================================
const S1 = {
  eyebrow: L('KIM YUTQAZADI', 'КТО В УБЫТКЕ', 'WHO LOSES'),
  title: L(
    "Nosoz tarozi: kim yutqazadi?",
    'Неисправные весы: кто в убытке?',
    'Faulty scales: who loses out?',
  ),
  audio: [
    A('mount',
      "Sotuvchi richagli tarozida olma tortadi. Xaridor bir kilogramm oldi, keyin olma bilan toshni o'rin almashtirib, yana bir kilogramm tortishni so'radi. Tarozi muvozanatda emas.",
      'Продавец взвешивает яблоки на рычажных весах. Покупатель взял один килограмм, потом попросил поменять местами яблоки и гирю и взвесить ещё один килограмм. Весы не уравновешены.',
      'A seller weighs apples on a lever balance. The buyer took one kilogram, then asked to swap the apples and the weight and weigh one more kilogram. The scales are not balanced.'),
    A('why',
      "Ikki marta bir kilogrammdan olindi. Jami ikki kilogramm bo'ladimi, yoki boshqacha chiqadimi?",
      'Дважды взяли по одному килограмму. Будет ли всего два килограмма, или получится иначе?',
      'One kilogram was taken twice. Will it be two kilograms in total, or will it come out differently?'),
  ],
  props: {
    askClass: 'g9-ask-big',
    cardsClass: 'g9-cards-small',
    ask: L(
      "Tarozi nosoz bo'lsa, kim yutqazadi?",
      'Если весы неисправны, кто останется в убытке?',
      'If the scales are faulty, who loses out?',
    ),
    items: [
      {
        id: 'right', right: true,
        show: L('Sotuvchi', 'Продавец', 'The seller'),
      },
      {
        id: 'wrong',
        show: L('Xaridor', 'Покупатель', 'The buyer'),
        hint: L(
          "Aynan shunday tuyuladi, lekin hisob teskarisini beradi. Buni oxirida isbotlaymiz: xaridor ikki kilogrammdan KO'PROQ oladi.",
          'Так и кажется, но расчёт даёт обратное. Это мы докажем в конце: покупатель получает БОЛЬШЕ двух килограммов.',
          'That is how it seems, but the calculation says the opposite. We will prove it at the end: the buyer gets MORE than two kilograms.',
        ),
      },
    ],
    after: L(
      "To'g'ri, va bu kutilmagan javob. Buni ishonch bilan aytish uchun tekshirish yetarli emas, ISBOT kerak. Bugun uchta isbot usulini o'rganamiz.",
      'Верно, и это неожиданный ответ. Чтобы утверждать это уверенно, проверки мало, нужно ДОКАЗАТЕЛЬСТВО. Сегодня разберём три способа доказательства.',
      'Correct, and it is a surprising answer. To claim it with confidence, checking is not enough, a PROOF is needed. Today we study three methods of proof.',
    ),
  },
}

// ============================================================
// EKRAN 2. TAYANCH — kvadrat manfiy emas (14-darsdan).
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Isbotning tayanch dalili",
    'Опорный довод доказательства',
    'The supporting argument of a proof',
  ),
  audio: [
    A('mount',
      "14-darsda kvadrat hech qachon manfiy bo'lmasligini ko'rgan edingiz. Bugun bu fakt isbotning tayanchi bo'ladi.",
      'На 14 уроке ты видел, что квадрат никогда не бывает отрицательным. Сегодня этот факт станет опорой доказательства.',
      'In lesson 14 you saw that a square is never negative. Today this fact becomes the support of a proof.'),
    A('why',
      "Har qanday haqiqiy son uchun uning kvadrati noldan katta yoki nolga teng.",
      'Для любого действительного числа его квадрат больше нуля или равен нулю.',
      'For any real number, its square is greater than zero or equal to zero.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('(a − b)² ? 0', '(a − b)² ? 0', '(a − b)² ? 0')}
      steps={[]}
      ask={L(
        "Har qanday haqiqiy a va b uchun a minus b ning kvadrati qanday?",
        'Каким будет квадрат a минус b для любых действительных a и b?',
        'What is the square of a minus b for any real a and b?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('Manfiy emas', 'Неотрицателен', 'Not negative') },
        {
          id: 'wrong',
          label: L('Doim musbat', 'Всегда положителен', 'Always positive'),
          hint: L(
            "A va b teng bo'lsa, kvadrat aynan nolga teng bo'ladi. Shuning uchun to'g'ri gap manfiy emas, doim musbat emas.",
            'Если a и b равны, квадрат равен ровно нулю. Поэтому верно сказать неотрицателен, а не всегда положителен.',
            'If a and b are equal, the square is exactly zero. So the correct wording is not negative, not always positive.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Manfiy emas: noldan katta yoki nolga teng. Bugungi uchala isbot ham shu faktga tayanadi.",
        'Верно. Неотрицателен: больше нуля или равен нулю. Все три сегодняшних доказательства опираются на этот факт.',
        'Correct. Not negative: greater than zero or equal to zero. All three of today\'s proofs rely on this fact.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — USUL 1: TA'RIFGA ASOSLANIB.
// Darslikning 1-masalasi: (a+b)/2 ≥ √(ab).
// ============================================================
const S3 = {
  eyebrow: L("1-USUL: TA'RIFGA ASOSLANIB", 'СПОСОБ 1: ПО ОПРЕДЕЛЕНИЮ', 'METHOD 1: BY DEFINITION'),
  title: L(
    "Ayirmani yozib, kvadratga keltirish",
    'Записать разность и привести к квадрату',
    'Write the difference and reduce it to a square',
  ),
  audio: [
    A('mount',
      "Isbotlanadi: ikkita musbat sonning o'rta arifmetigi o'rta geometrigidan kichik emas. Ya'ni a qo'shi b, bo'lingan ikki, katta yoki teng a karra b ning kvadrat ildizi.",
      'Докажем: среднее арифметическое двух положительных чисел не меньше их среднего геометрического. То есть a плюс b, делённое на два, больше или равно квадратному корню из a на b.',
      'We prove: the arithmetic mean of two positive numbers is not less than their geometric mean. That is, a plus b divided by two is greater than or equal to the square root of a times b.'),
    A('why',
      "Usulning o'zi: ayirmani yozamiz va uning manfiy emasligini ko'rsatamiz.",
      'Сам способ: записываем разность и показываем, что она неотрицательна.',
      'The method itself: we write the difference and show that it is not negative.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('(a + b)/2 ≥ √(ab)', '(a + b)/2 ≥ √(ab)', '(a + b)/2 ≥ √(ab)')}
      steps={[
        { id: 'd', head: L('Ayirma', 'Разность', 'The difference'), lines: ['(a + b)/2 − √(ab)'] },
        { id: 'c', head: L('Umumiy maxraj', 'Общий знаменатель', 'Common denominator'), lines: ['(a + b − 2√(ab))/2'] },
        { id: 's', head: L('Kvadrat', 'Квадрат', 'A square'), lines: ['(√a − √b)²/2'] },
      ]}
      ask={L(
        "Ayirma kvadrat ko'rinishiga keldi. Bundan nima kelib chiqadi?",
        'Разность приведена к виду квадрата. Что из этого следует?',
        'The difference has been reduced to a square. What follows from this?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L("Ayirma manfiy emas, demak tengsizlik to'g'ri", 'Разность неотрицательна, значит неравенство верно', 'The difference is not negative, so the inequality is true'),
        },
        {
          id: 'wrong',
          label: L("Hech narsa, sonlarga qo'yib tekshirish kerak", 'Ничего, нужно проверить подстановкой чисел', 'Nothing, it must be checked by substituting numbers'),
          hint: L(
            "Kvadrat manfiy emas, ikkiga bo'linganda ham manfiy emas. Bu BARCHA a va b uchun birdan ishlaydi, sonlarni tekshirish kerak emas.",
            'Квадрат неотрицателен, и после деления на два тоже. Это работает сразу для ВСЕХ a и b, проверять числа не нужно.',
            'A square is not negative, and dividing by two keeps it so. This works for ALL a and b at once, no number checks needed.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bu birinchi usul: ayirmani yozib, uni kvadratga keltirish. Tenglik faqat a va b teng bo'lganda bo'ladi.",
        'Верно. Это первый способ: записать разность и привести её к квадрату. Равенство возможно только при равных a и b.',
        'Correct. This is the first method: write the difference and reduce it to a square. Equality holds only when a and b are equal.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — NEGA AYIRMA YETARLI.
// ============================================================
const S4 = {
  eyebrow: L('NEGA AYIRMA', 'ПОЧЕМУ РАЗНОСТЬ', 'WHY THE DIFFERENCE'),
  title: L(
    "Taqqoslash ayirmaga aylanadi",
    'Сравнение превращается в разность',
    'A comparison turns into a difference',
  ),
  audio: [
    A('mount',
      "Nega isbot ayirmadan boshlandi? Chunki ikki sonni taqqoslash va ularning ayirmasini nol bilan taqqoslash bir xil narsa.",
      'Почему доказательство началось с разности? Потому что сравнить два числа и сравнить их разность с нулём это одно и то же.',
      'Why did the proof start with the difference? Because comparing two numbers and comparing their difference with zero are the same thing.'),
    A('why',
      "Nol bilan taqqoslash osonroq: kvadrat, modul, ildiz kabi belgilar manfiy emasligi darrov ko'rinadi.",
      'Сравнивать с нулём проще: у квадрата, модуля, корня неотрицательность видна сразу.',
      'Comparing with zero is easier: for a square, an absolute value, or a root, non-negativity is immediately visible.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      steps={[]}
      ask={L(
        "X katta yoki teng y degani ayirma haqida nima deydi?",
        'Что означает x больше или равно y в терминах разности?',
        'What does x greater than or equal to y say about the difference?',
      )}
      cols={1}
      items={[
        { id: 'right', right: true, label: L('X minus y manfiy emas', 'X минус y неотрицательно', 'X minus y is not negative') },
        {
          id: 'wrong',
          label: L('X minus y musbat', 'X минус y положительно', 'X minus y is positive'),
          hint: L(
            "Katta YOKI TENG belgisi tenglikni ham qamraydi: ayirma nolga teng bo'lishi mumkin, shuning uchun u manfiy emas, musbat emas.",
            'Знак больше ИЛИ РАВНО охватывает и равенство: разность может быть нулём, поэтому она неотрицательна, а не положительна.',
            'The greater-than-OR-EQUAL sign covers equality: the difference may be zero, so it is non-negative, not positive.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Shuning uchun isbot doim bitta ko'rinishga keltiriladi: ayirma manfiy emasligini ko'rsatish.",
        'Верно. Поэтому доказательство всегда сводят к одному виду: показать, что разность неотрицательна.',
        'Correct. That is why a proof is always reduced to one form: showing the difference is not negative.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — USUL 2: OLDIN ISBOTLANGANDAN FOYDALANIB.
// 184(1)-mashq: a/b + b/a ≥ 2 — bu tarozi masalasining o'zagi.
// ============================================================
const S5 = {
  eyebrow: L('2-USUL: TAYYORDAN FOYDALANIB', 'СПОСОБ 2: ЧЕРЕЗ ГОТОВОЕ', 'METHOD 2: USING WHAT IS PROVEN'),
  title: L(
    "Isbotlangan tengsizlikni qayta ishlatish",
    'Использовать уже доказанное неравенство',
    'Reuse an inequality already proven',
  ),
  audio: [
    A('mount',
      "Isbotlanadi: a bo'lingan b, qo'shi b bo'lingan a, katta yoki teng ikki. Bu yerda ayirmani hisoblash shart emas.",
      'Докажем: a делённое на b, плюс b делённое на a, больше или равно двум. Здесь считать разность не обязательно.',
      'We prove: a divided by b, plus b divided by a, is greater than or equal to two. Here computing the difference is not required.'),
    A('why',
      "Uchinchi ekranda isbotlangan tengsizlikni a bo'lingan b va b bo'lingan a sonlariga qo'llang.",
      'Применим доказанное на третьем экране неравенство к числам a делённое на b и b делённое на a.',
      'Apply the inequality proven on screen three to the numbers a divided by b and b divided by a.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('a/b + b/a ≥ 2', 'a/b + b/a ≥ 2', 'a/b + b/a ≥ 2')}
      steps={[
        { id: 'p', head: L('Ikki songa qo\'llaymiz', 'Применяем к двум числам', 'Apply to two numbers'), lines: ['(a/b + b/a)/2 ≥ √((a/b)·(b/a))'] },
        { id: 'r', head: L('Ildiz ostida', 'Под корнем', 'Under the root'), lines: ['(a/b)·(b/a) = 1', '√1 = 1'] },
      ]}
      ask={L(
        "O'rta arifmetigi birdan kichik emas. Yig'indining o'zi haqida nima deymiz?",
        'Среднее арифметическое не меньше единицы. Что скажем про саму сумму?',
        'The arithmetic mean is not less than one. What do we say about the sum itself?',
      )}
      cols={1}
      items={[
        { id: 'right', right: true, label: L("Yig'indi ikkidan kichik emas", 'Сумма не меньше двух', 'The sum is not less than two') },
        {
          id: 'wrong',
          label: L("Yig'indi birdan kichik emas", 'Сумма не меньше единицы', 'The sum is not less than one'),
          hint: L(
            "Birdan kichik emasligi YARIM yig'indi haqida aytilgan. Ikkala tomonni ikkiga ko'paytiring: yig'indining o'zi ikkidan kichik emas.",
            'Не меньше единицы сказано про ПОЛОВИНУ суммы. Умножь обе части на два: сама сумма не меньше двух.',
            'Not less than one was said about HALF the sum. Multiply both sides by two: the sum itself is not less than two.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bu ikkinchi usul: yangi isbot qurmasdan, tayyor tengsizlikni kerakli sonlarga qo'llash.",
        'Верно. Это второй способ: не строить новое доказательство, а применить готовое неравенство к нужным числам.',
        'Correct. This is the second method: instead of building a new proof, apply a ready one to the right numbers.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — USUL 3: TESKARISINI FARAZ QILIB.
// Darslikning 3-masalasi: a + 1/a ≥ 2.
// ============================================================
const S6 = {
  eyebrow: L('3-USUL: TESKARISINI FARAZ QILIB', 'СПОСОБ 3: ОТ ПРОТИВНОГО', 'METHOD 3: BY CONTRADICTION'),
  title: L(
    "Teskarisini faraz qilib, yolg'onga kelish",
    'Допустить противное и прийти к лжи',
    'Assume the opposite and reach a falsehood',
  ),
  audio: [
    A('mount',
      "Isbotlanadi: har qanday musbat a uchun a qo'shi bir bo'lingan a, katta yoki teng ikki. Bu safar teskarisini faraz qilamiz.",
      'Докажем: для любого положительного a, a плюс один делённое на a, больше или равно двум. На этот раз допустим противное.',
      'We prove: for any positive a, a plus one divided by a is greater than or equal to two. This time we assume the opposite.'),
    A('why',
      "Faraz qilaylik, tengsizlik bajarilmaydi: a qo'shi bir bo'lingan a, ikkidan kichik. Ikkala tomonni musbat a ga ko'paytiramiz.",
      'Допустим, неравенство не выполняется: a плюс один делённое на a, меньше двух. Умножим обе части на положительное a.',
      'Suppose the inequality fails: a plus one divided by a is less than two. Multiply both sides by the positive a.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('Faraz: a + 1/a < 2', 'Допустим: a + 1/a < 2', 'Suppose: a + 1/a < 2')}
      steps={[
        { id: 'm', head: L('A ga ko\'paytiramiz', 'Умножаем на a', 'Multiply by a'), lines: ['a² + 1 < 2a'] },
        { id: 't', head: L('Bir tomonga', 'В одну сторону', 'To one side'), lines: ['a² − 2a + 1 < 0', '(a − 1)² < 0'] },
      ]}
      ask={L(
        "Kvadrat noldan kichik chiqdi. Bu nimani bildiradi?",
        'Квадрат оказался меньше нуля. Что это означает?',
        'The square came out less than zero. What does this mean?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L("Faraz yolg'on, demak dastlabki tengsizlik to'g'ri", 'Допущение ложно, значит исходное неравенство верно', 'The assumption is false, so the original inequality is true'),
        },
        {
          id: 'wrong',
          label: L("Demak a ning bunday qiymatlari bor", 'Значит такие значения a существуют', 'So such values of a exist'),
          hint: L(
            "Kvadrat hech qachon manfiy bo'lmaydi, shuning uchun bunday a yo'q. Faraz o'zi yolg'on bo'lib chiqdi.",
            'Квадрат никогда не бывает отрицательным, поэтому таких a нет. Само допущение оказалось ложным.',
            'A square is never negative, so no such a exists. The assumption itself turned out false.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bu uchinchi usul: teskarisini faraz qilib, yolg'on natijaga kelish. Demak dastlabki tengsizlik har qanday musbat a uchun to'g'ri.",
        'Верно. Это третий способ: допустить противное и прийти к ложному выводу. Значит исходное неравенство верно для любого положительного a.',
        'Correct. This is the third method: assume the opposite and reach a false result. So the original inequality holds for any positive a.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — XUKGA QAYTISH: tarozi masalasi yechildi.
// ============================================================
const S7 = {
  eyebrow: L('TAROZIGA QAYTAMIZ', 'ВОЗВРАЩАЕМСЯ К ВЕСАМ', 'BACK TO THE SCALES'),
  title: L(
    "Endi birinchi ekrandagi javobni isbotlay olamiz",
    'Теперь можем доказать ответ с первого экрана',
    'Now we can prove the answer from the first screen',
  ),
  audio: [
    A('mount',
      "Tarozi yelkalari a va b. Fizikadan ma'lumki, birinchi tortishda xaridor a bo'lingan b kilogramm oldi, ikkinchisida b bo'lingan a kilogramm.",
      'Плечи весов a и b. Из физики известно, что при первом взвешивании покупатель получил a делённое на b килограммов, при втором b делённое на a.',
      'The arms of the scales are a and b. From physics, at the first weighing the buyer got a divided by b kilograms, at the second b divided by a.'),
    A('why',
      "Jami a bo'lingan b, qo'shi b bo'lingan a. Beshinchi ekranda buni isbotlagan edingiz.",
      'Всего a делённое на b, плюс b делённое на a. На пятом экране ты это уже доказал.',
      'In total a divided by b, plus b divided by a. You proved this on screen five.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('Jami: a/b + b/a', 'Всего: a/b + b/a', 'In total: a/b + b/a')}
      steps={[
        { id: 'k', head: L('Isbotlangan', 'Доказано', 'Proven'), lines: ['a/b + b/a ≥ 2'] },
        { id: 'n', head: L('Yelkalar teng emas', 'Плечи не равны', 'The arms are unequal'), lines: ['a ≠ b  →  a/b + b/a > 2'] },
      ]}
      ask={L(
        "Xaridor ikki kilogramm uchun pul to'ladi. Aslida qancha oldi?",
        'Покупатель заплатил за два килограмма. Сколько он получил на самом деле?',
        'The buyer paid for two kilograms. How much did he actually get?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L("Ikki kilogrammdan ko'p, demak sotuvchi yutqazadi", 'Больше двух килограммов, значит в убытке продавец', 'More than two kilograms, so the seller loses out'),
        },
        {
          id: 'wrong',
          label: L('Aynan ikki kilogramm', 'Ровно два килограмма', 'Exactly two kilograms'),
          hint: L(
            "Yelkalar teng bo'lmagani uchun tenglik holati chiqib ketadi: yig'indi ikkidan QAT'IY katta bo'ladi.",
            'Так как плечи не равны, случай равенства отпадает: сумма СТРОГО больше двух.',
            'Since the arms are unequal, the equality case drops out: the sum is STRICTLY greater than two.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Xuk savolining javobi isbotlandi: sotuvchi yutqazadi. Bu taxmin emas, dalil.",
        'Верно. Ответ на вопрос с первого экрана доказан: в убытке продавец. Это не догадка, а доказательство.',
        'Correct. The answer to the opening question is proven: the seller loses out. This is not a guess but a proof.',
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
    "Algebra 9, 16-§, 1-4-masalalar (80-83-bet)",
    'Алгебра 9, §16, задачи 1-4 (стр. 80-83)',
    'Algebra 9, §16, problems 1-4 (p. 80-83)',
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
          "Bir nechta songa qo'yib ko'rish isbot bo'ladimi?",
          'Является ли доказательством подстановка нескольких чисел?',
          'Is substituting a few numbers a proof?',
        )}
        cols={1}
        items={[
          {
            id: 'right', right: true,
            label: L("Yo'q, dalil barcha qiymatlar uchun ishlashi kerak", 'Нет, рассуждение должно работать для всех значений', 'No, the argument must work for all values'),
          },
          {
            id: 'wrong',
            label: L("Ha, agar sonlar ko'p bo'lsa", 'Да, если чисел много', 'Yes, if there are many numbers'),
            hint: L(
              "Qancha son tekshirsangiz ham, tekshirilmagan sonlar qoladi. Isbot esa hammasini bir yo'la qamraydi.",
              'Сколько чисел ни проверь, останутся непроверенные. Доказательство же охватывает все сразу.',
              'However many numbers you check, unchecked ones remain. A proof covers them all at once.',
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
    "Uchta nomli usul",
    'Три названных способа',
    'Three named methods',
  ),
  audio: [
    A('mount',
      "Yetti ekranda siz uchta usulni ishlatdingiz va xuk savoliga qaytib, javobni isbotladingiz. Endi ular qoida sifatida.",
      'На семи экранах ты применил три способа и, вернувшись к вопросу с первого экрана, доказал ответ. Теперь они в виде правила.',
      'On seven screens you used three methods and, returning to the opening question, proved the answer. Now here they are as a rule.'),
    W('card',
      "Qoida ochildi. Barchasi darslikdan.",
      'Правило открылось. Всё из учебника.',
      'The rule is open. Everything is from the textbook.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — 183(1)-mashq: a² + 1 ≥ 2a, birinchi usul.
// ============================================================
const S9 = {
  eyebrow: L('TAKROR', 'ПОВТОР', 'REPEAT'),
  title: L(
    "Birinchi usul, endi mustaqil",
    'Первый способ, теперь самостоятельно',
    'The first method, now on your own',
  ),
  audio: [
    A('mount',
      "Isbotlang: a kvadrat qo'shi bir, katta yoki teng ikki a. Birinchi usul bilan: ayirmani yozing.",
      'Докажи: a в квадрате плюс один, больше или равно двум a. Первым способом: запиши разность.',
      'Prove: a squared plus one is greater than or equal to two a. By the first method: write the difference.'),
    A('why',
      "Ayirmani yig'ib, tanish kvadratni ko'ring.",
      'Собери разность и увидь знакомый квадрат.',
      'Collect the difference and spot the familiar square.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('a² + 1 ≥ 2a', 'a² + 1 ≥ 2a', 'a² + 1 ≥ 2a')}
      steps={[
        { id: 'd', head: L('Ayirma', 'Разность', 'The difference'), lines: ['a² + 1 − 2a'] },
      ]}
      ask={L(
        "Bu ayirma qanday ko'rinishga keladi?",
        'К какому виду приводится эта разность?',
        'What form does this difference take?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '(a − 1)²' },
        {
          id: 'wrong',
          label: '(a + 1)²',
          hint: L(
            "O'rtadagi had minus ikki a. Yig'indining kvadratida u plyus ikki a bo'lardi, demak bu ayirmaning kvadrati.",
            'Средний член минус два a. В квадрате суммы он был бы плюс два a, значит это квадрат разности.',
            'The middle term is minus two a. In a square of a sum it would be plus two a, so this is a square of a difference.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Ayirma a minus bir ning kvadratiga teng, u manfiy emas, demak tengsizlik isbotlandi.",
        'Верно. Разность равна квадрату a минус один, он неотрицателен, значит неравенство доказано.',
        'Correct. The difference equals the square of a minus one, which is not negative, so the inequality is proven.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 10. MASHQ — ZANJIR: qaysi usul mos keladi.
// ============================================================
const S10 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "Qaysi usulni tanlash",
    'Какой способ выбрать',
    'Which method to choose',
  ),
  audio: [
    A('mount',
      "Uchta holat. Har birida qaysi usul eng qulay ekanini ayting.",
      'Три ситуации. В каждой скажи, какой способ удобнее.',
      'Three situations. In each, say which method is most convenient.'),
    A('why',
      "Ayirma osongina kvadratga kelsa, birinchi usul. Tayyor tengsizlik bo'lsa, ikkinchi. Tasdiqni to'g'ridan-to'g'ri olish qiyin bo'lsa, uchinchi.",
      'Если разность легко сводится к квадрату, первый способ. Если есть готовое неравенство, второй. Если утверждение трудно получить напрямую, третий.',
      'If the difference easily reduces to a square, the first method. If a proven inequality is at hand, the second. If the claim is hard to get directly, the third.'),
  ],
  props: {
    stepLabel: L('Holat', 'Ситуация', 'Situation'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham tanlandi: usul masalaning ko'rinishiga qarab tanlanadi, tasodifan emas.",
      'Все три выбраны: способ подбирают по виду задачи, а не наугад.',
      'All three are chosen: the method is picked from the shape of the problem, not at random.',
    ),
    tasks: [
      {
        expr: 'a² + 4 ≥ 4a',
        question: L('Qaysi usul eng qulay?', 'Какой способ удобнее?', 'Which method is most convenient?'),
        ok: L("Ha. Ayirma a minus ikkining kvadratiga keladi, bu birinchi usul.", 'Да. Разность сводится к квадрату a минус два, это первый способ.', 'Yes. The difference reduces to the square of a minus two, this is the first method.'),
        items: [
          { id: 'a', right: true, label: L("Ta'rifga asoslanib", 'По определению', 'By definition') },
          { id: 'b', label: L('Teskarisini faraz qilib', 'От противного', 'By contradiction'), hint: L("Ayirmani yozing: a kvadrat minus to'rt a qo'shi to'rt, bu tayyor kvadrat. Teskarisini faraz qilish bu yerda keraksiz uzun yo'l.", 'Запиши разность: a в квадрате минус четыре a плюс четыре, это готовый квадрат. От противного здесь лишний долгий путь.', 'Write the difference: a squared minus four a plus four, a ready square. Contradiction here is a needlessly long route.') },
        ],
        solution: [
          L('Ayirma: a² − 4a + 4 = (a − 2)²', 'Разность: a² − 4a + 4 = (a − 2)²', 'Difference: a² − 4a + 4 = (a − 2)²'),
          L("1-usul: ta'rifga asoslanib", 'Способ 1: по определению', 'Method 1: by definition'),
        ],
      },
      {
        expr: 'x/y + y/x ≥ 2,  xy > 0',
        question: L('Qaysi usul eng qulay?', 'Какой способ удобнее?', 'Which method is most convenient?'),
        ok: L("Ha. Bu 5-ekranda isbotlangan tengsizlikning o'zi, faqat harflari boshqa.", 'Да. Это то же неравенство, что доказано на 5 экране, только буквы другие.', 'Yes. This is the same inequality proven on screen five, only the letters differ.'),
        items: [
          { id: 'a', right: true, label: L('Tayyor tengsizlikdan foydalanib', 'Через готовое неравенство', 'Using a proven inequality') },
          { id: 'b', label: L("Ta'rifga asoslanib", 'По определению', 'By definition'), hint: L("Bu tengsizlik allaqachon isbotlangan, faqat a va b o'rniga x va y turibdi. Qaytadan isbotlash shart emas.", 'Это неравенство уже доказано, просто вместо a и b стоят x и y. Доказывать заново не нужно.', 'This inequality is already proven, only x and y stand in place of a and b. No need to prove it again.') },
        ],
        solution: [
          L('5-ekranda isbotlangan', 'Доказано на 5 экране', 'Proven on screen five'),
          L('2-usul: tayyordan foydalanib', 'Способ 2: через готовое', 'Method 2: using what is proven'),
        ],
      },
      {
        expr: 'a + 1/a ≥ 2,  a > 0',
        question: L('Darslik qaysi usulni tanlagan?', 'Какой способ выбрал учебник?', 'Which method did the textbook choose?'),
        ok: L("Ha. Darslik bu yerda teskarisini faraz qilib, kvadrat manfiy degan yolg'onga kelgan.", 'Да. Учебник здесь допустил противное и пришёл к лжи о том, что квадрат отрицателен.', 'Yes. Here the textbook assumed the opposite and reached the falsehood that a square is negative.'),
        items: [
          { id: 'a', right: true, label: L('Teskarisini faraz qilib', 'От противного', 'By contradiction') },
          { id: 'b', label: L('Tayyor tengsizlikdan foydalanib', 'Через готовое неравенство', 'Using a proven inequality'), hint: L("6-ekranni eslang: u yerda faraz qilinib, a minus bir ning kvadrati manfiy degan yolg'on natija olingan edi.", 'Вспомни 6 экран: там допустили противное и получили ложный вывод, что квадрат a минус один отрицателен.', 'Recall screen 6: there the opposite was assumed and the false result appeared that the square of a minus one is negative.') },
        ],
        solution: [
          L('Faraz: a + 1/a < 2  →  (a − 1)² < 0', 'Допущение: a + 1/a < 2  →  (a − 1)² < 0', 'Assumption: a + 1/a < 2  →  (a − 1)² < 0'),
          L('3-usul: teskarisini faraz qilib', 'Способ 3: от противного', 'Method 3: by contradiction'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — QOG'OZDA: isbotmi yoki yo'q.
// ============================================================
const S11 = {
  eyebrow: L('QOG\'OZDA', 'НА БУМАГЕ', 'ON PAPER'),
  title: L(
    "Bu isbotmi yoki yo'q",
    'Доказательство это или нет',
    'Is this a proof or not',
  ),
  audio: [
    A('mount',
      "Har savolda bitta dalil berilgan. U isbot bo'ladimi, ayting.",
      'В каждом вопросе дано одно рассуждение. Скажи, является ли оно доказательством.',
      'Each question gives one argument. Say whether it is a proof.'),
    A('why',
      "So'rang: bu dalil BARCHA qiymatlar uchun ishlaydimi?",
      'Спроси: работает ли это рассуждение для ВСЕХ значений?',
      'Ask: does this argument work for ALL values?'),
  ],
  props: {
    stepLabel: L('Savol', 'Вопрос', 'Question'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham aniqlandi: isbot barcha qiymatlarni qamrashi va isbotlanayotgan narsadan boshlamasligi kerak.",
      'Все три определены: доказательство должно охватывать все значения и не начинаться с того, что доказывают.',
      'All three are determined: a proof must cover all values and must not start from what is being proven.',
    ),
    tasks: [
      {
        expr: 'a² + 1 ≥ 2a',
        question: L(
          "Bir, ikki va uch sonlarini qo'yib ko'rdik, uchalasida ham to'g'ri chiqdi. Bu isbotmi?",
          'Подставили числа один, два и три, во всех трёх верно. Это доказательство?',
          'We substituted one, two and three, and it held in all three. Is this a proof?',
        ),
        ok: L("Yo'q. Uchta son tekshirilgan, qolgan cheksiz ko'p son tekshirilmagan.", 'Нет. Проверены три числа, а остальные бесконечно многие не проверены.', 'No. Three numbers were checked, the remaining infinitely many were not.'),
        items: [
          { id: 'a', right: true, label: L("Yo'q, bu faqat tekshirish", 'Нет, это только проверка', 'No, this is only a check') },
          { id: 'b', label: L('Ha, uchta son yetarli', 'Да, трёх чисел достаточно', 'Yes, three numbers are enough'), hint: L("Sonlar cheksiz ko'p. Tekshirish tengsizlikni rad eta oladi, lekin isbotlay olmaydi.", 'Чисел бесконечно много. Проверка может опровергнуть неравенство, но не может его доказать.', 'There are infinitely many numbers. A check can refute an inequality but cannot prove it.') },
        ],
        solution: [L('Tekshirish rad eta oladi, isbotlay olmaydi', 'Проверка может опровергнуть, но не доказать', 'A check can refute, but not prove')],
      },
      {
        expr: 'a² + 1 ≥ 2a',
        question: L(
          "Ayirma a minus bir ning kvadratiga teng, kvadrat esa manfiy emas. Bu isbotmi?",
          'Разность равна квадрату a минус один, а квадрат неотрицателен. Это доказательство?',
          'The difference equals the square of a minus one, and a square is not negative. Is this a proof?',
        ),
        ok: L("Ha. Dalil barcha a uchun birdan ishlaydi, hech qanday son tekshirilmagan.", 'Да. Рассуждение работает сразу для всех a, ни одно число не проверялось.', 'Yes. The argument works for all a at once, no number was checked.'),
        items: [
          { id: 'a', right: true, label: L('Ha, bu to\'liq isbot', 'Да, это полное доказательство', 'Yes, this is a complete proof') },
          { id: 'b', label: L("Yo'q, sonlarni ham tekshirish kerak", 'Нет, нужно ещё проверить числа', 'No, numbers must also be checked'), hint: L("Dalil harflar bilan yozilgan, demak u har qanday a uchun o'rinli. Sonlarni qo'shimcha tekshirish kerak emas.", 'Рассуждение записано в буквах, значит верно для любого a. Дополнительно проверять числа не нужно.', 'The argument is written in letters, so it holds for any a. No extra number checks are needed.') },
        ],
        solution: [L("Harflardagi dalil barcha qiymatni qamraydi", 'Рассуждение в буквах охватывает все значения', 'An argument in letters covers all values')],
      },
      {
        expr: 'a² + 1 ≥ 2a',
        question: L(
          "Isbotlanadigan tengsizlikdan boshlab, ikkala tomondan ikki a ni ayirib, kvadrat chiqardik. Bu to'g'ri yo'lmi?",
          'Начали с доказываемого неравенства, вычли из обеих частей два a и получили квадрат. Верный ли это путь?',
          'We started from the inequality to be proven, subtracted two a from both sides and got a square. Is this the right route?',
        ),
        ok: L("Yo'q. Isbot isbotlanayotgan narsadan boshlanmaydi: to'g'ri yo'l ayirmadan boshlab, unga kelishdir.", 'Нет. Доказательство не начинают с того, что доказывают: верный путь идти от разности к выводу.', 'No. A proof does not start from what is being proven: the right route goes from the difference to the conclusion.'),
        items: [
          { id: 'a', right: true, label: L("Yo'q, dalil aylanma bo'lib qoladi", 'Нет, рассуждение выходит круговым', 'No, the argument becomes circular') },
          { id: 'b', label: L('Ha, natija bir xil', 'Да, результат тот же', 'Yes, the result is the same'), hint: L("Natija bir xil ko'rinsa ham, tartib muhim: isbot ma'lumdan boshlanib, isbotlanayotganga kelishi kerak, teskarisi emas.", 'Хотя результат и похож, порядок важен: доказательство идёт от известного к доказываемому, а не наоборот.', 'Though the result looks the same, order matters: a proof goes from the known to the claim, not the reverse.') },
        ],
        solution: [L("Isbot ma'lumdan boshlanadi, tasdiqdan emas", 'Доказательство начинают с известного, а не с утверждения', 'A proof starts from the known, not from the claim')],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ. Jasur isbotni isbotlanayotgandan boshlagan.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Isbotni tasdiqdan boshlash",
    'Начать доказательство с утверждения',
    'Starting a proof from the claim',
  ),
  audio: [
    A('mount',
      "Jasurning yechimi. U a bo'lingan b qo'shi b bo'lingan a, katta yoki teng ikki tengsizligidan boshlab, ikkala tomonni a karra b ga ko'paytirgan va a minus b ning kvadrati manfiy emas degan to'g'ri natijaga kelgan. Keyin isbot tugadi degan.",
      'Решение Жасура. Он начал с неравенства a делённое на b плюс b делённое на a больше или равно двум, умножил обе части на a на b и пришёл к верному выводу, что квадрат a минус b неотрицателен. После этого сказал, что доказательство закончено.',
      "Jasur's solution. He started from the inequality a over b plus b over a is at least two, multiplied both sides by a times b, and reached the true result that the square of a minus b is not negative. Then he said the proof was finished."),
    A('why',
      "Har bir qadam to'g'ri. Lekin isbot qaysi tomondan boshlangan?",
      'Каждый шаг верен. Но с какой стороны начато доказательство?',
      'Every step is correct. But from which side did the proof begin?'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Qadamlar to'g'ri, lekin yo'nalish teskari: Jasur isbotlanishi kerak bo'lgan narsadan boshlagan. To'g'ri isbot ayirmadan boshlanib, tasdiqqa kelishi kerak.",
      'Шаги верны, но направление обратное: Жасур начал с того, что нужно доказать. Верное доказательство идёт от разности к утверждению.',
      'The steps are right but the direction is reversed: Jasur started from what had to be proven. A correct proof goes from the difference to the claim.',
    ),
    tasks: [
      {
        expr: 'a/b + b/a ≥ 2',
        question: L(
          "Jasur isbotni qaysi tomondan boshlagan: ma'lum faktdanmi yoki isbotlanishi kerak bo'lgan tasdiqdanmi?",
          'С какой стороны Жасур начал доказательство: с известного факта или с утверждения, которое надо доказать?',
          'From which side did Jasur start: from a known fact, or from the claim that must be proven?',
        ),
        ok: L(
          "To'g'ri: u tasdiqdan boshlagan. Qadamlar to'g'ri bo'lsa ham, bunday dalil aylanma: to'g'ri yo'l kvadrat manfiy emasligidan boshlanib, tasdiqqa kelishi kerak.",
          'Верно: он начал с утверждения. Даже при верных шагах такое рассуждение круговое: верный путь идти от неотрицательности квадрата к утверждению.',
          'Correct: he started from the claim. Even with correct steps such an argument is circular: the right route goes from the square being non-negative to the claim.',
        ),
        items: [
          {
            id: 'a', right: true,
            label: L("Tasdiqdan, shuning uchun dalil aylanma", 'С утверждения, поэтому рассуждение круговое', 'From the claim, so the argument is circular'),
          },
          {
            id: 'b',
            label: L("Ma'lum faktdan, hammasi to'g'ri", 'С известного факта, всё верно', 'From a known fact, all correct'),
            hint: L("Jasurning birinchi qatori aynan isbotlanishi kerak bo'lgan tengsizlik. Uni to'g'ri deb olib, undan xulosa chiqarish mumkin emas.", 'Первая строка Жасура и есть то неравенство, которое надо доказать. Нельзя принять его за верное и выводить из него.', "Jasur's first line is exactly the inequality to be proven. You cannot assume it true and derive from it."),
          },
        ],
        solution: [
          L('Jasur: tasdiq  →  (a − b)² ≥ 0', 'Жасур: утверждение  →  (a − b)² ≥ 0', 'Jasur: the claim  →  (a − b)² ≥ 0'),
          L("To'g'ri: (a − b)² ≥ 0  →  tasdiq", 'Верно: (a − b)² ≥ 0  →  утверждение', 'Correct: (a − b)² ≥ 0  →  the claim'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TRANSFER — 184(2)-mashq: (a+b)(1/a + 1/b) ≥ 4.
// ============================================================
const S13 = {
  eyebrow: L('TRANSFER', 'ПЕРЕНОС', 'TRANSFER'),
  title: L(
    "Yangi tengsizlik, tayyor natijadan foydalanib",
    'Новое неравенство через готовый результат',
    'A new inequality using a ready result',
  ),
  audio: [
    A('mount',
      "Darslikning mashqi: a qo'shi b, ko'paytirilgan bir bo'lingan a qo'shi bir bo'lingan b, katta yoki teng to'rt. Qavslarni oching.",
      'Упражнение учебника: a плюс b, умножить на один делённое на a плюс один делённое на b, больше или равно четырём. Раскрой скобки.',
      'A textbook exercise: a plus b, times one over a plus one over b, is at least four. Expand the brackets.'),
    A('why',
      "Ochilgandan keyin 5-ekranda isbotlangan yig'indi paydo bo'ladi.",
      'После раскрытия появится сумма, доказанная на 5 экране.',
      'After expanding, the sum proven on screen five appears.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Topildi: ikkinchi usul yana ishladi, yangi isbot qurishga hojat qolmadi.",
      'Найдено: второй способ снова сработал, строить новое доказательство не понадобилось.',
      'Found: the second method worked again, no new proof had to be built.',
    ),
    tasks: [
      {
        expr: '(a + b)(1/a + 1/b) ≥ 4',
        question: L(
          "Qavslar ochilgandan keyin qanday ifoda hosil bo'ladi?",
          'Какое выражение получается после раскрытия скобок?',
          'What expression results after expanding the brackets?',
        ),
        ok: L(
          "Ha. Ikkita bir va yig'indi qoladi, u esa 5-ekranda ikkidan kichik emasligi isbotlangan: demak hammasi to'rtdan kichik emas.",
          'Да. Остаются две единицы и сумма, а она на 5 экране доказана не меньшей двух: значит всё не меньше четырёх.',
          'Yes. Two ones and the sum remain, and the sum was proven on screen five to be at least two: so the whole is at least four.',
        ),
        items: [
          { id: 'a', right: true, label: '2 + (a/b + b/a)' },
          { id: 'b', label: '1 + (a/b + b/a)', hint: L("Qavslarni to'liq oching: a karra bir bo'lingan a bitta birni beradi, b karra bir bo'lingan b esa yana bittasini. Jami ikkita bir.", 'Раскрой скобки полностью: a на один делённое на a даёт одну единицу, b на один делённое на b даёт ещё одну. Всего две единицы.', 'Expand fully: a times one over a gives one, and b times one over b gives another. Two ones in total.') },
        ],
        solution: [
          '(a + b)(1/a + 1/b) = 2 + (a/b + b/a)',
          L('a/b + b/a ≥ 2  (5-ekran)', 'a/b + b/a ≥ 2  (5 экран)', 'a/b + b/a ≥ 2  (screen 5)'),
          L('Demak: 2 + 2 = 4', 'Значит: 2 + 2 = 4', 'So: 2 + 2 = 4'),
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
    "Blits: isbot, ayirma, faraz",
    'Блиц: доказательство, разность, допущение',
    'Blitz: proof, difference, assumption',
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
        tag: 'isbotni-tekshirish-bilan-almashtirish',
        ask: L(
          "O'nta songa qo'yib ko'rish tengsizlikni isbotlaydimi?",
          'Доказывает ли неравенство подстановка десяти чисел?',
          'Does substituting ten numbers prove an inequality?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'yes', label: L('Ha', 'Да', 'Yes') },
        ],
        ok: L(
          "To'g'ri. Sonlar cheksiz ko'p: tekshirish rad eta oladi, lekin isbotlay olmaydi.",
          'Верно. Чисел бесконечно много: проверка может опровергнуть, но не доказать.',
          'Correct. There are infinitely many numbers: a check can refute but cannot prove.',
        ),
        hint: L(
          "11-ekranni eslang: uchta son to'g'ri chiqqani hali isbot emas edi.",
          'Вспомни 11 экран: то, что три числа подошли, ещё не доказательство.',
          'Recall screen 11: three numbers working out was not yet a proof.',
        ),
      },
      {
        id: 'q2',
        tag: 'kvadrat-manfiy-emasligini-unutish',
        ask: L(
          "Ayirma kvadratga keltirildi. Isbot shu bilan tugaydimi?",
          'Разность приведена к квадрату. Заканчивается ли доказательство на этом?',
          'The difference has been reduced to a square. Does the proof end there?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q, kvadrat manfiy emasligini aytish kerak", 'Нет, нужно сказать, что квадрат неотрицателен', 'No, one must state that a square is not negative') },
          { id: 'yes', label: L('Ha, tugaydi', 'Да, заканчивается', 'Yes, it ends') },
        ],
        ok: L(
          "To'g'ri. Kvadratga keltirish yarim ish: dalil kvadrat manfiy emasligiga tayanib yakunlanadi.",
          'Верно. Привести к квадрату это половина дела: рассуждение завершается опорой на неотрицательность квадрата.',
          'Correct. Reducing to a square is half the job: the argument ends by relying on a square being non-negative.',
        ),
        hint: L(
          "3-ekranni eslang: kvadrat chiqqandan keyin yana bitta qadam bor edi.",
          'Вспомни 3 экран: после появления квадрата был ещё один шаг.',
          'Recall screen 3: after the square appeared there was one more step.',
        ),
      },
      {
        id: 'q3',
        tag: 'teskari-farazni-notogri-tuzish',
        ask: L(
          "Katta yoki teng tengsizligini teskarisini faraz qilsak, qanday belgi olinadi?",
          'Если допустить противное для знака больше или равно, какой знак получится?',
          'If we assume the opposite of greater-than-or-equal, which sign do we get?',
        ),
        options: [
          { id: 'lt', right: true, label: L('Qat\'iy kichik', 'Строго меньше', 'Strictly less') },
          { id: 'le', label: L('Kichik yoki teng', 'Меньше или равно', 'Less than or equal') },
        ],
        ok: L(
          "To'g'ri. Katta yoki tengning teskarisi qat'iy kichik: tenglik holati dastlabki tengsizlikka kiradi.",
          'Верно. Противное к больше или равно это строго меньше: случай равенства входит в исходное неравенство.',
          'Correct. The opposite of greater-than-or-equal is strictly less: the equality case belongs to the original inequality.',
        ),
        hint: L(
          "6-ekranni eslang: faraz aynan qat'iy kichik belgisi bilan yozilgan edi.",
          'Вспомни 6 экран: допущение было записано именно со строгим знаком меньше.',
          'Recall screen 6: the assumption was written with the strict less-than sign.',
        ),
      },
      {
        id: 'q4',
        tag: 'isbotlanayotgandan-boshlash',
        ask: L(
          "Isbotni isbotlanishi kerak bo'lgan tengsizlikdan boshlash mumkinmi?",
          'Можно ли начинать доказательство с того неравенства, которое надо доказать?',
          'May a proof start from the very inequality that must be proven?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'yes', label: L('Ha', 'Да', 'Yes') },
        ],
        ok: L(
          "To'g'ri. Bunday dalil aylanma bo'ladi: isbot ma'lum faktdan boshlanib, tasdiqqa kelishi kerak.",
          'Верно. Такое рассуждение выходит круговым: доказательство идёт от известного факта к утверждению.',
          'Correct. Such an argument is circular: a proof goes from a known fact to the claim.',
        ),
        hint: L(
          "12-ekranni eslang: Jasurning xatosi aynan shu edi, garchi har bir qadami to'g'ri bo'lsa ham.",
          'Вспомни 12 экран: именно в этом была ошибка Жасура, хотя каждый его шаг был верен.',
          "Recall screen 12: this was exactly Jasur's mistake, even though each of his steps was correct.",
        ),
      },
    ],
  },
}

// ============================================================
// EKRAN 15. YAKUN. BLOK B3 YOPILADI.
// ============================================================
const S15 = {
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L(
    "Uchta usul va blokning yakuni",
    'Три способа и завершение блока',
    'Three methods and the end of the block',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda nosoz tarozida kim yutqazishini taxmin qildingiz. Bugun siz bu javobni isbotladingiz: taxmin dalilga aylandi.",
      'На первом экране ты предположил, кто в убытке при неисправных весах. Сегодня ты это доказал: догадка стала доказательством.',
      'On the first screen you guessed who loses out with faulty scales. Today you proved it: the guess became a proof.'),
    A('s1',
      "Siz uchta usulni o'rgandingiz: ta'rifga asoslanib ayirma orqali, tayyor tengsizlikdan foydalanib, va teskarisini faraz qilib.",
      'Ты освоил три способа: по определению через разность, через готовое неравенство, и от противного.',
      'You learned three methods: by definition through the difference, using a proven inequality, and by contradiction.'),
    A('s2',
      "Shu dars bilan tengsizliklar bloki yakunlandi. Keyingi blokda ketma-ketliklar va progressiyalar boshlanadi.",
      'На этом блок неравенств завершён. В следующем блоке начинаются последовательности и прогрессии.',
      'This completes the block on inequalities. The next block begins sequences and progressions.'),
  ],
  props: {
    mark: '(√a − √b)² ≥ 0',
    markNote: L(
      "uchala isbotning tayanchi",
      'опора всех трёх доказательств',
      'the support of all three proofs',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      'Keyingi blok: ketma-ketliklar va progressiyalar',
      'Следующий блок: последовательности и прогрессии',
      'Next block: sequences and progressions',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     tool: 'pick', ...S1 },
  { role: 'support',  tag: 'kvadrat-manfiy-emasligini-unutish', ...S2 },
  { role: 'explain',  tag: 'kvadrat-manfiy-emasligini-unutish', ...S3 },
  { role: 'explain',  tag: 'isbotlanayotgandan-boshlash', ...S4 },
  { role: 'explain',  tag: 'isbotni-tekshirish-bilan-almashtirish', ...S5 },
  { role: 'explain',  tag: 'teskari-farazni-notogri-tuzish', ...S6 },
  { role: 'explain',  tag: 'isbotni-tekshirish-bilan-almashtirish', ...S7 },
  { role: 'rule',     tag: 'isbotni-tekshirish-bilan-almashtirish', ...S8 },
  { role: 'practice', tool: 'recallmc', tag: 'kvadrat-manfiy-emasligini-unutish', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'isbotni-tekshirish-bilan-almashtirish', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'isbotni-tekshirish-bilan-almashtirish', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'isbotlanayotgandan-boshlash', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'isbotni-tekshirish-bilan-almashtirish', ...S13 },
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
