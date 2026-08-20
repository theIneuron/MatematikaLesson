// ============================================================================
// 4-SINF · Dars 17 · Shkalalar
//
// Manba: N. U. Bikbayeva, "Matematika. 4-sinf", 5-nashr 2020, 109-114-betlar.
//   109-110-bet: nur, sonlar nuri OX, O nuqta — nurning boshi, birlik kesma;
//   111-bet: "Sonlar nurini chizishda qilingan xatolarni top" — uch nur;
//            chizg'ich shkalasi, hisob boshi;
//   112-bet: "Shkala — o'lchov asbobidagi belgilar to'plami", soat shkalasi
//            aylana bo'ylab joylashadi; bir bo'linma qiymatini topish;
//            spidometr 3240 km, oldin 3004 km bo'lgan;
//   112-113-bet: yo'l shkala ko'rinishida chizilgan, yetishmagan sonlarni yozish.
//
// Syujet: Lumo City o'lchov stansiyasi — barcha asboblar shu yerda tekshiriladi
// (SYUJET_4SINF.md, 2-blok).
// Baholanadigan oltita ekran: s2, s4, s6, s8, s10, s13.
//
// Yangi mexanika: ScaleRead — bola javobni ro'yxatdan tanlamaydi, asbobning
// o'zida kerakli belgini bosadi. Shkalani o'qish aynan shu harakat.
// ============================================================================
import {
  Caption, ChoiceScreen, FitSvg, KIT_STYLES, NumPadScreen, RevealScreen,
  RuleRows, ScaleFigure, ScaleRead, StepList, SummaryScreen, T,
  TheoryLessonRoot, assertScreenTypeLabels, useT,
} from './kit/index.js';

