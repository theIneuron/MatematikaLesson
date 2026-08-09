// Dars 4 amaliyoti — Uch xonali sonlarni taqqoslash.
// Manba: 3-sinf darsligi (Burxonov va b., 2019), 1-bob 11-12-dars; mashq daftari 12-13-betlar.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 multi · 2 match · 3 order · 4 match · 5 multi · 6 input · 7 dnd · 8 order · 9 choice · 10 input
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS04_BANK = {
  title: 'Dars 4 · Uch xonali sonlarni taqqoslash',
  items: [

    /* 1 · multi · 🟢 — yuzliklar bo'yicha saralash. */
    q('01', '500 dan katta', '🟢', 'd04-gt-500-multi', 'multi', '📈', [1, 3],
      {
        e: 'Taqqoslash', s: "Displeyda to'rtta son. Ularni 500 bilan solishtiramiz.",
        a: 'Qaysi sonlar 500 dan KATTA? Hammasini belgilang.',
        o: ['348', '523', '267', '600'],
        y: '523 va 600 — 500 dan katta: ularda 5 yoki 6 yuzlik bor. 348 va 267 da esa 3 va 2 yuzlik.',
        n: 'Taqqoslashni eng katta razryaddan boshlang: har sonda nechta yuzlik bor?',
        r: 'Uch xonali sonlar avval yuzliklar bo\'yicha taqqoslanadi.',
      },
      {
        e: 'Сравнение', s: 'На дисплее четыре числа. Сравним их с 500.',
        a: 'Какие числа БОЛЬШЕ 500? Отметь все.',
        o: ['348', '523', '267', '600'],
        y: '523 и 600 больше 500: в них 5 и 6 сотен. А в 348 и 267 — 3 и 2 сотни.',
        n: 'Начинай сравнение со старшего разряда: сколько сотен в каждом числе?',
        r: 'Трёхзначные числа сравнивают сначала по сотням.',
      }, undefined, {
        art: { plates: ['348', '523', '267', '600'] },
        optionArt: [{ plate: '348' }, { plate: '523' }, { plate: '267' }, { plate: '600' }],
      }),

    /* 2 · match · 🟢 — juftlik va belgi. Eski D04_01, D04_02, D04_05. */
    q('02', 'Belgini tanlang', '🟢', 'd04-match-sign', 'match', '⚖️', [0, 1, 2],
      {
        e: 'Taqqoslash belgisi', s: "Uchta juftlik berilgan. Har biriga o'z belgisi kerak.",
        a: 'Har juftlikni mos belgiga ulang.',
        left: ['348 va 267', '348 va 523', '643 va 643'],
        right: ['katta', 'kichik', 'teng'],
        y: '348 > 267 (3 yuzlik 2 dan katta), 348 < 523 (3 yuzlik 5 dan kichik), 643 = 643.',
        n: 'Har juftlikda yuzliklarni solishtiring. Yuzliklar teng bo\'lsa, keyingi razryadga o\'ting.',
        r: "Sonlar razryadma-razryad, chapdan boshlab taqqoslanadi.",
      },
      {
        e: 'Знак сравнения', s: 'Даны три пары. Каждой нужен свой знак.',
        a: 'Соедини каждую пару с нужным знаком.',
        left: ['348 и 267', '348 и 523', '643 и 643'],
        right: ['больше', 'меньше', 'равно'],
        y: '348 > 267 (3 сотни больше 2), 348 < 523 (3 сотни меньше 5), 643 = 643.',
        n: 'В каждой паре сравни сотни. Если сотни равны, переходи к следующему разряду.',
        r: 'Числа сравнивают по разрядам, начиная слева.',
      }),

    /* 3 · order · 🟢 — o'sish tartibi. Eski D04_07 (sort_asc). */
    q('03', "O'sish tartibida", '🟢', 'd04-sort-asc', 'order', '🪜', [1, 0, 2],
      {
        e: 'Tartiblang', s: 'Uchta son aralashib ketgan.',
        a: 'Sonlarni kichigidan kattasiga qarab tartiblang.',
        o: ['348', '267', '523'],
        y: '267 < 348 < 523: yuzliklar 2 < 3 < 5.',
        n: 'Avval har sonning yuzligiga qarang. Eng kichik yuzlikdan boshlang.',
        r: "O'sish tartibi — kichikdan kattaga: 267, 348, 523.",
      },
      {
        e: 'Расставь по порядку', s: 'Три числа перемешались.',
        a: 'Расставь числа от меньшего к большему.',
        o: ['348', '267', '523'],
        y: '267 < 348 < 523: сотни 2 < 3 < 5.',
        n: 'Сначала посмотри на сотни каждого числа. Начни с самой маленькой сотни.',
        r: 'По возрастанию — от меньшего к большему: 267, 348, 523.',
      }, undefined, {
        art: { line: { from: 200, to: 600, values: [267, 348, 523] } },
        optionArt: [{ plate: '348' }, { plate: '267' }, { plate: '523' }],
      }),

    /* 4 · match · 🟡 — bir xil raqamlar, boshqa tartib. */
    q('04', 'Kim qayerda?', '🟡', 'd04-same-digits', 'match', '🔀', [0, 1, 2],
      {
        e: 'Bir xil raqamlar', s: "Uchta son bir xil raqamlardan tuzilgan: 9, 8 va 7.",
        a: 'Har sonni uning o\'rniga ulang.',
        left: ['987', '879', '798'],
        right: ['eng katta', "o'rtadagi", 'eng kichik'],
        y: '987 > 879 > 798: yuzliklar 9, 8 va 7 — hal qiluvchi razryad shu.',
        n: 'Bir xil raqamlardan tuzilgan sonlarda ham taqqoslash yuzlikdan boshlanadi.',
        r: "Raqamlar bir xil bo'lsa ham, ularning JOYI sonni belgilaydi: 987 > 879 > 798.",
      },
      {
        e: 'Одни и те же цифры', s: 'Три числа составлены из одних цифр: 9, 8 и 7.',
        a: 'Соедини каждое число с его местом.',
        left: ['987', '879', '798'],
        right: ['самое большое', 'среднее', 'самое маленькое'],
        y: '987 > 879 > 798: сотни 9, 8 и 7 — это и есть решающий разряд.',
        n: 'Даже когда цифры одинаковые, сравнение начинается с сотен.',
        r: 'Цифры те же, но их МЕСТО определяет число: 987 > 879 > 798.',
      }, undefined, {
        art: { plates: ['987', '879', '798'] },
        artSpotlight: [{ plate: '987', lit: 0 }, { plate: '879', lit: 0 }, { plate: '798', lit: 0 }],
        leftArt: [{ plate: '987' }, { plate: '879' }, { plate: '798' }],
      }),

    /* 5 · multi · 🟡 — 600 va 599 tuzog'i. */
    q('05', '600 dan kichik', '🟡', 'd04-lt-600-multi', 'multi', '🪤', [0, 2],
      {
        e: 'Diqqat, tuzoq', s: "To'rtta son berilgan. Ba'zilarida to'qqizlar ko'p — aldanmang.",
        a: 'Qaysi sonlar 600 dan KICHIK? Hammasini belgilang.',
        o: ['599', '606', '560', '660'],
        y: '599 va 560 — 600 dan kichik: ularda 5 yuzlik bor. 606 va 660 da esa 6 yuzlik.',
        n: "To'qqizlar ko'pligi sonni katta qilmaydi. Avval yuzliklarni solishtiring.",
        r: '599 < 600: yuzlik hal qiladi, to\'qqizlar soni emas.',
      },
      {
        e: 'Внимание, ловушка', s: 'Даны четыре числа. В некоторых много девяток — не обманись.',
        a: 'Какие числа МЕНЬШЕ 600? Отметь все.',
        o: ['599', '606', '560', '660'],
        y: '599 и 560 меньше 600: в них 5 сотен. А в 606 и 660 — 6 сотен.',
        n: 'Много девяток не делает число большим. Сначала сравни сотни.',
        r: '599 < 600: решают сотни, а не количество девяток.',
      }, undefined, {
        art: { plates: ['599', '606', '560', '660'] },
        optionArt: [{ plate: '599' }, { plate: '606' }, { plate: '560' }, { plate: '660' }],
      }),

    /* 6 · input · 🟡 — farq. Eski D04_09 (compare_diff). */
    q('06', 'Necha metr baland?', '🟡', 'd04-diff-55', 'input', '🗼', ['55'],
      {
        e: 'Ikki minora', s: 'Toshkent teleminorasi 375 metr, Eyfel minorasi 320 metr.',
        a: 'Toshkent teleminorasi Eyfel minorasidan necha metr baland?',
        y: '375 − 320 = 55: Toshkent teleminorasi 55 metr baland.',
        n: "Farqni topish uchun katta sondan kichigini ayiring. Razryadma-razryad: yuzliklar teng.",
        r: 'Farq = katta son − kichik son: 375 − 320 = 55.',
        p: 'Javob',
      },
      {
        e: 'Две башни', s: 'Ташкентская телебашня 375 метров, Эйфелева башня 320 метров.',
        a: 'На сколько метров Ташкентская телебашня выше Эйфелевой?',
        y: '375 − 320 = 55: Ташкентская телебашня выше на 55 метров.',
        n: 'Чтобы найти разницу, вычти из большего числа меньшее. По разрядам: сотни равны.',
        r: 'Разница = большее число − меньшее: 375 − 320 = 55.',
        p: 'Ответ',
      }, 'numeric', {
        art: { plates: ['375', '320'] },
      }),

    /* 7 · dnd · 🟡 — chegara bo'yicha saralash. */
    q('07', 'Chegaradan qaysi tomonda?', '🟡', 'd04-sort-500', 'dnd', '🚧', [0, 1, 0, 1],
      {
        e: 'Saralash', s: "500 chegarasi qo'yildi. Har sonni o'z rafiga joylash kerak.",
        a: 'Sonlarni ajrating: qaysilari 500 dan katta, qaysilari kichik.',
        tokens: ['519', '348', '591', '267'],
        zones: ['500 dan katta', '500 dan kichik'],
        dndHint: 'Sonlar tugadi.',
        y: '519 va 591 — 500 dan katta (5 yuzlik va yana o\'nliklar bor). 348 va 267 — kichik.',
        n: 'Har sonning yuzligiga qarang, keyin 500 bilan solishtiring.',
        r: '500 dan katta bo\'lish uchun kamida 5 yuzlik va yana biror razryad kerak.',
      },
      {
        e: 'Сортировка', s: 'Поставили границу 500. Каждое число нужно положить на свою полку.',
        a: 'Разложи числа: какие больше 500, а какие меньше.',
        tokens: ['519', '348', '591', '267'],
        zones: ['Больше 500', 'Меньше 500'],
        dndHint: 'Числа закончились.',
        y: '519 и 591 больше 500 (есть 5 сотен и ещё десятки). 348 и 267 меньше.',
        n: 'Посмотри на сотни каждого числа, потом сравни с 500.',
        r: 'Чтобы быть больше 500, нужно минимум 5 сотен и ещё какой-нибудь разряд.',
      }, undefined, {
        art: { plates: ['519', '348', '591', '267'] },
        tokenArt: [{ plate: '519' }, { plate: '348' }, { plate: '591' }, { plate: '267' }],
      }),

    /* 8 · order · 🔴 — o'sha raqamlar, boshqa joyda. Eski D04_08 (compare_trap). */
    q('08', 'Raqam joyi hal qiladi', '🔴', 'd04-order-trap', 'order', '🎢', [2, 0, 1, 3],
      {
        e: 'Diqqat, joy', s: "To'rt son bir xil raqamlardan tuzilgan: 5, 1 va 9.",
        a: 'Sonlarni kichigidan kattasiga qarab tartiblang.',
        o: ['519', '591', '195', '915'],
        y: '195 < 519 < 591 < 915. Yuzliklar 1, 5, 5 va 9; 519 bilan 591 da o\'nliklar hal qiladi.',
        n: 'Avval yuzliklarni solishtiring. Yuzliklar teng bo\'lganlarni keyin o\'nliklar bo\'yicha ajrating.',
        r: 'Bir xil raqamlardan turli sonlar chiqadi: joyi qiymatni belgilaydi.',
      },
      {
        e: 'Внимание, место', s: 'Четыре числа составлены из одних цифр: 5, 1 и 9.',
        a: 'Расставь числа от меньшего к большему.',
        o: ['519', '591', '195', '915'],
        y: '195 < 519 < 591 < 915. Сотни 1, 5, 5 и 9; у 519 и 591 решают десятки.',
        n: 'Сначала сравни сотни. Те, у кого сотни равны, разведи по десяткам.',
        r: 'Из одних цифр получаются разные числа: место определяет значение.',
      }, undefined, {
        optionArt: [{ plate: '519' }, { plate: '591' }, { plate: '195' }, { plate: '915' }],
      }),

    /* 9 · choice · 🔴 — 600 va 599. Eski D04_06, 4-chi variant qo'shildi. */
    q('09', 'Qaysi yozuv to\'g\'ri?', '🔴', 'd04-600-599', 'choice', '🧐', 0,
      {
        e: 'Diqqat, tuzoq', s: '600 va 599 sonlari solishtirilmoqda.',
        a: "600 va 599 uchun nima to'g'ri?",
        o: ['600 katta', '599 katta', 'Ular teng', 'Solishtirib bo\'lmaydi'],
        y: '600 > 599: 6 yuzlik 5 yuzlikdan katta. Sanashda 599 dan keyin 600 keladi.',
        n: 'Katta raqamlar ko\'p bo\'lgani son katta degani emas. Yuzliklarni solishtiring.',
        by: [
          undefined,
          "To'qqizlar ko'p bo'lsa ham, 599 da atigi 5 yuzlik bor. 600 da nechta?",
          "Ikkala son teng bo'lsa, sanashda ular bir joyda turardi. 599 dan keyin qaysi son keladi?",
          "Har qanday ikki sonni solishtirish mumkin: razryadma-razryad, chapdan boshlab.",
        ],
        r: '600 > 599: sanashda 599 dan keyin 600 keladi.',
      },
      {
        e: 'Внимание, ловушка', s: 'Сравнивают числа 600 и 599.',
        a: 'Что верно для 600 и 599?',
        o: ['600 больше', '599 больше', 'Они равны', 'Сравнить нельзя'],
        y: '600 > 599: 6 сотен больше 5 сотен. При счёте после 599 идёт 600.',
        n: 'Много больших цифр не значит, что число больше. Сравни сотни.',
        by: [
          undefined,
          'Девяток много, но в 599 всего 5 сотен. А в 600 сколько?',
          'Если бы числа были равны, они стояли бы на одном месте при счёте. Какое число идёт после 599?',
          'Любые два числа можно сравнить: по разрядам, начиная слева.',
        ],
        r: '600 > 599: при счёте после 599 идёт 600.',
      }, undefined, {
        art: { plates: ['600', '599'] },
      }),

    /* 10 · input · 🔴 — KOMBINATORIKA. Eski D04_10 (digits_max). */
    q('10', 'Eng katta son', '🔴', 'd04-combi-max', 'input', '🚀', ['951'],
      {
        e: 'Yakuniy mashq', s: 'Uchta raqam-karta berilgan: 5, 1 va 9.',
        a: 'Shu kartalardan yasash mumkin bo\'lgan ENG KATTA uch xonali sonni yozing.',
        y: 'Eng kattasi — 951: eng katta raqam (9) yuzlikka, keyingisi (5) o\'nlikka.',
        n: 'Son katta bo\'lishi uchun eng katta raqam eng qimmat joyda turishi kerak.',
        r: 'Raqamlar kamayish tartibida terilsa, eng katta son chiqadi: 9, 5, 1 → 951.',
        p: 'Javob',
      },
      {
        e: 'Итоговое задание', s: 'Даны три карточки с цифрами: 5, 1 и 9.',
        a: 'Запиши САМОЕ БОЛЬШОЕ трёхзначное число, которое можно сложить из этих карточек.',
        y: 'Самое большое — 951: самая большая цифра (9) в сотни, следующая (5) в десятки.',
        n: 'Чтобы число было большим, самая большая цифра должна стоять на самом дорогом месте.',
        r: 'Если ставить цифры по убыванию, получится самое большое число: 9, 5, 1 → 951.',
        p: 'Ответ',
      }, 'numeric', {
        art: { plates: ['5', '1', '9'] },
      }),
  ],
};

export default DARS04_BANK;
