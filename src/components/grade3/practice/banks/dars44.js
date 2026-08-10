// Dars 44 amaliyoti — Uzunlik birliklari: sm, dm, m.
// Nazariya: src/components/grade3/Dars44.jsx (num-3-44).
// 1 dm = 10 sm, 1 m = 10 dm = 100 sm; uzunlik vaqtdan farqli o'laroq o'nlab sanaladi;
// o'lchovlar har xil ekan, sonlarni solishtirib bo'lmaydi (90 sm < 1 m).
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 match · 2 input · 3 dnd · 4 order · 5 multi · 6 choice · 7 order · 8 choice · 9 input · 10 match
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS44_BANK = {
  title: 'Dars 44 · Uzunlik birliklari',
  items: [

    /* 1 · match · 🟢 — o'lchovlar bog'lanishi. */
    q('01', 'O\'lchovlar bog\'lanishi', '🟢', 'd44-match-units', 'match', '🔗', [0, 1, 2],
      {
        e: 'Uch tenglik', s: "Uzunlik o'lchovlari o'nlab bog'langan.",
        a: 'Har o\'lchovni unga teng yozuvga ulang.',
        left: ['1 dm', '1 m', '2 dm'],
        right: ['10 sm', '100 sm', '20 sm'],
        y: "1 dm = 10 sm, 1 m = 100 sm, 2 dm = 20 sm. Har qadamda o'n marta ortadi.",
        n: 'Detsimetrda o\'nta santimetr bor. Metrda esa o\'nta detsimetr.',
        r: '1 dm = 10 sm, 1 m = 10 dm = 100 sm.',
      },
      {
        e: 'Три равенства', s: 'Мерки длины связаны десятками.',
        a: 'Соедини каждую мерку с равной ей записью.',
        left: ['1 дм', '1 м', '2 дм'],
        right: ['10 см', '100 см', '20 см'],
        y: '1 дм = 10 см, 1 м = 100 см, 2 дм = 20 см. На каждом шаге в десять раз больше.',
        n: 'В дециметре десять сантиметров. А в метре десять дециметров.',
        r: '1 дм = 10 см, 1 м = 10 дм = 100 см.',
      }),

    /* 2 · input · 🟢 — metrda nechta santimetr. */
    q('02', 'Metrda nechta santimetr?', '🟢', 'd44-m-to-cm', 'input', '🔢', ['100'],
      {
        e: 'Sanaymiz', s: "Bir metrda o'nta detsimetr bor, har detsimetrda o'n santimetr.",
        a: 'Bitta metrda nechta santimetr bor?',
        y: "O'nta detsimetr, har birida o'n santimetrdan: 10 · 10 = 100 santimetr.",
        n: 'Detsimetrlar sonini har biridagi santimetrlarga ko\'paytiring.',
        r: '1 m = 100 sm.',
        p: 'Javob',
      },
      {
        e: 'Считаем', s: 'В одном метре десять дециметров, в каждом дециметре десять сантиметров.',
        a: 'Сколько сантиметров в одном метре?',
        y: 'Десять дециметров, в каждом по десять сантиметров: 10 · 10 = 100 сантиметров.',
        n: 'Умножь число дециметров на сантиметры в каждом.',
        r: '1 м = 100 см.',
        p: 'Ответ',
      }, 'numeric'),

    /* 3 · dnd · 🟢 — qaysi o'lchov mos. */
    q('03', 'Qaysi o\'lchov mos?', '🟢', 'd44-choose-unit', 'dnd', '📏', [0, 1, 0, 1],
      {
        e: 'Narsaga qarang', s: "To'rtta narsa. Ba'zilari kichik, ba'zilari katta.",
        a: 'Narsalarni ajrating: qaysilari santimetrda, qaysilari metrda o\'lchanadi.',
        tokens: ['O\'chirg\'ich', 'Xona bo\'yi', 'Daftar eni', 'Yo\'lak uzunligi'],
        zones: ['Santimetrda', 'Metrda'],
        dndHint: 'Narsalar tugadi.',
        y: "O'chirg'ich va daftar kichik — santimetrda. Xona va yo'lak katta — metrda.",
        n: 'Narsani chizg\'ich bilan o\'lchash mumkinmi yoki u ancha uzunmi?',
        r: 'O\'lchov narsaga qarab tanlanadi.',
      },
      {
        e: 'Смотри на предмет', s: 'Четыре предмета. Одни маленькие, другие большие.',
        a: 'Разложи предметы: какие меряют в сантиметрах, а какие в метрах.',
        tokens: ['Ластик', 'Высота комнаты', 'Ширина тетради', 'Длина коридора'],
        zones: ['В сантиметрах', 'В метрах'],
        dndHint: 'Предметы закончились.',
        y: 'Ластик и тетрадь маленькие — в сантиметрах. Комната и коридор большие — в метрах.',
        n: 'Предмет можно измерить линейкой или он гораздо длиннее?',
        r: 'Мерку выбирают по предмету.',
      }),

    /* 4 · order · 🟡 — uzunlik bo'yicha tartib. */
    q('04', 'Qisqasidan uzuniga', '🟡', 'd44-sort', 'order', '📈', [1, 3, 0, 2],
      {
        e: 'Bitta o\'lchovga keltiring', s: "To'rtta uzunlik turli o'lchovda yozilgan.",
        a: 'Uzunliklarni qisqasidan uzuniga tartiblang.',
        o: ['1 m', '40 sm', '2 m', '8 dm'],
        y: "40 sm, keyin 8 dm (80 sm), keyin 1 m (100 sm), oxirida 2 m (200 sm).",
        n: 'Avval hammasini santimetrga keltiring, keyin solishtiring.',
        r: 'Solishtirishdan oldin uzunliklar bitta o\'lchovga keltiriladi.',
      },
      {
        e: 'Приведи к одной мерке', s: 'Четыре длины записаны в разных мерках.',
        a: 'Расставь длины от самой короткой к самой длинной.',
        o: ['1 м', '40 см', '2 м', '8 дм'],
        y: '40 см, потом 8 дм (80 см), потом 1 м (100 см), в конце 2 м (200 см).',
        n: 'Сначала переведи всё в сантиметры, потом сравнивай.',
        r: 'Перед сравнением длины приводят к одной мерке.',
      }, undefined, {
        orderBy: "uzunlik bo'yicha, avval santimetrga keltirib",
      }),

    /* 5 · multi · 🟡 — metrga teng. */
    q('05', 'Metrga teng', '🟡', 'd44-equals-m', 'multi', '🎯', [0, 2],
      {
        e: 'Bir xil uzunlik', s: "To'rtta yozuv. Ikkitasi bitta metrga teng.",
        a: 'Qaysi yozuvlar 1 metrga teng? Hammasini belgilang.',
        o: ['100 sm', '10 sm', '10 dm', '1 dm'],
        y: "100 sm va 10 dm — ikkalasi ham bitta metr. 10 sm bu detsimetr, 1 dm esa metrning o'ndan biri.",
        n: 'Har yozuvni santimetrga keltiring va 100 bilan solishtiring.',
        r: '1 m = 10 dm = 100 sm.',
      },
      {
        e: 'Одна и та же длина', s: 'Четыре записи. Две равны одному метру.',
        a: 'Какие записи равны 1 метру? Отметь все.',
        o: ['100 см', '10 см', '10 дм', '1 дм'],
        y: '100 см и 10 дм — обе равны одному метру. А 10 см это дециметр, 1 дм это десятая часть метра.',
        n: 'Переведи каждую запись в сантиметры и сравни со 100.',
        r: '1 м = 10 дм = 100 см.',
      }),

    /* 6 · choice · 🟡 — son o'zi hech nima. */
    q('06', 'Qaysi biri uzun?', '🟡', 'd44-number-alone', 'choice', '🔒', 1,
      {
        e: 'Son o\'zi hal qilmaydi', s: "Omborda 40 sm lenta va 2 m reyka bor.",
        a: 'Qaysi biri uzunroq?',
        o: ['Lenta, chunki 40 katta', 'Reyka, chunki 2 m bu 200 sm', 'Ikkalasi teng', 'Solishtirib bo\'lmaydi'],
        y: "2 metr bu 200 santimetr, qirqdan ancha ko'p. Son o'zi hech nimani hal qilmaydi, o'lchov aytilmaguncha.",
        n: 'Ikkalasini bitta o\'lchovga keltiring, keyin solishtiring.',
        by: [
          "Qirq ikkidan katta, lekin qirq santimetr yarim metrdan ham kam.",
          undefined,
          "40 sm va 200 sm teng emas.",
          "O'lchovlar berilgan, demak ikkalasini bitta o'lchovga keltirish mumkin.",
        ],
        r: 'O\'lchovlar har xil ekan, sonlarni solishtirib bo\'lmaydi.',
      },
      {
        e: 'Число само не решает', s: 'На складе лента 40 см и рейка 2 м.',
        a: 'Что из них длиннее?',
        o: ['Лента, ведь 40 больше', 'Рейка, ведь 2 м это 200 см', 'Они равны', 'Сравнить нельзя'],
        y: '2 метра это 200 сантиметров, гораздо больше сорока. Число само ничего не решает, пока не названа мерка.',
        n: 'Приведи обе длины к одной мерке, потом сравнивай.',
        by: [
          'Сорок больше двух, но сорок сантиметров меньше даже половины метра.',
          undefined,
          '40 см и 200 см не равны.',
          'Мерки даны, значит обе длины можно привести к одной.',
        ],
        r: 'Пока мерки разные, числа сравнивать нельзя.',
      }),

    /* 7 · order · 🟡 — o'lchovlar zinasi. */
    q('07', 'O\'lchovlar zinasi', '🟡', 'd44-ladder', 'order', '🪜', [1, 2, 0],
      {
        e: 'Kichigidan kattasiga', s: "Uzunlikning uchta o'lchovi bor.",
        a: 'O\'lchovlarni kichigidan kattasiga tartiblang.',
        o: ['Metr', 'Santimetr', 'Detsimetr'],
        y: "Santimetr eng kichik, undan keyin detsimetr, eng kattasi metr. Har qadamda o'n marta ortadi.",
        n: 'Qaysi o\'lchovda o\'ntasi keyingisini beradi?',
        r: 'Uzunlik o\'nlab sanaladi: 10 sm = 1 dm, 10 dm = 1 m.',
      },
      {
        e: 'От меньшей к большей', s: 'У длины три мерки.',
        a: 'Расставь мерки от меньшей к большей.',
        o: ['Метр', 'Сантиметр', 'Дециметр'],
        y: 'Сантиметр самый маленький, потом дециметр, самый большой метр. На каждом шаге в десять раз больше.',
        n: 'В какой мерке десять штук дают следующую?',
        r: 'Длину считают десятками: 10 см = 1 дм, 10 дм = 1 м.',
      }),

    /* 8 · choice · 🔴 — 90 sm va 1 m. */
    q('08', '90 sm va 1 m', '🔴', 'd44-90-vs-m', 'choice', '🔎', 1,
      {
        e: 'Diqqat, tuzoq', s: "Ikki uzunlik: 90 sm va 1 m.",
        a: 'Qaysi biri uzunroq?',
        o: ['90 sm, chunki 90 katta', '1 m, chunki bu 100 sm', 'Ikkalasi teng', 'Solishtirib bo\'lmaydi'],
        y: "1 metr bu 100 santimetr, 90 dan katta. Son kattaligiga aldanmang, o'lchovga qarang.",
        n: 'Metrni santimetrga keltiring, keyin solishtiring.',
        by: [
          "90 soni 1 dan katta, lekin bu yerda o'lchovlar har xil: 1 m bu 100 sm.",
          undefined,
          "90 sm va 100 sm teng emas.",
          "Ikkala o'lchov ham ma'lum, demak solishtirish mumkin.",
        ],
        r: '90 sm < 1 m, chunki 1 m = 100 sm.',
      },
      {
        e: 'Внимание, ловушка', s: 'Две длины: 90 см и 1 м.',
        a: 'Что из них длиннее?',
        o: ['90 см, ведь 90 больше', '1 м, ведь это 100 см', 'Они равны', 'Сравнить нельзя'],
        y: '1 метр это 100 сантиметров, больше девяноста. Не поддавайся на размер числа, смотри на мерку.',
        n: 'Переведи метр в сантиметры, потом сравнивай.',
        by: [
          'Число 90 больше 1, но здесь разные мерки: 1 м это 100 см.',
          undefined,
          '90 см и 100 см не равны.',
          'Обе мерки известны, значит сравнить можно.',
        ],
        r: '90 см < 1 м, потому что 1 м = 100 см.',
      }),

    /* 9 · input · 🔴 — ikki bo'lak. */
    q('09', 'Ikki bo\'lak', '🔴', 'd44-two-pieces', 'input', '🧩', ['160'],
      {
        e: 'Bitta o\'lchovga', s: "Bitta lenta 1 metr, ikkinchisi 60 santimetr.",
        a: 'Ikkalasining uzunligi necha santimetr?',
        y: "1 metr bu 100 santimetr. 100 + 60 = 160 santimetr.",
        n: 'Avval metrni santimetrga aylantiring, keyin qo\'shing.',
        r: 'Qo\'shishdan oldin uzunliklar bitta o\'lchovga keltiriladi.',
        p: 'Javob',
      },
      {
        e: 'К одной мерке', s: 'Одна лента 1 метр, вторая 60 сантиметров.',
        a: 'Чему равна их общая длина в сантиметрах?',
        y: '1 метр это 100 сантиметров. 100 + 60 = 160 сантиметров.',
        n: 'Сначала переведи метр в сантиметры, потом складывай.',
        r: 'Перед сложением длины приводят к одной мерке.',
        p: 'Ответ',
      }, 'numeric'),

    /* 10 · match · 🔴 — uzunlik va santimetr. */
    q('10', 'Hammasini santimetrda', '🔴', 'd44-all-in-cm', 'match', '🚀', [0, 1, 2],
      {
        e: 'Yakuniy mashq', s: 'Uchta uzunlik turli o\'lchovda yozilgan.',
        a: 'Har uzunlikni unga teng santimetrlarga ulang.',
        left: ['3 dm', '1 m 5 sm', '2 m'],
        right: ['30 sm', '105 sm', '200 sm'],
        y: "3 dm = 30 sm, 1 m 5 sm = 100 + 5 = 105 sm, 2 m = 200 sm.",
        n: 'Detsimetrni 10 ga, metrni 100 ga ko\'paytiring.',
        r: 'Bitta o\'lchovga keltirish solishtirishni ham, qo\'shishni ham osonlashtiradi.',
      },
      {
        e: 'Итоговое задание', s: 'Три длины записаны в разных мерках.',
        a: 'Соедини каждую длину с равным числом сантиметров.',
        left: ['3 дм', '1 м 5 см', '2 м'],
        right: ['30 см', '105 см', '200 см'],
        y: '3 дм = 30 см, 1 м 5 см = 100 + 5 = 105 см, 2 м = 200 см.',
        n: 'Дециметры умножай на 10, метры на 100.',
        r: 'Приведение к одной мерке облегчает и сравнение, и сложение.',
      }),
  ],
};

export default DARS44_BANK;
