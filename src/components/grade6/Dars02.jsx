// ============================================================
// 6 КЛАСС, УРОК 2 «Признаки делимости на 2, 5 и 10»
// Собран по context/GRADE6_ETALON.md на общем слое ./screens.jsx.
// Здесь только данные урока, его две сцены и экраны с его математикой.
//
// Сюжет блока: школа после уроков. Урок 1 — турнир в спортзале, урок 2 —
// школьный буфет после турнира. Азиз и Дилноза те же.
// ============================================================

// `React` в этом файле не вызывается напрямую, но импорт обязателен: LMS
// компилирует jsx в КЛАССИЧЕСКОМ режиме (React.createElement).
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
  lessonId: 'grade6-02',
  lessonTitle: {
    ru: 'Признаки делимости на 2, 5 и 10',
    uz: "2, 5 va 10 ga bo'linish alomatlari",
    en: 'Divisibility rules for 2, 5 and 10',
  },
};

const SCREEN_META = [
  { id: 's_hook',    type: 'hook',        template: 'HookScreen',    scored: false, scope: 'hook' },     //  1 bufet: hisobni bo'lish
  { id: 's_recall',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  2 juft va toq sonlar
  { id: 's_core',    type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  3 oxirgi raqam hal qiladi
  { id: 's_tool',    type: 'exploration', template: 'custom',        scored: false, scope: null },       //  4 USUL 1: 2 ga bo'linadimi
  { id: 's_five',    type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  5 USUL 2: 5 ga bo'linish
  { id: 's_solve',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  6 birga yechamiz: 40
  { id: 's_edge',    type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  7 chegara: 3 ga ishlamaydi
  { id: 's_rule',    type: 'rule',        template: 'RuleScreen',    scored: false, scope: null },       //  8 QOIDA + xukka qaytish
  { id: 's_names',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, //  9 nimaga bo'linadi x3
  { id: 's_two',     type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 10 2 ga bo'linadimi x4
  { id: 's_bins',    type: 'test',        template: 'Classify',      scored: true,  scope: 'practice' }, // 11 savatlar: 5 ga
  { id: 's_error',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_task',    type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 13 MASALA: bufet hisobi
  { id: 's_final',   type: 'test',        template: 'FinalPanel',    scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',       type: 'summary',     template: 'SummaryScreen', scored: false, scope: null },       // 15 xulosa
];

registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

// ============================================================
// КОНТЕНТ
// ============================================================
const CONTENT = {
  s_hook: {
    eyebrow: { ru: 'Зачем это нужно', uz: 'Bu nimaga kerak', en: 'Why you need this' },
    title: {
      ru: 'Счёт в буфете: разделится поровну?',
      uz: "Bufetdagi hisob: teng bo'linadimi?",
      en: 'The snack bar bill: will it split evenly?',
    },
    lead: {
      ru: 'После турнира команда зашла в буфет. Общий счёт — 36 тысяч сумов.',
      uz: "Turnirdan keyin komanda bufetga kirdi. Umumiy hisob — 36 ming so'm.",
      en: 'After the tournament the team went to the snack bar. The bill is 36 thousand soum.',
    },
    voice_a: {
      ru: 'Азиз: сейчас разделю в столбик.',
      uz: "Aziz: hozir ustunda bo'lib chiqaman.",
      en: 'Aziz: let me divide it in a column.',
    },
    voice_b: {
      ru: 'Дилноза: я уже вижу ответ.',
      uz: "Dilnoza: men javobni allaqachon ko'rib turibman.",
      en: 'Dilnoza: I can already see the answer.',
    },
    ask: {
      ru: 'Можно узнать, разделится ли счёт поровну, не выполняя деления?',
      uz: "Bo'lishni bajarmasdan hisob teng bo'linishini bilish mumkinmi?",
      en: 'Can you tell whether the bill splits evenly without doing the division?',
    },
    options: [
      { ru: 'Нет, надо делить', uz: "Yo'q, bo'lish kerak", en: 'No, you have to divide' },
      { ru: 'Да, по виду числа', uz: "Ha, sonning ko'rinishidan", en: 'Yes, from the look of the number' },
    ],
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: "Variantlardan birini bosing. Javobni dars davomida tekshiramiz.",
      en: 'Tap one of the options. We will check the answer during the lesson.',
    },
    audio: {
      intro: {
        ru: [
          'После турнира команда зашла в буфет. Общий счёт тридцать шесть тысяч сумов.',
          'Азиз собирается делить в столбик, а Дилноза говорит, что уже видит ответ. Как ты думаешь, можно ли узнать, разделится ли счёт поровну, не выполняя деления? Выбери ответ. Проверим его по ходу урока.',
        ],
        uz: [
          "Turnirdan keyin komanda bufetga kirdi. Umumiy hisob o'ttiz olti ming so'm.",
          "Aziz ustunda bo'lmoqchi, Dilnoza esa javobni allaqachon ko'rib turganini aytadi. Sizningcha, bo'lishni bajarmasdan hisob teng bo'linishini bilish mumkinmi? Javobni tanlang. Uni dars davomida tekshiramiz.",
        ],
        en: [
          'After the tournament the team went to the snack bar. The bill is thirty six thousand soum.',
          'Aziz is about to divide in a column, and Dilnoza says she can already see the answer. What do you think, can you tell whether the bill splits evenly without doing the division? Choose an answer. We will check it during the lesson.',
        ],
      },
    },
  },

  // Экран 2 — ВСПОМНИМ. Чётные и нечётные из пятого класса: опора под признак.
  s_recall: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslaymiz', en: 'Recall' },
    title: { ru: 'Чётное и нечётное', uz: 'Juft va toq', en: 'Even and odd' },
    cap_even: { ru: '6 стульев — все парами', uz: "6 stul — hammasi juft bo'lib", en: '6 chairs, all in pairs' },
    cap_odd: { ru: '7 стульев — один без пары', uz: "7 stul — bittasi juftsiz", en: '7 chairs, one without a pair' },
    done: {
      ru: 'Чётное число делится на 2 без остатка. Нечётное оставляет один лишний.',
      uz: "Juft son 2 ga qoldiqsiz bo'linadi. Toq sonda esa bittasi ortib qoladi.",
      en: 'An even number divides by 2 with no remainder. An odd one leaves one over.',
    },
    audio: {
      ru: [
        'Это вы уже знаете. Ставим шесть стульев парами. Пар получилось три, лишних нет.',
        'Теперь семь стульев. Три пары и один стул без пары. Шесть чётное, семь нечётное.',
        'Запомним. Чётное число делится на два без остатка, нечётное оставляет один лишний.',
      ],
      uz: [
        "Buni siz allaqachon bilasiz. Olti stulni juftlab qo'yamiz. Uchta juft chiqdi, ortiqchasi yo'q.",
        "Endi yetti stul. Uchta juft va bitta juftsiz stul. Olti juft son, yetti toq son.",
        "Eslab qolamiz. Juft son ikkiga qoldiqsiz bo'linadi, toq son esa bittasini ortiq qoldiradi.",
      ],
      en: [
        'You already know this. We place six chairs in pairs. Three pairs came out, nothing left over.',
        'Now seven chairs. Three pairs and one chair without a pair. Six is even, seven is odd.',
        'Let us remember. An even number divides by two with no remainder, an odd one leaves one over.',
      ],
    },
  },

  // Экран 3 — ЯДРО. Решает ОДНА цифра, и это видно на длинном числе.
  s_core: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Решает последняя цифра', uz: 'Oxirgi raqam hal qiladi', en: 'The last digit decides' },
    number: '12 345 678',
    cap_all: { ru: 'Восемь цифр — делить долго', uz: "Sakkiz raqam — bo'lish uzoq", en: 'Eight digits, dividing takes long' },
    cap_last: { ru: 'Хватает одной', uz: 'Bittasi yetadi', en: 'One is enough' },
    done: {
      ru: 'Любое число это десятки плюс последняя цифра. Десятки делятся на 2 всегда, поэтому ответ решает только последняя цифра.',
      uz: "Har qanday son bu o'nliklar va oxirgi raqam. O'nliklar 2 ga doim bo'linadi, shuning uchun javobni faqat oxirgi raqam hal qiladi.",
      en: 'Any number is tens plus the last digit. Tens always divide by 2, so only the last digit decides the answer.',
    },
    audio: {
      ru: [
        'Возьмём длинное число. Двенадцать миллионов триста сорок пять тысяч шестьсот семьдесят восемь. Делить такое в столбик долго.',
        'Гасим цифры одну за другой. Остаётся восьмёрка, и её достаточно: восемь чётное, значит и всё число делится на два.',
        'Почему так. Любое число это десятки плюс последняя цифра. Десятки на два делятся всегда, поэтому весь ответ решает последняя цифра.',
      ],
      uz: [
        "Uzun son olamiz. O'n ikki million uch yuz qirq besh ming olti yuz yetmish sakkiz. Bunday sonni ustunda bo'lish uzoq.",
        "Raqamlarni birin ketin o'chiramiz. Sakkiz qoladi va shuning o'zi yetarli: sakkiz juft, demak butun son ikkiga bo'linadi.",
        "Nega shunday. Har qanday son bu o'nliklar va oxirgi raqam. O'nliklar ikkiga doim bo'linadi, shuning uchun javobni oxirgi raqam hal qiladi.",
      ],
      en: [
        'Take a long number. Twelve million three hundred forty five thousand six hundred seventy eight. Dividing it in a column takes long.',
        'We fade the digits one by one. The eight is left, and it is enough: eight is even, so the whole number divides by two.',
        'Here is why. Any number is tens plus the last digit. Tens always divide by two, so the last digit decides the whole answer.',
      ],
    },
  },

  // Экран 4 — СПОСОБ 1, «показ, потом сам».
  s_tool: {
    eyebrow: { ru: 'Смотри и повтори', uz: 'Qarang va takrorlang', en: 'Watch, then try' },
    title: { ru: 'Делится ли на 2', uz: "2 ga bo'linadimi", en: 'Does it divide by 2' },
    demo_banner: { ru: 'Смотри — покажу на примере', uz: "Qarang — misolda ko'rsataman", en: 'Watch — I will show an example' },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    step_num: { ru: 'Число', uz: 'Son', en: 'Number' },
    step_last: { ru: 'Последняя цифра', uz: 'Oxirgi raqam', en: 'Last digit' },
    yes: { ru: 'Делится на 2', uz: "2 ga bo'linadi", en: 'Divides by 2' },
    no: { ru: 'Не делится на 2', uz: "2 ga bo'linmaydi", en: 'Does not divide by 2' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    demo_note: {
      ru: 'Последняя цифра 6, она чётная. Значит 36 делится на 2.',
      uz: "Oxirgi raqam 6, u juft. Demak 36 soni 2 ga bo'linadi.",
      en: 'The last digit is 6 and it is even. So 36 divides by 2.',
    },
    play_ask: { ru: 'Делится ли 47 на 2?', uz: "47 soni 2 ga bo'linadimi?", en: 'Does 47 divide by 2?' },
    play_ok: {
      ru: 'Верно. Последняя цифра 7, она нечётная: 47 на 2 не делится, один остаётся лишним.',
      uz: "To'g'ri. Oxirgi raqam 7, u toq: 47 soni 2 ga bo'linmaydi, bittasi ortib qoladi.",
      en: 'Right. The last digit is 7 and it is odd: 47 does not divide by 2, one is left over.',
    },
    play_wrong: {
      ru: 'Посмотри на последнюю цифру: 7 нечётная. Пары из 47 не собираются, один остаётся.',
      uz: "Oxirgi raqamga qarang: 7 toq. 47 dan juftlar to'liq yig'ilmaydi, bittasi qoladi.",
      en: 'Look at the last digit: 7 is odd. Pairs do not come out even from 47, one is left.',
    },
    audio: {
      intro: {
        ru: 'Способ первый. Смотрим на последнюю цифру и сравниваем её с чётными. Покажу на числе тридцать шесть.',
        uz: "Birinchi usul. Oxirgi raqamga qaraymiz va uni juft raqamlar bilan solishtiramiz. O'ttiz olti sonida ko'rsataman.",
        en: 'Method one. Look at the last digit and compare it with the even ones. I will show it on thirty six.',
      },
      demo: {
        ru: 'Последняя цифра шесть. Шесть чётная, значит тридцать шесть делится на два.',
        uz: "Oxirgi raqam olti. Olti juft, demak o'ttiz olti ikkiga bo'linadi.",
        en: 'The last digit is six. Six is even, so thirty six divides by two.',
      },
      play: {
        ru: 'Теперь ваша очередь. Число сорок семь. Делится ли оно на два?',
        uz: "Endi sizning navbatingiz. Son qirq yetti. U ikkiga bo'linadimi?",
        en: 'Now it is your turn. The number is forty seven. Does it divide by two?',
      },
      ok: {
        ru: 'Верно. Последняя цифра семь, она нечётная, поэтому сорок семь на два не делится.',
        uz: "To'g'ri. Oxirgi raqam yetti, u toq, shuning uchun qirq yetti ikkiga bo'linmaydi.",
        en: 'Right. The last digit is seven and it is odd, so forty seven does not divide by two.',
      },
      wrong: {
        ru: 'Посмотрите на последнюю цифру. Семь нечётная, пары не собираются, один остаётся лишним.',
        uz: "Oxirgi raqamga qarang. Yetti toq, juftlar yig'ilmaydi, bittasi ortib qoladi.",
        en: 'Look at the last digit. Seven is odd, the pairs do not come out, one is left over.',
      },
    },
  },

  // Экран 5 — СПОСОБ 2: пятёрка.
  s_five: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'А если платят пятеро', uz: "Agar besh kishi to'lasa", en: 'And if five are paying' },
    cap_row: { ru: 'Цены буфета', uz: 'Bufet narxlari', en: 'Snack bar prices' },
    done: {
      ru: 'На 5 делятся числа с последней цифрой 0 или 5. На 10 — только с нулём.',
      uz: "Oxirgi raqami 0 yoki 5 bo'lgan sonlar 5 ga bo'linadi. 10 ga esa faqat noli borlar.",
      en: 'Numbers ending in 0 or 5 divide by 5. Only those ending in zero divide by 10.',
    },
    audio: {
      ru: [
        'Теперь платят пятеро. Смотрим на цены буфета: пятнадцать, двадцать четыре, тридцать, сорок два, сорок пять.',
        'Загораются те, что делятся на пять. Пятнадцать, тридцать, сорок пять. У всех на конце ноль или пятёрка.',
        'А на десять делится только тридцать. У десятки требование строже: на конце обязательно ноль.',
      ],
      uz: [
        "Endi besh kishi to'laydi. Bufet narxlariga qaraymiz: o'n besh, yigirma to'rt, o'ttiz, qirq ikki, qirq besh.",
        "Beshga bo'linadiganlari yonadi. O'n besh, o'ttiz, qirq besh. Hammasining oxirida nol yoki besh turibdi.",
        "O'nga esa faqat o'ttiz bo'linadi. O'nning talabi qattiqroq: oxirida albatta nol bo'lishi kerak.",
      ],
      en: [
        'Now five people are paying. Look at the snack bar prices: fifteen, twenty four, thirty, forty two, forty five.',
        'The ones that divide by five light up. Fifteen, thirty, forty five. Each ends in zero or five.',
        'And only thirty divides by ten. Ten is stricter: the number must end in zero.',
      ],
    },
  },

  // Экран 6 — РЕШАЕМ ВМЕСТЕ: одно число, три вопроса.
  s_solve: {
    eyebrow: { ru: 'Решаем вместе', uz: 'Birga yechamiz', en: 'Solving together' },
    title: { ru: 'Счёт 40 тысяч', uz: "Hisob 40 ming", en: 'A bill of 40 thousand' },
    lead: {
      ru: 'Одно число и три вопроса. Ответ на каждый даёт одна и та же цифра.',
      uz: "Bitta son va uchta savol. Har biriga javobni bitta raqamning o'zi beradi.",
      en: 'One number and three questions. The same digit answers each of them.',
    },
    rows: [
      { d: 2, ok: true, text: { ru: '40 : 2 = 20 — делится, последняя цифра 0 чётная', uz: "40 : 2 = 20 — bo'linadi, oxirgi raqam 0 juft", en: '40 : 2 = 20, it divides, the last digit 0 is even' } },
      { d: 5, ok: true, text: { ru: '40 : 5 = 8 — делится, на конце 0', uz: "40 : 5 = 8 — bo'linadi, oxirida 0", en: '40 : 5 = 8, it divides, it ends in 0' } },
      { d: 10, ok: true, text: { ru: '40 : 10 = 4 — делится, на конце 0', uz: "40 : 10 = 4 — bo'linadi, oxirida 0", en: '40 : 10 = 4, it divides, it ends in 0' } },
    ],
    done: {
      ru: 'Ноль на конце сразу даёт три ответа: число делится и на 2, и на 5, и на 10.',
      uz: "Oxiridagi nol darrov uchta javob beradi: son 2 ga ham, 5 ga ham, 10 ga ham bo'linadi.",
      en: 'A zero at the end gives three answers at once: the number divides by 2, by 5 and by 10.',
    },
    audio: {
      ru: [
        'Решаем вместе. Счёт сорок тысяч, и три вопроса про одно число.',
        'Делится ли на два? Последняя цифра ноль, ноль чётный. Сорок разделить на два это двадцать.',
        'Делится ли на пять? На конце ноль, значит да. Сорок разделить на пять это восемь.',
        'Делится ли на десять? На конце ноль, значит да. Сорок разделить на десять это четыре. Один ноль дал три ответа сразу.',
      ],
      uz: [
        "Birga yechamiz. Hisob qirq ming va bitta son haqida uchta savol.",
        "Ikkiga bo'linadimi? Oxirgi raqam nol, nol juft. Qirqni ikkiga bo'lsak yigirma.",
        "Beshga bo'linadimi? Oxirida nol, demak ha. Qirqni beshga bo'lsak sakkiz.",
        "O'nga bo'linadimi? Oxirida nol, demak ha. Qirqni o'nga bo'lsak to'rt. Bitta nol uchta javobni birdan berdi.",
      ],
      en: [
        'Let us solve it together. The bill is forty thousand, and there are three questions about one number.',
        'Does it divide by two? The last digit is zero and zero is even. Forty divided by two is twenty.',
        'Does it divide by five? It ends in zero, so yes. Forty divided by five is eight.',
        'Does it divide by ten? It ends in zero, so yes. Forty divided by ten is four. One zero gave three answers at once.',
      ],
    },
  },

  // Экран 7 — ГРАНИЦА. Признак по последней цифре НЕ универсален.
  s_edge: {
    eyebrow: { ru: 'Где приём не работает', uz: 'Usul qayerda ishlamaydi', en: 'Where the trick stops working' },
    title: { ru: 'А на 3 так нельзя', uz: "3 ga esa bunday bo'lmaydi", en: 'But not for 3' },
    trio: ['12', '13', '21'],
    caps: [
      { ru: '12 : 3 = 4', uz: '12 : 3 = 4', en: '12 : 3 = 4' },
      { ru: '13 : 3 — остаток 1', uz: '13 : 3 — qoldiq 1', en: '13 : 3, remainder 1' },
      { ru: '21 : 3 = 7', uz: '21 : 3 = 7', en: '21 : 3 = 7' },
    ],
    done: {
      ru: 'Концы 2, 3 и 1 — а делятся на 3 первое и третье. Для тройки последняя цифра ответа не даёт: там работает другой признак, его разберём на следующем уроке.',
      uz: "Oxirlari 2, 3 va 1 — 3 ga esa birinchisi va uchinchisi bo'linadi. Uchlik uchun oxirgi raqam javob bermaydi: u yerda boshqa alomat ishlaydi, uni keyingi darsda ko'ramiz.",
      en: 'The endings are 2, 3 and 1, yet the first and the third divide by 3. For three the last digit gives no answer: another rule works there, and we will meet it next lesson.',
    },
    audio: {
      ru: [
        'Важная граница. Возьмём три числа: двенадцать, тринадцать и двадцать один.',
        'Двенадцать делится на три, тринадцать нет, двадцать один делится. А концы у них два, три и один.',
        'Значит для тройки последняя цифра ответа не даёт. У тройки свой признак, и мы разберём его на следующем уроке.',
      ],
      uz: [
        "Muhim chegara. Uchta son olamiz: o'n ikki, o'n uch va yigirma bir.",
        "O'n ikki uchga bo'linadi, o'n uch bo'linmaydi, yigirma bir bo'linadi. Oxirlari esa ikki, uch va bir.",
        "Demak uchlik uchun oxirgi raqam javob bermaydi. Uchlikning o'z alomati bor, uni keyingi darsda ko'ramiz.",
      ],
      en: [
        'An important limit. Take three numbers: twelve, thirteen and twenty one.',
        'Twelve divides by three, thirteen does not, twenty one does. And their endings are two, three and one.',
        'So for three the last digit gives no answer. Three has its own rule, and we will meet it next lesson.',
      ],
    },
  },

  // Экран 8 — ПРАВИЛО и возврат к хуку.
  s_rule: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    title: { ru: 'Три признака по последней цифре', uz: "Oxirgi raqam bo'yicha uchta alomat", en: 'Three rules from the last digit' },
    rule_1: {
      ru: 'На 2 делятся числа с последней цифрой 0, 2, 4, 6, 8. На 5 — с цифрой 0 или 5. На 10 — только с цифрой 0.',
      uz: "Oxirgi raqami 0, 2, 4, 6, 8 bo'lgan sonlar 2 ga bo'linadi. 5 ga — oxirgi raqami 0 yoki 5 bo'lganlar. 10 ga — faqat 0 bilan tugaganlar.",
      en: 'Numbers ending in 0, 2, 4, 6, 8 divide by 2. Ending in 0 or 5 divide by 5. Only those ending in 0 divide by 10.',
    },
    rule_2: {
      ru: 'Счёт из начала урока: 36 оканчивается на 6, значит делится на 2. Дилноза была права — делить не пришлось.',
      uz: "Dars boshidagi hisob: 36 soni 6 bilan tugaydi, demak 2 ga bo'linadi. Dilnoza haq edi — bo'lish shart bo'lmadi.",
      en: 'The bill from the start of the lesson: 36 ends in 6, so it divides by 2. Dilnoza was right, no division was needed.',
    },
    audio: {
      ru: 'Запомним правило. На два делятся числа с последней цифрой ноль, два, четыре, шесть, восемь. На пять с цифрой ноль или пять. На десять только с цифрой ноль. И вернёмся к счёту из начала урока. Тридцать шесть оканчивается на шесть, значит делится на два. Дилноза была права, делить не пришлось.',
      uz: "Qoidani eslab qolamiz. Oxirgi raqami nol, ikki, to'rt, olti, sakkiz bo'lgan sonlar ikkiga bo'linadi. Beshga oxirgi raqami nol yoki besh bo'lganlar. O'nga esa faqat nol bilan tugaganlar. Va dars boshidagi hisobga qaytamiz. O'ttiz olti olti bilan tugaydi, demak ikkiga bo'linadi. Dilnoza haq edi, bo'lish shart bo'lmadi.",
      en: 'Let us remember the rule. Numbers ending in zero, two, four, six or eight divide by two. Those ending in zero or five divide by five. Only those ending in zero divide by ten. And back to the bill from the start of the lesson. Thirty six ends in six, so it divides by two. Dilnoza was right, no division was needed.',
    },
  },

  // Экран 9 — ПРАКТИКА: назови, на что делится.
  s_names: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'На что делится цена', uz: "Narx nimaga bo'linadi", en: 'What the price divides by' },
    lead: { ru: 'Смотри только на последнюю цифру.', uz: 'Faqat oxirgi raqamga qarang.', en: 'Look only at the last digit.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Цена 24 тысячи. На что она делится?', uz: "Narx 24 ming. U nimaga bo'linadi?", en: 'The price is 24 thousand. What does it divide by?' },
        opts: [
          { ru: 'Только на 2', uz: 'Faqat 2 ga', en: 'Only by 2' },
          { ru: 'Только на 5', uz: 'Faqat 5 ga', en: 'Only by 5' },
          { ru: 'И на 2, и на 5', uz: '2 ga ham, 5 ga ham', en: 'By 2 and by 5' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Последняя цифра 4 — чётная, значит на 2 делится. Пятёрке нужны 0 или 5, поэтому на 5 не делится.', uz: "To'g'ri. Oxirgi raqam 4 — juft, demak 2 ga bo'linadi. Beshlikka 0 yoki 5 kerak, shuning uchun 5 ga bo'linmaydi.", en: 'Right. The last digit 4 is even, so it divides by 2. Five needs 0 or 5, so it does not divide by 5.' },
        wrong: [
          null,
          { ru: 'Пятёрке нужна на конце 0 или 5, а здесь 4. Зато 4 чётная — значит делится на 2.', uz: "Beshlikka oxirida 0 yoki 5 kerak, bu yerda esa 4. Lekin 4 juft — demak 2 ga bo'linadi.", en: 'Five needs 0 or 5 at the end, and here it is 4. But 4 is even, so it divides by 2.' },
          { ru: 'На 2 — да, цифра 4 чётная. А на 5 нет: пятёрке нужны 0 или 5.', uz: "2 ga — ha, 4 raqami juft. 5 ga esa yo'q: beshlikka 0 yoki 5 kerak.", en: 'By 2 yes, the digit 4 is even. By 5 no: five needs 0 or 5.' },
        ],
      },
      {
        q: { ru: 'Цена 45 тысяч. На что она делится?', uz: "Narx 45 ming. U nimaga bo'linadi?", en: 'The price is 45 thousand. What does it divide by?' },
        opts: [
          { ru: 'Только на 2', uz: 'Faqat 2 ga', en: 'Only by 2' },
          { ru: 'Только на 5', uz: 'Faqat 5 ga', en: 'Only by 5' },
          { ru: 'На 5 и на 10', uz: '5 ga va 10 ga', en: 'By 5 and by 10' },
        ],
        correct: 1,
        ok: { ru: 'Верно. На конце 5: делится на 5. Пятёрка нечётная, значит на 2 нет, а десятке нужен ноль.', uz: "To'g'ri. Oxirida 5: 5 ga bo'linadi. Besh toq, demak 2 ga yo'q, o'nlikka esa nol kerak.", en: 'Right. It ends in 5, so it divides by 5. Five is odd, so not by 2, and ten needs a zero.' },
        wrong: [
          { ru: 'Последняя цифра 5 — нечётная. Пары не собираются, на 2 не делится.', uz: "Oxirgi raqam 5 — toq. Juftlar yig'ilmaydi, 2 ga bo'linmaydi.", en: 'The last digit 5 is odd. Pairs do not come out, it does not divide by 2.' },
          null,
          { ru: 'На 10 делятся только числа с нулём на конце. У 45 на конце пятёрка.', uz: "10 ga faqat oxirida nol bo'lgan sonlar bo'linadi. 45 ning oxirida besh turibdi.", en: 'Only numbers ending in zero divide by 10. 45 ends in five.' },
        ],
      },
      {
        q: { ru: 'Цена 30 тысяч. На что она делится?', uz: "Narx 30 ming. U nimaga bo'linadi?", en: 'The price is 30 thousand. What does it divide by?' },
        opts: [
          { ru: 'Только на 2', uz: 'Faqat 2 ga', en: 'Only by 2' },
          { ru: 'Только на 5', uz: 'Faqat 5 ga', en: 'Only by 5' },
          { ru: 'На 2, на 5 и на 10', uz: '2 ga, 5 ga va 10 ga', en: 'By 2, by 5 and by 10' },
        ],
        correct: 2,
        ok: { ru: 'Верно. Ноль на конце подходит всем троим сразу: и двойке, и пятёрке, и десятке.', uz: "To'g'ri. Oxiridagi nol uchalasiga birdan mos keladi: ikkiga ham, beshga ham, o'nga ham.", en: 'Right. A zero at the end suits all three at once: two, five and ten.' },
        wrong: [
          { ru: 'На 2 действительно делится, но ноль подходит ещё и пятёрке, и десятке.', uz: "2 ga haqiqatan bo'linadi, lekin nol beshlikka ham, o'nlikka ham mos keladi.", en: 'It really does divide by 2, but zero suits five and ten as well.' },
          { ru: 'На 5 делится, но ноль чётный — значит и на 2 тоже, и на 10.', uz: "5 ga bo'linadi, lekin nol juft — demak 2 ga ham, 10 ga ham.", en: 'It divides by 5, but zero is even, so by 2 as well, and by 10.' },
          null,
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика. Смотрите только на последнюю цифру и выбирайте, на что делится цена.',
        uz: "Mashq. Faqat oxirgi raqamga qarang va narx nimaga bo'linishini tanlang.",
        en: 'Practice. Look only at the last digit and choose what the price divides by.',
      },
    },
  },

  // Экран 10 — ПРАКТИКА: способ 1 на четырёх числах.
  s_two: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Делится на 2 или нет', uz: "2 ga bo'linadimi yoki yo'q", en: 'Divides by 2 or not' },
    lead: { ru: 'Способ первый: закрой все цифры, кроме последней.', uz: "Birinchi usul: oxirgisidan boshqa hamma raqamni yoping.", en: 'Method one: cover every digit but the last.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Число 58. Делится на 2?', uz: "58 soni. 2 ga bo'linadimi?", en: 'The number 58. Does it divide by 2?' },
        opts: [{ ru: 'Да', uz: 'Ha', en: 'Yes' }, { ru: 'Нет', uz: "Yo'q", en: 'No' }],
        correct: 0,
        ok: { ru: 'Верно. Последняя цифра 8 — чётная, 58 : 2 = 29.', uz: "To'g'ri. Oxirgi raqam 8 — juft, 58 : 2 = 29.", en: 'Right. The last digit 8 is even, 58 : 2 = 29.' },
        wrong: [null, { ru: 'Восьмёрка чётная, значит 58 делится на 2. Первая цифра тут ни при чём.', uz: "Sakkiz juft, demak 58 soni 2 ga bo'linadi. Birinchi raqamning bunga aloqasi yo'q.", en: 'Eight is even, so 58 divides by 2. The first digit has nothing to do with it.' }],
      },
      {
        q: { ru: 'Число 71. Делится на 2?', uz: "71 soni. 2 ga bo'linadimi?", en: 'The number 71. Does it divide by 2?' },
        opts: [{ ru: 'Да', uz: 'Ha', en: 'Yes' }, { ru: 'Нет', uz: "Yo'q", en: 'No' }],
        correct: 1,
        ok: { ru: 'Верно. На конце 1 — нечётная, 71 : 2 = 35 и один в остатке.', uz: "To'g'ri. Oxirida 1 — toq, 71 : 2 = 35, qoldiq bir.", en: 'Right. It ends in 1, which is odd: 71 : 2 = 35 with one left over.' },
        wrong: [{ ru: 'Смотреть надо на последнюю цифру, а не на первую. В конце 1, она нечётная.', uz: "Birinchi raqamga emas, oxirgisiga qarash kerak. Oxirida 1, u toq.", en: 'Look at the last digit, not the first. It ends in 1, which is odd.' }, null],
      },
      {
        q: { ru: 'Число 90. Делится на 2?', uz: "90 soni. 2 ga bo'linadimi?", en: 'The number 90. Does it divide by 2?' },
        opts: [{ ru: 'Да', uz: 'Ha', en: 'Yes' }, { ru: 'Нет', uz: "Yo'q", en: 'No' }],
        correct: 0,
        ok: { ru: 'Верно. Ноль — чётная цифра, 90 : 2 = 45.', uz: "To'g'ri. Nol — juft raqam, 90 : 2 = 45.", en: 'Right. Zero is an even digit, 90 : 2 = 45.' },
        wrong: [null, { ru: 'Ноль считается чётным: 90 делится на 2 и даёт 45.', uz: "Nol juft hisoblanadi: 90 soni 2 ga bo'linadi va 45 beradi.", en: 'Zero counts as even: 90 divides by 2 and gives 45.' }],
      },
      {
        q: { ru: 'Число 33. Делится на 2?', uz: "33 soni. 2 ga bo'linadimi?", en: 'The number 33. Does it divide by 2?' },
        opts: [{ ru: 'Да', uz: 'Ha', en: 'Yes' }, { ru: 'Нет', uz: "Yo'q", en: 'No' }],
        correct: 1,
        ok: { ru: 'Верно. Тройка нечётная, пара не собирается: 33 : 2 = 16 и один лишний.', uz: "To'g'ri. Uch toq, juft yig'ilmaydi: 33 : 2 = 16, bittasi ortiqcha.", en: 'Right. Three is odd, no full pairing: 33 : 2 = 16 with one left.' },
        wrong: [{ ru: 'Обе цифры тройки, но решает только последняя. Три нечётная.', uz: "Ikkala raqam ham uch, lekin faqat oxirgisi hal qiladi. Uch toq.", en: 'Both digits are three, but only the last one decides. Three is odd.' }, null],
      },
    ],
    audio: {
      intro: {
        ru: 'Способ первый в работе. Закройте все цифры, кроме последней, и отвечайте.',
        uz: "Birinchi usul ish boshida. Oxirgisidan boshqa hamma raqamni yopib, javob bering.",
        en: 'Method one in action. Cover every digit but the last and answer.',
      },
    },
  },

  // Экран 11 — ПРАКТИКА: корзины по признаку пятёрки.
  s_bins: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Разложи цены по пятёрке', uz: "Narxlarni beshlik bo'yicha ajrating", en: 'Sort the prices by five' },
    lead: { ru: 'Пятёрке нужны на конце 0 или 5.', uz: "Beshlikka oxirida 0 yoki 5 kerak.", en: 'Five needs a 0 or a 5 at the end.' },
    bin_a: { ru: 'Делится на 5', uz: "5 ga bo'linadi", en: 'Divides by 5' },
    bin_b: { ru: 'Не делится на 5', uz: "5 ga bo'linmaydi", en: 'Does not divide by 5' },
    cards: [
      { label: '25', bin: 'a' },
      { label: '42', bin: 'b' },
      { label: '60', bin: 'a' },
      { label: '75', bin: 'a' },
      { label: '38', bin: 'b' },
      { label: '17', bin: 'b' },
    ],
    hint: {
      ru: 'Закрой все цифры, кроме последней. Это 0 или 5?',
      uz: "Oxirgisidan boshqa hamma raqamni yoping. U 0 yoki 5 mi?",
      en: 'Cover every digit but the last. Is it 0 or 5?',
    },
    correct_text: {
      ru: 'Верно. 25, 60 и 75 оканчиваются на 5, 0 и 5. А 42, 38 и 17 — на 2, 8 и 7, пятёрке они не подходят.',
      uz: "To'g'ri. 25, 60 va 75 oxiri 5, 0 va 5. 42, 38 va 17 esa 2, 8 va 7 bilan tugaydi, beshlikka mos emas.",
      en: 'Right. 25, 60 and 75 end in 5, 0 and 5. And 42, 38 and 17 end in 2, 8 and 7, which do not suit five.',
    },
    audio: {
      intro: {
        ru: 'Разложите цены на две группы. Делится на пять или нет? Смотрите на последнюю цифру.',
        uz: "Narxlarni ikki guruhga ajrating. Beshga bo'linadimi yoki yo'q? Oxirgi raqamga qarang.",
        en: 'Sort the prices into two groups. Does it divide by five or not? Look at the last digit.',
      },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда. Посмотри на последнюю цифру.', uz: 'Bu yerga emas. Oxirgi raqamga qarang.', en: 'Not here. Look at the last digit.' },
    },
  },

  // Экран 12 — ПРАКТИКА: найди ошибку.
  s_error: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikidek tekshiring.", en: 'Check someone else’s work the way you would check your own.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Азиз выписал числа, которые делятся на 10: 30, 45, 60. Где ошибка?', uz: "Aziz 10 ga bo'linadigan sonlarni yozdi: 30, 45, 60. Xato qayerda?", en: 'Aziz wrote the numbers that divide by 10: 30, 45, 60. Where is the mistake?' },
        opts: [
          { ru: 'Ошибки нет', uz: "Xato yo'q", en: 'There is no mistake' },
          { ru: 'Лишнее число 45', uz: "45 ortiqcha", en: '45 does not belong' },
          { ru: 'Лишнее число 30', uz: "30 ortiqcha", en: '30 does not belong' },
        ],
        correct: 1,
        ok: { ru: 'Верно. 45 оканчивается на 5, а десятке нужен только 0: 45 : 10 = 4 и 5 в остатке.', uz: "To'g'ri. 45 oxiri 5, o'nlikka esa faqat 0 kerak: 45 : 10 = 4, qoldiq 5.", en: 'Right. 45 ends in 5, and ten needs a 0: 45 : 10 = 4 with 5 left over.' },
        wrong: [
          { ru: 'Ошибка есть. Пятёрка на конце подходит только пятёрке, а не десятке.', uz: "Xato bor. Oxiridagi besh faqat beshlikka mos, o'nlikka emas.", en: 'There is a mistake. A five at the end suits five, not ten.' },
          null,
          { ru: '30 оканчивается на 0 — оно как раз делится на 10.', uz: "30 oxiri 0 — u aynan 10 ga bo'linadi.", en: '30 ends in 0, and it does divide by 10.' },
        ],
      },
      {
        q: { ru: 'Дилноза говорит: «74 делится на 2, потому что 7 нечётная». В чём ошибка?', uz: "Dilnoza aytadi: «74 soni 2 ga bo'linadi, chunki 7 toq». Xato nimada?", en: 'Dilnoza says: “74 divides by 2 because 7 is odd.” What is wrong?' },
        opts: [
          { ru: 'Ответ верный, объяснение неверное', uz: "Javob to'g'ri, izoh noto'g'ri", en: 'The answer is right, the reason is wrong' },
          { ru: 'И ответ, и объяснение неверные', uz: "Javob ham, izoh ham noto'g'ri", en: 'Both the answer and the reason are wrong' },
          { ru: 'Всё верно', uz: "Hammasi to'g'ri", en: 'Everything is right' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 74 действительно делится на 2, но из-за последней цифры 4, а не из-за семёрки.', uz: "To'g'ri. 74 haqiqatan 2 ga bo'linadi, lekin oxirgi raqam 4 tufayli, yetti tufayli emas.", en: 'Right. 74 does divide by 2, but because of the last digit 4, not because of the seven.' },
        wrong: [
          null,
          { ru: 'Ответ как раз верный: 74 : 2 = 37. Неверно только объяснение.', uz: "Javobning o'zi to'g'ri: 74 : 2 = 37. Faqat izoh noto'g'ri.", en: 'The answer itself is right: 74 : 2 = 37. Only the reason is wrong.' },
          { ru: 'Объяснение неверное: решает последняя цифра, а не первая.', uz: "Izoh noto'g'ri: birinchi emas, oxirgi raqam hal qiladi.", en: 'The reason is wrong: the last digit decides, not the first.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Проверьте чужое решение. Ошибка бывает и в ответе, и в объяснении.',
        uz: "Birovning yechimini tekshiring. Xato javobda ham, izohda ham bo'lishi mumkin.",
        en: 'Check someone else’s work. A mistake can be in the answer and in the reason.',
      },
    },
  },

  // Экран 13 — ЗАДАЧА из жизни буфета.
  s_task: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    title: { ru: 'Счёт на пятерых', uz: 'Besh kishilik hisob', en: 'A bill for five' },
    lead: { ru: 'В буфете пять счетов. Платят пятеро, каждый вносит поровну.', uz: "Bufetda beshta hisob bor. Besh kishi to'laydi, har biri tengdan.", en: 'There are five bills at the snack bar. Five people pay, each the same.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    bills: ['32', '45', '50', '68', '75'],
    items: [
      {
        q: { ru: 'Какие счета пятеро смогут разделить поровну?', uz: "Qaysi hisoblarni besh kishi teng bo'la oladi?", en: 'Which bills can the five split evenly?' },
        opts: [
          { ru: '45, 50 и 75', uz: '45, 50 va 75', en: '45, 50 and 75' },
          { ru: '32, 50 и 68', uz: '32, 50 va 68', en: '32, 50 and 68' },
          { ru: 'Все пять', uz: 'Beshalasi', en: 'All five' },
        ],
        correct: 0,
        ok: { ru: 'Верно. На 5 делятся 45, 50 и 75 — они оканчиваются на 5, 0 и 5.', uz: "To'g'ri. 5 ga 45, 50 va 75 bo'linadi — ular 5, 0 va 5 bilan tugaydi.", en: 'Right. 45, 50 and 75 divide by 5: they end in 5, 0 and 5.' },
        wrong: [
          null,
          { ru: 'Это чётные числа — они делятся на 2. Пятёрке нужны 0 или 5 на конце.', uz: "Bular juft sonlar — ular 2 ga bo'linadi. Beshlikka oxirida 0 yoki 5 kerak.", en: 'Those are even numbers, they divide by 2. Five needs a 0 or a 5 at the end.' },
          { ru: '32 и 68 оканчиваются на 2 и 8 — пятёрке они не подходят.', uz: "32 va 68 oxiri 2 va 8 — beshlikka mos emas.", en: '32 and 68 end in 2 and 8, which do not suit five.' },
        ],
      },
      {
        q: { ru: 'А какой счёт разделят и пятеро, и двое?', uz: "Qaysi hisobni besh kishi ham, ikki kishi ham bo'la oladi?", en: 'And which bill can both five and two split?' },
        opts: [
          { ru: '45', uz: '45', en: '45' },
          { ru: '50', uz: '50', en: '50' },
          { ru: '75', uz: '75', en: '75' },
        ],
        correct: 1,
        ok: { ru: 'Верно. У 50 на конце ноль: он подходит и пятёрке, и двойке, и десятке.', uz: "To'g'ri. 50 ning oxirida nol: u beshlikka ham, ikkilikka ham, o'nlikka ham mos.", en: 'Right. 50 ends in zero: it suits five, two and ten.' },
        wrong: [
          { ru: '45 делится на 5, но пятёрка нечётная — на 2 не делится.', uz: "45 soni 5 ga bo'linadi, lekin besh toq — 2 ga bo'linmaydi.", en: '45 divides by 5, but five is odd, so not by 2.' },
          null,
          { ru: '75 делится на 5, но заканчивается нечётной цифрой — на 2 не делится.', uz: "75 soni 5 ga bo'linadi, lekin toq raqam bilan tugaydi — 2 ga bo'linmaydi.", en: '75 divides by 5, but it ends in an odd digit, so not by 2.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Задача из жизни буфета. Пять счетов, платят пятеро. Смотрите на последнюю цифру каждого счёта.',
        uz: "Bufet hayotidan masala. Beshta hisob, besh kishi to'laydi. Har bir hisobning oxirgi raqamiga qarang.",
        en: 'A problem from the snack bar. Five bills, five people paying. Look at the last digit of each bill.',
      },
    },
  },

  // Экран 14 — ФИНАЛЬНЫЙ ТЕСТ.
  s_final: {
    eyebrow: { ru: 'Финал', uz: 'Final', en: 'Final' },
    intro_line: { ru: 'Пять заданий на весь урок.', uz: 'Butun darsga beshta topshiriq.', en: 'Five tasks covering the whole lesson.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        kind: 'num', ans: 5,
        q: { ru: 'Сколько чисел от 1 до 50 делятся на 10? Набери ответ.', uz: "1 dan 50 gacha nechta son 10 ga bo'linadi? Javobni tering.", en: 'How many numbers from 1 to 50 divide by 10? Type the answer.' },
        hint: { ru: 'На 10 делятся только числа с нулём на конце: 10, 20, 30, 40, 50.', uz: "10 ga faqat oxiri nol bo'lgan sonlar bo'linadi: 10, 20, 30, 40, 50.", en: 'Only numbers ending in zero divide by 10: 10, 20, 30, 40, 50.' },
        hint_audio: { ru: 'На десять делятся только числа с нулём на конце. Десять, двадцать, тридцать, сорок, пятьдесят.', uz: "O'nga faqat oxiri nol bo'lgan sonlar bo'linadi. O'n, yigirma, o'ttiz, qirq, ellik.", en: 'Only numbers ending in zero divide by ten. Ten, twenty, thirty, forty, fifty.' },
      },
      {
        kind: 'mc', correctIndex: 2,
        q: { ru: 'Какое число делится и на 2, и на 5?', uz: "Qaysi son 2 ga ham, 5 ga ham bo'linadi?", en: 'Which number divides by both 2 and 5?' },
        opts: ['35', '42', '60', '77'],
        wrong: [
          { ru: '35 оканчивается на 5: на 5 делится, на 2 нет.', uz: "35 oxiri 5: 5 ga bo'linadi, 2 ga yo'q.", en: '35 ends in 5: it divides by 5, not by 2.' },
          { ru: '42 чётное, но пятёрке нужен 0 или 5 на конце.', uz: "42 juft, lekin beshlikka oxirida 0 yoki 5 kerak.", en: '42 is even, but five needs a 0 or 5 at the end.' },
          null,
          { ru: '77 оканчивается на 7: ни двойке, ни пятёрке не подходит.', uz: "77 oxiri 7: na ikkilikka, na beshlikka mos.", en: '77 ends in 7: it suits neither two nor five.' },
        ],
        correct: { ru: 'Верно. У 60 на конце ноль — он подходит и двойке, и пятёрке, и десятке.', uz: "To'g'ri. 60 ning oxirida nol — u ikkilikka ham, beshlikka ham, o'nlikka ham mos.", en: 'Right. 60 ends in zero: it suits two, five and ten.' },
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'Число оканчивается на 0. Что про него точно верно?', uz: "Son 0 bilan tugaydi. U haqida nima aniq to'g'ri?", en: 'A number ends in 0. What is certainly true about it?' },
        opts: [
          { ru: 'Делится только на 10', uz: "Faqat 10 ga bo'linadi", en: 'It divides only by 10' },
          { ru: 'Делится и на 2, и на 5, и на 10', uz: "2 ga ham, 5 ga ham, 10 ga ham bo'linadi", en: 'It divides by 2, by 5 and by 10' },
          { ru: 'Делится на 3', uz: "3 ga bo'linadi", en: 'It divides by 3' },
          { ru: 'Ничего сказать нельзя', uz: "Hech narsa deyish mumkin emas", en: 'You cannot tell' },
        ],
        wrong: [
          { ru: 'Ноль подходит и двойке, и пятёрке: 30 делится на все три.', uz: "Nol ikkilikka ham, beshlikka ham mos: 30 uchalasiga bo'linadi.", en: 'Zero suits two and five as well: 30 divides by all three.' },
          null,
          { ru: 'Про тройку последняя цифра ничего не говорит: 20 на 3 не делится.', uz: "Oxirgi raqam uchlik haqida hech narsa demaydi: 20 soni 3 ga bo'linmaydi.", en: 'The last digit says nothing about three: 20 does not divide by 3.' },
          { ru: 'Сказать можно: ноль на конце сразу даёт три признака.', uz: "Deyish mumkin: oxiridagi nol darrov uchta alomat beradi.", en: 'You can tell: a zero at the end gives three rules at once.' },
        ],
        correct: { ru: 'Верно. Ноль на конце — самый щедрый случай: сразу три признака.', uz: "To'g'ri. Oxiridagi nol eng saxiy holat: uchta alomat birdan.", en: 'Right. A zero at the end is the most generous case: three rules at once.' },
      },
      {
        kind: 'mc', correctIndex: 3,
        q: { ru: 'Какое число НЕ делится на 2?', uz: "Qaysi son 2 ga BO'LINMAYDI?", en: 'Which number does NOT divide by 2?' },
        opts: ['18', '40', '96', '53'],
        wrong: [
          { ru: '18 оканчивается на 8 — чётная цифра.', uz: "18 oxiri 8 — juft raqam.", en: '18 ends in 8, an even digit.' },
          { ru: '40 оканчивается на 0 — ноль чётный.', uz: "40 oxiri 0 — nol juft.", en: '40 ends in 0, and zero is even.' },
          { ru: '96 оканчивается на 6 — чётная цифра.', uz: "96 oxiri 6 — juft raqam.", en: '96 ends in 6, an even digit.' },
          null,
        ],
        correct: { ru: 'Верно. 53 оканчивается на 3, а тройка нечётная.', uz: "To'g'ri. 53 oxiri 3, uch esa toq.", en: 'Right. 53 ends in 3, and three is odd.' },
      },
      {
        kind: 'mc', correctIndex: 0,
        q: { ru: 'Признак по последней цифре работает для тройки?', uz: "Oxirgi raqam alomati uchlik uchun ishlaydimi?", en: 'Does the last-digit rule work for three?' },
        opts: [
          { ru: 'Нет, у тройки свой признак', uz: "Yo'q, uchlikning o'z alomati bor", en: 'No, three has its own rule' },
          { ru: 'Да, как для двойки', uz: 'Ha, xuddi ikkilikdagidek', en: 'Yes, just like for two' },
          { ru: 'Да, если цифра нечётная', uz: "Ha, agar raqam toq bo'lsa", en: 'Yes, if the digit is odd' },
          { ru: 'Только для чисел до 100', uz: "Faqat 100 gacha bo'lgan sonlar uchun", en: 'Only for numbers under 100' },
        ],
        wrong: [
          null,
          { ru: '12 и 21 делятся на 3, а концы у них 2 и 1 — совсем разные.', uz: "12 va 21 uchga bo'linadi, oxirlari esa 2 va 1 — butunlay boshqa.", en: '12 and 21 divide by 3, and their endings 2 and 1 are quite different.' },
          { ru: '13 оканчивается нечётной цифрой, но на 3 не делится.', uz: "13 toq raqam bilan tugaydi, lekin 3 ga bo'linmaydi.", en: '13 ends in an odd digit but does not divide by 3.' },
          { ru: 'Размер числа тут ни при чём: и для 12, и для 1002 признак по последней цифре не работает.', uz: "Sonning kattaligi bunga aloqador emas: 12 uchun ham, 1002 uchun ham oxirgi raqam alomati ishlamaydi.", en: 'The size makes no difference: the last-digit rule fails for 12 and for 1002 alike.' },
        ],
        correct: { ru: 'Верно. Для тройки смотрят на сумму цифр — это следующий урок.', uz: "To'g'ri. Uchlik uchun raqamlar yig'indisiga qaraladi — bu keyingi dars.", en: 'Right. For three you look at the sum of the digits, and that is the next lesson.' },
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
      ru: 'Признак делимости на 10 — самый быстрый в математике: хватает одной цифры, и неважно, сколько их всего в числе.',
      uz: "10 ga bo'linish alomati matematikadagi eng tezi: bitta raqam yetadi, sonda ular nechta bo'lishi esa muhim emas.",
      en: 'The rule for 10 is the fastest in mathematics: one digit is enough, no matter how many the number has.',
    },
    fact_audio: {
      ru: 'Знаешь ли ты? Признак делимости на десять самый быстрый в математике: хватает одной цифры, и неважно, сколько их всего в числе.',
      uz: "Bilasizmi? O'nga bo'linish alomati matematikadagi eng tezi: bitta raqam yetadi, sonda ular nechta bo'lishi muhim emas.",
      en: 'Did you know? The rule for ten is the fastest in mathematics: one digit is enough, no matter how many the number has.',
    },
  },

  // Экран 15 — ИТОГ.
  s14: {
    eyebrow: { ru: 'Урок пройден', uz: "Dars o'tildi", en: 'Lesson finished' },
    banner: { ru: 'Математика · Делимость', uz: "Matematika · Bo'linish", en: 'Mathematics · Divisibility' },
    heading: { ru: 'Признаки делимости', uz: "Bo'linish alomatlari", en: 'Divisibility rules' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    brief_1: { ru: 'на 2 → последняя цифра 0, 2, 4, 6, 8', uz: "2 ga → oxirgi raqam 0, 2, 4, 6, 8", en: 'by 2 → last digit 0, 2, 4, 6, 8' },
    brief_2: { ru: 'на 5 → последняя цифра 0 или 5', uz: "5 ga → oxirgi raqam 0 yoki 5", en: 'by 5 → last digit 0 or 5' },
    brief_3: { ru: 'на 10 → последняя цифра 0', uz: "10 ga → oxirgi raqam 0", en: 'by 10 → last digit 0' },
    memo_title: { ru: 'Что помнить', uz: 'Nimani eslash kerak', en: 'What to remember' },
    memo_q1: { ru: 'Куда смотреть', uz: 'Qayerga qarash kerak', en: 'Where to look' },
    memo_a1: { ru: 'только на последнюю цифру', uz: 'faqat oxirgi raqamga', en: 'only at the last digit' },
    memo_q2: { ru: 'Ноль на конце', uz: 'Oxirida nol', en: 'A zero at the end' },
    memo_a2: { ru: 'сразу три признака: 2, 5 и 10', uz: "uchta alomat birdan: 2, 5 va 10", en: 'three rules at once: 2, 5 and 10' },
    memo_q3: { ru: 'Тройка', uz: 'Uchlik', en: 'Three' },
    memo_a3: { ru: 'по последней цифре не проверяется', uz: "oxirgi raqam bo'yicha tekshirilmaydi", en: 'is not checked by the last digit' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'На два делятся числа с последней цифрой ноль, два, четыре, шесть или восемь. На пять с нулём или пятёркой. На десять только с нулём.',
        'Счёт из начала урока делится на два, и мы узнали это, не выполняя деления. А для тройки такой приём не работает: этим займёмся на следующем уроке.',
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "Oxirgi raqami nol, ikki, to'rt, olti yoki sakkiz bo'lgan sonlar ikkiga bo'linadi. Beshga nol yoki besh bilan tugaganlar. O'nga esa faqat nol bilan.",
        "Dars boshidagi hisob ikkiga bo'linadi va biz buni bo'lishni bajarmasdan bildik. Uchlik uchun esa bu usul ishlamaydi: u bilan keyingi darsda shug'ullanamiz.",
      ],
      en: [
        'The lesson is done. Let us gather the main points.',
        'Numbers ending in zero, two, four, six or eight divide by two. Those ending in zero or five divide by five. Only those ending in zero divide by ten.',
        'The bill from the start of the lesson divides by two, and we found that out without dividing. For three this trick fails, and that is the next lesson.',
      ],
    },
  },

  // Карточка способа — стоит рядом с практикой, потому что способ объяснялся
  // на экране 4 и к практике успевает забыться.
  s_methods: {
    m1_title: { ru: 'Способ. Проверить одно число', uz: "Usul. Bitta sonni tekshirish", en: 'Method. Check one number' },
    m1_steps: {
      ru: ['Закрой все цифры, кроме последней', 'Сравни её с нужным списком', 'Совпала — делится, нет — не делится'],
      uz: ["Oxirgisidan boshqa hamma raqamni yop", "Uni kerakli ro'yxat bilan solishtir", "Mos keldi — bo'linadi, yo'q — bo'linmaydi"],
      en: ['Cover every digit but the last', 'Compare it with the right list', 'A match means it divides, no match means it does not'],
    },
    m1_no: {
      ru: 'Для 2 список: 0, 2, 4, 6, 8. Для 5: 0 и 5. Для 10: только 0.',
      uz: "2 uchun ro'yxat: 0, 2, 4, 6, 8. 5 uchun: 0 va 5. 10 uchun: faqat 0.",
      en: 'For 2 the list is 0, 2, 4, 6, 8. For 5: 0 and 5. For 10: only 0.',
    },
  },
};

// ============================================================
// СЦЕНЫ УРОКА
// Хук и итог — одно и то же место: школьный буфет. На хуке вопрос, в итоге
// ответ. Только фигуры, ни картинок, ни эмодзи.
// ============================================================
const BUF_SHIRTS = ['#7ECBE6', '#F5C77E', '#8FD6B4'];

// Стойка буфета, табло со счётом и двое у кассы: Азиз считает столбиком,
// Дилноза уже смотрит на число. Пропорция кадра общая для класса: 400 к 154.
// Витрина буфета: самса треугольником, лепёшка кругом, булочка.
const Samsa = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M0 12 L9 -6 L18 12 Z" fill="#E0A863" stroke="#C4874A" strokeWidth="0.8"/>
    <path d="M4 8 h10" stroke="#C4874A" strokeWidth="0.8"/>
    <circle cx="9" cy="2" r="0.9" fill="#8A5A2B"/>
    <circle cx="6.4" cy="6" r="0.8" fill="#8A5A2B"/>
    <circle cx="11.6" cy="6" r="0.8" fill="#8A5A2B"/>
  </g>
);

const Non = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle cx="9" cy="5" r="9" fill="#E8BC7E"/>
    <circle cx="9" cy="5" r="4.6" fill="#D8A55F"/>
    <circle cx="9" cy="5" r="1.2" fill="#B67F3E"/>
    {[0, 60, 120, 180, 240, 300].map((a) => (
      <circle key={a} cx={9 + 6.6 * Math.cos((a * Math.PI) / 180)} cy={5 + 6.6 * Math.sin((a * Math.PI) / 180)} r="0.8" fill="#B67F3E"/>
    ))}
  </g>
);

