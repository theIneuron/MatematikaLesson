// Dars 26 amaliyoti — Ulushlarni taqqoslash.
// Nazariya: src/components/grade3/Dars26.jsx (num-3-26).
// Bitta butunning ulushlari maxraj bo'yicha taqqoslanadi: maxraj kichik — ulush yirik.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 match · 2 order · 3 dnd · 4 choice · 5 multi · 6 dnd · 7 match · 8 input · 9 multi · 10 choice
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS26_BANK = {
  title: 'Dars 26 · Ulushlarni taqqoslash',
  items: [

    /* 1 · match · 🟢 — juftlik va belgi. */
    q('01', 'Belgini tanlang', '🟢', 'd26-match-sign', 'match', '⚖️', [0, 1, 2],
      {
        e: 'Uch juftlik', s: "Bitta butunning ulushlari taqqoslanmoqda.",
        a: 'Har juftlikni mos belgiga ulang.',
        left: ['1/4 va 1/8', '1/8 va 1/4', '1/4 va 1/4'],
        right: ['katta', 'kichik', 'teng'],
        y: "1/4 > 1/8: butun 4 ga bo'linsa, bo'laklar yirikroq bo'ladi.",
        n: "Maxrajga qarang: qaysi butun kamroq bo'lakka bo'lingan? O'sha bo'lak yirik.",
        r: "Maxraj kichik bo'lsa, ulush yirik bo'ladi.",
      },
      {
        e: 'Три пары', s: 'Сравниваются доли одного и того же целого.',
        a: 'Соедини каждую пару с нужным знаком.',
        left: ['1/4 и 1/8', '1/8 и 1/4', '1/4 и 1/4'],
        right: ['больше', 'меньше', 'равно'],
        y: '1/4 > 1/8: если целое разделить на 4, части выйдут крупнее.',
        n: 'Смотри на знаменатель: где целое разделили на меньше частей? Та часть и крупнее.',
        r: 'Чем меньше знаменатель, тем крупнее доля.',
      }),

    /* 2 · order · 🟢 — ulushlar tartibi. */
    q('02', 'Kichigidan kattasiga', '🟢', 'd26-order-parts', 'order', '📈', [0, 2, 1],
      {
        e: 'Uch ulush', s: "Bitta tortning uch xil ulushi.",
        a: 'Ulushlarni kichigidan kattasiga qarab tartiblang.',
        o: ['1/8', '1/2', '1/4'],
        y: '1/8 < 1/4 < 1/2: maxraj qancha katta bo\'lsa, ulush shuncha kichik.',
        n: "Ulush kichik bo'lishi uchun butun ko'proq bo'lakka bo'linishi kerak.",
        r: "Maxraj o'sganda ulush kichrayadi.",
      },
      {
        e: 'От меньшей к большей', s: 'Три разные доли одного торта.',
        a: 'Расставь доли от меньшей к большей.',
        o: ['1/8', '1/2', '1/4'],
        y: '1/8 < 1/4 < 1/2: чем больше знаменатель, тем меньше доля.',
        n: 'Чтобы доля была меньше, целое должно быть разделено на больше частей.',
        r: 'Когда знаменатель растёт, доля уменьшается.',
      }),

    /* 3 · dnd · 🟢 — 1/4 dan katta yoki kichik. */
    q('03', '1/4 bilan solishtiring', '🟢', 'd26-vs-quarter', 'dnd', '🗂️', [0, 1, 1, 0],
      {
        e: 'Chorak bilan', s: "To'rtta ulush. Har birini 1/4 bilan solishtiring.",
        a: 'Ulushlarni ajrating: qaysilari 1/4 dan katta, qaysilari kichik.',
        tokens: ['1/2', '1/8', '1/12', '1/3'],
        zones: ['1/4 dan katta', '1/4 dan kichik'],
        dndHint: 'Ulushlar tugadi.',
        y: '1/2 va 1/3 — maxraji 4 dan kichik, demak ulush yirik. 1/8 va 1/12 — maxraji katta, ulush mayda.',
        n: 'Maxrajni 4 bilan solishtiring: kichik bo\'lsa ulush yirik.',
        r: "Maxraj kichik — ulush yirik, maxraj katta — ulush mayda.",
      },
      {
        e: 'Сравни с четвертью', s: 'Четыре доли. Сравни каждую с 1/4.',
        a: 'Разложи доли: какие больше 1/4, а какие меньше.',
        tokens: ['1/2', '1/8', '1/12', '1/3'],
        zones: ['Больше 1/4', 'Меньше 1/4'],
        dndHint: 'Доли закончились.',
        y: 'У 1/2 и 1/3 знаменатель меньше 4, значит доля крупнее. У 1/8 и 1/12 знаменатель больше, доля мельче.',
        n: 'Сравни знаменатель с 4: если меньше — доля крупнее.',
        r: 'Меньше знаменатель — крупнее доля, больше знаменатель — мельче доля.',
      }),

    /* 4 · choice · 🟡 — tuzoq: katta maxraj. */
    q('04', 'Diqqat, tuzoq', '🟡', 'd26-trap', 'choice', '🪤', 1,
      {
        e: 'Katta son — katta ulushmi?', s: "Ikki ulush: 1/5 va 1/9. Maxrajlar turlicha.",
        a: 'Qaysi ulush yirikroq?',
        o: ['1/9, chunki 9 katta', '1/5, chunki 5 kichik', 'Teng', 'Aniqlab bo\'lmaydi'],
        y: "Butun 5 ga bo'linsa, bo'laklar yirik; 9 ga bo'linsa, mayda. 1/5 > 1/9.",
        n: "Maxrajdagi katta son bo'lak kattaligini emas, bo'laklar SONINI bildiradi.",
        by: [
          "Maxrajdagi katta son bo'laklar KO'P ekanini bildiradi, ular esa mayda chiqadi.",
          undefined,
          "Butun bir xil, lekin bo'laklar soni har xil, demak kattaligi ham har xil.",
          "Ikkala ulush ham bitta butundan, shuning uchun solishtirish mumkin.",
        ],
        r: "Maxraj kichik bo'lsa, ulush yirik: 1/5 > 1/9.",
      },
      {
        e: 'Больше число — больше доля?', s: 'Две доли: 1/5 и 1/9. Знаменатели разные.',
        a: 'Какая доля крупнее?',
        o: ['1/9, потому что 9 больше', '1/5, потому что 5 меньше', 'Равны', 'Определить нельзя'],
        y: 'Если целое разделить на 5, части крупные; на 9 — мелкие. 1/5 > 1/9.',
        n: 'Большое число в знаменателе означает не размер части, а КОЛИЧЕСТВО частей.',
        by: [
          'Большое число в знаменателе означает, что частей МНОГО, а они выходят мелкими.',
          undefined,
          'Целое одно и то же, но число частей разное, значит и размер разный.',
          'Обе доли от одного целого, поэтому их можно сравнить.',
        ],
        r: 'Чем меньше знаменатель, тем крупнее доля: 1/5 > 1/9.',
      }),

    /* 5 · multi · 🟡 — 1/2 dan kichiklar. */
    q('05', 'Yarmidan kichik', '🟡', 'd26-lt-half', 'multi', '🎯', [1, 2, 3],
      {
        e: 'Yarim bilan', s: "To'rtta ulush. Ba'zilari yarmidan kichik.",
        a: 'Qaysi ulushlar 1/2 dan KICHIK? Hammasini belgilang.',
        o: ['1/2', '1/3', '1/4', '1/8'],
        y: "1/3, 1/4 va 1/8 — maxraji 2 dan katta, demak ulush yarimdan kichik.",
        n: 'Maxrajni 2 bilan solishtiring: katta bo\'lsa ulush yarimdan kichik.',
        r: "Maxraj 2 dan katta bo'lsa, bitta ulush yarmidan kichik bo'ladi.",
      },
      {
        e: 'Меньше половины', s: 'Четыре доли. Некоторые меньше половины.',
        a: 'Какие доли МЕНЬШЕ 1/2? Отметь все.',
        o: ['1/2', '1/3', '1/4', '1/8'],
        y: 'У 1/3, 1/4 и 1/8 знаменатель больше 2, значит доля меньше половины.',
        n: 'Сравни знаменатель с 2: если больше — доля меньше половины.',
        r: 'Если знаменатель больше 2, одна доля меньше половины.',
      }),

    /* 6 · dnd · 🟡 — bir xil maxrajli. */
    q('06', 'Bir xil bo\'laklar', '🟡', 'd26-same-denom', 'dnd', '🔀', [1, 0, 1, 0],
      {
        e: 'Maxraj bir xil', s: "To'rtta kasrda maxraj bir xil: 8. Ularni 4/8 bilan solishtiring.",
        a: 'Kasrlarni ajrating: qaysilari 4/8 dan katta, qaysilari kichik.',
        tokens: ['2/8', '6/8', '3/8', '7/8'],
        zones: ['4/8 dan katta', '4/8 dan kichik'],
        dndHint: 'Kasrlar tugadi.',
        y: "Bo'laklar bir xil kattalikda, shuning uchun faqat suratlarni sanaymiz: 6 va 7 katta, 2 va 3 kichik.",
        n: 'Maxraj bir xil bo\'lsa, faqat chiziq ustidagi sonlarni solishtiring.',
        r: 'Maxraj bir xil bo\'lsa, suratni solishtiramiz.',
      },
      {
        e: 'Части одинаковые', s: 'У четырёх дробей одинаковый знаменатель: 8. Сравни их с 4/8.',
        a: 'Разложи дроби: какие больше 4/8, а какие меньше.',
        tokens: ['2/8', '6/8', '3/8', '7/8'],
        zones: ['Больше 4/8', 'Меньше 4/8'],
        dndHint: 'Дроби закончились.',
        y: 'Части одинакового размера, поэтому считаем только числители: 6 и 7 больше, 2 и 3 меньше.',
        n: 'Если знаменатель одинаковый, сравнивай только числа над чертой.',
        r: 'При одинаковом знаменателе сравниваем числители.',
      }),

    /* 7 · match · 🟡 — kasr va uning tavsifi. */
    q('07', 'Kasr va tavsif', '🟡', 'd26-match-desc', 'match', '📖', [0, 1, 2],
      {
        e: 'Qanday qism?', s: "Uchta kasr. Har biri butunning qanday qismi ekanini ayting.",
        a: 'Har kasrni uning tavsifiga ulang.',
        left: ['1/2', '1/4', '3/4'],
        right: ['aynan yarmi', 'yarmidan kichik', 'yarmidan katta'],
        y: "1/2 — aynan yarim. 1/4 yarmidan kichik. 3/4 esa yarmidan katta, chunki 2/4 yarim bo'lardi.",
        n: 'Har kasr uchun yarim qaysi yozuv bo\'lardi? Surat undan katta yoki kichikmi?',
        r: "Surat maxrajning yarmiga teng bo'lsa, kasr aynan yarim bo'ladi.",
      },
      {
        e: 'Какая часть?', s: 'Три дроби. Скажи, какой частью целого является каждая.',
        a: 'Соедини каждую дробь с её описанием.',
        left: ['1/2', '1/4', '3/4'],
        right: ['ровно половина', 'меньше половины', 'больше половины'],
        y: '1/2 — ровно половина. 1/4 меньше половины. А 3/4 больше половины, ведь половиной было бы 2/4.',
        n: 'Какая запись была бы половиной для каждой дроби? Числитель больше неё или меньше?',
        r: 'Если числитель равен половине знаменателя, дробь равна ровно половине.',
      }),

    /* 8 · input · 🔴 — nechta mayda bo'lak. */
    q('08', 'Nechta mayda bo\'lak?', '🔴', 'd26-how-many-small', 'input', '🔢', ['2'],
      {
        e: 'Bir yirik — nechta mayda?', s: "Tasma 4 ga ham, 8 ga ham bo'lingan.",
        a: 'Bitta 1/4 bo\'lakda nechta 1/8 bo\'lak bor?',
        y: "8 : 4 = 2. Bitta chorakda ikkita sakkizdan bir bor: 1/4 = 2/8.",
        n: "8 ta mayda bo'lakni 4 ta yirik bo'lakka teng taqsimlang.",
        r: '1/4 = 2/8: yirik bo\'lak ikkita mayda bo\'lakdan iborat.',
        p: 'Javob',
      },
      {
        e: 'Одна крупная — сколько мелких?', s: 'Ленту разделили и на 4, и на 8 частей.',
        a: 'Сколько частей по 1/8 помещается в одной части 1/4?',
        y: '8 : 4 = 2. В одной четверти две восьмых: 1/4 = 2/8.',
        n: 'Раздели 8 мелких частей поровну между 4 крупными.',
        r: '1/4 = 2/8: крупная часть состоит из двух мелких.',
        p: 'Ответ',
      }, 'numeric'),

    /* 9 · multi · 🔴 — teng yozuvlar. */
    q('09', 'Teng yozuvlar', '🔴', 'd26-equal-forms', 'multi', '⚖️', [0, 2],
      {
        e: '1/2 ga teng', s: "To'rtta yozuv. Ikkitasi aynan yarmiga teng.",
        a: 'Qaysi yozuvlar 1/2 ga TENG? Hammasini belgilang.',
        o: ['2/4', '3/4', '4/8', '3/8'],
        y: "2/4 va 4/8 — surat maxrajning yarmiga teng, demak bu yarim.",
        n: 'Har kasrda suratni maxrajning yarmi bilan solishtiring.',
        r: "Surat maxrajning yarmi bo'lsa, kasr yarimga teng.",
      },
      {
        e: 'Равно 1/2', s: 'Четыре записи. Две равны ровно половине.',
        a: 'Какие записи РАВНЫ 1/2? Отметь все.',
        o: ['2/4', '3/4', '4/8', '3/8'],
        y: 'У 2/4 и 4/8 числитель равен половине знаменателя, значит это половина.',
        n: 'В каждой дроби сравни числитель с половиной знаменателя.',
        r: 'Если числитель — половина знаменателя, дробь равна половине.',
      }),

    /* 10 · choice · 🔴 — masala. */
    q('10', 'Kimga ko\'p tegdi?', '🔴', 'd26-story', 'choice', '🚀', 1,
      {
        e: 'Yakuniy mashq', s: "Bir xil ikki tort. Birinchisi 6 ta, ikkinchisi 8 ta teng bo'lakka bo'lindi. Anvar birinchisidan bitta, Zuhra ikkinchisidan bitta bo'lak oldi.",
        a: 'Kimga ko\'proq tort tegdi?',
        o: ['Zuhraga', 'Anvarga', 'Teng tegdi', 'Aniqlab bo\'lmaydi'],
        y: "Anvarda 1/6, Zuhrada 1/8. Maxraj kichik bo'lgani uchun 1/6 yirikroq.",
        n: "Tortlar bir xil. Qaysi tort kamroq bo'lakka bo'lingan? O'sha bo'lak yirik.",
        by: [
          "Zuhraning torti ko'proq bo'lakka bo'lingan, demak har bo'lak mayda.",
          undefined,
          "Bo'laklar soni har xil: 6 va 8. Demak bo'lak kattaligi ham har xil.",
          "Tortlar bir xil va bo'laklar teng, shuning uchun solishtirish mumkin.",
        ],
        r: 'Bitta butunning ulushlari maxraj bo\'yicha taqqoslanadi: 1/6 > 1/8.',
      },
      {
        e: 'Итоговое задание', s: 'Два одинаковых торта. Первый разрезали на 6 равных частей, второй на 8. Анвар взял кусок от первого, Зухра — от второго.',
        a: 'Кому досталось больше торта?',
        o: ['Зухре', 'Анвару', 'Поровну', 'Определить нельзя'],
        y: 'У Анвара 1/6, у Зухры 1/8. Знаменатель меньше, значит 1/6 крупнее.',
        n: 'Торты одинаковые. Какой торт разрезали на меньше частей? Та часть и крупнее.',
        by: [
          'Торт Зухры разрезали на больше частей, значит каждая часть мельче.',
          undefined,
          'Число частей разное: 6 и 8. Значит и размер части разный.',
          'Торты одинаковые и части равные, поэтому сравнить можно.',
        ],
        r: 'Доли одного целого сравнивают по знаменателю: 1/6 > 1/8.',
      }),
  ],
};

export default DARS26_BANK;
