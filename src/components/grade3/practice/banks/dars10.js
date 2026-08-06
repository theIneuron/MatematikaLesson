// Dars 10 amaliyoti — 10 va 100 ga ko'paytirish va bo'lish.
// Nazariya: src/components/grade3/Dars10.jsx (num-3-10).
// Bank newBanks.js dan ko'chirildi va §1A kanoniga keltirildi: mexanikalar raskladka
// bo'yicha, choice da 4 variant va har noto'g'risiga o'z tahlili, sahnada chizilgan buyumlar.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 multi · 2 match · 3 order · 4 input · 5 dnd · 6 match · 7 multi · 8 order · 9 choice · 10 input
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS10_BANK = {
  title: "Dars 10 · 10 va 100 ga ko'paytirish va bo'lish",
  items: [

    /* 1 · multi · 🟢 — to'g'ri tengliklar. Eski 07 (equivalent-multi). */
    q('01', "To'g'ri tengliklar", '🟢', 'd10-equivalent', 'multi', '✅', [0, 1, 3],
      {
        e: 'Siljishni tekshiring', s: "To'rtta tenglik. Har birida razryadlar siljishi tekshiriladi.",
        a: "Barcha TO'G'RI tengliklarni belgilang.",
        o: ['50 × 10 = 500', '700 : 100 = 7', '36 × 10 = 3 600', '900 : 10 = 90'],
        y: "Uchta tenglik to'g'ri. 36 × 10 esa 360 bo'ladi, 3 600 emas: 10 ga ko'paytirish bir xona siljitadi.",
        n: 'Har tenglikni alohida tekshiring: 10 ga — bir xona, 100 ga — ikki xona.',
        r: "Ko'paytirish razryadlarni chapga, bo'lish o'ngga siljitadi.",
      },
      {
        e: 'Проверь сдвиг', s: 'Четыре равенства. В каждом проверяется сдвиг разрядов.',
        a: 'Отметь все ВЕРНЫЕ равенства.',
        o: ['50 × 10 = 500', '700 : 100 = 7', '36 × 10 = 3 600', '900 : 10 = 90'],
        y: 'Три равенства верны. А 36 × 10 = 360, а не 3 600: умножение на 10 сдвигает на один разряд.',
        n: 'Проверь каждое равенство отдельно: на 10 — один разряд, на 100 — два.',
        r: 'Умножение сдвигает разряды влево, деление вправо.',
      }),

    /* 2 · match · 🟢 — amal va natija. */
    q('02', 'Moslashtiring', '🟢', 'd10-match-ops', 'match', '🔗', [0, 1, 2],
      {
        e: 'Siljish qancha?', s: "Uchta amal: ikkitasi ko'paytirish, bittasi bo'lish.",
        a: 'Har amalni uning natijasiga ulang.',
        left: ['34 × 10', '7 × 100', '420 : 10'],
        right: ['340', '700', '42'],
        y: '34 × 10 = 340 (bir xona chapga), 7 × 100 = 700 (ikki xona chapga), 420 : 10 = 42 (bir xona o\'ngga).',
        n: "Ko'paytirishda son kattalashadi, bo'lishda kichrayadi. Siljish soni nolga qarab aniqlanadi.",
        r: "10 ga — bir xona, 100 ga — ikki xona; bo'lishda siljish teskari tomonga.",
      },
      {
        e: 'На сколько сдвиг?', s: 'Три действия: два умножения и одно деление.',
        a: 'Соедини каждое действие с его результатом.',
        left: ['34 × 10', '7 × 100', '420 : 10'],
        right: ['340', '700', '42'],
        y: '34 × 10 = 340 (на разряд влево), 7 × 100 = 700 (на два влево), 420 : 10 = 42 (на разряд вправо).',
        n: 'При умножении число растёт, при делении уменьшается. Число сдвигов определяют нули.',
        r: 'На 10 — один разряд, на 100 — два; при делении сдвиг в обратную сторону.',
      }),

    /* 3 · order · 🟢 — razryad zinasi. Eski 03. */
    q('03', 'Razryad zinasi', '🟢', 'd10-place-order', 'order', '🪜', [0, 2, 1],
      {
        e: 'Zina', s: "6 sonini avval 10 ga, keyin hosil bo'lganini yana 10 ga ko'paytiramiz.",
        a: 'Sonlarni kichigidan kattasiga qarab tartiblang.',
        o: ['6', '600', '60'],
        y: "6 → 60 → 600: har safar razryadlar bir xona chapga siljiydi.",
        n: "Avval 6 × 10 ni hisoblang, keyin natijani yana 10 ga ko'paytiring.",
        r: "Ikki marta 10 ga ko'paytirish 100 ga ko'paytirish bilan teng.",
      },
      {
        e: 'Лесенка', s: 'Число 6 умножаем на 10, потом полученное ещё раз на 10.',
        a: 'Расставь числа от меньшего к большему.',
        o: ['6', '600', '60'],
        y: '6 → 60 → 600: каждый раз разряды сдвигаются на одну позицию влево.',
        n: 'Сначала посчитай 6 × 10, потом умножь результат ещё раз на 10.',
        r: 'Умножить дважды на 10 — то же, что умножить на 100.',
      }, undefined, {
        art: { pv: { h: 6 }, captions: { h: 'yuzlik' }, sum: { parts: [], total: '600' } },
        optionArt: [{ plate: '6' }, { plate: '600' }, { plate: '60' }],
      }),

    /* 4 · input · 🟡 — 7 × 100. Eski 02. */
    q('04', 'Yuz marta katta', '🟡', 'd10-times-hundred', 'input', '💯', ['700'],
      {
        e: 'Yuz marta', s: '7 birlik yuz marta kattalashsa, 7 yuzlik hosil bo\'ladi.',
        a: '7 × 100 nechaga teng?',
        y: '7 × 100 = 700: razryadlar ikki xona chapga siljidi.',
        n: "Yetti yuzlik raqamlar bilan qanday yozilishini eslang.",
        r: "100 ga ko'paytirishda razryadlar ikki xona chapga siljiydi.",
        p: 'Javob',
      },
      {
        e: 'В сто раз', s: 'Если 7 единиц увеличить в сто раз, получится 7 сотен.',
        a: 'Чему равно 7 × 100?',
        y: '7 × 100 = 700: разряды сдвинулись на два разряда влево.',
        n: 'Вспомни, как записать семь сотен цифрами.',
        r: 'При умножении на 100 разряды сдвигаются на две позиции влево.',
        p: 'Ответ',
      }, 'numeric', {
        art: { pv: { h: 7 }, captions: { h: 'yuzlik' } },
      }),

    /* 5 · dnd · 🟡 — 10 ga yoki 100 ga. */
    q('05', 'Nechaga ko\'paytirilgan?', '🟡', 'd10-sort-10-100', 'dnd', '🗂️', [0, 1, 1, 0],
      {
        e: 'Siljishga qarang', s: "To'rtta juftlik: son va undan chiqqan natija.",
        a: 'Har juftlikni ko\'paytuvchisiga qarab joylang.',
        tokens: ['34 → 340', '7 → 700', '9 → 900', '50 → 500'],
        zones: ['10 ga', '100 ga'],
        dndHint: 'Juftliklar tugadi.',
        y: '34 → 340 va 50 → 500 — bir xona siljigan, demak 10 ga. 7 → 700 va 9 → 900 — ikki xona, demak 100 ga.',
        n: 'Nechta nol qo\'shilganini sanang: bitta nol — 10 ga, ikkita nol — 100 ga.',
        r: "10 ga ko'paytirishda bitta nol, 100 ga ko'paytirishda ikkita nol qo'shiladi.",
      },
      {
        e: 'Смотри на сдвиг', s: 'Четыре пары: число и результат, который из него получился.',
        a: 'Разложи пары по множителю.',
        tokens: ['34 → 340', '7 → 700', '9 → 900', '50 → 500'],
        zones: ['На 10', 'На 100'],
        dndHint: 'Пары закончились.',
        y: '34 → 340 и 50 → 500 сдвинулись на разряд, значит на 10. А 7 → 700 и 9 → 900 — на два разряда, значит на 100.',
        n: 'Посчитай, сколько нулей прибавилось: один нуль — на 10, два нуля — на 100.',
        r: 'При умножении на 10 добавляется один нуль, на 100 — два.',
      }),

    /* 6 · match · 🟡 — bo'lish. Eski 04 va 10. */
    q('06', "Bo'lish natijalari", '🟡', 'd10-match-div', 'match', '➗', [0, 1, 2],
      {
        e: 'Teskari yo\'l', s: "Bo'lishda razryadlar o'ngga qaytadi. Uchta misol berilgan.",
        a: "Har bo'linmani uning natijasiga ulang.",
        left: ['420 : 10', '3 600 : 100', '900 : 10'],
        right: ['42', '36', '90'],
        y: "420 : 10 = 42, 3 600 : 100 = 36, 900 : 10 = 90.",
        n: "Bo'luvchida nechta nol bo'lsa, shuncha xona o'ngga qaytariladi.",
        r: "10 ga bo'lish — bir xona o'ngga, 100 ga bo'lish — ikki xona o'ngga.",
      },
      {
        e: 'Обратный путь', s: 'При делении разряды возвращаются вправо. Даны три примера.',
        a: 'Соедини каждое деление с его результатом.',
        left: ['420 : 10', '3 600 : 100', '900 : 10'],
        right: ['42', '36', '90'],
        y: '420 : 10 = 42, 3 600 : 100 = 36, 900 : 10 = 90.',
        n: 'Сколько нулей в делителе, на столько разрядов и возвращаемся вправо.',
        r: 'Деление на 10 — на разряд вправо, на 100 — на два разряда вправо.',
      }),

    /* 7 · multi · 🟡 — natijasi 900 bo'lganlar. Eski 05 (missing-factor) kengaytirildi. */
    q('07', '900 chiqadi', '🟡', 'd10-gives-900', 'multi', '🎯', [0, 2],
      {
        e: 'Bir xil natija', s: "To'rtta ifoda. Ikkitasi 900 beradi.",
        a: 'Qaysi ifodalar 900 ga teng? Hammasini belgilang.',
        o: ['9 × 100', '9 × 10', '90 × 10', '900 : 10'],
        y: '9 × 100 = 900 va 90 × 10 = 900. 9 × 10 = 90, 900 : 10 = 90.',
        n: 'Har ifodani alohida hisoblang: nechta nol qo\'shiladi yoki tushadi?',
        r: "Bir xil natijaga turli yo'l bilan kelish mumkin: 9 × 100 = 90 × 10 = 900.",
      },
      {
        e: 'Одинаковый результат', s: 'Четыре выражения. Два дают 900.',
        a: 'Какие выражения равны 900? Отметь все.',
        o: ['9 × 100', '9 × 10', '90 × 10', '900 : 10'],
        y: '9 × 100 = 900 и 90 × 10 = 900. А 9 × 10 = 90 и 900 : 10 = 90.',
        n: 'Посчитай каждое выражение отдельно: сколько нулей прибавится или уйдёт?',
        r: 'К одному результату можно прийти разными путями: 9 × 100 = 90 × 10 = 900.',
      }),

    /* 8 · order · 🔴 — natijalarni tartiblash, nol ichkarida. Eski 08 (zero-trap). */
    q('08', 'Nol ichkarida', '🔴', 'd10-zero-inside', 'order', '🕳️', [3, 1, 2, 0],
      {
        e: 'Diqqat, ichki nol', s: "405 sonining ichida nol o'nlik o'rnini saqlab turibdi. To'rtta ifoda berilgan.",
        a: 'Ifodalarni natijasi bo\'yicha kichigidan kattasiga tartiblang.',
        o: ['405 × 10', '405', '45 × 10', '4 × 100'],
        y: "4 × 100 = 400, keyin 405, keyin 45 × 10 = 450, oxirida 405 × 10 = 4 050. Ichki nol siljishda ham saqlanadi.",
        n: "Avval har ifodani hisoblang. 405 ni siljitganda ichki nolni tashlab yubormang.",
        r: "Son ichidagi nol ham razryad o'rnini saqlaydi: 405 × 10 = 4 050, 45 emas.",
      },
      {
        e: 'Внимание, внутренний ноль', s: 'Внутри числа 405 ноль держит место десятков. Даны четыре выражения.',
        a: 'Расставь выражения по результату от меньшего к большему.',
        o: ['405 × 10', '405', '45 × 10', '4 × 100'],
        y: '4 × 100 = 400, затем 405, затем 45 × 10 = 450, и последним 405 × 10 = 4 050. Внутренний ноль сохраняется и при сдвиге.',
        n: 'Сначала посчитай каждое выражение. Сдвигая 405, не выбрасывай внутренний ноль.',
        r: 'Ноль внутри числа тоже держит разряд: 405 × 10 = 4 050, а не 45.',
      }),

    /* 9 · choice · 🔴 — XATONI TOPING. Eski 09, 4-chi variant qo'shildi. */
    q('09', 'Xatoni toping', '🔴', 'd10-find-error', 'choice', '🔎', 1,
      {
        e: 'Xatoni toping', s: "Anvar shunday dedi: «27 × 10 = 2 700».",
        a: 'Anvarning xatosi qayerda?',
        o: ["Nol qo'shmagan", 'Razryadlarni ikki xona siljitgan', "27 ni 10 ga bo'lgan", 'Xato yo\'q, javob to\'g\'ri'],
        y: "U 100 ga ko'paytirgandek ikki xona siljitgan. To'g'ri javob 270.",
        n: '10 ga va 100 ga ko\'paytirishdagi siljish sonini solishtiring.',
        by: [
          "Nol qo'shilgan, hatto ikkita. Savol shundaki, nechta nol kerak edi.",
          undefined,
          "Bo'lganda son kichrayardi, bu yerda esa u kattalashgan. Demak amal boshqa.",
          "27 × 10 ni tekshiring: bitta nol qo'shiladi. Anvarda nechta nol chiqdi?",
        ],
        r: "10 ga ko'paytirish — bir xona, 100 ga ko'paytirish — ikki xona.",
      },
      {
        e: 'Найди ошибку', s: 'Анвар сказал: «27 × 10 = 2 700».',
        a: 'В чём ошибка Анвара?',
        o: ['Не добавил ноль', 'Сдвинул разряды на два', 'Разделил 27 на 10', 'Ошибки нет, ответ верный'],
        y: 'Он сдвинул на два разряда, как при умножении на 100. Верный ответ 270.',
        n: 'Сравни число сдвигов при умножении на 10 и на 100.',
        by: [
          'Ноль он добавил, и даже два. Вопрос в том, сколько нулей было нужно.',
          undefined,
          'При делении число стало бы меньше, а здесь оно выросло. Значит, действие другое.',
          'Проверь 27 × 10: добавляется один ноль. А сколько нулей вышло у Анвара?',
        ],
        r: 'Умножение на 10 — один разряд, на 100 — два.',
      }, undefined, {
        art: { plates: ['27', '270'] },
      }),

    /* 10 · input · 🔴 — ikki qadamli transfer. Eski 10. */
    q('10', 'Paketlarga ajratish', '🔴', 'd10-transfer', 'input', '🚀', ['36'],
      {
        e: 'Yakuniy mashq', s: '3 600 signal 100 ta teng paketga ajratildi.',
        a: 'Har paketda nechta signal bor?',
        y: "3 600 : 100 = 36: razryadlar ikki xona o'ngga qaytdi.",
        n: "100 ga bo'lishda razryadlarni ikki xona o'ngga siljiting.",
        r: "Ko'paytirish bilan tekshiruv: 36 × 100 = 3 600.",
        p: 'Javob',
      },
      {
        e: 'Итоговое задание', s: '3 600 сигналов разложили на 100 равных пакетов.',
        a: 'Сколько сигналов в каждом пакете?',
        y: '3 600 : 100 = 36: разряды вернулись на две позиции вправо.',
        n: 'При делении на 100 сдвигай разряды на два разряда вправо.',
        r: 'Проверка умножением: 36 × 100 = 3 600.',
        p: 'Ответ',
      }, 'numeric', {
        art: { plates: ['3 600', '100'] },
      }),
  ],
};

export default DARS10_BANK;
