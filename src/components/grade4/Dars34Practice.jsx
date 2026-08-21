// ============================================================================
// 4-SINF · 34-DARS AMALIYOTI · BURCHAKLARNI YASASH
// 10 topshiriq · UZ/RU/EN · ovozsiz · solve-to-advance.
//
// SKELET: src/books/grade4/AMALIYOT_31_40_SKELET.md §5.4.
// Raskladka (scripts/grade4-practice-31-40-layout.mjs):
//   mc · missing · ticks · placepick · numpad · order · match · missing · placepick · order
//
// NEGA BITTA FAYL VA NEGA CHIZMALAR SHU YERDA. LMS darsni bitta avtonom .jsx
// sifatida qabul qiladi: lokal import yo'q. Transportir chizmasi shu faylda
// yoziladi. CLAUDE.md §5 nusxa taqiqiga zid emas — LMS kontrakti majbur qiladi.
//
// DIZAYN: Dars01Practice.jsx. RUS TILIDA MUROJAAT — «ты».
//
// CHIZMA QOIDASI. Transportir har doim haqiqiy holatda chiziladi: markaz
// qayerda turgani, asos chizig'i qaysi tomonga moslangani va nol qaysi tomonda
// ekani ko'rinadi. 09-topshiriqda markaz atayin uchdan siljitilgan — bola
// xatoni chizmadan topadi, matndan emas.
// ============================================================================

import { useEffect, useMemo, useRef, useState } from 'react';

const T = {
  bg: '#F5F5F0',
  paper: '#FFFFFF',
  ink: '#12212C',
  ink2: '#50616D',
  ink3: '#87949D',
  accent: '#FF5B35',
  accentSoft: '#FFF0EA',
  cyan: '#168FA3',
  cyanSoft: '#E5F5F6',
  navy: '#173B52',
  success: '#227A53',
  successSoft: '#E7F3EC',
  warn: '#A96F13',
  warnSoft: '#FFF5D9',
};

const b = (ru, uz, en) => ({ ru, uz, en });
const option = (id, ru, uz, en, correct = false, wrongRu = '', wrongUz = '', wrongEn = '') => ({
  id, text: b(ru, uz, en), correct, wrong: wrongRu ? b(wrongRu, wrongUz, wrongEn) : null,
});
const SUPPORTED_LANGS = ['uz', 'ru', 'en'];
const normalizeLang = (value) => (SUPPORTED_LANGS.includes(value) ? value : 'uz');
const tx = (value, lang) => (
  value && typeof value === 'object' && !Array.isArray(value) ? value[lang] ?? '' : value
);

const UI = {
  title: b(
    'Урок 34. Практика: построение углов',
    '34-dars. Amaliyot: burchaklarni yasash',
    'Lesson 34. Practice: constructing angles',
  ),
  language: b('Язык', 'Til', 'Language'),
  task: b('Задание', 'Topshiriq', 'Task'),
  level: {
    green: b('Базовое', 'Asosiy', 'Core'),
    yellow: b('Применение', "Qo'llash", 'Application'),
    red: b('Перенос', "Ko'chirish", 'Transfer'),
  },
  check: b('Проверить', 'Tekshirish', 'Check'),
  retry: b('Исправить ответ', 'Javobni tuzatish', 'Correct the answer'),
  next: b('Следующее', 'Keyingisi', 'Next'),
  finish: b('Завершить', 'Yakunlash', 'Finish'),
  again: b('Пройти заново', 'Qaytadan ishlash', 'Try again'),
  done: b('Практика пройдена', 'Amaliyot tugadi', 'Practice complete'),
  firstTry: b('верно с первой проверки', "birinchi tekshiruvda to'g'ri", 'correct on the first check'),
  allSolved: b('Все 10 заданий решены.', '10 ta topshiriqning barchasi yechildi.', 'All 10 tasks have been solved.'),
  rule: b('Запомни', 'Eslab qoling', 'Remember'),
  typeAnswer: b('Наберите числовой ответ', 'Sonli javobni kiriting', 'Enter a numerical answer'),
  clear: b('Стереть', "O'chirish", 'Delete'),
  matchHint: b(
    'Нажми карточку слева, потом её пару справа.',
    "Chapdagi kartani bosing, keyin uning juftini o'ngdan tanlang.",
    'Tap a card on the left, then its match on the right.',
  ),
  orderHint: b(
    'Нажми место, потом карточку шага.',
    'Avval joyni, keyin qadam kartasini bosing.',
    'Tap a position, then a step card.',
  ),
  scaleHint: b(
    'Нажми значение под дугой.',
    'Yoy ostidagi qiymatni bosing.',
    'Tap the value under the arc.',
  ),
  placeHint: b(
    'Нажми точку на чертеже.',
    'Chizmadagi nuqtani bosing.',
    'Tap a point on the drawing.',
  ),
};

const LESSON_META = {
  lessonId: 'num-4-34-practice',
  lessonTitle: UI.title,
  grade: 4,
  lessonNumber: 34,
  activityType: 'practice',
  taskCount: 10,
  resultIsUiState: true,
  progression: { green: 2, yellow: 5, red: 3 },
};

const SCREEN_META = [
  { id: 'practice-01', taskId: '01', template: 'multiple-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-02', taskId: '02', template: 'step-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-03', taskId: '03', template: 'scale-reading', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-04', taskId: '04', template: 'point-pick', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-05', taskId: '05', template: 'numeric-input', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-06', taskId: '06', template: 'ordering', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-07', taskId: '07', template: 'matching', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-08', taskId: '08', template: 'boundary-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-09', taskId: '09', template: 'error-analysis', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-10', taskId: '10', template: 'strategy-transfer', type: 'practice', scored: true, scope: 'final' },
];

