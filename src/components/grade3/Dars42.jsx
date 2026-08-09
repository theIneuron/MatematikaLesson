import React from 'react';
import { BitSVG, LUMO_CAST, LumoCityBg, createLesson } from './_kit/index.jsx';
import { LESSON_STYLES } from './_kit/styles.js';

// ============================================================================
// DD 3-SINF | Dars42 — "Massa: gramm va kilogramm" (num-3-42) | Б6 «O'LCHOVLAR»
// Syujet: yangi blok — Lumo shahri omborlari (reja 47-satr).
// SAHNA: metodist qarori 2026-08-10 — qolgan darslarda 1-DARSNING sahnasi, Lumo shahri
//   (kitdagi `LumoCityBg`). Dars faqat o'z tugunini qo'yadi: tarozi.
// DARSLIK ASOSI (Burxonov, 3-sinf, «Sharq» 2019, massa boblari).
// YADRO: massa tarozi bilan taqqoslash orqali topiladi. 1 kg = 1000 g. Kichik narsa
//   grammda, katta narsa kilogrammda o'lchanadi.
// Misconception: M1 «katta narsa har doim og'ir»; M2 kilogramm va grammni qo'shishda
//   birlikni tenglashtirmaslik; M3 1 kg ni 100 g deb bilish; M4 tarozida faqat bir tomonni
//   sanash.
// FactCard: kosmosda narsa vaznsiz bo'ladi, lekin massasi qoladi — shuning uchun u yerda
//   massani tebranish davri bilan o'lchashadi.
// Bu dars MA'LUMOT fayli: ekranlar va mexanika kitda (`createLesson`).
// ============================================================================
const TOTAL_SCREENS = 15;
const LESSON_META = {
  lessonId: 'num-3-42',
  lessonTitle: { ru: 'Урок 42. Масса: грамм и килограмм', uz: '42-dars. Massa: gramm va kilogramm' }
};
// STRUKTURA: s0 xuk tarozi · s1 taqqoslash · s2 birlik tanlash · s3 QOIDA 1 kg = 1000 g ·
// s4 chizma bo'yicha massa · s5 saralash gramm yoki kilogramm · s6 test aylantirish ·
// s7 konsol tarozi · s8 xatoni top (birlik qo'shilgan) · s9 Bit tuzog'i (katta demak og'ir) ·
// s10 trenajyor kg dan g ga · s11 trenajyor ayirish · s12 masala ombor ·
// s13 final + FactCard · s14 yakun.
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
  // s0 — XUK: ikki qutini ko'z bilan solishtirib bo'lmaydi.
  s0: {
    eyebrow: { ru: 'Крючок', uz: 'Qiziqtirish' },
    topic: { ru: 'Масса: грамм и килограмм', uz: 'Massa: gramm va kilogramm' },
    lead: { ru: 'Две коробки: большая и маленькая', uz: 'Ikki quti: katta va kichik' },
    order_cap: { ru: 'какая тяжелее', uz: "qaysi biri og'irroq" },
    q: { ru: 'Как узнать, какая коробка тяжелее?', uz: "Qaysi quti og'irroq ekanini qanday bilamiz?" },
    opt0: { ru: 'поставить на весы', uz: 'taroziga qo\'yish' },
    opt1: { ru: 'посмотреть, какая больше', uz: 'qaysi biri kattaroq ekaniga qarash' },
    opt2: { ru: 'измерить линейкой', uz: "chizg'ich bilan o'lchash" },
    opt3: { ru: 'посчитать углы', uz: 'burchaklarni sanash' },
    audio: {
      intro: {
        ru: [
          'Фигуры остались позади. Теперь возьмёмся за величины.',
          'На складе две коробки. Одна большая, другая маленькая.',
          'Большая с ватой, маленькая с гвоздями.',
          'Как думаешь, как узнать, какая коробка тяжелее?'
        ],
        uz: [
          "Shakllar ortda qoldi. Endi kattaliklarga o'tamiz.",
          "Omborda ikki quti bor. Biri katta, ikkinchisi kichik.",
          "Kattasida paxta, kichigida mixlar.",
          "Sizningcha, qaysi quti og'irroq ekanini qanday bilamiz?"
        ]
      },
      on_correct: { ru: 'Верно! Только весы дают точный ответ. Глаз тут легко ошибается.', uz: "To'g'ri! Faqat tarozi aniq javob beradi. Ko'z bu yerda oson adashadi." },
      on_wrong1: { ru: 'Размер не решает. Коробка ваты большая, а гвозди тяжелее.', uz: "O'lcham hal qilmaydi. Paxta qutisi katta, mixlar esa og'irroq." },
      on_wrong2: { ru: 'Линейка меряет длину, а не тяжесть.', uz: "Chizg'ich uzunlikni o'lchaydi, og'irlikni emas." },
      on_idk: { ru: 'Ничего. Сейчас поставим обе на весы.', uz: "Hechqisi yo'q. Hozir ikkalasini taroziga qo'yamiz." }
    }
  },

  // s1 — MODEL: tarozi taqqoslaydi.
  s1: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil' },
    lead: { ru: 'Ставим коробки на весы', uz: "Qutilarni taroziga qo'yamiz" },
    task_line: 'вата и гвозди',
    task_line_uz: "paxta va mixlar",
    step1: 'чаша с гвоздями ниже',
    step1_cap: { ru: 'ниже — значит тяжелее', uz: 'pastroq — demak og\'irroq' },
    step2: 'гвозди 500 г, вата 300 г',
    step2_cap: { ru: 'весы дают число', uz: 'tarozi son beradi' },
    res: '500 г > 300 г',
    btn1: { ru: 'Поставить на весы', uz: "Taroziga qo'yish" },
    btn2: { ru: 'Посмотреть числа', uz: 'Sonlarga qarash' },
    done_text: { ru: 'Маленькая коробка оказалась тяжелее. Решает не размер, а масса.', uz: "Kichik quti og'irroq chiqdi. O'lcham emas, massa hal qiladi." },
    audio: {
      ru: [
        'Ставим обе коробки на весы и смотрим.',
        'Чаша с гвоздями опустилась ниже. Значит гвозди тяжелее.',
        'Весы показывают числа. Гвозди пятьсот граммов, вата триста граммов. Маленькая коробка оказалась тяжелее большой.'
      ],
      uz: [
        "Ikkala qutini taroziga qo'yib qaraymiz.",
        "Mixli tovoq pastroq tushdi. Demak mixlar og'irroq.",
        "Tarozi sonlarni ko'rsatadi. Mixlar besh yuz gramm, paxta uch yuz gramm. Kichik quti kattasidan og'irroq chiqdi."
      ]
    }
  },

  // s2 — MODEL: qaysi birlikda o'lchaymiz.
  s2: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil' },
    w: 4,
    h: 4,
    lead: { ru: 'Выбираем мерку по предмету', uz: "Narsaga qarab o'lchov tanlaymiz" },
    capA: { ru: 'ручка — граммы', uz: 'ruchka — gramm' },
    capB: { ru: 'мешок муки — килограммы', uz: 'un qopi — kilogramm' },
    res: 'мелкое в г, крупное в кг',
    btn1: { ru: 'Взвесить ручку', uz: "Ruchkani tortish" },
    btn2: { ru: 'Взвесить мешок', uz: 'Qopni tortish' },
    done_text: { ru: 'Для лёгкого берут граммы, для тяжёлого килограммы. Мерку выбирают по предмету.', uz: "Yengil narsaga gramm, og'iriga kilogramm olinadi. O'lchov narsaga qarab tanlanadi." },
    audio: {
      ru: [
        'Мерку выбирают по предмету, как раньше выбирали сантиметры или метры.',
        'Ручка лёгкая, её масса десять граммов. В килограммах такое число не запишешь.',
        'Мешок муки тяжёлый, его масса пять килограммов. В граммах вышло бы пять тысяч, читать неудобно.'
      ],
      uz: [
        "O'lchov narsaga qarab tanlanadi, avval santimetr yoki metrni tanlagandek.",
        "Ruchka yengil, uning massasi o'n gramm. Kilogrammda bunday sonni yozib bo'lmaydi.",
        "Un qopi og'ir, uning massasi besh kilogramm. Grammda besh ming chiqardi, o'qish noqulay."
      ]
    }
  },

  // s3 — QOIDA: 1 kg = 1000 g.
  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    q: { ru: 'Сколько граммов в одном килограмме?', uz: 'Bir kilogrammda necha gramm bor?' },
    opts: [
      { ru: '1000 г', uz: '1000 g' },
      { ru: '100 г', uz: '100 g' },
      { ru: '10 г', uz: '10 g' },
      { ru: '500 г', uz: '500 g' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Сто граммов это лишь десятая часть килограмма.', uz: "Yuz gramm bu kilogrammning atigi o'ndan bir qismi." },
      2: { ru: 'Десять граммов это совсем мало, столько весит ручка.', uz: "O'n gramm juda kam, ruchka shuncha tortadi." },
      3: { ru: 'Пятьсот граммов это половина килограмма.', uz: "Besh yuz gramm bu kilogrammning yarmi." }
    },
    on_correct: { ru: 'Верно. В килограмме тысяча граммов.', uz: "To'g'ri. Kilogrammda ming gramm bor." },
    rule_lines: {
      ru: ['1 кг = 1000 г', 'лёгкое меряют в граммах', 'тяжёлое в килограммах'],
      uz: ["1 kg = 1000 g", "yengil narsa grammda", "og'ir narsa kilogrammda"]
    },
    rule_ex: '2 кг = 2000 г',
    rule_speech: { ru: 'В одном килограмме тысяча граммов. Лёгкие предметы меряют в граммах, тяжёлые в килограммах. Чтобы перевести килограммы в граммы, умножают на тысячу.', uz: "Bir kilogrammda ming gramm bor. Yengil narsalar grammda, og'irlari kilogrammda o'lchanadi. Kilogrammni grammga o'tkazish uchun mingga ko'paytiriladi." },
    audio: {
      intro: { ru: 'Соберём правило. Две мерки массы связаны между собой.', uz: "Qoidani yig'amiz. Massaning ikki o'lchovi o'zaro bog'liq." }
    }
  },

  // s4 — CHIZMA: tarozidagi toshlar.
  s4: {
    eyebrow: { ru: 'Чертёж', uz: 'Chizma' },
    q: { ru: 'На чаше три гири по 200 г. Какова масса?', uz: "Tovoqda 200 g dan uchta tosh bor. Massasi qancha?" },
    fig_w: 3,
    fig_h: 2,
    opts: [
      { ru: '600 г', uz: '600 g' },
      { ru: '200 г', uz: '200 g' },
      { ru: '203 г', uz: '203 g' },
      { ru: '6 кг', uz: '6 kg' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Двести это одна гиря, а их три.', uz: "Ikki yuz bu bitta tosh, ular esa uchta." },
      2: { ru: 'Числа гирь складывают, а не приписывают друг к другу.', uz: "Toshlar soni qo'shiladi, yonma-yon yozilmaydi." },
      3: { ru: 'Шесть килограммов это шесть тысяч граммов, слишком много.', uz: "Olti kilogramm bu olti ming gramm, juda ko'p." }
    },
    audio: {
      intro: { ru: 'Посмотри на чертёж. На чаше три гири по двести граммов. Какова масса?', uz: "Chizmaga qarang. Tovoqda ikki yuz grammdan uchta tosh bor. Massasi qancha?" },
      on_correct: { ru: 'Верно. Три раза по двести, шестьсот граммов.', uz: "To'g'ri. Ikki yuzdan uch marta, olti yuz gramm." },
      on_wrong: { ru: 'Сложи массы всех гирь.', uz: "Hamma toshning massasini qo'shing." }
    }
  },

  // s5 — SARALASH: qaysi birlik.
  s5: {
    eyebrow: { ru: 'Сортировка', uz: 'Saralash' },
    lead: { ru: 'Разложи предметы по меркам', uz: "Narsalarni o'lchovlarga ajrating" },
    bin_a: { ru: 'граммы', uz: 'gramm' },
    bin_b: { ru: 'килограммы', uz: 'kilogramm' },
    items: [
      { n: { ru: 'карандаш', uz: 'qalam' }, a: true, hint: { ru: 'Карандаш лёгкий, его масса несколько граммов.', uz: "Qalam yengil, massasi bir necha gramm." } },
      { n: { ru: 'мешок картошки', uz: 'kartoshka qopi' }, a: false, hint: { ru: 'Мешок тяжёлый, счёт идёт на килограммы.', uz: "Qop og'ir, hisob kilogrammda boradi." } },
      { n: { ru: 'конфета', uz: 'konfet' }, a: true, hint: { ru: 'Конфета лёгкая, это граммы.', uz: "Konfet yengil, bu gramm." } },
      { n: { ru: 'школьник', uz: "o'quvchi" }, a: false, hint: { ru: 'Массу человека называют в килограммах.', uz: "Odam massasi kilogrammda aytiladi." } }
    ],
    audio: {
      intro: { ru: 'Четыре предмета. Отправь каждый к своей мерке.', uz: "To'rtta narsa. Har birini o'z o'lchoviga yuboring." },
      on_correct: { ru: 'Всё на месте. Лёгкое меряют в граммах, тяжёлое в килограммах.', uz: "Hammasi joyida. Yengil narsa grammda, og'iri kilogrammda o'lchanadi." },
      on_wrong: { ru: 'Прикинь, поднимешь ли ты это одной рукой.', uz: "Buni bir qo'l bilan ko'tara olasizmi, chamalab ko'ring." }
    }
  },

  // s6 — TEST: kg dan g ga.
  s6: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv' },
    q: { ru: 'Сколько граммов в 3 кг?', uz: '3 kg da necha gramm bor?' },
    opts: [
      { ru: '3000 г', uz: '3000 g' },
      { ru: '300 г', uz: '300 g' },
      { ru: '30 г', uz: '30 g' },
      { ru: '1003 г', uz: '1003 g' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Триста граммов это меньше половины килограмма.', uz: "Uch yuz gramm bu kilogrammning yarmidan kam." },
      2: { ru: 'Тридцать граммов это совсем немного.', uz: "O'ttiz gramm juda oz." },
      3: { ru: 'Килограммы не приписывают к тысяче, их умножают.', uz: "Kilogramm mingga yonma-yon yozilmaydi, ko'paytiriladi." }
    },
    audio: {
      intro: { ru: 'Быстрый вопрос. Сколько граммов в трёх килограммах?', uz: "Tez savol. Uch kilogrammda necha gramm bor?" },
      on_correct: { ru: 'Верно. Три раза по тысяче.', uz: "To'g'ri. Mingdan uch marta." },
      on_wrong: { ru: 'В одном килограмме тысяча граммов, значит умножай на тысячу.', uz: "Bir kilogrammda ming gramm, demak mingga ko'paytiring." }
    }
  },

  // s7 — KONSOL: tarozini muvozanatga keltirish.
  s7: {
    eyebrow: { ru: 'Консоль', uz: 'Konsol' },
    lead: { ru: 'Уравновесь весы: слева 2 кг', uz: "Tarozini muvozanatga keltiring: chapda 2 kg" },
    swap_line: 'весы 2 кг',
    cells: [
      { head: { ru: 'слева, граммов', uz: 'chapda, gramm' }, label: '2 кг', ans: 2000, hint: { ru: 'Два раза по тысяче.', uz: "Mingdan ikki marta." } },
      { head: { ru: 'уже справа', uz: "o'ngda bor" }, label: 'граммов', ans: 800, hint: { ru: 'Это число дано в условии.', uz: 'Bu son shartda berilgan.' } },
      { head: { ru: 'добавить', uz: "qo'shish kerak" }, label: '2000 − 800', ans: 1200, hint: { ru: 'Из левой массы вычти то, что уже справа.', uz: "Chap massadan o'ngda borini ayiring." } }
    ],
    check: '2000 г = 800 г + 1200 г',
    check_label: { ru: 'обе чаши в граммах', uz: 'ikkala tovoq grammda' },
    audio: {
      intro: { ru: 'Заполни три окна. Слева два килограмма, справа уже восемьсот граммов.', uz: "Uchta oynani to'ldiring. Chapda ikki kilogramm, o'ngda esa sakkiz yuz gramm bor." },
      on_correct: { ru: 'Две тысячи граммов слева, восемьсот справа, добавить надо тысячу двести. Обе чаши считали в одной мерке.', uz: "Chapda ikki ming gramm, o'ngda sakkiz yuz, ming ikki yuz qo'shish kerak. Ikkala tovoq bitta o'lchovda hisoblandi." }
    }
  },

  // s8 — XATONI TOP: birliklar tenglashtirilmagan (M2).
  s8: {
    eyebrow: { ru: 'Найди ошибку', uz: 'Xatoni toping' },
    q: { ru: 'Записали: 2 кг + 500 г = 502. Где ошибка?', uz: "2 kg + 500 g = 502 deb yozilibdi. Xato qayerda?" },
    fig_line: '2 кг + 500 г',
    opts: [
      { ru: 'не привели к одной мерке', uz: "bitta o'lchovga keltirilmagan" },
      { ru: 'ошибки нет', uz: "xato yo'q" },
      { ru: 'неверно сложили', uz: "noto'g'ri qo'shilgan" },
      { ru: 'взяли не те числа', uz: "sonlar noto'g'ri olingan" }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Килограммы и граммы это разные мерки, их числа не складывают.', uz: "Kilogramm va gramm har xil o'lchov, ularning soni qo'shilmaydi." },
      2: { ru: 'Сложение само по себе верное, подвели мерки.', uz: "Qo'shishning o'zi to'g'ri, o'lchovlar aldadi." },
      3: { ru: 'Числа из условия взяты правильно.', uz: "Sonlar shartdan to'g'ri olingan." }
    },
    audio: {
      intro: { ru: 'Кто-то сложил килограммы с граммами напрямую. Найди ошибку.', uz: "Kimdir kilogrammni gramm bilan to'g'ridan-to'g'ri qo'shibdi. Xatoni toping." },
      on_correct: { ru: 'Верно. Сначала переводят к одной мерке. Два килограмма это две тысячи граммов, и тогда выйдет две тысячи пятьсот.', uz: "To'g'ri. Avval bitta o'lchovga o'tkaziladi. Ikki kilogramm bu ikki ming gramm, shunda ikki ming besh yuz chiqadi." },
      on_wrong: { ru: 'Посмотри на мерки рядом с числами.', uz: "Sonlar yonidagi o'lchovlarga qarang." }
    }
  },

  // s9 — BIT TUZOG'I: katta demak og'ir (M1).
  s9: {
    eyebrow: { ru: 'Ловушка Бита', uz: "Bit tuzog'i" },
    lead: { ru: 'Бит сортирует ящики склада', uz: 'Bit ombor yashiklarini saralayapti' },
    lines: ['большой ящик с ватой, маленький с болтами', 'Бит: большой тяжелее, он же больше'],
    lines_uz: ["katta yashikda paxta, kichigida bolt", "Bit: kattasi og'irroq, axir u kattaroq"],
    line_cap: { ru: 'Бит: размер решает', uz: "Bit: o'lcham hal qiladi" },
    trap_label: { ru: 'Так ли это?', uz: 'Shundaymi?' },
    trap_opts: { ru: ['нет, надо взвесить', 'да, большой всегда тяжелее'], uz: ["yo'q, tortib ko'rish kerak", "ha, kattasi har doim og'irroq"] },
    trap_ci: 0,
    trap_correct: { ru: 'Да. Размер и масса это разные вещи. Ящик ваты большой и лёгкий, ящик болтов маленький и тяжёлый. Ответ даёт только весы.', uz: "Ha. O'lcham va massa har xil narsa. Paxta yashigi katta va yengil, bolt yashigi kichik va og'ir. Javobni faqat tarozi beradi." },
    trap_wrong: { ru: 'Вспомни коробку ваты и коробку гвоздей. Большая была легче.', uz: "Paxta qutisi va mix qutisini eslang. Kattasi yengilroq edi." },
    audio: {
      ru: [
        'Бит сортирует ящики на складе.',
        'Этот ящик больше, значит он и тяжелее. Ставлю его вниз.',
        'Так ли это?'
      ],
      uz: [
        "Bit omborda yashiklarni saralayapti.",
        "Bu yashik kattaroq, demak og'irroq ham. Uni pastga qo'yaman.",
        "Shundaymi?"
      ]
    }
  },

  // s10 — TRENAJYOR: kg dan g ga.
  s10: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq' },
    q: { ru: 'Сколько граммов в 5 кг?', uz: '5 kg da necha gramm bor?' },
    ans: 5000,
    check: '5 · 1000',
    check_label: { ru: 'килограммы в граммы', uz: 'kilogrammdan grammga' },
    hint: { ru: 'Умножь пять на тысячу.', uz: "Beshni mingga ko'paytiring." },
    audio: {
      intro: { ru: 'Теперь считай сам. Сколько граммов в пяти килограммах?', uz: "Endi o'zingiz hisoblang. Besh kilogrammda necha gramm bor?" },
      on_correct: { ru: 'Пять тысяч граммов.', uz: "Besh ming gramm." }
    }
  },

  // s11 — TRENAJYOR: massa ayirmasi.
  s11: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq' },
    q: { ru: 'В пакете было 900 г риса, отсыпали 400 г. Сколько граммов осталось?', uz: "Paketda 900 g guruch bor edi, 400 g olindi. Necha gramm qoldi?" },
    ans: 500,
    check: '900 − 400',
    check_label: { ru: 'мерка одна, вычитаем', uz: "o'lchov bitta, ayiramiz" },
    hint: { ru: 'Из девятисот вычти четыреста.', uz: "To'qqiz yuzdan to'rt yuzni ayiring." },
    audio: {
      intro: { ru: 'В пакете было девятьсот граммов риса, отсыпали четыреста. Сколько осталось?', uz: "Paketda to'qqiz yuz gramm guruch bor edi, to'rt yuz olindi. Qancha qoldi?" },
      on_correct: { ru: 'Пятьсот граммов, это половина килограмма.', uz: "Besh yuz gramm, bu kilogrammning yarmi." }
    }
  },

  // s12 — MASALA: ikki amal, birlik tenglashtirish.
  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    lead: { ru: 'Склад кристаллов', uz: 'Kristall ombori' },
    q: { ru: 'В ящике 3 кг кристаллов. Отсыпали 700 г. Сколько граммов было и сколько осталось?', uz: "Yashikda 3 kg kristall bor. 700 g olindi. Necha gramm bor edi va qancha qoldi?" },
    q_speech: { ru: 'в ящике три килограмма кристаллов, отсыпали семьсот граммов. Сколько граммов было и сколько осталось?', uz: "yashikda uch kilogramm kristall bor, yetti yuz gramm olindi. Necha gramm bor edi va qancha qoldi?" },
    tbl_heads: [
      { ru: 'было', uz: 'bor edi' },
      { ru: 'взяли', uz: 'olindi' },
      { ru: 'вопрос', uz: 'savol' }
    ],
    tbl_cells: ['3 кг', '700 г', '?'],
    pick_label: { ru: 'С какого действия начинаем?', uz: 'Qaysi amaldan boshlaymiz?' },
    opts: [
      { ru: 'перевести кг в граммы', uz: 'kg ni grammga o\'tkazish' },
      { ru: 'сразу вычесть 700', uz: "darrov 700 ni ayirish" },
      { ru: 'сложить 3 и 700', uz: "3 va 700 ni qo'shish" },
      { ru: 'разделить на 700', uz: "700 ga bo'lish" }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Из трёх килограммов семьсот граммов вычесть нельзя. Мерки разные.', uz: "Uch kilogrammdan yetti yuz grammni ayirib bo'lmaydi. O'lchovlar har xil." },
      2: { ru: 'Складывать числа разных мерок тоже нельзя.', uz: "Har xil o'lchov sonlarini qo'shib ham bo'lmaydi." },
      3: { ru: 'Деление тут ничего не даёт.', uz: "Bo'lish bu yerda hech nima bermaydi." }
    },
    pick_ok: { ru: 'Верно. Сначала одна мерка, потом вычитание.', uz: "To'g'ri. Avval bitta o'lchov, keyin ayirish." },
    step1_q: { ru: 'Сколько граммов было в ящике?', uz: 'Yashikda necha gramm bor edi?' },
    ans1: 3000,
    hint1: { ru: 'Три умножь на тысячу.', uz: "Uchni mingga ko'paytiring." },
    step2_q: { ru: 'Сколько граммов осталось?', uz: 'Necha gramm qoldi?' },
    ans2: 2300,
    hint2: { ru: 'Из трёх тысяч вычти семьсот.', uz: "Uch mingdan yetti yuzni ayiring." },
    check: '3000 − 700 = 2300',
    setup_audio: { ru: 'На складе считают кристаллы. Посмотри на таблицу и реши, с чего начать.', uz: "Omborda kristallar hisoblanmoqda. Jadvalga qarang va nimadan boshlashni hal qiling." },
    audio: {
      intro: { ru: 'В ящике три килограмма кристаллов, отсыпали семьсот граммов. Сколько было и сколько осталось?', uz: "Yashikda uch kilogramm kristall bor, yetti yuz gramm olindi. Qancha bor edi va qancha qoldi?" },
      on_correct: { ru: 'Было три тысячи граммов, осталось две тысячи триста. Сначала привели к одной мерке.', uz: "Uch ming gramm bor edi, ikki ming uch yuz qoldi. Avval bitta o'lchovga keltirdik." },
      on_wrong: { ru: 'Разные мерки сначала приводят к одной.', uz: "Har xil o'lchovlar avval bittaga keltiriladi." }
    }
  },

  // s13 — FINAL: uchta topshiriq + FaktCard.
  s13: {
    eyebrow: { ru: 'Финал', uz: 'Yakuniy' },
    intro_line: { ru: 'Три задания. Следи за меркой', uz: "Uchta topshiriq. O'lchovga qarang" },
    items: [
      {
        kind: 'num',
        q: { ru: 'Сколько граммов в 4 кг?', uz: '4 kg da necha gramm bor?' },
        q_speech: { ru: 'сколько граммов в четырёх килограммах?', uz: "to'rt kilogrammda necha gramm bor?" },
        ans: 4000,
        hint: { ru: 'Умножь четыре на тысячу.', uz: "To'rtni mingga ko'paytiring." }
      },
      {
        kind: 'num',
        q: { ru: 'Масса дыни 2 кг, арбуза 6 кг. На сколько килограммов арбуз тяжелее?', uz: "Qovun 2 kg, tarvuz 6 kg. Tarvuz necha kilogramm og'ir?" },
        q_speech: { ru: 'масса дыни два килограмма, арбуза шесть. На сколько килограммов арбуз тяжелее?', uz: "qovun ikki kilogramm, tarvuz olti. Tarvuz necha kilogramm og'ir?" },
        ans: 4,
        hint: { ru: 'Из шести вычти два.', uz: "Oltidan ikkini ayiring." }
      },
      {
        kind: 'num',
        q: { ru: 'В пачке 500 г. Сколько граммов в двух таких пачках?', uz: "Bir paketda 500 g. Shunday ikki paketda necha gramm bor?" },
        q_speech: { ru: 'в пачке пятьсот граммов. Сколько граммов в двух таких пачках?', uz: "bir paketda besh yuz gramm. Shunday ikki paketda necha gramm bor?" },
        ans: 1000,
        hint: { ru: 'Две пачки по пятьсот дают ровно килограмм.', uz: "Besh yuzdan ikki paket rosa bir kilogramm beradi." }
      }
    ],
    fact_badge: { ru: 'Знаешь ли ты?', uz: 'Bilasizmi?' },
    fact_text: {
      ru: 'В космосе обычные весы бесполезны: там ничего не давит на чашу. Но масса у предмета остаётся. Космонавты меряют её качанием: предмет закрепляют на пружине и считают, как быстро он качается. Тяжёлый качается медленнее лёгкого.',
      uz: "Kosmosda oddiy tarozi foydasiz: u yerda hech nima tovoqqa bosmaydi. Lekin narsaning massasi qoladi. Kosmonavtlar uni tebranish bilan o'lchaydi: narsa prujinaga mahkamlanib, qanchalik tez tebranishi sanaladi. Og'iri yengilidan sekinroq tebranadi."
    },
    fact_audio: {
      ru: 'Вот что интересно. В космосе обычные весы бесполезны. Там ничего не давит на чашу, и стрелка стоит на нуле, даже если положить кирпич. Но масса у предмета никуда не делась. Космонавты придумали мерить её качанием. Предмет закрепляют на пружине и смотрят, как быстро он качается. Тяжёлый качается медленно, лёгкий быстро. По времени качания и узнают массу.',
      uz: "Mana qizig'i. Kosmosda oddiy tarozi foydasiz. U yerda hech nima tovoqqa bosmaydi, g'isht qo'ysangiz ham strelka nolda turadi. Lekin narsaning massasi yo'qolgani yo'q. Kosmonavtlar uni tebranish bilan o'lchashni o'ylab topishgan. Narsa prujinaga mahkamlanib, qanchalik tez tebranishi kuzatiladi. Og'iri sekin, yengili tez tebranadi. Tebranish vaqtiga qarab massa aniqlanadi."
    },
    audio: {
      intro: { ru: 'Три задания напоследок. Каждый раз смотри, в какой мерке спрашивают.', uz: "Oxirida uchta topshiriq. Har safar qaysi o'lchovda so'ralganiga qarang." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Приведи величины к одной мерке.', uz: "Kattaliklarni bitta o'lchovga keltiring." }
    }
  },

  // s14 — YAKUN: keyingisi vaqt (reja 48-satr).
  s14: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    mission_done: { ru: 'Склад взвешен!', uz: 'Ombor tortildi!' },
    cando: {
      ru: ['узнаю массу по весам', 'перевожу килограммы в граммы', 'привожу мерки к одной'],
      uz: ["tarozi bo'yicha massani bilaman", "kilogrammni grammga o'tkazaman", "o'lchovlarni bittaga keltiraman"]
    },
    rule_recap: { ru: 'В одном килограмме тысяча граммов, а размер о массе ничего не говорит.', uz: "Bir kilogrammda ming gramm bor, o'lcham esa massa haqida hech nima aytmaydi." },
    conn_label_refs: { ru: 'опирается на', uz: 'nimaga tayanadi' },
    conn_refs: { ru: 'урок 10: умножение на 1000; урок 34: единицы измерения', uz: "10-dars: 1000 ga ko'paytirish; 34-dars: o'lchov birliklari" },
    conn_label_next: { ru: 'дальше', uz: 'keyin' },
    conn_next: { ru: 'время: час, минута и секунда', uz: 'vaqt: soat, daqiqa va soniya' },
    audio: {
      ru: 'Склад взвешен. Запомни главное. Массу узнают весами, а не глазом. Большая коробка ваты легче маленькой коробки гвоздей. Лёгкое меряют в граммах, тяжёлое в килограммах, и в одном килограмме ровно тысяча граммов. А самое важное правило такое. Прежде чем складывать или вычитать, приведи обе величины к одной мерке. В следующий раз возьмём другую величину, которую нельзя потрогать. Это время!',
      uz: "Ombor tortildi. Asosiysini eslab qoling. Massa ko'z bilan emas, tarozi bilan bilinadi. Katta paxta qutisi kichik mix qutisidan yengil. Yengil narsa grammda, og'iri kilogrammda o'lchanadi, bir kilogrammda esa rosa ming gramm bor. Eng muhim qoida esa bu. Qo'shish yoki ayirishdan oldin ikkala kattalikni bitta o'lchovga keltiring. Keyingi safar ushlab bo'lmaydigan boshqa kattalikni olamiz. Bu vaqt!"
    }
  }
};

