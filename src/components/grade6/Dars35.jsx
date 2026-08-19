// ============================================================
// 6 КЛАСС, УРОК 35 «Решение задач с помощью уравнения»
// Собран по context/GRADE6_ETALON.md на общем слое ./screens.jsx.
//
// Блок Б9, третий урок. Уравнение решать уже умеем (урок 34), поэтому
// весь урок про перевод текста в запись: что обозначить буквой, как
// выразить остальное и как вернуться к вопросу задачи. Отдельный экран
// отдан именно возврату: найденный корень часто не есть ответ.
//
// Сцена — актовый зал перед школьным концертом, касса с билетами.
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
  lessonId: 'grade6-35',
  lessonTitle: {
    ru: 'Решение задач с помощью уравнения',
    uz: 'Tenglama yordamida masalalar yechish',
    en: 'Solving problems with equations',
  },
};

const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',    scored: false, scope: 'hook' },     //  1 konsert: 40 chipta, farq 8
  { id: 's_recall', type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  2 tenglama va ildiz esga tushadi
  { id: 's_core',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  3 nimani x deb olamiz
  { id: 's_tool',   type: 'exploration', template: 'custom',        scored: false, scope: null },       //  4 USUL: shartdan tenglamaga
  { id: 's_back',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  5 savolga qaytish
  { id: 's_solve',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  6 birga yechamiz: ikki sinf
  { id: 's_edge',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  7 chegara: ildiz javob emas
  { id: 's_rule',   type: 'rule',        template: 'RuleScreen',    scored: false, scope: null },       //  8 QOIDA + xukka qaytish
  { id: 's_make',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, //  9 tenglama tuzish x3
  { id: 's_ans',    type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 10 yechish va javob berish x4
  { id: 's_bins',   type: 'test',        template: 'Classify',      scored: true,  scope: 'practice' }, // 11 savatlar: tenglama shartga mosmi
  { id: 's_error',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_task',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 13 MASALA: konsert
  { id: 's_final',  type: 'test',        template: 'FinalPanel',    scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',      type: 'summary',     template: 'SummaryScreen', scored: false, scope: null },       // 15 xulosa
];

registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

const CONTENT = {
  s_hook: {
    eyebrow: { ru: 'Зачем это нужно', uz: 'Bu nimaga kerak', en: 'Why you need this' },
    title: { ru: 'Билеты на концерт', uz: 'Konsertga chiptalar', en: 'Concert tickets' },
    lead: {
      ru: 'Продали 40 билетов. Взрослых на 8 больше, чем детских.',
      uz: "40 ta chipta sotildi. Kattalarniki bolalarnikidan 8 ta ko'p.",
      en: '40 tickets were sold. There were 8 more adult tickets than child tickets.',
    },
    voice_a: { ru: 'Азиз: детских билетов 24.', uz: 'Aziz: bolalar chiptasi 24 ta.', en: 'Aziz: 24 child tickets.' },
    voice_b: { ru: 'Севара: детских 16.', uz: 'Sevara: bolalarniki 16 ta.', en: 'Sevara: 16 child tickets.' },
    ask: { ru: 'Сколько продали детских билетов?', uz: 'Bolalar chiptasidan nechta sotilgan?', en: 'How many child tickets were sold?' },
    options: [
      { ru: '24', uz: '24', en: '24' },
      { ru: '16', uz: '16', en: '16' },
    ],
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: 'Variantlardan birini bosing. Javobni dars davomida tekshiramiz.',
      en: 'Tap one of the options. We will check the answer during the lesson.',
    },
    audio: {
      intro: {
        ru: [
          'Перед школьным концертом в кассе продали сорок билетов. Взрослых оказалось на восемь больше, чем детских.',
          'Азиз говорит, что детских билетов двадцать четыре, Севара что шестнадцать. Сколько продали детских билетов? Выбери ответ. Проверим его по ходу урока.',
        ],
        uz: [
          "Maktab konsertidan oldin kassada qirqta chipta sotildi. Kattalarniki bolalarnikidan sakkiztaga ko'p bo'ldi.",
          "Aziz bolalar chiptasi yigirma to'rtta deydi, Sevara esa o'n oltita deydi. Bolalar chiptasidan nechta sotilgan? Javobni tanlang. Uni dars davomida tekshiramiz.",
        ],
        en: [
          'Before the school concert forty tickets were sold at the box office. There were eight more adult tickets than child ones.',
          'Aziz says there were twenty four child tickets, Sevara says sixteen. How many child tickets were sold? Choose an answer. We will check it during the lesson.',
        ],
      },
    },
  },

  s_recall: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslaymiz', en: 'Recall' },
    title: { ru: 'Решать уравнение мы умеем', uz: 'Tenglamani yechishni bilamiz', en: 'We can already solve equations' },
    done: {
      ru: 'Само решение уже знакомо. Трудность в другом: превратить текст задачи в такую запись.',
      uz: "Yechishning o'zi tanish. Qiyinchilik boshqada: masala matnini shunday yozuvga aylantirish.",
      en: 'The solving part is familiar. The hard part is turning the text of a problem into such a line.',
    },
    audio: {
      ru: [
        'Вспомним прошлый урок. Уравнение два икс плюс восемь равно сорока решается в два шага.',
        'Сначала снимаем восемь с обеих частей: два икс равно тридцати двум. Потом делим обе части на два: икс равен шестнадцати.',
        'Само решение мы уже умеем. Сегодня трудность в другом: превратить текст задачи вот в такую запись.',
      ],
      uz: [
        "O'tgan darsni eslaymiz. Ikki iks qo'shuv sakkiz qirqqa teng tenglamasi ikki qadamda yechiladi.",
        "Avval ikkala tomondan sakkizni olamiz: ikki iks o'ttiz ikkiga teng. Keyin ikkala tomonni ikkiga bo'lamiz: iks o'n oltiga teng.",
        "Yechishning o'zini biz allaqachon bilamiz. Bugungi qiyinchilik boshqada: masala matnini mana shunday yozuvga aylantirish.",
      ],
      en: [
        'Recall the last lesson. The equation two x plus eight equals forty is solved in two steps.',
        'Take eight off both sides: two x equals thirty two. Divide both sides by two: x equals sixteen.',
        'The solving part we can already do. Today the hard part is turning the text of a problem into exactly such a line.',
      ],
    },
  },

  s_core: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Что обозначить буквой', uz: 'Nimani harf bilan belgilash', en: 'What the letter should stand for' },
    lines: [
      { ru: 'детских билетов — x', uz: 'bolalar chiptasi — x', en: 'child tickets: x' },
      { ru: 'взрослых на 8 больше — x + 8', uz: "kattalarniki 8 ta ko'p — x + 8", en: 'adults, 8 more: x + 8' },
      { ru: 'всего 40: x + (x + 8) = 40', uz: 'jami 40: x + (x + 8) = 40', en: 'forty in all: x + (x + 8) = 40' },
    ],
    done: {
      ru: 'Буквой обозначают меньшую величину — тогда вторая выражается через неё прибавлением. Уравнение даёт x = 16: столько детских билетов. Права была Севара.',
      uz: "Harf bilan kichik kattalik belgilanadi — shunda ikkinchisi u orqali qo'shish bilan ifodalanadi. Tenglama x = 16 ni beradi: bolalar chiptasi shuncha. Sevara haq edi.",
      en: 'Let the letter stand for the smaller quantity: then the other is written by adding to it. The equation gives x = 16 child tickets. Sevara was right.',
    },
    audio: {
      ru: [
        'Неизвестных как будто два, но обозначить буквой достаточно одно. Возьмём то, которого меньше: пусть детских билетов икс.',
        'Тогда взрослых на восемь больше, то есть икс плюс восемь. Всего продали сорок, значит икс плюс скобка икс плюс восемь равно сорока.',
        'Приведём подобные: два икс плюс восемь равно сорока. Отсюда икс равен шестнадцати. Детских билетов шестнадцать, взрослых двадцать четыре. Азиз посчитал верно, но назвал число взрослых. Права была Севара.',
      ],
      uz: [
        "Noma'lum ikkitadek ko'rinadi, lekin harf bilan bittasini belgilash yetarli. Kamrog'ini olamiz: bolalar chiptasi iks bo'lsin.",
        "Unda kattalarniki sakkiztaga ko'p, ya'ni iks qo'shuv sakkiz. Jami qirqta sotilgan, demak iks qo'shuv qavs iks qo'shuv sakkiz qirqqa teng.",
        "O'xshashlarni ixchamlaymiz: ikki iks qo'shuv sakkiz qirqqa teng. Bundan iks o'n oltiga teng. Bolalar chiptasi o'n oltita, kattalarniki yigirma to'rtta. Aziz to'g'ri hisoblagan, lekin kattalar sonini aytgan. Sevara haq edi.",
      ],
      en: [
        'There seem to be two unknowns, but one letter is enough. Take the smaller one: let the child tickets be x.',
        'Then the adult tickets are eight more, that is x plus eight. Forty were sold in all, so x plus bracket x plus eight equals forty.',
        'Collect like terms: two x plus eight equals forty. So x equals sixteen. Sixteen child tickets and twenty four adult ones. Aziz computed correctly but named the adult number. Sevara was right.',
      ],
    },
  },

  s_tool: {
    eyebrow: { ru: 'Смотри и повтори', uz: 'Qarang va takrorlang', en: 'Watch, then try' },
    title: { ru: 'От условия к уравнению', uz: 'Shartdan tenglamaga', en: 'From the text to the equation' },
    demo_banner: { ru: 'Смотри — покажу на примере', uz: "Qarang — misolda ko'rsataman", en: 'Watch — I will show an example' },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    demo_task: {
      ru: 'В двух коробках 30 карандашей, во второй в 2 раза больше.',
      uz: "Ikki qutida 30 ta qalam bor, ikkinchisida 2 marta ko'p.",
      en: 'Two boxes hold 30 pencils, the second has 2 times more.',
    },
    demo_lines: [
      { ru: 'в первой коробке — x', uz: 'birinchi qutida — x', en: 'the first box: x' },
      { ru: 'во второй в 2 раза больше — 2x', uz: "ikkinchisida 2 marta ko'p — 2x", en: 'the second, 2 times more: 2x' },
      { ru: 'вместе 30: x + 2x = 30, x = 10', uz: 'birga 30: x + 2x = 30, x = 10', en: 'together 30: x + 2x = 30, x = 10' },
    ],
    demo_note: {
      ru: 'Букву дают меньшей величине, остальное выражают через неё. Слово «вместе» подсказывает, что части складывают.',
      uz: "Harf kichik kattalikka beriladi, qolgani u orqali ifodalanadi. «Birga» so'zi qismlar qo'shilishini aytadi.",
      en: 'Give the letter to the smaller quantity and write the rest through it. The word “together” tells you the parts add up.',
    },
    play_ask: {
      ru: 'В саду 24 дерева, яблонь на 6 больше, чем груш. Пусть груш x. Какое уравнение верно?',
      uz: "Bog'da 24 ta daraxt bor, olma nokdan 6 ta ko'p. Nok x bo'lsin. Qaysi tenglama to'g'ri?",
      en: 'A garden has 24 trees, 6 more apple trees than pears. Let pears be x. Which equation fits?',
    },
    play_opts: ['x + (x + 6) = 24', 'x + 6 = 24', '2x = 24'],
    play_correct: 0,
    play_ok: {
      ru: 'Верно. Груши x, яблони x + 6, вместе 24.',
      uz: "To'g'ri. Nok x, olma x + 6, birga 24.",
      en: 'Right. Pears x, apples x + 6, together 24.',
    },
    play_wrong: [
      null,
      { ru: 'Так записаны только яблони, а деревьев всего 24.', uz: 'Bunda faqat olma yozilgan, daraxtlar esa jami 24 ta.', en: 'That counts only the apples, but there are 24 trees in all.' },
      { ru: 'Так было бы, если бы яблонь и груш поровну.', uz: "Olma va nok teng bo'lganda shunday bo'lardi.", en: 'That would hold if apples and pears were equal.' },
    ],
    audio: {
      intro: {
        ru: 'Покажу разбор на примере. В двух коробках тридцать карандашей, во второй в два раза больше.',
        uz: "Tahlilni misolda ko'rsataman. Ikki qutida o'ttiz qalam bor, ikkinchisida ikki marta ko'p.",
        en: 'I will show the reasoning on an example. Two boxes hold thirty pencils and the second has twice as many.',
      },
      demo: {
        ru: 'Букву даём меньшей величине: в первой коробке икс карандашей. Во второй в два раза больше, то есть два икс. Вместе тридцать, значит икс плюс два икс равно тридцати. Приводим подобные: три икс равно тридцати, икс равен десяти.',
        uz: "Harfni kichik kattalikka beramiz: birinchi qutida iks qalam. Ikkinchisida ikki marta ko'p, ya'ni ikki iks. Birga o'ttiz, demak iks qo'shuv ikki iks o'ttizga teng. O'xshashlarni ixchamlaymiz: uch iks o'ttizga teng, iks o'nga teng.",
        en: 'Give the letter to the smaller one: the first box holds x pencils. The second has twice as many, that is two x. Together thirty, so x plus two x equals thirty. Collect like terms: three x equals thirty, x equals ten.',
      },
      play: {
        ru: 'Теперь ваша очередь. В саду двадцать четыре дерева, яблонь на шесть больше, чем груш. Груш пусть будет икс. Какое уравнение верно?',
        uz: "Endi sizning navbatingiz. Bog'da yigirma to'rtta daraxt bor, olma nokdan oltita ko'p. Nok iks bo'lsin. Qaysi tenglama to'g'ri?",
        en: 'Now it is your turn. A garden has twenty four trees, six more apple trees than pears. Let the pears be x. Which equation fits?',
      },
      ok: {
        ru: 'Верно. Груши икс, яблони икс плюс шесть, вместе двадцать четыре.',
        uz: "To'g'ri. Nok iks, olma iks qo'shuv olti, birga yigirma to'rt.",
        en: 'Right. Pears x, apples x plus six, together twenty four.',
      },
      wrong: {
        ru: 'В левой части должны стоять обе группы деревьев, ведь всего их двадцать четыре.',
        uz: "Chap tomonda ikkala daraxt guruhi turishi kerak, axir ular jami yigirma to'rtta.",
        en: 'Both groups of trees belong on the left, since twenty four is the total.',
      },
    },
  },

  s_back: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Корень — ещё не ответ', uz: 'Ildiz hali javob emas', en: 'The root is not the answer yet' },
    lines: [
      { ru: 'x = 16 — это детские билеты', uz: 'x = 16 — bu bolalar chiptasi', en: 'x = 16 is the child tickets' },
      { ru: 'взрослых: 16 + 8 = 24', uz: 'kattalarniki: 16 + 8 = 24', en: 'adults: 16 + 8 = 24' },
      { ru: 'проверка: 16 + 24 = 40', uz: 'tekshiruv: 16 + 24 = 40', en: 'check: 16 + 24 = 40' },
    ],
    done: {
      ru: 'Найдя корень, возвращаются к вопросу задачи: спрашивали могли и не про x. И проверяют по смыслу: билетов не бывает дробное число.',
      uz: "Ildizni topgach, masala savoliga qaytiladi: so'ralgani x bo'lmasligi ham mumkin. Va mazmunan tekshiriladi: chipta kasr son bo'lmaydi.",
      en: 'Once you have the root, go back to the question: it may not have asked about x. Then check it makes sense: tickets are never fractional.',
    },
    audio: {
      ru: [
        'Икс равен шестнадцати. Но остановиться здесь нельзя: надо посмотреть, о чём спрашивали.',
        'Спрашивали про детские билеты, а икс это как раз они. Значит ответ шестнадцать. Если бы спросили про взрослых, пришлось бы прибавить восемь и получить двадцать четыре.',
        'И последний шаг: проверка по смыслу. Шестнадцать и двадцать четыре дают сорок, разница восемь, оба числа целые и положительные. Задача решена.',
      ],
      uz: [
        "Iks o'n oltiga teng. Ammo shu yerda to'xtab bo'lmaydi: nima so'ralganiga qarash kerak.",
        "Bolalar chiptasi so'ralgan, iks esa aynan o'sha. Demak javob o'n olti. Kattalar so'ralganda sakkizni qo'shib, yigirma to'rt olish kerak bo'lardi.",
        "Va oxirgi qadam: mazmunan tekshirish. O'n olti va yigirma to'rt qirqni beradi, farqi sakkiz, ikkala son ham butun va musbat. Masala yechildi.",
      ],
      en: [
        'x equals sixteen. But we cannot stop here: look at what was asked.',
        'The question was about child tickets, and x is exactly those. So the answer is sixteen. Had it asked about adults, we would add eight and get twenty four.',
        'And the last step: a sense check. Sixteen and twenty four make forty, the difference is eight, and both numbers are whole and positive. The problem is solved.',
      ],
    },
  },

  s_solve: {
    eyebrow: { ru: 'Решаем вместе', uz: 'Birga yechamiz', en: 'Solving together' },
    title: { ru: 'Два класса на линейке', uz: 'Saf tortgan ikki sinf', en: 'Two classes in line' },
    lead: { ru: 'В двух классах 54 ученика, в 6А на 6 больше. Сколько в 6А?', uz: "Ikki sinfda 54 o'quvchi bor, 6A da 6 ta ko'p. 6A da nechta?", en: 'Two classes have 54 students, 6A has 6 more. How many in 6A?' },
    steps: [
      { ru: 'в 6Б — x, в 6А — x + 6', uz: '6B da — x, 6A da — x + 6', en: '6B: x, 6A: x + 6' },
      { ru: 'x + (x + 6) = 54, значит x = 24', uz: 'x + (x + 6) = 54, demak x = 24', en: 'x + (x + 6) = 54, so x = 24' },
      { ru: 'спрашивали про 6А: 24 + 6 = 30', uz: "so'ralgani 6A: 24 + 6 = 30", en: 'the question was about 6A: 24 + 6 = 30' },
    ],
    done: {
      ru: 'Корень 24 — это шестой Б. Вопрос был про шестой А, поэтому в ответе 30. Проверка: 24 + 30 = 54 и разница 6.',
      uz: "24 ildizi bu 6B. Savol 6A haqida edi, shuning uchun javob 30. Tekshiruv: 24 + 30 = 54, farqi 6.",
      en: 'The root 24 is class 6B. The question was about 6A, so the answer is 30. Check: 24 + 30 = 54 with a difference of 6.',
    },
    audio: {
      ru: [
        'Решаем вместе. В двух классах пятьдесят четыре ученика, в шестом А на шесть больше, чем в шестом Б. Спрашивают, сколько учеников в шестом А.',
        'Букву даём меньшему классу: в шестом Б икс учеников, в шестом А икс плюс шесть. Вместе пятьдесят четыре: два икс плюс шесть равно пятидесяти четырём, значит икс равен двадцати четырём.',
        'Но двадцать четыре это шестой Б, а спрашивали про шестой А. Прибавляем шесть и получаем тридцать. Проверим: двадцать четыре и тридцать дают пятьдесят четыре, разница шесть. Всё сходится.',
      ],
      uz: [
        "Birga yechamiz. Ikki sinfda ellik to'rt o'quvchi bor, 6A da 6B ga qaraganda oltita ko'p. 6A da nechta o'quvchi borligi so'ralmoqda.",
        "Harfni kichik sinfga beramiz: 6B da iks o'quvchi, 6A da iks qo'shuv olti. Birga ellik to'rt: ikki iks qo'shuv olti ellik to'rtga teng, demak iks yigirma to'rtga teng.",
        "Lekin yigirma to'rt bu 6B, so'ralgani esa 6A. Oltini qo'shib o'ttiz olamiz. Tekshiramiz: yigirma to'rt va o'ttiz ellik to'rtni beradi, farqi olti. Hammasi to'g'ri keldi.",
      ],
      en: [
        'Let us solve it together. Two classes have fifty four students, and 6A has six more than 6B. The question is how many are in 6A.',
        'Give the letter to the smaller class: 6B has x students, 6A has x plus six. Together fifty four: two x plus six equals fifty four, so x equals twenty four.',
        'But twenty four is 6B while the question was about 6A. Add six and get thirty. Check: twenty four and thirty make fifty four with a difference of six. It all fits.',
      ],
    },
  },

  s_edge: {
    eyebrow: { ru: 'Где ошибаются', uz: 'Qayerda xato qilishadi', en: 'Where mistakes happen' },
    title: { ru: 'Ответили не на тот вопрос', uz: 'Boshqa savolga javob berildi', en: 'Answering the wrong question' },
    bad_line: { ru: 'ошибка: нашли x = 16 и написали в ответ 24', uz: 'xato: x = 16 topilgan, javobga 24 yozilgan', en: 'mistake: found x = 16 but wrote 24' },
    good_line: { ru: 'верно: спрашивали про детские, значит 16', uz: "to'g'ri: bolalarniki so'ralgan, demak 16", en: 'right: the question was about children, so 16' },
    warn_line: { ru: 'ошибка: взрослых обозначили x, тогда x + 8 = 48 лишнее', uz: "xato: kattalar x deb olingan, unda x + 8 = 48 ortiqcha", en: 'mistake: letting x be the adults leads nowhere' },
    done: {
      ru: 'Букву дают той величине, через которую легко выразить остальные. А в конце возвращаются к вопросу задачи и проверяют ответ по смыслу.',
      uz: "Harf boshqalarni oson ifodalash mumkin bo'lgan kattalikka beriladi. Oxirida esa masala savoliga qaytiladi va javob mazmunan tekshiriladi.",
      en: 'Give the letter to the quantity that makes the others easy to write. At the end return to the question and check the answer makes sense.',
    },
    audio: {
      ru: [
        'Главная ошибка этого урока не в вычислениях. Уравнение решено верно, икс равен шестнадцати, но в ответ пишут двадцать четыре.',
        'Так и ошибся Азиз: он нашёл число взрослых билетов, хотя спрашивали про детские. Всегда возвращайтесь к вопросу задачи.',
        'Вторая ошибка мягче. Буквой можно обозначить и большую величину, но тогда вторая выражается вычитанием, и запутаться легче. Проще давать букву меньшей.',
      ],
      uz: [
        "Bu darsning asosiy xatosi hisobda emas. Tenglama to'g'ri yechilgan, iks o'n oltiga teng, javobga esa yigirma to'rt yoziladi.",
        "Aziz shunday xato qildi: u kattalar chiptasi sonini topdi, so'ralgani esa bolalarniki edi. Doim masala savoliga qayting.",
        "Ikkinchi xato yumshoqroq. Harf bilan katta kattalikni ham belgilash mumkin, lekin unda ikkinchisi ayirish bilan ifodalanadi va chalkashish osonroq. Harfni kichigiga berish qulay.",
      ],
      en: [
        'The main mistake here is not in the arithmetic. The equation is solved correctly, x equals sixteen, yet twenty four gets written as the answer.',
        'That is Aziz’s error: he found the adult count while the question asked about children. Always return to the question.',
        'The second mistake is milder. The letter may stand for the larger quantity, but then the other is written by subtracting and confusion comes easier. Give the letter to the smaller one.',
      ],
    },
  },

  s_rule: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    title: { ru: 'План решения задачи', uz: 'Masala yechish rejasi', en: 'The plan for a word problem' },
    rule_1: {
      ru: 'Обозначь буквой одну величину, лучше меньшую. Вырази через неё остальные. Составь уравнение из условия и реши его.',
      uz: "Bitta kattalikni, yaxshisi kichigini, harf bilan belgilang. Qolganlarini u orqali ifodalang. Shartdan tenglama tuzing va uni yeching.",
      en: 'Let a letter stand for one quantity, preferably the smaller. Write the others through it. Build the equation from the text and solve it.',
    },
    rule_2: {
      ru: 'Найдя корень, вернись к вопросу задачи и проверь ответ по смыслу. Концерт: детских билетов 16, взрослых 24. Права была Севара.',
      uz: "Ildizni topgach, masala savoliga qayting va javobni mazmunan tekshiring. Konsert: bolalar chiptasi 16 ta, kattalarniki 24 ta. Sevara haq edi.",
      en: 'With the root in hand, return to the question and check the answer makes sense. The concert: 16 child tickets and 24 adult ones. Sevara was right.',
    },
    audio: {
      ru: 'Запомним план. Первое: обозначить буквой одну величину, удобнее меньшую. Второе: выразить через неё остальные. Третье: составить уравнение по условию. Четвёртое: решить его. Пятое, и о нём чаще всего забывают: вернуться к вопросу задачи и проверить ответ по смыслу. Вернёмся к концерту. Детских билетов шестнадцать, взрослых двадцать четыре. Права была Севара.',
      uz: "Rejani eslab qolamiz. Birinchi: bitta kattalikni, qulayrog'i kichigini, harf bilan belgilash. Ikkinchi: qolganlarini u orqali ifodalash. Uchinchi: shart bo'yicha tenglama tuzish. To'rtinchi: uni yechish. Beshinchi va ko'pincha unutiladigani: masala savoliga qaytish va javobni mazmunan tekshirish. Konsertga qaytamiz. Bolalar chiptasi o'n oltita, kattalarniki yigirma to'rtta. Sevara haq edi.",
      en: 'Let us remember the plan. First: let a letter stand for one quantity, preferably the smaller. Second: write the others through it. Third: build the equation from the text. Fourth: solve it. Fifth, the step most often forgotten: return to the question and check the answer makes sense. Back to the concert. Sixteen child tickets and twenty four adult ones. Sevara was right.',
    },
  },

  s_make: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Составь уравнение', uz: 'Tenglama tuzing', en: 'Build the equation' },
    lead: { ru: 'Решать пока не нужно: только запиши.', uz: 'Hozircha yechish shart emas: faqat yozing.', en: 'No solving yet: just write it down.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'В двух корзинах 50 яблок, во второй на 10 больше. Первая — x.', uz: "Ikki savatda 50 ta olma bor, ikkinchisida 10 ta ko'p. Birinchisi — x.", en: 'Two baskets hold 50 apples, the second has 10 more. The first is x.' },
        opts: ['x + (x + 10) = 50', 'x + 10 = 50', 'x − 10 = 50'],
        correct: 0,
        ok: { ru: 'Верно. Обе корзины вместе дают 50.', uz: "To'g'ri. Ikkala savat birga 50 ni beradi.", en: 'Right. Both baskets together make 50.' },
        wrong: [
          null,
          { ru: 'Так записана только вторая корзина.', uz: 'Bunda faqat ikkinchi savat yozilgan.', en: 'That is only the second basket.' },
          { ru: 'Во второй больше, значит прибавляют.', uz: "Ikkinchisida ko'p, demak qo'shiladi.", en: 'The second has more, so we add.' },
        ],
      },
      {
        q: { ru: 'Ручка дешевле тетради на 500 сум, вместе 4500. Ручка — x.', uz: "Ruchka daftardan 500 so'm arzon, birga 4500. Ruchka — x.", en: 'A pen is 500 cheaper than a notebook, together 4500. The pen is x.' },
        opts: ['x + (x + 500) = 4500', 'x + 500 = 4500', 'x + (x − 500) = 4500'],
        correct: 0,
        ok: { ru: 'Верно. Тетрадь дороже, значит x + 500.', uz: "To'g'ri. Daftar qimmatroq, demak x + 500.", en: 'Right. The notebook costs more, so x + 500.' },
        wrong: [
          null,
          { ru: 'Так записана только тетрадь.', uz: 'Bunda faqat daftar yozilgan.', en: 'That is only the notebook.' },
          { ru: 'Ручка дешевле, значит тетрадь дороже на 500.', uz: "Ruchka arzon, demak daftar 500 ga qimmat.", en: 'The pen is cheaper, so the notebook is 500 more.' },
        ],
      },
      {
        q: { ru: 'Во второй коробке в 3 раза больше мячей, всего 24. Первая — x.', uz: "Ikkinchi qutida 3 marta ko'p to'p bor, jami 24 ta. Birinchisi — x.", en: 'The second box has 3 times more balls, 24 in all. The first is x.' },
        opts: ['x + 3x = 24', 'x + 3 = 24', '3x = 24'],
        correct: 0,
        ok: { ru: 'Верно. «В 3 раза больше» — это 3x.', uz: "To'g'ri. «3 marta ko'p» bu 3x.", en: 'Right. “Three times more” means 3x.' },
        wrong: [
          null,
          { ru: '«В 3 раза» — это умножение, а не прибавление.', uz: "«3 marta» bu ko'paytirish, qo'shish emas.", en: '“Three times” means multiplying, not adding.' },
          { ru: 'Так записана только вторая коробка.', uz: 'Bunda faqat ikkinchi quti yozilgan.', en: 'That is only the second box.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на составление. Смотрите, что сказано про вторую величину: на сколько больше или во сколько раз.',
        uz: "Tuzish mashqi. Ikkinchi kattalik haqida nima deyilganiga qarang: nechaga ko'p yoki necha marta ko'p.",
        en: 'Practice on building equations. Look at what is said about the second quantity: how much more, or how many times.',
      },
    },
  },

  s_ans: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Реши и ответь на вопрос', uz: 'Yeching va savolga javob bering', en: 'Solve and answer the question' },
    lead: { ru: 'Найди корень, потом посмотри, о чём спрашивали.', uz: "Ildizni toping, keyin nima so'ralganiga qarang.", en: 'Find the root, then check what was asked.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'В двух коробках 24 мяча, во второй в 3 раза больше. Сколько во второй?', uz: "Ikki qutida 24 ta to'p bor, ikkinchisida 3 marta ko'p. Ikkinchisida nechta?", en: 'Two boxes hold 24 balls, the second has 3 times more. How many in the second?' },
        opts: ['18', '6', '24'],
        correct: 0,
        ok: { ru: 'Верно. x = 6 — первая, вторая 3 · 6 = 18.', uz: "To'g'ri. x = 6 — birinchisi, ikkinchisi 3 · 6 = 18.", en: 'Right. x = 6 is the first, the second is 3 · 6 = 18.' },
        wrong: [
          null,
          { ru: 'Это первая коробка, а спрашивали про вторую.', uz: "Bu birinchi quti, so'ralgani esa ikkinchisi.", en: 'That is the first box, but the second was asked.' },
          { ru: 'Это всего мячей, а не во второй коробке.', uz: "Bu jami to'plar, ikkinchi qutidagilar emas.", en: 'That is the total, not the second box.' },
        ],
      },
      {
        q: { ru: 'Груш и яблок 30, яблонь на 4 больше. Сколько груш?', uz: "Nok va olma 30 ta, olma 4 ta ko'p. Nok nechta?", en: '30 pears and apples, 4 more apples. How many pears?' },
        opts: ['13', '17', '15'],
        correct: 0,
        ok: { ru: 'Верно. 2x + 4 = 30, значит x = 13.', uz: "To'g'ri. 2x + 4 = 30, demak x = 13.", en: 'Right. 2x + 4 = 30, so x = 13.' },
        wrong: [
          null,
          { ru: 'Это число яблок, а спрашивали про груши.', uz: "Bu olma soni, so'ralgani esa nok.", en: 'That is the apples, but pears were asked.' },
          { ru: 'Так было бы, если бы их было поровну.', uz: "Ular teng bo'lganda shunday bo'lardi.", en: 'That would hold if they were equal.' },
        ],
      },
      {
        q: { ru: 'Ручка и тетрадь стоят 4500, ручка дешевле на 500. Сколько стоит тетрадь?', uz: "Ruchka va daftar 4500 turadi, ruchka 500 ga arzon. Daftar qancha turadi?", en: 'A pen and a notebook cost 4500, the pen is 500 less. What does the notebook cost?' },
        opts: [
          { ru: '2500 сум', uz: "2500 so'm", en: '2500 soums' },
          { ru: '2000 сум', uz: "2000 so'm", en: '2000 soums' },
          { ru: '4000 сум', uz: "4000 so'm", en: '4000 soums' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Ручка 2000, тетрадь 2500.', uz: "To'g'ri. Ruchka 2000, daftar 2500.", en: 'Right. The pen is 2000, the notebook 2500.' },
        wrong: [
          null,
          { ru: 'Это цена ручки, а спрашивали про тетрадь.', uz: "Bu ruchka narxi, so'ralgani esa daftar.", en: 'That is the pen, but the notebook was asked.' },
          { ru: 'Проверь: 4000 и 3500 дают 7500, а нужно 4500.', uz: 'Tekshiring: 4000 va 3500 7500 ni beradi, kerakli 4500 esa.', en: 'Check: 4000 and 3500 make 7500, but 4500 is needed.' },
        ],
      },
      {
        q: { ru: 'Какой шаг чаще всего пропускают?', uz: "Qaysi qadam ko'pincha tashlab ketiladi?", en: 'Which step is most often skipped?' },
        opts: [
          { ru: 'возврат к вопросу задачи', uz: 'masala savoliga qaytish', en: 'returning to the question' },
          { ru: 'решение уравнения', uz: 'tenglamani yechish', en: 'solving the equation' },
          { ru: 'выбор буквы', uz: 'harfni tanlash', en: 'choosing the letter' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Корень часто не совпадает с ответом.', uz: "To'g'ri. Ildiz ko'pincha javob bilan mos kelmaydi.", en: 'Right. The root often is not the answer.' },
        wrong: [
          null,
          { ru: 'Решать уравнение как раз не забывают.', uz: 'Tenglamani yechishni aynan unutishmaydi.', en: 'Solving is the part nobody forgets.' },
          { ru: 'Без буквы задача и не начнётся.', uz: 'Harfsiz masala boshlanmaydi ham.', en: 'Without a letter the work cannot even start.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на полный путь. Решите уравнение и обязательно посмотрите, о чём спрашивали.',
        uz: "To'liq yo'l mashqi. Tenglamani yeching va albatta nima so'ralganiga qarang.",
        en: 'Practice on the whole path. Solve the equation and be sure to check what was asked.',
      },
    },
  },

  s_bins: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Подходит ли уравнение', uz: 'Tenglama mos keladimi', en: 'Does the equation fit' },
    lead: { ru: 'Условие одно: двух чисел вместе 30, второе на 4 больше первого. Первое — x.', uz: "Shart bitta: ikki sonning yig'indisi 30, ikkinchisi birinchisidan 4 ta ko'p. Birinchisi — x.", en: 'One text: two numbers add to 30, the second is 4 more. The first is x.' },
    bin_a: { ru: 'Подходит', uz: 'Mos keladi', en: 'Fits' },
    bin_b: { ru: 'Не подходит', uz: 'Mos kelmaydi', en: 'Does not fit' },
    cards: [
      { label: 'x + (x + 4) = 30', bin: 'a' },
      { label: '2x + 4 = 30', bin: 'a' },
      { label: 'x + x + 4 = 30', bin: 'a' },
      { label: 'x + 4 = 30', bin: 'b' },
      { label: '2x = 30', bin: 'b' },
      { label: 'x − 4 = 30', bin: 'b' },
    ],
    hint: {
      ru: 'В левой части должны стоять оба числа, и второе на 4 больше первого.',
      uz: "Chap tomonda ikkala son turishi kerak, ikkinchisi birinchisidan 4 ta ko'p.",
      en: 'Both numbers belong on the left, and the second is 4 more than the first.',
    },
    correct_text: {
      ru: 'Верно. Первые три записи — одно и то же уравнение, записанное по-разному.',
      uz: "To'g'ri. Dastlabki uchtasi bitta tenglamaning har xil yozuvi.",
      en: 'Right. The first three are the same equation written differently.',
    },
    audio: {
      intro: {
        ru: 'Разложите записи по двум корзинам. Условие одно: двух чисел вместе тридцать, второе на четыре больше первого.',
        uz: "Yozuvlarni ikki savatga ajrating. Shart bitta: ikki sonning yig'indisi o'ttiz, ikkinchisi birinchisidan to'rtta ko'p.",
        en: 'Sort the lines into two baskets. One text: two numbers add to thirty and the second is four more.',
      },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда. Проверь, оба ли числа стоят в левой части.', uz: "Bu yerga emas. Chap tomonda ikkala son bor-yo'qligini tekshiring.", en: 'Not here. Check whether both numbers are on the left.' },
    },
  },

  s_error: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikidek tekshiring.", en: 'Check someone else’s work the way you would check your own.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Азиз: «Билетов 40, взрослых на 8 больше. Уравнение: x + 8 = 40». Проверь.', uz: "Aziz: «Chipta 40 ta, kattalarniki 8 ta ko'p. Tenglama: x + 8 = 40». Tekshiring.", en: 'Aziz: “40 tickets, 8 more adults. Equation: x + 8 = 40.” Check it.' },
        opts: [
          { ru: 'Нет: слева должны быть обе группы, x + (x + 8) = 40', uz: "Yo'q: chapda ikkala guruh turishi kerak, x + (x + 8) = 40", en: 'No: both groups belong on the left, x + (x + 8) = 40' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, будет 2x = 40', uz: "Yo'q, 2x = 40 bo'ladi", en: 'No, it is 2x = 40' },
        ],
        correct: 0,
        ok: { ru: 'Верно. В сорок входят и детские, и взрослые билеты.', uz: "To'g'ri. Qirqqa bolalarniki ham, kattalarniki ham kiradi.", en: 'Right. The forty includes both child and adult tickets.' },
        wrong: [
          null,
          { ru: 'Так посчитаны только взрослые билеты.', uz: 'Bunda faqat kattalar chiptasi hisoblangan.', en: 'That counts only the adult tickets.' },
          { ru: 'Тогда билетов было бы поровну, а разница 8.', uz: "U holda chiptalar teng bo'lardi, farq esa 8.", en: 'That would mean equal numbers, but the difference is 8.' },
        ],
      },
      {
        q: { ru: 'Севара: «x = 13 груш, значит яблонь тоже 13». Проверь.', uz: "Sevara: «x = 13 ta nok, demak olma ham 13 ta». Tekshiring.", en: 'Sevara: “x = 13 pears, so 13 apples too.” Check it.' },
        opts: [
          { ru: 'Нет: яблонь на 4 больше, значит 17', uz: "Yo'q: olma 4 ta ko'p, demak 17 ta", en: 'No: 4 more apples, so 17' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, яблонь 9', uz: "Yo'q, olma 9 ta", en: 'No, 9 apples' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 13 + 17 = 30, разница 4.', uz: "To'g'ri. 13 + 17 = 30, farqi 4.", en: 'Right. 13 + 17 = 30 with a difference of 4.' },
        wrong: [
          null,
          { ru: 'Тогда разницы в 4 не было бы вовсе.', uz: "U holda 4 talik farq umuman bo'lmasdi.", en: 'Then there would be no difference of 4 at all.' },
          { ru: 'Яблонь больше, а не меньше.', uz: "Olma ko'p, kam emas.", en: 'There are more apples, not fewer.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Проверьте чужое решение. Ошибка бывает и в уравнении, и в ответе на вопрос.',
        uz: "Birovning yechimini tekshiring. Xato tenglamada ham, savolga javobda ham bo'ladi.",
        en: 'Check someone else’s work. A mistake can be in the equation and in the final answer.',
      },
    },
  },

  s_task: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    title: { ru: 'Касса перед концертом', uz: 'Konsert oldidan kassa', en: 'The box office' },
    lead: { ru: 'Продали 40 билетов, взрослых на 8 больше детских.', uz: "40 ta chipta sotildi, kattalarniki bolalarnikidan 8 ta ko'p.", en: '40 tickets sold, 8 more adult than child.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Сколько продали взрослых билетов?', uz: 'Kattalar chiptasidan nechta sotilgan?', en: 'How many adult tickets were sold?' },
        opts: ['24', '16', '32'],
        correct: 0,
        ok: { ru: 'Верно. Детских 16, взрослых 16 + 8 = 24.', uz: "To'g'ri. Bolalarniki 16, kattalarniki 16 + 8 = 24.", en: 'Right. 16 child tickets, adults 16 + 8 = 24.' },
        wrong: [
          null,
          { ru: 'Это детские билеты, а спрашивали про взрослые.', uz: "Bu bolalar chiptasi, so'ralgani esa kattalarniki.", en: 'Those are the child tickets, but adults were asked.' },
          { ru: 'Проверь: 32 и 8 дают 40, но разница будет 24.', uz: "Tekshiring: 32 va 8 40 ni beradi, farq esa 24 bo'ladi.", en: 'Check: 32 and 8 make 40, but the difference would be 24.' },
        ],
      },
      {
        q: { ru: 'Детский билет 5000 сум. Сколько собрали за детские?', uz: "Bolalar chiptasi 5000 so'm. Bolalarniki uchun qancha yig'ildi?", en: 'A child ticket costs 5000. How much came from child tickets?' },
        opts: [
          { ru: '80 000 сум', uz: "80 000 so'm", en: '80 000 soums' },
          { ru: '120 000 сум', uz: "120 000 so'm", en: '120 000 soums' },
          { ru: '200 000 сум', uz: "200 000 so'm", en: '200 000 soums' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 16 · 5000 = 80 000 сум.', uz: "To'g'ri. 16 · 5000 = 80 000 so'm.", en: 'Right. 16 · 5000 = 80 000 soums.' },
        wrong: [
          null,
          { ru: 'Это выручка за взрослые билеты.', uz: 'Bu kattalar chiptasidan tushgan pul.', en: 'That is the take from adult tickets.' },
          { ru: 'Это выручка за все 40 билетов по 5000.', uz: "Bu barcha 40 ta chipta 5000 dan bo'lganda.", en: 'That is all 40 tickets at 5000 each.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Задача про кассу. Продали сорок билетов, взрослых на восемь больше детских.',
        uz: "Kassa haqida masala. Qirqta chipta sotildi, kattalarniki bolalarnikidan sakkiztaga ko'p.",
        en: 'A box office problem. Forty tickets were sold, eight more adult than child.',
      },
    },
  },

  s_final: {
    eyebrow: { ru: 'Финал', uz: 'Final', en: 'Final' },
    intro_line: { ru: 'Пять заданий на весь урок.', uz: 'Butun darsga beshta topshiriq.', en: 'Five tasks covering the whole lesson.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        kind: 'num', ans: 14,
        q: { ru: 'Двух чисел вместе 32, второе на 4 больше. Набери меньшее.', uz: "Ikki sonning yig'indisi 32, ikkinchisi 4 ta ko'p. Kichigini tering.", en: 'Two numbers add to 32, the second is 4 more. Type the smaller.' },
        hint: { ru: '2x + 4 = 32, дальше решай как в уроке 34.', uz: "2x + 4 = 32, keyin 34-darsdagidek yeching.", en: '2x + 4 = 32, then solve as in lesson 34.' },
        hint_audio: { ru: 'Составьте уравнение два икс плюс четыре равно тридцати двум и решите его.', uz: "Ikki iks qo'shuv to'rt o'ttiz ikkiga teng tenglamasini tuzing va yeching.", en: 'Build the equation two x plus four equals thirty two and solve it.' },
      },
      {
        kind: 'mc', correctIndex: 2,
        q: { ru: 'В двух ящиках 45 книг, во втором в 2 раза больше. Первый — x. Уравнение?', uz: "Ikki yashikda 45 ta kitob bor, ikkinchisida 2 marta ko'p. Birinchisi — x. Tenglama?", en: 'Two crates hold 45 books, the second twice as many. First is x. Equation?' },
        opts: ['x + 2 = 45', '2x = 45', 'x + 2x = 45', 'x − 2x = 45'],
        wrong: [
          { ru: '«В 2 раза» — умножение, а не прибавление.', uz: "«2 marta» bu ko'paytirish, qo'shish emas.", en: '“Twice” means multiplying, not adding.' },
          { ru: 'Так записан только второй ящик.', uz: 'Bunda faqat ikkinchi yashik yozilgan.', en: 'That is only the second crate.' },
          null,
          { ru: 'Книги складывают, а не вычитают.', uz: "Kitoblar qo'shiladi, ayirilmaydi.", en: 'The books add, they do not subtract.' },
        ],
        correct: { ru: 'Верно. x + 2x = 45, значит x = 15.', uz: "To'g'ri. x + 2x = 45, demak x = 15.", en: 'Right. x + 2x = 45, so x = 15.' },
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'Нашли x = 15 — это первый ящик. Сколько во втором?', uz: 'x = 15 topildi — bu birinchi yashik. Ikkinchisida nechta?', en: 'x = 15 is the first crate. How many in the second?' },
        opts: ['15', '30', '45', '17'],
        wrong: [
          { ru: 'Это первый ящик, а спрашивали про второй.', uz: "Bu birinchi yashik, so'ralgani esa ikkinchisi.", en: 'That is the first crate, but the second was asked.' },
          null,
          { ru: 'Это всего книг в двух ящиках.', uz: 'Bu ikki yashikdagi jami kitoblar.', en: 'That is the total in both crates.' },
          { ru: 'Во втором в 2 раза больше, а не на 2.', uz: "Ikkinchisida 2 marta ko'p, 2 taga emas.", en: 'The second has twice as many, not two more.' },
        ],
        correct: { ru: 'Верно. 2 · 15 = 30, проверка: 15 + 30 = 45.', uz: "To'g'ri. 2 · 15 = 30, tekshiruv: 15 + 30 = 45.", en: 'Right. 2 · 15 = 30, check: 15 + 30 = 45.' },
      },
      {
        kind: 'mc', correctIndex: 3,
        q: { ru: 'Какой шаг идёт последним?', uz: "Qaysi qadam oxirgi bo'ladi?", en: 'Which step comes last?' },
        opts: [
          { ru: 'обозначить букву', uz: 'harfni belgilash', en: 'choosing the letter' },
          { ru: 'составить уравнение', uz: 'tenglama tuzish', en: 'building the equation' },
          { ru: 'решить уравнение', uz: 'tenglamani yechish', en: 'solving the equation' },
          { ru: 'вернуться к вопросу и проверить', uz: 'savolga qaytish va tekshirish', en: 'returning to the question and checking' },
        ],
        wrong: [
          { ru: 'С этого работа начинается.', uz: 'Ish shundan boshlanadi.', en: 'That is where the work starts.' },
          { ru: 'Это второй шаг.', uz: 'Bu ikkinchi qadam.', en: 'That is the second step.' },
          { ru: 'После решения работа ещё не закончена.', uz: 'Yechimdan keyin ish hali tugamaydi.', en: 'The work is not done once it is solved.' },
          null,
        ],
        correct: { ru: 'Верно. Именно этот шаг чаще всего пропускают.', uz: "To'g'ri. Aynan shu qadam ko'pincha tashlab ketiladi.", en: 'Right. That is the step most often skipped.' },
      },
      {
        kind: 'mc', correctIndex: 0,
        q: { ru: 'Билетов 40, взрослых на 8 больше. Сколько детских?', uz: "Chipta 40 ta, kattalarniki 8 ta ko'p. Bolalarniki nechta?", en: '40 tickets, 8 more adult. How many child tickets?' },
        opts: ['16', '24', '20', '32'],
        wrong: [
          null,
          { ru: 'Это взрослые билеты.', uz: 'Bu kattalar chiptasi.', en: 'Those are the adult tickets.' },
          { ru: 'Так было бы, если бы билетов было поровну.', uz: "Chiptalar teng bo'lganda shunday bo'lardi.", en: 'That would hold if the numbers were equal.' },
          { ru: 'Проверь: 32 и 8 дают разницу 24, а нужно 8.', uz: 'Tekshiring: 32 va 8 farqi 24, kerakli 8 esa.', en: 'Check: 32 and 8 differ by 24, but 8 is needed.' },
        ],
        correct: { ru: 'Верно. 2x + 8 = 40, значит x = 16.', uz: "To'g'ri. 2x + 8 = 40, demak x = 16.", en: 'Right. 2x + 8 = 40, so x = 16.' },
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
      ru: 'Самым старым задачам на неизвестное почти четыре тысячи лет. В египетском папирусе Ринда есть задачи про «аха» — так называли неизвестную кучу: «куча и её седьмая часть вместе дают 19». Уравнений тогда ещё не писали, и решали подбором: брали удобное число, смотрели, во сколько раз ошиблись, и во столько же раз поправляли ответ.',
      uz: "Noma'lumga oid eng qadimgi masalalarga deyarli to'rt ming yil bo'lgan. Misr Rind papirusida «axa» haqida masalalar bor — noma'lum uyumni shunday atashgan: «uyum va uning yettidan bir qismi birga 19 ni beradi». U paytda tenglama yozishmagan, tanlash bilan yechishgan: qulay sonni olib, necha marta adashganini ko'rib, javobni shuncha marta to'g'rilashgan.",
      en: 'The oldest problems about an unknown are almost four thousand years old. The Egyptian Rhind papyrus has problems about aha, the unknown heap: “a heap and its seventh together make 19.” Equations were not written yet, so they guessed: take a convenient number, see how many times off it was, and scale the answer by the same factor.',
    },
    fact_audio: {
      ru: 'Знаешь ли ты? Самым старым задачам на неизвестное почти четыре тысячи лет. В египетском папирусе Ринда есть задачи про аха, так называли неизвестную кучу: куча и её седьмая часть вместе дают девятнадцать. Уравнений тогда ещё не писали и решали подбором: брали удобное число, смотрели, во сколько раз ошиблись, и во столько же раз поправляли ответ.',
      uz: "Bilasizmi? Noma'lumga oid eng qadimgi masalalarga deyarli to'rt ming yil bo'lgan. Misr Rind papirusida axa haqida masalalar bor, noma'lum uyumni shunday atashgan: uyum va uning yettidan bir qismi birga o'n to'qqizni beradi. U paytda tenglama yozishmagan va tanlash bilan yechishgan: qulay sonni olib, necha marta adashganini ko'rib, javobni shuncha marta to'g'rilashgan.",
      en: 'Did you know? The oldest problems about an unknown are almost four thousand years old. The Egyptian Rhind papyrus has problems about aha, the unknown heap: a heap and its seventh together make nineteen. Equations were not written yet, so they guessed: take a convenient number, see how many times off it was, and scale the answer by the same factor.',
    },
  },

  s14: {
    eyebrow: { ru: 'Урок пройден', uz: "Dars o'tildi", en: 'Lesson finished' },
    banner: { ru: 'Математика · Уравнения', uz: 'Matematika · Tenglamalar', en: 'Mathematics · Equations' },
    heading: { ru: 'Задачи через уравнение', uz: 'Tenglama orqali masalalar', en: 'Problems through equations' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    brief_1: { ru: 'буква — меньшей величине', uz: 'harf — kichik kattalikka', en: 'the letter goes to the smaller quantity' },
    brief_2: { ru: 'остальное выражают через неё', uz: 'qolgani u orqali ifodalanadi', en: 'the rest is written through it' },
    brief_3: { ru: 'в конце — возврат к вопросу', uz: 'oxirida — savolga qaytish', en: 'at the end, return to the question' },
    memo_title: { ru: 'Что помнить', uz: 'Nimani eslash kerak', en: 'What to remember' },
    memo_q1: { ru: 'Слово «вместе»', uz: "«Birga» so'zi", en: 'The word “together”' },
    memo_a1: { ru: 'значит сложить части', uz: "qismlarni qo'shishni bildiradi", en: 'means adding the parts' },
    memo_q2: { ru: '«В 3 раза больше»', uz: "«3 marta ko'p»", en: '“Three times more”' },
    memo_a2: { ru: 'это 3x, а не x + 3', uz: 'bu 3x, x + 3 emas', en: 'is 3x, not x + 3' },
    memo_q3: { ru: 'Частая ошибка', uz: 'Tez-tez uchraydigan xato', en: 'A common mistake' },
    memo_a3: { ru: 'ответить не на тот вопрос', uz: 'boshqa savolga javob berish', en: 'answering the wrong question' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'Обозначь буквой одну величину, удобнее меньшую. Вырази через неё остальные, составь уравнение по условию и реши его. А потом обязательно вернись к вопросу задачи и проверь ответ по смыслу.',
        'Концерт: детских билетов шестнадцать, взрослых двадцать четыре.',
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "Bitta kattalikni, qulayrog'i kichigini, harf bilan belgilang. Qolganlarini u orqali ifodalang, shart bo'yicha tenglama tuzing va yeching. Keyin albatta masala savoliga qayting va javobni mazmunan tekshiring.",
        "Konsert: bolalar chiptasi o'n oltita, kattalarniki yigirma to'rtta.",
      ],
      en: [
        'The lesson is done. Let us gather the main points.',
        'Let a letter stand for one quantity, preferably the smaller. Write the others through it, build the equation from the text and solve it. Then always return to the question and check the answer makes sense.',
        'The concert: sixteen child tickets and twenty four adult ones.',
      ],
    },
  },

  s_methods: {
    m1_title: { ru: 'Способ. Пять шагов', uz: 'Usul. Besh qadam', en: 'Method. Five steps' },
    m1_steps: {
      ru: ['Обозначь буквой меньшую величину', 'Вырази через неё остальные и составь уравнение', 'Реши, вернись к вопросу и проверь'],
      uz: ['Kichik kattalikni harf bilan belgilang', 'Qolganlarini u orqali ifodalang va tenglama tuzing', 'Yeching, savolga qayting va tekshiring'],
      en: ['Let the letter be the smaller quantity', 'Write the others through it and build the equation', 'Solve, return to the question and check'],
    },
    m1_no: {
      ru: 'Корень уравнения не всегда совпадает с ответом задачи.',
      uz: 'Tenglama ildizi har doim ham masala javobi bilan mos kelmaydi.',
      en: 'The root of the equation is not always the answer to the problem.',
    },
  },
};

// ============================================================
// СЦЕНЫ УРОКА: актовый зал перед концертом, касса с билетами.
// ============================================================
const HookScene = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="d35hall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F4ECE0"/><stop offset="100%" stopColor="#EFE2CE"/>
      </linearGradient>
      <linearGradient id="d35curt" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#C2503A"/><stop offset="100%" stopColor="#A33F2C"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="400" height="154" fill="url(#d35hall)"/>

    {/* Сцена с занавесом */}
    <rect x="112" y="14" width="180" height="76" rx="4" fill="#2A2723"/>
    <path d="M112 14 h44 q-6 40 4 76 h-48 z" fill="url(#d35curt)"/>
    <path d="M292 14 h-44 q6 40 -4 76 h48 z" fill="url(#d35curt)"/>
    <rect x="106" y="10" width="192" height="8" rx="4" fill="#8A3A28"/>
    <g>
      <circle className="d35-spot" cx="202" cy="46" r="16" fill="#F5C77E" opacity="0.55"/>
      <rect x="188" y="58" width="28" height="24" rx="3" fill="#7ECBE6"/>
      <circle cx="202" cy="52" r="7" fill="#F0C9A0"/>
    </g>

    {/* Ряды кресел */}
    {[0, 1].map((r) => (
      <g key={r}>
        {Array.from({ length: 9 }, (_, i) => (
          <rect key={i} x={20 + i * 42} y={100 + r * 18} width="30" height="12" rx="3" fill="#B4A48C" opacity={r ? 0.75 : 1}/>
        ))}
      </g>
    ))}

    {/* Касса: рулон билетов и табличка */}
    <g>
      <rect x="14" y="46" width="76" height="44" rx="5" fill="#FFFDF7" stroke="#C9A472" strokeWidth="2"/>
      <text x="52" y="64" textAnchor="middle" fill="#8A8883"
        fontFamily="'Manrope', system-ui, sans-serif" fontSize="10" fontWeight="700">chipta</text>
      <text x="52" y="82" textAnchor="middle" fill="#D9603F"
        fontFamily="'JetBrains Mono', monospace" fontSize="19" fontWeight="700">40</text>
    </g>
    <g className="d35-ticket">
      <rect x="-18" y="-10" width="36" height="20" rx="3" fill="#FBF3D6" stroke="#E4CE93" strokeWidth="1.6"/>
      <path d="M-6 -10 v20" stroke="#E4CE93" strokeWidth="1.4" strokeDasharray="3 3"/>
      <circle cx="8" cy="0" r="3" fill="#D9603F"/>
    </g>

    {/* Двое у кассы */}
    <Person x={330} ground={132} head={13} shirt="#7ECBE6" hair="#3E3128"/>
    <Person x={364} ground={132} head={13} shirt="#8FBF7F" hair="#5A4636"/>
    <rect x="0" y="140" width="400" height="14" fill="#D2A96F"/>
  </svg>
);

// Итог: план из пяти шагов, последний подсвечен.
const FinalScene = () => {
  const lang = useLang();
  // Узбекская сторона — на siz: голая основа (belgila, tuz, yech) читается как
  // обращение на «сен». Русская остаётся на «ты» по решению методиста.
  const steps = [
    tri(lang, 'обозначь', 'belgilang', 'name it'),
    tri(lang, 'вырази', 'ifodalang', 'express'),
    tri(lang, 'составь', 'tuzing', 'build'),
    tri(lang, 'реши', 'yeching', 'solve'),
    tri(lang, 'вернись', 'qayting', 'return'),
  ];
  return (
    <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
      <rect x="0" y="0" width="400" height="92" fill="#F9F4EB"/>
      {steps.map((s, i) => (
        <g key={i} transform={`translate(${12 + i * 76}, 22)`}>
          <rect x="0" y="0" width="66" height="34" rx="8"
            fill={i === 4 ? '#E3F0E8' : '#F4F1EA'} stroke={i === 4 ? '#1F7A4D' : '#E9E3D9'} strokeWidth="2"/>
          <text x="33" y="22" textAnchor="middle" fill={i === 4 ? '#1F7A4D' : '#8A8883'}
            fontFamily="'Manrope', system-ui, sans-serif" fontSize="11" fontWeight="700">{s}</text>
        </g>
      ))}
      <text x="200" y="76" textAnchor="middle" fill="#8A8883"
        fontFamily="'Manrope', system-ui, sans-serif" fontSize="11" fontWeight="700">
        {tri(lang, 'последний шаг забывают чаще всего',
          "oxirgi qadam ko'pincha unutiladi",
          'the last step is the one most often skipped')}
      </text>
    </svg>
  );
};

// ============================================================
// БЛОКИ ЭКРАНОВ
// ============================================================
// Прибор урока: две полосы, вторая длиннее на разницу.
const Bars = ({ a, b, aLabel, bLabel, total, diff }) => {
  const unit = 300 / Math.max(a + b, 1);
  const wa = Math.max(a * unit, 26);
  const wb = Math.max(b * unit, 26);
  return (
    <span className="d35-bars-box">
      <svg viewBox="0 0 340 96" aria-hidden="true">
        <rect x="20" y="16" width={wa} height="24" rx="4" fill="#E7F5FA" stroke="#019ACB" strokeWidth="2"/>
        <text x={20 + wa / 2} y="33" textAnchor="middle" fill="#019ACB"
          fontFamily="'JetBrains Mono', monospace" fontSize="13" fontWeight="700">{aLabel}</text>
        <rect x="20" y="48" width={wa} height="24" rx="4" fill="#E7F5FA" stroke="#019ACB" strokeWidth="2"/>
        <text x={20 + wa / 2} y="65" textAnchor="middle" fill="#019ACB"
          fontFamily="'JetBrains Mono', monospace" fontSize="13" fontWeight="700">{aLabel}</text>
        <rect x={20 + wa} y="48" width={wb - wa} height="24" rx="4" fill="#FBF3D6" stroke="#8A6A22" strokeWidth="2"/>
        <text x={20 + wa + (wb - wa) / 2} y="65" textAnchor="middle" fill="#8A6A22"
          fontFamily="'JetBrains Mono', monospace" fontSize="12" fontWeight="700">{diff}</text>
        <text x={26 + wb} y="65" fill="#8A8883"
          fontFamily="'Manrope', system-ui, sans-serif" fontSize="11" fontWeight="700">{bLabel}</text>
        {total && (
          <text x="170" y="90" textAnchor="middle" fill="#1F7A4D"
            fontFamily="'JetBrains Mono', monospace" fontSize="13" fontWeight="700">{total}</text>
        )}
      </svg>
    </span>
  );
};

const Line = ({ node, on }) => (
  <span className={'d35-line d35-fade' + (on ? ' d35-on' : '')}>{mt(node)}</span>
);

const RecallBody = ({ step }) => {
  const t = useT();
  const lang = useLang();
  const c = CONTENT.s_recall;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d35-stage">
        <span className="d35-chain">
          <i>2x + 8 = 40</i>
          <b>→</b>
          <i className={'d35-fade' + (step >= 1 ? ' d35-on' : '')}>2x = 32</i>
          <b className={'d35-fade' + (step >= 1 ? ' d35-on' : '')}>→</b>
          <i className={'d35-hit d35-fade' + (step >= 1 ? ' d35-on' : '')}>x = 16</i>
        </span>
        <span className={'d35-chips d35-fade' + (step >= 2 ? ' d35-on' : '')}>
          <i className="d35-chip-w">{tri(lang, 'а как получить эту запись?', 'bu yozuvni qanday olamiz?', 'but how do we get this line?')}</i>
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

// Ядро: полосы билетов и составление уравнения.
const CoreBody = ({ step }) => {
  const t = useT();
  const lang = useLang();
  const c = CONTENT.s_core;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d35-stage">
        <Bars a={16} b={24} diff="8" total={step >= 1 ? '40' : ''}
          aLabel="x" bLabel={tri(lang, 'взрослые', 'kattalar', 'adults')}/>
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

// Возврат к вопросу задачи.
const BackBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_back;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d35-stage">
        <span className="d35-two">
          <i className="d35-two-box d35-two-on">16</i>
          <em>+</em>
          <i className={'d35-two-box' + (step >= 1 ? ' d35-two-on' : '')}>24</i>
          <em className={'d35-fade' + (step >= 2 ? ' d35-on' : '')}>=</em>
          <i className={'d35-two-box d35-two-sum' + (step >= 2 ? ' d35-two-on' : '')}>40</i>
        </span>
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
  const lang = useLang();
  const c = CONTENT.s_solve;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink3 }}>{mt(t(c.lead))}</p>
      <div className="frame fade-up delay-1 d35-stage">
        <Bars a={24} b={30} diff="6" total={step >= 1 ? '54' : ''}
          aLabel="x" bLabel={tri(lang, '6А', '6A', '6A')}/>
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

// Граница: ответили не на тот вопрос.
const EdgeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_edge;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d35-stage">
        <span className="d35-pair d35-pair-bad"><Line node={t(c.bad_line)} on/></span>
        <span className={'d35-pair d35-pair-good d35-fade' + (step >= 1 ? ' d35-on' : '')}>
          <Line node={t(c.good_line)} on/>
        </span>
        <span className={'d35-pair d35-pair-warn d35-fade' + (step >= 2 ? ' d35-on' : '')}>
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
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div className="rv-col">
        <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
        <div className={'d35-banner fade-up delay-1' + (phase === 'play' ? ' d35-banner-play' : '')}>
          {t(phase === 'demo' ? c.demo_banner : c.play_banner)}
        </div>

        <div className="frame fade-up delay-1 d35-stage d35-stage-tool">
          {phase === 'demo' ? (
            <>
              <p className="small d35-task" style={{ margin: 0 }}>{mt(t(c.demo_task))}</p>
              <Bars a={10} b={20} diff="x" total={shown >= 2 ? '30' : ''} aLabel="x" bLabel="2x"/>
              {c.demo_lines.map((l, i) => <Line key={i} node={t(l)} on={shown >= i}/>)}
              <p className={'body d35-verdict' + (done ? ' d35-verdict-on' : '')}>{done ? t(c.demo_note) : ''}</p>
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
          <div className="d35-acts fade-up">
            <button className="d35-btn" disabled={!done} onClick={() => setShown(0)}>{t(c.again)}</button>
            <button className="d35-btn d35-btn-go" disabled={!done} onClick={toPlay}>{t(c.to_play)}</button>
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
const ScreenBack = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_back} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <BackBody step={step}/>}/>
);
const ScreenSolve = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_solve} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <SolveBody step={step}/>}/>
);
const ScreenEdge = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_edge} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <EdgeBody step={step}/>}/>
);
const ScreenRule = (props) => {
  const lang = useLang();
  return (
    <RuleScreen {...props} screenContent={CONTENT.s_rule} totalScreens={TOTAL_SCREENS}
      exampleNode={(
        <div className="d35-stage">
          <Bars a={16} b={24} diff="8" total="40" aLabel="x"
            bLabel={tri(lang, 'взрослые', 'kattalar', 'adults')}/>
        </div>
      )}/>
  );
};

