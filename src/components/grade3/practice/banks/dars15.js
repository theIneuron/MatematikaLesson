// Dars 15 amaliyoti — Ko'paytirish va bo'lishga masalalar.
// Nazariya: src/components/grade3/Dars15.jsx (num-3-15).
// Bank newBanks.js dan ko'chirildi va §1A kanoniga keltirildi.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 input · 2 match · 3 choice · 4 dnd · 5 match · 6 dnd · 7 multi · 8 choice · 9 multi · 10 order
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS15_BANK = {
  title: "Dars 15 · Ko'paytirish va bo'lishga masalalar",
  items: [

    /* 1 · input · 🟢 — teng guruhlar. Eski 02. */
    q('01', 'Jami qancha?', '🟢', 'd15-total-56', 'input', '🔦', ['56'],
      {
        e: 'Teng guruhlar', s: "7 ta quti bor. Har bir qutida 8 tadan chiroq.",
        a: 'Barcha qutilarda jami nechta chiroq bor?',
        y: '7 × 8 = 56 ta chiroq.',
        n: "Qutilar soni bilan har qutidagi chiroqlar sonini ko'paytiring.",
        r: "Teng guruhlardagi jami miqdor ko'paytirish bilan topiladi.",
        p: 'Javob',
      },
      {
        e: 'Равные группы', s: 'Есть 7 коробок. В каждой по 8 лампочек.',
        a: 'Сколько всего лампочек во всех коробках?',
        y: '7 × 8 = 56 лампочек.',
        n: 'Умножь число коробок на число лампочек в одной коробке.',
        r: 'Общее количество в равных группах находят умножением.',
        p: 'Ответ',
      }, 'numeric', {
        en: {
          e: 'Equal groups', s: 'There are 7 boxes. Each one holds 8 bulbs.',
          a: 'How many bulbs are there in all the boxes together?',
          y: '7 × 8 = 56 bulbs.',
          n: 'Multiply the number of boxes by the number of bulbs in one box.',
          r: 'The total in equal groups is found by multiplying.',
          p: 'Answer',
        },
      }),

    /* 2 · match · 🟢 — vaziyat va amal. */
    q('02', 'Qaysi amal?', '🟢', 'd15-match-op', 'match', '🔗', [0, 1, 2],
      {
        e: 'Vaziyat va amal', s: "Uch vaziyat. Har birida jami miqdor bilan boshqacha ish qilinadi.",
        a: 'Har vaziyatni unga mos amalga ulang.',
        left: ['5 savat, har birida 7 ta', '63 ta detal 9 guruhga', '8 ta kitobga 4 ta qo\'shildi'],
        right: ["Ko'paytirish", "Bo'lish", "Qo'shish"],
        y: "Teng guruhlarda jami — ko'paytirish; teng qismlarga ajratish — bo'lish; ustiga qo'shish — qo'shish.",
        n: 'Har vaziyatda jami miqdor bormi yoki uni topish kerakmi? Qismlar tengmi?',
        r: "Amal kalit so'zga emas, sonlar orasidagi bog'lanishga qarab tanlanadi.",
      },
      {
        e: 'Какое действие?', s: 'Три ситуации. В каждой с общим количеством делают разное.',
        a: 'Соедини каждую ситуацию с нужным действием.',
        left: ['5 корзин, в каждой по 7', '63 детали на 9 групп', 'К 8 книгам добавили 4'],
        right: ['Умножение', 'Деление', 'Сложение'],
        y: 'Общее в равных группах — умножение; разделить на равные части — деление; добавить сверху — сложение.',
        n: 'В каждой ситуации общее количество известно или его надо найти? Части равные?',
        r: 'Действие выбирают не по ключевому слову, а по связи между числами.',
      }, undefined, {
        en: {
          e: 'Which operation?', s: 'Three situations. In each one something different is done with the total.',
          a: 'Connect each situation with the operation it needs.',
          left: ['5 baskets with 7 in each', '63 parts into 9 groups', '4 more books added to 8'],
          right: ['Multiplication', 'Division', 'Addition'],
          y: 'The total in equal groups is a multiplication; splitting into equal parts is a division; adding on top is an addition.',
          n: 'In each situation, is the total known or does it have to be found? Are the parts equal?',
          r: 'The operation is chosen by the link between the numbers, not by a key word.',
        },
      }),

    /* 3 · choice · 🟢 — teng taqsimlash. Eski 03, 4-chi variant qo'shildi. */
    q('03', 'Teng taqsimlash', '🟢', 'd15-share-63', 'choice', '⚖️', 2,
      {
        e: 'Qaysi yozuv topadi?', s: '63 ta detal 9 ta teng guruhga ajratildi.',
        a: 'Har bir guruhda nechta detal borligini qaysi yozuv topadi?',
        o: ['63 × 9', '63 − 9', '63 : 9', '63 + 9'],
        y: '63 : 9 = 7. Har bir guruhda 7 tadan detal bor.',
        n: 'Jami miqdor ma\'lum, guruhlar soni ham. Bittasidagi miqdorni qanday topamiz?',
        by: [
          "Ko'paytirsak, detallar soni yanada ko'payib ketadi. Bu yerda esa ular taqsimlanmoqda.",
          "Ayirsak, atigi 9 ta detal chiqib ketadi. Lekin ular 9 guruhga bo'linmoqda.",
          undefined,
          "Qo'shsak, detallar soni ortadi. Taqsimlashda esa jami o'zgarmaydi.",
        ],
        r: "Teng guruhdagi miqdor jami miqdorni guruhlar soniga bo'lib topiladi.",
      },
      {
        e: 'Какая запись находит?', s: '63 детали разложили на 9 равных групп.',
        a: 'Какая запись находит, сколько деталей в одной группе?',
        o: ['63 × 9', '63 − 9', '63 : 9', '63 + 9'],
        y: '63 : 9 = 7. В каждой группе по 7 деталей.',
        n: 'Общее количество известно, число групп тоже. Как найти количество в одной?',
        by: [
          'При умножении деталей стало бы ещё больше. А здесь их раскладывают.',
          'При вычитании ушло бы всего 9 деталей. А их делят на 9 групп.',
          undefined,
          'При сложении деталей станет больше. А при раскладывании общее не меняется.',
        ],
        r: 'Количество в равной группе находят делением общего на число групп.',
      }, undefined, {
        en: {
          e: 'Which record finds it?', s: '63 parts were put into 9 equal groups.',
          a: 'Which record finds how many parts are in one group?',
          o: ['63 × 9', '63 − 9', '63 : 9', '63 + 9'],
          y: '63 : 9 = 7. There are 7 parts in each group.',
          n: 'The total is known and so is the number of groups. How do you find the amount in one?',
          by: [
            'Multiplying would make even more parts. And here they are being laid out.',
            'Subtracting would take away only 9 parts. And here they go into 9 groups.',
            undefined,
            'Adding would make more parts. And laying them out does not change the total.',
          ],
          r: 'The amount in an equal group is found by dividing the total by the number of groups.',
        },
      }),

    /* 4 · dnd · 🟡 — ko'paytirish yoki bo'lish. Eski 07. */
    q('04', "Ko'paytirish yoki bo'lish?", '🟡', 'd15-sort-ops', 'dnd', '🗂️', [1, 0, 1, 0],
      {
        e: 'Vaziyatni ajrating', s: "To'rtta vaziyat. Ba'zilarida jami topiladi, ba'zilarida taqsimlanadi.",
        a: "Vaziyatlarni ajrating: qayerda ko'paytirish, qayerda bo'lish kerak.",
        tokens: ['40 ta gulni 5 guldonga', '6 quti, har birida 7 ta', '54 km ni 6 kunga', '8 ta jamoa, har birida 5 kishi'],
        zones: ["Ko'paytirish", "Bo'lish"],
        dndHint: 'Vaziyatlar tugadi.',
        y: "Birinchi va uchinchida jami miqdor teng qismlarga bo'linadi. Qolganlarida jami topilmoqda.",
        n: 'Jami miqdor ma\'lummi? Ma\'lum bo\'lsa va u bo\'linayotgan bo\'lsa — bo\'lish.',
        r: "Bo'lish jami miqdorni teng qismlarga ajratishda ishlatiladi.",
      },
      {
        e: 'Раздели ситуации', s: 'Четыре ситуации. В одних находят общее, в других раскладывают.',
        a: 'Разложи ситуации: где нужно умножение, а где деление.',
        tokens: ['40 цветов в 5 ваз', '6 коробок, в каждой по 7', '54 км на 6 дней', '8 команд, в каждой по 5'],
        zones: ['Умножение', 'Деление'],
        dndHint: 'Ситуации закончились.',
        y: 'В первой и третьей общее количество делится на равные части. В остальных общее находят.',
        n: 'Общее количество известно? Если известно и его делят — это деление.',
        r: 'Деление используют, когда общее количество делят на равные части.',
      }, undefined, {
        en: {
          e: 'Sort the situations', s: 'Four situations. In some the total is found, in others it is shared out.',
          a: 'Sort the situations: which ones need a multiplication and which a division.',
          tokens: ['40 flowers into 5 vases', '6 boxes with 7 in each', '54 km over 6 days', '8 teams with 5 in each'],
          zones: ['Multiplication', 'Division'],
          dndHint: 'No situations left.',
          y: 'In the first and the third the total is shared into equal parts. In the others the total is being found.',
          n: 'Is the total known? If it is known and it is being shared, that is a division.',
          r: 'Division is used when a total is shared into equal parts.',
        },
      }),

    /* 5 · match · 🟡 — masala va javob. */
    q('05', 'Masala va javob', '🟡', 'd15-match-answer', 'match', '📐', [0, 1, 2],
      {
        e: 'Uch masala', s: "Uchta masala. Har birida o'z amali.",
        a: 'Har masalani uning javobiga ulang.',
        left: ['48 o\'quvchi 6 jamoaga', '5 savat, har birida 9 ta', '96 bet 3 kunda'],
        right: ['8', '45', '32'],
        y: '48 : 6 = 8, 5 × 9 = 45, 96 : 3 = 32.',
        n: 'Har masalada aniqlang: jami topiladimi yoki taqsimlanadimi?',
        r: 'Jami topilsa — ko\'paytirish, taqsimlansa — bo\'lish.',
      },
      {
        e: 'Задача и ответ', s: 'Три задачи. В каждой своё действие.',
        a: 'Соедини каждую задачу с её ответом.',
        left: ['48 учеников на 6 команд', '5 корзин, в каждой по 9', '96 страниц за 3 дня'],
        right: ['8', '45', '32'],
        y: '48 : 6 = 8, 5 × 9 = 45, 96 : 3 = 32.',
        n: 'В каждой задаче определи: находят общее или раскладывают?',
        r: 'Находят общее — умножение, раскладывают — деление.',
      }, undefined, {
        en: {
          e: 'The problem and the answer', s: 'Three problems. Each one has its own operation.',
          a: 'Connect each problem with its answer.',
          left: ['48 pupils into 6 teams', '5 baskets with 9 in each', '96 pages over 3 days'],
          right: ['8', '45', '32'],
          y: '48 : 6 = 8, 5 × 9 = 45, 96 : 3 = 32.',
          n: 'In every problem work out whether the total is being found or shared out.',
          r: 'Finding a total is a multiplication, sharing it out is a division.',
        },
      }),

    /* 6 · dnd · 🟡 — bir yoki ikki qadam. */
    q('06', 'Necha qadam?', '🟡', 'd15-steps-sort', 'dnd', '👣', [0, 1, 0, 1],
      {
        e: 'Qadamlar soni', s: "To'rtta masala. Ba'zilari bir amalda, ba'zilari ikki amalda yechiladi.",
        a: 'Masalalarni ajrating: qaysilari bir amalda, qaysilari ikki amalda yechiladi.',
        tokens: ['7 quti, har birida 8 ta', '5 savat 9 tadan va yana 7 ta', '48 ni 6 jamoaga', '4 quti 6 tadan va 3 ta ortiqcha'],
        zones: ['Bir amal', 'Ikki amal'],
        dndHint: 'Masalalar tugadi.',
        y: "Ikkinchi va to'rtinchi masalada avval ko'paytirish, keyin qo'shish kerak.",
        n: 'Masalada bitta guruh borligi aytilganmi yoki guruhlardan tashqari yana nimadir bormi?',
        r: "Guruhlardan tashqari qo'shimcha son bo'lsa, masala ikki qadamli bo'ladi.",
      },
      {
        e: 'Сколько шагов?', s: 'Четыре задачи. Одни решаются одним действием, другие двумя.',
        a: 'Разложи задачи: какие решаются одним действием, а какие двумя.',
        tokens: ['7 коробок по 8', '5 корзин по 9 и ещё 7', '48 на 6 команд', '4 коробки по 6 и 3 сверху'],
        zones: ['Одно действие', 'Два действия'],
        dndHint: 'Задачи закончились.',
        y: 'Во второй и четвёртой задаче сначала умножение, потом сложение.',
        n: 'В задаче речь только о группах или кроме групп есть что-то ещё?',
        r: 'Если кроме групп есть добавочное число, задача решается в два шага.',
      }, undefined, {
        en: {
          e: 'How many steps?', s: 'Four problems. Some are solved in one operation, others in two.',
          a: 'Sort the problems: which ones are solved in one operation and which in two.',
          tokens: ['7 boxes of 8', '5 baskets of 9 and 7 more', '48 into 6 teams', '4 boxes of 6 and 3 on top'],
          zones: ['One operation', 'Two operations'],
          dndHint: 'No problems left.',
          y: 'In the second and the fourth problem there is a multiplication first and then an addition.',
          n: 'Is the problem only about groups, or is there something besides the groups?',
          r: 'If there is an extra number besides the groups, the problem is solved in two steps.',
        },
      }),

    /* 7 · multi · 🟡 — qaysi masalalar bir xil javob beradi. */
    q('07', 'Bir xil javob', '🟡', 'd15-same-answer', 'multi', '🎯', [0, 2],
      {
        e: 'Ikki masala, bir javob', s: "To'rtta masala. Ikkitasining javobi bir xil.",
        a: 'Qaysi masalalarning javobi 56 ga teng? Hammasini belgilang.',
        o: ['7 quti, har birida 8 ta', '8 quti, har birida 6 ta', '8 quti, har birida 7 ta', '56 ni 7 guruhga'],
        y: '7 × 8 = 56 va 8 × 7 = 56. 8 × 6 = 48, 56 : 7 = 8.',
        n: "Har masalani hisoblang. Ko'paytuvchilar o'rni almashsa, natija o'zgarmaydi.",
        r: "Bir xil ko'paytuvchilar tartibidan qat'i nazar bir xil javob beradi.",
      },
      {
        e: 'Две задачи, один ответ', s: 'Четыре задачи. У двух ответ одинаковый.',
        a: 'У каких задач ответ равен 56? Отметь все.',
        o: ['7 коробок по 8', '8 коробок по 6', '8 коробок по 7', '56 на 7 групп'],
        y: '7 × 8 = 56 и 8 × 7 = 56. А 8 × 6 = 48, 56 : 7 = 8.',
        n: 'Посчитай каждую задачу. От перестановки множителей результат не меняется.',
        r: 'Одни и те же множители дают один ответ независимо от порядка.',
      }, undefined, {
        en: {
          e: 'Two problems, one answer', s: 'Four problems. Two of them have the same answer.',
          a: 'Which problems have the answer 56? Mark them all.',
          o: ['7 boxes of 8', '8 boxes of 6', '8 boxes of 7', '56 into 7 groups'],
          y: '7 × 8 = 56 and 8 × 7 = 56. And 8 × 6 = 48, 56 : 7 = 8.',
          n: 'Work out every problem. Swapping the factors does not change the result.',
          r: 'The same factors give the same answer whatever their order.',
        },
      }),

    /* 8 · choice · 🔴 — nol holati. Eski 08, 4-chi variant qo'shildi. */
    q('08', 'Nol holati', '🔴', 'd15-zero-case', 'choice', '🕳️', 0,
      {
        e: 'Bo\'sh ombor', s: "5 ta rafga teng taqsimlash kerak, lekin birorta ham detal yo'q.",
        a: 'Har bir rafga nechta detal qo\'yiladi?',
        o: ['0', '5', 'Aniqlab bo\'lmaydi', '1'],
        y: "0 : 5 = 0. Hech narsa yo'q, demak har raf bo'sh qoladi.",
        n: "Taqsimlanadigan narsa yo'q. Unda har rafga nima tushadi?",
        by: [
          undefined,
          '5 — bu raflar soni, detallar emas. Detallar nechta edi?',
          "Bu holat aniq: taqsimlanadigan narsa yo'q, demak javob ham aniq.",
          "Bitta detal ham yo'q edi. Yo'q narsani rafga qo'yib bo'lmaydi.",
        ],
        r: "Nolni noldan farqli songa bo'lganda natija nol bo'ladi.",
      },
      {
        e: 'Пустой склад', s: 'Нужно разложить поровну на 5 полок, но деталей нет ни одной.',
        a: 'Сколько деталей попадёт на каждую полку?',
        o: ['0', '5', 'Определить нельзя', '1'],
        y: '0 : 5 = 0. Раскладывать нечего, значит каждая полка останется пустой.',
        n: 'Раскладывать нечего. Что тогда попадёт на каждую полку?',
        by: [
          undefined,
          '5 — это число полок, а не деталей. А деталей сколько было?',
          'Случай вполне определённый: раскладывать нечего, значит и ответ определён.',
          'Не было ни одной детали. Нельзя положить на полку то, чего нет.',
        ],
        r: 'При делении нуля на любое число, кроме нуля, получается ноль.',
      }, undefined, {
        en: {
          e: 'An empty store', s: 'The parts have to be shared evenly onto 5 shelves, but there is not a single part.',
          a: 'How many parts will land on each shelf?',
          o: ['0', '5', 'It cannot be worked out', '1'],
          y: '0 : 5 = 0. There is nothing to share out, so every shelf stays empty.',
          n: 'There is nothing to share out. What lands on each shelf then?',
          by: [
            undefined,
            '5 is the number of shelves, not of parts. And how many parts were there?',
            'The case is quite clear: there is nothing to share out, so the answer is clear too.',
            'There was not a single part. You cannot put on a shelf something that is not there.',
          ],
          r: 'Dividing zero by any number except zero gives zero.',
        },
      }),

    /* 9 · multi · 🔴 — xato yechimlar. Eski 09. */
    q('09', 'Xato yechimlar', '🔴', 'd15-wrong-solutions', 'multi', '🔎', [1, 3],
      {
        e: 'Xatoni toping', s: "4 ta qutining har birida 6 tadan detal bor. To'rtta yechim taklif qilindi.",
        a: 'Qaysi yechimlar XATO? Hammasini belgilang.',
        o: ['4 × 6 = 24', '4 + 6 = 10', '6 × 4 = 24', '6 − 4 = 2'],
        y: "4 + 6 va 6 − 4 xato: bu yerda 6 talik guruh TO'RT MARTA takrorlanadi, demak ko'paytirish kerak.",
        n: 'Guruhlar teng va ular takrorlanadi. Takrorlanish qaysi amal bilan yoziladi?',
        r: "Teng guruhlar takrorlansa, ko'paytirish ishlatiladi: 4 × 6 = 24.",
      },
      {
        e: 'Найди ошибки', s: 'В каждой из 4 коробок по 6 деталей. Предложили четыре решения.',
        a: 'Какие решения НЕВЕРНЫ? Отметь все.',
        o: ['4 × 6 = 24', '4 + 6 = 10', '6 × 4 = 24', '6 − 4 = 2'],
        y: '4 + 6 и 6 − 4 неверны: здесь группа из 6 повторяется ЧЕТЫРЕ РАЗА, значит нужно умножение.',
        n: 'Группы равные и они повторяются. Каким действием записывают повторение?',
        r: 'Когда равные группы повторяются, используют умножение: 4 × 6 = 24.',
      }, undefined, {
        en: {
          e: 'Find the mistakes', s: 'Each of the 4 boxes holds 6 parts. Four solutions were suggested.',
          a: 'Which solutions are WRONG? Mark them all.',
          o: ['4 × 6 = 24', '4 + 6 = 10', '6 × 4 = 24', '6 − 4 = 2'],
          y: '4 + 6 and 6 − 4 are wrong: here a group of 6 repeats FOUR TIMES, so a multiplication is needed.',
          n: 'The groups are equal and they repeat. Which operation writes down a repetition?',
          r: 'When equal groups repeat, a multiplication is used: 4 × 6 = 24.',
        },
      }),

    /* 10 · order · 🔴 — masala qadamlari. Eski 04. */
    q('10', 'Masala qadamlari', '🔴', 'd15-solve-order', 'order', '🚀', [2, 0, 3, 1],
      {
        e: 'Yakuniy mashq', s: "Masalani yechishda to'rtta qadam bajariladi, lekin ular aralashib ketgan.",
        a: 'Qadamlarni boshidan oxirigacha tartiblang.',
        o: ['Nima so\'ralganini aniqlash', 'Birlik bilan javob yozish', 'Ma\'lum sonlarni topish', 'Amalni tanlash va hisoblash'],
        y: "Ma'lum sonlar, keyin savol, keyin amal va hisob, oxirida birlik bilan javob.",
        n: 'Amalni tanlashdan oldin nimani bilish kerak? Javob yozishdan oldin-chi?',
        r: "Amal bitta kalit so'zga emas, sonlar orasidagi bog'lanishga qarab tanlanadi.",
      },
      {
        e: 'Итоговое задание', s: 'При решении задачи выполняют четыре шага, но они перепутались.',
        a: 'Расставь шаги от начала до конца.',
        o: ['Понять, что спрашивают', 'Записать ответ с единицей', 'Найти известные числа', 'Выбрать действие и посчитать'],
        y: 'Известные числа, потом вопрос, потом действие и счёт, в конце ответ с единицей.',
        n: 'Что нужно знать до выбора действия? А до записи ответа?',
        r: 'Действие выбирают не по ключевому слову, а по связи между числами.',
      }, undefined, {
        en: {
          e: 'Final task', s: 'Solving a problem takes four steps, but they got mixed up.',
          a: 'Put the steps in order from the start to the end.',
          o: ['Work out what is being asked', 'Write the answer with its unit', 'Find the known numbers', 'Pick the operation and work it out'],
          y: 'The known numbers, then the question, then the operation and the counting, and the answer with its unit at the end.',
          n: 'What do you need to know before picking the operation? And before writing the answer?',
          r: 'The operation is chosen by the link between the numbers, not by a key word.',
        },
      }),
  ],
};

export default DARS15_BANK;
