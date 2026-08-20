// ============================================================================
// 4-SINF · Dars 30 · Kattalik birliklarini aylantirish
//
// Manba: 26-29-darslar orqali kelgan darslik materiali (N. U. Bikbayeva,
// "Matematika. 4-sinf", o'zbek nashri): 37-bet birliklar jadvali, 55-bet
// kilogrammga aylantirish, 122-bet vaqt birliklari, 182-bet birlik kvadrat.
// Skelet: src/books/grade4/Dars30_SCENARIO.md.
// Syujet: O'LCHOV XIZMATINING KALIBRLASH PUNKTI (SYUJET_4SINF.md, 4-blok).
// 29-darsdan ko'prik: to'rtta zanjir alohida o'rganildi, endi ular bitta
// pultda uchrashadi. 31-darsga ko'prik: manifest qabul qilindi, keyingi
// buyurtma matn bilan keladi va unda ba'zi kattaliklar noma'lum.
//
// YADRO. Aylantirishda MIQDOR o'zgarmaydi, faqat yozuv o'zgaradi. Har juft
// birlikning o'z soni bor, universal o'nlik amal yo'q. Yo'nalish amalni
// belgilaydi: katta birlikdan kichigiga ko'paytiriladi va son kattalashadi,
// kichikdan kattasiga bo'linadi va son kichrayadi. Shu yo'nalish ayni paytda
// javobning tekshiruvi ham bo'ladi.
//
// RITM (metodist talabi): qisqa tushuntirish -> misol -> yana tushuntirish
// yoki qoida -> misol. Baholanadigan olti ekran: s2, s4, s6, s8, s10, s13.
//
// Infratuzilma ko'chirilmaydi, `kit/` dan import qilinadi (CLAUDE.md §5).
// ============================================================================
import {
  BitSVG, Caption, ChoiceScreen, FitSvg, KIT_STYLES, NumPadScreen, RecordRow,
  RevealScreen, RuleRows, StepList, SummaryScreen, T, TheoryLessonRoot,
  assertScreenTypeLabels, useT,
} from './kit/index.js';

