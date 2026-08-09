import React from 'react';
import { BitSVG, LUMO_CAST, LumoCityBg, createLesson } from './_kit/index.jsx';
import { LESSON_STYLES } from './_kit/styles.js';

// ============================================================================
// DD 3-SINF | Dars51 — "Takrorlash: butun yo'l" (num-3-51) | Б6 «O'LCHOVLAR»
// Syujet: Lumo shahri, kursning yakuni (reja 56-satr).
// SAHNA: 1-DARSNING shahri, tugun — bosib o'tilgan yo'l xaritasi.
// YADRO: kurs bo'ylab o'tilgan asosiy qoidalar bitta darsda birlashadi: xona qiymati,
//   to'rt amal va ularning tartibi, ulush, yuza va perimetr, o'lchovlar, tenglama, ma'lumot.
// Misconception: M1 amallar tartibini unutish; M2 o'lchovlarni tenglashtirmaslik; M3 yuza
//   va perimetrni chalkashtirish; M4 birinchi amalni javob deb yozish.
// FactCard: matematikani bir odam emas, ko'p xalq yaratgan — nol Hindistondan, algebra
//   Xorazmdan, teng belgisi Angliyadan.
// Bu dars MA'LUMOT fayli: ekranlar va mexanika kitda (`createLesson`).
// ============================================================================
const TOTAL_SCREENS = 15;
const LESSON_META = {
  lessonId: 'num-3-51',
  lessonTitle: { ru: 'Урок 51. Повторение: весь путь', uz: "51-dars. Takrorlash: butun yo'l" }
};
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
  s0: {
    eyebrow: { ru: 'Крючок', uz: 'Qiziqtirish' },
    topic: { ru: 'Повторение курса', uz: 'Kursni takrorlash' },
    lead: { ru: 'Карта пройденного пути', uz: "Bosib o'tilgan yo'l xaritasi" },
    order_cap: { ru: 'от сотен до диаграмм', uz: 'yuzliklardan diagrammalargacha' },
    q: { ru: 'Что нужно сделать раньше всего в записи 3 + 6 · 2?', uz: "3 + 6 · 2 yozuvida avvalo nima qilinadi?" },
    opt0: { ru: 'умножение', uz: "ko'paytirish" },
    opt1: { ru: 'сложение', uz: "qo'shish" },
    opt2: { ru: 'слева направо', uz: "chapdan o'ngga" },
    opt3: { ru: 'всё равно', uz: 'baribir' },
    audio: {
      intro: {
        ru: [
          'Мы прошли весь курс. Сегодня соберём главное вместе.',
          'На стене висит карта нашего пути. От сотен и десятков до диаграмм.',
          'Начнём с того, что встречается чаще всего.',
          'Как думаешь, что нужно сделать раньше в записи три плюс шесть умножить на два?'
        ],
        uz: [
          "Butun kursni bosib o'tdik. Bugun asosiysini birga yig'amiz.",
          "Devorda yo'limiz xaritasi osilgan. Yuzlik va o'nlikdan diagrammalargacha.",
          "Eng ko'p uchraydigan narsadan boshlaymiz.",
          "Sizningcha, uch qo'shuv olti ko'paytiruv ikki yozuvida avvalo nima qilinadi?"
        ]
      },
      on_correct: { ru: 'Верно! Умножение идёт раньше сложения, получится пятнадцать.', uz: "To'g'ri! Ko'paytirish qo'shishdan oldin bajariladi, o'n besh chiqadi." },
      on_wrong1: { ru: 'Сложение идёт после. Иначе получилось бы восемнадцать.', uz: "Qo'shish keyin bajariladi. Aks holda o'n sakkiz chiqardi." },
      on_wrong2: { ru: 'Слева направо считают только равные по силе действия.', uz: "Chapdan o'ngga faqat kuchi teng amallar hisoblanadi." },
      on_idk: { ru: 'Ничего. Сейчас пройдёмся по карте и всё вспомним.', uz: "Hechqisi yo'q. Hozir xarita bo'ylab yurib, hammasini eslaymiz." }
    }
  },

  s1: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil' },
    lead: { ru: 'Порядок действий и разряды', uz: 'Amallar tartibi va xonalar' },
    task_line: '3 + 6 · 2',
    task_line_uz: "3 + 6 · 2",
    step1: '6 · 2 = 12',
    step1_cap: { ru: 'сначала умножение', uz: "avval ko'paytirish" },
    step2: '3 + 12 = 15',
    step2_cap: { ru: 'потом сложение', uz: "keyin qo'shish" },
    res: '15 = 1 десяток и 5',
    btn1: { ru: 'Сделать умножение', uz: "Ko'paytirishni bajarish" },
    btn2: { ru: 'Сделать сложение', uz: "Qo'shishni bajarish" },
    done_text: { ru: 'Умножение и деление идут раньше сложения и вычитания, если нет скобок.', uz: "Qavs bo'lmasa, ko'paytirish va bo'lish qo'shish va ayirishdan oldin bajariladi." },
    audio: {
      ru: [
        'Начнём с порядка действий, это правило работает везде.',
        'Сначала умножение. Шесть на два, двенадцать.',
        'Теперь сложение. Три плюс двенадцать, пятнадцать. А в пятнадцати один десяток и пять единиц, с этого мы когда-то и начинали курс.'
      ],
      uz: [
        "Amallar tartibidan boshlaymiz, bu qoida hamma joyda ishlaydi.",
        "Avval ko'paytirish. Oltiga ikki, o'n ikki.",
        "Endi qo'shish. Uch qo'shuv o'n ikki, o'n besh. O'n beshda esa bir o'nlik va besh birlik bor, kursni biz shundan boshlagan edik."
      ]
    }
  },

  s2: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil' },
    w: 4,
    h: 3,
    lead: { ru: 'Площадь и периметр рядом', uz: 'Yuza va perimetr yonma-yon' },
    capA: { ru: 'площадь: 4 · 3 = 12', uz: 'yuza: 4 · 3 = 12' },
    capB: { ru: 'периметр: (4 + 3) · 2 = 14', uz: 'perimetr: (4 + 3) · 2 = 14' },
    res: 'разные величины',
    btn1: { ru: 'Посчитать клетки', uz: 'Kataklarni sanash' },
    btn2: { ru: 'Обойти по краю', uz: "Chekka bo'ylab aylanish" },
    done_text: { ru: 'Площадь считает клетки внутри, периметр меряет путь по краю.', uz: "Yuza ichkaridagi kataklarni sanaydi, perimetr chekka yo'lini o'lchaydi." },
    audio: {
      ru: [
        'Вспомним геометрию. Панель четыре на три.',
        'Площадь это клетки внутри, четыре умножить на три, двенадцать квадратных единиц.',
        'Периметр это путь по краю, четыре плюс три и удвоить, четырнадцать единиц. Одна фигура, а величины разные, и путать их нельзя.'
      ],
      uz: [
        "Geometriyani eslaymiz. Panel to'rt ga uch.",
        "Yuza bu ichkaridagi kataklar, to'rtni uchga ko'paytiramiz, o'n ikki kvadrat birlik.",
        "Perimetr bu chekka yo'li, to'rt qo'shuv uch va ikkilantirish, o'n to'rt birlik. Shakl bitta, kattaliklar har xil, ularni chalkashtirib bo'lmaydi."
      ]
    }
  },

  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    q: { ru: 'Что делают перед сложением 2 м и 30 см?', uz: "2 m va 30 sm ni qo'shishdan oldin nima qilinadi?" },
    opts: [
      { ru: 'приводят к одной мерке', uz: "bitta o'lchovga keltiriladi" },
      { ru: 'сразу складывают', uz: "darrov qo'shiladi" },
      { ru: 'вычитают меньшее', uz: 'kichigi ayiriladi' },
      { ru: 'ничего не делают', uz: 'hech nima qilinmaydi' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Метры и сантиметры это разные мерки, их числа не складывают.', uz: "Metr va santimetr har xil o'lchov, ularning soni qo'shilmaydi." },
      2: { ru: 'Вычитание тут вообще не при чём.', uz: "Ayirish bu yerda umuman aloqasi yo'q." },
      3: { ru: 'Без перевода ответ выйдет неверным.', uz: "O'tkazmasdan javob noto'g'ri chiqadi." }
    },
    on_correct: { ru: 'Верно. Сначала одна мерка, потом действие.', uz: "To'g'ri. Avval bitta o'lchov, keyin amal." },
    rule_lines: {
      ru: ['сначала умножение и деление', 'мерки приводят к одной', 'ответ проверяют'],
      uz: ["avval ko'paytirish va bo'lish", "o'lchovlar bittaga keltiriladi", "javob tekshiriladi"]
    },
    rule_ex: '2 м + 30 см = 230 см',
    rule_speech: { ru: 'Три правила работают почти всюду. Умножение и деление идут раньше сложения и вычитания. Разные мерки приводят к одной. А найденный ответ проверяют, подставив его обратно.', uz: "Uchta qoida deyarli hamma joyda ishlaydi. Ko'paytirish va bo'lish qo'shish va ayirishdan oldin bajariladi. Har xil o'lchovlar bittaga keltiriladi. Topilgan javob esa qaytarib qo'yib tekshiriladi." },
    audio: {
      intro: { ru: 'Соберём главные правила курса вместе.', uz: "Kursning asosiy qoidalarini birga yig'amiz." }
    }
  },

  s4: {
    eyebrow: { ru: 'Чертёж', uz: 'Chizma' },
    q: { ru: 'Всего 12 кристаллов, треть красные. Сколько красных?', uz: "Jami 12 kristall, uchdan biri qizil. Nechta qizil bor?" },
    fig_w: 4,
    fig_h: 3,
    opts: [
      { ru: '4', uz: '4' },
      { ru: '3', uz: '3' },
      { ru: '6', uz: '6' },
      { ru: '12', uz: '12' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Три это число частей, а не кристаллов.', uz: "Uch bu qismlar soni, kristall emas." },
      2: { ru: 'Шесть это половина, а не треть.', uz: "Olti bu yarim, uchdan bir emas." },
      3: { ru: 'Двенадцать это всё целое.', uz: "O'n ikki bu butun hammasi." }
    },
    audio: {
      intro: { ru: 'Вспомним доли. Всего двенадцать кристаллов, треть из них красные.', uz: "Ulushlarni eslaymiz. Jami o'n ikkita kristall, uchdan biri qizil." },
      on_correct: { ru: 'Верно. Двенадцать разделить на три.', uz: "To'g'ri. O'n ikkini uchga bo'lamiz." },
      on_wrong: { ru: 'Раздели целое на столько частей, сколько названо.', uz: "Butunni aytilgan qism soniga bo'ling." }
    }
  },

  s5: {
    eyebrow: { ru: 'Сортировка', uz: 'Saralash' },
    lead: { ru: 'Разложи задачи по величине', uz: 'Masalalarni kattaligiga qarab ajrating' },
    bin_a: { ru: 'площадь', uz: 'yuza' },
    bin_b: { ru: 'периметр', uz: 'perimetr' },
    items: [
      { n: { ru: 'плитка на пол', uz: 'polga plitka' }, a: true, hint: { ru: 'Плитка закрывает поверхность.', uz: "Plitka yuzani yopadi." } },
      { n: { ru: 'забор вокруг сада', uz: "bog' atrofiga panjara" }, a: false, hint: { ru: 'Забор идёт по краю.', uz: "Panjara chekka bo'ylab boradi." } },
      { n: { ru: 'краска на стену', uz: 'devorga bo\'yoq' }, a: true, hint: { ru: 'Краска ложится на поверхность.', uz: "Bo'yoq yuzaga yotadi." } },
      { n: { ru: 'лента по краю ковра', uz: 'gilam chetiga lenta' }, a: false, hint: { ru: 'Лента обходит ковёр.', uz: "Lenta gilamni aylanadi." } }
    ],
    audio: {
      intro: { ru: 'Четыре задачи. Отправь каждую к своей величине.', uz: "To'rtta masala. Har birini o'z kattaligiga yuboring." },
      on_correct: { ru: 'Всё на месте. Внутри это площадь, по краю это периметр.', uz: "Hammasi joyida. Ichkarida yuza, chekkada perimetr." },
      on_wrong: { ru: 'Спроси себя, покрывает это поверхность или обходит её.', uz: "O'zingizdan so'rang, bu yuzani qoplaydimi yoki aylanadimi." }
    }
  },

  s6: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv' },
    q: { ru: 'Найди корень: x · 4 = 28', uz: 'Ildizni toping: x · 4 = 28' },
    opts: [
      { ru: '7', uz: '7' },
      { ru: '112', uz: '112' },
      { ru: '24', uz: '24' },
      { ru: '32', uz: '32' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Так получится, если умножить, а множитель находят делением.', uz: "Bu ko'paytirsangiz chiqadi, ko'paytuvchi esa bo'lish bilan topiladi." },
      2: { ru: 'Двадцать четыре это разность, а не корень.', uz: "Yigirma to'rt bu ayirma, ildiz emas." },
      3: { ru: 'Тридцать два это сумма, проверка не сойдётся.', uz: "O'ttiz ikki bu yig'indi, tekshiruv mos tushmaydi." }
    },
    audio: {
      intro: { ru: 'Вспомним уравнения. Икс умножить на четыре равно двадцать восемь.', uz: "Tenglamalarni eslaymiz. Iksni to'rtga ko'paytirsak, yigirma sakkiz." },
      on_correct: { ru: 'Верно. Множитель находят делением.', uz: "To'g'ri. Ko'paytuvchi bo'lish bilan topiladi." },
      on_wrong: { ru: 'Назови сначала, чем является икс.', uz: "Avval iks nima ekanini ayting." }
    }
  },

  s7: {
    eyebrow: { ru: 'Консоль', uz: 'Konsol' },
    lead: { ru: 'Панель 6 на 5, мерка в сантиметрах', uz: 'Panel 6 ga 5, o\'lchov santimetrda' },
    swap_line: 'панель 6 на 5',
    cells: [
      { head: { ru: 'площадь', uz: 'yuza' }, label: '6 · 5', ans: 30, hint: { ru: 'Клетки внутри.', uz: 'Ichkaridagi kataklar.' } },
      { head: { ru: 'периметр', uz: 'perimetr' }, label: '(6 + 5) · 2', ans: 22, hint: { ru: 'Путь по краю.', uz: "Chekka bo'ylab yo'l." } },
      { head: { ru: 'разница', uz: 'farq' }, label: '30 − 22', ans: 8, hint: { ru: 'На сколько числа отличаются.', uz: "Sonlar nechaga farq qiladi." } }
    ],
    check: 'S = 30 см², P = 22 см',
    check_label: { ru: 'две величины одной фигуры', uz: 'bitta shaklning ikki kattaligi' },
    audio: {
      intro: { ru: 'Заполни три окна. Площадь, периметр и разница между числами.', uz: "Uchta oynani to'ldiring. Yuza, perimetr va sonlar orasidagi farq." },
      on_correct: { ru: 'Тридцать и двадцать два, разница восемь. Числа сравнили, но величины остались разными.', uz: "O'ttiz va yigirma ikki, farq sakkiz. Sonlarni solishtirdik, kattaliklar esa har xilligicha qoldi." }
    }
  },

  s8: {
    eyebrow: { ru: 'Найди ошибку', uz: 'Xatoni toping' },
    q: { ru: 'Записали: 20 − 4 · 3 = 48. Где ошибка?', uz: "20 − 4 · 3 = 48 deb yozilibdi. Xato qayerda?" },
    fig_line: '20 − 4 · 3',
    opts: [
      { ru: 'считали слева направо', uz: "chapdan o'ngga hisoblangan" },
      { ru: 'ошибки нет', uz: "xato yo'q" },
      { ru: 'неверно умножили', uz: "noto'g'ri ko'paytirilgan" },
      { ru: 'взяли не те числа', uz: "sonlar noto'g'ri olingan" }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Сначала умножение, четыре на три, потом вычитание.', uz: "Avval ko'paytirish, to'rtga uch, keyin ayirish." },
      2: { ru: 'Умножение само по себе верное.', uz: "Ko'paytirishning o'zi to'g'ri." },
      3: { ru: 'Числа из записи взяты правильно.', uz: "Yozuvdagi sonlar to'g'ri olingan." }
    },
    audio: {
      intro: { ru: 'Кто-то посчитал по порядку записи. Найди ошибку.', uz: "Kimdir yozilish tartibi bo'yicha hisoblabdi. Xatoni toping." },
      on_correct: { ru: 'Верно. Сначала умножение, потом вычитание. Получится восемь.', uz: "To'g'ri. Avval ko'paytirish, keyin ayirish. Sakkiz chiqadi." },
      on_wrong: { ru: 'Вспомни, какое действие сильнее.', uz: "Qaysi amal kuchliroq ekanini eslang." }
    }
  },

  s9: {
    eyebrow: { ru: 'Ловушка Бита', uz: "Bit tuzog'i" },
    lead: { ru: 'Бит хвалится быстрым счётом', uz: 'Bit tez hisobi bilan maqtanyapti' },
    lines: ['1 ч 20 мин + 50 мин', 'Бит: складываю числа, получается 70 и ещё час'],
    lines_uz: ["1 soat 20 daqiqa + 50 daqiqa", "Bit: sonlarni qo'shaman, 70 va yana bir soat chiqadi"],
    line_cap: { ru: 'Бит: семьдесят минут это нормально', uz: "Bit: yetmish daqiqa normal" },
    trap_label: { ru: 'Так ли это?', uz: 'Shundaymi?' },
    trap_opts: { ru: ['нет, 60 минут это уже час', 'да, семьдесят минут бывает'], uz: ["yo'q, 60 daqiqa allaqachon bir soat", "ha, yetmish daqiqa bo'ladi"] },
    trap_ci: 0,
    trap_correct: { ru: 'Да. Семьдесят минут это час и ещё десять. Значит всего два часа десять минут. Время считают шестидесятками, и об этом легко забыть.', uz: "Ha. Yetmish daqiqa bu bir soatu yana o'n daqiqa. Demak jami ikki soatu o'n daqiqa. Vaqt oltmishlab sanaladi, buni unutish oson." },
    trap_wrong: { ru: 'Вспомни, сколько минут в часе, и посмотри на семьдесят.', uz: "Bir soatda necha daqiqa borligini eslang va yetmishga qarang." },
    audio: {
      ru: [
        'Бит складывает время.',
        'Час двадцать плюс пятьдесят минут. Складываю минуты, двадцать и пятьдесят, семьдесят. Значит час и семьдесят минут.',
        'Так ли это?'
      ],
      uz: [
        "Bit vaqtni qo'shyapti.",
        "Bir soatu yigirma qo'shuv ellik daqiqa. Daqiqalarni qo'shaman, yigirma va ellik, yetmish. Demak bir soatu yetmish daqiqa.",
        "Shundaymi?"
      ]
    }
  },

  s10: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq' },
    q: { ru: 'Вычисли: 24 : 4 + 5 · 2', uz: 'Hisoblang: 24 : 4 + 5 · 2' },
    ans: 16,
    check: '6 + 10',
    check_label: { ru: 'сначала деление и умножение', uz: "avval bo'lish va ko'paytirish" },
    hint: { ru: 'Сначала оба сильных действия, потом сложение.', uz: "Avval ikkala kuchli amal, keyin qo'shish." },
    audio: {
      intro: { ru: 'Теперь считай сам. Двадцать четыре разделить на четыре плюс пять умножить на два.', uz: "Endi o'zingiz hisoblang. Yigirma to'rtni to'rtga bo'lib, besh ko'paytiruv ikkini qo'shing." },
      on_correct: { ru: 'Шестнадцать. Шесть и десять.', uz: "O'n olti. Olti va o'n." }
    }
  },

  s11: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq' },
    q: { ru: 'Сколько сантиметров в 3 м 20 см?', uz: '3 m 20 sm da necha santimetr bor?' },
    ans: 320,
    check: '300 + 20',
    check_label: { ru: 'одна мерка', uz: "bitta o'lchov" },
    hint: { ru: 'Метры переведи в сантиметры и прибавь остаток.', uz: "Metrni santimetrga o'tkazib, qoldiqni qo'shing." },
    audio: {
      intro: { ru: 'И ещё вопрос. Сколько сантиметров в трёх метрах двадцати сантиметрах?', uz: "Yana savol. Uch metr yigirma santimetrda necha santimetr bor?" },
      on_correct: { ru: 'Триста двадцать сантиметров.', uz: "Uch yuz yigirma santimetr." }
    }
  },

  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    lead: { ru: 'Последний заказ склада', uz: 'Omborning oxirgi buyurtmasi' },
    q: { ru: 'В зале 7 полок по 6 кристаллов. Половину увезли. Сколько осталось и сколько это полок?', uz: "Zalda 6 tadan 7 javon bor. Yarmi olib ketildi. Nechtasi qoldi va bu nechta javon?" },
    q_speech: { ru: 'в зале семь полок по шесть кристаллов, половину увезли. Сколько осталось и сколько это полок?', uz: "zalda oltitadan yetti javon bor, yarmi olib ketildi. Nechtasi qoldi va bu nechta javon?" },
    tbl_heads: [
      { ru: 'полок', uz: 'javon' },
      { ru: 'на полке', uz: 'javonda' },
      { ru: 'увезли', uz: 'olib ketildi' }
    ],
    tbl_cells: ['7', '6', 'половину'],
    pick_label: { ru: 'С какого действия начинаем?', uz: 'Qaysi amaldan boshlaymiz?' },
    opts: [
      { ru: '7 · 6', uz: '7 · 6' },
      { ru: '7 : 2', uz: '7 : 2' },
      { ru: '6 : 2', uz: '6 : 2' },
      { ru: '7 + 6', uz: '7 + 6' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Половину берут от всех кристаллов, а их ещё не сосчитали.', uz: "Yarmi hamma kristalldan olinadi, ular esa hali sanalmagan." },
      2: { ru: 'Так найдётся половина одной полки.', uz: "Bunda bitta javonning yarmi topiladi." },
      3: { ru: 'Полки и кристаллы не складывают.', uz: "Javon va kristall qo'shilmaydi." }
    },
    pick_ok: { ru: 'Верно. Сначала все кристаллы, потом половина.', uz: "To'g'ri. Avval hamma kristall, keyin yarmi." },
    step1_q: { ru: 'Сколько кристаллов осталось?', uz: 'Nechta kristall qoldi?' },
    ans1: 21,
    hint1: { ru: 'Всего сорок два, половина осталась.', uz: "Jami qirq ikki, yarmi qoldi." },
    step2_q: { ru: 'Сколько это полок по 6 кристаллов?', uz: '6 tadan bu nechta javon?' },
    ans2: 3,
    hint2: { ru: 'Двадцать один раздели на шесть и посмотри на целые полки.', uz: "Yigirma birni oltiga bo'lib, butun javonlarga qarang." },
    check: '42 : 2 = 21, полных полок 3',
    setup_audio: { ru: 'Склад закрывает последний заказ. Посмотри на таблицу и реши, с чего начать.', uz: "Ombor oxirgi buyurtmani yopmoqda. Jadvalga qarang va nimadan boshlashni hal qiling." },
    audio: {
      intro: { ru: 'Семь полок по шесть кристаллов, половину увезли. Сколько осталось и сколько это полных полок?', uz: "Oltitadan yetti javon, yarmi olib ketildi. Qancha qoldi va bu nechta to'liq javon?" },
      on_correct: { ru: 'Осталось двадцать один кристалл, а это три полные полки и ещё три кристалла.', uz: "Yigirma bitta kristall qoldi, bu esa uchta to'liq javon va yana uchta kristall." },
      on_wrong: { ru: 'Сначала посчитай все кристаллы зала.', uz: "Avval zaldagi hamma kristallni sanang." }
    }
  },

  s13: {
    eyebrow: { ru: 'Финал', uz: 'Yakuniy' },
    intro_line: { ru: 'Три задания со всего курса', uz: 'Butun kursdan uchta topshiriq' },
    items: [
      {
        kind: 'num',
        q: { ru: 'Вычисли: 5 + 4 · 3', uz: 'Hisoblang: 5 + 4 · 3' },
        q_speech: { ru: 'пять плюс четыре умножить на три. Сколько получится?', uz: "besh qo'shuv to'rt ko'paytiruv uch. Nechaga teng?" },
        ans: 17,
        hint: { ru: 'Сначала умножение.', uz: "Avval ko'paytirish." }
      },
      {
        kind: 'num',
        q: { ru: 'Сторона квадрата 6 см. Чему равна площадь в см²?', uz: "Kvadrat tomoni 6 sm. Yuzasi sm² da nechaga teng?" },
        q_speech: { ru: 'сторона квадрата шесть сантиметров. Чему равна площадь?', uz: "kvadrat tomoni olti santimetr. Yuzasi nechaga teng?" },
        ans: 36,
        hint: { ru: 'Сторону умножь саму на себя.', uz: "Tomonni o'ziga ko'paytiring." }
      },
      {
        kind: 'num',
        q: { ru: 'Найди корень: x − 8 = 14', uz: 'Ildizni toping: x − 8 = 14' },
        q_speech: { ru: 'икс минус восемь равно четырнадцать. Чему равен икс?', uz: "iks ayirish sakkiz teng o'n to'rt. Iks nechaga teng?" },
        ans: 22,
        hint: { ru: 'Уменьшаемое находят сложением.', uz: "Kamayuvchi qo'shish bilan topiladi." }
      }
    ],
    fact_badge: { ru: 'Знаешь ли ты?', uz: 'Bilasizmi?' },
    fact_text: {
      ru: 'Математику не придумал один человек. Ноль и запись числа по разрядам пришли из Индии, слово алгебра из книги аль-Хорезми, знак равенства придумал англичанин, а круговую диаграмму ввела медсестра. Каждый народ добавил свой кусочек, и всё это ты держишь в голове сразу.',
      uz: "Matematikani bitta odam o'ylab topmagan. Nol va sonni xonalab yozish Hindistondan kelgan, algebra so'zi al-Xorazmiy kitobidan, teng belgisini ingliz o'ylab topgan, doiraviy diagrammani esa hamshira kiritgan. Har bir xalq o'z bo'lagini qo'shgan, siz esa bularning hammasini birdan boshingizda saqlaysiz."
    },
    fact_audio: {
      ru: 'Вот чем закончим наш курс. Математику не придумал один человек и не придумала одна страна. Ноль и запись числа по разрядам, с которой мы начинали, пришли из Индии. Слово алгебра и слово алгоритм пошли от учёного аль-Хорезми, а он жил в Хорезме. Знак равенства придумал англичанин, круговую диаграмму ввела медсестра. Каждый добавил свой маленький кусочек, и на это ушли тысячи лет. А ты держишь всё это в голове сразу, в третьем классе.',
      uz: "Kursimizni mana shu bilan tugatamiz. Matematikani bitta odam ham, bitta davlat ham o'ylab topmagan. Biz boshlagan nol va sonni xonalab yozish Hindistondan kelgan. Algebra va algoritm so'zlari al-Xorazmiy olimdan qolgan, u esa Xorazmda yashagan. Teng belgisini ingliz o'ylab topgan, doiraviy diagrammani hamshira kiritgan. Har biri o'zining kichik bo'lagini qo'shgan va bunga ming yillar ketgan. Siz esa uchinchi sinfda bularning hammasini birdan boshingizda saqlaysiz."
    },
    audio: {
      intro: { ru: 'Три задания напоследок, из разных частей курса.', uz: "Oxirida kursning har xil qismidan uchta topshiriq." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Вспомни правило для этого случая.', uz: "Bu hol uchun qoidani eslang." }
    }
  },

  s14: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    mission_done: { ru: 'Курс пройден!', uz: 'Kurs tugadi!' },
    cando: {
      ru: ['соблюдаю порядок действий', 'привожу мерки к одной', 'решаю уравнения и задачи в два действия'],
      uz: ["amallar tartibiga rioya qilaman", "o'lchovlarni bittaga keltiraman", "tenglama va ikki amalli masalalarni yechaman"]
    },
    rule_recap: { ru: 'Сначала умножение и деление, мерки приводят к одной, а ответ всегда проверяют.', uz: "Avval ko'paytirish va bo'lish, o'lchovlar bittaga keltiriladi, javob esa har doim tekshiriladi." },
    conn_label_refs: { ru: 'опирается на', uz: 'nimaga tayanadi' },
    conn_refs: { ru: 'весь курс: от разрядов до диаграмм', uz: 'butun kurs: xonalardan diagrammalargacha' },
    conn_label_next: { ru: 'дальше', uz: 'keyin' },
    conn_next: { ru: 'четвёртый класс: большие числа и новые величины', uz: "to'rtinchi sinf: katta sonlar va yangi kattaliklar" },
    audio: {
      ru: 'Курс пройден. Оглянись, какой путь мы прошли вместе. Мы начинали с сотен, десятков и единиц, научились складывать и вычитать в столбик, умножать и делить, нашли доли и научились брать часть от числа. Потом взяли фигуры, посчитали площадь и периметр, разобрали треугольники и симметрию. Дальше пошли величины. Масса, время, длина и календарь. А в конце мы решали уравнения, составные задачи и читали диаграммы. Три правила остаются с тобой. Умножение и деление идут раньше сложения. Разные мерки приводят к одной. И найденный ответ всегда проверяют. В четвёртом классе числа станут больше, а правила останутся теми же!',
      uz: "Kurs tugadi. Birga bosib o'tgan yo'limizga qarang. Biz yuzlik, o'nlik va birlikdan boshladik, ustunda qo'shish va ayirishni, ko'paytirish va bo'lishni o'rgandik, ulushlarni topib, sondan qism olishni bildik. Keyin shakllarni oldik, yuza va perimetrni hisobladik, uchburchak va simmetriyani ko'rib chiqdik. So'ng kattaliklarga o'tdik. Massa, vaqt, uzunlik va kalendar. Oxirida esa tenglama va murakkab masalalarni yechib, diagrammalarni o'qidik. Uchta qoida siz bilan qoladi. Ko'paytirish va bo'lish qo'shishdan oldin bajariladi. Har xil o'lchovlar bittaga keltiriladi. Topilgan javob esa har doim tekshiriladi. To'rtinchi sinfda sonlar kattalashadi, qoidalar esa o'sha bo'lib qoladi!"
    }
  }
};