const BRIDGES = {
  s1:  { ru: 'Поставим на весы.', uz: "Taroziga qo'yamiz." },
  s2:  { ru: 'Теперь выберем мерку.', uz: "Endi o'lchov tanlaymiz." },
  s3:  { ru: "Соберём это в правило.", uz: "Buni qoidaga yig'amiz." },
  s4:  { ru: 'Прочитай чертёж.', uz: "Chizmani o'qing." },
  s5:  { ru: 'Разложи предметы.', uz: 'Narsalarni ajrating.' },
  s6:  { ru: 'Быстрый вопрос.', uz: 'Tez savol.' },
  s7:  { ru: 'Заполни консоль.', uz: "Konsolni to'ldiring." },
  s8:  { ru: 'Тут сложили разные мерки.', uz: "Bu yerda har xil o'lchov qo'shilibdi." },
  s9:  { ru: 'А вот и Бит со своим правилом.', uz: "Mana Bit ham o'z qoidasi bilan." },
  s10: { ru: 'Теперь считай сам.', uz: "Endi o'zingiz hisoblang." },
  s11: { ru: 'И ещё один пакет.', uz: 'Yana bitta paket.' },
  s12: { ru: 'Задача со склада.', uz: 'Ombordan masala.' },
  s13: { ru: 'Финальная проверка.', uz: 'Yakuniy tekshiruv.' },
  s14: { ru: 'Подведём итог.', uz: 'Yakun yasaymiz.' }
};

