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
      }, undefined, {
        en: {
          e: 'What is a divisor?', s: 'A divisor divides a number with nothing left over.',
          a: 'Which of these numbers is a divisor of 18?',
          o: ['4', '6', '7', '8'],
          y: '18 : 6 = 3, with nothing left over. So 6 is a divisor of 18.',
          n: 'Try dividing 18 by each number: there should be no remainder.',
          by: [
            '18 : 4 = 4 with a remainder of 2. There is a remainder, so it is not a divisor.',
            undefined,
            '18 : 7 = 2 with a remainder of 4. There is a remainder.',
            '18 : 8 = 2 with a remainder of 2. There is a remainder.',
          ],
          r: 'A divisor divides a number WITH NOTHING LEFT OVER.',
        },
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
        en: {
          e: 'The row of multiples', s: 'The multiples of 7 are 7, 14, 21, 28, 35 and so on.',
          a: 'Write the next number of the row.',
          y: '35 + 7 = 42. The row of multiples grows by 7 every time.',
          n: 'Every next multiple is 7 more than the one before it.',
          r: 'The row of multiples goes on for ever.',
          p: 'Answer',
        },
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
      }, undefined, {
        en: {
          e: 'Find them all', s: 'We are looking for the numbers that 12 divides by with nothing left over.',
          a: 'Which numbers are divisors of 12? Mark them all.',
          o: ['1', '2', '3', '4', '5', '6', '12'],
          y: '1, 2, 3, 4, 6 and 12 all divide 12 exactly. And 5 leaves a remainder.',
          n: 'Check each one: does 12 divide by it with nothing left over? Divisors come in pairs: 1 and 12, 2 and 6, 3 and 4.',
          r: '1 and the number itself are always divisors.',
        },
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
        en: {
          e: 'Multiples of 6', s: 'Here are the first four multiples of 6, but they got mixed up.',
          a: 'Put the numbers in order from the smallest to the largest.',
          o: ['18', '6', '24', '12'],
          y: '6, 12, 18, 24: 6 is added every time.',
          n: 'The smallest multiple is the number itself. After that 6 is added every time.',
          r: 'The nth multiple has the form 6 × n.',
        },
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
      }, undefined, {
        en: {
          e: '30 crystals', s: '30 crystals have to be laid out in equal rows with none left over.',
          a: 'How many rows can there be? Mark every number that fits.',
          o: ['3', '5', '7', '6'],
          y: '30 divides exactly by 3, 5 and 6. And it does not divide by 7: 30 : 7 = 4 with a remainder of 2.',
          n: 'The number of rows has to be a divisor of 30: there should be no remainder.',
          r: 'To lay something out in equal rows, the number of rows has to be a divisor.',
        },
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
      }, undefined, {
        en: {
          e: 'Find the reason', s: 'We are checking why 24 is a multiple of 8.',
          a: 'Why is 24 a multiple of 8?',
          o: ['Because 24 is big', 'Because 24 is even', 'Because 8 × 3 = 24', 'Because 24 and 8 are both even'],
          y: '24 is 8 taken a whole number of times: 8 × 3 = 24.',
          n: 'A multiple is another number taken a whole number of times.',
          by: [
            'Size decides nothing: 25 is big too, but it is not a multiple of 8.',
            'Being even is not enough: 26 is even, but it is not a multiple of 8.',
            undefined,
            'Both being even is not enough either: 26 and 8 are even, but 26 is not a multiple.',
          ],
          r: 'If a × n = b, then b is a multiple of a.',
        },
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
      }, undefined, {
        en: {
          e: 'For 3 and 4', s: 'The common multiples of 3 and 4 belong to both rows.',
          a: 'Put the numbers in order from the smallest to the largest.',
          o: ['24', '12', '48', '36'],
          y: '12, 24, 36, 48 — all of them divide exactly by 3 and by 4.',
          n: 'Divide every number by 3 and by 4, then put them in order.',
          r: 'A common multiple is a multiple of both numbers.',
        },
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
      }, undefined, {
        en: {
          e: 'For the number 12', s: 'Take the number 12. Some numbers divide it, others come out of it.',
          a: 'Sort the numbers: which ones divide 12 and which ones come out of 12.',
          tokens: ['3', '24', '4', '36'],
          zones: ['A divisor of 12', 'A multiple of 12'],
          dndHint: 'No numbers left.',
          y: '3 and 4 divide 12 exactly, so they are divisors. And 24 and 36 come out of 12, so they are multiples.',
          n: 'If a number is SMALLER than 12 and divides it, it is a divisor. If it is LARGER and comes out of 12, it is a multiple.',
          r: 'A divisor divides the number, and a multiple comes out of the number by multiplying.',
        },
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
      }, 'numeric', {
        en: {
          e: 'Two rows', s: 'Multiples of 4: 4, 8, 12, 16 and so on. Multiples of 6: 6, 12, 18 and so on.',
          a: 'Write the SMALLEST common multiple of 4 and 6.',
          y: 'The first shared number is 12: it divides exactly by 4 and by 6.',
          n: 'Write both rows next to each other and find the first number that appears in both.',
          r: '12 is the smallest common multiple of 4 and 6.',
          p: 'Answer',
        },
      }),

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
      }, undefined, {
        en: {
          e: 'Final task', s: 'Three children made different mistakes. Each mistake has its own reason.',
          a: 'Connect each statement with the explanation that goes with it.',
          left: ['3 is a divisor of 16', '1 is not a divisor of 37', '9 is a multiple of 12'],
          right: ['16 : 3 leaves a remainder', '37 : 1 = 37, nothing left over', '12 × n will never give 9'],
          y: 'The second statement is wrong: 1 is a divisor of every number.',
          n: 'Check every statement by dividing: is there a remainder?',
          r: '1 and the number itself are always divisors; a multiple is larger than the number or equal to it.',
        },
      }),
  ],
};

export default DARS16_BANK;
