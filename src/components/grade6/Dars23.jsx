// ============================================================
// 6 КЛАСС, УРОК 23 «Задачи на пропорцию»
// Собран по context/GRADE6_ETALON.md на общем слое ./screens.jsx.
//
// Урок закрывает блок Б5 и всю линию отношений. Новых правил нет: новое —
// рабочий порядок. Таблица, тип связи, пропорция или произведение, проверка.
//
// Сцена — типография школьной газеты: принтер и стопки листов.
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
  mt,
  Frac,
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
  FB_HIST,
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
  lessonId: 'grade6-23',
  lessonTitle: {
    ru: 'Задачи на пропорцию',
    uz: 'Proporsiyaga oid masalalar',
    en: 'Proportion word problems',
  },
};

const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',    scored: false, scope: 'hook' },     //  1 bosmaxona: 40 bet 2 daqiqada
  { id: 's_recall', type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  2 bog'lanish turi esga tushadi
  { id: 's_core',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  3 ish tartibi: jadval, tur, proporsiya
  { id: 's_tool',   type: 'exploration', template: 'custom',        scored: false, scope: null },       //  4 USUL: xarid masalasi
  { id: 's_inv',    type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  5 teskari hol: ish masalasi
  { id: 's_solve',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  6 birga yechamiz: yoqilg'i
  { id: 's_edge',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  7 chegara: birliklar va tekshiruv
  { id: 's_rule',   type: 'rule',        template: 'RuleScreen',    scored: false, scope: null },       //  8 QOIDA + xukka qaytish
  { id: 's_dir',    type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, //  9 to'g'ri masalalar x3
  { id: 's_ind',    type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 10 teskari masalalar x4
  { id: 's_bins',   type: 'test',        template: 'Classify',      scored: true,  scope: 'practice' }, // 11 savatlar: to'g'ri yoki teskari
  { id: 's_error',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_task',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 13 MASALA: gazeta bosish
  { id: 's_final',  type: 'test',        template: 'FinalPanel',    scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',      type: 'summary',     template: 'SummaryScreen', scored: false, scope: null },       // 15 xulosa
];

registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

const CONTENT = {
  s_hook: {
    eyebrow: { ru: 'Зачем это нужно', uz: 'Bu nimaga kerak', en: 'Why you need this' },
    title: { ru: 'Печатаем газету', uz: 'Gazeta chop etamiz', en: 'Printing the paper' },
    lead: {
      ru: 'Принтер печатает 40 страниц школьной газеты за 2 минуты.',
      uz: "Printer maktab gazetasining 40 betini 2 daqiqada bosadi.",
      en: 'A printer prints 40 pages of the school paper in 2 minutes.',
    },
    voice_a: { ru: 'Азиз: за 5 минут выйдет 80 страниц.', uz: 'Aziz: 5 daqiqada 80 bet chiqadi.', en: 'Aziz: in 5 minutes it makes 80 pages.' },
    voice_b: { ru: 'Дилноза: нет, 100.', uz: "Dilnoza: yo'q, 100.", en: 'Dilnoza: no, 100.' },
    ask: { ru: 'Сколько страниц выйдет за 5 минут?', uz: '5 daqiqada nechta bet chiqadi?', en: 'How many pages in 5 minutes?' },
    options: [
      { ru: '80 страниц', uz: '80 bet', en: '80 pages' },
      { ru: '100 страниц', uz: '100 bet', en: '100 pages' },
    ],
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: 'Variantlardan birini bosing. Javobni dars davomida tekshiramiz.',
      en: 'Tap one of the options. We will check the answer during the lesson.',
    },
    audio: {
      intro: {
        ru: [
          'Класс печатает школьную газету. Принтер выдаёт сорок страниц за две минуты.',
          'Азиз считает, что за пять минут выйдет восемьдесят страниц, а Дилноза что сто. Сколько страниц выйдет за пять минут? Выбери ответ. Проверим его по ходу урока.',
        ],
        uz: [
          "Sinf maktab gazetasini chop etyapti. Printer ikki daqiqada qirq bet chiqaradi.",
          "Aziz besh daqiqada sakson bet chiqadi deb hisoblaydi, Dilnoza esa yuz deydi. Besh daqiqada nechta bet chiqadi? Javobni tanlang. Uni dars davomida tekshiramiz.",
        ],
        en: [
          'The class is printing the school paper. The printer makes forty pages in two minutes.',
          'Aziz thinks five minutes give eighty pages, Dilnoza says one hundred. How many pages in five minutes? Choose an answer. We will check it during the lesson.',
        ],
      },
    },
  },

  s_recall: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslaymiz', en: 'Recall' },
    title: { ru: 'Два типа связи', uz: "Ikki xil bog'lanish", en: 'Two kinds of link' },
    direct: { ru: 'прямая: отношение постоянно', uz: "to'g'ri: nisbat doimiy", en: 'direct: constant ratio' },
    inverse: { ru: 'обратная: произведение постоянно', uz: "teskari: ko'paytma doimiy", en: 'inverse: constant product' },
    done: {
      ru: 'Это весь инструмент. Сегодня учимся выбирать нужный, не глядя на числа, а глядя на смысл задачи.',
      uz: "Bu butun asbob. Bugun kerakligini sonlarga emas, masalaning ma'nosiga qarab tanlashni o'rganamiz.",
      en: 'That is the whole toolkit. Today we learn to choose the right one by the meaning of the problem, not by the numbers.',
    },
    audio: {
      ru: [
        'Вспомним девятнадцатый урок. При прямой связи величины растут вместе, и постоянно их отношение.',
        'При обратной одна растёт, другая уменьшается, и постоянно произведение.',
        'Сегодня новых правил не будет. Будет порядок работы: таблица, тип связи, запись, проверка.',
      ],
      uz: [
        "O'n to'qqizinchi darsni eslaymiz. To'g'ri bog'lanishda kattaliklar birga o'sadi va nisbati doimiy.",
        "Teskarisida biri o'sadi, ikkinchisi kamayadi va ko'paytma doimiy.",
        "Bugun yangi qoida bo'lmaydi. Ish tartibi bo'ladi: jadval, bog'lanish turi, yozuv, tekshiruv.",
      ],
      en: [
        'Recall lesson nineteen. In a direct link quantities grow together and their ratio stays constant.',
        'In an inverse one grows while the other shrinks, and the product stays constant.',
        'No new rules today. There will be an order of work: a table, the kind of link, the equation, the check.',
      ],
    },
  },

  s_core: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Порядок работы', uz: 'Ish tartibi', en: 'The order of work' },
    steps: [
      { ru: 'Записать данные таблицей', uz: "Ma'lumotni jadvalga yozish", en: 'Write the data in a table' },
      { ru: 'Назвать тип связи словами', uz: "Bog'lanish turini so'z bilan aytish", en: 'Name the kind of link in words' },
      { ru: 'Составить пропорцию и проверить', uz: 'Proporsiya tuzib tekshirish', en: 'Write the proportion and check' },
    ],
    demo: [
      { ru: 'больше минут — больше страниц: связь прямая', uz: "daqiqa ko'p — bet ko'p: bog'lanish to'g'ri", en: 'more minutes means more pages: a direct link' },
      { ru: '2 : 40 = 5 : x', uz: '2 : 40 = 5 : x', en: '2 : 40 = 5 : x' },
      { ru: 'x = 200 : 2 = 100 страниц', uz: 'x = 200 : 2 = 100 bet', en: 'x = 200 ÷ 2 = 100 pages' },
    ],
    done: {
      ru: 'Азиз прибавил 40 страниц за каждую минуту сверх двух, а надо было держать отношение. За 5 минут выйдет 100 страниц. Права была Дилноза.',
      uz: "Aziz ikkidan ortiq har daqiqaga 40 bet qo'shdi, nisbatni saqlash kerak edi. Besh daqiqada 100 bet chiqadi. Dilnoza haq edi.",
      en: 'Aziz added 40 pages for each extra minute instead of keeping the ratio. Five minutes give 100 pages. Dilnoza was right.',
    },
    audio: {
      ru: [
        'Работать будем по порядку. Первым делом записываем данные таблицей: минуты сверху, страницы снизу.',
        'Второй шаг: называем тип связи вслух. Больше минут значит больше страниц, связь прямая.',
        'Третий шаг: составляем пропорцию и решаем. Два к сорока равно пять к иксу, икс равен ста. За пять минут выйдет сто страниц. Права была Дилноза.',
      ],
      uz: [
        "Tartib bilan ishlaymiz. Avvalo ma'lumotni jadvalga yozamiz: yuqorida daqiqalar, pastda betlar.",
        "Ikkinchi qadam: bog'lanish turini ovoz chiqarib aytamiz. Daqiqa ko'p bo'lsa bet ham ko'p, bog'lanish to'g'ri.",
        "Uchinchi qadam: proporsiya tuzib yechamiz. Ikki ning qirqqa nisbati besh ning iksga nisbatiga teng, iks yuzga teng. Besh daqiqada yuz bet chiqadi. Dilnoza haq edi.",
      ],
      en: [
        'We work in order. First write the data in a table: minutes on top, pages below.',
        'Second step: say the kind of link out loud. More minutes means more pages, so the link is direct.',
        'Third step: write the proportion and solve. Two to forty equals five to x, and x is one hundred. Five minutes give one hundred pages. Dilnoza was right.',
      ],
    },
  },

  s_tool: {
    eyebrow: { ru: 'Смотри и повтори', uz: 'Qarang va takrorlang', en: 'Watch, then try' },
    title: { ru: 'Задача о покупке', uz: 'Xarid masalasi', en: 'A shopping problem' },
    demo_banner: { ru: 'Смотри — покажу на примере', uz: "Qarang — misolda ko'rsataman", en: 'Watch — I will show an example' },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    demo_lines: [
      { ru: '3 кг бумаги стоят 24 000', uz: "3 kg qog'oz 24 000 so'm", en: '3 kg of paper costs 24,000' },
      { ru: 'больше бумаги — больше денег: прямая', uz: "qog'oz ko'p — pul ko'p: to'g'ri", en: 'more paper means more money: direct' },
      { ru: '3 : 24 000 = 7 : x → x = 56 000', uz: '3 : 24 000 = 7 : x → x = 56 000', en: '3 : 24,000 = 7 : x → x = 56,000' },
    ],
    demo_note: {
      ru: 'Проверка на глаз: бумаги стало больше вдвое с лишним, и деньги выросли примерно вдвое с лишним.',
      uz: "Ko'z bilan tekshirish: qog'oz ikki barobardan ko'proq oshdi, pul ham taxminan shuncha oshdi.",
      en: 'A rough check: there is a bit more than twice the paper and a bit more than twice the money.',
    },
    play_ask: { ru: '5 тетрадей стоят 15 000. Сколько стоят 8 тетрадей?', uz: "5 ta daftar 15 000 so'm. 8 ta daftar qancha turadi?", en: '5 notebooks cost 15,000. What do 8 cost?' },
    play_opts: ['18 000', '24 000', '9375'],
    play_correct: 1,
    play_ok: {
      ru: 'Верно. Одна тетрадь 3000, значит 8 тетрадей 24 000.',
      uz: "To'g'ri. Bitta daftar 3000, demak 8 daftar 24 000.",
      en: 'Right. One notebook is 3,000, so eight cost 24,000.',
    },
    play_wrong: [
      { ru: 'Прибавили по 1000 за тетрадь, но одна стоит 3000.', uz: "Har daftarga 1000 dan qo'shilgan, bittasi esa 3000.", en: 'A thousand was added per notebook, but one costs 3,000.' },
      null,
      { ru: 'Здесь связь перевёрнута: тетрадей больше, значит и денег больше.', uz: "Bu yerda bog'lanish teskari olingan: daftar ko'p, demak pul ham ko'p.", en: 'The link was flipped: more notebooks means more money.' },
    ],
    audio: {
      intro: {
        ru: 'Разберём задачу о покупке по нашему порядку: таблица, тип связи, пропорция, проверка.',
        uz: "Xarid masalasini tartibimiz bo'yicha ko'ramiz: jadval, bog'lanish turi, proporsiya, tekshiruv.",
        en: 'Let us work a shopping problem in our order: table, kind of link, proportion, check.',
      },
      demo: {
        ru: 'Три килограмма бумаги стоят двадцать четыре тысячи. Бумаги больше значит денег больше, связь прямая. Три к двадцати четырём тысячам равно семь к иксу, икс равен пятидесяти шести тысячам.',
        uz: "Uch kilogramm qog'oz yigirma to'rt ming turadi. Qog'oz ko'p bo'lsa pul ko'p, bog'lanish to'g'ri. Uch ning yigirma to'rt mingga nisbati yetti ning iksga nisbatiga teng, iks ellik olti ming.",
        en: 'Three kilograms of paper cost twenty four thousand. More paper means more money, a direct link. Three to twenty four thousand equals seven to x, and x is fifty six thousand.',
      },
      play: {
        ru: 'Теперь ваша очередь. Пять тетрадей стоят пятнадцать тысяч. Сколько стоят восемь тетрадей?',
        uz: "Endi sizning navbatingiz. Besh daftar o'n besh ming turadi. Sakkiz daftar qancha turadi?",
        en: 'Now it is your turn. Five notebooks cost fifteen thousand. What do eight cost?',
      },
      ok: {
        ru: 'Верно. Одна тетрадь три тысячи, восемь тетрадей двадцать четыре тысячи.',
        uz: "To'g'ri. Bitta daftar uch ming, sakkiz daftar yigirma to'rt ming.",
        en: 'Right. One notebook is three thousand, eight cost twenty four thousand.',
      },
      wrong: {
        ru: 'Найдите цену одной тетради и умножьте на нужное количество.',
        uz: "Bitta daftar narxini toping va kerakli songa ko'paytiring.",
        en: 'Find the price of one notebook and multiply by the number you need.',
      },
    },
  },

  s_inv: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Тот же порядок, другая связь', uz: "O'sha tartib, boshqa bog'lanish", en: 'Same order, different link' },
    lines: [
      { ru: '4 принтера печатают тираж за 6 часов', uz: "4 printer nashrni 6 soatda bosadi", en: '4 printers do the run in 6 hours' },
      { ru: 'меньше принтеров — больше времени: обратная', uz: "printer kam — vaqt ko'p: teskari", en: 'fewer printers means more time: inverse' },
      { ru: '4 · 6 = 24, значит 3 · x = 24 и x = 8', uz: '4 · 6 = 24, demak 3 · x = 24 va x = 8', en: '4 · 6 = 24, so 3 · x = 24 and x = 8' },
    ],
    done: {
      ru: 'Порядок не изменился: таблица, тип связи, запись, проверка. Изменилась только запись — вместо пропорции произведение.',
      uz: "Tartib o'zgarmadi: jadval, bog'lanish turi, yozuv, tekshiruv. Faqat yozuv o'zgardi — proporsiya o'rniga ko'paytma.",
      en: 'The order did not change: table, kind of link, equation, check. Only the equation changed: a product instead of a proportion.',
    },
    audio: {
      ru: [
        'Возьмём задачу о работе. Четыре принтера печатают весь тираж за шесть часов.',
        'Принтеров станет три. Меньше принтеров значит больше времени, связь обратная.',
        'Считаем всю работу: четыре умножить на шесть двадцать четыре. Тогда три умножить на икс тоже двадцать четыре, и икс равен восьми часам. Порядок работы тот же самый.',
      ],
      uz: [
        "Ish haqida masala olamiz. To'rt printer butun nashrni olti soatda bosadi.",
        "Printer uchta bo'ladi. Printer kam bo'lsa vaqt ko'p, bog'lanish teskari.",
        "Butun ishni hisoblaymiz: to'rt karra olti yigirma to'rt. Unda uch karra iks ham yigirma to'rt va iks sakkiz soatga teng. Ish tartibi o'sha.",
      ],
      en: [
        'Take a work problem. Four printers do the whole run in six hours.',
        'Now there are three printers. Fewer printers means more time, an inverse link.',
        'Compute the whole job: four times six is twenty four. Then three times x is twenty four too, so x is eight hours. The order of work is the same.',
      ],
    },
  },

  s_solve: {
    eyebrow: { ru: 'Решаем вместе', uz: 'Birga yechamiz', en: 'Solving together' },
    title: { ru: 'Расход топлива', uz: "Yoqilg'i sarfi", en: 'Fuel consumption' },
    lead: { ru: 'Автобус тратит 6 литров на 100 км. Сколько уйдёт на 250 км?', uz: "Avtobus 100 km ga 6 litr sarflaydi. 250 km ga qancha ketadi?", en: 'A bus uses 6 litres per 100 km. How much for 250 km?' },
    steps: [
      { ru: 'больше километров — больше топлива: прямая', uz: "kilometr ko'p — yoqilg'i ko'p: to'g'ri", en: 'more kilometres means more fuel: direct' },
      { ru: '100 : 6 = 250 : x', uz: '100 : 6 = 250 : x', en: '100 : 6 = 250 : x' },
      { ru: 'x = 1500 : 100 = 15 литров', uz: 'x = 1500 : 100 = 15 litr', en: 'x = 1,500 ÷ 100 = 15 litres' },
    ],
    done: {
      ru: 'Ответ 15 литров. Проверка прикидкой: путь вырос в два с половиной раза, и топливо тоже.',
      uz: "Javob 15 litr. Chamalab tekshirish: yo'l ikki yarim barobar oshdi, yoqilg'i ham.",
      en: 'The answer is 15 litres. A rough check: the distance grew two and a half times and so did the fuel.',
    },
    audio: {
      ru: [
        'Решаем вместе. Автобус тратит шесть литров на сто километров, а проехать нужно двести пятьдесят.',
        'Больше километров значит больше топлива, связь прямая. Записываем пропорцию: сто к шести равно двести пятьдесят к иксу.',
        'Икс равен пятнадцати литрам. Проверим прикидкой: путь вырос в два с половиной раза, шесть умножить на два с половиной как раз пятнадцать. Сходится.',
      ],
      uz: [
        "Birga yechamiz. Avtobus yuz kilometrga olti litr sarflaydi, yurish kerak bo'lgani ikki yuz ellik.",
        "Kilometr ko'p bo'lsa yoqilg'i ko'p, bog'lanish to'g'ri. Proporsiyani yozamiz: yuz ning oltiga nisbati ikki yuz ellik ning iksga nisbatiga teng.",
        "Iks o'n besh litrga teng. Chamalab tekshiramiz: yo'l ikki yarim barobar oshdi, olti karra ikki yarim aynan o'n besh. To'g'ri keldi.",
      ],
      en: [
        'Let us solve it together. The bus uses six litres per hundred kilometres and must cover two hundred fifty.',
        'More kilometres means more fuel, a direct link. Write the proportion: one hundred to six equals two hundred fifty to x.',
        'So x is fifteen litres. A rough check: the distance grew two and a half times and six times two and a half is exactly fifteen. It matches.',
      ],
    },
  },

  s_edge: {
    eyebrow: { ru: 'Где ошибаются', uz: 'Qayerda xato qilishadi', en: 'Where mistakes happen' },
    title: { ru: 'Единицы и проверка', uz: 'Birliklar va tekshiruv', en: 'Units and the check' },
    unit_line: { ru: 'ошибка: 2 минуты и 1 час в одной пропорции', uz: 'xato: bitta proporsiyada 2 daqiqa va 1 soat', en: 'mistake: 2 minutes and 1 hour in one proportion' },
    fix_line: { ru: 'верно: 2 минуты и 60 минут', uz: "to'g'ri: 2 daqiqa va 60 daqiqa", en: 'right: 2 minutes and 60 minutes' },
    check_line: { ru: 'и всегда прикидка: ответ должен быть примерно таким', uz: 'va doim chamalash: javob taxminan shunday chiqishi kerak', en: 'and always estimate: the answer should look about right' },
    done: {
      ru: 'Обе величины в пропорции — в одних единицах. А готовый ответ проверяют прикидкой: во сколько раз выросло одно, во столько же должно вырасти другое.',
      uz: "Proporsiyadagi ikkala kattalik bir xil birlikda bo'ladi. Tayyor javob esa chamalab tekshiriladi: biri necha barobar oshsa, ikkinchisi ham shuncha oshishi kerak.",
      en: 'Both quantities in a proportion use the same units. And the answer gets an estimate: whatever factor one grew by, the other should match.',
    },
    audio: {
      ru: [
        'Первая ошибка это разные единицы. Нельзя писать в одной пропорции две минуты и один час.',
        'Час переводим в минуты, и тогда сравнение честное: две минуты и шестьдесят минут.',
        'Вторая привычка полезная: прикидка. Если минут стало в три раза больше, страниц тоже должно стать примерно втрое больше. Ответ, который не проходит такую проверку, почти всегда неверный.',
      ],
      uz: [
        "Birinchi xato har xil birliklar. Bitta proporsiyada ikki daqiqa va bir soatni yozib bo'lmaydi.",
        "Soatni daqiqaga o'tkazamiz va solishtirish halol bo'ladi: ikki daqiqa va oltmish daqiqa.",
        "Ikkinchi foydali odat: chamalash. Daqiqa uch barobar ko'paysa, bet ham taxminan uch barobar ko'payishi kerak. Bunday tekshiruvdan o'tmagan javob deyarli doim noto'g'ri.",
      ],
      en: [
        'The first mistake is mixed units. Two minutes and one hour cannot sit in the same proportion.',
        'Convert the hour to minutes and the comparison is fair: two minutes and sixty minutes.',
        'The second habit is estimating. If the minutes tripled, the pages should roughly triple too. An answer that fails this check is almost always wrong.',
      ],
    },
  },

  s_rule: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    title: { ru: 'Порядок решения', uz: 'Yechish tartibi', en: 'The order of solving' },
    rule_1: {
      ru: 'Записываем данные таблицей, называем тип связи словами, потом пишем пропорцию для прямой связи или равенство произведений для обратной.',
      uz: "Ma'lumotni jadvalga yozamiz, bog'lanish turini so'z bilan aytamiz, keyin to'g'ri bog'lanishga proporsiya, teskarisiga ko'paytmalar tengligini yozamiz.",
      en: 'Write the data in a table, name the kind of link in words, then write a proportion for a direct link or equal products for an inverse one.',
    },
    rule_2: {
      ru: 'Величины берём в одинаковых единицах, а ответ проверяем прикидкой. Газета: 2 : 40 = 5 : 100, за пять минут сто страниц. Права была Дилноза.',
      uz: "Kattaliklarni bir xil birlikda olamiz, javobni esa chamalab tekshiramiz. Gazeta: 2 : 40 = 5 : 100, besh daqiqada yuz bet. Dilnoza haq edi.",
      en: 'Use the same units and check the answer by estimating. The paper: 2 : 40 = 5 : 100, one hundred pages in five minutes. Dilnoza was right.',
    },
    audio: {
      ru: 'Запомним порядок. Данные в таблицу, тип связи вслух, потом пропорция для прямой связи или равенство произведений для обратной. Величины берём в одинаковых единицах, а ответ проверяем прикидкой. Вернёмся к газете. Два к сорока равно пять к ста, значит за пять минут выйдет сто страниц. Права была Дилноза.',
      uz: "Tartibni eslab qolamiz. Ma'lumot jadvalga, bog'lanish turi ovoz chiqarib, keyin to'g'ri bog'lanishga proporsiya yoki teskarisiga ko'paytmalar tengligi. Kattaliklarni bir xil birlikda olamiz, javobni chamalab tekshiramiz. Gazetaga qaytamiz. Ikki ning qirqqa nisbati besh ning yuzga nisbatiga teng, demak besh daqiqada yuz bet chiqadi. Dilnoza haq edi.",
      en: 'Let us remember the order. Data into a table, the kind of link out loud, then a proportion for a direct link or equal products for an inverse one. Use the same units and check by estimating. Back to the paper. Two to forty equals five to one hundred, so five minutes give one hundred pages. Dilnoza was right.',
    },
  },

  s_dir: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Прямые задачи', uz: "To'g'ri masalalar", en: 'Direct problems' },
    lead: { ru: 'Скажи тип связи вслух, потом считай.', uz: "Bog'lanish turini ovoz chiqarib ayting, keyin hisoblang.", en: 'Say the kind of link out loud, then compute.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'За 3 минуты принтер печатает 60 листов. Сколько за 7 минут?', uz: "3 daqiqada printer 60 varaq bosadi. 7 daqiqada nechta?", en: 'In 3 minutes a printer makes 60 sheets. How many in 7?' },
        opts: ['140', '120', '64'],
        correct: 0,
        ok: { ru: 'Верно. За минуту 20 листов, за 7 минут 140.', uz: "To'g'ri. Bir daqiqada 20 varaq, 7 daqiqada 140.", en: 'Right. Twenty sheets a minute makes 140 in seven.' },
        wrong: [
          null,
          { ru: 'Это за 6 минут.', uz: 'Bu 6 daqiqada.', en: 'That is six minutes.' },
          { ru: 'Здесь прибавили 4 листа за 4 минуты.', uz: "Bu yerda 4 daqiqaga 4 varaq qo'shilgan.", en: 'That added four sheets for four minutes.' },
        ],
      },
      {
        q: { ru: '4 м ленты стоят 12 000. Сколько стоят 9 м?', uz: "4 m tasma 12 000 so'm. 9 m qancha turadi?", en: '4 m of tape costs 12,000. What do 9 m cost?' },
        opts: ['27 000', '17 000', '48 000'],
        correct: 0,
        ok: { ru: 'Верно. 1 м стоит 3000, значит 9 м это 27 000.', uz: "To'g'ri. 1 m 3000, demak 9 m 27 000.", en: 'Right. One metre is 3,000, so nine cost 27,000.' },
        wrong: [
          null,
          { ru: 'Прибавили 5000 за пять метров, но метр стоит 3000.', uz: "Besh metrga 5000 qo'shilgan, metr esa 3000.", en: 'Five thousand was added for five metres, but a metre costs 3,000.' },
          { ru: 'Это цена 16 метров.', uz: 'Bu 16 metrning narxi.', en: 'That is the price of sixteen metres.' },
        ],
      },
      {
        q: { ru: 'На 2 стенгазеты уходит 6 листов ватмана. Сколько на 5 газет?', uz: "2 devoriy gazetaga 6 varaq vatman ketadi. 5 gazetaga nechta?", en: 'Two wall papers need 6 sheets. How many for five?' },
        opts: ['15', '11', '30'],
        correct: 0,
        ok: { ru: 'Верно. На одну газету 3 листа, на пять 15.', uz: "To'g'ri. Bitta gazetaga 3 varaq, beshtasiga 15.", en: 'Right. Three sheets per paper makes fifteen for five.' },
        wrong: [
          null,
          { ru: 'Прибавили по одному листу за газету.', uz: "Har gazetaga bittadan varaq qo'shilgan.", en: 'One sheet was added per paper.' },
          { ru: 'Это на десять газет.', uz: "Bu o'nta gazetaga.", en: 'That is for ten papers.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на прямую связь. Удобно сначала посчитать на одну единицу.',
        uz: "To'g'ri bog'lanish mashqi. Avval bittasiga hisoblash qulay.",
        en: 'Direct link practice. Computing for one unit first helps.',
      },
    },
  },

  s_ind: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Обратные задачи', uz: 'Teskari masalalar', en: 'Inverse problems' },
    lead: { ru: 'Сначала посчитай всю работу целиком.', uz: 'Avval butun ishni hisoblang.', en: 'Compute the whole job first.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: '2 принтера печатают тираж за 9 часов. За сколько 3 принтера?', uz: "2 printer nashrni 9 soatda bosadi. 3 printer necha soatda?", en: 'Two printers do a run in 9 hours. How long for three?' },
        opts: ['6 часов', '13,5 часа', '4,5 часа'],
        correct: 0,
        ok: { ru: 'Верно. 2 · 9 = 18, значит 3 · x = 18 и x = 6.', uz: "To'g'ri. 2 · 9 = 18, demak 3 · x = 18 va x = 6.", en: 'Right. 2 · 9 = 18, so 3 · x = 18 and x = 6.' },
        wrong: [
          null,
          { ru: 'Принтеров больше, значит времени меньше.', uz: "Printer ko'p, demak vaqt kam.", en: 'More printers mean less time.' },
          { ru: 'Это ответ для четырёх принтеров.', uz: "Bu to'rt printer uchun javob.", en: 'That is the answer for four printers.' },
        ],
      },
      {
        q: { ru: 'Бумаги хватает на 12 дней при 5 листах в день. На сколько дней при 6 листах?', uz: "Qog'oz kuniga 5 varaqdan 12 kunga yetadi. Kuniga 6 varaqdan necha kunga yetadi?", en: 'Paper lasts 12 days at 5 sheets a day. How long at 6?' },
        opts: ['10 дней', '14 дней', '15 дней'],
        correct: 0,
        ok: { ru: 'Верно. Всего 60 листов, при 6 в день это 10 дней.', uz: "To'g'ri. Jami 60 varaq, kuniga 6 tadan bu 10 kun.", en: 'Right. Sixty sheets in total, at six a day that is ten days.' },
        wrong: [
          null,
          { ru: 'Тратим больше, значит хватит на меньше дней.', uz: "Ko'proq sarflaymiz, demak kamroq kunga yetadi.", en: 'Using more means fewer days.' },
          { ru: 'Это при 4 листах в день.', uz: 'Bu kuniga 4 varaqdan.', en: 'That is at four sheets a day.' },
        ],
      },
      {
        q: { ru: 'Дорогу проходят за 3 часа со скоростью 60 км/ч. За сколько при 90 км/ч?', uz: "Yo'l 60 km soat tezlikda 3 soatda bosiladi. 90 km soatda necha soatda?", en: 'A road takes 3 hours at 60 km per hour. How long at 90?' },
        opts: ['2 часа', '4,5 часа', '1,5 часа'],
        correct: 0,
        ok: { ru: 'Верно. Путь 180 км, при 90 км в час это 2 часа.', uz: "To'g'ri. Yo'l 180 km, soatiga 90 km bilan bu 2 soat.", en: 'Right. The road is 180 km and at 90 per hour that is two hours.' },
        wrong: [
          null,
          { ru: 'Скорость выше, значит времени меньше.', uz: 'Tezlik yuqori, demak vaqt kam.', en: 'Higher speed means less time.' },
          { ru: 'Это при скорости 120 км в час.', uz: 'Bu soatiga 120 km tezlikda.', en: 'That is at 120 km per hour.' },
        ],
      },
      {
        q: { ru: 'Что делают первым при решении такой задачи?', uz: 'Bunday masalani yechishda avval nima qilinadi?', en: 'What is the first step in such a problem?' },
        opts: [
          { ru: 'Называют тип связи', uz: "Bog'lanish turini aytadi", en: 'Name the kind of link' },
          { ru: 'Сразу пишут пропорцию', uz: 'Darrov proporsiya yozadi', en: 'Write a proportion at once' },
          { ru: 'Складывают все числа', uz: "Barcha sonlarni qo'shadi", en: 'Add all the numbers' },
        ],
        correct: 0,
        ok: { ru: 'Верно. От типа связи зависит вся дальнейшая запись.', uz: "To'g'ri. Keyingi butun yozuv bog'lanish turiga bog'liq.", en: 'Right. Everything that follows depends on the kind of link.' },
        wrong: [
          null,
          { ru: 'Для обратной связи обычная пропорция даст неверный ответ.', uz: "Teskari bog'lanishda oddiy proporsiya noto'g'ri javob beradi.", en: 'For an inverse link a plain proportion gives a wrong answer.' },
          { ru: 'Складывать разные величины бессмысленно.', uz: "Har xil kattaliklarni qo'shish ma'nosiz.", en: 'Adding different quantities makes no sense.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на обратную связь. Считайте всю работу или весь путь целиком.',
        uz: "Teskari bog'lanish mashqi. Butun ishni yoki butun yo'lni hisoblang.",
        en: 'Inverse link practice. Compute the whole job or distance.',
      },
    },
  },

  s_bins: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Какая связь в задаче', uz: "Masalada qanday bog'lanish", en: 'Which link is in the problem' },
    lead: { ru: 'В карточке две пары чисел из одной задачи.', uz: 'Kartochkada bitta masaladan ikki juft son.', en: 'Each card shows two pairs from one problem.' },
    bin_a: { ru: 'Прямая', uz: "To'g'ri", en: 'Direct' },
    bin_b: { ru: 'Обратная', uz: 'Teskari', en: 'Inverse' },
    cards: [
      { label: '3→60, 7→140', bin: 'a' },
      { label: '4→12, 9→27', bin: 'a' },
      { label: '2→6, 5→15', bin: 'a' },
      { label: '2→9, 3→6', bin: 'b' },
      { label: '5→12, 6→10', bin: 'b' },
      { label: '60→3, 90→2', bin: 'b' },
    ],
    hint: {
      ru: 'Первое число выросло. Посмотри, выросло второе или уменьшилось.',
      uz: "Birinchi son oshdi. Ikkinchisi oshdimi yoki kamaydimi, qarang.",
      en: 'The first number grew. See whether the second grew or shrank.',
    },
    correct_text: {
      ru: 'Верно. В прямой связи оба числа растут, в обратной второе уменьшается.',
      uz: "To'g'ri. To'g'ri bog'lanishda ikkala son ham o'sadi, teskarisida ikkinchisi kamayadi.",
      en: 'Right. In a direct link both grow; in an inverse one the second shrinks.',
    },
    audio: {
      intro: {
        ru: 'Разложите карточки по двум корзинам. В каждой карточке две пары из одной задачи.',
        uz: 'Kartochkalarni ikki savatga ajrating. Har bir kartochkada bitta masaladan ikki juft bor.',
        en: 'Sort the cards into two baskets. Each card holds two pairs from one problem.',
      },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда. Посмотри, что стало со вторым числом.', uz: 'Bu yerga emas. Ikkinchi son bilan nima bo\'lganiga qarang.', en: 'Not here. Look at what happened to the second number.' },
    },
  },

  s_error: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikidek tekshiring.", en: 'Check someone else’s work the way you would check your own.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Азиз: «За 2 минуты 40 страниц, значит за 1 час 40 · 60 = 2400». Проверь.', uz: "Aziz: «2 daqiqada 40 bet, demak 1 soatda 40 · 60 = 2400». Tekshiring.", en: 'Aziz: “40 pages in 2 minutes, so in an hour 40 · 60 = 2,400.” Check it.' },
        opts: [
          { ru: 'Нет: в часе 30 таких промежутков, выйдет 1200', uz: "Yo'q: bir soatda shunday 30 oraliq bor, 1200 chiqadi", en: 'No: an hour holds 30 such intervals, giving 1,200' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, выйдет 2400 : 2', uz: "Yo'q, 2400 : 2 chiqadi", en: 'No, it is 2,400 ÷ 2' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 60 : 2 = 30, и 30 · 40 = 1200 страниц.', uz: "To'g'ri. 60 : 2 = 30, va 30 · 40 = 1200 bet.", en: 'Right. 60 ÷ 2 = 30 and 30 · 40 = 1,200 pages.' },
        wrong: [
          null,
          { ru: 'Он умножил на минуты, а надо на число промежутков по две минуты.', uz: "U daqiqaga ko'paytirdi, ikki daqiqalik oraliqlar soniga ko'paytirish kerak edi.", en: 'He multiplied by minutes instead of by the number of two minute intervals.' },
          { ru: 'Число совпало случайно: важно понимать, откуда оно.', uz: "Son tasodifan mos keldi: uning qayerdan kelganini tushunish muhim.", en: 'The number matches by accident: what matters is where it comes from.' },
        ],
      },
      {
        q: { ru: 'Дилноза: «5 рабочих за 10 дней, значит 10 рабочих за 20 дней». Проверь.', uz: "Dilnoza: «5 ishchi 10 kunda, demak 10 ishchi 20 kunda». Tekshiring.", en: 'Dilnoza: “5 workers in 10 days, so 10 workers in 20 days.” Check it.' },
        opts: [
          { ru: 'Нет: связь обратная, выйдет 5 дней', uz: "Yo'q: bog'lanish teskari, 5 kun chiqadi", en: 'No: the link is inverse and it takes 5 days' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, выйдет 15 дней', uz: "Yo'q, 15 kun chiqadi", en: 'No, it takes 15 days' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 5 · 10 = 50, значит 10 · x = 50 и x = 5.', uz: "To'g'ri. 5 · 10 = 50, demak 10 · x = 50 va x = 5.", en: 'Right. 5 · 10 = 50, so 10 · x = 50 and x = 5.' },
        wrong: [
          null,
          { ru: 'Рабочих больше, значит дней меньше.', uz: "Ishchi ko'p, demak kun kam.", en: 'More workers mean fewer days.' },
          { ru: 'Дней должно стать меньше десяти, а не больше.', uz: "Kun o'ndan kam bo'lishi kerak, ko'p emas.", en: 'The days must drop below ten, not rise.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Проверьте чужое решение. Ошибка бывает и в единицах, и в типе связи.',
        uz: "Birovning yechimini tekshiring. Xato birliklarda ham, bog'lanish turida ham bo'lishi mumkin.",
        en: 'Check someone else’s work. A mistake can be in the units and in the kind of link.',
      },
    },
  },

  s_task: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    title: { ru: 'Тираж школьной газеты', uz: 'Maktab gazetasi nashri', en: 'The school paper print run' },
    lead: { ru: 'Принтер печатает 40 страниц за 2 минуты. Весь тираж — 600 страниц.', uz: "Printer 2 daqiqada 40 bet bosadi. Butun nashr — 600 bet.", en: 'The printer makes 40 pages in 2 minutes and the whole run is 600 pages.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Сколько минут уйдёт на весь тираж?', uz: 'Butun nashrga necha daqiqa ketadi?', en: 'How many minutes for the whole run?' },
        opts: ['30', '15', '60'],
        correct: 0,
        ok: { ru: 'Верно. 2 : 40 = x : 600, значит x = 30 минут.', uz: "To'g'ri. 2 : 40 = x : 600, demak x = 30 daqiqa.", en: 'Right. 2 : 40 = x : 600, so x = 30 minutes.' },
        wrong: [
          null,
          { ru: 'За 15 минут выйдет только 300 страниц.', uz: '15 daqiqada atigi 300 bet chiqadi.', en: 'Fifteen minutes give only 300 pages.' },
          { ru: 'За час напечаталось бы 1200 страниц.', uz: 'Bir soatda 1200 bet bosilardi.', en: 'An hour would print 1,200 pages.' },
        ],
      },
      {
        q: { ru: 'Если поставить два таких принтера, сколько уйдёт минут?', uz: "Shunday ikkita printer qo'ysak, necha daqiqa ketadi?", en: 'With two such printers, how many minutes?' },
        opts: ['15', '60', '30'],
        correct: 0,
        ok: { ru: 'Верно. Здесь связь обратная: 1 · 30 = 2 · x, значит x = 15.', uz: "To'g'ri. Bu yerda bog'lanish teskari: 1 · 30 = 2 · x, demak x = 15.", en: 'Right. Here the link is inverse: 1 · 30 = 2 · x, so x = 15.' },
        wrong: [
          null,
          { ru: 'Принтеров больше, значит времени меньше.', uz: "Printer ko'p, demak vaqt kam.", en: 'More printers mean less time.' },
          { ru: 'Это время для одного принтера.', uz: 'Bu bitta printer uchun vaqt.', en: 'That is the time for one printer.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Задача про тираж. Принтер печатает сорок страниц за две минуты, всего нужно шестьсот страниц.',
        uz: "Nashr haqida masala. Printer ikki daqiqada qirq bet bosadi, jami olti yuz bet kerak.",
        en: 'A print run problem. The printer makes forty pages in two minutes and six hundred are needed.',
      },
    },
  },

  s_final: {
    eyebrow: { ru: 'Финал', uz: 'Final', en: 'Final' },
    intro_line: { ru: 'Пять заданий на весь урок.', uz: 'Butun darsga beshta topshiriq.', en: 'Five tasks covering the whole lesson.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        kind: 'num', ans: 21,
        q: { ru: '3 кг яблок стоят 9000. Сколько кг купят на 63 000? Набери ответ.', uz: "3 kg olma 9000 so'm. 63 000 ga necha kg olinadi? Javobni tering.", en: '3 kg of apples cost 9,000. How many kg for 63,000? Type the answer.' },
        hint: { ru: '1 кг стоит 3000, значит делим 63 000 на 3000.', uz: "1 kg 3000, demak 63 000 ni 3000 ga bo'lamiz.", en: 'One kilo is 3,000, so divide 63,000 by 3,000.' },
        hint_audio: { ru: 'Один килограмм стоит три тысячи. Разделите шестьдесят три тысячи на три тысячи.', uz: "Bir kilogramm uch ming turadi. Oltmish uch mingni uch mingga bo'ling.", en: 'One kilo costs three thousand. Divide sixty three thousand by three thousand.' },
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: '6 маляров красят зал за 4 часа. За сколько 8 маляров?', uz: "6 bo'yoqchi zalni 4 soatda bo'yaydi. 8 bo'yoqchi necha soatda?", en: 'Six painters do a hall in 4 hours. How long for eight?' },
        opts: ['5,3 часа', '3 часа', '6 часов', '2 часа'],
        wrong: [
          { ru: 'Маляров больше, значит времени меньше.', uz: "Bo'yoqchi ko'p, demak vaqt kam.", en: 'More painters mean less time.' },
          null,
          { ru: 'Это ответ для четырёх маляров.', uz: "Bu to'rt bo'yoqchi uchun javob.", en: 'That is the answer for four painters.' },
          { ru: 'Проверь: 8 · 2 = 16, а всего работы 24.', uz: "Tekshiring: 8 · 2 = 16, ish esa jami 24.", en: 'Check: 8 · 2 = 16, but the job is 24.' },
        ],
        correct: { ru: 'Верно. 6 · 4 = 24, значит 8 · x = 24 и x = 3.', uz: "To'g'ri. 6 · 4 = 24, demak 8 · x = 24 va x = 3.", en: 'Right. 6 · 4 = 24, so 8 · x = 24 and x = 3.' },
      },
      {
        kind: 'mc', correctIndex: 2,
        q: { ru: 'Машина тратит 8 л на 100 км. Сколько на 350 км?', uz: "Mashina 100 km ga 8 l sarflaydi. 350 km ga qancha?", en: 'A car uses 8 l per 100 km. How much for 350 km?' },
        opts: ['24 л', '16 л', '28 л', '35 л'],
        wrong: [
          { ru: 'Это на 300 км.', uz: 'Bu 300 km ga.', en: 'That is for 300 km.' },
          { ru: 'Это на 200 км.', uz: 'Bu 200 km ga.', en: 'That is for 200 km.' },
          null,
          { ru: 'Так вышло бы при расходе 10 л на 100 км.', uz: '100 km ga 10 l sarfda shunday chiqardi.', en: 'That would fit 10 l per 100 km.' },
        ],
        correct: { ru: 'Верно. На 1 км уходит 0,08 л, на 350 км это 28 л.', uz: "To'g'ri. 1 km ga 0,08 l, 350 km ga 28 l.", en: 'Right. 0.08 l per km makes 28 l for 350 km.' },
      },
      {
        kind: 'mc', correctIndex: 0,
        q: { ru: 'Зачем в задаче называют тип связи?', uz: "Masalada bog'lanish turi nega aytiladi?", en: 'Why name the kind of link in a problem?' },
        opts: [
          { ru: 'От него зависит запись: пропорция или произведение', uz: "Yozuv unga bog'liq: proporsiyami yoki ko'paytmami", en: 'It decides the equation: a proportion or a product' },
          { ru: 'Чтобы числа стали меньше', uz: 'Sonlar kichrayishi uchun', en: 'To make the numbers smaller' },
          { ru: 'Так принято записывать', uz: 'Shunday yozish odat', en: 'It is just a habit' },
          { ru: 'Чтобы не переводить единицы', uz: "Birliklarni o'zgartirmaslik uchun", en: 'To avoid converting units' },
        ],
        wrong: [
          null,
          { ru: 'Числа от этого не меняются.', uz: "Sonlar bundan o'zgarmaydi.", en: 'The numbers do not change from that.' },
          { ru: 'Причина есть: без типа связи запись выбрать нельзя.', uz: "Sabab bor: bog'lanish turisiz yozuvni tanlab bo'lmaydi.", en: 'There is a reason: without it the equation cannot be chosen.' },
          { ru: 'Единицы переводить всё равно придётся.', uz: "Birliklarni baribir o'zgartirishga to'g'ri keladi.", en: 'Units still need converting.' },
        ],
        correct: { ru: 'Верно. Для прямой связи пропорция, для обратной равенство произведений.', uz: "To'g'ri. To'g'ri bog'lanishga proporsiya, teskarisiga ko'paytmalar tengligi.", en: 'Right. A proportion for direct, equal products for inverse.' },
      },
      {
        kind: 'mc', correctIndex: 3,
        q: { ru: 'На 4 стакана компота идёт 2 стакана ягод. Сколько ягод на 10 стаканов?', uz: "4 stakan kompotga 2 stakan meva ketadi. 10 stakanga qancha meva?", en: 'Four cups of compote need 2 cups of berries. How many for ten cups?' },
        opts: ['4', '20', '8', '5'],
        wrong: [
          { ru: 'Это на 8 стаканов компота.', uz: 'Bu 8 stakan kompotga.', en: 'That is for eight cups.' },
          { ru: 'Слишком много: ягод вдвое меньше, чем компота.', uz: "Juda ko'p: meva kompotdan ikki barobar kam.", en: 'Too much: berries are half the compote.' },
          { ru: 'Это на 16 стаканов компота.', uz: 'Bu 16 stakan kompotga.', en: 'That is for sixteen cups.' },
          null,
        ],
        correct: { ru: 'Верно. 4 : 2 = 10 : x, значит x = 5 стаканов ягод.', uz: "To'g'ri. 4 : 2 = 10 : x, demak x = 5 stakan meva.", en: 'Right. 4 : 2 = 10 : x, so x = 5 cups of berries.' },
      },
    ],
    audio: {
      intro: {
        ru: 'Финальная проверка. Пять заданий на весь урок. Первое с набором числа, остальные с выбором.',
        uz: 'Yakuniy tekshiruv. Butun darsga beshta topshiriq. Birinchisida son teriladi, qolganlarida tanlanadi.',
        en: 'The final check. Five tasks covering the whole lesson. The first needs a typed number, the rest are multiple choice.',
      },
      on_correct: { ru: 'Верно.', uz: "To'g'ri.", en: 'Right.' },
      on_wrong: { ru: 'Посмотри разбор.', uz: 'Tushuntirishga qarang.', en: 'Look at the explanation.' },
    },
    fact: {
      ru: 'Первый печатный станок Гутенберга выдавал около 240 страниц в час, тогда как переписчик делал 2 страницы. Пропорция здесь и показывает силу изобретения: за день станок заменял сотню писцов.',
      uz: "Gutenbergning birinchi bosmaxona dastgohi soatiga taxminan 240 bet chiqargan, xattot esa 2 bet. Proporsiya aynan shu ixtironing kuchini ko'rsatadi: bir kunda dastgoh yuzta xattotning ishini bajargan.",
      en: 'Gutenberg’s first press produced about 240 pages an hour while a scribe managed 2. A proportion shows the power of the invention: in a day the press replaced a hundred scribes.',
    },
    fact_audio: {
      ru: 'Знаешь ли ты? Первый печатный станок Гутенберга выдавал около двухсот сорока страниц в час, а переписчик успевал две. Пропорция показывает силу изобретения: за день станок заменял сотню писцов.',
      uz: "Bilasizmi? Gutenbergning birinchi bosmaxona dastgohi soatiga taxminan ikki yuz qirq bet chiqargan, xattot esa ikkitani ulgurgan. Proporsiya ixtironing kuchini ko'rsatadi: bir kunda dastgoh yuzta xattotning ishini bajargan.",
      en: 'Did you know? Gutenberg first press produced about two hundred forty pages an hour while a scribe managed two. A proportion shows the power of the invention: in a day the press replaced a hundred scribes.',
    },
  },

  s14: {
    eyebrow: { ru: 'Урок пройден', uz: "Dars o'tildi", en: 'Lesson finished' },
    banner: { ru: 'Математика · Пропорции', uz: 'Matematika · Proporsiyalar', en: 'Mathematics · Proportions' },
    heading: { ru: 'Задачи на пропорцию', uz: 'Proporsiyaga oid masalalar', en: 'Proportion problems' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    brief_1: { ru: 'данные в таблицу', uz: "ma'lumot jadvalga", en: 'data into a table' },
    brief_2: { ru: 'тип связи словами', uz: "bog'lanish turi so'z bilan", en: 'the kind of link in words' },
    brief_3: { ru: 'пропорция или произведение, потом проверка', uz: "proporsiya yoki ko'paytma, keyin tekshiruv", en: 'proportion or product, then the check' },
    memo_title: { ru: 'Что помнить', uz: 'Nimani eslash kerak', en: 'What to remember' },
    memo_q1: { ru: 'Прямая связь', uz: "To'g'ri bog'lanish", en: 'Direct link' },
    memo_a1: { ru: 'пропорция в одном порядке', uz: 'bir tartibdagi proporsiya', en: 'a proportion in the same order' },
    memo_q2: { ru: 'Обратная связь', uz: "Teskari bog'lanish", en: 'Inverse link' },
    memo_a2: { ru: 'равенство произведений', uz: "ko'paytmalar tengligi", en: 'equal products' },
    memo_q3: { ru: 'Проверка', uz: 'Tekshiruv', en: 'The check' },
    memo_a3: { ru: 'прикидка: во сколько раз выросло', uz: 'chamalash: necha barobar oshdi', en: 'estimate: by what factor it grew' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'Данные записываем таблицей, тип связи называем словами, потом пишем пропорцию или равенство произведений. Величины берём в одинаковых единицах и проверяем ответ прикидкой.',
        'Газета: два к сорока равно пять к ста, значит за пять минут выйдет сто страниц.',
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "Ma'lumotni jadvalga yozamiz, bog'lanish turini so'z bilan aytamiz, keyin proporsiya yoki ko'paytmalar tengligini yozamiz. Kattaliklarni bir xil birlikda olamiz va javobni chamalab tekshiramiz.",
        "Gazeta: ikki ning qirqqa nisbati besh ning yuzga nisbatiga teng, demak besh daqiqada yuz bet chiqadi.",
      ],
      en: [
        'The lesson is done. Let us gather the main points.',
        'Write the data in a table, name the kind of link in words, then write a proportion or equal products. Use the same units and check the answer by estimating.',
        'The paper: two to forty equals five to one hundred, so five minutes give one hundred pages.',
      ],
    },
  },

  s_methods: {
    m1_title: { ru: 'Способ. Четыре шага', uz: "Usul. To'rt qadam", en: 'Method. Four steps' },
    m1_steps: {
      ru: ['Запиши данные таблицей', 'Назови тип связи словами', 'Пропорция для прямой, произведение для обратной', 'Проверь ответ прикидкой'],
      uz: ["Ma'lumotni jadvalga yozing", "Bog'lanish turini so'z bilan ayting", "To'g'riga proporsiya, teskariga ko'paytma", 'Javobni chamalab tekshiring'],
      en: ['Write the data in a table', 'Name the kind of link in words', 'Proportion for direct, product for inverse', 'Check the answer by estimating'],
    },
    m1_no: {
      ru: 'Величины в одной записи должны быть в одинаковых единицах: минуты с минутами, литры с литрами.',
      uz: "Bitta yozuvdagi kattaliklar bir xil birlikda bo'lishi kerak: daqiqa daqiqa bilan, litr litr bilan.",
      en: 'Quantities in one equation must share units: minutes with minutes, litres with litres.',
    },
  },
};

// ============================================================
// СЦЕНЫ УРОКА: типография школьной газеты.
// ============================================================
const HookScene = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="d23wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F9F4EB"/><stop offset="100%" stopColor="#F1E8D8"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="400" height="154" fill="url(#d23wall)"/>

    {/* Стенгазета на стене и полка с бумагой */}
    <g opacity="0.75">
      <rect x="14" y="14" width="74" height="52" rx="3" fill="#FFFDF7" stroke="#C9A472" strokeWidth="2"/>
      <path d="M22 30 h58 M22 40 h58 M22 50 h40" stroke="#C9C7C2" strokeWidth="2" strokeLinecap="round"/>
      <rect x="310" y="24" width="78" height="6" rx="2" fill="#C9A472"/>
      <rect x="318" y="10" width="26" height="14" rx="2" fill="#F1E4CB" stroke="#C9A472"/>
      <rect x="350" y="12" width="26" height="12" rx="2" fill="#DCEDF5" stroke="#C9A472"/>
    </g>

    {/* Принтер: лоток, лист выезжает */}
    <g>
      <rect x="132" y="52" width="136" height="46" rx="6" fill="#8E8578"/>
      <rect x="146" y="40" width="108" height="14" rx="3" fill="#6F6759"/>
      <rect x="150" y="62" width="84" height="10" rx="2" fill="#DCEDF5"/>
      <circle cx="252" cy="86" r="4" fill="#8FBF7F" className="d23-led"/>
      <g className="d23-sheet">
        <rect x="158" y="96" width="70" height="22" rx="2" fill="#FFFDF7" stroke="#DCCFB6"/>
        <path d="M166 104 h50 M166 110 h38" stroke="#C9C7C2" strokeWidth="1.6"/>
      </g>
    </g>

    {/* Стопки готовых листов на столе */}
    <rect x="0" y="118" width="400" height="36" fill="#D2A96F"/>
    <rect x="0" y="118" width="400" height="5" fill="#C9884A"/>
    <g>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={44 + i * 2} y={126 - i * 3} width="56" height="6" rx="1.5" fill="#FFFDF7" stroke="#E2D8C4"/>
      ))}
      {[0, 1, 2].map((i) => (
        <rect key={'b' + i} x={296 + i * 2} y={128 - i * 3} width="52" height="6" rx="1.5" fill="#FFFDF7" stroke="#E2D8C4"/>
      ))}
    </g>

    {/* Дети у принтера */}
    <Person x={104} ground={132} head={12} shirt="#7ECBE6" hair="#3E3128"/>
    <Person x={296} ground={132} head={12} shirt="#F5C77E" hair="#5A4636"/>
  </svg>
);

