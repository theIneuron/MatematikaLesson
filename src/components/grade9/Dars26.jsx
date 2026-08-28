// ============================================================================
// 9-sinf, Dars 26. PROGRESSIYALARGA OID MASALALAR.
//
// REDAKSIYA 1, 2026-08-27. Darslik: Algebra 9, IV bobga doir mashqlar
// (177-178-bet), 423-438-mashqlar. YANGI NAZARIYA YO'Q.
//
// DARSNING MAQSADI — TANIB OLISH. 22-25-darslarda to'rtta formula
// yig'ildi: a_n, S_n arifmetikda va b_n, S_n geometrikda. Bola endi
// ularni bilishi kam, TANLASHI kerak. Shuning uchun bu dars butunlay
// tanlash ustiga qurilgan: har ekranda avval «qaysi progressiya va qaysi
// formula», keyin hisob.
//
// XUK — ataylab yasalgan juftlik: 3, 6, 9, 12 va 3, 6, 12, 24. BIRINCHI
// IKKITA HADI BIR XIL. Ikki haddan hukm chiqarib bo'lmaydi, uchinchisini
// ko'rish shart. Butun darsning kaliti shu, va 12-ekrandagi tuzoq ham
// aynan shu xatoni takrorlaydi.
//
// DARSLIKDAN OLINGAN MASALALAR:
//   438.3 (178-bet): a_6 = 10, a_11 = 0 → d = −2, a_1 = 20, a_19 = −16.
//   428.1 (177-bet): −38 + (−33) + ... + 12. Avval n = 11, keyin
//       S = −143. Ikki qadamli, 23-darsdagi kabi.
//   433.2 (178-bet): 162, 54, 18, ..., n = 5 → S = 242.
//   432.4 (178-bet): b_1 = 5, q = −1, n = 9 → S = 5. Ishoralar
//       o'zaro qisqaradi, faqat bitta had qoladi.
//   432.3 (178-bet): b_1 = 10, q = 1, n = 6 → S = 60, formula emas.
//   429, 431 (178-bet): maxraj va had topish.
//   437 (178-bet): −10 va 5 orasiga bitta son qo'yish.
//
// DARSLIK XATOSI. 433.1) da «128, 64, 31, ...» chop etilgan, lekin
// 31 emas, 32 bo'lishi kerak: 128, 64, 32 — maxraji 1/2. 31 bilan bu
// umuman progressiya bo'lmaydi. 11-ekranda TUZATILGAN holda olindi,
// S_6 = 252. Bu 9-sinf darsligida topilgan IKKINCHI terish xatosi
// (birinchisi 21-darsda, 28-§ 3-masalada edi).
//
// TRANSFER (13-ekran) 22- va 24-DARSNI BIR JOYGA KELTIRADI: −10 va 5
// orasiga arifmetik progressiya uchun son qo'yish mumkin, chunki o'rta
// arifmetik har doim bor. Geometrik uchun esa mumkin emas: x² = −50
// bo'lib qoladi. Ya'ni o'rta geometrik faqat bir xil ishorali sonlar
// orasida yashaydi. Bu darslikda ochiq yozilmagan, lekin 24-darsdagi
// «musbat hadlarda» shartidan bevosita kelib chiqadi.
//
// YANGI ASBOB YO'Q: tanib olish qo'l harakati emas, savol. Barcha
// ekranlar `RecallMC` va `Drill` ustida.
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, RuleCard, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { G9_RECOLOR, G9_STYLES, RecallMC } from './asboblar.jsx'

export const META = {
  id: 'grade9-26',
  n: 26,
  row: 26,
  block: 'Б4',
  topic: L(
    'Progressiyalarga oid masalalar',
    'Задачи на прогрессии',
    'Problems on progressions',
  ),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "Progressiya turini ikkita haddan aniqlab bo'lmaydi, uchinchisini tekshirish shart",
    'Тип прогрессии нельзя определить по двум членам, третий нужно проверить',
    'The type of a progression cannot be decided from two terms, the third must be checked',
  ),
  L(
    "Ayirma bir xil bo'lsa arifmetik, nisbat bir xil bo'lsa geometrik progressiya",
    'Если одинакова разность — арифметическая, если одинаково отношение — геометрическая',
    'Equal differences mean arithmetic, equal ratios mean geometric',
  ),
  L(
    "Yig'indi so'ralganda avval hadlar soni aniqlanadi, u berilmagan bo'lishi mumkin",
    'Когда спрашивают сумму, сначала находят число членов, оно может быть не дано',
    'When a sum is asked for, first find the number of terms, it may not be given',
  ),
]

