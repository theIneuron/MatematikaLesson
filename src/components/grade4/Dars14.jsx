// ============================================================================
// 4-SINF · Dars 14 · Harakatga doir masalalar
//
// Manba: N. U. Bikbayeva, "Matematika. 4-sinf", 5-nashr 2020, 122-125-betlar.
//   122-bet: velosipedchi 48 km ni 4 soatda, tezlik tushunchasi va km/h yozuvi;
//   123-bet: "Harakat tezligini topish uchun masofani vaqtga bo'lish kerak",
//            vertolyot 460 km 2 soatda, tezlik-vaqt-masofa jadvali;
//   124-bet: "Masofani topish uchun tezlikni vaqtga ko'paytirish kerak";
//   125-bet: yo'lovchi 90 km, 45 km/h — vaqtni topish.
//
// Syujet: Lumo City tramvay liniyasi (SYUJET_4SINF.md, 2-blok).
// Baholanadigan oltita ekran: s2, s4, s6, s8, s10, s13.
// ============================================================================
import {
  ChoiceScreen, FitSvg, KIT_STYLES, RevealScreen, SummaryScreen, T, TableFill,
  TheoryLessonRoot, assertScreenTypeLabels, useT,
} from './kit/index.js';

const LESSON_META = {
  lessonId: 'motion-4-14-v2',
  slug: 'dars14-harakat-masalalari',
  lessonTitle: {
    uz: '14-dars. Harakatga doir masalalar',
    ru: 'Урок 14. Задачи на движение',
    en: 'Lesson 14. Motion problems',
  },
  skillTags: ['speed', 'distance', 'time', 'units', 'model_of_problem'],
};

const SCREEN_META = [
  { id: 's0', type: 'hook', scored: false, scope: 'hook' },
  { id: 's1', type: 'exploration', scored: false, scope: null },
  { id: 's2', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 's3', type: 'exploration', scored: false, scope: null },
  { id: 's4', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 's5', type: 'exploration', scored: false, scope: null },
  { id: 's6', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 's7', type: 'exploration', scored: false, scope: null },
  { id: 's8', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 's9', type: 'exploration', scored: false, scope: null },
  { id: 's10', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 's11', type: 'rule', scored: false, scope: null },
  { id: 's12', type: 'strategy', scored: false, scope: null },
  { id: 's13', type: 'error-analysis', scored: true, scope: 'module-mikro' },
  { id: 's14', type: 'life-case', scored: false, scope: 'final' },
  { id: 's15', type: 'summary', scored: false, scope: null },
];

const TOTAL_SCREENS = SCREEN_META.length;
assertScreenTypeLabels(SCREEN_META, LESSON_META.lessonId);

const FRAME_COUNTS = [5, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 3, 3, 3];

const COLUMNS = [
  { uz: 'Tezlik', ru: 'Скорость', en: 'Speed' },
  { uz: 'Vaqt', ru: 'Время', en: 'Time' },
  { uz: 'Masofa', ru: 'Расстояние', en: 'Distance' },
];

