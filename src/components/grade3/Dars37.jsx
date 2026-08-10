import React from 'react';
import { AncientHallBg, BitSVG, HALL_SLAB, LUMO_CAST, createLesson, useLang} from './_kit/index.jsx';
import { LESSON_STYLES } from './_kit/styles.js';

// ============================================================================
// DD 3-SINF | Dars37 — "Shakllarni o'lchov bo'yicha solishtirish" (num-3-37)
// Б5 «KRISTALL ARXITEKTURA»
// Syujet: kristall kvartal davom etadi (SYUJET_3SINF.md 194-satr, reja 41-satr).
// SAHNA: metodist qarori 2026-08-09 — qolgan darslarda 8-DARS sahnasi, qadimgi zal.
//   Zalning o'zi kitda (`AncientHallBg`), dars markazga o'z narsasini qo'yadi: yonma-yon
//   turgan ikki panel.
// DARSLIK ASOSI (Burxonov, 3-sinf, «Sharq» 2019, 162-bet): bir xil yuzali shakllarning
//   perimetri har xil bo'lishi mumkin.
// YADRO: 2 ga 8 va 4 ga 4 panellarda kataklar TENG (16), chekka esa har xil (20 va 16).
//   Demak «kattaroq» degan so'z o'zi yetarli emas — qaysi o'lchov bo'yicha, deb so'rash kerak.
// Misconception: M1 «perimetr katta bo'lsa yuza ham katta»; M2 har xil kattaliklarni
//   solishtirish; M3 sm² ni sm bilan solishtirish; M4 «cho'ziq shakl har doim kattaroq».
// FactCard: asalarilar uyani olti burchakli qiladi — bir xil yuzaga eng kam mum ketadi.
// Bu dars MA'LUMOT fayli: ekranlar va mexanika kitda (`createLesson`), bu yerda faqat
// darsning o'zi — matnlar, sahna tuguni va fakt rasmi.
// ============================================================================
const TOTAL_SCREENS = 15;
const LESSON_META = {
  lessonId: 'num-3-37',
  lessonTitle: { ru: 'Урок 37. Сравнение фигур по мерке', uz: "37-dars. Shakllarni o'lchov bo'yicha solishtirish" }
};
// STRUKTURA: s0 xuk ikki panel · s1 kataklarni sanash · s2 chekkani o'lchash · s3 QOIDA
// «qaysi o'lchov» · s4 chizma bo'yicha 3 ga 6 va 2 ga 9 · s5 saralash teng yoki har xil ·
// s6 test chekka qaysida uzun · s7 konsol ikki panel · s8 xatoni top (sm va sm²) ·
// s9 Bit tuzog'i (cho'ziq demak katta) · s10 trenajyor perimetr · s11 trenajyor yuza ·
// s12 masala ikki xona · s13 final 3 topshiriq + FactCard · s14 yakun.
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
  // s0 — XUK: ikki panel, kataklar teng, ko'rinish har xil.
  s0: {
    eyebrow: { ru: 'Крючок', uz: 'Qiziqtirish' },
    topic: { ru: 'Сравнение фигур по мерке', uz: "Shakllarni o'lchov bo'yicha solishtirish" },
    lead: { ru: 'Две панели: 2 на 8 и 4 на 4', uz: "Ikki panel: 2 ga 8 va 4 ga 4" },
    order_cap: { ru: 'какая из них больше', uz: 'qaysi biri kattaroq' },
    plate: ['2·8', '?', '4·4'],
    q: { ru: 'У какой панели больше клеток?', uz: 'Qaysi panelda katak ko\'proq?' },
    opt0: { ru: 'поровну', uz: 'teng' },
    opt1: { ru: 'у длинной', uz: "cho'zig'ida" },
    opt2: { ru: 'у квадратной', uz: 'kvadratida' },
    opt3: { ru: 'у длинной вдвое больше', uz: "cho'zig'ida ikki barobar ko'p" },
    audio: {
      intro: {
        ru: [
          'Площадь и периметр ты уже находишь. Сегодня научимся сравнивать фигуры.',
          'Вот две панели. Одна длинная, два на восемь. Другая квадратная, четыре на четыре.',
          'На вид они совсем разные.',
          'Как думаешь, у какой панели больше клеток?'
        ],
        uz: [
          "Yuza va perimetrni topa olasiz. Bugun shakllarni solishtirishni o'rganamiz.",
          "Mana ikki panel. Biri cho'ziq, ikki ga sakkiz. Ikkinchisi kvadrat, to'rt ga to'rt.",
          "Ko'rinishdan ular butunlay boshqacha.",
          "Sizningcha, qaysi panelda katak ko'proq?"
        ]
      },
      on_correct: { ru: 'Верно! Клеток поровну. Сейчас увидишь, чем эти панели всё же различаются.', uz: "To'g'ri! Kataklar teng. Endi bu panellar baribir nimasi bilan farq qilishini ko'rasiz." },
      on_wrong1: { ru: 'Длинная только кажется больше. Посчитай клетки, их шестнадцать и там, и там.', uz: "Cho'ziq faqat kattaroq bo'lib ko'rinadi. Kataklarni sanang, ikkalasida ham o'n oltita." },
      on_wrong2: { ru: 'У квадратной тоже шестнадцать. Обе панели вмещают поровну.', uz: "Kvadratida ham o'n oltita. Ikkala panel ham teng sig'diradi." },
      on_idk: { ru: 'Ничего. Сейчас посчитаем клетки в обеих.', uz: "Hechqisi yo'q. Hozir ikkalasidagi kataklarni sanaymiz." }
    }
  },

  // s1 — MODEL: kataklarni sanaymiz, teng chiqadi.
  s1: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil' },
    lead: { ru: 'Считаем клетки в обеих панелях', uz: "Ikkala paneldagi kataklarni sanaymiz" },
    task_line: 'панели 2 на 8 и 4 на 4',
    task_line_uz: "panellar 2 ga 8 va 4 ga 4",
    step1: '2 · 8 = 16',
    step1_cap: { ru: 'длинная панель', uz: "cho'ziq panel" },
    step2: '4 · 4 = 16',
    step2_cap: { ru: 'квадратная панель', uz: 'kvadrat panel' },
    res: { ru: 'S одинаковая', uz: 'S bir xil' },
    btn1: { ru: 'Посчитать длинную', uz: "Cho'ziqni sanash" },
    btn2: { ru: 'Посчитать квадратную', uz: 'Kvadratni sanash' },
    done_text: { ru: 'Клеток поровну, по шестнадцать. По площади панели равны.', uz: "Kataklar teng, o'n oltitadan. Yuza bo'yicha panellar teng." },
    audio: {
      ru: [
        'Посчитаем клетки в каждой панели.',
        'В длинной два ряда по восемь, шестнадцать клеток.',
        'В квадратной четыре ряда по четыре, тоже шестнадцать. По площади панели равны.'
      ],
      uz: [
        "Har bir paneldagi kataklarni sanaymiz.",
        "Cho'ziqda sakkiztadan ikki qator, o'n oltita katak.",
        "Kvadratda to'rttadan to'rt qator, ham o'n oltita. Yuza bo'yicha panellar teng."
      ]
    }
  },

  // s2 — MODEL: chekkani o'lchaymiz, har xil chiqadi.
  s2: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil' },
    w: 2,
    h: 8,
    lead: { ru: 'А теперь измерим край каждой панели', uz: "Endi har bir panelning chekkasini o'lchaymiz" },
    capA: { ru: 'длинная: (2 + 8) · 2 = 20', uz: "cho'ziq: (2 + 8) · 2 = 20" },
    capB: { ru: 'квадратная: 4 · 4 = 16', uz: 'kvadrat: 4 · 4 = 16' },
    res: { ru: 'P разный', uz: 'P har xil' },
    btn1: { ru: 'Обойти длинную', uz: "Cho'ziqni aylanish" },
    btn2: { ru: 'Обойти квадратную', uz: 'Kvadratni aylanish' },
    done_text: { ru: 'Край разный, двадцать и шестнадцать. Площадь равна, а периметр нет.', uz: "Chekka har xil, yigirma va o'n olti. Yuza teng, perimetr esa yo'q." },
    audio: {
      ru: [
        'Клеток поровну, а край посмотрим отдельно.',
        'Длинную панель обходим по краю, получается двадцать.',
        'Квадратную обходим, получается шестнадцать. Площадь одинаковая, а край разный.'
      ],
      uz: [
        "Kataklar teng, chekkaga esa alohida qaraymiz.",
        "Cho'ziq panelni chekka bo'ylab aylanamiz, yigirma chiqadi.",
        "Kvadratni aylanamiz, o'n olti chiqadi. Yuza bir xil, chekka esa har xil."
      ]
    }
  },

  // s3 — QOIDA: avval kattalikni ayt, keyin solishtir.
  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    q: { ru: 'Что нужно сделать раньше, чем сказать «эта фигура больше»?', uz: "«Bu shakl kattaroq» deyishdan oldin nima qilish kerak?" },
    opts: [
      { ru: 'назвать величину', uz: 'kattalikni aytish' },
      { ru: 'посмотреть на глаз', uz: "ko'z bilan qarash" },
      { ru: 'сравнить длину сторон', uz: 'tomonlar uzunligini solishtirish' },
      { ru: 'взять ту, что длиннее', uz: "cho'ziqroq bo'lganini olish" }
    ],
    ci: 0,
    hints: {
      1: { ru: 'На глаз длинная кажется больше, а клеток у неё столько же.', uz: "Ko'z bilan cho'ziq kattaroq ko'rinadi, kataklari esa shuncha." },
      2: { ru: 'Стороны разные, но это ещё не ответ. Спрашивают про величину.', uz: "Tomonlar har xil, lekin bu hali javob emas. Kattalik so'ralgan." },
      3: { ru: 'Длина не решает, по площади они равны.', uz: "Uzunlik hal qilmaydi, yuza bo'yicha ular teng." }
    },
    on_correct: { ru: 'Верно. Сначала величина, потом сравнение.', uz: "To'g'ri. Avval kattalik, keyin solishtirish." },
    rule_lines: {
      ru: ['сравнивают по одной величине', 'площадь с площадью, периметр с периметром', 'см² не сравнивают с см'],
      uz: ["bitta kattalik bo'yicha solishtiriladi", "yuza yuza bilan, perimetr perimetr bilan", "sm² sm bilan solishtirilmaydi"]
    },
    rule_ex: 'S = 16 = 16, P = 20 > 16',
    rule_speech: { ru: 'Сравнивают всегда по одной величине. Площадь сравнивают с площадью, а край с краем. У наших панелей площадь равна, а край у длинной больше.', uz: "Har doim bitta kattalik bo'yicha solishtiriladi. Yuza yuza bilan, chekka chekka bilan. Bizning panellarda yuza teng, chekka esa cho'ziqda kattaroq." },
    audio: {
      intro: { ru: 'Соберём правило. Мы увидели, что одна и та же пара фигур может быть и равной, и разной.', uz: "Qoidani yig'amiz. Bitta juft shakl ham teng, ham har xil bo'la olishini ko'rdik." }
    }
  },

  // s4 — CHIZMA: 3 ga 6 va 2 ga 9, yuzasi teng.
  s4: {
    eyebrow: { ru: 'Чертёж', uz: 'Chizma' },
    q: { ru: 'Панели 3 на 6 и 2 на 9. Что у них одинаково?', uz: "Panellar 3 ga 6 va 2 ga 9. Ularda nima bir xil?" },
    fig_w: 3,
    fig_h: 6,
    opts: [
      { ru: 'площадь', uz: 'yuza' },
      { ru: 'периметр', uz: 'perimetr' },
      { ru: 'длина', uz: 'uzunlik' },
      { ru: 'ничего', uz: 'hech nima' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Край посчитай. У первой восемнадцать, у второй двадцать два.', uz: "Chekkani sanang. Birinchisida o'n sakkiz, ikkinchisida yigirma ikki." },
      2: { ru: 'Длина у них разная, шесть и девять.', uz: "Uzunligi har xil, olti va to'qqiz." },
      3: { ru: 'Кое-что всё же совпало. Посчитай клетки внутри.', uz: "Baribir bir narsa mos tushdi. Ichkaridagi kataklarni sanang." }
    },
    audio: {
      intro: { ru: 'Посмотри на чертёж. Две панели, три на шесть и два на девять. Что у них одинаково?', uz: "Chizmaga qarang. Ikki panel, uch ga olti va ikki ga to'qqiz. Ularda nima bir xil?" },
      on_correct: { ru: 'Верно. Восемнадцать клеток и там, и там.', uz: "To'g'ri. Ikkalasida ham o'n sakkizta katak." },
      on_wrong: { ru: 'Посчитай сначала клетки, потом край.', uz: "Avval kataklarni, keyin chekkani sanang." }
    }
  },

  // s5 — SARALASH: shu juftlikda nima teng, nima har xil.
  s5: {
    eyebrow: { ru: 'Сортировка', uz: 'Saralash' },
    lead: { ru: 'Панели 2 на 8 и 4 на 4. Разложи, что совпало', uz: "Panellar 2 ga 8 va 4 ga 4. Nima mos tushganini ajrating" },
    bin_a: { ru: 'одинаково', uz: 'bir xil' },
    bin_b: { ru: 'по-разному', uz: 'har xil' },
    items: [
      { n: { ru: 'клетки внутри', uz: 'ichkaridagi kataklar' }, a: true, hint: { ru: 'Шестнадцать и там, и там.', uz: "Ikkalasida ham o'n oltita." } },
      { n: { ru: 'путь по краю', uz: "chekka bo'ylab yo'l" }, a: false, hint: { ru: 'Двадцать и шестнадцать.', uz: "Yigirma va o'n olti." } },
      { n: { ru: 'длина стороны', uz: 'tomon uzunligi' }, a: false, hint: { ru: 'Восемь и четыре, это разные числа.', uz: "Sakkiz va to'rt, bu har xil sonlar." } },
      { n: { ru: 'площадь', uz: 'yuza' }, a: true, hint: { ru: 'Площадь это и есть клетки внутри.', uz: "Yuza bu ichkaridagi kataklarning o'zi." } }
    ],
    audio: {
      intro: { ru: 'Четыре записи про одну и ту же пару панелей. Отправь каждую в свою корзину.', uz: "Bitta juft panel haqida to'rtta yozuv. Har birini o'z savatiga yuboring." },
      on_correct: { ru: 'Всё на месте. Одна пара фигур, а ответ зависит от того, что мы меряем.', uz: "Hammasi joyida. Shakllar bitta juft, javob esa nimani o'lchashimizga bog'liq." },
      on_wrong: { ru: 'Посчитай обе панели по этой величине и сравни числа.', uz: "Ikkala panelni shu kattalik bo'yicha hisoblab, sonlarni solishtiring." }
    }
  },

  // s6 — TEST: chekka qaysida uzun.
  s6: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv' },
    q: { ru: 'Панели 1 на 12 и 3 на 4. У какой край длиннее?', uz: "Panellar 1 ga 12 va 3 ga 4. Qaysinisida chekka uzunroq?" },
    opts: [
      { ru: 'у 1 на 12', uz: '1 ga 12 da' },
      { ru: 'у 3 на 4', uz: '3 ga 4 da' },
      { ru: 'одинаково', uz: 'bir xil' },
      { ru: 'нельзя сравнить', uz: "solishtirib bo'lmaydi" }
    ],
    ci: 0,
    hints: {
      1: { ru: 'У три на четыре край четырнадцать, а у длинной двадцать шесть.', uz: "Uch ga to'rtda chekka o'n to'rt, cho'ziqda esa yigirma olti." },
      2: { ru: 'Клеток поровну, по двенадцать, а край разный.', uz: "Kataklar teng, o'n ikkitadan, chekka esa har xil." },
      3: { ru: 'Сравнить можно, обе величины это длина, обе в сантиметрах.', uz: "Solishtirsa bo'ladi, ikkala kattalik ham uzunlik, ikkalasi ham santimetrda." }
    },
    audio: {
      intro: { ru: 'Быстрый вопрос. Панели один на двенадцать и три на четыре. У какой край длиннее?', uz: "Tez savol. Panellar bir ga o'n ikki va uch ga to'rt. Qaysinisida chekka uzunroq?" },
      on_correct: { ru: 'Верно. Чем сильнее фигура вытянута, тем длиннее её край.', uz: "To'g'ri. Shakl qanchalik cho'ziq bo'lsa, chekkasi shunchalik uzun." },
      on_wrong: { ru: 'Обойди по краю обе панели и сравни числа.', uz: "Ikkala panelni chekka bo'ylab aylanib, sonlarni solishtiring." }
    }
  },

  // s7 — KONSOL: ikki panel yonma-yon.
  s7: {
    eyebrow: { ru: 'Консоль', uz: 'Konsol' },
    lead: { ru: 'Заполни консоль для панелей 3 на 6 и 2 на 9', uz: "3 ga 6 va 2 ga 9 panellar uchun konsolni to'ldiring" },
    swap_line: { ru: 'панели 3 на 6 и 2 на 9', uz: 'panellar 3 ga 6 va 2 ga 9' },
    cells: [
      { head: { ru: 'площадь первой', uz: 'birinchining yuzasi' }, label: '3 · 6', ans: 18, hint: { ru: 'Длину умножь на ширину.', uz: "Uzunlikni enga ko'paytiring." } },
      { head: { ru: 'площадь второй', uz: 'ikkinchining yuzasi' }, label: '2 · 9', ans: 18, hint: { ru: 'И здесь длина на ширину.', uz: "Bu yerda ham uzunlik enga." } },
      { head: { ru: 'край второй', uz: 'ikkinchining chekkasi' }, label: '(2 + 9) · 2', ans: 22, hint: { ru: 'Сложи две стороны и удвой.', uz: "Ikki tomonni qo'shib, ikkilantiring." } }
    ],
    check: 'S = 18 = 18, P = 22',
    check_label: { ru: 'площадь равна, край нет', uz: "yuza teng, chekka yo'q" },
    audio: {
      intro: { ru: 'Заполни три окна. Площадь каждой панели и край второй.', uz: "Uchta oynani to'ldiring. Har bir panelning yuzasi va ikkinchisining chekkasi." },
      on_correct: { ru: 'Восемнадцать и восемнадцать, а край двадцать два. Площадь равна, край нет.', uz: "O'n sakkiz va o'n sakkiz, chekka esa yigirma ikki. Yuza teng, chekka yo'q." }
    }
  },

  // s8 — XATONI TOP: sm² ni sm bilan solishtirish (M3).
  s8: {
    eyebrow: { ru: 'Найди ошибку', uz: 'Xatoni toping' },
    q: { ru: 'Записали: S = 16 см² больше, чем P = 16 см. Где ошибка?', uz: "S = 16 sm², P = 16 sm dan katta deb yozilibdi. Xato qayerda?" },
    fig_line: { ru: '16 см² ? 16 см', uz: '16 sm² ? 16 sm' },
    opts: [
      { ru: 'сравнили разные величины', uz: 'har xil kattalik solishtirilgan' },
      { ru: 'ошибки нет', uz: "xato yo'q" },
      { ru: 'посчитали площадь', uz: 'yuza noto\'g\'ri hisoblangan' },
      { ru: 'забыли единицы', uz: 'birliklar unutilgan' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Числа равны, но одно про клетки, другое про длину.', uz: "Sonlar teng, biri kataklar haqida, ikkinchisi uzunlik haqida." },
      2: { ru: 'Площадь посчитана верно, шестнадцать.', uz: "Yuza to'g'ri hisoblangan, o'n olti." },
      3: { ru: 'Единицы как раз написаны, и они разные.', uz: "Birliklar yozilgan, va ular har xil." }
    },
    audio: {
      intro: { ru: 'Кто-то сравнил площадь с периметром. Найди ошибку.', uz: "Kimdir yuzani perimetr bilan solishtiribdi. Xatoni toping." },
      on_correct: { ru: 'Верно. Квадратные сантиметры и просто сантиметры это разные мерки, их не сравнивают.', uz: "To'g'ri. Kvadrat santimetr va oddiy santimetr har xil o'lchov, ular solishtirilmaydi." },
      on_wrong: { ru: 'Посмотри на единицы. Одна мерка про клетки, другая про длину.', uz: "Birliklarga qarang. Bir o'lchov kataklar haqida, ikkinchisi uzunlik haqida." }
    }
  },

  // s9 — BIT TUZOG'I: cho'ziq demak kattaroq (M4).
  s9: {
    eyebrow: { ru: 'Ловушка Бита', uz: "Bit tuzog'i" },
    lead: { ru: 'Бит выбирает панель для склада', uz: "Bit ombor uchun panel tanlayapti" },
    lines: ['панели 2 на 8 и 4 на 4', 'Бит: длинная больше, беру её'],
    lines_uz: ["panellar 2 ga 8 va 4 ga 4", "Bit: cho'ziq kattaroq, shuni olaman"],
    line_cap: { ru: 'Бит: она же длиннее', uz: "Bit: axir u cho'ziqroq" },
    trap_label: { ru: 'Так ли это?', uz: 'Shundaymi?' },
    trap_opts: { ru: ['нет, места в них поровну', 'да, длинная больше'], uz: ["yo'q, ularda joy teng", "ha, cho'ziq kattaroq"] },
    trap_ci: 0,
    trap_correct: { ru: 'Да. Клеток в обеих по шестнадцать, места одинаково. Длиннее у неё только край, а на склад важно как раз место внутри.', uz: "Ha. Ikkalasida ham o'n oltitadan katak, joy bir xil. Unda faqat chekka uzunroq, omborga esa aynan ichkaridagi joy kerak." },
    trap_wrong: { ru: 'Посчитай клетки в обеих панелях. Шестнадцать и шестнадцать, места поровну.', uz: "Ikkala paneldagi kataklarni sanang. O'n olti va o'n olti, joy teng." },
    audio: {
      ru: [
        'Бит выбирает панель для склада.',
        'Эта длиннее, значит на неё влезет больше. Беру длинную.',
        'Так ли это?'
      ],
      uz: [
        "Bit ombor uchun panel tanlayapti.",
        "Bu cho'ziqroq, demak unga ko'proq sig'adi. Cho'ziqni olaman.",
        "Shundaymi?"
      ]
    }
  },

  // s10 — TRENAJYOR: perimetr.
  s10: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq' },
    q: { ru: 'Панель 3 на 6 см. Чему равен периметр в см?', uz: "Panel 3 ga 6 sm. Perimetri sm da nechaga teng?" },
    ans: 18,
    check: '(3 + 6) · 2',
    check_label: { ru: 'путь по краю', uz: "chekka bo'ylab yo'l" },
    hint: { ru: 'Сложи две соседние стороны и удвой.', uz: "Ikki qo'shni tomonni qo'shib, ikkilantiring." },
    audio: {
      intro: { ru: 'Теперь считай сам. Панель три на шесть, чему равен периметр?', uz: "Endi o'zingiz hisoblang. Panel uch ga olti, perimetri nechaga teng?" },
      on_correct: { ru: 'Восемнадцать сантиметров.', uz: "O'n sakkiz santimetr." }
    }
  },

  // s11 — TRENAJYOR: yuza shu juftlikda.
  s11: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq' },
    q: { ru: 'Панель 2 на 9 см. Чему равна площадь в см²?', uz: "Panel 2 ga 9 sm. Yuzasi sm² da nechaga teng?" },
    ans: 18,
    check: '2 · 9',
    check_label: { ru: 'клетки внутри', uz: 'ichkaridagi kataklar' },
    hint: { ru: 'Два умножь на девять.', uz: "Ikkini to'qqizga ko'paytiring." },
    audio: {
      intro: { ru: 'И вторая панель. Два на девять, чему равна площадь?', uz: "Ikkinchi panel ham. Ikki ga to'qqiz, yuzasi nechaga teng?" },
      on_correct: { ru: 'Восемнадцать квадратных сантиметров, столько же, сколько у первой.', uz: "O'n sakkiz kvadrat santimetr, birinchisidagi bilan bir xil." }
    }
  },

  // s12 — MASALA: ikki xona, savolga qarab kattalik tanlanadi.
  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    lead: { ru: 'Две кладовые кристаллов', uz: 'Ikki kristall omborxona' },
    q: { ru: 'Первая кладовая 4 на 5 м, вторая 2 на 10 м. В какую влезет больше кристаллов и на сколько метров длиннее край второй?', uz: "Birinchi omborxona 4 ga 5 m, ikkinchisi 2 ga 10 m. Qaysi biriga ko'proq kristall sig'adi va ikkinchisining chekkasi necha metr uzunroq?" },
    q_speech: { ru: 'первая кладовая четыре на пять метров, вторая два на десять. В какую влезет больше кристаллов и на сколько метров длиннее край второй?', uz: "birinchi omborxona to'rt ga besh metr, ikkinchisi ikki ga o'n. Qaysi biriga ko'proq kristall sig'adi va ikkinchisining chekkasi necha metr uzunroq?" },
    tbl_heads: [
      { ru: 'первая', uz: 'birinchi' },
      { ru: 'вторая', uz: 'ikkinchi' },
      { ru: 'вопрос', uz: 'savol' }
    ],
    tbl_cells: ['4 · 5', '2 · 10', '?'],
    pick_label: { ru: 'С какого действия начинаем?', uz: 'Qaysi amaldan boshlaymiz?' },
    opts: [
      { ru: 'посчитать площади', uz: 'yuzalarni hisoblash' },
      { ru: 'посчитать края', uz: 'chekkalarni hisoblash' },
      { ru: 'сравнить длины', uz: 'uzunliklarni solishtirish' },
      { ru: 'сложить стороны', uz: "tomonlarni qo'shish" }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Край понадобится, но во втором вопросе. Первым спрашивают про место.', uz: "Chekka kerak bo'ladi, lekin ikkinchi savolda. Birinchi bo'lib joy so'ralgan." },
      2: { ru: 'Длина одной стороны не скажет, сколько влезет.', uz: "Bitta tomon uzunligi qancha sig'ishini aytmaydi." },
      3: { ru: 'Сумма сторон это про край, а не про место.', uz: "Tomonlar yig'indisi chekka haqida, joy haqida emas." }
    },
    pick_ok: { ru: 'Верно. Сначала место, потом край.', uz: "To'g'ri. Avval joy, keyin chekka." },
    step1_q: { ru: 'Сколько квадратных метров в каждой кладовой?', uz: 'Har bir omborxonada necha kvadrat metr bor?' },
    ans1: 20,
    hint1: { ru: 'Четыре на пять и два на десять дают одно и то же число.', uz: "To'rt ga besh va ikki ga o'n bitta sonni beradi." },
    step2_q: { ru: 'На сколько метров край второй длиннее?', uz: 'Ikkinchisining chekkasi necha metr uzunroq?' },
    ans2: 6,
    hint2: { ru: 'Край первой восемнадцать, второй двадцать четыре.', uz: "Birinchisining chekkasi o'n sakkiz, ikkinchisiniki yigirma to'rt." },
    check: 'S = 20 = 20, P: 24 − 18',
    setup_audio: { ru: 'Кладовые готовят к загрузке. Посмотри на таблицу и реши, с чего начать.', uz: "Omborxonalar yuklashga tayyorlanmoqda. Jadvalga qarang va nimadan boshlashni hal qiling." },
    audio: {
      intro: { ru: 'Первая кладовая четыре на пять метров, вторая два на десять. Куда влезет больше и на сколько длиннее край второй?', uz: "Birinchi omborxona to'rt ga besh metr, ikkinchisi ikki ga o'n. Qayerga ko'proq sig'adi va ikkinchisining chekkasi nechaga uzun?" },
      on_correct: { ru: 'В обе влезет поровну, по двадцать квадратных метров, а край второй длиннее на шесть метров.', uz: "Ikkalasiga ham teng sig'adi, yigirma kvadrat metrdan, ikkinchisining chekkasi esa olti metr uzunroq." },
      on_wrong: { ru: 'Смотри, о чём спрашивают. Место это клетки внутри, край это путь вокруг.', uz: "Nima so'ralayotganiga qarang. Joy bu ichkaridagi kataklar, chekka bu atrofdagi yo'l." }
    }
  },

  // s13 — FINAL: uchta topshiriq + FaktCard.
  s13: {
    eyebrow: { ru: 'Финал', uz: 'Yakuniy' },
    intro_line: { ru: 'Три задания. Сначала пойми, о какой мерке речь', uz: "Uchta topshiriq. Avval qaysi o'lchov haqida ekanini tushuning" },
    items: [
      {
        kind: 'num',
        q: { ru: 'Панель 5 на 4 см. Чему равна площадь в см²?', uz: "Panel 5 ga 4 sm. Yuzasi sm² da nechaga teng?" },
        q_speech: { ru: 'панель пять на четыре. Чему равна площадь?', uz: "panel besh ga to'rt. Yuzasi nechaga teng?" },
        ans: 20,
        hint: { ru: 'Пять умножь на четыре.', uz: "Beshni to'rtga ko'paytiring." }
      },
      {
        kind: 'num',
        q: { ru: 'Панель 5 на 4 см. Чему равен периметр в см?', uz: "Panel 5 ga 4 sm. Perimetri sm da nechaga teng?" },
        q_speech: { ru: 'та же панель пять на четыре. Чему равен периметр?', uz: "o'sha panel besh ga to'rt. Perimetri nechaga teng?" },
        ans: 18,
        hint: { ru: 'Сложи пять и четыре, потом удвой.', uz: "Besh va to'rtni qo'shib, keyin ikkilantiring." }
      },
      {
        kind: 'num',
        q: { ru: 'У панели 1 на 8 площадь 8 см². Какая ещё панель даёт 8 см², если её стороны 2 и ?', uz: "1 ga 8 panelning yuzasi 8 sm². Tomonlari 2 va ? bo'lgan qaysi panel ham 8 sm² beradi?" },
        q_speech: { ru: 'панель один на восемь даёт восемь квадратных сантиметров. Какая вторая сторона нужна панели с первой стороной два, чтобы вышло столько же?', uz: "bir ga sakkiz panel sakkiz kvadrat santimetr beradi. Birinchi tomoni ikki bo'lgan panelga shuncha chiqishi uchun ikkinchi tomon qanday kerak?" },
        ans: 4,
        hint: { ru: 'Какое число, умноженное на два, даёт восемь.', uz: "Qaysi son ikkiga ko'paytirilganda sakkiz beradi." }
      }
    ],
    fact_badge: { ru: 'Знаешь ли ты?', uz: 'Bilasizmi?' },
    fact_text: {
      ru: 'Пчёлы строят соты шестиугольными. При одинаковой площади ячейки у шестиугольника край короче, чем у квадрата или треугольника, а значит на стенки уходит меньше воска. Пчёлы не считают, но природа отобрала самую выгодную форму.',
      uz: "Asalarilar uyachalarni olti burchakli qiladi. Yuzasi bir xil bo'lganda olti burchakning chekkasi kvadrat yoki uchburchaknikidan qisqa, demak devorlarga kamroq mum ketadi. Asalarilar hisoblamaydi, lekin tabiat eng foydali shaklni tanlagan."
    },
    fact_audio: {
      ru: 'Вот что интересно. Пчёлы строят соты шестиугольными, и это не случайность. Если взять ячейки одинаковой площади, то у шестиугольника край получается короче, чем у квадрата или треугольника. А короче край, значит меньше стенок, значит меньше воска. Пчёлы, конечно, ничего не считают. Просто те семьи, что строили выгоднее, тратили меньше сил, и такая форма осталась.',
      uz: "Mana qizig'i. Asalarilar uyachalarni olti burchakli quradi, va bu tasodif emas. Yuzasi bir xil uyachalarni olsak, olti burchakning chekkasi kvadrat yoki uchburchaknikidan qisqa chiqadi. Chekka qisqa bo'lsa, devor kam, demak mum ham kam ketadi. Asalarilar hech nima hisoblamaydi, albatta. Shunchaki foydaliroq qurgan oilalar kam kuch sarflagan va shu shakl qolgan."
    },
    audio: {
      intro: { ru: 'Три задания напоследок. Каждый раз сначала пойми, о какой мерке спрашивают.', uz: "Oxirida uchta topshiriq. Har safar avval qaysi o'lchov so'ralganini tushuning." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Смотри на мерку в вопросе.', uz: "Savoldagi o'lchovga qarang." }
    }
  },

  // s14 — YAKUN: keyingisi blok masalalari (reja 42-satr).
  s14: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    mission_done: { ru: 'Панели сравнены!', uz: 'Panellar solishtirildi!' },
    cando: {
      ru: ['сравниваю по названной величине', 'вижу, что равная площадь не значит равный край', 'не сравниваю см² с см'],
      uz: ["aytilgan kattalik bo'yicha solishtiraman", "teng yuza teng chekka degani emasligini ko'raman", "sm² ni sm bilan solishtirmayman"]
    },
    rule_recap: { ru: 'Сравнивают всегда по одной величине: площадь с площадью, край с краем.', uz: "Har doim bitta kattalik bo'yicha solishtiriladi: yuza yuza bilan, chekka chekka bilan." },
    conn_label_refs: { ru: 'опирается на', uz: 'nimaga tayanadi' },
    conn_refs: { ru: 'урок 36: площадь квадрата; урок 31: периметр', uz: "36-dars: kvadrat yuzasi; 31-dars: perimetr" },
    conn_label_next: { ru: 'дальше', uz: 'keyin' },
    conn_next: { ru: 'задачи блока: выбрать величину по вопросу', uz: "blok masalalari: savolga qarab kattalikni tanlash" },
    audio: {
      ru: 'Панели сравнены. Запомни главное. Слово больше само по себе ничего не значит, пока не названа величина. У двух фигур площадь может совпасть, а край разойтись, и наоборот. Поэтому сначала спрашивай, по какой мерке сравниваем, а уже потом считай. И никогда не сравнивай квадратные сантиметры с обычными. В следующий раз возьмём задачи, где мерку придётся выбирать самому!',
      uz: "Panellar solishtirildi. Asosiysini eslab qoling. Kattaroq degan so'z kattalik aytilmaguncha o'zi hech nima anglatmaydi. Ikki shaklning yuzasi mos tushib, chekkasi ajralib ketishi mumkin, aksincha ham. Shuning uchun avval qaysi o'lchov bo'yicha solishtirayotganingizni so'rang, keyin hisoblang. Kvadrat santimetrni oddiy santimetr bilan esa hech qachon solishtirmang. Keyingi safar o'lchovni o'zingiz tanlaydigan masalalarni olamiz!"
    }
  }
};

