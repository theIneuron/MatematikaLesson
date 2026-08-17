// ============================================================
// 6 КЛАСС, УРОК 39 «Площадь круга»
// Собран по context/GRADE6_ETALON.md на общем слое ./screens.jsx.
//
// Блок Б11, первый урок. Формула S = пи r в квадрате получается тем же
// приёмом, что и длина в уроке 38: на клетчатом поле видно, что в круг
// укладывается чуть больше трёх квадратов со стороной r. Отдельный
// экран отдан тому, что при удвоении радиуса площадь растёт вчетверо.
//
// Сцена — школьная пекарня, круглые лепёшки на противне.
// ============================================================

// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from 'react';
import {
  T,
  configureLesson,
  registerLesson,
  navLocked,
  tri,
  pickL,
  mt,
  LangContext,
  useLang,
  useT,
  useMobileZoom,
  useAudio,
  getAudioEngine,
  PREVIEW_START,
  BASE_STYLES,
  Stage,
  Person,
  NavBack,
  NavNext,
  NextLabel,
  BackLabel,
  HintBlock,
  FeedbackBlock,
  FactCard,
  FB_SCI,
  AnimDigits,
  MethodCard,
  HookScreen,
  RevealScreen,
  RuleScreen,
  Classify,
  MultiTask,
  FinalPanel,
  SummaryScreen,
} from './screens.jsx';

const TOTAL_SCREENS = 15;

const LESSON_META = {
  lessonId: 'grade6-39',
  lessonTitle: {
    ru: 'Площадь круга',
    uz: 'Doira yuzi',
    en: 'The area of a disc',
  },
};