const CONTENT = {
  s0: {
    eyebrow: { uz: 'Tramvay liniyasi', ru: 'Трамвайная линия', en: 'The tram line' },
    title: {
      uz: 'Tramvay qanday tezlik bilan yurdi?',
      ru: 'С какой скоростью шёл трамвай?',
      en: 'How fast was the tram going?',
    },
    question: {
      uz: '48 km yo\'lni 4 soatda bosib o\'tdi. Qaysi amal tezlikni beradi?',
      ru: 'Он прошёл 48 км за 4 часа. Какое действие даёт скорость?',
      en: 'It covered 48 km in 4 hours. Which action gives the speed?',
    },
    options: [
      { uz: '48 : 4', ru: '48 : 4', en: '48 : 4' },
      { uz: '48 × 4', ru: '48 × 4', en: '48 × 4' },
      { uz: '48 − 4', ru: '48 − 4', en: '48 − 4' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Butun masofani soatlar soniga bo'lsak, bir soatda bosilgan yo'l chiqadi. Bu tezlik.",
      ru: 'Верно. Если разделить всё расстояние на число часов, получится путь за один час. Это скорость.',
      en: 'Correct. Dividing the whole distance by the number of hours gives the path in one hour. That is the speed.',
    },
    wrong: [
      null,
      {
        uz: "Ko'paytirish butun masofani kattalashtiradi. Bizga esa bir soatdagi yo'l kerak.",
        ru: 'Умножение увеличивает всё расстояние. А нам нужен путь за один час.',
        en: 'Multiplying makes the whole distance bigger. But we need the path in one hour.',
      },
      {
        uz: "Ayirishda kilometr va soat aralashib ketadi. Har xil kattaliklarni ayirib bo'lmaydi.",
        ru: 'При вычитании смешиваются километры и часы. Разные величины вычитать нельзя.',
        en: 'Subtracting mixes kilometres and hours. Different quantities cannot be subtracted.',
      },
    ],
    bitFeedback: true,
    audio: {
      intro: {
        uz: [
          "Salom! Lumo City tramvaylari nihoyat yo'lga chiqdi.",
          "Birinchi tramvay qirq sakkiz kilometr yo'lni to'rt soatda bosib o'tdi. U bir xil tezlik bilan yurdi.",
          "Boshqaruv markazi bir soatda qancha yo'l bosilganini bilmoqchi.",
          "Bit uchta amalni taklif qildi, lekin qaysi biri to'g'ri ekaniga ishonchi komil emas.",
          "Sizningcha qaysi amal tezlikni beradi? Javobni tanlang.",
        ],
        ru: [
          'Привет! Трамваи Lumo City наконец вышли на линию.',
          'Первый трамвай прошёл сорок восемь километров за четыре часа. Он двигался с одинаковой скоростью.',
          'Центр управления хочет знать, сколько пути пройдено за один час.',
          'Bit предложил три действия, но не уверен, какое из них верное.',
          'Как ты думаешь, какое действие даёт скорость? Выбери ответ.',
        ],
        en: [
          'Hello! The Lumo City trams have finally set off.',
          'The first tram covered forty-eight kilometres in four hours. It moved at a steady speed.',
          'The control centre wants to know how much of the path was covered in one hour.',
          'Bit suggested three actions but is not sure which one is right.',
          'Which action do you think gives the speed? Choose your answer.',
        ],
      },
    },
  },

  s1: {
    eyebrow: { uz: 'Uchta kattalik', ru: 'Три величины', en: 'Three quantities' },
    title: {
      uz: 'Masofa, vaqt va tezlik',
      ru: 'Расстояние, время и скорость',
      en: 'Distance, time and speed',
    },
    lead: {
      uz: "Har bir kattalikning o'z birligi bor: kilometr, soat va kilometr soatiga.",
      ru: 'У каждой величины своя единица: километр, час и километр в час.',
      en: 'Each quantity has its own unit: the kilometre, the hour and the kilometre per hour.',
    },
    note: {
      uz: "Tezlik birligi qisqartirib km/h deb yoziladi.",
      ru: 'Единица скорости записывается сокращённо: км/ч.',
      en: 'The unit of speed is written in short as km/h.',
    },
    audio: {
      intro: {
        uz: [
          "Harakat haqidagi har bir masalada uchta kattalik bo'ladi.",
          "Qirq sakkiz kilometr bu tramvay bosib o'tgan masofa.",
          "To'rt soat bu tramvay sarflagan vaqt.",
          "Soatiga o'n ikki kilometr bu tramvayning tezligi. Qisqartirib kilometr soatiga deb yoziladi.",
        ],
        ru: [
          'В каждой задаче про движение есть три величины.',
          'Сорок восемь километров это расстояние, которое прошёл трамвай.',
          'Четыре часа это время, которое трамвай затратил.',
          'Двенадцать километров в час это скорость трамвая. Сокращённо пишут километр в час.',
        ],
        en: [
          'Every problem about motion has three quantities.',
          'Forty-eight kilometres is the distance the tram covered.',
          'Four hours is the time the tram spent.',
          'Twelve kilometres per hour is the speed of the tram. In short it is written as kilometres per hour.',
        ],
      },
    },
  },

  s2: {
    eyebrow: { uz: 'Jadvalga yozamiz', ru: 'Записываем в таблицу', en: 'Writing into the table' },
    title: { uz: 'Tramvay: 48 km, 4 soat', ru: 'Трамвай: 48 км, 4 часа', en: 'The tram: 48 km, 4 hours' },
    question: {
      uz: "Jadvaldagi bo'sh katakka qaysi qiymat tushadi?",
      ru: 'Какое значение попадает в пустую клетку таблицы?',
      en: 'Which value goes into the empty cell of the table?',
    },
    columns: COLUMNS,
    rows: [[null, '4 h', '48 km']],
    chips: [
      { uz: '12 km/h', ru: '12 км/ч', en: '12 km/h' },
      { uz: '192 km/h', ru: '192 км/ч', en: '192 km/h' },
      { uz: '44 km/h', ru: '44 км/ч', en: '44 km/h' },
    ],
    correctChip: 0,
    correctText: {
      uz: "To'g'ri. Qirq sakkizni to'rtga bo'lsak, o'n ikki chiqadi. Tramvay soatiga o'n ikki kilometr yuradi.",
      ru: 'Верно. Сорок восемь разделить на четыре будет двенадцать. Трамвай проходит двенадцать километров в час.',
      en: 'Correct. Forty-eight divided by four is twelve. The tram covers twelve kilometres per hour.',
    },
    wrong: [
      null,
      {
        uz: "Bu ko'paytirish natijasi. Ko'paytirsak, tezlik emas, ancha katta masofa chiqadi.",
        ru: 'Это результат умножения. При умножении получается не скорость, а гораздо большее расстояние.',
        en: 'This is the result of multiplying. Multiplying gives not the speed but a far larger distance.',
      },
      {
        uz: "Bu ayirish natijasi. Kilometrdan soatni ayirib bo'lmaydi, kattaliklar har xil.",
        ru: 'Это результат вычитания. Из километров нельзя вычесть часы, величины разные.',
        en: 'This is the result of subtracting. Hours cannot be taken from kilometres, the quantities differ.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Harakat masalasini jadvalga yozish qulay.",
          "Jadvalda uchta ustun bor: tezlik, vaqt va masofa. Ikkitasi ma'lum, bittasi noma'lum.",
          "Bo'sh katakka mos qiymatni tanlang.",
        ],
        ru: [
          'Задачу на движение удобно записывать в таблицу.',
          'В таблице три столбца: скорость, время и расстояние. Два известны, один неизвестен.',
          'Выбери значение, которое подходит в пустую клетку.',
        ],
        en: [
          'A motion problem is convenient to write in a table.',
          'The table has three columns: speed, time and distance. Two are known, one is unknown.',
          'Choose the value that fits the empty cell.',
        ],
      },
    },
  },

  s3: {
    eyebrow: { uz: 'Birinchi qoida', ru: 'Первое правило', en: 'The first rule' },
    title: {
      uz: 'Tezlikni topish',
      ru: 'Как найти скорость',
      en: 'How to find the speed',
    },
    lead: {
      uz: "Masofani vaqtga bo'lamiz. Darslik, 123-bet.",
      ru: 'Расстояние делим на время. Учебник, страница 123.',
      en: 'We divide the distance by the time. Textbook, page 123.',
    },
    note: {
      uz: "Javobning birligi ham bo'linadi: kilometrni soatga bo'lsak, km/h chiqadi.",
      ru: 'Единица ответа тоже делится: километр на час даёт км/ч.',
      en: 'The unit of the answer divides too: a kilometre by an hour gives km/h.',
    },
    audio: {
      intro: {
        uz: [
          "Darslikning bir yuz yigirma uchinchi betida qoida yozilgan.",
          "Harakat tezligini topish uchun masofani vaqtga bo'lish kerak.",
          "Masalan, vertolyot ikki soatda to'rt yuz oltmish kilometr uchdi.",
          "To'rt yuz oltmishni ikkiga bo'lsak, ikki yuz o'ttiz chiqadi. Vertolyotning tezligi soatiga ikki yuz o'ttiz kilometr.",
        ],
        ru: [
          'На сто двадцать третьей странице учебника записано правило.',
          'Чтобы найти скорость движения, надо расстояние разделить на время.',
          'Например, вертолёт пролетел четыреста шестьдесят километров за два часа.',
          'Четыреста шестьдесят разделить на два будет двести тридцать. Скорость вертолёта двести тридцать километров в час.',
        ],
        en: [
          'On page one hundred and twenty-three of the textbook the rule is written down.',
          'To find the speed of motion the distance must be divided by the time.',
          'For example, a helicopter flew four hundred and sixty kilometres in two hours.',
          'Four hundred and sixty divided by two is two hundred and thirty. The speed of the helicopter is two hundred and thirty kilometres per hour.',
        ],
      },
    },
  },

  s4: {
    eyebrow: { uz: 'Velosipedchi', ru: 'Велосипедист', en: 'The cyclist' },
    title: { uz: '39 km, 3 soat', ru: '39 км, 3 часа', en: '39 km, 3 hours' },
    question: {
      uz: 'Velosipedchi qanday tezlik bilan harakatlangan?',
      ru: 'С какой скоростью двигался велосипедист?',
      en: 'What speed was the cyclist moving at?',
    },
    options: [
      { uz: '13 km/h', ru: '13 км/ч', en: '13 km/h' },
      { uz: '117 km/h', ru: '117 км/ч', en: '117 km/h' },
      { uz: '36 km/h', ru: '36 км/ч', en: '36 km/h' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. O'ttiz to'qqizni uchga bo'lsak, o'n uch chiqadi.",
      ru: 'Верно. Тридцать девять разделить на три будет тринадцать.',
      en: 'Correct. Thirty-nine divided by three is thirteen.',
    },
    wrong: [
      null,
      {
        uz: "Bu ko'paytma. Tezlikni topish uchun bo'lish kerak, ko'paytirish emas.",
        ru: 'Это произведение. Чтобы найти скорость, нужно делить, а не умножать.',
        en: 'This is a product. To find the speed you divide, not multiply.',
      },
      {
        uz: "Bu ayirma. Masofadan vaqtni ayirib bo'lmaydi: birliklar har xil.",
        ru: 'Это разность. Из расстояния нельзя вычесть время: единицы разные.',
        en: 'This is a difference. Time cannot be taken from distance: the units differ.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Darslikning bir yuz yigirma uchinchi betidagi ikkinchi mashqdan misol.",
          "Velosipedchi bir xil tezlik bilan yurib, o'ttiz to'qqiz kilometrni uch soatda bosib o'tdi.",
          "Qaysi amal kerakligini eslang va javobni tanlang.",
        ],
        ru: [
          'Пример из второго задания на сто двадцать третьей странице учебника.',
          'Велосипедист двигался с одинаковой скоростью и проехал тридцать девять километров за три часа.',
          'Вспомни, какое действие нужно, и выбери ответ.',
        ],
        en: [
          'An example from task two on page one hundred and twenty-three of the textbook.',
          'A cyclist moved at a steady speed and covered thirty-nine kilometres in three hours.',
          'Remember which action is needed and choose the answer.',
        ],
      },
    },
  },

  s5: {
    eyebrow: { uz: 'Ikkinchi qoida', ru: 'Второе правило', en: 'The second rule' },
    title: {
      uz: 'Masofani topish',
      ru: 'Как найти расстояние',
      en: 'How to find the distance',
    },
    lead: {
      uz: "Tezlikni vaqtga ko'paytiramiz. Darslik, 124-bet.",
      ru: 'Скорость умножаем на время. Учебник, страница 124.',
      en: 'We multiply the speed by the time. Textbook, page 124.',
    },
    note: {
      uz: "Har soat bir xil masofa qo'shiladi, shuning uchun ko'paytirish ishlaydi.",
      ru: 'Каждый час добавляется одинаковое расстояние, поэтому работает умножение.',
      en: 'Each hour adds the same distance, which is why multiplying works.',
    },
    audio: {
      intro: {
        uz: [
          "Darslikning bir yuz yigirma to'rtinchi betida ikkinchi qoida bor.",
          "Masofani topish uchun harakat tezligini vaqtga ko'paytirish kerak.",
          "Piyoda soatiga to'rt kilometr tezlik bilan uch soat yurdi.",
          "Har soatda to'rt kilometr qo'shiladi. To'rtni uchga ko'paytirsak, o'n ikki kilometr chiqadi.",
        ],
        ru: [
          'На сто двадцать четвёртой странице учебника есть второе правило.',
          'Чтобы найти расстояние, надо скорость движения умножить на время.',
          'Пешеход шёл три часа со скоростью четыре километра в час.',
          'Каждый час добавляется четыре километра. Четыре умножить на три будет двенадцать километров.',
        ],
        en: [
          'On page one hundred and twenty-four of the textbook there is a second rule.',
          'To find the distance the speed of motion must be multiplied by the time.',
          'A pedestrian walked for three hours at four kilometres per hour.',
          'Each hour adds four kilometres. Four times three is twelve kilometres.',
        ],
      },
    },
  },

  s6: {
    eyebrow: { uz: 'Mototsiklchi', ru: 'Мотоциклист', en: 'The motorcyclist' },
    title: { uz: '40 km/h, 2 soat', ru: '40 км/ч, 2 часа', en: '40 km/h, 2 hours' },
    question: {
      uz: "Bo'sh katakka qaysi masofa tushadi?",
      ru: 'Какое расстояние попадает в пустую клетку?',
      en: 'Which distance goes into the empty cell?',
    },
    columns: COLUMNS,
    rows: [['40 km/h', '2 h', null]],
    chips: [
      { uz: '80 km', ru: '80 км', en: '80 km' },
      { uz: '20 km', ru: '20 км', en: '20 km' },
      { uz: '42 km', ru: '42 км', en: '42 km' },
    ],
    correctChip: 0,
    correctText: {
      uz: "To'g'ri. Qirqni ikkiga ko'paytirsak, sakson kilometr chiqadi.",
      ru: 'Верно. Сорок умножить на два будет восемьдесят километров.',
      en: 'Correct. Forty times two is eighty kilometres.',
    },
    wrong: [
      null,
      {
        uz: "Bu bo'linma. Bo'lish tezlik yoki vaqtni topganda kerak bo'ladi, masofani emas.",
        ru: 'Это частное. Деление нужно, когда ищут скорость или время, а не расстояние.',
        en: 'This is a quotient. Division is needed when finding speed or time, not distance.',
      },
      {
        uz: "Bu yig'indi. Tezlik va vaqtni qo'shib bo'lmaydi, ular har xil kattalik.",
        ru: 'Это сумма. Скорость и время складывать нельзя, это разные величины.',
        en: 'This is a sum. Speed and time cannot be added, they are different quantities.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Darslikning bir yuz yigirma to'rtinchi betidagi ikkinchi mashqdan misol.",
          "Mototsiklchi soatiga qirq kilometr tezlik bilan ikki soat yurdi.",
          "Bo'sh katakka mos masofani tanlang.",
        ],
        ru: [
          'Пример из второго задания на сто двадцать четвёртой странице учебника.',
          'Мотоциклист ехал два часа со скоростью сорок километров в час.',
          'Выбери расстояние, которое подходит в пустую клетку.',
        ],
        en: [
          'An example from task two on page one hundred and twenty-four of the textbook.',
          'A motorcyclist rode for two hours at forty kilometres per hour.',
          'Choose the distance that fits the empty cell.',
        ],
      },
    },
  },

  s7: {
    eyebrow: { uz: 'Uchinchi qoida', ru: 'Третье правило', en: 'The third rule' },
    title: {
      uz: 'Vaqtni topish',
      ru: 'Как найти время',
      en: 'How to find the time',
    },
    lead: {
      uz: "Masofani tezlikka bo'lamiz. Darslik, 125-bet.",
      ru: 'Расстояние делим на скорость. Учебник, страница 125.',
      en: 'We divide the distance by the speed. Textbook, page 125.',
    },
    note: {
      uz: "Uchta kattalikdan ikkitasi ma'lum bo'lsa, uchinchisi doim topiladi.",
      ru: 'Если известны две величины из трёх, третья находится всегда.',
      en: 'If two of the three quantities are known, the third can always be found.',
    },
    audio: {
      intro: {
        uz: [
          "Uchinchi holat: masofa va tezlik ma'lum, vaqt noma'lum.",
          "Yo'lovchi avtobusda to'qson kilometr yo'l yurdi. Avtobusning tezligi soatiga qirq besh kilometr.",
          "To'qsonni qirq beshga bo'lsak, ikki chiqadi. Yo'lovchi ikki soat yo'lda bo'lgan.",
          "Demak masofani tezlikka bo'lsak, vaqt chiqadi.",
        ],
        ru: [
          'Третий случай: расстояние и скорость известны, время неизвестно.',
          'Пассажир проехал на автобусе девяносто километров. Скорость автобуса сорок пять километров в час.',
          'Девяносто разделить на сорок пять будет два. Пассажир был в пути два часа.',
          'Значит, если расстояние разделить на скорость, получится время.',
        ],
        en: [
          'The third case: the distance and the speed are known, the time is not.',
          'A passenger travelled ninety kilometres by bus. The speed of the bus is forty-five kilometres per hour.',
          'Ninety divided by forty-five is two. The passenger was on the road for two hours.',
          'So dividing the distance by the speed gives the time.',
        ],
      },
    },
  },

  s8: {
    eyebrow: { uz: 'Yo\'lovchi', ru: 'Пассажир', en: 'The passenger' },
    title: { uz: '90 km, 45 km/h', ru: '90 км, 45 км/ч', en: '90 km, 45 km/h' },
    question: {
      uz: "Yo'lovchi necha soat yo'lda bo'lgan?",
      ru: 'Сколько часов пассажир был в пути?',
      en: 'How many hours was the passenger on the road?',
    },
    options: [
      { uz: '2 soat', ru: '2 часа', en: '2 hours' },
      { uz: '45 soat', ru: '45 часов', en: '45 hours' },
      { uz: '4050 soat', ru: '4050 часов', en: '4050 hours' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. To'qsonni qirq beshga bo'lsak, ikki chiqadi.",
      ru: 'Верно. Девяносто разделить на сорок пять будет два.',
      en: 'Correct. Ninety divided by forty-five is two.',
    },
    wrong: [
      null,
      {
        uz: "Bu ayirma. Masofadan tezlikni ayirib bo'lmaydi, birliklar har xil.",
        ru: 'Это разность. Из расстояния нельзя вычесть скорость, единицы разные.',
        en: 'This is a difference. Speed cannot be taken from distance, the units differ.',
      },
      {
        uz: "Bu ko'paytma. Ko'paytirish masofani topganda kerak bo'ladi, vaqtni emas.",
        ru: 'Это произведение. Умножение нужно, когда ищут расстояние, а не время.',
        en: 'This is a product. Multiplying is needed when finding distance, not time.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Darslikning bir yuz yigirma beshinchi betidagi masala.",
          "Yo'lovchi avtobusda to'qson kilometr yurdi, avtobus tezligi soatiga qirq besh kilometr.",
          "Qaysi amal kerakligini o'ylang va javobni tanlang.",
        ],
        ru: [
          'Задача со сто двадцать пятой страницы учебника.',
          'Пассажир проехал на автобусе девяносто километров, скорость автобуса сорок пять километров в час.',
          'Подумай, какое действие нужно, и выбери ответ.',
        ],
        en: [
          'The problem from page one hundred and twenty-five of the textbook.',
          'A passenger travelled ninety kilometres by bus, and the speed of the bus is forty-five kilometres per hour.',
          'Think which action is needed and choose the answer.',
        ],
      },
    },
  },

  s9: {
    eyebrow: { uz: 'Tezlik birliklari', ru: 'Единицы скорости', en: 'Units of speed' },
    title: {
      uz: 'Tezlik faqat km/h bilan o\'lchanmaydi',
      ru: 'Скорость измеряется не только в км/ч',
      en: 'Speed is not measured only in km/h',
    },
    lead: {
      uz: "Vaqt birligi o'zgarsa, tezlik birligi ham o'zgaradi: km/min, m/min, m/s.",
      ru: 'Если меняется единица времени, меняется и единица скорости: км/мин, м/мин, м/с.',
      en: 'If the unit of time changes, so does the unit of speed: km/min, m/min, m/s.',
    },
    note: {
      uz: "Birlikni javobga yozishni unutmaslik kerak.",
      ru: 'Единицу нельзя забывать записывать в ответе.',
      en: 'The unit must not be forgotten in the answer.',
    },
    audio: {
      intro: {
        uz: [
          "Darslikning bir yuz yigirma uchinchi betida tezlik birliklari sanab o'tilgan.",
          "Samolyot o'n minutda bir yuz o'n kilometr uchadi. Bir yuz o'nni o'nga bo'lsak, o'n bir chiqadi.",
          "Bu tezlik minutiga o'n bir kilometr. Soatiga emas, aynan minutiga.",
          "Toshbaqaning tezligi esa minutiga to'rt metr, kosmik kema tezligi sekundiga yetti ming ikki yuz oltmish metr.",
        ],
        ru: [
          'На сто двадцать третьей странице учебника перечислены единицы скорости.',
          'Самолёт пролетает сто десять километров за десять минут. Сто десять разделить на десять будет одиннадцать.',
          'Это скорость одиннадцать километров в минуту. Не в час, а именно в минуту.',
          'А скорость черепахи четыре метра в минуту, скорость космического корабля семь тысяч двести шестьдесят метров в секунду.',
        ],
        en: [
          'On page one hundred and twenty-three of the textbook the units of speed are listed.',
          'A plane flies one hundred and ten kilometres in ten minutes. One hundred and ten divided by ten is eleven.',
          'That is a speed of eleven kilometres per minute. Not per hour but per minute.',
          'And a tortoise moves at four metres per minute, while a spacecraft flies at seven thousand two hundred and sixty metres per second.',
        ],
      },
    },
  },

  s10: {
    eyebrow: { uz: 'Toychoq', ru: 'Жеребёнок', en: 'The foal' },
    title: { uz: '20 m/min, 10 minut', ru: '20 м/мин, 10 минут', en: '20 m/min, 10 minutes' },
    question: {
      uz: "Bo'sh katakka qaysi masofa tushadi?",
      ru: 'Какое расстояние попадает в пустую клетку?',
      en: 'Which distance goes into the empty cell?',
    },
    columns: COLUMNS,
    rows: [['20 m/min', '10 min', null]],
    chips: [
      { uz: '200 m', ru: '200 м', en: '200 m' },
      { uz: '2 m', ru: '2 м', en: '2 m' },
      { uz: '30 m', ru: '30 м', en: '30 m' },
    ],
    correctChip: 0,
    correctText: {
      uz: "To'g'ri. Yigirmani o'nga ko'paytirsak, ikki yuz metr chiqadi. Birlik metr, chunki tezlik metrda berilgan.",
      ru: 'Верно. Двадцать умножить на десять будет двести метров. Единица метр, ведь скорость дана в метрах.',
      en: 'Correct. Twenty times ten is two hundred metres. The unit is the metre, because the speed is given in metres.',
    },
    wrong: [
      null,
      {
        uz: "Bu bo'linma. Masofani topish uchun ko'paytirish kerak.",
        ru: 'Это частное. Чтобы найти расстояние, нужно умножать.',
        en: 'This is a quotient. To find the distance you multiply.',
      },
      {
        uz: "Bu yig'indi. Tezlik va vaqtni qo'shib bo'lmaydi.",
        ru: 'Это сумма. Скорость и время складывать нельзя.',
        en: 'This is a sum. Speed and time cannot be added.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Darslikning bir yuz yigirma beshinchi betidagi uchinchi masala.",
          "Toychoq minutiga yigirma metr tezlik bilan o'n minut yurdi.",
          "Bo'sh katakka mos masofani tanlang va birlikka e'tibor bering.",
        ],
        ru: [
          'Третья задача со сто двадцать пятой страницы учебника.',
          'Жеребёнок шёл десять минут со скоростью двадцать метров в минуту.',
          'Выбери подходящее расстояние и обрати внимание на единицу.',
        ],
        en: [
          'The third problem from page one hundred and twenty-five of the textbook.',
          'A foal walked for ten minutes at twenty metres per minute.',
          'Choose the matching distance and pay attention to the unit.',
        ],
      },
    },
  },

  s11: {
    eyebrow: { uz: 'Uchta bog\'lanish', ru: 'Три связи', en: 'Three links' },
    title: {
      uz: 'Uchta kattalik bitta uchburchakda',
      ru: 'Три величины в одном треугольнике',
      en: 'Three quantities in one triangle',
    },
    lead: {
      uz: "Masofa yuqorida, tezlik va vaqt pastda. Yopilgan kattalik qanday topilishini chizma ko'rsatadi.",
      ru: 'Расстояние сверху, скорость и время снизу. Чертёж показывает, как найти закрытую величину.',
      en: 'Distance on top, speed and time below. The drawing shows how to find the hidden quantity.',
    },
    note: {
      uz: "Yonma-yon turganlar ko'paytiriladi, ustma-ust turganlar bo'linadi.",
      ru: 'Стоящие рядом умножаются, стоящие друг над другом делятся.',
      en: 'The ones side by side are multiplied, the ones above each other are divided.',
    },
    audio: {
      intro: {
        uz: [
          "Uchala qoidani bitta chizmada eslab qolish mumkin.",
          "Yuqorida masofa, pastda tezlik va vaqt turadi.",
          "Masofani yopsak, pastdagi ikkitasi yonma-yon qoladi va ko'paytiriladi.",
          "Tezlikni yopsak, masofa vaqt ustida qoladi va bo'linadi. Vaqtni yopsak ham xuddi shunday.",
        ],
        ru: [
          'Все три правила можно запомнить по одному чертежу.',
          'Сверху стоит расстояние, снизу скорость и время.',
          'Если закрыть расстояние, две нижние величины останутся рядом и умножаются.',
          'Если закрыть скорость, расстояние окажется над временем и делится. Со временем то же самое.',
        ],
        en: [
          'All three rules can be remembered from a single drawing.',
          'Distance stands on top, speed and time below.',
          'Cover the distance and the two below stay side by side, so they are multiplied.',
          'Cover the speed and the distance stands over the time, so they are divided. The same works for the time.',
        ],
      },
    },
  },

  s12: {
    eyebrow: { uz: 'Amalni tanlash', ru: 'Выбор действия', en: 'Choosing the action' },
    title: {
      uz: 'Qaysi amal kerak?',
      ru: 'Какое действие нужно?',
      en: 'Which action is needed?',
    },
    question: {
      uz: "Poyezd 60 km/h tezlik bilan 5 soat yurdi. Qaysi amalni tanlaysiz?",
      ru: 'Поезд шёл 5 часов со скоростью 60 км/ч. Какое действие выберешь?',
      en: 'A train ran for 5 hours at 60 km/h. Which action would you choose?',
    },
    options: [
      { uz: "Ko'paytirish: 60 × 5", ru: 'Умножение: 60 × 5', en: 'Multiplication: 60 × 5' },
      { uz: "Bo'lish: 60 : 5", ru: 'Деление: 60 : 5', en: 'Division: 60 : 5' },
      { uz: "Qo'shish: 60 + 5", ru: 'Сложение: 60 + 5', en: 'Addition: 60 + 5' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Tezlik va vaqt ma'lum, masofa noma'lum. Uchburchakda ular yonma-yon, demak ko'paytiriladi: uch yuz kilometr.",
      ru: 'Верно. Скорость и время известны, расстояние неизвестно. В треугольнике они стоят рядом, значит умножаются: триста километров.',
      en: 'Correct. The speed and the time are known, the distance is not. In the triangle they stand side by side, so they multiply: three hundred kilometres.',
    },
    wrong: [
      null,
      {
        uz: "Bo'lish tezlik yoki vaqt noma'lum bo'lganda kerak. Bu yerda ikkalasi ham ma'lum.",
        ru: 'Деление нужно, когда неизвестна скорость или время. Здесь известны обе.',
        en: 'Division is needed when the speed or the time is unknown. Here both are known.',
      },
      {
        uz: "Qo'shish bu yerda ishlamaydi: km/h va soat har xil kattaliklar.",
        ru: 'Сложение здесь не работает: км/ч и часы это разные величины.',
        en: 'Addition does not work here: km/h and hours are different quantities.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Amalni tanlashda ikkita savol yordam beradi: nima ma'lum va nima topilishi kerak.",
          "Poyezdning tezligi va vaqti berilgan, masofa esa noma'lum.",
          "Uchburchakka qarang va kerakli amalni tanlang.",
        ],
        ru: [
          'При выборе действия помогают два вопроса: что известно и что надо найти.',
          'Скорость и время поезда даны, а расстояние неизвестно.',
          'Посмотри на треугольник и выбери нужное действие.',
        ],
        en: [
          'Two questions help you choose the action: what is known and what must be found.',
          'The speed and the time of the train are given, and the distance is unknown.',
          'Look at the triangle and choose the action you need.',
        ],
      },
    },
  },

  s13: {
    eyebrow: { uz: "Bit ning yozuvi", ru: 'Запись Bit', en: "Bit's notes" },
    title: {
      uz: 'Samolyot: 110 km, 10 minut',
      ru: 'Самолёт: 110 км, 10 минут',
      en: 'The plane: 110 km, 10 minutes',
    },
    question: {
      uz: "Bit tezlikni 11 km/h deb yozdi. Xato qayerda?",
      ru: 'Bit записал скорость как 11 км/ч. Где ошибка?',
      en: "Bit wrote the speed as 11 km/h. Where is the mistake?",
    },
    options: [
      {
        uz: "Vaqt minutda berilgan, demak birlik km/min",
        ru: 'Время дано в минутах, значит единица км/мин',
        en: 'The time is given in minutes, so the unit is km/min',
      },
      {
        uz: "Bo'lish o'rniga ko'paytirish kerak edi",
        ru: 'Вместо деления надо было умножать',
        en: 'Multiplication was needed instead of division',
      },
      {
        uz: "Son noto'g'ri hisoblangan",
        ru: 'Число посчитано неверно',
        en: 'The number is calculated wrongly',
      },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Son o'n bir to'g'ri, lekin birlik noto'g'ri. Vaqt minutda berilgani uchun tezlik minutiga o'n bir kilometr bo'ladi.",
      ru: 'Верно. Число одиннадцать правильное, а единица нет. Раз время дано в минутах, скорость одиннадцать километров в минуту.',
      en: 'Correct. The number eleven is right but the unit is not. Since the time is in minutes, the speed is eleven kilometres per minute.',
    },
    wrong: [
      null,
      {
        uz: "Amal to'g'ri tanlangan: masofa va vaqt ma'lum, tezlik uchun bo'lish kerak.",
        ru: 'Действие выбрано верно: расстояние и время известны, для скорости нужно деление.',
        en: 'The action is chosen correctly: the distance and the time are known, so speed needs division.',
      },
      {
        uz: "Son to'g'ri: bir yuz o'nni o'nga bo'lsak, aynan o'n bir chiqadi. Xato boshqa joyda.",
        ru: 'Число верное: сто десять разделить на десять будет ровно одиннадцать. Ошибка в другом.',
        en: 'The number is right: one hundred and ten divided by ten is exactly eleven. The mistake is elsewhere.',
      },
    ],
    bitFeedback: true,
    audio: {
      intro: {
        uz: [
          "Bit samolyot tezligini hisobladi va daftariga yozib qo'ydi.",
          "U bir yuz o'nni o'nga bo'ldi va o'n bir chiqdi. Son to'g'ri, lekin yozuvda xato bor.",
          "Yozuvga diqqat bilan qarang va xatoni toping.",
        ],
        ru: [
          'Bit посчитал скорость самолёта и записал её в тетрадь.',
          'Он разделил сто десять на десять и получил одиннадцать. Число верное, но в записи есть ошибка.',
          'Посмотри на запись внимательно и найди ошибку.',
        ],
        en: [
          'Bit worked out the speed of the plane and wrote it in his notebook.',
          'He divided one hundred and ten by ten and got eleven. The number is right, but there is a mistake in the notation.',
          'Look at the notes carefully and find the mistake.',
        ],
      },
    },
  },

  s14: {
    eyebrow: { uz: 'Shahar qarori', ru: 'Решение города', en: "The city's decision" },
    title: {
      uz: 'Tushgacha qancha yo\'l bosilgan?',
      ru: 'Сколько пути пройдено до обеда?',
      en: 'How much of the path was covered before noon?',
    },
    question: {
      uz: "Mashina tushgacha 2 soat, tushdan keyin 4 soat yurdi va jami 300 km bosdi. Tushgacha qancha?",
      ru: 'Машина ехала 2 часа до обеда и 4 часа после, всего 300 км. Сколько до обеда?',
      en: 'A car drove 2 hours before noon and 4 hours after, covering 300 km in all. How much before noon?',
    },
    options: [
      { uz: '100 km', ru: '100 км', en: '100 km' },
      { uz: '150 km', ru: '150 км', en: '150 km' },
      { uz: '200 km', ru: '200 км', en: '200 km' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Jami olti soat, uch yuzni oltiga bo'lsak, tezlik ellik km/h. Ellikni ikkiga ko'paytirsak, bir yuz kilometr chiqadi.",
      ru: 'Верно. Всего шесть часов, триста разделить на шесть даёт скорость пятьдесят км/ч. Пятьдесят умножить на два будет сто километров.',
      en: 'Correct. Six hours in all, three hundred divided by six gives a speed of fifty km/h. Fifty times two is one hundred kilometres.',
    },
    wrong: [
      null,
      {
        uz: "Bu yarim yo'l. Lekin tushgacha ikki soat, tushdan keyin to'rt soat yurilgan, ya'ni vaqtlar teng emas.",
        ru: 'Это половина пути. Но до обеда ехали два часа, а после четыре, то есть время не равное.',
        en: 'This is half the path. But two hours were before noon and four after, so the times are not equal.',
      },
      {
        uz: "Bu tushdan keyingi yo'l. Tushdan keyin to'rt soat yurilgan, tushgacha esa ikki soat.",
        ru: 'Это путь после обеда. После обеда ехали четыре часа, а до обеда два.',
        en: 'This is the path after noon. Four hours were driven after noon and two before.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Oxirgi vazifa darslikning bir yuz yigirma ikkinchi betidan.",
          "Mashina tushgacha ikki soat, tushdan keyin esa xuddi shu tezlik bilan yana to'rt soat yurdi. Hammasi bo'lib uch yuz kilometr yo'l bosdi.",
          "Avval tezlikni toping, keyin tushgacha bosilgan yo'lni hisoblang.",
        ],
        ru: [
          'Последнее задание со сто двадцать второй страницы учебника.',
          'Машина ехала два часа до обеда, а после обеда с той же скоростью ещё четыре часа. Всего она прошла триста километров.',
          'Сначала найди скорость, потом посчитай путь до обеда.',
        ],
        en: [
          'The last task comes from page one hundred and twenty-two of the textbook.',
          'A car drove for two hours before noon and then, at the same speed, for four more hours. In all it covered three hundred kilometres.',
          'First find the speed, then work out the path before noon.',
        ],
      },
    },
  },

  s15: {
    eyebrow: { uz: 'Missiya mukofoti', ru: 'Награда за миссию', en: 'Mission award' },
    stageLabel: { uz: 'Yakuniy bosqich', ru: 'Финальный этап', en: 'Final stage' },
    headTitle: {
      uz: 'Unvongacha bitta savol',
      ru: 'Один вопрос до звания',
      en: 'One question before your title',
    },
    headLead: {
      uz: 'Tezlikni topish qoidasini ayting va unvonni oling.',
      ru: 'Назови правило нахождения скорости и получи звание.',
      en: 'Name the rule for finding the speed and claim your title.',
    },
    questionKicker: { uz: 'Yakuniy savol', ru: 'Финальный вопрос', en: 'Final question' },
    stepLabel: { uz: '1 qadam', ru: '1 шаг', en: '1 step' },
    reflectionQuestion: {
      uz: 'Tezlikni qanday topamiz?',
      ru: 'Как находим скорость?',
      en: 'How do we find the speed?',
    },
    reflectionStart: {
      uz: 'Tezlikni topish uchun men…',
      ru: 'Чтобы найти скорость, я…',
      en: 'To find the speed I…',
    },
    reflectionOptions: [
      { uz: "masofani vaqtga bo'laman", ru: 'делю расстояние на время', en: 'divide the distance by the time' },
      { uz: "masofani vaqtga ko'paytiraman", ru: 'умножаю расстояние на время', en: 'multiply the distance by the time' },
      { uz: "vaqtni masofaga bo'laman", ru: 'делю время на расстояние', en: 'divide the time by the distance' },
    ],
    reflectionCorrectIndex: 0,
    reflectionCorrect: {
      uz: "To'g'ri. Masofani vaqtga bo'lsak, bir soatda bosilgan yo'l, ya'ni tezlik chiqadi.",
      ru: 'Верно. Если разделить расстояние на время, получится путь за один час, то есть скорость.',
      en: 'Correct. Dividing the distance by the time gives the path in one hour, that is, the speed.',
    },
    reflectionWrong: {
      uz: "Ko'paytirish masofani beradi, teskari bo'lish esa ma'nosiz javob beradi. Uchburchakka qarang: masofa tezlik ustida turadi.",
      ru: 'Умножение даёт расстояние, а обратное деление даёт бессмысленный ответ. Посмотри на треугольник: расстояние стоит над скоростью.',
      en: 'Multiplying gives the distance, and the reverse division gives a meaningless answer. Look at the triangle: the distance stands above the speed.',
    },
    rewardAnnounce: { uz: 'Unvon olindi:', ru: 'Звание получено:', en: 'Title earned:' },
    awards: [
      { min: 5, title: { uz: 'Liniya dispetcheri', ru: 'Диспетчер линии', en: 'Line dispatcher' } },
      { min: 3, title: { uz: 'Marshrut hisobchisi', ru: 'Расчётчик маршрута', en: 'Route calculator' } },
      { min: 0, title: { uz: 'Liniya kuzatuvchisi', ru: 'Наблюдатель линии', en: 'Line observer' } },
    ],
    mainLabel: { uz: 'Qoida', ru: 'Правило', en: 'Rule' },
    main: [
      {
        uz: "Tezlik = masofa : vaqt",
        ru: 'Скорость = расстояние : время',
        en: 'Speed = distance : time',
      },
      {
        uz: "Masofa = tezlik × vaqt",
        ru: 'Расстояние = скорость × время',
        en: 'Distance = speed × time',
      },
      {
        uz: "Vaqt = masofa : tezlik",
        ru: 'Время = расстояние : скорость',
        en: 'Time = distance : speed',
      },
      {
        uz: "Javobda birlikni yozish shart: km/h, m/min, m/s.",
        ru: 'В ответе обязательно писать единицу: км/ч, м/мин, м/с.',
        en: 'The unit must be written in the answer: km/h, m/min, m/s.',
      },
    ],
    nextLabel: { uz: 'Keyingi missiya', ru: 'Следующая миссия', en: 'Next mission' },
    nextText: {
      uz: "Kunlik natijalarni adolatli taqqoslash: o'rtacha arifmetik.",
      ru: 'Честно сравнить дневные результаты: среднее арифметическое.',
      en: 'Comparing daily results fairly: the arithmetic mean.',
    },
    audio: {
      intro: {
        uz: [
          "Missiya bajarildi. Tramvay liniyasi jadval bo'yicha ishlay boshladi.",
          "Bugun siz masofa, vaqt va tezlikni bog'lashni o'rgandingiz va birlikka e'tibor berishni o'rgandingiz.",
          "Unvonni ochish uchun bitta savol qoldi.",
        ],
        ru: [
          'Миссия выполнена. Трамвайная линия заработала по расписанию.',
          'Теперь ты умеешь связывать расстояние, время и скорость и следить за единицами.',
          'До звания остался один вопрос.',
        ],
        en: [
          'Mission complete. The tram line is running to schedule.',
          'Today you learned to link distance, time and speed and to watch the units.',
          'One question stands between you and the title.',
        ],
      },
    },
  },
};

