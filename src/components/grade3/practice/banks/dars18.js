// Dars 18 amaliyoti — Ikki xonali sonni bir xonaliga bo'lish.
// Nazariya: src/components/grade3/Dars18.jsx (num-3-18). Darslik 24-bet.
// Bank newBanks.js dan ko'chirildi va §1A kanoniga keltirildi.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 choice · 2 multi · 3 dnd · 4 multi · 5 match · 6 choice · 7 order · 8 match · 9 order · 10 input
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS18_BANK = {
  title: "Dars 18 · Ikki xonali sonni bo'lish",
  items: [

    /* 1 · choice · 🟢 — qulay yoyilma. Eski 01, 4-chi variant qo'shildi. */
    q('01', 'Qulay yoyilma', '🟢', 'd18-good-split', 'choice', '✂️', 0,
      {
        e: '96 : 4', s: "96 ni 4 ga bo'lish uchun ikkala qism ham 4 ga bo'linishi kerak.",
        a: 'Qulay yoyilmani tanlang.',
        o: ['(80 + 16) : 4', '(90 + 6) : 4', '(70 + 26) : 4', '(96 + 4) : 4'],
        y: '80 : 4 = 20 va 16 : 4 = 4, jami 24.',
        n: "Har yoyilmada ikkala qismni 4 ga bo'lib ko'ring: qoldiq qolmasin.",
        by: [
          undefined,
          "90 ni 4 ga bo'lsangiz qoldiq qoladi, 6 ni ham.",
          "70 ni 4 ga bo'lsangiz qoldiq qoladi, 26 ni ham.",
          "Bu yerda qismlar yig'indisi 96 emas, 100 bo'lib ketgan.",
        ],
        r: "Qismlar bo'luvchiga qoldiqsiz bo'linishi shart.",
      },
      {
        e: '96 : 4', s: 'Чтобы разделить 96 на 4, обе части должны делиться на 4.',
        a: 'Выбери удобное разложение.',
        o: ['(80 + 16) : 4', '(90 + 6) : 4', '(70 + 26) : 4', '(96 + 4) : 4'],
        y: '80 : 4 = 20 и 16 : 4 = 4, вместе 24.',
        n: 'Раздели обе части каждого разложения на 4: остатка быть не должно.',
        by: [
          undefined,
          'И 90, и 6 при делении на 4 дают остаток.',
          'И 70, и 26 при делении на 4 дают остаток.',
          'Здесь сумма частей стала 100, а не 96.',
        ],
        r: 'Части должны делиться на делитель нацело.',
      }),

    /* 2 · multi · 🟢 — yaroqli yoyilmalar. Eski 07. */
    q('02', 'Yaroqli yoyilmalar', '🟢', 'd18-usable', 'multi', '✅', [0, 1, 3],
      {
        e: '88 : 4 uchun', s: "88 ni 4 ga bo'lamiz. Har qism 4 ga bo'linishi kerak.",
        a: 'Barcha yaroqli yoyilmalarni belgilang.',
        o: ['80 + 8', '40 + 48', '70 + 18', '60 + 28'],
        y: "80 + 8, 40 + 48 va 60 + 28 — barcha qismlar 4 ga bo'linadi. 70 va 18 esa bo'linmaydi.",
        n: "Har qismni 4 ga bo'lib ko'ring. Yig'indisi ham 88 bo'lishi shart.",
        r: "Yig'indi 88 bo'lishi va qismlar 4 ga bo'linishi kerak.",
      },
      {
        e: 'Для 88 : 4', s: 'Делим 88 на 4. Каждая часть должна делиться на 4.',
        a: 'Отметь все подходящие разложения.',
        o: ['80 + 8', '40 + 48', '70 + 18', '60 + 28'],
        y: 'В 80 + 8, 40 + 48 и 60 + 28 все части делятся на 4. А 70 и 18 не делятся.',
        n: 'Раздели каждую часть на 4. И сумма должна быть 88.',
        r: 'Сумма должна быть 88, и части должны делиться на 4.',
      }),

    /* 3 · dnd · 🟢 — bo'lakni o'z bo'linmasiga. */
    q('03', "Bo'laklarni joylang", '🟢', 'd18-sort-parts', 'dnd', '🗂️', [0, 1, 0, 1],
      {
        e: '92 : 4', s: "92 ni 80 va 12 ga ajratdik, har bo'lakni 4 ga bo'lamiz.",
        a: 'Har natijani u qaysi bo\'lakdan chiqqaniga qarab joylang.',
        tokens: ['80 : 4', '12 : 4', '20', '3'],
        zones: ['Katta bo\'lakdan', 'Kichik bo\'lakdan'],
        dndHint: 'Kartalar tugadi.',
        y: '80 : 4 = 20, 12 : 4 = 3. Jami 23.',
        n: "Qaysi bo'lak katta? Uning bo'linmasi ham kattaroq bo'ladi.",
        r: '92 : 4 = 80 : 4 + 12 : 4 = 20 + 3 = 23.',
      },
      {
        e: '92 : 4', s: 'Разложили 92 на 80 и 12, каждую часть делим на 4.',
        a: 'Разложи результаты по тому, из какой части они получились.',
        tokens: ['80 : 4', '12 : 4', '20', '3'],
        zones: ['Из большой части', 'Из малой части'],
        dndHint: 'Карточки закончились.',
        y: '80 : 4 = 20, 12 : 4 = 3. Всего 23.',
        n: 'Какая часть больше? У неё и частное больше.',
        r: '92 : 4 = 80 : 4 + 12 : 4 = 20 + 3 = 23.',
      }),

    /* 4 · multi · 🟡 — natijasi 23 bo'lganlar. */
    q('04', '23 chiqadi', '🟡', 'd18-gives-23', 'multi', '🎯', [0, 2],
      {
        e: 'Bir xil natija', s: "To'rtta bo'linma. Ikkitasi 23 beradi.",
        a: 'Qaysi bo\'linmalar 23 ga teng? Hammasini belgilang.',
        o: ['92 : 4', '96 : 4', '69 : 3', '84 : 4'],
        y: '92 : 4 = 23 va 69 : 3 = 23. 96 : 4 = 24, 84 : 4 = 21.',
        n: "Har bo'linmani qulay qismlarga yoying va hisoblang.",
        r: "Turli sonlarni turli bo'luvchiga bo'lib, bir xil natija olish mumkin.",
      },
      {
        e: 'Одинаковый результат', s: 'Четыре деления. Два дают 23.',
        a: 'Какие деления равны 23? Отметь все.',
        o: ['92 : 4', '96 : 4', '69 : 3', '84 : 4'],
        y: '92 : 4 = 23 и 69 : 3 = 23. А 96 : 4 = 24, 84 : 4 = 21.',
        n: 'Разложи каждое деление на удобные части и посчитай.',
        r: 'Разные числа с разными делителями могут дать один результат.',
      }),

    /* 5 · match · 🟡 — bo'linma va natija. */
    q('05', "Bo'linma va natija", '🟡', 'd18-match-div', 'match', '🔗', [0, 1, 2],
      {
        e: 'Uch bo\'lish', s: "Uchta bo'linmani qulay qismlarga ajratib hisoblang.",
        a: "Har bo'linmani uning natijasiga ulang.",
        left: ['78 : 3', '90 : 5', '96 : 4'],
        right: ['26', '18', '24'],
        y: '78 : 3 = 26, 90 : 5 = 18, 96 : 4 = 24.',
        n: 'Har sonni bo\'luvchiga bo\'linadigan qismlarga yoying: 78 = 60 + 18, 90 = 50 + 40.',
        r: "Qulay qismlar bir xil bo'luvchiga bo'linadi.",
      },
      {
        e: 'Три деления', s: 'Посчитай три деления через удобные части.',
        a: 'Соедини каждое деление с его результатом.',
        left: ['78 : 3', '90 : 5', '96 : 4'],
        right: ['26', '18', '24'],
        y: '78 : 3 = 26, 90 : 5 = 18, 96 : 4 = 24.',
        n: 'Разложи каждое число на части, делящиеся на делитель: 78 = 60 + 18, 90 = 50 + 40.',
        r: 'Удобные части делятся на один и тот же делитель.',
      }),

    /* 6 · choice · 🟡 — nol bilan son. Eski 08, 4-chi variant qo'shildi. */
    q('06', 'Nol bilan son', '🟡', 'd18-zero-90', 'choice', '🕳️', 1,
      {
        e: 'Yumaloq son', s: "90 : 5 ni hisoblash uchun 90 ni 50 + 40 ga yoyish qulay.",
        a: '90 : 5 nechaga teng?',
        o: ['16', '18', '20', '14'],
        y: '50 : 5 + 40 : 5 = 10 + 8 = 18. Tekshiruv: 18 × 5 = 90.',
        n: "90 ni 5 ga bo'linadigan ikki qismga yoying.",
        by: [
          '16 × 5 = 80, bu 90 emas. Tekshiruvni bajaring.',
          undefined,
          '20 × 5 = 100, bu 90 dan katta.',
          '14 × 5 = 70, bu 90 dan kichik.',
        ],
        r: "Bo'linma × 5 = 90 bo'lishi kerak.",
      },
      {
        e: 'Круглое число', s: 'Чтобы посчитать 90 : 5, удобно разложить 90 на 50 + 40.',
        a: 'Чему равно 90 : 5?',
        o: ['16', '18', '20', '14'],
        y: '50 : 5 + 40 : 5 = 10 + 8 = 18. Проверка: 18 × 5 = 90.',
        n: 'Разложи 90 на две части, которые делятся на 5.',
        by: [
          '16 × 5 = 80, а не 90. Сделай проверку.',
          undefined,
          '20 × 5 = 100, это больше 90.',
          '14 × 5 = 70, это меньше 90.',
        ],
        r: 'Частное × 5 должно давать 90.',
      }),

    /* 7 · order · 🟡 — algoritm qadamlari. Eski 03. */
    q('07', 'Algoritm qadamlari', '🟡', 'd18-steps', 'order', '🪜', [2, 0, 3, 1],
      {
        e: 'To\'rt qadam', s: "92 : 4 ni qulay bo'laklarda yechamiz.",
        a: 'Qadamlarni tartiblang.',
        o: ['80 : 4 = 20 va 12 : 4 = 3', '23 × 4 = 92', '92 = 80 + 12', '20 + 3 = 23'],
        y: "Yoyish, bo'lish, qo'shish, oxirida ko'paytirish bilan tekshirish.",
        n: "Bo'lishdan oldin nima kerak? Tekshiruv qaysi qadam?",
        r: "Ko'paytirish — oxirgi tekshiruv qadami.",
      },
      {
        e: 'Четыре шага', s: 'Решаем 92 : 4 через удобные части.',
        a: 'Расставь шаги по порядку.',
        o: ['80 : 4 = 20 и 12 : 4 = 3', '23 × 4 = 92', '92 = 80 + 12', '20 + 3 = 23'],
        y: 'Разложить, разделить, сложить, в конце проверить умножением.',
        n: 'Что нужно до деления? Какой шаг является проверкой?',
        r: 'Умножение — последний шаг, проверка.',
      }),

    /* 8 · match · 🔴 — yechim va xato sababi. Eski 09. */
    q('08', 'Xato sababi', '🔴', 'd18-error-cause', 'match', '🔎', [0, 1, 2],
      {
        e: 'Uch yechim', s: "84 : 4 ni uch bola turlicha yechdi, ikkitasi xato.",
        a: 'Har yechimni uning izohiga ulang.',
        left: ['80 : 4 + 4 = 24', '80 : 4 + 4 : 4 = 21', '84 : 4 = 26'],
        right: ["Ikkinchi qism bo'linmagan", "To'g'ri yechim", 'Natija juda katta'],
        y: "To'g'ri javob 21: ikkala qism ham 4 ga bo'linadi.",
        n: 'Har yechimda ikkinchi qism bilan nima qilinganini tekshiring.',
        r: "84 : 4 = 80 : 4 + 4 : 4 = 20 + 1 = 21.",
      },
      {
        e: 'Три решения', s: 'Трое детей решали 84 : 4 по-разному, двое ошиблись.',
        a: 'Соедини каждое решение с пояснением.',
        left: ['80 : 4 + 4 = 24', '80 : 4 + 4 : 4 = 21', '84 : 4 = 26'],
        right: ['Вторую часть не поделили', 'Верное решение', 'Результат слишком большой'],
        y: 'Верный ответ 21: обе части делятся на 4.',
        n: 'Проверь в каждом решении, что сделали со второй частью.',
        r: '84 : 4 = 80 : 4 + 4 : 4 = 20 + 1 = 21.',
      }),

    /* 9 · order · 🔴 — natijalarni tartiblash. */
    q('09', 'Natijalar tartibi', '🔴', 'd18-order-results', 'order', '📈', [3, 0, 1, 2],
      {
        e: 'Qaysi kichik?', s: "To'rtta bo'linma. Ularni hisoblab, natijalarga qarab tartiblang.",
        a: "Bo'linmalarni natijasi bo'yicha kichigidan kattasiga tartiblang.",
        o: ['92 : 4', '96 : 4', '78 : 3', '90 : 5'],
        y: '90 : 5 = 18, 92 : 4 = 23, 96 : 4 = 24, 78 : 3 = 26.',
        n: "Har bo'linmani qulay qismlarga yoying va hisoblang, keyin natijalarni solishtiring.",
        r: "Bo'linuvchi katta bo'lgani natija ham katta degani emas: bo'luvchi ham muhim.",
      },
      {
        e: 'Где меньше?', s: 'Четыре деления. Посчитай их и расставь по результатам.',
        a: 'Расставь деления по результату от меньшего к большему.',
        o: ['92 : 4', '96 : 4', '78 : 3', '90 : 5'],
        y: '90 : 5 = 18, 92 : 4 = 23, 96 : 4 = 24, 78 : 3 = 26.',
        n: 'Разложи каждое деление на удобные части, посчитай и сравни результаты.',
        r: 'Большее делимое не значит больший результат: важен и делитель.',
      }),

    /* 10 · input · 🔴 — yo'qolgan qism. Eski 05. */
    q('10', "Yo'qolgan qism", '🔴', 'd18-missing-part', 'input', '🚀', ['24'],
      {
        e: 'Yakuniy mashq', s: '(60 + □) : 3 = 28 tenglik berilgan.',
        a: 'Bo\'sh katakka qaysi son yoziladi?',
        y: "28 × 3 = 84, keyin 84 − 60 = 24. Tekshiruv: 24 ham 3 ga qoldiqsiz bo'linadi.",
        n: "Avval butun bo'linuvchini toping: bo'linmani bo'luvchiga ko'paytiring. Keyin 60 ni ayiring.",
        r: "Bo'linuvchi = bo'luvchi × bo'linma; keyin ma'lum qismni ayiramiz.",
        p: 'Javob',
      },
      {
        e: 'Итоговое задание', s: 'Дано равенство (60 + □) : 3 = 28.',
        a: 'Какое число пишется в пустую клетку?',
        y: '28 × 3 = 84, потом 84 − 60 = 24. Проверка: 24 тоже делится на 3 нацело.',
        n: 'Сначала найди всё делимое: умножь частное на делитель. Потом вычти 60.',
        r: 'Делимое = делитель × частное; потом вычитаем известную часть.',
        p: 'Ответ',
      }, 'numeric'),
  ],
};

export default DARS18_BANK;
