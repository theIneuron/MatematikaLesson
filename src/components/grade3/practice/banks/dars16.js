// Dars 16 amaliyoti — Bo'luvchilar va karrali sonlar.
// Nazariya: src/components/grade3/Dars16.jsx (num-3-16). Darslik 58-60-bet.
// Bank newBanks.js dan ko'chirildi va §1A kanoniga keltirildi.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 choice · 2 input · 3 multi · 4 order · 5 multi · 6 choice · 7 order · 8 dnd · 9 input · 10 match
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS16_BANK = {
  title: "Dars 16 · Bo'luvchilar va karrali sonlar",
  items: [

    /* 1 · choice · 🟢 — bo'luvchi. Eski 01, 4-chi variant qo'shildi. */
    q('01', "Bo'luvchini tanlang", '🟢', 'd16-divisor-18', 'choice', '🔍', 1,
      {
        e: "Bo'luvchi nima?", s: "Bo'luvchi sonni qoldiqsiz bo'ladi.",
        a: "Bu sonlardan qaysi biri 18 ning bo'luvchisi?",
        o: ['4', '6', '7', '8'],
        y: '18 : 6 = 3, qoldiq yo\'q. Demak 6 — 18 ning bo\'luvchisi.',
        n: "Har sonni 18 ga sinab ko'ring: qoldiq qolmasligi kerak.",
        by: [
          '18 : 4 = 4, qoldiq 2. Qoldiq bor, demak bo\'luvchi emas.',
          undefined,
          '18 : 7 = 2, qoldiq 4. Qoldiq bor.',
          '18 : 8 = 2, qoldiq 2. Qoldiq bor.',
        ],
        r: "Bo'luvchi sonni QOLDIQSIZ bo'ladi.",
      },
      {
        e: 'Что такое делитель?', s: 'Делитель делит число без остатка.',
        a: 'Какое из этих чисел — делитель 18?',
        o: ['4', '6', '7', '8'],
        y: '18 : 6 = 3, остатка нет. Значит 6 — делитель 18.',
        n: 'Попробуй разделить 18 на каждое число: остатка быть не должно.',
        by: [
          '18 : 4 = 4, остаток 2. Остаток есть, значит не делитель.',
          undefined,
          '18 : 7 = 2, остаток 4. Остаток есть.',
          '18 : 8 = 2, остаток 2. Остаток есть.',
        ],
        r: 'Делитель делит число БЕЗ ОСТАТКА.',
      }),

    /* 2 · input · 🟢 — keyingi karrali. Eski 03. */
    q('02', 'Keyingi karrali', '🟢', 'd16-next-multiple', 'input', '➡️', ['42'],
      {
        e: 'Karralilar qatori', s: "7 ning karralilari: 7, 14, 21, 28, 35, ...",
        a: 'Qatordagi keyingi sonni yozing.',
        y: '35 + 7 = 42. Karralilar qatori har safar 7 ga o\'sadi.',
        n: "Har keyingi karrali oldingisidan 7 ga katta.",
        r: 'Karralilar qatori cheksiz davom etadi.',
        p: 'Javob',
      },
      {
        e: 'Ряд кратных', s: 'Кратные 7: 7, 14, 21, 28, 35, ...',
        a: 'Запиши следующее число ряда.',
        y: '35 + 7 = 42. Ряд кратных каждый раз растёт на 7.',
        n: 'Каждое следующее кратное больше предыдущего на 7.',
        r: 'Ряд кратных продолжается бесконечно.',
        p: 'Ответ',
      }, 'numeric', {
        art: { line: { from: 7, to: 42, values: [14, 21, 28, 35] } },
      }),

    /* 3 · multi · 🟢 — 12 ning bo'luvchilari. Eski 02. */
    q('03', "12 ning bo'luvchilari", '🟢', 'd16-divisors-12', 'multi', '✅', [0, 1, 2, 3, 5, 6],
      {
        e: 'Hammasini toping', s: "12 ni qoldiqsiz bo'ladigan sonlarni izlaymiz.",
        a: "Qaysi sonlar 12 ning bo'luvchisi? Hammasini belgilang.",
        o: ['1', '2', '3', '4', '5', '6', '12'],
        y: "1, 2, 3, 4, 6 va 12 — hammasi 12 ni qoldiqsiz bo'ladi. 5 esa qoldiq beradi.",
        n: "Har sonni sinab ko'ring: 12 uni qoldiqsiz bo'ladimi? Bo'luvchilar juft bo'lib topiladi: 1 va 12, 2 va 6, 3 va 4.",
        r: '1 va sonning o\'zi doim bo\'luvchi bo\'ladi.',
      },
      {
        e: 'Найди все', s: 'Ищем числа, на которые 12 делится без остатка.',
        a: 'Какие числа — делители 12? Отметь все.',
        o: ['1', '2', '3', '4', '5', '6', '12'],
        y: '1, 2, 3, 4, 6 и 12 — все делят 12 нацело. А 5 даёт остаток.',
        n: 'Проверь каждое: делится ли 12 на него без остатка? Делители находят парами: 1 и 12, 2 и 6, 3 и 4.',
        r: '1 и само число всегда делители.',
      }),

    /* 4 · order · 🟡 — karralilar tartibi. Eski 04. */
    q('04', 'Karralilar tartibi', '🟡', 'd16-multiples-order', 'order', '🪜', [1, 3, 0, 2],
      {
        e: '6 ning karralilari', s: "6 ning dastlabki to'rtta karralisi berilgan, lekin ular aralashib ketgan.",
        a: 'Sonlarni kichigidan kattasiga tartiblang.',
        o: ['18', '6', '24', '12'],
        y: '6, 12, 18, 24: har safar 6 ga o\'sadi.',
        n: "Eng kichik karrali — sonning o'zi. Keyin har safar 6 qo'shiladi.",
        r: "n-karrali son 6 × n ko'rinishida bo'ladi.",
      },
      {
        e: 'Кратные 6', s: 'Даны первые четыре кратных 6, но они перемешались.',
        a: 'Расставь числа от меньшего к большему.',
        o: ['18', '6', '24', '12'],
        y: '6, 12, 18, 24: каждый раз прибавляется 6.',
        n: 'Самое маленькое кратное — само число. Дальше каждый раз прибавляется 6.',
        r: 'n-е кратное имеет вид 6 × n.',
      }, undefined, {
        art: { line: { from: 6, to: 24, values: [12, 18] } },
        optionArt: [{ plate: '18' }, { plate: '6' }, { plate: '24' }, { plate: '12' }],
      }),

    /* 5 · multi · 🟡 — teng qatorlar. Eski 06. */
    q('05', 'Teng qatorlar', '🟡', 'd16-rows-30', 'multi', '🎯', [0, 1, 3],
      {
        e: '30 ta kristall', s: "30 ta kristallni teng qatorlarga qoldiqsiz joylash kerak.",
        a: 'Nechta qator chiqishi mumkin? Mos sonlarning hammasini belgilang.',
        o: ['3', '5', '7', '6'],
        y: "30 soni 3, 5 va 6 ga qoldiqsiz bo'linadi. 7 ga esa bo'linmaydi: 30 : 7 = 4, qoldiq 2.",
        n: "Qatorlar soni 30 ning bo'luvchisi bo'lishi kerak: qoldiq qolmasin.",
        r: "Teng qatorlarga joylash uchun qatorlar soni bo'luvchi bo'lishi shart.",
      },
      {
        e: '30 кристаллов', s: '30 кристаллов нужно разложить на равные ряды без остатка.',
        a: 'Сколько рядов может получиться? Отметь все подходящие числа.',
        o: ['3', '5', '7', '6'],
        y: '30 делится нацело на 3, 5 и 6. А на 7 не делится: 30 : 7 = 4, остаток 2.',
        n: 'Число рядов должно быть делителем 30: остатка быть не должно.',
        r: 'Чтобы разложить на равные ряды, число рядов должно быть делителем.',
      }),

    /* 6 · choice · 🟡 — nega karrali. Eski 05, 4-chi variant qo'shildi. */
    q('06', 'Nega karrali?', '🟡', 'd16-why-multiple', 'choice', '❓', 2,
      {
        e: 'Sababni toping', s: '24 soni 8 ning karralisi ekanini tekshiramiz.',
        a: "Nega 24 soni 8 ning karralisi?",
        o: ["24 katta bo'lgani uchun", "24 juft bo'lgani uchun", '8 × 3 = 24 bo\'lgani uchun', "24 va 8 ikkalasi ham juft bo'lgani uchun"],
        y: "24 — 8 ning butun marta olingan ko'paytmasi: 8 × 3 = 24.",
        n: "Karrali son boshqa sonning butun marta olingan ko'paytmasi bo'ladi.",
        by: [
          "Kattalik hech narsani hal qilmaydi: 25 ham katta, lekin 8 ning karralisi emas.",
          "Juftlik ham yetarli emas: 26 juft, lekin 8 ning karralisi emas.",
          undefined,
          "Ikkalasining juftligi ham yetarli emas: 26 va 8 juft, lekin 26 karrali emas.",
        ],
        r: 'a × n = b bo\'lsa, b — a ning karralisi.',
      },
      {
        e: 'Найди причину', s: 'Проверяем, почему 24 кратно 8.',
        a: 'Почему 24 кратно 8?',
        o: ['Потому что 24 большое', 'Потому что 24 чётное', 'Потому что 8 × 3 = 24', 'Потому что 24 и 8 оба чётные'],
        y: '24 — это 8, взятое целое число раз: 8 × 3 = 24.',
        n: 'Кратное — это произведение другого числа, взятого целое число раз.',
        by: [
          'Величина ничего не решает: 25 тоже большое, но не кратно 8.',
          'Чётности мало: 26 чётное, но не кратно 8.',
          undefined,
          'Того, что оба чётные, тоже мало: 26 и 8 чётные, но 26 не кратно.',
        ],
        r: 'Если a × n = b, то b кратно a.',
      }),

    /* 7 · order · 🟡 — umumiy karralilar. Eski 07. */
    q('07', 'Umumiy karralilar', '🟡', 'd16-common-multiples', 'order', '🤝', [1, 0, 3, 2],
      {
        e: '3 va 4 uchun', s: "3 va 4 ning umumiy karralilari ikkala qatorga ham kiradi.",
        a: 'Sonlarni kichigidan kattasiga tartiblang.',
        o: ['24', '12', '48', '36'],
        y: '12, 24, 36, 48 — hammasi 3 ga ham, 4 ga ham qoldiqsiz bo\'linadi.',
        n: "Har sonni 3 ga va 4 ga bo'lib ko'ring, keyin ularni tartiblang.",
        r: 'Umumiy karrali ikkala sonning ham karralisi bo\'ladi.',
      },
      {
        e: 'Для 3 и 4', s: 'Общие кратные 3 и 4 входят в оба ряда.',
        a: 'Расставь числа от меньшего к большему.',
        o: ['24', '12', '48', '36'],
        y: '12, 24, 36, 48 — все делятся нацело и на 3, и на 4.',
        n: 'Раздели каждое число на 3 и на 4, потом расставь их по порядку.',
        r: 'Общее кратное является кратным обоим числам.',
      }),

    /* 8 · dnd · 🔴 — bo'luvchi yoki karrali. */
    q('08', "Bo'luvchimi yoki karralimi?", '🔴', 'd16-sort-roles', 'dnd', '🗂️', [0, 1, 0, 1],
      {
        e: '12 soni uchun', s: "12 sonini olamiz. Ba'zi sonlar uni bo'ladi, ba'zilari undan chiqadi.",
        a: "Sonlarni ajrating: qaysilari 12 ni bo'ladi, qaysilari 12 dan chiqadi.",
        tokens: ['3', '24', '4', '36'],
        zones: ["12 ning bo'luvchisi", '12 ning karralisi'],
        dndHint: 'Sonlar tugadi.',
        y: "3 va 4 — 12 ni qoldiqsiz bo'ladi, demak bo'luvchilar. 24 va 36 — 12 dan chiqadi, demak karralilar.",
        n: "Son 12 dan KICHIK va uni bo'lsa — bo'luvchi. 12 dan KATTA va 12 dan chiqsa — karrali.",
        r: "Bo'luvchi sonni bo'ladi, karrali esa sondan ko'paytirish orqali chiqadi.",
      },
      {
        e: 'Для числа 12', s: 'Берём число 12. Одни числа делят его, другие получаются из него.',
        a: 'Разложи числа: какие делят 12, а какие получаются из 12.',
        tokens: ['3', '24', '4', '36'],
        zones: ['Делитель 12', 'Кратное 12'],
        dndHint: 'Числа закончились.',
        y: '3 и 4 делят 12 нацело, значит делители. А 24 и 36 получаются из 12, значит кратные.',
        n: 'Если число МЕНЬШЕ 12 и делит его — делитель. Если БОЛЬШЕ и получается из 12 — кратное.',
        r: 'Делитель делит число, а кратное получается из числа умножением.',
      }),

    /* 9 · input · 🔴 — eng kichik umumiy karrali. Eski 10. */
    q('09', 'Eng kichik umumiy', '🔴', 'd16-lcm', 'input', '🔢', ['12'],
      {
        e: 'Ikki qator', s: "4 ning karralilari: 4, 8, 12, 16... 6 ning karralilari: 6, 12, 18...",
        a: '4 va 6 ning ENG KICHIK umumiy karralisini yozing.',
        y: 'Birinchi umumiy son — 12: u 4 ga ham, 6 ga ham qoldiqsiz bo\'linadi.',
        n: 'Ikki qatorni yonma-yon yozing va birinchi takrorlangan sonni toping.',
        r: '12 — 4 va 6 ning eng kichik umumiy karralisi.',
        p: 'Javob',
      },
      {
        e: 'Два ряда', s: 'Кратные 4: 4, 8, 12, 16... Кратные 6: 6, 12, 18...',
        a: 'Запиши НАИМЕНЬШЕЕ общее кратное чисел 4 и 6.',
        y: 'Первое общее число — 12: оно делится нацело и на 4, и на 6.',
        n: 'Выпиши оба ряда рядом и найди первое повторившееся число.',
        r: '12 — наименьшее общее кратное 4 и 6.',
        p: 'Ответ',
      }, 'numeric'),

    /* 10 · match · 🔴 — xato va sababi. Eski 08 va 09. */
    q('10', 'Xato sababi', '🔴', 'd16-error-cause', 'match', '🚀', [0, 1, 2],
      {
        e: 'Yakuniy mashq', s: "Uch bola uch xil xato qildi. Har birining o'z sababi bor.",
        a: 'Har fikrni uning izohiga ulang.',
        left: ["3 — 16 ning bo'luvchisi", "1 — 37 ning bo'luvchisi emas", '9 — 12 ning karralisi'],
        right: ['16 : 3 qoldiq beradi', '37 : 1 = 37, qoldiq yo\'q', '12 × n hech qachon 9 bermaydi'],
        y: "Faqat ikkinchi fikr xato deb aytilgani noto'g'ri: 1 har bir sonning bo'luvchisi.",
        n: "Har fikrni bo'lib tekshiring: qoldiq bor-yo'qligiga qarang.",
        r: "1 va sonning o'zi doim bo'luvchi; karrali son sondan katta yoki teng bo'ladi.",
      },
      {
        e: 'Итоговое задание', s: 'Трое детей ошиблись по-разному. У каждой ошибки своя причина.',
        a: 'Соедини каждое высказывание с его объяснением.',
        left: ['3 — делитель 16', '1 — не делитель 37', '9 — кратное 12'],
        right: ['16 : 3 даёт остаток', '37 : 1 = 37, остатка нет', '12 × n никогда не даст 9'],
        y: 'Второе утверждение неверно: 1 является делителем любого числа.',
        n: 'Проверь каждое утверждение делением: есть ли остаток?',
        r: '1 и само число всегда делители; кратное больше или равно самому числу.',
      }),
  ],
};

export default DARS16_BANK;
