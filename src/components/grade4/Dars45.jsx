// ============================================================================
// 4-SINF · Dars 45 · Harakatga doir masalalar
//
// Manba: N. U. Bikbayeva, "Matematika. 4-sinf", o'zbek nashri, 122-127-bet
// "Harakatga doir masalalar":
//   122-bet 1-topshiriq — velosipedchi 48 km ni 4 soatda, 48 : 4 = 12 km/h;
//   123-bet — "Harakat tezligini topish uchun masofani vaqtga bo'lish kerak",
//     vertolyot 460 km 2 soatda, velosipedchi 39 km 3 soatda, jadval
//     Tezlik / Vaqt / Masofa;
//   123-bet 3-topshiriq — Odilbek 1 035 m ni 15 minutda;
//   123-bet 6-topshiriq — yuk avtomobili 1 800 km ni 18 soatda;
//   124-bet — piyoda 4 km/h tezlik bilan 3 soat: masofa = tezlik · vaqt.
// Syujet: boshqaruv markazining YO'L DISPETCHERLIGI (SYUJET_4SINF.md, 6-blok).
// 44-darsdan ko'prik: ombor kuni yopildi, yuklar yo'lga chiqadi.
//
// YADRO. Uchta kattalik bir-biriga bog'langan. Tezlik masofani vaqtga
// bo'lish bilan, masofa tezlikni vaqtga ko'paytirish bilan, vaqt esa
// masofani tezlikka bo'lish bilan topiladi.
//
// RITM: qisqa tushuntirish -> misol -> yana tushuntirish -> misol.
// Baholanadigan olti ekran: s2, s4, s6, s8, s10, s13.
// ============================================================================
import {
  BitSVG, Caption, ChoiceScreen, FitSvg, KIT_STYLES, NumPadScreen, RecordRow,
  RevealScreen, RuleRows, StepList, SummaryScreen, T, TableFill, TheoryLessonRoot,
  assertScreenTypeLabels, useT,
} from './kit/index.js';

