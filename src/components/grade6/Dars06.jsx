// ============================================================
// 6 КЛАСС, УРОК 6 «Наименьшее общее кратное»
// Собран по context/GRADE6_ETALON.md на общем слое ./screens.jsx.
//
// Сюжет блока: школа после уроков. 5 — подарки, 6 — остановка у школы:
// два автобуса ходят каждые 12 и каждые 18 минут.
//
// ЯДРО: делители мы искали ВНУТРИ числа, кратные ищем ЗА ним. Первое общее
// кратное и есть НОК.
// ============================================================

// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from 'react';
import {
  T,
  configureLesson,
  registerLesson,
  navLocked,
  tri,
  pickL,
  LangContext,
  useLang,
  useT,
  useMobileZoom,
  useAudio,
  getAudioEngine,
  PREVIEW_START,
  BASE_STYLES,
  Stage,
  Person,
  NavBack,
  NavNext,
  NextLabel,
  BackLabel,
  HintBlock,
  FeedbackBlock,
  FactCard,
  FB_SCI,
  AnimDigits,
  MethodCard,
  HookScreen,
  RevealScreen,
  RuleScreen,
  Classify,
  MultiTask,
  FinalPanel,
  SummaryScreen,
} from './screens.jsx';

const TOTAL_SCREENS = 15;

const LESSON_META = {
  lessonId: 'grade6-06',
  lessonTitle: {
    ru: 'Наименьшее общее кратное',
    uz: 'Eng kichik umumiy karrali',
    en: 'Least common multiple',
  },
};

