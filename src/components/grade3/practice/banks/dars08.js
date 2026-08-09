// Dars 8 amaliyoti — Rim raqamlari.
// Manba: 3-sinf darsligi (Burxonov va b., 2019), 87-bet; sanoq sistemalari.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 order · 2 match · 3 input · 4 multi · 5 dnd · 6 input · 7 choice · 8 dnd · 9 choice · 10 order
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS08_BANK = {
  title: 'Dars 8 · Rim raqamlari',
  items: [

    /* 1 · order · 🟢 — belgilar qiymati bo'yicha. Eski D08_01 (rome_symbol). */
    q('01', 'Belgilarni tartiblang', '🟢', 'd08-symbols-order', 'order', '🔤', [2, 0, 1, 3],
      {
        e: 'Rim belgilari', s: "To'rtta belgi berilgan: har birining o'z qiymati bor.",
        a: 'Belgilarni kichigidan kattasiga qarab tartiblang.',
        o: ['V', 'X', 'I', 'L'],
        y: 'I = 1, V = 5, X = 10, L = 50 — shu tartibda o\'sib boradi.',
        n: "Har belgining qiymatini eslang: I bir, V besh, X o'n, L ellik.",
        r: 'Rim belgilari: I = 1, V = 5, X = 10, L = 50, C = 100.',
      },
      {
        e: 'Римские знаки', s: 'Даны четыре знака: у каждого своё значение.',
        a: 'Расставь знаки от меньшего к большему.',
        o: ['V', 'X', 'I', 'L'],
        y: 'I = 1, V = 5, X = 10, L = 50 — в таком порядке они растут.',
        n: 'Вспомни значение каждого знака: I — один, V — пять, X — десять, L — пятьдесят.',
        r: 'Римские знаки: I = 1, V = 5, X = 10, L = 50, C = 100.',
      }, undefined, {
        art: { plates: ['I', 'V', 'X', 'L'] },
        optionArt: [{ plate: 'V' }, { plate: 'X' }, { plate: 'I' }, { plate: 'L' }],
      }),

    /* 2 · match · 🟢 — rim yozuvi va soni. Eski D08_03 (match_rome). */
    q('02', 'Moslashtiring', '🟢', 'd08-match-rome', 'match', '🔗', [0, 1, 2],
      {
        e: 'Rim yozuvi', s: "Uchta yozuvda kichik belgi kattasidan o'ngda turibdi.",
        a: 'Har yozuvni uning soniga ulang.',
        left: ['VI', 'XV', 'XX'],
        right: ['6', '15', '20'],
        y: 'VI = 5 + 1 = 6, XV = 10 + 5 = 15, XX = 10 + 10 = 20.',
        n: "Belgilarni qo'shib chiqing: o'ngdagi belgi kattasiga qo'shiladi.",
        r: "O'ngdagi belgilar qo'shiladi: VI = 6, XV = 15, XX = 20.",
      },
      {
        e: 'Римская запись', s: 'В трёх записях маленький знак стоит справа от большого.',
        a: 'Соедини каждую запись с её числом.',
        left: ['VI', 'XV', 'XX'],
        right: ['6', '15', '20'],
        y: 'VI = 5 + 1 = 6, XV = 10 + 5 = 15, XX = 10 + 10 = 20.',
        n: 'Складывай знаки: знак справа прибавляется к большому.',
        r: 'Знаки справа складываются: VI = 6, XV = 15, XX = 20.',
      }, undefined, {
        art: { plates: ['VI', 'XV', 'XX'] },
        leftArt: [{ plate: 'VI' }, { plate: 'XV' }, { plate: 'XX' }],
      }),

    /* 3 · input · 🟢 — XII. Eski D08_02 (rome_read). */
    q('03', 'Soatdagi son', '🟢', 'd08-read-12', 'input', '🕛', ['12'],
      {
        e: "Rim yozuvini o'qing", s: "Soat siferblatining tepasida XII turadi.",
        a: 'XII qaysi son? Raqamlar bilan yozing.',
        y: 'XII = 10 + 1 + 1 = 12. Soatlardagi o\'n ikki shu.',
        n: "X — o'n, har I — bir. Belgilar o'ngda tursa qo'shiladi.",
        r: "O'ngdagi belgilar qo'shiladi: XII = 10 + 2 = 12.",
        p: 'Javob',
      },
      {
        e: 'Прочитай римскую запись', s: 'Наверху циферблата стоит XII.',
        a: 'Какое это число — XII? Запиши цифрами.',
        y: 'XII = 10 + 1 + 1 = 12. Это и есть двенадцать на часах.',
        n: 'X — десять, каждая I — один. Знаки справа складываются.',
        r: 'Знаки справа складываются: XII = 10 + 2 = 12.',
        p: 'Ответ',
      }, 'numeric', {
        art: { plate: 'XII' },
      }),

    /* 4 · multi · 🟡 — qaysi yozuvlarda ayirish bor. */
    q('04', 'Qayerda ayirish?', '🟡', 'd08-sub-multi', 'multi', '➖', [1, 3],
      {
        e: 'Chapda yoki o\'ngda', s: "To'rtta yozuv. Ba'zilarida kichik belgi kattasidan CHAPDA turibdi.",
        a: 'Qaysi yozuvlarda AYIRISH bajariladi? Hammasini belgilang.',
        o: ['VI', 'IV', 'XI', 'IX'],
        y: 'IV = 5 − 1 = 4 va IX = 10 − 1 = 9: ikkalasida ham I chapda turibdi.',
        n: 'Har yozuvda kichik belgi qaysi tomonda? Chapda bo\'lsa — ayiriladi.',
        r: "Kichik belgi chapda — ayiriladi, o'ngda — qo'shiladi.",
      },
      {
        e: 'Слева или справа', s: 'Четыре записи. В некоторых маленький знак стоит СЛЕВА от большого.',
        a: 'В каких записях выполняется ВЫЧИТАНИЕ? Отметь все.',
        o: ['VI', 'IV', 'XI', 'IX'],
        y: 'IV = 5 − 1 = 4 и IX = 10 − 1 = 9: в обеих I стоит слева.',
        n: 'С какой стороны в каждой записи маленький знак? Если слева — вычитаем.',
        r: 'Маленький знак слева — вычитается, справа — прибавляется.',
      }, undefined, {
        art: { plates: ['VI', 'IV', 'XI', 'IX'] },
        optionArt: [{ plate: 'VI' }, { plate: 'IV' }, { plate: 'XI' }, { plate: 'IX' }],
      }),

    /* 5 · dnd · 🟡 — 23 ni yig'ish. Eski D08_04 (rome_build). */
    q('05', "23 ni yig'ing", '🟡', 'd08-build-23', 'dnd', '🧩', [0, 0, 1, 1, 1],
      {
        e: 'Rimcha yozing', s: "23 = 10 + 10 + 3. Beshta belgi-karta berilgan.",
        a: "Belgilarni ajrating: qaysilari o'nlik, qaysilari birlik beradi.",
        tokens: ['X', 'X', 'I', 'I', 'I'],
        zones: ["O'nliklar", 'Birliklar'],
        dndHint: 'Kartalar tugadi.',
        y: 'XXIII = 10 + 10 + 1 + 1 + 1 = 23. Katta belgi oldinda, kichigi o\'ngda — qo\'shiladi.',
        n: "23 da nechta o'nlik, nechta birlik bor? X — o'nlik, I — birlik.",
        r: "Kichik rim raqami kattasidan O'NGDA yozilsa, qo'shiladi: XXIII = 23.",
      },
      {
        e: 'Запиши по-римски', s: '23 = 10 + 10 + 3. Даны пять карточек-знаков.',
        a: 'Разложи знаки: какие дают десятки, а какие единицы.',
        tokens: ['X', 'X', 'I', 'I', 'I'],
        zones: ['Десятки', 'Единицы'],
        dndHint: 'Карточки закончились.',
        y: 'XXIII = 10 + 10 + 1 + 1 + 1 = 23. Большой знак впереди, маленький справа — складывается.',
        n: 'Сколько в 23 десятков и сколько единиц? X — десяток, I — единица.',
        r: 'Маленький римский знак СПРАВА от большого — прибавляется: XXIII = 23.',
      }, undefined, {
        art: { plate: 'XXIII' },
        tokenArt: [{ plate: 'X' }, { plate: 'X' }, { plate: 'I' }, { plate: 'I' }, { plate: 'I' }],
      }),

    /* 6 · input · 🟡 — XIV. Eski D08_06 (rome_read2). */
    q('06', 'Ikki qismli yozuv', '🟡', 'd08-read-14', 'input', '🔍', ['14'],
      {
        e: "Yozuvni bo'laklang", s: "XIV — bu ikki qism: X va IV.",
        a: 'XIV qaysi son? Raqamlar bilan yozing.',
        y: 'XIV = X + IV = 10 + 4 = 14. IV da I chapda — ayiriladi (5 − 1 = 4).',
        n: "Yozuvni bo'laklang: X va IV. IV da kichik I kattadan chapda — demak ayiriladi.",
        r: 'XIV = X (10) + IV (4) = 14.',
        p: 'Javob',
      },
      {
        e: 'Раздели запись', s: 'XIV — это две части: X и IV.',
        a: 'Какое это число — XIV? Запиши цифрами.',
        y: 'XIV = X + IV = 10 + 4 = 14. В IV знак I слева — вычитается (5 − 1 = 4).',
        n: 'Раздели запись: X и IV. В IV маленькая I слева от большого — значит вычитаем.',
        r: 'XIV = X (10) + IV (4) = 14.',
        p: 'Ответ',
      }, 'numeric', {
        art: { plate: 'XIV' },
      }),

    /* 7 · choice · 🟡 — XATONI TOPING. Eski D08_07, 4-chi variant qo'shildi. */
    q('07', 'Xatoni toping', '🟡', 'd08-find-error', 'choice', '🔎', 1,
      {
        e: 'Xatoni toping', s: "To'rtta yozuv. Bittasida chapda-ayirish qoidasi unutilgan.",
        a: 'Qaysi yozuv XATO?',
        o: ['VII = 7', 'IX = 11', 'XX = 20', 'XIV = 14'],
        y: 'IX = 9: I chapda turibdi, demak ayiriladi (10 − 1). 11 esa XI deb yoziladi.',
        n: "Har yozuvda kichik belgi qaysi tomonda? Chapda bo'lsa, ayirilishi kerak.",
        by: [
          "Bu yerda I lar X dan o'ngda turibdi, demak qo'shiladi: 5 + 1 + 1. Tekshirib ko'ring.",
          undefined,
          "Bu yerda ikki bir xil belgi qo'shilyapti: 10 + 10. Tekshirib ko'ring.",
          "Bu yerda ikki qism bor: X va IV. Ularni alohida hisoblang.",
        ],
        r: "IX = 9 (chapda — ayiriladi), XI = 11 (o'ngda — qo'shiladi).",
      },
      {
        e: 'Найди ошибку', s: 'Четыре записи. В одной забыли правило «слева — вычитаем».',
        a: 'Какая запись НЕВЕРНА?',
        o: ['VII = 7', 'IX = 11', 'XX = 20', 'XIV = 14'],
        y: 'IX = 9: I стоит слева, значит вычитается (10 − 1). А 11 записывается как XI.',
        n: 'С какой стороны в каждой записи маленький знак? Если слева, он должен вычитаться.',
        by: [
          'Здесь единицы стоят справа от X, значит складываются: 5 + 1 + 1. Проверь.',
          undefined,
          'Здесь складываются два одинаковых знака: 10 + 10. Проверь.',
          'Здесь две части: X и IV. Посчитай их отдельно.',
        ],
        r: 'IX = 9 (слева — вычитается), XI = 11 (справа — прибавляется).',
      }, undefined, {
        art: { plates: ['VII', 'IX', 'XX', 'XIV'] },
      }),

    /* 8 · dnd · 🔴 — qo'shish yoki ayirish. */
    q('08', "Qo'shish yoki ayirish?", '🔴', 'd08-sort-rule', 'dnd', '🗂️', [0, 1, 0, 1],
      {
        e: 'Qoidaga ajrating', s: "To'rtta yozuv. Har birida kichik belgi o'z tomonida turibdi.",
        a: "Yozuvlarni ajrating: qaysilarida kichik belgi qo'shiladi, qaysilarida ayiriladi.",
        tokens: ['XV', 'IX', 'VII', 'XL'],
        zones: ["Qo'shiladi", 'Ayiriladi'],
        dndHint: 'Yozuvlar tugadi.',
        y: "XV = 15 va VII = 7 — kichik belgi o'ngda, qo'shiladi. IX = 9 va XL = 40 — kichik belgi chapda, ayiriladi.",
        n: 'Har yozuvda kichik belgini toping va uning tomonini aniqlang.',
        r: "Kichik belgi chapda — ayiriladi (IX = 9, XL = 40), o'ngda — qo'shiladi (XV = 15).",
      },
      {
        e: 'Разбери по правилу', s: 'Четыре записи. В каждой маленький знак стоит со своей стороны.',
        a: 'Разложи записи: где маленький знак прибавляется, а где вычитается.',
        tokens: ['XV', 'IX', 'VII', 'XL'],
        zones: ['Прибавляется', 'Вычитается'],
        dndHint: 'Записи закончились.',
        y: 'XV = 15 и VII = 7 — маленький знак справа, прибавляется. IX = 9 и XL = 40 — слева, вычитается.',
        n: 'Найди в каждой записи маленький знак и определи, с какой он стороны.',
        r: 'Маленький знак слева — вычитается (IX = 9, XL = 40), справа — прибавляется (XV = 15).',
      }, undefined, {
        art: { plates: ['XV', 'IX', 'VII', 'XL'] },
        tokenArt: [{ plate: 'XV' }, { plate: 'IX' }, { plate: 'VII' }, { plate: 'XL' }],
      }),

    /* 9 · choice · 🔴 — sentabr. Eski D08_09 (rome_month), 4-chi variant qo'shildi. */
    q('09', 'Sentabr oyi', '🔴', 'd08-month', 'choice', '📅', 0,
      {
        e: 'Oylar rimcha', s: "Eski kalendarlarda oylar rim raqamlarida yozilgan. Sentabr — 9-oy.",
        a: 'Sentabr rim raqamida qanday yoziladi?',
        o: ['IX', 'XI', 'VIIII', 'IXX'],
        y: '9-oy — IX (10 − 1). VIIII deb yozib bo\'lmaydi: bir belgi 3 martadan ko\'p takrorlanmaydi.',
        n: "9 ni rimchada yozish uchun chapda-ayirish qoidasi kerak.",
        by: [
          undefined,
          "Bu yozuvda I o'ngda turibdi, demak qo'shiladi va 11 chiqadi. Sentabr nechanchi oy?",
          "Bir xil belgi ketma-ket 3 martadan ko'p yozilmaydi. Qisqaroq yozuv bormi?",
          "Bunday yozuv yo'q: ayirish faqat bitta kichik belgi bilan yoziladi.",
        ],
        r: "9 = IX. Bir xil belgi ketma-ket 3 martadan ko'p yozilmaydi.",
      },
      {
        e: 'Месяцы по-римски', s: 'В старых календарях месяцы писали римскими цифрами. Сентябрь — 9-й месяц.',
        a: 'Как записывается сентябрь римской цифрой?',
        o: ['IX', 'XI', 'VIIII', 'IXX'],
        y: '9-й месяц — IX (10 − 1). VIIII писать нельзя: один знак не повторяется больше трёх раз.',
        n: 'Чтобы записать 9 по-римски, нужно правило «слева — вычитаем».',
        by: [
          undefined,
          'Здесь I стоит справа, значит прибавляется и выходит 11. А сентябрь какой по счёту месяц?',
          'Один и тот же знак не пишут подряд больше трёх раз. Есть ли запись короче?',
          'Такой записи нет: вычитание пишется только одним маленьким знаком.',
        ],
        r: '9 = IX. Один и тот же знак не пишут подряд больше трёх раз.',
      }, undefined, {
        art: { plate: 'IX' },
      }),

    /* 10 · order · 🔴 — rim yozuvlarini tartiblash. Eski D08_10 (rome_compare). */
    q('10', 'Rimcha tartib', '🔴', 'd08-order-rome', 'order', '🚀', [2, 0, 3, 1],
      {
        e: 'Yakuniy mashq', s: "To'rtta rim yozuvi. Ularni taqqoslash uchun avval oddiy songa aylantiring.",
        a: 'Yozuvlarni kichigidan kattasiga qarab tartiblang.',
        o: ['XVI', 'XXIV', 'IX', 'XIX'],
        y: 'IX = 9, XVI = 16, XIX = 19, XXIV = 24 — shu tartibda o\'sadi.',
        n: 'Har yozuvni bo\'laklab o\'qing, keyin oddiy sonlarni solishtiring.',
        r: 'Rim yozuvlarini taqqoslash uchun avval ularni oddiy songa aylantiramiz.',
      },
      {
        e: 'Итоговое задание', s: 'Четыре римские записи. Чтобы сравнить, сначала переведи их в обычные числа.',
        a: 'Расставь записи от меньшей к большей.',
        o: ['XVI', 'XXIV', 'IX', 'XIX'],
        y: 'IX = 9, XVI = 16, XIX = 19, XXIV = 24 — в таком порядке они растут.',
        n: 'Раздели каждую запись на части, потом сравни обычные числа.',
        r: 'Чтобы сравнить римские записи, сначала переводим их в обычные числа.',
      }, undefined, {
        optionArt: [{ plate: 'XVI' }, { plate: 'XXIV' }, { plate: 'IX' }, { plate: 'XIX' }],
      }),
  ],
};

export default DARS08_BANK;