// Итог: таблица минут и страниц с решением.
const FinalScene = () => (
  <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
    <rect x="0" y="0" width="400" height="92" fill="#F9F4EB"/>
    <g fontFamily="'JetBrains Mono', monospace" fontWeight="700">
      <rect x="60" y="16" width="120" height="28" rx="6" fill="#F7F0E2" stroke="#DCCFB6"/>
      <rect x="60" y="48" width="120" height="28" rx="6" fill="#F7F0E2" stroke="#DCCFB6"/>
      <text x="120" y="35" textAnchor="middle" fill="#494550" fontSize="14">2 min</text>
      <text x="120" y="67" textAnchor="middle" fill="#494550" fontSize="14">40 bet</text>
      <rect x="220" y="16" width="120" height="28" rx="6" fill="#E3F0E8" stroke="#A9CFBA"/>
      <rect x="220" y="48" width="120" height="28" rx="6" fill="#E3F0E8" stroke="#A9CFBA"/>
      <text x="280" y="35" textAnchor="middle" fill="#1F7A4D" fontSize="14">5 min</text>
      <text x="280" y="67" textAnchor="middle" fill="#1F7A4D" fontSize="14">100 bet</text>
    </g>
  </svg>
);

// ============================================================
// БЛОКИ ЭКРАНОВ
// ============================================================
const Table2 = ({ head, rows, markLast = false, size = 'mid' }) => (
  <span className={'d23-table d23-table-' + size}>
    {rows.map((r, i) => (
      <span key={i} className="d23-trow">
        <b>{head[i]}</b>
        {r.map((v, k) => <i key={k} className={markLast && k === r.length - 1 ? 'ok' : (v === '?' ? 'q' : '')}>{v}</i>)}
      </span>
    ))}
  </span>
);

