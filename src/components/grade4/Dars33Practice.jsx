// ============================================================================
// 4-SINF · 33-DARS AMALIYOTI · BURCHAK TURLARI
// 10 topshiriq · UZ/RU/EN · ovozsiz · solve-to-advance.
//
// SKELET: src/books/grade4/AMALIYOT_31_40_SKELET.md §5.3.
// Raskladka (scripts/grade4-practice-31-40-layout.mjs):
//   match · order · mc · ticks · sign · missing · order · sort · ticks · missing
//
// NEGA BITTA FAYL VA NEGA CHIZMALAR SHU YERDA. LMS darsni bitta avtonom .jsx
// sifatida qabul qiladi: lokal import yo'q. Nazariy darsdagi `AngleSvg`
// figurasini import qilib bo'lmaydi, shuning uchun burchak chizmasi shu faylda
// qaytadan yoziladi. CLAUDE.md §5 nusxa taqiqiga zid emas — LMS majbur qiladi.
//
// DIZAYN: Dars01Practice.jsx. RUS TILIDA MUROJAAT — «ты».
//
// CHIZMA QOIDASI. Burchak chizmalarida tomon uzunliklari ATAYIN har xil: mavzu
// yadrosi «burchakni ochilish o'lchaydi, tomon uzunligi emas». 08-topshiriqda
// 89°, 90° va 91° chizmalari ko'zga bir xil ko'rinadi — chegaraviy holatning
// ma'nosi shu: bu yerda son hal qiladi, chizma emas.
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
    'Урок 33. Практика: виды углов',
    '33-dars. Amaliyot: burchak turlari',
    'Lesson 33. Practice: types of angles',
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
  sortHint: b(
    'Нажми запись, потом её ящик.',
    'Yozuvni bosing, keyin uning qutisini bosing.',
    'Tap a record, then its box.',
  ),
  scaleHint: b(
    'Нажми значение под дугой.',
    'Yoy ostidagi qiymatni bosing.',
    'Tap the value under the arc.',
  ),
  returnCard: b('Вернуть', 'Qaytarish', 'Return'),
  rightAngle: b('прямой угол', "to'g'ri burchak", 'right angle'),
};

const LESSON_META = {
  lessonId: 'num-4-33-practice',
  lessonTitle: UI.title,
  grade: 4,
  lessonNumber: 33,
  activityType: 'practice',
  taskCount: 10,
  resultIsUiState: true,
  progression: { green: 2, yellow: 5, red: 3 },
};