const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',    scored: false, scope: 'hook' },     //  1 novvoyxona: ikki non
  { id: 's_recall', type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  2 yuza va sonning kvadrati
  { id: 's_core',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  3 katakli maydon: uchtadan sal ko'p
  { id: 's_tool',   type: 'exploration', template: 'custom',        scored: false, scope: null },       //  4 USUL: S = pi r kvadrat
  { id: 's_half',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  5 diametr orqali, yarim doira va halqa
  { id: 's_solve',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  6 birga yechamiz: ikki non
  { id: 's_edge',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  7 chegara: uzunlik va yuza
  { id: 's_rule',   type: 'rule',        template: 'RuleScreen',    scored: false, scope: null },       //  8 QOIDA + xukka qaytish
  { id: 's_area',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, //  9 yuzani topish x3
  { id: 's_more',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 10 diametr, yarim doira x4
  { id: 's_bins',   type: 'test',        template: 'Classify',      scored: true,  scope: 'practice' }, // 11 savatlar: uzunlikmi yoki yuzami
  { id: 's_error',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_task',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 13 MASALA: novvoyxona
  { id: 's_final',  type: 'test',        template: 'FinalPanel',    scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',      type: 'summary',     template: 'SummaryScreen', scored: false, scope: null },       // 15 xulosa
];

registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

const CONTENT = {
  s_hook: {
    eyebrow: { ru: 'Зачем это нужно', uz: 'Bu nimaga kerak', en: 'Why you need this' },
    title: { ru: 'Две лепёшки', uz: 'Ikkita non', en: 'Two flatbreads' },
    lead: {
      ru: 'Маленькая лепёшка 20 см в поперечнике, большая 40 см. Обе посыпают кунжутом.',
      uz: "Kichik non 20 sm, kattasi 40 sm. Ikkalasiga ham kunjut sepiladi.",
      en: 'A small flatbread is 20 cm across, a big one 40 cm. Both get sesame on top.',
    },
    voice_a: { ru: 'Санжар: кунжута нужно вдвое больше.', uz: "Sanjar: kunjut ikki barobar ko'p kerak.", en: 'Sanjar: twice as much sesame.' },
    voice_b: { ru: 'Дилноза: вчетверо больше.', uz: "Dilnoza: to'rt barobar ko'p.", en: 'Dilnoza: four times as much.' },
    ask: { ru: 'Во сколько раз большая лепёшка больше по площади?', uz: "Katta non yuzi bo'yicha necha barobar katta?", en: 'How many times bigger is the big one in area?' },
    options: [
      { ru: 'в 2 раза', uz: '2 barobar', en: 'twice' },
      { ru: 'в 4 раза', uz: '4 barobar', en: 'four times' },
    ],
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: 'Variantlardan birini bosing. Javobni dars davomida tekshiramiz.',
      en: 'Tap one of the options. We will check the answer during the lesson.',
    },
    audio: {
      intro: {
        ru: [
          'В школьной пекарне пекут круглые лепёшки. Маленькая двадцать сантиметров в поперечнике, большая сорок. Обе сверху посыпают кунжутом.',
          'Санжар говорит, что на большую кунжута уйдёт вдвое больше, ведь она вдвое шире. Дилноза отвечает, что вчетверо. Во сколько раз большая лепёшка больше по площади? Выбери ответ. Проверим его по ходу урока.',
        ],
        uz: [
          "Maktab novvoyxonasida dumaloq nonlar yopiladi. Kichigi yigirma santimetr, kattasi qirq santimetr. Ikkalasining ustiga ham kunjut sepiladi.",
          "Sanjar katta nonga kunjut ikki barobar ko'p ketadi deydi, axir u ikki barobar keng. Dilnoza esa to'rt barobar deb javob beradi. Katta non yuzi bo'yicha necha barobar katta? Javobni tanlang. Uni dars davomida tekshiramiz.",
        ],
        en: [
          'The school bakery makes round flatbreads. The small one is twenty centimetres across, the big one forty. Both are sprinkled with sesame.',
          'Sanjar says the big one needs twice as much sesame since it is twice as wide. Dilnoza answers four times. How many times bigger is the big one in area? Choose an answer. We will check it during the lesson.',
        ],
      },
    },
  },

  s_recall: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslaymiz', en: 'Recall' },
    title: { ru: 'Площадь и квадрат числа', uz: 'Yuza va sonning kvadrati', en: 'Area and the square of a number' },
    done: {
      ru: 'Площадь измеряют квадратиками. У квадрата со стороной a площадь равна a · a, это и называют квадратом числа.',
      uz: "Yuza kvadratchalar bilan o'lchanadi. Tomoni a bo'lgan kvadratning yuzi a · a ga teng, buni sonning kvadrati deb atashadi.",
      en: 'Area is measured in little squares. A square with side a has area a · a, and that is called the square of a number.',
    },
    audio: {
      ru: [
        'Вспомним площадь. Её измеряют квадратиками: сколько квадратных сантиметров помещается внутри фигуры.',
        'У прямоугольника площадь равна произведению сторон. У квадрата обе стороны одинаковые, поэтому площадь равна а умножить на а. Такое произведение называют квадратом числа.',
        'Например, квадрат числа пять это двадцать пять, а квадрат числа десять это сто. Сегодня это пригодится.',
      ],
      uz: [
        "Yuzani eslaymiz. U kvadratchalar bilan o'lchanadi: shakl ichiga nechta kvadrat santimetr joylashadi.",
        "To'g'ri to'rtburchakning yuzi tomonlar ko'paytmasiga teng. Kvadratning ikkala tomoni bir xil, shuning uchun yuzi a kara a ga teng. Bunday ko'paytmani sonning kvadrati deb atashadi.",
        "Masalan, besh sonining kvadrati yigirma besh, o'n sonining kvadrati esa yuz. Bugun bu asqotadi.",
      ],
      en: [
        'Recall area. It is measured in little squares: how many square centimetres fit inside a shape.',
        'A rectangle’s area is the product of its sides. A square has equal sides, so its area is a times a. Such a product is called the square of a number.',
        'For example, the square of five is twenty five and the square of ten is one hundred. That will be useful today.',
      ],
    },
  },

  s_core: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Сколько квадратиков в круге', uz: 'Doirada nechta kvadratcha bor', en: 'How many squares fit in a disc' },
    lines: [
      { ru: 'строим квадрат со стороной r', uz: "tomoni r bo'lgan kvadrat quramiz", en: 'build a square with side r' },
      { ru: 'в круг таких квадратов входит чуть больше трёх', uz: "doiraga bunday kvadratlardan uchtadan sal ko'p sig'adi", en: 'a bit more than three of them fit in the disc' },
      { ru: 'это снова π: S = πr²', uz: 'bu yana π: S = πr²', en: 'that is π again: S = πr²' },
    ],
    done: {
      ru: 'Круг занимает примерно 3,14 квадрата со стороной r. Отсюда площадь равна π умножить на r в квадрате.',
      uz: "Doira tomoni r bo'lgan taxminan 3,14 ta kvadratni egallaydi. Bundan yuza π kara r kvadratga teng.",
      en: 'A disc takes up about 3.14 squares of side r. Hence the area is π times r squared.',
    },
    audio: {
      ru: [
        'Положим круг на клетчатое поле и построим в углу квадрат со стороной, равной радиусу.',
        'Теперь посмотрим, сколько таких квадратов помещается в круге. Один, два, три и ещё небольшой кусочек. Считать клетки можно долго, но каждый раз выходит примерно три и четырнадцать сотых квадрата.',
        'Это снова число пи, то самое, что было в прошлом уроке. Значит площадь круга равна пи умножить на радиус в квадрате.',
      ],
      uz: [
        "Doirani katakli maydonga qo'yamiz va burchakda tomoni radiusga teng kvadrat quramiz.",
        "Endi doiraga bunday kvadratlardan nechtasi sig'ishiga qaraymiz. Bir, ikki, uch va yana kichik bir bo'lak. Kataklarni uzoq sanash mumkin, lekin har safar taxminan uch butun yuzdan o'n to'rt kvadrat chiqadi.",
        "Bu yana o'sha pi soni, o'tgan darsdagi. Demak doira yuzi pi kara radius kvadratga teng.",
      ],
      en: [
        'Put the disc on squared paper and build a square in the corner with the side equal to the radius.',
        'Now see how many such squares fit inside the disc. One, two, three and a small piece more. Counting cells takes a while, but it always comes to about three point one four squares.',
        'That is the number pi again, the same as last lesson. So the area of a disc is pi times the radius squared.',
      ],
    },
  },

  s_tool: {
    eyebrow: { ru: 'Смотри и повтори', uz: 'Qarang va takrorlang', en: 'Watch, then try' },
    title: { ru: 'Сначала квадрат, потом π', uz: 'Avval kvadrat, keyin π', en: 'Square first, then π' },
    demo_banner: { ru: 'Смотри — покажу на примере', uz: "Qarang — misolda ko'rsataman", en: 'Watch — I will show an example' },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    demo_lines: [
      { ru: 'радиус 10 см', uz: 'radius 10 sm', en: 'radius 10 cm' },
      { ru: 'сначала квадрат радиуса: 10 · 10 = 100', uz: 'avval radius kvadrati: 10 · 10 = 100', en: 'first the radius squared: 10 · 10 = 100' },
      { ru: 'потом на π: 3,14 · 100 = 314 см²', uz: 'keyin π ga: 3,14 · 100 = 314 sm²', en: 'then times π: 3.14 · 100 = 314 cm²' },
    ],
    demo_note: {
      ru: 'Порядок важен: сначала радиус умножаем сам на себя, и только потом на π.',
      uz: "Tartib muhim: avval radiusni o'ziga ko'paytiramiz, keyingina π ga.",
      en: 'Order matters: first multiply the radius by itself, only then by π.',
    },
    play_ask: { ru: 'Радиус 5 см. Чему равна площадь круга?', uz: 'Radius 5 sm. Doira yuzi nechaga teng?', en: 'Radius 5 cm. What is the area?' },
    play_opts: ['78,5 см²', '31,4 см²', '15,7 см²'],
    play_correct: 0,
    play_ok: {
      ru: 'Верно. 5 · 5 = 25, потом 3,14 · 25 = 78,5 см².',
      uz: "To'g'ri. 5 · 5 = 25, keyin 3,14 · 25 = 78,5 sm².",
      en: 'Right. 5 · 5 = 25, then 3.14 · 25 = 78.5 cm².',
    },
    play_wrong: [
      null,
      { ru: 'Радиус не возвели в квадрат: 3,14 · 10 это длина, а не площадь.', uz: "Radius kvadratga ko'tarilmagan: 3,14 · 10 bu uzunlik, yuza emas.", en: 'The radius was not squared: 3.14 · 10 is a length, not an area.' },
      { ru: 'Это длина окружности радиуса 2,5, а нужна площадь.', uz: "Bu radiusi 2,5 bo'lgan aylana uzunligi, yuza kerak esa.", en: 'That is a circumference, but the area is needed.' },
    ],
    audio: {
      intro: {
        ru: 'Покажу расчёт на примере. Радиус круга десять сантиметров.',
        uz: "Hisobni misolda ko'rsataman. Doira radiusi o'n santimetr.",
        en: 'I will show the calculation on an example. The radius is ten centimetres.',
      },
      demo: {
        ru: 'Сначала строим квадрат радиуса: десять умножить на десять это сто. Это площадь одного квадратика со стороной радиус. Теперь умножаем на пи: три целых четырнадцать сотых умножить на сто это триста четырнадцать квадратных сантиметров. Порядок важен: сначала квадрат, потом пи.',
        uz: "Avval radius kvadratini quramiz: o'n kara o'n yuz. Bu tomoni radiusga teng bitta kvadratchaning yuzi. Endi pi ga ko'paytiramiz: uch butun yuzdan o'n to'rt kara yuz uch yuz o'n to'rt kvadrat santimetr. Tartib muhim: avval kvadrat, keyin pi.",
        en: 'First build the radius square: ten times ten is one hundred. That is the area of one square with side equal to the radius. Now multiply by pi: three point one four times one hundred is three hundred fourteen square centimetres. Order matters: square first, then pi.',
      },
      play: {
        ru: 'Теперь ваша очередь. Радиус пять сантиметров. Чему равна площадь круга?',
        uz: 'Endi sizning navbatingiz. Radius besh santimetr. Doira yuzi nechaga teng?',
        en: 'Now it is your turn. The radius is five centimetres. What is the area?',
      },
      ok: {
        ru: 'Верно. Пять на пять двадцать пять, потом умножаем на пи.',
        uz: "To'g'ri. Besh kara besh yigirma besh, keyin pi ga ko'paytiramiz.",
        en: 'Right. Five times five is twenty five, then multiply by pi.',
      },
      wrong: {
        ru: 'Сначала умножьте радиус сам на себя, и только потом на пи.',
        uz: "Avval radiusni o'ziga ko'paytiring, keyingina pi ga.",
        en: 'First multiply the radius by itself, only then by pi.',
      },
    },
  },

  s_half: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'По диаметру, половина и кольцо', uz: 'Diametr orqali, yarmi va halqa', en: 'From the diameter, halves and rings' },
    lines: [
      { ru: 'дан диаметр: сначала r = d : 2', uz: "diametr berilgan: avval r = d : 2", en: 'diameter given: first r = d : 2' },
      { ru: 'полкруга — половина площади', uz: 'yarim doira — yuzning yarmi', en: 'a half disc is half the area' },
      { ru: 'кольцо — большой круг минус маленький', uz: 'halqa — katta doira minus kichigi', en: 'a ring is the big disc minus the small one' },
    ],
    done: {
      ru: 'Формула всегда просит радиус. Если дан диаметр, его сначала делят пополам, иначе площадь выйдет вчетверо больше.',
      uz: "Formula har doim radiusni so'raydi. Diametr berilgan bo'lsa, avval teng ikkiga bo'linadi, aks holda yuza to'rt barobar katta chiqadi.",
      en: 'The formula always wants the radius. If the diameter is given, halve it first, otherwise the area comes out four times too big.',
    },
    audio: {
      ru: [
        'В задачах часто дают не радиус, а диаметр. Тогда первым делом делим его пополам, и только потом считаем площадь.',
        'Половина круга занимает половину площади: посчитали весь круг и разделили на два. Так считают площадь полукруглой клумбы или арки.',
        'А кольцо это большой круг без маленького. Считают площадь большого, потом маленького и вычитают. Так находят площадь дорожки вокруг круглого фонтана.',
      ],
      uz: [
        "Masalalarda ko'pincha radius emas, diametr beriladi. Unda avvalo uni teng ikkiga bo'lamiz, keyingina yuzani hisoblaymiz.",
        "Doiraning yarmi yuzning yarmini egallaydi: butun doirani hisoblab, ikkiga bo'lamiz. Yarim doira gulzor yoki ravoq yuzi shunday topiladi.",
        "Halqa esa kattasidan kichigi olib tashlangan doira. Kattasining yuzini, keyin kichigining yuzini hisoblab ayiriladi. Dumaloq favvora atrofidagi yo'lka yuzi shunday topiladi.",
      ],
      en: [
        'Problems often give the diameter instead of the radius. Then halve it first and only afterwards compute the area.',
        'Half a disc takes half the area: work out the whole disc and divide by two. That is how a semicircular flower bed or arch is measured.',
        'A ring is a big disc without a small one. Compute the big area, then the small one, and subtract. That is how the path around a round fountain is measured.',
      ],
    },
  },

  s_solve: {
    eyebrow: { ru: 'Решаем вместе', uz: 'Birga yechamiz', en: 'Solving together' },
    title: { ru: 'Две лепёшки на противне', uz: 'Tovadagi ikki non', en: 'Two flatbreads on a tray' },
    lead: { ru: 'Маленькая 20 см в поперечнике, большая 40 см.', uz: 'Kichigi 20 sm, kattasi 40 sm.', en: 'The small one 20 cm across, the big one 40 cm.' },
    steps: [
      { ru: 'маленькая: r = 10, S = 3,14 · 100 = 314', uz: 'kichigi: r = 10, S = 3,14 · 100 = 314', en: 'small: r = 10, S = 3.14 · 100 = 314' },
      { ru: 'большая: r = 20, S = 3,14 · 400 = 1256', uz: 'kattasi: r = 20, S = 3,14 · 400 = 1256', en: 'big: r = 20, S = 3.14 · 400 = 1256' },
      { ru: '1256 : 314 = 4 раза', uz: '1256 : 314 = 4 barobar', en: '1256 : 314 = 4 times' },
    ],
    done: {
      ru: 'Ширина выросла вдвое, а площадь вчетверо: радиус входит в формулу дважды. Права была Дилноза.',
      uz: "En ikki barobar oshdi, yuza esa to'rt barobar: radius formulaga ikki marta kiradi. Dilnoza haq edi.",
      en: 'The width doubled but the area quadrupled: the radius enters the formula twice. Dilnoza was right.',
    },
    audio: {
      ru: [
        'Решаем вместе. У маленькой лепёшки поперечник двадцать, значит радиус десять. Площадь три целых четырнадцать сотых умножить на сто, то есть триста четырнадцать квадратных сантиметров.',
        'У большой поперечник сорок, радиус двадцать. Двадцать в квадрате это четыреста, умножаем на пи и получаем тысячу двести пятьдесят шесть.',
        'Делим: тысяча двести пятьдесят шесть на триста четырнадцать это ровно четыре. Ширина выросла вдвое, а площадь вчетверо, потому что радиус входит в формулу дважды. Права была Дилноза.',
      ],
      uz: [
        "Birga yechamiz. Kichik nonning eni yigirma, demak radiusi o'n. Yuzi uch butun yuzdan o'n to'rt kara yuz, ya'ni uch yuz o'n to'rt kvadrat santimetr.",
        "Kattasining eni qirq, radiusi yigirma. Yigirmaning kvadrati to'rt yuz, pi ga ko'paytiramiz va bir ming ikki yuz ellik olti chiqadi.",
        "Bo'lamiz: bir ming ikki yuz ellik oltini uch yuz o'n to'rtga bo'lsak roppa-rosa to'rt. En ikki barobar oshdi, yuza esa to'rt barobar, chunki radius formulaga ikki marta kiradi. Dilnoza haq edi.",
      ],
      en: [
        'Let us solve it together. The small bread is twenty across, so its radius is ten. The area is three point one four times one hundred, that is three hundred fourteen square centimetres.',
        'The big one is forty across, radius twenty. Twenty squared is four hundred, times pi gives one thousand two hundred fifty six.',
        'Divide: one thousand two hundred fifty six by three hundred fourteen is exactly four. The width doubled but the area quadrupled, because the radius enters the formula twice. Dilnoza was right.',
      ],
    },
  },

  s_edge: {
    eyebrow: { ru: 'Где ошибаются', uz: 'Qayerda xato qilishadi', en: 'Where mistakes happen' },
    title: { ru: 'Длина или площадь', uz: 'Uzunlikmi yoki yuza', en: 'Length or area' },
    bad_line: { ru: 'ошибка: S = 2πr, это длина окружности', uz: 'xato: S = 2πr, bu aylana uzunligi', en: 'mistake: S = 2πr, that is the circumference' },
    good_line: { ru: 'верно: S = πr², в ответе квадратные единицы', uz: "to'g'ri: S = πr², javobda kvadrat birliklar", en: 'right: S = πr², the answer is in square units' },
    warn_line: { ru: 'ошибка: подставили диаметр вместо радиуса', uz: "xato: radius o'rniga diametr qo'yilgan", en: 'mistake: the diameter was used instead of the radius' },
    done: {
      ru: 'Длина измеряется в сантиметрах, площадь — в квадратных сантиметрах. Единица в ответе сразу показывает, что искали.',
      uz: "Uzunlik santimetrda, yuza esa kvadrat santimetrda o'lchanadi. Javobdagi birlik nima qidirilganini darrov ko'rsatadi.",
      en: 'Length is in centimetres, area in square centimetres. The unit in the answer shows at once what was sought.',
    },
    audio: {
      ru: [
        'Две формулы с пи легко перепутать. Два пи эр это длина окружности, а пи эр в квадрате это площадь круга.',
        'Различить помогает единица измерения. Длину меряют в сантиметрах, площадь в квадратных сантиметрах. Если в ответе про кунжут получились просто сантиметры, значит взяли не ту формулу.',
        'Вторая ошибка: в формулу площади подставляют диаметр. Тогда ответ выходит вчетверо больше нужного, ведь радиус входит дважды.',
      ],
      uz: [
        "Pi bilan ikki formulani chalkashtirish oson. Ikki pi er bu aylana uzunligi, pi er kvadrat esa doira yuzi.",
        "Farqlashga o'lchov birligi yordam beradi. Uzunlik santimetrda, yuza kvadrat santimetrda o'lchanadi. Kunjut haqidagi javobda oddiy santimetr chiqsa, demak formula noto'g'ri olingan.",
        "Ikkinchi xato: yuza formulasiga diametr qo'yiladi. U holda javob keragidan to'rt barobar katta chiqadi, axir radius ikki marta kiradi.",
      ],
      en: [
        'The two formulas with pi are easy to mix up. Two pi r is the circumference, pi r squared is the area.',
        'Units help tell them apart. Length is in centimetres, area in square centimetres. If a sesame answer comes out in plain centimetres, the wrong formula was used.',
        'The second mistake: the diameter goes into the area formula. Then the answer is four times too big, because the radius enters twice.',
      ],
    },
  },

  s_rule: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    title: { ru: 'Площадь круга', uz: 'Doira yuzi', en: 'The area of a disc' },
    rule_1: {
      ru: 'Площадь круга равна π умножить на радиус в квадрате: S = πr². Сначала радиус умножают сам на себя, потом на π. Ответ получается в квадратных единицах.',
      uz: "Doira yuzi π kara radius kvadratga teng: S = πr². Avval radius o'ziga, keyin π ga ko'paytiriladi. Javob kvadrat birliklarda chiqadi.",
      en: 'The area of a disc is π times the radius squared: S = πr². Multiply the radius by itself first, then by π. The answer comes in square units.',
    },
    rule_2: {
      ru: 'Если дан диаметр, сначала находят радиус. При удвоении радиуса площадь растёт вчетверо. Лепёшки: 40 см вместо 20 дают вчетверо больше площади, права была Дилноза.',
      uz: "Diametr berilgan bo'lsa, avval radius topiladi. Radius ikki barobar oshsa, yuza to'rt barobar o'sadi. Nonlar: 20 o'rniga 40 sm to'rt barobar ko'p yuza beradi, Dilnoza haq edi.",
      en: 'If the diameter is given, find the radius first. Doubling the radius quadruples the area. The flatbreads: 40 cm instead of 20 gives four times the area, so Dilnoza was right.',
    },
    audio: {
      ru: 'Запомним правило. Площадь круга равна пи умножить на радиус в квадрате. Сначала радиус умножают сам на себя, и только потом на пи. Ответ выходит в квадратных единицах, и это отличает площадь от длины окружности. Если дан диаметр, сначала находят радиус. При удвоении радиуса площадь растёт вчетверо, потому что радиус входит в формулу дважды. Вернёмся к лепёшкам. Сорок сантиметров вместо двадцати дают вчетверо больше площади. Права была Дилноза.',
      uz: "Qoidani eslab qolamiz. Doira yuzi pi kara radius kvadratga teng. Avval radius o'ziga, keyingina pi ga ko'paytiriladi. Javob kvadrat birliklarda chiqadi va bu yuzani aylana uzunligidan farqlaydi. Diametr berilgan bo'lsa, avval radius topiladi. Radius ikki barobar oshsa, yuza to'rt barobar o'sadi, chunki radius formulaga ikki marta kiradi. Nonlarga qaytamiz. Yigirma o'rniga qirq santimetr to'rt barobar ko'p yuza beradi. Dilnoza haq edi.",
      en: 'Let us remember the rule. The area of a disc is pi times the radius squared. Multiply the radius by itself first, only then by pi. The answer comes in square units, and that is what separates area from circumference. If the diameter is given, find the radius first. Doubling the radius quadruples the area, because the radius enters the formula twice. Back to the flatbreads. Forty centimetres instead of twenty gives four times the area. Dilnoza was right.',
    },
  },

  s_area: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Находим площадь', uz: 'Yuzani topamiz', en: 'Finding the area' },
    lead: { ru: 'Сначала квадрат радиуса, потом π.', uz: 'Avval radius kvadrati, keyin π.', en: 'Radius squared first, then π.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Радиус 3 см. Площадь круга?', uz: 'Radius 3 sm. Doira yuzi?', en: 'Radius 3 cm. Area?' },
        opts: ['28,26 см²', '18,84 см²', '9,42 см²'],
        correct: 0,
        ok: { ru: 'Верно. 3 · 3 = 9, потом 3,14 · 9 = 28,26.', uz: "To'g'ri. 3 · 3 = 9, keyin 3,14 · 9 = 28,26.", en: 'Right. 3 · 3 = 9, then 3.14 · 9 = 28.26.' },
        wrong: [
          null,
          { ru: 'Это длина окружности, а нужна площадь.', uz: 'Bu aylana uzunligi, yuza kerak esa.', en: 'That is the circumference, but the area is needed.' },
          { ru: 'Радиус не возвели в квадрат.', uz: "Radius kvadratga ko'tarilmagan.", en: 'The radius was not squared.' },
        ],
      },
      {
        q: { ru: 'Радиус 6 см. Площадь круга?', uz: 'Radius 6 sm. Doira yuzi?', en: 'Radius 6 cm. Area?' },
        opts: ['113,04 см²', '37,68 см²', '18,84 см²'],
        correct: 0,
        ok: { ru: 'Верно. 6 · 6 = 36, потом 3,14 · 36 = 113,04.', uz: "To'g'ri. 6 · 6 = 36, keyin 3,14 · 36 = 113,04.", en: 'Right. 6 · 6 = 36, then 3.14 · 36 = 113.04.' },
        wrong: [
          null,
          { ru: 'Это длина окружности, а нужна площадь.', uz: 'Bu aylana uzunligi, yuza kerak esa.', en: 'That is the circumference, but the area is needed.' },
          { ru: 'Радиус не возвели в квадрат.', uz: "Radius kvadratga ko'tarilmagan.", en: 'The radius was not squared.' },
        ],
      },
      {
        q: { ru: 'Диаметр 8 см. Площадь круга?', uz: 'Diametr 8 sm. Doira yuzi?', en: 'Diameter 8 cm. Area?' },
        opts: ['50,24 см²', '200,96 см²', '25,12 см²'],
        correct: 0,
        ok: { ru: 'Верно. Радиус 4, значит 3,14 · 16 = 50,24.', uz: "To'g'ri. Radius 4, demak 3,14 · 16 = 50,24.", en: 'Right. The radius is 4, so 3.14 · 16 = 50.24.' },
        wrong: [
          null,
          { ru: 'В формулу подставили диаметр, ответ вчетверо больше.', uz: "Formulaga diametr qo'yilgan, javob to'rt barobar katta.", en: 'The diameter went into the formula: four times too big.' },
          { ru: 'Это длина окружности, а нужна площадь.', uz: 'Bu aylana uzunligi, yuza kerak esa.', en: 'That is the circumference, but the area is needed.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на площадь. Если дан диаметр, сначала найдите радиус.',
        uz: "Yuza mashqi. Diametr berilgan bo'lsa, avval radiusni toping.",
        en: 'Practice on area. If the diameter is given, find the radius first.',
      },
    },
  },

  s_more: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Половина, кольцо и рост', uz: "Yarmi, halqa va o'sish", en: 'Halves, rings and growth' },
    lead: { ru: 'Считай π равным 3,14.', uz: "π ni 3,14 deb oling.", en: 'Take π as 3.14.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Полукруглая клумба, радиус 10 м. Площадь?', uz: 'Yarim doira gulzor, radiusi 10 m. Yuzi?', en: 'A semicircular bed, radius 10 m. Area?' },
        opts: ['157 м²', '314 м²', '31,4 м²'],
        correct: 0,
        ok: { ru: 'Верно. Весь круг 314, половина 157 м².', uz: "To'g'ri. Butun doira 314, yarmi 157 m².", en: 'Right. The full disc is 314, half is 157 m².' },
        wrong: [
          null,
          { ru: 'Это весь круг, а клумба полукруглая.', uz: 'Bu butun doira, gulzor esa yarim doira.', en: 'That is the whole disc, but the bed is a half.' },
          { ru: 'Это длина окружности, а нужна площадь.', uz: 'Bu aylana uzunligi, yuza kerak esa.', en: 'That is the circumference, but the area is needed.' },
        ],
      },
      {
        q: { ru: 'Радиус увеличили в 3 раза. Во сколько раз выросла площадь?', uz: "Radius 3 barobar oshirildi. Yuza necha barobar o'sdi?", en: 'The radius tripled. How much did the area grow?' },
        opts: [
          { ru: 'в 9 раз', uz: '9 barobar', en: 'nine times' },
          { ru: 'в 3 раза', uz: '3 barobar', en: 'three times' },
          { ru: 'в 6 раз', uz: '6 barobar', en: 'six times' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Радиус входит дважды: 3 · 3 = 9.', uz: "To'g'ri. Radius ikki marta kiradi: 3 · 3 = 9.", en: 'Right. The radius enters twice: 3 · 3 = 9.' },
        wrong: [
          null,
          { ru: 'Так растёт длина окружности, а не площадь.', uz: "Aylana uzunligi shunday o'sadi, yuza emas.", en: 'That is how the circumference grows, not the area.' },
          { ru: 'Радиус не удваивают, а возводят в квадрат.', uz: "Radius ikkilantirilmaydi, kvadratga ko'tariladi.", en: 'The radius is squared, not doubled.' },
        ],
      },
      {
        q: { ru: 'Круглый стол радиуса 1 м. Хватит ли скатерти 4 м²?', uz: 'Radiusi 1 m dumaloq stol. 4 m² dasturxon yetadimi?', en: 'A round table of radius 1 m. Is a 4 m² cloth enough?' },
        opts: [
          { ru: 'да, нужно 3,14 м²', uz: 'ha, 3,14 m² kerak', en: 'yes, 3.14 m² is needed' },
          { ru: 'нет, нужно 6,28 м²', uz: "yo'q, 6,28 m² kerak", en: 'no, 6.28 m² is needed' },
          { ru: 'нет, нужно ровно 4 м²', uz: "yo'q, roppa-rosa 4 m² kerak", en: 'no, exactly 4 m² is needed' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 3,14 · 1 = 3,14 м², скатерти хватит.', uz: "To'g'ri. 3,14 · 1 = 3,14 m², dasturxon yetadi.", en: 'Right. 3.14 · 1 = 3.14 m², the cloth is enough.' },
        wrong: [
          null,
          { ru: 'Это длина окружности стола, а нужна площадь.', uz: 'Bu stol aylanasining uzunligi, yuza kerak esa.', en: 'That is the table’s circumference, but area is needed.' },
          { ru: 'Четыре квадратных метра это площадь квадрата 2 на 2.', uz: "To'rt kvadrat metr bu 2 ga 2 kvadratning yuzi.", en: 'Four square metres is the area of a 2 by 2 square.' },
        ],
      },
      {
        q: { ru: 'В чём измеряют площадь?', uz: "Yuza nimada o'lchanadi?", en: 'What are the units of area?' },
        opts: [
          { ru: 'в квадратных сантиметрах', uz: 'kvadrat santimetrda', en: 'in square centimetres' },
          { ru: 'в сантиметрах', uz: 'santimetrda', en: 'in centimetres' },
          { ru: 'в градусах', uz: 'darajada', en: 'in degrees' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Площадь считают квадратиками.', uz: "To'g'ri. Yuza kvadratchalar bilan hisoblanadi.", en: 'Right. Area is counted in little squares.' },
        wrong: [
          null,
          { ru: 'Так измеряют длину, в том числе длину окружности.', uz: "Bunday uzunlik, jumladan aylana uzunligi o'lchanadi.", en: 'That measures length, including circumference.' },
          { ru: 'Градусами измеряют углы.', uz: "Daraja bilan burchaklar o'lchanadi.", en: 'Degrees measure angles.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика посложнее. Следите за единицами и за тем, что именно спрашивают.',
        uz: "Murakkabroq mashq. Birliklarga va aynan nima so'ralayotganiga e'tibor bering.",
        en: 'Harder practice. Watch the units and what exactly is asked.',
      },
    },
  },

  s_bins: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Длина или площадь', uz: 'Uzunlikmi yoki yuza', en: 'Length or area' },
    lead: { ru: 'Реши, что именно нужно посчитать.', uz: "Aynan nimani hisoblash kerakligini hal qiling.", en: 'Decide what exactly must be computed.' },
    bin_a: { ru: 'Нужна длина окружности', uz: 'Aylana uzunligi kerak', en: 'Circumference is needed' },
    bin_b: { ru: 'Нужна площадь круга', uz: 'Doira yuzi kerak', en: 'Area is needed' },
    cards: [
      { label: { ru: 'лента по краю тарелки', uz: 'tarelka chetiga lenta', en: 'ribbon along the rim' }, bin: 'a' },
      { label: { ru: 'забор вокруг клумбы', uz: 'gulzor atrofiga panjara', en: 'fence around a bed' }, bin: 'a' },
      { label: { ru: 'путь колеса за оборот', uz: "g'ildirakning bir aylanishdagi yo'li", en: 'wheel distance per turn' }, bin: 'a' },
      { label: { ru: 'кунжут на лепёшку', uz: 'nonga kunjut', en: 'sesame on a flatbread' }, bin: 'b' },
      { label: { ru: 'скатерть на круглый стол', uz: 'dumaloq stolga dasturxon', en: 'cloth for a round table' }, bin: 'b' },
      { label: { ru: 'трава на круглой поляне', uz: "dumaloq maydonchaga o't", en: 'grass on a round lawn' }, bin: 'b' },
    ],
    hint: {
      ru: 'Если что-то идёт по краю — это длина. Если покрывает поверхность — площадь.',
      uz: "Biror narsa chetidan borsa — bu uzunlik. Yuzani qoplasa — yuza.",
      en: 'If something runs along the edge it is length. If it covers the surface it is area.',
    },
    correct_text: {
      ru: 'Верно. По краю — длина, по поверхности — площадь.',
      uz: "To'g'ri. Chetidan — uzunlik, yuzasidan — yuza.",
      en: 'Right. Along the edge is length, over the surface is area.',
    },
    audio: {
      intro: {
        ru: 'Разложите случаи по двум корзинам. Спросите себя: это идёт по краю или покрывает поверхность?',
        uz: "Hollarni ikki savatga ajrating. O'zingizdan so'rang: bu chetidan boradimi yoki yuzani qoplaydimi?",
        en: 'Sort the cases into two baskets. Ask yourself: does it run along the edge or cover the surface?',
      },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда. По краю или по поверхности?', uz: 'Bu yerga emas. Chetidanmi yoki yuzasidanmi?', en: 'Not here. Along the edge or over the surface?' },
    },
  },

  s_error: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikidek tekshiring.", en: 'Check someone else’s work the way you would check your own.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Санжар: «r = 4, значит S = 3,14 · 4 = 12,56 см²». Проверь.', uz: "Sanjar: «r = 4, demak S = 3,14 · 4 = 12,56 sm²». Tekshiring.", en: 'Sanjar: “r = 4, so S = 3.14 · 4 = 12.56 cm².” Check it.' },
        opts: [
          { ru: 'Нет: радиус надо возвести в квадрат, S = 50,24', uz: "Yo'q: radius kvadratga ko'tarilishi kerak, S = 50,24", en: 'No: square the radius, S = 50.24' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, будет 25,12', uz: "Yo'q, 25,12 bo'ladi", en: 'No, it is 25.12' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Так посчитана длина окружности радиуса 2.', uz: "To'g'ri. Bunday radiusi 2 aylananing uzunligi hisoblangan.", en: 'Right. That computes a circumference instead.' },
        wrong: [
          null,
          { ru: 'В формуле площади радиус стоит в квадрате.', uz: 'Yuza formulasida radius kvadratda turadi.', en: 'In the area formula the radius is squared.' },
          { ru: 'Это длина окружности радиуса 4.', uz: 'Bu radiusi 4 aylananing uzunligi.', en: 'That is the circumference of radius 4.' },
        ],
      },
      {
        q: { ru: 'Дилноза: «Диаметр 10, значит S = 3,14 · 100 = 314». Проверь.', uz: "Dilnoza: «Diametr 10, demak S = 3,14 · 100 = 314». Tekshiring.", en: 'Dilnoza: “Diameter 10, so S = 3.14 · 100 = 314.” Check it.' },
        opts: [
          { ru: 'Нет: радиус 5, значит S = 78,5', uz: "Yo'q: radius 5, demak S = 78,5", en: 'No: the radius is 5, so S = 78.5' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, будет 31,4', uz: "Yo'q, 31,4 bo'ladi", en: 'No, it is 31.4' },
        ],
        correct: 0,
        ok: { ru: 'Верно. С диаметром ответ вышел вчетверо больше.', uz: "To'g'ri. Diametr bilan javob to'rt barobar katta chiqdi.", en: 'Right. Using the diameter made it four times too big.' },
        wrong: [
          null,
          { ru: 'Формула площади просит радиус, а не диаметр.', uz: "Yuza formulasi radiusni so'raydi, diametrni emas.", en: 'The area formula wants the radius, not the diameter.' },
          { ru: 'Это длина окружности, а спрашивали площадь.', uz: "Bu aylana uzunligi, so'ralgani esa yuza.", en: 'That is the circumference, but area was asked.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Проверьте чужое решение. Ошибка бывает и в выборе формулы, и в выборе величины.',
        uz: "Birovning yechimini tekshiring. Xato formulani tanlashda ham, kattalikni tanlashda ham bo'ladi.",
        en: 'Check someone else’s work. A mistake can be in the formula and in the quantity chosen.',
      },
    },
  },

  s_task: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    title: { ru: 'Лепёшки на противне', uz: 'Tovadagi nonlar', en: 'Flatbreads on a tray' },
    lead: { ru: 'Маленькая лепёшка радиуса 10 см, большая радиуса 20 см.', uz: 'Kichik non radiusi 10 sm, kattasiniki 20 sm.', en: 'The small bread has radius 10 cm, the big one 20 cm.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Чему равна площадь маленькой лепёшки?', uz: 'Kichik nonning yuzi nechaga teng?', en: 'What is the area of the small one?' },
        opts: ['314 см²', '62,8 см²', '31,4 см²'],
        correct: 0,
        ok: { ru: 'Верно. 3,14 · 100 = 314 см².', uz: "To'g'ri. 3,14 · 100 = 314 sm².", en: 'Right. 3.14 · 100 = 314 cm².' },
        wrong: [
          null,
          { ru: 'Это длина окружности, а нужна площадь.', uz: 'Bu aylana uzunligi, yuza kerak esa.', en: 'That is the circumference, but area is needed.' },
          { ru: 'Радиус не возвели в квадрат.', uz: "Radius kvadratga ko'tarilmagan.", en: 'The radius was not squared.' },
        ],
      },
      {
        q: { ru: 'На маленькую ушло 20 г кунжута. Сколько на большую?', uz: 'Kichigiga 20 g kunjut ketdi. Kattasiga qancha?', en: '20 g of sesame for the small one. For the big one?' },
        opts: ['80 г', '40 г', '20 г'],
        correct: 0,
        ok: { ru: 'Верно. Площадь вчетверо больше, значит и кунжута вчетверо.', uz: "To'g'ri. Yuza to'rt barobar katta, demak kunjut ham to'rt barobar.", en: 'Right. Four times the area means four times the sesame.' },
        wrong: [
          null,
          { ru: 'Вдвое шире, но вчетверо больше по площади.', uz: "Ikki barobar keng, lekin yuzi bo'yicha to'rt barobar.", en: 'Twice as wide but four times the area.' },
          { ru: 'Большая лепёшка требует больше кунжута.', uz: "Katta nonga ko'proq kunjut kerak.", en: 'The big bread needs more sesame.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Задача про лепёшки. У маленькой радиус десять сантиметров, у большой двадцать.',
        uz: "Nonlar haqida masala. Kichigining radiusi o'n santimetr, kattasiniki yigirma.",
        en: 'A flatbread problem. The small one has a radius of ten centimetres, the big one twenty.',
      },
    },
  },

  s_final: {
    eyebrow: { ru: 'Финал', uz: 'Final', en: 'Final' },
    intro_line: { ru: 'Пять заданий на весь урок.', uz: 'Butun darsga beshta topshiriq.', en: 'Five tasks covering the whole lesson.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        kind: 'num', ans: 314,
        q: { ru: 'Радиус 10 см. Найди площадь круга в см².', uz: 'Radius 10 sm. Doira yuzini sm² da toping.', en: 'Radius 10 cm. Find the area in cm².' },
        hint: { ru: 'Сначала 10 · 10, потом на 3,14.', uz: 'Avval 10 · 10, keyin 3,14 ga.', en: 'First 10 · 10, then times 3.14.' },
        hint_audio: { ru: 'Сначала умножьте радиус сам на себя, получится сто, а потом умножьте на три целых четырнадцать сотых.', uz: "Avval radiusni o'ziga ko'paytiring, yuz chiqadi, keyin uch butun yuzdan o'n to'rtga ko'paytiring.", en: 'First multiply the radius by itself to get one hundred, then multiply by three point one four.' },
      },
      {
        kind: 'mc', correctIndex: 2,
        q: { ru: 'Радиус 2 см. Площадь круга?', uz: 'Radius 2 sm. Doira yuzi?', en: 'Radius 2 cm. Area?' },
        opts: ['6,28 см²', '3,14 см²', '12,56 см²', '4 см²'],
        wrong: [
          { ru: 'Это длина окружности, а нужна площадь.', uz: 'Bu aylana uzunligi, yuza kerak esa.', en: 'That is the circumference, not the area.' },
          { ru: 'Так вышло бы при радиусе 1.', uz: "Radius 1 bo'lganda shunday chiqardi.", en: 'That would be a radius of one.' },
          null,
          { ru: 'Про π забыли: это площадь квадрата 2 на 2.', uz: "π unutilgan: bu 2 ga 2 kvadratning yuzi.", en: 'π was forgotten: that is a 2 by 2 square.' },
        ],
        correct: { ru: 'Верно. 2 · 2 = 4, потом 3,14 · 4 = 12,56.', uz: "To'g'ri. 2 · 2 = 4, keyin 3,14 · 4 = 12,56.", en: 'Right. 2 · 2 = 4, then 3.14 · 4 = 12.56.' },
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'Радиус увеличили вдвое. Что стало с площадью?', uz: "Radius ikki barobar oshirildi. Yuza nima bo'ldi?", en: 'The radius doubled. What happened to the area?' },
        opts: [
          { ru: 'выросла вдвое', uz: 'ikki barobar oshdi', en: 'it doubled' },
          { ru: 'выросла вчетверо', uz: "to'rt barobar oshdi", en: 'it quadrupled' },
          { ru: 'не изменилась', uz: "o'zgarmadi", en: 'it stayed the same' },
          { ru: 'выросла втрое', uz: 'uch barobar oshdi', en: 'it tripled' },
        ],
        wrong: [
          { ru: 'Так растёт длина окружности, а не площадь.', uz: "Aylana uzunligi shunday o'sadi, yuza emas.", en: 'That is how the circumference grows, not the area.' },
          null,
          { ru: 'Круг стал больше, площадь не может остаться прежней.', uz: "Doira kattalashdi, yuza o'sha qololmaydi.", en: 'The disc got bigger, the area cannot stay.' },
          { ru: 'Радиус входит дважды, значит множитель 2 · 2.', uz: "Radius ikki marta kiradi, demak ko'paytuvchi 2 · 2.", en: 'The radius enters twice, so the factor is 2 · 2.' },
        ],
        correct: { ru: 'Верно. Радиус входит дважды: 2 · 2 = 4.', uz: "To'g'ri. Radius ikki marta kiradi: 2 · 2 = 4.", en: 'Right. The radius enters twice: 2 · 2 = 4.' },
      },
      {
        kind: 'mc', correctIndex: 3,
        q: { ru: 'Какая формула даёт площадь круга?', uz: 'Qaysi formula doira yuzini beradi?', en: 'Which formula gives the area?' },
        opts: ['2πr', 'πd', 'r · r', 'πr²'],
        wrong: [
          { ru: 'Это длина окружности.', uz: 'Bu aylana uzunligi.', en: 'That is the circumference.' },
          { ru: 'Это тоже длина окружности.', uz: 'Bu ham aylana uzunligi.', en: 'That is the circumference too.' },
          { ru: 'Это площадь квадрата со стороной r, а круг меньше.', uz: "Bu tomoni r kvadratning yuzi, doira esa kichikroq.", en: 'That is a square of side r, and a disc is smaller.' },
          null,
        ],
        correct: { ru: 'Верно. Сначала квадрат радиуса, потом π.', uz: "To'g'ri. Avval radius kvadrati, keyin π.", en: 'Right. Radius squared first, then π.' },
      },
      {
        kind: 'mc', correctIndex: 0,
        q: { ru: 'Лепёшка вдвое шире. Во сколько раз больше кунжута?', uz: "Non ikki barobar keng. Kunjut necha barobar ko'p?", en: 'A flatbread twice as wide. How much more sesame?' },
        opts: [
          { ru: 'в 4 раза', uz: '4 barobar', en: 'four times' },
          { ru: 'в 2 раза', uz: '2 barobar', en: 'twice' },
          { ru: 'столько же', uz: 'xuddi shuncha', en: 'the same' },
          { ru: 'в 8 раз', uz: '8 barobar', en: 'eight times' },
        ],
        wrong: [
          null,
          { ru: 'Вдвое растёт ширина, а кунжут ложится на площадь.', uz: 'En ikki barobar oshadi, kunjut esa yuzaga tushadi.', en: 'The width doubles, but sesame covers the area.' },
          { ru: 'Площадь стала больше, значит и кунжута нужно больше.', uz: "Yuza kattalashdi, demak kunjut ham ko'proq kerak.", en: 'The area grew, so more sesame is needed.' },
          { ru: 'В восемь раз растёт объём, а не площадь.', uz: "Sakkiz barobar hajm o'sadi, yuza emas.", en: 'Eight times is how volume grows, not area.' },
        ],
        correct: { ru: 'Верно. Площадь растёт вчетверо, кунжута нужно вчетверо больше.', uz: "To'g'ri. Yuza to'rt barobar o'sadi, kunjut ham to'rt barobar kerak.", en: 'Right. The area quadruples, so four times the sesame.' },
      },
    ],
    audio: {
      intro: {
        ru: 'Финальная проверка. Пять заданий на весь урок. Первое с набором числа, остальные с выбором.',
        uz: 'Yakuniy tekshiruv. Butun darsga beshta topshiriq. Birinchisida son teriladi, qolganlarida tanlanadi.',
        en: 'The final check. Five tasks covering the whole lesson. The first needs a typed number, the rest are multiple choice.',
      },
      on_correct: { ru: 'Верно.', uz: "To'g'ri.", en: 'Right.' },
      on_wrong: { ru: 'Посмотри разбор.', uz: 'Tushuntirishga qarang.', en: 'Look at the explanation.' },
    },
    fact: {
      ru: 'Правило «шире вдвое — площадь вчетверо» работает не только с лепёшками. Пицца диаметром 40 см по площади равна четырём пиццам по 20 см, поэтому одна большая почти всегда выгоднее двух маленьких. По той же причине большому животному труднее остыть: масса растёт быстрее, чем поверхность кожи, через которую уходит тепло.',
      uz: "«Eni ikki barobar — yuzi to'rt barobar» qoidasi faqat nonlarga tegishli emas. Diametri 40 sm pitsa yuzi bo'yicha 20 sm li to'rtta pitsaga teng, shuning uchun bitta katta pitsa deyarli har doim ikkita kichigidan foydali. Shu sababdan katta hayvonga sovish qiyinroq: massa teri yuzasidan tezroq o'sadi, issiqlik esa teri orqali chiqadi.",
      en: 'The rule “twice as wide, four times the area” is not just about bread. A 40 cm pizza equals four 20 cm pizzas in area, which is why one large is almost always a better deal than two small. For the same reason a large animal cools down harder: mass grows faster than the skin surface that lets heat out.',
    },
    fact_audio: {
      ru: 'Знаешь ли ты? Правило шире вдвое, а площадь вчетверо работает не только с лепёшками. Пицца диаметром сорок сантиметров по площади равна четырём пиццам по двадцать, поэтому одна большая почти всегда выгоднее двух маленьких. По той же причине большому животному труднее остыть: масса растёт быстрее, чем поверхность кожи, через которую уходит тепло.',
      uz: "Bilasizmi? Eni ikki barobar, yuzi to'rt barobar qoidasi faqat nonlarga tegishli emas. Diametri qirq santimetr pitsa yuzi bo'yicha yigirma santimetrlik to'rtta pitsaga teng, shuning uchun bitta katta pitsa deyarli har doim ikkita kichigidan foydali. Shu sababdan katta hayvonga sovish qiyinroq: massa teri yuzasidan tezroq o'sadi, issiqlik esa teri orqali chiqadi.",
      en: 'Did you know? The rule twice as wide, four times the area is not just about bread. A forty centimetre pizza equals four twenty centimetre pizzas in area, which is why one large is almost always a better deal than two small. For the same reason a large animal cools down harder: mass grows faster than the skin surface that lets heat out.',
    },
  },

  s14: {
    eyebrow: { ru: 'Урок пройден', uz: "Dars o'tildi", en: 'Lesson finished' },
    banner: { ru: 'Математика · Геометрия', uz: 'Matematika · Geometriya', en: 'Mathematics · Geometry' },
    heading: { ru: 'Площадь круга', uz: 'Doira yuzi', en: 'The area of a disc' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    brief_1: { ru: 'S = πr², сначала квадрат радиуса', uz: 'S = πr², avval radius kvadrati', en: 'S = πr², radius squared first' },
    brief_2: { ru: 'ответ в квадратных единицах', uz: 'javob kvadrat birliklarda', en: 'the answer is in square units' },
    brief_3: { ru: 'радиус вдвое — площадь вчетверо', uz: "radius ikki barobar — yuza to'rt barobar", en: 'double the radius, quadruple the area' },
    memo_title: { ru: 'Что помнить', uz: 'Nimani eslash kerak', en: 'What to remember' },
    memo_q1: { ru: 'Дан диаметр', uz: "Diametr berilgan", en: 'Diameter given' },
    memo_a1: { ru: 'сначала находим радиус', uz: 'avval radiusni topamiz', en: 'find the radius first' },
    memo_q2: { ru: 'Полкруга', uz: 'Yarim doira', en: 'Half a disc' },
    memo_a2: { ru: 'половина площади', uz: 'yuzning yarmi', en: 'is half the area' },
    memo_q3: { ru: 'Частая ошибка', uz: 'Tez-tez uchraydigan xato', en: 'A common mistake' },
    memo_a3: { ru: 'взять 2πr вместо πr²', uz: "πr² o'rniga 2πr olish", en: 'using 2πr instead of πr²' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'Площадь круга равна пи умножить на радиус в квадрате. Сначала радиус умножают сам на себя, и только потом на пи, а ответ выходит в квадратных единицах. Если дан диаметр, сначала находят радиус.',
        'Лепёшки: вдвое шире значит вчетверо больше по площади.',
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "Doira yuzi pi kara radius kvadratga teng. Avval radius o'ziga, keyingina pi ga ko'paytiriladi, javob esa kvadrat birliklarda chiqadi. Diametr berilgan bo'lsa, avval radius topiladi.",
        "Nonlar: ikki barobar keng bo'lsa, yuzi to'rt barobar katta.",
      ],
      en: [
        'The lesson is done. Let us gather the main points.',
        'The area of a disc is pi times the radius squared. Multiply the radius by itself first, only then by pi, and the answer comes in square units. If the diameter is given, find the radius first.',
        'The flatbreads: twice as wide means four times the area.',
      ],
    },
  },

  s_methods: {
    m1_title: { ru: 'Способ. Квадрат, потом π', uz: 'Usul. Kvadrat, keyin π', en: 'Method. Square, then π' },
    m1_steps: {
      ru: ['Найди радиус: если дан диаметр, раздели на 2', 'Умножь радиус сам на себя', 'Умножь на 3,14 и запиши квадратные единицы'],
      uz: ["Radiusni toping: diametr berilgan bo'lsa, 2 ga bo'ling", "Radiusni o'ziga ko'paytiring", "3,14 ga ko'paytiring va kvadrat birliklarni yozing"],
      en: ['Find the radius: halve the diameter if that is given', 'Multiply the radius by itself', 'Multiply by 3.14 and write square units'],
    },
    m1_no: {
      ru: 'Если в ответе нужны просто сантиметры, значит спрашивают длину, а не площадь.',
      uz: "Javobda oddiy santimetr kerak bo'lsa, demak uzunlik so'ralyapti, yuza emas.",
      en: 'If the answer needs plain centimetres, the question is about length, not area.',
    },
  },
};

// ============================================================
// СЦЕНЫ УРОКА: школьная пекарня, круглые лепёшки на противне.
// ============================================================
const HookScene = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="d39wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F9F4EB"/><stop offset="100%" stopColor="#EFE2CE"/>
      </linearGradient>
      <radialGradient id="d39non" cx="0.4" cy="0.35" r="0.75">
        <stop offset="0%" stopColor="#EFC98E"/><stop offset="100%" stopColor="#C9963F"/>
      </radialGradient>
    </defs>
    <rect x="0" y="0" width="400" height="154" fill="url(#d39wall)"/>

    {/* Печь с дверцей и жаром внутри */}
    <g>
      <rect x="12" y="34" width="96" height="86" rx="6" fill="#B4A48C" stroke="#8E8578" strokeWidth="2"/>
      <rect x="22" y="46" width="76" height="46" rx="4" fill="#3B3730"/>
      <ellipse className="d39-heat" cx="60" cy="76" rx="30" ry="14" fill="#F5C77E" opacity="0.5"/>
      <rect x="34" y="100" width="52" height="8" rx="3" fill="#8E8578"/>
      <circle cx="96" cy="104" r="4" fill="#D9603F"/>
    </g>

    {/* Противень с двумя лепёшками */}
    <rect x="128" y="96" width="256" height="30" rx="6" fill="#A8A192"/>
    <rect x="134" y="100" width="244" height="20" rx="4" fill="#8E8578"/>
    <g>
      <circle cx="188" cy="88" r="26" fill="url(#d39non)" stroke="#A87A2E" strokeWidth="2"/>
      <circle cx="188" cy="88" r="14" fill="none" stroke="#A87A2E" strokeWidth="1.6" opacity="0.7"/>
      {[0, 1, 2, 3, 4, 5].map((k) => (
        <circle key={k} cx={188 + 18 * Math.cos(k)} cy={88 + 18 * Math.sin(k)} r="1.6" fill="#6B4B12"/>
      ))}
      <text x="188" y="140" textAnchor="middle" fill="#8A8883"
        fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">20</text>
    </g>
    <g>
      <circle cx="308" cy="76" r="44" fill="url(#d39non)" stroke="#A87A2E" strokeWidth="2.4"/>
      <circle cx="308" cy="76" r="24" fill="none" stroke="#A87A2E" strokeWidth="1.8" opacity="0.7"/>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => (
        <circle key={k} cx={308 + 32 * Math.cos(k * 0.8)} cy={76 + 32 * Math.sin(k * 0.8)} r="1.8" fill="#6B4B12"/>
      ))}
      <text x="308" y="140" textAnchor="middle" fill="#8A8883"
        fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">40</text>
    </g>

    <Person x={120} ground={132} head={12} shirt="#7ECBE6" hair="#3E3128"/>
    <Person x={378} ground={132} head={12} shirt="#8FBF7F" hair="#5A4636"/>
    <rect x="0" y="132" width="400" height="22" fill="#D2A96F"/>
  </svg>
);

