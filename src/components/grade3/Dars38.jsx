import React from 'react';
import { AncientHallBg, BitSVG, HALL_SLAB, LUMO_CAST, createLesson } from './_kit/index.jsx';
import { LESSON_STYLES } from './_kit/styles.js';

// ============================================================================
// DD 3-SINF | Dars38 — "Blok masalalari" (num-3-38) | Б5 «KRISTALL ARXITEKTURA»
// Syujet: kristall kvartal davom etadi (SYUJET_3SINF.md 194-satr, reja 42-satr).
// SAHNA: 8-DARS zali kitdan (`AncientHallBg`), markazda darsning tuguni — qurilish loyihasi.
// DARSLIK ASOSI (Burxonov, 3-sinf, «Sharq» 2019, 162-bet, masalalar).
// YADRO: masalaning SAVOLI kattalikni tanlaydi. Plitka polga — yuza; lenta yoki panjara
//   chekkaga — perimetr. Ikki amalli masalada birinchi amal ikkinchisiga tayyorlaydi.
// Misconception: M1 yuza kerak joyda perimetr olish; M2 birinchi amalda to'xtab qolish;
//   M3 javobda birlikni yo'qotish; M4 yuzani uchta tomon bilan hisoblash.
// FactCard: ustalar plitkani zaxira bilan oladi — kesim va siniqqa taxminan o'ndan bir qism.
// Bu dars MA'LUMOT fayli: ekranlar va mexanika kitda (`createLesson`).
// ============================================================================
const TOTAL_SCREENS = 15;
const LESSON_META = {
  lessonId: 'num-3-38',
  lessonTitle: { ru: 'Урок 38. Задачи блока', uz: '38-dars. Blok masalalari' }
};
// STRUKTURA: s0 xuk savol kattalikni tanlaydi · s1 masala qadamlari · s2 bitta shakl, ikki
// kattalik · s3 QOIDA savolga qarab tanlash · s4 chizma bo'yicha savol · s5 saralash savollar ·
// s6 test qaysi amal · s7 konsol ikki qadam · s8 xatoni top (birinchi qadamda to'xtash) ·
// s9 Bit tuzog'i (uch tomon) · s10 trenajyor plitka · s11 trenajyor panjara · s12 masala ikki
// amal · s13 final 3 topshiriq + FactCard · s14 yakun.
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'MCScreen', scored: false, scope: 'hook' },
  { id: 's1',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's5',  type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's6',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's7',  type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's9',  type: 'exploration', template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's10', type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's11', type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's12', type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's13', type: 'test',        template: 'custom',   scored: true,  scope: 'diagnostic' },
  { id: 's14', type: 'summary',     template: 'custom',   scored: false, scope: null }
];

