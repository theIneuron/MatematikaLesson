// ============================================================================
// 4-SINF · Dars 50 · Grafiklar va ma'lumotlarni tasvirlash usullari
//
// Manba: N. U. Bikbayeva, "Matematika. 4-sinf", o'zbek nashri, 191-198-bet:
//   191-bet 1-topshiriq — o'sish grafigi: yosh gorizontal o'qda, bo'y
//     vertikal o'qda; darslik savollari "bir yoshda bo'yi qanday edi",
//     "bo'yi qirq santimetr bo'lganda necha yoshda edi", "oxirgi yilda
//     bo'yi o'sdimi", "bir yoshdan uch yoshgacha necha santimetr o'sgan";
//   192-bet 2-topshiriq — fabrika grafigi: to'rt oy, jami mahsulot, eng kam
//     va eng ko'p oy, teng oylar;
//   195-196-bet — jadval, diagramma va grafik ma'lumotni qisqa va ko'rgazmali
//     yetkazadi; "har bir katak bir birlikka teng" shkalasi.
// Syujet: boshqaruv markazining MONITORING EKRANI (SYUJET_4SINF.md, 6-blok).
// 49-darsdan ko'prik: xabarlar saralandi, endi ular chizmaga aylanadi.
//
// YADRO. Chizmani o'qish uch qadam: avval o'qlarni o'qiymiz, keyin shkalani
// aniqlaymiz, shundan keyingina qiymatni aytamiz. Shkalani o'tkazib yuborish
// eng ko'p uchraydigan xato.
//
// RITM: qisqa tushuntirish -> misol -> yana tushuntirish -> misol.
// Baholanadigan olti ekran: s2, s4, s6, s8, s10, s13.
// ============================================================================
import {
  BitSVG, Caption, ChoiceScreen, FitSvg, KIT_STYLES, NumPadScreen, RecordRow,
  RevealScreen, RuleRows, StepList, SummaryScreen, T, TheoryLessonRoot,
  assertScreenTypeLabels, useT,
} from './kit/index.js';

