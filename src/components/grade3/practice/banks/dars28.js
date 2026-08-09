// Dars 28 amaliyoti — Butundan katta kasrlar.
// Nazariya: src/components/grade3/Dars28.jsx (num-3-28).
// Surat maxrajdan kichik — to'g'ri kasr, katta — noto'g'ri, teng — bir.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 match · 2 dnd · 3 order · 4 multi · 5 dnd · 6 multi · 7 input · 8 choice · 9 input · 10 order
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS28_BANK = {
  title: 'Dars 28 · Butundan katta kasrlar',
  items: [

    /* 1 · match · 🟢 — kasr turi. */
    q('01', 'Kasr turi', '🟢', 'd28-kind', 'match', '🔗', [0, 1, 2],
      {
        e: 'Uch xil kasr', s: "Suratni maxraj bilan solishtirsak, kasrning turi ma'lum bo'ladi.",
        a: 'Har kasrni uning turiga ulang.',
        left: ['3/8', '8/8', '11/8'],
        right: ["To'g'ri kasr", 'Bir butun', "Noto'g'ri kasr"],
        y: "Surat maxrajdan kichik — to'g'ri; teng — bir butun; katta — noto'g'ri kasr.",
        n: 'Har kasrda suratni maxraj bilan solishtiring: kichikmi, tengmi, kattami?',
        r: "Surat maxrajdan kichik bo'lsa to'g'ri, katta bo'lsa noto'g'ri kasr.",
      },
      {
        e: 'Три вида дробей', s: 'Если сравнить числитель со знаменателем, станет ясен вид дроби.',
        a: 'Соедини каждую дробь с её видом.',
        left: ['3/8', '8/8', '11/8'],
        right: ['Правильная дробь', 'Целое', 'Неправильная дробь'],
        y: 'Числитель меньше знаменателя — правильная; равен — целое; больше — неправильная.',
        n: 'В каждой дроби сравни числитель со знаменателем: меньше, равен или больше?',
        r: 'Если числитель меньше знаменателя — правильная, если больше — неправильная.',
      }),

    /* 2 · dnd · 🟢 — to'g'ri yoki noto'g'ri. */
    q('02', 'To\'g\'ri yoki noto\'g\'ri?', '🟢', 'd28-sort-kind', 'dnd', '🗂️', [0, 1, 0, 1],
      {
        e: 'Ikki raf', s: "To'rtta kasr. Ularni turiga qarab ajratamiz.",
        a: "Kasrlarni ajrating: qaysilari to'g'ri, qaysilari noto'g'ri kasr.",
        tokens: ['3/4', '7/4', '2/5', '9/5'],
        zones: ["To'g'ri kasr", "Noto'g'ri kasr"],
        dndHint: 'Kasrlar tugadi.',
        y: "3/4 va 2/5 — surat maxrajdan kichik. 7/4 va 9/5 — surat katta, demak noto'g'ri.",
        n: 'Har kasrda chiziq ustidagi va tagidagi sonni solishtiring.',
        r: "Noto'g'ri kasr butundan katta bo'ladi.",
      },
      {
        e: 'Две полки', s: 'Четыре дроби. Разложим их по виду.',
        a: 'Разложи дроби: какие правильные, а какие неправильные.',
        tokens: ['3/4', '7/4', '2/5', '9/5'],
        zones: ['Правильная дробь', 'Неправильная дробь'],
        dndHint: 'Дроби закончились.',
        y: 'У 3/4 и 2/5 числитель меньше знаменателя. У 7/4 и 9/5 больше, значит неправильные.',
        n: 'В каждой дроби сравни число над чертой и под чертой.',
        r: 'Неправильная дробь больше целого.',
      }),

    /* 3 · order · 🟢 — kasrlar tartibi. */
    q('03', 'Kasrlar tartibi', '🟢', 'd28-order', 'order', '📈', [1, 3, 0, 2],
      {
        e: 'Bir xil maxraj', s: "To'rtta kasrda maxraj bir xil: 4.",
        a: 'Kasrlarni kichigidan kattasiga qarab tartiblang.',
        o: ['5/4', '1/4', '7/4', '4/4'],
        y: '1/4 < 4/4 < 5/4 < 7/4. 4/4 — bu bir butun, undan keyingi kasrlar butundan katta.',
        n: 'Maxraj bir xil, demak faqat suratlarni sanaymiz.',
        r: 'Maxraj bir xil bo\'lsa, suratni solishtiramiz.',
      },
      {
        e: 'Одинаковый знаменатель', s: 'У четырёх дробей знаменатель одинаковый: 4.',
        a: 'Расставь дроби от меньшей к большей.',
        o: ['5/4', '1/4', '7/4', '4/4'],
        y: '1/4 < 4/4 < 5/4 < 7/4. Здесь 4/4 — это целое, а дальше дроби больше целого.',
        n: 'Знаменатель одинаковый, значит считаем только числители.',
        r: 'При одинаковом знаменателе сравниваем числители.',
      }),

    /* 4 · multi · 🟡 — butunga teng. */
    q('04', 'Butunga teng', '🟡', 'd28-equal-one', 'multi', '⭕', [0, 2],
      {
        e: 'Bir butun', s: "To'rtta kasr. Ikkitasi aynan bir butunga teng.",
        a: 'Qaysi kasrlar BIR BUTUNGA teng? Hammasini belgilang.',
        o: ['4/4', '5/4', '7/7', '6/7'],
        y: "4/4 va 7/7 — surat maxrajga teng, demak hamma bo'laklar olingan.",
        n: "Hamma bo'laklar olinsa, surat qanday bo'ladi?",
        r: "Surat maxrajga teng bo'lsa, kasr bir butunga teng.",
      },
      {
        e: 'Одно целое', s: 'Четыре дроби. Две равны ровно одному целому.',
        a: 'Какие дроби равны ОДНОМУ ЦЕЛОМУ? Отметь все.',
        o: ['4/4', '5/4', '7/7', '6/7'],
        y: 'У 4/4 и 7/7 числитель равен знаменателю, значит взяты все части.',
        n: 'Если взять все части, каким станет числитель?',
        r: 'Если числитель равен знаменателю, дробь равна целому.',
      }),

    /* 5 · dnd · 🟡 — butundan katta yoki kichik. */
    q('05', 'Butun bilan solishtiring', '🟡', 'd28-vs-one', 'dnd', '⚖️', [1, 0, 1, 0],
      {
        e: 'Bir butun chegara', s: "To'rtta kasr. Har birini bir butun bilan solishtiring.",
        a: 'Kasrlarni ajrating: qaysilari butundan katta, qaysilari kichik.',
        tokens: ['2/3', '5/3', '3/5', '8/5'],
        zones: ['Butundan katta', 'Butundan kichik'],
        dndHint: 'Kasrlar tugadi.',
        y: '5/3 va 8/5 — surat maxrajdan katta, demak butundan ham katta.',
        n: 'Har kasrda suratni maxraj bilan solishtiring.',
        r: "Surat maxrajdan katta bo'lsa, kasr butundan katta.",
      },
      {
        e: 'Граница — целое', s: 'Четыре дроби. Сравни каждую с одним целым.',
        a: 'Разложи дроби: какие больше целого, а какие меньше.',
        tokens: ['2/3', '5/3', '3/5', '8/5'],
        zones: ['Больше целого', 'Меньше целого'],
        dndHint: 'Дроби закончились.',
        y: 'У 5/3 и 8/5 числитель больше знаменателя, значит и дробь больше целого.',
        n: 'В каждой дроби сравни числитель со знаменателем.',
        r: 'Если числитель больше знаменателя, дробь больше целого.',
      }),

    /* 6 · multi · 🟡 — noto'g'ri kasrlar. */
    q('06', 'Noto\'g\'ri kasrlar', '🟡', 'd28-improper', 'multi', '🎯', [1, 2],
      {
        e: 'Qaysilari noto\'g\'ri?', s: "To'rtta kasr berilgan.",
        a: 'Qaysi kasrlar NOTO\'G\'RI? Hammasini belgilang.',
        o: ['3/7', '9/7', '11/4', '3/4'],
        y: "9/7 va 11/4 — surat maxrajdan katta. Bunday kasr butundan katta bo'ladi.",
        n: "Noto'g'ri kasrda surat maxrajdan katta bo'ladi.",
        r: "Noto'g'ri kasr butun va qoldiq ko'rinishida ham o'qiladi.",
      },
      {
        e: 'Какие неправильные?', s: 'Даны четыре дроби.',
        a: 'Какие дроби НЕПРАВИЛЬНЫЕ? Отметь все.',
        o: ['3/7', '9/7', '11/4', '3/4'],
        y: 'У 9/7 и 11/4 числитель больше знаменателя. Такая дробь больше целого.',
        n: 'У неправильной дроби числитель больше знаменателя.',
        r: 'Неправильную дробь читают и как целое с остатком.',
      }),

    /* 7 · input · 🟡 — nechta butun. */
    q('07', 'Nechta butun?', '🟡', 'd28-how-many-wholes', 'input', '🔢', ['2'],
      {
        e: 'Butunlarni sanang', s: "9/4 kasrida to'rttadan bo'laklar olingan.",
        a: '9/4 da nechta TO\'LA butun bor?',
        y: "9 : 4 = 2, qoldiq 1. Demak ikkita to'la butun va yana 1/4 qoladi.",
        n: "Nechta bo'lak bitta butunni to'ldiradi? 9 tada shunday to'plam nechta?",
        r: "Noto'g'ri kasrni butun va qoldiqqa ajratish mumkin: 9/4 = 2 butun va 1/4.",
        p: 'Javob',
      },
      {
        e: 'Посчитай целые', s: 'В дроби 9/4 взяты части по четвертям.',
        a: 'Сколько ПОЛНЫХ целых в 9/4?',
        y: '9 : 4 = 2, остаток 1. Значит два полных целых и ещё 1/4.',
        n: 'Сколько частей заполняют одно целое? Сколько таких наборов в девяти?',
        r: 'Неправильную дробь можно разделить на целое и остаток: 9/4 = 2 целых и 1/4.',
        p: 'Ответ',
      }, 'numeric'),

    /* 8 · choice · 🔴 — aralash son. */
    q('08', 'Aralash son', '🔴', 'd28-mixed', 'choice', '🔀', 2,
      {
        e: 'Butun va qoldiq', s: "11/4 kasrini butun va qoldiq ko'rinishida yozamiz.",
        a: '11/4 qanday o\'qiladi?',
        o: ['4 butun va 3/11', '3 butun va 1/4', '2 butun va 3/4', '11 butun va 4/4'],
        y: '11 : 4 = 2, qoldiq 3. Demak 2 butun va 3/4.',
        n: "Suratni maxrajga qoldiqli bo'ling: bo'linma — butunlar, qoldiq — surat.",
        by: [
          'Bu yerda sonlar joy almashgan: 4 maxraj edi, 11 surat.',
          '3 × 4 = 12, bu 11 dan katta. Uchta to\'la butun chiqmaydi.',
          undefined,
          "11 butun juda ko'p: 11/4 butundan atigi bir necha marta katta.",
        ],
        r: "Noto'g'ri kasr butun va qoldiq ko'rinishida o'qiladi: 11/4 = 2 butun 3/4.",
      },
      {
        e: 'Целое и остаток', s: 'Записываем дробь 11/4 в виде целого и остатка.',
        a: 'Как читается 11/4?',
        o: ['4 целых и 3/11', '3 целых и 1/4', '2 целых и 3/4', '11 целых и 4/4'],
        y: '11 : 4 = 2, остаток 3. Значит 2 целых и 3/4.',
        n: 'Раздели числитель на знаменатель с остатком: частное — целые, остаток — числитель.',
        by: [
          'Здесь числа поменялись местами: 4 был знаменателем, 11 числителем.',
          '3 × 4 = 12, это больше 11. Трёх полных целых не выйдет.',
          undefined,
          '11 целых — слишком много: 11/4 больше целого всего в несколько раз.',
        ],
        r: 'Неправильную дробь читают как целое с остатком: 11/4 = 2 целых 3/4.',
      }),

    /* 9 · input · 🔴 — qoldiq surati. */
    q('09', 'Qoldiq surati', '🔴', 'd28-rest-num', 'input', '✍️', ['3'],
      {
        e: 'Qoldiqni toping', s: "13/5 kasrini butun va qoldiq ko'rinishida yozamiz.",
        a: 'Qoldiqning surati qanday bo\'ladi?',
        y: '13 : 5 = 2, qoldiq 3. Demak 13/5 = 2 butun va 3/5.',
        n: "Suratni maxrajga qoldiqli bo'ling. Qoldiq yangi surat bo'ladi.",
        r: 'Qoldiq yangi surat, maxraj esa o\'zgarmaydi.',
        p: 'Javob',
      },
      {
        e: 'Найди остаток', s: 'Записываем дробь 13/5 в виде целого и остатка.',
        a: 'Каким будет числитель остатка?',
        y: '13 : 5 = 2, остаток 3. Значит 13/5 = 2 целых и 3/5.',
        n: 'Раздели числитель на знаменатель с остатком. Остаток и станет новым числителем.',
        r: 'Остаток становится новым числителем, а знаменатель не меняется.',
        p: 'Ответ',
      }, 'numeric'),

    /* 10 · order · 🔴 — aralash va oddiy. */
    q('10', 'Umumiy tartib', '🔴', 'd28-order-all', 'order', '🚀', [1, 3, 0, 2],
      {
        e: 'Yakuniy mashq', s: "To'rtta kasr, maxraji bir xil: 4.",
        a: 'Kasrlarni kichigidan kattasiga qarab tartiblang.',
        o: ['9/4', '3/4', '13/4', '4/4'],
        y: '3/4 < 4/4 < 9/4 < 13/4. Maxraj bir xil, shuning uchun suratlar tartibi javobni beradi.',
        n: "Maxraj bir xil bo'lgani uchun faqat suratlarni solishtiring.",
        r: "To'g'ri kasr butundan kichik, noto'g'ri kasr esa katta.",
      },
      {
        e: 'Итоговое задание', s: 'Четыре дроби с одинаковым знаменателем 4.',
        a: 'Расставь дроби от меньшей к большей.',
        o: ['9/4', '3/4', '13/4', '4/4'],
        y: '3/4 < 4/4 < 9/4 < 13/4. Знаменатель одинаковый, поэтому порядок числителей и даёт ответ.',
        n: 'Знаменатель одинаковый, поэтому сравнивай только числители.',
        r: 'Правильная дробь меньше целого, неправильная больше.',
      }),
  ],
};

export default DARS28_BANK;