// ===========================================================================
// CHIZMALAR
// ===========================================================================

const LineDefs = () => (
  <defs>
    <linearGradient id="d14sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#0A1F31" />
      <stop offset="100%" stopColor="#1C4A5E" />
    </linearGradient>
    <linearGradient id="d14car" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#F0EADA" />
      <stop offset="55%" stopColor="#CFC6B2" />
      <stop offset="100%" stopColor="#918B7B" />
    </linearGradient>
    <linearGradient id="d14win" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#A9DEE9" />
      <stop offset="100%" stopColor="#3A7F95" />
    </linearGradient>
  </defs>
);

const TramCar = ({ x, y, w, h }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={h * 0.3} fill="url(#d14car)" />
    <rect x={x + w * 0.07} y={y + h * 0.2} width={w * 0.86} height={h * 0.34} rx={h * 0.12} fill="url(#d14win)" />
    {[0, 1, 2, 3, 4].map((i) => (
      <rect key={i} x={x + w * (0.11 + i * 0.17)} y={y + h * 0.22} width={w * 0.11} height={h * 0.3} rx="1.4" fill="#0E3444" opacity="0.32" />
    ))}
    <rect x={x + w * 0.05} y={y + h * 0.62} width={w * 0.9} height={h * 0.1} fill="#E2683F" />
    <circle cx={x + w * 0.24} cy={y + h + 2} r={h * 0.16} fill="#33414A" />
    <circle cx={x + w * 0.74} cy={y + h + 2} r={h * 0.16} fill="#33414A" />
    <path d={`M${x + w * 0.5} ${y} l-7 -12 M${x + w * 0.5} ${y} l8 -12`} stroke="#A6B7C1" strokeWidth="1.8" />
  </g>
);

