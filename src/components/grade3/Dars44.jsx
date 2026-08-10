import React from 'react';
import { BitSVG, LUMO_CAST, LumoCityBg, createLesson, useLang} from './_kit/index.jsx';
import { LESSON_STYLES } from './_kit/styles.js';

// ============================================================================
// DD 3-SINF | Dars44 — "Uzunlik birliklari: sm, dm, m" (num-3-44) | Б6 «O'LCHOVLAR»
// Syujet: Lumo shahri (reja 49-satr). SAHNA: 1-DARSNING shahri, tugun — o'lchov chizg'ichi.
// DARSLIK ASOSI (Burxonov, 3-sinf, «Sharq» 2019, 102-bet).
// YADRO: uzunlik birliklari O'NLIK: 1 dm = 10 sm, 1 m = 10 dm = 100 sm. Massa va vaqtdan
//   farqli o'laroq bu yerda hisob o'nlab boradi.
// Misconception: M1 «bir metrda 10 santimetr»; M2 har xil birlikni qo'shish; M3 dm va sm ni
//   yozuvda chalkashtirish; M4 «son katta bo'lsa uzunroq» (5 m va 40 sm).
// FactCard: metr Yer o'lchovidan olingan — qutbdan ekvatorgacha masofaning o'n millióndan
//   bir qismi.
// Bu dars MA'LUMOT fayli: ekranlar va mexanika kitda (`createLesson`).
// ============================================================================
const TOTAL_SCREENS = 15;
const LESSON_META = {
  lessonId: 'num-3-44',
  lessonTitle: { ru: 'Урок 44. Единицы длины: см, дм, м', uz: '44-dars. Uzunlik birliklari: sm, dm, m' }
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
    topic: { ru: 'Единицы длины', uz: 'Uzunlik birliklari' },
    lead: { ru: 'Ленту 40 см сравнили с рейкой 2 м', uz: "40 sm lenta 2 m reyka bilan solishtirildi" },
    order_cap: { ru: 'число больше у ленты', uz: 'son lentada kattaroq' },
    plate: ['1', 'm', '100'],
    q: { ru: 'Что длиннее: лента 40 см или рейка 2 м?', uz: "Qaysi biri uzun: 40 sm lentami yoki 2 m reykami?" },
    opt0: { ru: 'рейка', uz: 'reyka' },
    opt1: { ru: 'лента', uz: 'lenta' },
    opt2: { ru: 'одинаково', uz: 'bir xil' },
    opt3: { ru: 'нельзя сравнить', uz: "solishtirib bo'lmaydi" },
    audio: {
      intro: {
        ru: [
          'Массу и время мы разобрали. Вернёмся к длине, но теперь с мерками.',
          'На складе лента длиной сорок сантиметров и рейка длиной два метра.',
          'У ленты число больше, но мерки разные.',
          'Как думаешь, что длиннее?'
        ],
        uz: [
          "Massa va vaqtni ko'rib chiqdik. Endi uzunlikka qaytamiz, bu safar o'lchovlar bilan.",
          "Omborda uzunligi qirq santimetr lenta va uzunligi ikki metr reyka bor.",
          "Lentada son kattaroq, lekin o'lchovlar har xil.",
          "Sizningcha, qaysi biri uzun?"
        ]
      },
      on_correct: { ru: 'Верно! Рейка длиннее. Число само по себе ничего не решает, пока не сказана мерка.', uz: "To'g'ri! Reyka uzunroq. Son o'zi hech nimani hal qilmaydi, o'lchov aytilmaguncha." },
      on_wrong1: { ru: 'Сорок больше двух, но сорок сантиметров это меньше полуметра.', uz: "Qirq ikkidan katta, lekin qirq santimetr yarim metrdan kam." },
      on_wrong2: { ru: 'Два метра это двести сантиметров, куда больше сорока.', uz: "Ikki metr bu ikki yuz santimetr, qirqdan ancha ko'p." },
      on_idk: { ru: 'Ничего. Сейчас приведём обе к одной мерке.', uz: "Hechqisi yo'q. Hozir ikkalasini bitta o'lchovga keltiramiz." }
    }
  },

  s1: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil' },
    lead: { ru: 'Складываем линейку в дециметры', uz: "Chizg'ichni detsimetrlarga bo'lamiz" },
    task_line: 'линейка 20 см',
    task_line_uz: "chizg'ich 20 sm",
    step1: { ru: '10 см = 1 дм', uz: '10 sm = 1 dm' },
    step1_cap: { ru: 'десять клеточек это дециметр', uz: "o'nta katak bu detsimetr" },
    step2: { ru: '20 см = 2 дм', uz: '20 sm = 2 dm' },
    step2_cap: { ru: 'вся линейка это два дециметра', uz: "butun chizg'ich ikki detsimetr" },
    res: { ru: '1 дм = 10 см', uz: '1 dm = 10 sm' },
    btn1: { ru: 'Отметить дециметр', uz: 'Detsimetrni belgilash' },
    btn2: { ru: 'Отметить второй', uz: 'Ikkinchisini belgilash' },
    done_text: { ru: 'Дециметр это десять сантиметров, ровно как десяток единиц.', uz: "Detsimetr bu o'n santimetr, xuddi bir o'nlik birlikdek." },
    audio: {
      ru: [
        'Возьмём обычную линейку и посмотрим на её деления.',
        'Десять сантиметров подряд складываются в один дециметр.',
        'На линейке двадцать сантиметров, то есть ровно два дециметра. Здесь счёт идёт десятками, как у обычных чисел.'
      ],
      uz: [
        "Oddiy chizg'ichni olib, uning bo'linmalariga qaraymiz.",
        "Ketma-ket o'n santimetr bitta detsimetrga yig'iladi.",
        "Chizg'ichda yigirma santimetr, ya'ni rosa ikki detsimetr bor. Bu yerda hisob oddiy sonlardek o'nlab boradi."
      ]
    }
  },

  s2: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil' },
    w: 4,
    h: 4,
    lead: { ru: 'От дециметра к метру', uz: 'Detsimetrdan metrga' },
    capA: { ru: '10 дм = 1 м', uz: '10 dm = 1 m' },
    capB: { ru: '100 см = 1 м', uz: '100 sm = 1 m' },
    res: { ru: 'метр это сто сантиметров', uz: 'metr bu yuz santimetr' },
    btn1: { ru: 'Сложить дециметры', uz: "Detsimetrlarni yig'ish" },
    btn2: { ru: 'Пересчитать в см', uz: 'sm ga qayta sanash' },
    done_text: { ru: 'В метре десять дециметров и сто сантиметров. Мерки связаны десятками.', uz: "Bir metrda o'n detsimetr va yuz santimetr bor. O'lchovlar o'nlab bog'langan." },
    audio: {
      ru: [
        'Теперь возьмём мерку побольше.',
        'Десять дециметров подряд дают один метр.',
        'А если считать сантиметрами, то в метре их сто. Десять дециметров по десять сантиметров каждый.'
      ],
      uz: [
        "Endi kattaroq o'lchovni olamiz.",
        "Ketma-ket o'n detsimetr bitta metr beradi.",
        "Santimetr bilan sanasak, bir metrda ular yuzta. O'nta detsimetr, har birida o'n santimetrdan."
      ]
    }
  },

  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    q: { ru: 'Сколько сантиметров в одном метре?', uz: 'Bir metrda necha santimetr bor?' },
    opts: [
      { ru: '100', uz: '100' },
      { ru: '10', uz: '10' },
      { ru: '60', uz: '60' },
      { ru: '1000', uz: '1000' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Десять сантиметров это дециметр, а не метр.', uz: "O'n santimetr bu detsimetr, metr emas." },
      2: { ru: 'Шестьдесят это про время, а не про длину.', uz: "Oltmish bu vaqt haqida, uzunlik haqida emas." },
      3: { ru: 'Тысяча сантиметров это уже десять метров.', uz: "Ming santimetr bu allaqachon o'n metr." }
    },
    on_correct: { ru: 'Верно. В метре сто сантиметров.', uz: "To'g'ri. Bir metrda yuz santimetr bor." },
    rule_lines: {
      ru: ['1 дм = 10 см', '1 м = 10 дм', '1 м = 100 см'],
      uz: ["1 dm = 10 sm", "1 m = 10 dm", "1 m = 100 sm"]
    },
    rule_ex: { ru: '3 м = 300 см', uz: '3 m = 300 sm' },
    rule_speech: { ru: 'В дециметре десять сантиметров, в метре десять дециметров, а значит сто сантиметров. Длину считают десятками, в отличие от времени.', uz: "Detsimetrda o'n santimetr, metrda o'n detsimetr, demak yuz santimetr bor. Uzunlik vaqtdan farqli o'laroq o'nlab sanaladi." },
    audio: {
      intro: { ru: 'Соберём правило. Три мерки длины связаны между собой.', uz: "Qoidani yig'amiz. Uzunlikning uch o'lchovi o'zaro bog'liq." }
    }
  },

  s4: {
    eyebrow: { ru: 'Чертёж', uz: 'Chizma' },
    q: { ru: 'На линейке отмечено 30 см. Сколько это дециметров?', uz: "Chizg'ichda 30 sm belgilangan. Bu necha detsimetr?" },
    fig_w: 3,
    fig_h: 1,
    opts: [
      { ru: '3 дм', uz: '3 dm' },
      { ru: '30 дм', uz: '30 dm' },
      { ru: '300 дм', uz: '300 dm' },
      { ru: '1 дм', uz: '1 dm' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Тридцать дециметров это целых три метра.', uz: "O'ttiz detsimetr bu butun uch metr." },
      2: { ru: 'Триста дециметров это тридцать метров, слишком много.', uz: "Uch yuz detsimetr bu o'ttiz metr, juda ko'p." },
      3: { ru: 'Один дециметр это всего десять сантиметров.', uz: "Bir detsimetr bu atigi o'n santimetr." }
    },
    audio: {
      intro: { ru: 'Посмотри на линейку. Отмечено тридцать сантиметров. Сколько это дециметров?', uz: "Chizg'ichga qarang. O'ttiz santimetr belgilangan. Bu necha detsimetr?" },
      on_correct: { ru: 'Верно. Три раза по десять сантиметров.', uz: "To'g'ri. O'n santimetrdan uch marta." },
      on_wrong: { ru: 'Раздели сантиметры на десять.', uz: "Santimetrlarni o'nga bo'ling." }
    }
  },

  s5: {
    eyebrow: { ru: 'Сортировка', uz: 'Saralash' },
    lead: { ru: 'Разложи предметы по меркам', uz: "Narsalarni o'lchovlarga ajrating" },
    bin_a: { ru: 'сантиметры', uz: 'santimetr' },
    bin_b: { ru: 'метры', uz: 'metr' },
    items: [
      { n: { ru: 'ластик', uz: "o'chirg'ich" }, a: true, hint: { ru: 'Ластик короткий, счёт на сантиметры.', uz: "O'chirg'ich kalta, hisob santimetrda." } },
      { n: { ru: 'дверь', uz: 'eshik' }, a: false, hint: { ru: 'Высоту двери называют в метрах.', uz: "Eshik balandligi metrda aytiladi." } },
      { n: { ru: 'карандаш', uz: 'qalam' }, a: true, hint: { ru: 'Карандаш меряют сантиметрами.', uz: "Qalam santimetr bilan o'lchanadi." } },
      { n: { ru: 'класс', uz: 'sinf xonasi' }, a: false, hint: { ru: 'Комнату меряют метрами.', uz: "Xona metr bilan o'lchanadi." } }
    ],
    audio: {
      intro: { ru: 'Четыре предмета. Отправь каждый к своей мерке.', uz: "To'rtta narsa. Har birini o'z o'lchoviga yuboring." },
      on_correct: { ru: 'Всё на месте. Мелкое меряют сантиметрами, крупное метрами.', uz: "Hammasi joyida. Mayda narsa santimetrda, yirigi metrda o'lchanadi." },
      on_wrong: { ru: 'Прикинь, поместится ли это на парте.', uz: "Bu partaga sig'adimi, chamalab ko'ring." }
    }
  },

  s6: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv' },
    q: { ru: 'Сколько сантиметров в 4 дм?', uz: '4 dm da necha santimetr bor?' },
    opts: [
      { ru: '40', uz: '40' },
      { ru: '4', uz: '4' },
      { ru: '400', uz: '400' },
      { ru: '14', uz: '14' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Четыре сантиметра это меньше половины дециметра.', uz: "To'rt santimetr bu detsimetrning yarmidan kam." },
      2: { ru: 'Четыреста сантиметров это четыре метра.', uz: "To'rt yuz santimetr bu to'rt metr." },
      3: { ru: 'Числа не приписывают друг к другу, их умножают.', uz: "Sonlar yonma-yon yozilmaydi, ko'paytiriladi." }
    },
    audio: {
      intro: { ru: 'Быстрый вопрос. Сколько сантиметров в четырёх дециметрах?', uz: "Tez savol. To'rt detsimetrda necha santimetr bor?" },
      on_correct: { ru: 'Верно, четыре раза по десять.', uz: "To'g'ri, o'ntadan to'rt marta." },
      on_wrong: { ru: 'В дециметре десять сантиметров.', uz: "Detsimetrda o'n santimetr bor." }
    }
  },

  s7: {
    eyebrow: { ru: 'Консоль', uz: 'Konsol' },
    lead: { ru: 'Доска 2 м 30 см', uz: 'Taxta 2 m 30 sm' },
    swap_line: { ru: 'доска 2 м 30 см', uz: 'taxta 2 m 30 sm' },
    cells: [
      { head: { ru: 'метры в см', uz: 'metrlar sm da' }, label: { ru: '2 м', uz: '2 m' }, ans: 200, hint: { ru: 'В метре сто сантиметров.', uz: "Bir metrda yuz santimetr bor." } },
      { head: { ru: 'ещё сантиметров', uz: 'yana santimetr' }, label: { ru: 'см', uz: 'sm' }, ans: 30, hint: { ru: 'Это число дано в условии.', uz: 'Bu son shartda berilgan.' } },
      { head: { ru: 'всего', uz: 'jami' }, label: '200 + 30', ans: 230, hint: { ru: 'Сложи обе части в одной мерке.', uz: "Ikkala qismni bitta o'lchovda qo'shing." } }
    ],
    check: { ru: '2 м 30 см = 230 см', uz: '2 m 30 sm = 230 sm' },
    check_label: { ru: 'одна мерка', uz: "bitta o'lchov" },
    audio: {
      intro: { ru: 'Заполни три окна. Метры в сантиметрах, остаток и вся длина.', uz: "Uchta oynani to'ldiring. Metrlar santimetrda, qoldiq va butun uzunlik." },
      on_correct: { ru: 'Двести сантиметров и ещё тридцать, всего двести тридцать.', uz: "Ikki yuz santimetr va yana o'ttiz, jami ikki yuz o'ttiz." }
    }
  },

  s8: {
    eyebrow: { ru: 'Найди ошибку', uz: 'Xatoni toping' },
    q: { ru: 'Записали: 1 м + 20 см = 21 см. Где ошибка?', uz: "1 m + 20 sm = 21 sm deb yozilibdi. Xato qayerda?" },
    fig_line: { ru: '1 м + 20 см', uz: '1 m + 20 sm' },
    opts: [
      { ru: 'метр взяли за 1 см', uz: 'metr 1 sm deb olingan' },
      { ru: 'ошибки нет', uz: "xato yo'q" },
      { ru: 'неверно сложили', uz: "noto'g'ri qo'shilgan" },
      { ru: 'перепутали дм и см', uz: 'dm va sm chalkashtirilgan' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Метр это сто сантиметров, значит выйдет сто двадцать.', uz: "Metr bu yuz santimetr, demak yuz yigirma chiqadi." },
      2: { ru: 'Сложение верное, подвела мерка метра.', uz: "Qo'shish to'g'ri, metr o'lchovi aldadi." },
      3: { ru: 'Дециметры тут вообще не участвуют.', uz: "Detsimetr bu yerda umuman qatnashmaydi." }
    },
    audio: {
      intro: { ru: 'Кто-то сложил метр и сантиметры как обычные числа. Найди ошибку.', uz: "Kimdir metr va santimetrni oddiy son kabi qo'shibdi. Xatoni toping." },
      on_correct: { ru: 'Верно. Сначала приводят к одной мерке. Метр это сто сантиметров.', uz: "To'g'ri. Avval bitta o'lchovga keltiriladi. Metr bu yuz santimetr." },
      on_wrong: { ru: 'Посмотри на мерки рядом с числами.', uz: "Sonlar yonidagi o'lchovlarga qarang." }
    }
  },

  s9: {
    eyebrow: { ru: 'Ловушка Бита', uz: "Bit tuzog'i" },
    lead: { ru: 'Бит выбирает верёвку', uz: 'Bit arqon tanlayapti' },
    lines: ['первая 90 см, вторая 1 м', 'Бит: беру первую, девяносто больше единицы'],
    lines_uz: ["birinchisi 90 sm, ikkinchisi 1 m", "Bit: birinchisini olaman, to'qson birdan katta"],
    line_cap: { ru: 'Бит: сравниваю числа', uz: 'Bit: sonlarni solishtiraman' },
    trap_label: { ru: 'Так ли это?', uz: 'Shundaymi?' },
    trap_opts: { ru: ['нет, сначала одна мерка', 'да, девяносто больше'], uz: ["yo'q, avval bitta o'lchov", "ha, to'qson kattaroq"] },
    trap_ci: 0,
    trap_correct: { ru: 'Да. Пока мерки разные, числа сравнивать нельзя. Один метр это сто сантиметров, а сто больше девяноста, значит вторая верёвка длиннее.', uz: "Ha. O'lchovlar har xil ekan, sonlarni solishtirib bo'lmaydi. Bir metr bu yuz santimetr, yuz esa to'qsondan katta, demak ikkinchi arqon uzunroq." },
    trap_wrong: { ru: 'Переведи метр в сантиметры и сравни снова.', uz: "Metrni santimetrga o'tkazib, qaytadan solishtiring." },
    audio: {
      ru: [
        'Бит выбирает верёвку подлиннее.',
        'Первая девяносто сантиметров, вторая один метр. Девяносто больше единицы, беру первую.',
        'Так ли это?'
      ],
      uz: [
        "Bit uzunroq arqon tanlayapti.",
        "Birinchisi to'qson santimetr, ikkinchisi bir metr. To'qson birdan katta, birinchisini olaman.",
        "Shundaymi?"
      ]
    }
  },

  s10: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq' },
    q: { ru: 'Сколько сантиметров в 5 м?', uz: '5 m da necha santimetr bor?' },
    ans: 500,
    check: '5 · 100',
    check_label: { ru: 'метры в сантиметры', uz: 'metrdan santimetrga' },
    hint: { ru: 'Умножь пять на сто.', uz: "Beshni yuzga ko'paytiring." },
    audio: {
      intro: { ru: 'Теперь считай сам. Сколько сантиметров в пяти метрах?', uz: "Endi o'zingiz hisoblang. Besh metrda necha santimetr bor?" },
      on_correct: { ru: 'Пятьсот сантиметров.', uz: "Besh yuz santimetr." }
    }
  },

  s11: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq' },
    q: { ru: 'Лента 80 см, отрезали 25 см. Сколько сантиметров осталось?', uz: "Lenta 80 sm, 25 sm kesib olindi. Necha santimetr qoldi?" },
    ans: 55,
    check: '80 − 25',
    check_label: { ru: 'мерка одна', uz: "o'lchov bitta" },
    hint: { ru: 'Из восьмидесяти вычти двадцать пять.', uz: "Sakson santimetrdan yigirma beshni ayiring." },
    audio: {
      intro: { ru: 'Лента восемьдесят сантиметров, отрезали двадцать пять. Сколько осталось?', uz: "Lenta sakson santimetr, yigirma besh kesib olindi. Qancha qoldi?" },
      on_correct: { ru: 'Пятьдесят пять сантиметров.', uz: "Ellik besh santimetr." }
    }
  },

  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    lead: { ru: 'Кристальная мачта', uz: 'Kristall machta' },
    q: { ru: 'Мачта 3 м, нарастили 40 см. Сколько сантиметров стало и сколько это дециметров?', uz: "Machta 3 m, 40 sm uzaytirildi. Necha santimetr bo'ldi va bu necha detsimetr?" },
    q_speech: { ru: 'мачта три метра, нарастили сорок сантиметров. Сколько сантиметров стало и сколько это дециметров?', uz: "machta uch metr, qirq santimetr uzaytirildi. Necha santimetr bo'ldi va bu necha detsimetr?" },
    tbl_heads: [
      { ru: 'было', uz: 'bor edi' },
      { ru: 'нарастили', uz: 'uzaytirildi' },
      { ru: 'вопрос', uz: 'savol' }
    ],
    tbl_cells: [{ ru: '3 м', uz: '3 m' }, { ru: '40 см', uz: '40 sm' }, '?'],
    pick_label: { ru: 'С какого действия начинаем?', uz: 'Qaysi amaldan boshlaymiz?' },
    opts: [
      { ru: 'перевести метры в см', uz: 'metrni sm ga o\'tkazish' },
      { ru: 'сложить 3 и 40', uz: "3 va 40 ni qo'shish" },
      { ru: 'умножить 40 на 3', uz: "40 ni 3 ga ko'paytirish" },
      { ru: 'разделить 40 на 10', uz: "40 ni 10 ga bo'lish" }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Метры и сантиметры складывать напрямую нельзя.', uz: "Metr va santimetrni to'g'ridan-to'g'ri qo'shib bo'lmaydi." },
      2: { ru: 'Умножать тут нечего, длину нарастили один раз.', uz: "Bu yerda ko'paytiradigan narsa yo'q, uzunlik bir marta oshgan." },
      3: { ru: 'Деление понадобится позже, для дециметров.', uz: "Bo'lish keyinroq, detsimetr uchun kerak bo'ladi." }
    },
    pick_ok: { ru: 'Верно. Сначала одна мерка, потом ответ.', uz: "To'g'ri. Avval bitta o'lchov, keyin javob." },
    step1_q: { ru: 'Сколько сантиметров стала мачта?', uz: 'Machta necha santimetr bo\'ldi?' },
    ans1: 340,
    hint1: { ru: 'Три метра это триста сантиметров, прибавь сорок.', uz: "Uch metr bu uch yuz santimetr, qirqni qo'shing." },
    step2_q: { ru: 'Сколько это дециметров?', uz: 'Bu necha detsimetr?' },
    ans2: 34,
    hint2: { ru: 'Раздели сантиметры на десять.', uz: "Santimetrlarni o'nga bo'ling." },
    check: { ru: '340 см = 34 дм', uz: '340 sm = 34 dm' },
    setup_audio: { ru: 'Мачту наращивают. Посмотри на таблицу и реши, с чего начать.', uz: "Machta uzaytirilyapti. Jadvalga qarang va nimadan boshlashni hal qiling." },
    audio: {
      intro: { ru: 'Мачта три метра, нарастили сорок сантиметров. Сколько сантиметров стало и сколько дециметров?', uz: "Machta uch metr, qirq santimetr uzaytirildi. Necha santimetr bo'ldi va necha detsimetr?" },
      on_correct: { ru: 'Триста сорок сантиметров, а это тридцать четыре дециметра.', uz: "Uch yuz qirq santimetr, bu esa o'ttiz to'rt detsimetr." },
      on_wrong: { ru: 'Сначала приведи к сантиметрам, потом переводи в дециметры.', uz: "Avval santimetrga keltiring, keyin detsimetrga o'tkazing." }
    }
  },

  s13: {
    eyebrow: { ru: 'Финал', uz: 'Yakuniy' },
    intro_line: { ru: 'Три задания. Сначала одна мерка', uz: "Uchta topshiriq. Avval bitta o'lchov" },
    items: [
      {
        kind: 'num',
        q: { ru: 'Сколько сантиметров в 7 дм?', uz: '7 dm da necha santimetr bor?' },
        q_speech: { ru: 'сколько сантиметров в семи дециметрах?', uz: 'yetti detsimetrda necha santimetr bor?' },
        ans: 70,
        hint: { ru: 'В дециметре десять сантиметров.', uz: "Detsimetrda o'n santimetr bor." }
      },
      {
        kind: 'num',
        q: { ru: 'Сколько сантиметров в 2 м 15 см?', uz: '2 m 15 sm da necha santimetr bor?' },
        q_speech: { ru: 'сколько сантиметров в двух метрах пятнадцати сантиметрах?', uz: 'ikki metr o\'n besh santimetrda necha santimetr bor?' },
        ans: 215,
        hint: { ru: 'Двести и ещё пятнадцать.', uz: "Ikki yuz va yana o'n besh." }
      },
      {
        kind: 'num',
        q: { ru: 'Сколько дециметров в 90 см?', uz: '90 sm da necha detsimetr bor?' },
        q_speech: { ru: 'сколько дециметров в девяноста сантиметрах?', uz: 'to\'qson santimetrda necha detsimetr bor?' },
        ans: 9,
        hint: { ru: 'Раздели девяносто на десять.', uz: "To'qsonni o'nga bo'ling." }
      }
    ],
    fact_badge: { ru: 'Знаешь ли ты?', uz: 'Bilasizmi?' },
    fact_text: {
      ru: 'Метр не придумали наугад. Учёные взяли расстояние от Северного полюса до экватора и разделили его на десять миллионов частей. Одна такая часть и стала метром, чтобы мерка была одинаковой для всех стран.',
      uz: "Metr shunchaki o'ylab topilmagan. Olimlar Shimoliy qutbdan ekvatorgacha bo'lgan masofani o'n million qismga bo'lishgan. Ana shu bitta qism metr bo'lgan, o'lchov hamma davlat uchun bir xil bo'lsin deb."
    },
    fact_audio: {
      ru: 'Вот откуда взялся метр. Раньше в каждой стране мерили по-своему, локтями и шагами, и торговать было неудобно. Тогда учёные решили взять мерку у самой Земли. Они измерили расстояние от Северного полюса до экватора и разделили его на десять миллионов частей. Одна такая часть и стала метром. Позже мерку уточнили, но длина осталась той же.',
      uz: "Metr mana qayerdan olingan. Ilgari har bir davlatda o'zicha o'lchashgan, tirsak va qadam bilan, savdo qilish esa noqulay edi. Shunda olimlar o'lchovni Yerning o'zidan olishga qaror qilishdi. Ular Shimoliy qutbdan ekvatorgacha masofani o'lchab, o'n million qismga bo'lishdi. Ana shu bitta qism metr bo'ldi. Keyinchalik o'lchov aniqlashtirildi, lekin uzunlik o'sha bo'lib qoldi."
    },
    audio: {
      intro: { ru: 'Три задания напоследок. Помни про десятки.', uz: "Oxirida uchta topshiriq. O'nliklarni yodda tuting." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Переведи всё в одну мерку.', uz: "Hammasini bitta o'lchovga o'tkazing." }
    }
  },

  s14: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    mission_done: { ru: 'Мерки длины собраны!', uz: "Uzunlik o'lchovlari yig'ildi!" },
    cando: {
      ru: ['перевожу метры в сантиметры', 'сравниваю длины в одной мерке', 'не путаю дециметр с метром'],
      uz: ["metrni santimetrga o'tkazaman", "uzunliklarni bitta o'lchovda solishtiraman", "detsimetrni metr bilan chalkashtirmayman"]
    },
    rule_recap: { ru: 'В дециметре 10 сантиметров, в метре 10 дециметров и 100 сантиметров.', uz: "Detsimetrda 10 santimetr, metrda 10 detsimetr va 100 santimetr bor." },
    conn_label_refs: { ru: 'опирается на', uz: 'nimaga tayanadi' },
    conn_refs: { ru: 'урок 42: перевод мерок; урок 10: умножение на 100', uz: "42-dars: o'lchov o'tkazish; 10-dars: 100 ga ko'paytirish" },
    conn_label_next: { ru: 'дальше', uz: 'keyin' },
    conn_next: { ru: 'календарь: сутки, неделя, месяц и год', uz: 'kalendar: sutka, hafta, oy va yil' },
    audio: {
      ru: 'Мерки длины собраны. Запомни главное. В дециметре десять сантиметров, в метре десять дециметров, а всего в метре сто сантиметров. Длину, в отличие от времени, считают десятками, и это удобно. И повтори за мной самое важное. Пока мерки разные, числа сравнивать нельзя. Девяносто сантиметров меньше одного метра, хотя девяносто больше единицы. В следующий раз возьмём мерки покрупнее и заглянем в календарь!',
      uz: "Uzunlik o'lchovlari yig'ildi. Asosiysini eslab qoling. Detsimetrda o'n santimetr, metrda o'n detsimetr, jami metrda esa yuz santimetr bor. Uzunlik vaqtdan farqli o'laroq o'nlab sanaladi va bu qulay. Eng muhimini takrorlang. O'lchovlar har xil ekan, sonlarni solishtirib bo'lmaydi. To'qson santimetr bir metrdan kam, garchi to'qson birdan katta bo'lsa ham. Keyingi safar yiriroq o'lchovlarni olib, kalendarga qaraymiz!"
    }
  }
};