export const MISS = {
  'ikki-haddan-hukm': {
    what: L(
      "progressiya turi faqat ikkita hadga qarab aytildi",
      'тип прогрессии назван по двум членам',
      'the type of progression was named from two terms only',
    ),
    wrong: null,
    at: 0,
  },
  'formulani-adashtirish': {
    what: L(
      "arifmetik progressiya formulasi geometrikka qo'llanildi yoki aksincha",
      'формула арифметической прогрессии применена к геометрической или наоборот',
      'the arithmetic progression formula was applied to a geometric one or the other way round',
    ),
    wrong: null,
    at: 0,
  },
  'hadlar-sonini-topmaslik': {
    what: L(
      "hadlar soni topilmasdan yig'indi formulasiga o'tildi",
      'к формуле суммы перешли, не найдя число членов',
      'the sum formula was used before the number of terms was found',
    ),
    wrong: null,
    at: 0,
  },
  'ortada-geometrik-imkonsiz': {
    what: L(
      "turli ishorali sonlar orasiga geometrik o'rta qo'yish mumkin deb hisoblandi",
      'сочтено, что между числами разных знаков можно вставить геометрическое среднее',
      'it was assumed a geometric mean can be placed between numbers of opposite signs',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// EKRAN 1. XUK — ikki qator, birinchi ikkita hadi bir xil.
// ============================================================
const S1 = {
  eyebrow: L('BIR XIL BOSHLANISH', 'ОДИНАКОВОЕ НАЧАЛО', 'THE SAME BEGINNING'),
  title: L(
    "Ikkita had hali hech narsa demaydi",
    'Два члена ещё ничего не говорят',
    'Two terms say nothing yet',
  ),
  audio: [
    A('mount',
      "Ikkita qator. Birinchisi uch, olti, to'qqiz, o'n ikki. Ikkinchisi uch, olti, o'n ikki, yigirma to'rt.",
      'Два ряда. Первый три, шесть, девять, двенадцать. Второй три, шесть, двенадцать, двадцать четыре.',
      'Two rows. The first is three, six, nine, twelve. The second is three, six, twelve, twenty four.'),
    A('why',
      "Ikkalasi ham uch va oltidan boshlanadi. Lekin ular bir xil progressiyami?",
      'Оба начинаются с трёх и шести. Но одинаковые ли это прогрессии?',
      'Both begin with three and six. But are they the same kind of progression?'),
  ],
  props: {
    askClass: 'g9-ask-big',
    cardsClass: 'g9-cards-small',
    ask: L(
      "3, 6, 9, 12 va 3, 6, 12, 24. Bu ikki qator bir xil turdagimi?",
      '3, 6, 9, 12 и 3, 6, 12, 24. Одного ли они типа?',
      '3, 6, 9, 12 and 3, 6, 12, 24. Are they of the same type?',
    ),
    items: [
      {
        id: 'right', right: true,
        show: L(
          "Yo'q: birinchisi arifmetik, ikkinchisi geometrik",
          'Нет: первый арифметический, второй геометрический',
          'No: the first is arithmetic, the second is geometric',
        ),
      },
      {
        id: 'wrong',
        show: L(
          "Ha: ikkalasida ham uchdan oltiga uch qo'shilgan",
          'Да: в обоих от трёх к шести прибавили три',
          'Yes: in both, three was added going from three to six',
        ),
        hint: L(
          "Uchinchi hadga qarang. Birinchi qatorda to'qqiz, ya'ni yana uch qo'shilgan. Ikkinchisida esa o'n ikki, ya'ni ikkiga ko'paytirilgan.",
          'Посмотри на третий член. В первом ряду девять, то есть снова прибавили три. Во втором двенадцать, то есть умножили на два.',
          'Look at the third term. In the first row it is nine, so three was added again. In the second it is twelve, so it was multiplied by two.',
        ),
      },
    ],
    after: L(
      "Ha. Uchdan oltiga o'tishni ikki xil tushunish mumkin: uch qo'shildi yoki ikkiga ko'paytirildi. Qaysi biri to'g'ri ekanini faqat uchinchi had aytadi.",
      'Да. Переход от трёх к шести можно понять двояко: прибавили три или умножили на два. Что верно, скажет только третий член.',
      'Yes. Going from three to six can be read two ways: three was added, or it was doubled. Only the third term tells which.',
    ),
  },
}

// ============================================================
// EKRAN 2. TAYANCH — ikkita tekshiruv.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Ikkita tekshiruv, ikkita amal",
    'Две проверки, два действия',
    'Two checks, two operations',
  ),
  audio: [
    A('mount',
      "Turini aniqlash uchun ikkita tekshiruv bor. Ayirmani ko'ring va nisbatni ko'ring.",
      'Чтобы определить тип, есть две проверки. Посмотри разность и посмотри отношение.',
      'Two checks determine the type. Look at the difference and look at the ratio.'),
    A('why',
      "To'rt, o'n ikki, o'ttiz olti qatorini tekshiring.",
      'Проверь ряд четыре, двенадцать, тридцать шесть.',
      'Check the row four, twelve, thirty six.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('4, 12, 36', '4, 12, 36', '4, 12, 36')}
      steps={[
        { id: 'd', head: L('Ayirmalar', 'Разности', 'Differences'), lines: ['12 − 4 = 8', '36 − 12 = 24'] },
      ]}
      ask={L(
        "Bu qanday progressiya?",
        'Какая это прогрессия?',
        'What kind of progression is this?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('Geometrik', 'Геометрическая', 'Geometric') },
        {
          id: 'wrong',
          label: L('Arifmetik', 'Арифметическая', 'Arithmetic'),
          hint: L(
            "Ayirmalar sakkiz va yigirma to'rt, ular bir xil emas. Endi nisbatlarni tekshiring: o'n ikki bo'lingan to'rt va o'ttiz olti bo'lingan o'n ikki.",
            'Разности восемь и двадцать четыре, они не одинаковы. Теперь проверь отношения: двенадцать на четыре и тридцать шесть на двенадцать.',
            'The differences are eight and twenty four, not equal. Now check the ratios: twelve over four and thirty six over twelve.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Ayirmalar har xil, nisbatlar esa ikkalasi ham uchga teng. Demak geometrik, maxraji uch.",
        'Верно. Разности разные, а отношения оба равны трём. Значит геометрическая со знаменателем три.',
        'Correct. The differences differ, but both ratios equal three. So it is geometric with ratio three.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — to'rtta formulaning xaritasi.
// ============================================================
const S3 = {
  eyebrow: L("TO'RTTA FORMULA", 'ЧЕТЫРЕ ФОРМУЛЫ', 'FOUR FORMULAS'),
  title: L(
    "Qaysi biri qachon kerak",
    'Какая когда нужна',
    'Which one is needed when',
  ),
  audio: [
    A('mount',
      "To'rtta darsda to'rtta formula yig'ildi. Ikkitasi hadni topadi, ikkitasi yig'indini.",
      'За четыре урока набралось четыре формулы. Две находят член, две сумму.',
      'Four lessons gave four formulas. Two find a term, two find a sum.'),
    A('why',
      "Tanlash ikkita savol bilan hal bo'ladi: qaysi progressiya va nima so'ralyapti.",
      'Выбор решается двумя вопросами: какая прогрессия и что спрашивают.',
      'The choice is settled by two questions: which progression, and what is asked.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L(
        "2, 6, 18, ... berilgan, sakkizta hadning yig'indisi so'ralgan",
        'Дано 2, 6, 18, ... спрашивается сумма восьми членов',
        'Given 2, 6, 18, ... the sum of eight terms is asked for',
      )}
      steps={[
        { id: 'a', head: L('Tekshiruv', 'Проверка', 'The check'), lines: ['6 : 2 = 3', '18 : 6 = 3'] },
      ]}
      ask={L(
        "Qaysi formula kerak?",
        'Какая формула нужна?',
        'Which formula is needed?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L("Geometrik progressiya yig'indisi", 'Сумма геометрической прогрессии', 'The sum of a geometric progression'),
        },
        {
          id: 'wrong',
          label: L("Arifmetik progressiya yig'indisi", 'Сумма арифметической прогрессии', 'The sum of an arithmetic progression'),
          hint: L(
            "Nisbatlar bir xil, ayirmalar esa yo'q: to'rt va o'n ikki. Bu geometrik progressiya.",
            'Отношения одинаковы, а разности нет: четыре и двенадцать. Это геометрическая прогрессия.',
            'The ratios are equal, the differences are not: four and twelve. This is a geometric progression.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Birinchi savol turini aniqlaydi, ikkinchisi had yoki yig'indi ekanini. Shu ikki javob formulani bir qiymatli tanlaydi.",
        'Верно. Первый вопрос определяет тип, второй показывает, член это или сумма. Эти два ответа однозначно выбирают формулу.',
        'Correct. The first question fixes the type, the second whether it is a term or a sum. Those two answers pick the formula uniquely.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — darslikning 438.3 masalasi.
// ============================================================
const S4 = {
  eyebrow: L('IKKITA HAD ORQALI', 'ЧЕРЕЗ ДВА ЧЛЕНА', 'THROUGH TWO TERMS'),
  title: L(
    "Nomerlar orasidagi masofa qadamni beradi",
    'Расстояние между номерами даёт шаг',
    'The gap between indices gives the step',
  ),
  audio: [
    A('mount',
      "Arifmetik progressiyada oltinchi had o'nga, o'n birinchisi esa nolga teng. Ayirmani toping.",
      'В арифметической прогрессии шестой член равен десяти, а одиннадцатый нулю. Найди разность.',
      'In an arithmetic progression the sixth term is ten and the eleventh is zero. Find the difference.'),
    A('why',
      "Oltinchidan o'n birinchisiga necha qadam bor? O'n bir minus olti.",
      'Сколько шагов от шестого к одиннадцатому? Одиннадцать минус шесть.',
      'How many steps from the sixth to the eleventh? Eleven minus six.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('a₆ = 10,  a₁₁ = 0', 'a₆ = 10,  a₁₁ = 0', 'a₆ = 10,  a₁₁ = 0')}
      steps={[
        { id: 'a', head: L('Qadamlar soni', 'Число шагов', 'The number of steps'), lines: ['11 − 6 = 5', '0 − 10 = 5d'] },
      ]}
      ask={L(
        "Ayirma nechaga teng?",
        'Чему равна разность?',
        'What does the difference equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: 'd = −2' },
        {
          id: 'wrong',
          label: 'd = −10',
          hint: L(
            "Minus o'n bu butun yo'lda yo'qolgan miqdor, bitta qadamniki emas. Uni qadamlar soniga bo'lish kerak.",
            'Минус десять это убыль за весь путь, а не за один шаг. Её нужно разделить на число шагов.',
            'Minus ten is the drop over the whole way, not over one step. It has to be divided by the number of steps.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Ayirma minus ikki. Endi birinchi had yigirma, o'n to'qqizinchisi esa minus o'n olti.",
        'Верно. Разность минус два. Тогда первый член двадцать, а девятнадцатый минус шестнадцать.',
        'Correct. The difference is minus two. Then the first term is twenty and the nineteenth is minus sixteen.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — darslikning 428.1 masalasi.
// ============================================================
const S5 = {
  eyebrow: L('AVVAL NECHTA', 'СНАЧАЛА СКОЛЬКО', 'HOW MANY FIRST'),
  title: L(
    "Yig'indidan oldin hadlar sonini topish",
    'Перед суммой найти число членов',
    'Find the count of terms before the sum',
  ),
  audio: [
    A('mount',
      "Minus o'ttiz sakkiz qo'shuv minus o'ttiz uch va hokazo, oxirgisi o'n ikki. Nechta qo'shiluvchi borligi aytilmagan.",
      'Минус тридцать восемь плюс минус тридцать три и так далее, последнее двенадцать. Сколько слагаемых, не сказано.',
      'Minus thirty eight plus minus thirty three and so on, the last is twelve. How many summands there are is not said.'),
    A('why',
      "Ayirma besh. Minus o'ttiz sakkizdan o'n ikkigacha bo'lgan masofani beshga bo'ling.",
      'Разность пять. Раздели расстояние от минус тридцати восьми до двенадцати на пять.',
      'The difference is five. Divide the distance from minus thirty eight to twelve by five.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('−38 + (−33) + ... + 12', '−38 + (−33) + ... + 12', '−38 + (−33) + ... + 12')}
      steps={[
        { id: 'a', head: L('Masofa', 'Расстояние', 'The distance'), lines: ['12 − (−38) = 50', '50 : 5 = 10'] },
      ]}
      ask={L(
        "Nechta qo'shiluvchi bor?",
        'Сколько слагаемых?',
        'How many summands are there?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: 'n = 11' },
        {
          id: 'wrong',
          label: 'n = 10',
          hint: L(
            "O'n bu QADAMLAR soni. Hadlar esa har doim qadamlardan bittaga ko'p, chunki boshlang'ich had ham sanaladi.",
            'Десять это число ШАГОВ. Членов всегда на один больше, ведь начальный член тоже считается.',
            'Ten is the number of STEPS. There is always one more term, since the starting term counts too.',
          ),
        },
      ]}
      after={L(
        "To'g'ri, o'n bitta had. Endi yig'indi: chekka ikki hadning o'rtasi minus o'n uch, uni o'n birga ko'paytiramiz, minus bir yuz qirq uch.",
        'Верно, одиннадцать членов. Теперь сумма: среднее двух крайних минус тринадцать, умножаем на одиннадцать, минус сто сорок три.',
        'Correct, eleven terms. Now the sum: the mean of the outer two is minus thirteen, times eleven gives minus one hundred forty three.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — darslikning 433.2 masalasi.
// ============================================================
const S6 = {
  eyebrow: L('KAMAYUVCHI QATOR', 'УБЫВАЮЩИЙ РЯД', 'A FALLING ROW'),
  title: L(
    "Katta sondan boshlangan geometrik yig'indi",
    'Геометрическая сумма от большого числа',
    'A geometric sum starting from a large number',
  ),
  audio: [
    A('mount',
      "Bir yuz oltmish ikki, ellik to'rt, o'n sakkiz. Beshta hadning yig'indisini toping.",
      'Сто шестьдесят два, пятьдесят четыре, восемнадцать. Найди сумму пяти членов.',
      'One hundred sixty two, fifty four, eighteen. Find the sum of five terms.'),
    A('why',
      "Avval maxrajni aniqlang: ellik to'rt bo'lingan bir yuz oltmish ikki.",
      'Сначала определи знаменатель: пятьдесят четыре делить на сто шестьдесят два.',
      'First determine the ratio: fifty four over one hundred sixty two.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('162, 54, 18, ...,  n = 5', '162, 54, 18, ...,  n = 5', '162, 54, 18, ...,  n = 5')}
      steps={[
        { id: 'a', head: L('Maxraj', 'Знаменатель', 'The ratio'), lines: ['54 : 162 = 1/3'] },
        { id: 'b', head: L('Formulaga', 'В формулу', 'Into the formula'), lines: ['S₅ = 162(1 − 1/243) : (2/3)'] },
      ]}
      ask={L(
        "Yig'indi nechaga teng?",
        'Чему равна сумма?',
        'What does the sum equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '242' },
        {
          id: 'wrong',
          label: '234',
          hint: L(
            "Ikki yuz o'ttiz to'rt bu faqat dastlabki uchta hadning yig'indisi. Yana ikkitasi qolgan: olti va ikki.",
            'Двести тридцать четыре это сумма только первых трёх членов. Осталось ещё два: шесть и два.',
            'Two hundred thirty four is the sum of only the first three terms. Two more remain: six and two.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Qo'lda tekshirsangiz ham shu chiqadi: bir yuz oltmish ikki qo'shuv ellik to'rt qo'shuv o'n sakkiz qo'shuv olti qo'shuv ikki.",
        'Верно. Проверка вручную даёт то же: сто шестьдесят два плюс пятьдесят четыре плюс восемнадцать плюс шесть плюс два.',
        'Correct. Checking by hand gives the same: one hundred sixty two plus fifty four plus eighteen plus six plus two.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — darslikning 432.4 masalasi: q = −1.
// ============================================================
const S7 = {
  eyebrow: L('ISHORALAR QISQARADI', 'ЗНАКИ СОКРАЩАЮТСЯ', 'THE SIGNS CANCEL'),
  title: L(
    "To'qqizta haddan bittasi qoladi",
    'Из девяти членов остаётся один',
    'Of nine terms only one survives',
  ),
  audio: [
    A('mount',
      "Birinchi had besh, maxraj minus bir, hadlar soni to'qqizta. Qator besh, minus besh, besh, minus besh va hokazo.",
      'Первый член пять, знаменатель минус один, членов девять. Ряд пять, минус пять, пять, минус пять и так далее.',
      'The first term is five, the ratio is minus one, and there are nine terms. The row is five, minus five, five, minus five, and so on.'),
    A('why',
      "Qo'shni juftlar bir birini yo'q qiladi. To'qqiz toq son, demak bittasi juftsiz qoladi.",
      'Соседние пары уничтожают друг друга. Девять нечётное, значит один останется без пары.',
      'Adjacent pairs cancel each other. Nine is odd, so one is left without a pair.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('b₁ = 5,  q = −1,  n = 9', 'b₁ = 5,  q = −1,  n = 9', 'b₁ = 5,  q = −1,  n = 9')}
      steps={[
        { id: 'a', head: L('Qator', 'Ряд', 'The row'), lines: ['5, −5, 5, −5, 5, −5, 5, −5, 5'] },
      ]}
      ask={L(
        "Yig'indi nechaga teng?",
        'Чему равна сумма?',
        'What does the sum equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: 'S₉ = 5' },
        {
          id: 'wrong',
          label: 'S₉ = 0',
          hint: L(
            "Nol juft sondagi hadlarda chiqardi. To'qqizta had bor, ya'ni to'rtta juft va yana bitta had.",
            'Ноль получился бы при чётном числе членов. Здесь девять, то есть четыре пары и ещё один член.',
            'Zero would come from an even count. There are nine, that is four pairs and one term over.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Formula ham shuni beradi: minus birning to'qqizinchi darajasi minus bir, qavs ichida ikki, maxrajda ikki, ular qisqaradi.",
        'Верно. Формула даёт то же: минус один в девятой степени минус один, в скобке два, в знаменателе два, они сокращаются.',
        'Correct. The formula agrees: minus one to the ninth is minus one, the bracket gives two, the denominator gives two, and they cancel.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 8. QOIDA — tanlash xaritasi.
// ============================================================
const S8_RULE = {
  lines: [
    STATEMENTS[0],
    STATEMENTS[1],
    STATEMENTS[2],
  ],
  source: L(
    'Algebra 9, IV bobga doir mashqlar (177-178-bet)',
    'Алгебра 9, упражнения к главе IV (стр. 177-178)',
    'Algebra 9, exercises for chapter IV (p. 177-178)',
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
          "Masalani yechishdan oldin birinchi navbatda nima aniqlanadi?",
          'Что определяется в первую очередь, до решения задачи?',
          'What is settled first, before solving the problem?',
        )}
        cols={1}
        items={[
          {
            id: 'right', right: true,
            label: L("Progressiya turi: ayirma yoki nisbat bir xilmi", 'Тип прогрессии: одинакова разность или отношение', 'The type: whether the difference or the ratio is constant'),
          },
          {
            id: 'wrong',
            label: L("Birinchi hadning qiymati", 'Значение первого члена', 'The value of the first term'),
            hint: L(
              "Birinchi had ikkala turda ham bor, u tanlashga yordam bermaydi. 1-ekranni eslang: ikkita qator bir xil boshlangandi.",
              'Первый член есть у обоих типов, он не помогает выбрать. Вспомни 1 экран: два ряда начинались одинаково.',
              'The first term exists in both types, so it decides nothing. Recall screen 1: two rows began identically.',
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
    "Avval tur, keyin formula",
    'Сначала тип, потом формула',
    'The type first, then the formula',
  ),
  audio: [
    A('mount',
      "Yetti ekranda siz turini aniqladingiz, ayirmani nomerlar orqali topdingiz, hadlar sonini hisobladingiz va ishoralar qisqarishini ko'rdingiz.",
      'На семи экранах ты определил тип, нашёл разность через номера, вычислил число членов и увидел, как сокращаются знаки.',
      'On seven screens you settled the type, found the difference through the indices, computed the count of terms, and saw the signs cancel.'),
    W('card',
      "Qoida ochildi. Yangi formula yo'q, tanlash tartibi bor.",
      'Правило открылось. Новых формул нет, есть порядок выбора.',
      'The rule is open. No new formulas, only an order of choosing.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — ZANJIR: turini aniqlash.
// ============================================================
const S9 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "Turini aniqlang",
    'Определи тип',
    'Determine the type',
  ),
  audio: [
    A('mount',
      "Uchta qator. Har birida turini aniqlang. Uchinchi hadgacha qarashni unutmang.",
      'Три ряда. В каждом определи тип. Не забудь посмотреть до третьего члена.',
      'Three rows. Determine the type in each. Remember to look as far as the third term.'),
    A('why',
      "Ayirmani va nisbatni ketma-ket tekshiring.",
      'Проверяй разность и отношение по очереди.',
      'Check the difference and the ratio in turn.'),
  ],
  props: {
    stepLabel: L('Qator', 'Ряд', 'Row'),
    solutionLabel: L('TEKSHIRUV', 'ПРОВЕРКА', 'THE CHECK'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham aniqlandi. Uchinchi qator ayniqsa aldamchi: ikkita hadi butun, keyin kasrga o'tadi.",
      'Все три определены. Третий ряд особенно обманчив: два члена целые, а дальше дроби.',
      'All three are settled. The third row is the trickiest: two whole terms, then fractions.',
    ),
    tasks: [
      {
        expr: '5, 10, 15, 20, ...',
        question: L('Bu qanday progressiya?', 'Какая это прогрессия?', 'What kind of progression is this?'),
        ok: L("Ha, arifmetik. Ayirmalar beshga teng, nisbatlar esa ikki va bir yarim, ular har xil.", 'Да, арифметическая. Разности равны пяти, а отношения два и полтора, они разные.', 'Yes, arithmetic. The differences are five, while the ratios are two and one and a half, which differ.'),
        items: [
          { id: 'a', right: true, label: L('Arifmetik', 'Арифметическая', 'Arithmetic') },
          { id: 'b', label: L('Geometrik', 'Геометрическая', 'Geometric'), hint: L("Beshdan o'ngacha ikkiga ko'paytirilgan, lekin o'ndan o'n beshgacha ikkiga ko'paytirilmagan. Nisbat saqlanmayapti.", 'От пяти к десяти умножили на два, но от десяти к пятнадцати уже нет. Отношение не сохраняется.', 'From five to ten it doubled, but from ten to fifteen it did not. The ratio is not kept.') },
        ],
        solution: ['10 − 5 = 5,  15 − 10 = 5', '10 : 5 = 2,  15 : 10 = 1,5'],
      },
      {
        expr: '16, 4, 1, ...',
        question: L('Bu qanday progressiya?', 'Какая это прогрессия?', 'What kind of progression is this?'),
        ok: L("Ha, geometrik. Har safar to'rtga bo'linyapti, ya'ni bir to'rtdanga ko'paytirilyapti.", 'Да, геометрическая. Каждый раз делится на четыре, то есть умножается на одну четвёртую.', 'Yes, geometric. Each time it is divided by four, that is multiplied by one quarter.'),
        items: [
          { id: 'a', right: true, label: L('Geometrik', 'Геометрическая', 'Geometric') },
          { id: 'b', label: L('Arifmetik', 'Арифметическая', 'Arithmetic'), hint: L("Ayirmalar minus o'n ikki va minus uch. Ular bir xil emas, demak arifmetik emas.", 'Разности минус двенадцать и минус три. Они не одинаковы, значит не арифметическая.', 'The differences are minus twelve and minus three. Not equal, so it is not arithmetic.') },
        ],
        solution: ['4 : 16 = 1/4,  1 : 4 = 1/4', 'q = 1/4'],
      },
      {
        expr: '8, −4, 2, −1, ...',
        question: L('Maxraj nechaga teng?', 'Чему равен знаменатель?', 'What does the ratio equal?'),
        ok: L("Ha. Minus to'rt bo'lingan sakkiz, minus bir ikkidanga teng. Ishoralar shuning uchun almashyapti.", 'Да. Минус четыре делить на восемь, равно минус одной второй. Поэтому знаки чередуются.', 'Yes. Minus four over eight equals minus one half. That is why the signs alternate.'),
        items: [
          { id: 'a', right: true, label: 'q = −1/2' },
          { id: 'b', label: 'q = 1/2', hint: L("Musbat bir ikkidan bo'lganda hamma hadlar musbat qolardi. Bu yerda esa ishoralar navbatma-navbat almashyapti.", 'При положительной одной второй все члены остались бы положительными. А здесь знаки чередуются.', 'With a positive one half all terms would stay positive. Here the signs alternate.') },
        ],
        solution: ['(−4) : 8 = −1/2', '2 : (−4) = −1/2'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ — ZANJIR: had topish.
// ============================================================
const S10 = {
  eyebrow: L('HAD TOPISH', 'НАХОДИМ ЧЛЕН', 'FINDING A TERM'),
  title: L(
    "Bitta had so'ralganda",
    'Когда спрашивают один член',
    'When a single term is asked for',
  ),
  audio: [
    A('mount',
      "Uchta masala. Har birida bitta had so'ralgan. Avval turini aniqlang, keyin mos formulani oling.",
      'Три задачи. В каждой спрашивают один член. Сначала определи тип, потом бери подходящую формулу.',
      'Three problems. Each asks for one term. Settle the type first, then take the matching formula.'),
    A('why',
      "Ikkala formulada ham daraja yoki qadam n minus birga teng.",
      'В обеих формулах степень или число шагов равно n минус один.',
      'In both formulas the power or the step count equals n minus one.'),
  ],
  props: {
    stepLabel: L('Masala', 'Задача', 'Problem'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham topildi. Ikkala turda ham qadamlar soni n minus bir, farq faqat amalda.",
      'Все три найдены. В обоих типах шагов n минус один, разница только в действии.',
      'All three are found. Both types take n minus one steps, only the operation differs.',
    ),
    tasks: [
      {
        expr: 'b₁ = 2,  q = 2,  b₆ = ?',
        question: L('Oltinchi had nechaga teng?', 'Чему равен шестой член?', 'What does the sixth term equal?'),
        ok: L("Ha. Ikkining beshinchi darajasi o'ttiz ikki, uni ikkiga ko'paytirsak oltmish to'rt.", 'Да. Два в пятой степени тридцать два, умножить на два шестьдесят четыре.', 'Yes. Two to the fifth is thirty two, times two is sixty four.'),
        items: [
          { id: 'a', right: true, label: 'b₆ = 64' },
          { id: 'b', label: 'b₆ = 128', hint: L("Bir yuz yigirma sakkiz bu ikkining oltinchi darajasi. Lekin daraja n minus birga teng, ya'ni beshga.", 'Сто двадцать восемь это два в шестой степени. Но степень равна n минус один, то есть пяти.', 'One hundred twenty eight is two to the sixth. But the power is n minus one, that is five.') },
        ],
        solution: ['b₆ = 2 · 2⁵', 'b₆ = 64'],
      },
      {
        expr: 'a₁ = 4,8,  d = 1,2,  a₁₁ = ?',
        question: L('O\'n birinchi had nechaga teng?', 'Чему равен одиннадцатый член?', 'What does the eleventh term equal?'),
        ok: L("Ha. O'nta qadam, har biri bir butun ikki o'ndan, jami o'n ikki. To'rt butun sakkiz o'ndan qo'shuv o'n ikki.", 'Да. Десять шагов по одна целая две десятых, всего двенадцать. Четыре целых восемь десятых плюс двенадцать.', 'Yes. Ten steps of one point two, twelve in all. Four point eight plus twelve.'),
        items: [
          { id: 'a', right: true, label: 'a₁₁ = 16,8' },
          { id: 'b', label: 'a₁₁ = 18', hint: L("O'n sakkiz bu o'n bitta qadam qo'shilgan holat. Qadamlar esa o'nta, chunki birinchi hadga qadam qilinmaydi.", 'Восемнадцать выходит при одиннадцати шагах. А шагов десять, ведь до первого члена шаг не делается.', 'Eighteen comes from eleven steps. There are ten, since no step reaches the first term.') },
        ],
        solution: ['a₁₁ = 4,8 + 10 · 1,2', 'a₁₁ = 16,8'],
      },
      {
        expr: '3, 1, 1/3, ...   b₅ = ?',
        question: L('Beshinchi had nechaga teng?', 'Чему равен пятый член?', 'What does the fifth term equal?'),
        ok: L("Ha. Maxraj bir uchdan, to'rtta qadam, uch bo'lingan sakson bir bu bir yigirma yettidan.", 'Да. Знаменатель одна третья, четыре шага, три делить на восемьдесят один это одна двадцать седьмая.', 'Yes. The ratio is one third, four steps, three over eighty one is one twenty seventh.'),
        items: [
          { id: 'a', right: true, label: 'b₅ = 1/27' },
          { id: 'b', label: 'b₅ = 1/9', hint: L("Bir to'qqizdan bu to'rtinchi had. Beshinchisiga yetish uchun yana bir marta uchga bo'lish kerak.", 'Одна девятая это четвёртый член. До пятого нужно ещё раз разделить на три.', 'One ninth is the fourth term. Reaching the fifth takes one more division by three.') },
        ],
        solution: ['q = 1/3', 'b₅ = 3 · (1/3)⁴ = 3/81 = 1/27'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — ZANJIR: yig'indi.
// ============================================================
const S11 = {
  eyebrow: L("YIG'INDI", 'СУММА', 'THE SUM'),
  title: L(
    "Yig'indi so'ralganda",
    'Когда спрашивают сумму',
    'When a sum is asked for',
  ),
  audio: [
    A('mount',
      "Ikkita masala. Ikkalasida ham yig'indi so'ralgan, lekin turlari har xil.",
      'Две задачи. В обеих спрашивают сумму, но типы разные.',
      'Two problems. Both ask for a sum, but the types differ.'),
    A('why',
      "Ikkinchisida maxraj birga teng, bu alohida hol.",
      'Во второй знаменатель равен единице, это особый случай.',
      'In the second the ratio equals one, which is a special case.'),
  ],
  props: {
    stepLabel: L('Masala', 'Задача', 'Problem'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkalasi ham topildi. Maxraj birga teng bo'lganda formulaga umuman murojaat qilinmaydi.",
      'Обе найдены. При знаменателе равном единице к формуле вообще не обращаются.',
      'Both are found. When the ratio equals one the formula is not used at all.',
    ),
    tasks: [
      {
        expr: '128, 64, 32, ...   S₆ = ?',
        question: L('Oltita hadning yig\'indisi nechaga teng?', 'Чему равна сумма шести членов?', 'What does the sum of six terms equal?'),
        ok: L("Ha. Qator bir yuz yigirma sakkiz, oltmish to'rt, o'ttiz ikki, o'n olti, sakkiz, to'rt. Jami ikki yuz ellik ikki.", 'Да. Ряд сто двадцать восемь, шестьдесят четыре, тридцать два, шестнадцать, восемь, четыре. Итого двести пятьдесят два.', 'Yes. The row is one hundred twenty eight, sixty four, thirty two, sixteen, eight, four. In all two hundred fifty two.'),
        items: [
          { id: 'a', right: true, label: 'S₆ = 252' },
          { id: 'b', label: 'S₆ = 256', hint: L("Ikki yuz ellik olti bu ikkining sakkizinchi darajasi, yig'indi emas. Qo'lda qo'shib tekshiring, to'rtga kam chiqadi.", 'Двести пятьдесят шесть это два в восьмой степени, а не сумма. Сложи вручную, выйдет на четыре меньше.', 'Two hundred fifty six is two to the eighth, not the sum. Add by hand and you get four less.') },
        ],
        solution: ['q = 1/2', 'S₆ = 128(1 − 1/64) : (1/2)', 'S₆ = 252'],
      },
      {
        expr: 'b₁ = 10,  q = 1,  n = 6',
        question: L('Oltita hadning yig\'indisi nechaga teng?', 'Чему равна сумма шести членов?', 'What does the sum of six terms equal?'),
        ok: L("Ha. Hamma hadlar o'nga teng, oltitasi jami oltmish beradi.", 'Да. Все члены равны десяти, шесть таких дают шестьдесят.', 'Yes. Every term is ten, and six of them give sixty.'),
        items: [
          { id: 'a', right: true, label: 'S₆ = 60' },
          { id: 'b', label: 'S₆ = 0', hint: L("Nol formulani noto'g'ri qo'llaganda chiqadi: maxraji nolga aylanadi va bo'lish mumkin emas. Hadlarni oddiy sanang.", 'Ноль выходит при неверном применении формулы: знаменатель обращается в ноль и делить нельзя. Просто сосчитай члены.', 'Zero comes from misapplying the formula: the denominator turns into zero and dividing is impossible. Just count the terms.') },
        ],
        solution: ['q = 1', 'S₆ = 10 · 6 = 60'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ — 1-ekrandagi xato takrorlanadi.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Ikkita hadga qarab hukm chiqarish",
    'Судить по двум членам',
    'Judging from two terms',
  ),
  audio: [
    A('mount',
      "Kamronning yechimi. Unga ikki, to'rt, sakkiz, o'n olti qatori berilgan. U ikkidan to'rtga ikki qo'shilganini ko'rib, arifmetik progressiya deb yozgan.",
      'Решение Камрона. Ему дан ряд два, четыре, восемь, шестнадцать. Он увидел, что от двух к четырём прибавили два, и записал арифметическая прогрессия.',
      "Kamron's solution. He was given the row two, four, eight, sixteen. He saw that two was added going from two to four and wrote down arithmetic progression."),
    A('why',
      "Birinchi qadamda u haqiqatan ham haq. Keyingi qadam nima deydi?",
      'На первом шаге он и правда прав. Что скажет следующий шаг?',
      'On the first step he really is right. What does the next step say?'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Kamron ikkita hadga qarab hukm chiqargan. Ikkita had har doim ham arifmetik, ham geometrik progressiyaga to'g'ri keladi, chunki ular orasidagi bitta o'tishni ikki xil o'qish mumkin.",
      'Камрон судил по двум членам. Два члена всегда подходят и арифметической, и геометрической прогрессии, ведь единственный переход между ними читается двояко.',
      'Kamron judged from two terms. Two terms always fit both an arithmetic and a geometric progression, since the single transition between them reads two ways.',
    ),
    tasks: [
      {
        expr: '2, 4, 8, 16, ...',
        question: L(
          "Kamron ikki qo'shuv ikki to'rt bo'lishiga qaradi. Uchinchi had nima deydi?",
          'Камрон посмотрел, что два плюс два четыре. Что говорит третий член?',
          'Kamron noted that two plus two is four. What does the third term say?',
        ),
        ok: L(
          "To'g'ri. To'rt qo'shuv ikki olti bo'lardi, lekin sakkiz turibdi. Demak qo'shilmagan, ikkiga ko'paytirilgan.",
          'Верно. Четыре плюс два дало бы шесть, а стоит восемь. Значит не прибавляли, а умножали на два.',
          'Correct. Four plus two would give six, but eight stands there. So nothing was added, it was doubled.',
        ),
        items: [
          {
            id: 'a', right: true,
            label: L("Geometrik: sakkiz bu to'rt karra ikki", 'Геометрическая: восемь это четыре на два', 'Geometric: eight is four times two'),
          },
          {
            id: 'b',
            label: L("Arifmetik: Kamron to'g'ri qilgan", 'Арифметическая: Камрон прав', 'Arithmetic: Kamron is right'),
            hint: L(
              "Agar ayirma ikki bo'lsa, uchinchi had olti bo'lishi kerak edi. Qatorda esa sakkiz turibdi.",
              'Если разность два, третий член должен быть шесть. А в ряду стоит восемь.',
              'If the difference were two, the third term would be six. But the row has eight.',
            ),
          },
        ],
        solution: [
          '4 − 2 = 2,  8 − 4 = 4',
          '4 : 2 = 2,  8 : 4 = 2',
          L('Nisbat bir xil, ayirma yoq', 'Отношение постоянно, разность нет', 'The ratio is constant, the difference is not'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TRANSFER — darslikning 437-mashqi va uning davomi.
// ============================================================
const S13 = {
  eyebrow: L('TRANSFER', 'ПЕРЕНОС', 'TRANSFER'),
  title: L(
    "Ikki son orasiga bitta son qo'yish",
    'Вставить одно число между двумя',
    'Placing one number between two',
  ),
  audio: [
    A('mount',
      "Minus o'n va besh orasiga bitta son qo'yish kerak, natijada arifmetik progressiyaning ketma-ket uchta hadi hosil bo'lsin.",
      'Между минус десятью и пятью нужно вставить одно число так, чтобы получились три подряд идущих члена арифметической прогрессии.',
      'One number must be placed between minus ten and five so that three consecutive terms of an arithmetic progression appear.'),
    A('why',
      "22-darsni eslang. O'rtadagi had qo'shnilarining o'rta arifmetigi edi. Endi shu savolni geometrik progressiya uchun bering.",
      'Вспомни 22 урок. Средний член был средним арифметическим соседей. Теперь задай тот же вопрос для геометрической прогрессии.',
      'Recall lesson 22. The middle term was the arithmetic mean of its neighbours. Now ask the same for a geometric progression.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkita savol, ikki xil javob. O'rta arifmetik istalgan ikki son orasida bor, o'rta geometrik esa faqat bir xil ishorali sonlar orasida yashaydi.",
      'Два вопроса, два разных ответа. Среднее арифметическое есть между любыми двумя числами, а среднее геометрическое живёт только между числами одного знака.',
      'Two questions, two different answers. An arithmetic mean exists between any two numbers, while a geometric mean lives only between numbers of the same sign.',
    ),
    tasks: [
      {
        expr: '−10,  x,  5   →   d',
        question: L('Arifmetik progressiya uchun x nechaga teng?', 'Чему равен x для арифметической прогрессии?', 'What does x equal for an arithmetic progression?'),
        ok: L("Ha. O'rta arifmetik: minus o'n qo'shuv besh minus besh, uning yarmi minus ikki butun besh o'ndan.", 'Да. Среднее арифметическое: минус десять плюс пять минус пять, половина этого минус две целых пять десятых.', 'Yes. The arithmetic mean: minus ten plus five is minus five, and half of that is minus two point five.'),
        items: [
          { id: 'a', right: true, label: 'x = −2,5' },
          { id: 'b', label: 'x = −5', hint: L("Minus besh bu YIG'INDI, o'rtacha emas. Uni yana ikkiga bo'lish kerak.", 'Минус пять это СУММА, а не среднее. Её нужно ещё разделить на два.', 'Minus five is the SUM, not the mean. It still has to be halved.') },
        ],
        solution: ['x = (−10 + 5) : 2', 'x = −2,5'],
      },
      {
        expr: '−10,  x,  5   →   q',
        question: L('Geometrik progressiya uchun bunday x bormi?', 'Существует ли такой x для геометрической прогрессии?', 'Does such an x exist for a geometric progression?'),
        ok: L(
          "To'g'ri, yo'q. x kvadrat minus ellikka teng bo'lishi kerak edi, lekin hech qanday sonning kvadrati manfiy emas.",
          'Верно, нет. x в квадрате должно было равняться минус пятидесяти, но квадрат никакого числа не отрицателен.',
          'Correct, it does not. x squared would have to equal minus fifty, but no number has a negative square.',
        ),
        items: [
          { id: 'a', right: true, label: L("Yo'q, bunday son yo'q", 'Нет, такого числа нет', 'No, no such number exists') },
          {
            id: 'b',
            label: L("Ha, x minus ikki butun besh o'ndan", 'Да, x минус две целых пять десятых', 'Yes, x is minus two point five'),
            hint: L(
              "Tekshiring: minus ikki butun besh o'ndan bo'lingan minus o'n bir to'rtdan, besh bo'lingan minus ikki butun besh o'ndan esa minus ikki. Nisbatlar bir xil emas.",
              'Проверь: минус две целых пять десятых делить на минус десять это одна четвёртая, а пять делить на минус две целых пять десятых это минус два. Отношения разные.',
              'Check: minus two point five over minus ten is one quarter, while five over minus two point five is minus two. The ratios differ.',
            ),
          },
        ],
        solution: [
          'x² = (−10) · 5 = −50',
          L('Kvadrat manfiy bolmaydi', 'Квадрат не бывает отрицательным', 'A square is never negative'),
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
    "Blits: tur, formula, hadlar soni",
    'Блиц: тип, формула, число членов',
    'Blitz: type, formula, count of terms',
  ),
  audio: [
    A('mount',
      "To'rtta savol birin ketin. Ular tanlashni so'raydi, uzoq hisobni emas.",
      'Четыре вопроса один за другим. Они спрашивают про выбор, а не про долгий счёт.',
      'Four questions one after another. They ask about the choice, not a long computation.'),
    A('why',
      "Hisob birinchi urinish bo'yicha yuradi.",
      'Счёт идёт по первой попытке.',
      'The count goes by the first attempt.'),
  ],
  props: {
    items: [
      {
        id: 'q1',
        tag: 'ikki-haddan-hukm',
        ask: L(
          "Progressiya turini aniqlash uchun kamida nechta had kerak?",
          'Сколько членов нужно как минимум, чтобы определить тип прогрессии?',
          'How many terms at least are needed to determine the type?',
        ),
        options: [
          { id: 'three', right: true, label: L('Uchta', 'Три', 'Three') },
          { id: 'two', label: L('Ikkita', 'Два', 'Two') },
        ],
        ok: L(
          "To'g'ri. Ikkita had ikkala turga ham to'g'ri keladi, uchinchisi esa tanlaydi.",
          'Верно. Два члена подходят обоим типам, а третий выбирает.',
          'Correct. Two terms fit both types, the third one decides.',
        ),
        hint: L(
          "1-ekranni eslang: uch va olti ikkala qatorda ham bor edi.",
          'Вспомни 1 экран: три и шесть были в обоих рядах.',
          'Recall screen 1: three and six appeared in both rows.',
        ),
      },
      {
        id: 'q2',
        tag: 'formulani-adashtirish',
        ask: L(
          "Nisbatlar bir xil, ayirmalar har xil. Bu qanday progressiya?",
          'Отношения одинаковы, разности разные. Какая это прогрессия?',
          'The ratios are equal, the differences are not. What kind of progression is it?',
        ),
        options: [
          { id: 'g', right: true, label: L('Geometrik', 'Геометрическая', 'Geometric') },
          { id: 'a', label: L('Arifmetik', 'Арифметическая', 'Arithmetic') },
        ],
        ok: L(
          "To'g'ri. Arifmetikda ayirma saqlanadi, geometrikda nisbat.",
          'Верно. В арифметической сохраняется разность, в геометрической отношение.',
          'Correct. The arithmetic one keeps the difference, the geometric one keeps the ratio.',
        ),
        hint: L(
          "2-ekranni eslang: to'rt, o'n ikki, o'ttiz olti uchun ayirmalar har xil, nisbatlar esa uchga teng edi.",
          'Вспомни 2 экран: для четырёх, двенадцати, тридцати шести разности были разные, а отношения равны трём.',
          'Recall screen 2: for four, twelve, thirty six the differences differed while the ratios were three.',
        ),
      },
      {
        id: 'q3',
        tag: 'hadlar-sonini-topmaslik',
        ask: L(
          "Yig'indi so'ralgan, lekin hadlar soni berilmagan. Nima qilinadi?",
          'Спрашивают сумму, но число членов не дано. Что делается?',
          'A sum is asked for but the count of terms is not given. What is done?',
        ),
        options: [
          { id: 'find', right: true, label: L('Avval hadlar soni topiladi', 'Сначала находится число членов', 'The count of terms is found first') },
          { id: 'no', label: L("Yig'indini topib bo'lmaydi", 'Сумму найти нельзя', 'The sum cannot be found') },
        ],
        ok: L(
          "To'g'ri. Oxirgi had va qadam ma'lum bo'lsa, hadlar soni har doim hisoblanadi.",
          'Верно. Если известны последний член и шаг, число членов всегда вычисляется.',
          'Correct. When the last term and the step are known, the count is always computable.',
        ),
        hint: L(
          "5-ekranni eslang: minus o'ttiz sakkizdan o'n ikkigacha bo'lgan masofa beshga bo'lingandi.",
          'Вспомни 5 экран: расстояние от минус тридцати восьми до двенадцати делили на пять.',
          'Recall screen 5: the distance from minus thirty eight to twelve was divided by five.',
        ),
      },
      {
        id: 'q4',
        tag: 'ortada-geometrik-imkonsiz',
        ask: L(
          "Turli ishorali ikki son orasiga geometrik progressiya hadi qo'yiladimi?",
          'Можно ли вставить член геометрической прогрессии между числами разных знаков?',
          'Can a geometric progression term be placed between numbers of opposite signs?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'yes', label: L('Ha', 'Да', 'Yes') },
        ],
        ok: L(
          "To'g'ri. Uning kvadrati ko'paytmaga teng bo'lishi kerak, ko'paytma esa manfiy chiqadi.",
          'Верно. Его квадрат должен равняться произведению, а произведение выходит отрицательным.',
          'Correct. Its square would have to equal the product, and that product is negative.',
        ),
        hint: L(
          "13-ekranni eslang: minus o'n va besh uchun x kvadrat minus ellikka teng bo'lib qolgandi.",
          'Вспомни 13 экран: для минус десяти и пяти x в квадрате оказалось равно минус пятидесяти.',
          'Recall screen 13: for minus ten and five, x squared came out as minus fifty.',
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
    "Tanlash hisobdan oldin keladi",
    'Выбор идёт раньше счёта',
    'The choice comes before the computation',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda ikkita qator bir xil boshlanib, boshqacha davom etdi. Bugungi butun dars shu kuzatuv ustiga qurildi.",
      'На первом экране два ряда начались одинаково, а продолжились по-разному. Весь сегодняшний урок построен на этом наблюдении.',
      'On the first screen two rows began alike and continued differently. The whole lesson was built on that observation.'),
    A('s1',
      "Siz yangi formula o'rganmadingiz. Siz to'rtta tanish formuladan keraklisini tanlashni o'rgandingiz.",
      'Ты не выучил новой формулы. Ты научился выбирать нужную из четырёх знакомых.',
      'You learned no new formula. You learned to choose the right one out of four familiar ones.'),
    A('s2',
      "Keyingi darsda cheksiz kamayuvchi geometrik progressiya.",
      'В следующем уроке бесконечно убывающая геометрическая прогрессия.',
      'The next lesson covers an infinitely decreasing geometric progression.'),
  ],
  props: {
    mark: 'd → +      q → ×',
    markNote: L(
      "avval turini aniqlang",
      'сначала определи тип',
      'settle the type first',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      'Keyingi dars: cheksiz kamayuvchi geometrik progressiya',
      'Следующий урок: бесконечно убывающая геометрическая прогрессия',
      'Next lesson: an infinitely decreasing geometric progression',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     tool: 'pick', ...S1 },
  { role: 'support',  tag: 'ikki-haddan-hukm', ...S2 },
  { role: 'explain',  tag: 'formulani-adashtirish', ...S3 },
  { role: 'explain',  tag: 'formulani-adashtirish', ...S4 },
  { role: 'explain',  tag: 'hadlar-sonini-topmaslik', ...S5 },
  { role: 'explain',  tag: 'formulani-adashtirish', ...S6 },
  { role: 'explain',  tag: 'formulani-adashtirish', ...S7 },
  { role: 'rule',     tag: 'ikki-haddan-hukm', ...S8 },
  { role: 'practice', tool: 'drill', tag: 'ikki-haddan-hukm', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'formulani-adashtirish', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'hadlar-sonini-topmaslik', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'ikki-haddan-hukm', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'ortada-geometrik-imkonsiz', ...S13 },
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
