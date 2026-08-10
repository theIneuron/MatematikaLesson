// Dars 13 amaliyoti — Amallar tartibi.
// Nazariya: src/components/grade3/Dars13.jsx (num-3-13).
// Bank newBanks.js dan ko'chirildi va §1A kanoniga keltirildi.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 multi · 2 order · 3 input · 4 match · 5 order · 6 dnd · 7 multi · 8 choice · 9 dnd · 10 match
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS13_BANK = {
  title: 'Dars 13 · Amallar tartibi',
  items: [

    /* 1 · multi · 🟢 — qayerda ko'paytirish birinchi. */
    q('01', 'Qayerda ko\'paytirish birinchi?', '🟢', 'd13-mul-first', 'multi', '🥇', [0, 1, 3],
      {
        e: 'Kim birinchi?', s: "To'rtta ifoda. Ba'zilarida ko'paytirish yoki bo'lish oldin bajariladi.",
        a: 'Qaysi ifodalarda KO\'PAYTIRISH yoki BO\'LISH birinchi bajariladi? Hammasini belgilang.',
        o: ['5 + 3 × 2', '24 : 6 + 7', '(12 − 4) × 3', '18 − 6 : 3'],
        y: "Uchtasida ko'paytirish yoki bo'lish oldin turadi. Qavsli ifodada esa avval qavs bajariladi.",
        n: 'Qavs bor-yo\'qligini tekshiring: qavs hamma amaldan oldin turadi.',
        r: "Avval qavs, keyin ko'paytirish va bo'lish, oxirida qo'shish va ayirish.",
      },
      {
        e: 'Кто первый?', s: 'Четыре выражения. В некоторых умножение или деление выполняется раньше.',
        a: 'В каких выражениях первым выполняется УМНОЖЕНИЕ или ДЕЛЕНИЕ? Отметь все.',
        o: ['5 + 3 × 2', '24 : 6 + 7', '(12 − 4) × 3', '18 − 6 : 3'],
        y: 'В трёх умножение или деление стоит первым. А в выражении со скобками сначала выполняются скобки.',
        n: 'Проверь, есть ли скобки: они выполняются раньше всех действий.',
        r: 'Сначала скобки, потом умножение и деление, в конце сложение и вычитание.',
      }, undefined, {
        en: {
          e: 'Who goes first?', s: 'Four expressions. In some of them the multiplication or the division is done earlier.',
          a: 'In which expressions is the MULTIPLICATION or the DIVISION done first? Mark them all.',
          o: ['5 + 3 × 2', '24 : 6 + 7', '(12 − 4) × 3', '18 − 6 : 3'],
          y: 'In three of them the multiplication or the division comes first. And in the one with brackets the brackets are done first.',
          n: 'Check whether there are brackets: they are done before all the other operations.',
          r: 'Brackets first, then multiplication and division, and addition and subtraction last.',
        },
      }),

    /* 2 · order · 🟢 — qoidaning pog'onalari. Eski 03. */
    q('02', 'Qoidani tartiblang', '🟢', 'd13-rule-order', 'order', '🪜', [2, 0, 1],
      {
        e: 'Uch pog\'ona', s: 'Ifodani hisoblashning uch pog\'onasi bor, lekin ular aralashib ketgan.',
        a: 'Qoidalarni tartib bilan joylang.',
        o: ["Ko'paytirish va bo'lish", "Qo'shish va ayirish", 'Qavs ichidagi amal'],
        y: "Qavs, keyin ko'paytirish va bo'lish, oxirida qo'shish va ayirish.",
        n: 'Qaysi amal hamma narsadan oldin turadi? Va qaysi biri eng oxirida qoladi?',
        r: "Bir xil pog'onadagi amallar chapdan o'ngga bajariladi.",
      },
      {
        e: 'Три ступени', s: 'У вычисления выражения три ступени, но они перепутались.',
        a: 'Расставь правила по порядку.',
        o: ['Умножение и деление', 'Сложение и вычитание', 'Действие в скобках'],
        y: 'Скобки, потом умножение и деление, в конце сложение и вычитание.',
        n: 'Какое действие идёт раньше всех? А какое остаётся напоследок?',
        r: 'Действия одной ступени выполняются слева направо.',
      }, undefined, {
        en: {
          e: 'Three steps', s: 'Working out an expression has three steps, but they got mixed up.',
          a: 'Put the rules in order.',
          o: ['Multiplication and division', 'Addition and subtraction', 'The operation in the brackets'],
          y: 'Brackets, then multiplication and division, and addition and subtraction last.',
          n: 'Which operation comes before all the others? And which one is left for the end?',
          r: 'Operations of the same step are done from left to right.',
        },
      }),

    /* 3 · input · 🟢 — qavs ichida. Eski 02. */
    q('03', 'Qavs ichida', '🟢', 'd13-parentheses', 'input', '🧮', ['24'],
      {
        e: 'Qavs kuchi', s: 'Qavs amal tartibini o\'zgartiradi.',
        a: '(12 − 4) × 3 nechaga teng?',
        y: '12 − 4 = 8, keyin 8 × 3 = 24.',
        n: "Qavs ichidagi amal birinchi bajariladi, keyin natija ko'paytiriladi.",
        r: 'Qavs ichidagi amal birinchi bajariladi.',
        p: 'Javob',
      },
      {
        e: 'Сила скобок', s: 'Скобки меняют порядок действий.',
        a: 'Чему равно (12 − 4) × 3?',
        y: '12 − 4 = 8, потом 8 × 3 = 24.',
        n: 'Сначала выполняется действие в скобках, потом результат умножается.',
        r: 'Действие в скобках выполняется первым.',
        p: 'Ответ',
      }, 'numeric', {
        en: {
          e: 'The power of brackets', s: 'Brackets change the order of the operations.',
          a: 'How much is (12 − 4) × 3?',
          y: '12 − 4 = 8, then 8 × 3 = 24.',
          n: 'The operation in the brackets is done first, then the result is multiplied.',
          r: 'The operation in the brackets is done first.',
          p: 'Answer',
        },
      }),

    /* 4 · match · 🟡 — ifoda va natijasi. Eski 01 va 04. */
    q('04', 'Ifoda va natija', '🟡', 'd13-match-value', 'match', '🔗', [0, 1, 2],
      {
        e: 'Uch ifoda', s: "Uchta ifoda. Ularni amal tartibi bo'yicha hisoblang.",
        a: 'Har ifodani uning natijasiga ulang.',
        left: ['5 + 3 × 2', '24 : 6 + 9', '(12 − 4) × 3'],
        right: ['11', '13', '24'],
        y: '5 + 3 × 2 = 11, 24 : 6 + 9 = 13, (12 − 4) × 3 = 24.',
        n: "Har ifodada avval ko'paytirish yoki bo'lishni bajaring, qavs bo'lsa — undan boshlang.",
        r: "Avval qavs, keyin ko'paytirish va bo'lish, oxirida qo'shish.",
      },
      {
        e: 'Три выражения', s: 'Три выражения. Посчитай их по порядку действий.',
        a: 'Соедини каждое выражение с его результатом.',
        left: ['5 + 3 × 2', '24 : 6 + 9', '(12 − 4) × 3'],
        right: ['11', '13', '24'],
        y: '5 + 3 × 2 = 11, 24 : 6 + 9 = 13, (12 − 4) × 3 = 24.',
        n: 'В каждом выражении сначала выполни умножение или деление, а при скобках начни с них.',
        r: 'Сначала скобки, потом умножение и деление, в конце сложение.',
      }, undefined, {
        en: {
          e: 'Three expressions', s: 'Three expressions. Work them out following the order of operations.',
          a: 'Connect each expression with its result.',
          left: ['5 + 3 × 2', '24 : 6 + 9', '(12 − 4) × 3'],
          right: ['11', '13', '24'],
          y: '5 + 3 × 2 = 11, 24 : 6 + 9 = 13, (12 − 4) × 3 = 24.',
          n: 'In every expression do the multiplication or the division first, and where there are brackets start with them.',
          r: 'Brackets first, then multiplication and division, and addition last.',
        },
      }),

    /* 5 · order · 🟡 — bitta ifodaning qadamlari. Eski 10. */
    q('05', 'Qadamlar ketma-ketligi', '🟡', 'd13-steps', 'order', '👣', [1, 2, 0],
      {
        e: 'Murakkab ifoda', s: '(36 : 4 + 3) × 2 ifodada qavs, bo\'lish, qo\'shish va ko\'paytirish bor.',
        a: 'Hisoblash qadamlarini tartib bilan tanlang.',
        o: ['12 × 2 = 24', '36 : 4 = 9', '9 + 3 = 12'],
        y: "Qavs ichida ham tartib saqlanadi: avval bo'lish, keyin qo'shish, oxirida qavsdan tashqaridagi ko'paytirish.",
        n: 'Qavs ichida ikkita amal bor. Qaysi biri oldin bajariladi?',
        r: 'Qavs ichida ham amal tartibi saqlanadi.',
      },
      {
        e: 'Сложное выражение', s: 'В (36 : 4 + 3) × 2 есть скобки, деление, сложение и умножение.',
        a: 'Выбери шаги вычисления по порядку.',
        o: ['12 × 2 = 24', '36 : 4 = 9', '9 + 3 = 12'],
        y: 'Внутри скобок порядок тоже действует: сначала деление, потом сложение, в конце умножение за скобками.',
        n: 'Внутри скобок два действия. Какое из них выполняется раньше?',
        r: 'Внутри скобок порядок действий тоже сохраняется.',
      }, undefined, {
        en: {
          e: 'A harder expression', s: '(36 : 4 + 3) × 2 has brackets, a division, an addition and a multiplication.',
          a: 'Pick the working steps in order.',
          o: ['12 × 2 = 24', '36 : 4 = 9', '9 + 3 = 12'],
          y: 'Inside the brackets the order works too: the division first, then the addition, and the multiplication outside the brackets last.',
          n: 'There are two operations inside the brackets. Which one is done earlier?',
          r: 'Inside brackets the order of operations still holds.',
        },
      }),

    /* 6 · dnd · 🟡 — qavs kerakmi. */
    q('06', 'Qavs kerakmi?', '🟡', 'd13-need-parens', 'dnd', '🔀', [0, 1, 0, 1],
      {
        e: 'Qavs natijani o\'zgartiradimi?', s: "To'rtta ifoda. Ba'zilarida qavs natijani o'zgartiradi, ba'zilarida yo'q.",
        a: "Ifodalarni ajrating: qaysilarida qavs natijani o'zgartiradi, qaysilarida yo'q.",
        tokens: ['5 + 3 × 2', '3 × 2 + 5', '18 − 6 : 3', '6 : 3 + 18'],
        zones: ["Qavs natijani O'ZGARTIRADI", "Qavs kerak emas"],
        dndHint: 'Ifodalar tugadi.',
        y: "5 + 3 × 2 va 18 − 6 : 3 da qavs natijani o'zgartiradi. Boshqalarida amal allaqachon to'g'ri tartibda turibdi.",
        n: 'Har ifodani ikki marta hisoblang: qavssiz va qavs bilan. Natija farq qildimi?',
        r: "Qavs faqat tartib noto'g'ri bo'lganda kerak bo'ladi.",
      },
      {
        e: 'Нужны ли скобки?', s: 'Четыре выражения. В некоторых скобки меняют результат, в других нет.',
        a: 'Разложи выражения: где скобки изменят результат, а где нет.',
        tokens: ['5 + 3 × 2', '3 × 2 + 5', '18 − 6 : 3', '6 : 3 + 18'],
        zones: ['Скобки МЕНЯЮТ результат', 'Скобки не нужны'],
        dndHint: 'Выражения закончились.',
        y: 'В 5 + 3 × 2 и 18 − 6 : 3 скобки меняют результат. В остальных действия и так стоят в нужном порядке.',
        n: 'Посчитай каждое выражение дважды: без скобок и со скобками. Результат изменился?',
        r: 'Скобки нужны только тогда, когда порядок иначе получится не тот.',
      }, undefined, {
        en: {
          e: 'Are brackets needed?', s: 'Four expressions. In some of them brackets change the result, in others they do not.',
          a: 'Sort the expressions: where brackets will change the result and where they will not.',
          tokens: ['5 + 3 × 2', '3 × 2 + 5', '18 − 6 : 3', '6 : 3 + 18'],
          zones: ['Brackets CHANGE the result', 'Brackets are not needed'],
          dndHint: 'No expressions left.',
          y: 'In 5 + 3 × 2 and 18 − 6 : 3 brackets change the result. In the others the operations already stand in the right order.',
          n: 'Work out every expression twice: without brackets and with them. Did the result change?',
          r: 'Brackets are only needed when the order would otherwise come out wrong.',
        },
      }),

    /* 7 · multi · 🟡 — 20 ga teng. Eski 07. */
    q('07', '20 ga teng', '🟡', 'd13-equals-20', 'multi', '🎯', [0, 1, 3],
      {
        e: 'Bir xil qiymat', s: "To'rtta ifoda. Har birini amal tartibida hisoblang.",
        a: 'Qaysi ifodalar 20 ga teng? Hammasini belgilang.',
        o: ['4 × 5', '24 − 8 : 2', '6 + 6 × 2', '(7 − 3) × 5'],
        y: '4 × 5 = 20, 24 − 8 : 2 = 20, (7 − 3) × 5 = 20. 6 + 6 × 2 esa 18.',
        n: "Har ifodada avval ko'paytirish yoki bo'lishni bajaring, qavs bo'lsa — undan boshlang.",
        r: "Qavs natijaga ta'sir qiladi, tartib esa har doim bir xil.",
      },
      {
        e: 'Одно значение', s: 'Четыре выражения. Посчитай каждое по порядку действий.',
        a: 'Какие выражения равны 20? Отметь все.',
        o: ['4 × 5', '24 − 8 : 2', '6 + 6 × 2', '(7 − 3) × 5'],
        y: '4 × 5 = 20, 24 − 8 : 2 = 20, (7 − 3) × 5 = 20. А 6 + 6 × 2 = 18.',
        n: 'В каждом выражении сначала выполни умножение или деление, а при скобках начни с них.',
        r: 'Скобки влияют на результат, а порядок действий всегда один и тот же.',
      }, undefined, {
        en: {
          e: 'One value', s: 'Four expressions. Work each one out following the order of operations.',
          a: 'Which expressions are equal to 20? Mark them all.',
          o: ['4 × 5', '24 − 8 : 2', '6 + 6 × 2', '(7 − 3) × 5'],
          y: '4 × 5 = 20, 24 − 8 : 2 = 20, (7 − 3) × 5 = 20. And 6 + 6 × 2 = 18.',
          n: 'In every expression do the multiplication or the division first, and where there are brackets start with them.',
          r: 'Brackets affect the result, but the order of operations is always the same.',
        },
      }),

    /* 8 · choice · 🔴 — ayirish tuzog'i. Eski 08, 4-chi variant qo'shildi. */
    q('08', 'Ayirish tuzog\'i', '🔴', 'd13-sub-trap', 'choice', '🪤', 1,
      {
        e: 'Diqqat, tuzoq', s: "18 − 6 : 3 ifodada ayirish birinchi ko'rinadi, lekin u birinchi emas.",
        a: '18 − 6 : 3 nechaga teng?',
        o: ['4', '16', '12', '6'],
        y: "Avval 6 : 3 = 2, keyin 18 − 2 = 16.",
        n: "Amallarni shunchaki chapdan o'ngga bajarib bo'lmaydi: bo'lish yuqori pog'onada.",
        by: [
          "Bu chapdan o'ngga hisoblab, keyin bo'lgan javob: (18 − 6) : 3. Lekin qavs yo'q.",
          undefined,
          "Bu chapdan o'ngga hisoblangan javob: 18 − 6 = 12. Lekin bo'lish oldin turadi.",
          "Bu faqat 6 : 3 ning natijasiga o'xshaydi. Butun ifodani hisoblang.",
        ],
        r: "Bo'lish ayirishdan oldin bajariladi, hatto u o'ngda tursa ham.",
      },
      {
        e: 'Внимание, ловушка', s: 'В 18 − 6 : 3 вычитание стоит первым, но выполняется не первым.',
        a: 'Чему равно 18 − 6 : 3?',
        o: ['4', '16', '12', '6'],
        y: 'Сначала 6 : 3 = 2, потом 18 − 2 = 16.',
        n: 'Действия нельзя выполнять просто слева направо: деление на верхней ступени.',
        by: [
          'Это ответ, если считать слева направо, а потом делить: (18 − 6) : 3. Но скобок нет.',
          undefined,
          'Это ответ слева направо: 18 − 6 = 12. Но деление выполняется раньше.',
          'Это похоже только на результат 6 : 3. Посчитай всё выражение.',
        ],
        r: 'Деление выполняется раньше вычитания, даже если стоит справа.',
      }, undefined, {
        en: {
          e: 'Careful, a trap', s: 'In 18 − 6 : 3 the subtraction stands first but is not done first.',
          a: 'How much is 18 − 6 : 3?',
          o: ['4', '16', '12', '6'],
          y: 'First 6 : 3 = 2, then 18 − 2 = 16.',
          n: 'Operations cannot simply be done from left to right: division is on the upper step.',
          by: [
            'That is the answer if you go from left to right and then divide: (18 − 6) : 3. But there are no brackets.',
            undefined,
            'That is the left-to-right answer: 18 − 6 = 12. But the division is done earlier.',
            'That only looks like the result of 6 : 3. Work out the whole expression.',
          ],
          r: 'Division is done before subtraction, even when it stands on the right.',
        },
      }),

    /* 9 · dnd · 🔴 — natijaga taqsimlash. Eski 05 va 06. */
    q('09', 'Qaysi natijaga?', '🔴', 'd13-sort-values', 'dnd', '🗂️', [0, 1, 1, 0],
      {
        e: 'Ikki natija', s: "To'rtta ifoda, atigi ikki xil natija.",
        a: 'Ifodalarni ajrating: qaysilarining javobi 27, qaysilariniki 24.',
        tokens: ['4 × 6 + 3', '6 × 4', '(9 − 5) × 6', '20 + 7'],
        zones: ['27', '24'],
        dndHint: 'Ifodalar tugadi.',
        y: '4 × 6 + 3 = 27 va 20 + 7 = 27. 6 × 4 = 24 va (9 − 5) × 6 = 24.',
        n: "Har ifodani amal tartibida hisoblang: qavs, keyin ko'paytirish, keyin qo'shish.",
        r: 'Turli ifodalar bir xil qiymat berishi mumkin.',
      },
      {
        e: 'Два результата', s: 'Четыре выражения, а результата всего два.',
        a: 'Разложи выражения: у каких ответ 27, а у каких 24.',
        tokens: ['4 × 6 + 3', '6 × 4', '(9 − 5) × 6', '20 + 7'],
        zones: ['27', '24'],
        dndHint: 'Выражения закончились.',
        y: '4 × 6 + 3 = 27 и 20 + 7 = 27. А 6 × 4 = 24 и (9 − 5) × 6 = 24.',
        n: 'Считай каждое выражение по порядку: скобки, потом умножение, потом сложение.',
        r: 'Разные выражения могут давать одно и то же значение.',
      }, undefined, {
        en: {
          e: 'Two results', s: 'Four expressions, but only two results.',
          a: 'Sort the expressions: which ones give 27 and which give 24.',
          tokens: ['4 × 6 + 3', '6 × 4', '(9 − 5) × 6', '20 + 7'],
          zones: ['27', '24'],
          dndHint: 'No expressions left.',
          y: '4 × 6 + 3 = 27 and 20 + 7 = 27. And 6 × 4 = 24, (9 − 5) × 6 = 24.',
          n: 'Work out every expression in order: brackets, then multiplication, then addition.',
          r: 'Different expressions can give one and the same value.',
        },
      }),

    /* 10 · match · 🔴 — xato va uning sababi. Eski 09. */
    q('10', 'Xato sababi', '🔴', 'd13-error-cause', 'match', '🔎', [0, 1, 2],
      {
        e: 'Yakuniy mashq', s: "Uch bola uch xil xato qildi. Har xatoning o'z sababi bor.",
        a: 'Har yechimni uning xato sababiga ulang.',
        left: ['7 + 5 × 2 = 24', '18 − 6 : 3 = 4', '(12 − 4) × 3 = 8'],
        right: ["Qo'shishni birinchi bajargan", 'Ayirishni birinchi bajargan', "Qavsdan keyin ko'paytirmagan"],
        y: "To'g'ri javoblar: 7 + 5 × 2 = 17, 18 − 6 : 3 = 16, (12 − 4) × 3 = 24.",
        n: 'Har yechimda qaysi amal noto\'g\'ri joyda bajarilganini toping.',
        r: "Amal tartibi buzilsa, natija butunlay boshqa chiqadi.",
      },
      {
        e: 'Итоговое задание', s: 'Трое детей сделали три разные ошибки. У каждой своя причина.',
        a: 'Соедини каждое решение с причиной ошибки.',
        left: ['7 + 5 × 2 = 24', '18 − 6 : 3 = 4', '(12 − 4) × 3 = 8'],
        right: ['Первым сделал сложение', 'Первым сделал вычитание', 'После скобок не умножил'],
        y: 'Верные ответы: 7 + 5 × 2 = 17, 18 − 6 : 3 = 16, (12 − 4) × 3 = 24.',
        n: 'В каждом решении найди, какое действие выполнено не на своём месте.',
        r: 'Если нарушить порядок действий, результат получится совсем другим.',
      }, undefined, {
        en: {
          e: 'Final task', s: 'Three children made three different mistakes. Each one has its own reason.',
          a: 'Connect each solution with the reason for the mistake.',
          left: ['7 + 5 × 2 = 24', '18 − 6 : 3 = 4', '(12 − 4) × 3 = 8'],
          right: ['Did the addition first', 'Did the subtraction first', 'Did not multiply after the brackets'],
          y: 'The right answers are: 7 + 5 × 2 = 17, 18 − 6 : 3 = 16, (12 − 4) × 3 = 24.',
          n: 'In every solution find the operation that was done out of its place.',
          r: 'Break the order of operations and the result comes out completely different.',
        },
      }),
  ],
};

export default DARS13_BANK;
