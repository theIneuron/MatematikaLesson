// Dars 37 amaliyoti — Shakllarni o'lchov bo'yicha solishtirish.
// Nazariya: src/components/grade3/Dars37.jsx (num-3-37).
// Yuzasi teng shakllarning perimetri har xil bo'lishi mumkin: 2 ga 8 va 4 ga 4 panelda
// kataklar teng (16), chekka esa 20 va 16; solishtirish har doim BITTA kattalik bo'yicha.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 multi · 2 choice · 3 match · 4 dnd · 5 order · 6 input · 7 dnd · 8 input · 9 match · 10 order
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS37_BANK = {
  title: "Dars 37 · Shakllarni solishtirish",
  items: [

    /* 1 · multi · 🟢 — yuzasi 16 bo'lganlar. */
    q('01', 'Yuza 16', '🟢', 'd37-area16', 'multi', '🎯', [0, 2],
      {
        e: 'Ko\'rinishi aldaydi', s: "To'rtta panel. Ikkitasining yuzasi 16 sm², garchi ko'rinishi boshqa bo'lsa ham.",
        a: 'Qaysi panellarning yuzasi 16 sm²? Hammasini belgilang.',
        o: ['2 sm va 8 sm', '3 sm va 6 sm', '4 sm va 4 sm', '5 sm va 4 sm'],
        y: '2 · 8 = 16 va 4 · 4 = 16. Cho\'ziq panel faqat kattaroq ko\'rinadi, kataklar esa teng.',
        n: 'Har panelda uzunlikni enga ko\'paytiring, ko\'rinishiga qaramang.',
        r: 'Bir xil yuzani turli tomonlar bilan hosil qilish mumkin.',
      },
      {
        e: 'Внешность обманывает', s: 'Четыре панели. У двух площадь 16 см², хотя выглядят они по-разному.',
        a: 'У каких панелей площадь 16 см²? Отметь все.',
        o: ['2 см и 8 см', '3 см и 6 см', '4 см и 4 см', '5 см и 4 см'],
        y: '2 · 8 = 16 и 4 · 4 = 16. Вытянутая панель только кажется больше, а клеток поровну.',
        n: 'В каждой панели умножь длину на ширину, не смотри на вид.',
        r: 'Одну и ту же площадь можно получить разными сторонами.',
      }, undefined, {
        en: {
          e: 'Looks can fool you', s: 'Four panels. Two of them have an area of 16 cm², although they look quite different.',
          a: 'Which panels have an area of 16 cm²? Mark them all.',
          o: ['2 cm and 8 cm', '3 cm and 6 cm', '4 cm and 4 cm', '5 cm and 4 cm'],
          y: '2 · 8 = 16 and 4 · 4 = 16. The stretched panel only looks bigger, but it has just as many cells.',
          n: 'For every panel multiply the length by the width, do not go by looks.',
          r: 'The same area can be made with different sides.',
        },
      }),

    /* 2 · choice · 🟢 — perimetri har xil. */
    q('02', 'Yuza teng, chekka?', '🟢', 'd37-same-area', 'choice', '🔒', 1,
      {
        e: 'Ikki panel', s: "Ikki panel: 2 ga 8 va 4 ga 4. Ikkalasining yuzasi 16 sm².",
        a: 'Perimetrlari haqida nima deyish mumkin?',
        o: [
          'Perimetrlari ham teng',
          'Cho\'ziq panelning perimetri kattaroq',
          'Kvadratning perimetri kattaroq',
          'Perimetrni bilib bo\'lmaydi',
        ],
        y: "Cho'ziqda 2 + 8 + 2 + 8 = 20, kvadratda 4 + 4 + 4 + 4 = 16. Yuza teng, chekka esa har xil.",
        n: 'Har panelning to\'rtta tomonini qo\'shing va solishtiring.',
        by: [
          "Hisoblab ko'ring: 20 va 16 chiqadi, ular teng emas.",
          undefined,
          "Aksincha: kvadratning chekkasi qisqaroq, 16 santimetr.",
          "Tomonlar berilgan, demak perimetrni hisoblash mumkin.",
        ],
        r: 'Yuzasi teng shakllarning perimetri har xil bo\'lishi mumkin.',
      },
      {
        e: 'Две панели', s: 'Две панели: 2 на 8 и 4 на 4. У обеих площадь 16 см².',
        a: 'Что можно сказать про их периметры?',
        o: [
          'Периметры тоже равны',
          'У вытянутой панели периметр больше',
          'У квадрата периметр больше',
          'Периметр узнать нельзя',
        ],
        y: 'У вытянутой 2 + 8 + 2 + 8 = 20, у квадрата 4 + 4 + 4 + 4 = 16. Площадь равна, а край разный.',
        n: 'Сложи четыре стороны каждой панели и сравни.',
        by: [
          'Посчитай: выходит 20 и 16, они не равны.',
          undefined,
          'Наоборот: у квадрата край короче, 16 сантиметров.',
          'Стороны даны, значит периметр посчитать можно.',
        ],
        r: 'У фигур с равной площадью периметр может быть разным.',
      }, undefined, {
        en: {
          e: 'Two panels', s: 'Two panels: 2 by 8 and 4 by 4. Both have an area of 16 cm².',
          a: 'What can be said about their perimeters?',
          o: ['The perimeters are equal too', 'The stretched panel has the bigger perimeter', 'The square has the bigger perimeter', 'The perimeter cannot be found'],
          y: 'The stretched one gives 2 + 8 + 2 + 8 = 20 and the square 4 + 4 + 4 + 4 = 16. The area is equal but the edge is different.',
          n: 'Add up the four sides of each panel and compare.',
          by: [
            'Work it out: you get 20 and 16, and they are not equal.',
            undefined,
            'It is the other way round: the square has the shorter edge, 16 centimetres.',
            'The sides are given, so the perimeter can be worked out.',
          ],
          r: 'Shapes with equal areas can have different perimeters.',
        },
      }),

    /* 3 · match · 🟢 — panel va perimetr. */
    q('03', 'Panel va perimetr', '🟢', 'd37-match-perimeter', 'match', '🔗', [0, 1, 2],
      {
        e: 'Uch panel', s: 'Uchala panelning yuzasi bir xil: 16 sm². Chekka esa har xil.',
        a: 'Har panelni uning perimetriga ulang.',
        left: ['1 sm va 16 sm', '2 sm va 8 sm', '4 sm va 4 sm'],
        right: ['34 sm', '20 sm', '16 sm'],
        y: "1+16+1+16 = 34, 2+8+2+8 = 20, 4+4+4+4 = 16. Shakl kvadratga yaqinlashsa, chekka qisqaradi.",
        n: 'Har panelda to\'rtta tomonni qo\'shing.',
        r: 'Yuzasi teng shakllar orasida kvadratning perimetri eng kichik.',
      },
      {
        e: 'Три панели', s: 'У всех трёх площадь одинаковая: 16 см². А край разный.',
        a: 'Соедини каждую панель с её периметром.',
        left: ['1 см и 16 см', '2 см и 8 см', '4 см и 4 см'],
        right: ['34 см', '20 см', '16 см'],
        y: '1+16+1+16 = 34, 2+8+2+8 = 20, 4+4+4+4 = 16. Чем ближе фигура к квадрату, тем короче край.',
        n: 'В каждой панели сложи четыре стороны.',
        r: 'Среди фигур с равной площадью у квадрата периметр самый маленький.',
      }, undefined, {
        en: {
          e: 'Three panels', s: 'All three have the same area: 16 cm². But the edge is different.',
          a: 'Connect each panel with its perimeter.',
          left: ['1 cm and 16 cm', '2 cm and 8 cm', '4 cm and 4 cm'],
          right: ['34 cm', '20 cm', '16 cm'],
          y: '1+16+1+16 = 34, 2+8+2+8 = 20, 4+4+4+4 = 16. The closer a shape is to a square, the shorter its edge.',
          n: 'For every panel add up the four sides.',
          r: 'Among shapes with equal areas the square has the smallest perimeter.',
        },
      }),

    /* 4 · dnd · 🟡 — qaysi kattalik bo'yicha teng. */
    q('04', 'Nimasi teng?', '🟡', 'd37-equal-what', 'dnd', '⚖️', [0, 1, 0, 1],
      {
        e: 'Juftliklarni tekshiring', s: "To'rtta juftlik. Ba'zilarida yuza teng, ba'zilarida perimetr.",
        a: 'Juftliklarni ajrating: qayerda yuza teng, qayerda perimetr.',
        tokens: [
          '2 ga 8 va 4 ga 4',
          '2 ga 6 va 3 ga 5',
          '3 ga 8 va 4 ga 6',
          '1 ga 9 va 4 ga 6',
        ],
        zones: ['Yuza teng', 'Perimetr teng'],
        dndHint: 'Juftliklar tugadi.',
        y: "2·8 = 16 va 4·4 = 16 — yuza teng. 2+6+2+6 = 16 va 3+5+3+5 = 16 — perimetr teng.",
        n: 'Har juftlikda avval yuzalarni, keyin perimetrlarni solishtiring.',
        r: 'Solishtirish har doim BITTA kattalik bo\'yicha boradi.',
      },
      {
        e: 'Проверь пары', s: 'Четыре пары. В одних равна площадь, в других периметр.',
        a: 'Разложи пары: где равна площадь, а где периметр.',
        tokens: [
          '2 на 8 и 4 на 4',
          '2 на 6 и 3 на 5',
          '3 на 8 и 4 на 6',
          '1 на 9 и 4 на 6',
        ],
        zones: ['Равна площадь', 'Равен периметр'],
        dndHint: 'Пары закончились.',
        y: '2·8 = 16 и 4·4 = 16 — равна площадь. 2+6+2+6 = 16 и 3+5+3+5 = 16 — равен периметр.',
        n: 'В каждой паре сначала сравни площади, потом периметры.',
        r: 'Сравнение всегда идёт по ОДНОЙ величине.',
      }, undefined, {
        en: {
          e: 'Check the pairs', s: 'Four pairs. In some the area is equal, in others the perimeter.',
          a: 'Sort the pairs: where the area is equal and where the perimeter.',
          tokens: ['2 by 8 and 4 by 4', '2 by 6 and 3 by 5', '3 by 8 and 4 by 6', '1 by 9 and 4 by 6'],
          zones: ['The area is equal', 'The perimeter is equal'],
          dndHint: 'No pairs left.',
          y: '2·8 = 16 and 4·4 = 16 — the area is equal. 2+6+2+6 = 16 and 3+5+3+5 = 16 — the perimeter is equal.',
          n: 'In every pair compare the areas first, then the perimeters.',
          r: 'A comparison always goes by ONE measure.',
        },
      }),

    /* 5 · order · 🟡 — perimetr bo'yicha tartib. */
    q('05', 'Chekka bo\'yicha', '🟡', 'd37-sort-perimeter', 'order', '📈', [2, 1, 0, 3],
      {
        e: 'Yuza bir xil', s: "To'rtta panelning yuzasi bir xil: 24 sm². Chekka esa har xil.",
        a: 'Panellarni perimetri bo\'yicha kichigidan kattasiga tartiblang.',
        o: ['2 sm va 12 sm', '3 sm va 8 sm', '4 sm va 6 sm', '1 sm va 24 sm'],
        y: "4 ga 6 — 20, keyin 3 ga 8 — 22, keyin 2 ga 12 — 28, oxirida 1 ga 24 — 50.",
        n: 'Har panelning to\'rtta tomonini qo\'shing.',
        r: 'Shakl cho\'zilgan sari chekka uzayadi, yuza esa o\'zgarmaydi.',
      },
      {
        e: 'Площадь одна', s: 'У четырёх панелей площадь одинаковая: 24 см². А край разный.',
        a: 'Расставь панели по периметру от меньшего к большему.',
        o: ['2 см и 12 см', '3 см и 8 см', '4 см и 6 см', '1 см и 24 см'],
        y: '4 на 6 — 20, потом 3 на 8 — 22, потом 2 на 12 — 28, в конце 1 на 24 — 50.',
        n: 'Сложи четыре стороны каждой панели.',
        r: 'Чем сильнее фигура вытянута, тем длиннее край, а площадь не меняется.',
      }, undefined, {
        en: {
          e: 'One and the same area', s: 'Four panels have the same area: 24 cm². But the edge is different.',
          a: 'Put the panels in order of their perimeter, from the smallest to the largest.',
          o: ['2 cm and 12 cm', '3 cm and 8 cm', '4 cm and 6 cm', '1 cm and 24 cm'],
          y: '4 by 6 gives 20, then 3 by 8 gives 22, then 2 by 12 gives 28, and 1 by 24 gives 50 at the end.',
          n: 'Add up the four sides of every panel.',
          r: 'The more stretched a shape is, the longer its edge, while the area stays the same.',
        },
        orderBy: "perimetr bo'yicha, tomon uzunligi bo'yicha emas",
      }),

    /* 6 · input · 🟡 — yuza teng, tomonni toping. */
    q('06', 'Ikkinchi panel', '🟡', 'd37-same-area-side', 'input', '🧩', ['3'],
      {
        e: 'Yuza teng bo\'lsin', s: "Birinchi panel 2 ga 9. Ikkinchi panelning bir tomoni 6 sm, yuzasi esa birinchisiga teng.",
        a: 'Ikkinchi panelning ikkinchi tomoni necha santimetr?',
        y: "Birinchi panelning yuzasi 2 · 9 = 18. Ikkinchisida 18 : 6 = 3 santimetr.",
        n: 'Avval birinchi panelning yuzasini toping, keyin uni ma\'lum tomonga bo\'ling.',
        r: 'Yuza teng bo\'lsa, noma\'lum tomon bo\'lish bilan topiladi.',
        p: 'Javob',
      },
      {
        e: 'Пусть площадь совпадёт', s: 'Первая панель 2 на 9. У второй одна сторона 6 см, а площадь такая же, как у первой.',
        a: 'Чему равна вторая сторона второй панели в сантиметрах?',
        y: 'Площадь первой панели 2 · 9 = 18. У второй 18 : 6 = 3 сантиметра.',
        n: 'Сначала найди площадь первой панели, потом раздели её на известную сторону.',
        r: 'Если площадь равна, неизвестную сторону находят делением.',
        p: 'Ответ',
      }, 'numeric', {
        en: {
          e: 'Make the areas match', s: 'The first panel is 2 by 9. The second has one side of 6 cm and the same area as the first.',
          a: 'How many centimetres is the second side of the second panel?',
          y: 'The area of the first panel is 2 · 9 = 18. For the second, 18 : 6 = 3 centimetres.',
          n: 'Find the area of the first panel first, then divide it by the side you know.',
          r: 'When the areas are equal, the unknown side is found by dividing.',
          p: 'Answer',
        },
      }),

    /* 7 · dnd · 🟡 — qaysi kattalik bo'yicha solishtirish kerak. */
    q('07', 'Qaysi kattalik bo\'yicha?', '🟡', 'd37-which-quantity', 'dnd', '🧭', [0, 1, 0, 1],
      {
        e: 'Savolga qarang', s: "To'rtta savol. Ular turli kattalik haqida.",
        a: 'Savollarni ajrating: qayerda yuza, qayerda perimetr bo\'yicha solishtiriladi.',
        tokens: [
          'Qaysi xonaga ko\'proq plitka ketadi?',
          'Qaysi bog\'ga ko\'proq panjara kerak?',
          'Qaysi devorga ko\'proq oboy ketadi?',
          'Qaysi rasmga uzunroq ramka kerak?',
        ],
        zones: ['Yuza bo\'yicha', 'Perimetr bo\'yicha'],
        dndHint: 'Savollar tugadi.',
        y: "Plitka va oboy ichkarini qoplaydi — yuza. Panjara va ramka chekka bo'ylab boradi — perimetr.",
        n: 'Bu narsa ichkarini qoplaydimi yoki chekka bo\'ylab boradimi?',
        r: 'Savol qaysi kattalik bo\'yicha solishtirishni hal qiladi.',
      },
      {
        e: 'Смотри на вопрос', s: 'Четыре вопроса. Они про разные величины.',
        a: 'Разложи вопросы: где сравнивают по площади, а где по периметру.',
        tokens: [
          'На какую комнату уйдёт больше плитки?',
          'Вокруг какого сада нужно больше забора?',
          'На какую стену уйдёт больше обоев?',
          'Для какой картины нужна рамка длиннее?',
        ],
        zones: ['По площади', 'По периметру'],
        dndHint: 'Вопросы закончились.',
        y: 'Плитка и обои покрывают внутреннее — площадь. Забор и рамка идут по краю — периметр.',
        n: 'Эта вещь покрывает внутреннее или идёт по краю?',
        r: 'Вопрос решает, по какой величине сравнивать.',
      }, undefined, {
        en: {
          e: 'Watch the question', s: 'Four questions. They are about different measures.',
          a: 'Sort the questions: where the comparison goes by area and where by perimeter.',
          tokens: ['Which room needs more tiles?', 'Which garden needs more fence around it?', 'Which wall needs more wallpaper?', 'Which picture needs a longer frame?'],
          zones: ['By area', 'By perimeter'],
          dndHint: 'No questions left.',
          y: 'Tiles and wallpaper cover the inside — that is area. A fence and a frame run along the edge — that is perimeter.',
          n: 'Does this thing cover the inside or run along the edge?',
          r: 'The question decides which measure the comparison goes by.',
        },
      }),

    /* 8 · input · 🔴 — perimetr teng, yuza har xil. */
    q('08', 'Chekka teng', '🔴', 'd37-same-perimeter', 'input', '🔁', ['20'],
      {
        e: 'Teskari holat', s: "Ikki panelning perimetri bir xil: 18 sm. Birinchisi 3 ga 6.",
        a: 'Ikkinchi panel 5 ga 4 bo\'lsa, uning yuzasi necha kvadrat santimetr?',
        y: "5 · 4 = 20 kvadrat santimetr. Birinchisida esa 3 · 6 = 18. Perimetr teng, yuza har xil.",
        n: 'Uzunlikni enga ko\'paytiring.',
        r: 'Perimetri teng shakllarning yuzasi har xil bo\'lishi mumkin.',
        p: 'Javob',
      },
      {
        e: 'Обратный случай', s: 'У двух панелей периметр одинаковый: 18 см. Первая 3 на 6.',
        a: 'Вторая панель 5 на 4 — чему равна её площадь в квадратных сантиметрах?',
        y: '5 · 4 = 20 квадратных сантиметров. А у первой 3 · 6 = 18. Периметр равен, площадь разная.',
        n: 'Умножь длину на ширину.',
        r: 'У фигур с равным периметром площадь может быть разной.',
        p: 'Ответ',
      }, 'numeric', {
        en: {
          e: 'The other way round', s: 'Two panels have the same perimeter: 18 cm. The first is 3 by 6.',
          a: 'The second panel is 5 by 4 — how many square centimetres is its area?',
          y: '5 · 4 = 20 square centimetres. And the first gives 3 · 6 = 18. The perimeter is equal but the area is not.',
          n: 'Multiply the length by the width.',
          r: 'Shapes with equal perimeters can have different areas.',
          p: 'Answer',
        },
      }),

    /* 9 · match · 🔴 — savol va kattalik. */
    q('09', 'Savol va kattalik', '🔴', 'd37-match-question', 'match', '🧩', [0, 1, 2],
      {
        e: 'Uch savol', s: 'Har savol o\'z kattaligini talab qiladi.',
        a: 'Har savolni kerakli kattalikka ulang.',
        left: ['Polga plitka', 'Xona atrofiga plintus', 'Bitta tomon uzunligi'],
        right: ['Yuza', 'Perimetr', 'Tomon'],
        y: "Plitka yuzani, plintus chekkani, uchinchi savol esa faqat bitta tomonni talab qiladi.",
        n: 'Har savolda nima o\'lchanadi: ichkarimi, chekkami yoki bitta tomonmi?',
        r: 'Kattalik savolga qarab tanlanadi.',
      },
      {
        e: 'Три вопроса', s: 'Каждый вопрос требует своей величины.',
        a: 'Соедини каждый вопрос с нужной величиной.',
        left: ['Плитка на пол', 'Плинтус вокруг комнаты', 'Длина одной стороны'],
        right: ['Площадь', 'Периметр', 'Сторона'],
        y: 'Плитка требует площади, плинтус края, а третий вопрос только одной стороны.',
        n: 'Что меряют в каждом вопросе: внутреннее, край или одну сторону?',
        r: 'Величину выбирают по вопросу.',
      }, undefined, {
        en: {
          e: 'Three questions', s: 'Every question needs a measure of its own.',
          a: 'Connect each question with the measure it needs.',
          left: ['Tiles for a floor', 'A skirting board around a room', 'The length of one side'],
          right: ['Area', 'Perimeter', 'A side'],
          y: 'Tiles need the area, a skirting board the edge, and the third question only one side.',
          n: 'What is being measured in each question: the inside, the edge or one side?',
          r: 'The measure is chosen by the question.',
        },
      }),

    /* 10 · order · 🔴 — yuza bo'yicha tartib. */
    q('10', 'Yakuniy tartib', '🔴', 'd37-final-sort', 'order', '🚀', [1, 3, 0, 2],
      {
        e: 'Yakuniy mashq', s: "To'rtta panelning perimetri bir xil: 16 sm. Yuzalari esa har xil.",
        a: 'Panellarni yuzasi bo\'yicha kichigidan kattasiga tartiblang.',
        o: ['3 sm va 5 sm', '1 sm va 7 sm', '4 sm va 4 sm', '2 sm va 6 sm'],
        y: '1 · 7 = 7, keyin 2 · 6 = 12, keyin 3 · 5 = 15, oxirida 4 · 4 = 16.',
        n: 'Har panelda uzunlikni enga ko\'paytiring.',
        r: 'Perimetr teng bo\'lsa, kvadratning yuzasi eng katta chiqadi.',
      },
      {
        e: 'Итоговое задание', s: 'У четырёх панелей периметр одинаковый: 16 см. А площади разные.',
        a: 'Расставь панели по площади от меньшей к большей.',
        o: ['3 см и 5 см', '1 см и 7 см', '4 см и 4 см', '2 см и 6 см'],
        y: '1 · 7 = 7, потом 2 · 6 = 12, потом 3 · 5 = 15, в конце 4 · 4 = 16.',
        n: 'В каждой панели умножь длину на ширину.',
        r: 'При равном периметре площадь самая большая у квадрата.',
      }, undefined, {
        en: {
          e: 'Final task', s: 'Four panels have the same perimeter: 16 cm. But their areas are different.',
          a: 'Put the panels in order of their area, from the smallest to the largest.',
          o: ['3 cm and 5 cm', '1 cm and 7 cm', '4 cm and 4 cm', '2 cm and 6 cm'],
          y: '1 · 7 = 7, then 2 · 6 = 12, then 3 · 5 = 15, and 4 · 4 = 16 at the end.',
          n: 'For every panel multiply the length by the width.',
          r: 'With equal perimeters the square has the largest area.',
        },
      }),
  ],
};

export default DARS37_BANK;