const LESSON_META = {
  lessonId: 'graph-4-50-v2',
  slug: 'dars50-grafiklar-va-malumotlar',
  lessonTitle: {
    uz: "50-dars. Grafiklar va ma'lumotlarni tasvirlash usullari",
    ru: 'Урок 50. Графики и способы представления данных',
    en: 'Lesson 50. Graphs and ways to represent data',
  },
  skillTags: ['read_axes', 'read_scale', 'value_from_graph', 'difference_from_graph', 'compare_bars'],
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
    eyebrow: { uz: 'Monitoring ekrani', ru: 'Экран мониторинга', en: 'The monitoring screen' },
    title: {
      uz: 'Ko\'rsatkich noto\'g\'ri o\'qildi',
      ru: 'Показатель прочитан неверно',
      en: 'The reading was taken wrongly',
    },
    question: {
      uz: 'Bit chizmani o\'qishda nimani almashtirdi?',
      ru: 'Что перепутал Bit, читая чертёж?',
      en: 'What did Bit mix up when reading the chart?',
    },
    options: [
      { uz: "Yosh va bo'y o'qlarini", ru: 'Оси возраста и роста', en: 'The axes of age and height' },
      { uz: "Nuqtani noto'g'ri topdi", ru: 'Неверно нашёл точку', en: 'He found the point wrongly' },
      { uz: "Grafik noto'g'ri chizilgan", ru: 'График начерчен неверно', en: 'The graph is drawn wrongly' },
      { uz: "Chizmada birlik ko'rsatilmagan", ru: 'На чертеже не указана единица', en: 'The chart shows no unit' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Uch soni gorizontal o'qdagi yosh edi. Bo'y esa vertikal o'qdan o'qiladi.",
      ru: 'Верно. Тройка была возрастом на горизонтальной оси. А рост читают по вертикальной.',
      en: 'Correct. The three was the age on the horizontal axis. The height is read on the vertical one.',
    },
    wrong: [
      null,
      {
        uz: "Nuqtani to'g'ri topgan: u aynan uch yoshda turibdi. Xato o'qni tanlashda.",
        ru: 'Точку он нашёл верно: она стоит ровно на трёх годах. Ошибка в выборе оси.',
        en: 'He found the point correctly: it stands exactly at three years. The error is in the choice of axis.',
      },
      {
        uz: "Grafik to'g'ri: nuqtalar o'lchovlarga mos qo'yilgan. Xato o'qishda.",
        ru: 'График верен: точки поставлены по измерениям. Ошибка в чтении.',
        en: 'The graph is right: the points match the measurements. The error is in the reading.',
      },
      {
        uz: "Birliklar ko'rsatilgan: yosh yil bilan, bo'y santimetr bilan.",
        ru: 'Единицы указаны: возраст в годах, рост в сантиметрах.',
        en: 'The units are shown: age in years, height in centimetres.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Salom, do'stim! Xabarlar saralandi va endi ular monitoring ekraniga chizma bo'lib tushdi.",
          "Ekranda o'sish grafigi: gorizontal o'qda yosh, vertikal o'qda bo'y santimetrda.",
          "Bit hisobot yozdi: uch yoshda bo'y uch santimetr. Bu mumkin emas.",
          "Bit nimani almashtirdi? Javobni tanlang.",
        ],
        ru: [
          'Привет, друг! Сообщения отсортированы и вышли на экран мониторинга чертежом.',
          'На экране график роста: по горизонтальной оси возраст, по вертикальной рост в сантиметрах.',
          'Bit написал отчёт: в три года рост три сантиметра. Так быть не может.',
          'Что перепутал Bit? Выбери ответ.',
        ],
        en: [
          'Hello, friend! The messages are sorted and have reached the monitoring screen as a chart.',
          'The screen shows a growth graph: age on the horizontal axis, height in centimetres on the vertical one.',
          'Bit wrote a report: at three years the height is three centimetres. That cannot be.',
          'What did Bit mix up? Choose an answer.',
        ],
      },
    },
  },

  s1: {
    eyebrow: { uz: 'Ikki o\'q', ru: 'Две оси', en: 'Two axes' },
    title: {
      uz: 'Grafik ikki o\'qdan boshlanadi',
      ru: 'График начинается с двух осей',
      en: 'A graph starts with two axes',
    },
    lead: {
      uz: "Gorizontal o'q bir kattalikni, vertikal o'q ikkinchisini ko'rsatadi.",
      ru: 'Горизонтальная ось показывает одну величину, вертикальная другую.',
      en: 'The horizontal axis shows one quantity and the vertical one another.',
    },
    note: {
      uz: 'Nuqta ikki o\'qning kesishmasida turadi: u ikki sonni birga bildiradi.',
      ru: 'Точка стоит на пересечении осей: она сразу говорит о двух числах.',
      en: 'A point stands where the two axes meet: it tells two numbers at once.',
    },
    audio: {
      intro: {
        uz: [
          "Grafikni yaqindan ko'ramiz. Pastda gorizontal o'q: unda yosh yozilgan.",
          "Chapda vertikal o'q: unda bo'y santimetr bilan yozilgan.",
          "Har nuqta ikki sonni birga bildiradi: qaysi yoshda qanday bo'y bo'lganini.",
          "Nuqtalar chiziq bilan tutashtirilgan, chunki bo'y uzluksiz o'sadi.",
        ],
        ru: [
          'Рассмотрим график поближе. Внизу горизонтальная ось: на ней возраст.',
          'Слева вертикальная ось: на ней рост в сантиметрах.',
          'Каждая точка говорит сразу о двух числах: в каком возрасте какой был рост.',
          'Точки соединены линией, потому что рост идёт непрерывно.',
        ],
        en: [
          'Let us look at the graph closely. At the bottom is the horizontal axis: it carries the age.',
          'On the left is the vertical axis: it carries the height in centimetres.',
          'Every point tells two numbers at once: at which age what the height was.',
          'The points are joined by a line because growth goes on without breaks.',
        ],
      },
    },
  },

  s2: {
    eyebrow: { uz: 'Qiymatni o\'qing', ru: 'Прочитай значение', en: 'Read the value' },
    title: {
      uz: 'Uch yoshda bo\'y qancha edi?',
      ru: 'Какой был рост в три года?',
      en: 'What was the height at three years?',
    },
    question: {
      uz: 'Grafikka qarab ayting: 3 yoshda bo\'y qancha?',
      ru: 'Посмотри на график: какой рост в 3 года?',
      en: 'Look at the graph: what is the height at 3 years?',
    },
    options: [
      { uz: '40 cm', ru: '40 см', en: '40 cm' },
      { uz: '30 cm', ru: '30 см', en: '30 cm' },
      { uz: '3 cm', ru: '3 см', en: '3 cm' },
      { uz: '50 cm', ru: '50 см', en: '50 cm' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Uch yoshdan tik yuqoriga ko'tarilib, nuqtadan chapga qarasak qirq chiqadi.",
      ru: 'Верно. Поднимаемся от трёх лет вверх, а от точки идём влево и получаем сорок.',
      en: 'Correct. Go up from three years and left from the point: it gives forty.',
    },
    wrong: [
      null,
      {
        uz: "Ikki yoshda bo'y o'ttiz santimetr edi. Bir yosh oldinga qarang.",
        ru: 'В два года рост был тридцать сантиметров. Посмотри на год позже.',
        en: 'At two years the height was thirty centimetres. Look one year later.',
      },
      {
        uz: "Bu Bitning xatosi: uch soni yosh, bo'y emas.",
        ru: 'Это ошибка Bit: тройка тут возраст, а не рост.',
        en: 'That is Bit error: the three is the age, not the height.',
      },
      {
        uz: "To'rt yoshda bo'y ellik santimetr edi. Nuqtani bir yosh chapga suring.",
        ru: 'В четыре года рост был пятьдесят сантиметров. Сдвинь точку на год влево.',
        en: 'At four years the height was fifty centimetres. Move the point one year left.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Monitoring ekranida o'sish grafigi turibdi.",
          "Gorizontal o'qdan yoshni toping, keyin tik yuqoriga ko'tariling.",
          "Uch yoshda bo'y qancha edi? Javobni tanlang.",
        ],
        ru: [
          'На экране мониторинга график роста.',
          'Найди возраст на горизонтальной оси, затем поднимись вертикально вверх.',
          'Какой был рост в три года? Выбери ответ.',
        ],
        en: [
          'The growth graph stands on the monitoring screen.',
          'Find the age on the horizontal axis, then go straight up.',
          'What was the height at three years? Choose an answer.',
        ],
      },
    },
  },

  s3: {
    eyebrow: { uz: 'Teskari o\'qish', ru: 'Обратное чтение', en: 'Reading backwards' },
    title: {
      uz: 'Bo\'ydan yoshni topamiz',
      ru: 'От роста к возрасту',
      en: 'From the height to the age',
    },
    lead: {
      uz: "Chizmani ikki tomonga o'qish mumkin: qiymatdan ham, o'qdan ham boshlash mumkin.",
      ru: 'Чертёж читают в обе стороны: можно начать и со значения, и с оси.',
      en: 'A chart is read both ways: you may start from the value or from the axis.',
    },
    note: {
      uz: 'Yo\'l bir xil, faqat yo\'nalish teskari.',
      ru: 'Путь тот же, только направление обратное.',
      en: 'The path is the same, only the direction is reversed.',
    },
    audio: {
      intro: {
        uz: [
          "Endi savol teskari: bo'y yetmish santimetr bo'lganda necha yoshda edi?",
          "Vertikal o'qdan yetmishni topamiz va o'ngga qarab yuramiz.",
          "Chiziqqa yetganda tik pastga tushamiz.",
          "Gorizontal o'qda olti chiqdi. Demak bo'y yetmish santimetr bo'lganda olti yoshda edi.",
        ],
        ru: [
          'Теперь вопрос обратный: в каком возрасте рост был семьдесят сантиметров?',
          'Находим семьдесят на вертикальной оси и идём вправо.',
          'Дойдя до линии, спускаемся вертикально вниз.',
          'На горизонтальной оси вышло шесть. Значит рост семьдесят сантиметров был в шесть лет.',
        ],
        en: [
          'Now the question is reversed: at what age was the height seventy centimetres?',
          'Find seventy on the vertical axis and move to the right.',
          'When you reach the line, go straight down.',
          'The horizontal axis gives six. So the height of seventy centimetres was at six years.',
        ],
      },
    },
  },

  s4: {
    eyebrow: { uz: 'Yoshni toping', ru: 'Найди возраст', en: 'Find the age' },
    title: {
      uz: 'Bo\'y 50 cm bo\'lganda?',
      ru: 'Когда рост был 50 см?',
      en: 'When was the height 50 cm?',
    },
    question: {
      uz: 'Bo\'y 50 cm bo\'lganda necha yoshda edi?',
      ru: 'В каком возрасте рост был 50 см?',
      en: 'At what age was the height 50 cm?',
    },
    options: [
      { uz: '4 yosh', ru: '4 года', en: '4 years' },
      { uz: '5 yosh', ru: '5 лет', en: '5 years' },
      { uz: '3 yosh', ru: '3 года', en: '3 years' },
      { uz: '50 yosh', ru: '50 лет', en: '50 years' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Ellikdan o'ngga yurib, chiziqqa yetgach pastga tushsak, to'rt chiqadi.",
      ru: 'Верно. Идём от пятидесяти вправо, доходим до линии и спускаемся: получается четыре.',
      en: 'Correct. Go right from fifty, reach the line and come down: it gives four.',
    },
    wrong: [
      null,
      {
        uz: "Besh yoshda bo'y oltmish santimetr edi. Bir yosh orqaga qarang.",
        ru: 'В пять лет рост был шестьдесят сантиметров. Посмотри на год раньше.',
        en: 'At five the height was sixty centimetres. Look one year earlier.',
      },
      {
        uz: "Uch yoshda bo'y qirq santimetr edi. Bir yosh oldinga qarang.",
        ru: 'В три года рост был сорок сантиметров. Посмотри на год позже.',
        en: 'At three the height was forty centimetres. Look one year later.',
      },
      {
        uz: "Bu bo'y qiymatini yoshga aylantirib yuborish. O'qlarni ajrating.",
        ru: 'Здесь значение роста превратили в возраст. Различай оси.',
        en: 'Here the height value was turned into an age. Keep the axes apart.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Endi teskari yo'nalishda o'qiymiz.",
          "Vertikal o'qdan ellikni toping va o'ngga yuring.",
          "Bo'y ellik santimetr bo'lganda necha yoshda edi? Javobni tanlang.",
        ],
        ru: [
          'Теперь читаем в обратную сторону.',
          'Найди пятьдесят на вертикальной оси и иди вправо.',
          'В каком возрасте рост был пятьдесят сантиметров? Выбери ответ.',
        ],
        en: [
          'Now we read in the reverse direction.',
          'Find fifty on the vertical axis and move to the right.',
          'At what age was the height fifty centimetres? Choose an answer.',
        ],
      },
    },
  },

  s5: {
    eyebrow: { uz: 'Farqni topish', ru: 'Найти разницу', en: 'Finding the difference' },
    title: {
      uz: 'Qancha o\'sgan?',
      ru: 'На сколько вырос?',
      en: 'By how much did it grow?',
    },
    lead: {
      uz: "Ikki nuqtaning qiymatlarini o'qib, kattasidan kichigini ayiramiz.",
      ru: 'Читаем значения двух точек и вычитаем меньшее из большего.',
      en: 'We read the values of two points and take the smaller from the larger.',
    },
    note: {
      uz: 'Grafik o\'sishni ko\'rsatadi, ayirish esa uni songa aylantiradi.',
      ru: 'График показывает рост, а вычитание превращает его в число.',
      en: 'The graph shows the growth, subtraction turns it into a number.',
    },
    audio: {
      intro: {
        uz: [
          "Darslik so'raydi: bir yoshdan uch yoshgacha qancha o'sgan?",
          "Bir yoshdagi bo'yni o'qiymiz: yigirma santimetr.",
          "Uch yoshdagi bo'yni o'qiymiz: qirq santimetr.",
          "Qirqdan yigirmani ayiramiz: yigirma santimetr o'sgan.",
        ],
        ru: [
          'Учебник спрашивает: на сколько вырос с одного года до трёх?',
          'Читаем рост в один год: двадцать сантиметров.',
          'Читаем рост в три года: сорок сантиметров.',
          'Из сорока вычитаем двадцать: вырос на двадцать сантиметров.',
        ],
        en: [
          'The textbook asks: by how much did it grow from one year to three?',
          'Read the height at one year: twenty centimetres.',
          'Read the height at three years: forty centimetres.',
          'Take twenty from forty: it grew by twenty centimetres.',
        ],
      },
    },
  },

  s6: {
    eyebrow: { uz: 'Terib javob bering', ru: 'Набери ответ', en: 'Type the answer' },
    title: {
      uz: '3 yoshdan 7 yoshgacha',
      ru: 'С 3 до 7 лет',
      en: 'From 3 to 7 years',
    },
    question: {
      uz: '3 yoshdan 7 yoshgacha necha santimetr o\'sgan?',
      ru: 'На сколько сантиметров вырос с 3 до 7 лет?',
      en: 'By how many centimetres did it grow from 3 to 7 years?',
    },
    answer: 35,
    unit: { uz: 'cm', ru: 'см', en: 'cm' },
    correctText: {
      uz: "To'g'ri. Yetti yoshda yetmish besh, uch yoshda qirq. Farqi o'ttiz besh santimetr.",
      ru: 'Верно. В семь лет семьдесят пять, в три сорок. Разница тридцать пять сантиметров.',
      en: 'Correct. At seven it is seventy five, at three it is forty. The difference is thirty five centimetres.',
    },
    wrong: {
      uz: "Hali emas. Ikki nuqtaning qiymatini o'qing va kattasidan kichigini ayiring.",
      ru: 'Пока нет. Прочитай значения двух точек и вычти меньшее из большего.',
      en: 'Not yet. Read the values of the two points and take the smaller from the larger.',
    },
    hintAfter: {
      uz: "Yetti yoshdagi bo'y yetmish besh, uch yoshdagisi qirq santimetr.",
      ru: 'Рост в семь лет семьдесят пять, в три года сорок сантиметров.',
      en: 'The height at seven is seventy five, at three it is forty centimetres.',
    },
    audio: {
      intro: {
        uz: [
          "Monitoring yangi savol berdi: uch yoshdan yetti yoshgacha qancha o'sgan?",
          "Ikki nuqtani o'qing va farqni toping.",
          "Necha santimetr? Javobni tering va tasdiqlang.",
        ],
        ru: [
          'Мониторинг задал новый вопрос: на сколько вырос с трёх до семи лет?',
          'Прочитай две точки и найди разницу.',
          'Сколько сантиметров? Набери ответ и подтверди.',
        ],
        en: [
          'The monitoring asked a new question: by how much did it grow from three to seven years?',
          'Read the two points and find the difference.',
          'How many centimetres? Type the answer and confirm.',
        ],
      },
    },
  },

  s7: {
    eyebrow: { uz: 'Ustunli diagramma', ru: 'Столбчатая диаграмма', en: 'A bar chart' },
    title: {
      uz: 'Ustunlar va shkala',
      ru: 'Столбцы и шкала',
      en: 'Bars and the scale',
    },
    lead: {
      uz: "Ustun balandligi qiymatni bildiradi, shkala esa bitta katak nechaga tengligini aytadi.",
      ru: 'Высота столбца показывает значение, а шкала говорит, чему равна одна клетка.',
      en: 'The height of a bar shows the value, and the scale says what one cell is worth.',
    },
    note: {
      uz: 'Shkalasiz ustunni o\'qib bo\'lmaydi.',
      ru: 'Без шкалы столбец прочитать нельзя.',
      en: 'Without the scale a bar cannot be read.',
    },
    audio: {
      intro: {
        uz: [
          "Ekranga ikkinchi chizma chiqdi: fabrikaning to'rt oylik mahsuloti.",
          "Bu safar nuqta emas, ustunlar. Har ustun bitta oyga tegishli.",
          "Chapdagi shkala har katak necha kilogramm ekanini aytadi.",
          "Mart oyida bir yuz ellik, aprelda ikki yuz, mayda ikki yuz, iyunda yuz kilogramm.",
        ],
        ru: [
          'На экране появился второй чертёж: продукция фабрики за четыре месяца.',
          'На этот раз не точки, а столбцы. Каждый столбец относится к одному месяцу.',
          'Шкала слева говорит, сколько килограммов в одной клетке.',
          'В марте сто пятьдесят, в апреле двести, в мае двести, в июне сто килограммов.',
        ],
        en: [
          'A second chart appeared on the screen: the factory output over four months.',
          'This time there are bars instead of points. Each bar belongs to one month.',
          'The scale on the left says how many kilograms one cell holds.',
          'March one hundred and fifty, April two hundred, May two hundred, June one hundred kilograms.',
        ],
      },
    },
  },

  s8: {
    eyebrow: { uz: 'Terib javob bering', ru: 'Набери ответ', en: 'Type the answer' },
    title: {
      uz: 'To\'rt oyda jami',
      ru: 'Всего за четыре месяца',
      en: 'The total for four months',
    },
    question: {
      uz: 'To\'rt oy davomida jami qancha mahsulot ishlab chiqarilgan?',
      ru: 'Сколько продукции выпущено за четыре месяца?',
      en: 'How much output was produced over the four months?',
    },
    answer: 650,
    unit: { uz: 'kg', ru: 'кг', en: 'kg' },
    correctText: {
      uz: "To'g'ri. Bir yuz ellik, ikki yuz, ikki yuz va yuz birga olti yuz ellik kilogramm.",
      ru: 'Верно. Сто пятьдесят, двести, двести и сто вместе шестьсот пятьдесят килограммов.',
      en: 'Correct. One hundred and fifty, two hundred, two hundred and one hundred make six hundred and fifty kilograms.',
    },
    wrong: {
      uz: "Hali emas. Har ustunning qiymatini shkala bo'yicha o'qing va hammasini qo'shing.",
      ru: 'Пока нет. Прочитай значение каждого столбца по шкале и сложи все.',
      en: 'Not yet. Read the value of each bar by the scale and add them all.',
    },
    hintAfter: {
      uz: "Yumaloq juftni oldin oling: ikki yuz va ikki yuz to'rt yuzni beradi.",
      ru: 'Возьми круглую пару первой: двести и двести дают четыреста.',
      en: 'Take the round pair first: two hundred and two hundred give four hundred.',
    },
    audio: {
      intro: {
        uz: [
          "Fabrika hisoboti yopilishi kerak.",
          "Har ustunni shkala bo'yicha o'qing va hammasini qo'shing.",
          "To'rt oyda jami qancha? Javobni tering va tasdiqlang.",
        ],
        ru: [
          'Отчёт фабрики нужно закрыть.',
          'Прочитай каждый столбец по шкале и сложи все.',
          'Сколько всего за четыре месяца? Набери ответ и подтверди.',
        ],
        en: [
          'The factory report has to be closed.',
          'Read each bar by the scale and add them all.',
          'How much in all over the four months? Type the answer and confirm.',
        ],
      },
    },
  },

  s9: {
    eyebrow: { uz: 'Taqqoslash', ru: 'Сравнение', en: 'Comparison' },
    title: {
      uz: 'Chizma savolga darrov javob beradi',
      ru: 'Чертёж отвечает сразу',
      en: 'A chart answers at once',
    },
    lead: {
      uz: "Eng kam, eng ko'p va teng qiymatlar ustunlarning balandligidan ko'rinadi.",
      ru: 'Наименьшее, наибольшее и равные значения видны по высоте столбцов.',
      en: 'The least, the greatest and the equal values are seen from the heights of the bars.',
    },
    note: {
      uz: 'Bunday savollarga hisoblamasdan javob berish mumkin.',
      ru: 'На такие вопросы можно ответить без вычислений.',
      en: 'Such questions can be answered without calculating.',
    },
    audio: {
      intro: {
        uz: [
          "Darslik uch savol beradi: qaysi oyda eng kam, qaysi oyda eng ko'p va qaysi oylar teng.",
          "Eng past ustun iyun oyida: eng kam mahsulot o'sha oyda.",
          "Eng baland ustunlar aprel va mayda: eng ko'p mahsulot shu ikki oyda.",
          "Aprel va may ustunlari bir xil balandlikda, demak ular teng.",
        ],
        ru: [
          'Учебник задаёт три вопроса: в каком месяце меньше всего, в каком больше всего и какие месяцы равны.',
          'Самый низкий столбец в июне: там меньше всего продукции.',
          'Самые высокие столбцы в апреле и мае: там больше всего продукции.',
          'Столбцы апреля и мая одной высоты, значит они равны.',
        ],
        en: [
          'The textbook asks three questions: which month has the least, which the most and which months are equal.',
          'The lowest bar is June: the least output was there.',
          'The tallest bars are April and May: the most output was in those two months.',
          'The April and May bars are the same height, so they are equal.',
        ],
      },
    },
  },

  s10: {
    eyebrow: { uz: 'Teng oylar', ru: 'Равные месяцы', en: 'Equal months' },
    title: {
      uz: 'Qaysi oylar teng?',
      ru: 'Какие месяцы равны?',
      en: 'Which months are equal?',
    },
    question: {
      uz: 'Qaysi oylarda mahsulot miqdori teng?',
      ru: 'В каких месяцах количество продукции равно?',
      en: 'In which months is the output equal?',
    },
    options: [
      { uz: 'Aprel va may', ru: 'Апрель и май', en: 'April and May' },
      { uz: 'Mart va iyun', ru: 'Март и июнь', en: 'March and June' },
      { uz: 'Mart va aprel', ru: 'Март и апрель', en: 'March and April' },
      { uz: 'May va iyun', ru: 'Май и июнь', en: 'May and June' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Ikkala ustun ham bir xil balandlikda: har birida ikki yuz kilogramm.",
      ru: 'Верно. Оба столбца одной высоты: в каждом двести килограммов.',
      en: 'Correct. Both bars are the same height: two hundred kilograms each.',
    },
    wrong: [
      null,
      {
        uz: "Martda bir yuz ellik, iyunda yuz. Ular teng emas.",
        ru: 'В марте сто пятьдесят, в июне сто. Они не равны.',
        en: 'March has one hundred and fifty, June has one hundred. They are not equal.',
      },
      {
        uz: "Martda bir yuz ellik, aprelda ikki yuz. Ustunlar har xil balandlikda.",
        ru: 'В марте сто пятьдесят, в апреле двести. Столбцы разной высоты.',
        en: 'March has one hundred and fifty, April has two hundred. The bars differ in height.',
      },
      {
        uz: "Mayda ikki yuz, iyunda yuz. Bu ikki barobar farq.",
        ru: 'В мае двести, в июне сто. Это разница в два раза.',
        en: 'May has two hundred, June has one hundred. That is a twofold difference.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Fabrika diagrammasi ekranda turibdi.",
          "Ustunlarning balandligini solishtiring.",
          "Qaysi oylarda mahsulot teng? Javobni tanlang.",
        ],
        ru: [
          'Диаграмма фабрики на экране.',
          'Сравни высоту столбцов.',
          'В каких месяцах продукция равна? Выбери ответ.',
        ],
        en: [
          'The factory chart is on the screen.',
          'Compare the heights of the bars.',
          'In which months is the output equal? Choose an answer.',
        ],
      },
    },
  },

  s11: {
    eyebrow: { uz: 'Yodda tuting', ru: 'Запомни', en: 'Keep in mind' },
    title: {
      uz: 'Chizmani o\'qishning uch qadami',
      ru: 'Три шага чтения чертежа',
      en: 'Three steps for reading a chart',
    },
    lead: {
      uz: 'Har qanday grafik, diagramma va jadval shu tartibda o\'qiladi.',
      ru: 'Любой график, диаграмма и таблица читаются в этом порядке.',
      en: 'Any graph, chart or table is read in this order.',
    },
    audio: {
      intro: {
        uz: [
          "Qoidani yig'amiz. Birinchi qadam: o'qlarni o'qing. Qaysi o'qda qaysi kattalik turibdi?",
          "Ikkinchi qadam: shkalani aniqlang. Bitta katak yoki bitta bo'lim nechaga teng?",
          "Uchinchi qadam: shundan keyingina qiymatni ayting. Shkalani o'tkazib yuborish eng ko'p uchraydigan xato.",
        ],
        ru: [
          'Соберём правило. Первый шаг: прочитай оси. Какая величина на какой оси?',
          'Второй шаг: определи шкалу. Чему равна одна клетка или одно деление?',
          'Третий шаг: только теперь называй значение. Пропустить шкалу это самая частая ошибка.',
        ],
        en: [
          'Let us put the rule together. Step one: read the axes. Which quantity is on which axis?',
          'Step two: find the scale. What is one cell or one division worth?',
          'Step three: only now name the value. Skipping the scale is the commonest error.',
        ],
      },
    },
  },

  s12: {
    eyebrow: { uz: 'Qaysi chizma?', ru: 'Какой чертёж?', en: 'Which chart?' },
    title: {
      uz: 'Qaysi tasvir qulayroq?',
      ru: 'Какое изображение удобнее?',
      en: 'Which representation suits better?',
    },
    question: {
      uz: 'Bo\'yning yildan yilga o\'zgarishi uchun qaysi tasvir qulay?',
      ru: 'Какое изображение удобно для роста год за годом?',
      en: 'Which representation suits height changing year by year?',
    },
    options: [
      { uz: 'Chiziqli grafik', ru: 'Линейный график', en: 'A line graph' },
      { uz: 'Ustunli diagramma', ru: 'Столбчатая диаграмма', en: 'A bar chart' },
      { uz: 'Oddiy ro\'yxat', ru: 'Простой список', en: 'A plain list' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Chiziq uzluksiz o'zgarishni ko'rsatadi: o'sish qayerda tez, qayerda sekin ekani darrov ko'rinadi.",
      ru: 'Верно. Линия показывает непрерывное изменение: сразу видно, где рост быстрый, а где медленный.',
      en: 'Correct. A line shows continuous change: you see at once where growth is fast and where slow.',
    },
    wrong: [
      null,
      {
        uz: "Ustunlar alohida qiymatlarni yaxshi taqqoslaydi, lekin uzluksiz o'zgarishni ko'rsatmaydi.",
        ru: 'Столбцы хорошо сравнивают отдельные значения, но непрерывное изменение не показывают.',
        en: 'Bars compare separate values well, but they do not show continuous change.',
      },
      {
        uz: "Ro'yxatda sonlar bor, lekin o'zgarish ko'rinmaydi: uni o'zingiz hisoblashingiz kerak.",
        ru: 'В списке есть числа, но изменение не видно: его придётся считать самому.',
        en: 'A list has the numbers, but the change is invisible: you would have to work it out yourself.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Monitoring yangi hisobotni tayyorlamoqda.",
          "Bir xil ma'lumotni turli chizma bilan ko'rsatish mumkin, lekin har savolga o'z chizmasi mos keladi.",
          "Bo'yning yildan yilga o'zgarishi uchun qaysi tasvir qulay? Javobni tanlang.",
        ],
        ru: [
          'Мониторинг готовит новый отчёт.',
          'Одни и те же данные можно показать по-разному, но каждому вопросу подходит свой чертёж.',
          'Какое изображение удобно для роста год за годом? Выбери ответ.',
        ],
        en: [
          'The monitoring is preparing a new report.',
          'The same data can be shown in different ways, but each question has its own suitable chart.',
          'Which representation suits height changing year by year? Choose an answer.',
        ],
      },
    },
  },

  s13: {
    eyebrow: { uz: "Bitning yozuvi", ru: 'Запись Bit', en: 'Bit record' },
    title: {
      uz: 'Bit shkalani unutdi',
      ru: 'Bit забыл про шкалу',
      en: 'Bit forgot the scale',
    },
    question: {
      uz: 'Bit kataklarni sanadi. Xato qayerda?',
      ru: 'Bit сосчитал клетки. Где ошибка?',
      en: 'Bit counted the cells. Where is the error?',
    },
    steps: [
      { uz: 'Shkala: 1 katak = 10 kg', ru: 'Шкала: 1 клетка = 10 кг', en: 'Scale: 1 cell = 10 kg' },
      { uz: 'Ustunda 13 katak bor', ru: 'В столбце 13 клеток', en: 'The bar has 13 cells' },
      { uz: 'Bit: ustun 13 kg', ru: 'Bit: столбец 13 кг', en: 'Bit: the bar is 13 kg' },
      { uz: 'Hisobotga 13 kg yozildi', ru: 'В отчёт записано 13 кг', en: '13 kg was written into the report' },
    ],
    options: [
      { uz: "Kataklar soni shkalaga ko'paytirilmagan", ru: 'Число клеток не умножили на шкалу', en: 'The number of cells was not multiplied by the scale' },
      { uz: 'Kataklar noto\'g\'ri sanalgan', ru: 'Клетки сосчитаны неверно', en: 'The cells were counted wrongly' },
      { uz: 'Shkala noto\'g\'ri yozilgan', ru: 'Шкала записана неверно', en: 'The scale was written wrongly' },
      { uz: 'Xato yo\'q', ru: 'Ошибки нет', en: 'There is no error' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. O'n uch katakni o'nga ko'paytirish kerak edi: bir yuz o'ttiz kilogramm.",
      ru: 'Верно. Тринадцать клеток нужно было умножить на десять: сто тридцать килограммов.',
      en: 'Correct. Thirteen cells had to be multiplied by ten: one hundred and thirty kilograms.',
    },
    wrong: [
      null,
      {
        uz: "Kataklar to'g'ri sanalgan: ularning soni o'n uch. Xato keyingi qadamda.",
        ru: 'Клетки сосчитаны верно: их тринадцать. Ошибка на следующем шаге.',
        en: 'The cells were counted right: there are thirteen. The error is at the next step.',
      },
      {
        uz: "Shkala to'g'ri yozilgan va u aynan o'qishga kerak edi.",
        ru: 'Шкала записана верно, и она как раз и нужна была для чтения.',
        en: 'The scale is written correctly, and it is exactly what the reading needed.',
      },
      {
        uz: "Javob shkalani hisobga olmagan, shuning uchun o'n barobar kichik chiqqan.",
        ru: 'Ответ не учёл шкалу, поэтому вышел в десять раз меньше.',
        en: 'The answer ignored the scale, so it came out ten times too small.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Bit diagrammadan qiymat o'qidi va hisobotga yozdi.",
          "Uning to'rt qatori ekranda.",
          "Xato qayerda? Javobni tanlang.",
        ],
        ru: [
          'Bit прочитал значение с диаграммы и записал в отчёт.',
          'Его четыре строки на экране.',
          'Где ошибка? Выбери ответ.',
        ],
        en: [
          'Bit read a value from the chart and wrote it into the report.',
          'His four lines are on the screen.',
          'Where is the error? Choose an answer.',
        ],
      },
    },
  },

  s14: {
    eyebrow: { uz: 'Shahar qarori', ru: 'Решение города', en: 'The city decision' },
    title: {
      uz: 'Qaysi o\'qish qabul qilinadi?',
      ru: 'Какое чтение примут?',
      en: 'Which reading is accepted?',
    },
    question: {
      uz: '1 katak = 10 kg, ustunda 13 katak. Qaysi yozuv to\'g\'ri?',
      ru: '1 клетка = 10 кг, в столбце 13 клеток. Какая запись верна?',
      en: '1 cell = 10 kg, the bar has 13 cells. Which record is right?',
    },
    options: [
      { uz: '13 · 10 = 130 kg', ru: '13 · 10 = 130 кг', en: '13 · 10 = 130 kg' },
      { uz: '13 kg', ru: '13 кг', en: '13 kg' },
      { uz: '13 : 10 = 1 kg', ru: '13 : 10 = 1 кг', en: '13 : 10 = 1 kg' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Kataklar soni shkalaga ko'paytirildi va monitoring hisobotni qabul qildi.",
      ru: 'Верно. Число клеток умножили на шкалу, и мониторинг принял отчёт.',
      en: 'Correct. The number of cells was multiplied by the scale and the monitoring accepted the report.',
    },
    wrong: [
      null,
      {
        uz: "Bu Bitning xatosi: shkala hisobga olinmagan.",
        ru: 'Это ошибка Bit: шкала не учтена.',
        en: 'That is Bit error: the scale was ignored.',
      },
      {
        uz: "Bo'lish qiymatni kichraytiradi. Shkala har katakni kattalashtiradi.",
        ru: 'Деление уменьшает значение. А шкала каждую клетку увеличивает.',
        en: 'Division makes the value smaller. But the scale makes each cell larger.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Monitoring uchta yozuvni ko'rib chiqmoqda.",
          "Shkala aytadi: bitta katak o'n kilogramm. Ustunda o'n uch katak bor.",
          "Qaysi yozuv to'g'ri? Javobni tanlang.",
        ],
        ru: [
          'Мониторинг рассматривает три записи.',
          'Шкала говорит: одна клетка десять килограммов. В столбце тринадцать клеток.',
          'Какая запись верна? Выбери ответ.',
        ],
        en: [
          'The monitoring is looking at three records.',
          'The scale says one cell is ten kilograms. The bar has thirteen cells.',
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
      uz: "Qoidani tanlang va chizmani o'qishni tushunganingizni ko'rsating.",
      ru: 'Выбери правило и покажи, что понимаешь чтение чертежа.',
      en: 'Choose the rule and show that you understand how a chart is read.',
    },
    questionKicker: { uz: 'YAKUNIY SAVOL', ru: 'ФИНАЛЬНЫЙ ВОПРОС', en: 'FINAL QUESTION' },
    stepLabel: { uz: '1 QADAM', ru: '1 ШАГ', en: '1 STEP' },
    reflectionQuestion: {
      uz: 'Qiymatni aytishdan oldin nima aniqlanadi?',
      ru: 'Что определяют прежде, чем назвать значение?',
      en: 'What is found before naming a value?',
    },
    reflectionStart: {
      uz: 'Bitta javobni tanlang.',
      ru: 'Выбери один ответ.',
      en: 'Choose one answer.',
    },
    reflectionOptions: [
      { uz: "O'qlar va shkala", ru: 'Оси и шкала', en: 'The axes and the scale' },
      { uz: 'Chizmaning rangi', ru: 'Цвет чертежа', en: 'The colour of the chart' },
      { uz: 'Nuqtalar soni', ru: 'Число точек', en: 'The number of points' },
    ],
    reflectionCorrectIndex: 0,
    reflectionCorrect: {
      uz: 'Shunday. Shkalasiz o\'qilgan son o\'n barobar xato bo\'lishi mumkin.',
      ru: 'Именно так. Число, прочитанное без шкалы, может ошибаться в десять раз.',
      en: 'Exactly. A number read without the scale can be ten times wrong.',
    },
    reflectionWrong: {
      uz: "Hali emas. Bitning ikkala xatosini eslang: o'q va shkala.",
      ru: 'Пока нет. Вспомни обе ошибки Bit: ось и шкала.',
      en: 'Not yet. Remember both of Bit errors: the axis and the scale.',
    },
    rewardAnnounce: { uz: 'Unvon olindi:', ru: 'Звание получено:', en: 'Title earned:' },
    mainLabel: { uz: 'Darsning to\'rt qoidasi', ru: 'Четыре правила урока', en: 'The four rules of the lesson' },
    main: [
      { uz: "Avval o'qlarni o'qiymiz: qaysi kattalik qayerda.", ru: 'Сначала читаем оси: какая величина где.', en: 'First read the axes: which quantity is where.' },
      { uz: "Keyin shkalani aniqlaymiz: bitta katak nechaga teng.", ru: 'Затем определяем шкалу: чему равна одна клетка.', en: 'Then find the scale: what one cell is worth.' },
      { uz: 'Faqat shundan keyin qiymat aytiladi.', ru: 'Только после этого называют значение.', en: 'Only then is the value named.' },
      { uz: "Farqni topish uchun ikki qiymatni o'qib ayiramiz.", ru: 'Чтобы найти разницу, читают два значения и вычитают.', en: 'To find a difference, read two values and subtract.' },
    ],
    awards: [
      {
        min: 6,
        title: { uz: 'Monitoring ustasi', ru: 'Мастер мониторинга', en: 'Monitoring master' },
        text: { uz: 'Barcha oltita vazifa birinchi urinishda yechildi.', ru: 'Все шесть заданий решены с первой попытки.', en: 'All six tasks were solved on the first attempt.' },
      },
      {
        min: 4,
        title: { uz: 'Chizma o\'quvchisi', ru: 'Чтец чертежей', en: 'Chart reader' },
        text: { uz: "Siz o'q va shkalani ishonchli ajratasiz.", ru: 'Ты уверенно различаешь ось и шкалу.', en: 'You tell an axis from a scale with confidence.' },
      },
      {
        min: 0,
        title: { uz: 'Ekran xodimi', ru: 'Сотрудник экрана', en: 'Screen clerk' },
        text: { uz: "Asos qo'yildi. Qoidani takrorlab, natijani yaxshilashga harakat qiling.", ru: 'Основа заложена. Повтори правило и попробуй улучшить результат.', en: 'The base is laid. Repeat the rule and try to improve the result.' },
      },
    ],
    nextLabel: { uz: 'Keyingi missiya', ru: 'Следующая миссия', en: 'Next mission' },
    nextText: {
      uz: "Chizmalar o'qildi. Endi oltala hudud bir vaqtda bog'lanadi: yakuniy missiya boshlanadi.",
      ru: 'Чертежи прочитаны. Теперь все шесть районов соединяются разом: начинается финальная миссия.',
      en: 'The charts are read. Now all six districts connect at once: the final mission begins.',
    },
    audio: {
      intro: {
        uz: [
          "Monitoring ekrani hisobotni yopdi: barcha chizmalar to'g'ri o'qildi.",
          "Endi bitta savol qoldi. Qoidani tanlang va unvonni oling.",
          "Qiymatni aytishdan oldin nima aniqlanadi? Javobni tanlang.",
        ],
        ru: [
          'Экран мониторинга закрыл отчёт: все чертежи прочитаны верно.',
          'Остался один вопрос. Выбери правило и получи звание.',
          'Что определяют прежде, чем назвать значение? Выбери ответ.',
        ],
        en: [
          'The monitoring screen closed the report: every chart was read correctly.',
          'One question is left. Choose the rule and claim your title.',
          'What is found before naming a value? Choose an answer.',
        ],
      },
    },
  },
};

// ---------------------------------------------------------------------------
// CHIZMALAR
//
// Darsning tayanchi — CHIZMANING O'ZI: o'qlar, shkala, nuqtalar va ustunlar.
// Yordamchi chiziqlar faqat kerakli kadrda paydo bo'ladi va aynan o'qish
// yo'lini ko'rsatadi: o'qdan yuqoriga, keyin nuqtadan chapga.
// ---------------------------------------------------------------------------

const GROWTH = [
  { age: 1, cm: 20 }, { age: 2, cm: 30 }, { age: 3, cm: 40 }, { age: 4, cm: 50 },
  { age: 5, cm: 60 }, { age: 6, cm: 70 }, { age: 7, cm: 75 }, { age: 8, cm: 75 },
];
const MONTHS = [
  { key: 'mart', kg: 150 }, { key: 'aprel', kg: 200 }, { key: 'may', kg: 200 }, { key: 'iyun', kg: 100 },
];

// Grafik maydonining o'lchamlari (barcha ekranlarda bir xil).
const GX0 = 84;
const GX1 = 592;
const GY0 = 34;
const GY1 = 186;
const gxAt = (age) => GX0 + ((age - 1) / 7) * (GX1 - GX0);
const gyAt = (cm) => GY1 - (cm / 80) * (GY1 - GY0);

// s0..s6: o'sish grafigi. `mark` — belgilanadigan yosh, `guide` — yordamchi
// chiziqlar yo'nalishi: 'up' (yoshdan bo'yga) yoki 'left' (bo'ydan yoshga).
const LineGraph = ({ mark = null, guide = null, span = null, frame = 9, wrongRead = false }) => {
  const t = useT();
  const point = mark !== null ? GROWTH.find((item) => item.age === mark) : null;
  return (
    <FitSvg viewBox="0 0 660 230">
      {/* to'r */}
      {[0, 20, 40, 60, 80].map((cm) => (
        <g key={cm}>
          <line x1={GX0} y1={gyAt(cm)} x2={GX1} y2={gyAt(cm)} stroke="rgba(23,59,82,.10)" strokeWidth="1" />
          <text x={GX0 - 12} y={gyAt(cm) + 5} textAnchor="end" fill={T.ink3} fontSize="12" fontWeight="700" fontFamily="JetBrains Mono, monospace">
            {cm}
          </text>
        </g>
      ))}
      {GROWTH.map((item) => (
        <text key={item.age} x={gxAt(item.age)} y={GY1 + 22} textAnchor="middle" fill={T.ink3} fontSize="12" fontWeight="700" fontFamily="JetBrains Mono, monospace">
          {item.age}
        </text>
      ))}
      <line x1={GX0} y1={GY0 - 8} x2={GX0} y2={GY1} stroke={T.ink2} strokeWidth="2" />
      <line x1={GX0} y1={GY1} x2={GX1 + 10} y2={GY1} stroke={T.ink2} strokeWidth="2" />
      <text x={GX0 - 46} y={GY0 - 12} fill={T.cyan} fontSize="12" fontWeight="800" fontFamily="Manrope, sans-serif">
        {t({ uz: "bo'y, cm", ru: 'рост, см', en: 'height, cm' })}
      </text>
      <text x={GX1 - 24} y={GY1 + 42} fill={T.cyan} fontSize="12" fontWeight="800" fontFamily="Manrope, sans-serif">
        {t({ uz: 'yosh', ru: 'возраст', en: 'age' })}
      </text>

      {/* chiziq va nuqtalar */}
      <polyline
        points={GROWTH.map((item) => `${gxAt(item.age)},${gyAt(item.cm)}`).join(' ')}
        fill="none"
        stroke={T.cyan}
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      {GROWTH.map((item) => (
        <circle key={item.age} cx={gxAt(item.age)} cy={gyAt(item.cm)} r="4.4" fill={T.cyan} />
      ))}

      {/* yordamchi chiziqlar */}
      {point && frame >= 2 && (
        <g>
          {guide !== 'left' && (
            <line x1={gxAt(point.age)} y1={GY1} x2={gxAt(point.age)} y2={gyAt(point.cm)} stroke={T.accent} strokeWidth="2" strokeDasharray="6 5" />
          )}
          {frame >= 3 && (
            <line x1={GX0} y1={gyAt(point.cm)} x2={gxAt(point.age)} y2={gyAt(point.cm)} stroke={T.accent} strokeWidth="2" strokeDasharray="6 5" />
          )}
          <circle cx={gxAt(point.age)} cy={gyAt(point.cm)} r="8" fill="none" stroke={T.accent} strokeWidth="2.6" />
        </g>
      )}

      {/* ikki nuqta orasidagi farq */}
      {span && frame >= 2 && (
        <g>
          {span.map((age) => {
            const item = GROWTH.find((row) => row.age === age);
            return <circle key={age} cx={gxAt(age)} cy={gyAt(item.cm)} r="8" fill="none" stroke={T.success} strokeWidth="2.6" />;
          })}
          {frame >= 3 && (
            <line
              x1={gxAt(span[1]) + 22}
              y1={gyAt(GROWTH.find((row) => row.age === span[0]).cm)}
              x2={gxAt(span[1]) + 22}
              y2={gyAt(GROWTH.find((row) => row.age === span[1]).cm)}
              stroke={T.success}
              strokeWidth="2.4"
            />
          )}
        </g>
      )}

      {wrongRead && (
        <g>
          <circle cx={gxAt(3)} cy={gyAt(3)} r="7" fill={T.accentSoft} stroke={T.accent} strokeWidth="2.4" />
          <Caption x={gxAt(3) + 70} y={gyAt(3) + 4} text={t({ uz: "Bit shu yerni o'qigan", ru: 'Bit прочитал здесь', en: 'Bit read here' })} tone={T.accent} size={12} />
        </g>
      )}
    </FitSvg>
  );
};

// s7..s10: ustunli diagramma. `equalPair` — teng ustunlarni belgilash.
const BarChart = ({ frame = 9, equalPair = null, showTotal = false }) => {
  const t = useT();
  const x0 = 110;
  const barW = 74;
  const gap = 42;
  const baseY = 178;
  const scale = 0.62;
  const names = {
    mart: t({ uz: 'mart', ru: 'март', en: 'March' }),
    aprel: t({ uz: 'aprel', ru: 'апрель', en: 'April' }),
    may: t({ uz: 'may', ru: 'май', en: 'May' }),
    iyun: t({ uz: 'iyun', ru: 'июнь', en: 'June' }),
  };
  return (
    <FitSvg viewBox="0 0 660 230">
      {[0, 50, 100, 150, 200].map((kg) => (
        <g key={kg}>
          <line x1={x0 - 14} y1={baseY - kg * scale} x2={600} y2={baseY - kg * scale} stroke="rgba(23,59,82,.10)" strokeWidth="1" />
          <text x={x0 - 22} y={baseY - kg * scale + 5} textAnchor="end" fill={T.ink3} fontSize="12" fontWeight="700" fontFamily="JetBrains Mono, monospace">
            {kg}
          </text>
        </g>
      ))}
      <line x1={x0 - 14} y1={GY0 - 6} x2={x0 - 14} y2={baseY} stroke={T.ink2} strokeWidth="2" />
      <line x1={x0 - 14} y1={baseY} x2={606} y2={baseY} stroke={T.ink2} strokeWidth="2" />
      <text x={x0 - 60} y={GY0 - 10} fill={T.cyan} fontSize="12" fontWeight="800" fontFamily="Manrope, sans-serif">
        {t({ uz: 'kg', ru: 'кг', en: 'kg' })}
      </text>

      {MONTHS.map((item, index) => {
        const x = x0 + index * (barW + gap);
        const height = item.kg * scale;
        const lit = equalPair !== null && equalPair.includes(index);
        return (
          <g key={item.key} opacity={frame >= index + 1 ? 1 : 0.24}>
            <rect
              x={x}
              y={baseY - height}
              width={barW}
              height={height}
              rx="7"
              fill={lit ? 'rgba(149,201,61,.30)' : T.cyanSoft}
              stroke={lit ? T.lime : T.cyan}
              strokeWidth={lit ? 2.6 : 1.8}
            />
            <text x={x + barW / 2} y={baseY - height - 9} textAnchor="middle" fill={lit ? '#4C6B18' : T.cyan} fontSize="15" fontWeight="800" fontFamily="JetBrains Mono, monospace">
              {item.kg}
            </text>
            <text x={x + barW / 2} y={baseY + 20} textAnchor="middle" fill={T.ink3} fontSize="12" fontWeight="750" fontFamily="Manrope, sans-serif">
              {names[item.key]}
            </text>
          </g>
        );
      })}
      {frame >= 3 && (
        <Caption x={168} y={222} text={`${t({ uz: "bir bo'lim", ru: 'одно деление', en: 'one division' })} = 50 kg`} tone={T.cyan} size={12} />
      )}
      {showTotal && (
        <Caption x={452} y={222} text={`${t({ uz: 'jami', ru: 'всего', en: 'in all' })}: 650 kg`} tone={T.success} />
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
          head: t({ uz: "O'qlarni o'qing", ru: 'Прочитайте оси', en: 'Read the axes' }),
          body: t({ uz: "qaysi kattalik gorizontal, qaysi biri vertikal o'qda", ru: 'какая величина на горизонтальной, какая на вертикальной оси', en: 'which quantity is on the horizontal and which on the vertical axis' }),
          formula: null,
        },
        {
          tone: T.accent,
          head: t({ uz: 'Shkalani aniqlang', ru: 'Определите шкалу', en: 'Find the scale' }),
          body: t({ uz: "bitta katak yoki bo'lim nechaga teng", ru: 'чему равна одна клетка или деление', en: 'what one cell or division is worth' }),
          formula: null,
        },
        {
          tone: T.success,
          head: t({ uz: 'Qiymatni ayting', ru: 'Назовите значение', en: 'Name the value' }),
          body: t({ uz: "faqat shundan keyin, farq kerak bo'lsa ayiring", ru: 'только после этого, а для разницы вычтите', en: 'only then, and subtract if a difference is needed' }),
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
            <span>LUMO CITY · BOSHQARUV MARKAZI · MONITORING EKRANI</span>
            <span className={solved ? 'hero-state' : 'hero-state hero-state-alert'}>
              {solved ? 'TUZATILDI' : 'HISOBOT'}
            </span>
          </div>
          <div className="hero-body">
            <div className="d50-hero-row">
              <div className="d50-hero-graph">
                <LineGraph mark={3} guide="up" frame={solved ? 3 : 1} wrongRead={!solved} />
              </div>
              <div className="d50-hero-bit" aria-hidden="true"><BitSVG state={solved ? 'nod' : 'awkward'} /></div>
            </div>
          </div>
          <div className="d50-hero-note">
            {solved
              ? t({ uz: "3 yoshda bo'y 40 cm", ru: 'в 3 года рост 40 см', en: 'at 3 years the height is 40 cm' })
              : t({ uz: "Bit yozdi: 3 yoshda bo'y 3 cm", ru: 'Bit написал: в 3 года рост 3 см', en: 'Bit wrote: at 3 years the height is 3 cm' })}
          </div>
        </div>
      )}
    />
  );
};
const Screen1 = (props) => <RevealScreen {...props} ratio="66 / 23" figure={({ frame }) => <LineGraph frame={frame} mark={3} guide="up" />} />;
const Screen2 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={1}
    ratio="66 / 23"
    figure={({ solved }) => <LineGraph mark={3} guide="up" frame={solved ? 3 : 1} />}
  />
);
const Screen3 = (props) => <RevealScreen {...props} ratio="66 / 23" figure={({ frame }) => <LineGraph frame={frame} mark={6} guide="left" />} />;
const Screen4 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={1}
    ratio="66 / 23"
    figure={({ solved }) => <LineGraph mark={4} guide="left" frame={solved ? 3 : 1} />}
  />
);
const Screen5 = (props) => <RevealScreen {...props} ratio="66 / 23" figure={({ frame }) => <LineGraph frame={frame} span={[1, 3]} />} />;
const Screen6 = (props) => (
  <NumPadScreen
    {...props}
    ratio="66 / 23"
    figure={({ solved }) => <LineGraph span={[3, 7]} frame={solved ? 3 : 2} />}
  />
);
const Screen7 = (props) => <RevealScreen {...props} ratio="66 / 23" figure={({ frame }) => <BarChart frame={frame} />} />;
const Screen8 = (props) => (
  <NumPadScreen
    {...props}
    ratio="66 / 23"
    figure={({ solved }) => <BarChart frame={9} showTotal={solved} />}
  />
);
const Screen9 = (props) => (
  <RevealScreen {...props} ratio="66 / 23" figure={({ frame }) => <BarChart frame={9} equalPair={frame >= 3 ? [1, 2] : null} />} />
);
const Screen10 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={4}
    ratio="66 / 23"
    figure={({ solved }) => <BarChart frame={9} equalPair={solved ? [1, 2] : null} />}
  />
);
const Screen11 = (props) => <RevealScreen {...props} plain ratio="auto" figure={({ frame }) => <RuleCard frame={frame} />} />;
const Screen12 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={5}
    ratio="66 / 23"
    figure={() => <LineGraph frame={1} />}
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
            uz: 'Birinchi qatorga qayting: shkala qayerda ishlatildi?',
            ru: 'Вернись к первой строке: где была использована шкала?',
            en: 'Go back to the first line: where was the scale used?',
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
        records={['13 · 10 = 130 kg', '13 kg', '13 : 10 = 1 kg']}
        picked={picked}
        solved={solved}
        correctIndex={0}
        width={720}
        cardW={210}
        cardH={92}
        gap={24}
        top={34}
        size={17}
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
/* Hook ekranida sahna uch qatorli: sarlavha, chizma va izoh. Kit dagi ikki
   qatorli grid uchinchi bolani yashirin qatorga tashlaydi va chizma qatori
   nolga siqiladi — shuning uchun qatorlar shu darsda qayta e'lon qilinadi. */
