import React from 'react';
import { AncientHallBg, BitSVG, HALL_SLAB, LUMO_CAST, createLesson, useLang, tri } from './_kit/index.jsx';
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
  lessonId: 'grade3-38',
  lessonTitle: { ru: 'Урок 38. Задачи блока', uz: '38-dars. Blok masalalari', en: 'Lesson 38. Word problems of the block' }
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
    eyebrow: { ru: 'Крючок', uz: 'Qiziqtirish', en: 'Hook' },
    topic: { ru: 'Задачи блока', uz: 'Blok masalalari', en: 'Word problems of the block' },
    lead: { ru: 'Комната 4 на 5 м. Нужна плитка на пол', uz: "Xona 4 ga 5 m. Polga plitka kerak", en: 'A room is 4 by 5 m. Tiles are needed for the floor' },
    order_cap: { ru: 'что здесь считать', uz: 'bu yerda nimani hisoblash kerak', en: 'what has to be counted here' },
    plate: ['4', '·', '5'],
    q: { ru: 'Что нужно найти для плитки?', uz: 'Plitka uchun nimani topish kerak?', en: 'What has to be found for the tiles?' },
    opt0: { ru: 'площадь', uz: 'yuza', en: 'the area' },
    opt1: { ru: 'периметр', uz: 'perimetr', en: 'the perimeter' },
    opt2: { ru: 'длину стены', uz: 'devor uzunligini', en: 'the length of a wall' },
    opt3: { ru: 'сумму сторон', uz: "tomonlar yig'indisini", en: 'the sum of the sides' },
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
        ],
        en: ['You can find area and perimeter and you can compare. The main thing is left.', 'A room is four by five metres. The floor has to be covered with tiles.', 'A problem always has a question, and it tells you which quantity to look for.', 'What do you think has to be found for the tiles?']
      },
      on_correct: { ru: 'Верно! Пол это поверхность, а её меряют площадью.', uz: "To'g'ri! Pol bu yuza, u yuza bilan o'lchanadi.", en: 'Right! A floor is a surface, and a surface is measured by area.' },
      on_wrong1: { ru: 'Периметр это путь по краю. Им считают ограду или ленту, а не пол.', uz: "Perimetr bu chekka yo'li. U bilan panjara yoki lenta hisoblanadi, pol emas.", en: 'The perimeter is the path along the edge. It is used for a fence or a strip, not for a floor.' },
      on_wrong2: { ru: 'Одна стена не покроет пол. Нужны обе стороны.', uz: "Bitta devor polni qoplamaydi. Ikkala tomon kerak.", en: 'One wall will not cover the floor. Both sides are needed.' },
      on_idk: { ru: 'Ничего. Сейчас разберём задачу по шагам.', uz: "Hechqisi yo'q. Hozir masalani qadamlab ko'ramiz.", en: 'Never mind. Let us work the problem out step by step.' }
    }
  },

  // s1 — MODEL: masalaning qadamlari.
  s1: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil', en: 'Working it out' },
    lead: { ru: 'Разберём задачу по шагам', uz: 'Masalani qadamlab tahlil qilamiz', en: 'Let us work the problem out step by step' },
    task_line: 'комната 4 на 5 м, плитка 1 м²',
    task_line_uz: "xona 4 ga 5 m, plitka 1 m²",
    task_line_en: 'room 4 by 5 m, tile 1 sq m',
    step1: '4 · 5 = 20',
    step1_cap: { ru: 'площадь пола, м²', uz: 'pol yuzasi, m²', en: 'the area of the floor, sq m' },
    step2: { ru: '20 плиток', uz: '20 plitka', en: '20 tiles' },
    step2_cap: { ru: 'плитка 1 м², значит столько же', uz: "plitka 1 m², demak shuncha", en: 'a tile is 1 sq m, so the number is the same' },
    res: { ru: 'ответ 20 плиток', uz: 'javob 20 plitka', en: 'the answer is 20 tiles' },
    btn1: { ru: 'Найти площадь', uz: 'Yuzani topish', en: 'Find the area' },
    btn2: { ru: 'Ответить на вопрос', uz: 'Savolga javob berish', en: 'Answer the question' },
    done_text: { ru: 'Двадцать плиток. Сначала нашли площадь, потом ответили на вопрос.', uz: "Yigirmata plitka. Avval yuzani topdik, keyin savolga javob berdik.", en: 'Twenty tiles. First we found the area, then we answered the question.' },
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
      ],
      en: ['Let us work the problem out step by step.', 'First we find the area of the floor. Four times five, twenty square metres.', 'Each tile covers one square metre, so twenty tiles are needed. The first step prepared the answer, but was not the answer yet.']
    }
  },

  // s2 — MODEL: bitta xona — ikki savol, ikki kattalik.
  s2: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil', en: 'Working it out' },
    w: 4,
    h: 5,
    lead: { ru: 'Одна комната, два разных вопроса', uz: 'Bitta xona, ikki xil savol', en: 'One room, two different questions' },
    capA: { ru: 'плитка на пол: 4 · 5 = 20', uz: 'polga plitka: 4 · 5 = 20', en: 'tiles for the floor: 4 · 5 = 20' },
    capB: { ru: 'лента по краю: (4 + 5) · 2 = 18', uz: "chekkaga lenta: (4 + 5) · 2 = 18", en: 'strip along the edge: (4 + 5) · 2 = 18' },
    res: { ru: 'вопрос решает', uz: 'savol hal qiladi', en: 'the question decides' },
    btn1: { ru: 'Спросить про пол', uz: "Pol haqida so'rash", en: 'Ask about the floor' },
    btn2: { ru: 'Спросить про край', uz: "Chekka haqida so'rash", en: 'Ask about the edge' },
    done_text: { ru: 'Комната одна, а числа разные, потому что вопросы разные.', uz: "Xona bitta, sonlar esa har xil, chunki savollar har xil.", en: 'The room is one, and the numbers are different, because the questions are different.' },
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
      ],
      en: ['The room is the very same. Let us see what the question changes.', 'The floor was asked about, we work out the area. Twenty square metres.', 'The edge was asked about, we work out the perimeter. Eighteen metres. The room is one, and the answers are different.']
    }
  },

  // s3 — QOIDA: savol kattalikni tanlaydi.
  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    q: { ru: 'Задача: сколько метров ограды вокруг сада? Что считаем?', uz: "Masala: bog' atrofiga necha metr panjara kerak? Nimani hisoblaymiz?", en: 'A problem: how many metres of fence go round the garden? What do we count?' },
    opts: [
      { ru: 'периметр', uz: 'perimetr', en: 'the perimeter' },
      { ru: 'площадь', uz: 'yuza', en: 'the area' },
      { ru: 'одну сторону', uz: 'bitta tomonni', en: 'one side' },
      { ru: 'площадь и периметр', uz: 'yuza va perimetrni', en: 'the area and the perimeter' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Площадь это то, что внутри. Ограда идёт по краю.', uz: "Yuza bu ichkaridagi narsa. Panjara chekka bo'ylab boradi.", en: 'Area is what is inside. A fence runs along the edge.' },
      2: { ru: 'Одной стороны мало, ограда обходит весь сад.', uz: "Bitta tomon kam, panjara butun bog'ni aylanadi.", en: 'One side is not enough, a fence goes round the whole garden.' },
      3: { ru: 'Спрашивают только про ограду, площадь тут не нужна.', uz: "Faqat panjara so'ralgan, yuza bu yerda kerak emas.", en: 'Only the fence is asked about, the area is not needed here.' }
    },
    on_correct: { ru: 'Верно. Ограда идёт по краю, значит периметр.', uz: "To'g'ri. Panjara chekka bo'ylab boradi, demak perimetr.", en: 'Right. A fence runs along the edge, so the perimeter.' },
    rule_lines: {
      ru: ['вопрос выбирает величину', 'внутри — площадь, по краю — периметр', 'в ответе пишут единицу'],
      uz: ["savol kattalikni tanlaydi", "ichkarida yuza, chekkada perimetr", "javobda birlik yoziladi"],
      en: ['the question chooses the quantity', 'inside — area, along the edge — perimeter', 'the unit is written in the answer']
    },
    rule_ex: { ru: 'пол → S, ограда → P', uz: 'pol → S, panjara → P', en: 'floor → S, fence → P' },
    rule_speech: { ru: 'Вопрос задачи выбирает величину. Если речь о том, что внутри, о поле или о плитке, считают площадь. Если речь о том, что идёт по краю, об ограде или ленте, считают периметр.', uz: "Masalaning savoli kattalikni tanlaydi. Gap ichkaridagi narsa haqida bo'lsa, pol yoki plitka haqida, yuza hisoblanadi. Gap chekka bo'ylab boradigan narsa haqida bo'lsa, panjara yoki lenta haqida, perimetr hisoblanadi.", en: 'The question of a problem chooses the quantity. If it is about what is inside, about a floor or tiles, we work out the area. If it is about what runs along the edge, about a fence or a strip, we work out the perimeter.' },
    audio: {
      intro: { ru: 'Соберём правило. Мы увидели, что одна комната даёт разные ответы.', uz: "Qoidani yig'amiz. Bitta xona har xil javob berishini ko'rdik.", en: 'Let us gather the rule. We saw that one room gives different answers.' }
    }
  },

  // s4 — CHIZMA: 6 ga 3 xona, plitka.
  s4: {
    eyebrow: { ru: 'Чертёж', uz: 'Chizma', en: 'The drawing' },
    q: { ru: 'Комната 6 на 3 м. Сколько плиток по 1 м² нужно на пол?', uz: "Xona 6 ga 3 m. Polga 1 m² dan nechta plitka kerak?", en: 'A room is 6 by 3 m. How many 1 sq m tiles are needed for the floor?' },
    fig_w: 6,
    fig_h: 3,
    opts: [
      { ru: '18', uz: '18', en: '18' },
      { ru: '18 м', uz: '18 m', en: '18 m' },
      { ru: '9', uz: '9', en: '9' },
      { ru: '12', uz: '12', en: '12' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Число верное, но метры это длина. Плитки считают штуками.', uz: "Son to'g'ri, lekin metr bu uzunlik. Plitka dona bilan sanaladi.", en: 'The number is right, but metres are a length. Tiles are counted in pieces.' },
      2: { ru: 'Девять это половина. Посчитай все ряды.', uz: "To'qqiz bu yarmi. Hamma qatorni sanang.", en: 'Nine is half. Count all the rows.' },
      3: { ru: 'Двенадцать это край комнаты, а спрашивают про пол.', uz: "O'n ikki bu xona chekkasi, so'ralgani esa pol.", en: 'Twelve is the edge of the room, and the floor is asked about.' }
    },
    audio: {
      intro: { ru: 'Посмотри на чертёж. Комната шесть на три метра, плитка метр на метр. Сколько плиток?', uz: "Chizmaga qarang. Xona olti ga uch metr, plitka metr ga metr. Nechta plitka kerak?", en: 'Look at the drawing. A room six by three metres, a tile a metre by a metre. How many tiles?' },
      on_correct: { ru: 'Верно. Восемнадцать плиток.', uz: "To'g'ri. O'n sakkizta plitka.", en: 'Right. Eighteen tiles.' },
      on_wrong: { ru: 'Пол это площадь. Умножай стороны.', uz: "Pol bu yuza. Tomonlarni ko'paytiring.", en: 'A floor is area. Multiply the sides.' }
    }
  },

  // s5 — SARALASH: savollarni kattalik bo'yicha ajratish.
  s5: {
    eyebrow: { ru: 'Сортировка', uz: 'Saralash', en: 'Sorting' },
    lead: { ru: 'Разложи вопросы задач по величинам', uz: 'Masala savollarini kattaliklarga ajrating', en: 'Sort the problem questions by quantity' },
    bin_a: { ru: 'периметр', uz: 'perimetr', en: 'the perimeter' },
    bin_b: { ru: 'площадь', uz: 'yuza', en: 'the area' },
    items: [
      { n: { ru: 'сколько ленты по краю', uz: "chekkaga necha metr lenta", en: 'how much strip along the edge' }, a: true, hint: { ru: 'Лента идёт по краю.', uz: "Lenta chekka bo'ylab boradi.", en: 'The strip runs along the edge.' } },
      { n: { ru: 'сколько краски на пол', uz: 'polga qancha bo\'yoq', en: 'how much paint for the floor' }, a: false, hint: { ru: 'Краска ложится на поверхность.', uz: "Bo'yoq yuzaga yotadi.", en: 'Paint goes onto a surface.' } },
      { n: { ru: 'сколько метров забора', uz: 'necha metr panjara', en: 'how many metres of fence' }, a: true, hint: { ru: 'Забор обходит участок.', uz: "Panjara maydonni aylanadi.", en: 'A fence goes round the plot.' } },
      { n: { ru: 'сколько плиток на пол', uz: 'polga nechta plitka', en: 'how many tiles for the floor' }, a: false, hint: { ru: 'Плитка закрывает поверхность.', uz: "Plitka yuzani yopadi.", en: 'Tiles cover a surface.' } }
    ],
    audio: {
      intro: { ru: 'Четыре вопроса из разных задач. Отправь каждый к своей величине.', uz: "Har xil masaladan to'rtta savol. Har birini o'z kattaligiga yuboring.", en: 'Four questions from different problems. Send each one to its quantity.' },
      on_correct: { ru: 'Всё на месте. Что идёт по краю, то периметр, что закрывает поверхность, то площадь.', uz: "Hammasi joyida. Chekka bo'ylab boradigani perimetr, yuzani yopadigani yuza.", en: 'All in place. What runs along the edge is the perimeter, what covers a surface is the area.' },
      on_wrong: { ru: 'Спроси себя, идёт это по краю или закрывает поверхность.', uz: "O'zingizdan so'rang, bu chekka bo'ylab boradimi yoki yuzani yopadimi.", en: 'Ask yourself whether this runs along the edge or covers a surface.' }
    }
  },

  // s6 — TEST: qaysi amal birinchi.
  s6: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv', en: 'Checking' },
    q: { ru: 'Зал 8 на 5 м. Сколько плиток по 1 м² останется, если привезли 50?', uz: "Zal 8 ga 5 m. 50 ta keltirilgan bo'lsa, 1 m² dan nechta plitka ortadi?", en: 'A hall is 8 by 5 m. How many 1 sq m tiles will be left if 50 were delivered?' },
    opts: [
      { ru: 'сначала 8 · 5', uz: 'avval 8 · 5', en: 'first 8 · 5' },
      { ru: 'сначала 50 − 8', uz: 'avval 50 − 8', en: 'first 50 − 8' },
      { ru: 'сначала (8 + 5) · 2', uz: 'avval (8 + 5) · 2', en: 'first (8 + 5) · 2' },
      { ru: 'сначала 50 : 8', uz: 'avval 50 : 8', en: 'first 50 : 8' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Из пятидесяти вычитать рано. Мы ещё не знаем, сколько уйдёт.', uz: "Ellikdan ayirish erta. Qancha ketishini hali bilmaymiz.", en: 'It is too early to subtract from fifty. We do not know yet how many will be used.' },
      2: { ru: 'Это край зала, а плитку кладут на пол.', uz: "Bu zal chekkasi, plitka esa polga yotqiziladi.", en: 'That is the edge of the hall, and tiles are laid on the floor.' },
      3: { ru: 'Делить тут нечего, плитки считают по площади.', uz: "Bu yerda bo'ladigan narsa yo'q, plitka yuza bo'yicha sanaladi.", en: 'There is nothing to divide here, tiles are counted by area.' }
    },
    audio: {
      intro: { ru: 'Быстрый вопрос. Зал восемь на пять, привезли пятьдесят плиток. С какого действия начать?', uz: "Tez savol. Zal sakkiz ga besh, ellikta plitka keltirilgan. Qaysi amaldan boshlash kerak?", en: 'A quick question. A hall eight by five, fifty tiles delivered. Which operation do we start with?' },
      on_correct: { ru: 'Верно. Сначала узнаём, сколько нужно, потом сравниваем с привезённым.', uz: "To'g'ri. Avval qancha kerakligini bilamiz, keyin keltirilgani bilan solishtiramiz.", en: 'Right. First we find out how many are needed, then we compare with what was delivered.' },
      on_wrong: { ru: 'Первый шаг всегда отвечает на вопрос, сколько нужно.', uz: "Birinchi qadam har doim qancha kerak degan savolga javob beradi.", en: 'The first step always answers how many are needed.' }
    }
  },

  // s7 — KONSOL: ikki qadamli masala.
  s7: {
    eyebrow: { ru: 'Консоль', uz: 'Konsol', en: 'Console' },
    lead: { ru: 'Зал 8 на 5 м, привезли 50 плиток по 1 м²', uz: "Zal 8 ga 5 m, 1 m² dan 50 ta plitka keltirildi", en: 'A hall is 8 by 5 m, 50 tiles of 1 sq m were delivered' },
    swap_line: { ru: 'зал 8 на 5', uz: 'zal 8 ga 5', en: 'hall 8 by 5' },
    cells: [
      { head: { ru: 'нужно плиток', uz: 'plitka kerak', en: 'tiles needed' }, label: '8 · 5', ans: 40, hint: { ru: 'Это площадь пола.', uz: 'Bu pol yuzasi.', en: 'That is the area of the floor.' } },
      { head: { ru: 'привезли', uz: 'keltirildi', en: 'delivered' }, label: { ru: 'штук', uz: 'dona', en: 'pieces' }, ans: 50, hint: { ru: 'Это число дано в условии.', uz: 'Bu son shartda berilgan.', en: 'That number is given in the problem.' } },
      { head: { ru: 'останется', uz: 'ortadi', en: 'will be left' }, label: '50 − 40', ans: 10, hint: { ru: 'Из привезённого вычти нужное.', uz: 'Keltirilganidan keraklisini ayiring.', en: 'Take the needed number away from the delivered one.' } }
    ],
    check: { ru: '40 нужно, 10 останется', uz: '40 kerak, 10 ortadi', en: '40 needed, 10 left' },
    check_label: { ru: 'два действия', uz: 'ikki amal', en: 'two steps' },
    audio: {
      intro: { ru: 'Заполни три окна. Сколько нужно, сколько привезли и сколько останется.', uz: "Uchta oynani to'ldiring. Qancha kerak, qancha keltirilgan va qancha ortadi.", en: 'Fill three windows. How many are needed, how many were delivered and how many will be left.' },
      on_correct: { ru: 'Нужно сорок, привезли пятьдесят, останется десять. Первое действие подготовило второе.', uz: "Qirq kerak, ellik keltirilgan, o'nta ortadi. Birinchi amal ikkinchisini tayyorladi.", en: 'Forty are needed, fifty were delivered, ten will be left. The first step prepared the second.' }
    }
  },

  // s8 — XATONI TOP: birinchi qadamda to'xtab qolish (M2).
  s8: {
    eyebrow: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    q: { ru: 'Спросили, сколько плиток останется. Записали в ответ 40. Где ошибка?', uz: "Nechta plitka ortadi deb so'rashdi. Javobga 40 yozilibdi. Xato qayerda?", en: 'The question was how many tiles will be left. They wrote 40 as the answer. Where is the mistake?' },
    fig_line: '8 · 5 = 40',
    opts: [
      { ru: 'остановились на первом шаге', uz: "birinchi qadamda to'xtab qolishgan", en: 'they stopped at the first step' },
      { ru: 'ошибки нет', uz: "xato yo'q", en: 'there is no mistake' },
      { ru: 'неверно умножили', uz: "noto'g'ri ko'paytirilgan", en: 'the multiplying was wrong' },
      { ru: 'взяли не те стороны', uz: "tomonlar noto'g'ri olingan", en: 'the wrong sides were taken' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Сорок это сколько нужно, а спрашивали, сколько останется.', uz: "Qirq bu qancha kerakligi, so'ralgani esa qancha ortishi.", en: 'Forty is how many are needed, and the question was how many will be left.' },
      2: { ru: 'Умножили верно, восемь на пять это сорок.', uz: "To'g'ri ko'paytirilgan, sakkiz ga besh qirq.", en: 'The multiplying was right, eight times five is forty.' },
      3: { ru: 'Стороны те самые, восемь и пять.', uz: "Tomonlar o'sha, sakkiz va besh.", en: 'The sides are the right ones, eight and five.' }
    },
    audio: {
      intro: { ru: 'Кто-то посчитал сорок и записал это в ответ. Найди ошибку.', uz: "Kimdir qirqni hisoblab, javobga yozibdi. Xatoni toping.", en: 'Someone worked out forty and wrote it as the answer. Find the mistake.' },
      on_correct: { ru: 'Верно. Первое действие только подготовило ответ. Нужно ещё вычесть.', uz: "To'g'ri. Birinchi amal faqat javobni tayyorladi. Yana ayirish kerak.", en: 'Right. The first step only prepared the answer. It still has to be subtracted.' },
      on_wrong: { ru: 'Перечитай вопрос задачи и посмотри, на что отвечает число сорок.', uz: "Masala savolini qayta o'qing va qirq soni nimaga javob berishiga qarang.", en: 'Read the question of the problem again and see what the number forty answers.' }
    }
  },

  // s9 — BIT TUZOG'I: yuzani uch tomon bilan hisoblash (M4).
  s9: {
    eyebrow: { ru: 'Ловушка Бита', uz: "Bit tuzog'i", en: "Bit's trap" },
    lead: { ru: 'Бит считает пол склада', uz: 'Bit ombor polini hisoblayapti', en: 'Bit is working out the floor of the store' },
    lines: ['склад 6 на 4 м', 'Бит: 6 + 4 + 6 = 16 м² пола'],
    lines_uz: ["ombor 6 ga 4 m", "Bit: 6 + 4 + 6 = 16 m² pol"],
    lines_en: ['store 6 by 4 m', 'Bit: 6 + 4 + 6 = 16 sq m of floor'],
    line_cap: { ru: 'Бит: сложил три стороны', uz: "Bit: uchta tomonni qo'shdim", en: 'Bit: I added three sides' },
    trap_label: { ru: 'Так ли это?', uz: 'Shundaymi?', en: 'Is that so?' },
    trap_opts: { ru: ['нет, пол считают умножением', 'да, всё верно'], uz: ["yo'q, pol ko'paytirish bilan hisoblanadi", 'ha, hammasi to\'g\'ri'], en: ['no, a floor is counted by multiplying', 'yes, it is all right'] },
    trap_ci: 0,
    trap_correct: { ru: 'Да. Сложение сторон даёт длину, а не поверхность. Пол это шесть рядов по четыре, то есть двадцать четыре квадратных метра.', uz: "Ha. Tomonlarni qo'shish uzunlik beradi, yuzani emas. Pol bu to'rttadan olti qator, ya'ni yigirma to'rt kvadrat metr.", en: 'Yes. Adding the sides gives a length, not a surface. The floor is six rows of four, that is twenty four square metres.' },
    trap_wrong: { ru: 'Посмотри на единицы. Складывая метры, метры и получишь, а пол меряют квадратными.', uz: "Birliklarga qarang. Metrni qo'shsangiz metr chiqadi, pol esa kvadrat bilan o'lchanadi.", en: 'Look at the units. Add metres and you get metres, and a floor is measured in square ones.' },
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
      ],
      en: ['Bit is working out the floor of the store.', 'Six plus four plus six, sixteen square metres of floor.', 'Is that so?']
    }
  },

  // s10 — TRENAJYOR: plitka.
  s10: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq', en: 'Trainer' },
    q: { ru: 'Комната 7 на 4 м. Сколько плиток по 1 м² нужно на пол?', uz: "Xona 7 ga 4 m. Polga 1 m² dan nechta plitka kerak?", en: 'A room is 7 by 4 m. How many 1 sq m tiles are needed for the floor?' },
    ans: 28,
    check: '7 · 4',
    check_label: { ru: 'пол это площадь', uz: 'pol bu yuza', en: 'the floor is area' },
    hint: { ru: 'Семь умножь на четыре.', uz: "Yettini to'rtga ko'paytiring.", en: 'Multiply seven by four.' },
    audio: {
      intro: { ru: 'Теперь считай сам. Комната семь на четыре, сколько плиток?', uz: "Endi o'zingiz hisoblang. Xona yetti ga to'rt, nechta plitka kerak?", en: 'Now count on your own. A room seven by four, how many tiles?' },
      on_correct: { ru: 'Двадцать восемь плиток.', uz: "Yigirma sakkizta plitka.", en: 'Twenty eight tiles.' }
    }
  },

  // s11 — TRENAJYOR: panjara.
  s11: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq', en: 'Trainer' },
    q: { ru: 'Сад 7 на 4 м. Сколько метров забора нужно вокруг?', uz: "Bog' 7 ga 4 m. Atrofiga necha metr panjara kerak?", en: 'A garden is 7 by 4 m. How many metres of fence are needed around it?' },
    ans: 22,
    check: '(7 + 4) · 2',
    check_label: { ru: 'забор идёт по краю', uz: "panjara chekka bo'ylab boradi", en: 'a fence runs along the edge' },
    hint: { ru: 'Сложи семь и четыре, потом удвой.', uz: "Yetti va to'rtni qo'shib, keyin ikkilantiring.", en: 'Add seven and four, then double it.' },
    audio: {
      intro: { ru: 'Тот же участок, другой вопрос. Сколько метров забора нужно вокруг сада?', uz: "O'sha maydon, boshqa savol. Bog' atrofiga necha metr panjara kerak?", en: 'The same plot, a different question. How many metres of fence are needed around the garden?' },
      on_correct: { ru: 'Двадцать два метра. Участок один, а величина другая.', uz: "Yigirma ikki metr. Maydon bitta, kattalik esa boshqa.", en: 'Twenty two metres. The plot is one, and the quantity is different.' }
    }
  },

  // s12 — MASALA: ikki amal, ortgan plitka.
  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    lead: { ru: 'Кристальная мастерская', uz: 'Kristall ustaxona', en: 'The crystal workshop' },
    q: { ru: 'Пол мастерской 9 на 3 м. Привезли 30 плиток по 1 м². Хватит ли и сколько останется?', uz: "Ustaxona poli 9 ga 3 m. 1 m² dan 30 ta plitka keltirildi. Yetadimi va qancha ortadi?", en: 'The workshop floor is 9 by 3 m. 30 tiles of 1 sq m were delivered. Will there be enough and how many will be left?' },
    q_speech: { ru: 'пол мастерской девять на три метра, привезли тридцать плиток. Хватит ли и сколько останется?', uz: "ustaxona poli to'qqiz ga uch metr, o'ttizta plitka keltirildi. Yetadimi va qancha ortadi?", en: 'the workshop floor is nine by three metres, thirty tiles were delivered. Will there be enough and how many will be left?' },
    tbl_heads: [
      { ru: 'пол', uz: 'pol', en: 'floor' },
      { ru: 'привезли', uz: 'keltirildi', en: 'delivered' },
      { ru: 'вопрос', uz: 'savol', en: 'question' }
    ],
    tbl_cells: ['9 · 3', '30', '?'],
    pick_label: { ru: 'С какого действия начинаем?', uz: 'Qaysi amaldan boshlaymiz?', en: 'Which operation do we start with?' },
    opts: [
      { ru: '9 · 3', uz: '9 · 3', en: '9 · 3' },
      { ru: '30 − 9', uz: '30 − 9', en: '30 − 9' },
      { ru: '(9 + 3) · 2', uz: '(9 + 3) · 2', en: '(9 + 3) · 2' },
      { ru: '30 : 3', uz: '30 : 3', en: '30 : 3' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Вычитать рано. Сколько уйдёт, ещё не знаем.', uz: "Ayirish erta. Qancha ketishini hali bilmaymiz.", en: 'It is too early to subtract. We do not know yet how many will be used.' },
      2: { ru: 'Это край мастерской, а плитку кладут на пол.', uz: "Bu ustaxona chekkasi, plitka esa polga yotqiziladi.", en: 'That is the edge of the workshop, and tiles are laid on the floor.' },
      3: { ru: 'Делением тут ничего не найти.', uz: "Bo'lish bilan bu yerda hech nima topilmaydi.", en: 'Dividing will not find anything here.' }
    },
    pick_ok: { ru: 'Верно. Сначала пол, потом остаток.', uz: "To'g'ri. Avval pol, keyin qoldiq.", en: 'Right. First the floor, then the remainder.' },
    step1_q: { ru: 'Сколько плиток нужно на пол?', uz: 'Polga nechta plitka kerak?', en: 'How many tiles are needed for the floor?' },
    ans1: 27,
    hint1: { ru: 'Девять умножь на три.', uz: "To'qqizni uchga ko'paytiring.", en: 'Multiply nine by three.' },
    step2_q: { ru: 'Сколько плиток останется?', uz: 'Nechta plitka ortadi?', en: 'How many tiles will be left?' },
    ans2: 3,
    hint2: { ru: 'Из тридцати вычти двадцать семь.', uz: "O'ttizdan yigirma yettini ayiring.", en: 'Take twenty seven away from thirty.' },
    check: { ru: '27 нужно, 3 останется', uz: '27 kerak, 3 ortadi', en: '27 needed, 3 left' },
    setup_audio: { ru: 'Мастерскую готовят к работе. Посмотри на таблицу и реши, с чего начать.', uz: "Ustaxona ishga tayyorlanmoqda. Jadvalga qarang va nimadan boshlashni hal qiling.", en: 'The workshop is being prepared for work. Look at the table and decide where to start.' },
    audio: {
      intro: { ru: 'Пол мастерской девять на три метра, привезли тридцать плиток. Хватит ли и сколько останется?', uz: "Ustaxona poli to'qqiz ga uch metr, o'ttizta plitka keltirildi. Yetadimi va qancha ortadi?", en: 'The workshop floor is nine by three metres, thirty tiles were delivered. Will there be enough and how many will be left?' },
      on_correct: { ru: 'Нужно двадцать семь, значит хватит, и останется три плитки.', uz: "Yigirma yetti kerak, demak yetadi va uchta plitka ortadi.", en: 'Twenty seven are needed, so there is enough, and three tiles will be left.' },
      on_wrong: { ru: 'Первое действие показывает, сколько нужно. Второе отвечает на вопрос.', uz: "Birinchi amal qancha kerakligini ko'rsatadi. Ikkinchisi savolga javob beradi.", en: 'The first step shows how many are needed. The second answers the question.' }
    }
  },

  // s13 — FINAL: uchta topshiriq + FaktCard.
  s13: {
    eyebrow: { ru: 'Финал', uz: 'Yakuniy', en: 'Final' },
    intro_line: { ru: 'Три задания. Читай вопрос до конца', uz: "Uchta topshiriq. Savolni oxirigacha o'qing", en: 'Three tasks. Read the question to the end' },
    items: [
      {
        kind: 'num',
        q: { ru: 'Комната 5 на 6 м. Сколько плиток по 1 м² нужно?', uz: "Xona 5 ga 6 m. 1 m² dan nechta plitka kerak?", en: 'A room is 5 by 6 m. How many 1 sq m tiles are needed?' },
        q_speech: { ru: 'комната пять на шесть метров. Сколько плиток нужно?', uz: "xona besh ga olti metr. Nechta plitka kerak?", en: 'a room five by six metres. How many tiles are needed?' },
        ans: 30,
        hint: { ru: 'Пол это площадь, умножай стороны.', uz: "Pol bu yuza, tomonlarni ko'paytiring.", en: 'A floor is area, multiply the sides.' }
      },
      {
        kind: 'num',
        q: { ru: 'Вокруг того же пола кладут ленту. Сколько метров ленты?', uz: "O'sha pol atrofiga lenta yotqiziladi. Necha metr lenta kerak?", en: 'A strip is laid around the same floor. How many metres of strip?' },
        q_speech: { ru: 'вокруг того же пола кладут ленту. Сколько метров ленты нужно?', uz: "o'sha pol atrofiga lenta yotqiziladi. Necha metr lenta kerak?", en: 'a strip is laid around the same floor. How many metres of strip are needed?' },
        ans: 22,
        hint: { ru: 'Лента по краю, значит периметр.', uz: "Lenta chekka bo'ylab, demak perimetr.", en: 'The strip runs along the edge, so the perimeter.' }
      },
      {
        kind: 'num',
        q: { ru: 'Привезли 36 плиток, на пол ушло 30. Сколько осталось?', uz: "36 ta plitka keltirildi, polga 30 tasi ketdi. Nechtasi qoldi?", en: '36 tiles were delivered, 30 went onto the floor. How many are left?' },
        q_speech: { ru: 'привезли тридцать шесть плиток, на пол ушло тридцать. Сколько осталось?', uz: "o'ttiz oltita plitka keltirildi, polga o'ttiztasi ketdi. Nechtasi qoldi?", en: 'thirty six tiles were delivered, thirty went onto the floor. How many are left?' },
        ans: 6,
        hint: { ru: 'Из привезённого вычти то, что ушло.', uz: 'Keltirilganidan ketganini ayiring.', en: 'Take what was used away from what was delivered.' }
      }
    ],
    fact_badge: { ru: 'Знаешь ли ты?', uz: 'Bilasizmi?', en: 'Which line is wrong?' },
    fact_text: {
      ru: 'Мастера всегда берут плитку с запасом, примерно на десятую часть больше. Часть плиток приходится резать по краям комнаты, а обрезки уже никуда не положишь. Поэтому расчёт площади это только начало разговора со складом.',
      uz: "Ustalar plitkani doim zaxira bilan oladi, taxminan o'ndan bir qism ko'p. Bir qism plitkani xona chekkasida kesishga to'g'ri keladi, kesim esa endi hech qayerga yotmaydi. Shuning uchun yuzani hisoblash ombor bilan suhbatning boshi xolos.",
      en: 'Craftsmen always take tiles with a spare, about a tenth more. Some tiles have to be cut at the edges of the room, and the offcuts cannot be laid anywhere. So working out the area is only the start of the conversation with the store.'
    },
    fact_audio: {
      ru: 'Вот что важно знать. Мастера всегда заказывают плитку с запасом, примерно на десятую часть больше, чем вышло по расчёту. Дело в том, что у стен плитки почти никогда не ложатся целыми, их приходится резать. Отрезанный кусок уже редко подходит куда-то ещё. Так что площадь пола это только начало разговора, а окончательное число всегда чуть больше.',
      uz: "Mana nimani bilish muhim. Ustalar plitkani doim zaxira bilan buyuradi, hisobdan taxminan o'ndan bir qism ko'p. Gap shundaki, devor oldida plitka deyarli hech qachon butun yotmaydi, uni kesishga to'g'ri keladi. Kesilgan bo'lak esa boshqa joyga kamdan-kam to'g'ri keladi. Shunday qilib pol yuzasi suhbatning boshi xolos, oxirgi son esa har doim sal ko'proq.",
      en: 'Here is something worth knowing. Craftsmen always order tiles with a spare, about a tenth more than the calculation gave. The thing is that at the walls tiles almost never lie whole, they have to be cut. A cut piece rarely fits anywhere else. So the area of the floor is only the start of the conversation, and the final number is always a little bigger.'
    },
    audio: {
      intro: { ru: 'Три задания напоследок. Каждый раз дочитывай вопрос до конца.', uz: "Oxirida uchta topshiriq. Har safar savolni oxirigacha o'qing.", en: 'Three tasks at the end. Each time read the question to the end.' },
      on_correct: { ru: 'Верно.', uz: "To'g'ri.", en: 'Correct.' },
      on_wrong: { ru: 'Посмотри, о чём именно спрашивают.', uz: "Aynan nima so'ralganiga qarang.", en: 'Look at what exactly is being asked.' }
    }
  },

  // s14 — YAKUN: keyingisi uchburchak turlari (reja 43-satr).
  s14: {
    eyebrow: { ru: 'Итог', uz: 'Yakun', en: 'Result' },
    mission_done: { ru: 'Мастерская готова!', uz: 'Ustaxona tayyor!', en: 'The workshop is ready!' },
    cando: {
      ru: ['выбираю величину по вопросу задачи', 'довожу задачу до второго действия', 'пишу единицу в ответе'],
      uz: ["masala savoliga qarab kattalikni tanlayman", "masalani ikkinchi amalgacha yetkazaman", "javobda birlikni yozaman"],
      en: ['I choose the quantity by the question of the problem', 'I take the problem through to the second step', 'I write the unit in the answer']
    },
    rule_recap: { ru: 'Вопрос задачи выбирает величину: внутри это площадь, по краю это периметр.', uz: "Masala savoli kattalikni tanlaydi: ichkarida yuza, chekkada perimetr.", en: 'The question of a problem chooses the quantity: inside is area, along the edge is perimeter.' },
    conn_label_refs: { ru: 'опирается на', uz: 'nimaga tayanadi', en: 'builds on' },
    conn_refs: { ru: 'урок 37: сравнение по мерке; урок 23: задачи в два действия', uz: "37-dars: o'lchov bo'yicha solishtirish; 23-dars: ikki amalli masalalar", en: 'lesson 37: comparing by a measure; lesson 23: two-step problems' },
    conn_label_next: { ru: 'дальше', uz: 'keyin', en: 'next' },
    conn_next: { ru: 'виды треугольников и прямые на чертеже', uz: 'uchburchak turlari va chizmadagi to\'g\'ri chiziqlar', en: 'kinds of triangles and lines on a drawing' },
    audio: {
      ru: 'Мастерская готова. Запомни главное. В задаче сначала читают вопрос, и он говорит, что искать. Если речь о том, что внутри, о поле, о плитке, о краске, ищут площадь. Если речь о том, что идёт по краю, об ограде, о ленте, ищут периметр. И почти всегда первое действие только готовит ответ, а отвечает второе. В следующий раз отложим счёт и посмотрим на сами фигуры!',
      uz: "Ustaxona tayyor. Asosiysini eslab qoling. Masalada avval savol o'qiladi, u nimani izlashni aytadi. Gap ichkaridagi narsa haqida bo'lsa, pol, plitka, bo'yoq haqida, yuza izlanadi. Gap chekka bo'ylab boradigan narsa haqida bo'lsa, panjara, lenta haqida, perimetr izlanadi. Va deyarli har doim birinchi amal faqat javobni tayyorlaydi, javobni esa ikkinchisi beradi. Keyingi safar hisobni qo'yib turib, shakllarning o'ziga qaraymiz!",
      en: 'The workshop is ready. Remember the main thing. In a problem you read the question first, and it says what to look for. If it is about what is inside, about a floor, tiles or paint, we look for the area. If it is about what runs along the edge, about a fence or a strip, we look for the perimeter. And almost always the first step only prepares the answer, and the second one gives it. Next time we will put counting aside and look at the figures themselves!'
    }
  }
};