const CONTENT = {
  // s0 — XUK: bitta xona, ikki xil savol.
  s0: {
    eyebrow: { ru: 'Крючок', uz: 'Qiziqtirish' },
    topic: { ru: 'Задачи блока', uz: 'Blok masalalari' },
    lead: { ru: 'Комната 4 на 5 м. Нужна плитка на пол', uz: "Xona 4 ga 5 m. Polga plitka kerak" },
    order_cap: { ru: 'что здесь считать', uz: 'bu yerda nimani hisoblash kerak' },
    q: { ru: 'Что нужно найти для плитки?', uz: 'Plitka uchun nimani topish kerak?' },
    opt0: { ru: 'площадь', uz: 'yuza' },
    opt1: { ru: 'периметр', uz: 'perimetr' },
    opt2: { ru: 'длину стены', uz: 'devor uzunligini' },
    opt3: { ru: 'сумму сторон', uz: "tomonlar yig'indisini" },
    audio: {
      intro: {
        ru: [
          'Площадь и периметр ты находишь, сравнивать умеешь. Осталось главное.',
          'Комната четыре на пять метров. Нужно закрыть пол плиткой.',
          'В задаче всегда есть вопрос, и он подсказывает, какую величину искать.',
          'Как думаешь, что нужно найти для плитки?'
        ],
        uz: [
          "Yuza va perimetrni topa olasiz, solishtirishni ham bilasiz. Asosiysi qoldi.",
          "Xona to'rt ga besh metr. Polni plitka bilan yopish kerak.",
          "Masalada har doim savol bo'ladi va u qaysi kattalikni izlashni aytadi.",
          "Sizningcha, plitka uchun nimani topish kerak?"
        ]
      },
      on_correct: { ru: 'Верно! Пол это поверхность, а её меряют площадью.', uz: "To'g'ri! Pol bu yuza, u yuza bilan o'lchanadi." },
      on_wrong1: { ru: 'Периметр это путь по краю. Им считают ограду или ленту, а не пол.', uz: "Perimetr bu chekka yo'li. U bilan panjara yoki lenta hisoblanadi, pol emas." },
      on_wrong2: { ru: 'Одна стена не покроет пол. Нужны обе стороны.', uz: "Bitta devor polni qoplamaydi. Ikkala tomon kerak." },
      on_idk: { ru: 'Ничего. Сейчас разберём задачу по шагам.', uz: "Hechqisi yo'q. Hozir masalani qadamlab ko'ramiz." }
    }
  },

  // s1 — MODEL: masalaning qadamlari.
  s1: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil' },
    lead: { ru: 'Разберём задачу по шагам', uz: 'Masalani qadamlab tahlil qilamiz' },
    task_line: 'комната 4 на 5 м, плитка 1 м²',
    task_line_uz: "xona 4 ga 5 m, plitka 1 m²",
    step1: '4 · 5 = 20',
    step1_cap: { ru: 'площадь пола, м²', uz: 'pol yuzasi, m²' },
    step2: '20 плиток',
    step2_cap: { ru: 'плитка 1 м², значит столько же', uz: "plitka 1 m², demak shuncha" },
    res: 'ответ 20 плиток',
    btn1: { ru: 'Найти площадь', uz: 'Yuzani topish' },
    btn2: { ru: 'Ответить на вопрос', uz: 'Savolga javob berish' },
    done_text: { ru: 'Двадцать плиток. Сначала нашли площадь, потом ответили на вопрос.', uz: "Yigirmata plitka. Avval yuzani topdik, keyin savolga javob berdik." },
    audio: {
      ru: [
        'Разберём задачу по шагам.',
        'Сначала находим площадь пола. Четыре умножить на пять, двадцать квадратных метров.',
        'Каждая плитка закрывает один квадратный метр, значит плиток нужно двадцать. Первый шаг подготовил ответ, но ответом ещё не был.'
      ],
      uz: [
        "Masalani qadamlab tahlil qilamiz.",
        "Avval pol yuzasini topamiz. To'rtni beshga ko'paytiramiz, yigirma kvadrat metr.",
        "Har bir plitka bir kvadrat metrni yopadi, demak plitka yigirmata kerak. Birinchi qadam javobni tayyorladi, lekin javobning o'zi emas edi."
      ]
    }
  },

  // s2 — MODEL: bitta xona — ikki savol, ikki kattalik.
  s2: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil' },
    w: 4,
    h: 5,
    lead: { ru: 'Одна комната, два разных вопроса', uz: 'Bitta xona, ikki xil savol' },
    capA: { ru: 'плитка на пол: 4 · 5 = 20', uz: 'polga plitka: 4 · 5 = 20' },
    capB: { ru: 'лента по краю: (4 + 5) · 2 = 18', uz: "chekkaga lenta: (4 + 5) · 2 = 18" },
    res: 'вопрос решает',
    btn1: { ru: 'Спросить про пол', uz: "Pol haqida so'rash" },
    btn2: { ru: 'Спросить про край', uz: "Chekka haqida so'rash" },
    done_text: { ru: 'Комната одна, а числа разные, потому что вопросы разные.', uz: "Xona bitta, sonlar esa har xil, chunki savollar har xil." },
    audio: {
      ru: [
        'Комната та же самая. Посмотрим, что меняет вопрос.',
        'Спросили про пол, считаем площадь. Двадцать квадратных метров.',
        'Спросили про край, считаем периметр. Восемнадцать метров. Комната одна, а ответы разные.'
      ],
      uz: [
        "Xona o'sha-o'sha. Savol nimani o'zgartirishini ko'ramiz.",
        "Pol haqida so'rashdi, yuzani hisoblaymiz. Yigirma kvadrat metr.",
        "Chekka haqida so'rashdi, perimetrni hisoblaymiz. O'n sakkiz metr. Xona bitta, javoblar esa har xil."
      ]
    }
  },

  // s3 — QOIDA: savol kattalikni tanlaydi.
  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    q: { ru: 'Задача: сколько метров ограды вокруг сада? Что считаем?', uz: "Masala: bog' atrofiga necha metr panjara kerak? Nimani hisoblaymiz?" },
    opts: [
      { ru: 'периметр', uz: 'perimetr' },
      { ru: 'площадь', uz: 'yuza' },
      { ru: 'одну сторону', uz: 'bitta tomonni' },
      { ru: 'площадь и периметр', uz: 'yuza va perimetrni' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Площадь это то, что внутри. Ограда идёт по краю.', uz: "Yuza bu ichkaridagi narsa. Panjara chekka bo'ylab boradi." },
      2: { ru: 'Одной стороны мало, ограда обходит весь сад.', uz: "Bitta tomon kam, panjara butun bog'ni aylanadi." },
      3: { ru: 'Спрашивают только про ограду, площадь тут не нужна.', uz: "Faqat panjara so'ralgan, yuza bu yerda kerak emas." }
    },
    on_correct: { ru: 'Верно. Ограда идёт по краю, значит периметр.', uz: "To'g'ri. Panjara chekka bo'ylab boradi, demak perimetr." },
    rule_lines: {
      ru: ['вопрос выбирает величину', 'внутри — площадь, по краю — периметр', 'в ответе пишут единицу'],
      uz: ["savol kattalikni tanlaydi", "ichkarida yuza, chekkada perimetr", "javobda birlik yoziladi"]
    },
    rule_ex: 'пол → S, ограда → P',
    rule_speech: { ru: 'Вопрос задачи выбирает величину. Если речь о том, что внутри, о поле или о плитке, считают площадь. Если речь о том, что идёт по краю, об ограде или ленте, считают периметр.', uz: "Masalaning savoli kattalikni tanlaydi. Gap ichkaridagi narsa haqida bo'lsa, pol yoki plitka haqida, yuza hisoblanadi. Gap chekka bo'ylab boradigan narsa haqida bo'lsa, panjara yoki lenta haqida, perimetr hisoblanadi." },
    audio: {
      intro: { ru: 'Соберём правило. Мы увидели, что одна комната даёт разные ответы.', uz: "Qoidani yig'amiz. Bitta xona har xil javob berishini ko'rdik." }
    }
  },

  // s4 — CHIZMA: 6 ga 3 xona, plitka.
  s4: {
    eyebrow: { ru: 'Чертёж', uz: 'Chizma' },
    q: { ru: 'Комната 6 на 3 м. Сколько плиток по 1 м² нужно на пол?', uz: "Xona 6 ga 3 m. Polga 1 m² dan nechta plitka kerak?" },
    fig_w: 6,
    fig_h: 3,
    opts: [
      { ru: '18', uz: '18' },
      { ru: '18 м', uz: '18 m' },
      { ru: '9', uz: '9' },
      { ru: '12', uz: '12' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Число верное, но метры это длина. Плитки считают штуками.', uz: "Son to'g'ri, lekin metr bu uzunlik. Plitka dona bilan sanaladi." },
      2: { ru: 'Девять это половина. Посчитай все ряды.', uz: "To'qqiz bu yarmi. Hamma qatorni sanang." },
      3: { ru: 'Двенадцать это край комнаты, а спрашивают про пол.', uz: "O'n ikki bu xona chekkasi, so'ralgani esa pol." }
    },
    audio: {
      intro: { ru: 'Посмотри на чертёж. Комната шесть на три метра, плитка метр на метр. Сколько плиток?', uz: "Chizmaga qarang. Xona olti ga uch metr, plitka metr ga metr. Nechta plitka kerak?" },
      on_correct: { ru: 'Верно. Восемнадцать плиток.', uz: "To'g'ri. O'n sakkizta plitka." },
      on_wrong: { ru: 'Пол это площадь. Умножай стороны.', uz: "Pol bu yuza. Tomonlarni ko'paytiring." }
    }
  },

  // s5 — SARALASH: savollarni kattalik bo'yicha ajratish.
  s5: {
    eyebrow: { ru: 'Сортировка', uz: 'Saralash' },
    lead: { ru: 'Разложи вопросы задач по величинам', uz: 'Masala savollarini kattaliklarga ajrating' },
    bin_a: { ru: 'периметр', uz: 'perimetr' },
    bin_b: { ru: 'площадь', uz: 'yuza' },
    items: [
      { n: { ru: 'сколько ленты по краю', uz: "chekkaga necha metr lenta" }, a: true, hint: { ru: 'Лента идёт по краю.', uz: "Lenta chekka bo'ylab boradi." } },
      { n: { ru: 'сколько краски на пол', uz: 'polga qancha bo\'yoq' }, a: false, hint: { ru: 'Краска ложится на поверхность.', uz: "Bo'yoq yuzaga yotadi." } },
      { n: { ru: 'сколько метров забора', uz: 'necha metr panjara' }, a: true, hint: { ru: 'Забор обходит участок.', uz: "Panjara maydonni aylanadi." } },
      { n: { ru: 'сколько плиток на пол', uz: 'polga nechta plitka' }, a: false, hint: { ru: 'Плитка закрывает поверхность.', uz: "Plitka yuzani yopadi." } }
    ],
    audio: {
      intro: { ru: 'Четыре вопроса из разных задач. Отправь каждый к своей величине.', uz: "Har xil masaladan to'rtta savol. Har birini o'z kattaligiga yuboring." },
      on_correct: { ru: 'Всё на месте. Что идёт по краю, то периметр, что закрывает поверхность, то площадь.', uz: "Hammasi joyida. Chekka bo'ylab boradigani perimetr, yuzani yopadigani yuza." },
      on_wrong: { ru: 'Спроси себя, идёт это по краю или закрывает поверхность.', uz: "O'zingizdan so'rang, bu chekka bo'ylab boradimi yoki yuzani yopadimi." }
    }
  },

  // s6 — TEST: qaysi amal birinchi.
  s6: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv' },
    q: { ru: 'Зал 8 на 5 м. Сколько плиток по 1 м² останется, если привезли 50?', uz: "Zal 8 ga 5 m. 50 ta keltirilgan bo'lsa, 1 m² dan nechta plitka ortadi?" },
    opts: [
      { ru: 'сначала 8 · 5', uz: 'avval 8 · 5' },
      { ru: 'сначала 50 − 8', uz: 'avval 50 − 8' },
      { ru: 'сначала (8 + 5) · 2', uz: 'avval (8 + 5) · 2' },
      { ru: 'сначала 50 : 8', uz: 'avval 50 : 8' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Из пятидесяти вычитать рано. Мы ещё не знаем, сколько уйдёт.', uz: "Ellikdan ayirish erta. Qancha ketishini hali bilmaymiz." },
      2: { ru: 'Это край зала, а плитку кладут на пол.', uz: "Bu zal chekkasi, plitka esa polga yotqiziladi." },
      3: { ru: 'Делить тут нечего, плитки считают по площади.', uz: "Bu yerda bo'ladigan narsa yo'q, plitka yuza bo'yicha sanaladi." }
    },
    audio: {
      intro: { ru: 'Быстрый вопрос. Зал восемь на пять, привезли пятьдесят плиток. С какого действия начать?', uz: "Tez savol. Zal sakkiz ga besh, ellikta plitka keltirilgan. Qaysi amaldan boshlash kerak?" },
      on_correct: { ru: 'Верно. Сначала узнаём, сколько нужно, потом сравниваем с привезённым.', uz: "To'g'ri. Avval qancha kerakligini bilamiz, keyin keltirilgani bilan solishtiramiz." },
      on_wrong: { ru: 'Первый шаг всегда отвечает на вопрос, сколько нужно.', uz: "Birinchi qadam har doim qancha kerak degan savolga javob beradi." }
    }
  },

  // s7 — KONSOL: ikki qadamli masala.
  s7: {
    eyebrow: { ru: 'Консоль', uz: 'Konsol' },
    lead: { ru: 'Зал 8 на 5 м, привезли 50 плиток по 1 м²', uz: "Zal 8 ga 5 m, 1 m² dan 50 ta plitka keltirildi" },
    swap_line: 'зал 8 на 5',
    cells: [
      { head: { ru: 'нужно плиток', uz: 'plitka kerak' }, label: '8 · 5', ans: 40, hint: { ru: 'Это площадь пола.', uz: 'Bu pol yuzasi.' } },
      { head: { ru: 'привезли', uz: 'keltirildi' }, label: 'штук', ans: 50, hint: { ru: 'Это число дано в условии.', uz: 'Bu son shartda berilgan.' } },
      { head: { ru: 'останется', uz: 'ortadi' }, label: '50 − 40', ans: 10, hint: { ru: 'Из привезённого вычти нужное.', uz: 'Keltirilganidan keraklisini ayiring.' } }
    ],
    check: '40 нужно, 10 останется',
    check_label: { ru: 'два действия', uz: 'ikki amal' },
    audio: {
      intro: { ru: 'Заполни три окна. Сколько нужно, сколько привезли и сколько останется.', uz: "Uchta oynani to'ldiring. Qancha kerak, qancha keltirilgan va qancha ortadi." },
      on_correct: { ru: 'Нужно сорок, привезли пятьдесят, останется десять. Первое действие подготовило второе.', uz: "Qirq kerak, ellik keltirilgan, o'nta ortadi. Birinchi amal ikkinchisini tayyorladi." }
    }
  },

  // s8 — XATONI TOP: birinchi qadamda to'xtab qolish (M2).
  s8: {
    eyebrow: { ru: 'Найди ошибку', uz: 'Xatoni toping' },
    q: { ru: 'Спросили, сколько плиток останется. Записали в ответ 40. Где ошибка?', uz: "Nechta plitka ortadi deb so'rashdi. Javobga 40 yozilibdi. Xato qayerda?" },
    fig_line: '8 · 5 = 40',
    opts: [
      { ru: 'остановились на первом шаге', uz: "birinchi qadamda to'xtab qolishgan" },
      { ru: 'ошибки нет', uz: "xato yo'q" },
      { ru: 'неверно умножили', uz: "noto'g'ri ko'paytirilgan" },
      { ru: 'взяли не те стороны', uz: "tomonlar noto'g'ri olingan" }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Сорок это сколько нужно, а спрашивали, сколько останется.', uz: "Qirq bu qancha kerakligi, so'ralgani esa qancha ortishi." },
      2: { ru: 'Умножили верно, восемь на пять это сорок.', uz: "To'g'ri ko'paytirilgan, sakkiz ga besh qirq." },
      3: { ru: 'Стороны те самые, восемь и пять.', uz: "Tomonlar o'sha, sakkiz va besh." }
    },
    audio: {
      intro: { ru: 'Кто-то посчитал сорок и записал это в ответ. Найди ошибку.', uz: "Kimdir qirqni hisoblab, javobga yozibdi. Xatoni toping." },
      on_correct: { ru: 'Верно. Первое действие только подготовило ответ. Нужно ещё вычесть.', uz: "To'g'ri. Birinchi amal faqat javobni tayyorladi. Yana ayirish kerak." },
      on_wrong: { ru: 'Перечитай вопрос задачи и посмотри, на что отвечает число сорок.', uz: "Masala savolini qayta o'qing va qirq soni nimaga javob berishiga qarang." }
    }
  },

  // s9 — BIT TUZOG'I: yuzani uch tomon bilan hisoblash (M4).
  s9: {
    eyebrow: { ru: 'Ловушка Бита', uz: "Bit tuzog'i" },
    lead: { ru: 'Бит считает пол склада', uz: 'Bit ombor polini hisoblayapti' },
    lines: ['склад 6 на 4 м', 'Бит: 6 + 4 + 6 = 16 м² пола'],
    lines_uz: ["ombor 6 ga 4 m", "Bit: 6 + 4 + 6 = 16 m² pol"],
    line_cap: { ru: 'Бит: сложил три стороны', uz: "Bit: uchta tomonni qo'shdim" },
    trap_label: { ru: 'Так ли это?', uz: 'Shundaymi?' },
    trap_opts: { ru: ['нет, пол считают умножением', 'да, всё верно'], uz: ["yo'q, pol ko'paytirish bilan hisoblanadi", 'ha, hammasi to\'g\'ri'] },
    trap_ci: 0,
    trap_correct: { ru: 'Да. Сложение сторон даёт длину, а не поверхность. Пол это шесть рядов по четыре, то есть двадцать четыре квадратных метра.', uz: "Ha. Tomonlarni qo'shish uzunlik beradi, yuzani emas. Pol bu to'rttadan olti qator, ya'ni yigirma to'rt kvadrat metr." },
    trap_wrong: { ru: 'Посмотри на единицы. Складывая метры, метры и получишь, а пол меряют квадратными.', uz: "Birliklarga qarang. Metrni qo'shsangiz metr chiqadi, pol esa kvadrat bilan o'lchanadi." },
    audio: {
      ru: [
        'Бит считает пол склада.',
        'Шесть плюс четыре плюс шесть, шестнадцать квадратных метров пола.',
        'Так ли это?'
      ],
      uz: [
        "Bit ombor polini hisoblayapti.",
        "Olti qo'shuv to'rt qo'shuv olti, o'n olti kvadrat metr pol.",
        "Shundaymi?"
      ]
    }
  },

  // s10 — TRENAJYOR: plitka.
  s10: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq' },
    q: { ru: 'Комната 7 на 4 м. Сколько плиток по 1 м² нужно на пол?', uz: "Xona 7 ga 4 m. Polga 1 m² dan nechta plitka kerak?" },
    ans: 28,
    check: '7 · 4',
    check_label: { ru: 'пол это площадь', uz: 'pol bu yuza' },
    hint: { ru: 'Семь умножь на четыре.', uz: "Yettini to'rtga ko'paytiring." },
    audio: {
      intro: { ru: 'Теперь считай сам. Комната семь на четыре, сколько плиток?', uz: "Endi o'zingiz hisoblang. Xona yetti ga to'rt, nechta plitka kerak?" },
      on_correct: { ru: 'Двадцать восемь плиток.', uz: "Yigirma sakkizta plitka." }
    }
  },

  // s11 — TRENAJYOR: panjara.
  s11: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq' },
    q: { ru: 'Сад 7 на 4 м. Сколько метров забора нужно вокруг?', uz: "Bog' 7 ga 4 m. Atrofiga necha metr panjara kerak?" },
    ans: 22,
    check: '(7 + 4) · 2',
    check_label: { ru: 'забор идёт по краю', uz: "panjara chekka bo'ylab boradi" },
    hint: { ru: 'Сложи семь и четыре, потом удвой.', uz: "Yetti va to'rtni qo'shib, keyin ikkilantiring." },
    audio: {
      intro: { ru: 'Тот же участок, другой вопрос. Сколько метров забора нужно вокруг сада?', uz: "O'sha maydon, boshqa savol. Bog' atrofiga necha metr panjara kerak?" },
      on_correct: { ru: 'Двадцать два метра. Участок один, а величина другая.', uz: "Yigirma ikki metr. Maydon bitta, kattalik esa boshqa." }
    }
  },

  // s12 — MASALA: ikki amal, ortgan plitka.
  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    lead: { ru: 'Кристальная мастерская', uz: 'Kristall ustaxona' },
    q: { ru: 'Пол мастерской 9 на 3 м. Привезли 30 плиток по 1 м². Хватит ли и сколько останется?', uz: "Ustaxona poli 9 ga 3 m. 1 m² dan 30 ta plitka keltirildi. Yetadimi va qancha ortadi?" },
    q_speech: { ru: 'пол мастерской девять на три метра, привезли тридцать плиток. Хватит ли и сколько останется?', uz: "ustaxona poli to'qqiz ga uch metr, o'ttizta plitka keltirildi. Yetadimi va qancha ortadi?" },
    tbl_heads: [
      { ru: 'пол', uz: 'pol' },
      { ru: 'привезли', uz: 'keltirildi' },
      { ru: 'вопрос', uz: 'savol' }
    ],
    tbl_cells: ['9 · 3', '30', '?'],
    pick_label: { ru: 'С какого действия начинаем?', uz: 'Qaysi amaldan boshlaymiz?' },
    opts: [
      { ru: '9 · 3', uz: '9 · 3' },
      { ru: '30 − 9', uz: '30 − 9' },
      { ru: '(9 + 3) · 2', uz: '(9 + 3) · 2' },
      { ru: '30 : 3', uz: '30 : 3' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Вычитать рано. Сколько уйдёт, ещё не знаем.', uz: "Ayirish erta. Qancha ketishini hali bilmaymiz." },
      2: { ru: 'Это край мастерской, а плитку кладут на пол.', uz: "Bu ustaxona chekkasi, plitka esa polga yotqiziladi." },
      3: { ru: 'Делением тут ничего не найти.', uz: "Bo'lish bilan bu yerda hech nima topilmaydi." }
    },
    pick_ok: { ru: 'Верно. Сначала пол, потом остаток.', uz: "To'g'ri. Avval pol, keyin qoldiq." },
    step1_q: { ru: 'Сколько плиток нужно на пол?', uz: 'Polga nechta plitka kerak?' },
    ans1: 27,
    hint1: { ru: 'Девять умножь на три.', uz: "To'qqizni uchga ko'paytiring." },
    step2_q: { ru: 'Сколько плиток останется?', uz: 'Nechta plitka ortadi?' },
    ans2: 3,
    hint2: { ru: 'Из тридцати вычти двадцать семь.', uz: "O'ttizdan yigirma yettini ayiring." },
    check: '27 нужно, 3 останется',
    setup_audio: { ru: 'Мастерскую готовят к работе. Посмотри на таблицу и реши, с чего начать.', uz: "Ustaxona ishga tayyorlanmoqda. Jadvalga qarang va nimadan boshlashni hal qiling." },
    audio: {
      intro: { ru: 'Пол мастерской девять на три метра, привезли тридцать плиток. Хватит ли и сколько останется?', uz: "Ustaxona poli to'qqiz ga uch metr, o'ttizta plitka keltirildi. Yetadimi va qancha ortadi?" },
      on_correct: { ru: 'Нужно двадцать семь, значит хватит, и останется три плитки.', uz: "Yigirma yetti kerak, demak yetadi va uchta plitka ortadi." },
      on_wrong: { ru: 'Первое действие показывает, сколько нужно. Второе отвечает на вопрос.', uz: "Birinchi amal qancha kerakligini ko'rsatadi. Ikkinchisi savolga javob beradi." }
    }
  },

  // s13 — FINAL: uchta topshiriq + FaktCard.
  s13: {
    eyebrow: { ru: 'Финал', uz: 'Yakuniy' },
    intro_line: { ru: 'Три задания. Читай вопрос до конца', uz: "Uchta topshiriq. Savolni oxirigacha o'qing" },
    items: [
      {
        kind: 'num',
        q: { ru: 'Комната 5 на 6 м. Сколько плиток по 1 м² нужно?', uz: "Xona 5 ga 6 m. 1 m² dan nechta plitka kerak?" },
        q_speech: { ru: 'комната пять на шесть метров. Сколько плиток нужно?', uz: "xona besh ga olti metr. Nechta plitka kerak?" },
        ans: 30,
        hint: { ru: 'Пол это площадь, умножай стороны.', uz: "Pol bu yuza, tomonlarni ko'paytiring." }
      },
      {
        kind: 'num',
        q: { ru: 'Вокруг того же пола кладут ленту. Сколько метров ленты?', uz: "O'sha pol atrofiga lenta yotqiziladi. Necha metr lenta kerak?" },
        q_speech: { ru: 'вокруг того же пола кладут ленту. Сколько метров ленты нужно?', uz: "o'sha pol atrofiga lenta yotqiziladi. Necha metr lenta kerak?" },
        ans: 22,
        hint: { ru: 'Лента по краю, значит периметр.', uz: "Lenta chekka bo'ylab, demak perimetr." }
      },
      {
        kind: 'num',
        q: { ru: 'Привезли 36 плиток, на пол ушло 30. Сколько осталось?', uz: "36 ta plitka keltirildi, polga 30 tasi ketdi. Nechtasi qoldi?" },
        q_speech: { ru: 'привезли тридцать шесть плиток, на пол ушло тридцать. Сколько осталось?', uz: "o'ttiz oltita plitka keltirildi, polga o'ttiztasi ketdi. Nechtasi qoldi?" },
        ans: 6,
        hint: { ru: 'Из привезённого вычти то, что ушло.', uz: 'Keltirilganidan ketganini ayiring.' }
      }
    ],
    fact_badge: { ru: 'Знаешь ли ты?', uz: 'Bilasizmi?' },
    fact_text: {
      ru: 'Мастера всегда берут плитку с запасом, примерно на десятую часть больше. Часть плиток приходится резать по краям комнаты, а обрезки уже никуда не положишь. Поэтому расчёт площади это только начало разговора со складом.',
      uz: "Ustalar plitkani doim zaxira bilan oladi, taxminan o'ndan bir qism ko'p. Bir qism plitkani xona chekkasida kesishga to'g'ri keladi, kesim esa endi hech qayerga yotmaydi. Shuning uchun yuzani hisoblash ombor bilan suhbatning boshi xolos."
    },
    fact_audio: {
      ru: 'Вот что важно знать. Мастера всегда заказывают плитку с запасом, примерно на десятую часть больше, чем вышло по расчёту. Дело в том, что у стен плитки почти никогда не ложатся целыми, их приходится резать. Отрезанный кусок уже редко подходит куда-то ещё. Так что площадь пола это только начало разговора, а окончательное число всегда чуть больше.',
      uz: "Mana nimani bilish muhim. Ustalar plitkani doim zaxira bilan buyuradi, hisobdan taxminan o'ndan bir qism ko'p. Gap shundaki, devor oldida plitka deyarli hech qachon butun yotmaydi, uni kesishga to'g'ri keladi. Kesilgan bo'lak esa boshqa joyga kamdan-kam to'g'ri keladi. Shunday qilib pol yuzasi suhbatning boshi xolos, oxirgi son esa har doim sal ko'proq."
    },
    audio: {
      intro: { ru: 'Три задания напоследок. Каждый раз дочитывай вопрос до конца.', uz: "Oxirida uchta topshiriq. Har safar savolni oxirigacha o'qing." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Посмотри, о чём именно спрашивают.', uz: "Aynan nima so'ralganiga qarang." }
    }
  },

  // s14 — YAKUN: keyingisi uchburchak turlari (reja 43-satr).
  s14: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    mission_done: { ru: 'Мастерская готова!', uz: 'Ustaxona tayyor!' },
    cando: {
      ru: ['выбираю величину по вопросу задачи', 'довожу задачу до второго действия', 'пишу единицу в ответе'],
      uz: ["masala savoliga qarab kattalikni tanlayman", "masalani ikkinchi amalgacha yetkazaman", "javobda birlikni yozaman"]
    },
    rule_recap: { ru: 'Вопрос задачи выбирает величину: внутри это площадь, по краю это периметр.', uz: "Masala savoli kattalikni tanlaydi: ichkarida yuza, chekkada perimetr." },
    conn_label_refs: { ru: 'опирается на', uz: 'nimaga tayanadi' },
    conn_refs: { ru: 'урок 37: сравнение по мерке; урок 23: задачи в два действия', uz: "37-dars: o'lchov bo'yicha solishtirish; 23-dars: ikki amalli masalalar" },
    conn_label_next: { ru: 'дальше', uz: 'keyin' },
    conn_next: { ru: 'виды треугольников и прямые на чертеже', uz: 'uchburchak turlari va chizmadagi to\'g\'ri chiziqlar' },
    audio: {
      ru: 'Мастерская готова. Запомни главное. В задаче сначала читают вопрос, и он говорит, что искать. Если речь о том, что внутри, о поле, о плитке, о краске, ищут площадь. Если речь о том, что идёт по краю, об ограде, о ленте, ищут периметр. И почти всегда первое действие только готовит ответ, а отвечает второе. В следующий раз отложим счёт и посмотрим на сами фигуры!',
      uz: "Ustaxona tayyor. Asosiysini eslab qoling. Masalada avval savol o'qiladi, u nimani izlashni aytadi. Gap ichkaridagi narsa haqida bo'lsa, pol, plitka, bo'yoq haqida, yuza izlanadi. Gap chekka bo'ylab boradigan narsa haqida bo'lsa, panjara, lenta haqida, perimetr izlanadi. Va deyarli har doim birinchi amal faqat javobni tayyorlaydi, javobni esa ikkinchisi beradi. Keyingi safar hisobni qo'yib turib, shakllarning o'ziga qaraymiz!"
    }
  }
};