const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',    scored: false, scope: 'hook' },     //  1 bekat: 12 va 18 daqiqa
  { id: 's_recall', type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  2 karrali sonlar qatori
  { id: 's_core',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  3 ikki lenta va birinchi uchrashuv
  { id: 's_tool',   type: 'exploration', template: 'custom',        scored: false, scope: null },       //  4 USUL 1: birinchi umumiygacha
  { id: 's_fact',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  5 USUL 2: tub ko'paytuvchilar
  { id: 's_solve',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  6 birga yechamiz: 12 va 18
  { id: 's_edge',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  7 EKUB va EKUK bog'lanishi
  { id: 's_rule',   type: 'rule',        template: 'RuleScreen',    scored: false, scope: null },       //  8 QOIDA + xukka qaytish
  { id: 's_first',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, //  9 birinchi umumiy karrali x3
  { id: 's_lcm',    type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 10 EKUK x4
  { id: 's_bins',   type: 'test',        template: 'Classify',      scored: true,  scope: 'practice' }, // 11 savatlar: ikkalasiga karrali
  { id: 's_error',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_task',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 13 MASALA: jadval
  { id: 's_final',  type: 'test',        template: 'FinalPanel',    scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',      type: 'summary',     template: 'SummaryScreen', scored: false, scope: null },       // 15 xulosa
];

registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

const CONTENT = {
  s_hook: {
    eyebrow: { ru: 'Зачем это нужно', uz: 'Bu nimaga kerak', en: 'Why you need this' },
    title: {
      ru: 'Остановка: 12 минут и 18',
      uz: 'Bekat: 12 daqiqa va 18',
      en: 'The bus stop: 12 minutes and 18',
    },
    lead: {
      ru: 'Один автобус ходит каждые 12 минут, другой каждые 18. Сейчас они уехали вместе.',
      uz: "Bir avtobus har 12 daqiqada, ikkinchisi har 18 daqiqada yuradi. Hozir ular birga jo'nadi.",
      en: 'One bus runs every 12 minutes, the other every 18. They have just left together.',
    },
    voice_a: { ru: 'Азиз: встретятся через 30 минут.', uz: 'Aziz: 30 daqiqadan keyin uchrashadi.', en: 'Aziz: they meet in 30 minutes.' },
    voice_b: { ru: 'Дилноза: раньше.', uz: 'Dilnoza: bundan oldinroq.', en: 'Dilnoza: sooner than that.' },
    ask: { ru: 'Через сколько минут они снова уедут вместе?', uz: "Necha daqiqadan keyin ular yana birga jo'naydi?", en: 'In how many minutes will they leave together again?' },
    options: [
      { ru: 'Через 30 минут', uz: '30 daqiqadan keyin', en: 'In 30 minutes' },
      { ru: 'Раньше 30 минут', uz: '30 daqiqadan oldin', en: 'Sooner than 30' },
    ],
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: "Variantlardan birini bosing. Javobni dars davomida tekshiramiz.",
      en: 'Tap one of the options. We will check the answer during the lesson.',
    },
    audio: {
      intro: {
        ru: [
          'У школы останавливаются два автобуса. Один ходит каждые двенадцать минут, другой каждые восемнадцать. Сейчас они уехали вместе.',
          'Азиз считает, что вместе они уедут через тридцать минут, а Дилноза говорит, что раньше. Как ты думаешь, через сколько минут это случится? Выбери ответ. Проверим его по ходу урока.',
        ],
        uz: [
          "Maktab yonida ikkita avtobus to'xtaydi. Biri har o'n ikki daqiqada, ikkinchisi har o'n sakkiz daqiqada yuradi. Hozir ular birga jo'nadi.",
          "Aziz o'ttiz daqiqadan keyin birga jo'naydi deb hisoblaydi, Dilnoza esa oldinroq deydi. Sizningcha bu necha daqiqadan keyin bo'ladi? Javobni tanlang. Uni dars davomida tekshiramiz.",
        ],
        en: [
          'Two buses stop by the school. One runs every twelve minutes, the other every eighteen. They have just left together.',
          'Aziz thinks they will leave together in thirty minutes, and Dilnoza says sooner. What do you think, in how many minutes will it happen? Choose an answer. We will check it during the lesson.',
        ],
      },
    },
  },

  s_recall: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslaymiz', en: 'Recall' },
    title: { ru: 'Кратные числа', uz: 'Karrali sonlar', en: 'Multiples' },
    row12: [12, 24, 36, 48, 60],
    row18: [18, 36, 54, 72],
    done: {
      ru: 'Кратные получаются умножением: 12, 24, 36 и дальше. Делители мы искали внутри числа, а кратные идут за ним и не кончаются.',
      uz: "Karralilar ko'paytirish bilan hosil bo'ladi: 12, 24, 36 va shu tariqa. Bo'luvchilarni son ichidan qidirgan edik, karralilar esa sondan keyin ketadi va tugamaydi.",
      en: 'Multiples come from multiplying: 12, 24, 36 and so on. Divisors live inside the number, multiples run past it and never end.',
    },
    audio: {
      ru: [
        'Вернёмся к первому уроку. Кратные двенадцати получаются умножением: двенадцать, двадцать четыре, тридцать шесть, сорок восемь.',
        'Кратные восемнадцати: восемнадцать, тридцать шесть, пятьдесят четыре.',
        'Делители мы искали внутри числа, а кратные идут за ним и никогда не кончаются.',
      ],
      uz: [
        "Birinchi darsga qaytamiz. O'n ikkiga karralilar ko'paytirish bilan chiqadi: o'n ikki, yigirma to'rt, o'ttiz olti, qirq sakkiz.",
        "O'n sakkizga karralilar: o'n sakkiz, o'ttiz olti, ellik to'rt.",
        "Bo'luvchilarni son ichidan qidirgan edik, karralilar esa sondan keyin ketadi va hech qachon tugamaydi.",
      ],
      en: [
        'Back to the first lesson. The multiples of twelve come from multiplying: twelve, twenty four, thirty six, forty eight.',
        'The multiples of eighteen: eighteen, thirty six, fifty four.',
        'Divisors we looked for inside the number, and multiples run past it and never end.',
      ],
    },
  },

  s_core: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Первая общая минута', uz: 'Birinchi umumiy daqiqa', en: 'The first shared minute' },
    marks: [12, 18, 24, 36, 48, 54, 60, 72],
    done: {
      ru: 'Первое общее число — 36. Значит автобусы уедут вместе через 36 минут, а не через 30. Такое число называют наименьшим общим кратным, сокращённо НОК.',
      uz: "Birinchi umumiy son — 36. Demak avtobuslar 30 emas, 36 daqiqadan keyin birga jo'naydi. Bunday son eng kichik umumiy karrali, qisqacha EKUK deyiladi.",
      en: 'The first shared number is 36. So the buses leave together in 36 minutes, not 30. Such a number is the least common multiple, or LCM.',
    },
    audio: {
      ru: [
        'Положим два расписания на одну линию времени. Сверху двенадцать, двадцать четыре, тридцать шесть.',
        'Снизу восемнадцать, тридцать шесть, пятьдесят четыре. Ищем первую минуту, где отметки совпали.',
        'Совпали на тридцати шести. Значит вместе автобусы уедут через тридцать шесть минут, а не через тридцать. Такое число называют наименьшим общим кратным, сокращённо НОК.',
      ],
      uz: [
        "Ikki jadvalni bitta vaqt chizig'iga qo'yamiz. Yuqorida o'n ikki, yigirma to'rt, o'ttiz olti.",
        "Pastda o'n sakkiz, o'ttiz olti, ellik to'rt. Belgilar mos kelgan birinchi daqiqani qidiramiz.",
        "O'ttiz oltida mos keldi. Demak avtobuslar o'ttiz emas, o'ttiz olti daqiqadan keyin birga jo'naydi. Bunday son eng kichik umumiy karrali, qisqacha EKUK deyiladi.",
      ],
      en: [
        'Put both timetables on one time line. Above: twelve, twenty four, thirty six.',
        'Below: eighteen, thirty six, fifty four. Look for the first minute where the marks meet.',
        'They meet at thirty six. So the buses leave together in thirty six minutes, not thirty. Such a number is called the least common multiple, or LCM.',
      ],
    },
  },

  s_tool: {
    eyebrow: { ru: 'Смотри и повтори', uz: 'Qarang va takrorlang', en: 'Watch, then try' },
    title: { ru: 'Способ: до первой встречи', uz: 'Usul: birinchi uchrashuvgacha', en: 'Method: up to the first meeting' },
    demo_banner: { ru: 'Смотри — покажу на примере', uz: "Qarang — misolda ko'rsataman", en: 'Watch — I will show an example' },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    demo_a: 4,
    demo_b: 6,
    demo_note: {
      ru: 'Кратные 4: 4, 8, 12. Кратные 6: 6, 12. Первое общее — 12. Значит НОК(4, 6) = 12.',
      uz: "4 ga karralilar: 4, 8, 12. 6 ga karralilar: 6, 12. Birinchi umumiysi — 12. Demak EKUK(4, 6) = 12.",
      en: 'Multiples of 4: 4, 8, 12. Multiples of 6: 6, 12. The first shared one is 12, so LCM(4, 6) = 12.',
    },
    play_ask: { ru: 'Чему равен НОК(6, 9)?', uz: 'EKUK(6, 9) nechaga teng?', en: 'What is LCM(6, 9)?' },
    play_opts: ['15', '18', '54'],
    play_correct: 1,
    play_ok: {
      ru: 'Верно. Кратные 6: 6, 12, 18. Кратные 9: 9, 18. Первое общее — 18.',
      uz: "To'g'ri. 6 ga karralilar: 6, 12, 18. 9 ga karralilar: 9, 18. Birinchi umumiysi — 18.",
      en: 'Right. Multiples of 6: 6, 12, 18. Multiples of 9: 9, 18. The first shared one is 18.',
    },
    play_wrong: [
      { ru: '15 не делится на 6: это сумма, а нужно общее кратное.', uz: "15 soni 6 ga bo'linmaydi: bu yig'indi, kerak esa umumiy karrali.", en: '15 does not divide by 6: that is a sum, and we need a common multiple.' },
      null,
      { ru: '54 общее кратное, но не наименьшее: 18 встретилось раньше.', uz: "54 umumiy karrali, lekin eng kichigi emas: 18 oldinroq uchradi.", en: '54 is a common multiple but not the least: 18 came earlier.' },
    ],
    audio: {
      intro: {
        ru: 'Способ первый. Выписываем кратные обоих чисел и останавливаемся на первом общем. Покажу на четырёх и шести.',
        uz: "Birinchi usul. Ikkala sonning karralilarini yozamiz va birinchi umumiysida to'xtaymiz. To'rt va oltida ko'rsataman.",
        en: 'Method one. Write the multiples of both numbers and stop at the first shared one. I will show it on four and six.',
      },
      demo: {
        ru: 'Кратные четырёх: четыре, восемь, двенадцать. Кратные шести: шесть, двенадцать. Первое общее двенадцать.',
        uz: "To'rtga karralilar: to'rt, sakkiz, o'n ikki. Oltiga karralilar: olti, o'n ikki. Birinchi umumiysi o'n ikki.",
        en: 'Multiples of four: four, eight, twelve. Multiples of six: six, twelve. The first shared one is twelve.',
      },
      play: {
        ru: 'Теперь ваша очередь. Найдите наименьшее общее кратное шести и девяти.',
        uz: "Endi sizning navbatingiz. Olti va to'qqizning eng kichik umumiy karralisini toping.",
        en: 'Now it is your turn. Find the least common multiple of six and nine.',
      },
      ok: {
        ru: 'Верно. Кратные шести шесть, двенадцать, восемнадцать. У девяти девять и восемнадцать. Первое общее восемнадцать.',
        uz: "To'g'ri. Oltiga karralilar olti, o'n ikki, o'n sakkiz. To'qqizniki to'qqiz va o'n sakkiz. Birinchi umumiysi o'n sakkiz.",
        en: 'Right. Multiples of six: six, twelve, eighteen. Of nine: nine and eighteen. The first shared one is eighteen.',
      },
      wrong: {
        ru: 'Выпишите кратные обоих чисел и найдите первое совпадение.',
        uz: "Ikkala sonning karralilarini yozing va birinchi mos kelganini toping.",
        en: 'Write the multiples of both numbers and find the first match.',
      },
    },
  },

  s_fact: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Способ 2: через простые', uz: 'Usul 2: tub sonlar orqali', en: 'Method 2: through primes' },
    a: { n: 12, f: [2, 2, 3] },
    b: { n: 18, f: [2, 3, 3] },
    lcm: [2, 2, 3, 3],
    done: {
      ru: 'Берём каждый множитель столько раз, сколько он встречается в самом «богатом» разложении: две двойки и две тройки. Произведение 36 — это НОК.',
      uz: "Har bir ko'paytuvchini eng «boy» yoyilmada nechta bo'lsa, shuncha marta olamiz: ikkita ikki va ikkita uch. Ko'paytma 36 — bu EKUK.",
      en: 'Take each factor as many times as it appears in the richest factorisation: two twos and two threes. The product 36 is the LCM.',
    },
    audio: {
      ru: [
        'Второй способ через простые множители. Двенадцать это два, два и три. Восемнадцать это два, три и три.',
        'Для наибольшего общего делителя мы брали общее. Здесь наоборот: берём каждый множитель по максимуму.',
        'Двоек больше всего в двенадцати, их две. Троек больше всего в восемнадцати, их тоже две. Перемножаем и получаем тридцать шесть.',
      ],
      uz: [
        "Ikkinchi usul tub ko'paytuvchilar orqali. O'n ikki bu ikki, ikki va uch. O'n sakkiz bu ikki, uch va uch.",
        "Eng katta umumiy bo'luvchi uchun umumiysini olgan edik. Bu yerda teskarisi: har bir ko'paytuvchini eng ko'pi bilan olamiz.",
        "Ikkilar eng ko'pi o'n ikkida, ular ikkita. Uchlar eng ko'pi o'n sakkizda, ular ham ikkita. Ko'paytiramiz va o'ttiz olti chiqadi.",
      ],
      en: [
        'The second method goes through prime factors. Twelve is two, two and three. Eighteen is two, three and three.',
        'For the greatest common divisor we took what was shared. Here it is the opposite: take each factor at its maximum.',
        'Twos are most numerous in twelve, there are two. Threes are most numerous in eighteen, also two. Multiply and get thirty six.',
      ],
    },
  },

  s_solve: {
    eyebrow: { ru: 'Решаем вместе', uz: 'Birga yechamiz', en: 'Solving together' },
    title: { ru: 'Автобусы: через 36 минут', uz: 'Avtobuslar: 36 daqiqadan keyin', en: 'The buses: in 36 minutes' },
    lead: { ru: 'Проверим оба способа на числах из задачи.', uz: "Masaladagi sonlarda ikkala usulni tekshiramiz.", en: 'Let us check both methods on the numbers from the problem.' },
    rows: [
      { ru: 'Кратные 12: 12, 24, 36', uz: '12 ga karralilar: 12, 24, 36', en: 'Multiples of 12: 12, 24, 36' },
      { ru: 'Кратные 18: 18, 36', uz: '18 ga karralilar: 18, 36', en: 'Multiples of 18: 18, 36' },
      { ru: 'Через множители: 2 · 2 · 3 · 3 = 36', uz: "Ko'paytuvchilar orqali: 2 · 2 · 3 · 3 = 36", en: 'Through factors: 2 · 2 · 3 · 3 = 36' },
    ],
    done: {
      ru: 'Оба способа дали 36. Автобусы уедут вместе через 36 минут — Дилноза была права, это раньше, чем 30? Нет: 36 больше 30, значит прав был Азиз в сроке, но ошибся в числе. Верный ответ 36.',
      uz: "Ikkala usul ham 36 ni berdi. Avtobuslar 36 daqiqadan keyin birga jo'naydi. To'g'ri javob 36.",
      en: 'Both methods gave 36. The buses leave together in 36 minutes. The right answer is 36.',
    },
    audio: {
      ru: [
        'Решаем вместе. Кратные двенадцати: двенадцать, двадцать четыре, тридцать шесть.',
        'Кратные восемнадцати: восемнадцать, тридцать шесть. Первое общее тридцать шесть.',
        'Через простые множители тот же ответ: два, два, три, три, всего тридцать шесть. Значит автобусы уедут вместе через тридцать шесть минут.',
      ],
      uz: [
        "Birga yechamiz. O'n ikkiga karralilar: o'n ikki, yigirma to'rt, o'ttiz olti.",
        "O'n sakkizga karralilar: o'n sakkiz, o'ttiz olti. Birinchi umumiysi o'ttiz olti.",
        "Tub ko'paytuvchilar orqali ham o'sha javob: ikki, ikki, uch, uch, jami o'ttiz olti. Demak avtobuslar o'ttiz olti daqiqadan keyin birga jo'naydi.",
      ],
      en: [
        'Let us solve it together. Multiples of twelve: twelve, twenty four, thirty six.',
        'Multiples of eighteen: eighteen, thirty six. The first shared one is thirty six.',
        'Through prime factors the answer is the same: two, two, three, three, thirty six in all. So the buses leave together in thirty six minutes.',
      ],
    },
  },

  s_edge: {
    eyebrow: { ru: 'Связь', uz: "Bog'lanish", en: 'The link' },
    title: { ru: 'НОД и НОК связаны', uz: "EKUB va EKUK bog'liq", en: 'GCD and LCM are linked' },
    line_1: { ru: 'НОД(12, 18) = 6', uz: 'EKUB(12, 18) = 6', en: 'GCD(12, 18) = 6' },
    line_2: { ru: 'НОК(12, 18) = 36', uz: 'EKUK(12, 18) = 36', en: 'LCM(12, 18) = 36' },
    line_3: { ru: '6 · 36 = 216', uz: '6 · 36 = 216', en: '6 · 36 = 216' },
    line_4: { ru: '12 · 18 = 216', uz: '12 · 18 = 216', en: '12 · 18 = 216' },
    done: {
      ru: 'Произведение НОД и НОК равно произведению самих чисел. Зная одно, второе можно посчитать делением.',
      uz: "EKUB va EKUK ko'paytmasi sonlarning ko'paytmasiga teng. Birini bilsangiz, ikkinchisini bo'lish bilan topasiz.",
      en: 'The product of the GCD and the LCM equals the product of the numbers. Knowing one, you can divide to get the other.',
    },
    audio: {
      ru: [
        'Проверим одну связь. Наибольший общий делитель двенадцати и восемнадцати шесть, а наименьшее общее кратное тридцать шесть.',
        'Перемножим их: шесть на тридцать шесть это двести шестнадцать. А теперь перемножим сами числа: двенадцать на восемнадцать тоже двести шестнадцать.',
        'Так бывает всегда. Значит, зная одно из двух, второе можно найти делением.',
      ],
      uz: [
        "Bitta bog'lanishni tekshiramiz. O'n ikki va o'n sakkizning eng katta umumiy bo'luvchisi olti, eng kichik umumiy karralisi esa o'ttiz olti.",
        "Ularni ko'paytiramiz: olti karra o'ttiz olti bu ikki yuz o'n olti. Endi sonlarning o'zini ko'paytiramiz: o'n ikki karra o'n sakkiz ham ikki yuz o'n olti.",
        "Bu doim shunday. Demak birini bilsangiz, ikkinchisini bo'lish bilan topasiz.",
      ],
      en: [
        'Let us check one link. The greatest common divisor of twelve and eighteen is six, and the least common multiple is thirty six.',
        'Multiply them: six times thirty six is two hundred sixteen. Now multiply the numbers themselves: twelve times eighteen is also two hundred sixteen.',
        'This always holds. So knowing one of the two, you can find the other by dividing.',
      ],
    },
  },

  s_rule: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    title: { ru: 'Наименьшее общее кратное', uz: 'Eng kichik umumiy karrali', en: 'The least common multiple' },
    rule_1: {
      ru: 'НОК(a, b) — самое маленькое число, которое делится и на a, и на b. Оно не меньше большего из чисел.',
      uz: "EKUK(a, b) — a ga ham, b ga ham bo'linadigan eng kichik son. U sonlarning kattasidan kichik emas.",
      en: 'LCM(a, b) is the smallest number divisible by both a and b. It is never less than the larger number.',
    },
    rule_2: {
      ru: 'Автобусы: НОК(12, 18) = 36, значит вместе они уедут через 36 минут. Ни 30, ни 24 не подходят: 30 не делится на 12, а 24 не делится на 18.',
      uz: "Avtobuslar: EKUK(12, 18) = 36, demak ular 36 daqiqadan keyin birga jo'naydi. Na 30, na 24 mos: 30 soni 12 ga, 24 soni 18 ga bo'linmaydi.",
      en: 'The buses: LCM(12, 18) = 36, so they leave together in 36 minutes. Neither 30 nor 24 fits: 30 does not divide by 12 and 24 does not divide by 18.',
    },
    audio: {
      ru: 'Запомним правило. Наименьшее общее кратное это самое маленькое число, которое делится на оба. Оно не меньше большего из чисел. И вернёмся к автобусам. Наименьшее общее кратное двенадцати и восемнадцати тридцать шесть, значит вместе они уедут через тридцать шесть минут. Тридцать не подходит: тридцать на двенадцать не делится.',
      uz: "Qoidani eslab qolamiz. Eng kichik umumiy karrali bu ikkalasiga ham bo'linadigan eng kichik son. U sonlarning kattasidan kichik emas. Va avtobuslarga qaytamiz. O'n ikki va o'n sakkizning eng kichik umumiy karralisi o'ttiz olti, demak ular o'ttiz olti daqiqadan keyin birga jo'naydi. O'ttiz mos emas: o'ttiz o'n ikkiga bo'linmaydi.",
      en: 'Let us remember the rule. The least common multiple is the smallest number divisible by both. It is never less than the larger number. And back to the buses. The least common multiple of twelve and eighteen is thirty six, so they leave together in thirty six minutes. Thirty does not fit: thirty does not divide by twelve.',
    },
  },

  s_first: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Первое общее кратное', uz: 'Birinchi umumiy karrali', en: 'The first common multiple' },
    lead: { ru: 'Идём по кратным большего числа: так быстрее.', uz: "Katta sonning karralilari bo'yicha yuring: shunda tezroq.", en: 'Walk along the multiples of the larger number: it is faster.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Первое общее кратное 3 и 5', uz: '3 va 5 ning birinchi umumiy karralisi', en: 'The first common multiple of 3 and 5' },
        opts: ['8', '15', '30'],
        correct: 1,
        ok: { ru: 'Верно. 15 делится и на 3, и на 5, и раньше него общего нет.', uz: "To'g'ri. 15 soni 3 ga ham, 5 ga ham bo'linadi, undan oldin umumiysi yo'q.", en: 'Right. 15 divides by 3 and by 5, and nothing earlier is shared.' },
        wrong: [
          { ru: '8 — это сумма 3 и 5, а не кратное.', uz: "8 bu 3 va 5 ning yig'indisi, karrali emas.", en: 'Eight is the sum of 3 and 5, not a multiple.' },
          null,
          { ru: '30 общее, но не первое: 15 встретилось раньше.', uz: "30 umumiy, lekin birinchisi emas: 15 oldinroq uchradi.", en: 'Thirty is common but not first: fifteen came earlier.' },
        ],
      },
      {
        q: { ru: 'Первое общее кратное 4 и 8', uz: '4 va 8 ning birinchi umumiy karralisi', en: 'The first common multiple of 4 and 8' },
        opts: ['8', '16', '32'],
        correct: 0,
        ok: { ru: 'Верно. 8 делится на 4, поэтому НОК равен большему числу.', uz: "To'g'ri. 8 soni 4 ga bo'linadi, shuning uchun EKUK katta songa teng.", en: 'Right. Eight divides by four, so the LCM equals the larger number.' },
        wrong: [
          null,
          { ru: '16 общее, но 8 подошло раньше: оно уже делится на 4.', uz: "16 umumiy, lekin 8 oldinroq mos keldi: u allaqachon 4 ga bo'linadi.", en: 'Sixteen is common, but eight came first: it already divides by four.' },
          { ru: '32 слишком далеко: восьмёрка подходит сразу.', uz: "32 juda uzoq: sakkiz darrov mos keladi.", en: 'Thirty two is too far: eight fits at once.' },
        ],
      },
      {
        q: { ru: 'Первое общее кратное 6 и 10', uz: '6 va 10 ning birinchi umumiy karralisi', en: 'The first common multiple of 6 and 10' },
        opts: ['16', '30', '60'],
        correct: 1,
        ok: { ru: 'Верно. 30 : 6 = 5 и 30 : 10 = 3. Раньше общего нет.', uz: "To'g'ri. 30 : 6 = 5 va 30 : 10 = 3. Undan oldin umumiysi yo'q.", en: 'Right. 30 : 6 = 5 and 30 : 10 = 3. Nothing earlier is shared.' },
        wrong: [
          { ru: '16 — сумма, а не кратное: 16 на 6 не делится.', uz: "16 bu yig'indi, karrali emas: 16 soni 6 ga bo'linmaydi.", en: 'Sixteen is a sum, not a multiple: 16 does not divide by 6.' },
          null,
          { ru: '60 общее, но не наименьшее: 30 встретилось раньше.', uz: "60 umumiy, lekin eng kichigi emas: 30 oldinroq uchradi.", en: 'Sixty is common but not least: thirty came earlier.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика. Ищите первое число, которое делится на оба.',
        uz: "Mashq. Ikkalasiga ham bo'linadigan birinchi sonni qidiring.",
        en: 'Practice. Look for the first number divisible by both.',
      },
    },
  },

  s_lcm: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Найди НОК', uz: 'EKUK ni toping', en: 'Find the LCM' },
    lead: { ru: 'Кратные по списку или простые множители — способ твой.', uz: "Karralilar ro'yxati yoki tub ko'paytuvchilar — usul sizniki.", en: 'A list of multiples or prime factors — your choice.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'НОК(8, 12)', uz: 'EKUK(8, 12)', en: 'LCM(8, 12)' },
        opts: ['24', '48', '96'],
        correct: 0,
        ok: { ru: 'Верно. 8 = 2·2·2, 12 = 2·2·3, берём 2·2·2·3 = 24.', uz: "To'g'ri. 8 = 2·2·2, 12 = 2·2·3, 2·2·2·3 = 24 olamiz.", en: 'Right. 8 = 2·2·2, 12 = 2·2·3, take 2·2·2·3 = 24.' },
        wrong: [
          null,
          { ru: '48 общее, но 24 встретилось раньше.', uz: "48 umumiy, lekin 24 oldinroq uchradi.", en: '48 is common, but 24 came earlier.' },
          { ru: '96 — это произведение 8 и 12, а НОК меньше.', uz: "96 bu 8 va 12 ning ko'paytmasi, EKUK esa kichikroq.", en: '96 is the product of 8 and 12, and the LCM is smaller.' },
        ],
      },
      {
        q: { ru: 'НОК(5, 7)', uz: 'EKUK(5, 7)', en: 'LCM(5, 7)' },
        opts: ['12', '35', '70'],
        correct: 1,
        ok: { ru: 'Верно. У взаимно простых чисел НОК равен произведению.', uz: "To'g'ri. O'zaro tub sonlarda EKUK ko'paytmaga teng.", en: 'Right. For coprime numbers the LCM equals the product.' },
        wrong: [
          { ru: '12 — сумма, а не кратное: 12 на 5 не делится.', uz: "12 bu yig'indi, karrali emas: 12 soni 5 ga bo'linmaydi.", en: 'Twelve is a sum, not a multiple: 12 does not divide by 5.' },
          null,
          { ru: '70 общее, но 35 раньше.', uz: "70 umumiy, lekin 35 oldinroq.", en: '70 is common, but 35 comes first.' },
        ],
      },
      {
        q: { ru: 'НОК(9, 12)', uz: 'EKUK(9, 12)', en: 'LCM(9, 12)' },
        opts: ['36', '54', '108'],
        correct: 0,
        ok: { ru: 'Верно. 9 = 3·3, 12 = 2·2·3, берём 2·2·3·3 = 36.', uz: "To'g'ri. 9 = 3·3, 12 = 2·2·3, 2·2·3·3 = 36 olamiz.", en: 'Right. 9 = 3·3, 12 = 2·2·3, take 2·2·3·3 = 36.' },
        wrong: [
          null,
          { ru: '54 делится на 9, но не на 12.', uz: "54 soni 9 ga bo'linadi, 12 ga esa yo'q.", en: '54 divides by 9 but not by 12.' },
          { ru: '108 общее, но не наименьшее.', uz: "108 umumiy, lekin eng kichigi emas.", en: '108 is common but not the least.' },
        ],
      },
      {
        q: { ru: 'НОК(7, 14)', uz: 'EKUK(7, 14)', en: 'LCM(7, 14)' },
        opts: ['7', '14', '98'],
        correct: 1,
        ok: { ru: 'Верно. 14 делится на 7, поэтому НОК равен большему числу.', uz: "To'g'ri. 14 soni 7 ga bo'linadi, shuning uchun EKUK katta songa teng.", en: 'Right. 14 divides by 7, so the LCM equals the larger number.' },
        wrong: [
          { ru: '7 на 14 не делится, значит общим кратным быть не может.', uz: "7 soni 14 ga bo'linmaydi, demak umumiy karrali bo'la olmaydi.", en: 'Seven does not divide by fourteen, so it cannot be a common multiple.' },
          null,
          { ru: '98 — это 7 · 14, а НОК меньше: 14 уже подходит.', uz: "98 bu 7 · 14, EKUK esa kichikroq: 14 allaqachon mos.", en: '98 is 7 · 14, and the LCM is smaller: 14 already fits.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Ищем наименьшее общее кратное. Проверьте: если одно число делится на другое, ответом будет большее.',
        uz: "Eng kichik umumiy karralini qidiramiz. Tekshiring: bir son ikkinchisiga bo'linsa, javob kattasi.",
        en: 'Find the least common multiple. Check: if one number divides the other, the answer is the larger one.',
      },
    },
  },

  s_bins: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Кратно и 4, и 6?', uz: "4 ga ham, 6 ga ham karralimi?", en: 'A multiple of both 4 and 6?' },
    lead: { ru: 'Число должно делиться на оба сразу.', uz: "Son ikkalasiga birdan bo'linishi kerak.", en: 'The number must divide by both at once.' },
    bin_a: { ru: 'Кратно обоим', uz: 'Ikkalasiga karrali', en: 'Multiple of both' },
    bin_b: { ru: 'Не кратно', uz: 'Karrali emas', en: 'Not a multiple' },
    cards: [
      { label: '12', bin: 'a' },
      { label: '18', bin: 'b' },
      { label: '24', bin: 'a' },
      { label: '30', bin: 'b' },
      { label: '36', bin: 'a' },
      { label: '20', bin: 'b' },
    ],
    hint: {
      ru: 'Раздели на 4 и на 6. Не подошло хотя бы одно — во вторую корзину.',
      uz: "4 ga va 6 ga bo'ling. Bittasi mos kelmasa — ikkinchi savatga.",
      en: 'Divide by 4 and by 6. If one fails, it goes to the second basket.',
    },
    correct_text: {
      ru: 'Верно. 12, 24 и 36 делятся и на 4, и на 6. А 18 и 30 не делятся на 4, 20 не делится на 6.',
      uz: "To'g'ri. 12, 24 va 36 soni 4 ga ham, 6 ga ham bo'linadi. 18 va 30 esa 4 ga, 20 esa 6 ga bo'linmaydi.",
      en: 'Right. 12, 24 and 36 divide by 4 and 6. But 18 and 30 do not divide by 4, and 20 does not divide by 6.',
    },
    audio: {
      intro: {
        ru: 'Разложите числа по двум корзинам. Число должно делиться и на четыре, и на шесть.',
        uz: "Sonlarni ikki savatga ajrating. Son to'rtga ham, oltiga ham bo'linishi kerak.",
        en: 'Sort the numbers into two baskets. The number must divide by four and by six.',
      },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда. Проверь оба деления.', uz: "Bu yerga emas. Ikkala bo'lishni tekshiring.", en: 'Not here. Check both divisions.' },
    },
  },

  s_error: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikidek tekshiring.", en: 'Check someone else’s work the way you would check your own.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Азиз: «НОК(6, 8) = 48, ведь 6 · 8 = 48». Где ошибка?', uz: "Aziz: «EKUK(6, 8) = 48, chunki 6 · 8 = 48». Xato qayerda?", en: 'Aziz: “LCM(6, 8) = 48 because 6 · 8 = 48.” Where is the mistake?' },
        opts: [
          { ru: '24 встречается раньше', uz: '24 oldinroq uchraydi', en: '24 comes earlier' },
          { ru: 'Ошибки нет', uz: "Xato yo'q", en: 'There is no mistake' },
          { ru: '48 не делится на 6', uz: "48 soni 6 ga bo'linmaydi", en: '48 does not divide by 6' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 24 делится и на 6, и на 8. Произведение подходит только у взаимно простых.', uz: "To'g'ri. 24 soni 6 ga ham, 8 ga ham bo'linadi. Ko'paytma faqat o'zaro tub sonlarda mos keladi.", en: 'Right. 24 divides by 6 and by 8. The product works only for coprime numbers.' },
        wrong: [
          null,
          { ru: 'Ошибка есть: 48 общее кратное, но не наименьшее.', uz: "Xato bor: 48 umumiy karrali, lekin eng kichigi emas.", en: 'There is a mistake: 48 is a common multiple but not the least.' },
          { ru: '48 как раз делится на 6: 48 : 6 = 8. Ошибка в другом.', uz: "48 aynan 6 ga bo'linadi: 48 : 6 = 8. Xato boshqa joyda.", en: '48 does divide by 6: 48 : 6 = 8. The mistake is elsewhere.' },
        ],
      },
      {
        q: { ru: 'Дилноза: «НОК(4, 10) = 2, ведь это их общий делитель». Проверь.', uz: "Dilnoza: «EKUK(4, 10) = 2, chunki bu ularning umumiy bo'luvchisi». Tekshiring.", en: 'Dilnoza: “LCM(4, 10) = 2, that is their common divisor.” Check it.' },
        opts: [
          { ru: 'Она перепутала НОД и НОК', uz: "U EKUB va EKUK ni chalkashtirgan", en: 'She mixed up GCD and LCM' },
          { ru: 'Верно', uz: "To'g'ri", en: 'Correct' },
          { ru: 'НОК равен 40', uz: 'EKUK 40 ga teng', en: 'The LCM is 40' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 2 — это НОД. А НОК(4, 10) = 20: оно делится и на 4, и на 10.', uz: "To'g'ri. 2 bu EKUB. EKUK(4, 10) esa 20: u 4 ga ham, 10 ga ham bo'linadi.", en: 'Right. Two is the GCD. And LCM(4, 10) = 20: it divides by 4 and by 10.' },
        wrong: [
          null,
          { ru: 'Не верно: кратное не может быть меньше самих чисел.', uz: "To'g'ri emas: karrali sonlarning o'zidan kichik bo'la olmaydi.", en: 'Not correct: a multiple cannot be smaller than the numbers.' },
          { ru: '40 общее кратное, но 20 встречается раньше.', uz: "40 umumiy karrali, lekin 20 oldinroq uchraydi.", en: '40 is a common multiple, but 20 comes earlier.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Проверьте чужое решение. Ошибка бывает и в числе, и в самом понятии.',
        uz: "Birovning yechimini tekshiring. Xato sonda ham, tushunchaning o'zida ham bo'lishi mumkin.",
        en: 'Check someone else’s work. A mistake can be in the number and in the idea itself.',
      },
    },
  },

  s_task: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    title: { ru: 'Расписание кружков', uz: "To'garaklar jadvali", en: 'The clubs timetable' },
    lead: { ru: 'Шахматы идут каждые 4 дня, робототехника каждые 6. Сегодня были оба.', uz: "Shaxmat har 4 kunda, robototexnika har 6 kunda bo'ladi. Bugun ikkalasi ham bo'ldi.", en: 'Chess meets every 4 days, robotics every 6. Today both met.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    days: ['4', '6'],
    items: [
      {
        q: { ru: 'Через сколько дней они снова совпадут?', uz: "Necha kundan keyin ular yana mos keladi?", en: 'In how many days will they meet again?' },
        opts: ['10', '12', '24'],
        correct: 1,
        ok: { ru: 'Верно. Кратные 4: 4, 8, 12. Кратные 6: 6, 12. Первое общее — 12.', uz: "To'g'ri. 4 ga karralilar: 4, 8, 12. 6 ga: 6, 12. Birinchi umumiysi — 12.", en: 'Right. Multiples of 4: 4, 8, 12. Of 6: 6, 12. The first shared one is 12.' },
        wrong: [
          { ru: '10 — сумма, а не кратное: 10 на 4 не делится.', uz: "10 bu yig'indi, karrali emas: 10 soni 4 ga bo'linmaydi.", en: 'Ten is a sum, not a multiple: 10 does not divide by 4.' },
          null,
          { ru: '24 общее, но 12 раньше.', uz: "24 umumiy, lekin 12 oldinroq.", en: '24 is common, but 12 comes first.' },
        ],
      },
      {
        q: { ru: 'Сколько раз за 24 дня они совпадут?', uz: "24 kun ichida ular necha marta mos keladi?", en: 'How many times will they meet in 24 days?' },
        opts: ['1', '2', '4'],
        correct: 1,
        ok: { ru: 'Верно. Совпадения на 12-й и на 24-й день — два раза.', uz: "To'g'ri. Mos kelish 12- va 24-kuni — ikki marta.", en: 'Right. They meet on day 12 and day 24 — twice.' },
        wrong: [
          { ru: 'На 24-й день тоже совпадут: 24 делится и на 4, и на 6.', uz: "24-kuni ham mos keladi: 24 soni 4 ga ham, 6 ga ham bo'linadi.", en: 'They also meet on day 24: it divides by 4 and by 6.' },
          null,
          { ru: 'Каждые 12 дней, значит за 24 дня только два раза.', uz: "Har 12 kunda, demak 24 kunda faqat ikki marta.", en: 'Every 12 days, so only twice in 24 days.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Задача про кружки. Шахматы каждые четыре дня, робототехника каждые шесть. Сегодня были оба.',
        uz: "To'garaklar haqida masala. Shaxmat har to'rt kunda, robototexnika har olti kunda. Bugun ikkalasi ham bo'ldi.",
        en: 'A problem about clubs. Chess every four days, robotics every six. Today both met.',
      },
    },
  },

  s_final: {
    eyebrow: { ru: 'Финал', uz: 'Final', en: 'Final' },
    intro_line: { ru: 'Пять заданий на весь урок.', uz: 'Butun darsga beshta topshiriq.', en: 'Five tasks covering the whole lesson.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        kind: 'num', ans: 36,
        q: { ru: 'Чему равен НОК(12, 18)? Набери ответ.', uz: 'EKUK(12, 18) nechaga teng? Javobni tering.', en: 'What is LCM(12, 18)? Type the answer.' },
        hint: { ru: 'Кратные 18: 18, 36. Какое из них делится на 12?', uz: "18 ga karralilar: 18, 36. Qaysi biri 12 ga bo'linadi?", en: 'Multiples of 18: 18, 36. Which of them divides by 12?' },
        hint_audio: { ru: 'Кратные восемнадцати: восемнадцать и тридцать шесть. Какое из них делится на двенадцать?', uz: "O'n sakkizga karralilar: o'n sakkiz va o'ttiz olti. Qaysi biri o'n ikkiga bo'linadi?", en: 'Multiples of eighteen: eighteen and thirty six. Which one divides by twelve?' },
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'НОК(10, 15) равен…', uz: 'EKUK(10, 15) nechaga teng…', en: 'LCM(10, 15) is…' },
        opts: ['25', '30', '60', '150'],
        wrong: [
          { ru: '25 не делится на 10.', uz: "25 soni 10 ga bo'linmaydi.", en: '25 does not divide by 10.' },
          null,
          { ru: '60 общее, но 30 раньше.', uz: "60 umumiy, lekin 30 oldinroq.", en: '60 is common, but 30 comes first.' },
          { ru: '150 — это произведение, а НОК меньше.', uz: "150 bu ko'paytma, EKUK esa kichikroq.", en: '150 is the product, and the LCM is smaller.' },
        ],
        correct: { ru: 'Верно. 30 : 10 = 3 и 30 : 15 = 2.', uz: "To'g'ri. 30 : 10 = 3 va 30 : 15 = 2.", en: 'Right. 30 : 10 = 3 and 30 : 15 = 2.' },
      },
      {
        kind: 'mc', correctIndex: 2,
        q: { ru: 'Когда НОК двух чисел равен их произведению?', uz: "Ikki sonning EKUKi qachon ularning ko'paytmasiga teng?", en: 'When does the LCM equal the product?' },
        opts: [
          { ru: 'Всегда', uz: 'Doim', en: 'Always' },
          { ru: 'Когда оба чётные', uz: "Ikkalasi juft bo'lganda", en: 'When both are even' },
          { ru: 'Когда числа взаимно простые', uz: "Sonlar o'zaro tub bo'lganda", en: 'When the numbers are coprime' },
          { ru: 'Никогда', uz: 'Hech qachon', en: 'Never' },
        ],
        wrong: [
          { ru: 'У 6 и 8 произведение 48, а НОК 24.', uz: "6 va 8 da ko'paytma 48, EKUK esa 24.", en: 'For 6 and 8 the product is 48 and the LCM is 24.' },
          { ru: 'У чётных всегда есть общий делитель 2, поэтому НОК меньше произведения.', uz: "Juft sonlarda doim 2 umumiy bo'luvchi bor, shuning uchun EKUK ko'paytmadan kichik.", en: 'Even numbers always share 2, so the LCM is smaller than the product.' },
          null,
          { ru: 'У 5 и 7 НОК как раз равен 35 — это их произведение.', uz: "5 va 7 da EKUK aynan 35 — bu ularning ko'paytmasi.", en: 'For 5 and 7 the LCM is 35, exactly their product.' },
        ],
        correct: { ru: 'Верно. Если общих делителей нет, кроме единицы, НОК равен произведению.', uz: "To'g'ri. Birdan boshqa umumiy bo'luvchi bo'lmasa, EKUK ko'paytmaga teng.", en: 'Right. If they share no divisor but one, the LCM equals the product.' },
      },
      {
        kind: 'mc', correctIndex: 0,
        q: { ru: 'Известно: НОД(a, b) = 4, а · b = 96. Чему равен НОК?', uz: "Ma'lum: EKUB(a, b) = 4, a · b = 96. EKUK nechaga teng?", en: 'Given: GCD(a, b) = 4 and a · b = 96. What is the LCM?' },
        opts: ['24', '4', '96', '384'],
        wrong: [
          null,
          { ru: '4 — это НОД, а НОК больше.', uz: "4 bu EKUB, EKUK esa kattaroq.", en: 'Four is the GCD, and the LCM is larger.' },
          { ru: '96 — это произведение чисел, его надо разделить на НОД.', uz: "96 bu sonlarning ko'paytmasi, uni EKUB ga bo'lish kerak.", en: '96 is the product; divide it by the GCD.' },
          { ru: 'Умножать не надо: НОК равен произведению, делённому на НОД.', uz: "Ko'paytirish shart emas: EKUK ko'paytmani EKUB ga bo'lgan natija.", en: 'No multiplying: the LCM is the product divided by the GCD.' },
        ],
        correct: { ru: 'Верно. 96 : 4 = 24 — связь НОД и НОК с прошлого экрана.', uz: "To'g'ri. 96 : 4 = 24 — o'tgan ekrandagi EKUB va EKUK bog'lanishi.", en: 'Right. 96 : 4 = 24 — the link between GCD and LCM from the earlier screen.' },
      },
      {
        kind: 'mc', correctIndex: 3,
        q: { ru: 'Где в жизни нужен НОК?', uz: 'EKUK hayotda qayerda kerak?', en: 'Where is the LCM needed in life?' },
        opts: [
          { ru: 'Разделить конфеты поровну', uz: "Konfetlarni teng bo'lish", en: 'Sharing sweets evenly' },
          { ru: 'Собрать одинаковые наборы', uz: "Bir xil to'plam yig'ish", en: 'Packing identical sets' },
          { ru: 'Сократить дробь', uz: 'Kasrni qisqartirish', en: 'Reducing a fraction' },
          { ru: 'Понять, когда события совпадут', uz: "Hodisalar qachon mos kelishini bilish", en: 'Knowing when events coincide' },
        ],
        wrong: [
          { ru: 'Это деление, там нужен делитель, а не кратное.', uz: "Bu bo'lish, u yerda bo'luvchi kerak, karrali emas.", en: 'That is division: it needs a divisor, not a multiple.' },
          { ru: 'Наборы — это НОД, он был на прошлом уроке.', uz: "To'plamlar bu EKUB, u o'tgan darsda edi.", en: 'Sets are the GCD, that was the previous lesson.' },
          { ru: 'Сокращение дроби — тоже про делители.', uz: "Kasrni qisqartirish ham bo'luvchilar haqida.", en: 'Reducing a fraction is about divisors too.' },
          null,
        ],
        correct: { ru: 'Верно. Автобусы, кружки, смены — всё, что повторяется через свой промежуток.', uz: "To'g'ri. Avtobuslar, to'garaklar, smenalar — o'z oralig'ida takrorlanadigan hamma narsa.", en: 'Right. Buses, clubs, shifts — anything that repeats on its own interval.' },
      },
    ],
    audio: {
      intro: {
        ru: 'Финальная проверка. Пять заданий на весь урок. Первое с набором числа, остальные с выбором.',
        uz: "Yakuniy tekshiruv. Butun darsga beshta topshiriq. Birinchisida son teriladi, qolganlarida tanlanadi.",
        en: 'The final check. Five tasks covering the whole lesson. The first needs a typed number, the rest are multiple choice.',
      },
      on_correct: { ru: 'Верно.', uz: "To'g'ri.", en: 'Right.' },
      on_wrong: { ru: 'Посмотри разбор.', uz: 'Tushuntirishga qarang.', en: 'Look at the explanation.' },
    },
    fact: {
      ru: 'Цикады выходят из земли раз в 13 или 17 лет — оба числа простые. Так их годы совпадают с годами хищников редко, и это спасает вид.',
      uz: "Sikadalar yerdan 13 yoki 17 yilda bir marta chiqadi — ikkala son ham tub. Shuning uchun ularning yillari yirtqichlar yillari bilan kam mos keladi va bu turni saqlaydi.",
      en: 'Cicadas emerge every 13 or 17 years — both primes. That makes their years rarely coincide with predators’ years, and it saves the species.',
    },
    fact_audio: {
      ru: 'Знаешь ли ты? Цикады выходят из земли раз в тринадцать или семнадцать лет, и оба числа простые. Из-за этого их годы редко совпадают с годами хищников, и это спасает вид.',
      uz: "Bilasizmi? Sikadalar yerdan o'n uch yoki o'n yetti yilda bir marta chiqadi va ikkala son ham tub. Shu sababli ularning yillari yirtqichlar yillari bilan kam mos keladi va bu turni saqlaydi.",
      en: 'Did you know? Cicadas emerge every thirteen or seventeen years, and both numbers are prime. Because of that their years rarely coincide with predators, and it saves the species.',
    },
  },

  s14: {
    eyebrow: { ru: 'Урок пройден', uz: "Dars o'tildi", en: 'Lesson finished' },
    banner: { ru: 'Математика · Делимость', uz: "Matematika · Bo'linish", en: 'Mathematics · Divisibility' },
    heading: { ru: 'Наименьшее общее кратное', uz: 'Eng kichik umumiy karrali', en: 'Least common multiple' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    brief_1: { ru: 'НОК — первое число, кратное обоим', uz: 'EKUK — ikkalasiga karrali birinchi son', en: 'LCM is the first number that is a multiple of both' },
    brief_2: { ru: 'два способа: списком кратных и через множители', uz: "ikki usul: karralilar ro'yxati va ko'paytuvchilar orqali", en: 'two methods: a list of multiples and prime factors' },
    brief_3: { ru: 'НОД · НОК = произведение чисел', uz: "EKUB · EKUK = sonlar ko'paytmasi", en: 'GCD · LCM = the product of the numbers' },
    memo_title: { ru: 'Что помнить', uz: 'Nimani eslash kerak', en: 'What to remember' },
    memo_q1: { ru: 'Делители и кратные', uz: "Bo'luvchilar va karralilar", en: 'Divisors and multiples' },
    memo_a1: { ru: 'делители внутри числа, кратные за ним', uz: "bo'luvchilar son ichida, karralilar undan keyin", en: 'divisors inside the number, multiples beyond it' },
    memo_q2: { ru: 'Насколько велик НОК', uz: 'EKUK qanchalik katta', en: 'How large the LCM is' },
    memo_a2: { ru: 'не меньше большего из чисел', uz: 'sonlarning kattasidan kichik emas', en: 'never less than the larger number' },
    memo_q3: { ru: 'Если одно делится на другое', uz: "Biri ikkinchisiga bo'linsa", en: 'If one divides the other' },
    memo_a3: { ru: 'НОК равен большему числу', uz: 'EKUK katta songa teng', en: 'the LCM is the larger number' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'Наименьшее общее кратное это первое число, которое делится на оба. Искать можно списком кратных или через простые множители.',
        'Автобусы уехали вместе через тридцать шесть минут. Ни тридцать, ни двадцать четыре не подошли.',
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "Eng kichik umumiy karrali bu ikkalasiga ham bo'linadigan birinchi son. Uni karralilar ro'yxati bilan yoki tub ko'paytuvchilar orqali topish mumkin.",
        "Avtobuslar o'ttiz olti daqiqadan keyin birga jo'nadi. Na o'ttiz, na yigirma to'rt mos keldi.",
      ],
      en: [
        'The lesson is done. Let us gather the main points.',
        'The least common multiple is the first number divisible by both. You can find it by listing multiples or through prime factors.',
        'The buses left together after thirty six minutes. Neither thirty nor twenty four fitted.',
      ],
    },
  },

  s_methods: {
    m1_title: { ru: 'Способ. До первой встречи', uz: 'Usul. Birinchi uchrashuvgacha', en: 'Method. Up to the first meeting' },
    m1_steps: {
      ru: ['Выписывай кратные большего числа', 'Каждое проверяй на деление вторым', 'Первое подошедшее и есть НОК'],
      uz: ["Katta sonning karralilarini yozing", "Har birini ikkinchisiga bo'lib tekshiring", "Birinchi mos kelgani EKUK"],
      en: ['List the multiples of the larger number', 'Test each by dividing by the other', 'The first that fits is the LCM'],
    },
    m1_no: {
      ru: 'Если одно число делится на другое, НОК равен большему: проверять нечего.',
      uz: "Agar bir son ikkinchisiga bo'linsa, EKUK kattasiga teng: tekshirish shart emas.",
      en: 'If one number divides the other, the LCM is the larger one: nothing to check.',
    },
  },
};

// ============================================================
// СЦЕНЫ УРОКА: остановка у школы. На хуке вопрос, в итоге ответ.
// ============================================================

// Автобус: узнаётся силуэтом, номер маршрута = интервал в минутах.
const Bus = ({ x, y, w = 96, tone = '#7ECBE6', dark = '#019ACB', label }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x="0" y="0" width={w} height="30" rx="6" fill={tone}/>
    <rect x="0" y="0" width={w} height="9" rx="6" fill={dark} opacity="0.35"/>
    {[8, 28, 48].filter((wx) => wx + 16 < w).map((wx) => (
      <rect key={wx} x={wx} y="6" width="16" height="11" rx="2" fill="#DCEDF5"/>
    ))}
    <rect x={w - 22} y="6" width="16" height="11" rx="2" fill="#DCEDF5"/>
    <rect x={w - 34} y="19" width="28" height="8" rx="3" fill="#FFFFFF" opacity="0.85"/>
    <text x={w - 20} y="26" textAnchor="middle" fill={dark}
      fontFamily="'JetBrains Mono', monospace" fontSize="7" fontWeight="700">{label}</text>
    <circle cx="18" cy="31" r="5" fill="#3B3730"/>
    <circle cx={w - 18} cy="31" r="5" fill="#3B3730"/>
  </g>
);

const HookScene = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="d6sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F9F4EB"/><stop offset="100%" stopColor="#EFE7D8"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="400" height="154" fill="url(#d6sky)"/>

    {/* Школа на заднем плане */}
    <g opacity="0.5">
      <rect x="14" y="26" width="86" height="60" rx="4" fill="#E5DAC6"/>
      <path d="M10 26 L57 6 L104 26 Z" fill="#D2A96F"/>
      {[24, 44, 64].map((wx) => <rect key={wx} x={wx} y="42" width="14" height="16" rx="2" fill="#DCEDF5"/>)}
      <rect x="48" y="64" width="18" height="22" rx="2" fill="#C9A472"/>
    </g>

    {/* Навес остановки и табло расписания */}
    <g>
      <rect x="128" y="20" width="150" height="7" rx="3" fill="#C9A472"/>
      <rect x="132" y="27" width="4" height="60" fill="#B08A57"/>
      <rect x="270" y="27" width="4" height="60" fill="#B08A57"/>
      <rect x="150" y="34" width="106" height="44" rx="5" fill="#FFFDF7" stroke="#DCCFB6"/>
      <g className="d6-clock">
        <circle cx="170" cy="56" r="12" fill="#FFFFFF" stroke="#C9C7C2"/>
        <path d="M170 56 v-8" stroke="#3B3730" strokeWidth="1.6" strokeLinecap="round"/>
        <path d="M170 56 l6 4" stroke="#FF4F28" strokeWidth="1.6" strokeLinecap="round"/>
      </g>
      <text x="214" y="52" textAnchor="middle" fill="#019ACB"
        fontFamily="'JetBrains Mono', monospace" fontSize="13" fontWeight="700">12</text>
      <text x="214" y="70" textAnchor="middle" fill="#C99B3A"
        fontFamily="'JetBrains Mono', monospace" fontSize="13" fontWeight="700">18</text>
      <text x="244" y="52" textAnchor="middle" fill="#8A8883"
        fontFamily="'Manrope', system-ui, sans-serif" fontSize="8">min</text>
      <text x="244" y="70" textAnchor="middle" fill="#8A8883"
        fontFamily="'Manrope', system-ui, sans-serif" fontSize="8">min</text>
    </g>

    {/* Два автобуса уезжают */}
    <g className="d6-bus-a"><Bus x={286} y={62} w={100} tone="#7ECBE6" dark="#019ACB" label="12"/></g>
    <g className="d6-bus-b"><Bus x={296} y={98} w={92} tone="#F5C77E" dark="#C99B3A" label="18"/></g>

    {/* Люди на остановке */}
    <Person x={168} ground={140} head={10} shirt="#7ECBE6" hair="#3E3128"/>
    <Person x={218} ground={140} head={10} shirt="#F5C77E" hair="#5A4636"/>

    {/* Дорога */}
    <rect x="0" y="140" width="400" height="14" fill="#CFC7B8"/>
    <g className="d6-road">
      {[10, 60, 110, 160, 210, 260, 310, 360].map((rx) => (
        <rect key={rx} x={rx} y="146" width="26" height="2.5" rx="1.2" fill="#FFFFFF" opacity="0.8"/>
      ))}
    </g>
  </svg>
);

// Итог: 36-я минута, оба автобуса снова у остановки.
const FinalScene = () => (
  <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
    <rect x="0" y="0" width="400" height="92" fill="#F9F4EB"/>
    <text x="200" y="16" textAnchor="middle" fill="#1F7A4D"
      fontFamily="'JetBrains Mono', monospace" fontSize="13" fontWeight="700">36 min</text>
    <g><Bus x={30} y={26} w={130} tone="#7ECBE6" dark="#019ACB" label="12"/></g>
    <g><Bus x={230} y={26} w={130} tone="#F5C77E" dark="#C99B3A" label="18"/></g>
    <rect x="0" y="66" width="400" height="26" fill="#CFC7B8"/>
    <Person x={186} ground={66} head={7} shirt="#7ECBE6" hair="#3E3128" arms={false}/>
    <Person x={210} ground={66} head={7} shirt="#F5C77E" hair="#5A4636" arms={false}/>
  </svg>
);

// ============================================================
// БЛОКИ ЭКРАНОВ
// ============================================================
const MulRow = ({ list, hit = null, tone = 'a', label }) => (
  <div className="d6-row">
    {label && <span className="d6-label">{label}</span>}
    <span className="d6-chips">
      {list.map((n) => (
        <i key={n} className={'d6-chip d6-chip-' + tone + (hit === n ? ' d6-chip-hit' : '')}>{n}</i>
      ))}
      <i className="d6-chip d6-chip-more">…</i>
    </span>
  </div>
);

const RecallBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_recall;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d6-stage">
        <MulRow list={c.row12} label="12" tone="a"/>
        {step >= 1 && <MulRow list={c.row18} label="18" tone="b"/>}
      </div>
      {step >= 2 && (
        <div className="frame-success fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
        </div>
      )}
    </div>
  );
};

// Ядро: одна линия времени, сверху кратные 12, снизу 18, встреча на 36.
const CoreBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_core;
  const max = 76;
  const at = (n) => `${(n / max) * 100}%`;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d6-stage">
        <div className="d6-axis">
          {[12, 24, 36, 48, 60, 72].map((n) => (
            <span key={n} className={'d6-mark d6-mark-a' + (step >= 0 ? ' d6-on' : '') + (step >= 2 && n === 36 ? ' d6-meet' : '')}
              style={{ left: at(n) }}>{n}</span>
          ))}
          <span className="d6-line"/>
          {[18, 36, 54, 72].map((n) => (
            <span key={n} className={'d6-mark d6-mark-b' + (step >= 1 ? ' d6-on' : '') + (step >= 2 && n === 36 ? ' d6-meet' : '')}
              style={{ left: at(n) }}>{n}</span>
          ))}
          {step >= 2 && <span className="d6-flag" style={{ left: at(36) }}/>}
        </div>
      </div>
      {step >= 2 && (
        <div className="frame-success fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
        </div>
      )}
    </div>
  );
};

const FactBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_fact;
  const line = (o) => (
    <p className="d6-fact"><b>{o.n}</b> = {o.f.map((f, i) => <i key={i} className="d6-f">{f}</i>)}</p>
  );
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d6-stage">
        {line(c.a)}
        {step >= 1 && line(c.b)}
        {step >= 2 && (
          <p className="d6-fact d6-fact-res">
            <b>36</b> = {c.lcm.map((f, i) => <i key={i} className="d6-f d6-f-on">{f}</i>)}
          </p>
        )}
      </div>
      {step >= 2 && (
        <div className="frame-success fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
        </div>
      )}
    </div>
  );
};

const SolveBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_solve;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink3 }}>{t(c.lead)}</p>
      <div className="frame fade-up delay-1 d6-stage">
        <p className="d6-big">36</p>
        <div className="d6-lines">
          {c.rows.map((r, i) => (
            <p key={i} className={'d6-line-t' + (step >= i ? ' d6-line-on' : '')}>{t(r)}</p>
          ))}
        </div>
      </div>
      {step >= 2 && (
        <div className="frame-success fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
        </div>
      )}
    </div>
  );
};

const EdgeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_edge;
  const rows = [c.line_1, c.line_2, c.line_3, c.line_4];
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d6-stage">
        <div className="d6-eq">
          {rows.map((r, i) => (
            <p key={i} className={'d6-eqline' + (step >= Math.floor(i / 2) ? ' d6-line-on' : '') + (i >= 2 ? ' d6-eqline-res' : '')}>{t(r)}</p>
          ))}
        </div>
      </div>
      {step >= 2 && (
        <div className="frame-tip fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
        </div>
      )}
    </div>
  );
};