const Bulka = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M0 12 q2 -12 10 -12 q8 0 10 12 Z" fill="#EFC98F"/>
    <path d="M3 7 q7 -3 14 0" stroke="#D3A45F" strokeWidth="0.9" fill="none"/>
  </g>
);

// Стакан чая. Пар — движение САМОЙ сцены, а не плавающий декор.
const TeaGlass = ({ x, y, delay = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    <path className="d2-steam" style={{ animationDelay: `${delay}ms` }}
      d="M6 -6 q3 -5 0 -9 q-3 -4 0 -8" stroke="#C9C7C2" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    <path className="d2-steam" style={{ animationDelay: `${delay + 700}ms` }}
      d="M11 -6 q3 -5 0 -9 q-3 -4 0 -8" stroke="#C9C7C2" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    <path d="M2 -4 h14 l-2 16 h-10 Z" fill="#C97C3A" opacity="0.85"/>
    <path d="M2 -4 h14 l-0.6 5 h-12.8 Z" fill="#FFFFFF" opacity="0.25"/>
    <rect x="1" y="-6" width="16" height="3" rx="1.5" fill="#EFE9DD"/>
  </g>
);

// ФИГУРА ЧЕЛОВЕКА. У людей ЕСТЬ лицо: глаза и улыбка (правило класса, урок 1
// рисует детей так же). Без лица фигура читается как манекен.
//   x, ground — точка, где человек стоит; head — радиус головы, от него
//   считается всё остальное, поэтому фигура масштабируется одним числом.

const HookScene = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="d2wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F9F4EB"/><stop offset="100%" stopColor="#EFE7D8"/>
      </linearGradient>
      <linearGradient id="d2bar" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#E7C99A"/><stop offset="100%" stopColor="#D2A96F"/>
      </linearGradient>
      <linearGradient id="d2glass" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="rgba(255,255,255,0.55)"/><stop offset="100%" stopColor="rgba(220,236,244,0.3)"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="400" height="154" fill="url(#d2wall)"/>

    {/* ВИТРИНА слева: две полки с выпечкой под стеклом. Уже, чем была: людям
        нужно место, иначе они теряются на фоне буфета. */}
    <g>
      <rect x="6" y="20" width="104" height="70" rx="6" fill="#FFFDF7" stroke="#DCCFB6"/>
      <rect x="10" y="52" width="96" height="3" rx="1.5" fill="#E3D8C2"/>
      <rect x="10" y="84" width="96" height="4" rx="2" fill="#D9CDB5"/>
      <Samsa x="16" y="36"/><Samsa x="40" y="36"/>
      <Non x="66" y="34"/><Non x="88" y="34"/>
      <Bulka x="16" y="70"/><Bulka x="40" y="70"/>
      <Non x="66" y="66"/><Non x="88" y="66"/>
      <rect x="6" y="20" width="104" height="70" rx="6" fill="url(#d2glass)" stroke="#DCCFB6"/>
      <path d="M22 24 L44 24 L26 86 L14 86 Z" fill="#FFFFFF" opacity="0.18"/>
    </g>

    {/* ТАБЛО КАССЫ. Только число: слово пришлось бы переводить, а сцена одна
        на все три языка. Зелёная точка мигает — касса работает. */}
    <g>
      <rect x="264" y="10" width="130" height="46" rx="8" fill="#3B3730"/>
      <rect x="269" y="15" width="120" height="36" rx="5" fill="#2A2723"/>
      <circle className="d2-blink" cx="279" cy="23" r="2.2" fill="#8FD6B4"/>
      <text x="332" y="42" textAnchor="middle" fill="#FFFFFF"
        fontFamily="'JetBrains Mono', monospace" fontSize="21" fontWeight="700">36 000</text>
      <rect x="298" y="56" width="60" height="6" rx="2" fill="#6A6259"/>
    </g>

    {/* ЛЮДИ стоят ПЕРЕД стойкой и видны от колен: за стойкой они превращались
        в головы. Азиз слева с листком в руках, Дилноза правее, очередь дальше. */}
    <g>
      <Person x={136} ground={124} head={10} shirt="#7ECBE6" hair="#3E3128"/>
      <g className="d2-note">
        <rect x="152" y="82" width="46" height="38" rx="4" fill="#FFFFFF" stroke="#DDD3C0"/>
        <text x="175" y="97" textAnchor="middle" fill="#8A8883" fontFamily="'JetBrains Mono', monospace" fontSize="11">36 : 2</text>
        <line x1="158" y1="103" x2="192" y2="103" stroke="#DDD3C0"/>
        <text x="175" y="115" textAnchor="middle" fill="#C9C7C2" fontFamily="'JetBrains Mono', monospace" fontSize="12">?</text>
      </g>
    </g>
    <g>
      {/* Дилноза: взгляд короткой дугой к краю табло, поверх цифр не идёт */}
      <Person x={218} ground={124} head={10} shirt="#F5C77E" hair="#5A4636"/>
      <path className="d2-look" d="M232 76 q16 -16 30 -22" stroke="#FF4F28" strokeWidth="1.8" strokeDasharray="4 4" fill="none"/>
      <path className="d2-look" d="M258 50 l10 3 -8 6 z" fill="#FF4F28"/>
    </g>
    {/* очередь дальше по залу — фигуры мельче, это даёт глубину */}
    {[264, 294, 322].map((x, i) => (
      <Person key={x} x={x} ground={120} head={7.5} shirt={BUF_SHIRTS[i % BUF_SHIRTS.length]}
        hair={['#4A3A2E', '#5A4636', '#3E3128'][i % 3]} arms={false}/>
    ))}

    {/* СТОЙКА перед людьми: столешница и фасад */}
    <rect x="0" y="120" width="400" height="8" fill="#C9A472"/>
    <rect x="0" y="128" width="400" height="26" fill="url(#d2bar)"/>
    <rect x="0" y="134" width="400" height="2" fill="rgba(255,255,255,0.35)"/>

    {/* НА СТОЙКЕ: поднос с самсой, монета, чайник и два стакана чая */}
    <g>
      <rect x="24" y="112" width="52" height="8" rx="3" fill="#FFFFFF" stroke="#E0D5C0"/>
      <Samsa x="30" y="102"/><Samsa x="52" y="102"/>
    </g>
    <circle className="d2-coin-drop" cx="94" cy="115" r="5" fill="#F5C77E" stroke="#D8A93A"/>
    <g>
      <path className="d2-steam" d="M368 102 q3 -6 0 -10 q-3 -5 0 -9" stroke="#C9C7C2" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <path d="M356 120 q-2 -16 12 -16 q14 0 12 16 Z" fill="#8FD6B4"/>
      <path d="M380 110 q7 2 2 8" stroke="#6BB894" strokeWidth="2.4" fill="none"/>
      <rect x="364" y="100" width="8" height="4" rx="2" fill="#6BB894"/>
    </g>
    <TeaGlass x="326" y="112"/>
    <TeaGlass x="344" y="112" delay={400}/>
  </svg>
);