const BRIDGES = {
  s1:  { ru: 'Посчитаем клетки.', uz: 'Kataklarni sanaymiz.' },
  s2:  { ru: 'Теперь обойдём по краю.', uz: "Endi chekka bo'ylab aylanamiz." },
  s3:  { ru: "Соберём это в правило.", uz: "Buni qoidaga yig'amiz." },
  s4:  { ru: 'Прочитай чертёж.', uz: "Chizmani o'qing." },
  s5:  { ru: 'Разложи записи.', uz: 'Yozuvlarni ajrating.' },
  s6:  { ru: 'Быстрый вопрос.', uz: 'Tez savol.' },
  s7:  { ru: 'Заполни консоль.', uz: "Konsolni to'ldiring." },
  s8:  { ru: 'Тут сравнили не то с тем.', uz: 'Bu yerda noto\'g\'ri narsa solishtirilibdi.' },
  s9:  { ru: 'А вот и Бит со своим выбором.', uz: "Mana Bit ham o'z tanlovi bilan." },
  s10: { ru: 'Теперь считай сам.', uz: "Endi o'zingiz hisoblang." },
  s11: { ru: 'И вторая панель.', uz: 'Ikkinchi panel ham.' },
  s12: { ru: 'Задача от кладовщиков.', uz: 'Omborchilardan masala.' },
  s13: { ru: 'Финальная проверка.', uz: 'Yakuniy tekshiruv.' },
  s14: { ru: 'Подведём итог.', uz: 'Yakun yasaymiz.' }
};