// Итог: маленький круг четыре раза укладывается в большой.
const FinalScene = () => {
  const lang = useLang();
  return (
    <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
      <rect x="0" y="0" width="400" height="92" fill="#F9F4EB"/>
      <circle cx="58" cy="44" r="18" fill="#F5C77E" stroke="#A87A2E" strokeWidth="2"/>
      <text x="58" y="82" textAnchor="middle" fill="#8A8883"
        fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">314</text>
      <text x="108" y="50" textAnchor="middle" fill="#8A8883"
        fontFamily="'JetBrains Mono', monospace" fontSize="16" fontWeight="700">· 4 =</text>
      <circle cx="216" cy="44" r="36" fill="#F5C77E" stroke="#A87A2E" strokeWidth="2.4"/>
      <text x="216" y="82" textAnchor="middle" fill="#8A8883"
        fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">1256</text>
      <text x="330" y="40" textAnchor="middle" fill="#1F7A4D"
        fontFamily="'Manrope', system-ui, sans-serif" fontSize="11" fontWeight="700">
        {tri(lang, 'вдвое шире', 'ikki barobar keng', 'twice as wide')}
      </text>
      <text x="330" y="58" textAnchor="middle" fill="#1F7A4D"
        fontFamily="'Manrope', system-ui, sans-serif" fontSize="11" fontWeight="700">
        {tri(lang, 'вчетверо больше', "to'rt barobar katta", 'four times bigger')}
      </text>
    </svg>
  );
};

