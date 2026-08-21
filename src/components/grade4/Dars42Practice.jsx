// ============================================================================
// 4-SINF · 42-DARS AMALIYOTI · TENGLAMALAR
// 10 topshiriq · UZ/RU/EN · ovozsiz · solve-to-advance.
//
// Skelet: src/books/grade4/AMALIYOT_41_51_SKELET.md §5.
// Mexanika raskladkasi: scripts/grade4-practice-41-51-layout.mjs
//   match · missing · numpad · slots · missing · match · slots · sort · order · numpad
//
// NEGA BITTA FAYL VA NEGA INFRATUZILMA ICHKARIDA. LMS darsni bitta avtonom
// .jsx sifatida qabul qiladi: lokal import ko'tarilmaydi. Shuning uchun
// CLAUDE.md §5 dan ongli chekinish — mexanika komponentlari shu faylda.
//
// NAZARIYADAN FARQ. Nazariy dars x + 240 = 360, x - 240 = 510,
// x + 1425 = 4907, x - 2400 = 5100, x + 837 = 1562 va 837 - x = 1562
// yozuvlarini ishlatgan; bu yerda boshqa sonlar.
//
// MODEL: butun-qism lentasi. Segmentlar TENG kenglikda — noma'lum qismning
// haqiqiy ulushini ko'rsatish javobni ochib berardi. Lenta faqat tuzilmani
// beradi: nima butun, nima qism.
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

// `option()` yordamchisi bu darsda yo'q: raskladka 42-darsga variant tanlash
// mexanikasini bermaydi, hamma topshiriq boshqa mexanikada ishlaydi.
const b = (ru, uz, en) => ({ ru, uz, en });
const SUPPORTED_LANGS = ['uz', 'ru', 'en'];
const normalizeLang = (value) => (SUPPORTED_LANGS.includes(value) ? value : 'uz');
const tx = (value, lang) => (value && typeof value === 'object' && !Array.isArray(value) ? value[normalizeLang(lang)] ?? '' : value);

const UI = {
  title: b('Урок 42. Практика: уравнения', '42-dars. Amaliyot: tenglamalar', 'Lesson 42. Practice: equations'),
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
  whole: b('целое', 'butun', 'whole'),
  parts: b('части', 'qismlar', 'parts'),
  returnCard: b('Вернуть карточку', 'Kartani qaytarish', 'Return the card'),
};

const LESSON_META = {
  lessonId: 'eq-4-42-practice',
  lessonTitle: UI.title,
  grade: 4,
  lessonNumber: 42,
  activityType: 'practice',
  taskCount: 10,
  resultIsUiState: true,
  progression: { green: 2, yellow: 5, red: 3 },
};

