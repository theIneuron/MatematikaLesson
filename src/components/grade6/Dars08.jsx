import FractionTheoryLesson from './FractionTheoryLesson.jsx';

const L = (uz, ru) => ({ uz, ru });

const LESSON = {
  id: 'frac_6_08',
  title: L('Kasrlarni qisqartirish', 'Сокращение дробей'),
  scoredScreens: [5, 7, 8, 10, 11, 12, 13],
  decorations: ['6/8', '3/4', '10/15', '2/3', '18/24', '5/7'],
  slides: [
    {
      type: 'title',
      eyebrow: L('Yangi mavzu', 'Новая тема'),
      title: L('Kasrlarni qisqartirish', 'Сокращение дробей'),
      subtitle: L(
        "Bugun kasrning qiymatini saqlagan holda uni sodda ko'rinishga keltirishni o'rganamiz.",
        'Сегодня научимся приводить дробь к более простому виду, сохраняя её значение.',
      ),
      audio: L(
        "Bugungi mavzu kasrlarni qisqartirish. Kasrning surat va maxrajini bir xil umumiy bo'luvchiga bo'lib, uning qiymatini o'zgartirmaymiz. Masalan, sakkizdan olti kasri to'rtdan uchga teng. Darsda bu natija qanday hosil bo'lishini bosqichma-bosqich o'rganamiz.",
        'Тема урока — сокращение дробей. Мы будем делить числитель и знаменатель на один общий делитель, не меняя значения дроби. Например, шесть восьмых равны трём четвёртым. На уроке разберём это по шагам.',
      ),
      visual: { type: 'equation', expression: '6/8 = 3/4' },
    },
    {
      type: 'question',
      scored: false,
      eyebrow: L('Eslab olamiz', 'Вспомним'),
      title: L("12 va 18 ning umumiy bo'luvchisini toping", 'Найдите общий делитель 12 и 18'),
      prompt: L("12 ham, 18 ham qaysi songa qoldiqsiz bo'linadi?", 'Какое число делит без остатка и 12, и 18?'),
      intro: L(
        "Kasrni qisqartirish uchun surat va maxrajning umumiy bo'luvchisi kerak bo'ladi. O'n ikki ham, o'n sakkiz ham qoldiqsiz bo'linadigan sonni tanlang.",
        'Для сокращения дроби нужен общий делитель числителя и знаменателя. Выберите число, на которое делятся и двенадцать, и восемнадцать.',
      ),
      options: ['4', '5', '6', '8'],
      correct: 2,
      why: [
        L("12 : 6 = 2 va 18 : 6 = 3.", '12 разделить на 6 равно 2, а 18 разделить на 6 равно 3.'),
        L("Demak, 6 soni 12 va 18 ning umumiy bo'luvchisi.", 'Значит, 6 — общий делитель чисел 12 и 18.'),
      ],
      wrong: L("12 ham, 18 ham tanlangan songa qoldiqsiz bo'linishi kerak.", 'Выбранное число должно делить оба числа без остатка.'),
      visual: {
        type: 'panels',
        panels: [
          { title: L("12 ning bo'luvchilari", 'Делители 12'), lines: ['1, 2, 3, 4, 6, 12'] },
          { title: L("18 ning bo'luvchilari", 'Делители 18'), lines: ['1, 2, 3, 6, 9, 18'] },
        ],
      },
    },
    {
      type: 'info',
      eyebrow: L('Tushuncha', 'Понятие'),
      title: L("Kasrni qisqartirish nima?", 'Что такое сокращение дроби?'),
      steps: [
        L("Kasrning surat va maxrajini bir xil umumiy bo'luvchiga bo'lamiz.", 'Числитель и знаменатель дроби делим на один общий делитель.'),
        L("Yangi kasrning sonlari kichrayadi, lekin kasrning qiymati o'zgarmaydi.", 'Числа в новой дроби уменьшаются, но значение дроби не меняется.'),
        L("Masalan, 12/18 kasrini 6 ga qisqartirsak 2/3 hosil bo'ladi.", 'Например, если сократить 12/18 на 6, получится 2/3.'),
      ],
      audio: {
        uz: [
          "Qarang, kasrni qisqartirish nima ekan. Kasrning surati va maxrajini bitta umumiy bo'luvchiga bo'lamiz.",
          "Yangi kasrdagi sonlar kichrayadi, lekin kasrning qiymati o'zgarmaydi.",
          "Masalan, o'n sakkizdan o'n ikki kasrini olaylik. Surat va maxrajni oltiga bo'lsak, uchdan ikki hosil bo'ladi.",
        ],
        ru: [
          'Посмотрите, что значит сократить дробь. Числитель и знаменатель делим на один и тот же общий делитель.',
          'Числа в новой дроби становятся меньше, но само значение дроби не меняется.',
          'Например, возьмём дробь двенадцать восемнадцатых и разделим числитель и знаменатель на шесть. Получится две трети.',
        ],
      },
      visual: { type: 'chain', items: ['12/18', '2/3'] },
    },
    {
      type: 'rule',
      eyebrow: L('Asosiy qoida', 'Главное правило'),
      title: L("Surat va maxrajni bir xil songa bo'ling", 'Делите числитель и знаменатель на одно число'),
      steps: [
        L("Avval surat va maxrajning 1 dan katta umumiy bo'luvchisini topamiz.", 'Сначала находим общий делитель числителя и знаменателя, больший единицы.'),
        L("Suratni ham, maxrajni ham aynan shu songa bo'lamiz.", 'И числитель, и знаменатель делим именно на это число.'),
        L("Faqat bittasini bo'lish mumkin emas: bunday holda kasrning qiymati o'zgaradi.", 'Нельзя делить только одно из чисел: тогда значение дроби изменится.'),
      ],
      audio: {
        uz: [
          "Avval surat va maxrajning birdan katta umumiy bo'luvchisini toping.",
          "Endi suratni ham, maxrajni ham aynan shu bitta songa bo'ling.",
          "E'tibor bering, faqat bittasini bo'lish mumkin emas. Unda kasrning qiymati o'zgarib ketadi.",
        ],
        ru: [
          'Сначала найдите общий делитель числителя и знаменателя, который больше единицы.',
          'Теперь разделите на это число и числитель, и знаменатель, обязательно на одно и то же.',
          'Обратите внимание, делить только одно из чисел нельзя. Тогда значение дроби изменится.',
        ],
      },
      visual: {
        type: 'steps',
        items: [
          L("Umumiy bo'luvchi: 2", 'Общий делитель: 2'),
          L('6 : 2 = 3', '6 : 2 = 3'),
          L('8 : 2 = 4, demak 6/8 = 3/4', '8 : 2 = 4, значит 6/8 = 3/4'),
        ],
      },
    },
    {
      type: 'info',
      eyebrow: L('Bosqichma-bosqich', 'Шаг за шагом'),
      title: L("Bir necha marta qisqartirish mumkin", 'Дробь можно сокращать несколько раз'),
      steps: [
        L("18/24 kasrining surat va maxrajini avval 2 ga bo'lamiz: 9/12.", 'Сначала делим числитель и знаменатель 18/24 на 2: получаем 9/12.'),
        L("9 va 12 ning umumiy bo'luvchisi 3, shuning uchun yana qisqartiramiz.", 'У 9 и 12 есть общий делитель 3, поэтому сокращаем ещё раз.'),
        L("9/12 ni 3 ga qisqartirsak 3/4 chiqadi.", 'Если сократить 9/12 на 3, получится 3/4.'),
      ],
      audio: {
        uz: [
          "Qarang, yigirma to'rtdan o'n sakkiz kasrini avval ikkiga bo'lamiz. O'n ikkidan to'qqiz hosil bo'ladi.",
          "To'qqiz va o'n ikkining umumiy bo'luvchisi uch, shuning uchun yana qisqartiramiz.",
          "O'n ikkidan to'qqiz kasrini uchga qisqartirsak, to'rtdan uch chiqadi.",
        ],
        ru: [
          'Смотрите, дробь восемнадцать двадцать четвёртых сначала делим на два. Получаем девять двенадцатых.',
          'У чисел девять и двенадцать есть общий делитель три, поэтому сокращаем ещё раз.',
          'Сократите девять двенадцатых на три, и получится три четверти.',
        ],
      },
      visual: { type: 'chain', items: ['18/24', '9/12', '3/4'] },
    },
    {
      type: 'question',
      scored: true,
      eyebrow: L('Mashq', 'Практика'),
      title: L("15/20 kasrini 5 ga qisqartiring", 'Сократите 15/20 на 5'),
      prompt: L("Surat va maxrajni 5 ga bo'lganda qaysi kasr hosil bo'ladi?", 'Какая дробь получится после деления числителя и знаменателя на 5?'),
      intro: L(
        "Yigirmadan o'n besh kasrining suratini ham, maxrajini ham beshga bo'ling. To'g'ri natijani tanlang.",
        'Разделите на пять и числитель, и знаменатель дроби пятнадцать двадцатых. Выберите верный результат.',
      ),
      options: ['3/4', '10/15', '3/20', '15/4'],
      correct: 0,
      why: [
        L("15 : 5 = 3.", '15 разделить на 5 равно 3.'),
        L("20 : 5 = 4. Shuning uchun 15/20 = 3/4.", '20 разделить на 5 равно 4. Поэтому 15/20 = 3/4.'),
      ],
      wrong: L("Surat va maxrajni aynan bir xil 5 soniga bo'ling.", 'Разделите и числитель, и знаменатель на одно и то же число 5.'),
      fact: L("Kasrni qisqartirish hisoblashlarni yengillashtiradi.", 'Сокращение дробей упрощает вычисления.'),
      factVisual: '15/20 = 3/4',
      visual: { type: 'equation', expression: '15/20 → ?' },
    },
    {
      type: 'info',
      eyebrow: L('Muhim tushuncha', 'Важное понятие'),
      title: L("Qisqarmas kasr", 'Несократимая дробь'),
      steps: [
        L("Agar surat va maxrajning 1 dan boshqa umumiy bo'luvchisi bo'lmasa, kasr qisqarmas kasr deyiladi.", 'Если у числителя и знаменателя нет общего делителя, кроме 1, дробь называют несократимой.'),
        L("Masalan, 5 va 8 o'zaro tub: ularning yagona umumiy bo'luvchisi 1.", 'Например, 5 и 8 взаимно простые: их единственный общий делитель — 1.'),
        L("Shuning uchun 5/8 kasrini boshqa qisqartirib bo'lmaydi.", 'Поэтому дробь 5/8 больше сократить нельзя.'),
      ],
      audio: {
        uz: [
          "Eslab qoling, agar surat va maxrajning birdan boshqa umumiy bo'luvchisi bo'lmasa, bunday kasr qisqarmas kasr deyiladi.",
          "Masalan, besh va sakkiz o'zaro tub sonlar. Ularning yagona umumiy bo'luvchisi bir.",
          "Shuning uchun sakkizdan besh kasrini boshqa qisqartirib bo'lmaydi.",
        ],
        ru: [
          'Запомните, если у числителя и знаменателя нет общего делителя, кроме единицы, такую дробь называют несократимой.',
          'Например, числа пять и восемь взаимно простые, их единственный общий делитель равен единице.',
          'Поэтому дробь пять восьмых дальше сократить уже нельзя.',
        ],
      },
      visual: {
        type: 'panels',
        panels: [
          { title: L("5 ning bo'luvchilari", 'Делители 5'), lines: ['1, 5'] },
          { title: L("8 ning bo'luvchilari", 'Делители 8'), lines: ['1, 2, 4, 8'] },
        ],
      },
    },
    {
      type: 'question',
      scored: true,
      eyebrow: L('Mashq', 'Практика'),
      title: L("14/21 kasrini qisqartiring", 'Сократите дробь 14/21'),
      prompt: L("14 va 21 ning eng katta umumiy bo'luvchisi 7. Natijani toping.", 'Наибольший общий делитель 14 и 21 равен 7. Найдите результат.'),
      intro: L(
        "Yigirma birdan o'n to'rt kasrini yettiga qisqartiring. Suratni va maxrajni alohida hisoblang.",
        'Сократите дробь четырнадцать двадцать первых на семь. Отдельно вычислите новый числитель и знаменатель.',
      ),
      options: ['7/14', '2/3', '2/7', '14/3'],
      correct: 1,
      why: [
        L("14 : 7 = 2 va 21 : 7 = 3.", '14 разделить на 7 равно 2, а 21 разделить на 7 равно 3.'),
        L("2 va 3 o'zaro tub, demak 2/3 qisqarmas kasr.", '2 и 3 взаимно простые, значит 2/3 — несократимая дробь.'),
      ],
      wrong: L("Ikkala sonni ham 7 ga bo'ling va natijani kasr shaklida yozing.", 'Разделите оба числа на 7 и запишите результат в виде дроби.'),
      visual: { type: 'chain', items: ['14/21', '2/3'] },
    },
    {
      type: 'question',
      scored: true,
      eyebrow: L('Tekshiramiz', 'Проверим'),
      title: L("Qaysi kasr qisqarmas?", 'Какая дробь несократима?'),
      prompt: L("Surat va maxrajining 1 dan katta umumiy bo'luvchisi bo'lmagan kasrni tanlang.", 'Выберите дробь, у числителя и знаменателя которой нет общего делителя больше 1.'),
      intro: L(
        "Har bir kasrning surat va maxrajini tekshiring. Faqat bir umumiy bo'luvchiga, ya'ni birga ega bo'lgan juftlikni toping.",
        'Проверьте числитель и знаменатель каждой дроби. Найдите пару, у которой единственный общий делитель — единица.',
      ),
      options: ['6/9', '10/15', '5/8', '14/21'],
      correct: 2,
      why: [
        L("5 va 8 ning 1 dan katta umumiy bo'luvchisi yo'q.", 'У 5 и 8 нет общего делителя больше 1.'),
        L("Qolgan kasrlarning surat va maxraji 3, 5 yoki 7 ga bo'linadi.", 'Числители и знаменатели остальных дробей делятся на 3, 5 или 7.'),
      ],
      wrong: L("Har bir juftlik uchun 2, 3, 5 va 7 ga bo'linishni tekshiring.", 'Для каждой пары проверьте делимость на 2, 3, 5 и 7.'),
      visual: { type: 'cards', items: ['6/9', '10/15', '5/8', '14/21'], highlight: 2 },
    },
    {
      type: 'info',
      eyebrow: L('Tezkor usul', 'Быстрый способ'),
      title: L("EKUB orqali bir qadamda qisqartirish", 'Сокращение за один шаг с помощью НОД'),
      steps: [
        L("36 va 48 ning eng katta umumiy bo'luvchisi 12.", 'Наибольший общий делитель 36 и 48 равен 12.'),
        L("Surat va maxrajni 12 ga bo'lsak: 36 : 12 = 3 va 48 : 12 = 4.", 'Делим числитель и знаменатель на 12: 36 : 12 = 3 и 48 : 12 = 4.'),
        L("Demak, 36/48 = 3/4. EKUB bilan kasr darhol qisqarmas ko'rinishga keladi.", 'Значит, 36/48 = 3/4. С помощью НОД дробь сразу становится несократимой.'),
      ],
      audio: {
        uz: [
          "Endi tezkor usulni ko'ring. O'ttiz olti va qirq sakkizning eng katta umumiy bo'luvchisi o'n ikki.",
          "Surat va maxrajni o'n ikkiga bo'ling. O'ttiz oltini o'n ikkiga bo'lsak uch, qirq sakkizni o'n ikkiga bo'lsak to'rt chiqadi.",
          "Demak, qirq sakkizdan o'ttiz olti kasri to'rtdan uchga teng. EKUB yordamida kasr darhol qisqarmas ko'rinishga keladi.",
        ],
        ru: [
          'Теперь посмотрите на быстрый способ. Наибольший общий делитель чисел тридцать шесть и сорок восемь равен двенадцати.',
          'Разделите числитель и знаменатель на двенадцать. Тридцать шесть разделить на двенадцать будет три, а сорок восемь разделить на двенадцать будет четыре.',
          'Значит, дробь тридцать шесть сорок восьмых равна трём четвертям. С помощью НОД дробь сразу становится несократимой.',
        ],
      },
      visual: { type: 'chain', items: ['36/48', '3/4'], connector: L(': 12 →', ': 12 →') },
    },
    {
      type: 'multi',
      scored: true,
      eyebrow: L('Bir nechta javob', 'Несколько ответов'),
      title: L("Qisqartirish mumkin bo'lgan kasrlarni toping", 'Найдите сократимые дроби'),
      intro: L(
        "Surat va maxrajida bir xil umumiy bo'luvchi bor kasrlarning barchasini belgilang.",
        'Отметьте все дроби, у числителя и знаменателя которых есть общий делитель больше единицы.',
      ),
      options: ['8/12', '7/15', '14/35', '11/18'],
      correctSet: [0, 2],
      why: [
        L("8/12 kasri 4 ga, 14/35 kasri 7 ga qisqaradi.", 'Дробь 8/12 сокращается на 4, а 14/35 — на 7.'),
        L("7/15 va 11/18 kasrlarining surat va maxraji o'zaro tub.", 'В дробях 7/15 и 11/18 числитель и знаменатель взаимно простые.'),
      ],
      wrong: L("Har bir kasrda surat va maxraj uchun umumiy bo'luvchi izlang.", 'Для каждой дроби найдите общий делитель числителя и знаменателя.'),
    },
    {
      type: 'match',
      scored: true,
      eyebrow: L('Moslashtirish', 'Соответствие'),
      title: L("Kasrlarni qisqarmas ko'rinishlari bilan juftlang", 'Соедините дробь с её несократимым видом'),
      prompt: L("Chapdagi har bir kasr uchun o'ng tomondagi to'liq qisqartirilgan kasrni tanlang.", 'Для каждой дроби слева выберите полностью сокращённую дробь справа.'),
      intro: L(
        "Har bir kasrni eng katta umumiy bo'luvchiga qisqartiring va mos natija bilan juftlang.",
        'Сократите каждую дробь на наибольший общий делитель и соедините с подходящим результатом.',
      ),
      rows: [
        { left: '8/12', correct: L('2/3', '2/3') },
        { left: '15/25', correct: L('3/5', '3/5') },
        { left: '21/28', correct: L('3/4', '3/4') },
      ],
      why: [
        L("8/12 ni 4 ga, 15/25 ni 5 ga, 21/28 ni 7 ga qisqartiramiz.", '8/12 сокращаем на 4, 15/25 — на 5, 21/28 — на 7.'),
        L("Natijalar mos ravishda 2/3, 3/5 va 3/4.", 'Получаем соответственно 2/3, 3/5 и 3/4.'),
      ],
      wrong: L("Avval har bir juft sonning EKUBini toping.", 'Сначала найдите НОД числителя и знаменателя каждой дроби.'),
    },
    {
      type: 'classify',
      scored: true,
      eyebrow: L('Tasniflash', 'Классификация'),
      title: L("Kasrlarni ikki guruhga ajrating", 'Разделите дроби на две группы'),
      prompt: L("Har bir kartani qisqaradigan yoki qisqarmas guruhiga joylang.", 'Поместите каждую карточку в группу сократимых или несократимых дробей.'),
      intro: L(
        "Kasr bittalab chiqadi. Surat va maxrajning umumiy bo'luvchisini tekshirib, kerakli guruhni tanlang.",
        'Дроби появляются по одной. Проверьте общий делитель числителя и знаменателя и выберите нужную группу.',
      ),
      binA: L('Qisqaradi', 'Сократимая'),
      binB: L('Qisqarmas', 'Несократимая'),
      cards: [
        { label: '9/12', value: true },
        { label: '5/14', value: false },
        { label: '16/24', value: true },
        { label: '7/20', value: false },
      ],
      why: [
        L("9/12 va 16/24 kasrlarida umumiy bo'luvchi bor.", 'У дробей 9/12 и 16/24 есть общий делитель.'),
        L("5/14 va 7/20 kasrlarining surat va maxraji o'zaro tub.", 'В дробях 5/14 и 7/20 числитель и знаменатель взаимно простые.'),
      ],
      wrong: L("1 dan katta umumiy bo'luvchi bo'lsa, kasr qisqaradi.", 'Если есть общий делитель больше 1, дробь сокращается.'),
    },
    {
      type: 'question',
      scored: true,
      eyebrow: L('Yakuniy masala', 'Итоговая задача'),
      title: L("84/126 kasrini to'liq qisqartiring", 'Полностью сократите дробь 84/126'),
      prompt: L("84 va 126 ning EKUBi 42. Qisqarmas natijani toping.", 'НОД чисел 84 и 126 равен 42. Найдите несократимый результат.'),
      intro: L(
        "Bir yuz yigirma oltidan sakson to'rt kasrini bir qadamda qisqartiramiz. Surat va maxrajni qirq ikkiga bo'ling.",
        'Сократим дробь восемьдесят четыре сто двадцать шестых за один шаг. Разделите числитель и знаменатель на сорок два.',
      ),
      options: ['4/6', '2/3', '42/63', '3/2'],
      correct: 1,
      why: [
        L("84 : 42 = 2 va 126 : 42 = 3.", '84 разделить на 42 равно 2, а 126 разделить на 42 равно 3.'),
        L("2 va 3 o'zaro tub. Shuning uchun 84/126 = 2/3.", '2 и 3 взаимно простые. Поэтому 84/126 = 2/3.'),
      ],
      wrong: L("EKUB berilgan: surat va maxrajning ikkalasini ham 42 ga bo'ling.", 'НОД уже дан: разделите и числитель, и знаменатель на 42.'),
      fact: L("EKUBga bo'lish kasrni bir qadamda qisqarmas ko'rinishga keltiradi.", 'Деление на НОД приводит дробь к несократимому виду за один шаг.'),
      factVisual: '84/126 = 2/3',
      visual: { type: 'chain', items: ['84/126', '2/3'], connector: L(': 42 →', ': 42 →') },
    },
    {
      type: 'summary',
      eyebrow: L('Dars yakuni', 'Итог урока'),
      title: L("Kasrlarni qisqartirishni o'rgandingiz", 'Вы научились сокращать дроби'),
      points: [
        L("Surat va maxraj bir xil umumiy bo'luvchiga bo'linadi.", 'Числитель и знаменатель делятся на один общий делитель.'),
        L("Kasrning qiymati o'zgarmaydi, yozuvi soddalashadi.", 'Значение дроби не меняется, а запись упрощается.'),
        L("EKUBga bo'lish kasrni bir qadamda qisqarmas ko'rinishga keltiradi.", 'Деление на НОД даёт несократимый вид за один шаг.'),
      ],
      close: L(
        "Endi kasrning qisqarishini aniqlash va uni eng sodda ko'rinishga keltirishni bilasiz.",
        'Теперь вы умеете определять, сокращается ли дробь, и приводить её к самому простому виду.',
      ),
      audio: L(
        "Dars yakunlandi. Kasrni qisqartirish uchun surat va maxrajni bir xil umumiy bo'luvchiga bo'lamiz. Eng katta umumiy bo'luvchidan foydalansak, kasr bir qadamda qisqarmas ko'rinishga keladi.",
        'Урок завершён. Чтобы сократить дробь, делим числитель и знаменатель на один общий делитель. Если использовать наибольший общий делитель, сразу получим несократимую дробь.',
      ),
    },
  ],
};

export default function Dars08(props) {
  return <FractionTheoryLesson lesson={LESSON} {...props}/>;
}