const LESSON_META = {
  lessonId: 'convert-4-30-v2',
  slug: 'dars30-kattalik-birliklarini-aylantirish',
  lessonTitle: {
    uz: '30-dars. Kattalik birliklarini aylantirish',
    ru: 'Урок 30. Преобразование единиц величин',
    en: 'Lesson 30. Converting units of measure',
  },
  skillTags: ['unit_invariant', 'unit_pair_factor', 'convert_direction', 'mixed_units', 'area_factor'],
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

const FRAME_COUNTS = [5, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 3, 3, 3, 3, 3];

const CONTENT = {
  s0: {
    eyebrow: { uz: 'Kalibrlash punkti', ru: 'Пункт калибровки', en: 'The calibration point' },
    title: {
      uz: 'Pultga bitta tugma yetdimi?',
      ru: 'Хватило ли пульту одной кнопки?',
      en: 'Was one button enough for the console?',
    },
    question: {
      uz: 'Bit pultida asosiy xato nimada?',
      ru: 'В чём главная ошибка пульта Bit?',
      en: "What is the main mistake in Bit's console?",
    },
    options: [
      { uz: "Har juft birlikning o'z soni bor", ru: 'У каждой пары единиц своё число', en: 'Each pair of units has its own number' },
      { uz: "Sonni umuman o'zgartirmaslik kerak", ru: 'Число вообще не нужно менять', en: 'The number should not change at all' },
      { uz: "Ko'paytirish emas, har doim bo'lish kerak", ru: 'Нужно всегда делить, а не умножать', en: 'It should always divide, not multiply' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Uzunlik, massa, vaqt va yuza turli sonlar bilan ishlaydi.",
      ru: 'Верно. Длина, масса, время и площадь работают с разными числами.',
      en: 'Correct. Length, mass, time and area work with different numbers.',
    },
    wrong: [
      null,
      {
        uz: "Birlik o'zgarganda son ham o'zgaradi, aks holda uzunlik boshqa bo'lib qoladi.",
        ru: 'Когда меняется единица, меняется и число, иначе длина станет другой.',
        en: 'When the unit changes the number changes too, otherwise the length becomes a different one.',
      },
      {
        uz: "Yo'nalish har satrda bir xil emas. Kichik birlikka o'tganda son kattalashadi.",
        ru: 'Направление не одинаково в каждой строке. При переходе к мелкой единице число растёт.',
        en: 'The direction is not the same in every row. Moving to a smaller unit makes the number larger.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Salom, do'stim! O'lchov xizmatining kalibrlash punktiga xush kelibsiz.",
          "Har xizmat ma'lumotni o'z birligida yuboradi, rejaga esa boshqa birlikda tushishi kerak. Orasida aylantirish pulti turadi.",
          "Bit pultga bitta universal tugma qo'ydi va uni hamma satrga ishlatdi.",
          "Uch metr o'ttiz santimetr bo'lib chiqdi, to'rt tonna qirq kilogramm bo'ldi, ikki soat yigirma minut, besh kvadrat metr esa ellik kvadrat detsimetr bo'ldi.",
          "Reja to'rtala satrni rad etdi. Pultdagi asosiy xato nimada? Javobni tanlang.",
        ],
        ru: [
          'Привет, друг! Добро пожаловать на пункт калибровки измерительной службы.',
          'Каждая служба присылает данные в своей единице, а в план они должны попасть в другой. Между ними стоит пульт преобразований.',
          'Бит поставил на пульт одну универсальную кнопку и прогнал через неё все строки.',
          'Три метра стали тридцатью сантиметрами, четыре тонны сорока килограммами, два часа двадцатью минутами, а пять квадратных метров пятьюдесятью квадратными дециметрами.',
          'План отклонил все четыре строки. В чём главная ошибка пульта? Выбери ответ.',
        ],
        en: [
          'Hello, friend! Welcome to the calibration point of the measuring service.',
          'Every service sends its data in its own unit, and the city plan needs another one. The conversion console stands between them.',
          'Bit put one universal button on the console and ran every row through it.',
          'Three metres became thirty centimetres, four tonnes became forty kilograms, two hours became twenty minutes, and five square metres became fifty square decimetres.',
          'The plan rejected all four rows. What is the main mistake in the console? Choose an answer.',
        ],
      },
    },
  },

  s1: {
    eyebrow: { uz: 'Bitta miqdor, ikki yozuv', ru: 'Одна величина, две записи', en: 'One quantity, two records' },
    title: {
      uz: "Miqdor o'zgarmaydi, yozuv o'zgaradi",
      ru: 'Величина не меняется, меняется запись',
      en: 'The quantity stays, the record changes',
    },
    lead: {
      uz: "Uch metrli lentaning uzunligi o'zgarmaydi, uni santimetrda ham yozish mumkin.",
      ru: 'Длина ленты в три метра не меняется, её можно записать и в сантиметрах.',
      en: 'A three metre tape keeps its length, and it can be written in centimetres as well.',
    },
    note: {
      uz: "Kichik birlikka o'tganda son kattalashadi.",
      ru: 'При переходе к мелкой единице число становится больше.',
      en: 'Moving to a smaller unit makes the number larger.',
    },
    audio: {
      intro: {
        uz: [
          "Pultning birinchi satri uzunlik satri. Unda uch metrli lenta bor.",
          "Bir metrda yuz santimetr borligini yigirma oltinchi darsda ko'rgan edik.",
          "Lentani santimetrda yozsak, uch yuz santimetr chiqadi. Lentaning o'zi na qisqardi, na uzaydi.",
          "Demak aylantirishda miqdor saqlanadi. Son bilan birlik birga o'zgaradi va kichik birlikka o'tganda son kattalashadi.",
        ],
        ru: [
          'Первая строка пульта это строка длины. В ней лента длиной три метра.',
          'В одном метре сто сантиметров, это мы видели в двадцать шестом уроке.',
          'Если записать ленту в сантиметрах, получится триста сантиметров. Сама лента не стала ни короче, ни длиннее.',
          'Значит при преобразовании величина сохраняется. Число и единица меняются вместе, и при переходе к мелкой единице число растёт.',
        ],
        en: [
          'The first row of the console is the length row. It holds a tape of three metres.',
          'One metre holds a hundred centimetres, as we saw in lesson twenty six.',
          'If we write the tape in centimetres, it is three hundred centimetres. The tape itself became neither shorter nor longer.',
          'So the quantity is kept in a conversion. The number and the unit change together, and moving to a smaller unit makes the number larger.',
        ],
      },
    },
  },

  s2: {
    eyebrow: { uz: 'Uzunlik satri', ru: 'Строка длины', en: 'The length row' },
    title: {
      uz: '5 m 40 cm ni santimetrda yozing',
      ru: 'Запиши 5 м 40 см в сантиметрах',
      en: 'Write 5 m 40 cm in centimetres',
    },
    question: {
      uz: '5 m 40 cm necha santimetr?',
      ru: 'Сколько сантиметров в 5 м 40 см?',
      en: 'How many centimetres are 5 m 40 cm?',
    },
    options: [
      { uz: '540 cm', ru: '540 см', en: '540 cm' },
      { uz: '5040 cm', ru: '5040 см', en: '5040 cm' },
      { uz: '90 cm', ru: '90 см', en: '90 cm' },
      { uz: '45 cm', ru: '45 см', en: '45 cm' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Besh metr besh yuz santimetr, unga qirq santimetr qo'shiladi.",
      ru: 'Верно. Пять метров это пятьсот сантиметров, к ним прибавляют сорок.',
      en: 'Correct. Five metres is five hundred centimetres and forty is added to them.',
    },
    wrong: [
      null,
      {
        uz: "Sonlarni yonma yon yozish aylantirish emas. Avval metrni santimetrga o'tkazing.",
        ru: 'Записать числа рядом не значит преобразовать. Сначала переведи метры в сантиметры.',
        en: 'Writing the numbers side by side is not a conversion. First turn the metres into centimetres.',
      },
      {
        uz: "Bu natija o'nlik son bilan olingan. Bir metrda yuz santimetr bor.",
        ru: 'Этот результат получен с числом десять. В одном метре сто сантиметров.',
        en: 'This result uses the number ten. One metre holds a hundred centimetres.',
      },
      {
        uz: "Bunda metr va santimetr shunchaki qo'shilgan. Avval ikkisi bir birlikka keltiriladi.",
        ru: 'Здесь метры и сантиметры просто сложили. Сначала их приводят к одной единице.',
        en: 'Here the metres and centimetres were simply added. They are brought to one unit first.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Uzunlik satriga yangi qiymat keldi. Besh metr qirq santimetr.",
          "Avval metrni santimetrga aylantiring, keyin qolgan santimetrni qo'shing.",
          "Jami necha santimetr chiqadi? Javobni tanlang.",
        ],
        ru: [
          'В строку длины пришло новое значение. Пять метров сорок сантиметров.',
          'Сначала переведи метры в сантиметры, затем прибавь оставшиеся сантиметры.',
          'Сколько сантиметров получится всего? Выбери ответ.',
        ],
        en: [
          'A new value came into the length row. Five metres and forty centimetres.',
          'First turn the metres into centimetres, then add the centimetres that are left.',
          'How many centimetres are there altogether? Choose an answer.',
        ],
      },
    },
  },

  s3: {
    eyebrow: { uz: 'Massa satri', ru: 'Строка массы', en: 'The mass row' },
    title: {
      uz: "Massa zanjirining o'z sonlari",
      ru: 'У цепочки массы свои числа',
      en: 'The mass chain has its own numbers',
    },
    lead: {
      uz: "Grammdan tonnaga qadar har qadamning o'z soni bor: ming, yuz, o'n.",
      ru: 'От граммов до тонн у каждого шага своё число: тысяча, сто, десять.',
      en: 'From grams to tonnes each step has its own number: a thousand, a hundred, ten.',
    },
    note: {
      uz: "Bir tonnada ming kilogramm, bir sentnerda yuz kilogramm bor.",
      ru: 'В одной тонне тысяча килограммов, в одном центнере сто килограммов.',
      en: 'One tonne holds a thousand kilograms, one centner holds a hundred kilograms.',
    },
    audio: {
      intro: {
        uz: [
          "Ikkinchi satrni ochamiz. Massa zanjiri grammdan boshlanadi va tonnagacha boradi.",
          "Ming gramm bir kilogrammga teng.",
          "Yuz kilogramm bitta sentner, o'nta sentner esa bir tonna bo'ladi. Demak bir tonnada ming kilogramm bor.",
          "Katta birlikdan kichigiga o'tsak ko'paytiramiz, kichikdan kattasiga o'tsak bo'lamiz. Zanjirdagi har qadamning o'z soni bor.",
        ],
        ru: [
          'Открываем вторую строку. Цепочка массы начинается с граммов и доходит до тонн.',
          'Тысяча граммов равна одному килограмму.',
          'Сто килограммов это один центнер, а десять центнеров это одна тонна. Значит в одной тонне тысяча килограммов.',
          'От крупной единицы к мелкой умножаем, от мелкой к крупной делим. У каждого шага цепочки своё число.',
        ],
        en: [
          'We open the second row. The mass chain starts at grams and reaches tonnes.',
          'A thousand grams equals one kilogram.',
          'A hundred kilograms is one centner, and ten centners make one tonne. So one tonne holds a thousand kilograms.',
          'From a larger unit to a smaller one we multiply, from a smaller to a larger one we divide. Every step of the chain has its own number.',
        ],
      },
    },
  },

  s4: {
    eyebrow: { uz: 'Terib javob bering', ru: 'Набери ответ', en: 'Type the answer' },
    title: {
      uz: '4 t 200 kg ni kilogrammda',
      ru: 'Запиши 4 т 200 кг в килограммах',
      en: 'Write 4 t 200 kg in kilograms',
    },
    question: {
      uz: '4 t 200 kg necha kilogramm?',
      ru: 'Сколько килограммов в 4 т 200 кг?',
      en: 'How many kilograms are 4 t 200 kg?',
    },
    answer: 4200,
    unit: { uz: 'kg', ru: 'кг', en: 'kg' },
    correctText: {
      uz: "To'g'ri. To'rt tonna to'rt ming kilogramm, unga ikki yuz kilogramm qo'shiladi.",
      ru: 'Верно. Четыре тонны это четыре тысячи килограммов, к ним прибавляют двести.',
      en: 'Correct. Four tonnes is four thousand kilograms and two hundred is added to them.',
    },
    wrong: {
      uz: "Hali emas. Bir tonnada ming kilogramm borligini eslang va qoldiqni qo'shing.",
      ru: 'Пока нет. Вспомни, что в одной тонне тысяча килограммов, и прибавь остаток.',
      en: 'Not yet. Remember that one tonne holds a thousand kilograms and add the remainder.',
    },
    hintAfter: {
      uz: "To'rt tonna to'rt ming kilogramm. Endi ikki yuzni qo'shing.",
      ru: 'Четыре тонны это четыре тысячи килограммов. Теперь прибавь двести.',
      en: 'Four tonnes is four thousand kilograms. Now add two hundred.',
    },
    audio: {
      intro: {
        uz: [
          "Massa satri to'rt tonna ikki yuz kilogrammni yubordi.",
          "Rejaga faqat kilogramm tushadi. Tonnani kilogrammga aylantirib, qoldiqni qo'shing.",
          "Jami necha kilogramm bo'ladi? Javobni tering va tasdiqlang.",
        ],
        ru: [
          'Строка массы прислала четыре тонны двести килограммов.',
          'В план попадают только килограммы. Переведи тонны в килограммы и прибавь остаток.',
          'Сколько килограммов получится всего? Набери ответ и подтверди.',
        ],
        en: [
          'The mass row sent four tonnes and two hundred kilograms.',
          'Only kilograms go into the plan. Turn the tonnes into kilograms and add the remainder.',
          'How many kilograms are there altogether? Type the answer and confirm.',
        ],
      },
    },
  },

  s5: {
    eyebrow: { uz: 'Vaqt satri', ru: 'Строка времени', en: 'The time row' },
    title: {
      uz: "Vaqt o'nlik tizim emas",
      ru: 'Время не десятичная система',
      en: 'Time is not a decimal system',
    },
    lead: {
      uz: "Soniyadan kunga qadar oltmish, oltmish va yigirma to'rt sonlari ishlaydi.",
      ru: 'От секунды до суток работают числа шестьдесят, шестьдесят и двадцать четыре.',
      en: 'From a second to a day the numbers are sixty, sixty and twenty four.',
    },
    note: {
      uz: "Nol qo'shish bilan vaqtni aylantirib bo'lmaydi.",
      ru: 'Приписав нуль, время не преобразуешь.',
      en: 'You cannot convert time by adding a zero.',
    },
    audio: {
      intro: {
        uz: [
          "Uchinchi satr vaqt satri. Bu zanjir hammasidan boshqacha.",
          "Oltmish soniya bir minutga, oltmish minut bir soatga teng.",
          "Bir kunda yigirma to'rt soat, bir haftada yetti kun bor.",
          "Bu zanjirda o'nlik son yo'q, shuning uchun nol qo'shish bilan vaqtni aylantirib bo'lmaydi.",
        ],
        ru: [
          'Третья строка это строка времени. Эта цепочка отличается от всех.',
          'Шестьдесят секунд равны одной минуте, шестьдесят минут равны одному часу.',
          'В сутках двадцать четыре часа, а в неделе семь дней.',
          'В этой цепочке нет числа десять, поэтому приписав нуль, время не преобразуешь.',
        ],
        en: [
          'The third row is the time row. This chain is unlike the others.',
          'Sixty seconds equal one minute, and sixty minutes equal one hour.',
          'A day holds twenty four hours, and a week holds seven days.',
          'This chain has no number ten, so time cannot be converted by adding a zero.',
        ],
      },
    },
  },

  s6: {
    eyebrow: { uz: 'Terib javob bering', ru: 'Набери ответ', en: 'Type the answer' },
    title: {
      uz: '3 h 15 min ni minutda',
      ru: 'Запиши 3 ч 15 мин в минутах',
      en: 'Write 3 h 15 min in minutes',
    },
    question: {
      uz: '3 soat 15 minut necha minut?',
      ru: 'Сколько минут в 3 ч 15 мин?',
      en: 'How many minutes are 3 h 15 min?',
    },
    answer: 195,
    unit: { uz: 'min', ru: 'мин', en: 'min' },
    correctText: {
      uz: "To'g'ri. Uch soat bir yuz sakson minut, unga o'n besh minut qo'shiladi.",
      ru: 'Верно. Три часа это сто восемьдесят минут, к ним прибавляют пятнадцать.',
      en: 'Correct. Three hours is one hundred and eighty minutes and fifteen is added to them.',
    },
    wrong: {
      uz: "Hali emas. Har soatni oltmish minutga almashtiring, keyin qolgan minutni qo'shing.",
      ru: 'Пока нет. Замени каждый час шестьюдесятью минутами, затем прибавь оставшиеся минуты.',
      en: 'Not yet. Replace every hour with sixty minutes, then add the minutes that are left.',
    },
    hintAfter: {
      uz: "Uch soat bir yuz sakson minut. Endi o'n beshni qo'shing.",
      ru: 'Три часа это сто восемьдесят минут. Теперь прибавь пятнадцать.',
      en: 'Three hours is one hundred and eighty minutes. Now add fifteen.',
    },
    audio: {
      intro: {
        uz: [
          "Vaqt satri o'rnatish ishini yubordi. U uch soat o'n besh minut davom etadi.",
          "Rejaga faqat minut tushadi. Har soatni oltmish minutga almashtiring.",
          "Jami necha minut bo'ladi? Javobni tering va tasdiqlang.",
        ],
        ru: [
          'Строка времени прислала работу по установке. Она длится три часа пятнадцать минут.',
          'В план попадают только минуты. Замени каждый час шестьюдесятью минутами.',
          'Сколько минут получится всего? Набери ответ и подтверди.',
        ],
        en: [
          'The time row sent an installation job. It lasts three hours and fifteen minutes.',
          'Only minutes go into the plan. Replace every hour with sixty minutes.',
          'How many minutes are there altogether? Type the answer and confirm.',
        ],
      },
    },
  },

  s7: {
    eyebrow: { uz: 'Yuza satri', ru: 'Строка площади', en: 'The area row' },
    title: {
      uz: "Yuzada ikki tomon o'zgaradi",
      ru: 'У площади меняются две стороны',
      en: 'In area two sides change',
    },
    lead: {
      uz: "Kvadratning bo'yi ham, eni ham o'n bo'lakka bo'linadi, shuning uchun omil yuz.",
      ru: 'И длина, и ширина квадрата делятся на десять частей, поэтому множитель сто.',
      en: 'Both the length and the width of the square are split into ten, so the factor is a hundred.',
    },
    note: {
      uz: "Uzunlikda o'n turgan joyda yuzada yuz turadi.",
      ru: 'Где у длины стоит десять, у площади стоит сто.',
      en: 'Where length uses ten, area uses a hundred.',
    },
    audio: {
      intro: {
        uz: [
          "To'rtinchi satr yuza satri. Yigirma to'qqizinchi darsdagi birlik kvadratni eslaymiz.",
          "Tomoni bir metr bo'lgan kvadratning har tomonida o'nta detsimetr bor.",
          "Bo'yi bo'ylab o'n qator, eni bo'ylab o'n ustun chiqadi. Jami yuzta kichik kvadrat.",
          "Shuning uchun bir kvadrat metr yuz kvadrat detsimetrga teng. Uzunlikda o'n turgan joyda yuzada yuz turadi.",
        ],
        ru: [
          'Четвёртая строка это строка площади. Вспомним единичный квадрат из двадцать девятого урока.',
          'У квадрата со стороной один метр на каждой стороне по десять дециметров.',
          'По длине выходит десять рядов, по ширине десять столбцов. Всего сто маленьких квадратов.',
          'Поэтому один квадратный метр равен ста квадратным дециметрам. Где у длины стоит десять, у площади стоит сто.',
        ],
        en: [
          'The fourth row is the area row. Let us recall the unit square from lesson twenty nine.',
          'A square with a side of one metre has ten decimetres along each side.',
          'Along the length there are ten rows, along the width ten columns. A hundred small squares in all.',
          'That is why one square metre equals a hundred square decimetres. Where length uses ten, area uses a hundred.',
        ],
      },
    },
  },

  s8: {
    eyebrow: { uz: 'Yuzani aylantiring', ru: 'Переведи площадь', en: 'Convert the area' },
    title: {
      uz: '3 m² ni kvadrat detsimetrda',
      ru: 'Запиши 3 м² в квадратных дециметрах',
      en: 'Write 3 m² in square decimetres',
    },
    question: {
      uz: '3 m² necha dm²?',
      ru: 'Сколько дм² в 3 м²?',
      en: 'How many dm² are in 3 m²?',
    },
    options: [
      { uz: '300 dm²', ru: '300 дм²', en: '300 dm²' },
      { uz: '30 dm²', ru: '30 дм²', en: '30 dm²' },
      { uz: '3 000 dm²', ru: '3 000 дм²', en: '3 000 dm²' },
      { uz: '30 000 dm²', ru: '30 000 дм²', en: '30 000 dm²' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Uchta yuzlik guruh uch yuz kvadrat detsimetr beradi.",
      ru: 'Верно. Три группы по сто дают триста квадратных дециметров.',
      en: 'Correct. Three groups of a hundred give three hundred square decimetres.',
    },
    wrong: [
      null,
      {
        uz: "Bu tomon omili. Yuza uchun o'nni o'nga ko'paytirib yuz olinadi.",
        ru: 'Это множитель стороны. Для площади десять умножают на десять и получают сто.',
        en: 'This is the factor for a side. For area ten is multiplied by ten and gives a hundred.',
      },
      {
        uz: "Bu javobda bitta ortiqcha nol bor. Har kvadrat metrda yuz kvadrat detsimetr bor.",
        ru: 'В этом ответе один лишний нуль. В каждом квадратном метре сто квадратных дециметров.',
        en: 'This answer has one extra zero. Every square metre holds a hundred square decimetres.',
      },
      {
        uz: "Bu kvadrat santimetr omili. Kvadrat detsimetr uchun yuz ishlatiladi.",
        ru: 'Это множитель квадратных сантиметров. Для квадратных дециметров берут сто.',
        en: 'This is the factor for square centimetres. For square decimetres a hundred is used.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Yuza satrida uch kvadrat metrli panel bor.",
          "Har kvadrat metrda nechta kvadrat detsimetr borligini modelda sanang.",
          "Uch kvadrat metr necha kvadrat detsimetr? Javobni tanlang.",
        ],
        ru: [
          'В строке площади панель в три квадратных метра.',
          'Посчитай по модели, сколько квадратных дециметров в каждом квадратном метре.',
          'Сколько квадратных дециметров в трёх квадратных метрах? Выбери ответ.',
        ],
        en: [
          'The area row holds a panel of three square metres.',
          'Count on the model how many square decimetres are in each square metre.',
          'How many square decimetres are three square metres? Choose an answer.',
        ],
      },
    },
  },

  s9: {
    eyebrow: { uz: "Teskari yo'nalish", ru: 'Обратное направление', en: 'The reverse direction' },
    title: {
      uz: "Kichikdan kattaga bo'lamiz",
      ru: 'От мелкой к крупной делим',
      en: 'From small to large we divide',
    },
    lead: {
      uz: "Katta birlikka o'tganda son kichrayadi, qoldiq esa kichik birlikda qoladi.",
      ru: 'При переходе к крупной единице число уменьшается, а остаток остаётся в мелкой.',
      en: 'Moving to a larger unit makes the number smaller, and the remainder stays in the small unit.',
    },
    note: {
      uz: "Qoldiq nolga teng bo'lmasa, u kichik birlikda yoziladi.",
      ru: 'Если остаток не равен нулю, его записывают в мелкой единице.',
      en: 'If the remainder is not zero it is written in the small unit.',
    },
    audio: {
      intro: {
        uz: [
          "Xizmatlar ba'zan teskari yo'nalishni so'raydi. Reja katta birlikni kutadi.",
          "To'rt ming besh yuz grammni kilogrammga o'tkazamiz. Ming gramm bitta kilogramm bo'lgani uchun ming gramm bo'yicha guruhlaymiz.",
          "To'rtta to'liq guruh chiqadi, besh yuz gramm esa ortib qoladi.",
          "Demak to'rt ming besh yuz gramm to'rt kilogramm besh yuz gramm bo'ladi. Son kichraydi, qoldiq kichik birlikda qoladi.",
        ],
        ru: [
          'Иногда службы просят обратное направление. План ждёт крупную единицу.',
          'Переведём четыре тысячи пятьсот граммов в килограммы. Тысяча граммов это один килограмм, поэтому группируем по тысяче граммов.',
          'Выходит четыре полных группы, а пятьсот граммов остаются.',
          'Значит четыре тысячи пятьсот граммов это четыре килограмма пятьсот граммов. Число уменьшилось, а остаток остался в мелкой единице.',
        ],
        en: [
          'Sometimes the services ask for the reverse direction. The plan waits for a larger unit.',
          'Let us turn four thousand five hundred grams into kilograms. A thousand grams is one kilogram, so we group by a thousand grams.',
          'Four full groups come out, and five hundred grams are left over.',
          'So four thousand five hundred grams is four kilograms and five hundred grams. The number became smaller and the remainder stayed in the small unit.',
        ],
      },
    },
  },

  s10: {
    eyebrow: { uz: 'Massani qayta yozing', ru: 'Перепиши массу', en: 'Rewrite the mass' },
    title: {
      uz: '3 200 kg ni tonna va kg da',
      ru: 'Запиши 3 200 кг в тоннах и кг',
      en: 'Write 3 200 kg in tonnes and kg',
    },
    question: {
      uz: '3 200 kg qanday yoziladi?',
      ru: 'Как записать 3 200 кг?',
      en: 'How is 3 200 kg written?',
    },
    options: [
      { uz: '3 t 200 kg', ru: '3 т 200 кг', en: '3 t 200 kg' },
      { uz: '32 t', ru: '32 т', en: '32 t' },
      { uz: '3 t 20 kg', ru: '3 т 20 кг', en: '3 t 20 kg' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Uch ming ikki yuzda uchta ming bor, ikki yuz kilogramm esa ortib qoladi.",
      ru: 'Верно. В трёх тысячах двухстах есть три тысячи, а двести килограммов остаются.',
      en: 'Correct. Three thousand two hundred holds three thousands, and two hundred kilograms are left.',
    },
    wrong: [
      null,
      {
        uz: "Bu javob yuz bo'yicha guruhlangan. Bir tonnada ming kilogramm bor.",
        ru: 'Этот ответ сгруппирован по сто. В одной тонне тысяча килограммов.',
        en: 'This answer was grouped by a hundred. One tonne holds a thousand kilograms.',
      },
      {
        uz: "Qoldiq ikki yuz kilogramm edi, yigirma emas. Nolni tushirib qoldirmang.",
        ru: 'Остаток был двести килограммов, а не двадцать. Не теряй нуль.',
        en: 'The remainder was two hundred kilograms, not twenty. Do not drop the zero.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Ombor uch ming ikki yuz kilogramm yuk haqida xabar berdi.",
          "Reja bu satrni tonna va kilogrammda kutadi. Ming kilogramm bo'yicha guruhlang.",
          "Bu massa qanday yoziladi? Javobni tanlang.",
        ],
        ru: [
          'Склад сообщил о грузе в три тысячи двести килограммов.',
          'План ждёт эту строку в тоннах и килограммах. Сгруппируй по тысяче килограммов.',
          'Как записать эту массу? Выбери ответ.',
        ],
        en: [
          'The store reported a load of three thousand two hundred kilograms.',
          'The plan wants this row in tonnes and kilograms. Group by a thousand kilograms.',
          'How is this mass written? Choose an answer.',
        ],
      },
    },
  },

  s11: {
    eyebrow: { uz: 'Yodda tuting', ru: 'Запомни', en: 'Keep in mind' },
    title: {
      uz: 'Aylantirishning uch qadami',
      ru: 'Три шага преобразования',
      en: 'Three steps of a conversion',
    },
    lead: {
      uz: "Kattalik qanday bo'lsa ham, tartib o'zgarmaydi.",
      ru: 'Какой бы ни была величина, порядок не меняется.',
      en: 'Whatever the quantity, the order stays the same.',
    },
    audio: {
      intro: {
        uz: [
          "Pultning qoidasini yig'amiz. Birinchi qadam, qaysi juft birlik kerakligini aniqlang va shu juftning munosabatini yozing.",
          "Ikkinchi qadam, yo'nalishni tanlang. Katta birlikdan kichigiga ko'paytiriladi, kichikdan kattasiga bo'linadi.",
          "Uchinchi qadam, aralash qismlarni qo'shing, javobda birlikni yozing va sonni tekshiring. Son yo'nalishga mos kattalashgan yoki kichraygan bo'lishi kerak.",
        ],
        ru: [
          'Соберём правило пульта. Первый шаг, определи нужную пару единиц и запиши соотношение именно этой пары.',
          'Второй шаг, выбери направление. От крупной единицы к мелкой умножают, от мелкой к крупной делят.',
          'Третий шаг, сложи смешанные части, запиши в ответе единицу и проверь число. Оно должно вырасти или уменьшиться по направлению.',
        ],
        en: [
          'Let us put the rule of the console together. Step one, find the pair of units you need and write the relationship of that exact pair.',
          'Step two, choose the direction. From a larger unit to a smaller one we multiply, from a smaller to a larger one we divide.',
          'Step three, add the mixed parts, write the unit in the answer and check the number. It has to grow or shrink with the direction.',
        ],
      },
    },
  },

  s12: {
    eyebrow: { uz: "Yo'nalishni tanlang", ru: 'Выбери направление', en: 'Choose the direction' },
    title: {
      uz: "6 000 mm ni metrga o'tkazish",
      ru: 'Перевести 6 000 мм в метры',
      en: 'Turning 6 000 mm into metres',
    },
    question: {
      uz: 'Qanday amal bajariladi?',
      ru: 'Какое действие выполняют?',
      en: 'Which operation is used?',
    },
    options: [
      { uz: "1000 ga bo'lamiz", ru: 'Делим на 1000', en: 'We divide by 1000' },
      { uz: "1000 ga ko'paytiramiz", ru: 'Умножаем на 1000', en: 'We multiply by 1000' },
      { uz: "10 ga bo'lamiz", ru: 'Делим на 10', en: 'We divide by 10' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Millimetrdan metrga uch qadam bor, shuning uchun ming bo'yicha bo'linadi. Olti metr chiqadi.",
      ru: 'Верно. От миллиметра до метра три шага, поэтому делят на тысячу. Выходит шесть метров.',
      en: 'Correct. From a millimetre to a metre there are three steps, so we divide by a thousand. It gives six metres.',
    },
    wrong: [
      null,
      {
        uz: "Ko'paytirish sonni kattalashtiradi. Metr millimetrdan katta, demak son kichrayishi kerak.",
        ru: 'Умножение увеличивает число. Метр крупнее миллиметра, значит число должно уменьшиться.',
        en: 'Multiplying makes the number larger. A metre is larger than a millimetre, so the number has to get smaller.',
      },
      {
        uz: "O'n faqat bitta qadamni beradi. Millimetrdan metrga uchta qadam bor.",
        ru: 'Десять покрывает только один шаг. От миллиметра до метра три шага.',
        en: 'Ten covers only one step. From a millimetre to a metre there are three steps.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Pultga yangi so'rov keldi. Olti ming millimetrni metrda yozish kerak.",
          "Millimetr metrdan kichik. Zanjirdagi qadamlarni sanab, sonning qanday o'zgarishini o'ylang.",
          "Qanday amal bajariladi? Javobni tanlang.",
        ],
        ru: [
          'На пульт пришёл новый запрос. Шесть тысяч миллиметров нужно записать в метрах.',
          'Миллиметр мельче метра. Посчитай шаги цепочки и подумай, как изменится число.',
          'Какое действие выполняют? Выбери ответ.',
        ],
        en: [
          'A new request came to the console. Six thousand millimetres has to be written in metres.',
          'A millimetre is smaller than a metre. Count the steps of the chain and think how the number changes.',
          'Which operation is used? Choose an answer.',
        ],
      },
    },
  },

  s13: {
    eyebrow: { uz: "Bitning yozuvi", ru: 'Запись Bit', en: 'Bit record' },
    title: {
      uz: 'Yuza satrini tekshiramiz',
      ru: 'Проверяем строку площади',
      en: 'Checking the area row',
    },
    question: {
      uz: 'Xato qaysi qatorda?',
      ru: 'В какой строке ошибка?',
      en: 'Which line holds the error?',
    },
    steps: [
      { uz: 'Kattalik yuza, maqsad birlik dm²', ru: 'Величина площадь, целевая единица дм²', en: 'Measure area, target unit dm²' },
      { uz: 'Munosabat: 1 m² = 10 dm²', ru: 'Соотношение: 1 м² = 10 дм²', en: 'Relationship: 1 m² = 10 dm²' },
      { uz: '5 · 10 = 50', ru: '5 · 10 = 50', en: '5 · 10 = 50' },
      { uz: 'Javob: 50 dm²', ru: 'Ответ: 50 дм²', en: 'Answer: 50 dm²' },
    ],
    options: [
      { uz: "Ikkinchi qatorda: 1 m² = 100 dm²", ru: 'Во второй строке: 1 м² = 100 дм²', en: 'In the second line: 1 m² = 100 dm²' },
      { uz: "Uchinchi qatorda: ko'paytirish noto'g'ri", ru: 'В третьей строке: умножение неверно', en: 'In the third line: the multiplication is wrong' },
      { uz: 'Birinchi qatorda: maqsad birlik boshqa', ru: 'В первой строке: целевая единица другая', en: 'In the first line: the target unit is different' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Yuza omili yuz. Besh kvadrat metr besh yuz kvadrat detsimetr bo'ladi.",
      ru: 'Верно. Множитель площади сто. Пять квадратных метров это пятьсот квадратных дециметров.',
      en: 'Correct. The area factor is a hundred. Five square metres is five hundred square decimetres.',
    },
    wrong: [
      null,
      {
        uz: "Beshni o'nga ko'paytirish to'g'ri bajarilgan. Xato undan oldingi munosabatda.",
        ru: 'Умножение пяти на десять выполнено верно. Ошибка в соотношении перед ним.',
        en: 'Five times ten was worked out correctly. The error is in the relationship before it.',
      },
      {
        uz: "Maqsad birlik to'g'ri tanlangan. Xato keyingi qatorda.",
        ru: 'Целевая единица выбрана верно. Ошибка в следующей строке.',
        en: 'The target unit was chosen correctly. The error is in the next line.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Bit yuza satrini qaytadan to'ldirdi va to'rt qator yozdi.",
          "Qatorlarni ketma ket o'qing va faqat bitta yolg'on qatorni toping.",
          "Xato qaysi qatorda? Javobni tanlang.",
        ],
        ru: [
          'Bit заново заполнил строку площади и записал четыре строки.',
          'Прочитай строки по порядку и найди только одну ложную.',
          'В какой строке ошибка? Выбери ответ.',
        ],
        en: [
          'Bit filled in the area row again and wrote four lines.',
          'Read the lines in order and find the one that is false.',
          'Which line holds the error? Choose an answer.',
        ],
      },
    },
  },

  s14: {
    eyebrow: { uz: 'Shahar qarori', ru: 'Решение города', en: 'The city decision' },
    title: {
      uz: 'Manifest qabul qilinadimi?',
      ru: 'Примут ли манифест?',
      en: 'Will the manifest be accepted?',
    },
    lead: {
      uz: "Kabel 3 m, batareya 4 kg, o'rnatish 1 soat 20 min, panel 2 m².",
      ru: 'Кабель 3 м, батарея 4 кг, установка 1 ч 20 мин, панель 2 м².',
      en: 'Cable 3 m, battery 4 kg, installation 1 h 20 min, panel 2 m².',
    },
    question: {
      uz: "Qaysi to'plamda hammasi to'g'ri?",
      ru: 'В каком наборе всё верно?',
      en: 'Which set is right all through?',
    },
    options: [
      { uz: '300 cm · 4000 g · 80 min · 200 dm²', ru: '300 см · 4000 г · 80 мин · 200 дм²', en: '300 cm · 4000 g · 80 min · 200 dm²' },
      { uz: '30 cm · 40 g · 120 min · 20 dm²', ru: '30 см · 40 г · 120 мин · 20 дм²', en: '30 cm · 40 g · 120 min · 20 dm²' },
      { uz: '3000 cm · 400 g · 70 min · 2000 dm²', ru: '3000 см · 400 г · 70 мин · 2000 дм²', en: '3000 cm · 400 g · 70 min · 2000 dm²' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. To'rt satr uchun to'rt xil son ishlatildi va manifest qabul qilindi.",
      ru: 'Верно. Для четырёх строк взяты четыре разных числа, и манифест принят.',
      en: 'Correct. Four different numbers were used for the four rows and the manifest is accepted.',
    },
    wrong: [
      null,
      {
        uz: "Bu to'plamda hamma satrga bitta o'nlik son qo'yilgan. Har juftning o'z soni bor.",
        ru: 'В этом наборе на все строки поставлено одно число десять. У каждой пары своё число.',
        en: 'In this set one number ten was used for every row. Each pair has its own number.',
      },
      {
        uz: "Bu to'plamda omillar ortiqcha katta olingan va soatga yigirma minut noto'g'ri qo'shilgan.",
        ru: 'В этом наборе множители взяты слишком большими, а двадцать минут к часу прибавлены неверно.',
        en: 'In this set the factors are too large and the twenty minutes were added to the hour wrongly.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Manifestda to'rt satr bor. Kabel uch metr, batareya to'rt kilogramm, o'rnatish bir soat yigirma minut, panel ikki kvadrat metr.",
          "Har satr uchun o'z munosabatini tanlab, uchta to'plamni solishtiring.",
          "Qaysi to'plamda hammasi to'g'ri? Javobni tanlang.",
        ],
        ru: [
          'В манифесте четыре строки. Кабель три метра, батарея четыре килограмма, установка один час двадцать минут, панель два квадратных метра.',
          'Выбери для каждой строки своё соотношение и сравни три набора.',
          'В каком наборе всё верно? Выбери ответ.',
        ],
        en: [
          'The manifest holds four rows. Cable three metres, battery four kilograms, installation one hour twenty minutes, panel two square metres.',
          'Choose the right relationship for every row and compare the three sets.',
          'Which set is right all through? Choose an answer.',
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
      uz: "Pult sozlandi. Javobni tanlang va kalibrlashni yopib qo'ying.",
      ru: 'Пульт настроен. Выбери ответ и закрой калибровку.',
      en: 'The console is set. Choose the answer and close the calibration.',
    },
    questionKicker: { uz: 'YAKUNIY SAVOL', ru: 'ФИНАЛЬНЫЙ ВОПРОС', en: 'FINAL QUESTION' },
    stepLabel: { uz: '1 QADAM', ru: '1 ШАГ', en: '1 STEP' },
    reflectionQuestion: {
      uz: 'Aylantirilgan javob qanday tekshiriladi?',
      ru: 'Как проверяют преобразованный ответ?',
      en: 'How is a converted answer checked?',
    },
    reflectionStart: {
      uz: 'Bitta javobni tanlang.',
      ru: 'Выбери один ответ.',
      en: 'Choose one answer.',
    },
    reflectionOptions: [
      { uz: "Son yo'nalishga mos o'zgardimi", ru: 'Изменилось ли число по направлению', en: 'Whether the number changed with the direction' },
      { uz: 'Son yaxlitlanadi', ru: 'Число округляют', en: 'The number is rounded' },
      { uz: 'Birlik olib tashlanadi', ru: 'Единицу убирают', en: 'The unit is removed' },
    ],
    reflectionCorrectIndex: 0,
    reflectionCorrect: {
      uz: "Shunday. Kichik birlikka o'tganda son kattalashadi, katta birlikka o'tganda kichrayadi.",
      ru: 'Именно так. К мелкой единице число растёт, к крупной уменьшается.',
      en: 'Exactly. Towards a smaller unit the number grows, towards a larger one it shrinks.',
    },
    reflectionWrong: {
      uz: "Hali emas. Bitning to'rt satrini eslang, ularda son yo'nalishga mos kelmagan edi.",
      ru: 'Пока нет. Вспомни четыре строки Bit: в них число не совпало с направлением.',
      en: 'Not yet. Remember the four rows of Bit: there the number did not match the direction.',
    },
    rewardAnnounce: { uz: 'Unvon olindi:', ru: 'Звание получено:', en: 'Title earned:' },
    mainLabel: { uz: "Pultning to'rt qoidasi", ru: 'Четыре правила пульта', en: 'The four rules of the console' },
    main: [
      {
        uz: "Aylantirishda miqdor o'zgarmaydi, yozuv o'zgaradi.",
        ru: 'При преобразовании величина не меняется, меняется запись.',
        en: 'In a conversion the quantity stays and the record changes.',
      },
      {
        uz: "Har juft birlikning o'z soni bor, universal son yo'q.",
        ru: 'У каждой пары единиц своё число, универсального нет.',
        en: 'Each pair of units has its own number, there is no universal one.',
      },
      {
        uz: "Katta birlikdan kichigiga ko'paytiramiz, kichikdan kattasiga bo'lamiz.",
        ru: 'От крупной единицы к мелкой умножаем, от мелкой к крупной делим.',
        en: 'From a larger unit to a smaller one we multiply, from a smaller to a larger one we divide.',
      },
      {
        uz: "Aralash qismlar qo'shiladi, javobda birlik yoziladi va son tekshiriladi.",
        ru: 'Смешанные части складывают, в ответе пишут единицу и проверяют число.',
        en: 'The mixed parts are added, the unit is written in the answer and the number is checked.',
      },
    ],
    awards: [
      {
        min: 6,
        title: { uz: 'Aylantirish ustasi', ru: 'Мастер преобразований', en: 'Conversion expert' },
        text: {
          uz: "To'rtala zanjir birinchi urinishda to'g'ri aylantirildi.",
          ru: 'Все четыре цепочки преобразованы верно с первой попытки.',
          en: 'All four chains were converted correctly on the first attempt.',
        },
      },
      {
        min: 4,
        title: { uz: 'Kalibrlash nazoratchisi', ru: 'Контролёр калибровки', en: 'Calibration controller' },
        text: {
          uz: "Siz juftni ishonchli tanlaysiz va yo'nalishni tekshirasiz.",
          ru: 'Ты уверенно выбираешь пару и проверяешь направление.',
          en: 'You choose the pair with confidence and check the direction.',
        },
      },
      {
        min: 0,
        title: { uz: "O'lchov xizmati xodimi", ru: 'Сотрудник измерительной службы', en: 'Measuring service clerk' },
        text: {
          uz: "Asos qo'yildi. Zanjirlarni takrorlab, natijani yaxshilashga harakat qiling.",
          ru: 'Основа заложена. Повтори цепочки и попробуй улучшить результат.',
          en: 'The base is laid. Repeat the chains and try to improve the result.',
        },
      },
    ],
    nextLabel: { uz: 'Keyingi missiya', ru: 'Следующая миссия', en: 'Next mission' },
    nextText: {
      uz: "Manifest qabul qilindi. Keyingi buyurtma matn bilan keladi va unda ba'zi kattaliklar noma'lum.",
      ru: 'Манифест принят. Следующая заявка придёт текстом, и часть величин в ней неизвестна.',
      en: 'The manifest is accepted. The next order comes as text and some of its quantities are unknown.',
    },
    audio: {
      intro: {
        uz: [
          "Pult sozlandi. To'rt satr o'z soni bilan ishladi va manifest qabul qilindi.",
          "Bitta savol qoldi. Javobni tanlang va unvonni oling.",
          "Aylantirilgan javob qanday tekshiriladi? Javobni tanlang.",
        ],
        ru: [
          'Пульт настроен. Четыре строки сработали со своим числом, и манифест принят.',
          'Остался один вопрос. Выбери ответ и получи звание.',
          'Как проверяют преобразованный ответ? Выбери ответ.',
        ],
        en: [
          'The console is set. Four rows worked with their own number and the manifest is accepted.',
          'One question is left. Choose the answer and claim your title.',
          'How is a converted answer checked? Choose an answer.',
        ],
      },
    },
  },
};

// ---------------------------------------------------------------------------
// CHIZMALAR
//
// Beshta model butun darsni ko'taradi va qayta ishlatiladi:
//   ConsolePanel — pultning to'rt satri (s0);
//   MixedBar     — aralash qiymatni kichik birlikda yig'ish (s1, s2, s4, s6);
//   UnitLadder   — birliklar zanjiri va ikki yo'nalish (s3, s5, s12);
//   AreaGrid     — birlik kvadrat va kvadratga ko'tarilgan omil (s7, s8);
//   SplitBar     — teskari yo'nalish, qoldiq bilan bo'lish (s9, s10).
// Bir xil geometriya turli ma'lumot bilan ishlaydi, shuning uchun bola usul
// bitta ekanini ko'radi.
// ---------------------------------------------------------------------------

const MONO = 'JetBrains Mono, monospace';
const SANS = 'Manrope, sans-serif';
const D30_GRID = 'rgba(23,59,82,.12)';

// Birlik belgilari chizmada ham tarjima qilinadi: ruscha ekranda santimetr
// "см" bo'lib yozilishi kerak, aks holda chizma variantlarga mos kelmaydi.
const UNIT = {
  mm: { uz: 'mm', ru: 'мм', en: 'mm' },
  cm: { uz: 'cm', ru: 'см', en: 'cm' },
  dm: { uz: 'dm', ru: 'дм', en: 'dm' },
  m: { uz: 'm', ru: 'м', en: 'm' },
  g: { uz: 'g', ru: 'г', en: 'g' },
  kg: { uz: 'kg', ru: 'кг', en: 'kg' },
  q: { uz: 'q', ru: 'ц', en: 'q' },
  t: { uz: 't', ru: 'т', en: 't' },
  s: { uz: 's', ru: 'с', en: 's' },
  min: { uz: 'min', ru: 'мин', en: 'min' },
  h: { uz: 'h', ru: 'ч', en: 'h' },
  kun: { uz: 'kun', ru: 'сут', en: 'day' },
  m2: { uz: 'm²', ru: 'м²', en: 'm²' },
  dm2: { uz: 'dm²', ru: 'дм²', en: 'dm²' },
};

// To'q sahna: Bitning universal tugmasi to'rt satrni buzib chiqargan.
const CONSOLE_ROWS = [
  { key: 'len', label: { uz: 'UZUNLIK', ru: 'ДЛИНА', en: 'LENGTH' }, unit: 'm', target: 'cm', from: 3, bad: 30, good: 300 },
  { key: 'mass', label: { uz: 'MASSA', ru: 'МАССА', en: 'MASS' }, unit: 't', target: 'kg', from: 4, bad: 40, good: 4000 },
  { key: 'time', label: { uz: 'VAQT', ru: 'ВРЕМЯ', en: 'TIME' }, unit: 'h', target: 'min', from: 2, bad: 20, good: 120 },
  { key: 'area', label: { uz: 'YUZA', ru: 'ПЛОЩАДЬ', en: 'AREA' }, unit: 'm2', target: 'dm2', from: 5, bad: 50, good: 500 },
];

const ConsolePanel = ({ solved = false }) => {
  const t = useT();
  const rowH = 34;
  const gap = 10;
  return (
    <FitSvg viewBox="0 0 660 180">
      {CONSOLE_ROWS.map((row, index) => {
        const y = 6 + index * (rowH + gap);
        const tone = solved ? '#B7E86A' : '#FFB39B';
        return (
          <g key={row.key}>
            <rect
              x={10}
              y={y}
              width={640}
              height={rowH}
              rx={11}
              fill={solved ? 'rgba(149,201,61,.12)' : 'rgba(255,91,53,.13)'}
              stroke={solved ? 'rgba(149,201,61,.52)' : 'rgba(255,179,155,.52)'}
              strokeWidth={1.4}
            />
            <text x={26} y={y + 22} fill="#9DE3E7" fontSize="12" fontWeight="800" letterSpacing="1.5" fontFamily={MONO}>
              {t(row.label)}
            </text>
            <text x={318} y={y + 23} textAnchor="end" fill="#EAF9FB" fontSize="16" fontWeight="800" fontFamily={MONO}>
              {`${row.from} ${t(UNIT[row.unit])}`}
            </text>
            <text x={346} y={y + 23} textAnchor="middle" fill="#7FCBD4" fontSize="15" fontWeight="800" fontFamily={MONO}>
              →
            </text>
            <text x={374} y={y + 23} fill={tone} fontSize="16" fontWeight="800" fontFamily={MONO}>
              {`${solved ? row.good : row.bad} ${t(UNIT[row.target])}`}
            </text>
            <circle cx={628} cy={y + rowH / 2} r={6} fill={solved ? '#95C93D' : '#FF8A66'} />
          </g>
        );
      })}
    </FitSvg>
  );
};

// Aralash qiymat kichik birlikda yig'iladi: yuqorida berilgan yozuv, pastda
// bir xil miqdorning ikki bo'lagi, oxirida natija.
const MixedBar = ({
  big, small = 0, factor, bigUnit, smallUnit, frame = 9, solved = false,
}) => {
  const t = useT();
  const x0 = 76;
  const x1 = 584;
  const span = x1 - x0;
  const bu = t(UNIT[bigUnit]);
  const su = t(UNIT[smallUnit]);
  const converted = big * factor;
  const total = converted + small;
  const bigW = small > 0 ? Math.min(span - 74, (converted / total) * span) : span;
  const restX = x0 + bigW + 5;
  const restW = x1 - restX;
  const head = small > 0 ? `${big} ${bu} ${small} ${su}` : `${big} ${bu}`;
  const result = small > 0
    ? `${converted} + ${small} = ${total} ${su}`
    : `${big} ${bu} = ${total} ${su}`;
  return (
    <FitSvg viewBox="0 0 660 190">
      <Caption
        x={330}
        y={20}
        text={t({ uz: 'bitta miqdor, ikki yozuv', ru: 'одна величина, две записи', en: 'one quantity, two records' })}
      />
      <rect x={x0} y={34} width={span} height={42} rx={12} fill={T.cyanSoft} stroke={T.cyan} strokeWidth={2} />
      <text x={x0 + span / 2} y={61} textAnchor="middle" fill={T.cyan} fontSize="19" fontWeight="800" fontFamily={MONO}>
        {head}
      </text>

      {frame >= 1 && (
        <text x={330} y={97} textAnchor="middle" fill={T.ink2} fontSize="15" fontWeight="800" fontFamily={MONO}>
          {`1 ${bu} = ${factor} ${su}`}
        </text>
      )}

      {frame >= 2 && (
        <g>
          <rect x={x0} y={110} width={bigW} height={42} rx={12} fill="rgba(149,201,61,.22)" stroke={T.lime} strokeWidth={2} />
          <text x={x0 + bigW / 2} y={137} textAnchor="middle" fill="#4C6B18" fontSize="18" fontWeight="800" fontFamily={MONO}>
            {`${converted} ${su}`}
          </text>
          {small > 0 && (
            <g>
              <rect x={restX} y={110} width={restW} height={42} rx={9} fill={T.warnSoft} stroke={T.warn} strokeWidth={2} />
              <text x={restX + restW / 2} y={137} textAnchor="middle" fill={T.warn} fontSize="16" fontWeight="800" fontFamily={MONO}>
                {`${small} ${su}`}
              </text>
            </g>
          )}
        </g>
      )}

      {(frame >= 3 || solved) && (
        <Caption x={330} y={177} text={result} tone={T.success} size={18} />
      )}
    </FitSvg>
  );
};

// Birliklar zanjiri. Chapda kichik birlik, o'ngda katta. Yuqoridagi o'q katta
// birlikdan kichigiga (ko'paytirish), pastdagi o'q kichikdan kattasiga
// (bo'lish) — yo'nalish chizmaning o'zida ko'rinadi.
const LadderArrow = ({ from, to, y, color }) => {
  const back = from < to ? -8 : 8;
  return (
    <g>
      <line x1={from} y1={y} x2={to} y2={y} stroke={color} strokeWidth={1.7} />
      <path d={`M ${to} ${y} L ${to + back} ${y - 4.5} L ${to + back} ${y + 4.5} Z`} fill={color} />
    </g>
  );
};

const UnitLadder = ({ items, factors, frame = 9, highlight = [], litUnits = [] }) => {
  const t = useT();
  const wide = items.length >= 5;
  const boxW = wide ? 84 : 98;
  const gap = wide ? 50 : 64;
  const total = items.length * boxW + (items.length - 1) * gap;
  const x0 = (660 - total) / 2;
  const boxX = (index) => x0 + index * (boxW + gap);
  return (
    <FitSvg viewBox="0 0 660 156">
      {frame >= 2 && (
        <text x={x0} y={20} fill={T.accent} fontSize="12" fontWeight="800" fontFamily={SANS}>
          {t({ uz: "katta birlikdan kichigiga, ko'paytirish", ru: 'от крупной к мелкой, умножение', en: 'larger to smaller, multiply' })}
        </text>
      )}
      {frame >= 3 && (
        <text x={x0} y={150} fill={T.cyan} fontSize="12" fontWeight="800" fontFamily={SANS}>
          {t({ uz: "kichik birlikdan kattasiga, bo'lish", ru: 'от мелкой к крупной, деление', en: 'smaller to larger, divide' })}
        </text>
      )}

      {factors.map((factor, index) => {
        const left = boxX(index) + boxW;
        const right = boxX(index + 1);
        const lit = highlight.includes(index);
        return (
          <g key={`gap-${index}`}>
            {frame >= 1 && (
              <text
                x={(left + right) / 2}
                y={84}
                textAnchor="middle"
                fill={lit ? T.accent : T.ink2}
                fontSize={lit ? '17' : '15'}
                fontWeight="800"
                fontFamily={MONO}
              >
                {factor}
              </text>
            )}
            {frame >= 2 && <LadderArrow from={right - 4} to={left + 4} y={38} color={lit ? T.accent : 'rgba(255,91,53,.55)'} />}
            {frame >= 3 && <LadderArrow from={left + 4} to={right - 4} y={128} color={lit ? T.cyan : 'rgba(22,143,163,.5)'} />}
          </g>
        );
      })}

      {items.map((item, index) => {
        const lit = highlight.includes(index) || highlight.includes(index - 1) || litUnits.includes(index);
        return (
          <g key={item.unit}>
            <rect
              x={boxX(index)}
              y={52}
              width={boxW}
              height={54}
              rx={13}
              fill={lit ? T.accentSoft : '#FBFDF7'}
              stroke={lit ? T.accent : T.ink3}
              strokeWidth={lit ? 2.6 : 1.6}
            />
            <text
              x={boxX(index) + boxW / 2}
              y={78}
              textAnchor="middle"
              fill={lit ? T.accent : T.ink}
              fontSize="20"
              fontWeight="800"
              fontFamily={MONO}
            >
              {t(UNIT[item.unit])}
            </text>
            <text
              x={boxX(index) + boxW / 2}
              y={96}
              textAnchor="middle"
              fill={T.ink3}
              fontSize="10"
              fontWeight="750"
              fontFamily={SANS}
            >
              {t(item.name)}
            </text>
          </g>
        );
      })}
    </FitSvg>
  );
};

const LENGTH_CHAIN = {
  items: [
    { unit: 'mm', name: { uz: 'millimetr', ru: 'миллиметр', en: 'millimetre' } },
    { unit: 'cm', name: { uz: 'santimetr', ru: 'сантиметр', en: 'centimetre' } },
    { unit: 'dm', name: { uz: 'detsimetr', ru: 'дециметр', en: 'decimetre' } },
    { unit: 'm', name: { uz: 'metr', ru: 'метр', en: 'metre' } },
  ],
  factors: [10, 10, 10],
};

const MASS_CHAIN = {
  items: [
    { unit: 'g', name: { uz: 'gramm', ru: 'грамм', en: 'gram' } },
    { unit: 'kg', name: { uz: 'kilogramm', ru: 'килограмм', en: 'kilogram' } },
    { unit: 'q', name: { uz: 'sentner', ru: 'центнер', en: 'centner' } },
    { unit: 't', name: { uz: 'tonna', ru: 'тонна', en: 'tonne' } },
  ],
  factors: [1000, 100, 10],
};

const TIME_CHAIN = {
  items: [
    { unit: 's', name: { uz: 'soniya', ru: 'секунда', en: 'second' } },
    { unit: 'min', name: { uz: 'minut', ru: 'минута', en: 'minute' } },
    { unit: 'h', name: { uz: 'soat', ru: 'час', en: 'hour' } },
    { unit: 'kun', name: { uz: 'sutka', ru: 'сутки', en: 'day' } },
  ],
  factors: [60, 60, 24],
};

// Birlik kvadrat: tomon o'nta bo'lakka bo'linadi, shuning uchun ichida yuzta
// kichik kvadrat chiqadi. `count` — nechta birlik kvadrat ko'rsatiladi.
//
// Bitta kvadrat ko'rsatilganda chizma ramkaning faqat o'rtasini egallab, ikki
// yonida bo'sh joy qoldirardi. Shuning uchun bir kvadratli holatda kvadrat
// chapga suriladi va o'ng tomonda hisob ustuni turadi: o'n qator, o'n ustun,
// yuz katak. Ramka kengligi mazmun bilan to'ladi (metodist talabi).
const AREA_SIDE_ONE = 178;
const AREA_SIDE_MANY = 140;
const areaViewBox = (count) => (count === 1 ? '0 0 660 272' : '0 0 660 226');

const AreaGrid = ({ count = 1, frame = 9, solved = false }) => {
  const t = useT();
  const side = count === 1 ? AREA_SIDE_ONE : AREA_SIDE_MANY;
  const gap = 24;
  const totalW = count * side + (count - 1) * gap;
  const x0 = count === 1 ? 96 : (660 - totalW) / 2;
  const top = 38;
  const captionY = top + side + (count === 1 ? 50 : 46);
  const step = side / 10;
  const filled = frame >= 2;
  const tallyX = 356;
  const tally = [
    { at: 1, value: '10', label: t({ uz: 'qator', ru: 'ряда', en: 'rows' }), tone: T.cyan },
    { at: 2, value: '10', label: t({ uz: 'ustun', ru: 'столбца', en: 'columns' }), tone: T.cyan },
    { at: 3, value: '100', label: t({ uz: 'katak', ru: 'клетки', en: 'cells' }), tone: T.success },
  ];
  return (
    <FitSvg viewBox={areaViewBox(count)}>
      {Array.from({ length: count }, (unused, square) => {
        const x = x0 + square * (side + gap);
        return (
          <g key={square}>
            <rect
              x={x}
              y={top}
              width={side}
              height={side}
              rx={4}
              fill={filled ? 'rgba(149,201,61,.16)' : '#FBFDF7'}
              stroke={T.cyan}
              strokeWidth={2.4}
            />
            {frame >= 1 && Array.from({ length: 9 }, (unusedTick, line) => (
              <g key={line}>
                <line
                  x1={x + (line + 1) * step}
                  y1={top}
                  x2={x + (line + 1) * step}
                  y2={top + side}
                  stroke={filled ? 'rgba(149,201,61,.6)' : D30_GRID}
                  strokeWidth={1}
                />
                <line
                  x1={x}
                  y1={top + (line + 1) * step}
                  x2={x + side}
                  y2={top + (line + 1) * step}
                  stroke={filled ? 'rgba(149,201,61,.6)' : D30_GRID}
                  strokeWidth={1}
                />
              </g>
            ))}
            <text
              x={x + side / 2}
              y={top - 12}
              textAnchor="middle"
              fill={T.ink2}
              fontSize={count === 1 ? '15' : '13'}
              fontWeight="800"
              fontFamily={MONO}
            >
              {`1 ${t(UNIT.m2)}`}
            </text>
            {count === 1 && (
              <g>
                <text x={x - 12} y={top + side / 2 + 5} textAnchor="end" fill={T.ink2} fontSize="14" fontWeight="800" fontFamily={MONO}>
                  {`10 ${t(UNIT.dm)}`}
                </text>
                <text x={x + side / 2} y={top + side + 22} textAnchor="middle" fill={T.ink2} fontSize="14" fontWeight="800" fontFamily={MONO}>
                  {`10 ${t(UNIT.dm)}`}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {count === 1 && tally.map((row, index) => (
        (frame >= row.at || solved) && (
          <g key={row.label}>
            <rect
              x={tallyX}
              y={top + index * 56}
              width={210}
              height={44}
              rx={12}
              fill={index === 2 ? T.successSoft : T.cyanSoft}
              stroke={row.tone}
              strokeWidth={index === 2 ? 2.4 : 1.6}
            />
            <text x={tallyX + 22} y={top + index * 56 + 30} fill={row.tone} fontSize="20" fontWeight="800" fontFamily={MONO}>
              {row.value}
            </text>
            <text x={tallyX + 84} y={top + index * 56 + 29} fill={T.ink2} fontSize="14" fontWeight="750" fontFamily={SANS}>
              {row.label}
            </text>
          </g>
        )
      ))}

      {(frame >= 3 || solved) && (
        <Caption
          x={count === 1 ? x0 + side / 2 : 330}
          y={captionY}
          text={count === 1
            ? `1 ${t(UNIT.m2)} = 100 ${t(UNIT.dm2)}`
            : `${count} · 100 = ${count * 100} ${t(UNIT.dm2)}`}
          tone={T.success}
          size={18}
        />
      )}
      {count > 1 && frame >= 2 && frame < 3 && !solved && (
        <Caption
          x={330}
          y={captionY}
          text={t({ uz: "o'n qator va o'n ustun", ru: 'десять рядов и десять столбцов', en: 'ten rows and ten columns' })}
        />
      )}
    </FitSvg>
  );
};

// Teskari yo'nalish: kichik birlikdagi son to'liq guruhlarga bo'linadi,
// qoldiq esa kichik birlikda qoladi.
const SplitBar = ({ total, factor, bigUnit, smallUnit, frame = 9, solved = false }) => {
  const t = useT();
  const x0 = 76;
  const x1 = 584;
  const span = x1 - x0;
  const bu = t(UNIT[bigUnit]);
  const su = t(UNIT[smallUnit]);
  const whole = Math.floor(total / factor);
  const rest = total % factor;
  const restW = rest > 0 ? Math.max(56, (rest / total) * span) : 0;
  const blockW = (span - restW - whole * 5) / whole;
  return (
    <FitSvg viewBox="0 0 660 190">
      <Caption
        x={330}
        y={20}
        text={t({ uz: 'kichik birlikdagi yozuv', ru: 'запись в мелкой единице', en: 'the record in the small unit' })}
      />
      <rect x={x0} y={34} width={span} height={42} rx={12} fill={T.cyanSoft} stroke={T.cyan} strokeWidth={2} />
      <text x={x0 + span / 2} y={61} textAnchor="middle" fill={T.cyan} fontSize="19" fontWeight="800" fontFamily={MONO}>
        {`${total} ${su}`}
      </text>

      {frame >= 1 && (
        <text x={330} y={97} textAnchor="middle" fill={T.ink2} fontSize="15" fontWeight="800" fontFamily={MONO}>
          {`1 ${bu} = ${factor} ${su}`}
        </text>
      )}

      {frame >= 2 && (
        <g>
          {Array.from({ length: whole }, (unused, index) => (
            <g key={index}>
              <rect
                x={x0 + index * (blockW + 5)}
                y={110}
                width={blockW}
                height={42}
                rx={12}
                fill="rgba(149,201,61,.22)"
                stroke={T.lime}
                strokeWidth={2}
              />
              <text
                x={x0 + index * (blockW + 5) + blockW / 2}
                y={137}
                textAnchor="middle"
                fill="#4C6B18"
                fontSize="16"
                fontWeight="800"
                fontFamily={MONO}
              >
                {`1 ${bu}`}
              </text>
            </g>
          ))}
          {rest > 0 && (
            <g>
              <rect x={x1 - restW} y={110} width={restW} height={42} rx={9} fill={T.warnSoft} stroke={T.warn} strokeWidth={2} />
              <text x={x1 - restW / 2} y={137} textAnchor="middle" fill={T.warn} fontSize="15" fontWeight="800" fontFamily={MONO}>
                {`${rest} ${su}`}
              </text>
            </g>
          )}
        </g>
      )}

      {(frame >= 3 || solved) && (
        <Caption
          x={330}
          y={177}
          text={rest > 0 ? `${whole} ${bu} ${rest} ${su}` : `${whole} ${bu}`}
          tone={T.success}
          size={18}
        />
      )}
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
          head: t({ uz: 'Juftni aniqlang', ru: 'Определите пару', en: 'Find the pair' }),
          body: t({
            uz: "aynan shu ikki birlik orasidagi munosabatni yozing",
            ru: 'запишите соотношение именно этих двух единиц',
            en: 'write the relationship of those two units',
          }),
          formula: `1 ${t(UNIT.t)} = 1000 ${t(UNIT.kg)}`,
        },
        {
          tone: T.accent,
          head: t({ uz: "Yo'nalishni tanlang", ru: 'Выберите направление', en: 'Choose the direction' }),
          body: t({
            uz: "katta birlikdan kichigiga ko'paytirish, kichikdan kattasiga bo'lish",
            ru: 'от крупной к мелкой умножение, от мелкой к крупной деление',
            en: 'larger to smaller is multiplying, smaller to larger is dividing',
          }),
          formula: '· / :',
        },
        {
          tone: T.success,
          head: t({ uz: "Qo'shing va tekshiring", ru: 'Сложите и проверьте', en: 'Add and check' }),
          body: t({
            uz: "aralash qismlarni qo'shing, birlikni yozing, son yo'nalishga mos kelganini tekshiring",
            ru: 'сложите смешанные части, запишите единицу, проверьте число по направлению',
            en: 'add the mixed parts, write the unit, check the number against the direction',
          }),
          formula: null,
        },
      ]}
    />
  );
};

// ---------------------------------------------------------------------------
// EKRANLAR
// ---------------------------------------------------------------------------
const Screen0 = (props) => {
  const t = useT();
  return (
    <ChoiceScreen
      {...props}
      plain
      ratio="30 / 11"
      ordinal={3}
      figure={({ solved }) => (
        <div className="hero-scene">
          <div className="hero-head">
            <span>LUMO CITY · O'LCHOV XIZMATI · AYLANTIRISH PULTI</span>
            <span className={solved ? 'hero-state' : 'hero-state hero-state-alert'}>
              {solved ? 'SOZLANDI' : 'RAD ETILDI'}
            </span>
          </div>
          <div className="hero-body">
            <div className="d30-hero-row">
              <div className="d30-hero-panel"><ConsolePanel solved={solved} /></div>
              <div className="d30-hero-bit" aria-hidden="true"><BitSVG state={solved ? 'nod' : 'awkward'} /></div>
            </div>
          </div>
          <div className="d30-hero-note">
            {solved
              ? t({ uz: "har juftga o'z soni", ru: 'каждой паре своё число', en: 'each pair has its own number' })
              : t({ uz: 'Bit: bitta tugma, ×10', ru: 'Bit: одна кнопка, ×10', en: 'Bit: one button, ×10' })}
          </div>
        </div>
      )}
    />
  );
};

const Screen1 = (props) => (
  <RevealScreen
    {...props}
    ratio="66 / 19"
    figure={({ frame }) => (
      <MixedBar big={3} factor={100} bigUnit="m" smallUnit="cm" frame={frame} />
    )}
  />
);

const Screen2 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={1}
    ratio="66 / 19"
    figure={({ solved }) => (
      <MixedBar big={5} small={40} factor={100} bigUnit="m" smallUnit="cm" frame={solved ? 3 : 2} solved={solved} />
    )}
  />
);

const Screen3 = (props) => (
  <RevealScreen {...props} ratio="66 / 16" figure={({ frame }) => <UnitLadder {...MASS_CHAIN} frame={frame} />} />
);

const Screen4 = (props) => (
  <NumPadScreen
    {...props}
    ratio="66 / 19"
    figure={({ solved }) => (
      <MixedBar big={4} small={200} factor={1000} bigUnit="t" smallUnit="kg" frame={solved ? 3 : 2} solved={solved} />
    )}
  />
);

const Screen5 = (props) => (
  <RevealScreen {...props} ratio="66 / 16" figure={({ frame }) => <UnitLadder {...TIME_CHAIN} frame={frame} />} />
);

const Screen6 = (props) => (
  <NumPadScreen
    {...props}
    ratio="66 / 19"
    figure={({ solved }) => (
      <MixedBar big={3} small={15} factor={60} bigUnit="h" smallUnit="min" frame={solved ? 3 : 2} solved={solved} />
    )}
  />
);

const Screen7 = (props) => (
  <RevealScreen {...props} ratio="660 / 272" figure={({ frame }) => <AreaGrid count={1} frame={frame} />} />
);

const Screen8 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={2}
    ratio="660 / 226"
    figure={({ solved }) => <AreaGrid count={3} frame={solved ? 3 : 2} solved={solved} />}
  />
);

const Screen9 = (props) => (
  <RevealScreen
    {...props}
    ratio="66 / 19"
    figure={({ frame }) => <SplitBar total={4500} factor={1000} bigUnit="kg" smallUnit="g" frame={frame} />}
  />
);

const Screen10 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={4}
    ratio="66 / 19"
    figure={({ solved }) => (
      <SplitBar total={3200} factor={1000} bigUnit="t" smallUnit="kg" frame={solved ? 3 : 2} solved={solved} />
    )}
  />
);

// Qoida kartasi: qator `frame >= index + 1` da ochiladi, ovoz esa nol kadrdan
// boshlanadi. Shuning uchun kadr bittaga suriladi: birinchi bo'lak birinchi
// qatorni ochadi, uchinchisi uchinchisini.
const Screen11 = (props) => <RevealScreen {...props} plain ratio="auto" figure={({ frame }) => <RuleCard frame={frame + 1} />} />;

const Screen12 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={5}
    ratio="66 / 16"
    figure={() => <UnitLadder {...LENGTH_CHAIN} frame={3} litUnits={[0, 3]} />}
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
          badIndex={1}
          revealBad={solved}
          badLabel={t({ uz: 'xato shu yerda', ru: 'ошибка здесь', en: 'the error is here' })}
          showHint={picked !== null && !solved}
          hint={t({
            uz: "Bir metrli kvadratda o'n qator va o'n ustun bor. Nechta kichik kvadrat chiqadi?",
            ru: 'В метровом квадрате десять рядов и десять столбцов. Сколько выйдет маленьких квадратов?',
            en: 'A metre square has ten rows and ten columns. How many small squares does that give?',
          })}
        />
      )}
    />
  );
};

