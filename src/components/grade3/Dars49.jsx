import React from 'react';
import { BitSVG, LUMO_CAST, LumoCityBg, createLesson } from './_kit/index.jsx';
import { LESSON_STYLES } from './_kit/styles.js';

// ============================================================================
// DD 3-SINF | Dars49 — "Tengsizliklar, rost va yolg'on mulohazalar" (num-3-49)
// Б6 «O'LCHOVLAR» | Syujet: Lumo shahri (reja 54-satr).
// SAHNA: 1-DARSNING shahri, tugun — belgilar taxtasi.
// DARSLIK ASOSI (Burxonov, 3-sinf, «Sharq» 2019, 117-bet).
// YADRO: mulohaza — rost yoki yolg'on bo'ladigan tasdiq. Savol mulohaza emas. Kichik yoki
//   teng belgisi TENGLIKNI ham qamrab oladi, shuning uchun 5 ≤ 5 rost.
// Misconception: M1 «kichik yoki teng faqat kichik degani»; M2 belgini o'ngdan chapga
//   o'qish; M3 savolni mulohaza deb hisoblash; M4 «yolg'on demak ma'nosiz».
// FactCard: kompyuter ichida faqat rost va yolg'on bor — hamma hisob shu ikki javobga
//   keltiriladi.
// Bu dars MA'LUMOT fayli: ekranlar va mexanika kitda (`createLesson`).
// ============================================================================
const TOTAL_SCREENS = 15;
const LESSON_META = {
  lessonId: 'num-3-49',
  lessonTitle: { ru: 'Урок 49. Неравенства; истинные и ложные высказывания', uz: "49-dars. Tengsizliklar, rost va yolg'on mulohazalar" }
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
    topic: { ru: 'Истинно или ложно', uz: "Rost yoki yolg'on" },
    lead: { ru: 'На табло надпись: 5 ≤ 5', uz: "Taxtada yozuv: 5 ≤ 5" },
    order_cap: { ru: 'знак читается «меньше или равно»', uz: "belgi «kichik yoki teng» deb o'qiladi" },
    q: { ru: 'Верна ли запись 5 ≤ 5?', uz: '5 ≤ 5 yozuvi rostmi?' },
    opt0: { ru: 'верна', uz: 'rost' },
    opt1: { ru: 'неверна', uz: "yolg'on" },
    opt2: { ru: 'нельзя сказать', uz: "aytib bo'lmaydi" },
    opt3: { ru: 'это не запись', uz: 'bu yozuv emas' },
    audio: {
      intro: {
        ru: [
          'Задачи мы разобрали. Теперь научимся отвечать на вопрос, верна ли запись.',
          'На табло города горит надпись. Пять меньше или равно пяти.',
          'Пять не меньше пяти, но знак говорит не только про меньше.',
          'Как думаешь, верна ли эта запись?'
        ],
        uz: [
          "Masalalarni ko'rib chiqdik. Endi yozuv rostmi degan savolga javob berishni o'rganamiz.",
          "Shahar taxtasida yozuv yonib turibdi. Besh kichik yoki teng besh.",
          "Besh beshdan kichik emas, lekin belgi faqat kichik haqida aytmaydi.",
          "Sizningcha, bu yozuv rostmi?"
        ]
      },
      on_correct: { ru: 'Верно! Знак меньше или равно допускает и равенство, поэтому запись истинна.', uz: "To'g'ri! Kichik yoki teng belgisi tenglikni ham qabul qiladi, shuning uchun yozuv rost." },
      on_wrong1: { ru: 'Знак читают целиком. Достаточно, чтобы выполнялась хотя бы одна часть, а равенство здесь есть.', uz: "Belgi to'liq o'qiladi. Kamida bir qismi bajarilsa yetadi, tenglik esa bu yerda bor." },
      on_wrong2: { ru: 'Сказать можно точно. Любая такая запись либо верна, либо нет.', uz: "Aniq aytsa bo'ladi. Bunday yozuv yo rost, yo yolg'on." },
      on_idk: { ru: 'Ничего. Сейчас разберём знак по частям.', uz: "Hechqisi yo'q. Hozir belgini qismlarga ajratamiz." }
    }
  },

  s1: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil' },
    lead: { ru: 'Разбираем знак по частям', uz: 'Belgini qismlarga ajratamiz' },
    task_line: '5 ≤ 5',
    task_line_uz: "5 ≤ 5",
    step1: '5 < 5 — нет',
    step1_cap: { ru: 'первая часть не выполнилась', uz: 'birinchi qism bajarilmadi' },
    step2: '5 = 5 — да',
    step2_cap: { ru: 'вторая выполнилась, и этого хватает', uz: 'ikkinchisi bajarildi, shuning o\'zi yetadi' },
    res: 'запись истинна',
    btn1: { ru: 'Проверить «меньше»', uz: '«Kichik» ni tekshirish' },
    btn2: { ru: 'Проверить «равно»', uz: '«Teng» ni tekshirish' },
    done_text: { ru: 'Знак меньше или равно верен, если выполняется хотя бы одна из двух частей.', uz: "Kichik yoki teng belgisi ikki qismdan kamida bittasi bajarilsa rost bo'ladi." },
    audio: {
      ru: [
        'Знак меньше или равно состоит из двух условий сразу.',
        'Проверим первое. Пять меньше пяти. Нет, это неправда.',
        'Проверим второе. Пять равно пяти. Да, это правда. Одного выполненного условия достаточно, поэтому вся запись верна.'
      ],
      uz: [
        "Kichik yoki teng belgisi birdan ikki shartdan iborat.",
        "Birinchisini tekshiramiz. Besh beshdan kichik. Yo'q, bu noto'g'ri.",
        "Ikkinchisini tekshiramiz. Besh beshga teng. Ha, bu rost. Bajarilgan bitta shart yetarli, shuning uchun butun yozuv rost."
      ]
    }
  },

  s2: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil' },
    w: 4,
    h: 4,
    lead: { ru: 'Не всякая запись бывает верной', uz: 'Har qanday yozuv rost bo\'lavermaydi' },
    capA: { ru: '7 ≥ 9 — ложно', uz: "7 ≥ 9 — yolg'on" },
    capB: { ru: 'сколько сейчас времени? — не высказывание', uz: "hozir soat necha? — mulohaza emas" },
    res: 'истинно или ложно',
    btn1: { ru: 'Проверить неравенство', uz: 'Tengsizlikni tekshirish' },
    btn2: { ru: 'Проверить вопрос', uz: 'Savolni tekshirish' },
    done_text: { ru: 'Высказывание всегда либо истинно, либо ложно. Вопрос не высказывание.', uz: "Mulohaza har doim yo rost, yo yolg'on bo'ladi. Savol mulohaza emas." },
    audio: {
      ru: [
        'Теперь посмотрим на две другие записи.',
        'Семь больше или равно девяти. Семь не больше девяти и не равно ей. Ни одна часть не выполнилась, значит запись ложная. Ложная это не бессмысленная, а просто неверная.',
        'А вот вопрос сколько сейчас времени высказыванием не является. На него нельзя ответить истинно или ложно, ведь это не утверждение.'
      ],
      uz: [
        "Endi boshqa ikki yozuvga qaraymiz.",
        "Yetti katta yoki teng to'qqiz. Yetti to'qqizdan katta ham emas, unga teng ham emas. Hech bir qism bajarilmadi, demak yozuv yolg'on. Yolg'on degani ma'nosiz emas, shunchaki noto'g'ri.",
        "Hozir soat necha degan savol esa mulohaza emas. Unga rost yoki yolg'on deb javob berib bo'lmaydi, chunki bu tasdiq emas."
      ]
    }
  },

  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    q: { ru: 'Какая запись является высказыванием?', uz: 'Qaysi yozuv mulohaza?' },
    opts: [
      { ru: '8 > 3', uz: '8 > 3' },
      { ru: 'сколько будет 8 + 3?', uz: '8 + 3 nechaga teng?' },
      { ru: 'посчитай 8 и 3', uz: '8 va 3 ni sana' },
      { ru: '8 + 3', uz: '8 + 3' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Это вопрос, на него отвечают числом, а не словом верно.', uz: "Bu savol, unga son bilan javob beriladi, rost so'zi bilan emas." },
      2: { ru: 'Это просьба что-то сделать, а не утверждение.', uz: "Bu biror ishni bajarish iltimosi, tasdiq emas." },
      3: { ru: 'Это выражение, его считают, а не проверяют на истинность.', uz: "Bu ifoda, u hisoblanadi, rostligi tekshirilmaydi." }
    },
    on_correct: { ru: 'Верно. Только утверждение можно назвать истинным или ложным.', uz: "To'g'ri. Faqat tasdiqni rost yoki yolg'on deb atash mumkin." },
    rule_lines: {
      ru: ['высказывание либо истинно, либо ложно', 'знак ≤ верен и при равенстве', 'вопрос и просьба не высказывания'],
      uz: ["mulohaza yo rost, yo yolg'on", "≤ belgisi tenglikda ham rost", "savol va iltimos mulohaza emas"]
    },
    rule_ex: '5 ≤ 5 истинно, 7 ≥ 9 ложно',
    rule_speech: { ru: 'Высказывание это утверждение, про которое можно сказать, истинно оно или ложно. Знак меньше или равно верен и тогда, когда числа равны. А вопрос или просьба высказыванием не являются.', uz: "Mulohaza bu rost yoki yolg'onligini ayta oladigan tasdiq. Kichik yoki teng belgisi sonlar teng bo'lganda ham rost. Savol yoki iltimos esa mulohaza emas." },
    audio: {
      intro: { ru: 'Соберём правило. Мы проверили три разные записи.', uz: "Qoidani yig'amiz. Uchta har xil yozuvni tekshirdik." }
    }
  },

  s4: {
    eyebrow: { ru: 'Чертёж', uz: 'Chizma' },
    q: { ru: 'Истинна ли запись 12 ≥ 12?', uz: '12 ≥ 12 yozuvi rostmi?' },
    fig_w: 4,
    fig_h: 2,
    opts: [
      { ru: 'истинна', uz: 'rost' },
      { ru: 'ложна', uz: "yolg'on" },
      { ru: 'это вопрос', uz: 'bu savol' },
      { ru: 'нет ответа', uz: "javob yo'q" }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Знак больше или равно верен и при равенстве.', uz: "Katta yoki teng belgisi tenglikda ham rost." },
      2: { ru: 'Это утверждение, а не вопрос.', uz: "Bu tasdiq, savol emas." },
      3: { ru: 'Ответ есть всегда. Либо истинно, либо ложно.', uz: "Javob har doim bor. Yo rost, yo yolg'on." }
    },
    audio: {
      intro: { ru: 'Посмотри на запись. Двенадцать больше или равно двенадцати. Истинна ли она?', uz: "Yozuvga qarang. O'n ikki katta yoki teng o'n ikki. Bu rostmi?" },
      on_correct: { ru: 'Верно. Вторая часть знака выполнилась.', uz: "To'g'ri. Belgining ikkinchi qismi bajarildi." },
      on_wrong: { ru: 'Проверь обе части знака по очереди.', uz: "Belgining ikkala qismini navbat bilan tekshiring." }
    }
  },

  s5: {
    eyebrow: { ru: 'Сортировка', uz: 'Saralash' },
    lead: { ru: 'Разложи записи', uz: 'Yozuvlarni ajrating' },
    bin_a: { ru: 'истинно', uz: 'rost' },
    bin_b: { ru: 'ложно', uz: "yolg'on" },
    items: [
      { n: { ru: '9 > 4', uz: '9 > 4' }, a: true, hint: { ru: 'Девять действительно больше четырёх.', uz: "To'qqiz rostdan to'rtdan katta." } },
      { n: { ru: '6 ≥ 8', uz: '6 ≥ 8' }, a: false, hint: { ru: 'Шесть не больше восьми и не равно ей.', uz: "Olti sakkizdan katta ham emas, teng ham emas." } },
      { n: { ru: '7 ≤ 7', uz: '7 ≤ 7' }, a: true, hint: { ru: 'Здесь выполняется равенство.', uz: "Bu yerda tenglik bajariladi." } },
      { n: { ru: '3 = 5', uz: '3 = 5' }, a: false, hint: { ru: 'Три и пять разные числа.', uz: "Uch va besh har xil sonlar." } }
    ],
    audio: {
      intro: { ru: 'Четыре записи. Отправь каждую в свою корзину.', uz: "To'rtta yozuv. Har birini o'z savatiga yuboring." },
      on_correct: { ru: 'Всё на месте. Ложная запись это не ошибка ученика, а просто неверное утверждение.', uz: "Hammasi joyida. Yolg'on yozuv o'quvchining xatosi emas, shunchaki noto'g'ri tasdiq." },
      on_wrong: { ru: 'Проверь обе части знака.', uz: "Belgining ikkala qismini tekshiring." }
    }
  },

  s6: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv' },
    q: { ru: 'При каком числе запись x ≤ 3 станет ложной?', uz: "Qaysi sonda x ≤ 3 yozuvi yolg'on bo'ladi?" },
    opts: [
      { ru: '4', uz: '4' },
      { ru: '3', uz: '3' },
      { ru: '2', uz: '2' },
      { ru: '0', uz: '0' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'При трёх выполняется равенство, запись истинна.', uz: "Uchda tenglik bajariladi, yozuv rost." },
      2: { ru: 'Два меньше трёх, запись истинна.', uz: "Ikki uchdan kichik, yozuv rost." },
      3: { ru: 'Ноль тоже меньше трёх.', uz: "Nol ham uchdan kichik." }
    },
    audio: {
      intro: { ru: 'Быстрый вопрос. При каком числе запись икс меньше или равно три станет ложной?', uz: "Tez savol. Qaysi sonda iks kichik yoki teng uch yozuvi yolg'on bo'ladi?" },
      on_correct: { ru: 'Верно. Четыре больше трёх, ни одна часть не выполняется.', uz: "To'g'ri. To'rt uchdan katta, hech bir qism bajarilmaydi." },
      on_wrong: { ru: 'Подставь число и проверь обе части знака.', uz: "Sonni qo'yib, belgining ikkala qismini tekshiring." }
    }
  },

  s7: {
    eyebrow: { ru: 'Консоль', uz: 'Konsol' },
    lead: { ru: 'Проверяем запись 4 ≤ 9', uz: '4 ≤ 9 yozuvini tekshiramiz' },
    swap_line: '4 ≤ 9',
    cells: [
      { head: { ru: 'левое число', uz: 'chapdagi son' }, label: 'слева', ans: 4, hint: { ru: 'Оно стоит перед знаком.', uz: 'U belgidan oldin turibdi.' } },
      { head: { ru: 'правое число', uz: "o'ngdagi son" }, label: 'справа', ans: 9, hint: { ru: 'Оно стоит после знака.', uz: 'U belgidan keyin turibdi.' } },
      { head: { ru: 'разница', uz: 'farq' }, label: '9 − 4', ans: 5, hint: { ru: 'На сколько правое больше левого.', uz: "O'ngdagisi chapdagidan nechaga katta." } }
    ],
    check: '4 < 9, значит 4 ≤ 9 истинно',
    check_label: { ru: 'первая часть выполнилась', uz: 'birinchi qism bajarildi' },
    audio: {
      intro: { ru: 'Заполни три окна. Левое число, правое и их разница.', uz: "Uchta oynani to'ldiring. Chapdagi son, o'ngdagisi va ularning farqi." },
      on_correct: { ru: 'Четыре меньше девяти на пять. Первая часть знака выполнилась, запись истинна.', uz: "To'rt to'qqizdan besh birlik kichik. Belgining birinchi qismi bajarildi, yozuv rost." }
    }
  },

  s8: {
    eyebrow: { ru: 'Найди ошибку', uz: 'Xatoni toping' },
    q: { ru: 'Записали: 6 ≤ 6 ложно. Где ошибка?', uz: "6 ≤ 6 yolg'on deb yozilibdi. Xato qayerda?" },
    fig_line: '6 ≤ 6',
    opts: [
      { ru: 'забыли про равенство', uz: 'tenglik unutilgan' },
      { ru: 'ошибки нет', uz: "xato yo'q" },
      { ru: 'знак прочитали наоборот', uz: "belgi teskari o'qilgan" },
      { ru: 'это не высказывание', uz: 'bu mulohaza emas' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Шесть равно шести, значит запись верна.', uz: "Olti oltiga teng, demak yozuv rost." },
      2: { ru: 'Знак прочитан правильно, подвела вторая часть.', uz: "Belgi to'g'ri o'qilgan, ikkinchi qism aldadi." },
      3: { ru: 'Это утверждение, значит высказывание.', uz: "Bu tasdiq, demak mulohaza." }
    },
    audio: {
      intro: { ru: 'Кто-то назвал верную запись ложной. Найди ошибку.', uz: "Kimdir rost yozuvni yolg'on debdi. Xatoni toping." },
      on_correct: { ru: 'Верно. Знак меньше или равно верен и при равенстве чисел.', uz: "To'g'ri. Kichik yoki teng belgisi sonlar teng bo'lganda ham rost." },
      on_wrong: { ru: 'Прочитай знак целиком, у него две части.', uz: "Belgini to'liq o'qing, unda ikki qism bor." }
    }
  },

  s9: {
    eyebrow: { ru: 'Ловушка Бита', uz: "Bit tuzog'i" },
    lead: { ru: 'Бит проверяет табло', uz: 'Bit taxtani tekshiryapti' },
    lines: ['на табло 8 ≥ 8', 'Бит: знак больше, а числа равны, значит ложно'],
    lines_uz: ["taxtada 8 ≥ 8", "Bit: belgi katta, sonlar esa teng, demak yolg'on"],
    line_cap: { ru: 'Бит: читаю только первую часть', uz: 'Bit: faqat birinchi qismni o\'qiyman' },
    trap_label: { ru: 'Так ли это?', uz: 'Shundaymi?' },
    trap_opts: { ru: ['нет, знак читают целиком', 'да, числа равны, значит ложно'], uz: ["yo'q, belgi to'liq o'qiladi", "ha, sonlar teng, demak yolg'on"] },
    trap_ci: 0,
    trap_correct: { ru: 'Да. Знак больше или равно верен в двух случаях. Когда больше и когда равно. Восемь равно восьми, значит запись истинна.', uz: "Ha. Katta yoki teng belgisi ikki holda rost. Katta bo'lganda va teng bo'lganda. Sakkiz sakkizga teng, demak yozuv rost." },
    trap_wrong: { ru: 'Прочитай знак вслух целиком и проверь обе части.', uz: "Belgini ovoz chiqarib to'liq o'qing va ikkala qismni tekshiring." },
    audio: {
      ru: [
        'Бит проверяет надпись на табло.',
        'Тут знак больше, а числа одинаковые. Больше не получилось, значит запись ложная.',
        'Так ли это?'
      ],
      uz: [
        "Bit taxtadagi yozuvni tekshiryapti.",
        "Bu yerda belgi katta, sonlar esa bir xil. Katta chiqmadi, demak yozuv yolg'on.",
        "Shundaymi?"
      ]
    }
  },

  s10: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq' },
    q: { ru: 'Сколько чисел от 1 до 9 подходят под запись x ≤ 4?', uz: "1 dan 9 gacha bo'lgan nechta son x ≤ 4 yozuviga to'g'ri keladi?" },
    ans: 4,
    check: '1, 2, 3, 4',
    check_label: { ru: 'равенство тоже подходит', uz: 'tenglik ham to\'g\'ri keladi' },
    hint: { ru: 'Не забудь про саму четвёрку.', uz: "To'rtning o'zini ham unutmang." },
    audio: {
      intro: { ru: 'Теперь считай сам. Сколько чисел от одного до девяти подходят под запись икс меньше или равно четыре?', uz: "Endi o'zingiz hisoblang. Birdan to'qqizgacha nechta son iks kichik yoki teng to'rt yozuviga to'g'ri keladi?" },
      on_correct: { ru: 'Четыре числа. Один, два, три и сама четвёрка.', uz: "To'rtta son. Bir, ikki, uch va to'rtning o'zi." }
    }
  },

  s11: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq' },
    q: { ru: 'Какое наименьшее число подходит под запись x ≥ 6?', uz: "x ≥ 6 yozuviga to'g'ri keladigan eng kichik son qaysi?" },
    ans: 6,
    check: '6 ≥ 6',
    check_label: { ru: 'равенство разрешено', uz: 'tenglikka ruxsat' },
    hint: { ru: 'Само число тоже подходит.', uz: "Sonning o'zi ham to'g'ri keladi." },
    audio: {
      intro: { ru: 'И ещё вопрос. Какое наименьшее число подходит под запись икс больше или равно шесть?', uz: "Yana savol. Iks katta yoki teng olti yozuviga to'g'ri keladigan eng kichik son qaysi?" },
      on_correct: { ru: 'Шесть. Знак разрешает равенство.', uz: "Olti. Belgi tenglikka ruxsat beradi." }
    }
  },

  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    lead: { ru: 'Правило склада', uz: 'Ombor qoidasi' },
    q: { ru: 'На полку кладут не больше 8 кристаллов. Сейчас лежит 5. Сколько ещё можно положить и сколько всего будет?', uz: "Javonga 8 tadan ortiq kristall qo'yilmaydi. Hozir 5 ta yotibdi. Yana nechtasini qo'ysa bo'ladi va jami nechta bo'ladi?" },
    q_speech: { ru: 'на полку кладут не больше восьми кристаллов, сейчас лежит пять. Сколько ещё можно положить и сколько всего будет?', uz: "javonga sakkiztadan ortiq kristall qo'yilmaydi, hozir beshta yotibdi. Yana nechtasini qo'ysa bo'ladi va jami nechta bo'ladi?" },
    tbl_heads: [
      { ru: 'предел', uz: 'chegara' },
      { ru: 'лежит', uz: 'yotibdi' },
      { ru: 'вопрос', uz: 'savol' }
    ],
    tbl_cells: ['8', '5', '?'],
    pick_label: { ru: 'Какая запись подходит?', uz: 'Qaysi yozuv to\'g\'ri keladi?' },
    opts: [
      { ru: 'x ≤ 8', uz: 'x ≤ 8' },
      { ru: 'x < 8', uz: 'x < 8' },
      { ru: 'x ≥ 8', uz: 'x ≥ 8' },
      { ru: 'x = 8', uz: 'x = 8' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Ровно восемь класть можно, значит равенство разрешено.', uz: "Rosa sakkizta qo'ysa bo'ladi, demak tenglikka ruxsat." },
      2: { ru: 'Так на полке было бы не меньше восьми, а это другое правило.', uz: "Bunda javonda sakkiztadan kam bo'lmasdi, bu boshqa qoida." },
      3: { ru: 'Ровно восемь это не единственный разрешённый вариант.', uz: "Rosa sakkizta yagona ruxsat etilgan variant emas." }
    },
    pick_ok: { ru: 'Верно. Не больше восьми это меньше или равно восьми.', uz: "To'g'ri. Sakkiztadan ortiq emas degani sakkizdan kichik yoki teng." },
    step1_q: { ru: 'Сколько ещё можно положить?', uz: "Yana nechtasini qo'ysa bo'ladi?" },
    ans1: 3,
    hint1: { ru: 'Из восьми вычти пять.', uz: "Sakkizdan beshni ayiring." },
    step2_q: { ru: 'Сколько кристаллов будет на полке тогда?', uz: 'Shunda javonda nechta kristall bo\'ladi?' },
    ans2: 8,
    hint2: { ru: 'Пять и ещё три.', uz: "Besh va yana uch." },
    check: 'x ≤ 8, 5 + 3 = 8',
    setup_audio: { ru: 'На складе есть правило для полок. Посмотри на таблицу и выбери запись.', uz: "Omborda javonlar uchun qoida bor. Jadvalga qarang va yozuvni tanlang." },
    audio: {
      intro: { ru: 'На полку кладут не больше восьми кристаллов, сейчас лежит пять.', uz: "Javonga sakkiztadan ortiq kristall qo'yilmaydi, hozir beshta yotibdi." },
      on_correct: { ru: 'Можно положить ещё три, и тогда на полке будет ровно восемь. Правило не нарушено.', uz: "Yana uchtasini qo'ysa bo'ladi, shunda javonda rosa sakkizta bo'ladi. Qoida buzilmadi." },
      on_wrong: { ru: 'Сначала запиши правило знаком, потом считай.', uz: "Avval qoidani belgi bilan yozing, keyin hisoblang." }
    }
  },

  s13: {
    eyebrow: { ru: 'Финал', uz: 'Yakuniy' },
    intro_line: { ru: 'Три задания. Читай знак целиком', uz: "Uchta topshiriq. Belgini to'liq o'qing" },
    items: [
      {
        kind: 'num',
        q: { ru: 'Сколько чисел от 1 до 9 подходят под x ≤ 6?', uz: "1 dan 9 gacha nechta son x ≤ 6 ga to'g'ri keladi?" },
        q_speech: { ru: 'сколько чисел от одного до девяти подходят под икс меньше или равно шесть?', uz: "birdan to'qqizgacha nechta son iks kichik yoki teng olti ga to'g'ri keladi?" },
        ans: 6,
        hint: { ru: 'Шестёрка тоже подходит.', uz: "Oltining o'zi ham to'g'ri keladi." }
      },
      {
        kind: 'num',
        q: { ru: 'Какое наименьшее число подходит под x ≥ 4?', uz: "x ≥ 4 ga to'g'ri keladigan eng kichik son qaysi?" },
        q_speech: { ru: 'какое наименьшее число подходит под икс больше или равно четыре?', uz: "iks katta yoki teng to'rt ga to'g'ri keladigan eng kichik son qaysi?" },
        ans: 4,
        hint: { ru: 'Равенство разрешено.', uz: "Tenglikka ruxsat." }
      },
      {
        kind: 'num',
        q: { ru: 'Сколько чисел от 1 до 9 делают запись x > 7 истинной?', uz: "1 dan 9 gacha nechta son x > 7 yozuvini rost qiladi?" },
        q_speech: { ru: 'сколько чисел от одного до девяти делают запись икс больше семи истинной?', uz: "birdan to'qqizgacha nechta son iks katta yetti yozuvini rost qiladi?" },
        ans: 2,
        hint: { ru: 'Здесь равенство не разрешено.', uz: "Bu yerda tenglikka ruxsat yo'q." }
      }
    ],
    fact_badge: { ru: 'Знаешь ли ты?', uz: 'Bilasizmi?' },
    fact_text: {
      ru: 'Внутри компьютера нет ничего, кроме истины и лжи. Любая картинка, песня и игра в конце концов превращаются в длинные цепочки ответов да и нет. Компьютер очень быстро проверяет такие утверждения, и из миллионов простых проверок складывается всё, что ты видишь на экране.',
      uz: "Kompyuter ichida rost va yolg'ondan boshqa hech nima yo'q. Har qanday rasm, qo'shiq va o'yin oxir-oqibat uzun ha va yo'q javoblar zanjiriga aylanadi. Kompyuter bunday tasdiqlarni juda tez tekshiradi va millionlab oddiy tekshiruvdan ekranda ko'rgan hamma narsangiz yig'iladi."
    },
    fact_audio: {
      ru: 'Вот что важно знать про наши знаки. Внутри компьютера нет ничего, кроме истины и лжи. Любая картинка, любая песня и любая игра в конце концов превращаются в длинные цепочки ответов да и нет. Компьютер умеет очень быстро проверять такие утверждения, миллионы штук в секунду. Из этих простых проверок и складывается всё, что ты видишь на экране. Так что вопрос истинно или ложно это не школьная выдумка, а основа всей техники вокруг.',
      uz: "Belgilarimiz haqida mana nimani bilish muhim. Kompyuter ichida rost va yolg'ondan boshqa hech nima yo'q. Har qanday rasm, har qanday qo'shiq va har qanday o'yin oxir-oqibat uzun ha va yo'q javoblar zanjiriga aylanadi. Kompyuter bunday tasdiqlarni juda tez tekshira oladi, sekundiga millionlab. Ana shu oddiy tekshiruvlardan ekranda ko'rgan hamma narsangiz yig'iladi. Demak rostmi yoki yolg'onmi degan savol maktab o'yini emas, atrofdagi butun texnikaning asosi."
    },
    audio: {
      intro: { ru: 'Три задания напоследок. Проверяй обе части знака.', uz: "Oxirida uchta topshiriq. Belgining ikkala qismini tekshiring." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Смотри, разрешает знак равенство или нет.', uz: "Belgi tenglikka ruxsat beradimi yoki yo'qmi, qarang." }
    }
  },

  s14: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    mission_done: { ru: 'Табло проверено!', uz: 'Taxta tekshirildi!' },
    cando: {
      ru: ['отличаю высказывание от вопроса', 'читаю знак целиком', 'проверяю запись на истинность'],
      uz: ["mulohazani savoldan ajrataman", "belgini to'liq o'qiyman", "yozuvning rostligini tekshiraman"]
    },
    rule_recap: { ru: 'Высказывание либо истинно, либо ложно, а знаки ≤ и ≥ верны и при равенстве.', uz: "Mulohaza yo rost, yo yolg'on, ≤ va ≥ belgilari esa tenglikda ham rost." },
    conn_label_refs: { ru: 'опирается на', uz: 'nimaga tayanadi' },
    conn_refs: { ru: 'урок 4: сравнение чисел; урок 46: равенство', uz: "4-dars: sonlarni taqqoslash; 46-dars: tenglik" },
    conn_label_next: { ru: 'дальше', uz: 'keyin' },
    conn_next: { ru: 'круговые диаграммы и чтение данных', uz: "doiraviy diagrammalar va ma'lumot o'qish" },
    audio: {
      ru: 'Табло проверено. Запомни главное. Высказывание это утверждение, про которое всегда можно сказать, истинно оно или ложно. Вопрос и просьба высказываниями не являются. А знаки меньше или равно и больше или равно читают целиком, до конца. Они верны и тогда, когда числа равны. Именно на этом месте ошибаются чаще всего, и Бит уже показал как. В следующий раз научимся читать круговые диаграммы!',
      uz: "Taxta tekshirildi. Asosiysini eslab qoling. Mulohaza bu rost yoki yolg'onligini har doim ayta oladigan tasdiq. Savol va iltimos mulohaza emas. Kichik yoki teng hamda katta yoki teng belgilari esa oxirigacha, to'liq o'qiladi. Ular sonlar teng bo'lganda ham rost. Aynan shu joyda ko'proq adashishadi, buni Bit ko'rsatib berdi. Keyingi safar doiraviy diagrammalarni o'qishni o'rganamiz!"
    }
  }
};

