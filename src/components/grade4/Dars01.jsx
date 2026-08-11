import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

// ============================================================================
// 4-SINF ETALON · Dars01 · Ko'p xonali sonlar sinflari
// Pedagogy: investigate → formulate → apply → check → prove.
// Story: Lumo City, Data Center launch. Student is the mathematical expert.
// ============================================================================

const T = {
  bg: '#F5F5F0',
  ink: '#12212C',
  ink2: '#50616D',
  ink3: '#87949D',
  paper: '#FFFFFF',
  accent: '#FF5B35',
  accentSoft: '#FFF0EA',
  cyan: '#168FA3',
  cyanSoft: '#E5F5F6',
  navy: '#173B52',
  lime: '#95C93D',
  success: '#227A53',
  successSoft: '#E7F3EC',
  warn: '#A96F13',
  warnSoft: '#FFF5D9',
  shadowBase: '58, 53, 48',
};

// ---------------------------------------------------------------------------
// КОНТЕНТ УРОКА (RU + UZ + озвучка) лежит здесь же, а не отдельным файлом.
//
// Причина не в удобстве: ЛМС принимает урок ОДНИМ самодостаточным файлом без
// относительных импортов (lms-grade6-standalone/README.md). Пока контент жил
// в Dars01Content.js, урок физически нельзя было загрузить на площадку.
// ---------------------------------------------------------------------------
// 4-sinf Dars01 — approved CONTENT source.
// UZ terms were checked against the local 4-sinf textbook, pages 12–18.
const CONTENT = {
  s0: {
    eyebrow: { ru: 'Новая миссия', uz: 'Yangi missiya', en: "New mission" },
    topic: { ru: 'Тема урока: Классы многозначных чисел', uz: "Dars mavzusi: Ko'p xonali sonlar sinflari", en: "Theme of the lesson: Place-value groups in multi-digit numbers" },
    title: { ru: 'Новый адрес: 125407', uz: 'Yangi manzil: 125407', en: "New address: 125407" },
    lead: {
      ru: 'Bit получил код городского объекта, но видит только длинную цепочку цифр.',
      uz: "Bit shahar obyektining kodini oldi, lekin faqat uzun raqamlar qatorini ko'ryapti.",
      en: "Bit received the code of the city object, but sees only a long chain of numbers.",
    },
    numberRaw: '125407',
    question: { ru: 'Как показать структуру?', uz: "Tuzilishni qanday ko'rsatamiz?", en: "How do you show the structure?" },
    options: [
      { ru: 'Разделить на группы', uz: 'Guruhlarga ajratish', en: "Separate into groups" },
      { ru: 'Переставить цифры', uz: 'Raqamlarni almashtirish', en: "Move the numbers." },
      { ru: 'Удалить цифры', uz: "Raqamlarni o'chirish", en: "Delete the numbers" },
    ],
    correctIndex: 0,
    correctText: {
      ru: 'Группировка сохранит все цифры и покажет структуру. Проверим этот способ.',
      uz: "Guruhlash barcha raqamlarni saqlaydi va tuzilishni ko'rsatadi. Bu usulni tekshiramiz.",
      en: "The group will save all the numbers and show the structure.",
    },
    wrong: [
      null,
      {
        ru: 'Перестановка изменит адрес. Нужно сохранить каждую цифру на своём месте.',
        uz: "Raqamlarni almashtirish manzilni o'zgartiradi. Har bir raqamni o'z o'rnida saqlash kerak.",
        en: "The reposition will change the address. We need to keep every digit in its place.",
      },
      {
        ru: 'Удаление изменит адрес. Нужен способ сохранить все шесть цифр.',
        uz: "Raqamni olib tashlash manzilni o'zgartiradi. Oltita raqamning barchasini saqlash kerak.",
        en: "Deletion will change the address. You need a way to save all six digits.",
      },
    ],
    audio: {
      intro: {
        ru: [
          'Привет, друг! Это Бит. Сегодня мы вместе запустим Центр данных умного города и разгадаем один важный числовой секрет.',
          'Сегодня мы изучаем классы многозначных чисел. Звучит серьёзно, но всё станет понятным, если двигаться спокойно, шаг за шагом.',
          'Мы научимся видеть в длинном числе небольшие понятные части, правильно называть каждый класс и читать большие числа без ошибок.',
          'Я получил адрес: сто двадцать пять тысяч четыреста семь. Но городская система видит только длинную цепочку цифр, а именно один, два, пять, четыре, ноль, семь.',
          'Нам нужно показать устройство этого числа и при этом сохранить адрес точно таким, каким он был. Ни одна цифра не должна потерять своё значение.',
          'Перед тобой три идеи. Рассмотри их внимательно и выбери действие, с которого лучше начать нашу миссию.',
        ],
        uz: [
          "Salom, do'stim! Men Bitman. Bugun biz birgalikda aqlli shaharning Ma'lumotlar markazini ishga tushiramiz va muhim bir sonli sirni ochamiz.",
          "Bugun ko'p xonali sonlar sinflarini o'rganamiz. Nomi jiddiy tuyuladi, ammo asta-sekin, qadamma-qadam harakat qilsak, hammasi tushunarli bo'ladi.",
          "Biz uzun sonda kichik va tushunarli qismlarni ko'rishni, har bir sinfni to'g'ri nomlashni va katta sonlarni xatosiz o'qishni o'rganamiz.",
          "Men bir yuz yigirma besh ming to'rt yuz yetti manzilini oldim. Ammo shahar tizimi faqat bir, ikki, besh, to'rt, nol, yetti raqamlaridan iborat uzun qatorni ko'ryapti.",
          "Biz sonning tuzilishini ko'rsatishimiz va manzilni aynan o'z holicha saqlashimiz kerak. Hech bir raqam o'z qiymatini yo'qotmasligi lozim.",
          "Oldingda uchta g'oya bor. Ularni diqqat bilan ko'rib chiq va missiyamizni qaysi harakatdan boshlash yaxshiroq ekanini tanla.",
        ],
        en: [
          "Hey, buddy! This is Bit. Today, we're going to launch the Smart City Data Centre together, and we're going to unravel one important numerical secret.",
          "Today, we're studying place-value groups in multi-digit numbers, which may sound serious, but it will make sense as we work carefully, step by step.",
          "We will learn to see smaller, understandable parts within a long number, correctly name each group and read large numbers without errors.",
          "I received the address one hundred and twenty-five thousand four hundred and seven, but the city system sees only the digits one, two, five, four, zero and seven.",
          "We need to show the structure of that number and still keep the address exactly as it was, and no digit should lose its value.",
          "So here are three ideas. Consider them carefully, and choose an action to start our mission.",
        ],
      },
      on_correct: {
        ru: 'Группировка сохранит все цифры и покажет структуру. Проверим этот способ.',
        uz: "Guruhlash barcha raqamlarni saqlaydi va tuzilishni ko'rsatadi. Bu usulni tekshiramiz.",
        en: "The group will save all the numbers and show the structure.",
      },
      on_wrong: {
        ru: 'Так адрес изменится. Нужен способ сохранить каждую цифру на своём месте.',
        uz: "Bunday qilsak manzil o'zgaradi. Har bir raqamni o'z o'rnida saqlaydigan usul kerak.",
        en: "This will change the address. We need a way to keep every digit in place.",
      },
    },
  },
  s1: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslaymiz', en: "Remember." },
    bridge: { ru: 'Сначала проверим знакомые разряды.', uz: 'Avval tanish xonalarni tekshiramiz.', en: "Let's check the familiar places first." },
    question: {
      ru: 'Какое число состоит из 6 сотен, 4 десятков и 2 единиц?',
      uz: "Qaysi son 6 yuzlik, 4 o'nlik va 2 birlikdan iborat?",
      en: "What number consists of 6 hundred, 4 tens and 2 units?",
    },
    options: ['642', '624', '462', '6042'],
    correctIndex: 0,
    correctText: {
      ru: 'Верно. Сотни, десятки и единицы записаны слева направо: 642.',
      uz: "To'g'ri. Yuzlar, o'nlar va birlar chapdan o'ngga yoziladi: 642.",
      en: "That's right. Hundreds, tens and ones are written from left to right: 642.",
    },
    wrong: [
      null,
      {
        ru: 'Здесь 2 десятка и 4 единицы. Проверь цифру в разряде десятков.',
        uz: "Bu sonda 2 o'nlik va 4 birlik bor. O'nlar xonasidagi raqamni tekshiring.",
        en: "There's 2 tens and 4 units. Check the number in the tens.",
      },
      {
        ru: 'Здесь 4 сотни и 6 десятков. Начни с количества сотен.',
        uz: "Bu sonda 4 yuzlik va 6 o'nlik bor. Avval yuzlar sonini tekshiring.",
        en: "There's 4 hundred and 6 tens. Start with hundreds.",
      },
      {
        ru: 'Получилось четырёхзначное число. В условии названы только сотни, десятки и единицы.',
        uz: "To'rt xonali son hosil bo'ldi. Shartda faqat yuzlar, o'nlar va birlar aytilgan.",
        en: "It's a four-digit number. It's only hundreds, tens and ones on condition.",
      },
    ],
    audio: {
      intro: {
        ru: 'Вспомним разряды. Какое число состоит из шести сотен, четырёх десятков и двух единиц?',
        uz: "Xonalarni eslaymiz. Qaysi son olti yuzlik, to'rt o'nlik va ikki birlikdan iborat?",
        en: "Think of the digits. What number is six hundred, four tens and two?",
      },
      on_correct: {
        ru: 'Верно. Шесть сотен, четыре десятка и две единицы дают шестьсот сорок два.',
        uz: "To'g'ri. Olti yuzlik, to'rt o'nlik va ikki birlik olti yuz qirq ikki sonini beradi.",
        en: "Right. Six hundred, four tens and two units make six hundred and forty-two.",
      },
      on_wrong: {
        ru: 'Проверь порядок разрядов. Сначала сотни, затем десятки и единицы.',
        uz: "Xonalar tartibini tekshiring. Avval yuzlar, keyin o'nlar va birlar.",
        en: "Check the order of the places, first the hundreds, then the tens and the ones.",
      },
    },
  },
  s2: {
    eyebrow: { ru: 'Объяснение · шаг 1', uz: 'Tushuntirish · 1-qadam', en: "Explanation · step 1" },
    bridge: {
      ru: 'Знакомая таблица закончилась, но число продолжается. Разберёмся без догадок.',
      uz: "Tanish jadval tugadi, ammo son davom etmoqda. Endi buni taxminsiz tushunib olamiz.",
      en: "The familiar table is over, but the number goes on.",
    },
    title: { ru: 'Почему число делим справа?', uz: "Nega sonni o'ngdan ajratamiz?", en: "Why do we divide the number on the right?" },
    number: '4 208',
    explanationLead: {
      ru: 'Проследи, как Бит находит знакомые разряды и открывает новый класс.',
      uz: "Bit tanish xonalarni qanday topishi va yangi sinfni ochishini kuzating.",
      en: "See how Bit finds familiar places and opens up a new group.",
    },
    explanationSteps: [
      {
        label: { ru: 'Находим точку отсчёта', uz: 'Boshlanish nuqtasini topamiz', en: "Finding a reference point." },
        text: {
          ru: 'Последняя цифра справа всегда показывает единицы. Поэтому деление начинаем именно справа.',
          uz: "O'ngdagi oxirgi raqam doimo birlarni ko'rsatadi. Shuning uchun ajratishni aynan o'ngdan boshlaymiz.",
          en: "The last digit on the right always shows units, so we start dividing on the right.",
        },
      },
      {
        label: { ru: 'Собираем знакомые разряды', uz: "Tanish xonalarni yig'amiz", en: "Collecting familiar places" },
        text: {
          ru: '8 — единицы, 0 — десятки, 2 — сотни. Эти три разряда образуют класс единиц.',
          uz: "8 birlar, 0 o'nlar, 2 yuzlar xonasida turadi. Bu uchta xona birlar sinfini hosil qiladi.",
          en: "8 are units, 0 are tens, 2 are hundreds. These three places form a ones group.",
        },
      },
      {
        label: { ru: 'Ставим границу класса', uz: "Sinf chegarasini qo'yamiz", en: "Set the group boundary." },
        text: {
          ru: 'После трёх цифр проводим границу. Справа остаётся 208 — класс единиц.',
          uz: "Uchta raqamdan keyin sinf chegarasini qo'yamiz. O'ngda 208, ya'ni birlar sinfi qoladi.",
          en: "After three digits, we draw the boundary, and on the right is 208, the ones group.",
        },
      },
      {
        label: { ru: 'Открываем следующий класс', uz: 'Keyingi sinfni ochamiz', en: "Opening the next group." },
        text: {
          ru: 'Цифра 4 слева означает четыре тысячи. Она начинает следующий класс — класс тысяч.',
          uz: "Chapdagi 4 raqami to'rt mingni bildiradi. U keyingi sinf, ya'ni minglar sinfini boshlaydi.",
          en: "The digit 4 on the left stands for four thousand. It starts the next group, the thousands group.",
        },
      },
    ],
    resultText: {
      ru: '4 | 208 = 4 тысячи и 208 единиц.',
      uz: "4 | 208 = 4 minglik va 208 birlik.",
      en: "4 | 208 = 4,000 and 208 units.",
    },
    replayLabel: { ru: 'Повторить объяснение', uz: 'Tushuntirishni takrorlash', en: "Repeat the explanation" },
    audio: {
      ru: [
        'Посмотри на число четыре тысячи двести восемь. Последняя цифра справа всегда показывает единицы, поэтому разбор начинаем справа.',
        'Восемь стоит в единицах, ноль в десятках, два в сотнях. Эти три знакомых разряда вместе образуют класс единиц.',
        'После трёх цифр ставим границу класса. Справа получилось двести восемь, и это класс единиц.',
        'Слева осталась цифра четыре. Она означает четыре тысячи и открывает класс тысяч.',
      ],
      uz: [
        "To'rt ming ikki yuz sakkiz soniga qarang. O'ngdagi oxirgi raqam doimo birlarni ko'rsatadi, shuning uchun tahlilni o'ngdan boshlaymiz.",
        "Sakkiz birlar, nol o'nlar, ikki yuzlar xonasida turadi. Bu uchta tanish xona birlar sinfini hosil qiladi.",
        "Uchta raqamdan keyin sinf chegarasini qo'yamiz. O'ngda ikki yuz sakkiz, ya'ni birlar sinfi hosil bo'ldi.",
        "Chapda to'rt raqami qoldi. U to'rt mingni bildiradi va minglar sinfini ochadi.",
      ],
      en: [
        "Look at the number four thousand two hundred eight. The last digit on the right is always in the ones place, so we start grouping from the right.",
        "Eight is in the ones place, zero is in the tens place and two is in the hundreds place. These three familiar digits together form a ones group.",
        "After three digits, we place a group boundary. The group on the right is two hundred and eight, the ones group.",
        "On the left is the digit four. It stands for four thousand and opens a thousands group.",
      ],
    },
  },
  s3: {
    eyebrow: { ru: 'Объяснение · шаг 2', uz: 'Tushuntirish · 2-qadam', en: "Explanation · step 2" },
    bridge: {
      ru: 'Проверим тот же способ на шестизначном числе и назовём каждую часть.',
      uz: "Xuddi shu usulni olti xonali sonda tekshiramiz va har bir qismni nomlaymiz.",
      en: "Let's test the same method on a six-digit number and name each part.",
    },
    title: { ru: 'Как устроено число 125 407?', uz: '125 407 soni qanday tuzilgan?', en: "How does the number 125,407 work?" },
    number: '125407',
    explanationLead: {
      ru: 'Теперь не угадываем границу: выполняем одно и то же правило по шагам.',
      uz: "Endi chegarani taxmin qilmaymiz: bir xil qoidani qadamma-qadam bajaramiz.",
      en: "Now we do not guess the boundary: we follow the same rule in steps.",
    },
    explanationSteps: [
      {
        label: { ru: 'Записываем число', uz: 'Sonni yozamiz', en: "Write down the number." },
        text: {
          ru: 'Сначала видим целое число без деления: 125407. Крайняя правая цифра 7 — единицы.',
          uz: "Avval sonni ajratmasdan ko'ramiz: 125407. Eng o'ngdagi 7 raqami birlarni bildiradi.",
          en: "First we see an integer without division: 125407. The extreme right digit 7 is one.",
        },
      },
      {
        label: { ru: 'Отделяем первую тройку', uz: 'Birinchi uchlikni ajratamiz', en: "Separate the top three" },
        text: {
          ru: 'Отсчитываем справа три цифры: 407. Это класс единиц — сотни, десятки и единицы.',
          uz: "O'ngdan uchta raqamni sanaymiz: 407. Bu birlar sinfi — yuzlar, o'nlar va birlar.",
          en: "We count on the right three digits: 407. This is a ones group -- hundreds, tens and ones.",
        },
      },
      {
        label: { ru: 'Называем левую группу', uz: 'Chap guruhni nomlaymiz', en: "We call the left group." },
        text: {
          ru: 'Слева осталась группа 125. Это класс тысяч: сотни тысяч, десятки тысяч и тысячи.',
          uz: "Chapda 125 guruhi qoldi. Bu minglar sinfi: yuz minglar, o'n minglar va bir minglar.",
          en: "On the left is group 125. It's a thousands group: hundreds of thousands, tens of thousands and thousands.",
        },
      },
      {
        label: { ru: 'Читаем по классам', uz: "Sinflar bo'yicha o'qiymiz", en: "Reading by group." },
        text: {
          ru: 'Сначала читаем класс тысяч, затем класс единиц: сто двадцать пять тысяч четыреста семь.',
          uz: "Avval minglar sinfini, keyin birlar sinfini o'qiymiz: bir yuz yigirma besh ming to'rt yuz yetti.",
          en: "First we read the thousands group, then the ones group: one hundred twenty-five thousand four hundred and seven.",
        },
      },
    ],
    resultText: {
      ru: '125 | 407: слева класс тысяч, справа класс единиц.',
      uz: "125 | 407: chapda minglar sinfi, o'ngda birlar sinfi.",
      en: "125 | 407: left thousands group, right ones group.",
    },
    replayLabel: { ru: 'Показать ещё раз', uz: "Yana bir marta ko'rsatish", en: "Show me again." },
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
      en: [
        "Consider one hundred and twenty-five thousand four hundred and seven. The rightmost digit seven represents seven ones.",
        "Count three digits from the right: four, zero, seven. The group of four hundred and seven forms a ones group.",
        "On the left is a group of one hundred and twenty-five. It forms a thousands group: hundreds of thousands, tens of thousands and thousands.",
        "We read the number group by group from left to right: one hundred twenty-five thousand four hundred and seven.",
      ],
    },
  },
  s4: {
    eyebrow: { ru: 'Тренажёр с Битом', uz: 'Bit bilan trenajyor', en: "Practise with Bit" },
    bridge: {
      ru: 'Теперь повтори способ сам. Бит будет давать только один шаг за раз.',
      uz: "Endi usulni o'zingiz takrorlang. Bit har safar faqat bitta qadam beradi.",
      en: "Now repeat the method yourself. Bit will only take one step at a time.",
    },
    title: { ru: 'Раздели число 125407 по классам', uz: "125407 sonini sinflarga ajrating", en: "Divide the number 125407 by group" },
    trainerLead: {
      ru: 'Решай последовательно: сначала правая группа, затем её название, после этого левая группа.',
      uz: "Ketma-ket yeching: avval o'ng guruh, keyin uning nomi, undan so'ng chap guruh.",
      en: "Decide sequentially: first the right group, then its name, then the left group.",
    },
    trainerSteps: [
      {
        prompt: {
          ru: 'Шаг 1 из 4. Какую группу из трёх цифр отделяем первой?',
          uz: "4 qadamdan 1-qadam. Avval qaysi uchta raqamli guruhni ajratamiz?",
          en: "Step 1 of 4: Which group of three digits is the first?",
        },
        options: [
          { ru: '125', uz: '125', en: '125' },
          { ru: '407', uz: '407', en: '407' },
          { ru: '540', uz: '540', en: '540' },
        ],
        correctIndex: 1,
        correctText: {
          ru: 'Верно: считаем три цифры справа и получаем 407.',
          uz: "To'g'ri: o'ngdan uchta raqamni sanab, 407 ni olamiz.",
          en: "Right: count the three digits on the right and get 407.",
        },
        hint: {
          ru: 'Найди крайнюю правую цифру 7 и возьми вместе с ней ещё две цифры слева.',
          uz: "Eng o'ngdagi 7 raqamini toping va u bilan chapdagi yana ikkita raqamni oling.",
          en: "Find the extreme right digit 7 and take with it two more digits on the left.",
        },
      },
      {
        prompt: {
          ru: 'Шаг 2 из 4. Как называется правая группа 407?',
          uz: "4 qadamdan 2-qadam. O'ngdagi 407 guruhi qanday ataladi?",
          en: "Step 2 of 4: What is the name of the right-hand group 407?",
        },
        options: [
          { ru: 'класс тысяч', uz: 'minglar sinfi', en: "group" },
          { ru: 'класс единиц', uz: 'birlar sinfi', en: "unit" },
          { ru: 'один разряд', uz: 'bitta xona', en: "single-rate" },
        ],
        correctIndex: 1,
        correctText: {
          ru: 'Да. 407 содержит сотни, десятки и единицы — это класс единиц.',
          uz: "Ha. 407 yuzlar, o'nlar va birlardan iborat — bu birlar sinfi.",
          en: "Yeah. A 407 has hundreds, tens, and one is a ones group.",
        },
        hint: {
          ru: 'В правой группе находятся знакомые сотни, десятки и единицы.',
          uz: "O'ng guruhda tanish yuzlar, o'nlar va birlar joylashgan.",
          en: "In the right group are familiar hundreds, tens and units.",
        },
      },
      {
        prompt: {
          ru: 'Шаг 3 из 4. Какая группа осталась слева от границы?',
          uz: '4 qadamdan 3-qadam. Chegaraning chap tomonida qaysi guruh qoldi?',
          en: "Step 3 of 4: Which group is left of the border?",
        },
        options: [
          { ru: '407', uz: '407', en: '407' },
          { ru: '125', uz: '125', en: '125' },
          { ru: '12', uz: '12', en: '12' },
        ],
        correctIndex: 1,
        correctText: {
          ru: 'Верно. После отделения 407 слева остаётся группа 125.',
          uz: "To'g'ri. 407 ajratilgach, chapda 125 guruhi qoladi.",
          en: "Right. After the 407, the left is the group 125.",
        },
        hint: {
          ru: 'Мысленно поставь границу перед цифрой 4: 125 | 407.',
          uz: "4 raqamidan oldin chegarani tasavvur qiling: 125 | 407.",
          en: "Put the boundary in front of the digit 4: 125 | 407.",
        },
      },
      {
        prompt: {
          ru: 'Шаг 4 из 4. Как называется левая группа 125?',
          uz: '4 qadamdan 4-qadam. Chapdagi 125 guruhi qanday ataladi?',
          en: "Step 4 of 4: What is the name of the left group 125?",
        },
        options: [
          { ru: 'класс единиц', uz: 'birlar sinfi', en: "unit" },
          { ru: 'класс тысяч', uz: 'minglar sinfi', en: "group" },
          { ru: 'класс сотен', uz: 'yuzlar sinfi', en: "hundredth" },
        ],
        correctIndex: 1,
        correctText: {
          ru: 'Верно. 125 показывает количество тысяч — это класс тысяч.',
          uz: "To'g'ri. 125 minglar miqdorini ko'rsatadi — bu minglar sinfi.",
        en: 'That is right. 125 shows the number of whole thousands, so it forms the thousands group.',
        },
        hint: {
          ru: 'Эту группу читаем первой: сто двадцать пять тысяч.',
          uz: "Bu guruhni birinchi o'qiymiz: bir yuz yigirma besh ming.",
          en: "We read this group first: one hundred and twenty-five thousand.",
        },
      },
    ],
    doneText: {
      ru: 'Готово: 125 | 407. Весь алгоритм пройден самостоятельно, от правой цифры до названий классов.',
      uz: "Tayyor: 125 | 407. Siz butun algoritmni o'ngdagi raqamdan sinflar nomigacha mustaqil bajardingiz.",
      en: "Ready: 125 | 407. The entire algorithm is run independently, from the right digit to the group names.",
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
      en: [
        "Build an address structure of one hundred twenty-five thousand four hundred and seven.",
        "Start with the extreme right digit and assemble a three-digit group on the right.",
        "The remaining digits form the next group.",
      ],
    },
  },
  s5: {
    eyebrow: { ru: 'Объясняем способ', uz: 'Usulni tushuntiramiz', en: "Explain the way" },
    bridge: {
      ru: 'Группы получились. Теперь объясним, почему начали справа.',
      uz: "Guruhlar tayyor. Endi nima uchun o'ngdan boshlaganimizni tushuntiramiz.",
      en: "Now let's explain why we started on the right.",
    },
    sequence: ['7', '47', '407', '2 407'],
    question: {
      ru: 'Начинаем справа, потому что справа всегда находится разряд…',
      uz: "O'ngdan boshlaymiz, chunki o'ng tomonda doimo qaysi xona turadi?",
      en: "We start on the right, because the right is always the right.",
    },
    options: [
      { ru: 'единиц', uz: 'birlar', en: "unit" },
      { ru: 'сотен', uz: 'yuzlar', en: "hundred" },
      { ru: 'тысяч', uz: 'minglar', en: "thousand" },
    ],
    correctIndex: 0,
    correctText: {
      ru: 'Верно. Крайняя правая цифра всегда показывает единицы.',
      uz: "To'g'ri. Eng o'ngdagi raqam doimo birlarni ko'rsatadi.",
      en: "Right. The extreme right digit always shows units.",
    },
    wrong: [
      null,
      {
        ru: 'Сотни находятся на третьем месте справа. Точка отсчёта — крайний правый разряд.',
        uz: "Yuzlar o'ngdan uchinchi joyda turadi. Sanash eng o'ngdagi xonadan boshlanadi.",
        en: "Hundreds are in third place on the right. The reference point is the far right.",
      },
      {
        ru: 'Тысячи находятся левее первой тройки. Справа число начинается с меньшего разряда.',
        uz: "Minglar birinchi uchlikdan chapda turadi. Sonning o'ng tomoni kichik xonadan boshlanadi.",
        en: "Thousands are to the left of the top three. On the right, the number starts with a smaller number.",
      },
    ],
    audio: {
      intro: {
        ru: 'Посмотри, как число растёт слева, а крайняя правая цифра остаётся единицами. Заверши объяснение.',
        uz: "Son chap tomonga o'sishini, eng o'ngdagi raqam esa birlar bo'lib qolishini ko'ring. Izohni yakunlang.",
        en: "Look at how the number goes up on the left, and the extreme right digit stays one. Finish the explanation.",
      },
      on_correct: {
        ru: 'Верно. Разряд единиц даёт постоянную точку отсчёта справа.',
        uz: "To'g'ri. Birlar xonasi o'ng tomonda doimiy boshlanish nuqtasini beradi.",
        en: "That's right. Units give you a constant reference point on the right.",
      },
      on_wrong: {
        ru: 'Посмотри на крайнюю правую цифру каждого числа.',
        uz: "Har bir sonning eng o'ngdagi raqamiga qarang.",
        en: "Look at the extreme right digit of each number.",
      },
    },
  },
  s6: {
    eyebrow: { ru: 'Новое понятие', uz: 'Yangi tushuncha', en: "A new concept" },
    bridge: {
      ru: 'У математических групп есть точные названия.',
      uz: 'Matematik guruhlarning aniq nomlari bor.',
      en: "Mathematical groups have exact names.",
    },
    title: { ru: 'Два класса числа', uz: 'Sonning ikki sinfi', en: "Two groups of numbers" },
    instruction: { ru: 'Выбери название, затем подходящую группу.', uz: 'Nomni, keyin mos guruhni tanlang.', en: "Choose a name, then the appropriate group." },
    groups: ['125', '407'],
    labels: [
      { id: 'thousands', text: { ru: 'класс тысяч', uz: 'minglar sinfi', en: "group" }, group: '125' },
      { id: 'units', text: { ru: 'класс единиц', uz: 'birlar sinfi', en: "unit" }, group: '407' },
    ],
    hint: {
      ru: 'Правая группа содержит обычные единицы, десятки и сотни.',
      uz: "O'ngdagi guruh oddiy birlar, o'nlar va yuzlardan iborat.",
      en: "The right-hand group contains the familiar ones, tens and hundreds.",
    },
    doneText: {
      ru: '407 — класс единиц. 125 — класс тысяч.',
      uz: '407 birlar sinfi. 125 minglar sinfi.',
      en: "407 is a ones group. 125 is a thousands group.",
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
      en: [
        "A group of three places is called a place-value group.",
        "The first group on the right contains ones, tens and hundreds. It's a ones group.",
        "The next group contains thousands, tens of thousands and hundreds of thousands. This is the thousands group.",
        "Match each name to its group.",
      ],
    },
  },
  s7: {
    eyebrow: { ru: 'Исследование значения', uz: 'Qiymatni tadqiq qilamiz', en: "Study of significance" },
    bridge: {
      ru: 'Класс показывает не только группу, но и значение цифры.',
      uz: "Sinf faqat guruhni emas, raqamning qiymatini ham ko'rsatadi.",
      en: 'A place-value group shows both a group of digits and their values in the number.',
    },
    title: { ru: 'Одинаковая цифра 5, разные значения', uz: 'Bir xil 5 raqami, turli qiymatlar', en: "Same digit 5, different values" },
    rounds: [
      { number: '5 205', highlight: 0, options: ['5', '500', '5 000'], correctIndex: 2 },
      { number: '205 005', highlight: 5, options: ['5', '5 000', '500 000'], correctIndex: 0 },
    ],
    question: { ru: 'Каково значение выделенной цифры?', uz: 'Ajratilgan raqamning qiymati qancha?', en: "What is the value of the highlighted digit?" },
    correctText: {
      ru: 'Верно. Значение цифры определяется её разрядом и классом.',
      uz: "To'g'ri. Raqamning qiymati uning xonasi va sinfi bilan aniqlanadi.",
      en: "Right. A digit's value is determined by its place.",
    },
    wrongText: {
      ru: 'Не считывай только саму цифру. Найди её столбец в таблице классов.',
      uz: "Faqat raqamning o'ziga qaramang. Sinflar jadvalida uning ustunini toping.",
      en: "Don't just read the number itself. Find its column in the place-value chart.",
    },
    audio: {
      intro: {
        ru: 'Цифра пять встречается в двух числах. В каждом раунде определи её значение по месту в таблице.',
        uz: "Besh raqami ikkita sonda uchraydi. Har bir bosqichda jadvaldagi o'rniga qarab uning qiymatini aniqlang.",
      en: 'The digit five appears in two numbers. In each round, determine its value from its place in the chart.',
      },
      on_correct: {
        ru: 'Верно. Одна и та же цифра получает значение от своего разряда.',
        uz: "To'g'ri. Bir xil raqam o'z xonasiga qarab qiymat oladi.",
        en: 'That is right. The same digit gets its value from its place.',
      },
      on_wrong: { ru: 'Проверь разряд выделенной цифры.', uz: 'Ajratilgan raqamning xonasini tekshiring.', en: "Check the place of the highlighted digit." },
    },
  },
  s8: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: "Opening" },
    bridge: {
      ru: 'Сравним результаты двух раундов и сделаем вывод.',
      uz: "Ikki bosqich natijasini solishtirib, xulosa qilamiz.",
      en: "Compare the results of the two rounds and make a conclusion.",
    },
    title: { ru: 'Один шаг влево', uz: 'Bir qadam chapga', en: "One step to the left" },
    question: {
      ru: 'Как изменится значение цифры 6 после сдвига на один разряд влево?',
      uz: "6 raqamining qiymati bir xona chapga siljigach qanday o'zgaradi?",
      en: "How will the value of the digit 6 change after shifting one place to the left?",
    },
    options: [
      { ru: 'станет в 10 раз больше', uz: '10 marta kattalashadi', en: "It'll be 10 times bigger." },
      { ru: 'станет в 10 раз меньше', uz: '10 marta kichrayadi', en: "will be 10 times less" },
      { ru: 'не изменится', uz: "o'zgarmaydi", en: "will change" },
    ],
    correctIndex: 0,
    correctText: {
      ru: 'Верно. Каждый соседний разряд слева в 10 раз больше, поэтому значение цифры 6 увеличилось в 10 раз.',
      uz: "To'g'ri. Chapdagi har bir qo'shni xona 10 marta katta, shuning uchun 6 raqamining qiymati 10 marta oshdi.",
      en: "That's right. Each neighbouring digit on the left is 10 times larger, so the value of the digit 6 has increased 10 times.",
    },
    wrong: [
      null,
      {
        ru: 'Движение влево ведёт к более крупному разряду. Сравни соседние разряды.',
        uz: "Chapga siljish kattaroq xonaga olib boradi. Qo'shni xonalarni solishtiring.",
        en: "Moving to the left leads to a larger place. Compare the neighbouring places.",
      },
      {
        ru: 'Цифра та же, но её разряд изменился. Сравни значение соседних разрядов.',
        uz: "Raqam o'sha, ammo uning xonasi o'zgardi. Qo'shni xonalar qiymatini solishtiring.",
        en: "It is the same digit, but it has a different place.",
      },
    ],
    audio: {
      intro: {
        ru: 'Мы уже нашли значения цифры по её месту. Теперь сделай предсказание без полного вычисления: проследи, куда передвинулась цифра шесть.',
        uz: "Raqam qiymatini uning o'rniga qarab topdik. Endi to'liq hisoblamasdan ayting, olti raqami qayerga siljiganini kuzating.",
        en: "We have already found the digit's value in its place. Now predict the change without calculating in full: trace where the digit six has moved.",
      },
      on_correct: {
        ru: 'Верно. Цифра шесть перешла из тысяч в десятки тысяч. Один шаг влево умножил значение цифры на десять.',
        uz: "To'g'ri. Olti raqami minglardan o'n minglarga o'tdi. Bir qadam chapga raqam qiymatini o'nga ko'paytirdi.",
        en: "Right. The digit six moved from the thousands place to the ten-thousands place. One step to the left multiplied its value by ten.",
      },
      on_wrong: {
        ru: 'Вспомни: десятки в десять раз больше единиц, сотни в десять раз больше десятков. Эта связь продолжается.',
        uz: "Eslang: o'nlar birlardan o'n marta, yuzlar o'nlardan o'n marta katta. Bu bog'lanish davom etadi.",
        en: 'Remember: tens are worth ten times as much as ones, and hundreds ten times as much as tens. The same pattern continues.',
      },
    },
  },
  s9: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: "Rule." },
    bridge: { ru: 'Назовём открытый способ точно.', uz: 'Topilgan usulni aniq ifodalaymiz.', en: "Let's call it an open method for sure." },
    title: { ru: 'Собери правило', uz: "Qoidani yig'ing", en: "Make a rule." },
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
      en: [
        "Group the number.",
        "the left-hand group",
        "3 places.",
        "On the right is a ones group.",
        "On the left is a thousands group.",
      ],
    },
    rule: {
      ru: 'Многозначное число делим справа налево на классы по три разряда. Первый справа — класс единиц, следующий — класс тысяч.',
      uz: "Ko'p xonali sonni o'ngdan chapga har birida uchtadan raqam bo'lgan sinflarga ajratamiz. O'ngdagi birinchi sinf birlar sinfi, keyingisi minglar sinfi.",
      en: "A multi-digit number is divided from right to left into groups of three digits. The first on the right is the ones group, the next is the thousands group.",
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
      en: [
        "We have already tried the method with several numbers.",
        "Gather the parts of the rule in the right order.",
        "Starting from the right, separate a multi-digit number into groups of three digits: first the ones group, then the thousands group.",
      ],
    },
  },
  s10: {
    eyebrow: { ru: 'Решаем вместе', uz: 'Birga yechamiz', en: "Decide together." },
    bridge: { ru: 'Применим правило к новому городскому коду.', uz: "Qoidani yangi shahar kodiga qo'llaymiz.", en: "Apply the rule to the new city code." },
    title: { ru: 'Размести 348 216 по классам', uz: '348 216 ni sinflarga joylashtiring', en: "Place 348,216 in places" },
    numberRaw: '348216',
    stepQuestions: [
      { ru: 'Какая группа первой отделяется справа?', uz: "O'ngdan birinchi qaysi guruh ajratiladi?", en: "Which group is the first to separate from the right?" },
      { ru: 'Какая группа остаётся для класса тысяч?', uz: 'Minglar sinfi uchun qaysi guruh qoladi?', en: "What group is left for the thousands group?" },
    ],
    stepOptions: [
      ['216', '348', '821'],
      ['348', '216', '843'],
    ],
    correctIndices: [0, 0],
    classUnits: { ru: 'класс единиц', uz: 'birlar sinfi', en: "unit" },
    classThousands: { ru: 'класс тысяч', uz: 'minglar sinfi', en: "group" },
    doneText: {
      ru: '348 тысяч и 216 единиц образуют число 348 216.',
      uz: '348 ming va 216 bir 348 216 sonini hosil qiladi.',
      en: "348 thousand and 216 units form the number 348,216.",
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
      en: [
        "Now we're working together. Start on the right side and highlight three digits.",
        "Two hundred and sixteen forms the ones group.",
        "The remaining three hundred and forty-eight occupy the thousands group.",
      ],
    },
  },
  s11: {
    eyebrow: { ru: 'Теперь с подсказкой', uz: 'Endi ishora bilan', en: "Now with a hint." },
    bridge: {
      ru: 'Граница классов видна, но цифры размещаешь ты.',
      uz: "Sinflar chegarasi ko'rinadi, raqamlarni esa siz joylashtirasiz.",
      en: "You can see the group boundary, but you put the numbers.",
    },
    title: { ru: 'Размести число 70 509', uz: '70 509 sonini joylashtiring', en: "Place the number 70,509" },
    instruction: {
      ru: 'Перетащи цифры или выбери цифру, затем её место. Не теряй нули.',
      uz: "Raqamlarni ko'chiring yoki raqamni, keyin uning joyini tanlang. Nollarni yo'qotmang.",
      en: "Drag the numbers, or pick a number, and then place it. Don't lose zeros.",
    },
    digits: ['7', '0', '5', '0', '9'],
    target: [null, '7', '0', '5', '0', '9'],
    hint1: {
      ru: 'Начни с 9 в разряде единиц и двигайся влево.',
      uz: 'Birlar xonasidagi 9 dan boshlang va chapga yuring.',
      en: "Start with 9 and move to the left.",
    },
    hint2: {
      ru: 'Ноль занимает разряд. Оставь его между соседними цифрами.',
      uz: "Nol xonani egallaydi. Uni qo'shni raqamlar orasida qoldiring.",
      en: "Zero is a place. Leave it between the next digits.",
    },
    doneText: {
      ru: 'Верно. 70 — класс тысяч, 509 — класс единиц. Оба нуля сохранили свои разряды.',
      uz: "To'g'ri. 70 minglar sinfi, 509 birlar sinfi. Ikkala nol ham o'z xonasini saqladi.",
      en: "That's right. 70 is the thousands group, 509 is the ones group. Both zeros have retained their places.",
    },
    audio: {
      intro: {
        ru: 'Размести семьдесят тысяч пятьсот девять в таблице классов. Начни справа и сохрани каждый ноль.',
        uz: "Yetmish ming besh yuz to'qqiz sonini sinflar jadvaliga joylashtiring. O'ngdan boshlang va har bir nolni saqlang.",
        en: "Put seventy thousand five hundred nine in the place-value chart. Start on the right and save each zero.",
      },
      on_correct: {
        ru: 'Верно. Нули остались в своих разрядах, поэтому значение числа не изменилось.',
        uz: "To'g'ri. Nollar o'z xonalarida qoldi, shuning uchun sonning qiymati o'zgarmadi.",
        en: "That's right. The zeroes stayed in their places, so the value of the number didn't change.",
      },
      on_wrong: {
        ru: 'Проверь каждый разряд справа налево. Ноль тоже занимает место.',
        uz: "Har bir xonani o'ngdan chapga tekshiring. Nol ham joy egallaydi.",
        en: "Check every place from right to left. Zero takes up space, too.",
      },
    },
  },
  s12: {
    eyebrow: { ru: 'Выбор стратегии', uz: 'Strategiyani tanlash', en: "Choosing a strategy" },
    bridge: {
      ru: 'Не всегда нужно разбирать все шесть разрядов.',
      uz: "Har doim oltita xonaning barchasini tahlil qilish shart emas.",
      en: "It is not always necessary to understand all six places.",
    },
    question: {
      ru: 'Как быстрее найти полные тысячи и остаток в числе 482 731?',
      uz: "482 731 sonidagi to'liq minglar va qoldiqni qanday tez topamiz?",
      en: "How do you find the full thousands and the remainder of 482,731?",
    },
    options: [
      { ru: 'Отделить справа три разряда', uz: "O'ngdan uchta xonani ajratish", en: "Separate three digits on the right" },
      { ru: 'Сложить все цифры', uz: "Barcha raqamlarni qo'shish", en: "Add up all the numbers." },
      { ru: 'Убрать последние три цифры', uz: "Oxirgi uchta raqamni o'chirish", en: "Remove the last three digits" },
    ],
    correctIndex: 0,
    followupQuestion: {
      ru: 'Как правильно разложить число на полные тысячи и остаток?',
      uz: "Sonni to'liq minglar va qoldiqqa qanday to'g'ri ajratamiz?",
      en: "How to divide the number into thousands and the remainder?",
    },
    followupOptions: [
      { ru: '482 тысячи, остаток 731', uz: '482 ming, qoldiq 731', en: "482,000, leftover 731" },
      { ru: '731 тысяча, остаток 482', uz: '731 ming, qoldiq 482', en: "731,000, balance 482" },
      { ru: '482 731 тысяча, остаток 0', uz: '482 731 ming, qoldiq 0', en: "482,731 thousand, balance 0" },
    ],
    followupCorrectIndex: 0,
    correctText: {
      ru: 'Верно. 482 731 = 482 × 1 000 + 731. Значит, есть 482 полные тысячи и остаток 731.',
      uz: "To'g'ri. 482 731 = 482 × 1 000 + 731. Demak, 482 ta to'liq ming va 731 qoldiq bor.",
      en: "That's right. 482,731 = 482 × 1,000 + 731. So there's 482 total thousands and the remainder is 731.",
    },
    wrong: [
      null,
      {
        ru: 'Сумма цифр показывает другое свойство числа. Чтобы найти тысячи, посмотри на соответствующий класс.',
        uz: "Raqamlar yig'indisi sonning boshqa xususiyatini ko'rsatadi. Minglarni topish uchun tegishli sinfga qarang.",
        en: "The sum of the digits shows a different property of a number. To find thousands, look at the corresponding group.",
      },
      {
        ru: 'Удаление цифр изменяет число. Нам нужно сохранить и полные тысячи, и остаток.',
        uz: "Raqamlarni o'chirish sonni o'zgartiradi. To'liq minglar ham, qoldiq ham saqlanishi kerak.",
        en: "Deleting the numbers changes the number. We need to save both the full thousands and the remainder.",
      },
    ],
    audio: {
      intro: {
        ru: 'Диспетчеру нужно узнать, сколько полных пакетов по тысяче содержится в числе четыреста восемьдесят две тысячи семьсот тридцать один и сколько единиц останется. Сначала выбери стратегию.',
        uz: "Dispetcher to'rt yuz sakson ikki ming yetti yuz o'ttiz bir sonida minglik nechta to'liq paket borligini va qancha qoldiq qolishini bilishi kerak. Avval strategiyani tanlang.",
        en: "The dispatcher needs the number of full thousands and remaining units in four hundred and eighty-two thousand seven hundred and thirty-one. Choose a strategy.",
      },
      on_correct: {
        ru: 'Верно. Отделяем справа три разряда. Теперь назови полные тысячи и остаток.',
        uz: "To'g'ri. O'ngdan uchta xonani ajratamiz. Endi to'liq minglar va qoldiqni ayting.",
        en: "Right. Separate the three digits on the right. Now name the full thousands and the remainder.",
      },
      on_wrong: {
        ru: 'Этот способ не показывает количество тысяч. Найди нужный класс.',
        uz: "Bu usul minglar sonini ko'rsatmaydi. Kerakli sinfni toping.",
        en: "It doesn't show the number of thousands. Find the group on the right.",
      },
    },
  },
  s13: {
    eyebrow: { ru: 'Проверяем Bit', uz: 'Bitni tekshiramiz', en: "Checking Bit." },
    bridge: {
      ru: 'Bit применил правило, но поставил разделители слишком рано.',
      uz: "Bit qoidani qo'lladi, lekin ajratgichlarni noto'g'ri joylashtirdi.",
      en: "Bit applied the rule, but put the dividers too early.",
    },
    title: { ru: 'Исправь границу', uz: "Chegarani to'g'rilang", en: "Fix the border." },
    bitVersion: '5 | 241 | 6',
    question: {
      ru: 'Выбери запись 52 416.',
      uz: '52 416 yozuvini tanlang.',
      en: "Select the notation for 52,416.",
    },
    options: ['5 | 2416', '52 | 416', '524 | 16'],
    correctIndex: 1,
    correctText: {
      ru: 'Верно. Справа сначала отделяются три цифры 416. Слева может остаться одна, две или три цифры.',
      uz: "To'g'ri. O'ngdan avval 416 uchligi ajratiladi. Chapda bir, ikki yoki uchta raqam qolishi mumkin.",
      en: "Right. The three digits 416 are separated on the right, and on the left, you can have one, two or three digits.",
    },
    wrong: [
      {
        ru: 'Справа остались четыре цифры. Отсчитай ровно три цифры от правого края.',
        uz: "O'ngda to'rtta raqam qoldi. O'ng chetdan roppa-rosa uchta raqamni sanang.",
        en: "There are four digits left on the right. Count exactly three digits from the right edge.",
      },
      null,
      {
        ru: 'Справа остались только две цифры. Класс единиц содержит три позиции.',
        uz: "O'ngda faqat ikkita raqam qoldi. Birlar sinfida uchta o'rin bor.",
        en: "There's only two digits left on the right. The ones group has three positions.",
      },
    ],
    audio: {
      intro: {
        ru: 'Bit разделил число пятьдесят две тысячи четыреста шестнадцать неправильно. Выбери верную границу классов.',
        uz: "Bit ellik ikki ming to'rt yuz o'n olti sonini noto'g'ri ajratdi. Sinflarning to'g'ri chegarasini tanlang.",
        en: 'Bit grouped the number fifty-two thousand four hundred and sixteen incorrectly. Choose the correct group boundary.',
      },
      on_correct: {
        ru: 'Верно. Сначала справа отделили три цифры. Левая группа может быть короче.',
        uz: "To'g'ri. Avval o'ngdan uchta raqam ajratildi. Chapdagi guruh qisqaroq bo'lishi mumkin.",
        en: "Right. First, on the right, we had three digits separated. The left group could be shorter.",
      },
      on_wrong: {
        ru: 'Проверь количество цифр в правой группе.',
        uz: "O'ngdagi guruhdagi raqamlar sonini tekshiring.",
        en: "Check the number of digits in the right group.",
      },
    },
  },
  s14: {
    eyebrow: { ru: 'Решение для города', uz: 'Shahar uchun yechim', en: "A solution for the city" },
    bridge: {
      ru: 'Осталось направить сообщение в правильный городской объект.',
      uz: "Xabarni to'g'ri shahar obyektiga yuborish qoldi.",
      en: "It remains to send the message to the correct city facility.",
    },
    title: { ru: 'Куда отправить сообщение?', uz: 'Xabarni qayerga yuboramiz?', en: "Where to send the message?" },
    model: {
      ru: '1 сотня тысяч, 8 десятков тысяч, 0 единиц тысяч, 2 сотни, 4 десятка, 0 единиц',
      uz: "1 yuz minglik, 8 o'n minglik, 0 minglik, 2 yuzlik, 4 o'nlik, 0 birlik",
      en: "1 hundred thousand, 8 tens of thousands, 0 thousand, 2 hundred, 4 tens, 0",
    },
    question: {
      ru: 'Собери код по разрядам. Какой объект должен получить сообщение?',
      uz: "Kodni xonalar bo'yicha yig'ing. Xabarni qaysi obyekt olishi kerak?",
      en: "Collect the code by digits. Which object should receive the message?",
    },
    objects: [
      { name: { ru: 'Школа', uz: 'Maktab', en: "School" }, code: '18 204' },
      { name: { ru: 'Лаборатория', uz: 'Laboratoriya', en: "Laboratory" }, code: '108 024' },
      { name: { ru: 'Станция', uz: 'Stansiya', en: "Station" }, code: '180 240' },
    ],
    correctIndex: 2,
    correctText: {
      ru: 'Верно. В таблице получается 180 | 240. Это код станции 180 240.',
      uz: "To'g'ri. Jadvalda 180 | 240 hosil bo'ladi. Bu 180 240 stansiya kodi.",
      en: "That's right. That's 180 | 240. That's the station code 180 240.",
    },
    wrong: [
      {
        ru: 'В этом коде нет разряда сотен тысяч. Начни модель с 1 сотни тысяч.',
        uz: "Bu kodda yuz minglar xonasi yo'q. Modelni 1 yuz minglikdan boshlang.",
        en: "There's no hundreds of thousands in this code. Start with 1 hundred thousand.",
      },
      {
        ru: 'Здесь цифры 8 и 2 стоят в других разрядах. Размести модель по шести столбцам.',
        uz: "Bu yerda 8 va 2 raqamlari boshqa xonalarda turibdi. Modelni oltita ustunga joylashtiring.",
        en: "Here, the numbers 8 and 2 are in different places. Place the model in six columns.",
      },
      null,
    ],
    factBadge: { ru: 'Математика вокруг нас', uz: 'Atrofimizdagi matematika', en: "Mathematics is all around us" },
    factText: {
      ru: 'Коды и номера читают по группам, чтобы легче видеть их структуру и проверять запись.',
      uz: "Kodlar va raqamlar guruhlab o'qiladi. Bu ularning tuzilishini ko'rish va yozuvni tekshirishni osonlashtiradi.",
      en: "Codes and numbers are read in groups so that their structure is easier to see and their notation is easier to check.",
    },
    factAudio: {
      ru: 'Длинные коды часто делят на группы. Так человеку легче увидеть структуру и заметить пропущенную цифру.',
      uz: "Uzun kodlar ko'pincha guruhlarga ajratiladi. Shunda tuzilishni ko'rish va tushib qolgan raqamni aniqlash osonroq bo'ladi.",
      en: "Long codes are often divided into groups, making it easier for a person to see the structure and notice a missing digit.",
    },
    audio: {
      intro: {
        ru: 'Система восстановила код по разрядам. Одна сотня тысяч, восемь десятков тысяч, ноль единиц тысяч, две сотни, четыре десятка и ноль единиц. Выбери объект с этим кодом.',
        uz: "Tizim kodni xonalar bo'yicha tikladi. Bir yuz minglik, sakkiz o'n minglik, nol minglik, ikki yuzlik, to'rt o'nlik va nol birlik. Shu kodli obyektni tanlang.",
        en: "The system reconstructed the code by places: One hundred thousand, eight tens of thousands, zero thousand, two hundred, four tens and zero. Choose an object with this code.",
      },
      on_correct: {
        ru: 'Верно. Получилось сто восемьдесят тысяч двести сорок. Сообщение направлено на станцию.',
        uz: "To'g'ri. Bir yuz sakson ming ikki yuz qirq hosil bo'ldi. Xabar stansiyaga yuborildi.",
        en: "That's right. That's one hundred and eighty thousand two hundred and forty.",
      },
      on_wrong: {
        ru: 'Проверь положение каждой цифры в таблице классов.',
        uz: "Har bir raqamning sinflar jadvalidagi o'rnini tekshiring.",
        en: "Check the position of each digit in the place-value chart.",
      },
    },
  },
  s15: {
    eyebrow: { ru: 'Награда за миссию', uz: 'Missiya mukofoti', en: "Mission award" },
    title: { ru: 'Открой звание', uz: 'Unvonni oching', en: 'Unlock your title' },
    hookClose: {
      ru: 'Основа восстановлена, два способа объяснения пройдены, границы поставлены пальцем, блиц решён.',
      uz: "Siz asosni tikladingiz, ikki usuldagi tushuntirishdan o'tdingiz, chegaralarni barmoq bilan qo'ydingiz va yagona blitsni yechdingiz.",
      en: "The basis is restored, two ways of explaining are passed, the boundaries are set with a finger, the blitz is solved.",
    },
    reflectionStart: {
      ru: 'Чтобы увидеть классы числа, сначала я…',
      uz: "Son sinflarini ko'rish uchun avval men…",
      en: "To see the groups of numbers, first I...",
    },
    reflectionQuestion: {
      ru: 'Как правильно начать делить многозначное число на классы?',
      uz: "Ko'p xonali sonni sinflarga ajratishni qanday to'g'ri boshlash kerak?",
      en: "How to start dividing a multi-digit number into groups?",
    },
    reflectionOptions: [
      { ru: 'делю справа по три', uz: "o'ngdan uchtadan ajrataman", en: "divide on the right" },
      { ru: 'складываю цифры', uz: "raqamlarni qo'shaman", en: 'add the digits' },
      { ru: 'переставляю цифры', uz: 'raqamlarni almashtiraman', en: "rearrange the numbers" },
    ],
    reflectionCorrectIndex: 0,
    reflectionCorrectAudio: {
      ru: 'Верно. Начинаем справа и отделяем по три разряда. Правило подтверждено, награда открыта.',
      uz: "To'g'ri. O'ngdan boshlaymiz va xonalarni uchtadan ajratamiz. Qoida tasdiqlandi, mukofot ochildi.",
      en: "Right, we start on the right, we divide three, rule confirmed, award open.",
    },
    reflectionWrongAudio: {
      ru: 'Подумай о постоянной точке отсчёта. С какой стороны всегда находятся единицы?',
      uz: "Doimiy boshlanish nuqtasini o'ylang. Birlar har doim qaysi tomonda bo'ladi?",
      en: "Think of a constant reference point. Which side are the units always on?",
    },
    mainLabel: { ru: 'Правило', uz: 'Qoida', en: "Rule." },
    main: [
      { ru: 'Старт — справа.', uz: "Boshlanish — o'ngda.", en: "Start on the right." },
      {
        ru: 'Считай по 3 разряда.',
        uz: 'Uchtadan xona sanang.',
        en: "Count on 3.",
      },
      { ru: 'Справа: единицы → тысячи.', uz: "O'ngda: birlar → minglar.", en: "Right: Ones → thousands." },
      { ru: 'Ноль держит место.', uz: "Nol o'rinni saqlaydi.", en: "Zero holds the place." },
    ],
    nextLabel: { ru: 'Следующая задача', uz: 'Keyingi vazifa', en: "The next challenge" },
    nextText: {
      ru: 'Научить систему правильно читать и записывать многозначные числа.',
      uz: "Tizimga ko'p xonali sonlarni to'g'ri o'qish va yozishni o'rgatish.",
      en: "Teach the system to read and write multi-digit numbers correctly.",
    },
    audio: {
      ru: [
        'Практическая часть завершена. Прежние знания восстановлены, два способа изучены, граница отработана пальцем, четыре вопроса на одном экране решены.',
        'Начинаем с крайней правой цифры и отсчитываем по три разряда.',
        'Первая группа справа называется классом единиц, следующая группа классом тысяч.',
        'Финальный вопрос: как правильно начать делить многозначное число на классы? Закончи фразу: чтобы увидеть классы числа, сначала я…',
      ],
      uz: [
        "Siz ikki usuldagi tushuntirish, bonus, trenajyor va tezkor testlardan o'tdingiz. Endi qoidani mustahkamlash qoldi.",
        "Eng o'ngdagi raqamdan boshlaymiz va xonalarni uchtadan sanaymiz.",
        "O'ngdagi birinchi guruh birlar sinfi, keyingi guruh minglar sinfi deb ataladi.",
        "Yakuniy savol: ko'p xonali sonni sinflarga ajratishni qanday boshlash kerak? Gapni tugating: son sinflarini ko'rish uchun avval men…",
      ],
      en: [
        "The practice is complete. We recalled place value, studied two methods, placed the boundary ourselves and answered four questions.",
        "We start with the extreme right digit and count three digits.",
        "The first group on the right is called the ones group, the next group is called the thousands group.",
        "Final question: how do you divide a multi-digit number into groups? Complete the sentence: to see its groups, I start on the right and separate three digits.",
      ],
    },
  },

  foundationReview: {
    eyebrow: { ru: 'Опора перед уроком', uz: 'Dars oldidan tayanch', en: 'Before the lesson' },
    title: { ru: 'Вспомним разряды', uz: 'Xonalarni eslaymiz', en: "Let's remember the places." },
    lead: {
      ru: 'Даже если прошлые темы были давно, этой опоры достаточно: разряд — это место цифры, значение зависит от места, а ноль удерживает пустой разряд.',
      uz: "Oldingi mavzular ancha oldin bo'lgan bo'lsa ham, shu tayanch yetadi: xona raqamning o'rni, qiymat o'ringa bog'liq, nol esa bo'sh xonani saqlaydi.",
      en: "Even if past themes have been around for a long time, that foothold is enough: a digit is the place of a digit, a value depends on the place, and a zero keeps an empty digit.",
    },
    memoryCards: [
      {
        label: { ru: '1. Считаем справа', uz: "1. O'ngdan sanaymiz", en: "1. Count on the right." },
        text: { ru: 'Единицы → десятки → сотни.', uz: "Birlar → o'nlar → yuzlar.", en: "Ones → tens → hundreds." },
      },
      {
        label: { ru: '2. Место → значение', uz: "2. O'rin → qiymat", en: "2.Place → meaning" },
        text: { ru: 'Цифра показывает количество единиц своего разряда.', uz: "Raqam o'z xonasidagi birliklar sonini ko'rsatadi.", en: 'A digit shows how many units of its place there are.' },
      },
      {
        label: { ru: '3. Ноль держит место', uz: "3. Nol o'rinni saqlaydi", en: "3.Zero holds the spot" },
        text: { ru: 'Ноль ничего не добавляет, но не даёт цифрам сдвинуться.', uz: "Nol hech narsa qo'shmaydi, ammo raqamlarni siljitmaydi.", en: "Zero does not add anything, but does not allow the numbers to move." },
      },
    ],
    rounds: [
      {
        number: '907',
        question: { ru: 'Какая разрядная сумма точно описывает число 907?', uz: "Qaysi xona yig'indisi 907 sonini aniq ifodalaydi?", en: "What is the exact sum of 907?" },
        options: ['900 + 7', '90 + 7', '900 + 70'],
        correctIndex: 0,
        correctText: {
          ru: 'Верно. 9 стоит в сотнях, 0 удерживает десятки, 7 стоит в единицах: 900 + 0 + 7.',
          uz: "To'g'ri. 9 yuzlarda, 0 o'nlar o'rnini saqlaydi, 7 birlarda: 900 + 0 + 7.",
          en: "Right. 9 stands in hundreds, 0 holds tens, 7 stands in units: 900 + 0 + 7.",
        },
        proof: { ru: '907 = 900 + 0 + 7', uz: '907 = 900 + 0 + 7', en: '907 = 900 + 0 + 7' },
        proofLabel: { ru: '9 сотен · 0 десятков · 7 единиц', uz: "9 yuzlik · 0 o'nlik · 7 birlik", en: "9 hundred · 0 tens · 7 units" },
        wrongText: {
          ru: 'Отсчитай места справа: 7 — единицы, 0 — десятки, 9 — сотни.',
          uz: "O'ngdan sanang: 7 birlar, 0 o'nlar, 9 yuzlar xonasida.",
          en: "Count the places on the right: 7 - units, 0 - tens, 9 - hundreds.",
        },
      },
      {
        visualValues: ['507', '570'],
        question: { ru: 'Как изменилось значение цифры 7 во втором числе?', uz: "Ikkinchi sonda 7 raqamining qiymati qanday o'zgardi?", en: "How did the value of the digit 7 change in the second number?" },
        options: [
          { ru: 'увеличилось в 10 раз', uz: '10 marta oshdi', en: "multiplied" },
          { ru: 'уменьшилось в 10 раз', uz: '10 marta kamaydi', en: 'decreased tenfold' },
          { ru: 'не изменилось', uz: "o'zgarmadi", en: "has not changed" },
        ],
        correctIndex: 0,
        correctText: {
          ru: 'Точно. В 507 цифра 7 означает 7 единиц, а в 570 — 7 десятков, то есть 70.',
          uz: "Aniq. 507 da 7 yetti birlikni, 570 da esa yetti o'nlikni, ya'ni 70 ni bildiradi.",
          en: "Right. In 507, 7 is 7, and in 570, 7 is 70.",
        },
        proof: { ru: '7 единиц → 7 десятков = 70', uz: "7 birlik → 7 o'nlik = 70", en: "7 units 7 tens = 70" },
        proofLabel: { ru: 'Один разряд влево — значение в 10 раз больше', uz: "Chapga bir xona — qiymat 10 marta katta", en: "One digit to the left - the value is 10 times more" },
        wrongText: {
          ru: 'Сравни место цифры 7: во втором числе она сдвинулась на один разряд влево.',
          uz: "7 raqamining o'rnini solishtiring: ikkinchi sonda u bir xona chapga siljigan.",
          en: "Compare the digit 7: in the second number it moved one place to the left.",
        },
      },
      {
        number: '806 → 86',
        question: { ru: 'Почему нельзя убрать ноль из записи 806?', uz: "Nega 806 yozuvidan nolni olib tashlab bo'lmaydi?", en: "Why can't you take the zero out of the 806?" },
        options: [
          { ru: '6 превратится в 60', uz: '6 soni 60 ga aylanadi', en: "6 turns into 60." },
          { ru: '8 сдвинется из сотен в десятки, и число изменится', uz: "8 yuzlardan o'nlarga siljiydi va son o'zgaradi", en: "8 will move from hundreds to tens, and the number will change" },
          { ru: 'ноль всегда нужно произносить при чтении', uz: "o'qishda nolni doimo aytish kerak", en: "Zero should always be spoken when reading." },
        ],
        correctIndex: 1,
        correctText: {
          ru: 'Верно. Ноль удерживает разряд десятков. Без него 806 превратится в 86.',
          uz: "To'g'ri. Nol o'nlar xonasini saqlaydi. U bo'lmasa, 806 soni 86 ga aylanadi.",
          en: "That's right. Zero holds the tens place. Without it, 806 turns into 86.",
        },
        proof: { ru: '806 ≠ 86', uz: '806 ≠ 86', en: '806 ≠ 86' },
        proofLabel: { ru: '0 удерживает место десятков', uz: "0 o'nlar xonasini saqlaydi", en: "0 holds the place of tens" },
        wrongText: {
          ru: 'Сравни позиции восьмёрки до и после удаления нуля.',
          uz: "Nol olib tashlanguncha va undan keyin 8 raqamining o'rnini solishtiring.",
          en: "Compare the position of the eight before and after zero.",
        },
      },
    ],
    completionText: {
      ru: 'Опора восстановлена: разряд, значение цифры и роль нуля.',
      uz: "Tayanch tiklandi: xona, raqam qiymati va nolning vazifasi.",
      en: 'The foundation is restored: digit places, place values and the role of zero.',
    },
    wrongText: { ru: 'Проверь место каждой цифры справа налево.', uz: "Har bir raqam o'rnini o'ngdan chapga tekshiring.", en: "Check the location of each digit from right to left." },
    audio: {
      intro: {
        ru: [
          'Перед новой темой восстановим всю необходимую основу. Разрядом называют место цифры в записи числа.',
          'Справа налево идут единицы, десятки и сотни. Например, в числе триста двадцать шесть цифра три означает три сотни, цифра два означает два десятка, цифра шесть означает шесть единиц.',
          'Значение одной и той же цифры меняется вместе с её местом. Посмотри на цифру семь. В разряде единиц она означает семь. На один разряд левее она означает семь десятков, то есть семьдесят. Ещё на один разряд левее она означает семь сотен, то есть семьсот. Каждый шаг влево увеличивает значение в десять раз.',
          'Ноль тоже важен. Он показывает, что в разряде нет единиц, и удерживает остальные цифры на их местах.',
          'Теперь выполни три коротких задания. Они не повторяют пример из объяснения.',
        ],
        uz: [
          "Yangi mavzudan oldin kerakli asosni to'liq tiklaymiz. Xona deb raqamning son yozuvidagi o'rniga aytiladi.",
          "O'ngdan chapga birlar, o'nlar va yuzlar joylashadi. Masalan, uch yuz yigirma olti sonida uch raqami uch yuzlikni, ikki raqami ikki o'nlikni, olti raqami olti birlikni bildiradi.",
          "Bir xil raqamning qiymati o'rniga qarab o'zgaradi. Yetti raqamiga qarang. Birlar xonasida u yettini bildiradi. Bir xona chapda u yetti o'nlikni, ya'ni yetmishni bildiradi. Yana bir xona chapda esa yetti yuzlikni, ya'ni yetti yuzni bildiradi. Chapga har bir qadam qiymatni o'n marta oshiradi.",
          "Nol ham muhim. U xonada birlik yo'qligini ko'rsatadi va boshqa raqamlarni o'z joyida ushlab turadi.",
          "Endi uchta qisqa topshiriqni bajaring. Ular tushuntirishdagi misolni takrorlamaydi.",
        ],
        en: [
          "Before the new topic, let us recall the essentials. A place is the position of a digit in a number.",
          "From right to left come ones, tens and hundreds. In three hundred and twenty-six, three represents three hundreds, two represents two tens and six represents six ones.",
          "A digit's value depends on its place. Seven means seven ones, seven tens, then seven hundreds as it moves left. Each leftward step multiplies the value by ten.",
          "Zero is important, too. It shows that there are no units of that place, and it holds the rest of the digits in their place.",
          "Now, do three short tasks. They're not repeating the example from the explanation.",
        ],
      },
    },
  },

  challenge6: {
    eyebrow: { ru: 'Задача на структуру', uz: 'Tuzilishga oid masala', en: "Structure challenge" },
    title: { ru: 'Нули внутри числа', uz: 'Son ichidagi nollar', en: "Zeros inside a number" },
    lead: {
      ru: 'Здесь недостаточно просто назвать две группы. Нужно доказать, что каждая цифра осталась в своём разряде.',
      uz: "Bu yerda ikki guruhni nomlashning o'zi yetmaydi. Har bir raqam o'z xonasida qolganini isbotlash kerak.",
      en: "It's not enough to just name two groups. You have to prove that each digit remains in its own place.",
    },
    rounds: [
      {
        number: '406072',
        question: { ru: 'Какая разрядная сумма сохраняет все позиции числа?', uz: "Qaysi xona yig'indisi sonning barcha o'rinlarini saqlaydi?", en: "What is the digit sum that keeps all the positions of the number?" },
        options: [
          '400 000 + 6 000 + 70 + 2',
          '400 000 + 600 + 70 + 2',
          '400 000 + 6 000 + 700 + 2',
        ],
        correctIndex: 0,
        correctText: {
          ru: 'Верно. Нули показывают отсутствие десятков тысяч и сотен, но их позиции сохранены.',
          uz: "To'g'ri. Nollar o'n minglik va yuzlik yo'qligini ko'rsatadi, ammo ularning o'rni saqlangan.",
          en: "Right. The zeros show the absence of tens of thousands and hundreds, but their positions are preserved.",
        },
        proof: { ru: '406 | 072 = 400 000 + 6 000 + 70 + 2', uz: '406 | 072 = 400 000 + 6 000 + 70 + 2', en: '406 | 072 = 400 000 + 6 000 + 70 + 2' },
        proofLabel: { ru: 'Каждая ненулевая цифра сохранила свой разряд', uz: "Har bir noldan boshqa raqam o'z xonasida qoldi", en: "Each non-zero digit has retained its place." },
        wrongText: {
          ru: 'Раздели мысленно число на 406 и 072, затем назови значение каждой ненулевой цифры.',
          uz: "Sonni xayolan 406 va 072 ga ajrating, so'ng har bir noldan boshqa raqam qiymatini ayting.",
          en: "Divide the number by 406 and 072, then name the value of each non-zero digit.",
        },
      },
      {
        visualValues: ['406072', '46072'],
        question: { ru: 'Что произошло после удаления внутреннего нуля?', uz: "Ichki nol olib tashlangach nima sodir bo'ldi?", en: "What Happened After Removing the Internal Zero?" },
        options: [
          { ru: 'значение не изменилось', uz: "qiymat o'zgarmadi", en: "meaning has not changed" },
          { ru: 'цифры слева сдвинулись в другие разряды, число изменилось', uz: "chapdagi raqamlar boshqa xonalarga siljidi, son o'zgardi", en: "The numbers on the left moved to other places, the number has changed." },
          { ru: 'изменилась только запись, но не число', uz: "faqat yozuv o'zgardi, son esa yo'q", en: "Only the record has changed, not the number." },
        ],
        correctIndex: 1,
        correctText: {
          ru: 'Именно. Ноль был держателем места. После его удаления цифры 4 и 6 оказались в меньших разрядах.',
          uz: "Aynan shunday. Nol o'rinni saqlagan edi. U olib tashlangach, 4 va 6 kichikroq xonalarga o'tdi.",
          en: "That's right. Zero was the placeholder, and when it was removed, the numbers 4 and 6 were in the lower digits.",
        },
        proof: { ru: '406 072 → 46 072', uz: '406 072 → 46 072', en: '406 072 → 46 072' },
        proofLabel: { ru: 'Удалили место — левые цифры сдвинулись', uz: "O'rin olib tashlandi — chapdagi raqamlar siljidi", en: "Removed space - left-leaning numbers moved" },
        wrongText: {
          ru: 'Сравни разряд цифры 4 в обеих записях.',
          uz: "Ikkala yozuvda 4 raqamining xonasini solishtiring.",
          en: "Compare the digit 4 in both numbers.",
        },
      },
      {
        number: '406072',
        question: {
          ru: 'Если увеличить цифру 6 на 1, не меняя её разряд, на сколько увеличится число?',
          uz: "6 raqamini o'z xonasida 1 ga oshirsak, son qanchaga ortadi?",
          en: "If you increase the digit 6 by 1, without changing its place, how much will the number increase?",
        },
        options: ['100', '1 000', '10 000'],
        correctIndex: 1,
        correctText: {
          ru: 'Верно. Цифра 6 стоит в разряде единиц тысяч, поэтому одна дополнительная единица этого разряда равна 1 000.',
          uz: "To'g'ri. 6 raqami minglar xonasida, shu xonaning bitta qo'shimcha birligi 1 000 ga teng.",
          en: 'That is right. The digit 6 is in the thousands place, so one additional unit of this place is 1,000.',
        },
        proof: { ru: '6 000 + 1 000 = 7 000', uz: '6 000 + 1 000 = 7 000', en: '6 000 + 1 000 = 7 000' },
        proofVisual: {
          type: 'column',
          operator: '+',
          top: '6 000',
          bottom: '1 000',
          result: '7 000',
        },
        proofLabel: { ru: 'Одна единица разряда тысяч равна 1 000', uz: "Minglar xonasining bir birligi 1 000 ga teng", en: "One unit of the order of a thousand is 1,000." },
        wrongText: {
          ru: 'Сначала поставь границу 406 | 072 и назови разряд цифры 6.',
          uz: "Avval 406 | 072 chegarasini qo'ying va 6 raqamining xonasini ayting.",
          en: "First, set the boundary 406 | 072 and name the digit 6.",
        },
      },
    ],
    completionText: {
      ru: 'Доказано: границы классов и нули вместе сохраняют точную структуру числа.',
      uz: "Isbotlandi: sinf chegaralari va nollar birgalikda sonning aniq tuzilishini saqlaydi.",
      en: "It is proved that the boundaries of groups and zeros together preserve the exact structure of the number.",
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
        "Uchinchi savolda olti raqamining xonasini toping. Raqamning birga o'zgarishi sonni aynan shu xonaning bir birligiga o'zgartiradi.",
      ],
      en: [
        "Now the problem is more complex. The code four hundred and six thousand and seventy-two contains internal zeros.",
        "Don't read the options first. Mentally separate the three digits on the right and determine the value of each non-zero digit.",
        "In the second question, compare the original notation with the notation missing one zero.",
        "In the third question, find the place of the digit six. Increasing the digit by one increases the number by one unit of that place.",
      ],
    },
  },

  challenge7: {
    eyebrow: { ru: 'Математический детектив', uz: 'Matematik detektiv', en: "Mathematical detective" },
    title: { ru: 'Значение цифры 7', uz: '7 raqamining qiymati', en: "Meaning of the digit 7" },
    lead: {
      ru: 'Сравни числа 274 305 и 247 350. Цифры похожи, но их позиции различаются.',
      uz: "274 305 va 247 350 sonlarini solishtiring. Raqamlar o'xshash, ammo o'rinlari turlicha.",
      en: "Compare the numbers 274 305 and 247 350. The numbers are similar, but their positions differ.",
    },
    rounds: [
      {
        visualValues: ['274 305', '247 350'],
        question: { ru: 'Какая пара верно показывает значение цифры 7?', uz: "Qaysi juftlik 7 raqamining qiymatini to'g'ri ko'rsatadi?", en: "Which pair correctly shows the value of the digit 7?" },
        options: [
          { ru: '70 000 и 7 000', uz: '70 000 va 7 000', en: "70,000 and 7,000" },
          { ru: '7 000 и 70 000', uz: '7 000 va 70 000', en: "7,000 and 70,000." },
          { ru: '700 и 700', uz: '700 va 700', en: "700 and 700" },
        ],
        correctIndex: 0,
        correctText: {
          ru: 'Верно. В первом числе 7 стоит в десятках тысяч, во втором — в единицах тысяч.',
          uz: "To'g'ri. Birinchi sonda 7 o'n minglar, ikkinchisida bir minglar xonasida.",
          en: "Right. In the first number, 7 is in the tens of thousands, in the second, in units of thousands.",
        },
        proof: { ru: '274 | 305: 7 = 70 000 · 247 | 350: 7 = 7 000', uz: '274 | 305: 7 = 70 000 · 247 | 350: 7 = 7 000', en: '274 | 305: 7 = 70 000 · 247 | 350: 7 = 7 000' },
        proofVisual: {
          type: 'place-values',
          rows: [
            {
              number: '274 305',
              place: { ru: '7 в десятках тысяч', uz: "7 o'n minglar xonasida", en: "7 in the tens of thousands" },
              value: '70 000',
            },
            {
              number: '247 350',
              place: { ru: '7 в единицах тысяч', uz: '7 minglar xonasida', en: "7 in units of thousands" },
              value: '7 000',
            },
          ],
        },
        proofLabel: { ru: 'Одинаковая цифра — разные разряды', uz: 'Bir xil raqam — turli xonalar', en: "Same digit — different places" },
        wrongText: {
          ru: 'Сначала поставь границу классов, затем найди столбец цифры 7 в каждом числе.',
          uz: "Avval sinflar chegarasini qo'ying, keyin har bir sonda 7 raqamining ustunini toping.",
          en: "First set the group boundary, then find the 7 column in each number.",
        },
      },
      {
        visualValues: ['70 000', '7 000'],
        question: { ru: 'Во сколько раз первое значение больше второго?', uz: 'Birinchi qiymat ikkinchisidan necha marta katta?', en: "How many times is the first value greater than the second?" },
        options: ['7', '10', '100'],
        correctIndex: 1,
        correctText: {
          ru: 'Верно. Переход на один разряд влево увеличивает значение цифры в 10 раз.',
          uz: "To'g'ri. Bir xona chapga o'tish raqam qiymatini 10 marta oshiradi.",
          en: "That is right. Moving one place to the left makes the digit's value ten times greater.",
        },
        proof: { ru: '70 000 = 7 000 × 10', uz: '70 000 = 7 000 × 10', en: '70 000 = 7 000 × 10' },
        proofLabel: { ru: 'Один разряд влево', uz: 'Chapga bir xona', en: "One to the left" },
        wrongText: {
          ru: 'Сравни 70 000 и 7 000: сколько раз по 7 000 содержится в 70 000?',
          uz: "70 000 va 7 000 ni solishtiring: 70 000 da nechta 7 000 bor?",
          en: "70,000 vs. 7,000: How many times is 7000 contained in 70,000?",
        },
      },
      {
        visualValues: ['70 000', '7 000'],
        question: { ru: 'На сколько первое значение больше второго?', uz: 'Birinchi qiymat ikkinchisidan qanchaga katta?', en: "How much is the first value greater than the second?" },
        options: ['7 000', '63 000', '77 000'],
        correctIndex: 1,
        correctText: {
          ru: 'Верно. 70 000 − 7 000 = 63 000. Сравниваются не цифры, а их разрядные значения.',
          uz: "To'g'ri. 70 000 − 7 000 = 63 000. Siz raqamlarni emas, ularning xona qiymatlarini solishtirdingiz.",
          en: "That's right. 70,000 to 7000 = 63,000. It's not the numbers that are compared, it's the place values.",
        },
        proof: { ru: '70 000 − 7 000 = 63 000', uz: '70 000 − 7 000 = 63 000', en: '70 000 − 7 000 = 63 000' },
        proofVisual: {
          type: 'column',
          operator: '−',
          top: '70 000',
          bottom: '7 000',
          result: '63 000',
        },
        proofLabel: { ru: '«На сколько» — находим разность', uz: '«Qanchaga» — ayirmani topamiz', en: "\"How much\" - we find the difference" },
        wrongText: {
          ru: 'Вопрос «на сколько» требует найти разность: вычти 7 000 из 70 000.',
          uz: "«Qanchaga» savoli ayirmani topishni talab qiladi: 70 000 dan 7 000 ni ayiring.",
          en: "The “how much” question requires finding the difference: subtract 7,000 out of 70,000.",
        },
      },
    ],
    completionText: {
      ru: 'Вывод найден: место цифры определяет её разряд, а разряд — её значение.',
      uz: "Xulosa topildi: raqamning o'rni uning xonasini, xona esa qiymatini belgilaydi.",
      en: "The conclusion is found: the place of a digit determines its place, and the place determines its value.",
    },
    audio: {
      ru: [
        'Сравним два шестизначных числа с похожим набором цифр. Нас интересует только цифра семь.',
        'Сначала найди класс и разряд семёрки в каждом числе. Затем сравни полученные значения.',
        'Во втором вопросе используй связь соседних разрядов: каждый разряд слева в десять раз крупнее соседнего справа.',
        'В третьем вопросе обрати внимание на слова на сколько. Здесь нужна разность двух разрядных значений.',
      ],
      uz: [
        "Raqamlari o'xshash ikkita olti xonali sonni solishtiramiz. Bizni faqat yetti raqami qiziqtiradi.",
        "Avval har bir sonda yetti raqamining sinfi va xonasini toping. Keyin hosil bo'lgan qiymatlarni solishtiring.",
        "Ikkinchi savolda qo'shni xonalar bog'lanishidan foydalaning: chapdagi har bir xona o'ngdagi qo'shnisidan o'n marta katta.",
        "Uchinchi savolda qanchaga so'ziga e'tibor bering. Bu yerda ikki xona qiymatining ayirmasi kerak.",
      ],
      en: [
        "Compare two six-digit numbers with a similar set of digits. We're only interested in seven.",
        "First, find the group and the place of seven in each number, and then compare the values.",
        "In the second question, use the connection of neighbouring places: each place value on the left is ten times as great as the next one on the right.",
        "In the third question, pay attention to the words how much. It's about the difference between two place values.",
      ],
    },
  },

  dividerGuided: {
    eyebrow: { ru: 'Тренажёр жеста', uz: 'Barmoq bilan trenajyor', en: "Gesture simulator" },
    title: { ru: 'Поставь границу: 73506', uz: "Chegarani qo'ying: 73506", en: "Set the boundary: 73506" },
    raw: '73506',
    correctGap: 2,
    result: '73 | 506',
    lead: {
      ru: 'Не выбирай готовый ответ. Коснись пальцем нужного промежутка между цифрами.',
      uz: "Tayyor javobni tanlamang. Raqamlar orasidagi kerakli joyga barmoq bilan teging.",
      en: "Don't pick the answer. Tap the right gap between the numbers.",
    },
    guideTitle: { ru: 'Считай справа', uz: "O'ngdan sanang", en: "Count to the right." },
    guideText: {
      ru: 'Поставь палец на крайнюю правую цифру. Считай: один, два, три — и коснись промежутка перед третьей цифрой.',
      uz: "Barmog'ingizni eng o'ngdagi raqamga qo'ying. Bir, ikki, uch deb sanang va uchinchi raqam oldidagi oraliqqa teging.",
      en: "Put your finger on the extreme right digit, count one, two, three, and touch the gap before the third digit.",
    },
    instruction: {
      ru: 'Промежуток → «Проверить».',
      uz: 'Oraliq → «Tekshirish».',
      en: "The interval is to \"check.\"",
    },
    correctText: {
      ru: 'Верно. Справа отсчитаны 6, 0, 5. Граница стоит перед этой тройкой: 73 | 506.',
      uz: "To'g'ri. O'ngdan 6, 0, 5 sanaldi. Chegara shu uchlik oldida: 73 | 506.",
      en: "Right. On the right, counted 6, 0, 5. The boundary is in front of this three: 73 | 506.",
    },
    wrongText: {
      ru: 'Пока не здесь. Верни палец к правой цифре и медленно отсчитай ровно три позиции.',
      uz: "Hozircha bu joy emas. Barmog'ingizni o'ngdagi raqamga qaytaring va sekin roppa-rosa uchta o'rin sanang.",
      en: "Put your finger back to the right digit and slowly count down exactly three positions.",
    },
    audio: {
      ru: [
        'Теперь ты сам поставишь границу, как в настоящей записи числа.',
        'Положи палец на крайнюю правую цифру шесть. Это первая позиция. Двигайся влево. Ноль вторая позиция, пять третья.',
        'После третьей позиции коснись промежутка перед ней. Готового варианта на экране нет: место выбираешь ты.',
      ],
      uz: [
        "Endi haqiqiy son yozuvidagidek chegarani o'zingiz qo'yasiz.",
        "Barmog'ingizni eng o'ngdagi olti raqamiga qo'ying. Bu birinchi o'rin. Chapga yuring, nol ikkinchi, besh uchinchi.",
        "Uchinchi o'rindan keyin uning oldidagi oraliqqa teging. Ekranda tayyor variant yo'q: joyni o'zingiz tanlaysiz.",
      ],
      en: [
        "Now you're going to set the boundary, like in standard notation.",
        "Start with the rightmost digit, six. That's the first position. Move left: zero is the second digit and five is the third.",
        "After the third position, touch the gap in front of it. There's no ready-made version on the screen: you choose the place.",
      ],
    },
  },

  dividerIndependent: {
    eyebrow: { ru: 'Самостоятельная практика', uz: 'Mustaqil mashq', en: "Independent practice" },
    title: { ru: 'Поставь границу: 348216', uz: "Chegarani qo'ying: 348216", en: "Set the boundary: 348216" },
    raw: '348216',
    correctGap: 3,
    result: '348 | 216',
    lead: {
      ru: 'Теперь без счётных меток. Поставь границу пальцем и объясни себе, почему она именно там.',
      uz: "Endi sanash belgilarisiz. Chegarani barmoq bilan qo'ying va nima uchun aynan shu joydaligini o'zingizga tushuntiring.",
      en: "Put your finger on the border and explain to yourself why it's there.",
    },
    instruction: {
      ru: 'Справа 3 цифры → промежуток.',
      uz: "O'ngdan 3 raqam → oraliq.",
      en: "On the right is 3 digits → span.",
    },
    correctText: {
      ru: 'Верно. Два класса построены самостоятельно: 348 | 216.',
      uz: "To'g'ri. Siz mustaqil ravishda ikkita sinf tuzdingiz: 348 | 216.",
      en: "That's right. Two groups are self-built: 348 | 216.",
    },
    wrongText: {
      ru: 'Граница сместилась. Не считай слева: вернись к последней цифре и возьми справа ровно три.',
      uz: "Chegara siljidi. Chapdan sanamang: oxirgi raqamga qayting va o'ngdan roppa-rosa uchtasini oling.",
      en: "The boundary has shifted. Don't count on the left: go back to the last digit and take exactly three on the right.",
    },
    audio: {
      ru: [
        'Правило собрано. Проверим, можешь ли ты выполнить главное действие без готовых вариантов.',
        'Перед тобой код триста сорок восемь тысяч двести шестнадцать без пробела. Начни с крайней правой цифры и отсчитай три позиции.',
        'Коснись только одного промежутка. После проверки назови правый и левый классы.',
      ],
      uz: [
        "Qoida yig'ildi. Asosiy harakatni tayyor variantlarsiz bajara olishingizni tekshiramiz.",
        "Oldingizda bo'shliqsiz uch yuz qirq sakkiz ming ikki yuz o'n olti kodi turibdi. Eng o'ngdagi raqamdan boshlang va uchta o'rinni sanang.",
        "Faqat bitta oraliqqa teging. Tekshirgach, o'ng va chap sinflarni nomlang.",
      ],
      en: [
        "Let's see if you can do the main thing without the options.",
        "Here's a code of three hundred and forty-eight thousand two hundred and sixteen without a space. Start with the extreme right digit and count three positions.",
        "Select only one gap. After checking, name the groups on the right and left.",
      ],
    },
  },

  rapidTest: {
    eyebrow: { ru: 'Единый быстрый тест', uz: 'Yagona tezkor test', en: "One quick test." },
    title: { ru: 'Блиц: 4 вопроса', uz: 'Blits: 4 savol', en: "Blitz: 4 questions" },
    lead: {
      ru: 'Отвечай быстро, но не угадывай. После ответа следующий вопрос откроется здесь же.',
      uz: "Tez javob bering, ammo taxmin qilmang. Javobdan keyin keyingi savol shu yerning o'zida ochiladi.",
      en: "Answer quickly, but don't guess. After the answer, the next question will open here.",
    },
    progressLabel: { ru: 'Блиц-панель', uz: 'Blits paneli', en: "Blitz panel." },
    completionText: { ru: 'Блиц завершён. Все четыре решения собраны.', uz: "Blits tugadi. To'rtta yechim ham yig'ildi.", en: "The blitz is complete. All four solutions are assembled." },
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
      en: [
        "Now complete four short checks on one screen.",
        "In each question, first find the group or place on the right, and only then choose the answer.",
        "After Bit's reaction, press the next question button, the first-attempt result will be saved for the award.",
      ],
    },
  },

  // Revised explanation sequence: two methods, a bonus case, then independent practice.
  method1: {
    eyebrow: { ru: 'Способ 1 · считаем справа', uz: "1-usul · o'ngdan sanaymiz", en: "Method 1 is used on the right." },
    title: { ru: 'Способ 1. Считаем справа', uz: "1-usul. O'ngdan sanaymiz", en: "Method 1. Count on the right." },
    digits: ['6', '3', '0', '4'],
    boundaryAfter: 0,
    showTable: false,
    leftRevealPhase: 3,
    methodBadge: { ru: 'Способ 1 · по три разряда', uz: '1-usul · uchtadan xona', en: "Method 1 · Three-place" },
    explanationLead: {
      ru: 'Сначала поймём, зачем нужен новый способ, и только затем медленно разберём число 6304.',
      uz: "Avval yangi usul nima uchun kerakligini tushunamiz, keyin 6304 sonini sekin tahlil qilamiz.",
      en: "First we understand why we need a new method, and then we slowly understand the digit 6304.",
    },
    interactionIntro: {
      ru: 'Перед тобой восемь карточек объяснения. Нажми первую карточку, затем открывай остальные по порядку. После каждого нажатия Бит объяснит один шаг.',
      uz: "Oldingizda sakkizta tushuntirish kartasi bor. Birinchi kartani bosing, keyin qolganlarini tartib bilan oching. Har bosganda Bit bitta qadamni tushuntiradi.",
      en: "You have eight explanatory cards in front of you, press the first card, then open the rest in order, and after each click, Bit will explain one step.",
    },
    startPrompt: {
      ru: 'Нажми карточку 1.',
      uz: '1-kartani bosing.',
      en: "Press card 1.",
    },
    explanationSteps: [
      {
        label: { ru: 'Новая трудность', uz: 'Yangi qiyinchilik', en: "A new challenge" },
        shortText: { ru: 'До 999 — три разряда. Здесь цифр четыре.', uz: "999 gacha uch xona. Bu yerda to'rtta raqam.", en: "Up to 999 is three digits. There are four digits here." },
        text: {
          ru: 'До 999 нам хватало трёх знакомых разрядов: единиц, десятков и сотен. В числе 6304 появилась четвёртая цифра. Нужен способ понять её место, не меняя запись.',
          uz: "999 gacha uchta tanish xona yetarli edi: birlar, o'nlar va yuzlar. 6304 sonida to'rtinchi raqam paydo bo'ldi. Yozuvni o'zgartirmasdan uning o'rnini tushunish usuli kerak.",
          en: 'Up to 999, we used three familiar places: ones, tens and hundreds. In 6,304, a fourth digit appears, so we need a way to identify its place without changing the notation.',
        },
        visualPhase: 0,
      },
      {
        label: { ru: 'Тройка разрядов', uz: 'Uchta xona', en: "Three places." },
        shortText: { ru: 'Разряды объединяются по три.', uz: 'Xonalar uchtadan birlashadi.', en: "The places are combined by three." },
        text: {
          ru: 'Математическая система не придумывает новое правило для каждой цифры. Она снова собирает знакомый блок из единиц, десятков и сотен, а затем начинает следующий блок.',
          uz: "Matematik tizim har bir raqam uchun yangi qoida o'ylab topmaydi. U tanish birlar, o'nlar va yuzlar blokini yana yig'adi, keyin keyingi blokni boshlaydi.",
          en: "A mathematical system doesn't come up with a new rule for each digit; it reassembles a familiar block of units, tens and hundreds, and then starts the next block.",
        },
        visualPhase: 0,
      },
      {
        label: { ru: 'Старт справа', uz: "O'ngdan boshlaymiz", en: "Start on the right" },
        shortText: { ru: 'Точка отсчёта — справа.', uz: "Boshlanish — o'ngda.", en: "The starting point is on the right." },
        text: {
          ru: 'Крайняя правая цифра любого целого числа всегда означает единицы. Поэтому справа есть точная точка отсчёта, а слева длина числа может быть разной.',
          uz: "Har qanday butun sonning eng o'ngdagi raqami doimo birlarni bildiradi. Shuning uchun o'ngda aniq boshlanish nuqtasi bor, chap tomondagi uzunlik esa turlicha bo'lishi mumkin.",
          en: "The extreme right digit of any integer always stands for one, so on the right is the exact reference point, and on the left, the length of the number can be different.",
        },
        visualPhase: 0,
      },
      {
        label: { ru: 'Ед. · дес. · сот.', uz: "Bir · o'n · yuz", en: "Food. Des. Cells." },
        shortText: { ru: '4 ед. · 0 дес. · 3 сот.', uz: "4 bir · 0 o'n · 3 yuz.", en: "4 units. · 0 deci. · 3 hundred." },
        text: {
          ru: 'Начинаем с 4 единиц, затем видим 0 десятков и 3 сотни. Ноль не пропускаем: он показывает пустой разряд десятков и сохраняет место тройки.',
          uz: "4 birlikdan boshlaymiz, keyin 0 o'nlik va 3 yuzlikni ko'ramiz. Nolni tashlab yubormaymiz: u bo'sh o'nlar xonasini va uchlik o'rnini saqlaydi.",
          en: "We start with 4 units, then we see 0 tens and 3 hundred. Zero is not missed: it shows the empty tens place and saves the place of three.",
        },
        visualPhase: 1,
      },
      {
        label: { ru: 'Класс единиц', uz: 'Birlar sinfi', en: "Ones group" },
        shortText: { ru: '304 — класс единиц.', uz: '304 — birlar sinfi.', en: "304 is a ones group." },
        text: {
          ru: 'Три разряда справа — сотни, десятки и единицы — образовали 304. Эту законченную тройку называем классом единиц.',
          uz: "O'ngdagi uchta xona — yuzlar, o'nlar va birlar — 304 ni hosil qildi. Bu tugallangan uchlik birlar sinfi deb ataladi.",
          en: "The three digits on the right -- hundreds, tens, and ones -- made 304, and we call that complete three a ones group.",
        },
        visualPhase: 1,
      },
      {
        label: { ru: 'Граница', uz: 'Chegara', en: "The border" },
        shortText: { ru: '6304 → 6 | 304', uz: '6304 → 6 | 304', en: '6304 → 6 | 304' },
        text: {
          ru: 'После третьего разряда ставим границу. Мы не меняем порядок цифр, а только показываем устройство числа.',
          uz: "Uchinchi xonadan keyin chegara qo'yamiz. Raqamlar tartibini o'zgartirmaymiz, faqat sonning tuzilishini ko'rsatamiz.",
          en: "After the third place, we put a boundary. We don't change the order of the numbers, we just show the device of the number.",
        },
        visualPhase: 2,
      },
      {
        label: { ru: 'Класс тысяч', uz: 'Minglar sinfi', en: "Thousands group" },
        shortText: { ru: '6 — это 6 тысяч.', uz: '6 — bu 6 ming.', en: "6 is 6,000." },
        text: {
          ru: 'Слева осталась цифра 6. После полной тройки она уже не сотни, а шесть единиц следующего класса — шесть тысяч. Это класс тысяч.',
          uz: "Chapda 6 raqami qoldi. To'liq uchlikdan keyin u yuzlik emas, keyingi sinfning olti birligi, ya'ni olti ming bo'ladi. Bu minglar sinfi.",
          en: "On the left is the digit 6. After the full three, it's not hundreds, it's six units of the next group -- six thousand. It's a thousands group.",
        },
        visualPhase: 3,
      },
      {
        label: { ru: 'Чтение', uz: "O'qish", en: "Reading" },
        shortText: { ru: '6 | 304 читаем по классам.', uz: "6 | 304 ni sinflar bo'yicha o'qiymiz.", en: "6 | 304 read by group." },
        text: {
          ru: 'Читаем слева направо: шесть тысяч триста четыре. Слово «тысяч» подтверждает левый класс, а 304 читается как обычное трёхзначное число.',
          uz: "Chapdan o'ngga o'qiymiz: olti ming uch yuz to'rt. «Ming» so'zi chap sinfni tasdiqlaydi, 304 esa odatiy uch xonali son kabi o'qiladi.",
          en: "Read from left to right: six thousand three hundred and four. The word \"thousand\" confirms the group on the left, and 304 reads as the usual three-digit number.",
        },
        visualPhase: 3,
      },
    ],
    resultText: {
      ru: 'Справа → по 3 разряда → граница.',
      uz: "O'ngdan → 3 xona → chegara.",
      en: "On the right, there are 3 lines to the border.",
    },
    replayLabel: { ru: 'Повторить способ', uz: 'Usulni takrorlash', en: "Repeat" },
    audio: {
      ru: [
        'До числа девятьсот девяносто девять нам хватало единиц, десятков и сотен. В числе шесть тысяч триста четыре появилась четвёртая цифра. Нужно определить её место, не переставляя цифры.',
        'Система разрядов повторяется блоками. Сначала собираются знакомые единицы, десятки и сотни. После этого начинается следующий такой блок, только уже для тысяч.',
        'Надёжная точка отсчёта находится справа. Крайняя правая цифра любого целого числа всегда показывает единицы, поэтому разбор начинаем именно от неё.',
        'Четыре стоит в единицах. Слева от неё ноль десятков и три сотни. Ноль не исчезает: он удерживает пустой разряд десятков.',
        'Сотни, десятки и единицы вместе дали группу триста четыре. Это первая тройка справа, поэтому она называется классом единиц.',
        'После третьего разряда ставим границу. Порядок цифр не меняется, мы только показываем строение числа.',
        'Слева осталась цифра шесть. После полной тройки она означает шесть тысяч и открывает класс тысяч.',
        'Проверяем результат чтением слева направо: шесть тысяч триста четыре. Слово тысяч подтверждает место левой цифры.',
      ],
      uz: [
        "To'qqiz yuz to'qson to'qqiz sonigacha birlar, o'nlar va yuzlar yetarli edi. Olti ming uch yuz to'rt sonida to'rtinchi raqam paydo bo'ldi. Raqamlarni almashtirmasdan uning o'rnini aniqlash kerak.",
        "Xonalar tizimi bloklar bo'yicha takrorlanadi. Avval tanish birlar, o'nlar va yuzlar yig'iladi. Shundan keyin minglar uchun keyingi blok boshlanadi.",
        "Ishonchli boshlanish nuqtasi o'ngda. Har qanday butun sonning eng o'ngdagi raqami birlarni ko'rsatadi, shuning uchun tahlilni aynan undan boshlaymiz.",
        "To'rt birlarda turadi, uning chapida nol o'nlar va uch yuzlar bor. Nol yo'qolmaydi: u bo'sh o'nlar xonasini saqlaydi.",
        "Yuzlar, o'nlar va birlar birgalikda uch yuz to'rt guruhini berdi. Bu o'ngdagi birinchi uchlik, shuning uchun u birlar sinfi deb ataladi.",
        "Uchinchi xonadan keyin chegara qo'yamiz. Raqamlar tartibi o'zgarmaydi, faqat sonning tuzilishi ko'rinadi.",
        "Chapda olti raqami qoldi. To'liq uchlikdan keyin u olti mingni bildiradi va minglar sinfini ochadi.",
        "Natijani chapdan o'ngga o'qib tekshiramiz: olti ming uch yuz to'rt. Ming so'zi chap raqamning o'rnini tasdiqlaydi.",
      ],
      en: [
        'Up to nine hundred and ninety-nine, only ones, tens and hundreds were needed. Six thousand three hundred and four adds a fourth digit whose place must be identified.',
        "The place-value system repeats itself in blocks. First come the familiar ones, tens and hundreds, then the next block starts, only for the thousands.",
        "The reliable reference point is on the right, and the rightmost digit of any whole number is always in the ones place, so that's where we start.",
        "Four is in the ones place. To its left are zero tens and three hundreds. Zero doesn't disappear: it holds the empty tens place.",
        "Hundreds, tens and ones together form the group three hundred and four. Those are the three digits on the right, so it is called a ones group.",
        "After the third place, we put a boundary. The order of the digits does not change, we just show the structure of the number.",
        "On the left is the digit six. After the complete group of three, it means six thousand and opens the thousands group.",
        "Check the result by reading from left to right: six thousand three hundred and four. The word thousand confirms the place of the digit on the left.",
      ],
    },
  },
  method2: {
    eyebrow: { ru: 'Способ 2 · таблица классов', uz: '2-usul · sinflar jadvali', en: "Method 2 · Place-value chart" },
    title: { ru: 'Способ 2. Таблица классов', uz: '2-usul. Sinflar jadvali', en: "Method 2: Place-value chart" },
    digits: ['4', '8', '2', '0', '1', '9'],
    boundaryAfter: 2,
    showTable: true,
    tableTransfer: true,
    methodBadge: { ru: 'Способ 2 · таблица мест', uz: "2-usul · o'rinlar jadvali", en: "Method 2 · table of places" },
    explanationLead: {
      ru: 'Таблица — это карта мест. Сначала все клетки пусты, затем каждая цифра медленно переходит в свой разряд.',
      uz: "Jadval o'rinlar xaritasidir. Avval barcha kataklar bo'sh, keyin har bir raqam sekin o'z xonasiga o'tadi.",
      en: "A table is a map of places. First, all the cells are empty, then each digit slowly goes into its own place.",
    },
    interactionIntro: {
      ru: 'Теперь ты управляешь таблицей. Нажимай карточки по порядку: Бит объяснит действие, а цифры плавно перейдут в нужные клетки.',
      uz: "Endi jadvalni siz boshqarasiz. Kartalarni tartib bilan bosing: Bit harakatni tushuntiradi, raqamlar esa kerakli kataklarga sekin o'tadi.",
      en: "Now you control the table. Press the cards in order: Bit will explain the action, and the digits will move smoothly into the correct cells.",
    },
    startPrompt: {
      ru: 'Нажми карточку 1.',
      uz: '1-kartani bosing.',
      en: "Press card 1.",
    },
    explanationSteps: [
      {
        label: { ru: 'Пустые клетки', uz: "Bo'sh kataklar", en: "Empty cells" },
        shortText: { ru: 'Два класса — шесть мест.', uz: "Ikki sinf — oltita o'rin.", en: "Two groups, six places." },
        text: {
          ru: 'Пока не переносим ни одной цифры. Рассматриваем шесть пустых клеток: справа три места класса единиц, слева три места класса тысяч.',
          uz: "Hozircha hech bir raqamni ko'chirmaymiz. Oltita bo'sh katakni ko'ramiz: o'ngda birlar sinfining uch o'rni, chapda minglar sinfining uch o'rni.",
          en: "We're looking at six empty cells: three units on the right, three thousand on the left.",
        },
        visualPhase: 0,
      },
      {
        label: { ru: 'Справа: 019', uz: "O'ngda: 019", en: "Right: 019" },
        shortText: { ru: '019 — класс единиц.', uz: '019 — birlar sinfi.', en: "019 is a ones group." },
        text: {
          ru: 'Ставим 9 в единицы, 1 в десятки, 0 в сотни. Получился класс единиц 019.',
          uz: "9 ni birlarga, 1 ni o'nlarga, 0 ni yuzlarga qo'yamiz. 019 birlar sinfi hosil bo'ldi.",
          en: "We put 9 in units, 1 in tens, 0 in hundreds, and we get a group of 019 units.",
        },
        visualPhase: 1,
      },
      {
        label: { ru: 'Слева: 482', uz: 'Chapda: 482', en: "Left: 482" },
        shortText: { ru: '482 — класс тысяч.', uz: '482 — minglar sinfi.', en: "482 is a thousands group." },
        text: {
          ru: 'Следующие цифры занимают разряды тысяч: 2 тысячи, 8 десятков тысяч и 4 сотни тысяч.',
          uz: "Keyingi raqamlar minglar xonalarini egallaydi: 2 minglik, 8 o'n minglik va 4 yuz minglik.",
          en: "The following digits occupy the places of thousands: 2,000, 8,000 and 4,000.",
        },
        visualPhase: 2,
      },
      {
        label: { ru: 'Ноль', uz: 'Nol', en: "Zero." },
        shortText: { ru: 'Ноль держит сотни.', uz: "Nol yuzlar o'rnini saqlaydi.", en: "Zero holds hundreds." },
        text: {
          ru: 'Ноль в разряде сотен нельзя убирать. Иначе цифры 1 и 9 сдвинутся и число изменится.',
          uz: "Yuzlar xonasidagi nolni olib tashlab bo'lmaydi. Aks holda 1 va 9 siljiydi va son o'zgaradi.",
          en: "Zero in the hundreds place can not be removed, otherwise the numbers 1 and 9 will move and the number will change.",
        },
        visualPhase: 3,
      },
      {
        label: { ru: 'Чтение', uz: "O'qish", en: "Reading" },
        shortText: { ru: '482 | 019', uz: '482 | 019', en: '482 | 019' },
        text: {
          ru: 'Сначала читаем 482 тысячи. Затем 019 читаем как девятнадцать: четыреста восемьдесят две тысячи девятнадцать.',
          uz: "Avval 482 mingni o'qiymiz. Keyin 019 ni o'n to'qqiz deb o'qiymiz: to'rt yuz sakson ikki ming o'n to'qqiz.",
          en: "First we read 482,000. Then 019 read as nineteen: four hundred and eighty-two thousand nineteen.",
        },
        visualPhase: 3,
      },
    ],
    resultText: {
      ru: 'Таблицу заполняем справа налево.',
      uz: "Jadvalni o'ngdan chapga to'ldiramiz.",
      en: "Fill in the table from right to left.",
    },
    replayLabel: { ru: 'Повторить способ', uz: 'Usulni takrorlash', en: "Repeat" },
    audio: {
      ru: [
        'Второй способ нужен, когда важно проверить место каждой цифры. Перед нами таблица из двух блоков по три разряда. Сейчас все шесть клеток пусты, а цифры находятся над таблицей.',
        'Начинаем заполнение справа, потому что там находится разряд единиц. Девять плавно переходит в единицы, один в десятки, ноль в сотни. Так собирается правый класс ноль один девять.',
        'Не меняя направления, продолжаем в классе тысяч. Два переходит в единицы тысяч, восемь в десятки тысяч, четыре в сотни тысяч.',
        'Ноль в разряде сотен нельзя пропускать. Он удерживает остальные цифры на правильных местах.',
        'Читаем классы слева направо: четыреста восемьдесят две тысячи девятнадцать.',
      ],
      uz: [
        "Ikkinchi usul har bir raqam o'rnini tekshirish kerak bo'lganda qo'llanadi. Oldimizda uchtadan xonali ikkita blok bor. Hozir oltita katakning hammasi bo'sh, raqamlar esa jadval ustida turibdi.",
        "To'ldirishni o'ngdan boshlaymiz, chunki u yerda birlar xonasi bor. To'qqiz sekin birlarga, bir o'nlarga, nol yuzlarga o'tadi. Shunday qilib nol bir to'qqiz o'ng sinfi yig'iladi.",
        "Yo'nalishni o'zgartirmasdan minglar sinfida davom etamiz. Ikki bir minglarga, sakkiz o'n minglarga, to'rt yuz minglarga o'tadi.",
        "Yuzlar xonasidagi nolni tashlab yuborib bo'lmaydi. U boshqa raqamlarni to'g'ri o'rinda ushlab turadi.",
        "Sinflarni chapdan o'ngga o'qiymiz: to'rt yuz sakson ikki ming o'n to'qqiz.",
      ],
      en: [
        "Use the second method to check every digit's place. The chart has two groups of three places; all six cells are empty, with the digits above.",
        "Start on the right at the ones place. Nine moves into ones, one into tens and zero into hundreds, forming the right-hand group zero one nine.",
        "Without changing directions, we continue in the thousands group. Two moves into thousands, eight into tens of thousands and four into hundreds of thousands.",
        "Zero in the hundreds place can't be missed. It keeps the other digits in their correct places.",
        "Read groups from left to right: four hundred and eighty-two thousand nineteen.",
      ],
    },
  },
  bonus: {
    eyebrow: { ru: 'Бонус · секрет нулей', uz: 'Bonus · nollar siri', en: "Bonus - secret of zeros" },
    title: { ru: 'Бонус. Нули в числе', uz: 'Bonus. Sondagi nollar', en: "Bonus, zeros among them." },
    digits: ['2', '0', '4', '0', '0', '6'],
    boundaryAfter: 2,
    showTable: true,
    methodBadge: { ru: 'Бонус · ноль держит место', uz: "Bonus · nol o'rinni saqlaydi", en: "Bonus · Zero holds the place" },
    explanationLead: {
      ru: 'На числе 204006 увидим разницу между записью числа и его чтением.',
      uz: "204006 sonida sonning yozilishi va o'qilishi orasidagi farqni ko'ramiz.",
      en: "The number 204006 shows the difference between writing a number and reading it.",
    },
    interactionIntro: {
      ru: 'В бонусе пять карточек. Открывай их по порядку: Бит покажет, почему нули нужны в записи, даже когда мы их не произносим.',
      uz: "Bonusda beshta karta bor. Ularni tartib bilan oching: Bit nollar aytilmasa ham yozuvda nega kerakligini ko'rsatadi.",
      en: "There are five bonus cards. Open them in order: Bit will show you why zeros are needed in the notation, even when we're not saying them.",
    },
    startPrompt: {
      ru: 'Нажми карточку 1.',
      uz: '1-kartani bosing.',
      en: "Press card 1.",
    },
    explanationSteps: [
      {
        label: { ru: 'Делим', uz: 'Ajratamiz', en: "delimim" },
        shortText: { ru: '204006 → 204 | 006', uz: '204006 → 204 | 006', en: '204006 → 204 | 006' },
        text: {
          ru: 'Не пытайся сразу прочитать число. Отсчитай справа три позиции, сохраняя все цифры.',
          uz: "Sonni darhol o'qishga urinmang. Barcha raqamlarni saqlab, o'ngdan uchta o'rinni sanang.",
          en: "Don't try to read the number right away. Count the three positions on the right, keeping all the numbers.",
        },
        visualPhase: 0,
      },
      {
        label: { ru: 'Группа 006', uz: '006 guruhi', en: "Group 006" },
        shortText: { ru: '006: 0 сот. · 0 дес. · 6 ед.', uz: "006: 0 yuz · 0 o'n · 6 bir.", en: "006: 0 cells. · 0 deci. · 6 units." },
        text: {
          ru: 'В правом классе 0 сотен, 0 десятков и 6 единиц. В записи нужны все три позиции.',
          uz: "O'ng sinfda 0 yuzlik, 0 o'nlik va 6 birlik bor. Yozuvda uchala o'rin ham kerak.",
          en: "The group on the right is 0 hundreds, 0 tens and 6 ones, and you need all three positions in the notation.",
        },
        visualPhase: 1,
      },
      {
        label: { ru: 'Группа 204', uz: '204 guruhi', en: "Group 204" },
        shortText: { ru: '204 — класс тысяч.', uz: '204 — minglar sinfi.', en: "204 is a thousands group." },
        text: {
          ru: 'В левом классе 2 сотни тысяч, 0 десятков тысяч и 4 тысячи. Ноль снова удерживает место.',
          uz: "Chap sinfda 2 yuz minglik, 0 o'n minglik va 4 minglik bor. Nol yana o'rinni saqlaydi.",
          en: "In the group on the left, there are 2 hundred thousand, 0 tens of thousands and 4 thousand.",
        },
        visualPhase: 2,
      },
      {
        label: { ru: 'Нули', uz: 'Nollar', en: "zeroes" },
        shortText: { ru: 'Нули пишем, но не читаем.', uz: "Nollarni yozamiz, o'qimaymiz.", en: "We write, but we don't read." },
        text: {
          ru: 'При чтении не говорим «ноль десятков тысяч» или «ноль сотен». Нули видны в записи, но не произносятся.',
          uz: "O'qishda «nol o'n minglik» yoki «nol yuzlik» demaymiz. Nollar yozuvda ko'rinadi, ammo aytilmaydi.",
          en: "When you read, you don't say \"zero tens of thousands\" or \"zero hundreds.\" The zeroes are visible in the notation, but they're not pronounced.",
        },
        visualPhase: 3,
      },
      {
        label: { ru: 'Чтение', uz: "O'qish", en: "Reading" },
        shortText: { ru: '204 | 006', uz: '204 | 006', en: '204 | 006' },
        text: {
          ru: 'Получаем: двести четыре тысячи шесть. Нули сохранили структуру, хотя мы их не произнесли.',
          uz: "Natija: ikki yuz to'rt ming olti. Nollar aytilmasa ham tuzilishni saqladi.",
          en: "So we get two hundred and four thousand and six. The zeroes have retained the structure, even though we didn't pronounce them.",
        },
        visualPhase: 3,
      },
    ],
    resultText: {
      ru: 'Ноль пишем, пустой разряд не читаем.',
      uz: "Nolni yozamiz, bo'sh xonani o'qimaymiz.",
      en: "We write zero, we do not read empty place.",
    },
    replayLabel: { ru: 'Повторить бонус', uz: 'Bonusni takrorlash', en: "Repeat the bonus" },
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
        "Birlar sinfida nol yuzlik, nol o'nlik va olti birlik bor. Shuning uchun nol nol olti yozuvini saqlaymiz.",
        "Minglar sinfida ikki yuz minglik, nol o'n minglik va to'rt minglik bor. O'rtadagi nol o'rinni saqlaydi.",
        "O'qishda bo'sh xonalarni aytmaymiz, ammo yozuvda nollarni albatta saqlaymiz.",
        "Natija: ikki yuz to'rt ming olti. Yozuv va o'qilish turlicha ko'rinsa ham, bitta sonni bildiradi.",
      ],
      en: [
        "This bonus is about zeros. Before reading the number, carefully separate the three digits on the right.",
        "In a ones group, there are zero hundreds, zero tens, and six. So we write zero zero six.",
        "The thousands group contains two hundred thousands, zero tens of thousands and four thousands. The middle zero holds the place.",
        "When reading, we do not pronounce empty places, but in the notation we must keep their zeros.",
        "So it's two hundred and four thousand six. The written and spoken forms look different, but they represent the same number.",
      ],
    },
  },
  trainer: {
    eyebrow: { ru: 'Тренажёр с Битом', uz: 'Bit bilan trenajyor', en: "Practise with Bit" },
    title: { ru: 'Самостоятельно раздели код 73506', uz: '73506 kodini mustaqil ajrating', en: "Self-separate code 73506" },
    digits: ['7', '3', '5', '0', '6'],
    boundaryAfter: 1,
    resultCode: '73 | 506',
    trainerLead: {
      ru: 'Это новое число. Бит задаёт один вопрос за раз и не показывает следующий ответ заранее.',
      uz: "Bu yangi son. Bit har safar bitta savol beradi va keyingi javobni oldindan ko'rsatmaydi.",
      en: "It's a new number. Bit asks one question at a time and doesn't show the next answer in advance.",
    },
    trainerSteps: [
      {
        prompt: { ru: 'Шаг 1 из 4. С какого края начнёшь отсчёт?', uz: "4 qadamdan 1-qadam. Sanashni qaysi chetdan boshlaysiz?", en: "Step 1 of 4. Where do you start?" },
        options: [
          { ru: 'слева, с цифры 7', uz: 'chapdan, 7 raqamidan', en: "on the left, containing the digit 7" },
          { ru: 'справа, с цифры 6', uz: "o'ngdan, 6 raqamidan", en: "on the right, with the digit 6" },
          { ru: 'из середины, с цифры 5', uz: "o'rtadan, 5 raqamidan", en: "in the middle, containing the digit 5" },
        ],
        correctIndex: 1,
        correctText: { ru: 'Верно. Справа находится постоянная точка отсчёта — разряд единиц.', uz: "To'g'ri. O'ng tomonda doimiy boshlanish nuqtasi — birlar xonasi bor.", en: "Right. On the right is the constant reference point, the ones place." },
        hint: { ru: 'Вспомни, где у любого целого числа расположен разряд единиц.', uz: "Har qanday butun sonda birlar xonasi qayerda turishini eslang.", en: "Remember where any integer has the ones place." },
      },
      {
        prompt: { ru: 'Шаг 2 из 4. Какие три цифры образуют первую группу?', uz: '4 qadamdan 2-qadam. Qaysi uchta raqam birinchi guruhni hosil qiladi?', en: "Step 2 of 4: Which three digits make up the first group?" },
        options: [{ ru: '506', uz: '506', en: '506' }, { ru: '350', uz: '350', en: '350' }, { ru: '735', uz: '735', en: '735' }],
        correctIndex: 0,
        correctText: { ru: 'Верно. От правого края отсчитаны ровно три позиции.', uz: "To'g'ri. O'ng chetdan roppa-rosa uchta o'rin sanaldi.", en: "That's right. There are exactly three positions counted from the right edge." },
        hint: { ru: 'Поставь палец на последнюю цифру и отсчитай три позиции влево.', uz: "Barmog'ingizni oxirgi raqamga qo'ying va chapga uchta o'rin sanang.", en: "Put your finger on the last digit and count three positions to the left." },
      },
      {
        prompt: { ru: 'Шаг 3 из 4. Как называется первая группа справа?', uz: "4 qadamdan 3-qadam. O'ngdagi birinchi guruh qanday ataladi?", en: "Step 3 of 4. What is the name of the first group on the right?" },
        options: [
          { ru: 'класс тысяч', uz: 'minglar sinfi', en: "group" },
          { ru: 'класс единиц', uz: 'birlar sinfi', en: "unit" },
          { ru: 'разряд сотен', uz: 'yuzlar xonasi', en: "hundredth" },
        ],
        correctIndex: 1,
        correctText: { ru: 'Да. Первая тройка справа всегда образует класс единиц.', uz: "Ha. O'ngdagi birinchi uchlik doimo birlar sinfini hosil qiladi.", en: "The first three on the right always forms a ones group." },
        hint: { ru: 'В этой группе находятся обычные сотни, десятки и единицы.', uz: "Bu guruhda oddiy yuzlar, o'nlar va birlar joylashgan.", en: "In this group are the usual hundreds, tens and units." },
      },
      {
        prompt: { ru: 'Шаг 4 из 4. Как правильно описать оставшуюся часть?', uz: "4 qadamdan 4-qadam. Qolgan qismni qanday to'g'ri tariflaysiz?", en: "Step 4 of 4: How do you describe the rest?" },
        options: [
          { ru: '73 — класс тысяч', uz: '73 — minglar sinfi', en: "73 - thousands group" },
          { ru: '73 — класс единиц', uz: '73 — birlar sinfi', en: "73 - ones group" },
          { ru: '735 — класс тысяч', uz: '735 — minglar sinfi', en: "735 - thousands group" },
        ],
        correctIndex: 0,
        correctText: { ru: 'Верно. Левая неполная группа тоже является классом тысяч.', uz: "To'g'ri. Chapdagi to'liq bo'lmagan guruh ham minglar sinfidir.", en: "Right. The left incomplete group is also a thousands group." },
        hint: { ru: 'Слева может остаться одна, две или три цифры. Границу не переносим.', uz: "Chapda bitta, ikkita yoki uchta raqam qolishi mumkin. Chegarani ko'chirmaymiz.", en: "On the left, there could be one, two or three digits left. We can't move the border." },
      },
    ],
    doneText: {
      ru: 'Готово: 73 | 506. Правило применено к новому числу без копирования примера.',
      uz: "Tayyor: 73 | 506. Siz qoidani misoldan ko'chirmasdan yangi songa qo'lladingiz.",
      en: "Finished: 73 | 506. The rule applies to the new number without copying the example.",
    },
    audio: {
      ru: [
        'Перед тобой новый пятизначный код. Не ищи ответ в предыдущих примерах, примени общее правило.',
        'Работай по одному шагу. Сначала выбери точку отсчёта, затем собери группу и назови классы.',
      ],
      uz: [
        "Oldingizda yangi besh xonali kod. Javobni oldingi misollardan qidirmang, umumiy qoidani qo'llang.",
        "Bitta qadamdan ishlang. Avval boshlanish nuqtasini tanlang, keyin guruhni tuzing va sinflarni nomlang.",
      ],
      en: [
        "This is a new five-digit code. Do not copy an answer from the previous examples, apply the general rule.",
        "Work one step at a time. First, pick a reference point, then assemble a group and name the groups.",
      ],
    },
  },
  quick11: {
    eyebrow: { ru: 'Быстрый тест · 1 из 4', uz: 'Tezkor test · 4 dan 1', en: "Quick Test · 1 out of 4" },
    title: { ru: 'Найди класс единиц', uz: 'Birlar sinfini toping', en: "Find a ones group." },
    quickLabel: { ru: 'Реши без таблицы', uz: 'Jadvalsiz yeching', en: "Decide without a table." },
    quickNumber: '91406',
    question: { ru: 'Какая группа образует класс единиц?', uz: 'Qaysi guruh birlar sinfini hosil qiladi?', en: "Which group forms a ones group?" },
    options: ['406', '914', '140'],
    correctIndex: 0,
    correctText: {
      ru: 'Верно. Три цифры справа образуют класс единиц: 406.',
      uz: "To'g'ri. O'ngdagi uchta raqam birlar sinfini hosil qiladi: 406.",
      en: "Right. The three digits on the right form a ones group: 406.",
    },
    proof: { ru: '91 | 406', uz: '91 | 406', en: '91 | 406' },
    proofLabel: { ru: '406 — первая тройка справа, класс единиц', uz: "406 — o'ngdagi birinchi uchlik, birlar sinfi", en: "406 - first three on the right, ones group" },
    wrong: [
      null,
      { ru: '914 находится слева. Сначала отсчитай три цифры от правого края.', uz: "914 chapda turibdi. Avval o'ng chetdan uchta raqamni sanang.", en: "914 is on the left. First, count the three digits from the right." },
      { ru: 'Цифры нельзя переставлять. Сохрани исходный порядок.', uz: "Raqamlarni almashtirib bo'lmaydi. Dastlabki tartibni saqlang.", en: "The numbers can't be rearranged." },
    ],
    audio: {
      intro: { ru: 'Первый быстрый тест. Определи класс единиц в новом числе.', uz: 'Birinchi tezkor test. Yangi sondagi birlar sinfini aniqlang.', en: "First quick test, define the ones group in the new number." },
      on_correct: { ru: 'Точно. Первая группа справа найдена.', uz: "Aniq. O'ngdagi birinchi guruh topildi.", en: "The first group on the right has been found." },
      on_wrong: { ru: 'Вспомни постоянную точку отсчёта справа.', uz: "O'ngdagi doimiy boshlanish nuqtasini eslang.", en: "Remember the constant reference point on the right." },
    },
  },
  quick12: {
    eyebrow: { ru: 'Быстрый тест · 2 из 4', uz: 'Tezkor test · 4 dan 2', en: "Quick Test · 2 out of 4" },
    title: { ru: 'Сколько полных тысяч?', uz: "Nechta to'liq ming bor?", en: "How many full thousands?" },
    quickLabel: { ru: 'Смотри на нужный класс', uz: 'Kerakli sinfga qarang', en: "Look at the group on the right." },
    quickNumber: '307025',
    question: { ru: 'Сколько полных тысяч содержит число?', uz: "Son nechta to'liq mingni o'z ichiga oladi?", en: "How many full thousands does a number contain?" },
    options: ['25', '307', '307 025'],
    correctIndex: 1,
    correctText: {
      ru: 'Верно. Левая группа 307 показывает 307 полных тысяч.',
      uz: "To'g'ri. Chapdagi 307 guruhi 307 ta to'liq mingni ko'rsatadi.",
      en: "Right. Left group 307 shows 307 total thousands.",
    },
    proof: { ru: '307 | 025 → 307 полных тысяч', uz: "307 | 025 → 307 ta to'liq ming", en: "307 | 025 → 307 total thousands" },
    proofLabel: { ru: 'Ответ даёт группа слева от границы', uz: 'Javobni chegaraning chapidagi guruh beradi', en: "The answer comes from the group on the left of the border." },
    wrong: [
      { ru: '25 относится к правому классу. Нужна группа слева от границы.', uz: "25 o'ng sinfga tegishli. Chegaraning chapidagi guruh kerak.", en: "25 belongs to the group on the right. We need a group to the left of the border." },
      null,
      { ru: 'Это всё число, а вопрос только о количестве полных тысяч.', uz: "Bu butun son, savol esa faqat to'liq minglar soni haqida.", en: "That's the whole number, and it's just a question of the full thousands." },
    ],
    audio: {
      intro: { ru: 'Второй быстрый тест. Найди количество полных тысяч, не разбирая каждый разряд.', uz: "Ikkinchi tezkor test. Har bir xonani ajratmasdan to'liq minglar sonini toping.", en: "Second quick test, find the number of the full thousands without disassembling each digit." },
      on_correct: { ru: 'Верно. Нужный класс дал ответ сразу.', uz: "To'g'ri. Kerakli sinf javobni darhol berdi.", en: "That's right, the group on the right answered right away." },
      on_wrong: { ru: 'Ищи ответ в группе класса тысяч.', uz: 'Javobni minglar sinfi guruhidan qidiring.', en: "Look for the answer in the thousands group." },
    },
  },
  quick13: {
    eyebrow: { ru: 'Быстрый тест · 3 из 4', uz: 'Tezkor test · 4 dan 3', en: "Quick Test · 3 out of 4" },
    title: { ru: 'Проверь разрядную сумму', uz: "Xona yig'indisini tekshiring", en: "Check the digits." },
    quickLabel: { ru: 'Нули тоже занимают места', uz: "Nollar ham o'rin egallaydi", en: "Zeros take up places, too." },
    quickNumber: '708215',
    question: { ru: 'Какая сумма точно описывает число?', uz: "Qaysi yig'indi sonni aniq ifodalaydi?", en: "What sum exactly describes the number?" },
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
      en: "That's right. Zero holds the tens of thousands, so 8 means 8,000.",
    },
    proof: { ru: '708 | 215 = 700 000 + 8 000 + 200 + 10 + 5', uz: '708 | 215 = 700 000 + 8 000 + 200 + 10 + 5', en: '708 | 215 = 700 000 + 8 000 + 200 + 10 + 5' },
    proofLabel: { ru: 'Ноль сохранил место десятков тысяч', uz: "Nol o'n minglar xonasini saqladi", en: "Zero has kept the place of tens of thousands" },
    wrong: [
      null,
      { ru: 'В этой записи 7 оказалось в десятках тысяч. Проверь первую цифру числа.', uz: "Bu yozuvda 7 o'n minglar xonasiga tushib qoldi. Sonning birinchi raqamini tekshiring.", en: "In this entry, 7 is in the tens of thousands." },
      { ru: 'Ноль не позволяет восьмёрке перейти в десятки тысяч. Проверь её столбец.', uz: "Nol 8 raqamining o'n minglarga o'tishiga yo'l qo'ymaydi. Uning ustunini tekshiring.", en: "Zero doesn't allow the eight to go into the tens of thousands." },
    ],
    audio: {
      intro: { ru: 'Третий быстрый тест. Проверь разрядную сумму числа с внутренним нулём.', uz: "Uchinchi tezkor test. Ichki noli bor sonning xona yig'indisini tekshiring.", en: "Third quick test, check the place-value sum of a number with an inner zero." },
      on_correct: { ru: 'Отлично. Все ненулевые разряды названы точно.', uz: "Ajoyib. Noldan boshqa barcha xonalar aniq aytildi.", en: "All non-zero digits are exactly named." },
      on_wrong: { ru: 'Поставь число в шесть разрядных столбцов и проверь каждое слагаемое.', uz: "Sonni oltita xona ustuniga joylashtirib, har bir qo'shiluvchini tekshiring.", en: "Set a number in six place-value columns and check each term." },
    },
  },
  quick14: {
    eyebrow: { ru: 'Финальный блиц · 4 из 4', uz: 'Yakuniy blits · 4 dan 4', en: "Final blitz · 4 out of 4" },
    title: { ru: 'Определи значение цифры', uz: 'Raqam qiymatini aniqlang', en: 'Determine the value of the digit' },
    quickLabel: { ru: 'Финальный вопрос', uz: 'Yakuniy savol', en: "Final question" },
    quickNumber: '164209',
    highlightIndex: 1,
    question: { ru: 'Каково значение выделенной цифры 6?', uz: 'Ajratilgan 6 raqamining qiymati qancha?', en: "What is the value of the highlighted digit 6?" },
    options: ['6 000', '60 000', '600 000'],
    correctIndex: 1,
    correctText: {
      ru: 'Верно. Цифра 6 стоит в разряде десятков тысяч, поэтому её значение — 60 000.',
      uz: "To'g'ri. 6 raqami o'n minglar xonasida turadi, shuning uchun uning qiymati 60 000.",
      en: 'That is right. The digit 6 is in the ten-thousands place, so its value is 60,000.',
    },
    proof: { ru: '6 × 10 000 = 60 000', uz: '6 × 10 000 = 60 000', en: '6 × 10 000 = 60 000' },
    proofLabel: { ru: '6 стоит в разряде десятков тысяч', uz: "6 o'n minglar xonasida turadi", en: "6 stands in the ten-thousands place" },
    wrong: [
      { ru: '6 000 получилось бы в разряде единиц тысяч. Проверь место цифры.', uz: "6 000 bir minglar xonasida bo'lardi. Raqam o'rnini tekshiring.", en: "6,000 would be one thousand. Check the place of the number." },
      null,
      { ru: '600 000 требует разряда сотен тысяч. Выделенная цифра стоит правее.', uz: "600 000 uchun yuz minglar xonasi kerak. Ajratilgan raqam o'ngroqda turibdi.", en: "600,000 is worth hundreds of thousands. The number is on the right." },
    ],
    audio: {
      intro: { ru: 'Финальный блиц. Определи значение выделенной цифры по её месту.', uz: "Yakuniy blits. Ajratilgan raqam qiymatini uning o'rniga qarab aniqlang.", en: "Final blitz, determine the value of the highlighted digit by its place." },
      on_correct: { ru: 'Финальный ответ верный. Награда разблокирована.', uz: "Yakuniy javob to'g'ri. Mukofot ochildi.", en: "The final answer is correct. The reward is unlocked." },
      on_wrong: { ru: 'Назови разряд выделенной цифры и умножь её на значение разряда.', uz: "Ajratilgan raqam xonasini ayting va uni xona qiymatiga ko'paytiring.", en: "Name the place of the selected digit and multiply it by the value of the place." },
    },
  },
  awards: [
    {
      min: 4,
      title: { ru: 'Архитектор многозначных чисел', uz: "Ko'p xonali sonlar me'mori", en: "Architect of multi-digit numbers" },
      text: { ru: 'Все быстрые тесты решены с первой попытки.', uz: "Barcha tezkor testlar birinchi urinishda yechildi.", en: "All quick tests are solved on the first try." },
    },
    {
      min: 3,
      title: { ru: 'Мастер классов и разрядов', uz: 'Sinflar va xonalar ustasi', en: "Master of groups and places" },
      text: { ru: 'Ты уверенно видишь структуру многозначного числа.', uz: "Siz ko'p xonali son tuzilishini ishonchli ko'rasiz.", en: "You can confidently see the structure of a multi-digit number." },
    },
    {
      min: 0,
      title: { ru: 'Исследователь числовых кодов', uz: 'Sonli kodlar tadqiqotchisi', en: "Numerical code researcher" },
      text: { ru: 'Основа освоена. Повтори правило и попробуй улучшить результат.', uz: "Asos o'zlashtirildi. Qoidani takrorlab, natijani yaxshilashga harakat qiling.", en: "Repeat the rule and try to improve the result." },
    },
  ],
};

const BRIDGES = {
  s1: { ru: 'Идея группировки найдена. Но сначала восстановим всю основу, даже если прошлые темы были давно.', uz: "Guruhlash g'oyasi topildi. Ammo avval, oldingi mavzular ancha oldin bo'lsa ham, butun asosni tiklaymiz.", en: "The idea of the grouping has been found, but first, let's restore the whole base, even if past themes were long gone." },
  s2: {
    ru: 'Разряды и роль нуля вспомнили. Теперь расширим знакомую тройку до классов и поймём, зачем это нужно.',
    uz: "Xonalar va nolning vazifasini esladik. Endi tanish uchlikni sinflargacha kengaytirib, buning sababini tushunamiz.",
    en: "The digits and the role of zero are remembered. Now let's expand the familiar three into groups and understand why it's necessary.",
  },
  s3: {
    ru: 'Первый способ дал границу счётом справа. Теперь проверим тот же принцип картой мест — сначала пустой таблицей.',
    uz: "Birinchi usul o'ngdan sanab chegarani berdi. Endi shu tamoyilni o'rinlar xaritasi, ya'ni avval bo'sh jadval bilan tekshiramiz.",
    en: "The first way gave the boundary a score on the right, and now we're going to test the same principle with a map of places, first with an empty table.",
  },
  s4: {
    ru: 'Оба способа привели к одной структуре. Разберём особый случай, в котором нули легко потерять.',
    uz: "Ikkala usul ham bir xil tuzilishga olib keldi. Nollarni yo'qotish oson bo'lgan maxsus holatni ko'ramiz.",
    en: "Both methods led to the same structure. Let's take a special case in which zeros are easy to lose.",
  },
  s5: { ru: 'Наблюдение закончилось. Теперь не выбирай готовую запись — поставь границу собственным пальцем.', uz: "Kuzatish tugadi. Endi tayyor yozuvni tanlamang, chegarani o'z barmog'ingiz bilan qo'ying.", en: "Now, don't pick the finished tape, put the boundary with your finger." },
  s6: { ru: 'Движение получилось. Проверим, понимаешь ли ты структуру числа с двумя внутренними нулями.', uz: "Harakat bajarildi. Endi ikkita ichki noli bor son tuzilishini tushunishingizni tekshiramiz.", en: "Let's see if you understand the structure of a number with two inner zeroes." },
  s7: { ru: 'Нули удержали места. Теперь станем детективами и сравним значение одной цифры в двух числах.', uz: "Nollar o'rinlarni saqladi. Endi detektiv bo'lib, bir raqamning ikki sondagi qiymatini solishtiramiz.", en: "Now let's become detectives and compare the value of one digit in two numbers." },
  s8: { ru: 'Значения найдены. Используем связь соседних разрядов, чтобы предсказать изменение без полного счёта.', uz: "Qiymatlar topildi. To'liq hisoblamasdan o'zgarishni aytish uchun qo'shni xonalar bog'lanishidan foydalanamiz.", en: "Values found. We use the linkage of neighbouring places to predict change without a full count." },
  s9: { ru: 'Исследование завершено. Соберём все выводы в одно точное правило.', uz: "Tadqiqot tugadi. Barcha xulosalarni bitta aniq qoidaga yig'amiz.", en: "The study is complete. Let's compile all the conclusions into one precise rule." },
  s10: { ru: 'Правило собрано. Докажи, что можешь применить его жестом без счётных меток.', uz: "Qoida yig'ildi. Uni sanash belgilarisiz barmoq harakati bilan qo'llay olishingizni isbotlang.", en: "Prove you can use it with a gesture without counting marks." },
  s11: { ru: 'Самостоятельная граница построена. Теперь четыре короткие проверки пройдут на одном экране.', uz: "Mustaqil chegara qurildi. Endi to'rtta qisqa tekshiruv bitta ekranda o'tadi.", en: "The self-contained boundary has been built. Now, four short checks will take place on the same screen." },
  s12: { ru: 'Блиц завершён. Перейдём от быстрых ответов к выбору самого эффективного способа.', uz: "Blits tugadi. Tez javoblardan eng samarali usulni tanlashga o'tamiz.", en: "The blitz is complete. Let's move from quick answers to the most effective way." },
  s13: { ru: 'Стратегия выбрана. Теперь проверь чужое решение и найди точную ошибку Бита.', uz: "Strategiya tanlandi. Endi begona yechimni tekshirib, Bitning aniq xatosini toping.", en: "Now check the other person's decision and find Bit's exact error." },
  s14: { ru: 'Ошибка исправлена. Осталось применить разряды к настоящему городскому коду.', uz: "Xato tuzatildi. Endi xonalarni haqiqiy shahar kodiga qo'llash qoldi.", en: "The error has been corrected. It remains to apply the digits to the actual city code." },
  s15: { ru: 'Городской код восстановлен. Подведём итог, повторим правило и откроем математическое звание.', uz: "Shahar kodi tiklandi. Yakun yasab, qoidani takrorlaymiz va matematik unvonni ochamiz.", en: "The city code has been restored. Let's sum up, repeat the rule, and open up the maths title." },
};
const TOTAL_SCREENS = 16;
// Блокировка перехода. В релизе ВСЕГДА false: пока здесь стояло true, кнопка
// «Дальше» не блокировалась никогда и урок проходился без единого ответа —
// то есть проверка знания в уроке фактически отсутствовала.
// Значение true допустимо только в личной отладке и не коммитится.
const FREE_NAV = false;
const MOBILE_DESIGN_W = 390;

const LESSON_META = {
  lessonId: 'num-4-01-v1',
  lessonTitle: {
    ru: 'Урок 1. Классы многозначных чисел',
    uz: "1-dars. Ko'p xonali sonlar sinflari",
    en: "Lesson 1: Place-value groups in multi-digit numbers",
  },
};

const SCREEN_META = [
  { id: 's0', type: 'hook', template: 'MCScreen', scored: false, scope: 'hook' },
  { id: 's1', type: 'exploration', template: 'FoundationReview', scored: false, scope: null },
  { id: 's2', type: 'exploration', template: 'AnimatedExplanation', scored: false, scope: null },
  { id: 's3', type: 'exploration', template: 'AnimatedExplanation', scored: false, scope: null },
  { id: 's4', type: 'exploration', template: 'AnimatedExplanation', scored: false, scope: null },
  { id: 's5', type: 'practice', template: 'DividerPlacement', scored: false, scope: null },
  { id: 's6', type: 'exploration', template: 'ReasoningRounds', scored: false, scope: null },
  { id: 's7', type: 'exploration', template: 'ReasoningRounds', scored: false, scope: null },
  { id: 's8', type: 'exploration', template: 'MCScreen', scored: false, scope: null },
  { id: 's9', type: 'rule', template: 'RuleBuilder', scored: false, scope: null },
  { id: 's10', type: 'practice', template: 'DividerPlacement', scored: false, scope: null },
  { id: 's11', type: 'test', template: 'RapidTestConsole', scored: true, scope: 'module-mikro' },
  { id: 's12', type: 'practice', template: 'Strategy', scored: false, scope: null },
  { id: 's13', type: 'case', template: 'MCScreen', scored: false, scope: null },
  { id: 's14', type: 'case', template: 'MCScreen', scored: false, scope: null },
  { id: 's15', type: 'summary', template: 'custom', scored: false, scope: null },
];

let runtimeConfig = {
  ttsApiBase: '',
  correctSoundUrl: '',
  wrongSoundUrl: '',
  studentName: '',
  voiceGender: 'f',
};

const configureLesson = (next) => {
  runtimeConfig = { ...runtimeConfig, ...next };
};

const SUPPORTED_LANGS = ['uz', 'ru', 'en'];
const normalizeLang = (value) => (SUPPORTED_LANGS.includes(value) ? value : 'uz');
const LangContext = createContext('uz');
const useLang = () => useContext(LangContext);

const useT = () => {
  const lang = useLang();
  return useCallback((value) => {
    if (value === null || value === undefined) return '';
    if (React.isValidElement(value)) return value;
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    return value[lang] ?? '';
  }, [lang]);
};

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false,
  );
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const update = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [breakpoint]);
  return isMobile;
}

function useMobileZoom(breakpoint = 640) {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const root = document.documentElement;
    const update = () => {
      const zoom = window.innerWidth < breakpoint
        ? window.innerWidth / MOBILE_DESIGN_W
        : 1;
      root.style.setProperty('--g4z', String(zoom));
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
      root.style.removeProperty('--g4z');
    };
  }, [breakpoint]);
}

const buildTtsUrl = (base, text, gender) => {
  const encoded = encodeURIComponent(String(text).slice(0, 1000));
  return `${base}/api/tts?text=${encoded}&g=${gender === 'm' ? 'm' : 'f'}`;
};

class AudioEngine {
  constructor() {
    this.queue = [];
    this.index = 0;
    this.audio = null;
    this.previewUtterance = null;
    this.lang = 'ru';
    this.muted = false;
    this.isPlaying = false;
    this.onStateChange = null;
  }

  emit(extra = {}) {
    if (this.onStateChange) {
      this.onStateChange({
        isPlaying: this.isPlaying,
        muted: this.muted,
        ...extra,
      });
    }
  }

  ensureAudio() {
    if (!this.audio && typeof window !== 'undefined') {
      this.audio = new Audio();
      this.audio.crossOrigin = 'anonymous';
      this.audio.preload = 'auto';
    }
    return this.audio;
  }

  setLang(lang) {
    this.lang = lang;
  }

  loadQueue(segments) {
    this.stop(false);
    this.queue = Array.isArray(segments) ? segments : [];
    this.index = 0;
  }

  start() {
    if (this.muted) {
      this.emit({ completed: true });
      return;
    }
    this.playCurrent();
  }

  playCurrent() {
    const segment = this.queue[this.index];
    if (!segment) {
      this.isPlaying = false;
      this.emit({ completed: true, currentSegment: null });
      return;
    }
    this.playText(segment.text, () => {
      this.index += 1;
      this.playCurrent();
    }, segment.id);
  }

  playText(text, done, id = 'one-off') {
    if (!text || this.muted) {
      done?.();
      return;
    }
    const base = runtimeConfig.ttsApiBase;
    if (base) {
      const audio = this.ensureAudio();
      if (!audio) {
        done?.();
        return;
      }
      audio.onended = () => {
        this.isPlaying = false;
        this.emit({ currentSegment: null });
        done?.();
      };
      audio.onerror = () => {
        this.isPlaying = false;
        this.emit({ currentSegment: null });
        done?.();
      };
      audio.src = buildTtsUrl(base, text, runtimeConfig.voiceGender);
      const promise = audio.play();
      if (promise && typeof promise.then === 'function') {
        promise.then(() => {
          this.isPlaying = true;
          this.emit({ currentSegment: id });
        }).catch(() => {
          this.isPlaying = false;
          this.emit({ completed: true, currentSegment: null });
          done?.();
        });
      }
      return;
    }

    if (typeof window === 'undefined' || !window.speechSynthesis) {
      done?.();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(String(text));
          utterance.lang = this.lang === 'en' ? 'en-GB' : this.lang === 'ru' ? 'ru-RU' : 'uz-UZ';
    utterance.rate = 0.94;
    utterance.onstart = () => {
      this.isPlaying = true;
      this.emit({ currentSegment: id });
    };
    utterance.onend = () => {
      this.isPlaying = false;
      this.emit({ currentSegment: null });
      done?.();
    };
    utterance.onerror = () => {
      this.isPlaying = false;
      this.emit({ currentSegment: null });
      done?.();
    };
    this.previewUtterance = utterance;
    setTimeout(() => {
      try {
        window.speechSynthesis.speak(utterance);
      } catch {
        done?.();
      }
    }, 50);
  }

  pushOneOff(text) {
    this.stop(false);
    this.queue = [{ id: `feedback-${Date.now()}`, text }];
    this.index = 0;
    this.start();
  }

  replay() {
    this.stop(false);
    this.index = 0;
    this.start();
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) this.stop(false);
    this.emit({ completed: this.muted });
  }

  stop(emit = true) {
    if (this.audio) {
      try {
        this.audio.pause();
        this.audio.onended = null;
        this.audio.onerror = null;
      } catch {
        // no-op
      }
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // no-op
      }
    }
    this.isPlaying = false;
    if (emit) this.emit({ currentSegment: null });
  }
}

let audioEngineInstance = null;
const getAudioEngine = () => {
  if (typeof window === 'undefined') return null;
  if (!audioEngineInstance) audioEngineInstance = new AudioEngine();
  return audioEngineInstance;
};

function useAudio(segments) {
  const lang = useLang();
  const initiallyMuted = audioEngineInstance?.muted ?? false;
  const [state, setState] = useState({
    isPlaying: false,
    muted: initiallyMuted,
    completed: initiallyMuted,
    currentSegment: null,
  });

  /* eslint-disable react-hooks/refs -- required audio segment stabilizer; prevents cancel/restart loops */
  const segmentsRef = useRef(segments);
  const segmentsKey = segments ? JSON.stringify(segments) : '';
  const prevKeyRef = useRef(segmentsKey);
  if (prevKeyRef.current !== segmentsKey) {
    segmentsRef.current = segments;
    prevKeyRef.current = segmentsKey;
  }
  const stableSegments = segmentsRef.current;
  /* eslint-enable react-hooks/refs */

  useEffect(() => {
    const engine = getAudioEngine();
    if (!engine) return undefined;
    engine.setLang(lang);
    engine.onStateChange = (next) => setState((prev) => ({ ...prev, ...next }));
    if (stableSegments?.length && !engine.muted) {
      engine.loadQueue(stableSegments);
      const timer = setTimeout(() => engine.start(), 250);
      return () => {
        clearTimeout(timer);
        engine.stop(false);
      };
    }
    return () => engine.stop(false);
  }, [stableSegments, lang]);

  return {
    ...state,
    replay: () => getAudioEngine()?.replay(),
    toggleMute: () => getAudioEngine()?.toggleMute(),
    pushOneOff: (text) => getAudioEngine()?.pushOneOff(text),
  };
}

const localizedSegments = (audioValue, lang, prefix) => {
  if (!audioValue) return [];
  const localized = audioValue[lang] ?? '';
  const items = Array.isArray(localized) ? localized : [localized];
  return items.filter(Boolean).map((text, index) => ({
    id: `${prefix}-${index}`,
    text,
  }));
};

const localizedScreenSegments = (audioValue, lang, screen) => {
  const bridge = screen > 0 ? BRIDGES[`s${screen}`] : null;
  const bridgeText = bridge?.[lang] ?? '';
  const contentSegments = localizedSegments(audioValue, lang, `s${screen}-audio`);
  return bridgeText
    ? [{ id: `s${screen}-bridge`, text: bridgeText }, ...contentSegments]
    : contentSegments;
};

function useCanAnswer(audio) {
  const [timedOut, setTimedOut] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), 12000);
    return () => clearTimeout(timer);
  }, []);
  return FREE_NAV || audio.muted || audio.completed || timedOut;
}

function useAdvanceGate(solved, audio) {
  const [delayElapsed, setDelayElapsed] = useState(false);
  useEffect(() => {
    if (!solved) return undefined;
    const timer = setTimeout(() => setDelayElapsed(true), 1500);
    return () => clearTimeout(timer);
  }, [solved]);
  if (FREE_NAV) return true;
  if (!solved) return false;
  if (audio.muted) return true;
  return delayElapsed && !audio.isPlaying;
}

const BIT_CORRECT_REACTIONS = [
  { ru: 'Точно подмечено!', uz: 'Aniq topdingiz!', en: "That's right!" },
  { ru: 'Отличный ход!', uz: 'Ajoyib qadam!', en: "Nice move!" },
  { ru: 'Верная связь!', uz: "Bog'lanish to'g'ri!", en: "Good link!" },
  { ru: 'Хорошо рассуждаешь!', uz: 'Yaxshi fikrlayapsiz!', en: "Good reasoning!" },
  { ru: 'Структура найдена!', uz: 'Tuzilish topildi!', en: "Structure found!" },
  { ru: 'Проверка сошлась!', uz: 'Tekshiruv mos keldi!', en: "The test matched!" },
  { ru: 'Уверенный шаг!', uz: 'Ishonchli qadam!', en: "Confident move!" },
  { ru: 'Правило сработало!', uz: 'Qoida ishladi!', en: "The rule worked!" },
  { ru: 'Место найдено точно!', uz: "O'rin aniq topildi!", en: "We've got a location!" },
  { ru: 'Сильное решение!', uz: 'Kuchli yechim!', en: "Strong decision!" },
  { ru: 'Логика верная!', uz: "Mantiq to'g'ri!", en: "Logic is right!" },
  { ru: 'Да, всё совпало!', uz: 'Ha, hammasi mos!', en: "Yeah, it's a match!" },
];

const BIT_HINT_REACTIONS = [
  { ru: 'Почти. Проверь место цифры.', uz: "Yaqin. Raqam o'rnini tekshiring.", en: "Just check the location of the number." },
  { ru: 'Не спеши. Начни справа.', uz: "Shoshilmang. O'ngdan boshlang.", en: "Take your time. Start on the right." },
  { ru: 'Ещё шаг: сравни разряды.', uz: 'Yana bir qadam: xonalarni solishtiring.', en: "One more step: compare the digits." },
  { ru: 'Посмотри на один разряд.', uz: 'Bitta xonaga qarang.', en: "Look at one of them." },
  { ru: 'Проверь роль нуля.', uz: 'Nol vazifasini tekshiring.', en: "Test the role of zero." },
  { ru: 'Сохрани порядок цифр.', uz: 'Raqamlar tartibini saqlang.', en: "Keep the numbers in order." },
  { ru: 'Вернись к условию.', uz: 'Shartga qayting.', en: "Go back to the condition." },
  { ru: 'Раздели задачу на шаги.', uz: 'Masalani qadamlarga ajrating.', en: "Divide the task into steps." },
  { ru: 'Сравни соседние места.', uz: "Qo'shni o'rinlarni solishtiring.", en: "Compare the neighbourhoods." },
  { ru: 'Проверь действие вопроса.', uz: 'Savoldagi amalni tekshiring.', en: "Check the question." },
  { ru: 'Найди опорную тройку.', uz: 'Tayanch uchlikni toping.', en: "Find the back three." },
  { ru: 'Попробуй проверить запись.', uz: "Yozuvni tekshirib ko'ring.", en: "Try checking the tape." },
];

const getBitReaction = (correct, seed = 0) => {
  const collection = correct ? BIT_CORRECT_REACTIONS : BIT_HINT_REACTIONS;
  return collection[Math.abs(seed) % collection.length];
};

const bitSpeech = (t, correct, seed, detail) => (
  `${t(getBitReaction(correct, seed))} ${detail ?? ''}`.trim()
);

const buildOptionOrder = (length, correctIndex, seed = 0) => {
  const naturalOrder = Array.from({ length }, (_, index) => index);
  if (length < 2 || !Number.isInteger(correctIndex) || !naturalOrder.includes(correctIndex)) {
    return naturalOrder;
  }

  const targetPosition = (Math.abs(seed) * 2 + 1) % length;
  const order = naturalOrder.filter((index) => index !== correctIndex);
  order.splice(targetPosition, 0, correctIndex);
  return order;
};

const BitAnswerComment = ({ formula, label, children }) => {
  const lang = useLang();
  return (
    <div className="bit-answer-comment" aria-live="polite">
      <div className="bit-answer-comment-figure">
        <BitSVG state="nod" />
      </div>
      <div className="bit-answer-comment-copy">
        <span className="bit-solution-kicker">
          {lang === 'en' ? "SOLUTION" : lang === 'ru' ? 'РЕШЕНИЕ' : 'YECHIM'}
        </span>
        {formula && <div className="bit-solution-formula">{formula}</div>}
        {label && <small>{label}</small>}
        {children && <div>{children}</div>}
      </div>
    </div>
  );
};

const FeedbackBlock = ({ show, correct, reaction, children }) => {
  const lang = useLang();
  const t = useT();
  const label = correct
    ? (lang === 'en' ? "SOLUTION" : lang === 'ru' ? 'РЕШЕНИЕ' : 'YECHIM')
    : (reaction
      ? t(reaction)
      : (lang === 'en' ? "Think again." : lang === 'ru' ? 'Подумай ещё.' : "Yana o'ylang."));
  return (
    <div className={`feedback ${show ? 'feedback-visible' : ''}`} aria-hidden={!show}>
      <div className={`feedback-card g4-bit-reaction ${correct ? 'feedback-correct g4-bit-reaction-ok' : 'feedback-hint g4-bit-reaction-hint'}`}>
        <div className="g4-bit-reaction-figure">
          <BitSVG state={correct ? 'nod' : 'awkward'} />
        </div>
        <div className="g4-bit-reaction-copy">
          <strong>{label}</strong>
          {children && <div className="g4-bit-reaction-detail">{children}</div>}
        </div>
      </div>
    </div>
  );
};

const AudioIndicator = ({ audio }) => {
  const lang = useLang();
  const muteLabel = audio.muted
    ? (lang === 'en' ? "Turn sound on" : lang === 'ru' ? 'Включить звук' : 'Ovozni yoqish')
    : (lang === 'en' ? "Turn sound off" : lang === 'ru' ? 'Выключить звук' : "Ovozni o'chirish");
  const replayLabel = lang === 'en' ? "Replay" : lang === 'ru' ? 'Повторить' : 'Qayta eshitish';
  return (
    <div className="audio-controls">
      <button type="button" className="icon-btn" onClick={audio.toggleMute} aria-label={muteLabel} title={muteLabel}>
        {audio.muted ? '🔇' : (audio.isPlaying ? '🔊' : '🔉')}
      </button>
      {!audio.muted && (
        <button type="button" className="icon-btn" onClick={audio.replay} aria-label={replayLabel} title={replayLabel}>
          ↻
        </button>
      )}
    </div>
  );
};

const NextLabel = () => ({ uz: 'Davom etish', ru: 'Дальше', en: 'Continue' }[useLang()]);
const BackLabel = () => ({ uz: 'Orqaga', ru: 'Назад', en: 'Back' }[useLang()]);

const NavBack = ({ onClick, hidden = false }) => (
  hidden
    ? <span />
    : (
      <button type="button" className="btn btn-ghost" onClick={onClick}>
        <span aria-hidden="true">←</span> <BackLabel />
      </button>
    )
);

const NavNext = ({ onClick, disabled, finish = false }) => {
  const lang = useLang();
  return (
    <button type="button" className={`btn btn-white-accent ${!disabled ? 'btn-ready' : ''}`} disabled={FREE_NAV ? false : disabled} onClick={onClick}>
      {finish ? (lang === 'en' ? "Finish lesson" : lang === 'ru' ? 'Завершить урок' : 'Darsni yakunlash') : <NextLabel />}
      <span aria-hidden="true">{finish ? '✓' : '→'}</span>
    </button>
  );
};

const ScreenTypeLabel = ({ type }) => {
  const lang = useLang();
  const labels = {
    hook: lang === 'en' ? "Mission" : lang === 'ru' ? 'Миссия' : 'Missiya',
    diagnostic: lang === 'en' ? "Diagnostic" : lang === 'ru' ? 'Диагностика' : 'Diagnostika',
    exploration: lang === 'en' ? "Exploration" : lang === 'ru' ? 'Исследование' : 'Kashfiyot',
    rule: lang === 'en' ? "Rule" : lang === 'ru' ? 'Правило' : 'Qoida',
    practice: lang === 'en' ? "Practice" : lang === 'ru' ? 'Практика' : 'Mashq',
    test: lang === 'en' ? "Check" : lang === 'ru' ? 'Проверка' : 'Tekshiruv',
    case: lang === 'en' ? "Problem" : lang === 'ru' ? 'Задача' : 'Vazifa',
    summary: lang === 'en' ? "Summary" : lang === 'ru' ? 'Итог' : 'Yakun',
  };
  return <span className="screen-type">{labels[type] ?? type}</span>;
};

const MOBILE_AUTO_SCROLL_TARGETS = [
  '.feedback-visible',
  '.explanation-finish-row',
  '.timeline-active',
  '.trainer-done',
  '.divider-outcome-solved',
  '.reflection-solved',
  '.reward-unlocked',
  '.answer-proof-layer.answer-layer-visible',
];

const Stage = ({ screen, eyebrow, audio, children, nav }) => {
  const t = useT();
  const isMobile = useIsMobile();
  const contentRef = useRef(null);
  const pad = isMobile ? 14 : 48;
  const meta = SCREEN_META[screen];

  useEffect(() => {
    const scroller = contentRef.current;
    if (!isMobile || !scroller) return undefined;

    scroller.scrollTo({ top: 0, behavior: 'auto' });
    let frameId = 0;
    let settleTimer = 0;
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const revealCurrentTarget = () => {
      const target = MOBILE_AUTO_SCROLL_TARGETS
        .map((selector) => scroller.querySelector(selector))
        .find(Boolean);
      if (!target) return;

      const viewport = scroller.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const safeTop = viewport.top + 10;
      const safeBottom = viewport.bottom - 14;
      let nextTop = scroller.scrollTop;

      if (targetRect.bottom > safeBottom) {
        nextTop += targetRect.bottom - safeBottom;
      } else if (targetRect.top < safeTop) {
        nextTop -= safeTop - targetRect.top;
      } else {
        return;
      }

      const maxTop = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
      scroller.scrollTo({
        top: Math.max(0, Math.min(nextTop, maxTop)),
        behavior: reducedMotion ? 'auto' : 'smooth',
      });
    };

    const scheduleReveal = () => {
      cancelAnimationFrame(frameId);
      window.clearTimeout(settleTimer);
      frameId = requestAnimationFrame(revealCurrentTarget);
      settleTimer = window.setTimeout(revealCurrentTarget, 720);
    };

    const observer = new MutationObserver(scheduleReveal);
    observer.observe(scroller, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['class', 'aria-hidden'],
    });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameId);
      window.clearTimeout(settleTimer);
    };
  }, [isMobile, screen]);

  return (
    <main className={`stage stage-${meta.type}`}>
      <header className="stage-header" style={{ paddingLeft: pad, paddingRight: pad }}>
        <div className="progress-track" aria-label={`${screen + 1} / ${TOTAL_SCREENS}`}>
          <div className="progress-fill progress-bar" style={{ width: `${((screen + 1) / TOTAL_SCREENS) * 100}%` }} />
        </div>
        <div className="stage-chrome">
          <div className="chrome-title">
            <span className="status-dot" />
            <span>{t(eyebrow)}</span>
          </div>
          <div className="chrome-actions">
            <ScreenTypeLabel type={meta.type} />
            {audio && <AudioIndicator audio={audio} />}
            <span className="screen-count">{String(screen + 1).padStart(2, '0')} / {TOTAL_SCREENS}</span>
          </div>
        </div>
      </header>
      <section ref={contentRef} className="stage-content" style={{ paddingLeft: pad, paddingRight: pad }}>
        {children}
      </section>
      <footer className="stage-nav" style={{ paddingLeft: pad, paddingRight: pad }}>
        {nav}
      </footer>
    </main>
  );
};

// Bridges remain in the narration queue, but are intentionally not duplicated on screen.
const Bridge = () => null;

// The same canonical Bit used in grade 1–3 lessons.
const BitSVG = ({ state = 'present', className = '' }) => {
  const isWave = state === 'wave';
  const isHappy = state === 'happy' || isWave || state === 'idea' || state === 'nod';
  const isThinking = state === 'hint' || state === 'think';
  const isAwkward = state === 'awkward';

  return (
  <svg className={`g1-char g1-char-bit g1-char-state-${state} ${className}`} viewBox="0 0 120 150" aria-hidden="true">
    <defs>
      <linearGradient id="g4bbody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#E2ECF2" />
        <stop offset="100%" stopColor="#B6C7D2" />
      </linearGradient>
      <linearGradient id="g4bhead" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#EBF2F6" />
        <stop offset="100%" stopColor="#C4D3DC" />
      </linearGradient>
    </defs>
    <ellipse cx="60" cy="140" rx="30" ry="5" fill="rgba(58,53,48,0.13)" />
    <g className="g1-bit-ant">
      <path d="M60 30 V14" stroke="#9FB3BF" strokeWidth="4" strokeLinecap="round" />
      <circle cx="60" cy="11" r="6" fill="#FF4F28" />
      <circle cx="58" cy="9" r="2" fill="#FFB9A6" />
    </g>
    <rect x="44" y="118" width="12" height="16" rx="5" fill="#9FB3BF" />
    <rect x="64" y="118" width="12" height="16" rx="5" fill="#9FB3BF" />
    <rect x="34" y="60" width="52" height="62" rx="18" fill="url(#g4bbody)" stroke="#A9BCC8" strokeWidth="2" />
    <rect x="44" y="104" width="32" height="10" rx="5" fill="#A9BCC8" opacity="0.5" />
    {(state === 'happy' || isWave) && (
      <g className={isWave ? 'bit-double-wave' : ''}>
        <g className="bit-wave-left">
          <path d="M36 74 C 26 66 22 56 22 48" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="22" cy="47" r="5" fill="#B6C7D2" />
        </g>
        <g className="bit-wave-right">
          <path d="M84 74 C 94 66 98 56 98 48" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="98" cy="47" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    {state === 'present' && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="103" r="5" fill="#B6C7D2" />
        <g className="g1-bit-wave">
          <path d="M84 74 C 96 66 100 54 98 44" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="98" cy="43" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    {isThinking && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="103" r="5" fill="#B6C7D2" />
        <g className="bit-think-hand">
          <path d="M84 76 C 92 74 92 66 84 61" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="83" cy="60" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    {isAwkward && (
      <g className="bit-awkward-hands">
        <path d="M36 76 C 39 88 46 96 54 99" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="54" cy="99" r="5" fill="#B6C7D2" />
        <path d="M84 76 C 81 88 74 96 66 99" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="66" cy="99" r="5" fill="#B6C7D2" />
      </g>
    )}
    {state === 'point' && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="103" r="5" fill="#B6C7D2" />
        <g className="bit-point-arm">
          <path d="M84 76 C 94 72 101 67 108 62" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="109" cy="61" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    {state === 'idea' && (
      <g>
        <path d="M36 76 C 29 82 27 91 30 101" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="102" r="5" fill="#B6C7D2" />
        <path d="M84 76 C 92 68 95 58 94 50" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="94" cy="49" r="5" fill="#B6C7D2" />
      </g>
    )}
    {state === 'focus' && (
      <g className="bit-focus-hands">
        <path d="M36 77 C 41 88 47 93 53 94" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="53" cy="94" r="5" fill="#B6C7D2" />
        <path d="M84 77 C 79 88 73 93 67 94" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="67" cy="94" r="5" fill="#B6C7D2" />
      </g>
    )}
    {state === 'nod' && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="103" r="5" fill="#B6C7D2" />
        <g className="bit-nod-hand">
          <path d="M84 75 C 93 70 99 62 99 54" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="99" cy="53" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    <rect x="28" y="28" width="64" height="46" rx="16" fill="url(#g4bhead)" stroke="#A9BCC8" strokeWidth="2" />
    <rect x="36" y="36" width="48" height="30" rx="10" fill="#16242C" />
    <path d="M40 40 h18 a4 4 0 0 1 -4 8 h-14 Z" fill="rgba(255,255,255,0.08)" />
    <g className="g1-eyes" fill="#5BD6F2">
      {isAwkward
        ? <><ellipse cx="50" cy="53" rx="4.8" ry="3.2" /><ellipse cx="70" cy="53" rx="4.8" ry="3.2" /></>
        : isThinking
        ? <><circle cx="50" cy="50" r="4.5" /><circle cx="70" cy="49" r="5.5" /></>
        : <><circle cx="50" cy="50" r="5" /><circle cx="70" cy="50" r="5" /></>}
    </g>
    {isHappy && <path d="M50 58 Q60 65 70 58" stroke="#5BD6F2" strokeWidth="2.6" fill="none" strokeLinecap="round" />}
    {(state === 'present' || state === 'point' || state === 'focus') && <path d="M52 58 h16" stroke="#5BD6F2" strokeWidth="2.6" strokeLinecap="round" />}
    {isThinking && <circle cx="60" cy="59" r="2.4" fill="#5BD6F2" />}
    {isAwkward && (
      <g className="bit-awkward-face">
        <path d="M53 62 Q60 57 67 62" stroke="#5BD6F2" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <circle cx="43" cy="59" r="4" fill="#FF9B8A" opacity=".5" />
        <circle cx="77" cy="59" r="4" fill="#FF9B8A" opacity=".5" />
      </g>
    )}
    {isThinking && (
      <g>
        <circle cx="99" cy="38" r="9" fill="#FFC23C" />
        <text x="99" y="42.5" textAnchor="middle" fontSize="12" fontWeight="800" fill="#5A3A00">?</text>
      </g>
    )}
    {state === 'point' && (
      <g className="bit-point-target">
        <circle cx="110" cy="61" r="8" fill="none" stroke="#FF5B35" strokeWidth="2" />
        <circle cx="110" cy="61" r="2" fill="#FF5B35" />
      </g>
    )}
    {state === 'idea' && (
      <g className="bit-idea-bulb">
        <circle cx="99" cy="36" r="9" fill="#FFC23C" />
        <path d="M95 36 Q99 31 103 36 M97 42 h4" stroke="#7A5200" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </g>
    )}
    {state === 'focus' && (
      <g className="bit-focus-scan">
        <path d="M43 45 h34" stroke="#95C93D" strokeWidth="2" strokeLinecap="round" />
        <circle cx="80" cy="45" r="3" fill="#95C93D" />
      </g>
    )}
    {state === 'nod' && (
      <g className="bit-nod-check">
        <circle cx="99" cy="38" r="9" fill="#95C93D" />
        <path d="M95 38 l3 3 6-7" stroke="#FFFFFF" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    )}
  </svg>
  );
};

const BitAvatar = ({ mood = 'thinking', small = false }) => {
  const state = mood === 'happy' ? 'happy' : (mood === 'hint' ? 'hint' : 'present');
  return (
    <div className={`bit-avatar ${small ? 'bit-small' : ''}`} aria-label="Bit">
      <BitSVG state={state} />
    </div>
  );
};

const BitCoach = ({ text, mood = 'present', actionKey = 0 }) => (
  <aside className={`bit-coach bit-coach-${mood}`}>
    <div
      key={actionKey}
      className={`bit-coach-figure ${actionKey ? 'bit-coach-reacting' : ''}`}
    >
      <BitSVG state={mood} />
    </div>
    <p>{text}</p>
  </aside>
);

const BIT_STEP_MOODS = ['think', 'point', 'idea', 'focus', 'nod', 'point'];

const getBitStepMood = (index, total) => {
  if (index === null || index === undefined) return 'present';
  if (index === 0 || index === total - 1) return 'wave';
  return BIT_STEP_MOODS[(index - 1) % BIT_STEP_MOODS.length];
};

const VisualAnswerProof = ({ formula, label }) => (
  <div className="answer-proof" aria-live="polite">
    <span className="answer-proof-check" aria-hidden="true">✓</span>
    <div>
      <strong>{formula}</strong>
      {label && <small>{label}</small>}
    </div>
  </div>
);

const ColumnCalculation = ({ top, bottom, result, operator }) => (
  <span className="column-calculation" aria-label={`${top} ${operator} ${bottom} = ${result}`}>
    <span className="column-row">{top}</span>
    <span className="column-row column-operation"><i>{operator}</i>{bottom}</span>
    <span className="column-rule" aria-hidden="true" />
    <span className="column-row column-result">{result}</span>
  </span>
);

const PlaceValueCalculation = ({ rows, t }) => (
  <span className="place-value-calculation">
    {rows.map((row) => (
      <span className="place-value-row" key={row.number}>
        <b>{row.number}</b>
        <i aria-hidden="true">→</i>
        <span>{t(row.place)}</span>
        <i aria-hidden="true">→</i>
        <em>{row.value}</em>
      </span>
    ))}
  </span>
);

const getProofFormula = (current, t) => {
  if (current.proofVisual?.type === 'column') {
    return (
      <ColumnCalculation
        top={current.proofVisual.top}
        bottom={current.proofVisual.bottom}
        result={current.proofVisual.result}
        operator={current.proofVisual.operator}
      />
    );
  }
  if (current.proofVisual?.type === 'place-values') {
    return <PlaceValueCalculation rows={current.proofVisual.rows} t={t} />;
  }
  return t(current.proof ?? current.options[current.correctIndex]);
};

const RecapShiftAnimation = ({ lang }) => {
  const labels = lang === 'en'
    ? ['HUNDREDS', 'TENS', 'ONES']
    : lang === 'ru'
      ? ['СОТНИ', 'ДЕСЯТКИ', 'ЕДИНИЦЫ']
      : ['YUZLIK', "O'NLIK", 'BIRLIK'];

  return (
    <div className="recap-shift-sequence">
      <svg
        className="recap-shift-svg"
        viewBox="0 0 540 182"
        role="img"
        aria-label={lang === 'en'
          ? 'The digit 7 moves smoothly two places to the left, while zeros appear on the right'
          : lang === 'ru'
            ? 'Цифра 7 дважды плавно перемещается на разряд влево, а справа появляются нули'
            : "7 raqami ikki marta chapdagi xonaga silliq o'tadi, o'ng tomonda nollar paydo bo'ladi"}
      >
        <path className="recap-shift-guide" d="M 430 42 C 350 12, 190 12, 110 42" />
        <path className="recap-shift-arrow" d="M 123 35 L 109 43 L 123 50" />

        {labels.map((label, index) => {
          const x = 60 + index * 160;
          const slotClass = ['recap-slot-hundreds', 'recap-slot-tens', 'recap-slot-units'][index];
          return (
            <g key={label}>
              <text className="recap-shift-label" x={x + 50} y="69" textAnchor="middle">
                {label}
              </text>
              <rect
                className={`recap-shift-slot ${slotClass}`}
                x={x}
                y="80"
                width="100"
                height="78"
                rx="18"
              />
            </g>
          );
        })}

        <text className="recap-moving-seven" x="430" y="134" textAnchor="middle">7</text>
        <text className="recap-born-zero recap-born-zero-units" x="430" y="134" textAnchor="middle">0</text>
        <text className="recap-born-zero recap-born-zero-tens" x="270" y="134" textAnchor="middle">0</text>
      </svg>

      <div className="recap-shift-readout" aria-hidden="true">
        <span className="recap-readout-seven">7</span>
        <i>×10</i>
        <span className="recap-readout-seventy">70</span>
        <i>×10</i>
        <span className="recap-readout-seven-hundred">700</span>
      </div>
      <p className="recap-shift-note">
        {lang === 'en'
          ? 'One place to the left — a 0 appears on the right'
          : lang === 'ru'
            ? 'Шаг влево — справа появляется 0'
            : "Chapga bir qadam — o'ngda 0 paydo bo'ladi"}
      </p>
    </div>
  );
};

const DataCenterScene = ({ raw = '125407', resolved = false, t }) => {
  const digits = raw.split('');

  return (
    <div className={`data-scene ${resolved ? 'data-scene-resolved' : ''}`} aria-hidden="true">
      <div className="city-grid" />
      <div className="data-ambient-orbit data-orbit-one" />
      <div className="data-ambient-orbit data-orbit-two" />

      <div className="data-tower">
        <div className="data-console-head">
          <span className="data-node-name"><i /> LUMO DATA · NODE 04</span>
          <span className="data-state">
            {resolved
              ? t({ ru: 'СТРУКТУРА НАЙДЕНА', uz: 'TUZILISH TOPILDI', en: "STRUCTURE FOUND" })
              : t({ ru: 'СТРУКТУРА НЕ ОПРЕДЕЛЕНА', uz: 'TUZILISH ANIQLANMAGAN', en: "STRUCTURE NOT DEFINED" })}
          </span>
        </div>

        <div className="tower-screen">
          <div className="tower-label-row">
            <span className="tower-label">{t({ ru: 'ГОРОДСКОЙ КОД', uz: 'SHAHAR KODI', en: "CITY CODE" })}</span>
            <small>{t({ ru: '6 ЦИФР', uz: '6 RAQAM', en: "6 CIFR" })}</small>
          </div>
          <strong className="data-code">
            {digits.map((digit, index) => (
              <React.Fragment key={`${digit}-${index}`}>
                {index === digits.length - 3 && <i className="data-code-divider" />}
                <span style={{ '--data-digit-delay': `${index * 90}ms` }}>{digit}</span>
              </React.Fragment>
            ))}
          </strong>
          <i className="data-code-scan" />
          <div className="data-class-reveal">
            <span>{t({ ru: 'КЛАСС ТЫСЯЧ', uz: 'MINGLAR SINFI', en: 'THOUSANDS GROUP' })}</span>
            <span>{t({ ru: 'КЛАСС ЕДИНИЦ', uz: 'BIRLAR SINFI', en: 'ONES GROUP' })}</span>
          </div>
        </div>

        <div className="data-diagnostics">
          <span><i className="diagnostic-ok" />{t({ ru: 'ЦИФРЫ: 6', uz: 'RAQAMLAR: 6', en: "digits: 6" })}</span>
          <span><i className="diagnostic-ok" />{t({ ru: 'ПОРЯДОК: СОХРАНЁН', uz: 'TARTIB: SAQLANGAN', en: "ORGANIZATION: SAVED" })}</span>
          <span className="diagnostic-structure">
            <i />
            {resolved
              ? t({ ru: 'КЛАССЫ: 2', uz: 'SINFLAR: 2', en: "groups: 2" })
              : t({ ru: 'КЛАССЫ: ?', uz: 'SINFLAR: ?', en: "groups?" })}
          </span>
        </div>
      </div>

      <div className="city-network">
        <svg viewBox="0 0 150 72">
          <path className="network-route" d="M12 54 C34 18 55 54 76 31 S119 11 139 35" />
          <circle className="network-node node-a" cx="12" cy="54" r="5" />
          <circle className="network-node node-b" cx="76" cy="31" r="5" />
          <circle className="network-node node-c" cx="139" cy="35" r="5" />
          <path className="network-building" d="M119 58V37h9V25h12v33M115 58h30" />
          <path className="network-windows" d="M124 43h4m5 0h4m-13 7h4m5 0h4" />
        </svg>
        <span>{t({ ru: 'СЕТЬ УМНОГО ГОРОДА', uz: "AQILLI SHAHAR TARMOG'I", en: "THE SMART CITY NETWORK" })}</span>
      </div>

      <div className="data-bit-callout">
        {resolved
          ? t({ ru: 'Код понятен!', uz: 'Kod tushunarli!', en: "Code clear!" })
          : t({ ru: 'Как устроен код?', uz: 'Kod qanday tuzilgan?', en: "How does the code work?" })}
      </div>
      <BitAvatar mood={resolved ? 'happy' : 'thinking'} />
    </div>
  );
};

const PlaceValueTable = ({
  values = [],
  highlight = -1,
  compact = false,
  showClassBanners = true,
}) => {
  const lang = useLang();
  const labels = lang === 'en'
    ? ['hundred thousands', 'ten thousands', 'thousands', 'hundreds', 'tens', 'ones']
    : lang === 'ru'
      ? ['сотни тысяч', 'десятки тысяч', 'тысячи', 'сотни', 'десятки', 'единицы']
      : ['yuz minglar', "o'n minglar", 'bir minglar', 'yuzlar', "o'nlar", 'birlar'];
  return (
    <div className={`place-table ${compact ? 'place-table-compact' : ''}`}>
      {showClassBanners && (
        <>
          <div className="class-banner class-thousands">{lang === 'en' ? 'THOUSANDS GROUP' : lang === 'ru' ? 'КЛАСС ТЫСЯЧ' : 'MINGLAR SINFI'}</div>
          <div className="class-banner class-units">{lang === 'en' ? 'ONES GROUP' : lang === 'ru' ? 'КЛАСС ЕДИНИЦ' : 'BIRLAR SINFI'}</div>
        </>
      )}
      {labels.map((label, index) => (
        <div key={label} className={`place-cell ${index === highlight ? 'place-highlight' : ''}`}>
          <span>{label}</span>
          <strong>{values[index] ?? ''}</strong>
        </div>
      ))}
    </div>
  );
};

const PlaceTableTransfer = ({ digits, phase, runKey }) => {
  const lang = useLang();
  const placed = digits.map((_, index) => (index >= 3 ? phase >= 1 : phase >= 2));
  const placementOrder = [2, 1, 0, 2, 1, 0];

  return (
    <div className="place-transfer" data-run={runKey}>
      <div className="place-transfer-prompt">
        <span>{lang === 'en' ? 'Digits above the chart' : lang === 'ru' ? 'Цифры вне таблицы' : 'Raqamlar tashqarida'}</span>
        <strong>{lang === 'en' ? "Right ↓" : lang === 'ru' ? 'Справа ↓' : "O'ngdan ↓"}</strong>
      </div>
      <div className="place-transfer-board">
        <div className="place-transfer-source" aria-label={digits.join('')}>
          {digits.map((digit, index) => (
            <span
              key={`${digit}-${index}`}
              className={placed[index] ? 'transfer-digit transfer-digit-placed' : 'transfer-digit'}
              style={{ '--transfer-delay': `${placementOrder[index] * 170}ms` }}
            >
              {digit}
            </span>
          ))}
        </div>
        <div className="transfer-empty-table">
          <PlaceValueTable values={[]} compact />
        </div>
      </div>
      <p className={`transfer-status ${phase >= 3 ? 'transfer-status-visible' : ''}`}>
        {lang === 'en' ? "Ready: 482 | 019." : lang === 'ru' ? 'Готово: 482 | 019.' : 'Tayyor: 482 | 019.'}
      </p>
    </div>
  );
};

const NumberGroups = ({ left, right, active }) => (
  <div className="number-groups">
    <div className={`number-group number-group-thousands ${active === 'left' ? 'group-active' : ''}`}>
      <span>{left}</span>
    </div>
    <span className="group-divider" aria-hidden="true" />
    <div className={`number-group number-group-units ${active === 'right' ? 'group-active' : ''}`}>
      <span>{right}</span>
    </div>
  </div>
);

const ChoiceScreen = ({
  screen,
  c,
  figure,
  options: optionsProp,
  answerOptions: answerOptionsProp,
  storedAnswer,
  onAnswer,
  onNext,
  onPrev,
  resetOnReturn = false,
  fact,
  quick = false,
}) => {
  const lang = useLang();
  const t = useT();
  const optionsRaw = optionsProp ?? c.options;
  const sourceOptions = optionsRaw.map((option) => t(option));
  const sourceAnswerOptions = answerOptionsProp?.map((option) => t(option)) ?? sourceOptions;
  const optionOrder = buildOptionOrder(sourceOptions.length, c.correctIndex, screen);
  const options = optionOrder.map((index) => sourceOptions[index]);
  const answerOptions = optionOrder.map((index) => sourceAnswerOptions[index]);
  const correctIndex = optionOrder.indexOf(c.correctIndex);
  const wasSolved = !resetOnReturn && storedAnswer?.solved === true;
  const [solved, setSolved] = useState(wasSolved);
  const [picked, setPicked] = useState(wasSolved ? correctIndex : null);
  const [wrong, setWrong] = useState(() => new Set());
  const firstTry = useRef(storedAnswer?.firstTry ?? null);
  const firstPicked = useRef(storedAnswer?.studentAnswerIndex ?? null);
  const attempts = useRef(storedAnswer?.attempts ?? 0);

  const intro = c.audio?.intro ?? c.audio;
  const audio = useAudio(useMemo(
    () => localizedScreenSegments(intro, lang, screen),
    [intro, lang, screen],
  ));
  const canAnswer = useCanAnswer(audio);
  const canAdvance = useAdvanceGate(solved, audio);

  const pick = (index) => {
    if (!canAnswer || solved || wrong.has(index)) return;
    const sourceIndex = optionOrder[index];
    const correct = sourceIndex === c.correctIndex;
    attempts.current += 1;
    if (firstTry.current === null) {
      firstTry.current = correct;
      firstPicked.current = index;
    }
    setPicked(index);
    const reactionSeed = screen * 13 + index;
    if (correct) {
      setSolved(true);
      onAnswer({
        stage: SCREEN_META[screen].scope,
        screenIdx: screen,
        question: t(c.question ?? c.title),
        options: answerOptions,
        correctIndex,
        correctAnswer: answerOptions[correctIndex],
        studentAnswerIndex: firstPicked.current,
        studentAnswer: answerOptions[firstPicked.current],
        correct: firstTry.current,
        firstTry: firstTry.current,
        attempts: attempts.current,
        solved: true,
      });
      audio.pushOneOff(bitSpeech(
        t,
        true,
        reactionSeed,
        t(c.audio?.on_correct ?? c.correctText),
      ));
      if (fact?.audio) {
        setTimeout(() => getAudioEngine()?.pushOneOff(t(fact.audio)), 1000);
      }
    } else {
      setWrong((prev) => new Set([...prev, index]));
      audio.pushOneOff(bitSpeech(
        t,
        false,
        reactionSeed,
        t(c.wrong?.[sourceIndex] ?? c.audio?.on_wrong),
      ));
    }
  };

  const pickedSourceIndex = picked !== null ? optionOrder[picked] : null;
  const feedbackText = solved
    ? t(c.correctText)
    : (pickedSourceIndex !== null ? t(c.wrong?.[pickedSourceIndex] ?? c.audio?.on_wrong) : '');

  const nav = (
    <>
      <NavBack onClick={onPrev} hidden={screen === 0} />
      <NavNext onClick={onNext} disabled={!canAdvance} />
    </>
  );

  return (
    <Stage screen={screen} eyebrow={c.eyebrow} audio={audio} nav={nav}>
      <div className={`screen-stack ${quick ? 'quick-test-screen' : ''}`}>
        <Bridge screen={screen} />
        {c.topic && <div className="topic-chip">{t(c.topic)}</div>}
        {c.title && <h1 className="title h-title">{t(c.title)}</h1>}
        {quick && (
          <div className="quick-test-meter">
            <span>{t(c.quickLabel)}</span>
            <div aria-hidden="true">
              {[11, 12, 13, 14].map((item) => (
                <i key={item} className={item <= screen ? 'quick-meter-active' : ''} />
              ))}
            </div>
            <strong>{screen - 10} / 4</strong>
          </div>
        )}
        <h2 className="question-title">{t(c.question)}</h2>
        {figure?.({ solved, picked })}
        <div className="answer-stage choice-answer-stage">
          <div className={`answer-layer answer-options-layer ${solved ? 'answer-layer-hidden' : ''}`}>
            <div className={`options-grid ${options.length === 3 ? 'options-three' : ''}`}>
              {options.map((option, index) => {
                const isWrong = wrong.has(index);
                const isCorrect = index === correctIndex;
                return (
                  <button
                    type="button"
                    key={`${option}-${index}`}
                    className={`option ${isWrong ? 'option-wrong' : ''} ${solved && isCorrect ? 'option-correct-reveal option-answer-confirm' : ''} ${solved && !isCorrect ? 'option-answer-dismiss' : ''}`}
                    style={{ '--answer-exit-delay': `${index * 85}ms` }}
                    disabled={!canAnswer || isWrong || solved}
                    onClick={() => pick(index)}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className={`answer-layer answer-proof-layer choice-proof-layer ${solved ? 'answer-layer-visible' : ''}`}>
            <BitAnswerComment formula={options[correctIndex]}>
              <p>{feedbackText}</p>
            </BitAnswerComment>
          </div>
        </div>
        <FeedbackBlock
          show={picked !== null && !solved}
          correct={false}
          reaction={picked !== null ? getBitReaction(false, screen * 13 + picked) : null}
        >
          <p>{feedbackText}</p>
        </FeedbackBlock>
      </div>
    </Stage>
  );
};

const FOUNDATION_RECAP_MIN_FRAME_MS = [5200, 5200, 9000, 5200, 3200];

const FoundationRecallAnimation = ({ audio, screen, onFinished }) => {
  const lang = useLang();
  const [phase, setPhase] = useState(0);
  const queuedPhase = useRef(0);
  const nextFrameAt = useRef(0);
  const phaseTimers = useRef([]);

  useEffect(() => {
    nextFrameAt.current = Date.now();
  }, []);

  useEffect(() => {
    const marker = `s${screen}-audio-`;
    if (!audio.currentSegment?.startsWith(marker)) return undefined;
    const targetPhase = Math.min(Number(audio.currentSegment.slice(marker.length)), 4);
    if (!Number.isInteger(targetPhase) || targetPhase <= queuedPhase.current) return undefined;

    const now = Date.now();
    for (let next = queuedPhase.current + 1; next <= targetPhase; next += 1) {
      // Keep every recap frame visible for its pedagogical minimum even when
      // several TTS markers arrive together after a slow or failed audio load.
      const previousPhase = next - 1;
      nextFrameAt.current = Math.max(
        nextFrameAt.current + FOUNDATION_RECAP_MIN_FRAME_MS[previousPhase],
        now,
      );
      const delay = Math.max(0, nextFrameAt.current - now);
      const timer = setTimeout(() => setPhase(next), delay);
      phaseTimers.current.push(timer);
    }
    queuedPhase.current = targetPhase;
    return undefined;
  }, [audio.currentSegment, screen]);

  useEffect(() => {
    if (phase !== 4) return undefined;
    const timer = setTimeout(() => onFinished?.(), 2800);
    return () => clearTimeout(timer);
  }, [onFinished, phase]);

  useEffect(() => () => {
    phaseTimers.current.forEach((timer) => clearTimeout(timer));
  }, []);

  const captions = lang === 'en'
    ? [
      'A place is the position of a digit',
      'The position gives the digit its place value',
      '7 → 70 → 700: each step to the left is ×10',
      'Zero holds a place',
      '3 tasks',
    ]
    : lang === 'ru'
      ? [
        'Разряд — место цифры',
        'Место задаёт значение',
        '7 → 70 → 700: каждый шаг влево ×10',
        'Ноль держит место',
        '3 задания',
      ]
      : [
        "Xona — raqamning o'rni",
        'Raqam xona qiymatini oladi',
        '7 → 70 → 700: chapga har qadam ×10',
        "Nol o'rinni saqlaydi",
        '3 topshiriq',
      ];

  const frames = [
    <div className="recap-place-row" key="places">
      {[
        lang === 'en' ? 'hundreds' : lang === 'ru' ? 'сотни' : 'yuzlar',
        lang === 'en' ? 'tens' : lang === 'ru' ? 'десятки' : "o'nlar",
        lang === 'en' ? 'ones' : lang === 'ru' ? 'единицы' : 'birlar',
      ].map((label, index) => (
        <div key={label} style={{ '--recap-delay': `${index * 180}ms` }}>
          <strong>{[3, 2, 6][index]}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>,
    <div className="recap-sum" key="sum" aria-label="326 = 300 + 20 + 6">
      <strong>326</strong><span>=</span><b>300</b><span>+</span><b>20</b><span>+</span><b>6</b>
    </div>,
    <RecapShiftAnimation key="shift" lang={lang} />,
    <div className="recap-zero" key="zero">
      <span>8</span><strong>0</strong><span>6</span>
      <p>{lang === 'en' ? "0 holds the place of tens" : lang === 'ru' ? '0 удерживает место десятков' : "0 o'nlar o'rnini ushlab turadi"}</p>
    </div>,
    <div className="recap-task-preview" key="tasks">
      {[1, 2, 3].map((item) => (
        <span key={item}><b>{item}</b><i aria-hidden="true">?</i></span>
      ))}
    </div>,
  ];

  return (
    <div className="foundation-recap" aria-live="polite">
      <div className="recap-progress" aria-hidden="true">
        {frames.map((_, index) => <i key={index} className={index <= phase ? 'recap-progress-active' : ''} />)}
      </div>
      <div className="recap-frame" key={phase}>{frames[phase]}</div>
      <p>{captions[phase]}</p>
    </div>
  );
};

const ReasoningRoundsScreen = ({
  screen,
  c,
  storedAnswer,
  onAnswer,
  onNext,
  onPrev,
  foundation = false,
}) => {
  const lang = useLang();
  const t = useT();
  const restored = storedAnswer?.solved === true;
  const [round, setRound] = useState(restored ? c.rounds.length - 1 : 0);
  const [roundSolved, setRoundSolved] = useState(restored);
  const [completed, setCompleted] = useState(restored);
  const [tasksReady, setTasksReady] = useState(!foundation || restored);
  const [recapFinished, setRecapFinished] = useState(!foundation || restored);
  const [wrong, setWrong] = useState(() => new Set());
  const [message, setMessage] = useState(restored ? t(c.completionText) : '');
  const [reactionSeed, setReactionSeed] = useState(null);
  const firstTry = useRef(storedAnswer?.subResults ?? Array(c.rounds.length).fill(null));
  const attempts = useRef(storedAnswer?.attempts ?? 0);
  const current = c.rounds[Math.min(round, c.rounds.length - 1)];
  const optionOrder = buildOptionOrder(
    current.options.length,
    current.correctIndex,
    screen * 4 + round,
  );
  const options = optionOrder.map((index) => current.options[index]);
  const correctIndex = optionOrder.indexOf(current.correctIndex);
  const audioValue = c.audio?.intro ?? c.audio;
  const audio = useAudio(useMemo(
    () => localizedScreenSegments(audioValue, lang, screen),
    [audioValue, lang, screen],
  ));
  const canAnswer = useCanAnswer(audio);
  const canAdvance = useAdvanceGate(completed, audio);
  const proofFormula = getProofFormula(current, t);
  const proofLabel = t(current.proofLabel ?? {
    ru: 'Ответ подтверждён по разрядам',
    uz: "Javob xonalar bo'yicha tasdiqlandi",
    en: 'The places confirm the answer',
  });

  useEffect(() => {
    if (
      !foundation
      || tasksReady
      || (!audio.muted && (!audio.completed || !recapFinished))
    ) return undefined;
    const timer = setTimeout(() => setTasksReady(true), 250);
    return () => clearTimeout(timer);
  }, [audio.completed, audio.muted, foundation, recapFinished, tasksReady]);

  const choose = (index) => {
    if (!canAnswer || roundSolved || wrong.has(index)) return;
    attempts.current += 1;
    const sourceIndex = optionOrder[index];
    const correct = sourceIndex === current.correctIndex;
    const nextReactionSeed = screen * 17 + round * 3 + index;
    if (firstTry.current[round] === null) firstTry.current[round] = correct;
    setReactionSeed(nextReactionSeed);

    if (!correct) {
      setWrong((previous) => new Set([...previous, index]));
      setMessage(t(current.wrongText ?? c.wrongText));
      audio.pushOneOff(bitSpeech(
        t,
        false,
        nextReactionSeed,
        t(current.wrongText ?? c.audio?.on_wrong ?? c.wrongText),
      ));
      return;
    }

    setRoundSolved(true);
    setMessage(t(current.correctText));
    audio.pushOneOff(bitSpeech(t, true, nextReactionSeed, t(current.correctText)));
    if (round === c.rounds.length - 1) {
      setCompleted(true);
      onAnswer({
        stage: SCREEN_META[screen].scope,
        screenIdx: screen,
        question: t(c.title),
        options: null,
        correctIndex: null,
        correctAnswer: c.rounds.map((item) => t(item.options[item.correctIndex])).join('; '),
        studentAnswerIndex: null,
        studentAnswer: 'completed',
        correct: firstTry.current.every(Boolean),
        firstTry: firstTry.current.every(Boolean),
        attempts: attempts.current,
        solved: true,
        subResults: [...firstTry.current],
      });
    }
  };

  const nextRound = () => {
    if (!roundSolved || completed) return;
    setRound((value) => value + 1);
    setRoundSolved(false);
    setWrong(new Set());
    setMessage('');
    setReactionSeed(null);
  };

  const renderVisual = () => {
    const values = current.visualValues ?? [current.number];
    return (
      <div className={`reasoning-visual ${values.length > 1 ? 'reasoning-compare' : ''} ${roundSolved ? 'reasoning-visual-solved' : ''}`}>
        {values.filter(Boolean).map((value, index) => (
          <React.Fragment key={`${value}-${index}`}>
            {index > 0 && <span className="reasoning-arrow" aria-hidden="true">↔</span>}
            <strong>{value}</strong>
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={(
        <>
          <NavBack onClick={onPrev} />
          <NavNext onClick={onNext} disabled={!canAdvance} />
        </>
      )}
    >
      <div className={`screen-stack reasoning-screen ${foundation ? 'foundation-screen' : ''}`}>
        <Bridge screen={screen} />
        <h1 className="title h-title">{t(c.title)}</h1>
        {foundation && !tasksReady && (
          <FoundationRecallAnimation
            audio={audio}
            screen={screen}
            onFinished={() => setRecapFinished(true)}
          />
        )}
        {c.memoryCards && tasksReady && (
          <div className="foundation-memory foundation-memory-ready">
            {c.memoryCards.map((card) => (
              <div key={t(card.label)}>
                <span>{t(card.label)}</span>
              </div>
            ))}
          </div>
        )}
        {tasksReady && <div className="reasoning-card">
          <div className="reasoning-progress">
            <span>{lang === 'en' ? `Question ${round + 1}` : lang === 'ru' ? `Вопрос ${round + 1}` : `Savol ${round + 1}`}</span>
            <div>
              {c.rounds.map((_, index) => (
                <i
                  key={index}
                  className={`${index < round || completed ? 'reasoning-done' : ''} ${index === round && !completed ? 'reasoning-active' : ''}`}
                />
              ))}
            </div>
            <strong>{round + 1} / {c.rounds.length}</strong>
          </div>
          <h2 className="question-title">{t(current.question)}</h2>
          {renderVisual()}
          <div className="answer-stage reasoning-answer-stage">
            <div className={`answer-layer answer-options-layer ${roundSolved ? 'answer-layer-hidden' : ''}`}>
              <div className={`options-grid ${current.options.length === 3 ? 'options-three' : ''}`}>
                {options.map((option, index) => (
                  <button
                    type="button"
                    key={`${t(option)}-${index}`}
                    className={`option ${wrong.has(index) ? 'option-wrong' : ''} ${roundSolved && index === correctIndex ? 'option-correct-reveal option-answer-confirm' : ''} ${roundSolved && index !== correctIndex ? 'option-answer-dismiss' : ''}`}
                    style={{ '--answer-exit-delay': `${index * 85}ms` }}
                    disabled={wrong.has(index) || !canAnswer || roundSolved}
                    onClick={() => choose(index)}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                    <span>{t(option)}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className={`answer-layer answer-proof-layer reasoning-proof-layer ${completed ? 'reasoning-proof-completed' : ''} ${roundSolved ? 'answer-layer-visible' : ''}`}>
              {roundSolved && (
                <BitAnswerComment
                  formula={proofFormula}
                  label={proofLabel}
                >
                  <p>{message}</p>
                </BitAnswerComment>
              )}
              {roundSolved && !completed && (
                <button type="button" className="btn btn-secondary" onClick={nextRound}>
                  {lang === 'en' ? "Next question" : lang === 'ru' ? 'Следующий вопрос' : 'Keyingi savol'} <span aria-hidden="true">→</span>
                </button>
              )}
              {completed && <p className="reasoning-complete">{t(c.completionText)}</p>}
            </div>
          </div>
        </div>}
        {tasksReady && <FeedbackBlock
          show={Boolean(message) && !roundSolved}
          correct={false}
          reaction={reactionSeed !== null ? getBitReaction(false, reactionSeed) : null}
        >
          <p>{message}</p>
        </FeedbackBlock>}
      </div>
    </Stage>
  );
};

const DividerPlacementScreen = ({
  screen,
  c,
  storedAnswer,
  onAnswer,
  onNext,
  onPrev,
  guided = false,
}) => {
  const lang = useLang();
  const t = useT();
  const digits = c.raw.split('');
  const [selectedGap, setSelectedGap] = useState(storedAnswer?.selectedGap ?? null);
  const [solved, setSolved] = useState(storedAnswer?.solved === true);
  const [checked, setChecked] = useState(false);
  const [message, setMessage] = useState(storedAnswer?.solved ? t(c.correctText) : '');
  const firstTry = useRef(storedAnswer?.firstTry ?? null);
  const attempts = useRef(storedAnswer?.attempts ?? 0);
  const audioValue = c.audio?.intro ?? c.audio;
  const audio = useAudio(useMemo(
    () => localizedScreenSegments(audioValue, lang, screen),
    [audioValue, lang, screen],
  ));
  const canAnswer = useCanAnswer(audio);
  const canAdvance = useAdvanceGate(solved, audio);

  const selectGap = (gap) => {
    if (solved || !canAnswer) return;
    setSelectedGap(gap);
    setChecked(false);
    setMessage('');
  };

  const submit = () => {
    if (solved || selectedGap === null) return;
    attempts.current += 1;
    const correct = selectedGap === c.correctGap;
    const reactionSeed = screen * 19 + selectedGap;
    if (firstTry.current === null) firstTry.current = correct;
    setChecked(true);
    if (!correct) {
      setMessage(t(c.wrongText));
      audio.pushOneOff(bitSpeech(t, false, reactionSeed, t(c.wrongText)));
      return;
    }
    setSolved(true);
    setMessage(t(c.correctText));
    audio.pushOneOff(bitSpeech(t, true, reactionSeed, t(c.correctText)));
    onAnswer({
      stage: SCREEN_META[screen].scope,
      screenIdx: screen,
      question: t(c.title),
      options: null,
      correctIndex: c.correctGap,
      correctAnswer: c.result,
      studentAnswerIndex: selectedGap,
      studentAnswer: `${c.raw.slice(0, selectedGap)} | ${c.raw.slice(selectedGap)}`,
      correct: firstTry.current,
      firstTry: firstTry.current,
      attempts: attempts.current,
      solved: true,
      selectedGap,
    });
  };

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={(
        <>
          <NavBack onClick={onPrev} />
          <NavNext onClick={onNext} disabled={!canAdvance} />
        </>
      )}
    >
      <div className="screen-stack divider-screen">
        <Bridge screen={screen} />
        <h1 className="title h-title">{t(c.title)}</h1>
        <div className="divider-workbench">
          {guided && (
            <div className={`finger-guide ${solved ? 'finger-guide-solved' : ''}`}>
              <span className="finger-guide-hand" aria-hidden="true">{solved ? '✓' : '☝️'}</span>
              <div>
                <strong>
                  {solved
                    ? (lang === 'en' ? 'Three places found' : lang === 'ru' ? 'Три разряда найдены' : 'Uchta xona topildi')
                    : t(c.guideTitle)}
                </strong>
              </div>
              <div className="finger-count" aria-hidden="true"><i>3</i><b>←</b><i>2</i><b>←</b><i>1</i></div>
            </div>
          )}
          <div className="divider-number" aria-label={c.raw}>
            {digits.map((digit, index) => (
              <React.Fragment key={`${digit}-${index}`}>
                {index > 0 && (
                  <button
                    type="button"
                    className={`divider-gap ${selectedGap === index ? 'divider-gap-selected' : ''} ${checked && selectedGap === index && !solved ? 'divider-gap-wrong' : ''} ${solved && index === c.correctGap ? 'divider-gap-correct' : ''}`}
                    disabled={solved}
                    onClick={() => selectGap(index)}
                    aria-label={lang === 'en' ? `Place a boundary between digits ${index} and ${index + 1}` : lang === 'ru' ? `Поставить границу между цифрами ${index} и ${index + 1}` : `${index}- va ${index + 1}-raqam orasiga chegara qo'yish`}
                  >
                    <span />
                  </button>
                )}
                <span className="divider-digit">{digit}</span>
              </React.Fragment>
            ))}
          </div>
          <div className={`divider-outcome ${solved ? 'divider-outcome-solved' : ''}`}>
            <div className="divider-outcome-layer divider-prompt-layer">
              <div className="divider-instruction">
                <span aria-hidden="true">👆</span>
                <p>{t(c.instruction)}</p>
              </div>
              <div className="inline-action">
                <button type="button" className="btn btn-white-accent" disabled={selectedGap === null || solved} onClick={submit}>
                  {lang === 'en' ? "Check" : lang === 'ru' ? 'Проверить' : 'Tekshirish'}
                </button>
              </div>
            </div>
            <div className="divider-outcome-layer divider-proof-layer">
              <NumberGroups
                left={c.raw.slice(0, c.correctGap)}
                right={c.raw.slice(c.correctGap)}
              />
              <p>
                {lang === 'en' ? 'The boundary is placed after three places on the right' : lang === 'ru' ? 'Граница встала после трёх разрядов справа' : "Chegara to'g'ri joyga o'rnatildi"}
              </p>
            </div>
          </div>
        </div>
        <FeedbackBlock
          show={Boolean(message)}
          correct={solved}
          reaction={selectedGap !== null ? getBitReaction(solved, screen * 19 + selectedGap) : null}
        >
          <p>{message}</p>
        </FeedbackBlock>
      </div>
    </Stage>
  );
};

const ClassGroupingAnimation = ({
  digits = ['1', '2', '5', '4', '0', '7'],
  boundaryAfter = 2,
  phase = 0,
  runKey = 0,
  showTable = false,
  tableTransfer = false,
  leftRevealPhase = 2,
}) => {
  const lang = useLang();
  const variant = digits.length <= 4 ? 'four-digit' : 'six-digit';
  const rightStart = boundaryAfter + 1;
  const showRightGroup = phase >= 1;
  const showBoundary = phase >= 2;
  const showLeftGroup = phase >= leftRevealPhase;
  const showClassNames = phase >= 3;
  const directionLabel = lang === 'en' ? 'From the right' : lang === 'ru' ? 'Справа' : "O'ngdan";
  const unitsLabel = lang === 'en' ? 'ONES GROUP' : lang === 'ru' ? 'КЛАСС ЕДИНИЦ' : 'BIRLAR SINFI';
  const thousandsLabel = lang === 'en' ? 'THOUSANDS GROUP' : lang === 'ru' ? 'КЛАСС ТЫСЯЧ' : 'MINGLAR SINFI';

  if (showTable && tableTransfer && digits.length === 6) {
    return <PlaceTableTransfer digits={digits} phase={phase} runKey={runKey} />;
  }

  return (
    <div className={`class-animation class-animation-${variant}`} key={`${variant}-${runKey}`}>
      <div className="class-direction">
        <span>{directionLabel}</span>
        <span className="direction-arrow" aria-hidden="true">←</span>
      </div>
      <div className="animated-number" aria-label={digits.join('')}>
        {digits.map((digit, index) => {
          const isRight = index >= rightStart;
          const active = (isRight && showRightGroup) || (!isRight && showLeftGroup);
          const anchor = phase === 0 && index === digits.length - 1;
          return (
            <React.Fragment key={`${digit}-${index}`}>
              <span
                className={`animated-digit ${active ? (isRight ? 'digit-units' : 'digit-thousands') : ''} ${anchor ? 'digit-anchor' : ''}`}
                style={{ '--digit-delay': `${Math.abs((digits.length - 1) - index) * 90}ms` }}
              >
                {digit}
                {anchor && <small>{lang === 'en' ? 'ones' : lang === 'ru' ? 'единицы' : 'birlar'}</small>}
              </span>
              {index === boundaryAfter && (
                <span className={`animated-divider ${showBoundary ? 'divider-visible' : ''}`} aria-hidden="true" />
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div
        className={`class-name-row ${showClassNames ? 'class-names-visible' : ''}`}
        style={{ gridTemplateColumns: `${boundaryAfter + 1}fr ${digits.length - boundaryAfter - 1}fr` }}
      >
        <span className="class-name-thousands">{thousandsLabel}</span>
        <span className="class-name-units">{unitsLabel}</span>
      </div>
      {showTable && showClassNames && digits.length === 6 && (
        <PlaceValueTable values={digits} compact showClassBanners={false} />
      )}
    </div>
  );
};

const AnimatedExplanationScreen = ({
  screen,
  c,
  onNext,
  onPrev,
  showReplayButton = true,
}) => {
  const lang = useLang();
  const t = useT();
  const steps = c.explanationSteps;
  const [phase, setPhase] = useState(null);
  const [visited, setVisited] = useState(() => new Set());
  const [runKey, setRunKey] = useState(0);
  const [bitReactionKey, setBitReactionKey] = useState(0);
  const audio = useAudio(useMemo(
    () => localizedScreenSegments(c.interactionIntro, lang, screen),
    [c.interactionIntro, lang, screen],
  ));
  const finished = visited.size === steps.length;
  const canAdvance = useAdvanceGate(finished, audio);
  const activePhase = phase ?? 0;

  const explainStep = (index) => {
    if (index > visited.size && !visited.has(index)) return;
    const step = steps[index];
    setPhase(index);
    setVisited((previous) => new Set([...previous, index]));
    setBitReactionKey((current) => current + 1);
    const narration = c.audio?.[lang]?.[index] ?? t(step.text);
    audio.pushOneOff(narration);
  };

  const replay = () => {
    setPhase(null);
    setVisited(new Set());
    setRunKey((current) => current + 1);
    setBitReactionKey((current) => current + 1);
    audio.pushOneOff(t(c.interactionIntro));
  };

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={(
        <>
          <NavBack onClick={onPrev} />
          <NavNext onClick={onNext} disabled={!canAdvance} />
        </>
      )}
    >
      <div className={`screen-stack explanation-screen explanation-screen-${screen}`}>
        <Bridge screen={screen} />
        <h1 className="title h-title">{t(c.title)}</h1>
        <div className="explanation-layout">
          <div className="explanation-visual">
            <ClassGroupingAnimation
              digits={c.digits}
              boundaryAfter={c.boundaryAfter}
              phase={steps[activePhase].visualPhase ?? activePhase}
              runKey={runKey}
              showTable={c.showTable}
              tableTransfer={c.tableTransfer}
              leftRevealPhase={c.leftRevealPhase ?? 2}
            />
          </div>
          <div className="explanation-copy" aria-live="polite">
            <BitCoach
              text={phase === null ? t(c.startPrompt) : t(steps[phase].shortText ?? steps[phase].label)}
              mood={getBitStepMood(phase, steps.length)}
              actionKey={bitReactionKey}
            />
          </div>
        </div>
        <div className={`explanation-timeline timeline-count-${steps.length}`} aria-label={t(c.title)}>
          {steps.map((step, index) => (
            <button
              type="button"
              key={t(step.label)}
              className={`timeline-step ${index === phase ? 'timeline-active' : ''} ${visited.has(index) ? 'timeline-visited' : ''} ${phase === null && index === 0 ? 'timeline-awaiting' : ''}`}
              disabled={index > visited.size && !visited.has(index)}
              onClick={() => explainStep(index)}
            >
              <span>{visited.has(index) ? '✓' : index + 1}</span>
              <strong>{t(step.label)}</strong>
            </button>
          ))}
        </div>
        {finished && showReplayButton && (
          <div className="explanation-finish-row">
            <p className="explanation-result">{t(c.resultText)}</p>
            <button type="button" className="btn btn-secondary explanation-replay" onClick={replay}>
              <span aria-hidden="true">↻</span> {t(c.replayLabel)}
            </button>
          </div>
        )}
      </div>
    </Stage>
  );
};

// Retained as a reusable guided-choice template for later grade-4 lessons.
// eslint-disable-next-line no-unused-vars
const GuidedClassTrainerScreen = ({
  screen,
  c,
  storedAnswer,
  onAnswer,
  onNext,
  onPrev,
}) => {
  const lang = useLang();
  const t = useT();
  const [stepIndex, setStepIndex] = useState(storedAnswer?.solved ? c.trainerSteps.length - 1 : 0);
  const [stepSolved, setStepSolved] = useState(storedAnswer?.solved === true);
  const [solved, setSolved] = useState(storedAnswer?.solved === true);
  const [wrong, setWrong] = useState(() => new Set());
  const [message, setMessage] = useState(storedAnswer?.solved ? t(c.doneText) : '');
  const attempts = useRef(storedAnswer?.attempts ?? 0);
  const firstTry = useRef(storedAnswer?.firstTry ?? true);
  const currentStep = c.trainerSteps[stepIndex];
  const audio = useAudio(useMemo(
    () => localizedScreenSegments(c.audio, lang, screen),
    [c.audio, lang, screen],
  ));
  const canAnswer = useCanAnswer(audio);
  const canAdvance = useAdvanceGate(solved, audio);
  const visualPhase = solved
    ? 3
    : (stepIndex === 0 ? (stepSolved ? 1 : 0) : (stepIndex === 1 ? 1 : 2));

  const pick = (index) => {
    if (!canAnswer || solved || stepSolved || wrong.has(index)) return;
    attempts.current += 1;
    if (index !== currentStep.correctIndex) {
      firstTry.current = false;
      setWrong((previous) => new Set([...previous, index]));
      setMessage(t(currentStep.hint));
      audio.pushOneOff(t(currentStep.hint));
      return;
    }

    setStepSolved(true);
    setMessage(t(currentStep.correctText));
    audio.pushOneOff(t(currentStep.correctText));

    if (stepIndex === c.trainerSteps.length - 1) {
      setSolved(true);
      setMessage(t(c.doneText));
      onAnswer({
        stage: SCREEN_META[screen].scope,
        screenIdx: screen,
        question: t(c.title),
        options: null,
        correctIndex: null,
        correctAnswer: c.resultCode,
        studentAnswerIndex: null,
        studentAnswer: c.resultCode,
        correct: firstTry.current,
        firstTry: firstTry.current,
        attempts: attempts.current,
        solved: true,
        trainerStep: c.trainerSteps.length,
      });
    }
  };

  const nextTrainerStep = () => {
    if (!stepSolved || solved) return;
    setStepIndex((current) => current + 1);
    setStepSolved(false);
    setWrong(new Set());
    setMessage('');
  };

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={(
        <>
          <NavBack onClick={onPrev} />
          <NavNext onClick={onNext} disabled={!canAdvance} />
        </>
      )}
    >
      <div className="screen-stack trainer-screen">
        <Bridge screen={screen} />
        <h1 className="title h-title">{t(c.title)}</h1>
        <p className="lead">{t(c.trainerLead)}</p>
        <div className="trainer-layout">
          <div className="trainer-visual">
            <ClassGroupingAnimation
              digits={c.digits}
              boundaryAfter={c.boundaryAfter}
              phase={visualPhase}
              runKey={stepIndex}
              leftRevealPhase={2}
            />
          </div>
          <div className="trainer-task">
            <BitCoach
              text={solved ? t(c.doneText) : t(currentStep.prompt)}
              mood={solved ? 'happy' : 'present'}
            />
            {!solved && (
              <>
                <div className="trainer-progress" aria-label={`${stepIndex + 1} / ${c.trainerSteps.length}`}>
                  {c.trainerSteps.map((_, index) => (
                    <span
                      key={index}
                      className={`${index < stepIndex ? 'trainer-dot-done' : ''} ${index === stepIndex ? 'trainer-dot-active' : ''}`}
                    />
                  ))}
                </div>
                <h2 className="question-title">{t(currentStep.prompt)}</h2>
                <div className="options-grid options-three trainer-options">
                  {currentStep.options.map((option, index) => (
                    <button
                      type="button"
                      key={`${t(option)}-${index}`}
                      className={`option ${wrong.has(index) ? 'option-wrong' : ''} ${stepSolved && index === currentStep.correctIndex ? 'trainer-option-correct' : ''}`}
                      disabled={!canAnswer || stepSolved || wrong.has(index)}
                      onClick={() => pick(index)}
                    >
                      <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                      <span>{t(option)}</span>
                    </button>
                  ))}
                </div>
                <FeedbackBlock show={Boolean(message)} correct={stepSolved}>
                  <p>{message}</p>
                </FeedbackBlock>
                {stepSolved && stepIndex < c.trainerSteps.length - 1 && (
                  <div className="inline-action">
                    <button type="button" className="btn btn-secondary" onClick={nextTrainerStep}>
                      {lang === 'en' ? "Next step." : lang === 'ru' ? 'Следующий шаг' : 'Keyingi qadam'} <span aria-hidden="true">→</span>
                    </button>
                  </div>
                )}
              </>
            )}
            {solved && <p className="trainer-done">{t(c.doneText)}</p>}
          </div>
        </div>
      </div>
    </Stage>
  );
};

// Retained as a reusable grade-4 interaction template for later lessons.
// eslint-disable-next-line no-unused-vars
const DigitBuilderScreen = ({
  screen,
  c,
  storedAnswer,
  onAnswer,
  onNext,
  onPrev,
}) => {
  const lang = useLang();
  const t = useT();
  const locked = c.target.map((value) => value === null);
  const initialSlots = c.target.map(() => null);
  const [slots, setSlots] = useState(() => {
    if (storedAnswer?.solved && Array.isArray(storedAnswer.finalSlots)) return storedAnswer.finalSlots;
    return initialSlots;
  });
  const sourceDigits = useMemo(
    () => c.digits.map((value, index) => ({ id: `${value}-${index}`, value })),
    [c.digits],
  );
  const [selectedId, setSelectedId] = useState(null);
  const [solved, setSolved] = useState(storedAnswer?.solved === true);
  const [checked, setChecked] = useState(false);
  const attempts = useRef(storedAnswer?.attempts ?? 0);
  const [attemptCount, setAttemptCount] = useState(storedAnswer?.attempts ?? 0);
  const firstTry = useRef(storedAnswer?.firstTry ?? null);
  const intro = c.audio?.intro ?? c.audio;
  const audio = useAudio(useMemo(
    () => localizedScreenSegments(intro, lang, screen),
    [intro, lang, screen],
  ));
  const canAnswer = useCanAnswer(audio);
  const canAdvance = useAdvanceGate(solved, audio);

  const usedIds = new Set(slots.filter(Boolean).map((slot) => slot.id));
  const available = sourceDigits.filter((digit) => !usedIds.has(digit.id));

  const place = (digitId, slotIndex) => {
    if (!canAnswer || solved || locked[slotIndex]) return;
    const digit = sourceDigits.find((item) => item.id === digitId);
    if (!digit) return;
    setChecked(false);
    setSlots((prev) => {
      const next = prev.map((slot) => (slot?.id === digitId ? null : slot));
      next[slotIndex] = digit;
      return next;
    });
    setSelectedId(null);
  };

  const clearSlot = (slotIndex) => {
    if (solved || locked[slotIndex]) return;
    if (selectedId) {
      place(selectedId, slotIndex);
      return;
    }
    setChecked(false);
    setSlots((prev) => prev.map((slot, index) => (index === slotIndex ? null : slot)));
  };

  const check = () => {
    if (available.length > 0 || solved) return;
    attempts.current += 1;
    setAttemptCount(attempts.current);
    const correct = slots.every((slot, index) => {
      if (c.target[index] === null) return slot === null;
      return slot?.value === c.target[index];
    });
    if (firstTry.current === null) firstTry.current = correct;
    setChecked(true);
    if (correct) {
      setSolved(true);
      onAnswer({
        stage: SCREEN_META[screen].scope,
        screenIdx: screen,
        question: t(c.title),
        options: null,
        correctIndex: null,
        correctAnswer: c.target.filter((value) => value !== null).join(''),
        studentAnswerIndex: null,
        studentAnswer: slots.map((slot) => slot?.value ?? '').join(''),
        correct: firstTry.current,
        firstTry: firstTry.current,
        attempts: attempts.current,
        solved: true,
        finalSlots: slots,
      });
      audio.pushOneOff(t(c.audio?.on_correct ?? c.doneText));
    } else {
      audio.pushOneOff(t(c.audio?.on_wrong ?? (attempts.current > 1 ? c.hint2 : c.hint1)));
    }
  };

  const nav = (
    <>
      <NavBack onClick={onPrev} />
      <NavNext onClick={onNext} disabled={!canAdvance} />
    </>
  );

  return (
    <Stage screen={screen} eyebrow={c.eyebrow} audio={audio} nav={nav}>
      <div className="screen-stack">
        <Bridge screen={screen} />
        <h1 className="title h-title">{t(c.title)}</h1>
        <p className="lead">{t(c.instruction)}</p>
        <div className="builder-frame">
          <PlaceValueTable values={slots.map((slot) => slot?.value ?? '')} />
          <div className="slot-overlay" aria-label={t(c.title)}>
            {slots.map((slot, index) => (
              <button
                type="button"
                key={`slot-${index}`}
                className={`drop-slot ${locked[index] ? 'drop-locked' : ''} ${selectedId ? 'drop-ready' : ''}`}
                onClick={() => clearSlot(index)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  place(event.dataTransfer.getData('text/plain'), index);
                }}
                aria-label={`${index + 1}`}
              >
                {locked[index] ? '—' : (slot?.value ?? '·')}
              </button>
            ))}
          </div>
          <div className="digit-tray">
            {available.map((digit) => (
              <button
                type="button"
                key={digit.id}
                className={`digit-card ${selectedId === digit.id ? 'digit-selected' : ''}`}
                draggable
                onDragStart={(event) => event.dataTransfer.setData('text/plain', digit.id)}
                onClick={() => setSelectedId((current) => (current === digit.id ? null : digit.id))}
              >
                {digit.value}
              </button>
            ))}
            {available.length === 0 && <span className="tray-empty">{lang === 'en' ? 'All digits placed' : lang === 'ru' ? 'Все цифры размещены' : 'Barcha raqamlar joylashtirildi'}</span>}
          </div>
          {!solved && (
            <div className="inline-action">
              <button type="button" className="btn btn-white-accent" disabled={available.length > 0} onClick={check}>
                {lang === 'en' ? "Check" : lang === 'ru' ? 'Проверить' : 'Tekshirish'}
              </button>
            </div>
          )}
        </div>
        <FeedbackBlock show={checked || solved} correct={solved}>
          <p>{solved ? t(c.doneText) : t(attemptCount > 1 ? c.hint2 : c.hint1)}</p>
        </FeedbackBlock>
      </div>
    </Stage>
  );
};

// Retained as a reusable matching template for later grade-4 lessons.
// eslint-disable-next-line no-unused-vars
const ClassMatchScreen = ({ screen, c, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const [selected, setSelected] = useState(null);
  const [matched, setMatched] = useState(() => new Set(storedAnswer?.matched ?? []));
  const [message, setMessage] = useState('');
  const [reactionCorrect, setReactionCorrect] = useState(null);
  const solved = matched.size === c.labels.length;
  const audio = useAudio(useMemo(
    () => localizedScreenSegments(c.audio, lang, screen),
    [c.audio, lang, screen],
  ));
  const canAnswer = useCanAnswer(audio);
  const canAdvance = useAdvanceGate(solved, audio);

  const chooseGroup = (group) => {
    if (!selected || solved || !canAnswer) return;
    const item = c.labels.find((label) => label.id === selected);
    if (item.group === group) {
      const nextMatched = new Set([...matched, selected]);
      setMatched(nextMatched);
      setSelected(null);
      setReactionCorrect(true);
      setMessage(nextMatched.size === c.labels.length
        ? t(c.doneText)
        : (lang === 'en' ? "That's right, first link found." : lang === 'ru' ? 'Верно. Первая связь найдена.' : "To'g'ri. Birinchi moslik topildi."));
      if (nextMatched.size === c.labels.length && !storedAnswer?.solved) {
        onAnswer({
          stage: null,
          screenIdx: screen,
          question: t(c.instruction),
          options: c.labels.map((label) => t(label.text)),
          correctIndex: null,
          correctAnswer: '125 → thousands; 407 → units',
          studentAnswerIndex: null,
          studentAnswer: 'matched',
          correct: true,
          firstTry: true,
          attempts: c.labels.length,
          solved: true,
          matched: [...nextMatched],
        });
        audio.pushOneOff(t(c.doneText));
      }
    } else {
      setReactionCorrect(false);
      setMessage(t(c.hint));
      audio.pushOneOff(t(c.hint));
    }
  };

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={(
        <>
          <NavBack onClick={onPrev} />
          <NavNext onClick={onNext} disabled={!canAdvance} />
        </>
      )}
    >
      <div className="screen-stack">
        <Bridge screen={screen} />
        <h1 className="title h-title">{t(c.title)}</h1>
        <p className="lead">{t(c.instruction)}</p>
        <div className="match-board">
          <div className="match-labels">
            {c.labels.map((item) => (
              <button
                type="button"
                key={item.id}
                disabled={matched.has(item.id) || !canAnswer}
                className={`class-label ${selected === item.id ? 'class-label-selected' : ''} ${matched.has(item.id) ? 'class-label-done' : ''}`}
                onClick={() => setSelected(item.id)}
              >
                {matched.has(item.id) ? '✓ ' : ''}{t(item.text)}
              </button>
            ))}
          </div>
          <NumberGroups left="125" right="407" active={selected === 'thousands' ? 'left' : (selected === 'units' ? 'right' : null)} />
          <div className="match-targets">
            {c.groups.map((group) => (
              <button type="button" className="match-target" key={group} disabled={!selected || solved} onClick={() => chooseGroup(group)}>
                {group}
              </button>
            ))}
          </div>
        </div>
        <FeedbackBlock show={Boolean(message) || solved} correct={reactionCorrect === true || solved}>
          <p>{solved ? t(c.doneText) : message}</p>
        </FeedbackBlock>
      </div>
    </Stage>
  );
};

// Retained as a reusable place-value template for later grade-4 lessons.
// eslint-disable-next-line no-unused-vars
const ValueRoundsScreen = ({ screen, c, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const [round, setRound] = useState(storedAnswer?.solved ? c.rounds.length : 0);
  const [wrong, setWrong] = useState(() => new Set());
  const [message, setMessage] = useState('');
  const [reactionCorrect, setReactionCorrect] = useState(null);
  const solved = round >= c.rounds.length;
  const audio = useAudio(useMemo(
    () => localizedScreenSegments(c.audio.intro, lang, screen),
    [c.audio.intro, lang, screen],
  ));
  const canAnswer = useCanAnswer(audio);
  const canAdvance = useAdvanceGate(solved, audio);
  const current = c.rounds[Math.min(round, c.rounds.length - 1)];

  const pick = (index) => {
    if (!canAnswer || solved || wrong.has(index)) return;
    if (index === current.correctIndex) {
      const nextRound = round + 1;
      setReactionCorrect(true);
      setMessage(t(c.correctText));
      setWrong(new Set());
      if (nextRound >= c.rounds.length) {
        onAnswer({
          stage: null,
          screenIdx: screen,
          question: t(c.question),
          options: null,
          correctIndex: null,
          correctAnswer: '5 000; 5',
          studentAnswerIndex: null,
          studentAnswer: '5 000; 5',
          correct: true,
          firstTry: true,
          attempts: 2,
          solved: true,
        });
        audio.pushOneOff(t(c.audio.on_correct));
      }
      setTimeout(() => setRound(nextRound), 450);
    } else {
      setReactionCorrect(false);
      setWrong((prev) => new Set([...prev, index]));
      setMessage(t(c.wrongText));
      audio.pushOneOff(t(c.audio.on_wrong));
    }
  };

  const renderNumber = () => {
    const compact = current.number.replace(/\s/g, '');
    return (
      <div className="highlight-number">
        {compact.split('').map((digit, index) => (
          <span key={`${digit}-${index}`} className={index === current.highlight ? 'digit-highlight' : ''}>
            {digit}
          </span>
        ))}
      </div>
    );
  };

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={(
        <>
          <NavBack onClick={onPrev} />
          <NavNext onClick={onNext} disabled={!canAdvance} />
        </>
      )}
    >
      <div className="screen-stack">
        <Bridge screen={screen} />
        <h1 className="title h-title">{t(c.title)}</h1>
        {!solved && (
          <div className="round-card">
            <span className="round-badge">{lang === 'en' ? `${round + 1} of ${c.rounds.length}` : lang === 'ru' ? `${round + 1} из ${c.rounds.length}` : `${c.rounds.length} dan ${round + 1}`}</span>
            {renderNumber()}
            <h2 className="question-title">{t(c.question)}</h2>
            <div className="value-options">
              {current.options.map((option, index) => (
                <button
                  type="button"
                  key={option}
                  className={`option option-center ${wrong.has(index) ? 'option-wrong' : ''}`}
                  disabled={wrong.has(index)}
                  onClick={() => pick(index)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
        {solved && (
          <div className="discovery-card">
            <strong>5 205</strong><span>5 000</span>
            <strong>205 005</strong><span>5</span>
          </div>
        )}
        <FeedbackBlock show={Boolean(message)} correct={reactionCorrect === true || solved}>
          <p>{message}</p>
        </FeedbackBlock>
      </div>
    </Stage>
  );
};

const RuleBuilderScreen = ({ screen, c, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const fragments = c.fragments[lang];
  const order = [3, 0, 4, 1, 2];
  const [built, setBuilt] = useState(storedAnswer?.built ?? []);
  const [checked, setChecked] = useState(false);
  const solved = storedAnswer?.solved || (checked && built.join(',') === '0,1,2,3,4');
  const audio = useAudio(useMemo(
    () => localizedScreenSegments(c.audio, lang, screen),
    [c.audio, lang, screen],
  ));
  const canAdvance = useAdvanceGate(solved, audio);

  const add = (index) => {
    if (solved || built.includes(index)) return;
    setChecked(false);
    setBuilt((prev) => [...prev, index]);
  };

  const remove = (index) => {
    if (solved) return;
    setChecked(false);
    setBuilt((prev) => prev.filter((item) => item !== index));
  };

  const check = () => {
    setChecked(true);
    const correct = built.join(',') === '0,1,2,3,4';
    const reactionSeed = screen * 23 + built.reduce((sum, value) => sum + value, 0);
    if (correct) {
      onAnswer({
        stage: null,
        screenIdx: screen,
        question: t(c.title),
        options: fragments,
        correctIndex: null,
        correctAnswer: t(c.rule),
        studentAnswerIndex: null,
        studentAnswer: built.map((index) => fragments[index]).join(' '),
        correct: true,
        firstTry: true,
        attempts: 1,
        solved: true,
        built,
      });
      audio.pushOneOff(bitSpeech(t, true, reactionSeed, t(c.rule)));
    } else {
      const hint = lang === 'en' ? 'First name the action, then name the place-value groups' : lang === 'ru' ? 'Сначала назови действие с числом, затем названия классов.' : "Avval son bilan nima qilishimizni, keyin sinflar nomini ayting.";
      audio.pushOneOff(bitSpeech(t, false, reactionSeed, hint));
    }
  };

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={(
        <>
          <NavBack onClick={onPrev} />
          <NavNext onClick={onNext} disabled={!canAdvance} />
        </>
      )}
    >
      <div className="screen-stack">
        <Bridge screen={screen} />
        <h1 className="title h-title">{t(c.title)}</h1>
        <div className="rule-builder">
          <div className="rule-built">
            {built.length === 0 && <span>{lang === 'en' ? "Gather the pieces here." : lang === 'ru' ? 'Собери части здесь' : 'Qismlarni shu yerga yig\'ing'}</span>}
            {built.map((index) => (
              <button type="button" key={index} onClick={() => remove(index)}>{fragments[index]}</button>
            ))}
          </div>
          <div className="fragment-tray">
            {order.filter((index) => !built.includes(index)).map((index) => (
              <button type="button" className="fragment" key={index} onClick={() => add(index)}>
                {fragments[index]}
              </button>
            ))}
          </div>
          {!solved && (
            <div className="inline-action">
              <button type="button" className="btn btn-white-accent" disabled={built.length !== fragments.length} onClick={check}>
                {lang === 'en' ? "Check" : lang === 'ru' ? 'Проверить' : 'Tekshirish'}
              </button>
            </div>
          )}
        </div>
        <FeedbackBlock
          show={checked || solved}
          correct={solved}
          reaction={(checked || solved)
            ? getBitReaction(solved, screen * 23 + built.reduce((sum, value) => sum + value, 0))
            : null}
        >
          <p>{solved ? t(c.rule) : (lang === 'en' ? 'First name the action, then the place-value groups' : lang === 'ru' ? 'Сначала назови действие, затем классы.' : "Avval harakatni, keyin sinflarni nomlang.")}</p>
        </FeedbackBlock>
      </div>
    </Stage>
  );
};

// Retained as a reusable grouped-choice template for later grade-4 lessons.
// eslint-disable-next-line no-unused-vars
const GuidedGroupsScreen = ({ screen, c, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const [step, setStep] = useState(storedAnswer?.solved ? 2 : 0);
  const [wrong, setWrong] = useState(() => new Set());
  const [message, setMessage] = useState('');
  const [reactionCorrect, setReactionCorrect] = useState(null);
  const solved = step >= 2;
  const audio = useAudio(useMemo(
    () => localizedScreenSegments(c.audio, lang, screen),
    [c.audio, lang, screen],
  ));
  const canAdvance = useAdvanceGate(solved, audio);

  const choose = (index) => {
    if (solved || wrong.has(index)) return;
    if (index === c.correctIndices[step]) {
      const next = step + 1;
      setWrong(new Set());
      setReactionCorrect(true);
      setMessage(next === 2
        ? t(c.doneText)
        : (lang === 'en' ? 'Correct. You found the right-hand group. Now identify the left-hand group.' : lang === 'ru' ? 'Верно. Правая группа найдена. Теперь определи левую.' : "To'g'ri. O'ng guruh topildi. Endi chap guruhni aniqlang."));
      setStep(next);
      if (next === 2) {
        onAnswer({
          stage: null,
          screenIdx: screen,
          question: t(c.title),
          options: null,
          correctIndex: null,
          correctAnswer: '348 | 216',
          studentAnswerIndex: null,
          studentAnswer: '348 | 216',
          correct: true,
          firstTry: true,
          attempts: 2,
          solved: true,
        });
        audio.pushOneOff(t(c.doneText));
      }
    } else {
      const hint = lang === 'en' ? "Count three digits on the right side." : lang === 'ru' ? 'Отсчитай три цифры с правой стороны.' : "O'ng tomondan uchta raqamni sanang.";
      setReactionCorrect(false);
      setMessage(hint);
      setWrong((prev) => new Set([...prev, index]));
      audio.pushOneOff(hint);
    }
  };

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={(
        <>
          <NavBack onClick={onPrev} />
          <NavNext onClick={onNext} disabled={!canAdvance} />
        </>
      )}
    >
      <div className="screen-stack">
        <Bridge screen={screen} />
        <h1 className="title h-title">{t(c.title)}</h1>
        <div className="guided-card">
          <div className="raw-number">348216</div>
          {step > 0 && <NumberGroups left={step > 1 ? '348' : '…'} right="216" active={step > 1 ? null : 'right'} />}
          {!solved && (
            <>
              <h2 className="question-title">{t(c.stepQuestions[step])}</h2>
              <div className="value-options">
                {c.stepOptions[step].map((option, index) => (
                  <button
                    type="button"
                    className={`option option-center ${wrong.has(index) ? 'option-wrong' : ''}`}
                    disabled={wrong.has(index)}
                    key={option}
                    onClick={() => choose(index)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </>
          )}
          {solved && <NumberGroups left="348" right="216" />}
        </div>
        <FeedbackBlock show={Boolean(message) || solved} correct={reactionCorrect === true || solved}>
          <p>{solved ? t(c.doneText) : message}</p>
        </FeedbackBlock>
      </div>
    </Stage>
  );
};

// Retained as a reusable grade-4 interaction template for later lessons.
const StrategyScreen = ({ screen, c, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const [step, setStep] = useState(storedAnswer?.solved ? 2 : 0);
  const [wrong, setWrong] = useState(() => new Set());
  const [message, setMessage] = useState('');
  const [lastCorrect, setLastCorrect] = useState(storedAnswer?.solved === true);
  const [reactionSeed, setReactionSeed] = useState(null);
  const attempts = useRef(storedAnswer?.attempts ?? 0);
  const firstTry = useRef(storedAnswer?.firstTry ?? null);
  const audio = useAudio(useMemo(
    () => localizedScreenSegments(c.audio.intro, lang, screen),
    [c.audio.intro, lang, screen],
  ));
  const canAnswer = useCanAnswer(audio);
  const solved = step === 2;
  const canAdvance = useAdvanceGate(solved, audio);
  const optionsRaw = step === 0 ? c.options : c.followupOptions;
  const sourceCorrectIndex = step === 0 ? c.correctIndex : c.followupCorrectIndex;
  const optionOrder = buildOptionOrder(
    optionsRaw.length,
    sourceCorrectIndex,
    screen * 4 + step + 2,
  );
  const options = optionOrder.map((index) => t(optionsRaw[index]));
  const correctIndex = optionOrder.indexOf(sourceCorrectIndex);

  const choose = (index) => {
    if (!canAnswer || solved || wrong.has(index)) return;
    attempts.current += 1;
    const sourceIndex = optionOrder[index];
    const correct = sourceIndex === sourceCorrectIndex;
    const nextReactionSeed = screen * 29 + step * 3 + index;
    if (firstTry.current === null) firstTry.current = correct;
    setLastCorrect(correct);
    setReactionSeed(nextReactionSeed);
    if (correct) {
      if (step === 0) {
        setStep(1);
        setWrong(new Set());
        setMessage(t(c.audio.on_correct));
        audio.pushOneOff(bitSpeech(t, true, nextReactionSeed, t(c.audio.on_correct)));
      } else {
        setStep(2);
        setMessage(t(c.correctText));
        onAnswer({
          stage: SCREEN_META[screen].scope,
          screenIdx: screen,
          question: `${t(c.question)} ${t(c.followupQuestion)}`,
          options: [...c.options.map((value) => t(value)), ...c.followupOptions.map((value) => t(value))],
          correctIndex: null,
          correctAnswer: `${t(c.options[c.correctIndex])}; ${t(c.followupOptions[c.followupCorrectIndex])}`,
          studentAnswerIndex: null,
          studentAnswer: `${t(c.options[c.correctIndex])}; ${t(c.followupOptions[index])}`,
          correct: firstTry.current,
          firstTry: firstTry.current,
          attempts: attempts.current,
          solved: true,
        });
        audio.pushOneOff(bitSpeech(t, true, nextReactionSeed, t(c.correctText)));
      }
    } else {
      setWrong((prev) => new Set([...prev, index]));
      const text = step === 0
        ? t(c.wrong[sourceIndex] ?? c.audio.on_wrong)
        : (lang === 'en' ? "Look at the thousands group." : lang === 'ru' ? 'Посмотри на группу класса тысяч.' : 'Minglar sinfidagi guruhga qarang.');
      setMessage(text);
      audio.pushOneOff(bitSpeech(t, false, nextReactionSeed, text));
    }
  };

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={(
        <>
          <NavBack onClick={onPrev} />
          <NavNext onClick={onNext} disabled={!canAdvance} />
        </>
      )}
    >
      <div className="screen-stack strategy-screen">
        <Bridge screen={screen} />
        <div className="strategy-phase" key={step}>
          <h1 className="title h-title">{t(step === 0 ? c.question : c.followupQuestion)}</h1>
          <StrategyDecomposition step={step} t={t} />
          <div className="answer-stage strategy-answer-stage">
            <div className={`answer-layer answer-options-layer ${solved ? 'answer-layer-hidden' : ''}`}>
              <div className="options-grid options-three">
                {options.map((option, index) => (
                  <button
                    type="button"
                    className={`option ${wrong.has(index) ? 'option-wrong' : ''} ${solved && index === correctIndex ? 'option-correct-reveal option-answer-confirm' : ''} ${solved && index !== correctIndex ? 'option-answer-dismiss' : ''}`}
                    style={{ '--answer-exit-delay': `${index * 85}ms` }}
                    disabled={wrong.has(index) || solved}
                    key={`${option}-${index}`}
                    onClick={() => choose(index)}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                    <span>{option}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className={`answer-layer answer-proof-layer ${solved ? 'answer-layer-visible' : ''}`}>
              {solved && (
                <BitAnswerComment
                  formula="482 731 = 482 × 1 000 + 731"
                  label={t(c.followupOptions[c.followupCorrectIndex])}
                >
                  <p>{t(c.correctText)}</p>
                </BitAnswerComment>
              )}
            </div>
          </div>
        </div>
        <FeedbackBlock
          show={Boolean(message) && !solved}
          correct={lastCorrect}
          reaction={reactionSeed !== null ? getBitReaction(lastCorrect, reactionSeed) : null}
        >
          <p>{solved ? t(c.correctText) : message}</p>
        </FeedbackBlock>
      </div>
    </Stage>
  );
};

const SummaryScreen = ({ screen, c, answers, onAnswer, onPrev, finishLesson }) => {
  const lang = useLang();
  const t = useT();
  const reflectionOrder = buildOptionOrder(
    c.reflectionOptions.length,
    c.reflectionCorrectIndex,
    screen,
  );
  const reflectionOptions = reflectionOrder.map((index) => c.reflectionOptions[index]);
  const reflectionCorrectIndex = reflectionOrder.indexOf(c.reflectionCorrectIndex);
  const [picked, setPicked] = useState(null);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [showRankBoost, setShowRankBoost] = useState(false);
  const [finished, setFinished] = useState(false);
  const solved = picked === reflectionCorrectIndex;
  const audio = useAudio(useMemo(
    () => localizedScreenSegments(c.audio, lang, screen),
    [c.audio, lang, screen],
  ));
  const correctFirstTry = answers[11]?.correctCount ?? 0;
  const totalScored = answers[11]?.totalQuestions ?? 4;
  const award = CONTENT.awards.find((item) => correctFirstTry >= item.min)
    ?? CONTENT.awards[CONTENT.awards.length - 1];

  useEffect(() => {
    if (!showRankBoost) return undefined;
    const timer = window.setTimeout(() => setShowRankBoost(false), 3900);
    return () => window.clearTimeout(timer);
  }, [showRankBoost]);

  const choose = (index) => {
    setPicked(index);
    const sourceIndex = reflectionOrder[index];
    const correct = sourceIndex === c.reflectionCorrectIndex;
    const reactionSeed = screen * 31 + index;
    if (correct) {
      setShowRankBoost(true);
      onAnswer({
        stage: null,
        screenIdx: screen,
        question: t(c.reflectionStart),
        options: reflectionOptions.map((option) => t(option)),
        correctIndex: reflectionCorrectIndex,
        correctAnswer: t(reflectionOptions[reflectionCorrectIndex]),
        studentAnswerIndex: index,
        studentAnswer: t(reflectionOptions[index]),
        correct: true,
        firstTry: true,
        attempts: 1,
        solved: true,
      });
      const announcement = lang === 'en' ? `Title earned: ${t(award.title)}. You have uncovered the structure of multi-digit numbers!` : lang === 'ru' ? `Звание получено: ${t(award.title)}. Ты раскрыл структуру многозначных чисел!` : `Unvon olindi: ${t(award.title)}. Siz ko'p xonali sonlarning tuzilishini topdingiz!`;
      audio.pushOneOff(
        `${t(c.reflectionCorrectAudio ?? reflectionOptions[index])} ${announcement}`,
      );
    } else {
      audio.pushOneOff(bitSpeech(t, false, reactionSeed, t(c.reflectionWrongAudio ?? {
        ru: 'Чтобы увидеть классы, цифры нужно сгруппировать.',
        uz: "Sinflarni ko'rish uchun raqamlarni guruhlaymiz.",
        en: "To see the groups, the numbers need to be grouped.",
      })));
    }
  };

  const finish = () => {
    if (!solved || finished) return;
    setFinished(true);
    finishLesson();
  };

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={(
        <>
          <NavBack onClick={onPrev} />
          <NavNext onClick={finish} disabled={!solved || finished || showRankBoost} finish />
        </>
      )}
    >
      <div className="screen-stack summary-stack">
        {showRankBoost && typeof document !== 'undefined' && createPortal(
          <div
            className="rank-boost-overlay"
            role="status"
            aria-live="assertive"
            aria-label={lang === 'en' ? `Title: ${t(award.title)}` : lang === 'ru' ? `Звание: ${t(award.title)}` : `Unvon: ${t(award.title)}`}
          >
            <div className="rank-boost-card">
              <div className="rank-boost-rays" aria-hidden="true" />
              <div className="rank-boost-confetti" aria-hidden="true">
                {Array.from({ length: 18 }, (_, index) => (
                  <i
                    key={index}
                    style={{
                      '--boost-i': index,
                      '--boost-delay': `${(index % 7) * -0.21}s`,
                    }}
                  />
                ))}
              </div>
              <div className="rank-boost-medal" aria-hidden="true">★</div>
              <h2>{t(award.title)}</h2>
            </div>
          </div>,
          document.body,
        )}
        <div className="final-mission-heading">
          <span><i aria-hidden="true">◆</i> {lang === 'en' ? "FINAL STAGE" : lang === 'ru' ? 'ФИНАЛЬНЫЙ ЭТАП' : 'YAKUNIY BOSQICH'}</span>
          <h1>{lang === 'en' ? 'One question before your title' : lang === 'ru' ? 'Один вопрос до звания' : 'Unvongacha bitta savol'}</h1>
          <p>
            {lang === 'en' ? 'Choose the rule that correctly describes the place-value groups' : lang === 'ru' ? 'Выбери правило и покажи, что понимаешь классы числа.' : "Qoidani tanlang va son sinflarini tushunganingizni ko'rsating."}
          </p>
        </div>
        <div className="summary-action-layout summary-final-layout">
          <div className="summary-card reflection-card final-question-card">
            <span className="summary-question-kicker">
              <i aria-hidden="true">🏁</i>
              {lang === 'en' ? "FINAL QUESTION" : lang === 'ru' ? 'ФИНАЛЬНЫЙ ВОПРОС' : 'YAKUNIY SAVOL'}
              <b>{lang === 'en' ? "1 STEP" : lang === 'ru' ? '1 ШАГ' : '1 QADAM'}</b>
            </span>
            <h2 className="summary-question">{t(c.reflectionQuestion ?? c.reflectionStart)}</h2>
            <p className="summary-question-stem">{t(c.reflectionStart)}</p>
            <div className={`reflection-options ${solved ? 'reflection-options-solved' : ''}`}>
              {reflectionOptions.map((option, index) => (
                <button
                  type="button"
                  key={t(option)}
                  className={`reflection-option ${picked === index && !solved ? 'reflection-wrong' : ''} ${solved && index === reflectionCorrectIndex ? 'option-answer-confirm' : ''} ${solved && index !== reflectionCorrectIndex ? 'option-answer-dismiss' : ''}`}
                  style={{ '--answer-exit-delay': `${index * 85}ms` }}
                  disabled={solved}
                  onClick={() => choose(index)}
                >
                  <span>{String.fromCharCode(65 + index)}</span>
                  {t(option)}
                </button>
              ))}
            </div>
            {solved && (
              <div className="reflection-resolution">
                <BitAnswerComment formula={t(reflectionOptions[reflectionCorrectIndex])}>
                  <p>
                    {lang === 'en' ? "The three digits on the right form a ones group; the next group is a thousands group." : lang === 'ru' ? 'Три разряда справа образуют класс единиц; следующая группа — класс тысяч.' : "O'ngdan uchta xona ajratilsa, son sinflari aniq ko'rinadi."}
                  </p>
                </BitAnswerComment>
              </div>
            )}
            <FeedbackBlock
              show={picked !== null && !solved}
              correct={false}
              reaction={picked !== null ? getBitReaction(false, screen * 31 + picked) : null}
            >
              <p>
                {lang === 'en' ? "Try again: start on the right and mentally count the three digits." : lang === 'ru' ? 'Попробуй ещё раз: начни справа и мысленно отсчитай три разряда.' : "Sinflarni ko'rish uchun o'ngdan uchtadan guruhlaymiz."}
              </p>
            </FeedbackBlock>
          </div>
          <div className="summary-support-column">
            <div className={`summary-rules-disclosure ${rulesOpen ? 'summary-rules-open' : ''}`}>
              <button
                type="button"
                className="summary-rules-toggle"
                aria-expanded={rulesOpen}
                onClick={() => setRulesOpen((open) => !open)}
              >
                <span aria-hidden="true">3 → |</span>
                <div>
                  <strong>{t(c.mainLabel)}</strong>
                  <small>
                    {rulesOpen
                      ? (lang === 'en' ? "Hide the rules" : lang === 'ru' ? 'Скрыть правила' : 'Qoidalarni yopish')
                      : (lang === 'en' ? "Press to remember." : lang === 'ru' ? 'Нажми, чтобы вспомнить' : 'Eslab olish uchun bosing')}
                  </small>
                </div>
                <i aria-hidden="true">⌄</i>
              </button>
              <div className="summary-rules-panel" aria-hidden={!rulesOpen}>
                <div className="summary-rule-items">
                  {c.main.map((item, index) => (
                    <span key={t(item)}>
                      <i>{index + 1}</i>
                      <p>{t(item)}</p>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className={`reward-stage reward-stage-compact ${solved ? 'reward-unlocked' : 'reward-locked'}`}>
              {solved && (
                <div className="reward-confetti" aria-hidden="true">
                  {Array.from({ length: 12 }, (_, index) => <i key={index} />)}
                </div>
              )}
              <div className="reward-bit"><BitSVG state={solved ? 'happy' : 'present'} /></div>
              <div className="reward-medal" aria-hidden="true">{solved ? '★' : '🔒'}</div>
              <span className="reward-kicker">
                {solved
                  ? (lang === 'en' ? "TITLE EARNED" : lang === 'ru' ? 'ЗВАНИЕ ПОЛУЧЕНО' : 'UNVON OLINDI')
                  : (lang === 'en' ? "THE REWARD AWAITS." : lang === 'ru' ? 'НАГРАДА ЖДЁТ' : 'MUKOFOT KUTILMOQDA')}
              </span>
              <h2>{solved ? t(award.title) : (lang === 'en' ? 'Unlock your title' : lang === 'ru' ? 'Открой звание' : 'Unvonni oching')}</h2>
              <div className="reward-score">
                <strong>{correctFirstTry}/{totalScored}</strong>
                <span>{lang === 'en' ? "on the first attempt" : lang === 'ru' ? 'с первой попытки' : 'birinchi urinishda'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Stage>
  );
};

const QuickNumberCard = ({ c, solved }) => {
  const t = useT();
  const boundaryIndex = c.quickNumber.length - 3;
  return (
    <div className={`quick-number-card ${solved ? 'quick-number-card-solved' : ''}`}>
      <span className="quick-number-label">
        <span aria-hidden="true">⚡</span> {t(c.quickLabel)}
      </span>
      <div className="quick-number-digits" aria-label={c.quickNumber}>
        {c.quickNumber.split('').map((digit, index) => (
          <React.Fragment key={`${digit}-${index}`}>
            {index === boundaryIndex && <i className="quick-class-boundary" aria-hidden="true" />}
            <strong
              className={`${index === c.highlightIndex ? 'quick-digit-highlight' : ''} ${index < boundaryIndex ? 'quick-proof-left' : 'quick-proof-right'}`}
            >
              {digit}
            </strong>
          </React.Fragment>
        ))}
      </div>
      <p className="quick-number-proof">{t(c.proof ?? c.correctText)}</p>
    </div>
  );
};

const RapidTestConsoleScreen = ({
  screen,
  c,
  items,
  storedAnswer,
  onAnswer,
  onNext,
  onPrev,
}) => {
  const lang = useLang();
  const t = useT();
  const restored = storedAnswer?.solved === true;
  const [round, setRound] = useState(restored ? items.length - 1 : 0);
  const [roundSolved, setRoundSolved] = useState(restored);
  const [completed, setCompleted] = useState(restored);
  const [wrong, setWrong] = useState(() => new Set());
  const [message, setMessage] = useState(restored ? t(c.completionText) : '');
  const [reactionSeed, setReactionSeed] = useState(null);
  const firstTry = useRef(storedAnswer?.subResults ?? Array(items.length).fill(null));
  const attempts = useRef(storedAnswer?.attemptsByRound ?? Array(items.length).fill(0));
  const current = items[Math.min(round, items.length - 1)];
  const audioValue = c.audio?.intro ?? c.audio;
  const audio = useAudio(useMemo(
    () => localizedScreenSegments(audioValue, lang, screen),
    [audioValue, lang, screen],
  ));
  const canAnswer = useCanAnswer(audio);
  const canAdvance = useAdvanceGate(completed, audio);
  const optionOrder = buildOptionOrder(
    current.options.length,
    current.correctIndex,
    screen * 4 + round,
  );
  const options = optionOrder.map((index) => t(current.options[index]));
  const correctIndex = optionOrder.indexOf(current.correctIndex);

  const choose = (index) => {
    if (!canAnswer || roundSolved || wrong.has(index)) return;
    attempts.current[round] += 1;
    const sourceIndex = optionOrder[index];
    const correct = sourceIndex === current.correctIndex;
    const nextReactionSeed = screen * 37 + round * 3 + index;
    if (firstTry.current[round] === null) firstTry.current[round] = correct;
    setReactionSeed(nextReactionSeed);
    if (!correct) {
      setWrong((previous) => new Set([...previous, index]));
      const hint = t(current.wrong?.[sourceIndex] ?? current.audio?.on_wrong);
      setMessage(hint);
      audio.pushOneOff(bitSpeech(t, false, nextReactionSeed, hint));
      return;
    }

    setRoundSolved(true);
    setMessage(t(current.correctText));
    audio.pushOneOff(bitSpeech(
      t,
      true,
      nextReactionSeed,
      t(current.audio?.on_correct ?? current.correctText),
    ));
    if (round === items.length - 1) {
      const correctCount = firstTry.current.filter(Boolean).length;
      setCompleted(true);
      onAnswer({
        stage: SCREEN_META[screen].scope,
        screenIdx: screen,
        question: t(c.title),
        options: null,
        correctIndex: null,
        correctAnswer: items.map((item) => t(item.options[item.correctIndex])).join('; '),
        studentAnswerIndex: null,
        studentAnswer: 'rapid-test-completed',
        correct: correctCount === items.length,
        firstTry: correctCount === items.length,
        attempts: attempts.current.reduce((sum, value) => sum + value, 0),
        solved: true,
        subResults: [...firstTry.current],
        attemptsByRound: [...attempts.current],
        correctCount,
        totalQuestions: items.length,
      });
    }
  };

  const nextRound = () => {
    if (!roundSolved || completed) return;
    setRound((value) => value + 1);
    setRoundSolved(false);
    setWrong(new Set());
    setMessage('');
    setReactionSeed(null);
  };

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={(
        <>
          <NavBack onClick={onPrev} />
          <NavNext onClick={onNext} disabled={!canAdvance} />
        </>
      )}
    >
      <div className="screen-stack rapid-console">
        <Bridge screen={screen} />
        <h1 className="title h-title">{t(c.title)}</h1>
        <div className="rapid-panel">
          <div className="quick-test-meter">
            <span>{t(c.progressLabel)}</span>
            <div aria-hidden="true">
              {items.map((_, index) => (
                <i key={index} className={index <= round || completed ? 'quick-meter-active' : ''} />
              ))}
            </div>
            <strong>{round + 1} / {items.length}</strong>
          </div>
          <h2 className="question-title">{t(current.question)}</h2>
          <QuickNumberCard key={`quick-${round}`} c={current} solved={roundSolved} />
          <div className="answer-stage rapid-answer-stage" key={`rapid-answer-${round}`}>
            <div className={`answer-layer answer-options-layer ${roundSolved ? 'answer-layer-hidden' : ''}`}>
              <div className={`options-grid ${options.length === 3 ? 'options-three' : ''} ${current.optionLayout === 'single-column' ? 'rapid-options-single-column' : ''}`}>
                {options.map((option, index) => (
                  <button
                    type="button"
                    key={`${option}-${index}`}
                    className={`option ${wrong.has(index) ? 'option-wrong' : ''} ${roundSolved && index === correctIndex ? 'option-correct-reveal option-answer-confirm' : ''} ${roundSolved && index !== correctIndex ? 'option-answer-dismiss' : ''}`}
                    style={{ '--answer-exit-delay': `${index * 85}ms` }}
                    disabled={!canAnswer || wrong.has(index) || roundSolved}
                    onClick={() => choose(index)}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                    <span>{option}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className={`answer-layer answer-proof-layer rapid-proof-layer ${roundSolved ? 'answer-layer-visible' : ''}`}>
              {roundSolved && (
                <BitAnswerComment
                  formula={t(current.proof ?? current.options[current.correctIndex])}
                  label={t(current.proofLabel ?? current.correctText)}
                >
                  <p>{message}</p>
                </BitAnswerComment>
              )}
              {roundSolved && !completed && (
                <button type="button" className="btn btn-secondary" onClick={nextRound}>
                  {lang === 'en' ? "Next quick question" : lang === 'ru' ? 'Следующий быстрый вопрос' : 'Keyingi tezkor savol'} <span aria-hidden="true">→</span>
                </button>
              )}
              {completed && (
                <div className="rapid-complete">
                  <span aria-hidden="true">⚡</span>
                  <strong>{t(c.completionText)}</strong>
                </div>
              )}
            </div>
          </div>
        </div>
        <FeedbackBlock
          show={Boolean(message) && !roundSolved}
          correct={false}
          reaction={reactionSeed !== null ? getBitReaction(false, reactionSeed) : null}
        >
          <p>{message}</p>
        </FeedbackBlock>
      </div>
    </Stage>
  );
};

const DigitShiftAnimation = ({ t, solved }) => {
  const labels = [
    t({ ru: 'СОТ. ТЫС.', uz: 'YUZ MING', en: "HUNDRED. THOU." }),
    t({ ru: 'ДЕС. ТЫС.', uz: "O'N MING", en: "DES, YOU." }),
    t({ ru: 'ТЫС.', uz: 'MING', en: "THOU." }),
    t({ ru: 'СОТ.', uz: 'YUZ', en: "COT." }),
    t({ ru: 'ДЕС.', uz: "O'N", en: "DES." }),
    t({ ru: 'ЕД.', uz: 'BIR', en: "ED." }),
  ];
  const digits = ['3', '6', '2', '4', '0'];

  return (
    <div className={`digit-shift-sequence ${solved ? 'digit-shift-solved' : 'digit-shift-pending'}`}>
      <svg
        className="digit-shift-svg"
        viewBox="0 0 720 214"
        role="img"
        aria-label={t({
          ru: 'Все цифры числа 36240 перемещаются на один разряд влево. Цифра 6 переходит из тысяч в десятки тысяч, а справа появляется новый ноль.',
          uz: "36240 sonining barcha raqamlari chapga bir xona siljiydi. 6 raqami minglar xonasidan o'n minglar xonasiga o'tadi, o'ngda yangi nol paydo bo'ladi.",
          en: "All the digits of 36,240 move one place to the left, 6 goes from thousands to tens of thousands, and a new zero appears on the right.",
        })}
      >
        <path className="digit-shift-route" d="M 300 59 C 270 34, 215 34, 185 59" />
        <path className="digit-shift-route-arrow" d="M 199 51 L 184 59 L 198 68" />

        {labels.map((label, index) => {
          const x = 20 + index * 115;
          return (
            <g key={label}>
              <text className="digit-shift-label" x={x + 50} y="26" textAnchor="middle">{label}</text>
              <rect className="digit-shift-slot" x={x} y="69" width="100" height="78" rx="17" />
            </g>
          );
        })}

        {digits.map((digit, index) => {
          const x = 151 + index * 115;
          return (
            <g
              key={`${digit}-${index}`}
              className={`digit-shift-token ${digit === '6' ? 'digit-shift-six' : ''}`}
            >
              <rect x={x} y="78" width="68" height="60" rx="14" />
              <text x={x + 34} y="120" textAnchor="middle">{digit}</text>
            </g>
          );
        })}

        <g className="digit-shift-new-zero">
          <rect x="611" y="78" width="68" height="60" rx="14" />
          <text x="645" y="120" textAnchor="middle">0</text>
        </g>

        <g className="digit-shift-six-value">
          <rect x="205" y="165" width="310" height="37" rx="18" />
          <text x="360" y="190" textAnchor="middle">
            <tspan>6 000</tspan>
            <tspan className="digit-shift-formula-multiply">  × 10  </tspan>
            <tspan className="digit-shift-formula-arrow">=</tspan>
            <tspan>  60 000</tspan>
          </text>
        </g>
      </svg>
      {!solved && (
        <p className="digit-shift-caption">
          {t({
            ru: 'Подсказка: следи только за цифрой 6.',
            uz: 'Maslahat: faqat 6 raqamini kuzating.',
            en: "Hint: Keep an eye on the digit 6.",
          })}
        </p>
      )}
    </div>
  );
};

const BoundaryRepairAnimation = ({ solved, t }) => {
  const digits = ['5', '2', '4', '1', '6'];

  return (
    <div className={`boundary-repair ${solved ? 'boundary-repair-solved' : ''}`}>
      <div className="boundary-repair-bit">
        <BitSVG state={solved ? 'nod' : 'think'} />
        <span>{t({ ru: 'ЗАПИСЬ BIT', uz: 'BIT YOZUVI', en: "BIT'S NOTATION" })}</span>
      </div>
      <svg
        viewBox="0 0 620 142"
        role="img"
        aria-label={solved
          ? t({ ru: 'Разделители плавно перемещаются к правильной границе 52 и 416', uz: "Ajratgichlar 52 va 416 orasidagi to'g'ri chegaraga silliq o'tadi", en: "Separators move smoothly to the correct boundary 52 and 416." })
          : t({ ru: 'Неправильная запись Бита: 5, 241 и 6', uz: "Bitning noto'g'ri yozuvi: 5, 241 va 6", en: "Bit's incorrect notation: 5, 241 and 6" })}
      >
        {digits.map((digit, index) => {
          const x = 60 + index * 105;
          return (
            <g key={`${digit}-${index}`} className="repair-digit">
              <rect x={x} y="22" width="72" height="68" rx="15" />
              <text x={x + 36} y="68" textAnchor="middle">{digit}</text>
            </g>
          );
        })}
        <rect className="repair-divider repair-divider-left" x="146" y="27" width="5" height="58" rx="3" />
        <rect className="repair-divider repair-divider-right" x="461" y="27" width="5" height="58" rx="3" />
        <rect className="repair-divider-correct" x="251" y="20" width="6" height="72" rx="3" />
        <text className="repair-group-label repair-label-left" x="147" y="124" textAnchor="middle">
          {t({ ru: '52 · КЛАСС ТЫСЯЧ', uz: '52 · MINGLAR SINFI', en: '52 · THOUSANDS GROUP' })}
        </text>
        <text className="repair-group-label repair-label-right" x="410" y="124" textAnchor="middle">
          {t({ ru: '416 · КЛАСС ЕДИНИЦ', uz: '416 · BIRLAR SINFI', en: "416 ONES GROUP" })}
        </text>
      </svg>
    </div>
  );
};

const CityCodeMissionFigure = ({ solved, t }) => {
  const labels = [
    t({ ru: 'сот. тыс.', uz: 'yuz ming', en: "hundred thousand" }),
    t({ ru: 'дес. тыс.', uz: "o'n ming", en: "deuce thousand." }),
    t({ ru: 'тысячи', uz: 'ming', en: "thousand" }),
    t({ ru: 'сотни', uz: 'yuz', en: "hundred" }),
    t({ ru: 'десятки', uz: "o'n", en: 'tens' }),
    t({ ru: 'единицы', uz: 'bir', en: "unit" }),
  ];
  const digits = ['1', '8', '0', '2', '4', '0'];
  const clueOrder = [4, 0, 2, 5, 1, 3];

  return (
    <div className={`city-code-mission ${solved ? 'city-code-solved' : ''}`}>
      <div className="city-code-model-stage">
        <div className="city-code-layer city-clue-layer">
          {clueOrder.map((index) => (
            <span key={labels[index]} className="city-clue">
              <small>{labels[index]}</small>
              <strong>{digits[index]}</strong>
            </span>
          ))}
        </div>
        <div className="city-code-layer city-table-layer">
          <PlaceValueTable values={digits} compact />
        </div>
      </div>
      <div className="city-code-result" aria-live="polite">
        <span aria-hidden="true">⌁</span>
        <strong>{t({ ru: 'СТАНЦИЯ · 180 | 240', uz: 'STANSIYA · 180 | 240', en: "STANCE · 180 | 240" })}</strong>
      </div>
    </div>
  );
};

const StrategyDecomposition = ({ step, t }) => {
  const digits = '482731'.split('');

  return (
    <div className={`strategy-decomposition strategy-decomposition-step-${step}`}>
      <div className="strategy-digit-row" aria-label="482731">
        {digits.map((digit, index) => (
          <React.Fragment key={`${digit}-${index}`}>
            {index === 3 && <i className="strategy-boundary" aria-hidden="true" />}
            <span className={index < 3 ? 'strategy-thousands-digit' : 'strategy-units-digit'}>{digit}</span>
          </React.Fragment>
        ))}
      </div>
      <div className="strategy-visual-note">
        {step === 0 && (
          <>
            <span aria-hidden="true">⌕</span>
            <strong>{t({ ru: 'Найди короткий путь', uz: "Qisqa yo'lni toping", en: "Find a shortcut." })}</strong>
          </>
        )}
        {step === 1 && (
          <>
            <span className="strategy-count" aria-hidden="true"><i>3</i><i>2</i><i>1</i></span>
            <strong>{t({ ru: 'Отделяем справа три разряда', uz: "O'ngdan uchta xonani ajratamiz", en: "Separate the three places on the right" })}</strong>
          </>
        )}
        {step === 2 && (
          <VisualAnswerProof
            formula="482 731 = 482 × 1 000 + 731"
            label={t({ ru: '482 полные тысячи, остаток 731', uz: "482 ta to'liq ming, qoldiq 731", en: "482 total thousands, residual 731" })}
          />
        )}
      </div>
    </div>
  );
};

const screenFigure = (screen, t) => {
  if (screen === 0) {
    return ({ solved }) => <DataCenterScene raw={CONTENT.s0.numberRaw} resolved={solved} t={t} />;
  }
  if (screen === 1) {
    return () => (
      <div className="mini-place">
        <div><span>{t({ ru: 'сотни', uz: 'yuzlar', en: "hundred" })}</span><strong>6</strong></div>
        <div><span>{t({ ru: 'десятки', uz: "o'nlar", en: 'tens' })}</span><strong>4</strong></div>
        <div><span>{t({ ru: 'единицы', uz: 'birlar', en: "unit" })}</span><strong>2</strong></div>
      </div>
    );
  }
  if (screen === 2) {
    return () => (
      <div className="overflow-model">
        <strong className="floating-digit">4</strong>
        <div className="mini-place">
          <div><span>{t({ ru: 'сотни', uz: 'yuzlar', en: "hundred" })}</span><strong>2</strong></div>
          <div><span>{t({ ru: 'десятки', uz: "o'nlar", en: 'tens' })}</span><strong>0</strong></div>
          <div><span>{t({ ru: 'единицы', uz: 'birlar', en: "unit" })}</span><strong>8</strong></div>
        </div>
      </div>
    );
  }
  if (screen === 3) {
    return () => (
      <div className="example-strip">
        {CONTENT.s3.examples.map((value) => <span key={value}>{value}</span>)}
      </div>
    );
  }
  if (screen === 5) {
    return () => (
      <div className="sequence-strip">
        {CONTENT.s5.sequence.map((value, index) => (
          <React.Fragment key={value}>
            <span>{value}</span>{index < CONTENT.s5.sequence.length - 1 && <b>←</b>}
          </React.Fragment>
        ))}
      </div>
    );
  }
  if (screen === 8) {
    return ({ solved }) => <DigitShiftAnimation t={t} solved={solved} />;
  }
  if (screen === 13) {
    return ({ solved }) => <BoundaryRepairAnimation solved={solved} t={t} />;
  }
  if (screen === 14) {
    return ({ solved }) => <CityCodeMissionFigure solved={solved} t={t} />;
  }
  return null;
};

const makeChoiceComponent = (screen, extras = {}) => function ChoiceComponent(props) {
  const t = useT();
  const { contentKey, ...choiceExtras } = extras;
  const c = CONTENT[contentKey ?? `s${screen}`];
  const objectMode = Array.isArray(c.objects);
  const options = objectMode
    ? c.objects.map((item) => (
      <span className="object-option" key={item.code}>
        <span>{t(item.name)}</span>
        <strong>{item.code}</strong>
      </span>
    ))
    : c.options;
  const answerOptions = objectMode
    ? c.objects.map((item) => ({
      ru: `${item.name.ru}: ${item.code}`,
      uz: `${item.name.uz}: ${item.code}`,
      en: `${item.name.ru}: ${item.code}`,
    }))
    : c.options;
  return (
    <ChoiceScreen
      {...props}
      {...choiceExtras}
      screen={screen}
      c={c}
      options={options}
      answerOptions={answerOptions}
      figure={screenFigure(screen, t)}
      fact={c.factBadge ? {
        badge: c.factBadge,
        text: c.factText,
        audio: c.factAudio,
      } : null}
    />
  );
};

const Screen0 = makeChoiceComponent(0, { resetOnReturn: true });
const Screen8 = makeChoiceComponent(8);
const Screen13 = makeChoiceComponent(13);
const Screen14 = makeChoiceComponent(14);

const Screen1 = (props) => (
  <ReasoningRoundsScreen {...props} screen={1} c={CONTENT.foundationReview} foundation />
);
const Screen2 = (props) => (
  <AnimatedExplanationScreen {...props} screen={2} c={CONTENT.method1} showReplayButton={false} />
);
const Screen3 = (props) => (
  <AnimatedExplanationScreen {...props} screen={3} c={CONTENT.method2} showReplayButton={false} />
);
const Screen4 = (props) => <AnimatedExplanationScreen {...props} screen={4} c={CONTENT.bonus} showReplayButton={false} />;
const Screen5 = (props) => <DividerPlacementScreen {...props} screen={5} c={CONTENT.dividerGuided} guided />;
const Screen6 = (props) => <ReasoningRoundsScreen {...props} screen={6} c={CONTENT.challenge6} />;
const Screen7 = (props) => <ReasoningRoundsScreen {...props} screen={7} c={CONTENT.challenge7} />;
const Screen9 = (props) => <RuleBuilderScreen {...props} screen={9} c={CONTENT.s9} />;
const Screen10 = (props) => <DividerPlacementScreen {...props} screen={10} c={CONTENT.dividerIndependent} />;
const Screen11 = (props) => (
  <RapidTestConsoleScreen
    {...props}
    screen={11}
    c={CONTENT.rapidTest}
    items={[CONTENT.quick11, CONTENT.quick12, CONTENT.quick13, CONTENT.quick14]}
  />
);
const Screen12 = (props) => <StrategyScreen {...props} screen={12} c={CONTENT.s12} />;
const Screen15 = (props) => <SummaryScreen {...props} screen={15} c={CONTENT.s15} />;

const SCREENS = [
  Screen0,
  Screen1,
  Screen2,
  Screen3,
  Screen4,
  Screen5,
  Screen6,
  Screen7,
  Screen8,
  Screen9,
  Screen10,
  Screen11,
  Screen12,
  Screen13,
  Screen14,
  Screen15,
];

export default function Grade4Dars01({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished }) {
  useMobileZoom();
  const preview = langProp === undefined || langProp === null;
  const [previewLang, setPreviewLang] = useState(() => normalizeLang(langProp));
  const lang = normalizeLang(preview ? previewLang : langProp);
  const safeName = studentName || (lang === 'en' ? 'Student' : lang === 'ru' ? 'Ученик' : "O'quvchi");
  configureLesson({
    ttsApiBase: ttsApiBase || '',
    correctSoundUrl: correctSoundUrl || '',
    wrongSoundUrl: wrongSoundUrl || '',
    studentName: safeName,
    voiceGender: voiceGender || 'f',
  });

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  // eslint-disable-next-line react-hooks/purity -- lesson duration needs a mount timestamp
  const startTimeRef = useRef(Date.now());
  const finishedRef = useRef(false);

  const recordAnswer = useCallback((data) => {
    setAnswers((previous) => {
      const next = [...previous];
      next[data.screenIdx] = data;
      return next;
    });
  }, []);

  const finishLesson = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const rapidAnswer = answers[11];
    const totalQuestions = rapidAnswer?.totalQuestions ?? 4;
    const correctAnswers = rapidAnswer?.correctCount ?? 0;
    const rapidFirstTry = rapidAnswer?.subResults ?? [];
    const payload = {
      lessonId: LESSON_META.lessonId,
      lessonTitle: LESSON_META.lessonTitle[lang],
      durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000),
      totalQuestions,
      correctAnswers,
      scorePercent: totalQuestions ? Math.round((correctAnswers / totalQuestions) * 100) : 0,
      finalScore: correctAnswers,
      finalTotal: totalQuestions,
      passed: totalQuestions ? correctAnswers / totalQuestions >= 0.6 : false,
      firstTryStats: {
        total: totalQuestions,
        firstTryCorrect: rapidFirstTry.filter(Boolean).length,
      },
      skillTags: ['place_value', 'class_grouping', 'internal_zero', 'model_to_number', 'strategy_explanation'],
      answers: answers.filter(Boolean),
    };
    if (onFinished) onFinished(payload);
    else {
      console.log('[Grade4 Dars01 preview]', payload);
    }
  }, [answers, lang, onFinished]);

  const CurrentScreen = SCREENS[current];
  const next = () => setCurrent((value) => Math.min(value + 1, TOTAL_SCREENS - 1));
  const previous = () => setCurrent((value) => Math.max(value - 1, 0));

  return (
    <LangContext.Provider value={lang}>
      <style>{STYLES}</style>
      <div className="lesson-root">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        {preview && (
          <div className="preview-language" aria-label={{ uz: "Ko'rib chiqish tili", ru: 'Язык предпросмотра', en: 'Preview language' }[lang]}>
            {SUPPORTED_LANGS.map((code) => (
              <button
                type="button"
                key={code}
                className={previewLang === code ? 'preview-active' : ''}
                onClick={() => setPreviewLang(code)}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>
        )}
        <CurrentScreen
          key={current}
          screen={current}
          storedAnswer={answers[current]}
          answers={answers}
          onAnswer={recordAnswer}
          onNext={next}
          onPrev={previous}
          finishLesson={finishLesson}
        />
      </div>
    </LangContext.Provider>
  );
}

const STYLES = `
html:has(.lesson-root),
body:has(.lesson-root),
#root:has(.lesson-root),
.lesson-page:has(.lesson-root),
.lesson-frame:has(.lesson-root) {
  width: 100%;
  height: 100%;
  min-height: 0 !important;
  overflow: hidden !important;
  overscroll-behavior: none;
}
html, body { margin: 0; padding: 0; }
.lesson-root, .lesson-root * { box-sizing: border-box; }
.lesson-root {
  position: fixed;
  inset: 0;
  overflow: clip;
  overscroll-behavior: none;
  contain: strict;
  isolation: isolate;
  font-family: 'Manrope', system-ui, sans-serif;
  color: ${T.ink};
  background:
    radial-gradient(circle at 12% 12%, rgba(22,143,163,.12), transparent 30%),
    radial-gradient(circle at 88% 80%, rgba(255,91,53,.10), transparent 32%),
    linear-gradient(145deg, #F7F8F4 0%, #EEF3F1 100%);
  -webkit-font-smoothing: antialiased;
  font-feature-settings: "ss01","cv11";
  zoom: var(--g4z, 1);
}
@media (max-width: 639.98px) {
  .lesson-root { width: 390px; }
}
.lesson-root h1, .lesson-root h2, .lesson-root h3, .lesson-root p,
.lesson-root ul, .lesson-root ol { margin: 0; padding: 0; }
button { font: inherit; }
.ambient {
  display: none;
}
.ambient-one {
  width: 260px;
  height: 260px;
  left: -150px;
  top: 20%;
  background: rgba(22,143,163,.12);
}
.ambient-two {
  width: 300px;
  height: 300px;
  right: -180px;
  bottom: -80px;
  background: rgba(255,91,53,.11);
}
.title {
  font-family: 'Source Serif 4', Georgia, serif;
  font-weight: 650;
  line-height: 1.08;
  letter-spacing: -.012em;
}
.h-title { font-size: clamp(26px, 4.2vw, 36px); }
.lead {
  color: ${T.ink2};
  font-size: clamp(14px, 1.8vw, 16px);
  line-height: 1.48;
  width: min(760px, 100%);
}
.bridge {
  align-self: center;
  color: ${T.cyan};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: .02em;
  text-align: center;
}
.topic-chip {
  align-self: center;
  padding: 6px 11px;
  border-radius: 999px;
  background: ${T.cyanSoft};
  color: ${T.cyan};
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .08em;
}
.stage {
  width: min(936px, 100%);
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;
}
.stage-header {
  flex-shrink: 0;
  padding-top: 10px;
  padding-bottom: 8px;
  background: rgba(247,248,244,.88);
  backdrop-filter: blur(14px);
}
.progress-track {
  width: 100%;
  height: 6px;
  margin-bottom: 10px;
  border-radius: 999px;
  background: rgba(80,97,109,.16);
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, ${T.cyan}, ${T.accent});
  box-shadow: 0 0 12px rgba(255,91,53,.42);
  transition: width .45s ease;
}
.stage-chrome {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.chrome-title, .chrome-actions, .audio-controls {
  display: flex;
  align-items: center;
  gap: 9px;
}
.chrome-title {
  color: ${T.ink2};
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .12em;
  text-transform: uppercase;
}
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${T.accent};
  box-shadow: 0 0 10px rgba(255,91,53,.65);
}
.screen-type {
  padding: 4px 8px;
  border-radius: 999px;
  color: ${T.cyan};
  background: ${T.cyanSoft};
  font-size: 10px;
  font-weight: 800;
}
.screen-count {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 700;
}
.icon-btn {
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: 10px;
  color: ${T.ink2};
  background: rgba(255,255,255,.75);
  cursor: pointer;
  box-shadow: 0 4px 12px -7px rgba(${T.shadowBase},.3);
}
.stage-content {
  flex: 1;
  min-height: 0;
  overflow: clip;
  overscroll-behavior: contain;
  padding-top: clamp(8px, 1.4vw, 13px);
  padding-bottom: 10px;
}
.stage-nav {
  flex-shrink: 0;
  min-height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 10px;
  padding-bottom: 10px;
  background: rgba(247,248,244,.92);
  border-top: 1px solid rgba(80,97,109,.14);
  backdrop-filter: blur(14px);
}
.screen-stack {
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: clamp(12px, 2vw, 18px);
  animation: screen-in .5s cubic-bezier(.22,.8,.3,1) both;
}
@keyframes screen-in {
  from { opacity: 0; transform: translateY(16px) scale(.99); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.question-title {
  color: ${T.ink};
  font-size: clamp(17px, 2.5vw, 21px);
  line-height: 1.3;
  font-weight: 750;
}
.options-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
.options-three { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.option {
  min-height: 58px;
  padding: 12px 14px;
  border: 1px solid rgba(80,97,109,.10);
  border-radius: 14px;
  display: flex;
  align-items: center;
  gap: 11px;
  color: ${T.ink};
  background: linear-gradient(145deg, #FFFFFF, #FBFCFA);
  cursor: pointer;
  text-align: left;
  font-weight: 650;
  box-shadow: 0 10px 24px -17px rgba(${T.shadowBase},.44);
  transition: transform .18s ease, box-shadow .18s ease, opacity .18s ease;
}
.option:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 14px 28px -16px rgba(${T.shadowBase},.5), 0 0 0 3px rgba(22,143,163,.07);
}
.option:focus-visible, .btn:focus-visible, .digit-card:focus-visible,
.drop-slot:focus-visible, .fragment:focus-visible, .class-label:focus-visible,
.match-target:focus-visible, .reflection-option:focus-visible {
  outline: 3px solid rgba(22,143,163,.38);
  outline-offset: 3px;
}
.option:disabled { cursor: default; }
.option-wrong { opacity: .28; filter: grayscale(.6); }
.option-letter {
  width: 25px;
  height: 25px;
  flex: 0 0 25px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  color: ${T.cyan};
  background: ${T.cyanSoft};
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 800;
}
.solved-option {
  min-height: 58px;
  align-self: center;
  min-width: 0;
  width: 100%;
  padding: 12px 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border-radius: 15px;
  color: ${T.success};
  background: ${T.successSoft};
  box-shadow: 0 12px 26px -18px rgba(34,122,83,.48);
}
.choice-proof-layer {
  grid-template-columns: minmax(0, 1fr);
  align-items: stretch;
  gap: 10px;
}
.bit-answer-comment {
  min-width: 0;
  min-height: 72px;
  padding: 7px 12px 7px 6px;
  border: 1px solid rgba(34,122,83,.18);
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 9px;
  color: ${T.success};
  background: linear-gradient(135deg, #FFFFFF, ${T.successSoft});
  box-shadow: 0 12px 26px -20px rgba(34,122,83,.5);
}
.bit-answer-comment-figure {
  width: 51px;
  height: 64px;
  flex: 0 0 51px;
  animation: g4reactionhop .72s ease .72s both;
}
.bit-answer-comment-figure .g1-char { width: 100%; height: 100%; }
.bit-answer-comment-copy {
  min-width: 0;
  display: grid;
  gap: 3px;
}
.bit-solution-kicker {
  color: ${T.success};
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: .12em;
}
.bit-solution-formula {
  color: ${T.navy};
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(13px, 2vw, 17px);
  font-weight: 900;
  line-height: 1.24;
}
.bit-answer-comment-copy > small {
  color: ${T.success};
  font-size: 9px;
  font-weight: 850;
  line-height: 1.25;
}
.bit-answer-comment-copy > strong {
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: 15px;
  line-height: 1.2;
}
.bit-answer-comment-copy p {
  color: ${T.ink2};
  font-size: 11px;
  line-height: 1.35;
}
.answer-stage {
  position: relative;
  display: grid;
  min-height: 58px;
}
.answer-layer {
  grid-area: 1 / 1;
  align-self: center;
  min-width: 0;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: translateY(10px) scale(.985);
  transition:
    opacity .7s ease,
    transform .8s cubic-bezier(.22,.8,.3,1),
    visibility 0s linear .8s;
}
.answer-options-layer {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transform: translateY(0) scale(1);
  transition-delay: 0s;
}
.answer-options-layer.answer-layer-hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: translateY(-8px) scale(.985);
  transition:
    opacity .34s ease .56s,
    transform .5s ease .5s,
    visibility 0s linear .92s;
}
.answer-proof-layer.answer-layer-visible {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transform: translateY(0) scale(1);
  transition-delay: .72s, .66s, 0s;
}
.option-correct-reveal {
  border-color: rgba(34,122,83,.3);
  color: ${T.success};
  background: ${T.successSoft};
}
.option-answer-dismiss {
  animation: answer-option-dismiss .46s cubic-bezier(.4,0,.7,1) var(--answer-exit-delay, 0ms) both;
}
.option-answer-confirm {
  animation: answer-option-confirm .62s cubic-bezier(.16,1,.3,1) .08s both;
}
@keyframes answer-option-dismiss {
  from { opacity: 1; transform: translateY(0) scale(1); }
  to { opacity: 0; transform: translateY(-8px) scale(.96); }
}
@keyframes answer-option-confirm {
  0% { transform: translateY(0) scale(1); box-shadow: 0 10px 24px -17px rgba(${T.shadowBase},.44); }
  45% { transform: translateY(-7px) scale(1.025); box-shadow: 0 0 0 6px rgba(34,122,83,.10); }
  100% { transform: translateY(-3px) scale(1); box-shadow: 0 12px 26px -17px rgba(34,122,83,.45); }
}
.answer-proof {
  min-width: 0;
  min-height: 58px;
  padding: 9px 14px;
  border: 1px solid rgba(34,122,83,.18);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;
  color: ${T.success};
  background: linear-gradient(135deg, #FFFFFF, ${T.successSoft});
  box-shadow: 0 12px 26px -20px rgba(34,122,83,.5);
}
.answer-proof-check {
  width: 28px;
  height: 28px;
  flex: 0 0 28px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #FFFFFF;
  background: ${T.success};
  font-weight: 900;
  animation: proof-check-in .7s cubic-bezier(.16,1,.3,1) .35s both;
}
.answer-proof > div { min-width: 0; display: grid; gap: 2px; }
.answer-proof strong {
  color: ${T.navy};
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(13px, 2vw, 18px);
  line-height: 1.25;
}
.answer-proof small { color: ${T.success}; font-size: 10px; line-height: 1.25; font-weight: 800; }
.column-calculation {
  width: max-content;
  min-width: 128px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  color: ${T.navy};
  font-variant-numeric: tabular-nums;
}
.column-row {
  position: relative;
  min-height: 22px;
  padding: 0 8px;
  display: block;
  text-align: right;
  white-space: nowrap;
}
.column-operation i {
  position: absolute;
  left: -8px;
  bottom: 0;
  color: ${T.accent};
  font-family: inherit;
  font-size: 1.15em;
  font-style: normal;
}
.column-rule {
  height: 2px;
  margin: 2px 0 3px;
  display: block;
  border-radius: 999px;
  background: ${T.navy};
}
.column-result { color: ${T.success}; font-weight: 900; }
.place-value-calculation {
  width: min(520px, 100%);
  min-width: 0;
  display: grid;
  gap: 5px;
}
.place-value-row {
  padding: 5px 8px;
  border-radius: 9px;
  display: grid;
  grid-template-columns: auto 18px minmax(122px, 1fr) 18px auto;
  align-items: center;
  gap: 5px;
  color: ${T.ink2};
  background: rgba(255,255,255,.72);
  font-family: 'Nunito Sans', sans-serif;
  font-size: 12px;
  font-weight: 800;
}
.place-value-row b,
.place-value-row em {
  color: ${T.navy};
  font-family: 'JetBrains Mono', monospace;
  font-style: normal;
  white-space: nowrap;
}
.place-value-row em { color: ${T.success}; }
.place-value-row i { color: ${T.accent}; font-style: normal; text-align: center; }
@keyframes proof-check-in {
  from { opacity: 0; transform: scale(.3) rotate(-18deg); }
  to { opacity: 1; transform: scale(1) rotate(0); }
}
.btn {
  min-height: 48px;
  padding: 11px 20px;
  border: 0;
  border-radius: 13px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  font-weight: 800;
  cursor: pointer;
  transition: transform .18s ease, box-shadow .18s ease, background .18s ease, color .18s ease;
}
.btn-primary, .btn-white-accent {
  margin-left: auto;
  color: ${T.accent};
  background: #FFFFFF;
  box-shadow: 0 9px 24px -12px rgba(255,91,53,.52), 0 0 0 1px rgba(255,91,53,.14);
}
.btn-primary:hover:not(:disabled), .btn-primary.btn-ready,
.btn-white-accent:hover:not(:disabled), .btn-white-accent.btn-ready {
  color: #FFFFFF;
  background: ${T.accent};
  box-shadow: 0 12px 28px -12px rgba(255,91,53,.65);
}
.btn-ready { animation: ready-pulse 1.6s ease-in-out infinite; }
@keyframes ready-pulse {
  50% { transform: scale(1.035); box-shadow: 0 14px 32px -10px rgba(255,91,53,.68); }
}
.btn-ghost {
  color: ${T.ink2};
  background: transparent;
}
.btn-ghost:hover { background: #FFFFFF; box-shadow: 0 8px 20px -15px rgba(${T.shadowBase},.4); }
.btn-secondary {
  color: ${T.cyan};
  background: #FFFFFF;
  box-shadow: 0 8px 22px -14px rgba(22,143,163,.55), 0 0 0 1px rgba(22,143,163,.12);
}
.btn-secondary:hover:not(:disabled) { color: #FFFFFF; background: ${T.cyan}; }
.btn:disabled { opacity: .4; cursor: not-allowed; animation: none; box-shadow: none; }
.feedback {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transform: translateY(8px);
  transition: max-height .8s cubic-bezier(.22,.8,.3,1), opacity .6s ease, transform .7s ease;
}
.feedback-visible { max-height: 260px; opacity: 1; transform: translateY(0); }
.feedback-card {
  min-height: 88px;
  padding: 8px 15px 8px 9px;
  border: 1px solid transparent;
  border-radius: 18px;
  display: flex;
  gap: 13px;
  align-items: center;
  line-height: 1.42;
  font-size: 14px;
  box-shadow: 0 14px 28px -22px rgba(${T.shadowBase},.48);
}
.feedback-correct {
  border-color: rgba(34,122,83,.18);
  color: ${T.success};
  background: linear-gradient(135deg, #FFFFFF, ${T.successSoft});
}
.feedback-hint {
  border-color: rgba(169,111,19,.20);
  color: ${T.warn};
  background: linear-gradient(135deg, #FFFFFF, ${T.warnSoft});
}
.g4-bit-reaction-figure {
  width: 62px;
  height: 76px;
  flex: 0 0 62px;
}
.g4-bit-reaction-figure .g1-char { width: 100%; height: 100%; }
.g4-bit-reaction-copy {
  flex: 1;
  min-width: 0;
  display: grid;
  gap: 3px;
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: clamp(15px, 2vw, 18px);
  font-weight: 700;
}
.g4-bit-reaction-copy > strong { line-height: 1.22; }
.g4-bit-reaction-detail {
  color: ${T.ink2};
  font-family: 'Nunito Sans', sans-serif;
  font-size: 11px;
  font-weight: 750;
  line-height: 1.35;
}
.feedback-hint .g4-bit-reaction-detail { color: ${T.warn}; }
.g4-bit-reaction-ok .g4-bit-reaction-figure {
  animation: g4reactionhop .72s ease both;
}
.g4-bit-reaction-hint .g4-bit-reaction-figure {
  animation: g4reactionawkward .9s cubic-bezier(.22,.8,.3,1) both;
}
@keyframes g4reactionhop {
  0%, 100% { transform: translateY(0) scale(1); }
  35% { transform: translateY(-9px) scale(1.08); }
  65% { transform: translateY(0) scale(1); }
}
@keyframes g4reactiontilt {
  0%, 100% { transform: rotate(0); }
  30% { transform: rotate(-7deg); }
  65% { transform: rotate(6deg); }
}
@keyframes g4reactionawkward {
  0% { transform: translateX(0) rotate(0); }
  25% { transform: translateX(-3px) rotate(-3deg); }
  50% { transform: translateX(2px) translateY(3px) rotate(2deg); }
  100% { transform: translateX(0) translateY(4px) rotate(-1deg); }
}
.g1-char-state-awkward .g1-bit-ant {
  transform-box: fill-box;
  transform-origin: center bottom;
  animation: bit-awkward-antenna .7s ease both;
}
.g1-char-state-awkward .bit-awkward-face {
  animation: bit-awkward-blink 1.4s ease-in-out 2;
}
@keyframes bit-awkward-antenna {
  to { transform: rotate(-13deg) translateY(2px); }
}
@keyframes bit-awkward-blink {
  45%, 55% { opacity: .55; transform: translateY(1px); }
}
.data-scene {
  position: relative;
  isolation: isolate;
  width: min(760px, 100%);
  min-height: 206px;
  margin: 0 auto;
  padding: 17px 184px 15px 20px;
  border-radius: 24px;
  overflow: hidden;
  color: #EAF9FB;
  background:
    radial-gradient(circle at 87% 24%, rgba(121,211,218,.16), transparent 24%),
    radial-gradient(circle at 9% 88%, rgba(149,201,61,.11), transparent 25%),
    linear-gradient(145deg, rgba(22,143,163,.25), transparent 48%),
    linear-gradient(135deg, #153B50, #0B2232 72%);
  box-shadow: 0 22px 50px -30px rgba(14,33,44,.75);
}
.data-scene::after {
  content: '';
  position: absolute;
  inset: 1px;
  z-index: -1;
  border: 1px solid rgba(144,228,235,.12);
  border-radius: 23px;
  pointer-events: none;
}
.city-grid {
  position: absolute;
  inset: 0;
  z-index: -2;
  opacity: .18;
  background-image:
    linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px);
  background-size: 30px 30px;
}
.data-ambient-orbit {
  position: absolute;
  z-index: -1;
  border: 1px solid rgba(121,211,218,.15);
  border-radius: 50%;
  pointer-events: none;
}
.data-orbit-one {
  width: 210px;
  height: 210px;
  right: -75px;
  top: -98px;
}
.data-orbit-two {
  width: 145px;
  height: 145px;
  right: -43px;
  top: -57px;
}
.data-tower {
  position: relative;
  z-index: 2;
}
.data-console-head {
  min-height: 22px;
  margin-bottom: 7px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-family: 'JetBrains Mono', monospace;
}
.data-node-name {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #9DE3E7;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: .13em;
}
.data-node-name > i {
  width: 9px;
  height: 9px;
  flex: 0 0 9px;
  border-radius: 50%;
  background: ${T.lime};
  box-shadow: 0 0 15px rgba(149,201,61,.9);
  animation: data-node-pulse 1.9s ease-in-out infinite;
}
@keyframes data-node-pulse {
  50% { transform: scale(.72); opacity: .7; box-shadow: 0 0 7px rgba(149,201,61,.7); }
}
.data-state {
  padding: 4px 7px;
  border: 1px solid rgba(255,183,107,.22);
  border-radius: 999px;
  color: #FFD29E;
  background: rgba(169,111,19,.16);
  font-size: 7px;
  font-weight: 850;
  letter-spacing: .06em;
  white-space: nowrap;
  transition: color .8s ease, border-color .8s ease, background .8s ease;
}
.data-scene-resolved .data-state {
  border-color: rgba(119,222,168,.26);
  color: #B5F2D2;
  background: rgba(34,122,83,.2);
}
.tower-screen {
  position: relative;
  width: 100%;
  padding: 10px 14px 8px;
  border-radius: 15px;
  overflow: hidden;
  background: rgba(1,13,22,.62);
  box-shadow:
    inset 0 0 0 1px rgba(144,228,235,.18),
    0 12px 26px -22px rgba(1,13,22,.9);
}
.tower-label-row {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.tower-label {
  color: #79D3DA;
  font-family: 'JetBrains Mono', monospace;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: .16em;
}
.tower-label-row small {
  color: rgba(234,249,251,.55);
  font-family: 'JetBrains Mono', monospace;
  font-size: 7px;
  font-weight: 800;
  letter-spacing: .08em;
}
.tower-screen .data-code {
  position: relative;
  z-index: 2;
  min-height: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(28px, 5vw, 43px);
  font-weight: 800;
  letter-spacing: .08em;
}
.data-code > span {
  display: inline-grid;
  place-items: center;
  min-width: .78em;
  text-shadow: 0 0 18px rgba(144,228,235,.12);
  animation: data-digit-in .65s cubic-bezier(.16,1,.3,1) both;
  animation-delay: var(--data-digit-delay);
  transition:
    color .8s ease,
    transform 1.15s cubic-bezier(.22,.8,.3,1);
}
@keyframes data-digit-in {
  from { opacity: 0; transform: translateY(9px) scale(.9); filter: blur(4px); }
  to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
}
.data-code-scan {
  position: absolute;
  z-index: 1;
  top: 22px;
  bottom: 18px;
  left: -80px;
  width: 76px;
  opacity: .56;
  background: linear-gradient(90deg, transparent, rgba(121,211,218,.22), rgba(255,255,255,.18), transparent);
  transform: skewX(-12deg);
  animation: data-code-scan 3.4s ease-in-out infinite;
  pointer-events: none;
  transition: opacity .6s ease;
}
@keyframes data-code-scan {
  0%, 12% { transform: translateX(0) skewX(-12deg); opacity: 0; }
  24% { opacity: .6; }
  72% { opacity: .5; }
  88%, 100% { transform: translateX(560px) skewX(-12deg); opacity: 0; }
}
.data-scene-resolved .data-code-scan { opacity: 0; animation-play-state: paused; }
.data-class-reveal {
  position: relative;
  z-index: 2;
  min-height: 13px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 19px;
  opacity: 0;
  transform: translateY(6px);
  transition: opacity .75s ease .75s, transform .9s cubic-bezier(.16,1,.3,1) .7s;
}
.data-class-reveal span {
  padding: 3px 5px;
  border: 1px solid rgba(121,211,218,.12);
  border-radius: 6px;
  color: #9DE3E7;
  background: rgba(22,143,163,.12);
  font-family: 'JetBrains Mono', monospace;
  font-size: 7px;
  font-weight: 850;
  letter-spacing: .08em;
  text-align: center;
}
.data-class-reveal span:last-child {
  border-color: rgba(255,255,255,.12);
  color: #FFFFFF;
  background: rgba(255,255,255,.07);
}
.data-scene-resolved .data-class-reveal {
  opacity: 1;
  transform: translateY(0);
}
.data-code-divider {
  width: 0;
  height: 48px;
  margin: 0;
  border-radius: 99px;
  opacity: 0;
  background: ${T.accent};
  box-shadow: 0 0 0 rgba(255,91,53,0);
  transform: scaleY(.25);
  transition:
    width 1.1s cubic-bezier(.22,.8,.3,1),
    height 1.1s cubic-bezier(.22,.8,.3,1),
    margin 1.1s cubic-bezier(.22,.8,.3,1),
    opacity .65s ease .2s,
    transform 1.1s cubic-bezier(.22,.8,.3,1),
    box-shadow .9s ease .65s;
}
.data-scene-resolved .data-code > span:nth-of-type(-n+3) {
  color: #A8EAF0;
  transform: translateX(-4px);
}
.data-scene-resolved .data-code > span:nth-last-of-type(-n+3) {
  color: #FFFFFF;
  transform: translateX(4px);
}
.data-scene-resolved .data-code-divider {
  width: 4px;
  height: 52px;
  margin: 0 10px;
  opacity: 1;
  transform: scaleY(1);
  box-shadow: 0 0 16px rgba(255,91,53,.55);
}
.data-diagnostics {
  min-height: 27px;
  margin-top: 7px;
  display: grid;
  grid-template-columns: .75fr 1.35fr .85fr;
  gap: 6px;
}
.data-diagnostics > span {
  min-width: 0;
  padding: 5px 6px;
  border: 1px solid rgba(144,228,235,.08);
  border-radius: 7px;
  display: flex;
  align-items: center;
  gap: 5px;
  color: rgba(234,249,251,.68);
  background: rgba(255,255,255,.055);
  font-family: 'JetBrains Mono', monospace;
  font-size: 6px;
  font-weight: 800;
  white-space: nowrap;
}
.data-diagnostics i {
  width: 5px;
  height: 5px;
  flex: 0 0 5px;
  border-radius: 50%;
  background: #79D3DA;
  box-shadow: 0 0 7px rgba(121,211,218,.65);
}
.data-diagnostics .diagnostic-structure {
  color: #FFD29E;
  border-color: rgba(255,183,107,.13);
  transition: color .8s ease, border-color .8s ease, background .8s ease;
}
.diagnostic-structure i {
  background: ${T.accent};
  box-shadow: 0 0 8px rgba(255,91,53,.72);
  animation: diagnostic-alert 1.2s ease-in-out infinite;
}
@keyframes diagnostic-alert { 50% { opacity: .35; transform: scale(.72); } }
.data-scene-resolved .diagnostic-structure {
  color: #B5F2D2;
  border-color: rgba(119,222,168,.2);
  background: rgba(34,122,83,.14);
}
.data-scene-resolved .diagnostic-structure i {
  background: #77DEA8;
  box-shadow: 0 0 8px rgba(119,222,168,.62);
  animation: none;
}
.city-network {
  position: absolute;
  z-index: 1;
  top: 18px;
  right: 14px;
  width: 154px;
  color: rgba(157,227,231,.58);
}
.city-network svg {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
}
.city-network > span {
  display: block;
  margin-top: -1px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 6px;
  font-weight: 800;
  letter-spacing: .1em;
  text-align: center;
}
.network-route {
  fill: none;
  stroke: rgba(121,211,218,.45);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-dasharray: 4 6;
  animation: network-route-flow 2.4s linear infinite;
  transition: stroke .8s ease, stroke-width .8s ease;
}
@keyframes network-route-flow { to { stroke-dashoffset: -20; } }
.network-node {
  fill: #12384B;
  stroke: #79D3DA;
  stroke-width: 2;
  transform-box: fill-box;
  transform-origin: center;
  animation: network-node-ping 2s ease-in-out infinite;
}
.node-b { animation-delay: .45s; }
.node-c { animation-delay: .9s; }
@keyframes network-node-ping { 50% { transform: scale(1.35); filter: drop-shadow(0 0 4px #79D3DA); } }
.network-building,
.network-windows {
  fill: none;
  stroke: rgba(234,249,251,.68);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.network-windows { stroke-width: 1.4; }
.data-scene-resolved .network-route {
  stroke: #77DEA8;
  stroke-width: 3;
}
.data-scene-resolved .network-node {
  fill: #77DEA8;
  stroke: #B5F2D2;
}
.data-bit-callout {
  position: absolute;
  z-index: 4;
  top: 91px;
  right: 17px;
  width: 142px;
  padding: 7px 8px;
  border: 1px solid rgba(144,228,235,.2);
  border-radius: 10px 10px 3px 10px;
  color: #D6F5F7;
  background: rgba(5,30,43,.82);
  font-size: 8px;
  font-weight: 800;
  line-height: 1.25;
  text-align: center;
  box-shadow: 0 8px 18px -13px rgba(1,13,22,.9);
  transition: color .7s ease, border-color .7s ease, background .7s ease;
}
.data-scene-resolved .data-bit-callout {
  border-color: rgba(119,222,168,.3);
  color: #B5F2D2;
  background: rgba(17,69,50,.78);
}
.bit-avatar {
  position: absolute;
  right: 24px;
  bottom: 12px;
  width: 104px;
  height: 130px;
  z-index: 2;
  animation: g4bitfloat 3.2s ease-in-out infinite;
}
.bit-avatar .g1-char {
  display: block;
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 7px 13px rgba(1,13,22,.28));
}
.data-scene > .bit-avatar {
  right: 42px;
  bottom: -4px;
  width: 88px;
  height: 110px;
}
.bit-small {
  position: relative;
  right: auto;
  bottom: auto;
  width: 72px;
  height: 90px;
  flex: 0 0 72px;
  margin: -8px 0;
  animation: none;
}
.g1-char {
  display: block;
  height: 100%;
  width: auto;
  filter: drop-shadow(0 6px 12px rgba(58,53,48,.22));
}
.g1-eyes {
  transform-box: fill-box;
  transform-origin: center;
  animation: g4blink 4.4s infinite;
}
@keyframes g4blink {
  0%, 93%, 100% { transform: scaleY(1); }
  96.5% { transform: scaleY(.12); }
}
.g1-bit-ant {
  transform-box: fill-box;
  transform-origin: bottom center;
  animation: g4antbob 2.2s ease-in-out infinite;
}
@keyframes g4antbob {
  0%, 100% { transform: rotate(-10deg); }
  50% { transform: rotate(10deg); }
}
.g1-bit-wave {
  transform-box: fill-box;
  transform-origin: bottom left;
  animation: g4wavebig 1s ease-in-out infinite;
}
@keyframes g4wavebig {
  0%, 100% { transform: rotate(2deg); }
  50% { transform: rotate(-26deg); }
}
@keyframes g4bitfloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.bit-coach-reacting {
  animation: bit-coach-step-pop .72s cubic-bezier(.16,1,.3,1) both;
}
.bit-coach-reacting .g1-bit-wave {
  animation: g4waveclick .7s ease-in-out 2;
}
.bit-wave-left,
.bit-wave-right,
.bit-think-hand,
.bit-point-arm,
.bit-idea-bulb,
.bit-focus-hands,
.bit-focus-scan,
.bit-nod-hand,
.bit-nod-check {
  transform-box: fill-box;
  transform-origin: center;
}
.bit-double-wave .bit-wave-left {
  transform-origin: bottom right;
  animation: bit-wave-left 1.05s ease-in-out infinite;
}
.bit-double-wave .bit-wave-right {
  transform-origin: bottom left;
  animation: bit-wave-right 1.05s ease-in-out infinite;
}
.bit-think-hand { animation: bit-think-tap 1.8s ease-in-out infinite; }
.bit-point-arm { transform-origin: left center; animation: bit-point 1.45s ease-in-out infinite; }
.bit-point-target { transform-box: fill-box; transform-origin: center; animation: bit-target 1.45s ease-in-out infinite; }
.bit-idea-bulb { animation: bit-idea 1.55s ease-in-out infinite; }
.bit-focus-hands { transform-origin: center bottom; animation: bit-focus 1.7s ease-in-out infinite; }
.bit-focus-scan { animation: bit-scan 1.7s ease-in-out infinite; }
.bit-nod-hand { animation: bit-nod-hand 1.35s ease-in-out infinite; }
.bit-nod-check { animation: bit-check 1.35s ease-in-out infinite; }
.bit-coach-reacting .bit-wave-left,
.bit-coach-reacting .bit-wave-right {
  animation-duration: .62s;
  animation-iteration-count: 2;
}
.bit-coach-reacting .bit-think-hand,
.bit-coach-reacting .bit-point-arm,
.bit-coach-reacting .bit-idea-bulb,
.bit-coach-reacting .bit-focus-hands,
.bit-coach-reacting .bit-nod-hand {
  animation-duration: .72s;
  animation-iteration-count: 1;
}
@keyframes bit-wave-left {
  0%, 100% { transform: rotate(2deg); }
  50% { transform: rotate(25deg); }
}
@keyframes bit-wave-right {
  0%, 100% { transform: rotate(-2deg); }
  50% { transform: rotate(-25deg); }
}
@keyframes bit-think-tap {
  0%, 100% { transform: translate(0, 0) rotate(0); }
  50% { transform: translate(-2px, -3px) rotate(-7deg); }
}
@keyframes bit-point {
  0%, 100% { transform: translateX(0) rotate(0); }
  48% { transform: translateX(4px) rotate(-5deg); }
}
@keyframes bit-target {
  0%, 100% { opacity: .38; transform: scale(.72); }
  50% { opacity: 1; transform: scale(1.1); }
}
@keyframes bit-idea {
  0%, 100% { opacity: .72; transform: translateY(1px) scale(.9); }
  50% { opacity: 1; transform: translateY(-3px) scale(1.08); }
}
@keyframes bit-focus {
  0%, 100% { transform: scale(.96); }
  50% { transform: scale(1.05); }
}
@keyframes bit-scan {
  0%, 100% { opacity: .42; transform: translateY(-3px); }
  50% { opacity: 1; transform: translateY(6px); }
}
@keyframes bit-nod-hand {
  0%, 100% { transform: rotate(0); }
  48% { transform: rotate(-11deg); }
}
@keyframes bit-check {
  0%, 100% { transform: scale(.86); opacity: .72; }
  50% { transform: scale(1.08); opacity: 1; }
}
@keyframes bit-coach-step-pop {
  0% { opacity: .65; transform: translateY(8px) scale(.9); }
  55% { opacity: 1; transform: translateY(-4px) scale(1.05); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes g4waveclick {
  0%, 100% { transform: rotate(4deg); }
  35% { transform: rotate(-38deg); }
  68% { transform: rotate(-8deg); }
}
.bit-coach {
  min-height: 96px;
  padding: 10px 14px 10px 8px;
  border: 1px solid rgba(22,143,163,.14);
  border-radius: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${T.ink};
  background: linear-gradient(135deg, #FFFFFF, ${T.cyanSoft});
  box-shadow: 0 14px 30px -23px rgba(22,143,163,.58);
}
.bit-coach-figure {
  width: 68px;
  height: 85px;
  flex: 0 0 68px;
}
.bit-coach-figure .g1-char { width: 100%; height: 100%; }
.bit-coach p {
  color: ${T.ink2};
  font-size: 13px;
  line-height: 1.48;
  font-weight: 680;
}
.bit-coach-hint {
  border-color: rgba(169,111,19,.22);
  background: linear-gradient(135deg, #FFFFFF, ${T.warnSoft});
}
.bit-coach-happy {
  border-color: rgba(34,122,83,.20);
  background: linear-gradient(135deg, #FFFFFF, ${T.successSoft});
}
.method-badge {
  align-self: flex-start;
  padding: 6px 11px;
  border-radius: 999px;
  color: ${T.cyan};
  background: ${T.cyanSoft};
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: .06em;
  text-transform: uppercase;
}
.explanation-layout, .trainer-layout {
  width: min(940px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1.12fr) minmax(300px, .88fr);
  gap: 16px;
  align-items: stretch;
}
.explanation-visual, .trainer-visual,
.explanation-copy, .trainer-task {
  min-width: 0;
  padding: clamp(13px, 2vw, 18px);
  border-radius: 22px;
  background: rgba(255,255,255,.94);
  box-shadow: 0 18px 42px -30px rgba(${T.shadowBase},.54);
}
.explanation-copy, .trainer-task {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
}
.class-animation {
  min-height: 220px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
  overflow: hidden;
}
.class-animation-six-digit { min-height: 270px; }
.class-direction {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  color: ${T.cyan};
  font-size: 11px;
  font-weight: 900;
  letter-spacing: .04em;
  text-transform: uppercase;
}
.direction-arrow {
  display: inline-block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 25px;
  animation: direction-sweep 1.4s ease-in-out infinite;
}
@keyframes direction-sweep {
  0%, 100% { transform: translateX(5px); opacity: .5; }
  50% { transform: translateX(-7px); opacity: 1; }
}
.animated-number {
  min-height: 86px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(5px, 1vw, 9px);
}
.animated-digit {
  position: relative;
  width: clamp(43px, 7vw, 62px);
  height: clamp(58px, 9vw, 76px);
  border: 2px solid rgba(80,97,109,.12);
  border-radius: 16px;
  display: grid;
  place-items: center;
  color: ${T.ink};
  background: #F7F9F7;
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(27px, 4.2vw, 39px);
  font-weight: 900;
  box-shadow: 0 10px 22px -18px rgba(${T.shadowBase},.48);
  transition: color .45s ease, background .45s ease, border-color .45s ease, transform .45s ease;
}
.animated-digit small {
  position: absolute;
  top: calc(100% + 5px);
  left: 50%;
  color: ${T.accent};
  font-family: 'Manrope', sans-serif;
  font-size: 9px;
  font-weight: 900;
  white-space: nowrap;
  transform: translateX(-50%);
}
.digit-anchor {
  border-color: rgba(255,91,53,.48);
  color: ${T.accent};
  background: ${T.accentSoft};
  animation: digit-anchor-pulse 1.35s ease-in-out infinite;
}
@keyframes digit-anchor-pulse {
  50% { transform: translateY(-5px); box-shadow: 0 15px 28px -15px rgba(255,91,53,.62); }
}
.digit-units {
  border-color: rgba(22,143,163,.30);
  color: #0A7183;
  background: ${T.cyanSoft};
  animation: digit-group-in .48s ease both;
  animation-delay: var(--digit-delay);
}
.digit-thousands {
  border-color: rgba(23,59,82,.27);
  color: ${T.navy};
  background: #EDF1F4;
  animation: digit-group-in .48s ease both;
  animation-delay: var(--digit-delay);
}
@keyframes digit-group-in {
  from { opacity: .35; transform: translateY(9px) scale(.94); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.animated-divider {
  width: 0;
  height: 64px;
  border-left: 0 dashed ${T.accent};
  opacity: 0;
  transform: scaleY(.2);
  transition: opacity .35s ease, transform .4s ease, width .35s ease, border-width .35s ease;
}
.divider-visible {
  width: 7px;
  border-left-width: 3px;
  opacity: 1;
  transform: scaleY(1);
}
.class-name-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity .45s ease, transform .45s ease;
}
.class-names-visible { opacity: 1; transform: translateY(0); }
.class-name-row span {
  padding: 7px 8px;
  border-radius: 10px;
  text-align: center;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: .08em;
}
.class-name-thousands { color: #FFFFFF; background: ${T.navy}; }
.class-name-units { color: #FFFFFF; background: ${T.cyan}; }
.class-animation-four-digit .class-name-row {
  grid-template-columns: minmax(80px, 1fr) minmax(190px, 3fr);
}
.class-animation .place-table { margin-top: 2px; }
.class-animation .place-cell { min-height: 58px; }
.class-animation .place-cell span { min-height: 18px; font-size: 7px; }
.class-animation .place-cell strong { min-height: 24px; font-size: 20px; }
.place-transfer {
  width: 100%;
  display: grid;
  gap: 8px;
}
.place-transfer-prompt {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: ${T.ink2};
  font-size: 9px;
  font-weight: 800;
}
.place-transfer-prompt strong { color: ${T.cyan}; }
.place-transfer-board {
  position: relative;
  min-height: 172px;
  padding-top: 58px;
}
.place-transfer-source {
  position: absolute;
  z-index: 3;
  inset: 0 0 auto;
  height: 50px;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 5px;
}
.transfer-digit {
  width: min(45px, 90%);
  height: 45px;
  justify-self: center;
  border: 1px solid rgba(80,97,109,.13);
  border-radius: 11px;
  display: grid;
  place-items: center;
  color: ${T.navy};
  background: #FFFFFF;
  font-family: 'JetBrains Mono', monospace;
  font-size: 23px;
  font-weight: 900;
  box-shadow: 0 9px 20px -14px rgba(${T.shadowBase},.65);
  will-change: transform, color, background;
  transition:
    transform 1.65s cubic-bezier(.4,0,.2,1),
    color .75s ease,
    background .75s ease,
    box-shadow .75s ease;
  transition-delay: var(--transfer-delay);
}
.transfer-digit-placed {
  transform: translateY(105px) scale(.88);
  color: ${T.cyan};
  background: ${T.cyanSoft};
  box-shadow: 0 10px 22px -14px rgba(22,143,163,.72);
}
.transfer-empty-table { position: relative; z-index: 1; }
.transfer-empty-table .place-cell {
  border: 1px dashed rgba(22,143,163,.25);
  background: rgba(255,255,255,.68);
}
.transfer-status {
  min-height: 18px;
  opacity: 0;
  color: ${T.success};
  text-align: center;
  font-size: 11px;
  font-weight: 800;
  transform: translateY(5px);
  transition: opacity .45s ease, transform .45s ease;
}
.transfer-status-visible { opacity: 1; transform: translateY(0); }
@keyframes explanation-copy-in {
  from { opacity: .2; transform: translateX(8px); }
  to { opacity: 1; transform: translateX(0); }
}
.explanation-timeline {
  width: min(940px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(102px, 1fr));
  gap: 7px;
}
.timeline-step {
  min-height: 52px;
  padding: 7px 8px;
  border: 1px solid rgba(80,97,109,.12);
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 7px;
  color: ${T.ink2};
  background: #FFFFFF;
  cursor: pointer;
  text-align: left;
  transition: transform .2s ease, border-color .2s ease, background .2s ease, opacity .2s ease;
}
.timeline-step:disabled { cursor: not-allowed; opacity: .43; }
.timeline-step:not(:disabled):hover { transform: translateY(-2px); }
.timeline-step > span {
  width: 24px;
  height: 24px;
  flex: 0 0 24px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: ${T.cyan};
  background: ${T.cyanSoft};
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 900;
}
.timeline-step strong { font-size: 10px; line-height: 1.2; }
.timeline-active {
  border-color: rgba(255,91,53,.34);
  color: ${T.ink};
  background: ${T.accentSoft};
  box-shadow: 0 9px 22px -18px rgba(255,91,53,.55);
}
.timeline-active > span { color: #FFFFFF; background: ${T.accent}; }
.timeline-visited:not(.timeline-active) {
  border-color: rgba(34,122,83,.2);
  color: ${T.success};
  background: ${T.successSoft};
}
.timeline-visited:not(.timeline-active) > span { color: #FFFFFF; background: ${T.success}; }
.timeline-awaiting {
  border-color: rgba(255,91,53,.45);
  animation: ready-pulse 1.45s ease-in-out infinite;
}
.explanation-result, .trainer-done {
  min-width: 0;
  padding: 9px 13px;
  border-radius: 14px;
  color: ${T.success};
  background: ${T.successSoft};
  text-align: center;
  font-weight: 800;
  animation: explanation-copy-in .4s ease both;
}
.explanation-finish-row {
  width: min(940px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 8px;
}
.explanation-replay { min-height: 40px; margin: 0; padding: 8px 13px; }
.trainer-task .question-title { font-size: 17px; }
.trainer-progress {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
}
.trainer-progress span {
  height: 5px;
  border-radius: 999px;
  background: #E5E9E7;
  transition: background .25s ease, transform .25s ease;
}
.trainer-progress .trainer-dot-done { background: ${T.success}; }
.trainer-progress .trainer-dot-active { background: ${T.accent}; transform: scaleY(1.6); }
.trainer-options { grid-template-columns: 1fr !important; }
.trainer-options .option { min-height: 48px; }
.trainer-option-correct {
  border-color: rgba(34,122,83,.25);
  color: ${T.success};
  background: ${T.successSoft};
}
.trainer-task .inline-action .btn { margin-left: auto; }
.foundation-memory {
  width: min(900px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}
.foundation-memory > div {
  min-height: 42px;
  padding: 8px 11px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: linear-gradient(145deg, #FFFFFF, #F3F8F6);
  box-shadow: 0 11px 24px -20px rgba(${T.shadowBase},.55);
}
.foundation-memory span {
  color: ${T.cyan};
  font-size: 9px;
  font-weight: 900;
  letter-spacing: .04em;
  text-transform: uppercase;
  text-align: center;
}
.foundation-recap {
  width: min(760px, 100%);
  min-height: 270px;
  margin: 2px auto 0;
  padding: 17px;
  border: 1px solid rgba(22,143,163,.13);
  border-radius: 24px;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 12px;
  background:
    radial-gradient(circle at 85% 18%, rgba(255,91,53,.10), transparent 30%),
    linear-gradient(145deg, #FFFFFF, #F1F8F6);
  box-shadow: 0 20px 42px -31px rgba(${T.shadowBase},.58);
}
.recap-progress {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
}
.recap-progress i {
  height: 5px;
  border-radius: 999px;
  background: #DEE7E4;
  transition: background .4s ease, transform .4s ease;
}
.recap-progress .recap-progress-active { background: ${T.cyan}; transform: scaleY(1.35); }
.recap-frame {
  min-height: 160px;
  display: grid;
  place-items: center;
  animation: recap-frame-in .65s cubic-bezier(.22,.78,.26,1) both;
}
@keyframes recap-frame-in {
  from { opacity: 0; transform: translateY(10px) scale(.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.foundation-recap > p {
  color: ${T.cyan};
  text-align: center;
  font-size: 13px;
  font-weight: 800;
}
.recap-place-row {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 10px;
}
.recap-place-row > div {
  width: 104px;
  min-height: 100px;
  padding: 12px 8px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  background: #FFFFFF;
  box-shadow: 0 14px 28px -21px rgba(${T.shadowBase},.6);
  animation: recap-card-rise .7s ease both;
  animation-delay: var(--recap-delay);
}
@keyframes recap-card-rise {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
.recap-place-row strong {
  color: ${T.cyan};
  font-family: 'JetBrains Mono', monospace;
  font-size: 34px;
}
.recap-place-row span {
  color: ${T.ink2};
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
}
.recap-sum, .recap-shift {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(7px, 2vw, 16px);
  font-family: 'JetBrains Mono', monospace;
}
.recap-sum strong, .recap-sum b, .recap-shift span {
  padding: 13px 15px;
  border-radius: 15px;
  color: ${T.navy};
  background: #FFFFFF;
  font-size: clamp(22px, 4vw, 32px);
  box-shadow: 0 12px 25px -20px rgba(${T.shadowBase},.7);
}
.recap-sum strong { color: #FFFFFF; background: ${T.cyan}; }
.recap-sum span { color: ${T.accent}; font-size: 20px; font-weight: 900; }
.recap-shift i {
  position: relative;
  color: ${T.accent};
  font-size: 12px;
  font-style: normal;
  font-weight: 900;
  animation: direction-sweep 1.4s ease-in-out infinite;
}
.recap-shift-sequence {
  width: min(500px, 100%);
  display: grid;
  place-items: center;
  gap: 2px;
}
.recap-shift-svg {
  width: min(480px, 100%);
  height: 150px;
  overflow: visible;
}
.recap-shift-guide,
.recap-shift-arrow {
  fill: none;
  stroke: ${T.cyan};
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dasharray: 7 7;
  opacity: .55;
}
.recap-shift-arrow { stroke-dasharray: none; }
.recap-shift-label {
  fill: ${T.ink2};
  font-size: 11px;
  font-weight: 900;
  letter-spacing: .05em;
}
.recap-shift-slot {
  fill: rgba(255,255,255,.82);
  stroke: rgba(22,143,163,.16);
  stroke-width: 2;
}
.recap-slot-units { animation: recap-slot-units 7.6s ease-in-out both; }
.recap-slot-tens { animation: recap-slot-tens 7.6s ease-in-out both; }
.recap-slot-hundreds { animation: recap-slot-hundreds 7.6s ease-in-out both; }
.recap-moving-seven,
.recap-born-zero {
  fill: ${T.navy};
  font-family: 'JetBrains Mono', monospace;
  font-size: 42px;
  font-weight: 900;
}
.recap-moving-seven {
  transform-box: view-box;
  transform-origin: center;
  animation: recap-seven-travel 7.6s ease-in-out both;
}
.recap-born-zero {
  fill: ${T.accent};
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
}
.recap-born-zero-units { animation: recap-zero-units 7.6s ease-in-out both; }
.recap-born-zero-tens { animation: recap-zero-tens 7.6s ease-in-out both; }
.recap-shift-readout {
  min-height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 900;
}
.recap-shift-readout span {
  min-width: 42px;
  color: ${T.navy};
  text-align: center;
  font-size: 18px;
  opacity: .2;
}
.recap-shift-readout i {
  color: ${T.accent};
  font-size: 10px;
  font-style: normal;
}
.recap-readout-seven { animation: recap-readout-seven 7.6s ease both; }
.recap-readout-seventy { animation: recap-readout-seventy 7.6s ease both; }
.recap-readout-seven-hundred { animation: recap-readout-hundred 7.6s ease both; }
.recap-shift-note {
  color: ${T.cyan};
  font-size: 10px;
  font-weight: 900;
}
@keyframes recap-seven-travel {
  0%, 18% { transform: translateX(0); }
  34%, 46% { transform: translateX(-160px); }
  64%, 100% { transform: translateX(-320px); }
}
@keyframes recap-zero-units {
  0%, 29% { opacity: 0; transform: scale(.4); }
  36%, 100% { opacity: 1; transform: scale(1); }
}
@keyframes recap-zero-tens {
  0%, 59% { opacity: 0; transform: scale(.4); }
  67%, 100% { opacity: 1; transform: scale(1); }
}
@keyframes recap-slot-units {
  0%, 22% { fill: ${T.cyanSoft}; stroke: ${T.cyan}; }
  31%, 100% { fill: rgba(255,255,255,.82); stroke: rgba(22,143,163,.16); }
}
@keyframes recap-slot-tens {
  0%, 27%, 51%, 100% { fill: rgba(255,255,255,.82); stroke: rgba(22,143,163,.16); }
  34%, 45% { fill: ${T.cyanSoft}; stroke: ${T.cyan}; }
}
@keyframes recap-slot-hundreds {
  0%, 57% { fill: rgba(255,255,255,.82); stroke: rgba(22,143,163,.16); }
  65%, 100% { fill: ${T.cyanSoft}; stroke: ${T.cyan}; }
}
@keyframes recap-readout-seven {
  0%, 22% { opacity: 1; transform: scale(1.12); }
  30%, 100% { opacity: .2; transform: scale(1); }
}
@keyframes recap-readout-seventy {
  0%, 28%, 52%, 100% { opacity: .2; transform: scale(1); }
  35%, 46% { opacity: 1; transform: scale(1.12); }
}
@keyframes recap-readout-hundred {
  0%, 58% { opacity: .2; transform: scale(1); }
  66%, 100% { opacity: 1; transform: scale(1.12); }
}
.recap-zero {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 66px);
  justify-content: center;
  gap: 8px;
}
.recap-zero > span, .recap-zero > strong {
  height: 78px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  color: ${T.navy};
  background: #FFFFFF;
  font-family: 'JetBrains Mono', monospace;
  font-size: 34px;
}
.recap-zero > strong {
  color: #FFFFFF;
  background: ${T.accent};
  animation: ready-pulse 1.4s ease-in-out infinite;
}
.recap-zero p {
  grid-column: 1 / -1;
  color: ${T.ink2};
  text-align: center;
  font-size: 11px;
  font-weight: 800;
}
.recap-task-preview { display: flex; gap: 15px; }
.recap-task-preview > span {
  width: 92px;
  height: 108px;
  border: 2px dashed rgba(22,143,163,.24);
  border-radius: 18px;
  display: grid;
  place-items: center;
  color: ${T.cyan};
  background: rgba(255,255,255,.7);
}
.recap-task-preview b { font-family: 'JetBrains Mono', monospace; font-size: 15px; }
.recap-task-preview i {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #FFFFFF;
  background: ${T.accent};
  font-size: 18px;
  font-style: normal;
  animation: ready-pulse 1.4s ease-in-out infinite;
}
.reasoning-card {
  width: min(860px, 100%);
  margin: 0 auto;
  padding: clamp(13px, 2vw, 18px);
  border-radius: 21px;
  display: grid;
  gap: 12px;
  background: rgba(255,255,255,.92);
  box-shadow: 0 18px 38px -28px rgba(${T.shadowBase},.58);
}
.reasoning-progress {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 10px;
  color: ${T.ink2};
  font-size: 9px;
  font-weight: 900;
  text-transform: uppercase;
}
.reasoning-progress > div {
  display: grid;
  grid-template-columns: repeat(3, minmax(16px, 1fr));
  gap: 5px;
}
.reasoning-progress i { height: 5px; border-radius: 999px; background: #E1E7E4; }
.reasoning-progress .reasoning-active { background: ${T.accent}; animation: ready-pulse 1.6s ease-in-out infinite; }
.reasoning-progress .reasoning-done { background: ${T.success}; }
.reasoning-progress strong { color: ${T.cyan}; font-family: 'JetBrains Mono', monospace; }
.reasoning-visual {
  min-height: 66px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 13px;
}
.reasoning-visual strong {
  padding: 10px 16px;
  border-radius: 14px;
  color: ${T.navy};
  background: ${T.cyanSoft};
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(22px, 4vw, 34px);
  letter-spacing: .05em;
}
.reasoning-visual-solved strong {
  animation: reasoning-confirm 1.15s cubic-bezier(.16,1,.3,1) both;
}
@keyframes reasoning-confirm {
  0% { box-shadow: 0 0 0 0 rgba(34,122,83,0); transform: scale(1); }
  55% { color: ${T.success}; box-shadow: 0 0 0 7px rgba(34,122,83,.10); transform: scale(1.035); }
  100% { color: ${T.success}; box-shadow: 0 0 0 3px rgba(34,122,83,.08); transform: scale(1); }
}
.reasoning-arrow { color: ${T.accent}; font-size: 24px; font-weight: 900; }
.reasoning-answer-stage,
.rapid-answer-stage {
  min-height: 76px;
}
.reasoning-proof-layer,
.rapid-proof-layer {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-items: stretch;
  gap: 10px;
}
.reasoning-proof-layer .bit-answer-comment,
.rapid-proof-layer .bit-answer-comment {
  width: 100%;
}
.reasoning-proof-completed .reasoning-complete,
.rapid-proof-layer .rapid-complete {
  width: 100%;
  min-width: 0;
}
.rapid-proof-layer .btn {
  justify-self: end;
}
.reasoning-proof-layer .reasoning-complete,
.rapid-proof-layer .rapid-complete {
  min-width: 190px;
}
.reasoning-complete {
  padding: 11px 14px;
  border-radius: 13px;
  color: ${T.success};
  background: ${T.successSoft};
  text-align: center;
  font-weight: 800;
}
.divider-workbench {
  width: min(820px, 100%);
  margin: 0 auto;
  padding: clamp(16px, 3vw, 24px);
  border-radius: 23px;
  display: grid;
  gap: 15px;
  background: rgba(255,255,255,.94);
  box-shadow: 0 20px 44px -30px rgba(${T.shadowBase},.58);
}
.finger-guide {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 10px 13px;
  border-radius: 15px;
  color: ${T.navy};
  background: ${T.cyanSoft};
  transition:
    color .7s ease,
    background .7s ease,
    box-shadow .8s ease,
    transform .8s cubic-bezier(.22,.8,.3,1);
}
.finger-guide-hand {
  font-size: 28px;
  transform-origin: 50% 100%;
  animation: finger-tap 2.8s ease-in-out infinite;
}
@keyframes finger-tap {
  0%, 20%, 100% { transform: translateX(0) translateY(0) rotate(-8deg); }
  55% { transform: translateX(-15px) translateY(-5px) rotate(-15deg); }
  72% { transform: translateX(-15px) translateY(2px) rotate(-15deg) scale(.92); }
}
.finger-guide strong { font-size: 12px; }
.finger-guide p { margin-top: 3px; color: ${T.ink2}; font-size: 10px; line-height: 1.35; }
.finger-guide-solved {
  color: ${T.success};
  background: ${T.successSoft};
  box-shadow: inset 0 0 0 1px rgba(34,122,83,.15);
}
.finger-guide-solved .finger-guide-hand {
  animation: guide-check-settle 1.1s cubic-bezier(.16,1,.3,1) both;
}
@keyframes guide-check-settle {
  from { opacity: .25; transform: translateY(9px) scale(.5) rotate(-14deg); }
  to { opacity: 1; transform: translateY(0) scale(1) rotate(0); }
}
.finger-count { display: flex; align-items: center; gap: 5px; color: ${T.cyan}; }
.finger-count i {
  width: 23px;
  height: 23px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #FFFFFF;
  font-style: normal;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 900;
}
.finger-count b { color: ${T.accent}; }
.divider-number {
  min-height: 92px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.divider-digit {
  width: clamp(46px, 8vw, 68px);
  height: clamp(58px, 9vw, 76px);
  border: 1px solid rgba(80,97,109,.12);
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: ${T.ink};
  background: #FFFFFF;
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(28px, 4.6vw, 40px);
  font-weight: 900;
  box-shadow: 0 10px 22px -18px rgba(${T.shadowBase},.55);
}
.divider-gap {
  position: relative;
  width: clamp(17px, 3vw, 28px);
  height: clamp(64px, 10vw, 84px);
  margin: 0 2px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  touch-action: manipulation;
}
.divider-gap span {
  position: absolute;
  inset: 8px 50%;
  width: 3px;
  border-radius: 99px;
  background: rgba(22,143,163,.18);
  transform: translateX(-50%) scaleY(.45);
  transition: transform .25s ease, background .25s ease, box-shadow .25s ease;
}
.divider-gap:hover:not(:disabled) span,
.divider-gap:focus-visible span {
  background: rgba(22,143,163,.55);
  transform: translateX(-50%) scaleY(.85);
}
.divider-gap-selected span {
  background: ${T.cyan};
  box-shadow: 0 0 10px rgba(22,143,163,.42);
  transform: translateX(-50%) scaleY(1);
}
.divider-gap-wrong span { background: ${T.warn}; box-shadow: 0 0 10px rgba(169,111,19,.38); }
.divider-gap-correct span {
  background: ${T.success};
  box-shadow: 0 0 14px rgba(34,122,83,.52);
  animation: divider-lock-in 1.55s cubic-bezier(.16,1,.3,1) both;
}
@keyframes divider-lock-in {
  0% { opacity: .15; transform: translateX(-50%) scaleY(.1); box-shadow: 0 0 0 rgba(34,122,83,0); }
  62% { opacity: 1; transform: translateX(-50%) scaleY(1.08); box-shadow: 0 0 18px rgba(34,122,83,.62); }
  100% { opacity: 1; transform: translateX(-50%) scaleY(1); box-shadow: 0 0 10px rgba(34,122,83,.4); }
}
.divider-instruction {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  color: ${T.ink2};
  text-align: center;
  font-size: 11px;
}
.divider-instruction span { font-size: 22px; }
.divider-outcome {
  display: grid;
  min-height: 78px;
}
.divider-outcome-layer {
  grid-area: 1 / 1;
  align-self: center;
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
  transition:
    opacity .65s ease,
    transform .85s cubic-bezier(.22,.8,.3,1),
    visibility 0s linear 0s;
}
.divider-proof-layer {
  display: grid;
  place-items: center;
  gap: 6px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(9px);
}
.divider-proof-layer > p {
  color: ${T.success};
  font-size: 10px;
  font-weight: 900;
  text-align: center;
}
.divider-outcome-solved .divider-prompt-layer {
  opacity: 0;
  visibility: hidden;
  transform: translateY(-8px);
  transition-delay: 0s, 0s, .7s;
}
.divider-outcome-solved .divider-proof-layer {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
  transition-delay: .42s, .32s, 0s;
}
.divider-outcome-solved .number-group {
  animation: divider-group-confirm 1.2s cubic-bezier(.16,1,.3,1) .48s both;
}
.divider-outcome-solved .group-divider {
  transform-origin: center;
  animation: divider-center-grow 1.45s cubic-bezier(.16,1,.3,1) .25s both;
}
@keyframes divider-group-confirm {
  from { opacity: 0; transform: translateY(8px) scale(.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes divider-center-grow {
  from { opacity: 0; transform: scaleY(.08); }
  to { opacity: 1; transform: scaleY(1); }
}
.shift-comparison {
  width: min(720px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 13px;
}
.shift-number {
  min-height: 84px;
  padding: 10px;
  border-radius: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  background: #FFFFFF;
  box-shadow: 0 12px 28px -20px rgba(${T.shadowBase},.5);
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(25px, 4vw, 36px);
  font-weight: 900;
}
.shift-number strong {
  padding: 3px 5px;
  border-radius: 8px;
  color: #FFFFFF;
  background: ${T.accent};
}
.shift-arrow { display: grid; place-items: center; gap: 3px; color: ${T.cyan}; text-align: center; }
.shift-arrow b { font-size: 26px; }
.shift-arrow span { max-width: 90px; font-size: 9px; font-weight: 800; }
.digit-shift-sequence {
  width: min(760px, 100%);
  margin: 0 auto;
  display: grid;
  place-items: center;
  gap: 1px;
}
.digit-shift-svg {
  display: block;
  width: 100%;
  height: min(214px, 27vh);
  overflow: visible;
}
.digit-shift-label {
  fill: ${T.ink2};
  font-size: 10px;
  font-weight: 900;
  letter-spacing: .04em;
  opacity: 0;
  transform: translateY(-4px);
}
.digit-shift-slot {
  fill: rgba(255,255,255,.82);
  stroke: rgba(22,143,163,.18);
  stroke-width: 2;
}
.digit-shift-route,
.digit-shift-route-arrow {
  fill: none;
  stroke: ${T.accent};
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dasharray: 7 7;
  opacity: 0;
}
.digit-shift-route-arrow {
  stroke-dasharray: none;
  transform-box: fill-box;
  transform-origin: center;
}
.digit-shift-token { transform: translateX(0); }
.digit-shift-token rect,
.digit-shift-new-zero rect {
  fill: #FFFFFF;
  stroke: rgba(80,97,109,.12);
  stroke-width: 1.5;
  filter: drop-shadow(0 8px 7px rgba(${T.shadowBase},.12));
}
.digit-shift-token text,
.digit-shift-new-zero text {
  fill: ${T.navy};
  font-family: 'JetBrains Mono', monospace;
  font-size: 32px;
  font-weight: 900;
}
.digit-shift-six rect {
  fill: ${T.accent};
  stroke: ${T.accent};
}
.digit-shift-six text { fill: #FFFFFF; }
.digit-shift-new-zero {
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
  transform: scale(.35);
}
.digit-shift-new-zero rect {
  fill: #FFF0EB;
  stroke: ${T.accent};
}
.digit-shift-new-zero text { fill: ${T.accent}; }
.digit-shift-six-value {
  opacity: 0;
  transform: translateY(7px);
}
.digit-shift-six-value rect {
  fill: ${T.cyanSoft};
  stroke: rgba(22,143,163,.19);
}
.digit-shift-six-value text {
  fill: ${T.navy};
  font-family: 'JetBrains Mono', monospace;
  font-size: 21px;
  font-weight: 900;
}
.digit-shift-six-value .digit-shift-formula-arrow,
.digit-shift-six-value .digit-shift-formula-multiply { fill: ${T.accent}; }
.digit-shift-caption {
  width: min(520px, 100%);
  min-height: 34px;
  padding: 8px 16px;
  border: 2px solid rgba(22,143,163,.2);
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${T.cyan};
  background: linear-gradient(135deg, #FFFFFF, ${T.cyanSoft});
  box-shadow: 0 10px 22px -18px rgba(22,143,163,.62);
  font-size: clamp(9px, 1.3vw, 11px);
  font-weight: 900;
  line-height: 1.2;
  text-align: center;
  white-space: nowrap;
}
.digit-shift-pending .digit-shift-caption::before {
  content: '◆';
  margin-right: 9px;
  color: ${T.accent};
  font-size: 10px;
}
.digit-shift-pending .digit-shift-caption {
  animation: digit-hint-focus 1.9s ease-in-out infinite;
}
.digit-shift-solved .digit-shift-label {
  animation: digit-labels-reveal 4.8s cubic-bezier(.22,.8,.3,1) both;
}
.digit-shift-solved .digit-shift-route {
  animation: digit-route-reveal 4.8s ease both;
}
.digit-shift-solved .digit-shift-route-arrow {
  animation: digit-arrow-reveal 4.8s cubic-bezier(.16,1,.3,1) both;
}
.digit-shift-solved .digit-shift-token {
  animation: digit-token-left-once 4.8s cubic-bezier(.22,.8,.3,1) both;
}
.digit-shift-solved .digit-shift-new-zero {
  animation: digit-new-zero-once 4.8s cubic-bezier(.16,1,.3,1) both;
}
.digit-shift-solved .digit-shift-six-value {
  animation: digit-six-value-once 4.8s ease both;
}
@keyframes digit-hint-focus {
  0%, 100% { transform: translateY(0); box-shadow: 0 10px 22px -18px rgba(22,143,163,.62); }
  50% { transform: translateY(-2px); box-shadow: 0 13px 25px -15px rgba(22,143,163,.78), 0 0 0 4px rgba(22,143,163,.06); }
}
@keyframes digit-labels-reveal {
  0%, 7% { opacity: 0; transform: translateY(-5px); }
  24%, 100% { opacity: 1; transform: translateY(0); }
}
@keyframes digit-route-reveal {
  0%, 24% { opacity: 0; }
  41%, 100% { opacity: .78; }
}
@keyframes digit-arrow-reveal {
  0%, 29% { opacity: 0; transform: translate(-2px, -4px) rotate(-45deg) scale(.72); }
  44%, 100% { opacity: .9; transform: translate(-2px, -4px) rotate(-45deg) scale(1); }
}
@keyframes digit-token-left-once {
  0%, 52% { transform: translateX(0); }
  82%, 100% { transform: translateX(-115px); }
}
@keyframes digit-new-zero-once {
  0%, 75% { opacity: 0; transform: scale(.35); }
  90%, 100% { opacity: 1; transform: scale(1); }
}
@keyframes digit-six-value-once {
  0%, 84% { opacity: 0; transform: translateY(7px); }
  100% { opacity: 1; transform: translateY(0); }
}
.mini-place {
  width: min(500px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.mini-place > div {
  min-height: 84px;
  padding: 10px;
  border-radius: 15px;
  display: grid;
  place-items: center;
  background: #FFFFFF;
  box-shadow: 0 12px 26px -20px rgba(${T.shadowBase},.5);
}
.mini-place span { color: ${T.ink2}; font-size: 11px; font-weight: 700; }
.mini-place strong { font-family: 'JetBrains Mono', monospace; font-size: 30px; color: ${T.cyan}; }
.overflow-model { position: relative; width: min(590px, 100%); margin: 0 auto; padding-left: 70px; }
.floating-digit {
  position: absolute;
  left: 8px;
  top: 20px;
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border-radius: 15px;
  color: #FFFFFF;
  background: ${T.accent};
  box-shadow: 0 12px 24px -14px rgba(255,91,53,.8);
  animation: float-digit 2s ease-in-out infinite;
}
@keyframes float-digit { 50% { transform: translateY(-7px); } }
.example-strip, .sequence-strip, .value-comparison {
  width: min(720px, 100%);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(8px, 2vw, 16px);
}
.example-strip span, .sequence-strip span {
  padding: 12px 16px;
  border-radius: 14px;
  color: ${T.navy};
  background: #FFFFFF;
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(18px, 3vw, 25px);
  font-weight: 800;
  box-shadow: 0 10px 24px -18px rgba(${T.shadowBase},.5);
}
.sequence-strip b { color: ${T.cyan}; }
.value-comparison > div {
  flex: 1;
  padding: 14px;
  border-radius: 17px;
  display: grid;
  place-items: center;
  gap: 5px;
  background: #FFFFFF;
  box-shadow: 0 12px 28px -20px rgba(${T.shadowBase},.5);
}
.value-comparison strong { font-family: 'JetBrains Mono', monospace; font-size: 23px; }
.value-comparison span { color: ${T.accent}; font-weight: 800; }
.place-table {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 5px;
}
.class-banner {
  grid-column: span 3;
  padding: 6px 5px;
  border-radius: 9px 9px 3px 3px;
  color: #FFFFFF;
  text-align: center;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: .08em;
}
.class-thousands { background: ${T.navy}; }
.class-units { background: ${T.cyan}; }
.place-cell {
  min-height: 80px;
  padding: 7px 3px;
  border-radius: 9px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: rgba(255,255,255,.9);
  box-shadow: inset 0 0 0 1px rgba(80,97,109,.10);
}
.place-cell:nth-of-type(n+3):nth-of-type(-n+5) { background: rgba(23,59,82,.055); }
.place-cell span {
  min-height: 25px;
  color: ${T.ink2};
  font-size: 8px;
  line-height: 1.15;
  text-align: center;
}
.place-cell strong {
  min-height: 32px;
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(20px, 3vw, 28px);
}
.place-highlight {
  background: ${T.accentSoft} !important;
  box-shadow: inset 0 0 0 2px rgba(255,91,53,.38);
}
.builder-frame, .match-board, .round-card, .guided-card, .rule-builder, .case-model {
  width: min(780px, 100%);
  margin: 0 auto;
  padding: clamp(14px, 2.8vw, 22px);
  border-radius: 22px;
  background: rgba(255,255,255,.92);
  box-shadow: 0 20px 44px -30px rgba(${T.shadowBase},.5);
}
.slot-overlay {
  margin-top: -47px;
  padding: 0 4px;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 5px;
  position: relative;
  z-index: 2;
}
.drop-slot {
  height: 40px;
  border: 0;
  border-radius: 8px;
  color: ${T.ink};
  background: rgba(229,245,246,.75);
  font-family: 'JetBrains Mono', monospace;
  font-size: 24px;
  font-weight: 900;
  cursor: pointer;
}
.drop-ready { box-shadow: inset 0 0 0 2px rgba(22,143,163,.35); }
.drop-locked { color: ${T.ink3}; background: rgba(135,148,157,.08); cursor: default; }
.digit-tray {
  min-height: 62px;
  margin-top: 15px;
  padding: 9px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 14px;
  background: #F3F7F5;
}
.digit-card {
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: 11px;
  color: #FFFFFF;
  background: ${T.navy};
  font-family: 'JetBrains Mono', monospace;
  font-size: 22px;
  font-weight: 900;
  cursor: grab;
  box-shadow: 0 8px 16px -10px rgba(23,59,82,.8);
}
.digit-selected { background: ${T.accent}; transform: translateY(-3px); }
.tray-empty { color: ${T.success}; font-size: 12px; font-weight: 800; }
.inline-action { margin-top: 14px; display: flex; justify-content: flex-end; }
.number-groups {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.number-group {
  min-width: 115px;
  padding: 13px 18px;
  border-radius: 15px;
  display: grid;
  place-items: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 26px;
  font-weight: 900;
  transition: transform .2s ease, box-shadow .2s ease;
}
.number-group-thousands { color: ${T.navy}; background: rgba(23,59,82,.09); }
.number-group-units { color: ${T.cyan}; background: ${T.cyanSoft}; }
.group-divider { width: 2px; height: 54px; border-radius: 2px; background: ${T.accent}; }
.group-active { transform: translateY(-4px); box-shadow: 0 12px 22px -14px rgba(22,143,163,.7); }
.match-board { display: grid; gap: 14px; }
.match-labels, .match-targets {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;
}
.class-label, .match-target {
  min-height: 48px;
  border: 0;
  border-radius: 13px;
  cursor: pointer;
  font-weight: 800;
}
.class-label { color: ${T.navy}; background: rgba(23,59,82,.08); }
.class-label-selected { color: #FFFFFF; background: ${T.navy}; }
.class-label-done { color: ${T.success}; background: ${T.successSoft}; }
.match-target { color: ${T.cyan}; background: ${T.cyanSoft}; font-family: 'JetBrains Mono', monospace; font-size: 22px; }
.round-card { display: grid; gap: 13px; }
.round-badge {
  justify-self: start;
  padding: 5px 9px;
  border-radius: 999px;
  color: ${T.cyan};
  background: ${T.cyanSoft};
  font-size: 10px;
  font-weight: 900;
}
.highlight-number {
  display: flex;
  justify-content: center;
  gap: 3px;
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(34px, 7vw, 56px);
  font-weight: 900;
}
.highlight-number span { padding: 2px 3px; border-radius: 8px; }
.digit-highlight { color: #FFFFFF; background: ${T.accent}; box-shadow: 0 8px 18px -10px rgba(255,91,53,.7); }
.value-options { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.option-center { justify-content: center; text-align: center; font-family: 'JetBrains Mono', monospace; font-size: 18px; }
.discovery-card {
  width: min(520px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.discovery-card > * {
  padding: 13px;
  border-radius: 12px;
  text-align: center;
  background: #FFFFFF;
}
.discovery-card span { color: ${T.accent}; font-weight: 900; }
.rule-built {
  min-height: 120px;
  padding: 12px;
  border-radius: 15px;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 7px;
  color: ${T.ink3};
  background: ${T.cyanSoft};
}
.rule-built button, .fragment {
  border: 0;
  border-radius: 10px;
  padding: 9px 11px;
  cursor: pointer;
  font-weight: 700;
}
.rule-built button { color: #FFFFFF; background: ${T.cyan}; }
.fragment-tray { min-height: 70px; margin-top: 12px; display: flex; flex-wrap: wrap; gap: 7px; }
.fragment { color: ${T.navy}; background: #FFFFFF; box-shadow: 0 8px 18px -14px rgba(${T.shadowBase},.6); }
.guided-card { display: grid; gap: 14px; }
.raw-number {
  justify-self: center;
  padding: 10px 18px;
  border-radius: 13px;
  color: ${T.navy};
  background: #F0F5F3;
  font-family: 'JetBrains Mono', monospace;
  font-size: 29px;
  font-weight: 900;
  letter-spacing: .12em;
}
.strategy-number { margin: 4px auto; }
.bit-error-card {
  width: min(560px, 100%);
  margin: 0 auto;
  padding: 10px 18px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 22px;
  background: #FFFFFF;
  box-shadow: 0 14px 30px -22px rgba(${T.shadowBase},.55);
}
.bit-error-card > div:last-child { display: grid; gap: 6px; }
.bit-error-card span { color: ${T.ink2}; font-size: 11px; font-weight: 800; text-transform: uppercase; }
.bit-error-card strong { font-family: 'JetBrains Mono', monospace; font-size: 31px; color: ${T.warn}; }
.boundary-repair {
  width: min(760px, 100%);
  min-height: 164px;
  margin: 0 auto;
  padding: 10px 14px;
  border-radius: 21px;
  display: grid;
  grid-template-columns: 90px minmax(0, 1fr);
  align-items: center;
  gap: 6px;
  overflow: hidden;
  background: rgba(255,255,255,.92);
  box-shadow: 0 16px 34px -26px rgba(${T.shadowBase},.55);
}
.boundary-repair-bit {
  align-self: stretch;
  display: grid;
  grid-template-rows: 1fr auto;
  place-items: center;
  color: ${T.ink2};
  font-size: 8px;
  font-weight: 900;
  letter-spacing: .08em;
}
.boundary-repair-bit .g1-char { width: 76px; height: 95px; }
.boundary-repair > svg {
  display: block;
  width: 100%;
  max-height: 150px;
  overflow: visible;
}
.repair-digit rect {
  fill: #FFFFFF;
  stroke: rgba(80,97,109,.14);
  stroke-width: 1.5;
  filter: drop-shadow(0 8px 7px rgba(${T.shadowBase},.11));
}
.repair-digit text {
  fill: ${T.navy};
  font-family: 'JetBrains Mono', monospace;
  font-size: 34px;
  font-weight: 900;
}
.repair-divider {
  fill: ${T.warn};
  opacity: 1;
  transform-box: view-box;
  transition:
    x 1.8s cubic-bezier(.22,.78,.24,1),
    opacity .55s ease 1.35s,
    fill 1.1s ease,
    filter 1.2s ease;
}
.repair-divider-correct {
  fill: ${T.success};
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
  transform: scaleY(.08);
  filter: drop-shadow(0 0 0 rgba(34,122,83,0));
  transition:
    opacity .5s ease 1.2s,
    transform 1.2s cubic-bezier(.16,1,.3,1) 1.1s,
    filter .9s ease 1.55s;
}
.boundary-repair-solved .repair-divider-left {
  x: 251px;
  fill: ${T.success};
  opacity: 0;
}
.boundary-repair-solved .repair-divider-right {
  x: 251px;
  fill: ${T.success};
  opacity: 0;
}
.boundary-repair-solved .repair-divider-correct {
  opacity: 1;
  transform: scaleY(1);
  filter: drop-shadow(0 0 9px rgba(34,122,83,.62));
}
.repair-group-label {
  fill: ${T.success};
  font-size: 10px;
  font-weight: 900;
  opacity: 0;
  transform: translateY(5px);
  transition: opacity .7s ease 1.7s, transform .8s ease 1.62s;
}
.boundary-repair-solved .repair-group-label {
  opacity: 1;
  transform: translateY(0);
}
.boundary-repair-solved .repair-digit {
  animation: repair-digit-confirm 1.1s ease 1.35s both;
}
@keyframes repair-digit-confirm {
  55% { filter: drop-shadow(0 0 7px rgba(34,122,83,.32)); }
}
.city-code-mission {
  width: min(780px, 100%);
  min-height: 176px;
  margin: 0 auto;
  padding: 12px;
  border-radius: 22px;
  display: grid;
  gap: 8px;
  overflow: hidden;
  background: rgba(255,255,255,.92);
  box-shadow: 0 16px 34px -26px rgba(${T.shadowBase},.55);
}
.city-code-model-stage {
  display: grid;
  min-height: 116px;
}
.city-code-layer {
  grid-area: 1 / 1;
  align-self: center;
  transition:
    opacity .75s ease,
    transform 1s cubic-bezier(.22,.8,.3,1),
    visibility 0s linear .95s;
}
.city-clue-layer {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 6px;
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}
.city-clue {
  min-height: 82px;
  padding: 7px 4px;
  border: 1px dashed rgba(22,143,163,.23);
  border-radius: 13px;
  display: grid;
  place-items: center;
  color: ${T.ink2};
  background: #F5F8F7;
}
.city-clue small { font-size: 7px; font-weight: 800; text-align: center; }
.city-clue strong {
  color: ${T.cyan};
  font-family: 'JetBrains Mono', monospace;
  font-size: 25px;
}
.city-table-layer {
  opacity: 0;
  visibility: hidden;
  transform: translateY(9px) scale(.985);
}
.city-code-solved .city-clue-layer {
  opacity: 0;
  visibility: hidden;
  transform: translateY(-8px) scale(.985);
}
.city-code-solved .city-table-layer {
  opacity: 1;
  visibility: visible;
  transform: translateY(0) scale(1);
  transition-delay: .3s, .25s, 0s;
}
.city-code-result {
  min-height: 29px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: ${T.success};
  background: ${T.successSoft};
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  opacity: 0;
  transform: translateY(6px);
  transition: opacity .7s ease .95s, transform .8s ease .88s;
}
.city-code-solved .city-code-result { opacity: 1; transform: translateY(0); }
.strategy-decomposition {
  width: min(760px, 100%);
  min-height: 158px;
  flex-shrink: 0;
  margin: 0 auto;
  padding: 14px 18px;
  border-radius: 22px;
  display: grid;
  place-items: center;
  gap: 8px;
  overflow: hidden;
  background: rgba(255,255,255,.93);
  box-shadow: 0 16px 34px -26px rgba(${T.shadowBase},.55);
}
.strategy-digit-row {
  min-height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}
.strategy-digit-row > span {
  width: clamp(42px, 6.5vw, 58px);
  height: clamp(52px, 7vw, 66px);
  border: 1px solid rgba(80,97,109,.13);
  border-radius: 13px;
  display: grid;
  place-items: center;
  color: ${T.navy};
  background: #FFFFFF;
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(25px, 3.6vw, 34px);
  font-weight: 900;
  transition:
    color .75s ease,
    background .75s ease,
    transform .9s cubic-bezier(.22,.8,.3,1);
}
.strategy-boundary {
  width: 0;
  height: 58px;
  margin: 0;
  border-radius: 99px;
  opacity: 0;
  background: ${T.accent};
  transform: scaleY(.15);
  transition:
    width 1s cubic-bezier(.16,1,.3,1),
    margin 1s cubic-bezier(.16,1,.3,1),
    opacity .6s ease,
    transform 1.15s cubic-bezier(.16,1,.3,1),
    box-shadow .9s ease .45s;
}
.strategy-decomposition-step-1 .strategy-boundary,
.strategy-decomposition-step-2 .strategy-boundary {
  width: 4px;
  margin: 0 8px;
  opacity: 1;
  transform: scaleY(1);
  box-shadow: 0 0 12px rgba(255,91,53,.42);
}
.strategy-decomposition-step-1 .strategy-thousands-digit,
.strategy-decomposition-step-2 .strategy-thousands-digit {
  color: ${T.navy};
  background: rgba(23,59,82,.08);
  transform: translateX(-3px);
}
.strategy-decomposition-step-1 .strategy-units-digit,
.strategy-decomposition-step-2 .strategy-units-digit {
  color: ${T.cyan};
  background: ${T.cyanSoft};
  transform: translateX(3px);
}
.strategy-visual-note {
  min-height: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  color: ${T.cyan};
  text-align: center;
  font-size: 11px;
}
.strategy-visual-note > span:not(.strategy-count) { font-size: 24px; }
.strategy-count { display: flex; gap: 4px; }
.strategy-count i {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #FFFFFF;
  background: ${T.cyan};
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-style: normal;
}
.strategy-decomposition-step-1 .strategy-count i {
  animation: strategy-count-step 1.35s ease both;
}
.strategy-decomposition-step-1 .strategy-count i:nth-child(2) { animation-delay: .18s; }
.strategy-decomposition-step-1 .strategy-count i:nth-child(3) { animation-delay: .36s; }
@keyframes strategy-count-step {
  from { opacity: .2; transform: translateX(10px) scale(.75); }
  to { opacity: 1; transform: translateX(0) scale(1); }
}
.strategy-decomposition-step-2 .strategy-boundary {
  background: ${T.success};
  box-shadow: 0 0 14px rgba(34,122,83,.52);
}
.strategy-visual-note .answer-proof { min-height: 54px; }
.strategy-answer-stage { min-height: 74px; }
.strategy-answer-stage .answer-proof-layer {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-items: stretch;
  gap: 10px;
}
.strategy-screen > .feedback { flex-shrink: 0; }
.case-model { display: grid; gap: 10px; }
.case-model p { color: ${T.ink2}; text-align: center; font-size: 13px; line-height: 1.4; }
.object-option { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.object-option strong { color: ${T.cyan}; font-family: 'JetBrains Mono', monospace; }
.fact-card {
  width: min(700px, 100%);
  margin: 0 auto;
  padding: 13px 16px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 13px;
  color: ${T.navy};
  background: linear-gradient(145deg, #EDF8F7, #FFFFFF);
  box-shadow: 0 12px 26px -20px rgba(22,143,163,.5);
}
.fact-badge {
  flex: 0 0 auto;
  padding: 5px 8px;
  border-radius: 999px;
  color: #FFFFFF;
  background: ${T.cyan};
  font-size: 9px;
  font-weight: 900;
  text-transform: uppercase;
}
.fact-card p { font-size: 13px; line-height: 1.4; }
.quick-test-screen {
  width: min(820px, 100%);
  margin: 0 auto;
}
.rapid-console { width: min(900px, 100%); margin: 0 auto; }
.rapid-panel {
  width: min(850px, 100%);
  margin: 0 auto;
  padding: clamp(14px, 2.4vw, 20px);
  border-radius: 23px;
  display: grid;
  gap: 13px;
  background: rgba(255,255,255,.94);
  box-shadow: 0 20px 44px -30px rgba(${T.shadowBase},.58);
}
.rapid-panel .quick-number-card { min-height: 118px; box-shadow: none; background: #F4F8F6; }
.rapid-panel .quick-number-digits strong { height: clamp(48px, 7vw, 62px); }
.rapid-options-single-column {
  grid-template-columns: 1fr;
}
.rapid-options-single-column .option {
  min-height: 56px;
}
.rapid-options-single-column .option > span:last-child {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  line-height: 1.35;
}
.rapid-complete {
  min-height: 64px;
  padding: 11px 15px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: ${T.success};
  background: ${T.successSoft};
}
.rapid-complete span { font-size: 25px; animation: quick-highlight 1.5s ease-in-out infinite; }
.quick-test-meter {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  color: ${T.ink2};
  font-size: 10px;
  font-weight: 900;
  letter-spacing: .06em;
  text-transform: uppercase;
}
.quick-test-meter > div {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
}
.quick-test-meter i {
  height: 5px;
  border-radius: 999px;
  background: #DDE4E1;
}
.quick-test-meter .quick-meter-active { background: ${T.accent}; }
.quick-test-meter strong {
  color: ${T.accent};
  font-family: 'JetBrains Mono', monospace;
}
.quick-number-card {
  width: min(610px, 100%);
  min-height: 152px;
  margin: 0 auto;
  padding: 16px;
  border-radius: 22px;
  display: grid;
  place-items: center;
  gap: 12px;
  background:
    radial-gradient(circle at 85% 15%, rgba(255,91,53,.12), transparent 32%),
    linear-gradient(145deg, #FFFFFF, #F3F8F6);
  box-shadow: 0 18px 38px -28px rgba(${T.shadowBase},.58);
}
.quick-number-label {
  color: ${T.cyan};
  font-size: 10px;
  font-weight: 900;
  letter-spacing: .08em;
  text-transform: uppercase;
}
.quick-number-digits {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(4px, 1vw, 8px);
}
.quick-number-digits strong {
  width: clamp(44px, 7vw, 62px);
  height: clamp(55px, 8vw, 72px);
  border: 1px solid rgba(80,97,109,.12);
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: ${T.ink};
  background: #FFFFFF;
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(27px, 4vw, 38px);
  box-shadow: 0 10px 22px -18px rgba(${T.shadowBase},.45);
}
.quick-number-digits .quick-digit-highlight {
  border-color: ${T.accent};
  color: #FFFFFF;
  background: ${T.accent};
  box-shadow: 0 12px 24px -12px rgba(255,91,53,.72);
  animation: quick-highlight 1.5s ease-in-out infinite;
}
.quick-class-boundary {
  width: 0;
  height: 58px;
  margin: 0;
  border-radius: 99px;
  opacity: 0;
  background: ${T.success};
  transform: scaleY(.12);
  transition:
    width 1.15s cubic-bezier(.16,1,.3,1),
    margin 1.15s cubic-bezier(.16,1,.3,1),
    opacity .7s ease,
    transform 1.25s cubic-bezier(.16,1,.3,1),
    box-shadow 1s ease .45s;
}
.quick-number-proof {
  min-height: 16px;
  color: ${T.success};
  font-size: 10px;
  font-weight: 900;
  text-align: center;
  opacity: 0;
  transform: translateY(5px);
  transition: opacity .75s ease .55s, transform .85s ease .48s;
}
.quick-number-card-solved .quick-class-boundary {
  width: 4px;
  margin: 0 6px;
  opacity: 1;
  transform: scaleY(1);
  box-shadow: 0 0 12px rgba(34,122,83,.5);
}
.quick-number-card-solved .quick-proof-left {
  color: ${T.navy};
  background: rgba(23,59,82,.08);
}
.quick-number-card-solved .quick-proof-right {
  color: ${T.cyan};
  background: ${T.cyanSoft};
}
.quick-number-card-solved .quick-digit-highlight {
  animation: none;
  transform: none;
}
.quick-number-card-solved .quick-number-proof {
  opacity: 1;
  transform: translateY(0);
}
@keyframes quick-highlight {
  50% { transform: translateY(-5px); }
}
.summary-stack { gap: 12px; }
.reward-stage {
  position: relative;
  width: min(840px, 100%);
  min-height: 154px;
  margin: 0 auto;
  padding: 16px 145px 15px 108px;
  border-radius: 25px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  overflow: hidden;
  color: #FFFFFF;
  background:
    radial-gradient(circle at 82% 20%, rgba(255,194,60,.26), transparent 30%),
    linear-gradient(135deg, #173B52, #0E6978);
  box-shadow: 0 24px 50px -30px rgba(14,33,44,.8);
  transition: transform .5s ease, box-shadow .5s ease;
}
.reward-locked { filter: saturate(.72); }
.reward-unlocked {
  transform: translateY(-2px);
  box-shadow: 0 28px 58px -27px rgba(22,143,163,.8);
}
.reward-bit {
  position: absolute;
  right: 24px;
  bottom: 7px;
  width: 92px;
  height: 115px;
}
.reward-bit .g1-char { width: 100%; height: 100%; }
.reward-unlocked .reward-bit { animation: g4bitfloat 2.8s ease-in-out infinite; }
.reward-medal {
  position: absolute;
  left: 24px;
  top: 50%;
  width: 66px;
  height: 66px;
  border: 4px solid rgba(255,255,255,.58);
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #5A3A00;
  background: linear-gradient(145deg, #FFE284, #FFC23C);
  box-shadow: 0 0 0 8px rgba(255,255,255,.08), 0 15px 30px -15px rgba(0,0,0,.6);
  font-size: 30px;
}
.reward-kicker {
  color: #A8EAF0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: .13em;
}
.reward-stage h1 {
  max-width: 590px;
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: clamp(21px, 3vw, 30px);
  line-height: 1.05;
}
.reward-stage > p {
  max-width: 580px;
  color: rgba(255,255,255,.78);
  font-size: 12px;
  line-height: 1.4;
}
.reward-score {
  align-self: flex-start;
  margin-top: 5px;
  padding: 5px 9px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 7px;
  background: rgba(255,255,255,.10);
}
.reward-score strong { color: #FFE284; font-family: 'JetBrains Mono', monospace; }
.reward-score span { color: rgba(255,255,255,.72); font-size: 9px; }
.reward-confetti { position: absolute; inset: 0; pointer-events: none; }
.reward-confetti i {
  position: absolute;
  top: -16px;
  width: 7px;
  height: 12px;
  border-radius: 2px;
  animation: reward-confetti 2.4s linear infinite;
}
.reward-confetti i:nth-child(4n+1) { background: #FFC23C; }
.reward-confetti i:nth-child(4n+2) { background: #FF5B35; }
.reward-confetti i:nth-child(4n+3) { background: #77E1EA; }
.reward-confetti i:nth-child(4n) { background: #95C93D; }
.reward-confetti i:nth-child(1) { left: 8%; animation-delay: -.3s; }
.reward-confetti i:nth-child(2) { left: 17%; animation-delay: -1.1s; }
.reward-confetti i:nth-child(3) { left: 29%; animation-delay: -.7s; }
.reward-confetti i:nth-child(4) { left: 41%; animation-delay: -1.7s; }
.reward-confetti i:nth-child(5) { left: 52%; animation-delay: -.2s; }
.reward-confetti i:nth-child(6) { left: 63%; animation-delay: -1.3s; }
.reward-confetti i:nth-child(7) { left: 73%; animation-delay: -.8s; }
.reward-confetti i:nth-child(8) { left: 84%; animation-delay: -1.9s; }
.reward-confetti i:nth-child(9) { left: 12%; animation-delay: -2s; }
.reward-confetti i:nth-child(10) { left: 36%; animation-delay: -1.4s; }
.reward-confetti i:nth-child(11) { left: 68%; animation-delay: -.5s; }
.reward-confetti i:nth-child(12) { left: 91%; animation-delay: -1.6s; }
@keyframes reward-confetti {
  to { transform: translateY(230px) rotate(460deg); }
}
.unlock-guide {
  width: min(840px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 9px;
}
.unlock-guide > b { color: ${T.accent}; font-size: 22px; }
.unlock-guide-step {
  min-height: 58px;
  padding: 7px 10px;
  border: 1px solid rgba(22,143,163,.15);
  border-radius: 15px;
  display: grid;
  grid-template-columns: 23px 29px 1fr;
  align-items: center;
  gap: 7px;
  color: ${T.ink2};
  background: rgba(255,255,255,.86);
}
.unlock-guide-step > span {
  width: 23px;
  height: 23px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #FFFFFF;
  background: ${T.cyan};
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 900;
}
.unlock-guide-step > i {
  font-size: 21px;
  font-style: normal;
  text-align: center;
  animation: guide-point 1.35s ease-in-out infinite;
}
@keyframes guide-point {
  50% { transform: translateY(4px); }
}
.unlock-guide-step p { font-size: 11px; line-height: 1.3; font-weight: 800; }
.unlock-guide-done .unlock-guide-step {
  border-color: rgba(34,122,83,.2);
  color: ${T.success};
  background: ${T.successSoft};
}
.unlock-guide-done .unlock-guide-step > span { background: ${T.success}; }
.unlock-guide-done .unlock-guide-step > i { animation: none; }
.summary-action-layout {
  min-height: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  align-items: stretch;
}
.summary-rule-strip {
  min-width: 0;
  height: 100%;
  padding: 12px;
  border: 2px solid rgba(22,143,163,.28);
  border-radius: 17px;
  background:
    linear-gradient(135deg, rgba(230,247,250,.72), transparent 42%),
    rgba(255,255,255,.94);
  box-shadow:
    inset 5px 0 0 ${T.cyan},
    0 15px 32px -23px rgba(22,143,163,.7);
}
.summary-rule-heading {
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.summary-rule-heading > span {
  min-width: 55px;
  padding: 5px 8px;
  border-radius: 9px;
  color: #FFFFFF;
  background: ${T.cyan};
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 900;
  text-align: center;
  box-shadow: 0 7px 15px -10px rgba(22,143,163,.9);
}
.summary-rule-strip h2 { margin: 0; font-size: 14px; }
.summary-rule-items {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: 1fr;
  gap: 6px;
}
.summary-rule-items > span {
  min-width: 0;
  padding: 7px;
  border: 1px solid rgba(22,143,163,.11);
  border-radius: 11px;
  display: grid;
  grid-template-columns: 22px 1fr;
  align-items: center;
  gap: 6px;
  color: ${T.ink2};
  background: rgba(255,255,255,.82);
}
.summary-rule-strip i {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: ${T.cyan};
  background: ${T.cyanSoft};
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-style: normal;
  font-weight: 900;
}
.summary-rule-strip p { font-size: 10px; line-height: 1.3; }
.summary-card {
  min-width: 0;
  height: 100%;
  padding: 13px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  background: rgba(255,255,255,.92);
  box-shadow: 0 12px 26px -21px rgba(${T.shadowBase},.5);
}
.reflection-card > .summary-question-kicker,
.reflection-card > .summary-question,
.reflection-card > .summary-question-stem,
.reflection-card > .reflection-options,
.reflection-card > .reflection-resolution,
.reflection-card > .feedback {
  flex-shrink: 0;
}
.reflection-resolution {
  display: grid;
  gap: 7px;
}
.summary-card h2 { margin-bottom: 8px; font-size: 14px; }
.summary-card ul { padding-left: 17px; display: grid; gap: 5px; color: ${T.ink2}; font-size: 12px; line-height: 1.35; }
.summary-question-kicker {
  margin-bottom: 4px;
  color: ${T.accent};
  font-family: 'JetBrains Mono', monospace;
  font-size: 8px;
  font-weight: 900;
  letter-spacing: .1em;
}
.summary-card .summary-question {
  margin-bottom: 4px;
  color: ${T.navy};
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: 15px;
  line-height: 1.18;
}
.summary-question-stem {
  margin-bottom: 7px !important;
  color: ${T.ink2};
  font-size: 10px;
  line-height: 1.3;
}
.reflection-options {
  max-height: 180px;
  display: grid;
  gap: 6px;
  overflow: hidden;
  opacity: 1;
  transition:
    max-height .75s cubic-bezier(.22,.8,.3,1) .48s,
    opacity .28s ease .52s,
    margin .75s cubic-bezier(.22,.8,.3,1) .48s;
}
.reflection-options-solved {
  max-height: 0;
  margin-block: 0;
  opacity: 0;
  pointer-events: none;
}
.reflection-option {
  min-height: 34px;
  padding: 7px 9px;
  border: 0;
  border-radius: 10px;
  color: ${T.ink};
  background: #F4F7F5;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
}
.reflection-option > span {
  width: 21px;
  height: 21px;
  flex: 0 0 21px;
  border-radius: 7px;
  display: grid;
  place-items: center;
  color: ${T.cyan};
  background: ${T.cyanSoft};
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-weight: 900;
}
.reflection-correct { color: ${T.success}; background: ${T.successSoft}; }
.reflection-wrong { color: ${T.warn}; background: ${T.warnSoft}; }
.reflection-solved {
  min-height: 42px;
  padding: 9px 11px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  color: ${T.success};
  background: ${T.successSoft};
  font-size: 11px;
  font-weight: 800;
}
.reflection-card .feedback-card {
  min-height: 62px;
  padding: 5px 10px 5px 6px;
}
.reflection-card .g4-bit-reaction-figure {
  width: 44px;
  height: 54px;
  flex-basis: 44px;
}
.reflection-card .g4-bit-reaction-copy { font-size: 14px; }
.final-mission-heading {
  width: min(840px, 100%);
  margin: 0 auto;
  padding: 12px 16px;
  border: 1px solid rgba(255,91,53,.17);
  border-radius: 17px;
  background:
    linear-gradient(100deg, rgba(255,91,53,.09), transparent 48%),
    rgba(255,255,255,.9);
  box-shadow: 0 13px 28px -24px rgba(255,91,53,.72);
}
.final-mission-heading > span {
  display: flex;
  align-items: center;
  gap: 7px;
  color: ${T.accent};
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: .12em;
}
.final-mission-heading > span i {
  font-size: 8px;
  animation: final-marker-pulse 1.5s ease-in-out infinite;
}
.final-mission-heading h1 {
  margin-top: 3px;
  color: ${T.navy};
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: clamp(21px, 3vw, 28px);
  line-height: 1.08;
}
.final-mission-heading p {
  margin-top: 3px;
  color: ${T.ink2};
  font-size: 11px;
  line-height: 1.32;
}
@keyframes final-marker-pulse {
  50% { opacity: .45; transform: scale(.8); }
}
.summary-final-layout {
  width: min(840px, 100%);
  margin: 0 auto;
  grid-template-columns: minmax(0, 1fr);
  align-items: start;
}
.final-question-card {
  height: auto;
  border: 2px solid rgba(255,91,53,.22);
  box-shadow:
    inset 0 4px 0 rgba(255,91,53,.88),
    0 18px 38px -28px rgba(255,91,53,.7);
}
.final-question-card .summary-question-kicker {
  min-height: 25px;
  margin-bottom: 8px;
  padding: 4px 6px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #FFFFFF;
  background: linear-gradient(90deg, ${T.accent}, #FF7658);
}
.final-question-card .summary-question-kicker > b {
  margin-left: auto;
  padding: 3px 6px;
  border-radius: 999px;
  color: #7D250F;
  background: rgba(255,255,255,.76);
  font-size: 7px;
  letter-spacing: .08em;
}
.final-question-card .summary-question {
  font-size: clamp(17px, 2.4vw, 22px);
  line-height: 1.18;
}
.summary-support-column {
  min-width: 0;
  display: grid;
  gap: 9px;
}
.summary-rules-disclosure {
  min-width: 0;
  border: 1px solid rgba(22,143,163,.2);
  border-radius: 16px;
  overflow: hidden;
  background: rgba(255,255,255,.94);
  box-shadow: 0 14px 30px -24px rgba(22,143,163,.72);
}
.summary-rules-toggle {
  width: 100%;
  min-height: 64px;
  padding: 8px 10px;
  border: 0;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 9px;
  color: ${T.ink};
  background:
    linear-gradient(135deg, rgba(230,247,250,.8), transparent 62%),
    #FFFFFF;
  cursor: pointer;
  text-align: left;
}
.summary-rules-toggle > span {
  min-width: 55px;
  padding: 7px 8px;
  border-radius: 10px;
  color: #FFFFFF;
  background: ${T.cyan};
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 900;
  text-align: center;
}
.summary-rules-toggle > div { min-width: 0; display: grid; gap: 2px; }
.summary-rules-toggle strong { font-size: 13px; line-height: 1.2; }
.summary-rules-toggle small { color: ${T.cyan}; font-size: 9px; font-weight: 800; }
.summary-rules-toggle > i {
  color: ${T.cyan};
  font-size: 24px;
  font-style: normal;
  transform: rotate(0);
  transition: transform .55s cubic-bezier(.16,1,.3,1);
}
.summary-rules-open .summary-rules-toggle > i { transform: rotate(180deg); }
.summary-rules-panel {
  max-height: 0;
  padding: 0 9px;
  overflow: hidden;
  opacity: 0;
  transform: translateY(-7px);
  transition:
    max-height .65s cubic-bezier(.22,.8,.3,1),
    padding .65s cubic-bezier(.22,.8,.3,1),
    opacity .4s ease,
    transform .55s ease;
}
.summary-rules-open .summary-rules-panel {
  max-height: 260px;
  padding: 0 9px 9px;
  opacity: 1;
  transform: translateY(0);
}
.summary-rules-panel .summary-rule-items > span {
  padding: 6px;
  grid-template-columns: 20px 1fr;
  gap: 5px;
}
.summary-rules-panel .summary-rule-items > span > i {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: ${T.cyan};
  background: ${T.cyanSoft};
  font-family: 'JetBrains Mono', monospace;
  font-size: 8px;
  font-style: normal;
}
.summary-rules-panel .summary-rule-items p { font-size: 9px; line-height: 1.22; }
.reward-stage-compact {
  width: 100%;
  min-height: 116px;
  margin: 0;
  padding: 12px 82px 11px 67px;
  border-radius: 17px;
  gap: 4px;
}
.reward-stage-compact .reward-medal {
  left: 11px;
  width: 44px;
  height: 44px;
  border-width: 3px;
  font-size: 19px;
}
.reward-stage-compact .reward-bit {
  right: 3px;
  bottom: 2px;
  width: 72px;
  height: 90px;
}
.reward-stage-compact h2 {
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: clamp(16px, 2.2vw, 21px);
  line-height: 1.05;
}
.rank-boost-overlay {
  position: fixed;
  inset: 0;
  z-index: 120;
  padding: 0;
  display: grid;
  place-items: center;
  overflow: hidden;
  overscroll-behavior: contain;
  background: rgba(8,13,24,.64);
  backdrop-filter: blur(2px) saturate(.78);
  animation: rank-overlay-life 3.8s ease both;
}
.rank-boost-card {
  position: relative;
  isolation: isolate;
  width: 100%;
  min-height: 100dvh;
  padding: 36px 24px;
  border: 0;
  border-radius: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  overflow: hidden;
  color: #FFFFFF;
  text-align: center;
  background: radial-gradient(circle at 50% 50%, rgba(255,214,80,.17), transparent 31%);
}
.rank-boost-card::after {
  content: '';
  position: absolute;
  z-index: 0;
  top: 50%;
  left: 50%;
  width: min(440px, 82vw);
  height: min(440px, 82vw);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,222,105,.17), transparent 68%);
  transform: translate(-50%, -50%);
  pointer-events: none;
}
.rank-boost-rays {
  position: absolute;
  z-index: 0;
  top: 50%;
  left: 50%;
  width: 160vmax;
  height: 160vmax;
  border-radius: 50%;
  opacity: .28;
  background: repeating-conic-gradient(
    from -4deg,
    rgba(255,218,91,.88) 0 8deg,
    transparent 8deg 20deg
  );
  transform: translate(-50%, -50%);
  animation:
    rank-rays-in .8s cubic-bezier(.16,1,.3,1) both,
    rank-rays 26s linear .8s infinite;
}
.rank-boost-medal {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 2;
  width: 112px;
  height: 112px;
  margin: 0;
  border: 6px solid rgba(255,255,255,.72);
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #653C00;
  background: linear-gradient(145deg, #FFF2A0, #FFC13B);
  box-shadow:
    0 0 0 13px rgba(255,255,255,.09),
    0 0 54px 10px rgba(255,204,63,.38),
    0 22px 38px -18px rgba(0,0,0,.7);
  font-size: 52px;
  animation: rank-medal-in 1s cubic-bezier(.16,1,.3,1) .15s both;
}
.rank-boost-card h2 {
  position: absolute;
  top: calc(50% + 82px);
  left: 50%;
  z-index: 2;
  width: min(680px, calc(100vw - 48px));
  margin: 0;
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: clamp(34px, 5vw, 58px);
  line-height: 1.02;
  text-shadow: 0 4px 24px rgba(0,0,0,.72);
  transform: translateX(-50%);
  animation: rank-title-in .7s ease .52s both;
}
.rank-boost-confetti { position: absolute; inset: 0; pointer-events: none; }
.rank-boost-confetti i {
  position: absolute;
  top: -20px;
  left: calc(3% + var(--boost-i) * 5.35%);
  width: 8px;
  height: 14px;
  border-radius: 2px;
  background: #FFE284;
  animation: rank-confetti 2.4s linear var(--boost-delay) infinite;
}
.rank-boost-confetti i:nth-child(3n+2) { background: #FF7050; }
.rank-boost-confetti i:nth-child(3n) { background: #77E1EA; }
@keyframes rank-overlay-life {
  0% { opacity: 0; }
  12%, 84% { opacity: 1; }
  100% { opacity: 0; }
}
@keyframes rank-medal-in {
  from { opacity: 0; transform: translate(-50%, -50%) scale(.25) rotate(-25deg); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1) rotate(0); }
}
@keyframes rank-title-in {
  from { opacity: 0; transform: translate(-50%, 14px); }
  to { opacity: 1; transform: translate(-50%, 0); }
}
@keyframes rank-rays-in {
  from { opacity: 0; transform: translate(-50%, -50%) scale(.5); }
  to { opacity: .28; transform: translate(-50%, -50%) scale(1); }
}
@keyframes rank-rays {
  from { transform: translate(-50%, -50%) rotate(0); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}
@keyframes rank-confetti {
  to { transform: translateY(470px) rotate(560deg); }
}
.next-mission {
  padding: 10px 13px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #FFFFFF;
  background: ${T.navy};
}
.next-mission span { color: #98E1E5; font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: .1em; }
.next-mission p { font-size: 12px; }
.preview-language {
  position: fixed;
  top: 9px;
  right: 9px;
  z-index: 30;
  display: flex;
  gap: 3px;
  padding: 3px;
  border-radius: 999px;
  background: rgba(255,255,255,.94);
  box-shadow: 0 8px 20px -14px rgba(${T.shadowBase},.6);
}
.preview-language button {
  padding: 4px 9px;
  border: 0;
  border-radius: 999px;
  color: ${T.ink2};
  background: transparent;
  cursor: pointer;
  font-size: 10px;
  font-weight: 900;
}
.preview-language .preview-active { color: #FFFFFF; background: ${T.accent}; }
@media (max-width: 639.98px) {
  .stage-header { padding-top: 60px; }
  .stage-content {
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior-x: none;
    overscroll-behavior-y: contain;
    scroll-behavior: smooth;
    scroll-padding-block: 12px;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .stage-content::-webkit-scrollbar { display: none; }
  .screen-type { display: none; }
  .stage-nav {
    min-height: calc(68px + env(safe-area-inset-bottom, 0px));
    padding-bottom: max(10px, env(safe-area-inset-bottom, 0px));
  }
  .h-title { font-size: 25px; }
  .options-grid, .options-three { grid-template-columns: 1fr; }
  .option { min-height: 50px; padding: 10px 12px; }
  .choice-proof-layer,
  .strategy-answer-stage .answer-proof-layer {
    grid-template-columns: 1fr;
    gap: 7px;
  }
  .bit-answer-comment { min-height: 68px; padding: 5px 9px 5px 4px; }
  .bit-answer-comment-figure { width: 47px; height: 59px; flex-basis: 47px; }
  .bit-answer-comment-copy > strong { font-size: 13px; }
  .bit-answer-comment-copy p { font-size: 9px; line-height: 1.3; }
  .data-scene { min-height: 164px; padding: 9px 91px 9px 10px; border-radius: 18px; }
  .data-console-head { min-height: 17px; margin-bottom: 4px; }
  .data-node-name { gap: 4px; font-size: 6px; letter-spacing: .07em; }
  .data-node-name > i { width: 6px; height: 6px; flex-basis: 6px; }
  .data-state { display: none; }
  .tower-screen { padding: 7px 8px 5px; border-radius: 11px; }
  .tower-label, .tower-label-row small { font-size: 6px; }
  .tower-screen .data-code { min-height: 43px; font-size: 27px; }
  .data-code-divider { height: 36px; }
  .data-scene-resolved .data-code-divider { height: 39px; margin: 0 5px; width: 3px; }
  .data-class-reveal { min-height: 10px; gap: 10px; }
  .data-class-reveal span { padding: 2px; font-size: 4.5px; }
  .data-code-scan { top: 17px; bottom: 12px; }
  .data-diagnostics { min-height: 20px; margin-top: 4px; gap: 3px; }
  .data-diagnostics > span { padding: 3px; gap: 3px; border-radius: 5px; font-size: 4.5px; }
  .data-diagnostics i { width: 4px; height: 4px; flex-basis: 4px; }
  .city-network { top: 8px; right: 2px; width: 87px; }
  .city-network > span { display: none; }
  .data-bit-callout { top: 61px; right: 4px; width: 83px; padding: 5px 3px; font-size: 6px; }
  .data-scene > .bit-avatar { right: 12px; bottom: -7px; width: 68px; height: 85px; }
  .explanation-screen { gap: 8px; }
  .explanation-screen .lead { font-size: 13px; line-height: 1.32; }
  .explanation-layout, .trainer-layout { grid-template-columns: 1fr; gap: 7px; }
  .explanation-visual, .trainer-visual, .explanation-copy, .trainer-task { padding: 7px; border-radius: 16px; }
  .class-animation, .class-animation-six-digit { min-height: 150px; gap: 6px; }
  .animated-number { gap: 4px; padding: 5px 0; }
  .animated-digit { width: 40px; height: 50px; border-radius: 11px; font-size: 23px; }
  .animated-divider.divider-visible { width: 4px; border-left-width: 2px; }
  .class-animation .place-cell { min-height: 44px; }
  .class-animation .place-cell span { font-size: 6px; }
  .class-animation .place-cell strong { font-size: 16px; }
  .explanation-copy .bit-coach { min-height: 76px; padding: 8px 10px; }
  .explanation-timeline { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 5px; }
  .explanation-timeline.timeline-count-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }
  .timeline-step { min-height: 43px; padding: 5px; gap: 4px; }
  .timeline-step > span { width: 20px; height: 20px; flex-basis: 20px; font-size: 8px; }
  .timeline-step strong { font-size: 8px; line-height: 1.12; }
  .explanation-finish-row { grid-template-columns: 1fr auto; gap: 5px; }
  .explanation-result { padding: 7px 8px; font-size: 10px; line-height: 1.25; }
  .explanation-replay { min-height: 36px; padding: 6px 8px; font-size: 10px; }
  .foundation-memory { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 5px; }
  .foundation-memory > div { min-height: 40px; padding: 5px; }
  .foundation-memory span { font-size: 7px; line-height: 1.18; letter-spacing: 0; }
  .foundation-recap { min-height: 225px; padding: 12px; gap: 8px; }
  .recap-frame { min-height: 125px; }
  .recap-shift-sequence { gap: 0; }
  .recap-shift-svg { height: 88px; }
  .recap-shift-readout { min-height: 20px; gap: 5px; }
  .recap-shift-readout span { min-width: 33px; font-size: 14px; }
  .recap-shift-note { font-size: 8px; }
  .recap-place-row { gap: 6px; }
  .recap-place-row > div { width: 94px; min-height: 88px; padding: 8px 5px; }
  .recap-place-row strong { font-size: 29px; }
  .recap-sum strong, .recap-sum b, .recap-shift span { padding: 9px 8px; font-size: 20px; }
  .recap-task-preview { gap: 8px; }
  .recap-task-preview > span { width: 78px; height: 88px; }
  .reasoning-compare { gap: 5px; }
  .reasoning-visual strong { padding: 8px 9px; font-size: 21px; }
  .reasoning-proof-layer, .rapid-proof-layer { grid-template-columns: 1fr; gap: 5px; }
  .reasoning-proof-layer .btn, .rapid-proof-layer .btn { min-height: 36px; padding: 6px 9px; justify-self: center; }
  .answer-proof { min-height: 48px; padding: 7px 9px; }
  .answer-proof strong { font-size: 12px; }
  .answer-proof small { font-size: 8px; }
  .finger-guide { grid-template-columns: auto 1fr; }
  .finger-count { grid-column: 1 / -1; justify-content: center; }
  .divider-workbench { padding: 13px 8px; }
  .divider-digit { width: 40px; height: 56px; font-size: 26px; }
  .divider-gap { width: 12px; margin: 0 1px; }
  .divider-outcome { min-height: 69px; }
  .digit-shift-svg { height: 154px; }
  .digit-shift-sequence > p { font-size: 9px; }
  .boundary-repair { min-height: 139px; padding: 7px; grid-template-columns: 58px minmax(0, 1fr); }
  .boundary-repair-bit .g1-char { width: 54px; height: 68px; }
  .boundary-repair-bit span { font-size: 6px; }
  .boundary-repair > svg { max-height: 126px; }
  .city-code-mission { min-height: 145px; padding: 8px; }
  .city-code-model-stage { min-height: 95px; }
  .city-clue-layer { gap: 3px; }
  .city-clue { min-height: 67px; padding: 4px 2px; border-radius: 9px; }
  .city-clue small { font-size: 5px; }
  .city-clue strong { font-size: 18px; }
  .city-code-result { min-height: 24px; font-size: 8px; }
  .strategy-decomposition { min-height: 132px; padding: 9px 7px; }
  .strategy-digit-row { min-height: 58px; gap: 3px; }
  .strategy-digit-row > span { width: 38px; height: 49px; border-radius: 10px; font-size: 22px; }
  .strategy-boundary { height: 48px; }
  .strategy-decomposition-step-1 .strategy-boundary,
  .strategy-decomposition-step-2 .strategy-boundary { margin: 0 3px; width: 3px; }
  .strategy-visual-note { min-height: 48px; font-size: 9px; }
  .shift-comparison { gap: 5px; }
  .shift-number { min-height: 68px; padding: 7px 4px; font-size: 20px; }
  .shift-arrow span { max-width: 62px; font-size: 7px; }
  .place-transfer-board { min-height: 128px; padding-top: 45px; }
  .place-transfer-source { height: 38px; }
  .transfer-digit { width: 32px; height: 36px; font-size: 18px; }
  .transfer-digit-placed { transform: translateY(76px) scale(.88); }
  .bit-coach { min-height: 84px; }
  .bit-coach-figure { width: 58px; height: 73px; flex-basis: 58px; }
  .g4-bit-reaction-figure { width: 54px; height: 68px; flex-basis: 54px; }
  .quick-number-card { min-height: 126px; padding: 12px 7px; }
  .quick-number-digits { gap: 3px; }
  .quick-number-digits strong { width: 42px; height: 54px; border-radius: 11px; font-size: 25px; }
  .quick-class-boundary { height: 50px; }
  .quick-number-card-solved .quick-class-boundary { margin: 0 3px; width: 3px; }
  .quick-number-proof { font-size: 8px; }
  .summary-stack { gap: 7px; }
  .reward-stage { min-height: 128px; padding: 12px 66px 11px 57px; border-radius: 18px; gap: 3px; }
  .reward-medal { left: 9px; width: 40px; height: 40px; border-width: 3px; font-size: 18px; }
  .reward-bit { right: 0; bottom: 1px; width: 66px; height: 83px; }
  .reward-stage h1 { font-size: 18px; }
  .reward-stage > p { display: none; }
  .reward-score { margin-top: 2px; padding: 3px 6px; gap: 4px; }
  .reward-score strong { font-size: 11px; }
  .reward-score span { font-size: 7px; }
  .place-cell { min-height: 72px; }
  .place-cell span { font-size: 7px; }
  .slot-overlay { margin-top: -42px; }
  .drop-slot { height: 35px; font-size: 20px; }
  .example-strip, .sequence-strip { gap: 5px; }
  .example-strip span, .sequence-strip span { padding: 9px 8px; font-size: 16px; }
  .value-comparison { gap: 7px; }
  .value-comparison strong { font-size: 18px; }
  .number-group { min-width: 96px; padding: 10px 12px; font-size: 22px; }
  .unlock-guide { gap: 5px; }
  .unlock-guide > b { font-size: 15px; }
  .unlock-guide-step { min-height: 52px; padding: 5px; grid-template-columns: 19px 22px 1fr; gap: 4px; }
  .unlock-guide-step > span { width: 19px; height: 19px; font-size: 8px; }
  .unlock-guide-step > i { font-size: 17px; }
  .unlock-guide-step p { font-size: 8px; line-height: 1.18; }
  .summary-action-layout {
    grid-template-columns: 1fr;
    grid-auto-rows: auto;
    align-items: start;
    gap: 6px;
  }
  .summary-rule-strip,
  .summary-card { height: auto; }
  .summary-rule-strip { min-height: 0; padding: 8px; }
  .summary-rule-strip h2 { margin: 0; font-size: 12px; }
  .summary-rule-heading { margin-bottom: 5px; gap: 5px; }
  .summary-rule-heading > span { min-width: 47px; padding: 4px 6px; font-size: 9px; }
  .summary-rule-items { gap: 4px; }
  .summary-rule-items > span { padding: 4px; grid-template-columns: 18px 1fr; gap: 4px; }
  .summary-rule-strip i { width: 18px; height: 18px; font-size: 7px; }
  .summary-rule-strip p { font-size: 8px; line-height: 1.18; }
  .summary-card { padding: 8px; }
  .summary-card h2 { margin-bottom: 5px; font-size: 12px; }
  .summary-question-kicker { font-size: 7px; }
  .summary-card .summary-question { margin-bottom: 3px; font-size: 12px; }
  .summary-question-stem { margin-bottom: 4px !important; font-size: 8px; }
  .reflection-options { grid-template-columns: 1fr; gap: 4px; }
  .reflection-option { min-height: 30px; padding: 4px 6px; font-size: 9px; }
  .reflection-option > span { width: 18px; height: 18px; flex-basis: 18px; font-size: 7px; }
  .final-mission-heading { padding: 8px 10px; border-radius: 13px; }
  .final-mission-heading > span { font-size: 7px; }
  .final-mission-heading h1 { margin-top: 2px; font-size: 18px; }
  .final-mission-heading p { font-size: 8px; line-height: 1.25; }
  .summary-final-layout { grid-template-columns: 1fr; gap: 6px; }
  .final-question-card { padding: 9px; }
  .final-question-card .summary-question-kicker { min-height: 23px; margin-bottom: 6px; font-size: 7px; }
  .final-question-card .summary-question { margin-bottom: 4px; font-size: 17px; line-height: 1.16; }
  .final-question-card .summary-question-stem { font-size: 9px; }
  .summary-support-column { gap: 6px; }
  .summary-rules-toggle { min-height: 52px; padding: 6px 8px; gap: 7px; }
  .summary-rules-toggle > span { min-width: 48px; padding: 6px; font-size: 9px; }
  .summary-rules-toggle strong { font-size: 11px; }
  .summary-rules-toggle small { font-size: 7px; }
  .summary-rules-toggle > i { font-size: 20px; }
  .summary-rules-open .summary-rules-panel { max-height: 210px; padding: 0 7px 7px; }
  .summary-rules-panel .summary-rule-items > span { padding: 4px; grid-template-columns: 18px 1fr; }
  .summary-rules-panel .summary-rule-items > span > i { width: 18px; height: 18px; font-size: 7px; }
  .summary-rules-panel .summary-rule-items p { font-size: 7px; }
  .reward-stage-compact {
    min-height: 88px;
    padding: 9px 59px 8px 51px;
    border-radius: 14px;
  }
  .reward-stage-compact .reward-medal { left: 8px; width: 34px; height: 34px; font-size: 14px; }
  .reward-stage-compact .reward-bit { width: 57px; height: 71px; }
  .reward-stage-compact h2 { margin: 0; font-size: 14px; }
  .rank-boost-overlay { padding: 0; }
  .rank-boost-card {
    min-height: 100dvh;
    padding: 24px 18px;
    border-radius: 0;
  }
  .rank-boost-medal {
    top: 50%;
    width: 88px;
    height: 88px;
    border-width: 5px;
    font-size: 40px;
  }
  .rank-boost-card h2 { top: calc(50% + 62px); font-size: 29px; }
  .feedback-card { font-size: 13px; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: .01ms !important;
  }
  .bit-avatar { transform: none !important; }
  .recap-shift-sequence { opacity: 1 !important; animation: none !important; }
  .recap-moving-seven { transform: translateX(-320px); animation: none !important; }
  .recap-born-zero { opacity: 1; transform: scale(1); animation: none !important; }
  .recap-readout-seven,
  .recap-readout-seventy { opacity: .2; transform: scale(1); animation: none !important; }
  .recap-readout-seven-hundred { opacity: 1; transform: scale(1.12); animation: none !important; }
  .digit-shift-solved .digit-shift-token { transform: translateX(-115px); animation: none !important; }
  .digit-shift-solved .digit-shift-new-zero,
  .digit-shift-solved .digit-shift-six-value {
    opacity: 1;
    transform: scale(1);
    animation: none !important;
  }
}
`;