const BRIDGES = {
  s1:  { ru: 'Разберём по шагам.', uz: 'Qadamlab tahlil qilamiz.', en: 'Let us work it out step by step.' },
  s2:  { ru: 'Теперь другой вопрос.', uz: 'Endi boshqa savol.', en: 'Now a different question.' },
  s3:  { ru: "Соберём это в правило.", uz: "Buni qoidaga yig'amiz.", en: 'Let us gather this into a rule.' },
  s4:  { ru: 'Прочитай чертёж.', uz: "Chizmani o'qing.", en: 'Read the drawing.' },
  s5:  { ru: 'Разложи вопросы.', uz: 'Savollarni ajrating.', en: 'Sort the questions.' },
  s6:  { ru: 'Быстрый вопрос.', uz: 'Tez savol.', en: 'A quick question.' },
  s7:  { ru: 'Заполни консоль.', uz: "Konsolni to'ldiring.", en: 'Fill the console.' },
  s8:  { ru: 'Тут ответили слишком рано.', uz: 'Bu yerda juda erta javob berilibdi.', en: 'Here they answered too early.' },
  s9:  { ru: 'А вот и Бит со своим счётом.', uz: "Mana Bit ham o'z hisobi bilan.", en: 'And here is Bit with his counting.' },
  s10: { ru: 'Теперь считай сам.', uz: "Endi o'zingiz hisoblang.", en: 'Now count on your own.' },
  s11: { ru: 'Тот же участок, другой вопрос.', uz: "O'sha maydon, boshqa savol.", en: 'The same plot, a different question.' },
  s12: { ru: 'Задача от мастеров.', uz: 'Ustalardan masala.', en: 'A task from the craftsmen.' },
  s13: { ru: 'Финальная проверка.', uz: 'Yakuniy tekshiruv.', en: 'The final check.' },
  s14: { ru: 'Подведём итог.', uz: 'Yakun yasaymiz.', en: 'Let us sum up.' }
};