// Тот же буфет в итоге: у счёта подсвечена последняя цифра, рядом три ярлыка.
// Вопрос хука получает видимый ответ: узнать можно, и решает одна цифра.
const FinalScene = () => (
  <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
    <rect x="0" y="0" width="400" height="92" fill="#F9F4EB"/>

    {/* Тот же буфет: слева витрина, справа чайник и стаканы. Место узнаётся,
        изменился только ответ на табло. */}
    <g>
      <rect x="8" y="10" width="84" height="54" rx="5" fill="#FFFDF7" stroke="#DCCFB6"/>
      <rect x="12" y="36" width="76" height="2.5" rx="1.2" fill="#E3D8C2"/>
      <Samsa x="16" y="22"/><Samsa x="38" y="22"/>
      <Non x="62" y="20"/>
      <Bulka x="18" y="50"/><Bulka x="40" y="50"/>
      <Non x="62" y="46"/>
    </g>
    <g>
      <path className="d2-steam" d="M356 52 q3 -6 0 -10 q-3 -5 0 -9" stroke="#C9C7C2" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <path d="M346 64 q-2 -14 10 -14 q12 0 10 14 Z" fill="#8FD6B4"/>
      <path d="M366 56 q6 2 2 7" stroke="#6BB894" strokeWidth="2.2" fill="none"/>
    </g>
    <TeaGlass x="318" y="58"/>

    {/* Азиз и Дилноза у стойки: вопрос хука решён, оба довольны */}
    <Person x={104} ground={66} head={7} shirt="#7ECBE6" hair="#3E3128" arms={false}/>
    <Person x={124} ground={66} head={7} shirt="#F5C77E" hair="#5A4636" arms={false}/>

    <rect x="0" y="66" width="400" height="26" fill="#E7C99A"/>
    <rect x="0" y="64" width="400" height="4" fill="#C9A472"/>

    {/* Табло: последняя цифра подсвечена, она и дала ответ */}
    <rect x="100" y="10" width="152" height="46" rx="8" fill="#3B3730"/>
    <rect x="105" y="15" width="142" height="36" rx="5" fill="#2A2723"/>
    <text x="132" y="41" textAnchor="middle" fill="#FFFFFF"
      fontFamily="'JetBrains Mono', monospace" fontSize="22" fontWeight="700">3</text>
    <rect className="d2-hit" x="144" y="19" width="26" height="28" rx="5" fill="#FF4F28"/>
    <text x="157" y="41" textAnchor="middle" fill="#FFFFFF"
      fontFamily="'JetBrains Mono', monospace" fontSize="22" fontWeight="700">6</text>
    <text x="212" y="41" textAnchor="middle" fill="#8A8883"
      fontFamily="'JetBrains Mono', monospace" fontSize="22" fontWeight="700">000</text>

    {/* три ярлыка: двойка горит, пятёрка и десятка погашены */}
    {[[268, '2', true], [296, '5', false], [326, '10', false]].map(([x, label, on]) => (
      <g key={label}>
        <circle cx={x} cy="33" r="13" fill={on ? '#E3F0E8' : '#EFE9DD'} stroke={on ? '#1F7A4D' : '#D9D2C4'}/>
        <text x={x} y="38" textAnchor="middle" fill={on ? '#1F7A4D' : '#B8B4AD'}
          fontFamily="'JetBrains Mono', monospace" fontSize="12" fontWeight="700">{label}</text>
      </g>
    ))}
  </svg>
);

