// ============================================================
// 6 КЛАСС, УРОК 46 «Итог раздела: геометрия и данные»
// Собран по context/GRADE6_ETALON.md на общем слое ./screens.jsx.
//
// Блок Б13, последний урок курса. Повторение построено не как список
// формул, а как выбор: вопрос задачи решает, какая формула нужна. По
// краю — длина, внутри — площадь, наполнить — объём. Экран границы
// собирает главные ошибки всего раздела в одном месте.
//
// Сцена — выставка школьных проектов: клумба, флажок, аквариум, опрос.
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
  lessonId: 'div_6_46',
  lessonTitle: {
    ru: 'Итог раздела: геометрия и данные',
    uz: "Bo'lim yakuni: geometriya va ma'lumotlar",
    en: 'Section review: geometry and data',
  },
};

const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',    scored: false, scope: 'hook' },     //  1 ko'rgazma: bordyur nima bilan
  { id: 's_recall', type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  2 bo'lim xaritasi
  { id: 's_core',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  3 savol formulani tanlaydi
  { id: 's_tool',   type: 'exploration', template: 'custom',        scored: false, scope: null },       //  4 USUL: chetdan yoki ichidan
  { id: 's_more',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  5 simmetriya va ma'lumotlar
  { id: 's_solve',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  6 birga yechamiz: uchburchak flajok
  { id: 's_edge',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  7 chegara: bo'limning uch xatosi
  { id: 's_rule',   type: 'rule',        template: 'RuleScreen',    scored: false, scope: null },       //  8 QOIDA: formulalar xulosasi
  { id: 's_pick',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, //  9 formulani tanlash x3
  { id: 's_calc',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 10 hisoblash x4
  { id: 's_bins',   type: 'test',        template: 'Classify',      scored: true,  scope: 'practice' }, // 11 savatlar: chetdan yoki ichidan
  { id: 's_error',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_task',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 13 MASALA: ko'rgazma
  { id: 's_final',  type: 'test',        template: 'FinalPanel',    scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',      type: 'summary',     template: 'SummaryScreen', scored: false, scope: null },       // 15 xulosa
];

registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

const CONTENT = {
  s_hook: {
    eyebrow: { ru: 'Зачем это нужно', uz: 'Bu nimaga kerak', en: 'Why you need this' },
    title: { ru: 'Проект круглой клумбы', uz: 'Dumaloq gulzor loyihasi', en: 'The round flower bed project' },
    lead: {
      ru: 'Клумба 6 м в поперечнике. По краю ставят бордюр, внутри сеют траву.',
      uz: "Gulzor eni 6 m. Chetiga bordyur qo'yiladi, ichiga o't ekiladi.",
      en: 'The bed is 6 m across. A border runs along the edge and grass fills the inside.',
    },
    voice_a: { ru: 'Азиз: бордюр считаем по площади круга.', uz: 'Aziz: bordyurni doira yuzi bilan hisoblaymiz.', en: 'Aziz: the border comes from the area.' },
    voice_b: { ru: 'Зумрад: по длине окружности.', uz: 'Zumrad: aylana uzunligi bilan.', en: 'Zumrad: from the circumference.' },
    ask: { ru: 'Что считать для бордюра?', uz: 'Bordyur uchun nima hisoblanadi?', en: 'What do we compute for the border?' },
    options: [
      { ru: 'площадь круга', uz: 'doira yuzini', en: 'the area' },
      { ru: 'длину окружности', uz: 'aylana uzunligini', en: 'the circumference' },
    ],
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: 'Variantlardan birini bosing. Javobni dars davomida tekshiramiz.',
      en: 'Tap one of the options. We will check the answer during the lesson.',
    },
    audio: {
      intro: {
        ru: [
          'На выставке школьных проектов показывают клумбу. Она круглая, шесть метров в поперечнике. По краю нужно поставить бордюр, а внутри посеять траву.',
          'Азиз говорит, что бордюр считают по площади круга. Зумрад отвечает, что по длине окружности. Что считать для бордюра? Выбери ответ. Проверим его по ходу урока.',
        ],
        uz: [
          "Maktab loyihalari ko'rgazmasida gulzor ko'rsatilmoqda. U dumaloq, eni olti metr. Chetiga bordyur qo'yish, ichiga esa o't ekish kerak.",
          "Aziz bordyur doira yuzi bilan hisoblanadi deydi. Zumrad esa aylana uzunligi bilan deb javob beradi. Bordyur uchun nima hisoblanadi? Javobni tanlang. Uni dars davomida tekshiramiz.",
        ],
        en: [
          'The school project fair shows a flower bed. It is round, six metres across. A border must run along the edge and grass must fill the inside.',
          'Aziz says the border comes from the area of the disc. Zumrad answers from the circumference. What do we compute for the border? Choose an answer. We will check it during the lesson.',
        ],
      },
    },
  },

  s_recall: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslaymiz', en: 'Recall' },
    title: { ru: 'Карта раздела', uz: "Bo'lim xaritasi", en: 'The map of the section' },
    done: {
      ru: 'За раздел мы научились измерять по краю, внутри и в объёме, отражать фигуры и описывать данные. Осталось выбирать нужное.',
      uz: "Bo'lim davomida chetidan, ichidan va hajmda o'lchashni, shakllarni akslantirishni va ma'lumotlarni tasvirlashni o'rgandik. Keraklisini tanlash qoldi.",
      en: 'Over the section we learned to measure along the edge, inside and in volume, to reflect shapes and to describe data. What is left is choosing.',
    },
    audio: {
      ru: [
        'Соберём раздел вместе. Мы разобрали окружность и круг, длину окружности и площадь круга.',
        'Потом две симметрии: осевую и центральную. Потом треугольник, его углы, периметр и площадь. Потом объём и единицы: кубический дециметр и литр.',
        'И наконец данные: мода, медиана, среднее и размах. Формул много, но задача всегда подсказывает, какую взять.',
      ],
      uz: [
        "Bo'limni birga yig'amiz. Aylana va doirani, aylana uzunligi va doira yuzini o'rgandik.",
        "Keyin ikki simmetriya: o'q va markaziy. Keyin uchburchak, uning burchaklari, perimetri va yuzi. Keyin hajm va birliklar: kub detsimetr va litr.",
        "Va oxirida ma'lumotlar: moda, mediana, o'rtacha va kenglik. Formula ko'p, lekin masala doim qaysi birini olishni aytib turadi.",
      ],
      en: [
        'Let us gather the section. We covered the circle and the disc, the circumference and the area.',
        'Then two symmetries: reflection and point symmetry. Then the triangle, its angles, perimeter and area. Then volume and units: the cubic decimetre and the litre.',
        'And finally data: mode, median, mean and range. There are many formulas, but the problem always hints which one to take.',
      ],
    },
  },

  s_core: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Вопрос выбирает формулу', uz: 'Savol formulani tanlaydi', en: 'The question picks the formula' },
    lines: [
      { ru: 'по краю — длина: C = πd', uz: 'chetidan — uzunlik: C = πd', en: 'along the edge: length, C = πd' },
      { ru: 'внутри — площадь: S = πr²', uz: 'ichidan — yuza: S = πr²', en: 'inside: area, S = πr²' },
      { ru: 'наполнить — объём: V = a · b · c', uz: "to'ldirish — hajm: V = a · b · c", en: 'to fill: volume, V = a · b · c' },
    ],
    done: {
      ru: 'Бордюр идёт по краю, значит нужна длина окружности. Права была Зумрад. Трава ляжет внутри, для неё считают площадь.',
      uz: "Bordyur chetidan boradi, demak aylana uzunligi kerak. Zumrad haq edi. O't ichiga tushadi, uning uchun yuza hisoblanadi.",
      en: 'The border runs along the edge, so we need the circumference. Zumrad was right. The grass lies inside, and that needs the area.',
    },
    audio: {
      ru: [
        'Есть простое правило выбора. Если что-то идёт по краю фигуры, это длина: лента, забор, бордюр, путь колеса.',
        'Если что-то покрывает фигуру внутри, это площадь: трава, краска, кунжут, скатерть. А если что-то наполняет фигуру, это объём: вода, песок, воздух.',
        'Бордюр ставят по краю, значит считаем длину окружности. Права была Зумрад. Азиз взял формулу площади: она понадобится, но уже для травы.',
      ],
      uz: [
        "Tanlashning oddiy qoidasi bor. Biror narsa shakl chetidan borsa, bu uzunlik: lenta, panjara, bordyur, g'ildirak yo'li.",
        "Biror narsa shaklni ichidan qoplasa, bu yuza: o't, bo'yoq, kunjut, dasturxon. Biror narsa shaklni to'ldirsa, bu hajm: suv, qum, havo.",
        "Bordyur chetiga qo'yiladi, demak aylana uzunligini hisoblaymiz. Zumrad haq edi. Aziz yuza formulasini oldi: u ham kerak bo'ladi, lekin o't uchun.",
      ],
      en: [
        'There is a simple rule for choosing. If something runs along the edge, it is length: ribbon, fence, border, the path of a wheel.',
        'If something covers the shape inside, it is area: grass, paint, sesame, a tablecloth. If something fills the shape, it is volume: water, sand, air.',
        'The border goes along the edge, so we compute the circumference. Zumrad was right. Aziz took the area formula: it will be needed, but for the grass.',
      ],
    },
  },

  s_tool: {
    eyebrow: { ru: 'Смотри и повтори', uz: 'Qarang va takrorlang', en: 'Watch, then try' },
    title: { ru: 'Считаем бордюр', uz: 'Bordyurni hisoblaymiz', en: 'Computing the border' },
    demo_banner: { ru: 'Смотри — покажу на примере', uz: "Qarang — misolda ko'rsataman", en: 'Watch — I will show an example' },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    demo_lines: [
      { ru: 'бордюр по краю: нужна длина', uz: 'bordyur chetidan: uzunlik kerak', en: 'the border is along the edge: length' },
      { ru: 'C = 3,14 · 6', uz: 'C = 3,14 · 6', en: 'C = 3.14 · 6' },
      { ru: 'C = 18,84 м', uz: 'C = 18,84 m', en: 'C = 18.84 m' },
    ],
    demo_note: {
      ru: 'Диаметр дан прямо, поэтому берём формулу с диаметром. Ответ в метрах: это длина.',
      uz: "Diametr to'g'ridan berilgan, shuning uchun diametrli formulani olamiz. Javob metrda: bu uzunlik.",
      en: 'The diameter is given directly, so use the formula with the diameter. The answer is in metres: a length.',
    },
    play_ask: { ru: 'Та же клумба. Сколько травы нужно, если r = 3 м?', uz: "Xuddi shu gulzor. r = 3 m bo'lsa, qancha o't kerak?", en: 'The same bed. How much grass if r = 3 m?' },
    play_opts: ['28,26 м²', '18,84 м²', '9 м²'],
    play_correct: 0,
    play_ok: {
      ru: 'Верно. 3 · 3 = 9, потом 3,14 · 9 = 28,26 м².',
      uz: "To'g'ri. 3 · 3 = 9, keyin 3,14 · 9 = 28,26 m².",
      en: 'Right. 3 · 3 = 9, then 3.14 · 9 = 28.26 m².',
    },
    play_wrong: [
      null,
      { ru: 'Это длина окружности, а трава ложится внутри.', uz: "Bu aylana uzunligi, o't esa ichiga tushadi.", en: 'That is the circumference, but grass lies inside.' },
      { ru: 'Про π забыли: это площадь квадрата 3 на 3.', uz: "π unutilgan: bu 3 ga 3 kvadratning yuzi.", en: 'π was forgotten: that is a 3 by 3 square.' },
    ],
    audio: {
      intro: {
        ru: 'Посчитаем бордюр для клумбы. Поперечник шесть метров, это диаметр.',
        uz: "Gulzor uchun bordyurni hisoblaymiz. Eni olti metr, bu diametr.",
        en: 'Let us compute the border for the bed. It is six metres across, that is the diameter.',
      },
      demo: {
        ru: 'Бордюр идёт по краю, значит нужна длина окружности. Диаметр дан, берём формулу пи умножить на диаметр: три целых четырнадцать сотых умножить на шесть это восемнадцать и восемьдесят четыре сотых метра. Единица метры, и это правильно: длину меряют в метрах.',
        uz: "Bordyur chetidan boradi, demak aylana uzunligi kerak. Diametr berilgan, pi kara diametr formulasini olamiz: uch butun yuzdan o'n to'rt kara olti o'n sakkiz butun yuzdan sakson to'rt metr. Birlik metr va bu to'g'ri: uzunlik metrda o'lchanadi.",
        en: 'The border runs along the edge, so we need the circumference. The diameter is given, so use pi times the diameter: three point one four times six is eighteen point eight four metres. The unit is metres, which is right: length is measured in metres.',
      },
      play: {
        ru: 'Теперь ваша очередь. Та же клумба, радиус три метра. Сколько травы нужно?',
        uz: "Endi sizning navbatingiz. Xuddi shu gulzor, radiusi uch metr. Qancha o't kerak?",
        en: 'Now it is your turn. The same bed, radius three metres. How much grass is needed?',
      },
      ok: {
        ru: 'Верно. Трава ложится внутри, значит считаем площадь круга.',
        uz: "To'g'ri. O't ichiga tushadi, demak doira yuzini hisoblaymiz.",
        en: 'Right. Grass lies inside, so we compute the area.',
      },
      wrong: {
        ru: 'Трава покрывает поверхность, значит нужна площадь, и единица квадратная.',
        uz: "O't yuzani qoplaydi, demak yuza kerak va birlik kvadrat.",
        en: 'Grass covers a surface, so area is needed and the unit is square.',
      },
    },
  },

  s_more: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Симметрия и данные в проекте', uz: "Loyihada simmetriya va ma'lumotlar", en: 'Symmetry and data in a project' },
    lines: [
      { ru: 'у круга осей бесконечно много, центр один', uz: "doirada o'q cheksiz, markaz bitta", en: 'a disc has endless axes and one centre' },
      { ru: 'опрос о цветах: 4, 5, 5, 6, 20 голосов', uz: "gullar so'rovi: 4, 5, 5, 6, 20 ovoz", en: 'a flower survey: 4, 5, 5, 6, 20 votes' },
      { ru: 'медиана 5 честнее среднего 8', uz: "mediana 5 o'rtacha 8 dan halolroq", en: 'the median 5 beats the mean 8' },
    ],
    done: {
      ru: 'В одном проекте работают все темы раздела: формы, симметрия и данные. Каждая отвечает на свой вопрос.',
      uz: "Bitta loyihada bo'limning barcha mavzulari ishlaydi: shakllar, simmetriya va ma'lumotlar. Har biri o'z savoliga javob beradi.",
      en: 'One project uses every topic of the section: shapes, symmetry and data. Each answers its own question.',
    },
    audio: {
      ru: [
        'В проекте клумбы есть и симметрия. Круг можно сложить по любой прямой через центр, значит осей бесконечно много, а центр симметрии один: сам центр клумбы.',
        'А ещё в проекте есть опрос: какие цветы посадить. Голоса вышли такие: четыре, пять, пять, шесть и двадцать.',
        'Мода пять, медиана тоже пять, а среднее восемь. Одно большое число подняло среднее, поэтому о типичном мнении класса честнее говорить медианой. Всё это темы одного раздела.',
      ],
      uz: [
        "Gulzor loyihasida simmetriya ham bor. Doirani markazdan o'tgan har qanday to'g'ri chiziq bo'ylab buklash mumkin, demak o'qlar cheksiz, simmetriya markazi esa bitta: gulzorning o'z markazi.",
        "Loyihada yana so'rov ham bor: qanday gul ekish kerak. Ovozlar shunday chiqdi: to'rt, besh, besh, olti va yigirma.",
        "Moda besh, mediana ham besh, o'rtacha esa sakkiz. Bitta katta son o'rtachani ko'tardi, shuning uchun sinfning tipik fikri haqida mediana bilan gapirish halolroq. Bularning hammasi bitta bo'lim mavzulari.",
      ],
      en: [
        'The bed project has symmetry too. A disc folds along any line through the centre, so it has endless axes, and one centre of symmetry: the centre of the bed.',
        'The project also has a survey: which flowers to plant. The votes came out four, five, five, six and twenty.',
        'The mode is five, the median is five too, and the mean is eight. One big number lifted the mean, so the typical view of the class is described more honestly by the median. All of this is one section.',
      ],
    },
  },

  s_solve: {
    eyebrow: { ru: 'Решаем вместе', uz: 'Birga yechamiz', en: 'Solving together' },
    title: { ru: 'Треугольный флажок', uz: 'Uchburchak flajok', en: 'The triangular flag' },
    lead: { ru: 'Флажок со сторонами 3, 4 и 5 дм, основание 4, высота 3.', uz: 'Tomonlari 3, 4 va 5 dm flajok, asosi 4, balandligi 3.', en: 'A flag with sides 3, 4, 5 dm; base 4, height 3.' },
    steps: [
      { ru: 'тесьма по краю: 3 + 4 + 5 = 12 дм', uz: 'chetiga jiyak: 3 + 4 + 5 = 12 dm', en: 'trim along the edge: 3 + 4 + 5 = 12 dm' },
      { ru: 'ткань внутри: 4 · 3 : 2 = 6 дм²', uz: 'ichiga mato: 4 · 3 : 2 = 6 dm²', en: 'cloth inside: 4 · 3 : 2 = 6 dm²' },
      { ru: 'единицы разные: дм и дм²', uz: 'birliklar har xil: dm va dm²', en: 'different units: dm and dm²' },
    ],
    done: {
      ru: 'Одна фигура, два вопроса, две формулы. Периметр складывает стороны, площадь перемножает основание с высотой и делит на два.',
      uz: "Bitta shakl, ikki savol, ikki formula. Perimetr tomonlarni qo'shadi, yuza asosni balandlikka ko'paytirib ikkiga bo'ladi.",
      en: 'One shape, two questions, two formulas. The perimeter adds the sides, the area multiplies base by height and halves it.',
    },
    audio: {
      ru: [
        'Решаем вместе. На выставке есть треугольный флажок со сторонами три, четыре и пять дециметров.',
        'Сначала тесьма: она идёт по краю, значит это периметр. Складываем стороны: три плюс четыре плюс пять это двенадцать дециметров.',
        'Теперь ткань: она внутри, значит это площадь. Основание четыре, высота три: четыре умножить на три это двенадцать, делим на два, получается шесть квадратных дециметров. Обратите внимание на единицы: у тесьмы дециметры, у ткани квадратные дециметры.',
      ],
      uz: [
        "Birga yechamiz. Ko'rgazmada tomonlari uch, to'rt va besh detsimetr bo'lgan uchburchak flajok bor.",
        "Avval jiyak: u chetidan boradi, demak bu perimetr. Tomonlarni qo'shamiz: uch qo'shuv to'rt qo'shuv besh o'n ikki detsimetr.",
        "Endi mato: u ichida, demak bu yuza. Asos to'rt, balandlik uch: to'rt kara uch o'n ikki, ikkiga bo'lamiz, olti kvadrat detsimetr chiqadi. Birliklarga e'tibor bering: jiyakda detsimetr, matoda kvadrat detsimetr.",
      ],
      en: [
        'Let us solve it together. The fair has a triangular flag with sides three, four and five decimetres.',
        'First the trim: it runs along the edge, so that is the perimeter. Add the sides: three plus four plus five is twelve decimetres.',
        'Now the cloth: it is inside, so that is the area. Base four, height three: four times three is twelve, divide by two and get six square decimetres. Note the units: decimetres for the trim, square decimetres for the cloth.',
      ],
    },
  },

  s_edge: {
    eyebrow: { ru: 'Где ошибаются', uz: 'Qayerda xato qilishadi', en: 'Where mistakes happen' },
    title: { ru: 'Три ошибки раздела', uz: "Bo'limning uch xatosi", en: 'Three mistakes of the section' },
    bad_line: { ru: 'ошибка: 2πr вместо πr² и наоборот', uz: "xato: πr² o'rniga 2πr va teskarisi", en: 'mistake: 2πr instead of πr² and back' },
    good_line: { ru: 'ошибка: диаметр подставили вместо радиуса', uz: "xato: radius o'rniga diametr qo'yilgan", en: 'mistake: the diameter used as the radius' },
    warn_line: { ru: 'ошибка: см³ назвали литрами, медиану взяли без порядка', uz: "xato: sm³ litr deb atalgan, mediana tartiblamasdan olingan", en: 'mistake: cm³ called litres, median taken unsorted' },
    done: {
      ru: 'Все три ошибки ловятся одинаково: назвать вслух единицу и проверить ответ на разумность. Метры это длина, квадратные — площадь, кубические — объём.',
      uz: "Uchala xato ham bir xil ushlanadi: birlikni ovoz chiqarib aytish va javobning mantiqiyligini tekshirish. Metr — uzunlik, kvadrat — yuza, kub — hajm.",
      en: 'All three are caught the same way: say the unit out loud and sanity check the answer. Metres are length, square metres area, cubic metres volume.',
    },
    audio: {
      ru: [
        'Соберём главные ошибки раздела в одном месте. Первая: путают длину окружности и площадь круга. Лечится единицей: длина в метрах, площадь в квадратных метрах.',
        'Вторая: в формулу подставляют диаметр вместо радиуса. Тогда длина выходит вдвое больше, а площадь вчетверо. Всегда спрашивайте себя, что дано: от центра до края это радиус.',
        'Третья про единицы и данные: кубические сантиметры называют литрами, хотя литр это тысяча кубических сантиметров, и берут медиану, не упорядочив числа. Обе ошибки в невнимании к порядку и к названию.',
      ],
      uz: [
        "Bo'limning asosiy xatolarini bir joyga yig'amiz. Birinchisi: aylana uzunligi va doira yuzini chalkashtirishadi. Birlik yordam beradi: uzunlik metrda, yuza kvadrat metrda.",
        "Ikkinchisi: formulaga radius o'rniga diametr qo'yiladi. U holda uzunlik ikki barobar, yuza esa to'rt barobar katta chiqadi. Doim nima berilganini o'zingizdan so'rang: markazdan chetgacha bu radius.",
        "Uchinchisi birliklar va ma'lumotlar haqida: kub santimetrni litr deb atashadi, holbuki litr ming kub santimetr, medianani esa sonlarni tartiblamasdan olishadi. Ikkala xato ham tartibga va nomga e'tibor bermaslikdan.",
      ],
      en: [
        'Let us gather the main mistakes of the section in one place. First: confusing circumference with area. The unit fixes it: length in metres, area in square metres.',
        'Second: the diameter goes into the formula instead of the radius. Then the length doubles and the area quadruples. Always ask what is given: centre to edge is the radius.',
        'Third, about units and data: cubic centimetres get called litres, though a litre is a thousand of them, and the median gets taken without sorting. Both come from ignoring order and naming.',
      ],
    },
  },

  s_rule: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    title: { ru: 'Сводка раздела', uz: "Bo'lim xulosasi", en: 'The section in brief' },
    rule_1: {
      ru: 'По краю считают длину: C = πd и периметр как сумму сторон. Внутри считают площадь: S = πr² и S = ah : 2. Наполняют объёмом: V = a · b · c, где 1 дм³ = 1 литр.',
      uz: "Chetidan uzunlik hisoblanadi: C = πd va perimetr tomonlar yig'indisi. Ichidan yuza: S = πr² va S = ah : 2. To'ldirish hajm bilan: V = a · b · c, bunda 1 dm³ = 1 litr.",
      en: 'Along the edge you compute length: C = πd and the perimeter as a sum of sides. Inside you compute area: S = πr² and S = ah : 2. Filling uses volume: V = a · b · c, with 1 dm³ = 1 litre.',
    },
    rule_2: {
      ru: 'Симметрию проверяют складыванием и поворотом, данные описывают модой, медианой, средним и размахом. Клумба: бордюр по длине окружности, права была Зумрад.',
      uz: "Simmetriya buklash va burish bilan tekshiriladi, ma'lumotlar moda, mediana, o'rtacha va kenglik bilan tasvirlanadi. Gulzor: bordyur aylana uzunligi bilan, Zumrad haq edi.",
      en: 'Symmetry is tested by folding and turning; data is described by mode, median, mean and range. The bed: the border comes from the circumference, so Zumrad was right.',
    },
    audio: {
      ru: 'Соберём весь раздел. По краю фигуры считают длину: длина окружности это пи умножить на диаметр, а периметр это сумма сторон. Внутри фигуры считают площадь: у круга пи умножить на радиус в квадрате, у треугольника основание на высоту и разделить на два. Если фигуру наполняют, считают объём: произведение трёх измерений, и один кубический дециметр это литр. Симметрию проверяют складыванием и поворотом на пол-оборота. Данные описывают модой, медианой, средним и размахом. Вернёмся к клумбе. Бордюр идёт по краю, значит нужна длина окружности. Права была Зумрад.',
      uz: "Butun bo'limni yig'amiz. Shakl chetidan uzunlik hisoblanadi: aylana uzunligi pi kara diametr, perimetr esa tomonlar yig'indisi. Shakl ichidan yuza hisoblanadi: doirada pi kara radius kvadrat, uchburchakda asos kara balandlik bo'linsin ikkiga. Shakl to'ldirilsa, hajm hisoblanadi: uch o'lchov ko'paytmasi, bir kub detsimetr esa litr. Simmetriya buklash va yarim aylantirish bilan tekshiriladi. Ma'lumotlar moda, mediana, o'rtacha va kenglik bilan tasvirlanadi. Gulzorga qaytamiz. Bordyur chetidan boradi, demak aylana uzunligi kerak. Zumrad haq edi.",
      en: 'Let us gather the whole section. Along the edge you compute length: the circumference is pi times the diameter and the perimeter is the sum of the sides. Inside you compute area: for a disc pi times the radius squared, for a triangle base times height divided by two. If a shape is filled, you compute volume: the product of three measurements, and one cubic decimetre is a litre. Symmetry is tested by folding and by a half turn. Data is described by mode, median, mean and range. Back to the bed. The border runs along the edge, so we need the circumference. Zumrad was right.',
    },
  },

  s_pick: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Выбери формулу', uz: 'Formulani tanlang', en: 'Choose the formula' },
    lead: { ru: 'Считать пока не нужно: только выбери.', uz: 'Hozircha hisoblash shart emas: faqat tanlang.', en: 'No computing yet: just choose.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Забор вокруг круглой площадки. Что считаем?', uz: 'Dumaloq maydoncha atrofiga panjara. Nima hisoblanadi?', en: 'A fence around a round area. What do we compute?' },
        opts: [
          { ru: 'длину окружности', uz: 'aylana uzunligini', en: 'the circumference' },
          { ru: 'площадь круга', uz: 'doira yuzini', en: 'the area' },
          { ru: 'объём', uz: 'hajmni', en: 'the volume' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Забор идёт по краю.', uz: "To'g'ri. Panjara chetidan boradi.", en: 'Right. A fence runs along the edge.' },
        wrong: [
          null,
          { ru: 'Площадь нужна для того, что лежит внутри.', uz: 'Yuza ichidagi narsa uchun kerak.', en: 'Area is for what lies inside.' },
          { ru: 'Объём нужен для того, что наполняет.', uz: "Hajm to'ldiradigan narsa uchun kerak.", en: 'Volume is for what fills.' },
        ],
      },
      {
        q: { ru: 'Плитка на круглый пол беседки. Что считаем?', uz: 'Dumaloq ayvon poliga plitka. Nima hisoblanadi?', en: 'Tiles for a round floor. What do we compute?' },
        opts: [
          { ru: 'площадь круга', uz: 'doira yuzini', en: 'the area' },
          { ru: 'длину окружности', uz: 'aylana uzunligini', en: 'the circumference' },
          { ru: 'периметр', uz: 'perimetrni', en: 'the perimeter' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Плитка покрывает поверхность.', uz: "To'g'ri. Plitka yuzani qoplaydi.", en: 'Right. Tiles cover a surface.' },
        wrong: [
          null,
          { ru: 'Длина нужна для края, а плитка внутри.', uz: 'Uzunlik chet uchun, plitka esa ichida.', en: 'Length is for the edge; tiles go inside.' },
          { ru: 'Периметр это тоже длина по краю.', uz: 'Perimetr ham chetdan uzunlik.', en: 'A perimeter is a length along the edge too.' },
        ],
      },
      {
        q: { ru: 'Вода в прямоугольный бак. Что считаем?', uz: "To'g'ri burchakli bakka suv. Nima hisoblanadi?", en: 'Water for a rectangular tank. What do we compute?' },
        opts: [
          { ru: 'объём', uz: 'hajmni', en: 'the volume' },
          { ru: 'площадь дна', uz: 'tub yuzasini', en: 'the bottom area' },
          { ru: 'периметр', uz: 'perimetrni', en: 'the perimeter' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Вода наполняет бак, а значит это объём.', uz: "To'g'ri. Suv bakni to'ldiradi, demak bu hajm.", en: 'Right. Water fills the tank, so it is volume.' },
        wrong: [
          null,
          { ru: 'Площадь дна это только один слой.', uz: 'Tub yuzasi faqat bitta qavat.', en: 'The bottom area is only one layer.' },
          { ru: 'Периметр это длина по краю.', uz: 'Perimetr chetdan uzunlik.', en: 'A perimeter is a length along the edge.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на выбор формулы. Спрашивайте себя: это по краю, внутри или наполняет?',
        uz: "Formulani tanlash mashqi. O'zingizdan so'rang: bu chetdanmi, ichidanmi yoki to'ldiradimi?",
        en: 'Practice on choosing. Ask yourself: along the edge, inside, or filling?',
      },
    },
  },

  s_calc: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Считаем по разделу', uz: "Bo'lim bo'yicha hisoblaymiz", en: 'Computing across the section' },
    lead: { ru: 'Считай π равным 3,14.', uz: "π ni 3,14 deb oling.", en: 'Take π as 3.14.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Диаметр клумбы 10 м. Длина бордюра?', uz: 'Gulzor diametri 10 m. Bordyur uzunligi?', en: 'A bed 10 m across. Border length?' },
        opts: ['31,4 м', '78,5 м', '15,7 м'],
        correct: 0,
        ok: { ru: 'Верно. 3,14 · 10 = 31,4 м.', uz: "To'g'ri. 3,14 · 10 = 31,4 m.", en: 'Right. 3.14 · 10 = 31.4 m.' },
        wrong: [
          null,
          { ru: 'Это площадь круга, а бордюр по краю.', uz: 'Bu doira yuzi, bordyur esa chetdan.', en: 'That is the area; the border is on the edge.' },
          { ru: 'Радиус подставили вместо диаметра.', uz: "Diametr o'rniga radius qo'yilgan.", en: 'The radius was used instead of the diameter.' },
        ],
      },
      {
        q: { ru: 'Треугольник: основание 6, высота 5. Площадь?', uz: 'Uchburchak: asos 6, balandlik 5. Yuza?', en: 'A triangle: base 6, height 5. Area?' },
        opts: ['15', '30', '11'],
        correct: 0,
        ok: { ru: 'Верно. 6 · 5 : 2 = 15.', uz: "To'g'ri. 6 · 5 : 2 = 15.", en: 'Right. 6 · 5 : 2 = 15.' },
        wrong: [
          null,
          { ru: 'Это прямоугольник, треугольник вдвое меньше.', uz: "Bu to'rtburchak, uchburchak ikki barobar kichik.", en: 'That is the rectangle; the triangle is half.' },
          { ru: 'Это сумма, а площадь считают умножением.', uz: "Bu yig'indi, yuza ko'paytirish bilan topiladi.", en: 'That is a sum; area multiplies.' },
        ],
      },
      {
        q: { ru: 'Бак 20 на 20 на 20 см. Сколько литров?', uz: 'Bak 20 ga 20 ga 20 sm. Necha litr?', en: 'A 20 by 20 by 20 cm tank. Litres?' },
        opts: ['8 л', '8000 л', '60 л'],
        correct: 0,
        ok: { ru: 'Верно. 8000 см³, то есть 8 литров.', uz: "To'g'ri. 8000 sm³, ya'ni 8 litr.", en: 'Right. 8000 cm³, that is 8 litres.' },
        wrong: [
          null,
          { ru: 'Это кубические сантиметры, а не литры.', uz: 'Bu kub santimetr, litr emas.', en: 'Those are cubic centimetres, not litres.' },
          { ru: 'Измерения перемножают, а не складывают.', uz: "O'lchovlar ko'paytiriladi, qo'shilmaydi.", en: 'The measurements multiply, not add.' },
        ],
      },
      {
        q: { ru: 'Голоса 4, 5, 5, 6, 20. Чему равна медиана?', uz: 'Ovozlar 4, 5, 5, 6, 20. Mediana nechaga teng?', en: 'Votes 4, 5, 5, 6, 20. The median?' },
        opts: ['5', '8', '20'],
        correct: 0,
        ok: { ru: 'Верно. Ряд упорядочен, в середине 5.', uz: "To'g'ri. Qator tartibda, o'rtada 5.", en: 'Right. The row is sorted and 5 is in the middle.' },
        wrong: [
          null,
          { ru: 'Это среднее арифметическое.', uz: "Bu o'rtacha arifmetik.", en: 'That is the mean.' },
          { ru: 'Это наибольшее значение.', uz: 'Bu eng katta qiymat.', en: 'That is the largest value.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на весь раздел. Смотрите на вопрос и на единицу в ответе.',
        uz: "Butun bo'lim mashqi. Savolga va javobdagi birlikka qarang.",
        en: 'Practice across the section. Watch the question and the unit in the answer.',
      },
    },
  },

  s_bins: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'По краю или внутри', uz: 'Chetdanmi yoki ichidan', en: 'Edge or inside' },
    lead: { ru: 'Смотри, где именно располагается материал.', uz: 'Material aynan qayerda joylashishiga qarang.', en: 'See where the material actually goes.' },
    bin_a: { ru: 'Считаем длину', uz: 'Uzunlik hisoblanadi', en: 'Compute a length' },
    bin_b: { ru: 'Считаем площадь', uz: 'Yuza hisoblanadi', en: 'Compute an area' },
    cards: [
      { label: { ru: 'бордюр вокруг клумбы', uz: 'gulzor atrofiga bordyur', en: 'a border around a bed' }, bin: 'a' },
      { label: { ru: 'тесьма по краю флажка', uz: 'flajok chetiga jiyak', en: 'trim along a flag edge' }, bin: 'a' },
      { label: { ru: 'проволока вокруг обода', uz: 'chambarak atrofiga sim', en: 'wire around a rim' }, bin: 'a' },
      { label: { ru: 'трава внутри клумбы', uz: "gulzor ichiga o't", en: 'grass inside a bed' }, bin: 'b' },
      { label: { ru: 'ткань на флажок', uz: 'flajokka mato', en: 'cloth for a flag' }, bin: 'b' },
      { label: { ru: 'краска на круглый щит', uz: "dumaloq qalqonga bo'yoq", en: 'paint for a round board' }, bin: 'b' },
    ],
    hint: {
      ru: 'По краю — длина в метрах, по поверхности — площадь в квадратных метрах.',
      uz: "Chetdan — metrda uzunlik, yuzadan — kvadrat metrda yuza.",
      en: 'Along the edge is length in metres, over the surface is area in square metres.',
    },
    correct_text: {
      ru: 'Верно. Вопрос задачи выбирает формулу, а единица подтверждает выбор.',
      uz: "To'g'ri. Masala savoli formulani tanlaydi, birlik esa tanlovni tasdiqlaydi.",
      en: 'Right. The question picks the formula and the unit confirms the choice.',
    },
    audio: {
      intro: {
        ru: 'Разложите случаи по двум корзинам. По краю или по поверхности?',
        uz: 'Hollarni ikki savatga ajrating. Chetdanmi yoki yuzadan?',
        en: 'Sort the cases into two baskets. Along the edge or over the surface?',
      },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда. Это по краю или внутри?', uz: 'Bu yerga emas. Bu chetdanmi yoki ichidan?', en: 'Not here. Edge or inside?' },
    },
  },

  s_error: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikidek tekshiring.", en: 'Check someone else’s work the way you would check your own.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Азиз: «Бордюр для клумбы r = 3: S = 28,26 м». Проверь.', uz: "Aziz: «r = 3 gulzor bordyuri: S = 28,26 m». Tekshiring.", en: 'Aziz: “Border for r = 3: S = 28.26 m.” Check it.' },
        opts: [
          { ru: 'Нет: это площадь, а бордюр 18,84 м', uz: "Yo'q: bu yuza, bordyur esa 18,84 m", en: 'No: that is the area; the border is 18.84 m' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, бордюр 9 м', uz: "Yo'q, bordyur 9 m", en: 'No, the border is 9 m' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Единица выдала ошибку: у площади квадратные метры.', uz: "To'g'ri. Birlik xatoni oshkor qildi: yuzada kvadrat metr bo'ladi.", en: 'Right. The unit gave it away: area is in square metres.' },
        wrong: [
          null,
          { ru: 'Бордюр идёт по краю, значит это длина окружности.', uz: 'Bordyur chetdan boradi, demak bu aylana uzunligi.', en: 'The border runs along the edge: that is a circumference.' },
          { ru: 'Про π забыли.', uz: "π unutilgan.", en: 'π was forgotten.' },
        ],
      },
      {
        q: { ru: 'Зумрад: «Бак 30 на 10 на 10 см — это 3000 литров». Проверь.', uz: "Zumrad: «Bak 30 ga 10 ga 10 sm — bu 3000 litr». Tekshiring.", en: 'Zumrad: “A 30 by 10 by 10 cm tank is 3000 litres.” Check it.' },
        opts: [
          { ru: 'Нет: 3000 см³, то есть 3 литра', uz: "Yo'q: 3000 sm³, ya'ni 3 litr", en: 'No: 3000 cm³, that is 3 litres' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, 30 литров', uz: "Yo'q, 30 litr", en: 'No, 30 litres' },
        ],
        correct: 0,
        ok: { ru: 'Верно. В литре тысяча кубических сантиметров.', uz: "To'g'ri. Litrda ming kub santimetr bor.", en: 'Right. A litre holds a thousand cubic centimetres.' },
        wrong: [
          null,
          { ru: 'Число посчитано верно, но названо не той единицей.', uz: "Son to'g'ri hisoblangan, lekin noto'g'ri birlik bilan atalgan.", en: 'The number is right but named with the wrong unit.' },
          { ru: 'Делить надо на 1000, а не на 100.', uz: "1000 ga bo'lish kerak, 100 ga emas.", en: 'Divide by 1000, not 100.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Проверьте чужое решение. Смотрите на единицу: она часто и выдаёт ошибку.',
        uz: "Birovning yechimini tekshiring. Birlikka qarang: ko'pincha aynan u xatoni oshkor qiladi.",
        en: 'Check someone else’s work. Watch the unit: it often gives the mistake away.',
      },
    },
  },

  s_task: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    title: { ru: 'Выставка проектов', uz: "Loyihalar ko'rgazmasi", en: 'The project fair' },
    lead: { ru: 'Клумба d = 6 м, флажок 3-4-5 дм, бак 20 на 20 на 20 см.', uz: 'Gulzor d = 6 m, flajok 3-4-5 dm, bak 20 ga 20 ga 20 sm.', en: 'Bed d = 6 m, flag 3-4-5 dm, tank 20 by 20 by 20 cm.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Сколько метров бордюра нужно для клумбы?', uz: 'Gulzorga necha metr bordyur kerak?', en: 'How many metres of border?' },
        opts: ['18,84 м', '28,26 м', '9,42 м'],
        correct: 0,
        ok: { ru: 'Верно. 3,14 · 6 = 18,84 м.', uz: "To'g'ri. 3,14 · 6 = 18,84 m.", en: 'Right. 3.14 · 6 = 18.84 m.' },
        wrong: [
          null,
          { ru: 'Это площадь круга радиуса 3.', uz: 'Bu radiusi 3 doiraning yuzi.', en: 'That is the area of radius 3.' },
          { ru: 'Это половина окружности.', uz: 'Bu aylananing yarmi.', en: 'That is half the circumference.' },
        ],
      },
      {
        q: { ru: 'Сколько ткани на флажок с основанием 4 и высотой 3?', uz: 'Asosi 4, balandligi 3 flajokka qancha mato?', en: 'Cloth for a flag, base 4, height 3?' },
        opts: ['6 дм²', '12 дм²', '12 дм'],
        correct: 0,
        ok: { ru: 'Верно. 4 · 3 : 2 = 6 дм².', uz: "To'g'ri. 4 · 3 : 2 = 6 dm².", en: 'Right. 4 · 3 : 2 = 6 dm².' },
        wrong: [
          null,
          { ru: 'Про деление на два забыли.', uz: "Ikkiga bo'lish unutilgan.", en: 'The halving was forgotten.' },
          { ru: 'Это периметр, а ткань кладут внутрь.', uz: "Bu perimetr, mato esa ichiga qo'yiladi.", en: 'That is the perimeter; cloth goes inside.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Задача по выставке. Клумба шесть метров в поперечнике, флажок со сторонами три, четыре и пять дециметров, бак двадцать на двадцать на двадцать сантиметров.',
        uz: "Ko'rgazma bo'yicha masala. Gulzor eni olti metr, flajok tomonlari uch, to'rt va besh detsimetr, bak yigirma ga yigirma ga yigirma santimetr.",
        en: 'A fair problem. The bed is six metres across, the flag has sides three, four and five decimetres, the tank is twenty by twenty by twenty centimetres.',
      },
    },
  },

  s_final: {
    eyebrow: { ru: 'Финал', uz: 'Final', en: 'Final' },
    intro_line: { ru: 'Пять заданий на весь раздел.', uz: "Butun bo'limga beshta topshiriq.", en: 'Five tasks covering the section.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        kind: 'num', ans: 12,
        q: { ru: 'Треугольник со сторонами 3, 4 и 5 дм. Найди периметр.', uz: 'Tomonlari 3, 4 va 5 dm uchburchak. Perimetrni toping.', en: 'A triangle with sides 3, 4, 5 dm. Find the perimeter.' },
        hint: { ru: 'Периметр — сумма всех сторон.', uz: "Perimetr — barcha tomonlar yig'indisi.", en: 'The perimeter is the sum of the sides.' },
        hint_audio: { ru: 'Периметр это сумма всех сторон, значит сложите три, четыре и пять.', uz: "Perimetr barcha tomonlar yig'indisi, demak uch, to'rt va beshni qo'shing.", en: 'The perimeter is the sum of the sides, so add three, four and five.' },
      },
      {
        kind: 'mc', correctIndex: 2,
        q: { ru: 'Что нужно для травы внутри круглой клумбы?', uz: "Dumaloq gulzor ichidagi o't uchun nima kerak?", en: 'What is needed for grass inside a round bed?' },
        opts: ['C = πd', 'V = abc', 'S = πr²', 'P = сумма сторон'],
        wrong: [
          { ru: 'Это длина по краю.', uz: 'Bu chetdan uzunlik.', en: 'That is the edge length.' },
          { ru: 'Это объём, он для наполнения.', uz: "Bu hajm, u to'ldirish uchun.", en: 'That is volume, for filling.' },
          null,
          { ru: 'Периметр у круга не считают: у него нет сторон.', uz: "Doirada perimetr hisoblanmaydi: uning tomonlari yo'q.", en: 'A disc has no sides to add.' },
        ],
        correct: { ru: 'Верно. Трава внутри, значит площадь круга.', uz: "To'g'ri. O't ichida, demak doira yuzi.", en: 'Right. Grass is inside, so the area of the disc.' },
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'Сколько осей симметрии у прямоугольника?', uz: "To'g'ri to'rtburchakning nechta simmetriya o'qi bor?", en: 'How many symmetry axes has a rectangle?' },
        opts: ['4', '2', '1', 'бесконечно много'],
        wrong: [
          { ru: 'Четыре у квадрата.', uz: "To'rtta kvadratda.", en: 'Four belongs to a square.' },
          null,
          { ru: 'Он складывается и вдоль, и поперёк.', uz: "U bo'yiga ham, ko'ndalangiga ham buklanadi.", en: 'It folds both lengthwise and crosswise.' },
          { ru: 'Бесконечно много только у круга.', uz: "Cheksiz ko'p faqat doirada.", en: 'Only a disc has endless axes.' },
        ],
        correct: { ru: 'Верно. По диагонали половинки не совпадают.', uz: "To'g'ri. Diagonal bo'ylab yarmilar mos tushmaydi.", en: 'Right. Along a diagonal the halves do not match.' },
      },
      {
        kind: 'mc', correctIndex: 3,
        q: { ru: 'Куб 10 на 10 на 10 см. Сколько это литров?', uz: 'Kub 10 ga 10 ga 10 sm. Bu necha litr?', en: 'A 10 by 10 by 10 cm cube. How many litres?' },
        opts: ['10 л', '100 л', '1000 л', '1 л'],
        wrong: [
          { ru: 'Десять это длина ребра.', uz: "O'n bu qirra uzunligi.", en: 'Ten is the edge length.' },
          { ru: 'Сто это площадь грани.', uz: 'Yuz bu yoq yuzasi.', en: 'A hundred is a face area.' },
          { ru: 'Тысяча это кубические сантиметры.', uz: 'Ming bu kub santimetr.', en: 'A thousand is in cubic centimetres.' },
          null,
        ],
        correct: { ru: 'Верно. 1000 см³ = 1 дм³ = 1 литр.', uz: "To'g'ri. 1000 sm³ = 1 dm³ = 1 litr.", en: 'Right. 1000 cm³ = 1 dm³ = 1 litre.' },
      },
      {
        kind: 'mc', correctIndex: 0,
        q: { ru: 'Клумба d = 6 м. Бордюр по краю. Что считаем?', uz: 'Gulzor d = 6 m. Chetiga bordyur. Nima hisoblanadi?', en: 'A bed d = 6 m with a border. What do we compute?' },
        opts: [
          { ru: 'длину окружности', uz: 'aylana uzunligini', en: 'the circumference' },
          { ru: 'площадь круга', uz: 'doira yuzini', en: 'the area' },
          { ru: 'объём', uz: 'hajmni', en: 'the volume' },
          { ru: 'размах', uz: 'kenglikni', en: 'the range' },
        ],
        wrong: [
          null,
          { ru: 'Площадь понадобится для травы внутри.', uz: "Yuza ichidagi o't uchun kerak bo'ladi.", en: 'Area is for the grass inside.' },
          { ru: 'Объём нужен, когда что-то наполняют.', uz: "Hajm nimadir to'ldirilganda kerak.", en: 'Volume is for filling.' },
          { ru: 'Размах это про данные, а не про фигуру.', uz: "Kenglik ma'lumotlar haqida, shakl haqida emas.", en: 'The range is about data, not shapes.' },
        ],
        correct: { ru: 'Верно. Бордюр идёт по краю: C = 3,14 · 6 = 18,84 м.', uz: "To'g'ri. Bordyur chetdan boradi: C = 3,14 · 6 = 18,84 m.", en: 'Right. The border is on the edge: C = 3.14 · 6 = 18.84 m.' },
      },
    ],
    audio: {
      intro: {
        ru: 'Финальная проверка по всему разделу. Пять заданий. Первое с набором числа, остальные с выбором.',
        uz: "Butun bo'lim bo'yicha yakuniy tekshiruv. Beshta topshiriq. Birinchisida son teriladi, qolganlarida tanlanadi.",
        en: 'The final check for the whole section. Five tasks. The first needs a typed number, the rest are multiple choice.',
      },
      on_correct: { ru: 'Верно.', uz: "To'g'ri.", en: 'Right.' },
      on_wrong: { ru: 'Посмотри разбор.', uz: 'Tushuntirishga qarang.', en: 'Look at the explanation.' },
    },
    fact: {
      ru: 'Длина, площадь и объём растут по-разному, и это видно по единицам. Увеличьте фигуру вдвое: длина вырастет в 2 раза, площадь в 4, а объём в 8. Поэтому большой воздушный шар поднимает намного больше груза, чем маленький, а тонкая ветка ломается под весом, который толстая держит легко.',
      uz: "Uzunlik, yuza va hajm har xil o'sadi va bu birliklardan ko'rinadi. Shaklni ikki barobar kattalashtiring: uzunlik 2, yuza 4, hajm esa 8 barobar oshadi. Shuning uchun katta havo shari kichigidan ancha ko'p yuk ko'taradi, ingichka shox esa yo'g'oni osongina ushlab turadigan og'irlikdan sinadi.",
      en: 'Length, area and volume grow differently, and the units show it. Double a shape: length grows 2 times, area 4 and volume 8. That is why a large balloon lifts far more than a small one, and a thin branch snaps under a weight a thick one holds easily.',
    },
    fact_audio: {
      ru: 'Знаешь ли ты? Длина, площадь и объём растут по-разному, и это видно по единицам. Увеличь фигуру вдвое: длина вырастет в два раза, площадь в четыре, а объём в восемь. Поэтому большой воздушный шар поднимает намного больше груза, чем маленький, а тонкая ветка ломается под весом, который толстая держит легко.',
      uz: "Bilasizmi? Uzunlik, yuza va hajm har xil o'sadi va bu birliklardan ko'rinadi. Shaklni ikki barobar kattalashtiring: uzunlik ikki, yuza to'rt, hajm esa sakkiz barobar oshadi. Shuning uchun katta havo shari kichigidan ancha ko'p yuk ko'taradi, ingichka shox esa yo'g'oni osongina ushlab turadigan og'irlikdan sinadi.",
      en: 'Did you know? Length, area and volume grow differently, and the units show it. Double a shape: length grows two times, area four and volume eight. That is why a large balloon lifts far more than a small one, and a thin branch snaps under a weight a thick one holds easily.',
    },
  },

  s14: {
    eyebrow: { ru: 'Раздел пройден', uz: "Bo'lim o'tildi", en: 'Section finished' },
    banner: { ru: 'Математика · Итог раздела', uz: "Matematika · Bo'lim yakuni", en: 'Mathematics · Section review' },
    heading: { ru: 'Геометрия и данные', uz: "Geometriya va ma'lumotlar", en: 'Geometry and data' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    brief_1: { ru: 'по краю — длина, внутри — площадь', uz: 'chetdan — uzunlik, ichidan — yuza', en: 'edge means length, inside means area' },
    brief_2: { ru: 'наполнить — объём, 1 дм³ = 1 л', uz: "to'ldirish — hajm, 1 dm³ = 1 l", en: 'filling means volume, 1 dm³ = 1 L' },
    brief_3: { ru: 'данные описывают четырьмя числами', uz: "ma'lumotlar to'rt son bilan tasvirlanadi", en: 'data is described by four numbers' },
    memo_title: { ru: 'Что помнить', uz: 'Nimani eslash kerak', en: 'What to remember' },
    memo_q1: { ru: 'Единица в ответе', uz: 'Javobdagi birlik', en: 'The unit in the answer' },
    memo_a1: { ru: 'проверяет выбор формулы', uz: 'formulani tanlashni tekshiradi', en: 'checks the formula choice' },
    memo_q2: { ru: 'Ось и центр', uz: "O'q va markaz", en: 'Axis and centre' },
    memo_a2: { ru: 'проверяют по отдельности', uz: 'alohida tekshiriladi', en: 'are checked separately' },
    memo_q3: { ru: 'Частая ошибка', uz: 'Tez-tez uchraydigan xato', en: 'A common mistake' },
    memo_a3: { ru: 'взять диаметр вместо радиуса', uz: "radius o'rniga diametr olish", en: 'using the diameter as the radius' },
    audio: {
      ru: [
        'Раздел пройден, а с ним и весь курс шестого класса. Соберём главное.',
        'Если что-то идёт по краю, считаем длину: длина окружности это пи умножить на диаметр, периметр это сумма сторон. Если что-то покрывает фигуру внутри, считаем площадь. Если наполняет, считаем объём, и один кубический дециметр это литр.',
        'Симметрию проверяем складыванием и поворотом, а данные описываем модой, медианой, средним и размахом. Единица в ответе всегда подскажет, та ли формула взята.',
      ],
      uz: [
        "Bo'lim o'tildi, u bilan birga oltinchi sinf kursi ham. Asosiysini yig'amiz.",
        "Biror narsa chetdan borsa, uzunlik hisoblanadi: aylana uzunligi pi kara diametr, perimetr tomonlar yig'indisi. Biror narsa shaklni ichidan qoplasa, yuza hisoblanadi. To'ldirsa, hajm hisoblanadi va bir kub detsimetr litr bo'ladi.",
        "Simmetriyani buklash va burish bilan tekshiramiz, ma'lumotlarni esa moda, mediana, o'rtacha va kenglik bilan tasvirlaymiz. Javobdagi birlik doim formula to'g'ri olinganini aytib turadi.",
      ],
      en: [
        'The section is done, and with it the whole sixth grade course. Let us gather the main points.',
        'If something runs along the edge, compute length: the circumference is pi times the diameter and the perimeter is a sum of sides. If something covers the inside, compute area. If it fills, compute volume, and one cubic decimetre is a litre.',
        'Symmetry is tested by folding and turning, and data is described by mode, median, mean and range. The unit in the answer always tells whether the formula was the right one.',
      ],
    },
  },

  s_methods: {
    m1_title: { ru: 'Способ. Спроси о материале', uz: "Usul. Material haqida so'rang", en: 'Method. Ask about the material' },
    m1_steps: {
      ru: ['Где ляжет материал: по краю, внутри или внутрь объёма', 'Возьми формулу этого вида', 'Проверь единицу: м, м² или м³'],
      uz: ["Material qayerga tushadi: chetdan, ichidan yoki hajmga", 'Shu turdagi formulani oling', "Birlikni tekshiring: m, m² yoki m³"],
      en: ['Where the material goes: edge, surface or inside a volume', 'Take the formula of that kind', 'Check the unit: m, m² or m³'],
    },
    m1_no: {
      ru: 'Если единица в ответе не та, что нужна по смыслу, формула выбрана неверно.',
      uz: "Javobdagi birlik mazmunan kerakli bo'lmasa, formula noto'g'ri tanlangan.",
      en: 'If the unit does not match the sense of the question, the formula was wrong.',
    },
  },
};

// ============================================================
// СЦЕНЫ УРОКА: выставка школьных проектов раздела.
// ============================================================
const HookScene = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="d46hall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#EAF4F9"/><stop offset="100%" stopColor="#F9F4EB"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="400" height="154" fill="url(#d46hall)"/>

    {/* Гирлянда флажков над выставкой */}
    <path d="M8 16 q100 18 196 4 q96 -14 188 8" fill="none" stroke="#C9A472" strokeWidth="1.6"/>
    {[0, 1, 2, 3, 4, 5].map((k) => (
      <path key={k} className="d46-flag" d={`M${34 + k * 62} 20 l14 0 l-7 16 z`}
        fill={['#D9603F', '#7ECBE6', '#8FBF7F', '#F5C77E', '#019ACB', '#B99B72'][k]}/>
    ))}

    {/* Проект 1: круглая клумба с бордюром */}
    <g>
      <circle cx="86" cy="94" r="34" fill="#8FBF7F" stroke="#6FA463" strokeWidth="2"/>
      <circle className="d46-edge" cx="86" cy="94" r="34" fill="none" stroke="#D9603F" strokeWidth="4"/>
      {[0, 1, 2, 3].map((k) => (
        <circle key={k} cx={86 + 18 * Math.cos(k * 1.6)} cy={94 + 18 * Math.sin(k * 1.6)} r="4" fill="#F5C77E"/>
      ))}
      <path d="M56 94 h60" stroke="#FFFDF7" strokeWidth="1.6" strokeDasharray="4 3"/>
      <text x="86" y="140" textAnchor="middle" fill="#8A8883"
        fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">d = 6</text>
    </g>

    {/* Проект 2: треугольный флажок */}
    <g>
      <path d="M180 122 L180 62 L232 122 z" fill="#7ECBE6" stroke="#4F9EBB" strokeWidth="2"/>
      <text x="206" y="140" textAnchor="middle" fill="#8A8883"
        fontFamily="'Manrope', system-ui, sans-serif" fontSize="10" fontWeight="700">3-4-5</text>
    </g>

    {/* Проект 3: бак и табличка опроса */}
    <g>
      <rect x="256" y="82" width="44" height="40" rx="3" fill="#DFF0F7" stroke="#8E8578" strokeWidth="2"/>
      <rect x="259" y="94" width="38" height="26" fill="#8FCBE0"/>
      <text x="278" y="140" textAnchor="middle" fill="#8A8883"
        fontFamily="'Manrope', system-ui, sans-serif" fontSize="10" fontWeight="700">20 sm</text>
    </g>
    <g>
      <rect x="316" y="62" width="72" height="60" rx="4" fill="#FFFDF7" stroke="#C9A472" strokeWidth="2"/>
      {[4, 5, 5, 6, 20].map((v, i) => (
        <rect key={i} x="322" y={68 + i * 11} width={v === 20 ? 60 : v * 3} height="7" rx="2"
          fill={v === 20 ? '#D9603F' : '#7ECBE6'}/>
      ))}
    </g>

    <Person x={34} ground={140} head={12} shirt="#F5C77E" hair="#3E3128"/>
    <rect x="0" y="140" width="400" height="14" fill="#D2A96F"/>
  </svg>
);

// Итог: три вопроса и три формулы.
const FinalScene = () => {
  const lang = useLang();
  const rows = [
    { q: tri(lang, 'по краю', 'chetdan', 'along the edge'), f: 'C = πd', tone: '#019ACB', bg: '#E7F5FA' },
    { q: tri(lang, 'внутри', 'ichidan', 'inside'), f: 'S = πr²', tone: '#1F7A4D', bg: '#E3F0E8' },
    { q: tri(lang, 'наполнить', "to'ldirish", 'to fill'), f: 'V = abc', tone: '#8A6A22', bg: '#FBF3D6' },
  ];
  return (
    <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
      <rect x="0" y="0" width="400" height="92" fill="#F9F4EB"/>
      {rows.map((r, i) => (
        <g key={i} transform={`translate(${12 + i * 128}, 18)`}>
          <rect x="0" y="0" width="118" height="46" rx="8" fill={r.bg} stroke={r.tone} strokeWidth="2"/>
          <text x="59" y="20" textAnchor="middle" fill="#8A8883"
            fontFamily="'Manrope', system-ui, sans-serif" fontSize="10" fontWeight="700">{r.q}</text>
          <text x="59" y="38" textAnchor="middle" fill={r.tone}
            fontFamily="'JetBrains Mono', monospace" fontSize="14" fontWeight="700">{r.f}</text>
        </g>
      ))}
      <text x="200" y="82" textAnchor="middle" fill="#8A8883"
        fontFamily="'Manrope', system-ui, sans-serif" fontSize="11" fontWeight="700">
        {tri(lang, 'вопрос выбирает формулу, единица её проверяет',
          'savol formulani tanlaydi, birlik uni tekshiradi',
          'the question picks the formula, the unit checks it')}
      </text>
    </svg>
  );
};

// ============================================================
// БЛОКИ ЭКРАНОВ
// ============================================================
// Прибор урока: круг, у которого подсвечивается край или заливка.
const BedFig = ({ mode = 'edge', size = 'mid' }) => (
  <span className={'d46-bed-box d46-bed-' + size}>
    <svg viewBox="0 0 240 150" aria-hidden="true">
      <circle cx="112" cy="76" r="58" fill={mode === 'area' ? '#A9CFBA' : '#F4F1EA'}
        stroke={mode === 'edge' ? '#D9603F' : '#1F7A4D'} strokeWidth={mode === 'edge' ? 6 : 2.4}/>
      <path d="M54 76 h116" stroke="#8A8883" strokeWidth="2" strokeDasharray="5 4"/>
      <text x="112" y="70" textAnchor="middle" fill="#8A8883"
        fontFamily="'JetBrains Mono', monospace" fontSize="12" fontWeight="700">d</text>
      <text x="112" y="146" textAnchor="middle" fill={mode === 'edge' ? '#D9603F' : '#1F7A4D'}
        fontFamily="'JetBrains Mono', monospace" fontSize="13" fontWeight="700">
        {mode === 'edge' ? 'C = πd' : 'S = πr²'}
      </text>
    </svg>
  </span>
);

// Карта раздела: пять плиток.
const MapFig = ({ show = 0 }) => {
  const lang = useLang();
  const items = [
    tri(lang, 'окружность', 'aylana', 'circle'),
    tri(lang, 'симметрия', 'simmetriya', 'symmetry'),
    tri(lang, 'треугольник', 'uchburchak', 'triangle'),
    tri(lang, 'объём', 'hajm', 'volume'),
    tri(lang, 'данные', "ma'lumotlar", 'data'),
  ];
  return (
    <span className="d46-map">
      {items.map((s, i) => (
        <i key={i} className={'d46-tile d46-fade' + (i <= show * 2 + 1 ? ' d46-on' : '')}>{s}</i>
      ))}
    </span>
  );
};

const Line = ({ node, on }) => (
  <span className={'d46-line d46-fade' + (on ? ' d46-on' : '')}>{mt(node)}</span>
);

const RecallBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_recall;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d46-stage">
        <MapFig show={step}/>
      </div>
      {step >= 2 && (
        <div className="frame-success fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
        </div>
      )}
    </div>
  );
};

// Ядро: вопрос выбирает формулу.
const CoreBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_core;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d46-stage d46-stage-row">
        <BedFig size="sm" mode={step >= 1 ? 'area' : 'edge'}/>
        <span className="d46-col">
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

// Симметрия и данные в проекте.
const MoreBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_more;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d46-stage">
        <span className="d46-mini">
          <svg viewBox="0 0 300 92" aria-hidden="true">
            <circle cx="52" cy="46" r="34" fill="none" stroke="#019ACB" strokeWidth="2.4"/>
            <path d="M18 46 h68 M52 12 v68 M28 22 L76 70 M76 22 L28 70" stroke="#019ACB" strokeWidth="1.2" strokeDasharray="4 4"/>
            <circle cx="52" cy="46" r="4" fill="#D9603F"/>
            <g className={'d46-fade' + (step >= 1 ? ' d46-on' : '')}>
              {[4, 5, 5, 6, 20].map((v, i) => (
                <g key={i}>
                  <rect x="130" y={14 + i * 14} width={v === 20 ? 150 : v * 6} height="10" rx="3"
                    fill={v === 20 ? '#D9603F' : '#7ECBE6'}/>
                  <text x={v === 20 ? 274 : 136 + v * 6} y={23 + i * 14}
                    textAnchor={v === 20 ? 'end' : 'start'} fill={v === 20 ? '#FFFDF7' : '#4F9EBB'}
                    fontFamily="'JetBrains Mono', monospace" fontSize="9" fontWeight="700">{v}</text>
                </g>
              ))}
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
      <div className="frame fade-up delay-1 d46-stage d46-stage-row">
        <span className="d46-mini">
          <svg viewBox="0 0 200 130" aria-hidden="true">
            <path d="M40 108 L40 32 L136 108 z" fill={step >= 1 ? '#A9CFBA' : '#E7F5FA'}
              stroke={step >= 1 ? '#1F7A4D' : '#D9603F'} strokeWidth={step >= 1 ? 2.4 : 5}/>
            <text x="34" y="72" textAnchor="end" fill="#8A8883"
              fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">3</text>
            <text x="88" y="122" textAnchor="middle" fill="#8A8883"
              fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">4</text>
            <text x="102" y="66" fill="#8A8883"
              fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">5</text>
          </svg>
        </span>
        <span className="d46-col">
          {c.steps.map((s, i) => <Line key={i} node={t(s)} on={step >= i}/>)}
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

// Граница: три ошибки раздела.
const EdgeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_edge;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d46-stage">
        <span className="d46-pair d46-pair-bad"><Line node={t(c.bad_line)} on/></span>
        <span className={'d46-pair d46-pair-bad d46-fade' + (step >= 1 ? ' d46-on' : '')}>
          <Line node={t(c.good_line)} on/>
        </span>
        <span className={'d46-pair d46-pair-warn d46-fade' + (step >= 2 ? ' d46-on' : '')}>
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
        <div className={'d46-banner fade-up delay-1' + (phase === 'play' ? ' d46-banner-play' : '')}>
          {t(phase === 'demo' ? c.demo_banner : c.play_banner)}
        </div>

        <div className="frame fade-up delay-1 d46-stage d46-stage-tool d46-stage-row">
          {phase === 'demo' ? (
            <>
              <BedFig size="xs" mode="edge"/>
              <span className="d46-col">
                {c.demo_lines.map((l, i) => <Line key={i} node={t(l)} on={shown >= i}/>)}
                <p className={'body d46-verdict' + (done ? ' d46-verdict-on' : '')}>{done ? t(c.demo_note) : ''}</p>
              </span>
            </>
          ) : (
            <span className="d46-col">
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
          <div className="d46-acts fade-up">
            <button className="d46-btn" disabled={!done} onClick={() => setShown(0)}>{t(c.again)}</button>
            <button className="d46-btn d46-btn-go" disabled={!done} onClick={toPlay}>{t(c.to_play)}</button>
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
const ScreenMore = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_more} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <MoreBody step={step}/>}/>
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
      <div className="d46-stage">
        <BedFig size="xs" mode="edge"/>
      </div>
    )}/>
);