// ============================================================
// БЛОКИ ЭКРАНОВ
// ============================================================
// Прибор урока: круг на клетчатом поле и квадрат со стороной r.
const CellCircle = ({ squares = 0, size = 'mid' }) => {
  const cx = 96; const cy = 92; const r = 72; const cell = 12;
  return (
    <span className={'d39-cell-box d39-cell-' + size}>
      <svg viewBox="0 0 300 176" aria-hidden="true">
        <g opacity="0.55">
          {Array.from({ length: 25 }, (_, i) => (
            <path key={'v' + i} d={`M${cx - r + i * cell} ${cy - r} v${2 * r}`} stroke="#E3DCCE" strokeWidth="1"/>
          ))}
          {Array.from({ length: 13 }, (_, i) => (
            <path key={'h' + i} d={`M${cx - r} ${cy - r + i * cell} h${2 * r}`} stroke="#E3DCCE" strokeWidth="1"/>
          ))}
        </g>
        <circle cx={cx} cy={cy} r={r} fill="#FBF3D6" stroke="#019ACB" strokeWidth="3"/>
        {squares >= 1 && (
          <g>
            <rect x={cx} y={cy - r} width={r} height={r} fill="#A9CFBA" opacity="0.75" stroke="#1F7A4D" strokeWidth="2"/>
            <text x={cx + r / 2} y={cy - r / 2 + 5} textAnchor="middle" fill="#1F7A4D"
              fontFamily="'JetBrains Mono', monospace" fontSize="13" fontWeight="700">r²</text>
          </g>
        )}
        {squares >= 2 && (
          <>
            <rect x={cx - r} y={cy - r} width={r} height={r} fill="#A9CFBA" opacity="0.5" stroke="#1F7A4D" strokeWidth="1.6"/>
            <rect x={cx - r} y={cy} width={r} height={r} fill="#A9CFBA" opacity="0.5" stroke="#1F7A4D" strokeWidth="1.6"/>
          </>
        )}
        <path d={`M${cx} ${cy} h${r}`} stroke="#D9603F" strokeWidth="2.6"/>
        <text x={cx + r / 2} y={cy + 16} textAnchor="middle" fill="#D9603F"
          fontFamily="'JetBrains Mono', monospace" fontSize="12" fontWeight="700">r</text>
        <circle cx={cx} cy={cy} r="3.4" fill="#494550"/>
        {squares >= 2 && (
          <g>
            <rect x="194" y="52" width="94" height="60" rx="8" fill="#E3F0E8" stroke="#1F7A4D" strokeWidth="2"/>
            <text x="241" y="78" textAnchor="middle" fill="#1F7A4D"
              fontFamily="'JetBrains Mono', monospace" fontSize="15" fontWeight="700">3,14</text>
            <text x="241" y="98" textAnchor="middle" fill="#1F7A4D"
              fontFamily="'JetBrains Mono', monospace" fontSize="13" fontWeight="700">· r²</text>
          </g>
        )}
      </svg>
    </span>
  );
};