const BRIDGES = {
  s1:  { ru: 'Разберём по шагам.', uz: 'Qadamlab tahlil qilamiz.' },
  s2:  { ru: 'Теперь другой вопрос.', uz: 'Endi boshqa savol.' },
  s3:  { ru: "Соберём это в правило.", uz: "Buni qoidaga yig'amiz." },
  s4:  { ru: 'Прочитай чертёж.', uz: "Chizmani o'qing." },
  s5:  { ru: 'Разложи вопросы.', uz: 'Savollarni ajrating.' },
  s6:  { ru: 'Быстрый вопрос.', uz: 'Tez savol.' },
  s7:  { ru: 'Заполни консоль.', uz: "Konsolni to'ldiring." },
  s8:  { ru: 'Тут ответили слишком рано.', uz: 'Bu yerda juda erta javob berilibdi.' },
  s9:  { ru: 'А вот и Бит со своим счётом.', uz: "Mana Bit ham o'z hisobi bilan." },
  s10: { ru: 'Теперь считай сам.', uz: "Endi o'zingiz hisoblang." },
  s11: { ru: 'Тот же участок, другой вопрос.', uz: "O'sha maydon, boshqa savol." },
  s12: { ru: 'Задача от мастеров.', uz: 'Ustalardan masala.' },
  s13: { ru: 'Финальная проверка.', uz: 'Yakuniy tekshiruv.' },
  s14: { ru: 'Подведём итог.', uz: 'Yakun yasaymiz.' }
};

