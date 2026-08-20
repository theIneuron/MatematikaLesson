// ============================================================================
// 4-SINF · Dars 15 · O'rtacha arifmetik qiymatni topish
//
// Manba: N. U. Bikbayeva, "Matematika. 4-sinf", 5-nashr 2020, 51-53-betlar.
//   51-bet: Anvar va Ulug'bek beshtadan uloqtirdi; Anvar 9, 14, 9, 15, 13;
//           Ulug'bek 10, 15, 11, 10, 9. "O'rtacha arifmetikni topish uchun
//           sonlar yig'indisini topib, uni qo'shiluvchilar soniga bo'lish kerak";
//   52-bet: 28, 36, 19, 41 va 136, 140, 147; Rayhona to'rtta imtihon
//           224, 200, 270, 230; oshxonada yetti kunda 250, 160, 80 kg sabzavot;
//   53-bet: 57 va 65 sonlarining o'rtachasini sonlar nurida belgilash;
//           12, 17, 18, 20, 28 sonlarining o'rtacha arifmetigi.
//
// Syujet: Lumo City sport arenasi (SYUJET_4SINF.md, 2-blok — muhandislik va
// transport markazi bilan bir shahar, lekin o'z joyi).
// Baholanadigan oltita ekran: s2, s4, s6, s8, s10, s13.
//
// Yangi mexanika: LevelPick — bola ustunlarni qaysi balandlikda tenglashtirish
// kerakligini o'zi qo'yadi. O'rtacha qiymat shu tarzda formuladan oldin
// ma'noga ega bo'ladi.
// ============================================================================
import {
  ChoiceScreen, FitSvg, KIT_STYLES, LevelFigure, LevelPick, NumPadScreen,
  RevealScreen, ScaleFigure, SlotScreen, SummaryScreen, T, TableFill,
  TheoryLessonRoot, assertScreenTypeLabels, useT,
} from './kit/index.js';

