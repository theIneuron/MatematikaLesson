// ============================================================================
// 4-SINF · 47-DARS AMALIYOTI · TENGSIZLIKLARNI TANLASH USULIDA YECHISH
// 10 topshiriq · UZ/RU/EN · ovozsiz · solve-to-advance.
//
// Skelet: src/books/grade4/AMALIYOT_41_51_SKELET.md §10.
// Mexanika raskladkasi: scripts/grade4-practice-41-51-layout.mjs
//   match · numpad · order · ticks · numpad · mc · order · sort · mc · match
//
// Infratuzilma fayl ichida: LMS lokal importni ko'tarmaydi (CLAUDE.md §5 dan
// ongli chekinish, sabab 41-dars amaliyoti shapkasida).
//
// NAZARIYADAN FARQ. Nazariy dars 3 + x < 5, 6 - x > 4, 5 · x < 35, 36 : x > 4,
// x <= 548, a · 9 < 54, 200 - a > 198, 7 · y > 35 va 208 - x < 35 yozuvlarini
// ishlatgan; bu yerda boshqa sonlar.
//
// MODEL: son o'qi va sinov jadvali. Yechimlar to'plami faqat TO'G'RI javobdan
// keyin to'liq ko'rsatiladi; savol paytida bola qiymatlarni o'zi sinaydi.
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
const tx = (value, lang) => (value && typeof value === 'object' && !Array.isArray(value) ? value[normalizeLang(lang)] ?? '' : value);

const UI = {
  title: b('Урок 47. Практика: неравенства', '47-dars. Amaliyot: tengsizliklarni tanlash usuli', 'Lesson 47. Practice: inequalities'),
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
  orderHint: b('Выбери место, потом карточку.', 'Avval joyni, keyin kartani tanlang.', 'Choose a position, then a card.'),
  sortHint: b('Выбери карточку, потом группу.', 'Avval kartani, keyin guruhni tanlang.', 'Choose a card, then a group.'),
  tickHint: b('Нажми на деление числовой оси.', "Son o'qining bo'linmasiga bosing.", 'Tap a mark on the number line.'),
  returnCard: b('Вернуть карточку', 'Kartani qaytarish', 'Return the card'),
};

const LESSON_META = {
  lessonId: 'ineq-4-47-practice',
  lessonTitle: UI.title,
  grade: 4,
  lessonNumber: 47,
  activityType: 'practice',
  taskCount: 10,
  resultIsUiState: true,
  progression: { green: 2, yellow: 5, red: 3 },
};

