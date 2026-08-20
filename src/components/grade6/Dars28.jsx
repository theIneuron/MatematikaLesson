// ============================================================
// 6 КЛАСС, УРОК 28 «Вычитание рациональных чисел»
// Собран по context/GRADE6_ETALON.md на общем слое ./screens.jsx.
//
// Блок Б7, второй урок. Вычитание не вводится как новое действие: оно
// сводится к сложению из урока 27 — вычесть значит прибавить
// противоположное. Прямая та же, что в 24-27.
//
// Сцена — канатная дорога в горах: нижняя станция у озера, верхняя
// на смотровой площадке, ноль на указателе это уровень посёлка.
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
  lessonId: 'grade6-28',
  lessonTitle: {
    ru: 'Вычитание рациональных чисел',
    uz: 'Ratsional sonlarni ayirish',
    en: 'Subtracting rational numbers',
  },
};

const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',    scored: false, scope: 'hook' },     //  1 kanat yo'l: −15 va +40
  { id: 's_recall', type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  2 qarama-qarshi sonlar esga tushadi
  { id: 's_core',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  3 ayirish = qarama-qarshini qo'shish
  { id: 's_tool',   type: 'exploration', template: 'custom',        scored: false, scope: null },       //  4 USUL: kartochkani ag'darish
  { id: 's_minus',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  5 manfiyni ayirish
  { id: 's_solve',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  6 birga yechamiz: zanjir
  { id: 's_edge',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  7 chegara: tartib va ishora
  { id: 's_rule',   type: 'rule',        template: 'RuleScreen',    scored: false, scope: null },       //  8 QOIDA + xukka qaytish
  { id: 's_swap',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, //  9 qo'shishga aylantirish x3
  { id: 's_calc',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 10 hisoblash x4
  { id: 's_bins',   type: 'test',        template: 'Classify',      scored: true,  scope: 'practice' }, // 11 savatlar: ayirma ishorasi
  { id: 's_error',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_task',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 13 MASALA: balandliklar farqi
  { id: 's_final',  type: 'test',        template: 'FinalPanel',    scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',      type: 'summary',     template: 'SummaryScreen', scored: false, scope: null },       // 15 xulosa
];

registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

const CONTENT = {
  s_hook: {
    title: { ru: 'Две станции канатной дороги', uz: "Kanat yo'lining ikki bekati", en: 'Two cable car stations' },
    lead: {
      ru: 'Ноль на указателе — уровень посёлка. Нижняя станция у озера на −15 м, верхняя на +40 м.',
      uz: "Ko'rsatkichdagi nol — qishloq sathi. Quyi bekat ko'l yonida −15 m da, yuqorigisi +40 m da.",
      en: 'Zero on the sign is the village level. The lower station by the lake is at −15 m, the upper one at +40 m.',
    },
    voice_a: { ru: 'Санжар: разница 25 метров.', uz: "Sanjar: farq 25 metr.", en: 'Sanjar: the difference is 25 metres.' },
    voice_b: { ru: 'Малика: нет, 55 метров.', uz: "Malika: yo'q, 55 metr.", en: 'Malika: no, 55 metres.' },
    ask: { ru: 'На сколько верхняя станция выше нижней?', uz: 'Yuqori bekat quyisidan qanchaga baland?', en: 'How much higher is the upper station?' },
    options: [
      { ru: 'на 25 м', uz: '25 m ga', en: 'by 25 m' },
      { ru: 'на 55 м', uz: '55 m ga', en: 'by 55 m' },
    ],
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: 'Variantlardan birini bosing. Javobni dars davomida tekshiramiz.',
      en: 'Tap one of the options. We will check the answer during the lesson.',
    },
    audio: {
      intro: {
        ru: [
          'В горах работает канатная дорога. Ноль на указателе это уровень посёлка. Нижняя станция стоит у озера, на пятнадцать метров ниже посёлка. Верхняя на смотровой площадке, на сорок метров выше.',
          'Санжар говорит, что разница двадцать пять метров, а Малика что пятьдесят пять. На сколько верхняя станция выше нижней? Выбери ответ. Проверим его по ходу урока.',
        ],
        uz: [
          "Tog'da kanat yo'l ishlaydi. Ko'rsatkichdagi nol qishloq sathi. Quyi bekat ko'l yonida, qishloqdan o'n besh metr pastda turadi. Yuqorigisi tomosha maydonchasida, qirq metr balandda.",
          "Sanjar farq yigirma besh metr deydi, Malika esa ellik besh deydi. Yuqori bekat quyisidan qanchaga baland? Javobni tanlang. Uni dars davomida tekshiramiz.",
        ],
        en: [
          'A cable car runs in the mountains. Zero on the sign is the village level. The lower station stands by the lake, fifteen metres below the village. The upper one is on the viewpoint, forty metres above.',
          'Sanjar says the difference is twenty five metres, Malika says fifty five. How much higher is the upper station? Choose an answer. We will check it during the lesson.',
        ],
      },
    },
  },

  s_recall: {
    title: { ru: 'Противоположные числа', uz: 'Qarama-qarshi sonlar', en: 'Opposite numbers' },
    done: {
      ru: 'У каждого числа есть противоположное: тот же модуль, другой знак. Сегодня оно и превратит вычитание в сложение.',
      uz: "Har bir sonning qarama-qarshisi bor: moduli o'sha, ishorasi boshqa. Bugun aynan u ayirishni qo'shishga aylantiradi.",
      en: 'Every number has an opposite: same absolute value, different sign. Today that is what turns subtraction into addition.',
    },
    audio: {
      ru: [
        'Вспомним два прошлых урока. У числа семь противоположное минус семь: они стоят на одинаковом расстоянии от нуля, но с разных сторон.',
        'Их сумма равна нулю. И ещё: прибавить отрицательное значит шагнуть влево, прибавить положительное вправо.',
        'Сегодня противоположное число сделает главную работу: превратит вычитание в сложение.',
      ],
      uz: [
        "O'tgan ikki darsni eslaymiz. Yetti sonining qarama-qarshisi minus yetti: ular noldan bir xil masofada, lekin har xil tomonda turadi.",
        "Ularning yig'indisi nolga teng. Yana: manfiyni qo'shish chapga qadam, musbatni qo'shish o'ngga qadam demak.",
        "Bugun qarama-qarshi son asosiy ishni bajaradi: ayirishni qo'shishga aylantiradi.",
      ],
      en: [
        'Recall the last two lessons. The opposite of seven is minus seven: same distance from zero, different sides.',
        'Their sum is zero. And adding a negative means stepping left, adding a positive means stepping right.',
        'Today the opposite number does the main job: it turns subtraction into addition.',
      ],
    },
  },

  s_core: {
    title: { ru: 'Вычесть значит прибавить противоположное', uz: "Ayirish — qarama-qarshini qo'shish", en: 'Subtracting means adding the opposite' },
    lines: [
      { ru: '40 − (−15)', uz: '40 − (−15)', en: '40 − (−15)' },
      { ru: '40 + 15', uz: '40 + 15', en: '40 + 15' },
      { ru: '= 55 метров', uz: '= 55 metr', en: '= 55 metres' },
    ],
    done: {
      ru: 'Разность высот считают так: из верхней вычитают нижнюю. Минус на минус дал прибавление, поэтому 55. Права была Малика.',
      uz: "Balandliklar farqi shunday hisoblanadi: yuqorisidan quyisi ayiriladi. Minus minusga qo'shishni berdi, shuning uchun 55. Malika haq edi.",
      en: 'A height difference is the upper minus the lower. Minus of a minus turned into adding, so 55. Malika was right.',
    },
    audio: {
      ru: [
        'Разность высот считают так: из верхней отметки вычитают нижнюю. Сорок минус минус пятнадцать.',
        'Вычесть число значит прибавить противоположное. Противоположное к минус пятнадцати это пятнадцать. Значит сорок плюс пятнадцать.',
        'Получилось пятьдесят пять метров. Санжар просто вычел пятнадцать из сорока и потерял знак у нижней станции. Права была Малика.',
      ],
      uz: [
        "Balandliklar farqi shunday hisoblanadi: yuqori belgidan quyisi ayiriladi. Qirq minus minus o'n besh.",
        "Sonni ayirish qarama-qarshisini qo'shish demak. Minus o'n beshning qarama-qarshisi o'n besh. Demak qirq qo'shuv o'n besh.",
        "Ellik besh metr chiqdi. Sanjar shunchaki qirqdan o'n beshni ayirdi va quyi bekatning ishorasini yo'qotdi. Malika haq edi.",
      ],
      en: [
        'A height difference is the upper mark minus the lower one. Forty minus minus fifteen.',
        'Subtracting a number means adding its opposite. The opposite of minus fifteen is fifteen. So forty plus fifteen.',
        'That gives fifty five metres. Sanjar simply subtracted fifteen from forty and lost the sign of the lower station. Malika was right.',
      ],
    },
  },

  s_tool: {
    title: { ru: 'Переворачиваем карточку', uz: "Kartochkani ag'daramiz", en: 'Flip the card' },
    demo_banner: { ru: 'Смотри — покажу на примере', uz: "Qarang — misolda ko'rsataman", en: 'Watch — I will show an example' },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    demo_lines: [
      { ru: '−3 − 5: вычитаем 5', uz: '−3 − 5: 5 ni ayiramiz', en: '−3 − 5: we subtract 5' },
      { ru: 'переворачиваем: −3 + (−5)', uz: "ag'daramiz: −3 + (−5)", en: 'flip it: −3 + (−5)' },
      { ru: 'знаки одинаковые: −8', uz: 'ishoralar bir xil: −8', en: 'equal signs: −8' },
    ],
    demo_note: {
      ru: 'Знак действия и знак числа меняются вместе: было «минус пять», стало «плюс минус пять».',
      uz: "Amal ishorasi va son ishorasi birga o'zgaradi: «minus besh» edi, «plyus minus besh» bo'ldi.",
      en: 'The operation sign and the number sign change together: “minus five” became “plus minus five”.',
    },
    play_ask: { ru: 'Во что превратится −2 − 6?', uz: '−2 − 6 nimaga aylanadi?', en: 'What does −2 − 6 turn into?' },
    play_opts: ['−2 + (−6)', '−2 + 6', '2 + 6'],
    play_correct: 0,
    play_ok: {
      ru: 'Верно. Вычесть 6 значит прибавить −6, получится −8.',
      uz: "To'g'ri. 6 ni ayirish −6 ni qo'shish demak, −8 chiqadi.",
      en: 'Right. Subtracting 6 means adding −6, which gives −8.',
    },
    play_wrong: [
      null,
      { ru: 'Знак у шестёрки не поменялся, а он и есть главное.', uz: "Oltining ishorasi o'zgarmadi, asosiysi esa aynan shu.", en: 'The sign of the six did not change, and that is the point.' },
      { ru: 'Первое число трогать нельзя, оно остаётся как было.', uz: "Birinchi songa tegilmaydi, u o'sha holicha qoladi.", en: 'The first number stays untouched.' },
    ],
    audio: {
      intro: {
        ru: 'Покажу приём на примере минус три минус пять. Каждое вычитание можно перевернуть в сложение.',
        uz: "Usulni minus uch minus besh misolida ko'rsataman. Har qanday ayirishni qo'shishga ag'darish mumkin.",
        en: 'I will show the trick on minus three minus five. Every subtraction can be flipped into addition.',
      },
      demo: {
        ru: 'Вычитаем пять, значит прибавляем минус пять. Знаки у слагаемых стали одинаковые, складываем модули и ставим минус. Получилось минус восемь.',
        uz: "Beshni ayiramiz, demak minus beshni qo'shamiz. Qo'shiluvchilar ishorasi bir xil bo'ldi, modullarni qo'shamiz va minus qo'yamiz. Minus sakkiz chiqdi.",
        en: 'We subtract five, so we add minus five. The addends now have equal signs, we add the absolute values and put a minus. That gives minus eight.',
      },
      play: {
        ru: 'Теперь ваша очередь. Во что превратится минус два минус шесть?',
        uz: 'Endi sizning navbatingiz. Minus ikki minus olti nimaga aylanadi?',
        en: 'Now it is your turn. What does minus two minus six turn into?',
      },
      ok: {
        ru: 'Верно. Вычесть шесть значит прибавить минус шесть.',
        uz: "To'g'ri. Oltini ayirish minus oltini qo'shish demak.",
        en: 'Right. Subtracting six means adding minus six.',
      },
      wrong: {
        ru: 'Переворачивается только вычитаемое: знак действия и знак числа меняются вместе.',
        uz: "Faqat ayriluvchi ag'dariladi: amal ishorasi va son ishorasi birga o'zgaradi.",
        en: 'Only the subtracted number flips: the operation sign and the number sign change together.',
      },
    },
  },

  s_minus: {
    title: { ru: 'Вычитаем отрицательное', uz: 'Manfiyni ayiramiz', en: 'Subtracting a negative' },
    lines: [
      { ru: '4 − (−7): вычитаем −7', uz: '4 − (−7): −7 ni ayiramiz', en: '4 − (−7): we subtract −7' },
      { ru: 'переворачиваем: 4 + 7', uz: "ag'daramiz: 4 + 7", en: 'flip it: 4 + 7' },
      { ru: '= 11', uz: '= 11', en: '= 11' },
    ],
    done: {
      ru: 'Вычесть отрицательное значит прибавить положительное: шаг идёт вправо, и ответ становится больше.',
      uz: "Manfiyni ayirish musbatni qo'shish demak: qadam o'ngga boradi va javob kattalashadi.",
      en: 'Subtracting a negative means adding a positive: the step goes right and the answer grows.',
    },
    audio: {
      ru: [
        'Теперь случай, который сбивает чаще всего: вычитаем отрицательное число. Четыре минус минус семь.',
        'Правило то же. Противоположное к минус семи это семь, значит четыре плюс семь. Шаг идёт вправо.',
        'Получилось одиннадцать, и это больше, чем было. Вычитание не всегда уменьшает: если вычитаем отрицательное, результат растёт.',
      ],
      uz: [
        "Endi ko'proq adashtiradigan hol: manfiy sonni ayiramiz. To'rt minus minus yetti.",
        "Qoida o'sha. Minus yettining qarama-qarshisi yetti, demak to'rt qo'shuv yetti. Qadam o'ngga boradi.",
        "O'n bir chiqdi, bu esa avvalgisidan katta. Ayirish har doim ham kamaytirmaydi: manfiyni ayirsak, natija o'sadi.",
      ],
      en: [
        'Now the case that trips people up most: subtracting a negative. Four minus minus seven.',
        'The rule is the same. The opposite of minus seven is seven, so four plus seven. The step goes right.',
        'That gives eleven, which is more than we started with. Subtraction does not always shrink: subtracting a negative makes the result grow.',
      ],
    },
  },

  s_solve: {
    title: { ru: 'Цепочка с двумя действиями', uz: 'Ikki amalli zanjir', en: 'A chain with two operations' },
    lead: { ru: 'Считаем −6 − (−4) − 5 по шагам.', uz: '−6 − (−4) − 5 ni qadamlab hisoblaymiz.', en: 'Compute −6 − (−4) − 5 step by step.' },
    steps: [
      { ru: '−6 + 4 = −2', uz: '−6 + 4 = −2', en: '−6 + 4 = −2' },
      { ru: '−2 + (−5) = −7', uz: '−2 + (−5) = −7', en: '−2 + (−5) = −7' },
      { ru: 'итог: −7', uz: 'natija: −7', en: 'result: −7' },
    ],
    done: {
      ru: 'Сначала все вычитания превращаем в сложения, дальше работает урок 27. Порядок — слева направо.',
      uz: "Avval barcha ayirishlarni qo'shishga aylantiramiz, keyin 27-dars ishlaydi. Tartib — chapdan o'ngga.",
      en: 'First turn every subtraction into addition, then lesson 27 takes over. Work left to right.',
    },
    audio: {
      ru: [
        'Решаем вместе. Минус шесть минус минус четыре минус пять.',
        'Первое вычитание: вычесть минус четыре значит прибавить четыре. Минус шесть плюс четыре это минус два.',
        'Второе: вычесть пять значит прибавить минус пять. Минус два плюс минус пять это минус семь. Итог минус семь.',
      ],
      uz: [
        "Birga yechamiz. Minus olti minus minus to'rt minus besh.",
        "Birinchi ayirish: minus to'rtni ayirish to'rtni qo'shish demak. Minus olti qo'shuv to'rt bu minus ikki.",
        "Ikkinchisi: beshni ayirish minus beshni qo'shish demak. Minus ikki qo'shuv minus besh bu minus yetti. Natija minus yetti.",
      ],
      en: [
        'Let us solve it together. Minus six minus minus four minus five.',
        'The first subtraction: subtracting minus four means adding four. Minus six plus four is minus two.',
        'The second: subtracting five means adding minus five. Minus two plus minus five is minus seven. The result is minus seven.',
      ],
    },
  },

  s_edge: {
    title: { ru: 'Порядок здесь важен', uz: 'Bu yerda tartib muhim', en: 'Order matters here' },
    bad_line: { ru: 'ошибка: 5 − 9 = 4, переставили числа', uz: "xato: 5 − 9 = 4, sonlar o'rni almashtirilgan", en: 'mistake: 5 − 9 = 4, the numbers were swapped' },
    good_line: { ru: 'верно: 5 − 9 = 5 + (−9) = −4', uz: "to'g'ri: 5 − 9 = 5 + (−9) = −4", en: 'right: 5 − 9 = 5 + (−9) = −4' },
    warn_line: { ru: '−3 − 5 = −8, а не 2: минус относится к пятёрке', uz: '−3 − 5 = −8, 2 emas: minus beshga tegishli', en: '−3 − 5 = −8, not 2: the minus belongs to the five' },
    done: {
      ru: 'В сложении слагаемые можно поменять местами, в вычитании нельзя. Меняете местами — меняется знак ответа.',
      uz: "Qo'shishda qo'shiluvchilar o'rnini almashtirsa bo'ladi, ayirishda esa bo'lmaydi. O'rnini almashtirsangiz, javob ishorasi o'zgaradi.",
      en: 'In addition you may swap the terms, in subtraction you may not. Swap them and the sign of the answer flips.',
    },
    audio: {
      ru: [
        'Частая ошибка: пять минус девять пишут как четыре, просто вычитая меньшее из большего.',
        'Но переворот показывает правду: пять плюс минус девять. Влево прошли дальше, значит ответ минус четыре.',
        'Вторая ошибка: в записи минус три минус пять минус перед пятёркой это знак вычитаемого, а не приказ сложить. Ответ минус восемь. В сложении числа можно переставить, в вычитании нет.',
      ],
      uz: [
        "Tez-tez uchraydigan xato: besh minus to'qqizni kichikni kattadan ayirib, to'rt deb yozishadi.",
        "Ammo ag'darish haqiqatni ko'rsatadi: besh qo'shuv minus to'qqiz. Chapga uzoqroq yurildi, demak javob minus to'rt.",
        "Ikkinchi xato: minus uch minus besh yozuvida beshning oldidagi minus ayriluvchining ishorasi, qo'shish buyrug'i emas. Javob minus sakkiz. Qo'shishda sonlar o'rnini almashtirsa bo'ladi, ayirishda esa yo'q.",
      ],
      en: [
        'A common mistake: five minus nine gets written as four by subtracting the smaller from the bigger.',
        'But the flip shows the truth: five plus minus nine. We went further left, so the answer is minus four.',
        'A second mistake: in minus three minus five the minus before the five is the sign of the subtracted number, not an order to add. The answer is minus eight. Addition lets you swap the numbers, subtraction does not.',
      ],
    },
  },

  s_rule: {
    title: { ru: 'Как вычитать', uz: 'Qanday ayiriladi', en: 'How to subtract' },
    rule_1: {
      ru: 'Чтобы вычесть число, надо прибавить противоположное: a − b = a + (−b). Дальше работает правило сложения из прошлого урока.',
      uz: "Sonni ayirish uchun uning qarama-qarshisini qo'shish kerak: a − b = a + (−b). Keyin o'tgan darsdagi qo'shish qoidasi ishlaydi.",
      en: 'To subtract a number, add its opposite: a − b = a + (−b). Then the addition rule from the last lesson takes over.',
    },
    rule_2: {
      ru: 'Вычесть отрицательное значит прибавить положительное. Канатная дорога: 40 − (−15) = 55 метров, права была Малика.',
      uz: "Manfiyni ayirish musbatni qo'shish demak. Kanat yo'l: 40 − (−15) = 55 metr, Malika haq edi.",
      en: 'Subtracting a negative means adding a positive. The cable car: 40 − (−15) = 55 metres, so Malika was right.',
    },
    audio: {
      ru: 'Запомним правило. Чтобы вычесть число, надо прибавить противоположное. Знак действия и знак вычитаемого меняются вместе, а первое число остаётся как было. Вычесть отрицательное значит прибавить положительное, поэтому результат растёт. Вернёмся к канатной дороге. Сорок минус минус пятнадцать это пятьдесят пять метров. Права была Малика.',
      uz: "Qoidani eslab qolamiz. Sonni ayirish uchun uning qarama-qarshisini qo'shish kerak. Amal ishorasi va ayriluvchi ishorasi birga o'zgaradi, birinchi son esa o'sha holicha qoladi. Manfiyni ayirish musbatni qo'shish demak, shuning uchun natija o'sadi. Kanat yo'lga qaytamiz. Qirq minus minus o'n besh bu ellik besh metr. Malika haq edi.",
      en: 'Let us remember the rule. To subtract a number, add its opposite. The operation sign and the sign of the subtracted number change together, while the first number stays. Subtracting a negative means adding a positive, so the result grows. Back to the cable car. Forty minus minus fifteen is fifty five metres. Malika was right.',
    },
  },

  s_swap: {
    title: { ru: 'Превращаем в сложение', uz: "Qo'shishga aylantiramiz", en: 'Turn it into addition' },
    lead: { ru: 'Считать пока не нужно: только переверни вычитаемое.', uz: "Hozircha hisoblash shart emas: faqat ayriluvchini ag'daring.", en: 'No need to compute yet: just flip the subtracted number.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: '9 − 14 это…', uz: '9 − 14 bu…', en: '9 − 14 is…' },
        opts: ['9 + (−14)', '9 + 14', '−9 + 14'],
        correct: 0,
        ok: { ru: 'Верно. Вычесть 14 значит прибавить −14.', uz: "To'g'ri. 14 ni ayirish −14 ni qo'shish demak.", en: 'Right. Subtracting 14 means adding −14.' },
        wrong: [
          null,
          { ru: 'Знак у 14 обязан поменяться.', uz: "14 ning ishorasi albatta o'zgarishi kerak.", en: 'The sign of the 14 must change.' },
          { ru: 'Первое число не трогаем.', uz: 'Birinchi songa tegmaymiz.', en: 'We leave the first number alone.' },
        ],
      },
      {
        q: { ru: '−6 − (−2) это…', uz: '−6 − (−2) bu…', en: '−6 − (−2) is…' },
        opts: ['−6 + 2', '−6 + (−2)', '6 + 2'],
        correct: 0,
        ok: { ru: 'Верно. Противоположное к −2 это 2.', uz: "To'g'ri. −2 ning qarama-qarshisi 2.", en: 'Right. The opposite of −2 is 2.' },
        wrong: [
          null,
          { ru: 'Знак у −2 остался прежним, а он должен смениться.', uz: "−2 ning ishorasi o'zgarmadi, u esa almashishi kerak.", en: 'The sign of −2 stayed, but it has to flip.' },
          { ru: 'Уменьшаемое −6 переворачивать нельзя.', uz: "Kamayuvchi −6 ni ag'darib bo'lmaydi.", en: 'The first number −6 must not be flipped.' },
        ],
      },
      {
        q: { ru: '−3 − 8 это…', uz: '−3 − 8 bu…', en: '−3 − 8 is…' },
        opts: ['−3 + (−8)', '−3 + 8', '3 + 8'],
        correct: 0,
        ok: { ru: 'Верно. Оба слагаемых отрицательные, ответ −11.', uz: "To'g'ri. Ikkala qo'shiluvchi manfiy, javob −11.", en: 'Right. Both addends are negative, the answer is −11.' },
        wrong: [
          null,
          { ru: 'Тогда получилось бы 5, а вычитание так не работает.', uz: 'U holda 5 chiqardi, ayirish esa unday ishlamaydi.', en: 'That would give 5, and subtraction does not work that way.' },
          { ru: 'Уменьшаемое остаётся отрицательным.', uz: 'Kamayuvchi manfiyligicha qoladi.', en: 'The first number stays negative.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на переворот. Меняем только вычитаемое, первое число не трогаем.',
        uz: "Ag'darish mashqi. Faqat ayriluvchini o'zgartiramiz, birinchi songa tegmaymiz.",
        en: 'Practice on flipping. Change only the subtracted number and leave the first one alone.',
      },
    },
  },

  s_calc: {
    title: { ru: 'Считаем разности', uz: 'Ayirmalarni hisoblaymiz', en: 'Compute the differences' },
    lead: { ru: 'Сначала переворот, потом правило сложения.', uz: "Avval ag'darish, keyin qo'shish qoidasi.", en: 'Flip first, then use the addition rule.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: '−7 − 3', uz: '−7 − 3', en: '−7 − 3' },
        opts: ['−10', '−4', '10'],
        correct: 0,
        ok: { ru: 'Верно. −7 + (−3) = −10.', uz: "To'g'ri. −7 + (−3) = −10.", en: 'Right. −7 + (−3) = −10.' },
        wrong: [
          null,
          { ru: 'Это ответ для −7 + 3, а знак у тройки должен смениться.', uz: "Bu −7 + 3 ning javobi, uchning ishorasi esa almashishi kerak.", en: 'That answers −7 + 3, but the three must flip.' },
          { ru: 'Оба шага влево, ответ отрицательный.', uz: 'Ikkala qadam ham chapga, javob manfiy.', en: 'Both steps go left, the answer is negative.' },
        ],
      },
      {
        q: { ru: '2 − (−9)', uz: '2 − (−9)', en: '2 − (−9)' },
        opts: ['11', '−7', '−11'],
        correct: 0,
        ok: { ru: 'Верно. 2 + 9 = 11, вычли отрицательное и выросли.', uz: "To'g'ri. 2 + 9 = 11, manfiyni ayirdik va o'sdik.", en: 'Right. 2 + 9 = 11: subtracting a negative made it grow.' },
        wrong: [
          null,
          { ru: 'Минус перед скобкой переворачивает девятку в плюс.', uz: "Qavs oldidagi minus to'qqizni plyusga ag'daradi.", en: 'The minus before the bracket flips the nine to plus.' },
          { ru: 'Здесь идём вправо, а не влево.', uz: "Bu yerda o'ngga yuramiz, chapga emas.", en: 'Here we move right, not left.' },
        ],
      },
      {
        q: { ru: '−5 − (−5)', uz: '−5 − (−5)', en: '−5 − (−5)' },
        opts: ['0', '−10', '10'],
        correct: 0,
        ok: { ru: 'Верно. −5 + 5 = 0: числа равны, разность нулевая.', uz: "To'g'ri. −5 + 5 = 0: sonlar teng, ayirma nol.", en: 'Right. −5 + 5 = 0: equal numbers, zero difference.' },
        wrong: [
          null,
          { ru: 'Знак у второй пятёрки должен смениться на плюс.', uz: "Ikkinchi beshning ishorasi plyusga almashishi kerak.", en: 'The second five must flip to plus.' },
          { ru: 'Уменьшаемое отрицательное, до десяти не дотянуть.', uz: "Kamayuvchi manfiy, o'ngacha yetib bo'lmaydi.", en: 'The first number is negative, ten is out of reach.' },
        ],
      },
      {
        q: { ru: 'Когда разность больше уменьшаемого?', uz: 'Ayirma qachon kamayuvchidan katta?', en: 'When is a difference bigger than the first number?' },
        opts: [
          { ru: 'Когда вычитаем отрицательное', uz: 'Manfiyni ayirganda', en: 'When we subtract a negative' },
          { ru: 'Никогда', uz: 'Hech qachon', en: 'Never' },
          { ru: 'Когда уменьшаемое отрицательное', uz: "Kamayuvchi manfiy bo'lganda", en: 'When the first number is negative' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Минус на минус даёт шаг вправо, а он увеличивает.', uz: "To'g'ri. Minus minusga o'ngga qadam beradi, u esa oshiradi.", en: 'Right. Minus of a minus gives a step right, and that increases.' },
        wrong: [
          null,
          { ru: '2 − (−9) = 11, а это больше двух.', uz: '2 − (−9) = 11, bu esa ikkidan katta.', en: '2 − (−9) = 11, which is more than two.' },
          { ru: '−7 − 3 = −10, стало меньше.', uz: '−7 − 3 = −10, kichrayib ketdi.', en: '−7 − 3 = −10, it got smaller.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на вычисления. Сначала переворот, потом правило знаков из прошлого урока.',
        uz: "Hisoblash mashqi. Avval ag'darish, keyin o'tgan darsdagi ishoralar qoidasi.",
        en: 'Computation practice. Flip first, then the sign rule from the last lesson.',
      },
    },
  },

  s_bins: {
    title: { ru: 'Какой знак у разности', uz: 'Ayirma ishorasi qanday', en: 'What sign will the difference have' },
    lead: { ru: 'Переверни в уме и посмотри, куда пойдёт шаг.', uz: "Xayolan ag'daring va qadam qayoqqa borishiga qarang.", en: 'Flip it in your head and see which way the step goes.' },
    bin_a: { ru: 'Разность положительная', uz: 'Ayirma musbat', en: 'The difference is positive' },
    bin_b: { ru: 'Разность отрицательная', uz: 'Ayirma manfiy', en: 'The difference is negative' },
    cards: [
      { label: '3 − (−4)', bin: 'a' },
      { label: '10 − 2', bin: 'a' },
      { label: '−1 − (−6)', bin: 'a' },
      { label: '2 − 9', bin: 'b' },
      { label: '−4 − 1', bin: 'b' },
      { label: '−8 − (−3)', bin: 'b' },
    ],
    hint: {
      ru: 'Переверните вычитаемое, дальше знак решается сравнением модулей.',
      uz: "Ayriluvchini ag'daring, keyin ishora modullarni solishtirish bilan hal bo'ladi.",
      en: 'Flip the subtracted number, then compare the absolute values.',
    },
    correct_text: {
      ru: 'Верно. Переворот превращает любую разность в знакомую сумму.',
      uz: "To'g'ri. Ag'darish har qanday ayirmani tanish yig'indiga aylantiradi.",
      en: 'Right. Flipping turns any difference into a familiar sum.',
    },
    audio: {
      intro: {
        ru: 'Разложите разности по двум корзинам. Считать до конца не обязательно.',
        uz: 'Ayirmalarni ikki savatga ajrating. Oxirigacha hisoblash shart emas.',
        en: 'Sort the differences into two baskets. No need to compute fully.',
      },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда. Переверни вычитаемое и сравни модули.', uz: "Bu yerga emas. Ayriluvchini ag'daring va modullarni solishtiring.", en: 'Not here. Flip the subtracted number and compare.' },
    },
  },

  s_error: {
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikidek tekshiring.", en: 'Check someone else’s work the way you would check your own.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Санжар: «−4 − 6 = 2, ведь 6 − 4 = 2». Проверь.', uz: "Sanjar: «−4 − 6 = 2, axir 6 − 4 = 2». Tekshiring.", en: 'Sanjar: “−4 − 6 = 2 because 6 − 4 = 2.” Check it.' },
        opts: [
          { ru: 'Нет: −4 + (−6) = −10', uz: "Yo'q: −4 + (−6) = −10", en: 'No: −4 + (−6) = −10' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, будет −2', uz: "Yo'q, −2 bo'ladi", en: 'No, it is −2' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Вычесть 6 значит прибавить −6, оба шага влево.', uz: "To'g'ri. 6 ni ayirish −6 ni qo'shish demak, ikkala qadam ham chapga.", en: 'Right. Subtracting 6 means adding −6, both steps go left.' },
        wrong: [
          null,
          { ru: 'Числа переставили местами, в вычитании так нельзя.', uz: "Sonlar o'rni almashtirilgan, ayirishda bunday qilib bo'lmaydi.", en: 'The numbers were swapped, which subtraction does not allow.' },
          { ru: 'Модули складываются: знаки после переворота одинаковые.', uz: "Modullar qo'shiladi: ag'darishdan keyin ishoralar bir xil.", en: 'The absolute values add: after the flip the signs match.' },
        ],
      },
      {
        q: { ru: 'Малика: «3 − (−5) = −2, ведь минусов больше». Проверь.', uz: "Malika: «3 − (−5) = −2, axir minuslar ko'p». Tekshiring.", en: 'Malika: “3 − (−5) = −2 because there are more minuses.” Check it.' },
        opts: [
          { ru: 'Нет: 3 + 5 = 8', uz: "Yo'q: 3 + 5 = 8", en: 'No: 3 + 5 = 8' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, будет −8', uz: "Yo'q, −8 bo'ladi", en: 'No, it is −8' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Вычесть отрицательное значит прибавить положительное.', uz: "To'g'ri. Manfiyni ayirish musbatni qo'shish demak.", en: 'Right. Subtracting a negative means adding a positive.' },
        wrong: [
          null,
          { ru: 'Минусы не считают по количеству: важен переворот вычитаемого.', uz: "Minuslar soni bo'yicha hisoblanmaydi: ayriluvchining ag'darilishi muhim.", en: 'You do not count minuses: what matters is flipping the subtracted number.' },
          { ru: 'После переворота оба слагаемых положительные.', uz: "Ag'darishdan keyin ikkala qo'shiluvchi ham musbat.", en: 'After the flip both addends are positive.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Проверьте чужое решение. Ошибка бывает и в порядке чисел, и в знаке вычитаемого.',
        uz: "Birovning yechimini tekshiring. Xato sonlar tartibida ham, ayriluvchi ishorasida ham bo'ladi.",
        en: 'Check someone else’s work. A mistake can be in the order of the numbers and in the sign of the subtracted one.',
      },
    },
  },

  s_task: {
    title: { ru: 'Перепад высот', uz: 'Balandliklar farqi', en: 'The height difference' },
    lead: { ru: 'Нижняя станция −15 м, верхняя +40 м, площадка отдыха +12 м.', uz: 'Quyi bekat −15 m, yuqorigisi +40 m, dam olish maydonchasi +12 m.', en: 'Lower station −15 m, upper +40 m, rest area +12 m.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'На сколько верхняя станция выше нижней?', uz: 'Yuqori bekat quyisidan qanchaga baland?', en: 'How much higher is the upper station?' },
        opts: [
          { ru: '55 м', uz: '55 m', en: '55 m' },
          { ru: '25 м', uz: '25 m', en: '25 m' },
          { ru: '−55 м', uz: '−55 m', en: '−55 m' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 40 − (−15) = 55 метров.', uz: "To'g'ri. 40 − (−15) = 55 metr.", en: 'Right. 40 − (−15) = 55 metres.' },
        wrong: [
          null,
          { ru: 'Знак у нижней станции потерян: она ниже нуля.', uz: "Quyi bekatning ishorasi yo'qolgan: u noldan pastda.", en: 'The sign of the lower station was lost: it is below zero.' },
          { ru: 'Верхняя выше, значит разность положительная.', uz: 'Yuqorigisi baland, demak ayirma musbat.', en: 'The upper one is higher, so the difference is positive.' },
        ],
      },
      {
        q: { ru: 'На сколько площадка отдыха выше нижней станции?', uz: 'Dam olish maydonchasi quyi bekatdan qanchaga baland?', en: 'How much higher is the rest area than the lower station?' },
        opts: [
          { ru: '27 м', uz: '27 m', en: '27 m' },
          { ru: '3 м', uz: '3 m', en: '3 m' },
          { ru: '−27 м', uz: '−27 m', en: '−27 m' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 12 − (−15) = 27 метров.', uz: "To'g'ri. 12 − (−15) = 27 metr.", en: 'Right. 12 − (−15) = 27 metres.' },
        wrong: [
          null,
          { ru: 'Это 15 − 12, а вычитать надо нижнюю отметку со своим знаком.', uz: "Bu 15 − 12, ayirish esa quyi belgini o'z ishorasi bilan olishni talab qiladi.", en: 'That is 15 − 12, but the lower mark must keep its own sign.' },
          { ru: 'Площадка выше станции, разность положительная.', uz: 'Maydoncha bekatdan baland, ayirma musbat.', en: 'The area is above the station, so the difference is positive.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Задача про канатную дорогу. Нижняя станция на минус пятнадцати, верхняя на сорока, площадка отдыха на двенадцати метрах.',
        uz: "Kanat yo'l haqida masala. Quyi bekat minus o'n beshda, yuqorigisi qirqda, dam olish maydonchasi o'n ikki metrda.",
        en: 'A cable car problem. The lower station at minus fifteen, the upper at forty, the rest area at twelve metres.',
      },
    },
  },

  s_final: {
    intro_line: { ru: 'Пять заданий на весь урок.', uz: 'Butun darsga beshta topshiriq.', en: 'Five tasks covering the whole lesson.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        kind: 'num', ans: 13,
        q: { ru: 'Вычисли 6 − (−7). Набери ответ.', uz: '6 − (−7) ni hisoblang. Javobni tering.', en: 'Compute 6 − (−7). Type the answer.' },
        hint: { ru: 'Вычесть −7 значит прибавить 7.', uz: "−7 ni ayirish 7 ni qo'shish demak.", en: 'Subtracting −7 means adding 7.' },
        hint_audio: { ru: 'Вычесть минус семь значит прибавить семь, поэтому считаем шесть плюс семь.', uz: "Minus yettini ayirish yettini qo'shish demak, shuning uchun olti qo'shuv yettini hisoblaymiz.", en: 'Subtracting minus seven means adding seven, so compute six plus seven.' },
      },
      {
        kind: 'mc', correctIndex: 2,
        q: { ru: 'Сколько будет −8 − 4?', uz: '−8 − 4 nechaga teng?', en: 'What is −8 − 4?' },
        opts: ['−4', '4', '−12', '12'],
        wrong: [
          { ru: 'Это ответ для −8 + 4, знак у четвёрки не сменили.', uz: "Bu −8 + 4 ning javobi, to'rtning ishorasi almashtirilmagan.", en: 'That answers −8 + 4: the four was not flipped.' },
          { ru: 'Оба шага влево, положительным ответ быть не может.', uz: "Ikkala qadam ham chapga, javob musbat bo'lolmaydi.", en: 'Both steps go left, the answer cannot be positive.' },
          null,
          { ru: 'Число верное, а знак потерян.', uz: "Son to'g'ri, ishora esa yo'qolgan.", en: 'The number is right but the sign is lost.' },
        ],
        correct: { ru: 'Верно. −8 + (−4) = −12.', uz: "To'g'ri. −8 + (−4) = −12.", en: 'Right. −8 + (−4) = −12.' },
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'Во что превращается a − b?', uz: 'a − b nimaga aylanadi?', en: 'What does a − b turn into?' },
        opts: ['(−a) + b', 'a + (−b)', '(−a) + (−b)', 'b + (−a)'],
        wrong: [
          { ru: 'Уменьшаемое остаётся как было.', uz: "Kamayuvchi o'sha holicha qoladi.", en: 'The first number stays as it was.' },
          null,
          { ru: 'Знак меняется только у вычитаемого.', uz: "Ishora faqat ayriluvchida o'zgaradi.", en: 'Only the subtracted number changes sign.' },
          { ru: 'Это b − a, а порядок в вычитании важен.', uz: 'Bu b − a, ayirishda esa tartib muhim.', en: 'That is b − a, and order matters in subtraction.' },
        ],
        correct: { ru: 'Верно. Вычесть значит прибавить противоположное.', uz: "To'g'ri. Ayirish qarama-qarshini qo'shish demak.", en: 'Right. Subtracting means adding the opposite.' },
      },
      {
        kind: 'mc', correctIndex: 3,
        q: { ru: 'Сколько будет −2 − (−9)?', uz: '−2 − (−9) nechaga teng?', en: 'What is −2 − (−9)?' },
        opts: ['−11', '11', '−7', '7'],
        wrong: [
          { ru: 'Знак у −9 после переворота станет плюсом.', uz: "Ag'darishdan keyin −9 ning ishorasi plyus bo'ladi.", en: 'After the flip the −9 becomes plus.' },
          { ru: 'Модули складывают только при одинаковых знаках.', uz: "Modullar faqat bir xil ishorada qo'shiladi.", en: 'Absolute values add only with equal signs.' },
          { ru: 'Вправо прошли дальше, чем влево.', uz: "O'ngga chapga qaraganda uzoqroq yurildi.", en: 'We went further right than left.' },
          null,
        ],
        correct: { ru: 'Верно. −2 + 9 = 7.', uz: "To'g'ri. −2 + 9 = 7.", en: 'Right. −2 + 9 = 7.' },
      },
      {
        kind: 'mc', correctIndex: 0,
        q: { ru: 'Утром было −9, к полудню стало 3. На сколько потеплело?', uz: "Ertalab −9 edi, tushga borib 3 bo'ldi. Necha darajaga isidi?", en: 'It was −9 in the morning and 3 by noon. How much did it warm?' },
        opts: [
          { ru: 'на 12', uz: '12 ga', en: 'by 12' },
          { ru: 'на 6', uz: '6 ga', en: 'by 6' },
          { ru: 'на −6', uz: '−6 ga', en: 'by −6' },
          { ru: 'на −12', uz: '−12 ga', en: 'by −12' },
        ],
        wrong: [
          null,
          { ru: 'Знак у утренней температуры потерян.', uz: "Ertalabki haroratning ishorasi yo'qolgan.", en: 'The sign of the morning temperature was lost.' },
          { ru: 'Потепление отрицательным не бывает.', uz: "Isish manfiy bo'lmaydi.", en: 'Warming cannot be negative.' },
          { ru: 'Число верное, а знак лишний.', uz: "Son to'g'ri, ishora esa ortiqcha.", en: 'The number is right but the sign is extra.' },
        ],
        correct: { ru: 'Верно. 3 − (−9) = 12 градусов.', uz: "To'g'ri. 3 − (−9) = 12 daraja.", en: 'Right. 3 − (−9) = 12 degrees.' },
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
      ru: 'На Луне нет воздуха, который сглаживал бы жару и холод. Днём поверхность нагревается примерно до 127 градусов, ночью остывает до −173. Перепад ровно такой, какой даёт вычитание: 127 − (−173) = 300 градусов.',
      uz: "Oyda issiq va sovuqni yumshatadigan havo yo'q. Kunduzi yuza taxminan 127 darajagacha qiziydi, kechasi −173 gacha soviydi. Farq aynan ayirish bergani kabi: 127 − (−173) = 300 daraja.",
      en: 'The Moon has no air to soften heat and cold. By day the surface reaches about 127 degrees, by night it falls to −173. The gap is exactly what subtraction gives: 127 − (−173) = 300 degrees.',
    },
    fact_audio: {
      ru: 'Знаешь ли ты? На Луне нет воздуха, который сглаживал бы жару и холод. Днём поверхность нагревается примерно до ста двадцати семи градусов, а ночью остывает до минус ста семидесяти трёх. Перепад ровно такой, какой даёт вычитание: сто двадцать семь минус минус сто семьдесят три это триста градусов.',
      uz: "Bilasizmi? Oyda issiq va sovuqni yumshatadigan havo yo'q. Kunduzi yuza taxminan bir yuz yigirma yetti darajagacha qiziydi, kechasi esa minus bir yuz yetmish uchgacha soviydi. Farq aynan ayirish bergani kabi: bir yuz yigirma yetti minus minus bir yuz yetmish uch bu uch yuz daraja.",
      en: 'Did you know? The Moon has no air to soften heat and cold. By day the surface reaches about one hundred twenty seven degrees, by night it falls to minus one hundred seventy three. The gap is exactly what subtraction gives: one hundred twenty seven minus minus one hundred seventy three is three hundred degrees.',
    },
  },

  s14: {
    banner: { ru: 'Математика · Отрицательные числа', uz: 'Matematika · Manfiy sonlar', en: 'Mathematics · Negative numbers' },
    heading: { ru: 'Вычитание', uz: 'Ayirish', en: 'Subtraction' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    brief_1: { ru: 'a − b = a + (−b)', uz: 'a − b = a + (−b)', en: 'a − b = a + (−b)' },
    brief_2: { ru: 'меняется только вычитаемое', uz: "faqat ayriluvchi o'zgaradi", en: 'only the subtracted number changes' },
    brief_3: { ru: 'вычесть отрицательное — прибавить', uz: "manfiyni ayirish — qo'shish", en: 'subtracting a negative means adding' },
    memo_title: { ru: 'Что помнить', uz: 'Nimani eslash kerak', en: 'What to remember' },
    memo_q1: { ru: 'Разность высот', uz: 'Balandliklar farqi', en: 'A height difference' },
    memo_a1: { ru: 'верхняя минус нижняя', uz: 'yuqorisi minus quyisi', en: 'upper minus lower' },
    memo_q2: { ru: 'Порядок чисел', uz: 'Sonlar tartibi', en: 'The order of numbers' },
    memo_a2: { ru: 'менять нельзя', uz: "o'zgartirib bo'lmaydi", en: 'must not change' },
    memo_q3: { ru: 'Частая ошибка', uz: 'Tez-tez uchraydigan xato', en: 'A common mistake' },
    memo_a3: { ru: 'вычесть меньшее из большего', uz: 'kichikni kattadan ayirish', en: 'subtracting smaller from bigger' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'Чтобы вычесть число, надо прибавить противоположное. Первое число остаётся как было, меняется только вычитаемое. Вычесть отрицательное значит прибавить положительное, и результат растёт.',
        'Канатная дорога: сорок минус минус пятнадцать это пятьдесят пять метров.',
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "Sonni ayirish uchun uning qarama-qarshisini qo'shish kerak. Birinchi son o'sha holicha qoladi, faqat ayriluvchi o'zgaradi. Manfiyni ayirish musbatni qo'shish demak, natija esa o'sadi.",
        "Kanat yo'l: qirq minus minus o'n besh bu ellik besh metr.",
      ],
      en: [
        'The lesson is done. Let us gather the main points.',
        'To subtract a number, add its opposite. The first number stays, only the subtracted one changes. Subtracting a negative means adding a positive, and the result grows.',
        'The cable car: forty minus minus fifteen is fifty five metres.',
      ],
    },
  },

  s_methods: {
    m1_title: { ru: 'Способ. Переворот', uz: "Usul. Ag'darish", en: 'Method. The flip' },
    m1_steps: {
      ru: ['Найди вычитаемое', 'Замени вычитание сложением, а число противоположным', 'Сложи по правилу знаков'],
      uz: ['Ayriluvchini toping', "Ayirishni qo'shishga, sonni qarama-qarshisiga almashtiring", "Ishoralar qoidasi bo'yicha qo'shing"],
      en: ['Find the subtracted number', 'Replace subtraction with addition and the number with its opposite', 'Add by the sign rule'],
    },
    m1_no: {
      ru: 'Уменьшаемое не трогаем: знак меняется только у второго числа.',
      uz: "Kamayuvchiga tegmaymiz: ishora faqat ikkinchi sonda o'zgaradi.",
      en: 'Leave the first number alone: only the second one changes sign.',
    },
  },
};

// ============================================================
// СЦЕНЫ УРОКА: канатная дорога в горах, ноль на указателе — уровень посёлка.
// ============================================================
const HookScene = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="d28sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#EAF4F9"/><stop offset="100%" stopColor="#F9F4EB"/>
      </linearGradient>
      <linearGradient id="d28lake" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#8FCBE0"/><stop offset="100%" stopColor="#5FA9C6"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="400" height="154" fill="url(#d28sky)"/>

    {/* Дальние вершины */}
    <path d="M0 96 L58 40 L104 96 Z" fill="#C2CBBF"/>
    <path d="M92 96 L150 34 L206 96 Z" fill="#AEB9AB"/>
    <path d="M150 34 L164 50 L150 56 L136 50 Z" fill="#FFFDF7"/>

    {/* Склон: нижняя площадка у озера и верхняя смотровая */}
    <path d="M0 154 L0 128 L120 128 L250 66 L400 52 L400 154 Z" fill="#8FBF7F"/>
    <path d="M0 128 L120 128 L250 66 L400 52" fill="none" stroke="#6FA463" strokeWidth="2"/>

    {/* Озеро внизу */}
    <ellipse cx="56" cy="138" rx="48" ry="11" fill="url(#d28lake)"/>
    <path className="d28-ripple" d="M30 138 q10 -3 20 0 q10 3 20 0" fill="none" stroke="#FFFDF7" strokeWidth="1.4" opacity="0.7"/>

    {/* Канат и кабинка, которая едет вверх */}
    <path d="M62 116 L340 46" stroke="#7B7367" strokeWidth="1.6"/>
    <g className="d28-cab">
      <rect x="-11" y="0" width="22" height="17" rx="4" fill="#F5C77E" stroke="#C9A472" strokeWidth="1.6"/>
      <rect x="-7" y="4" width="14" height="7" rx="2" fill="#EAF4F9"/>
      <path d="M0 0 v-6" stroke="#7B7367" strokeWidth="1.6"/>
    </g>

    {/* Мачты станций */}
    <rect x="58" y="116" width="5" height="16" fill="#7B7367"/>
    <rect x="336" y="46" width="5" height="14" fill="#7B7367"/>

    {/* Указатель высот: −15 у озера, 0 посёлок, +40 наверху */}
    <g>
      <rect x="176" y="86" width="66" height="46" rx="5" fill="#FFFDF7" stroke="#C9A472" strokeWidth="2"/>
      <text x="209" y="101" textAnchor="middle" fill="#D9603F"
        fontFamily="'JetBrains Mono', monospace" fontSize="12" fontWeight="700">+40</text>
      <text x="209" y="115" textAnchor="middle" fill="#494550"
        fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">0</text>
      <text x="209" y="128" textAnchor="middle" fill="#019ACB"
        fontFamily="'JetBrains Mono', monospace" fontSize="12" fontWeight="700">−15</text>
      <rect x="206" y="132" width="5" height="12" fill="#B08A55"/>
    </g>

    {/* Двое с рюкзаками у нижней станции */}
    <Person x={96} ground={130} head={12} shirt="#7ECBE6" hair="#3E3128"/>
    <rect x="86" y="106" width="9" height="12" rx="3" fill="#D9603F"/>
    <Person x={126} ground={128} head={12} shirt="#F5C77E" hair="#5A4636"/>
    <rect x="116" y="104" width="9" height="12" rx="3" fill="#3F5B4A"/>
  </svg>
);

// Итог: переворот вычитаемого и ответ.
const FinalScene = () => (
  <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
    <rect x="0" y="0" width="400" height="92" fill="#F9F4EB"/>
    <g>
      <rect x="30" y="26" width="140" height="40" rx="8" fill="#FFF1EC" stroke="#F3C4B4" strokeWidth="2"/>
      <text x="100" y="52" textAnchor="middle" fill="#D9603F"
        fontFamily="'JetBrains Mono', monospace" fontSize="17" fontWeight="700">40 − (−15)</text>
    </g>
    <path d="M180 46 h34" stroke="#8E8578" strokeWidth="2.4" markerEnd="url(#d28fin)"/>
    <defs>
      <marker id="d28fin" markerWidth="8" markerHeight="8" refX="6" refY="3.5" orient="auto">
        <path d="M0 0 L7 3.5 L0 7 z" fill="#8E8578"/>
      </marker>
    </defs>
    <g>
      <rect x="224" y="26" width="146" height="40" rx="8" fill="#E3F0E8" stroke="#A9CFBA" strokeWidth="2"/>
      <text x="297" y="52" textAnchor="middle" fill="#1F7A4D"
        fontFamily="'JetBrains Mono', monospace" fontSize="17" fontWeight="700">40 + 15 = 55</text>
    </g>
    <text x="200" y="82" textAnchor="middle" fill="#8A8883"
      fontFamily="'Manrope', system-ui, sans-serif" fontSize="11" fontWeight="700">a − b = a + (−b)</text>
  </svg>
);

// ============================================================
// БЛОКИ ЭКРАНОВ
// ============================================================
// Прямая из уроков 24-27: шаги показывают, куда ведёт слагаемое.
const NumLine = ({ from = -9, to = 9, points = [], arcs = [], size = 'mid', tick = 1 }) => {
  const n = to - from;
  const step = 380 / n;
  const y = 52;
  const px = (v) => 10 + (v - from) * step;
  return (
    <span className={'d28-line-box d28-line-' + size}>
      <svg viewBox="0 0 400 78" aria-hidden="true">
        <defs>
          <marker id="d28ar-r" markerWidth="7" markerHeight="7" refX="5.4" refY="3" orient="auto">
            <path d="M0 0 L6 3 L0 6 z" fill="#D9603F"/>
          </marker>
          <marker id="d28ar-l" markerWidth="7" markerHeight="7" refX="5.4" refY="3" orient="auto">
            <path d="M0 0 L6 3 L0 6 z" fill="#019ACB"/>
          </marker>
        </defs>
        <path d={`M4 ${y} h392`} stroke="#8E8578" strokeWidth="2.2"/>
        {Array.from({ length: n + 1 }, (_, i) => {
          const v = from + i;
          const x = px(v);
          const big = v % tick === 0;
          if (!big && tick > 1) return null;
          return (
            <g key={v}>
              <path d={`M${x} ${y - (big ? 5 : 3)} v${big ? 10 : 6}`} stroke="#8E8578" strokeWidth={v === 0 ? 3 : 1.2}/>
              {big && (
                <text x={x} y={y + 20} textAnchor="middle" fill={v === 0 ? '#494550' : '#8A8883'}
                  fontFamily="'JetBrains Mono', monospace" fontSize="9" fontWeight="700">{v}</text>
              )}
            </g>
          );
        })}
        {arcs.map((a, i) => {
          const right = a.to > a.from;
          const tone = right ? '#D9603F' : '#019ACB';
          const mid = (a.from + a.to) / 2;
          const rise = Math.min(34, 12 + Math.abs(a.to - a.from) * step * 0.32);
          return (
            <g key={i}>
              <path d={`M${px(a.from)} ${y - 4} Q ${px(mid)} ${y - rise * 2} ${px(a.to)} ${y - 4}`}
                fill="none" stroke={tone} strokeWidth="2" strokeLinecap="round"
                markerEnd={right ? 'url(#d28ar-r)' : 'url(#d28ar-l)'}/>
              {a.name && (
                <text x={px(mid)} y={y - rise - 4} textAnchor="middle" fill={tone}
                  fontFamily="'JetBrains Mono', monospace" fontSize="12" fontWeight="700">{a.name}</text>
              )}
            </g>
          );
        })}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={px(p.v)} cy={y} r="6" fill={p.tone || (p.v < 0 ? '#019ACB' : '#D9603F')}/>
            {p.name && (
              <text x={px(p.v)} y={y + 20} textAnchor="middle" fill={p.tone || (p.v < 0 ? '#019ACB' : '#D9603F')}
                fontFamily="'JetBrains Mono', monospace" fontSize="12" fontWeight="700">{p.name}</text>
            )}
          </g>
        ))}
      </svg>
    </span>
  );
};

// Прибор урока: карточка вычитаемого переворачивается в слагаемое.
const Flip = ({ before, after, on }) => (
  <span className="d28-flip">
    <i className="d28-flip-card d28-flip-before">{before}</i>
    <i className={'d28-flip-arrow d28-fade' + (on ? ' d28-on' : '')}>→</i>
    <i className={'d28-flip-card d28-flip-after d28-fade' + (on ? ' d28-on' : '')}>{after}</i>
  </span>
);

const Line = ({ node, on }) => (
  <span className={'d28-line d28-fade' + (on ? ' d28-on' : '')}>{mt(node)}</span>
);

const RecallBody = ({ step }) => {
  const t = useT();
  const lang = useLang();
  const c = CONTENT.s_recall;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d28-stage">
        <NumLine from={-9} to={9}
          points={[{ v: -7, name: '−7' }, { v: 7, name: '7' }, { v: 0, name: '0', tone: '#1F7A4D' }]}/>
        <span className={'d28-chips d28-fade' + (step >= 1 ? ' d28-on' : '')}>
          <i className="d28-chip-l">{tri(lang, 'один модуль: 7', 'bitta modul: 7', 'one absolute value: 7')}</i>
          <i className="d28-chip-g">7 + (−7) = 0</i>
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

// Ядро: перепад высот у канатной дороги.
const CoreBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_core;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d28-stage">
        <Flip before="− (−15)" after="+ 15" on={step >= 1}/>
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

// Вычитание отрицательного: шаг идёт вправо.
const MinusBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_minus;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d28-stage">
        <NumLine from={-2} to={12} size="sm"
          arcs={step >= 1 ? [{ from: 4, to: 11, name: '+7' }] : []}
          points={step >= 1 ? [{ v: 11, name: '11' }] : [{ v: 4, name: '4' }]}/>
        <Flip before="− (−7)" after="+ 7" on={step >= 1}/>
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
      <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink3 }}>{mt(t(c.lead))}</p>
      <div className="frame fade-up delay-1 d28-stage">
        <NumLine from={-9} to={3} size="sm"
          arcs={[
            ...(step >= 0 ? [{ from: -6, to: -2, name: '+4' }] : []),
            ...(step >= 1 ? [{ from: -2, to: -7, name: '−5' }] : []),
          ]}
          points={step >= 1 ? [{ v: -7, name: '−7' }] : [{ v: -2, name: '−2' }]}/>
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

// Граница: порядок чисел и знак вычитаемого.
const EdgeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_edge;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d28-stage">
        <span className="d28-pair d28-pair-bad"><Line node={t(c.bad_line)} on/></span>
        <span className={'d28-pair d28-pair-good d28-fade' + (step >= 1 ? ' d28-on' : '')}>
          <Line node={t(c.good_line)} on/>
        </span>
        <span className={'d28-pair d28-pair-warn d28-fade' + (step >= 2 ? ' d28-on' : '')}>
          <Line node={t(c.warn_line)} on/>
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
    <Stage screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div className="rv-col">
        <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
        <div className={'d28-banner fade-up delay-1' + (phase === 'play' ? ' d28-banner-play' : '')}>
          {t(phase === 'demo' ? c.demo_banner : c.play_banner)}
        </div>

        <div className="frame fade-up delay-1 d28-stage d28-stage-tool">
          {phase === 'demo' ? (
            <>
              <Flip before="− 5" after="+ (−5)" on={shown >= 1}/>
              <NumLine from={-9} to={1} size="sm"
                arcs={shown >= 1 ? [{ from: -3, to: -8, name: '−5' }] : []}
                points={shown >= 1 ? [{ v: -8, name: '−8' }] : [{ v: -3, name: '−3' }]}/>
              {c.demo_lines.map((l, i) => <Line key={i} node={t(l)} on={shown >= i}/>)}
              <p className={'body d28-verdict' + (done ? ' d28-verdict-on' : '')}>{done ? t(c.demo_note) : ''}</p>
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
          <div className="d28-acts fade-up">
            <button className="d28-btn" disabled={!done} onClick={() => setShown(0)}>{t(c.again)}</button>
            <button className="d28-btn d28-btn-go" disabled={!done} onClick={toPlay}>{t(c.to_play)}</button>
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
const ScreenMinus = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_minus} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <MinusBody step={step}/>}/>
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
      <div className="d28-stage">
        <Flip before="40 − (−15)" after="40 + 15 = 55" on/>
      </div>
    )}/>
);

const methodAside = (
  <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps} note={CONTENT.s_methods.m1_no}/>
);

const ScreenSwap = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_swap} asideNode={methodAside}/>
);
const ScreenCalc = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_calc} asideNode={methodAside}/>
);
const ScreenBins = (props) => (
  <Classify {...props} screenContent={CONTENT.s_bins} totalScreens={TOTAL_SCREENS}/>
);
const ScreenError = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_error}/>
);

// Задача: три отметки высоты на одной шкале.
const TaskFig = ({ idx }) => (
  <div className="d28-task-fig">
    <NumLine from={-20} to={45} size="sm" tick={5}
      arcs={idx >= 1 ? [{ from: -15, to: 12, name: '+27' }] : [{ from: -15, to: 40, name: '+55' }]}
      points={idx >= 1
        ? [{ v: -15, name: '−15' }, { v: 12, name: '12' }]
        : [{ v: -15, name: '−15' }, { v: 40, name: '40' }]}/>
  </div>
);

const ScreenTask = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_task}
    figureNode={(it, idx) => <TaskFig idx={idx}/>}/>
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
.d28-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(9px, 1.7vw, 14px); padding: clamp(12px, 2.4vw, 18px) !important; }
.d28-stage-tool { gap: clamp(4px, 0.8vw, 7px) !important; padding: clamp(7px, 1.5vw, 11px) !important; }
.d28-stage-tool .d28-line { font-size: clamp(12px, 2vw, 16px); }
.d28-stage-tool .d28-flip-card { font-size: clamp(13px, 2.2vw, 18px); padding: 5px 12px; }
.d28-stage-tool .d28-line-box { max-width: 54%; }