const MANIFEST_SETS = [
  [300, 4000, 80, 200],
  [30, 40, 120, 20],
  [3000, 400, 70, 2000],
];

const Screen14 = (props) => {
  const t = useT();
  const units = [t(UNIT.cm), t(UNIT.g), t(UNIT.min), t(UNIT.dm2)];
  return (
  <ChoiceScreen
    {...props}
    ordinal={7}
    stack
    ratio="720 / 164"
    figure={({ solved, picked }) => (
      <RecordRow
        records={MANIFEST_SETS.map((set) => set.map((value, index) => `${value} ${units[index]}`).join('\n'))}
        picked={picked}
        solved={solved}
        correctIndex={0}
        width={720}
        cardW={196}
        cardH={122}
        gap={26}
        top={22}
        size={15}
        numbered={false}
      />
    )}
  />
  );
};

const Screen15 = (props) => <SummaryScreen {...props} />;

const SCREENS = [
  Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7,
  Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15,
];

const LESSON_STYLES = `
/* Hook sahnasi uch qatorli: sarlavha, pult va izoh. Kit dagi ikki qatorli
   grid uchinchi bolani yashirin qatorga tashlaydi va pult qatori nolga
   siqiladi, shuning uchun qatorlar shu darsda qayta e'lon qilinadi. */
.hero-scene { grid-template-rows: auto minmax(0, 1fr) auto; }
.d30-hero-row {
  width: 100%;
  height: 100%;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 54px;
  gap: 10px;
  align-items: center;
}
.d30-hero-panel { width: 100%; height: 100%; min-height: 0; }
.d30-hero-panel svg { width: 100%; height: 100%; }
.d30-hero-note {
  text-align: center;
  color: #9DE3E7;
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(10px, 1.2vw, 12px);
  font-weight: 750;
}
.d30-hero-bit { width: 54px; height: 100%; max-height: 68px; pointer-events: none; }
.d30-hero-bit svg { width: 100%; height: 100%; }
/* Telefonda hook kartasi balandroq: 366 px kenglikda 30/11 nisbati to'rtta
   satrga joy qoldirmaydi. !important kerak, chunki nisbat ModelCard dan
   inline style bilan keladi. */
@media (max-width: 639.98px) {
  .model-card:has(.hero-scene) { --g4-model-ratio: 30 / 18 !important; }
}
`;

export default function Grade4Dars30(props) {
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
