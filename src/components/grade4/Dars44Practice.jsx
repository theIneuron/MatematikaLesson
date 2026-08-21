// ============================================================================
// 4-SINF · 44-DARS AMALIYOTI · MURAKKAB MASALALAR
// 10 topshiriq · UZ/RU/EN · ovozsiz · solve-to-advance.
//
// Skelet: src/books/grade4/AMALIYOT_41_51_SKELET.md §7.
// Mexanika raskladkasi: scripts/grade4-practice-41-51-layout.mjs
//   sort · missing · match · slots · numpad · missing · slots · sort · mc · numpad
//
// Infratuzilma fayl ichida: LMS lokal importni ko'tarmaydi (CLAUDE.md §5 dan
// ongli chekinish, sabab 41-dars amaliyoti shapkasida).
//
// NAZARIYADAN FARQ. Nazariy dars 14 587 + 10 030 - 850 va uchta sisterna
// (10 427, 4 574, 1 696) sonlarini ishlatgan; bu yerda boshqa sonlar.
//
// MODEL: ikki qadamli reja sxemasi. Oraliq qiymat alohida qadamda turadi va
// bo'sh bo'lsa akcent bilan belgilanadi — bola oraliq javob emasligini
// ko'radi. Sxema hisobni bermaydi, faqat qadamlar borligini ko'rsatadi.
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
  title: b('Урок 44. Практика: составные задачи', '44-dars. Amaliyot: murakkab masalalar', 'Lesson 44. Practice: multi-step problems'),
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
  lessonId: 'multistep-4-44-practice',
  lessonTitle: UI.title,
  grade: 4,
  lessonNumber: 44,
  activityType: 'practice',
  taskCount: 10,
  resultIsUiState: true,
  progression: { green: 2, yellow: 5, red: 3 },
};

