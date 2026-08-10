// Dars 30 amaliyoti — Kasrlarni qo'shish va ayirish.
// Nazariya: src/components/grade3/Dars30.jsx (num-3-30).
// Maxraji bir xil kasrlarda faqat suratlar qo'shiladi va ayiriladi, maxraj o'zgarmaydi.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 match · 2 choice · 3 order · 4 match · 5 order · 6 dnd · 7 multi · 8 input · 9 dnd · 10 choice
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS30_BANK = {
  title: "Dars 30 · Kasrlarni qo'shish va ayirish",
  items: [

    /* 1 · match · 🟢 — amal va natija. */
    q('01', 'Amal va natija', '🟢', 'd30-match-op', 'match', '🔗', [0, 1, 2],
      {
        e: 'Sakkizdan bo\'laklar', s: "Maxraj bir xil, shuning uchun faqat suratlar bilan ishlaymiz.",
        a: 'Har amalni uning natijasiga ulang.',
        left: ['2/8 + 3/8', '7/8 − 5/8', '1/8 + 6/8'],
        right: ['5/8', '2/8', '7/8'],
        y: '2/8 + 3/8 = 5/8, 7/8 − 5/8 = 2/8, 1/8 + 6/8 = 7/8.',
        n: 'Suratlarni qo\'shing yoki ayiring, maxrajni o\'zgartirmang.',
        r: 'Maxraji bir xil kasrlarda faqat suratlar qo\'shiladi.',
      },
      {
        e: 'Восьмые части', s: 'Знаменатель одинаковый, поэтому работаем только с числителями.',
        a: 'Соедини каждое действие с его результатом.',
        left: ['2/8 + 3/8', '7/8 − 5/8', '1/8 + 6/8'],
        right: ['5/8', '2/8', '7/8'],
        y: '2/8 + 3/8 = 5/8, 7/8 − 5/8 = 2/8, 1/8 + 6/8 = 7/8.',
        n: 'Складывай или вычитай числители, знаменатель не меняй.',
        r: 'У дробей с одинаковым знаменателем складываются только числители.',
      }, undefined, {
        en: {
          e: 'Eighths', s: 'The denominator is the same, so we work only with the numerators.',
          a: 'Connect each operation with its result.',
          left: ['2/8 + 3/8', '7/8 − 5/8', '1/8 + 6/8'],
          right: ['5/8', '2/8', '7/8'],
          y: '2/8 + 3/8 = 5/8, 7/8 − 5/8 = 2/8, 1/8 + 6/8 = 7/8.',
          n: 'Add or subtract the numerators and leave the denominator as it is.',
          r: 'For fractions with the same denominator only the numerators are added.',
        },
      }),

    /* 2 · choice · 🟢 — maxraj o'zgaradimi. */
    q('02', 'Maxraj o\'zgaradimi?', '🟢', 'd30-denom-stays', 'choice', '🔒', 1,
      {
        e: 'Qoidani eslang', s: "2/8 + 3/8 ni hisoblaymiz.",
        a: 'Javobda maxraj qanday bo\'ladi?',
        o: ['16', '8', '5', '11'],
        y: "Maxraj o'zgarmaydi: bo'laklar bir xil kattalikda qoladi, faqat soni ortadi.",
        n: "Qo'shganda bo'laklarning KATTALIGI o'zgaradimi yoki faqat SONI?",
        by: [
          "Maxrajlar qo'shilmaydi: bo'laklar maydalashib ketmaydi.",
          undefined,
          'Bu suratlarning yig\'indisi. Maxraj esa boshqa joyda turadi.',
          "Bu surat va maxrajning yig'indisi. Ular qo'shilmaydi.",
        ],
        r: "Maxraj o'zgarmaydi, faqat suratlar qo'shiladi.",
      },
      {
        e: 'Вспомни правило', s: 'Считаем 2/8 + 3/8.',
        a: 'Каким будет знаменатель в ответе?',
        o: ['16', '8', '5', '11'],
        y: 'Знаменатель не меняется: части остаются того же размера, растёт только их количество.',
        n: 'При сложении меняется РАЗМЕР частей или только их КОЛИЧЕСТВО?',
        by: [
          'Знаменатели не складывают: части не становятся мельче.',
          undefined,
          'Это сумма числителей. А знаменатель стоит в другом месте.',
          'Это сумма числителя и знаменателя. Их не складывают.',
        ],
        r: 'Знаменатель не меняется, складываются только числители.',
      }, undefined, {
        en: {
          e: 'Remember the rule', s: 'We are working out 2/8 + 3/8.',
          a: 'What will the denominator of the answer be?',
          o: ['16', '8', '5', '11'],
          y: 'The denominator does not change: the parts stay the same size, only how many there are grows.',
          n: 'When adding, does the SIZE of the parts change or only HOW MANY there are?',
          by: [
            'Denominators are not added: the parts do not become smaller.',
            undefined,
            'That is the sum of the numerators. And the denominator is somewhere else.',
            'That is the numerator added to the denominator. Those are never added.',
          ],
          r: 'The denominator does not change, only the numerators are added.',
        },
      }),

    /* 3 · order · 🟢 — qadamlar. */
    q('03', 'Qadamlar', '🟢', 'd30-steps', 'order', '🪜', [1, 2, 0],
      {
        e: 'Uch qadam', s: '2/8 + 3/8 ni hisoblaymiz, lekin qadamlar aralashgan.',
        a: 'Qadamlarni tartib bilan tanlang.',
        o: ['Javob 5/8', 'Maxrajlar bir xil ekanini tekshiraman', 'Suratlarni qo\'shaman: 2 + 3'],
        y: "Avval maxrajlarni tekshiramiz, keyin suratlarni qo'shamiz, oxirida javobni yozamiz.",
        n: "Qo'shishdan oldin nimani tekshirish kerak?",
        r: 'Maxrajlar bir xil bo\'lsa, faqat suratlar qo\'shiladi.',
      },
      {
        e: 'Три шага', s: 'Считаем 2/8 + 3/8, но шаги перепутались.',
        a: 'Выбери шаги по порядку.',
        o: ['Ответ 5/8', 'Проверяю, что знаменатели одинаковые', 'Складываю числители: 2 + 3'],
        y: 'Сначала проверяем знаменатели, потом складываем числители, в конце пишем ответ.',
        n: 'Что нужно проверить до сложения?',
        r: 'Если знаменатели одинаковые, складываются только числители.',
      }, undefined, {
        en: {
          e: 'Three steps', s: 'We are working out 2/8 + 3/8, but the steps got mixed up.',
          a: 'Pick the steps in order.',
          o: ['The answer is 5/8', 'I check that the denominators are the same', 'I add the numerators: 2 + 3'],
          y: 'First we check the denominators, then we add the numerators, and at the end we write the answer.',
          n: 'What has to be checked before adding?',
          r: 'If the denominators are the same, only the numerators are added.',
        },
      }),

    /* 4 · match · 🟡 — ayirish. */
    q('04', 'Ayirish natijalari', '🟡', 'd30-match-sub', 'match', '➖', [0, 1, 2],
      {
        e: 'Uch ayirish', s: "Maxraj bir xil: 8. Suratlarni ayiramiz.",
        a: 'Har amalni uning natijasiga ulang.',
        left: ['7/8 − 3/8', '6/8 − 1/8', '8/8 − 2/8'],
        right: ['4/8', '5/8', '6/8'],
        y: '7/8 − 3/8 = 4/8, 6/8 − 1/8 = 5/8, 8/8 − 2/8 = 6/8.',
        n: 'Suratlarni ayiring, maxrajni o\'zgartirmang.',
        r: 'Ayirishda ham maxraj o\'zgarmaydi.',
      },
      {
        e: 'Три вычитания', s: 'Знаменатель одинаковый: 8. Вычитаем числители.',
        a: 'Соедини каждое действие с его результатом.',
        left: ['7/8 − 3/8', '6/8 − 1/8', '8/8 − 2/8'],
        right: ['4/8', '5/8', '6/8'],
        y: '7/8 − 3/8 = 4/8, 6/8 − 1/8 = 5/8, 8/8 − 2/8 = 6/8.',
        n: 'Вычитай числители, знаменатель не меняй.',
        r: 'При вычитании знаменатель тоже не меняется.',
      }, undefined, {
        en: {
          e: 'Three subtractions', s: 'The denominator is the same: 8. We subtract the numerators.',
          a: 'Connect each operation with its result.',
          left: ['7/8 − 3/8', '6/8 − 1/8', '8/8 − 2/8'],
          right: ['4/8', '5/8', '6/8'],
          y: '7/8 − 3/8 = 4/8, 6/8 − 1/8 = 5/8, 8/8 − 2/8 = 6/8.',
          n: 'Subtract the numerators and leave the denominator as it is.',
          r: 'When subtracting, the denominator does not change either.',
        },
      }),

    /* 5 · order · 🟡 — natijalar tartibi. */
    q('05', 'Natijalar tartibi', '🟡', 'd30-order-results', 'order', '📈', [2, 1, 0, 3],
      {
        e: 'To\'rt amal', s: "To'rtta amal, maxraj bir xil: 8.",
        a: 'Amallarni natijasi bo\'yicha kichigidan kattasiga tartiblang.',
        o: ['3/8 + 2/8', '7/8 − 3/8', '1/8 + 1/8', '5/8 + 2/8'],
        y: '1/8 + 1/8 = 2/8, 7/8 − 3/8 = 4/8, 3/8 + 2/8 = 5/8, 5/8 + 2/8 = 7/8.',
        n: 'Har amalni hisoblang, keyin suratlarni solishtiring.',
        r: 'Maxraj bir xil bo\'lsa, natijalar suratlar bo\'yicha taqqoslanadi.',
      },
      {
        e: 'Четыре действия', s: 'Четыре действия, знаменатель одинаковый: 8.',
        a: 'Расставь действия по результату от меньшего к большему.',
        o: ['3/8 + 2/8', '7/8 − 3/8', '1/8 + 1/8', '5/8 + 2/8'],
        y: '1/8 + 1/8 = 2/8, 7/8 − 3/8 = 4/8, 3/8 + 2/8 = 5/8, 5/8 + 2/8 = 7/8.',
        n: 'Посчитай каждое действие, потом сравни числители.',
        r: 'При одинаковом знаменателе результаты сравнивают по числителям.',
      }, undefined, {
        en: {
          e: 'Four operations', s: 'Four operations, and the denominator is the same: 8.',
          a: 'Put the operations in order of their result, from the smallest to the largest.',
          o: ['3/8 + 2/8', '7/8 − 3/8', '1/8 + 1/8', '5/8 + 2/8'],
          y: '1/8 + 1/8 = 2/8, 7/8 − 3/8 = 4/8, 3/8 + 2/8 = 5/8, 5/8 + 2/8 = 7/8.',
          n: 'Work out every operation, then compare the numerators.',
          r: 'With the same denominator the results are compared by the numerators.',
        },
      }),

    /* 6 · dnd · 🟡 — butun chiqadimi. */
    q('06', 'Butun chiqadimi?', '🟡', 'd30-makes-one', 'dnd', '⭕', [0, 1, 0, 1],
      {
        e: 'Bir butun', s: "To'rtta amal. Ba'zilarida javob aynan bir butun chiqadi.",
        a: "Amallarni ajrating: qayerda javob butunga teng, qayerda yo'q.",
        tokens: ['3/8 + 5/8', '3/8 + 2/8', '2/5 + 3/5', '1/5 + 2/5'],
        zones: ['Butun chiqadi', 'Butun chiqmaydi'],
        dndHint: 'Amallar tugadi.',
        y: '3/8 + 5/8 = 8/8 va 2/5 + 3/5 = 5/5 — surat maxrajga tenglashdi, demak bir butun.',
        n: "Suratlarni qo'shing va natijani maxraj bilan solishtiring.",
        r: "Surat maxrajga tenglashsa, javob butun bo'ladi.",
      },
      {
        e: 'Одно целое', s: 'Четыре действия. В некоторых ответ равен ровно одному целому.',
        a: 'Разложи действия: где ответ равен целому, а где нет.',
        tokens: ['3/8 + 5/8', '3/8 + 2/8', '2/5 + 3/5', '1/5 + 2/5'],
        zones: ['Выходит целое', 'Целое не выходит'],
        dndHint: 'Действия закончились.',
        y: '3/8 + 5/8 = 8/8 и 2/5 + 3/5 = 5/5 — числитель сравнялся со знаменателем, значит целое.',
        n: 'Сложи числители и сравни результат со знаменателем.',
        r: 'Если числитель сравнялся со знаменателем, ответ равен целому.',
      }, undefined, {
        en: {
          e: 'One whole', s: 'Four operations. In some of them the answer is exactly one whole.',
          a: 'Sort the operations: where the answer is a whole and where it is not.',
          tokens: ['3/8 + 5/8', '3/8 + 2/8', '2/5 + 3/5', '1/5 + 2/5'],
          zones: ['A whole comes out', 'A whole does not come out'],
          dndHint: 'No operations left.',
          y: '3/8 + 5/8 = 8/8 and 2/5 + 3/5 = 5/5 — the numerator caught up with the denominator, so it is a whole.',
          n: 'Add the numerators and compare the result with the denominator.',
          r: 'If the numerator catches up with the denominator, the answer equals a whole.',
        },
      }),

    /* 7 · multi · 🟡 — 5/8 beradiganlar. */
    q('07', '5/8 chiqadi', '🟡', 'd30-gives-58', 'multi', '🎯', [0, 2],
      {
        e: 'Bir xil javob', s: "To'rtta amal. Ikkitasi 5/8 beradi.",
        a: 'Qaysi amallar 5/8 ga teng? Hammasini belgilang.',
        o: ['2/8 + 3/8', '2/8 + 2/8', '7/8 − 2/8', '8/8 − 2/8'],
        y: '2/8 + 3/8 = 5/8 va 7/8 − 2/8 = 5/8. Qolganlari 4/8 va 6/8.',
        n: 'Har amalda faqat suratlarni hisoblang.',
        r: 'Bir xil natijaga qo\'shish bilan ham, ayirish bilan ham kelish mumkin.',
      },
      {
        e: 'Одинаковый ответ', s: 'Четыре действия. Два дают 5/8.',
        a: 'Какие действия равны 5/8? Отметь все.',
        o: ['2/8 + 3/8', '2/8 + 2/8', '7/8 − 2/8', '8/8 − 2/8'],
        y: '2/8 + 3/8 = 5/8 и 7/8 − 2/8 = 5/8. Остальные дают 4/8 и 6/8.',
        n: 'В каждом действии считай только числители.',
        r: 'К одному результату можно прийти и сложением, и вычитанием.',
      }, undefined, {
        en: {
          e: 'The same answer', s: 'Four operations. Two of them give 5/8.',
          a: 'Which operations are equal to 5/8? Mark them all.',
          o: ['2/8 + 3/8', '2/8 + 2/8', '7/8 − 2/8', '8/8 − 2/8'],
          y: '2/8 + 3/8 = 5/8 and 7/8 − 2/8 = 5/8. The others give 4/8 and 6/8.',
          n: 'In every operation work only with the numerators.',
          r: 'The same result can be reached by adding and by subtracting.',
        },
      }),

    /* 8 · input · 🔴 — yo'qolgan surat. */
    q('08', 'Yo\'qolgan surat', '🔴', 'd30-missing-num', 'input', '🧩', ['3'],
      {
        e: 'Bo\'sh katak', s: '2/8 + □/8 = 5/8 tenglik berilgan.',
        a: 'Bo\'sh katakka qaysi son yoziladi?',
        y: '5 − 2 = 3. Demak 2/8 + 3/8 = 5/8.',
        n: 'Maxraj o\'zgarmaydi. Suratlar bilan oddiy qo\'shish tenglamasini yeching.',
        r: 'Yo\'qolgan surat ayirish bilan topiladi.',
        p: 'Javob',
      },
      {
        e: 'Пустая клетка', s: 'Дано равенство 2/8 + □/8 = 5/8.',
        a: 'Какое число пишется в пустую клетку?',
        y: '5 − 2 = 3. Значит 2/8 + 3/8 = 5/8.',
        n: 'Знаменатель не меняется. Реши обычное уравнение со сложением числителей.',
        r: 'Пропущенный числитель находят вычитанием.',
        p: 'Ответ',
      }, 'numeric', {
        en: {
          e: 'The empty cell', s: 'Here is the equality 2/8 + □/8 = 5/8.',
          a: 'Which number goes into the empty cell?',
          y: '5 − 2 = 3. So 2/8 + 3/8 = 5/8.',
          n: 'The denominator does not change. Solve an ordinary equation with the numerators.',
          r: 'A missing numerator is found by subtracting.',
          p: 'Answer',
        },
      }),

    /* 9 · dnd · 🔴 — to'g'ri yoki xato. */
    q('09', 'To\'g\'ri yechilganmi?', '🔴', 'd30-check', 'dnd', '🔎', [0, 1, 0, 1],
      {
        e: 'Xatoni toping', s: "To'rtta yechim. Ikkitasida maxraj ham qo'shib yuborilgan.",
        a: "Yechimlarni ajrating: qaysilari to'g'ri, qaysilari xato.",
        tokens: ['2/8 + 3/8 = 5/8', '2/8 + 3/8 = 5/16', '1/5 + 2/5 = 3/5', '1/5 + 2/5 = 3/10'],
        zones: ["To'g'ri", 'Xato'],
        dndHint: 'Yechimlar tugadi.',
        y: "Xato yechimlarda maxrajlar ham qo'shilgan. Bo'laklar kattaligi o'zgarmasligi kerak edi.",
        n: 'Har yechimda maxrajga qarang: u o\'zgarganmi?',
        r: 'Maxraj hech qachon qo\'shilmaydi.',
      },
      {
        e: 'Найди ошибку', s: 'Четыре решения. В двух сложили и знаменатели.',
        a: 'Разложи решения: где верно, а где ошибка.',
        tokens: ['2/8 + 3/8 = 5/8', '2/8 + 3/8 = 5/16', '1/5 + 2/5 = 3/5', '1/5 + 2/5 = 3/10'],
        zones: ['Верно', 'Ошибка'],
        dndHint: 'Решения закончились.',
        y: 'В неверных решениях сложили и знаменатели. А размер частей меняться не должен.',
        n: 'В каждом решении посмотри на знаменатель: он изменился?',
        r: 'Знаменатели никогда не складывают.',
      }, undefined, {
        en: {
          e: 'Find the mistake', s: 'Four solutions. In two of them the denominators were added as well.',
          a: 'Sort the solutions: which ones are right and which are a mistake.',
          tokens: ['2/8 + 3/8 = 5/8', '2/8 + 3/8 = 5/16', '1/5 + 2/5 = 3/5', '1/5 + 2/5 = 3/10'],
          zones: ['Right', 'A mistake'],
          dndHint: 'No solutions left.',
          y: 'In the wrong solutions the denominators were added too. But the size of the parts must not change.',
          n: 'In every solution look at the denominator: did it change?',
          r: 'Denominators are never added.',
        },
      }),

    /* 10 · choice · 🔴 — masala. */
    q('10', 'Tort masalasi', '🔴', 'd30-story', 'choice', '🚀', 1,
      {
        e: 'Yakuniy mashq', s: "Tort 8 teng bo'lakka bo'lingan. Anvar 3 bo'lak, Zuhra 2 bo'lak oldi.",
        a: 'Tortning qancha qismi qoldi?',
        o: ['5/8', '3/8', '2/8', '5/16'],
        y: "Olingani 3/8 + 2/8 = 5/8. Qolgani 8/8 − 5/8 = 3/8.",
        n: "Avval jami olinganini toping, keyin butundan ayiring.",
        by: [
          "Bu olingan qism, qolgan emas. Butundan ayirishni unutdingiz.",
          undefined,
          "Bu faqat Zuhraning ulushi. Anvarniki ham hisobga olinishi kerak.",
          "Maxrajlar qo'shilmaydi: bo'laklar kattaligi o'zgarmaydi.",
        ],
        r: 'Qolgan qism: butundan olinganini ayiramiz.',
      },
      {
        e: 'Итоговое задание', s: 'Торт разделили на 8 равных частей. Анвар взял 3 части, Зухра 2.',
        a: 'Какая часть торта осталась?',
        o: ['5/8', '3/8', '2/8', '5/16'],
        y: 'Взяли 3/8 + 2/8 = 5/8. Осталось 8/8 − 5/8 = 3/8.',
        n: 'Сначала найди, сколько взяли всего, потом вычти из целого.',
        by: [
          'Это взятая часть, а не оставшаяся. Ты забыл вычесть из целого.',
          undefined,
          'Это только доля Зухры. Долю Анвара тоже нужно учесть.',
          'Знаменатели не складывают: размер частей не меняется.',
        ],
        r: 'Оставшаяся часть: из целого вычитаем взятое.',
      }, undefined, {
        en: {
          e: 'Final task', s: 'A cake was cut into 8 equal parts. Anvar took 3 parts and Zuhra took 2.',
          a: 'What part of the cake is left?',
          o: ['5/8', '3/8', '2/8', '5/16'],
          y: 'They took 3/8 + 2/8 = 5/8. Left over: 8/8 − 5/8 = 3/8.',
          n: 'Find how much was taken in all first, then subtract it from the whole.',
          by: [
            'That is the part that was taken, not the part that is left. You forgot to subtract it from the whole.',
            undefined,
            "That is only Zuhra's share. Anvar's share has to be counted too.",
            'Denominators are not added: the size of the parts does not change.',
          ],
          r: 'What is left: we subtract what was taken from the whole.',
        },
      }),
  ],
};

export default DARS30_BANK;
