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
      }, undefined, {
        en: {
          e: 'Sharpen the definition', s: 'Four statements. Two of them are true about area.',
          a: 'Which statements are true? Mark them all.',
          o: ['Area shows how many cells fit inside', 'Area is the length of the path along the edge', 'Area is the longest side', 'Area is measured in square centimetres'],
          y: 'Area is the number of cells inside, and its unit is the square centimetre.',
          n: 'The path along the edge is a different measure, it was in the last lesson.',
          r: 'Area measures what is inside, perimeter measures the edge.',
        },
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
      }, undefined, {
        en: {
          e: 'Three panels', s: 'For every panel the number of cells in a row and the number of rows are given.',
          a: 'Connect each panel with its area.',
          left: ['4 cells · 3 rows', '5 cells · 2 rows', '6 cells · 3 rows'],
          right: ['12 cm²', '10 cm²', '18 cm²'],
          y: '4 · 3 = 12, 5 · 2 = 10, 6 · 3 = 18.',
          n: 'Multiply the number of cells in a row by the number of rows.',
          r: 'Area is the number of cells in a row multiplied by the number of rows.',
        },
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
      }, undefined, {
        en: {
          e: 'Choosing the unit', s: 'We want to measure the area of a page in a notebook.',
          a: 'What units is area measured in?',
          o: ['Centimetre', 'Kilogram', 'Square centimetre', 'Metre'],
          y: 'Area is measured in cells, and a cell is a square, so the unit is the square centimetre.',
          n: 'Area does not measure length, it measures the cells that fit inside.',
          by: [
            'A centimetre measures length, not area.',
            'A kilogram measures weight.',
            undefined,
            'A metre is a unit of length too.',
          ],
          r: 'The unit of area is a square with a side of 1 cm, that is 1 cm².',
        },
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
      }, 'numeric', {
        en: {
          e: 'Work it out', s: 'A panel is 7 cm long and 3 cm wide.',
          a: 'How many square centimetres is the area?',
          y: 'Every row has seven cells and there are three rows. We multiply 7 by 3 and get 21 square centimetres.',
          n: 'Multiply the length by the width.',
          r: 'The area of a rectangle is the length multiplied by the width.',
          p: 'Answer',
        },
      }),

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
      }, undefined, {
        en: {
          e: 'Telling the two apart', s: 'We want to lay tiles on the floor of a room.',
          a: 'Which measure has to be worked out?',
          o: ['The perimeter', 'The area', 'One side', 'The number of sides'],
          y: 'The tiles fill the inside of the floor, so the area is what is needed.',
          n: 'Do the tiles run along the edge or cover the inside?',
          by: [
            'The perimeter is the path along the edge. And the tiles lie inside.',
            undefined,
            'One side says nothing about the whole floor.',
            'The number of sides does not give the number of tiles.',
          ],
          r: 'Anything that covers the inside is worked out through the area.',
        },
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
      }, undefined, {
        en: {
          e: 'Three kinds of cells', s: 'The measure itself is a square, and its name comes from its side.',
          a: 'Connect each cell with its name.',
          left: ['A side of 1 cm', 'A side of 1 dm', 'A side of 1 m'],
          right: ['1 cm²', '1 dm²', '1 m²'],
          y: 'Whatever unit the side of the cell is in, that is what the square unit of area is called.',
          n: 'Look at the unit of the side of the cell.',
          r: 'A unit of area is a square with a side of 1 unit.',
        },
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
      }, undefined, {
        en: {
          e: 'From real life', s: 'Four jobs. Some need the area, others the perimeter.',
          a: 'Sort the jobs: where the area is needed and where the perimeter.',
          tokens: ['Put wallpaper on a wall', 'Put a fence around a garden', 'Cover a table with oilcloth', 'Make a frame along the edge of a picture'],
          zones: ['The area is needed', 'The perimeter is needed'],
          dndHint: 'No jobs left.',
          y: 'Wallpaper and oilcloth cover an area, while a fence and a frame run along the edge.',
          n: 'Does this thing cover the inside or run along the edge?',
          r: 'Covering is area, going round is perimeter.',
        },
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
      }, 'numeric', {
        en: {
          e: 'The problem in reverse', s: 'A panel has an area of 24 cm² and a length of 6 cm.',
          a: 'How many centimetres is the width?',
          y: 'What do you multiply 6 by to get 24? By four. So the width is 4 centimetres.',
          n: 'Divide the area by the side you know.',
          r: 'An unknown side is found by dividing the area by the known side.',
          p: 'Answer',
        },
      }),

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
      }, undefined, {
        en: {
          e: 'Four panels', s: 'Each one is given by its length and width.',
          a: 'Put the panels in order of their area, from the smallest to the largest.',
          o: ['5 cm and 4 cm', '3 cm and 2 cm', '6 cm and 5 cm', '4 cm and 3 cm'],
          y: '3 · 2 = 6, then 4 · 3 = 12, then 5 · 4 = 20, and 6 · 5 = 30 at the end.',
          n: 'For every panel multiply the length by the width.',
          r: 'Before comparing we work out all the areas.',
        },
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
      }, undefined, {
        en: {
          e: 'Final task', s: 'Four panels. Two of them have an area of 12 cm².',
          a: 'Sort the panels: which ones have an area of 12 cm² and which have a different one.',
          tokens: ['6 cm and 2 cm', '6 cm and 3 cm', '4 cm and 3 cm', '4 cm and 4 cm'],
          zones: ['Area 12 cm²', 'A different area'],
          dndHint: 'No panels left.',
          y: '6 · 2 = 12 and 4 · 3 = 12. The others give 18 and 16.',
          n: 'For every panel multiply the length by the width.',
          r: 'The same area can be made with different sides.',
        },
      }),
  ],
};

export default DARS34_BANK;
