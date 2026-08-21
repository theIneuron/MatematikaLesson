// ============================================================================
// 4-SINF · 48-DARS AMALIYOTI · QO'SHISHNING XOSSALARI
// 10 topshiriq · UZ/RU/EN · ovozsiz · solve-to-advance.
//
// Skelet: src/books/grade4/AMALIYOT_41_51_SKELET.md §11.
// Mexanika raskladkasi: scripts/grade4-practice-41-51-layout.mjs
//   mc · slots · numpad · missing · slots · match · sort · mc · match · missing
//
// Infratuzilma fayl ichida: LMS lokal importni ko'tarmaydi (CLAUDE.md §5 dan
// ongli chekinish, sabab 41-dars amaliyoti shapkasida).
//
// NAZARIYADAN FARQ. Nazariy dars 1 457 + 23 543, 500 + 800 + 500,
// 14 800 + 5 000 + 200, 20 400 + 600 + 50 800, 73 000 + 22 300 + 700 va
// 69 900 + 30 000 + 100 yozuvlarini ishlatgan; bu yerda boshqa sonlar.
//
// MODEL: yozuv kartasi. Qulay juft YASHIRILMAYDI, lekin ko'rsatilmaydi ham:
// bola juftni o'zi topadi, model esa faqat yozuvni beradi.
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
  title: b('Урок 48. Практика: свойства сложения', '48-dars. Amaliyot: qo\'shishning xossalari', 'Lesson 48. Practice: properties of addition'),
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
  sortHint: b('Выбери карточку, потом группу.', 'Avval kartani, keyin guruhni tanlang.', 'Choose a card, then a group.'),
  slotHint: b('Выбери место, потом карточку.', 'Avval joyni, keyin kartani tanlang.', 'Choose a place, then a card.'),
  returnCard: b('Вернуть карточку', 'Kartani qaytarish', 'Return the card'),
};

const LESSON_META = {
  lessonId: 'addprop-4-48-practice',
  lessonTitle: UI.title,
  grade: 4,
  lessonNumber: 48,
  activityType: 'practice',
  taskCount: 10,
  resultIsUiState: true,
  progression: { green: 2, yellow: 5, red: 3 },
};

