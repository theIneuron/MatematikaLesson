# Dars01 «Классы многозначных чисел» — CONTENT

> Этап pipeline: content RU + UZ + audio.  
> Сценарий: `Dars01_SCENARIO.md`, 16 экранов.  
> Мир: `SYUJET_4SINF.md`, блок 1 «Центр данных».  
> Диапазон урока: класс единиц и класс тысяч, числа до 999 999.  
> UZ-термины: `ko'p xonali son`, `xona`, `birlar sinfi`, `minglar sinfi`.

```javascript
const CONTENT = {
  // s0 — HOOK: Центр данных не понимает структуру адреса
  s0: {
    eyebrow: { ru: 'Новая миссия', uz: 'Yangi missiya' },
    topic: {
      ru: 'Урок 1. Классы многозначных чисел',
      uz: "1-dars. Ko'p xonali sonlar sinflari"
    },
    title: {
      ru: 'Центр данных не узнаёт адрес',
      uz: "Ma'lumotlar markazi manzilni taniy olmayapti"
    },
    lead: {
      ru: 'Bit получил код городского объекта, но видит только длинную цепочку цифр.',
      uz: "Bit shahar obyektining kodini oldi, lekin faqat uzun raqamlar qatorini ko'ryapti."
    },
    number_raw: '125407',
    question: {
      ru: 'Как сделать структуру числа видимой?',
      uz: "Sonning tuzilishini qanday ko'rsatamiz?"
    },
    opt0: { ru: 'Разделить цифры на удобные группы', uz: 'Raqamlarni qulay guruhlarga ajratish' },
    opt1: { ru: 'Переставить цифры по величине', uz: "Raqamlarni kattaligiga ko'ra joylashtirish" },
    opt2: { ru: 'Удалить лишние цифры', uz: 'Ortiqcha raqamlarni olib tashlash' },
    audio: {
      intro: {
        ru: [
          'Сегодня мы запускаем Центр данных умного города.',
          'Bit получил адрес сто двадцать пять тысяч четыреста семь, но система видит только длинную цепочку цифр.',
          'Нам нужен способ, который покажет структуру числа и не изменит сам адрес.',
          'С чего начнём?'
        ],
        uz: [
          "Bugun aqlli shaharning Ma'lumotlar markazini ishga tushiramiz.",
          "Bit bir yuz yigirma besh ming to'rt yuz yetti manzilini oldi, lekin tizim faqat uzun raqamlar qatorini ko'ryapti.",
          "Sonning o'zini o'zgartirmasdan uning tuzilishini ko'rsatadigan usul kerak.",
          "Nimadan boshlaymiz?"
        ]
      },
      on_correct: {
        ru: 'Группировка сохранит все цифры и покажет структуру. Проверим этот способ.',
        uz: "Guruhlash barcha raqamlarni saqlaydi va tuzilishni ko'rsatadi. Bu usulni tekshiramiz."
      },
      on_wrong: {
        ru: 'Так адрес изменится. Нужен способ сохранить каждую цифру на своём месте.',
        uz: "Bunday qilsak manzil o'zgaradi. Har bir raqamni o'z o'rnida saqlaydigan usul kerak."
      }
    }
  },

  // s1 — PREREQUISITE: трёхзначное число и разряды
  s1: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslaymiz' },
    bridge: {
      ru: 'Сначала проверим знакомые разряды.',
      uz: 'Avval tanish xonalarni tekshiramiz.'
    },
    question: {
      ru: 'Какое число состоит из 6 сотен, 4 десятков и 2 единиц?',
      uz: "Qaysi son 6 yuzlik, 4 o'nlik va 2 birlikdan iborat?"
    },
    opt0: '642',
    opt1: '624',
    opt2: '462',
    opt3: '6042',
    correctIndex: 0,
    correct_text: {
      ru: 'Верно. Сотни, десятки и единицы записаны слева направо: 642.',
      uz: "To'g'ri. Yuzlar, o'nlar va birlar chapdan o'ngga yoziladi: 642."
    },
    wrong_1: {
      ru: 'Здесь 2 десятка и 4 единицы. Посмотри, какая цифра должна стоять в десятках.',
      uz: "Bu sonda 2 o'nlik va 4 birlik bor. O'nlar xonasida qaysi raqam turishi kerakligini tekshiring."
    },
    wrong_2: {
      ru: 'Здесь 4 сотни и 6 десятков. Начни с количества сотен.',
      uz: "Bu sonda 4 yuzlik va 6 o'nlik bor. Avval yuzlar sonini tekshiring."
    },
    wrong_3: {
      ru: 'Получилось четырёхзначное число. В условии названы только сотни, десятки и единицы.',
      uz: "To'rt xonali son hosil bo'ldi. Shartda faqat yuzlar, o'nlar va birlar aytilgan."
    },
    audio: {
      intro: {
        ru: 'Вспомним разряды. Какое число состоит из шести сотен, четырёх десятков и двух единиц?',
        uz: "Xonalarni eslaymiz. Qaysi son olti yuzlik, to'rt o'nlik va ikki birlikdan iborat?"
      },
      on_correct: {
        ru: 'Верно. Шесть сотен, четыре десятка и две единицы дают шестьсот сорок два.',
        uz: "To'g'ri. Olti yuzlik, to'rt o'nlik va ikki birlik olti yuz qirq ikki sonini beradi."
      },
      on_wrong: {
        ru: 'Проверь порядок разрядов. Сначала сотни, затем десятки и единицы.',
        uz: "Xonalar tartibini tekshiring. Avval yuzlar, keyin o'nlar va birlar."
      }
    }
  },

  // s2 — COGNITIVE CONFLICT: знакомой таблицы недостаточно
  s2: {
    eyebrow: { ru: 'Проблема', uz: 'Muammo' },
    bridge: {
      ru: 'Знакомая таблица работает для трёх цифр. А здесь цифр больше.',
      uz: "Tanish jadval uchta raqam uchun ishlaydi. Bu yerda esa raqamlar ko'proq."
    },
    title: { ru: 'Куда поставить цифру 4?', uz: "4 raqamini qayerga qo'yamiz?" },
    number: '4 208',
    place_labels: {
      ru: ['сотни', 'десятки', 'единицы'],
      uz: ['yuzlar', "o'nlar", 'birlar']
    },
    question: {
      ru: 'Что нужно изменить в модели?',
      uz: "Modelda nimani o'zgartirish kerak?"
    },
    opt0: { ru: 'Добавить место для нового разряда', uz: "Yangi xona uchun joy qo'shish" },
    opt1: { ru: 'Записать 4 вместе с сотнями', uz: '4 ni yuzlar bilan birga yozish' },
    opt2: { ru: 'Отбросить 4', uz: '4 ni olib tashlash' },
    correctIndex: 0,
    correct_text: {
      ru: 'Верно. Число больше 999, поэтому нужен следующий разряд.',
      uz: "To'g'ri. Son 999 dan katta, shuning uchun keyingi xona kerak."
    },
    wrong_1: {
      ru: 'В одном разряде может стоять только одна цифра. Для 4 требуется отдельное место.',
      uz: "Bitta xonada faqat bitta raqam turadi. 4 uchun alohida joy kerak."
    },
    wrong_2: {
      ru: 'Если убрать 4, получится 208. Это уже другое число и другой адрес.',
      uz: "4 ni olib tashlasak, 208 hosil bo'ladi. Bu boshqa son va boshqa manzil."
    },
    audio: {
      intro: {
        ru: 'Попробуем поместить четыре тысячи двести восемь в знакомую таблицу. Цифре четыре не хватает места. Что изменим в модели?',
        uz: "To'rt ming ikki yuz sakkiz sonini tanish jadvalga joylaymiz. To'rt raqamiga joy yetmayapti. Modelda nimani o'zgartiramiz?"
      },
      on_correct: {
        ru: 'Верно. Для тысяч нужен новый разряд. Но длинная цепочка разрядов скоро станет неудобной.',
        uz: "To'g'ri. Minglar uchun yangi xona kerak. Lekin uzun xonalar qatori tezda noqulay bo'ladi."
      },
      on_wrong: {
        ru: 'Так значение числа изменится. Каждой цифре нужен свой разряд.',
        uz: "Bunday qilsak sonning qiymati o'zgaradi. Har bir raqamga o'z xonasi kerak."
      }
    }
  },

  // s3 — HYPOTHESIS: группировка справа по три
  s3: {
    eyebrow: { ru: 'Гипотеза', uz: 'Taxmin' },
    bridge: {
      ru: 'Вместо длинной цепочки найдём повторяющуюся структуру.',
      uz: "Uzun qator o'rniga takrorlanadigan tuzilishni topamiz."
    },
    title: { ru: 'Какое правило подходит всем числам?', uz: 'Qaysi qoida barcha sonlarga mos?' },
    examples: ['4 208', '36 015', '125 407'],
    opt0: {
      ru: 'Группировать справа по три цифры',
      uz: "O'ngdan boshlab raqamlarni uchtadan guruhlash"
    },
    opt1: {
      ru: 'Группировать слева по две цифры',
      uz: 'Chapdan boshlab raqamlarni ikkitadan guruhlash'
    },
    opt2: {
      ru: 'Отделять каждую цифру',
      uz: 'Har bir raqamni alohida ajratish'
    },
    correctIndex: 0,
    correct_text: {
      ru: 'Верно. Правая тройка всегда сохраняет знакомые единицы, десятки и сотни.',
      uz: "To'g'ri. O'ngdagi uchlik doimo tanish birlar, o'nlar va yuzlarni saqlaydi."
    },
    wrong_1: {
      ru: 'Левая группа получится разной при изменении длины числа. Начни с постоянного разряда единиц справа.',
      uz: "Son uzunligi o'zgarsa, chapdagi guruh ham o'zgaradi. O'ngdagi doimiy birlar xonasidan boshlang."
    },
    wrong_2: {
      ru: 'Отдельные цифры не показывают повторение сотен, десятков и единиц. Нужна группа с общей структурой.',
      uz: "Alohida raqamlar yuzlar, o'nlar va birlar takrorlanishini ko'rsatmaydi. Umumiy tuzilishga ega guruh kerak."
    },
    audio: {
      intro: {
        ru: 'Сравни три числа. Как разделить их одним правилом, чтобы справа всегда оставались единицы, десятки и сотни?',
        uz: "Uchta sonni solishtiring. O'ngda doimo birlar, o'nlar va yuzlar qolishi uchun ularni bitta qoida bilan qanday ajratamiz?"
      },
      on_correct: {
        ru: 'Верно. Начинаем справа и собираем цифры по три.',
        uz: "To'g'ri. O'ngdan boshlaymiz va raqamlarni uchtadan yig'amiz."
      },
      on_wrong: {
        ru: 'Проверь, где всегда находится разряд единиц.',
        uz: "Birlar xonasi doimo qayerda turishini tekshiring."
      }
    }
  },

  // s4 — EXPLORATION: ученик собирает 125 | 407
  s4: {
    eyebrow: { ru: 'Исследование', uz: 'Tadqiqot' },
    bridge: {
      ru: 'Проверим гипотезу на адресе Центра данных.',
      uz: "Taxminni Ma'lumotlar markazi manzilida tekshiramiz."
    },
    title: { ru: 'Собери две группы', uz: 'Ikki guruhni yig\'ing' },
    instruction: {
      ru: 'Начни справа. В каждой рамке должно быть не больше трёх цифр.',
      uz: "O'ngdan boshlang. Har bir ramkada uchtadan ko'p raqam bo'lmasin."
    },
    digits: ['1', '2', '5', '4', '0', '7'],
    target_left: '125',
    target_right: '407',
    left_label: { ru: 'новая группа', uz: 'yangi guruh' },
    right_label: { ru: 'знакомые разряды', uz: 'tanish xonalar' },
    hint_1: {
      ru: 'Найди крайнюю правую цифру. Это единицы.',
      uz: "Eng o'ngdagi raqamni toping. Bu birlar."
    },
    hint_2: {
      ru: 'Подсвечена правая тройка. Помести её в одну рамку.',
      uz: "O'ngdagi uchlik ajratildi. Uni bitta ramkaga joylashtiring."
    },
    done_text: {
      ru: 'Получилось 125 | 407. Правая группа сохранила сотни, десятки и единицы.',
      uz: "125 | 407 hosil bo'ldi. O'ngdagi guruh yuzlar, o'nlar va birlarni saqladi."
    },
    audio: {
      ru: [
        'Построй структуру адреса сто двадцать пять тысяч четыреста семь.',
        'Начинай с крайней правой цифры и собери справа группу из трёх цифр.',
        'Оставшиеся цифры образуют следующую группу. Перемести их или выбери цифру и нужное место.'
      ],
      uz: [
        "Bir yuz yigirma besh ming to'rt yuz yetti manzilining tuzilishini yarating.",
        "Eng o'ngdagi raqamdan boshlang va o'ng tomonda uchta raqamli guruh tuzing.",
        "Qolgan raqamlar keyingi guruhni hosil qiladi. Ularni ko'chiring yoki raqam bilan kerakli joyni tanlang."
      ]
    }
  },

  // s5 — WHY RIGHT: единицы как точка отсчёта
  s5: {
    eyebrow: { ru: 'Объясняем способ', uz: 'Usulni tushuntiramiz' },
    bridge: {
      ru: 'Группы получились. Теперь объясним, почему начали справа.',
      uz: "Guruhlar tayyor. Endi nima uchun o'ngdan boshlaganimizni tushuntiramiz."
    },
    sequence: ['7', '47', '407', '2 407'],
    question: {
      ru: 'Начинаем справа, потому что справа всегда находится разряд…',
      uz: "O'ngdan boshlaymiz, chunki o'ng tomonda doimo qaysi xona turadi?"
    },
    opt0: { ru: 'единиц', uz: 'birlar' },
    opt1: { ru: 'сотен', uz: 'yuzlar' },
    opt2: { ru: 'тысяч', uz: 'minglar' },
    correctIndex: 0,
    correct_text: {
      ru: 'Верно. Крайняя правая цифра всегда показывает единицы.',
      uz: "To'g'ri. Eng o'ngdagi raqam doimo birlarni ko'rsatadi."
    },
    wrong_1: {
      ru: 'Сотни находятся на третьем месте справа. Точка отсчёта — крайний правый разряд.',
      uz: "Yuzlar o'ngdan uchinchi joyda turadi. Sanash eng o'ngdagi xonadan boshlanadi."
    },
    wrong_2: {
      ru: 'Тысячи появляются левее первой тройки. Справа число начинается с меньшего разряда.',
      uz: "Minglar birinchi uchlikdan chapda paydo bo'ladi. Sonning o'ng tomoni kichik xonadan boshlanadi."
    },
    audio: {
      intro: {
        ru: 'Посмотри, как число растёт слева, а крайняя правая цифра остаётся единицами. Заверши объяснение нашего способа.',
        uz: "Son chap tomonga o'sishini, eng o'ngdagi raqam esa birlar bo'lib qolishini ko'ring. Usulimizning izohini yakunlang."
      },
      on_correct: {
        ru: 'Верно. Разряд единиц даёт постоянную точку отсчёта справа.',
        uz: "To'g'ri. Birlar xonasi o'ng tomonda doimiy boshlanish nuqtasini beradi."
      },
      on_wrong: {
        ru: 'Посмотри на крайнюю правую цифру каждого числа.',
        uz: "Har bir sonning eng o'ngdagi raqamiga qarang."
      }
    }
  },

  // s6 — SECOND MODEL: названия классов
  s6: {
    eyebrow: { ru: 'Новое понятие', uz: 'Yangi tushuncha' },
    bridge: {
      ru: 'У математических групп есть точные названия.',
      uz: 'Matematik guruhlarning aniq nomlari bor.'
    },
    title: { ru: 'Два класса числа', uz: 'Sonning ikki sinfi' },
    number_grouped: '125 | 407',
    left_group: '125',
    right_group: '407',
    class_units: { ru: 'класс единиц', uz: 'birlar sinfi' },
    class_thousands: { ru: 'класс тысяч', uz: 'minglar sinfi' },
    instruction: {
      ru: 'Соедини название с группой.',
      uz: 'Nomni guruh bilan moslang.'
    },
    hint: {
      ru: 'Правая группа содержит обычные единицы, десятки и сотни.',
      uz: "O'ngdagi guruh oddiy birlar, o'nlar va yuzlardan iborat."
    },
    done_text: {
      ru: '407 — класс единиц. 125 — класс тысяч.',
      uz: '407 — birlar sinfi. 125 — minglar sinfi.'
    },
    audio: {
      ru: [
        'Группа из трёх разрядов называется классом.',
        'Первая группа справа содержит единицы, десятки и сотни. Это класс единиц.',
        'Следующая группа содержит единицы тысяч, десятки тысяч и сотни тысяч. Это класс тысяч.',
        'Соедини каждое название с его группой.'
      ],
      uz: [
        "Uchta xonadan iborat guruh sinf deb ataladi.",
        "O'ngdagi birinchi guruh birlar, o'nlar va yuzlardan iborat. Bu birlar sinfi.",
        "Keyingi guruh bir minglar, o'n minglar va yuz minglardan iborat. Bu minglar sinfi.",
        "Har bir nomni uning guruhi bilan moslang."
      ]
    }
  },

  // s7 — POSITIONAL VALUE: одна цифра, разные места
  s7: {
    eyebrow: { ru: 'Исследование значения', uz: 'Qiymatni tadqiq qilamiz' },
    bridge: {
      ru: 'Класс показывает не только группу, но и значение цифры.',
      uz: "Sinf faqat guruhni emas, raqamning qiymatini ham ko'rsatadi."
    },
    title: {
      ru: 'Одинаковая цифра 5, разные значения',
      uz: 'Bir xil 5 raqami, turli qiymatlar'
    },
    rounds: [
      {
        number: '5 205',
        highlightedIndex: 0,
        question: {
          ru: 'Каково значение выделенной цифры?',
          uz: 'Ajratilgan raqamning qiymati qancha?'
        },
        options: ['5', '500', '5 000'],
        correctIndex: 2
      },
      {
        number: '205 005',
        highlightedIndex: 5,
        question: {
          ru: 'Каково значение выделенной цифры?',
          uz: 'Ajratilgan raqamning qiymati qancha?'
        },
        options: ['5', '5 000', '500 000'],
        correctIndex: 0
      }
    ],
    correct_text: {
      ru: 'Верно. Значение цифры определяется её разрядом и классом.',
      uz: "To'g'ri. Raqamning qiymati uning xonasi va sinfi bilan aniqlanadi."
    },
    wrong_text: {
      ru: 'Не считывай только саму цифру. Найди её столбец в таблице классов.',
      uz: "Faqat raqamning o'ziga qaramang. Sinflar jadvalida uning ustunini toping."
    },
    audio: {
      intro: {
        ru: 'Цифра пять встречается в двух числах. В каждом раунде определи её значение по месту в таблице.',
        uz: "Besh raqami ikkita sonda uchraydi. Har bir bosqichda jadvaldagi o'rniga qarab uning qiymatini aniqlang."
      },
      on_correct: {
        ru: 'Верно. Одна и та же цифра получает значение от своего разряда.',
        uz: "To'g'ri. Bir xil raqam o'z xonasiga qarab qiymat oladi."
      },
      on_wrong: {
        ru: 'Проверь разряд выделенной цифры.',
        uz: 'Ajratilgan raqamning xonasini tekshiring.'
      }
    }
  },

  // s8 — DISCOVERY: сформулировать зависимость
  s8: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    bridge: {
      ru: 'Сравним результаты двух раундов и сделаем вывод.',
      uz: "Ikki bosqich natijasini solishtirib, xulosa qilamiz."
    },
    title: { ru: 'Что определяет значение цифры?', uz: 'Raqam qiymatini nima aniqlaydi?' },
    statement_start: {
      ru: 'Значение цифры зависит от её…',
      uz: "Raqamning qiymati uning nimaga bog'liq?"
    },
    opt0: { ru: 'места в числе', uz: "sondagi o'rniga" },
    opt1: { ru: 'цвета на экране', uz: 'ekrandagi rangiga' },
    opt2: { ru: 'размера карточки', uz: 'kartochka hajmiga' },
    correctIndex: 0,
    correct_text: {
      ru: 'Верно. Место цифры определяет её разряд, класс и значение.',
      uz: "To'g'ri. Raqamning o'rni uning xonasi, sinfi va qiymatini aniqlaydi."
    },
    wrong_1: {
      ru: 'Цвет помогает увидеть модель, но не меняет число. Сравни позиции цифры 5.',
      uz: "Rang modelni ko'rishga yordam beradi, lekin sonni o'zgartirmaydi. 5 raqamining o'rinlarini solishtiring."
    },
    wrong_2: {
      ru: 'Размер карточки — только оформление. Значение менялось вместе с позицией цифры.',
      uz: "Kartochka hajmi faqat bezak. Qiymat raqamning o'rni bilan birga o'zgardi."
    },
    audio: {
      intro: {
        ru: 'В одном числе цифра пять означала пять тысяч, в другом только пять единиц. Заверши вывод.',
        uz: "Bir sonda besh raqami besh mingni, boshqa sonda esa faqat besh birlikni bildirdi. Xulosani yakunlang."
      },
      on_correct: {
        ru: 'Верно. Позиция цифры определяет её математическое значение.',
        uz: "To'g'ri. Raqamning o'rni uning matematik qiymatini aniqlaydi."
      },
      on_wrong: {
        ru: 'Вспомни, что изменилось между двумя числами.',
        uz: "Ikki son orasida nima o'zgarganini eslang."
      }
    }
  },

  // s9 — RULE ASSEMBLY
  s9: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    bridge: {
      ru: 'Назовём открытый способ точно.',
      uz: 'Topilgan usulni aniq ifodalaymiz.'
    },
    title: { ru: 'Собери правило', uz: "Qoidani yig'ing" },
    fragments: {
      ru: [
        'Многозначное число',
        'делим справа налево',
        'на классы по три разряда.',
        'Первый справа — класс единиц,',
        'следующий — класс тысяч.'
      ],
      uz: [
        "Ko'p xonali sonni",
        "o'ngdan chapga",
        "har birida uchtadan raqam bo'lgan sinflarga ajratamiz.",
        "O'ngdagi birinchi sinf birlar sinfi,",
        "keyingisi minglar sinfi."
      ]
    },
    correctOrder: [0, 1, 2, 3, 4],
    rule: {
      ru: 'Многозначное число делим справа налево на классы по три разряда. Первый справа — класс единиц, следующий — класс тысяч.',
      uz: "Ko'p xonali sonni o'ngdan chapga har birida uchtadan raqam bo'lgan sinflarga ajratamiz. O'ngdagi birinchi sinf birlar sinfi, keyingisi minglar sinfi."
    },
    audio: {
      ru: [
        'Мы уже проверили способ на нескольких числах.',
        'Собери части правила в правильном порядке.',
        'Многозначное число делим справа налево на классы по три разряда. Первый справа класс единиц, следующий класс тысяч.'
      ],
      uz: [
        "Usulni bir nechta sonda tekshirdik.",
        "Qoida qismlarini to'g'ri tartibda yig'ing.",
        "Ko'p xonali sonni o'ngdan chapga har birida uchtadan raqam bo'lgan sinflarga ajratamiz. O'ngdagi birinchi sinf birlar sinfi, keyingisi minglar sinfi."
      ]
    }
  },

  // s10 — GUIDED PRACTICE
  s10: {
    eyebrow: { ru: 'Решаем вместе', uz: 'Birga yechamiz' },
    bridge: {
      ru: 'Применим правило к новому городскому коду.',
      uz: "Qoidani yangi shahar kodiga qo'llaymiz."
    },
    title: { ru: 'Размести 348 216 по классам', uz: '348 216 ni sinflarga joylashtiring' },
    number_raw: '348216',
    steps: [
      {
        instruction: {
          ru: 'Выдели три цифры справа.',
          uz: "O'ngdagi uchta raqamni ajrating."
        },
        answer: '216'
      },
      {
        instruction: {
          ru: 'Помести оставшуюся группу в класс тысяч.',
          uz: 'Qolgan guruhni minglar sinfiga joylashtiring.'
        },
        answer: '348'
      }
    ],
    class_units: { ru: 'класс единиц', uz: 'birlar sinfi' },
    class_thousands: { ru: 'класс тысяч', uz: 'minglar sinfi' },
    hint: {
      ru: 'Первый шаг всегда начинается с крайней правой цифры.',
      uz: "Birinchi qadam doimo eng o'ngdagi raqamdan boshlanadi."
    },
    done_text: {
      ru: '348 тысяч и 216 единиц образуют число 348 216.',
      uz: '348 ming va 216 bir 348 216 sonini hosil qiladi.'
    },
    audio: {
      ru: [
        'Теперь работаем вместе. Начни с правой стороны и выдели три цифры.',
        'Двести шестнадцать это класс единиц.',
        'Оставшиеся триста сорок восемь занимают класс тысяч.'
      ],
      uz: [
        "Endi birga ishlaymiz. O'ng tomondan boshlang va uchta raqamni ajrating.",
        "Ikki yuz o'n olti birlar sinfidir.",
        "Qolgan uch yuz qirq sakkiz minglar sinfini egallaydi."
      ]
    }
  },

  // s11 — GUIDED PRACTICE WITH ZERO
  s11: {
    eyebrow: { ru: 'Теперь с подсказкой', uz: 'Endi ishora bilan' },
    bridge: {
      ru: 'Граница классов видна, но цифры размещаешь ты.',
      uz: "Sinflar chegarasi ko'rinadi, raqamlarni esa siz joylashtirasiz."
    },
    title: { ru: 'Размести число 70 509', uz: '70 509 sonini joylashtiring' },
    number_raw: '70509',
    expectedCells: ['', '7', '0', '5', '0', '9'],
    instruction: {
      ru: 'Заполни таблицу, не теряя нули.',
      uz: "Nollarni yo'qotmasdan jadvalni to'ldiring."
    },
    hint_1: {
      ru: 'Начни с 9 в разряде единиц и двигайся влево.',
      uz: 'Birlar xonasidagi 9 dan boshlang va chapga yuring.'
    },
    hint_2: {
      ru: 'Ноль занимает разряд. Оставь его между соседними цифрами.',
      uz: "Nol xonani egallaydi. Uni qo'shni raqamlar orasida qoldiring."
    },
    wrong_zero: {
      ru: 'Ноль пропущен, поэтому цифры сдвинулись. Верни ноль в его разряд и повтори.',
      uz: "Nol tushib qoldi, shuning uchun raqamlar surildi. Nolni o'z xonasiga qaytaring va takrorlang."
    },
    done_text: {
      ru: 'Верно. 70 — класс тысяч, 509 — класс единиц. Оба нуля сохранили свои разряды.',
      uz: "To'g'ri. 70 — minglar sinfi, 509 — birlar sinfi. Ikkala nol ham o'z xonasini saqladi."
    },
    audio: {
      intro: {
        ru: 'Размести семьдесят тысяч пятьсот девять в таблице классов. Начни справа и сохрани каждый ноль.',
        uz: "Yetmish ming besh yuz to'qqiz sonini sinflar jadvaliga joylashtiring. O'ngdan boshlang va har bir nolni saqlang."
      },
      on_correct: {
        ru: 'Верно. Нули остались в своих разрядах, поэтому значение числа не изменилось.',
        uz: "To'g'ri. Nollar o'z xonalarida qoldi, shuning uchun sonning qiymati o'zgarmadi."
      },
      on_wrong: {
        ru: 'Проверь каждый разряд справа налево. Ноль тоже занимает место.',
        uz: "Har bir xonani o'ngdan chapga tekshiring. Nol ham joy egallaydi."
      }
    }
  },

  // s12 — STRATEGY CHOICE
  s12: {
    eyebrow: { ru: 'Выбор стратегии', uz: 'Strategiyani tanlash' },
    bridge: {
      ru: 'Не всегда нужно разбирать все шесть разрядов.',
      uz: "Har doim oltita xonaning barchasini tahlil qilish shart emas."
    },
    question: {
      ru: 'Как быстрее определить, сколько тысяч в числе 482 731?',
      uz: '482 731 sonida necha ming borligini qanday tez aniqlaymiz?'
    },
    opt0: {
      ru: 'Посмотреть на группу класса тысяч',
      uz: 'Minglar sinfi guruhiga qarash'
    },
    opt1: {
      ru: 'Сложить все цифры',
      uz: "Barcha raqamlarni qo'shish"
    },
    opt2: {
      ru: 'Посмотреть только на последнюю цифру',
      uz: 'Faqat oxirgi raqamga qarash'
    },
    correctIndex: 0,
    followup_question: {
      ru: 'Сколько полных тысяч показывает группа?',
      uz: "Guruh nechta to'liq mingni ko'rsatadi?"
    },
    followup_options: ['482', '731', '1213'],
    followupCorrectIndex: 0,
    correct_text: {
      ru: 'Верно. Левая группа 482 показывает 482 полные тысячи. Это самый прямой способ.',
      uz: "To'g'ri. Chapdagi 482 guruhi 482 ta to'liq mingni ko'rsatadi. Bu eng to'g'ri usul."
    },
    wrong_1: {
      ru: 'Сумма цифр показывает другое свойство числа. Чтобы найти тысячи, посмотри на соответствующий класс.',
      uz: "Raqamlar yig'indisi sonning boshqa xususiyatini ko'rsatadi. Minglarni topish uchun tegishli sinfga qarang."
    },
    wrong_2: {
      ru: 'Последняя цифра показывает единицы. Тысячи находятся в левой группе.',
      uz: "Oxirgi raqam birlarni ko'rsatadi. Minglar chapdagi guruhda turadi."
    },
    audio: {
      intro: {
        ru: 'Нужно быстро определить количество полных тысяч в числе четыреста восемьдесят две тысячи семьсот тридцать один. Выбери самый прямой способ.',
        uz: "To'rt yuz sakson ikki ming yetti yuz o'ttiz bir sonidagi to'liq minglar sonini tez aniqlash kerak. Eng to'g'ri usulni tanlang."
      },
      on_correct: {
        ru: 'Верно. Класс тысяч сразу показывает четыреста восемьдесят две тысячи.',
        uz: "To'g'ri. Minglar sinfi darhol to'rt yuz sakson ikki mingni ko'rsatadi."
      },
      on_wrong: {
        ru: 'Этот способ не показывает количество тысяч. Найди нужный класс.',
        uz: "Bu usul minglar sonini ko'rsatmaydi. Kerakli sinfni toping."
      }
    }
  },

  // s13 — ERROR ANALYSIS
  s13: {
    eyebrow: { ru: 'Проверяем Bit', uz: 'Bitni tekshiramiz' },
    bridge: {
      ru: 'Bit применил правило, но поставил разделители слишком рано.',
      uz: "Bit qoidani qo'lladi, lekin ajratgichlarni noto'g'ri joylashtirdi."
    },
    title: { ru: 'Где первый неверный разделитель?', uz: "Birinchi noto'g'ri ajratgich qayerda?" },
    original: '52 416',
    bitVersion: '5 | 241 | 6',
    correctVersion: '52 | 416',
    instruction: {
      ru: 'Нажми неправильную границу, затем собери верную запись.',
      uz: "Noto'g'ri chegarani bosing, keyin to'g'ri yozuvni yig'ing."
    },
    optionBoundaries: ['5 | 2416', '52 | 416', '524 | 16'],
    correctIndex: 1,
    correct_text: {
      ru: 'Верно. Справа сначала отделяются три цифры 416. Слева может остаться одна, две или три цифры.',
      uz: "To'g'ri. O'ngdan avval 416 uchligi ajratiladi. Chapda bir, ikki yoki uchta raqam qolishi mumkin."
    },
    wrong_0: {
      ru: 'Справа остались четыре цифры, поэтому класс единиц получился слишком длинным. Отсчитай ровно три.',
      uz: "O'ngda to'rtta raqam qoldi, shuning uchun birlar sinfi juda uzun bo'ldi. Roppa-rosa uchta raqamni sanang."
    },
    wrong_2: {
      ru: 'Справа остались только две цифры. Класс единиц должен содержать три позиции: сотни, десятки и единицы.',
      uz: "O'ngda faqat ikkita raqam qoldi. Birlar sinfida uchta o'rin bo'lishi kerak: yuzlar, o'nlar va birlar."
    },
    audio: {
      intro: {
        ru: 'Bit разделил число пятьдесят две тысячи четыреста шестнадцать неправильно. Выбери верную границу классов.',
        uz: "Bit ellik ikki ming to'rt yuz o'n olti sonini noto'g'ri ajratdi. Sinflarning to'g'ri chegarasini tanlang."
      },
      on_correct: {
        ru: 'Верно. Сначала справа отделили три цифры. Левая группа может быть короче.',
        uz: "To'g'ri. Avval o'ngdan uchta raqam ajratildi. Chapdagi guruh qisqaroq bo'lishi mumkin."
      },
      on_wrong: {
        ru: 'Проверь количество цифр в правой группе.',
        uz: "O'ngdagi guruhdagi raqamlar sonini tekshiring."
      }
    }
  },

  // s14 — LIFE CASE + FINAL DIAGNOSTIC
  s14: {
    eyebrow: { ru: 'Решение для города', uz: 'Shahar uchun yechim' },
    bridge: {
      ru: 'Осталось направить сообщение в правильный городской объект.',
      uz: "Xabarni to'g'ri shahar obyektiga yuborish qoldi."
    },
    title: { ru: 'Какой код восстановила система?', uz: 'Tizim qaysi kodni tikladi?' },
    model: {
      ru: '1 сотня тысяч, 8 десятков тысяч, 0 единиц тысяч, 2 сотни, 4 десятка, 0 единиц',
      uz: "1 yuz minglik, 8 o'n minglik, 0 minglik, 2 yuzlik, 4 o'nlik, 0 birlik"
    },
    objects: [
      { name: { ru: 'Школа', uz: 'Maktab' }, code: '18 204' },
      { name: { ru: 'Лаборатория', uz: 'Laboratoriya' }, code: '108 024' },
      { name: { ru: 'Станция', uz: 'Stansiya' }, code: '180 240' }
    ],
    correctIndex: 2,
    correct_text: {
      ru: 'Верно. В таблице получается 180 | 240. Это код станции 180 240.',
      uz: "To'g'ri. Jadvalda 180 | 240 hosil bo'ladi. Bu 180 240 stansiya kodi."
    },
    wrong_0: {
      ru: 'В этом коде нет разряда сотен тысяч. Начни модель с 1 сотни тысяч.',
      uz: "Bu kodda yuz minglar xonasi yo'q. Modelni 1 yuz minglikdan boshlang."
    },
    wrong_1: {
      ru: 'Здесь цифры 8 и 2 стоят в других разрядах. Размести модель по шести столбцам.',
      uz: "Bu yerda 8 va 2 raqamlari boshqa xonalarda turibdi. Modelni oltita ustunga joylashtiring."
    },
    fact_badge: { ru: 'Математика вокруг нас', uz: 'Atrofimizdagi matematika' },
    fact_text: {
      ru: 'Коды и номера читают по группам, чтобы человеку было легче увидеть их структуру и проверить запись.',
      uz: "Kodlar va raqamlar guruhlab o'qiladi. Bu ularning tuzilishini ko'rish va yozuvni tekshirishni osonlashtiradi."
    },
    fact_audio: {
      ru: 'Длинные коды часто делят на группы. Так человеку легче увидеть структуру и заметить пропущенную цифру.',
      uz: "Uzun kodlar ko'pincha guruhlarga ajratiladi. Shunda tuzilishni ko'rish va tushib qolgan raqamni aniqlash osonroq bo'ladi."
    },
    audio: {
      intro: {
        ru: 'Система восстановила код по разрядам. Одна сотня тысяч, восемь десятков тысяч, ноль единиц тысяч, две сотни, четыре десятка и ноль единиц. Выбери объект с этим кодом.',
        uz: "Tizim kodni xonalar bo'yicha tikladi. Bir yuz minglik, sakkiz o'n minglik, nol minglik, ikki yuzlik, to'rt o'nlik va nol birlik. Shu kodli obyektni tanlang."
      },
      on_correct: {
        ru: 'Верно. Получилось сто восемьдесят тысяч двести сорок. Сообщение направлено на станцию.',
        uz: "To'g'ri. Bir yuz sakson ming ikki yuz qirq hosil bo'ldi. Xabar stansiyaga yuborildi."
      },
      on_wrong: {
        ru: 'Проверь положение каждой цифры в таблице классов.',
        uz: "Har bir raqamning sinflar jadvalidagi o'rnini tekshiring."
      }
    }
  },

  // s15 — SUMMARY + REFLECTION
  s15: {
    eyebrow: { ru: 'Миссия завершена', uz: 'Missiya yakunlandi' },
    title: { ru: 'Центр данных запущен', uz: "Ma'lumotlar markazi ishga tushdi" },
    hook_close: {
      ru: 'Система видит 125 | 407 как два класса и больше не путает городские адреса.',
      uz: "Tizim 125 | 407 ni ikkita sinf sifatida ko'radi va shahar manzillarini endi adashtirmaydi."
    },
    reflection_start: {
      ru: 'Чтобы увидеть классы числа, я сначала…',
      uz: "Sonning sinflarini ko'rish uchun avval…"
    },
    reflection_options: [
      {
        ru: 'делю цифры справа налево по три',
        uz: "raqamlarni o'ngdan chapga uchtadan ajrataman"
      },
      {
        ru: 'складываю все цифры',
        uz: "barcha raqamlarni qo'shaman"
      },
      {
        ru: 'переставляю цифры по величине',
        uz: "raqamlarni kattaligiga ko'ra joylashtiraman"
      }
    ],
    reflectionCorrectIndex: 0,
    main_label: { ru: 'Главное', uz: 'Asosiysi' },
    main_1: {
      ru: 'Класс — группа из трёх разрядов.',
      uz: 'Sinf uchta xonadan iborat guruhdir.'
    },
    main_2: {
      ru: 'Справа находится класс единиц, слева от него — класс тысяч.',
      uz: "O'ngda birlar sinfi, uning chapida minglar sinfi turadi."
    },
    main_3: {
      ru: 'Место цифры определяет её значение.',
      uz: "Raqamning o'rni uning qiymatini aniqlaydi."
    },
    conn_label_next: { ru: 'Следующая задача', uz: 'Keyingi vazifa' },
    conn_next: {
      ru: 'Научить систему правильно читать и записывать многозначные числа.',
      uz: "Tizimga ko'p xonali sonlarni to'g'ri o'qish va yozishni o'rgatish."
    },
    audio: {
      ru: [
        'Центр данных запущен. Теперь система разделяет адреса на классы и сохраняет значение каждой цифры.',
        'Чтобы увидеть классы, начинаем справа и делим цифры на группы по три.',
        'Справа находится класс единиц, а слева от него класс тысяч.',
        'На следующем уроке научим систему правильно читать и записывать такие числа.'
      ],
      uz: [
        "Ma'lumotlar markazi ishga tushdi. Endi tizim manzillarni sinflarga ajratadi va har bir raqamning qiymatini saqlaydi.",
        "Sinflarni ko'rish uchun o'ngdan boshlaymiz va raqamlarni uchtadan guruhlarga ajratamiz.",
        "O'ngda birlar sinfi, uning chapida esa minglar sinfi turadi.",
        "Keyingi darsda tizimga bunday sonlarni to'g'ri o'qish va yozishni o'rgatamiz."
      ]
    }
  }
};

const BRIDGES = {
  s1: {
    ru: 'Перед работой с длинным адресом вспомним знакомые разряды.',
    uz: 'Uzun manzil bilan ishlashdan oldin tanish xonalarni eslaymiz.'
  },
  s2: {
    ru: 'Трёхзначное число поместилось. Теперь расширим модель.',
    uz: "Uch xonali son joylashdi. Endi modelni kengaytiramiz."
  },
  s3: {
    ru: 'Новый разряд добавили. Пора найти удобную общую структуру.',
    uz: 'Yangi xona qo\'shildi. Endi qulay umumiy tuzilishni topamiz.'
  },
  s4: {
    ru: 'Гипотеза есть. Проверим её действием.',
    uz: 'Taxmin bor. Uni amalda tekshiramiz.'
  },
  s5: {
    ru: 'Группы собраны. Объясним точку отсчёта.',
    uz: 'Guruhlar yig\'ildi. Boshlanish nuqtasini tushuntiramiz.'
  },
  s6: {
    ru: 'Теперь дадим группам математические названия.',
    uz: 'Endi guruhlarga matematik nom beramiz.'
  },
  s7: {
    ru: 'Классы названы. Посмотрим, как они меняют значение цифры.',
    uz: 'Sinflar nomlandi. Ular raqam qiymatini qanday o\'zgartirishini ko\'ramiz.'
  },
  s8: {
    ru: 'Два результата дают общий вывод.',
    uz: 'Ikki natija umumiy xulosa beradi.'
  },
  s9: {
    ru: 'Открытие готово. Соберём точное правило.',
    uz: 'Kashfiyot tayyor. Aniq qoidani yig\'amiz.'
  },
  s10: {
    ru: 'Правило применим вместе.',
    uz: 'Qoidani birga qo\'llaymiz.'
  },
  s11: {
    ru: 'Теперь опоры меньше. Важно сохранить нули.',
    uz: 'Endi tayanch kamroq. Nollarni saqlash muhim.'
  },
  s12: {
    ru: 'Структуру видим. Выберем самый удобный способ.',
    uz: 'Tuzilishni ko\'rdik. Eng qulay usulni tanlaymiz.'
  },
  s13: {
    ru: 'Стратегия выбрана. Проверим чужое решение.',
    uz: 'Strategiya tanlandi. Boshqa yechimni tekshiramiz.'
  },
  s14: {
    ru: 'Ошибку исправили. Теперь решим городскую задачу.',
    uz: 'Xatoni tuzatdik. Endi shahar vazifasini yechamiz.'
  },
  s15: {
    ru: 'Код восстановлен. Зафиксируем найденный способ.',
    uz: 'Kod tiklandi. Topilgan usulni mustahkamlaymiz.'
  }
};
```

## Заметки методисту

1. Узбекские термины `ko'p xonali son`, `xona`, `birlar sinfi`,
   `minglar sinfi` взяты из действующего `src/components/grade5/Dars01.jsx`.
   Для 4-го класса они всё равно имеют статус draft и требуют проверки узбекским
   методистом математики.
2. Урок намеренно не учит полному чтению всех многозначных чисел: это тема урока 2.
   В уроке 1 чтение используется только в аудио и задачах как поддержка модели.
3. Итоговая диагностика встроена в городскую задачу s14 и проверяет переход
   `словесная разрядная модель → таблица → код`.
4. Ноль рассматривается как типичная ошибка внутри s11 и s14, но отдельное правило
   о внутренних и пустых разрядах будет развиваться в уроках 2–3.
5. Аудио написано отдельно от экранных текстов. В нём числа произносятся словами,
   математические символы и визуальные разделители не озвучиваются.