const methodAside = (
  <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps} note={CONTENT.s_methods.m1_no}/>
);

const ScreenMake = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_make} asideNode={methodAside}/>
);
const ScreenAns = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_ans} asideNode={methodAside}/>
);
const ScreenBins = (props) => (
  <Classify {...props} screenContent={CONTENT.s_bins} totalScreens={TOTAL_SCREENS}/>
);
const ScreenError = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_error}/>
);

// Задача: те же полосы билетов.
const TaskFig = () => {
  const lang = useLang();
  return (
    <div className="d35-task-fig">
      <Bars a={16} b={24} diff="8" total="40" aLabel="16"
        bLabel={tri(lang, 'взрослые', 'kattalar', 'adults')}/>
    </div>
  );
};

const ScreenTask = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_task}
    figureNode={() => <TaskFig/>}/>
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
.d35-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(9px, 1.7vw, 14px); padding: clamp(12px, 2.4vw, 18px) !important; }
.d35-stage-tool { gap: clamp(4px, 0.8vw, 7px) !important; padding: clamp(7px, 1.5vw, 11px) !important; }
.d35-stage-tool .d35-line { font-size: clamp(12px, 2vw, 16px); }
.d35-stage-tool .d35-bars-box { max-width: 46%; }
.d35-stage-tool .d35-task { font-size: clamp(11px, 1.9vw, 14px); }

