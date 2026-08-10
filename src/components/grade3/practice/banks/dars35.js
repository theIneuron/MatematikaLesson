// Dars 35 amaliyoti — To'rtburchak yuzasi.
// Nazariya: src/components/grade3/Dars35.jsx (num-3-35).
// Kataklar bir xil qatorlarda yotadi, shuning uchun yuza uzunlikni enga ko'paytirish
// bilan topiladi (6 · 4 = 24 sm²); tekshirish bo'lish bilan.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 order · 2 input · 3 match · 4 order · 5 dnd · 6 choice · 7 multi · 8 dnd · 9 match · 10 multi
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS35_BANK = {
  title: 'Dars 35 · To\'rtburchak yuzasi',
  items: [

    /* 1 · order · 🟢 — qisqa yo'lning qadamlari. */
    q('01', 'Qisqa yo\'l', '🟢', 'd35-steps', 'order', '🪜', [1, 2, 0],
      {
        e: 'Uch qadam', s: "Panelda qatorda 6 katak, qator 4 ta. Kataklarni bittalab sanamaymiz.",
        a: 'Qadamlarni tartib bilan tanlang.',
        o: ['Yuza 24 kvadrat santimetr', 'Bir qatorda nechta katak borligini sanayman', 'Qatorlar soniga ko\'paytiraman'],
        y: "Avval bitta qatorni sanaymiz, keyin qatorlar soniga ko'paytiramiz, oxirida javobni yozamiz.",
        n: "Ko'paytirishdan oldin nimani bilish kerak?",
        r: "Kataklar bir xil qatorlarda yotadi, shuning uchun qo'shish ko'paytirish bilan almashtiriladi.",
      },
      {
        e: 'Три шага', s: 'В панели в ряду 6 клеток, рядов 4. Клетки по одной не считаем.',
        a: 'Выбери шаги по порядку.',
        o: ['Площадь 24 квадратных сантиметра', 'Считаю, сколько клеток в одном ряду', 'Умножаю на число рядов'],
        y: 'Сначала считаем один ряд, потом умножаем на число рядов, в конце пишем ответ.',
        n: 'Что нужно узнать до умножения?',
        r: 'Клетки лежат одинаковыми рядами, поэтому сложение заменяют умножением.',
      }, undefined, {
        en: {
          e: 'Three steps', s: 'A panel has 6 cells in a row and 4 rows. We do not count the cells one by one.',
          a: 'Pick the steps in order.',
          o: ['The area is 24 square centimetres', 'I count how many cells there are in one row', 'I multiply by the number of rows'],
          y: 'First we count one row, then we multiply by the number of rows, and at the end we write the answer.',
          n: 'What has to be found out before the multiplying?',
          r: 'The cells lie in equal rows, so adding is replaced by multiplying.',
        },
      }),

    /* 2 · input · 🟢 — asosiy hisob. */
    q('02', 'Panel yuzasi', '🟢', 'd35-basic', 'input', '🔢', ['24'],
      {
        e: 'Hisoblang', s: "Panelning uzunligi 6 sm, eni 4 sm.",
        a: 'Yuzasi necha kvadrat santimetr?',
        y: "6 ni 4 ga ko'paytiramiz, 24 kvadrat santimetr chiqadi.",
        n: 'Bir qatordagi kataklar sonini qatorlar soniga ko\'paytiring.',
        r: 'Yuza bu uzunlikni enga ko\'paytirgani.',
        p: 'Javob',
      },
      {
        e: 'Посчитай', s: 'Длина панели 6 см, ширина 4 см.',
        a: 'Чему равна площадь в квадратных сантиметрах?',
        y: 'Умножаем 6 на 4, получается 24 квадратных сантиметра.',
        n: 'Умножь число клеток в одном ряду на число рядов.',
        r: 'Площадь это длина, умноженная на ширину.',
        p: 'Ответ',
      }, 'numeric', {
        en: {
          e: 'Work it out', s: 'A panel is 6 cm long and 4 cm wide.',
          a: 'How many square centimetres is the area?',
          y: 'We multiply 6 by 4 and get 24 square centimetres.',
          n: 'Multiply the number of cells in one row by the number of rows.',
          r: 'Area is the length multiplied by the width.',
          p: 'Answer',
        },
      }),

    /* 3 · match · 🟢 — panel va yuza. */
    q('03', 'Panel va yuza', '🟢', 'd35-match-area', 'match', '🔗', [0, 1, 2],
      {
        e: 'Uch panel', s: 'Har panelning uzunligi va eni berilgan.',
        a: 'Har panelni uning yuzasiga ulang.',
        left: ['6 sm va 4 sm', '5 sm va 3 sm', '7 sm va 2 sm'],
        right: ['24 sm²', '15 sm²', '14 sm²'],
        y: '6 · 4 = 24, 5 · 3 = 15, 7 · 2 = 14.',
        n: 'Har panelda uzunlikni enga ko\'paytiring.',
        r: 'To\'rtburchak yuzasi uzunlik bilan enning ko\'paytmasi.',
      },
      {
        e: 'Три панели', s: 'У каждой панели даны длина и ширина.',
        a: 'Соедини каждую панель с её площадью.',
        left: ['6 см и 4 см', '5 см и 3 см', '7 см и 2 см'],
        right: ['24 см²', '15 см²', '14 см²'],
        y: '6 · 4 = 24, 5 · 3 = 15, 7 · 2 = 14.',
        n: 'В каждой панели умножь длину на ширину.',
        r: 'Площадь прямоугольника это произведение длины и ширины.',
      }, undefined, {
        en: {
          e: 'Three panels', s: 'Every panel is given by its length and width.',
          a: 'Connect each panel with its area.',
          left: ['6 cm and 4 cm', '5 cm and 3 cm', '7 cm and 2 cm'],
          right: ['24 cm²', '15 cm²', '14 cm²'],
          y: '6 · 4 = 24, 5 · 3 = 15, 7 · 2 = 14.',
          n: 'For every panel multiply the length by the width.',
          r: 'The area of a rectangle is the length multiplied by the width.',
        },
      }),

    /* 4 · order · 🟡 — yuza bo'yicha tartib. */
    q('04', 'Kichigidan kattasiga', '🟡', 'd35-sort', 'order', '📈', [2, 1, 0, 3],
      {
        e: 'To\'rt panel', s: 'Har birining uzunligi va eni berilgan.',
        a: 'Panellarni yuzasi bo\'yicha kichigidan kattasiga tartiblang.',
        o: ['5 sm va 3 sm', '4 sm va 3 sm', '3 sm va 3 sm', '6 sm va 4 sm'],
        y: '3 · 3 = 9, keyin 4 · 3 = 12, keyin 5 · 3 = 15, oxirida 6 · 4 = 24.',
        n: 'Avval har panelning yuzasini hisoblang, keyin solishtiring.',
        r: 'Solishtirishdan oldin hamma yuzalarni hisoblaymiz.',
      },
      {
        e: 'Четыре панели', s: 'У каждой даны длина и ширина.',
        a: 'Расставь панели по площади от меньшей к большей.',
        o: ['5 см и 3 см', '4 см и 3 см', '3 см и 3 см', '6 см и 4 см'],
        y: '3 · 3 = 9, потом 4 · 3 = 12, потом 5 · 3 = 15, в конце 6 · 4 = 24.',
        n: 'Сначала посчитай площадь каждой панели, потом сравни.',
        r: 'Перед сравнением считаем все площади.',
      }, undefined, {
        en: {
          e: 'Four panels', s: 'Each one is given by its length and width.',
          a: 'Put the panels in order of their area, from the smallest to the largest.',
          o: ['5 cm and 3 cm', '4 cm and 3 cm', '3 cm and 3 cm', '6 cm and 4 cm'],
          y: '3 · 3 = 9, then 4 · 3 = 12, then 5 · 3 = 15, and 6 · 4 = 24 at the end.',
          n: 'Work out the area of every panel first, then compare them.',
          r: 'Before comparing we work out all the areas.',
        },
      }),

    /* 5 · dnd · 🟡 — yuza yoki perimetr. */
    q('05', 'Qaysi kattalik?', '🟡', 'd35-which', 'dnd', '🧭', [0, 1, 0, 1],
      {
        e: 'Ikkitasini ajratamiz', s: "To'rtta yozuv. Ba'zilari yuzani, ba'zilari perimetrni beradi.",
        a: 'Yozuvlarni ajrating: qaysilari yuzani, qaysilari perimetrni beradi.',
        tokens: ['6 · 4', '6 + 4 + 6 + 4', '5 · 3', '5 + 3 + 5 + 3'],
        zones: ['Yuza', 'Perimetr'],
        dndHint: 'Yozuvlar tugadi.',
        y: "Ko'paytirish ichkaridagi kataklarni sanaydi, qo'shish esa chekka bo'ylab yuradi.",
        n: 'Ko\'paytmami yoki yig\'indimi? Ichkarini sanash — ko\'paytirish.',
        r: 'Yuza ko\'paytirish bilan, perimetr qo\'shish bilan topiladi.',
      },
      {
        e: 'Различаем две величины', s: 'Четыре записи. Одни дают площадь, другие периметр.',
        a: 'Разложи записи: какие дают площадь, а какие периметр.',
        tokens: ['6 · 4', '6 + 4 + 6 + 4', '5 · 3', '5 + 3 + 5 + 3'],
        zones: ['Площадь', 'Периметр'],
        dndHint: 'Записи закончились.',
        y: 'Умножение считает клетки внутри, а сложение идёт по краю.',
        n: 'Это произведение или сумма? Счёт внутреннего — это умножение.',
        r: 'Площадь находят умножением, периметр сложением.',
      }, undefined, {
        en: {
          e: 'Telling the two apart', s: 'Four records. Some give the area, others the perimeter.',
          a: 'Sort the records: which ones give the area and which the perimeter.',
          tokens: ['6 · 4', '6 + 4 + 6 + 4', '5 · 3', '5 + 3 + 5 + 3'],
          zones: ['Area', 'Perimeter'],
          dndHint: 'No records left.',
          y: 'Multiplying counts the cells inside, while adding runs along the edge.',
          n: 'Is it a product or a sum? Counting the inside is a multiplication.',
          r: 'Area is found by multiplying, perimeter by adding.',
        },
      }),

    /* 6 · choice · 🟡 — kvadrat. */
    q('06', 'Kvadrat panel', '🟡', 'd35-square', 'choice', '🔒', 1,
      {
        e: 'Tomonlari teng', s: "Panel kvadrat shaklida, bitta tomoni 5 sm.",
        a: 'Yuzasi necha kvadrat santimetr?',
        o: ['10', '25', '20', '15'],
        y: "Kvadratda uzunlik ham, en ham 5 ga teng. 5 ni 5 ga ko'paytiramiz, 25 chiqadi.",
        n: 'Kvadratda uzunlik va en teng. Ularni ko\'paytiring.',
        by: [
          "Bu 5 va 5 ning yig'indisi. Yuza esa ko'paytirish bilan topiladi.",
          undefined,
          "Bu perimetr: to'rtta tomon 5 tadan, jami 20. Yuza boshqa kattalik.",
          "Bu 5 va 3 ning ko'paytmasi. Kvadratda esa ikkala tomon 5 ga teng.",
        ],
        r: "Kvadrat yuzasi tomonni o'ziga ko'paytirgani.",
      },
      {
        e: 'Стороны равны', s: 'Панель квадратная, одна сторона 5 см.',
        a: 'Чему равна площадь в квадратных сантиметрах?',
        o: ['10', '25', '20', '15'],
        y: 'У квадрата и длина, и ширина равны 5. Умножаем 5 на 5, получается 25.',
        n: 'У квадрата длина и ширина равны. Перемножь их.',
        by: [
          'Это сумма 5 и 5. А площадь находят умножением.',
          undefined,
          'Это периметр: четыре стороны по 5, всего 20. Площадь — другая величина.',
          'Это произведение 5 и 3. А у квадрата обе стороны равны 5.',
        ],
        r: 'Площадь квадрата это сторона, умноженная на себя.',
      }, undefined, {
        en: {
          e: 'The sides are equal', s: 'A panel is a square with a side of 5 cm.',
          a: 'How many square centimetres is the area?',
          o: ['10', '25', '20', '15'],
          y: 'In a square both the length and the width are 5. We multiply 5 by 5 and get 25.',
          n: 'In a square the length and the width are equal. Multiply them.',
          by: [
            'That is 5 added to 5. And area is found by multiplying.',
            undefined,
            'That is the perimeter: four sides of 5 make 20. Area is a different measure.',
            'That is 5 multiplied by 3. But in a square both sides are 5.',
          ],
          r: 'The area of a square is the side multiplied by itself.',
        },
      }),

    /* 7 · multi · 🟡 — yuzasi 24 bo'lganlar. */
    q('07', 'Yuza 24', '🟡', 'd35-is24', 'multi', '🎯', [0, 2],
      {
        e: 'Bir xil yuza', s: "To'rtta panel. Ikkitasining yuzasi 24 sm².",
        a: 'Qaysi panellarning yuzasi 24 sm²? Hammasini belgilang.',
        o: ['6 sm va 4 sm', '6 sm va 3 sm', '8 sm va 3 sm', '5 sm va 4 sm'],
        y: '6 · 4 = 24 va 8 · 3 = 24. Qolganlari 18 va 20 beradi.',
        n: 'Har panelda uzunlikni enga ko\'paytiring.',
        r: 'Bir xil yuzani turli tomonlar bilan hosil qilish mumkin.',
      },
      {
        e: 'Одинаковая площадь', s: 'Четыре панели. У двух площадь 24 см².',
        a: 'У каких панелей площадь 24 см²? Отметь все.',
        o: ['6 см и 4 см', '6 см и 3 см', '8 см и 3 см', '5 см и 4 см'],
        y: '6 · 4 = 24 и 8 · 3 = 24. Остальные дают 18 и 20.',
        n: 'В каждой панели умножь длину на ширину.',
        r: 'Одну и ту же площадь можно получить разными сторонами.',
      }, undefined, {
        en: {
          e: 'The same area', s: 'Four panels. Two of them have an area of 24 cm².',
          a: 'Which panels have an area of 24 cm²? Mark them all.',
          o: ['6 cm and 4 cm', '6 cm and 3 cm', '8 cm and 3 cm', '5 cm and 4 cm'],
          y: '6 · 4 = 24 and 8 · 3 = 24. The others give 18 and 20.',
          n: 'For every panel multiply the length by the width.',
          r: 'The same area can be made with different sides.',
        },
      }),

    /* 8 · dnd · 🔴 — yuza yoki perimetr kerakmi. */
    q('08', 'Nima kerak?', '🔴', 'd35-life', 'dnd', '🏠', [0, 1, 0, 1],
      {
        e: 'Hayotdan', s: "To'rtta ish. Ba'zilarida ichkari, ba'zilarida chekka o'lchanadi.",
        a: 'Ishlarni ajrating: qayerda yuza, qayerda perimetr kerak.',
        tokens: [
          'Polga plitka to\'shash',
          'Xona atrofiga plintus qo\'yish',
          'Devorga oboy yopishtirish',
          'Rasm chetiga ramka qilish',
        ],
        zones: ['Yuza kerak', 'Perimetr kerak'],
        dndHint: 'Ishlar tugadi.',
        y: "Plitka va oboy ichkarini qoplaydi, plintus va ramka esa chekka bo'ylab boradi.",
        n: 'Bu narsa ichkarini qoplaydimi yoki chekka bo\'ylab boradimi?',
        r: 'Qoplash yuza, o\'rash perimetr.',
      },
      {
        e: 'Из жизни', s: 'Четыре дела. В одних меряют внутреннее, в других край.',
        a: 'Разложи дела: где нужна площадь, а где периметр.',
        tokens: [
          'Положить плитку на пол',
          'Поставить плинтус вокруг комнаты',
          'Поклеить обои на стену',
          'Сделать рамку по краю картины',
        ],
        zones: ['Нужна площадь', 'Нужен периметр'],
        dndHint: 'Дела закончились.',
        y: 'Плитка и обои покрывают внутреннее, а плинтус и рамка идут по краю.',
        n: 'Эта вещь покрывает внутреннее или идёт по краю?',
        r: 'Покрыть это площадь, обвести это периметр.',
      }, undefined, {
        en: {
          e: 'From real life', s: 'Four jobs. Some measure the inside, others the edge.',
          a: 'Sort the jobs: where the area is needed and where the perimeter.',
          tokens: ['Lay tiles on a floor', 'Put a skirting board around a room', 'Put wallpaper on a wall', 'Make a frame along the edge of a picture'],
          zones: ['The area is needed', 'The perimeter is needed'],
          dndHint: 'No jobs left.',
          y: 'Tiles and wallpaper cover the inside, while a skirting board and a frame run along the edge.',
          n: 'Does this thing cover the inside or run along the edge?',
          r: 'Covering is area, going round is perimeter.',
        },
      }),

    /* 9 · match · 🔴 — teskari masala. */
    q('09', 'Yo\'qolgan tomon', '🔴', 'd35-missing-side', 'match', '🧩', [0, 1, 2],
      {
        e: 'Teskari yo\'l', s: 'Har panelning yuzasi va bitta tomoni berilgan.',
        a: 'Har panelni uning ikkinchi tomoniga ulang.',
        left: ['Yuza 24 sm², uzunligi 6 sm', 'Yuza 15 sm², uzunligi 5 sm', 'Yuza 30 sm², uzunligi 6 sm'],
        right: ['4 sm', '3 sm', '5 sm'],
        y: '24 : 6 = 4, 15 : 5 = 3, 30 : 6 = 5.',
        n: 'Yuzani ma\'lum tomonga bo\'ling.',
        r: 'Noma\'lum tomon yuzani ma\'lum tomonga bo\'lish bilan topiladi.',
      },
      {
        e: 'Обратный путь', s: 'У каждой панели даны площадь и одна сторона.',
        a: 'Соедини каждую панель с её второй стороной.',
        left: ['Площадь 24 см², длина 6 см', 'Площадь 15 см², длина 5 см', 'Площадь 30 см², длина 6 см'],
        right: ['4 см', '3 см', '5 см'],
        y: '24 : 6 = 4, 15 : 5 = 3, 30 : 6 = 5.',
        n: 'Раздели площадь на известную сторону.',
        r: 'Неизвестную сторону находят делением площади на известную.',
      }, undefined, {
        en: {
          e: 'The way back', s: 'For every panel the area and one side are given.',
          a: 'Connect each panel with its second side.',
          left: ['Area 24 cm², length 6 cm', 'Area 15 cm², length 5 cm', 'Area 30 cm², length 6 cm'],
          right: ['4 cm', '3 cm', '5 cm'],
          y: '24 : 6 = 4, 15 : 5 = 3, 30 : 6 = 5.',
          n: 'Divide the area by the side you know.',
          r: 'An unknown side is found by dividing the area by the known side.',
        },
      }),

    /* 10 · multi · 🔴 — to'g'ri yechimlar. */
    q('10', 'To\'g\'ri yechim', '🔴', 'd35-check', 'multi', '🚀', [0, 3],
      {
        e: 'Yakuniy mashq', s: "Panelning uzunligi 7 sm, eni 3 sm. To'rtta yechim taklif qilindi.",
        a: 'Qaysi yechimlar to\'g\'ri? Hammasini belgilang.',
        o: ['7 · 3 = 21 sm²', '7 + 3 = 10 sm²', '7 + 3 + 7 + 3 = 20 sm²', '3 · 7 = 21 sm²'],
        y: "Yuza ko'paytirish bilan topiladi, ko'paytuvchilar o'rnini almashtirsa ham natija bir xil.",
        n: 'Yuza ko\'paytirish bilan topiladi. Qo\'shish boshqa kattalikni beradi.',
        r: 'Yuza uzunlik va enning ko\'paytmasi, ko\'paytuvchilar tartibi ahamiyatsiz.',
      },
      {
        e: 'Итоговое задание', s: 'Длина панели 7 см, ширина 3 см. Предложили четыре решения.',
        a: 'Какие решения верные? Отметь все.',
        o: ['7 · 3 = 21 см²', '7 + 3 = 10 см²', '7 + 3 + 7 + 3 = 20 см²', '3 · 7 = 21 см²'],
        y: 'Площадь находят умножением, и от перестановки множителей результат не меняется.',
        n: 'Площадь находят умножением. Сложение даёт другую величину.',
        r: 'Площадь это произведение длины и ширины, порядок множителей не важен.',
      }, undefined, {
        en: {
          e: 'Final task', s: 'A panel is 7 cm long and 3 cm wide. Four solutions were suggested.',
          a: 'Which solutions are right? Mark them all.',
          o: ['7 · 3 = 21 cm²', '7 + 3 = 10 cm²', '7 + 3 + 7 + 3 = 20 cm²', '3 · 7 = 21 cm²'],
          y: 'Area is found by multiplying, and swapping the factors does not change the result.',
          n: 'Area is found by multiplying. Adding gives a different measure.',
          r: 'Area is the length multiplied by the width, and the order of the factors does not matter.',
        },
      }),
  ],
};

export default DARS35_BANK;
