import FractionTheoryLesson from './FractionTheoryLesson.jsx';

const L = (uz, ru) => ({ uz, ru });

const LESSON = {
  id: 'frac_6_12',
  title: L("Oddiy kasrlarni bo'lish", 'Деление обыкновенных дробей'),
  scoredScreens: [5, 7, 8, 10, 11, 12, 13],
  decorations: ['3/4', '1/4', '2/3', '5/6', '4/5', '8/9'],
  slides: [
    {
      type: 'title',
      eyebrow: L('Yangi mavzu', 'Новая тема'),
      title: L("Oddiy kasrlarni bo'lish", 'Деление обыкновенных дробей'),
      subtitle: L(
        "Bugun kasrga bo'lishni uning teskarisiga ko'paytirish orqali bajarishni o'rganamiz.",
        'Сегодня научимся делить на дробь, заменяя деление умножением на обратную дробь.',
      ),
      audio: L(
        "Bugungi mavzu oddiy kasrlarni bo'lish. Bugun kasrga bo'lishni uning teskarisiga ko'paytirish orqali bajarishni o'rganamiz.",
        'Тема урока — деление обыкновенных дробей. Сегодня научимся выполнять деление на дробь с помощью умножения на обратную дробь.',
      ),
      visual: { type: 'equation', expression: '2/3 : 4/5 = 2/3 × 5/4' },
    },
    {
      type: 'question',
      scored: false,
      eyebrow: L('Ma’nosini anglaymiz', 'Понимаем смысл'),
      title: L("3/4 ichida nechta 1/4 bor?", 'Сколько раз 1/4 содержится в 3/4?'),
      prompt: L("3/4 : 1/4 natijasini toping.", 'Найдите результат 3/4 : 1/4.'),
      intro: L(
        "To'rtdan uch miqdor uchta to'rtdan bir bo'lakdan tuzilgan. Unda nechta shunday bo'lak borligini tanlang.",
        'Три четвёртых состоят из трёх частей по одной четвёртой. Выберите, сколько таких частей содержится в величине.',
      ),
      options: ['1', '2', '3', '4'],
      correct: 2,
      why: [
        L("3/4 miqdorda uchta 1/4 bo'lak bor.", 'В величине 3/4 содержатся три части по 1/4.'),
        L("Shuning uchun 3/4 : 1/4 = 3.", 'Поэтому 3/4 : 1/4 = 3.'),
      ],
      wrong: L("To'rtdan uch kasrini uchta teng to'rtdan bir bo'lak sifatida tasavvur qiling.", 'Представьте три четвёртых как три одинаковые части по одной четвёртой.'),
      visual: {
        type: 'bars',
        groups: [
          { numerator: 3, denominator: 4, label: L('3/4', '3/4') },
          { numerator: 1, denominator: 4, color: 'blue', label: L('1/4', '1/4') },
        ],
      },
    },
    {
      type: 'info',
      eyebrow: L('Asosiy g‘oya', 'Основная идея'),
      title: L("Kasrga bo'lish — teskari kasrga ko'paytirish", 'Деление на дробь — умножение на обратную'),
      steps: [
        L("Bo'luvchi kasrning surati va maxraji o'rin almashsa, uning teskari kasri hosil bo'ladi.", 'Если поменять местами числитель и знаменатель делителя, получится обратная дробь.'),
        L("Masalan, 4/5 ning teskari kasri 5/4.", 'Например, дробь, обратная 4/5, равна 5/4.'),
        L("2/3 : 4/5 ifodasini 2/3 × 5/4 ko'rinishiga almashtiramiz.", 'Выражение 2/3 : 4/5 заменяем выражением 2/3 × 5/4.'),
      ],
      audio: {
        uz: [
          "Qarang, bo'luvchi kasrning surati bilan maxraji o'rin almashsa, uning teskari kasri hosil bo'ladi.",
          "Masalan, beshdan to'rt kasrini olaylik. Uning teskarisi to'rtdan besh bo'ladi.",
          "Endi uchdan ikkini beshdan to'rtga bo'lishni ko'paytirishga almashtiramiz. Uchdan ikkini to'rtdan beshga ko'paytiramiz.",
        ],
        ru: [
          'Смотрите, если поменять местами числитель и знаменатель делителя, получится обратная дробь.',
          'Например, возьмём дробь четыре пятых. Обратная ей дробь равна пяти четвёртым.',
          'Теперь выражение две третьих разделить на четыре пятых заменим умножением. Две третьих умножить на пять четвёртых.',
        ],
      },
      visual: { type: 'chain', items: ['2/3 : 4/5', '2/3 × 5/4', '5/6'] },
    },
    {
      type: 'rule',
      eyebrow: L('Algoritm', 'Алгоритм'),
      title: L("Kasrlarni uch qadamda bo'lamiz", 'Делим дроби за три шага'),
      steps: [
        L("Birinchi kasrni o'zgarishsiz qoldiramiz.", 'Первую дробь оставляем без изменения.'),
        L("Bo'lish ishorasini ko'paytirish ishorasiga almashtirib, ikkinchi kasrni teskarisiga aylantiramiz.", 'Заменяем знак деления знаком умножения и переворачиваем вторую дробь.'),
        L("Hosil bo'lgan kasrlarni ko'paytirib, natijani qisqartiramiz.", 'Перемножаем полученные дроби и сокращаем результат.'),
      ],
      audio: {
        uz: [
          "Birinchi qadam. Birinchi kasrni o'zgarishsiz qoldiring.",
          "Ikkinchi qadam. Bo'lish ishorasini ko'paytirishga almashtiring va ikkinchi kasrni teskarilang.",
          "Uchinchi qadam. Kasrlarni ko'paytiring va natijani qisqartiring.",
        ],
        ru: [
          'Первый шаг. Оставьте первую дробь без изменения.',
          'Второй шаг. Замените знак деления знаком умножения и переверните вторую дробь.',
          'Третий шаг. Перемножьте дроби и сократите результат.',
        ],
      },
      visual: {
        type: 'steps',
        items: [
          L('Birinchi kasrni saqlang', 'Сохраните первую дробь'),
          L('Ikkinchi kasrni teskarilang', 'Переверните вторую дробь'),
          L('Ko‘paytiring va qisqartiring', 'Умножьте и сократите'),
        ],
      },
    },
    {
      type: 'info',
      eyebrow: L('Namuna', 'Пример'),
      title: L("2/3 : 4/5 ni hisoblaymiz", 'Вычислим 2/3 : 4/5'),
      steps: [
        L("Birinchi kasr 2/3 o'zgarishsiz qoladi.", 'Первая дробь 2/3 остаётся без изменения.'),
        L("4/5 ning teskari kasri 5/4, demak 2/3 × 5/4 ni olamiz.", 'Обратная дробь для 4/5 равна 5/4, значит получаем 2/3 × 5/4.'),
        L("2 bilan 4 ni qisqartirib, 1/3 × 5/2 = 5/6 ni topamiz.", 'Сокращаем 2 и 4 и получаем 1/3 × 5/2 = 5/6.'),
      ],
      audio: {
        uz: [
          "Qarang, birinchi kasr uchdan ikki o'z holicha qoladi.",
          "Beshdan to'rtning teskarisi to'rtdan besh. Demak, uchdan ikkini to'rtdan beshga ko'paytiramiz.",
          "Ikki bilan to'rtni qisqartiramiz. Uchdan birni ikkidan beshga ko'paytirsak, oltidan besh hosil bo'ladi.",
        ],
        ru: [
          'Смотрите, первая дробь две третьих остаётся без изменения.',
          'Дробь, обратная четырём пятым, равна пяти четвёртым. Значит, умножаем две третьих на пять четвёртых.',
          'Сократите двойку и четвёрку. Останется одна третья умножить на пять вторых, и получится пять шестых.',
        ],
      },
      visual: { type: 'chain', items: ['2/3 : 4/5', '2/3 × 5/4', '5/6'] },
    },
    {
      type: 'question',
      scored: true,
      eyebrow: L('Mashq', 'Практика'),
      title: L("3/4 : 2/5 ni hisoblang", 'Вычислите 3/4 : 2/5'),
      prompt: L("Ikkinchi kasrni teskarilang va ko'paytiring.", 'Переверните вторую дробь и выполните умножение.'),
      intro: L(
        "To'rtdan uchni beshdan ikkiga bo'lish uchun beshdan ikkini ikkidan beshga aylantiring. So'ng to'rtdan uch bilan ikkidan beshni ko'paytiring.",
        'Чтобы разделить три четвёртых на две пятых, замените две пятых на пять вторых. Затем умножьте три четвёртых на пять вторых.',
      ),
      options: ['6/20', '15/8', '8/15', '5/6'],
      correct: 1,
      why: [
        L("3/4 : 2/5 = 3/4 × 5/2.", '3/4 : 2/5 = 3/4 × 5/2.'),
        L("3 × 5 = 15 va 4 × 2 = 8, demak natija 15/8.", '3 × 5 = 15, а 4 × 2 = 8, значит результат равен 15/8.'),
      ],
      wrong: L("Faqat ikkinchi kasrni teskarilang: 2/5 o'rniga 5/2 yozing.", 'Переверните только вторую дробь: вместо 2/5 запишите 5/2.'),
      fact: L("Kasrga bo'lishda faqat bo'luvchi, ya'ni ikkinchi kasr teskarilanadi.", 'При делении дробей переворачивают только делитель, то есть вторую дробь.'),
      factVisual: '3/4 : 2/5 = 15/8',
      visual: { type: 'chain', items: ['3/4 : 2/5', '3/4 × 5/2', '?'] },
    },
    {
      type: 'info',
      eyebrow: L('Butun songa bo‘lish', 'Деление на целое число'),
      title: L("Kasrni butun songa bo'lish", 'Деление дроби на целое число'),
      steps: [
        L("Butun 3 sonini 3/1 kasri ko'rinishida yozamiz.", 'Записываем целое число 3 в виде дроби 3/1.'),
        L("3/1 ning teskari kasri 1/3.", 'Дробь, обратная 3/1, равна 1/3.'),
        L("5/6 : 3 = 5/6 × 1/3 = 5/18.", '5/6 : 3 = 5/6 × 1/3 = 5/18.'),
      ],
      audio: {
        uz: [
          "E'tibor bering, butun uch sonini birdan uch kasri ko'rinishida yozish mumkin.",
          "Birdan uchning teskari kasri uchdan bir bo'ladi.",
          "Shuning uchun oltidan beshni uchga bo'lish oltidan beshni uchdan birga ko'paytirish bilan bir xil. Natijada o'n sakkizdan besh hosil bo'ladi.",
        ],
        ru: [
          'Обратите внимание, целое число три можно записать в виде дроби три первых.',
          'Дробь, обратная трём первым, равна одной третьей.',
          'Поэтому пять шестых разделить на три заменяем умножением пяти шестых на одну третью. Получается пять восемнадцатых.',
        ],
      },
      visual: { type: 'chain', items: ['5/6 : 3', '5/6 × 1/3', '5/18'] },
    },
    {
      type: 'question',
      scored: true,
      eyebrow: L('Butun son bilan', 'С целым числом'),
      title: L("4 : 2/3 ni hisoblang", 'Вычислите 4 : 2/3'),
      prompt: L("4 ni 4/1 deb yozing va 2/3 ning teskarisiga ko'paytiring.", 'Запишите 4 как 4/1 и умножьте на дробь, обратную 2/3.'),
      intro: L(
        "To'rtni uchdan ikkiga bo'lishda uchdan ikkini ikkidan uchga aylantiring. To'rt karra ikkidan uchni hisoblang.",
        'При делении четырёх на две трети замените две трети на три вторых. Вычислите четыре умножить на три вторых.',
      ),
      options: ['8/3', '6', '3/2', '2'],
      correct: 1,
      why: [
        L("4 : 2/3 = 4/1 × 3/2.", '4 : 2/3 = 4/1 × 3/2.'),
        L("4 bilan 2 ni qisqartirsak 2 qoladi; 2 × 3 = 6.", 'После сокращения 4 и 2 остаётся 2; 2 × 3 = 6.'),
      ],
      wrong: L("Bo'luvchi 2/3 ni 3/2 ga aylantiring, so'ng 4 ga ko'paytiring.", 'Замените делитель 2/3 на 3/2, затем умножьте на 4.'),
      visual: { type: 'chain', items: ['4 : 2/3', '4 × 3/2', '?'] },
    },
    {
      type: 'question',
      scored: true,
      eyebrow: L('Xatoni chetlab o‘ting', 'Избегаем ошибку'),
      title: L("5/6 : 10/9 ning to'g'ri almashtirilishini tanlang", 'Выберите верное преобразование 5/6 : 10/9'),
      prompt: L("Bo'lishni ko'paytirishga almashtirganda qaysi kasr teskarilanadi?", 'Какая дробь переворачивается при замене деления умножением?'),
      intro: L(
        "Birinchi kasrni joyida qoldiring. Ikkinchi kasr o'ndan to'qqiz bo'lsa, uning teskarisi to'qqizdan o'n bo'ladi.",
        'Оставьте первую дробь на месте. Если вторая дробь равна десяти девятым, обратная ей дробь равна девяти десятым.',
      ),
      options: ['6/5 × 9/10', '5/6 × 9/10', '6/5 × 10/9', '5/6 × 10/9'],
      correct: 1,
      why: [
        L("5/6 o'zgarishsiz qoladi.", 'Дробь 5/6 остаётся без изменения.'),
        L("10/9 teskarilanib 9/10 bo'ladi, shuning uchun 5/6 × 9/10 to'g'ri.", 'Дробь 10/9 переворачивается и становится 9/10, поэтому верно 5/6 × 9/10.'),
      ],
      wrong: L("Birinchi kasrni emas, faqat bo'luvchi bo'lgan ikkinchi kasrni teskarilang.", 'Переверните не первую дробь, а только вторую дробь-делитель.'),
      visual: {
        type: 'panels',
        panels: [
          { title: L('O‘zgarmaydi', 'Не меняется'), lines: ['5/6'] },
          { title: L('Teskarilanadi', 'Переворачивается'), lines: ['10/9 → 9/10'] },
        ],
      },
    },
    {
      type: 'info',
      eyebrow: L('Tekshirish', 'Проверка'),
      title: L("Bo'lish natijasini ko'paytirish bilan tekshiramiz", 'Проверяем деление умножением'),
      steps: [
        L("Agar 2/3 : 4/5 = 5/6 bo'lsa, bo'linmani bo'luvchiga ko'paytiramiz.", 'Если 2/3 : 4/5 = 5/6, умножаем частное на делитель.'),
        L("5/6 × 4/5 da 5 lar qisqaradi va 4/6 qoladi.", 'В произведении 5/6 × 4/5 пятёрки сокращаются и остаётся 4/6.'),
        L("4/6 = 2/3. Boshlang'ich bo'linuvchi qaytdi, demak javob to'g'ri.", '4/6 = 2/3. Получили исходное делимое, значит ответ верный.'),
      ],
      audio: {
        uz: [
          "Javobni tekshiramiz. Uchdan ikkini beshdan to'rtga bo'lganda oltidan besh chiqqan bo'lsa, bo'linmani bo'luvchiga ko'paytiramiz.",
          "Oltidan beshni beshdan to'rtga ko'paytirsak, beshlar qisqaradi va oltidan to'rt qoladi.",
          "Oltidan to'rt esa uchdan ikkiga teng. Boshlang'ich bo'linuvchi qaytdi, demak javob to'g'ri.",
        ],
        ru: [
          'Проверим ответ. Если две третьих разделить на четыре пятых равно пяти шестым, умножим частное на делитель.',
          'В произведении пять шестых умножить на четыре пятых пятёрки сокращаются, и остаётся четыре шестых.',
          'Четыре шестых равны двум третьим. Вернулось исходное делимое, значит ответ верный.',
        ],
      },
      visual: { type: 'chain', items: ['5/6 × 4/5', '4/6', '2/3'] },
    },
    {
      type: 'multi',
      scored: true,
      eyebrow: L('Bir nechta javob', 'Несколько ответов'),
      title: L("To'g'ri bo'linmalarni belgilang", 'Отметьте верные частные'),
      intro: L(
        "Har bir bo'lishni ikkinchi kasrning teskarisiga ko'paytirish orqali tekshiring.",
        'Проверьте каждое деление умножением на дробь, обратную второй.',
      ),
      options: ['1/2 : 1/4 = 2', '2/3 : 4/3 = 1/2', '3/5 : 9/10 = 2/3', '4/7 : 2/7 = 1/2'],
      correctSet: [0, 1, 2],
      why: [
        L("Birinchi uchta tenglik teskari kasrga ko'paytirib tekshirilganda to'g'ri.", 'Первые три равенства верны при проверке умножением на обратную дробь.'),
        L("4/7 : 2/7 = 4/7 × 7/2 = 2, 1/2 emas.", '4/7 : 2/7 = 4/7 × 7/2 = 2, а не 1/2.'),
      ],
      wrong: L("Har bir misolda ikkinchi kasrni teskarilang va qisqartirishni bajaring.", 'В каждом примере переверните вторую дробь и выполните сокращение.'),
    },
    {
      type: 'match',
      scored: true,
      eyebrow: L('Moslashtirish', 'Соответствие'),
      title: L("Bo'linmalarni javoblari bilan juftlang", 'Соедините частные с ответами'),
      prompt: L("Har bir ifoda uchun to'g'ri natijani tanlang.", 'Для каждого выражения выберите верный результат.'),
      intro: L(
        "Bo'lishni ko'paytirishga almashtiring, ikkinchi kasrni teskarilang va natijalarni juftlang.",
        'Замените деление умножением, переверните вторую дробь и соедините выражения с результатами.',
      ),
      rows: [
        { left: '3/4 : 1/2', correct: L('3/2', '3/2') },
        { left: '2/5 : 4/5', correct: L('1/2', '1/2') },
        { left: '5/6 : 10/9', correct: L('3/4', '3/4') },
      ],
      why: [
        L("3/4 : 1/2 = 3/2 va 2/5 : 4/5 = 1/2.", '3/4 : 1/2 = 3/2, а 2/5 : 4/5 = 1/2.'),
        L("5/6 : 10/9 = 5/6 × 9/10 = 3/4.", '5/6 : 10/9 = 5/6 × 9/10 = 3/4.'),
      ],
      wrong: L("Ikkinchi kasrning surat va maxrajini o'rin almashtirishdan boshlang.", 'Начните с перестановки числителя и знаменателя второй дроби.'),
    },
    {
      type: 'classify',
      scored: true,
      eyebrow: L('Qoidani tekshiramiz', 'Проверяем правило'),
      title: L("Almashtirishlarni to'g'ri va xato guruhiga ajrating", 'Разделите преобразования на верные и ошибочные'),
      prompt: L("Bo'lishdan ko'paytirishga o'tish to'g'ri bajarilganini tekshiring.", 'Проверьте правильность перехода от деления к умножению.'),
      intro: L(
        "Birinchi kasr o'zgarishsiz, ikkinchi kasr esa teskari yozilgan bo'lsa, almashtirish to'g'ri.",
        'Преобразование верно, если первая дробь не изменилась, а вторая записана в обратном виде.',
      ),
      binA: L("To'g'ri", 'Верно'),
      binB: L('Xato', 'Ошибка'),
      cards: [
        { label: '2/3 : 5/7 = 2/3 × 7/5', value: true },
        { label: '4/9 : 2/3 = 9/4 × 3/2', value: false },
        { label: '5/8 : 3 = 5/8 × 1/3', value: true },
        { label: '2 : 4/5 = 2 × 4/5', value: false },
      ],
      why: [
        L("Birinchi va uchinchi kartada faqat bo'luvchi teskarilangan.", 'В первой и третьей карточках перевёрнут только делитель.'),
        L("Ikkinchi kartada ikkala kasr teskarilangan, to'rtinchida esa bo'luvchi umuman teskarilanmagan.", 'Во второй карточке перевёрнуты обе дроби, а в четвёртой делитель не перевёрнут.'),
      ],
      wrong: L("Bo'linuvchi o'z joyida qoladi; faqat bo'luvchi teskarilanadi.", 'Делимое остаётся на месте; переворачивается только делитель.'),
    },
    {
      type: 'question',
      scored: true,
      eyebrow: L('Yakuniy masala', 'Итоговая задача'),
      title: L("8/9 : 4/15 ni hisoblang", 'Вычислите 8/9 : 4/15'),
      prompt: L("Bo'lishni ko'paytirishga almashtirib, oldindan qisqartiring.", 'Замените деление умножением и выполните предварительное сокращение.'),
      intro: L(
        "To'qqizdan sakkizni o'n beshdan to'rtga bo'lish uchun ikkinchi kasrni to'rtdan o'n beshga aylantiring. Sakkiz bilan to'rtni, o'n besh bilan to'qqizni qisqartiring.",
        'Чтобы разделить восемь девятых на четыре пятнадцатых, замените вторую дробь на пятнадцать четвёртых. Сократите восемь с четырьмя и пятнадцать с девятью.',
      ),
      options: ['10/3', '32/135', '3/10', '2/5'],
      correct: 0,
      why: [
        L("8/9 : 4/15 = 8/9 × 15/4.", '8/9 : 4/15 = 8/9 × 15/4.'),
        L("8 : 4 = 2 va 15 : 9 = 5/3, demak natija 2 × 5/3 = 10/3.", 'После сокращения получаем 2 × 5/3 = 10/3.'),
      ],
      wrong: L("Ikkinchi kasrni 15/4 ga aylantiring, so'ng 8 bilan 4 ni qisqartiring.", 'Замените вторую дробь на 15/4, затем сократите 8 и 4.'),
      fact: L("Nolga bo'lish mumkin emas; shu sabab bo'luvchi kasr nolga teng bo'lmasligi kerak.", 'Делить на ноль нельзя, поэтому дробь-делитель не должна быть равна нулю.'),
      factVisual: '8/9 : 4/15 = 10/3',
      visual: { type: 'chain', items: ['8/9 : 4/15', '8/9 × 15/4', '10/3'] },
    },
    {
      type: 'summary',
      eyebrow: L('Dars yakuni', 'Итог урока'),
      title: L("Kasrlarni bo'lishni o'rgandingiz", 'Вы научились делить дроби'),
      points: [
        L("Birinchi kasr o'zgarishsiz qoladi.", 'Первая дробь остаётся без изменения.'),
        L("Bo'lish ko'paytirishga almashtiriladi va ikkinchi kasr teskarilanadi.", 'Деление заменяется умножением, а вторая дробь переворачивается.'),
        L("Hosil bo'lgan ko'paytma qisqartirilib, natija tekshiriladi.", 'Полученное произведение сокращается, а результат проверяется.'),
      ],
      close: L(
        "Endi oddiy kasrlarni teskari kasr yordamida to'g'ri bo'lishni bajara olasiz.",
        'Теперь вы умеете правильно делить обыкновенные дроби с помощью обратной дроби.',
      ),
      audio: L(
        "Kasrlarni bo'lishni o'rgandingiz. Birinchi kasr o'zgarishsiz qoladi. Bo'lish ko'paytirishga almashtiriladi va ikkinchi kasr teskarilanadi. Hosil bo'lgan ko'paytma qisqartirilib, natija tekshiriladi. Endi oddiy kasrlarni teskari kasr yordamida to'g'ri bo'lishni bajara olasiz.",
        'Вы научились делить дроби. Первая дробь остаётся без изменения. Деление заменяется умножением, а вторая дробь переворачивается. Полученное произведение сокращается, затем результат проверяется. Теперь вы умеете правильно делить обыкновенные дроби с помощью обратной дроби.',
      ),
    },
  ],
};

export default function Dars12(props) {
  return <FractionTheoryLesson lesson={LESSON} {...props}/>;
}