// ============================================================
// ЭКРАН 4 — «сначала показали, потом сам»
// ============================================================
const MUL = (n, k) => Array.from({ length: k }, (_, i) => n * (i + 1));

const ToolScreen = ({ screen, totalScreens, onNext, onPrev, onAnswer, storedAnswer }) => {
  const c = CONTENT.s_tool;
  const t = useT();
  const lang = useLang();
  const audio = useAudio([{ id: 's_tool_intro', text: pickL(c.audio.intro, lang), trigger: 'on_mount', waits_for: null }]);
  const [phase, setPhase] = useState(storedAnswer ? 'play' : 'demo');
  const [shown, setShown] = useState(0);
  const [picked, setPicked] = useState(null);
  const firstTryRef = useRef(true);
  const timersRef = useRef([]);
  const solved = picked === c.play_correct;
  const done = shown >= 2;

  const say = (node, id) => {
    if (audio.muted || !node) return;
    const e = getAudioEngine();
    if (e) e.pushOneOff(pickL(node, lang), undefined, id);
  };

  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (phase !== 'demo' || done) return undefined;
    timersRef.current.push(setTimeout(() => setShown((v) => v + 1), 1400));
    if (shown === 1) timersRef.current.push(setTimeout(() => say(c.audio.demo, 's_tool_demo'), 1600));
    return () => timersRef.current.forEach(clearTimeout);
    /* eslint-disable-next-line */
  }, [phase, shown, done]);

  const toPlay = () => { setPhase('play'); setPicked(null); say(c.audio.play, 's_tool_play'); };

  const answer = (i) => {
    if (solved) return;
    setPicked(i);
    if (i !== c.play_correct) { firstTryRef.current = false; say(c.audio.wrong, 's_tool_wrong'); return; }
    say(c.audio.ok, 's_tool_ok');
    if (onAnswer) {
      onAnswer({
        stage: null, screenIdx: screen, question: pickL(c.play_ask, lang),
        correctAnswer: c.play_opts[c.play_correct], studentAnswer: c.play_opts[i],
        correct: firstTryRef.current, firstTry: firstTryRef.current, solved: true,
      });
    }
  };

  const navContent = (
    <>
      <NavBack onPrev={onPrev} label={<BackLabel/>}/>
      <NavNext disabled={navLocked(!solved || !audio.canAdvance)} label={<NextLabel/>} onClick={onNext}/>
    </>
  );

  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div className="rv-col">
        <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
        <div className={'d6-banner fade-up delay-1' + (phase === 'play' ? ' d6-banner-play' : '')}>
          {t(phase === 'demo' ? c.demo_banner : c.play_banner)}
        </div>

        <div className="frame fade-up delay-1 d6-stage">
          {phase === 'demo' ? (
            <>
              <MulRow list={MUL(c.demo_a, 3)} label={String(c.demo_a)} tone="a" hit={done ? 12 : null}/>
              {shown >= 1 && <MulRow list={MUL(c.demo_b, 2)} label={String(c.demo_b)} tone="b" hit={done ? 12 : null}/>}
              <p className={'body d6-verdict' + (done ? ' d6-verdict-on' : '')}>{done ? t(c.demo_note) : ''}</p>
            </>
          ) : (
            <>
              <p className="body" style={{ margin: '0 0 10px', fontWeight: 600 }}>{t(c.play_ask)}</p>
              <div className="sv-opts">
                {c.play_opts.map((o, i) => (
                  <button key={o} className={'option'
                    + (solved && i === c.play_correct ? ' option-correct' : '')
                    + (!solved && picked === i ? ' option-picked-wrong' : '')}
                  disabled={solved} onClick={() => answer(i)}>{o}</button>
                ))}
              </div>
              {picked !== null && !solved && <HintBlock show>{t(c.play_wrong[picked] || c.play_ok)}</HintBlock>}
              {solved && (
                <FeedbackBlock show isCorrect>
                  <p className="body" style={{ margin: 0 }}>{t(c.play_ok)}</p>
                </FeedbackBlock>
              )}
            </>
          )}
        </div>

        {phase === 'demo' && (
          <div className="d6-acts fade-up">
            <button className="d6-btn" disabled={!done} onClick={() => setShown(0)}>{t(c.again)}</button>
            <button className="d6-btn d6-btn-go" disabled={!done} onClick={toPlay}>{t(c.to_play)}</button>
          </div>
        )}

        <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps}
          note={CONTENT.s_methods.m1_no} active={phase === 'play' ? 3 : shown}/>
      </div>
    </Stage>
  );
};

