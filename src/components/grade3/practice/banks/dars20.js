// Dars 20 amaliyoti — Qoldiqli bo'lishni tekshirish.
// Nazariya: src/components/grade3/Dars20.jsx (num-3-20).
// Darsdagi misol: 31 : 7 = 4, qoldiq 3, tekshiruv 4 · 7 + 3 = 31 — amaliyotda BOSHQA sonlar.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 order · 2 input · 3 order · 4 multi · 5 match · 6 choice · 7 input · 8 multi · 9 dnd · 10 choice
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS20_BANK = {
  title: "Dars 20 · Qoldiqli bo'lishni tekshirish",
  items: [

    /* 1 · order · 🟢 — tekshiruv qadamlari. */
    q('01', 'Tekshiruv qadamlari', '🟢', 'd20-check-order', 'order', '🪜', [1, 2, 0],
      {
        e: 'Uch qadam', s: "43 : 8 = 5, qoldiq 3. Javobni tekshiramiz, lekin qadamlar aralashgan.",
        a: 'Tekshiruv qadamlarini tartib bilan tanlang.',
        o: ['40 + 3 = 43', "Bo'linmani bo'luvchiga ko'paytiraman: 5 × 8", 'Qoldiqni qo\'shaman'],
        y: "Avval 5 × 8 = 40, keyin qoldiq 3 ni qo'shamiz, natijada 43 — bo'linuvchi qaytdi.",
        n: "Tekshiruvda avval nima hisoblanadi? Qoldiq qachon qo'shiladi?",
        r: "Bo'linuvchi = bo'luvchi × bo'linma + qoldiq.",
      },
      {
        e: 'Три шага', s: '43 : 8 = 5, остаток 3. Проверяем ответ, но шаги перепутались.',
        a: 'Выбери шаги проверки по порядку.',
        o: ['40 + 3 = 43', 'Умножаю частное на делитель: 5 × 8', 'Прибавляю остаток'],
        y: 'Сначала 5 × 8 = 40, потом прибавляем остаток 3, получается 43 — делимое вернулось.',
        n: 'Что считают первым при проверке? Когда прибавляют остаток?',
        r: 'Делимое = делитель × частное + остаток.',
      }),

    /* 2 · input · 🟢 — tekshiruvni bajaring. */
    q('02', 'Tekshiruvni bajaring', '🟢', 'd20-check-43', 'input', '✅', ['43'],
      {
        e: 'Bo\'linuvchi qaytadimi?', s: "43 : 8 = 5, qoldiq 3 deb yozilgan.",
        a: '5 × 8 + 3 nechaga teng?',
        y: '5 × 8 = 40, 40 + 3 = 43. Bo\'linuvchi qaytdi, demak javob to\'g\'ri.',
        n: "Avval ko'paytiring, keyin qoldiqni qo'shing.",
        r: "Tekshiruv mos kelsa, bo'lish to'g'ri bajarilgan.",
        p: 'Javob',
      },
      {
        e: 'Вернётся ли делимое?', s: 'Записано 43 : 8 = 5, остаток 3.',
        a: 'Чему равно 5 × 8 + 3?',
        y: '5 × 8 = 40, 40 + 3 = 43. Делимое вернулось, значит ответ верный.',
        n: 'Сначала умножь, потом прибавь остаток.',
        r: 'Если проверка сошлась, деление выполнено верно.',
        p: 'Ответ',
      }, 'numeric'),

    /* 3 · order · 🟢 — natijalarni tartiblash. */
    q('03', 'Qoldiqlar tartibi', '🟢', 'd20-order-rest', 'order', '📈', [2, 0, 3, 1],
      {
        e: 'Qaysi qoldiq kichik?', s: "To'rtta bo'linma. Har birining qoldig'ini toping.",
        a: 'Bo\'linmalarni qoldig\'i bo\'yicha kichigidan kattasiga tartiblang.',
        o: ['43 : 8', '38 : 8', '32 : 8', '45 : 8'],
        y: '32 : 8 — qoldiq 0, 43 : 8 — qoldiq 3, 38 : 8 — qoldiq 6, 45 : 8 — qoldiq 5... to\'g\'ri tartib: 0, 3, 5, 6.',
        n: "Har bo'linuvchidan 8 ning eng yaqin kichik karralisini ayiring.",
        r: "Qoldiq bo'luvchidan kichik bo'ladi, nol ham bo'lishi mumkin.",
      },
      {
        e: 'Где остаток меньше?', s: 'Четыре деления. Найди остаток каждого.',
        a: 'Расставь деления по остатку от меньшего к большему.',
        o: ['43 : 8', '38 : 8', '32 : 8', '45 : 8'],
        y: '32 : 8 — остаток 0, 43 : 8 — остаток 3, 45 : 8 — остаток 5, 38 : 8 — остаток 6.',
        n: 'Вычти из каждого делимого ближайшее меньшее кратное 8.',
        r: 'Остаток меньше делителя, а может быть и нулём.',
      }, undefined, {
        orderBy: "qoldiq bo'yicha, bo'linma qiymati bo'yicha emas",
      }),

    /* 4 · multi · 🟡 — qaysi tekshiruvlar mos keladi. */
    q('04', 'Mos tekshiruvlar', '🟡', 'd20-valid-checks', 'multi', '🎯', [0, 2],
      {
        e: 'Tekshiring', s: "To'rtta yozuv va ularning tekshiruvi. Ikkitasi mos keladi.",
        a: 'Qaysi tekshiruvlar MOS keladi? Hammasini belgilang.',
        o: ['43 : 8 = 5 (qold. 3), 5 × 8 + 3 = 43', '29 : 6 = 4 (qold. 6), 4 × 6 + 6 = 30', '38 : 8 = 4 (qold. 6), 4 × 8 + 6 = 38', '31 : 7 = 5 (qold. 3), 5 × 7 + 3 = 38'],
        y: "Birinchi va uchinchida bo'linuvchi qaytdi. Ikkinchida qoldiq bo'luvchiga teng, to'rtinchida natija 31 emas.",
        n: "Har tekshiruvni hisoblang: bo'linuvchi qaytdimi? Va qoldiq bo'luvchidan kichikmi?",
        r: "Tekshiruv ikki shartni birga talab qiladi: son qaytishi va qoldiq bo'luvchidan kichik bo'lishi.",
      },
      {
        e: 'Проверь', s: 'Четыре записи и их проверки. Две сходятся.',
        a: 'Какие проверки СОШЛИСЬ? Отметь все.',
        o: ['43 : 8 = 5 (ост. 3), 5 × 8 + 3 = 43', '29 : 6 = 4 (ост. 6), 4 × 6 + 6 = 30', '38 : 8 = 4 (ост. 6), 4 × 8 + 6 = 38', '31 : 7 = 5 (ост. 3), 5 × 7 + 3 = 38'],
        y: 'В первой и третьей делимое вернулось. Во второй остаток равен делителю, в четвёртой получилось не 31.',
        n: 'Посчитай каждую проверку: вернулось ли делимое? И меньше ли остаток делителя?',
        r: 'Проверка требует сразу двух условий: число вернулось и остаток меньше делителя.',
      }),

    /* 5 · match · 🟡 — bo'linma va tekshiruvi. */
    q('05', 'Tekshiruvni tanlang', '🟡', 'd20-match-check', 'match', '🔗', [0, 1, 2],
      {
        e: 'Har biriga o\'z tekshiruvi', s: "Uchta bo'linma. Har biriga mos tekshiruv yozuvi bor.",
        a: "Har bo'linmani uni tekshiradigan yozuvga ulang.",
        left: ['43 : 8 = 5, qold. 3', '38 : 8 = 4, qold. 6', '31 : 7 = 4, qold. 3'],
        right: ['5 × 8 + 3', '4 × 8 + 6', '4 × 7 + 3'],
        y: "Tekshiruvda bo'linma bo'luvchiga ko'paytiriladi va qoldiq qo'shiladi.",
        n: "Har yozuvda bo'linma va bo'luvchi qaysi son ekanini aniqlang.",
        r: "Bo'linuvchi = bo'luvchi × bo'linma + qoldiq.",
      },
      {
        e: 'Каждому своя проверка', s: 'Три деления. У каждого своя запись проверки.',
        a: 'Соедини каждое деление с проверяющей его записью.',
        left: ['43 : 8 = 5, ост. 3', '38 : 8 = 4, ост. 6', '31 : 7 = 4, ост. 3'],
        right: ['5 × 8 + 3', '4 × 8 + 6', '4 × 7 + 3'],
        y: 'При проверке частное умножают на делитель и прибавляют остаток.',
        n: 'В каждой записи определи, где частное, а где делитель.',
        r: 'Делимое = делитель × частное + остаток.',
      }),

    /* 6 · choice · 🟡 — tekshiruv mos, lekin javob xato. */
    q('06', 'Tekshiruv aldadimi?', '🟡', 'd20-check-trap', 'choice', '🪤', 1,
      {
        e: 'Diqqat, tuzoq', s: "Zuhra: «29 : 6 = 3, qoldiq 11». Tekshirdi: 3 × 6 + 11 = 29.",
        a: 'Tekshiruv mos keldi. Javob to\'g\'rimi?',
        o: ['To\'g\'ri, tekshiruv mos keldi', "Xato: qoldiq bo'luvchidan katta", 'Xato: 29 ni 6 ga bo\'lib bo\'lmaydi', 'Xato: tekshiruvda ko\'paytirish emas, bo\'lish kerak'],
        y: "Qoldiq 11 bo'luvchi 6 dan katta. Undan yana bitta to'liq guruh chiqadi: to'g'ri javob 4, qoldiq 5.",
        n: "Tekshiruv mos kelishi yetarli emas: qoldiq bo'luvchidan kichik bo'lishi ham shart.",
        by: [
          "Tekshiruv haqiqatan mos keldi, lekin bu yetarli emas. Qoldiqqa qarang.",
          undefined,
          "29 ni 6 ga bo'lish mumkin: 4 ta to'liq guruh va qoldiq chiqadi.",
          "Tekshiruvda aynan ko'paytirish ishlatiladi. Xato boshqa joyda.",
        ],
        r: "Tekshiruv mos kelsa ham, qoldiq bo'luvchidan kichik bo'lishi SHART.",
      },
      {
        e: 'Внимание, ловушка', s: 'Зухра: «29 : 6 = 3, остаток 11». Проверила: 3 × 6 + 11 = 29.',
        a: 'Проверка сошлась. Верный ли ответ?',
        o: ['Верный, проверка сошлась', 'Неверный: остаток больше делителя', 'Неверный: 29 на 6 не делится', 'Неверный: в проверке нужно деление, а не умножение'],
        y: 'Остаток 11 больше делителя 6. Из него выйдет ещё одна полная группа: верный ответ 4, остаток 5.',
        n: 'Сошедшейся проверки мало: остаток обязан быть меньше делителя.',
        by: [
          'Проверка действительно сошлась, но этого мало. Посмотри на остаток.',
          undefined,
          '29 на 6 делится: получится 4 полные группы и остаток.',
          'В проверке используется именно умножение. Ошибка в другом.',
        ],
        r: 'Даже если проверка сошлась, остаток ОБЯЗАН быть меньше делителя.',
      }),

    /* 7 · input · 🟡 — bo'linuvchini tiklang. */
    q('07', "Bo'linuvchini tiklang", '🟡', 'd20-restore', 'input', '🔧', ['59'],
      {
        e: 'Teskari yo\'l', s: "Bo'luvchi 8, bo'linma 7, qoldiq 3.",
        a: "Bo'linuvchini toping.",
        y: '8 × 7 + 3 = 56 + 3 = 59. Tekshiruv: 59 : 8 = 7, qoldiq 3.',
        n: "Avval to'liq guruhlarni hisoblang, keyin qoldiqni qo'shing.",
        r: "Bo'linuvchi = bo'luvchi × bo'linma + qoldiq.",
        p: 'Javob',
      },
      {
        e: 'Обратный путь', s: 'Делитель 8, частное 7, остаток 3.',
        a: 'Найди делимое.',
        y: '8 × 7 + 3 = 56 + 3 = 59. Проверка: 59 : 8 = 7, остаток 3.',
        n: 'Сначала посчитай полные группы, потом прибавь остаток.',
        r: 'Делимое = делитель × частное + остаток.',
        p: 'Ответ',
      }, 'numeric'),

    /* 8 · multi · 🔴 — xato yozuvlar. */
    q('08', 'Xato yozuvlar', '🔴', 'd20-wrong-forms', 'multi', '🔎', [1, 3],
      {
        e: 'Xatoni toping', s: "To'rtta yozuv. Ikkitasi tekshiruvdan o'tmaydi.",
        a: 'Qaysi yozuvlar XATO? Hammasini belgilang.',
        o: ['43 : 8 = 5, qold. 3', '43 : 8 = 4, qold. 11', '59 : 8 = 7, qold. 3', '59 : 8 = 6, qold. 11'],
        y: "Ikkala xatoda ham qoldiq 11 bo'luvchi 8 dan katta: yana bitta guruh tuzish mumkin.",
        n: "Har yozuvda qoldiqni bo'luvchi bilan solishtiring, keyin tekshiruvni bajaring.",
        r: "Katta qoldiq bo'linma noto'g'ri olinganini bildiradi.",
      },
      {
        e: 'Найди ошибки', s: 'Четыре записи. Две не проходят проверку.',
        a: 'Какие записи НЕВЕРНЫ? Отметь все.',
        o: ['43 : 8 = 5, ост. 3', '43 : 8 = 4, ост. 11', '59 : 8 = 7, ост. 3', '59 : 8 = 6, ост. 11'],
        y: 'В обеих ошибках остаток 11 больше делителя 8: можно составить ещё одну группу.',
        n: 'В каждой записи сравни остаток с делителем, потом сделай проверку.',
        r: 'Большой остаток означает, что частное взяли неверно.',
      }),

    /* 9 · dnd · 🔴 — tekshiruvdan o'tdimi. */
    q('09', "Tekshiruvdan o'tdimi?", '🔴', 'd20-sort-checks', 'dnd', '🗂️', [0, 1, 0, 1],
      {
        e: 'Ikki raf', s: "To'rtta yechim. Ba'zilari tekshiruvdan o'tadi, ba'zilari yo'q.",
        a: "Yechimlarni ajrating: qaysilari tekshiruvdan o'tadi, qaysilari yo'q.",
        tokens: ['43 : 8 = 5, qold. 3', '43 : 8 = 6, qold. 1', '59 : 8 = 7, qold. 3', '59 : 8 = 8, qold. 5'],
        zones: ["O'tadi", "O'tmaydi"],
        dndHint: 'Yechimlar tugadi.',
        y: "6 × 8 + 1 = 49, bu 43 emas. 8 × 8 + 5 = 69, bu 59 emas. Qolgan ikkitasi mos keladi.",
        n: "Har yechimda bo'linmani bo'luvchiga ko'paytiring va qoldiqni qo'shing.",
        r: "Tekshiruv bo'linuvchini qaytarsa, yechim to'g'ri.",
      },
      {
        e: 'Две полки', s: 'Четыре решения. Одни проходят проверку, другие нет.',
        a: 'Разложи решения: какие проходят проверку, а какие нет.',
        tokens: ['43 : 8 = 5, ост. 3', '43 : 8 = 6, ост. 1', '59 : 8 = 7, ост. 3', '59 : 8 = 8, ост. 5'],
        zones: ['Проходит', 'Не проходит'],
        dndHint: 'Решения закончились.',
        y: '6 × 8 + 1 = 49, а не 43. 8 × 8 + 5 = 69, а не 59. Остальные два сходятся.',
        n: 'В каждом решении умножь частное на делитель и прибавь остаток.',
        r: 'Если проверка возвращает делимое, решение верное.',
      }),

    /* 10 · choice · 🔴 — masala. */
    q('10', 'Ustaxona masalasi', '🔴', 'd20-workshop', 'choice', '🚀', 2,
      {
        e: 'Yakuniy mashq', s: "59 ta murvat 8 tadan qutilarga joylandi. Usta hisobni tekshirmoqchi.",
        a: 'Qaysi tekshiruv to\'g\'ri bajarilgan?',
        o: ['7 × 8 = 56, demak hammasi joylashdi', '59 : 8 = 8, qoldiq 5', '7 × 8 + 3 = 59, 3 ta murvat ortdi', '59 − 8 = 51 ta murvat qoldi'],
        y: "7 ta to'la quti va 3 ta ortiqcha murvat: 7 × 8 + 3 = 59.",
        n: "Avval nechta to'la quti chiqishini toping, keyin ortiqchasini hisoblang.",
        by: [
          "56 ta joylashdi, lekin murvatlar 59 ta edi. Uchtasi qayerda qoldi?",
          "8 × 8 = 64, bu 59 dan katta. Sakkizta to'la quti chiqmaydi.",
          undefined,
          "Bu bitta qutini olib tashlash. Lekin qutilar bir nechta bo'ladi.",
        ],
        r: "Tekshiruv: bo'luvchi × bo'linma + qoldiq = bo'linuvchi.",
      },
      {
        e: 'Итоговое задание', s: '59 болтов разложили по коробкам по 8. Мастер хочет проверить счёт.',
        a: 'Какая проверка выполнена верно?',
        o: ['7 × 8 = 56, значит всё разложилось', '59 : 8 = 8, остаток 5', '7 × 8 + 3 = 59, 3 болта осталось', '59 − 8 = 51 болт остался'],
        y: '7 полных коробок и 3 лишних болта: 7 × 8 + 3 = 59.',
        n: 'Сначала найди, сколько выйдет полных коробок, потом посчитай лишние.',
        by: [
          'Разложилось 56, а болтов было 59. Где остались ещё три?',
          '8 × 8 = 64, это больше 59. Восьми полных коробок не выйдет.',
          undefined,
          'Это как будто убрали одну коробку. Но коробок несколько.',
        ],
        r: 'Проверка: делитель × частное + остаток = делимое.',
      }),
  ],
};

export default DARS20_BANK;