const S14_PAYOFF = {
  ru: 'Мастерская готова. Вопрос задачи всегда подсказывал, что искать.',
  uz: "Ustaxona tayyor. Masala savoli har doim nimani izlashni aytdi."
};

// --- ZAL TAXTASI (D38): markazda qurilish loyihasi — xona rejasi, polda plitka to'ri,
// chekkada lenta chizig'i. Ikki javob yonma-yon turadi: ichkarisi va cheti.
const ProjectNodeLayer = () => (
  <svg className="lm-scene-bg" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <path d="M150 158 h100 l8 18 h-116 Z" fill="#B49A6E"/>
    <rect x={HALL_SLAB.x} y={HALL_SLAB.y} width={HALL_SLAB.w} height={HALL_SLAB.h} rx="5" fill="#E4D3AC" stroke="#8A7550" strokeWidth="2"/>
    <rect x="130" y="99" width="140" height="11" rx="2" fill="#C6AE7E"/>
    <text x="200" y="107.5" textAnchor="middle" fontSize="7" letterSpacing="2" fill="#6B5636" fontFamily="'JetBrains Mono', monospace">LOYIHA</text>
    <g transform="translate(136 116)">
      {Array.from({ length: 4 }).map((_, r) => (
        Array.from({ length: 5 }).map((_, c) => (
          <rect key={`${r}-${c}`} x={c * 9} y={r * 9} width="9" height="9" fill={(r + c) % 2 ? '#DCEBF5' : '#EAF4FA'} stroke="#7FA8BF" strokeWidth="0.6"/>
        ))
      ))}
      <rect x="0" y="0" width="45" height="36" fill="none" stroke="#C06A2E" strokeWidth="2.4" strokeDasharray="4 3"/>
      <text x="22" y="46" textAnchor="middle" fontSize="6.5" fill="#3F5A6B" fontFamily="'JetBrains Mono', monospace">4 · 5</text>
    </g>
    <g transform="translate(214 118)">
      <text x="0" y="0" fontSize="8" fontWeight="800" fill="#2E7E9E" fontFamily="'JetBrains Mono', monospace">POL</text>
      <text x="0" y="12" fontSize="9" fontWeight="800" fill="#C06A2E" fontFamily="'JetBrains Mono', monospace">20 m²</text>
      <text x="0" y="28" fontSize="8" fontWeight="800" fill="#2E7E9E" fontFamily="'JetBrains Mono', monospace">CHEKKA</text>
      <text x="0" y="40" fontSize="9" fontWeight="800" fill="#C06A2E" fontFamily="'JetBrains Mono', monospace">18 m</text>
    </g>
    {/* chap artefakt: o'lchov lentasi */}
    <g transform="translate(88 158)">
      <rect x="-22" y="6" width="44" height="14" rx="3" fill="#B49A6E" stroke="#8A7550" strokeWidth="1"/>
      <rect x="-20" y="-12" width="40" height="10" rx="2" fill="#FFE6A6" stroke="#C06A2E" strokeWidth="1.2"/>
      <g stroke="#C06A2E" strokeWidth="0.9">{[-14, -7, 0, 7, 14].map((dx, k) => <line key={k} x1={dx} y1="-12" x2={dx} y2={k % 2 ? -6 : -3}/>)}</g>
      <text x="0" y="-16" textAnchor="middle" fontSize="5" fill="#6B5636" fontFamily="'JetBrains Mono', monospace">LENTA</text>
    </g>
    {/* o'ng artefakt: plitka to'plami */}
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(302 ${96 + i * 18})`}>
        <rect x="0" y="0" width="30" height="14" rx="2" fill="#E4D3AC" stroke="#8A7550" strokeWidth="1"/>
        <line x1="15" y1="0" x2="15" y2="14" stroke="#C6AE7E" strokeWidth="1"/>
      </g>
    ))}
    <circle className="lm-glow" cx="300" cy="88" r="2.4" fill="#BFF0C8"/>
  </svg>
);

const LessonScene = ({ gathered = false }) => {
  const kid = ({ key, El, hook }, i) => (
    <span key={key} className="lm-crew lm-crew-kid g1-pop-in" style={{ animationDelay: `${0.25 + i * 0.12}s` }}>
      <El {...(gathered ? { mood: 'happy', pose: 'happy' } : hook)}/>
    </span>
  );
  return (
    <div className="lm-scene">
      <AncientHallBg fill/>
      <ProjectNodeLayer/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};

// --- FACTCARD QAHRAMONI: xona chetida plitka butun yotmaydi — kesim qoladi.
const TileCutFig = () => (
  <svg viewBox="0 0 220 104" style={{ width: 'min(266px, 84%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <rect x="18" y="18" width="130" height="68" fill="#F7F1E4" stroke="#8A7550" strokeWidth="2"/>
    {Array.from({ length: 3 }).map((_, r) => (
      Array.from({ length: 5 }).map((_, c) => (
        <rect key={`${r}-${c}`} x={18 + c * 24} y={18 + r * 24} width="24" height="24"
          fill={c === 4 ? '#FFE6A6' : '#FDF3E0'} stroke="#C9BCA2" strokeWidth="1"/>
      ))
    ))}
    <rect x="18" y="18" width="130" height="68" fill="none" stroke="#8A7550" strokeWidth="2"/>
    <path d="M148 18 L148 86" stroke="#C06A2E" strokeWidth="2.4" strokeDasharray="4 3"/>
    <g transform="translate(178 40)">
      <path d="M0 0 h22 v22 h-22 Z" fill="#FFE6A6" stroke="#C06A2E" strokeWidth="1.6"/>
      <path d="M10 0 v22" stroke="#C06A2E" strokeWidth="1.6" strokeDasharray="3 2"/>
      <text x="11" y="36" textAnchor="middle" fontSize="8" fontWeight="800" fill="#8A7550" fontFamily="'JetBrains Mono', monospace">?</text>
    </g>
    <text x="83" y="100" textAnchor="middle" fontSize="8" fill="#8A7550" fontFamily="'JetBrains Mono', monospace">15</text>
  </svg>
);

export default createLesson({
  TOTAL_SCREENS, LESSON_META, SCREEN_META, CONTENT, BRIDGES, S14_PAYOFF,
  STYLES: LESSON_STYLES,
  Scene: LessonScene,
  FactFig: TileCutFig
});