const LESSON_META = {
  lessonId: 'motion-4-45-v2',
  slug: 'dars45-harakatga-doir-masalalar',
  lessonTitle: {
    uz: '45-dars. Harakatga doir masalalar',
    ru: 'Урок 45. Задачи на движение',
    en: 'Lesson 45. Motion problems',
  },
  skillTags: ['speed_meaning', 'speed_from_distance_time', 'distance_from_speed_time', 'time_from_distance_speed', 'speed_units'],
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

const FRAME_COUNTS = [4, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 3, 3, 3, 3, 3];

const CONTENT = {
  s0: {
    eyebrow: { uz: "Yo'l dispetcherligi", ru: 'Диспетчерская дорог', en: 'The route dispatch' },
    title: {
      uz: 'Tezlik xato chiqdi',
      ru: 'Скорость вышла неверной',
      en: 'The speed came out wrong',
    },
    question: {
      uz: 'Bit tezlikni topishda nima qildi?',
      ru: 'Что сделал Bit, находя скорость?',
      en: 'What did Bit do when finding the speed?',
    },
    options: [
      { uz: "Bo'lish o'rniga qo'shdi", ru: 'Сложил вместо деления', en: 'Added instead of dividing' },
      { uz: "Masofani noto'g'ri o'lchadi", ru: 'Неверно измерил расстояние', en: 'Measured the distance wrongly' },
      { uz: "Vaqtni noto'g'ri yozdi", ru: 'Неверно записал время', en: 'Wrote the time wrongly' },
      { uz: "Tezlik birligini almashtirdi", ru: 'Перепутал единицу скорости', en: 'Mixed up the unit of speed' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Tezlik masofani vaqtga bo'lish bilan topiladi, qo'shish bilan emas.",
      ru: 'Верно. Скорость находят делением расстояния на время, а не сложением.',
      en: 'Correct. Speed is found by dividing distance by time, not by adding.',
    },
    wrong: [
      null,
      {
        uz: "Masofa to'g'ri: yo'l qirq sakkiz kilometr deb belgilangan. Xato hisobda.",
        ru: 'Расстояние верно: путь отмечен как сорок восемь километров. Ошибка в вычислении.',
        en: 'The distance is right: the route is marked as forty eight kilometres. The error is in the calculation.',
      },
      {
        uz: "Vaqt ham to'g'ri: to'rt soat. Xato amalni tanlashda.",
        ru: 'Время тоже верно: четыре часа. Ошибка в выборе действия.',
        en: 'The time is right too: four hours. The error is in the choice of action.',
      },
      {
        uz: "Birlik to'g'ri yozilgan. Faqat son noto'g'ri hisoblangan.",
        ru: 'Единица записана верно. Неверно посчитано само число.',
        en: 'The unit is written correctly. Only the number itself was calculated wrongly.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Salom, do'stim! Ombor kuni yopildi va yuklar yo'lga chiqdi.",
          "Dispetcherlik yozib qo'ydi: mashina qirq sakkiz kilometr yo'lni to'rt soatda bosib o'tdi.",
          "Bit tezlikni ellik ikki deb yozdi. Dispetcher bunga ishonmadi.",
          "Sizningcha, Bit nima qildi? Javobni tanlang.",
        ],
        ru: [
          'Привет, друг! День склада закрыт, и грузы вышли в путь.',
          'Диспетчерская записала: машина прошла сорок восемь километров за четыре часа.',
          'Bit написал скорость пятьдесят два. Диспетчер этому не поверил.',
          'Как ты думаешь, что сделал Bit? Выбери ответ.',
        ],
        en: [
          'Hello, friend! The store day is closed and the loads have set off.',
          'The dispatch wrote down: the van covered forty eight kilometres in four hours.',
          'Bit wrote the speed as fifty two. The dispatcher did not believe it.',
          'What do you think Bit did? Choose an answer.',
        ],
      },
    },
  },

  s1: {
    eyebrow: { uz: 'Tezlik nima', ru: 'Что такое скорость', en: 'What speed is' },
    title: {
      uz: 'Bir soatda bosilgan yo\'l',
      ru: 'Путь за один час',
      en: 'The distance covered in one hour',
    },
    lead: {
      uz: "Tezlik bitta soatga to'g'ri keladigan masofani bildiradi.",
      ru: 'Скорость показывает расстояние, приходящееся на один час.',
      en: 'Speed shows the distance that falls on one hour.',
    },
    note: {
      uz: "Shuning uchun masofa vaqtga bo'linadi: butun yo'l soatlarga taqsimlanadi.",
      ru: 'Поэтому расстояние делят на время: весь путь распределяют по часам.',
      en: 'That is why distance is divided by time: the whole path is shared out among the hours.',
    },
    audio: {
      intro: {
        uz: [
          "Yo'lni to'rt teng bo'lakka ajratamiz, chunki harakat to'rt soat davom etdi.",
          "Har bir bo'lak bitta soatda bosilgan yo'l.",
          "Qirq sakkizni to'rtga bo'lsak, o'n ikki chiqadi.",
          "Demak mashina har soatda o'n ikki kilometr yurgan. Tezlik shu.",
        ],
        ru: [
          'Разделим путь на четыре равные части, ведь движение длилось четыре часа.',
          'Каждая часть это путь, пройденный за один час.',
          'Сорок восемь разделить на четыре, получится двенадцать.',
          'Значит, машина проходила двенадцать километров в час. Это и есть скорость.',
        ],
        en: [
          'Let us split the path into four equal pieces, because the journey lasted four hours.',
          'Each piece is the distance covered in one hour.',
          'Forty eight divided by four gives twelve.',
          'So the van covered twelve kilometres each hour. That is the speed.',
        ],
      },
    },
  },

  s2: {
    eyebrow: { uz: 'Vertolyot', ru: 'Вертолёт', en: 'The helicopter' },
    title: {
      uz: 'Vertolyot tezligi qancha?',
      ru: 'Какова скорость вертолёта?',
      en: 'What is the speed of the helicopter?',
    },
    question: {
      uz: 'Vertolyot 460 km ni 2 soatda uchdi. Tezligi qancha?',
      ru: 'Вертолёт пролетел 460 км за 2 часа. Какова его скорость?',
      en: 'A helicopter flew 460 km in 2 hours. What is its speed?',
    },
    options: [
      { uz: '230 km/h', ru: '230 км/ч', en: '230 km/h' },
      { uz: '920 km/h', ru: '920 км/ч', en: '920 km/h' },
      { uz: '462 km/h', ru: '462 км/ч', en: '462 km/h' },
      { uz: '458 km/h', ru: '458 км/ч', en: '458 km/h' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. To'rt yuz oltmishni ikkiga bo'lsak, ikki yuz o'ttiz chiqadi.",
      ru: 'Верно. Четыреста шестьдесят разделить на два — двести тридцать.',
      en: 'Correct. Four hundred and sixty divided by two is two hundred and thirty.',
    },
    wrong: [
      null,
      {
        uz: "Bu ko'paytirishning natijasi. Bir soatlik yo'l butun yo'ldan katta bo'lolmaydi.",
        ru: 'Это результат умножения. Путь за час не может быть больше всего пути.',
        en: 'That is the result of multiplication. The hourly distance cannot exceed the whole path.',
      },
      {
        uz: "Bu qo'shish natijasi. Tezlik uchun bo'lish kerak.",
        ru: 'Это результат сложения. Для скорости нужно деление.',
        en: 'That is the result of addition. Speed needs division.',
      },
      {
        uz: "Bu ayirish natijasi. Vaqt masofadan ayirilmaydi.",
        ru: 'Это результат вычитания. Время из расстояния не вычитают.',
        en: 'That is the result of subtraction. Time is not taken away from distance.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Dispetcherlikka yangi yozuv keldi: vertolyot to'rt yuz oltmish kilometrni ikki soatda uchdi.",
          "Tezlikni topish uchun masofani vaqtga bo'lamiz.",
          "Vertolyot tezligi qancha? Javobni tanlang.",
        ],
        ru: [
          'В диспетчерскую поступила новая запись: вертолёт пролетел четыреста шестьдесят километров за два часа.',
          'Чтобы найти скорость, делим расстояние на время.',
          'Какова скорость вертолёта? Выбери ответ.',
        ],
        en: [
          'A new record reached the dispatch: a helicopter flew four hundred and sixty kilometres in two hours.',
          'To find the speed we divide the distance by the time.',
          'What is the speed of the helicopter? Choose an answer.',
        ],
      },
    },
  },

  s3: {
    eyebrow: { uz: 'Uchta kattalik', ru: 'Три величины', en: 'Three quantities' },
    title: {
      uz: 'Tezlik, vaqt, masofa',
      ru: 'Скорость, время, расстояние',
      en: 'Speed, time, distance',
    },
    lead: {
      uz: "Uchtasidan ikkitasi ma'lum bo'lsa, uchinchisi doim topiladi.",
      ru: 'Если известны две из трёх величин, третью всегда можно найти.',
      en: 'If two of the three are known, the third can always be found.',
    },
    note: {
      uz: 'Darslik jadvali shu uch ustundan iborat.',
      ru: 'Таблица учебника состоит из этих трёх столбцов.',
      en: 'The textbook table consists of these three columns.',
    },
    audio: {
      intro: {
        uz: [
          "Dispetcherlik jadval yuritadi. Unda uchta ustun bor: tezlik, vaqt va masofa.",
          "Birinchi qatorda vertolyot: ikki yuz o'ttiz, ikki soat, to'rt yuz oltmish kilometr.",
          "Ikkinchi qatorda velosipedchi: o'n uch, uch soat, o'ttiz to'qqiz kilometr.",
          "Har qatorda ikkita son berilsa, uchinchisini hisoblab qo'yish mumkin.",
        ],
        ru: [
          'Диспетчерская ведёт таблицу. В ней три столбца: скорость, время и расстояние.',
          'В первой строке вертолёт: двести тридцать, два часа, четыреста шестьдесят километров.',
          'Во второй строке велосипедист: тринадцать, три часа, тридцать девять километров.',
          'Если в строке даны два числа, третье всегда можно вычислить.',
        ],
        en: [
          'The dispatch keeps a table. It has three columns: speed, time and distance.',
          'The first row holds the helicopter: two hundred and thirty, two hours, four hundred and sixty kilometres.',
          'The second row holds the cyclist: thirteen, three hours, thirty nine kilometres.',
          'If two numbers in a row are given, the third can always be worked out.',
        ],
      },
    },
  },

  s4: {
    eyebrow: { uz: 'Jadvalni to\'ldiring', ru: 'Заполни таблицу', en: 'Fill in the table' },
    title: {
      uz: 'Velosipedchi tezligi',
      ru: 'Скорость велосипедиста',
      en: 'The speed of the cyclist',
    },
    question: {
      uz: 'Bo\'sh katakka qaysi son turadi?',
      ru: 'Какое число встанет в пустую клетку?',
      en: 'Which number goes into the empty cell?',
    },
    columns: [
      { uz: 'Tezlik', ru: 'Скорость', en: 'Speed' },
      { uz: 'Vaqt', ru: 'Время', en: 'Time' },
      { uz: 'Masofa', ru: 'Расстояние', en: 'Distance' },
    ],
    rows: [
      [{ uz: '230', ru: '230', en: '230' }, { uz: '2', ru: '2', en: '2' }, { uz: '460', ru: '460', en: '460' }],
      [null, { uz: '3', ru: '3', en: '3' }, { uz: '39', ru: '39', en: '39' }],
    ],
    chips: [
      { uz: '13', ru: '13', en: '13' },
      { uz: '117', ru: '117', en: '117' },
      { uz: '36', ru: '36', en: '36' },
      { uz: '42', ru: '42', en: '42' },
    ],
    correctChip: 0,
    correctText: {
      uz: "To'g'ri. O'ttiz to'qqizni uchga bo'lsak, o'n uch chiqadi.",
      ru: 'Верно. Тридцать девять разделить на три — тринадцать.',
      en: 'Correct. Thirty nine divided by three is thirteen.',
    },
    wrong: [
      null,
      {
        uz: "Bu ko'paytirish natijasi. Tezlik masofadan kichik bo'ladi.",
        ru: 'Это результат умножения. Скорость меньше расстояния.',
        en: 'That is the result of multiplication. The speed is smaller than the distance.',
      },
      {
        uz: "Bu ayirish natijasi. Vaqt masofadan ayirilmaydi.",
        ru: 'Это результат вычитания. Время из расстояния не вычитают.',
        en: 'That is the result of subtraction. Time is not taken from distance.',
      },
      {
        uz: "Bu qo'shish natijasi. Tezlik uchun bo'lish kerak.",
        ru: 'Это результат сложения. Для скорости нужно деление.',
        en: 'That is the result of addition. Speed needs division.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Jadvalning birinchi qatori to'liq, ikkinchisida tezlik ustuni bo'sh.",
          "Velosipedchi o'ttiz to'qqiz kilometrni uch soatda bosib o'tdi.",
          "Bo'sh katakka qaysi son turadi? Javobni tanlang.",
        ],
        ru: [
          'Первая строка таблицы полная, во второй пуст столбец скорости.',
          'Велосипедист проехал тридцать девять километров за три часа.',
          'Какое число встанет в пустую клетку? Выбери ответ.',
        ],
        en: [
          'The first row of the table is complete, in the second the speed column is empty.',
          'The cyclist covered thirty nine kilometres in three hours.',
          'Which number goes into the empty cell? Choose an answer.',
        ],
      },
    },
  },

  s5: {
    eyebrow: { uz: 'Masofani topish', ru: 'Найти расстояние', en: 'Finding the distance' },
    title: {
      uz: 'Har soatda bir xil yo\'l',
      ru: 'Каждый час один и тот же путь',
      en: 'The same path every hour',
    },
    lead: {
      uz: "Tezlik va vaqt ma'lum bo'lsa, masofa ko'paytirish bilan topiladi.",
      ru: 'Если известны скорость и время, расстояние находят умножением.',
      en: 'If speed and time are known, the distance is found by multiplication.',
    },
    note: {
      uz: 'Bir xil bo\'laklarni yig\'ish — bu ko\'paytirish.',
      ru: 'Сложение одинаковых частей и есть умножение.',
      en: 'Adding equal pieces is exactly what multiplication is.',
    },
    audio: {
      intro: {
        uz: [
          "Darslik piyoda haqida yozadi: u soatiga to'rt kilometr tezlik bilan uch soat yurdi.",
          "Har soatda to'rt kilometrdan bosib o'tdi. Uchta bir xil bo'lak hosil bo'ldi.",
          "To'rt qo'shuv to'rt qo'shuv to'rt, ya'ni to'rtni uchga ko'paytiramiz.",
          "O'n ikki kilometr chiqdi. Masofa tezlikni vaqtga ko'paytirish bilan topiladi.",
        ],
        ru: [
          'Учебник пишет о пешеходе: он шёл со скоростью четыре километра в час три часа.',
          'Каждый час он проходил по четыре километра. Получились три одинаковые части.',
          'Четыре плюс четыре плюс четыре, то есть четыре умножить на три.',
          'Получилось двенадцать километров. Расстояние находят умножением скорости на время.',
        ],
        en: [
          'The textbook writes about a walker: he went at four kilometres an hour for three hours.',
          'Each hour he covered four kilometres. Three equal pieces appeared.',
          'Four plus four plus four, that is four multiplied by three.',
          'That makes twelve kilometres. Distance is found by multiplying speed by time.',
        ],
      },
    },
  },

  s6: {
    eyebrow: { uz: 'Terib javob bering', ru: 'Набери ответ', en: 'Type the answer' },
    title: {
      uz: 'Mototsiklchi yo\'li',
      ru: 'Путь мотоциклиста',
      en: 'The motorcyclist path',
    },
    question: {
      uz: 'Mototsiklchi 45 km/h bilan 4 soat yurdi. Necha km?',
      ru: 'Мотоциклист ехал 4 часа со скоростью 45 км/ч. Сколько км?',
      en: 'A motorcyclist rode for 4 hours at 45 km/h. How many km?',
    },
    answer: 180,
    unit: { uz: 'km', ru: 'км', en: 'km' },
    correctText: {
      uz: "To'g'ri. Qirq beshni to'rtga ko'paytirsak, bir yuz sakson kilometr chiqadi.",
      ru: 'Верно. Сорок пять умножить на четыре — сто восемьдесят километров.',
      en: 'Correct. Forty five multiplied by four is one hundred and eighty kilometres.',
    },
    wrong: {
      uz: "Hali emas. Har soatda qirq besh kilometrdan yurgan. To'rt soatni hisobga oling.",
      ru: 'Пока нет. Каждый час он проезжал сорок пять километров. Учти четыре часа.',
      en: 'Not yet. Each hour he covered forty five kilometres. Take the four hours into account.',
    },
    hintAfter: {
      uz: "Tezlikni vaqtga ko'paytiring: qirq beshni to'rtga.",
      ru: 'Умножь скорость на время: сорок пять на четыре.',
      en: 'Multiply the speed by the time: forty five by four.',
    },
    audio: {
      intro: {
        uz: [
          "Dispetcherlik mototsiklchini yo'lga chiqardi. Uning tezligi soatiga qirq besh kilometr.",
          "U to'rt soat yurdi.",
          "Qancha masofa bosib o'tdi? Javobni tering va tasdiqlang.",
        ],
        ru: [
          'Диспетчерская отправила в путь мотоциклиста. Его скорость сорок пять километров в час.',
          'Он ехал четыре часа.',
          'Какое расстояние он проехал? Набери ответ и подтверди.',
        ],
        en: [
          'The dispatch sent a motorcyclist on the road. His speed is forty five kilometres an hour.',
          'He rode for four hours.',
          'What distance did he cover? Type the answer and confirm.',
        ],
      },
    },
  },

  s7: {
    eyebrow: { uz: 'Vaqtni topish', ru: 'Найти время', en: 'Finding the time' },
    title: {
      uz: 'Yo\'l qancha davom etadi?',
      ru: 'Сколько продлится путь?',
      en: 'How long will the journey last?',
    },
    lead: {
      uz: "Masofani tezlikka bo'lsak, necha soat kerakligi chiqadi.",
      ru: 'Разделив расстояние на скорость, узнаем, сколько часов нужно.',
      en: 'Dividing the distance by the speed tells how many hours are needed.',
    },
    note: {
      uz: "Savol qaysi kattalik haqida ekanini aniqlash birinchi qadam.",
      ru: 'Первый шаг — понять, о какой величине спрашивают.',
      en: 'The first step is to see which quantity the question is about.',
    },
    audio: {
      intro: {
        uz: [
          "Xalqaro yuk mashinasi bir ming sakkiz yuz kilometr yo'lga chiqadi.",
          "Uning tezligi soatiga bir yuz kilometr.",
          "Har soatda bir yuz kilometrdan bosadi, demak butun yo'lni bir yuzga bo'lamiz.",
          "O'n sakkiz soat chiqdi. Vaqt masofani tezlikka bo'lish bilan topiladi.",
        ],
        ru: [
          'Международный грузовик выходит на путь в тысячу восемьсот километров.',
          'Его скорость сто километров в час.',
          'Каждый час он проходит по сто километров, значит весь путь делим на сто.',
          'Получилось восемнадцать часов. Время находят делением расстояния на скорость.',
        ],
        en: [
          'An international lorry sets out on a road of one thousand eight hundred kilometres.',
          'Its speed is one hundred kilometres an hour.',
          'Each hour it covers one hundred kilometres, so we divide the whole path by one hundred.',
          'That gives eighteen hours. Time is found by dividing distance by speed.',
        ],
      },
    },
  },

  s8: {
    eyebrow: { uz: 'Qancha vaqt?', ru: 'Сколько времени?', en: 'How much time?' },
    title: {
      uz: 'Yuk qachon yetadi?',
      ru: 'Когда груз доедет?',
      en: 'When will the load arrive?',
    },
    question: {
      uz: 'Masofa 240 km, tezlik 60 km/h. Yo\'l necha soat davom etadi?',
      ru: 'Расстояние 240 км, скорость 60 км/ч. Сколько часов займёт путь?',
      en: 'The distance is 240 km, the speed is 60 km/h. How many hours does it take?',
    },
    options: [
      { uz: '4 soat', ru: '4 часа', en: '4 hours' },
      { uz: '3 soat', ru: '3 часа', en: '3 hours' },
      { uz: '180 soat', ru: '180 часов', en: '180 hours' },
      { uz: '300 soat', ru: '300 часов', en: '300 hours' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Ikki yuz qirqni oltmishga bo'lsak, to'rt soat chiqadi.",
      ru: 'Верно. Двести сорок разделить на шестьдесят — четыре часа.',
      en: 'Correct. Two hundred and forty divided by sixty is four hours.',
    },
    wrong: [
      null,
      {
        uz: "Uch soatda faqat bir yuz sakson kilometr bosiladi. Yo'l esa uzunroq.",
        ru: 'За три часа пройдут только сто восемьдесят километров. А путь длиннее.',
        en: 'In three hours only one hundred and eighty kilometres are covered. The road is longer.',
      },
      {
        uz: "Bu ayirish natijasi. Vaqt uchun bo'lish kerak.",
        ru: 'Это результат вычитания. Для времени нужно деление.',
        en: 'That is the result of subtraction. Time needs division.',
      },
      {
        uz: "Bu qo'shish natijasi. Bunday uzoq yo'l bu yerda yo'q.",
        ru: 'Это результат сложения. Такого долгого пути здесь нет.',
        en: 'That is the result of addition. There is no such long journey here.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Dispetcherlik yangi yo'lni rejalashtirmoqda: masofa ikki yuz qirq kilometr.",
          "Mashinaning tezligi soatiga oltmish kilometr.",
          "Yo'l necha soat davom etadi? Javobni tanlang.",
        ],
        ru: [
          'Диспетчерская планирует новый рейс: расстояние двести сорок километров.',
          'Скорость машины шестьдесят километров в час.',
          'Сколько часов займёт путь? Выбери ответ.',
        ],
        en: [
          'The dispatch is planning a new run: the distance is two hundred and forty kilometres.',
          'The speed of the van is sixty kilometres an hour.',
          'How many hours does the journey take? Choose an answer.',
        ],
      },
    },
  },

  s9: {
    eyebrow: { uz: 'Tezlik birligi', ru: 'Единица скорости', en: 'The unit of speed' },
    title: {
      uz: 'Birlik nimani aytadi?',
      ru: 'Что говорит единица?',
      en: 'What does the unit say?',
    },
    lead: {
      uz: "Tezlik birligi qaysi masofa qaysi vaqtga to'g'ri kelishini bildiradi.",
      ru: 'Единица скорости показывает, какое расстояние приходится на какое время.',
      en: 'The unit of speed shows which distance falls on which time.',
    },
    note: {
      uz: 'Darslikda: km/h, km/min, km/s, m/min, m/s.',
      ru: 'В учебнике: км/ч, км/мин, км/с, м/мин, м/с.',
      en: 'In the textbook: km/h, km/min, km/s, m/min, m/s.',
    },
    audio: {
      intro: {
        uz: [
          "Har harakat o'z birligi bilan yoziladi. Kilometr soatiga eng ko'p uchraydi.",
          "Odilbek uydan maktabgacha bir ming o'ttiz besh metrni o'n besh minutda yurdi.",
          "Bir ming o'ttiz beshni o'n beshga bo'lsak, oltmish to'qqiz chiqadi.",
          "Bu yerda tezlik minutiga oltmish to'qqiz metr. Birlik masofa va vaqtdan yig'iladi.",
        ],
        ru: [
          'Каждое движение записывают со своей единицей. Километр в час встречается чаще всего.',
          'Одилбек прошёл от дома до школы тысячу тридцать пять метров за пятнадцать минут.',
          'Тысячу тридцать пять разделить на пятнадцать, получится шестьдесят девять.',
          'Здесь скорость шестьдесят девять метров в минуту. Единица складывается из расстояния и времени.',
        ],
        en: [
          'Every movement is written with its own unit. Kilometres per hour is the most common.',
          'Odilbek walked one thousand and thirty five metres from home to school in fifteen minutes.',
          'One thousand and thirty five divided by fifteen gives sixty nine.',
          'Here the speed is sixty nine metres a minute. The unit is built from a distance and a time.',
        ],
      },
    },
  },

  s10: {
    eyebrow: { uz: 'Birlikni o\'qish', ru: 'Чтение единицы', en: 'Reading the unit' },
    title: {
      uz: 'Piyodaning tezligi 5 km/h',
      ru: 'Скорость пешехода 5 км/ч',
      en: 'The speed of a walker is 5 km/h',
    },
    question: {
      uz: 'Bu yozuv nimani bildiradi?',
      ru: 'Что означает эта запись?',
      en: 'What does this record mean?',
    },
    options: [
      { uz: 'Har soatda 5 km yuradi', ru: 'Каждый час проходит 5 км', en: 'He covers 5 km every hour' },
      { uz: '5 soatda 1 km yuradi', ru: 'За 5 часов проходит 1 км', en: 'He covers 1 km in 5 hours' },
      { uz: 'Jami 5 km yuradi', ru: 'Всего проходит 5 км', en: 'He covers 5 km in total' },
      { uz: '5 daqiqada 1 km yuradi', ru: 'За 5 минут проходит 1 км', en: 'He covers 1 km in 5 minutes' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Birlikda avval masofa, keyin vaqt turadi: har soatga besh kilometr.",
      ru: 'Верно. В единице сначала расстояние, потом время: пять километров на каждый час.',
      en: 'Correct. The unit names the distance first and the time second: five kilometres for each hour.',
    },
    wrong: [
      null,
      {
        uz: "Bu teskari o'qish. Birlikda masofa oldinda, vaqt esa keyin turadi.",
        ru: 'Это обратное чтение. В единице расстояние впереди, а время после.',
        en: 'That is a reversed reading. In the unit the distance comes first and the time after.',
      },
      {
        uz: "Tezlik jami yo'lni bildirmaydi. Jami yo'l vaqtga bog'liq.",
        ru: 'Скорость не означает весь путь. Весь путь зависит от времени.',
        en: 'Speed does not mean the whole path. The whole path depends on the time.',
      },
      {
        uz: "Bu yerda birlik soatga tegishli, minutga emas.",
        ru: 'Здесь единица относится к часу, а не к минуте.',
        en: 'Here the unit refers to an hour, not to a minute.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Dispetcherlikda piyoda yo'llari ham qayd etiladi.",
          "Yozuvda piyodaning tezligi soatiga besh kilometr deb ko'rsatilgan.",
          "Bu nimani bildiradi? Javobni tanlang.",
        ],
        ru: [
          'В диспетчерской отмечают и пешеходные маршруты.',
          'В записи указано, что скорость пешехода пять километров в час.',
          'Что это означает? Выбери ответ.',
        ],
        en: [
          'The dispatch also records walking routes.',
          'The record says the speed of the walker is five kilometres an hour.',
          'What does that mean? Choose an answer.',
        ],
      },
    },
  },

  s11: {
    eyebrow: { uz: 'Yodda tuting', ru: 'Запомни', en: 'Keep in mind' },
    title: {
      uz: 'Uchta bog\'lanish',
      ru: 'Три связи',
      en: 'Three links',
    },
    lead: {
      uz: 'Qaysi kattalik so\'ralsa, shu qatordagi amal ishlaydi.',
      ru: 'О какой величине спрашивают, та строка и работает.',
      en: 'Whichever quantity is asked for, that line is the one that works.',
    },
    audio: {
      intro: {
        uz: [
          "Qoidani yig'amiz. Tezlikni topish uchun masofani vaqtga bo'lamiz.",
          "Masofani topish uchun tezlikni vaqtga ko'paytiramiz.",
          "Vaqtni topish uchun masofani tezlikka bo'lamiz. Uchala bog'lanish bitta jadvalda yashaydi.",
        ],
        ru: [
          'Соберём правило. Чтобы найти скорость, делим расстояние на время.',
          'Чтобы найти расстояние, умножаем скорость на время.',
          'Чтобы найти время, делим расстояние на скорость. Все три связи живут в одной таблице.',
        ],
        en: [
          'Let us put the rule together. To find the speed we divide the distance by the time.',
          'To find the distance we multiply the speed by the time.',
          'To find the time we divide the distance by the speed. All three links live in one table.',
        ],
      },
    },
  },

  s12: {
    eyebrow: { uz: 'Qaysi amal?', ru: 'Какое действие?', en: 'Which action?' },
    title: {
      uz: 'Savolga qarab amal',
      ru: 'Действие по вопросу',
      en: 'The action follows the question',
    },
    question: {
      uz: 'Tezlik va vaqt ma\'lum. Masofa uchun qaysi amal?',
      ru: 'Известны скорость и время. Какое действие для расстояния?',
      en: 'Speed and time are known. Which action gives the distance?',
    },
    options: [
      { uz: "Ko'paytirish", ru: 'Умножение', en: 'Multiplication' },
      { uz: "Bo'lish", ru: 'Деление', en: 'Division' },
      { uz: "Qo'shish", ru: 'Сложение', en: 'Addition' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Har soatdagi yo'l bir necha marta takrorlanadi, bu esa ko'paytirish.",
      ru: 'Верно. Путь за час повторяется несколько раз, а это умножение.',
      en: 'Correct. The hourly distance repeats several times, and that is multiplication.',
    },
    wrong: [
      null,
      {
        uz: "Bo'lish tezlik yoki vaqt so'ralganda kerak bo'ladi. Bu yerda ular ma'lum.",
        ru: 'Деление нужно, когда спрашивают скорость или время. Здесь они известны.',
        en: 'Division is needed when speed or time is asked for. Here both are known.',
      },
      {
        uz: "Qo'shish bu yerda ma'no bermaydi: tezlik va vaqt har xil kattaliklar.",
        ru: 'Сложение здесь не имеет смысла: скорость и время — разные величины.',
        en: 'Addition makes no sense here: speed and time are different quantities.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Dispetcher yangi topshiriq oldi: tezlik va vaqt ma'lum, masofa noma'lum.",
          "Har savolning o'z amali bor.",
          "Masofa uchun qaysi amal kerak? Javobni tanlang.",
        ],
        ru: [
          'Диспетчер получил новую задачу: скорость и время известны, расстояние неизвестно.',
          'У каждого вопроса своё действие.',
          'Какое действие нужно для расстояния? Выбери ответ.',
        ],
        en: [
          'The dispatcher got a new task: speed and time are known, the distance is not.',
          'Each question has its own action.',
          'Which action is needed for the distance? Choose an answer.',
        ],
      },
    },
  },

  s13: {
    eyebrow: { uz: "Bitning yozuvi", ru: 'Запись Bit', en: 'Bit record' },
    title: {
      uz: 'Bit qaysi qatorda adashdi?',
      ru: 'В какой строке ошибся Bit?',
      en: 'In which line did Bit go wrong?',
    },
    question: {
      uz: 'Bit vaqtni topmoqchi edi. Xato nimada?',
      ru: 'Bit хотел найти время. В чём ошибка?',
      en: 'Bit wanted to find the time. What is the error?',
    },
    steps: [
      { uz: 'Masofa: 240 km', ru: 'Расстояние: 240 км', en: 'Distance: 240 km' },
      { uz: 'Tezlik: 60 km/h', ru: 'Скорость: 60 км/ч', en: 'Speed: 60 km/h' },
      { uz: 'Vaqt: 60 : 240', ru: 'Время: 60 : 240', en: 'Time: 60 : 240' },
      { uz: 'Javob: 0 soat', ru: 'Ответ: 0 часов', en: 'Answer: 0 hours' },
    ],
    options: [
      { uz: "Masofa tezlikka bo'linishi kerak edi", ru: 'Расстояние нужно было делить на скорость', en: 'The distance had to be divided by the speed' },
      { uz: "Tezlik masofaga ko'paytirilishi kerak edi", ru: 'Скорость нужно было умножить на расстояние', en: 'The speed had to be multiplied by the distance' },
      { uz: "Masofa noto'g'ri yozilgan", ru: 'Расстояние записано неверно', en: 'The distance was written wrongly' },
      { uz: 'Xato yo\'q', ru: 'Ошибки нет', en: 'There is no error' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Sonlar o'rin almashgan. Ikki yuz qirqni oltmishga bo'lsak, to'rt soat chiqadi.",
      ru: 'Верно. Числа поменялись местами. Двести сорок разделить на шестьдесят — четыре часа.',
      en: 'Correct. The numbers swapped places. Two hundred and forty divided by sixty is four hours.',
    },
    wrong: [
      null,
      {
        uz: "Ko'paytirish masofani beradi, vaqtni emas. Bu yerda masofa allaqachon ma'lum.",
        ru: 'Умножение даёт расстояние, а не время. Здесь расстояние уже известно.',
        en: 'Multiplication gives the distance, not the time. Here the distance is already known.',
      },
      {
        uz: "Masofa to'g'ri yozilgan. Xato uchinchi qatordagi tartibda.",
        ru: 'Расстояние записано верно. Ошибка в порядке в третьей строке.',
        en: 'The distance is written correctly. The error is in the order in the third line.',
      },
      {
        uz: "Nol soat javob bo'lolmaydi: mashina yo'lda edi.",
        ru: 'Ноль часов не может быть ответом: машина была в пути.',
        en: 'Zero hours cannot be the answer: the van was on the road.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Bit vaqtni hisoblab, dispetcherlikka yubordi.",
          "Uning to'rt qatori ekranda. Javob nol soat chiqqan.",
          "Xato nimada? Javobni tanlang.",
        ],
        ru: [
          'Bit посчитал время и отправил в диспетчерскую.',
          'Его четыре строки на экране. Ответ вышел ноль часов.',
          'В чём ошибка? Выбери ответ.',
        ],
        en: [
          'Bit worked out the time and sent it to the dispatch.',
          'His four lines are on the screen. The answer came out as zero hours.',
          'What is the error? Choose an answer.',
        ],
      },
    },
  },

  s14: {
    eyebrow: { uz: 'Shahar qarori', ru: 'Решение города', en: 'The city decision' },
    title: {
      uz: 'Qaysi yozuv yo\'lga chiqaradi?',
      ru: 'Какая запись отправит в путь?',
      en: 'Which record sends the load off?',
    },
    question: {
      uz: '48 km, 4 soat. Qaysi yozuv to\'g\'ri?',
      ru: '48 км, 4 часа. Какая запись верна?',
      en: '48 km, 4 hours. Which record is right?',
    },
    options: [
      { uz: 'Tezlik: 48 : 4 = 12', ru: 'Скорость: 48 : 4 = 12', en: 'Speed: 48 : 4 = 12' },
      { uz: 'Tezlik: 48 + 4 = 52', ru: 'Скорость: 48 + 4 = 52', en: 'Speed: 48 + 4 = 52' },
      { uz: 'Tezlik: 48 · 4 = 192', ru: 'Скорость: 48 · 4 = 192', en: 'Speed: 48 · 4 = 192' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Dispetcherlik yozuvni qabul qildi va yuk yo'lga chiqdi.",
      ru: 'Верно. Диспетчерская приняла запись, и груз вышел в путь.',
      en: 'Correct. The dispatch accepted the record and the load set off.',
    },
    wrong: [
      null,
      {
        uz: "Bu Bitning boshidagi xatosi. Tezlik uchun bo'lish kerak.",
        ru: 'Это первоначальная ошибка Bit. Для скорости нужно деление.',
        en: 'That is Bit original error. Speed needs division.',
      },
      {
        uz: "Ko'paytirish masofani beradi, tezlikni emas.",
        ru: 'Умножение даёт расстояние, а не скорость.',
        en: 'Multiplication gives the distance, not the speed.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Dispetcherlik uchta yozuvni ko'rib chiqmoqda.",
          "Yo'l qirq sakkiz kilometr, vaqt to'rt soat. Tezlik so'ralyapti.",
          "Qaysi yozuv to'g'ri? Javobni tanlang.",
        ],
        ru: [
          'Диспетчерская рассматривает три записи.',
          'Путь сорок восемь километров, время четыре часа. Спрашивают скорость.',
          'Какая запись верна? Выбери ответ.',
        ],
        en: [
          'The dispatch is looking at three records.',
          'The road is forty eight kilometres and the time is four hours. The speed is asked for.',
          'Which record is right? Choose an answer.',
        ],
      },
    },
  },

  s15: {
    eyebrow: { uz: 'Mukofot', ru: 'Награда', en: 'Reward' },
    stageLabel: { uz: 'YAKUNIY BOSQICH', ru: 'ФИНАЛЬНЫЙ ЭТАП', en: 'FINAL STAGE' },
    headTitle: {
      uz: 'Unvongacha bitta savol',
      ru: 'Один вопрос до звания',
      en: 'One question before your title',
    },
    headLead: {
      uz: "Qoidani tanlang va harakat bog'lanishini tushunganingizni ko'rsating.",
      ru: 'Выбери правило и покажи, что понимаешь связь движения.',
      en: 'Choose the rule and show that you understand the motion link.',
    },
    questionKicker: { uz: 'YAKUNIY SAVOL', ru: 'ФИНАЛЬНЫЙ ВОПРОС', en: 'FINAL QUESTION' },
    stepLabel: { uz: '1 QADAM', ru: '1 ШАГ', en: '1 STEP' },
    reflectionQuestion: {
      uz: 'Tezlik qanday topiladi?',
      ru: 'Как находят скорость?',
      en: 'How is speed found?',
    },
    reflectionStart: {
      uz: 'Bitta javobni tanlang.',
      ru: 'Выбери один ответ.',
      en: 'Choose one answer.',
    },
    reflectionOptions: [
      { uz: "Masofani vaqtga bo'lib", ru: 'Делением расстояния на время', en: 'By dividing the distance by the time' },
      { uz: "Masofani vaqtga ko'paytirib", ru: 'Умножением расстояния на время', en: 'By multiplying the distance by the time' },
      { uz: "Masofaga vaqtni qo'shib", ru: 'Прибавлением времени к расстоянию', en: 'By adding the time to the distance' },
    ],
    reflectionCorrectIndex: 0,
    reflectionCorrect: {
      uz: 'Shunday. Butun yo\'l soatlarga taqsimlanadi va bitta soatning ulushi chiqadi.',
      ru: 'Именно так. Весь путь распределяют по часам и получают долю одного часа.',
      en: 'Exactly. The whole path is shared among the hours and the share of one hour appears.',
    },
    reflectionWrong: {
      uz: "Hali emas. Yo'l to'rt bo'lakka bo'lingan chizmani eslang.",
      ru: 'Пока нет. Вспомни чертёж, где путь разделили на четыре части.',
      en: 'Not yet. Remember the drawing where the path was split into four pieces.',
    },
    rewardAnnounce: { uz: 'Unvon olindi:', ru: 'Звание получено:', en: 'Title earned:' },
    mainLabel: { uz: 'Darsning uch qoidasi', ru: 'Три правила урока', en: 'The three rules of the lesson' },
    main: [
      { uz: "Tezlik: masofani vaqtga bo'lamiz.", ru: 'Скорость: делим расстояние на время.', en: 'Speed: divide the distance by the time.' },
      { uz: "Masofa: tezlikni vaqtga ko'paytiramiz.", ru: 'Расстояние: умножаем скорость на время.', en: 'Distance: multiply the speed by the time.' },
      { uz: "Vaqt: masofani tezlikka bo'lamiz.", ru: 'Время: делим расстояние на скорость.', en: 'Time: divide the distance by the speed.' },
      { uz: 'Birlik masofa va vaqtdan yig\'iladi.', ru: 'Единица складывается из расстояния и времени.', en: 'The unit is built from a distance and a time.' },
    ],
    awards: [
      {
        min: 6,
        title: { uz: "Yo'l dispetcheri", ru: 'Дорожный диспетчер', en: 'Route dispatcher' },
        text: { uz: 'Barcha oltita vazifa birinchi urinishda yechildi.', ru: 'Все шесть заданий решены с первой попытки.', en: 'All six tasks were solved on the first attempt.' },
      },
      {
        min: 4,
        title: { uz: 'Marshrut hisobchisi', ru: 'Счётчик маршрутов', en: 'Route calculator' },
        text: { uz: "Siz uchta kattalikni ishonchli bog'laysiz.", ru: 'Ты уверенно связываешь три величины.', en: 'You link the three quantities with confidence.' },
      },
      {
        min: 0,
        title: { uz: 'Dispetcherlik shogirdi', ru: 'Помощник диспетчера', en: 'Dispatch assistant' },
        text: { uz: "Asos qo'yildi. Qoidani takrorlab, natijani yaxshilashga harakat qiling.", ru: 'Основа заложена. Повтори правило и попробуй улучшить результат.', en: 'The base is laid. Repeat the rule and try to improve the result.' },
      },
    ],
    nextLabel: { uz: 'Keyingi missiya', ru: 'Следующая миссия', en: 'Next mission' },
    nextText: {
      uz: "Yuklar yo'lga chiqdi. Endi markaz ularni taqsimlaydi: butunning bir qismi kerak bo'ladi.",
      ru: 'Грузы вышли в путь. Теперь центр распределяет их: понадобится часть целого.',
      en: 'The loads are on the road. Now the centre shares them out: a part of a whole will be needed.',
    },
    audio: {
      intro: {
        uz: [
          "Barcha marshrutlar hisoblandi va yuklar yo'lga chiqdi.",
          "Endi bitta savol qoldi. Qoidani tanlang va unvonni oling.",
          "Tezlik qanday topiladi? Javobni tanlang.",
        ],
        ru: [
          'Все маршруты рассчитаны, и грузы вышли в путь.',
          'Остался один вопрос. Выбери правило и получи звание.',
          'Как находят скорость? Выбери ответ.',
        ],
        en: [
          'All the routes are calculated and the loads have set off.',
          'One question is left. Choose the rule and claim your title.',
          'How is speed found? Choose an answer.',
        ],
      },
    },
  },
};