const Line = ({ node, on }) => (
  <span className={'d23-line d23-fade' + (on ? ' d23-on' : '')}>{mt(node)}</span>
);

const RecallBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_recall;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d23-stage">
        <span className="d23-two">
          <span className="d23-card d23-card-dir">
            <b>{t(c.direct)}</b>
            <Table2 head={['a', 'b']} rows={[[2, 4], [10, 20]]} size="sm"/>
          </span>
          <span className={'d23-card d23-card-inv d23-fade' + (step >= 1 ? ' d23-on' : '')}>
            <b>{t(c.inverse)}</b>
            <Table2 head={['a', 'b']} rows={[[2, 4], [12, 6]]} size="sm"/>
          </span>
        </span>
      </div>
      {step >= 2 && (
        <div className="frame-success fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
        </div>
      )}
    </div>
  );
};

// Ядро: порядок работы из трёх шагов на примере принтера.
const CoreBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_core;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d23-stage">
        <span className="d23-plan">
          {c.steps.map((s, i) => (
            <i key={i} className={step >= i ? 'on' : ''}><b>{i + 1}</b>{t(s)}</i>
          ))}
        </span>
        <Table2 head={['min', 'bet']} rows={[[2, 5], [40, step >= 2 ? 100 : '?']]} markLast={step >= 2}/>
        {c.demo.map((l, i) => <Line key={i} node={t(l)} on={step >= i}/>)}
      </div>
      {step >= 2 && (
        <div className="frame-success fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
        </div>
      )}
    </div>
  );
};

const InvBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_inv;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d23-stage">
        <Table2 head={['printer', 'soat']} rows={[[4, 3], [6, step >= 2 ? 8 : '?']]} markLast={step >= 2}/>
        {c.lines.map((l, i) => <Line key={i} node={t(l)} on={step >= i}/>)}
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
      <div className="frame fade-up delay-1 d23-stage">
        <Table2 head={['km', 'litr']} rows={[[100, 250], [6, step >= 2 ? 15 : '?']]} markLast={step >= 2}/>
        {c.steps.map((s, i) => <Line key={i} node={t(s)} on={step >= i}/>)}
      </div>
      {step >= 2 && (
        <div className="frame-success fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
        </div>
      )}
    </div>
  );
};

// Граница: единицы и прикидка.
const EdgeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_edge;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d23-stage">
        <span className="d23-pair d23-pair-bad"><Line node={t(c.unit_line)} on/></span>
        <span className={'d23-pair d23-pair-good d23-fade' + (step >= 1 ? ' d23-on' : '')}>
          <Line node={t(c.fix_line)} on/>
        </span>
        <span className={'d23-pair d23-pair-warn d23-fade' + (step >= 2 ? ' d23-on' : '')}>
          <Line node={t(c.check_line)} on/>
        </span>
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
        <div className={'d23-banner fade-up delay-1' + (phase === 'play' ? ' d23-banner-play' : '')}>
          {t(phase === 'demo' ? c.demo_banner : c.play_banner)}
        </div>

        <div className="frame fade-up delay-1 d23-stage d23-stage-tool">
          {phase === 'demo' ? (
            <>
              <Table2 head={['kg', 'sum']} rows={[[3, 7], [24000, done ? 56000 : '?']]} markLast={done} size="sm"/>
              {c.demo_lines.map((l, i) => <Line key={i} node={t(l)} on={shown >= i}/>)}
              <p className={'body d23-verdict' + (done ? ' d23-verdict-on' : '')}>{done ? t(c.demo_note) : ''}</p>
            </>
          ) : (
            <>
              <p className="body" style={{ margin: '0 0 10px', fontWeight: 600 }}>{mt(t(c.play_ask))}</p>
              <div className="sv-opts">
                {c.play_opts.map((o, i) => (
                  <button key={o} className={'option'
                    + (solved && i === c.play_correct ? ' option-correct' : '')
                    + (!solved && picked === i ? ' option-picked-wrong' : '')}
                  disabled={solved} onClick={() => answer(i)}>{o}</button>
                ))}
              </div>
              {picked !== null && !solved && <HintBlock show>{mt(t(c.play_wrong[picked] || c.play_ok))}</HintBlock>}
              {solved && (
                <FeedbackBlock show isCorrect>
                  <p className="body" style={{ margin: 0 }}>{mt(t(c.play_ok))}</p>
                </FeedbackBlock>
              )}
            </>
          )}
        </div>

        {phase === 'demo' && (
          <div className="d23-acts fade-up">
            <button className="d23-btn" disabled={!done} onClick={() => setShown(0)}>{t(c.again)}</button>
            <button className="d23-btn d23-btn-go" disabled={!done} onClick={toPlay}>{t(c.to_play)}</button>
          </div>
        )}

        <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps}
          note={CONTENT.s_methods.m1_no} active={phase === 'play' ? 4 : shown}/>
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
const ScreenInv = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_inv} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <InvBody step={step}/>}/>
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
    exampleNode={(
      <div className="d23-stage">
        <Table2 head={['min', 'bet']} rows={[[2, 5], [40, 100]]} markLast/>
      </div>
    )}/>
);

