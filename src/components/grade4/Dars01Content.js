// 4-sinf Dars01 — approved CONTENT source.
// UZ terms were checked against the local 4-sinf textbook, pages 12–18.
export const CONTENT = {
  s0: {
    eyebrow: { ru: 'Новая миссия', uz: 'Yangi missiya' },
    topic: { ru: 'Тема урока: Классы многозначных чисел', uz: "Dars mavzusi: Ko'p xonali sonlar sinflari" },
    title: { ru: 'Новый адрес: 125407', uz: 'Yangi manzil: 125407' },
    lead: {
      ru: 'Bit получил код городского объекта, но видит только длинную цепочку цифр.',
      uz: "Bit shahar obyektining kodini oldi, lekin faqat uzun raqamlar qatorini ko'ryapti.",
    },
    numberRaw: '125407',
    question: { ru: 'Как показать структуру?', uz: "Tuzilishni qanday ko'rsatamiz?" },
    options: [
      { ru: 'Разделить на группы', uz: 'Guruhlarga ajratish' },
      { ru: 'Переставить цифры', uz: 'Raqamlarni almashtirish' },
      { ru: 'Удалить цифры', uz: "Raqamlarni o'chirish" },
    ],
    correctIndex: 0,
    correctText: {
      ru: 'Группировка сохранит все цифры и покажет структуру. Проверим этот способ.',
      uz: "Guruhlash barcha raqamlarni saqlaydi va tuzilishni ko'rsatadi. Bu usulni tekshiramiz.",
    },
    wrong: [
      null,
      {
        ru: 'Перестановка изменит адрес. Нужно сохранить каждую цифру на своём месте.',
        uz: "Raqamlarni almashtirish manzilni o'zgartiradi. Har bir raqamni o'z o'rnida saqlash kerak.",
      },
      {
        ru: 'Удаление изменит адрес. Нужен способ сохранить все шесть цифр.',
        uz: "Raqamni olib tashlash manzilni o'zgartiradi. Oltita raqamning barchasini saqlash kerak.",
      },
    ],
    audio: {
      intro: {
        ru: [
          'Привет, друг! Это Бит. Сегодня мы вместе запустим Центр данных умного города и разгадаем один важный числовой секрет.',
          'Тема нашего урока — классы многозначных чисел. Звучит серьёзно, но всё станет понятным, если двигаться спокойно, шаг за шагом.',
          'Мы научимся видеть в длинном числе небольшие понятные части, правильно называть каждый класс и читать большие числа без ошибок.',
          'Я получил адрес: сто двадцать пять тысяч четыреста семь. Но городская система видит только длинную цепочку цифр — один, два, пять, четыре, ноль, семь.',
          'Нам нужно показать устройство этого числа и при этом сохранить адрес точно таким, каким он был. Ни одна цифра не должна потерять своё значение.',
          'Перед тобой три идеи. Рассмотри их внимательно и выбери действие, с которого лучше начать нашу миссию.',
        ],
        uz: [
          "Salom, do'stim! Men Bitman. Bugun biz birgalikda aqlli shaharning Ma'lumotlar markazini ishga tushiramiz va muhim bir sonli sirni ochamiz.",
          "Darsimizning mavzusi — ko'p xonali sonlar sinflari. Nomi jiddiy tuyuladi, ammo asta-sekin, qadamma-qadam harakat qilsak, hammasi tushunarli bo'ladi.",
          "Biz uzun sonda kichik va tushunarli qismlarni ko'rishni, har bir sinfni to'g'ri nomlashni va katta sonlarni xatosiz o'qishni o'rganamiz.",
          "Men bir yuz yigirma besh ming to'rt yuz yetti manzilini oldim. Ammo shahar tizimi faqat bir, ikki, besh, to'rt, nol, yetti raqamlaridan iborat uzun qatorni ko'ryapti.",
          "Biz sonning tuzilishini ko'rsatishimiz va manzilni aynan o'z holicha saqlashimiz kerak. Hech bir raqam o'z qiymatini yo'qotmasligi lozim.",
          "Oldingda uchta g'oya bor. Ularni diqqat bilan ko'rib chiq va missiyamizni qaysi harakatdan boshlash yaxshiroq ekanini tanla.",
        ],
      },
      on_correct: {
        ru: 'Группировка сохранит все цифры и покажет структуру. Проверим этот способ.',
        uz: "Guruhlash barcha raqamlarni saqlaydi va tuzilishni ko'rsatadi. Bu usulni tekshiramiz.",
      },
      on_wrong: {
        ru: 'Так адрес изменится. Нужен способ сохранить каждую цифру на своём месте.',
        uz: "Bunday qilsak manzil o'zgaradi. Har bir raqamni o'z o'rnida saqlaydigan usul kerak.",
      },
    },
  },
  s1: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslaymiz' },
    bridge: { ru: 'Сначала проверим знакомые разряды.', uz: 'Avval tanish xonalarni tekshiramiz.' },
    question: {
      ru: 'Какое число состоит из 6 сотен, 4 десятков и 2 единиц?',
      uz: "Qaysi son 6 yuzlik, 4 o'nlik va 2 birlikdan iborat?",
    },
    options: ['642', '624', '462', '6042'],
    correctIndex: 0,
    correctText: {
      ru: 'Верно. Сотни, десятки и единицы записаны слева направо: 642.',
      uz: "To'g'ri. Yuzlar, o'nlar va birlar chapdan o'ngga yoziladi: 642.",
    },
    wrong: [
      null,
      {
        ru: 'Здесь 2 десятка и 4 единицы. Проверь цифру в разряде десятков.',
        uz: "Bu sonda 2 o'nlik va 4 birlik bor. O'nlar xonasidagi raqamni tekshiring.",
      },
      {
        ru: 'Здесь 4 сотни и 6 десятков. Начни с количества сотен.',
        uz: "Bu sonda 4 yuzlik va 6 o'nlik bor. Avval yuzlar sonini tekshiring.",
      },
      {
        ru: 'Получилось четырёхзначное число. В условии названы только сотни, десятки и единицы.',
        uz: "To'rt xonali son hosil bo'ldi. Shartda faqat yuzlar, o'nlar va birlar aytilgan.",
      },
    ],
    audio: {
      intro: {
        ru: 'Вспомним разряды. Какое число состоит из шести сотен, четырёх десятков и двух единиц?',
        uz: "Xonalarni eslaymiz. Qaysi son olti yuzlik, to'rt o'nlik va ikki birlikdan iborat?",
      },
      on_correct: {
        ru: 'Верно. Шесть сотен, четыре десятка и две единицы дают шестьсот сорок два.',
        uz: "To'g'ri. Olti yuzlik, to'rt o'nlik va ikki birlik olti yuz qirq ikki sonini beradi.",
      },
      on_wrong: {
        ru: 'Проверь порядок разрядов. Сначала сотни, затем десятки и единицы.',
        uz: "Xonalar tartibini tekshiring. Avval yuzlar, keyin o'nlar va birlar.",
      },
    },
  },
  s2: {
    eyebrow: { ru: 'Объяснение · шаг 1', uz: 'Tushuntirish · 1-qadam' },
    bridge: {
      ru: 'Знакомая таблица закончилась, но число продолжается. Разберёмся без догадок.',
      uz: "Tanish jadval tugadi, ammo son davom etmoqda. Endi buni taxminsiz tushunib olamiz.",
    },
    title: { ru: 'Почему число делим справа?', uz: "Nega sonni o'ngdan ajratamiz?" },
    number: '4 208',
    explanationLead: {
      ru: 'Проследи, как Бит находит знакомые разряды и открывает новый класс.',
      uz: "Bit tanish xonalarni qanday topishi va yangi sinfni ochishini kuzating.",
    },
    explanationSteps: [
      {
        label: { ru: 'Находим точку отсчёта', uz: 'Boshlanish nuqtasini topamiz' },
        text: {
          ru: 'Последняя цифра справа всегда показывает единицы. Поэтому деление начинаем именно справа.',
          uz: "O'ngdagi oxirgi raqam doimo birlarni ko'rsatadi. Shuning uchun ajratishni aynan o'ngdan boshlaymiz.",
        },
      },
      {
        label: { ru: 'Собираем знакомые разряды', uz: 'Tanish xonalarni yig’amiz' },
        text: {
          ru: '8 — единицы, 0 — десятки, 2 — сотни. Эти три разряда образуют класс единиц.',
          uz: "8 birlar, 0 o'nlar, 2 yuzlar xonasida turadi. Bu uchta xona birlar sinfini hosil qiladi.",
        },
      },
      {
        label: { ru: 'Ставим границу класса', uz: 'Sinf chegarasini qo’yamiz' },
        text: {
          ru: 'После трёх цифр проводим границу. Справа остаётся 208 — класс единиц.',
          uz: "Uchta raqamdan keyin sinf chegarasini qo'yamiz. O'ngda 208, ya'ni birlar sinfi qoladi.",
        },
      },
      {
        label: { ru: 'Открываем следующий класс', uz: 'Keyingi sinfni ochamiz' },
        text: {
          ru: 'Цифра 4 слева означает четыре тысячи. Она начинает следующий класс — класс тысяч.',
          uz: "Chapdagi 4 raqami to'rt mingni bildiradi. U keyingi sinf, ya'ni minglar sinfini boshlaydi.",
        },
      },
    ],
    resultText: {
      ru: '4 | 208 = 4 тысячи и 208 единиц.',
      uz: "4 | 208 = 4 minglik va 208 birlik.",
    },
    replayLabel: { ru: 'Повторить объяснение', uz: 'Tushuntirishni takrorlash' },
    audio: {
      ru: [
        'Посмотри на число четыре тысячи двести восемь. Последняя цифра справа всегда показывает единицы, поэтому разбор начинаем справа.',
        'Восемь — единицы, ноль — десятки, два — сотни. Эти три знакомых разряда вместе образуют класс единиц.',
        'После трёх цифр ставим границу класса. Справа получилось двести восемь — это класс единиц.',
        'Слева осталась цифра четыре. Она означает четыре тысячи и открывает следующий класс — класс тысяч.',
      ],
      uz: [
        "To'rt ming ikki yuz sakkiz soniga qarang. O'ngdagi oxirgi raqam doimo birlarni ko'rsatadi, shuning uchun tahlilni o'ngdan boshlaymiz.",
        "Sakkiz birlar, nol o'nlar, ikki yuzlar xonasida turadi. Bu uchta tanish xona birlar sinfini hosil qiladi.",
        "Uchta raqamdan keyin sinf chegarasini qo'yamiz. O'ngda ikki yuz sakkiz, ya'ni birlar sinfi hosil bo'ldi.",
        "Chapda to'rt raqami qoldi. U to'rt mingni bildiradi va keyingi sinf — minglar sinfini ochadi.",
      ],
    },
  },
  s3: {
    eyebrow: { ru: 'Объяснение · шаг 2', uz: 'Tushuntirish · 2-qadam' },
    bridge: {
      ru: 'Проверим тот же способ на шестизначном числе и назовём каждую часть.',
      uz: "Xuddi shu usulni olti xonali sonda tekshiramiz va har bir qismni nomlaymiz.",
    },
    title: { ru: 'Как устроено число 125 407?', uz: '125 407 soni qanday tuzilgan?' },
    number: '125407',
    explanationLead: {
      ru: 'Теперь не угадываем границу: выполняем одно и то же правило по шагам.',
      uz: "Endi chegarani taxmin qilmaymiz: bir xil qoidani qadamma-qadam bajaramiz.",
    },
    explanationSteps: [
      {
        label: { ru: 'Записываем число', uz: 'Sonni yozamiz' },
        text: {
          ru: 'Сначала видим целое число без деления: 125407. Крайняя правая цифра 7 — единицы.',
          uz: "Avval sonni ajratmasdan ko'ramiz: 125407. Eng o'ngdagi 7 raqami birlarni bildiradi.",
        },
      },
      {
        label: { ru: 'Отделяем первую тройку', uz: 'Birinchi uchlikni ajratamiz' },
        text: {
          ru: 'Отсчитываем справа три цифры: 407. Это класс единиц — сотни, десятки и единицы.',
          uz: "O'ngdan uchta raqamni sanaymiz: 407. Bu birlar sinfi — yuzlar, o'nlar va birlar.",
        },
      },
      {
        label: { ru: 'Называем левую группу', uz: 'Chap guruhni nomlaymiz' },
        text: {
          ru: 'Слева осталась группа 125. Это класс тысяч: сотни тысяч, десятки тысяч и тысячи.',
          uz: "Chapda 125 guruhi qoldi. Bu minglar sinfi: yuz minglar, o'n minglar va bir minglar.",
        },
      },
      {
        label: { ru: 'Читаем по классам', uz: "Sinflar bo'yicha o'qiymiz" },
        text: {
          ru: 'Сначала читаем класс тысяч, затем класс единиц: сто двадцать пять тысяч четыреста семь.',
          uz: "Avval minglar sinfini, keyin birlar sinfini o'qiymiz: bir yuz yigirma besh ming to'rt yuz yetti.",
        },
      },
    ],
    resultText: {
      ru: '125 | 407: слева класс тысяч, справа класс единиц.',
      uz: "125 | 407: chapda minglar sinfi, o'ngda birlar sinfi.",
    },
    replayLabel: { ru: 'Показать ещё раз', uz: "Yana bir marta ko'rsatish" },
    audio: {
      ru: [
        'Рассмотрим число сто двадцать пять тысяч четыреста семь. Крайняя правая цифра семь показывает единицы.',
        'Отсчитываем справа три цифры: четыре, ноль, семь. Группа четыреста семь образует класс единиц.',
        'Слева остаётся группа сто двадцать пять. Она образует класс тысяч: сотни тысяч, десятки тысяч и тысячи.',
        'Читаем число по классам слева направо: сто двадцать пять тысяч четыреста семь.',
      ],
      uz: [
        "Bir yuz yigirma besh ming to'rt yuz yetti sonini ko'rib chiqamiz. Eng o'ngdagi yetti raqami birlarni ko'rsatadi.",
        "O'ngdan uchta raqamni sanaymiz: to'rt, nol, yetti. To'rt yuz yetti guruhi birlar sinfini hosil qiladi.",
        "Chapda bir yuz yigirma besh guruhi qoladi. U yuz minglar, o'n minglar va bir minglardan iborat minglar sinfini hosil qiladi.",
        "Sonni sinflar bo'yicha chapdan o'ngga o'qiymiz: bir yuz yigirma besh ming to'rt yuz yetti.",
      ],
    },
  },
  s4: {
    eyebrow: { ru: 'Тренажёр с Битом', uz: 'Bit bilan trenajyor' },
    bridge: {
      ru: 'Теперь повтори способ сам. Бит будет давать только один шаг за раз.',
      uz: "Endi usulni o'zingiz takrorlang. Bit har safar faqat bitta qadam beradi.",
    },
    title: { ru: 'Раздели число 125407 по классам', uz: "125407 sonini sinflarga ajrating" },
    trainerLead: {
      ru: 'Решай последовательно: сначала правая группа, затем её название, после этого левая группа.',
      uz: "Ketma-ket yeching: avval o'ng guruh, keyin uning nomi, undan so'ng chap guruh.",
    },
    trainerSteps: [
      {
        prompt: {
          ru: 'Шаг 1 из 4. Какую группу из трёх цифр отделяем первой?',
          uz: "4 qadamdan 1-qadam. Avval qaysi uchta raqamli guruhni ajratamiz?",
        },
        options: [
          { ru: '125', uz: '125' },
          { ru: '407', uz: '407' },
          { ru: '540', uz: '540' },
        ],
        correctIndex: 1,
        correctText: {
          ru: 'Верно: считаем три цифры справа и получаем 407.',
          uz: "To'g'ri: o'ngdan uchta raqamni sanab, 407 ni olamiz.",
        },
        hint: {
          ru: 'Найди крайнюю правую цифру 7 и возьми вместе с ней ещё две цифры слева.',
          uz: "Eng o'ngdagi 7 raqamini toping va u bilan chapdagi yana ikkita raqamni oling.",
        },
      },
      {
        prompt: {
          ru: 'Шаг 2 из 4. Как называется правая группа 407?',
          uz: "4 qadamdan 2-qadam. O'ngdagi 407 guruhi qanday ataladi?",
        },
        options: [
          { ru: 'класс тысяч', uz: 'minglar sinfi' },
          { ru: 'класс единиц', uz: 'birlar sinfi' },
          { ru: 'один разряд', uz: 'bitta xona' },
        ],
        correctIndex: 1,
        correctText: {
          ru: 'Да. 407 содержит сотни, десятки и единицы — это класс единиц.',
          uz: "Ha. 407 yuzlar, o'nlar va birlardan iborat — bu birlar sinfi.",
        },
        hint: {
          ru: 'В правой группе находятся знакомые сотни, десятки и единицы.',
          uz: "O'ng guruhda tanish yuzlar, o'nlar va birlar joylashgan.",
        },
      },
      {
        prompt: {
          ru: 'Шаг 3 из 4. Какая группа осталась слева от границы?',
          uz: '4 qadamdan 3-qadam. Chegaraning chap tomonida qaysi guruh qoldi?',
        },
        options: [
          { ru: '407', uz: '407' },
          { ru: '125', uz: '125' },
          { ru: '12', uz: '12' },
        ],
        correctIndex: 1,
        correctText: {
          ru: 'Верно. После отделения 407 слева остаётся группа 125.',
          uz: "To'g'ri. 407 ajratilgach, chapda 125 guruhi qoladi.",
        },
        hint: {
          ru: 'Мысленно поставь границу перед цифрой 4: 125 | 407.',
          uz: "4 raqamidan oldin chegarani tasavvur qiling: 125 | 407.",
        },
      },
      {
        prompt: {
          ru: 'Шаг 4 из 4. Как называется левая группа 125?',
          uz: '4 qadamdan 4-qadam. Chapdagi 125 guruhi qanday ataladi?',
        },
        options: [
          { ru: 'класс единиц', uz: 'birlar sinfi' },
          { ru: 'класс тысяч', uz: 'minglar sinfi' },
          { ru: 'класс сотен', uz: 'yuzlar sinfi' },
        ],
        correctIndex: 1,
        correctText: {
          ru: 'Верно. 125 показывает количество тысяч — это класс тысяч.',
          uz: "To'g'ri. 125 minglar miqdorini ko'rsatadi — bu minglar sinfi.",
        },
        hint: {
          ru: 'Эту группу читаем первой: сто двадцать пять тысяч.',
          uz: "Bu guruhni birinchi o'qiymiz: bir yuz yigirma besh ming.",
        },
      },
    ],
    doneText: {
      ru: 'Готово: 125 | 407. Ты сам выполнил весь алгоритм — от правой цифры до названий классов.',
      uz: "Tayyor: 125 | 407. Siz butun algoritmni o'ngdagi raqamdan sinflar nomigacha mustaqil bajardingiz.",
    },
    audio: {
      ru: [
        'Построй структуру адреса сто двадцать пять тысяч четыреста семь.',
        'Начинай с крайней правой цифры и собери справа группу из трёх цифр.',
        'Оставшиеся цифры образуют следующую группу.',
      ],
      uz: [
        "Bir yuz yigirma besh ming to'rt yuz yetti manzilining tuzilishini yarating.",
        "Eng o'ngdagi raqamdan boshlang va o'ng tomonda uchta raqamli guruh tuzing.",
        "Qolgan raqamlar keyingi guruhni hosil qiladi.",
      ],
    },
  },
  s5: {
    eyebrow: { ru: 'Объясняем способ', uz: 'Usulni tushuntiramiz' },
    bridge: {
      ru: 'Группы получились. Теперь объясним, почему начали справа.',
      uz: "Guruhlar tayyor. Endi nima uchun o'ngdan boshlaganimizni tushuntiramiz.",
    },
    sequence: ['7', '47', '407', '2 407'],
    question: {
      ru: 'Начинаем справа, потому что справа всегда находится разряд…',
      uz: "O'ngdan boshlaymiz, chunki o'ng tomonda doimo qaysi xona turadi?",
    },
    options: [
      { ru: 'единиц', uz: 'birlar' },
      { ru: 'сотен', uz: 'yuzlar' },
      { ru: 'тысяч', uz: 'minglar' },
    ],
    correctIndex: 0,
    correctText: {
      ru: 'Верно. Крайняя правая цифра всегда показывает единицы.',
      uz: "To'g'ri. Eng o'ngdagi raqam doimo birlarni ko'rsatadi.",
    },
    wrong: [
      null,
      {
        ru: 'Сотни находятся на третьем месте справа. Точка отсчёта — крайний правый разряд.',
        uz: "Yuzlar o'ngdan uchinchi joyda turadi. Sanash eng o'ngdagi xonadan boshlanadi.",
      },
      {
        ru: 'Тысячи находятся левее первой тройки. Справа число начинается с меньшего разряда.',
        uz: "Minglar birinchi uchlikdan chapda turadi. Sonning o'ng tomoni kichik xonadan boshlanadi.",
      },
    ],
    audio: {
      intro: {
        ru: 'Посмотри, как число растёт слева, а крайняя правая цифра остаётся единицами. Заверши объяснение.',
        uz: "Son chap tomonga o'sishini, eng o'ngdagi raqam esa birlar bo'lib qolishini ko'ring. Izohni yakunlang.",
      },
      on_correct: {
        ru: 'Верно. Разряд единиц даёт постоянную точку отсчёта справа.',
        uz: "To'g'ri. Birlar xonasi o'ng tomonda doimiy boshlanish nuqtasini beradi.",
      },
      on_wrong: {
        ru: 'Посмотри на крайнюю правую цифру каждого числа.',
        uz: "Har bir sonning eng o'ngdagi raqamiga qarang.",
      },
    },
  },
  s6: {
    eyebrow: { ru: 'Новое понятие', uz: 'Yangi tushuncha' },
    bridge: {
      ru: 'У математических групп есть точные названия.',
      uz: 'Matematik guruhlarning aniq nomlari bor.',
    },
    title: { ru: 'Два класса числа', uz: 'Sonning ikki sinfi' },
    instruction: { ru: 'Выбери название, затем подходящую группу.', uz: 'Nomni, keyin mos guruhni tanlang.' },
    groups: ['125', '407'],
    labels: [
      { id: 'thousands', text: { ru: 'класс тысяч', uz: 'minglar sinfi' }, group: '125' },
      { id: 'units', text: { ru: 'класс единиц', uz: 'birlar sinfi' }, group: '407' },
    ],
    hint: {
      ru: 'Правая группа содержит обычные единицы, десятки и сотни.',
      uz: "O'ngdagi guruh oddiy birlar, o'nlar va yuzlardan iborat.",
    },
    doneText: {
      ru: '407 — класс единиц. 125 — класс тысяч.',
      uz: '407 birlar sinfi. 125 minglar sinfi.',
    },
    audio: {
      ru: [
        'Группа из трёх разрядов называется классом.',
        'Первая группа справа содержит единицы, десятки и сотни. Это класс единиц.',
        'Следующая группа содержит единицы тысяч, десятки тысяч и сотни тысяч. Это класс тысяч.',
        'Соедини каждое название с его группой.',
      ],
      uz: [
        "Uchta xonadan iborat guruh sinf deb ataladi.",
        "O'ngdagi birinchi guruh birlar, o'nlar va yuzlardan iborat. Bu birlar sinfi.",
        "Keyingi guruh bir minglar, o'n minglar va yuz minglardan iborat. Bu minglar sinfi.",
        "Har bir nomni uning guruhi bilan moslang.",
      ],
    },
  },
  s7: {
    eyebrow: { ru: 'Исследование значения', uz: 'Qiymatni tadqiq qilamiz' },
    bridge: {
      ru: 'Класс показывает не только группу, но и значение цифры.',
      uz: "Sinf faqat guruhni emas, raqamning qiymatini ham ko'rsatadi.",
    },
    title: { ru: 'Одинаковая цифра 5, разные значения', uz: 'Bir xil 5 raqami, turli qiymatlar' },
    rounds: [
      { number: '5 205', highlight: 0, options: ['5', '500', '5 000'], correctIndex: 2 },
      { number: '205 005', highlight: 5, options: ['5', '5 000', '500 000'], correctIndex: 0 },
    ],
    question: { ru: 'Каково значение выделенной цифры?', uz: 'Ajratilgan raqamning qiymati qancha?' },
    correctText: {
      ru: 'Верно. Значение цифры определяется её разрядом и классом.',
      uz: "To'g'ri. Raqamning qiymati uning xonasi va sinfi bilan aniqlanadi.",
    },
    wrongText: {
      ru: 'Не считывай только саму цифру. Найди её столбец в таблице классов.',
      uz: "Faqat raqamning o'ziga qaramang. Sinflar jadvalida uning ustunini toping.",
    },
    audio: {
      intro: {
        ru: 'Цифра пять встречается в двух числах. В каждом раунде определи её значение по месту в таблице.',
        uz: "Besh raqami ikkita sonda uchraydi. Har bir bosqichda jadvaldagi o'rniga qarab uning qiymatini aniqlang.",
      },
      on_correct: {
        ru: 'Верно. Одна и та же цифра получает значение от своего разряда.',
        uz: "To'g'ri. Bir xil raqam o'z xonasiga qarab qiymat oladi.",
      },
      on_wrong: { ru: 'Проверь разряд выделенной цифры.', uz: 'Ajratilgan raqamning xonasini tekshiring.' },
    },
  },
  s8: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    bridge: {
      ru: 'Сравним результаты двух раундов и сделаем вывод.',
      uz: "Ikki bosqich natijasini solishtirib, xulosa qilamiz.",
    },
    title: { ru: 'Один шаг влево', uz: 'Bir qadam chapga' },
    question: {
      ru: 'Как изменится значение цифры 6 после сдвига на один разряд влево?',
      uz: '6 raqamining qiymati bir xona chapga siljigach qanday o‘zgaradi?',
    },
    options: [
      { ru: 'станет в 10 раз больше', uz: '10 marta kattalashadi' },
      { ru: 'станет в 10 раз меньше', uz: '10 marta kichrayadi' },
      { ru: 'не изменится', uz: "o'zgarmaydi" },
    ],
    correctIndex: 0,
    correctText: {
      ru: 'Верно. Каждый соседний разряд слева в 10 раз больше, поэтому значение цифры 6 увеличилось в 10 раз.',
      uz: "To'g'ri. Chapdagi har bir qo'shni xona 10 marta katta, shuning uchun 6 raqamining qiymati 10 marta oshdi.",
    },
    wrong: [
      null,
      {
        ru: 'Движение влево ведёт к более крупному разряду. Сравни соседние разряды.',
        uz: "Chapga siljish kattaroq xonaga olib boradi. Qo'shni xonalarni solishtiring.",
      },
      {
        ru: 'Цифра та же, но её разряд изменился. Сравни значение соседних разрядов.',
        uz: "Raqam o'sha, ammo uning xonasi o'zgardi. Qo'shni xonalar qiymatini solishtiring.",
      },
    ],
    audio: {
      intro: {
        ru: 'Мы уже нашли значения цифры по её месту. Теперь сделай предсказание без полного вычисления: проследи, куда передвинулась цифра шесть.',
        uz: "Raqam qiymatini uning o'rniga qarab topdik. Endi to'liq hisoblamasdan ayting: 6 raqami qayerga siljiganini kuzating.",
      },
      on_correct: {
        ru: 'Верно. Один шаг влево умножил значение цифры на десять.',
        uz: "To'g'ri. Bir qadam chapga raqam qiymatini o'nga ko'paytirdi.",
      },
      on_wrong: {
        ru: 'Вспомни: десятки в десять раз больше единиц, сотни в десять раз больше десятков. Эта связь продолжается.',
        uz: "Eslang: o'nlar birlardan o'n marta, yuzlar o'nlardan o'n marta katta. Bu bog'lanish davom etadi.",
      },
    },
  },
  s9: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    bridge: { ru: 'Назовём открытый способ точно.', uz: 'Topilgan usulni aniq ifodalaymiz.' },
    title: { ru: 'Собери правило', uz: "Qoidani yig'ing" },
    fragments: {
      ru: [
        'Делим число',
        'справа налево',
        'по 3 разряда.',
        'Справа — класс единиц,',
        'слева — класс тысяч.',
      ],
      uz: [
        'Sonni',
        "o'ngdan chapga",
        '3 xonadan ajratamiz.',
        "O'ngda — birlar sinfi,",
        'chapda — minglar sinfi.',
      ],
    },
    rule: {
      ru: 'Многозначное число делим справа налево на классы по три разряда. Первый справа — класс единиц, следующий — класс тысяч.',
      uz: "Ko'p xonali sonni o'ngdan chapga har birida uchtadan raqam bo'lgan sinflarga ajratamiz. O'ngdagi birinchi sinf birlar sinfi, keyingisi minglar sinfi.",
    },
    audio: {
      ru: [
        'Мы уже проверили способ на нескольких числах.',
        'Собери части правила в правильном порядке.',
        'Многозначное число делим справа налево на классы по три разряда. Первый справа класс единиц, следующий класс тысяч.',
      ],
      uz: [
        "Usulni bir nechta sonda tekshirdik.",
        "Qoida qismlarini to'g'ri tartibda yig'ing.",
        "Ko'p xonali sonni o'ngdan chapga har birida uchtadan raqam bo'lgan sinflarga ajratamiz. O'ngdagi birinchi sinf birlar sinfi, keyingisi minglar sinfi.",
      ],
    },
  },
  s10: {
    eyebrow: { ru: 'Решаем вместе', uz: 'Birga yechamiz' },
    bridge: { ru: 'Применим правило к новому городскому коду.', uz: "Qoidani yangi shahar kodiga qo'llaymiz." },
    title: { ru: 'Размести 348 216 по классам', uz: '348 216 ni sinflarga joylashtiring' },
    numberRaw: '348216',
    stepQuestions: [
      { ru: 'Какая группа первой отделяется справа?', uz: "O'ngdan birinchi qaysi guruh ajratiladi?" },
      { ru: 'Какая группа остаётся для класса тысяч?', uz: 'Minglar sinfi uchun qaysi guruh qoladi?' },
    ],
    stepOptions: [
      ['216', '348', '821'],
      ['348', '216', '843'],
    ],
    correctIndices: [0, 0],
    classUnits: { ru: 'класс единиц', uz: 'birlar sinfi' },
    classThousands: { ru: 'класс тысяч', uz: 'minglar sinfi' },
    doneText: {
      ru: '348 тысяч и 216 единиц образуют число 348 216.',
      uz: '348 ming va 216 bir 348 216 sonini hosil qiladi.',
    },
    audio: {
      ru: [
        'Теперь работаем вместе. Начни с правой стороны и выдели три цифры.',
        'Двести шестнадцать это класс единиц.',
        'Оставшиеся триста сорок восемь занимают класс тысяч.',
      ],
      uz: [
        "Endi birga ishlaymiz. O'ng tomondan boshlang va uchta raqamni ajrating.",
        "Ikki yuz o'n olti birlar sinfidir.",
        "Qolgan uch yuz qirq sakkiz minglar sinfini egallaydi.",
      ],
    },
  },
  s11: {
    eyebrow: { ru: 'Теперь с подсказкой', uz: 'Endi ishora bilan' },
    bridge: {
      ru: 'Граница классов видна, но цифры размещаешь ты.',
      uz: "Sinflar chegarasi ko'rinadi, raqamlarni esa siz joylashtirasiz.",
    },
    title: { ru: 'Размести число 70 509', uz: '70 509 sonini joylashtiring' },
    instruction: {
      ru: 'Перетащи цифры или выбери цифру, затем её место. Не теряй нули.',
      uz: "Raqamlarni ko'chiring yoki raqamni, keyin uning joyini tanlang. Nollarni yo'qotmang.",
    },
    digits: ['7', '0', '5', '0', '9'],
    target: [null, '7', '0', '5', '0', '9'],
    hint1: {
      ru: 'Начни с 9 в разряде единиц и двигайся влево.',
      uz: 'Birlar xonasidagi 9 dan boshlang va chapga yuring.',
    },
    hint2: {
      ru: 'Ноль занимает разряд. Оставь его между соседними цифрами.',
      uz: "Nol xonani egallaydi. Uni qo'shni raqamlar orasida qoldiring.",
    },
    doneText: {
      ru: 'Верно. 70 — класс тысяч, 509 — класс единиц. Оба нуля сохранили свои разряды.',
      uz: "To'g'ri. 70 minglar sinfi, 509 birlar sinfi. Ikkala nol ham o'z xonasini saqladi.",
    },
    audio: {
      intro: {
        ru: 'Размести семьдесят тысяч пятьсот девять в таблице классов. Начни справа и сохрани каждый ноль.',
        uz: "Yetmish ming besh yuz to'qqiz sonini sinflar jadvaliga joylashtiring. O'ngdan boshlang va har bir nolni saqlang.",
      },
      on_correct: {
        ru: 'Верно. Нули остались в своих разрядах, поэтому значение числа не изменилось.',
        uz: "To'g'ri. Nollar o'z xonalarida qoldi, shuning uchun sonning qiymati o'zgarmadi.",
      },
      on_wrong: {
        ru: 'Проверь каждый разряд справа налево. Ноль тоже занимает место.',
        uz: "Har bir xonani o'ngdan chapga tekshiring. Nol ham joy egallaydi.",
      },
    },
  },
  s12: {
    eyebrow: { ru: 'Выбор стратегии', uz: 'Strategiyani tanlash' },
    bridge: {
      ru: 'Не всегда нужно разбирать все шесть разрядов.',
      uz: "Har doim oltita xonaning barchasini tahlil qilish shart emas.",
    },
    question: {
      ru: 'Как быстрее найти полные тысячи и остаток в числе 482 731?',
      uz: '482 731 sonidagi to‘liq minglar va qoldiqni qanday tez topamiz?',
    },
    options: [
      { ru: 'Отделить справа три разряда', uz: 'O‘ngdan uchta xonani ajratish' },
      { ru: 'Сложить все цифры', uz: "Barcha raqamlarni qo'shish" },
      { ru: 'Убрать последние три цифры', uz: 'Oxirgi uchta raqamni o‘chirish' },
    ],
    correctIndex: 0,
    followupQuestion: {
      ru: 'Как правильно разложить число на полные тысячи и остаток?',
      uz: 'Sonni to‘liq minglar va qoldiqqa qanday to‘g‘ri ajratamiz?',
    },
    followupOptions: [
      { ru: '482 тысячи, остаток 731', uz: '482 ming, qoldiq 731' },
      { ru: '731 тысяча, остаток 482', uz: '731 ming, qoldiq 482' },
      { ru: '482 731 тысяча, остаток 0', uz: '482 731 ming, qoldiq 0' },
    ],
    followupCorrectIndex: 0,
    correctText: {
      ru: 'Верно. 482 731 = 482 × 1 000 + 731. Значит, есть 482 полные тысячи и остаток 731.',
      uz: "To'g'ri. 482 731 = 482 × 1 000 + 731. Demak, 482 ta to‘liq ming va 731 qoldiq bor.",
    },
    wrong: [
      null,
      {
        ru: 'Сумма цифр показывает другое свойство числа. Чтобы найти тысячи, посмотри на соответствующий класс.',
        uz: "Raqamlar yig'indisi sonning boshqa xususiyatini ko'rsatadi. Minglarni topish uchun tegishli sinfga qarang.",
      },
      {
        ru: 'Удаление цифр изменяет число. Нам нужно сохранить и полные тысячи, и остаток.',
        uz: "Raqamlarni o‘chirish sonni o‘zgartiradi. To‘liq minglar ham, qoldiq ham saqlanishi kerak.",
      },
    ],
    audio: {
      intro: {
        ru: 'Диспетчеру нужно узнать, сколько полных пакетов по тысяче содержится в числе четыреста восемьдесят две тысячи семьсот тридцать один и сколько единиц останется. Сначала выбери стратегию.',
        uz: "Dispetcher 482 731 sonida minglik nechta to‘liq paket borligini va qancha qoldiq qolishini bilishi kerak. Avval strategiyani tanlang.",
      },
      on_correct: {
        ru: 'Верно. Отделяем справа три разряда. Теперь назови полные тысячи и остаток.',
        uz: "To'g'ri. O‘ngdan uchta xonani ajratamiz. Endi to‘liq minglar va qoldiqni ayting.",
      },
      on_wrong: {
        ru: 'Этот способ не показывает количество тысяч. Найди нужный класс.',
        uz: "Bu usul minglar sonini ko'rsatmaydi. Kerakli sinfni toping.",
      },
    },
  },
  s13: {
    eyebrow: { ru: 'Проверяем Bit', uz: 'Bitni tekshiramiz' },
    bridge: {
      ru: 'Bit применил правило, но поставил разделители слишком рано.',
      uz: "Bit qoidani qo'lladi, lekin ajratgichlarni noto'g'ri joylashtirdi.",
    },
    title: { ru: 'Исправь границу', uz: "Chegarani to'g'rilang" },
    bitVersion: '5 | 241 | 6',
    question: {
      ru: 'Выбери запись 52 416.',
      uz: '52 416 yozuvini tanlang.',
    },
    options: ['5 | 2416', '52 | 416', '524 | 16'],
    correctIndex: 1,
    correctText: {
      ru: 'Верно. Справа сначала отделяются три цифры 416. Слева может остаться одна, две или три цифры.',
      uz: "To'g'ri. O'ngdan avval 416 uchligi ajratiladi. Chapda bir, ikki yoki uchta raqam qolishi mumkin.",
    },
    wrong: [
      {
        ru: 'Справа остались четыре цифры. Отсчитай ровно три цифры от правого края.',
        uz: "O'ngda to'rtta raqam qoldi. O'ng chetdan roppa-rosa uchta raqamni sanang.",
      },
      null,
      {
        ru: 'Справа остались только две цифры. Класс единиц содержит три позиции.',
        uz: "O'ngda faqat ikkita raqam qoldi. Birlar sinfida uchta o'rin bor.",
      },
    ],
    audio: {
      intro: {
        ru: 'Bit разделил число пятьдесят две тысячи четыреста шестнадцать неправильно. Выбери верную границу классов.',
        uz: "Bit ellik ikki ming to'rt yuz o'n olti sonini noto'g'ri ajratdi. Sinflarning to'g'ri chegarasini tanlang.",
      },
      on_correct: {
        ru: 'Верно. Сначала справа отделили три цифры. Левая группа может быть короче.',
        uz: "To'g'ri. Avval o'ngdan uchta raqam ajratildi. Chapdagi guruh qisqaroq bo'lishi mumkin.",
      },
      on_wrong: {
        ru: 'Проверь количество цифр в правой группе.',
        uz: "O'ngdagi guruhdagi raqamlar sonini tekshiring.",
      },
    },
  },
  s14: {
    eyebrow: { ru: 'Решение для города', uz: 'Shahar uchun yechim' },
    bridge: {
      ru: 'Осталось направить сообщение в правильный городской объект.',
      uz: "Xabarni to'g'ri shahar obyektiga yuborish qoldi.",
    },
    title: { ru: 'Куда отправить сообщение?', uz: 'Xabarni qayerga yuboramiz?' },
    model: {
      ru: '1 сотня тысяч, 8 десятков тысяч, 0 единиц тысяч, 2 сотни, 4 десятка, 0 единиц',
      uz: "1 yuz minglik, 8 o'n minglik, 0 minglik, 2 yuzlik, 4 o'nlik, 0 birlik",
    },
    question: {
      ru: 'Собери код по разрядам. Какой объект должен получить сообщение?',
      uz: 'Kodni xonalar bo‘yicha yig‘ing. Xabarni qaysi obyekt olishi kerak?',
    },
    objects: [
      { name: { ru: 'Школа', uz: 'Maktab' }, code: '18 204' },
      { name: { ru: 'Лаборатория', uz: 'Laboratoriya' }, code: '108 024' },
      { name: { ru: 'Станция', uz: 'Stansiya' }, code: '180 240' },
    ],
    correctIndex: 2,
    correctText: {
      ru: 'Верно. В таблице получается 180 | 240. Это код станции 180 240.',
      uz: "To'g'ri. Jadvalda 180 | 240 hosil bo'ladi. Bu 180 240 stansiya kodi.",
    },
    wrong: [
      {
        ru: 'В этом коде нет разряда сотен тысяч. Начни модель с 1 сотни тысяч.',
        uz: "Bu kodda yuz minglar xonasi yo'q. Modelni 1 yuz minglikdan boshlang.",
      },
      {
        ru: 'Здесь цифры 8 и 2 стоят в других разрядах. Размести модель по шести столбцам.',
        uz: "Bu yerda 8 va 2 raqamlari boshqa xonalarda turibdi. Modelni oltita ustunga joylashtiring.",
      },
      null,
    ],
    factBadge: { ru: 'Математика вокруг нас', uz: 'Atrofimizdagi matematika' },
    factText: {
      ru: 'Коды и номера читают по группам, чтобы легче видеть их структуру и проверять запись.',
      uz: "Kodlar va raqamlar guruhlab o'qiladi. Bu ularning tuzilishini ko'rish va yozuvni tekshirishni osonlashtiradi.",
    },
    factAudio: {
      ru: 'Длинные коды часто делят на группы. Так человеку легче увидеть структуру и заметить пропущенную цифру.',
      uz: "Uzun kodlar ko'pincha guruhlarga ajratiladi. Shunda tuzilishni ko'rish va tushib qolgan raqamni aniqlash osonroq bo'ladi.",
    },
    audio: {
      intro: {
        ru: 'Система восстановила код по разрядам. Одна сотня тысяч, восемь десятков тысяч, ноль единиц тысяч, две сотни, четыре десятка и ноль единиц. Выбери объект с этим кодом.',
        uz: "Tizim kodni xonalar bo'yicha tikladi. Bir yuz minglik, sakkiz o'n minglik, nol minglik, ikki yuzlik, to'rt o'nlik va nol birlik. Shu kodli obyektni tanlang.",
      },
      on_correct: {
        ru: 'Верно. Получилось сто восемьдесят тысяч двести сорок. Сообщение направлено на станцию.',
        uz: "To'g'ri. Bir yuz sakson ming ikki yuz qirq hosil bo'ldi. Xabar stansiyaga yuborildi.",
      },
      on_wrong: {
        ru: 'Проверь положение каждой цифры в таблице классов.',
        uz: "Har bir raqamning sinflar jadvalidagi o'rnini tekshiring.",
      },
    },
  },
  s15: {
    eyebrow: { ru: 'Награда за миссию', uz: 'Missiya mukofoti' },
    title: { ru: 'Открой звание', uz: 'Unvonni oching' },
    hookClose: {
      ru: 'Ты восстановил основу, прошёл два способа объяснения, поставил границы пальцем и решил единый блиц.',
      uz: "Siz asosni tikladingiz, ikki usuldagi tushuntirishdan o'tdingiz, chegaralarni barmoq bilan qo'ydingiz va yagona blitsni yechdingiz.",
    },
    reflectionStart: {
      ru: 'Чтобы увидеть классы числа, сначала я…',
      uz: 'Son sinflarini ko‘rish uchun avval men…',
    },
    reflectionQuestion: {
      ru: 'Как правильно начать делить многозначное число на классы?',
      uz: 'Ko‘p xonali sonni sinflarga ajratishni qanday to‘g‘ri boshlash kerak?',
    },
    reflectionOptions: [
      { ru: 'делю справа по три', uz: "o'ngdan uchtadan ajrataman" },
      { ru: 'складываю цифры', uz: "raqamlarni qo'shaman" },
      { ru: 'переставляю цифры', uz: 'raqamlarni almashtiraman' },
    ],
    reflectionCorrectIndex: 0,
    reflectionCorrectAudio: {
      ru: 'Верно. Начинаем справа и отделяем по три разряда. Правило подтверждено, награда открыта.',
      uz: "To‘g‘ri. O‘ngdan boshlaymiz va xonalarni uchtadan ajratamiz. Qoida tasdiqlandi, mukofot ochildi.",
    },
    reflectionWrongAudio: {
      ru: 'Подумай о постоянной точке отсчёта. С какой стороны всегда находятся единицы?',
      uz: 'Doimiy boshlanish nuqtasini o‘ylang. Birlar har doim qaysi tomonda bo‘ladi?',
    },
    mainLabel: { ru: 'Правило', uz: 'Qoida' },
    main: [
      { ru: 'Старт — справа.', uz: "Boshlanish — o'ngda." },
      {
        ru: 'Считай по 3 разряда.',
        uz: 'Uchtadan xona sanang.',
      },
      { ru: 'Справа: единицы → тысячи.', uz: "O'ngda: birlar → minglar." },
      { ru: 'Ноль держит место.', uz: "Nol o'rinni saqlaydi." },
    ],
    nextLabel: { ru: 'Следующая задача', uz: 'Keyingi vazifa' },
    nextText: {
      ru: 'Научить систему правильно читать и записывать многозначные числа.',
      uz: "Tizimga ko'p xonali sonlarni to'g'ri o'qish va yozishni o'rgatish.",
    },
    audio: {
      ru: [
        'Практическая часть завершена. Ты восстановил прежние знания, изучил два способа, потренировал границу пальцем и решил четыре вопроса на одном экране.',
        'Начинаем с крайней правой цифры и отсчитываем по три разряда.',
        'Первая группа справа называется классом единиц, следующая группа классом тысяч.',
        'Финальный вопрос: как правильно начать делить многозначное число на классы? Закончи фразу: чтобы увидеть классы числа, сначала я…',
      ],
      uz: [
        "Siz ikki usuldagi tushuntirish, bonus, trenajyor va tezkor testlardan o'tdingiz. Endi qoidani mustahkamlash qoldi.",
        "Eng o'ngdagi raqamdan boshlaymiz va xonalarni uchtadan sanaymiz.",
        "O'ngdagi birinchi guruh birlar sinfi, keyingi guruh minglar sinfi deb ataladi.",
        "Yakuniy savol: ko‘p xonali sonni sinflarga ajratishni qanday boshlash kerak? Gapni tugating: son sinflarini ko‘rish uchun avval men…",
      ],
    },
  },

  foundationReview: {
    eyebrow: { ru: 'Опора перед уроком', uz: 'Dars oldidan tayanch' },
    title: { ru: 'Вспомним разряды', uz: 'Xonalarni eslaymiz' },
    lead: {
      ru: 'Даже если прошлые темы были давно, этой опоры достаточно: разряд — это место цифры, значение зависит от места, а ноль удерживает пустой разряд.',
      uz: "Oldingi mavzular ancha oldin bo'lgan bo'lsa ham, shu tayanch yetadi: xona raqamning o'rni, qiymat o'ringa bog'liq, nol esa bo'sh xonani saqlaydi.",
    },
    memoryCards: [
      {
        label: { ru: '1. Считаем справа', uz: "1. O'ngdan sanaymiz" },
        text: { ru: 'Единицы → десятки → сотни.', uz: "Birlar → o'nlar → yuzlar." },
      },
      {
        label: { ru: '2. Место → значение', uz: "2. O'rin → qiymat" },
        text: { ru: 'Цифра показывает количество единиц своего разряда.', uz: "Raqam o'z xonasidagi birliklar sonini ko'rsatadi." },
      },
      {
        label: { ru: '3. Ноль держит место', uz: "3. Nol o'rinni saqlaydi" },
        text: { ru: 'Ноль ничего не добавляет, но не даёт цифрам сдвинуться.', uz: "Nol hech narsa qo'shmaydi, ammo raqamlarni siljitmaydi." },
      },
    ],
    rounds: [
      {
        number: '907',
        question: { ru: 'Какая разрядная сумма точно описывает число 907?', uz: 'Qaysi xona yig‘indisi 907 sonini aniq ifodalaydi?' },
        options: ['900 + 7', '90 + 7', '900 + 70'],
        correctIndex: 0,
        correctText: {
          ru: 'Верно. 9 стоит в сотнях, 0 удерживает десятки, 7 стоит в единицах: 900 + 0 + 7.',
          uz: "To'g'ri. 9 yuzlarda, 0 o'nlar o'rnini saqlaydi, 7 birlarda: 900 + 0 + 7.",
        },
        proof: { ru: '907 = 900 + 0 + 7', uz: '907 = 900 + 0 + 7' },
        proofLabel: { ru: '9 сотен · 0 десятков · 7 единиц', uz: "9 yuzlik · 0 o'nlik · 7 birlik" },
        wrongText: {
          ru: 'Отсчитай места справа: 7 — единицы, 0 — десятки, 9 — сотни.',
          uz: "O'ngdan sanang: 7 birlar, 0 o'nlar, 9 yuzlar xonasida.",
        },
      },
      {
        visualValues: ['507', '570'],
        question: { ru: 'Как изменилось значение цифры 7 во втором числе?', uz: 'Ikkinchi sonda 7 raqamining qiymati qanday o‘zgardi?' },
        options: [
          { ru: 'увеличилось в 10 раз', uz: '10 marta oshdi' },
          { ru: 'уменьшилось в 10 раз', uz: '10 marta kamaydi' },
          { ru: 'не изменилось', uz: "o'zgarmadi" },
        ],
        correctIndex: 0,
        correctText: {
          ru: 'Точно. В 507 цифра 7 означает 7 единиц, а в 570 — 7 десятков, то есть 70.',
          uz: "Aniq. 507 da 7 yetti birlikni, 570 da esa yetti o'nlikni, ya'ni 70 ni bildiradi.",
        },
        proof: { ru: '7 единиц → 7 десятков = 70', uz: "7 birlik → 7 o'nlik = 70" },
        proofLabel: { ru: 'Один разряд влево — значение в 10 раз больше', uz: "Chapga bir xona — qiymat 10 marta katta" },
        wrongText: {
          ru: 'Сравни место цифры 7: во втором числе она сдвинулась на один разряд влево.',
          uz: "7 raqamining o'rnini solishtiring: ikkinchi sonda u bir xona chapga siljigan.",
        },
      },
      {
        number: '806 → 86',
        question: { ru: 'Почему нельзя убрать ноль из записи 806?', uz: 'Nega 806 yozuvidan nolni olib tashlab bo‘lmaydi?' },
        options: [
          { ru: '6 превратится в 60', uz: '6 soni 60 ga aylanadi' },
          { ru: '8 сдвинется из сотен в десятки, и число изменится', uz: "8 yuzlardan o'nlarga siljiydi va son o'zgaradi" },
          { ru: 'ноль всегда нужно произносить при чтении', uz: "o'qishda nolni doimo aytish kerak" },
        ],
        correctIndex: 1,
        correctText: {
          ru: 'Верно. Ноль удерживает разряд десятков. Без него 806 превратится в 86.',
          uz: "To'g'ri. Nol o'nlar xonasini saqlaydi. U bo'lmasa, 806 soni 86 ga aylanadi.",
        },
        proof: { ru: '806 ≠ 86', uz: '806 ≠ 86' },
        proofLabel: { ru: '0 удерживает место десятков', uz: "0 o'nlar xonasini saqlaydi" },
        wrongText: {
          ru: 'Сравни позиции восьмёрки до и после удаления нуля.',
          uz: "Nol olib tashlanguncha va undan keyin 8 raqamining o'rnini solishtiring.",
        },
      },
    ],
    completionText: {
      ru: 'Опора восстановлена: разряд, значение цифры и роль нуля.',
      uz: "Tayanch tiklandi: xona, raqam qiymati va nolning vazifasi.",
    },
    wrongText: { ru: 'Проверь место каждой цифры справа налево.', uz: "Har bir raqam o'rnini o'ngdan chapga tekshiring." },
    audio: {
      intro: {
        ru: [
          'Перед новой темой восстановим всю необходимую основу. Разряд — это место цифры в записи числа.',
          'Справа налево идут единицы, десятки и сотни. Например, в числе триста двадцать шесть цифра три означает три сотни, цифра два — два десятка, цифра шесть — шесть единиц.',
          'Значение одной и той же цифры меняется вместе с её местом. Сдвиг на один разряд влево увеличивает значение в десять раз.',
          'Ноль тоже важен. Он показывает, что в разряде нет единиц, и удерживает остальные цифры на их местах.',
          'Теперь выполни три коротких задания. Они не повторяют пример из объяснения.',
        ],
        uz: [
          "Yangi mavzudan oldin kerakli asosni to'liq tiklaymiz. Xona — bu raqamning son yozuvidagi o'rni.",
          "O'ngdan chapga birlar, o'nlar va yuzlar joylashadi. Masalan, 326 sonida 3 uch yuzlikni, 2 ikki o'nlikni, 6 olti birlikni bildiradi.",
          "Bir xil raqamning qiymati o'rniga qarab o'zgaradi. Bir xona chapga siljish qiymatni o'n marta oshiradi.",
          "Nol ham muhim. U xonada birlik yo'qligini ko'rsatadi va boshqa raqamlarni o'z joyida ushlab turadi.",
          "Endi uchta qisqa topshiriqni bajaring. Ular tushuntirishdagi misolni takrorlamaydi.",
        ],
      },
    },
  },

  challenge6: {
    eyebrow: { ru: 'Задача на структуру', uz: 'Tuzilishga oid masala' },
    title: { ru: 'Нули внутри числа', uz: 'Son ichidagi nollar' },
    lead: {
      ru: 'Здесь недостаточно просто назвать две группы. Нужно доказать, что каждая цифра осталась в своём разряде.',
      uz: "Bu yerda ikki guruhni nomlashning o'zi yetmaydi. Har bir raqam o'z xonasida qolganini isbotlash kerak.",
    },
    rounds: [
      {
        number: '406072',
        question: { ru: 'Какая разрядная сумма сохраняет все позиции числа?', uz: 'Qaysi xona yig‘indisi sonning barcha o‘rinlarini saqlaydi?' },
        options: [
          '400 000 + 6 000 + 70 + 2',
          '400 000 + 600 + 70 + 2',
          '400 000 + 6 000 + 700 + 2',
        ],
        correctIndex: 0,
        correctText: {
          ru: 'Верно. Нули показывают отсутствие десятков тысяч и сотен, но их позиции сохранены.',
          uz: "To'g'ri. Nollar o'n minglik va yuzlik yo'qligini ko'rsatadi, ammo ularning o'rni saqlangan.",
        },
        proof: { ru: '406 | 072 = 400 000 + 6 000 + 70 + 2', uz: '406 | 072 = 400 000 + 6 000 + 70 + 2' },
        proofLabel: { ru: 'Каждая ненулевая цифра сохранила свой разряд', uz: "Har bir noldan boshqa raqam o'z xonasida qoldi" },
        wrongText: {
          ru: 'Раздели мысленно число на 406 и 072, затем назови значение каждой ненулевой цифры.',
          uz: "Sonni xayolan 406 va 072 ga ajrating, so'ng har bir noldan boshqa raqam qiymatini ayting.",
        },
      },
      {
        visualValues: ['406072', '46072'],
        question: { ru: 'Что произошло после удаления внутреннего нуля?', uz: 'Ichki nol olib tashlangach nima sodir bo‘ldi?' },
        options: [
          { ru: 'значение не изменилось', uz: "qiymat o'zgarmadi" },
          { ru: 'цифры слева сдвинулись в другие разряды, число изменилось', uz: "chapdagi raqamlar boshqa xonalarga siljidi, son o'zgardi" },
          { ru: 'изменилась только запись, но не число', uz: "faqat yozuv o'zgardi, son esa yo'q" },
        ],
        correctIndex: 1,
        correctText: {
          ru: 'Именно. Ноль был держателем места. После его удаления цифры 4 и 6 оказались в меньших разрядах.',
          uz: "Aynan shunday. Nol o'rinni saqlagan edi. U olib tashlangach, 4 va 6 kichikroq xonalarga o'tdi.",
        },
        proof: { ru: '406 072 → 46 072', uz: '406 072 → 46 072' },
        proofLabel: { ru: 'Удалили место — левые цифры сдвинулись', uz: "O'rin olib tashlandi — chapdagi raqamlar siljidi" },
        wrongText: {
          ru: 'Сравни разряд цифры 4 в обеих записях.',
          uz: "Ikkala yozuvda 4 raqamining xonasini solishtiring.",
        },
      },
      {
        number: '406072',
        question: {
          ru: 'Если увеличить цифру 6 на 1, не меняя её разряд, на сколько увеличится число?',
          uz: "6 raqamini o'z xonasida 1 ga oshirsak, son qanchaga ortadi?",
        },
        options: ['100', '1 000', '10 000'],
        correctIndex: 1,
        correctText: {
          ru: 'Верно. Цифра 6 стоит в разряде единиц тысяч, поэтому одна дополнительная единица этого разряда равна 1 000.',
          uz: "To'g'ri. 6 raqami minglar xonasida, shu xonaning bitta qo'shimcha birligi 1 000 ga teng.",
        },
        proof: { ru: '6 000 + 1 000 = 7 000', uz: '6 000 + 1 000 = 7 000' },
        proofVisual: {
          type: 'column',
          operator: '+',
          top: '6 000',
          bottom: '1 000',
          result: '7 000',
        },
        proofLabel: { ru: 'Одна единица разряда тысяч равна 1 000', uz: "Minglar xonasining bir birligi 1 000 ga teng" },
        wrongText: {
          ru: 'Сначала поставь границу 406 | 072 и назови разряд цифры 6.',
          uz: "Avval 406 | 072 chegarasini qo'ying va 6 raqamining xonasini ayting.",
        },
      },
    ],
    completionText: {
      ru: 'Доказано: границы классов и нули вместе сохраняют точную структуру числа.',
      uz: "Isbotlandi: sinf chegaralari va nollar birgalikda sonning aniq tuzilishini saqlaydi.",
    },
    audio: {
      ru: [
        'Теперь задача сложнее. В коде четыреста шесть тысяч семьдесят два два внутренних нуля.',
        'Сначала не читай варианты. Мысленно отдели справа три позиции и определи значение каждой ненулевой цифры.',
        'Во втором вопросе сравни исходную запись с записью без одного нуля. Следи не за видом числа, а за разрядами цифр.',
        'В третьем вопросе найди разряд цифры шесть. Изменение цифры на один изменит число на одну единицу именно этого разряда.',
      ],
      uz: [
        "Endi masala murakkabroq. To'rt yuz olti ming yetmish ikki kodida ikkita ichki nol bor.",
        "Avval variantlarni o'qimang. Xayolan o'ngdan uchta o'rinni ajrating va har bir noldan boshqa raqam qiymatini aniqlang.",
        "Ikkinchi savolda dastlabki yozuvni bitta nolsiz yozuv bilan solishtiring. Son ko'rinishiga emas, raqamlar xonasiga qarang.",
        "Uchinchi savolda 6 raqamining xonasini toping. Raqamning birga o'zgarishi sonni aynan shu xonaning bir birligiga o'zgartiradi.",
      ],
    },
  },

  challenge7: {
    eyebrow: { ru: 'Математический детектив', uz: 'Matematik detektiv' },
    title: { ru: 'Значение цифры 7', uz: '7 raqamining qiymati' },
    lead: {
      ru: 'Сравни числа 274 305 и 247 350. Цифры похожи, но их позиции различаются.',
      uz: "274 305 va 247 350 sonlarini solishtiring. Raqamlar o'xshash, ammo o'rinlari turlicha.",
    },
    rounds: [
      {
        visualValues: ['274 305', '247 350'],
        question: { ru: 'Какая пара верно показывает значение цифры 7?', uz: 'Qaysi juftlik 7 raqamining qiymatini to‘g‘ri ko‘rsatadi?' },
        options: [
          { ru: '70 000 и 7 000', uz: '70 000 va 7 000' },
          { ru: '7 000 и 70 000', uz: '7 000 va 70 000' },
          { ru: '700 и 700', uz: '700 va 700' },
        ],
        correctIndex: 0,
        correctText: {
          ru: 'Верно. В первом числе 7 стоит в десятках тысяч, во втором — в единицах тысяч.',
          uz: "To'g'ri. Birinchi sonda 7 o'n minglar, ikkinchisida bir minglar xonasida.",
        },
        proof: { ru: '274 | 305: 7 = 70 000 · 247 | 350: 7 = 7 000', uz: '274 | 305: 7 = 70 000 · 247 | 350: 7 = 7 000' },
        proofVisual: {
          type: 'place-values',
          rows: [
            {
              number: '274 305',
              place: { ru: '7 в десятках тысяч', uz: "7 o'n minglar xonasida" },
              value: '70 000',
            },
            {
              number: '247 350',
              place: { ru: '7 в единицах тысяч', uz: '7 minglar xonasida' },
              value: '7 000',
            },
          ],
        },
        proofLabel: { ru: 'Одинаковая цифра — разные разряды', uz: 'Bir xil raqam — turli xonalar' },
        wrongText: {
          ru: 'Сначала поставь границу классов, затем найди столбец цифры 7 в каждом числе.',
          uz: "Avval sinflar chegarasini qo'ying, keyin har bir sonda 7 raqamining ustunini toping.",
        },
      },
      {
        visualValues: ['70 000', '7 000'],
        question: { ru: 'Во сколько раз первое значение больше второго?', uz: 'Birinchi qiymat ikkinchisidan necha marta katta?' },
        options: ['7', '10', '100'],
        correctIndex: 1,
        correctText: {
          ru: 'Верно. Переход на один разряд влево увеличивает значение цифры в 10 раз.',
          uz: "To'g'ri. Bir xona chapga o'tish raqam qiymatini 10 marta oshiradi.",
        },
        proof: { ru: '70 000 = 7 000 × 10', uz: '70 000 = 7 000 × 10' },
        proofLabel: { ru: 'Один разряд влево', uz: 'Chapga bir xona' },
        wrongText: {
          ru: 'Сравни 70 000 и 7 000: сколько раз по 7 000 содержится в 70 000?',
          uz: "70 000 va 7 000 ni solishtiring: 70 000 da nechta 7 000 bor?",
        },
      },
      {
        visualValues: ['70 000', '7 000'],
        question: { ru: 'На сколько первое значение больше второго?', uz: 'Birinchi qiymat ikkinchisidan qanchaga katta?' },
        options: ['7 000', '63 000', '77 000'],
        correctIndex: 1,
        correctText: {
          ru: 'Верно. 70 000 − 7 000 = 63 000. Ты сравнил не цифры, а их разрядные значения.',
          uz: "To'g'ri. 70 000 − 7 000 = 63 000. Siz raqamlarni emas, ularning xona qiymatlarini solishtirdingiz.",
        },
        proof: { ru: '70 000 − 7 000 = 63 000', uz: '70 000 − 7 000 = 63 000' },
        proofVisual: {
          type: 'column',
          operator: '−',
          top: '70 000',
          bottom: '7 000',
          result: '63 000',
        },
        proofLabel: { ru: '«На сколько» — находим разность', uz: '«Qanchaga» — ayirmani topamiz' },
        wrongText: {
          ru: 'Вопрос «на сколько» требует найти разность: вычти 7 000 из 70 000.',
          uz: "«Qanchaga» savoli ayirmani topishni talab qiladi: 70 000 dan 7 000 ni ayiring.",
        },
      },
    ],
    completionText: {
      ru: 'Вывод найден: место цифры определяет её разряд, а разряд — её значение.',
      uz: "Xulosa topildi: raqamning o'rni uning xonasini, xona esa qiymatini belgilaydi.",
    },
    audio: {
      ru: [
        'Сравним два шестизначных числа с похожим набором цифр. Нас интересует только цифра семь.',
        'Сначала найди класс и разряд семёрки в каждом числе. Затем сравни полученные значения.',
        'Во втором вопросе используй связь соседних разрядов: каждый разряд слева в десять раз крупнее соседнего справа.',
        'В третьем вопросе будь внимателен к словам «на сколько»: здесь нужна разность двух разрядных значений.',
      ],
      uz: [
        "Raqamlari o'xshash ikkita olti xonali sonni solishtiramiz. Bizni faqat 7 raqami qiziqtiradi.",
        "Avval har bir sonda 7 raqamining sinfi va xonasini toping. Keyin hosil bo'lgan qiymatlarni solishtiring.",
        "Ikkinchi savolda qo'shni xonalar bog'lanishidan foydalaning: chapdagi har bir xona o'ngdagi qo'shnisidan o'n marta katta.",
        "Uchinchi savolda «qanchaga» so'ziga e'tibor bering: bu yerda ikki xona qiymatining ayirmasi kerak.",
      ],
    },
  },

  dividerGuided: {
    eyebrow: { ru: 'Тренажёр жеста', uz: 'Barmoq bilan trenajyor' },
    title: { ru: 'Поставь границу: 73506', uz: "Chegarani qo'ying: 73506" },
    raw: '73506',
    correctGap: 2,
    result: '73 | 506',
    lead: {
      ru: 'Не выбирай готовый ответ. Коснись пальцем нужного промежутка между цифрами.',
      uz: "Tayyor javobni tanlamang. Raqamlar orasidagi kerakli joyga barmoq bilan teging.",
    },
    guideTitle: { ru: 'Считай справа', uz: "O'ngdan sanang" },
    guideText: {
      ru: 'Поставь палец на крайнюю правую цифру. Считай: один, два, три — и коснись промежутка перед третьей цифрой.',
      uz: "Barmog'ingizni eng o'ngdagi raqamga qo'ying. Bir, ikki, uch deb sanang va uchinchi raqam oldidagi oraliqqa teging.",
    },
    instruction: {
      ru: 'Промежуток → «Проверить».',
      uz: 'Oraliq → «Tekshirish».',
    },
    correctText: {
      ru: 'Верно. Справа отсчитаны 6, 0, 5. Граница стоит перед этой тройкой: 73 | 506.',
      uz: "To'g'ri. O'ngdan 6, 0, 5 sanaldi. Chegara shu uchlik oldida: 73 | 506.",
    },
    wrongText: {
      ru: 'Пока не здесь. Верни палец к правой цифре и медленно отсчитай ровно три позиции.',
      uz: "Hozircha bu joy emas. Barmog'ingizni o'ngdagi raqamga qaytaring va sekin roppa-rosa uchta o'rin sanang.",
    },
    audio: {
      ru: [
        'Теперь ты сам поставишь границу, как в настоящей записи числа.',
        'Положи палец на крайнюю правую цифру шесть. Это первая позиция. Двигайся влево: ноль — вторая, пять — третья.',
        'После третьей позиции коснись промежутка перед ней. Готового варианта на экране нет: место выбираешь ты.',
      ],
      uz: [
        "Endi haqiqiy son yozuvidagidek chegarani o'zingiz qo'yasiz.",
        "Barmog'ingizni eng o'ngdagi 6 raqamiga qo'ying. Bu birinchi o'rin. Chapga yuring: 0 ikkinchi, 5 uchinchi.",
        "Uchinchi o'rindan keyin uning oldidagi oraliqqa teging. Ekranda tayyor variant yo'q: joyni o'zingiz tanlaysiz.",
      ],
    },
  },

  dividerIndependent: {
    eyebrow: { ru: 'Самостоятельная практика', uz: 'Mustaqil mashq' },
    title: { ru: 'Поставь границу: 348216', uz: "Chegarani qo'ying: 348216" },
    raw: '348216',
    correctGap: 3,
    result: '348 | 216',
    lead: {
      ru: 'Теперь без счётных меток. Поставь границу пальцем и объясни себе, почему она именно там.',
      uz: "Endi sanash belgilarisiz. Chegarani barmoq bilan qo'ying va nima uchun aynan shu joydaligini o'zingizga tushuntiring.",
    },
    instruction: {
      ru: 'Справа 3 цифры → промежуток.',
      uz: "O'ngdan 3 raqam → oraliq.",
    },
    correctText: {
      ru: 'Верно. Ты самостоятельно построил два класса: 348 | 216.',
      uz: "To'g'ri. Siz mustaqil ravishda ikkita sinf tuzdingiz: 348 | 216.",
    },
    wrongText: {
      ru: 'Граница сместилась. Не считай слева: вернись к последней цифре и возьми справа ровно три.',
      uz: "Chegara siljidi. Chapdan sanamang: oxirgi raqamga qayting va o'ngdan roppa-rosa uchtasini oling.",
    },
    audio: {
      ru: [
        'Правило собрано. Проверим, можешь ли ты выполнить главное действие без готовых вариантов.',
        'Перед тобой код триста сорок восемь тысяч двести шестнадцать без пробела. Начни с крайней правой цифры и отсчитай три позиции.',
        'Коснись только одного промежутка. После проверки назови правый и левый классы.',
      ],
      uz: [
        "Qoida yig'ildi. Asosiy harakatni tayyor variantlarsiz bajara olishingizni tekshiramiz.",
        "Oldingizda bo'shliqsiz 348216 kodi turibdi. Eng o'ngdagi raqamdan boshlang va uchta o'rinni sanang.",
        "Faqat bitta oraliqqa teging. Tekshirgach, o'ng va chap sinflarni nomlang.",
      ],
    },
  },

  rapidTest: {
    eyebrow: { ru: 'Единый быстрый тест', uz: 'Yagona tezkor test' },
    title: { ru: 'Блиц: 4 вопроса', uz: 'Blits: 4 savol' },
    lead: {
      ru: 'Отвечай быстро, но не угадывай. После ответа следующий вопрос откроется здесь же.',
      uz: "Tez javob bering, ammo taxmin qilmang. Javobdan keyin keyingi savol shu yerning o'zida ochiladi.",
    },
    progressLabel: { ru: 'Блиц-панель', uz: 'Blits paneli' },
    completionText: { ru: 'Блиц завершён. Все четыре решения собраны.', uz: "Blits tugadi. To'rtta yechim ham yig'ildi." },
    audio: {
      ru: [
        'Теперь четыре коротких проверки пройдут на одном экране, без лишних переходов.',
        'В каждом вопросе сначала найди нужный класс или разряд, и только затем выбирай ответ.',
        'После реакции Бита нажимай кнопку следующего вопроса. Результат первой попытки сохранится для награды.',
      ],
      uz: [
        "Endi to'rtta qisqa tekshiruv ortiqcha o'tishlarsiz bitta ekranda o'tadi.",
        "Har bir savolda avval kerakli sinf yoki xonani toping, keyin javobni tanlang.",
        "Bitning javobidan keyin keyingi savol tugmasini bosing. Birinchi urinish natijasi mukofot uchun saqlanadi.",
      ],
    },
  },

  // Revised explanation sequence: two methods, a bonus case, then independent practice.
  method1: {
    eyebrow: { ru: 'Способ 1 · считаем справа', uz: "1-usul · o'ngdan sanaymiz" },
    title: { ru: 'Способ 1. Считаем справа', uz: "1-usul. O'ngdan sanaymiz" },
    digits: ['6', '3', '0', '4'],
    boundaryAfter: 0,
    showTable: false,
    leftRevealPhase: 3,
    methodBadge: { ru: 'Способ 1 · по три разряда', uz: '1-usul · uchtadan xona' },
    explanationLead: {
      ru: 'Сначала поймём, зачем нужен новый способ, и только затем медленно разберём число 6304.',
      uz: "Avval yangi usul nima uchun kerakligini tushunamiz, keyin 6304 sonini sekin tahlil qilamiz.",
    },
    interactionIntro: {
      ru: 'Перед тобой восемь карточек объяснения. Нажми первую карточку, затем открывай остальные по порядку. После каждого нажатия Бит объяснит один шаг.',
      uz: "Oldingizda sakkizta tushuntirish kartasi bor. Birinchi kartani bosing, keyin qolganlarini tartib bilan oching. Har bosganda Bit bitta qadamni tushuntiradi.",
    },
    startPrompt: {
      ru: 'Нажми карточку 1.',
      uz: '1-kartani bosing.',
    },
    explanationSteps: [
      {
        label: { ru: 'Новая трудность', uz: 'Yangi qiyinchilik' },
        shortText: { ru: 'До 999 — три разряда. Здесь цифр четыре.', uz: "999 gacha uch xona. Bu yerda to'rtta raqam." },
        text: {
          ru: 'До 999 нам хватало трёх знакомых разрядов: единиц, десятков и сотен. В числе 6304 появилась четвёртая цифра. Нужен способ понять её место, не меняя запись.',
          uz: "999 gacha uchta tanish xona yetarli edi: birlar, o'nlar va yuzlar. 6304 sonida to'rtinchi raqam paydo bo'ldi. Yozuvni o'zgartirmasdan uning o'rnini tushunish usuli kerak.",
        },
        visualPhase: 0,
      },
      {
        label: { ru: 'Тройка разрядов', uz: 'Uchta xona' },
        shortText: { ru: 'Разряды объединяются по три.', uz: 'Xonalar uchtadan birlashadi.' },
        text: {
          ru: 'Математическая система не придумывает новое правило для каждой цифры. Она снова собирает знакомый блок из единиц, десятков и сотен, а затем начинает следующий блок.',
          uz: "Matematik tizim har bir raqam uchun yangi qoida o'ylab topmaydi. U tanish birlar, o'nlar va yuzlar blokini yana yig'adi, keyin keyingi blokni boshlaydi.",
        },
        visualPhase: 0,
      },
      {
        label: { ru: 'Старт справа', uz: "O'ngdan boshlaymiz" },
        shortText: { ru: 'Точка отсчёта — справа.', uz: "Boshlanish — o'ngda." },
        text: {
          ru: 'Крайняя правая цифра любого целого числа всегда означает единицы. Поэтому справа есть точная точка отсчёта, а слева длина числа может быть разной.',
          uz: "Har qanday butun sonning eng o'ngdagi raqami doimo birlarni bildiradi. Shuning uchun o'ngda aniq boshlanish nuqtasi bor, chap tomondagi uzunlik esa turlicha bo'lishi mumkin.",
        },
        visualPhase: 0,
      },
      {
        label: { ru: 'Ед. · дес. · сот.', uz: "Bir · o'n · yuz" },
        shortText: { ru: '4 ед. · 0 дес. · 3 сот.', uz: "4 bir · 0 o'n · 3 yuz." },
        text: {
          ru: 'Начинаем с 4 единиц, затем видим 0 десятков и 3 сотни. Ноль не пропускаем: он показывает пустой разряд десятков и сохраняет место тройки.',
          uz: "4 birlikdan boshlaymiz, keyin 0 o'nlik va 3 yuzlikni ko'ramiz. Nolni tashlab yubormaymiz: u bo'sh o'nlar xonasini va uchlik o'rnini saqlaydi.",
        },
        visualPhase: 1,
      },
      {
        label: { ru: 'Класс единиц', uz: 'Birlar sinfi' },
        shortText: { ru: '304 — класс единиц.', uz: '304 — birlar sinfi.' },
        text: {
          ru: 'Три разряда справа — сотни, десятки и единицы — образовали 304. Эту законченную тройку называем классом единиц.',
          uz: "O'ngdagi uchta xona — yuzlar, o'nlar va birlar — 304 ni hosil qildi. Bu tugallangan uchlik birlar sinfi deb ataladi.",
        },
        visualPhase: 1,
      },
      {
        label: { ru: 'Граница', uz: 'Chegara' },
        shortText: { ru: '6304 → 6 | 304', uz: '6304 → 6 | 304' },
        text: {
          ru: 'После третьего разряда ставим границу. Мы не меняем порядок цифр, а только показываем устройство числа.',
          uz: "Uchinchi xonadan keyin chegara qo'yamiz. Raqamlar tartibini o'zgartirmaymiz, faqat sonning tuzilishini ko'rsatamiz.",
        },
        visualPhase: 2,
      },
      {
        label: { ru: 'Класс тысяч', uz: 'Minglar sinfi' },
        shortText: { ru: '6 — это 6 тысяч.', uz: '6 — bu 6 ming.' },
        text: {
          ru: 'Слева осталась цифра 6. После полной тройки она уже не сотни, а шесть единиц следующего класса — шесть тысяч. Это класс тысяч.',
          uz: "Chapda 6 raqami qoldi. To'liq uchlikdan keyin u yuzlik emas, keyingi sinfning olti birligi, ya'ni olti ming bo'ladi. Bu minglar sinfi.",
        },
        visualPhase: 3,
      },
      {
        label: { ru: 'Чтение', uz: "O'qish" },
        shortText: { ru: '6 | 304 читаем по классам.', uz: "6 | 304 ni sinflar bo'yicha o'qiymiz." },
        text: {
          ru: 'Читаем слева направо: шесть тысяч триста четыре. Слово «тысяч» подтверждает левый класс, а 304 читается как обычное трёхзначное число.',
          uz: "Chapdan o'ngga o'qiymiz: olti ming uch yuz to'rt. «Ming» so'zi chap sinfni tasdiqlaydi, 304 esa odatiy uch xonali son kabi o'qiladi.",
        },
        visualPhase: 3,
      },
    ],
    resultText: {
      ru: 'Справа → по 3 разряда → граница.',
      uz: "O'ngdan → 3 xona → chegara.",
    },
    replayLabel: { ru: 'Повторить способ', uz: 'Usulni takrorlash' },
    audio: {
      ru: [
        'До числа девятьсот девяносто девять нам хватало единиц, десятков и сотен. В числе шесть тысяч триста четыре появилась четвёртая цифра. Нужно определить её место, не переставляя цифры.',
        'Система разрядов повторяется блоками. Сначала собираются знакомые единицы, десятки и сотни. После этого начинается следующий такой блок, только уже для тысяч.',
        'Надёжная точка отсчёта находится справа. Крайняя правая цифра любого целого числа всегда показывает единицы, поэтому разбор начинаем именно от неё.',
        'Четыре — единицы. Слева от неё ноль десятков и три сотни. Ноль не исчезает: он удерживает пустой разряд десятков.',
        'Сотни, десятки и единицы вместе дали группу триста четыре. Это первая тройка справа, поэтому она называется классом единиц.',
        'После третьего разряда ставим границу. Порядок цифр не меняется, мы только показываем строение числа.',
        'Слева осталась цифра шесть. После полной тройки она означает шесть тысяч и открывает следующий блок — класс тысяч.',
        'Проверяем результат чтением слева направо: шесть тысяч триста четыре. Слово тысяч подтверждает место левой цифры.',
      ],
      uz: [
        "999 sonigacha birlar, o'nlar va yuzlar yetarli edi. 6304 sonida to'rtinchi raqam paydo bo'ldi. Raqamlarni almashtirmasdan uning o'rnini aniqlash kerak.",
        "Xonalar tizimi bloklar bo'yicha takrorlanadi. Avval tanish birlar, o'nlar va yuzlar yig'iladi. Shundan keyin minglar uchun keyingi blok boshlanadi.",
        "Ishonchli boshlanish nuqtasi o'ngda. Har qanday butun sonning eng o'ngdagi raqami birlarni ko'rsatadi, shuning uchun tahlilni aynan undan boshlaymiz.",
        "4 birlar, uning chapida 0 o'nlar va 3 yuzlar turadi. Nol yo'qolmaydi: u bo'sh o'nlar xonasini saqlaydi.",
        "Yuzlar, o'nlar va birlar birgalikda 304 guruhini berdi. Bu o'ngdagi birinchi uchlik, shuning uchun u birlar sinfi deb ataladi.",
        "Uchinchi xonadan keyin chegara qo'yamiz. Raqamlar tartibi o'zgarmaydi, faqat sonning tuzilishi ko'rinadi.",
        "Chapda 6 raqami qoldi. To'liq uchlikdan keyin u olti mingni bildiradi va keyingi blok — minglar sinfini ochadi.",
        "Natijani chapdan o'ngga o'qib tekshiramiz: olti ming uch yuz to'rt. Ming so'zi chap raqamning o'rnini tasdiqlaydi.",
      ],
    },
  },
  method2: {
    eyebrow: { ru: 'Способ 2 · таблица классов', uz: '2-usul · sinflar jadvali' },
    title: { ru: 'Способ 2. Таблица классов', uz: '2-usul. Sinflar jadvali' },
    digits: ['4', '8', '2', '0', '1', '9'],
    boundaryAfter: 2,
    showTable: true,
    tableTransfer: true,
    methodBadge: { ru: 'Способ 2 · таблица мест', uz: "2-usul · o'rinlar jadvali" },
    explanationLead: {
      ru: 'Таблица — это карта мест. Сначала все клетки пусты, затем каждая цифра медленно переходит в свой разряд.',
      uz: "Jadval o'rinlar xaritasidir. Avval barcha kataklar bo'sh, keyin har bir raqam sekin o'z xonasiga o'tadi.",
    },
    interactionIntro: {
      ru: 'Теперь ты управляешь таблицей. Нажимай карточки по порядку: Бит объяснит действие, а цифры плавно перейдут в нужные клетки.',
      uz: "Endi jadvalni siz boshqarasiz. Kartalarni tartib bilan bosing: Bit harakatni tushuntiradi, raqamlar esa kerakli kataklarga sekin o'tadi.",
    },
    startPrompt: {
      ru: 'Нажми карточку 1.',
      uz: '1-kartani bosing.',
    },
    explanationSteps: [
      {
        label: { ru: 'Пустые клетки', uz: "Bo'sh kataklar" },
        shortText: { ru: 'Два класса — шесть мест.', uz: "Ikki sinf — oltita o'rin." },
        text: {
          ru: 'Пока не переносим ни одной цифры. Рассматриваем шесть пустых клеток: справа три места класса единиц, слева три места класса тысяч.',
          uz: "Hozircha hech bir raqamni ko'chirmaymiz. Oltita bo'sh katakni ko'ramiz: o'ngda birlar sinfining uch o'rni, chapda minglar sinfining uch o'rni.",
        },
        visualPhase: 0,
      },
      {
        label: { ru: 'Справа: 019', uz: "O'ngda: 019" },
        shortText: { ru: '019 — класс единиц.', uz: '019 — birlar sinfi.' },
        text: {
          ru: 'Ставим 9 в единицы, 1 в десятки, 0 в сотни. Получился класс единиц 019.',
          uz: "9 ni birlarga, 1 ni o'nlarga, 0 ni yuzlarga qo'yamiz. 019 birlar sinfi hosil bo'ldi.",
        },
        visualPhase: 1,
      },
      {
        label: { ru: 'Слева: 482', uz: 'Chapda: 482' },
        shortText: { ru: '482 — класс тысяч.', uz: '482 — minglar sinfi.' },
        text: {
          ru: 'Следующие цифры занимают разряды тысяч: 2 тысячи, 8 десятков тысяч и 4 сотни тысяч.',
          uz: "Keyingi raqamlar minglar xonalarini egallaydi: 2 minglik, 8 o'n minglik va 4 yuz minglik.",
        },
        visualPhase: 2,
      },
      {
        label: { ru: 'Ноль', uz: 'Nol' },
        shortText: { ru: 'Ноль держит сотни.', uz: 'Nol yuzlar o‘rnini saqlaydi.' },
        text: {
          ru: 'Ноль в разряде сотен нельзя убирать. Иначе цифры 1 и 9 сдвинутся и число изменится.',
          uz: "Yuzlar xonasidagi nolni olib tashlab bo'lmaydi. Aks holda 1 va 9 siljiydi va son o'zgaradi.",
        },
        visualPhase: 3,
      },
      {
        label: { ru: 'Чтение', uz: "O'qish" },
        shortText: { ru: '482 | 019', uz: '482 | 019' },
        text: {
          ru: 'Сначала читаем 482 тысячи. Затем 019 читаем как девятнадцать: четыреста восемьдесят две тысячи девятнадцать.',
          uz: "Avval 482 mingni o'qiymiz. Keyin 019 ni o'n to'qqiz deb o'qiymiz: to'rt yuz sakson ikki ming o'n to'qqiz.",
        },
        visualPhase: 3,
      },
    ],
    resultText: {
      ru: 'Таблицу заполняем справа налево.',
      uz: "Jadvalni o'ngdan chapga to'ldiramiz.",
    },
    replayLabel: { ru: 'Повторить способ', uz: 'Usulni takrorlash' },
    audio: {
      ru: [
        'Второй способ нужен, когда важно проверить место каждой цифры. Перед нами таблица из двух блоков по три разряда. Сейчас все шесть клеток пусты, а цифры находятся над таблицей.',
        'Начинаем заполнение справа, потому что там находится разряд единиц. Девять плавно переходит в единицы, один — в десятки, ноль — в сотни. Так собирается правый класс ноль один девять.',
        'Не меняя направления, продолжаем в классе тысяч. Два переходит в единицы тысяч, восемь — в десятки тысяч, четыре — в сотни тысяч.',
        'Ноль в разряде сотен нельзя пропускать. Он удерживает остальные цифры на правильных местах.',
        'Читаем классы слева направо: четыреста восемьдесят две тысячи девятнадцать.',
      ],
      uz: [
        "Ikkinchi usul har bir raqam o'rnini tekshirish kerak bo'lganda qo'llanadi. Oldimizda uchtadan xonali ikkita blok bor. Hozir oltita katakning hammasi bo'sh, raqamlar esa jadval ustida turibdi.",
        "To'ldirishni o'ngdan boshlaymiz, chunki u yerda birlar xonasi bor. 9 sekin birlarga, 1 o'nlarga, 0 yuzlarga o'tadi. Shunday qilib 019 o'ng sinfi yig'iladi.",
        "Yo'nalishni o'zgartirmasdan minglar sinfida davom etamiz. 2 bir minglarga, 8 o'n minglarga, 4 yuz minglarga o'tadi.",
        "Yuzlar xonasidagi nolni tashlab yuborib bo'lmaydi. U boshqa raqamlarni to'g'ri o'rinda ushlab turadi.",
        "Sinflarni chapdan o'ngga o'qiymiz: to'rt yuz sakson ikki ming o'n to'qqiz.",
      ],
    },
  },
  bonus: {
    eyebrow: { ru: 'Бонус · секрет нулей', uz: 'Bonus · nollar siri' },
    title: { ru: 'Бонус. Нули в числе', uz: 'Bonus. Sondagi nollar' },
    digits: ['2', '0', '4', '0', '0', '6'],
    boundaryAfter: 2,
    showTable: true,
    methodBadge: { ru: 'Бонус · ноль держит место', uz: "Bonus · nol o'rinni saqlaydi" },
    explanationLead: {
      ru: 'На числе 204006 увидим разницу между записью числа и его чтением.',
      uz: "204006 sonida sonning yozilishi va o'qilishi orasidagi farqni ko'ramiz.",
    },
    interactionIntro: {
      ru: 'В бонусе пять карточек. Открывай их по порядку: Бит покажет, почему нули нужны в записи, даже когда мы их не произносим.',
      uz: "Bonusda beshta karta bor. Ularni tartib bilan oching: Bit nollar aytilmasa ham yozuvda nega kerakligini ko'rsatadi.",
    },
    startPrompt: {
      ru: 'Нажми карточку 1.',
      uz: '1-kartani bosing.',
    },
    explanationSteps: [
      {
        label: { ru: 'Делим', uz: 'Ajratamiz' },
        shortText: { ru: '204006 → 204 | 006', uz: '204006 → 204 | 006' },
        text: {
          ru: 'Не пытайся сразу прочитать число. Отсчитай справа три позиции, сохраняя все цифры.',
          uz: "Sonni darhol o'qishga urinmang. Barcha raqamlarni saqlab, o'ngdan uchta o'rinni sanang.",
        },
        visualPhase: 0,
      },
      {
        label: { ru: 'Группа 006', uz: '006 guruhi' },
        shortText: { ru: '006: 0 сот. · 0 дес. · 6 ед.', uz: "006: 0 yuz · 0 o'n · 6 bir." },
        text: {
          ru: 'В правом классе 0 сотен, 0 десятков и 6 единиц. В записи нужны все три позиции.',
          uz: "O'ng sinfda 0 yuzlik, 0 o'nlik va 6 birlik bor. Yozuvda uchala o'rin ham kerak.",
        },
        visualPhase: 1,
      },
      {
        label: { ru: 'Группа 204', uz: '204 guruhi' },
        shortText: { ru: '204 — класс тысяч.', uz: '204 — minglar sinfi.' },
        text: {
          ru: 'В левом классе 2 сотни тысяч, 0 десятков тысяч и 4 тысячи. Ноль снова удерживает место.',
          uz: "Chap sinfda 2 yuz minglik, 0 o'n minglik va 4 minglik bor. Nol yana o'rinni saqlaydi.",
        },
        visualPhase: 2,
      },
      {
        label: { ru: 'Нули', uz: 'Nollar' },
        shortText: { ru: 'Нули пишем, но не читаем.', uz: "Nollarni yozamiz, o'qimaymiz." },
        text: {
          ru: 'При чтении не говорим «ноль десятков тысяч» или «ноль сотен». Нули видны в записи, но не произносятся.',
          uz: "O'qishda «nol o'n minglik» yoki «nol yuzlik» demaymiz. Nollar yozuvda ko'rinadi, ammo aytilmaydi.",
        },
        visualPhase: 3,
      },
      {
        label: { ru: 'Чтение', uz: "O'qish" },
        shortText: { ru: '204 | 006', uz: '204 | 006' },
        text: {
          ru: 'Получаем: двести четыре тысячи шесть. Нули сохранили структуру, хотя мы их не произнесли.',
          uz: "Natija: ikki yuz to'rt ming olti. Nollar aytilmasa ham tuzilishni saqladi.",
        },
        visualPhase: 3,
      },
    ],
    resultText: {
      ru: 'Ноль пишем, пустой разряд не читаем.',
      uz: "Nolni yozamiz, bo'sh xonani o'qimaymiz.",
    },
    replayLabel: { ru: 'Повторить бонус', uz: 'Bonusni takrorlash' },
    audio: {
      ru: [
        'Бонусный разбор посвятим нулям. Сначала не читаем число, а спокойно делим запись справа по три разряда.',
        'В классе единиц ноль сотен, ноль десятков и шесть единиц. Поэтому сохраняем запись ноль ноль шесть.',
        'В классе тысяч две сотни тысяч, ноль десятков тысяч и четыре тысячи. Средний ноль удерживает место.',
        'При чтении пустые разряды не произносим, но в записи нули обязательно сохраняем.',
        'Получается: двести четыре тысячи шесть. Запись и чтение выглядят по-разному, но обозначают одно число.',
      ],
      uz: [
        "Bonus tushuntirish nollarga bag'ishlanadi. Avval sonni o'qimaymiz, yozuvni xotirjam o'ngdan uchtadan ajratamiz.",
        "Birlar sinfida nol yuzlik, nol o'nlik va olti birlik bor. Shuning uchun 006 yozuvini saqlaymiz.",
        "Minglar sinfida ikki yuz minglik, nol o'n minglik va to'rt minglik bor. O'rtadagi nol o'rinni saqlaydi.",
        "O'qishda bo'sh xonalarni aytmaymiz, ammo yozuvda nollarni albatta saqlaymiz.",
        "Natija: ikki yuz to'rt ming olti. Yozuv va o'qilish turlicha ko'rinsa ham, bitta sonni bildiradi.",
      ],
    },
  },
  trainer: {
    eyebrow: { ru: 'Тренажёр с Битом', uz: 'Bit bilan trenajyor' },
    title: { ru: 'Самостоятельно раздели код 73506', uz: '73506 kodini mustaqil ajrating' },
    digits: ['7', '3', '5', '0', '6'],
    boundaryAfter: 1,
    resultCode: '73 | 506',
    trainerLead: {
      ru: 'Это новое число. Бит задаёт один вопрос за раз и не показывает следующий ответ заранее.',
      uz: "Bu yangi son. Bit har safar bitta savol beradi va keyingi javobni oldindan ko'rsatmaydi.",
    },
    trainerSteps: [
      {
        prompt: { ru: 'Шаг 1 из 4. С какого края начнёшь отсчёт?', uz: "4 qadamdan 1-qadam. Sanashni qaysi chetdan boshlaysiz?" },
        options: [
          { ru: 'слева, с цифры 7', uz: 'chapdan, 7 raqamidan' },
          { ru: 'справа, с цифры 6', uz: "o'ngdan, 6 raqamidan" },
          { ru: 'из середины, с цифры 5', uz: "o'rtadan, 5 raqamidan" },
        ],
        correctIndex: 1,
        correctText: { ru: 'Верно. Справа находится постоянная точка отсчёта — разряд единиц.', uz: "To'g'ri. O'ng tomonda doimiy boshlanish nuqtasi — birlar xonasi bor." },
        hint: { ru: 'Вспомни, где у любого целого числа расположен разряд единиц.', uz: "Har qanday butun sonda birlar xonasi qayerda turishini eslang." },
      },
      {
        prompt: { ru: 'Шаг 2 из 4. Какие три цифры образуют первую группу?', uz: '4 qadamdan 2-qadam. Qaysi uchta raqam birinchi guruhni hosil qiladi?' },
        options: [{ ru: '506', uz: '506' }, { ru: '350', uz: '350' }, { ru: '735', uz: '735' }],
        correctIndex: 0,
        correctText: { ru: 'Верно. От правого края отсчитаны ровно три позиции.', uz: "To'g'ri. O'ng chetdan roppa-rosa uchta o'rin sanaldi." },
        hint: { ru: 'Поставь палец на последнюю цифру и отсчитай три позиции влево.', uz: "Barmog'ingizni oxirgi raqamga qo'ying va chapga uchta o'rin sanang." },
      },
      {
        prompt: { ru: 'Шаг 3 из 4. Как называется первая группа справа?', uz: "4 qadamdan 3-qadam. O'ngdagi birinchi guruh qanday ataladi?" },
        options: [
          { ru: 'класс тысяч', uz: 'minglar sinfi' },
          { ru: 'класс единиц', uz: 'birlar sinfi' },
          { ru: 'разряд сотен', uz: 'yuzlar xonasi' },
        ],
        correctIndex: 1,
        correctText: { ru: 'Да. Первая тройка справа всегда образует класс единиц.', uz: "Ha. O'ngdagi birinchi uchlik doimo birlar sinfini hosil qiladi." },
        hint: { ru: 'В этой группе находятся обычные сотни, десятки и единицы.', uz: "Bu guruhda oddiy yuzlar, o'nlar va birlar joylashgan." },
      },
      {
        prompt: { ru: 'Шаг 4 из 4. Как правильно описать оставшуюся часть?', uz: "4 qadamdan 4-qadam. Qolgan qismni qanday to'g'ri tariflaysiz?" },
        options: [
          { ru: '73 — класс тысяч', uz: '73 — minglar sinfi' },
          { ru: '73 — класс единиц', uz: '73 — birlar sinfi' },
          { ru: '735 — класс тысяч', uz: '735 — minglar sinfi' },
        ],
        correctIndex: 0,
        correctText: { ru: 'Верно. Левая неполная группа тоже является классом тысяч.', uz: "To'g'ri. Chapdagi to'liq bo'lmagan guruh ham minglar sinfidir." },
        hint: { ru: 'Слева может остаться одна, две или три цифры. Границу не переносим.', uz: "Chapda bitta, ikkita yoki uchta raqam qolishi mumkin. Chegarani ko'chirmaymiz." },
      },
    ],
    doneText: {
      ru: 'Готово: 73 | 506. Ты применил правило к новому числу, не копируя пример.',
      uz: "Tayyor: 73 | 506. Siz qoidani misoldan ko'chirmasdan yangi songa qo'lladingiz.",
    },
    audio: {
      ru: [
        'Перед тобой новый пятизначный код. Не ищи ответ в предыдущих примерах — примени общее правило.',
        'Работай по одному шагу. Сначала выбери точку отсчёта, затем собери группу и назови классы.',
      ],
      uz: [
        "Oldingizda yangi besh xonali kod. Javobni oldingi misollardan qidirmang, umumiy qoidani qo'llang.",
        "Bitta qadamdan ishlang. Avval boshlanish nuqtasini tanlang, keyin guruhni tuzing va sinflarni nomlang.",
      ],
    },
  },
  quick11: {
    eyebrow: { ru: 'Быстрый тест · 1 из 4', uz: 'Tezkor test · 4 dan 1' },
    title: { ru: 'Найди класс единиц', uz: 'Birlar sinfini toping' },
    quickLabel: { ru: 'Реши без таблицы', uz: 'Jadvalsiz yeching' },
    quickNumber: '91406',
    question: { ru: 'Какая группа образует класс единиц?', uz: 'Qaysi guruh birlar sinfini hosil qiladi?' },
    options: ['406', '914', '140'],
    correctIndex: 0,
    correctText: {
      ru: 'Верно. Три цифры справа образуют класс единиц: 406.',
      uz: "To'g'ri. O'ngdagi uchta raqam birlar sinfini hosil qiladi: 406.",
    },
    proof: { ru: '91 | 406', uz: '91 | 406' },
    proofLabel: { ru: '406 — первая тройка справа, класс единиц', uz: '406 — o‘ngdagi birinchi uchlik, birlar sinfi' },
    wrong: [
      null,
      { ru: '914 находится слева. Сначала отсчитай три цифры от правого края.', uz: "914 chapda turibdi. Avval o'ng chetdan uchta raqamni sanang." },
      { ru: 'Цифры нельзя переставлять. Сохрани исходный порядок.', uz: "Raqamlarni almashtirib bo'lmaydi. Dastlabki tartibni saqlang." },
    ],
    audio: {
      intro: { ru: 'Первый быстрый тест. Определи класс единиц в новом числе.', uz: 'Birinchi tezkor test. Yangi sondagi birlar sinfini aniqlang.' },
      on_correct: { ru: 'Точно. Первая группа справа найдена.', uz: "Aniq. O'ngdagi birinchi guruh topildi." },
      on_wrong: { ru: 'Вспомни постоянную точку отсчёта справа.', uz: "O'ngdagi doimiy boshlanish nuqtasini eslang." },
    },
  },
  quick12: {
    eyebrow: { ru: 'Быстрый тест · 2 из 4', uz: 'Tezkor test · 4 dan 2' },
    title: { ru: 'Сколько полных тысяч?', uz: "Nechta to'liq ming bor?" },
    quickLabel: { ru: 'Смотри на нужный класс', uz: 'Kerakli sinfga qarang' },
    quickNumber: '307025',
    question: { ru: 'Сколько полных тысяч содержит число?', uz: "Son nechta to'liq mingni o'z ichiga oladi?" },
    options: ['25', '307', '307 025'],
    correctIndex: 1,
    correctText: {
      ru: 'Верно. Левая группа 307 показывает 307 полных тысяч.',
      uz: "To'g'ri. Chapdagi 307 guruhi 307 ta to'liq mingni ko'rsatadi.",
    },
    proof: { ru: '307 | 025 → 307 полных тысяч', uz: '307 | 025 → 307 ta to‘liq ming' },
    proofLabel: { ru: 'Ответ даёт группа слева от границы', uz: 'Javobni chegaraning chapidagi guruh beradi' },
    wrong: [
      { ru: '25 относится к правому классу. Нужна группа слева от границы.', uz: "25 o'ng sinfga tegishli. Chegaraning chapidagi guruh kerak." },
      null,
      { ru: 'Это всё число, а вопрос только о количестве полных тысяч.', uz: "Bu butun son, savol esa faqat to'liq minglar soni haqida." },
    ],
    audio: {
      intro: { ru: 'Второй быстрый тест. Найди количество полных тысяч, не разбирая каждый разряд.', uz: "Ikkinchi tezkor test. Har bir xonani ajratmasdan to'liq minglar sonini toping." },
      on_correct: { ru: 'Верно. Нужный класс дал ответ сразу.', uz: "To'g'ri. Kerakli sinf javobni darhol berdi." },
      on_wrong: { ru: 'Ищи ответ в группе класса тысяч.', uz: 'Javobni minglar sinfi guruhidan qidiring.' },
    },
  },
  quick13: {
    eyebrow: { ru: 'Быстрый тест · 3 из 4', uz: 'Tezkor test · 4 dan 3' },
    title: { ru: 'Проверь разрядную сумму', uz: 'Xona yig‘indisini tekshiring' },
    quickLabel: { ru: 'Нули тоже занимают места', uz: "Nollar ham o'rin egallaydi" },
    quickNumber: '708215',
    question: { ru: 'Какая сумма точно описывает число?', uz: 'Qaysi yig‘indi sonni aniq ifodalaydi?' },
    optionLayout: 'single-column',
    options: [
      '700 000 + 8 000 + 200 + 10 + 5',
      '70 000 + 8 000 + 200 + 10 + 5',
      '700 000 + 80 000 + 200 + 10 + 5',
    ],
    correctIndex: 0,
    correctText: {
      ru: 'Верно. Ноль удерживает разряд десятков тысяч, поэтому 8 означает 8 000.',
      uz: "To'g'ri. Nol o'n minglar xonasini saqlaydi, shuning uchun 8 raqami 8 000 ni bildiradi.",
    },
    proof: { ru: '708 | 215 = 700 000 + 8 000 + 200 + 10 + 5', uz: '708 | 215 = 700 000 + 8 000 + 200 + 10 + 5' },
    proofLabel: { ru: 'Ноль сохранил место десятков тысяч', uz: 'Nol o‘n minglar xonasini saqladi' },
    wrong: [
      null,
      { ru: 'В этой записи 7 оказалось в десятках тысяч. Проверь первую цифру числа.', uz: "Bu yozuvda 7 o'n minglar xonasiga tushib qoldi. Sonning birinchi raqamini tekshiring." },
      { ru: 'Ноль не позволяет восьмёрке перейти в десятки тысяч. Проверь её столбец.', uz: "Nol 8 raqamining o'n minglarga o'tishiga yo'l qo'ymaydi. Uning ustunini tekshiring." },
    ],
    audio: {
      intro: { ru: 'Третий быстрый тест. Проверь разрядную сумму числа с внутренним нулём.', uz: "Uchinchi tezkor test. Ichki noli bor sonning xona yig'indisini tekshiring." },
      on_correct: { ru: 'Отлично. Все ненулевые разряды названы точно.', uz: "Ajoyib. Noldan boshqa barcha xonalar aniq aytildi." },
      on_wrong: { ru: 'Поставь число в шесть разрядных столбцов и проверь каждое слагаемое.', uz: "Sonni oltita xona ustuniga joylashtirib, har bir qo'shiluvchini tekshiring." },
    },
  },
  quick14: {
    eyebrow: { ru: 'Финальный блиц · 4 из 4', uz: 'Yakuniy blits · 4 dan 4' },
    title: { ru: 'Определи значение цифры', uz: 'Raqam qiymatini aniqlang' },
    quickLabel: { ru: 'Финальный вопрос', uz: 'Yakuniy savol' },
    quickNumber: '164209',
    highlightIndex: 1,
    question: { ru: 'Каково значение выделенной цифры 6?', uz: 'Ajratilgan 6 raqamining qiymati qancha?' },
    options: ['6 000', '60 000', '600 000'],
    correctIndex: 1,
    correctText: {
      ru: 'Верно. Цифра 6 стоит в разряде десятков тысяч, поэтому её значение — 60 000.',
      uz: "To'g'ri. 6 raqami o'n minglar xonasida turadi, shuning uchun uning qiymati 60 000.",
    },
    proof: { ru: '6 × 10 000 = 60 000', uz: '6 × 10 000 = 60 000' },
    proofLabel: { ru: '6 стоит в разряде десятков тысяч', uz: '6 o‘n minglar xonasida turadi' },
    wrong: [
      { ru: '6 000 получилось бы в разряде единиц тысяч. Проверь место цифры.', uz: "6 000 bir minglar xonasida bo'lardi. Raqam o'rnini tekshiring." },
      null,
      { ru: '600 000 требует разряда сотен тысяч. Выделенная цифра стоит правее.', uz: "600 000 uchun yuz minglar xonasi kerak. Ajratilgan raqam o'ngroqda turibdi." },
    ],
    audio: {
      intro: { ru: 'Финальный блиц. Определи значение выделенной цифры по её месту.', uz: "Yakuniy blits. Ajratilgan raqam qiymatini uning o'rniga qarab aniqlang." },
      on_correct: { ru: 'Финальный ответ верный. Награда разблокирована.', uz: "Yakuniy javob to'g'ri. Mukofot ochildi." },
      on_wrong: { ru: 'Назови разряд выделенной цифры и умножь её на значение разряда.', uz: "Ajratilgan raqam xonasini ayting va uni xona qiymatiga ko'paytiring." },
    },
  },
  awards: [
    {
      min: 4,
      title: { ru: 'Архитектор многозначных чисел', uz: "Ko'p xonali sonlar me'mori" },
      text: { ru: 'Все быстрые тесты решены с первой попытки.', uz: "Barcha tezkor testlar birinchi urinishda yechildi." },
    },
    {
      min: 3,
      title: { ru: 'Мастер классов и разрядов', uz: 'Sinflar va xonalar ustasi' },
      text: { ru: 'Ты уверенно видишь структуру многозначного числа.', uz: "Siz ko'p xonali son tuzilishini ishonchli ko'rasiz." },
    },
    {
      min: 0,
      title: { ru: 'Исследователь числовых кодов', uz: 'Sonli kodlar tadqiqotchisi' },
      text: { ru: 'Основа освоена. Повтори правило и попробуй улучшить результат.', uz: "Asos o'zlashtirildi. Qoidani takrorlab, natijani yaxshilashga harakat qiling." },
    },
  ],
};