const S14_PAYOFF = {
  ru: 'Склад взвешен. Мерка выбрана, и обе чаши сошлись.',
  uz: "Ombor tortildi. O'lchov tanlandi va ikkala tovoq tenglashdi."
};

// --- SAHNA TUGUNI (D42): 1-DARSNING Lumo shahri kitdan (`LumoCityBg`), ustiga darsning
// o'z qatlami — tarozi va toshlar. Metodist qarori 2026-08-10: qolgan darslarda shu sahna.
const ScaleNodeLayer = () => (
  <svg className="lm-scene-bg" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <g transform="translate(196 118)">
      <rect x="-30" y="52" width="60" height="10" rx="3" fill="#C6AE7E" stroke="#8A7550" strokeWidth="1.2"/>
      <rect x="-4" y="-4" width="8" height="58" fill="#B7A176" stroke="#8A7550" strokeWidth="1"/>
      <line x1="-52" y1="-6" x2="52" y2="-6" stroke="#8A7550" strokeWidth="3" strokeLinecap="round"/>
      <g>
        <line x1="-52" y1="-6" x2="-52" y2="8" stroke="#8A7550" strokeWidth="1.4"/>
        <path d="M-70 8 h36 l-8 14 h-20 Z" fill="#DCEBF5" stroke="#7FA8BF" strokeWidth="1.4"/>
        <text x="-52" y="19" textAnchor="middle" fontSize="7" fontWeight="800" fill="#3F5A6B" fontFamily="'JetBrains Mono', monospace">g</text>
      </g>
      <g>
        <line x1="52" y1="-6" x2="52" y2="14" stroke="#8A7550" strokeWidth="1.4"/>
        <path d="M34 14 h36 l-8 14 h-20 Z" fill="#FFD98A" stroke="#C06A2E" strokeWidth="1.4"/>
        <text x="52" y="25" textAnchor="middle" fontSize="7" fontWeight="800" fill="#8A5A2E" fontFamily="'JetBrains Mono', monospace">kg</text>
      </g>
      <circle cx="0" cy="-6" r="4" fill="#FFE6A6" stroke="#8A7550" strokeWidth="1.2"/>
      <text x="0" y="74" textAnchor="middle" fontSize="7" letterSpacing="1.4" fill="#3F5A6B" fontFamily="'JetBrains Mono', monospace">1 kg = 1000 g</text>
    </g>
    <g transform="translate(96 176)">
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${i * 20} 0)`}>
          <path d="M0 0 h14 l3 12 h-20 Z" fill="#C9BCA2" stroke="#8A7550" strokeWidth="1"/>
          <rect x="4" y="-4" width="6" height="4" rx="1.5" fill="none" stroke="#8A7550" strokeWidth="1"/>
        </g>
      ))}
    </g>
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
      <LumoCityBg fill/>
      <ScaleNodeLayer/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};

// --- EKRAN CHIZMASI (s4): tovoqda uchta bir xil tosh.
const WeightsFig = () => (
  <svg viewBox="0 0 220 120" style={{ width: 'min(260px, 82%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <path d="M20 46 h180 l-24 40 h-132 Z" fill="#F7F1E4" stroke="#8A7550" strokeWidth="2" strokeLinejoin="round"/>
    <line x1="110" y1="46" x2="110" y2="18" stroke="#8A7550" strokeWidth="2"/>
    <line x1="60" y1="18" x2="160" y2="18" stroke="#8A7550" strokeWidth="2.4" strokeLinecap="round"/>
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(${58 + i * 38} 22)`}>
        <path d="M0 0 h26 l5 20 h-36 Z" fill="#DCEBF5" stroke="#2E7E9E" strokeWidth="1.6"/>
        <rect x="9" y="-6" width="8" height="6" rx="2" fill="none" stroke="#2E7E9E" strokeWidth="1.4"/>
        <text x="13" y="15" textAnchor="middle" fontSize="8" fontWeight="800" fill="#2E7E9E" fontFamily="'JetBrains Mono', monospace">200</text>
      </g>
    ))}
    <text x="110" y="108" textAnchor="middle" fontSize="10" fontWeight="800" fill="#8A7550" fontFamily="'JetBrains Mono', monospace">? g</text>
  </svg>
);

