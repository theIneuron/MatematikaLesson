// ============================================================================
// 9-sinf, Dars 18. TENGSIZLIKLAR MAJMUASI.
//
// REDAKSIYA 1, 2026-08-27. Bu mavzu ham alohida bobga ega emas
// (DARSLAR_REJASI_9SINF.md: «внутри Алг. §15, отдельного нет»). Darslikda
// «majmua» so'zi alohida ta'riflanmagan, lekin uning misoli bor: kirish
// qismidagi 8-sinf takrori, 7(3)-mashq (3-bet), |3x − 4| ≥ 2 — modulli
// tengsizlik, ikki holatga ajraladi, javob IKKI ALOHIDA oraliqdan iborat
// (birlashma). Bu 15-16-darslarda ko'rilgan «va» (kesishma) ga aynan
// qarama-qarshi: bu yerda «yoki» (birlashma).
//
// ASBOB: `Overlap` (Dars16, PODXOD_9SINF.md §4) — BU DARSDA `mode="or"`
// bilan BIRINCHI MARTA ishlatiladi. Kod o'zgarishi TALAB QILINMADI: asbob
// aynan shu ikkinchi rejim uchun oldindan tayyorlangan edi.
//
// Ikkinchi (o'z) misol: |x² − 4x − 1| ≥ 4, ikki holat ham kvadrat
// tengsizlik beradi (15-darsdagi usul bilan), javob UCHTA alohida
// oraliqdan iborat. Xuddi shu ikki tengsizlik SISTEMA (va) sifatida
// olinsa, kesishma bo'sh chiqadi — bu farq alohida ekranda ko'rsatiladi.
//
// TEGLAR (o'zining):
//   kesishma-deb-oylash          — majmuani sistema bilan almashtirib,
//                                   kesishma (umumiy qism) izlash
//   modul-holatini-notogri-ochish — modulni ikki holatga noto'g'ri ochish
//                                   (ikkinchi holatning ishorasini unutish)
//   faqat-bitta-tengsizlikni-yechish — ikkita holatdan faqat bittasini
//                                   yechib, ikkinchisini unutish
//   majmua-hamma-son-yechim-yoq-holati — chegara manfiy bo'lganda «barcha
//                                   son» yoki «yechim yo'q» holatini
//                                   tanimaslik
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, MATH_FONT, RuleCard, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { G9_RECOLOR, G9_STYLES, Overlap, RecallMC } from './asboblar.jsx'

export const META = {
  id: 'grade9-18',
  n: 18,
  row: 18,
  block: 'Б3',
  topic: L('Tengsizliklar majmuasi', 'Совокупность неравенств', 'A collection of inequalities'),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "Majmua yechimi kamida bitta tengsizlikni qanoatlantiradigan sonlar, ya'ni ularning birlashmasi",
    'Решение совокупности это числа, которые удовлетворяют хотя бы одному неравенству, то есть их объединение',
    'The solution of a collection is the numbers that satisfy at least one inequality, that is, their union',
  ),
  L(
    "Modulli tengsizlik ikki holatga ajraladi: har biri alohida yechilib, keyin birlashtiriladi",
    'Неравенство с модулем распадается на два случая: каждый решается отдельно, потом объединяется',
    'An inequality with absolute value splits into two cases: each is solved separately, then united',
  ),
  L(
    "Xuddi shu ikki tengsizlikni va bilan bog'lasangiz sistema, yoki bilan bog'lasangiz majmua bo'ladi, javoblari esa boshqa-boshqa",
    'Те же два неравенства, соединённые союзом и, дают систему, а союзом или дают совокупность, и ответы у них разные',
    'The same two inequalities joined by and give a system, joined by or give a collection, and the answers differ',
  ),
]

