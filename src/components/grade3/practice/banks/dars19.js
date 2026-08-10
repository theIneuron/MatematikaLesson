// Dars 19 amaliyoti — Qoldiqli bo'lish.
// Nazariya: src/components/grade3/Dars19.jsx (num-3-19).
// Bank newBanks.js dan ko'chirildi va §1A kanoniga keltirildi.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 multi · 2 dnd · 3 input · 4 dnd · 5 order · 6 match · 7 choice · 8 input · 9 multi · 10 match
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS19_BANK = {
  title: "Dars 19 · Qoldiqli bo'lish",
  items: [

    /* 1 · multi · 🟢 — mumkin qoldiqlar. Eski 07. */
    q('01', 'Mumkin qoldiqlar', '🟢', 'd19-possible-rest', 'multi', '🎯', [0, 1, 2],
      {
        e: 'Qoldiq qanday bo\'ladi?', s: "Son 4 ga bo'linmoqda. Qoldiq har xil bo'lishi mumkin.",
        a: '4 ga bo\'lishda qanday qoldiqlar bo\'lishi MUMKIN? Hammasini belgilang.',
        o: ['0', '1', '3', '4'],
        y: "0, 1 va 3 — hammasi 4 dan kichik. Qoldiq 4 bo'lolmaydi: undan yana bitta to'liq guruh chiqadi.",
        n: "Qoldiq bo'luvchidan kichik bo'lishi shart. 4 ga teng qoldiq nima degani?",
        r: "Qoldiq doim bo'luvchidan KICHIK bo'ladi.",
      },
      {
        e: 'Каким бывает остаток?', s: 'Число делят на 4. Остаток бывает разным.',
        a: 'Какие остатки ВОЗМОЖНЫ при делении на 4? Отметь все.',
        o: ['0', '1', '3', '4'],
        y: '0, 1 и 3 — все меньше 4. Остаток 4 быть не может: из него получится ещё одна полная группа.',
        n: 'Остаток должен быть меньше делителя. Что значит остаток, равный 4?',
        r: 'Остаток всегда МЕНЬШЕ делителя.',
      }, undefined, {
        en: {
          e: 'What can a remainder be?', s: 'A number is divided by 4. The remainder can be different.',
          a: 'Which remainders are POSSIBLE when dividing by 4? Mark them all.',
          o: ['0', '1', '3', '4'],
          y: '0, 1 and 3 are all less than 4. A remainder of 4 is impossible: it would make one more full group.',
          n: 'The remainder has to be less than the divisor. What does a remainder of 4 mean?',
          r: 'The remainder is always LESS than the divisor.',
        },
      }),

    /* 2 · dnd · 🟢 — qoldiqli yoki qoldiqsiz. */
    q('02', 'Qoldiq bormi?', '🟢', 'd19-has-rest', 'dnd', '🗂️', [1, 0, 1, 0],
      {
        e: 'Tekshirib ko\'ring', s: "To'rtta bo'linma. Ba'zilari qoldiqsiz, ba'zilari qoldiq beradi.",
        a: "Bo'linmalarni ajrating: qaysilari qoldiqsiz, qaysilari qoldiqli.",
        tokens: ['17 : 5', '42 : 7', '23 : 5', '36 : 6'],
        zones: ['Qoldiqsiz', 'Qoldiq bor'],
        dndHint: "Bo'linmalar tugadi.",
        y: '42 : 7 = 6 va 36 : 6 = 6 — qoldiqsiz. 17 : 5 = 3, qoldiq 2; 23 : 5 = 4, qoldiq 3.',
        n: "Har bo'linmada bo'luvchining karralilarini eslang: bo'linuvchi ular orasida bormi?",
        r: "Bo'linuvchi bo'luvchining karralisi bo'lsa, qoldiq nol bo'ladi.",
      },
      {
        e: 'Проверь', s: 'Четыре деления. Одни без остатка, другие дают остаток.',
        a: 'Разложи деления: какие без остатка, а какие с остатком.',
        tokens: ['17 : 5', '42 : 7', '23 : 5', '36 : 6'],
        zones: ['Без остатка', 'Есть остаток'],
        dndHint: 'Деления закончились.',
        y: '42 : 7 = 6 и 36 : 6 = 6 — без остатка. А 17 : 5 = 3, остаток 2; 23 : 5 = 4, остаток 3.',
        n: 'Вспомни кратные делителя: есть ли среди них делимое?',
        r: 'Если делимое кратно делителю, остаток равен нулю.',
      }, undefined, {
        en: {
          e: 'Check them', s: 'Four divisions. Some have no remainder, others do.',
          a: 'Sort the divisions: which ones have no remainder and which ones do.',
          tokens: ['17 : 5', '42 : 7', '23 : 5', '36 : 6'],
          zones: ['No remainder', 'There is a remainder'],
          dndHint: 'No divisions left.',
          y: '42 : 7 = 6 and 36 : 6 = 6 have no remainder. And 17 : 5 = 3 with a remainder of 2; 23 : 5 = 4 with a remainder of 3.',
          n: 'Remember the multiples of the divisor: is the dividend one of them?',
          r: 'If the dividend is a multiple of the divisor, the remainder is zero.',
        },
      }),

    /* 3 · input · 🟢 — qoldiqni toping. Eski 01. */
    q('03', 'Qoldiqni toping', '🟢', 'd19-rest-17-5', 'input', '🔢', ['2'],
      {
        e: 'Guruhlarga ajratamiz', s: '17 ta detal 5 tadan guruhlanadi.',
        a: 'Nechta detal ortib qoladi?',
        y: "5 × 3 = 15, 17 − 15 = 2. Demak 17 : 5 = 3, qoldiq 2.",
        n: "5 ning karralilaridan 17 dan kichik eng kattasini toping, keyin ayiring.",
        r: '17 : 5 = 3, qoldiq 2.',
        p: 'Javob',
      },
      {
        e: 'Раскладываем по группам', s: '17 деталей раскладывают по 5.',
        a: 'Сколько деталей останется лишними?',
        y: '5 × 3 = 15, 17 − 15 = 2. Значит 17 : 5 = 3, остаток 2.',
        n: 'Найди самое большое кратное 5, которое меньше 17, потом вычти.',
        r: '17 : 5 = 3, остаток 2.',
        p: 'Ответ',
      }, 'numeric', {
        en: {
          e: 'Laying them out in groups', s: '17 parts are laid out in groups of 5.',
          a: 'How many parts will be left over?',
          y: '5 × 3 = 15, 17 − 15 = 2. So 17 : 5 = 3 with a remainder of 2.',
          n: 'Find the largest multiple of 5 that is less than 17, then subtract.',
          r: '17 : 5 = 3 with a remainder of 2.',
          p: 'Answer',
        },
      }),

    /* 4 · dnd · 🟡 — qoldiq qaysi rafga. */
    q('04', 'Qoldiq qancha?', '🟡', 'd19-sort-rest', 'dnd', '🔀', [0, 1, 0, 1],
      {
        e: 'Ikki qoldiq', s: "To'rtta bo'linma, atigi ikki xil qoldiq.",
        a: "Bo'linmalarni ajrating: qaysilarining qoldig'i 2, qaysilariniki 3.",
        tokens: ['17 : 5', '23 : 5', '32 : 5', '38 : 5'],
        zones: ['Qoldiq 2', 'Qoldiq 3'],
        dndHint: "Bo'linmalar tugadi.",
        y: '17 : 5 va 32 : 5 — qoldiq 2. 23 : 5 va 38 : 5 — qoldiq 3.',
        n: "Har bo'linuvchidan 5 ning eng yaqin kichik karralisini ayiring.",
        r: "Qoldiq bo'linuvchi bilan karrali orasidagi farq.",
      },
      {
        e: 'Два остатка', s: 'Четыре деления, а остатка всего два.',
        a: 'Разложи деления: у каких остаток 2, а у каких 3.',
        tokens: ['17 : 5', '23 : 5', '32 : 5', '38 : 5'],
        zones: ['Остаток 2', 'Остаток 3'],
        dndHint: 'Деления закончились.',
        y: 'У 17 : 5 и 32 : 5 остаток 2. У 23 : 5 и 38 : 5 остаток 3.',
        n: 'Вычти из каждого делимого ближайшее меньшее кратное 5.',
        r: 'Остаток — это разница между делимым и кратным.',
      }, undefined, {
        en: {
          e: 'Two remainders', s: 'Four divisions, but only two remainders.',
          a: 'Sort the divisions: which ones have a remainder of 2 and which a remainder of 3.',
          tokens: ['17 : 5', '23 : 5', '32 : 5', '38 : 5'],
          zones: ['Remainder 2', 'Remainder 3'],
          dndHint: 'No divisions left.',
          y: '17 : 5 and 32 : 5 have a remainder of 2. 23 : 5 and 38 : 5 have a remainder of 3.',
          n: 'Subtract the nearest smaller multiple of 5 from every dividend.',
          r: 'The remainder is the difference between the dividend and the multiple.',
        },
      }),

    /* 5 · order · 🟡 — tekshiruv qadamlari. Eski 04. */
    q('05', 'Tekshiruv qadamlari', '🟡', 'd19-check-order', 'order', '🪜', [1, 2, 0],
      {
        e: '31 : 7', s: "31 : 7 ni tekshiramiz, lekin qadamlar aralashib ketgan.",
        a: 'Qadamlarni tartib bilan joylang.',
        o: ['31 − 28 = 3', '7 × 4 = 28', '28 < 31 < 35'],
        y: "Avval ko'paytma, keyin chegarani tekshirish, oxirida farq — u qoldiq bo'ladi.",
        n: "Qoldiqni topish uchun avval nimani bilish kerak?",
        r: '31 : 7 = 4, qoldiq 3.',
      },
      {
        e: '31 : 7', s: 'Проверяем 31 : 7, но шаги перепутались.',
        a: 'Расставь шаги по порядку.',
        o: ['31 − 28 = 3', '7 × 4 = 28', '28 < 31 < 35'],
        y: 'Сначала произведение, потом проверка границ, в конце разность — она и есть остаток.',
        n: 'Что нужно узнать первым, чтобы найти остаток?',
        r: '31 : 7 = 4, остаток 3.',
      }, undefined, {
        en: {
          e: '31 : 7', s: 'We are checking 31 : 7, but the steps got mixed up.',
          a: 'Put the steps in order.',
          o: ['31 − 28 = 3', '7 × 4 = 28', '28 < 31 < 35'],
          y: 'The product first, then the check of the borders, and the difference at the end — that is the remainder.',
          n: 'What do you have to know first in order to find the remainder?',
          r: '31 : 7 = 4 with a remainder of 3.',
        },
      }),

    /* 6 · match · 🟡 — bo'linma va qoldiq. */
    q('06', "Bo'linma va qoldiq", '🟡', 'd19-match-rest', 'match', '🔗', [0, 1, 2],
      {
        e: 'Uch bo\'linma', s: "Uchta bo'linma. Har birida o'z bo'linmasi va qoldig'i bor.",
        a: "Har bo'linmani uning natijasiga ulang.",
        left: ['26 : 6', '35 : 8', '53 : 8'],
        right: ['4, qoldiq 2', '4, qoldiq 3', '6, qoldiq 5'],
        y: '26 : 6 = 4, qoldiq 2. 35 : 8 = 4, qoldiq 3. 53 : 8 = 6, qoldiq 5.',
        n: "Har bo'linuvchidan bo'luvchining eng yaqin kichik karralisini ayiring.",
        r: "Qoldiq doim bo'luvchidan kichik.",
      },
      {
        e: 'Частное и остаток', s: 'Три деления. У каждого своё частное и остаток.',
        a: 'Соедини каждое деление с его результатом.',
        left: ['26 : 6', '35 : 8', '53 : 8'],
        right: ['4, остаток 2', '4, остаток 3', '6, остаток 5'],
        y: '26 : 6 = 4, остаток 2. 35 : 8 = 4, остаток 3. 53 : 8 = 6, остаток 5.',
        n: 'Вычти из каждого делимого ближайшее меньшее кратное делителя.',
        r: 'Остаток всегда меньше делителя.',
      }, undefined, {
        en: {
          e: 'Quotient and remainder', s: 'Three divisions. Each one has its own quotient and remainder.',
          a: 'Connect each division with its result.',
          left: ['26 : 6', '35 : 8', '53 : 8'],
          right: ['4, remainder 2', '4, remainder 3', '6, remainder 5'],
          y: '26 : 6 = 4 remainder 2. 35 : 8 = 4 remainder 3. 53 : 8 = 6 remainder 5.',
          n: 'Subtract the nearest smaller multiple of the divisor from every dividend.',
          r: 'The remainder is always less than the divisor.',
        },
      }),

    /* 7 · choice · 🟡 — to'g'ri yozuv. Eski 03, 4-chi variant qo'shildi. */
    q('07', 'To\'g\'ri yozuv', '🟡', 'd19-right-form', 'choice', '📝', 0,
      {
        e: 'Qaysi yozuv to\'g\'ri?', s: "26 ni 6 ga bo'lamiz. To'rtta yozuv taklif qilindi.",
        a: 'To\'g\'ri yozuvni tanlang.',
        o: ['26 : 6 = 4 (qoldiq 2)', '26 : 6 = 3 (qoldiq 8)', '26 : 6 = 5 (qoldiq 4)', '26 : 6 = 4 (qoldiq 6)'],
        y: '6 × 4 + 2 = 26, va 2 < 6. Yozuv to\'g\'ri.',
        n: "Ikki narsani tekshiring: tenglik bajarilyaptimi va qoldiq bo'luvchidan kichikmi?",
        by: [
          undefined,
          "Qoldiq 8 bo'luvchidan katta. Undan yana bitta to'liq guruh chiqadi.",
          '6 × 5 = 30, bu 26 dan katta. Bo\'linma juda katta olingan.',
          "Qoldiq 6 bo'luvchiga teng. Undan yana bitta guruh tuzish mumkin.",
        ],
        r: "Qoldiq bo'luvchidan kichik bo'lishi SHART.",
      },
      {
        e: 'Какая запись верна?', s: 'Делим 26 на 6. Предложили четыре записи.',
        a: 'Выбери верную запись.',
        o: ['26 : 6 = 4 (остаток 2)', '26 : 6 = 3 (остаток 8)', '26 : 6 = 5 (остаток 4)', '26 : 6 = 4 (остаток 6)'],
        y: '6 × 4 + 2 = 26, и 2 < 6. Запись верна.',
        n: 'Проверь две вещи: выполняется ли равенство и меньше ли остаток делителя?',
        by: [
          undefined,
          'Остаток 8 больше делителя. Из него получится ещё одна полная группа.',
          '6 × 5 = 30, это больше 26. Частное взяли слишком большим.',
          'Остаток 6 равен делителю. Из него можно составить ещё одну группу.',
        ],
        r: 'Остаток ОБЯЗАН быть меньше делителя.',
      }, undefined, {
        en: {
          e: 'Which record is right?', s: 'We divide 26 by 6. Four records were suggested.',
          a: 'Pick the right record.',
          o: ['26 : 6 = 4 (remainder 2)', '26 : 6 = 3 (remainder 8)', '26 : 6 = 5 (remainder 4)', '26 : 6 = 4 (remainder 6)'],
          y: '6 × 4 + 2 = 26, and 2 < 6. The record is right.',
          n: 'Check two things: does the equality hold, and is the remainder less than the divisor?',
          by: [
            undefined,
            'A remainder of 8 is larger than the divisor. It would make one more full group.',
            '6 × 5 = 30, and that is more than 26. The quotient was taken too large.',
            'A remainder of 6 equals the divisor. One more group can be made out of it.',
          ],
          r: 'The remainder MUST be less than the divisor.',
        },
      }),

    /* 8 · input · 🔴 — bo'linuvchini tiklang. Eski 05. */
    q('08', "Bo'linuvchini tiklang", '🔴', 'd19-restore', 'input', '🔧', ['38'],
      {
        e: 'Teskari yo\'l', s: "Bo'luvchi 6, bo'linma 6, qoldiq 2.",
        a: "Bo'linuvchini toping.",
        y: '6 × 6 + 2 = 38. Tekshiruv: 38 : 6 = 6, qoldiq 2.',
        n: "Avval to'liq guruhlarni hisoblang, keyin qoldiqni qo'shing.",
        r: "Bo'linuvchi = bo'luvchi × bo'linma + qoldiq.",
        p: 'Javob',
      },
      {
        e: 'Обратный путь', s: 'Делитель 6, частное 6, остаток 2.',
        a: 'Найди делимое.',
        y: '6 × 6 + 2 = 38. Проверка: 38 : 6 = 6, остаток 2.',
        n: 'Сначала посчитай полные группы, потом прибавь остаток.',
        r: 'Делимое = делитель × частное + остаток.',
        p: 'Ответ',
      }, 'numeric', {
        en: {
          e: 'The way back', s: 'The divisor is 6, the quotient is 6 and the remainder is 2.',
          a: 'Find the dividend.',
          y: '6 × 6 + 2 = 38. Check: 38 : 6 = 6 with a remainder of 2.',
          n: 'Work out the full groups first, then add the remainder.',
          r: 'Dividend = divisor × quotient + remainder.',
          p: 'Answer',
        },
      }),

    /* 9 · multi · 🔴 — xato yozuvlar. Eski 09. */
    q('09', 'Xato yozuvlar', '🔴', 'd19-wrong-forms', 'multi', '🔎', [1, 2],
      {
        e: 'Xatoni toping', s: "29 : 6 uchun to'rtta yozuv taklif qilindi.",
        a: 'Qaysi yozuvlar XATO? Hammasini belgilang.',
        o: ['29 : 6 = 4 (qoldiq 5)', '29 : 6 = 3 (qoldiq 11)', '29 : 6 = 5 (qoldiq 1)', '6 × 4 + 5 = 29'],
        y: "Qoldiq 11 bo'luvchidan katta. 6 × 5 = 30 esa 29 dan katta, demak bo'linma 5 bo'lolmaydi.",
        n: "Har yozuvda ikki shartni tekshiring: tenglik bajarilyaptimi va qoldiq bo'luvchidan kichikmi?",
        r: "Katta qoldiqdan yana to'liq guruh tuzish mumkin, demak bo'linma noto'g'ri olingan.",
      },
      {
        e: 'Найди ошибки', s: 'Для 29 : 6 предложили четыре записи.',
        a: 'Какие записи НЕВЕРНЫ? Отметь все.',
        o: ['29 : 6 = 4 (остаток 5)', '29 : 6 = 3 (остаток 11)', '29 : 6 = 5 (остаток 1)', '6 × 4 + 5 = 29'],
        y: 'Остаток 11 больше делителя. А 6 × 5 = 30 больше 29, значит частное не может быть 5.',
        n: 'Проверь в каждой записи два условия: выполняется ли равенство и меньше ли остаток делителя?',
        r: 'Из большого остатка можно составить ещё группу, значит частное взяли неверно.',
      }, undefined, {
        en: {
          e: 'Find the mistakes', s: 'Four records were suggested for 29 : 6.',
          a: 'Which records are WRONG? Mark them all.',
          o: ['29 : 6 = 4 (remainder 5)', '29 : 6 = 3 (remainder 11)', '29 : 6 = 5 (remainder 1)', '6 × 4 + 5 = 29'],
          y: 'A remainder of 11 is larger than the divisor. And 6 × 5 = 30 is more than 29, so the quotient cannot be 5.',
          n: 'Check two conditions in every record: does the equality hold, and is the remainder less than the divisor?',
          r: 'A large remainder can make one more group, so the quotient was taken wrongly.',
        },
      }),

    /* 10 · match · 🔴 — masala va javob. Eski 06 va 10. */
    q('10', 'Ustaxona masalalari', '🔴', 'd19-workshop', 'match', '🚀', [0, 1, 2],
      {
        e: 'Yakuniy mashq', s: "Uch masala. Har birida to'liq guruhlar va qoldiq topiladi.",
        a: 'Har masalani uning javobiga ulang.',
        left: ['34 ta murvat, 8 tadan', '53 ta signal, 8 tadan', '42 ta detal, 7 tadan'],
        right: ['4 ta va 2 qoldiq', '6 ta va 5 qoldiq', '6 ta va qoldiq yo\'q'],
        y: '8 × 4 + 2 = 34, 8 × 6 + 5 = 53, 7 × 6 = 42 qoldiqsiz.',
        n: "Har masalada bo'luvchining karralilarini eslang va bo'linuvchidan ayiring.",
        r: "Qoldiq nol ham bo'lishi mumkin — bu son bo'luvchiga karrali degani.",
      },
      {
        e: 'Итоговое задание', s: 'Три задачи. В каждой находят полные группы и остаток.',
        a: 'Соедини каждую задачу с её ответом.',
        left: ['34 болта, по 8', '53 сигнала, по 8', '42 детали, по 7'],
        right: ['4 и остаток 2', '6 и остаток 5', '6 и остатка нет'],
        y: '8 × 4 + 2 = 34, 8 × 6 + 5 = 53, 7 × 6 = 42 без остатка.',
        n: 'В каждой задаче вспомни кратные делителя и вычти из делимого.',
        r: 'Остаток может быть и нулём — значит число кратно делителю.',
      }, undefined, {
        en: {
          e: 'Final task', s: 'Three problems. In each one we find the full groups and the remainder.',
          a: 'Connect each problem with its answer.',
          left: ['34 bolts, 8 in a group', '53 signals, 8 in a group', '42 parts, 7 in a group'],
          right: ['4 and a remainder of 2', '6 and a remainder of 5', '6 and no remainder'],
          y: '8 × 4 + 2 = 34, 8 × 6 + 5 = 53, 7 × 6 = 42 with nothing left over.',
          n: 'In every problem remember the multiples of the divisor and subtract from the dividend.',
          r: 'A remainder can also be zero — that means the number is a multiple of the divisor.',
        },
      }),
  ],
};

export default DARS19_BANK;
