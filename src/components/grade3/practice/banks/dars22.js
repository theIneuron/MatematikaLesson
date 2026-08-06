// Dars 22 amaliyoti — Ikki xonalini ikki xonaliga ko'paytirish.
// Nazariya: src/components/grade3/Dars22.jsx (num-3-22). Darsda 12 · 15 = 180 ishlangan —
// amaliyotda BOSHQA sonlar olindi.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 order · 2 input · 3 dnd · 4 multi · 5 input · 6 multi · 7 GRID · 8 match · 9 choice · 10 GRID
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS22_BANK = {
  title: "Dars 22 · Ikki xonalini ikki xonaliga ko'paytirish",
  items: [

    /* 1 · order · 🟢 — usul qadamlari. */
    q('01', 'Usul qadamlari', '🟢', 'd22-steps', 'order', '🪜', [2, 0, 3, 1],
      {
        e: "To'rt qadam", s: "14 × 12 ni hisoblaymiz: ikkinchi ko'paytuvchini o'nlik va birlikka ajratamiz.",
        a: 'Qadamlarni tartiblang.',
        o: ['14 × 10 = 140', '140 + 28 = 168', '12 = 10 + 2', '14 × 2 = 28'],
        y: "Ikkinchi ko'paytuvchini yoyamiz, birinchi sonni o'nlikka, keyin birlikka ko'paytiramiz, natijalarni qo'shamiz.",
        n: "Yoyish qaysi songa qo'llaniladi? Birinchi son butunicha oladimi?",
        r: '14 × 12 = 14 × 10 + 14 × 2 = 168.',
      },
      {
        e: 'Четыре шага', s: 'Считаем 14 × 12: второй множитель раскладываем на десятки и единицы.',
        a: 'Расставь шаги по порядку.',
        o: ['14 × 10 = 140', '140 + 28 = 168', '12 = 10 + 2', '14 × 2 = 28'],
        y: 'Раскладываем второй множитель, умножаем первое число на десятки, потом на единицы, складываем.',
        n: 'К какому числу применяют разложение? Первое число берётся целиком?',
        r: '14 × 12 = 14 × 10 + 14 × 2 = 168.',
      }),

    /* 2 · input · 🟢 — o'nlikka ko'paytirish. */
    q('02', "O'nlikka ko'paytiring", '🟢', 'd22-times-ten', 'input', '🔟', ['140'],
      {
        e: 'Birinchi bo\'lak', s: '14 × 12 ni hisoblashda birinchi bo\'lak — 14 ni 10 ga ko\'paytirish.',
        a: '14 × 10 nechaga teng?',
        y: '14 × 10 = 140: razryadlar bir xona chapga siljidi.',
        n: "10 ga ko'paytirganda songa bitta nol qo'shiladi.",
        r: "O'nlikka ko'paytirish eng oson bo'lak: 14 × 10 = 140.",
        p: 'Javob',
      },
      {
        e: 'Первая часть', s: 'При счёте 14 × 12 первая часть — умножить 14 на 10.',
        a: 'Чему равно 14 × 10?',
        y: '14 × 10 = 140: разряды сдвинулись на один влево.',
        n: 'При умножении на 10 к числу добавляется один нуль.',
        r: 'Умножение на десяток — самая простая часть: 14 × 10 = 140.',
        p: 'Ответ',
      }, 'numeric'),

    /* 3 · dnd · 🟢 — bo'lakni o'z ko'paytmasiga. */
    q('03', "Bo'laklarni joylang", '🟢', 'd22-sort-parts', 'dnd', '🗂️', [0, 1, 0, 1],
      {
        e: '14 × 12', s: "12 ni 10 va 2 ga ajratdik. Har bo'lak 14 ni ko'paytiradi.",
        a: 'Har ko\'paytmani u qaysi bo\'lakdan chiqqaniga qarab joylang.',
        tokens: ['14 × 10', '14 × 2', '140', '28'],
        zones: ["O'nlikdan", 'Birlikdan'],
        dndHint: 'Kartalar tugadi.',
        y: "O'nlikdan: 14 × 10 = 140. Birlikdan: 14 × 2 = 28. Jami 168.",
        n: "12 da nechta o'nlik, nechta birlik bor? Har bo'lak o'z ko'paytmasini beradi.",
        r: '14 × 12 = 14 × 10 + 14 × 2 = 140 + 28 = 168.',
      },
      {
        e: '14 × 12', s: 'Разложили 12 на 10 и 2. Каждая часть умножает 14.',
        a: 'Разложи произведения по тому, из какой части они получились.',
        tokens: ['14 × 10', '14 × 2', '140', '28'],
        zones: ['Из десятка', 'Из единиц'],
        dndHint: 'Карточки закончились.',
        y: 'Из десятка: 14 × 10 = 140. Из единиц: 14 × 2 = 28. Всего 168.',
        n: 'Сколько в 12 десятков и сколько единиц? Каждая часть даёт своё произведение.',
        r: '14 × 12 = 14 × 10 + 14 × 2 = 140 + 28 = 168.',
      }),

    /* 4 · multi · 🟡 — teng yozuvlar. */
    q('04', 'Teng yozuvlar', '🟡', 'd22-equal-forms', 'multi', '⚖️', [0, 2],
      {
        e: '14 × 12 ga teng', s: "To'rtta yozuv. Ikkitasi 168 beradi.",
        a: '14 × 12 ga TENG yozuvlarni belgilang.',
        o: ['14 × 10 + 14 × 2', '14 × 10 + 2', '12 × 14', '14 + 12'],
        y: "14 × 10 + 14 × 2 = 168 va 12 × 14 = 168. Qolganlari 142 va 26.",
        n: "Yoyilmada ikkala bo'lak ham 14 ni ko'paytirishi kerak. Ko'paytuvchilar o'rni almashsa, natija o'zgarmaydi.",
        r: "Ikkala bo'lak ham birinchi songa ko'paytiriladi.",
      },
      {
        e: 'Равно 14 × 12', s: 'Четыре записи. Две дают 168.',
        a: 'Отметь записи, РАВНЫЕ 14 × 12.',
        o: ['14 × 10 + 14 × 2', '14 × 10 + 2', '12 × 14', '14 + 12'],
        y: '14 × 10 + 14 × 2 = 168 и 12 × 14 = 168. Остальные дают 142 и 26.',
        n: 'В разложении обе части должны умножать 14. От перестановки множителей результат не меняется.',
        r: 'Обе части умножаются на первое число.',
      }),

    /* 5 · input · 🟡 — birliklarga ko'paytirish. */
    q('05', 'Ikkinchi bo\'lak', '🟡', 'd22-times-ones', 'input', '🔢', ['28'],
      {
        e: 'Birliklar qismi', s: '14 × 12 da ikkinchi bo\'lak — 14 ni 2 ga ko\'paytirish.',
        a: '14 × 2 nechaga teng?',
        y: '14 × 2 = 28: 10 × 2 + 4 × 2 = 20 + 8.',
        n: "14 ni o'nlik va birlikka yoying, keyin har bo'lakni 2 ga ko'paytiring.",
        r: 'Ikkinchi bo\'lak birinchi sonni birliklarga ko\'paytiradi.',
        p: 'Javob',
      },
      {
        e: 'Часть единиц', s: 'В 14 × 12 вторая часть — умножить 14 на 2.',
        a: 'Чему равно 14 × 2?',
        y: '14 × 2 = 28: 10 × 2 + 4 × 2 = 20 + 8.',
        n: 'Разложи 14 на десятки и единицы, потом умножь каждую часть на 2.',
        r: 'Вторая часть умножает первое число на единицы.',
        p: 'Ответ',
      }, 'numeric'),

    /* 6 · multi · 🟡 — qaysi ko'paytmalar 168 dan katta. */
    q('06', '168 dan katta', '🟡', 'd22-gt-168', 'multi', '📈', [1, 3],
      {
        e: 'Taxmin qiling', s: "To'rtta ko'paytma. Hisoblamasdan ham taxmin qilish mumkin.",
        a: 'Qaysi ko\'paytmalar 168 dan KATTA? Hammasini belgilang.',
        o: ['14 × 12', '15 × 13', '11 × 12', '20 × 12'],
        y: '15 × 13 = 195 va 20 × 12 = 240 — ikkalasi ham 168 dan katta. 14 × 12 = 168, 11 × 12 = 132.',
        n: "Ko'paytuvchilar kattarsa, ko'paytma ham kattaradi. 14 × 12 bilan solishtiring.",
        r: "Ko'paytuvchini oshirsak, ko'paytma ham oshadi.",
      },
      {
        e: 'Прикинь', s: 'Четыре произведения. Прикинуть можно и не считая.',
        a: 'Какие произведения БОЛЬШЕ 168? Отметь все.',
        o: ['14 × 12', '15 × 13', '11 × 12', '20 × 12'],
        y: '15 × 13 = 195 и 20 × 12 = 240 — оба больше 168. А 14 × 12 = 168, 11 × 12 = 132.',
        n: 'Если множители растут, растёт и произведение. Сравнивай с 14 × 12.',
        r: 'Увеличили множитель — увеличилось и произведение.',
      }),

    /* 7 · GRID · 🟡 — ustunda, ikki qator. */
    q('07', 'Ustunda: 14 × 12', '🟡', 'd22-grid-14x12', 'grid', '⌨️', undefined,
      {
        e: 'Ikki qator', s: "Ustunda ikki xonaliga ko'paytirganda IKKI qator chiqadi: birliklardan va o'nlikdan.",
        a: '14 × 12 ni ustunda hisoblang.',
        gridHint: "Ikkinchi qator bir xona CHAPGA suriladi: u o'nlikka ko'paytma.",
        y: "Birliklarga: 14 × 2 = 28. O'nlikka: 14 × 1 = 14, u bir xona chapga suriladi va 140 bo'ladi. Jami 168.",
        n: "Avval 14 ni 2 ga, keyin 14 ni 1 ga ko'paytiring. Ikkinchi qatorni surishni unutmang.",
        r: "O'nlikka ko'paytma bir xona chapga suriladi.",
      },
      {
        e: 'Две строки', s: 'При умножении на двузначное в столбике получаются ДВЕ строки: от единиц и от десятка.',
        a: 'Вычисли 14 × 12 столбиком.',
        gridHint: 'Вторая строка сдвигается на разряд ВЛЕВО: это произведение на десяток.',
        y: 'На единицы: 14 × 2 = 28. На десяток: 14 × 1 = 14, строка сдвигается влево и даёт 140. Всего 168.',
        n: 'Сначала умножь 14 на 2, потом 14 на 1. Не забудь сдвинуть вторую строку.',
        r: 'Произведение на десяток сдвигается на разряд влево.',
      }, undefined, {
        grid: {
          op: 'mul',
          cols: 3,
          rows: [
            { id: 'a', cells: ['', '1', '4'] },
            { id: 'b', sign: true, cells: ['', '1', '2'], line: true },
            { id: 'p1', cells: ['', '2', '8'], fill: 'all' },
            { id: 'p2', sign: '+', cells: ['1', '4'], offset: 1, fill: 'all', line: true },
            { id: 'res', cells: ['1', '6', '8'], fill: 'all' },
          ],
        },
      }),

    /* 8 · match · 🔴 — ko'paytma va natija. */
    q('08', 'Ko\'paytma va natija', '🔴', 'd22-match', 'match', '🔗', [0, 1, 2],
      {
        e: 'Uch ko\'paytma', s: "Uchta ko'paytma. Har birini bo'laklarga ajratib hisoblang.",
        a: 'Har ko\'paytmani uning natijasiga ulang.',
        left: ['14 × 12', '11 × 12', '15 × 13'],
        right: ['168', '132', '195'],
        y: '14 × 12 = 168, 11 × 12 = 132, 15 × 13 = 195.',
        n: "Har ko'paytmada ikkinchi sonni o'nlik va birlikka yoying.",
        r: "Ikki xonaliga ko'paytirish ikki bo'lakdan iborat.",
      },
      {
        e: 'Три произведения', s: 'Три произведения. Посчитай каждое по частям.',
        a: 'Соедини каждое произведение с его результатом.',
        left: ['14 × 12', '11 × 12', '15 × 13'],
        right: ['168', '132', '195'],
        y: '14 × 12 = 168, 11 × 12 = 132, 15 × 13 = 195.',
        n: 'В каждом произведении разложи второе число на десятки и единицы.',
        r: 'Умножение на двузначное состоит из двух частей.',
      }),

    /* 9 · choice · 🔴 — XATONI TOPING. */
    q('09', 'Xatoni toping', '🔴', 'd22-find-error', 'choice', '🔎', 1,
      {
        e: 'Xatoni toping', s: "Anvar: «14 × 12 = 14 × 10 + 2 = 142».",
        a: 'Anvarning xatosi qayerda?',
        o: ["14 ni 10 ga ko'paytirgan", "Birlikni 14 ga ko'paytirmagan", '12 ni yoymagan', "O'nlikni noto'g'ri olgan"],
        y: "Ikkinchi bo'lak 14 × 2 = 28 bo'lishi kerak edi, u esa faqat 2 ni qo'shgan.",
        n: "Yoyilmada IKKALA bo'lak ham birinchi songa ko'paytirilishi kerak.",
        by: [
          "14 × 10 to'g'ri bajarilgan: 140. Xato keyingi bo'lakda.",
          undefined,
          "12 ni yoygan: 10 va 2 ni ajratgan. Xato keyingi qadamda.",
          "O'nlikni to'g'ri olgan: 12 da bitta o'nlik bor. Xato boshqa joyda.",
        ],
        r: '14 × 12 = 14 × 10 + 14 × 2 = 140 + 28 = 168.',
      },
      {
        e: 'Найди ошибку', s: 'Анвар: «14 × 12 = 14 × 10 + 2 = 142».',
        a: 'В чём ошибка Анвара?',
        o: ['Умножил 14 на 10', 'Не умножил единицы на 14', 'Не разложил 12', 'Неверно взял десяток'],
        y: 'Вторая часть должна была быть 14 × 2 = 28, а он просто прибавил 2.',
        n: 'В разложении ОБЕ части должны умножиться на первое число.',
        by: [
          '14 × 10 сделано верно: 140. Ошибка в следующей части.',
          undefined,
          '12 он разложил: выделил 10 и 2. Ошибка на следующем шаге.',
          'Десяток взят верно: в 12 один десяток. Ошибка в другом.',
        ],
        r: '14 × 12 = 14 × 10 + 14 × 2 = 140 + 28 = 168.',
      }),

    /* 10 · GRID · 🔴 — ustunda, ko'chirish bilan. */
    q('10', 'Ustunda: 23 × 14', '🔴', 'd22-grid-23x14', 'grid', '🚀', undefined,
      {
        e: 'Yakuniy mashq', s: "Bu misolda ikki qator ham bor, ko'chirish ham bor.",
        a: '23 × 14 ni ustunda hisoblang.',
        gridHint: "Ko'chirishni razryad ustidagi kichik katakka yozing. Ikkinchi qator bir xona chapga suriladi.",
        y: "23 × 4 = 92, 23 × 10 = 230. Jami 92 + 230 = 322.",
        n: "Avval 23 ni 4 ga ko'paytiring (birliklarda ko'chirish bor), keyin 23 ni 1 ga va suring.",
        r: "Ikki xonaliga ko'paytirishda ikki qator qo'shiladi.",
      },
      {
        e: 'Итоговое задание', s: 'В этом примере есть и две строки, и перенос.',
        a: 'Вычисли 23 × 14 столбиком.',
        gridHint: 'Перенос записывай в маленькую клетку над разрядом. Вторая строка сдвигается на разряд влево.',
        y: '23 × 4 = 92, 23 × 10 = 230. Всего 92 + 230 = 322.',
        n: 'Сначала умножь 23 на 4 (в единицах будет перенос), потом 23 на 1 и сдвинь.',
        r: 'При умножении на двузначное складываются две строки.',
      }, undefined, {
        grid: {
          op: 'mul',
          cols: 4,
          rows: [
            { id: 'carry', kind: 'carry', cells: ['', '', '1', ''], fill: 'all' },
            { id: 'a', cells: ['', '', '2', '3'] },
            { id: 'b', sign: true, cells: ['', '', '1', '4'], line: true },
            { id: 'p1', cells: ['', '9', '2'], fill: 'all' },
            { id: 'p2', sign: '+', cells: ['', '2', '3'], offset: 1, fill: 'all', line: true },
            { id: 'res', cells: ['', '3', '2', '2'], fill: [1, 2, 3] },
          ],
        },
      }),
  ],
};

export default DARS22_BANK;