// ---------------------------------------------------------------------------
// CHIZMALAR
//
// Darsning tayanchi — YO'L LENTASI: butun masofa soatlarga teng bo'laklarga
// bo'linadi. Shunda tezlik "bitta bo'lak", masofa "bo'laklar yig'indisi",
// vaqt esa "bo'laklar soni" bo'lib ko'rinadi.
// ---------------------------------------------------------------------------

// s0, s14: dispetcherlik taxtasi (to'q sahna).
const DispatchBoard = ({ fixed }) => {
  const t = useT();
  return (
    <FitSvg viewBox="0 0 900 300">
      <defs>
        <linearGradient id="d45panel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#123246" />
          <stop offset="100%" stopColor="#0A2233" />
        </linearGradient>
      </defs>
      <rect x="40" y="24" width="820" height="252" rx="20" fill="url(#d45panel)" stroke="rgba(144,228,235,.28)" strokeWidth="2" />
      <text x="72" y="60" fill="#9DE3E7" fontSize="14" fontWeight="800" letterSpacing="3" fontFamily="JetBrains Mono, monospace">
        {t({ uz: 'MARSHRUT VARAQASI', ru: 'МАРШРУТНЫЙ ЛИСТ', en: 'ROUTE SHEET' })}
      </text>

      {/* yo'l chizig'i */}
      <line x1="96" y1="120" x2="808" y2="120" stroke="rgba(144,228,235,.35)" strokeWidth="4" strokeDasharray="14 10" />
      <circle cx="96" cy="120" r="9" fill={T.lime} />
      <circle cx="808" cy="120" r="9" fill="#FFB39B" />
      <text x="96" y="100" textAnchor="middle" fill="#9DE3E7" fontSize="12" fontWeight="750" fontFamily="Manrope, sans-serif">
        {t({ uz: 'ombor', ru: 'склад', en: 'store' })}
      </text>
      <text x="808" y="100" textAnchor="middle" fill="#9DE3E7" fontSize="12" fontWeight="750" fontFamily="Manrope, sans-serif">
        {t({ uz: 'tuman', ru: 'район', en: 'district' })}
      </text>

      <rect x="96" y="146" width="340" height="76" rx="14" fill="rgba(121,211,218,.12)" stroke="rgba(144,228,235,.4)" strokeWidth="1.6" />
      <text x="266" y="176" textAnchor="middle" fill="#9DE3E7" fontSize="13" fontWeight="750" fontFamily="Manrope, sans-serif">
        {t({ uz: 'masofa va vaqt', ru: 'расстояние и время', en: 'distance and time' })}
      </text>
      <text x="266" y="208" textAnchor="middle" fill="#EAF9FB" fontSize="24" fontWeight="800" fontFamily="JetBrains Mono, monospace">
        48 km · 4 h
      </text>

      <rect
        x="468"
        y="146"
        width="340"
        height="76"
        rx="14"
        fill={fixed ? 'rgba(149,201,61,.16)' : 'rgba(255,91,53,.16)'}
        stroke={fixed ? 'rgba(149,201,61,.5)' : '#FFB39B'}
        strokeWidth="1.8"
      />
      <text x="638" y="176" textAnchor="middle" fill={fixed ? T.lime : '#FFB39B'} fontSize="13" fontWeight="750" fontFamily="Manrope, sans-serif">
        {fixed
          ? t({ uz: 'tezlik tuzatildi', ru: 'скорость исправлена', en: 'speed corrected' })
          : t({ uz: 'Bit yozgan tezlik', ru: 'скорость, записанная Bit', en: 'the speed Bit wrote' })}
      </text>
      <text x="638" y="208" textAnchor="middle" fill="#EAF9FB" fontSize="24" fontWeight="800" fontFamily="JetBrains Mono, monospace">
        {fixed ? '12 km/h' : '52 km/h'}
      </text>

      <text x="452" y="256" textAnchor="middle" fill="rgba(157,227,231,.7)" fontSize="13" fontWeight="750" fontFamily="Manrope, sans-serif">
        {fixed
          ? t({ uz: 'yuk yo\'lga chiqdi', ru: 'груз вышел в путь', en: 'the load has set off' })
          : t({ uz: 'dispetcher yozuvni tasdiqlamadi', ru: 'диспетчер не подтвердил запись', en: 'the dispatcher did not confirm the record' })}
      </text>
    </FitSvg>
  );
};

