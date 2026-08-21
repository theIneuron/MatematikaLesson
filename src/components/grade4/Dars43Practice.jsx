// ============================================================================
// 4-SINF · 43-DARS AMALIYOTI · TENGLAMALARNI YECHISH VA TEKSHIRISH
// 10 topshiriq · UZ/RU/EN · ovozsiz · solve-to-advance.
//
// Skelet: src/books/grade4/AMALIYOT_41_51_SKELET.md §6.
// Mexanika raskladkasi: scripts/grade4-practice-41-51-layout.mjs
//   mc · numpad · order · missing · slots · numpad · sort · mc · match · sort
//
// Infratuzilma fayl ichida: LMS lokal importni ko'tarmaydi (CLAUDE.md §5 dan
// ongli chekinish, 41-dars amaliyoti shapkasida sabab yozilgan).
//
// NAZARIYADAN FARQ. Nazariy dars (13 900 - x) : 80 = 140, (8 700 - x) : 900 = 9,
// x : 100 = 46 va x : 35 = 16 800 yozuvlarini ishlatgan; bu yerda boshqa sonlar.
//
// MODEL: yozuv kartasi. Tenglama va tekshiruv yozuvi — matematik obyektning
// o'zi, shuning uchun sahna aynan shu yozuv bo'ladi. Xato yozuv chizib
// tashlangan holda ko'rsatiladi.
// ============================================================================

import { useEffect, useMemo, useRef, useState } from 'react';
import { PRACTICE_FIX_CSS } from './grade4PracticeFixStyles.js';

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
  title: b('Урок 43. Практика: решение уравнений с проверкой', '43-dars. Amaliyot: tenglamalarni yechish va tekshirish', 'Lesson 43. Practice: solving and checking equations'),
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
  slotHint: b('Выбери место, потом карточку.', 'Avval joyni, keyin kartani tanlang.', 'Choose a place, then a card.'),
  returnCard: b('Вернуть карточку', 'Kartani qaytarish', 'Return the card'),
};

const LESSON_META = {
  lessonId: 'eqsolve-4-43-practice',
  lessonTitle: UI.title,
  grade: 4,
  lessonNumber: 43,
  activityType: 'practice',
  taskCount: 10,
  resultIsUiState: true,
  progression: { green: 2, yellow: 5, red: 3 },
};