const shuffle = (items) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const TASKS = [
  {
    id: '01', level: 'green', kind: 'mc', skillTag: 'protractor_centre',
    visual: { type: 'protractor', deg: 60, centre: 'none' },
    setup: b(
      'На чертёж положили транспортир, но пока не совместили его с углом.',
      'Chizmaga transportir qo\'yildi, lekin u hali burchakka moslanmagan.',
      'A protractor has been placed on the drawing but not yet aligned with the angle.',
    ),
    prompt: b(
      'Куда ставят центр транспортира?',
      'Transportir markazi qayerga qo\'yiladi?',
      'Where is the centre of the protractor placed?',
    ),
    options: [
      option('vertex', 'в вершину угла', 'burchak uchiga', 'at the vertex of the angle', true),
      option('middle', 'на середину стороны', "tomon o'rtasiga", 'at the middle of an arm', false,
        'Из середины стороны отсчёт пойдёт не от вершины, и раскрытие исказится.',
        "Tomon o'rtasidan sanoq uchdan boshlanmaydi va ochilish buziladi.",
        'Counting from the middle of an arm does not start at the vertex, so the opening is distorted.'),
      option('end', 'на конец стороны', 'tomon oxiriga', 'at the end of an arm', false,
        'Конец стороны — не начало угла: раскрытие отсчитывают от вершины.',
        "Tomon oxiri — burchakning boshi emas: ochilish uchdan sanaladi.",
        'The end of an arm is not where the angle begins: the opening is counted from the vertex.'),
      option('zero', 'на нуль шкалы', 'shkala noliga', 'at the zero of the scale', false,
        'Нуль шкалы совмещают со стороной, а центр — с вершиной.',
        "Shkala noli tomonga moslanadi, markaz esa uchga.",
        'The zero of the scale is aligned with an arm, while the centre goes to the vertex.'),
    ],
    secondHint: b(
      'Угол начинается там, где сходятся обе стороны.',
      'Burchak ikkala tomon uchrashgan joyda boshlanadi.',
      'An angle begins where both arms meet.',
    ),
    thirdHint: b(
      'Центр — это метка в середине основания транспортира; он встаёт в вершину.',
      "Markaz — transportir asosining o'rtasidagi belgi; u uchga qo'yiladi.",
      'The centre is the mark in the middle of the protractor base; it goes on the vertex.',
    ),
    correctText: b(
      'Верно. Центр транспортира ставят в вершину угла.',
      "To'g'ri. Transportir markazi burchak uchiga qo'yiladi.",
      'Correct. The centre of the protractor is placed at the vertex of the angle.',
    ),
    rule: b(
      'Центр — в вершину, основание — по стороне.',
      "Markaz — uchga, asos — tomon bo'ylab.",
      'The centre goes on the vertex and the base along an arm.',
    ),
  },

  {
    id: '02', level: 'green', kind: 'missing', skillTag: 'base_line_alignment',
    visual: { type: 'protractor', deg: 60, centre: 'vertex' },
    setup: b(
      'Центр уже стоит в вершине, но линия основания лежит криво.',
      "Markaz allaqachon uchda, lekin asos chizig'i qiyshiq yotadi.",
      'The centre is already on the vertex, but the base line is still crooked.',
    ),
    prompt: b(
      'Что делают дальше?',
      'Keyin nima qilinadi?',
      'What comes next?',
    ),
    options: [
      option('align', 'совмещают линию основания с первой стороной', "asos chizig'ini birinchi tomonga moslashtiradi", 'align the base line with the first arm', true),
      option('mark-now', 'сразу отмечают градус', 'darrov darajani belgilaydi', 'mark the degree straight away', false,
        'Пока основание не легло на сторону, отсчёт пойдёт не от той стороны.',
        "Asos tomonga yotmaguncha, sanoq boshqa tomondan ketadi.",
        'Until the base lies on an arm, the count starts from the wrong arm.'),
      option('second-arm', 'совмещают основание со второй стороной', "asosni ikkinchi tomonga moslashtiradi", 'align the base with the second arm', false,
        'Вторую сторону только предстоит построить; основание кладут на готовую.',
        "Ikkinchi tomon hali yasalmagan; asos tayyor tomonga qo'yiladi.",
        'The second arm is yet to be built; the base is laid on the arm that already exists.'),
      option('by-eye', 'поворачивают транспортир на глаз', "transportirni ko'zga qarab buradi", 'turn the protractor by eye', false,
        'На глаз — это не построение: инструмент нужно совместить точно.',
        "Ko'zga qarab — bu yasash emas: asbobni aniq moslash kerak.",
        'By eye is not construction: the tool must be aligned exactly.'),
    ],
    secondHint: b(
      'Отсчёт начинается от той стороны, которая уже начерчена.',
      'Sanoq allaqachon chizilgan tomondan boshlanadi.',
      'The count starts from the arm that is already drawn.',
    ),
    thirdHint: b(
      'Порядок такой: центр в вершину, основание по первой стороне, потом отсчёт.',
      'Tartib shunday: markaz uchga, asos birinchi tomon bo\'ylab, keyin sanoq.',
      'The order is: centre on the vertex, base along the first arm, then the count.',
    ),
    correctText: b(
      'Верно. Линию основания совмещают с первой стороной.',
      "To'g'ri. Asos chizig'i birinchi tomonga moslashtiriladi.",
      'Correct. The base line is aligned with the first arm.',
    ),
    rule: b(
      'Пока инструмент не совмещён, отсчёт не начинают.',
      'Asbob moslanmaguncha sanoq boshlanmaydi.',
      'The count does not begin until the tool is aligned.',
    ),
  },

  {
    id: '03', level: 'yellow', kind: 'ticks', skillTag: 'read_from_correct_scale',
    answer: '75', tickValues: ['55', '65', '75', '85', '95'],
    visual: { type: 'protractor', deg: 75, centre: 'vertex', zeroSide: 'right', graduated: true },
    setup: b(
      'Транспортир стоит правильно, нуль лежит на правой стороне. Деления идут через 10 градусов.',
      "Transportir to'g'ri turibdi, nol o'ng tomonda yotadi. Bo'linmalar 10 darajadan boradi.",
      'The protractor is set correctly with the zero on the right arm. The graduations are every 10 degrees.',
    ),
    prompt: b(
      'Чему равен построенный угол?',
      'Yasalgan burchak qanchaga teng?',
      'What is the constructed angle?',
    ),
    wrong: [b(
      'Считай деления от той стороны, где стоит нуль.',
      "Bo'linmalarni nol turgan tomondan sanang.",
      'Count the graduations from the arm where the zero is.',
    )],
    secondHint: b(
      'От 55 указатель прошёл два деления по 10 градусов.',
      "55 dan ko'rsatkich 10 darajali ikkita bo'linmani o'tdi.",
      'From 55 the pointer has passed two graduations of 10 degrees.',
    ),
    thirdHint: b(
      '55 плюс двадцать равно 75.',
      "55 ga yigirma qo'shilsa 75 bo'ladi.",
      '55 plus twenty is 75.',
    ),
    correctText: b(
      'Верно. Угол равен 75 градусам.',
      "To'g'ri. Burchak 75 darajaga teng.",
      'Correct. The angle is 75 degrees.',
    ),
    rule: b(
      'Читают ту шкалу, у которой нуль совмещён со стороной.',
      'Noli tomonga moslangan shkala o\'qiladi.',
      'Read the scale whose zero is aligned with the arm.',
    ),
  },

  {
    id: '04', level: 'yellow', kind: 'placepick', skillTag: 'place_the_centre',
    visual: { type: 'points', marks: ['A', 'B', 'C', 'D'], deg: 60 },
    setup: b(
      'На чертеже угла отмечены четыре точки.',
      "Burchak chizmasida to'rtta nuqta belgilangan.",
      'Four points are marked on the drawing of the angle.',
    ),
    prompt: b(
      'В какую точку встанет центр транспортира?',
      'Transportir markazi qaysi nuqtaga qo\'yiladi?',
      'Which point will the centre of the protractor go on?',
    ),
    places: [
      {
        mark: 'A', label: b('конец первой стороны', 'birinchi tomon oxiri', 'end of the first arm'),
        wrong: b(
          'Это конец стороны, а не начало угла.',
          "Bu tomonning oxiri, burchakning boshi emas.",
          'That is the end of an arm, not where the angle begins.',
        ),
      },
      {
        mark: 'B', label: b('вершина угла', 'burchak uchi', 'vertex of the angle'), correct: true,
      },
      {
        mark: 'C', label: b('середина первой стороны', "birinchi tomon o'rtasi", 'middle of the first arm'),
        wrong: b(
          'Из середины отсчёт пойдёт не от вершины.',
          "O'rtadan sanoq uchdan boshlanmaydi.",
          'Counting from the middle does not start at the vertex.',
        ),
      },
      {
        mark: 'D', label: b('точка вне угла', 'burchakdan tashqaridagi nuqta', 'point outside the angle'),
        wrong: b(
          'Эта точка не принадлежит углу: центр ставят туда, где сходятся стороны.',
          "Bu nuqta burchakka tegishli emas: markaz tomonlar uchrashgan joyga qo'yiladi.",
          'This point does not belong to the angle: the centre goes where the arms meet.',
        ),
      },
    ],
    secondHint: b(
      'Вершина — там, где встречаются обе стороны.',
      'Uch — ikkala tomon uchrashgan joy.',
      'The vertex is where both arms meet.',
    ),
    thirdHint: b(
      'Проведи взглядом по каждой стороне: они сходятся в одной точке.',
      "Har tomon bo'ylab ko'zingizni yurgizing: ular bitta nuqtada uchrashadi.",
      'Follow each arm with your eyes: they meet at a single point.',
    ),
    correctText: b(
      'Верно. Центр транспортира встаёт в вершину угла.',
      "To'g'ri. Transportir markazi burchak uchiga qo'yiladi.",
      'Correct. The centre of the protractor goes on the vertex of the angle.',
    ),
    rule: b(
      'Вершина — единственная точка, где сходятся обе стороны.',
      'Uch — ikkala tomon uchrashgan yagona nuqta.',
      'The vertex is the only point where both arms meet.',
    ),
  },

  {
    id: '05', level: 'yellow', kind: 'numpad', skillTag: 'other_scale_value',
    answer: '115', maxLen: 3,
    visual: { type: 'two-scale', outer: 65, inner: 115 },
    setup: b(
      'На транспортире две шкалы, они идут навстречу друг другу. На одной из них в этом месте стоит 65.',
      "Transportirda ikkita shkala bir-biriga qarshi boradi. Ularning birida shu joyda 65 turadi.",
      'The protractor has two scales running towards each other. One of them shows 65 at this place.',
    ),
    prompt: b(
      'Какое число стоит в этом же месте на второй шкале?',
      'Ikkinchi shkalada shu joyda qaysi son turadi?',
      'Which number is at the same place on the second scale?',
    ),
    wrongAnswers: {
      65: b(
        'Это то же самое число. Вторая шкала считает с другой стороны.',
        "Bu xuddi shu son. Ikkinchi shkala boshqa tomondan sanaydi.",
        'That is the same number. The second scale counts from the other side.',
      ),
      25: b(
        'До 90 не хватает 25 градусов — это другой вопрос.',
        '90 gacha 25 daraja yetmaydi — bu boshqa savol.',
        '25 degrees are missing to reach 90 — that is a different question.',
      ),
      245: b(
        'На транспортире нет чисел больше 180.',
        'Transportirda 180 dan katta son yo\'q.',
        'A protractor has no numbers greater than 180.',
      ),
    },
    wrong: [b(
      'Две шкалы вместе покрывают развёрнутый угол.',
      'Ikki shkala birgalikda yoyiq burchakni qoplaydi.',
      'Together the two scales cover a straight angle.',
    )],
    secondHint: b(
      'Развёрнутый угол — 180 градусов.',
      'Yoyiq burchak — 180 daraja.',
      'A straight angle is 180 degrees.',
    ),
    thirdHint: b(
      '180 − 65 = 115.',
      '180 − 65 = 115.',
      '180 − 65 = 115.',
    ),
    correctText: b(
      'Верно. 180 − 65 = 115.',
      "To'g'ri. 180 − 65 = 115.",
      'Correct. 180 − 65 = 115.',
    ),
    rule: b(
      'Числа двух шкал транспортира дополняют друг друга до 180.',
      "Transportirning ikki shkalasidagi sonlar bir-birini 180 gacha to'ldiradi.",
      'The numbers of the two protractor scales complete each other to 180.',
    ),
  },

  {
    id: '06', level: 'yellow', kind: 'order', skillTag: 'construction_order',
    visual: { type: 'record-plate', text: b('105°', '105°', '105°') },
    setup: b(
      'В заказе стоит пандус под углом 105 градусов.',
      'Buyurtmada 105 daraja burchakli pandus turadi.',
      'The order asks for a ramp at an angle of 105 degrees.',
    ),
    prompt: b(
      'Расставь шаги построения по порядку.',
      'Yasash qadamlarini tartib bilan joylashtiring.',
      'Put the construction steps in order.',
    ),
    steps: [
      { id: 'step-1', label: b('Шаг 1', '1-qadam', 'Step 1') },
      { id: 'step-2', label: b('Шаг 2', '2-qadam', 'Step 2') },
      { id: 'step-3', label: b('Шаг 3', '3-qadam', 'Step 3') },
      { id: 'step-4', label: b('Шаг 4', '4-qadam', 'Step 4') },
    ],
    cards: [
      { id: 'ray', text: b('Чертим сторону', 'Tomonni chizamiz', 'Draw an arm'), order: 0 },
      { id: 'centre', text: b('Центр в вершину', 'Markaz uchga', 'Centre on the vertex'), order: 1 },
      { id: 'base', text: b('Основание на сторону', 'Asos tomonga', 'Base along the arm'), order: 2 },
      { id: 'mark', text: b('Отмечаем 105°', '105° ni belgilaymiz', 'Mark 105°'), order: 3 },
    ],
    wrong: [b(
      'Инструмент совмещают до отсчёта, а не после.',
      'Asbob sanoqdan oldin moslanadi, keyin emas.',
      'The tool is aligned before the count, not after it.',
    )],
    secondHint: b(
      'Сторону чертят раньше, чем берут транспортир.',
      'Tomon transportirni olishdan oldin chiziladi.',
      'The arm is drawn before the protractor is picked up.',
    ),
    thirdHint: b(
      'Сторона, центр, основание, отметка.',
      'Tomon, markaz, asos, belgi.',
      'Arm, centre, base, mark.',
    ),
    correctText: b(
      'Верно. Сначала сторона, потом инструмент, и только затем отсчёт.',
      "To'g'ri. Avval tomon, keyin asbob, va faqat keyin sanoq.",
      'Correct. First the arm, then the tool, and only then the count.',
    ),
    rule: b(
      'Построение идёт от готовой стороны к отметке градуса.',
      'Yasash tayyor tomondan daraja belgisiga qarab boradi.',
      'Construction goes from the finished arm to the degree mark.',
    ),
  },

  {
    id: '07', level: 'yellow', kind: 'match', skillTag: 'type_as_check',
    visual: { type: 'angles', items: [{ deg: 50 }, { deg: 90 }, { deg: 115 }, { deg: 180 }] },
    setup: b(
      'Построенный угол проверяют независимо: по его типу.',
      'Yasalgan burchak mustaqil tekshiriladi: turi bo\'yicha.',
      'A constructed angle is checked independently: by its type.',
    ),
    prompt: b(
      'Соедини построенный угол с его типом.',
      'Yasalgan burchakni turi bilan birlashtiring.',
      'Match each constructed angle with its type.',
    ),
    pairs: [
      { id: 'p50', left: b('50°', '50°', '50°'), correctRight: 'acute' },
      { id: 'p90', left: b('90°', '90°', '90°'), correctRight: 'right' },
      { id: 'p115', left: b('115°', '115°', '115°'), correctRight: 'obtuse' },
      { id: 'p180', left: b('180°', '180°', '180°'), correctRight: 'straight' },
    ],
    right: [
      { id: 'acute', text: b('острый', "o'tkir", 'acute') },
      { id: 'right', text: b('прямой', "to'g'ri", 'right') },
      { id: 'obtuse', text: b('тупой', "o'tmas", 'obtuse') },
      { id: 'straight', text: b('развёрнутый', 'yoyiq', 'straight') },
    ],
    wrong: [b(
      'Проверка по типу не зависит от транспортира: сравни число с 90 и с 180.',
      "Tur bo'yicha tekshiruv transportirga bog'liq emas: sonni 90 va 180 bilan solishtiring.",
      'The check by type does not depend on the protractor: compare the number with 90 and 180.',
    )],
    secondHint: b(
      'Если построили 115, тип должен получиться тупой.',
      "Agar 115 yasalgan bo'lsa, tur o'tmas chiqishi kerak.",
      'If 115 was constructed, the type must come out obtuse.',
    ),
    thirdHint: b(
      'Меньше 90 — острый; ровно 90 — прямой; между 90 и 180 — тупой; ровно 180 — развёрнутый.',
      "90 dan kichik — o'tkir; aynan 90 — to'g'ri; 90 va 180 orasida — o'tmas; aynan 180 — yoyiq.",
      'Less than 90 is acute; exactly 90 is right; between 90 and 180 is obtuse; exactly 180 is straight.',
    ),
    correctText: b(
      'Верно. Тип угла — независимая проверка построения.',
      "To'g'ri. Burchak turi — yasashning mustaqil tekshiruvi.",
      'Correct. The type of the angle is an independent check on the construction.',
    ),
    rule: b(
      'Построенный угол проверяют по типу, а не тем же отсчётом.',
      'Yasalgan burchak tur bo\'yicha tekshiriladi, xuddi shu sanoq bilan emas.',
      'A constructed angle is checked by its type, not by repeating the same count.',
    ),
  },

  {
    id: '08', level: 'red', kind: 'missing', skillTag: 'zero_side_boundary',
    visual: { type: 'protractor', deg: 95, centre: 'vertex', zeroSide: 'left', graduated: true },
    setup: b(
      'Транспортир положили так, что нуль оказался с левой стороны. На шкале под стороной стоит 85.',
      "Transportir shunday qo'yildi: nol chap tomonda qoldi. Tomon ostidagi shkalada 85 turadi.",
      'The protractor was laid so that the zero ended up on the left. The scale under the arm shows 85.',
    ),
    prompt: b(
      'Чему равен построенный угол?',
      'Yasalgan burchak qanchaga teng?',
      'What is the constructed angle?',
    ),
    options: [
      option('ninety-five', '95°', '95°', '95°', true),
      option('eighty-five', '85°', '85°', '85°', false,
        'Это чтение по чужой шкале: нуль стоит с другой стороны.',
        "Bu boshqa shkaladan o'qish: nol boshqa tomonda turadi.",
        'That is a reading from the wrong scale: the zero is on the other side.'),
      option('ninety', '90°', '90°', '90°', false,
        'Прямой угол — ровно 90; здесь отсчёт даёт другое число.',
        "To'g'ri burchak — aynan 90; bu yerda sanoq boshqa son beradi.",
        'A right angle is exactly 90; the count here gives a different number.'),
      option('one-seventy-five', '175°', '175°', '175°', false,
        'Здесь 85 прибавили к 90, а нужно вычесть из 180.',
        "Bu yerda 85 ni 90 ga qo'shgan, 180 dan ayirish kerak esa.",
        'Here 85 was added to 90, but it must be subtracted from 180.'),
    ],
    secondHint: b(
      'Проверь, с какой стороны начинается нуль.',
      'Nol qaysi tomondan boshlanishini tekshiring.',
      'Check which side the zero starts from.',
    ),
    thirdHint: b(
      '180 − 85 = 95.',
      '180 − 85 = 95.',
      '180 − 85 = 95.',
    ),
    correctText: b(
      'Верно. Нуль слева, поэтому угол равен 95 градусам.',
      "To'g'ri. Nol chapda, shuning uchun burchak 95 darajaga teng.",
      'Correct. The zero is on the left, so the angle is 95 degrees.',
    ),
    rule: b(
      'Сначала находят нуль, потом читают число.',
      'Avval nol topiladi, keyin son o\'qiladi.',
      'Find the zero first, then read the number.',
    ),
  },

  {
    id: '09', level: 'red', kind: 'placepick', skillTag: 'error_in_placement',
    visual: { type: 'points', marks: ['A', 'B', 'C', 'D'], deg: 60, misplaced: true },
    setup: b(
      'Бит положил центр рядом с вершиной, и угол вышел меньше нужного.',
      "Bit markazni uch yoniga qo'ydi va burchak kerakligidan kichik chiqdi.",
      'Bit put the centre next to the vertex, and the angle came out smaller than required.',
    ),
    prompt: b(
      'Где центр должен был стоять?',
      'Markaz qayerda turishi kerak edi?',
      'Where should the centre have been?',
    ),
    places: [
      {
        mark: 'A', label: b('точка на стороне', 'tomondagi nuqta', 'a point on an arm'),
        wrong: b(
          'Отсчёт от точки на стороне даёт другое раскрытие.',
          'Tomondagi nuqtadan sanoq boshqa ochilish beradi.',
          'Counting from a point on an arm gives a different opening.',
        ),
      },
      {
        mark: 'B', label: b('точка рядом с вершиной', 'uch yonidagi nuqta', 'a point next to the vertex'),
        wrong: b(
          'Рядом — не то же, что в вершине: именно это и дало ошибку.',
          "Yonida — uchda degani emas: xato aynan shundan kelib chiqdi.",
          'Next to is not the same as on: that is exactly what caused the error.',
        ),
      },
      {
        mark: 'C', label: b('вершина угла', 'burchak uchi', 'the vertex of the angle'), correct: true,
      },
      {
        mark: 'D', label: b('конец второй стороны', 'ikkinchi tomon oxiri', 'the end of the second arm'),
        wrong: b(
          'Это конец стороны; угол начинается в вершине.',
          'Bu tomonning oxiri; burchak uchda boshlanadi.',
          'That is the end of an arm; the angle begins at the vertex.',
        ),
      },
    ],
    secondHint: b(
      'Ошибка была в точке отсчёта, а не в шкале.',
      'Xato sanoq nuqtasida edi, shkalada emas.',
      'The error was in the point the count started from, not in the scale.',
    ),
    thirdHint: b(
      'Обе стороны сходятся ровно в одной точке — она и есть вершина.',
      'Ikkala tomon aynan bitta nuqtada uchrashadi — u uchdir.',
      'Both arms meet at exactly one point — that is the vertex.',
    ),
    correctText: b(
      'Верно. Центр должен стоять точно в вершине.',
      "To'g'ri. Markaz aynan uchda turishi kerak.",
      'Correct. The centre must sit exactly on the vertex.',
    ),
    rule: b(
      'Ошибку построения ищут в совмещении инструмента.',
      'Yasash xatosi asbobning moslanishida qidiriladi.',
      'A construction error is looked for in the alignment of the tool.',
    ),
  },

  {
    id: '10', level: 'red', kind: 'order', skillTag: 'transfer_next_step',
    visual: { type: 'record-plate', text: b('90° → 35°', '90° → 35°', '90° → 35°') },
    setup: b(
      'Прямой угол стены уже построен. От его стороны нужно отложить скат 35 градусов.',
      "Devorning to'g'ri burchagi yasalgan. Uning tomonidan 35 darajali nishab qo'yish kerak.",
      'The right angle of the wall is already built. A 35-degree slope must be set off from its arm.',
    ),
    prompt: b(
      'Расставь шаги нового построения по порядку.',
      'Yangi yasash qadamlarini tartib bilan joylashtiring.',
      'Put the steps of the new construction in order.',
    ),
    steps: [
      { id: 'step-1', label: b('Шаг 1', '1-qadam', 'Step 1') },
      { id: 'step-2', label: b('Шаг 2', '2-qadam', 'Step 2') },
      { id: 'step-3', label: b('Шаг 3', '3-qadam', 'Step 3') },
      { id: 'step-4', label: b('Шаг 4', '4-qadam', 'Step 4') },
    ],
    cards: [
      { id: 'reuse', text: b('Берём готовую сторону', 'Tayyor tomonni olamiz', 'Take the finished arm'), order: 0 },
      { id: 'centre', text: b('Центр в вершину', 'Markaz uchga', 'Centre on the vertex'), order: 1 },
      { id: 'base', text: b('Основание на эту сторону', 'Asos shu tomonga', 'Base along this arm'), order: 2 },
      { id: 'check', text: b('Отмечаем 35° и проверяем тип', "35° ni belgilab, turini tekshiramiz", 'Mark 35° and check the type'), order: 3 },
    ],
    wrong: [b(
      'Тот же порядок работает и здесь: сторона, центр, основание, отметка с проверкой.',
      'Xuddi shu tartib bu yerda ham ishlaydi: tomon, markaz, asos, tekshiruvli belgi.',
      'The same order works here too: arm, centre, base, mark with a check.',
    )],
    secondHint: b(
      'Новую сторону строят от уже готовой.',
      'Yangi tomon tayyor tomondan yasaladi.',
      'The new arm is built from the one that is already there.',
    ),
    thirdHint: b(
      '35 меньше 90, значит проверка должна дать острый угол.',
      "35 — 90 dan kichik, demak tekshiruv o'tkir burchak berishi kerak.",
      '35 is less than 90, so the check must give an acute angle.',
    ),
    correctText: b(
      'Верно. Порядок построения не меняется, меняется только градус.',
      "To'g'ri. Yasash tartibi o'zgarmaydi, faqat daraja o'zgaradi.",
      'Correct. The construction order does not change, only the degree does.',
    ),
    rule: b(
      'Один порядок построения работает для любого угла.',
      'Bitta yasash tartibi har qanday burchak uchun ishlaydi.',
      'One construction order works for any angle.',
    ),
  },
];