const BRIDGES = {
  s1:  { ru: 'Разберём знак.', uz: 'Belgini ajratamiz.' },
  s2:  { ru: 'Теперь другие записи.', uz: 'Endi boshqa yozuvlar.' },
  s3:  { ru: "Соберём это в правило.", uz: "Buni qoidaga yig'amiz." },
  s4:  { ru: 'Прочитай запись.', uz: "Yozuvni o'qing." },
  s5:  { ru: 'Разложи записи.', uz: 'Yozuvlarni ajrating.' },
  s6:  { ru: 'Быстрый вопрос.', uz: 'Tez savol.' },
  s7:  { ru: 'Заполни консоль.', uz: "Konsolni to'ldiring." },
  s8:  { ru: 'Тут знак прочли наполовину.', uz: 'Bu yerda belgi yarim o\'qilibdi.' },
  s9:  { ru: 'А вот и Бит со своей проверкой.', uz: "Mana Bit ham o'z tekshiruvi bilan." },
  s10: { ru: 'Теперь считай сам.', uz: "Endi o'zingiz hisoblang." },
  s11: { ru: 'И ещё один знак.', uz: 'Yana bitta belgi.' },
  s12: { ru: 'Задача со склада.', uz: 'Ombordan masala.' },
  s13: { ru: 'Финальная проверка.', uz: 'Yakuniy tekshiruv.' },
  s14: { ru: 'Подведём итог.', uz: 'Yakun yasaymiz.' }
};