const LESSON_META = {
  lessonId: 'scales-4-17-v2',
  slug: 'dars17-shkalalar',
  lessonTitle: {
    uz: '17-dars. Shkalalar',
    ru: 'Урок 17. Шкалы',
    en: 'Lesson 17. Scales',
  },
  skillTags: ['scale', 'number_ray', 'division_value', 'measurement', 'reading_instruments'],
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

const FRAME_COUNTS = [4, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 3, 3, 3];

const CONTENT = {
  // -------------------------------------------------------------------------
  s0: {
    eyebrow: { uz: "O'lchov stansiyasi", ru: 'Измерительная станция', en: 'The measuring station' },
    title: {
      uz: 'Uchta shkala, bittasi yaroqsiz',
      ru: 'Три шкалы, одна негодная',
      en: 'Three scales, one of them faulty',
    },
    question: {
      uz: "Qaysi shkala noto'g'ri chizilgan?",
      ru: 'Какая шкала начерчена неверно?',
      en: 'Which scale is drawn incorrectly?',
    },
    options: [
      { uz: 'Birinchi', ru: 'Первая', en: 'The first' },
      { uz: 'Ikkinchi', ru: 'Вторая', en: 'The second' },
      { uz: 'Uchinchi', ru: 'Третья', en: 'The third' },
    ],
    correctIndex: 1,
    correctText: {
      uz: "To'g'ri. Ikkinchi shkalada bir bilan ikki orasidagi masofa qolganlaridan katta. Shkalada barcha bo'linmalar teng bo'lishi shart, aks holda o'lchash yolg'on chiqadi.",
      ru: 'Верно. На второй шкале расстояние между единицей и двойкой больше остальных. На шкале все деления обязаны быть равными, иначе измерение окажется ложным.',
      en: 'Correct. On the second scale the gap between one and two is bigger than the others. All divisions on a scale must be equal, otherwise the measurement lies.',
    },
    wrong: [
      {
        uz: "Birinchi shkalada barcha bo'linmalar teng. Bu yerda xato yo'q, yana bir qarang.",
        ru: 'На первой шкале все деления равны. Здесь ошибки нет, посмотри ещё раз.',
        en: 'On the first scale all the divisions are equal. There is no mistake here, look again.',
      },
      null,
      {
        uz: "Uchinchi shkalada ham bo'linmalar teng. Notekislikni boshqa qatorda qidiring.",
        ru: 'На третьей шкале деления тоже равны. Неровность ищи в другой строке.',
        en: 'The third scale has equal divisions too. Look for the uneven one in another row.',
      },
    ],
    bitFeedback: true,
    audio: {
      intro: {
        uz: [
          "Salom! Bugun biz Lumo City o'lchov stansiyasidamiz.",
          "Bu yerda shahar asboblari tekshiriladi. Chizg'ich, termometr, spidometr — hammasida shkala bor.",
          "Stansiyaga uchta chizma keldi. Ularning ikkitasi to'g'ri, bittasi yaroqsiz.",
          'Diqqat bilan qarang va noto\'g\'ri chizilganini toping.',
        ],
        ru: [
          'Привет! Сегодня мы на измерительной станции Lumo City.',
          'Здесь проверяют городские приборы. Линейка, термометр, спидометр — у всех есть шкала.',
          'На станцию поступили три чертежа. Два из них верные, а один негодный.',
          'Посмотри внимательно и найди тот, что начерчен неверно.',
        ],
        en: [
          'Hello! Today we are at the Lumo City measuring station.',
          'City instruments are checked here. A ruler, a thermometer, a speedometer all have scales.',
          'Three drawings have arrived at the station. Two of them are correct and one is faulty.',
          'Look carefully and find the one drawn incorrectly.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s1: {
    eyebrow: { uz: 'Sonlar nuri', ru: 'Числовой луч', en: 'The number ray' },
    title: {
      uz: 'Har qanday shkala sonlar nuridan boshlanadi',
      ru: 'Любая шкала начинается с числового луча',
      en: 'Every scale starts from a number ray',
    },
    lead: {
      uz: 'O nuqta — nurning boshi. 0 dan 1 gacha bo\'lgan kesma birlik kesma deyiladi.',
      ru: 'Точка O это начало луча. Отрезок от 0 до 1 называют единичным отрезком.',
      en: 'The point O is the start of the ray. The segment from 0 to 1 is called the unit segment.',
    },
    note: {
      uz: "Birlik kesma bir marta tanlanadi va butun shkala bo'ylab o'zgarmaydi.",
      ru: 'Единичный отрезок выбирают один раз, и по всей шкале он не меняется.',
      en: 'The unit segment is chosen once and never changes along the whole scale.',
    },
    audio: {
      intro: {
        uz: [
          "Nurni cheksiz uzun chizg'ich deb tasavvur qiling.",
          "Uning boshlanish nuqtasi bor va u O harfi bilan belgilanadi. Bu nuqtaga nol turadi.",
          "Noldan birgacha bo'lgan kesma birlik kesma deyiladi. Uni bir marta tanlaymiz.",
          "Keyin shu kesmani qayta va qayta qo'yamiz. Har bir yangi belgi bir birlikka uzoqroq turadi.",
        ],
        ru: [
          'Представь луч как бесконечно длинную линейку.',
          'У него есть начало, и его обозначают буквой O. В этой точке стоит ноль.',
          'Отрезок от нуля до единицы называют единичным отрезком. Его выбирают один раз.',
          'Потом этот отрезок откладывают снова и снова. Каждая новая метка стоит на одну единицу дальше.',
        ],
        en: [
          'Think of a ray as an endlessly long ruler.',
          'It has a starting point, marked with the letter O. Zero stands at that point.',
          'The segment from zero to one is called the unit segment. It is chosen once.',
          'Then that segment is laid off again and again. Every new mark stands one unit further along.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s2: {
    eyebrow: { uz: 'Nurda joy', ru: 'Место на луче', en: 'A place on the ray' },
    title: {
      uz: 'Sonni nurdan toping',
      ru: 'Найди число на луче',
      en: 'Find the number on the ray',
    },
    question: {
      uz: 'Kerakli belgini shkalada bosing.',
      ru: 'Нажми нужную метку на шкале.',
      en: 'Tap the right mark on the scale.',
    },
    scale: { min: 0, max: 10, majorEvery: 5, minorPerMajor: 5, unit: { uz: 'birlik', ru: 'единиц', en: 'units' } },
    target: 7,
    caption: {
      uz: 'Bir bo\'linma bitta birlikka teng',
      ru: 'Одно деление равно одной единице',
      en: 'One division equals one unit',
    },
    correctText: {
      uz: "To'g'ri. Beshdan keyin ikkita bo'linma sanadingiz va yettiga keldingiz.",
      ru: 'Верно. После пятёрки идут два деления, и они приводят к семи.',
      en: 'Correct. After the five you counted two divisions and arrived at seven.',
    },
    wrongNear: {
      uz: "Yaqin, lekin bitta bo'linma xato. Beshdan boshlab sanang: olti, yetti.",
      ru: 'Близко, но на одно деление мимо. Считай от пяти: шесть, семь.',
      en: 'Close, but one division off. Count from five: six, seven.',
    },
    wrongFar: {
      uz: "Bu belgi uzoqda. Imzolangan songa boring va u yerdan bittalab sanang.",
      ru: 'Эта метка далеко. Дойди до подписанного числа и считай от него по одному.',
      en: 'That mark is far off. Go to a labelled number and count from there one by one.',
    },
    audio: {
      intro: {
        uz: [
          "Stansiya shkalasida faqat nol, besh va o'n imzolangan.",
          "Qolgan belgilar imzolanmagan, lekin ular ham bor. Ular orasidagi masofa bir birlik.",
          'Yetti raqami turgan belgini toping va uni bosing.',
        ],
        ru: [
          'На шкале станции подписаны только ноль, пять и десять.',
          'Остальные метки без подписи, но они есть. Расстояние между ними одна единица.',
          'Найди метку, на которой стоит число семь, и нажми её.',
        ],
        en: [
          'Only zero, five and ten are labelled on the station scale.',
          'The other marks have no labels, but they are there. The gap between them is one unit.',
          'Find the mark where the number seven stands and tap it.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s3: {
    eyebrow: { uz: "Bo'linma qiymati", ru: 'Цена деления', en: 'The value of a division' },
    title: {
      uz: 'Bir bo\'linma har doim ham bitta emas',
      ru: 'Одно деление не всегда равно единице',
      en: 'One division is not always one unit',
    },
    lead: {
      uz: "Yonma-yon imzolangan ikki sonning farqini oradagi bo'linmalar soniga bo'lamiz.",
      ru: 'Разность двух соседних подписанных чисел делим на количество делений между ними.',
      en: 'Divide the difference of two neighbouring labelled numbers by the number of divisions between them.',
    },
    note: {
      uz: '100 − 0 = 100, oradagi bo\'linmalar 5 ta, demak 100 : 5 = 20.',
      ru: '100 − 0 = 100, делений между ними 5, значит 100 : 5 = 20.',
      en: '100 − 0 = 100, there are 5 divisions between them, so 100 : 5 = 20.',
    },
    audio: {
      intro: {
        uz: [
          "Endi eng muhim savol. Bir bo'linma qanchaga teng?",
          "Yonma-yon turgan ikkita imzolangan sonni olamiz. Bu yerda nol va yuz.",
          "Ularning farqi yuz. Oradagi bo'linmalarni sanaymiz, beshta.",
          "Yuzni beshga bo'lamiz va yigirma chiqadi. Demak har bir bo'linma yigirmaga teng.",
        ],
        ru: [
          'Теперь самый важный вопрос. Чему равно одно деление?',
          'Берём два соседних подписанных числа. Здесь это ноль и сто.',
          'Их разность сто. Считаем деления между ними, их пять.',
          'Делим сто на пять и получаем двадцать. Значит каждое деление равно двадцати.',
        ],
        en: [
          'Now the most important question. How much is one division worth?',
          'We take two neighbouring labelled numbers. Here they are zero and one hundred.',
          'Their difference is one hundred. We count the divisions between them, there are five.',
          'Divide one hundred by five and get twenty. So every division is worth twenty.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s4: {
    eyebrow: { uz: 'Stansiya asbobi', ru: 'Прибор станции', en: 'A station instrument' },
    title: {
      uz: 'Bu shkalada bir bo\'linma qancha?',
      ru: 'Сколько стоит одно деление на этой шкале?',
      en: 'How much is one division on this scale?',
    },
    question: {
      uz: 'Bir bo\'linma qiymatini hisoblab, javobni tering.',
      ru: 'Вычисли цену одного деления и набери ответ.',
      en: 'Work out the value of one division and type the answer.',
    },
    answer: '5',
    unit: { uz: 'birlik', ru: 'единиц', en: 'units' },
    wrong: {
      uz: "Hozircha mos emas. Yonma-yon ikkita imzolangan sonning farqini oling, keyin oradagi bo'linmalarni sanang.",
      ru: 'Пока не сходится. Возьми разность двух соседних подписанных чисел, потом посчитай деления между ними.',
      en: 'Not right yet. Take the difference of two neighbouring labelled numbers, then count the divisions between them.',
    },
    hintAfter: {
      uz: "O'n beshdan nolgacha farq o'n besh, oradagi bo'linmalar uchta. O'n beshni uchga bo'ling.",
      ru: 'От нуля до пятнадцати разность пятнадцать, делений между ними три. Раздели пятнадцать на три.',
      en: 'From zero to fifteen the difference is fifteen and there are three divisions between them. Divide fifteen by three.',
    },
    correctText: {
      uz: "To'g'ri. O'n besh bo'lingan uch teng besh. Har bir kichik belgi beshga qadam tashlaydi.",
      ru: 'Верно. Пятнадцать разделить на три равно пяти. Каждая маленькая метка делает шаг по пять.',
      en: 'Correct. Fifteen divided by three is five. Every small mark steps by five.',
    },
    audio: {
      intro: {
        uz: [
          "Stansiyaga yangi asbob keldi. Uning shkalasida nol, o'n besh, o'ttiz, qirq besh va oltmish imzolangan.",
          "Har ikki imzolangan son orasida uchta bo'linma bor.",
          "Bir bo'linma qanchaga teng ekanini hisoblang va raqamni tering.",
        ],
        ru: [
          'На станцию поступил новый прибор. На его шкале подписаны ноль, пятнадцать, тридцать, сорок пять и шестьдесят.',
          'Между каждыми двумя подписанными числами по три деления.',
          'Вычисли, чему равно одно деление, и набери цифру.',
        ],
        en: [
          'A new instrument has arrived. Its scale is labelled zero, fifteen, thirty, forty five and sixty.',
          'There are three divisions between every two labelled numbers.',
          'Work out how much one division is worth and type the digit.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s5: {
    eyebrow: { uz: 'Tik shkala', ru: 'Вертикальная шкала', en: 'A vertical scale' },
    title: {
      uz: 'Termometrda shkala tik turadi',
      ru: 'У термометра шкала стоит вертикально',
      en: 'On a thermometer the scale stands upright',
    },
    lead: {
      uz: "Yo'nalish o'zgardi, qoida o'zgarmadi.",
      ru: 'Направление изменилось, а правило осталось прежним.',
      en: 'The direction changed, the rule did not.',
    },
    note: {
      uz: "Bu yerda 10 : 5 = 2, demak har bir kichik belgi ikki gradusga qadam tashlaydi.",
      ru: 'Здесь 10 : 5 = 2, значит каждая маленькая метка делает шаг по два градуса.',
      en: 'Here 10 : 5 = 2, so each small mark steps by two degrees.',
    },
    audio: {
      intro: {
        uz: [
          'Stansiyada termometr ham tekshiriladi.',
          "Uning shkalasi yotiq emas, tik turadi. Sonlar pastdan yuqoriga o'sadi.",
          "Imzolangan sonlar nol, o'n, yigirma, o'ttiz va qirq. Ular orasida beshtadan bo'linma bor.",
          "O'nni beshga bo'lamiz, ikki chiqadi. Yo'nalish boshqa bo'lsa ham, qoida aynan bir xil ishlaydi.",
        ],
        ru: [
          'На станции проверяют и термометр.',
          'Его шкала не лежит, а стоит вертикально. Числа растут снизу вверх.',
          'Подписаны ноль, десять, двадцать, тридцать и сорок. Между ними по пять делений.',
          'Делим десять на пять, получаем два. Направление другое, а правило работает точно так же.',
        ],
        en: [
          'The station also checks thermometers.',
          'Its scale does not lie flat but stands upright. The numbers grow from the bottom up.',
          'Zero, ten, twenty, thirty and forty are labelled. There are five divisions between them.',
          'Divide ten by five and get two. The direction is different, but the rule works exactly the same.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s6: {
    eyebrow: { uz: 'Termometr', ru: 'Термометр', en: 'The thermometer' },
    title: {
      uz: '26 gradusni termometrda toping',
      ru: 'Найди 26 градусов на термометре',
      en: 'Find 26 degrees on the thermometer',
    },
    question: {
      uz: 'Kerakli belgini shkalada bosing.',
      ru: 'Нажми нужную метку на шкале.',
      en: 'Tap the right mark on the scale.',
    },
    scale: {
      min: 0, max: 40, majorEvery: 10, minorPerMajor: 5, vertical: true, tube: true,
      unit: { uz: 'gradus', ru: 'градус', en: 'degrees' },
    },
    target: 26,
    caption: {
      uz: 'Bir bo\'linma ikki gradusga teng',
      ru: 'Одно деление равно двум градусам',
      en: 'One division equals two degrees',
    },
    correctText: {
      uz: "To'g'ri. Yigirmadan yuqoriga uchta bo'linma sanadingiz. Ikki qo'shildi ikki qo'shildi ikki, ya'ni olti. Yigirma olti.",
      ru: 'Верно. От двадцати вверх идут три деления. Два плюс два плюс два, то есть шесть. Двадцать шесть.',
      en: 'Correct. From twenty you counted three divisions up. Two plus two plus two is six. Twenty six.',
    },
    wrongNear: {
      uz: "Yaqin, lekin bitta bo'linma xato. Har bir bo'linma ikki gradus, bitta emas.",
      ru: 'Близко, но на одно деление мимо. Каждое деление это два градуса, а не один.',
      en: 'Close, but one division off. Each division is two degrees, not one.',
    },
    wrongFar: {
      uz: "Imzolangan songa qayting va u yerdan ikkitalab sanang: yigirma ikki, yigirma to'rt, yigirma olti.",
      ru: 'Вернись к подписанному числу и считай от него по два: двадцать два, двадцать четыре, двадцать шесть.',
      en: 'Go back to a labelled number and count in twos: twenty two, twenty four, twenty six.',
    },
    audio: {
      intro: {
        uz: [
          "Termometr shkalasida yigirma olti gradusni topish kerak.",
          "Yigirma imzolangan, undan yuqorida esa kichik belgilar bor.",
          'Kerakli belgini bosing.',
        ],
        ru: [
          'На шкале термометра нужно найти двадцать шесть градусов.',
          'Двадцать подписано, а выше него идут маленькие метки.',
          'Нажми нужную метку.',
        ],
        en: [
          'You need to find twenty six degrees on the thermometer scale.',
          'Twenty is labelled, and above it there are small marks.',
          'Tap the mark you need.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s7: {
    eyebrow: { uz: 'Aylana shkala', ru: 'Круговая шкала', en: 'A circular scale' },
    title: {
      uz: 'Soatda shkala aylana bo\'ylab yotadi',
      ru: 'У часов шкала расположена по кругу',
      en: 'On a clock the scale runs around a circle',
    },
    lead: {
      uz: 'Boshi va oxiri tutashadi, lekin bo\'linmalar baribir teng.',
      ru: 'Начало и конец смыкаются, но деления всё равно равны.',
      en: 'The start and the end meet, but the divisions are still equal.',
    },
    note: {
      uz: "Ikki katta raqam orasida beshta bo'linma bor, har biri bir daqiqa.",
      ru: 'Между двумя большими числами пять делений, каждое по одной минуте.',
      en: 'Between two big numbers there are five divisions, one minute each.',
    },
    audio: {
      intro: {
        uz: [
          "Stansiyaning devorida soat osilgan. Unda ham shkala bor.",
          "Faqat u to'g'ri chiziq emas, aylana bo'ylab yotadi.",
          "Katta raqamlar birdan o'n ikkigacha. Ular orasida kichik belgilar bor.",
          "Har ikki katta raqam orasida beshta bo'linma. Daqiqa strelkasi uchun har bir bo'linma bir daqiqa.",
        ],
        ru: [
          'На стене станции висят часы. У них тоже есть шкала.',
          'Только она не прямая, а расположена по кругу.',
          'Большие числа идут от одного до двенадцати. Между ними стоят маленькие метки.',
          'Между каждыми двумя большими числами пять делений. Для минутной стрелки каждое деление одна минута.',
        ],
        en: [
          'A clock hangs on the station wall. It has a scale too.',
          'Only it is not a straight line but runs around a circle.',
          'The big numbers go from one to twelve, with small marks between them.',
          'Between every two big numbers there are five divisions. For the minute hand each division is one minute.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s8: {
    eyebrow: { uz: 'Soat shkalasi', ru: 'Шкала часов', en: 'The clock scale' },
    title: {
      uz: 'Strelka 3 dan 4 gacha siljidi',
      ru: 'Стрелка сдвинулась с 3 до 4',
      en: 'The hand moved from 3 to 4',
    },
    question: {
      uz: 'Daqiqa strelkasi 3 dan 4 gacha siljisa, necha daqiqa o\'tadi?',
      ru: 'Сколько минут проходит, если минутная стрелка сдвигается с 3 до 4?',
      en: 'How many minutes pass if the minute hand moves from 3 to 4?',
    },
    options: [
      { uz: '5 daqiqa', ru: '5 минут', en: '5 minutes' },
      { uz: '1 daqiqa', ru: '1 минута', en: '1 minute' },
      { uz: '15 daqiqa', ru: '15 минут', en: '15 minutes' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Uch bilan to'rt orasida beshta bo'linma bor, har biri bir daqiqa. Demak besh daqiqa o'tadi.",
      ru: 'Верно. Между тройкой и четвёркой пять делений, каждое по минуте. Значит проходит пять минут.',
      en: 'Correct. There are five divisions between three and four, one minute each. So five minutes pass.',
    },
    wrong: [
      null,
      {
        uz: "Bir daqiqa — bu bitta kichik bo'linma. Uchdan to'rtgacha esa beshta bo'linma bor.",
        ru: 'Одна минута это одно маленькое деление. А от тройки до четвёрки пять делений.',
        en: 'One minute is one small division. But from three to four there are five divisions.',
      },
      {
        uz: "O'n besh daqiqa — bu uchta katta raqam, ya'ni chorak aylana. Bizda esa bitta oraliq.",
        ru: 'Пятнадцать минут это три больших числа, то есть четверть круга. А у нас один промежуток.',
        en: 'Fifteen minutes is three big numbers, a quarter of the circle. Here we have only one gap.',
      },
    ],
    audio: {
      intro: {
        uz: [
          'Soatga qaraymiz.',
          "Daqiqa strelkasi uchdan to'rtgacha siljidi.",
          "Bo'linmalarni sanab, qancha vaqt o'tganini toping.",
        ],
        ru: [
          'Посмотрим на часы.',
          'Минутная стрелка сдвинулась с тройки на четвёрку.',
          'Посчитай деления и найди, сколько времени прошло.',
        ],
        en: [
          'Let us look at the clock.',
          'The minute hand moved from three to four.',
          'Count the divisions and find how much time passed.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s9: {
    eyebrow: { uz: 'Spidometr', ru: 'Спидометр', en: 'The odometer' },
    title: {
      uz: 'Asbob yo\'lni emas, jamini ko\'rsatadi',
      ru: 'Прибор показывает не путь, а всё пройденное',
      en: 'The instrument shows the total, not one journey',
    },
    lead: {
      uz: "Bitta safar uzunligini topish uchun ikki ko'rsatkichning farqini olamiz.",
      ru: 'Чтобы найти длину одной поездки, берём разность двух показаний.',
      en: 'To find the length of one journey we take the difference of two readings.',
    },
    note: {
      uz: "3240 − 3004 — safardan oldingi va keyingi ko'rsatkichlar farqi.",
      ru: '3240 − 3004 это разность показаний до и после поездки.',
      en: '3240 − 3004 is the difference between the readings before and after the journey.',
    },
    audio: {
      intro: {
        uz: [
          "Stansiyaga avtomobil keldi. Uning spidometrida bosib o'tilgan yo'l yozilgan.",
          "Safardan oldin asbobda uch ming to'rt kilometr turgan edi.",
          "To'rt soat yurgandan keyin asbob uch ming ikki yuz qirq kilometrni ko'rsatdi.",
          "Asbob butun umr bo'yi yurgan yo'lni sanaydi. Bitta safar uchun ikki ko'rsatkich farqini olamiz.",
        ],
        ru: [
          'На станцию приехал автомобиль. На его спидометре записан пройденный путь.',
          'До поездки на приборе стояло три тысячи четыре километра.',
          'После четырёх часов езды прибор показал три тысячи двести сорок километров.',
          'Прибор считает весь путь за всё время. Для одной поездки берём разность двух показаний.',
        ],
        en: [
          'A car has arrived at the station. Its odometer records the distance travelled.',
          'Before the trip the instrument showed three thousand and four kilometres.',
          'After four hours of driving it showed three thousand two hundred forty kilometres.',
          'The instrument counts the whole distance ever driven. For one journey we take the difference of the two readings.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s10: {
    eyebrow: { uz: 'Safar uzunligi', ru: 'Длина поездки', en: 'The length of the journey' },
    title: {
      uz: 'Avtomobil qancha yo\'l bosdi?',
      ru: 'Сколько километров проехал автомобиль?',
      en: 'How far did the car travel?',
    },
    question: {
      uz: "Oldin 3004 km, keyin 3240 km. Safar uzunligini tering.",
      ru: 'Было 3004 км, стало 3240 км. Набери длину поездки.',
      en: 'It read 3004 km before and 3240 km after. Type the length of the journey.',
    },
    answer: '236',
    unit: { uz: 'km', ru: 'км', en: 'km' },
    wrong: {
      uz: "Hozircha mos emas. Keyingi ko'rsatkichdan oldingisini ayiring.",
      ru: 'Пока не сходится. Вычти из последнего показания предыдущее.',
      en: 'Not right yet. Subtract the earlier reading from the later one.',
    },
    hintAfter: {
      uz: "Ustunda yozing: uch ming ikki yuz qirqdan uch ming to'rtni ayiring.",
      ru: 'Запиши столбиком: из трёх тысяч двухсот сорока вычти три тысячи четыре.',
      en: 'Write it in a column: subtract three thousand and four from three thousand two hundred forty.',
    },
    correctText: {
      uz: "To'g'ri. Ikki yuz o'ttiz olti kilometr. Asbobdagi katta sonlar qo'rqitmaydi, chunki bizga faqat farq kerak.",
      ru: 'Верно. Двести тридцать шесть километров. Большие числа на приборе не пугают, ведь нужна только разность.',
      en: 'Correct. Two hundred thirty six kilometres. The big numbers on the instrument are not scary, because only the difference matters.',
    },
    audio: {
      intro: {
        uz: [
          "Spidometrning ikkala ko'rsatkichi ma'lum.",
          "Safar boshida uch ming to'rt, oxirida uch ming ikki yuz qirq kilometr.",
          'Bu safarda bosilgan yo\'lni toping va raqamlarni tering.',
        ],
        ru: [
          'Оба показания спидометра известны.',
          'В начале поездки три тысячи четыре, в конце три тысячи двести сорок километров.',
          'Найди путь, пройденный за эту поездку, и набери цифры.',
        ],
        en: [
          'Both odometer readings are known.',
          'At the start of the trip three thousand and four, at the end three thousand two hundred forty kilometres.',
          'Find the distance covered on this trip and type the digits.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s11: {
    eyebrow: { uz: 'Stansiya qoidasi', ru: 'Правило станции', en: 'The station rule' },
    title: {
      uz: 'Har qanday shkala uchta qadamda o\'qiladi',
      ru: 'Любая шкала читается в три шага',
      en: 'Any scale is read in three steps',
    },
    lead: {
      uz: 'Chizg\'ich, termometr, spidometr, soat — hammasi shu qoidaga bo\'ysunadi.',
      ru: 'Линейка, термометр, спидометр, часы — всё подчиняется этому правилу.',
      en: 'A ruler, a thermometer, an odometer, a clock all obey this rule.',
    },
    note: {
      uz: "Bo'linmalar teng bo'lmasa, shkala yaroqsiz — o'lchash mumkin emas.",
      ru: 'Если деления не равны, шкала негодна и измерять по ней нельзя.',
      en: 'If the divisions are not equal, the scale is faulty and cannot be used for measuring.',
    },
    audio: {
      intro: {
        uz: [
          "Bugungi qoidani stansiya devoriga yozib qo'yamiz.",
          "Birinchi qadam. Yonma-yon turgan ikkita imzolangan sonni topamiz va ularning farqini olamiz.",
          "Ikkinchi qadam. Ular orasidagi bo'linmalarni sanaymiz va farqni shu songa bo'lamiz.",
          "Uchinchi qadam. Imzolangan sondan boshlab bo'linmalarni qo'shib boramiz. Barcha bo'linmalar teng bo'lishi shart.",
        ],
        ru: [
          'Запишем сегодняшнее правило на стене станции.',
          'Первый шаг. Находим два соседних подписанных числа и берём их разность.',
          'Второй шаг. Считаем деления между ними и делим разность на это число.',
          'Третий шаг. От подписанного числа прибавляем деления одно за другим. Все деления обязаны быть равными.',
        ],
        en: [
          "Let us write today's rule on the station wall.",
          'Step one. Find two neighbouring labelled numbers and take their difference.',
          'Step two. Count the divisions between them and divide the difference by that count.',
          'Step three. Starting from a labelled number, add the divisions one by one. All divisions must be equal.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s12: {
    eyebrow: { uz: 'Qaysi belgilarni olamiz', ru: 'Какие метки берём', en: 'Which marks do we use' },
    title: {
      uz: 'Bo\'linma qiymatini qayerdan boshlaymiz?',
      ru: 'С чего начинаем поиск цены деления?',
      en: 'Where do we start looking for the division value?',
    },
    question: {
      uz: "Bir bo'linma qiymatini topish uchun qaysi belgilarni olamiz?",
      ru: 'Какие метки берём, чтобы найти цену одного деления?',
      en: 'Which marks do we take to find the value of one division?',
    },
    options: [
      {
        uz: "Yonma-yon turgan ikkita imzolangan belgini olamiz va oradagi bo'linmalarni sanaymiz",
        ru: 'Берём две соседние подписанные метки и считаем деления между ними',
        en: 'We take two neighbouring labelled marks and count the divisions between them',
      },
      {
        uz: 'Bitta imzolangan va bitta imzolanmagan belgini olamiz',
        ru: 'Берём одну подписанную и одну неподписанную метку',
        en: 'We take one labelled mark and one unlabelled mark',
      },
      {
        uz: 'Faqat shkalaning boshini olamiz',
        ru: 'Берём только начало шкалы',
        en: 'We take only the start of the scale',
      },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Ikkala son ma'lum bo'lsa, farq ham ma'lum bo'ladi. Shundan keyin uni bo'linmalar soniga bo'lamiz.",
      ru: 'Верно. Если известны оба числа, известна и разность. После этого делим её на количество делений.',
      en: 'Correct. If both numbers are known, so is the difference. After that we divide it by the number of divisions.',
    },
    wrong: [
      null,
      {
        uz: "Imzolanmagan belgining qiymati hali noma'lum. Farqni hisoblab bo'lmaydi, chunki ikkinchi son yo'q.",
        ru: 'Значение неподписанной метки пока неизвестно. Разность не вычислить, ведь второго числа нет.',
        en: 'The value of an unlabelled mark is not known yet. The difference cannot be worked out without the second number.',
      },
      {
        uz: "Bitta nuqta hech qanday masofa bermaydi. Bo'linma qiymati ikkita belgi orasidan chiqadi.",
        ru: 'Одна точка не даёт никакого расстояния. Цена деления получается между двумя метками.',
        en: 'A single point gives no distance at all. The division value comes from the gap between two marks.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Jasur stansiya uchun qisqa yo'riqnoma yozmoqchi.",
          'Uchta taklif bor, faqat bittasi har doim ishlaydi.',
          'Mosini tanlang.',
        ],
        ru: [
          'Джасур хочет написать для станции короткую инструкцию.',
          'Есть три предложения, и только одно работает всегда.',
          'Выбери подходящее.',
        ],
        en: [
          'Jasur wants to write a short instruction for the station.',
          'There are three proposals, and only one of them always works.',
          'Choose the right one.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s13: {
    eyebrow: { uz: 'Bit o\'qishi', ru: 'Чтение Bit', en: "Bit's reading" },
    title: {
      uz: 'Bit belgilarni sanadi, qiymatni emas',
      ru: 'Bit посчитал метки, а не значение',
      en: 'Bit counted the marks, not the value',
    },
    question: {
      uz: "Ko'rsatkich aslida qaysi sonni ko'rsatyapti?",
      ru: 'Какое число на самом деле показывает указатель?',
      en: 'Which number is the pointer actually showing?',
    },
    options: [
      { uz: '300', ru: '300', en: '300' },
      { uz: '3', ru: '3', en: '3' },
      { uz: '150', ru: '150', en: '150' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Nol bilan besh yuz orasida beshta bo'linma bor, demak bittasi yuzga teng. Uchta bo'linma uch yuz beradi.",
      ru: 'Верно. Между нулём и пятьюстами пять делений, значит одно равно ста. Три деления дают триста.',
      en: 'Correct. There are five divisions between zero and five hundred, so one of them is one hundred. Three divisions give three hundred.',
    },
    wrong: [
      null,
      {
        uz: "Bu Bit ning javobi. U bo'linmalar sonini yozdi, lekin har bir bo'linma yuzga teng. Sonini emas, qiymatini olish kerak.",
        ru: 'Это ответ Bit. Он записал количество делений, но каждое деление равно ста. Нужно брать не количество, а значение.',
        en: "That is Bit's answer. He wrote the number of divisions, but each division is one hundred. We need the value, not the count.",
      },
      {
        uz: "Bir yuz ellik — bu yarim yo'l bo'lgandagina to'g'ri bo'lardi. Ko'rsatkich esa aynan uchinchi belgida turibdi.",
        ru: 'Сто пятьдесят подошло бы, если бы указатель стоял посередине. А он стоит ровно на третьей метке.',
        en: 'One hundred fifty would fit if the pointer stood halfway. But it stands exactly on the third mark.',
      },
    ],
    bitFeedback: true,
    audio: {
      intro: {
        uz: [
          "Bit stansiya asbobini o'qidi. Shkalada nol va besh yuz imzolangan.",
          "Ko'rsatkich noldan hisoblaganda uchinchi belgida turibdi. Bit uchta belgi sanadi va uch deb yozdi.",
          'Asbob aslida qaysi sonni ko\'rsatyapti?',
        ],
        ru: [
          'Bit прочитал прибор станции. На шкале подписаны ноль и пятьсот.',
          'Указатель стоит на третьей метке от нуля. Bit насчитал три метки и записал три.',
          'Какое число прибор показывает на самом деле?',
        ],
        en: [
          "Bit read a station instrument. Zero and five hundred are labelled on the scale.",
          'The pointer stands on the third mark from zero. Bit counted three marks and wrote three.',
          'Which number is the instrument actually showing?',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s14: {
    eyebrow: { uz: 'Yo\'l shkalasi', ru: 'Шкала дороги', en: 'The road scale' },
    title: {
      uz: 'Bekat qaysi kilometrda?',
      ru: 'На каком километре остановка?',
      en: 'At which kilometre is the stop?',
    },
    question: {
      uz: "Yo'lda 0, 3, 6, 9, 12 imzolangan, har oraliqda 3 ta bo'linma. Bekat noldan 7-belgida.",
      ru: 'На дороге подписаны 0, 3, 6, 9, 12, в каждом промежутке по 3 деления. Остановка на 7-й метке от нуля.',
      en: 'The road is labelled 0, 3, 6, 9, 12 with 3 divisions in each gap. The stop is on the 7th mark from zero.',
    },
    options: [
      { uz: '7 km', ru: '7 км', en: '7 km' },
      { uz: '21 km', ru: '21 км', en: '21 km' },
      { uz: '6 km', ru: '6 км', en: '6 km' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Uchni uchga bo'lsak bir chiqadi, demak bir bo'linma bir kilometr. Yettinchi belgi yetti kilometrda turibdi.",
      ru: 'Верно. Три разделить на три равно одному, значит одно деление это один километр. Седьмая метка стоит на семи километрах.',
      en: 'Correct. Three divided by three is one, so one division is one kilometre. The seventh mark stands at seven kilometres.',
    },
    wrong: [
      null,
      {
        uz: "Bir bo'linma uch kilometr emas. Uch kilometr — bu uchta bo'linma, ya'ni butun bir oraliq.",
        ru: 'Одно деление не равно трём километрам. Три километра это три деления, то есть целый промежуток.',
        en: 'One division is not three kilometres. Three kilometres is three divisions, that is a whole gap.',
      },
      {
        uz: "Bitta belgi kam sanalgan. Noldan keyingi birinchi belgi bir, shuning uchun yettinchi belgi yetti.",
        ru: 'Посчитано на одну метку меньше. Первая метка после нуля это один, поэтому седьмая метка это семь.',
        en: 'One mark short. The first mark after zero is one, so the seventh mark is seven.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Stansiya oxirgi vazifani berdi. Lumo City yo'li shkala ko'rinishida chizilgan.",
          "Unda nol, uch, olti, to'qqiz va o'n ikki imzolangan, har oraliqda uchtadan bo'linma bor.",
          "Bekat noldan hisoblaganda yettinchi belgida turibdi. U qaysi kilometrda ekanini toping.",
        ],
        ru: [
          'Станция дала последнее задание. Дорога Lumo City начерчена в виде шкалы.',
          'На ней подписаны ноль, три, шесть, девять и двенадцать, а в каждом промежутке по три деления.',
          'Остановка стоит на седьмой метке от нуля. Найди, на каком она километре.',
        ],
        en: [
          'The station has given a final task. The Lumo City road is drawn as a scale.',
          'It is labelled zero, three, six, nine and twelve, with three divisions in every gap.',
          'The stop stands on the seventh mark from zero. Find which kilometre it is at.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s15: {
    eyebrow: { uz: 'Missiya mukofoti', ru: 'Награда за миссию', en: 'Mission award' },
    stageLabel: { uz: 'Yakuniy bosqich', ru: 'Финальный этап', en: 'Final stage' },
    headTitle: {
      uz: 'Unvongacha bitta savol',
      ru: 'Один вопрос до звания',
      en: 'One question before your title',
    },
    headLead: {
      uz: "Bir bo'linma qiymati qanday topilishini ayting va unvonni oling.",
      ru: 'Скажи, как находят цену одного деления, и получи звание.',
      en: 'Say how the value of one division is found and claim your title.',
    },
    questionKicker: { uz: 'Yakuniy savol', ru: 'Финальный вопрос', en: 'Final question' },
    stepLabel: { uz: '1 qadam', ru: '1 шаг', en: '1 step' },
    reflectionQuestion: {
      uz: "Bir bo'linma qiymatini qanday topamiz?",
      ru: 'Как находим цену одного деления?',
      en: 'How do we find the value of one division?',
    },
    reflectionStart: {
      uz: "Bir bo'linma qiymatini topish uchun men…",
      ru: 'Чтобы найти цену одного деления, я…',
      en: 'To find the value of one division I…',
    },
    reflectionOptions: [
      {
        uz: "ikki imzolangan son farqini oradagi bo'linmalar soniga bo'laman",
        ru: 'делю разность двух подписанных чисел на количество делений между ними',
        en: 'divide the difference of two labelled numbers by the divisions between them',
      },
      {
        uz: "shkaladagi barcha belgilarni sanayman",
        ru: 'считаю все метки на шкале',
        en: 'count all the marks on the scale',
      },
      {
        uz: 'eng katta sonni ikkiga bo\'laman',
        ru: 'делю самое большое число на два',
        en: 'divide the largest number by two',
      },
    ],
    reflectionCorrectIndex: 0,
    reflectionCorrect: {
      uz: "To'g'ri. Farq va bo'linmalar soni — bu qoidaning ikki qismi. Shundan keyin har qanday asbobni o'qish mumkin.",
      ru: 'Верно. Разность и количество делений это две части правила. После этого можно читать любой прибор.',
      en: 'Correct. The difference and the number of divisions are the two parts of the rule. After that any instrument can be read.',
    },
    reflectionWrong: {
      uz: "Belgilar sonining o'zi qiymat bermaydi, eng katta sonni ikkiga bo'lish esa faqat tasodifan to'g'ri chiqadi. Farqni bo'linmalar soniga bo'lish kerak.",
      ru: 'Само количество меток значения не даёт, а деление наибольшего числа на два верно лишь случайно. Нужно делить разность на количество делений.',
      en: 'The count of marks alone gives no value, and dividing the largest number by two is right only by accident. The difference must be divided by the number of divisions.',
    },
    rewardAnnounce: { uz: 'Unvon olindi:', ru: 'Звание получено:', en: 'Title earned:' },
    awards: [
      { min: 5, title: { uz: 'Stansiya bosh metrologi', ru: 'Главный метролог станции', en: 'Chief station metrologist' } },
      { min: 3, title: { uz: 'Asboblar tekshiruvchisi', ru: 'Поверитель приборов', en: 'Instrument inspector' } },
      { min: 0, title: { uz: 'Stansiya kuzatuvchisi', ru: 'Наблюдатель станции', en: 'Station observer' } },
    ],
    mainLabel: { uz: 'Qoida', ru: 'Правило', en: 'Rule' },
    main: [
      {
        uz: "1. Yonma-yon turgan ikkita imzolangan sonning farqini olamiz.",
        ru: '1. Берём разность двух соседних подписанных чисел.',
        en: '1. Take the difference of two neighbouring labelled numbers.',
      },
      {
        uz: "2. Farqni oradagi bo'linmalar soniga bo'lamiz.",
        ru: '2. Делим разность на количество делений между ними.',
        en: '2. Divide the difference by the number of divisions between them.',
      },
      {
        uz: "3. Imzolangan sondan boshlab bo'linmalarni qo'shib boramiz.",
        ru: '3. От подписанного числа прибавляем деления одно за другим.',
        en: '3. Starting from a labelled number, add the divisions one by one.',
      },
      {
        uz: "Shkalada barcha bo'linmalar teng bo'lishi shart.",
        ru: 'Все деления на шкале обязаны быть равными.',
        en: 'All the divisions on a scale must be equal.',
      },
    ],
    nextLabel: { uz: 'Keyingi missiya', ru: 'Следующая миссия', en: 'Next mission' },
    nextText: {
      uz: "Butunni teng qismlarga bo'lish: kasr tushunchasi.",
      ru: 'Деление целого на равные части: понятие дроби.',
      en: 'Splitting a whole into equal parts: the idea of a fraction.',
    },
    audio: {
      intro: {
        uz: [
          "Missiya bajarildi. Stansiya barcha asboblarni tekshirib chiqdi.",
          "Bugun siz chizg'ich, termometr, soat va spidometrni bitta qoida bilan o'qishni o'rgandingiz.",
          'Unvonni ochish uchun bitta savol qoldi.',
        ],
        ru: [
          'Миссия выполнена. Станция проверила все приборы.',
          'Сегодня ты умеешь читать линейку, термометр, часы и спидометр по одному правилу.',
          'До звания остался один вопрос.',
        ],
        en: [
          'Mission complete. The station has checked every instrument.',
          'Today you can read a ruler, a thermometer, a clock and an odometer with a single rule.',
          'One question stands between you and the title.',
        ],
      },
    },
  },
};

// ===========================================================================
// CHIZMALAR
// ===========================================================================

// s0, s14 — stansiya devori: asboblar va taglikdagi chizma.
const StationScene = ({ mode = 'hook', solved = false }) => {
  const t = useT();
  const rays = [
    { y: 300, gaps: [0, 1, 2, 3, 4], bad: false },
    { y: 352, gaps: [0, 1, 3, 4], bad: true },
    { y: 404, gaps: [0, 1, 2], bad: false },
  ];
  const roadX = (km) => 60 + (km / 12) * 400;

  return (
    <FitSvg viewBox="0 0 520 464">
      <defs>
        <linearGradient id="d17-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E6F1F3" />
          <stop offset="1" stopColor="#F7FBFA" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="520" height="464" rx="22" fill="url(#d17-wall)" />

      {/* devordagi asboblar */}
      <g>
        {/* soat */}
        <circle cx="72" cy="76" r="38" fill="#FFFFFF" stroke="#2E4A5C" strokeWidth="3" />
        {Array.from({ length: 12 }, (_, index) => {
          const angle = (index * Math.PI) / 6;
          return (
            <line
              key={index}
              x1={72 + Math.sin(angle) * 30}
              y1={76 - Math.cos(angle) * 30}
              x2={72 + Math.sin(angle) * 34}
              y2={76 - Math.cos(angle) * 34}
              stroke="#2E4A5C"
              strokeWidth="2"
            />
          );
        })}
        <line x1="72" y1="76" x2="72" y2="54" stroke="#2E4A5C" strokeWidth="3" strokeLinecap="round" />
        <line x1="72" y1="76" x2="92" y2="86" stroke={T.accent} strokeWidth="2.6" strokeLinecap="round" />

        {/* termometr */}
        <rect x="166" y="34" width="22" height="82" rx="11" fill="#FFFFFF" stroke="#2E4A5C" strokeWidth="2.4" />
        <circle cx="177" cy="122" r="14" fill={T.accent} stroke="#2E4A5C" strokeWidth="2.4" />
        <rect x="173" y="82" width="8" height="36" fill={T.accent} />
        {Array.from({ length: 7 }, (_, index) => (
          <line key={index} x1="188" y1={46 + index * 11} x2={index % 2 === 0 ? 198 : 194} y2={46 + index * 11} stroke="#2E4A5C" strokeWidth="1.6" />
        ))}

        {/* chizg'ich */}
        <rect x="240" y="60" width="234" height="34" rx="6" fill="#F2E7C8" stroke="#D8C79A" strokeWidth="2" />
        {Array.from({ length: 23 }, (_, index) => (
          <line
            key={index}
            x1={250 + index * 10}
            y1="60"
            x2={250 + index * 10}
            y2={index % 5 === 0 ? 78 : 70}
            stroke="#9C8552"
            strokeWidth="1.4"
          />
        ))}
      </g>

      {/* stol yuzasi */}
      <rect x="0" y="150" width="520" height="8" fill="rgba(23,59,82,.09)" />

      {mode === 'hook' ? (
        <g>
          <rect x="34" y="188" width="452" height="252" rx="14" fill="#FDFDF8" stroke="rgba(23,59,82,.14)" strokeWidth="1.8" />
          <text x="260" y="220" textAnchor="middle" fill={T.ink2} fontSize="16" fontWeight="750" fontFamily="Manrope, sans-serif">
            {t({ uz: 'Tekshiruvga kelgan uchta chizma', ru: 'Три чертежа на проверку', en: 'Three drawings up for checking' })}
          </text>
          {rays.map((ray, rowIndex) => {
            const step = 74;
            return (
              <g key={rowIndex}>
                <text x="64" y={ray.y + 6} textAnchor="end" fill={T.ink3} fontSize="16" fontWeight="800" fontFamily="JetBrains Mono, monospace">
                  {rowIndex + 1}
                </text>
                <line x1="80" y1={ray.y} x2={80 + 4 * step + 24} y2={ray.y} stroke={T.ink} strokeWidth="2.4" />
                <path d={`M${80 + 4 * step + 24} ${ray.y} l-10 -5 v10 z`} fill={T.ink} />
                {ray.gaps.map((position, index) => (
                  <g key={index}>
                    <line x1={80 + position * step} y1={ray.y - 11} x2={80 + position * step} y2={ray.y + 11} stroke={T.ink} strokeWidth="2.2" />
                    <text
                      x={80 + position * step}
                      y={ray.y + 32}
                      textAnchor="middle"
                      fill={T.ink2}
                      fontSize="15"
                      fontWeight="800"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {index}
                    </text>
                  </g>
                ))}
              </g>
            );
          })}
        </g>
      ) : (
        <g>
          <rect x="34" y="188" width="452" height="252" rx="14" fill="#FDFDF8" stroke={solved ? T.success : 'rgba(23,59,82,.14)'} strokeWidth="2" />
          <text x="260" y="212" textAnchor="middle" fill={T.ink2} fontSize="16" fontWeight="750" fontFamily="Manrope, sans-serif">
            {t({ uz: "Lumo City yo'li", ru: 'Дорога Lumo City', en: 'The Lumo City road' })}
          </text>
          <rect x="52" y="290" width="416" height="26" rx="6" fill="#DFE7E6" />
          <line x1="60" y1="303" x2="460" y2="303" stroke="#FFFFFF" strokeWidth="3" strokeDasharray="14 12" />
          <line x1={roadX(0)} y1="330" x2={roadX(12)} y2="330" stroke={T.ink} strokeWidth="2.4" />
          {Array.from({ length: 13 }, (_, km) => (
            <g key={km}>
              <line x1={roadX(km)} y1="330" x2={roadX(km)} y2={km % 3 === 0 ? 310 : 318} stroke={km % 3 === 0 ? T.ink : T.ink3} strokeWidth={km % 3 === 0 ? 2.4 : 1.6} />
              {km % 3 === 0 && (
                <text x={roadX(km)} y="352" textAnchor="middle" fill={T.ink2} fontSize="15" fontWeight="800" fontFamily="JetBrains Mono, monospace">
                  {km}
                </text>
              )}
            </g>
          ))}
          <g>
            <path d={`M${roadX(7)} 286 l-9 -14 h18 z`} fill={solved ? T.success : T.accent} />
            <rect x={roadX(7) - 40} y="238" width="80" height="34" rx="11" fill="#FFFFFF" stroke={solved ? T.success : T.accent} strokeWidth="2.2" />
            <text
              x={roadX(7)}
              y="261"
              textAnchor="middle"
              fill={solved ? T.success : T.accent}
              fontSize="16"
              fontWeight="800"
              fontFamily="JetBrains Mono, monospace"
            >
              {solved ? '7 km' : '?'}
            </text>
          </g>
          <text x="260" y="390" textAnchor="middle" fill={T.ink3} fontSize="14" fontWeight="700" fontFamily="Manrope, sans-serif">
            {t({ uz: 'Bekat noldan yettinchi belgida', ru: 'Остановка на седьмой метке от нуля', en: 'The stop is on the seventh mark from zero' })}
          </text>
          {solved && (
            <text x="260" y="424" textAnchor="middle" fill={T.success} fontSize="19" fontWeight="800" fontFamily="JetBrains Mono, monospace">
              3 : 3 = 1 km
            </text>
          )}
        </g>
      )}
    </FitSvg>
  );
};

// s1 — sonlar nuri: O nuqta va birlik kesma.
const RayLesson = ({ frame = 0 }) => {
  const t = useT();
  const x = (value) => 70 + value * 62;
  return (
    <FitSvg viewBox="0 0 520 150">
      <g opacity={frame >= 1 ? 1 : 0.3} style={{ transition: 'opacity .4s' }}>
        <line x1={x(0)} y1="72" x2="486" y2="72" stroke={T.ink} strokeWidth="2.6" />
        <path d="M486 72 l-12 -6 v12 z" fill={T.ink} />
        <circle cx={x(0)} cy="72" r="5.4" fill={T.accent} />
        <text x={x(0)} y="46" textAnchor="middle" fill={T.accent} fontSize="17" fontWeight="800" fontFamily="JetBrains Mono, monospace">
          O
        </text>
        <text x="486" y="46" textAnchor="middle" fill={T.ink3} fontSize="17" fontWeight="800" fontFamily="JetBrains Mono, monospace">
          X
        </text>
      </g>
      <g opacity={frame >= 2 ? 1 : 0.3} style={{ transition: 'opacity .4s' }}>
        <path d={`M${x(0)} 96 L${x(1)} 96`} stroke={T.cyan} strokeWidth="4" />
        <path d={`M${x(0)} 90 L${x(0)} 102 M${x(1)} 90 L${x(1)} 102`} stroke={T.cyan} strokeWidth="2.4" />
        <Caption x={(x(0) + x(1)) / 2} y={124} text={t({ uz: 'birlik kesma', ru: 'единичный отрезок', en: 'unit segment' })} tone={T.cyan} />
      </g>
      <g opacity={frame >= 3 ? 1 : 0.3} style={{ transition: 'opacity .4s' }}>
        {[0, 1, 2, 3, 4, 5, 6].map((value) => (
          <g key={value}>
            <line x1={x(value)} y1="60" x2={x(value)} y2="84" stroke={T.ink} strokeWidth="2.2" />
            <text x={x(value)} y="34" textAnchor="middle" fill={T.ink2} fontSize="15" fontWeight="800" fontFamily="JetBrains Mono, monospace">
              {value}
            </text>
          </g>
        ))}
      </g>
    </FitSvg>
  );
};

// s7, s8 — soat.
const ClockFigure = ({ frame = 4, solved = false, highlight = false }) => {
  const t = useT();
  const cx = 260;
  const cy = 108;
  const r = 88;
  const point = (index, radius) => [
    cx + Math.sin((index * Math.PI) / 30) * radius,
    cy - Math.cos((index * Math.PI) / 30) * radius,
  ];
  return (
    <FitSvg viewBox="0 0 520 232">
      <circle cx={cx} cy={cy} r={r} fill="#FFFFFF" stroke="#2E4A5C" strokeWidth="3.4" />
      {Array.from({ length: 60 }, (_, index) => {
        const big = index % 5 === 0;
        const inZone = highlight && index >= 15 && index <= 20;
        const [x1, y1] = point(index, r - (big ? 14 : 8));
        const [x2, y2] = point(index, r - 2);
        return (
          <line
            key={index}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={inZone ? T.accent : big ? '#2E4A5C' : T.ink3}
            strokeWidth={inZone ? 2.8 : big ? 2.6 : 1.4}
          />
        );
      })}
      {Array.from({ length: 12 }, (_, index) => {
        const [tx, ty] = point((index + 1) * 5, r - 30);
        return (
          <text
            key={index}
            x={tx}
            y={ty + 6}
            textAnchor="middle"
            fill={highlight && (index === 2 || index === 3) ? T.accent : '#2E4A5C'}
            fontSize="15"
            fontWeight="800"
            fontFamily="JetBrains Mono, monospace"
          >
            {index + 1}
          </text>
        );
      })}
      <g opacity={frame >= 2 ? 1 : 0.35} style={{ transition: 'opacity .4s' }}>
        <line x1={cx} y1={cy} x2={point(6, r - 40)[0]} y2={point(6, r - 40)[1]} stroke="#2E4A5C" strokeWidth="4.4" strokeLinecap="round" />
        <line
          x1={cx}
          y1={cy}
          x2={point(solved ? 20 : 15, r - 18)[0]}
          y2={point(solved ? 20 : 15, r - 18)[1]}
          stroke={T.accent}
          strokeWidth="3"
          strokeLinecap="round"
          style={{ transition: 'all .5s' }}
        />
        <circle cx={cx} cy={cy} r="5" fill="#2E4A5C" />
      </g>
      <g opacity={frame >= 3 ? 1 : 0.35} style={{ transition: 'opacity .4s' }}>
        <Caption
          x={260}
          y={222}
          text={solved
            ? t({ uz: "3 dan 4 gacha 5 daqiqa", ru: 'От 3 до 4 пять минут', en: 'From 3 to 4 is five minutes' })
            : t({ uz: "Ikki raqam orasida beshta bo'linma", ru: 'Между двумя числами пять делений', en: 'Five divisions between two numbers' })}
          tone={solved ? T.success : T.ink3}
          size={solved ? 18 : 13}
        />
      </g>
    </FitSvg>
  );
};

// s9, s10 — spidometr ko'rsatkichi.
const OdometerFigure = ({ frame = 4, solved = false }) => {
  const t = useT();
  const rows = [
    { label: { uz: 'Safardan oldin', ru: 'До поездки', en: 'Before the trip' }, value: '3004', on: frame >= 2 },
    { label: { uz: 'Safardan keyin', ru: 'После поездки', en: 'After the trip' }, value: '3240', on: frame >= 3 },
  ];
  return (
    <FitSvg viewBox="0 0 520 232">
      {rows.map((row, index) => (
        <g key={row.value} opacity={row.on ? 1 : 0.3} style={{ transition: 'opacity .4s' }}>
          <text x="60" y={44 + index * 66} fill={T.ink3} fontSize="13" fontWeight="700" fontFamily="Manrope, sans-serif">
            {t(row.label)}
          </text>
          <rect x="58" y={54 + index * 66} width="236" height="44" rx="8" fill="#22394A" />
          {row.value.split('').map((digit, digitIndex) => (
            <g key={digitIndex}>
              <rect x={70 + digitIndex * 56} y={62 + index * 66} width="46" height="28" rx="4" fill="#F7FBFB" />
              <text
                x={93 + digitIndex * 56}
                y={84 + index * 66}
                textAnchor="middle"
                fill={T.ink}
                fontSize="19"
                fontWeight="800"
                fontFamily="JetBrains Mono, monospace"
              >
                {digit}
              </text>
            </g>
          ))}
          <text x="308" y={84 + index * 66} fill={T.ink3} fontSize="14" fontWeight="700" fontFamily="Manrope, sans-serif">
            km
          </text>
        </g>
      ))}
      <rect
        x="58"
        y="182"
        width="404"
        height="44"
        rx="13"
        fill={solved ? T.successSoft : 'rgba(23,59,82,.04)'}
        stroke={solved ? T.success : T.ink3}
        strokeWidth={solved ? 2.2 : 1.4}
        strokeDasharray={solved ? '' : '5 5'}
      />
      <text
        x="260"
        y="211"
        textAnchor="middle"
        fill={solved ? T.success : T.ink3}
        fontSize="19"
        fontWeight="800"
        fontFamily="JetBrains Mono, monospace"
      >
        {solved ? '3240 − 3004 = 236 km' : '3240 − 3004 = ?'}
      </text>
    </FitSvg>
  );
};

// s13 — Bit ning o'qishi.
const BitScaleFigure = ({ solved = false }) => {
  const t = useT();
  return (
    <FitSvg viewBox="0 0 520 232">
      <g transform="translate(0 -18)">
        <line x1="46" y1="96" x2="474" y2="96" stroke={T.ink} strokeWidth="2.6" />
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <g key={index}>
            <line
              x1={46 + index * 85.6}
              y1="96"
              x2={46 + index * 85.6}
              y2={index === 0 || index === 5 ? 72 : 82}
              stroke={index === 0 || index === 5 ? T.ink : T.ink3}
              strokeWidth={index === 0 || index === 5 ? 2.6 : 1.8}
            />
            {(index === 0 || index === 5) && (
              <text x={46 + index * 85.6} y="120" textAnchor="middle" fill={T.ink2} fontSize="16" fontWeight="800" fontFamily="JetBrains Mono, monospace">
                {index === 0 ? 0 : 500}
              </text>
            )}
            {solved && index > 0 && index < 5 && (
              <text x={46 + index * 85.6} y="120" textAnchor="middle" fill={index <= 3 ? T.success : T.ink3} fontSize="13" fontWeight="800" fontFamily="JetBrains Mono, monospace">
                {index * 100}
              </text>
            )}
          </g>
        ))}
        <path d="M302.8 62 l-9 -14 h18 z" fill={solved ? T.success : T.accent} />
        <text x="302.8" y="40" textAnchor="middle" fill={solved ? T.success : T.accent} fontSize="16" fontWeight="800" fontFamily="JetBrains Mono, monospace">
          {solved ? '300' : '?'}
        </text>
      </g>
      <rect x="98" y="150" width="324" height="44" rx="13" fill="#FFF6F3" stroke={T.accent} strokeWidth="2" />
      <text x="260" y="179" textAnchor="middle" fill={T.accent} fontSize="17" fontWeight="800" fontFamily="JetBrains Mono, monospace">
        Bit: 3
      </text>
      <Caption
        x={260}
        y={218}
        text={solved
          ? '500 : 5 = 100,  3 × 100 = 300'
          : t({ uz: "Bit belgilarni sanadi", ru: 'Bit посчитал метки', en: 'Bit counted the marks' })}
        tone={solved ? T.success : T.ink3}
        size={solved ? 16 : 13}
      />
    </FitSvg>
  );
};

// s11 — qoida kartasi.
const RulePanel = ({ frame = 0 }) => {
  const t = useT();
  return (
    <RuleRows
      frame={frame}
      rows={[
        {
          tone: T.cyan,
          head: t({ uz: 'Farqni oling', ru: 'Возьми разность', en: 'Take the difference' }),
          body: t({
            uz: 'Yonma-yon turgan ikkita imzolangan son',
            ru: 'Два соседних подписанных числа',
            en: 'Two neighbouring labelled numbers',
          }),
          formula: '100 − 0',
        },
        {
          tone: T.navy,
          head: t({ uz: "Bo'linmalarni sanang", ru: 'Посчитай деления', en: 'Count the divisions' }),
          body: t({ uz: 'Ikki son orasidagi kichik belgilar', ru: 'Маленькие метки между числами', en: 'The small marks between the numbers' }),
          formula: '5',
        },
        {
          tone: T.success,
          head: t({ uz: "Bo'ling", ru: 'Раздели', en: 'Divide' }),
          body: t({ uz: "Bu bir bo'linma qiymati", ru: 'Это и есть цена деления', en: 'That is the value of one division' }),
          formula: '100 : 5 = 20',
        },
        {
          tone: T.accent,
          head: t({ uz: 'Tekshiring', ru: 'Проверь', en: 'Check' }),
          body: t({
            uz: "Barcha bo'linmalar teng bo'lishi shart",
            ru: 'Все деления обязаны быть равными',
            en: 'All divisions must be equal',
          }),
          formula: '=',
        },
      ]}
    />
  );
};

// s12 — yo'riqnoma.
const OrderPanel = ({ solved = false }) => {
  const t = useT();
  return (
    <StepList
      steps={[
        t({ uz: 'Ikkita imzolangan sonni topaman', ru: 'Нахожу два подписанных числа', en: 'I find two labelled numbers' }),
        t({ uz: 'Farqini olaman', ru: 'Беру их разность', en: 'I take their difference' }),
        t({ uz: "Oradagi bo'linmalarni sanayman", ru: 'Считаю деления между ними', en: 'I count the divisions between them' }),
        t({ uz: "Farqni bo'linmalar soniga bo'laman", ru: 'Делю разность на количество делений', en: 'I divide the difference by the number of divisions' }),
      ]}
      showHint={solved}
      hint={t({
        uz: "Imzolanmagan belgi qiymat bermaydi, chunki uning soni hali noma'lum.",
        ru: 'Неподписанная метка значения не даёт, ведь её число ещё неизвестно.',
        en: 'An unlabelled mark gives no value, because its number is not known yet.',
      })}
    />
  );
};

// ===========================================================================
// EKRANLAR
// ===========================================================================
const Screen0 = (props) => (
  <ChoiceScreen {...props} plain ratio="28 / 25" ordinal={0} figure={() => <StationScene />} />
);
const Screen1 = (props) => (
  <RevealScreen {...props} ratio="520 / 150" figure={({ frame }) => <RayLesson frame={frame} />} />
);
const Screen2 = (props) => <ScaleRead {...props} />;
const Screen3 = (props) => (
  <RevealScreen
    {...props}
    ratio="520 / 150"
    figure={({ frame }) => (
      <ScaleFigure
        min={0}
        max={100}
        majorEvery={100}
        minorPerMajor={5}
        accentPair={frame >= 2 ? [0, 100] : null}
        caption={frame >= 3 ? '100 : 5 = 20' : null}
      />
    )}
  />
);
const Screen4 = (props) => (
  <NumPadScreen
    {...props}
    ratio="520 / 150"
    figure={({ solved }) => (
      <ScaleFigure
        min={0}
        max={60}
        majorEvery={15}
        minorPerMajor={3}
        accentPair={[0, 15]}
        caption={solved ? '15 : 3 = 5' : null}
      />
    )}
  />
);
const Screen5 = (props) => (
  <RevealScreen
    {...props}
    ratio="5 / 6"
    figure={({ frame }) => (
      <ScaleFigure
        min={0}
        max={40}
        majorEvery={10}
        minorPerMajor={5}
        vertical
        tube
        fillTo={24}
        unit="°"
        accentPair={frame >= 3 ? [0, 10] : null}
        caption={frame >= 3 ? '10 : 5 = 2' : null}
      />
    )}
  />
);
const Screen6 = (props) => <ScaleRead {...props} />;
const Screen7 = (props) => <RevealScreen {...props} figure={({ frame }) => <ClockFigure frame={frame} />} />;
const Screen8 = (props) => (
  <ChoiceScreen {...props} ordinal={2} figure={({ solved }) => <ClockFigure frame={4} highlight solved={solved} />} />
);
const Screen9 = (props) => <RevealScreen {...props} figure={({ frame }) => <OdometerFigure frame={frame} />} />;
const Screen10 = (props) => (
  <NumPadScreen {...props} figure={({ solved }) => <OdometerFigure frame={4} solved={solved} />} />
);
const Screen11 = (props) => (
  <RevealScreen {...props} plain figure={({ frame }) => <RulePanel frame={frame + 1} />} />
);
const Screen12 = (props) => (
  <ChoiceScreen {...props} ordinal={3} stack plain figure={({ solved }) => <OrderPanel solved={solved} />} />
);
const Screen13 = (props) => (
  <ChoiceScreen {...props} ordinal={4} figure={({ solved }) => <BitScaleFigure solved={solved} />} />
);
const Screen14 = (props) => (
  <ChoiceScreen {...props} plain ratio="28 / 25" ordinal={5} figure={({ solved }) => <StationScene mode="final" solved={solved} />} />
);
const Screen15 = (props) => <SummaryScreen {...props} />;

const SCREENS = [
  Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7,
  Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15,
];

export default function Grade4Dars17(props) {
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