const adaptive = (task, pickedOption, typed, placeWrong, attempts) => {
  if (attempts >= 3) return task.thirdHint;
  if (attempts >= 2) return task.secondHint;
  if (pickedOption?.wrong) return pickedOption.wrong;
  if (typed && task.wrongAnswers?.[typed]) return task.wrongAnswers[typed];
  if (placeWrong) return placeWrong;
  return task.wrong?.[0] || task.secondHint;
};

// ---------------------------------------------------------------------------
// CHIZMALAR. Transportir gradus bo'yicha yasaladi, markaz holati va nol tomoni
// ma'lumotdan chiqadi — rasm bilan javob hech qachon ajralmaydi.
// ---------------------------------------------------------------------------
const ProtractorSvg = ({ deg, centre = 'vertex', zeroSide = 'right', graduated = false }) => {
  const cx = 150;
  const cy = 100;
  const r = 82;
  const shift = centre === 'none' ? { x: 38, y: -30 } : centre === 'off' ? { x: 18, y: -10 } : { x: 0, y: 0 };
  const rad = (deg * Math.PI) / 180;
  return (
    <svg className="p4-svg" viewBox="0 0 300 118" role="img" aria-hidden="true">
      <path d={`M${cx} ${cy} H${cx + 118}`} stroke={T.navy} strokeWidth="2.4" strokeLinecap="round" />
      <path d={`M${cx} ${cy} L${cx + 118 * Math.cos(rad)} ${cy - 118 * Math.sin(rad)}`} stroke={T.navy} strokeWidth="2.4" strokeLinecap="round" />
      <g transform={`translate(${shift.x} ${shift.y})`}>
        <path d={`M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy} Z`} fill="rgba(22,143,163,.10)" stroke={T.cyan} strokeWidth="1.8" />
        {graduated && Array.from({ length: 19 }, (_, index) => {
          const angle = (Math.PI / 18) * index;
          const outer = r - 3;
          const inner = index % 3 === 0 ? r - 13 : r - 8;
          return (
            <line key={index} x1={cx + outer * Math.cos(angle)} y1={cy - outer * Math.sin(angle)}
              x2={cx + inner * Math.cos(angle)} y2={cy - inner * Math.sin(angle)} stroke={T.cyan} strokeWidth="1.1" />
          );
        })}
        <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke={T.cyan} strokeWidth="1.6" />
        <circle cx={cx} cy={cy} r="3.4" fill={T.accent} />
        <text x={zeroSide === 'right' ? cx + r - 8 : cx - r + 8} y={cy - 6} textAnchor="middle" className="p4-svg-cut">0</text>
      </g>
      <circle cx={cx} cy={cy} r="3" fill={T.navy} />
    </svg>
  );
};