// s1, s5, s7: yo'l lentasi soat bo'laklariga bo'linadi.
const RoadStrip = ({ parts, partLabel, totalLabel, frame = 9, showTotal = true }) => {
  const t = useT();
  const x0 = 60;
  const x1 = 600;
  const width = x1 - x0;
  const step = width / parts;
  return (
    <FitSvg viewBox="0 0 660 200">
      {showTotal && (
        <g opacity={frame >= 1 ? 1 : 0.25}>
          <rect x={x0} y={34} width={width} height={30} rx="9" fill={T.cyanSoft} stroke={T.cyan} strokeWidth="1.6" />
          <text x={(x0 + x1) / 2} y={55} textAnchor="middle" fill={T.cyan} fontSize="17" fontWeight="800" fontFamily="JetBrains Mono, monospace">
            {totalLabel}
          </text>
        </g>
      )}
      {Array.from({ length: parts }, (_, index) => (
        <g key={index} opacity={frame >= 2 ? 1 : 0.22}>
          <rect
            x={x0 + index * step + 3}
            y={82}
            width={step - 6}
            height={44}
            rx="9"
            fill="rgba(149,201,61,.22)"
            stroke={T.lime}
            strokeWidth="1.8"
          />
          <text x={x0 + index * step + step / 2} y={110} textAnchor="middle" fill="#4C6B18" fontSize="16" fontWeight="800" fontFamily="JetBrains Mono, monospace">
            {partLabel}
          </text>
          <text x={x0 + index * step + step / 2} y={146} textAnchor="middle" fill={T.ink3} fontSize="12" fontWeight="750" fontFamily="Manrope, sans-serif">
            {`${index + 1} ${t({ uz: 'soat', ru: 'час', en: 'hour' })}`}
          </text>
        </g>
      ))}
      {frame >= 3 && (
        <Caption
          x={330}
          y={180}
          text={t({ uz: 'har bo\'lak bitta soatda bosilgan yo\'l', ru: 'каждая часть — путь за один час', en: 'each piece is the path covered in one hour' })}
          tone={T.ink2}
        />
      )}
    </FitSvg>
  );
};