const SCREEN_META = [
  { id: 'practice-01', taskId: '01', template: 'matching', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-02', taskId: '02', template: 'ordering', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-03', taskId: '03', template: 'multiple-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-04', taskId: '04', template: 'scale-reading', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-05', taskId: '05', template: 'sign-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-06', taskId: '06', template: 'numeric-blank', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-07', taskId: '07', template: 'ordering', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-08', taskId: '08', template: 'boundary-sort', type: 'practice', scored: true, scope: 'module-mikro' },
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

const TYPE_NAMES = {
  acute: b('острый', "o'tkir", 'acute'),
  right: b('прямой', "to'g'ri", 'right'),
  obtuse: b('тупой', "o'tmas", 'obtuse'),
  straight: b('развёрнутый', 'yoyiq', 'straight'),
};

const TASKS = [
  {
    id: '01', level: 'green', kind: 'match', skillTag: 'angle_type_recognition',
    // Tomon uzunliklari atayin har xil: 55° eng uzun tomonli, 90° eng qisqa.
    visual: { type: 'angles', items: [{ deg: 55, arm: 62 }, { deg: 90, arm: 34 }, { deg: 115, arm: 44 }, { deg: 180, arm: 54 }] },
    setup: b(
      'На чертёж перекрёстка нанесли четыре угла. Длины сторон у них разные.',
      "Chorraha chizmasiga to'rtta burchak tushirilgan. Ularning tomon uzunliklari har xil.",
      'Four angles are drawn on the junction plan. Their arms have different lengths.',
    ),
    prompt: b(
      'Соедини каждый угол с его названием.',
      'Har bir burchakni uning nomi bilan birlashtiring.',
      'Match each angle with its name.',
    ),
    pairs: [
      { id: 'a55', left: b('55°', '55°', '55°'), correctRight: 'acute' },
      { id: 'a90', left: b('90°', '90°', '90°'), correctRight: 'right' },
      { id: 'a115', left: b('115°', '115°', '115°'), correctRight: 'obtuse' },
      { id: 'a180', left: b('180°', '180°', '180°'), correctRight: 'straight' },
    ],
    right: [
      { id: 'acute', text: TYPE_NAMES.acute },
      { id: 'right', text: TYPE_NAMES.right },
      { id: 'obtuse', text: TYPE_NAMES.obtuse },
      { id: 'straight', text: TYPE_NAMES.straight },
    ],
    wrong: [b(
      'Сравни каждый угол с 90 градусами: длина сторон на тип не влияет.',
      "Har burchakni 90 daraja bilan solishtiring: tomon uzunligi turga ta'sir qilmaydi.",
      'Compare each angle with 90 degrees: the length of the arms does not affect the type.',
    )],
    secondHint: b(
      'Меньше 90 — острый, ровно 90 — прямой, больше 90 и меньше 180 — тупой, ровно 180 — развёрнутый.',
      "90 dan kichik — o'tkir, aynan 90 — to'g'ri, 90 dan katta va 180 dan kichik — o'tmas, aynan 180 — yoyiq.",
      'Less than 90 is acute, exactly 90 is right, between 90 and 180 is obtuse, exactly 180 is straight.',
    ),
    thirdHint: b(
      '55 меньше 90; 115 больше 90, но меньше 180; у 180 стороны лежат на одной прямой.',
      '55 — 90 dan kichik; 115 — 90 dan katta, 180 dan kichik; 180 da tomonlar bitta chiziqda yotadi.',
      '55 is less than 90; 115 is more than 90 but less than 180; at 180 the arms lie on one straight line.',
    ),
    correctText: b(
      'Верно. Тип задаёт раскрытие, а не длина сторон.',
      "To'g'ri. Turni ochilish belgilaydi, tomon uzunligi emas.",
      'Correct. The type is set by the opening, not by the length of the arms.',
    ),
    rule: b(
      'Угол измеряет раскрытие; длина сторон ничего не меняет.',
      "Burchak ochilishni o'lchaydi; tomon uzunligi hech narsani o'zgartirmaydi.",
      'An angle measures the opening; the length of the arms changes nothing.',
    ),
  },

  {
    id: '02', level: 'green', kind: 'order', skillTag: 'comparison_rule',
    visual: { type: 'right-angle-gauge' },
    setup: b(
      'В бюро проверяют угол по одному и тому же правилу.',
      'Byuroda burchak har doim bitta qoida bilan tekshiriladi.',
      'The office checks an angle with one and the same rule.',
    ),
    prompt: b(
      'Расставь шаги правила по порядку.',
      'Qoida qadamlarini tartib bilan joylashtiring.',
      'Put the steps of the rule in order.',
    ),
    steps: [
      { id: 'step-1', label: b('Шаг 1', '1-qadam', 'Step 1') },
      { id: 'step-2', label: b('Шаг 2', '2-qadam', 'Step 2') },
      { id: 'step-3', label: b('Шаг 3', '3-qadam', 'Step 3') },
      { id: 'step-4', label: b('Шаг 4', '4-qadam', 'Step 4') },
    ],
    cards: [
      { id: 'take', text: b('Берём угол', 'Burchakni olamiz', 'Take the angle'), order: 0 },
      { id: 'compare', text: b('Сравниваем с 90°', '90° bilan solishtiramiz', 'Compare with 90°'), order: 1 },
      { id: 'decide', text: b('Меньше, больше или ровно', 'Kichik, katta yoki teng', 'Less, more or equal'), order: 2 },
      { id: 'name', text: b('Называем тип', 'Turini aytamiz', 'Name the type'), order: 3 },
    ],
    wrong: [b(
      'Сначала сравнение с прямым углом, и только потом название.',
      "Avval to'g'ri burchak bilan solishtirish, keyin nom.",
      'The comparison with the right angle comes first and the name only after it.',
    )],
    secondHint: b(
      'Прямой угол — основная мера, с него начинают.',
      "To'g'ri burchak — asosiy o'lchov, undan boshlanadi.",
      'The right angle is the main measure and the starting point.',
    ),
    thirdHint: b(
      'Порядок такой: угол, сравнение с 90°, вывод, название.',
      "Tartib shunday: burchak, 90° bilan solishtirish, xulosa, nom.",
      'The order is: the angle, the comparison with 90°, the conclusion, the name.',
    ),
    correctText: b(
      'Верно. Сначала сравнение, потом название.',
      "To'g'ri. Avval solishtirish, keyin nom.",
      'Correct. The comparison comes first, the name second.',
    ),
    rule: b(
      'Тип называют после сравнения с прямым углом.',
      "Tur to'g'ri burchak bilan solishtirilgandan keyin aytiladi.",
      'Name the type after comparing with the right angle.',
    ),
  },

  {
    id: '03', level: 'yellow', kind: 'mc', skillTag: 'description_to_type',
    visual: { type: 'record-plate', text: b('105°', '105°', '105°') },
    setup: b(
      'В описании перекрёстка записан только угол: 105 градусов. Чертежа нет.',
      "Chorraha tavsifida faqat burchak yozilgan: 105 daraja. Chizma yo'q.",
      'The junction description gives only the angle: 105 degrees. There is no drawing.',
    ),
    prompt: b(
      'Какой это угол?',
      'Bu qanday burchak?',
      'What type of angle is it?',
    ),
    options: [
      option('obtuse', 'тупой', "o'tmas", 'obtuse', true),
      option('right', 'прямой', "to'g'ri", 'right', false,
        'Прямой угол — ровно 90 градусов.',
        "To'g'ri burchak — aynan 90 daraja.",
        'A right angle is exactly 90 degrees.'),
      option('acute', 'острый', "o'tkir", 'acute', false,
        'Острый угол меньше 90 градусов, а 105 больше.',
        "O'tkir burchak 90 darajadan kichik, 105 esa katta.",
        'An acute angle is less than 90 degrees, but 105 is more.'),
      option('straight', 'развёрнутый', 'yoyiq', 'straight', false,
        'Развёрнутый угол — ровно 180 градусов.',
        'Yoyiq burchak — aynan 180 daraja.',
        'A straight angle is exactly 180 degrees.'),
    ],
    secondHint: b(
      'Сравни 105 сразу с двумя мерами: с 90 и с 180.',
      "105 ni ikkita o'lchov bilan solishtiring: 90 va 180 bilan.",
      'Compare 105 with both measures: 90 and 180.',
    ),
    thirdHint: b(
      '105 больше 90, но меньше 180.',
      '105 — 90 dan katta, 180 dan kichik.',
      '105 is more than 90 but less than 180.',
    ),
    correctText: b(
      'Верно. 105 градусов больше прямого угла, но меньше развёрнутого.',
      "To'g'ri. 105 daraja to'g'ri burchakdan katta, yoyiqdan kichik.",
      'Correct. 105 degrees is more than a right angle but less than a straight one.',
    ),
    rule: b(
      'Тупой угол больше 90 и меньше 180 градусов.',
      "O'tmas burchak 90 darajadan katta, 180 darajadan kichik.",
      'An obtuse angle is more than 90 and less than 180 degrees.',
    ),
  },

  {
    id: '04', level: 'yellow', kind: 'ticks', skillTag: 'read_angle_scale',
    answer: '65', tickValues: ['45', '55', '65', '75', '85'],
    visual: { type: 'angle-scale', from: 45, to: 85, step: 10, pointer: 65 },
    setup: b(
      'На дуге транспортира деления идут через 10 градусов. Подписаны только края.',
      "Transportir yoyida bo'linmalar 10 darajadan boradi. Faqat chetlari imzolangan.",
      'The graduations on the protractor arc are every 10 degrees. Only the ends are labelled.',
    ),
    prompt: b(
      'На каком значении стоит указатель?',
      "Ko'rsatkich qaysi qiymatda turibdi?",
      'Which value is the pointer on?',
    ),
    wrong: [b(
      'Считай шаги от левого края: каждый шаг равен 10 градусам.',
      'Chap chetdan qadamlarni sanang: har qadam 10 darajaga teng.',
      'Count the steps from the left end: each step is 10 degrees.',
    )],
    secondHint: b(
      'Указатель прошёл два деления после 45.',
      "Ko'rsatkich 45 dan keyin ikkita bo'linmani o'tdi.",
      'The pointer has passed two graduations after 45.',
    ),
    thirdHint: b(
      '45 плюс два раза по 10 равно 65.',
      "45 ga ikki karra 10 ni qo'shsak, 65 chiqadi.",
      '45 plus two lots of 10 equals 65.',
    ),
    correctText: b(
      'Верно. Указатель стоит на 65 градусах.',
      "To'g'ri. Ko'rsatkich 65 darajada turibdi.",
      'Correct. The pointer is on 65 degrees.',
    ),
    rule: b(
      'Значение читают по цене деления, а не на глаз.',
      "Qiymat bo'linma qiymati bo'yicha o'qiladi, ko'zga qarab emas.",
      'A value is read from the interval size, not by eye.',
    ),
  },

  {
    id: '05', level: 'yellow', kind: 'sign', skillTag: 'compare_with_right_angle',
    visual: { type: 'angle-pair', left: 155, right: 90 },
    setup: b(
      'Слева угол поворота стрелы крана, справа прямой угол.',
      "Chapda kran strelasining burilish burchagi, o'ngda to'g'ri burchak.",
      'On the left is the turning angle of the crane jib, on the right a right angle.',
    ),
    prompt: b(
      'Поставь знак: 155° □ 90°.',
      "Belgini qo'ying: 155° □ 90°.",
      'Choose the sign: 155° □ 90°.',
    ),
    options: [
      option('greater', '>', '>', '>', true),
      option('less', '<', '<', '<', false,
        'Раскрытие в 155 градусов шире прямого угла.',
        "155 darajali ochilish to'g'ri burchakdan keng.",
        'An opening of 155 degrees is wider than a right angle.'),
      option('equal', '=', '=', '=', false,
        'Ровно 90 градусов — это прямой угол, здесь раскрытие другое.',
        "Aynan 90 daraja — to'g'ri burchak, bu yerda ochilish boshqacha.",
        'Exactly 90 degrees is a right angle; the opening here is different.'),
    ],
    secondHint: b(
      'Прямой угол — 90 градусов. Сравни два числа.',
      "To'g'ri burchak — 90 daraja. Ikki sonni solishtiring.",
      'A right angle is 90 degrees. Compare the two numbers.',
    ),
    thirdHint: b(
      '155 больше 90, значит угол тупой.',
      "155 — 90 dan katta, demak burchak o'tmas.",
      '155 is more than 90, so the angle is obtuse.',
    ),
    correctText: b(
      'Верно. 155 больше 90, поэтому угол тупой.',
      "To'g'ri. 155 — 90 dan katta, shuning uchun burchak o'tmas.",
      'Correct. 155 is more than 90, so the angle is obtuse.',
    ),
    rule: b(
      'Прямой угол — граница между острым и тупым.',
      "To'g'ri burchak — o'tkir va o'tmas orasidagi chegara.",
      'The right angle is the boundary between acute and obtuse.',
    ),
  },

  {
    id: '06', level: 'yellow', kind: 'missing', skillTag: 'angle_complement',
    visual: { type: 'angle-complement', known: 25 },
    setup: b(
      'Скат крыши поднят на 25 градусов, а стойка должна встать под прямым углом.',
      "Tom qiyaligi 25 darajaga ko'tarilgan, tirgak esa to'g'ri burchak ostida turishi kerak.",
      'The roof slope rises 25 degrees, and the post must stand at a right angle.',
    ),
    prompt: b(
      'Сколько градусов не хватает до 90?',
      '90 gacha necha daraja yetmayapti?',
      'How many degrees are missing to reach 90?',
    ),
    options: [
      option('sixty-five', '65°', '65°', '65°', true),
      option('one-fifteen', '115°', '115°', '115°', false,
        'Здесь 25 прибавили к 90, а нужно вычесть.',
        "Bu yerda 25 ni 90 ga qo'shgan, ayirish kerak esa.",
        'Here 25 was added to 90, but it must be subtracted.'),
      option('twenty-five', '25°', '25°', '25°', false,
        'Это уже имеющийся угол, а не остаток до прямого.',
        "Bu allaqachon bor burchak, to'g'ri burchakkacha qolgan qism emas.",
        'That is the angle already there, not what is left to a right angle.'),
      option('one-fifty-five', '155°', '155°', '155°', false,
        'Это дополнение до развёрнутого угла, а не до прямого.',
        "Bu yoyiq burchakkacha to'ldirish, to'g'ri burchakkacha emas.",
        'That completes a straight angle, not a right angle.'),
    ],
    secondHint: b(
      'Прямой угол — 90 градусов, из него вычитают уже имеющиеся 25.',
      "To'g'ri burchak — 90 daraja, undan bor 25 ayiriladi.",
      'A right angle is 90 degrees, and the existing 25 is subtracted from it.',
    ),
    thirdHint: b(
      '90 − 25 = 65.',
      '90 − 25 = 65.',
      '90 − 25 = 65.',
    ),
    correctText: b(
      'Верно. 90 − 25 = 65 градусов.',
      "To'g'ri. 90 − 25 = 65 daraja.",
      'Correct. 90 − 25 = 65 degrees.',
    ),
    rule: b(
      'Дополнение до прямого угла находят вычитанием из 90.',
      "To'g'ri burchakkacha to'ldirish 90 dan ayirish bilan topiladi.",
      'What completes a right angle is found by subtracting from 90.',
    ),
  },

  {
    id: '07', level: 'yellow', kind: 'order', skillTag: 'order_by_opening',
    // Tomon uzunliklari tartibga TESKARI: eng katta burchakning tomoni eng qisqa.
    visual: { type: 'angles', items: [{ deg: 110, arm: 38 }, { deg: 15, arm: 64 }, { deg: 165, arm: 30 }, { deg: 75, arm: 52 }] },
    setup: b(
      'Четыре угла начерчены с разной длиной сторон.',
      "To'rtta burchak turli tomon uzunligi bilan chizilgan.",
      'Four angles are drawn with arms of different lengths.',
    ),
    prompt: b(
      'Расставь углы от самого узкого раскрытия к самому широкому.',
      'Burchaklarni eng tor ochilishdan eng kengiga qarab joylashtiring.',
      'Arrange the angles from the narrowest opening to the widest.',
    ),
    steps: [
      { id: 'place-1', label: b('1-е', '1-o\'rin', '1st') },
      { id: 'place-2', label: b('2-е', '2-o\'rin', '2nd') },
      { id: 'place-3', label: b('3-е', '3-o\'rin', '3rd') },
      { id: 'place-4', label: b('4-е', '4-o\'rin', '4th') },
    ],
    cards: [
      { id: 'd15', text: b('15°', '15°', '15°'), order: 0 },
      { id: 'd75', text: b('75°', '75°', '75°'), order: 1 },
      { id: 'd110', text: b('110°', '110°', '110°'), order: 2 },
      { id: 'd165', text: b('165°', '165°', '165°'), order: 3 },
    ],
    wrong: [b(
      'Порядок задаёт раскрытие в градусах, а не длина сторон на чертеже.',
      'Tartibni darajadagi ochilish belgilaydi, chizmadagi tomon uzunligi emas.',
      'The order comes from the opening in degrees, not from the arm lengths on the drawing.',
    )],
    secondHint: b(
      'Выпиши только числа и сравни их.',
      'Faqat sonlarni yozib olib, ularni solishtiring.',
      'Write down only the numbers and compare them.',
    ),
    thirdHint: b(
      'По возрастанию: 15, 75, 110, 165.',
      "O'sish tartibida: 15, 75, 110, 165.",
      'In increasing order: 15, 75, 110, 165.',
    ),
    correctText: b(
      'Верно. Порядок раскрытия: 15°, 75°, 110°, 165°.',
      "To'g'ri. Ochilish tartibi: 15°, 75°, 110°, 165°.",
      'Correct. The order of opening is 15°, 75°, 110°, 165°.',
    ),
    rule: b(
      'Углы сравнивают по градусам, а не по длине сторон.',
      'Burchaklar daraja bo\'yicha solishtiriladi, tomon uzunligi bo\'yicha emas.',
      'Angles are compared by degrees, not by the length of their arms.',
    ),
  },

  {
    id: '08', level: 'red', kind: 'sort', skillTag: 'boundary_sort',
    visual: { type: 'angles', items: [{ deg: 89, arm: 46 }, { deg: 90, arm: 46 }, { deg: 91, arm: 46 }, { deg: 180, arm: 46 }] },
    setup: b(
      'Четыре угла почти неотличимы на глаз: 89, 90, 91 и 180 градусов.',
      "To'rtta burchak ko'zga deyarli bir xil: 89, 90, 91 va 180 daraja.",
      'Four angles look almost identical: 89, 90, 91 and 180 degrees.',
    ),
    prompt: b(
      'Разложи углы по видам.',
      'Burchaklarni turlari bo\'yicha joylashtiring.',
      'Sort the angles by type.',
    ),
    bins: [
      { id: 'acute', label: TYPE_NAMES.acute },
      { id: 'right', label: TYPE_NAMES.right },
      { id: 'obtuse', label: TYPE_NAMES.obtuse },
      { id: 'straight', label: TYPE_NAMES.straight },
    ],
    items: [
      {
        id: 'i89', text: '89°', bin: 'acute',
        wrong: b(
          'Сравни 89 с 90: чего не хватает до прямого угла?',
          "89 ni 90 bilan solishtiring: to'g'ri burchakkacha nima yetmaydi?",
          'Compare 89 with 90: what is missing to reach a right angle?',
        ),
      },
      {
        id: 'i90', text: '90°', bin: 'right',
        wrong: b(
          'Проверь, ровно ли 90 градусов в этой записи.',
          'Bu yozuvda aynan 90 daraja bor-yo\'qligini tekshiring.',
          'Check whether this record shows exactly 90 degrees.',
        ),
      },
      {
        id: 'i91', text: '91°', bin: 'obtuse',
        wrong: b(
          'Сравни 91 с 90: на сколько больше?',
          '91 ni 90 bilan solishtiring: qancha katta?',
          'Compare 91 with 90: by how much is it greater?',
        ),
      },
      {
        id: 'i180', text: '180°', bin: 'straight',
        wrong: b(
          'Посмотри, лежат ли стороны на одной прямой.',
          'Tomonlar bitta chiziqda yotadimi, qarang.',
          'Look at whether the arms lie on one straight line.',
        ),
      },
    ],
    wrong: [b(
      'Граница — ровно 90 градусов. На глаз 89 и 91 не различить, поэтому смотри на число.',
      "Chegara — aynan 90 daraja. 89 va 91 ni ko'zga qarab ajratib bo'lmaydi, shuning uchun songa qarang.",
      'The boundary is exactly 90 degrees. You cannot tell 89 from 91 by eye, so look at the number.',
    )],
    secondHint: b(
      'Меньше 90 — острый; ровно 90 — прямой; больше 90 — тупой; ровно 180 — развёрнутый.',
      "90 dan kichik — o'tkir; aynan 90 — to'g'ri; 90 dan katta — o'tmas; aynan 180 — yoyiq.",
      'Less than 90 is acute; exactly 90 is right; more than 90 is obtuse; exactly 180 is straight.',
    ),
    thirdHint: b(
      '89 меньше 90 на один градус, 91 больше на один градус.',
      '89 — 90 dan bir daraja kichik, 91 esa bir daraja katta.',
      '89 is one degree less than 90 and 91 is one degree more.',
    ),
    correctText: b(
      'Верно. Один градус решает, острый угол или тупой.',
      "To'g'ri. Bir daraja burchak o'tkirmi yoki o'tmasmi — shuni hal qiladi.",
      'Correct. One degree decides whether the angle is acute or obtuse.',
    ),
    rule: b(
      'У границы решает число, а не вид чертежа.',
      'Chegarada son hal qiladi, chizmaning ko\'rinishi emas.',
      'At the boundary the number decides, not how the drawing looks.',
    ),
  },

  {
    id: '09', level: 'red', kind: 'ticks', skillTag: 'scale_read_error',
    answer: '115', tickValues: ['95', '105', '115', '125', '135'],
    visual: { type: 'two-scale', outer: 115, inner: 65 },
    setup: b(
      'На транспортире две шкалы, они идут навстречу друг другу. Нуль лежит на правой стороне угла, а ученик прочитал 65 градусов.',
      "Transportirda ikkita shkala bir-biriga qarshi boradi. Nol burchakning o'ng tomonida yotadi, o'quvchi esa 65 daraja o'qidi.",
      'The protractor has two scales running towards each other. The zero lies on the right arm, but the pupil read 65 degrees.',
    ),
    prompt: b(
      'Какое значение угла верное?',
      "Burchakning qaysi qiymati to'g'ri?",
      'Which value of the angle is correct?',
    ),
    wrong: [b(
      'Читай ту шкалу, у которой нуль совмещён со стороной.',
      'Noli tomonga moslangan shkalani o\'qing.',
      'Read the scale whose zero is aligned with the arm.',
    )],
    secondHint: b(
      'Числа двух шкал в одном месте дают в сумме 180.',
      "Ikki shkalaning bir joydagi sonlari yig'indisi 180 ni beradi.",
      'The numbers of the two scales at one place add up to 180.',
    ),
    thirdHint: b(
      '180 − 65 = 115.',
      '180 − 65 = 115.',
      '180 − 65 = 115.',
    ),
    correctText: b(
      'Верно. Угол равен 115 градусам, а 65 — чтение по чужой шкале.',
      "To'g'ri. Burchak 115 darajaga teng, 65 esa boshqa shkaladan o'qilgani.",
      'Correct. The angle is 115 degrees, and 65 comes from reading the wrong scale.',
    ),
    rule: b(
      'Числа двух шкал дополняют друг друга до 180 градусов.',
      "Ikki shkalaning sonlari bir-birini 180 darajagacha to'ldiradi.",
      'The numbers of the two scales complete each other to 180 degrees.',
    ),
  },

  {
    id: '10', level: 'red', kind: 'missing', skillTag: 'transfer_from_description',
    visual: { type: 'clock', hour: 6 },
    setup: b(
      'На циферблате ровно шесть часов: стрелки лежат на одной прямой.',
      'Siferblatda soat roppa-rosa oltida: millar bitta chiziqda yotadi.',
      'The clock shows exactly six o\'clock: the hands lie on one straight line.',
    ),
    prompt: b(
      'Какой угол получился между стрелками?',
      'Millar orasida qanday burchak hosil bo\'ldi?',
      'What angle do the hands make?',
    ),
    options: [
      option('straight', 'развёрнутый', 'yoyiq', 'straight', true),
      option('right', 'прямой', "to'g'ri", 'right', false,
        'Прямой угол стрелки дают в три часа, а не в шесть.',
        "To'g'ri burchakni millar soat uchda beradi, oltida emas.",
        'The hands make a right angle at three o\'clock, not at six.'),
      option('acute', 'острый', "o'tkir", 'acute', false,
        'Острый угол меньше 90 градусов, а стрелки здесь разошлись полностью.',
        "O'tkir burchak 90 darajadan kichik, bu yerda esa millar to'liq ajralgan.",
        'An acute angle is less than 90 degrees, but here the hands are fully apart.'),
      option('full', 'полный поворот', "to'liq burilish", 'full turn', false,
        'Полный поворот — 360 градусов, тогда стрелки совпали бы.',
        "To'liq burilish — 360 daraja, u holda millar ustma-ust tushardi.",
        'A full turn is 360 degrees; then the hands would coincide.'),
    ],
    secondHint: b(
      'Две стороны на одной прямой — это сколько градусов?',
      'Bitta chiziqda yotgan ikki tomon — bu necha daraja?',
      'Two arms on one straight line — how many degrees is that?',
    ),
    thirdHint: b(
      'Стороны на одной прямой дают 180 градусов.',
      'Bitta chiziqdagi tomonlar 180 daraja beradi.',
      'Arms on one straight line give 180 degrees.',
    ),
    correctText: b(
      'Верно. Стрелки на одной прямой дают развёрнутый угол — 180 градусов.',
      "To'g'ri. Bitta chiziqdagi millar yoyiq burchak — 180 daraja beradi.",
      'Correct. Hands on one straight line make a straight angle of 180 degrees.',
    ),
    rule: b(
      'Развёрнутый угол — это две стороны на одной прямой.',
      'Yoyiq burchak — bitta chiziqda yotgan ikki tomon.',
      'A straight angle is two arms on one straight line.',
    ),
  },
];

const adaptive = (task, pickedOption, itemWrong, attempts) => {
  if (attempts >= 3) return task.thirdHint;
  if (attempts >= 2) return task.secondHint;
  if (pickedOption?.wrong) return pickedOption.wrong;
  if (itemWrong) return itemWrong;
  return task.wrong?.[0] || task.secondHint;
};

// ---------------------------------------------------------------------------
// CHIZMALAR. Burchak har doim gradus bo'yicha yasaladi — chizma va son bitta
// manbadan chiqadi, ular ajralib qolmaydi.
// ---------------------------------------------------------------------------
const AngleSvg = ({ deg, arm = 46, size = 96 }) => {
  const cx = 16;
  const cy = size - 20;
  const rad = (deg * Math.PI) / 180;
  const x = cx + arm * Math.cos(rad);
  const y = cy - arm * Math.sin(rad);
  const arcR = 15;
  return (
    <svg className="p4-angle" viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-hidden="true">
      <path d={`M${cx} ${cy} H${cx + arm}`} stroke={T.navy} strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <path d={`M${cx} ${cy} L${x} ${y}`} stroke={T.navy} strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <path d={`M${cx + arcR} ${cy} A${arcR} ${arcR} 0 ${deg > 180 ? 1 : 0} 0 ${cx + arcR * Math.cos(rad)} ${cy - arcR * Math.sin(rad)}`}
        stroke={T.accent} strokeWidth="1.8" fill="none" />
      <circle cx={cx} cy={cy} r="3" fill={T.accent} />
    </svg>
  );
};

function Visual({ task, lang, solved }) {
  const visual = task.visual;
  if (!visual) return null;

  if (visual.type === 'angles') {
    return (
      <div className="p4-visual p4-visual-row">
        {visual.items.map((item, index) => (
          <span className="p4-angle-cell" key={index} style={{ animationDelay: `${index * 70}ms` }}>
            <AngleSvg deg={item.deg} arm={item.arm} />
            <small>{item.deg}°</small>
          </span>
        ))}
      </div>
    );
  }

  if (visual.type === 'right-angle-gauge') {
    return (
      <div className="p4-visual p4-visual-row">
        <AngleSvg deg={90} arm={44} />
        <span className="p4-bridge-side">{tx(UI.rightAngle, lang)} · 90°</span>
      </div>
    );
  }

  if (visual.type === 'record-plate') {
    return <div className="p4-visual"><strong>{tx(visual.text, lang)}</strong></div>;
  }

  if (visual.type === 'angle-pair') {
    return (
      <div className="p4-visual p4-visual-row">
        <span className="p4-angle-cell"><AngleSvg deg={visual.left} arm={44} /><small>{visual.left}°</small></span>
        <span className="p4-angle-cell"><AngleSvg deg={visual.right} arm={44} /><small>{visual.right}°</small></span>
      </div>
    );
  }

  if (visual.type === 'angle-complement') {
    return (
      <div className="p4-visual p4-visual-row">
        <span className="p4-angle-cell"><AngleSvg deg={visual.known} arm={52} /><small>{visual.known}°</small></span>
        <span className="p4-angle-cell"><AngleSvg deg={90} arm={44} /><small>90°</small></span>
        {solved && <b className="p4-reveal">{90 - visual.known}°</b>}
      </div>
    );
  }

  if (visual.type === 'angle-scale') {
    const count = (visual.to - visual.from) / visual.step;
    return (
      <div className="p4-visual">
        <svg className="p4-svg" viewBox="0 0 300 112" role="img" aria-label={tx(task.setup, lang)}>
          <path d="M20 96 A130 130 0 0 1 280 96" fill="none" stroke={T.cyan} strokeWidth="2.4" />
          {Array.from({ length: count + 1 }, (_, index) => {
            const share = index / count;
            const angle = Math.PI * (1 - share);
            const x1 = 150 + 130 * Math.cos(angle);
            const y1 = 96 - 130 * Math.sin(angle);
            const x2 = 150 + 116 * Math.cos(angle);
            const y2 = 96 - 116 * Math.sin(angle);
            const isPointer = visual.from + index * visual.step === visual.pointer;
            return (
              <g key={index}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={isPointer ? T.accent : T.navy} strokeWidth={isPointer ? 3 : 1.6} />
                {(index === 0 || index === count) && (
                  <text x={150 + 104 * Math.cos(angle)} y={100 - 104 * Math.sin(angle)} textAnchor="middle" className="p4-svg-cut">
                    {visual.from + index * visual.step}
                  </text>
                )}
              </g>
            );
          })}
          <path d={`M150 96 L${150 + 118 * Math.cos(Math.PI * (1 - (visual.pointer - visual.from) / (visual.to - visual.from)))} ${96 - 118 * Math.sin(Math.PI * (1 - (visual.pointer - visual.from) / (visual.to - visual.from)))}`}
            stroke={T.accent} strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="150" cy="96" r="4" fill={T.accent} />
        </svg>
      </div>
    );
  }

  if (visual.type === 'two-scale') {
    return (
      <div className="p4-visual">
        <svg className="p4-svg" viewBox="0 0 300 112" role="img" aria-label={tx(task.setup, lang)}>
          <path d="M30 96 A120 120 0 0 1 270 96" fill="none" stroke={T.cyan} strokeWidth="2.4" />
          <path d="M46 96 A104 104 0 0 1 254 96" fill="none" stroke={T.ink3} strokeWidth="1.6" />
          <path d="M150 96 L232 36" stroke={T.accent} strokeWidth="2.4" strokeLinecap="round" />
          <path d="M150 96 H262" stroke={T.navy} strokeWidth="2.4" strokeLinecap="round" />
          <text x="240" y="26" textAnchor="middle" className="p4-svg-top">{visual.outer}</text>
          <text x="212" y="58" textAnchor="middle" className="p4-svg-cut">{visual.inner}</text>
          <text x="266" y="110" textAnchor="end" className="p4-svg-cut">0</text>
          <circle cx="150" cy="96" r="4" fill={T.accent} />
        </svg>
      </div>
    );
  }

  if (visual.type === 'clock') {
    return (
      <div className="p4-visual">
        <svg className="p4-svg p4-svg-narrow" viewBox="0 0 120 120" role="img" aria-label={`${visual.hour}:00`}>
          <circle cx="60" cy="60" r="52" fill={T.paper} stroke={T.navy} strokeWidth="2.4" />
          {Array.from({ length: 12 }, (_, index) => {
            const angle = (Math.PI / 6) * index;
            return (
              <line key={index} x1={60 + 45 * Math.sin(angle)} y1={60 - 45 * Math.cos(angle)}
                x2={60 + 50 * Math.sin(angle)} y2={60 - 50 * Math.cos(angle)} stroke={T.ink3} strokeWidth="1.6" />
            );
          })}
          <line x1="60" y1="60" x2="60" y2="22" stroke={T.navy} strokeWidth="3.2" strokeLinecap="round" />
          <line x1="60" y1="60" x2="60" y2="102" stroke={T.accent} strokeWidth="3.2" strokeLinecap="round" />
          <circle cx="60" cy="60" r="4" fill={T.accent} />
        </svg>
      </div>
    );
  }

  return null;
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
  const [tick, setTick] = useState(null);
  const [pairs, setPairs] = useState({});
  const [activeLeft, setActiveLeft] = useState(null);
  const [placed, setPlaced] = useState({});
  const [activeCell, setActiveCell] = useState(null);
  const [assignments, setAssignments] = useState({});
  const [activeItem, setActiveItem] = useState(null);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps -- restart/task kaliti atayin yangi aralashtirish beradi
  const sortItems = useMemo(() => shuffle(task.items || []), [shuffleSeed, task.id, task.items]);

  useEffect(() => {
    if (checked) window.setTimeout(() => feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 120);
  }, [checked]);

  const answerReady = (() => {
    if (task.options) return pickedId !== null;
    if (task.kind === 'ticks') return tick !== null;
    if (task.kind === 'match') return task.pairs.every((pair) => pairs[pair.id]);
    if (task.kind === 'sort') return task.items.every((item) => assignments[item.id]);
    return task.steps.every((step) => placed[step.id]);
  })();

  const answerCorrect = () => {
    if (task.options) return task.options.find((item) => item.id === pickedId)?.correct === true;
    if (task.kind === 'ticks') return tick === task.answer;
    if (task.kind === 'match') return task.pairs.every((pair) => pairs[pair.id] === pair.correctRight);
    if (task.kind === 'sort') return task.items.every((item) => assignments[item.id] === item.bin);
    return task.cards.every((card) => placed[task.steps[card.order].id] === card.id);
  };

  const clearResponse = () => {
    checkingRef.current = false;
    setChecked(false);
    setPickedId(null);
    setTick(null);
    setPairs({});
    setActiveLeft(null);
    setPlaced({});
    setActiveCell(null);
    setAssignments({});
    setActiveItem(null);
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
  const firstWrongItem = task.kind === 'sort'
    ? task.items.find((item) => assignments[item.id] && assignments[item.id] !== item.bin)
    : null;
  const cardText = (cardId) => tx(task.cards?.find((card) => card.id === cardId)?.text, lang);

  const studentAnswer = (() => {
    if (task.options) return { optionId: pickedId, text: pickedOption?.text };
    if (task.kind === 'ticks') return { value: tick };
    if (task.kind === 'match') return { pairs };
    if (task.kind === 'sort') return { bins: assignments };
    return { order: task.steps.map((step) => placed[step.id]) };
  })();

  const correctAnswer = (() => {
    if (task.options) {
      const item = task.options.find((candidate) => candidate.correct);
      return { optionId: item.id, text: item.text };
    }
    if (task.kind === 'ticks') return { value: task.answer };
    if (task.kind === 'match') {
      return { pairs: Object.fromEntries(task.pairs.map((pair) => [pair.id, pair.correctRight])) };
    }
    if (task.kind === 'sort') {
      return { bins: Object.fromEntries(task.items.map((item) => [item.id, item.bin])) };
    }
    return { order: task.cards.slice().sort((a, c) => a.order - c.order).map((card) => card.id) };
  })();

  const optionClass = (item) => {
    if (pickedId !== item.id) return '';
    if (!checked) return 'is-on';
    return item.correct ? 'is-ok' : 'is-no';
  };

  const unassigned = sortItems.filter((item) => !assignments[item.id]);

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

      {task.kind === 'sort' && (
        <div className="p4-sort">
          <p className="p4-note">{tx(UI.sortHint, lang)}</p>
          <div className="p4-sort-pool" role="group" aria-label={tx(task.prompt, lang)}>
            {unassigned.map((item) => (
              <button type="button" key={item.id} disabled={solved} aria-pressed={activeItem === item.id}
                className={`p4-sort-token ${activeItem === item.id ? 'is-active' : ''}`}
                onClick={() => { checkingRef.current = false; setActiveItem(item.id); setChecked(false); }}>
                {tx(item.text, lang)}
              </button>
            ))}
            {unassigned.length === 0 && <span className="p4-pool-done" aria-hidden="true">✓</span>}
          </div>
          <div className="p4-sort-bins">
            {task.bins.map((bin) => (
              <div className="p4-sort-bin" key={bin.id}>
                <button type="button" className="p4-sort-bin-head" disabled={solved || activeItem === null}
                  onClick={() => {
                    if (activeItem === null) return;
                    checkingRef.current = false;
                    setAssignments((old) => ({ ...old, [activeItem]: bin.id }));
                    setActiveItem(null);
                    setChecked(false);
                  }}>
                  {tx(bin.label, lang)}
                </button>
                <div className="p4-sort-bin-items">
                  {sortItems.filter((item) => assignments[item.id] === bin.id).map((item) => (
                    <button type="button" key={item.id} disabled={solved}
                      className={`p4-sort-token is-placed ${checked && item.bin !== bin.id ? 'is-no' : ''} ${checked && item.bin === bin.id ? 'is-ok' : ''}`}
                      aria-label={`${tx(UI.returnCard, lang)} ${tx(item.text, lang)}`}
                      onClick={() => {
                        checkingRef.current = false;
                        setAssignments((old) => {
                          const next = { ...old };
                          delete next[item.id];
                          return next;
                        });
                        setChecked(false);
                      }}>
                      {tx(item.text, lang)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {checked && (
        <Feedback feedbackRef={feedbackRef} ok={solved} lang={lang} rule={task.rule}
          text={solved ? task.correctText : adaptive(task, pickedOption, firstWrongItem?.wrong, attempts)} />
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
                  : task.right ?? task.cards ?? task.items ?? null,
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

export default function Grade4Dars33Practice({ studentName, lang: langProp, onFinished }) {
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
.p4-svg { width: 100%; max-width: 320px; height: auto; }
.p4-svg-narrow { max-width: 150px; }
.p4-svg text { font: 700 12px 'JetBrains Mono', monospace; }
.p4-svg-top { fill: ${T.navy}; }
.p4-svg-cut { fill: ${T.ink2}; }
.p4-angle { width: clamp(58px, 15vw, 88px); height: auto; animation: p4-drop .5s cubic-bezier(.22, 1.2, .36, 1) both; }
.p4-angle-cell { display: grid; justify-items: center; gap: 2px; }
.p4-angle-cell small { color: ${T.ink2}; font: 800 12px 'JetBrains Mono', monospace; }
.p4-reveal { color: ${T.success}; font: 800 clamp(18px, 4vw, 26px) 'JetBrains Mono', monospace; animation: p4-rise .5s cubic-bezier(.22, 1.2, .36, 1) both; }
.p4-bridge-side { padding: 6px 10px; border-radius: 10px; background: ${T.cyanSoft}; color: ${T.cyan}; font: 800 12px 'Manrope', sans-serif; }

.p4-options { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 9px; }
.p4-option { display: flex; align-items: center; gap: 9px; min-width: 44px; min-height: 56px; padding: 10px 12px; text-align: left; border: 1px solid rgba(23, 59, 82, .12); border-radius: 14px; background: ${T.paper}; color: ${T.ink}; font: 700 clamp(13px, 1.9vw, 15px)/1.35 'Manrope', sans-serif; cursor: pointer; transition: transform .16s, border-color .2s, background .2s; }
.p4-option:hover:not(:disabled) { border-color: rgba(22, 143, 163, .4); transform: translateY(-2px); }
.p4-letter { flex: 0 0 26px; display: grid; place-items: center; width: 26px; height: 26px; border-radius: 8px; background: ${T.cyanSoft}; color: ${T.cyan}; font: 800 11px 'JetBrains Mono', monospace; }
.p4-option.is-on { border-color: ${T.accent}; background: ${T.accentSoft}; }
.p4-option.is-ok { border-color: rgba(34, 122, 83, .4); background: ${T.successSoft}; color: ${T.success}; }
.p4-option.is-ok .p4-letter { background: ${T.success}; color: #fff; }
.p4-option.is-no { border-color: rgba(169, 111, 19, .4); background: ${T.warnSoft}; color: ${T.warn}; }
.p4-option.is-no .p4-letter { background: ${T.warn}; color: #fff; }

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
.p4-card { min-width: 44px; min-height: 46px; padding: 7px 11px; border: 1px solid rgba(23, 59, 82, .12); border-radius: 12px; background: ${T.paper}; color: ${T.navy}; font: 800 13px 'JetBrains Mono', monospace; cursor: pointer; }

.p4-sort { display: grid; gap: 7px; }
.p4-sort-pool { display: flex; flex-wrap: wrap; justify-content: center; gap: 7px; min-height: 52px; padding: 7px; border: 1px dashed rgba(23, 59, 82, .2); border-radius: 12px; }
.p4-pool-done { display: grid; place-items: center; color: ${T.success}; font-size: 20px; font-weight: 800; }
.p4-sort-token { min-width: 52px; min-height: 44px; padding: 7px 11px; border: 1px solid rgba(23, 59, 82, .14); border-radius: 12px; background: ${T.paper}; color: ${T.navy}; font: 800 15px 'JetBrains Mono', monospace; cursor: pointer; }
.p4-sort-token.is-active { border-color: ${T.accent}; background: ${T.accentSoft}; }
.p4-sort-token.is-ok { border-color: ${T.success}; background: ${T.successSoft}; color: ${T.success}; }
.p4-sort-token.is-no { border-color: ${T.warn}; background: ${T.warnSoft}; color: ${T.warn}; }
.p4-sort-bins { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 7px; }
.p4-sort-bin { display: grid; gap: 5px; align-content: start; padding: 7px; border-radius: 12px; background: #FBFBF8; box-shadow: inset 0 0 0 1px rgba(23, 59, 82, .08); }
.p4-sort-bin-head { min-width: 44px; min-height: 44px; padding: 7px 9px; border: 0; border-radius: 10px; background: ${T.cyanSoft}; color: ${T.cyan}; font: 800 12px 'Manrope', sans-serif; cursor: pointer; }
.p4-sort-bin-head:disabled { opacity: .62; cursor: default; }
.p4-sort-bin-items { display: flex; flex-wrap: wrap; gap: 5px; min-height: 30px; }

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
  .p4-order-slots { grid-template-columns: repeat(2, minmax(0, 1fr)); }
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
