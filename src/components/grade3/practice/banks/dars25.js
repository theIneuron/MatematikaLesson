// Dars 25 amaliyoti — Maxrajlar oilasi.
// Nazariya: src/components/grade3/Dars25.jsx (num-3-25).
// Bitta tasma turlicha kesiladi; surat birdan katta bo'lishi mumkin (5/8);
// maxrajlar oilasi 2, 4, 8 va 3, 6.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 order · 2 choice · 3 multi · 4 input · 5 match · 6 choice · 7 order · 8 multi · 9 match · 10 dnd
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS25_BANK = {
  title: 'Dars 25 · Maxrajlar oilasi',
  items: [

    /* 1 · order · 🟢 — kesish ketma-ketligi. */
    q('01', 'Kesish ketma-ketligi', '🟢', 'd25-cut-order', 'order', '✂️', [1, 2, 0],
      {
        e: 'Har safar ikkiga', s: "Tasmani ikkiga kesamiz, keyin har bo'lakni yana ikkiga, keyin yana.",
        a: 'Bo\'laklarni paydo bo\'lish tartibida tanlang.',
        o: ['1/8', '1/2', '1/4'],
        y: "Avval 1/2, keyin har yarim ikkiga bo'linib 1/4, keyin yana ikkiga bo'linib 1/8.",
        n: "Har kesishda bo'laklar soni ikki barobar ortadi: 2, 4, 8.",
        r: 'Maxrajlar oilasi: 2, 4, 8 — har safar ikki barobar.',
      },
      {
        e: 'Каждый раз пополам', s: 'Режем ленту пополам, потом каждую часть ещё пополам, потом ещё раз.',
        a: 'Выбери части в порядке их появления.',
        o: ['1/8', '1/2', '1/4'],
        y: 'Сначала 1/2, потом каждая половина делится пополам и даёт 1/4, потом ещё раз и даёт 1/8.',
        n: 'При каждом разрезе число частей удваивается: 2, 4, 8.',
        r: 'Семья знаменателей: 2, 4, 8 — каждый раз вдвое.',
      }),

    /* 2 · choice · 🟢 — nechta bo'lak. */
    q('02', "Nechta bo'lak?", '🟢', 'd25-how-many', 'choice', '🔢', 1,
      {
        e: 'Ikkiga kesamiz', s: "Tasma 4 teng bo'lakka bo'lingan edi. Har bo'lakni yana ikkiga kesamiz.",
        a: 'Nechta bo\'lak hosil bo\'ladi?',
        o: ['6', '8', '4', '16'],
        y: "Har bo'lak ikkiga bo'linadi: 4 × 2 = 8 ta bo'lak, ya'ni 1/8.",
        n: "Bo'laklar soni ikki barobar ortadi, ikkitaga ortmaydi.",
        by: [
          "Bu yerda 4 ga 2 qo'shilgan. Lekin HAR bo'lak ikkiga bo'linadi.",
          undefined,
          "Bo'laklar soni o'zgarmagan. Lekin har biri kesildi.",
          "Bu to'rt barobar. Har bo'lak esa faqat ikkiga bo'lindi.",
        ],
        r: "Har bo'lakni ikkiga kessak, bo'laklar soni ikki barobar ortadi.",
      },
      {
        e: 'Режем пополам', s: 'Лента была разделена на 4 равные части. Каждую часть режем ещё пополам.',
        a: 'Сколько получится частей?',
        o: ['6', '8', '4', '16'],
        y: 'Каждая часть делится надвое: 4 × 2 = 8 частей, то есть 1/8.',
        n: 'Число частей удваивается, а не увеличивается на два.',
        by: [
          'Здесь к 4 прибавили 2. Но пополам режут КАЖДУЮ часть.',
          undefined,
          'Число частей не изменилось. А ведь каждую разрезали.',
          'Это вчетверо. А каждую часть разрезали только надвое.',
        ],
        r: 'Если каждую часть разрезать пополам, число частей удваивается.',
      }),

    /* 3 · multi · 🟢 — bir oiladagi maxrajlar. */
    q('03', 'Bir oiladan', '🟢', 'd25-family', 'multi', '👨‍👩‍👧', [0, 2, 3],
      {
        e: 'Ikkilar oilasi', s: "Tasmani har safar ikkiga kesib borsak, maxrajlar oilasi hosil bo'ladi.",
        a: 'Qaysi maxrajlar 2 lar oilasiga kiradi? Hammasini belgilang.',
        o: ['2', '3', '4', '8'],
        y: "2, 4 va 8 — har biri oldingisining ikki barobari. 3 esa boshqa oiladan: 3, 6, 12.",
        n: "Har maxrajni ikkiga bo'lib ko'ring: oilada har son oldingisining ikki barobari.",
        r: 'Maxrajlar oilasi: 2, 4, 8 va alohida 3, 6, 12.',
      },
      {
        e: 'Семья двоек', s: 'Если каждый раз резать ленту пополам, получается семья знаменателей.',
        a: 'Какие знаменатели входят в семью двоек? Отметь все.',
        o: ['2', '3', '4', '8'],
        y: '2, 4 и 8 — каждый вдвое больше предыдущего. А 3 из другой семьи: 3, 6, 12.',
        n: 'Раздели каждый знаменатель пополам: в семье каждое число вдвое больше предыдущего.',
        r: 'Семья знаменателей: 2, 4, 8 и отдельно 3, 6, 12.',
      }),

    /* 4 · input · 🟡 — nechtasi olindi. */
    q('04', 'Nechtasi olindi?', '🟡', 'd25-taken', 'input', '✍️', ['5'],
      {
        e: 'Surat birdan katta', s: "Tasma 8 teng bo'lakka bo'lindi. Uchtasi qoldi.",
        a: 'Nechta bo\'lak olindi?',
        y: '8 − 3 = 5 ta bo\'lak olindi, ya\'ni 5/8.',
        n: "Jami bo'laklar soni maxrajda. Undan qolganini ayiring.",
        r: 'Surat birdan katta bo\'lishi mumkin: 5/8.',
        p: 'Javob',
      },
      {
        e: 'Числитель больше единицы', s: 'Ленту разделили на 8 равных частей. Осталось три.',
        a: 'Сколько частей взяли?',
        y: '8 − 3 = 5 частей взяли, то есть 5/8.',
        n: 'Общее число частей в знаменателе. Вычти из него оставшиеся.',
        r: 'Числитель может быть больше единицы: 5/8.',
        p: 'Ответ',
      }, 'numeric'),

    /* 5 · match · 🟡 — kesish va bo'lak. */
    q('05', 'Kesish va bo\'lak', '🟡', 'd25-match-cut', 'match', '🔗', [0, 1, 2],
      {
        e: 'Turlicha kesilgan', s: "Bitta tasma uch xil kesildi.",
        a: "Ulang: necha bo'lakka bo'lingan — va bitta bo'lak qanday yoziladi.",
        left: ['3 teng bo\'lakka', '6 teng bo\'lakka', '12 teng bo\'lakka'],
        right: ['1/3', '1/6', '1/12'],
        y: "Bu uchlar oilasi: 3, 6, 12 — har safar ikki barobar.",
        n: "Nechtaga bo'lingan bo'lsa, o'sha son chiziq tagiga yoziladi.",
        r: 'Maxraj — nechtaga bo\'lingani.',
      },
      {
        e: 'Резали по-разному', s: 'Одну ленту разрезали тремя способами.',
        a: 'Соедини: на сколько частей разделили — и как записывается одна часть.',
        left: ['На 3 равные части', 'На 6 равных частей', 'На 12 равных частей'],
        right: ['1/3', '1/6', '1/12'],
        y: 'Это семья троек: 3, 6, 12 — каждый раз вдвое.',
        n: 'На сколько разделили, то число и пишется под чертой.',
        r: 'Знаменатель — на сколько разделили.',
      }),

    /* 6 · choice · 🟡 — qaysi bo'lak yirik. */
    q('06', 'Qaysi bo\'lak yirik?', '🟡', 'd25-bigger-part', 'choice', '📏', 0,
      {
        e: 'Bitta tasma', s: "Bitta tasmadan olingan ikki bo'lak: 1/3 va 1/6.",
        a: 'Qaysi bo\'lak yirikroq?',
        o: ['1/3', '1/6', 'Teng', 'Aniqlab bo\'lmaydi'],
        y: "Tasma 3 ga bo'linsa, bo'laklar yirik; 6 ga bo'linsa, mayda. 1/3 = ikkita 1/6.",
        n: "Bitta tasmani ko'proq bo'lakka kessak, har bo'lak kattaroq bo'ladimi?",
        by: [
          undefined,
          "6 ga bo'linganda bo'laklar mayda chiqadi. Ko'p bo'lak — kichik bo'lak.",
          "Bo'laklar soni har xil, demak kattaligi ham har xil.",
          "Ikkala kasr ham bitta tasmadan, shuning uchun solishtirish mumkin.",
        ],
        r: "Maxraj kichik bo'lsa, ulush yirik bo'ladi.",
      },
      {
        e: 'Одна лента', s: 'Две части одной ленты: 1/3 и 1/6.',
        a: 'Какая часть крупнее?',
        o: ['1/3', '1/6', 'Равны', 'Определить нельзя'],
        y: 'Если ленту делят на 3, части крупные; на 6 — мелкие. 1/3 — это две части по 1/6.',
        n: 'Если одну ленту разрезать на больше частей, станет ли каждая крупнее?',
        by: [
          undefined,
          'При делении на 6 части выходят мельче. Больше частей — меньше каждая.',
          'Число частей разное, значит и размер разный.',
          'Обе дроби от одной ленты, поэтому их можно сравнить.',
        ],
        r: 'Чем меньше знаменатель, тем крупнее доля.',
      }),

    /* 7 · order · 🟡 — bo'laklar kattaligi. */
    q('07', 'Kattaligi bo\'yicha', '🟡', 'd25-order-size', 'order', '📉', [3, 1, 2, 0],
      {
        e: 'To\'rt bo\'lak', s: "Bitta tasma to'rt xil kesildi. Bo'laklar turlicha chiqdi.",
        a: 'Bo\'laklarni yirigidan kichigiga qarab tartiblang.',
        o: ['1/12', '1/4', '1/6', '1/3'],
        y: "1/3 eng yirik, keyin 1/4, keyin 1/6, eng kichigi 1/12.",
        n: "Maxraj qancha katta bo'lsa, bo'lak shuncha mayda.",
        r: "Maxraj o'sganda ulush kichrayadi.",
      },
      {
        e: 'По размеру', s: 'Одну ленту разрезали четырьмя способами. Части вышли разные.',
        a: 'Расставь части от самой крупной к самой мелкой.',
        o: ['1/12', '1/4', '1/6', '1/3'],
        y: '1/3 самая крупная, потом 1/4, потом 1/6, самая мелкая 1/12.',
        n: 'Чем больше знаменатель, тем мельче часть.',
        r: 'Когда знаменатель растёт, доля уменьшается.',
      }),

    /* 8 · multi · 🔴 — surat birdan katta. */
    q('08', 'Bir bo\'lakdan ko\'p', '🔴', 'd25-more-than-one', 'multi', '🎯', [1, 2, 3],
      {
        e: 'Nechta bo\'lak olingan?', s: "To'rtta yozuv. Ba'zilarida bitta bo'lakdan ko'p olingan.",
        a: 'Qaysi yozuvlarda BIR bo\'lakdan ko\'p olingan? Hammasini belgilang.',
        o: ['1/8', '5/8', '3/4', '2/3'],
        y: "5/8, 3/4 va 2/3 da surat birdan katta. 1/8 da esa atigi bitta bo'lak olingan.",
        n: 'Chiziq ustidagi songa qarang: u nechtasi olinganini bildiradi.',
        r: 'Surat birdan katta bo\'lishi mumkin: 5/8.',
      },
      {
        e: 'Больше одной части', s: 'Четыре записи. В некоторых взяли больше одной части.',
        a: 'В каких записях взяли БОЛЬШЕ одной части? Отметь все.',
        o: ['1/8', '5/8', '3/4', '2/3'],
        y: 'В 5/8, 3/4 и 2/3 числитель больше единицы. А в 1/8 взяли всего одну часть.',
        n: 'Смотри на число над чертой: оно показывает, сколько взяли.',
        r: 'Числитель может быть больше единицы: 5/8.',
      }),

    /* 9 · match · 🔴 — teng ulushlar. */
    q('09', 'Teng ulushlar', '🔴', 'd25-equal-parts', 'match', '⚖️', [0, 1, 2],
      {
        e: 'Bir xil qism', s: "Bitta tasmaning turlicha yozilgan bir xil qismlari.",
        a: 'Har yozuvni unga teng yozuvga ulang.',
        left: ['1/2', '1/3', '3/4'],
        right: ['2/4', '2/6', '6/8'],
        y: "1/2 = 2/4, 1/3 = 2/6, 3/4 = 6/8: bo'laklar ikki barobar mayda bo'lganda, ularning soni ham ikki barobar ortadi.",
        n: "Har yozuvda maxrajni ikki barobar oshiring va suratni ham ikki barobar oshiring.",
        r: 'Maxraj ham, surat ham ikki barobar oshsa, qism o\'zgarmaydi.',
      },
      {
        e: 'Одна и та же часть', s: 'Одна и та же часть ленты, записанная по-разному.',
        a: 'Соедини каждую запись с равной ей записью.',
        left: ['1/2', '1/3', '3/4'],
        right: ['2/4', '2/6', '6/8'],
        y: '1/2 = 2/4, 1/3 = 2/6, 3/4 = 6/8: когда части становятся вдвое мельче, их число тоже удваивается.',
        n: 'В каждой записи удвой знаменатель и удвой числитель.',
        r: 'Если удвоить и знаменатель, и числитель, часть не изменится.',
      }),

    /* 10 · dnd · 🔴 — qaysi oilaga. */
    q('10', 'Qaysi oilaga?', '🔴', 'd25-sort-family', 'dnd', '🚀', [0, 1, 0, 1],
      {
        e: 'Yakuniy mashq', s: "To'rtta maxraj. Ular ikki oilaga bo'linadi.",
        a: 'Maxrajlarni ajrating: qaysilari 2 lar oilasida, qaysilari 3 lar oilasida.',
        tokens: ['4', '6', '8', '12'],
        zones: ['2 lar oilasi', '3 lar oilasi'],
        dndHint: 'Maxrajlar tugadi.',
        y: "4 va 8 — 2 dan ikki barobarlab: 2, 4, 8. 6 va 12 — 3 dan: 3, 6, 12.",
        n: "Har maxrajni ikkiga bo'lib boring: oxirida 2 chiqsa — birinchi oila, 3 chiqsa — ikkinchi.",
        r: 'Maxrajlar oilasi: 2, 4, 8 va 3, 6, 12.',
      },
      {
        e: 'Итоговое задание', s: 'Четыре знаменателя. Они делятся на две семьи.',
        a: 'Разложи знаменатели: какие в семье двоек, а какие в семье троек.',
        tokens: ['4', '6', '8', '12'],
        zones: ['Семья двоек', 'Семья троек'],
        dndHint: 'Знаменатели закончились.',
        y: '4 и 8 — от 2 удвоением: 2, 4, 8. А 6 и 12 — от 3: 3, 6, 12.',
        n: 'Дели каждый знаменатель пополам: если в конце выйдет 2 — первая семья, если 3 — вторая.',
        r: 'Семьи знаменателей: 2, 4, 8 и 3, 6, 12.',
      }),
  ],
};

export default DARS25_BANK;