const methodAside = (
  <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps} note={CONTENT.s_methods.m1_no}/>
);

const ScreenDir = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_dir} asideNode={methodAside}/>
);
const ScreenInd = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_ind} asideNode={methodAside}/>
);
const ScreenBins = (props) => (
  <Classify {...props} screenContent={CONTENT.s_bins} totalScreens={TOTAL_SCREENS}/>
);
const ScreenError = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_error}/>
);

// Задача: тираж газеты, во втором задании два принтера.
const TaskFig = ({ idx }) => (
  <div className="d23-task-fig">
    {idx >= 1
      ? <Table2 head={['printer', 'min']} rows={[[1, 2], [30, '?']]} size="sm"/>
      : <Table2 head={['min', 'bet']} rows={[[2, '?'], [40, 600]]} size="sm"/>}
  </div>
);

const ScreenTask = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_task}
    figureNode={(it, idx) => <TaskFig idx={idx}/>}/>
);

const ScreenFinal = (props) => (
  <FinalPanel {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_final}
    factNode={<FactCard badge={FB_HIST} anim={<AnimDigits/>} text={CONTENT.s_final.fact}/>}/>
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
.d23-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(9px, 1.7vw, 14px); padding: clamp(12px, 2.4vw, 18px) !important; }
.d23-stage-tool { gap: clamp(4px, 0.8vw, 7px) !important; padding: clamp(7px, 1.5vw, 11px) !important; }
.d23-stage-tool .d23-line { font-size: clamp(12px, 2vw, 16px); }