const BRIDGES = {
  s1:  { ru: 'Посмотрим на линейку.', uz: "Chizg'ichga qaraymiz." },
  s2:  { ru: 'Теперь мерка побольше.', uz: "Endi kattaroq o'lchov." },
  s3:  { ru: "Соберём это в правило.", uz: "Buni qoidaga yig'amiz." },
  s4:  { ru: 'Прочитай линейку.', uz: "Chizg'ichni o'qing." },
  s5:  { ru: 'Разложи предметы.', uz: 'Narsalarni ajrating.' },
  s6:  { ru: 'Быстрый вопрос.', uz: 'Tez savol.' },
  s7:  { ru: 'Заполни консоль.', uz: "Konsolni to'ldiring." },
  s8:  { ru: 'Тут сложили разные мерки.', uz: "Bu yerda har xil o'lchov qo'shilibdi." },
  s9:  { ru: 'А вот и Бит со своим выбором.', uz: "Mana Bit ham o'z tanlovi bilan." },
  s10: { ru: 'Теперь считай сам.', uz: "Endi o'zingiz hisoblang." },
  s11: { ru: 'И ещё одна лента.', uz: 'Yana bitta lenta.' },
  s12: { ru: 'Задача от строителей.', uz: 'Quruvchilardan masala.' },
  s13: { ru: 'Финальная проверка.', uz: 'Yakuniy tekshiruv.' },
  s14: { ru: 'Подведём итог.', uz: 'Yakun yasaymiz.' }
};

