// Dars 12 amaliyoti — Yig'indini bo'lish.
// Nazariya: src/components/grade3/Dars12.jsx (num-3-12).
// Bank newBanks.js dan ko'chirildi va §1A kanoniga keltirildi.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 choice · 2 match · 3 dnd · 4 order · 5 choice · 6 multi · 7 input · 8 match · 9 multi · 10 dnd
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS12_BANK = {
  title: "Dars 12 · Yig'indini bo'lish",
  items: [

    /* 1 · choice · 🟢 — qulay yoyilma. Eski 01, 4-chi variant qo'shildi. */
    q('01', "Bo'linadigan yoyilma", '🟢', 'd12-good-split', 'choice', '✂️', 0,
      {
        e: 'Qulay yoyilma', s: "84 ni 4 ga bo'lish uchun HAR IKKALA qism 4 ga bo'linishi kerak.",
        a: 'Qaysi yoyilma eng qulay?',
        o: ['(80 + 4) : 4', '(70 + 14) : 4', '(50 + 34) : 4', '(84 + 4) : 4'],
        y: "80 ham, 4 ham 4 ga qoldiqsiz bo'linadi: 20 + 1 = 21.",
        n: "Har yoyilmada ikkala qismni 4 ga bo'lib ko'ring: qoldiq qolmasligi kerak.",
        by: [
          undefined,
          "70 ni 4 ga bo'lsangiz qoldiq qoladi. Qismlar qoldiqsiz bo'linishi kerak.",
          "50 ni 4 ga bo'lsangiz qoldiq qoladi, 34 ni ham. Ikkalasi ham yaramaydi.",
          "Bu yerda qismlar yig'indisi 84 emas, 88 bo'lib ketgan. Yoyilma sonni o'zgartirmasligi kerak.",
        ],
        r: "(a + b) : c = a : c + b : c, agar ikkala qism ham c ga bo'linsa.",
      },
      {
        e: 'Удобное разложение', s: 'Чтобы разделить 84 на 4, ОБЕ части должны делиться на 4.',
        a: 'Какое разложение самое удобное?',
        o: ['(80 + 4) : 4', '(70 + 14) : 4', '(50 + 34) : 4', '(84 + 4) : 4'],
        y: 'И 80, и 4 делятся на 4 без остатка: 20 + 1 = 21.',
        n: 'Раздели обе части каждого разложения на 4: остатка быть не должно.',
        by: [
          undefined,
          'При делении 70 на 4 остаётся остаток. Части должны делиться нацело.',
          'И 50, и 34 при делении на 4 дают остаток. Оба не подходят.',
          'Здесь сумма частей стала 88, а не 84. Разложение не должно менять число.',
        ],
        r: '(a + b) : c = a : c + b : c, если обе части делятся на c.',
      }, undefined, {
        en: {
          e: 'A handy split', s: 'To divide 84 by 4, BOTH parts have to be divisible by 4.',
          a: 'Which split is the handiest?',
          o: ['(80 + 4) : 4', '(70 + 14) : 4', '(50 + 34) : 4', '(84 + 4) : 4'],
          y: 'Both 80 and 4 divide by 4 with nothing left over: 20 + 1 = 21.',
          n: 'Divide both parts of every split by 4: there should be no remainder.',
          by: [
            undefined,
            'Dividing 70 by 4 leaves a remainder. The parts have to divide exactly.',
            'Both 50 and 34 leave a remainder when divided by 4. Neither one fits.',
            'Here the parts add up to 88, not 84. A split must not change the number.',
          ],
          r: '(a + b) : c = a : c + b : c, if both parts divide by c.',
        },
      }),

    /* 2 · match · 🟢 — bo'linma va natija. */
    q('02', "Bo'linma va natija", '🟢', 'd12-match-div', 'match', '🔗', [0, 1, 2],
      {
        e: 'Uch bo\'lish', s: "Har bo'linmani qulay qismlarga ajratib hisoblash mumkin.",
        a: "Har bo'linmani uning natijasiga ulang.",
        left: ['96 : 3', '84 : 4', '88 : 4'],
        right: ['32', '21', '22'],
        y: '96 : 3 = 32, 84 : 4 = 21, 88 : 4 = 22.',
        n: "Har sonni qulay qismlarga yoying: 96 = 90 + 6, 84 = 80 + 4, 88 = 80 + 8.",
        r: "Qulay qismlarni alohida bo'lib, natijalarni qo'shamiz.",
      },
      {
        e: 'Три деления', s: 'Каждое деление можно посчитать через удобные части.',
        a: 'Соедини каждое деление с его результатом.',
        left: ['96 : 3', '84 : 4', '88 : 4'],
        right: ['32', '21', '22'],
        y: '96 : 3 = 32, 84 : 4 = 21, 88 : 4 = 22.',
        n: 'Разложи каждое число на удобные части: 96 = 90 + 6, 84 = 80 + 4, 88 = 80 + 8.',
        r: 'Удобные части делим отдельно, а результаты складываем.',
      }, undefined, {
        en: {
          e: 'Three divisions', s: 'Every division can be worked out through handy parts.',
          a: 'Connect each division with its result.',
          left: ['96 : 3', '84 : 4', '88 : 4'],
          right: ['32', '21', '22'],
          y: '96 : 3 = 32, 84 : 4 = 21, 88 : 4 = 22.',
          n: 'Split every number into handy parts: 96 = 90 + 6, 84 = 80 + 4, 88 = 80 + 8.',
          r: 'We divide the handy parts separately and add the results.',
        },
      }),

    /* 3 · dnd · 🟢 — yoyilma yaraydimi. Eski 07 (multi) dnd ga o'tdi. */
    q('03', 'Yaraydimi?', '🟢', 'd12-usable-split', 'dnd', '🗂️', [0, 0, 1, 0],
      {
        e: '72 : 3 uchun', s: "72 ni 3 ga bo'lamiz. Har qism 3 ga bo'linishi kerak.",
        a: 'Har yoyilmani yaraydi yoki yaramaydi rafiga qo\'ying.',
        tokens: ['60 + 12', '30 + 42', '50 + 22', '69 + 3'],
        zones: ['Yaraydi', 'Yaramaydi'],
        dndHint: 'Yoyilmalar tugadi.',
        y: "60 + 12, 30 + 42 va 69 + 3 — barcha qismlar 3 ga bo'linadi. 50 va 22 esa bo'linmaydi.",
        n: "Har qismni 3 ga bo'lib ko'ring. Bitta qism bo'linmasa ham, yoyilma yaramaydi.",
        r: "Yoyilma yig'indisi 72 bo'lishi va HAR qism 3 ga bo'linishi shart.",
      },
      {
        e: 'Для 72 : 3', s: 'Делим 72 на 3. Каждая часть должна делиться на 3.',
        a: 'Положи каждое разложение на полку «подходит» или «не подходит».',
        tokens: ['60 + 12', '30 + 42', '50 + 22', '69 + 3'],
        zones: ['Подходит', 'Не подходит'],
        dndHint: 'Разложения закончились.',
        y: 'В 60 + 12, 30 + 42 и 69 + 3 все части делятся на 3. А 50 и 22 не делятся.',
        n: 'Раздели каждую часть на 3. Если хотя бы одна не делится — разложение не годится.',
        r: 'Сумма частей должна быть 72, и КАЖДАЯ часть должна делиться на 3.',
      }, undefined, {
        en: {
          e: 'For 72 : 3', s: 'We divide 72 by 3. Every part has to be divisible by 3.',
          a: 'Put each split onto the shelf that fits or the one that does not.',
          tokens: ['60 + 12', '30 + 42', '50 + 22', '69 + 3'],
          zones: ['Fits', 'Does not fit'],
          dndHint: 'No splits left.',
          y: 'In 60 + 12, 30 + 42 and 69 + 3 all the parts divide by 3. And 50 and 22 do not.',
          n: 'Divide every part by 3. If even one of them does not divide, the split is no good.',
          r: 'The parts have to add up to 72, and EVERY part has to divide by 3.',
        },
      }),

    /* 4 · order · 🟡 — qadamlar. Eski 03. */
    q('04', 'Qadamlar', '🟡', 'd12-steps', 'order', '🪜', [2, 0, 1],
      {
        e: 'Uch qadam', s: "68 : 4 ni qulay qismlarga ajratib yechamiz.",
        a: 'Qadamlarni to\'g\'ri tartibda joylang.',
        o: ["40 : 4 = 10 va 28 : 4 = 7", '10 + 7 = 17', '68 = 40 + 28'],
        y: "Avval qulay yoyilma, keyin qismlarni bo'lish, oxirida natijalarni qo'shish.",
        n: "Bo'lishdan oldin nima qilinadi? Qo'shishdan oldin-chi?",
        r: "Qulay yoyish, keyin qismlarni bo'lish, keyin natijalarni qo'shish.",
      },
      {
        e: 'Три шага', s: 'Решаем 68 : 4 через удобные части.',
        a: 'Расставь шаги в правильном порядке.',
        o: ['40 : 4 = 10 и 28 : 4 = 7', '10 + 7 = 17', '68 = 40 + 28'],
        y: 'Сначала удобное разложение, потом деление частей, в конце сложение результатов.',
        n: 'Что делают до деления? А до сложения?',
        r: 'Удобно разложить, потом разделить части, потом сложить результаты.',
      }, undefined, {
        en: {
          e: 'Three steps', s: 'We are solving 68 : 4 through handy parts.',
          a: 'Put the steps in the right order.',
          o: ['40 : 4 = 10 and 28 : 4 = 7', '10 + 7 = 17', '68 = 40 + 28'],
          y: 'First the handy split, then dividing the parts, and at the end adding the results.',
          n: 'What is done before the dividing? And before the adding?',
          r: 'Split it handily, then divide the parts, then add the results.',
        },
      }),

    /* 5 · choice · 🟡 — qulay qismlar. Eski 04, 4-chi variant qo'shildi. */
    q('05', 'Qulay qismlar', '🟡', 'd12-parts-78', 'choice', '🧩', 2,
      {
        e: '78 : 6', s: "78 ni 6 ga bo'lmoqchimiz. Yoyilmadagi ikkala qism ham 6 ga bo'linishi kerak.",
        a: "Qaysi yoyilmada IKKALA qism ham 6 ga bo'linadi?",
        o: ['70 + 8', '50 + 28', '60 + 18', '72 + 6'],
        y: '60 : 6 = 10 va 18 : 6 = 3, jami 13.',
        n: "Har qismni 6 ga bo'lib ko'ring. Qismlar yig'indisi 78 bo'lishi ham shart.",
        by: [
          "70 ham, 8 ham 6 ga bo'linmaydi. Boshqa yoyilmani qidiring.",
          "50 ham, 28 ham 6 ga bo'linmaydi.",
          undefined,
          "Bu yerda qismlar yig'indisi 78 emas. Yoyilma sonni o'zgartirmasligi kerak.",
        ],
        r: '78 : 6 = 60 : 6 + 18 : 6 = 10 + 3 = 13.',
      },
      {
        e: '78 : 6', s: 'Делим 78 на 6. Обе части разложения должны делиться на 6.',
        a: 'В каком разложении ОБЕ части делятся на 6?',
        o: ['70 + 8', '50 + 28', '60 + 18', '72 + 6'],
        y: '60 : 6 = 10 и 18 : 6 = 3, вместе 13.',
        n: 'Раздели каждую часть на 6. И сумма частей должна быть 78.',
        by: [
          'Ни 70, ни 8 не делятся на 6. Поищи другое разложение.',
          'Ни 50, ни 28 не делятся на 6.',
          undefined,
          'Здесь сумма частей не равна 78. Разложение не должно менять число.',
        ],
        r: '78 : 6 = 60 : 6 + 18 : 6 = 10 + 3 = 13.',
      }, undefined, {
        en: {
          e: '78 : 6', s: 'We divide 78 by 6. Both parts of the split have to be divisible by 6.',
          a: 'In which split do BOTH parts divide by 6?',
          o: ['70 + 8', '50 + 28', '60 + 18', '72 + 6'],
          y: '60 : 6 = 10 and 18 : 6 = 3, together that is 13.',
          n: 'Divide every part by 6. And the parts have to add up to 78.',
          by: [
            'Neither 70 nor 8 divides by 6. Look for another split.',
            'Neither 50 nor 28 divides by 6.',
            undefined,
            'Here the parts do not add up to 78. A split must not change the number.',
          ],
          r: '78 : 6 = 60 : 6 + 18 : 6 = 10 + 3 = 13.',
        },
      }),

    /* 6 · multi · 🟡 — natijasi 21 bo'lganlar. */
    q('06', '21 chiqadi', '🟡', 'd12-gives-21', 'multi', '🎯', [0, 2],
      {
        e: 'Bir xil natija', s: "To'rtta bo'linma. Ikkitasi 21 beradi.",
        a: 'Qaysi bo\'linmalar 21 ga teng? Hammasini belgilang.',
        o: ['84 : 4', '88 : 4', '63 : 3', '96 : 3'],
        y: '84 : 4 = 21 va 63 : 3 = 21. 88 : 4 = 22, 96 : 3 = 32.',
        n: "Har bo'linmani qulay qismlarga yoying va hisoblang.",
        r: "Turli sonlarni turli songa bo'lib, bir xil natija olish mumkin.",
      },
      {
        e: 'Одинаковый результат', s: 'Четыре деления. Два дают 21.',
        a: 'Какие деления равны 21? Отметь все.',
        o: ['84 : 4', '88 : 4', '63 : 3', '96 : 3'],
        y: '84 : 4 = 21 и 63 : 3 = 21. А 88 : 4 = 22, 96 : 3 = 32.',
        n: 'Разложи каждое деление на удобные части и посчитай.',
        r: 'Разные числа при делении на разные делители могут дать один результат.',
      }, undefined, {
        en: {
          e: 'The same result', s: 'Four divisions. Two of them give 21.',
          a: 'Which divisions are equal to 21? Mark them all.',
          o: ['84 : 4', '88 : 4', '63 : 3', '96 : 3'],
          y: '84 : 4 = 21 and 63 : 3 = 21. And 88 : 4 = 22, 96 : 3 = 32.',
          n: 'Split every division into handy parts and work it out.',
          r: 'Different numbers divided by different divisors can give the same result.',
        },
      }),

    /* 7 · input · 🟡 — yo'qolgan qism. Eski 05. */
    q('07', "Yo'qolgan qism", '🟡', 'd12-missing-part', 'input', '🧩', ['7'],
      {
        e: "Bo'sh katak", s: '(70 + □) : 7 = 11 tenglik berilgan.',
        a: 'Bo\'sh katakka qaysi son yoziladi?',
        y: '11 × 7 = 77, va 77 = 70 + 7. Demak □ = 7.',
        n: "70 : 7 = 10. 11 gacha yana bitta kerak — u qaysi qismdan chiqadi?",
        r: "Bo'lish ko'paytirish bilan tekshiriladi: 11 × 7 = 77.",
        p: 'Javob',
      },
      {
        e: 'Пустая клетка', s: 'Дано равенство (70 + □) : 7 = 11.',
        a: 'Какое число пишется в пустую клетку?',
        y: '11 × 7 = 77, и 77 = 70 + 7. Значит □ = 7.',
        n: '70 : 7 = 10. До 11 не хватает единицы — из какой части она возьмётся?',
        r: 'Деление проверяют умножением: 11 × 7 = 77.',
        p: 'Ответ',
      }, 'numeric', {
        en: {
          e: 'The empty cell', s: 'Here is the equality (70 + □) : 7 = 11.',
          a: 'Which number goes into the empty cell?',
          y: '11 × 7 = 77, and 77 = 70 + 7. So □ = 7.',
          n: '70 : 7 = 10. One more is missing up to 11 — which part does it come from?',
          r: 'Division is checked by multiplying: 11 × 7 = 77.',
          p: 'Answer',
        },
      }),

    /* 8 · match · 🔴 — teskari tekshiruv. Eski 08. */
    q('08', 'Teskari tekshiruv', '🔴', 'd12-check-mul', 'match', '↩️', [0, 1, 2],
      {
        e: "Ko'paytirish bilan tekshiring", s: "Har bo'linmaning javobini ko'paytirish tasdiqlaydi.",
        a: "Har bo'linmani uni tekshiradigan ko'paytmaga ulang.",
        left: ['62 : 2', '84 : 4', '96 : 3'],
        right: ['31 × 2 = 62', '21 × 4 = 84', '32 × 3 = 96'],
        y: "Bo'linmani bo'luvchiga ko'paytirsak, bo'linuvchi qaytadi.",
        n: "Har ko'paytmani hisoblang: natija bo'linuvchiga teng bo'lishi kerak.",
        r: 'a : b = c bo\'lsa, c × b = a.',
      },
      {
        e: 'Проверь умножением', s: 'Ответ каждого деления подтверждается умножением.',
        a: 'Соедини каждое деление с проверяющим его умножением.',
        left: ['62 : 2', '84 : 4', '96 : 3'],
        right: ['31 × 2 = 62', '21 × 4 = 84', '32 × 3 = 96'],
        y: 'Если частное умножить на делитель, вернётся делимое.',
        n: 'Посчитай каждое умножение: результат должен совпасть с делимым.',
        r: 'Если a : b = c, то c × b = a.',
      }, undefined, {
        en: {
          e: 'Check by multiplying', s: 'The answer of every division is confirmed by a multiplication.',
          a: 'Connect each division with the multiplication that checks it.',
          left: ['62 : 2', '84 : 4', '96 : 3'],
          right: ['31 × 2 = 62', '21 × 4 = 84', '32 × 3 = 96'],
          y: 'Multiply the quotient by the divisor and the dividend comes back.',
          n: 'Work out every multiplication: the result has to match the dividend.',
          r: 'If a : b = c, then c × b = a.',
        },
      }),

    /* 9 · multi · 🔴 — XATONI TOPING, ko'p tanlovli shakl. Eski 09. */
    q('09', 'Xato yoyilmalar', '🔴', 'd12-find-errors', 'multi', '🔎', [1, 2],
      {
        e: 'Xatoni toping', s: "To'rtta yozuv. Ikkitasida yoyilmaning bir qismi bo'linmay qolgan.",
        a: 'Qaysi yozuvlar XATO? Hammasini belgilang.',
        o: ['96 : 4 = 80 : 4 + 16 : 4', '96 : 4 = 80 : 4 + 16', '84 : 4 = 80 : 4 + 4', '88 : 4 = 80 : 4 + 8 : 4'],
        y: "Ikkinchi va uchinchi yozuvda ikkinchi qism bo'linmay qolgan: 16 va 4 ham bo'linishi kerak edi.",
        n: "Har yozuvda ikkala qism ham bo'luvchiga bo'linganini tekshiring.",
        r: "Yoyilmaning HAR qismi bo'linadi: 96 : 4 = 80 : 4 + 16 : 4 = 24.",
      },
      {
        e: 'Найди ошибки', s: 'Четыре записи. В двух одна часть разложения осталась неподелённой.',
        a: 'Какие записи НЕВЕРНЫ? Отметь все.',
        o: ['96 : 4 = 80 : 4 + 16 : 4', '96 : 4 = 80 : 4 + 16', '84 : 4 = 80 : 4 + 4', '88 : 4 = 80 : 4 + 8 : 4'],
        y: 'Во второй и третьей записи вторую часть не поделили: 16 и 4 тоже нужно было разделить.',
        n: 'Проверь в каждой записи, что обе части поделены на делитель.',
        r: 'Делится КАЖДАЯ часть разложения: 96 : 4 = 80 : 4 + 16 : 4 = 24.',
      }, undefined, {
        en: {
          e: 'Find the mistakes', s: 'Four records. In two of them one part of the split was left undivided.',
          a: 'Which records are WRONG? Mark them all.',
          o: ['96 : 4 = 80 : 4 + 16 : 4', '96 : 4 = 80 : 4 + 16', '84 : 4 = 80 : 4 + 4', '88 : 4 = 80 : 4 + 8 : 4'],
          y: 'In the second and the third record the second part was not divided: the 16 and the 4 had to be divided too.',
          n: 'Check in every record that both parts are divided by the divisor.',
          r: 'EVERY part of the split is divided: 96 : 4 = 80 : 4 + 16 : 4 = 24.',
        },
      }),

    /* 10 · dnd · 🔴 — natijaga taqsimlash. Eski 06 va 10. */
    q('10', 'Qaysi natijaga?', '🔴', 'd12-sort-results', 'dnd', '🚀', [0, 1, 1, 0],
      {
        e: 'Yakuniy mashq', s: "To'rtta bo'linma, atigi ikki xil natija.",
        a: "Bo'linmalarni ajrating: qaysilarining javobi 22, qaysilariniki 21.",
        tokens: ['88 : 4', '84 : 4', '63 : 3', '66 : 3'],
        zones: ['22', '21'],
        dndHint: "Bo'linmalar tugadi.",
        y: '88 : 4 = 22 va 66 : 3 = 22. 84 : 4 = 21 va 63 : 3 = 21.',
        n: "Har bo'linmani qulay qismlarga yoying: 88 = 80 + 8, 66 = 60 + 6.",
        r: "Tekshiruv ko'paytirish bilan: 22 × 4 = 88, 21 × 3 = 63.",
      },
      {
        e: 'Итоговое задание', s: 'Четыре деления, а результата всего два.',
        a: 'Разложи деления: у каких ответ 22, а у каких 21.',
        tokens: ['88 : 4', '84 : 4', '63 : 3', '66 : 3'],
        zones: ['22', '21'],
        dndHint: 'Деления закончились.',
        y: '88 : 4 = 22 и 66 : 3 = 22. А 84 : 4 = 21 и 63 : 3 = 21.',
        n: 'Разложи каждое деление на удобные части: 88 = 80 + 8, 66 = 60 + 6.',
        r: 'Проверка умножением: 22 × 4 = 88, 21 × 3 = 63.',
      }, undefined, {
        en: {
          e: 'Final task', s: 'Four divisions, but only two results.',
          a: 'Sort the divisions: which ones give 22 and which give 21.',
          tokens: ['88 : 4', '84 : 4', '63 : 3', '66 : 3'],
          zones: ['22', '21'],
          dndHint: 'No divisions left.',
          y: '88 : 4 = 22 and 66 : 3 = 22. And 84 : 4 = 21, 63 : 3 = 21.',
          n: 'Split every division into handy parts: 88 = 80 + 8, 66 = 60 + 6.',
          r: 'Check by multiplying: 22 × 4 = 88, 21 × 3 = 63.',
        },
      }),
  ],
};

export default DARS12_BANK;