// ============================================================
// ТЕЛА ЭКРАНОВ-ФИЛЬМОВ
// ============================================================

// Экран 2 — стулья парами: шесть встают ровно, седьмой остаётся без пары.
const Chair = ({ odd = false }) => (
  <span className={'d2-chair' + (odd ? ' d2-chair-odd' : '')} aria-hidden="true"/>
);

const RecallBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_recall;
  const n = step === 0 ? 6 : 7;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d2-stage">
        <div className="d2-pairs">
          {Array.from({ length: Math.floor(n / 2) }).map((_, i) => (
            <span key={i} className="d2-pair"><Chair/><Chair/></span>
          ))}
          {n % 2 === 1 && <span className="d2-pair d2-pair-odd"><Chair odd/></span>}
        </div>
        <p className="mono d2-cap">{t(step === 0 ? c.cap_even : c.cap_odd)}</p>
      </div>
      {step >= 2 && (
        <div className="frame-success fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
        </div>
      )}
    </div>
  );
};

// Экран 3 — длинное число: цифры гаснут, остаётся последняя.
const CoreBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_core;
  const digits = c.number.split('');
  const lastIdx = digits.length - 1;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d2-stage">
        <p className="d2-num">
          {digits.map((d, i) => (
            <span key={i} className={'d2-dig' + (step >= 1 && i !== lastIdx ? ' d2-dig-off' : '') + (step >= 1 && i === lastIdx ? ' d2-dig-hit' : '')}>{d}</span>
          ))}
        </p>
        <p className="mono d2-cap">{t(step === 0 ? c.cap_all : c.cap_last)}</p>
      </div>
      {step >= 2 && (
        <div className="frame-success fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
        </div>
      )}
    </div>
  );
};