const SCREEN_META = [
  { id: 'practice-01', taskId: '01', template: 'matching', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-02', taskId: '02', template: 'numeric-blank', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-03', taskId: '03', template: 'numeric-input', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-04', taskId: '04', template: 'equation-build', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-05', taskId: '05', template: 'numeric-blank', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-06', taskId: '06', template: 'word-problem', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-07', taskId: '07', template: 'classification', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-08', taskId: '08', template: 'boundary-sorting', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-09', taskId: '09', template: 'error-analysis', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-10', taskId: '10', template: 'strategy-transfer', type: 'practice', scored: true, scope: 'final' },
];

const TASKS = [
  {
    id: '01', level: 'green', kind: 'match', skillTag: 'equation_meaning',
    // Sonlar bir xil, rollar boshqa: bola tuzilmaga qarab ajratishi kerak.
    setup: b(
      'В четырёх записях одни и те же числа, но неизвестное стоит в разных местах.',
      "To'rt yozuvda sonlar bir xil, lekin noma'lum turli o'rinlarda turadi.",
      'Four records use the same numbers, but the unknown stands in different places.',
    ),
    prompt: b(
      'Соедини каждую запись с тем, что в ней неизвестно.',
      "Har yozuvni undagi noma'lum bilan ulang.",
      'Match each record to what is unknown in it.',
    ),
    pairs: [
      { id: 'addend', left: b('x + 350 = 700', 'x + 350 = 700', 'x + 350 = 700'), correctRight: 'unknown-addend' },
      { id: 'minuend', left: b('x − 350 = 700', 'x − 350 = 700', 'x − 350 = 700'), correctRight: 'unknown-minuend' },
      { id: 'subtrahend', left: b('700 − x = 350', '700 − x = 350', '700 − x = 350'), correctRight: 'unknown-subtrahend' },
      { id: 'plain', left: b('350 + 700 = 1050', '350 + 700 = 1050', '350 + 700 = 1050'), correctRight: 'not-equation' },
    ],
    right: [
      { id: 'unknown-addend', text: b('Неизвестное слагаемое', "Noma'lum qo'shiluvchi", 'Unknown addend') },
      { id: 'unknown-minuend', text: b('Неизвестное уменьшаемое', "Noma'lum kamayuvchi", 'Unknown minuend') },
      { id: 'unknown-subtrahend', text: b('Неизвестное вычитаемое', "Noma'lum ayriluvchi", 'Unknown subtrahend') },
      { id: 'not-equation', text: b('Это не уравнение', 'Bu tenglama emas', 'This is not an equation') },
    ],
    wrong: [b(
      'Посмотри, на каком месте стоит буква: до знака действия, после него или после знака равенства.',
      "Harf qaysi o'rinda turganiga qarang: amal belgisidan oldinmi, keyinmi yoki tenglik belgisidan keyinmi.",
      'Look at where the letter stands: before the operation sign, after it, or after the equals sign.',
    )],
    secondHint: b(
      'Уравнение — это запись с буквой. Если буквы нет, это просто верное равенство.',
      "Tenglama — harf qatnashgan yozuv. Harf bo'lmasa, bu shunchaki to'g'ri tenglik.",
      'An equation is a record with a letter. With no letter it is simply a true equality.',
    ),
    thirdHint: b(
      'В вычитании первое число — уменьшаемое, второе — вычитаемое.',
      'Ayirishda birinchi son kamayuvchi, ikkinchisi ayriluvchi bo\'ladi.',
      'In subtraction the first number is the minuend and the second is the subtrahend.',
    ),
    correctText: b(
      'Верно. Одни и те же числа дают четыре разные записи.',
      "To'g'ri. Bir xil sonlar to'rt xil yozuv beradi.",
      'Correct. The same numbers give four different records.',
    ),
    rule: b(
      'Название неизвестного зависит от его места в записи.',
      "Noma'lumning nomi uning yozuvdagi o'rniga bog'liq.",
      'The name of the unknown depends on its place in the record.',
    ),
  },

  {
    id: '02', level: 'green', kind: 'missing', skillTag: 'unknown_addend', answer: '280', maxLen: 3,
    visual: { type: 'bar', whole: '540', parts: ['x', '260'] },
    setup: b(
      'Целое равно 540, известная часть — 260.',
      "Butun 540 ga teng, ma'lum qism 260.",
      'The whole is 540 and the known part is 260.',
    ),
    prompt: b(
      'Чему равен x в записи x + 260 = 540?',
      "x + 260 = 540 yozuvida x nechaga teng?",
      'What is x in the record x + 260 = 540?',
    ),
    wrong: [b(
      'Неизвестное слагаемое находят вычитанием: из целого убирают известную часть.',
      "Noma'lum qo'shiluvchi ayirish bilan topiladi: butundan ma'lum qism olib tashlanadi.",
      'An unknown addend is found by subtraction: the known part is taken from the whole.',
    )],
    secondHint: b(
      'На модели видно: часть плюс часть равно 540.',
      "Modelda ko'rinadi: qism qo'shuv qism 540 ga teng.",
      'The model shows it: part plus part equals 540.',
    ),
    thirdHint: b('540 − 260 = 280.', '540 − 260 = 280.', '540 − 260 = 280.'),
    correctText: b(
      'Верно. x = 540 − 260 = 280, и проверка даёт 280 + 260 = 540.',
      "To'g'ri. x = 540 − 260 = 280, tekshiruv 280 + 260 = 540 beradi.",
      'Correct. x = 540 − 260 = 280, and the check gives 280 + 260 = 540.',
    ),
    rule: b(
      'Чтобы найти неизвестное слагаемое, из суммы вычитают известное слагаемое.',
      "Noma'lum qo'shiluvchini topish uchun yig'indidan ma'lum qo'shiluvchi ayiriladi.",
      'To find an unknown addend, subtract the known addend from the sum.',
    ),
  },

  {
    id: '03', level: 'yellow', kind: 'numpad', skillTag: 'unknown_minuend', answer: '850', maxLen: 3,
    visual: { type: 'bar', whole: 'x', parts: ['370', '480'] },
    setup: b(
      'Со склада отправили 370 панелей, и осталось 480.',
      "Ombordan 370 panel jo'natildi va 480 tasi qoldi.",
      '370 panels were sent from the warehouse and 480 were left.',
    ),
    prompt: b(
      'Чему равен x в записи x − 370 = 480?',
      'x − 370 = 480 yozuvida x nechaga teng?',
      'What is x in the record x − 370 = 480?',
    ),
    wrong: [b(
      'Здесь неизвестно целое, а не часть. Обе части известны.',
      "Bu yerda qism emas, butun noma'lum. Ikkala qism ma'lum.",
      'Here the whole is unknown, not a part. Both parts are known.',
    )],
    secondHint: b(
      'На модели целое стоит сверху и пока неизвестно: его собирают из двух частей.',
      "Modelda butun yuqorida turadi va hozircha noma'lum: u ikki qismdan yig'iladi.",
      'On the model the whole is above and still unknown: it is made from the two parts.',
    ),
    thirdHint: b('480 + 370 = 850.', '480 + 370 = 850.', '480 + 370 = 850.'),
    correctText: b(
      'Верно. x = 480 + 370 = 850, и проверка даёт 850 − 370 = 480.',
      "To'g'ri. x = 480 + 370 = 850, tekshiruv 850 − 370 = 480 beradi.",
      'Correct. x = 480 + 370 = 850, and the check gives 850 − 370 = 480.',
    ),
    rule: b(
      'Чтобы найти неизвестное уменьшаемое, к разности прибавляют вычитаемое.',
      "Noma'lum kamayuvchini topish uchun ayirmaga ayriluvchi qo'shiladi.",
      'To find an unknown minuend, add the subtrahend to the difference.',
    ),
  },

  {
    id: '04', level: 'yellow', kind: 'slots', skillTag: 'word_to_equation',
    visual: { type: 'bar', whole: 'x', parts: ['180', '465'] },
    setup: b(
      'На складе было x панелей. Отправили 180, и осталось 465.',
      "Omborda x panel bor edi. 180 tasi jo'natildi va 465 tasi qoldi.",
      'The warehouse had x panels. 180 were sent and 465 were left.',
    ),
    prompt: b(
      'Составь уравнение по условию.',
      'Shart bo\'yicha tenglama tuzing.',
      'Build the equation from the story.',
    ),
    slots: [
      {
        id: 'left', label: b('Левая часть', 'Chap tomon', 'Left side'), correct: 'x-minus-180',
        wrong: b(
          'В левой части записывают действие со склада: из неизвестного целого убирают отправленные панели.',
          "Chap tomonda ombordagi amal yoziladi: noma'lum butundan jo'natilgan panellar olib tashlanadi.",
          'The left side records the action at the warehouse: the panels sent are taken from the unknown whole.',
        ),
      },
      {
        id: 'right', label: b('Правая часть', "O'ng tomon", 'Right side'), correct: 'four-six-five',
        wrong: b(
          'В правой части стоит то, что получилось после действия, а не ответ уравнения.',
          "O'ng tomonda amaldan keyin hosil bo'lgan son turadi, tenglamaning javobi emas.",
          'The right side holds what remains after the action, not the answer to the equation.',
        ),
      },
    ],
    cards: [
      { id: 'x-minus-180', text: b('x − 180', 'x − 180', 'x − 180') },
      { id: 'four-six-five', text: b('465', '465', '465') },
      { id: 'x-plus-180', text: b('x + 180', 'x + 180', 'x + 180') },
      { id: '180-minus-x', text: b('180 − x', '180 − x', '180 − x') },
      { id: 'six-four-five', text: b('645', '645', '645') },
      { id: 'two-eight-five', text: b('285', '285', '285') },
    ],
    wrong: [b(
      'Сначала реши, что здесь целое, а что часть, и только потом выбирай карточки.',
      "Avval bu yerda nima butun, nima qism ekanini aniqlang, keyin kartalarni tanlang.",
      'First decide what is the whole and what is a part, and only then choose the cards.',
    )],
    secondHint: b(
      'Неизвестное здесь — то, что было на складе сначала.',
      "Bu yerda noma'lum — omborda boshida bo'lgan miqdor.",
      'The unknown here is what was in the warehouse at the start.',
    ),
    thirdHint: b(
      '645 — это уже корень уравнения, а не часть записи.',
      '645 — bu tenglamaning ildizi, yozuvning qismi emas.',
      '645 is already the root of the equation, not a part of the record.',
    ),
    correctText: b(
      'Верно. x − 180 = 465, поэтому x = 465 + 180 = 645.',
      "To'g'ri. x − 180 = 465, shuning uchun x = 465 + 180 = 645.",
      'Correct. x − 180 = 465, so x = 465 + 180 = 645.',
    ),
    rule: b(
      'Уравнение записывает действие из условия, а не его ответ.',
      "Tenglama shartdagi amalni yozadi, uning javobini emas.",
      'An equation records the action from the story, not its answer.',
    ),
  },

  {
    id: '05', level: 'yellow', kind: 'missing', skillTag: 'missing_addend', answer: '655', maxLen: 3,
    visual: { type: 'bar', whole: '900', parts: ['□', '245'] },
    setup: b(
      'Неизвестное здесь стоит справа от знака равенства.',
      "Bu yerda noma'lum tenglik belgisidan o'ngda turadi.",
      'Here the unknown stands to the right of the equals sign.',
    ),
    prompt: b(
      'Какое число пропущено в записи 900 = □ + 245?',
      '900 = □ + 245 yozuvida qaysi son tushib qolgan?',
      'Which number is missing in the record 900 = □ + 245?',
    ),
    wrong: [b(
      'Место записи не меняет правила: неизвестную часть находят вычитанием из целого.',
      "Yozuvning o'rni qoidani o'zgartirmaydi: noma'lum qism butundan ayirish bilan topiladi.",
      'The side of the record does not change the rule: an unknown part is found by subtracting from the whole.',
    )],
    secondHint: b(
      'Целое здесь 900, известная часть 245.',
      "Bu yerda butun 900, ma'lum qism 245.",
      'The whole here is 900 and the known part is 245.',
    ),
    thirdHint: b('900 − 245 = 655.', '900 − 245 = 655.', '900 − 245 = 655.'),
    correctText: b(
      'Верно. 900 = 655 + 245.',
      "To'g'ri. 900 = 655 + 245.",
      'Correct. 900 = 655 + 245.',
    ),
    rule: b(
      'Неизвестное может стоять с любой стороны знака равенства.',
      "Noma'lum tenglik belgisining har ikki tomonida turishi mumkin.",
      'The unknown may stand on either side of the equals sign.',
    ),
  },

  {
    id: '06', level: 'yellow', kind: 'match', skillTag: 'problem_to_equation',
    setup: b(
      'Четыре сообщения со склада, и в каждом своё действие.',
      "Ombordan to'rt xabar keldi, har birida o'z amali bor.",
      'Four messages from the warehouse, each with its own action.',
    ),
    prompt: b(
      'Соедини каждое условие с его уравнением.',
      'Har shartni o\'z tenglamasi bilan ulang.',
      'Match each story to its equation.',
    ),
    pairs: [
      {
        id: 'added',
        left: b('Привезли 120 панелей, стало 500', "120 panel keltirildi, jami 500 bo'ldi", '120 panels arrived and the total became 500'),
        correctRight: 'plus-120',
      },
      {
        id: 'sent',
        left: b('Отправили 120 панелей, осталось 500', "120 panel jo'natildi, 500 tasi qoldi", '120 panels were sent and 500 were left'),
        correctRight: 'minus-120',
      },
      {
        id: 'part-sent',
        left: b('Было 500, часть отправили, осталось 120', "500 ta bor edi, bir qismi jo'natildi, 120 tasi qoldi", 'There were 500, a part was sent and 120 were left'),
        correctRight: 'five-hundred-minus',
      },
      {
        id: 'more-came',
        left: b('Было 500, привезли ещё, стало 620', "500 ta bor edi, yana keltirildi, 620 bo'ldi", 'There were 500, more arrived and it became 620'),
        correctRight: 'five-hundred-plus',
      },
    ],
    right: [
      { id: 'plus-120', text: b('x + 120 = 500', 'x + 120 = 500', 'x + 120 = 500') },
      { id: 'minus-120', text: b('x − 120 = 500', 'x − 120 = 500', 'x − 120 = 500') },
      { id: 'five-hundred-minus', text: b('500 − x = 120', '500 − x = 120', '500 − x = 120') },
      { id: 'five-hundred-plus', text: b('500 + x = 620', '500 + x = 620', '500 + x = 620') },
    ],
    wrong: [b(
      'Слово «осталось» не всегда значит вычитание из неизвестного: посмотри, какое число неизвестно.',
      "«Qoldi» so'zi har doim noma'lumdan ayirish degani emas: qaysi son noma'lum ekaniga qarang.",
      'The word left does not always mean subtracting from the unknown: look at which number is unknown.',
    )],
    secondHint: b(
      'В двух условиях неизвестно начальное количество, в двух других — изменение.',
      "Ikki shartda boshlang'ich miqdor noma'lum, boshqa ikkitasida o'zgarish noma'lum.",
      'In two stories the starting amount is unknown; in the other two the change is unknown.',
    ),
    thirdHint: b(
      'Если начальное количество известно, буква стоит на месте изменения.',
      "Boshlang'ich miqdor ma'lum bo'lsa, harf o'zgarish o'rnida turadi.",
      'If the starting amount is known, the letter stands where the change is.',
    ),
    correctText: b(
      'Верно. Место буквы задаётся тем, что именно неизвестно в условии.',
      "To'g'ri. Harfning o'rni shartda aynan nima noma'lum ekaniga qarab belgilanadi.",
      'Correct. The place of the letter is set by what exactly is unknown in the story.',
    ),
    rule: b(
      'Уравнение составляют после того, как названо неизвестное.',
      "Tenglama noma'lum nomlangandan keyin tuziladi.",
      'An equation is built after the unknown has been named.',
    ),
  },

  {
    id: '07', level: 'yellow', kind: 'slots', skillTag: 'record_classification',
    setup: b(
      'Четыре записи нужно разложить по названиям.',
      "To'rt yozuvni nomlari bo'yicha joylashtirish kerak.",
      'Four records have to be placed under their names.',
    ),
    prompt: b(
      'Поставь каждую запись на своё место.',
      'Har yozuvni o\'z joyiga qo\'ying.',
      'Put each record in its place.',
    ),
    slots: [
      {
        id: 'equation', label: b('Уравнение', 'Tenglama', 'Equation'), correct: 'eq',
        wrong: b(
          'В уравнении есть и буква, и знак равенства.',
          'Tenglamada harf ham, tenglik belgisi ham bor.',
          'An equation has both a letter and an equals sign.',
        ),
      },
      {
        id: 'expression', label: b('Выражение', 'Ifoda', 'Expression'), correct: 'expr',
        wrong: b(
          'В выражении знака равенства нет: его можно только вычислить.',
          "Ifodada tenglik belgisi yo'q: uni faqat hisoblash mumkin.",
          'An expression has no equals sign: it can only be evaluated.',
        ),
      },
      {
        id: 'equality', label: b('Равенство', 'Tenglik', 'Equality'), correct: 'eqty',
        wrong: b(
          'В равенстве буквы нет, там только числа по обе стороны знака.',
          "Tenglikda harf yo'q, belgining ikki tomonida faqat sonlar turadi.",
          'An equality has no letter: there are only numbers on both sides of the sign.',
        ),
      },
      {
        id: 'comparison', label: b('Сравнение', 'Taqqoslash', 'Comparison'), correct: 'cmp',
        wrong: b(
          'В сравнении вместо знака равенства стоит знак «больше» или «меньше».',
          "Taqqoslashda tenglik belgisi o'rniga «katta» yoki «kichik» belgisi turadi.",
          'In a comparison the equals sign is replaced by a greater-than or less-than sign.',
        ),
      },
    ],
    cards: [
      { id: 'eq', text: b('x + 90 = 300', 'x + 90 = 300', 'x + 90 = 300') },
      { id: 'expr', text: b('x + 90', 'x + 90', 'x + 90') },
      { id: 'eqty', text: b('210 + 90 = 300', '210 + 90 = 300', '210 + 90 = 300') },
      { id: 'cmp', text: b('x + 90 > 300', 'x + 90 > 300', 'x + 90 > 300') },
    ],
    wrong: [b(
      'Проверь два признака: есть ли буква и какой знак стоит между частями.',
      "Ikki belgiga qarang: harf bormi va qismlar orasida qanday belgi turadi.",
      'Check two features: whether there is a letter, and which sign stands between the parts.',
    )],
    secondHint: b(
      'Буква есть в трёх записях из четырёх.',
      "Harf to'rt yozuvdan uchtasida bor.",
      'A letter appears in three of the four records.',
    ),
    thirdHint: b(
      'Уравнение решают, равенство проверяют, выражение вычисляют.',
      'Tenglama yechiladi, tenglik tekshiriladi, ifoda hisoblanadi.',
      'An equation is solved, an equality is checked, an expression is evaluated.',
    ),
    correctText: b(
      'Верно. Буква и знак между частями и определяют название записи.',
      "To'g'ri. Harf va qismlar orasidagi belgi yozuvning nomini belgilaydi.",
      'Correct. The letter and the sign between the parts decide the name of the record.',
    ),
    rule: b(
      'Уравнение — это запись с буквой и знаком равенства.',
      "Tenglama — harf va tenglik belgisi bo'lgan yozuv.",
      'An equation is a record with a letter and an equals sign.',
    ),
  },

  {
    id: '08', level: 'red', kind: 'sort', skillTag: 'zero_boundary',
    setup: b(
      'В этих уравнениях участвует нуль, и корень получается разным.',
      "Bu tenglamalarda nol qatnashadi va ildiz turlicha chiqadi.",
      'These equations involve zero, and the root comes out differently.',
    ),
    prompt: b(
      'Разложи уравнения по значению корня.',
      'Tenglamalarni ildizining qiymatiga qarab guruhlarga joylashtiring.',
      'Sort the equations by the value of their root.',
    ),
    bins: [
      { id: 'four-eighty', label: b('Корень 480', 'Ildiz 480', 'Root 480') },
      { id: 'zero', label: b('Корень 0', 'Ildiz 0', 'Root 0') },
    ],
    items: [
      { id: 'plus-zero', bin: 'four-eighty', text: b('x + 0 = 480', 'x + 0 = 480', 'x + 0 = 480') },
      { id: 'minus-480', bin: 'four-eighty', text: b('x − 480 = 0', 'x − 480 = 0', 'x − 480 = 0') },
      { id: 'zero-plus', bin: 'four-eighty', text: b('0 + x = 480', '0 + x = 480', '0 + x = 480') },
      { id: 'plus-480', bin: 'zero', text: b('x + 480 = 480', 'x + 480 = 480', 'x + 480 = 480') },
      { id: '480-minus', bin: 'zero', text: b('480 − x = 480', '480 − x = 480', '480 − x = 480') },
      { id: 'minus-zero', bin: 'zero', text: b('x − 0 = 0', 'x − 0 = 0', 'x − 0 = 0') },
    ],
    wrong: [b(
      'Нуль не отменяет правило: решай каждое уравнение обычным обратным действием.',
      "Nol qoidani bekor qilmaydi: har tenglamani oddiy teskari amal bilan yeching.",
      'Zero does not cancel the rule: solve each equation with the usual inverse action.',
    )],
    secondHint: b(
      'Прибавление нуля и вычитание нуля не меняют число.',
      "Nolni qo'shish va nolni ayirish sonni o'zgartirmaydi.",
      'Adding zero and subtracting zero do not change a number.',
    ),
    thirdHint: b(
      'Если после действия число не изменилось, изменение равно нулю.',
      "Amaldan keyin son o'zgarmagan bo'lsa, o'zgarish nolga teng.",
      'If a number has not changed after the action, the change equals zero.',
    ),
    correctText: b(
      'Верно. Корень зависит не от нуля в записи, а от места неизвестного.',
      "To'g'ri. Ildiz yozuvdagi nolga emas, noma'lumning o'rniga bog'liq.",
      'Correct. The root depends not on the zero in the record but on the place of the unknown.',
    ),
    rule: b(
      'Нуль в записи не отменяет обратного действия.',
      'Yozuvdagi nol teskari amalni bekor qilmaydi.',
      'A zero in the record does not cancel the inverse action.',
    ),
  },

  {
    id: '09', level: 'red', kind: 'order', skillTag: 'inverse_error',
    visual: { type: 'record', text: 'x = 190 − 260', error: true },
    setup: b(
      'Для уравнения x − 260 = 190 Bit записал x = 190 − 260 и не смог посчитать.',
      "x − 260 = 190 tenglamasi uchun Bit x = 190 − 260 deb yozdi va hisoblab bo'lmadi.",
      'For the equation x − 260 = 190 Bit wrote x = 190 − 260 and could not calculate it.',
    ),
    prompt: b(
      'Восстанови правильное решение по шагам.',
      'To\'g\'ri yechimni qadamlab tiklang.',
      'Rebuild the correct solution step by step.',
    ),
    steps: [
      { id: 's1', label: b('Шаг 1', '1-qadam', 'Step 1') },
      { id: 's2', label: b('Шаг 2', '2-qadam', 'Step 2') },
      { id: 's3', label: b('Шаг 3', '3-qadam', 'Step 3') },
      { id: 's4', label: b('Шаг 4', '4-qadam', 'Step 4') },
    ],
    cards: [
      { id: 'name', text: b('Неизвестно уменьшаемое', "Kamayuvchi noma'lum", 'The minuend is unknown'), order: 0 },
      { id: 'inverse', text: b('x = 190 + 260', 'x = 190 + 260', 'x = 190 + 260'), order: 1 },
      { id: 'value', text: b('x = 450', 'x = 450', 'x = 450'), order: 2 },
      { id: 'check', text: b('450 − 260 = 190', '450 − 260 = 190', '450 − 260 = 190'), order: 3 },
    ],
    wrong: [b(
      'Сначала называют, что неизвестно, и только потом выбирают действие.',
      "Avval nima noma'lum ekani aytiladi, keyin amal tanlanadi.",
      'First name what is unknown, and only then choose the action.',
    )],
    secondHint: b(
      'Уменьшаемое — это целое, поэтому его собирают, а не убавляют.',
      "Kamayuvchi — bu butun, shuning uchun u yig'iladi, kamaytirilmaydi.",
      'The minuend is the whole, so it is put together, not reduced.',
    ),
    thirdHint: b(
      'Последний шаг — подстановка: найденное число возвращают в исходную запись.',
      "Oxirgi qadam — qo'yib tekshirish: topilgan son dastlabki yozuvga qaytariladi.",
      'The last step is substitution: the found number is put back into the original record.',
    ),
    correctText: b(
      'Верно. Ошибка была в действии: вместо вычитания нужно сложение.',
      "To'g'ri. Xato amalda edi: ayirish o'rniga qo'shish kerak.",
      'Correct. The error was in the action: addition is needed instead of subtraction.',
    ),
    rule: b(
      'Действие выбирают после того, как названо неизвестное.',
      "Amal noma'lum nomlangandan keyin tanlanadi.",
      'The action is chosen after the unknown has been named.',
    ),
  },

  {
    id: '10', level: 'red', kind: 'numpad', skillTag: 'unknown_subtrahend', answer: '360', maxLen: 4,
    visual: { type: 'bar', whole: '1 040', parts: ['x', '680'] },
    setup: b(
      'На складе было 1 040 панелей, часть отправили, и осталось 680.',
      "Omborda 1 040 panel bor edi, bir qismi jo'natildi va 680 tasi qoldi.",
      'The warehouse had 1,040 panels, a part was sent and 680 were left.',
    ),
    prompt: b(
      'Чему равен x в записи 1 040 − x = 680?',
      '1 040 − x = 680 yozuvida x nechaga teng?',
      'What is x in the record 1,040 − x = 680?',
    ),
    wrong: [b(
      'Здесь неизвестна часть, а целое известно: 1 040 стоит перед знаком действия.',
      "Bu yerda qism noma'lum, butun esa ma'lum: 1 040 amal belgisidan oldin turadi.",
      'Here a part is unknown while the whole is known: 1,040 stands before the operation sign.',
    )],
    secondHint: b(
      'Из целого убрали x и получили 680. Значит x — это разница между целым и остатком.',
      "Butundan x olib tashlandi va 680 chiqdi. Demak x — butun bilan qoldiq orasidagi farq.",
      'x was removed from the whole and 680 remained. So x is the difference between the whole and the remainder.',
    ),
    thirdHint: b('1 040 − 680 = 360.', '1 040 − 680 = 360.', '1,040 − 680 = 360.'),
    correctText: b(
      'Верно. x = 1 040 − 680 = 360, и проверка даёт 1 040 − 360 = 680.',
      "To'g'ri. x = 1 040 − 680 = 360, tekshiruv 1 040 − 360 = 680 beradi.",
      'Correct. x = 1,040 − 680 = 360, and the check gives 1,040 − 360 = 680.',
    ),
    rule: b(
      'Неизвестное вычитаемое находят вычитанием разности из уменьшаемого.',
      "Noma'lum ayriluvchi kamayuvchidan ayirmani ayirish bilan topiladi.",
      'An unknown subtrahend is found by subtracting the difference from the minuend.',
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

// Butun-qism lentasi. Segmentlar TENG kenglikda: noma'lum qismning haqiqiy
// ulushini ko'rsatish javobni ochib berardi. Lenta faqat tuzilmani beradi.
function BarModel({ visual, lang }) {
  const known = (value) => /^[0-9\s]+$/.test(value);
  return (
    <div className="p4-bar">
      <p className="p4-bar-label">{tx(UI.whole, lang)}</p>
      <div className="p4-bar-whole">
        <span className={known(visual.whole) ? '' : 'is-unknown'}>{visual.whole}</span>
        <i aria-hidden="true" />
      </div>
      <div className="p4-bar-parts">
        {visual.parts.map((part, index) => (
          <span key={`${part}-${index}`} className={known(part) ? '' : 'is-unknown'}>{part}</span>
        ))}
      </div>
      <p className="p4-bar-label">{tx(UI.parts, lang)}</p>
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

// `platform` berilganda tugma qatori chizilmaydi: uni LMS o'zi beradi va
// tekshiruvni `registerCheck` orqali chaqiradi (LMS kontrakti).
function Task({ task, lang, isLast, onSolved, shuffleSeed ,
  platform = false, mode, onReady, registerCheck, onSubmit, playCorrect, playWrong,
}) {
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
    if (task.kind === 'numpad' || task.kind === 'missing') return typed.length > 0;
    if (task.kind === 'match') return task.pairs.every((pair) => pairs[pair.id]);
    if (task.kind === 'order') return task.steps.every((step) => placed[step.id]);
    if (task.kind === 'slots') return task.slots.every((slot) => filled[slot.id]);
    return task.items.every((item) => assignments[item.id]);
  })();

  const answerCorrect = () => {
    if (task.kind === 'numpad' || task.kind === 'missing') return typed === task.answer;
    if (task.kind === 'match') return task.pairs.every((pair) => pairs[pair.id] === pair.correctRight);
    if (task.kind === 'order') return task.cards.every((card) => placed[task.steps[card.order].id] === card.id);
    if (task.kind === 'slots') return task.slots.every((slot) => filled[slot.id] === slot.correct);
    return task.items.every((item) => assignments[item.id] === item.bin);
  };

  // Uyaga xato karta qo'yilsa, tahlil aynan o'sha uyaning izohini beradi.
  const customWrong = (() => {
    if (task.kind !== 'slots') return null;
    const broken = task.slots.find((slot) => filled[slot.id] && filled[slot.id] !== slot.correct);
    return broken?.wrong;
  })();

  const hintLevel = checked && !solved ? attempts : 0;

  const clearResponse = () => {
    checkingRef.current = false;
    setChecked(false); setTyped('');
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
    if (task.kind === 'numpad' || task.kind === 'missing') return { value: typed };
    if (task.kind === 'match') return { pairs };
    if (task.kind === 'order') return { order: task.steps.map((step) => placed[step.id]) };
    if (task.kind === 'slots') return { slots: filled };
    return { bins: assignments };
  })();

  const correctAnswer = (() => {
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

  // --- LMS platforma kontrakti ------------------------------------------
  // Mexanikaga tegilmaydi: natija mavjud holatlardan o'qiladi.
  useEffect(() => { onReady?.(Boolean(answerReady) && !solved && mode !== 'review'); },
    [answerReady, solved, mode, onReady]);
  const checkRef = useRef(check);
  useEffect(() => { checkRef.current = check; });
  useEffect(() => { registerCheck?.(() => checkRef.current?.()); }, [registerCheck]);
  const reportedRef = useRef(-1);
  useEffect(() => {
    if (!checked) return;
    if (reportedRef.current === attempts) return;
    reportedRef.current = attempts;
    (solved ? playCorrect : playWrong)?.();
    onSubmit?.({
      questionText: typeof task.prompt === 'object' ? task.prompt.uz : String(task.prompt ?? ''),
      correct: Boolean(solved),
      meta: { taskId: task.id, kind: task.kind, attempts: attempts },
    });
  }, [attempts, checked, solved, onSubmit, playCorrect, playWrong, task]);
  // ----------------------------------------------------------------------
  return (
    <section className={`p4-task ${hintLevel >= 2 ? 'is-hint' : ''}`} aria-labelledby={`task-${task.id}`}>
      <p className="p4-eyebrow"><span>{tx(UI.level[task.level], lang)}</span> · {tx(UI.task, lang)} {Number(task.id)}</p>
      <p className="p4-setup">{tx(task.setup, lang)}</p>

      {task.visual?.type === 'bar' && <div className="p4-visual"><BarModel visual={task.visual} lang={lang} /></div>}
      {task.visual?.type === 'record' && <div className="p4-visual"><RecordCard visual={task.visual} /></div>}

      <h2 id={`task-${task.id}`} className="p4-ask">{tx(task.prompt, lang)}</h2>

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
          text={solved ? task.correctText : adaptive(task, null, attempts, customWrong)}
          rule={task.rule}
          lang={lang}
        />
      )}

      {!platform && <div className="p4-actions">
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
      </div>}
    </section>
  );
}

// ---------------------------------------------------------------------------
// HOST
// ---------------------------------------------------------------------------

export default function Grade4Dars42Practice({ studentName, lang: langProp, onFinished }) {
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
.p4-visual{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;width:100%;min-height:110px;padding:12px 10px;border-radius:16px;background:${T.paper};box-shadow:inset 0 0 0 1px rgba(23,59,82,.08);overflow:hidden}
.p4-bar{display:flex;flex-direction:column;align-items:center;gap:5px;width:min(100%,430px)}
.p4-bar-whole{display:flex;flex-direction:column;align-items:center;gap:3px;width:100%}
.p4-bar-whole span{font:800 clamp(17px,3.4vw,22px) 'JetBrains Mono',monospace;color:${T.navy}}
.p4-bar-whole span.is-unknown{color:${T.accent}}
.p4-bar-whole i{display:block;width:100%;height:8px;border:2px solid ${T.cyan};border-bottom:0;border-radius:6px 6px 0 0}
.p4-bar-parts{display:grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:6px;width:100%}
.p4-bar-parts span{display:grid;place-items:center;min-height:48px;border-radius:10px;background:${T.cyanSoft};box-shadow:inset 0 0 0 1px rgba(22,143,163,.22);font:800 clamp(15px,3vw,20px) 'JetBrains Mono',monospace;color:${T.navy}}
.p4-bar-parts span.is-unknown{background:${T.accentSoft};box-shadow:inset 0 0 0 2px ${T.accent};color:${T.accent}}
.p4-bar-label{color:${T.ink3};font-size:11px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}
.p4-record{font:800 clamp(20px,4.6vw,30px) 'JetBrains Mono',monospace;color:${T.navy}}
.p4-record.is-error{color:${T.warn};text-decoration:line-through}
.p4-pad{display:flex;flex-direction:column;align-items:center;gap:8px;width:min(240px,100%);margin:0 auto;padding:12px;border-radius:18px;background:linear-gradient(155deg,#EDF1F3,#DDE4E8);box-shadow:inset 0 1px rgba(255,255,255,.9)}
.p4-pad-display{display:flex;align-items:center;justify-content:center;width:100%;min-height:50px;border:2px solid ${T.accent};border-radius:13px;background:${T.paper};color:${T.navy};font:800 clamp(20px,4.4vw,26px) 'JetBrains Mono',monospace;letter-spacing:2px}
.p4-pad-keys{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;width:100%}
.p4-pad-keys button{min-width:44px;min-height:44px;border:1px solid rgba(23,59,82,.16);border-radius:12px;background:${T.paper};color:${T.navy};font:800 clamp(18px,3.6vw,22px) 'JetBrains Mono',monospace;cursor:pointer}
.p4-pad-keys button:hover:not(:disabled){border-color:${T.cyan}}
.p4-pad-keys .is-delete{background:${T.accentSoft};color:${T.accent}}
.p4-match-cols{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:7px}
.p4-match-col{display:grid;gap:8px;align-content:start}
.p4-match-item{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-width:44px;min-height:48px;padding:8px 9px;border:1px solid rgba(23,59,82,.12);border-radius:12px;background:${T.paper};color:${T.navy};font:700 clamp(12px,2vw,14px)/1.3 'Manrope',sans-serif;text-align:center;cursor:pointer}
.p4-match-item.is-active{border-color:${T.accent};background:${T.accentSoft}}
.p4-match-item.is-tied{border-color:rgba(34,122,83,.35)}
.p4-match-item.is-used{background:${T.successSoft};opacity:.65}
.p4-match-item:disabled{cursor:default}
.p4-match-item b{color:${T.success};font-size:12px}
.p4-slot-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;margin-top:7px}
.p4-slot{display:grid;place-items:center;gap:4px;min-width:44px;min-height:70px;padding:8px;border:1px solid rgba(23,59,82,.12);border-radius:13px;background:${T.paper};color:${T.ink2};font-family:inherit;cursor:pointer}
.p4-slot.is-active{border-color:${T.accent};background:${T.accentSoft}}
.p4-slot.is-no{border-color:${T.warn};background:${T.warnSoft}}
.p4-slot small{font-weight:800;font-size:11px}
.p4-slot b{font:800 14px/1.25 'JetBrains Mono',monospace;color:${T.navy}}
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
/* Yuqoridan 64 px: platformaning o'z til paneli sarlavha bilan ustma-ust
   tushmasligi kerak. Uchta guruh telefonda bir qatorli bo'ladi. */
@media(max-width:520px){
  .p4-order-slots{grid-template-columns:repeat(2,minmax(0,1fr))}
  .p4-order-slot{min-height:60px;padding:6px}
  .p4-slot-list{grid-template-columns:1fr}
  .p4-slot{min-height:60px;padding:6px}
  .p4-sort-bins{grid-template-columns:1fr;gap:6px}
  .p4-sort-bin{display:flex;align-items:center;gap:8px;min-height:56px;padding:6px}
  .p4-sort-bin-head{flex:0 0 34%;min-height:44px;padding:6px 4px;font-size:11px}
  .p4-sort-bin-items{flex:1;justify-content:flex-start;padding-top:0}
  .p4-sort-pool{min-height:56px;gap:6px}
  .p4-main{padding:4px 8px}
  .p4-head{padding:64px 8px 6px}
  .p4-visual{padding:10px 6px;min-height:104px}
  .p4-task{gap:8px}
}
@media(max-width:640px) and (max-height:700px){
  .p4-head{padding:64px 8px 3px!important}
  .p4-task{gap:6px!important}
  .p4-setup{font-size:12.5px;line-height:1.35}
  .p4-ask{font-size:16px!important}
  .p4-visual{min-height:82px!important;padding:8px 6px!important}
  .p4-bar-parts span{min-height:44px}
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
