// Dars 17 amaliyoti — Ikki xonali sonni bir xonaliga ko'paytirish.
// Nazariya: src/components/grade3/Dars17.jsx (num-3-17). Darslik 23-24-bet.
// Bank newBanks.js dan ko'chirildi va §1A kanoniga keltirildi.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 order · 2 dnd · 3 match · 4 choice · 5 dnd · 6 input · 7 multi · 8 choice · 9 match · 10 multi
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS17_BANK = {
  title: "Dars 17 · Ikki xonali sonni ko'paytirish",
  items: [

    /* 1 · order · 🟢 — algoritm qadamlari. Eski 03. */
    q('01', 'Algoritm qadamlari', '🟢', 'd17-steps', 'order', '🪜', [2, 0, 3, 1],
      {
        e: 'To\'rt qadam', s: "42 × 2 ni razryadlar orqali hisoblaymiz, lekin qadamlar aralashgan.",
        a: 'Qadamlarni tartiblang.',
        o: ['40 × 2 = 80', '80 + 4 = 84', '42 = 40 + 2', '2 × 2 = 4'],
        y: "Yoyish, keyin o'nlik, keyin birlik, oxirida qo'shish.",
        n: "Ko'paytirishdan oldin nima qilinadi? Qo'shishdan oldin-chi?",
        r: 'Razryad natijalari oxirida qo\'shiladi.',
      },
      {
        e: 'Четыре шага', s: 'Считаем 42 × 2 по разрядам, но шаги перепутались.',
        a: 'Расставь шаги по порядку.',
        o: ['40 × 2 = 80', '80 + 4 = 84', '42 = 40 + 2', '2 × 2 = 4'],
        y: 'Разложить, потом десятки, потом единицы, в конце сложить.',
        n: 'Что делают до умножения? А до сложения?',
        r: 'Результаты разрядов складываются в конце.',
      }),

    /* 2 · dnd · 🟢 — bo'lakni o'z razryadiga. */
    q('02', "Bo'laklarni joylang", '🟢', 'd17-sort-parts', 'dnd', '🗂️', [0, 1, 0, 1],
      {
        e: '23 × 4', s: "23 ni 20 va 3 ga ajratdik, har bo'lakni 4 ga ko'paytiramiz.",
        a: 'Har ko\'paytmani u qaysi razryaddan chiqqaniga qarab joylang.',
        tokens: ['20 × 4', '3 × 4', '80', '12'],
        zones: ["O'nliklardan", 'Birliklardan'],
        dndHint: 'Kartalar tugadi.',
        y: "O'nliklardan: 20 × 4 = 80. Birliklardan: 3 × 4 = 12. Jami 92.",
        n: '23 da nechta o\'nlik, nechta birlik bor?',
        r: '(20 + 3) × 4 = 20 × 4 + 3 × 4 = 80 + 12 = 92.',
      },
      {
        e: '23 × 4', s: 'Разложили 23 на 20 и 3, каждую часть умножаем на 4.',
        a: 'Разложи произведения по разряду, из которого они получились.',
        tokens: ['20 × 4', '3 × 4', '80', '12'],
        zones: ['Из десятков', 'Из единиц'],
        dndHint: 'Карточки закончились.',
        y: 'Из десятков: 20 × 4 = 80. Из единиц: 3 × 4 = 12. Всего 92.',
        n: 'Сколько в 23 десятков и сколько единиц?',
        r: '(20 + 3) × 4 = 20 × 4 + 3 × 4 = 80 + 12 = 92.',
      }),

    /* 3 · match · 🟢 — ko'paytma va natija. */
    q('03', 'Ko\'paytma va natija', '🟢', 'd17-match-result', 'match', '🔗', [0, 1, 2],
      {
        e: 'Uch ko\'paytma', s: "Uchta ko'paytma. Har birini razryadlar orqali hisoblang.",
        a: 'Har ko\'paytmani uning natijasiga ulang.',
        left: ['31 × 3', '42 × 2', '23 × 4'],
        right: ['93', '84', '92'],
        y: '31 × 3 = 93, 42 × 2 = 84, 23 × 4 = 92.',
        n: "Har sonni o'nlik va birlikka yoying, keyin ikkala bo'lakni ko'paytiring.",
        r: 'Har razryad alohida ko\'payadi, natijalar qo\'shiladi.',
      },
      {
        e: 'Три произведения', s: 'Три произведения. Посчитай каждое по разрядам.',
        a: 'Соедини каждое произведение с его результатом.',
        left: ['31 × 3', '42 × 2', '23 × 4'],
        right: ['93', '84', '92'],
        y: '31 × 3 = 93, 42 × 2 = 84, 23 × 4 = 92.',
        n: 'Разложи каждое число на десятки и единицы, потом умножь обе части.',
        r: 'Каждый разряд умножается отдельно, результаты складываются.',
      }),

    /* 4 · choice · 🟡 — ikki baravar. Eski 04, 4-chi variant qo'shildi. */
    q('04', 'Ikki baravar', '🟡', 'd17-double-46', 'choice', '✖️', 2,
      {
        e: 'Yangi o\'nlik', s: '46 ni ikki marta olamiz. Birliklardan yangi o\'nlik hosil bo\'ladi.',
        a: '46 × 2 nechaga teng?',
        o: ['82', '88', '92', '812'],
        y: '40 × 2 + 6 × 2 = 80 + 12 = 92.',
        n: "Birliklar 6 × 2 = 12 beradi — bu bir o'nlik va ikki birlik. Uni qo'shishni unutmang.",
        by: [
          "80 ga faqat 2 qo'shilgan. 6 × 2 nechaga teng edi?",
          '80 ga 8 qo\'shilgan. 6 × 2 ni qayta hisoblang.',
          undefined,
          "80 va 12 yonma-yon yozilgan. Ular yopishtirilmaydi, qo'shiladi.",
        ],
        r: "Birliklardan yangi o'nlik hosil bo'lishi mumkin.",
      },
      {
        e: 'Новый десяток', s: 'Берём 46 дважды. Из единиц получается новый десяток.',
        a: 'Чему равно 46 × 2?',
        o: ['82', '88', '92', '812'],
        y: '40 × 2 + 6 × 2 = 80 + 12 = 92.',
        n: 'Единицы дают 6 × 2 = 12 — это один десяток и две единицы. Не забудь их прибавить.',
        by: [
          'К 80 прибавили только 2. А чему было равно 6 × 2?',
          'К 80 прибавили 8. Пересчитай 6 × 2.',
          undefined,
          '80 и 12 записали рядом. Их не склеивают, а складывают.',
        ],
        r: 'Из единиц может получиться новый десяток.',
      }),

    /* 5 · dnd · 🟡 — yangi o'nlik bormi. */
    q('05', "Yangi o'nlik bormi?", '🟡', 'd17-new-ten', 'dnd', '🔺', [1, 0, 1, 0],
      {
        e: 'Birliklarga qarang', s: "To'rtta ko'paytma. Ba'zilarida birliklardan yangi o'nlik chiqadi.",
        a: 'Har ko\'paytmani birliklardan o\'nlik chiqishiga qarab joylang.',
        tokens: ['31 × 3', '46 × 2', '42 × 2', '23 × 4'],
        zones: ["Yangi o'nlik chiqadi", 'Chiqmaydi'],
        dndHint: "Ko'paytmalar tugadi.",
        y: "46 × 2: 6 × 2 = 12. 23 × 4: 3 × 4 = 12. Ikkalasida ham birliklar o'ndan oshadi.",
        n: 'Faqat birliklarni ko\'paytiring va natijani 10 bilan solishtiring.',
        r: "Birliklar ko'paytmasi 10 ga yetsa, yangi o'nlik hosil bo'ladi.",
      },
      {
        e: 'Смотри на единицы', s: 'Четыре произведения. В некоторых из единиц выходит новый десяток.',
        a: 'Разложи произведения по тому, появляется ли новый десяток.',
        tokens: ['31 × 3', '46 × 2', '42 × 2', '23 × 4'],
        zones: ['Новый десяток есть', 'Нет'],
        dndHint: 'Произведения закончились.',
        y: '46 × 2: 6 × 2 = 12. 23 × 4: 3 × 4 = 12. В обоих единицы переваливают за десяток.',
        n: 'Умножь только единицы и сравни результат с 10.',
        r: 'Если произведение единиц доходит до 10, появляется новый десяток.',
      }),

    /* 6 · input · 🟡 — ustaxona masalasi. Eski 06. */
    q('06', 'Ustaxona masalasi', '🟡', 'd17-bolts', 'input', '🔩', ['90'],
      {
        e: 'Ramkalar', s: '5 ta ramkaning har biriga 18 tadan bolt kerak.',
        a: 'Jami nechta bolt kerak?',
        y: '10 × 5 + 8 × 5 = 50 + 40 = 90 ta bolt.',
        n: "18 ni 10 va 8 ga yoying, har bo'lakni 5 ga ko'paytiring.",
        r: 'Javob: 90 ta bolt.',
        p: 'Javob',
      },
      {
        e: 'Рамки', s: 'На каждую из 5 рамок нужно по 18 болтов.',
        a: 'Сколько болтов нужно всего?',
        y: '10 × 5 + 8 × 5 = 50 + 40 = 90 болтов.',
        n: 'Разложи 18 на 10 и 8, умножь каждую часть на 5.',
        r: 'Ответ: 90 болтов.',
        p: 'Ответ',
      }, 'numeric'),

    /* 7 · multi · 🟡 — teng yozuvlar. Eski 07. */
    q('07', 'Teng yozuvlar', '🟡', 'd17-equal-forms', 'multi', '⚖️', [0, 1, 3],
      {
        e: '27 × 4', s: "27 × 4 qiymati 108 ga teng. To'rtta yozuv berilgan.",
        a: '108 ga teng yozuvlarni belgilang.',
        o: ['20 × 4 + 7 × 4', '108', '27 + 4', '54 × 2'],
        y: "20 × 4 + 7 × 4 = 108, 54 × 2 = 108. 27 + 4 esa qo'shish, u 31.",
        n: "Har yozuvni hisoblang. Ko'paytirish va qo'shishni chalkashtirmang.",
        r: 'Bitta son turli qulay yozuvlarda ifodalanadi.',
      },
      {
        e: '27 × 4', s: 'Значение 27 × 4 равно 108. Даны четыре записи.',
        a: 'Отметь записи, равные 108.',
        o: ['20 × 4 + 7 × 4', '108', '27 + 4', '54 × 2'],
        y: '20 × 4 + 7 × 4 = 108 и 54 × 2 = 108. А 27 + 4 — это сложение, оно равно 31.',
        n: 'Посчитай каждую запись. Не путай умножение со сложением.',
        r: 'Одно число можно записать разными удобными способами.',
      }),

    /* 8 · choice · 🔴 — nol birlik. Eski 08, 4-chi variant qo'shildi. */
    q('08', 'Nol birlik', '🔴', 'd17-zero-ones', 'choice', '🕳️', 1,
      {
        e: 'Yumaloq son', s: '40 sonida birliklar nol.',
        a: '40 × 6 nechaga teng?',
        o: ['24', '240', '2 400', '46'],
        y: "4 o'nlik × 6 = 24 o'nlik = 240. Nol o'z o'rnini saqlaydi.",
        n: "40 ni 4 o'nlik deb o'ylang: 4 × 6 = 24 o'nlik, ya'ni 240.",
        by: [
          "Bu faqat 4 × 6. Lekin 4 — bu o'nliklar, demak natija ham o'nliklarda.",
          undefined,
          "Bu 400 × 6 ga to'g'ri keladi. 40 da nechta nol bor?",
          "Bu qo'shish natijasiga o'xshaydi. Bu yerda ko'paytirish turibdi.",
        ],
        r: "Nol birlik o'rnini saqlaydi: 40 × 6 = 240.",
      },
      {
        e: 'Круглое число', s: 'В числе 40 единиц ноль.',
        a: 'Чему равно 40 × 6?',
        o: ['24', '240', '2 400', '46'],
        y: '4 десятка × 6 = 24 десятка = 240. Ноль сохраняет своё место.',
        n: 'Считай 40 как 4 десятка: 4 × 6 = 24 десятка, то есть 240.',
        by: [
          'Это только 4 × 6. Но 4 — это десятки, значит и результат в десятках.',
          undefined,
          'Это подошло бы для 400 × 6. А сколько нулей в 40?',
          'Это похоже на результат сложения. А здесь умножение.',
        ],
        r: 'Ноль единиц сохраняет место: 40 × 6 = 240.',
      }),

    /* 9 · match · 🔴 — xato va sababi. Eski 09. */
    q('09', 'Xato sababi', '🔴', 'd17-error-cause', 'match', '🔎', [0, 1, 2],
      {
        e: 'Uch xato', s: "Uch bola 34 × 3 ni turlicha xato hisobladi.",
        a: 'Har yechimni uning xato sababiga ulang.',
        left: ['30 × 3 + 4 = 94', '34 + 3 = 37', '30 × 3 = 90'],
        right: ["Birliklarni ko'paytirmagan", "Ko'paytirish o'rniga qo'shgan", 'Birliklarni umuman unutgan'],
        y: "To'g'ri javob: 34 × 3 = 90 + 12 = 102.",
        n: "Har yechimda 4 birlik bilan nima qilinganini toping.",
        r: "Yoyilmaning IKKALA qismi ham ko'paytirilishi kerak.",
      },
      {
        e: 'Три ошибки', s: 'Трое детей по-разному ошиблись, считая 34 × 3.',
        a: 'Соедини каждое решение с причиной ошибки.',
        left: ['30 × 3 + 4 = 94', '34 + 3 = 37', '30 × 3 = 90'],
        right: ['Не умножил единицы', 'Вместо умножения сложил', 'Совсем забыл про единицы'],
        y: 'Верный ответ: 34 × 3 = 90 + 12 = 102.',
        n: 'В каждом решении найди, что сделали с 4 единицами.',
        r: 'Умножить нужно ОБЕ части разложения.',
      }),

    /* 10 · multi · 🔴 — 240 ga teng. Eski 10. */
    q('10', '240 ga teng', '🔴', 'd17-equals-240', 'multi', '🚀', [0, 2, 3],
      {
        e: 'Yakuniy mashq', s: "To'rtta yozuv. Uchtasi 240 beradi.",
        a: '240 ga teng yozuvlarni belgilang.',
        o: ['48 × 5', '48 + 5', '40 × 6', '80 × 3'],
        y: '48 × 5 = 240, 40 × 6 = 240, 80 × 3 = 240. 48 + 5 esa 53.',
        n: "Har ko'paytmani qulay yoying: 48 × 5 = 40 × 5 + 8 × 5.",
        r: 'Bir xil natijaga turli ko\'paytmalar orqali kelish mumkin.',
      },
      {
        e: 'Итоговое задание', s: 'Четыре записи. Три дают 240.',
        a: 'Отметь записи, равные 240.',
        o: ['48 × 5', '48 + 5', '40 × 6', '80 × 3'],
        y: '48 × 5 = 240, 40 × 6 = 240, 80 × 3 = 240. А 48 + 5 = 53.',
        n: 'Разложи каждое произведение удобно: 48 × 5 = 40 × 5 + 8 × 5.',
        r: 'К одному результату можно прийти разными произведениями.',
      }),
  ],
};

export default DARS17_BANK;