/* Таблица двух величин */
.d23-table { display: flex; flex-direction: column; gap: 4px; }
.d23-trow { display: inline-flex; align-items: center; gap: 4px; }
.d23-trow b { min-width: clamp(38px, 7.4vw, 58px); font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(11px, 1.9vw, 14px); color: #8A8883; text-align: right; }
.d23-trow i { font-style: normal; display: grid; place-items: center; min-width: clamp(52px, 11vw, 84px); height: clamp(26px, 4.6vw, 36px); border-radius: 8px; background: #F7F0E2; border: 1px solid #E9E3D9; font-family: 'JetBrains Mono', monospace; font-size: clamp(12px, 2.2vw, 17px); font-weight: 700; color: #494550; }
.d23-trow i.q { background: #FBF3D6; border-color: #E4CE93; color: #C99B3A; }
.d23-trow i.ok { background: #E3F0E8; border-color: #A9CFBA; color: #1F7A4D; }
.d23-table-sm .d23-trow i { min-width: clamp(42px, 9vw, 70px); height: clamp(22px, 4vw, 30px); font-size: clamp(11px, 2vw, 15px); }
.d23-table-sm .d23-trow b { min-width: clamp(32px, 6.4vw, 50px); font-size: clamp(10px, 1.8vw, 13px); }

/* План из трёх шагов */
.d23-plan { display: flex; flex-direction: column; gap: 5px; width: 100%; }
.d23-plan i { display: flex; align-items: center; gap: 9px; font-style: normal; font-size: clamp(12px, 2.1vw, 16px); color: #8A8883; padding: clamp(4px, 1vw, 7px) clamp(7px, 1.4vw, 11px); border-radius: 10px; background: #F7F0E2; transition: background-color 380ms linear, color 380ms linear; }
.d23-plan i.on { background: #E3F0E8; color: #1F7A4D; }
.d23-plan b { display: grid; place-items: center; width: 21px; height: 21px; border-radius: 50%; background: #FFFDF7; font-family: 'JetBrains Mono', monospace; font-size: 12px; }

/* Две карточки связи */
.d23-two { display: flex; gap: clamp(8px, 1.8vw, 14px); flex-wrap: wrap; justify-content: center; width: 100%; }
.d23-card { flex: 1 1 150px; display: flex; flex-direction: column; align-items: center; gap: 6px; padding: clamp(7px, 1.5vw, 11px); border-radius: 13px; }
.d23-card b { font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(11px, 2vw, 14px); font-weight: 600; color: #494550; text-align: center; }
.d23-card-dir { background: #E7F5FA; border: 1px solid #B6DCEA; }
.d23-card-inv { background: #FBF3D6; border: 1px solid #E4CE93; }

.d23-fade { opacity: 0; transition: opacity 420ms linear; }
.d23-on { opacity: 1; }
.d23-line { font-family: 'JetBrains Mono', monospace; font-size: clamp(12px, 2.2vw, 17px); font-weight: 700; color: #494550; }

/* Строки экрана границы */
.d23-pair { width: 100%; padding: clamp(5px, 1.2vw, 9px); border-radius: 12px; text-align: center; }
.d23-pair-bad { background: #FFF1EC; border: 1px solid #F3C4B4; }
.d23-pair-good { background: #E3F0E8; border: 1px solid #A9CFBA; }
.d23-pair-warn { background: #FBF3D6; border: 1px solid #E4CE93; }

/* Задача */
.d23-task-fig { display: flex; justify-content: center; }

/* Экран 4 */
.d23-banner { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; font-size: clamp(13px, 2.2vw, 16px); font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 4px 11px; }
.d23-banner-play { color: #1F7A4D; background: #E3F0E8; }
.d23-verdict { margin: 0; min-height: 0; opacity: 0; transition: opacity 420ms linear; text-align: center; }
.d23-verdict-on { opacity: 1; }
.d23-acts { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.d23-btn { height: 36px; padding: 0 18px; border-radius: 12px; border: 1px solid #E9E3D9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(14px, 2.2vw, 16px); font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.d23-btn:disabled { opacity: 0.45; cursor: default; }
.d23-btn-go { border-color: #FF4F28; color: #FF4F28; }
.d23-btn-go:hover:not(:disabled) { background: #FFE8E1; }

/* Движение сцены: лист выезжает, лампочка принтера */
.d23-sheet { animation: d23Sheet 3400ms ease-in-out infinite; }
@keyframes d23Sheet { 0%, 100% { transform: translateY(-6px); opacity: 0.35; } 55% { transform: translateY(0); opacity: 1; } }
.d23-led { animation: d23Led 2400ms ease-in-out infinite; }
@keyframes d23Led { 0%, 100% { opacity: 0.35; } 50% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .d23-sheet, .d23-led { animation: none; } }

@media (max-width: 639.98px) {
  .d23-trow i { min-width: 48px; height: 24px; font-size: 11px; }
  .d23-table-sm .d23-trow i { min-width: 40px; height: 21px; font-size: 10px; }
}
`;

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function ProportionProblemsLesson({
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

  const screens = [ScreenHook, ScreenRecall, ScreenCore, ScreenTool, ScreenInv, ScreenSolve, ScreenEdge,
    ScreenRule, ScreenDir, ScreenInd, ScreenBins, ScreenError, ScreenTask, ScreenFinal, Screen14];
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