const AngleSvg = ({ deg, arm = 44, size = 92 }) => {
  const cx = 14;
  const cy = size - 18;
  const rad = (deg * Math.PI) / 180;
  return (
    <svg className="p4-angle" viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-hidden="true">
      <path d={`M${cx} ${cy} H${cx + arm}`} stroke={T.navy} strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <path d={`M${cx} ${cy} L${cx + arm * Math.cos(rad)} ${cy - arm * Math.sin(rad)}`} stroke={T.navy} strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <path d={`M${cx + 14} ${cy} A14 14 0 ${deg > 180 ? 1 : 0} 0 ${cx + 14 * Math.cos(rad)} ${cy - 14 * Math.sin(rad)}`}
        stroke={T.accent} strokeWidth="1.8" fill="none" />
      <circle cx={cx} cy={cy} r="3" fill={T.accent} />
    </svg>
  );
};

function Visual({ task, lang, solved }) {
  const visual = task.visual;
  if (!visual) return null;

  if (visual.type === 'protractor') {
    return (
      <div className="p4-visual">
        <ProtractorSvg deg={visual.deg} centre={visual.centre} zeroSide={visual.zeroSide} graduated={visual.graduated} />
      </div>
    );
  }

  if (visual.type === 'points') {
    const rad = (visual.deg * Math.PI) / 180;
    const vx = 96;
    const vy = 96;
    const points = [
      { mark: visual.marks[0], x: vx + 120, y: vy },
      { mark: visual.marks[1], x: vx, y: vy },
      { mark: visual.marks[2], x: vx + 60, y: vy },
      { mark: visual.marks[3], x: vx + 148, y: 30 },
    ];
    return (
      <div className="p4-visual">
        <svg className="p4-svg" viewBox="0 0 300 118" role="img" aria-label={tx(task.setup, lang)}>
          <path d={`M${vx} ${vy} H${vx + 130}`} stroke={T.navy} strokeWidth="2.4" strokeLinecap="round" />
          <path d={`M${vx} ${vy} L${vx + 120 * Math.cos(rad)} ${vy - 120 * Math.sin(rad)}`} stroke={T.navy} strokeWidth="2.4" strokeLinecap="round" />
          {visual.misplaced && <circle cx={vx + 18} cy={vy - 8} r="4" fill="none" stroke={T.warn} strokeWidth="2" strokeDasharray="3 2" />}
          {points.map((point) => (
            <g key={point.mark}>
              <circle cx={point.x} cy={point.y} r="4" fill={T.cyan} />
              <text x={point.x} y={point.y - 9} textAnchor="middle" className="p4-svg-top">{point.mark}</text>
            </g>
          ))}
        </svg>
      </div>
    );
  }

  if (visual.type === 'two-scale') {
    return (
      <div className="p4-visual">
        <svg className="p4-svg" viewBox="0 0 300 112" role="img" aria-label={tx(task.setup, lang)}>
          <path d="M34 96 A116 116 0 0 1 266 96" fill="none" stroke={T.cyan} strokeWidth="2.4" />
          <path d="M50 96 A100 100 0 0 1 250 96" fill="none" stroke={T.ink3} strokeWidth="1.6" />
          <path d="M150 96 L216 44" stroke={T.accent} strokeWidth="2.4" strokeLinecap="round" />
          <text x="234" y="34" textAnchor="middle" className="p4-svg-top">{visual.outer}</text>
          <text x="196" y="66" textAnchor="middle" className="p4-svg-cut">?</text>
          <text x="262" y="110" textAnchor="end" className="p4-svg-cut">0</text>
          <text x="40" y="110" className="p4-svg-cut">0</text>
          <circle cx="150" cy="96" r="4" fill={T.accent} />
          {solved && <text x="196" y="66" textAnchor="middle" className="p4-svg-reveal">{visual.inner}</text>}
        </svg>
      </div>
    );
  }

  if (visual.type === 'record-plate') {
    return <div className="p4-visual"><strong>{tx(visual.text, lang)}</strong></div>;
  }

  if (visual.type === 'angles') {
    return (
      <div className="p4-visual p4-visual-row">
        {visual.items.map((item, index) => (
          <span className="p4-angle-cell" key={index} style={{ animationDelay: `${index * 70}ms` }}>
            <AngleSvg deg={item.deg} />
            <small>{item.deg}°</small>
          </span>
        ))}
      </div>
    );
  }

  return null;
}