// s2, s6, s8, s13: uch kattalik kartasi.
const MotionCard = ({ rows, solvedValue = null, unknown }) => {
  const t = useT();
  const labels = {
    speed: t({ uz: 'Tezlik', ru: 'Скорость', en: 'Speed' }),
    time: t({ uz: 'Vaqt', ru: 'Время', en: 'Time' }),
    distance: t({ uz: 'Masofa', ru: 'Расстояние', en: 'Distance' }),
  };
  const order = ['speed', 'time', 'distance'];
  return (
    <FitSvg viewBox="0 0 660 180">
      {order.map((key, index) => {
        const isUnknown = key === unknown;
        const done = isUnknown && solvedValue !== null;
        const tone = isUnknown ? (done ? T.success : T.accent) : T.cyan;
        const fill = isUnknown ? (done ? T.successSoft : T.accentSoft) : T.cyanSoft;
        const x = 46 + index * 194;
        return (
          <g key={key}>
            <rect x={x} y={38} width={174} height={92} rx="16" fill={fill} stroke={tone} strokeWidth={isUnknown ? 2.6 : 1.8} />
            <text x={x + 87} y={70} textAnchor="middle" fill={tone} fontSize="13" fontWeight="800" fontFamily="Manrope, sans-serif">
              {labels[key]}
            </text>
            <text x={x + 87} y={110} textAnchor="middle" fill={T.ink} fontSize="24" fontWeight="800" fontFamily="JetBrains Mono, monospace">
              {done ? String(solvedValue) : rows[key]}
            </text>
          </g>
        );
      })}
    </FitSvg>
  );
};

