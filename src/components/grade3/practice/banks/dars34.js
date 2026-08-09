// Dars 34 amaliyoti — Yuza birliklari.
// Nazariya: src/components/grade3/Dars34.jsx (num-3-34).
// Yuza — shakl ichiga sig'adigan kataklar soni; o'lchov birligi tomoni 1 sm bo'lgan kvadrat.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 multi · 2 match · 3 choice · 4 input · 5 choice · 6 match · 7 dnd · 8 input · 9 order · 10 dnd
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS34_BANK = {
  title: 'Dars 34 · Yuza birliklari',
  items: [

    /* 1 · multi · 🟢 — yuza nima. */
    q('01', 'Yuza nima?', '🟢', 'd34-what', 'multi', '🎯', [0, 3],
      {
        e: 'Ta\'rifni aniqlaymiz', s: "To'rtta gap. Ikkitasi yuza haqida to'g'ri.",
        a: 'Qaysi gaplar to\'g\'ri? Hammasini belgilang.',
        o: [
          'Yuza ichkariga nechta katak sig\'ishini ko\'rsatadi',
          'Yuza chekka bo\'ylab yo\'l uzunligi',
          'Yuza bu eng uzun tomon',
          'Yuza kvadrat santimetrda o\'lchanadi',
        ],
        y: "Yuza ichkaridagi kataklar soni, uning birligi kvadrat santimetr.",
        n: 'Chekka bo\'ylab yo\'l boshqa kattalik edi, u o\'tgan darsda uchradi.',
        r: 'Yuza ichkarini, perimetr chekkani o\'lchaydi.',
      },
      {
        e: 'Уточняем определение', s: 'Четыре утверждения. Два из них верны про площадь.',
        a: 'Какие утверждения верны? Отметь все.',
        o: [
          'Площадь показывает, сколько клеток помещается внутри',
          'Площадь это длина пути по краю',
          'Площадь это самая длинная сторона',
          'Площадь измеряют в квадратных сантиметрах',
        ],
        y: 'Площадь это количество клеток внутри, её единица квадратный сантиметр.',
        n: 'Путь по краю это другая величина, она была на прошлом уроке.',
        r: 'Площадь измеряет внутреннее, периметр край.',
      }),

    /* 2 · match · 🟢 — panel va yuza. */
    q('02', 'Panel va yuza', '🟢', 'd34-match-area', 'match', '🔗', [0, 1, 2],
      {
        e: 'Uch panel', s: 'Har panelda qatordagi kataklar soni va qatorlar soni berilgan.',
        a: 'Har panelni uning yuzasiga ulang.',
        left: ['4 katak · 3 qator', '5 katak · 2 qator', '6 katak · 3 qator'],
        right: ['12 sm²', '10 sm²', '18 sm²'],
        y: '4 · 3 = 12, 5 · 2 = 10, 6 · 3 = 18.',
        n: 'Qatordagi kataklarni qatorlar soniga ko\'paytiring.',
        r: 'Yuza qatordagi kataklar soni bilan qatorlar sonining ko\'paytmasi.',
      },
      {
        e: 'Три панели', s: 'У каждой панели дано число клеток в ряду и число рядов.',
        a: 'Соедини каждую панель с её площадью.',
        left: ['4 клетки · 3 ряда', '5 клеток · 2 ряда', '6 клеток · 3 ряда'],
        right: ['12 см²', '10 см²', '18 см²'],
        y: '4 · 3 = 12, 5 · 2 = 10, 6 · 3 = 18.',
        n: 'Умножь число клеток в ряду на число рядов.',
        r: 'Площадь это произведение числа клеток в ряду на число рядов.',
      }),

    /* 3 · choice · 🟢 — birlik. */
    q('03', 'O\'lchov birligi', '🟢', 'd34-unit', 'choice', '🔒', 2,
      {
        e: 'Birlikni tanlaymiz', s: 'Daftar varag\'ining yuzasini o\'lchamoqchimiz.',
        a: "Yuza qaysi birlikda o'lchanadi?",
        o: ['Santimetr', 'Kilogramm', 'Kvadrat santimetr', 'Metr'],
        y: "Yuza kataklar bilan o'lchanadi, katakning o'zi kvadrat, shuning uchun birlik kvadrat santimetr.",
        n: 'Yuza uzunlikni emas, ichkariga sig\'adigan kataklarni o\'lchaydi.',
        by: [
          'Santimetr uzunlikni o\'lchaydi, yuzani emas.',
          'Kilogramm og\'irlikni o\'lchaydi.',
          undefined,
          'Metr ham uzunlik birligi.',
        ],
        r: 'Yuza birligi tomoni 1 sm bo\'lgan kvadrat, ya\'ni 1 sm².',
      },
      {
        e: 'Выбираем единицу', s: 'Хотим измерить площадь тетрадного листа.',
        a: 'В каких единицах измеряют площадь?',
        o: ['Сантиметр', 'Килограмм', 'Квадратный сантиметр', 'Метр'],
        y: 'Площадь измеряют клетками, а сама клетка квадрат, поэтому единица квадратный сантиметр.',
        n: 'Площадь измеряет не длину, а клетки, помещающиеся внутри.',
        by: [
          'Сантиметр измеряет длину, а не площадь.',
          'Килограмм измеряет вес.',
          undefined,
          'Метр это тоже единица длины.',
        ],
        r: 'Единица площади это квадрат со стороной 1 см, то есть 1 см².',
      }),

    /* 4 · input · 🟡 — yuza hisobi. */
    q('04', 'Panel yuzasi', '🟡', 'd34-compute', 'input', '🔢', ['21'],
      {
        e: 'Hisoblang', s: 'Panelning uzunligi 7 sm, eni 3 sm.',
        a: 'Yuzasi necha kvadrat santimetr?',
        y: "Har qatorda yettita katak, qator uchta. 7 ni 3 ga ko'paytiramiz, 21 kvadrat santimetr.",
        n: 'Uzunlikni enga ko\'paytiring.',
        r: 'To\'rtburchak yuzasi uzunlik bilan enning ko\'paytmasi.',
        p: 'Javob',
      },
      {
        e: 'Посчитай', s: 'Длина панели 7 см, ширина 3 см.',
        a: 'Чему равна площадь в квадратных сантиметрах?',
        y: 'В каждом ряду семь клеток, рядов три. Умножаем 7 на 3, получается 21 квадратный сантиметр.',
        n: 'Умножь длину на ширину.',
        r: 'Площадь прямоугольника это произведение длины и ширины.',
        p: 'Ответ',
      }, 'numeric'),

    /* 5 · choice · 🟡 — yuza yoki perimetr. */
    q('05', 'Yuza yoki perimetr?', '🟡', 'd34-vs-perimeter', 'choice', '🔒', 1,
      {
        e: 'Ikki kattalikni ajratamiz', s: "Xona poliga plitka to'shamoqchimiz.",
        a: 'Qaysi kattalikni hisoblash kerak?',
        o: ['Perimetrni', 'Yuzani', 'Bitta tomonni', 'Tomonlar sonini'],
        y: "Plitka polning ichkarisini to'ldiradi, demak yuza kerak.",
        n: 'Plitka chekka bo\'ylab boradimi yoki ichkarini qoplaydimi?',
        by: [
          'Perimetr chekka yo\'li. Plitka esa ichkarida yotadi.',
          undefined,
          'Bitta tomon butun pol haqida hech nima aytmaydi.',
          'Tomonlar soni plitka miqdorini bermaydi.',
        ],
        r: 'Ichkarini qoplaydigan hamma narsa yuza bilan hisoblanadi.',
      },
      {
        e: 'Различаем две величины', s: 'Хотим положить плитку на пол комнаты.',
        a: 'Какую величину нужно посчитать?',
        o: ['Периметр', 'Площадь', 'Одну сторону', 'Число сторон'],
        y: 'Плитка заполняет внутреннюю часть пола, значит нужна площадь.',
        n: 'Плитка идёт по краю или покрывает внутреннее?',
        by: [
          'Периметр это путь по краю. А плитка лежит внутри.',
          undefined,
          'Одна сторона ничего не говорит про весь пол.',
          'Число сторон не даёт количество плитки.',
        ],
        r: 'Всё, что покрывает внутреннее, считают через площадь.',
      }),

    /* 6 · match · 🟡 — katak tomoni va birlik nomi. */
    q('06', 'Katak va birlik', '🟡', 'd34-match-unit', 'match', '📏', [0, 1, 2],
      {
        e: 'Uch xil katak', s: "O'lchovning o'zi kvadrat, uning nomi tomoniga qarab beriladi.",
        a: 'Har katakni uning nomiga ulang.',
        left: ['Tomoni 1 sm', 'Tomoni 1 dm', 'Tomoni 1 m'],
        right: ['1 sm²', '1 dm²', '1 m²'],
        y: "Katak tomoni qaysi birlikda bo'lsa, yuza birligi ham o'sha nom bilan kvadrat deb ataladi.",
        n: 'Katak tomonining birligiga qarang.',
        r: "Yuza birligi tomoni 1 birlikka teng bo'lgan kvadrat.",
      },
      {
        e: 'Три вида клеток', s: 'Сама мерка это квадрат, её название берут от стороны.',
        a: 'Соедини каждую клетку с её названием.',
        left: ['Сторона 1 см', 'Сторона 1 дм', 'Сторона 1 м'],
        right: ['1 см²', '1 дм²', '1 м²'],
        y: 'В какой единице сторона клетки, так и называется квадратная единица площади.',
        n: 'Посмотри на единицу стороны клетки.',
        r: 'Единица площади это квадрат со стороной в 1 единицу.',
      }),

    /* 7 · dnd · 🟡 — yuza yoki perimetr kerakmi. */
    q('07', 'Nimani o\'lchaymiz?', '🟡', 'd34-which-quantity', 'dnd', '🧭', [0, 1, 0, 1],
      {
        e: 'Hayotdan', s: "To'rtta ish. Ba'zilarida yuza, ba'zilarida perimetr kerak.",
        a: 'Ishlarni ajrating: qayerda yuza, qayerda perimetr kerak.',
        tokens: [
          'Devorga oboy yopishtirish',
          'Bog\' atrofiga panjara qo\'yish',
          'Stolni klyonka bilan qoplash',
          'Rasm chetiga ramka qilish',
        ],
        zones: ['Yuza kerak', 'Perimetr kerak'],
        dndHint: 'Ishlar tugadi.',
        y: "Oboy va klyonka yuzani qoplaydi, panjara va ramka esa chekka bo'ylab boradi.",
        n: 'Bu narsa ichkarini qoplaydimi yoki chekka bo\'ylab boradimi?',
        r: 'Qoplash yuza, o\'rash perimetr.',
      },
      {
        e: 'Из жизни', s: 'Четыре дела. В одних нужна площадь, в других периметр.',
        a: 'Разложи дела: где нужна площадь, а где периметр.',
        tokens: [
          'Поклеить обои на стену',
          'Поставить забор вокруг сада',
          'Накрыть стол клеёнкой',
          'Сделать рамку по краю картины',
        ],
        zones: ['Нужна площадь', 'Нужен периметр'],
        dndHint: 'Дела закончились.',
        y: 'Обои и клеёнка покрывают площадь, а забор и рамка идут по краю.',
        n: 'Эта вещь покрывает внутреннее или идёт по краю?',
        r: 'Покрыть это площадь, обвести это периметр.',
      }),

    /* 8 · input · 🔴 — yo'qolgan tomon. */
    q('08', 'Yo\'qolgan tomon', '🔴', 'd34-missing-side', 'input', '🧩', ['4'],
      {
        e: 'Teskari masala', s: 'Panelning yuzasi 24 sm², uzunligi 6 sm.',
        a: 'Eni necha santimetr?',
        y: "6 ni qaysi songa ko'paytirsak 24 chiqadi? To'rtga. Demak en 4 santimetr.",
        n: 'Yuzani ma\'lum tomonga bo\'ling.',
        r: 'Noma\'lum tomon yuzani ma\'lum tomonga bo\'lish bilan topiladi.',
        p: 'Javob',
      },
      {
        e: 'Обратная задача', s: 'Площадь панели 24 см², длина 6 см.',
        a: 'Чему равна ширина в сантиметрах?',
        y: 'На какое число умножить 6, чтобы вышло 24? На четыре. Значит ширина 4 сантиметра.',
        n: 'Раздели площадь на известную сторону.',
        r: 'Неизвестную сторону находят делением площади на известную.',
        p: 'Ответ',
      }, 'numeric'),

    /* 9 · order · 🔴 — yuza bo'yicha tartib. */
    q('09', 'Kichigidan kattasiga', '🔴', 'd34-sort', 'order', '📈', [1, 3, 0, 2],
      {
        e: 'To\'rt panel', s: 'Har birining uzunligi va eni berilgan.',
        a: 'Panellarni yuzasi bo\'yicha kichigidan kattasiga tartiblang.',
        o: ['5 sm va 4 sm', '3 sm va 2 sm', '6 sm va 5 sm', '4 sm va 3 sm'],
        y: '3 · 2 = 6, keyin 4 · 3 = 12, keyin 5 · 4 = 20, oxirida 6 · 5 = 30.',
        n: 'Har panelda uzunlikni enga ko\'paytiring.',
        r: 'Solishtirishdan oldin hamma yuzalarni hisoblaymiz.',
      },
      {
        e: 'Четыре панели', s: 'У каждой даны длина и ширина.',
        a: 'Расставь панели по площади от меньшей к большей.',
        o: ['5 см и 4 см', '3 см и 2 см', '6 см и 5 см', '4 см и 3 см'],
        y: '3 · 2 = 6, потом 4 · 3 = 12, потом 5 · 4 = 20, в конце 6 · 5 = 30.',
        n: 'В каждой панели умножь длину на ширину.',
        r: 'Перед сравнением считаем все площади.',
      }),

    /* 10 · dnd · 🔴 — yuzasi 12 mi. */
    q('10', 'Yuza 12 mi?', '🔴', 'd34-is12', 'dnd', '🚀', [0, 1, 0, 1],
      {
        e: 'Yakuniy mashq', s: "To'rtta panel. Ikkitasining yuzasi 12 sm².",
        a: 'Panellarni ajrating: qaysilarining yuzasi 12 sm², qaysilariniki boshqa.',
        tokens: ['6 sm va 2 sm', '6 sm va 3 sm', '4 sm va 3 sm', '4 sm va 4 sm'],
        zones: ['Yuza 12 sm²', 'Yuza boshqa'],
        dndHint: 'Panellar tugadi.',
        y: '6 · 2 = 12 va 4 · 3 = 12. Qolganlari 18 va 16 beradi.',
        n: 'Har panelda uzunlikni enga ko\'paytiring.',
        r: 'Bir xil yuzani turli tomonlar bilan hosil qilish mumkin.',
      },
      {
        e: 'Итоговое задание', s: 'Четыре панели. У двух площадь 12 см².',
        a: 'Разложи панели: у каких площадь 12 см², а у каких другая.',
        tokens: ['6 см и 2 см', '6 см и 3 см', '4 см и 3 см', '4 см и 4 см'],
        zones: ['Площадь 12 см²', 'Площадь другая'],
        dndHint: 'Панели закончились.',
        y: '6 · 2 = 12 и 4 · 3 = 12. Остальные дают 18 и 16.',
        n: 'В каждой панели умножь длину на ширину.',
        r: 'Одну и ту же площадь можно получить разными сторонами.',
      }),
  ],
};

export default DARS34_BANK;
