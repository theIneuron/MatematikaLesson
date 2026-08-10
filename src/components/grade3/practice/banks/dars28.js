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
      }, undefined, {
        en: {
          e: 'Three kinds of fractions', s: 'Compare the numerator with the denominator and the kind of fraction becomes clear.',
          a: 'Connect each fraction with its kind.',
          left: ['3/8', '8/8', '11/8'],
          right: ['A proper fraction', 'A whole', 'An improper fraction'],
          y: 'Numerator smaller than the denominator means proper; equal means a whole; bigger means improper.',
          n: 'In every fraction compare the numerator with the denominator: smaller, equal or bigger?',
          r: 'If the numerator is smaller than the denominator it is proper, if bigger it is improper.',
        },
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
      }, undefined, {
        en: {
          e: 'Two shelves', s: 'Four fractions. Let us sort them by kind.',
          a: 'Sort the fractions: which ones are proper and which are improper.',
          tokens: ['3/4', '7/4', '2/5', '9/5'],
          zones: ['A proper fraction', 'An improper fraction'],
          dndHint: 'No fractions left.',
          y: 'In 3/4 and 2/5 the numerator is smaller than the denominator. In 7/4 and 9/5 it is bigger, so they are improper.',
          n: 'In every fraction compare the number above the line with the one under it.',
          r: 'An improper fraction is bigger than a whole.',
        },
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
      }, undefined, {
        en: {
          e: 'The same denominator', s: 'Four fractions have the same denominator: 4.',
          a: 'Put the fractions in order from the smallest to the largest.',
          o: ['5/4', '1/4', '7/4', '4/4'],
          y: '1/4 < 4/4 < 5/4 < 7/4. Here 4/4 is a whole, and after it the fractions are bigger than a whole.',
          n: 'The denominator is the same, so we only count the numerators.',
          r: 'With the same denominator we compare the numerators.',
        },
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
      }, undefined, {
        en: {
          e: 'One whole', s: 'Four fractions. Two of them are exactly one whole.',
          a: 'Which fractions are equal to ONE WHOLE? Mark them all.',
          o: ['4/4', '5/4', '7/7', '6/7'],
          y: 'In 4/4 and 7/7 the numerator equals the denominator, so all the parts were taken.',
          n: 'If you take all the parts, what does the numerator become?',
          r: 'If the numerator equals the denominator, the fraction equals a whole.',
        },
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
      }, undefined, {
        en: {
          e: 'The whole is the border', s: 'Four fractions. Compare each one with one whole.',
          a: 'Sort the fractions: which ones are bigger than a whole and which are smaller.',
          tokens: ['2/3', '5/3', '3/5', '8/5'],
          zones: ['Bigger than a whole', 'Smaller than a whole'],
          dndHint: 'No fractions left.',
          y: 'In 5/3 and 8/5 the numerator is bigger than the denominator, so the fraction is bigger than a whole.',
          n: 'In every fraction compare the numerator with the denominator.',
          r: 'If the numerator is bigger than the denominator, the fraction is bigger than a whole.',
        },
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
      }, undefined, {
        en: {
          e: 'Which ones are improper?', s: 'Here are four fractions.',
          a: 'Which fractions are IMPROPER? Mark them all.',
          o: ['3/7', '9/7', '11/4', '3/4'],
          y: 'In 9/7 and 11/4 the numerator is bigger than the denominator. Such a fraction is bigger than a whole.',
          n: 'An improper fraction has a numerator bigger than its denominator.',
          r: 'An improper fraction can also be read as a whole with a remainder.',
        },
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
      }, 'numeric', {
        en: {
          e: 'Count the wholes', s: 'In the fraction 9/4 the parts were taken as quarters.',
          a: 'How many FULL wholes are there in 9/4?',
          y: '9 : 4 = 2 with a remainder of 1. So there are two full wholes and 1/4 more.',
          n: 'How many parts fill one whole? How many such sets are there in nine?',
          r: 'An improper fraction can be split into a whole and a remainder: 9/4 = 2 wholes and 1/4.',
          p: 'Answer',
        },
      }),

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
      }, undefined, {
        en: {
          e: 'A whole and a remainder', s: 'We are writing the fraction 11/4 as a whole and a remainder.',
          a: 'How is 11/4 read?',
          o: ['4 wholes and 3/11', '3 wholes and 1/4', '2 wholes and 3/4', '11 wholes and 4/4'],
          y: '11 : 4 = 2 with a remainder of 3. So it is 2 wholes and 3/4.',
          n: 'Divide the numerator by the denominator with a remainder: the quotient is the wholes, the remainder is the numerator.',
          by: [
            'The numbers swapped places here: 4 was the denominator and 11 the numerator.',
            '3 × 4 = 12, and that is more than 11. Three full wholes will not come out.',
            undefined,
            '11 wholes is far too many: 11/4 is only a few times bigger than a whole.',
          ],
          r: 'An improper fraction is read as a whole with a remainder: 11/4 = 2 wholes 3/4.',
        },
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
      }, 'numeric', {
        en: {
          e: 'Find the remainder', s: 'We are writing the fraction 13/5 as a whole and a remainder.',
          a: 'What will the numerator of the remainder be?',
          y: '13 : 5 = 2 with a remainder of 3. So 13/5 = 2 wholes and 3/5.',
          n: 'Divide the numerator by the denominator with a remainder. The remainder becomes the new numerator.',
          r: 'The remainder becomes the new numerator and the denominator does not change.',
          p: 'Answer',
        },
      }),

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
      }, undefined, {
        en: {
          e: 'Final task', s: 'Four fractions with the same denominator 4.',
          a: 'Put the fractions in order from the smallest to the largest.',
          o: ['9/4', '3/4', '13/4', '4/4'],
          y: '3/4 < 4/4 < 9/4 < 13/4. The denominator is the same, so the order of the numerators gives the answer.',
          n: 'The denominator is the same, so compare only the numerators.',
          r: 'A proper fraction is smaller than a whole and an improper one is bigger.',
        },
      }),
  ],
};

export default DARS28_BANK;