const TramLineScene = ({ solved = false, mode = 'hook' }) => {
  const t = useT();
  const done = mode === 'final' || solved;
  return (
    <div className="hero-scene">
      <div className="hero-head">
        <span>
          {t({
            uz: 'LUMO CITY · TRAMVAY LINIYASI',
            ru: 'LUMO CITY · ТРАМВАЙНАЯ ЛИНИЯ',
            en: 'LUMO CITY · TRAM LINE',
          })}
        </span>
        <span className={done ? 'hero-state' : 'hero-state hero-state-alert'}>
          {done ? '12 km/h' : '48 km · 4 h'}
        </span>
      </div>
      <div className="hero-body">
        <FitSvg viewBox="0 0 560 250">
          <LineDefs />
          <rect x="0" y="0" width="560" height="250" rx="16" fill="url(#d14sky)" />
          {/* shahar siluet */}
          {[40, 96, 150, 400, 456, 506].map((bx, i) => (
            <rect key={bx} x={bx} y={70 + (i % 3) * 14} width="38" height={110 - (i % 3) * 14} rx="3" fill="#123244" />
          ))}
          {/* kontakt simi */}
          <path d="M30 96 L530 96" stroke="#4C6C7C" strokeWidth="2" />
          {[70, 190, 310, 430].map((px) => (
            <path key={px} d={`M${px} 96 L${px} 178`} stroke="#3C5866" strokeWidth="2" />
          ))}
          {/* rels va bekatlar */}
          <rect x="20" y="196" width="520" height="4" fill="#5C7480" />
          <rect x="20" y="206" width="520" height="4" fill="#5C7480" />
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <path d={`M${34 + i * 123} 190 L${34 + i * 123} 216`} stroke="#8FA4B0" strokeWidth="2" />
              <text
                x={34 + i * 123}
                y="234"
                textAnchor="middle"
                fill={done ? '#B7D77A' : '#7E939F'}
                fontSize="11"
                fontWeight="800"
                fontFamily="JetBrains Mono, monospace"
              >
                {done ? `${i * 12} km` : (i === 0 ? '0' : (i === 4 ? '48 km' : '·'))}
              </text>
            </g>
          ))}
          <TramCar x={44} y={158} w={170} h={34} />
          {!done && (
            <g>
              <rect x="286" y="126" width="176" height="30" rx="10" fill="#4A2114" opacity="0.92" />
              <text x="374" y="146" textAnchor="middle" fill="#FFC0A8" fontSize="14" fontWeight="800" fontFamily="Manrope, sans-serif">
                48 km : 4 h = ?
              </text>
            </g>
          )}
        </FitSvg>
      </div>
    </div>
  );
};

