// Dars 5 amaliyoti — Eng yaqin yumaloq son.
// Manba: 3-sinf darsligi (Burxonov va b., 2019), 1-bobdagi taqqoslash va yaxlitlash mashqlari.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 order · 2 dnd · 3 match · 4 input · 5 choice · 6 multi · 7 input · 8 match · 9 dnd · 10 multi
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS05_BANK = {
  title: 'Dars 5 · Eng yaqin yumaloq son',
  items: [

    /* 1 · order · 🟢 — qoidaning qadamlari. */
    q('01', 'Qoida qadamlari', '🟢', 'd05-rule-order', 'order', '🪜', [1, 2, 0],
      {
        e: 'Qoidani tuzing', s: 'Yumaloq o\'nlikni topish uch qadamda bajariladi, lekin qadamlar aralashib ketgan.',
        a: 'Qadamlarni to\'g\'ri tartibda tanlang.',
        o: ['Eng yaqin yumaloq o\'nlikni tanlayman', 'Oxirgi raqamga qarayman', 'Uni 5 bilan solishtiraman'],
        y: 'Avval oxirgi raqamga qaraymiz, keyin uni 5 bilan solishtiramiz, so\'ng yumaloq o\'nlikni tanlaymiz.',
        n: 'Qaysi qadamsiz qolganini bajarib bo\'lmaydi? O\'sha birinchi turadi.',
        r: 'Oxirgi raqam 5 dan kichik — pastga, 5 yoki katta — yuqoriga.',
      },
      {
        e: 'Составь правило', s: 'Ближайший круглый десяток находят в три шага, но шаги перепутались.',
        a: 'Выбери шаги в правильном порядке.',
        o: ['Выбираю ближайший круглый десяток', 'Смотрю на последнюю цифру', 'Сравниваю её с 5'],
        y: 'Сначала смотрим на последнюю цифру, потом сравниваем её с 5, затем выбираем круглый десяток.',
        n: 'Без какого шага нельзя сделать остальные? Он и стоит первым.',
        r: 'Последняя цифра меньше 5 — вниз, 5 или больше — вверх.',
      }),

    /* 2 · dnd · 🟢 — qaysi yumaloq o'nlikka. */
    q('02', 'Qaysi tomonga?', '🟢', 'd05-sort-340-350', 'dnd', '🧲', [0, 1, 0, 1],
      {
        e: 'Yumaloq o\'nlik', s: "To'rt son 340 bilan 350 orasida turibdi.",
        a: 'Har sonni eng yaqin yumaloq o\'nlik rafiga qo\'ying.',
        tokens: ['342', '348', '344', '346'],
        zones: ['340 ga yaqin', '350 ga yaqin'],
        dndHint: 'Sonlar tugadi.',
        y: '342 va 344 — 340 ga yaqin (2 va 4 kichik). 348 va 346 — 350 ga yaqin (8 va 6 katta).',
        n: 'Har sonning oxirgi raqamiga qarang va uni 5 bilan solishtiring.',
        r: 'Oxirgi raqam 5 dan kichik — orqadagi yumaloq o\'nlik, 5 yoki katta — keyingisi.',
      },
      {
        e: 'Круглый десяток', s: 'Четыре числа стоят между 340 и 350.',
        a: 'Положи каждое число на полку ближайшего круглого десятка.',
        tokens: ['342', '348', '344', '346'],
        zones: ['Ближе к 340', 'Ближе к 350'],
        dndHint: 'Числа закончились.',
        y: '342 и 344 ближе к 340 (2 и 4 маленькие). 348 и 346 ближе к 350 (8 и 6 большие).',
        n: 'Смотри на последнюю цифру каждого числа и сравнивай её с 5.',
        r: 'Последняя цифра меньше 5 — круглый десяток позади, 5 или больше — следующий.',
      }, undefined, {
        art: { line: { from: 340, to: 350, values: [342, 344, 346, 348] } },
        tokenArt: [{ plate: '342' }, { plate: '348' }, { plate: '344' }, { plate: '346' }],
      }),

    /* 3 · match · 🟢 — son va yumaloq o'nligi. Eski D05_03 (match_round). */
    q('03', 'Moslashtiring', '🟢', 'd05-match-round', 'match', '🔗', [0, 1, 2],
      {
        e: 'Yumaloq o\'nlik', s: 'Har son o\'z yumaloq o\'nligiga ulanishi kerak.',
        a: 'Sonni bosing, keyin eng yaqin yumaloq o\'nlikni bosing.',
        left: ['267', '854', '523'],
        right: ['270', '850', '520'],
        y: '267 → 270 (7 katta), 854 → 850 (4 kichik), 523 → 520 (3 kichik).',
        n: 'Har sonning OXIRGI raqamiga qarang: 5 dan kichik — pastga, 5 yoki katta — yuqoriga.',
        r: 'Yumaloq o\'nlikni oxirgi raqam hal qiladi.',
      },
      {
        e: 'Круглый десяток', s: 'Каждое число должно соединиться со своим круглым десятком.',
        a: 'Нажми число, потом ближайший круглый десяток.',
        left: ['267', '854', '523'],
        right: ['270', '850', '520'],
        y: '267 → 270 (7 больше), 854 → 850 (4 меньше), 523 → 520 (3 меньше).',
        n: 'Смотри на ПОСЛЕДНЮЮ цифру: меньше 5 — вниз, 5 или больше — вверх.',
        r: 'Круглый десяток определяет последняя цифра.',
      }, undefined, {
        art: { plates: ['267', '854', '523'] },
        artSpotlight: [{ plate: '267', lit: 2 }, { plate: '854', lit: 2 }, { plate: '523', lit: 2 }],
        leftArt: [{ plate: '267' }, { plate: '854' }, { plate: '523' }],
      }),

    /* 4 · input · 🟡 — yumaloq yuzlik. Eski D05_06 (round_hundred). */
    q('04', 'Yumaloq yuzlik', '🟡', 'd05-hundred-427', 'input', '💯', ['400'],
      {
        e: 'Yumaloq yuzlik', s: '427 soni 400 bilan 500 orasida turibdi. Yo\'lning yarmi — 450.',
        a: '427 ga eng yaqin yumaloq YUZLIKNI yozing.',
        y: '427 → 400: o\'nliklar 27 dan iborat, bu 50 dan kichik — orqadagi yuzlik yaqinroq.',
        n: '427 chiziqda 450 dan oldinmi yoki keyinmi? Yumaloq yuzlik tanlashda o\'nliklarga qaraymiz.',
        r: 'Yumaloq yuzlikni o\'nliklar hal qiladi: 27 < 50 → 427 → 400.',
        p: 'Javob',
      },
      {
        e: 'Круглая сотня', s: 'Число 427 стоит между 400 и 500. Половина пути — 450.',
        a: 'Запиши ближайшую к 427 круглую СОТНЮ.',
        y: '427 → 400: десятков 27, это меньше 50 — сотня позади ближе.',
        n: '427 стоит до 450 или после? При выборе круглой сотни смотрим на десятки.',
        r: 'Круглую сотню решают десятки: 27 < 50 → 427 → 400.',
        p: 'Ответ',
      }, 'numeric', {
        art: { line: { from: 400, to: 500, values: [427, 450] } },
      }),

    /* 5 · choice · 🟡 — o'rtadagi son. Eski D05_05 (round_half), 4-chi variant qo'shildi. */
    q('05', 'Aynan o\'rtada', '🟡', 'd05-half-45', 'choice', '⚖️', 0,
      {
        e: 'Kelishuv', s: '45 soni 40 bilan 50 ga bir xil masofada turibdi.',
        a: '45 ga qaysi yumaloq o\'nlik mos deb kelishilgan?',
        o: ['50', '40', '45', 'Hech qaysi'],
        y: 'Kelishuv shunday: son aynan o\'rtada tursa, YUQORIGA olamiz — 45 → 50.',
        n: '45 ikkala tomonga teng uzoq. Bunday holat uchun maxsus kelishuv bor.',
        by: [
          undefined,
          'Bu pastga olish. O\'rtadagi son uchun kelishuv qaysi tomonni ko\'rsatadi?',
          '45 ning o\'zi yumaloq son emas: yumaloq o\'nlik nol bilan tugaydi.',
          'Har qanday son uchun yumaloq o\'nlik topiladi, o\'rtadagi sonlar uchun ham kelishuv bor.',
        ],
        r: 'O\'rtadagi son yuqoriga olinadi: 45 → 50. Bu — kelishuv.',
      },
      {
        e: 'Договорённость', s: 'Число 45 стоит на одинаковом расстоянии от 40 и от 50.',
        a: 'Какой круглый десяток договорились считать подходящим для 45?',
        o: ['50', '40', '45', 'Никакой'],
        y: 'Договорённость такая: если число ровно посередине, берём ВВЕРХ — 45 → 50.',
        n: '45 одинаково далеко в обе стороны. Для такого случая есть особая договорённость.',
        by: [
          undefined,
          'Это округление вниз. Куда указывает договорённость для числа посередине?',
          'Само 45 не круглое: круглый десяток заканчивается нулём.',
          'Для любого числа круглый десяток находится, и для середины тоже есть договорённость.',
        ],
        r: 'Число посередине берут вверх: 45 → 50. Это договорённость.',
      }, undefined, {
        art: { line: { from: 40, to: 50, values: [45] } },
      }),

    /* 6 · multi · 🟡 — bitta yumaloq o'nlikka tushadigan sonlar. */
    q('06', '250 ga tushadi', '🟡', 'd05-to-250-multi', 'multi', '🎯', [0, 1, 2],
      {
        e: 'Bitta nishon', s: 'To\'rt son berilgan. Ba\'zilari bir xil yumaloq o\'nlikka tushadi.',
        a: 'Qaysi sonlar 250 ga yaxlitlanadi? Hammasini belgilang.',
        o: ['246', '252', '248', '255'],
        y: '246 → 250, 252 → 250, 248 → 250. 255 esa o\'rtada turibdi va yuqoriga, 260 ga olinadi.',
        n: 'Har sonning oxirgi raqamiga qarang va eng yaqin yumaloq o\'nlikni toping.',
        r: '246, 248 va 252 — hammasi 250 ga yaqin; 255 esa kelishuv bo\'yicha 260 ga.',
      },
      {
        e: 'Одна мишень', s: 'Даны четыре числа. Некоторые попадают в один круглый десяток.',
        a: 'Какие числа округляются до 250? Отметь все.',
        o: ['246', '252', '248', '255'],
        y: '246 → 250, 252 → 250, 248 → 250. А 255 стоит посередине и берётся вверх, до 260.',
        n: 'Смотри на последнюю цифру каждого числа и находи ближайший круглый десяток.',
        r: '246, 248 и 252 — все близко к 250; а 255 по договорённости идёт к 260.',
      }, undefined, {
        art: { line: { from: 240, to: 260, values: [246, 248, 252, 255] } },
        optionArt: [{ plate: '246' }, { plate: '252' }, { plate: '248' }, { plate: '255' }],
      }),

    /* 7 · input · 🟡 — nishon o'zgaradi. Eski D05_09 (round_two_step). */
    q('07', 'Nishonni almashtiring', '🟡', 'd05-two-step-348', 'input', '🔄', ['300'],
      {
        e: 'Diqqat, nishon', s: '348 ni yumaloq o\'nlikka yaxlitlasak, 350 chiqadi. Endi boshqa nishon kerak.',
        a: '348 ga eng yaqin yumaloq YUZLIKNI yozing.',
        y: '348 → 300: yuzlik uchun o\'nliklarga qaraymiz, 48 < 50. O\'nlikka 350, yuzlikka esa 300.',
        n: 'Endi o\'nlik emas, YUZLIK kerak. 348 chiziqda 300 bilan 400 orasida, yarmi — 350.',
        r: 'Nishon muhim: o\'nlikka — oxirgi raqamga, yuzlikka — o\'nliklarga qaraymiz.',
        p: 'Javob',
      },
      {
        e: 'Внимание, мишень', s: 'Если округлить 348 до десятков, получится 350. Теперь нужна другая мишень.',
        a: 'Запиши ближайшую к 348 круглую СОТНЮ.',
        y: '348 → 300: для сотни смотрим на десятки, 48 < 50. До десятка 350, а до сотни 300.',
        n: 'Теперь нужен не десяток, а СОТНЯ. 348 стоит между 300 и 400, половина — 350.',
        r: 'Мишень важна: до десятка смотрим на последнюю цифру, до сотни — на десятки.',
        p: 'Ответ',
      }, 'numeric', {
        art: { line: { from: 300, to: 400, values: [348, 350] } },
      }),

    /* 8 · match · 🔴 — son va yumaloq yuzligi. */
    q('08', 'Yumaloq yuzliklar', '🔴', 'd05-match-hundred', 'match', '💯', [0, 1, 2],
      {
        e: 'Yumaloq yuzlik', s: 'Har son o\'z yumaloq yuzligiga ulanishi kerak.',
        a: 'Sonni bosing, keyin eng yaqin yumaloq yuzlikni bosing.',
        left: ['348', '427', '650'],
        right: ['300', '400', '700'],
        y: '348 → 300 (48 < 50), 427 → 400 (27 < 50), 650 → 700 (o\'rtadagi son yuqoriga).',
        n: 'Yumaloq yuzlik uchun O\'NLIKLARGA qarang va ularni 50 bilan solishtiring.',
        r: 'Yumaloq yuzlikni o\'nliklar hal qiladi; aynan 50 bo\'lsa — yuqoriga.',
      },
      {
        e: 'Круглая сотня', s: 'Каждое число должно соединиться со своей круглой сотней.',
        a: 'Нажми число, потом ближайшую круглую сотню.',
        left: ['348', '427', '650'],
        right: ['300', '400', '700'],
        y: '348 → 300 (48 < 50), 427 → 400 (27 < 50), 650 → 700 (середина идёт вверх).',
        n: 'Для круглой сотни смотри на ДЕСЯТКИ и сравнивай их с 50.',
        r: 'Круглую сотню решают десятки; если ровно 50 — вверх.',
      }, undefined, {
        art: { plates: ['348', '427', '650'] },
        leftArt: [{ plate: '348' }, { plate: '427' }, { plate: '650' }],
      }),

    /* 9 · dnd · 🔴 — XATONI TOPING. Eski D05_08 (round_error). */
    q('09', 'Tekshiring', '🔴', 'd05-check-round', 'dnd', '🔎', [0, 1, 0, 1],
      {
        e: 'Xatoni toping', s: 'To\'rtta yaxlitlash yozuvi. Ikkitasi noto\'g\'ri.',
        a: 'Har yozuvni to\'g\'ri yoki xato rafiga qo\'ying.',
        tokens: ['427 → 430', '267 → 260', '854 → 850', '45 → 40'],
        zones: ['To\'g\'ri', 'Xato'],
        dndHint: 'Yozuvlar tugadi.',
        y: '267 → 270 bo\'lishi kerak (7 katta), 45 → 50 bo\'lishi kerak (o\'rtadagi son yuqoriga).',
        n: 'Har yozuvda oxirgi raqamni tekshiring: 5 dan kichik — pastga, 5 va katta — yuqoriga.',
        r: 'Tekshiruv qoidasi: oxirgi raqam 5 dan kichik — pastga, aks holda yuqoriga.',
      },
      {
        e: 'Найди ошибку', s: 'Четыре записи округления. Две из них неверны.',
        a: 'Положи каждую запись на полку «верно» или «ошибка».',
        tokens: ['427 → 430', '267 → 260', '854 → 850', '45 → 40'],
        zones: ['Верно', 'Ошибка'],
        dndHint: 'Записи закончились.',
        y: 'Должно быть 267 → 270 (7 больше) и 45 → 50 (середина идёт вверх).',
        n: 'В каждой записи проверь последнюю цифру: меньше 5 — вниз, 5 и больше — вверх.',
        r: 'Правило проверки: последняя цифра меньше 5 — вниз, иначе вверх.',
      }),

    /* 10 · multi · 🔴 — yuqoriga olinadigan sonlar. */
    q('10', 'Yuqoriga olinadi', '🔴', 'd05-round-up-multi', 'multi', '🚀', [0, 1, 2],
      {
        e: 'Yakuniy mashq', s: 'To\'rt son berilgan. Ularni yumaloq o\'nlikka yaxlitlaymiz.',
        a: 'Qaysi sonlar YUQORIGA olinadi? Hammasini belgilang.',
        o: ['215', '348', '427', '854'],
        y: '215 → 220 (o\'rtadagi son yuqoriga), 348 → 350 (8 katta), 427 → 430 (7 katta). 854 → 850: 4 kichik, pastga.',
        n: 'Har sonning oxirgi raqamini 5 bilan solishtiring: 5 va undan katta bo\'lsa — yuqoriga.',
        r: 'Oxirgi raqam 5 yoki undan katta bo\'lsa, son yuqoriga olinadi.',
      },
      {
        e: 'Итоговое задание', s: 'Даны четыре числа. Округляем их до круглого десятка.',
        a: 'Какие числа округляются ВВЕРХ? Отметь все.',
        o: ['215', '348', '427', '854'],
        y: '215 → 220 (середина идёт вверх), 348 → 350 (8 больше), 427 → 430 (7 больше). А 854 → 850: 4 меньше, вниз.',
        n: 'Сравни последнюю цифру каждого числа с 5: если 5 и больше — вверх.',
        r: 'Если последняя цифра 5 или больше, число округляют вверх.',
      }, undefined, {
        art: { plates: ['215', '348', '427', '854'] },
        optionArt: [{ plate: '215' }, { plate: '348' }, { plate: '427' }, { plate: '854' }],
      }),
  ],
};

export default DARS05_BANK;