const Line = ({ node, on }) => (
  <span className={'d39-line d39-fade' + (on ? ' d39-on' : '')}>{mt(node)}</span>
);

const RecallBody = ({ step }) => {
  const t = useT();
  const lang = useLang();
  const c = CONTENT.s_recall;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d39-stage">
        <span className="d39-sq">
          <svg viewBox="0 0 130 110" aria-hidden="true">
            {Array.from({ length: 6 }, (_, i) => (
              <path key={'v' + i} d={`M${20 + i * 18} 16 v90`} stroke="#E3DCCE" strokeWidth="1"/>
            ))}
            {Array.from({ length: 6 }, (_, i) => (
              <path key={'h' + i} d={`M20 ${16 + i * 18} h90`} stroke="#E3DCCE" strokeWidth="1"/>
            ))}
            <rect x="20" y="16" width="90" height="90" fill="#E7F5FA" opacity="0.75" stroke="#019ACB" strokeWidth="2.4"/>
            <text x="65" y="68" textAnchor="middle" fill="#019ACB"
              fontFamily="'JetBrains Mono', monospace" fontSize="15" fontWeight="700">a · a</text>
          </svg>
        </span>
        <span className={'d39-chips d39-fade' + (step >= 1 ? ' d39-on' : '')}>
          <i className="d39-chip-l">{tri(lang, 'квадрат числа', 'sonning kvadrati', 'the square of a number')}</i>
          <i className="d39-chip-g">5 · 5 = 25</i>
        </span>
      </div>
      {step >= 2 && (
        <div className="frame-success fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
        </div>
      )}
    </div>
  );
};