// s1 — uchta kattalik yo'l chizmasida
const QuantitiesFigure = ({ frame = 0 }) => {
  const t = useT();
  const items = [
    { on: frame >= 2, label: { uz: 'Masofa', ru: 'Расстояние', en: 'Distance' }, value: '48 km', color: T.cyan, y: 60 },
    { on: frame >= 3, label: { uz: 'Vaqt', ru: 'Время', en: 'Time' }, value: '4 h', color: T.navy, y: 118 },
    { on: frame >= 4, label: { uz: 'Tezlik', ru: 'Скорость', en: 'Speed' }, value: '12 km/h', color: T.accent, y: 176 },
  ];
  return (
    <FitSvg viewBox="0 0 520 232">
      <text x="260" y="30" textAnchor="middle" fill={T.ink2} fontSize="14" fontWeight="700" fontFamily="Manrope, sans-serif">
        {t({ uz: 'Har masalada uchta kattalik', ru: 'В каждой задаче три величины', en: 'Three quantities in every problem' })}
      </text>
      {items.map((item) => (
        <g key={item.value} opacity={item.on ? 1 : 0.28} style={{ transition: 'opacity .4s' }}>
          <rect x="70" y={item.y - 22} width="380" height="46" rx="13" fill="#FFFFFF" stroke={item.color} strokeWidth="2" />
          <rect x="70" y={item.y - 22} width="6" height="46" rx="3" fill={item.color} />
          <text x="104" y={item.y + 6} fill={T.ink} fontSize="15" fontWeight="700" fontFamily="Manrope, sans-serif">
            {t(item.label)}
          </text>
          <text x="424" y={item.y + 7} textAnchor="end" fill={item.color} fontSize="20" fontWeight="800" fontFamily="JetBrains Mono, monospace">
            {item.value}
          </text>
        </g>
      ))}
    </FitSvg>
  );
};