// Экран 5 — цены буфета: загораются кратные пяти, потом остаётся кратное десяти.
const FIVE_ROW = [15, 24, 30, 42, 45];
const FiveBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_five;
  const on = (v) => (step >= 1 && v % 5 === 0);
  const ten = (v) => (step >= 2 && v % 10 === 0);
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d2-stage">
        <p className="eyebrow d2-eyebrow">{t(c.cap_row)}</p>
        <div className="d2-prices">
          {FIVE_ROW.map((v) => (
            <span key={v} className={'d2-price' + (on(v) ? ' d2-price-on' : '') + (ten(v) ? ' d2-price-ten' : '')}>{v}</span>
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

// СЧЁТНЫЙ МАТЕРИАЛ. Число на экране должно быть ВИДНО, а не только названо:
// монеты выкладываются группами по `group`, а те, что в полную группу не вошли,
// красятся отдельно — остаток виден без слов.
const CoinGrid = ({ n, group, cols = 10 }) => {
  const full = Math.floor(n / group) * group;
  return (
    // key по группе: при смене размера группы монеты выкладываются заново,
    // волной слева направо. Так видно САМО перегруппирование.
    <div className="d2-coins" key={group} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {Array.from({ length: n }).map((_, i) => {
        const extra = i >= full;
        const band = Math.floor(i / group) % 2;
        return (
          <span key={i} className={'d2-coin' + (extra ? ' d2-coin-extra' : (band ? ' d2-coin-b' : ''))}
            style={{ animationDelay: `${Math.min(i, 48) * 22}ms` }}/>
        );
      })}
    </div>
  );
};

// Экран 6 — решаем вместе: три строки пишутся по очереди и НЕ стираются.
const SolveBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_solve;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink3 }}>{t(c.lead)}</p>
      <div className="frame fade-up delay-1 d2-stage">
        <p className="d2-big">40</p>
        {/* Сорок монет перекрашиваются по группам: сначала парами, потом
            пятёрками, потом десятками. Ответ «делится» видно, а не только
            слышно. */}
        <CoinGrid n={40} group={step === 0 ? 1 : CONTENT.s_solve.rows[Math.min(step, 3) - 1].d}/>
        <div className="d2-rows">
          {c.rows.map((r, i) => (
            <p key={r.d} className={'d2-row' + (step >= i + 1 ? ' d2-row-on' : '')}>
              <span className="mono d2-row-d">: {r.d}</span>
              <span className="d2-row-t">{t(r.text)}</span>
            </p>
          ))}
        </div>
      </div>
      {step >= 3 && (
        <div className="frame-success fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
        </div>
      )}
    </div>
  );
};

