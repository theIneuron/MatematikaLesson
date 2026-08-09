// Dars 31 amaliyoti — O'nli kasrlar.
// Nazariya: src/components/grade3/Dars31.jsx (num-3-31).
// Butun o'nta teng bo'lakka bo'linsa, bitta bo'lak 1/10, u vergul bilan 0,1 deb yoziladi.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 choice · 2 match · 3 choice · 4 multi · 5 match · 6 input · 7 dnd · 8 multi · 9 input · 10 order
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS31_BANK = {
  title: "Dars 31 · O'nli kasrlar",
  items: [

    /* 1 · choice · 🟢 — bitta bo'lak. */
    q('01', 'Bitta bo\'lak', '🟢', 'd31-one-tenth', 'choice', '🎯', 2,
      {
        e: 'Tasma', s: "Tasma o'nta teng bo'lakka bo'lingan. Bitta bo'lak bo'yaldi.",
        a: 'Bo\'yalgan qismni vergul bilan qanday yozamiz?',
        o: ['1,0', '0,10', '0,1', '1,10'],
        y: "Bitta bo'lak bu o'ndan bir. U 0,1 deb yoziladi va nol butun o'ndan bir deb o'qiladi.",
        n: "Butun bo'lak bormi? Vergul oldida nima turishi kerak?",
        by: [
          "Bu bitta butun tasma. Bizda esa bitta kichik bo'lak bor.",
          "Tasma o'nga kesilgan, yuzga emas. Verguldan keyin bitta raqam bo'ladi.",
          undefined,
          "Vergul oldida butunlar turadi, butun tasma esa bizda yo'q.",
        ],
        r: "Vergulning chapida butunlar, o'ngida o'ndan bo'laklar turadi.",
      },
      {
        e: 'Лента', s: 'Лента разделена на десять равных частей. Закрасили одну часть.',
        a: 'Как записать закрашенную часть с запятой?',
        o: ['1,0', '0,10', '0,1', '1,10'],
        y: 'Одна часть это одна десятая. Она пишется 0,1 и читается ноль целых одна десятая.',
        n: 'Есть ли целая часть? Что должно стоять перед запятой?',
        by: [
          'Это одна целая лента. А у нас одна маленькая часть.',
          'Лента разрезана на десять, а не на сто. После запятой будет одна цифра.',
          undefined,
          'Перед запятой стоят целые, а целой ленты у нас нет.',
        ],
        r: 'Слева от запятой целые, справа десятые части.',
      }),

    /* 2 · match · 🟢 — kasr va vergulli yozuv. */
    q('02', 'Ikki xil yozuv', '🟢', 'd31-match-forms', 'match', '🔗', [0, 1, 2],
      {
        e: 'Bir xil son', s: "Bitta sonni maxrajli ham, vergulli ham yozish mumkin.",
        a: 'Har kasrni uning vergulli yozuviga ulang.',
        left: ['1/10', '3/10', '7/10'],
        right: ['0,1', '0,3', '0,7'],
        y: "Surat verguldan keyin turadi, maxraj 10 esa vergulning o'zi bilan ko'rsatiladi.",
        n: "Maxraji 10 bo'lgan kasrda surat verguldan keyin yoziladi.",
        r: "Maxraji 10 bo'lgan kasr vergul bilan yoziladi.",
      },
      {
        e: 'Одно и то же число', s: 'Одно число можно записать и со знаменателем, и с запятой.',
        a: 'Соедини каждую дробь с её записью через запятую.',
        left: ['1/10', '3/10', '7/10'],
        right: ['0,1', '0,3', '0,7'],
        y: 'Числитель стоит после запятой, а знаменатель 10 показан самой запятой.',
        n: 'У дроби со знаменателем 10 числитель пишется после запятой.',
        r: 'Дробь со знаменателем 10 записывают через запятую.',
      }),

    /* 3 · choice · 🟢 — verguldan keyingi raqam. */
    q('03', 'Verguldan keyin', '🟢', 'd31-after-comma', 'choice', '🔒', 1,
      {
        e: 'Yozuvni o\'qiymiz', s: '0,6 yozuvi berilgan.',
        a: 'Verguldan keyingi raqam nimani ko\'rsatadi?',
        o: ['Butunlar sonini', "O'ndan nechtasi olinganini", 'Necha bo\'lakka bo\'linganini', 'Qolgan bo\'laklarni'],
        y: "Verguldan keyin oltita o'ndan bo'lak olinganini ko'rsatadi, ya'ni 6/10.",
        n: "Vergulning qaysi tomonida butunlar, qaysi tomonida bo'laklar turadi?",
        by: [
          'Butunlar vergulning chap tomonida turadi.',
          undefined,
          "Bo'linish soni verguldan ko'rinadi: bitta raqam bo'lsa, o'nga bo'lingan.",
          "Bu olingan bo'laklar soni, qolgani emas.",
        ],
        r: "Verguldan keyingi raqam nechta o'ndan bo'lak olinganini bildiradi.",
      },
      {
        e: 'Читаем запись', s: 'Дана запись 0,6.',
        a: 'Что показывает цифра после запятой?',
        o: ['Количество целых', 'Сколько десятых взяли', 'На сколько частей разделили', 'Сколько частей осталось'],
        y: 'После запятой показано, что взяли шесть десятых частей, то есть 6/10.',
        n: 'С какой стороны от запятой стоят целые, а с какой части?',
        by: [
          'Целые стоят слева от запятой.',
          undefined,
          'На сколько разделили, видно по самой запятой: одна цифра значит на десять.',
          'Это количество взятых частей, а не оставшихся.',
        ],
        r: 'Цифра после запятой показывает, сколько взято десятых частей.',
      }),

    /* 4 · multi · 🟡 — 0,4 ga teng yozuvlar. */
    q('04', '0,4 ga teng', '🟡', 'd31-equal-04', 'multi', '🎯', [0, 2],
      {
        e: 'Bir xil qiymat', s: "To'rtta yozuv. Ikkitasi 0,4 ni bildiradi.",
        a: 'Qaysi yozuvlar 0,4 ga teng? Hammasini belgilang.',
        o: ['4/10', '4/100', "O'nta bo'lakdan to'rttasi", "To'rtta bo'lakdan bittasi"],
        y: "4/10 va o'nta bo'lakdan to'rttasi bu aynan 0,4.",
        n: "0,4 da butun nechta bo'lakka bo'lingan va nechtasi olingan?",
        r: "0,4 bu 4/10, ya'ni o'nta bo'lakdan to'rttasi.",
      },
      {
        e: 'Одинаковое значение', s: 'Четыре записи. Две из них означают 0,4.',
        a: 'Какие записи равны 0,4? Отметь все.',
        o: ['4/10', '4/100', 'Четыре части из десяти', 'Одна часть из четырёх'],
        y: '4/10 и четыре части из десяти это и есть 0,4.',
        n: 'В 0,4 на сколько частей разделено целое и сколько взято?',
        r: '0,4 это 4/10, то есть четыре части из десяти.',
      }),

    /* 5 · match · 🟡 — yozuv va o'qilishi. */
    q('05', 'Qanday o\'qiladi', '🟡', 'd31-match-read', 'match', '🗣️', [0, 1, 2],
      {
        e: 'Ovoz chiqarib', s: 'Vergulli sonlar maxsus tartibda o\'qiladi.',
        a: 'Har yozuvni uning o\'qilishiga ulang.',
        left: ['0,5', '1,5', '2,0'],
        right: ["Nol butun o'ndan besh", "Bir butun o'ndan besh", 'Ikki butun'],
        y: "Avval butunlar, keyin o'ndan bo'laklar aytiladi.",
        n: 'Vergul oldidagi son butunlarni bildiradi.',
        r: "Vergulli son avval butunlar, keyin o'ndan bo'laklar deb o'qiladi.",
      },
      {
        e: 'Вслух', s: 'Числа с запятой читают в особом порядке.',
        a: 'Соедини каждую запись с её чтением.',
        left: ['0,5', '1,5', '2,0'],
        right: ['Ноль целых пять десятых', 'Одна целая пять десятых', 'Две целых'],
        y: 'Сначала называют целые, потом десятые части.',
        n: 'Число перед запятой обозначает целые.',
        r: 'Число с запятой читают: сначала целые, потом десятые.',
      }),

    /* 6 · input · 🟡 — nechta bo'lak. */
    q('06', 'Nechta bo\'lak', '🟡', 'd31-count-parts', 'input', '🔢', ['9'],
      {
        e: 'Tasma yana', s: "Tasma o'nta teng bo'lakka bo'lingan, bo'yalgan qismi 0,9.",
        a: 'Nechta bo\'lak bo\'yalgan?',
        y: "0,9 bu 9/10, demak to'qqizta bo'lak bo'yalgan.",
        n: 'Verguldan keyingi raqamga qarang.',
        r: "0,9 bu o'nta bo'lakdan to'qqiztasi.",
        p: 'Javob',
      },
      {
        e: 'Снова лента', s: 'Лента разделена на десять равных частей, закрашенная часть 0,9.',
        a: 'Сколько частей закрашено?',
        y: '0,9 это 9/10, значит закрашено девять частей.',
        n: 'Посмотри на цифру после запятой.',
        r: '0,9 это девять частей из десяти.',
        p: 'Ответ',
      }, 'numeric'),

    /* 7 · dnd · 🟡 — yarimdan katta yoki kichik. */
    q('07', 'Yarimga nisbatan', '🟡', 'd31-vs-half', 'dnd', '⚖️', [1, 0, 1, 0],
      {
        e: 'Yarim bu 0,5', s: "Tasmaning yarmi beshta bo'lak, ya'ni 0,5.",
        a: 'Sonlarni ajrating: qaysilari yarmidan katta, qaysilari kichik.',
        tokens: ['0,2', '0,8', '0,3', '0,7'],
        zones: ['Yarimdan katta', 'Yarimdan kichik'],
        dndHint: 'Sonlar tugadi.',
        y: "0,8 va 0,7 da bo'laklar beshtadan ko'p, 0,2 va 0,3 da esa kam.",
        n: "Verguldan keyingi raqamni 5 bilan solishtiring.",
        r: "Maxraj bir xil bo'lsa, verguldan keyingi raqam katta bo'lgan son kattaroq.",
      },
      {
        e: 'Половина это 0,5', s: 'Половина ленты это пять частей, то есть 0,5.',
        a: 'Разложи числа: какие больше половины, а какие меньше.',
        tokens: ['0,2', '0,8', '0,3', '0,7'],
        zones: ['Больше половины', 'Меньше половины'],
        dndHint: 'Числа закончились.',
        y: 'У 0,8 и 0,7 частей больше пяти, а у 0,2 и 0,3 меньше.',
        n: 'Сравни цифру после запятой с числом 5.',
        r: 'При одинаковом знаменателе больше то число, у которого цифра после запятой больше.',
      }),

    /* 8 · multi · 🔴 — to'g'ri yozuvlar. */
    q('08', 'To\'g\'ri yozuv', '🔴', 'd31-valid', 'multi', '🔎', [1, 3],
      {
        e: 'Xatoni toping', s: "To'rtta juftlik. Ikkitasida yozuv to'g'ri.",
        a: 'Qaysi juftliklar to\'g\'ri? Hammasini belgilang.',
        o: ['2/10 = 2,10', '2/10 = 0,2', '6/10 = 6,10', '6/10 = 0,6'],
        y: "Maxraji 10 bo'lgan kasrda surat verguldan keyin turadi, maxraj esa yozilmaydi.",
        n: "Maxraj 10 vergulning o'zi bilan ko'rsatiladi, alohida yozilmaydi.",
        r: "n/10 kasr 0,n shaklida yoziladi.",
      },
      {
        e: 'Найди ошибку', s: 'Четыре пары. В двух запись верная.',
        a: 'Какие пары верные? Отметь все.',
        o: ['2/10 = 2,10', '2/10 = 0,2', '6/10 = 6,10', '6/10 = 0,6'],
        y: 'У дроби со знаменателем 10 числитель стоит после запятой, а знаменатель не пишут.',
        n: 'Знаменатель 10 показан самой запятой, отдельно его не пишут.',
        r: 'Дробь n/10 записывают как 0,n.',
      }),

    /* 9 · input · 🔴 — butun va bo'lak. */
    // Javob vergulli — NumPad da shu dars uchun vergul tugmasi ochiladi (LessonNumPad `comma`).
    q('09', 'Butun bilan', '🔴', 'd31-with-whole', 'input', '🧩', ['1,4'],
      {
        e: 'Ikkita tasma', s: "Bitta butun tasma va yana o'nta bo'lakli tasmadan to'rttasi bor.",
        a: 'Hammasi bo\'lib qancha? Vergul bilan yozing.',
        y: "Bitta butun va to'rtta o'ndan bo'lak, ya'ni 1,4.",
        n: 'Vergul oldiga butunlar, keyin esa bo\'laklar soni yoziladi.',
        r: 'Butun ham bo\'lsa, u vergulning chap tomoniga yoziladi.',
        p: 'Javob',
      },
      {
        e: 'Две ленты', s: 'Есть одна целая лента и ещё четыре части из десяти.',
        a: 'Сколько всего? Запиши с запятой.',
        y: 'Одно целое и четыре десятых, то есть 1,4.',
        n: 'Перед запятой пишут целые, после неё количество частей.',
        r: 'Если есть целое, оно пишется слева от запятой.',
        p: 'Ответ',
      }, 'decimal'),

    /* 10 · order · 🔴 — o'sish tartibi. */
    q('10', 'O\'sish tartibi', '🔴', 'd31-sort', 'order', '🚀', [1, 3, 0, 2],
      {
        e: 'Yakuniy mashq', s: "To'rtta vergulli son aralashgan.",
        a: 'Sonlarni kichigidan kattasiga tartiblang.',
        o: ['0,9', '0,2', '1,1', '0,6'],
        y: "0,2 keyin 0,6 keyin 0,9, oxirida 1,1 — chunki unda butun bor.",
        n: "Avval butunlarga qarang, butunlar teng bo'lsa verguldan keyingi raqamga.",
        r: 'Vergulli sonlar avval butunlar, keyin bo\'laklar bo\'yicha solishtiriladi.',
      },
      {
        e: 'Итоговое задание', s: 'Четыре числа с запятой перепутались.',
        a: 'Расставь числа от меньшего к большему.',
        o: ['0,9', '0,2', '1,1', '0,6'],
        y: '0,2 потом 0,6 потом 0,9, а в конце 1,1 — у него есть целая часть.',
        n: 'Сначала смотри на целые, а при равных целых на цифру после запятой.',
        r: 'Числа с запятой сравнивают сначала по целым, потом по частям.',
      }),
  ],
};

export default DARS31_BANK;