const LESSON_META = {
  lessonId: 'average-4-15-v2',
  slug: 'dars15-ortacha-arifmetik',
  lessonTitle: {
    uz: "15-dars. O'rtacha arifmetik qiymatni topish",
    ru: 'Урок 15. Нахождение среднего арифметического',
    en: 'Lesson 15. Finding the arithmetic mean',
  },
  skillTags: ['average', 'sum', 'division', 'fair_comparison', 'estimation'],
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

const NUM = (value) => ({ uz: String(value), ru: String(value), en: String(value) });
const METR = { uz: 'm', ru: 'м', en: 'm' };

const ANVAR = [9, 14, 9, 15, 13].map((value, index) => ({ label: String(index + 1), value }));
const ULUGBEK = [10, 15, 11, 10, 9].map((value, index) => ({ label: String(index + 1), value }));

const CONTENT = {
  // -------------------------------------------------------------------------
  s0: {
    eyebrow: { uz: 'Arena musobaqasi', ru: 'Соревнование на арене', en: 'The arena contest' },
    title: {
      uz: 'Ikkalasi ham g\'olibman deyapti',
      ru: 'Оба говорят, что победили',
      en: 'Both of them claim the win',
    },
    question: {
      uz: 'Beshtadan uloqtirish natijasini adolatli taqqoslash uchun nima qilamiz?',
      ru: 'Как честно сравнить по пять бросков?',
      en: 'How do we fairly compare five throws each?',
    },
    options: [
      {
        uz: "Beshta natijani birlashtirib, teng bo'lib chiqamiz",
        ru: 'Соберём пять результатов вместе и разделим поровну',
        en: 'Put the five results together and share them out evenly',
      },
      {
        uz: 'Faqat eng uzoq uloqtirishni olamiz',
        ru: 'Возьмём только самый дальний бросок',
        en: 'Take only the longest throw',
      },
      {
        uz: 'Faqat oxirgi uloqtirishni olamiz',
        ru: 'Возьмём только последний бросок',
        en: 'Take only the last throw',
      },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Beshta natijani birlashtirib teng bo'lsak, har bir uloqtirishga to'g'ri keladigan qiymat chiqadi. Butun musobaqa shu bitta songa sig'adi.",
      ru: 'Верно. Если собрать пять результатов и разделить поровну, получится значение, приходящееся на один бросок. Всё соревнование помещается в одно число.',
      en: 'Correct. Putting the five results together and sharing them evenly gives the value for one throw. The whole contest fits into one number.',
    },
    wrong: [
      null,
      {
        uz: "Eng uzoq uloqtirish bir marta bo'lgan omad bo'lishi mumkin. Ikkalasining eng uzogi ham o'n besh metr, demak bu farqni ko'rsatmaydi.",
        ru: 'Самый дальний бросок может оказаться разовой удачей. У обоих он равен пятнадцати метрам, значит разницы он не покажет.',
        en: 'The longest throw may be a one-off piece of luck. Both have fifteen metres, so it shows no difference at all.',
      },
      {
        uz: "Oxirgi uloqtirish ham bitta natija. Bola charchagan yoki aksincha ilhomlangan bo'lishi mumkin, qolgan to'rttasi esa hisobga olinmay qoladi.",
        ru: 'Последний бросок это тоже один результат. Спортсмен мог устать или, наоборот, собраться, а остальные четыре просто выпадут из счёта.',
        en: 'The last throw is just one result too. The athlete may be tired or freshly focused, and the other four drop out of the count.',
      },
    ],
    bitFeedback: true,
    audio: {
      intro: {
        uz: [
          'Salom! Bugun biz Lumo City sport arenasidamiz.',
          "Anvar va Ulug'bek yog'och brusokni kim uzoqroqqa uloqtirishini aniqlashmoqchi. Har biri besh marta uloqtirdi.",
          "Anvarning natijalari to'qqiz, o'n to'rt, to'qqiz, o'n besh va o'n uch metr.",
          "Ulug'bekning natijalari o'n, o'n besh, o'n bir, o'n va to'qqiz metr.",
          'Ikkalasi ham men yutdim deyapti. Sizningcha, adolatli taqqoslash uchun nima qilish kerak?',
        ],
        ru: [
          'Привет! Сегодня мы на спортивной арене Lumo City.',
          'Анвар и Улугбек выясняют, кто дальше бросит деревянный брусок. Каждый бросил по пять раз.',
          'Результаты Анвара девять, четырнадцать, девять, пятнадцать и тринадцать метров.',
          'Результаты Улугбека десять, пятнадцать, одиннадцать, десять и девять метров.',
          'Оба говорят, что победили. Как ты думаешь, что нужно сделать для честного сравнения?',
        ],
        en: [
          'Hello! Today we are at the Lumo City sports arena.',
          'Anvar and Ulugbek want to find out who throws the wooden block further. Each of them threw five times.',
          'Anvar got nine, fourteen, nine, fifteen and thirteen metres.',
          'Ulugbek got ten, fifteen, eleven, ten and nine metres.',
          'Both of them claim the win. What do you think we should do to compare them fairly?',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s1: {
    eyebrow: { uz: 'Tenglashtirish', ru: 'Выравнивание', en: 'Levelling' },
    title: {
      uz: 'Baland ustundan ortiqcha past ustunga quyiladi',
      ru: 'Излишек высокого столбика переливается в низкий',
      en: 'The excess of a tall bar pours into a short one',
    },
    lead: {
      uz: 'Anvarning beshta natijasi beshta ustun. Ular bir balandlikka keltiriladi.',
      ru: 'Пять результатов Анвара это пять столбиков. Их приводят к одной высоте.',
      en: "Anvar's five results are five bars. They are brought to a single height.",
    },
    note: {
      uz: "Tenglashgan balandlik o'n ikki metr. Bu Anvarning o'rtacha natijasi.",
      ru: 'Выровненная высота двенадцать метров. Это средний результат Анвара.',
      en: "The levelled height is twelve metres. That is Anvar's average result.",
    },
    audio: {
      intro: {
        uz: [
          "Anvarning beshta natijasini ustun qilib chizdik. Ular har xil balandlikda.",
          "Endi tasavvur qiling, ustunlar suv solingan idishlar va ular pastdan bir-biriga ulangan. Suv o'zi tenglashadi.",
          "Baland ustunlardagi ortiqcha suv past ustunlarga quyiladi va hammasi bir sathga keladi.",
          "Bu sath o'n ikki metr. Anvar har safar o'n ikki metrga uloqtirgandek natija chiqadi.",
        ],
        ru: [
          'Мы нарисовали пять результатов Анвара столбиками. Они разной высоты.',
          'Теперь представь, что столбики это сосуды с водой, соединённые снизу. Вода выравнивается сама.',
          'Излишек из высоких столбиков переливается в низкие, и всё приходит к одному уровню.',
          'Этот уровень равен двенадцати метрам. Получается так, будто Анвар каждый раз бросал на двенадцать метров.',
        ],
        en: [
          "We drew Anvar's five results as bars. They have different heights.",
          'Now imagine the bars are vessels of water joined at the bottom. Water levels itself.',
          'The excess from the tall bars pours into the short ones, and everything comes to one level.',
          'That level is twelve metres. It comes out as if Anvar threw twelve metres every time.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s2: {
    eyebrow: { uz: "Ulug'bek natijalari", ru: 'Результаты Улугбека', en: "Ulugbek's results" },
    title: {
      uz: "Ulug'bekning ustunlarini tenglashtiring",
      ru: 'Выровняй столбики Улугбека',
      en: "Level Ulugbek's bars",
    },
    question: {
      uz: 'Chiziqni qaysi balandlikka qo\'yamiz?',
      ru: 'На какую высоту поставим линию?',
      en: 'At what height do we place the line?',
    },
    bars: ULUGBEK.map((bar) => ({ label: NUM(bar.label), value: bar.value })),
    ticks: [9, 10, 11, 12, 13, 14, 15],
    correctLevel: 11,
    unit: METR,
    tooHigh: {
      uz: "Chiziq baland qo'yildi. Baland ustunlardagi ortiqcha past ustunlarni to'ldirishga yetmayapti, punktir bo'shliq qolyapti.",
      ru: 'Линия поставлена высоко. Излишка высоких столбиков не хватает, чтобы заполнить низкие, пунктирная пустота остаётся.',
      en: 'The line is too high. The excess of the tall bars is not enough to fill the short ones, and a dashed gap remains.',
    },
    tooLow: {
      uz: "Chiziq past qo'yildi. Baland ustunlarda ortiqcha qism ortib qolyapti, uni quyadigan joy yo'q.",
      ru: 'Линия поставлена низко. У высоких столбиков излишек остаётся лишним, его некуда перелить.',
      en: 'The line is too low. The tall bars still have excess left over, and there is nowhere to pour it.',
    },
    correctText: {
      uz: "To'g'ri. O'n bir metrda ortiqcha qism bo'shliqni aynan to'ldiradi. Ulug'bekning o'rtacha natijasi o'n bir metr, Anvarniki o'n ikki. Demak Anvar g'olib.",
      ru: 'Верно. На одиннадцати метрах излишек точно заполняет пустоту. Средний результат Улугбека одиннадцать метров, у Анвара двенадцать. Значит побеждает Анвар.',
      en: 'Correct. At eleven metres the excess fills the gap exactly. Ulugbek averages eleven metres and Anvar twelve, so Anvar is the winner.',
    },
    audio: {
      intro: {
        uz: [
          "Endi Ulug'bekning ustunlari. O'n, o'n besh, o'n bir, o'n va to'qqiz metr.",
          "Shkaladan balandlikni tanlang. Chiziq o'sha yerga ko'chadi va ortiqcha bilan bo'shliq ko'rinadi.",
          "Ortiqcha qism bo'shliqni aynan to'ldiradigan balandlikni toping.",
        ],
        ru: [
          'Теперь столбики Улугбека. Десять, пятнадцать, одиннадцать, десять и девять метров.',
          'Выбери высоту на шкале. Линия перейдёт туда, и станут видны излишек и пустота.',
          'Найди высоту, на которой излишек точно заполняет пустоту.',
        ],
        en: [
          "Now Ulugbek's bars. Ten, fifteen, eleven, ten and nine metres.",
          'Choose a height on the scale. The line moves there and the excess and the gap become visible.',
          'Find the height at which the excess fills the gap exactly.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s3: {
    eyebrow: { uz: 'Ikkinchi yo\'l', ru: 'Второй способ', en: 'The second way' },
    title: {
      uz: 'Chizmasiz ham topsa bo\'ladi',
      ru: 'Можно найти и без чертежа',
      en: 'It can be found without a drawing',
    },
    lead: {
      uz: "Ustunlarni qo'shib, keyin teng bo'lish yetarli.",
      ru: 'Достаточно сложить столбики, а потом разделить поровну.',
      en: 'It is enough to add the bars up and then share them evenly.',
    },
    note: {
      uz: "Yig'indini qo'shiluvchilar soniga bo'lamiz. Bu o'rtacha arifmetik qiymat.",
      ru: 'Сумму делим на число слагаемых. Это среднее арифметическое значение.',
      en: 'We divide the sum by the number of addends. This is the arithmetic mean.',
    },
    audio: {
      intro: {
        uz: [
          "Chizma ma'noni ko'rsatdi, endi hisobga o'tamiz.",
          "Anvarning beshta natijasini qo'shamiz. To'qqiz qo'shildi o'n to'rt, qo'shildi to'qqiz, qo'shildi o'n besh, qo'shildi o'n uch. Yig'indi oltmish metr.",
          "Endi oltmishni beshga bo'lamiz, chunki natijalar beshta edi. O'n ikki chiqadi.",
          "Qoida shunday. O'rtacha arifmetikni topish uchun avval sonlar yig'indisini topamiz, so'ng uni qo'shiluvchilar soniga bo'lamiz.",
        ],
        ru: [
          'Чертёж показал смысл, теперь перейдём к вычислению.',
          'Складываем пять результатов Анвара. Девять плюс четырнадцать, плюс девять, плюс пятнадцать, плюс тринадцать. Сумма шестьдесят метров.',
          'Теперь делим шестьдесят на пять, потому что результатов было пять. Получается двенадцать.',
          'Правило такое. Чтобы найти среднее арифметическое, сначала находим сумму чисел, а потом делим её на число слагаемых.',
        ],
        en: [
          'The drawing showed the meaning; now we move to the calculation.',
          "We add Anvar's five results. Nine plus fourteen, plus nine, plus fifteen, plus thirteen. The sum is sixty metres.",
          'Now we divide sixty by five, because there were five results. That gives twelve.',
          'The rule is this. To find the arithmetic mean, first find the sum of the numbers, then divide it by the number of addends.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s4: {
    eyebrow: { uz: 'Hisob mashqi', ru: 'Упражнение на счёт', en: 'A counting exercise' },
    title: {
      uz: "To'rtta sonning o'rtacha arifmetigi",
      ru: 'Среднее арифметическое четырёх чисел',
      en: 'The arithmetic mean of four numbers',
    },
    question: {
      uz: "28, 36, 19, 41 sonlarining o'rtacha arifmetigini tering.",
      ru: 'Набери среднее арифметическое чисел 28, 36, 19, 41.',
      en: 'Type the arithmetic mean of the numbers 28, 36, 19, 41.',
    },
    answer: '31',
    wrong: {
      uz: "Hozircha mos emas. Avval to'rttasini qo'shing, keyin yig'indini to'rtga bo'ling.",
      ru: 'Пока не сходится. Сначала сложи четыре числа, потом раздели сумму на четыре.',
      en: 'Not right yet. First add the four numbers, then divide the sum by four.',
    },
    hintAfter: {
      uz: "Yig'indi bir yuz yigirma to'rt. Endi uni to'rtga bo'ling.",
      ru: 'Сумма сто двадцать четыре. Теперь раздели её на четыре.',
      en: 'The sum is one hundred twenty four. Now divide it by four.',
    },
    correctText: {
      uz: "To'g'ri. Yig'indi bir yuz yigirma to'rt, sonlar to'rtta, bo'linma o'ttiz bir.",
      ru: 'Верно. Сумма сто двадцать четыре, чисел четыре, частное тридцать один.',
      en: 'Correct. The sum is one hundred twenty four, there are four numbers, and the quotient is thirty one.',
    },
    audio: {
      intro: {
        uz: [
          "Arena tablosida to'rtta son chiqdi. Yigirma sakkiz, o'ttiz olti, o'n to'qqiz va qirq bir.",
          "Ularning o'rtacha arifmetigini toping va raqamlarni o'zingiz tering.",
          "Ikki qadam esingizda bo'lsin. Avval yig'indi, keyin bo'lish.",
        ],
        ru: [
          'На табло арены появились четыре числа. Двадцать восемь, тридцать шесть, девятнадцать и сорок один.',
          'Найди их среднее арифметическое и набери цифры сам.',
          'Помни про два шага. Сначала сумма, потом деление.',
        ],
        en: [
          'Four numbers appeared on the arena board. Twenty eight, thirty six, nineteen and forty one.',
          'Find their arithmetic mean and type the digits yourself.',
          'Remember the two steps. First the sum, then the division.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s5: {
    eyebrow: { uz: "Bo'luvchi qayerdan olinadi", ru: 'Откуда берётся делитель', en: 'Where the divisor comes from' },
    title: {
      uz: "Bo'luvchi — sonlarning soni",
      ru: 'Делитель это количество чисел',
      en: 'The divisor is how many numbers there are',
    },
    lead: {
      uz: "Beshta son bo'lsa beshga, uchta son bo'lsa uchga bo'lamiz.",
      ru: 'Пять чисел делим на пять, три числа делим на три.',
      en: 'Five numbers are divided by five, three numbers by three.',
    },
    note: {
      uz: "136, 140, 147 uchun yig'indi 423, sonlar uchta, o'rtacha 141.",
      ru: 'Для 136, 140, 147 сумма 423, чисел три, среднее 141.',
      en: 'For 136, 140, 147 the sum is 423, there are three numbers, and the mean is 141.',
    },
    audio: {
      intro: {
        uz: [
          "Ko'p bola shu yerda adashadi. Ular yig'indini topib, keyin nechaga bo'lishni unutib qo'yishadi.",
          "Bo'luvchi har doim bitta joydan olinadi. Bu sonlarning soni.",
          "Mana uchta son. Bir yuz o'ttiz olti, bir yuz qirq va bir yuz qirq yetti. Yig'indi to'rt yuz yigirma uch.",
          "Sonlar uchta, demak uchga bo'lamiz. Bir yuz qirq bir chiqadi.",
        ],
        ru: [
          'Многие ошибаются именно здесь. Находят сумму, а потом забывают, на что делить.',
          'Делитель всегда берётся из одного места. Это количество чисел.',
          'Вот три числа. Сто тридцать шесть, сто сорок и сто сорок семь. Сумма четыреста двадцать три.',
          'Чисел три, значит делим на три. Получается сто сорок один.',
        ],
        en: [
          'Many learners slip exactly here. They find the sum and then forget what to divide by.',
          'The divisor always comes from one place. It is how many numbers there are.',
          'Here are three numbers. One hundred thirty six, one hundred forty and one hundred forty seven. The sum is four hundred twenty three.',
          'There are three numbers, so we divide by three. That gives one hundred forty one.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s6: {
    eyebrow: { uz: 'Arena jadvali', ru: 'Таблица арены', en: 'The arena table' },
    title: {
      uz: "Jadvalning bo'sh katagini to'ldiring",
      ru: 'Заполни пустую клетку таблицы',
      en: 'Fill the empty cell of the table',
    },
    question: {
      uz: "Uchta sonning o'rtacha arifmetigi qaysi?",
      ru: 'Какое среднее арифметическое у трёх чисел?',
      en: 'Which value is the arithmetic mean of the three numbers?',
    },
    columns: [
      { uz: 'Sonlar', ru: 'Числа', en: 'Numbers' },
      { uz: "Yig'indi", ru: 'Сумма', en: 'Sum' },
      { uz: "O'rtacha", ru: 'Среднее', en: 'Mean' },
    ],
    rows: [
      [NUM('136, 140, 147'), NUM('423'), null],
    ],
    chips: [NUM('141'), NUM('423'), NUM('147')],
    correctChip: 0,
    correctText: {
      uz: "To'g'ri. To'rt yuz yigirma uchni uchga bo'ldingiz va bir yuz qirq bir chiqdi. Bu son uchtasining o'rtasida turibdi.",
      ru: 'Верно. Ты разделил четыреста двадцать три на три и получил сто сорок один. Это число стоит посередине трёх.',
      en: 'Correct. You divided four hundred twenty three by three and got one hundred forty one. That number sits in the middle of the three.',
    },
    wrong: [
      null,
      {
        uz: "To'rt yuz yigirma uch — bu yig'indi, o'rtacha emas. Uni yana sonlar soniga bo'lish kerak.",
        ru: 'Четыреста двадцать три это сумма, а не среднее. Её ещё нужно разделить на количество чисел.',
        en: 'Four hundred twenty three is the sum, not the mean. It still has to be divided by how many numbers there are.',
      },
      {
        uz: "Bir yuz qirq yetti — bu eng katta son. O'rtacha eng kattasidan kichik bo'lishi kerak.",
        ru: 'Сто сорок семь это самое большое число. Среднее должно быть меньше самого большого.',
        en: 'One hundred forty seven is the largest number. The mean has to be smaller than the largest.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Arena jadvalida bitta katak bo'sh qoldi.",
          "Sonlar va yig'indi allaqachon yozilgan. O'rtacha qiymatni topish qoldi.",
          'Pastdagi qiymatlardan mosini tanlang.',
        ],
        ru: [
          'В таблице арены осталась одна пустая клетка.',
          'Числа и сумма уже записаны. Осталось найти среднее значение.',
          'Выбери подходящее значение из тех, что внизу.',
        ],
        en: [
          'One cell in the arena table is still empty.',
          'The numbers and the sum are already written. Only the mean is missing.',
          'Choose the matching value from the ones below.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s7: {
    eyebrow: { uz: 'Tekshirish', ru: 'Проверка', en: 'The check' },
    title: {
      uz: "O'rtacha × soni = yig'indi",
      ru: 'Среднее × количество = сумма',
      en: 'Mean × count = sum',
    },
    lead: {
      uz: "Javob to'g'ri chiqqanini teskari amal bilan tekshiramiz.",
      ru: 'Правильность ответа проверяем обратным действием.',
      en: 'We check the answer with the inverse operation.',
    },
    note: {
      uz: "12 × 5 = 60 — Anvarning yig'indisi qaytib keldi, demak o'rtacha to'g'ri.",
      ru: '12 × 5 = 60 — сумма Анвара вернулась, значит среднее верное.',
      en: "12 × 5 = 60 — Anvar's sum came back, so the mean is right.",
    },
    audio: {
      intro: {
        uz: [
          "Har qanday javobni tekshirish mumkin, o'rtacha ham bundan mustasno emas.",
          "Agar o'rtacha to'g'ri bo'lsa, uni sonlar soniga ko'paytirganda dastlabki yig'indi qaytadi.",
          "Anvarda o'rtacha o'n ikki, natijalar beshta. O'n ikkini beshga ko'paytiramiz, oltmish chiqadi.",
          "Yig'indi ham oltmish edi. Javob mustahkam.",
        ],
        ru: [
          'Любой ответ можно проверить, среднее не исключение.',
          'Если среднее найдено верно, то при умножении на количество чисел вернётся исходная сумма.',
          'У Анвара среднее двенадцать, результатов пять. Умножаем двенадцать на пять, получаем шестьдесят.',
          'Сумма тоже была шестьдесят. Ответ надёжный.',
        ],
        en: [
          'Any answer can be checked, and the mean is no exception.',
          'If the mean is right, multiplying it by the count brings back the original sum.',
          'Anvar has a mean of twelve and five results. Twelve times five is sixty.',
          'The sum was sixty as well. The answer holds.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s8: {
    eyebrow: { uz: 'Imtihon ballari', ru: 'Баллы экзаменов', en: 'Exam scores' },
    title: {
      uz: "Rayhonaning o'rtacha bali",
      ru: 'Средний балл Райханы',
      en: "Rayhona's average score",
    },
    question: {
      uz: "224, 200, 270, 230 ballarning o'rtachasini tering.",
      ru: 'Набери среднее из баллов 224, 200, 270, 230.',
      en: 'Type the mean of the scores 224, 200, 270, 230.',
    },
    answer: '231',
    unit: { uz: 'ball', ru: 'балл', en: 'points' },
    wrong: {
      uz: "Hozircha mos emas. To'rtta balni qo'shing, keyin to'rtga bo'ling.",
      ru: 'Пока не сходится. Сложи четыре балла, потом раздели на четыре.',
      en: 'Not right yet. Add the four scores, then divide by four.',
    },
    hintAfter: {
      uz: "Yig'indi to'qqiz yuz yigirma to'rt. Endi uni to'rtga bo'ling.",
      ru: 'Сумма девятьсот двадцать четыре. Теперь раздели её на четыре.',
      en: 'The sum is nine hundred twenty four. Now divide it by four.',
    },
    correctText: {
      uz: "To'g'ri. Ikki yuz o'ttiz bir. Tekshiramiz: ikki yuz o'ttiz birni to'rtga ko'paytirsak, to'qqiz yuz yigirma to'rt qaytadi.",
      ru: 'Верно. Двести тридцать один. Проверим: двести тридцать один умножить на четыре даёт девятьсот двадцать четыре.',
      en: 'Correct. Two hundred thirty one. Check it: two hundred thirty one times four gives nine hundred twenty four.',
    },
    audio: {
      intro: {
        uz: [
          "Rayhona mutaxassislik bo'yicha to'rtta imtihon topshirdi.",
          "Ballari ikki yuz yigirma to'rt, ikki yuz, ikki yuz yetmish va ikki yuz o'ttiz.",
          "O'rtacha balni toping va raqamlarni tering. Javobni teskari amal bilan tekshirishni unutmang.",
        ],
        ru: [
          'Райхана сдала четыре экзамена по специальности.',
          'Её баллы двести двадцать четыре, двести, двести семьдесят и двести тридцать.',
          'Найди средний балл и набери цифры. Не забудь проверить ответ обратным действием.',
        ],
        en: [
          'Rayhona took four exams in her speciality.',
          'Her scores are two hundred twenty four, two hundred, two hundred seventy and two hundred thirty.',
          'Find the average score and type the digits. Do not forget to check with the inverse operation.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s9: {
    eyebrow: { uz: 'Nazorat belgisi', ru: 'Контрольный признак', en: 'A control sign' },
    title: {
      uz: "O'rtacha har doim eng kichik bilan eng katta orasida",
      ru: 'Среднее всегда между наименьшим и наибольшим',
      en: 'The mean always lies between the smallest and the largest',
    },
    lead: {
      uz: '57 va 65 sonlarini nurda belgilaymiz, o\'rtachasi aynan o\'rtada turadi.',
      ru: 'Отметим на луче числа 57 и 65, среднее окажется точно посередине.',
      en: 'Mark 57 and 65 on the ray; the mean stands exactly in the middle.',
    },
    note: {
      uz: "Javob nurdagi ikkita nuqtadan tashqariga chiqsa, xato qidirish kerak.",
      ru: 'Если ответ выходит за две точки на луче, надо искать ошибку.',
      en: 'If the answer falls outside the two points on the ray, look for a mistake.',
    },
    audio: {
      intro: {
        uz: [
          "O'rtacha qiymatni tez tekshiradigan oddiy belgi bor.",
          "Ellik yetti va oltmish besh sonlarini sonlar nurida belgilaymiz.",
          "Ularning yig'indisi bir yuz yigirma ikki, ikkiga bo'lsak oltmish bir chiqadi.",
          "Oltmish bir aynan o'rtada turibdi. O'rtacha hech qachon eng kichikdan kichik yoki eng kattadan katta bo'lolmaydi.",
        ],
        ru: [
          'Есть простой признак, который быстро проверяет среднее значение.',
          'Отметим на числовом луче числа пятьдесят семь и шестьдесят пять.',
          'Их сумма сто двадцать два, делим на два и получаем шестьдесят один.',
          'Шестьдесят один стоит точно посередине. Среднее никогда не бывает меньше наименьшего или больше наибольшего.',
        ],
        en: [
          'There is a simple sign that checks the mean very quickly.',
          'Mark fifty seven and sixty five on the number ray.',
          'Their sum is one hundred twenty two; divided by two it gives sixty one.',
          'Sixty one stands exactly in the middle. The mean is never below the smallest or above the largest.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s10: {
    eyebrow: { uz: 'Nurdagi joy', ru: 'Место на луче', en: 'A place on the ray' },
    title: {
      uz: "426 va 432 sonlarining o'rtachasi",
      ru: 'Среднее чисел 426 и 432',
      en: 'The mean of 426 and 432',
    },
    question: {
      uz: "O'rtacha qiymat qaysi nuqtada turadi?",
      ru: 'В какой точке стоит среднее значение?',
      en: 'At which point does the mean stand?',
    },
    slots: [
      { label: NUM('424'), caption: { uz: 'chapda', ru: 'слева', en: 'on the left' } },
      { label: NUM('429'), caption: { uz: "o'rtada", ru: 'посередине', en: 'in the middle' } },
      { label: NUM('434'), caption: { uz: "o'ngda", ru: 'справа', en: 'on the right' } },
    ],
    correctSlot: 1,
    correctText: {
      uz: "To'g'ri. Yig'indi sakkiz yuz ellik sakkiz, ikkiga bo'lsak to'rt yuz yigirma to'qqiz. U ikkala son orasida turibdi.",
      ru: 'Верно. Сумма восемьсот пятьдесят восемь, делим на два и получаем четыреста двадцать девять. Оно стоит между двумя числами.',
      en: 'Correct. The sum is eight hundred fifty eight; divided by two it gives four hundred twenty nine, which sits between the two numbers.',
    },
    wrong: [
      {
        uz: "424 ikkala sondan ham kichik. O'rtacha eng kichigidan chapda tura olmaydi.",
        ru: '424 меньше обоих чисел. Среднее не может стоять левее наименьшего.',
        en: '424 is smaller than both numbers. The mean cannot stand to the left of the smallest.',
      },
      null,
      {
        uz: "434 ikkala sondan ham katta. O'rtacha eng kattasidan o'ngda tura olmaydi.",
        ru: '434 больше обоих чисел. Среднее не может стоять правее наибольшего.',
        en: '434 is larger than both numbers. The mean cannot stand to the right of the largest.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Nurda ikkita son belgilangan. To'rt yuz yigirma olti va to'rt yuz o'ttiz ikki.",
          "Ularning o'rtacha arifmetigi qaysi nuqtaga tushishini toping.",
          'Avval joyni taxmin qiling, keyin hisoblab tekshiring.',
        ],
        ru: [
          'На луче отмечены два числа. Четыреста двадцать шесть и четыреста тридцать два.',
          'Найди, в какую точку попадёт их среднее арифметическое.',
          'Сначала прикинь место, потом проверь вычислением.',
        ],
        en: [
          'Two numbers are marked on the ray. Four hundred twenty six and four hundred thirty two.',
          'Find which point their arithmetic mean lands on.',
          'Estimate the place first, then check it by calculating.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s11: {
    eyebrow: { uz: "O'rtacha arifmetik", ru: 'Среднее арифметическое', en: 'The arithmetic mean' },
    title: {
      uz: 'Ikki qadamlik qoida',
      ru: 'Правило из двух шагов',
      en: 'A two-step rule',
    },
    lead: {
      uz: "Bu qoida sonlar nechta bo'lishidan qat'i nazar ishlaydi.",
      ru: 'Это правило работает при любом количестве чисел.',
      en: 'The rule works for any quantity of numbers.',
    },
    note: {
      uz: "Javobni tekshirish: o'rtacha × sonlar soni = yig'indi.",
      ru: 'Проверка ответа: среднее × количество чисел = сумма.',
      en: 'Checking the answer: mean × count of numbers = sum.',
    },
    audio: {
      intro: {
        uz: [
          "Bugungi qoidani bir joyga yig'amiz.",
          "Birinchi qadam. Barcha sonlarni qo'shib, yig'indini topamiz.",
          "Ikkinchi qadam. Yig'indini qo'shiluvchilar soniga bo'lamiz.",
          "Uchinchi harakat majburiy emas, lekin foydali. Javobni sonlar soniga ko'paytirib, yig'indi qaytganini tekshiramiz.",
        ],
        ru: [
          'Соберём сегодняшнее правило в одно место.',
          'Первый шаг. Складываем все числа и находим сумму.',
          'Второй шаг. Делим сумму на число слагаемых.',
          'Третье действие необязательно, но полезно. Умножаем ответ на количество чисел и проверяем, вернулась ли сумма.',
        ],
        en: [
          "Let us gather today's rule in one place.",
          'Step one. Add all the numbers and find the sum.',
          'Step two. Divide the sum by the number of addends.',
          'The third action is optional but useful. Multiply the answer by the count and check that the sum comes back.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s12: {
    eyebrow: { uz: 'Qadamlar tartibi', ru: 'Порядок шагов', en: 'The order of steps' },
    title: {
      uz: 'Qaysi tartib ishlaydi?',
      ru: 'Какой порядок работает?',
      en: 'Which order works?',
    },
    question: {
      uz: "O'rtacha arifmetikni topishda qadamlar qanday ketadi?",
      ru: 'В каком порядке идут шаги при нахождении среднего арифметического?',
      en: 'In what order do the steps go when finding the arithmetic mean?',
    },
    options: [
      {
        uz: "Qo'shaman, sonlarni sanayman, bo'laman",
        ru: 'Складываю, считаю количество чисел, делю',
        en: 'I add, I count the numbers, I divide',
      },
      {
        uz: "Bo'laman, qo'shaman, sonlarni sanayman",
        ru: 'Делю, складываю, считаю количество чисел',
        en: 'I divide, I add, I count the numbers',
      },
      {
        uz: "Eng kattasini olaman, eng kichigini ayiraman",
        ru: 'Беру наибольшее, вычитаю наименьшее',
        en: 'I take the largest and subtract the smallest',
      },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Avval yig'indi kerak, keyin bo'luvchi kerak, shundan so'ng bo'lish mumkin.",
      ru: 'Верно. Сначала нужна сумма, потом нужен делитель, и только тогда можно делить.',
      en: 'Correct. The sum comes first, then the divisor, and only then the division.',
    },
    wrong: [
      null,
      {
        uz: "Bo'lish birinchi bo'la olmaydi. Bo'linuvchi hali yo'q, chunki yig'indi topilmagan.",
        ru: 'Деление не может быть первым. Делимого ещё нет, потому что сумма не найдена.',
        en: 'Division cannot come first. There is no dividend yet, because the sum has not been found.',
      },
      {
        uz: "Eng katta bilan eng kichigining farqi — bu tarqoqlik, o'rtacha emas. O'rtachaga barcha sonlar kerak.",
        ru: 'Разность наибольшего и наименьшего это разброс, а не среднее. Для среднего нужны все числа.',
        en: 'The difference between the largest and the smallest is the spread, not the mean. The mean needs every number.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Ra'no qadamlarni kartochkalarga yozdi, lekin ular aralashib ketdi.",
          "Uchta tartib bor, faqat bittasi ishlaydi.",
          "To'g'ri tartibni tanlang.",
        ],
        ru: [
          'Рано записала шаги на карточках, но они перемешались.',
          'Есть три порядка, работает только один.',
          'Выбери верный порядок.',
        ],
        en: [
          "Rano wrote the steps on cards, but they got mixed up.",
          'There are three orders, and only one of them works.',
          'Choose the right order.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s13: {
    eyebrow: { uz: 'Bit hisobi', ru: 'Расчёт Bit', en: "Bit's calculation" },
    title: {
      uz: "Bit to'rtga bo'ldi. Nega bu xato?",
      ru: 'Bit разделил на четыре. Почему это ошибка?',
      en: 'Bit divided by four. Why is that wrong?',
    },
    question: {
      uz: 'Bit qayerda adashdi?',
      ru: 'Где ошибся Bit?',
      en: 'Where did Bit go wrong?',
    },
    options: [
      {
        uz: "Sonlar beshta edi, u esa qo'shuv belgilarini sanab, to'rtga bo'ldi",
        ru: 'Чисел было пять, а он посчитал знаки плюс и разделил на четыре',
        en: 'There were five numbers, but he counted the plus signs and divided by four',
      },
      {
        uz: "Yig'indini noto'g'ri hisobladi",
        ru: 'Он неверно посчитал сумму',
        en: 'He worked out the sum incorrectly',
      },
      {
        uz: "Bo'lish o'rniga ko'paytirish kerak edi",
        ru: 'Вместо деления нужно было умножить',
        en: 'He should have multiplied instead of dividing',
      },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Beshta son orasida to'rtta qo'shuv belgisi bor, lekin bo'luvchi belgilar soni emas, sonlar soni. To'qson beshni beshga bo'lsak, o'n to'qqiz chiqadi.",
      ru: 'Верно. Между пятью числами четыре знака плюс, но делитель это количество чисел, а не знаков. Девяносто пять разделить на пять даёт девятнадцать.',
      en: 'Correct. Five numbers have four plus signs between them, but the divisor is the count of numbers, not of signs. Ninety five divided by five is nineteen.',
    },
    wrong: [
      null,
      {
        uz: "Yig'indi to'g'ri. O'n ikki, o'n yetti, o'n sakkiz, yigirma va yigirma sakkiz — jami to'qson besh. Xato keyingi qadamda.",
        ru: 'Сумма верная. Двенадцать, семнадцать, восемнадцать, двадцать и двадцать восемь дают девяносто пять. Ошибка на следующем шаге.',
        en: 'The sum is right. Twelve, seventeen, eighteen, twenty and twenty eight give ninety five. The mistake is in the next step.',
      },
      {
        uz: "Amal to'g'ri tanlangan, o'rtacha aynan bo'lish bilan topiladi. Bit bo'luvchini noto'g'ri oldi.",
        ru: 'Действие выбрано верно, среднее находят именно делением. Bit неверно взял делитель.',
        en: 'The operation is right; the mean is found by division. Bit took the wrong divisor.',
      },
    ],
    bitFeedback: true,
    audio: {
      intro: {
        uz: [
          "Bit beshta sonning o'rtachasini hisobladi. O'n ikki, o'n yetti, o'n sakkiz, yigirma va yigirma sakkiz.",
          "Yig'indini to'g'ri topdi, to'qson besh. Keyin uni to'rtga bo'ldi.",
          'Bit qayerda adashganini toping.',
        ],
        ru: [
          'Bit посчитал среднее пяти чисел. Двенадцать, семнадцать, восемнадцать, двадцать и двадцать восемь.',
          'Сумму он нашёл верно, девяносто пять. А потом разделил её на четыре.',
          'Найди, где Bit ошибся.',
        ],
        en: [
          'Bit worked out the mean of five numbers. Twelve, seventeen, eighteen, twenty and twenty eight.',
          'He found the sum correctly, ninety five. Then he divided it by four.',
          'Find where Bit went wrong.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s14: {
    eyebrow: { uz: 'Arena oshxonasi', ru: 'Кухня арены', en: 'The arena kitchen' },
    title: {
      uz: 'Kuniga qancha sabzavot ketgan?',
      ru: 'Сколько овощей уходило в день?',
      en: 'How many vegetables were used per day?',
    },
    question: {
      uz: "Yetti kunda 250 kg kartoshka, 160 kg karam va 80 kg boshqa sabzavot sarflandi. Kuniga o'rtacha qancha?",
      ru: 'За семь дней израсходовали 250 кг картофеля, 160 кг капусты и 80 кг других овощей. Сколько в среднем за день?',
      en: 'In seven days 250 kg of potatoes, 160 kg of cabbage and 80 kg of other vegetables were used. How much per day on average?',
    },
    options: [
      { uz: '70 kg', ru: '70 кг', en: '70 kg' },
      { uz: '490 kg', ru: '490 кг', en: '490 kg' },
      { uz: '245 kg', ru: '245 кг', en: '245 kg' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Avval hamma sabzavotni qo'shdingiz, to'rt yuz to'qson kilogramm chiqdi. Keyin yetti kunga bo'ldingiz, yetmish kilogramm.",
      ru: 'Верно. Сначала складываем все овощи, выходит четыреста девяносто килограммов. Потом делим на семь дней, семьдесят килограммов.',
      en: 'Correct. First you added all the vegetables and got four hundred ninety kilograms. Then you divided by seven days, giving seventy kilograms.',
    },
    wrong: [
      null,
      {
        uz: "To'rt yuz to'qson — bu butun hafta uchun. Bir kunniki kerak, demak bo'lish qadami qolib ketgan.",
        ru: 'Четыреста девяносто это на всю неделю. Нужен один день, значит шаг деления пропущен.',
        en: 'Four hundred ninety is for the whole week. We need one day, so the division step is missing.',
      },
      {
        uz: "Ikkiga bo'lingan. Lekin kun yettita, sabzavot turi emas, kun soni bo'luvchi bo'ladi.",
        ru: 'Разделили на два. Но дней семь, и делителем становится число дней, а не число видов овощей.',
        en: 'That is a division by two. But there are seven days, and the divisor is the number of days, not the number of vegetable kinds.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Musobaqa tugadi, endi arena oshxonasi hisobot beryapti.",
          "Yetti kun davomida ikki yuz ellik kilogramm kartoshka, bir yuz oltmish kilogramm karam va sakson kilogramm boshqa sabzavot sarflangan. Har kuni tengdan.",
          "Kuniga o'rtacha qancha sabzavot ketganini toping.",
        ],
        ru: [
          'Соревнование закончилось, и кухня арены сдаёт отчёт.',
          'За семь дней израсходовали двести пятьдесят килограммов картофеля, сто шестьдесят килограммов капусты и восемьдесят килограммов других овощей. Каждый день поровну.',
          'Найди, сколько овощей в среднем уходило за день.',
        ],
        en: [
          'The contest is over and the arena kitchen is filing its report.',
          'Over seven days it used two hundred fifty kilograms of potatoes, one hundred sixty kilograms of cabbage and eighty kilograms of other vegetables, evenly on every day.',
          'Find how many vegetables were used per day on average.',
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
      uz: "O'rtacha arifmetikni topish qoidasini ayting va unvonni oling.",
      ru: 'Назови правило нахождения среднего арифметического и получи звание.',
      en: 'Name the rule for finding the arithmetic mean and claim your title.',
    },
    questionKicker: { uz: 'Yakuniy savol', ru: 'Финальный вопрос', en: 'Final question' },
    stepLabel: { uz: '1 qadam', ru: '1 шаг', en: '1 step' },
    reflectionQuestion: {
      uz: "O'rtacha arifmetikni qanday topamiz?",
      ru: 'Как находим среднее арифметическое?',
      en: 'How do we find the arithmetic mean?',
    },
    reflectionStart: {
      uz: "O'rtacha arifmetikni topish uchun men…",
      ru: 'Чтобы найти среднее арифметическое, я…',
      en: 'To find the arithmetic mean I…',
    },
    reflectionOptions: [
      {
        uz: "yig'indini qo'shiluvchilar soniga bo'laman",
        ru: 'делю сумму на число слагаемых',
        en: 'divide the sum by the number of addends',
      },
      {
        uz: 'eng katta sonni olaman',
        ru: 'беру самое большое число',
        en: 'take the largest number',
      },
      {
        uz: "yig'indini ikkiga bo'laman",
        ru: 'делю сумму на два',
        en: 'divide the sum by two',
      },
    ],
    reflectionCorrectIndex: 0,
    reflectionCorrect: {
      uz: "To'g'ri. Yig'indi va qo'shiluvchilar soni — ikki qadamli qoidaning ikki qismi.",
      ru: 'Верно. Сумма и число слагаемых это две части правила из двух шагов.',
      en: 'Correct. The sum and the number of addends are the two parts of the two-step rule.',
    },
    reflectionWrong: {
      uz: "Eng katta son butun musobaqani ko'rsatmaydi, ikkiga bo'lish esa faqat ikkita son bo'lgandagina to'g'ri. Bo'luvchi har doim sonlarning soni.",
      ru: 'Самое большое число не показывает всё соревнование, а деление на два верно только для двух чисел. Делитель это всегда количество чисел.',
      en: 'The largest number does not show the whole contest, and dividing by two is right only for two numbers. The divisor is always the count of numbers.',
    },
    rewardAnnounce: { uz: 'Unvon olindi:', ru: 'Звание получено:', en: 'Title earned:' },
    awards: [
      { min: 5, title: { uz: 'Arena bosh hakami', ru: 'Главный судья арены', en: 'Chief arena judge' } },
      { min: 3, title: { uz: 'Natijalar hisobchisi', ru: 'Счётчик результатов', en: 'Results counter' } },
      { min: 0, title: { uz: 'Arena kuzatuvchisi', ru: 'Наблюдатель арены', en: 'Arena observer' } },
    ],
    mainLabel: { uz: 'Qoida', ru: 'Правило', en: 'Rule' },
    main: [
      {
        uz: "1. Barcha sonlarni qo'shamiz va yig'indini topamiz.",
        ru: '1. Складываем все числа и находим сумму.',
        en: '1. Add all the numbers and find the sum.',
      },
      {
        uz: "2. Yig'indini qo'shiluvchilar soniga bo'lamiz.",
        ru: '2. Делим сумму на число слагаемых.',
        en: '2. Divide the sum by the number of addends.',
      },
      {
        uz: "Tekshirish: o'rtacha × sonlar soni = yig'indi.",
        ru: 'Проверка: среднее × количество чисел = сумма.',
        en: 'Check: mean × count of numbers = sum.',
      },
      {
        uz: "O'rtacha har doim eng kichik va eng katta son orasida turadi.",
        ru: 'Среднее всегда лежит между наименьшим и наибольшим числом.',
        en: 'The mean always lies between the smallest and the largest number.',
      },
    ],
    nextLabel: { uz: 'Keyingi missiya', ru: 'Следующая миссия', en: 'Next mission' },
    nextText: {
      uz: 'Bir marta yozilgan va har safar ishlaydigan qoida: formulalar.',
      ru: 'Правило, записанное один раз и работающее всегда: формулы.',
      en: 'A rule written once that works every time: formulas.',
    },
    audio: {
      intro: {
        uz: [
          "Missiya bajarildi. Arena tablosida adolatli natija paydo bo'ldi.",
          "Bugun siz butun natijalar to'plamini bitta songa siqishni va uni tekshirishni o'rgandingiz.",
          'Unvonni ochish uchun bitta savol qoldi.',
        ],
        ru: [
          'Миссия выполнена. На табло арены появился честный результат.',
          'Сегодня ты умеешь сжимать целый набор результатов в одно число и проверять его.',
          'До звания остался один вопрос.',
        ],
        en: [
          'Mission complete. A fair result has appeared on the arena board.',
          'Today you can compress a whole set of results into one number and check it.',
          'One question stands between you and the title.',
        ],
      },
    },
  },
};

// ===========================================================================
// CHIZMALAR
// ===========================================================================

// s0, s14 — arena sahnasi.
//
// Maydon syujetni ushlab turadi, sonlar esa pastdagi tabloda turadi: beshta
// natijani maydonning o'ziga yozib bo'lmaydi, chunki 13, 14, 15 metr bir-biriga
// juda yaqin va yozuvlar ustma-ust tushadi.
const ArenaScene = ({ mode = 'hook', solved = false }) => {
  const t = useT();
  const x = (metres) => 150 + (metres / 16) * 300;
  const rows = [
    { name: 'Anvar', tone: T.cyan, values: [9, 14, 9, 15, 13], y: 348 },
    { name: "Ulug'bek", tone: T.accent, values: [10, 15, 11, 10, 9], y: 400 },
  ];

  return (
    <FitSvg viewBox="0 0 520 464">
      <defs>
        <linearGradient id="d15-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#DCEFF3" />
          <stop offset="1" stopColor="#F4FAF9" />
        </linearGradient>
        <linearGradient id="d15-turf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8ECBA0" />
          <stop offset="1" stopColor="#5FAF7E" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="520" height="464" rx="22" fill="url(#d15-sky)" />

      {/* tribuna */}
      <path d="M0 112 L520 112 L520 170 L0 170 Z" fill="#E3EDF0" />
      {Array.from({ length: 26 }, (_, index) => (
        <rect key={index} x={6 + index * 20} y="118" width="14" height="12" rx="3" fill={index % 3 === 0 ? '#B9D6DE' : '#CFE2E7'} />
      ))}
      {Array.from({ length: 26 }, (_, index) => (
        <rect key={`b-${index}`} x={6 + index * 20} y="136" width="14" height="12" rx="3" fill={index % 4 === 1 ? '#A8CCD6' : '#C6DDE3'} />
      ))}
      <rect x="0" y="152" width="520" height="18" fill="#D3E4E8" />

      {/* maydon */}
      <path d="M0 170 L520 170 L520 330 L0 330 Z" fill="url(#d15-turf)" />
      {Array.from({ length: 5 }, (_, index) => (
        <rect key={`s-${index}`} x="0" y={176 + index * 32} width="520" height="16" fill="rgba(255,255,255,.06)" />
      ))}

      {mode === 'hook' && [0, 4, 8, 12, 16].map((metres) => (
        <g key={metres}>
          <line x1={x(metres)} y1="186" x2={x(metres)} y2="296" stroke="rgba(255,255,255,.55)" strokeWidth={metres === 0 ? 4 : 2} />
          <text x={x(metres)} y="316" textAnchor="middle" fill="#2F6B4E" fontSize="14" fontWeight="800" fontFamily="JetBrains Mono, monospace">
            {metres}
          </text>
        </g>
      ))}
      {mode === 'hook' && (
        <text x="474" y="316" textAnchor="middle" fill="#2F6B4E" fontSize="13" fontWeight="700" fontFamily="Manrope, sans-serif">
          {t(METR)}
        </text>
      )}

      {/* uloqtiruvchilar */}
      {mode === 'hook' && [{ cx: 62, tone: T.cyan }, { cx: 110, tone: T.accent }].map((who) => (
        <g key={who.cx}>
          <ellipse cx={who.cx} cy="298" rx="19" ry="6" fill="rgba(23,59,82,.16)" />
          <path d={`M${who.cx - 9} ${who.cx === 62 ? 262 : 262} l4 34 M${who.cx + 3} 262 l4 34`} stroke="#2E4A5C" strokeWidth="6" strokeLinecap="round" />
          <path d={`M${who.cx - 12} 226 q12 -9 24 0 l5 40 q-17 7 -34 0 z`} fill={who.tone} />
          <circle cx={who.cx} cy="212" r="12" fill="#F3C79B" />
          <path d={`M${who.cx - 12} 206 q12 -13 24 0 q-12 -5 -24 0 z`} fill="#3B2A21" />
          <path d={`M${who.cx + 10} 234 q16 -14 26 -24`} stroke={who.tone} strokeWidth="5.5" strokeLinecap="round" fill="none" />
          <rect x={who.cx + 32} y="200" width="17" height="11" rx="3" fill="#C08B4E" stroke="#93673A" strokeWidth="1.4" />
        </g>
      ))}

      {/* uloqtirish belgilari maydonda — sonlarsiz, faqat joyi */}
      {mode === 'hook' && rows.map((row, rowIndex) => (
        row.values.map((value, index) => (
          <g key={`${rowIndex}-${index}`}>
            <line
              x1={x(value)}
              y1={rowIndex === 0 ? 240 : 284}
              x2={x(value)}
              y2={rowIndex === 0 ? 214 : 258}
              stroke={row.tone}
              strokeWidth="2.2"
            />
            <path d={`M${x(value)} ${rowIndex === 0 ? 214 : 258} l14 6 l-14 6 z`} fill={row.tone} />
            <circle cx={x(value)} cy={rowIndex === 0 ? 240 : 284} r="3.4" fill={row.tone} />
          </g>
        ))
      ))}

      {/* tablo */}
      {mode === 'hook' && (
        <g>
          <rect x="14" y="336" width="492" height="118" rx="16" fill="rgba(255,255,255,.95)" stroke="rgba(23,59,82,.12)" strokeWidth="1.6" />
          {rows.map((row) => (
            <g key={row.name}>
              <rect x={26} y={row.y} width={92} height={38} rx="11" fill={row.tone === T.cyan ? T.cyanSoft : T.accentSoft} />
              <text x={72} y={row.y + 25} textAnchor="middle" fill={row.tone} fontSize="14" fontWeight="800" fontFamily="Manrope, sans-serif">
                {row.name}
              </text>
              {row.values.map((value, index) => (
                <g key={index}>
                  <rect x={130 + index * 74} y={row.y} width={62} height={38} rx="11" fill="#FFFFFF" stroke={row.tone} strokeWidth="1.8" />
                  <text
                    x={161 + index * 74}
                    y={row.y + 26}
                    textAnchor="middle"
                    fill={T.ink}
                    fontSize="17"
                    fontWeight="800"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {value}
                  </text>
                </g>
              ))}
            </g>
          ))}
        </g>
      )}

      {mode === 'final' && (
        <g>
          <rect x="66" y="196" width="388" height="212" rx="20" fill="rgba(255,255,255,.95)" stroke={solved ? T.success : 'rgba(23,59,82,.14)'} strokeWidth="2.4" />
          <text x="260" y="236" textAnchor="middle" fill={T.ink2} fontSize="16" fontWeight="700" fontFamily="Manrope, sans-serif">
            {t({ uz: 'Arena oshxonasi, 7 kun', ru: 'Кухня арены, 7 дней', en: 'Arena kitchen, 7 days' })}
          </text>
          <text x="260" y="284" textAnchor="middle" fill={T.ink} fontSize="23" fontWeight="800" fontFamily="JetBrains Mono, monospace">
            250 + 160 + 80
          </text>
          <text x="260" y="336" textAnchor="middle" fill={solved ? T.success : T.ink3} fontSize="26" fontWeight="800" fontFamily="JetBrains Mono, monospace">
            {solved ? '490 : 7 = 70' : '490 : 7 = ?'}
          </text>
          <text x="260" y="372" textAnchor="middle" fill={T.ink3} fontSize="14" fontWeight="700" fontFamily="Manrope, sans-serif">
            {t({ uz: 'kg, bir kunga', ru: 'кг за один день', en: 'kg for one day' })}
          </text>
        </g>
      )}
    </FitSvg>
  );
};

// s3, s5, s7 — yig'indi va bo'lish yo'lagi.
const SumStrip = ({ frame = 0, numbers, sum, count, average, unit = '', reverse = false }) => {
  const t = useT();
  const slot = 420 / numbers.length;
  return (
    <FitSvg viewBox="0 0 520 232">
      <g opacity={frame >= 1 ? 1 : 0.28} style={{ transition: 'opacity .4s' }}>
        {numbers.map((value, index) => (
          <g key={index}>
            <rect
              x={50 + index * slot + 4}
              y="28"
              width={slot - 12}
              height="44"
              rx="12"
              fill="#FFFFFF"
              stroke={T.cyan}
              strokeWidth="1.8"
            />
            <text
              x={50 + index * slot + slot / 2 - 2}
              y="57"
              textAnchor="middle"
              fill={T.ink}
              fontSize="17"
              fontWeight="800"
              fontFamily="JetBrains Mono, monospace"
            >
              {value}
            </text>
          </g>
        ))}
      </g>
      <g opacity={frame >= 2 ? 1 : 0.28} style={{ transition: 'opacity .4s' }}>
        <path d="M260 78 l-8 -10 h16 z" fill={T.ink3} transform="rotate(180 260 73)" />
        <rect x="150" y="88" width="220" height="46" rx="13" fill={T.cyanSoft} />
        <text x="260" y="119" textAnchor="middle" fill={T.cyan} fontSize="20" fontWeight="800" fontFamily="JetBrains Mono, monospace">
          {sum}
        </text>
        <text x="382" y="117" fill={T.ink3} fontSize="12.5" fontWeight="700" fontFamily="Manrope, sans-serif">
          {t({ uz: "yig'indi", ru: 'сумма', en: 'sum' })}
        </text>
      </g>
      <g opacity={frame >= 3 ? 1 : 0.28} style={{ transition: 'opacity .4s' }}>
        <rect x="150" y="146" width="220" height="46" rx="13" fill="#FFFFFF" stroke={T.ink3} strokeWidth="1.6" />
        <text x="260" y="177" textAnchor="middle" fill={T.ink} fontSize="19" fontWeight="800" fontFamily="JetBrains Mono, monospace">
          {reverse ? `${average} × ${count}` : `${sum} : ${count}`}
        </text>
        <text x="382" y="175" fill={T.ink3} fontSize="12.5" fontWeight="700" fontFamily="Manrope, sans-serif">
          {reverse
            ? t({ uz: 'tekshirish', ru: 'проверка', en: 'check' })
            : t({ uz: 'sonlar soni', ru: 'количество чисел', en: 'count of numbers' })}
        </text>
        <rect x="150" y="200" width="220" height="26" rx="9" fill={T.successSoft} />
        <text x="260" y="219" textAnchor="middle" fill={T.success} fontSize="17" fontWeight="800" fontFamily="JetBrains Mono, monospace">
          {reverse ? sum : `${average} ${unit}`}
        </text>
      </g>
    </FitSvg>
  );
};

// s6 uchun kichik ishora: uchta son va ularning yig'indisi.
const TableHint = ({ solved = false }) => (
  <FitSvg viewBox="0 0 520 74" className="table-hint">
    <text x="260" y="34" textAnchor="middle" fill={T.ink3} fontSize="15" fontWeight="700" fontFamily="JetBrains Mono, monospace">
      136 + 140 + 147 = 423
    </text>
    <text
      x="260"
      y="62"
      textAnchor="middle"
      fill={solved ? T.success : T.ink3}
      fontSize="16"
      fontWeight="800"
      fontFamily="JetBrains Mono, monospace"
    >
      {solved ? '423 : 3 = 141' : '423 : 3 = ?'}
    </text>
  </FitSvg>
);

// s9, s10 — sonlar nuri.
const RayFigure = ({ frame = 0, mode = 's9', picked = null, solved = false }) => {
  const t = useT();
  if (mode === 's9') {
    return (
      <ScaleFigure
        min={56}
        max={68}
        majorEvery={4}
        minorPerMajor={4}
        accentPair={frame >= 1 ? [57, 65] : null}
        highlight={frame >= 3 ? 61 : null}
        caption={frame >= 2 ? '57 + 65 = 122,  122 : 2 = 61' : null}
      />
    );
  }
  const shown = solved ? 429 : picked === null ? null : [424, 429, 434][picked];
  return (
    <ScaleFigure
      min={424}
      max={436}
      majorEvery={4}
      minorPerMajor={4}
      accentPair={[426, 432]}
      highlight={solved ? 429 : null}
      pointer={shown !== null && !solved ? shown : null}
      caption={solved
        ? '426 + 432 = 858,  858 : 2 = 429'
        : t({ uz: 'Ikkita son orasidagi joyni toping', ru: 'Найди место между двумя числами', en: 'Find the place between the two numbers' })}
    />
  );
};

// s11 — qoida kartasi.
const RuleCard = ({ frame = 0 }) => {
  const t = useT();
  const rows = [
    {
      on: frame >= 1,
      text: { uz: "1. Sonlarni qo'shamiz", ru: '1. Складываем числа', en: '1. Add the numbers' },
      formula: 'a + b + c',
      tone: T.cyan,
    },
    {
      on: frame >= 2,
      text: { uz: "2. Sonlar sonini sanaymiz", ru: '2. Считаем количество чисел', en: '2. Count the numbers' },
      formula: 'n',
      tone: T.navy,
    },
    {
      on: frame >= 3,
      text: { uz: "3. Yig'indini shu songa bo'lamiz", ru: '3. Делим сумму на это число', en: '3. Divide the sum by that count' },
      formula: '(a + b + c) : n',
      tone: T.success,
    },
  ];
  return (
    <FitSvg viewBox="0 0 520 232">
      {rows.map((row, index) => (
        <g key={index} opacity={row.on ? 1 : 0.28} style={{ transition: 'opacity .4s' }}>
          <rect x="42" y={18 + index * 68} width="436" height="56" rx="14" fill="#FFFFFF" stroke={row.tone} strokeWidth="2" />
          <text x="64" y={44 + index * 68} fill={T.ink2} fontSize="14" fontWeight="700" fontFamily="Manrope, sans-serif">
            {t(row.text)}
          </text>
          <text x="64" y={64 + index * 68} fill={row.tone} fontSize="17" fontWeight="800" fontFamily="JetBrains Mono, monospace">
            {row.formula}
          </text>
        </g>
      ))}
    </FitSvg>
  );
};

// s12 — qadamlar kartochkalari.
const StepsFigure = ({ solved = false }) => {
  const t = useT();
  const cards = [
    { text: { uz: "Qo'shaman", ru: 'Складываю', en: 'I add' }, tone: T.cyan },
    { text: { uz: 'Sanayman', ru: 'Считаю', en: 'I count' }, tone: T.navy },
    { text: { uz: "Bo'laman", ru: 'Делю', en: 'I divide' }, tone: T.success },
  ];
  return (
    <FitSvg viewBox="0 0 520 232">
      {cards.map((card, index) => (
        <g key={index} opacity={solved ? 1 : 0.55} style={{ transition: 'opacity .4s' }}>
          <rect
            x={44 + index * 148}
            y="72"
            width="128"
            height="88"
            rx="16"
            fill={solved ? '#FFFFFF' : '#F6F9F8'}
            stroke={solved ? card.tone : T.ink3}
            strokeWidth={solved ? 2.4 : 1.6}
          />
          <text x={108 + index * 148} y="112" textAnchor="middle" fill={solved ? card.tone : T.ink3} fontSize="26" fontWeight="800" fontFamily="JetBrains Mono, monospace">
            {index + 1}
          </text>
          <text x={108 + index * 148} y="140" textAnchor="middle" fill={T.ink2} fontSize="14" fontWeight="700" fontFamily="Manrope, sans-serif">
            {t(card.text)}
          </text>
        </g>
      ))}
      {solved && [0, 1].map((index) => (
        <path key={index} d={`M${176 + index * 148} 116 l14 0 M${186 + index * 148} 110 l6 6 l-6 6`} stroke={T.ink3} strokeWidth="2" fill="none" strokeLinecap="round" />
      ))}
    </FitSvg>
  );
};

// s13 — Bit ning hisobi.
const BitCountFigure = ({ solved = false }) => {
  const t = useT();
  const numbers = [12, 17, 18, 20, 28];
  return (
    <FitSvg viewBox="0 0 520 232">
      <text x="260" y="34" textAnchor="middle" fill={T.ink2} fontSize="14" fontWeight="700" fontFamily="Manrope, sans-serif">
        {t({ uz: 'Bit hisobi', ru: 'Расчёт Bit', en: "Bit's calculation" })}
      </text>
      {numbers.map((value, index) => (
        <g key={value}>
          <rect x={50 + index * 84} y="52" width="62" height="40" rx="11" fill="#FFFFFF" stroke={solved ? T.success : T.ink3} strokeWidth="1.8" />
          <text x={81 + index * 84} y="79" textAnchor="middle" fill={T.ink} fontSize="17" fontWeight="800" fontFamily="JetBrains Mono, monospace">
            {value}
          </text>
          {solved && (
            <text x={81 + index * 84} y="112" textAnchor="middle" fill={T.success} fontSize="13" fontWeight="800" fontFamily="JetBrains Mono, monospace">
              {index + 1}
            </text>
          )}
          {index < numbers.length - 1 && (
            <text
              x={123 + index * 84}
              y="79"
              textAnchor="middle"
              fill={solved ? T.accent : T.ink3}
              fontSize="17"
              fontWeight="800"
              fontFamily="JetBrains Mono, monospace"
            >
              +
            </text>
          )}
        </g>
      ))}
      <rect x="118" y="128" width="284" height="44" rx="13" fill={solved ? 'rgba(255,91,53,.10)' : '#FFF6F3'} stroke={T.accent} strokeWidth="2" />
      <text x="260" y="157" textAnchor="middle" fill={T.accent} fontSize="19" fontWeight="800" fontFamily="JetBrains Mono, monospace">
        95 : 4
      </text>
      <rect
        x="118"
        y="180"
        width="284"
        height="44"
        rx="13"
        fill={solved ? T.successSoft : 'rgba(23,59,82,.04)'}
        stroke={solved ? T.success : T.ink3}
        strokeWidth={solved ? 2.2 : 1.4}
        strokeDasharray={solved ? '' : '5 5'}
      />
      <text
        x="260"
        y="209"
        textAnchor="middle"
        fill={solved ? T.success : T.ink3}
        fontSize="19"
        fontWeight="800"
        fontFamily="JetBrains Mono, monospace"
      >
        {solved ? '95 : 5 = 19' : '95 : ?'}
      </text>
    </FitSvg>
  );
};

// ===========================================================================
// EKRANLAR
// ===========================================================================
const Screen0 = (props) => (
  <ChoiceScreen {...props} plain ratio="28 / 25" ordinal={0} figure={() => <ArenaScene />} />
);
const Screen1 = (props) => (
  <RevealScreen
    {...props}
    figure={({ frame }) => (
      <LevelFigure bars={ANVAR} level={frame === 2 ? 12 : null} target={12} settled={frame >= 3} unit="m" />
    )}
  />
);
const Screen2 = (props) => <LevelPick {...props} />;
const Screen3 = (props) => (
  <RevealScreen
    {...props}
    figure={({ frame }) => (
      <SumStrip frame={frame} numbers={[9, 14, 9, 15, 13]} sum={60} count={5} average={12} unit="m" />
    )}
  />
);
const Screen4 = (props) => (
  <NumPadScreen
    {...props}
    figure={({ solved }) => (
      <SumStrip frame={solved ? 3 : 2} numbers={[28, 36, 19, 41]} sum={124} count={4} average={31} />
    )}
  />
);
const Screen5 = (props) => (
  <RevealScreen
    {...props}
    figure={({ frame }) => (
      <SumStrip frame={frame} numbers={[136, 140, 147]} sum={423} count={3} average={141} />
    )}
  />
);
const Screen6 = (props) => <TableFill {...props} figure={({ solved }) => <TableHint solved={solved} />} />;
const Screen7 = (props) => (
  <RevealScreen
    {...props}
    figure={({ frame }) => (
      <SumStrip frame={frame} numbers={[9, 14, 9, 15, 13]} sum={60} count={5} average={12} unit="m" reverse />
    )}
  />
);
const Screen8 = (props) => (
  <NumPadScreen
    {...props}
    figure={({ solved }) => (
      <SumStrip frame={solved ? 3 : 2} numbers={[224, 200, 270, 230]} sum={924} count={4} average={231} />
    )}
  />
);
const Screen9 = (props) => (
  <RevealScreen {...props} ratio="520 / 150" figure={({ frame }) => <RayFigure frame={frame} />} />
);
const Screen10 = (props) => (
  <SlotScreen
    {...props}
    ratio="520 / 150"
    figure={({ picked, solved }) => <RayFigure mode="s10" picked={picked} solved={solved} />}
  />
);
const Screen11 = (props) => <RevealScreen {...props} figure={({ frame }) => <RuleCard frame={frame} />} />;
const Screen12 = (props) => (
  <ChoiceScreen {...props} ordinal={3} stack figure={({ solved }) => <StepsFigure solved={solved} />} />
);
const Screen13 = (props) => (
  <ChoiceScreen {...props} ordinal={4} stack figure={({ solved }) => <BitCountFigure solved={solved} />} />
);
const Screen14 = (props) => (
  <ChoiceScreen {...props} plain ratio="28 / 25" ordinal={5} figure={({ solved }) => <ArenaScene mode="final" solved={solved} />} />
);
const Screen15 = (props) => <SummaryScreen {...props} />;

const SCREENS = [
  Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7,
  Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15,
];

export default function Grade4Dars15(props) {
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