const methodAside = (
  <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps} note={CONTENT.s_methods.m1_no}/>
);

const ScreenPick = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_pick} asideNode={methodAside}/>
);
const ScreenCalc = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_calc} asideNode={methodAside}/>
);
const ScreenBins = (props) => (
  <Classify {...props} screenContent={CONTENT.s_bins} totalScreens={TOTAL_SCREENS}/>
);
const ScreenError = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_error}/>
);

// Задача: проекты выставки.
const TaskFig = ({ idx }) => (
  <div className="d46-task-fig">
    {idx >= 1
      ? (
        <svg viewBox="0 0 200 120" aria-hidden="true">
          <path d="M40 100 L40 34 L124 100 z" fill="#A9CFBA" stroke="#1F7A4D" strokeWidth="2.4"/>
          <text x="82" y="114" textAnchor="middle" fill="#8A8883"
            fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">4 · 3 : 2</text>
        </svg>
      )
      : <BedFig size="xs" mode="edge"/>}
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
.d46-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(9px, 1.7vw, 14px); padding: clamp(12px, 2.4vw, 18px) !important; }
.d46-stage-tool { gap: clamp(4px, 0.8vw, 7px) !important; padding: clamp(7px, 1.5vw, 11px) !important; }
.d46-stage-tool .d46-line { font-size: clamp(12px, 2vw, 16px); }
.d46-stage-row { flex-direction: row; align-items: center; justify-content: center; gap: clamp(10px, 2.4vw, 22px); flex-wrap: wrap; }
.d46-col { display: flex; flex-direction: column; align-items: center; gap: clamp(5px, 1.1vw, 9px); flex: 1 1 200px; min-width: 0; }

