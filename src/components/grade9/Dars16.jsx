// ============================================================================
// 9-sinf, Dars 16. TENGSIZLIKLAR SISTEMASI.
//
// REDAKSIYA 1, 2026-08-27. Darslik: Algebra 9, 15-§ «Ikkinchi darajali bir
// noma'lumli tengsizliklar sistemalari» (77-80-bet). 1-masala (77-78-bet)
// — asosiy misol, kvadrat + chiziqli tengsizlik, chegara turlari aralash
// (bittasi qat'iy, bittasi qat'iy emas). 2-masala (78-79-bet) — modul
// ichidagi tengsizlik ikki tomonlama tengsizlikka, u esa ikkita kvadrat
// tengsizlikdan iborat sistemaga keltiriladi. 3-masala (79-80-bet) —
// funksiya aniqlanish sohasi, amaliy qo'llanish (kvadrat ildiz ostida
// manfiy bo'lmaslik sharti). 182(1)-mashq (80-bet) — mustaqil ishlash
// uchun, TRANSFER ekranida.
//
// ASBOB: `Overlap` — YANGI PRIBOR, bu darsda birinchi marta yig'ildi
// (PODXOD_9SINF.md da oldindan rejalashtirilmagan edi, mavzuning o'zidan
// kelib chiqdi). Ikki (yoki undan ortiq) TAYYOR yechimni bitta o'qda
// solishtiradi: yuqorida har bir tengsizlikning o'z qatori (faqat
// ma'lumot uchun), pastda umumiy o'q — o'quvchi ikkalasiga ham mos
// keladigan oraliqlarni bosib bo'yaydi. `mode="and"` (sistema, kesishma)
// shu darsda ishlatiladi; 18-darsda («majmua», birlashma) xuddi shu
// asbob `mode="or"` bilan qayta ishlatiladi — kod emas, gap o'zgaradi.
// Chegara nuqta ochiq yoki yopiqligi HISOBLAB chiqariladi (qaysi
// tengsizlikdan kelgani qo'lda kuzatilmaydi).
//
// TEGLAR (o'zining):
//   kesishma-emas-birlashma-deb-oylash — "va" ni "yoki" bilan
//                                         almashtirib, ikkala to'plamni
//                                         birlashtirib yuborish
//   faqat-bitta-tengsizlikni-tekshirish — ikkinchi tengsizlikni unutib,
//                                         javobni faqat bittasidan olish
//   kesishma-yoq-holatni-tanimaslik    — umumiy qism yo'q holatni
//                                         tanimaslik, "javob yo'q"
//                                         deb yoza olmaslik
//   chegara-turini-notogri-kochirish   — chegara nuqtaning ochiq yoki
//                                         yopiqligini noto'g'ri ko'chirish
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, MATH_FONT, RuleCard, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { G9_RECOLOR, G9_STYLES, Overlap, RecallMC } from './asboblar.jsx'

export const META = {
  id: 'grade9-16',
  n: 16,
  row: 16,
  block: 'Б3',
  topic: L('Tengsizliklar sistemasi', 'Система неравенств', 'A system of inequalities'),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "Sistema yechimi umumiy qism: ikkala tengsizlikka ham birdan mos keladigan sonlar",
    'Решение системы это общая часть: числа, подходящие обоим неравенствам сразу',
    'The solution of a system is the common part: numbers fitting both inequalities at once',
  ),
  L(
    "Har bir tengsizlik alohida yechiladi, keyin ikkala yechim bitta o'qqa qo'yiladi",
    'Каждое неравенство решают отдельно, затем оба решения наносят на одну ось',
    'Each inequality is solved separately, then both solutions are placed on one axis',
  ),
  L(
    "Umumiy qism topilmasa, sistemaning yechimi yo'q, bu ham to'liq javobdir",
    'Если общей части нет, у системы нет решений, это тоже полноценный ответ',
    'If there is no common part, the system has no solution, this too is a complete answer',
  ),
]

