// Dars 27 amaliyoti — Sonning ulushi.
// Nazariya: src/components/grade3/Dars27.jsx (num-3-27).
// Ikki qadam: avval maxrajga bo'lib bitta bo'lakni bilamiz, keyin suratga ko'paytiramiz
// (9 : 3 · 2 = 6). Qism har doim butundan kichik.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 choice · 2 input · 3 multi · 4 dnd · 5 input · 6 order · 7 dnd · 8 match · 9 order · 10 match
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS27_BANK = {
  title: 'Dars 27 · Sonning ulushi',
  items: [

    /* 1 · choice · 🟢 — birinchi amal. */
    q('01', 'Birinchi amal qaysi?', '🟢', 'd27-first-op', 'choice', '1️⃣', 1,
      {
        e: 'Ikki qadam', s: "12 ta olmaning 1/3 qismini topmoqchimiz.",
        a: 'Birinchi qadamda qaysi amal bajariladi?',
        o: ["12 ni 3 ga ko'paytirish", "12 ni 3 ga bo'lish", "12 ga 3 ni qo'shish", '12 dan 3 ni ayirish'],
        y: "Avval butunni maxrajga bo'lamiz: 12 : 3 = 4. Bu bitta bo'lak.",
        n: "Maxraj butun nechtaga bo'linganini bildiradi. Demak avval qaysi amal kerak?",
        by: [
          "Ko'paytirsak son ortadi, lekin ulush butundan kichik bo'lishi kerak.",
          undefined,
          "Qo'shsak son ortadi. Ulush esa butundan kichik.",
          "Ayirish teng bo'laklarga ajratmaydi. Ulush teng bo'laklardan olinadi.",
        ],
        r: "Sonning ulushi: avval maxrajga bo'lamiz.",
      },
      {
        e: 'Два шага', s: 'Ищем 1/3 от 12 яблок.',
        a: 'Какое действие выполняется первым?',
        o: ['Умножить 12 на 3', 'Разделить 12 на 3', 'Прибавить к 12 число 3', 'Вычесть из 12 число 3'],
        y: 'Сначала делим целое на знаменатель: 12 : 3 = 4. Это одна часть.',
        n: 'Знаменатель показывает, на сколько разделили целое. Какое действие нужно первым?',
        by: [
          'При умножении число вырастет, а доля должна быть меньше целого.',
          undefined,
          'При сложении число вырастет. А доля меньше целого.',
          'Вычитание не делит на равные части. А долю берут из равных частей.',
        ],
        r: 'Доля числа: сначала делим на знаменатель.',
      }, undefined, {
        en: {
          e: 'Two steps', s: 'We are looking for 1/3 of 12 apples.',
          a: 'Which operation is done first?',
          o: ['Multiply 12 by 3', 'Divide 12 by 3', 'Add 3 to 12', 'Subtract 3 from 12'],
          y: 'First we divide the whole by the denominator: 12 : 3 = 4. That is one part.',
          n: 'The denominator shows how many parts the whole was cut into. Which operation is needed first?',
          by: [
            'Multiplying would make the number grow, but a part has to be smaller than the whole.',
            undefined,
            'Adding would make the number grow. And a part is smaller than the whole.',
            'Subtracting does not cut into equal parts. And a part is taken from equal parts.',
          ],
          r: 'A part of a number: divide by the denominator first.',
        },
      }),

    /* 2 · input · 🟢 — bitta bo'lak. */
    q('02', 'Bitta bo\'lak', '🟢', 'd27-one-part', 'input', '🍎', ['4'],
      {
        e: 'Birinchi qadam', s: '12 ta olma 3 teng qismga bo\'lindi.',
        a: 'Bitta qismda nechta olma bor?',
        y: '12 : 3 = 4 ta olma. Bu 1/3 qism.',
        n: "Butunni maxrajga bo'ling: nechta teng qism kerak edi?",
        r: "1/3 qismi: 12 : 3 = 4.",
        p: 'Javob',
      },
      {
        e: 'Первый шаг', s: '12 яблок разделили на 3 равные части.',
        a: 'Сколько яблок в одной части?',
        y: '12 : 3 = 4 яблока. Это часть 1/3.',
        n: 'Раздели целое на знаменатель: на сколько равных частей делили?',
        r: 'Часть 1/3: 12 : 3 = 4.',
        p: 'Ответ',
      }, 'numeric', {
        en: {
          e: 'The first step', s: '12 apples were shared into 3 equal parts.',
          a: 'How many apples are there in one part?',
          y: '12 : 3 = 4 apples. That is the 1/3 part.',
          n: 'Divide the whole by the denominator: how many equal parts was it shared into?',
          r: 'The 1/3 part: 12 : 3 = 4.',
          p: 'Answer',
        },
      }),

    /* 3 · multi · 🟢 — qism butundan kichik. */
    q('03', 'Qism butundan kichik', '🟢', 'd27-less-than-whole', 'multi', '🎯', [0, 1, 3],
      {
        e: 'Tekshiring', s: "12 ta olmaning turli ulushlari topilgan. Ba'zi javoblar shubhali.",
        a: 'Qaysi javoblar BO\'LISHI MUMKIN? Hammasini belgilang.',
        o: ['4', '6', '15', '8'],
        y: "12 ning ulushi 12 dan katta bo'lolmaydi. 15 esa butundan katta — bunday javob bo'lmaydi.",
        n: 'Ulush butunning bir qismi. U butundan katta bo\'la oladimi?',
        r: 'Qism har doim butundan kichik yoki unga teng.',
      },
      {
        e: 'Проверь', s: 'Нашли разные доли от 12 яблок. Некоторые ответы вызывают сомнение.',
        a: 'Какие ответы ВОЗМОЖНЫ? Отметь все.',
        o: ['4', '6', '15', '8'],
        y: 'Доля от 12 не может быть больше 12. А 15 больше целого — такого ответа не бывает.',
        n: 'Доля — это часть целого. Может ли она быть больше целого?',
        r: 'Часть всегда меньше целого или равна ему.',
      }, undefined, {
        en: {
          e: 'Check them', s: 'Different parts of 12 apples were found. Some of the answers look doubtful.',
          a: 'Which answers are POSSIBLE? Mark them all.',
          o: ['4', '6', '15', '8'],
          y: 'A part of 12 cannot be more than 12. And 15 is more than the whole — there is no such answer.',
          n: 'A part is a piece of the whole. Can it be bigger than the whole?',
          r: 'A part is always smaller than the whole or equal to it.',
        },
      }),

    /* 4 · dnd · 🟡 — qaysi amal qaysi qadamda. */
    q('04', 'Qaysi qadamda?', '🟡', 'd27-which-step', 'dnd', '🗂️', [0, 1, 0, 1],
      {
        e: '18 ning 2/3 qismi', s: "18 ta detalning 2/3 qismini topamiz. To'rtta amal yozilgan.",
        a: 'Ajrating: birinchi qadamda nima, ikkinchi qadamda nima qilinadi.',
        tokens: ['18 : 3', '6 × 2', '6', '12'],
        zones: ['Birinchi qadam', 'Ikkinchi qadam'],
        dndHint: 'Kartalar tugadi.',
        y: "Birinchi qadam: 18 : 3 = 6 — bitta bo'lak. Ikkinchi qadam: 6 × 2 = 12 — ikkita bo'lak.",
        n: "Avval bitta bo'lakni topamiz, keyin uni suratga ko'paytiramiz.",
        r: '18 : 3 × 2 = 12.',
      },
      {
        e: '2/3 от 18', s: 'Ищем 2/3 от 18 деталей. Записаны четыре действия.',
        a: 'Разложи: что делают на первом шаге, а что на втором.',
        tokens: ['18 : 3', '6 × 2', '6', '12'],
        zones: ['Первый шаг', 'Второй шаг'],
        dndHint: 'Карточки закончились.',
        y: 'Первый шаг: 18 : 3 = 6 — одна часть. Второй шаг: 6 × 2 = 12 — две части.',
        n: 'Сначала находим одну часть, потом умножаем её на числитель.',
        r: '18 : 3 × 2 = 12.',
      }, undefined, {
        en: {
          e: '2/3 of 18', s: 'We are looking for 2/3 of 18 parts. Four operations are written down.',
          a: 'Sort them: what is done on the first step and what on the second.',
          tokens: ['18 : 3', '6 × 2', '6', '12'],
          zones: ['The first step', 'The second step'],
          dndHint: 'No cards left.',
          y: 'The first step: 18 : 3 = 6 — one part. The second step: 6 × 2 = 12 — two parts.',
          n: 'First we find one part, then we multiply it by the numerator.',
          r: '18 : 3 × 2 = 12.',
        },
      }),

    /* 5 · input · 🟡 — ikki qadam. */
    q('05', 'Ikki qadamda', '🟡', 'd27-two-steps', 'input', '🧮', ['12'],
      {
        e: 'Ikkita bo\'lak', s: '18 ta detalning 2/3 qismini topamiz.',
        a: '18 ning 2/3 qismi nechaga teng?',
        y: '18 : 3 = 6, keyin 6 × 2 = 12 ta detal.',
        n: "Avval bitta bo'lakni toping, keyin uni 2 ga ko'paytiring.",
        r: 'Sonning ulushi: butunni maxrajga bo\'lib, suratga ko\'paytiramiz.',
        p: 'Javob',
      },
      {
        e: 'Две части', s: 'Ищем 2/3 от 18 деталей.',
        a: 'Чему равны 2/3 от 18?',
        y: '18 : 3 = 6, потом 6 × 2 = 12 деталей.',
        n: 'Сначала найди одну часть, потом умножь её на 2.',
        r: 'Доля числа: делим целое на знаменатель и умножаем на числитель.',
        p: 'Ответ',
      }, 'numeric', {
        en: {
          e: 'Two parts', s: 'We are looking for 2/3 of 18 parts.',
          a: 'How much is 2/3 of 18?',
          y: '18 : 3 = 6, then 6 × 2 = 12 parts.',
          n: 'Find one part first, then multiply it by 2.',
          r: 'A part of a number: divide the whole by the denominator and multiply by the numerator.',
          p: 'Answer',
        },
      }),

    /* 6 · order · 🟡 — qadamlar. */
    q('06', 'Qadamlar tartibi', '🟡', 'd27-steps-order', 'order', '🪜', [1, 2, 0],
      {
        e: 'Uch qadam', s: '24 ta kitobning 3/4 qismini topamiz.',
        a: 'Qadamlarni tartib bilan tanlang.',
        o: ['Javob 18 ta kitob', '24 : 4 = 6', '6 × 3 = 18'],
        y: "Avval maxrajga bo'lamiz, keyin suratga ko'paytiramiz, oxirida javobni yozamiz.",
        n: "Ko'paytirishdan oldin nima kerak? Bitta bo'lak qanday topiladi?",
        r: '24 : 4 × 3 = 18.',
      },
      {
        e: 'Три шага', s: 'Ищем 3/4 от 24 книг.',
        a: 'Выбери шаги по порядку.',
        o: ['Ответ 18 книг', '24 : 4 = 6', '6 × 3 = 18'],
        y: 'Сначала делим на знаменатель, потом умножаем на числитель, в конце записываем ответ.',
        n: 'Что нужно до умножения? Как находят одну часть?',
        r: '24 : 4 × 3 = 18.',
      }, undefined, {
        en: {
          e: 'Three steps', s: 'We are looking for 3/4 of 24 books.',
          a: 'Pick the steps in order.',
          o: ['The answer is 18 books', '24 : 4 = 6', '6 × 3 = 18'],
          y: 'First we divide by the denominator, then we multiply by the numerator, and at the end we write the answer.',
          n: 'What is needed before the multiplying? How is one part found?',
          r: '24 : 4 × 3 = 18.',
        },
      }),

    /* 7 · dnd · 🟡 — yarmidan katta yoki kichik. */
    q('07', 'Javob yarmidan katta?', '🟡', 'd27-vs-half', 'dnd', '⚖️', [1, 0, 1, 0],
      {
        e: 'Taxmin qiling', s: "24 ta kitobning turli ulushlari. Hisoblamasdan taxmin qiling.",
        a: 'Ulushlarni ajrating: qayerda javob yarmidan katta, qayerda kichik.',
        tokens: ['1/4 qismi', '3/4 qismi', '1/3 qismi', '2/3 qismi'],
        zones: ['Yarmidan katta', 'Yarmidan kichik'],
        dndHint: 'Ulushlar tugadi.',
        y: '3/4 va 2/3 — surat maxrajning yarmidan katta, demak javob ham yarmidan katta.',
        n: 'Suratni maxrajning yarmi bilan solishtiring: 3 va 4 ning yarmi 2.',
        r: "Surat maxrajning yarmidan katta bo'lsa, ulush ham yarmidan katta.",
      },
      {
        e: 'Прикинь', s: 'Разные доли от 24 книг. Прикинь, не считая.',
        a: 'Разложи доли: где ответ больше половины, а где меньше.',
        tokens: ['1/4 часть', '3/4 части', '1/3 часть', '2/3 части'],
        zones: ['Больше половины', 'Меньше половины'],
        dndHint: 'Доли закончились.',
        y: 'У 3/4 и 2/3 числитель больше половины знаменателя, значит и ответ больше половины.',
        n: 'Сравни числитель с половиной знаменателя: половина от 4 — это 2.',
        r: 'Если числитель больше половины знаменателя, доля тоже больше половины.',
      }, undefined, {
        en: {
          e: 'Make an estimate', s: 'Different parts of 24 books. Estimate without working them out.',
          a: 'Sort the parts: where the answer is more than a half and where it is less.',
          tokens: ['the 1/4 part', 'the 3/4 part', 'the 1/3 part', 'the 2/3 part'],
          zones: ['More than a half', 'Less than a half'],
          dndHint: 'No parts left.',
          y: 'In 3/4 and 2/3 the numerator is more than half the denominator, so the answer is more than a half too.',
          n: 'Compare the numerator with half the denominator: half of 4 is 2.',
          r: 'If the numerator is more than half the denominator, the part is more than a half too.',
        },
      }),

    /* 8 · match · 🔴 — ulush va javob. */
    q('08', 'Ulush va javob', '🔴', 'd27-match-answer', 'match', '🔗', [0, 1, 2],
      {
        e: '24 ta kitob', s: "24 ta kitobning uch xil ulushi.",
        a: 'Har ulushni uning javobiga ulang.',
        left: ['1/4 qismi', '2/3 qismi', '3/4 qismi'],
        right: ['6', '16', '18'],
        y: '24 : 4 = 6; 24 : 3 × 2 = 16; 24 : 4 × 3 = 18.',
        n: "Har ulushda avval maxrajga bo'ling, keyin suratga ko'paytiring.",
        r: "Sonning ulushi ikki qadamda topiladi.",
      },
      {
        e: '24 книги', s: 'Три разные доли от 24 книг.',
        a: 'Соедини каждую долю с её ответом.',
        left: ['1/4 часть', '2/3 части', '3/4 части'],
        right: ['6', '16', '18'],
        y: '24 : 4 = 6; 24 : 3 × 2 = 16; 24 : 4 × 3 = 18.',
        n: 'В каждой доле сначала раздели на знаменатель, потом умножь на числитель.',
        r: 'Долю числа находят в два шага.',
      }, undefined, {
        en: {
          e: '24 books', s: 'Three different parts of 24 books.',
          a: 'Connect each part with its answer.',
          left: ['the 1/4 part', 'the 2/3 part', 'the 3/4 part'],
          right: ['6', '16', '18'],
          y: '24 : 4 = 6; 24 : 3 × 2 = 16; 24 : 4 × 3 = 18.',
          n: 'For every part divide by the denominator first, then multiply by the numerator.',
          r: 'A part of a number is found in two steps.',
        },
      }),

    /* 9 · order · 🔴 — javoblarni tartiblash. */
    q('09', 'Javoblar tartibi', '🔴', 'd27-order-answers', 'order', '📈', [0, 2, 1, 3],
      {
        e: 'Qaysi kichik?', s: "24 ta kitobning to'rt xil ulushi. Har birini hisoblang.",
        a: 'Ulushlarni javobi bo\'yicha kichigidan kattasiga tartiblang.',
        o: ['1/4 qismi', '2/3 qismi', '1/2 qismi', '3/4 qismi'],
        y: '1/4 → 6, 1/2 → 12, 2/3 → 16, 3/4 → 18.',
        n: "Har ulushni ikki qadamda hisoblang, keyin javoblarni solishtiring.",
        r: "Ulush qancha katta bo'lsa, javob ham shuncha katta.",
      },
      {
        e: 'Где меньше?', s: 'Четыре разные доли от 24 книг. Посчитай каждую.',
        a: 'Расставь доли по ответу от меньшего к большему.',
        o: ['1/4 часть', '2/3 части', '1/2 часть', '3/4 части'],
        y: '1/4 → 6, 1/2 → 12, 2/3 → 16, 3/4 → 18.',
        n: 'Посчитай каждую долю в два шага, потом сравни ответы.',
        r: 'Чем больше доля, тем больше ответ.',
      }, undefined, {
        en: {
          e: 'Where is it smaller?', s: 'Four different parts of 24 books. Work each one out.',
          a: 'Put the parts in order of their answer, from the smallest to the largest.',
          o: ['the 1/4 part', 'the 2/3 part', 'the 1/2 part', 'the 3/4 part'],
          y: '1/4 gives 6, 1/2 gives 12, 2/3 gives 16, 3/4 gives 18.',
          n: 'Work out every part in two steps, then compare the answers.',
          r: 'The bigger the part, the bigger the answer.',
        },
      }),

    /* 10 · match · 🔴 — masala va yechim. */
    q('10', 'Masala va yechim', '🔴', 'd27-story', 'match', '🚀', [0, 1, 2],
      {
        e: 'Yakuniy mashq', s: "Uch masala. Har birida o'z ulushi topiladi.",
        a: 'Har masalani uning yechimiga ulang.',
        left: ['20 ta shardan 1/4 qismi', '20 ta shardan 3/5 qismi', '20 ta shardan 1/2 qismi'],
        right: ['20 : 4 = 5', '20 : 5 × 3 = 12', '20 : 2 = 10'],
        y: "Surat 1 bo'lsa, faqat bo'lish yetadi. Surat birdan katta bo'lsa, ko'paytirish ham kerak.",
        n: 'Har masalada suratga qarang: u 1 ga tengmi yoki kattami?',
        r: "Surat 1 bo'lsa, bir qadam; katta bo'lsa, ikki qadam.",
      },
      {
        e: 'Итоговое задание', s: 'Три задачи. В каждой находят свою долю.',
        a: 'Соедини каждую задачу с её решением.',
        left: ['1/4 от 20 шаров', '3/5 от 20 шаров', '1/2 от 20 шаров'],
        right: ['20 : 4 = 5', '20 : 5 × 3 = 12', '20 : 2 = 10'],
        y: 'Если числитель равен 1, хватает одного деления. Если больше — нужно ещё умножение.',
        n: 'В каждой задаче смотри на числитель: он равен 1 или больше?',
        r: 'Числитель 1 — один шаг; больше — два шага.',
      }, undefined, {
        en: {
          e: 'Final task', s: 'Three problems. Each one finds a part of its own.',
          a: 'Connect each problem with its solution.',
          left: ['1/4 of 20 balls', '3/5 of 20 balls', '1/2 of 20 balls'],
          right: ['20 : 4 = 5', '20 : 5 × 3 = 12', '20 : 2 = 10'],
          y: 'If the numerator is 1, one division is enough. If it is bigger, a multiplication is needed too.',
          n: 'In every problem look at the numerator: is it 1 or more?',
          r: 'Numerator 1 means one step; more than 1 means two steps.',
        },
      }),
  ],
};

export default DARS27_BANK;