const S14_PAYOFF = {
  ru: 'Табло проверено. Знак прочитан до конца, и ответ нашёлся.',
  uz: "Taxta tekshirildi. Belgi oxirigacha o'qildi va javob topildi."
};

// --- SAHNA TUGUNI (D49): 1-DARSNING shahri, ustiga belgilar taxtasi.
const SignsNodeLayer = () => (
  <svg className="lm-scene-bg" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <g transform="translate(134 100)">
      <rect x="0" y="0" width="132" height="66" rx="6" fill="#14203C" stroke="#8A7550" strokeWidth="2"/>
      <text x="66" y="26" textAnchor="middle" fontSize="18" fontWeight="800" fill="#FFD98A" fontFamily="'JetBrains Mono', monospace">5 ≤ 5</text>
      <text x="66" y="46" textAnchor="middle" fontSize="9" letterSpacing="1.2" fill="#8CE38A" fontFamily="'JetBrains Mono', monospace">ROST</text>
      <text x="66" y="60" textAnchor="middle" fontSize="7" fill="#BFD4EA" fontFamily="'JetBrains Mono', monospace">7 ≥ 9 — yolg'on</text>
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
      <SignsNodeLayer/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};

// --- EKRAN CHIZMASI (s4): 12 ≥ 12 va belgining ikki qismi.
const SignFig = () => (
  <svg viewBox="0 0 240 110" style={{ width: 'min(270px, 85%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <text x="60" y="52" textAnchor="middle" fontSize="30" fontWeight="800" fill="#3A3530" fontFamily="'JetBrains Mono', monospace">12</text>
    <text x="120" y="52" textAnchor="middle" fontSize="30" fontWeight="800" fill="#C06A2E" fontFamily="'JetBrains Mono', monospace">≥</text>
    <text x="180" y="52" textAnchor="middle" fontSize="30" fontWeight="800" fill="#3A3530" fontFamily="'JetBrains Mono', monospace">12</text>
    <g transform="translate(120 76)">
      <rect x="-64" y="0" width="60" height="22" rx="5" fill="#FDF3E0" stroke="#C06A2E" strokeWidth="1.6"/>
      <text x="-34" y="15" textAnchor="middle" fontSize="9" fontWeight="800" fill="#C06A2E" fontFamily="'JetBrains Mono', monospace">katta?</text>
      <rect x="6" y="0" width="60" height="22" rx="5" fill="#E9F7EE" stroke="#1F7A4D" strokeWidth="1.6"/>
      <text x="36" y="15" textAnchor="middle" fontSize="9" fontWeight="800" fill="#1F7A4D" fontFamily="'JetBrains Mono', monospace">teng?</text>
    </g>
  </svg>
);

// --- FACTCARD QAHRAMONI: ha va yo'q zanjiri kompyuter ichida.
const BitsFig = () => (
  <svg viewBox="0 0 220 104" style={{ width: 'min(266px, 84%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <rect x="14" y="20" width="192" height="64" rx="8" fill="#14203C" stroke="#2E7E9E" strokeWidth="2"/>
    {Array.from({ length: 4 }).map((_, r) => (
      Array.from({ length: 8 }).map((_, c) => {
        const on = (r + c) % 3 === 0;
        return (
          <text key={`${r}-${c}`} x={30 + c * 23} y={38 + r * 14} textAnchor="middle" fontSize="10" fontWeight="800"
            fill={on ? '#8CE38A' : '#4E6B8A'} fontFamily="'JetBrains Mono', monospace">{on ? '1' : '0'}</text>
        );
      })
    ))}
    <text x="110" y="98" textAnchor="middle" fontSize="8" fill="#8A7550" fontFamily="'JetBrains Mono', monospace">ha yoki yo'q</text>
  </svg>
);

export default createLesson({
  TOTAL_SCREENS, LESSON_META, SCREEN_META, CONTENT, BRIDGES, S14_PAYOFF,
  STYLES: LESSON_STYLES,
  Scene: LessonScene,
  FactFig: BitsFig,
  figs: { s4: <SignFig/> }
});
