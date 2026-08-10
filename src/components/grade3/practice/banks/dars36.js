// Dars 36 amaliyoti — Kvadrat yuzasi.
// Nazariya: src/components/grade3/Dars36.jsx (num-3-36).
// Kvadratning tomonlari teng, shuning uchun yuza tomonni o'ziga ko'paytirish bilan
// topiladi (6 · 6 = 36 sm²); to'rtta tomon esa perimetrni beradi.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 choice · 2 dnd · 3 multi · 4 match · 5 input · 6 multi · 7 order · 8 choice · 9 input · 10 dnd
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS36_BANK = {
  title: 'Dars 36 · Kvadrat yuzasi',
  items: [

    /* 1 · choice · 🟢 — bitta son yetadi. */
    q('01', 'Bitta son yetadi', '🟢', 'd36-one-number', 'choice', '🔒', 1,
      {
        e: 'Kvadrat panel', s: "Panel kvadrat: qatorda 6 katak, qator ham 6 ta.",
        a: 'Panelda jami nechta katak bor?',
        o: ['12', '36', '24', '6'],
        y: "Kvadratda uzunlik ham, en ham 6 ga teng. 6 ni 6 ga ko'paytiramiz, 36 katak.",
        n: 'Bir qatordagi kataklar sonini qatorlar soniga ko\'paytiring.',
        by: [
          "Bu ikkita tomon birga. Kataklar esa ancha ko'p.",
          undefined,
          "Bu chekka yo'li: to'rtta tomon 6 tadan. Biz ichkarini sanaymiz.",
          'Bu faqat bitta qator. Qator esa oltita.',
        ],
        r: "Kvadrat yuzasi tomonni o'ziga ko'paytirgani.",
      },
      {
        e: 'Квадратная панель', s: 'Панель квадратная: в ряду 6 клеток, рядов тоже 6.',
        a: 'Сколько всего клеток в панели?',
        o: ['12', '36', '24', '6'],
        y: 'У квадрата и длина, и ширина равны 6. Умножаем 6 на 6, получается 36 клеток.',
        n: 'Умножь число клеток в ряду на число рядов.',
        by: [
          'Это две стороны вместе. А клеток гораздо больше.',
          undefined,
          'Это путь по краю: четыре стороны по 6. А мы считаем внутреннее.',
          'Это только один ряд. А рядов шесть.',
        ],
        r: 'Площадь квадрата это сторона, умноженная на себя.',
      }, undefined, {
        en: {
          e: 'A square panel', s: 'The panel is a square: 6 cells in a row and 6 rows as well.',
          a: 'How many cells are there in the panel altogether?',
          o: ['12', '36', '24', '6'],
          y: 'In a square both the length and the width are 6. We multiply 6 by 6 and get 36 cells.',
          n: 'Multiply the number of cells in a row by the number of rows.',
          by: [
            'That is two sides together. And there are far more cells than that.',
            undefined,
            'That is the path along the edge: four sides of 6. And we are counting the inside.',
            'That is only one row. And there are six rows.',
          ],
          r: 'The area of a square is the side multiplied by itself.',
        },
      }),

    /* 2 · dnd · 🟢 — kvadratmi yoki yo'q. */
    q('02', 'Kvadratmi?', '🟢', 'd36-is-square', 'dnd', '⬜', [0, 1, 0, 1],
      {
        e: 'Shaklni taning', s: "To'rtta panel. Kvadratda ikkala o'lchov ham bir xil.",
        a: 'Panellarni ajrating: qaysilari kvadrat, qaysilari emas.',
        tokens: ['5 sm va 5 sm', '6 sm va 4 sm', '3 sm va 3 sm', '7 sm va 2 sm'],
        zones: ['Kvadrat', 'Kvadrat emas'],
        dndHint: 'Panellar tugadi.',
        y: "5 ga 5 va 3 ga 3 da tomonlar teng — bu kvadrat. Qolganlarida tomonlar har xil.",
        n: 'Ikkala o\'lchovni solishtiring: ular tengmi?',
        r: 'Kvadratda hamma tomon teng.',
      },
      {
        e: 'Узнай фигуру', s: 'Четыре панели. У квадрата оба измерения одинаковые.',
        a: 'Разложи панели: какие квадратные, а какие нет.',
        tokens: ['5 см и 5 см', '6 см и 4 см', '3 см и 3 см', '7 см и 2 см'],
        zones: ['Квадрат', 'Не квадрат'],
        dndHint: 'Панели закончились.',
        y: 'У 5 на 5 и 3 на 3 стороны равны — это квадрат. У остальных стороны разные.',
        n: 'Сравни оба измерения: они равны?',
        r: 'У квадрата все стороны равны.',
      }, undefined, {
        en: {
          e: 'Name the shape', s: 'Four panels. A square has both measurements the same.',
          a: 'Sort the panels: which ones are squares and which are not.',
          tokens: ['5 cm and 5 cm', '6 cm and 4 cm', '3 cm and 3 cm', '7 cm and 2 cm'],
          zones: ['A square', 'Not a square'],
          dndHint: 'No panels left.',
          y: '5 by 5 and 3 by 3 have equal sides — those are squares. The others have different sides.',
          n: 'Compare both measurements: are they equal?',
          r: 'In a square all the sides are equal.',
        },
      }),

    /* 3 · multi · 🟢 — yuzasi 25. */
    q('03', 'Yuza 25', '🟢', 'd36-is25', 'multi', '🎯', [0, 2],
      {
        e: 'Qaysi biri 25?', s: "To'rtta yozuv. Ikkitasi 25 kvadrat santimetr beradi.",
        a: 'Qaysi yozuvlar 25 sm² beradi? Hammasini belgilang.',
        o: ['Tomoni 5 sm bo\'lgan kvadrat', 'Tomoni 4 sm bo\'lgan kvadrat', '5 · 5', '5 + 5 + 5 + 5'],
        y: "Tomoni 5 bo'lgan kvadrat va 5 · 5 — bir xil narsa, 25 kvadrat santimetr.",
        n: 'Kvadrat yuzasi tomonni o\'ziga ko\'paytirgani.',
        r: "Tomoni a bo'lgan kvadratning yuzasi a ni a ga ko'paytirgani.",
      },
      {
        e: 'Где 25?', s: 'Четыре записи. Две дают 25 квадратных сантиметров.',
        a: 'Какие записи дают 25 см²? Отметь все.',
        o: ['Квадрат со стороной 5 см', 'Квадрат со стороной 4 см', '5 · 5', '5 + 5 + 5 + 5'],
        y: 'Квадрат со стороной 5 и 5 · 5 — это одно и то же, 25 квадратных сантиметров.',
        n: 'Площадь квадрата это сторона, умноженная на себя.',
        r: 'Площадь квадрата со стороной a это a, умноженное на a.',
      }, undefined, {
        en: {
          e: 'Where is 25?', s: 'Four records. Two of them give 25 square centimetres.',
          a: 'Which records give 25 cm²? Mark them all.',
          o: ['A square with a side of 5 cm', 'A square with a side of 4 cm', '5 · 5', '5 + 5 + 5 + 5'],
          y: 'A square with a side of 5 and 5 · 5 are one and the same, 25 square centimetres.',
          n: 'The area of a square is the side multiplied by itself.',
          r: 'The area of a square with side a is a multiplied by a.',
        },
      }),

    /* 4 · match · 🟡 — tomon va yuza. */
    q('04', 'Tomon va yuza', '🟡', 'd36-match-side', 'match', '🔗', [0, 1, 2],
      {
        e: 'Uch kvadrat', s: 'Har kvadratning tomoni berilgan.',
        a: 'Har kvadratni uning yuzasiga ulang.',
        left: ['Tomoni 3 sm', 'Tomoni 6 sm', 'Tomoni 8 sm'],
        right: ['9 sm²', '36 sm²', '64 sm²'],
        y: '3 · 3 = 9, 6 · 6 = 36, 8 · 8 = 64.',
        n: 'Har kvadratda tomonni o\'ziga ko\'paytiring.',
        r: 'Kvadrat yuzasi tomonning o\'ziga ko\'paytmasi.',
      },
      {
        e: 'Три квадрата', s: 'У каждого квадрата дана сторона.',
        a: 'Соедини каждый квадрат с его площадью.',
        left: ['Сторона 3 см', 'Сторона 6 см', 'Сторона 8 см'],
        right: ['9 см²', '36 см²', '64 см²'],
        y: '3 · 3 = 9, 6 · 6 = 36, 8 · 8 = 64.',
        n: 'В каждом квадрате умножь сторону на себя.',
        r: 'Площадь квадрата это произведение стороны на себя.',
      }, undefined, {
        en: {
          e: 'Three squares', s: 'Every square is given by its side.',
          a: 'Connect each square with its area.',
          left: ['A side of 3 cm', 'A side of 6 cm', 'A side of 8 cm'],
          right: ['9 cm²', '36 cm²', '64 cm²'],
          y: '3 · 3 = 9, 6 · 6 = 36, 8 · 8 = 64.',
          n: 'For every square multiply the side by itself.',
          r: 'The area of a square is the side multiplied by itself.',
        },
      }),

    /* 5 · input · 🟡 — yuzadan tomonga. */
    q('05', 'Tomonni toping', '🟡', 'd36-side-from-area', 'input', '🧩', ['7'],
      {
        e: 'Teskari masala', s: "Kvadrat panelning yuzasi 49 sm².",
        a: 'Bitta tomoni necha santimetr?',
        y: "Qaysi son o'ziga ko'paytirilganda 49 beradi? Yetti. Demak tomon 7 santimetr.",
        n: 'O\'ziga ko\'paytirilganda 49 beradigan sonni tanlang.',
        r: 'Kvadrat tomoni — o\'ziga ko\'paytirilganda yuzani beradigan son.',
        p: 'Javob',
      },
      {
        e: 'Обратная задача', s: 'Площадь квадратной панели 49 см².',
        a: 'Чему равна одна сторона в сантиметрах?',
        y: 'Какое число, умноженное на себя, даёт 49? Семь. Значит сторона 7 сантиметров.',
        n: 'Подбери число, которое при умножении на себя даёт 49.',
        r: 'Сторона квадрата — это число, которое при умножении на себя даёт площадь.',
        p: 'Ответ',
      }, 'numeric', {
        en: {
          e: 'The problem in reverse', s: 'A square panel has an area of 49 cm².',
          a: 'How many centimetres is one side?',
          y: 'Which number multiplied by itself gives 49? Seven. So the side is 7 centimetres.',
          n: 'Look for a number that gives 49 when multiplied by itself.',
          r: 'The side of a square is the number that gives the area when multiplied by itself.',
          p: 'Answer',
        },
      }),

    /* 6 · multi · 🟡 — kvadrat haqida to'g'ri gaplar. */
    q('06', 'To\'g\'ri gaplar', '🟡', 'd36-true-facts', 'multi', '✅', [0, 2],
      {
        e: 'Ta\'rifni aniqlaymiz', s: "To'rtta gap. Ikkitasi kvadrat haqida to'g'ri.",
        a: 'Qaysi gaplar to\'g\'ri? Hammasini belgilang.',
        o: [
          'Kvadratda hamma tomon teng',
          'Kvadrat yuzasi tomonni to\'rtga ko\'paytirgani',
          'Kvadrat yuzasi uchun bitta son yetadi',
          'Kvadratning yuzasi perimetriga teng',
        ],
        y: "Kvadratda tomonlar teng, shuning uchun yuzani topishga bitta son yetadi.",
        n: 'Tomonni to\'rtga ko\'paytirsak perimetr chiqadi, yuza emas.',
        r: 'Kvadratda bitta tomon hamma o\'lchovni beradi.',
      },
      {
        e: 'Уточняем определение', s: 'Четыре утверждения. Два из них верны про квадрат.',
        a: 'Какие утверждения верны? Отметь все.',
        o: [
          'У квадрата все стороны равны',
          'Площадь квадрата это сторона, умноженная на четыре',
          'Для площади квадрата хватает одного числа',
          'Площадь квадрата равна его периметру',
        ],
        y: 'У квадрата стороны равны, поэтому для площади хватает одного числа.',
        n: 'Сторона, умноженная на четыре, даёт периметр, а не площадь.',
        r: 'У квадрата одна сторона задаёт все измерения.',
      }, undefined, {
        en: {
          e: 'Sharpen the definition', s: 'Four statements. Two of them are true about a square.',
          a: 'Which statements are true? Mark them all.',
          o: ['A square has all its sides equal', 'The area of a square is the side multiplied by four', 'One number is enough for the area of a square', 'The area of a square equals its perimeter'],
          y: 'A square has equal sides, so one number is enough for its area.',
          n: 'The side multiplied by four gives the perimeter, not the area.',
          r: 'In a square one side sets all the measurements.',
        },
      }),

    /* 7 · order · 🟡 — yuza bo'yicha tartib. */
    q('07', 'Kichigidan kattasiga', '🟡', 'd36-sort', 'order', '📈', [1, 3, 0, 2],
      {
        e: 'To\'rt kvadrat', s: 'Har birining tomoni berilgan.',
        a: 'Kvadratlarni yuzasi bo\'yicha kichigidan kattasiga tartiblang.',
        o: ['Tomoni 5 sm', 'Tomoni 2 sm', 'Tomoni 7 sm', 'Tomoni 4 sm'],
        y: '2 · 2 = 4, keyin 4 · 4 = 16, keyin 5 · 5 = 25, oxirida 7 · 7 = 49.',
        n: 'Har kvadratda tomonni o\'ziga ko\'paytiring, keyin solishtiring.',
        r: 'Tomon katta bo\'lsa, yuza ham katta.',
      },
      {
        e: 'Четыре квадрата', s: 'У каждого дана сторона.',
        a: 'Расставь квадраты по площади от меньшей к большей.',
        o: ['Сторона 5 см', 'Сторона 2 см', 'Сторона 7 см', 'Сторона 4 см'],
        y: '2 · 2 = 4, потом 4 · 4 = 16, потом 5 · 5 = 25, в конце 7 · 7 = 49.',
        n: 'В каждом квадрате умножь сторону на себя, потом сравни.',
        r: 'Чем больше сторона, тем больше площадь.',
      }, undefined, {
        en: {
          e: 'Four squares', s: 'Each one is given by its side.',
          a: 'Put the squares in order of their area, from the smallest to the largest.',
          o: ['A side of 5 cm', 'A side of 2 cm', 'A side of 7 cm', 'A side of 4 cm'],
          y: '2 · 2 = 4, then 4 · 4 = 16, then 5 · 5 = 25, and 7 · 7 = 49 at the end.',
          n: 'For every square multiply the side by itself, then compare.',
          r: 'The bigger the side, the bigger the area.',
        },
      }),

    /* 8 · choice · 🔴 — yuza va perimetr birga. */
    q('08', 'Yuza va perimetr', '🔴', 'd36-area-vs-perimeter', 'choice', '🔎', 2,
      {
        e: 'Ikki kattalik', s: "Kvadratning tomoni 4 sm.",
        a: 'Yuzasi va perimetri qanday?',
        o: [
          'Yuza 16 sm, perimetr 16 sm²',
          'Yuza 8 sm², perimetr 16 sm',
          'Yuza 16 sm², perimetr 16 sm',
          'Yuza 16 sm², perimetr 8 sm',
        ],
        y: "Yuza 4 · 4 = 16 kvadrat santimetr, perimetr 4 + 4 + 4 + 4 = 16 santimetr. Sonlar teng, birliklar boshqa.",
        n: 'Yuza kvadrat santimetrda, perimetr oddiy santimetrda o\'lchanadi.',
        by: [
          'Birliklar almashib qolgan: yuza kvadrat santimetrda o\'lchanadi.',
          "Bu ikkita tomon. Yuza esa to'rtni to'rtga ko'paytirgani.",
          undefined,
          "Bu ikkita tomon. Perimetrda to'rtta tomon qo'shiladi.",
        ],
        r: 'Son teng chiqishi mumkin, lekin kattaliklar va birliklar boshqa.',
      },
      {
        e: 'Две величины', s: 'Сторона квадрата 4 см.',
        a: 'Чему равны его площадь и периметр?',
        o: [
          'Площадь 16 см, периметр 16 см²',
          'Площадь 8 см², периметр 16 см',
          'Площадь 16 см², периметр 16 см',
          'Площадь 16 см², периметр 8 см',
        ],
        y: 'Площадь 4 · 4 = 16 квадратных сантиметров, периметр 4 + 4 + 4 + 4 = 16 сантиметров. Числа равны, единицы разные.',
        n: 'Площадь измеряют в квадратных сантиметрах, периметр в обычных.',
        by: [
          'Единицы перепутаны: площадь измеряют в квадратных сантиметрах.',
          'Это две стороны. А площадь это четыре, умноженное на четыре.',
          undefined,
          'Это две стороны. В периметре складывают четыре стороны.',
        ],
        r: 'Числа могут совпасть, но величины и единицы разные.',
      }, undefined, {
        en: {
          e: 'Two measures', s: 'A square has a side of 4 cm.',
          a: 'What are its area and its perimeter?',
          o: ['Area 16 cm, perimeter 16 cm²', 'Area 8 cm², perimeter 16 cm', 'Area 16 cm², perimeter 16 cm', 'Area 16 cm², perimeter 8 cm'],
          y: 'The area is 4 · 4 = 16 square centimetres and the perimeter is 4 + 4 + 4 + 4 = 16 centimetres. The numbers are equal but the units are different.',
          n: 'Area is measured in square centimetres and perimeter in ordinary ones.',
          by: [
            'The units are mixed up: area is measured in square centimetres.',
            'That is two sides. And the area is four multiplied by four.',
            undefined,
            'That is two sides. A perimeter adds up four sides.',
          ],
          r: 'The numbers can match, but the measures and the units are different.',
        },
      }),

    /* 9 · input · 🔴 — perimetrdan yuzaga. */
    q('09', 'Perimetrdan yuzaga', '🔴', 'd36-from-perimeter', 'input', '🔁', ['36'],
      {
        e: 'Ikki qadam', s: "Kvadratning perimetri 24 sm.",
        a: 'Yuzasi necha kvadrat santimetr?',
        y: "24 ni 4 ga bo'lsak, tomon 6 santimetr. Keyin 6 ni 6 ga ko'paytiramiz, 36 kvadrat santimetr.",
        n: 'Avval perimetrdan tomonni toping, keyin yuzani hisoblang.',
        r: 'Perimetrdan tomonga — bo\'lish, tomondan yuzaga — ko\'paytirish.',
        p: 'Javob',
      },
      {
        e: 'Два шага', s: 'Периметр квадрата 24 см.',
        a: 'Чему равна площадь в квадратных сантиметрах?',
        y: 'Делим 24 на 4, сторона 6 сантиметров. Потом умножаем 6 на 6, получается 36 квадратных сантиметров.',
        n: 'Сначала найди сторону из периметра, потом посчитай площадь.',
        r: 'От периметра к стороне — деление, от стороны к площади — умножение.',
        p: 'Ответ',
      }, 'numeric', {
        en: {
          e: 'Two steps', s: 'A square has a perimeter of 24 cm.',
          a: 'How many square centimetres is the area?',
          y: 'We divide 24 by 4 and the side is 6 centimetres. Then we multiply 6 by 6 and get 36 square centimetres.',
          n: 'Find the side from the perimeter first, then work out the area.',
          r: 'From the perimeter to the side is a division, from the side to the area a multiplication.',
          p: 'Answer',
        },
      }),

    /* 10 · dnd · 🔴 — to'g'ri yoki xato yechim. */
    q('10', 'To\'g\'ri yechilganmi?', '🔴', 'd36-check', 'dnd', '🚀', [0, 1, 0, 1],
      {
        e: 'Yakuniy mashq', s: "To'rtta yechim. Ikkitasida yuza o'rniga perimetr hisoblangan.",
        a: 'Yechimlarni ajrating: qaysilari to\'g\'ri, qaysilari xato.',
        tokens: [
          'Tomoni 5, yuza 25 sm²',
          'Tomoni 5, yuza 20 sm²',
          'Tomoni 3, yuza 9 sm²',
          'Tomoni 3, yuza 12 sm²',
        ],
        zones: ["To'g'ri", 'Xato'],
        dndHint: 'Yechimlar tugadi.',
        y: "Xato yechimlarda tomon to'rtga ko'paytirilgan — bu perimetr. Yuza esa tomonni o'ziga ko'paytirgani.",
        n: 'Har yechimda tekshiring: tomon o\'ziga ko\'paytirilganmi yoki to\'rtga?',
        r: 'Tomonni to\'rtga ko\'paytirish perimetr beradi, yuza emas.',
      },
      {
        e: 'Итоговое задание', s: 'Четыре решения. В двух вместо площади посчитали периметр.',
        a: 'Разложи решения: какие верные, а какие с ошибкой.',
        tokens: [
          'Сторона 5, площадь 25 см²',
          'Сторона 5, площадь 20 см²',
          'Сторона 3, площадь 9 см²',
          'Сторона 3, площадь 12 см²',
        ],
        zones: ['Верно', 'Ошибка'],
        dndHint: 'Решения закончились.',
        y: 'В неверных решениях сторону умножили на четыре — это периметр. А площадь это сторона, умноженная на себя.',
        n: 'Проверь в каждом решении: сторону умножили на себя или на четыре?',
        r: 'Умножение стороны на четыре даёт периметр, а не площадь.',
      }, undefined, {
        en: {
          e: 'Final task', s: 'Four solutions. In two of them the perimeter was worked out instead of the area.',
          a: 'Sort the solutions: which ones are right and which have a mistake.',
          tokens: ['Side 5, area 25 cm²', 'Side 5, area 20 cm²', 'Side 3, area 9 cm²', 'Side 3, area 12 cm²'],
          zones: ['Right', 'A mistake'],
          dndHint: 'No solutions left.',
          y: 'In the wrong solutions the side was multiplied by four — that is the perimeter. And the area is the side multiplied by itself.',
          n: 'Check in every solution: was the side multiplied by itself or by four?',
          r: 'Multiplying the side by four gives the perimeter, not the area.',
        },
      }),
  ],
};

export default DARS36_BANK;