const S14_PAYOFF = {
  ru: 'Мастерская готова. Вопрос задачи всегда подсказывал, что искать.',
  uz: "Ustaxona tayyor. Masala savoli har doim nimani izlashni aytdi.",
  en: 'The workshop is ready. The question of the problem always told us what to look for.'
};

// --- ZAL TAXTASI (D38): markazda qurilish loyihasi — xona rejasi, polda plitka to'ri,
// chekkada lenta chizig'i. Ikki javob yonma-yon turadi: ichkarisi va cheti.
const ProjectNodeLayer = () => {
  const lang = useLang();
  return (
  <svg className="lm-scene-bg" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <path d="M150 158 h100 l8 18 h-116 Z" fill="#B49A6E"/>
    <rect x={HALL_SLAB.x} y={HALL_SLAB.y} width={HALL_SLAB.w} height={HALL_SLAB.h} rx="5" fill="#E4D3AC" stroke="#8A7550" strokeWidth="2"/>
    <rect x="130" y="99" width="140" height="11" rx="2" fill="#C6AE7E"/>
    <text x="200" y="107.5" textAnchor="middle" fontSize="7" letterSpacing="2" fill="#6B5636" fontFamily="'JetBrains Mono', monospace">{tri(lang, 'ПРОЕКТ', 'LOYIHA', 'THE PROJECT')}</text>
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
      <text x="0" y="0" fontSize="8" fontWeight="800" fill="#2E7E9E" fontFamily="'JetBrains Mono', monospace">{tri(lang, 'ПОЛ', 'POL', 'THE FLOOR')}</text>
      <text x="0" y="12" fontSize="9" fontWeight="800" fill="#C06A2E" fontFamily="'JetBrains Mono', monospace">20 m²</text>
      <text x="0" y="28" fontSize="8" fontWeight="800" fill="#2E7E9E" fontFamily="'JetBrains Mono', monospace">{tri(lang, 'КРАЙ', 'CHEKKA', 'THE EDGE')}</text>
      <text x="0" y="40" fontSize="9" fontWeight="800" fill="#C06A2E" fontFamily="'JetBrains Mono', monospace">18 m</text>
    </g>
    {/* chap artefakt: o'lchov lentasi */}
    <g transform="translate(88 158)">
      <rect x="-22" y="6" width="44" height="14" rx="3" fill="#B49A6E" stroke="#8A7550" strokeWidth="1"/>
      <rect x="-20" y="-12" width="40" height="10" rx="2" fill="#FFE6A6" stroke="#C06A2E" strokeWidth="1.2"/>
      <g stroke="#C06A2E" strokeWidth="0.9">{[-14, -7, 0, 7, 14].map((dx, k) => <line key={k} x1={dx} y1="-12" x2={dx} y2={k % 2 ? -6 : -3}/>)}</g>
      <text x="0" y="-16" textAnchor="middle" fontSize="5" fill="#6B5636" fontFamily="'JetBrains Mono', monospace">{tri(lang, 'ЛЕНТА', 'LENTA', 'THE STRIP')}</text>
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
};

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