const S14_PAYOFF = {
  ru: 'Панели сравнены. Теперь ясно, что сравнивать нужно по названной мерке.',
  uz: "Panellar solishtirildi. Endi aytilgan o'lchov bo'yicha solishtirish kerakligi ayon."
};

// --- ZAL TAXTASI (D37): markazda ikki panel yonma-yon — bittasi cho'ziq, ikkinchisi kvadrat.
// Kataklar teng (16 va 16), chekka esa har xil: shu qarama-qarshilik butun darsning yadrosi.
const TwoPanelNodeLayer = () => {
  const lang = useLang();
  return (
  <svg className="lm-scene-bg" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <path d="M150 158 h100 l8 18 h-116 Z" fill="#B49A6E"/>
    <rect x={HALL_SLAB.x} y={HALL_SLAB.y} width={HALL_SLAB.w} height={HALL_SLAB.h} rx="5" fill="#E4D3AC" stroke="#8A7550" strokeWidth="2"/>
    <rect x="130" y="99" width="140" height="11" rx="2" fill="#C6AE7E"/>
    <text x="200" y="107.5" textAnchor="middle" fontSize="7" letterSpacing="2" fill="#6B5636" fontFamily="'JetBrains Mono', monospace">{lang === 'ru' ? 'ДВЕ ПАНЕЛИ' : 'IKKI PANEL'}</text>
    <g transform="translate(126 122)">
      {Array.from({ length: 2 }).map((_, r) => (
        Array.from({ length: 8 }).map((_, c) => (
          <rect key={`${r}-${c}`} x={c * 7} y={r * 7} width="7" height="7" fill={(r + c) % 2 ? '#DCEBF5' : '#EAF4FA'} stroke="#7FA8BF" strokeWidth="0.6"/>
        ))
      ))}
      <rect x="0" y="0" width="56" height="14" fill="none" stroke="#C06A2E" strokeWidth="2"/>
      <text x="28" y="24" textAnchor="middle" fontSize="6.5" fill="#3F5A6B" fontFamily="'JetBrains Mono', monospace">2 · 8</text>
    </g>
    <g transform="translate(212 116)">
      {Array.from({ length: 4 }).map((_, r) => (
        Array.from({ length: 4 }).map((_, c) => (
          <rect key={`${r}-${c}`} x={c * 7} y={r * 7} width="7" height="7" fill={(r + c) % 2 ? '#DCEBF5' : '#EAF4FA'} stroke="#7FA8BF" strokeWidth="0.6"/>
        ))
      ))}
      <rect x="0" y="0" width="28" height="28" fill="none" stroke="#FFB92E" strokeWidth="2"/>
      <text x="14" y="38" textAnchor="middle" fontSize="6.5" fill="#3F5A6B" fontFamily="'JetBrains Mono', monospace">4 · 4</text>
    </g>
    <text x="256" y="140" textAnchor="middle" fontSize="10" fontWeight="800" fill="#C06A2E" fontFamily="'JetBrains Mono', monospace">16 = 16</text>
    {/* chap artefakt: tarozi — qaysi o'lchov bo'yicha solishtirilyapti */}
    <g transform="translate(88 158)">
      <rect x="-22" y="6" width="44" height="14" rx="3" fill="#B49A6E" stroke="#8A7550" strokeWidth="1"/>
      <line x1="0" y1="6" x2="0" y2="-14" stroke="#8A7550" strokeWidth="2"/>
      <line x1="-18" y1="-14" x2="18" y2="-14" stroke="#8A7550" strokeWidth="2"/>
      <path d="M-18 -14 l-5 8 h10 Z" fill="#DCEBF5" stroke="#7FA8BF" strokeWidth="1"/>
      <path d="M18 -14 l-5 8 h10 Z" fill="#FFD98A" stroke="#C06A2E" strokeWidth="1"/>
      <text x="0" y="-18" textAnchor="middle" fontSize="5" fill="#6B5636" fontFamily="'JetBrains Mono', monospace">{lang === 'ru' ? 'МЕРКА' : "O'LCHOV"}</text>
    </g>
    {/* o'ng artefakt: ikki birlik tosh-tabletlarda */}
    {[['sm', 100], ['sm²', 122]].map(([g, y], i) => (
      <g key={i} transform={`translate(304 ${y})`}>
        <rect x="0" y="0" width="30" height="16" rx="3" fill="#E4D3AC" stroke="#8A7550" strokeWidth="1"/>
        <text x="15" y="12" textAnchor="middle" fontSize="9" fontWeight="800" fill="#5A4A2E" fontFamily="'JetBrains Mono', monospace">{g}</text>
      </g>
    ))}
    <circle className="lm-glow" cx="300" cy="92" r="2.4" fill="#BFF0C8"/>
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
      <TwoPanelNodeLayer/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};

// --- FACTCARD QAHRAMONI: bir xil yuzali uchta uyacha — uchburchak, kvadrat, olti burchak.
// Chekka uzunligi kamayib boradi, shuning uchun asalarilar oxirgisini tanlagan.
const HoneycombFig = () => (
  <svg viewBox="0 0 220 104" style={{ width: 'min(266px, 84%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <g transform="translate(34 54)">
      <path d="M0 -26 L23 14 L-23 14 Z" fill="#F7F1E4" stroke="#C06A2E" strokeWidth="2.4" strokeLinejoin="round"/>
      <text x="0" y="34" textAnchor="middle" fontSize="9" fontWeight="800" fill="#8A7550" fontFamily="'JetBrains Mono', monospace">3</text>
    </g>
    <g transform="translate(110 54)">
      <rect x="-19" y="-19" width="38" height="38" fill="#FDF3E0" stroke="#C06A2E" strokeWidth="2.4"/>
      <text x="0" y="34" textAnchor="middle" fontSize="9" fontWeight="800" fill="#8A7550" fontFamily="'JetBrains Mono', monospace">4</text>
    </g>
    <g transform="translate(186 54)">
      <path d="M11 -19 L22 0 L11 19 L-11 19 L-22 0 L-11 -19 Z" fill="#FFE6A6" stroke="#C06A2E" strokeWidth="2.4" strokeLinejoin="round"/>
      <text x="0" y="34" textAnchor="middle" fontSize="9" fontWeight="800" fill="#C06A2E" fontFamily="'JetBrains Mono', monospace">6</text>
    </g>
    <text x="110" y="14" textAnchor="middle" fontSize="8" letterSpacing="1.2" fill="#8A7550" fontFamily="'JetBrains Mono', monospace">S</text>
    <path d="M62 54 h14 m-4 -4 l4 4 l-4 4" fill="none" stroke="#8A7550" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M140 54 h14 m-4 -4 l4 4 l-4 4" fill="none" stroke="#8A7550" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default createLesson({
  TOTAL_SCREENS, LESSON_META, SCREEN_META, CONTENT, BRIDGES, S14_PAYOFF,
  STYLES: LESSON_STYLES,
  Scene: LessonScene,
  FactFig: HoneycombFig
});