.hero-scene { grid-template-rows: auto minmax(0, 1fr) auto; }
.d50-hero-row {
  width: 100%;
  height: 100%;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 56px;
  gap: 10px;
  align-items: center;
}
.d50-hero-graph {
  width: 100%;
  height: 100%;
  min-height: 0;
  padding: 6px 10px;
  border-radius: 16px;
  background: rgba(247,251,245,.94);
}
.d50-hero-graph svg { width: 100%; height: 100%; }
.d50-hero-note {
  text-align: center;
  color: #9DE3E7;
  font-size: clamp(10px, 1.2vw, 12px);
  font-weight: 750;
}
.d50-hero-bit { width: 56px; height: 100%; max-height: 70px; pointer-events: none; }
.d50-hero-bit svg { width: 100%; height: 100%; }
/* Telefonda karta biroz balandroq: 366 px kenglikda 30/11 nisbati chizmaga
   atigi o'n ikki piksel qoldiradi. Faqat hook kartasi kattalashadi.
   !important kerak: nisbat ModelCard dan inline style bilan keladi, inline
   esa oddiy qoidadan kuchli. */
@media (max-width: 639.98px) {
  .model-card:has(.hero-scene) { --g4-model-ratio: 30 / 17 !important; }
}
`;

export default function Grade4Dars50(props) {
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