const BRIDGES = {
  s1:  { ru: 'Начнём с порядка действий.', uz: 'Amallar tartibidan boshlaymiz.' },
  s2:  { ru: 'Теперь геометрия.', uz: 'Endi geometriya.' },
  s3:  { ru: "Соберём правила вместе.", uz: "Qoidalarni birga yig'amiz." },
  s4:  { ru: 'Вспомним доли.', uz: 'Ulushlarni eslaymiz.' },
  s5:  { ru: 'Разложи задачи.', uz: 'Masalalarni ajrating.' },
  s6:  { ru: 'Вспомним уравнения.', uz: 'Tenglamalarni eslaymiz.' },
  s7:  { ru: 'Заполни консоль.', uz: "Konsolni to'ldiring." },
  s8:  { ru: 'Тут забыли про порядок.', uz: 'Bu yerda tartib unutilibdi.' },
  s9:  { ru: 'А вот и Бит со своим счётом.', uz: "Mana Bit ham o'z hisobi bilan." },
  s10: { ru: 'Теперь считай сам.', uz: "Endi o'zingiz hisoblang." },
  s11: { ru: 'И ещё про мерки.', uz: "Yana o'lchovlar haqida." },
  s12: { ru: 'Последняя задача.', uz: 'Oxirgi masala.' },
  s13: { ru: 'Финальная проверка.', uz: 'Yakuniy tekshiruv.' },
  s14: { ru: 'Подведём итог курса.', uz: 'Kurs yakunini yasaymiz.' }
};