const SCREEN_META = [
  { id: 'practice-01', taskId: '01', template: 'multiple-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-02', taskId: '02', template: 'pair-build', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-03', taskId: '03', template: 'numeric-input', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-04', taskId: '04', template: 'numeric-blank', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-05', taskId: '05', template: 'pair-build', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-06', taskId: '06', template: 'matching', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-07', taskId: '07', template: 'sorting', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-08', taskId: '08', template: 'boundary-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-09', taskId: '09', template: 'error-analysis', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-10', taskId: '10', template: 'strategy-transfer', type: 'practice', scored: true, scope: 'final' },
];

const TASKS = [
  {
    id: '01', level: 'green', kind: 'mc', skillTag: 'commutative_property',
    noVisualReason: b(
      'Варианты ответа и есть сравниваемые записи.',
      "Javob variantlarining o'zi solishtirilayotgan yozuvlar.",
      'The answer options are the records being compared.',
    ),
    setup: b(
      'Площадка сбора проверяет, какое свойство записано.',
      "Yig'uv maydoni qaysi xossa yozilganini tekshiradi.",
      'The assembly yard checks which property has been written.',
    ),
    prompt: b(
      'В какой записи показано переместительное свойство сложения?',
      "Qaysi yozuvda qo'shishning o'rin almashtirish xossasi ko'rsatilgan?",
      'Which record shows the commutative property of addition?',
    ),
    options: [
      option('swap', '26 + 74 = 74 + 26', '26 + 74 = 74 + 26', '26 + 74 = 74 + 26', true),
      option('group', '(26 + 74) + 30 = 26 + (74 + 30)', '(26 + 74) + 30 = 26 + (74 + 30)', '(26 + 74) + 30 = 26 + (74 + 30)', false,
        'Здесь меняется группировка, а не порядок слагаемых.',
        "Bu yerda qo'shiluvchilarning tartibi emas, guruhlanishi o'zgargan.",
        'Here the grouping changes, not the order of the addends.'),
      option('result', '26 + 74 = 100', '26 + 74 = 100', '26 + 74 = 100', false,
        'Это просто верное равенство: свойство в нём не видно.',
        "Bu shunchaki to'g'ri tenglik: unda xossa ko'rinmaydi.",
        'This is simply a true equality: no property is shown in it.'),
      option('multiply', '26 × 74 = 74 × 26', '26 × 74 = 74 × 26', '26 × 74 = 74 × 26', false,
        'Свойство верное, но это умножение, а проверяем сложение.',
        "Xossa to'g'ri, lekin bu ko'paytirish, biz esa qo'shishni tekshiramiz.",
        'The property is true, but this is multiplication and we are checking addition.'),
    ],
    secondHint: b(
      'В переместительном свойстве слагаемые те же, только стоят в другом порядке.',
      "O'rin almashtirish xossasida qo'shiluvchilar o'sha, faqat tartibi boshqa.",
      'In the commutative property the addends are the same, only their order differs.',
    ),
    thirdHint: b(
      'Скобок в этой записи быть не должно.',
      'Bu yozuvda qavs bo\'lmasligi kerak.',
      'There should be no brackets in this record.',
    ),
    correctText: b(
      'Верно. Слагаемые поменялись местами, а сумма осталась той же.',
      "To'g'ri. Qo'shiluvchilar o'rin almashdi, yig'indi esa o'zgarmadi.",
      'Correct. The addends swapped places and the sum stayed the same.',
    ),
    rule: b(
      'От перестановки слагаемых сумма не меняется.',
      "Qo'shiluvchilarning o'rni almashtirilsa ham yig'indi o'zgarmaydi.",
      'Swapping the addends does not change the sum.',
    ),
  },

  {
    id: '02', level: 'green', kind: 'slots', skillTag: 'convenient_pair',
    visual: { type: 'record', text: '18 600 + 6 000 + 400' },
    setup: b(
      'Считать удобнее, если сначала сложить пару, дающую круглое число.',
      "Avval yumaloq son beradigan juftni qo'shsak, hisoblash qulay bo'ladi.",
      'It is easier to calculate if you first add the pair that gives a round number.',
    ),
    prompt: b('Собери удобный порядок счёта.', 'Qulay hisob tartibini tuzing.', 'Build the convenient order of calculation.'),
    slots: [
      {
        id: 'pair', label: b('Складываем первыми', "Birinchi qo'shamiz", 'Add first'), correct: 'round-pair',
        wrong: b(
          'Ищи пару, у которой сумма оканчивается нулями.',
          "Yig'indisi nol bilan tugaydigan juftni izlang.",
          'Look for the pair whose sum ends in zeros.',
        ),
      },
      {
        id: 'rest', label: b('Прибавляем потом', "Keyin qo'shamiz", 'Add afterwards'), correct: 'six-thousand',
        wrong: b(
          'Оставшееся слагаемое прибавляют к круглому числу.',
          "Qolgan qo'shiluvchi yumaloq songa qo'shiladi.",
          'The remaining addend is added to the round number.',
        ),
      },
    ],
    cards: [
      { id: 'round-pair', text: b('18 600 + 400', '18 600 + 400', '18,600 + 400') },
      { id: 'six-thousand', text: b('6 000', '6 000', '6,000') },
      { id: 'other-pair', text: b('18 600 + 6 000', '18 600 + 6 000', '18,600 + 6,000') },
      { id: 'small-pair', text: b('6 000 + 400', '6 000 + 400', '6,000 + 400') },
      { id: 'four-hundred', text: b('400', '400', '400') },
      { id: 'total', text: b('25 000', '25 000', '25,000') },
    ],
    wrong: [b(
      'Проверь, какая пара даёт число с нулями на конце.',
      "Qaysi juft oxiri nol bo'lgan son berishini tekshiring.",
      'Check which pair gives a number ending in zeros.',
    )],
    secondHint: b(
      '600 и 400 вместе дают тысячу.',
      '600 va 400 birga ming beradi.',
      '600 and 400 together give a thousand.',
    ),
    thirdHint: b(
      '18 600 + 400 = 19 000, и к нему прибавляют 6 000.',
      "18 600 + 400 = 19 000, unga 6 000 qo'shiladi.",
      '18,600 + 400 = 19,000, and 6,000 is added to it.',
    ),
    correctText: b(
      'Верно. 19 000 + 6 000 = 25 000.',
      "To'g'ri. 19 000 + 6 000 = 25 000.",
      'Correct. 19,000 + 6,000 = 25,000.',
    ),
    rule: b(
      'Группировка помогает получить круглое число раньше.',
      'Guruhlash yumaloq sonni oldinroq olishga yordam beradi.',
      'Grouping helps to reach a round number sooner.',
    ),
  },

  {
    id: '03', level: 'yellow', kind: 'numpad', skillTag: 'grouped_sum', answer: '35000', maxLen: 5,
    visual: { type: 'record', text: '26 700 + 3 300 + 5 000' },
    setup: b(
      'Здесь тоже есть пара, дающая круглое число.',
      "Bu yerda ham yumaloq son beradigan juft bor.",
      'Here too there is a pair that gives a round number.',
    ),
    prompt: b('Чему равна сумма?', 'Yig\'indi nechaga teng?', 'What is the sum?'),
    wrong: [b(
      'Сначала найди пару с круглой суммой, потом прибавь третье слагаемое.',
      "Avval yumaloq yig'indi beradigan juftni toping, keyin uchinchi qo'shiluvchini qo'shing.",
      'First find the pair with a round sum, then add the third addend.',
    )],
    secondHint: b(
      '26 700 и 3 300 вместе дают 30 000.',
      '26 700 va 3 300 birga 30 000 beradi.',
      '26,700 and 3,300 together give 30,000.',
    ),
    thirdHint: b('30 000 + 5 000 = 35 000.', '30 000 + 5 000 = 35 000.', '30,000 + 5,000 = 35,000.'),
    correctText: b(
      'Верно. 30 000 + 5 000 = 35 000.',
      "To'g'ri. 30 000 + 5 000 = 35 000.",
      'Correct. 30,000 + 5,000 = 35,000.',
    ),
    rule: b(
      'Свойства сложения позволяют выбрать удобный порядок.',
      "Qo'shish xossalari qulay tartibni tanlashga imkon beradi.",
      'The properties of addition let you choose a convenient order.',
    ),
  },

  {
    id: '04', level: 'yellow', kind: 'missing', skillTag: 'missing_addend_property', answer: '400', maxLen: 3,
    visual: { type: 'record', text: '600 + 900 + 400 = (600 + □) + 900' },
    setup: b(
      'Слева и справа должно получиться одно и то же число.',
      "Chapda va o'ngda bir xil son chiqishi kerak.",
      'The left and the right sides must give the same number.',
    ),
    prompt: b('Какое число пропущено в скобках?', 'Qavs ichida qaysi son tushib qolgan?', 'Which number is missing in the brackets?'),
    wrong: [b(
      'В скобки ставят то слагаемое, которое даёт с 600 круглое число.',
      "Qavs ichiga 600 bilan yumaloq son beradigan qo'shiluvchi qo'yiladi.",
      'The bracket takes the addend that gives a round number with 600.',
    )],
    secondHint: b(
      'Слагаемые остались те же: 600, 900 и 400.',
      "Qo'shiluvchilar o'sha: 600, 900 va 400.",
      'The addends are the same: 600, 900 and 400.',
    ),
    thirdHint: b(
      '600 + 400 = 1 000, поэтому в скобках стоит 400.',
      "600 + 400 = 1 000, shuning uchun qavs ichida 400 turadi.",
      '600 + 400 = 1,000, so 400 stands in the brackets.',
    ),
    correctText: b(
      'Верно. (600 + 400) + 900 = 1 900.',
      "To'g'ri. (600 + 400) + 900 = 1 900.",
      'Correct. (600 + 400) + 900 = 1,900.',
    ),
    rule: b(
      'Группировка меняет порядок счёта, но не сами слагаемые.',
      "Guruhlash hisob tartibini o'zgartiradi, qo'shiluvchilarni esa o'zgartirmaydi.",
      'Grouping changes the order of the calculation, not the addends themselves.',
    ),
  },

  {
    id: '05', level: 'yellow', kind: 'slots', skillTag: 'restore_grouping',
    visual: { type: 'record', text: '57 900 + 40 000 + 100' },
    setup: b(
      'Круглое число здесь даёт не самая большая пара.',
      "Bu yerda yumaloq sonni eng katta juft bermaydi.",
      'Here it is not the largest pair that gives a round number.',
    ),
    prompt: b('Восстанови удобную группировку.', 'Qulay guruhlashni tiklang.', 'Restore the convenient grouping.'),
    slots: [
      {
        id: 'pair', label: b('Складываем первыми', "Birinchi qo'shamiz", 'Add first'), correct: 'round-pair',
        wrong: b(
          'Круглое число даёт пара с сотнями, а не с десятками тысяч.',
          "Yumaloq sonni o'n minglik emas, yuzlik qatnashgan juft beradi.",
          'The round number comes from the pair with hundreds, not with tens of thousands.',
        ),
      },
      {
        id: 'rest', label: b('Прибавляем потом', "Keyin qo'shamiz", 'Add afterwards'), correct: 'forty-thousand',
        wrong: b(
          'После круглого числа прибавляют оставшееся слагаемое.',
          "Yumaloq sondan keyin qolgan qo'shiluvchi qo'shiladi.",
          'After the round number the remaining addend is added.',
        ),
      },
    ],
    cards: [
      { id: 'round-pair', text: b('57 900 + 100', '57 900 + 100', '57,900 + 100') },
      { id: 'forty-thousand', text: b('40 000', '40 000', '40,000') },
      { id: 'big-pair', text: b('57 900 + 40 000', '57 900 + 40 000', '57,900 + 40,000') },
      { id: 'small-pair', text: b('40 000 + 100', '40 000 + 100', '40,000 + 100') },
      { id: 'hundred', text: b('100', '100', '100') },
      { id: 'total', text: b('98 000', '98 000', '98,000') },
    ],
    wrong: [b(
      'Смотри на последние цифры слагаемых.',
      "Qo'shiluvchilarning oxirgi raqamlariga qarang.",
      'Look at the last digits of the addends.',
    )],
    secondHint: b(
      '900 и 100 вместе дают тысячу.',
      '900 va 100 birga ming beradi.',
      '900 and 100 together give a thousand.',
    ),
    thirdHint: b(
      '57 900 + 100 = 58 000, затем прибавляют 40 000.',
      "57 900 + 100 = 58 000, keyin 40 000 qo'shiladi.",
      '57,900 + 100 = 58,000, and then 40,000 is added.',
    ),
    correctText: b(
      'Верно. 58 000 + 40 000 = 98 000.',
      "To'g'ri. 58 000 + 40 000 = 98 000.",
      'Correct. 58,000 + 40,000 = 98,000.',
    ),
    rule: b(
      'Удобную пару ищут по последним цифрам, а не по размеру чисел.',
      "Qulay juft sonlarning kattaligiga qarab emas, oxirgi raqamlariga qarab izlanadi.",
      'A convenient pair is found by the last digits, not by the size of the numbers.',
    ),
  },

  {
    id: '06', level: 'yellow', kind: 'match', skillTag: 'pair_matching',
    setup: b(
      'В каждой сумме спрятана своя удобная пара.',
      "Har yig'indida o'z qulay jufti yashiringan.",
      'Each sum hides its own convenient pair.',
    ),
    prompt: b('Соедини сумму с её удобной парой.', 'Yig\'indini o\'z qulay jufti bilan ulang.', 'Match each sum to its convenient pair.'),
    pairs: [
      { id: 'first', left: b('4 800 + 2 500 + 200', '4 800 + 2 500 + 200', '4,800 + 2,500 + 200'), correctRight: 'pair-a' },
      { id: 'second', left: b('7 300 + 1 900 + 100', '7 300 + 1 900 + 100', '7,300 + 1,900 + 100'), correctRight: 'pair-b' },
      { id: 'third', left: b('2 600 + 5 000 + 400', '2 600 + 5 000 + 400', '2,600 + 5,000 + 400'), correctRight: 'pair-c' },
      { id: 'fourth', left: b('8 700 + 3 000 + 300', '8 700 + 3 000 + 300', '8,700 + 3,000 + 300'), correctRight: 'pair-d' },
    ],
    right: [
      { id: 'pair-a', text: b('4 800 + 200', '4 800 + 200', '4,800 + 200') },
      { id: 'pair-b', text: b('1 900 + 100', '1 900 + 100', '1,900 + 100') },
      { id: 'pair-c', text: b('2 600 + 400', '2 600 + 400', '2,600 + 400') },
      { id: 'pair-d', text: b('8 700 + 300', '8 700 + 300', '8,700 + 300') },
    ],
    wrong: [b(
      'Удобная пара — та, где сотни дополняют друг друга до тысячи.',
      "Qulay juft — yuzliklari bir-birini mingga to'ldiradigan juft.",
      'A convenient pair is the one whose hundreds complete each other to a thousand.',
    )],
    secondHint: b(
      'Складывай последние три цифры каждого слагаемого.',
      "Har qo'shiluvchining oxirgi uch raqamini qo'shib ko'ring.",
      'Add the last three digits of each addend.',
    ),
    thirdHint: b(
      'В одной сумме пара получается из второго и третьего слагаемых.',
      "Bir yig'indida juft ikkinchi va uchinchi qo'shiluvchidan hosil bo'ladi.",
      'In one sum the pair comes from the second and the third addends.',
    ),
    correctText: b(
      'Верно. Пара может стоять в любом месте записи.',
      'To\'g\'ri. Juft yozuvning har qanday joyida bo\'lishi mumkin.',
      'Correct. The pair may stand anywhere in the record.',
    ),
    rule: b(
      'Слагаемые можно переставлять, чтобы найти удобную пару.',
      "Qulay juftni topish uchun qo'shiluvchilarni o'rin almashtirish mumkin.",
      'Addends may be rearranged in order to find a convenient pair.',
    ),
  },

  {
    id: '07', level: 'yellow', kind: 'sort', skillTag: 'property_classification',
    setup: b(
      'Шесть записей, и в каждой работает одно из двух свойств.',
      "Olti yozuv, har birida ikki xossadan bittasi ishlaydi.",
      'Six records, and each one uses one of the two properties.',
    ),
    prompt: b('Разложи записи по свойствам.', 'Yozuvlarni xossalar bo\'yicha guruhlarga joylashtiring.', 'Sort the records by property.'),
    bins: [
      { id: 'swap', label: b('Переместительное', "O'rin almashtirish", 'Commutative') },
      { id: 'group', label: b('Группировка', 'Guruhlash', 'Associative') },
    ],
    items: [
      { id: 'swap-1', bin: 'swap', text: b('35 + 68 = 68 + 35', '35 + 68 = 68 + 35', '35 + 68 = 68 + 35') },
      { id: 'swap-2', bin: 'swap', text: b('120 + 45 = 45 + 120', '120 + 45 = 45 + 120', '120 + 45 = 45 + 120') },
      { id: 'swap-3', bin: 'swap', text: b('a + b = b + a', 'a + b = b + a', 'a + b = b + a') },
      { id: 'group-1', bin: 'group', text: b('(35 + 68) + 32 = 35 + (68 + 32)', '(35 + 68) + 32 = 35 + (68 + 32)', '(35 + 68) + 32 = 35 + (68 + 32)') },
      { id: 'group-2', bin: 'group', text: b('(12 + 8) + 5 = 12 + (8 + 5)', '(12 + 8) + 5 = 12 + (8 + 5)', '(12 + 8) + 5 = 12 + (8 + 5)') },
      { id: 'group-3', bin: 'group', text: b('a + (b + c) = (a + b) + c', 'a + (b + c) = (a + b) + c', 'a + (b + c) = (a + b) + c') },
    ],
    wrong: [b(
      'Если в записи есть скобки, работает группировка.',
      'Yozuvda qavs bo\'lsa, guruhlash ishlaydi.',
      'If a record has brackets, it uses the associative property.',
    )],
    secondHint: b(
      'В переместительном свойстве два слагаемых просто меняются местами.',
      "O'rin almashtirish xossasida ikki qo'shiluvchi shunchaki o'rin almashadi.",
      'In the commutative property two addends simply swap places.',
    ),
    thirdHint: b(
      'Буквенные записи проверяют так же, как числовые.',
      'Harfli yozuvlar sonli yozuvlar kabi tekshiriladi.',
      'Records with letters are checked in the same way as records with numbers.',
    ),
    correctText: b(
      'Верно. Скобки — признак группировки, порядок — признак перестановки.',
      "To'g'ri. Qavs — guruhlash belgisi, tartib — o'rin almashtirish belgisi.",
      'Correct. Brackets mark grouping, and order marks swapping.',
    ),
    rule: b(
      'Два свойства работают вместе, но записываются по-разному.',
      'Ikki xossa birga ishlaydi, lekin turlicha yoziladi.',
      'The two properties work together but are written differently.',
    ),
  },

  {
    id: '08', level: 'red', kind: 'mc', skillTag: 'subtraction_boundary',
    visual: { type: 'record', text: '900 − (400 − 100)   va   (900 − 400) − 100' },
    setup: b(
      'Проверяем, работает ли группировка при вычитании.',
      'Ayirishda guruhlash ishlashini tekshiramiz.',
      'We are checking whether grouping works for subtraction.',
    ),
    prompt: b('Что получается в двух записях?', 'Ikki yozuvda nima chiqadi?', 'What do the two records give?'),
    options: [
      option('different', 'Получается 600 и 400: результаты разные', "600 va 400 chiqadi: natijalar boshqa", 'You get 600 and 400: the results differ', true),
      option('same-400', 'Обе записи дают 400', 'Ikki yozuv ham 400 beradi', 'Both records give 400', false,
        'Первая запись сначала считает скобку 400 − 100 = 300, и получается 600.',
        "Birinchi yozuv avval 400 − 100 = 300 qavsni hisoblaydi va 600 chiqadi.",
        'The first record calculates the bracket 400 − 100 = 300 first, so it gives 600.'),
      option('same-600', 'Обе записи дают 600', 'Ikki yozuv ham 600 beradi', 'Both records give 600', false,
        'Во второй записи скобки нет: 900 − 400 = 500, затем 500 − 100 = 400.',
        "Ikkinchi yozuvda qavs yo'q: 900 − 400 = 500, keyin 500 − 100 = 400.",
        'The second record has no bracket: 900 − 400 = 500, then 500 − 100 = 400.'),
      option('no-brackets', 'В вычитании скобки не ставят', 'Ayirishda qavs qo\'yilmaydi', 'Brackets are not used in subtraction', false,
        'Скобки ставить можно, но они меняют результат.',
        "Qavs qo'yish mumkin, lekin u natijani o'zgartiradi.",
        'Brackets may be used, but they change the result.'),
    ],
    secondHint: b(
      'Посчитай каждую запись отдельно, начиная со скобок.',
      'Har yozuvni qavsdan boshlab alohida hisoblang.',
      'Calculate each record separately, starting with the brackets.',
    ),
    thirdHint: b(
      '900 − 300 = 600, а 500 − 100 = 400.',
      '900 − 300 = 600, 500 − 100 = 400.',
      '900 − 300 = 600, while 500 − 100 = 400.',
    ),
    correctText: b(
      'Верно. При вычитании группировка меняет результат, поэтому она не работает.',
      "To'g'ri. Ayirishda guruhlash natijani o'zgartiradi, shuning uchun u ishlamaydi.",
      'Correct. In subtraction grouping changes the result, so it does not work.',
    ),
    rule: b(
      'Свойства сложения на вычитание не переносятся.',
      "Qo'shish xossalari ayirishga ko'chmaydi.",
      'The properties of addition do not carry over to subtraction.',
    ),
  },

  {
    id: '09', level: 'red', kind: 'match', skillTag: 'property_error',
    setup: b(
      'Четыре записи с площадки сбора оказались неверными.',
      "Yig'uv maydonidan kelgan to'rt yozuv noto'g'ri chiqdi.",
      'Four records from the assembly yard turned out to be wrong.',
    ),
    prompt: b('Соедини запись с названием ошибки.', 'Yozuvni xato nomiga ulang.', 'Match each record to the name of the error.'),
    pairs: [
      { id: 'sign', left: b('(48 + 25) + 15 = 48 + (25 − 15)', '(48 + 25) + 15 = 48 + (25 − 15)', '(48 + 25) + 15 = 48 + (25 − 15)'), correctRight: 'sign-changed' },
      { id: 'addend', left: b('36 + 84 = 84 + 63', '36 + 84 = 84 + 63', '36 + 84 = 84 + 63'), correctRight: 'addend-changed' },
      { id: 'operation', left: b('70 + 30 + 50 = (70 + 30) × 50', '70 + 30 + 50 = (70 + 30) × 50', '70 + 30 + 50 = (70 + 30) × 50'), correctRight: 'operation-changed' },
      { id: 'subtract', left: b('95 − 40 − 15 = 95 − (40 − 15)', '95 − 40 − 15 = 95 − (40 − 15)', '95 − 40 − 15 = 95 − (40 − 15)'), correctRight: 'subtraction-grouped' },
    ],
    right: [
      { id: 'sign-changed', text: b('Изменён знак действия', "Amal belgisi o'zgartirilgan", 'The operation sign was changed') },
      { id: 'addend-changed', text: b('Изменено само слагаемое', "Qo'shiluvchining o'zi o'zgargan", 'An addend itself was changed') },
      { id: 'operation-changed', text: b('Сложение заменено умножением', "Qo'shish ko'paytirishga almashtirilgan", 'Addition was replaced by multiplication') },
      { id: 'subtraction-grouped', text: b('Группировка применена к вычитанию', 'Guruhlash ayirishga qo\'llangan', 'Grouping was applied to subtraction') },
    ],
    wrong: [b(
      'Сравни левую и правую части: что именно изменилось.',
      "Chap va o'ng tomonni solishtiring: aynan nima o'zgargan.",
      'Compare the left and the right sides: what exactly has changed.',
    )],
    secondHint: b(
      'В одной записи числа те же, но действие другое.',
      'Bir yozuvda sonlar o\'sha, lekin amal boshqa.',
      'In one record the numbers are the same but the operation differs.',
    ),
    thirdHint: b(
      'Свойства сложения не разрешают менять ни знак, ни сами слагаемые.',
      "Qo'shish xossalari na belgini, na qo'shiluvchilarni o'zgartirishga ruxsat bermaydi.",
      'The properties of addition allow changing neither the sign nor the addends.',
    ),
    correctText: b(
      'Верно. Свойства меняют только порядок и группировку.',
      "To'g'ri. Xossalar faqat tartib va guruhlashni o'zgartiradi.",
      'Correct. The properties change only the order and the grouping.',
    ),
    rule: b(
      'Свойство сохраняет и слагаемые, и действие.',
      "Xossa qo'shiluvchilarni ham, amalni ham saqlaydi.",
      'A property keeps both the addends and the operation.',
    ),
  },

  {
    id: '10', level: 'red', kind: 'missing', skillTag: 'four_addend_transfer', answer: '5000', maxLen: 4,
    visual: { type: 'record', text: '2 700 + 1 400 + 300 + 600 = □' },
    setup: b(
      'Теперь слагаемых четыре, и удобных пар тоже две.',
      "Endi qo'shiluvchilar to'rtta va qulay juft ham ikkita.",
      'Now there are four addends and two convenient pairs as well.',
    ),
    prompt: b('Чему равна сумма?', 'Yig\'indi nechaga teng?', 'What is the sum?'),
    wrong: [b(
      'Найди сразу две пары: каждая даёт круглое число.',
      "Darrov ikki juftni toping: har biri yumaloq son beradi.",
      'Find two pairs at once: each of them gives a round number.',
    )],
    secondHint: b(
      '2 700 и 300 дают 3 000, а 1 400 и 600 дают 2 000.',
      '2 700 va 300 3 000 beradi, 1 400 va 600 esa 2 000 beradi.',
      '2,700 and 300 give 3,000, while 1,400 and 600 give 2,000.',
    ),
    thirdHint: b('3 000 + 2 000 = 5 000.', '3 000 + 2 000 = 5 000.', '3,000 + 2,000 = 5,000.'),
    correctText: b(
      'Верно. Две пары дали 3 000 и 2 000, вместе 5 000.',
      "To'g'ri. Ikki juft 3 000 va 2 000 berdi, birga 5 000.",
      'Correct. The two pairs gave 3,000 and 2,000, which is 5,000 together.',
    ),
    rule: b(
      'В длинной сумме удобных пар может быть несколько.',
      "Uzun yig'indida qulay juft bir nechta bo'lishi mumkin.",
      'A long sum may contain several convenient pairs.',
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
  const [typed, setTyped] = useState('');
  const [pairs, setPairs] = useState({});
  const [activeLeft, setActiveLeft] = useState(null);
  const [filled, setFilled] = useState({});
  const [activeSlot, setActiveSlot] = useState(null);
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
  const bankCards = useMemo(() => shuffle(task.cards || []), [shuffleSeed, task.id, task.cards]);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- restart/task keys intentionally trigger a fresh shuffle
  const sortTokens = useMemo(() => shuffle(task.items || []), [shuffleSeed, task.id, task.items]);

  useEffect(() => {
    if (checked) window.setTimeout(() => feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 120);
  }, [checked]);

  const answerReady = (() => {
    if (task.kind === 'mc') return pickedId !== null;
    if (task.kind === 'numpad' || task.kind === 'missing') return typed.length > 0;
    if (task.kind === 'match') return task.pairs.every((pair) => pairs[pair.id]);
    if (task.kind === 'slots') return task.slots.every((slot) => filled[slot.id]);
    return task.items.every((item) => assignments[item.id]);
  })();

  const answerCorrect = () => {
    if (task.kind === 'mc') return task.options.find((item) => item.id === pickedId)?.correct === true;
    if (task.kind === 'numpad' || task.kind === 'missing') return typed === task.answer;
    if (task.kind === 'match') return task.pairs.every((pair) => pairs[pair.id] === pair.correctRight);
    if (task.kind === 'slots') return task.slots.every((slot) => filled[slot.id] === slot.correct);
    return task.items.every((item) => assignments[item.id] === item.bin);
  };

  const customWrong = (() => {
    if (task.kind !== 'slots') return null;
    const broken = task.slots.find((slot) => filled[slot.id] && filled[slot.id] !== slot.correct);
    return broken?.wrong;
  })();

  const pickedOption = task.kind === 'mc' ? task.options.find((item) => item.id === pickedId) : null;
  const hintLevel = checked && !solved ? attempts : 0;

  const clearResponse = () => {
    checkingRef.current = false;
    setChecked(false); setPickedId(null); setTyped('');
    setPairs({}); setActiveLeft(null);
    setFilled({}); setActiveSlot(null); setAssignments({}); setActiveToken(null);
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
    if (task.kind === 'numpad' || task.kind === 'missing') return { value: typed };
    if (task.kind === 'match') return { pairs };
    if (task.kind === 'slots') return { slots: filled };
    return { bins: assignments };
  })();

  const correctAnswer = (() => {
    if (task.kind === 'mc') {
      const item = task.options.find((candidate) => candidate.correct);
      return { optionId: item.id, text: item.text };
    }
    if (task.kind === 'numpad' || task.kind === 'missing') return { value: task.answer };
    if (task.kind === 'match') return { pairs: Object.fromEntries(task.pairs.map((pair) => [pair.id, pair.correctRight])) };
    if (task.kind === 'slots') return { slots: Object.fromEntries(task.slots.map((slot) => [slot.id, slot.correct])) };
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

      {(task.kind === 'numpad' || task.kind === 'missing') && (
        <NumPad value={typed} onChange={(value) => setAnswer(setTyped, value)} max={task.maxLen || 5} disabled={solved} lang={lang} />
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

      {task.kind === 'slots' && (
        <div className="p4-slots">
          <p className="p4-note">{tx(UI.slotHint, lang)}</p>
          <div className="p4-slot-list">
            {task.slots.map((slot) => (
              <button
                type="button"
                key={slot.id}
                className={`p4-slot ${activeSlot === slot.id ? 'is-active' : ''} ${checked && filled[slot.id] && filled[slot.id] !== slot.correct ? 'is-no' : ''}`}
                disabled={solved}
                aria-pressed={activeSlot === slot.id}
                onClick={() => { checkingRef.current = false; setActiveSlot(slot.id); setChecked(false); }}
              >
                <small>{tx(slot.label, lang)}</small>
                <b>{filled[slot.id] ? cardText(filled[slot.id]) : '—'}</b>
              </button>
            ))}
          </div>
          <div className="p4-card-bank">
            {bankCards.map((card) => {
              const used = Object.values(filled).includes(card.id);
              return (
                <button
                  type="button"
                  key={card.id}
                  className={`p4-card ${used ? 'is-used' : ''}`}
                  disabled={solved || activeSlot === null || used}
                  onClick={() => {
                    checkingRef.current = false;
                    setFilled((old) => ({ ...old, [activeSlot]: card.id }));
                    setActiveSlot(null);
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
          text={solved ? task.correctText : adaptive(task, pickedOption, attempts, customWrong)}
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

export default function Grade4Dars48Practice({ studentName, lang: langProp, onFinished }) {
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
.p4-note{color:${T.ink3};font-size:13px;line-height:1.4}
.p4-visual{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;width:100%;min-height:96px;padding:12px 10px;border-radius:16px;background:${T.paper};box-shadow:inset 0 0 0 1px rgba(23,59,82,.08);overflow:hidden}
.p4-record{text-align:center;font:800 clamp(16px,3.4vw,25px) 'JetBrains Mono',monospace;color:${T.navy};line-height:1.35}
.p4-record.is-error{color:${T.warn};text-decoration:line-through}
.p4-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
.p4-option{display:flex;align-items:center;gap:9px;min-width:44px;min-height:56px;padding:10px 12px;text-align:left;border:1px solid rgba(23,59,82,.12);border-radius:14px;background:${T.paper};color:${T.ink};font:700 clamp(12px,1.8vw,14px)/1.35 'JetBrains Mono',monospace;cursor:pointer;transition:transform .16s,border-color .2s,background .2s}
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
.p4-match-cols{display:grid;grid-template-columns:1.4fr 1fr;gap:10px;margin-top:7px}
.p4-match-col{display:grid;gap:8px;align-content:start}
.p4-match-item{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-width:44px;min-height:52px;padding:8px 9px;border:1px solid rgba(23,59,82,.12);border-radius:12px;background:${T.paper};color:${T.navy};font:700 clamp(11px,1.8vw,13px)/1.3 'Manrope',sans-serif;text-align:center;cursor:pointer}
.p4-match-item.is-record{font-family:'JetBrains Mono',monospace;font-weight:800}
.p4-match-item.is-active{border-color:${T.accent};background:${T.accentSoft}}
.p4-match-item.is-tied{border-color:rgba(34,122,83,.35)}
.p4-match-item.is-used{background:${T.successSoft};opacity:.65}
.p4-match-item:disabled{cursor:default}
.p4-match-item b{color:${T.success};font-size:11px;font-family:'JetBrains Mono',monospace}
.p4-slot-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin-top:7px}
.p4-slot{display:grid;place-items:center;gap:4px;min-width:44px;min-height:70px;padding:8px;border:1px solid rgba(23,59,82,.12);border-radius:13px;background:${T.paper};color:${T.ink2};font-family:inherit;cursor:pointer}
.p4-slot.is-active{border-color:${T.accent};background:${T.accentSoft}}
.p4-slot.is-no{border-color:${T.warn};background:${T.warnSoft}}
.p4-slot small{font-weight:800;font-size:11px;text-align:center}
.p4-slot b{font:800 13px/1.25 'JetBrains Mono',monospace;color:${T.navy};text-align:center}
.p4-card-bank{display:flex;flex-wrap:wrap;justify-content:center;gap:7px;margin-top:8px}
.p4-card{min-width:44px;min-height:46px;padding:8px 11px;border:1px solid rgba(23,59,82,.12);border-radius:12px;background:${T.paper};color:${T.navy};font:800 12.5px/1.3 'JetBrains Mono',monospace;cursor:pointer}
.p4-card.is-used{background:${T.cyanSoft};opacity:.7}
.p4-sort{display:flex;flex-direction:column;gap:10px}
.p4-sort-pool{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:8px;min-height:60px;padding:8px;border-radius:14px;background:${T.paper};box-shadow:inset 0 0 0 1px rgba(23,59,82,.08)}
.p4-pool-done{color:${T.success};font-size:26px}
.p4-sort-token{max-width:280px;min-width:44px;min-height:44px;padding:6px 10px;border:1px solid rgba(23,59,82,.14);border-radius:12px;background:${T.paper};color:${T.navy};font:800 12px/1.25 'JetBrains Mono',monospace;cursor:pointer}
.p4-sort-token.is-active{border-color:${T.accent};background:${T.accentSoft};transform:translateY(-2px)}
.p4-sort-token.is-no{border-color:${T.warn};background:${T.warnSoft}}
.p4-sort-bins{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
.p4-sort-bin{min-height:120px;padding:8px;border-radius:14px;background:${T.paper};box-shadow:inset 0 0 0 1px rgba(23,59,82,.08)}
.p4-sort-bin-head{width:100%;min-width:44px;min-height:44px;padding:8px 6px;border:0;border-radius:10px;background:${T.cyanSoft};color:${T.cyan};font:800 12px/1.25 'Manrope',sans-serif;cursor:pointer}
.p4-sort-bin-head:disabled{cursor:default;opacity:.78}
.p4-sort-bin-items{display:flex;flex-direction:column;align-items:stretch;gap:6px;padding-top:8px}
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
  .p4-match-cols{grid-template-columns:1.25fr 1fr;gap:7px}
  .p4-slot-list{grid-template-columns:1fr}
  .p4-slot{min-height:62px;padding:6px}
  .p4-sort-bins{grid-template-columns:1fr;gap:6px}
  .p4-sort-bin{min-height:auto;padding:6px}
  .p4-sort-bin-head{min-height:44px;padding:6px 4px;font-size:11px}
  .p4-sort-token{font-size:10.5px;padding:4px 6px;line-height:1.2}
  .p4-sort-bin-items{gap:4px;padding-top:6px}
  .p4-sort{gap:6px}
  .p4-sort-pool{min-height:48px;padding:6px}
  .p4-sort-pool{min-height:56px;gap:6px}
  .p4-main{padding:4px 8px}
  .p4-head{padding:64px 8px 6px}
  .p4-visual{padding:10px 6px;min-height:88px}
  .p4-task{gap:8px}
}
@media(max-width:640px) and (max-height:700px){
  .p4-head{padding:64px 8px 3px!important}
  .p4-task{gap:6px!important}
  .p4-setup{font-size:12.5px;line-height:1.35}
  .p4-ask{font-size:16px!important}
  .p4-visual{min-height:72px!important;padding:8px 6px!important}
  .p4-option{min-height:46px!important;padding:6px 8px!important;font-size:11.5px!important}
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