// Экран 7 — граница: концы разные, ответы про тройку не совпадают с ними.
const EdgeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_edge;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d2-stage">
        <div className="d2-trio">
          {c.trio.map((n, i) => (
            <span key={n} className={'d2-tri' + (step >= 1 ? (i === 1 ? ' d2-tri-no' : ' d2-tri-yes') : '')}>
              <b>{n}</b>
              <i>{step >= 1 ? t(c.caps[i]) : ''}</i>
            </span>
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
// ЭКРАН 4 — «сначала показали, потом сам» (приём урока 1 третьего класса).
// Показ идёт сам: число, последняя цифра, вердикт. Потом очередь ребёнка на
// другом числе — свободного ввода нет, он выбирает вердикт.
// ============================================================
const LastDigitCard = ({ value, lit }) => {
  const digits = String(value).split('');
  return (
    <p className="d2-num d2-num-lg">
      {digits.map((d, i) => (
        <span key={i} className={'d2-dig' + (lit && i === digits.length - 1 ? ' d2-dig-hit' : (lit ? ' d2-dig-off' : ''))}>{d}</span>
      ))}
    </p>
  );
};

const ToolScreen = ({ screen, totalScreens, onNext, onPrev, onAnswer, storedAnswer }) => {
  const c = CONTENT.s_tool;
  const t = useT();
  const lang = useLang();
  const audio = useAudio([{ id: 's_tool_intro', text: pickL(c.audio.intro, lang), trigger: 'on_mount', waits_for: null }]);
  const [phase, setPhase] = useState(storedAnswer ? 'play' : 'demo');
  const [shown, setShown] = useState(false);
  const [picked, setPicked] = useState(null);
  const firstTryRef = useRef(true);
  const timersRef = useRef([]);
  const solved = picked === false;   // верный ответ на 47 — «не делится»

  const say = (node, id) => {
    if (audio.muted || !node) return;
    const e = getAudioEngine();
    if (e) e.pushOneOff(pickL(node, lang), undefined, id);
  };

  // Показ ведётся таймером, а не кликом: ребёнок смотрит.
  // Показ ведёт таймер: пока `shown` false — монеты лежат вразнобой, потом
  // ложатся парами и появляется вывод. Кнопка «Ещё раз» сбрасывает `shown`,
  // и этот же эффект проигрывает показ заново.
  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (phase !== 'demo' || shown) return undefined;
    timersRef.current.push(setTimeout(() => { setShown(true); say(c.audio.demo, 's_tool_demo'); }, 1600));
    return () => timersRef.current.forEach(clearTimeout);
    /* eslint-disable-next-line */
  }, [phase, shown]);

  const toPlay = () => {
    setPhase('play');
    setPicked(null);
    say(c.audio.play, 's_tool_play');
  };

  const answer = (yes) => {
    if (solved) return;
    setPicked(yes);
    if (yes) {
      firstTryRef.current = false;
      say(c.audio.wrong, 's_tool_wrong');
      return;
    }
    say(c.audio.ok, 's_tool_ok');
    if (onAnswer) {
      onAnswer({
        stage: null, screenIdx: screen, question: pickL(c.play_ask, lang),
        correctAnswer: pickL(c.no, lang), studentAnswer: pickL(c.no, lang),
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
        <div className={'d2-banner fade-up delay-1' + (phase === 'play' ? ' d2-banner-play' : '')}>
          {t(phase === 'demo' ? c.demo_banner : c.play_banner)}
        </div>

        <div className="frame fade-up delay-1 d2-stage">
          {phase === 'demo' ? (
            <>
              <LastDigitCard value={36} lit={shown}/>
              {/* Пары видно: 36 монет ложатся ровно, лишних нет. */}
              <CoinGrid n={36} group={shown ? 2 : 1} cols={12}/>
              <p className={'body d2-verdict' + (shown ? ' d2-verdict-on' : '')}>{shown ? t(c.demo_note) : ''}</p>
            </>
          ) : (
            <>
              <LastDigitCard value={47} lit={picked !== null}/>
              {/* После ответа видно лишнюю монету: пара из 47 не собирается. */}
              <CoinGrid n={47} group={solved ? 2 : 1} cols={12}/>
              <p className="body" style={{ margin: '0 0 10px', fontWeight: 600 }}>{t(c.play_ask)}</p>
              <div className="sv-opts">
                <button className={'option' + (picked === true ? ' option-picked-wrong' : '')}
                  disabled={solved} onClick={() => answer(true)}>{t(c.yes)}</button>
                <button className={'option' + (solved ? ' option-correct' : '')}
                  disabled={solved} onClick={() => answer(false)}>{t(c.no)}</button>
              </div>
              {picked === true && !solved && <HintBlock show>{t(c.play_wrong)}</HintBlock>}
              {solved && (
                <FeedbackBlock show isCorrect>
                  <p className="body" style={{ margin: 0 }}>{t(c.play_ok)}</p>
                </FeedbackBlock>
              )}
            </>
          )}
        </div>

        {phase === 'demo' && (
          <div className="d2-acts fade-up">
            <button className="d2-btn" disabled={!shown} onClick={() => setShown(false)}>{t(c.again)}</button>
            <button className="d2-btn d2-btn-go" disabled={!shown} onClick={toPlay}>{t(c.to_play)}</button>
          </div>
        )}

        <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps}
          note={CONTENT.s_methods.m1_no} active={phase === 'play' ? 2 : (shown ? 1 : 0)}/>
      </div>
    </Stage>
  );
};

// ============================================================
// ОБЁРТКИ ЭКРАНОВ (порядок совпадает с SCREEN_META)
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

const ScreenFive = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_five} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <FiveBody step={step}/>}/>
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
    exampleNode={<LastDigitCard value={36} lit/>}/>
);

