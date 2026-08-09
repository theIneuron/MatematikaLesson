// Dars 24 amaliyoti — Butunning ulushi va uning yozuvi.
// Nazariya: src/components/grade3/Dars24.jsx (num-3-24).
// Chiziq tagida maxraj — nechtaga bo'lingani, ustida surat — nechtasi olingani.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 match · 2 order · 3 choice · 4 order · 5 dnd · 6 multi · 7 choice · 8 match · 9 dnd · 10 input
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS24_BANK = {
  title: 'Dars 24 · Butunning ulushi',
  items: [

    /* 1 · match · 🟢 — bo'lakning nomi. */
    q('01', "Bo'lakning nomi", '🟢', 'd24-name-part', 'match', '🔗', [0, 1, 2],
      {
        e: 'Nechtaga bo\'lindi?', s: "Butun teng bo'laklarga bo'linadi va har bo'lak o'z nomini oladi.",
        a: "Ulang: necha bo'lakka bo'lingan — va bitta bo'lak qanday ataladi.",
        left: ['2 teng bo\'lakka', '4 teng bo\'lakka', '8 teng bo\'lakka'],
        right: ['1/2', '1/4', '1/8'],
        y: "Chiziq tagidagi son — nechtaga bo'lingani. Yuqoridagi 1 — bittasi olingani.",
        n: "Butun nechta bo'lakka bo'lingan bo'lsa, o'sha son chiziq TAGIGA yoziladi.",
        r: "Chiziq tagida maxraj: butun nechtaga bo'lingani.",
      },
      {
        e: 'На сколько разделили?', s: 'Целое делят на равные части, и каждая часть получает своё имя.',
        a: 'Соедини: на сколько частей разделили — и как называется одна часть.',
        left: ['На 2 равные части', 'На 4 равные части', 'На 8 равных частей'],
        right: ['1/2', '1/4', '1/8'],
        y: 'Число под чертой — на сколько разделили. Единица сверху — что взяли одну часть.',
        n: 'На сколько частей разделили целое, то число и пишется ПОД чертой.',
        r: 'Под чертой знаменатель: на сколько разделили целое.',
      }),

    /* 2 · order · 🟢 — bo'laklar tartibi. */
    q('02', "Bo'lak kattaligi", '🟢', 'd24-part-size', 'order', '📉', [2, 1, 0],
      {
        e: 'Qaysi bo\'lak yirik?', s: "Bitta tasma turlicha kesildi: 2, 4 va 8 bo'lakka.",
        a: 'Bo\'laklarni yirigidan kichigiga qarab tartiblang.',
        o: ['1/8', '1/4', '1/2'],
        y: "1/2 eng yirik, 1/8 eng kichik: bo'lak ko'p bo'lsa, har biri kichik bo'ladi.",
        n: "Bitta tasmani ko'proq bo'lakka kessak, har bo'lak kattaroq bo'ladimi yoki kichikroq?",
        r: "Maxraj kichik bo'lsa, ulush yirik bo'ladi.",
      },
      {
        e: 'Какая часть крупнее?', s: 'Одну ленту разрезали по-разному: на 2, 4 и 8 частей.',
        a: 'Расставь части от самой крупной к самой мелкой.',
        o: ['1/8', '1/4', '1/2'],
        y: '1/2 самая крупная, 1/8 самая мелкая: чем больше частей, тем меньше каждая.',
        n: 'Если одну ленту разрезать на больше частей, каждая станет крупнее или мельче?',
        r: 'Чем меньше знаменатель, тем крупнее доля.',
      }),

    /* 3 · choice · 🟢 — maxraj yoki surat. */
    q('03', 'Chiziq tagida nima?', '🟢', 'd24-denominator', 'choice', '📝', 1,
      {
        e: 'Yozuvni o\'qing', s: "Kasr yozuvida ikki son bor: chiziq tagida va chiziq ustida.",
        a: '3/8 yozuvida chiziq TAGIDAGI 8 nimani bildiradi?',
        o: ['Nechtasi olingani', "Butun nechtaga bo'lingani", 'Jami sonini', "Bo'laklar yig'indisini"],
        y: "8 — butun 8 teng bo'lakka bo'lingani. 3 esa nechtasi olingani.",
        n: "Yozuvni ovoz chiqarib o'qing: uch sakkizdan. Sakkiz qayerdan chiqdi?",
        by: [
          "Nechtasi olingani chiziq USTIDA turadi. Bu yozuvda u 3.",
          undefined,
          "Kasrda jami son emas, bo'lish natijasi yoziladi.",
          "Bo'laklar qo'shilmaydi: kasr bo'linish va olinganini ko'rsatadi.",
        ],
        r: "Chiziq tagida maxraj — butun nechtaga bo'lingani.",
      },
      {
        e: 'Прочитай запись', s: 'В записи дроби два числа: под чертой и над чертой.',
        a: 'Что означает число 8 ПОД чертой в записи 3/8?',
        o: ['Сколько взяли', 'На сколько разделили целое', 'Сколько всего', 'Сумму частей'],
        y: '8 — это на 8 равных частей разделили целое. А 3 — сколько взяли.',
        n: 'Прочитай запись вслух: три восьмых. Откуда взялось восемь?',
        by: [
          'Сколько взяли — пишется НАД чертой. В этой записи это 3.',
          undefined,
          'В дроби пишут не общее число, а результат деления.',
          'Части не складывают: дробь показывает деление и сколько взяли.',
        ],
        r: 'Под чертой знаменатель — на сколько разделили целое.',
      }),

    /* 4 · order · 🟡 — bir xil maxrajli ulushlar. */
    q('04', 'Qancha olindi?', '🟡', 'd24-order-num', 'order', '📈', [1, 3, 0, 2],
      {
        e: 'Bitta tasma', s: "Tasma 8 teng bo'lakka bo'lingan. Turli miqdorda olingan.",
        a: 'Ulushlarni kichigidan kattasiga qarab tartiblang.',
        o: ['5/8', '1/8', '7/8', '3/8'],
        y: "Maxraj bir xil, demak suratlarni sanaymiz: 1, 3, 5, 7.",
        n: "Bo'laklar bir xil kattalikda. Qaysi yozuvda bo'lak ko'p olingan?",
        r: 'Maxraj bir xil bo\'lsa, suratni solishtiramiz.',
      },
      {
        e: 'Сколько взяли', s: 'Ленту разделили на 8 равных частей. Взяли разное количество.',
        a: 'Расставь доли от меньшей к большей.',
        o: ['5/8', '1/8', '7/8', '3/8'],
        y: 'Знаменатель одинаковый, значит считаем числители: 1, 3, 5, 7.',
        n: 'Части одинакового размера. В какой записи взяли больше частей?',
        r: 'Если знаменатель одинаковый, сравниваем числители.',
      }),

    /* 5 · dnd · 🟡 — yozuvni tuzing. */
    q('05', 'Yozuvni tuzing', '🟡', 'd24-build-form', 'dnd', '🧩', [0, 1],
      {
        e: 'Ikki joy', s: "Tasma 4 teng bo'lakka bo'lindi, 3 tasi olindi.",
        a: 'Har sonni kasr yozuvidagi o\'z joyiga qo\'ying.',
        tokens: ['3', '4'],
        zones: ['Chiziq ustiga', 'Chiziq tagiga'],
        dndHint: 'Sonlar tugadi.',
        y: "3/4: ustida nechtasi olingani, tagida nechtaga bo'lingani.",
        n: "Bo'lish soni qayerga yoziladi — ustigami yoki tagiga?",
        r: 'Chiziq ustida surat, tagida maxraj.',
      },
      {
        e: 'Два места', s: 'Ленту разделили на 4 равные части, взяли 3.',
        a: 'Положи каждое число на его место в записи дроби.',
        tokens: ['3', '4'],
        zones: ['Над чертой', 'Под чертой'],
        dndHint: 'Числа закончились.',
        y: '3/4: сверху сколько взяли, снизу на сколько разделили.',
        n: 'Куда пишется число, на которое разделили, — наверх или вниз?',
        r: 'Над чертой числитель, под чертой знаменатель.',
      }),

    /* 6 · multi · 🟡 — butunni beradiganlar. */
    q('06', 'Butun chiqadi', '🟡', 'd24-whole', 'multi', '⭕', [0, 2],
      {
        e: 'Hamma bo\'laklar', s: "To'rtta yozuv. Ba'zilarida hamma bo'laklar olingan.",
        a: 'Qaysi yozuvlar BUTUNGA teng? Hammasini belgilang.',
        o: ['4/4', '3/4', '8/8', '7/8'],
        y: "4/4 va 8/8 — hamma bo'laklar olingan, demak butun. Qolganlarida bittadan bo'lak yetmayapti.",
        n: "Surat maxrajga teng bo'lsa, nechta bo'lak olingan?",
        r: "Surat maxrajga teng bo'lsa, kasr butunga teng.",
      },
      {
        e: 'Все части', s: 'Четыре записи. В некоторых взяли все части.',
        a: 'Какие записи равны ЦЕЛОМУ? Отметь все.',
        o: ['4/4', '3/4', '8/8', '7/8'],
        y: '4/4 и 8/8 — взяты все части, значит это целое. В остальных не хватает одной части.',
        n: 'Если числитель равен знаменателю, сколько частей взяли?',
        r: 'Если числитель равен знаменателю, дробь равна целому.',
      }),

    /* 7 · choice · 🟡 — ulushni tanlash. */
    q('07', 'Qaysi ulush?', '🟡', 'd24-which-part', 'choice', '🍕', 2,
      {
        e: 'Nonni bo\'lish', s: "Non 6 teng bo'lakka bo'lindi, 5 tasi olindi.",
        a: 'Bu qanday kasr bilan yoziladi?',
        o: ['6/5', '1/6', '5/6', '5/11'],
        y: "5/6: 6 ta bo'lakdan 5 tasi olingan.",
        n: "Nechtaga bo'lindi — chiziq tagiga. Nechtasi olindi — chiziq ustiga.",
        by: [
          "Bu yerda sonlar joy almashgan: 6 ta bo'lakdan 5 tasi olingan, teskarisi emas.",
          "Bu bitta bo'lak. Lekin bo'laklar 5 ta olingan.",
          undefined,
          "Bu yerda 6 va 5 qo'shilgan. Kasrda sonlar qo'shilmaydi.",
        ],
        r: 'Surat — nechtasi olingani, maxraj — nechtaga bo\'lingani.',
      },
      {
        e: 'Делим хлеб', s: 'Хлеб разделили на 6 равных частей, взяли 5.',
        a: 'Какой дробью это записывается?',
        o: ['6/5', '1/6', '5/6', '5/11'],
        y: '5/6: из 6 частей взяли 5.',
        n: 'На сколько разделили — под черту. Сколько взяли — над чертой.',
        by: [
          'Здесь числа поменялись местами: из 6 частей взяли 5, а не наоборот.',
          'Это одна часть. А частей взяли 5.',
          undefined,
          'Здесь 6 и 5 сложили. В дроби числа не складывают.',
        ],
        r: 'Числитель — сколько взяли, знаменатель — на сколько разделили.',
      }),

    /* 8 · match · 🔴 — so'z va yozuv. */
    q('08', "So'z va yozuv", '🔴', 'd24-word-form', 'match', '📖', [0, 1, 2],
      {
        e: 'O\'qilishi', s: "Har kasrning o'z o'qilishi bor.",
        a: 'Har yozuvni uning o\'qilishiga ulang.',
        left: ['1/2', '3/4', '5/8'],
        right: ['bir ikkidan', "uch to'rtdan", 'besh sakkizdan'],
        y: "Avval surat o'qiladi, keyin maxraj: besh sakkizdan.",
        n: "O'qishda avval qaysi son aytiladi — ustidagimi yoki tagidagi?",
        r: "Kasr o'qilganda avval surat, keyin maxraj aytiladi.",
      },
      {
        e: 'Чтение', s: 'У каждой дроби своё чтение.',
        a: 'Соедини каждую запись с её чтением.',
        left: ['1/2', '3/4', '5/8'],
        right: ['одна вторая', 'три четвёртых', 'пять восьмых'],
        y: 'Сначала читают числитель, потом знаменатель: пять восьмых.',
        n: 'Какое число называют первым при чтении — верхнее или нижнее?',
        r: 'При чтении дроби сначала называют числитель, потом знаменатель.',
      }),

    /* 9 · dnd · 🔴 — yarmidan katta yoki kichik. */
    q('09', 'Yarmidan katta?', '🔴', 'd24-half-compare', 'dnd', '⚖️', [1, 0, 1, 0],
      {
        e: 'Yarim bilan solishtiring', s: "To'rtta ulush. Har birini yarim bilan solishtiring.",
        a: 'Ulushlarni ajrating: qaysilari yarmidan katta, qaysilari kichik.',
        tokens: ['1/4', '3/4', '3/8', '5/8'],
        zones: ['Yarmidan katta', 'Yarmidan kichik'],
        dndHint: 'Ulushlar tugadi.',
        y: "3/4 va 5/8 yarmidan katta: 2/4 va 4/8 aynan yarim bo'lardi. 1/4 va 3/8 esa kichik.",
        n: "Har maxraj uchun yarim qaysi yozuv bo'lardi? Surat undan katta yoki kichikmi?",
        r: "Surat maxrajning yarmidan katta bo'lsa, kasr yarmidan katta.",
      },
      {
        e: 'Сравни с половиной', s: 'Четыре доли. Сравни каждую с половиной.',
        a: 'Разложи доли: какие больше половины, а какие меньше.',
        tokens: ['1/4', '3/4', '3/8', '5/8'],
        zones: ['Больше половины', 'Меньше половины'],
        dndHint: 'Доли закончились.',
        y: '3/4 и 5/8 больше половины: ровно половиной были бы 2/4 и 4/8. А 1/4 и 3/8 меньше.',
        n: 'Какая запись была бы половиной для каждого знаменателя? Числитель больше неё или меньше?',
        r: 'Если числитель больше половины знаменателя, дробь больше половины.',
      }),

    /* 10 · input · 🔴 — nechta bo'lak qoldi. */
    q('10', 'Nechta bo\'lak qoldi?', '🔴', 'd24-left-parts', 'input', '🚀', ['3'],
      {
        e: 'Yakuniy mashq', s: "Tort 8 teng bo'lakka bo'lindi, mehmonlar 5 bo'lagini oldi.",
        a: 'Nechta bo\'lak qoldi?',
        y: "8 − 5 = 3 ta bo'lak. Yozuvda bu 3/8.",
        n: "Jami bo'laklar soni maxrajda turibdi. Undan olinganini ayiring.",
        r: "Qolgan qism ham kasr bilan yoziladi: 3/8.",
        p: 'Javob',
      },
      {
        e: 'Итоговое задание', s: 'Торт разделили на 8 равных частей, гости взяли 5 частей.',
        a: 'Сколько частей осталось?',
        y: '8 − 5 = 3 части. В записи это 3/8.',
        n: 'Общее число частей стоит в знаменателе. Вычти из него взятые.',
        r: 'Оставшаяся часть тоже записывается дробью: 3/8.',
        p: 'Ответ',
      }, 'numeric'),
  ],
};

export default DARS24_BANK;