// ============================================================
// ОБЁРТКИ ЭКРАНОВ
// ============================================================
const ScreenHook = (props) => (
  <HookScreen {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_hook} sceneNode={<HookScene/>}/>
);
const ScreenRecall = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_recall} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <RecallBody step={step}/>}/>
);
const ScreenCore = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_core} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <CoreBody step={step}/>}/>
);
const ScreenTool = (props) => <ToolScreen {...props} totalScreens={TOTAL_SCREENS}/>;
const ScreenFact = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_fact} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <FactBody step={step}/>}/>
);
const ScreenSolve = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_solve} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <SolveBody step={step}/>}/>
);
const ScreenEdge = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_edge} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <EdgeBody step={step}/>}/>
);
const ScreenRule = (props) => (
  <RuleScreen {...props} screenContent={CONTENT.s_rule} totalScreens={TOTAL_SCREENS}
    exampleNode={<div className="d6-rule-ex"><MulRow list={[12, 24, 36]} hit={36} tone="a" label="12"/><MulRow list={[18, 36]} hit={36} tone="b" label="18"/></div>}/>
);

const methodAside = (
  <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps} note={CONTENT.s_methods.m1_no}/>
);

const ScreenFirst = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_first} asideNode={methodAside}/>
);
const ScreenLcm = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_lcm} asideNode={methodAside}/>
);
const ScreenBins = (props) => (
  <Classify {...props} screenContent={CONTENT.s_bins} totalScreens={TOTAL_SCREENS}/>
);
const ScreenError = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_error}/>
);