/* Прямая с шагами */
.d28-line-box { display: block; width: 100%; }
.d28-line-box svg { width: 100%; height: auto; display: block; }
.d28-line-sm { max-width: 92%; }

.d28-fade { opacity: 0; transition: opacity 420ms linear; }
.d28-on { opacity: 1; }
.d28-line { font-family: 'JetBrains Mono', monospace; font-size: clamp(12px, 2.3vw, 17px); font-weight: 700; color: #494550; text-align: center; }

/* Переворот вычитаемого */
.d28-flip { display: inline-flex; align-items: center; gap: clamp(8px, 1.6vw, 14px); flex-wrap: wrap; justify-content: center; }
.d28-flip-card { font-style: normal; padding: 7px 15px; border-radius: 12px; font-family: 'JetBrains Mono', monospace; font-size: clamp(15px, 2.8vw, 22px); font-weight: 700; }
.d28-flip-before { background: #FFF1EC; border: 1px solid #F3C4B4; color: #D9603F; }
.d28-flip-after { background: #E3F0E8; border: 1px solid #A9CFBA; color: #1F7A4D; }
.d28-flip-arrow { font-style: normal; font-size: clamp(16px, 3vw, 24px); color: #8A8883; }

/* Подписи */
.d28-chips { display: inline-flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
.d28-chips i { font-style: normal; padding: 5px 12px; border-radius: 10px; font-family: 'JetBrains Mono', monospace; font-size: clamp(12px, 2.1vw, 16px); font-weight: 700; }
.d28-chip-l { background: #E7F5FA; border: 1px solid #B6DCEA; color: #019ACB; }
.d28-chip-g { background: #E3F0E8; border: 1px solid #A9CFBA; color: #1F7A4D; }

/* Строки экрана границы */
.d28-pair { width: 100%; padding: clamp(5px, 1.2vw, 9px); border-radius: 12px; text-align: center; }
.d28-pair-bad { background: #FFF1EC; border: 1px solid #F3C4B4; }
.d28-pair-good { background: #E3F0E8; border: 1px solid #A9CFBA; }
.d28-pair-warn { background: #FBF3D6; border: 1px solid #E4CE93; }

/* Задача */
.d28-task-fig { display: block; width: 100%; }

/* Экран 4 */
.d28-banner { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; font-size: clamp(13px, 2.2vw, 16px); font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 4px 11px; }
.d28-banner-play { color: #1F7A4D; background: #E3F0E8; }
.d28-verdict { margin: 0; min-height: 0; opacity: 0; transition: opacity 420ms linear; text-align: center; }
.d28-verdict-on { opacity: 1; }
.d28-acts { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.d28-btn { height: 36px; padding: 0 18px; border-radius: 12px; border: 1px solid #E9E3D9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(14px, 2.2vw, 16px); font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.d28-btn:disabled { opacity: 0.45; cursor: default; }
.d28-btn-go { border-color: #FF4F28; color: #FF4F28; }
.d28-btn-go:hover:not(:disabled) { background: #FFE8E1; }

/* Движение сцены: кабинка едет вверх, по озеру идёт рябь */
.d28-cab { animation: d28Cab 9000ms linear infinite; }
@keyframes d28Cab { from { transform: translate(62px, 116px); } to { transform: translate(340px, 46px); } }
.d28-ripple { animation: d28Ripple 3600ms ease-in-out infinite; }
@keyframes d28Ripple { 0%, 100% { opacity: 0.25; } 50% { opacity: 0.75; } }
@media (prefers-reduced-motion: reduce) { .d28-cab { animation: none; transform: translate(200px, 82px); } .d28-ripple { animation: none; } }
`;

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function SubRationalLesson({
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
  });

  const [current, setCurrent] = useState(Math.min(PREVIEW_START, TOTAL_SCREENS - 1));
  const [answers, setAnswers] = useState([]);

  const screens = [ScreenHook, ScreenRecall, ScreenCore, ScreenTool, ScreenMinus, ScreenSolve, ScreenEdge,
    ScreenRule, ScreenSwap, ScreenCalc, ScreenBins, ScreenError, ScreenTask, ScreenFinal, Screen14];
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