export const BRIDGES = {
  s1: { ru: 'Идея группировки найдена. Но сначала восстановим всю основу, даже если прошлые темы были давно.', uz: "Guruhlash g'oyasi topildi. Ammo avval, oldingi mavzular ancha oldin bo'lsa ham, butun asosni tiklaymiz." },
  s2: {
    ru: 'Разряды и роль нуля вспомнили. Теперь расширим знакомую тройку до классов и поймём, зачем это нужно.',
    uz: "Xonalar va nolning vazifasini esladik. Endi tanish uchlikni sinflargacha kengaytirib, buning sababini tushunamiz.",
  },
  s3: {
    ru: 'Первый способ дал границу счётом справа. Теперь проверим тот же принцип картой мест — сначала пустой таблицей.',
    uz: "Birinchi usul o'ngdan sanab chegarani berdi. Endi shu tamoyilni o'rinlar xaritasi, ya'ni avval bo'sh jadval bilan tekshiramiz.",
  },
  s4: {
    ru: 'Оба способа привели к одной структуре. Разберём особый случай, в котором нули легко потерять.',
    uz: "Ikkala usul ham bir xil tuzilishga olib keldi. Nollarni yo'qotish oson bo'lgan maxsus holatni ko'ramiz.",
  },
  s5: { ru: 'Наблюдение закончилось. Теперь не выбирай готовую запись — поставь границу собственным пальцем.', uz: "Kuzatish tugadi. Endi tayyor yozuvni tanlamang, chegarani o'z barmog'ingiz bilan qo'ying." },
  s6: { ru: 'Движение получилось. Проверим, понимаешь ли ты структуру числа с двумя внутренними нулями.', uz: "Harakat bajarildi. Endi ikkita ichki noli bor son tuzilishini tushunishingizni tekshiramiz." },
  s7: { ru: 'Нули удержали места. Теперь станем детективами и сравним значение одной цифры в двух числах.', uz: "Nollar o'rinlarni saqladi. Endi detektiv bo'lib, bir raqamning ikki sondagi qiymatini solishtiramiz." },
  s8: { ru: 'Значения найдены. Используем связь соседних разрядов, чтобы предсказать изменение без полного счёта.', uz: "Qiymatlar topildi. To'liq hisoblamasdan o'zgarishni aytish uchun qo'shni xonalar bog'lanishidan foydalanamiz." },
  s9: { ru: 'Исследование завершено. Соберём все выводы в одно точное правило.', uz: "Tadqiqot tugadi. Barcha xulosalarni bitta aniq qoidaga yig'amiz." },
  s10: { ru: 'Правило собрано. Докажи, что можешь применить его жестом без счётных меток.', uz: "Qoida yig'ildi. Uni sanash belgilarisiz barmoq harakati bilan qo'llay olishingizni isbotlang." },
  s11: { ru: 'Самостоятельная граница построена. Теперь четыре короткие проверки пройдут на одном экране.', uz: "Mustaqil chegara qurildi. Endi to'rtta qisqa tekshiruv bitta ekranda o'tadi." },
  s12: { ru: 'Блиц завершён. Перейдём от быстрых ответов к выбору самого эффективного способа.', uz: "Blits tugadi. Tez javoblardan eng samarali usulni tanlashga o'tamiz." },
  s13: { ru: 'Стратегия выбрана. Теперь проверь чужое решение и найди точную ошибку Бита.', uz: "Strategiya tanlandi. Endi begona yechimni tekshirib, Bitning aniq xatosini toping." },
  s14: { ru: 'Ошибка исправлена. Осталось применить разряды к настоящему городскому коду.', uz: "Xato tuzatildi. Endi xonalarni haqiqiy shahar kodiga qo'llash qoldi." },
  s15: { ru: 'Городской код восстановлен. Подведём итог, повторим правило и откроем математическое звание.', uz: "Shahar kodi tiklandi. Yakun yasab, qoidani takrorlaymiz va matematik unvonni ochamiz." },
};