// Ядро: сколько квадратов r в круге.
const CoreBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_core;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d39-stage d39-stage-row">
        <CellCircle size="sm" squares={step >= 1 ? 2 : 1}/>
        <span className="d39-col">
          {c.lines.map((l, i) => <Line key={i} node={t(l)} on={step >= i}/>)}
        </span>
      </div>
      {step >= 2 && (
        <div className="frame-success fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
        </div>
      )}
    </div>
  );
};

// Половина, кольцо, диаметр.
const HalfBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_half;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d39-stage">
        <span className="d39-shapes">
          <svg viewBox="0 0 300 92" aria-hidden="true">
            <path d="M14 66 a40 40 0 0 1 80 0 z" fill="#A9CFBA" stroke="#1F7A4D" strokeWidth="2.4"/>
            <text x="54" y="86" textAnchor="middle" fill="#1F7A4D"
              fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">S : 2</text>
            <g className={'d39-fade' + (step >= 2 ? ' d39-on' : '')}>
              <circle cx="216" cy="44" r="38" fill="#A9CFBA" stroke="#1F7A4D" strokeWidth="2.4"/>
              <circle cx="216" cy="44" r="20" fill="#F9F4EB" stroke="#1F7A4D" strokeWidth="2"/>
              <text x="216" y="90" textAnchor="middle" fill="#1F7A4D"
                fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">S − s</text>
            </g>
          </svg>
        </span>
        {c.lines.map((l, i) => <Line key={i} node={t(l)} on={step >= i}/>)}
      </div>
      {step >= 2 && (
        <div className="frame-success fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
        </div>
      )}
    </div>
  );
};

const SolveBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_solve;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink3 }}>{mt(t(c.lead))}</p>
      <div className="frame fade-up delay-1 d39-stage">
        <span className="d39-two">
          <i className="d39-two-a">314</i>
          <b>·4</b>
          <i className={'d39-two-b d39-fade' + (step >= 1 ? ' d39-on' : '')}>1256</i>
        </span>
        {c.steps.map((s, i) => <Line key={i} node={t(s)} on={step >= i}/>)}
      </div>
      {step >= 2 && (
        <div className="frame-success fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
        </div>
      )}
    </div>
  );
};

// Граница: длина или площадь.
const EdgeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_edge;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d39-stage">
        <span className="d39-pair d39-pair-bad"><Line node={t(c.bad_line)} on/></span>
        <span className={'d39-pair d39-pair-good d39-fade' + (step >= 1 ? ' d39-on' : '')}>
          <Line node={t(c.good_line)} on/>
        </span>
        <span className={'d39-pair d39-pair-warn d39-fade' + (step >= 2 ? ' d39-on' : '')}>
          <Line node={t(c.warn_line)} on/>
        </span>
      </div>
      {step >= 2 && (
        <div className="frame-tip fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
        </div>
      )}
    </div>
  );
};

// ============================================================
// ЭКРАН 4 — «сначала показали, потом сам»
// ============================================================
const ToolScreen = ({ screen, totalScreens, onNext, onPrev, onAnswer, storedAnswer }) => {
  const c = CONTENT.s_tool;
  const t = useT();
  const lang = useLang();
  const audio = useAudio([{ id: 's_tool_intro', text: pickL(c.audio.intro, lang), trigger: 'on_mount', waits_for: null }]);
  const [phase, setPhase] = useState(storedAnswer ? 'play' : 'demo');
  const [shown, setShown] = useState(0);
  const [picked, setPicked] = useState(null);
  const firstTryRef = useRef(true);
  const timersRef = useRef([]);
  const solved = picked === c.play_correct;
  const done = shown >= 2;

  const say = (node, id) => {
    if (audio.muted || !node) return;
    const e = getAudioEngine();
    if (e) e.pushOneOff(pickL(node, lang), undefined, id);
  };

  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (phase !== 'demo' || done) return undefined;
    timersRef.current.push(setTimeout(() => setShown((v) => v + 1), 1400));
    if (shown === 1) timersRef.current.push(setTimeout(() => say(c.audio.demo, 's_tool_demo'), 1600));
    return () => timersRef.current.forEach(clearTimeout);
    /* eslint-disable-next-line */
  }, [phase, shown, done]);

  const toPlay = () => { setPhase('play'); setPicked(null); say(c.audio.play, 's_tool_play'); };

  const answer = (i) => {
    if (solved) return;
    setPicked(i);
    if (i !== c.play_correct) { firstTryRef.current = false; say(c.audio.wrong, 's_tool_wrong'); return; }
    say(c.audio.ok, 's_tool_ok');
    if (onAnswer) {
      onAnswer({
        stage: null, screenIdx: screen, question: pickL(c.play_ask, lang),
        correctAnswer: c.play_opts[c.play_correct], studentAnswer: c.play_opts[i],
        correct: firstTryRef.current, firstTry: firstTryRef.current, solved: true,
      });
    }
  };

  const navContent = (
    <>
      <NavBack onPrev={onPrev} label={<BackLabel/>}/>
      <NavNext disabled={navLocked(!solved || !audio.canAdvance)} label={<NextLabel/>} onClick={onNext}/>
    </>
  );

  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div className="rv-col">
        <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
        <div className={'d39-banner fade-up delay-1' + (phase === 'play' ? ' d39-banner-play' : '')}>
          {t(phase === 'demo' ? c.demo_banner : c.play_banner)}
        </div>

        <div className="frame fade-up delay-1 d39-stage d39-stage-tool d39-stage-row">
          {phase === 'demo' ? (
            <>
              <CellCircle size="xs" squares={shown >= 1 ? 2 : 1}/>
              <span className="d39-col">
                {c.demo_lines.map((l, i) => <Line key={i} node={t(l)} on={shown >= i}/>)}
                <p className={'body d39-verdict' + (done ? ' d39-verdict-on' : '')}>{done ? t(c.demo_note) : ''}</p>
              </span>
            </>
          ) : (
            <span className="d39-col">
              <p className="body" style={{ margin: '0 0 10px', fontWeight: 600 }}>{mt(t(c.play_ask))}</p>
              <div className="sv-opts">
                {c.play_opts.map((o, i) => (
                  <button key={o} className={'option'
                    + (solved && i === c.play_correct ? ' option-correct' : '')
                    + (!solved && picked === i ? ' option-picked-wrong' : '')}
                  disabled={solved} onClick={() => answer(i)}>{o}</button>
                ))}
              </div>
              {picked !== null && !solved && <HintBlock show>{mt(t(c.play_wrong[picked] || c.play_ok))}</HintBlock>}
              {solved && (
                <FeedbackBlock show isCorrect>
                  <p className="body" style={{ margin: 0 }}>{mt(t(c.play_ok))}</p>
                </FeedbackBlock>
              )}
            </span>
          )}
        </div>

        {phase === 'demo' && (
          <div className="d39-acts fade-up">
            <button className="d39-btn" disabled={!done} onClick={() => setShown(0)}>{t(c.again)}</button>
            <button className="d39-btn d39-btn-go" disabled={!done} onClick={toPlay}>{t(c.to_play)}</button>
          </div>
        )}

        <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps}
          note={CONTENT.s_methods.m1_no} active={phase === 'play' ? 3 : shown}/>
      </div>
    </Stage>
  );
};