function NumPad({ value, onChange, max, disabled, lang }) {
  return (
    <div className="p4-pad" role="group" aria-label={tx(UI.typeAnswer, lang)}>
      <output className="p4-pad-display">{value || '—'}</output>
      <div className="p4-pad-keys">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => (
          <button type="button" key={digit} disabled={disabled}
            onClick={() => onChange(value.length >= max ? value : `${value}${digit}`)}>
            {digit}
          </button>
        ))}
        <button type="button" className="p4-key-del is-delete" disabled={disabled}
          aria-label={tx(UI.clear, lang)} onClick={() => onChange(value.slice(0, -1))}>
          ⌫
        </button>
      </div>
    </div>
  );
}

function Feedback({ ok, text, rule, lang, feedbackRef }) {
  return (
    <div ref={feedbackRef} className={`p4-feedback ${ok ? 'is-ok' : 'is-no'}`} role="status" aria-live="polite">
      <p>{tx(text, lang)}</p>
      {ok && <p className="p4-rule"><b>{tx(UI.rule, lang)}.</b> {tx(rule, lang)}</p>}
    </div>
  );
}

function Task({ task, lang, isLast, onSolved, shuffleSeed }) {
  const [pickedId, setPickedId] = useState(null);
  const [place, setPlace] = useState(null);
  const [tick, setTick] = useState(null);
  const [typed, setTyped] = useState('');
  const [pairs, setPairs] = useState({});
  const [activeLeft, setActiveLeft] = useState(null);
  const [placed, setPlaced] = useState({});
  const [activeCell, setActiveCell] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [checked, setChecked] = useState(false);
  const [solved, setSolved] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const checkingRef = useRef(false);
  const advancedRef = useRef(false);
  const feedbackRef = useRef(null);

  // Xato javobdan keyin variantlar qayta aralashadi (metodist qarori 2026-08-21).
  const [wrongRound, setWrongRound] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- restart/task kaliti atayin yangi aralashtirish beradi
  const options = useMemo(() => shuffle(task.options || []), [shuffleSeed, task.id, task.options, wrongRound]);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- restart/task kaliti atayin yangi aralashtirish beradi
  const rightCards = useMemo(() => shuffle(task.right || []), [shuffleSeed, task.id, task.right]);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- restart/task kaliti atayin yangi aralashtirish beradi
  const bankCards = useMemo(() => shuffle(task.cards || []), [shuffleSeed, task.id, task.cards]);

  useEffect(() => {
    if (checked) window.setTimeout(() => feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 120);
  }, [checked]);

  const answerReady = (() => {
    if (task.options) return pickedId !== null;
    if (task.kind === 'placepick') return place !== null;
    if (task.kind === 'ticks') return tick !== null;
    if (task.kind === 'numpad') return typed.length > 0;
    if (task.kind === 'match') return task.pairs.every((pair) => pairs[pair.id]);
    return task.steps.every((step) => placed[step.id]);
  })();

  const answerCorrect = () => {
    if (task.options) return task.options.find((item) => item.id === pickedId)?.correct === true;
    if (task.kind === 'placepick') return task.places[place]?.correct === true;
    if (task.kind === 'ticks') return tick === task.answer;
    if (task.kind === 'numpad') return typed === task.answer;
    if (task.kind === 'match') return task.pairs.every((pair) => pairs[pair.id] === pair.correctRight);
    return task.cards.every((card) => placed[task.steps[card.order].id] === card.id);
  };

  const clearResponse = () => {
    checkingRef.current = false;
    setChecked(false);
    setPickedId(null);
    setPlace(null);
    setTick(null);
    setTyped('');
    setPairs({});
    setActiveLeft(null);
    setPlaced({});
    setActiveCell(null);
  };

  const check = () => {
    if (!answerReady || solved || checked || checkingRef.current) return;
    checkingRef.current = true;
    setAttempts((old) => old + 1);
    setChecked(true);
    if (answerCorrect()) setSolved(true); else setWrongRound((old) => old + 1);
  };

  const placeCard = (cardId) => {
    if (solved || activeCell === null) return;
    checkingRef.current = false;
    setPlaced((old) => {
      const next = { ...old };
      Object.keys(next).forEach((key) => { if (next[key] === cardId) delete next[key]; });
      next[activeCell] = cardId;
      return next;
    });
    setActiveCell(null);
    setChecked(false);
  };

  const pickedOption = task.options ? task.options.find((item) => item.id === pickedId) : null;
  const placeWrong = task.kind === 'placepick' && place !== null ? task.places[place]?.wrong : null;
  const cardText = (cardId) => tx(task.cards?.find((card) => card.id === cardId)?.text, lang);

  const studentAnswer = (() => {
    if (task.options) return { optionId: pickedId, text: pickedOption?.text };
    if (task.kind === 'placepick') return { placeIndex: place, mark: task.places[place]?.mark };
    if (task.kind === 'ticks') return { value: tick };
    if (task.kind === 'numpad') return { value: typed };
    if (task.kind === 'match') return { pairs };
    return { order: task.steps.map((step) => placed[step.id]) };
  })();

  const correctAnswer = (() => {
    if (task.options) {
      const item = task.options.find((candidate) => candidate.correct);
      return { optionId: item.id, text: item.text };
    }
    if (task.kind === 'placepick') {
      const index = task.places.findIndex((item) => item.correct);
      return { placeIndex: index, mark: task.places[index].mark };
    }
    if (task.kind === 'ticks' || task.kind === 'numpad') return { value: task.answer };
    if (task.kind === 'match') {
      return { pairs: Object.fromEntries(task.pairs.map((pair) => [pair.id, pair.correctRight])) };
    }
    return { order: task.cards.slice().sort((a, c) => a.order - c.order).map((card) => card.id) };
  })();

  const optionClass = (item) => {
    if (pickedId !== item.id) return '';
    if (!checked) return 'is-on';
    return item.correct ? 'is-ok' : 'is-no';
  };

  return (
    <section className="p4-task" aria-labelledby={`task-${task.id}`}>
      <p className={`p4-eyebrow is-${task.level}`}>
        <span>{tx(UI.level[task.level], lang)}</span> · {tx(UI.task, lang)} {Number(task.id)}
      </p>
      <p className="p4-setup">{tx(task.setup, lang)}</p>
      <h2 id={`task-${task.id}`}>{tx(task.prompt, lang)}</h2>
      <Visual task={task} lang={lang} solved={solved} />

      {task.options && (
        <div className={task.kind === 'missing' ? 'p4-missing p4-options' : 'p4-options'}>
          {options.map((item, index) => (
            <button type="button" key={item.id} className={`p4-option ${optionClass(item)}`}
              disabled={solved} aria-pressed={pickedId === item.id}
              onClick={() => { checkingRef.current = false; setPickedId(item.id); setChecked(false); }}>
              <span className="p4-letter">{'ABCD'[index]}</span>
              {tx(item.text, lang)}
            </button>
          ))}
        </div>
      )}

      {task.kind === 'placepick' && (
        <div className="p4-place-wrap">
          <p className="p4-note">{tx(UI.placeHint, lang)}</p>
          <div className="p4-place-grid">
            {task.places.map((item, index) => (
              <button type="button" key={item.mark} disabled={solved} aria-pressed={place === index}
                className={`p4-place ${place === index ? (checked ? (item.correct ? 'is-ok' : 'is-no') : 'is-on') : ''}`}
                onClick={() => { checkingRef.current = false; setPlace(index); setChecked(false); }}>
                <span>{item.mark}</span>
                <small>{tx(item.label, lang)}</small>
              </button>
            ))}
          </div>
        </div>
      )}

      {task.kind === 'ticks' && (
        <div className="p4-scale-row">
          <p className="p4-note">{tx(UI.scaleHint, lang)}</p>
          <div className="p4-scale-values">
            {task.tickValues.map((value) => (
              <span className="p4-scale-tick" key={value}>
                <button type="button" disabled={solved} aria-label={`${value}°`}
                  className={tick === value ? (checked ? (solved ? 'is-ok' : 'is-no') : 'is-on') : ''}
                  onClick={() => { checkingRef.current = false; setTick(value); setChecked(false); }}>
                  {value}
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {task.kind === 'numpad' && (
        <NumPad value={typed} max={task.maxLen} disabled={solved} lang={lang}
          onChange={(value) => { checkingRef.current = false; setTyped(value); setChecked(false); }} />
      )}

      {task.kind === 'match' && (
        <div className="p4-match">
          <p className="p4-note">{tx(UI.matchHint, lang)}</p>
          <div className="p4-match-grid">
            <section className="p4-match-col">
              {task.pairs.map((pair) => (
                <button type="button" key={pair.id} disabled={solved} aria-pressed={activeLeft === pair.id}
                  className={`${activeLeft === pair.id ? 'is-active' : ''} ${pairs[pair.id] ? 'is-tied' : ''}`}
                  onClick={() => { checkingRef.current = false; setActiveLeft(pair.id); setChecked(false); }}>
                  {tx(pair.left, lang)}
                  {pairs[pair.id] && (
                    <small>{tx(task.right.find((item) => item.id === pairs[pair.id])?.text, lang)}</small>
                  )}
                </button>
              ))}
            </section>
            <section className="p4-match-col">
              {rightCards.map((item) => {
                const used = Object.values(pairs).includes(item.id);
                return (
                  <button type="button" key={item.id} className={used ? 'is-used' : ''}
                    disabled={solved || activeLeft === null || used}
                    onClick={() => {
                      checkingRef.current = false;
                      setPairs((old) => ({ ...old, [activeLeft]: item.id }));
                      setActiveLeft(null);
                      setChecked(false);
                    }}>
                    {tx(item.text, lang)}
                  </button>
                );
              })}
            </section>
          </div>
        </div>
      )}

      {task.kind === 'order' && (
        <div className="p4-order">
          <p className="p4-note">{tx(UI.orderHint, lang)}</p>
          <div className="p4-order-slots">
            {task.steps.map((step) => (
              <button type="button" key={step.id} disabled={solved} aria-pressed={activeCell === step.id}
                className={activeCell === step.id ? 'is-active' : ''}
                onClick={() => { checkingRef.current = false; setActiveCell(step.id); setChecked(false); }}>
                <small>{tx(step.label, lang)}</small>
                <b>{placed[step.id] ? cardText(placed[step.id]) : '—'}</b>
              </button>
            ))}
          </div>
          <div className="p4-card-bank">
            {bankCards.map((card) => {
              const used = Object.values(placed).includes(card.id);
              return (
                <button type="button" key={card.id} className={`p4-card ${used ? 'is-used' : ''}`}
                  disabled={solved || activeCell === null || used} onClick={() => placeCard(card.id)}>
                  {tx(card.text, lang)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {checked && (
        <Feedback feedbackRef={feedbackRef} ok={solved} lang={lang} rule={task.rule}
          text={solved ? task.correctText : adaptive(task, pickedOption, typed, placeWrong, attempts)} />
      )}

      <div className="p4-actions">
        {!checked && !solved && (
          <button type="button" className="p4-btn" disabled={!answerReady} onClick={check}>
            {tx(UI.check, lang)}
          </button>
        )}
        {checked && !solved && (
          <button type="button" className="p4-btn p4-btn-ghost is-ghost" onClick={clearResponse}>
            {tx(UI.retry, lang)}
          </button>
        )}
        {solved && (
          <button type="button" className="p4-btn p4-btn-ready is-ready" disabled={advancing}
            onClick={() => {
              if (advancedRef.current) return;
              advancedRef.current = true;
              checkingRef.current = false;
              setAdvancing(true);
              onSolved({
                taskId: task.id,
                taskNumber: Number(task.id),
                level: task.level,
                kind: task.kind,
                skillTag: task.skillTag,
                attempts,
                firstTry: attempts === 1,
                correct: true,
                setup: task.setup,
                prompt: task.prompt,
                studentAnswer,
                correctAnswer,
                answerChoices: task.options
                  ? options.map(({ id, text, correct }) => ({ id, text, correct }))
                  : task.right ?? task.cards ?? task.places ?? null,
                screenMeta: SCREEN_META.find((screen) => screen.taskId === task.id),
              });
            }}>
            {tx(isLast ? UI.finish : UI.next, lang)}
          </button>
        )}
      </div>
    </section>
  );
}

export default function Grade4Dars34Practice({ studentName, lang: langProp, onFinished }) {
  const preview = langProp === undefined || langProp === null;
  const [previewLang, setPreviewLang] = useState('uz');
  const lang = normalizeLang(preview ? previewLang : langProp);

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [firstTry, setFirstTry] = useState(0);
  const [finished, setFinished] = useState(false);
  const [runId, setRunId] = useState(0);
  const finishedRef = useRef(false);
  const startedAtRef = useRef(0);

  useEffect(() => { if (!startedAtRef.current) startedAtRef.current = Date.now(); }, []);

  const task = TASKS[index];
  const total = TASKS.length;
  const percent = Math.round(((finished ? total : index) / total) * 100);

  const onSolved = (record) => {
    const nextAnswers = [...answers, record];
    const nextFirstTry = firstTry + (record.firstTry ? 1 : 0);
    setAnswers(nextAnswers);
    setFirstTry(nextFirstTry);
    if (index !== total - 1) { setIndex((old) => old + 1); return; }
    if (finishedRef.current) return;
    finishedRef.current = true;
    setFinished(true);
    const scorePercent = Math.round((nextFirstTry / total) * 100);
    const levelBreakdown = ['green', 'yellow', 'red'].reduce((result, level) => ({
      ...result,
      [level]: {
        total: TASKS.filter((item) => item.level === level).length,
        firstTry: nextAnswers.filter((item) => item.level === level && item.firstTry).length,
      },
    }), {});
    onFinished?.({
      lessonId: LESSON_META.lessonId,
      lessonTitle: tx(LESSON_META.lessonTitle, lang),
      lessonTitleLocalized: LESSON_META.lessonTitle,
      studentName: studentName || null,
      activityType: 'practice',
      completed: true,
      totalQuestions: total,
      answeredQuestions: total,
      correctAnswers: nextFirstTry,
      firstTryCorrect: nextFirstTry,
      scorePercent,
      finalScore: nextFirstTry,
      finalTotal: total,
      passed: nextFirstTry >= 6,
      firstTryStats: { total, firstTryCorrect: nextFirstTry, correct: nextFirstTry, answered: total, scorePercent },
      attemptsTotal: nextAnswers.reduce((sum, item) => sum + item.attempts, 0),
      // eslint-disable-next-line react-hooks/purity -- davomiylik amaliyot yakunlanganda olinadi
      durationSec: startedAtRef.current ? Math.max(0, Math.floor((Date.now() - startedAtRef.current) / 1000)) : 0,
      skillTags: [...new Set(TASKS.map((item) => item.skillTag))],
      levelBreakdown,
      lessonMeta: LESSON_META,
      screenMeta: SCREEN_META,
      answers: nextAnswers,
    });
  };

  const restart = () => {
    finishedRef.current = false;
    startedAtRef.current = Date.now();
    setIndex(0);
    setAnswers([]);
    setFirstTry(0);
    setFinished(false);
    setRunId((old) => old + 1);
  };

  return (
    <div className="p4-root">
      <style>{STYLES}</style>
      {preview && (
        <div className="p4-lang" role="group" aria-label={tx(UI.language, lang)}>
          {SUPPORTED_LANGS.map((code) => (
            <button type="button" key={code} aria-pressed={lang === code}
              className={lang === code ? 'is-active' : ''} onClick={() => setPreviewLang(code)}>
              {code.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      <header>
        <div className="p4-progress" role="progressbar" aria-label={tx(UI.title, lang)}
          aria-valuemin="0" aria-valuemax={total} aria-valuenow={finished ? total : index}>
          <i style={{ width: `${percent}%` }} />
        </div>
        <div>
          <span className="p4-title">{tx(UI.title, lang)}</span>
          <b className="p4-counter">{finished ? total : index + 1} / {total}</b>
        </div>
      </header>

      <main>
        {finished ? (
          <section className="p4-done" aria-live="polite">
            <h2>{tx(UI.done, lang)}</h2>
            <strong>{firstTry}<small>/ {total}</small></strong>
            <p>{tx(UI.firstTry, lang)}</p>
            <p>{tx(UI.allSolved, lang)}</p>
            <button type="button" className="p4-btn p4-btn-ready" onClick={restart}>{tx(UI.again, lang)}</button>
          </section>
        ) : (
          <Task key={`${runId}-${task.id}`} task={task} lang={lang} isLast={index === total - 1}
            onSolved={onSolved} shuffleSeed={`${LESSON_META.lessonId}:${runId}`} />
        )}
      </main>
    </div>
  );
}

const STYLES = `
.p4-root { position: relative; min-height: 100dvh; overflow-x: clip; padding: 0 0 24px; background: ${T.bg} !important; color: ${T.ink}; font-family: 'Manrope', system-ui, sans-serif; }
.p4-root *, .p4-root *::before, .p4-root *::after { box-sizing: border-box; }
.p4-root p, .p4-root h2 { margin: 0; }
.p4-root button:focus-visible { outline: 3px solid rgba(22, 143, 163, .45); outline-offset: 3px; }

.p4-lang { position: absolute; top: 8px; right: 8px; z-index: 9; display: flex; gap: 6px; }
.p4-lang button { min-width: 44px; min-height: 44px; padding: 0 10px; border: 0; border-radius: 99px; background: ${T.paper}; color: ${T.ink2}; font: 800 11px 'Manrope', sans-serif; cursor: pointer; box-shadow: 0 4px 12px -8px rgba(23, 59, 82, .4); }
.p4-lang button.is-active { background: ${T.accent}; color: #fff; }

.p4-root > header { padding: 46px clamp(12px, 4vw, 24px) 8px; }
.p4-root > header > div, .p4-root > main { width: min(720px, 100%) !important; margin-inline: auto; }
.p4-progress { height: 6px; border: 0; border-radius: 99px; background: rgba(23, 59, 82, .12); overflow: hidden; }
.p4-progress i { display: block; height: 100%; background: linear-gradient(90deg, ${T.cyan}, ${T.accent}); transition: width .4s ease; }
.p4-root > header > div:last-child { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; margin-top: 8px; }
.p4-title { font-family: 'Source Serif 4', Georgia, serif; font-weight: 600; font-size: clamp(15px, 2.4vw, 19px); }
.p4-counter { white-space: nowrap; font: 700 13px 'JetBrains Mono', monospace; color: ${T.ink3}; }

.p4-root > main { padding: 4px clamp(12px, 4vw, 24px); }
.p4-task { display: grid; gap: 12px; }
.p4-eyebrow, .p4-eyebrow.is-green, .p4-eyebrow.is-yellow, .p4-eyebrow.is-red { color: ${T.accent}; font-size: 11px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
.p4-setup { color: ${T.ink2}; font-size: clamp(14px, 2vw, 16px); line-height: 1.5; }
.p4-task h2 { font: 600 clamp(17px, 2.6vw, 21px)/1.25 'Source Serif 4', Georgia, serif; color: ${T.ink}; }
.p4-note { color: ${T.ink3}; font-size: 13px; }

.p4-visual { display: grid; place-items: center; gap: 8px; min-height: 108px; padding: 12px 10px; border-radius: 16px; background: ${T.paper} !important; box-shadow: inset 0 0 0 1px rgba(23, 59, 82, .08); overflow: hidden; }
.p4-visual-row { grid-auto-flow: column; grid-auto-columns: max-content; align-items: end; }
.p4-visual strong { text-align: center; color: ${T.navy}; font: 800 clamp(22px, 5vw, 34px)/1.25 'JetBrains Mono', monospace; }
.p4-svg { width: 100%; max-width: 330px; height: auto; }
.p4-svg text { font: 700 12px 'JetBrains Mono', monospace; }
.p4-svg-top { fill: ${T.navy}; }
.p4-svg-cut { fill: ${T.ink2}; }
.p4-svg-reveal { fill: ${T.success}; font-weight: 800; animation: p4-rise .5s cubic-bezier(.22, 1.2, .36, 1) both; }
.p4-angle { width: clamp(56px, 15vw, 84px); height: auto; animation: p4-drop .5s cubic-bezier(.22, 1.2, .36, 1) both; }
.p4-angle-cell { display: grid; justify-items: center; gap: 2px; }
.p4-angle-cell small { color: ${T.ink2}; font: 800 12px 'JetBrains Mono', monospace; }

.p4-options { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 9px; }
.p4-option { display: flex; align-items: center; gap: 9px; min-width: 44px; min-height: 56px; padding: 10px 12px; text-align: left; border: 1px solid rgba(23, 59, 82, .12); border-radius: 14px; background: ${T.paper}; color: ${T.ink}; font: 700 clamp(13px, 1.9vw, 15px)/1.35 'Manrope', sans-serif; cursor: pointer; transition: transform .16s, border-color .2s, background .2s; }
.p4-option:hover:not(:disabled) { border-color: rgba(22, 143, 163, .4); transform: translateY(-2px); }
.p4-letter { flex: 0 0 26px; display: grid; place-items: center; width: 26px; height: 26px; border-radius: 8px; background: ${T.cyanSoft}; color: ${T.cyan}; font: 800 11px 'JetBrains Mono', monospace; }
.p4-option.is-on { border-color: ${T.accent}; background: ${T.accentSoft}; }
.p4-option.is-ok { border-color: rgba(34, 122, 83, .4); background: ${T.successSoft}; color: ${T.success}; }
.p4-option.is-ok .p4-letter { background: ${T.success}; color: #fff; }
.p4-option.is-no { border-color: rgba(169, 111, 19, .4); background: ${T.warnSoft}; color: ${T.warn}; }
.p4-option.is-no .p4-letter { background: ${T.warn}; color: #fff; }

.p4-place-wrap { display: grid; gap: 6px; }
.p4-place-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 7px; }
.p4-place { display: grid; place-items: center; gap: 4px; min-width: 44px; min-height: 68px; padding: 7px 4px; border: 1px solid rgba(23, 59, 82, .12); border-radius: 12px; background: ${T.paper}; color: ${T.navy}; cursor: pointer; }
.p4-place span { font: 800 clamp(18px, 4vw, 24px) 'JetBrains Mono', monospace; }
.p4-place small { color: ${T.ink3}; font-size: 9.5px; font-weight: 800; text-align: center; line-height: 1.2; }
.p4-place.is-on { border-color: ${T.accent}; background: ${T.accentSoft}; }
.p4-place.is-ok { border-color: ${T.success}; background: ${T.successSoft}; }
.p4-place.is-no { border-color: ${T.warn}; background: ${T.warnSoft}; }

.p4-scale-row { display: grid; gap: 6px; justify-items: center; }
.p4-scale-values { display: flex; flex-wrap: wrap; justify-content: center; gap: 7px; }
.p4-scale-tick button { min-width: 52px; min-height: 44px; border: 1px solid rgba(23, 59, 82, .14); border-radius: 12px; background: ${T.paper}; color: ${T.navy}; font: 800 15px 'JetBrains Mono', monospace; cursor: pointer; transition: border-color .2s, background .2s; }
.p4-scale-tick button:hover:not(:disabled) { border-color: ${T.cyan}; }
.p4-scale-tick button.is-on { border-color: ${T.accent}; background: ${T.accentSoft}; }
.p4-scale-tick button.is-ok { border-color: ${T.success}; background: ${T.successSoft}; color: ${T.success}; }
.p4-scale-tick button.is-no { border-color: ${T.warn}; background: ${T.warnSoft}; color: ${T.warn}; }

.p4-match-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 7px; }
.p4-match-col { display: grid; gap: 8px; }
.p4-match button, .p4-order button { min-width: 44px; min-height: 48px; padding: 8px 10px; border: 1px solid rgba(23, 59, 82, .12); border-radius: 12px; background: ${T.paper}; color: ${T.navy}; font: 700 clamp(12px, 1.9vw, 14px)/1.3 'Manrope', sans-serif; cursor: pointer; transition: transform .16s, border-color .2s, background .2s; }
.p4-match button:hover:not(:disabled), .p4-order button:hover:not(:disabled) { border-color: rgba(22, 143, 163, .4); transform: translateY(-2px); }
.p4-match button.is-active, .p4-order button.is-active { border-color: ${T.accent}; background: ${T.accentSoft}; }
.p4-match button.is-tied { border-color: rgba(34, 122, 83, .35); }
.p4-match button small { display: block; margin-top: 3px; color: ${T.success}; font-size: 11px; }
.p4-match button.is-used, .p4-card.is-used { background: ${T.successSoft}; opacity: .62; }

.p4-order-slots { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 7px; margin-top: 7px; }
.p4-order-slots button { display: grid; gap: 3px; place-items: center; }
.p4-order-slots small { color: ${T.ink3}; font-size: 10px; }
.p4-order-slots b { font: 800 clamp(11px, 1.8vw, 13px) 'JetBrains Mono', monospace; }
.p4-card-bank { display: flex; flex-wrap: wrap; justify-content: center; gap: 7px; margin-top: 8px; }
.p4-card { min-width: 44px; min-height: 46px; padding: 7px 11px; border: 1px solid rgba(23, 59, 82, .12); border-radius: 12px; background: ${T.paper}; color: ${T.navy}; font: 800 12px 'Manrope', sans-serif; cursor: pointer; }

.p4-pad { display: flex; flex-direction: column; align-items: center; gap: 8px; width: min(240px, 100%); margin: 0 auto; padding: 12px; border-radius: 18px; background: linear-gradient(155deg, #EDF1F3, #DDE4E8); box-shadow: inset 0 1px rgba(255, 255, 255, .9); }
.p4-pad-display { display: flex; align-items: center; justify-content: center; width: 100%; min-height: 50px; padding: 8px; border: 2px solid ${T.accent}; border-radius: 13px; background: ${T.paper}; color: ${T.navy}; font: 800 clamp(20px, 4.4vw, 26px) 'JetBrains Mono', monospace; letter-spacing: 2px; }
.p4-pad-keys { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; width: 100%; }
.p4-pad-keys button { min-width: 44px; min-height: 44px; border: 1px solid rgba(23, 59, 82, .16); border-radius: 12px; background: ${T.paper}; color: ${T.navy}; font: 800 clamp(18px, 3.6vw, 22px) 'JetBrains Mono', monospace; cursor: pointer; }
.p4-pad-keys button:hover:not(:disabled) { border-color: ${T.cyan}; }
.p4-pad-keys button.p4-key-del { background: ${T.accentSoft}; color: ${T.accent}; }

.p4-feedback { padding: 12px 14px; border-radius: 14px; line-height: 1.45; }
.p4-feedback.is-ok { background: ${T.successSoft}; color: #1B6644; box-shadow: inset 4px 0 0 ${T.success}; }
.p4-feedback.is-no { background: ${T.warnSoft}; color: #8A5C10; box-shadow: inset 4px 0 0 ${T.warn}; }
.p4-feedback p { font-family: 'Source Serif 4', Georgia, serif; font-size: clamp(14px, 2.1vw, 16px); }
.p4-feedback .p4-rule { margin-top: 5px; color: ${T.ink2}; }

.p4-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 4px; }
.p4-actions .p4-btn, .p4-done .p4-btn { min-width: 44px; min-height: 46px; padding: 10px 22px; border: 0; border-radius: 12px; background: ${T.paper}; color: ${T.accent}; font: 800 14px 'Manrope', sans-serif; cursor: pointer; box-shadow: 0 8px 20px -10px rgba(255, 91, 53, .5), inset 0 0 0 1px rgba(255, 91, 53, .2); }
.p4-actions .p4-btn:disabled { opacity: .45; cursor: not-allowed; box-shadow: none; }
.p4-actions button.p4-btn-ghost { background: transparent; color: ${T.ink2}; box-shadow: none; }
.p4-actions button.p4-btn-ready, .p4-done button.p4-btn-ready { background: ${T.accent}; color: #fff; }

.p4-done { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 20px 12px; text-align: center; }
.p4-done h2 { font: 600 clamp(19px, 3vw, 24px) 'Source Serif 4', Georgia, serif; }
.p4-done > strong { font: 800 clamp(32px, 7vw, 44px) 'JetBrains Mono', monospace; color: ${T.success}; }
.p4-done > strong small { font-size: 14px; color: ${T.ink3}; }
.p4-done p { color: ${T.ink2}; }

@keyframes p4-drop { 0% { opacity: 0; transform: translateY(-10px) scale(.86); } 70% { opacity: 1; transform: translateY(1px) scale(1.03); } 100% { opacity: 1; transform: none; } }
@keyframes p4-rise { 0% { opacity: 0; transform: translateY(8px); } 100% { opacity: 1; transform: none; } }

@media (max-width: 520px) {
  .p4-options { grid-template-columns: 1fr; }
  .p4-order-slots, .p4-place-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .p4-root > header { padding-top: 54px; }
}
@media (max-width: 640px) and (max-height: 700px) {
  .p4-root > header { padding: 40px 10px 3px !important; }
  .p4-root > main { padding: 1px 8px !important; }
  .p4-task { gap: 5px !important; }
  .p4-setup { font-size: 12px; line-height: 1.3; }
  .p4-task h2 { font-size: 16px !important; }
  .p4-visual { min-height: 76px !important; padding: 8px 10px !important; }
  .p4-visual strong { font-size: 20px; }
  .p4-options { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 5px !important; }
  .p4-option, .p4-match button, .p4-order button { min-height: 44px !important; padding: 5px 8px !important; font-size: 12px !important; }
  .p4-place { min-height: 56px !important; }
  .p4-actions .p4-btn, .p4-done .p4-btn { min-height: 44px !important; padding: 7px 14px; }
  .p4-feedback { padding: 8px 10px; }
}
@media (prefers-reduced-motion: reduce) {
  .p4-root *, .p4-root *::before, .p4-root *::after { scroll-behavior: auto !important; animation: none !important; transition: none !important; }
}

/* PRACTICE-FIX boshlanishi — metodist qarori 2026-08-21.
   1) Tekshirish tugmasi o'ngda (2-dars etaloni).
   2) Moslashtirishda ikki tomondagi kartochkalar bir xil o'lchamda: ustun grid
      bo'ladi va qatorlari 1fr, shuning uchun juftlar qator bo'yicha tekislanadi.
   Bu blok har darsda takrorlanadi ATAYLAB: LMS avtonom fayl talab qiladi. */
.p4-actions, .g4p-actions { justify-content: flex-end; }
.p4-match-cols, .g4p-match-cols { align-items: stretch; }
.p4-match-col, .g4p-match-col { display: grid; grid-auto-rows: 1fr; align-content: stretch; }
/* PRACTICE-FIX tugashi */
`;