/* Клумба и мелкие чертежи */
.d46-bed-box { display: block; width: 100%; max-width: 240px; }
.d46-bed-sm { max-width: 206px; }
.d46-bed-xs { max-width: 168px; }
.d46-bed-box svg { width: 100%; height: auto; display: block; }
.d46-mini { display: block; width: 100%; max-width: 300px; }
.d46-mini svg { width: 100%; height: auto; display: block; }

/* Карта раздела */
.d46-map { display: inline-flex; gap: clamp(6px, 1.4vw, 11px); flex-wrap: wrap; justify-content: center; }
.d46-tile { font-style: normal; padding: 7px 14px; border-radius: 12px; background: #E7F5FA; border: 1px solid #B6DCEA; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(12px, 2.2vw, 16px); font-weight: 700; color: #019ACB; }

.d46-fade { opacity: 0; transition: opacity 420ms linear; }
.d46-on { opacity: 1; }
.d46-line { font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(12px, 2.1vw, 16px); font-weight: 700; color: #494550; text-align: center; }

/* Строки экрана границы */
.d46-pair { width: 100%; padding: clamp(5px, 1.2vw, 9px); border-radius: 12px; text-align: center; }
.d46-pair-bad { background: #FFF1EC; border: 1px solid #F3C4B4; }
.d46-pair-warn { background: #FBF3D6; border: 1px solid #E4CE93; }

/* Задача */
.d46-task-fig { display: flex; justify-content: center; width: 100%; }
.d46-task-fig svg { width: 100%; max-width: 200px; height: auto; display: block; }

/* Экран 4 */
.d46-banner { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; font-size: clamp(13px, 2.2vw, 16px); font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 4px 11px; }
.d46-banner-play { color: #1F7A4D; background: #E3F0E8; }
.d46-verdict { margin: 0; min-height: 0; opacity: 0; transition: opacity 420ms linear; text-align: center; }
.d46-verdict-on { opacity: 1; }
.d46-acts { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.d46-btn { height: 36px; padding: 0 18px; border-radius: 12px; border: 1px solid #E9E3D9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(14px, 2.2vw, 16px); font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.d46-btn:disabled { opacity: 0.45; cursor: default; }
.d46-btn-go { border-color: #FF4F28; color: #FF4F28; }
.d46-btn-go:hover:not(:disabled) { background: #FFE8E1; }

/* Движение сцены: флажки покачиваются, бордюр клумбы подсвечивается */
.d46-flag { animation: d46Flag 3600ms ease-in-out infinite; transform-origin: top center; transform-box: fill-box; }
@keyframes d46Flag { 0%, 100% { transform: rotate(-6deg); } 50% { transform: rotate(6deg); } }
.d46-edge { animation: d46Edge 2800ms ease-in-out infinite; }
@keyframes d46Edge { 0%, 100% { opacity: 0.35; } 50% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .d46-flag, .d46-edge { animation: none; } }
`;

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function SectionReviewLesson({
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

  const screens = [ScreenHook, ScreenRecall, ScreenCore, ScreenTool, ScreenMore, ScreenSolve, ScreenEdge,
    ScreenRule, ScreenPick, ScreenCalc, ScreenBins, ScreenError, ScreenTask, ScreenFinal, Screen14];
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
