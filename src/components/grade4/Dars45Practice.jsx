// ============================================================================
// 4-SINF · 45-DARS AMALIYOTI · HARAKATGA DOIR MASALALAR
// 10 topshiriq · UZ/RU/EN · ovozsiz · solve-to-advance.
//
// Skelet: src/books/grade4/AMALIYOT_41_51_SKELET.md §8.
// Mexanika raskladkasi: scripts/grade4-practice-41-51-layout.mjs
//   match · ticks · order · numpad · missing · match · order · ticks · sort · missing
//
// Infratuzilma fayl ichida: LMS lokal importni ko'tarmaydi (CLAUDE.md §5 dan
// ongli chekinish, sabab 41-dars amaliyoti shapkasida).
//
// QAMROV. Nazariy dars faqat uch kattalik bog'lanishini beradi: tezlik,
// masofa, vaqt va tezlik birligi. Yaqinlashish yoki quvib yetish tezligi
// nazariyada yo'q (tekshirildi), shuning uchun amaliyotda ham yo'q. Reyestr
// tavsifi bu jihatdan nazariyadan keng yozilgan.
//
// NAZARIYADAN FARQ. Nazariy dars 48 : 4 = 12, 460 km 2 soatda, 39 km 3 soatda,
// 1 035 m 15 minutda, 1 800 km 18 soatda va 4 km/soat bilan 3 soat misollarini
// ishlatgan; bu yerda boshqa sonlar.
//
// MODEL: masofa shkalasi. `ticks` topshiriqlarida bola bo'linmaga tegadi.
// 08-topshiriqda oraliq imzolar YASHIRIN: bola bo'linma qiymatini o'zi
// hisoblab, ko'rsatkich turgan belgini sanab topadi.
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
const SUPPORTED_LANGS = ['uz', 'ru', 'en'];
const normalizeLang = (value) => (SUPPORTED_LANGS.includes(value) ? value : 'uz');
const tx = (value, lang) => (value && typeof value === 'object' && !Array.isArray(value) ? value[normalizeLang(lang)] ?? '' : value);

const UI = {
  title: b('Урок 45. Практика: задачи на движение', '45-dars. Amaliyot: harakatga doir masalalar', 'Lesson 45. Practice: motion problems'),
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
  allSolved: b('Все 10 заданий решены.', "10 ta topshiriqning barchasi yechildi.", 'All 10 tasks have been solved.'),
  rule: b('Запомни', 'Eslab qoling', 'Remember'),
  typeAnswer: b('Введи числовой ответ', 'Sonli javobni kiriting', 'Enter a numerical answer'),
  clear: b('Стереть', "O'chirish", 'Delete'),
  matchHint: b('Выбери карточку слева, потом пару справа.', "Avval chapdagi kartani, keyin o'ngdagi juftini tanlang.", 'Choose a card on the left, then its match on the right.'),
  orderHint: b('Выбери место, потом карточку шага.', 'Avval joyni, keyin qadam kartasini tanlang.', 'Choose a position, then a step card.'),
  sortHint: b('Выбери карточку, потом группу.', 'Avval kartani, keyin guruhni tanlang.', 'Choose a card, then a group.'),
  tickHint: b('Нажми на деление шкалы.', "Shkala bo'linmasiga bosing.", 'Tap a mark on the scale.'),
  returnCard: b('Вернуть карточку', 'Kartani qaytarish', 'Return the card'),
};

const LESSON_META = {
  lessonId: 'motion-4-45-practice',
  lessonTitle: UI.title,
  grade: 4,
  lessonNumber: 45,
  activityType: 'practice',
  taskCount: 10,
  resultIsUiState: true,
  progression: { green: 2, yellow: 5, red: 3 },
};