const SCREEN_META = [
  { id: 'practice-01', taskId: '01', template: 'multiple-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-02', taskId: '02', template: 'numeric-input', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-03', taskId: '03', template: 'ordering', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-04', taskId: '04', template: 'numeric-blank', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-05', taskId: '05', template: 'substitution-check', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-06', taskId: '06', template: 'numeric-input', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-07', taskId: '07', template: 'sorting', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-08', taskId: '08', template: 'boundary-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-09', taskId: '09', template: 'error-analysis', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-10', taskId: '10', template: 'strategy-transfer', type: 'practice', scored: true, scope: 'final' },
];

const TASKS = [
  {
    id: '01', level: 'green', kind: 'mc', skillTag: 'inverse_choice_factor',
    visual: { type: 'record', text: 'x × 7 = 490' },
    setup: b(
      'Пост проверки не принимает решение без обратного действия.',
      "Tekshiruv posti teskari amalsiz yechimni qabul qilmaydi.",
      'The checkpoint does not accept a solution without the inverse action.',
    ),
    prompt: b(
      'Какое действие находит неизвестный множитель?',
      "Noma'lum ko'paytuvchini qaysi amal topadi?",
      'Which action finds the unknown factor?',
    ),
    options: [
      option('divide', '490 : 7', '490 : 7', '490 : 7', true),
      option('multiply', '490 × 7', '490 × 7', '490 × 7', false,
        'Умножение уводит дальше от корня: произведение уже известно.',
        "Ko'paytirish ildizdan uzoqlashtiradi: ko'paytma allaqachon ma'lum.",
        'Multiplying moves away from the root: the product is already known.'),
      option('subtract', '490 − 7', '490 − 7', '490 − 7', false,
        'Вычитание обратно сложению, а здесь действие умножение.',
        "Ayirish qo'shishga teskari, bu yerda esa amal ko'paytirish.",
        'Subtraction is the inverse of addition, but the action here is multiplication.'),
      option('reversed', '7 : 490', '7 : 490', '7 : 490', false,
        'Делят произведение на множитель, а не наоборот.',
        "Ko'paytma ko'paytuvchiga bo'linadi, teskarisiga emas.",
        'The product is divided by the factor, not the other way round.'),
    ],
    secondHint: b(
      'Обратное действие для умножения — деление.',
      "Ko'paytirishga teskari amal — bo'lish.",
      'The inverse action for multiplication is division.',
    ),
    thirdHint: b(
      'Известное произведение делят на известный множитель.',
      "Ma'lum ko'paytma ma'lum ko'paytuvchiga bo'linadi.",
      'The known product is divided by the known factor.',
    ),
    correctText: b(
      'Верно. x = 490 : 7 = 70, и проверка даёт 70 × 7 = 490.',
      "To'g'ri. x = 490 : 7 = 70, tekshiruv 70 × 7 = 490 beradi.",
      'Correct. x = 490 : 7 = 70, and the check gives 70 × 7 = 490.',
    ),
    rule: b(
      'Неизвестный множитель находят делением произведения на известный множитель.',
      "Noma'lum ko'paytuvchi ko'paytmani ma'lum ko'paytuvchiga bo'lish bilan topiladi.",
      'An unknown factor is found by dividing the product by the known factor.',
    ),
  },

  {
    id: '02', level: 'green', kind: 'numpad', skillTag: 'unknown_factor', answer: '90', maxLen: 3,
    visual: { type: 'record', text: 'x × 9 = 810' },
    setup: b(
      'Пост принял действие и ждёт число.',
      'Post amalni qabul qildi va sonni kutmoqda.',
      'The checkpoint has accepted the action and is waiting for the number.',
    ),
    prompt: b('Чему равен корень уравнения?', 'Tenglamaning ildizi nechaga teng?', 'What is the root of the equation?'),
    wrong: [b(
      'Здесь неизвестен множитель, поэтому произведение делят.',
      "Bu yerda ko'paytuvchi noma'lum, shuning uchun ko'paytma bo'linadi.",
      'A factor is unknown here, so the product is divided.',
    )],
    secondHint: b('810 нужно разделить на 9.', "810 ni 9 ga bo'lish kerak.", '810 has to be divided by 9.'),
    thirdHint: b('810 : 9 = 90.', '810 : 9 = 90.', '810 : 9 = 90.'),
    correctText: b(
      'Верно. x = 90, проверка: 90 × 9 = 810.',
      "To'g'ri. x = 90, tekshiruv: 90 × 9 = 810.",
      'Correct. x = 90, and the check gives 90 × 9 = 810.',
    ),
    rule: b(
      'Найденный корень возвращают в запись и сверяют две части.',
      'Topilgan ildiz yozuvga qaytariladi va ikki tomon solishtiriladi.',
      'The root that has been found is returned to the record and the two sides are compared.',
    ),
  },

  {
    id: '03', level: 'yellow', kind: 'order', skillTag: 'solve_and_check_order',
    visual: { type: 'record', text: 'x : 40 = 15' },
    setup: b(
      'Пост требует записать все шаги, включая проверку.',
      'Post barcha qadamlarni, tekshiruv bilan birga yozishni talab qiladi.',
      'The checkpoint requires all the steps, including the check.',
    ),
    prompt: b('Расставь шаги решения по порядку.', 'Yechish qadamlarini tartib bilan joylashtiring.', 'Put the solution steps in order.'),
    steps: [
      { id: 's1', label: b('Шаг 1', '1-qadam', 'Step 1') },
      { id: 's2', label: b('Шаг 2', '2-qadam', 'Step 2') },
      { id: 's3', label: b('Шаг 3', '3-qadam', 'Step 3') },
      { id: 's4', label: b('Шаг 4', '4-qadam', 'Step 4') },
    ],
    cards: [
      { id: 'name', text: b('Неизвестно делимое', "Bo'linuvchi noma'lum", 'The dividend is unknown'), order: 0 },
      { id: 'inverse', text: b('x = 15 × 40', 'x = 15 × 40', 'x = 15 × 40'), order: 1 },
      { id: 'value', text: b('x = 600', 'x = 600', 'x = 600'), order: 2 },
      { id: 'check', text: b('600 : 40 = 15', '600 : 40 = 15', '600 : 40 = 15'), order: 3 },
    ],
    wrong: [b(
      'Сначала называют неизвестное, потом действие, и только в конце проверка.',
      "Avval noma'lum nomlanadi, keyin amal, oxirida esa tekshiruv.",
      'First the unknown is named, then the action, and the check comes last.',
    )],
    secondHint: b(
      'Проверка стоит после того, как корень уже найден.',
      'Tekshiruv ildiz topilgandan keyin turadi.',
      'The check comes after the root has been found.',
    ),
    thirdHint: b(
      'Делимое равно частному, умноженному на делитель.',
      "Bo'linuvchi bo'linmani bo'luvchiga ko'paytirishga teng.",
      'The dividend equals the quotient multiplied by the divisor.',
    ),
    correctText: b(
      'Верно. Название, действие, корень, проверка.',
      "To'g'ri. Nom, amal, ildiz, tekshiruv.",
      'Correct. Name, action, root, check.',
    ),
    rule: b(
      'Решение не закончено, пока корень не подставлен в исходную запись.',
      'Ildiz dastlabki yozuvga qo\'yilmaguncha yechim tugamaydi.',
      'A solution is not finished until the root is substituted into the original record.',
    ),
  },

  {
    id: '04', level: 'yellow', kind: 'missing', skillTag: 'unknown_dividend', answer: '720', maxLen: 3,
    visual: { type: 'record', text: '□ : 60 = 12' },
    setup: b(
      'В записи потерялось делимое.',
      "Yozuvda bo'linuvchi tushib qolgan.",
      'The dividend is missing from the record.',
    ),
    prompt: b('Какое число пропущено?', 'Qaysi son tushib qolgan?', 'Which number is missing?'),
    wrong: [b(
      'Частное умножают на делитель, а не делят на него.',
      "Bo'linma bo'luvchiga ko'paytiriladi, unga bo'linmaydi.",
      'The quotient is multiplied by the divisor, not divided by it.',
    )],
    secondHint: b('12 нужно умножить на 60.', "12 ni 60 ga ko'paytirish kerak.", '12 has to be multiplied by 60.'),
    thirdHint: b('12 × 60 = 720.', '12 × 60 = 720.', '12 × 60 = 720.'),
    correctText: b(
      'Верно. 720 : 60 = 12.',
      "To'g'ri. 720 : 60 = 12.",
      'Correct. 720 : 60 = 12.',
    ),
    rule: b(
      'Неизвестное делимое находят умножением частного на делитель.',
      "Noma'lum bo'linuvchi bo'linmani bo'luvchiga ko'paytirish bilan topiladi.",
      'An unknown dividend is found by multiplying the quotient by the divisor.',
    ),
  },

  {
    id: '05', level: 'yellow', kind: 'slots', skillTag: 'substitution_check',
    visual: { type: 'record', text: '(9 600 − x) : 60 = 120' },
    setup: b(
      'Корень уравнения равен 2 400. Пост требует показать проверку.',
      "Tenglamaning ildizi 2 400 ga teng. Post tekshiruvni ko'rsatishni talab qiladi.",
      'The root of the equation is 2,400. The checkpoint asks to show the check.',
    ),
    prompt: b('Собери проверку из карточек.', 'Tekshiruvni kartalardan tuzing.', 'Build the check from the cards.'),
    slots: [
      {
        id: 'inner', label: b('В скобках получилось', 'Qavs ichida hosil bo\'ldi', 'Inside the brackets'), correct: 'seven-two',
        wrong: b(
          'В скобках из 9 600 вычитают корень, а не наоборот.',
          "Qavs ichida 9 600 dan ildiz ayiriladi, teskarisiga emas.",
          'Inside the brackets the root is subtracted from 9,600, not the other way round.',
        ),
      },
      {
        id: 'result', label: b('После деления', "Bo'lishdan keyin", 'After the division'), correct: 'one-twenty',
        wrong: b(
          'После деления должно получиться то, что стоит справа от знака равенства.',
          "Bo'lishdan keyin tenglik belgisining o'ng tomonidagi son chiqishi kerak.",
          'After the division the number to the right of the equals sign must appear.',
        ),
      },
    ],
    cards: [
      { id: 'seven-two', text: b('7 200', '7 200', '7,200') },
      { id: 'one-twenty', text: b('120', '120', '120') },
      { id: 'root', text: b('2 400', '2 400', '2,400') },
      { id: 'whole', text: b('9 600', '9 600', '9,600') },
      { id: 'divisor', text: b('60', '60', '60') },
      { id: 'wrong-quotient', text: b('160', '160', '160') },
    ],
    wrong: [b(
      'Проверку считают по действиям исходной записи: сначала скобки, потом деление.',
      'Tekshiruv dastlabki yozuvning amallari bo\'yicha hisoblanadi: avval qavs, keyin bo\'lish.',
      'The check follows the actions of the original record: brackets first, then the division.',
    )],
    secondHint: b(
      '9 600 − 2 400 — это то, что стоит в скобках.',
      "9 600 − 2 400 — bu qavs ichida turgan son.",
      '9,600 − 2,400 is what stands inside the brackets.',
    ),
    thirdHint: b(
      '9 600 − 2 400 = 7 200, затем 7 200 : 60 = 120.',
      "9 600 − 2 400 = 7 200, keyin 7 200 : 60 = 120.",
      '9,600 − 2,400 = 7,200, then 7,200 : 60 = 120.',
    ),
    correctText: b(
      'Верно. Обе части дали 120, значит корень подходит.',
      "To'g'ri. Ikki tomon ham 120 berdi, demak ildiz to'g'ri.",
      'Correct. Both sides gave 120, so the root fits.',
    ),
    rule: b(
      'Проверка удалась, если обе части записи дали одно число.',
      'Yozuvning ikki tomoni bir xil son bergan bo\'lsa, tekshiruv o\'tdi.',
      'A check succeeds when both sides of the record give the same number.',
    ),
  },

  {
    id: '06', level: 'yellow', kind: 'numpad', skillTag: 'compound_equation', answer: '1800', maxLen: 4,
    visual: { type: 'record', text: '(5 400 − x) : 90 = 40' },
    setup: b(
      'В этой записи два действия, и корень спрятан в скобках.',
      "Bu yozuvda ikki amal bor va ildiz qavs ichida yashiringan.",
      'This record has two actions and the root is hidden inside the brackets.',
    ),
    prompt: b('Чему равен x?', 'x nechaga teng?', 'What is x?'),
    wrong: [b(
      'Сначала находят, что стоит в скобках, и только потом сам корень.',
      "Avval qavs ichidagi son topiladi, keyin ildizning o'zi.",
      'First find what is inside the brackets, and only then the root itself.',
    )],
    secondHint: b(
      'Скобка равна 40 × 90.',
      "Qavs 40 × 90 ga teng.",
      'The bracket equals 40 × 90.',
    ),
    thirdHint: b(
      '40 × 90 = 3 600, затем 5 400 − 3 600 = 1 800.',
      "40 × 90 = 3 600, keyin 5 400 − 3 600 = 1 800.",
      '40 × 90 = 3,600, then 5,400 − 3,600 = 1,800.',
    ),
    correctText: b(
      'Верно. x = 1 800, проверка: (5 400 − 1 800) : 90 = 40.',
      "To'g'ri. x = 1 800, tekshiruv: (5 400 − 1 800) : 90 = 40.",
      'Correct. x = 1,800, and the check gives (5,400 − 1,800) : 90 = 40.',
    ),
    rule: b(
      'В составном уравнении сначала находят значение скобки.',
      'Murakkab tenglamada avval qavsning qiymati topiladi.',
      'In a compound equation the value of the bracket is found first.',
    ),
  },

  {
    id: '07', level: 'yellow', kind: 'sort', skillTag: 'inverse_by_position',
    setup: b(
      'Пост сортирует уравнения по нужному обратному действию.',
      'Post tenglamalarni kerakli teskari amal bo\'yicha saralaydi.',
      'The checkpoint sorts the equations by the inverse action they need.',
    ),
    prompt: b(
      'Разложи уравнения по действию, которым находят корень.',
      'Tenglamalarni ildiz topiladigan amal bo\'yicha guruhlarga joylashtiring.',
      'Sort the equations by the action that finds the root.',
    ),
    bins: [
      { id: 'multiply', label: b('Находим умножением', "Ko'paytirish bilan topamiz", 'Found by multiplying') },
      { id: 'divide', label: b('Находим делением', "Bo'lish bilan topamiz", 'Found by dividing') },
    ],
    items: [
      { id: 'div-6', bin: 'multiply', text: b('x : 6 = 70', 'x : 6 = 70', 'x : 6 = 70') },
      { id: 'div-12', bin: 'multiply', text: b('x : 12 = 40', 'x : 12 = 40', 'x : 12 = 40') },
      { id: 'div-30', bin: 'multiply', text: b('x : 30 = 20', 'x : 30 = 20', 'x : 30 = 20') },
      { id: 'mul-8', bin: 'divide', text: b('x × 8 = 560', 'x × 8 = 560', 'x × 8 = 560') },
      { id: 'mul-40', bin: 'divide', text: b('x × 40 = 800', 'x × 40 = 800', 'x × 40 = 800') },
      { id: 'mul-15', bin: 'divide', text: b('x × 15 = 300', 'x × 15 = 300', 'x × 15 = 300') },
    ],
    wrong: [b(
      'Смотри на действие в записи: корень находят обратным ему действием.',
      "Yozuvdagi amalga qarang: ildiz unga teskari amal bilan topiladi.",
      'Look at the action in the record: the root is found by the action inverse to it.',
    )],
    secondHint: b(
      'Если в записи деление, корень собирают умножением.',
      "Yozuvda bo'lish bo'lsa, ildiz ko'paytirish bilan yig'iladi.",
      'If the record has division, the root is put together by multiplying.',
    ),
    thirdHint: b(
      'Если в записи умножение, корень находят делением.',
      "Yozuvda ko'paytirish bo'lsa, ildiz bo'lish bilan topiladi.",
      'If the record has multiplication, the root is found by dividing.',
    ),
    correctText: b(
      'Верно. Действие в записи и действие решения всегда обратны.',
      'To\'g\'ri. Yozuvdagi amal va yechimdagi amal har doim teskari.',
      'Correct. The action in the record and the action of the solution are always inverse.',
    ),
    rule: b(
      'Действие решения выбирают по действию, которое стоит в записи.',
      'Yechim amali yozuvda turgan amalga qarab tanlanadi.',
      'The action of the solution is chosen from the action that stands in the record.',
    ),
  },

  {
    id: '08', level: 'red', kind: 'mc', skillTag: 'unit_factor_boundary',
    visual: { type: 'record', text: 'x × 1 = 640' },
    setup: b(
      'Множитель здесь равен единице, и это сбивает с толку.',
      "Bu yerda ko'paytuvchi birga teng va bu chalkashtiradi.",
      'The factor here equals one, and that is confusing.',
    ),
    prompt: b('Чему равен корень?', 'Ildiz nechaga teng?', 'What is the root?'),
    options: [
      option('root-640', 'x = 640', 'x = 640', 'x = 640', true),
      option('root-1', 'x = 1', 'x = 1', 'x = 1', false,
        'Единица — это известный множитель, а не корень.',
        "Bir — bu ma'lum ko'paytuvchi, ildiz emas.",
        'One is the known factor, not the root.'),
      option('root-0', 'x = 0', 'x = 0', 'x = 0', false,
        'Нуль дал бы произведение 0, а справа стоит 640.',
        "Nol 0 ko'paytma berardi, o'ngda esa 640 turadi.",
        'Zero would give a product of 0, but 640 stands on the right.'),
      option('root-641', 'x = 641', 'x = 641', 'x = 641', false,
        'Прибавление единицы здесь не нужно: действие умножение.',
        "Bu yerda birni qo'shish kerak emas: amal ko'paytirish.",
        'Adding one is not needed here: the action is multiplication.'),
    ],
    secondHint: b(
      'Правило то же: произведение делят на известный множитель.',
      "Qoida o'sha: ko'paytma ma'lum ko'paytuvchiga bo'linadi.",
      'The rule is the same: the product is divided by the known factor.',
    ),
    thirdHint: b('640 : 1 = 640.', '640 : 1 = 640.', '640 : 1 = 640.'),
    correctText: b(
      'Верно. Умножение на единицу не меняет числа, поэтому корень равен 640.',
      "To'g'ri. Birga ko'paytirish sonni o'zgartirmaydi, shuning uchun ildiz 640.",
      'Correct. Multiplying by one does not change a number, so the root is 640.',
    ),
    rule: b(
      'Единица в записи не отменяет обратного действия.',
      'Yozuvdagi bir teskari amalni bekor qilmaydi.',
      'A one in the record does not cancel the inverse action.',
    ),
  },

  {
    id: '09', level: 'red', kind: 'match', skillTag: 'solution_error',
    setup: b(
      'Пост вернул четыре решения, и в каждом свой сбой.',
      "Post to'rt yechimni qaytardi, har birida o'z nuqsoni bor.",
      'The checkpoint returned four solutions, each with its own fault.',
    ),
    prompt: b('Соедини каждое решение с названием ошибки.', 'Har yechimni xato nomiga ulang.', 'Match each solution to the name of the error.'),
    pairs: [
      {
        id: 'same-action',
        left: b('x × 6 = 540; x = 540 × 6', 'x × 6 = 540; x = 540 × 6', 'x × 6 = 540; x = 540 × 6'),
        correctRight: 'not-inverse',
      },
      {
        id: 'reversed',
        left: b('x : 8 = 40; x = 40 : 8', 'x : 8 = 40; x = 40 : 8', 'x : 8 = 40; x = 40 : 8'),
        correctRight: 'inverse-flipped',
      },
      {
        id: 'other-record',
        left: b('x × 5 = 300; x = 60; 60 × 6 = 360', 'x × 5 = 300; x = 60; 60 × 6 = 360', 'x × 5 = 300; x = 60; 60 × 6 = 360'),
        correctRight: 'wrong-check',
      },
      {
        id: 'bracket',
        left: b('(600 − x) : 5 = 100; 600 − x = 100 : 5', '(600 − x) : 5 = 100; 600 − x = 100 : 5', '(600 − x) : 5 = 100; 600 − x = 100 : 5'),
        correctRight: 'bracket-error',
      },
    ],
    right: [
      { id: 'not-inverse', text: b('Обратное действие не взято', 'Teskari amal olinmagan', 'The inverse action was not taken') },
      { id: 'inverse-flipped', text: b('Обратное действие перевёрнуто', 'Teskari amal teskari qo\'llangan', 'The inverse action is upside down') },
      { id: 'wrong-check', text: b('Проверка по другой записи', 'Tekshiruv boshqa yozuv bilan', 'The check uses a different record') },
      { id: 'bracket-error', text: b('Значение скобки найдено неверно', 'Qavs qiymati noto\'g\'ri topilgan', 'The value of the bracket is wrong') },
    ],
    wrong: [b(
      'Смотри по очереди: то ли действие, то ли его направление, то ли сама проверка.',
      "Navbat bilan qarang: amalmi, uning yo'nalishimi yoki tekshiruvning o'zimi.",
      'Look one thing at a time: the action, its direction, or the check itself.',
    )],
    secondHint: b(
      'В одном решении действие верное, но проверено другое уравнение.',
      "Bir yechimda amal to'g'ri, lekin boshqa tenglama tekshirilgan.",
      'In one solution the action is right but a different equation was checked.',
    ),
    thirdHint: b(
      'Значение скобки находят умножением частного на делитель.',
      "Qavs qiymati bo'linmani bo'luvchiga ko'paytirish bilan topiladi.",
      'The value of the bracket is found by multiplying the quotient by the divisor.',
    ),
    correctText: b(
      'Верно. Четыре сбоя разные: действие, направление, проверка и скобка.',
      "To'g'ri. To'rt nuqson boshqa-boshqa: amal, yo'nalish, tekshiruv va qavs.",
      'Correct. The four faults differ: action, direction, check and bracket.',
    ),
    rule: b(
      'Проверку делают по той записи, из которой начали.',
      'Tekshiruv boshlangan yozuv bo\'yicha bajariladi.',
      'The check is made against the record you started from.',
    ),
  },

  {
    id: '10', level: 'red', kind: 'sort', skillTag: 'check_verdict',
    setup: b(
      'На пост пришли шесть подстановок. Каждую нужно посчитать.',
      "Postga oltita qo'yish natijasi keldi. Har birini hisoblash kerak.",
      'Six substitutions have arrived at the checkpoint. Each one has to be calculated.',
    ),
    prompt: b(
      'Разложи записи по тому, верное равенство получилось или нет.',
      'Yozuvlarni tenglik to\'g\'ri chiqqan yoki chiqmaganiga qarab guruhlarga joylashtiring.',
      'Sort the records by whether the equality is true or not.',
    ),
    bins: [
      { id: 'true', label: b('Равенство верное', "Tenglik to'g'ri", 'The equality is true') },
      { id: 'false', label: b('Равенство неверное', "Tenglik noto'g'ri", 'The equality is false') },
    ],
    items: [
      { id: 'ok-90', bin: 'true', text: b('90 × 7 = 630', '90 × 7 = 630', '90 × 7 = 630') },
      { id: 'ok-800', bin: 'true', text: b('800 : 20 = 40', '800 : 20 = 40', '800 : 20 = 40') },
      { id: 'ok-700', bin: 'true', text: b('700 : 35 = 20', '700 : 35 = 20', '700 : 35 = 20') },
      { id: 'no-120', bin: 'false', text: b('120 × 4 = 460', '120 × 4 = 460', '120 × 4 = 460') },
      { id: 'no-50', bin: 'false', text: b('50 : 5 = 100', '50 : 5 = 100', '50 : 5 = 100') },
      { id: 'no-60', bin: 'false', text: b('60 × 9 = 560', '60 × 9 = 560', '60 × 9 = 560') },
    ],
    wrong: [b(
      'Считай левую часть каждой записи и сравнивай с правой.',
      'Har yozuvning chap tomonini hisoblab, o\'ng tomoni bilan solishtiring.',
      'Calculate the left side of each record and compare it with the right side.',
    )],
    secondHint: b(
      'Три записи дают ровно то число, что справа, а три — другое.',
      "Uch yozuv o'ngdagi sonni aynan beradi, uchtasi esa boshqa son beradi.",
      'Three records give exactly the number on the right, and three give a different one.',
    ),
    thirdHint: b(
      '120 × 4 = 480, 50 : 5 = 10, 60 × 9 = 540.',
      '120 × 4 = 480, 50 : 5 = 10, 60 × 9 = 540.',
      '120 × 4 = 480, 50 : 5 = 10, 60 × 9 = 540.',
    ),
    correctText: b(
      'Верно. Проверка — это счёт, а не взгляд на запись.',
      "To'g'ri. Tekshiruv — bu hisob, yozuvga qarab qo'yish emas.",
      'Correct. A check is a calculation, not a glance at the record.',
    ),
    rule: b(
      'Проверка засчитана только тогда, когда обе части посчитаны.',
      'Tekshiruv ikki tomon hisoblanganda qabul qilinadi.',
      'A check counts only when both sides have been calculated.',
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
  const [placed, setPlaced] = useState({});
  const [activeStep, setActiveStep] = useState(null);
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
  const orderCards = useMemo(() => shuffle(task.cards || []), [shuffleSeed, task.id, task.cards]);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- restart/task keys intentionally trigger a fresh shuffle
  const sortTokens = useMemo(() => shuffle(task.items || []), [shuffleSeed, task.id, task.items]);

  useEffect(() => {
    if (checked) window.setTimeout(() => feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 120);
  }, [checked]);

  const answerReady = (() => {
    if (task.kind === 'mc') return pickedId !== null;
    if (task.kind === 'numpad' || task.kind === 'missing') return typed.length > 0;
    if (task.kind === 'match') return task.pairs.every((pair) => pairs[pair.id]);
    if (task.kind === 'order') return task.steps.every((step) => placed[step.id]);
    if (task.kind === 'slots') return task.slots.every((slot) => filled[slot.id]);
    return task.items.every((item) => assignments[item.id]);
  })();

  const answerCorrect = () => {
    if (task.kind === 'mc') return task.options.find((item) => item.id === pickedId)?.correct === true;
    if (task.kind === 'numpad' || task.kind === 'missing') return typed === task.answer;
    if (task.kind === 'match') return task.pairs.every((pair) => pairs[pair.id] === pair.correctRight);
    if (task.kind === 'order') return task.cards.every((card) => placed[task.steps[card.order].id] === card.id);
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
    setPairs({}); setActiveLeft(null); setPlaced({}); setActiveStep(null);
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
    if (task.kind === 'order') return { order: task.steps.map((step) => placed[step.id]) };
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
    if (task.kind === 'order') return { order: task.cards.slice().sort((a, c) => a.order - c.order).map((card) => card.id) };
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
            {orderCards.map((card) => {
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

export default function Grade4Dars43Practice({ studentName, lang: langProp, onFinished }) {
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
      <style>{STYLES + PRACTICE_FIX_CSS}</style>
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
.p4-visual{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;width:100%;min-height:104px;padding:12px 10px;border-radius:16px;background:${T.paper};box-shadow:inset 0 0 0 1px rgba(23,59,82,.08);overflow:hidden}
.p4-record{text-align:center;font:800 clamp(19px,4.2vw,29px) 'JetBrains Mono',monospace;color:${T.navy}}
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
.p4-match-cols{display:grid;grid-template-columns:1.25fr 1fr;gap:10px;margin-top:7px}
.p4-match-col{display:grid;gap:8px;align-content:start}
.p4-match-item{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-width:44px;min-height:48px;padding:8px 9px;border:1px solid rgba(23,59,82,.12);border-radius:12px;background:${T.paper};color:${T.navy};font:700 clamp(12px,2vw,14px)/1.3 'Manrope',sans-serif;text-align:center;cursor:pointer}
.p4-match-item.is-record{font-family:'JetBrains Mono',monospace;font-size:clamp(11px,1.8vw,13px)}
.p4-match-item.is-active{border-color:${T.accent};background:${T.accentSoft}}
.p4-match-item.is-tied{border-color:rgba(34,122,83,.35)}
.p4-match-item.is-used{background:${T.successSoft};opacity:.65}
.p4-match-item:disabled{cursor:default}
.p4-match-item b{color:${T.success};font-size:11px;font-family:'Manrope',sans-serif}
.p4-slot-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin-top:7px}
.p4-slot{display:grid;place-items:center;gap:4px;min-width:44px;min-height:70px;padding:8px;border:1px solid rgba(23,59,82,.12);border-radius:13px;background:${T.paper};color:${T.ink2};font-family:inherit;cursor:pointer}
.p4-slot.is-active{border-color:${T.accent};background:${T.accentSoft}}
.p4-slot.is-no{border-color:${T.warn};background:${T.warnSoft}}
.p4-slot small{font-weight:800;font-size:11px}
.p4-slot b{font:800 15px/1.25 'JetBrains Mono',monospace;color:${T.navy}}
.p4-order-slots{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin-top:7px}
.p4-order-slot{display:grid;place-items:center;gap:4px;min-width:44px;min-height:74px;padding:7px;border:1px solid rgba(23,59,82,.12);border-radius:13px;background:${T.paper};color:${T.ink2};font-family:inherit;cursor:pointer}
.p4-order-slot.is-active{border-color:${T.accent};background:${T.accentSoft}}
.p4-order-slot small{font-weight:800}
.p4-order-slot b{font:700 11px/1.25 'Manrope',sans-serif;color:${T.navy}}
.p4-card-bank{display:flex;flex-wrap:wrap;justify-content:center;gap:7px;margin-top:8px}
.p4-card{min-width:44px;min-height:46px;padding:8px 11px;border:1px solid rgba(23,59,82,.12);border-radius:12px;background:${T.paper};color:${T.navy};font:700 13px/1.3 'JetBrains Mono',monospace;cursor:pointer}
.p4-card.is-used{background:${T.cyanSoft};opacity:.7}
.p4-sort{display:flex;flex-direction:column;gap:10px}
.p4-sort-pool{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:8px;min-height:60px;padding:8px;border-radius:14px;background:${T.paper};box-shadow:inset 0 0 0 1px rgba(23,59,82,.08)}
.p4-pool-done{color:${T.success};font-size:26px}
.p4-sort-token{min-width:44px;min-height:44px;padding:6px 10px;border:1px solid rgba(23,59,82,.14);border-radius:12px;background:${T.paper};color:${T.navy};font:800 13px/1.25 'JetBrains Mono',monospace;cursor:pointer}
.p4-sort-token.is-active{border-color:${T.accent};background:${T.accentSoft};transform:translateY(-2px)}
.p4-sort-token.is-no{border-color:${T.warn};background:${T.warnSoft}}
.p4-sort-bins{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
.p4-sort-bin{min-height:110px;padding:8px;border-radius:14px;background:${T.paper};box-shadow:inset 0 0 0 1px rgba(23,59,82,.08)}
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
  .p4-order-slots{grid-template-columns:repeat(2,minmax(0,1fr))}
  .p4-order-slot{min-height:60px;padding:6px}
  .p4-match-cols{grid-template-columns:1fr 1fr}
  .p4-slot-list{grid-template-columns:1fr}
  .p4-slot{min-height:60px;padding:6px}
  .p4-sort-bins{grid-template-columns:1fr;gap:6px}
  .p4-sort-bin{display:flex;align-items:center;gap:8px;min-height:56px;padding:6px}
  .p4-sort-bin-head{flex:0 0 34%;min-height:44px;padding:6px 4px;font-size:11px}
  .p4-sort-bin-items{flex:1;justify-content:flex-start;padding-top:0}
  .p4-sort-pool{min-height:56px;gap:6px}
  .p4-main{padding:4px 8px}
  .p4-head{padding:64px 8px 6px}
  .p4-visual{padding:10px 6px;min-height:96px}
  .p4-task{gap:8px}
}
@media(max-width:640px) and (max-height:700px){
  .p4-head{padding:64px 8px 3px!important}
  .p4-task{gap:6px!important}
  .p4-setup{font-size:12.5px;line-height:1.35}
  .p4-ask{font-size:16px!important}
  .p4-visual{min-height:78px!important;padding:8px 6px!important}
  .p4-option{min-height:46px!important;padding:6px 8px!important;font-size:12px!important}
  .p4-btn{min-height:44px!important;padding:8px 16px}
  .p4-feedback{padding:9px 11px}
}
@media(prefers-reduced-motion:reduce){
  .p4-root *,.p4-root *::before,.p4-root *::after{scroll-behavior:auto!important;animation:none!important;transition:none!important}
}
`;