const SCREEN_META = [
  { id: 'practice-01', taskId: '01', template: 'question-sorting', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-02', taskId: '02', template: 'numeric-blank', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-03', taskId: '03', template: 'matching', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-04', taskId: '04', template: 'plan-build', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-05', taskId: '05', template: 'numeric-input', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-06', taskId: '06', template: 'numeric-blank', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-07', taskId: '07', template: 'way-comparison', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-08', taskId: '08', template: 'boundary-sorting', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-09', taskId: '09', template: 'error-analysis', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-10', taskId: '10', template: 'strategy-transfer', type: 'practice', scored: true, scope: 'final' },
];

// Blokning asosiy masalasi: 12 400 + 8 600 quti keldi, 1 500 tasi jo'natildi.
// Oraliq qiymat 21 000, javob 19 500.
const TASKS = [
  {
    id: '01', level: 'green', kind: 'sort', skillTag: 'question_role',
    setup: b(
      'Склад получил 12 400 и 8 600 коробок, потом 1 500 отправили. Вопрос: сколько осталось?',
      "Omborga 12 400 va 8 600 quti keldi, keyin 1 500 tasi jo'natildi. Savol: nechta qoldi?",
      'The warehouse received 12,400 and 8,600 boxes, then 1,500 were sent out. Question: how many are left?',
    ),
    prompt: b(
      'Разложи вопросы по их роли в задаче.',
      'Savollarni masaladagi roli bo\'yicha guruhlarga joylashtiring.',
      'Sort the questions by their role in the problem.',
    ),
    bins: [
      { id: 'middle', label: b('Промежуточный', 'Oraliq savol', 'Intermediate') },
      { id: 'main', label: b('Главный', 'Asosiy savol', 'Main') },
      { id: 'extra', label: b('Не нужен', 'Kerak emas', 'Not needed') },
    ],
    items: [
      { id: 'total-in', bin: 'middle', text: b('Сколько коробок пришло всего?', 'Jami nechta quti keldi?', 'How many boxes arrived in total?') },
      { id: 'left', bin: 'main', text: b('Сколько коробок осталось?', 'Nechta quti qoldi?', 'How many boxes are left?') },
      { id: 'given', bin: 'extra', text: b('Сколько коробок пришло во второй раз?', 'Ikkinchi marta nechta quti keldi?', 'How many boxes arrived the second time?') },
      { id: 'panels', bin: 'extra', text: b('Сколько панелей в одной коробке?', 'Bitta qutida nechta panel bor?', 'How many panels are in one box?') },
    ],
    wrong: [b(
      'Промежуточный вопрос нужен для ответа, но сам ответом не является.',
      "Oraliq savol javob uchun kerak, lekin o'zi javob emas.",
      'An intermediate question is needed for the answer but is not the answer itself.',
    )],
    secondHint: b(
      'Один вопрос уже отвечен в условии, а на другой в условии нет данных.',
      "Bir savolga shartda javob berilgan, boshqasiga esa shartda ma'lumot yo'q.",
      'One question is already answered in the story, and another has no data in it.',
    ),
    thirdHint: b(
      'Главный вопрос — тот, который задан в конце задачи.',
      'Asosiy savol — masala oxirida berilgan savol.',
      'The main question is the one asked at the end of the problem.',
    ),
    correctText: b(
      'Верно. Чтобы ответить, сначала находят, сколько пришло всего.',
      "To'g'ri. Javob berish uchun avval jami qancha kelganini topadilar.",
      'Correct. To answer it, you first find how many arrived in total.',
    ),
    rule: b(
      'В составной задаче ответу предшествует промежуточный вопрос.',
      'Murakkab masalada javobdan oldin oraliq savol turadi.',
      'In a multi-step problem an intermediate question comes before the answer.',
    ),
  },

  {
    id: '02', level: 'green', kind: 'missing', skillTag: 'intermediate_value', answer: '21000', maxLen: 5,
    visual: {
      type: 'plan',
      steps: [
        { id: 's1', label: b('1-е действие', '1-amal', 'Action 1'), text: '?' },
        { id: 's2', label: b('2-е действие', '2-amal', 'Action 2'), text: '− 1 500' },
      ],
    },
    setup: b(
      'Первое действие плана ещё не посчитано.',
      'Rejaning birinchi amali hali hisoblanmagan.',
      'The first action of the plan has not been calculated yet.',
    ),
    prompt: b(
      'Чему равно 12 400 + 8 600?',
      '12 400 + 8 600 nechaga teng?',
      'What is 12,400 + 8,600?',
    ),
    wrong: [b(
      'Складывают только пришедшие коробки: отправленные пока не участвуют.',
      "Faqat kelgan qutilar qo'shiladi: jo'natilganlar hozircha qatnashmaydi.",
      'Only the boxes that arrived are added: the ones sent out are not involved yet.',
    )],
    secondHint: b(
      '12 400 и 8 600 дают ровное число тысяч.',
      "12 400 va 8 600 yumaloq minglik beradi.",
      '12,400 and 8,600 give a round number of thousands.',
    ),
    thirdHint: b('12 400 + 8 600 = 21 000.', '12 400 + 8 600 = 21 000.', '12,400 + 8,600 = 21,000.'),
    correctText: b(
      'Верно. 21 000 — промежуточное значение, а не ответ.',
      "To'g'ri. 21 000 — oraliq qiymat, javob emas.",
      'Correct. 21,000 is the intermediate value, not the answer.',
    ),
    rule: b(
      'Промежуточное значение записывают отдельно, чтобы не спутать с ответом.',
      'Oraliq qiymat javob bilan chalkashmasligi uchun alohida yoziladi.',
      'The intermediate value is written separately so that it is not confused with the answer.',
    ),
  },

  {
    id: '03', level: 'yellow', kind: 'match', skillTag: 'plan_matching',
    setup: b(
      'Четыре короткие задачи, и у каждой свой план.',
      "To'rt qisqa masala, har birining o'z rejasi bor.",
      'Four short problems, each with its own plan.',
    ),
    prompt: b('Соедини задачу с её планом.', 'Masalani o\'z rejasi bilan ulang.', 'Match each problem to its plan.'),
    pairs: [
      {
        id: 'add-sub',
        left: b('Пришло два раза, часть отправили', "Ikki marta keldi, bir qismi jo'natildi", 'Arrived twice, a part was sent out'),
        correctRight: 'plus-minus',
      },
      {
        id: 'sub-add',
        left: b('Отправили, потом привезли ещё', "Jo'natildi, keyin yana keltirildi", 'Sent out, then more arrived'),
        correctRight: 'minus-plus',
      },
      {
        id: 'mul-add',
        left: b('Несколько одинаковых ящиков и ещё один', "Bir nechta bir xil yashik va yana bittasi", 'Several identical crates and one more'),
        correctRight: 'times-plus',
      },
      {
        id: 'add-div',
        left: b('Собрали вместе и разделили на равные части', "Birga yig'ildi va teng qismlarga bo'lindi", 'Put together and divided into equal parts'),
        correctRight: 'plus-divide',
      },
    ],
    right: [
      { id: 'plus-minus', text: b('Сначала +, потом −', "Avval +, keyin −", 'First +, then −') },
      { id: 'minus-plus', text: b('Сначала −, потом +', "Avval −, keyin +", 'First −, then +') },
      { id: 'times-plus', text: b('Сначала ×, потом +', "Avval ×, keyin +", 'First ×, then +') },
      { id: 'plus-divide', text: b('Сначала +, потом :', "Avval +, keyin :", 'First +, then :') },
    ],
    wrong: [b(
      'План читают по порядку событий в условии, а не по порядку чисел.',
      "Reja shartdagi voqealar tartibi bo'yicha o'qiladi, sonlar tartibi bo'yicha emas.",
      'A plan follows the order of events in the story, not the order of the numbers.',
    )],
    secondHint: b(
      '«Одинаковые ящики» — это умножение, а «равные части» — деление.',
      "«Bir xil yashiklar» — ko'paytirish, «teng qismlar» — bo'lish.",
      'Identical crates mean multiplication, and equal parts mean division.',
    ),
    thirdHint: b(
      'Второе действие всегда работает с результатом первого.',
      'Ikkinchi amal har doim birinchisining natijasi bilan ishlaydi.',
      'The second action always works with the result of the first one.',
    ),
    correctText: b(
      'Верно. Порядок действий задан порядком событий.',
      'To\'g\'ri. Amallar tartibi voqealar tartibi bilan belgilanadi.',
      'Correct. The order of the actions is set by the order of the events.',
    ),
    rule: b(
      'План составляют до вычислений.',
      'Reja hisoblashdan oldin tuziladi.',
      'The plan is made before the calculations.',
    ),
  },

  {
    id: '04', level: 'yellow', kind: 'slots', skillTag: 'plan_order',
    visual: {
      type: 'plan',
      steps: [
        { id: 's1', label: b('1-е действие', '1-amal', 'Action 1'), text: '?' },
        { id: 's2', label: b('2-е действие', '2-amal', 'Action 2'), text: '?' },
      ],
    },
    setup: b(
      'Тот же склад: 12 400 и 8 600 коробок пришло, 1 500 отправили.',
      "O'sha ombor: 12 400 va 8 600 quti keldi, 1 500 tasi jo'natildi.",
      'The same warehouse: 12,400 and 8,600 boxes arrived, and 1,500 were sent out.',
    ),
    prompt: b('Собери план решения.', 'Yechish rejasini tuzing.', 'Build the plan of the solution.'),
    slots: [
      {
        id: 'first', label: b('1-е действие', '1-amal', 'Action 1'), correct: 'sum',
        wrong: b(
          'Первое действие работает только с числами из условия.',
          "Birinchi amal faqat shartdagi sonlar bilan ishlaydi.",
          'The first action works only with the numbers from the story.',
        ),
      },
      {
        id: 'second', label: b('2-е действие', '2-amal', 'Action 2'), correct: 'take',
        wrong: b(
          'Второе действие берёт результат первого и убирает отправленные коробки.',
          "Ikkinchi amal birinchisining natijasini olib, jo'natilgan qutilarni ayiradi.",
          'The second action takes the result of the first one and removes the boxes sent out.',
        ),
      },
    ],
    cards: [
      { id: 'sum', text: b('12 400 + 8 600', '12 400 + 8 600', '12,400 + 8,600') },
      { id: 'take', text: b('21 000 − 1 500', '21 000 − 1 500', '21,000 − 1,500') },
      { id: 'early', text: b('12 400 − 1 500', '12 400 − 1 500', '12,400 − 1,500') },
      { id: 'wrong-add', text: b('8 600 + 1 500', '8 600 + 1 500', '8,600 + 1,500') },
      { id: 'wrong-sum', text: b('21 000 + 1 500', '21 000 + 1 500', '21,000 + 1,500') },
      { id: 'late', text: b('19 500 − 1 500', '19 500 − 1 500', '19,500 − 1,500') },
    ],
    wrong: [b(
      'Проверь, откуда взято каждое число: из условия или из первого действия.',
      "Har sonning qayerdan olinganini tekshiring: shartdanmi yoki birinchi amaldanmi.",
      'Check where each number comes from: the story or the first action.',
    )],
    secondHint: b(
      'Число 21 000 не дано в условии, оно получается в первом действии.',
      "21 000 soni shartda berilmagan, u birinchi amalda hosil bo'ladi.",
      'The number 21,000 is not given in the story: it appears in the first action.',
    ),
    thirdHint: b(
      'Сначала складывают пришедшее, потом убирают отправленное.',
      "Avval kelgani qo'shiladi, keyin jo'natilgani ayiriladi.",
      'First add what arrived, then remove what was sent out.',
    ),
    correctText: b(
      'Верно. 12 400 + 8 600 = 21 000, затем 21 000 − 1 500.',
      "To'g'ri. 12 400 + 8 600 = 21 000, keyin 21 000 − 1 500.",
      'Correct. 12,400 + 8,600 = 21,000, then 21,000 − 1,500.',
    ),
    rule: b(
      'Второе действие опирается на результат первого.',
      'Ikkinchi amal birinchisining natijasiga tayanadi.',
      'The second action relies on the result of the first.',
    ),
  },

  {
    id: '05', level: 'yellow', kind: 'numpad', skillTag: 'two_step_compute', answer: '19500', maxLen: 5,
    visual: {
      type: 'plan',
      steps: [
        { id: 's1', label: b('1-е действие', '1-amal', 'Action 1'), text: '21 000' },
        { id: 's2', label: b('Ответ', 'Javob', 'Answer'), text: '?' },
      ],
    },
    setup: b(
      'Промежуточное значение уже найдено.',
      'Oraliq qiymat allaqachon topilgan.',
      'The intermediate value has already been found.',
    ),
    prompt: b('Сколько коробок осталось на складе?', 'Omborda nechta quti qoldi?', 'How many boxes are left in the warehouse?'),
    wrong: [b(
      'Из промежуточного значения убирают отправленные коробки.',
      "Oraliq qiymatdan jo'natilgan qutilar ayiriladi.",
      'The boxes sent out are taken from the intermediate value.',
    )],
    secondHint: b('21 000 − 1 500.', '21 000 − 1 500.', '21,000 − 1,500.'),
    thirdHint: b('21 000 − 1 500 = 19 500.', '21 000 − 1 500 = 19 500.', '21,000 − 1,500 = 19,500.'),
    correctText: b(
      'Верно. Ответ 19 500 коробок.',
      "To'g'ri. Javob 19 500 quti.",
      'Correct. The answer is 19,500 boxes.',
    ),
    rule: b(
      'Ответ получается только после второго действия.',
      'Javob faqat ikkinchi amaldan keyin hosil bo\'ladi.',
      'The answer appears only after the second action.',
    ),
  },

  {
    id: '06', level: 'yellow', kind: 'missing', skillTag: 'second_way', answer: '19500', maxLen: 5,
    visual: { type: 'record', text: '12 400 + (8 600 − 1 500) = □' },
    setup: b(
      'Ту же задачу можно решить другим путём: сначала убрать отправленные из второй партии.',
      "Xuddi shu masalani boshqa yo'l bilan yechish mumkin: avval jo'natilganni ikkinchi partiyadan ayirish.",
      'The same problem can be solved another way: first take the boxes sent out from the second batch.',
    ),
    prompt: b('Какое число получится?', 'Qanday son hosil bo\'ladi?', 'Which number do you get?'),
    wrong: [b(
      'Второй путь даёт тот же ответ, что и первый.',
      "Ikkinchi yo'l birinchisi bilan bir xil javob beradi.",
      'The second way gives the same answer as the first.',
    )],
    secondHint: b(
      'В скобках получается 7 100.',
      "Qavs ichida 7 100 hosil bo'ladi.",
      'The brackets give 7,100.',
    ),
    thirdHint: b('12 400 + 7 100 = 19 500.', '12 400 + 7 100 = 19 500.', '12,400 + 7,100 = 19,500.'),
    correctText: b(
      'Верно. Оба пути дали 19 500.',
      "To'g'ri. Ikki yo'l ham 19 500 berdi.",
      'Correct. Both ways gave 19,500.',
    ),
    rule: b(
      'Разные пути решения дают один и тот же ответ.',
      "Turli yechish yo'llari bir xil javob beradi.",
      'Different solution paths give the same answer.',
    ),
  },

  {
    id: '07', level: 'yellow', kind: 'slots', skillTag: 'way_comparison',
    setup: b(
      'Две записи решают одну задачу, но в разном порядке.',
      "Ikki yozuv bitta masalani turli tartibda yechadi.",
      'Two records solve the same problem in a different order.',
    ),
    prompt: b('Поставь каждую запись к своему описанию.', 'Har yozuvni o\'z tavsifiga qo\'ying.', 'Put each record with its description.'),
    slots: [
      {
        id: 'add-first', label: b('Сначала складываем, потом вычитаем', "Avval qo'shamiz, keyin ayiramiz", 'Add first, then subtract'), correct: 'sum-then-take',
        wrong: b(
          'В этой записи скобки стоят вокруг сложения.',
          "Bu yozuvda qavs qo'shish atrofida turadi.",
          'In this record the brackets are around the addition.',
        ),
      },
      {
        id: 'sub-first', label: b('Сначала вычитаем, потом складываем', "Avval ayiramiz, keyin qo'shamiz", 'Subtract first, then add'), correct: 'take-then-sum',
        wrong: b(
          'В этой записи скобки стоят вокруг вычитания.',
          'Bu yozuvda qavs ayirish atrofida turadi.',
          'In this record the brackets are around the subtraction.',
        ),
      },
    ],
    cards: [
      { id: 'sum-then-take', text: b('(12 400 + 8 600) − 1 500', '(12 400 + 8 600) − 1 500', '(12,400 + 8,600) − 1,500') },
      { id: 'take-then-sum', text: b('12 400 + (8 600 − 1 500)', '12 400 + (8 600 − 1 500)', '12,400 + (8,600 − 1,500)') },
      { id: 'wrong-order', text: b('(12 400 − 8 600) + 1 500', '(12 400 − 8 600) + 1 500', '(12,400 − 8,600) + 1,500') },
      { id: 'wrong-both', text: b('12 400 − (8 600 + 1 500)', '12 400 − (8 600 + 1 500)', '12,400 − (8,600 + 1,500)') },
    ],
    wrong: [b(
      'Смотри, какое действие стоит внутри скобок: оно выполняется первым.',
      "Qavs ichida qaysi amal turganiga qarang: u birinchi bajariladi.",
      'Look at which action is inside the brackets: it is done first.',
    )],
    secondHint: b(
      'Скобки показывают, что считают раньше.',
      "Qavs nima avval hisoblanishini ko'rsatadi.",
      'Brackets show what is calculated first.',
    ),
    thirdHint: b(
      'Две другие записи меняют смысл задачи и дают не 19 500.',
      "Boshqa ikki yozuv masalaning ma'nosini o'zgartiradi va 19 500 bermaydi.",
      'The other two records change the meaning of the problem and do not give 19,500.',
    ),
    correctText: b(
      'Верно. Скобки задают порядок, а ответ остаётся 19 500.',
      "To'g'ri. Qavs tartibni belgilaydi, javob esa 19 500 bo'lib qoladi.",
      'Correct. The brackets set the order, and the answer stays 19,500.',
    ),
    rule: b(
      'Скобки показывают, какое действие выполняется первым.',
      "Qavs qaysi amal birinchi bajarilishini ko'rsatadi.",
      'Brackets show which action is performed first.',
    ),
  },

  {
    id: '08', level: 'red', kind: 'sort', skillTag: 'one_or_two_steps',
    setup: b(
      'Не каждая задача требует двух действий.',
      'Har masala ikki amalni talab qilmaydi.',
      'Not every problem needs two actions.',
    ),
    prompt: b(
      'Разложи вопросы по числу нужных действий.',
      'Savollarni kerakli amallar soniga qarab guruhlarga joylashtiring.',
      'Sort the questions by the number of actions they need.',
    ),
    bins: [
      { id: 'one', label: b('Одно действие', 'Bir amal', 'One action') },
      { id: 'two', label: b('Два действия', 'Ikki amal', 'Two actions') },
    ],
    items: [
      { id: 'sum-only', bin: 'one', text: b('Сколько пришло за два раза?', 'Ikki martada nechta keldi?', 'How many arrived in the two deliveries?') },
      { id: 'diff-only', bin: 'one', text: b('На сколько во второй раз пришло меньше?', 'Ikkinchi marta nechtaga kam keldi?', 'How many fewer arrived the second time?') },
      { id: 'left-after', bin: 'two', text: b('Сколько осталось после отправки?', "Jo'natishdan keyin nechta qoldi?", 'How many are left after the dispatch?') },
      { id: 'total-panels', bin: 'two', text: b('Сколько панелей во всех пришедших коробках?', 'Kelgan barcha qutilarda nechta panel bor?', 'How many panels are in all the boxes that arrived?') },
    ],
    wrong: [b(
      'Считай, сколько новых чисел нужно получить до ответа.',
      "Javobgacha nechta yangi son topish kerakligini sanang.",
      'Count how many new numbers you need before the answer.',
    )],
    secondHint: b(
      'Если ответ виден сразу из двух данных чисел, действие одно.',
      "Javob berilgan ikki sondan darhol ko'rinsa, amal bitta.",
      'If the answer follows straight from two given numbers, there is one action.',
    ),
    thirdHint: b(
      'Длина условия не говорит о числе действий.',
      "Shartning uzunligi amallar soni haqida gapirmaydi.",
      'The length of the story says nothing about the number of actions.',
    ),
    correctText: b(
      'Верно. Число действий зависит от вопроса, а не от длины условия.',
      "To'g'ri. Amallar soni savolga bog'liq, shartning uzunligiga emas.",
      'Correct. The number of actions depends on the question, not on the length of the story.',
    ),
    rule: b(
      'Число действий определяют по вопросу.',
      'Amallar soni savolga qarab aniqlanadi.',
      'The number of actions is decided by the question.',
    ),
  },

  {
    id: '09', level: 'red', kind: 'mc', skillTag: 'intermediate_as_answer',
    visual: {
      type: 'plan',
      steps: [
        { id: 's1', label: b('1-е действие', '1-amal', 'Action 1'), text: '21 000' },
        { id: 's2', label: b('Ответ Bit', 'Bit javobi', 'Bit answer'), text: '21 000' },
      ],
    },
    setup: b(
      'Bit посчитал 12 400 + 8 600 = 21 000 и записал 21 000 в ответ.',
      "Bit 12 400 + 8 600 = 21 000 deb hisoblab, javobga 21 000 deb yozdi.",
      'Bit calculated 12,400 + 8,600 = 21,000 and wrote 21,000 as the answer.',
    ),
    prompt: b('В чём ошибка?', 'Xato nimada?', 'What is the error?'),
    options: [
      option('intermediate', 'Промежуточное значение записано как ответ', "Oraliq qiymat javob deb yozilgan", 'The intermediate value has been written as the answer', true),
      option('sum-wrong', 'Сложение посчитано неверно', "Qo'shish noto'g'ri hisoblangan", 'The addition is calculated wrongly', false,
        '12 400 + 8 600 действительно равно 21 000, счёт верный.',
        "12 400 + 8 600 haqiqatan 21 000 ga teng, hisob to'g'ri.",
        '12,400 + 8,600 really is 21,000: the calculation is right.'),
      option('not-enough', 'В условии не хватает данных', "Shartda ma'lumot yetmaydi", 'The story does not have enough data', false,
        'Трёх чисел достаточно: два прихода и одна отправка.',
        "Uch son yetarli: ikki kelish va bitta jo'natish.",
        'Three numbers are enough: two arrivals and one dispatch.'),
      option('order', 'Действия выполнены в обратном порядке', 'Amallar teskari tartibda bajarilgan', 'The actions were done in the reverse order', false,
        'Порядок верный: сложение стоит первым. Просто второе действие не выполнено.',
        "Tartib to'g'ri: qo'shish birinchi turadi. Faqat ikkinchi amal bajarilmagan.",
        'The order is right: the addition comes first. It is the second action that was not done.'),
    ],
    secondHint: b(
      'Сравни записанное число с главным вопросом задачи.',
      'Yozilgan sonni masalaning asosiy savoli bilan solishtiring.',
      'Compare the number written down with the main question of the problem.',
    ),
    thirdHint: b(
      'Осталось выполнить вычитание 1 500.',
      "1 500 ni ayirish qoldi.",
      'Subtracting 1,500 is still to be done.',
    ),
    correctText: b(
      'Верно. 21 000 — это то, что пришло, а спрашивали, сколько осталось.',
      "To'g'ri. 21 000 — bu kelgan miqdor, savol esa nechta qolganini so'ragan.",
      'Correct. 21,000 is what arrived, but the question asked how many are left.',
    ),
    rule: b(
      'Перед тем как записать ответ, сверяют его с вопросом.',
      'Javobni yozishdan oldin uni savol bilan solishtiradilar.',
      'Before writing the answer, check it against the question.',
    ),
  },

  {
    id: '10', level: 'red', kind: 'numpad', skillTag: 'three_part_transfer', answer: '17900', maxLen: 5,
    visual: {
      type: 'plan',
      steps: [
        { id: 's1', label: b('1-е действие', '1-amal', 'Action 1'), text: '?' },
        { id: 's2', label: b('2-е действие', '2-amal', 'Action 2'), text: '?' },
      ],
    },
    setup: b(
      'В первой цистерне 10 400 литров, во второй 4 600 литров, в третьей на 1 700 литров меньше, чем во второй.',
      "Birinchi sisternada 10 400 litr, ikkinchisida 4 600 litr, uchinchisida ikkinchisidan 1 700 litr kam.",
      'The first tank holds 10,400 litres, the second 4,600 litres, and the third 1,700 litres less than the second.',
    ),
    prompt: b('Сколько литров во всех трёх цистернах?', 'Uchta sisternada jami necha litr bor?', 'How many litres are there in all three tanks?'),
    wrong: [b(
      'Слово «меньше» относится ко второй цистерне, а не к общему количеству.',
      "«Kam» so'zi ikkinchi sisternaga tegishli, umumiy miqdorga emas.",
      'The word less refers to the second tank, not to the total.',
    )],
    secondHint: b(
      'Сначала находят, сколько в третьей цистерне.',
      "Avval uchinchi sisternada qancha borligi topiladi.",
      'First find how much is in the third tank.',
    ),
    thirdHint: b(
      '4 600 − 1 700 = 2 900, затем 10 400 + 4 600 + 2 900.',
      "4 600 − 1 700 = 2 900, keyin 10 400 + 4 600 + 2 900.",
      '4,600 − 1,700 = 2,900, then 10,400 + 4,600 + 2,900.',
    ),
    correctText: b(
      'Верно. 2 900 литров в третьей, всего 17 900 литров.',
      "To'g'ri. Uchinchisida 2 900 litr, jami 17 900 litr.",
      'Correct. The third tank holds 2,900 litres, and the total is 17,900 litres.',
    ),
    rule: b(
      'Сравнение «меньше на» сначала превращают в число, и только потом складывают.',
      "«... ga kam» taqqoslashi avval songa aylantiriladi, keyin qo'shiladi.",
      'A less-by comparison is first turned into a number, and only then added.',
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

// Ikki qadamli reja sxemasi. Qadam qiymati '?' bo'lsa, u hali topilmagan va
// akcent bilan belgilanadi. Sxema hisobni bermaydi.
function PlanModel({ visual, lang }) {
  return (
    <div className="p4-plan">
      {visual.steps.map((step, index) => (
        <div className="p4-plan-step" key={step.id}>
          {index > 0 && <span className="p4-plan-arrow" aria-hidden="true">→</span>}
          <div className={`p4-plan-box ${step.text === '?' ? 'is-open' : ''}`}>
            <small>{tx(step.label, lang)}</small>
            <b>{step.text}</b>
          </div>
        </div>
      ))}
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

      {task.visual?.type === 'plan' && <div className="p4-visual"><PlanModel visual={task.visual} lang={lang} /></div>}
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

export default function Grade4Dars44Practice({ studentName, lang: langProp, onFinished }) {
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
.p4-visual{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;width:100%;min-height:100px;padding:12px 10px;border-radius:16px;background:${T.paper};box-shadow:inset 0 0 0 1px rgba(23,59,82,.08);overflow:hidden}
.p4-plan{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:6px;width:100%}
.p4-plan-step{display:flex;align-items:center;gap:6px}
.p4-plan-arrow{color:${T.ink3};font-size:20px}
.p4-plan-box{display:grid;place-items:center;gap:3px;min-width:118px;min-height:62px;padding:8px 10px;border-radius:12px;background:${T.cyanSoft};box-shadow:inset 0 0 0 1px rgba(22,143,163,.22)}
.p4-plan-box.is-open{background:${T.accentSoft};box-shadow:inset 0 0 0 2px ${T.accent}}
.p4-plan-box small{color:${T.ink3};font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}
.p4-plan-box b{font:800 clamp(15px,3vw,20px) 'JetBrains Mono',monospace;color:${T.navy}}
.p4-plan-box.is-open b{color:${T.accent}}
.p4-record{text-align:center;font:800 clamp(17px,3.6vw,26px) 'JetBrains Mono',monospace;color:${T.navy}}
.p4-record.is-error{color:${T.warn};text-decoration:line-through}
.p4-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
.p4-option{display:flex;align-items:center;gap:9px;min-width:44px;min-height:56px;padding:10px 12px;text-align:left;border:1px solid rgba(23,59,82,.12);border-radius:14px;background:${T.paper};color:${T.ink};font:700 clamp(13px,1.9vw,15px)/1.35 'Manrope',sans-serif;cursor:pointer;transition:transform .16s,border-color .2s,background .2s}
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
.p4-match-cols{display:grid;grid-template-columns:1.3fr 1fr;gap:10px;margin-top:7px}
.p4-match-col{display:grid;gap:8px;align-content:start}
.p4-match-item{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-width:44px;min-height:52px;padding:8px 9px;border:1px solid rgba(23,59,82,.12);border-radius:12px;background:${T.paper};color:${T.navy};font:700 clamp(11.5px,1.9vw,13.5px)/1.3 'Manrope',sans-serif;text-align:center;cursor:pointer}
.p4-match-item.is-active{border-color:${T.accent};background:${T.accentSoft}}
.p4-match-item.is-tied{border-color:rgba(34,122,83,.35)}
.p4-match-item.is-used{background:${T.successSoft};opacity:.65}
.p4-match-item:disabled{cursor:default}
.p4-match-item b{color:${T.success};font-size:11px}
.p4-slot-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-top:7px}
.p4-slot{display:grid;place-items:center;gap:4px;min-width:44px;min-height:70px;padding:8px;border:1px solid rgba(23,59,82,.12);border-radius:13px;background:${T.paper};color:${T.ink2};font-family:inherit;cursor:pointer}
.p4-slot.is-active{border-color:${T.accent};background:${T.accentSoft}}
.p4-slot.is-no{border-color:${T.warn};background:${T.warnSoft}}
.p4-slot small{font-weight:800;font-size:11px;text-align:center}
.p4-slot b{font:800 13px/1.25 'JetBrains Mono',monospace;color:${T.navy};text-align:center}
.p4-card-bank{display:flex;flex-wrap:wrap;justify-content:center;gap:7px;margin-top:8px}
.p4-card{min-width:44px;min-height:46px;padding:8px 11px;border:1px solid rgba(23,59,82,.12);border-radius:12px;background:${T.paper};color:${T.navy};font:700 12.5px/1.3 'JetBrains Mono',monospace;cursor:pointer}
.p4-card.is-used{background:${T.cyanSoft};opacity:.7}
.p4-sort{display:flex;flex-direction:column;gap:10px}
.p4-sort-pool{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:8px;min-height:60px;padding:8px;border-radius:14px;background:${T.paper};box-shadow:inset 0 0 0 1px rgba(23,59,82,.08)}
.p4-pool-done{color:${T.success};font-size:26px}
.p4-sort-token{min-width:44px;min-height:44px;padding:6px 10px;border:1px solid rgba(23,59,82,.14);border-radius:12px;background:${T.paper};color:${T.navy};font:700 12px/1.25 'Manrope',sans-serif;cursor:pointer}
.p4-sort-token.is-wide{max-width:260px}
.p4-sort-token.is-active{border-color:${T.accent};background:${T.accentSoft};transform:translateY(-2px)}
.p4-sort-token.is-no{border-color:${T.warn};background:${T.warnSoft}}
.p4-sort-bins{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}
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
  .p4-match-cols{grid-template-columns:1fr 1fr}
  .p4-slot-list{grid-template-columns:1fr}
  .p4-slot{min-height:62px;padding:6px}
  .p4-sort-bins{grid-template-columns:1fr;gap:6px}
  .p4-sort-bin{display:flex;align-items:center;gap:8px;min-height:56px;padding:6px}
  .p4-sort-bin-head{flex:0 0 34%;min-height:44px;padding:6px 4px;font-size:11px}
  .p4-sort-bin-items{flex:1;justify-content:flex-start;padding-top:0}
  .p4-sort-pool{min-height:56px;gap:6px}
  .p4-sort-token.is-wide{max-width:100%}
  .p4-main{padding:4px 8px}
  .p4-head{padding:64px 8px 6px}
  .p4-visual{padding:10px 6px;min-height:92px}
  .p4-task{gap:8px}
}
@media(max-width:640px) and (max-height:700px){
  .p4-sort-pool{display:grid;grid-template-columns:1fr 1fr;gap:5px;min-height:0;padding:6px}
  .p4-sort-token,.p4-sort-token.is-wide{max-width:100%;font-size:10px;padding:4px 6px;line-height:1.2}
  .p4-sort-bin{min-height:48px;padding:5px}
  .p4-sort-bin-head{font-size:10px;padding:5px 4px}
  .p4-slot-list{grid-template-columns:1fr 1fr!important;gap:6px}
  .p4-slot{min-height:56px!important;padding:5px!important}
  .p4-match-item{min-height:46px;padding:6px 7px;font-size:10.5px}
  .p4-plan-box{min-width:96px;min-height:52px;padding:6px 8px}

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