// s3, s5, s7 — qoidalar
const RuleFigure = ({ frame = 0, kind = 'speed' }) => {
  const t = useT();
  const data = {
    speed: {
      formula: 'v = S : t',
      example: '460 : 2 = 230',
      unit: 'km/h',
      label: { uz: 'Tezlik = masofa : vaqt', ru: 'Скорость = расстояние : время', en: 'Speed = distance : time' },
      color: T.accent,
    },
    distance: {
      formula: 'S = v × t',
      example: '4 × 3 = 12',
      unit: 'km',
      label: { uz: "Masofa = tezlik × vaqt", ru: 'Расстояние = скорость × время', en: 'Distance = speed × time' },
      color: T.cyan,
    },
    time: {
      formula: 't = S : v',
      example: '90 : 45 = 2',
      unit: 'h',
      label: { uz: "Vaqt = masofa : tezlik", ru: 'Время = расстояние : скорость', en: 'Time = distance : speed' },
      color: T.success,
    },
  }[kind];
  return (
    <FitSvg viewBox="0 0 520 232">
      <g opacity={frame >= 1 ? 1 : 0.3} style={{ transition: 'opacity .4s' }}>
        <rect x="88" y="40" width="344" height="66" rx="16" fill="#FFFFFF" stroke={data.color} strokeWidth="2.4" />
        <text x="260" y="84" textAnchor="middle" fill={data.color} fontSize="30" fontWeight="800" fontFamily="JetBrains Mono, monospace">
          {data.formula}
        </text>
      </g>
      <g opacity={frame >= 2 ? 1 : 0.3} style={{ transition: 'opacity .4s' }}>
        <text x="260" y="134" textAnchor="middle" fill={T.ink2} fontSize="15" fontWeight="700" fontFamily="Manrope, sans-serif">
          {t(data.label)}
        </text>
      </g>
      <g opacity={frame >= 3 ? 1 : 0.3} style={{ transition: 'opacity .4s' }}>
        <rect x="140" y="158" width="240" height="52" rx="14" fill={T.cyanSoft} />
        <text x="260" y="192" textAnchor="middle" fill={T.ink} fontSize="21" fontWeight="800" fontFamily="JetBrains Mono, monospace">
          {data.example} {data.unit}
        </text>
      </g>
    </FitSvg>
  );
};