const S14_PAYOFF = {
  ru: 'Мерки собраны. Сантиметр, дециметр и метр встали в один ряд.',
  uz: "O'lchovlar yig'ildi. Santimetr, detsimetr va metr bir qatorga tizildi."
};

// --- SAHNA TUGUNI (D44): 1-DARSNING shahri, ustiga o'lchov chizg'ichi.
const RulerNodeLayer = () => (
  <svg className="lm-scene-bg" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <g transform="translate(84 128)">
      <rect x="0" y="0" width="232" height="30" rx="4" fill="#FDF6E8" stroke="#8A7550" strokeWidth="2"/>
      {Array.from({ length: 21 }).map((_, i) => (
        <line key={i} x1={8 + i * 11} y1="0" x2={8 + i * 11} y2={i % 10 === 0 ? 18 : i % 5 === 0 ? 12 : 7} stroke="#8A7550" strokeWidth={i % 10 === 0 ? 2 : 1}/>
      ))}
      <text x="8" y="27" fontSize="7" fill="#5A4A2E" fontFamily="'JetBrains Mono', monospace">0</text>
      <text x="112" y="27" fontSize="7" fill="#5A4A2E" fontFamily="'JetBrains Mono', monospace">10</text>
      <text x="216" y="27" fontSize="7" fill="#5A4A2E" fontFamily="'JetBrains Mono', monospace">20</text>
      <rect x="8" y="-8" width="110" height="6" rx="3" fill="#FFD98A" stroke="#C06A2E" strokeWidth="1.2"/>
      <text x="63" y="-12" textAnchor="middle" fontSize="7" fill="#8A5A2E" fontFamily="'JetBrains Mono', monospace">1 dm</text>
      <text x="116" y="46" textAnchor="middle" fontSize="8" letterSpacing="1.2" fill="#3F5A6B" fontFamily="'JetBrains Mono', monospace">1 m = 100 sm</text>
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
      <RulerNodeLayer/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};