const SCREEN_META = [
  { id: 'practice-01', taskId: '01', template: 'matching', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-02', taskId: '02', template: 'scale-reading', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-03', taskId: '03', template: 'ordering', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-04', taskId: '04', template: 'numeric-input', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-05', taskId: '05', template: 'numeric-blank', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-06', taskId: '06', template: 'word-problem', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-07', taskId: '07', template: 'ordering', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-08', taskId: '08', template: 'boundary-scale', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-09', taskId: '09', template: 'error-analysis', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-10', taskId: '10', template: 'strategy-transfer', type: 'practice', scored: true, scope: 'final' },
];

const TASKS = [
  {
    id: '01', level: 'green', kind: 'match', skillTag: 'formula_meaning',
    setup: b(
      'Дорожная диспетчерская держит три правила и одну единицу измерения.',
      "Yo'l dispetcherligi uchta qoida va bitta o'lchov birligini saqlaydi.",
      'The route dispatch keeps three rules and one unit of measurement.',
    ),
    prompt: b('Соедини запись с тем, что она даёт.', 'Yozuvni u beradigan natija bilan ulang.', 'Match each record to what it gives.'),
    pairs: [
      { id: 'speed', left: b('расстояние : время', 'masofa : vaqt', 'distance : time'), correctRight: 'gives-speed' },
      { id: 'distance', left: b('скорость × время', 'tezlik × vaqt', 'speed × time'), correctRight: 'gives-distance' },
      { id: 'time', left: b('расстояние : скорость', 'masofa : tezlik', 'distance : speed'), correctRight: 'gives-time' },
      { id: 'unit', left: b('км/ч', 'km/soat', 'km/h'), correctRight: 'gives-unit' },
    ],
    right: [
      { id: 'gives-speed', text: b('Скорость', 'Tezlik', 'Speed') },
      { id: 'gives-distance', text: b('Расстояние', 'Masofa', 'Distance') },
      { id: 'gives-time', text: b('Время', 'Vaqt', 'Time') },
      { id: 'gives-unit', text: b('Единица скорости', 'Tezlik birligi', 'Unit of speed') },
    ],
    wrong: [b(
      'Смотри, что стоит первым: расстояние делят, а скорость умножают.',
      "Nima birinchi turganiga qarang: masofa bo'linadi, tezlik ko'paytiriladi.",
      'Look at what comes first: distance is divided, and speed is multiplied.',
    )],
    secondHint: b(
      'Деление расстояния даёт либо скорость, либо время — смотри на второе число.',
      "Masofani bo'lish tezlik yoki vaqt beradi — ikkinchi songa qarang.",
      'Dividing the distance gives either the speed or the time: look at the second number.',
    ),
    thirdHint: b(
      'Если делят на время, получается скорость; если на скорость — время.',
      "Vaqtga bo'linsa tezlik, tezlikka bo'linsa vaqt chiqadi.",
      'Dividing by the time gives the speed; dividing by the speed gives the time.',
    ),
    correctText: b(
      'Верно. Три величины связаны и дают три правила.',
      "To'g'ri. Uch kattalik bog'langan va uch qoida beradi.",
      'Correct. The three quantities are linked and give three rules.',
    ),
    rule: b(
      'Скорость показывает расстояние за одну единицу времени.',
      "Tezlik bir birlik vaqtdagi masofani ko'rsatadi.",
      'Speed shows the distance covered in one unit of time.',
    ),
  },

  {
    id: '02', level: 'green', kind: 'ticks', skillTag: 'distance_on_line', answer: '36',
    visual: { type: 'scale', min: 0, max: 60, intervals: 5, unit: 'km', showAll: true },
    setup: b(
      'Велосипедист едет со скоростью 12 км/ч уже 3 часа.',
      "Velosipedchi 12 km/soat tezlik bilan 3 soat yurdi.",
      'A cyclist has been riding at 12 km/h for 3 hours.',
    ),
    prompt: b(
      'Нажми деление, которое показывает пройденное расстояние.',
      "O'tilgan masofani ko'rsatadigan bo'linmaga bosing.",
      'Tap the mark that shows the distance covered.',
    ),
    wrong: [b(
      'Расстояние получают умножением скорости на время.',
      "Masofa tezlikni vaqtga ko'paytirish bilan topiladi.",
      'The distance is found by multiplying the speed by the time.',
    )],
    secondHint: b(
      'За каждый час прибавляется 12 км.',
      "Har soatda 12 km qo'shiladi.",
      'Each hour adds 12 km.',
    ),
    thirdHint: b('12 × 3 = 36.', '12 × 3 = 36.', '12 × 3 = 36.'),
    correctText: b(
      'Верно. 12 × 3 = 36 км, и это третье деление шкалы.',
      "To'g'ri. 12 × 3 = 36 km, bu shkalaning uchinchi bo'linmasi.",
      'Correct. 12 × 3 = 36 km, which is the third mark on the scale.',
    ),
    rule: b(
      'Расстояние равно скорости, умноженной на время.',
      "Masofa tezlikni vaqtga ko'paytirishga teng.",
      'Distance equals speed multiplied by time.',
    ),
  },

  {
    id: '03', level: 'yellow', kind: 'order', skillTag: 'solution_order',
    setup: b(
      'Диспетчерская принимает решение только с единицей измерения.',
      "Dispetcherlik yechimni faqat o'lchov birligi bilan qabul qiladi.",
      'The dispatch accepts a solution only with its unit of measurement.',
    ),
    prompt: b('Расставь шаги решения по порядку.', 'Yechish qadamlarini tartib bilan joylashtiring.', 'Put the solution steps in order.'),
    steps: [
      { id: 's1', label: b('Шаг 1', '1-qadam', 'Step 1') },
      { id: 's2', label: b('Шаг 2', '2-qadam', 'Step 2') },
      { id: 's3', label: b('Шаг 3', '3-qadam', 'Step 3') },
      { id: 's4', label: b('Шаг 4', '4-qadam', 'Step 4') },
    ],
    cards: [
      { id: 'known', text: b('Что известно', "Nima ma'lum", 'What is known'), order: 0 },
      { id: 'action', text: b('Какое действие', 'Qaysi amal', 'Which action'), order: 1 },
      { id: 'count', text: b('Вычисление', 'Hisoblash', 'The calculation'), order: 2 },
      { id: 'unit', text: b('Единица ответа', 'Javob birligi', 'The unit of the answer'), order: 3 },
    ],
    wrong: [b(
      'Действие выбирают после того, как названы известные величины.',
      "Amal ma'lum kattaliklar nomlangandan keyin tanlanadi.",
      'The action is chosen after the known quantities have been named.',
    )],
    secondHint: b(
      'Единицу пишут в самом конце, вместе с ответом.',
      'Birlik eng oxirida, javob bilan birga yoziladi.',
      'The unit is written at the very end, with the answer.',
    ),
    thirdHint: b(
      'Вычислять начинают только после выбора действия.',
      'Hisoblash amal tanlangandan keyin boshlanadi.',
      'Calculating starts only after the action has been chosen.',
    ),
    correctText: b(
      'Верно. Известное, действие, вычисление, единица.',
      "To'g'ri. Ma'lum, amal, hisob, birlik.",
      'Correct. Known, action, calculation, unit.',
    ),
    rule: b(
      'Ответ без единицы измерения не считается ответом.',
      "O'lchov birligisiz javob javob hisoblanmaydi.",
      'An answer without a unit of measurement is not an answer.',
    ),
  },

  {
    id: '04', level: 'yellow', kind: 'numpad', skillTag: 'speed_from_distance_time', answer: '80', maxLen: 3,
    visual: {
      type: 'table',
      head: [b('Расстояние', 'Masofa', 'Distance'), b('Время', 'Vaqt', 'Time'), b('Скорость', 'Tezlik', 'Speed')],
      rows: [['480 km', '6 soat', '?']],
    },
    setup: b(
      'Грузовик прошёл 480 км за 6 часов.',
      "Yuk mashinasi 480 km ni 6 soatda o'tdi.",
      'A lorry covered 480 km in 6 hours.',
    ),
    prompt: b('Какая у него скорость в км/ч?', 'Uning tezligi necha km/soat?', 'What is its speed in km/h?'),
    wrong: [b(
      'Скорость — это расстояние за один час, поэтому расстояние делят.',
      "Tezlik — bir soatdagi masofa, shuning uchun masofa bo'linadi.",
      'Speed is the distance in one hour, so the distance is divided.',
    )],
    secondHint: b('480 делят на 6.', "480 ni 6 ga bo'lamiz.", '480 is divided by 6.'),
    thirdHint: b('480 : 6 = 80.', '480 : 6 = 80.', '480 : 6 = 80.'),
    correctText: b(
      'Верно. 480 : 6 = 80 км/ч.',
      "To'g'ri. 480 : 6 = 80 km/soat.",
      'Correct. 480 : 6 = 80 km/h.',
    ),
    rule: b(
      'Чтобы найти скорость, расстояние делят на время.',
      "Tezlikni topish uchun masofa vaqtga bo'linadi.",
      'To find the speed, the distance is divided by the time.',
    ),
  },

  {
    id: '05', level: 'yellow', kind: 'missing', skillTag: 'distance_from_speed_time', answer: '560', maxLen: 4,
    visual: { type: 'record', text: '80 × 7 = □' },
    setup: b(
      'Поезд идёт со скоростью 80 км/ч в течение 7 часов.',
      "Poyezd 80 km/soat tezlik bilan 7 soat yuradi.",
      'A train travels at 80 km/h for 7 hours.',
    ),
    prompt: b('Сколько километров он пройдёт?', 'U necha kilometr yo\'l o\'tadi?', 'How many kilometres will it cover?'),
    wrong: [b(
      'Единица скорости не переходит в ответ: ответ измеряют в километрах.',
      "Tezlik birligi javobga ko'chmaydi: javob kilometrda o'lchanadi.",
      'The unit of speed does not carry into the answer: the answer is measured in kilometres.',
    )],
    secondHint: b(
      'За каждый час поезд проходит 80 км.',
      "Har soatda poyezd 80 km yo'l o'tadi.",
      'Each hour the train covers 80 km.',
    ),
    thirdHint: b('80 × 7 = 560.', '80 × 7 = 560.', '80 × 7 = 560.'),
    correctText: b(
      'Верно. 560 километров.',
      "To'g'ri. 560 kilometr.",
      'Correct. 560 kilometres.',
    ),
    rule: b(
      'Ответ измеряют в той величине, о которой спрашивают.',
      "Javob so'ralgan kattalikda o'lchanadi.",
      'The answer is measured in the quantity that was asked about.',
    ),
  },

  {
    id: '06', level: 'yellow', kind: 'match', skillTag: 'operation_choice',
    setup: b(
      'Четыре сообщения диспетчерской, и в каждом свой вопрос.',
      "Dispetcherlikdan to'rt xabar keldi, har birida o'z savoli bor.",
      'Four messages from the dispatch, each with its own question.',
    ),
    prompt: b('Соедини условие с нужным действием.', 'Shartni kerakli amal bilan ulang.', 'Match each story to the action it needs.'),
    pairs: [
      {
        id: 'find-speed',
        left: b('360 км за 4 часа. Какая скорость?', "360 km 4 soatda. Tezlik qancha?", '360 km in 4 hours. What is the speed?'),
        correctRight: 'div-time',
      },
      {
        id: 'find-distance',
        left: b('50 км/ч в течение 5 часов. Какое расстояние?', "50 km/soat bilan 5 soat. Masofa qancha?", '50 km/h for 5 hours. What distance?'),
        correctRight: 'multiply',
      },
      {
        id: 'find-time',
        left: b('420 км при скорости 60 км/ч. Сколько часов?', "420 km, tezlik 60 km/soat. Necha soat?", '420 km at 60 km/h. How many hours?'),
        correctRight: 'div-speed',
      },
      {
        id: 'find-minute',
        left: b('900 м за 15 минут. Какая скорость в метрах за минуту?', "900 m 15 minutda. Bir minutdagi tezlik qancha?", '900 m in 15 minutes. What is the speed in metres per minute?'),
        correctRight: 'div-minutes',
      },
    ],
    right: [
      { id: 'div-time', text: b('360 : 4', '360 : 4', '360 : 4') },
      { id: 'multiply', text: b('50 × 5', '50 × 5', '50 × 5') },
      { id: 'div-speed', text: b('420 : 60', '420 : 60', '420 : 60') },
      { id: 'div-minutes', text: b('900 : 15', '900 : 15', '900 : 15') },
    ],
    wrong: [b(
      'Смотри, какая величина спрашивается, а не какие числа больше.',
      "Qaysi kattalik so'ralganiga qarang, sonlar kattaligiga emas.",
      'Look at which quantity is being asked for, not at which numbers are larger.',
    )],
    secondHint: b(
      'Вопрос «сколько часов» всегда даёт деление на скорость.',
      "«Necha soat» savoli har doim tezlikka bo'lishni beradi.",
      'A how-many-hours question always gives division by the speed.',
    ),
    thirdHint: b(
      'Единица времени в ответе повторяет единицу времени в условии.',
      'Javobdagi vaqt birligi shartdagi vaqt birligini takrorlaydi.',
      'The unit of time in the answer repeats the unit of time in the story.',
    ),
    correctText: b(
      'Верно. Действие задано вопросом, а не размером чисел.',
      "To'g'ri. Amal savol bilan belgilanadi, sonlarning kattaligi bilan emas.",
      'Correct. The action is set by the question, not by the size of the numbers.',
    ),
    rule: b(
      'Сначала называют искомую величину, потом выбирают действие.',
      "Avval izlanayotgan kattalik nomlanadi, keyin amal tanlanadi.",
      'First name the quantity you are looking for, then choose the action.',
    ),
  },

  {
    id: '07', level: 'yellow', kind: 'order', skillTag: 'two_stage_path',
    setup: b(
      'Пешеход шёл 2 часа со скоростью 5 км/ч, потом 3 часа со скоростью 6 км/ч.',
      "Piyoda 2 soat 5 km/soat tezlik bilan, keyin 3 soat 6 km/soat tezlik bilan yurdi.",
      'A walker went for 2 hours at 5 km/h, then 3 hours at 6 km/h.',
    ),
    prompt: b('Расставь вычисления по порядку.', 'Hisoblarni tartib bilan joylashtiring.', 'Put the calculations in order.'),
    steps: [
      { id: 's1', label: b('Шаг 1', '1-qadam', 'Step 1') },
      { id: 's2', label: b('Шаг 2', '2-qadam', 'Step 2') },
      { id: 's3', label: b('Шаг 3', '3-qadam', 'Step 3') },
      { id: 's4', label: b('Шаг 4', '4-qadam', 'Step 4') },
    ],
    cards: [
      { id: 'first', text: b('5 × 2 = 10', '5 × 2 = 10', '5 × 2 = 10'), order: 0 },
      { id: 'second', text: b('6 × 3 = 18', '6 × 3 = 18', '6 × 3 = 18'), order: 1 },
      { id: 'sum', text: b('10 + 18 = 28', '10 + 18 = 28', '10 + 18 = 28'), order: 2 },
      { id: 'answer', text: b('Ответ: 28 км', 'Javob: 28 km', 'Answer: 28 km'), order: 3 },
    ],
    wrong: [b(
      'Каждый участок считают отдельно, и только потом складывают.',
      "Har bosqich alohida hisoblanadi, keyin qo'shiladi.",
      'Each stage is calculated separately, and only then added.',
    )],
    secondHint: b(
      'Скорости разные, поэтому один участок нельзя посчитать вместе с другим.',
      "Tezliklar boshqa, shuning uchun bir bosqichni ikkinchisi bilan birga hisoblab bo'lmaydi.",
      'The speeds differ, so one stage cannot be calculated together with the other.',
    ),
    thirdHint: b(
      'Сначала 5 × 2, потом 6 × 3, и только потом сумма.',
      "Avval 5 × 2, keyin 6 × 3, undan keyin yig'indi.",
      'First 5 × 2, then 6 × 3, and only then the sum.',
    ),
    correctText: b(
      'Верно. 10 км и 18 км дают 28 км.',
      "To'g'ri. 10 km va 18 km 28 km beradi.",
      'Correct. 10 km and 18 km give 28 km.',
    ),
    rule: b(
      'Участки с разной скоростью считают по отдельности.',
      'Tezligi boshqa bosqichlar alohida hisoblanadi.',
      'Stages with different speeds are calculated separately.',
    ),
  },

  {
    id: '08', level: 'red', kind: 'ticks', skillTag: 'non_zero_scale', answer: '60',
    visual: { type: 'scale', min: 40, max: 80, intervals: 4, markerIndex: 2, unit: 'km/soat', showAll: false },
    setup: b(
      'Спидометр начинается не с нуля, а с 40. Подписаны только края.',
      "Spidometr noldan emas, 40 dan boshlanadi. Faqat chetlar imzolangan.",
      'The speedometer starts at 40, not at zero. Only the ends are labelled.',
    ),
    prompt: b(
      'Нажми деление, на котором стоит указатель.',
      "Ko'rsatkich turgan bo'linmaga bosing.",
      'Tap the mark where the pointer stands.',
    ),
    wrong: [b(
      'Сначала находят цену деления: разность краёв делят на число делений.',
      "Avval bo'linma qiymati topiladi: chetlar farqi bo'linmalar soniga bo'linadi.",
      'First find the value of one interval: divide the difference of the ends by the number of intervals.',
    )],
    secondHint: b(
      'Разность краёв равна 40, делений четыре.',
      "Chetlar farqi 40 ga teng, bo'linmalar to'rtta.",
      'The difference of the ends is 40 and there are four intervals.',
    ),
    thirdHint: b(
      '40 : 4 = 10, значит указатель стоит на 40 + 2 × 10.',
      "40 : 4 = 10, demak ko'rsatkich 40 + 2 × 10 da turadi.",
      '40 : 4 = 10, so the pointer stands at 40 + 2 × 10.',
    ),
    correctText: b(
      'Верно. Цена деления 10, указатель показывает 60 км/ч.',
      "To'g'ri. Bo'linma qiymati 10, ko'rsatkich 60 km/soat ni ko'rsatadi.",
      'Correct. Each interval is 10, so the pointer shows 60 km/h.',
    ),
    rule: b(
      'Отсчёт ведут от начала шкалы, а не от нуля.',
      "Sanash shkalaning boshidan olib boriladi, noldan emas.",
      'Counting starts from the beginning of the scale, not from zero.',
    ),
  },

  {
    id: '09', level: 'red', kind: 'sort', skillTag: 'motion_error',
    setup: b(
      'Диспетчерская вернула четыре решения: в двух сбой в действии, в двух — в единице.',
      "Dispetcherlik to'rt yechimni qaytardi: ikkitasida amal, ikkitasida birlik nuqsoni bor.",
      'The dispatch returned four solutions: two have a wrong action and two a wrong unit.',
    ),
    prompt: b('Разложи решения по типу ошибки.', 'Yechimlarni xato turi bo\'yicha guruhlarga joylashtiring.', 'Sort the solutions by the type of error.'),
    bins: [
      { id: 'action', label: b('Ошибка в действии', 'Amal xatosi', 'Wrong action') },
      { id: 'unit', label: b('Ошибка в единице', 'Birlik xatosi', 'Wrong unit') },
    ],
    items: [
      { id: 'mul-speed', bin: 'action', text: b('Скорость: 480 × 6', 'Tezlik: 480 × 6', 'Speed: 480 × 6') },
      { id: 'mul-time', bin: 'action', text: b('Время: 90 × 3', 'Vaqt: 90 × 3', 'Time: 90 × 3') },
      { id: 'time-km', bin: 'unit', text: b('Время: 560 : 80 = 7 км', "Vaqt: 560 : 80 = 7 km", 'Time: 560 : 80 = 7 km') },
      { id: 'dist-hour', bin: 'unit', text: b('Расстояние: 80 × 7 = 560 ч', "Masofa: 80 × 7 = 560 soat", 'Distance: 80 × 7 = 560 h') },
    ],
    wrong: [b(
      'Сначала проверяй действие, потом единицу ответа.',
      "Avval amalni, keyin javob birligini tekshiring.",
      'Check the action first, then the unit of the answer.',
    )],
    secondHint: b(
      'В двух решениях счёт верный, а подписана не та величина.',
      "Ikki yechimda hisob to'g'ri, lekin noto'g'ri kattalik imzolangan.",
      'In two solutions the calculation is right but the wrong quantity is written.',
    ),
    thirdHint: b(
      'Скорость и время находят делением, а не умножением.',
      "Tezlik va vaqt bo'lish bilan topiladi, ko'paytirish bilan emas.",
      'Speed and time are found by dividing, not by multiplying.',
    ),
    correctText: b(
      'Верно. Ошибка в действии и ошибка в единице — разные сбои.',
      "To'g'ri. Amal xatosi va birlik xatosi — boshqa-boshqa nuqson.",
      'Correct. A wrong action and a wrong unit are different faults.',
    ),
    rule: b(
      'Решение проверяют дважды: действие и единицу.',
      'Yechim ikki marta tekshiriladi: amal va birlik.',
      'A solution is checked twice: the action and the unit.',
    ),
  },

  {
    id: '10', level: 'red', kind: 'missing', skillTag: 'time_from_distance_speed', answer: '12', maxLen: 3,
    visual: { type: 'record', text: '660 : 55 = □' },
    setup: b(
      'Состав прошёл 660 км со скоростью 55 км/ч.',
      "Ekspress 660 km ni 55 km/soat tezlik bilan o'tdi.",
      'A train covered 660 km at a speed of 55 km/h.',
    ),
    prompt: b('Сколько часов он был в пути?', 'U necha soat yo\'lda bo\'ldi?', 'How many hours was it travelling?'),
    wrong: [b(
      'Время находят делением расстояния на скорость.',
      "Vaqt masofani tezlikka bo'lish bilan topiladi.",
      'Time is found by dividing the distance by the speed.',
    )],
    secondHint: b(
      'За каждый час состав проходит 55 км.',
      "Har soatda ekspress 55 km yo'l o'tadi.",
      'Each hour the train covers 55 km.',
    ),
    thirdHint: b('660 : 55 = 12.', '660 : 55 = 12.', '660 : 55 = 12.'),
    correctText: b(
      'Верно. 12 часов, и это проверяется умножением 55 × 12 = 660.',
      "To'g'ri. 12 soat, buni 55 × 12 = 660 ko'paytirish bilan tekshiriladi.",
      'Correct. 12 hours, and the check is 55 × 12 = 660.',
    ),
    rule: b(
      'Найденное время проверяют умножением на скорость.',
      "Topilgan vaqt tezlikka ko'paytirish bilan tekshiriladi.",
      'The time that has been found is checked by multiplying it by the speed.',
    ),
  },
];

const shuffle = (items) => {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
};

const adaptive = (task, pickedOption, attempts, custom) => (
  attempts >= 3 ? task.thirdHint
    : attempts >= 2 ? task.secondHint
      : custom || pickedOption?.wrong || task.wrong?.[0] || task.secondHint
);

// ---------------------------------------------------------------------------
// MODELLAR
// ---------------------------------------------------------------------------

// Shkala. `showAll` yolg'on bo'lsa, faqat chetlar imzolanadi va bola bo'linma
// qiymatini o'zi hisoblab, belgilarni sanaydi — 08-topshiriqning yadrosi shu.
// Bo'linma qiymati matnda hech qachon berilmaydi.
function ScaleModel({ visual, interactive = false, picked, onPick, disabled = false, hint = false }) {
  const { min, max, intervals, markerIndex, unit = '', showAll = false } = visual;
  const step = (max - min) / intervals;
  const values = Array.from({ length: intervals + 1 }, (_, index) => min + step * index);
  return (
    <div className={`p4-scale ${hint ? 'is-hint' : ''}`}>
      <div className="p4-scale-axis">
        {values.map((value, index) => {
          const edge = index === 0 || index === intervals;
          const label = `${value}${unit ? ` ${unit}` : ''}`;
          return (
            <div className="p4-scale-tick" style={{ left: `${(index / intervals) * 100}%` }} key={value}>
              {interactive
                ? (
                  <button
                    type="button"
                    disabled={disabled}
                    className={picked === String(value) ? 'is-picked' : ''}
                    aria-label={label}
                    aria-pressed={picked === String(value)}
                  onClick={() => onPick(String(value))}
                  >{showAll || edge ? value : '·'}</button>
                )
                : <span>{showAll || edge ? label : ''}</span>}
            </div>
          );
        })}
        {markerIndex !== undefined && (
          <span className="p4-scale-marker" style={{ left: `${(markerIndex / intervals) * 100}%` }} aria-hidden="true">▼</span>
        )}
        {/* O'q imzosi majburiy (METODIK_PROFIL_MATEMATIKA.md): shkala nimani
            o'lchayotgani chizmaning o'zida yozilgan bo'lishi kerak. */}
        {unit && <span className="p4-scale-unit">{unit}</span>}
      </div>
    </div>
  );
}

function TableModel({ visual, lang }) {
  return (
    <table className="p4-table">
      <thead>
        <tr>{visual.head.map((cell, index) => <th key={index}>{tx(cell, lang)}</th>)}</tr>
      </thead>
      <tbody>
        {visual.rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className={cell === '?' ? 'is-open' : ''}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function RecordCard({ visual }) {
  return <p className={`p4-record ${visual.error ? 'is-error' : ''}`}>{visual.text}</p>;
}

function NumPad({ value, onChange, max, disabled, lang }) {
  return (
    <div className="p4-pad" role="group" aria-label={tx(UI.typeAnswer, lang)}>
      <div className="p4-pad-display">{value || '—'}</div>
      <div className="p4-pad-keys">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => (
          <button type="button" key={digit} disabled={disabled} onClick={() => onChange(value.length >= max ? value : `${value}${digit}`)}>{digit}</button>
        ))}
        <button type="button" className="is-delete" disabled={disabled} aria-label={tx(UI.clear, lang)} onClick={() => onChange(value.slice(0, -1))}>⌫</button>
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

// ---------------------------------------------------------------------------
// BITTA TOPSHIRIQ
// ---------------------------------------------------------------------------

function Task({ task, lang, isLast, onSolved, shuffleSeed }) {
  const [picked, setPicked] = useState(null);
  const [typed, setTyped] = useState('');
  const [pairs, setPairs] = useState({});
  const [activeLeft, setActiveLeft] = useState(null);
  const [placed, setPlaced] = useState({});
  const [activeStep, setActiveStep] = useState(null);
  const [assignments, setAssignments] = useState({});
  const [activeToken, setActiveToken] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [checked, setChecked] = useState(false);
  const [solved, setSolved] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const checkingRef = useRef(false);
  const advancedRef = useRef(false);
  const feedbackRef = useRef(null);

  // Xato javobdan keyin variantlar qayta aralashadi (metodist qarori 2026-08-21).
  const [wrongRound, setWrongRound] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- restart/task keys intentionally trigger a fresh shuffle
  const options = useMemo(() => shuffle(task.options || []), [shuffleSeed, task.id, task.options, wrongRound]);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- restart/task keys intentionally trigger a fresh shuffle
  const rightCards = useMemo(() => shuffle(task.right || []), [shuffleSeed, task.id, task.right]);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- restart/task keys intentionally trigger a fresh shuffle
  const orderCards = useMemo(() => shuffle(task.cards || []), [shuffleSeed, task.id, task.cards]);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- restart/task keys intentionally trigger a fresh shuffle
  const sortTokens = useMemo(() => shuffle(task.items || []), [shuffleSeed, task.id, task.items]);

  useEffect(() => {
    if (checked) window.setTimeout(() => feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 120);
  }, [checked]);

  const answerReady = (() => {
    if (task.kind === 'ticks') return picked !== null;
    if (task.kind === 'numpad' || task.kind === 'missing') return typed.length > 0;
    if (task.kind === 'match') return task.pairs.every((pair) => pairs[pair.id]);
    if (task.kind === 'order') return task.steps.every((step) => placed[step.id]);
    return task.items.every((item) => assignments[item.id]);
  })();

  const answerCorrect = () => {
    if (task.kind === 'ticks') return picked === task.answer;
    if (task.kind === 'numpad' || task.kind === 'missing') return typed === task.answer;
    if (task.kind === 'match') return task.pairs.every((pair) => pairs[pair.id] === pair.correctRight);
    if (task.kind === 'order') return task.cards.every((card) => placed[task.steps[card.order].id] === card.id);
    return task.items.every((item) => assignments[item.id] === item.bin);
  };

  const hintLevel = checked && !solved ? attempts : 0;

  const clearResponse = () => {
    checkingRef.current = false;
    setChecked(false); setPicked(null); setTyped('');
    setPairs({}); setActiveLeft(null); setPlaced({}); setActiveStep(null);
    setAssignments({}); setActiveToken(null);
  };
  const setAnswer = (setter, value) => { checkingRef.current = false; setter(value); setChecked(false); };
  const check = () => {
    if (!answerReady || solved || checked || checkingRef.current) return;
    checkingRef.current = true;
    setAttempts((old) => old + 1);
    setChecked(true);
    if (answerCorrect()) setSolved(true); else setWrongRound((old) => old + 1);
  };

  const studentAnswer = (() => {
    if (task.kind === 'ticks') return { value: picked };
    if (task.kind === 'numpad' || task.kind === 'missing') return { value: typed };
    if (task.kind === 'match') return { pairs };
    if (task.kind === 'order') return { order: task.steps.map((step) => placed[step.id]) };
    return { bins: assignments };
  })();

  const correctAnswer = (() => {
    if (task.kind === 'ticks' || task.kind === 'numpad' || task.kind === 'missing') return { value: task.answer };
    if (task.kind === 'match') return { pairs: Object.fromEntries(task.pairs.map((pair) => [pair.id, pair.correctRight])) };
    if (task.kind === 'order') return { order: task.cards.slice().sort((a, c) => a.order - c.order).map((card) => card.id) };
    return { bins: Object.fromEntries(task.items.map((item) => [item.id, item.bin])) };
  })();

  const firstSortWrong = task.kind === 'sort' && checked && !solved
    ? task.items.find((item) => assignments[item.id] && assignments[item.id] !== item.bin)?.id
    : null;

  const cardText = (id) => tx(task.cards.find((card) => card.id === id)?.text, lang);

  return (
    <section className={`p4-task ${hintLevel >= 2 ? 'is-hint' : ''}`} aria-labelledby={`task-${task.id}`}>
      <p className="p4-eyebrow"><span>{tx(UI.level[task.level], lang)}</span> · {tx(UI.task, lang)} {Number(task.id)}</p>
      <p className="p4-setup">{tx(task.setup, lang)}</p>

      {task.visual?.type === 'table' && <div className="p4-visual"><TableModel visual={task.visual} lang={lang} /></div>}
      {task.visual?.type === 'record' && <div className="p4-visual"><RecordCard visual={task.visual} /></div>}
      {task.visual?.type === 'scale' && task.kind !== 'ticks' && (
        <div className="p4-visual"><ScaleModel visual={task.visual} hint={hintLevel >= 2}/></div>
      )}

      <h2 id={`task-${task.id}`} className="p4-ask">{tx(task.prompt, lang)}</h2>

      {task.kind === 'ticks' && (
        <div className="p4-visual">
          <ScaleModel
            visual={task.visual}
            interactive
            picked={picked}
            onPick={(value) => setAnswer(setPicked, value)}
            disabled={solved}
            hint={hintLevel >= 2}
          />
          <p className="p4-note">{tx(UI.tickHint, lang)}</p>
        </div>
      )}

      {(task.kind === 'numpad' || task.kind === 'missing') && (
        <NumPad value={typed} onChange={(value) => setAnswer(setTyped, value)} max={task.maxLen || 4} disabled={solved} lang={lang} />
      )}

      {task.kind === 'match' && (
        <div className="p4-match">
          <p className="p4-note">{tx(UI.matchHint, lang)}</p>
          <div className="p4-match-cols">
            <div className="p4-match-col">
              {task.pairs.map((pair) => (
                <button
                  type="button"
                  key={pair.id}
                  disabled={solved}
                  aria-pressed={activeLeft === pair.id}
                  className={`p4-match-item ${activeLeft === pair.id ? 'is-active' : ''} ${pairs[pair.id] ? 'is-tied' : ''}`}
                  onClick={() => { checkingRef.current = false; setActiveLeft(pair.id); setChecked(false); }}
                >
                  <span>{tx(pair.left, lang)}</span>
                  {pairs[pair.id] && <b>{tx(task.right.find((item) => item.id === pairs[pair.id])?.text, lang)}</b>}
                </button>
              ))}
            </div>
            <div className="p4-match-col">
              {rightCards.map((item) => {
                const used = Object.values(pairs).includes(item.id);
                return (
                  <button
                    type="button"
                    key={item.id}
                    disabled={solved || activeLeft === null || used}
                    className={`p4-match-item is-record ${used ? 'is-used' : ''}`}
                    onClick={() => {
                      checkingRef.current = false;
                      setPairs((old) => ({ ...old, [activeLeft]: item.id }));
                      setActiveLeft(null);
                      setChecked(false);
                    }}
                  >{tx(item.text, lang)}</button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {task.kind === 'order' && (
        <div className="p4-order">
          <p className="p4-note">{tx(UI.orderHint, lang)}</p>
          <div className="p4-order-slots">
            {task.steps.map((step) => (
              <button
                type="button"
                key={step.id}
                disabled={solved}
                aria-pressed={activeStep === step.id}
                className={`p4-order-slot ${activeStep === step.id ? 'is-active' : ''}`}
                onClick={() => { checkingRef.current = false; setActiveStep(step.id); setChecked(false); }}
              >
                <small>{tx(step.label, lang)}</small>
                <b>{placed[step.id] ? cardText(placed[step.id]) : '—'}</b>
              </button>
            ))}
          </div>
          <div className="p4-card-bank">
            {orderCards.map((card) => {
              const used = Object.values(placed).includes(card.id);
              return (
                <button
                  type="button"
                  key={card.id}
                  disabled={solved || activeStep === null || used}
                  className={`p4-card ${used ? 'is-used' : ''}`}
                  onClick={() => {
                    checkingRef.current = false;
                    setPlaced((old) => ({ ...old, [activeStep]: card.id }));
                    setActiveStep(null);
                    setChecked(false);
                  }}
                >{tx(card.text, lang)}</button>
              );
            })}
          </div>
        </div>
      )}

      {task.kind === 'sort' && (
        <div className="p4-sort">
          <p className="p4-note">{tx(UI.sortHint, lang)}</p>
          <div className="p4-sort-pool">
            {sortTokens.filter((item) => !assignments[item.id]).map((item) => (
              <button
                type="button"
                key={item.id}
                disabled={solved}
                aria-pressed={activeToken === item.id}
                className={`p4-sort-token is-wide ${activeToken === item.id ? 'is-active' : ''}`}
                onClick={() => { checkingRef.current = false; setActiveToken(item.id); setChecked(false); }}
              >{tx(item.text, lang)}</button>
            ))}
            {sortTokens.every((item) => assignments[item.id]) && <span className="p4-pool-done">✓</span>}
          </div>
          <div className="p4-sort-bins">
            {task.bins.map((bin) => (
              <div className="p4-sort-bin" key={bin.id}>
                <button
                  type="button"
                  className="p4-sort-bin-head"
                  disabled={solved || activeToken === null}
                  onClick={() => {
                    if (activeToken === null) return;
                    checkingRef.current = false;
                    setAssignments((old) => ({ ...old, [activeToken]: bin.id }));
                    setActiveToken(null);
                    setChecked(false);
                  }}
                >{tx(bin.label, lang)}</button>
                <div className="p4-sort-bin-items">
                  {sortTokens.filter((item) => assignments[item.id] === bin.id).map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      disabled={solved}
                      className={`p4-sort-token is-placed ${firstSortWrong === item.id ? 'is-no' : ''}`}
                      aria-label={`${tx(UI.returnCard, lang)} ${tx(item.text, lang)}`}
                      onClick={() => {
                        checkingRef.current = false;
                        setAssignments((old) => {
                          const next = { ...old };
                          delete next[item.id];
                          return next;
                        });
                        setActiveToken(item.id);
                        setChecked(false);
                      }}
                    >{tx(item.text, lang)}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {checked && (
        <Feedback
          feedbackRef={feedbackRef}
          ok={solved}
          text={solved ? task.correctText : adaptive(task, null, attempts, null)}
          rule={task.rule}
          lang={lang}
        />
      )}

      <div className="p4-actions">
        {!checked && !solved && (
          <button type="button" className="p4-btn" disabled={!answerReady} onClick={check}>{tx(UI.check, lang)}</button>
        )}
        {checked && !solved && (
          <button type="button" className="p4-btn p4-btn-ghost" onClick={clearResponse}>{tx(UI.retry, lang)}</button>
        )}
        {solved && (
          <button
            type="button"
            className="p4-btn p4-btn-ready"
            disabled={advancing}
            onClick={() => {
              if (advancedRef.current) return;
              advancedRef.current = true;
              checkingRef.current = false;
              setAdvancing(true);
              onSolved({
                taskId: task.id, taskNumber: Number(task.id), level: task.level, kind: task.kind,
                skillTag: task.skillTag, attempts, firstTry: attempts === 1, correct: true,
                setup: task.setup, prompt: task.prompt, studentAnswer, correctAnswer,
                answerChoices: options.length
                  ? options.map(({ id, text, correct }) => ({ id, text, correct: Boolean(correct) }))
                  : task.right ?? task.cards ?? task.items ?? null,
                screenMeta: SCREEN_META.find((screen) => screen.taskId === task.id),
              });
            }}
          >{tx(isLast ? UI.finish : UI.next, lang)}</button>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// HOST
// ---------------------------------------------------------------------------

export default function Grade4Dars45Practice({ studentName, lang: langProp, onFinished }) {
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
  const percent = Math.round(((finished ? 10 : index) / 10) * 100);

  const onSolved = (record) => {
    const nextAnswers = [...answers, record];
    const nextFirstTry = firstTry + (record.firstTry ? 1 : 0);
    setAnswers(nextAnswers);
    setFirstTry(nextFirstTry);
    if (index !== 9) { setIndex((old) => old + 1); return; }
    if (finishedRef.current) return;
    finishedRef.current = true;
    setFinished(true);
    const scorePercent = Math.round((nextFirstTry / 10) * 100);
    const levelBreakdown = ['green', 'yellow', 'red'].reduce((result, level) => ({
      ...result,
      [level]: {
        total: TASKS.filter((item) => item.level === level).length,
        firstTry: nextAnswers.filter((item) => item.level === level && item.firstTry).length,
      },
    }), {});
    onFinished?.({
      lessonId: LESSON_META.lessonId, lessonTitle: tx(LESSON_META.lessonTitle, lang),
      lessonTitleLocalized: LESSON_META.lessonTitle, studentName: studentName || null,
      activityType: 'practice', completed: true, totalQuestions: 10, answeredQuestions: 10,
      correctAnswers: nextFirstTry, firstTryCorrect: nextFirstTry, scorePercent,
      finalScore: nextFirstTry, finalTotal: 10, passed: nextFirstTry >= 6,
      firstTryStats: { total: 10, firstTryCorrect: nextFirstTry, correct: nextFirstTry, answered: 10, scorePercent },
      attemptsTotal: nextAnswers.reduce((sum, item) => sum + item.attempts, 0),
      // eslint-disable-next-line react-hooks/purity -- duration is captured when the lesson finishes
      durationSec: startedAtRef.current ? Math.max(0, Math.floor((Date.now() - startedAtRef.current) / 1000)) : 0,
      skillTags: [...new Set(TASKS.map((item) => item.skillTag))],
      levelBreakdown, lessonMeta: LESSON_META, screenMeta: SCREEN_META, answers: nextAnswers,
    });
  };

  const restart = () => {
    finishedRef.current = false;
    startedAtRef.current = Date.now();
    setIndex(0); setAnswers([]); setFirstTry(0); setFinished(false); setRunId((old) => old + 1);
  };

  return (
    <div className="p4-root">
      <style>{STYLES}</style>
      {preview && (
        <div className="p4-lang" role="group" aria-label={tx(UI.language, lang)}>
          {SUPPORTED_LANGS.map((code) => (
            <button type="button" key={code} aria-pressed={lang === code} className={lang === code ? 'is-active' : ''} onClick={() => setPreviewLang(code)}>
              {code.toUpperCase()}
            </button>
          ))}
        </div>
      )}
      <header className="p4-head">
        <div className="p4-progress" role="progressbar" aria-label={tx(UI.title, lang)} aria-valuemin="0" aria-valuemax="10" aria-valuenow={finished ? 10 : index}>
          <div className="p4-progress-bar" style={{ width: `${percent}%` }} />
        </div>
        <div className="p4-head-row">
          <span className="p4-title">{tx(UI.title, lang)}</span>
          <span className="p4-counter">{finished ? 10 : index + 1} / 10</span>
        </div>
      </header>
      <main className="p4-main">
        {finished ? (
          <section className="p4-done" aria-live="polite">
            <h2>{tx(UI.done, lang)}</h2>
            <p className="p4-score"><b>{firstTry}</b><span>/ 10</span></p>
            <p className="p4-note">{tx(UI.firstTry, lang)}</p>
            <p className="p4-complete">{tx(UI.allSolved, lang)}</p>
            <button type="button" className="p4-btn p4-btn-ready" onClick={restart}>{tx(UI.again, lang)}</button>
          </section>
        ) : (
          <Task
            key={`${runId}-${task.id}`}
            task={task}
            lang={lang}
            isLast={index === 9}
            onSolved={onSolved}
            shuffleSeed={`${LESSON_META.lessonId}:${runId}`}
          />
        )}
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// USLUBLAR — fayl ichida: LMS ga alohida .css bormaydi.
// ---------------------------------------------------------------------------
const STYLES = `
.p4-root{position:relative;display:flex;flex-direction:column;min-height:100dvh;overflow-x:clip;padding:0 0 22px;font-family:'Manrope',system-ui,sans-serif;color:${T.ink};background:${T.bg}}
.p4-root *,.p4-root *::before,.p4-root *::after{box-sizing:border-box}
.p4-root h2,.p4-root p{margin:0}
.p4-root button:focus-visible{outline:3px solid rgba(22,143,163,.45);outline-offset:3px}
.p4-lang{position:absolute;top:8px;right:8px;z-index:9;display:flex;gap:6px}
.p4-lang button{min-width:44px;min-height:44px;padding:0 10px;border:0;border-radius:99px;background:${T.paper};color:${T.ink2};font:800 11px 'Manrope',sans-serif;cursor:pointer;box-shadow:0 4px 12px -8px rgba(23,59,82,.4)}
.p4-lang button.is-active{background:${T.accent};color:#fff}
.p4-head{padding:46px clamp(12px,4vw,24px) 8px}
.p4-progress,.p4-head-row,.p4-main{width:min(720px,100%);margin-inline:auto}
.p4-progress{height:6px;border-radius:99px;background:rgba(23,59,82,.12);overflow:hidden}
.p4-progress-bar{height:100%;background:linear-gradient(90deg,${T.cyan},${T.accent});transition:width .4s ease}
.p4-head-row{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-top:8px}
.p4-title{font-family:'Source Serif 4',Georgia,serif;font-weight:600;font-size:clamp(15px,2.4vw,19px)}
.p4-counter{white-space:nowrap;font:700 13px 'JetBrains Mono',monospace;color:${T.ink3}}
.p4-main{flex:1;padding:4px clamp(12px,4vw,24px)}
.p4-task{display:flex;flex-direction:column;gap:11px}
.p4-eyebrow{color:${T.accent};font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase}
.p4-setup{color:${T.ink2};font-size:clamp(14px,2vw,16px);line-height:1.5}
.p4-ask{font:600 clamp(17px,2.6vw,21px)/1.25 'Source Serif 4',Georgia,serif;color:${T.ink}}
.p4-note{color:${T.ink3};font-size:13px;line-height:1.4;text-align:center}
.p4-visual{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;width:100%;min-height:100px;padding:12px 10px;border-radius:16px;background:${T.paper};box-shadow:inset 0 0 0 1px rgba(23,59,82,.08);overflow:hidden}
.p4-scale{width:min(100%,520px);padding:30px 30px 58px}
.p4-scale.is-hint .p4-scale-axis{box-shadow:0 0 0 5px rgba(255,91,53,.16)}
.p4-scale-axis{position:relative;width:100%;height:5px;border-radius:99px;background:${T.navy}}
.p4-scale-tick{position:absolute;top:50%;transform:translate(-50%,-50%);width:3px;height:20px;border-radius:2px;background:${T.cyan}}
.p4-scale-tick span,.p4-scale-tick button{position:absolute;top:18px;left:50%;transform:translateX(-50%);min-width:44px;min-height:44px;padding:2px;border:0;background:transparent;color:${T.navy};font:800 12px 'JetBrains Mono',monospace;white-space:nowrap}
.p4-scale-tick button{border-radius:10px;cursor:pointer}
.p4-scale-tick button:hover:not(:disabled),.p4-scale-tick button.is-picked{background:${T.accentSoft};color:${T.accent}}
.p4-scale-marker{position:absolute;top:-30px;transform:translateX(-50%);color:${T.accent};font-size:22px}
.p4-scale-unit{position:absolute;left:calc(100% + 8px);top:-8px;color:${T.ink3};font:800 11px 'Manrope',sans-serif}
.p4-table{border-collapse:collapse;font-family:'JetBrains Mono',monospace}
.p4-table th{padding:6px 12px;color:${T.ink3};font:800 11px 'Manrope',sans-serif;letter-spacing:.06em;text-transform:uppercase}
.p4-table td{padding:9px 14px;border-radius:10px;background:${T.cyanSoft};color:${T.navy};font-weight:800;font-size:clamp(14px,3vw,19px);text-align:center}
.p4-table td.is-open{background:${T.accentSoft};color:${T.accent};box-shadow:inset 0 0 0 2px ${T.accent}}
.p4-record{text-align:center;font:800 clamp(19px,4.2vw,28px) 'JetBrains Mono',monospace;color:${T.navy}}
.p4-record.is-error{color:${T.warn};text-decoration:line-through}
.p4-pad{display:flex;flex-direction:column;align-items:center;gap:8px;width:min(240px,100%);margin:0 auto;padding:12px;border-radius:18px;background:linear-gradient(155deg,#EDF1F3,#DDE4E8);box-shadow:inset 0 1px rgba(255,255,255,.9)}
.p4-pad-display{display:flex;align-items:center;justify-content:center;width:100%;min-height:50px;border:2px solid ${T.accent};border-radius:13px;background:${T.paper};color:${T.navy};font:800 clamp(20px,4.4vw,26px) 'JetBrains Mono',monospace;letter-spacing:2px}
.p4-pad-keys{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;width:100%}
.p4-pad-keys button{min-width:44px;min-height:44px;border:1px solid rgba(23,59,82,.16);border-radius:12px;background:${T.paper};color:${T.navy};font:800 clamp(18px,3.6vw,22px) 'JetBrains Mono',monospace;cursor:pointer}
.p4-pad-keys button:hover:not(:disabled){border-color:${T.cyan}}
.p4-pad-keys .is-delete{background:${T.accentSoft};color:${T.accent}}
.p4-match-cols{display:grid;grid-template-columns:1.4fr 1fr;gap:10px;margin-top:7px}
.p4-match-col{display:grid;gap:8px;align-content:start}
.p4-match-item{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-width:44px;min-height:52px;padding:8px 9px;border:1px solid rgba(23,59,82,.12);border-radius:12px;background:${T.paper};color:${T.navy};font:700 clamp(11.5px,1.9vw,13.5px)/1.3 'Manrope',sans-serif;text-align:center;cursor:pointer}
.p4-match-item.is-record{font-family:'JetBrains Mono',monospace;font-weight:800}
.p4-match-item.is-active{border-color:${T.accent};background:${T.accentSoft}}
.p4-match-item.is-tied{border-color:rgba(34,122,83,.35)}
.p4-match-item.is-used{background:${T.successSoft};opacity:.65}
.p4-match-item:disabled{cursor:default}
.p4-match-item b{color:${T.success};font-size:11px;font-family:'JetBrains Mono',monospace}
.p4-order-slots{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin-top:7px}
.p4-order-slot{display:grid;place-items:center;gap:4px;min-width:44px;min-height:74px;padding:7px;border:1px solid rgba(23,59,82,.12);border-radius:13px;background:${T.paper};color:${T.ink2};font-family:inherit;cursor:pointer}
.p4-order-slot.is-active{border-color:${T.accent};background:${T.accentSoft}}
.p4-order-slot small{font-weight:800}
.p4-order-slot b{font:700 11px/1.25 'Manrope',sans-serif;color:${T.navy};text-align:center}
.p4-card-bank{display:flex;flex-wrap:wrap;justify-content:center;gap:7px;margin-top:8px}
.p4-card{min-width:44px;min-height:46px;padding:8px 11px;border:1px solid rgba(23,59,82,.12);border-radius:12px;background:${T.paper};color:${T.navy};font:700 12.5px/1.3 'Manrope',sans-serif;cursor:pointer}
.p4-card.is-used{background:${T.cyanSoft};opacity:.7}
.p4-sort{display:flex;flex-direction:column;gap:10px}
.p4-sort-pool{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:8px;min-height:60px;padding:8px;border-radius:14px;background:${T.paper};box-shadow:inset 0 0 0 1px rgba(23,59,82,.08)}
.p4-pool-done{color:${T.success};font-size:26px}
.p4-sort-token{min-width:44px;min-height:44px;padding:6px 10px;border:1px solid rgba(23,59,82,.14);border-radius:12px;background:${T.paper};color:${T.navy};font:700 12px/1.25 'JetBrains Mono',monospace;cursor:pointer}
.p4-sort-token.is-wide{max-width:260px}
.p4-sort-token.is-active{border-color:${T.accent};background:${T.accentSoft};transform:translateY(-2px)}
.p4-sort-token.is-no{border-color:${T.warn};background:${T.warnSoft}}
.p4-sort-bins{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
.p4-sort-bin{min-height:104px;padding:8px;border-radius:14px;background:${T.paper};box-shadow:inset 0 0 0 1px rgba(23,59,82,.08)}
.p4-sort-bin-head{width:100%;min-width:44px;min-height:44px;padding:8px 6px;border:0;border-radius:10px;background:${T.cyanSoft};color:${T.cyan};font:800 12px/1.25 'Manrope',sans-serif;cursor:pointer}
.p4-sort-bin-head:disabled{cursor:default;opacity:.78}
.p4-sort-bin-items{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:6px;padding-top:8px}
.p4-feedback{padding:12px 14px;border-radius:14px;line-height:1.45;animation:p4-result .22s ease both}
.p4-feedback.is-ok{background:${T.successSoft};color:#1B6644;box-shadow:inset 4px 0 0 ${T.success}}
.p4-feedback.is-no{background:${T.warnSoft};color:#8A5C10;box-shadow:inset 4px 0 0 ${T.warn}}
.p4-feedback p{font-family:'Source Serif 4',Georgia,serif;font-size:clamp(14px,2.1vw,16px)}
.p4-rule{margin-top:6px!important;color:${T.ink2}}
.p4-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:4px}
.p4-btn{min-width:44px;min-height:46px;padding:10px 22px;border:0;border-radius:12px;background:${T.paper};color:${T.accent};font:800 14px 'Manrope',sans-serif;cursor:pointer;box-shadow:0 8px 20px -10px rgba(255,91,53,.5),inset 0 0 0 1px rgba(255,91,53,.2)}
.p4-btn:disabled{opacity:.45;cursor:not-allowed;box-shadow:none}
.p4-btn-ghost{background:transparent;color:${T.ink2};box-shadow:none}
.p4-btn-ready{background:${T.accent};color:#fff}
.p4-done{display:flex;flex-direction:column;align-items:center;gap:10px;padding:20px 12px;text-align:center}
.p4-done h2{font:600 clamp(19px,3vw,24px) 'Source Serif 4',Georgia,serif}
.p4-score{display:flex;align-items:baseline;gap:5px;font-family:'JetBrains Mono',monospace}
.p4-score b{color:${T.success};font-size:clamp(32px,7vw,44px)}
.p4-score span{color:${T.ink3};font-size:15px}
.p4-complete{color:${T.ink2}}
@keyframes p4-result{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
@media(max-width:520px){
  .p4-match-cols{grid-template-columns:1fr 1fr}
  .p4-order-slots{grid-template-columns:repeat(2,minmax(0,1fr))}
  .p4-order-slot{min-height:62px;padding:6px}
  .p4-sort-bins{grid-template-columns:1fr;gap:6px}
  .p4-sort-bin{display:flex;align-items:center;gap:8px;min-height:56px;padding:6px}
  .p4-sort-bin-head{flex:0 0 34%;min-height:44px;padding:6px 4px;font-size:11px}
  .p4-sort-bin-items{flex:1;justify-content:flex-start;padding-top:0}
  .p4-sort-pool{min-height:56px;gap:6px}
  .p4-sort-token.is-wide{max-width:100%}
  .p4-scale{padding:26px 24px 54px}
  .p4-scale-tick span,.p4-scale-tick button{font-size:11px;min-width:38px}
  .p4-table td{padding:7px 9px}
  .p4-main{padding:4px 8px}
  .p4-head{padding:64px 8px 6px}
  .p4-visual{padding:10px 6px;min-height:92px}
  .p4-task{gap:8px}
}
@media(max-width:640px) and (max-height:700px){
  .p4-head{padding:64px 8px 3px!important}
  .p4-task{gap:6px!important}
  .p4-setup{font-size:12.5px;line-height:1.35}
  .p4-ask{font-size:16px!important}
  .p4-visual{min-height:76px!important;padding:8px 6px!important}
  .p4-btn{min-height:44px!important;padding:8px 16px}
  .p4-feedback{padding:9px 11px}
}
@media(prefers-reduced-motion:reduce){
  .p4-root *,.p4-root *::before,.p4-root *::after{scroll-behavior:auto!important;animation:none!important;transition:none!important}
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