// s9 — birliklar
const UnitsFigure = ({ frame = 0 }) => {
  const t = useT();
  const rows = [
    { who: { uz: 'Piyoda', ru: 'Пешеход', en: 'Pedestrian' }, value: '5 km/h', on: frame >= 1 },
    { who: { uz: 'Samolyot', ru: 'Самолёт', en: 'Plane' }, value: '11 km/min', on: frame >= 2 },
    { who: { uz: 'Toshbaqa', ru: 'Черепаха', en: 'Tortoise' }, value: '4 m/min', on: frame >= 3 },
    { who: { uz: 'Kosmik kema', ru: 'Космический корабль', en: 'Spacecraft' }, value: '7260 m/s', on: frame >= 4 },
  ];
  return (
    <FitSvg viewBox="0 0 520 232">
      {rows.map((row, index) => {
        const y = 18 + index * 52;
        return (
          <g key={row.value} opacity={row.on ? 1 : 0.28} style={{ transition: 'opacity .4s' }}>
            <rect x="46" y={y} width="428" height="42" rx="12" fill="#FFFFFF" stroke="rgba(23,59,82,.14)" strokeWidth="1.5" />
            <text x="72" y={y + 27} fill={T.ink} fontSize="15" fontWeight="650" fontFamily="Manrope, sans-serif">
              {t(row.who)}
            </text>
            <text x="450" y={y + 28} textAnchor="end" fill={T.cyan} fontSize="18" fontWeight="800" fontFamily="JetBrains Mono, monospace">
              {row.value}
            </text>
          </g>
        );
      })}
    </FitSvg>
  );
};

