// Dars 38 amaliyoti — Blok masalalari.
// Nazariya: src/components/grade3/Dars38.jsx (num-3-38).
// Masalaning savoli kattalikni tanlaydi: pol, plitka, bo'yoq — yuza; panjara, lenta —
// perimetr; ikki amalli masalada birinchi amal javobni faqat tayyorlaydi.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 input · 2 match · 3 dnd · 4 match · 5 multi · 6 choice · 7 order · 8 choice · 9 multi · 10 input
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS38_BANK = {
  title: 'Dars 38 · Blok masalalari',
  items: [

    /* 1 · input · 🟢 — pol yuzasi. */
    q('01', 'Pol yuzasi', '🟢', 'd38-floor', 'input', '🔢', ['20'],
      {
        e: 'Birinchi qadam', s: "Xona 4 ga 5 metr. Polni plitka bilan yopish kerak.",
        a: 'Pol yuzasi necha kvadrat metr?',
        y: "4 ni 5 ga ko'paytiramiz, 20 kvadrat metr chiqadi.",
        n: 'Pol bu ichkari, uni yuza bilan o\'lchaymiz: uzunlikni enga ko\'paytiring.',
        r: 'Pol, plitka va bo\'yoq — yuza bilan hisoblanadi.',
        p: 'Javob',
      },
      {
        e: 'Первый шаг', s: 'Комната 4 на 5 метров. Пол нужно покрыть плиткой.',
        a: 'Чему равна площадь пола в квадратных метрах?',
        y: 'Умножаем 4 на 5, получается 20 квадратных метров.',
        n: 'Пол это внутреннее, его меряют площадью: умножь длину на ширину.',
        r: 'Пол, плитка и краска считаются через площадь.',
        p: 'Ответ',
      }, 'numeric'),

    /* 2 · match · 🟢 — masala va kattalik. */
    q('02', 'Masala va kattalik', '🟢', 'd38-match-quantity', 'match', '🔗', [0, 1, 2],
      {
        e: 'Uch masala', s: 'Har masalada savol o\'z kattaligini talab qiladi.',
        a: 'Har masalani kerakli kattalikka ulang.',
        left: ['Polga plitka kerak', 'Bog\' atrofiga panjara', 'Bitta devor uzunligi'],
        right: ['Yuza', 'Perimetr', 'Tomon'],
        y: "Plitka ichkarini qoplaydi — yuza. Panjara chekka bo'ylab boradi — perimetr. Uchinchisida faqat bitta tomon so'ralgan.",
        n: 'Har masalada nima o\'lchanadi: ichkarimi, chekkami yoki bitta tomonmi?',
        r: 'Masalaning savoli kattalikni tanlaydi.',
      },
      {
        e: 'Три задачи', s: 'В каждой задаче вопрос требует своей величины.',
        a: 'Соедини каждую задачу с нужной величиной.',
        left: ['Нужна плитка на пол', 'Забор вокруг сада', 'Длина одной стены'],
        right: ['Площадь', 'Периметр', 'Сторона'],
        y: 'Плитка покрывает внутреннее — площадь. Забор идёт по краю — периметр. В третьей спросили только одну сторону.',
        n: 'Что меряют в каждой задаче: внутреннее, край или одну сторону?',
        r: 'Вопрос задачи выбирает величину.',
      }),

    /* 3 · dnd · 🟢 — yuza yoki perimetr. */
    q('03', 'Nima hisoblanadi?', '🟢', 'd38-sort-quantity', 'dnd', '🧭', [0, 1, 0, 1],
      {
        e: 'Hayotdan', s: "To'rtta ish. Ba'zilarida ichkari, ba'zilarida chekka o'lchanadi.",
        a: 'Ishlarni ajrating: qayerda yuza, qayerda perimetr kerak.',
        tokens: [
          'Polni bo\'yash',
          'Xona atrofiga plintus',
          'Stolga klyonka',
          'Bog\' atrofiga panjara',
        ],
        zones: ['Yuza kerak', 'Perimetr kerak'],
        dndHint: 'Ishlar tugadi.',
        y: "Bo'yoq va klyonka ichkarini qoplaydi, plintus va panjara esa chekka bo'ylab boradi.",
        n: 'Bu narsa ichkarini qoplaydimi yoki chekka bo\'ylab boradimi?',
        r: 'Qoplash yuza, o\'rash perimetr.',
      },
      {
        e: 'Из жизни', s: 'Четыре дела. В одних меряют внутреннее, в других край.',
        a: 'Разложи дела: где нужна площадь, а где периметр.',
        tokens: [
          'Покрасить пол',
          'Плинтус вокруг комнаты',
          'Клеёнка на стол',
          'Забор вокруг сада',
        ],
        zones: ['Нужна площадь', 'Нужен периметр'],
        dndHint: 'Дела закончились.',
        y: 'Краска и клеёнка покрывают внутреннее, а плинтус и забор идут по краю.',
        n: 'Эта вещь покрывает внутреннее или идёт по краю?',
        r: 'Покрыть это площадь, обвести это периметр.',
      }),

    /* 4 · match · 🟡 — xona va javob. */
    q('04', 'Bitta xona, uch savol', '🟡', 'd38-one-room', 'match', '🏠', [0, 1, 2],
      {
        e: 'Xona 4 ga 5 m', s: "Xona o'sha-o'sha, savollar esa har xil.",
        a: 'Har savolni uning javobiga ulang.',
        left: ['Pol yuzasi', 'Chekka uzunligi', 'Uzunroq tomon'],
        right: ['20 m²', '18 m', '5 m'],
        y: "Yuza 4 · 5 = 20, perimetr (4 + 5) · 2 = 18, uzunroq tomon esa 5 metr.",
        n: 'Har savolda qaysi kattalik so\'ralganini aniqlang.',
        r: 'Xona bitta, sonlar har xil — chunki savollar har xil.',
      },
      {
        e: 'Комната 4 на 5 м', s: 'Комната одна и та же, а вопросы разные.',
        a: 'Соедини каждый вопрос с его ответом.',
        left: ['Площадь пола', 'Длина края', 'Более длинная сторона'],
        right: ['20 м²', '18 м', '5 м'],
        y: 'Площадь 4 · 5 = 20, периметр (4 + 5) · 2 = 18, длинная сторона 5 метров.',
        n: 'В каждом вопросе определи, какую величину спрашивают.',
        r: 'Комната одна, а числа разные — потому что вопросы разные.',
      }),

    /* 5 · multi · 🟡 — qaysi savollarga javob bor. */
    q('05', 'Javob berish mumkinmi?', '🟡', 'd38-answerable', 'multi', '❓', [0, 2],
      {
        e: 'Shartga qarang', s: "Xona 4 ga 5 metr. Boshqa hech narsa aytilmagan.",
        a: 'Qaysi savollarga javob berish MUMKIN? Hammasini belgilang.',
        o: [
          'Pol yuzasi qancha?',
          'Xona qaysi rangda?',
          'Chekka uzunligi qancha?',
          'Plitka qancha turadi?',
        ],
        y: "Tomonlar berilgan, demak yuzani ham, perimetrni ham topish mumkin. Rang va narx haqida ma'lumot yo'q.",
        n: 'Shartda faqat tomonlar berilgan. Ulardan nimani hisoblash mumkin?',
        r: 'Savolga javob berish uchun shartda yetarli ma\'lumot bo\'lishi kerak.',
      },
      {
        e: 'Смотри на условие', s: 'Комната 4 на 5 метров. Больше ничего не сказано.',
        a: 'На какие вопросы МОЖНО ответить? Отметь все.',
        o: [
          'Чему равна площадь пола?',
          'Какого цвета комната?',
          'Чему равна длина края?',
          'Сколько стоит плитка?',
        ],
        y: 'Стороны даны, значит можно найти и площадь, и периметр. О цвете и цене данных нет.',
        n: 'В условии даны только стороны. Что из них можно посчитать?',
        r: 'Чтобы ответить на вопрос, в условии должно хватать данных.',
      }),

    /* 6 · choice · 🟡 — plitka soni. */
    q('06', 'Nechta plitka?', '🟡', 'd38-tiles', 'choice', '🔒', 2,
      {
        e: 'Ikki qadam', s: "Xona 4 ga 5 metr. Bitta plitkaning yuzasi 1 kvadrat metr.",
        a: 'Nechta plitka kerak bo\'ladi?',
        o: ['18 ta', '9 ta', '20 ta', '10 ta'],
        y: "Avval pol yuzasini topamiz: 4 · 5 = 20. Plitka 1 m², demak 20 ta plitka kerak.",
        n: 'Avval yuzani toping, keyin uni bitta plitkaning yuzasiga bo\'ling.',
        by: [
          "Bu perimetr: (4 + 5) · 2 = 18. Plitka esa polni qoplaydi.",
          "Bu tomonlar yig'indisi. Pol yuzasi ko'paytirish bilan topiladi.",
          undefined,
          "Bu ikkita tomon. Pol ancha katta.",
        ],
        r: 'Ikki amalli masalada birinchi amal javobni faqat tayyorlaydi.',
      },
      {
        e: 'Два шага', s: 'Комната 4 на 5 метров. Площадь одной плитки 1 квадратный метр.',
        a: 'Сколько плиток понадобится?',
        o: ['18 штук', '9 штук', '20 штук', '10 штук'],
        y: 'Сначала находим площадь пола: 4 · 5 = 20. Плитка 1 м², значит нужно 20 плиток.',
        n: 'Сначала найди площадь, потом раздели её на площадь одной плитки.',
        by: [
          'Это периметр: (4 + 5) · 2 = 18. А плитка покрывает пол.',
          'Это сумма сторон. Площадь пола находят умножением.',
          undefined,
          'Это две стороны. А пол гораздо больше.',
        ],
        r: 'В задаче в два действия первое действие только готовит ответ.',
      }),

    /* 7 · order · 🟡 — yechim qadamlari. */
    q('07', 'Yechim qadamlari', '🟡', 'd38-steps', 'order', '🪜', [1, 2, 0],
      {
        e: 'Uch qadam', s: "Xona 3 ga 6 metr, plitka 1 m². Nechta plitka kerakligini topamiz.",
        a: 'Qadamlarni tartib bilan tanlang.',
        o: ['Javob: 18 ta plitka', 'Savol pol haqida, demak yuza kerak', 'Yuzani topaman: 3 · 6 = 18'],
        y: "Avval savoldan kattalikni aniqlaymiz, keyin yuzani hisoblaymiz, oxirida javobni yozamiz.",
        n: 'Hisoblashdan oldin nimani aniqlash kerak?',
        r: 'Avval savol kattalikni tanlaydi, keyin hisob boshlanadi.',
      },
      {
        e: 'Три шага', s: 'Комната 3 на 6 метров, плитка 1 м². Находим, сколько плиток нужно.',
        a: 'Выбери шаги по порядку.',
        o: ['Ответ: 18 плиток', 'Вопрос про пол, значит нужна площадь', 'Считаю площадь: 3 · 6 = 18'],
        y: 'Сначала по вопросу определяем величину, потом считаем площадь, в конце пишем ответ.',
        n: 'Что нужно определить до счёта?',
        r: 'Сначала вопрос выбирает величину, потом начинается счёт.',
      }),

    /* 8 · choice · 🔴 — lenta uzunligi. */
    q('08', 'Chekkaga lenta', '🔴', 'd38-ribbon', 'choice', '🎀', 1,
      {
        e: 'Boshqa savol', s: "O'sha xona: 4 ga 5 metr. Endi chekka bo'ylab lenta yopishtiriladi.",
        a: 'Necha metr lenta kerak?',
        o: ['20 m', '18 m', '9 m', '40 m'],
        y: "Chekka bo'ylab: (4 + 5) · 2 = 18 metr. Bu perimetr, yuza emas.",
        n: 'Lenta chekka bo\'ylab boradi. To\'rtta tomonni qo\'shing.',
        by: [
          "Bu pol yuzasi, u kvadrat metrda. Lenta esa oddiy metrda o'lchanadi.",
          undefined,
          "Bu ikkita tomon. Chekka esa to'rtta tomondan iborat.",
          "Bu yuzaning ikki barobari. Chekka bilan bog'liq emas.",
        ],
        r: 'Bitta xona savolga qarab turli sonlarni beradi.',
      },
      {
        e: 'Другой вопрос', s: 'Та же комната: 4 на 5 метров. Теперь по краю клеят ленту.',
        a: 'Сколько метров ленты нужно?',
        o: ['20 м', '18 м', '9 м', '40 м'],
        y: 'По краю: (4 + 5) · 2 = 18 метров. Это периметр, а не площадь.',
        n: 'Лента идёт по краю. Сложи четыре стороны.',
        by: [
          'Это площадь пола, она в квадратных метрах. А ленту меряют в обычных.',
          undefined,
          'Это две стороны. А край состоит из четырёх сторон.',
          'Это удвоенная площадь. К краю она отношения не имеет.',
        ],
        r: 'Одна комната даёт разные числа в зависимости от вопроса.',
      }),

    /* 9 · multi · 🔴 — yuza kerak bo'lgan masalalar. */
    q('09', 'Qayerda yuza kerak?', '🔴', 'd38-need-area', 'multi', '🎯', [0, 2],
      {
        e: 'To\'rtta masala', s: "To'rtta savol. Ikkitasida yuza kerak.",
        a: 'Qaysi masalalarda yuza kerak? Hammasini belgilang.',
        o: [
          'Devorga oboy yopishtirish',
          'Rasm chetiga ramka',
          'Polni bo\'yash',
          'Bog\' atrofiga panjara',
        ],
        y: "Oboy va bo'yoq ichkarini qoplaydi — yuza. Ramka va panjara chekka bo'ylab boradi — perimetr.",
        n: 'Har masalada narsa ichkarini qoplaydimi yoki chekka bo\'ylab boradimi?',
        r: 'Qoplash yuza, o\'rash perimetr.',
      },
      {
        e: 'Четыре задачи', s: 'Четыре вопроса. В двух нужна площадь.',
        a: 'В каких задачах нужна площадь? Отметь все.',
        o: [
          'Поклеить обои на стену',
          'Рамка по краю картины',
          'Покрасить пол',
          'Забор вокруг сада',
        ],
        y: 'Обои и краска покрывают внутреннее — площадь. Рамка и забор идут по краю — периметр.',
        n: 'В каждой задаче вещь покрывает внутреннее или идёт по краю?',
        r: 'Покрыть это площадь, обвести это периметр.',
      }),

    /* 10 · input · 🔴 — ikki amalli masala. */
    q('10', 'Yakuniy masala', '🔴', 'd38-final', 'input', '🚀', ['12'],
      {
        e: 'Yakuniy mashq', s: "Xona 3 ga 5 metr. Polga plitka to'shalmoqda, lekin 3 ta plitka hali keltirilmagan.",
        a: 'Hozircha nechta plitka to\'shaldi? Plitka 1 m².',
        y: "Pol yuzasi 3 · 5 = 15 kvadrat metr, demak jami 15 ta plitka kerak. 3 tasi yetishmaydi: 15 − 3 = 12 tasi to'shaldi.",
        n: 'Avval pol yuzasini toping, keyin qo\'shimcha plitkalarni ayiring.',
        r: 'Ikki amalli masalada birinchi amal javobni faqat tayyorlaydi.',
        p: 'Javob',
      },
      {
        e: 'Итоговое задание', s: 'Комната 3 на 5 метров. На пол кладут плитку, но 3 плитки ещё не привезли.',
        a: 'Сколько плиток уже положили? Плитка 1 м².',
        y: 'Площадь пола 3 · 5 = 15 квадратных метров, значит всего 15 плиток. Из них 3 добавили потом, значит сначала положили 12.',
        n: 'Сначала найди площадь пола, потом вычти недостающие плитки.',
        r: 'В задаче в два действия первое действие только готовит ответ.',
        p: 'Ответ',
      }, 'numeric'),
  ],
};

export default DARS38_BANK;