const DaysRow = () => (
  <div className="d6-days">
    {CONTENT.s_task.days.map((d) => (
      <span key={d} className="d6-day"><b>{d}</b></span>
    ))}
  </div>
);

const ScreenTask = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_task} figureNode={() => <DaysRow/>}/>
);

const ScreenFinal = (props) => (
  <FinalPanel {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_final}
    factNode={<FactCard badge={FB_SCI} anim={<AnimDigits/>} text={CONTENT.s_final.fact}/>}/>
);

const SummaryCards = () => {
  const t = useT();
  const c = CONTENT.s14;
  return (
    <div className="frame sm-card">
      <p className="sm-card-h">{t(c.memo_title)}</p>
      <div className="mm-grid">
        {[[c.memo_q1, c.memo_a1], [c.memo_q2, c.memo_a2], [c.memo_q3, c.memo_a3]].map((row, i) => (
          <span className="mm-row" key={i}>
            <span className="mm-q">{t(row[0])}</span>
            <span className="mm-a">{t(row[1])}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

const Screen14 = (props) => (
  <SummaryScreen {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s14}
    sceneNode={<FinalScene/>} cards={<SummaryCards/>}/>
);

// ============================================================
// CSS УРОКА
// ============================================================
const LESSON_STYLES = `
.d6-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(8px, 1.6vw, 12px); padding: clamp(12px, 2.4vw, 18px) !important; }

/* Ряды кратных */
.d6-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: center; }
.d6-label { min-width: 34px; font-family: 'JetBrains Mono', monospace; font-size: clamp(14px, 2.6vw, 17px); font-weight: 700; color: #8A8883; text-align: right; }
.d6-chips { display: flex; flex-wrap: wrap; gap: 5px; }
.d6-chip { font-style: normal; display: grid; place-items: center; min-width: 34px; height: 30px; padding: 0 8px; border-radius: 9px; border: 1px solid #E9E3D9; background: #FFFFFF; font-family: 'JetBrains Mono', monospace; font-size: clamp(13px, 2.4vw, 16px); font-weight: 700; transition: all 380ms linear; }
.d6-chip-a { color: #019ACB; }
.d6-chip-b { color: #C99B3A; }
.d6-chip-more { color: #C9C7C2; border-style: dashed; }
.d6-chip-hit { background: #E3F0E8; border-color: #1F7A4D; color: #1F7A4D; box-shadow: 0 0 0 3px rgba(31, 122, 77, 0.16); }

/* Линия времени */
.d6-axis { position: relative; width: 100%; height: 190px; }
.d6-line { position: absolute; left: 0; right: 0; top: 96px; height: 2px; background: #DCCFB6; }
.d6-mark { position: absolute; transform: translateX(-50%); min-width: 34px; padding: 6px 9px; border-radius: 8px; font-family: 'JetBrains Mono', monospace; font-size: clamp(13px, 2.6vw, 17px); font-weight: 700; opacity: 0; transition: opacity 380ms linear, background-color 380ms linear, color 380ms linear; }
.d6-mark-a { top: 40px; color: #019ACB; background: #E7F5FA; }
.d6-mark-b { top: 118px; color: #C99B3A; background: #FBF3D6; }
.d6-on { opacity: 1; }
.d6-meet { background: #1F7A4D; color: #FFFFFF; }
.d6-flag { position: absolute; top: 78px; transform: translateX(-50%); width: 3px; height: 40px; background: #1F7A4D; }

/* Простые множители */
.d6-fact { display: flex; align-items: center; gap: 6px; margin: 0; font-family: 'JetBrains Mono', monospace; font-size: clamp(16px, 3vw, 21px); font-weight: 700; }
.d6-fact b { min-width: 40px; text-align: right; }
.d6-f { font-style: normal; padding: 3px 9px; border-radius: 8px; background: #F3EFE6; color: #8A8883; }
.d6-f-on { background: #E3F0E8; color: #1F7A4D; }
.d6-fact-res b { color: #1F7A4D; }

/* Решение и связь */
.d6-big { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: clamp(32px, 6.4vw, 44px); font-weight: 700; color: #1F7A4D; }
.d6-lines { display: flex; flex-direction: column; gap: 5px; align-items: center; }
.d6-line-t { margin: 0; font-size: clamp(14px, 2.4vw, 17px); color: #494550; opacity: 0; transition: opacity 380ms linear; }
.d6-line-on { opacity: 1; }
.d6-eq { display: flex; flex-direction: column; gap: 6px; align-items: center; }
.d6-eqline { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: clamp(15px, 2.8vw, 19px); font-weight: 700; color: #494550; opacity: 0; transition: opacity 380ms linear; }
.d6-eqline-res { color: #1F7A4D; }

/* Экран 4 */
.d6-banner { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; font-size: clamp(14px, 2.4vw, 16px); font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 6px 13px; }
.d6-banner-play { color: #1F7A4D; background: #E3F0E8; }
.d6-verdict { margin: 0; min-height: 22px; opacity: 0; transition: opacity 420ms linear; text-align: center; }
.d6-verdict-on { opacity: 1; }
.d6-acts { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.d6-btn { height: 40px; padding: 0 18px; border-radius: 12px; border: 1px solid #E9E3D9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(14px, 2.2vw, 16px); font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.d6-btn:disabled { opacity: 0.45; cursor: default; }
.d6-btn-go { border-color: #FF4F28; color: #FF4F28; }
.d6-btn-go:hover:not(:disabled) { background: #FFE8E1; }

/* Правило и задача */
.d6-rule-ex { display: flex; flex-direction: column; gap: 6px; }
.d6-days { display: flex; justify-content: center; gap: 12px; }
.d6-day { min-width: 54px; padding: 8px 12px; border-radius: 12px; border: 1px solid #DCCFB6; background: #FFFDF7; text-align: center; }
.d6-day b { font-family: 'JetBrains Mono', monospace; font-size: clamp(18px, 3.4vw, 23px); }

/* Движение сцены: автобусы трогаются, стрелка часов идёт, разметка бежит */
.d6-bus-a { animation: d6BusA 5200ms ease-in-out infinite; }
.d6-bus-b { animation: d6BusB 5200ms ease-in-out infinite; }
@keyframes d6BusA { 0%, 55% { transform: none; } 85%, 100% { transform: translateX(26px); } }
@keyframes d6BusB { 0%, 62% { transform: none; } 88%, 100% { transform: translateX(20px); } }
.d6-clock { transform-origin: 170px 56px; animation: d6Tick 4000ms steps(8, end) infinite; }
@keyframes d6Tick { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.d6-road { animation: d6Road 2600ms linear infinite; }
@keyframes d6Road { from { transform: translateX(0); } to { transform: translateX(-50px); } }
@media (prefers-reduced-motion: reduce) { .d6-bus-a, .d6-bus-b, .d6-clock, .d6-road { animation: none; } }

@media (max-width: 639.98px) {
  .d6-axis { height: 200px; }
  .d6-mark { font-size: 10px; padding: 2px 4px; min-width: 20px; }
}
`;

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function LcmLesson({
  studentName, lang: langProp, ttsApiBase, voiceGender,
  correctSoundUrl, wrongSoundUrl, aiGradingEndpoint, onFinished,
}) {
  useMobileZoom();
  const isPreview = (langProp === undefined || langProp === null);
  const [previewLang, setPreviewLang] = useState('uz');
  const lang = langProp || previewLang;
  const safeName = studentName || tri(lang, 'Ученик', "O'quvchi", 'Student');
  configureLesson({
    ttsApiBase: ttsApiBase || '', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '',
    aiGradingEndpoint: aiGradingEndpoint || '', studentName: safeName, voiceGender: voiceGender || 'm',
    navLock: false,
  });

  const [current, setCurrent] = useState(Math.min(PREVIEW_START, TOTAL_SCREENS - 1));
  const [answers, setAnswers] = useState([]);

  const screens = [ScreenHook, ScreenRecall, ScreenCore, ScreenTool, ScreenFact, ScreenSolve, ScreenEdge,
    ScreenRule, ScreenFirst, ScreenLcm, ScreenBins, ScreenError, ScreenTask, ScreenFinal, Screen14];
  const CurrentScreen = screens[current];

  const finishLesson = () => {
    if (!onFinished) return;
    onFinished({
      lessonId: LESSON_META.lessonId,
      lessonTitle: LESSON_META.lessonTitle,
      totalQuestions: null, correctAnswers: null, scorePercent: null,
      finalScore: null, finalTotal: null, passed: null,
      answers: answers.filter(Boolean),
    });
  };

  return (
    <LangContext.Provider value={lang}>
      <div className="lesson-root">
        <style>{STYLES}</style>
        {isPreview && (
          <div className="g6-lang-switch">
            {['ru', 'uz', 'en'].map((l) => (
              <button key={l} className={'btn-ghost' + (l === lang ? ' is-on' : '')}
                onClick={() => setPreviewLang(l)}>{l.toUpperCase()}</button>
            ))}
          </div>
        )}
        <CurrentScreen
          screen={current}
          totalScreens={TOTAL_SCREENS}
          storedAnswer={answers[current]}
          onAnswer={(data) => setAnswers((prev) => { const next = [...prev]; next[current] = data; return next; })}
          onNext={() => setCurrent((v) => Math.min(v + 1, TOTAL_SCREENS - 1))}
          onPrev={() => setCurrent((v) => Math.max(v - 1, 0))}
          onReset={() => { setAnswers([]); setCurrent(0); }}
          finishLesson={finishLesson}
        />
      </div>
    </LangContext.Provider>
  );
}