const methodAside = (
  <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps} note={CONTENT.s_methods.m1_no}/>
);

const ScreenNames = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_names} asideNode={methodAside}/>
);

const ScreenTwo = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_two} asideNode={methodAside}/>
);

const ScreenBins = (props) => (
  <Classify {...props} screenContent={CONTENT.s_bins} totalScreens={TOTAL_SCREENS}/>
);

const ScreenError = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_error}/>
);

// Пять чеков стоят НАД заданием: их можно пересчитать глазами, а не помнить.
const BillsRow = () => (
  <div className="d2-bills">
    {CONTENT.s_task.bills.map((b) => (
      <span key={b} className="d2-bill"><b>{b}</b></span>
    ))}
  </div>
);

const ScreenTask = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_task}
    figureNode={() => <BillsRow/>}/>
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
// CSS УРОКА. Базовые правила класса — в BASE_STYLES общего слоя.
// ВНИМАНИЕ: строка шаблонная, обратная кавычка и обратный слэш внутри неё
// (даже в комментарии) дают белый экран.
// ============================================================
const LESSON_STYLES = `
.d2-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(8px, 1.6vw, 12px); padding: clamp(12px, 2.4vw, 18px) !important; }
.d2-cap { margin: 0; color: #8A8883; font-size: clamp(13px, 2vw, 15px); }
.d2-eyebrow { margin: 0; color: #8A8883; }

/* Экран 2: стулья парами */
.d2-pairs { display: flex; flex-wrap: wrap; justify-content: center; gap: clamp(10px, 2.4vw, 18px); min-height: 84px; align-items: center; }
.d2-pair { display: inline-flex; gap: 5px; padding: 7px 9px; border-radius: 12px; background: #FFFFFF; border: 1px solid #E9E3D9; }
.d2-pair-odd { border-color: #FF4F28; background: #FFE8E1; }
.d2-chair { position: relative; display: inline-block; width: 22px; height: 30px; }
.d2-chair::before { content: ''; position: absolute; left: 2px; top: 0; width: 18px; height: 15px; border-radius: 5px 5px 0 0; background: #7ECBE6; }
.d2-chair::after { content: ''; position: absolute; left: 0; bottom: 0; width: 22px; height: 13px; border-radius: 3px; background: #019ACB; }
.d2-chair-odd::before { background: #FFB59F; }
.d2-chair-odd::after { background: #FF4F28; }

/* Экран 3 и 4: число с последней цифрой */
.d2-num { display: flex; gap: clamp(2px, 0.8vw, 5px); margin: 0; font-family: 'JetBrains Mono', monospace; font-size: clamp(22px, 5vw, 34px); font-weight: 700; }
.d2-num-lg { font-size: clamp(34px, 7vw, 48px); }
.d2-dig { transition: opacity 420ms linear, color 420ms linear; }
.d2-dig-off { opacity: 0.22; }
.d2-dig-hit { color: #FF4F28; }
.d2-verdict { margin: 0; min-height: 24px; opacity: 0; transition: opacity 420ms linear; text-align: center; }
.d2-verdict-on { opacity: 1; }

/* Экран 5: цены буфета */
.d2-prices { display: flex; flex-wrap: wrap; justify-content: center; gap: clamp(7px, 1.6vw, 11px); }
.d2-price { min-width: 54px; padding: 9px 12px; border-radius: 12px; border: 1px solid #E9E3D9; background: #FFFFFF; font-family: 'JetBrains Mono', monospace; font-size: clamp(18px, 3.4vw, 24px); font-weight: 700; color: #B8B4AD; text-align: center; transition: all 420ms linear; }
.d2-price-on { color: #1F7A4D; border-color: #1F7A4D; background: #E3F0E8; }
.d2-price-ten { box-shadow: 0 0 0 3px rgba(255, 79, 40, 0.25); }

/* Экран 6: три строки решения */
.d2-big { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: clamp(30px, 6vw, 42px); font-weight: 700; color: #0E0E10; }
.d2-rows { display: flex; flex-direction: column; gap: 7px; width: 100%; }
.d2-row { display: flex; align-items: baseline; gap: 10px; margin: 0; opacity: 0; transform: translateY(6px); transition: opacity 420ms linear, transform 420ms cubic-bezier(0.22, 0.61, 0.36, 1); }
.d2-row-on { opacity: 1; transform: none; }
.d2-row-d { flex-shrink: 0; min-width: 44px; font-size: clamp(16px, 3vw, 20px); font-weight: 700; color: #FF4F28; }
.d2-row-t { font-size: clamp(14px, 2.4vw, 17px); line-height: 1.35; color: #0E0E10; }

/* Экран 7: три числа границы */
.d2-trio { display: flex; flex-wrap: wrap; justify-content: center; gap: clamp(9px, 2vw, 16px); }
.d2-tri { display: flex; flex-direction: column; align-items: center; gap: 5px; min-width: 96px; padding: 11px 13px; border-radius: 14px; border: 1px solid #E9E3D9; background: #FFFFFF; }
.d2-tri b { font-family: 'JetBrains Mono', monospace; font-size: clamp(24px, 5vw, 32px); }
.d2-tri i { font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: clamp(11px, 2vw, 13px); color: #8A8883; min-height: 16px; }
.d2-tri-yes { border-color: #1F7A4D; background: #E3F0E8; }
.d2-tri-yes i { color: #1F7A4D; }
.d2-tri-no { border-color: #FF4F28; background: #FFE8E1; }
.d2-tri-no i { color: #FF4F28; }

/* ДВИЖЕНИЕ СЦЕНЫ. Двигается то, что принадлежит буфету: пар над чаем,
   лампочка кассы, монета на стойке, листок в руке Азиза, его взгляд.
   Декор не плавает — это правило класса. */
.d2-steam { opacity: 0; animation: d2Steam 3200ms ease-in-out infinite; transform-origin: center bottom; }
@keyframes d2Steam {
  0% { opacity: 0; transform: translateY(2px) scaleY(0.7); }
  25% { opacity: 0.75; }
  70% { opacity: 0.35; transform: translateY(-8px) scaleY(1.1); }
  100% { opacity: 0; transform: translateY(-13px) scaleY(1.2); }
}
.d2-blink { animation: d2Blink 2400ms steps(1, end) infinite; }
@keyframes d2Blink { 0%, 55% { opacity: 1; } 56%, 100% { opacity: 0.25; } }
.d2-coin-drop { animation: d2Coin 1100ms cubic-bezier(0.3, 1.4, 0.5, 1) both; }
@keyframes d2Coin { from { transform: translateY(-42px) rotate(-140deg); opacity: 0; } to { transform: none; opacity: 1; } }
.d2-note { transform-origin: 190px 18px; animation: d2Note 4600ms ease-in-out infinite; }
@keyframes d2Note { 0%, 100% { transform: rotate(-1.4deg); } 50% { transform: rotate(1.4deg); } }
.d2-look { animation: d2Look 3000ms ease-in-out infinite; }
@keyframes d2Look { 0%, 100% { opacity: 0.35; } 45% { opacity: 1; } }
.d2-hit { animation: d2Hit 2600ms ease-in-out infinite; }
@keyframes d2Hit { 0%, 100% { opacity: 1; } 50% { opacity: 0.72; } }
@media (prefers-reduced-motion: reduce) {
  .d2-steam, .d2-blink, .d2-coin-drop, .d2-note, .d2-look, .d2-hit { animation: none; opacity: 1; }
}

/* Счётный материал: монеты группами. Цвет группы чередуется, лишние —
   оранжевые. При смене группы монеты ПЕРЕСТРАИВАЮТСЯ волной: ребёнок видит
   само перегруппирование, а не только его результат. */
.d2-coins { display: grid; gap: clamp(3px, 0.8vw, 6px); width: min(100%, 360px); }
.d2-coin { aspect-ratio: 1; border-radius: 50%; background: #7ECBE6; animation: d2CoinIn 420ms cubic-bezier(0.22, 0.61, 0.36, 1) both; }
@keyframes d2CoinIn { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: none; } }
.d2-coin-b { background: #8FD6B4; }
.d2-coin-extra { background: #FF4F28; box-shadow: 0 0 0 2px rgba(255, 79, 40, 0.25); }
@media (prefers-reduced-motion: reduce) { .d2-coin { animation: none; } }

/* Экран 4: баннер очереди и кнопки */
.d2-btn { height: 40px; padding: 0 18px; border-radius: 12px; border: 1px solid #E9E3D9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(14px, 2.2vw, 16px); font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.d2-btn:disabled { opacity: 0.45; cursor: default; }
.d2-btn-go { border-color: #FF4F28; color: #FF4F28; }
.d2-btn-go:hover:not(:disabled) { background: #FFE8E1; }
.d2-banner { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; font-size: clamp(14px, 2.4vw, 16px); font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 6px 13px; }
.d2-banner-play { color: #1F7A4D; background: #E3F0E8; }
.d2-acts { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }

/* Экран 13: пять чеков */
.d2-bills { display: flex; flex-wrap: wrap; justify-content: center; gap: clamp(7px, 1.6vw, 11px); }
.d2-bill { min-width: 58px; padding: 8px 11px; border-radius: 10px; border: 1px dashed #C9A472; background: #FFFDF7; text-align: center; }
.d2-bill b { font-family: 'JetBrains Mono', monospace; font-size: clamp(17px, 3.2vw, 22px); }

@media (max-width: 639.98px) {
  .d2-num { font-size: clamp(19px, 6vw, 26px); }
  .d2-tri { min-width: 84px; }
}
`;

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function DivisibilityRulesLesson({
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
    // Теория 6 класса не оценивается и не запирает переход (решение методиста).
    navLock: false,
  });

  const [current, setCurrent] = useState(Math.min(PREVIEW_START, TOTAL_SCREENS - 1));
  const [answers, setAnswers] = useState([]);

  const screens = [ScreenHook, ScreenRecall, ScreenCore, ScreenTool, ScreenFive, ScreenSolve, ScreenEdge,
    ScreenRule, ScreenNames, ScreenTwo, ScreenBins, ScreenError, ScreenTask, ScreenFinal, Screen14];
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
