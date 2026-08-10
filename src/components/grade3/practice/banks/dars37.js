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
      }, 'numeric'),

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
      }, 'numeric'),

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
      }),
  ],
};

export default DARS37_BANK;