const SCREEN_META = [
  { id: 'practice-01', taskId: '01', template: 'matching', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-02', taskId: '02', template: 'numeric-input', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-03', taskId: '03', template: 'ordering', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-04', taskId: '04', template: 'number-line', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-05', taskId: '05', template: 'numeric-input', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-06', taskId: '06', template: 'word-problem', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-07', taskId: '07', template: 'ordering', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-08', taskId: '08', template: 'boundary-sorting', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-09', taskId: '09', template: 'error-analysis', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-10', taskId: '10', template: 'strategy-transfer', type: 'practice', scored: true, scope: 'final' },
];

const TASKS = [
  {
    id: '01', level: 'green', kind: 'match', skillTag: 'sign_meaning',
    setup: b(
      'Условный шлюз читает четыре знака.',
      "Shart darvozasi to'rt belgini o'qiydi.",
      'The condition gate reads four signs.',
    ),
    prompt: b('Соедини знак с его чтением.', 'Belgini o\'qilishi bilan ulang.', 'Match each sign to how it is read.'),
    pairs: [
      { id: 'gt', left: b('>', '>', '>'), correctRight: 'greater' },
      { id: 'lt', left: b('<', '<', '<'), correctRight: 'less' },
      { id: 'ge', left: b('≥', '≥', '≥'), correctRight: 'greater-equal' },
      { id: 'le', left: b('≤', '≤', '≤'), correctRight: 'less-equal' },
    ],
    right: [
      { id: 'greater', text: b('Больше', 'Katta', 'Greater than') },
      { id: 'less', text: b('Меньше', 'Kichik', 'Less than') },
      { id: 'greater-equal', text: b('Больше или равно', 'Katta yoki teng', 'Greater than or equal to') },
      { id: 'less-equal', text: b('Меньше или равно', 'Kichik yoki teng', 'Less than or equal to') },
    ],
    wrong: [b(
      'Смотри на дополнительную черту: она добавляет слово «или равно».',
      "Qo'shimcha chiziqqa qarang: u «yoki teng» so'zini qo'shadi.",
      'Look at the extra line: it adds the words or equal to.',
    )],
    secondHint: b(
      'Острый угол знака всегда смотрит на меньшее число.',
      "Belgining o'tkir uchi har doim kichik songa qaraydi.",
      'The sharp end of the sign always points at the smaller number.',
    ),
    thirdHint: b(
      'Черта под знаком означает, что граница входит в решение.',
      "Belgi ostidagi chiziq chegara yechimga kirishini bildiradi.",
      'The line under the sign means the boundary is included in the solution.',
    ),
    correctText: b(
      'Верно. Строгий знак не берёт границу, нестрогий берёт.',
      "To'g'ri. Qat'iy belgi chegarani olmaydi, qat'iy bo'lmagani oladi.",
      'Correct. A strict sign excludes the boundary and a non-strict one includes it.',
    ),
    rule: b(
      'Черта под знаком добавляет саму границу к решению.',
      'Belgi ostidagi chiziq chegarani yechimga qo\'shadi.',
      'The line under the sign adds the boundary itself to the solution.',
    ),
  },

  {
    id: '02', level: 'green', kind: 'numpad', skillTag: 'largest_solution', answer: '8', maxLen: 2,
    visual: { type: 'record', text: 'x < 9' },
    setup: b(
      'Проверяем натуральные числа по очереди: 1, 2, 3 и дальше.',
      "Natural sonlarni navbat bilan tekshiramiz: 1, 2, 3 va keyingilari.",
      'We check the natural numbers one by one: 1, 2, 3 and so on.',
    ),
    prompt: b(
      'Какое самое большое натуральное число подходит?',
      'Eng katta qaysi natural son to\'g\'ri keladi?',
      'Which is the largest natural number that fits?',
    ),
    wrong: [b(
      'Знак строгий, поэтому само число 9 в решение не входит.',
      "Belgi qat'iy, shuning uchun 9 ning o'zi yechimga kirmaydi.",
      'The sign is strict, so 9 itself is not part of the solution.',
    )],
    secondHint: b(
      'Подставь 9: получится 9 < 9, и это ложно.',
      "9 ni qo'ying: 9 < 9 chiqadi, bu esa yolg'on.",
      'Substitute 9: you get 9 < 9, and that is false.',
    ),
    thirdHint: b(
      'Значит подходит число на единицу меньше девяти.',
      "Demak to'qqizdan bir kam son to'g'ri keladi.",
      'So the number that fits is one less than nine.',
    ),
    correctText: b(
      'Верно. Решения — это 1, 2, 3, 4, 5, 6, 7 и 8.',
      "To'g'ri. Yechimlar — 1, 2, 3, 4, 5, 6, 7 va 8.",
      'Correct. The solutions are 1, 2, 3, 4, 5, 6, 7 and 8.',
    ),
    rule: b(
      'При строгом знаке граница в решение не входит.',
      "Qat'iy belgida chegara yechimga kirmaydi.",
      'With a strict sign the boundary is not part of the solution.',
    ),
  },

  {
    id: '03', level: 'yellow', kind: 'order', skillTag: 'trial_order',
    setup: b(
      'Метод подбора работает по шагам, и порядок здесь важен.',
      'Tanlash usuli qadamlab ishlaydi va bu yerda tartib muhim.',
      'The trial method works step by step, and the order matters.',
    ),
    prompt: b('Расставь шаги подбора по порядку.', 'Tanlash qadamlarini tartib bilan joylashtiring.', 'Put the steps of the trial method in order.'),
    steps: [
      { id: 's1', label: b('Шаг 1', '1-qadam', 'Step 1') },
      { id: 's2', label: b('Шаг 2', '2-qadam', 'Step 2') },
      { id: 's3', label: b('Шаг 3', '3-qadam', 'Step 3') },
      { id: 's4', label: b('Шаг 4', '4-qadam', 'Step 4') },
    ],
    cards: [
      { id: 'area', text: b('Определить область проверки', 'Sinov sohasini belgilash', 'Set the range to check'), order: 0 },
      { id: 'try', text: b('Подставлять числа по очереди', "Sonlarni navbat bilan qo'yish", 'Substitute the numbers one by one'), order: 1 },
      { id: 'keep', text: b('Отобрать те, где запись верна', "Yozuv rost bo'lganlarini ajratish", 'Keep the ones where the record is true'), order: 2 },
      { id: 'write', text: b('Записать все решения', 'Barcha yechimni yozish', 'Write down all the solutions'), order: 3 },
    ],
    wrong: [b(
      'Нельзя записать все решения, не проверив каждое число области.',
      "Sohaning har sonini tekshirmasdan barcha yechimni yozib bo'lmaydi.",
      'You cannot write all the solutions without checking every number in the range.',
    )],
    secondHint: b(
      'Область проверки задают до первой подстановки.',
      "Sinov sohasi birinchi qo'yishdan oldin belgilanadi.",
      'The range is set before the first substitution.',
    ),
    thirdHint: b(
      'На первом верном числе останавливаться нельзя: решений может быть много.',
      "Birinchi rost sonda to'xtash mumkin emas: yechim ko'p bo'lishi mumkin.",
      'You must not stop at the first true number: there may be many solutions.',
    ),
    correctText: b(
      'Верно. Область, подстановка, отбор, запись.',
      "To'g'ri. Soha, qo'yish, ajratish, yozish.",
      'Correct. Range, substitution, selection, writing.',
    ),
    rule: b(
      'Подбор заканчивают, когда проверена вся область.',
      'Tanlash butun soha tekshirilganda tugaydi.',
      'The trial method ends when the whole range has been checked.',
    ),
  },

  {
    id: '04', level: 'yellow', kind: 'ticks', skillTag: 'boundary_on_line', answer: '201',
    visual: { type: 'scale', min: 198, max: 204, intervals: 6, showAll: true },
    setup: b(
      'Шлюз пропускает значения, для которых x ≤ 201.',
      "Darvoza x ≤ 201 shartiga mos qiymatlarni o'tkazadi.",
      'The gate lets through the values for which x ≤ 201.',
    ),
    prompt: b(
      'Нажми самое большое подходящее значение.',
      "Eng katta mos qiymatga bosing.",
      'Tap the largest value that fits.',
    ),
    wrong: [b(
      'Знак нестрогий, поэтому граница входит в решение.',
      "Belgi qat'iy emas, shuning uchun chegara yechimga kiradi.",
      'The sign is not strict, so the boundary is part of the solution.',
    )],
    secondHint: b(
      'Проверь само число 201: запись 201 ≤ 201 верна.',
      "201 sonining o'zini tekshiring: 201 ≤ 201 yozuvi rost.",
      'Check 201 itself: the record 201 ≤ 201 is true.',
    ),
    thirdHint: b(
      'Числа правее границы уже не подходят.',
      "Chegaradan o'ngdagi sonlar endi mos kelmaydi.",
      'The numbers to the right of the boundary no longer fit.',
    ),
    correctText: b(
      'Верно. Нестрогий знак берёт границу, поэтому 201 подходит.',
      "To'g'ri. Qat'iy bo'lmagan belgi chegarani oladi, shuning uchun 201 mos.",
      'Correct. A non-strict sign includes the boundary, so 201 fits.',
    ),
    rule: b(
      'Нестрогий знак включает границу в решение.',
      "Qat'iy bo'lmagan belgi chegarani yechimga kiritadi.",
      'A non-strict sign includes the boundary in the solution.',
    ),
  },

  {
    id: '05', level: 'yellow', kind: 'numpad', skillTag: 'product_inequality', answer: '7', maxLen: 2,
    visual: { type: 'record', text: '6 · x < 48' },
    setup: b(
      'Теперь перед буквой стоит множитель.',
      "Endi harf oldida ko'paytuvchi turadi.",
      'Now there is a factor in front of the letter.',
    ),
    prompt: b(
      'Какое самое большое натуральное число подходит?',
      'Eng katta qaysi natural son to\'g\'ri keladi?',
      'Which is the largest natural number that fits?',
    ),
    wrong: [b(
      'Сначала считают произведение, и только потом сравнивают.',
      "Avval ko'paytma hisoblanadi, keyin solishtiriladi.",
      'First calculate the product, and only then compare.',
    )],
    secondHint: b(
      'Подставь 8: получится 48, а знак строгий.',
      "8 ni qo'ying: 48 chiqadi, belgi esa qat'iy.",
      'Substitute 8: you get 48, and the sign is strict.',
    ),
    thirdHint: b(
      '6 × 7 = 42, и 42 меньше 48.',
      "6 × 7 = 42, va 42 48 dan kichik.",
      '6 × 7 = 42, and 42 is less than 48.',
    ),
    correctText: b(
      'Верно. 6 × 7 = 42 меньше 48, а 6 × 8 = 48 уже не меньше.',
      "To'g'ri. 6 × 7 = 42 48 dan kichik, 6 × 8 = 48 esa kichik emas.",
      'Correct. 6 × 7 = 42 is less than 48, while 6 × 8 = 48 is not.',
    ),
    rule: b(
      'Подставленное число сначала участвует в действии, потом в сравнении.',
      "Qo'yilgan son avval amalda, keyin taqqoslashda qatnashadi.",
      'The substituted number takes part in the action first and in the comparison second.',
    ),
  },

  {
    id: '06', level: 'yellow', kind: 'mc', skillTag: 'condition_word_problem',
    // Sahna yo'q: javob variantlarining o'zi matematik yozuv, ularni ikkinchi
    // marta chizmada takrorlash savolni ochib berardi.
    noVisualReason: b(
      'Варианты ответа и есть записи условия.',
      "Javob variantlarining o'zi shart yozuvi.",
      'The answer options are the records of the condition themselves.',
    ),
    setup: b(
      'Правило склада: груз не должен быть больше 250 килограммов.',
      "Ombor qoidasi: yuk 250 kilogrammdan ko'p bo'lmasligi kerak.",
      'The warehouse rule: a load must not be more than 250 kilograms.',
    ),
    prompt: b('Какая запись задаёт это условие?', 'Bu shartni qaysi yozuv beradi?', 'Which record gives this condition?'),
    options: [
      option('le', 'x ≤ 250', 'x ≤ 250', 'x ≤ 250', true),
      option('lt', 'x < 250', 'x < 250', 'x < 250', false,
        'Так груз ровно 250 килограммов оказался бы запрещён, а правило его разрешает.',
        "Bunda aynan 250 kilogramm yuk taqiqlangan bo'lardi, qoida esa unga ruxsat beradi.",
        'That would forbid a load of exactly 250 kilograms, but the rule allows it.'),
      option('ge', 'x ≥ 250', 'x ≥ 250', 'x ≥ 250', false,
        'Этот знак разрешает только тяжёлые грузы, а нужно наоборот.',
        "Bu belgi faqat og'ir yuklarga ruxsat beradi, kerak bo'lgani esa aksincha.",
        'This sign allows only heavy loads, but the opposite is needed.'),
      option('gt', 'x > 250', 'x > 250', 'x > 250', false,
        'Знак «больше» задаёт как раз то, что запрещено.',
        "«Katta» belgisi aynan taqiqlangan narsani beradi.",
        'The greater-than sign describes exactly what is forbidden.'),
    ],
    secondHint: b(
      'Слова «не больше» разрешают и само число.',
      "«Ko'p bo'lmasligi» so'zlari sonning o'ziga ham ruxsat beradi.",
      'The words not more than allow the number itself as well.',
    ),
    thirdHint: b(
      'Значит нужен нестрогий знак «меньше или равно».',
      "Demak «kichik yoki teng» qat'iy bo'lmagan belgisi kerak.",
      'So the non-strict less-than-or-equal sign is needed.',
    ),
    correctText: b(
      'Верно. «Не больше 250» — это x ≤ 250.',
      "To'g'ri. «250 dan ko'p emas» — bu x ≤ 250.",
      'Correct. Not more than 250 means x ≤ 250.',
    ),
    rule: b(
      'Слова условия задают, входит граница в решение или нет.',
      'Shartdagi so\'zlar chegara yechimga kirishini belgilaydi.',
      'The words of the condition decide whether the boundary belongs to the solution.',
    ),
  },

  {
    id: '07', level: 'yellow', kind: 'order', skillTag: 'solution_count',
    // Tartib son kattaligi bo'yicha emas, YECHIMLAR SONI bo'yicha: 3 · x ≤ 6
    // ikki yechim beradi, 2 · x < 14 esa oltita.
    orderBy: b(
      'Порядок задан числом натуральных решений, а не числами в записи.',
      "Tartib yozuvdagi sonlar bilan emas, natural yechimlar soni bilan belgilangan.",
      'The order is set by the number of natural solutions, not by the numbers in the record.',
    ),
    setup: b(
      'У каждой записи своё число натуральных решений.',
      "Har yozuvning o'z natural yechimlari soni bor.",
      'Each record has its own number of natural solutions.',
    ),
    prompt: b(
      'Расставь записи от наименьшего числа решений к наибольшему.',
      'Yozuvlarni yechimlari soni kamdan ko\'pga qarab joylashtiring.',
      'Put the records in order from the fewest solutions to the most.',
    ),
    steps: [
      { id: 's1', label: b('Меньше всего', 'Eng kam', 'Fewest') },
      { id: 's2', label: b('Затем', 'Keyin', 'Next') },
      { id: 's3', label: b('Затем', 'Keyin', 'Next') },
      { id: 's4', label: b('Больше всего', "Eng ko'p", 'Most') },
    ],
    cards: [
      { id: 'three-x', text: b('3 · x ≤ 6', '3 · x ≤ 6', '3 · x ≤ 6'), order: 0 },
      { id: 'x-three', text: b('x ≤ 3', 'x ≤ 3', 'x ≤ 3'), order: 1 },
      { id: 'x-five', text: b('x < 5', 'x < 5', 'x < 5'), order: 2 },
      { id: 'two-x', text: b('2 · x < 14', '2 · x < 14', '2 · x < 14'), order: 3 },
    ],
    wrong: [b(
      'Считай решения, а не смотри на числа в записи: множитель уменьшает их количество.',
      "Yozuvdagi sonlarga qaramang, yechimlarni sanang: ko'paytuvchi ularning sonini kamaytiradi.",
      'Count the solutions instead of looking at the numbers: a factor reduces how many there are.',
    )],
    secondHint: b(
      'В записи 3 · x ≤ 6 подходят только 1 и 2.',
      "3 · x ≤ 6 yozuviga faqat 1 va 2 mos keladi.",
      'In 3 · x ≤ 6 only 1 and 2 fit.',
    ),
    thirdHint: b(
      'Решений соответственно два, три, четыре и шесть.',
      "Yechimlar soni mos ravishda ikki, uch, to'rt va olti.",
      'The numbers of solutions are two, three, four and six.',
    ),
    correctText: b(
      'Верно. Число решений не видно по записи сразу — его считают.',
      "To'g'ri. Yechimlar soni yozuvdan darrov ko'rinmaydi — u sanaladi.",
      'Correct. The number of solutions is not visible at a glance: it has to be counted.',
    ),
    rule: b(
      'Множитель перед буквой уменьшает число решений.',
      "Harf oldidagi ko'paytuvchi yechimlar sonini kamaytiradi.",
      'A factor in front of the letter reduces the number of solutions.',
    ),
  },

  {
    id: '08', level: 'red', kind: 'sort', skillTag: 'strict_vs_nonstrict',
    setup: b(
      'Шлюз открыт для значений, где x ≥ 200.',
      "Darvoza x ≥ 200 bo'lgan qiymatlar uchun ochiq.",
      'The gate is open for the values where x ≥ 200.',
    ),
    prompt: b(
      'Разложи значения на решения и не решения.',
      'Qiymatlarni yechim va yechim emasga ajratib joylashtiring.',
      'Sort the values into solutions and non-solutions.',
    ),
    bins: [
      { id: 'yes', label: b('Решение', 'Yechim', 'A solution') },
      { id: 'no', label: b('Не решение', 'Yechim emas', 'Not a solution') },
    ],
    items: [
      { id: 'v198', bin: 'no', text: b('198', '198', '198') },
      { id: 'v199', bin: 'no', text: b('199', '199', '199') },
      { id: 'v200', bin: 'yes', text: b('200', '200', '200') },
      { id: 'v201', bin: 'yes', text: b('201', '201', '201') },
      { id: 'v205', bin: 'yes', text: b('205', '205', '205') },
      { id: 'v300', bin: 'yes', text: b('300', '300', '300') },
    ],
    wrong: [b(
      'Граница здесь входит в решение: знак нестрогий.',
      "Bu yerda chegara yechimga kiradi: belgi qat'iy emas.",
      'The boundary belongs to the solution here: the sign is not strict.',
    )],
    secondHint: b(
      'Подставь 200: запись 200 ≥ 200 верна.',
      "200 ni qo'ying: 200 ≥ 200 yozuvi rost.",
      'Substitute 200: the record 200 ≥ 200 is true.',
    ),
    thirdHint: b(
      'Не подходят только числа меньше двухсот.',
      "Faqat ikki yuzdan kichik sonlar mos kelmaydi.",
      'Only the numbers smaller than two hundred do not fit.',
    ),
    correctText: b(
      'Верно. 200 входит в решение, а 198 и 199 нет.',
      "To'g'ri. 200 yechimga kiradi, 198 va 199 esa kirmaydi.",
      'Correct. 200 belongs to the solution, but 198 and 199 do not.',
    ),
    rule: b(
      'Граница попадает в решение только при нестрогом знаке.',
      "Chegara faqat qat'iy bo'lmagan belgida yechimga tushadi.",
      'The boundary falls into the solution only with a non-strict sign.',
    ),
  },

  {
    id: '09', level: 'red', kind: 'mc', skillTag: 'boundary_error',
    visual: { type: 'record', text: 'x < 7 → 1, 2, 3, 4, 5, 6, 7', error: true },
    setup: b(
      'Bit записал решения неравенства x < 7 так: 1, 2, 3, 4, 5, 6, 7.',
      "Bit x < 7 tengsizligining yechimlarini shunday yozdi: 1, 2, 3, 4, 5, 6, 7.",
      'Bit wrote the solutions of x < 7 like this: 1, 2, 3, 4, 5, 6, 7.',
    ),
    prompt: b('В чём ошибка?', 'Xato nimada?', 'What is the error?'),
    options: [
      option('boundary', 'Семь взято, хотя знак строгий', "Belgi qat'iy bo'lsa ham, yetti olingan", 'Seven is included although the sign is strict', true),
      option('one', 'Единица не должна входить', 'Bir kirmasligi kerak', 'One should not be included', false,
        'Подстановка 1 < 7 верна, поэтому единица входит.',
        "1 < 7 qo'yish rost, shuning uchun bir kiradi.",
        'The substitution 1 < 7 is true, so one is included.'),
      option('order', 'Решения записаны в неверном порядке', "Yechimlar noto'g'ri tartibda yozilgan", 'The solutions are written in the wrong order', false,
        'Порядок здесь не важен: важно, какие числа вошли.',
        "Bu yerda tartib muhim emas: qaysi sonlar kirgani muhim.",
        'The order does not matter here: what matters is which numbers are included.'),
      option('none', 'Ошибки нет', "Xato yo'q", 'There is no error', false,
        'Подставь 7: получится 7 < 7, и это ложно.',
        "7 ni qo'ying: 7 < 7 chiqadi, bu esa yolg'on.",
        'Substitute 7: you get 7 < 7, and that is false.'),
    ],
    secondHint: b(
      'Проверь каждое записанное число подстановкой.',
      "Har yozilgan sonni qo'yib tekshiring.",
      'Check every number that was written by substituting it.',
    ),
    thirdHint: b(
      'Все числа кроме последнего проходят проверку.',
      "Oxirgisidan boshqa hamma son tekshiruvdan o'tadi.",
      'Every number except the last one passes the check.',
    ),
    correctText: b(
      'Верно. При строгом знаке граница остаётся за решением.',
      "To'g'ri. Qat'iy belgida chegara yechim tashqarisida qoladi.",
      'Correct. With a strict sign the boundary stays outside the solution.',
    ),
    rule: b(
      'Каждое число решения проверяют подстановкой.',
      "Yechimning har soni qo'yib tekshiriladi.",
      'Every number of the solution is checked by substitution.',
    ),
  },

  {
    id: '10', level: 'red', kind: 'match', skillTag: 'solution_set',
    setup: b(
      'Четыре условия шлюза и четыре набора значений.',
      "Darvozaning to'rt sharti va to'rt qiymatlar to'plami.",
      'Four gate conditions and four sets of values.',
    ),
    prompt: b('Соедини запись с набором её решений.', 'Yozuvni yechimlari to\'plami bilan ulang.', 'Match each record to its set of solutions.'),
    pairs: [
      { id: 'lt-four', left: b('x < 4', 'x < 4', 'x < 4'), correctRight: 'set-3' },
      { id: 'le-four', left: b('x ≤ 4', 'x ≤ 4', 'x ≤ 4'), correctRight: 'set-4' },
      { id: 'le-two', left: b('x ≤ 2', 'x ≤ 2', 'x ≤ 2'), correctRight: 'set-2' },
      { id: 'five-x', left: b('5 · x ≤ 25', '5 · x ≤ 25', '5 · x ≤ 25'), correctRight: 'set-5' },
    ],
    right: [
      { id: 'set-2', text: b('1, 2', '1, 2', '1, 2') },
      { id: 'set-3', text: b('1, 2, 3', '1, 2, 3', '1, 2, 3') },
      { id: 'set-4', text: b('1, 2, 3, 4', '1, 2, 3, 4', '1, 2, 3, 4') },
      { id: 'set-5', text: b('1, 2, 3, 4, 5', '1, 2, 3, 4, 5', '1, 2, 3, 4, 5') },
    ],
    wrong: [b(
      'Проверяй два признака: границу и множитель перед буквой.',
      "Ikki belgiga qarang: chegara va harf oldidagi ko'paytuvchi.",
      'Check two features: the boundary and the factor in front of the letter.',
    )],
    secondHint: b(
      'Две записи различаются только чертой под знаком.',
      "Ikki yozuv faqat belgi ostidagi chiziq bilan farq qiladi.",
      'Two records differ only by the line under the sign.',
    ),
    thirdHint: b(
      'В записи 5 · x ≤ 25 подходят числа до пяти включительно.',
      "5 · x ≤ 25 yozuviga beshgacha bo'lgan sonlar, beshning o'zi ham mos keladi.",
      'In 5 · x ≤ 25 the numbers up to and including five fit.',
    ),
    correctText: b(
      'Верно. Набор решений задаётся знаком и множителем вместе.',
      "To'g'ri. Yechimlar to'plami belgi va ko'paytuvchi birgalikda beriladi.",
      'Correct. The set of solutions is set by the sign and the factor together.',
    ),
    rule: b(
      'Решение неравенства — это все подходящие числа, а не одно.',
      "Tengsizlikning yechimi — barcha mos sonlar, bittasi emas.",
      'The solution of an inequality is all the numbers that fit, not just one.',
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

const adaptive = (task, pickedOption, attempts) => (
  attempts >= 3 ? task.thirdHint
    : attempts >= 2 ? task.secondHint
      : pickedOption?.wrong || task.wrong?.[0] || task.secondHint
);

// ---------------------------------------------------------------------------
// MODELLAR
// ---------------------------------------------------------------------------

function ScaleModel({ visual, interactive = false, picked, onPick, disabled = false, hint = false }) {
  const { min, max, intervals, showAll = false } = visual;
  const step = (max - min) / intervals;
  const values = Array.from({ length: intervals + 1 }, (_, index) => min + step * index);
  return (
    <div className={`p4-scale ${hint ? 'is-hint' : ''}`}>
      <div className="p4-scale-axis">
        {values.map((value, index) => {
          const edge = index === 0 || index === intervals;
          return (
            <div className="p4-scale-tick" style={{ left: `${(index / intervals) * 100}%` }} key={value}>
              {interactive
                ? (
                  <button
                    type="button"
                    disabled={disabled}
                    className={picked === String(value) ? 'is-picked' : ''}
                    aria-label={String(value)}
                    aria-pressed={picked === String(value)}
                    onClick={() => onPick(String(value))}
                  >{showAll || edge ? value : '·'}</button>
                )
                : <span>{showAll || edge ? value : ''}</span>}
            </div>
          );
        })}
      </div>
    </div>
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
  const [pickedId, setPickedId] = useState(null);
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
    if (task.kind === 'mc') return pickedId !== null;
    if (task.kind === 'ticks') return picked !== null;
    if (task.kind === 'numpad') return typed.length > 0;
    if (task.kind === 'match') return task.pairs.every((pair) => pairs[pair.id]);
    if (task.kind === 'order') return task.steps.every((step) => placed[step.id]);
    return task.items.every((item) => assignments[item.id]);
  })();

  const answerCorrect = () => {
    if (task.kind === 'mc') return task.options.find((item) => item.id === pickedId)?.correct === true;
    if (task.kind === 'ticks') return picked === task.answer;
    if (task.kind === 'numpad') return typed === task.answer;
    if (task.kind === 'match') return task.pairs.every((pair) => pairs[pair.id] === pair.correctRight);
    if (task.kind === 'order') return task.cards.every((card) => placed[task.steps[card.order].id] === card.id);
    return task.items.every((item) => assignments[item.id] === item.bin);
  };

  const pickedOption = task.kind === 'mc' ? task.options.find((item) => item.id === pickedId) : null;
  const hintLevel = checked && !solved ? attempts : 0;

  const clearResponse = () => {
    checkingRef.current = false;
    setChecked(false); setPickedId(null); setPicked(null); setTyped('');
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
    if (task.kind === 'mc') return { optionId: pickedId, text: pickedOption?.text };
    if (task.kind === 'ticks') return { value: picked };
    if (task.kind === 'numpad') return { value: typed };
    if (task.kind === 'match') return { pairs };
    if (task.kind === 'order') return { order: task.steps.map((step) => placed[step.id]) };
    return { bins: assignments };
  })();

  const correctAnswer = (() => {
    if (task.kind === 'mc') {
      const item = task.options.find((candidate) => candidate.correct);
      return { optionId: item.id, text: item.text };
    }
    if (task.kind === 'ticks' || task.kind === 'numpad') return { value: task.answer };
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

      {task.visual?.type === 'record' && <div className="p4-visual"><RecordCard visual={task.visual} /></div>}

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

      {task.kind === 'mc' && (
        <div className="p4-options">
          {options.map((item, index) => (
            <button
              type="button"
              key={item.id}
              disabled={solved}
              aria-pressed={pickedId === item.id}
              className={`p4-option ${pickedId === item.id ? (checked ? (item.correct ? 'is-ok' : 'is-no') : 'is-on') : ''}`}
              onClick={() => setAnswer(setPickedId, item.id)}
            >
              <span className="p4-letter">{'ABCD'[index]}</span>
              <span>{tx(item.text, lang)}</span>
            </button>
          ))}
        </div>
      )}

      {task.kind === 'numpad' && (
        <NumPad value={typed} onChange={(value) => setAnswer(setTyped, value)} max={task.maxLen || 3} disabled={solved} lang={lang} />
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
                  className={`p4-match-item is-record ${activeLeft === pair.id ? 'is-active' : ''} ${pairs[pair.id] ? 'is-tied' : ''}`}
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
                    className={`p4-match-item ${used ? 'is-used' : ''}`}
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
                className={`p4-sort-token ${activeToken === item.id ? 'is-active' : ''}`}
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
          text={solved ? task.correctText : adaptive(task, pickedOption, attempts)}
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

export default function Grade4Dars47Practice({ studentName, lang: langProp, onFinished }) {
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
.p4-scale{width:min(100%,480px);padding:14px 26px 58px}
.p4-scale.is-hint .p4-scale-axis{box-shadow:0 0 0 5px rgba(255,91,53,.16)}
.p4-scale-axis{position:relative;width:100%;height:5px;border-radius:99px;background:${T.navy}}
.p4-scale-tick{position:absolute;top:50%;transform:translate(-50%,-50%);width:3px;height:20px;border-radius:2px;background:${T.cyan}}
.p4-scale-tick span,.p4-scale-tick button{position:absolute;top:18px;left:50%;transform:translateX(-50%);min-width:44px;min-height:44px;padding:2px;border:0;background:transparent;color:${T.navy};font:800 12px 'JetBrains Mono',monospace;white-space:nowrap}
.p4-scale-tick button{border-radius:10px;cursor:pointer}
.p4-scale-tick button:hover:not(:disabled),.p4-scale-tick button.is-picked{background:${T.accentSoft};color:${T.accent}}
.p4-record{text-align:center;font:800 clamp(18px,4vw,27px) 'JetBrains Mono',monospace;color:${T.navy}}
.p4-record.is-error{color:${T.warn};text-decoration:line-through}
.p4-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
.p4-option{display:flex;align-items:center;gap:9px;min-width:44px;min-height:56px;padding:10px 12px;text-align:left;border:1px solid rgba(23,59,82,.12);border-radius:14px;background:${T.paper};color:${T.ink};font:700 clamp(13px,1.9vw,15px)/1.35 'JetBrains Mono',monospace;cursor:pointer;transition:transform .16s,border-color .2s,background .2s}
.p4-option:hover:not(:disabled){border-color:rgba(22,143,163,.4);transform:translateY(-2px)}
.p4-letter{flex:0 0 26px;width:26px;height:26px;border-radius:8px;display:grid;place-items:center;background:${T.cyanSoft};color:${T.cyan};font:800 11px 'JetBrains Mono',monospace}
.p4-option.is-on{border-color:${T.accent};background:${T.accentSoft}}
.p4-option.is-ok{border-color:rgba(34,122,83,.4);background:${T.successSoft};color:${T.success}}
.p4-option.is-ok .p4-letter{background:${T.success};color:#fff}
.p4-option.is-no{border-color:rgba(169,111,19,.4);background:${T.warnSoft};color:${T.warn}}
.p4-option.is-no .p4-letter{background:${T.warn};color:#fff}
.p4-pad{display:flex;flex-direction:column;align-items:center;gap:8px;width:min(240px,100%);margin:0 auto;padding:12px;border-radius:18px;background:linear-gradient(155deg,#EDF1F3,#DDE4E8);box-shadow:inset 0 1px rgba(255,255,255,.9)}
.p4-pad-display{display:flex;align-items:center;justify-content:center;width:100%;min-height:50px;border:2px solid ${T.accent};border-radius:13px;background:${T.paper};color:${T.navy};font:800 clamp(20px,4.4vw,26px) 'JetBrains Mono',monospace;letter-spacing:2px}
.p4-pad-keys{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;width:100%}
.p4-pad-keys button{min-width:44px;min-height:44px;border:1px solid rgba(23,59,82,.16);border-radius:12px;background:${T.paper};color:${T.navy};font:800 clamp(18px,3.6vw,22px) 'JetBrains Mono',monospace;cursor:pointer}
.p4-pad-keys button:hover:not(:disabled){border-color:${T.cyan}}
.p4-pad-keys .is-delete{background:${T.accentSoft};color:${T.accent}}
.p4-match-cols{display:grid;grid-template-columns:1fr 1.3fr;gap:10px;margin-top:7px}
.p4-match-col{display:grid;gap:8px;align-content:start}
.p4-match-item{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-width:44px;min-height:52px;padding:8px 9px;border:1px solid rgba(23,59,82,.12);border-radius:12px;background:${T.paper};color:${T.navy};font:700 clamp(11.5px,1.9vw,13.5px)/1.3 'Manrope',sans-serif;text-align:center;cursor:pointer}
.p4-match-item.is-record{font-family:'JetBrains Mono',monospace;font-weight:800;font-size:clamp(14px,2.6vw,18px)}
.p4-match-item.is-active{border-color:${T.accent};background:${T.accentSoft}}
.p4-match-item.is-tied{border-color:rgba(34,122,83,.35)}
.p4-match-item.is-used{background:${T.successSoft};opacity:.65}
.p4-match-item:disabled{cursor:default}
.p4-match-item b{color:${T.success};font-size:11px;font-family:'Manrope',sans-serif}
.p4-order-slots{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin-top:7px}
.p4-order-slot{display:grid;place-items:center;gap:4px;min-width:44px;min-height:74px;padding:7px;border:1px solid rgba(23,59,82,.12);border-radius:13px;background:${T.paper};color:${T.ink2};font-family:inherit;cursor:pointer}
.p4-order-slot.is-active{border-color:${T.accent};background:${T.accentSoft}}
.p4-order-slot small{font-weight:800;font-size:10px;text-align:center}
.p4-order-slot b{font:800 13px/1.25 'JetBrains Mono',monospace;color:${T.navy};text-align:center}
.p4-card-bank{display:flex;flex-wrap:wrap;justify-content:center;gap:7px;margin-top:8px}
.p4-card{min-width:44px;min-height:46px;padding:8px 11px;border:1px solid rgba(23,59,82,.12);border-radius:12px;background:${T.paper};color:${T.navy};font:800 13px/1.3 'JetBrains Mono',monospace;cursor:pointer}
.p4-card.is-used{background:${T.cyanSoft};opacity:.7}
.p4-sort{display:flex;flex-direction:column;gap:10px}
.p4-sort-pool{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:8px;min-height:60px;padding:8px;border-radius:14px;background:${T.paper};box-shadow:inset 0 0 0 1px rgba(23,59,82,.08)}
.p4-pool-done{color:${T.success};font-size:26px}
.p4-sort-token{min-width:56px;min-height:44px;padding:6px 12px;border:1px solid rgba(23,59,82,.14);border-radius:12px;background:${T.paper};color:${T.navy};font:800 15px/1.25 'JetBrains Mono',monospace;cursor:pointer}
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
  .p4-options{grid-template-columns:1fr}
  .p4-match-cols{grid-template-columns:1fr 1.2fr;gap:7px}
  .p4-order-slots{grid-template-columns:repeat(2,minmax(0,1fr))}
  .p4-order-slot{min-height:62px;padding:6px}
  .p4-sort-bins{grid-template-columns:1fr;gap:6px}
  .p4-sort-bin{display:flex;align-items:center;gap:8px;min-height:56px;padding:6px}
  .p4-sort-bin-head{flex:0 0 34%;min-height:44px;padding:6px 4px;font-size:11px}
  .p4-sort-bin-items{flex:1;justify-content:flex-start;padding-top:0}
  .p4-sort-pool{min-height:56px;gap:6px}
  .p4-scale{padding:12px 22px 54px}
  .p4-scale-tick span,.p4-scale-tick button{min-width:40px;font-size:11px}
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
  .p4-option{min-height:46px!important;padding:6px 8px!important;font-size:12px!important}
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