export const MISS = {
  'kesishma-emas-birlashma-deb-oylash': {
    what: L(
      "\"va\" \"yoki\" bilan almashtirilib, ikkala to'plam birlashtirib yuborildi",
      '"и" заменено на "или", оба множества объединены вместо пересечения',
      '"and" was swapped for "or", the two sets were combined instead of intersected',
    ),
    wrong: null,
    at: 0,
  },
  'faqat-bitta-tengsizlikni-tekshirish': {
    what: L(
      "ikkinchi tengsizlik unutildi, javob faqat bittasidan olindi",
      'второе неравенство забыто, ответ взят только из одного',
      'the second inequality was forgotten, the answer was taken from only one',
    ),
    wrong: null,
    at: 0,
  },
  'kesishma-yoq-holatni-tanimaslik': {
    what: L(
      "umumiy qism yo'qligi tanilmadi, yo'q joyda javob o'ylab topildi",
      'не распознано отсутствие общей части, придуман ответ там, где его нет',
      'the absence of a common part was not recognized, an answer was invented where none exists',
    ),
    wrong: null,
    at: 0,
  },
  'chegara-turini-notogri-kochirish': {
    what: L(
      "chegara nuqtaning ochiq yoki yopiqligi noto'g'ri ko'chirildi",
      'открытость или закрытость граничной точки перенесена неверно',
      'whether the boundary point is open or closed was carried over incorrectly',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// EKRAN 1. XUK.
// ============================================================
const S1 = {
  eyebrow: L('IKKALASI HAM', 'ОБА СРАЗУ', 'BOTH AT ONCE'),
  title: L(
    "Bir sonda ikkita shart bajarilishi kerak",
    'В одном числе должны выполняться два условия',
    'One number has to satisfy two conditions',
  ),
  audio: [
    A('mount',
      "Ikkita tengsizlik birga yozilgan: sistema. Ular bir vaqtning o'zida bajarilishi kerak.",
      'Два неравенства записаны вместе: система. Они должны выполняться одновременно.',
      'Two inequalities are written together: a system. They must hold at the same time.'),
    A('why',
      "Har bir tengsizlikning o'z yechimi bor. Sistemaning yechimi ular bilan qanday bog'liq?",
      'У каждого неравенства своё решение. Как решение системы связано с ними?',
      'Each inequality has its own solution. How is the solution of the system related to them?'),
  ],
  props: {
    askClass: 'g9-ask-big',
    cardsClass: 'g9-cards-small',
    ask: L(
      "Sistemaning yechimi ikkala tengsizlik yechimining nimasi?",
      'Что представляет собой решение системы по отношению к решениям обоих неравенств?',
      'What is the solution of a system in relation to the solutions of both inequalities?',
    ),
    items: [
      {
        id: 'right', right: true,
        show: L("Ikkalasiga ham mos keladigan umumiy qism", 'Общая часть, подходящая обоим', 'The common part that fits both'),
      },
      {
        id: 'wrong',
        show: L("Ikkalasining barcha sonlari birgalikda", 'Все числа обоих вместе', 'All the numbers of both together'),
        hint: L(
          "\"Barcha sonlar birgalikda\" bu ikkitasidan KAMIDA bittasiga mos kelish degani. Sistema esa IKKALASIGA HAM mos kelishni talab qiladi.",
          'Все числа вместе означает подходить ХОТЯ БЫ одному из двух. Система же требует подходить ОБОИМ.',
          '"All the numbers together" means fitting AT LEAST one of the two. A system requires fitting BOTH.',
        ),
      },
    ],
    after: L(
      "To'g'ri. Bugun ikkita yechimni bitta o'qqa qo'yib, umumiy qismini topishni o'rganamiz.",
      'Верно. Сегодня учимся наносить два решения на одну ось и находить их общую часть.',
      'Correct. Today we learn to place two solutions on one axis and find their common part.',
    ),
  },
}

// ============================================================
// EKRAN 2. TAYANCH — bitta tengsizlikni eslash, ikkinchisi haqida ogohlantirish.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Bitta tengsizlikni eslash",
    'Вспоминаем одно неравенство',
    'Recalling one inequality',
  ),
  audio: [
    A('mount',
      "X kvadrat minus besh x qo'shi olti, noldan katta tengsizlikni eslang. Uning ildizlari ikki va uch edi.",
      'Вспомни неравенство x в квадрате минус пять x плюс шесть больше нуля. Его корни были два и три.',
      'Recall the inequality x squared minus five x plus six, greater than zero. Its roots were two and three.'),
    A('why',
      "Bugungi darsda bunday tengsizlik YOLG'IZ emas, u boshqa bir tengsizlik bilan birga keladi.",
      'На сегодняшнем уроке такое неравенство не будет ОДИНОКИМ, оно придёт вместе с другим неравенством.',
      "In today's lesson such an inequality will not be ALONE, it comes together with another inequality."),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('x² − 5x + 6 > 0', 'x² − 5x + 6 > 0', 'x² − 5x + 6 > 0')}
      steps={[
        { id: 'a', head: 'x1, x2', lines: ['x² − 5x + 6 = 0', 'x1 = 2, x2 = 3'] },
      ]}
      ask={L(
        "Bu tengsizlikning yechimi qaysi?",
        'Каково решение этого неравенства?',
        'What is the solution of this inequality?',
      )}
      cols={1}
      items={[
        { id: 'right', right: true, label: L("x ikkidan kichik yoki x uchdan katta", 'x меньше двух или x больше трёх', 'x less than two or x greater than three') },
        {
          id: 'wrong',
          label: L('Ikki bilan uch orasi', 'Между двумя и тремя', 'Between two and three'),
          hint: L(
            "Ishorani eslang: uchhad musbat bo'lganda javob ikki AJRALGAN oraliqdan iborat, o'rtadagi emas.",
            'Вспомни знак: когда трёхчлен положителен, ответ состоит из двух ОТДЕЛЬНЫХ промежутков, а не из среднего.',
            'Recall the sign: when the trinomial is positive, the answer consists of two SEPARATE intervals, not the middle one.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Buni yodda tuting: hozir bu tengsizlik yoniga ikkinchisi qo'shiladi, ikkalasi birga BIR SISTEMA bo'ladi.",
        'Верно. Держи это в уме: сейчас к этому неравенству добавится второе, вместе они образуют ОДНУ СИСТЕМУ.',
        'Correct. Keep this in mind: now a second inequality joins it, together they form ONE system.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — Overlap: birinchi marta, aralash chegara.
// ============================================================
const S3 = {
  eyebrow: L('YANGI ASBOB', 'НОВЫЙ ПРИБОР', 'A NEW TOOL'),
  title: L(
    "Ikki yechimni bitta o'qqa qo'yish",
    'Два решения на одной оси',
    'Two solutions on one axis',
  ),
  audio: [
    A('mount',
      "Sistema: x kvadrat minus besh x qo'shi olti, noldan katta; va uch x qo'shi to'rt, noldan katta yoki teng. Ikkala tengsizlik yechimi yuqorida tayyor turibdi.",
      'Система: x в квадрате минус пять x плюс шесть больше нуля; и три x плюс четыре больше или равно нулю. Решения обоих неравенств уже готовы наверху.',
      'A system: x squared minus five x plus six, greater than zero; and three x plus four, greater than or equal to zero. Both solutions are already ready above.'),
    W('sign',
      "Ikkala qatorga ham qarang: ikkalasi ham bo'yalgan joylargina javobga kiradi.",
      'Смотри на обе полосы: в ответ входят только те места, что закрашены на обеих.',
      'Look at both strips: only the places painted on both belong in the answer.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <Overlap
      from={-3} to={5}
      layers={[
        { intervals: [{ a: -Infinity, b: 2, openA: true, openB: true }, { a: 3, b: Infinity, openA: true, openB: true }] },
        { intervals: [{ a: -4 / 3, b: Infinity, openA: false, openB: true }] },
      ]}
      layerLabels={[
        L('1-tengsizlik: x < 2 yoki x > 3', '1-е неравенство: x < 2 или x > 3', '1st inequality: x < 2 or x > 3'),
        L('2-tengsizlik: x katta yoki teng minus bir butun uchdan bir', '2-е неравенство: x больше или равно минус одной целой одной третьей', '2nd inequality: x greater than or equal to minus one and one third'),
      ]}
      mode="and"
      ask={L(
        "Ikkala tengsizlikka ham mos keladigan oraliqlarni bosib bo'yang",
        'Закрась промежутки, подходящие обоим неравенствам сразу',
        'Paint the intervals that fit both inequalities at once',
      )}
      after={L(
        "Ana xolos. Ikkala qator ham bo'yalgan joylargina qoldi: bitta chegara yopiq (ikkinchi tengsizlikdan), ikkinchisi ochiq (birinchisidan).",
        'Вот и всё. Остались только места, закрашенные на обеих полосах: одна граница закрыта (от второго неравенства), другая открыта (от первого).',
        'That is all it takes. Only the places painted on both strips remain: one boundary is closed (from the second inequality), the other is open (from the first).',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — nega "va" kesishma, "yoki" emas.
// ============================================================
const S4 = {
  eyebrow: L('NEGA UMUMIY QISM', 'ПОЧЕМУ ОБЩАЯ ЧАСТЬ', 'WHY THE COMMON PART'),
  title: L(
    "Bitta shartga mos kelish yetarli emas",
    'Соответствовать одному условию недостаточно',
    'Fitting one condition is not enough',
  ),
  audio: [
    A('mount',
      "Minus ikkini oling. U birinchi tengsizlikka mos keladi, chunki minus ikki ikkidan kichik. Lekin ikkinchisiga mos kelmaydi.",
      'Возьми минус два. Он подходит первому неравенству, ведь минус два меньше двух. Но не подходит второму.',
      'Take minus two. It fits the first inequality, since minus two is less than two. But it does not fit the second.'),
    A('why',
      "Sistema ikkalasini ham talab qiladi. Minus ikki faqat bittasiga mos kelsa, sistemaning yechimi bo'la oladimi?",
      'Система требует обоих. Может ли минус два быть решением системы, если подходит только одному?',
      'The system requires both. Can minus two be a solution of the system if it fits only one?'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      steps={[]}
      ask={L(
        "Minus ikki faqat birinchi tengsizlikka mos keladi, ikkinchisiga mos kelmaydi. U sistemaning yechimi bo'la oladimi?",
        'Минус два подходит только первому неравенству, второму не подходит. Может ли он быть решением системы?',
        'Minus two fits only the first inequality, not the second. Can it be a solution of the system?',
      )}
      cols={1}
      items={[
        { id: 'right', right: true, label: L("Yo'q, u sistemaning yechimi emas", 'Нет, он не является решением системы', 'No, it is not a solution of the system') },
        {
          id: 'wrong',
          label: L("Ha, chunki bittasiga mos keladi", 'Да, ведь он подходит одному', 'Yes, since it fits one of them'),
          hint: L(
            "Sistema \"va\" bilan bog'langan: ikkala tengsizlik ham bajarilishi shart. Bittasiga mos kelish kifoya emas.",
            'Система соединена союзом и: должны выполняться оба неравенства. Соответствовать одному недостаточно.',
            'A system is joined by "and": both inequalities must hold. Fitting one is not enough.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Shuning uchun sistemaning yechimi ikkala to'plamning UMUMIY QISMI, birlashmasi emas.",
        'Верно. Поэтому решение системы это ОБЩАЯ ЧАСТЬ обоих множеств, а не их объединение.',
        'Correct. That is why the solution of a system is the COMMON PART of both sets, not their union.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — Overlap: umumiy qism yo'q holat.
// ============================================================
const S5 = {
  eyebrow: L('UMUMIY QISM YO\'Q', 'ОБЩЕЙ ЧАСТИ НЕТ', 'NO COMMON PART'),
  title: L(
    "Ba'zan ikkala shartni ham qanoatlantiradigan son yo'q",
    'Иногда нет числа, удовлетворяющего обоим условиям',
    'Sometimes there is no number that satisfies both conditions',
  ),
  audio: [
    A('mount',
      "Yangi sistema: x kvadrat minus to'rt, noldan kichik; va x, uchdan katta. Ikkala qatorni solishtiring.",
      'Новая система: x в квадрате минус четыре меньше нуля; и x больше трёх. Сравни обе полосы.',
      'A new system: x squared minus four, less than zero; and x, greater than three. Compare both strips.'),
    A('why',
      "Birinchi tengsizlik faqat minus ikki bilan ikki orasini beradi. Ikkinchisi esa uchdan kattasini talab qiladi. Bu ikkisi kesishadimi?",
      'Первое неравенство даёт только промежуток между минус два и два. Второе требует больше трёх. Пересекаются ли они?',
      'The first inequality gives only the interval between minus two and two. The second requires greater than three. Do they overlap?'),
  ],
  render: ({ audio, onSolved, step }) => (
    <Overlap
      from={-3} to={5}
      layers={[
        { intervals: [{ a: -2, b: 2, openA: true, openB: true }] },
        { intervals: [{ a: 3, b: Infinity, openA: true, openB: true }] },
      ]}
      layerLabels={[
        L('1-tengsizlik: minus ikki dan ikkigacha', '1-е неравенство: от минус двух до двух', '1st inequality: from minus two to two'),
        L('2-tengsizlik: uchdan katta', '2-е неравенство: больше трёх', '2nd inequality: greater than three'),
      ]}
      mode="and"
      ask={L(
        "Ikkala tengsizlikka ham mos keladigan oraliqni bosib bo'yang, agar bunday joy bo'lsa",
        'Закрась промежуток, подходящий обоим неравенствам сразу, если такое место есть',
        'Paint the interval that fits both inequalities at once, if such a place exists',
      )}
      after={L(
        "Ana xolos. Bosiladigan hech qanday joy yo'q edi: ikkala qator hech qayerda ustma-ust tushmaydi. Bu sistemaning yechimi yo'q.",
        'Вот и всё. Закрашивать было нечего: обе полосы нигде не совпадают. У этой системы нет решений.',
        'That is all it takes. There was nothing to paint: the two strips never overlap. This system has no solution.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — MODULDAN SISTEMAGA (Overlap).
// ============================================================
const S6 = {
  eyebrow: L('MODULDAN SISTEMAGA', 'ОТ МОДУЛЯ К СИСТЕМЕ', 'FROM ABSOLUTE VALUE TO A SYSTEM'),
  title: L(
    "Modul ichidagi tengsizlik ham sistema beradi",
    'Неравенство с модулем тоже даёт систему',
    'An inequality with absolute value also gives a system',
  ),
  audio: [
    A('mount',
      "X kvadrat minus x minus bir ning moduli, birdan kichik. Bu ikki tomonlama tengsizlikka teng: minus bir kichik, x kvadrat minus x minus bir, birdan kichik.",
      'Модуль от x в квадрате минус x минус один, меньше единицы. Это равносильно двойному неравенству: минус один меньше, x в квадрате минус x минус один, меньше единицы.',
      'The absolute value of x squared minus x minus one, is less than one. This is equivalent to a double inequality: minus one less than x squared minus x minus one, less than one.'),
    A('why',
      "Ikki tomonlama tengsizlik ikkita tengsizlikdan iborat sistemaga aylanadi: chapdagi va o'ngdagi shartlar alohida.",
      'Двойное неравенство превращается в систему из двух неравенств: левое и правое условия отдельно.',
      'A double inequality turns into a system of two inequalities: the left and right conditions separately.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <Overlap
      from={-2} to={3}
      layers={[
        { intervals: [{ a: -1, b: 2, openA: true, openB: true }] },
        { intervals: [{ a: -Infinity, b: 0, openA: true, openB: true }, { a: 1, b: Infinity, openA: true, openB: true }] },
      ]}
      layerLabels={[
        L('x² − x − 2 < 0 yechimi: minus birdan ikkigacha', 'решение x² − x − 2 < 0: от минус одного до двух', 'solution of x² − x − 2 < 0: from minus one to two'),
        L('x² − x > 0 yechimi: noldan kichik yoki birdan katta', 'решение x² − x > 0: меньше нуля или больше единицы', 'solution of x² − x > 0: less than zero or greater than one'),
      ]}
      mode="and"
      ask={L(
        "Ikkala tengsizlikka ham mos keladigan oraliqlarni bosib bo'yang",
        'Закрась промежутки, подходящие обоим неравенствам сразу',
        'Paint the intervals that fit both inequalities at once',
      )}
      after={L(
        "Ana xolos. Javob ikki ajralgan oraliqdan iborat: minus bir bilan nol orasi, va bir bilan ikki orasi.",
        'Вот и всё. Ответ состоит из двух отдельных промежутков: между минус одним и нулём, и между одним и двумя.',
        'That is all it takes. The answer is two separate intervals: between minus one and zero, and between one and two.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — AMALIY QO'LLANISH: aniqlanish sohasi.
// ============================================================
const S7 = {
  eyebrow: L("AMALIY QO'LLANISH", 'ПРИМЕНЕНИЕ', 'A PRACTICAL USE'),
  title: L(
    "Sistema funksiyaning aniqlanish sohasini topadi",
    'Система находит область определения функции',
    'A system finds the domain of a function',
  ),
  audio: [
    A('mount',
      "Funksiya: uch x kvadrat minus x minus o'n to'rt ning kvadrat ildizi, qo'shi minus x ning kvadrat ildizi. Ikkala ildiz ostidagi ifoda ham manfiy bo'lmasligi kerak.",
      'Функция: квадратный корень из трёх x в квадрате минус x минус четырнадцать, плюс квадратный корень из минус x. Оба подкоренных выражения не должны быть отрицательными.',
      'A function: the square root of three x squared minus x minus fourteen, plus the square root of minus x. Neither expression under a root may be negative.'),
    A('why',
      "Ikkita shart bir vaqtda bajarilishi kerak: bu aynan sistema.",
      'Два условия должны выполняться одновременно: это и есть система.',
      'Two conditions must hold at the same time: this is exactly a system.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <Overlap
      from={-4} to={4}
      layers={[
        { intervals: [{ a: -Infinity, b: -2, openA: true, openB: false }, { a: 7 / 3, b: Infinity, openA: false, openB: true }] },
        { intervals: [{ a: -Infinity, b: 0, openA: true, openB: false }] },
      ]}
      layerLabels={[
        L("Birinchi ildiz sharti: x kichik yoki teng minus ikki, yoki x katta yoki teng bir butun uchdan to'rt", 'Условие первого корня: x меньше или равно минус двум, или x больше или равно одной целой четырём третьим', 'First root condition: x less than or equal to minus two, or x greater than or equal to one and four thirds'),
        L('Ikkinchi ildiz sharti: x kichik yoki teng nolga', 'Условие второго корня: x меньше или равно нулю', 'Second root condition: x less than or equal to zero'),
      ]}
      mode="and"
      ask={L(
        "Funksiya aniqlanadigan oraliqlarni bosib bo'yang",
        'Закрась промежутки, где функция определена',
        'Paint the intervals where the function is defined',
      )}
      after={L(
        "Ana xolos. Faqat bitta oraliq qoldi: x kichik yoki teng minus ikkiga. Boshqa hech qanday joyda ikkala shart birga bajarilmaydi.",
        'Вот и всё. Остался только один промежуток: x меньше или равно минус двум. Больше нигде оба условия не выполняются вместе.',
        'That is all it takes. Only one interval remains: x less than or equal to minus two. Nowhere else do both conditions hold together.',
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
    "Algebra 9, 15-§, 1- va 2-masalalar (77-79-bet)",
    'Алгебра 9, §15, задачи 1 и 2 (стр. 77-79)',
    'Algebra 9, §15, problems 1 and 2 (p. 77-79)',
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
          "Sistemani yechish uchun nechta qadam kerak?",
          'Сколько шагов нужно, чтобы решить систему?',
          'How many steps are needed to solve a system?',
        )}
        cols={1}
        items={[
          {
            id: 'right', right: true,
            label: L("Uchta: har birini alohida yechish, bitta o'qqa qo'yish, umumiy qismini topish", 'Три: решить каждое отдельно, нанести на одну ось, найти общую часть', 'Three: solve each separately, place them on one axis, find the common part'),
          },
          {
            id: 'wrong',
            label: L("Bitta: ikkalasini birga yechish", 'Один: решить оба вместе', 'One: solve both together'),
            hint: L(
              "3-ekranni eslang: avval har bir tengsizlik ALOHIDA yechildi, keyingina ular bitta o'qqa qo'yildi.",
              'Вспомни 3 экран: сначала каждое неравенство было решено ОТДЕЛЬНО, и только потом они были нанесены на одну ось.',
              'Recall screen 3: first each inequality was solved SEPARATELY, only then were they placed on one axis.',
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
    "Sistema: alohida yechish, birga solishtirish",
    'Система: решить отдельно, сравнить вместе',
    'A system: solve separately, compare together',
  ),
  audio: [
    A('mount',
      "Yetti ekranda siz umumiy qismni, umumiy qism yo'q holatni va sistemaning amaliy qo'llanishini o'z qo'lingiz bilan ko'rdingiz. Endi ular qoida sifatida.",
      'На семи экранах ты сам увидел общую часть, случай без общей части и применение системы. Теперь они в виде правила.',
      'On seven screens you saw with your own hands the common part, the no-common-part case, and a practical use of a system. Now here they are as a rule.'),
    W('card',
      "Qoida ochildi. Barchasi darslikdan.",
      'Правило открылось. Всё из учебника.',
      'The rule is open. Everything is from the textbook.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — Overlap TAKRORI, mustaqil.
// ============================================================
const S9 = {
  eyebrow: L('TAKROR', 'ПОВТОР', 'REPEAT'),
  title: L(
    "Yana bitta sistema, endi mustaqil",
    'Ещё одна система, теперь самостоятельно',
    'Another system, now on your own',
  ),
  audio: [
    A('mount',
      "Yangi sistema: x kvadrat minus to'qqiz, noldan kichik; va ikki x qo'shi bir, noldan katta yoki teng. Ikkala qatorni solishtirib, umumiy qismini toping.",
      'Новая система: x в квадрате минус девять меньше нуля; и два x плюс один больше или равно нулю. Сравни обе полосы и найди общую часть.',
      'A new system: x squared minus nine, less than zero; and two x plus one, greater than or equal to zero. Compare both strips and find the common part.'),
    A('why',
      "Birinchi tengsizlik oraliq beradi, ikkinchisi esa nuqtadan boshlab cheksizlikkacha.",
      'Первое неравенство даёт промежуток, второе даёт от точки до бесконечности.',
      'The first inequality gives an interval, the second gives from a point to infinity.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <Overlap
      from={-4} to={4}
      layers={[
        { intervals: [{ a: -3, b: 3, openA: true, openB: true }] },
        { intervals: [{ a: -0.5, b: Infinity, openA: false, openB: true }] },
      ]}
      layerLabels={[
        L('1-tengsizlik: minus uchdan uchgacha', '1-е неравенство: от минус трёх до трёх', '1st inequality: from minus three to three'),
        L('2-tengsizlik: katta yoki teng minus nol butun besh', '2-е неравенство: больше или равно минус нолю целых пяти', '2nd inequality: greater than or equal to minus zero point five'),
      ]}
      mode="and"
      ask={L(
        "Ikkala tengsizlikka ham mos keladigan oraliqni bosib bo'yang",
        'Закрась промежуток, подходящий обоим неравенствам сразу',
        'Paint the interval that fits both inequalities at once',
      )}
      after={L(
        "Ana xolos. Chegara minus nol butun beshda yopiq (ikkinchi tengsizlikdan), uchda esa ochiq (birinchisidan).",
        'Вот и всё. Граница в минус нолю целых пяти закрыта (от второго неравенства), а в трёх открыта (от первого).',
        'That is all it takes. The boundary at minus zero point five is closed (from the second inequality), and at three it is open (from the first).',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 10. MASHQ — QOG'OZDA: umumiy qismni toppish, chizmasiz.
// ============================================================
const S10 = {
  eyebrow: L('QOG\'OZDA', 'НА БУМАГЕ', 'ON PAPER'),
  title: L(
    "Faqat mantiq: ikki to'plamning umumiy qismi",
    'Только логика: общая часть двух множеств',
    'Just logic: the common part of two sets',
  ),
  audio: [
    A('mount',
      "Har savolda ikkita tayyor yechim berilgan. Grafiksiz, faqat mantiq bilan umumiy qismini toping.",
      'В каждом вопросе даны два готовых решения. Без чертежа, только логикой найди общую часть.',
      'Each question gives two ready-made solutions. Without a drawing, find the common part using logic alone.'),
    A('why',
      "Har ikkala shartga ham mos keladigan sonlarni qidiring.",
      'Ищи числа, которые подходят обоим условиям сразу.',
      'Look for numbers that fit both conditions at once.'),
  ],
  props: {
    stepLabel: L('Savol', 'Вопрос', 'Question'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham aniqlandi: umumiy qism ikkala shartga ham mos keladigan qismdir, boshqa hech narsa emas.",
      'Все три определены: общая часть — это то, что подходит обоим условиям, и ничего больше.',
      'All three are determined: the common part is what fits both conditions, and nothing more.',
    ),
    tasks: [
      {
        expr: '1: x < 5,   2: x > 1',
        question: L('Umumiy qism qaysi?', 'Какая общая часть?', 'What is the common part?'),
        ok: L("Ha. Ikkala shartga ham mos keladigan sonlar aynan bir bilan besh orasida.", 'Да. Числа, подходящие обоим условиям, находятся именно между одним и пятью.', 'Yes. The numbers fitting both conditions are exactly between one and five.'),
        items: [
          { id: 'a', right: true, label: L('Bir bilan besh orasi', 'Между одним и пятью', 'Between one and five') },
          { id: 'b', label: L("Ikkalasining barcha sonlari", 'Все числа обоих', 'All numbers of both'), hint: L("Umumiy qism ikkalasiga ham mos keladigan qism, hammasi emas. Beshdan katta sonlar ikkinchi shartga mos keladi, lekin birinchisiga emas.", 'Общая часть это то, что подходит обоим, а не всё. Числа больше пяти подходят второму условию, но не первому.', 'The common part is what fits both, not everything. Numbers greater than five fit the second condition, but not the first.') },
        ],
        solution: [L('x < 5 va x > 1', 'x < 5 и x > 1', 'x < 5 and x > 1'), L('Umumiy qism: 1 dan 5 gacha', 'Общая часть: от 1 до 5', 'Common part: from 1 to 5')],
      },
      {
        expr: '1: x ≤ 0 ∨ x ≥ 4,   2: x > 2',
        question: L('Umumiy qism qaysi?', 'Какая общая часть?', 'What is the common part?'),
        ok: L("Ha. Birinchi shartning ikki bo'lagidan faqat x katta yoki teng to'rt bo'lagi ikkinchisiga ham mos keladi.", 'Да. Из двух частей первого условия только x больше или равно четырём подходит и второму.', 'Yes. Of the two parts of the first condition, only x greater than or equal to four also fits the second.'),
        items: [
          { id: 'a', right: true, label: L('X katta yoki teng to\'rt', 'X больше или равно четырём', 'X greater than or equal to four') },
          { id: 'b', label: L('X kichik yoki teng nol', 'X меньше или равно нулю', 'X less than or equal to zero'), hint: L("Ikkinchi shart x ikkidan katta bo'lishni talab qiladi. Nol yoki undan kichik sonlar bu shartga mos kelmaydi.", 'Второе условие требует, чтобы x было больше двух. Ноль или меньшие числа этому условию не подходят.', 'The second condition requires x greater than two. Zero or smaller numbers do not fit this condition.') },
        ],
        solution: [
          L("Birinchi shartning ikki bo'lagi bor", 'У первого условия две части', 'The first condition has two parts'),
          L(`Faqat "to'rtdan katta yoki teng" bo'lagi ikkinchisiga ham mos keladi`, 'Второму подходит только часть "больше или равно четырём"', 'Only the "greater than or equal to four" part fits the second'),
        ],
      },
      {
        expr: '1: x < −2,   2: x > 3',
        question: L('Umumiy qism qaysi?', 'Какая общая часть?', 'What is the common part?'),
        ok: L("Ha. Bu ikki shart hech qachon birga bajarilmaydi: birinchisi faqat kichik sonlarni, ikkinchisi faqat katta sonlarni beradi.", 'Да. Эти два условия никогда не выполняются вместе: первое даёт только маленькие числа, второе только большие.', 'Yes. These two conditions never hold together: the first gives only small numbers, the second only large ones.'),
        items: [
          { id: 'a', right: true, label: L("Umumiy qism yo'q", 'Общей части нет', 'There is no common part') },
          { id: 'b', label: L("Minus ikki bilan uch orasi", 'Между минус двумя и тремя', 'Between minus two and three'), hint: L("Bu oraliqdagi sonlar birinchi shartga (kichik minus ikkidan) ham, ikkinchisiga (katta uchdan) ham mos kelmaydi.", 'Числа из этого промежутка не подходят ни первому условию (меньше минус двух), ни второму (больше трёх).', 'Numbers from this interval fit neither the first condition (less than minus two) nor the second (greater than three).') },
        ],
        solution: [
          L('Birinchisi: kichik sonlar', 'Первое: маленькие числа', 'The first: small numbers'),
          L('Ikkinchisi: katta sonlar', 'Второе: большие числа', 'The second: large numbers'),
          L("Umumiy qism yo'q", 'Общей части нет', 'No common part'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — "UMUMIY QISM YO'Q"NI TANISH.
// ============================================================
const S11 = {
  eyebrow: L("YO'Q HOLATNI TANISH", 'РАСПОЗНАВАНИЕ ОТСУТСТВИЯ', 'RECOGNIZING "NONE"'),
  title: L(
    "Umumiy qism bormi, yo'qmi?",
    'Есть общая часть или нет?',
    'Is there a common part, or not?',
  ),
  audio: [
    A('mount',
      "Har savolda ikkita shart berilgan. Ular kesishadimi yoki umuman kesishmaydimi, shuni aniqlang.",
      'В каждом вопросе даны два условия. Определи, пересекаются они или вообще не пересекаются.',
      'Each question gives two conditions. Determine whether they overlap, or do not overlap at all.'),
    A('why',
      "Ikkala shartni ham sonlar o'qida tasavvur qiling: ular bir joyda uchrashadimi?",
      'Представь оба условия на числовой оси: встречаются ли они где-нибудь?',
      'Picture both conditions on a number line: do they meet anywhere?'),
  ],
  props: {
    stepLabel: L('Savol', 'Вопрос', 'Question'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham aniqlandi: kesishish faqat ikkala shart ham TO'G'RI bo'ladigan joyda bo'ladi.",
      'Все три определены: пересечение бывает только там, где ОБА условия верны.',
      'All three are determined: overlap happens only where BOTH conditions are true.',
    ),
    tasks: [
      {
        expr: '1: x > 0,   2: x < −5',
        question: L('Umumiy qism bormi?', 'Есть общая часть?', 'Is there a common part?'),
        ok: L("Yo'q. Musbat sonlar hech qachon minus beshdan kichik bo'lmaydi.", 'Нет. Положительные числа никогда не бывают меньше минус пяти.', 'No. Positive numbers are never less than minus five.'),
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Birinchi shart faqat noldan katta sonlarni beradi, ikkinchisi esa faqat minus beshdan kichiklarini. Ular umuman uchrashmaydi.", 'Первое условие даёт только числа больше нуля, второе даёт только меньше минус пяти. Они вообще не встречаются.', 'The first condition gives only numbers greater than zero, the second only numbers less than minus five. They never meet at all.') },
        ],
        solution: [L('X > 0 va x < −5', 'X > 0 и x < −5', 'X > 0 and x < −5'), L("Umumiy qism yo'q", 'Общей части нет', 'No common part')],
      },
      {
        expr: '1: x ≥ −2,   2: x ≤ 6',
        question: L('Umumiy qism bormi?', 'Есть общая часть?', 'Is there a common part?'),
        ok: L("Ha. Minus ikki bilan olti orasidagi barcha sonlar ikkala shartga ham mos keladi.", 'Да. Все числа между минус двумя и шестью подходят обоим условиям.', 'Yes. All numbers between minus two and six fit both conditions.'),
        items: [
          { id: 'a', right: true, label: L('Ha, minus ikkidan oltigacha', 'Да, от минус двух до шести', 'Yes, from minus two to six') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Ikkala shart ham katta oraliqni beradi, ular ustma-ust tushadi: minus ikki katta yoki teng, olti kichik yoki teng.", 'Оба условия дают широкий промежуток, они накладываются: больше или равно минус двум, меньше или равно шести.', 'Both conditions give a wide interval, and they overlap: greater than or equal to minus two, less than or equal to six.') },
        ],
        solution: [
          L('X katta yoki teng minus ikki', 'X больше или равно минус двум', 'X greater than or equal to minus two'),
          L('X kichik yoki teng olti', 'X меньше или равно шести', 'X less than or equal to six'),
          L('Umumiy qism: minus ikkidan oltigacha', 'Общая часть: от минус двух до шести', 'Common part: from minus two to six'),
        ],
      },
      {
        expr: '1: x ≠ 3,   2: x = 3',
        question: L(
          "Birinchi shart uchdan tashqari barcha sonlar. Umumiy qism bormi?",
          'Первое условие это все числа кроме тройки. Есть общая часть?',
          'The first condition is all numbers except three. Is there a common part?',
        ),
        ok: L("Yo'q. Birinchi shart aynan uchni istisno qiladi, ikkinchisi esa faqat uchni talab qiladi: ular bir-birini butunlay rad etadi.", 'Нет. Первое условие исключает именно тройку, а второе требует именно тройку: они полностью исключают друг друга.', 'No. The first condition excludes exactly three, and the second requires exactly three: they fully rule each other out.'),
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha, x = 3 da', 'Да, при x = 3', 'Yes, at x = 3'), hint: L("Birinchi shart x uchga teng bo'lishini AYNAN taqiqlaydi. Demak, x uchga teng bo'lgan nuqta birinchi shartga mos kelmaydi.", 'Первое условие как раз ЗАПРЕЩАЕТ x быть равным трём. Значит, точка x равная трём не подходит первому условию.', 'The first condition specifically FORBIDS x from equaling three. So the point where x equals three does not fit the first condition.') },
        ],
        solution: [
          L('Birinchi shart uchni istisno qiladi', 'Первое условие исключает тройку', 'The first condition excludes three'),
          L('Ikkinchisi faqat uchni talab qiladi', 'Второе требует только тройку', 'The second requires only three'),
          L("Bular mos kelmaydi: umumiy qism yo'q", 'Они не совпадают: общей части нет', 'They do not match: no common part'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ. Sardor ikkinchi tengsizlikni unutib, javobni
// faqat birinchisidan olgan.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Ikkinchi tengsizlikni unutish",
    'Забыть про второе неравенство',
    'Forgetting the second inequality',
  ),
  audio: [
    A('mount',
      "Sardorning yechimi. X kvadrat minus to'qqiz, noldan kichik; va ikki x qo'shi bir, noldan katta yoki teng, sistemasi uchun u javobga faqat birinchi tengsizlikning yechimini yozgan: minus uchdan uchgacha.",
      'Решение Сардора. Для системы x в квадрате минус девять меньше нуля; и два x плюс один больше или равно нулю, он записал в ответ только решение первого неравенства: от минус трёх до трёх.',
      "Sardor's solution. For the system x squared minus nine, less than zero; and two x plus one, greater than or equal to zero, he wrote only the solution of the first inequality as the answer: from minus three to three."),
    A('why',
      "9-ekranni eslang: ikkinchi tengsizlik nima edi? U birinchi oraliqning bir qismini kesib tashlamadimi?",
      'Вспомни 9 экран: каким было второе неравенство? Не отрезало ли оно часть первого промежутка?',
      "Recall screen 9: what was the second inequality? Didn't it cut off part of the first interval?"),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkinchi tengsizlik minus nol butun beshdan kichik sonlarni rad etadi: shuning uchun javobga faqat minus nol butun beshdan uchgacha bo'lgan qism kiradi, Sardorning yechimi to'liq emas.",
      'Второе неравенство отвергает числа меньше минус нолю целых пяти: поэтому в ответ входит только часть от минус нолю целых пяти до трёх, решение Сардора неполно.',
      "The second inequality rejects numbers less than minus zero point five: so only the part from minus zero point five to three belongs in the answer, Sardor's solution is incomplete.",
    ),
    tasks: [
      {
        expr: 'x² − 9 < 0  ∧  2x + 1 ≥ 0',
        question: L(
          "Sardor javobni minus uchdan uchgacha deb yozdi. Ikkinchi tengsizlikning yechimi qanday oraliq beradi?",
          'Сардор записал ответ от минус трёх до трёх. Какой промежуток даёт решение второго неравенства?',
          'Sardor wrote the answer as from minus three to three. What interval does the solution of the second inequality give?',
        ),
        ok: L(
          "To'g'ri: x katta yoki teng minus nol butun besh. Bu birinchi oraliqning chap qismini kesib tashlaydi: to'liq javob minus nol butun beshdan uchgacha bo'ladi, Sardorniki esa to'liq emas.",
          'Верно: x больше или равно минус нолю целых пяти. Это отрезает левую часть первого промежутка: полный ответ от минус нолю целых пяти до трёх, а у Сардора он неполон.',
          "Correct: x greater than or equal to minus zero point five. This cuts off the left part of the first interval: the full answer is from minus zero point five to three, and Sardor's is incomplete.",
        ),
        items: [
          {
            id: 'a', right: true,
            label: L("X katta yoki teng minus nol butun besh, shuning uchun chap qism kesiladi", 'X больше или равно минус нолю целых пяти, поэтому левая часть отрезается', 'X greater than or equal to minus zero point five, so the left part is cut off'),
          },
          {
            id: 'b',
            label: L("Bu tengsizlik hech narsani o'zgartirmaydi", 'Это неравенство ничего не меняет', 'This inequality changes nothing'),
            hint: L("Ikki x qo'shi bir noldan katta yoki teng bo'lishi uchun x kamida minus nol butun beshga teng bo'lishi kerak: bu birinchi oraliqning bir qismini rad etadi.", 'Чтобы два x плюс один было больше или равно нулю, x должен быть хотя бы минус нолю целых пяти: это отвергает часть первого промежутка.', 'For two x plus one to be greater than or equal to zero, x must be at least minus zero point five: this rejects part of the first interval.'),
          },
        ],
        solution: [
          '2x + 1 ≥ 0  →  x ≥ −0,5',
          L('Birinchi oraliq minus uchdan uchgacha edi', 'Первый промежуток был от минус трёх до трёх', 'The first interval was from minus three to three'),
          L("To'g'ri javob: minus nol butun beshdan uchgacha", 'Верный ответ: от минус нуля целых пяти до трёх', 'Correct answer: from minus zero point five to three'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TRANSFER — mustaqil, darslikning yangi mashqi
// (182(1)-mashq, aniqlanish sohasi).
// ============================================================
const S13 = {
  eyebrow: L('TRANSFER', 'ПЕРЕНОС', 'TRANSFER'),
  title: L(
    "Boshqa funksiya, xuddi shu usul",
    'Другая функция, тот же способ',
    'A different function, the same method',
  ),
  audio: [
    A('mount',
      "Yangi funksiya: minus x kvadrat minus olti x minus sakkiz ning kvadrat ildizi, qo'shi uchdan bir x qo'shi ikki ning kvadrat ildizi. Usul xuddi 7-ekrandagidek: ikkala ildiz sharti sistema beradi.",
      'Новая функция: квадратный корень из минус x в квадрате минус шесть x минус восемь, плюс квадратный корень из одной третьей x плюс два. Способ тот же, что на 7 экране: оба условия корней дают систему.',
      'A new function: the square root of minus x squared minus six x minus eight, plus the square root of one third x plus two. The method is the same as on screen 7: both root conditions give a system.'),
    A('why',
      "Ikkala ildiz ostidagi ifoda ham manfiy bo'lmasligi shart.",
      'Оба подкоренных выражения не должны быть отрицательными.',
      'Neither expression under a root may be negative.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Topildi: usul xuddi 7-ekrandagidek ishladi, faqat sonlar boshqacha.",
      'Найдено: способ сработал так же, как на 7 экране, только с другими числами.',
      'Found: the method worked the same way as on screen 7, only with different numbers.',
    ),
    tasks: [
      {
        expr: '−x² − 6x − 8 ≥ 0',
        question: L(
          "Birinchi ildiz sharti qanday oraliq beradi?",
          'Какой промежуток даёт условие первого корня?',
          'What interval does the first root condition give?',
        ),
        ok: L(
          "Ha. Tarmoqlari pastga qaragan parabola noldan katta yoki teng bo'lganda, javob ikki ildiz orasidagi oraliq bo'ladi: minus to'rtdan minus ikkigacha.",
          'Да. Когда парабола с ветвями вниз больше или равна нулю, ответом служит промежуток между двумя корнями: от минус четырёх до минус двух.',
          'Yes. When a downward-branching parabola is greater than or equal to zero, the answer is the interval between the two roots: from minus four to minus two.',
        ),
        items: [
          { id: 'a', right: true, label: L('Minus to\'rtdan minus ikkigacha', 'От минус четырёх до минус двух', 'From minus four to minus two') },
          { id: 'b', label: L("Minus to'rtdan kichik yoki minus ikkidan katta", 'Меньше минус четырёх или больше минус двух', 'Less than minus four or greater than minus two'), hint: L("Tarmoqlar pastga qaragan, demak grafik faqat ikki ildiz ORASIDA noldan yuqorida turadi, tashqarisida emas.", 'Ветви направлены вниз, значит график выше нуля только МЕЖДУ двумя корнями, а не снаружи.', 'The branches point down, so the graph is above zero only BETWEEN the two roots, not outside them.') },
        ],
        solution: [
          '−x² − 6x − 8 = 0  →  x = −4, x = −2',
          L('Tarmoqlar pastga: oraliq ichida musbat', 'Ветви вниз: внутри промежутка положительно', 'Branches down: positive inside the interval'),
          L('Yechim: −4 dan −2 gacha', 'Решение: от −4 до −2', 'Solution: from −4 to −2'),
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
    "Blits: umumiy qism, chegara, yo'q holat",
    'Блиц: общая часть, граница, отсутствие решений',
    'Blitz: common part, boundary, no solution',
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
        tag: 'kesishma-emas-birlashma-deb-oylash',
        ask: L(
          "Sistemaning yechimi ikkala tengsizlik yechimining birlashmasimi?",
          'Является ли решение системы объединением решений обоих неравенств?',
          'Is the solution of a system the union of the solutions of both inequalities?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'yes', label: L('Ha', 'Да', 'Yes') },
        ],
        ok: L(
          "To'g'ri. Sistemaning yechimi umumiy qism, ya'ni kesishma: har ikkalasiga ham mos kelishi shart.",
          'Верно. Решение системы это общая часть, то есть пересечение: должно подходить обоим.',
          'Correct. The solution of a system is the common part, that is, the intersection: it must fit both.',
        ),
        hint: L(
          "4-ekranni eslang: bittasiga mos kelish yetarli emas edi.",
          'Вспомни 4 экран: соответствовать только одному было недостаточно.',
          'Recall screen 4: fitting only one was not enough.',
        ),
      },
      {
        id: 'q2',
        tag: 'faqat-bitta-tengsizlikni-tekshirish',
        ask: L(
          "Sistemani yechishda faqat bitta tengsizlikni tekshirib, ikkinchisini unutish mumkinmi?",
          'Можно ли при решении системы проверить только одно неравенство, забыв про второе?',
          'When solving a system, can you check only one inequality and forget the second?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'yes', label: L('Ha', 'Да', 'Yes') },
        ],
        ok: L(
          "To'g'ri. Ikkinchi tengsizlik javobning bir qismini kesib tashlashi mumkin, uni unutish xato javob beradi.",
          'Верно. Второе неравенство может отрезать часть ответа, забыть про него значит получить неверный ответ.',
          'Correct. The second inequality can cut off part of the answer, forgetting it gives a wrong answer.',
        ),
        hint: L(
          "12-ekranni eslang: Sardorning xatosi aynan shu edi.",
          'Вспомни 12 экран: именно в этом была ошибка Сардора.',
          "Recall screen 12: this was exactly Sardor's mistake.",
        ),
      },
      {
        id: 'q3',
        tag: 'kesishma-yoq-holatni-tanimaslik',
        ask: L(
          "Ikkala tengsizlikning yechimlari umuman kesishmasa, sistemaning yechimi bormi?",
          'Если решения обоих неравенств вообще не пересекаются, есть ли у системы решение?',
          'If the solutions of both inequalities do not overlap at all, does the system have a solution?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'yes', label: L('Ha', 'Да', 'Yes') },
        ],
        ok: L(
          "To'g'ri. Umumiy qism bo'lmasa, sistemaning ham yechimi bo'lmaydi: bu to'liq javob.",
          'Верно. Если нет общей части, то и у системы нет решения: это полноценный ответ.',
          'Correct. If there is no common part, the system has no solution: this is a complete answer.',
        ),
        hint: L(
          "5-ekranni eslang: ikkala qator hech qayerda ustma-ust tushmagan edi.",
          'Вспомни 5 экран: обе полосы нигде не совпадали.',
          'Recall screen 5: the two strips never overlapped anywhere.',
        ),
      },
      {
        id: 'q4',
        tag: 'chegara-turini-notogri-kochirish',
        ask: L(
          "Bitta tengsizlikda chegara ochiq, ikkinchisida esa xuddi shu nuqta yopiq bo'lsa, umumiy qismda bu nuqta qanday bo'ladi?",
          'Если в одном неравенстве граница открыта, а в другом та же точка закрыта, какой будет эта точка в общей части?',
          'If in one inequality the boundary is open, and in another the same point is closed, what will this point be in the common part?',
        ),
        options: [
          { id: 'open', right: true, label: L('Ochiq', 'Открытой', 'Open') },
          { id: 'closed', label: L('Yopiq', 'Закрытой', 'Closed') },
        ],
        ok: L(
          "To'g'ri. Umumiy qismga kirish uchun nuqta HAR IKKALA shartga ham mos kelishi kerak. Ochiq nuqtada birinchi shart bajarilmaydi, shuning uchun umumiy qismda ham ochiq qoladi.",
          'Верно. Чтобы войти в общую часть, точка должна подходить ОБОИМ условиям. В открытой точке одно условие не выполняется, поэтому в общей части она тоже остаётся открытой.',
          'Correct. To belong to the common part, the point must fit BOTH conditions. At the open point one condition fails, so it stays open in the common part too.',
        ),
        hint: L(
          "3-ekranni eslang: ikki nuqtaning biri ochiq, biri yopiq qoldi, ular boshqa-boshqa tengsizlikdan kelgan edi.",
          'Вспомни 3 экран: одна точка осталась открытой, другая закрытой, они пришли из разных неравенств.',
          'Recall screen 3: one point stayed open, the other closed, they came from different inequalities.',
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
    "Umumiy qism, chegara, yo'q holat",
    'Общая часть, граница, отсутствие решений',
    'Common part, boundary, no solution',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda sistemaning yechimi ikkala to'plamning umumiy qismi ekanini taxmin qildingiz. Bugun aynan shu g'oyani to'liq egalladingiz.",
      'На первом экране ты предположил, что решение системы это общая часть обоих множеств. Сегодня ты полностью освоил именно эту идею.',
      'On the first screen you guessed that the solution of a system is the common part of both sets. Today you fully mastered exactly this idea.'),
    A('s1',
      "Siz ikkita yechimni bitta o'qqa qo'yishni, umumiy qism yo'q holatni tanishni, va chegara nuqtaning ochiq yoki yopiqligini to'g'ri hisoblashni o'rgandingiz.",
      'Ты освоил нанесение двух решений на одну ось, распознавание отсутствия общей части и правильный учёт открытости или закрытости граничной точки.',
      'You learned to place two solutions on one axis, to recognize the absence of a common part, and to correctly account for whether a boundary point is open or closed.'),
    A('s2',
      "Keyingi darsda kasr-ratsional tengsizliklar: maxrajning nol nuqtasi hech qachon javobga kirmaydi.",
      'В следующем уроке дробно-рациональные неравенства: нуль знаменателя никогда не входит в ответ.',
      'The next lesson covers fractional-rational inequalities: a zero of the denominator never belongs in the answer.'),
  ],
  props: {
    mark: '−4/3 ≤ x < 2,  x > 3',
    markNote: L(
      "ikki yechim, bitta umumiy qism",
      'два решения, одна общая часть',
      'two solutions, one common part',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      'Keyingi dars: kasr-ratsional tengsizliklar',
      'Следующий урок: дробно-рациональные неравенства',
      'Next lesson: fractional-rational inequalities',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     tool: 'pick', ...S1 },
  { role: 'support',  tag: 'faqat-bitta-tengsizlikni-tekshirish', ...S2 },
  { role: 'explain',  tag: 'chegara-turini-notogri-kochirish', ...S3 },
  { role: 'explain',  tag: 'kesishma-emas-birlashma-deb-oylash', ...S4 },
  { role: 'explain',  tag: 'kesishma-yoq-holatni-tanimaslik', ...S5 },
  { role: 'explain',  tag: 'faqat-bitta-tengsizlikni-tekshirish', ...S6 },
  { role: 'explain',  tag: 'kesishma-emas-birlashma-deb-oylash', ...S7 },
  { role: 'rule',     tag: 'faqat-bitta-tengsizlikni-tekshirish', ...S8 },
  { role: 'practice', tool: 'overlap', tag: 'chegara-turini-notogri-kochirish', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'kesishma-emas-birlashma-deb-oylash', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'kesishma-yoq-holatni-tanimaslik', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'faqat-bitta-tengsizlikni-tekshirish', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'chegara-turini-notogri-kochirish', ...S13 },
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