export const MISS = {
  'kesishma-deb-oylash': {
    what: L(
      "majmua sistema bilan almashtirilib, kesishma (umumiy qism) izlangan",
      'совокупность заменена системой, искалась общая часть (пересечение)',
      'the collection was swapped for a system, the common part (intersection) was sought',
    ),
    wrong: null,
    at: 0,
  },
  'modul-holatini-notogri-ochish': {
    what: L(
      "modul ikki holatga noto'g'ri ochilgan, ikkinchi holatning ishorasi unutilgan",
      'модуль неверно раскрыт на два случая, забыт знак во втором случае',
      'the absolute value was opened into two cases incorrectly, the sign was forgotten in the second case',
    ),
    wrong: null,
    at: 0,
  },
  'faqat-bitta-tengsizlikni-yechish': {
    what: L(
      "ikkita holatdan faqat bittasi yechilib, ikkinchisi unutilgan",
      'из двух случаев решён только один, второй забыт',
      'of the two cases, only one was solved, the second was forgotten',
    ),
    wrong: null,
    at: 0,
  },
  'majmua-hamma-son-yechim-yoq-holati': {
    what: L(
      "chegara manfiy bo'lganda \"barcha son\" yoki \"yechim yo'q\" holati tanilmagan",
      'при отрицательной границе не распознан случай «все числа» или «решений нет»',
      'when the threshold is negative, the "all numbers" or "no solution" case was not recognized',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// EKRAN 1. XUK.
// ============================================================
const S1 = {
  eyebrow: L("BITTASI YETARLI", 'ДОСТАТОЧНО ОДНОГО', 'ONE IS ENOUGH'),
  title: L(
    "Bu safar ikkalasi shart emas",
    'На этот раз не нужны оба',
    'This time both are not required',
  ),
  audio: [
    A('mount',
      "Uch x minus to'rt ning moduli, katta yoki teng ikki. Bu tengsizlik ikki holatga ajraladi: yo uch x minus to'rt katta, yo uning qarama-qarshisi katta.",
      'Модуль трёх x минус четыре, больше или равно двум. Это неравенство распадается на два случая: либо три x минус четыре большое, либо противоположное ему большое.',
      'The absolute value of three x minus four, greater than or equal to two. This inequality splits into two cases: either three x minus four is large, or its opposite is large.'),
    A('why',
      "16-darsda sistemaning yechimi ikkala shartga HAM mos kelishi kerak edi. Bu yerda ham xuddi shundaymi, deb o'ylaysiz?",
      'На 16 уроке решение системы должно было подходить ОБОИМ условиям. Думаешь, здесь так же?',
      'In lesson 16 the solution of a system had to fit BOTH conditions. Do you think it is the same here?'),
  ],
  props: {
    askClass: 'g9-ask-big',
    cardsClass: 'g9-cards-small',
    ask: L(
      "Modulli tengsizlikning ikki holatidan nechtasi bajarilishi kerak?",
      'Сколько из двух случаев неравенства с модулем должно выполняться?',
      'How many of the two cases of the modulus inequality must hold?',
    ),
    items: [
      {
        id: 'right', right: true,
        show: L("Kamida bittasi", 'Хотя бы один', 'At least one'),
      },
      {
        id: 'wrong',
        show: L("Ikkalasi ham, 16-darsdagidek", 'Оба, как на 16 уроке', 'Both, as in lesson 16'),
        hint: L(
          "16-darsda sistema edi: va. Bu yerda esa modul ikki holatga yoki bilan ajraladi: son yo bitta shartga, yo boshqasiga mos kelsa yetarli.",
          'На 16 уроке была система: и. А здесь модуль распадается на два случая через или: числу достаточно подходить одному условию или другому.',
          'In lesson 16 there was a system: "and". Here the modulus splits into two cases via "or": it is enough for the number to fit one condition or the other.',
        ),
      },
    ],
    after: L(
      "To'g'ri. Bugun majmua: kamida bitta shartga mos kelish yetarli.",
      'Верно. Сегодня совокупность: достаточно подходить хотя бы одному условию.',
      'Correct. Today, a collection: it is enough to fit at least one condition.',
    ),
  },
}

// ============================================================
// EKRAN 2. TAYANCH — modulni ikki holatga ochish.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Modulni ikki holatga ochish",
    'Раскрываем модуль на два случая',
    'Opening the absolute value into two cases',
  ),
  audio: [
    A('mount',
      "Uch x minus to'rt ning moduli, katta yoki teng ikki. Bu qanday ikki holatga ajraladi?",
      'Модуль трёх x минус четыре, больше или равно двум. На какие два случая это распадается?',
      'The absolute value of three x minus four, greater than or equal to two. Into what two cases does this split?'),
    A('why',
      "Modul ta'rifini eslang: ifodaning o'zi musbat bo'lsa, modul unga teng; manfiy bo'lsa, modul uning qarama-qarshisiga teng.",
      'Вспомни определение модуля: если выражение положительно, модуль равен ему самому; если отрицательно, модуль равен противоположному числу.',
      'Recall the definition of absolute value: if the expression is positive, the modulus equals it; if negative, the modulus equals its opposite.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('|3x − 4| ≥ 2', '|3x − 4| ≥ 2', '|3x − 4| ≥ 2')}
      steps={[
        { id: 'a', head: '1', lines: ['3x − 4 ≥ 2'] },
        { id: 'b', head: '2', lines: ['3x − 4 ≤ −2'] },
      ]}
      ask={L(
        "Ikkinchi holatda nega o'ng tomonda minus ikki turibdi, ikki emas?",
        'Почему во втором случае справа стоит минус два, а не два?',
        'Why does the second case have minus two on the right, not two?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L("Chunki modul ikkiga teng yoki undan katta bo'lishi uchun ifodaning o'zi ikkiga teng yoki undan katta, YOKI minus ikkiga teng yoki undan kichik bo'lishi kerak", 'Потому что для модуля больше или равного двум само выражение должно быть больше или равно двум, ИЛИ меньше или равно минус двум', 'Because for the modulus to be greater than or equal to two, the expression itself must be greater than or equal to two, OR less than or equal to minus two'),
        },
        {
          id: 'wrong',
          label: L("Bu xato, ikkalasida ham ikki bo'lishi kerak edi", 'Это ошибка, в обоих должно быть два', 'This is a mistake, both should have two'),
          hint: L(
            "Ifoda manfiy bo'lganda uning moduli qarama-qarshisiga teng: manfiy uch x minus to'rt. U ikkiga katta yoki teng bo'lishi uchun uch x minus to'rt minus ikkiga kichik yoki teng bo'lishi kerak.",
            'Когда выражение отрицательно, его модуль равен противоположному числу: минус три x минус четыре. Чтобы оно было больше или равно двум, три x минус четыре должно быть меньше или равно минус двум.',
            'When the expression is negative, its modulus equals its opposite: minus three x minus four. For that to be greater than or equal to two, three x minus four must be less than or equal to minus two.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Ikki holat: biri musbat tomon uchun, biri manfiy tomon uchun. Endi har birini alohida yechamiz.",
        'Верно. Два случая: один для положительной стороны, один для отрицательной. Теперь решим каждый отдельно.',
        'Correct. Two cases: one for the positive side, one for the negative side. Now let us solve each separately.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — Overlap: mode="or", BIRINCHI MARTA.
// ============================================================
const S3 = {
  eyebrow: L('YANGI REJIM', 'НОВЫЙ РЕЖИМ', 'A NEW MODE'),
  title: L(
    "Bitta qatorga mos kelish yetarli",
    'Достаточно подходить одной полосе',
    'Fitting one strip is enough',
  ),
  audio: [
    A('mount',
      "Ikkala holatning yechimi tayyor. Bu safar ikkalasiga ham emas, ULARDAN BIRIGA mos keladigan joylarni bo'yang.",
      'Решения обоих случаев готовы. На этот раз закрась места, подходящие ОДНОМУ ИЗ НИХ, а не обоим сразу.',
      'The solutions of both cases are ready. This time paint the places that fit ONE OF THEM, not both at once.'),
    W('sign',
      "16-darsda faqat ikkala qator ham bo'yalgan joy hisoblangan edi. Bugun bitta qator bo'yalgan joy ham yetarli.",
      'На 16 уроке засчитывалось только место, закрашенное на обеих полосах. Сегодня достаточно места, закрашенного хотя бы на одной.',
      'In lesson 16, only a place painted on both strips counted. Today a place painted on even one is enough.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <Overlap
      from={-2} to={5}
      layers={[
        { intervals: [{ a: 2, b: Infinity, openA: false, openB: true }] },
        { intervals: [{ a: -Infinity, b: 2 / 3, openA: true, openB: false }] },
      ]}
      layerLabels={[
        L('1-holat: x katta yoki teng ikki', '1-й случай: x больше или равно двум', '1st case: x greater than or equal to two'),
        L('2-holat: x kichik yoki teng ikki butun uchdan bir', '2-й случай: x меньше или равно двум третьим', '2nd case: x less than or equal to two thirds'),
      ]}
      mode="or"
      ask={L(
        "Kamida bitta holatga mos keladigan oraliqlarni bosib bo'yang",
        'Закрась промежутки, подходящие хотя бы одному случаю',
        'Paint the intervals that fit at least one case',
      )}
      after={L(
        "Ana xolos. Ikkala oraliq ham qoldi, orasidagi bo'sh joy esa bo'yalmadi: majmuaning javobi ikki ajralgan oraliqdan iborat.",
        'Вот и всё. Оба промежутка остались, а пустое место между ними не закрашено: ответ совокупности состоит из двух отдельных промежутков.',
        'That is all it takes. Both intervals remain, and the empty space between them stays unpainted: the answer of the collection is two separate intervals.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — nega "yoki" birlashma.
// ============================================================
const S4 = {
  eyebrow: L('NEGA BIRLASHMA', 'ПОЧЕМУ ОБЪЕДИНЕНИЕ', 'WHY THE UNION'),
  title: L(
    "Bitta shartga mos kelish kifoya",
    'Достаточно подходить одному условию',
    'Fitting one condition is enough',
  ),
  audio: [
    A('mount',
      "Nolni oling. U ikkinchi holatga mos keladi, chunki nol ikki butun uchdan birdan kichik. Birinchi holatga mos kelmasa ham, u majmuaning yechimimi?",
      'Возьми ноль. Он подходит второму случаю, ведь ноль меньше двух третьих. Хоть первому случаю он и не подходит, является ли он решением совокупности?',
      'Take zero. It fits the second case, since zero is less than two thirds. Even though it does not fit the first case, is it a solution of the collection?'),
    A('why',
      "Majmua yoki bilan bog'langan: bitta shart bajarilsa kifoya.",
      'Совокупность соединена союзом или: достаточно, чтобы выполнялось одно условие.',
      'A collection is joined by "or": it is enough for one condition to hold.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      steps={[]}
      ask={L(
        "Nol faqat ikkinchi holatga mos keladi, birinchisiga mos kelmaydi. U majmuaning yechimi bo'la oladimi?",
        'Ноль подходит только второму случаю, первому не подходит. Может ли он быть решением совокупности?',
        'Zero fits only the second case, not the first. Can it be a solution of the collection?',
      )}
      cols={1}
      items={[
        { id: 'right', right: true, label: L("Ha, u majmuaning yechimi", 'Да, он является решением совокупности', 'Yes, it is a solution of the collection') },
        {
          id: 'wrong',
          label: L("Yo'q, ikkalasiga ham mos kelishi kerak edi", 'Нет, он должен был подходить обоим', 'No, it should have fit both'),
          hint: L(
            "Bu 16-darsdagi sistema qoidasi, majmuaga emas. Majmuada bitta shartga mos kelish YETARLI: son ikkinchi holatga mos kelgani kifoya.",
            'Это правило системы с 16 урока, а не совокупности. В совокупности достаточно подходить одному условию: числу хватает того, что оно подходит второму случаю.',
            'This is the system rule from lesson 16, not the collection rule. In a collection, fitting one condition is ENOUGH: it is enough that the number fits the second case.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Shuning uchun majmuaning yechimi ikkala to'plamning BIRLASHMASI, kesishmasi emas.",
        'Верно. Поэтому решение совокупности это ОБЪЕДИНЕНИЕ обоих множеств, а не их пересечение.',
        'Correct. That is why the solution of a collection is the UNION of both sets, not their intersection.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — Overlap: mode="or", KVADRAT MISOL,
// UCH ORALIQ.
// ============================================================
const S5 = {
  eyebrow: L('KVADRAT MISOL', 'КВАДРАТИЧНЫЙ ПРИМЕР', 'A QUADRATIC EXAMPLE'),
  title: L(
    "Ikki holat ham kvadrat tengsizlik berishi mumkin",
    'Оба случая могут дать квадратное неравенство',
    'Both cases can give a quadratic inequality',
  ),
  audio: [
    A('mount',
      "X kvadrat minus to'rt x minus bir ning moduli, katta yoki teng to'rt. Ikki holat: birinchisi x kvadrat minus to'rt x minus besh, noldan katta yoki teng; ikkinchisi x kvadrat minus to'rt x qo'shi uch, kichik yoki teng nol.",
      'Модуль x в квадрате минус четыре x минус один, больше или равно четырём. Два случая: первый, x в квадрате минус четыре x минус пять, больше или равно нулю; второй, x в квадрате минус четыре x плюс три, меньше или равно нулю.',
      'The absolute value of x squared minus four x minus one, greater than or equal to four. Two cases: the first is x squared minus four x minus five, greater than or equal to zero; the second is x squared minus four x plus three, less than or equal to zero.'),
    A('why',
      "Ikkalasi ham 15-darsdagi usul bilan yechiladi: ildizlarni toping, oraliqlarni o'qing.",
      'Оба решаются способом с 15 урока: найди корни, прочитай промежутки.',
      'Both are solved with the method from lesson 15: find the roots, read the intervals.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <Overlap
      from={-3} to={7}
      layers={[
        { intervals: [{ a: -Infinity, b: -1, openA: true, openB: false }, { a: 5, b: Infinity, openA: false, openB: true }] },
        { intervals: [{ a: 1, b: 3, openA: false, openB: false }] },
      ]}
      layerLabels={[
        L('1-holat: x kichik yoki teng minus bir, yoki x katta yoki teng besh', '1-й случай: x меньше или равно минус одному, или x больше или равно пяти', '1st case: x less than or equal to minus one, or x greater than or equal to five'),
        L('2-holat: bir kichik yoki teng x, x kichik yoki teng uch', '2-й случай: от одного до трёх', '2nd case: from one to three'),
      ]}
      mode="or"
      ask={L(
        "Kamida bitta holatga mos keladigan oraliqlarni bosib bo'yang",
        'Закрась промежутки, подходящие хотя бы одному случаю',
        'Paint the intervals that fit at least one case',
      )}
      after={L(
        "Ana xolos. Uchta ajralgan oraliq hosil bo'ldi: birinchi holatning ikkala qismi va ikkinchi holatning o'zi, hech biri boshqasi bilan qo'shilmadi.",
        'Вот и всё. Получилось три отдельных промежутка: обе части первого случая и сам второй случай, ни один не слился с другим.',
        'That is all it takes. Three separate intervals resulted: both parts of the first case and the second case itself, none merged with another.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — CONTRAST: xuddi shu ikki tengsizlik
// SISTEMA bo'lganda edi.
// ============================================================
const S6 = {
  eyebrow: L("AGAR SISTEMA BO'LGANDA", 'ЕСЛИ БЫ БЫЛА СИСТЕМА', 'IF IT WERE A SYSTEM'),
  title: L(
    "Bir xil qurilish materiali, butunlay boshqa javob",
    'Одинаковый строительный материал, совсем другой ответ',
    'The same building blocks, a completely different answer',
  ),
  audio: [
    A('mount',
      "5-ekrandagi ikkala holatni eslang. Endi ularni va bilan bog'lasak, ya'ni sistema desak, javob qanday bo'lardi?",
      'Вспомни оба случая с 5 экрана. Если бы мы соединили их союзом и, то есть системой, каким был бы ответ?',
      'Recall both cases from screen 5. If we joined them with and, that is, as a system, what would the answer be?'),
    A('why',
      "Birinchi holat minus bir yoki undan kichik, yoki besh yoki undan katta edi. Ikkinchisi esa bir bilan uch orasi edi. Bular birga uchrashadimi?",
      'Первый случай был минус один или меньше, или пять или больше. Второй же между одним и тремя. Пересекаются ли они где-нибудь?',
      'The first case was minus one or less, or five or more. The second was between one and three. Do they meet anywhere?'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      steps={[]}
      ask={L(
        "Birinchi holat (minus birdan kichik yoki beshdan katta) va ikkinchi holat (bir bilan uch orasi) hech qayerda kesishadimi?",
        'Пересекаются ли где-нибудь первый случай (меньше минус одного или больше пяти) и второй (между одним и тремя)?',
        'Do the first case (less than minus one or greater than five) and the second (between one and three) overlap anywhere?',
      )}
      cols={1}
      items={[
        { id: 'right', right: true, label: L("Yo'q, hech qayerda kesishmaydi", 'Нет, нигде не пересекаются', 'No, they overlap nowhere') },
        {
          id: 'wrong',
          label: L("Ha, bir bilan uch orasida kesishadi", 'Да, пересекаются между одним и тремя', 'Yes, they overlap between one and three'),
          hint: L(
            "Bir bilan uch orasidagi sonlar birinchi holatga mos kelmaydi: ular minus birdan katta va beshdan kichik. Demak ikkala shartga BIRGA mos keladigan son yo'q.",
            'Числа между одним и тремя не подходят первому случаю: они больше минус одного и меньше пяти. Значит числа, подходящего ОБОИМ условиям сразу, нет.',
            'Numbers between one and three do not fit the first case: they are greater than minus one and less than five. So there is no number that fits BOTH conditions at once.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Sistema bo'lganda bu ikki shart hech qachon birga bajarilmaydi: kesishma bo'sh, yechim yo'q bo'lardi. Majmuada esa xuddi shu ikkita shart uchta oraliq beradi. Bog'lovchi va yoki yoki ekani javobni butunlay o'zgartiradi.",
        'Верно. Будь это система, эти два условия никогда бы не выполнились вместе: пересечение пусто, решений бы не было. А в совокупности те же два условия дают три промежутка. Выбор союза, и или или, полностью меняет ответ.',
        'Correct. As a system, these two conditions would never hold together: the intersection is empty, there would be no solution. But as a collection, the same two conditions give three intervals. Whether the connective is and or or completely changes the answer.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — CHEGARA MANFIY: "barcha son" va
// "yechim yo'q" holatlari.
// ============================================================
const S7 = {
  eyebrow: L('CHEGARA MANFIY BO\'LSA', 'ЕСЛИ ГРАНИЦА ОТРИЦАТЕЛЬНА', 'IF THE THRESHOLD IS NEGATIVE'),
  title: L(
    "Modul hech qachon manfiy bo'lmaydi",
    'Модуль никогда не бывает отрицательным',
    'The absolute value is never negative',
  ),
  audio: [
    A('mount',
      "X kvadrat qo'shi bir ning moduli, katta yoki teng minus uch. O'ng tomon manfiy. Bu tengsizlikni qaysi x qanoatlantiradi?",
      'Модуль x в квадрате плюс один, больше или равно минус трём. Правая часть отрицательна. Какие x удовлетворяют этому неравенству?',
      'The absolute value of x squared plus one, greater than or equal to minus three. The right side is negative. Which x satisfy this inequality?'),
    A('why',
      "Modul hech qachon manfiy son bo'lmaydi, u doim nolga katta yoki teng. Manfiy sondan katta yoki teng bo'lishi shart emas, u AVTOMATIK ravishda katta.",
      'Модуль никогда не бывает отрицательным числом, он всегда больше или равен нулю. Быть больше или равным отрицательному числу не нужно доказывать, это выполняется АВТОМАТИЧЕСКИ.',
      'The absolute value is never a negative number, it is always greater than or equal to zero. Being greater than or equal to a negative number does not need proving, it holds AUTOMATICALLY.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      steps={[]}
      ask={L(
        "X kvadrat qo'shi birning moduli, katta yoki teng minus uch tengsizligini qaysi x qanoatlantiradi?",
        'Какие x удовлетворяют неравенству: модуль x в квадрате плюс один больше или равен минус трём?',
        'Which x satisfy the inequality: the absolute value of x squared plus one is greater than or equal to minus three?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('Barcha son', 'Все числа', 'All numbers') },
        {
          id: 'wrong',
          label: L("Yechim yo'q", 'Решений нет', 'No solution'),
          hint: L(
            "Modul hech qachon manfiy bo'lmaydi, demak u minus uchdan har doim katta. Tengsizlik har qanday x da bajariladi.",
            'Модуль никогда не бывает отрицательным, значит он всегда больше минус трёх. Неравенство выполняется при любом x.',
            'The modulus is never negative, so it is always greater than minus three. The inequality holds for any x.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Chegara manfiy bo'lib, tengsizlik katta yoki teng bo'lsa, javob doim barcha son. Aksincha, kichik yoki teng bo'lsa, masalan modul kichik yoki teng minus uch, javob doim yechim yo'q, chunki modul hech qachon manfiy songa yetmaydi.",
        'Верно. Если граница отрицательна, а неравенство больше или равно, ответом всегда будут все числа. И наоборот, если меньше или равно, например модуль меньше или равен минус трём, ответом всегда будет решений нет, ведь модуль никогда не достигает отрицательного числа.',
        'Correct. If the threshold is negative and the inequality is greater than or equal, the answer is always all numbers. Conversely, if it is less than or equal, for example modulus less than or equal to minus three, the answer is always no solution, since the modulus never reaches a negative number.',
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
    "Algebra 9, 8-sinf takrori, 7(3)-mashq (3-bet)",
    'Алгебра 9, повторение 8 класса, упражнение 7(3) (стр. 3)',
    'Algebra 9, grade 8 review, exercise 7(3) (p. 3)',
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
          "Sistema va majmua orasidagi asosiy farq nima?",
          'В чём главное отличие системы от совокупности?',
          'What is the main difference between a system and a collection?',
        )}
        cols={1}
        items={[
          {
            id: 'right', right: true,
            label: L("Sistemada ikkalasi ham, majmuada kamida bittasi bajarilishi kerak", 'В системе должны выполняться оба, в совокупности хотя бы один', 'In a system both must hold, in a collection at least one'),
          },
          {
            id: 'wrong',
            label: L("Ular bir xil, faqat nomi boshqacha", 'Они одинаковы, только название разное', 'They are the same, just different names'),
            hint: L(
              "6-ekranni eslang: bir xil ikkita shart sistemada bo'sh javob, majmuada esa uchta oraliq bergan edi.",
              'Вспомни 6 экран: одни и те же два условия дали в системе пустой ответ, а в совокупности три промежутка.',
              'Recall screen 6: the same two conditions gave an empty answer as a system, and three intervals as a collection.',
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
    "Majmua: har birini alohida, keyin birlashtirib",
    'Совокупность: каждое отдельно, потом объединить',
    'A collection: each separately, then unite',
  ),
  audio: [
    A('mount',
      "Yetti ekranda siz birlashmani, sistema bilan farqini va chegara manfiy bo'lgan holatni o'z qo'lingiz bilan ko'rdingiz. Endi ular qoida sifatida.",
      'На семи экранах ты сам увидел объединение, отличие от системы и случай отрицательной границы. Теперь они в виде правила.',
      'On seven screens you saw with your own hands the union, the difference from a system, and the case of a negative threshold. Now here they are as a rule.'),
    W('card',
      "Qoida ochildi.",
      'Правило открылось.',
      'The rule is open.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — Overlap TAKRORI, mustaqil.
// ============================================================
const S9 = {
  eyebrow: L('TAKROR', 'ПОВТОР', 'REPEAT'),
  title: L(
    "Yana bitta majmua, endi mustaqil",
    'Ещё одна совокупность, теперь самостоятельно',
    'Another collection, now on your own',
  ),
  audio: [
    A('mount',
      "Ikki x qo'shi bir ning moduli, katta besh. Ikki holatni toping: biri musbat tomon uchun, biri manfiy tomon uchun.",
      'Модуль двух x плюс один, больше пяти. Найди два случая: один для положительной стороны, один для отрицательной.',
      'The absolute value of two x plus one, greater than five. Find two cases: one for the positive side, one for the negative side.'),
    A('why',
      "Har bir holat oddiy chiziqli tengsizlik beradi.",
      'Каждый случай даёт простое линейное неравенство.',
      'Each case gives a simple linear inequality.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <Overlap
      from={-6} to={4}
      layers={[
        { intervals: [{ a: 2, b: Infinity, openA: true, openB: true }] },
        { intervals: [{ a: -Infinity, b: -3, openA: true, openB: true }] },
      ]}
      layerLabels={[
        L('1-holat: x katta ikki', '1-й случай: x больше двух', '1st case: x greater than two'),
        L('2-holat: x kichik minus uch', '2-й случай: x меньше минус трёх', '2nd case: x less than minus three'),
      ]}
      mode="or"
      ask={L(
        "Kamida bitta holatga mos keladigan oraliqlarni bosib bo'yang",
        'Закрась промежутки, подходящие хотя бы одному случаю',
        'Paint the intervals that fit at least one case',
      )}
      after={L(
        "Ana xolos. Ikkala oraliq ham qat'iy ochiq qoldi: ikkalasi ham qat'iy tengsizlikdan kelgan.",
        'Вот и всё. Оба промежутка остались строго открытыми: оба пришли из строгого неравенства.',
        'That is all it takes. Both intervals stayed strictly open: both came from a strict inequality.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 10. MASHQ — ZANJIR: modulni ikki holatga ochish.
// ============================================================
const S10 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "Modulli tengsizlikni ikki holatga ochish",
    'Раскрываем неравенство с модулем на два случая',
    'Opening a modulus inequality into two cases',
  ),
  audio: [
    A('mount',
      "To'rtta modulli tengsizlik. Har birini ikki holatga oching.",
      'Четыре неравенства с модулем. Каждое раскрой на два случая.',
      'Four modulus inequalities. Open each into two cases.'),
    A('why',
      "Ikkinchi holatda ifodaning o'zi emas, uning qarama-qarshisi ishlatiladi.",
      'Во втором случае используется не само выражение, а противоположное ему.',
      'In the second case, not the expression itself but its opposite is used.'),
  ],
  props: {
    stepLabel: L('Tengsizlik', 'Неравенство', 'Inequality'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "To'rttasi ham ochildi: har birida ikkinchi holat birinchisining qarama-qarshisi bilan yoziladi.",
      'Все четыре раскрыты: во всех второй случай записан через противоположное первому.',
      'All four are opened: in each, the second case is written using the opposite of the first.',
    ),
    tasks: [
      {
        expr: '|x + 5| > 3',
        question: L('Ikki holat qanday yoziladi?', 'Как записываются два случая?', 'How are the two cases written?'),
        ok: L("Ha. Birinchi holat ifodaning o'zi, ikkinchisi uning qarama-qarshisi bilan.", 'Да. Первый случай через само выражение, второй через противоположное ему.', 'Yes. The first case through the expression itself, the second through its opposite.'),
        items: [
          { id: 'a', right: true, label: L('x + 5 > 3 yoki x + 5 < −3', 'x + 5 > 3 или x + 5 < −3', 'x + 5 > 3 or x + 5 < −3') },
          { id: 'b', label: L('x + 5 > 3 yoki x + 5 > −3', 'x + 5 > 3 или x + 5 > −3', 'x + 5 > 3 or x + 5 > −3'), hint: L("Ikkinchi holatda ifoda manfiy bo'lgani uchun modul uning qarama-qarshisiga teng, va tengsizlik belgisi ham teskarisiga aylanadi.", 'Во втором случае выражение отрицательно, поэтому модуль равен противоположному числу, и знак неравенства меняется на обратный.', 'In the second case the expression is negative, so the modulus equals its opposite, and the inequality sign flips too.') },
        ],
        solution: ['x + 5 > 3   ∨   x + 5 < −3'],
      },
      {
        expr: '|2x − 1| ≥ 7',
        question: L('Ikki holat qanday yoziladi?', 'Как записываются два случая?', 'How are the two cases written?'),
        ok: L("Ha. Katta yoki teng belgisi ikkala holatda ham saqlanadi, faqat ikkinchisida ishora almashadi.", 'Да. Знак больше или равно сохраняется в обоих случаях, только во втором меняется знак выражения.', 'Yes. The greater-than-or-equal sign is kept in both cases, only the sign of the expression flips in the second.'),
        items: [
          { id: 'a', right: true, label: L('2x − 1 ≥ 7 yoki 2x − 1 ≤ −7', '2x − 1 ≥ 7 или 2x − 1 ≤ −7', '2x − 1 ≥ 7 or 2x − 1 ≤ −7') },
          { id: 'b', label: L('2x − 1 ≥ 7 yoki 2x − 1 ≥ −7', '2x − 1 ≥ 7 или 2x − 1 ≥ −7', '2x − 1 ≥ 7 or 2x − 1 ≥ −7'), hint: L("Ikkinchi holatda tengsizlik belgisi ham teskarisiga o'tadi: katta yoki teng, kichik yoki tengga aylanadi.", 'Во втором случае знак неравенства тоже меняется на обратный: больше или равно становится меньше или равно.', 'In the second case the inequality sign also flips: greater-than-or-equal becomes less-than-or-equal.') },
        ],
        solution: ['2x − 1 ≥ 7   ∨   2x − 1 ≤ −7'],
      },
      {
        expr: '|x² − 2x| > 3',
        question: L('Ikki holat qanday yoziladi?', 'Как записываются два случая?', 'How are the two cases written?'),
        ok: L("Ha. Bu safar ifoda kvadrat, lekin qoida bir xil: ikkinchi holatda ishora almashadi.", 'Да. На этот раз выражение квадратное, но правило то же: во втором случае знак меняется.', 'Yes. This time the expression is quadratic, but the rule is the same: the sign flips in the second case.'),
        items: [
          { id: 'a', right: true, label: L('x² − 2x > 3 yoki x² − 2x < −3', 'x² − 2x > 3 или x² − 2x < −3', 'x² − 2x > 3 or x² − 2x < −3') },
          { id: 'b', label: L('x² − 2x > 3 yoki 2x − x² > 3', 'x² − 2x > 3 или 2x − x² > 3', 'x² − 2x > 3 or 2x − x² > 3'), hint: L("Ifodaning o'zi qarama-qarshisiga almashtirilmaydi, faqat tengsizlikning o'ng tomoni va belgisi o'zgaradi.", 'Само выражение не заменяется на противоположное, меняется только правая часть и знак неравенства.', 'The expression itself is not replaced by its opposite, only the right side and the inequality sign change.') },
        ],
        solution: ['x² − 2x > 3   ∨   x² − 2x < −3'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — QOG'OZDA: sistema yoki majmua ekanini
// aniqlash.
// ============================================================
const S11 = {
  eyebrow: L('QOG\'OZDA', 'НА БУМАГЕ', 'ON PAPER'),
  title: L(
    "Sistemami, majmuami: bog'lovchiga qarab aniqlash",
    'Система или совокупность: определяем по союзу',
    'System or collection: determined by the connective',
  ),
  audio: [
    A('mount',
      "Har savolda ikkita shart va bog'lovchi berilgan. Bu sistemami, majmuami, va javob turi qanday bo'lishini ayting.",
      'В каждом вопросе даны два условия и союз. Скажи, система это или совокупность, и какого типа будет ответ.',
      'Each question gives two conditions and a connective. Say whether it is a system or a collection, and what type of answer results.'),
    A('why',
      "Va kesishma, yoki birlashma beradi.",
      'И даёт пересечение, или даёт объединение.',
      'And gives an intersection, or gives a union.'),
  ],
  props: {
    stepLabel: L('Savol', 'Вопрос', 'Question'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham aniqlandi: bog'lovchining o'zi javobning turini, kesishma yoki birlashmani, belgilaydi.",
      'Все три определены: сам союз определяет тип ответа, пересечение или объединение.',
      'All three are determined: the connective itself determines the type of answer, intersection or union.',
    ),
    tasks: [
      {
        expr: 'x < 2   ∧   x > 0',
        question: L('Bu sistemami, majmuami?', 'Это система или совокупность?', 'Is this a system or a collection?'),
        ok: L("Ha. Va bog'lovchisi sistema beradi: javob kesishma, ya'ni nol bilan ikki orasi.", 'Да. Союз и даёт систему: ответ это пересечение, то есть между нулём и двумя.', 'Yes. The connective and gives a system: the answer is the intersection, that is, between zero and two.'),
        items: [
          { id: 'a', right: true, label: L('Sistema, javob: 0 dan 2 gacha', 'Система, ответ: от 0 до 2', 'System, answer: from 0 to 2') },
          { id: 'b', label: L('Majmua, javob: barcha son', 'Совокупность, ответ: все числа', 'Collection, answer: all numbers'), hint: L("Va so'zi ikkala shart HAM bajarilishini talab qiladi: bu sistema, kesishma.", 'Слово и требует, чтобы выполнялись ОБА условия: это система, пересечение.', 'The word and requires BOTH conditions to hold: this is a system, an intersection.') },
        ],
        solution: [
          L('Va: sistema', 'И: система', 'And: a system'),
          L('Kesishma: 0 < x < 2', 'Пересечение: 0 < x < 2', 'Intersection: 0 < x < 2'),
        ],
      },
      {
        expr: 'x < 0   ∨   x > 2',
        question: L('Bu sistemami, majmuami?', 'Это система или совокупность?', 'Is this a system or a collection?'),
        ok: L("Ha. Yoki bog'lovchisi majmua beradi: javob birlashma, ikki ajralgan oraliq.", 'Да. Союз или даёт совокупность: ответ это объединение, два отдельных промежутка.', 'Yes. The connective or gives a collection: the answer is the union, two separate intervals.'),
        items: [
          { id: 'a', right: true, label: L('Majmua, javob: ikki ajralgan oraliq', 'Совокупность, ответ: два отдельных промежутка', 'Collection, answer: two separate intervals') },
          { id: 'b', label: L("Sistema, javob: yechim yo'q", 'Система, ответ: решений нет', 'System, answer: no solution'), hint: L("Yoki so'zi kamida BITTA shart bajarilishini talab qiladi: bu majmua, birlashma.", 'Слово или требует, чтобы выполнялось ХОТЯ БЫ ОДНО условие: это совокупность, объединение.', 'The word or requires AT LEAST ONE condition to hold: this is a collection, a union.') },
        ],
        solution: [
          L('Yoki: majmua', 'Или: совокупность', 'Or: a collection'),
          'x < 0   ∨   x > 2',
        ],
      },
      {
        expr: 'x > 5   ∧   x < 1',
        question: L('Bu qanday javob beradi?', 'Какой это даёт ответ?', 'What answer does this give?'),
        ok: L("Yo'q. Va bog'lovchisi sistema, lekin bu ikki shart hech qachon birga bajarilmaydi: kesishma bo'sh.", 'Нет. Союз и даёт систему, но эти два условия никогда не выполняются вместе: пересечение пусто.', 'No. The connective and gives a system, but these two conditions never hold together: the intersection is empty.'),
        items: [
          { id: 'a', right: true, label: L("Sistema, lekin yechim yo'q", 'Система, но решений нет', 'System, but no solution') },
          { id: 'b', label: L('Sistema, javob: 1 dan 5 gacha', 'Система, ответ: от 1 до 5', 'System, answer: from 1 to 5'), hint: L("Beshdan katta va birdan kichik sonlar bir vaqtda bo'la olmaydi: bunday son yo'q.", 'Число не может одновременно быть больше пяти и меньше одного: такого числа не существует.', 'A number cannot be both greater than five and less than one at once: no such number exists.') },
        ],
        solution: [
          L('Va: sistema', 'И: система', 'And: a system'),
          L("Ikki shart mos kelmaydi: yechim yo'q", 'Два условия не совпадают: решений нет', 'The two conditions do not match: no solution'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ. Malika majmuani sistemadek yechib, kesishma
// izlagan.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Majmuani sistemadek yechish",
    'Решить совокупность как систему',
    'Solving a collection like a system',
  ),
  audio: [
    A('mount',
      "Malikaning yechimi. X qo'shi ikki ning moduli, katta besh tengsizligi uchun u ikki holatni topdi: x katta uch, yoki x kichik minus yetti. Keyin ularning UMUMIY QISMINI izlab, bo'sh deb javob berdi.",
      'Решение Малики. Для неравенства модуль x плюс два больше пяти она нашла два случая: x больше трёх, или x меньше минус семи. Затем она искала их ОБЩУЮ ЧАСТЬ и ответила пусто.',
      "Malika's solution. For the inequality the absolute value of x plus two is greater than five, she found two cases: x greater than three, or x less than minus seven. Then she looked for their COMMON PART and answered empty."),
    A('why',
      "Ikki holat qanday bog'lovchi bilan ulanadi: modul ta'rifidan kelib chiqqan holda?",
      'Каким союзом соединяются два случая, исходя из определения модуля?',
      'What connective joins the two cases, based on the definition of absolute value?'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Modulning ikki holati doim «yoki» bilan bog'lanadi: bu majmua, kesishma emas, birlashma izlanadi.",
      'Два случая модуля всегда соединяются «или»: это совокупность, ищется не пересечение, а объединение.',
      "The two cases of a modulus are always joined by \"or\": this is a collection, not an intersection but a union is sought.",
    ),
    tasks: [
      {
        expr: '|x + 2| > 5',
        question: L(
          "Malika kesishma izlab, javobni bo'sh deb yozdi. Modulning ikki holati qanday bog'lovchi bilan ulanadi: va bilanmi, yoki bilanmi?",
          'Малика искала пересечение и записала ответ как пустое множество. Каким союзом соединяются два случая модуля: и или или?',
          'Malika looked for the intersection and wrote the answer as empty. What connective joins the two cases of a modulus: and, or or?',
        ),
        ok: L(
          "Yoki bilan: ifoda yo musbat, yo manfiy bo'ladi, ikkalasi birga emas. Demak bu majmua, javob birlashma: x uchdan katta, yoki x minus yettidan kichik.",
          'Союзом или: выражение бывает либо положительным, либо отрицательным, но не тем и другим сразу. Значит это совокупность, ответ объединение: x больше трёх, или x меньше минус семи.',
          'With or: the expression is either positive or negative, never both at once. So this is a collection, the answer is a union: x greater than three, or x less than minus seven.',
        ),
        items: [
          {
            id: 'a', right: true,
            label: L('Yoki bilan: bu majmua, javob birlashma', 'Союзом или: это совокупность, ответ объединение', 'With or: this is a collection, the answer is a union'),
          },
          {
            id: 'b',
            label: L("Va bilan, Malika to'g'ri qildi", 'Союзом и, Малика поступила верно', 'With and, Malika did it correctly'),
            hint: L("Ifoda bir vaqtning o'zida ham musbat, ham manfiy bo'la olmaydi: ikki holat bir-birini to'ldiradi, ikkalasi birga emas, kamida bittasi tanlanadi.", 'Выражение не может быть одновременно и положительным, и отрицательным: два случая дополняют друг друга, а не требуются вместе, выбирается хотя бы один.', 'The expression cannot be both positive and negative at once: the two cases complement each other, not both required together, at least one is chosen.'),
          },
        ],
        solution: [
          L("Modulning ikki holati yoki bilan bog'lanadi", 'Два случая модуля соединяются союзом или', 'The two cases of the modulus are joined by or'),
          'x > 3  ∨  x < −7',
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TRANSFER — mustaqil, yangi modulli tengsizlik.
// ============================================================
const S13 = {
  eyebrow: L('TRANSFER', 'ПЕРЕНОС', 'TRANSFER'),
  title: L(
    "Boshqa modulli tengsizlik, xuddi shu yo'l",
    'Другое неравенство с модулем, тот же путь',
    'A different modulus inequality, the same path',
  ),
  audio: [
    A('mount',
      "X kvadrat minus uch x ning moduli, katta besh. Usul xuddi 5-ekrandagidek: ikki holat, ikkalasi ham kvadrat tengsizlik.",
      'Модуль x в квадрате минус три x, больше пяти. Способ тот же, что на 5 экране: два случая, оба квадратные неравенства.',
      'The absolute value of x squared minus three x, greater than five. The method is the same as on screen 5: two cases, both quadratic inequalities.'),
    A('why',
      "Ikkinchi holatni yozishda ishorani unutmang.",
      'Не забудь про знак при записи второго случая.',
      'Do not forget the sign when writing the second case.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Topildi: usul xuddi 5-ekrandagidek ishladi, faqat sonlar boshqacha.",
      'Найдено: способ сработал так же, как на 5 экране, только с другими числами.',
      'Found: the method worked the same way as on screen 5, only with different numbers.',
    ),
    tasks: [
      {
        expr: '|x² − 3x| > 5',
        question: L(
          "Ikki holat qanday yoziladi?",
          'Как записываются два случая?',
          'How are the two cases written?',
        ),
        ok: L(
          "Ha. Birinchi holat ifodaning o'zi bilan, ikkinchisi uning qarama-qarshisi bilan yoziladi.",
          'Да. Первый случай записывается через само выражение, второй через противоположное ему.',
          'Yes. The first case is written through the expression itself, the second through its opposite.',
        ),
        items: [
          { id: 'a', right: true, label: L('x² − 3x > 5 yoki x² − 3x < −5', 'x² − 3x > 5 или x² − 3x < −5', 'x² − 3x > 5 or x² − 3x < −5') },
          { id: 'b', label: L('x² − 3x > 5 yoki x² − 3x > −5', 'x² − 3x > 5 или x² − 3x > −5', 'x² − 3x > 5 or x² − 3x > −5'), hint: L("Ikkinchi holatda tengsizlik belgisi ham teskarisiga o'tadi, aks holda ikkala holat deyarli bir xil bo'lib qoladi.", 'Во втором случае знак неравенства тоже меняется на обратный, иначе оба случая почти совпадут.', 'In the second case the inequality sign also flips, otherwise both cases would nearly coincide.') },
        ],
        solution: ['x² − 3x > 5   ∨   x² − 3x < −5'],
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
    "Blits: birlashma, modul, chegara",
    'Блиц: объединение, модуль, граница',
    'Blitz: union, modulus, threshold',
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
        tag: 'kesishma-deb-oylash',
        ask: L(
          "Majmuaning yechimini topish uchun ikkala shartning umumiy qismini izlash kerakmi?",
          'Нужно ли для решения совокупности искать общую часть обоих условий?',
          'To solve a collection, do you need to look for the common part of both conditions?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'yes', label: L('Ha', 'Да', 'Yes') },
        ],
        ok: L(
          "To'g'ri. Majmuada birlashma izlanadi: kamida bitta shartga mos kelish yetarli.",
          'Верно. В совокупности ищется объединение: достаточно подходить хотя бы одному условию.',
          'Correct. In a collection, the union is sought: fitting at least one condition is enough.',
        ),
        hint: L(
          "12-ekranni eslang: Malika aynan shu xatoni qilgan.",
          'Вспомни 12 экран: именно эту ошибку допустила Малика.',
          "Recall screen 12: this was exactly Malika's mistake.",
        ),
      },
      {
        id: 'q2',
        tag: 'modul-holatini-notogri-ochish',
        ask: L(
          "Modulni ikki holatga ochganda, ikkinchi holatda ifodaning ishorasi almashtirilishi kerakmi?",
          'При раскрытии модуля на два случая, во втором случае знак выражения нужно менять?',
          'When opening a modulus into two cases, must the sign of the expression be flipped in the second case?',
        ),
        options: [
          { id: 'yes', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
        ],
        ok: L(
          "To'g'ri. Ikkinchi holat ifodaning qarama-qarshisi bilan yoziladi, aks holda u birinchi holatning takrori bo'lib qoladi.",
          'Верно. Второй случай записывается через противоположное выражение, иначе он просто повторит первый.',
          'Correct. The second case is written using the opposite expression, otherwise it would just repeat the first.',
        ),
        hint: L(
          "2-ekranni eslang: ikkinchi holatda minus uch x qo'shi to'rt yozilgan edi, uch x minus to'rt emas.",
          'Вспомни 2 экран: во втором случае было записано минус три x плюс четыре, а не три x минус четыре.',
          'Recall screen 2: in the second case, minus three x plus four was written, not three x minus four.',
        ),
      },
      {
        id: 'q3',
        tag: 'faqat-bitta-tengsizlikni-yechish',
        ask: L(
          "Modulli tengsizlikni yechishda faqat bitta holatni yechib, ikkinchisini o'tkazib yuborish mumkinmi?",
          'Можно ли при решении неравенства с модулем решить только один случай, пропустив второй?',
          'When solving a modulus inequality, can you solve only one case and skip the second?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'yes', label: L('Ha', 'Да', 'Yes') },
        ],
        ok: L(
          "To'g'ri. Ikkinchi holat javobning bir qismini beradi, uni o'tkazib yuborish javobni to'liqsiz qoldiradi.",
          'Верно. Второй случай даёт часть ответа, его пропуск оставляет ответ неполным.',
          'Correct. The second case gives part of the answer, skipping it leaves the answer incomplete.',
        ),
        hint: L(
          "5-ekranni eslang: ikkinchi holat o'rta oraliqni berdi, u birinchisiz javobga kirmay qolardi.",
          'Вспомни 5 экран: второй случай дал средний промежуток, без него он не вошёл бы в ответ.',
          'Recall screen 5: the second case gave the middle interval, without it that would be missing from the answer.',
        ),
      },
      {
        id: 'q4',
        tag: 'majmua-hamma-son-yechim-yoq-holati',
        ask: L(
          "Modul kichik yoki teng bo'lgan chegara manfiy bo'lsa (masalan, modul kichik yoki teng minus uch), bu tengsizlikning yechimi bormi?",
          'Если граница у неравенства «модуль меньше или равно» отрицательна (например, меньше или равен минус трём), есть ли у него решение?',
          'If the threshold in a "modulus less than or equal" inequality is negative (for example, less than or equal to minus three), does it have a solution?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'yes', label: L('Ha', 'Да', 'Yes') },
        ],
        ok: L(
          "To'g'ri. Modul hech qachon manfiy songa yetmaydi, shuning uchun bunday tengsizlikning yechimi yo'q.",
          'Верно. Модуль никогда не достигает отрицательного числа, поэтому у такого неравенства нет решений.',
          'Correct. The modulus never reaches a negative number, so such an inequality has no solution.',
        ),
        hint: L(
          "7-ekranni eslang: katta yoki teng bo'lsa barcha son, kichik yoki teng bo'lsa yechim yo'q edi.",
          'Вспомни 7 экран: при больше или равно все числа, при меньше или равно решений нет.',
          'Recall screen 7: greater-than-or-equal gave all numbers, less-than-or-equal gave no solution.',
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
    "Birlashma, modul, chegara manfiy holat",
    'Объединение, модуль, случай отрицательной границы',
    'Union, modulus, the negative-threshold case',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda ikki holatdan bittasiga mos kelish yetarli ekanini taxmin qildingiz. Bugun aynan shu g'oyani to'liq egalladingiz.",
      'На первом экране ты предположил, что достаточно подходить хотя бы одному из двух случаев. Сегодня ты полностью освоил именно эту идею.',
      'On the first screen you guessed that fitting at least one of the two cases is enough. Today you fully mastered exactly this idea.'),
    A('s1',
      "Siz modulni ikki holatga ochishni, majmuaning sistemadan farqini, va chegara manfiy bo'lganda barcha son yoki yechim yo'q holatini tanishni o'rgandingiz.",
      'Ты освоил раскрытие модуля на два случая, отличие совокупности от системы, и распознавание случаев все числа или решений нет при отрицательной границе.',
      'You learned to open a modulus into two cases, the difference between a collection and a system, and to recognize the all-numbers or no-solution case when the threshold is negative.'),
    A('s2',
      "Keyingi darsda tengsizlik masalalari: matndan tengsizlik tuzish.",
      'В следующем уроке задачи на неравенства: составление неравенства по тексту.',
      'The next lesson covers inequality word problems: building an inequality from text.'),
  ],
  props: {
    mark: 'x ≤ 2/3  ∪  x ≥ 2',
    markNote: L(
      "birlashma, ikki ajralgan oraliq",
      'объединение, два отдельных промежутка',
      'union, two separate intervals',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      'Keyingi dars: tengsizlik masalalari',
      'Следующий урок: задачи на неравенства',
      'Next lesson: inequality word problems',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     tool: 'pick', ...S1 },
  { role: 'support',  tag: 'modul-holatini-notogri-ochish', ...S2 },
  { role: 'explain',  tag: 'kesishma-deb-oylash', ...S3 },
  { role: 'explain',  tag: 'kesishma-deb-oylash', ...S4 },
  { role: 'explain',  tag: 'faqat-bitta-tengsizlikni-yechish', ...S5 },
  { role: 'explain',  tag: 'kesishma-deb-oylash', ...S6 },
  { role: 'explain',  tag: 'majmua-hamma-son-yechim-yoq-holati', ...S7 },
  { role: 'rule',     tag: 'kesishma-deb-oylash', ...S8 },
  { role: 'practice', tool: 'overlap', tag: 'kesishma-deb-oylash', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'modul-holatini-notogri-ochish', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'kesishma-deb-oylash', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'kesishma-deb-oylash', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'modul-holatini-notogri-ochish', ...S13 },
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
