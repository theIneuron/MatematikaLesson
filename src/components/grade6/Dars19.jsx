// ============================================================
// 6 КЛАСС, УРОК 19 «Прямая и обратная пропорциональность»
// Собран по context/GRADE6_ETALON.md на общем слое ./screens.jsx.
//
// Урок закрывает блок Б4. Пропорция из урока 18 работает только там, где
// величины связаны прямо. Здесь появляется второй тип связи, и главный
// навык — различить их ДО того, как записана пропорция.
//
// Сцена — школьный субботник: красят забор.
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
  lessonId: 'grade6-19',
  lessonTitle: {
    ru: 'Прямая и обратная пропорциональность',
    uz: "To'g'ri va teskari proporsional miqdorlar",
    en: 'Direct and inverse proportion',
  },
};

const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',    scored: false, scope: 'hook' },     //  1 hashar: 2 va 4 bo'yoqchi
  { id: 's_recall', type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  2 proporsiya esga tushadi
  { id: 's_core',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  3 ikki jadval: nisbat va ko'paytma
  { id: 's_tool',   type: 'exploration', template: 'custom',        scored: false, scope: null },       //  4 USUL: to'g'ri bog'lanish masalasi
  { id: 's_inv',    type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  5 teskari bog'lanish: ko'paytma doimiy
  { id: 's_solve',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  6 birga yechamiz: ishchilar
  { id: 's_edge',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  7 chegara: har juftlik proporsional emas
  { id: 's_rule',   type: 'rule',        template: 'RuleScreen',    scored: false, scope: null },       //  8 QOIDA + xukka qaytish
  { id: 's_dir',    type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, //  9 to'g'ri bog'lanish x3
  { id: 's_ind',    type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 10 teskari bog'lanish x4
  { id: 's_bins',   type: 'test',        template: 'Classify',      scored: true,  scope: 'practice' }, // 11 savatlar: to'g'ri yoki teskari
  { id: 's_error',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_task',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 13 MASALA: devor bo'yash
  { id: 's_final',  type: 'test',        template: 'FinalPanel',    scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',      type: 'summary',     template: 'SummaryScreen', scored: false, scope: null },       // 15 xulosa
];

registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

const CONTENT = {
  s_hook: {
    eyebrow: { ru: 'Зачем это нужно', uz: 'Bu nimaga kerak', en: 'Why you need this' },
    title: { ru: 'Забор на субботнике', uz: 'Hashardagi devor', en: 'The fence on clean up day' },
    lead: {
      ru: 'Два маляра красят забор за 6 часов. К ним пришли ещё двое, теперь их четверо.',
      uz: "Ikki bo'yoqchi devorni 6 soatda bo'yaydi. Yana ikkitasi keldi, endi ular to'rtta.",
      en: 'Two painters paint a fence in 6 hours. Two more arrive, so now there are four.',
    },
    voice_a: { ru: 'Азиз: значит уйдёт 12 часов.', uz: 'Aziz: demak 12 soat ketadi.', en: 'Aziz: so it will take 12 hours.' },
    voice_b: { ru: 'Дилноза: нет, 3 часа.', uz: "Dilnoza: yo'q, 3 soat.", en: 'Dilnoza: no, 3 hours.' },
    ask: { ru: 'За сколько часов покрасят вчетвером?', uz: "To'rt kishi necha soatda bo'yaydi?", en: 'How long will four painters take?' },
    options: [
      { ru: '12 часов', uz: '12 soat', en: '12 hours' },
      { ru: '3 часа', uz: '3 soat', en: '3 hours' },
    ],
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: 'Variantlardan birini bosing. Javobni dars davomida tekshiramiz.',
      en: 'Tap one of the options. We will check the answer during the lesson.',
    },
    audio: {
      intro: {
        ru: [
          'На субботнике два маляра красят школьный забор за шесть часов. К ним пришли ещё двое, и теперь их четверо.',
          'Азиз говорит, что теперь уйдёт двенадцать часов, а Дилноза что три. За сколько часов покрасят вчетвером? Выбери ответ. Проверим его по ходу урока.',
        ],
        uz: [
          "Hasharda ikki bo'yoqchi maktab devorini olti soatda bo'yaydi. Yana ikkitasi keldi, endi ular to'rtta.",
          "Aziz endi o'n ikki soat ketadi deydi, Dilnoza esa uch soat deydi. To'rt kishi necha soatda bo'yaydi? Javobni tanlang. Uni dars davomida tekshiramiz.",
        ],
        en: [
          'On clean up day two painters paint the school fence in six hours. Two more join them, so now there are four.',
          'Aziz says it will now take twelve hours, Dilnoza says three. How long will four painters take? Choose an answer. We will check it during the lesson.',
        ],
      },
    },
  },

  s_recall: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslaymiz', en: 'Recall' },
    title: { ru: 'Пропорция из прошлого урока', uz: "O'tgan darsdagi proporsiya", en: 'The proportion from last lesson' },
    rows: [
      { a: 2, b: 30 },
      { a: 4, b: 60 },
    ],
    done: {
      ru: 'Банок стало вдвое больше, и площадь выросла вдвое. Отношение 2 : 30 равно 4 : 60 — это пропорция.',
      uz: "Banka ikki barobar ko'paydi, yuza ham ikki barobar oshdi. 2 : 30 nisbati 4 : 60 ga teng — bu proporsiya.",
      en: 'Twice as many tins painted twice the area. The ratio 2 : 30 equals 4 : 60, which is a proportion.',
    },
    audio: {
      ru: [
        'Вспомним прошлый урок. Двумя банками краски покрасили тридцать квадратных метров.',
        'Четырьмя банками покрасят шестьдесят. Банок вдвое больше, площадь вдвое больше.',
        'Отношение сохранилось, и мы записали пропорцию. Но так связаны не все величины, и сегодня мы увидим второй тип связи.',
      ],
      uz: [
        "O'tgan darsni eslaymiz. Ikki banka bo'yoq bilan o'ttiz kvadrat metr bo'yaldi.",
        "To'rt banka bilan oltmish kvadrat metr bo'yaladi. Banka ikki barobar ko'p, yuza ham ikki barobar katta.",
        "Nisbat saqlandi va biz proporsiya yozdik. Lekin hamma kattaliklar ham shunday bog'lanmagan, bugun ikkinchi turdagi bog'lanishni ko'ramiz.",
      ],
      en: [
        'Recall the last lesson. Two tins of paint covered thirty square metres.',
        'Four tins cover sixty. Twice the tins, twice the area.',
        'The ratio held and we wrote a proportion. But not all quantities work that way, and today we meet the second kind of link.',
      ],
    },
  },

  s_core: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Две таблицы рядом', uz: 'Ikki jadval yonma-yon', en: 'Two tables side by side' },
    direct: { title: { ru: 'банки и площадь', uz: 'banka va yuza', en: 'tins and area' }, rows: [[2, 30], [4, 60]] },
    inverse: { title: { ru: 'маляры и время', uz: "bo'yoqchi va vaqt", en: 'painters and time' }, rows: [[2, 6], [4, 3]] },
    lines: [
      { ru: 'слева отношение постоянно: 30 : 2 = 60 : 4 = 15', uz: "chapda nisbat doimiy: 30 : 2 = 60 : 4 = 15", en: 'on the left the ratio is constant: 30 ÷ 2 = 60 ÷ 4 = 15' },
      { ru: 'справа постоянно произведение: 2 · 6 = 4 · 3 = 12', uz: "o'ngda ko'paytma doimiy: 2 · 6 = 4 · 3 = 12", en: 'on the right the product is constant: 2 · 6 = 4 · 3 = 12' },
    ],
    done: {
      ru: 'Если одна величина растёт и другая растёт во столько же раз — связь прямая. Если одна растёт, а другая во столько же раз уменьшается — обратная. Забор покрасят за 3 часа, права была Дилноза.',
      uz: "Bir kattalik o'ssa, ikkinchisi ham shuncha barobar o'ssa — bog'lanish to'g'ri. Biri o'sib, ikkinchisi shuncha barobar kamaysa — teskari. Devor 3 soatda bo'yaladi, Dilnoza haq edi.",
      en: 'If one quantity grows and the other grows the same number of times, the link is direct. If one grows while the other shrinks the same number of times, it is inverse. The fence takes 3 hours, so Dilnoza was right.',
    },
    audio: {
      ru: [
        'Поставим две таблицы рядом. Слева банки краски и площадь: две банки тридцать метров, четыре банки шестьдесят.',
        'Справа маляры и время: два маляра шесть часов, четыре маляра три часа. Маляров стало вдвое больше, а времени вдвое меньше.',
        'В первой таблице постоянно отношение, во второй постоянно произведение. Первую связь называют прямой пропорциональностью, вторую обратной. Забор покрасят за три часа, права была Дилноза.',
      ],
      uz: [
        "Ikki jadvalni yonma-yon qo'yamiz. Chapda banka va yuza: ikki banka o'ttiz metr, to'rt banka oltmish metr.",
        "O'ngda bo'yoqchi va vaqt: ikki bo'yoqchi olti soat, to'rt bo'yoqchi uch soat. Bo'yoqchi ikki barobar ko'paydi, vaqt esa ikki barobar kamaydi.",
        "Birinchi jadvalda nisbat doimiy, ikkinchisida ko'paytma doimiy. Birinchi bog'lanish to'g'ri proporsionallik, ikkinchisi teskari deyiladi. Devor uch soatda bo'yaladi, Dilnoza haq edi.",
      ],
      en: [
        'Put two tables side by side. On the left tins and area: two tins thirty metres, four tins sixty.',
        'On the right painters and time: two painters six hours, four painters three hours. Twice the painters, half the time.',
        'In the first table the ratio is constant, in the second the product is. The first link is called direct proportion, the second inverse. The fence takes three hours and Dilnoza was right.',
      ],
    },
  },

  s_tool: {
    eyebrow: { ru: 'Смотри и повтори', uz: 'Qarang va takrorlang', en: 'Watch, then try' },
    title: { ru: 'Прямая связь: считаем пропорцией', uz: "To'g'ri bog'lanish: proporsiya bilan", en: 'Direct link: use a proportion' },
    demo_banner: { ru: 'Смотри — покажу на примере', uz: "Qarang — misolda ko'rsataman", en: 'Watch — I will show an example' },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    demo_lines: [
      { ru: '3 банки — 45 м², 5 банок — x', uz: '3 banka — 45 m², 5 banka — x', en: '3 tins for 45 m², 5 tins for x' },
      { ru: 'больше банок — больше площадь: связь прямая', uz: "banka ko'p — yuza katta: bog'lanish to'g'ri", en: 'more tins means more area: a direct link' },
      { ru: '3 : 45 = 5 : x → x = 75', uz: '3 : 45 = 5 : x → x = 75', en: '3 : 45 = 5 : x → x = 75' },
    ],
    demo_note: {
      ru: 'При прямой связи пропорция записывается в одном порядке, и работает основное свойство из прошлого урока.',
      uz: "To'g'ri bog'lanishda proporsiya bir tartibda yoziladi va o'tgan darsdagi asosiy xossa ishlaydi.",
      en: 'With a direct link the proportion keeps the same order and last lesson’s property applies.',
    },
    play_ask: { ru: '4 тетради стоят 10 000 сум. Сколько стоят 6 тетрадей?', uz: "4 ta daftar 10 000 so'm. 6 ta daftar qancha turadi?", en: '4 notebooks cost 10,000. What do 6 cost?' },
    play_opts: ['12 000', '15 000', '6000'],
    play_correct: 1,
    play_ok: {
      ru: 'Верно. 4 : 10 000 = 6 : x, значит x = 60 000 : 4 = 15 000.',
      uz: "To'g'ri. 4 : 10 000 = 6 : x, demak x = 60 000 : 4 = 15 000.",
      en: 'Right. 4 : 10,000 = 6 : x, so x = 60,000 ÷ 4 = 15,000.',
    },
    play_wrong: [
      { ru: 'Здесь прибавили 2000 за две тетради, но одна стоит 2500.', uz: "Bu yerda ikki daftarga 2000 qo'shilgan, bittasi esa 2500.", en: 'That added 2,000 for two notebooks, but one costs 2,500.' },
      null,
      { ru: 'Тетрадей стало больше, значит и цена больше, а не меньше.', uz: "Daftar ko'paydi, demak narx ham ko'p bo'ladi, kam emas.", en: 'There are more notebooks, so the price grows, not shrinks.' },
    ],
    audio: {
      intro: {
        ru: 'Если величины связаны прямо, задача решается пропорцией из прошлого урока. Покажу на банках краски.',
        uz: "Kattaliklar to'g'ri bog'langan bo'lsa, masala o'tgan darsdagi proporsiya bilan yechiladi. Bo'yoq bankalari misolida ko'rsataman.",
        en: 'If quantities are linked directly, the problem is solved with last lesson’s proportion. I will show it on tins of paint.',
      },
      demo: {
        ru: 'Три банки покрывают сорок пять квадратных метров. Банок стало больше, значит и площадь больше: связь прямая. Три к сорока пяти равно пять к иксу, икс равен семидесяти пяти.',
        uz: "Uch banka qirq besh kvadrat metrni qoplaydi. Banka ko'paydi, demak yuza ham katta: bog'lanish to'g'ri. Uch ning qirq beshga nisbati besh ning iksga nisbatiga teng, iks yetmish beshga teng.",
        en: 'Three tins cover forty five square metres. More tins mean more area, so the link is direct. Three to forty five equals five to x, and x is seventy five.',
      },
      play: {
        ru: 'Теперь ваша очередь. Четыре тетради стоят десять тысяч сумов. Сколько стоят шесть тетрадей?',
        uz: "Endi sizning navbatingiz. To'rt daftar o'n ming so'm turadi. Olti daftar qancha turadi?",
        en: 'Now it is your turn. Four notebooks cost ten thousand. What do six cost?',
      },
      ok: {
        ru: 'Верно. Одна тетрадь две тысячи пятьсот, шесть тетрадей пятнадцать тысяч.',
        uz: "To'g'ri. Bitta daftar ikki ming besh yuz, olti daftar o'n besh ming.",
        en: 'Right. One notebook is two thousand five hundred, six make fifteen thousand.',
      },
      wrong: {
        ru: 'Величины связаны прямо: запишите пропорцию в одном порядке и найдите неизвестное.',
        uz: "Kattaliklar to'g'ri bog'langan: proporsiyani bir tartibda yozing va noma'lumni toping.",
        en: 'The link is direct: write the proportion in the same order and find the unknown.',
      },
    },
  },

  s_inv: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Обратная связь: постоянное произведение', uz: "Teskari bog'lanish: doimiy ko'paytma", en: 'Inverse link: a constant product' },
    lines: [
      { ru: '2 маляра · 6 часов = 12', uz: "2 bo'yoqchi · 6 soat = 12", en: '2 painters · 6 hours = 12' },
      { ru: '4 маляра · x = 12', uz: "4 bo'yoqchi · x = 12", en: '4 painters · x = 12' },
      { ru: 'x = 12 : 4 = 3 часа', uz: 'x = 12 : 4 = 3 soat', en: 'x = 12 ÷ 4 = 3 hours' },
    ],
    done: {
      ru: 'В обратной связи постоянно произведение: работы всегда 12 человеко-часов. Пропорцию тоже можно записать, но вторую пару надо перевернуть.',
      uz: "Teskari bog'lanishda ko'paytma doimiy: ish har doim 12 kishi-soat. Proporsiya yozish ham mumkin, lekin ikkinchi juftlikni ag'darish kerak.",
      en: 'In an inverse link the product stays: the job is always 12 person hours. A proportion can be written too, but the second pair must be flipped.',
    },
    audio: {
      ru: [
        'В обратной связи считать надо иначе. Два маляра работают шесть часов, значит всего работы двенадцать человеко-часов.',
        'Маляров стало четыре, а работы столько же. Четыре умножить на икс равно двенадцать.',
        'Икс равен трём часам. Обратите внимание: постоянным осталось произведение, а не отношение. Если очень хочется пропорцию, вторую пару чисел надо перевернуть.',
      ],
      uz: [
        "Teskari bog'lanishda boshqacha hisoblash kerak. Ikki bo'yoqchi olti soat ishlaydi, demak jami ish o'n ikki kishi-soat.",
        "Bo'yoqchi to'rtta bo'ldi, ish esa o'sha. To'rt karra iks teng o'n ikki.",
        "Iks uch soatga teng. Diqqat qiling: doimiy bo'lib ko'paytma qoldi, nisbat emas. Agar proporsiya yozgingiz kelsa, ikkinchi juft sonni ag'darish kerak.",
      ],
      en: [
        'An inverse link needs a different count. Two painters work six hours, so the job is twelve person hours.',
        'Now there are four painters and the same job. Four times x equals twelve.',
        'So x is three hours. Notice that the product stayed constant, not the ratio. If you really want a proportion, the second pair has to be flipped.',
      ],
    },
  },

  s_solve: {
    eyebrow: { ru: 'Решаем вместе', uz: 'Birga yechamiz', en: 'Solving together' },
    title: { ru: '5 рабочих кладут плитку за 12 дней', uz: "5 ishchi 12 kunda plitka teradi", en: '5 workers tile a floor in 12 days' },
    lead: { ru: 'Сколько дней уйдёт у шестерых?', uz: 'Olti kishiga necha kun ketadi?', en: 'How long will six workers need?' },
    steps: [
      { ru: 'больше рабочих — меньше дней: связь обратная', uz: "ishchi ko'p — kun kam: bog'lanish teskari", en: 'more workers means fewer days: inverse link' },
      { ru: '5 · 12 = 60 — вся работа', uz: '5 · 12 = 60 — butun ish', en: '5 · 12 = 60 is the whole job' },
      { ru: '6 · x = 60 → x = 10 дней', uz: '6 · x = 60 → x = 10 kun', en: '6 · x = 60 → x = 10 days' },
    ],
    done: {
      ru: 'Ответ 10 дней. Проверка: 6 · 10 = 60, столько же, сколько 5 · 12. Обратите внимание — дней стало меньше, а не больше.',
      uz: "Javob 10 kun. Tekshiruv: 6 · 10 = 60, 5 · 12 bilan bir xil. Diqqat qiling — kun kamaydi, ko'paymadi.",
      en: 'The answer is 10 days. Check: 6 · 10 = 60, the same as 5 · 12. Notice the days went down, not up.',
    },
    audio: {
      ru: [
        'Решаем вместе. Пять рабочих кладут плитку за двенадцать дней. Рабочих станет шесть, значит дней понадобится меньше: связь обратная.',
        'Считаем всю работу: пять умножить на двенадцать шестьдесят человеко-дней.',
        'Шесть умножить на икс равно шестьдесят, икс равен десяти. Работа займёт десять дней. Проверим: шесть на десять шестьдесят. Сходится.',
      ],
      uz: [
        "Birga yechamiz. Besh ishchi plitkani o'n ikki kunda teradi. Ishchi oltita bo'ladi, demak kun kamroq kerak: bog'lanish teskari.",
        "Butun ishni hisoblaymiz: besh karra o'n ikki oltmish kishi-kun.",
        "Olti karra iks teng oltmish, iks o'nga teng. Ish o'n kun oladi. Tekshiramiz: olti karra o'n oltmish. To'g'ri keldi.",
      ],
      en: [
        'Let us solve it together. Five workers tile a floor in twelve days. With six workers fewer days are needed: an inverse link.',
        'Compute the whole job: five times twelve is sixty person days.',
        'Six times x equals sixty, so x is ten. The job takes ten days. Check: six times ten is sixty. It matches.',
      ],
    },
  },

  s_edge: {
    eyebrow: { ru: 'Где ошибаются', uz: 'Qayerda xato qilinadi', en: 'Where mistakes happen' },
    title: { ru: 'Сначала тип связи, потом счёт', uz: "Avval bog'lanish turi, keyin hisob", en: 'The kind of link first, the arithmetic second' },
    bad_line: { ru: 'ошибка: 2 : 6 = 4 : x при обратной связи', uz: "xato: teskari bog'lanishda 2 : 6 = 4 : x", en: 'mistake: 2 : 6 = 4 : x for an inverse link' },
    good_line: { ru: 'верно: 2 · 6 = 4 · x', uz: "to'g'ri: 2 · 6 = 4 · x", en: 'right: 2 · 6 = 4 · x' },
    none_line: { ru: 'а рост и возраст ученика вообще не пропорциональны', uz: "o'quvchining bo'yi va yoshi esa umuman proporsional emas", en: 'and a student’s height and age are not proportional at all' },
    done: {
      ru: 'Перед решением спроси: если первая величина вырастет вдвое, вторая вырастет или уменьшится? И бывает, что связи нет вовсе.',
      uz: "Yechishdan oldin so'rang: birinchi kattalik ikki barobar oshsa, ikkinchisi oshadimi yoki kamayadimi? Ba'zan esa bog'lanish umuman yo'q.",
      en: 'Before solving, ask: if the first quantity doubles, does the second grow or shrink? And sometimes there is no link at all.',
    },
    audio: {
      ru: [
        'Главная ошибка темы это записать обычную пропорцию там, где связь обратная. Тогда получится, что четыре маляра красят дольше двух.',
        'В обратной связи считают произведение: два умножить на шесть равно четыре умножить на икс.',
        'И ещё. Не всякие две величины связаны пропорционально. Рост ученика и его возраст растут вместе, но вдвое старше не значит вдвое выше. Прежде чем решать, назовите тип связи.',
      ],
      uz: [
        "Mavzudagi asosiy xato teskari bog'lanish bo'lgan joyda oddiy proporsiya yozish. Unda to'rt bo'yoqchi ikkitasidan uzoqroq bo'yaydi degan gap chiqadi.",
        "Teskari bog'lanishda ko'paytma hisoblanadi: ikki karra olti teng to'rt karra iks.",
        "Yana bir narsa. Har qanday ikki kattalik proporsional bog'lanmagan. O'quvchining bo'yi va yoshi birga o'sadi, lekin ikki barobar katta yosh ikki barobar baland bo'y degani emas. Yechishdan oldin bog'lanish turini ayting.",
      ],
      en: [
        'The main mistake is writing an ordinary proportion where the link is inverse. Then four painters would take longer than two.',
        'An inverse link uses the product: two times six equals four times x.',
        'One more thing. Not every pair of quantities is proportional. A student’s height and age grow together, but twice the age is not twice the height. Name the kind of link before solving.',
      ],
    },
  },

  s_rule: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    title: { ru: 'Два вида пропорциональности', uz: 'Ikki xil proporsionallik', en: 'Two kinds of proportion' },
    rule_1: {
      ru: 'Прямая пропорциональность: во сколько раз растёт одна величина, во столько же растёт другая, а их отношение постоянно.',
      uz: "To'g'ri proporsionallik: bir kattalik necha barobar o'ssa, ikkinchisi ham shuncha barobar o'sadi, nisbati esa doimiy.",
      en: 'Direct proportion: when one quantity grows a number of times, the other grows the same number of times and their ratio stays constant.',
    },
    rule_2: {
      ru: 'Обратная: одна растёт, другая во столько же раз уменьшается, а постоянно их произведение. Забор: 2 · 6 = 4 · 3, вчетвером управятся за 3 часа. Права была Дилноза.',
      uz: "Teskari: biri o'sadi, ikkinchisi shuncha barobar kamayadi, ko'paytmasi esa doimiy. Devor: 2 · 6 = 4 · 3, to'rt kishi 3 soatda uddalaydi. Dilnoza haq edi.",
      en: 'Inverse: one grows while the other shrinks the same number of times, and their product stays constant. The fence: 2 · 6 = 4 · 3, four painters finish in 3 hours. Dilnoza was right.',
    },
    audio: {
      ru: 'Запомним правило. При прямой пропорциональности величины растут вместе и постоянно их отношение. При обратной одна растёт, другая во столько же раз уменьшается, и постоянно их произведение. Поэтому сначала называют тип связи, а уже потом пишут пропорцию или произведение. Вернёмся к забору. Два маляра на шесть часов это столько же работы, сколько четыре маляра на три часа. Права была Дилноза.',
      uz: "Qoidani eslab qolamiz. To'g'ri proporsionallikda kattaliklar birga o'sadi va nisbati doimiy. Teskarisida biri o'sadi, ikkinchisi shuncha barobar kamayadi va ko'paytmasi doimiy. Shuning uchun avval bog'lanish turi aytiladi, keyin proporsiya yoki ko'paytma yoziladi. Devorga qaytamiz. Ikki bo'yoqchi olti soatga bu to'rt bo'yoqchi uch soatga bilan bir xil ish. Dilnoza haq edi.",
      en: 'Let us remember the rule. In direct proportion the quantities grow together and their ratio is constant. In inverse proportion one grows while the other shrinks the same number of times and their product is constant. So name the kind of link first and only then write a proportion or a product. Back to the fence. Two painters for six hours is the same work as four painters for three. Dilnoza was right.',
    },
  },

  s_dir: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Прямая связь', uz: "To'g'ri bog'lanish", en: 'Direct link' },
    lead: { ru: 'Растёт одно — растёт другое. Работает пропорция.', uz: "Biri o'ssa, ikkinchisi ham o'sadi. Proporsiya ishlaydi.", en: 'One grows, the other grows. A proportion works.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: '2 кг яблок стоят 16 000. Сколько стоят 5 кг?', uz: "2 kg olma 16 000 so'm. 5 kg qancha turadi?", en: '2 kg of apples cost 16,000. What do 5 kg cost?' },
        opts: ['40 000', '32 000', '8000'],
        correct: 0,
        ok: { ru: 'Верно. 1 кг стоит 8000, значит 5 кг это 40 000.', uz: "To'g'ri. 1 kg 8000, demak 5 kg 40 000.", en: 'Right. One kilo is 8,000, so 5 kg cost 40,000.' },
        wrong: [
          null,
          { ru: 'Это цена четырёх килограммов.', uz: "Bu to'rt kilogrammning narxi.", en: 'That is the price of four kilos.' },
          { ru: 'Это цена одного килограмма.', uz: 'Bu bir kilogrammning narxi.', en: 'That is the price of one kilo.' },
        ],
      },
      {
        q: { ru: 'За 3 часа автобус проходит 180 км. Сколько за 5 часов?', uz: "3 soatda avtobus 180 km yuradi. 5 soatda qancha?", en: 'A bus covers 180 km in 3 hours. How far in 5 hours?' },
        opts: [
          { ru: '300 км', uz: '300 km', en: '300 km' },
          { ru: '108 км', uz: '108 km', en: '108 km' },
          { ru: '240 км', uz: '240 km', en: '240 km' },
        ],
        correct: 0,
        ok: { ru: 'Верно. За час 60 км, за 5 часов 300 км.', uz: "To'g'ri. Bir soatda 60 km, 5 soatda 300 km.", en: 'Right. Sixty km per hour makes 300 km in five.' },
        wrong: [
          null,
          { ru: 'Времени больше, значит и путь больше.', uz: "Vaqt ko'p, demak yo'l ham uzun.", en: 'More time means a longer distance.' },
          { ru: 'Это за 4 часа.', uz: "Bu 4 soatda.", en: 'That is four hours.' },
        ],
      },
      {
        q: { ru: '6 тетрадей весят 900 г. Сколько весят 4 тетради?', uz: "6 ta daftar 900 g. 4 ta daftar qancha?", en: 'Six notebooks weigh 900 g. What do four weigh?' },
        opts: [
          { ru: '600 г', uz: '600 g', en: '600 g' },
          { ru: '1350 г', uz: '1350 g', en: '1350 g' },
          { ru: '150 г', uz: '150 g', en: '150 g' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Одна тетрадь 150 г, четыре — 600 г.', uz: "To'g'ri. Bitta daftar 150 g, to'rttasi 600 g.", en: 'Right. One notebook is 150 g, four make 600 g.' },
        wrong: [
          null,
          { ru: 'Тетрадей меньше, значит и вес меньше.', uz: 'Daftar kam, demak vazn ham kam.', en: 'Fewer notebooks mean less weight.' },
          { ru: 'Это вес одной тетради.', uz: 'Bu bitta daftarning vazni.', en: 'That is one notebook.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на прямую связь. Удобно сначала найти значение для единицы.',
        uz: "To'g'ri bog'lanish mashqi. Avval bittasiga to'g'ri keladigan qiymatni topish qulay.",
        en: 'Direct link practice. It helps to find the value for one unit first.',
      },
    },
  },

  s_ind: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Обратная связь', uz: "Teskari bog'lanish", en: 'Inverse link' },
    lead: { ru: 'Растёт одно — уменьшается другое. Считай произведение.', uz: "Biri o'ssa, ikkinchisi kamayadi. Ko'paytmani hisoblang.", en: 'One grows, the other shrinks. Use the product.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: '3 насоса наполняют бак за 8 часов. За сколько 4 насоса?', uz: "3 nasos bakni 8 soatda to'ldiradi. 4 nasos necha soatda?", en: 'Three pumps fill a tank in 8 hours. How long for four?' },
        opts: [
          { ru: '6 часов', uz: '6 soat', en: '6 hours' },
          { ru: '10 часов', uz: '10 soat', en: '10 hours' },
          { ru: '12 часов', uz: '12 soat', en: '12 hours' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 3 · 8 = 24, значит 4 · x = 24 и x = 6.', uz: "To'g'ri. 3 · 8 = 24, demak 4 · x = 24 va x = 6.", en: 'Right. 3 · 8 = 24, so 4 · x = 24 and x = 6.' },
        wrong: [
          null,
          { ru: 'Насосов больше, значит времени меньше.', uz: "Nasos ko'p, demak vaqt kam.", en: 'More pumps mean less time.' },
          { ru: 'Это ответ для двух насосов.', uz: 'Bu ikki nasos uchun javob.', en: 'That is the answer for two pumps.' },
        ],
      },
      {
        q: { ru: 'Еды хватает 6 туристам на 10 дней. На сколько дней хватит 12 туристам?', uz: "Oziq-ovqat 6 sayyohga 10 kunga yetadi. 12 sayyohga necha kunga yetadi?", en: 'Food lasts 6 hikers 10 days. How long for 12 hikers?' },
        opts: [
          { ru: '5 дней', uz: '5 kun', en: '5 days' },
          { ru: '20 дней', uz: '20 kun', en: '20 days' },
          { ru: '15 дней', uz: '15 kun', en: '15 days' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 6 · 10 = 60, значит 12 · x = 60 и x = 5.', uz: "To'g'ri. 6 · 10 = 60, demak 12 · x = 60 va x = 5.", en: 'Right. 6 · 10 = 60, so 12 · x = 60 and x = 5.' },
        wrong: [
          null,
          { ru: 'Туристов вдвое больше, значит еды хватит вдвое меньше.', uz: "Sayyoh ikki barobar ko'p, demak oziq-ovqat ikki barobar kam yetadi.", en: 'Twice the hikers means half the days.' },
          { ru: 'Это ответ для четырёх туристов.', uz: "Bu to'rt sayyoh uchun javob.", en: 'That is the answer for four hikers.' },
        ],
      },
      {
        q: { ru: 'Машина едет 4 часа со скоростью 60 км/ч. Сколько часов на той же дороге при 80 км/ч?', uz: "Mashina 60 km soat tezlikda 4 soat yuradi. 80 km soat tezlikda o'sha yo'lda necha soat?", en: 'A car drives 4 hours at 60 km per hour. How long on the same road at 80?' },
        opts: [
          { ru: '3 часа', uz: '3 soat', en: '3 hours' },
          { ru: '5 часов', uz: '5 soat', en: '5 hours' },
          { ru: '6 часов', uz: '6 soat', en: '6 hours' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Путь 240 км, при 80 км в час это 3 часа.', uz: "To'g'ri. Yo'l 240 km, soatiga 80 km bilan bu 3 soat.", en: 'Right. The road is 240 km and at 80 per hour that is 3 hours.' },
        wrong: [
          null,
          { ru: 'Скорость выше, значит времени меньше.', uz: 'Tezlik yuqori, demak vaqt kam.', en: 'Higher speed means less time.' },
          { ru: 'Это время при скорости 40 км в час.', uz: 'Bu soatiga 40 km tezlikdagi vaqt.', en: 'That is the time at 40 km per hour.' },
        ],
      },
      {
        q: { ru: 'Что остаётся постоянным при обратной связи?', uz: "Teskari bog'lanishda nima doimiy qoladi?", en: 'What stays constant in an inverse link?' },
        opts: [
          { ru: 'Произведение величин', uz: "Kattaliklar ko'paytmasi", en: 'The product of the quantities' },
          { ru: 'Отношение величин', uz: 'Kattaliklar nisbati', en: 'The ratio of the quantities' },
          { ru: 'Их сумма', uz: "Ularning yig'indisi", en: 'Their sum' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Поэтому и решают через произведение, а не через пропорцию.', uz: "To'g'ri. Shuning uchun proporsiya emas, ko'paytma orqali yechiladi.", en: 'Right. That is why we use the product rather than a proportion.' },
        wrong: [
          null,
          { ru: 'Отношение постоянно при прямой связи.', uz: "Nisbat to'g'ri bog'lanishda doimiy.", en: 'The ratio is constant in a direct link.' },
          { ru: 'Сумма меняется: 2 и 6 дают 8, а 4 и 3 дают 7.', uz: "Yig'indi o'zgaradi: 2 va 6 sakkiz, 4 va 3 yetti beradi.", en: 'The sum changes: 2 and 6 make 8, while 4 and 3 make 7.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на обратную связь. Сначала считайте всю работу или весь путь.',
        uz: "Teskari bog'lanish mashqi. Avval butun ishni yoki butun yo'lni hisoblang.",
        en: 'Inverse link practice. Compute the whole job or the whole distance first.',
      },
    },
  },

  s_bins: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Прямая или обратная', uz: "To'g'ri yoki teskari", en: 'Direct or inverse' },
    lead: { ru: 'Смотри, растут числа вместе или расходятся.', uz: "Sonlar birga o'sadimi yoki qarama-qarshi ketadimi, qarang.", en: 'See whether the numbers grow together or move apart.' },
    bin_a: { ru: 'Прямая', uz: "To'g'ri", en: 'Direct' },
    bin_b: { ru: 'Обратная', uz: 'Teskari', en: 'Inverse' },
    cards: [
      { label: '2→10, 4→20', bin: 'a' },
      { label: '3→9, 6→18', bin: 'a' },
      { label: '5→15, 10→30', bin: 'a' },
      { label: '2→12, 4→6', bin: 'b' },
      { label: '3→8, 6→4', bin: 'b' },
      { label: '5→20, 10→10', bin: 'b' },
    ],
    hint: {
      ru: 'Если первое число выросло вдвое и второе выросло вдвое — прямая. Если второе уменьшилось вдвое — обратная.',
      uz: "Birinchi son ikki barobar oshib, ikkinchisi ham oshgan bo'lsa — to'g'ri. Ikkinchisi ikki barobar kamaygan bo'lsa — teskari.",
      en: 'If the first doubled and the second doubled too, it is direct. If the second halved, it is inverse.',
    },
    correct_text: {
      ru: 'Верно. В прямой связи постоянно отношение, в обратной постоянно произведение.',
      uz: "To'g'ri. To'g'ri bog'lanishda nisbat, teskarisida esa ko'paytma doimiy.",
      en: 'Right. A direct link keeps the ratio constant, an inverse one keeps the product.',
    },
    audio: {
      intro: {
        ru: 'Разложите пары по двум корзинам. Смотрите, как меняется второе число, когда растёт первое.',
        uz: "Juftliklarni ikki savatga ajrating. Birinchi son o'sganda ikkinchisi qanday o'zgarishiga qarang.",
        en: 'Sort the pairs into two baskets. Watch how the second number changes as the first grows.',
      },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда. Проверь: второе число выросло или уменьшилось?', uz: "Bu yerga emas. Tekshiring: ikkinchi son oshdimi yoki kamaydimi?", en: 'Not here. Check: did the second number grow or shrink?' },
    },
  },

  s_error: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikidek tekshiring.", en: 'Check someone else’s work the way you would check your own.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Азиз: «3 маляра красят за 9 часов, значит 9 маляров за 27 часов». Проверь.', uz: "Aziz: «3 bo'yoqchi 9 soatda bo'yaydi, demak 9 bo'yoqchi 27 soatda». Tekshiring.", en: 'Aziz: “Three painters take 9 hours, so nine painters take 27.” Check it.' },
        opts: [
          { ru: 'Нет: связь обратная, выйдет 3 часа', uz: "Yo'q: bog'lanish teskari, 3 soat chiqadi", en: 'No: the link is inverse and it takes 3 hours' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, выйдет 18 часов', uz: "Yo'q, 18 soat chiqadi", en: 'No, it takes 18 hours' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 3 · 9 = 27, значит 9 · x = 27 и x = 3.', uz: "To'g'ri. 3 · 9 = 27, demak 9 · x = 27 va x = 3.", en: 'Right. 3 · 9 = 27, so 9 · x = 27 and x = 3.' },
        wrong: [
          null,
          { ru: 'Маляров больше, значит времени меньше, а не больше.', uz: "Bo'yoqchi ko'p, demak vaqt kam, ko'p emas.", en: 'More painters mean less time, not more.' },
          { ru: 'Тоже больше девяти: связь обратная, время уменьшается.', uz: "Bu ham to'qqizdan ko'p: bog'lanish teskari, vaqt kamayadi.", en: 'Still more than nine: the link is inverse and time goes down.' },
        ],
      },
      {
        q: { ru: 'Дилноза: «Рост и возраст пропорциональны: в 12 лет 150 см, значит в 24 будет 300 см». Проверь.', uz: "Dilnoza: «Bo'y va yosh proporsional: 12 yoshda 150 sm, demak 24 yoshda 300 sm». Tekshiring.", en: 'Dilnoza: “Height and age are proportional: 150 cm at 12, so 300 cm at 24.” Check it.' },
        opts: [
          { ru: 'Нет: эти величины не пропорциональны', uz: "Yo'q: bu kattaliklar proporsional emas", en: 'No: these quantities are not proportional' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Верно, но связь обратная', uz: "To'g'ri, lekin bog'lanish teskari", en: 'True, but the link is inverse' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Рост растёт с возрастом, но не во столько же раз. Пропорция тут не работает.', uz: "To'g'ri. Bo'y yosh bilan o'sadi, lekin shuncha barobar emas. Proporsiya bu yerda ishlamaydi.", en: 'Right. Height grows with age but not by the same factor. A proportion does not apply.' },
        wrong: [
          null,
          { ru: 'Взрослых ростом три метра не бывает: проверка здравым смыслом.', uz: "Bo'yi uch metr odam bo'lmaydi: sog'lom fikr bilan tekshirish.", en: 'No adult is three metres tall: common sense check.' },
          { ru: 'Обратной связи тоже нет: рост не уменьшается с возрастом.', uz: "Teskari bog'lanish ham yo'q: bo'y yosh bilan kamaymaydi.", en: 'It is not inverse either: height does not shrink with age.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Проверьте чужое решение. Ошибка бывает и в счёте, и в самом типе связи.',
        uz: "Birovning yechimini tekshiring. Xato hisobda ham, bog'lanish turida ham bo'lishi mumkin.",
        en: 'Check someone else’s work. A mistake can be in the arithmetic and in the kind of link.',
      },
    },
  },

  s_task: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    title: { ru: 'Забор и краска', uz: "Devor va bo'yoq", en: 'The fence and the paint' },
    lead: { ru: 'Забор красят 4 маляра. Двое красят его за 6 часов, а на весь забор уходит 5 банок краски.', uz: "Devorni 4 bo'yoqchi bo'yaydi. Ikki kishi uni 6 soatda bo'yaydi, butun devorga 5 banka bo'yoq ketadi.", en: 'Four painters work on the fence. Two of them need 6 hours, and the whole fence takes 5 tins.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'За сколько часов покрасят четверо?', uz: "To'rt kishi necha soatda bo'yaydi?", en: 'How long do four painters need?' },
        opts: [
          { ru: '3 часа', uz: '3 soat', en: '3 hours' },
          { ru: '12 часов', uz: '12 soat', en: '12 hours' },
          { ru: '8 часов', uz: '8 soat', en: '8 hours' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 2 · 6 = 12, значит 4 · x = 12 и x = 3.', uz: "To'g'ri. 2 · 6 = 12, demak 4 · x = 12 va x = 3.", en: 'Right. 2 · 6 = 12, so 4 · x = 12 and x = 3.' },
        wrong: [
          null,
          { ru: 'Это ответ при прямой связи, а здесь обратная.', uz: "Bu to'g'ri bog'lanishdagi javob, bu yerda esa teskari.", en: 'That is the direct answer, but the link here is inverse.' },
          { ru: 'Проверь произведение: 4 · 8 = 32, а всего работы 12.', uz: "Ko'paytmani tekshiring: 4 · 8 = 32, ish esa jami 12.", en: 'Check the product: 4 · 8 = 32, but the job is 12.' },
        ],
      },
      {
        q: { ru: 'На два таких забора сколько нужно банок?', uz: "Shunday ikkita devorga nechta banka kerak?", en: 'How many tins for two such fences?' },
        opts: ['10', '5', '2,5'],
        correct: 0,
        ok: { ru: 'Верно. Здесь связь прямая: заборов вдвое больше, краски вдвое больше.', uz: "To'g'ri. Bu yerda bog'lanish to'g'ri: devor ikki barobar ko'p, bo'yoq ham ikki barobar.", en: 'Right. Here the link is direct: twice the fences, twice the paint.' },
        wrong: [
          null,
          { ru: 'Это на один забор.', uz: 'Bu bitta devorga.', en: 'That is for one fence.' },
          { ru: 'Краски нужно больше, а не меньше: это не обратная связь.', uz: "Bo'yoq ko'p kerak, kam emas: bu teskari bog'lanish emas.", en: 'More paint is needed, not less: this link is not inverse.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Задача про забор. В ней встречаются обе связи сразу, поэтому тип называйте отдельно для каждого вопроса.',
        uz: "Devor haqida masala. Unda ikkala bog'lanish ham uchraydi, shuning uchun turini har bir savol uchun alohida ayting.",
        en: 'A fence problem. Both kinds of link appear, so name the kind separately for each question.',
      },
    },
  },

  s_final: {
    eyebrow: { ru: 'Финал', uz: 'Final', en: 'Final' },
    intro_line: { ru: 'Пять заданий на весь урок.', uz: 'Butun darsga beshta topshiriq.', en: 'Five tasks covering the whole lesson.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        kind: 'num', ans: 4,
        q: { ru: '6 рабочих делают работу за 8 дней. За сколько дней сделают 12 рабочих? Набери ответ.', uz: "6 ishchi ishni 8 kunda bajaradi. 12 ishchi necha kunda bajaradi? Javobni tering.", en: 'Six workers finish a job in 8 days. How many days for twelve? Type the answer.' },
        hint: { ru: 'Связь обратная: 6 · 8 = 48, дальше 12 · x = 48.', uz: "Bog'lanish teskari: 6 · 8 = 48, keyin 12 · x = 48.", en: 'The link is inverse: 6 · 8 = 48, then 12 · x = 48.' },
        hint_audio: { ru: 'Связь обратная. Шесть умножить на восемь сорок восемь, значит двенадцать умножить на икс тоже сорок восемь.', uz: "Bog'lanish teskari. Olti karra sakkiz qirq sakkiz, demak o'n ikki karra iks ham qirq sakkiz.", en: 'The link is inverse. Six times eight is forty eight, so twelve times x is forty eight too.' },
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'Какие величины связаны обратно?', uz: 'Qaysi kattaliklar teskari bog\'langan?', en: 'Which quantities are inversely linked?' },
        opts: [
          { ru: 'Количество тетрадей и их цена', uz: 'Daftarlar soni va ularning narxi', en: 'The number of notebooks and their price' },
          { ru: 'Скорость и время на одном пути', uz: "Bir yo'ldagi tezlik va vaqt", en: 'Speed and time on a fixed route' },
          { ru: 'Время работы и сделанные детали', uz: 'Ish vaqti va tayyorlangan detallar', en: 'Working time and parts produced' },
          { ru: 'Сторона квадрата и его периметр', uz: 'Kvadrat tomoni va perimetri', en: 'A square’s side and its perimeter' },
        ],
        wrong: [
          { ru: 'Больше тетрадей — больше платить: связь прямая.', uz: "Daftar ko'p — to'lov ko'p: bog'lanish to'g'ri.", en: 'More notebooks cost more: a direct link.' },
          null,
          { ru: 'Дольше работаешь — больше деталей: связь прямая.', uz: "Uzoq ishlasang — detal ko'p: bog'lanish to'g'ri.", en: 'Working longer makes more parts: direct.' },
          { ru: 'Сторона больше — периметр больше: связь прямая.', uz: 'Tomon katta — perimetr katta: to\'g\'ri bog\'lanish.', en: 'A longer side gives a longer perimeter: direct.' },
        ],
        correct: { ru: 'Верно. Быстрее едешь — меньше времени, а произведение постоянно и равно пути.', uz: "To'g'ri. Tez yursang — vaqt kam, ko'paytma esa doimiy va yo'lga teng.", en: 'Right. Faster means less time, and the product stays equal to the distance.' },
      },
      {
        kind: 'mc', correctIndex: 0,
        q: { ru: '5 м ткани стоят 75 000. Сколько стоят 8 м?', uz: "5 m mato 75 000 so'm. 8 m qancha turadi?", en: 'Five metres of fabric cost 75,000. What do eight cost?' },
        opts: ['120 000', '46 875', '15 000', '90 000'],
        wrong: [
          null,
          { ru: 'Метров больше, значит и цена больше.', uz: "Metr ko'p, demak narx ham ko'p.", en: 'More metres mean a higher price.' },
          { ru: 'Это цена одного метра.', uz: 'Bu bir metrning narxi.', en: 'That is the price of one metre.' },
          { ru: 'Проверь: 1 м стоит 15 000, значит 8 м это 120 000.', uz: "Tekshiring: 1 m 15 000, demak 8 m 120 000.", en: 'Check: one metre is 15,000, so eight are 120,000.' },
        ],
        correct: { ru: 'Верно. Связь прямая: 1 м стоит 15 000, восемь метров 120 000.', uz: "To'g'ri. Bog'lanish to'g'ri: 1 m 15 000, sakkiz metr 120 000.", en: 'Right. A direct link: one metre is 15,000 and eight are 120,000.' },
      },
      {
        kind: 'mc', correctIndex: 2,
        q: { ru: 'Что постоянно при прямой пропорциональности?', uz: "To'g'ri proporsionallikda nima doimiy?", en: 'What is constant in direct proportion?' },
        opts: [
          { ru: 'Произведение величин', uz: "Kattaliklar ko'paytmasi", en: 'The product' },
          { ru: 'Разность величин', uz: 'Kattaliklar ayirmasi', en: 'The difference' },
          { ru: 'Отношение величин', uz: 'Kattaliklar nisbati', en: 'The ratio' },
          { ru: 'Сумма величин', uz: "Kattaliklar yig'indisi", en: 'The sum' },
        ],
        wrong: [
          { ru: 'Произведение постоянно при обратной связи.', uz: "Ko'paytma teskari bog'lanishda doimiy.", en: 'The product is constant in an inverse link.' },
          { ru: 'Разность меняется: 2 и 30, потом 4 и 60.', uz: "Ayirma o'zgaradi: 2 va 30, keyin 4 va 60.", en: 'The difference changes: 2 and 30, then 4 and 60.' },
          null,
          { ru: 'Сумма тоже растёт вместе с числами.', uz: "Yig'indi ham sonlar bilan birga o'sadi.", en: 'The sum grows along with the numbers.' },
        ],
        correct: { ru: 'Верно. Отношение постоянно, поэтому и работает пропорция.', uz: "To'g'ri. Nisbat doimiy, shuning uchun proporsiya ishlaydi.", en: 'Right. The ratio is constant, which is why a proportion works.' },
      },
      {
        kind: 'mc', correctIndex: 3,
        q: { ru: 'С чего начинают такую задачу?', uz: 'Bunday masala nimadan boshlanadi?', en: 'How do you start such a problem?' },
        opts: [
          { ru: 'Сразу пишут пропорцию', uz: 'Darrov proporsiya yoziladi', en: 'By writing a proportion at once' },
          { ru: 'Складывают величины', uz: "Kattaliklar qo'shiladi", en: 'By adding the quantities' },
          { ru: 'Округляют числа', uz: 'Sonlar yaxlitlanadi', en: 'By rounding the numbers' },
          { ru: 'Определяют тип связи', uz: "Bog'lanish turi aniqlanadi", en: 'By naming the kind of link' },
        ],
        wrong: [
          { ru: 'При обратной связи обычная пропорция даст неверный ответ.', uz: "Teskari bog'lanishda oddiy proporsiya noto'g'ri javob beradi.", en: 'With an inverse link an ordinary proportion gives a wrong answer.' },
          { ru: 'Складывать разные величины бессмысленно.', uz: "Har xil kattaliklarni qo'shish ma'nosiz.", en: 'Adding different quantities makes no sense.' },
          { ru: 'Округление здесь ничего не решает.', uz: 'Yaxlitlash bu yerda hech nimani hal qilmaydi.', en: 'Rounding decides nothing here.' },
          null,
        ],
        correct: { ru: 'Верно. Сначала спрашивают, растёт вторая величина или уменьшается.', uz: "To'g'ri. Avval ikkinchi kattalik o'sadimi yoki kamayadimi deb so'raladi.", en: 'Right. First ask whether the second quantity grows or shrinks.' },
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
      ru: 'Рычаг работает на обратной пропорциональности: чем длиннее плечо, тем меньше нужна сила. Архимед сказал, что дай ему точку опоры и достаточно длинный рычаг, и он сдвинет Землю.',
      uz: "Richag teskari proporsionallikka asoslanadi: yelka qancha uzun bo'lsa, kuch shuncha kam kerak. Arximed tayanch nuqtasi va yetarlicha uzun richag berilsa, Yerni qo'zg'ataman degan.",
      en: 'A lever works on inverse proportion: the longer the arm, the less force is needed. Archimedes said that given a place to stand and a long enough lever he would move the Earth.',
    },
    fact_audio: {
      ru: 'Знаешь ли ты? Рычаг работает на обратной пропорциональности: чем длиннее плечо, тем меньше нужна сила. Архимед говорил, что если дать ему точку опоры и достаточно длинный рычаг, он сдвинет Землю.',
      uz: "Bilasizmi? Richag teskari proporsionallikka asoslanadi: yelka qancha uzun bo'lsa, kuch shuncha kam kerak. Arximed tayanch nuqtasi va yetarlicha uzun richag berilsa, Yerni qo'zg'ataman degan.",
      en: 'Did you know? A lever works on inverse proportion: the longer the arm, the less force is needed. Archimedes said that given a place to stand and a long enough lever he would move the Earth.',
    },
  },

  s14: {
    eyebrow: { ru: 'Урок пройден', uz: "Dars o'tildi", en: 'Lesson finished' },
    banner: { ru: 'Математика · Пропорциональность', uz: 'Matematika · Proporsionallik', en: 'Mathematics · Proportionality' },
    heading: { ru: 'Прямая и обратная', uz: "To'g'ri va teskari", en: 'Direct and inverse' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    brief_1: { ru: 'прямая: отношение постоянно', uz: "to'g'ri: nisbat doimiy", en: 'direct: the ratio is constant' },
    brief_2: { ru: 'обратная: произведение постоянно', uz: "teskari: ko'paytma doimiy", en: 'inverse: the product is constant' },
    brief_3: { ru: 'сначала тип связи, потом запись', uz: "avval bog'lanish turi, keyin yozuv", en: 'name the link first, then write' },
    memo_title: { ru: 'Что помнить', uz: 'Nimani eslash kerak', en: 'What to remember' },
    memo_q1: { ru: 'Прямая связь', uz: "To'g'ri bog'lanish", en: 'Direct link' },
    memo_a1: { ru: 'вдвое больше — вдвое больше', uz: 'ikki barobar — ikki barobar', en: 'twice as much gives twice as much' },
    memo_q2: { ru: 'Обратная связь', uz: "Teskari bog'lanish", en: 'Inverse link' },
    memo_a2: { ru: 'вдвое больше — вдвое меньше', uz: 'ikki barobar — ikki barobar kam', en: 'twice as much gives half as much' },
    memo_q3: { ru: 'Частая ошибка', uz: 'Tez-tez uchraydigan xato', en: 'A common mistake' },
    memo_a3: { ru: 'пропорция там, где связь обратная', uz: "teskari bog'lanishda proporsiya yozish", en: 'a proportion where the link is inverse' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'При прямой пропорциональности постоянно отношение величин, при обратной постоянно их произведение. Поэтому сначала называют тип связи и только потом считают.',
        'Забор: два маляра за шесть часов это столько же работы, сколько четыре маляра за три часа.',
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "To'g'ri proporsionallikda kattaliklar nisbati, teskarisida esa ko'paytmasi doimiy. Shuning uchun avval bog'lanish turi aytiladi, keyin hisoblanadi.",
        "Devor: ikki bo'yoqchi olti soatga bu to'rt bo'yoqchi uch soatga bilan bir xil ish.",
      ],
      en: [
        'The lesson is done. Let us gather the main points.',
        'Direct proportion keeps the ratio constant, inverse proportion keeps the product. So name the kind of link first and compute after.',
        'The fence: two painters for six hours is the same work as four painters for three.',
      ],
    },
  },

  s_methods: {
    m1_title: { ru: 'Способ. Сначала тип связи', uz: "Usul. Avval bog'lanish turi", en: 'Method. The kind of link first' },
    m1_steps: {
      ru: ['Спроси: вторая величина вырастет или уменьшится', 'Прямая — пиши пропорцию, обратная — считай произведение', 'Проверь ответ здравым смыслом'],
      uz: ["So'rang: ikkinchi kattalik oshadimi yoki kamayadimi", "To'g'ri bo'lsa proporsiya yozing, teskari bo'lsa ko'paytmani hisoblang", "Javobni sog'lom fikr bilan tekshiring"],
      en: ['Ask whether the second quantity grows or shrinks', 'Direct: write a proportion. Inverse: use the product', 'Check the answer against common sense'],
    },
    m1_no: {
      ru: 'Есть пары величин, которые не связаны ни прямо, ни обратно: рост и возраст, отметка и номер парты.',
      uz: "Na to'g'ri, na teskari bog'lanmagan kattaliklar ham bor: bo'y va yosh, baho va parta raqami.",
      en: 'Some pairs are neither direct nor inverse: height and age, a mark and a desk number.',
    },
  },
};

// ============================================================
// СЦЕНЫ УРОКА: школьный субботник. На хуке вопрос, в итоге ответ.
// ============================================================
const Painter = ({ x, ground, shirt = '#7ECBE6', hair = '#3E3128', roller = true }) => (
  <g>
    <Person x={x} ground={ground} head={11} shirt={shirt} hair={hair}/>
    {roller && (
      <g className="d19-roller">
        <path d={`M${x + 16} ${ground - 26} l10 -14`} stroke="#B08A57" strokeWidth="2.6" strokeLinecap="round"/>
        <rect x={x + 22} y={ground - 48} width="12" height="7" rx="2" fill="#8E8578"/>
      </g>
    )}
  </g>
);

const HookScene = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="d19sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F9F4EB"/><stop offset="100%" stopColor="#F1E8D8"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="400" height="154" fill="url(#d19sky)"/>

    {/* Школа вдалеке и дерево */}
    <g opacity="0.5">
      <rect x="16" y="30" width="70" height="46" rx="3" fill="#E5DAC6"/>
      <path d="M12 30 L51 12 L90 30 Z" fill="#D2A96F"/>
      <rect x="330" y="46" width="6" height="34" fill="#B08A57"/>
      <circle cx="333" cy="38" r="16" fill="#8FBF7F"/>
    </g>

    {/* Забор: часть покрашена, часть нет. Времени на сцене НЕТ */}
    <g>
      {Array.from({ length: 14 }, (_, i) => (
        <g key={i}>
          <rect x={104 + i * 15} y="52" width="11" height="66" rx="2"
            fill={i < 6 ? '#F5C77E' : '#E5DAC6'} stroke="#C9A472"/>
        </g>
      ))}
      <rect x="100" y="66" width="216" height="6" fill="#C9A472"/>
      <rect x="100" y="98" width="216" height="6" fill="#C9A472"/>
    </g>

    {/* Двое маляров у забора и двое подходящих */}
    <Painter x={124} ground={132} shirt="#7ECBE6"/>
    <Painter x={172} ground={132} shirt="#F5C77E" hair="#5A4636"/>
    <g className="d19-come" opacity="0.9">
      <Painter x={356} ground={132} shirt="#8FBF7F" hair="#3E3128" roller={false}/>
      <Painter x={384} ground={132} shirt="#D98A5A" hair="#5A4636" roller={false}/>
    </g>

    {/* Земля, вёдра с краской и кисти */}
    <rect x="0" y="132" width="400" height="22" fill="#D2A96F"/>
    <g>
      <path d="M40 118 h26 l-3 18 h-20 Z" fill="#8E8578"/>
      <path d="M40 118 q13 -8 26 0" fill="none" stroke="#8E8578" strokeWidth="2"/>
      <path d="M43 124 h20 l-2 10 h-16 Z" fill="#F5C77E" opacity="0.85"/>
    </g>
    <g>
      <path d="M74 136 l14 -10" stroke="#B08A57" strokeWidth="2.6" strokeLinecap="round"/>
      <path d="M86 128 l6 -5" stroke="#F5C77E" strokeWidth="5" strokeLinecap="round"/>
    </g>
  </svg>
);

// Итог: забор покрашен целиком, рядом две записи работы.
const FinalScene = () => (
  <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
    <rect x="0" y="0" width="400" height="92" fill="#F9F4EB"/>
    <g>
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={20 + i * 15} y="14" width="11" height="46" rx="2" fill="#F5C77E" stroke="#C9A472"/>
      ))}
      <rect x="16" y="24" width="184" height="5" fill="#C9A472"/>
      <rect x="16" y="46" width="184" height="5" fill="#C9A472"/>
    </g>
    <g fill="#1F7A4D" fontFamily="'JetBrains Mono', monospace" fontWeight="700">
      <text x="300" y="32" textAnchor="middle" fontSize="14">2 · 6 = 12</text>
      <text x="300" y="56" textAnchor="middle" fontSize="14">4 · 3 = 12</text>
    </g>
    <text x="300" y="80" textAnchor="middle" fill="#8A8883"
      fontFamily="'Manrope', system-ui, sans-serif" fontSize="11">2 h · 4</text>
  </svg>
);

// ============================================================
// БЛОКИ ЭКРАНОВ
// ============================================================
// Таблица двух величин: строки подписаны, ячейки читаются как пара.
const Table2 = ({ head, rows, markLast = false, size = 'mid' }) => (
  <span className={'d19-table d19-table-' + size}>
    {rows.map((r, i) => (
      <span key={i} className="d19-trow">
        <b>{head[i]}</b>
        {r.map((v, k) => (
          <i key={k} className={markLast && k === r.length - 1 ? 'ok' : ''}>{v}</i>
        ))}
      </span>
    ))}
  </span>
);

const Line = ({ node, on }) => (
  <span className={'d19-line d19-fade' + (on ? ' d19-on' : '')}>{mt(node)}</span>
);

const RecallBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_recall;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d19-stage">
        <Table2 head={['banka', 'm2']} rows={[[c.rows[0].a, c.rows[1].a], [c.rows[0].b, c.rows[1].b]]}
          markLast={step >= 1}/>
        <span className={'d19-fade' + (step >= 2 ? ' d19-on' : '')}>
          <b className="d19-res">2 : 30 = 4 : 60</b>
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

// Ядро: две таблицы рядом, у одной постоянно отношение, у другой произведение.
const CoreBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_core;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d19-stage">
        <span className="d19-two">
          <span className="d19-card d19-card-dir">
            <b>{t(c.direct.title)}</b>
            <Table2 head={['banka', 'm2']} rows={[[c.direct.rows[0][0], c.direct.rows[1][0]], [c.direct.rows[0][1], c.direct.rows[1][1]]]} size="sm"/>
          </span>
          <span className={'d19-card d19-card-inv d19-fade' + (step >= 1 ? ' d19-on' : '')}>
            <b>{t(c.inverse.title)}</b>
            <Table2 head={['kishi', 'soat']} rows={[[c.inverse.rows[0][0], c.inverse.rows[1][0]], [c.inverse.rows[0][1], c.inverse.rows[1][1]]]} size="sm"/>
          </span>
        </span>
        {c.lines.map((l, i) => <Line key={i} node={t(l)} on={step >= i + 1}/>)}
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
      <div className="frame fade-up delay-1 d19-stage">
        <Table2 head={['kishi', 'soat']} rows={[[2, 4], [6, step >= 2 ? 3 : '?']]} markLast={step >= 2}/>
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
      <div className="frame fade-up delay-1 d19-stage">
        <Table2 head={['kishi', 'kun']} rows={[[5, 6], [12, step >= 2 ? 10 : '?']]} markLast={step >= 2}/>
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

// Граница: пропорция там, где связь обратная; и связи может не быть.
const EdgeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_edge;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d19-stage">
        <span className="d19-pair d19-pair-bad"><Line node={t(c.bad_line)} on/></span>
        <span className={'d19-pair d19-pair-good d19-fade' + (step >= 1 ? ' d19-on' : '')}>
          <Line node={t(c.good_line)} on/>
        </span>
        <span className={'d19-pair d19-pair-warn d19-fade' + (step >= 2 ? ' d19-on' : '')}>
          <Line node={t(c.none_line)} on/>
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
        <div className={'d19-banner fade-up delay-1' + (phase === 'play' ? ' d19-banner-play' : '')}>
          {t(phase === 'demo' ? c.demo_banner : c.play_banner)}
        </div>

        <div className="frame fade-up delay-1 d19-stage d19-stage-tool">
          {phase === 'demo' ? (
            <>
              <Table2 head={['banka', 'm2']} rows={[[3, 5], [45, done ? 75 : '?']]} markLast={done} size="sm"/>
              {c.demo_lines.map((l, i) => <Line key={i} node={t(l)} on={shown >= i}/>)}
              <p className={'body d19-verdict' + (done ? ' d19-verdict-on' : '')}>{done ? t(c.demo_note) : ''}</p>
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
          <div className="d19-acts fade-up">
            <button className="d19-btn" disabled={!done} onClick={() => setShown(0)}>{t(c.again)}</button>
            <button className="d19-btn d19-btn-go" disabled={!done} onClick={toPlay}>{t(c.to_play)}</button>
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
      <div className="d19-stage">
        <span className="d19-two">
          <span className="d19-card d19-card-dir">
            <Table2 head={['banka', 'm2']} rows={[[2, 4], [30, 60]]} size="sm"/>
          </span>
          <span className="d19-card d19-card-inv">
            <Table2 head={['kishi', 'soat']} rows={[[2, 4], [6, 3]]} size="sm"/>
          </span>
        </span>
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

// Задача: забор. Первый вопрос про время, второй про краску.
const TaskFig = ({ idx }) => (
  <div className="d19-task-fig">
    {idx >= 1
      ? <Table2 head={['devor', 'banka']} rows={[[1, 2], [5, '?']]} size="sm"/>
      : <Table2 head={['kishi', 'soat']} rows={[[2, 4], [6, '?']]} size="sm"/>}
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
.d19-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(9px, 1.7vw, 14px); padding: clamp(12px, 2.4vw, 18px) !important; }
.d19-stage-tool { gap: clamp(4px, 0.8vw, 7px) !important; padding: clamp(7px, 1.5vw, 11px) !important; }
.d19-stage-tool .d19-line { font-size: clamp(12px, 2vw, 16px); }

/* Таблица двух величин */
.d19-table { display: flex; flex-direction: column; gap: 4px; }
.d19-trow { display: inline-flex; align-items: center; gap: 4px; }
.d19-trow b { min-width: clamp(34px, 7vw, 52px); font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(11px, 1.9vw, 14px); color: #8A8883; text-align: right; }
.d19-trow i { font-style: normal; display: grid; place-items: center; min-width: clamp(46px, 10vw, 76px); height: clamp(26px, 4.6vw, 36px); border-radius: 8px; background: #F7F0E2; border: 1px solid #E9E3D9; font-family: 'JetBrains Mono', monospace; font-size: clamp(13px, 2.4vw, 18px); font-weight: 700; color: #494550; transition: background-color 400ms linear; }
.d19-trow i.ok { background: #E3F0E8; border-color: #A9CFBA; color: #1F7A4D; }
.d19-table-sm .d19-trow i { min-width: clamp(34px, 7.4vw, 56px); height: clamp(22px, 4vw, 30px); font-size: clamp(11px, 2.1vw, 15px); }
.d19-table-sm .d19-trow b { min-width: clamp(28px, 6vw, 44px); font-size: clamp(10px, 1.8vw, 13px); }

/* Две карточки связи */
.d19-two { display: flex; gap: clamp(8px, 1.8vw, 14px); flex-wrap: wrap; justify-content: center; width: 100%; }
.d19-card { flex: 1 1 150px; display: flex; flex-direction: column; align-items: center; gap: 6px; padding: clamp(7px, 1.5vw, 11px); border-radius: 13px; }
.d19-card b { font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(11px, 2vw, 14px); font-weight: 600; color: #494550; }
.d19-card-dir { background: #E7F5FA; border: 1px solid #B6DCEA; }
.d19-card-inv { background: #FBF3D6; border: 1px solid #E4CE93; }

.d19-fade { opacity: 0; transition: opacity 420ms linear; }
.d19-on { opacity: 1; }
.d19-line { font-family: 'JetBrains Mono', monospace; font-size: clamp(12px, 2.2vw, 17px); font-weight: 700; color: #494550; }
.d19-res { font-family: 'JetBrains Mono', monospace; font-size: clamp(16px, 3vw, 23px); font-weight: 700; color: #1F7A4D; }

/* Строки экрана границы */
.d19-pair { width: 100%; padding: clamp(5px, 1.2vw, 9px); border-radius: 12px; text-align: center; }
.d19-pair-bad { background: #FFF1EC; border: 1px solid #F3C4B4; }
.d19-pair-good { background: #E3F0E8; border: 1px solid #A9CFBA; }
.d19-pair-warn { background: #FBF3D6; border: 1px solid #E4CE93; }

/* Задача */
.d19-task-fig { display: flex; justify-content: center; }

/* Экран 4 */
.d19-banner { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; font-size: clamp(13px, 2.2vw, 16px); font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 4px 11px; }
.d19-banner-play { color: #1F7A4D; background: #E3F0E8; }
.d19-verdict { margin: 0; min-height: 0; opacity: 0; transition: opacity 420ms linear; text-align: center; }
.d19-verdict-on { opacity: 1; }
.d19-acts { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.d19-btn { height: 36px; padding: 0 18px; border-radius: 12px; border: 1px solid #E9E3D9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(14px, 2.2vw, 16px); font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.d19-btn:disabled { opacity: 0.45; cursor: default; }
.d19-btn-go { border-color: #FF4F28; color: #FF4F28; }
.d19-btn-go:hover:not(:disabled) { background: #FFE8E1; }

/* Движение сцены: валик красит, двое подходят */
.d19-roller { transform-origin: center bottom; animation: d19Roll 2600ms ease-in-out infinite; }
@keyframes d19Roll { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
.d19-come { animation: d19Come 6000ms ease-in-out infinite; }
@keyframes d19Come { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(-18px); } }
@media (prefers-reduced-motion: reduce) { .d19-roller, .d19-come { animation: none; } }

@media (max-width: 639.98px) {
  .d19-trow i { min-width: 44px; height: 24px; font-size: 12px; }
  .d19-table-sm .d19-trow i { min-width: 32px; height: 21px; font-size: 11px; }
}
`;

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function ProportionalityLesson({
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