const S14_PAYOFF = {
  ru: 'Курс пройден. Правила собраны, и путь виден целиком.',
  uz: "Kurs tugadi. Qoidalar yig'ildi va yo'l to'liq ko'rinadi."
};

// --- SAHNA TUGUNI (D51): 1-DARSNING shahri, ustiga bosib o'tilgan yo'l xaritasi.
const MapNodeLayer = () => (
  <svg className="lm-scene-bg" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <g transform="translate(112 104)">
      <rect x="0" y="0" width="176" height="66" rx="6" fill="#FDF6E8" stroke="#8A7550" strokeWidth="2"/>
      <path d="M14 48 C 44 12, 74 60, 104 26 S 150 44, 162 18" fill="none" stroke="#C06A2E" strokeWidth="2.4" strokeDasharray="5 4"/>
      {[[14, 48], [64, 34], [104, 26], [162, 18]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4.4" fill={i === 3 ? '#8CE38A' : '#DCEBF5'} stroke="#2E7E9E" strokeWidth="1.6"/>
      ))}
      <text x="88" y="62" textAnchor="middle" fontSize="7" letterSpacing="1.2" fill="#3F5A6B" fontFamily="'JetBrains Mono', monospace">xonalardan diagrammagacha</text>
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
      <MapNodeLayer/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};