// --- FACTCARD QAHRAMONI: prujinada tebranayotgan narsa — kosmosdagi tarozi.
const SpringFig = () => (
  <svg viewBox="0 0 220 104" style={{ width: 'min(266px, 84%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <line x1="30" y1="16" x2="190" y2="16" stroke="#8A7550" strokeWidth="3" strokeLinecap="round"/>
    <g transform="translate(74 16)">
      <path d="M0 0 v8 l-10 6 l20 8 l-20 8 l20 8 l-10 6 v6" fill="none" stroke="#2E7E9E" strokeWidth="2.2" strokeLinejoin="round"/>
      <rect x="-14" y="50" width="28" height="20" rx="4" fill="#DCEBF5" stroke="#2E7E9E" strokeWidth="1.8"/>
      <text x="0" y="86" textAnchor="middle" fontSize="9" fontWeight="800" fill="#2E7E9E" fontFamily="'JetBrains Mono', monospace">tez</text>
    </g>
    <g transform="translate(150 16)">
      <path d="M0 0 v12 l-12 8 l24 10 l-24 10 l24 10 l-12 8 v4" fill="none" stroke="#C06A2E" strokeWidth="2.2" strokeLinejoin="round"/>
      <rect x="-18" y="62" width="36" height="24" rx="4" fill="#FFD98A" stroke="#C06A2E" strokeWidth="1.8"/>
      <text x="0" y="100" textAnchor="middle" fontSize="9" fontWeight="800" fill="#C06A2E" fontFamily="'JetBrains Mono', monospace">sekin</text>
    </g>
  </svg>
);

export default createLesson({
  TOTAL_SCREENS, LESSON_META, SCREEN_META, CONTENT, BRIDGES, S14_PAYOFF,
  STYLES: LESSON_STYLES,
  Scene: LessonScene,
  FactFig: SpringFig,
  figs: { s4: <WeightsFig/> }
});
