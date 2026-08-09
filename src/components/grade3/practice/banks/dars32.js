// Dars 32 amaliyoti — Ulushga doir masalalar.
// Nazariya: src/components/grade3/Dars32.jsx (num-3-32).
// Butun ma'lum bo'lsa — maxrajga BO'LAMIZ; ulush ma'lum bo'lsa — maxrajga KO'PAYTIRAMIZ.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 input · 2 dnd · 3 input · 4 choice · 5 dnd · 6 order · 7 multi · 8 match · 9 choice · 10 multi
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS32_BANK = {
  title: 'Dars 32 · Ulushga doir masalalar',
  items: [

    /* 1 · input · 🟢 — butundan ulushga. */
    q('01', 'Butundan ulushga', '🟢', 'd32-whole-to-part', 'input', '🔢', ['5'],
      {
        e: 'Tanish yo\'l', s: "Qovun 20 kg keladi. Uni teng to'rt bo'lakka bo'ldik.",
        a: 'Bitta bo\'lak necha kilogramm?',
        y: "20 ni 4 ga bo'lamiz, 5 kilogramm chiqadi. Bu to'rtdan bir ulush.",
        n: 'Butun ma\'lum. Uni nechta teng bo\'lakka bo\'lish kerak?',
        r: "Butun ma'lum bo'lsa, ulushni topish uchun maxrajga bo'lamiz.",
        p: 'Javob',
      },
      {
        e: 'Знакомый путь', s: 'Дыня весит 20 кг. Её разделили на четыре равные части.',
        a: 'Сколько килограммов в одной части?',
        y: 'Делим 20 на 4, получается 5 килограммов. Это одна четвёртая часть.',
        n: 'Целое известно. На сколько равных частей его нужно разделить?',
        r: 'Если целое известно, долю находят делением на знаменатель.',
        p: 'Ответ',
      }, 'numeric'),

    /* 2 · dnd · 🟢 — bo'lish yoki ko'paytirish. */
    q('02', 'Qaysi amal?', '🟢', 'd32-which-op', 'dnd', '🧭', [0, 1, 0, 1],
      {
        e: 'Ikki tomon', s: "To'rtta savol. Ba'zilarida butun ma'lum, ba'zilarida ulush.",
        a: "Savollarni ajrating: qayerda bo'lish, qayerda ko'paytirish kerak.",
        tokens: [
          "18 kg ning uchdan biri qancha?",
          "Uchdan bir 6 kg. Butun qancha?",
          "24 ta olmaning to'rtdan biri nechta?",
          "To'rtdan bir 6 ta olma. Jami nechta?",
        ],
        zones: ["Bo'lamiz", "Ko'paytiramiz"],
        dndHint: 'Savollar tugadi.',
        y: "Butun ma'lum bo'lsa bo'lamiz, ulush ma'lum bo'lsa ko'paytiramiz.",
        n: 'Savolda katta son berilganmi yoki bitta bo\'lakning qiymatimi?',
        r: 'Savol qaysi amal kerakligini hal qiladi.',
      },
      {
        e: 'Две стороны', s: 'Четыре вопроса. В одних известно целое, в других доля.',
        a: 'Разложи вопросы: где нужно делить, а где умножать.',
        tokens: [
          'Сколько составляет треть от 18 кг?',
          'Треть равна 6 кг. Сколько целое?',
          'Сколько яблок в четверти от 24?',
          'Четверть равна 6 яблокам. Сколько всего?',
        ],
        zones: ['Делим', 'Умножаем'],
        dndHint: 'Вопросы закончились.',
        y: 'Если известно целое — делим, если известна доля — умножаем.',
        n: 'В вопросе дано большое число или значение одной части?',
        r: 'Вопрос решает, какое действие нужно.',
      }),

    /* 3 · input · 🟢 — ulushdan butunga. */
    q('03', 'Ulushdan butunga', '🟢', 'd32-part-to-whole', 'input', '🔢', ['12'],
      {
        e: 'Teskari yo\'l', s: "Qovunning choragi 3 kg keladi.",
        a: 'Butun qovun necha kilogramm?',
        y: "Shunday bo'lak to'rtta. 3 ni 4 ga ko'paytiramiz, 12 kilogramm chiqadi.",
        n: "Bitta bo'lak ma'lum. Butunda shunday bo'lak nechta bor?",
        r: "Ulush ma'lum bo'lsa, butunni topish uchun maxrajga ko'paytiramiz.",
        p: 'Javob',
      },
      {
        e: 'Обратный путь', s: 'Четверть дыни весит 3 кг.',
        a: 'Сколько килограммов вся дыня?',
        y: 'Таких частей четыре. Умножаем 3 на 4, получается 12 килограммов.',
        n: 'Известна одна часть. Сколько таких частей в целом?',
        r: 'Если известна доля, целое находят умножением на знаменатель.',
        p: 'Ответ',
      }, 'numeric'),

    /* 4 · choice · 🟡 — nega ko'paytiramiz. */
    q('04', 'Nega ko\'paytiramiz?', '🟡', 'd32-why-mult', 'choice', '🔒', 1,
      {
        e: 'Sababni tushunamiz', s: "Beshdan bir ulush 4 ta shirinlik. Butunni topmoqchimiz.",
        a: 'Nega bu yerda ko\'paytirish kerak?',
        o: [
          "Chunki ko'paytirish bo'lishdan oson",
          "Chunki butun shunday bo'lakdan beshta yig'iladi",
          "Chunki 4 dan 5 katta",
          "Chunki bo'lish faqat katta sonlarda ishlaydi",
        ],
        y: "Butun beshta bir xil bo'lakdan yig'ilgan, shuning uchun 4 ni 5 ga ko'paytiramiz.",
        n: "Butunda shunday bo'lak nechta bor?",
        by: [
          'Amal qulaylik uchun emas, ma\'nosiga qarab tanlanadi.',
          undefined,
          'Sonlarni solishtirish amalni tanlamaydi. Ma\'noga qarang.',
          "Bo'lish har qanday sonda ishlaydi. Gap unda emas.",
        ],
        r: "Butun bu maxraj martasiga olingan ulush.",
      },
      {
        e: 'Разбираем причину', s: 'Одна пятая часть это 4 конфеты. Хотим найти целое.',
        a: 'Почему здесь нужно умножение?',
        o: [
          'Потому что умножать легче, чем делить',
          'Потому что целое складывается из пяти таких частей',
          'Потому что 5 больше, чем 4',
          'Потому что деление работает только с большими числами',
        ],
        y: 'Целое собрано из пяти одинаковых частей, поэтому умножаем 4 на 5.',
        n: 'Сколько таких частей в целом?',
        by: [
          'Действие выбирают не по удобству, а по смыслу.',
          undefined,
          'Сравнение чисел не выбирает действие. Смотри на смысл.',
          'Деление работает с любыми числами. Дело не в этом.',
        ],
        r: 'Целое это доля, взятая столько раз, сколько в знаменателе.',
      }),

    /* 5 · dnd · 🟡 — javobi 8 bo'lganlar. */
    q('05', 'Javob 8 mi?', '🟡', 'd32-is-eight', 'dnd', '🎯', [0, 1, 0, 1],
      {
        e: 'Hisoblab ko\'ring', s: "To'rtta masala. Ikkitasining javobi 8.",
        a: 'Masalalarni ajrating: qaysilarining javobi 8, qaysilariniki boshqa.',
        tokens: [
          '24 ning uchdan biri',
          '24 ning to\'rtdan biri',
          "Ikkidan bir 4, butun qancha?",
          "Uchdan bir 4, butun qancha?",
        ],
        zones: ['Javob 8', 'Javob 8 emas'],
        dndHint: 'Masalalar tugadi.',
        y: "24 ni 3 ga bo'lsak 8, 4 ni 2 ga ko'paytirsak ham 8. Qolganlari 6 va 12.",
        n: 'Har masalada avval amalni tanlang, keyin hisoblang.',
        r: 'Bitta javobga ikki xil yo\'ldan kelish mumkin.',
      },
      {
        e: 'Посчитай', s: 'Четыре задачи. У двух ответ равен 8.',
        a: 'Разложи задачи: у каких ответ 8, а у каких другой.',
        tokens: [
          'Треть от 24',
          'Четверть от 24',
          'Половина равна 4, сколько целое?',
          'Треть равна 4, сколько целое?',
        ],
        zones: ['Ответ 8', 'Ответ не 8'],
        dndHint: 'Задачи закончились.',
        y: '24 разделить на 3 это 8, и 4 умножить на 2 тоже 8. Остальные дают 6 и 12.',
        n: 'В каждой задаче сначала выбери действие, потом считай.',
        r: 'К одному ответу можно прийти двумя разными путями.',
      }),

    /* 6 · order · 🟡 — yechim qadamlari. */
    q('06', 'Yechim qadamlari', '🟡', 'd32-steps', 'order', '🪜', [2, 0, 1],
      {
        e: 'Uch qadam', s: "Oltidan bir ulush 5 ta kitob. Butun kutubxonani topmoqchimiz.",
        a: 'Yechim qadamlarini tartib bilan tanlang.',
        o: ["5 ni 6 ga ko'paytiraman", 'Javob 30 ta kitob', "Ulush ma'lum, butun noma'lum"],
        y: "Avval nima ma'lumligini aniqlaymiz, keyin ko'paytiramiz, oxirida javob yozamiz.",
        n: 'Amalni tanlashdan oldin nimani aniqlash kerak?',
        r: 'Avval nima berilganini aniqlaymiz, keyin amalni tanlaymiz.',
      },
      {
        e: 'Три шага', s: 'Шестая часть это 5 книг. Хотим найти всю библиотеку.',
        a: 'Выбери шаги решения по порядку.',
        o: ['Умножаю 5 на 6', 'Ответ 30 книг', 'Доля известна, целое неизвестно'],
        y: 'Сначала определяем, что известно, потом умножаем, в конце пишем ответ.',
        n: 'Что нужно определить до выбора действия?',
        r: 'Сначала определяем, что дано, потом выбираем действие.',
      }),

    /* 7 · multi · 🟡 — bo'lish kerak bo'lganlar. */
    q('07', 'Bo\'lish kerak', '🟡', 'd32-need-div', 'multi', '➗', [0, 2],
      {
        e: 'Amalni tanlang', s: "To'rtta savol. Ikkitasida bo'lish kerak.",
        a: 'Qaysi savollarda bo\'lish kerak? Hammasini belgilang.',
        o: [
          "30 ta shirinlikning yarmi nechta?",
          "Yarmi 15 ta. Jami nechta?",
          "16 metr lentaning to'rtdan biri qancha?",
          "To'rtdan bir 4 metr. Butun lenta qancha?",
        ],
        y: "Birinchi va uchinchi savolda butun berilgan, shuning uchun bo'lamiz.",
        n: "Savolda katta son berilgan bo'lsa, u butun bo'ladi.",
        r: "Butun berilgan bo'lsa, bo'lamiz.",
      },
      {
        e: 'Выбери действие', s: 'Четыре вопроса. В двух нужно делить.',
        a: 'В каких вопросах нужно деление? Отметь все.',
        o: [
          'Сколько конфет в половине от 30?',
          'Половина это 15 штук. Сколько всего?',
          'Сколько метров в четверти от 16 метров?',
          'Четверть это 4 метра. Сколько вся лента?',
        ],
        y: 'В первом и третьем вопросе дано целое, поэтому делим.',
        n: 'Если в вопросе дано большое число, это целое.',
        r: 'Если дано целое, делим.',
      }),

    /* 8 · match · 🔴 — masala va javob. */
    q('08', 'Masala va javob', '🔴', 'd32-match-answer', 'match', '🔗', [0, 1, 2],
      {
        e: 'Uch masala', s: 'Har masalada avval amalni tanlash kerak.',
        a: 'Har masalani javobiga ulang.',
        left: [
          '18 ning uchdan biri',
          "Beshdan bir 3, butun?",
          '20 ning to\'rtdan biri',
        ],
        right: ['6', '15', '5'],
        y: "18 : 3 = 6, 3 · 5 = 15, 20 : 4 = 5.",
        n: 'Butun berilgan bo\'lsa bo\'ling, ulush berilgan bo\'lsa ko\'paytiring.',
        r: 'Amalni savolning o\'zi tanlaydi.',
      },
      {
        e: 'Три задачи', s: 'В каждой задаче сначала нужно выбрать действие.',
        a: 'Соедини каждую задачу с её ответом.',
        left: [
          'Треть от 18',
          'Пятая часть равна 3, целое?',
          'Четверть от 20',
        ],
        right: ['6', '15', '5'],
        y: '18 : 3 = 6, 3 · 5 = 15, 20 : 4 = 5.',
        n: 'Если дано целое — дели, если дана доля — умножай.',
        r: 'Действие выбирает сам вопрос.',
      }),

    /* 9 · choice · 🔴 — xato yechim. */
    q('09', 'Xato qayerda?', '🔴', 'd32-find-error', 'choice', '🔎', 2,
      {
        e: 'Yechimni tekshiring', s: "Masala: uchdan bir ulush 7 ta daftar, butun nechta? O'quvchi 7 : 3 deb yozdi.",
        a: "O'quvchining xatosi nimada?",
        o: [
          "Sonlar noto'g'ri olingan",
          "7 ni 3 ga emas, 7 ni 7 ga bo'lish kerak edi",
          "Bo'lish emas, ko'paytirish kerak edi",
          'Xato yo\'q, hammasi to\'g\'ri',
        ],
        y: "Ulush ma'lum edi, butun noma'lum. Demak 7 ni 3 ga ko'paytirish kerak, javob 21.",
        n: 'Masalada butun berilganmi yoki bitta bo\'lakmi?',
        by: [
          "Sonlar to'g'ri olingan, muammo amalda.",
          "Bo'lish umuman kerak emas edi, son almashtirish yordam bermaydi.",
          undefined,
          "Yechim xato: bo'lish butunni kichraytirdi, butun esa kattaroq bo'lishi kerak.",
        ],
        r: "Ulushdan butunga borilsa, ko'paytiriladi.",
      },
      {
        e: 'Проверь решение', s: 'Задача: треть это 7 тетрадей, сколько всего? Ученик записал 7 : 3.',
        a: 'В чём ошибка ученика?',
        o: [
          'Взяты не те числа',
          'Надо было делить 7 на 7, а не на 3',
          'Нужно было умножать, а не делить',
          'Ошибки нет, всё верно',
        ],
        y: 'Известна была доля, а целое неизвестно. Значит 7 нужно умножить на 3, ответ 21.',
        n: 'В задаче дано целое или одна часть?',
        by: [
          'Числа взяты верные, проблема в действии.',
          'Делить вообще не нужно было, замена числа не поможет.',
          undefined,
          'Решение неверное: деление уменьшило целое, а целое должно быть больше.',
        ],
        r: 'От доли к целому идут умножением.',
      }),

    /* 10 · multi · 🔴 — butun 24 bo'lgan holatlar. */
    q('10', 'Butun 24', '🔴', 'd32-whole24', 'multi', '🚀', [0, 3],
      {
        e: 'Yakuniy mashq', s: "To'rtta holat. Ikkitasida butun 24 ga teng.",
        a: 'Qaysi hollarda butun 24 ga teng? Hammasini belgilang.',
        o: [
          'Uchdan bir 8 ga teng',
          'To\'rtdan bir 8 ga teng',
          'Ikkidan bir 8 ga teng',
          'Sakkizdan bir 3 ga teng',
        ],
        y: '8 · 3 = 24 va 3 · 8 = 24. Qolganlari 32 va 16 beradi.',
        n: 'Har holatda ulushni maxrajga ko\'paytiring.',
        r: 'Butun bu ulushning maxraj martasiga olingani.',
      },
      {
        e: 'Итоговое задание', s: 'Четыре случая. В двух целое равно 24.',
        a: 'В каких случаях целое равно 24? Отметь все.',
        o: [
          'Треть равна 8',
          'Четверть равна 8',
          'Половина равна 8',
          'Восьмая часть равна 3',
        ],
        y: '8 · 3 = 24 и 3 · 8 = 24. Остальные дают 32 и 16.',
        n: 'В каждом случае умножь долю на знаменатель.',
        r: 'Целое это доля, взятая столько раз, сколько в знаменателе.',
      }),
  ],
};

export default DARS32_BANK;