/* Полосы величин */
.d35-bars-box { display: block; width: 100%; max-width: 320px; }
.d35-bars-box svg { width: 100%; height: auto; display: block; }

.d35-fade { opacity: 0; transition: opacity 420ms linear; }
.d35-on { opacity: 1; }
.d35-line { font-family: 'JetBrains Mono', monospace; font-size: clamp(12px, 2.2vw, 17px); font-weight: 700; color: #494550; text-align: center; }
.d35-task { color: #8A8883; font-weight: 600; text-align: center; }

/* Цепочка решения */
.d35-chain { display: inline-flex; align-items: center; gap: clamp(5px, 1.2vw, 10px); flex-wrap: wrap; justify-content: center; }
.d35-chain i { font-style: normal; padding: 5px 12px; border-radius: 11px; background: #F4F1EA; border: 1px solid #E9E3D9; font-family: 'JetBrains Mono', monospace; font-size: clamp(13px, 2.4vw, 19px); font-weight: 700; color: #494550; }
.d35-chain b { font-family: 'JetBrains Mono', monospace; font-size: clamp(13px, 2.2vw, 17px); color: #8A8883; }
.d35-hit { background: #E3F0E8 !important; border-color: #A9CFBA !important; color: #1F7A4D !important; }

/* Возврат к вопросу */
.d35-two { display: inline-flex; align-items: center; gap: clamp(6px, 1.4vw, 12px); flex-wrap: wrap; justify-content: center; }
.d35-two em { font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: clamp(16px, 3vw, 24px); color: #8A8883; }
.d35-two-box { font-style: normal; padding: 6px 16px; border-radius: 12px; background: #F4F1EA; border: 1px solid #E9E3D9; font-family: 'JetBrains Mono', monospace; font-size: clamp(17px, 3.2vw, 26px); font-weight: 700; color: #8A8883; opacity: 0.45; transition: opacity 420ms linear, color 420ms linear, background-color 420ms linear, border-color 420ms linear; }
.d35-two-on { opacity: 1; color: #019ACB; background: #E7F5FA; border-color: #B6DCEA; }
.d35-two-sum.d35-two-on { color: #1F7A4D; background: #E3F0E8; border-color: #A9CFBA; }

/* Подписи */
.d35-chips { display: inline-flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
.d35-chips i { font-style: normal; padding: 5px 12px; border-radius: 10px; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(12px, 2.1vw, 15px); font-weight: 700; }
.d35-chip-w { background: #FBF3D6; border: 1px solid #E4CE93; color: #8A6A22; }

/* Строки экрана границы */
.d35-pair { width: 100%; padding: clamp(5px, 1.2vw, 9px); border-radius: 12px; text-align: center; }
.d35-pair-bad { background: #FFF1EC; border: 1px solid #F3C4B4; }
.d35-pair-good { background: #E3F0E8; border: 1px solid #A9CFBA; }
.d35-pair-warn { background: #FBF3D6; border: 1px solid #E4CE93; }

/* Задача */
.d35-task-fig { display: flex; justify-content: center; width: 100%; }

/* Экран 4 */
.d35-banner { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; font-size: clamp(13px, 2.2vw, 16px); font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 4px 11px; }
.d35-banner-play { color: #1F7A4D; background: #E3F0E8; }
.d35-verdict { margin: 0; min-height: 0; opacity: 0; transition: opacity 420ms linear; text-align: center; }
.d35-verdict-on { opacity: 1; }
.d35-acts { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.d35-btn { height: 36px; padding: 0 18px; border-radius: 12px; border: 1px solid #E9E3D9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(14px, 2.2vw, 16px); font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.d35-btn:disabled { opacity: 0.45; cursor: default; }
.d35-btn-go { border-color: #FF4F28; color: #FF4F28; }
.d35-btn-go:hover:not(:disabled) { background: #FFE8E1; }

/* Движение сцены: софит дышит, билет качается в руке */
.d35-spot { animation: d35Spot 4200ms ease-in-out infinite; }
@keyframes d35Spot { 0%, 100% { opacity: 0.35; } 50% { opacity: 0.7; } }
.d35-ticket { animation: d35Ticket 3600ms ease-in-out infinite; }
@keyframes d35Ticket { 0%, 100% { transform: translate(340px, 106px) rotate(-7deg); } 50% { transform: translate(340px, 102px) rotate(6deg); } }
@media (prefers-reduced-motion: reduce) { .d35-spot { animation: none; } .d35-ticket { animation: none; transform: translate(340px, 104px); } }
`;

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function EquationWordProblemLesson({
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

  const screens = [ScreenHook, ScreenRecall, ScreenCore, ScreenTool, ScreenBack, ScreenSolve, ScreenEdge,
    ScreenRule, ScreenMake, ScreenAns, ScreenBins, ScreenError, ScreenTask, ScreenFinal, Screen14];
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