// QOIDA kartasi: umumiy `RuleRows` bloki, mazmuni darsniki.
const RuleCard = ({ frame }) => {
  const t = useT();
  return (
    <RuleRows
      frame={frame}
      rows={[
        {
          tone: T.cyan,
          head: t({ uz: 'Tezlik', ru: 'Скорость', en: 'Speed' }),
          body: t({ uz: "masofani vaqtga bo'lamiz", ru: 'делим расстояние на время', en: 'divide the distance by the time' }),
          formula: 'v = s : t',
        },
        {
          tone: T.accent,
          head: t({ uz: 'Masofa', ru: 'Расстояние', en: 'Distance' }),
          body: t({ uz: "tezlikni vaqtga ko'paytiramiz", ru: 'умножаем скорость на время', en: 'multiply the speed by the time' }),
          formula: 's = v · t',
        },
        {
          tone: T.success,
          head: t({ uz: 'Vaqt', ru: 'Время', en: 'Time' }),
          body: t({ uz: "masofani tezlikka bo'lamiz", ru: 'делим расстояние на скорость', en: 'divide the distance by the speed' }),
          formula: 't = s : v',
        },
      ]}
    />
  );
};

// ---------------------------------------------------------------------------
// EKRANLAR
// ---------------------------------------------------------------------------
const Screen0 = (props) => (
  <ChoiceScreen
    {...props}
    plain
    ratio="30 / 11"
    ordinal={3}
    figure={({ solved }) => (
      <div className="hero-scene">
        <div className="hero-head">
          <span>LUMO CITY · BOSHQARUV MARKAZI · YO'L DISPETCHERLIGI</span>
          <span className={solved ? 'hero-state' : 'hero-state hero-state-alert'}>
            {solved ? 'TASDIQLANDI' : 'MARSHRUT'}
          </span>
        </div>
        <div className="hero-body">
          <DispatchBoard fixed={solved} />
        </div>
        <div className="d45-hero-bit" aria-hidden="true"><BitSVG state={solved ? 'nod' : 'awkward'} /></div>
      </div>
    )}
  />
);
const Screen1 = (props) => (
  <RevealScreen {...props} ratio="66 / 20" figure={({ frame }) => <RoadStrip parts={4} partLabel="12 km" totalLabel="48 km" frame={frame} />} />
);
const Screen2 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={1}
    ratio="66 / 18"
    figure={({ solved }) => <MotionCard unknown="speed" rows={{ speed: '?', time: '2 h', distance: '460 km' }} solvedValue={solved ? '230 km/h' : null} />}
  />
);
const Screen3 = (props) => {
  const t = useT();
  return (
    <RevealScreen
      {...props}
      ratio="66 / 18"
      figure={({ frame }) => (
        <MotionCard
          unknown={frame >= 3 ? 'speed' : 'none'}
          rows={{ speed: t({ uz: 'v', ru: 'v', en: 'v' }), time: t({ uz: 't', ru: 't', en: 't' }), distance: t({ uz: 's', ru: 's', en: 's' }) }}
        />
      )}
    />
  );
};
const Screen4 = (props) => <TableFill {...props} />;
const Screen5 = (props) => (
  <RevealScreen {...props} ratio="66 / 20" figure={({ frame }) => <RoadStrip parts={3} partLabel="4 km" totalLabel="12 km" frame={frame} showTotal={frame >= 3} />} />
);
const Screen6 = (props) => (
  <NumPadScreen
    {...props}
    ratio="66 / 18"
    figure={({ solved }) => <MotionCard unknown="distance" rows={{ speed: '45 km/h', time: '4 h', distance: '?' }} solvedValue={solved ? '180 km' : null} />}
  />
);
const Screen7 = (props) => (
  <RevealScreen
    {...props}
    ratio="66 / 18"
    figure={({ frame }) => (
      <MotionCard unknown={frame >= 2 ? 'time' : 'none'} rows={{ speed: '100 km/h', time: frame >= 3 ? '18 h' : '?', distance: '1800 km' }} />
    )}
  />
);
const Screen8 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={2}
    ratio="66 / 18"
    figure={({ solved }) => <MotionCard unknown="time" rows={{ speed: '60 km/h', time: '?', distance: '240 km' }} solvedValue={solved ? '4 h' : null} />}
  />
);
const Screen9 = (props) => (
  <RevealScreen
    {...props}
    ratio="66 / 18"
    figure={({ frame }) => (
      <MotionCard unknown={frame >= 2 ? 'speed' : 'none'} rows={{ speed: frame >= 3 ? '69 m/min' : '?', time: '15 min', distance: '1035 m' }} />
    )}
  />
);
const Screen10 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={4}
    ratio="66 / 20"
    figure={({ solved }) => <RoadStrip parts={3} partLabel="5 km" totalLabel="15 km" frame={solved ? 3 : 2} showTotal={solved} />}
  />
);
const Screen11 = (props) => <RevealScreen {...props} plain ratio="auto" figure={({ frame }) => <RuleCard frame={frame} />} />;
const Screen12 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={5}
    ratio="66 / 18"
    figure={({ solved }) => <MotionCard unknown="distance" rows={{ speed: 'v', time: 't', distance: solved ? 'v · t' : '?' }} />}
  />
);
const Screen13 = (props) => {
  const t = useT();
  return (
    <ChoiceScreen
      {...props}
      plain
      ratio="auto"
      ordinal={6}
      figure={({ solved, picked }) => (
        <StepList
          steps={CONTENT.s13.steps.map((step) => t(step))}
          badIndex={2}
          revealBad={solved}
          badLabel={t({ uz: 'xato shu yerda', ru: 'ошибка здесь', en: 'the error is here' })}
          showHint={picked !== null && !solved}
          hint={t({
            uz: 'Javobga qarang: nol soat bo\'lishi mumkinmi?',
            ru: 'Посмотри на ответ: могут ли получиться ноль часов?',
            en: 'Look at the answer: can it really be zero hours?',
          })}
        />
      )}
    />
  );
};
const Screen14 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={7}
    ratio="72 / 21"
    figure={({ solved, picked }) => (
      <RecordRow
        records={['48 : 4 = 12', '48 + 4 = 52', '48 · 4 = 192']}
        picked={picked}
        solved={solved}
        correctIndex={0}
        width={720}
        cardW={210}
        cardH={92}
        gap={24}
        top={34}
        size={19}
      />
    )}
  />
);
const Screen15 = (props) => <SummaryScreen {...props} />;

const SCREENS = [
  Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7,
  Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15,
];

const LESSON_STYLES = `
.d45-hero-bit {
  position: absolute;
  right: 14px;
  top: 50%;
  width: 60px;
  height: 75px;
  transform: translateY(-50%);
  pointer-events: none;
}
.d45-hero-bit svg { width: 100%; height: 100%; }
`;

export default function Grade4Dars45(props) {
  return (
    <TheoryLessonRoot
      {...props}
      lessonMeta={LESSON_META}
      screenMeta={SCREEN_META}
      totalScreens={TOTAL_SCREENS}
      frameCounts={FRAME_COUNTS}
      content={CONTENT}
      screens={SCREENS}
      styles={KIT_STYLES + LESSON_STYLES}
    />
  );
}
