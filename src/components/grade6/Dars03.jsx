// ============================================================
// 6 КЛАСС, УРОК 3 «Признаки делимости на 3 и 9»
// Собран по context/GRADE6_ETALON.md на общем слое ./screens.jsx.
//
// Сюжет блока: школа после уроков. Урок 1 — турнир в спортзале, урок 2 —
// буфет, урок 3 — школьная ярмарка со значками. Азиз и Дилноза те же.
//
// ГЛАВНОЕ СОБЫТИЕ УРОКА: приём из урока 2 («смотри на последнюю цифру»)
// здесь ЛОМАЕТСЯ. 117 кончается на 7, но делится на 3. Урок обязан сначала
// сломать привычку, а потом дать новую.
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
  lessonId: 'grade6-03',
  lessonTitle: {
    ru: 'Признаки делимости на 3 и 9',
    uz: "3 va 9 ga bo'linish alomatlari",
    en: 'Divisibility rules for 3 and 9',
  },
};

const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',    scored: false, scope: 'hook' },     //  1 yarmarka: 117 nishon
  { id: 's_recall', type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  2 oxirgi raqam usuli (2-dars)
  { id: 's_core',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  3 117, 171, 711 — bitta javob
  { id: 's_tool',   type: 'exploration', template: 'custom',        scored: false, scope: null },       //  4 USUL: raqamlarni qo'shish
  { id: 's_nine',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  5 9 ga bo'linish alomati
  { id: 's_solve',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  6 birga yechamiz: 4815
  { id: 's_edge',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  7 chegara: alomat bo'linmani bermaydi
  { id: 's_rule',   type: 'rule',        template: 'RuleScreen',    scored: false, scope: null },       //  8 QOIDA + xukka qaytish
  { id: 's_names',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, //  9 nimaga bo'linadi x3
  { id: 's_sum',    type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 10 raqamlar yig'indisi x4
  { id: 's_bins',   type: 'test',        template: 'Classify',      scored: true,  scope: 'practice' }, // 11 savatlar: 3 ga
  { id: 's_error',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_task',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 13 MASALA: nishonlar to'plami
  { id: 's_final',  type: 'test',        template: 'FinalPanel',    scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',      type: 'summary',     template: 'SummaryScreen', scored: false, scope: null },       // 15 xulosa
];

registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

const CONTENT = {
  s_hook: {
    title: {
      ru: 'Ярмарка: 117 значков по 3 в набор',
      uz: "Yarmarka: 117 nishon 3 tadan to'plamga",
      en: 'The fair: 117 badges, 3 to a set',
    },
    lead: {
      ru: 'На ярмарке 117 значков раскладывают в наборы по 3 — все наборы полные.',
      // «hammasi to'la» oxirida turganda «to'la» buyruq shakli kabi o'qilardi
      // (QA 2026-08-19). Bu yerda u sifat: to'plamlar to'liq bo'lishi kerak.
      // Shu darsning ovozi allaqachon shunday aytadi, matn ham unga moslandi.
      uz: "Yarmarkada 117 nishon 3 tadan to'plamlarga terilmoqda — hammasi to'la bo'lishi kerak.",
      en: 'At the fair 117 badges go into sets of 3, and every set must be full.',
    },
    voice_a: {
      ru: 'Азиз: цифра 7 на 3 не делится.',
      uz: "Aziz: 7 raqami 3 ga bo'linmaydi.",
      en: 'Aziz: the digit 7 does not divide by 3.',
    },
    voice_b: {
      ru: 'Дилноза: делится, я проверила иначе.',
      uz: "Dilnoza: bo'linadi, men boshqacha tekshirdim.",
      en: 'Dilnoza: it does divide, I checked another way.',
    },
    ask: {
      ru: 'Кто из них прав?',
      uz: 'Ularning qaysi biri haq?',
      en: 'Which of them is right?',
    },
    options: [
      { ru: 'Прав Азиз', uz: 'Aziz haq', en: 'Aziz is right' },
      { ru: 'Права Дилноза', uz: 'Dilnoza haq', en: 'Dilnoza is right' },
    ],
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: "Variantlardan birini bosing. Javobni dars davomida tekshiramiz.",
      en: 'Tap one of the options. We will check the answer during the lesson.',
    },
    audio: {
      intro: {
        ru: [
          'На школьной ярмарке сто семнадцать значков раскладывают в наборы по три, и все наборы должны быть полными.',
          'Азиз смотрит на последнюю цифру и говорит, что на три не делится. Дилноза проверила иначе и говорит, что делится. Как ты думаешь, кто прав? Выбери ответ. Проверим его по ходу урока.',
        ],
        uz: [
          "Maktab yarmarkasida bir yuz o'n yetti nishon uchtadan to'plamlarga terilmoqda va barcha to'plamlar to'la bo'lishi kerak.",
          "Aziz oxirgi raqamga qarab, uchga bo'linmaydi deydi. Dilnoza boshqacha tekshirdi va bo'linadi deydi. Sizningcha kim haq? Javobni tanlang. Uni dars davomida tekshiramiz.",
        ],
        en: [
          'At the school fair one hundred and seventeen badges are being packed three to a set, and every set must be full.',
          'Aziz looks at the last digit and says it does not divide by three. Dilnoza checked another way and says it does. What do you think, who is right? Choose an answer. We will check it during the lesson.',
        ],
      },
    },
  },

  s_recall: {
    title: { ru: 'Приём прошлого урока', uz: "O'tgan darsning usuli", en: 'Last lesson’s trick' },
    nums: ['30', '45'],
    caps: [
      { ru: '30 — на конце 0: делится на 2, 5 и 10', uz: "30 — oxirida 0: 2, 5 va 10 ga bo'linadi", en: '30 ends in 0: divides by 2, 5 and 10' },
      { ru: '45 — на конце 5: делится на 5', uz: "45 — oxirida 5: 5 ga bo'linadi", en: '45 ends in 5: divides by 5' },
    ],
    done: {
      ru: 'Для 2, 5 и 10 хватает последней цифры. Сегодня проверим, работает ли этот приём для тройки.',
      uz: "2, 5 va 10 uchun oxirgi raqam yetadi. Bugun bu usul uchlik uchun ishlaydimi, tekshiramiz.",
      en: 'For 2, 5 and 10 the last digit is enough. Today we check whether this trick works for three.',
    },
    audio: {
      ru: [
        'Вспомним прошлый урок. У тридцати на конце ноль, значит оно делится и на два, и на пять, и на десять.',
        'У сорока пяти на конце пятёрка: делится на пять. Приём короткий, смотрим только на последнюю цифру.',
        'Сегодня проверим, работает ли этот приём для тройки.',
      ],
      uz: [
        "O'tgan darsni eslaymiz. O'ttizning oxirida nol, demak u ikkiga ham, beshga ham, o'nga ham bo'linadi.",
        "Qirq beshning oxirida besh: beshga bo'linadi. Usul qisqa, faqat oxirgi raqamga qaraymiz.",
        "Bugun bu usul uchlik uchun ishlaydimi, tekshiramiz.",
      ],
      en: [
        'Let us recall the last lesson. Thirty ends in zero, so it divides by two, by five and by ten.',
        'Forty five ends in five, so it divides by five. The trick is short: look only at the last digit.',
        'Today we check whether this trick works for three.',
      ],
    },
  },

  s_core: {
    title: { ru: 'Цифры те же — ответ тот же', uz: "Raqamlar o'sha — javob ham o'sha", en: 'Same digits, same answer' },
    trio: ['117', '171', '711'],
    sum_label: { ru: 'сумма цифр', uz: "raqamlar yig'indisi", en: 'sum of the digits' },
    done: {
      ru: 'Порядок цифр разный, последняя цифра разная, а ответ один: все три делятся на 3. Значит решает не последняя цифра, а сумма цифр — она у всех трёх равна 9.',
      uz: "Raqamlar tartibi har xil, oxirgi raqam har xil, javob esa bitta: uchalasi ham 3 ga bo'linadi. Demak oxirgi raqam emas, raqamlar yig'indisi hal qiladi — u uchalasida ham 9 ga teng.",
      en: 'The order differs, the last digit differs, yet the answer is the same: all three divide by 3. So it is not the last digit that decides but the sum of the digits, which is 9 for all three.',
    },
    audio: {
      ru: [
        'Возьмём сто семнадцать и переставим цифры. Получаем сто семьдесят один и семьсот одиннадцать.',
        'Проверим делением. Сто семнадцать делится на три, сто семьдесят один делится, семьсот одиннадцать тоже делится. А последние цифры у них семь, один и один.',
        'Сложим цифры каждого числа. Один плюс один плюс семь это девять. И в остальных тоже девять. Решает сумма цифр, а не последняя цифра.',
      ],
      uz: [
        "Bir yuz o'n yettini olamiz va raqamlarini almashtiramiz. Bir yuz yetmish bir va yetti yuz o'n bir hosil bo'ladi.",
        "Bo'lib tekshiramiz. Bir yuz o'n yetti uchga bo'linadi, bir yuz yetmish bir bo'linadi, yetti yuz o'n bir ham bo'linadi. Oxirgi raqamlari esa yetti, bir va bir.",
        "Har bir sonning raqamlarini qo'shamiz. Bir qo'shuv bir qo'shuv yetti bu to'qqiz. Qolganlarida ham to'qqiz. Oxirgi raqam emas, raqamlar yig'indisi hal qiladi.",
      ],
      en: [
        'Take one hundred and seventeen and rearrange the digits. We get one hundred and seventy one and seven hundred and eleven.',
        'Check by dividing. One hundred and seventeen divides by three, one hundred and seventy one divides, seven hundred and eleven divides too. Their last digits are seven, one and one.',
        'Add the digits of each number. One plus one plus seven is nine. And nine in the others as well. The sum of the digits decides, not the last digit.',
      ],
    },
  },

  s_tool: {
    title: { ru: 'Складываем цифры', uz: "Raqamlarni qo'shamiz", en: 'Adding the digits' },
    demo_banner: { ru: 'Смотри — покажу на примере', uz: "Qarang — misolda ko'rsataman", en: 'Watch — I will show an example' },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    yes: { ru: 'Делится на 3', uz: "3 ga bo'linadi", en: 'Divides by 3' },
    no: { ru: 'Не делится на 3', uz: "3 ga bo'linmaydi", en: 'Does not divide by 3' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    demo_note: {
      ru: 'Сумма цифр 1 + 1 + 7 = 9. Девять делится на 3, значит и 117 делится на 3.',
      uz: "Raqamlar yig'indisi 1 + 1 + 7 = 9. To'qqiz 3 ga bo'linadi, demak 117 ham 3 ga bo'linadi.",
      en: 'The digits add up to 1 + 1 + 7 = 9. Nine divides by 3, so 117 divides by 3.',
    },
    play_ask: { ru: 'Делится ли 254 на 3?', uz: "254 soni 3 ga bo'linadimi?", en: 'Does 254 divide by 3?' },
    play_ok: {
      ru: 'Верно. 2 + 5 + 4 = 11, а 11 на 3 не делится. Значит и 254 не делится.',
      uz: "To'g'ri. 2 + 5 + 4 = 11, 11 esa 3 ga bo'linmaydi. Demak 254 ham bo'linmaydi.",
      en: 'Right. 2 + 5 + 4 = 11, and 11 does not divide by 3. So 254 does not either.',
    },
    play_wrong: {
      ru: 'Сложи цифры: 2 + 5 + 4 = 11. Одиннадцать на 3 не делится, значит и число не делится.',
      uz: "Raqamlarni qo'shing: 2 + 5 + 4 = 11. O'n bir 3 ga bo'linmaydi, demak son ham bo'linmaydi.",
      en: 'Add the digits: 2 + 5 + 4 = 11. Eleven does not divide by 3, so the number does not either.',
    },
    audio: {
      intro: {
        ru: 'Способ такой. Складываем все цифры числа и смотрим на сумму. Покажу на числе сто семнадцать.',
        uz: "Usul shunday. Sonning barcha raqamlarini qo'shamiz va yig'indiga qaraymiz. Bir yuz o'n yetti sonida ko'rsataman.",
        en: 'The method is this. Add all the digits of the number and look at the sum. I will show it on one hundred and seventeen.',
      },
      demo: {
        ru: 'Один плюс один плюс семь это девять. Девять делится на три, значит и сто семнадцать делится на три.',
        uz: "Bir qo'shuv bir qo'shuv yetti bu to'qqiz. To'qqiz uchga bo'linadi, demak bir yuz o'n yetti ham uchga bo'linadi.",
        en: 'One plus one plus seven is nine. Nine divides by three, so one hundred and seventeen divides by three.',
      },
      play: {
        ru: 'Теперь ваша очередь. Число двести пятьдесят четыре. Делится ли оно на три?',
        uz: "Endi sizning navbatingiz. Ikki yuz ellik to'rt soni. U uchga bo'linadimi?",
        en: 'Now it is your turn. The number two hundred and fifty four. Does it divide by three?',
      },
      ok: {
        ru: 'Верно. Два плюс пять плюс четыре это одиннадцать, а одиннадцать на три не делится.',
        uz: "To'g'ri. Ikki qo'shuv besh qo'shuv to'rt bu o'n bir, o'n bir esa uchga bo'linmaydi.",
        en: 'Right. Two plus five plus four is eleven, and eleven does not divide by three.',
      },
      wrong: {
        ru: 'Сложите цифры. Два плюс пять плюс четыре это одиннадцать. На три не делится, значит и число не делится.',
        uz: "Raqamlarni qo'shing. Ikki qo'shuv besh qo'shuv to'rt bu o'n bir. Uchga bo'linmaydi, demak son ham bo'linmaydi.",
        en: 'Add the digits. Two plus five plus four is eleven. It does not divide by three, so the number does not either.',
      },
    },
  },

  s_nine: {
    title: { ru: 'А что с девяткой', uz: "To'qqiz-chi", en: 'And what about nine' },
    rows: [
      { n: '117', s: 9, three: true, nine: true },
      { n: '132', s: 6, three: true, nine: false },
      { n: '450', s: 9, three: true, nine: true },
    ],
    done: {
      ru: 'Признак тот же — сумма цифр. Только для тройки сумма должна делиться на 3, а для девятки на 9. Всё, что делится на 9, делится и на 3.',
      uz: "Alomat o'sha — raqamlar yig'indisi. Faqat uchlik uchun yig'indi 3 ga, to'qqizlik uchun 9 ga bo'linishi kerak. 9 ga bo'linadigan har bir son 3 ga ham bo'linadi.",
      en: 'The rule is the same — the sum of the digits. Only for three the sum must divide by 3, and for nine by 9. Everything that divides by 9 divides by 3 as well.',
    },
    audio: {
      ru: [
        'Возьмём три числа: сто семнадцать, сто тридцать два и четыреста пятьдесят. Сложим цифры каждого.',
        'Суммы получились девять, шесть и девять. Все три делятся на три, значит и числа делятся на три.',
        'А на девять делятся только те, у кого сумма девять. Сто тридцать два не подходит: шесть на девять не делится. Заметьте: всё, что делится на девять, делится и на три.',
      ],
      uz: [
        "Uchta son olamiz: bir yuz o'n yetti, bir yuz o'ttiz ikki va to'rt yuz ellik. Har birining raqamlarini qo'shamiz.",
        "Yig'indilar to'qqiz, olti va to'qqiz chiqdi. Uchalasi ham uchga bo'linadi, demak sonlar ham uchga bo'linadi.",
        "To'qqizga esa faqat yig'indisi to'qqiz bo'lganlar bo'linadi. Bir yuz o'ttiz ikki mos emas: olti to'qqizga bo'linmaydi. E'tibor bering: to'qqizga bo'linadigan har bir son uchga ham bo'linadi.",
      ],
      en: [
        'Take three numbers: one hundred seventeen, one hundred thirty two and four hundred fifty. Add the digits of each.',
        'The sums are nine, six and nine. All three divide by three, so the numbers divide by three.',
        'By nine only those with the sum nine divide. One hundred thirty two does not fit: six does not divide by nine. Note that everything divisible by nine is divisible by three.',
      ],
    },
  },

  s_solve: {
    title: { ru: 'Число 4815', uz: '4815 soni', en: 'The number 4815' },
    lead: {
      ru: 'Четыре цифры — и всё равно хватает сложения.',
      uz: "To'rtta raqam — baribir qo'shish yetadi.",
      en: 'Four digits, and addition is still enough.',
    },
    steps: [
      { ru: '4 + 8 = 12', uz: '4 + 8 = 12', en: '4 + 8 = 12' },
      { ru: '12 + 1 = 13', uz: '12 + 1 = 13', en: '12 + 1 = 13' },
      { ru: '13 + 5 = 18', uz: '13 + 5 = 18', en: '13 + 5 = 18' },
    ],
    verdicts: [
      { ru: '18 : 3 = 6 — значит 4815 делится на 3', uz: "18 : 3 = 6 — demak 4815 soni 3 ga bo'linadi", en: '18 : 3 = 6, so 4815 divides by 3' },
      { ru: '18 : 9 = 2 — значит и на 9 тоже', uz: "18 : 9 = 2 — demak 9 ga ham", en: '18 : 9 = 2, so by 9 as well' },
    ],
    done: {
      ru: 'Сумма цифр 18. Она делится и на 3, и на 9 — значит и само число делится на 3 и на 9.',
      uz: "Raqamlar yig'indisi 18. U 3 ga ham, 9 ga ham bo'linadi — demak sonning o'zi ham 3 ga va 9 ga bo'linadi.",
      en: 'The digits add up to 18. It divides by 3 and by 9, so the number itself divides by 3 and by 9.',
    },
    audio: {
      ru: [
        'Решаем вместе. Число четыре тысячи восемьсот пятнадцать. Складываем цифры по порядку.',
        'Четыре плюс восемь двенадцать. Двенадцать плюс один тринадцать. Тринадцать плюс пять восемнадцать.',
        'Восемнадцать делится на три, значит и всё число делится на три.',
        'Восемнадцать делится и на девять, значит число делится и на девять. Одно сложение дало два ответа.',
      ],
      uz: [
        "Birga yechamiz. To'rt ming sakkiz yuz o'n besh soni. Raqamlarni tartib bilan qo'shamiz.",
        "To'rt qo'shuv sakkiz o'n ikki. O'n ikki qo'shuv bir o'n uch. O'n uch qo'shuv besh o'n sakkiz.",
        "O'n sakkiz uchga bo'linadi, demak butun son ham uchga bo'linadi.",
        "O'n sakkiz to'qqizga ham bo'linadi, demak son to'qqizga ham bo'linadi. Bitta qo'shish ikkita javob berdi.",
      ],
      en: [
        'Let us solve it together. The number four thousand eight hundred fifteen. Add the digits in order.',
        'Four plus eight is twelve. Twelve plus one is thirteen. Thirteen plus five is eighteen.',
        'Eighteen divides by three, so the whole number divides by three.',
        'Eighteen divides by nine as well, so the number divides by nine. One addition gave two answers.',
      ],
    },
  },

  s_edge: {
    title: { ru: 'Признак не считает за тебя', uz: "Alomat siz uchun hisoblamaydi", en: 'The rule does not count for you' },
    num: '117',
    cap_yes: { ru: 'делится на 3', uz: "3 ga bo'linadi", en: 'divides by 3' },
    cap_q: { ru: 'сколько наборов?', uz: "nechta to'plam?", en: 'how many sets?' },
    cap_res: { ru: '117 : 3 = 39 наборов', uz: "117 : 3 = 39 ta to'plam", en: '117 : 3 = 39 sets' },
    done: {
      ru: 'Признак отвечает только на вопрос «делится или нет». Сколько получится наборов — придётся посчитать делением.',
      uz: "Alomat faqat «bo'linadimi yoki yo'q» degan savolga javob beradi. Nechta to'plam chiqishini bo'lish bilan hisoblash kerak.",
      en: 'The rule answers only “does it divide or not”. How many sets you get still takes a division.',
    },
    audio: {
      ru: [
        'Важная граница. Сумма цифр сказала: сто семнадцать делится на три.',
        'Но сколько получится наборов, признак не говорит. Это придётся посчитать: сто семнадцать разделить на три будет тридцать девять.',
        'Запомним. Признак отвечает только делится или нет. Частное считаем сами.',
      ],
      uz: [
        "Muhim chegara. Raqamlar yig'indisi aytdi: bir yuz o'n yetti uchga bo'linadi.",
        "Lekin nechta to'plam chiqishini alomat aytmaydi. Buni hisoblash kerak: bir yuz o'n yettini uchga bo'lsak o'ttiz to'qqiz.",
        "Eslab qolamiz. Alomat faqat bo'linadi yoki yo'q deb javob beradi. Bo'linmani o'zimiz hisoblaymiz.",
      ],
      en: [
        'An important limit. The sum of the digits said: one hundred seventeen divides by three.',
        'But the rule does not say how many sets come out. That takes a division: one hundred seventeen divided by three is thirty nine.',
        'Let us remember. The rule answers only whether it divides. The quotient we count ourselves.',
      ],
    },
  },

  s_rule: {
    title: { ru: 'Признаки на 3 и на 9', uz: "3 va 9 ga bo'linish alomatlari", en: 'The rules for 3 and 9' },
    rule_1: {
      ru: 'Если сумма цифр числа делится на 3, то и само число делится на 3. Если сумма цифр делится на 9, то число делится на 9.',
      uz: "Agar sonning raqamlari yig'indisi 3 ga bo'linsa, sonning o'zi ham 3 ga bo'linadi. Agar yig'indi 9 ga bo'linsa, son 9 ga bo'linadi.",
      en: 'If the sum of the digits divides by 3, the number divides by 3. If the sum divides by 9, the number divides by 9.',
    },
    rule_2: {
      ru: 'Значки с ярмарки: 1 + 1 + 7 = 9, значит 117 делится на 3. Права была Дилноза — последняя цифра тут ничего не решает.',
      uz: "Yarmarkadagi nishonlar: 1 + 1 + 7 = 9, demak 117 soni 3 ga bo'linadi. Dilnoza haq edi — bu yerda oxirgi raqam hech narsani hal qilmaydi.",
      en: 'The badges from the fair: 1 + 1 + 7 = 9, so 117 divides by 3. Dilnoza was right — the last digit decides nothing here.',
    },
    audio: {
      ru: 'Запомним правило. Если сумма цифр числа делится на три, то и само число делится на три. Если сумма цифр делится на девять, то число делится на девять. И вернёмся к ярмарке. Один плюс один плюс семь это девять, значит сто семнадцать делится на три. Права была Дилноза, а последняя цифра тут ничего не решает.',
      uz: "Qoidani eslab qolamiz. Agar sonning raqamlari yig'indisi uchga bo'linsa, sonning o'zi ham uchga bo'linadi. Agar yig'indi to'qqizga bo'linsa, son to'qqizga bo'linadi. Va yarmarkaga qaytamiz. Bir qo'shuv bir qo'shuv yetti bu to'qqiz, demak bir yuz o'n yetti uchga bo'linadi. Dilnoza haq edi, oxirgi raqam esa bu yerda hech narsani hal qilmaydi.",
      en: 'Let us remember the rule. If the sum of the digits divides by three, the number divides by three. If the sum divides by nine, the number divides by nine. And back to the fair. One plus one plus seven is nine, so one hundred seventeen divides by three. Dilnoza was right, and the last digit decides nothing here.',
    },
  },

  s_names: {
    title: { ru: 'На что делится число', uz: "Son nimaga bo'linadi", en: 'What the number divides by' },
    lead: { ru: 'Сложи цифры и посмотри на сумму.', uz: "Raqamlarni qo'shing va yig'indiga qarang.", en: 'Add the digits and look at the sum.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Число 261. Сумма цифр 9. На что делится?', uz: "261 soni. Raqamlar yig'indisi 9. Nimaga bo'linadi?", en: 'The number 261. The digits add up to 9. What does it divide by?' },
        opts: [
          { ru: 'Только на 3', uz: 'Faqat 3 ga', en: 'Only by 3' },
          { ru: 'И на 3, и на 9', uz: "3 ga ham, 9 ga ham", en: 'By 3 and by 9' },
          { ru: 'Ни на 3, ни на 9', uz: "Na 3 ga, na 9 ga", en: 'Neither by 3 nor by 9' },
        ],
        correct: 1,
        ok: { ru: 'Верно. Сумма 9 делится и на 3, и на 9, значит и число делится на оба.', uz: "To'g'ri. 9 yig'indisi 3 ga ham, 9 ga ham bo'linadi, demak son ikkalasiga bo'linadi.", en: 'Right. The sum 9 divides by 3 and by 9, so the number divides by both.' },
        wrong: [
          { ru: 'На 3 — да. Но сумма 9 делится и на 9, значит число делится и на 9.', uz: "3 ga — ha. Lekin 9 yig'indisi 9 ga ham bo'linadi, demak son 9 ga ham bo'linadi.", en: 'By 3 yes. But the sum 9 divides by 9 too, so the number divides by 9 as well.' },
          null,
          { ru: 'Сумма цифр 9 — она делится на 3. Значит и число делится.', uz: "Raqamlar yig'indisi 9 — u 3 ga bo'linadi. Demak son ham bo'linadi.", en: 'The digits add up to 9, which divides by 3. So the number divides too.' },
        ],
      },
      {
        q: { ru: 'Число 132. Сумма цифр 6. На что делится?', uz: "132 soni. Raqamlar yig'indisi 6. Nimaga bo'linadi?", en: 'The number 132. The digits add up to 6. What does it divide by?' },
        opts: [
          { ru: 'Только на 3', uz: 'Faqat 3 ga', en: 'Only by 3' },
          { ru: 'И на 3, и на 9', uz: "3 ga ham, 9 ga ham", en: 'By 3 and by 9' },
          { ru: 'Только на 9', uz: 'Faqat 9 ga', en: 'Only by 9' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 6 делится на 3, но не делится на 9. Значит 132 делится только на 3.', uz: "To'g'ri. 6 soni 3 ga bo'linadi, 9 ga esa bo'linmaydi. Demak 132 faqat 3 ga bo'linadi.", en: 'Right. Six divides by 3 but not by 9. So 132 divides only by 3.' },
        wrong: [
          null,
          { ru: 'Сумма 6 на 9 не делится: 6 меньше девяти. Значит на 9 число не делится.', uz: "6 yig'indisi 9 ga bo'linmaydi: 6 to'qqizdan kichik. Demak son 9 ga bo'linmaydi.", en: 'The sum 6 does not divide by 9: six is less than nine. So the number does not divide by 9.' },
          { ru: 'На 9 нет, а вот на 3 да: 6 делится на 3.', uz: "9 ga yo'q, 3 ga esa ha: 6 soni 3 ga bo'linadi.", en: 'Not by 9, but by 3 yes: six divides by 3.' },
        ],
      },
      {
        q: { ru: 'Число 245. Сумма цифр 11. На что делится?', uz: "245 soni. Raqamlar yig'indisi 11. Nimaga bo'linadi?", en: 'The number 245. The digits add up to 11. What does it divide by?' },
        opts: [
          { ru: 'Только на 3', uz: 'Faqat 3 ga', en: 'Only by 3' },
          { ru: 'И на 3, и на 9', uz: "3 ga ham, 9 ga ham", en: 'By 3 and by 9' },
          { ru: 'Ни на 3, ни на 9', uz: "Na 3 ga, na 9 ga", en: 'Neither by 3 nor by 9' },
        ],
        correct: 2,
        ok: { ru: 'Верно. 11 не делится ни на 3, ни на 9 — значит и 245 не делится.', uz: "To'g'ri. 11 na 3 ga, na 9 ga bo'linadi — demak 245 ham bo'linmaydi.", en: 'Right. Eleven divides by neither 3 nor 9, so 245 does not either.' },
        wrong: [
          { ru: '11 на 3 не делится: 3 · 3 = 9, 3 · 4 = 12. Значит и число не делится.', uz: "11 soni 3 ga bo'linmaydi: 3 · 3 = 9, 3 · 4 = 12. Demak son ham bo'linmaydi.", en: 'Eleven does not divide by 3: 3 · 3 = 9, 3 · 4 = 12. So the number does not either.' },
          { ru: 'Сумма 11 не делится ни на 3, ни на 9.', uz: "11 yig'indisi na 3 ga, na 9 ga bo'linadi.", en: 'The sum 11 divides by neither 3 nor 9.' },
          null,
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика. Сумма цифр уже посчитана, вам остаётся решить, на что делится число.',
        uz: "Mashq. Raqamlar yig'indisi hisoblab qo'yilgan, sizga son nimaga bo'linishini aytish qoladi.",
        en: 'Practice. The sum of the digits is already worked out; you decide what the number divides by.',
      },
    },
  },

  s_sum: {
    title: { ru: 'Считаем сумму цифр', uz: "Raqamlar yig'indisini hisoblaymiz", en: 'Adding the digits' },
    lead: { ru: 'Сначала сумма, потом ответ.', uz: "Avval yig'indi, keyin javob.", en: 'First the sum, then the answer.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Делится ли 423 на 3?', uz: "423 soni 3 ga bo'linadimi?", en: 'Does 423 divide by 3?' },
        opts: [{ ru: 'Да', uz: 'Ha', en: 'Yes' }, { ru: 'Нет', uz: "Yo'q", en: 'No' }],
        correct: 0,
        ok: { ru: 'Верно. 4 + 2 + 3 = 9, а 9 делится на 3.', uz: "To'g'ri. 4 + 2 + 3 = 9, 9 esa 3 ga bo'linadi.", en: 'Right. 4 + 2 + 3 = 9, and 9 divides by 3.' },
        wrong: [null, { ru: 'Сложи цифры: 4 + 2 + 3 = 9. Девять делится на 3, значит и число делится.', uz: "Raqamlarni qo'shing: 4 + 2 + 3 = 9. To'qqiz 3 ga bo'linadi, demak son ham bo'linadi.", en: 'Add the digits: 4 + 2 + 3 = 9. Nine divides by 3, so the number does too.' }],
      },
      {
        q: { ru: 'Делится ли 581 на 3?', uz: "581 soni 3 ga bo'linadimi?", en: 'Does 581 divide by 3?' },
        opts: [{ ru: 'Да', uz: 'Ha', en: 'Yes' }, { ru: 'Нет', uz: "Yo'q", en: 'No' }],
        correct: 1,
        ok: { ru: 'Верно. 5 + 8 + 1 = 14, а 14 на 3 не делится.', uz: "To'g'ri. 5 + 8 + 1 = 14, 14 esa 3 ga bo'linmaydi.", en: 'Right. 5 + 8 + 1 = 14, and 14 does not divide by 3.' },
        wrong: [{ ru: 'Сумма 14. Между 12 и 15 — на 3 не делится, значит и число нет.', uz: "Yig'indi 14. 12 va 15 orasida — 3 ga bo'linmaydi, demak son ham yo'q.", en: 'The sum is 14. Between 12 and 15, so it does not divide by 3, and neither does the number.' }, null],
      },
      {
        q: { ru: 'Делится ли 909 на 9?', uz: "909 soni 9 ga bo'linadimi?", en: 'Does 909 divide by 9?' },
        opts: [{ ru: 'Да', uz: 'Ha', en: 'Yes' }, { ru: 'Нет', uz: "Yo'q", en: 'No' }],
        correct: 0,
        ok: { ru: 'Верно. 9 + 0 + 9 = 18, а 18 делится на 9.', uz: "To'g'ri. 9 + 0 + 9 = 18, 18 esa 9 ga bo'linadi.", en: 'Right. 9 + 0 + 9 = 18, and 18 divides by 9.' },
        wrong: [null, { ru: 'Ноль в середине ничего не портит: 9 + 0 + 9 = 18, а 18 делится на 9.', uz: "O'rtadagi nol hech narsani buzmaydi: 9 + 0 + 9 = 18, 18 esa 9 ga bo'linadi.", en: 'The zero in the middle spoils nothing: 9 + 0 + 9 = 18, and 18 divides by 9.' }],
      },
      {
        q: { ru: 'Делится ли 246 на 9?', uz: "246 soni 9 ga bo'linadimi?", en: 'Does 246 divide by 9?' },
        opts: [{ ru: 'Да', uz: 'Ha', en: 'Yes' }, { ru: 'Нет', uz: "Yo'q", en: 'No' }],
        correct: 1,
        ok: { ru: 'Верно. 2 + 4 + 6 = 12. На 3 делится, на 9 нет.', uz: "To'g'ri. 2 + 4 + 6 = 12. 3 ga bo'linadi, 9 ga yo'q.", en: 'Right. 2 + 4 + 6 = 12. It divides by 3, not by 9.' },
        wrong: [{ ru: 'Сумма 12 делится на 3, но не на 9. Для девятки нужна сумма 9, 18, 27.', uz: "12 yig'indisi 3 ga bo'linadi, 9 ga esa yo'q. To'qqizlik uchun yig'indi 9, 18, 27 bo'lishi kerak.", en: 'The sum 12 divides by 3 but not by 9. Nine needs a sum of 9, 18 or 27.' }, null],
      },
    ],
    audio: {
      intro: {
        ru: 'Теперь сумму считаете сами. Складывайте цифры и отвечайте.',
        uz: "Endi yig'indini o'zingiz hisoblaysiz. Raqamlarni qo'shing va javob bering.",
        en: 'Now you work out the sum yourself. Add the digits and answer.',
      },
    },
  },

  s_bins: {
    title: { ru: 'Разложи по тройке', uz: "Uchlik bo'yicha ajrating", en: 'Sort by three' },
    lead: { ru: 'Сумма цифр решает, в какую корзину.', uz: "Raqamlar yig'indisi qaysi savatga tushishini hal qiladi.", en: 'The sum of the digits decides which basket.' },
    bin_a: { ru: 'Делится на 3', uz: "3 ga bo'linadi", en: 'Divides by 3' },
    bin_b: { ru: 'Не делится на 3', uz: "3 ga bo'linmaydi", en: 'Does not divide by 3' },
    cards: [
      { label: '141', bin: 'a' },
      { label: '250', bin: 'b' },
      { label: '333', bin: 'a' },
      { label: '407', bin: 'b' },
      { label: '612', bin: 'a' },
      { label: '154', bin: 'b' },
    ],
    hint: {
      ru: 'Сложи цифры и проверь сумму: делится она на 3 или нет?',
      uz: "Raqamlarni qo'shing va yig'indini tekshiring: u 3 ga bo'linadimi yoki yo'q?",
      en: 'Add the digits and check the sum: does it divide by 3 or not?',
    },
    correct_text: {
      ru: 'Верно. Суммы 6, 9 и 9 делятся на 3, а суммы 7, 11 и 10 — нет.',
      uz: "To'g'ri. 6, 9 va 9 yig'indilari 3 ga bo'linadi, 7, 11 va 10 esa yo'q.",
      en: 'Right. The sums 6, 9 and 9 divide by 3, and the sums 7, 11 and 10 do not.',
    },
    audio: {
      intro: {
        ru: 'Разложите числа на две группы. Складывайте цифры и смотрите на сумму.',
        uz: "Sonlarni ikki guruhga ajrating. Raqamlarni qo'shing va yig'indiga qarang.",
        en: 'Sort the numbers into two groups. Add the digits and look at the sum.',
      },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда. Пересчитай сумму цифр.', uz: "Bu yerga emas. Raqamlar yig'indisini qayta sanang.", en: 'Not here. Add the digits again.' },
    },
  },

  s_error: {
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikidek tekshiring.", en: 'Check someone else’s work the way you would check your own.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Азиз: «У 216 сумма цифр 9, значит делится на 9. И на 3 не делится». Где ошибка?', uz: "Aziz: «216 ning raqamlar yig'indisi 9, demak 9 ga bo'linadi. 3 ga esa bo'linmaydi». Xato qayerda?", en: 'Aziz: “216 has digit sum 9, so it divides by 9. And it does not divide by 3.” Where is the mistake?' },
        opts: [
          { ru: 'Ошибка во второй части', uz: 'Xato ikkinchi qismda', en: 'The mistake is in the second part' },
          { ru: 'Ошибка в сумме цифр', uz: "Xato raqamlar yig'indisida", en: 'The mistake is in the digit sum' },
          { ru: 'Ошибки нет', uz: "Xato yo'q", en: 'There is no mistake' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Всё, что делится на 9, делится и на 3: 216 : 3 = 72.', uz: "To'g'ri. 9 ga bo'linadigan har bir son 3 ga ham bo'linadi: 216 : 3 = 72.", en: 'Right. Everything divisible by 9 is divisible by 3: 216 : 3 = 72.' },
        wrong: [
          null,
          { ru: 'Сумма посчитана верно: 2 + 1 + 6 = 9. Ошибка в другом.', uz: "Yig'indi to'g'ri hisoblangan: 2 + 1 + 6 = 9. Xato boshqa joyda.", en: 'The sum is right: 2 + 1 + 6 = 9. The mistake is elsewhere.' },
          { ru: 'Ошибка есть: число, делящееся на 9, всегда делится и на 3.', uz: "Xato bor: 9 ga bo'linadigan son doim 3 ga ham bo'linadi.", en: 'There is a mistake: a number divisible by 9 always divides by 3.' },
        ],
      },
      {
        q: { ru: 'Дилноза: «У 51 последняя цифра 1, значит на 3 не делится». В чём ошибка?', uz: "Dilnoza: «51 ning oxirgi raqami 1, demak 3 ga bo'linmaydi». Xato nimada?", en: 'Dilnoza: “51 ends in 1, so it does not divide by 3.” What is wrong?' },
        opts: [
          { ru: 'Для тройки последняя цифра не решает', uz: "Uchlik uchun oxirgi raqam hal qilmaydi", en: 'For three the last digit does not decide' },
          { ru: 'Ответ верный', uz: "Javob to'g'ri", en: 'The answer is right' },
          { ru: 'Надо было смотреть на первую цифру', uz: "Birinchi raqamga qarash kerak edi", en: 'She should have looked at the first digit' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 5 + 1 = 6, а 6 делится на 3: 51 : 3 = 17.', uz: "To'g'ri. 5 + 1 = 6, 6 esa 3 ga bo'linadi: 51 : 3 = 17.", en: 'Right. 5 + 1 = 6, and 6 divides by 3: 51 : 3 = 17.' },
        wrong: [
          null,
          { ru: 'Ответ неверный: 51 : 3 = 17, делится. Последняя цифра тут ни при чём.', uz: "Javob noto'g'ri: 51 : 3 = 17, bo'linadi. Oxirgi raqamning bunga aloqasi yo'q.", en: 'The answer is wrong: 51 : 3 = 17, it does divide. The last digit is irrelevant.' },
          { ru: 'Ни первая, ни последняя цифра сами по себе не решают — решает их сумма.', uz: "Na birinchi, na oxirgi raqam o'zicha hal qilmaydi — ularning yig'indisi hal qiladi.", en: 'Neither the first nor the last digit decides on its own — their sum does.' },
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

  s_task: {
    title: { ru: 'Наборы значков', uz: "Nishon to'plamlari", en: 'Badge sets' },
    lead: { ru: 'На ярмарке пять коробок. В наборе 3 значка, все наборы должны быть полными.', uz: "Yarmarkada beshta quti bor. To'plamda 3 ta nishon, barcha to'plamlar to'la bo'lishi kerak.", en: 'There are five boxes at the fair. A set holds 3 badges and every set must be full.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    boxes: ['117', '124', '150', '203', '351'],
    items: [
      {
        q: { ru: 'Из каких коробок наборы выйдут полными?', uz: "Qaysi qutilardan to'plamlar to'la chiqadi?", en: 'Which boxes give full sets?' },
        opts: [
          { ru: '117, 150 и 351', uz: '117, 150 va 351', en: '117, 150 and 351' },
          { ru: '124, 150 и 203', uz: '124, 150 va 203', en: '124, 150 and 203' },
          { ru: 'Все пять', uz: 'Beshalasi', en: 'All five' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Суммы цифр 9, 6 и 9 делятся на 3. У 124 сумма 7, у 203 сумма 5 — не делятся.', uz: "To'g'ri. 9, 6 va 9 yig'indilari 3 ga bo'linadi. 124 da yig'indi 7, 203 da 5 — bo'linmaydi.", en: 'Right. The sums 9, 6 and 9 divide by 3. 124 has sum 7 and 203 has sum 5, which do not.' },
        wrong: [
          null,
          { ru: 'У 124 сумма 7, у 203 сумма 5 — обе на 3 не делятся.', uz: "124 da yig'indi 7, 203 da 5 — ikkalasi ham 3 ga bo'linmaydi.", en: '124 has sum 7 and 203 has sum 5; neither divides by 3.' },
          { ru: 'Не все: 124 и 203 дают суммы 7 и 5, они на 3 не делятся.', uz: "Hammasi emas: 124 va 203 ning yig'indilari 7 va 5, ular 3 ga bo'linmaydi.", en: 'Not all: 124 and 203 give sums 7 and 5, which do not divide by 3.' },
        ],
      },
      {
        q: { ru: 'В какой коробке значков хватит и на наборы по 9?', uz: "Qaysi qutidagi nishonlar 9 tadan to'plamga ham yetadi?", en: 'Which box also fills sets of 9?' },
        opts: [
          { ru: '117', uz: '117', en: '117' },
          { ru: '150', uz: '150', en: '150' },
          { ru: '351', uz: '351', en: '351' },
        ],
        correct: 0,
        ok: { ru: 'Верно. У 117 сумма цифр 9 — делится и на 3, и на 9: 117 : 9 = 13.', uz: "To'g'ri. 117 ning raqamlar yig'indisi 9 — 3 ga ham, 9 ga ham bo'linadi: 117 : 9 = 13.", en: 'Right. 117 has digit sum 9: it divides by 3 and by 9, since 117 : 9 = 13.' },
        wrong: [
          null,
          { ru: 'У 150 сумма 6: на 3 делится, на 9 нет.', uz: "150 da yig'indi 6: 3 ga bo'linadi, 9 ga yo'q.", en: '150 has sum 6: it divides by 3, not by 9.' },
          { ru: 'У 351 сумма 9 — делится на 9. Но 117 тоже, а его спрашивают первым.', uz: "351 da yig'indi 9 — 9 ga bo'linadi. Lekin 117 ham shunday, u birinchi so'ralyapti.", en: '351 has sum 9 and divides by 9. But so does 117, and it comes first.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Задача с ярмарки. Пять коробок, в наборе три значка. Складывайте цифры каждого числа.',
        uz: "Yarmarkadan masala. Beshta quti, to'plamda uchta nishon. Har bir sonning raqamlarini qo'shing.",
        en: 'A problem from the fair. Five boxes, three badges to a set. Add the digits of each number.',
      },
    },
  },

  s_final: {
    intro_line: { ru: 'Пять заданий на весь урок.', uz: 'Butun darsga beshta topshiriq.', en: 'Five tasks covering the whole lesson.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        kind: 'num', ans: 18,
        q: { ru: 'Чему равна сумма цифр числа 4815? Набери ответ.', uz: "4815 sonining raqamlar yig'indisi nechaga teng? Javobni tering.", en: 'What is the digit sum of 4815? Type the answer.' },
        hint: { ru: 'Складывай по порядку: 4 + 8 = 12, 12 + 1 = 13, 13 + 5.', uz: "Tartib bilan qo'shing: 4 + 8 = 12, 12 + 1 = 13, 13 + 5.", en: 'Add in order: 4 + 8 = 12, 12 + 1 = 13, 13 + 5.' },
        hint_audio: { ru: 'Складывайте по порядку. Четыре плюс восемь двенадцать, плюс один тринадцать, плюс пять.', uz: "Tartib bilan qo'shing. To'rt qo'shuv sakkiz o'n ikki, qo'shuv bir o'n uch, qo'shuv besh.", en: 'Add in order. Four plus eight is twelve, plus one is thirteen, plus five.' },
      },
      {
        kind: 'mc', correctIndex: 2,
        q: { ru: 'Какое число делится на 9?', uz: "Qaysi son 9 ga bo'linadi?", en: 'Which number divides by 9?' },
        opts: ['142', '231', '432', '517'],
        wrong: [
          { ru: 'Сумма 1 + 4 + 2 = 7 — ни на 3, ни на 9.', uz: "1 + 4 + 2 = 7 yig'indisi — na 3 ga, na 9 ga.", en: 'The sum 1 + 4 + 2 = 7 divides by neither 3 nor 9.' },
          { ru: 'Сумма 2 + 3 + 1 = 6 — на 3 делится, на 9 нет.', uz: "2 + 3 + 1 = 6 yig'indisi — 3 ga bo'linadi, 9 ga yo'q.", en: 'The sum 2 + 3 + 1 = 6 divides by 3, not by 9.' },
          null,
          { ru: 'Сумма 5 + 1 + 7 = 13 — не делится ни на 3, ни на 9.', uz: "5 + 1 + 7 = 13 yig'indisi — na 3 ga, na 9 ga bo'linadi.", en: 'The sum 5 + 1 + 7 = 13 divides by neither 3 nor 9.' },
        ],
        correct: { ru: 'Верно. 4 + 3 + 2 = 9, значит 432 делится и на 9, и на 3.', uz: "To'g'ri. 4 + 3 + 2 = 9, demak 432 soni 9 ga ham, 3 ga ham bo'linadi.", en: 'Right. 4 + 3 + 2 = 9, so 432 divides by 9 and by 3.' },
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'Число делится на 9. Что про него точно верно?', uz: "Son 9 ga bo'linadi. U haqida nima aniq to'g'ri?", en: 'A number divides by 9. What is certainly true?' },
        opts: [
          { ru: 'Оно чётное', uz: 'U juft', en: 'It is even' },
          { ru: 'Оно делится на 3', uz: "U 3 ga bo'linadi", en: 'It divides by 3' },
          { ru: 'Оно кончается на 9', uz: 'U 9 bilan tugaydi', en: 'It ends in 9' },
          { ru: 'Ничего сказать нельзя', uz: "Hech narsa deyish mumkin emas", en: 'You cannot tell' },
        ],
        wrong: [
          { ru: '27 делится на 9, но оно нечётное.', uz: "27 soni 9 ga bo'linadi, lekin u toq.", en: '27 divides by 9 but it is odd.' },
          null,
          { ru: '18 делится на 9, а кончается на 8.', uz: "18 soni 9 ga bo'linadi, oxiri esa 8.", en: '18 divides by 9 and ends in 8.' },
          { ru: 'Сказать можно: девятка всегда тянет за собой тройку.', uz: "Deyish mumkin: to'qqiz doim uchlikni ergashtiradi.", en: 'You can tell: nine always brings three along.' },
        ],
        correct: { ru: 'Верно. Сумма цифр делится на 9, а значит и на 3.', uz: "To'g'ri. Raqamlar yig'indisi 9 ga bo'linadi, demak 3 ga ham.", en: 'Right. The digit sum divides by 9, hence by 3 as well.' },
      },
      {
        kind: 'mc', correctIndex: 3,
        q: { ru: 'Какое число НЕ делится на 3?', uz: "Qaysi son 3 ga BO'LINMAYDI?", en: 'Which number does NOT divide by 3?' },
        opts: ['312', '405', '726', '832'],
        wrong: [
          { ru: 'Сумма 3 + 1 + 2 = 6, делится на 3.', uz: "3 + 1 + 2 = 6 yig'indisi 3 ga bo'linadi.", en: 'The sum 3 + 1 + 2 = 6 divides by 3.' },
          { ru: 'Сумма 4 + 0 + 5 = 9, делится на 3.', uz: "4 + 0 + 5 = 9 yig'indisi 3 ga bo'linadi.", en: 'The sum 4 + 0 + 5 = 9 divides by 3.' },
          { ru: 'Сумма 7 + 2 + 6 = 15, делится на 3.', uz: "7 + 2 + 6 = 15 yig'indisi 3 ga bo'linadi.", en: 'The sum 7 + 2 + 6 = 15 divides by 3.' },
          null,
        ],
        correct: { ru: 'Верно. 8 + 3 + 2 = 13, а 13 на 3 не делится.', uz: "To'g'ri. 8 + 3 + 2 = 13, 13 esa 3 ga bo'linmaydi.", en: 'Right. 8 + 3 + 2 = 13, and 13 does not divide by 3.' },
      },
      {
        kind: 'mc', correctIndex: 0,
        q: { ru: 'Признак по сумме цифр работает для двойки?', uz: "Raqamlar yig'indisi alomati ikkilik uchun ishlaydimi?", en: 'Does the digit-sum rule work for two?' },
        opts: [
          { ru: 'Нет, у двойки своя проверка', uz: "Yo'q, ikkilikning o'z tekshiruvi bor", en: 'No, two has its own check' },
          { ru: 'Да, как для тройки', uz: 'Ha, xuddi uchlikdagidek', en: 'Yes, just like for three' },
          { ru: 'Да, если сумма чётная', uz: "Ha, agar yig'indi juft bo'lsa", en: 'Yes, if the sum is even' },
          { ru: 'Только для трёхзначных', uz: "Faqat uch xonali sonlar uchun", en: 'Only for three-digit numbers' },
        ],
        wrong: [
          null,
          { ru: 'У 12 сумма 3 — нечётная, а 12 делится на 2. Приём не тот.', uz: "12 da yig'indi 3 — toq, 12 esa 2 ga bo'linadi. Usul boshqa.", en: '12 has sum 3, which is odd, yet 12 divides by 2. Wrong tool.' },
          { ru: 'У 15 сумма 6 — чётная, а 15 на 2 не делится.', uz: "15 da yig'indi 6 — juft, 15 esa 2 ga bo'linmaydi.", en: '15 has sum 6, which is even, yet 15 does not divide by 2.' },
          { ru: 'Дело не в количестве цифр: для двойки смотрят на последнюю цифру.', uz: "Gap raqamlar sonida emas: ikkilik uchun oxirgi raqamga qaraladi.", en: 'It is not about how many digits: for two you look at the last digit.' },
        ],
        correct: { ru: 'Верно. Для 2, 5 и 10 смотрят на последнюю цифру, для 3 и 9 — на сумму цифр.', uz: "To'g'ri. 2, 5 va 10 uchun oxirgi raqamga, 3 va 9 uchun raqamlar yig'indisiga qaraladi.", en: 'Right. For 2, 5 and 10 you look at the last digit; for 3 and 9 at the digit sum.' },
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
      ru: 'Признак по сумме цифр работает потому, что 10, 100 и 1000 при делении на 9 дают остаток 1. Поэтому от числа остаётся ровно сумма его цифр.',
      uz: "Raqamlar yig'indisi alomati shuning uchun ishlaydi: 10, 100 va 1000 ni 9 ga bo'lganda qoldiq 1 chiqadi. Shuning uchun sondan aynan raqamlar yig'indisi qoladi.",
      en: 'The digit-sum rule works because 10, 100 and 1000 leave a remainder of 1 when divided by 9. What is left of the number is exactly the sum of its digits.',
    },
    fact_audio: {
      ru: 'Знаешь ли ты? Признак по сумме цифр работает потому, что десять, сто и тысяча при делении на девять дают остаток один. Поэтому от числа остаётся ровно сумма его цифр.',
      uz: "Bilasizmi? Raqamlar yig'indisi alomati shuning uchun ishlaydi: o'n, yuz va ming ni to'qqizga bo'lganda qoldiq bir chiqadi. Shuning uchun sondan aynan raqamlar yig'indisi qoladi.",
      en: 'Did you know? The digit-sum rule works because ten, one hundred and one thousand leave a remainder of one when divided by nine. What is left of the number is exactly the sum of its digits.',
    },
  },

  s14: {
    banner: { ru: 'Математика · Делимость', uz: "Matematika · Bo'linish", en: 'Mathematics · Divisibility' },
    heading: { ru: 'Признаки на 3 и 9', uz: "3 va 9 ga bo'linish alomatlari", en: 'The rules for 3 and 9' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    brief_1: { ru: 'сумма цифр делится на 3 → число делится на 3', uz: "raqamlar yig'indisi 3 ga bo'linsa → son 3 ga bo'linadi", en: 'digit sum divides by 3 → the number does' },
    brief_2: { ru: 'сумма цифр делится на 9 → число делится на 9', uz: "raqamlar yig'indisi 9 ga bo'linsa → son 9 ga bo'linadi", en: 'digit sum divides by 9 → the number does' },
    brief_3: { ru: 'делится на 9 → делится и на 3', uz: "9 ga bo'linsa → 3 ga ham bo'linadi", en: 'divides by 9 → divides by 3 too' },
    memo_title: { ru: 'Что помнить', uz: 'Nimani eslash kerak', en: 'What to remember' },
    memo_q1: { ru: 'Куда смотреть', uz: 'Qayerga qarash kerak', en: 'Where to look' },
    memo_a1: { ru: 'на сумму цифр, а не на последнюю', uz: "oxirgisiga emas, raqamlar yig'indisiga", en: 'at the digit sum, not the last digit' },
    memo_q2: { ru: 'Порядок цифр', uz: 'Raqamlar tartibi', en: 'The order of digits' },
    memo_a2: { ru: 'не важен: 117, 171 и 711 одинаковы', uz: "muhim emas: 117, 171 va 711 bir xil", en: 'does not matter: 117, 171 and 711 behave alike' },
    memo_q3: { ru: 'Что признак не даёт', uz: "Alomat nimani bermaydi", en: 'What the rule will not give' },
    memo_a3: { ru: 'частное — его считают делением', uz: "bo'linmani — uni bo'lish bilan hisoblaydilar", en: 'the quotient: that takes a division' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'Если сумма цифр делится на три, то и число делится на три. Если сумма делится на девять, то число делится на девять. И всё, что делится на девять, делится на три.',
        'Значки с ярмарки разошлись по наборам: сто семнадцать разделить на три это тридцать девять полных наборов. Права была Дилноза.',
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "Agar raqamlar yig'indisi uchga bo'linsa, son ham uchga bo'linadi. Agar yig'indi to'qqizga bo'linsa, son to'qqizga bo'linadi. To'qqizga bo'linadigan har bir son uchga ham bo'linadi.",
        "Yarmarkadagi nishonlar to'plamlarga tarqaldi: bir yuz o'n yettini uchga bo'lsak o'ttiz to'qqizta to'la to'plam. Dilnoza haq edi.",
      ],
      en: [
        'The lesson is done. Let us gather the main points.',
        'If the digit sum divides by three, the number divides by three. If the sum divides by nine, the number divides by nine. And everything divisible by nine is divisible by three.',
        'The badges from the fair went into sets: one hundred seventeen divided by three is thirty nine full sets. Dilnoza was right.',
      ],
    },
  },

  s_methods: {
    m1_title: { ru: 'Способ. Сложить цифры', uz: "Usul. Raqamlarni qo'shish", en: 'Method. Add the digits' },
    m1_steps: {
      ru: ['Сложи все цифры числа', 'Посмотри на сумму', 'Делится сумма — делится и число'],
      uz: ["Sonning barcha raqamlarini qo'shing", "Yig'indiga qarang", "Yig'indi bo'linsa — son ham bo'linadi"],
      en: ['Add all the digits', 'Look at the sum', 'If the sum divides, so does the number'],
    },
    m1_no: {
      ru: 'Сумма длинная — сложи её цифры ещё раз: для 9 это можно повторять.',
      uz: "Yig'indi uzun bo'lsa — uning raqamlarini yana qo'shing: 9 uchun buni takrorlash mumkin.",
      en: 'If the sum is long, add its digits again: for 9 you may repeat this.',
    },
  },
};

// ============================================================
// СЦЕНЫ УРОКА: школьная ярмарка. На хуке вопрос, в итоге ответ.
// Только фигуры, ни картинок, ни эмодзи. У людей есть лицо.
// ============================================================
const FAIR_SHIRTS = ['#7ECBE6', '#F5C77E', '#8FD6B4'];

// Значок: кружок с ленточкой — так он отличается от монеты урока 2.
const Badge = ({ x, y, r = 5, tone = '#F5C77E' }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d={`M${-r * 0.5} ${r * 0.7} l${-r * 0.35} ${r * 1.5} l${r * 0.85} ${-r * 0.6} l${r * 0.85} ${r * 0.6} l${-r * 0.35} ${-r * 1.5} z`} fill="#D8A93A" opacity="0.75"/>
    <circle cx="0" cy="0" r={r} fill={tone} stroke="#C48F2E" strokeWidth="0.6"/>
    <circle cx="0" cy="0" r={r * 0.42} fill="#FFFFFF" opacity="0.55"/>
  </g>
);

// Фигура человека с лицом. Масштаб задаётся радиусом головы.

// Гирлянда флажков над прилавком: качается, как баннер в спортзале урока 1.
const Flags = ({ y = 14 }) => (
  <g className="d3-flags">
    <path d={`M6 ${y} q100 14 194 0 q100 -14 194 0`} stroke="#D9CDB5" strokeWidth="1.2" fill="none"/>
    {[24, 60, 96, 132, 168, 204, 240, 276, 312, 348].map((x, i) => {
      const dy = Math.abs(200 - x) < 100 ? 6 : 2;
      return <path key={x} d={`M${x - 7} ${y + dy} h14 l-7 13 z`} fill={FAIR_SHIRTS[i % 3]} opacity="0.9"/>;
    })}
  </g>
);

const HookScene = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="d3wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F9F4EB"/><stop offset="100%" stopColor="#EFE7D8"/>
      </linearGradient>
      <linearGradient id="d3table" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#E7C99A"/><stop offset="100%" stopColor="#D2A96F"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="400" height="154" fill="url(#d3wall)"/>
    <Flags/>

    {/* Табличка стенда с числом значков */}
    <g>
      <rect x="150" y="34" width="100" height="34" rx="7" fill="#FFFFFF" stroke="#DCCFB6"/>
      <text x="200" y="58" textAnchor="middle" fill="#0E0E10"
        fontFamily="'JetBrains Mono', monospace" fontSize="21" fontWeight="700">117</text>
      <path d="M196 68 l4 6 4 -6 z" fill="#FFFFFF" stroke="#DCCFB6"/>
    </g>

    {/* Люди: Азиз считает по последней цифре, Дилноза складывает цифры */}
    <Person x={72} ground={122} head={10} shirt="#7ECBE6" hair="#3E3128"/>
    <g className="d3-note">
      <rect x="88" y="80" width="44" height="34" rx="4" fill="#FFFFFF" stroke="#DDD3C0"/>
      <text x="110" y="94" textAnchor="middle" fill="#8A8883" fontFamily="'JetBrains Mono', monospace" fontSize="10">…7</text>
      <text x="110" y="108" textAnchor="middle" fill="#FF4F28" fontFamily="'JetBrains Mono', monospace" fontSize="11">3 ?</text>
    </g>

    <Person x={300} ground={122} head={10} shirt="#F5C77E" hair="#5A4636"/>
    <g className="d3-sum">
      <rect x="252" y="80" width="46" height="34" rx="4" fill="#FFFFFF" stroke="#DDD3C0"/>
      <text x="275" y="94" textAnchor="middle" fill="#8A8883" fontFamily="'JetBrains Mono', monospace" fontSize="10">1+1+7</text>
      <text x="275" y="108" textAnchor="middle" fill="#1F7A4D" fontFamily="'JetBrains Mono', monospace" fontSize="11">9</text>
    </g>

    {/* Прилавок */}
    <rect x="0" y="122" width="400" height="8" fill="#C9A472"/>
    <rect x="0" y="130" width="400" height="24" fill="url(#d3table)"/>

    {/* Коробки со значками на прилавке */}
    {[[150, 6], [186, 6], [222, 6]].map(([bx, n], bi) => (
      <g key={bx}>
        <rect x={bx} y="106" width="32" height="16" rx="3" fill="#FFFDF7" stroke="#DCCFB6"/>
        {Array.from({ length: n }).map((_, i) => (
          <Badge key={i} x={bx + 6 + (i % 3) * 10} y={112 + Math.floor(i / 3) * 7} r={3.4}
            tone={FAIR_SHIRTS[(bi + i) % 3]}/>
        ))}
      </g>
    ))}
    <Badge className="d3-badge" x={140} y={118} r={5}/>
  </svg>
);

// Итог: значки разложены по 3, наборы полные, вопрос хука закрыт.
const FinalScene = () => (
  <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
    <rect x="0" y="0" width="400" height="92" fill="#F9F4EB"/>
    <Flags y={8}/>

    {/* шесть полных наборов по три значка */}
    {[30, 86, 142, 198, 254, 310].map((x, gi) => (
      <g key={x}>
        <rect x={x} y="30" width="46" height="26" rx="5" fill="#FFFDF7" stroke="#DCCFB6"/>
        {[0, 1, 2].map((i) => (
          <Badge key={i} x={x + 11 + i * 12} y={43} r={4.4} tone={FAIR_SHIRTS[(gi + i) % 3]}/>
        ))}
      </g>
    ))}
    <text x="200" y="24" textAnchor="middle" fill="#1F7A4D"
      fontFamily="'JetBrains Mono', monospace" fontSize="13" fontWeight="700">117 : 3 = 39</text>

    <rect x="0" y="66" width="400" height="26" fill="#E7C99A"/>
    <rect x="0" y="64" width="400" height="4" fill="#C9A472"/>
    <Person x={352} ground={66} head={7} shirt="#F5C77E" hair="#5A4636" arms={false}/>
    <Person x={376} ground={66} head={7} shirt="#7ECBE6" hair="#3E3128" arms={false}/>
  </svg>
);

// ============================================================
// ОБЩИЕ БЛОКИ ЭКРАНОВ
// ============================================================

// Число с подсветкой: либо последней цифры (приём урока 2), либо всех цифр,
// когда они уходят в сумму.
const DigitsRow = ({ value, mode = 'plain', big = false }) => {
  const digits = String(value).split('');
  return (
    <p className={'d3-num' + (big ? ' d3-num-lg' : '')}>
      {digits.map((d, i) => (
        <span key={i} className={'d3-dig'
          + (mode === 'last' && i === digits.length - 1 ? ' d3-dig-hit' : '')
          + (mode === 'last' && i !== digits.length - 1 ? ' d3-dig-off' : '')
          + (mode === 'all' ? ' d3-dig-sum' : '')}
        style={{ animationDelay: `${i * 140}ms` }}>{d}</span>
      ))}
    </p>
  );
};

const SumChip = ({ sum, tone = 'ok' }) => (
  <span className={'d3-chip d3-chip-' + tone}>{sum}</span>
);

// Экран 2 — мостик: приём прошлого урока на 30 и 45.
const RecallBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_recall;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d3-stage">
        {c.nums.map((n, i) => (
          <div key={n} className={'d3-line' + (step >= i ? ' d3-line-on' : '')}>
            <DigitsRow value={n} mode={step >= i ? 'last' : 'plain'}/>
            <span className="d3-cap">{step >= i ? t(c.caps[i]) : ''}</span>
          </div>
        ))}
      </div>
      {step >= 2 && (
        <div className="frame-success fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
        </div>
      )}
    </div>
  );
};

// Экран 3 — ядро: те же цифры в другом порядке дают ту же сумму.
const CoreBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_core;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d3-stage">
        <div className="d3-trio">
          {c.trio.map((n) => (
            <div key={n} className={'d3-card' + (step >= 1 ? ' d3-card-on' : '')}>
              <DigitsRow value={n} mode={step >= 2 ? 'all' : 'plain'}/>
              <span className="d3-tag">{step >= 1 ? '· 3 ✓' : ''}</span>
              {step >= 2 && (
                <span className="d3-sumline">{t(c.sum_label)}: <SumChip sum={9}/></span>
              )}
            </div>
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

// Экран 5 — девятка: три числа, суммы, два столбца вердиктов.
const NineBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_nine;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d3-stage">
        <div className="d3-table">
          {c.rows.map((r, i) => (
            <div key={r.n} className={'d3-trow' + (step >= 1 ? ' d3-trow-on' : '')} style={{ transitionDelay: `${i * 120}ms` }}>
              <span className="d3-tnum">{r.n}</span>
              <SumChip sum={r.s} tone={step >= 1 ? 'ok' : 'off'}/>
              <span className={'d3-mark' + (step >= 1 ? ' d3-mark-yes' : '')}>{step >= 1 ? '3 ✓' : ''}</span>
              <span className={'d3-mark' + (step >= 2 ? (r.nine ? ' d3-mark-yes' : ' d3-mark-no') : '')}>
                {step >= 2 ? (r.nine ? '9 ✓' : '9 ✗') : ''}
              </span>
            </div>
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

// Столбики цифр: высота столбика равна цифре, а вся сумма — это все клетки
// вместе. Число на экране должно быть ВИДНО, а не только названо.
const DigitBars = ({ digits, upto }) => (
  <div className="d3-bars">
    {digits.map((d, i) => (
      <span key={i} className={'d3-bar' + (i < upto ? ' d3-bar-on' : '')}>
        {Array.from({ length: Number(d) }).map((_, k) => (
          <i key={k} style={{ animationDelay: `${(i * 6 + k) * 28}ms` }}/>
        ))}
        <b>{d}</b>
      </span>
    ))}
  </div>
);

// Итог сложения: 18 клеток, раскрашенных по три — видно, что делится на 3.
const SumStrip = ({ n, group }) => (
  <div className="d3-strip" key={group}>
    {Array.from({ length: n }).map((_, i) => (
      <i key={i} className={Math.floor(i / group) % 2 ? 'd3-cell-b' : ''}
        style={{ animationDelay: `${i * 26}ms` }}/>
    ))}
  </div>
);

// Экран 6 — решаем вместе: сумма копится по шагам, ничего не стирается.
const SolveBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_solve;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink3 }}>{t(c.lead)}</p>
      <div className="frame fade-up delay-1 d3-stage">
        <DigitsRow value="4815" mode={step >= 1 ? 'all' : 'plain'} big/>
        <DigitBars digits={['4', '8', '1', '5']} upto={step === 0 ? 0 : Math.min(step + 1, 4)}/>
        {step >= 2 && (
          <div className="d3-strip-wrap">
            <SumStrip n={18} group={step >= 3 ? 9 : 3}/>
            <span className="d3-strip-cap">{step >= 3 ? '18 : 9 = 2' : '18 : 3 = 6'}</span>
          </div>
        )}
        <div className="d3-steps">
          {c.steps.map((s, i) => (
            <span key={i} className={'d3-step' + (step >= 1 ? ' d3-step-on' : '')} style={{ transitionDelay: `${i * 220}ms` }}>{t(s)}</span>
          ))}
        </div>
        <div className="d3-verdicts">
          {c.verdicts.map((v, i) => (
            <p key={i} className={'d3-verdict' + (step >= i + 2 ? ' d3-verdict-on' : '')}>{t(v)}</p>
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

// Экран 7 — граница: признак не считает частное.
const EdgeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_edge;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d3-stage">
        <DigitsRow value={c.num} mode="all" big/>
        <p className={'d3-edge' + (step >= 0 ? ' d3-edge-on' : '')}>{t(c.cap_yes)}</p>
        <p className={'d3-edge d3-edge-q' + (step >= 1 ? ' d3-edge-on' : '')}>{step >= 1 ? t(c.cap_q) : ''}</p>
        <p className={'d3-edge d3-edge-res' + (step >= 2 ? ' d3-edge-on' : '')}>{step >= 2 ? t(c.cap_res) : ''}</p>
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
  const solved = picked === false;   // верный ответ на 254 — «не делится»

  const say = (node, id) => {
    if (audio.muted || !node) return;
    const e = getAudioEngine();
    if (e) e.pushOneOff(pickL(node, lang), undefined, id);
  };

  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (phase !== 'demo' || shown) return undefined;
    timersRef.current.push(setTimeout(() => { setShown(true); say(c.audio.demo, 's_tool_demo'); }, 1700));
    return () => timersRef.current.forEach(clearTimeout);
    /* eslint-disable-next-line */
  }, [phase, shown]);

  const toPlay = () => { setPhase('play'); setPicked(null); say(c.audio.play, 's_tool_play'); };

  const answer = (yes) => {
    if (solved) return;
    setPicked(yes);
    if (yes) { firstTryRef.current = false; say(c.audio.wrong, 's_tool_wrong'); return; }
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
    <Stage screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div className="rv-col">
        <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
        <div className={'d3-banner fade-up delay-1' + (phase === 'play' ? ' d3-banner-play' : '')}>
          {t(phase === 'demo' ? c.demo_banner : c.play_banner)}
        </div>

        <div className="frame fade-up delay-1 d3-stage">
          {phase === 'demo' ? (
            <>
              <DigitsRow value="117" mode={shown ? 'all' : 'plain'} big/>
              <div className={'d3-sumbox' + (shown ? ' d3-sumbox-on' : '')}>
                1 + 1 + 7 = <SumChip sum={9}/>
              </div>
              <p className={'body d3-verdict' + (shown ? ' d3-verdict-on' : '')}>{shown ? t(c.demo_note) : ''}</p>
            </>
          ) : (
            <>
              <DigitsRow value="254" mode={picked !== null ? 'all' : 'plain'} big/>
              <div className={'d3-sumbox' + (picked !== null ? ' d3-sumbox-on' : '')}>
                2 + 5 + 4 = <SumChip sum={11} tone={picked !== null ? 'no' : 'off'}/>
              </div>
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
          <div className="d3-acts fade-up">
            <button className="d3-btn" disabled={!shown} onClick={() => setShown(false)}>{t(c.again)}</button>
            <button className="d3-btn d3-btn-go" disabled={!shown} onClick={toPlay}>{t(c.to_play)}</button>
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
const ScreenNine = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_nine} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <NineBody step={step}/>}/>
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
    exampleNode={<div className="d3-rule-ex"><DigitsRow value="117" mode="all"/><SumChip sum={9}/></div>}/>
);

const methodAside = (
  <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps} note={CONTENT.s_methods.m1_no}/>
);

const ScreenNames = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_names} asideNode={methodAside}/>
);
const ScreenSum = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_sum} asideNode={methodAside}/>
);
const ScreenBins = (props) => (
  <Classify {...props} screenContent={CONTENT.s_bins} totalScreens={TOTAL_SCREENS}/>
);
const ScreenError = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_error}/>
);

// Пять коробок стоят НАД заданием: числа можно пересчитать глазами.
const BoxesRow = () => (
  <div className="d3-boxes">
    {CONTENT.s_task.boxes.map((b) => (
      <span key={b} className="d3-box"><b>{b}</b></span>
    ))}
  </div>
);

const ScreenTask = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_task} figureNode={() => <BoxesRow/>}/>
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
// CSS УРОКА. Базовые правила класса — в BASE_STYLES.
// ВНИМАНИЕ: обратная кавычка и обратный слэш внутри этой строки, даже в
// комментарии, дают белый экран.
// ============================================================
const LESSON_STYLES = `
.d3-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(8px, 1.6vw, 12px); padding: clamp(12px, 2.4vw, 18px) !important; }

/* Число и его цифры */
.d3-num { display: flex; gap: clamp(2px, 0.8vw, 5px); margin: 0; font-family: 'JetBrains Mono', monospace; font-size: clamp(22px, 5vw, 32px); font-weight: 700; }
.d3-num-lg { font-size: clamp(30px, 6.4vw, 44px); }
.d3-dig { transition: color 420ms linear, opacity 420ms linear; }
.d3-dig-off { opacity: 0.25; }
.d3-dig-hit { color: #FF4F28; }
.d3-dig-sum { color: #1F7A4D; animation: d3Pop 520ms cubic-bezier(0.22, 0.61, 0.36, 1) both; }
@keyframes d3Pop { 0% { transform: translateY(-6px) scale(1.18); } 100% { transform: none; } }
.d3-chip { display: inline-grid; place-items: center; min-width: 30px; height: 30px; padding: 0 8px; border-radius: 999px; background: #E3F0E8; color: #1F7A4D; font-family: 'JetBrains Mono', monospace; font-size: clamp(15px, 2.8vw, 19px); font-weight: 700; }
.d3-chip-no { background: #FFE8E1; color: #FF4F28; }
.d3-chip-off { background: #EFE9DD; color: #B8B4AD; }

/* Экран 2: две строки мостика */
.d3-line { display: flex; align-items: center; gap: clamp(8px, 2vw, 16px); opacity: 0.3; transition: opacity 420ms linear; }
.d3-line-on { opacity: 1; }
.d3-cap { font-size: clamp(13px, 2.2vw, 16px); color: #494550; }

/* Экран 3: три карточки */
.d3-trio { display: flex; flex-wrap: wrap; justify-content: center; gap: clamp(8px, 2vw, 14px); }
.d3-card { display: flex; flex-direction: column; align-items: center; gap: 5px; min-width: 104px; padding: 10px 12px; border-radius: 14px; border: 1px solid #E9E3D9; background: #FFFFFF; transition: border-color 420ms linear; }
.d3-card-on { border-color: #1F7A4D; }
.d3-tag { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #1F7A4D; min-height: 16px; }
.d3-sumline { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #8A8883; }

/* Экран 5: таблица чисел */
.d3-table { display: flex; flex-direction: column; gap: 8px; width: 100%; max-width: 340px; }
.d3-trow { display: grid; grid-template-columns: 1fr auto 46px 46px; align-items: center; gap: 8px; opacity: 0.35; transition: opacity 420ms linear; }
.d3-trow-on { opacity: 1; }
.d3-tnum { font-family: 'JetBrains Mono', monospace; font-size: clamp(18px, 3.4vw, 23px); font-weight: 700; }
.d3-mark { font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 700; color: #B8B4AD; text-align: center; }
.d3-mark-yes { color: #1F7A4D; }
.d3-mark-no { color: #FF4F28; }

/* Экран 6: столбики цифр и полоска суммы */
.d3-bars { display: flex; align-items: flex-end; justify-content: center; gap: clamp(10px, 2.6vw, 20px); min-height: 96px; }
.d3-bar { display: flex; flex-direction: column-reverse; align-items: center; gap: 3px; opacity: 0.35; transition: opacity 380ms linear; }
.d3-bar-on { opacity: 1; }
.d3-bar i { width: clamp(12px, 2.6vw, 16px); height: clamp(7px, 1.6vw, 9px); border-radius: 3px; background: #7ECBE6; animation: d3Cell 380ms cubic-bezier(0.22, 0.61, 0.36, 1) both; }
.d3-bar b { order: -1; margin-top: 4px; font-family: 'JetBrains Mono', monospace; font-size: 14px; color: #8A8883; }
@keyframes d3Cell { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
.d3-strip-wrap { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: center; }
.d3-strip { display: flex; gap: 3px; }
.d3-strip i { width: clamp(10px, 2.2vw, 14px); height: clamp(10px, 2.2vw, 14px); border-radius: 3px; background: #8FD6B4; animation: d3Cell 380ms cubic-bezier(0.22, 0.61, 0.36, 1) both; }
.d3-strip i.d3-cell-b { background: #5FBF95; }
.d3-strip-cap { font-family: 'JetBrains Mono', monospace; font-size: clamp(14px, 2.6vw, 17px); font-weight: 700; color: #1F7A4D; }

/* Экран 6: шаги сложения */
.d3-steps { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
.d3-step { padding: 6px 11px; border-radius: 10px; background: #FBF3D6; font-family: 'JetBrains Mono', monospace; font-size: clamp(14px, 2.6vw, 17px); font-weight: 700; color: #7A5B12; opacity: 0; transform: translateY(6px); transition: opacity 420ms linear, transform 420ms cubic-bezier(0.22, 0.61, 0.36, 1); }
.d3-step-on { opacity: 1; transform: none; }
.d3-verdicts { display: flex; flex-direction: column; gap: 5px; align-items: center; }
.d3-verdict { margin: 0; font-size: clamp(14px, 2.4vw, 17px); color: #1F7A4D; opacity: 0; transition: opacity 420ms linear; text-align: center; }
.d3-verdict-on { opacity: 1; }

/* Экран 7: граница */
.d3-edge { margin: 0; font-size: clamp(14px, 2.6vw, 18px); color: #1F7A4D; opacity: 0; transition: opacity 420ms linear; min-height: 20px; }
.d3-edge-on { opacity: 1; }
.d3-edge-q { color: #8A8883; }
.d3-edge-res { font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #0E0E10; }

/* Экран 4 */
.d3-banner { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; font-size: clamp(14px, 2.4vw, 16px); font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 6px 13px; }
.d3-banner-play { color: #1F7A4D; background: #E3F0E8; }
.d3-sumbox { display: flex; align-items: center; gap: 8px; font-family: 'JetBrains Mono', monospace; font-size: clamp(16px, 3vw, 20px); font-weight: 700; opacity: 0; transition: opacity 420ms linear; }
.d3-sumbox-on { opacity: 1; }
.d3-verdict { margin: 0; }
.d3-acts { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.d3-btn { height: 40px; padding: 0 18px; border-radius: 12px; border: 1px solid #E9E3D9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(14px, 2.2vw, 16px); font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.d3-btn:disabled { opacity: 0.45; cursor: default; }
.d3-btn-go { border-color: #FF4F28; color: #FF4F28; }
.d3-btn-go:hover:not(:disabled) { background: #FFE8E1; }

/* Правило и задача */
.d3-rule-ex { display: flex; align-items: center; justify-content: center; gap: 12px; }
.d3-boxes { display: flex; flex-wrap: wrap; justify-content: center; gap: clamp(7px, 1.6vw, 11px); }
.d3-box { min-width: 58px; padding: 8px 11px; border-radius: 10px; border: 1px solid #DCCFB6; background: #FFFDF7; text-align: center; }
.d3-box b { font-family: 'JetBrains Mono', monospace; font-size: clamp(17px, 3.2vw, 22px); }

/* Движение сцены: флажки покачиваются, листки живут в руках */
.d3-flags { transform-origin: 200px 10px; animation: d3Sway 5.6s ease-in-out infinite; }
@keyframes d3Sway { 0%, 100% { transform: rotate(-1deg); } 50% { transform: rotate(1deg); } }
.d3-note { transform-origin: 110px 80px; animation: d3Note 4400ms ease-in-out infinite; }
@keyframes d3Note { 0%, 100% { transform: rotate(-1.6deg); } 50% { transform: rotate(1.6deg); } }
.d3-sum { transform-origin: 275px 80px; animation: d3Note 4400ms ease-in-out infinite reverse; }
@media (prefers-reduced-motion: reduce) {
  .d3-flags, .d3-note, .d3-sum, .d3-dig-sum { animation: none; }
}

@media (max-width: 639.98px) {
  .d3-num { font-size: clamp(19px, 6vw, 26px); }
  .d3-card { min-width: 92px; }
  .d3-trow { grid-template-columns: 1fr auto 40px 40px; }
}
`;

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function DigitSumRulesLesson({
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

  const screens = [ScreenHook, ScreenRecall, ScreenCore, ScreenTool, ScreenNine, ScreenSolve, ScreenEdge,
    ScreenRule, ScreenNames, ScreenSum, ScreenBins, ScreenError, ScreenTask, ScreenFinal, Screen14];
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