// --- EKRAN CHIZMASI (s4): 12 kristall, uchdan biri belgilangan.
const ThirdFig = () => (
  <svg viewBox="0 0 220 100" style={{ width: 'min(260px, 82%)', height: 'auto', display: 'block' }} aria-hidden="true">
    {Array.from({ length: 3 }).map((_, r) => (
      Array.from({ length: 4 }).map((_, c) => (
        <circle key={`${r}-${c}`} cx={40 + c * 44} cy={24 + r * 26} r="10"
          fill={r === 0 ? '#E4564A' : '#DCEBF5'} stroke={r === 0 ? '#B33F27' : '#7FA8BF'} strokeWidth="1.6"/>
      ))
    ))}
    <rect x="18" y="8" width="176" height="32" rx="8" fill="none" stroke="#C06A2E" strokeWidth="2" strokeDasharray="5 4"/>
    <text x="110" y="96" textAnchor="middle" fontSize="10" fontWeight="800" fill="#8A7550" fontFamily="'JetBrains Mono', monospace">jami 12</text>
  </svg>
);

// --- FACTCARD QAHRAMONI: to'rt hissa — nol, algebra, teng belgisi, diagramma.
const HeritageFig = () => (
  <svg viewBox="0 0 220 104" style={{ width: 'min(266px, 84%)', height: 'auto', display: 'block' }} aria-hidden="true">
    {[['0', '#2E7E9E', 24], ['al-jabr', '#C06A2E', 74], ['=', '#1F7A4D', 130], ['◔', '#8A5A2E', 178]].map(([t, c, x], i) => (
      <g key={i} transform={`translate(${x} 40)`}>
        <circle r="20" fill="#FDF6E8" stroke={c} strokeWidth="2.2"/>
        <text x="0" y="5" textAnchor="middle" fontSize={t.length > 3 ? 8 : 16} fontWeight="800" fill={c} fontFamily="'JetBrains Mono', monospace">{t}</text>
      </g>
    ))}
    <line x1="44" y1="40" x2="54" y2="40" stroke="#8A7550" strokeWidth="1.6"/>
    <line x1="94" y1="40" x2="110" y2="40" stroke="#8A7550" strokeWidth="1.6"/>
    <line x1="150" y1="40" x2="158" y2="40" stroke="#8A7550" strokeWidth="1.6"/>
    <text x="110" y="92" textAnchor="middle" fontSize="8" fill="#8A7550" fontFamily="'JetBrains Mono', monospace">har xalqdan bir bo'lak</text>
  </svg>
);

export default createLesson({
  TOTAL_SCREENS, LESSON_META, SCREEN_META, CONTENT, BRIDGES, S14_PAYOFF,
  STYLES: LESSON_STYLES,
  Scene: LessonScene,
  FactFig: HeritageFig,
  figs: { s4: <ThirdFig/> }
});