// --- EKRAN CHIZMASI (s4): chizg'ichda 30 sm belgilangan.
const RulerFig = () => (
  <svg viewBox="0 0 260 90" style={{ width: 'min(280px, 88%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <rect x="10" y="26" width="240" height="34" rx="4" fill="#FDF6E8" stroke="#8A7550" strokeWidth="2"/>
    {Array.from({ length: 31 }).map((_, i) => (
      <line key={i} x1={18 + i * 7.6} y1="26" x2={18 + i * 7.6} y2={i % 10 === 0 ? 48 : i % 5 === 0 ? 40 : 34} stroke="#8A7550" strokeWidth={i % 10 === 0 ? 2 : 1}/>
    ))}
    {[0, 10, 20, 30].map((n, i) => (
      <text key={n} x={18 + i * 76} y="58" textAnchor="middle" fontSize="8" fill="#5A4A2E" fontFamily="'JetBrains Mono', monospace">{n}</text>
    ))}
    <rect x="18" y="16" width="228" height="6" rx="3" fill="#FFD98A" stroke="#C06A2E" strokeWidth="1.4"/>
    <text x="132" y="12" textAnchor="middle" fontSize="9" fontWeight="800" fill="#C06A2E" fontFamily="'JetBrains Mono', monospace">30 sm</text>
    <text x="132" y="80" textAnchor="middle" fontSize="10" fontWeight="800" fill="#8A7550" fontFamily="'JetBrains Mono', monospace">? dm</text>
  </svg>
);

// --- FACTCARD QAHRAMONI: Yer va qutbdan ekvatorgacha yoy.
const EarthMeterFig = () => {
  const lang = useLang();
  return (
  <svg viewBox="0 0 220 104" style={{ width: 'min(266px, 84%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <circle cx="86" cy="52" r="40" fill="#DCEBF5" stroke="#2E7E9E" strokeWidth="2"/>
    <path d="M86 12 A40 40 0 0 1 126 52" fill="none" stroke="#C06A2E" strokeWidth="3.4" strokeLinecap="round"/>
    <line x1="46" y1="52" x2="126" y2="52" stroke="#2E7E9E" strokeWidth="1.6" strokeDasharray="4 3"/>
    <circle cx="86" cy="12" r="3.4" fill="#C06A2E"/>
    <circle cx="126" cy="52" r="3.4" fill="#C06A2E"/>
    <text x="86" y="102" textAnchor="middle" fontSize="8" fill="#3F5A6B" fontFamily="'JetBrains Mono', monospace">{lang === 'ru' ? 'полюс и экватор' : 'qutb va ekvator'}</text>
    <g transform="translate(158 40)">
      <rect x="0" y="0" width="52" height="14" rx="3" fill="#FDF6E8" stroke="#8A7550" strokeWidth="1.6"/>
      {Array.from({ length: 6 }).map((_, i) => <line key={i} x1={6 + i * 8} y1="0" x2={6 + i * 8} y2="7" stroke="#8A7550" strokeWidth="1"/>)}
      <text x="26" y="28" textAnchor="middle" fontSize="9" fontWeight="800" fill="#C06A2E" fontFamily="'JetBrains Mono', monospace">1 m</text>
    </g>
  </svg>
  );
};

export default createLesson({
  TOTAL_SCREENS, LESSON_META, SCREEN_META, CONTENT, BRIDGES, S14_PAYOFF,
  STYLES: LESSON_STYLES,
  Scene: LessonScene,
  FactFig: EarthMeterFig,
  figs: { s4: <RulerFig/> }
});