// ============================================================
// ОБЁРТКИ ЭКРАНОВ
// ============================================================
const ScreenHook = (props) => (
  <HookScreen {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_hook} sceneNode={<HookScene/>}/>
);
const ScreenRecall = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_recall} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <RecallBody step={step}/>}/>
);
const ScreenCore = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_core} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <CoreBody step={step}/>}/>
);
const ScreenTool = (props) => <ToolScreen {...props} totalScreens={TOTAL_SCREENS}/>;
const ScreenHalf = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_half} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <HalfBody step={step}/>}/>
);
const ScreenSolve = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_solve} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <SolveBody step={step}/>}/>
);
const ScreenEdge = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_edge} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <EdgeBody step={step}/>}/>
);
const ScreenRule = (props) => (
  <RuleScreen {...props} screenContent={CONTENT.s_rule} totalScreens={TOTAL_SCREENS}
    exampleNode={(
      <div className="d39-stage">
        <CellCircle size="xs" squares={2}/>
      </div>
    )}/>
);

const methodAside = (
  <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps} note={CONTENT.s_methods.m1_no}/>
);

const ScreenArea = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_area} asideNode={methodAside}/>
);
const ScreenMore = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_more} asideNode={methodAside}/>
);
const ScreenBins = (props) => (
  <Classify {...props} screenContent={CONTENT.s_bins} totalScreens={TOTAL_SCREENS}/>
);
const ScreenError = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_error}/>
);

// Задача: две лепёшки рядом.
const TaskFig = ({ idx }) => (
  <div className="d39-task-fig">
    <svg viewBox="0 0 260 108" aria-hidden="true">
      <circle cx="56" cy="54" r="24" fill="#F5C77E" stroke="#A87A2E" strokeWidth="2"/>
      <text x="56" y="98" textAnchor="middle" fill="#8A8883"
        fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">r = 10</text>
      <g opacity={idx >= 1 ? 1 : 0.35}>
        <circle cx="172" cy="50" r="44" fill="#F5C77E" stroke="#A87A2E" strokeWidth="2.4"/>
        <text x="172" y="102" textAnchor="middle" fill="#8A8883"
          fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">r = 20</text>
      </g>
    </svg>
  </div>
);

const ScreenTask = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_task}
    figureNode={(it, idx) => <TaskFig idx={idx}/>}/>
);

const ScreenFinal = (props) => (
  <FinalPanel {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_final}
    factNode={<FactCard badge={FB_SCI} anim={<AnimDigits/>} text={CONTENT.s_final.fact}/>}/>
);

const SummaryCards = () => {
  const t = useT();
  const c = CONTENT.s14;
  return (
    <div className="frame sm-card">
      <p className="sm-card-h">{t(c.memo_title)}</p>
      <div className="mm-grid">
        {[[c.memo_q1, c.memo_a1], [c.memo_q2, c.memo_a2], [c.memo_q3, c.memo_a3]].map((row, i) => (
          <span className="mm-row" key={i}>
            <span className="mm-q">{t(row[0])}</span>
            <span className="mm-a">{t(row[1])}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

const Screen14 = (props) => (
  <SummaryScreen {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s14}
    sceneNode={<FinalScene/>} cards={<SummaryCards/>}/>
);

// ============================================================
// CSS УРОКА
// ============================================================
const LESSON_STYLES = `
.d39-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(9px, 1.7vw, 14px); padding: clamp(12px, 2.4vw, 18px) !important; }
.d39-stage-tool { gap: clamp(4px, 0.8vw, 7px) !important; padding: clamp(7px, 1.5vw, 11px) !important; }
.d39-stage-tool .d39-line { font-size: clamp(12px, 2vw, 16px); }
.d39-stage-row { flex-direction: row; align-items: center; justify-content: center; gap: clamp(10px, 2.4vw, 22px); flex-wrap: wrap; }
.d39-col { display: flex; flex-direction: column; align-items: center; gap: clamp(5px, 1.1vw, 9px); flex: 1 1 200px; min-width: 0; }

/* Круг на клетчатом поле */
.d39-cell-box { display: block; width: 100%; max-width: 280px; }
.d39-cell-sm { max-width: 240px; }
.d39-cell-xs { max-width: 196px; }
.d39-cell-box svg { width: 100%; height: auto; display: block; }
.d39-sq { display: block; width: 100%; max-width: 130px; }
.d39-sq svg { width: 100%; height: auto; display: block; }
.d39-shapes { display: block; width: 100%; max-width: 300px; }
.d39-shapes svg { width: 100%; height: auto; display: block; }

.d39-fade { opacity: 0; transition: opacity 420ms linear; }
.d39-on { opacity: 1; }
.d39-line { font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(12px, 2.1vw, 16px); font-weight: 700; color: #494550; text-align: center; }

/* Сравнение двух площадей */
.d39-two { display: inline-flex; align-items: center; gap: clamp(8px, 1.7vw, 14px); flex-wrap: wrap; justify-content: center; }
.d39-two b { font-family: 'JetBrains Mono', monospace; font-size: clamp(15px, 2.8vw, 22px); color: #8A8883; }
.d39-two i { font-style: normal; padding: 6px 16px; border-radius: 12px; font-family: 'JetBrains Mono', monospace; font-size: clamp(16px, 3vw, 25px); font-weight: 700; }
.d39-two-a { background: #FBF3D6; border: 1px solid #E4CE93; color: #8A6A22; }
.d39-two-b { background: #E3F0E8; border: 1px solid #A9CFBA; color: #1F7A4D; }

/* Подписи */
.d39-chips { display: inline-flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
.d39-chips i { font-style: normal; padding: 5px 12px; border-radius: 10px; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(12px, 2.1vw, 15px); font-weight: 700; }
.d39-chip-l { background: #E7F5FA; border: 1px solid #B6DCEA; color: #019ACB; }
.d39-chip-g { background: #E3F0E8; border: 1px solid #A9CFBA; color: #1F7A4D; font-family: 'JetBrains Mono', monospace; }

/* Строки экрана границы */
.d39-pair { width: 100%; padding: clamp(5px, 1.2vw, 9px); border-radius: 12px; text-align: center; }
.d39-pair-bad { background: #FFF1EC; border: 1px solid #F3C4B4; }
.d39-pair-good { background: #E3F0E8; border: 1px solid #A9CFBA; }
.d39-pair-warn { background: #FBF3D6; border: 1px solid #E4CE93; }

/* Задача */
.d39-task-fig { display: flex; justify-content: center; width: 100%; }
.d39-task-fig svg { width: 100%; max-width: 260px; height: auto; display: block; }

/* Экран 4 */
.d39-banner { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; font-size: clamp(13px, 2.2vw, 16px); font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 4px 11px; }
.d39-banner-play { color: #1F7A4D; background: #E3F0E8; }
.d39-verdict { margin: 0; min-height: 0; opacity: 0; transition: opacity 420ms linear; text-align: center; }
.d39-verdict-on { opacity: 1; }
.d39-acts { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.d39-btn { height: 36px; padding: 0 18px; border-radius: 12px; border: 1px solid #E9E3D9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(14px, 2.2vw, 16px); font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.d39-btn:disabled { opacity: 0.45; cursor: default; }
.d39-btn-go { border-color: #FF4F28; color: #FF4F28; }
.d39-btn-go:hover:not(:disabled) { background: #FFE8E1; }

/* Движение сцены: жар в печи дышит */
.d39-heat { animation: d39Heat 3400ms ease-in-out infinite; }
@keyframes d39Heat { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.65; } }
@media (prefers-reduced-motion: reduce) { .d39-heat { animation: none; } }
`;

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function DiscAreaLesson({
  studentName, lang: langProp, ttsApiBase, voiceGender,
  correctSoundUrl, wrongSoundUrl, aiGradingEndpoint, onFinished,
}) {
  useMobileZoom();
  const isPreview = (langProp === undefined || langProp === null);
  const [previewLang, setPreviewLang] = useState('uz');
  const lang = langProp || previewLang;
  const safeName = studentName || tri(lang, 'Ученик', "O'quvchi", 'Student');
  configureLesson({
    ttsApiBase: ttsApiBase || '', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '',
    aiGradingEndpoint: aiGradingEndpoint || '', studentName: safeName, voiceGender: voiceGender || 'm',
    navLock: false,
  });

  const [current, setCurrent] = useState(Math.min(PREVIEW_START, TOTAL_SCREENS - 1));
  const [answers, setAnswers] = useState([]);

  const screens = [ScreenHook, ScreenRecall, ScreenCore, ScreenTool, ScreenHalf, ScreenSolve, ScreenEdge,
    ScreenRule, ScreenArea, ScreenMore, ScreenBins, ScreenError, ScreenTask, ScreenFinal, Screen14];
  const CurrentScreen = screens[current];

  const finishLesson = () => {
    if (!onFinished) return;
    onFinished({
      lessonId: LESSON_META.lessonId,
      lessonTitle: LESSON_META.lessonTitle,
      totalQuestions: null, correctAnswers: null, scorePercent: null,
      finalScore: null, finalTotal: null, passed: null,
      answers: answers.filter(Boolean),
    });
  };

  return (
    <LangContext.Provider value={lang}>
      <div className="lesson-root">
        <style>{STYLES}</style>
        {isPreview && (
          <div className="g6-lang-switch">
            {['ru', 'uz', 'en'].map((l) => (
              <button key={l} className={'btn-ghost' + (l === lang ? ' is-on' : '')}
                onClick={() => setPreviewLang(l)}>{l.toUpperCase()}</button>
            ))}
          </div>
        )}
        <CurrentScreen
          screen={current}
          totalScreens={TOTAL_SCREENS}
          storedAnswer={answers[current]}
          onAnswer={(data) => setAnswers((prev) => { const next = [...prev]; next[current] = data; return next; })}
          onNext={() => setCurrent((v) => Math.min(v + 1, TOTAL_SCREENS - 1))}
          onPrev={() => setCurrent((v) => Math.max(v - 1, 0))}
          onReset={() => { setAnswers([]); setCurrent(0); }}
          finishLesson={finishLesson}
        />
      </div>
    </LangContext.Provider>
  );
}
