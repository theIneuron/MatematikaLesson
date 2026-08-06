// Dars 3 amaliyoti — Razryad qo'shiluvchilari.
// Manba: 3-sinf darsligi (Burxonov va b., 2019), 1-bob 7-10-dars; mashq daftari 9-11-betlar.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 input · 2 choice · 3 dnd · 4 multi · 5 dnd · 6 match · 7 choice · 8 input · 9 order · 10 match
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS03_BANK = {
  title: "Dars 3 · Razryad qo'shiluvchilari",
  items: [

    /* 1 · input · 🟢 — yoyilmadan son. Eski D03_02 (compose_sum). */
    q('01', "Yig'indini toping", '🟢', 'd03-compose-446', 'input', '🧮', ['446'],
      {
        e: "Yig'indini toping", s: "Displeyda razryad qo'shiluvchilari yig'indisi turibdi.",
        a: "400 + 40 + 6 — qanday son hosil bo'ladi?",
        y: "400 + 40 + 6 = 446: yuzlik, o'nlik va birlik o'z joyiga tushdi.",
        n: "400 — yuzliklar, 40 — o'nliklar, 6 — birliklar. Har birini o'z razryad katagiga qo'ying.",
        r: "Yoyilmadan son yig'iladi: 400 + 40 + 6 = 446.",
        p: 'Javob',
      },
      {
        e: 'Найди сумму', s: 'На дисплее сумма разрядных слагаемых.',
        a: '400 + 40 + 6 — какое число получится?',
        y: '400 + 40 + 6 = 446: сотни, десятки и единицы встали на свои места.',
        n: '400 — сотни, 40 — десятки, 6 — единицы. Поставь каждое в свою разрядную клетку.',
        r: 'Из разложения собирается число: 400 + 40 + 6 = 446.',
        p: 'Ответ',
      }, 'numeric', {
        art: { pv: { h: 4, t: 4, o: 6 }, captions: { h: 'yuzlik', t: "o'nlik", o: 'birlik' } },
      }),

    /* 2 · choice · 🟢 — yoyilma. Eski D03_01 (decompose), 4-chi variant qo'shildi. */
    q('02', 'Yoyilmani toping', '🟢', 'd03-decompose-427', 'choice', '🔍', 0,
      {
        e: "Razryad qo'shiluvchilari", s: "Displeyda 427 soni. Uni razryad qo'shiluvchilariga ajratamiz.",
        a: '427 sonining yoyilmasi qaysi?',
        o: ['400 + 20 + 7', '400 + 2 + 7', '40 + 20 + 7', '4 + 2 + 7'],
        y: "427 = 400 + 20 + 7: to'rt yuzlik, ikki o'nlik, yetti birlik.",
        n: "Har raqamning QIYMATINI oling: 4 yuzliklar joyida, 2 o'nliklar joyida.",
        by: [
          undefined,
          "Bu yerda 2 birlik bo'lib qolgan. 2 raqami 427 da qaysi razryadda turibdi?",
          "Bu yerda yuzlik yo'qolgan. 4 raqamining qiymati qancha?",
          "Bu yerda raqamlarning o'zi qo'shilgan. Ularni qo'shsangiz 427 qaytadimi?",
        ],
        r: "Yoyilmada har raqam o'z qiymati bilan yoziladi: 427 = 400 + 20 + 7.",
      },
      {
        e: 'Разрядные слагаемые', s: 'На дисплее число 427. Разложим его на разрядные слагаемые.',
        a: 'Какое разложение числа 427 верно?',
        o: ['400 + 20 + 7', '400 + 2 + 7', '40 + 20 + 7', '4 + 2 + 7'],
        y: '427 = 400 + 20 + 7: четыре сотни, два десятка, семь единиц.',
        n: 'Бери ЗНАЧЕНИЕ каждой цифры: 4 стоит на месте сотен, 2 — на месте десятков.',
        by: [
          undefined,
          'Здесь получилось 2 единицы. В каком разряде стоит цифра 2 в числе 427?',
          'Здесь потерялись сотни. Сколько стоит цифра 4?',
          'Здесь сложены сами цифры. Если их сложить, вернётся ли 427?',
        ],
        r: 'В разложении каждая цифра записывается со своим значением: 427 = 400 + 20 + 7.',
      }, undefined, {
        art: { plate: '427' },
        optionArt: [undefined, undefined, undefined, undefined],
      }),

    /* 3 · dnd · 🟢 — plitalarni tanlash. Eski D03_08 (build_plates). */
    q('03', 'Kerakli plitalar', '🟢', 'd03-plates-804', 'dnd', '🧱', [0, 1, 1, 0],
      {
        e: "Plitalarni tanlang", s: "804 sonini yig'ish kerak. Omborda to'rtta plita bor.",
        a: "Har plitani kerak yoki kerak emas rafiga qo'ying.",
        tokens: ['800', '40', '4', '80'],
        zones: ['804 uchun kerak', 'Kerak emas'],
        dndHint: 'Plitalar tugadi.',
        y: "804 = 800 + 4. O'nlik plitasi kerak emas — o'nliklar o'rnida 0 turibdi.",
        n: "804 da nechta yuzlik, nechta o'nlik, nechta birlik bor? Faqat bor razryadlarni oling.",
        r: "Nol razryadga plita olinmaydi: 804 = 800 + 4.",
      },
      {
        e: 'Выбери плитки', s: 'Нужно собрать число 804. На складе четыре плитки.',
        a: 'Положи каждую плитку на полку «нужна» или «не нужна».',
        tokens: ['800', '40', '4', '80'],
        zones: ['Нужна для 804', 'Не нужна'],
        dndHint: 'Плитки закончились.',
        y: '804 = 800 + 4. Плитка десятков не нужна — на месте десятков стоит 0.',
        n: 'Сколько в 804 сотен, десятков, единиц? Бери только те разряды, которые есть.',
        r: 'На нулевой разряд плитка не берётся: 804 = 800 + 4.',
      }, undefined, {
        art: { plate: '804' },
        tokenArt: [{ plate: '800' }, { plate: '40' }, { plate: '4' }, { plate: '80' }],
      }),

    /* 4 · multi · 🟡 — yoyilmasi ikkita qo'shiluvchidan iborat sonlar. */
    q('04', "Ikkita qo'shiluvchi", '🟡', 'd03-two-addends', 'multi', '✌️', [0, 2, 3],
      {
        e: "Nechta qo'shiluvchi?", s: "Ba'zi sonlarning yoyilmasi uchta emas, ikkita qo'shiluvchidan iborat.",
        a: "Qaysi sonlarning yoyilmasida ATIGI IKKITA qo'shiluvchi bor? Hammasini belgilang.",
        o: ['903', '427', '750', '806'],
        y: "903 = 900 + 3, 750 = 700 + 50, 806 = 800 + 6 — har birida bitta razryad bo'sh. 427 da esa uchala razryad to'la.",
        n: "Har sonda nol bor-yo'qligini tekshiring: nol turgan razryad yoyilmaga qo'shiluvchi bermaydi.",
        r: "Bo'sh razryad yoyilmada qatnashmaydi, shuning uchun qo'shiluvchilar kamayadi.",
      },
      {
        e: 'Сколько слагаемых?', s: 'У некоторых чисел в разложении не три слагаемых, а два.',
        a: 'У каких чисел в разложении РОВНО ДВА слагаемых? Отметь все.',
        o: ['903', '427', '750', '806'],
        y: '903 = 900 + 3, 750 = 700 + 50, 806 = 800 + 6 — у каждого один разряд пустой. А у 427 все три разряда заполнены.',
        n: 'Проверь, есть ли в числе ноль: разряд с нулём не даёт слагаемого.',
        r: 'Пустой разряд не участвует в разложении, поэтому слагаемых становится меньше.',
      }, undefined, {
        art: { plates: ['903', '427', '750', '806'] },
        optionArt: [{ plate: '903' }, { plate: '427' }, { plate: '750' }, { plate: '806' }],
      }),

    /* 5 · dnd · 🟡 — raqam va uning qiymati. Eski D03_05 (decompose_digit_trap). */
    q('05', 'Raqam yoki qiymat?', '🟡', 'd03-digit-vs-value', 'dnd', '⚖️', [0, 1, 0, 1],
      {
        e: 'Diqqat, tuzoq', s: "854 sonining yoyilmasi yozilmoqda. Kartalarning ba'zisi qiymat, ba'zisi shunchaki raqam.",
        a: "854 ning yoyilmasiga TUSHADIGAN kartalarni ajrating.",
        tokens: ['800', '5', '50', '8'],
        zones: ['Yoyilmaga tushadi', 'Tushmaydi'],
        dndHint: 'Kartalar tugadi.',
        y: "854 = 800 + 50 + 4. Yoyilmada raqamning o'zi emas, QIYMATI yoziladi: 8 emas, 800; 5 emas, 50.",
        n: "Yoyilmada raqam o'z qiymati bilan turadi. 5 raqami o'nliklar joyida — uning qiymati qancha?",
        r: "854 = 800 + 50 + 4. Raqamlarni oddiy qo'shsak (8 + 5 + 4 = 17) son qaytmaydi.",
      },
      {
        e: 'Внимание, ловушка', s: 'Записывают разложение числа 854. Часть карточек — значения, часть — просто цифры.',
        a: 'Отбери карточки, которые ВОЙДУТ в разложение 854.',
        tokens: ['800', '5', '50', '8'],
        zones: ['Войдёт в разложение', 'Не войдёт'],
        dndHint: 'Карточки закончились.',
        y: '854 = 800 + 50 + 4. В разложении пишется не сама цифра, а её ЗНАЧЕНИЕ: не 8, а 800; не 5, а 50.',
        n: 'В разложении цифра стоит со своим значением. Цифра 5 на месте десятков — сколько это?',
        r: '854 = 800 + 50 + 4. Если просто сложить цифры (8 + 5 + 4 = 17), число не вернётся.',
      }, undefined, {
        art: { plate: '854' },
        tokenArt: [{ plate: '800' }, { plate: '5' }, { plate: '50' }, { plate: '8' }],
      }),

    /* 6 · match · 🟡 — son va yoyilmasi. Eski D03_03 (match_expand). */
    q('06', 'Moslashtiring', '🟡', 'd03-match-expand', 'match', '🔗', [0, 1, 2],
      {
        e: 'Moslashtiring', s: "Har son o'z yoyilmasiga ulanishi kerak.",
        a: 'Sonni bosing, keyin mos yoyilmani bosing.',
        left: ['289', '341', '625'],
        right: ['200 + 80 + 9', '300 + 40 + 1', '600 + 20 + 5'],
        y: '289 = 200 + 80 + 9, 341 = 300 + 40 + 1, 625 = 600 + 20 + 5.',
        n: "Sonning birinchi raqami yoyilmadagi yuzlik bilan mos kelishi kerak.",
        r: "Yoyilma sonning razryadlarini ochib beradi: yuzlik, o'nlik, birlik.",
      },
      {
        e: 'Соедини пары', s: 'Каждое число должно соединиться со своим разложением.',
        a: 'Нажми число, потом его разложение.',
        left: ['289', '341', '625'],
        right: ['200 + 80 + 9', '300 + 40 + 1', '600 + 20 + 5'],
        y: '289 = 200 + 80 + 9, 341 = 300 + 40 + 1, 625 = 600 + 20 + 5.',
        n: 'Первая цифра числа должна совпадать с сотнями в разложении.',
        r: 'Разложение раскрывает разряды числа: сотни, десятки, единицы.',
      }, undefined, {
        art: { plates: ['289', '341', '625'] },
        artSpotlight: [{ plate: '289' }, { plate: '341' }, { plate: '625' }],
        leftArt: [{ plate: '289' }, { plate: '341' }, { plate: '625' }],
      }),

    /* 7 · choice · 🟡 — XATONI TOPING. Eski D03_10 (find_error), 4-chi variant qo'shildi. */
    q('07', 'Xatoni toping', '🟡', 'd03-find-error', 'choice', '🔎', 1,
      {
        e: 'Xatoni toping', s: "Displeyda to'rtta yoyilma. Bittasida xato bor.",
        a: 'Qaysi yoyilma XATO?',
        o: ['427 = 400 + 20 + 7', '341 = 3 + 4 + 1', '750 = 700 + 50', '806 = 800 + 6'],
        y: "341 = 300 + 40 + 1 bo'lishi kerak. 3 + 4 + 1 = 8 — son qaytmaydi.",
        n: "Har yoyilmani tekshiring: qo'shiluvchilarni qo'shsangiz son qaytadimi?",
        by: [
          "Bu yoyilmani qo'shib ko'ring: natija 427 chiqadi. Demak xato bu yerda emas.",
          undefined,
          "Bu yoyilmada ikkita qo'shiluvchi bor, chunki birlik razryadi bo'sh. Qo'shib tekshiring.",
          "Bu yoyilmada ikkita qo'shiluvchi bor, chunki o'nlik razryadi bo'sh. Qo'shib tekshiring.",
        ],
        r: "Yoyilma tekshiruvi: qo'shiluvchilar yig'indisi sonning o'ziga teng bo'lishi shart.",
      },
      {
        e: 'Найди ошибку', s: 'На дисплее четыре разложения. В одном ошибка.',
        a: 'Какое разложение НЕВЕРНО?',
        o: ['427 = 400 + 20 + 7', '341 = 3 + 4 + 1', '750 = 700 + 50', '806 = 800 + 6'],
        y: 'Должно быть 341 = 300 + 40 + 1. А 3 + 4 + 1 = 8 — число не возвращается.',
        n: 'Проверь каждое разложение: если сложить слагаемые, вернётся ли число?',
        by: [
          'Сложи это разложение: получится 427. Значит, ошибка не здесь.',
          undefined,
          'Здесь два слагаемых, потому что разряд единиц пустой. Сложи и проверь.',
          'Здесь два слагаемых, потому что разряд десятков пустой. Сложи и проверь.',
        ],
        r: 'Проверка разложения: сумма слагаемых должна быть равна самому числу.',
      }),

    /* 8 · input · 🔴 — razryadni ayirish. Eski D03_07 (strip_addends). */
    q('08', 'Razryadni o\'chiring', '🔴', 'd03-strip', 'input', '🔌', ['7'],
      {
        e: 'Razryadni o\'chiring', s: "Devorda 427 ta chiroq yonib turibdi: panellar, lentalar va yakka chiroqlar.",
        a: '427 − 400 − 20 = ? Nechta chiroq yonib qoldi?',
        y: "427 − 400 − 20 = 7: panellar va lentalar o'chdi, faqat 7 yakka chiroq qoldi.",
        n: "400 — bu barcha panellar, 20 — barcha lentalar. Ular o'chganda qaysi razryad qoladi?",
        r: "Sondan razryadni ayirsak, qolgan razryadlar o'zgarmaydi: 427 − 400 − 20 = 7.",
        p: 'Javob',
      },
      {
        e: 'Погаси разряд', s: 'На стене горят 427 огней: панели, ленты и отдельные лампочки.',
        a: '427 − 400 − 20 = ? Сколько огней осталось гореть?',
        y: '427 − 400 − 20 = 7: панели и ленты погасли, остались только 7 отдельных лампочек.',
        n: '400 — это все панели, 20 — все ленты. Какой разряд останется, когда они погаснут?',
        r: 'Если вычесть из числа разряд, остальные разряды не меняются: 427 − 400 − 20 = 7.',
        p: 'Ответ',
      }, 'numeric', {
        art: { pv: { h: 4, t: 2, o: 7 }, captions: { h: 'yuzlik', t: "o'nlik", o: 'birlik' },
          sum: { parts: ['427', '400', '20'], sep: '−', total: '7' } },
      }),

    /* 9 · order · 🔴 — yoyilmani kattadan kichikka. */
    q('09', 'Yoyilma tartibi', '🔴', 'd03-order-addends', 'order', '🪜', [1, 3, 0, 2],
      {
        e: 'Yoyilmani tuzing', s: "5028 emas — bu 3 xonali sonlar dunyosi. Kartalarda 962 sonining qismlari va bitta ortiqcha karta bor.",
        a: "962 ning yoyilmasini kattadan kichikka qarab tuzing. Ortiqcha kartani oxirida qoldiring.",
        o: ['60', '900', '90', '2'],
        y: "962 = 900 + 60 + 2. 90 ortiqcha: 6 raqami o'nliklar joyida turibdi, demak uning qiymati 60.",
        n: "Sonning har raqamini o'z joyiga qarab o'qing: 9 yuzlik, 6 o'nlik, 2 birlik.",
        r: "Yoyilma kattadan kichikka yoziladi: 900 + 60 + 2.",
      },
      {
        e: 'Составь разложение', s: 'На карточках части числа 962 и одна лишняя карточка.',
        a: 'Составь разложение 962 от большего к меньшему. Лишнюю карточку оставь напоследок.',
        o: ['60', '900', '90', '2'],
        y: '962 = 900 + 60 + 2. Лишняя — 90: цифра 6 стоит на месте десятков, значит её значение 60.',
        n: 'Читай каждую цифру по её месту: 9 сотен, 6 десятков, 2 единицы.',
        r: 'Разложение пишется от большего к меньшему: 900 + 60 + 2.',
      }, undefined, {
        art: { plate: '962' },
        optionArt: [{ plate: '60' }, { plate: '900' }, { plate: '90' }, { plate: '2' }],
      }),

    /* 10 · match · 🔴 — masala. Eski D03_09 (case_sum) match shaklida. */
    q('10', 'Kim nechta bet o\'qidi?', '🔴', 'd03-case-sum', 'match', '📖', [0, 1, 2],
      {
        e: 'Yakuniy mashq', s: "Uch bola kitob o'qidi. Har biri o'qigan betlar razryad qo'shiluvchilari bilan yozilgan.",
        a: "Har bolani u o'qigan betlar soniga ulang.",
        left: ['100 + 60 + 2', '100 + 6 + 2', '600 + 10 + 2'],
        right: ['162', '108', '612'],
        y: "100 + 60 + 2 = 162, 100 + 6 + 2 = 108, 600 + 10 + 2 = 612.",
        n: "Har yoyilmada qo'shiluvchilarni razryadma-razryad qo'shing: avval yuzlik, keyin o'nlik, keyin birlik.",
        r: "Yoyilmadan son yig'iladi, lekin 60 va 6 har xil razryadga tushadi: 162 va 108.",
      },
      {
        e: 'Итоговое задание', s: 'Трое детей читали книгу. Прочитанные страницы записаны разрядными слагаемыми.',
        a: 'Соедини каждую запись с числом страниц.',
        left: ['100 + 60 + 2', '100 + 6 + 2', '600 + 10 + 2'],
        right: ['162', '108', '612'],
        y: '100 + 60 + 2 = 162, 100 + 6 + 2 = 108, 600 + 10 + 2 = 612.',
        n: 'В каждом разложении складывай по разрядам: сначала сотни, потом десятки, потом единицы.',
        r: 'Из разложения собирается число, но 60 и 6 попадают в разные разряды: 162 и 108.',
      }),
  ],
};

export default DARS03_BANK;