// s11, s12 — uchburchak
const TriangleFigure = ({ frame = 0, solved = false, mode = 's11' }) => {
  const t = useT();
  const step = mode === 's12' ? (solved ? 4 : 2) : frame;
  return (
    <FitSvg viewBox="0 0 520 232">
      <path d="M260 22 L432 200 L88 200 Z" fill="#F6F9F8" stroke={T.ink3} strokeWidth="2" />
      <line x1="152" y1="122" x2="368" y2="122" stroke={T.ink3} strokeWidth="2" />
      <line x1="260" y1="122" x2="260" y2="200" stroke={T.ink3} strokeWidth="2" />
      <g opacity={step >= 1 ? 1 : 0.3} style={{ transition: 'opacity .4s' }}>
        <text x="260" y="92" textAnchor="middle" fill={T.cyan} fontSize="26" fontWeight="800" fontFamily="JetBrains Mono, monospace">
          S
        </text>
        <text x="260" y="112" textAnchor="middle" fill={T.ink3} fontSize="11" fontWeight="700" fontFamily="Manrope, sans-serif">
          {t({ uz: 'masofa', ru: 'расстояние', en: 'distance' })}
        </text>
      </g>
      <g opacity={step >= 2 ? 1 : 0.3} style={{ transition: 'opacity .4s' }}>
        <text x="186" y="166" textAnchor="middle" fill={T.accent} fontSize="26" fontWeight="800" fontFamily="JetBrains Mono, monospace">
          v
        </text>
        <text x="186" y="186" textAnchor="middle" fill={T.ink3} fontSize="11" fontWeight="700" fontFamily="Manrope, sans-serif">
          {t({ uz: 'tezlik', ru: 'скорость', en: 'speed' })}
        </text>
      </g>
      <g opacity={step >= 3 ? 1 : 0.3} style={{ transition: 'opacity .4s' }}>
        <text x="334" y="166" textAnchor="middle" fill={T.navy} fontSize="26" fontWeight="800" fontFamily="JetBrains Mono, monospace">
          t
        </text>
        <text x="334" y="186" textAnchor="middle" fill={T.ink3} fontSize="11" fontWeight="700" fontFamily="Manrope, sans-serif">
          {t({ uz: 'vaqt', ru: 'время', en: 'time' })}
        </text>
      </g>
      <g opacity={step >= 4 ? 1 : 0.25} style={{ transition: 'opacity .4s' }}>
        <text x="466" y="70" textAnchor="end" fill={T.ink2} fontSize="13" fontWeight="800" fontFamily="JetBrains Mono, monospace">
          S = v × t
        </text>
        <text x="466" y="94" textAnchor="end" fill={T.ink2} fontSize="13" fontWeight="800" fontFamily="JetBrains Mono, monospace">
          v = S : t
        </text>
        <text x="466" y="118" textAnchor="end" fill={T.ink2} fontSize="13" fontWeight="800" fontFamily="JetBrains Mono, monospace">
          t = S : v
        </text>
      </g>
    </FitSvg>
  );
};

// s13 — Bit ning birligi
const UnitErrorFigure = ({ solved = false }) => {
  const t = useT();
  return (
    <FitSvg viewBox="0 0 520 232">
      <text x="260" y="30" textAnchor="middle" fill={T.ink2} fontSize="14" fontWeight="700" fontFamily="Manrope, sans-serif">
        {t({ uz: 'Samolyot: 110 km, 10 min', ru: 'Самолёт: 110 км, 10 мин', en: 'Plane: 110 km, 10 min' })}
      </text>
      <rect x="76" y="56" width="368" height="56" rx="14" fill="#FFFFFF" stroke={T.ink3} strokeWidth="1.8" />
      <text x="260" y="92" textAnchor="middle" fill={T.ink} fontSize="22" fontWeight="800" fontFamily="JetBrains Mono, monospace">
        110 : 10 = 11
      </text>
      <rect
        x="76"
        y="130"
        width="368"
        height="56"
        rx="14"
        fill={solved ? T.successSoft : '#FFF6F3'}
        stroke={solved ? T.success : T.accent}
        strokeWidth="2.2"
      />
      <text
        x="260"
        y="166"
        textAnchor="middle"
        fill={solved ? T.success : T.accent}
        fontSize="22"
        fontWeight="800"
        fontFamily="JetBrains Mono, monospace"
      >
        {solved ? '11 km/min' : '11 km/h'}
      </text>
      <text x="260" y="212" textAnchor="middle" fill={T.ink3} fontSize="12" fontFamily="Manrope, sans-serif">
        {solved
          ? t({ uz: 'Vaqt minutda berilgan edi', ru: 'Время было дано в минутах', en: 'The time was given in minutes' })
          : t({ uz: 'Son to\'g\'ri, birlik-chi?', ru: 'Число верное, а единица?', en: 'The number is right, but the unit?' })}
      </text>
    </FitSvg>
  );
};

// ===========================================================================
// EKRANLAR
// ===========================================================================
const Screen0 = (props) => (
  <ChoiceScreen {...props} plain ratio="28 / 25" ordinal={0} figure={({ solved }) => <TramLineScene solved={solved} />} />
);
const Screen1 = (props) => <RevealScreen {...props} figure={({ frame }) => <QuantitiesFigure frame={frame} />} />;
const Screen2 = (props) => <TableFill {...props} />;
const Screen3 = (props) => <RevealScreen {...props} figure={({ frame }) => <RuleFigure frame={frame} kind="speed" />} />;
const Screen4 = (props) => (
  <ChoiceScreen {...props} ordinal={1} figure={({ solved }) => <RuleFigure frame={solved ? 3 : 2} kind="speed" />} />
);
const Screen5 = (props) => <RevealScreen {...props} figure={({ frame }) => <RuleFigure frame={frame} kind="distance" />} />;
const Screen6 = (props) => <TableFill {...props} />;
const Screen7 = (props) => <RevealScreen {...props} figure={({ frame }) => <RuleFigure frame={frame} kind="time" />} />;
const Screen8 = (props) => (
  <ChoiceScreen {...props} ordinal={2} figure={({ solved }) => <RuleFigure frame={solved ? 3 : 2} kind="time" />} />
);
const Screen9 = (props) => <RevealScreen {...props} figure={({ frame }) => <UnitsFigure frame={frame} />} />;
const Screen10 = (props) => <TableFill {...props} />;
const Screen11 = (props) => <RevealScreen {...props} figure={({ frame }) => <TriangleFigure frame={frame} />} />;
const Screen12 = (props) => (
  <ChoiceScreen {...props} ordinal={3} stack figure={({ solved }) => <TriangleFigure mode="s12" solved={solved} />} />
);
const Screen13 = (props) => (
  <ChoiceScreen {...props} ordinal={4} stack figure={({ solved }) => <UnitErrorFigure solved={solved} />} />
);
const Screen14 = (props) => (
  <ChoiceScreen {...props} plain ratio="28 / 25" ordinal={5} figure={({ solved }) => <TramLineScene mode="final" solved={solved} />} />
);
const Screen15 = (props) => <SummaryScreen {...props} />;

const SCREENS = [
  Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7,
  Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15,
];

export default function Grade4Dars14(props) {
  return (
    <TheoryLessonRoot
      {...props}
      lessonMeta={LESSON_META}
      screenMeta={SCREEN_META}
      totalScreens={TOTAL_SCREENS}
      frameCounts={FRAME_COUNTS}
      content={CONTENT}
      screens={SCREENS}
      styles={KIT_STYLES}
    />
  );
}
