// ============================================================================
// 4-SINF · 31-DARS AMALIYOTI · KATTALIKLARGA DOIR MASALALAR
// 10 topshiriq · UZ/RU/EN · ovozsiz · solve-to-advance.
//
// SKELET: src/books/grade4/AMALIYOT_31_40_SKELET.md §5.1.
// Raskladka (scripts/grade4-practice-31-40-layout.mjs):
//   mc · order · match · slots · numpad · sign · slots · missing · match · numpad
// KONTENT: context/GRADE4_DARS31_PRACTICE_CONTENT.js — bu yerga o'zgarishsiz ko'chdi.
//
// NEGA BITTA FAYL VA NEGA CHIZMALAR SHU YERDA. LMS darsni bitta avtonom .jsx
// sifatida qabul qiladi: lokal import yo'q, uslublar ichkarida. Shuning uchun
// nazariy darsdagi figuralarni (Dars31.jsx) import qilib bo'lmaydi va mavzuga
// xos chizmalar shu faylda qaytadan yoziladi. Bu CLAUDE.md §5 nusxa taqiqiga
// zid emas — LMS kontrakti shuni majbur qiladi.
//
// DIZAYN: Dars01Practice.jsx — ranglar, tipografika, tugma geometriyasi.
// RUS TILIDA MUROJAAT — «ты» (CLAUDE.md §1, ETALON_4SINF §6, Dars01Practice).
//
// CHIZMA QOIDASI: rasm yechimning birinchi qadamini bermaydi. Yuk ustunlari
// alohida turadi (ustma-ust qo'yilsa yig'indi chegaradan oshgani ko'rinib
// qolardi), lentada faqat berilgan uzunliklar belgilangan. Natija chizmada
// FAQAT to'g'ri javobdan keyin yig'iladi.
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
    'Урок 31. Практика: задачи на величины',
    '31-dars. Amaliyot: kattaliklarga doir masalalar',
    'Lesson 31. Practice: problems with measures',
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
  slotHint: b(
    'Нажми строку, потом карточку для неё.',
    'Avval qatorni, keyin unga mos kartani bosing.',
    'Tap a row, then the card that belongs in it.',
  ),
  limit: b('норма', 'norma', 'limit'),
};

const LESSON_META = {
  lessonId: 'num-4-31-practice',
  lessonTitle: UI.title,
  grade: 4,
  lessonNumber: 31,
  activityType: 'practice',
  taskCount: 10,
  resultIsUiState: true,
  progression: { green: 2, yellow: 5, red: 3 },
};

const SCREEN_META = [
  { id: 'practice-01', taskId: '01', template: 'record-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-02', taskId: '02', template: 'ordering', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-03', taskId: '03', template: 'matching', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-04', taskId: '04', template: 'slot-fill', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-05', taskId: '05', template: 'numeric-input', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-06', taskId: '06', template: 'sign-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-07', taskId: '07', template: 'slot-fill', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-08', taskId: '08', template: 'boundary-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-09', taskId: '09', template: 'error-analysis', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-10', taskId: '10', template: 'strategy-transfer', type: 'practice', scored: true, scope: 'final' },
];

// ---------------------------------------------------------------------------
// BIRLIKLAR. Aralash yozuv bitta joyda tuziladi: chizma imzosi ham, natija
// yig'ilishi ham shu funksiyadan chiqadi.
// ---------------------------------------------------------------------------
const UNITS = {
  cm: { factor: 100, small: b('см', 'cm', 'cm'), big: b('м', 'm', 'm') },
  g: { factor: 1000, small: b('г', 'g', 'g'), big: b('кг', 'kg', 'kg') },
  kg: { factor: 1000, small: b('кг', 'kg', 'kg'), big: b('т', 't', 't') },
};

const mixed = (value, unit, lang) => {
  const spec = UNITS[unit];
  if (!spec) return String(value);
  const big = Math.floor(value / spec.factor);
  const small = value % spec.factor;
  const bigPart = big > 0 ? `${big} ${tx(spec.big, lang)}` : '';
  const smallPart = small > 0 || big === 0 ? `${small} ${tx(spec.small, lang)}` : '';
  return [bigPart, smallPart].filter(Boolean).join(' ');
};

const plain = (value, unit, lang) => `${value} ${tx(UNITS[unit]?.small, lang)}`;

// Har ochilishda haqiqiy Fisher-Yates: variantlar tartibi qotib qolmaydi.
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
    id: '01', level: 'green', kind: 'mc', skillTag: 'finished_record',
    visual: {
      type: 'record-cards',
      items: [
        b('8 м 35 см', '8 m 35 cm', '8 m 35 cm'),
        b('7 м 135 см', '7 m 135 cm', '7 m 135 cm'),
        b('6 м 240 см', '6 m 240 cm', '6 m 240 cm'),
        b('5 м 100 см', '5 m 100 cm', '5 m 100 cm'),
      ],
    },
    setup: b(
      'Ночной диспетчер принял четыре записи длины кабеля.',
      "Tungi dispetcher kabel uzunligining to'rtta yozuvini qabul qildi.",
      'The night dispatcher received four cable-length records.',
    ),
    prompt: b(
      'Какая запись доведена до конца?',
      'Qaysi yozuv oxirigacha keltirilgan?',
      'Which record has been finished properly?',
    ),
    options: [
      option('finished', '8 м 35 см', '8 m 35 cm', '8 m 35 cm', true),
      option('over-hundred', '7 м 135 см', '7 m 135 cm', '7 m 135 cm', false,
        'В 135 см спрятан целый метр, значит запись не доведена до конца.',
        "135 cm ichida yana bir butun metr yashiringan, demak yozuv tugallanmagan.",
        'A whole metre is hidden inside 135 cm, so the record is unfinished.'),
      option('two-metres', '6 м 240 см', '6 m 240 cm', '6 m 240 cm', false,
        '240 см — это два метра и ещё 40 см, они должны уйти к метрам.',
        "240 cm — bu ikki metr va yana 40 cm; ular metrlarga o'tishi kerak.",
        '240 cm is two metres and 40 cm more, which belong with the metres.'),
      option('exact-hundred', '5 м 100 см', '5 m 100 cm', '5 m 100 cm', false,
        '100 см — это ровно один метр, малая часть должна стать нулевой.',
        "100 cm — aynan bir metr; kichik qism nolga aylanishi kerak.",
        '100 cm is exactly one metre, so the small part should become zero.'),
    ],
    secondHint: b(
      'Малая часть записи должна быть меньше одного метра.',
      "Yozuvning kichik qismi bir metrdan kichik bo'lishi kerak.",
      'The small part of the record must be less than one metre.',
    ),
    thirdHint: b(
      'В метре 100 см. Сравни малую часть каждой записи с числом 100.',
      'Bir metrda 100 cm bor. Har yozuvning kichik qismini 100 bilan solishtiring.',
      'One metre is 100 cm. Compare the small part of each record with 100.',
    ),
    correctText: b(
      'Верно. 35 см меньше метра, поэтому запись 8 м 35 см готова.',
      "To'g'ri. 35 cm bir metrdan kichik, shuning uchun 8 m 35 cm yozuvi tayyor.",
      'Correct. 35 cm is less than a metre, so 8 m 35 cm is a finished record.',
    ),
    rule: b(
      'Запись доведена до конца, когда малая часть меньше единицы перевода.',
      "Yozuv tugallangan bo'ladi, agar kichik qism aylantirish birligidan kichik bo'lsa.",
      'A record is finished when its small part is less than the conversion unit.',
    ),
  },

  {
    id: '02', level: 'green', kind: 'order', skillTag: 'three_step_method',
    visual: { type: 'step-track', text: b('5 м 60 см + 2 м 70 см', '5 m 60 cm + 2 m 70 cm', '5 m 60 cm + 2 m 70 cm'), steps: 4 },
    setup: b(
      'Два куска кабеля соединяют в один. Диспетчер хочет записать общую длину.',
      "Ikki kabel bo'lagi bittaga ulanadi. Dispetcher umumiy uzunlikni yozmoqchi.",
      'Two pieces of cable are joined into one. The dispatcher wants to record the total length.',
    ),
    prompt: b(
      'Расставь шаги решения по порядку.',
      'Yechim qadamlarini tartib bilan joylashtiring.',
      'Put the solution steps in order.',
    ),
    steps: [
      { id: 'step-1', label: b('Шаг 1', '1-qadam', 'Step 1') },
      { id: 'step-2', label: b('Шаг 2', '2-qadam', 'Step 2') },
      { id: 'step-3', label: b('Шаг 3', '3-qadam', 'Step 3') },
      { id: 'step-4', label: b('Шаг 4', '4-qadam', 'Step 4') },
    ],
    cards: [
      { id: 'target', text: b('Цель: сантиметры', 'Maqsad: santimetr', 'Target: centimetres'), order: 0 },
      { id: 'to-cm', text: b('560 см и 270 см', '560 cm va 270 cm', '560 cm and 270 cm'), order: 1 },
      { id: 'add', text: b('560 + 270 = 830', '560 + 270 = 830', '560 + 270 = 830'), order: 2 },
      { id: 'back', text: b('830 см = 8 м 30 см', '830 cm = 8 m 30 cm', '830 cm = 8 m 30 cm'), order: 3 },
    ],
    wrong: [b(
      'Сначала назови целевую единицу, только потом переводи оба слагаемых.',
      "Avval maqsad birlikni ayting, keyin ikkala qo'shiluvchini aylantiring.",
      'Name the target unit first, and only then convert both addends.',
    )],
    secondHint: b(
      '5 м 60 см — это 560 см, а 2 м 70 см — это 270 см.',
      "5 m 60 cm — bu 560 cm, 2 m 70 cm esa 270 cm.",
      '5 m 60 cm is 560 cm, and 2 m 70 cm is 270 cm.',
    ),
    thirdHint: b(
      '560 + 270 = 830, а 830 см — это 8 м 30 см.',
      '560 + 270 = 830, 830 cm esa 8 m 30 cm.',
      '560 + 270 = 830, and 830 cm is 8 m 30 cm.',
    ),
    correctText: b(
      'Верно. 5 м 60 см + 2 м 70 см = 8 м 30 см.',
      "To'g'ri. 5 m 60 cm + 2 m 70 cm = 8 m 30 cm.",
      'Correct. 5 m 60 cm + 2 m 70 cm = 8 m 30 cm.',
    ),
    rule: b(
      'Сначала одна единица, потом действие, потом удобная запись.',
      'Avval bitta birlik, keyin amal, keyin qulay yozuv.',
      'First one unit, then the operation, then a readable record.',
    ),
  },

  {
    id: '03', level: 'yellow', kind: 'match', skillTag: 'mixed_to_single_unit',
    visual: {
      type: 'unit-bridge',
      text: b('масса · масса · время · длина', 'massa · massa · vaqt · uzunlik', 'mass · mass · time · length'),
    },
    setup: b(
      'В сменном журнале смешанные записи стоят рядом с записями в одной единице.',
      'Smena jurnalida aralash yozuvlar bitta birlikdagi yozuvlar bilan yonma-yon turadi.',
      'In the shift log, mixed records sit next to records written in a single unit.',
    ),
    prompt: b(
      'Соедини каждую смешанную запись с равной ей записью в одной единице.',
      "Har bir aralash yozuvni unga teng bo'lgan bitta birlikdagi yozuv bilan birlashtiring.",
      'Match each mixed record with the equal record written in a single unit.',
    ),
    pairs: [
      { id: 'three-kg', left: b('3 кг 40 г', '3 kg 40 g', '3 kg 40 g'), correctRight: '3040-g' },
      { id: 'two-t', left: b('2 т 8 кг', '2 t 8 kg', '2 t 8 kg'), correctRight: '2008-kg' },
      { id: 'one-hour', left: b('1 ч 25 мин', '1 soat 25 min', '1 h 25 min'), correctRight: '85-min' },
      { id: 'six-m', left: b('6 м 4 см', '6 m 4 cm', '6 m 4 cm'), correctRight: '604-cm' },
    ],
    right: [
      { id: '3040-g', text: b('3040 г', '3040 g', '3,040 g') },
      { id: '2008-kg', text: b('2008 кг', '2008 kg', '2,008 kg') },
      { id: '85-min', text: b('85 мин', '85 min', '85 min') },
      { id: '604-cm', text: b('604 см', '604 cm', '604 cm') },
    ],
    wrong: [b(
      'У каждой пары единиц свой коэффициент: 1000, 1000, 60 и 100.',
      "Har birliklar juftining o'z koeffitsiyenti bor: 1000, 1000, 60 va 100.",
      'Each pair of units has its own factor: 1,000, 1,000, 60 and 100.',
    )],
    secondHint: b(
      'Крупную часть переведи по её коэффициенту, потом добавь остаток.',
      "Katta qismni o'z koeffitsiyenti bo'yicha aylantiring, keyin qoldiqni qo'shing.",
      'Convert the larger part by its own factor, then add the remainder.',
    ),
    thirdHint: b(
      '3 кг = 3000 г; 2 т = 2000 кг; 1 ч = 60 мин; 6 м = 600 см.',
      '3 kg = 3000 g; 2 t = 2000 kg; 1 soat = 60 min; 6 m = 600 cm.',
      '3 kg = 3,000 g; 2 t = 2,000 kg; 1 h = 60 min; 6 m = 600 cm.',
    ),
    correctText: b(
      'Верно. Все четыре записи получили свой коэффициент.',
      "To'g'ri. To'rtta yozuvning har biri o'z koeffitsiyentini oldi.",
      'Correct. Each of the four records used its own factor.',
    ),
    rule: b(
      'Коэффициент выбирают по виду величины, а не по привычке.',
      'Koeffitsiyent kattalik turiga qarab tanlanadi, odatga qarab emas.',
      'Choose the factor by the kind of measure, not by habit.',
    ),
  },

  {
    id: '04', level: 'yellow', kind: 'slots', skillTag: 'mixed_subtraction_borrow',
    // Chizma ma'lumoti sonli: lenta ham, javob ham 715 va 260 dan hisoblanadi,
    // shuning uchun rasm bilan javob hech qachon ajralmaydi.
    visual: { type: 'length-tape', total: 715, cut: 260, unit: 'cm' },
    setup: b(
      'От куска длиной 7 м 15 см отрезали 2 м 60 см.',
      "7 m 15 cm uzunlikdagi bo'lakdan 2 m 60 cm kesib olindi.",
      'A piece 2 m 60 cm long was cut from a piece 7 m 15 cm long.',
    ),
    prompt: b(
      'Заполни строки решения.',
      "Yechim qatorlarini to'ldiring.",
      'Fill in the rows of the solution.',
    ),
    slots: [
      {
        id: 'target', label: b('Целевая единица', 'Maqsad birlik', 'Target unit'), correct: 'cm-card',
        wrong: b(
          'Ответ считают в сантиметрах: в них у обеих длин нет смешанной записи.',
          'Javob santimetrda hisoblanadi: unda ikkala uzunlikda aralash yozuv qolmaydi.',
          'Work in centimetres: neither length then has a mixed record.',
        ),
      },
      {
        id: 'minuend', label: b('Уменьшаемое', 'Kamayuvchi', 'Minuend'), correct: '715-card',
        wrong: b(
          '7 м 15 см — это 700 см и ещё 15 см.',
          '7 m 15 cm — bu 700 cm va yana 15 cm.',
          '7 m 15 cm is 700 cm and 15 cm more.',
        ),
      },
      {
        id: 'subtrahend', label: b('Вычитаемое', 'Ayriluvchi', 'Subtrahend'), correct: '260-card',
        wrong: b(
          '2 м 60 см — это 200 см и ещё 60 см.',
          '2 m 60 cm — bu 200 cm va yana 60 cm.',
          '2 m 60 cm is 200 cm and 60 cm more.',
        ),
      },
      {
        id: 'result', label: b('Ответ', 'Javob', 'Answer'), correct: '455-card',
        wrong: b(
          '715 − 260 даёт число сантиметров; переведи его назад в метры.',
          '715 − 260 santimetr sonini beradi; uni metrga qaytaring.',
          '715 − 260 gives a number of centimetres; convert it back to metres.',
        ),
      },
    ],
    cards: [
      { id: 'cm-card', text: b('сантиметры', 'santimetr', 'centimetres') },
      { id: '715-card', text: b('715 см', '715 cm', '715 cm') },
      { id: '260-card', text: b('260 см', '260 cm', '260 cm') },
      { id: '455-card', text: b('4 м 55 см', '4 m 55 cm', '4 m 55 cm') },
      { id: 'parts-card', text: b('5 м 45 см', '5 m 45 cm', '5 m 45 cm') },
      { id: 'sum-card', text: b('975 см', '975 cm', '975 cm') },
    ],
    secondHint: b(
      '15 см меньше 60 см, поэтому по частям вычитать нельзя.',
      "15 cm 60 cm dan kichik, shuning uchun qismlarni alohida ayirib bo'lmaydi.",
      '15 cm is less than 60 cm, so the parts cannot be subtracted separately.',
    ),
    thirdHint: b(
      '715 − 260 = 455, а 455 см — это 4 м 55 см.',
      '715 − 260 = 455, 455 cm esa 4 m 55 cm.',
      '715 − 260 = 455, and 455 cm is 4 m 55 cm.',
    ),
    correctText: b(
      'Верно. 715 − 260 = 455, то есть 4 м 55 см.',
      "To'g'ri. 715 − 260 = 455, ya'ni 4 m 55 cm.",
      'Correct. 715 − 260 = 455, that is 4 m 55 cm.',
    ),
    rule: b(
      'Занимать у крупной единицы можно только после перехода к одной единице.',
      "Katta birlikdan qarz olish faqat bitta birlikka o'tgandan keyin mumkin.",
      'Borrow from the larger unit only after moving to a single unit.',
    ),
  },

  {
    id: '05', level: 'yellow', kind: 'numpad', skillTag: 'missing_addend_mixed',
    answer: '3350', maxLen: 4,
    visual: { type: 'balance', known: 1850, total: 5200, unit: 'g' },
    setup: b(
      'На левой чаше весов неизвестный груз и гиря 1 кг 850 г, на правой — 5 кг 200 г. Весы уравновешены.',
      "Tarozining chap pallasida noma'lum yuk va 1 kg 850 g tosh, o'ng pallasida 5 kg 200 g. Tarozi tenglashgan.",
      'The left pan holds an unknown load and a 1 kg 850 g weight; the right pan holds 5 kg 200 g. The scales balance.',
    ),
    prompt: b(
      'Сколько граммов весит неизвестный груз?',
      "Noma'lum yuk necha gramm?",
      'How many grams does the unknown load weigh?',
    ),
    wrongAnswers: {
      7050: b(
        'Это сумма обеих масс. Весы уравновешены, значит нужно вычитание.',
        "Bu ikkala massaning yig'indisi. Tarozi tenglashgan, demak ayirish kerak.",
        'That is the sum of both masses. The scales balance, so subtraction is needed.',
      ),
      4650: b(
        'Килограммы и граммы вычтены по отдельности: 200 г меньше 850 г.',
        'Kilogramm va gramm alohida ayirilgan: 200 g 850 g dan kichik.',
        'The kilograms and grams were subtracted separately: 200 g is less than 850 g.',
      ),
      4350: b(
        'Целый килограмм гири потерян: вычтено только 850 г.',
        "Toshning butun kilogrammi tushib qolgan: faqat 850 g ayirilgan.",
        'The whole kilogram of the weight was lost: only 850 g was subtracted.',
      ),
    },
    wrong: [b(
      'Приведи обе массы к граммам и найди неизвестное обратным действием.',
      "Ikkala massani grammga keltiring va noma'lumni teskari amal bilan toping.",
      'Convert both masses to grams and find the unknown by the inverse operation.',
    )],
    secondHint: b(
      '5 кг 200 г — это 5200 г, а 1 кг 850 г — это 1850 г.',
      '5 kg 200 g — bu 5200 g, 1 kg 850 g esa 1850 g.',
      '5 kg 200 g is 5,200 g, and 1 kg 850 g is 1,850 g.',
    ),
    thirdHint: b(
      '5200 − 1850 = 3350.',
      '5200 − 1850 = 3350.',
      '5,200 − 1,850 = 3,350.',
    ),
    correctText: b(
      'Верно. Неизвестный груз — 3350 г, то есть 3 кг 350 г.',
      "To'g'ri. Noma'lum yuk 3350 g, ya'ni 3 kg 350 g.",
      'Correct. The unknown load is 3,350 g, that is 3 kg 350 g.',
    ),
    rule: b(
      'Неизвестное слагаемое находят вычитанием — обратным действием.',
      "Noma'lum qo'shiluvchi ayirish bilan, ya'ni teskari amal bilan topiladi.",
      'A missing addend is found by subtraction, the inverse operation.',
    ),
  },

  {
    id: '06', level: 'yellow', kind: 'sign', skillTag: 'operation_from_relation',
    // Ustunlar alohida chiziladi, ustma-ust qo'yilmaydi: aks holda yig'indi
    // chegara chizig'idan oshgani ko'rinib, javob ochilib qolardi.
    visual: { type: 'load-bars', bars: [2350, 1780], limit: 4000, unit: 'kg' },
    setup: b(
      'Из склада за ночь вышли две партии: 2 т 350 кг и 1 т 780 кг. Норма ночного окна — 4 т.',
      'Ombordan bir kechada ikki partiya chiqdi: 2 t 350 kg va 1 t 780 kg. Tungi oyna normasi — 4 t.',
      'Two batches left the warehouse overnight: 2 t 350 kg and 1 t 780 kg. The night window allows 4 t.',
    ),
    prompt: b(
      'Поставь знак: вышедший груз □ 4 т.',
      "Belgini qo'ying: chiqqan yuk □ 4 t.",
      'Choose the sign: the load that left □ 4 t.',
    ),
    options: [
      option('greater', '>', '>', '>', true),
      option('less', '<', '<', '<', false,
        'Сложи обе партии в килограммах: их сумма больше четырёх тысяч.',
        "Ikkala partiyani kilogrammda qo'shing: yig'indi to'rt mingdan katta.",
        'Add both batches in kilograms: the total is more than four thousand.'),
      option('equal', '=', '=', '=', false,
        'Сумма не равна ровно четырём тоннам — проверь остаток в килограммах.',
        'Yig\'indi aynan to\'rt tonnaga teng emas — kilogrammdagi qoldiqni tekshiring.',
        'The total is not exactly four tonnes — check the remainder in kilograms.'),
    ],
    secondHint: b(
      'Сначала обе партии в килограммах, потом сложение, потом сравнение с нормой.',
      "Avval ikkala partiya kilogrammda, keyin qo'shish, keyin norma bilan solishtirish.",
      'First both batches in kilograms, then addition, then the comparison with the limit.',
    ),
    thirdHint: b(
      '2350 + 1780 = 4130, а 4 т — это 4000 кг.',
      '2350 + 1780 = 4130, 4 t esa 4000 kg.',
      '2,350 + 1,780 = 4,130, and 4 t is 4,000 kg.',
    ),
    correctText: b(
      'Верно. 4130 кг больше 4000 кг: груз вышел за норму на 130 кг.',
      "To'g'ri. 4130 kg 4000 kg dan katta: yuk normadan 130 kg oshdi.",
      'Correct. 4,130 kg is more than 4,000 kg: the load exceeds the limit by 130 kg.',
    ),
    rule: b(
      'Действие выбирают по связи величин, а не по слову в условии.',
      "Amal shartdagi so'zga qarab emas, kattaliklar bog'lanishiga qarab tanlanadi.",
      'Choose the operation from the relationship between the measures, not from a word in the text.',
    ),
  },

  {
    id: '07', level: 'yellow', kind: 'slots', skillTag: 'solution_protocol',
    visual: { type: 'protocol-sheet', rows: 4, text: b('4 кг 200 г − 1 кг 650 г', '4 kg 200 g − 1 kg 650 g', '4 kg 200 g − 1 kg 650 g') },
    setup: b(
      'Смену закрывают только с заполненным протоколом решения.',
      "Smena faqat to'ldirilgan yechim bayonnomasi bilan yopiladi.",
      'A shift is closed only with a completed solution protocol.',
    ),
    prompt: b(
      'Заполни протокол для 4 кг 200 г − 1 кг 650 г.',
      "4 kg 200 g − 1 kg 650 g uchun bayonnomani to'ldiring.",
      'Complete the protocol for 4 kg 200 g − 1 kg 650 g.',
    ),
    slots: [
      {
        id: 'one-unit', label: b('К одной единице', 'Bitta birlikka', 'To one unit'), correct: 'grams-card',
        wrong: b(
          'В этой строке стоят оба числа в граммах, без смешанной записи.',
          'Bu qatorda ikkala son grammda turadi, aralash yozuvsiz.',
          'This row holds both numbers in grams, with no mixed record.',
        ),
      },
      {
        id: 'action', label: b('Действие', 'Amal', 'Operation'), correct: 'subtract-card',
        wrong: b(
          'Груз убрали, значит нужно вычитание, а не сложение.',
          "Yuk olib qo'yildi, demak ayirish kerak, qo'shish emas.",
          'The load was removed, so subtraction is needed, not addition.',
        ),
      },
      {
        id: 'answer', label: b('Ответ', 'Javob', 'Answer'), correct: 'mixed-card',
        wrong: b(
          '4200 − 1650 даёт число граммов; переведи его в килограммы и граммы.',
          '4200 − 1650 gramm sonini beradi; uni kilogramm va grammga aylantiring.',
          '4,200 − 1,650 gives a number of grams; convert it into kilograms and grams.',
        ),
      },
      {
        id: 'check', label: b('Проверка', 'Tekshiruv', 'Check'), correct: 'inverse-card',
        wrong: b(
          'Проверяют обратным действием: ответ плюс вычитаемое даёт уменьшаемое.',
          'Tekshiruv teskari amal bilan: javob va ayriluvchi kamayuvchini beradi.',
          'Check with the inverse operation: the answer plus the subtrahend gives the minuend.',
        ),
      },
    ],
    cards: [
      { id: 'grams-card', text: b('4200 г и 1650 г', '4200 g va 1650 g', '4,200 g and 1,650 g') },
      { id: 'subtract-card', text: b('4200 − 1650', '4200 − 1650', '4,200 − 1,650') },
      { id: 'mixed-card', text: b('2 кг 550 г', '2 kg 550 g', '2 kg 550 g') },
      { id: 'inverse-card', text: b('2550 + 1650 = 4200', '2550 + 1650 = 4200', '2,550 + 1,650 = 4,200') },
      { id: 'add-card', text: b('4200 + 1650', '4200 + 1650', '4,200 + 1,650') },
      { id: 'wrong-mixed-card', text: b('3 кг 450 г', '3 kg 450 g', '3 kg 450 g') },
    ],
    secondHint: b(
      '4 кг 200 г — это 4200 г, а 1 кг 650 г — это 1650 г.',
      '4 kg 200 g — bu 4200 g, 1 kg 650 g esa 1650 g.',
      '4 kg 200 g is 4,200 g, and 1 kg 650 g is 1,650 g.',
    ),
    thirdHint: b(
      '4200 − 1650 = 2550, то есть 2 кг 550 г; проверка: 2550 + 1650 = 4200.',
      "4200 − 1650 = 2550, ya'ni 2 kg 550 g; tekshiruv: 2550 + 1650 = 4200.",
      '4,200 − 1,650 = 2,550, that is 2 kg 550 g; check: 2,550 + 1,650 = 4,200.',
    ),
    correctText: b(
      'Верно. Ответ 2 кг 550 г, и обратное действие вернуло 4200 г.',
      "To'g'ri. Javob 2 kg 550 g, teskari amal esa 4200 g ni qaytardi.",
      'Correct. The answer is 2 kg 550 g, and the inverse operation returned 4,200 g.',
    ),
    rule: b(
      'Решение не закончено без проверки обратным действием.',
      'Teskari amal bilan tekshirilmagan yechim tugallanmagan hisoblanadi.',
      'A solution is not finished until it is checked by the inverse operation.',
    ),
  },

  {
    id: '08', level: 'red', kind: 'missing', skillTag: 'zero_small_part',
    visual: { type: 'sum-record', text: b('3 м 55 см + 4 м 45 см', '3 m 55 cm + 4 m 45 cm', '3 m 55 cm + 4 m 45 cm') },
    setup: b(
      'Две трубы длиной 3 м 55 см и 4 м 45 см соединили в одну.',
      '3 m 55 cm va 4 m 45 cm uzunlikdagi ikki truba bittaga ulandi.',
      'Two pipes, 3 m 55 cm and 4 m 45 cm long, were joined into one.',
    ),
    prompt: b(
      'Как записать общую длину?',
      'Umumiy uzunlik qanday yoziladi?',
      'How should the total length be recorded?',
    ),
    options: [
      option('eight-metres', '8 м', '8 m', '8 m', true),
      option('seven-hundred', '7 м 100 см', '7 m 100 cm', '7 m 100 cm', false,
        '100 см — это ровно один метр, он должен уйти к метрам.',
        "100 cm — aynan bir metr, u metrlarga o'tishi kerak.",
        '100 cm is exactly one metre and must move to the metres.'),
      option('eight-hundred', '8 м 100 см', '8 m 100 cm', '8 m 100 cm', false,
        'Сантиметры посчитаны дважды: они уже вошли в восьмой метр.',
        'Santimetrlar ikki marta sanalgan: ular allaqachon sakkizinchi metrga kirgan.',
        'The centimetres are counted twice: they are already inside the eighth metre.'),
      option('eighty', '80 м', '80 m', '80 m', false,
        'Цифры соединены подряд. Посчитай, сколько здесь полных метров.',
        'Raqamlar ketma-ket yopishtirilgan. Bu yerda nechta butun metr borligini sanang.',
        'The digits were glued together. Count how many whole metres there are.'),
    ],
    secondHint: b(
      'Переведи обе длины в сантиметры и сложи их.',
      "Ikkala uzunlikni santimetrga aylantirib qo'shing.",
      'Convert both lengths to centimetres and add them.',
    ),
    thirdHint: b(
      '355 + 445 = 800, а 800 см — это 8 полных метров.',
      '355 + 445 = 800, 800 cm esa 8 butun metr.',
      '355 + 445 = 800, and 800 cm is 8 whole metres.',
    ),
    correctText: b(
      'Верно. 800 см = 8 м, малая часть обратилась в нуль.',
      "To'g'ri. 800 cm = 8 m, kichik qism nolga aylandi.",
      'Correct. 800 cm = 8 m, and the small part became zero.',
    ),
    rule: b(
      'Если малая часть обратилась в нуль, её не записывают.',
      'Kichik qism nolga aylansa, u yozilmaydi.',
      'When the small part becomes zero, it is not written.',
    ),
  },

  {
    id: '09', level: 'red', kind: 'match', skillTag: 'error_diagnosis',
    visual: {
      type: 'error-console',
      items: [
        b('6 м 140 см', '6 m 140 cm', '6 m 140 cm'),
        b('2 кг 40 г − 1 кг 60 г = 1 кг 20 г', '2 kg 40 g − 1 kg 60 g = 1 kg 20 g', '2 kg 40 g − 1 kg 60 g = 1 kg 20 g'),
        b('3 ч 20 мин = 320 мин', '3 soat 20 min = 320 min', '3 h 20 min = 320 min'),
      ],
    },
    setup: b(
      'В журнале смены остались три неверные строки.',
      "Smena jurnalida uchta noto'g'ri qator qoldi.",
      'Three incorrect lines remain in the shift log.',
    ),
    prompt: b(
      'Соедини каждую строку с названием её ошибки.',
      'Har bir qatorni uning xatosi nomi bilan birlashtiring.',
      'Match each line with the name of its error.',
    ),
    pairs: [
      { id: 'line-140', left: b('6 м 140 см', '6 m 140 cm', '6 m 140 cm'), correctRight: 'unfinished' },
      { id: 'line-mass', left: b('2 кг 40 г − 1 кг 60 г', '2 kg 40 g − 1 kg 60 g', '2 kg 40 g − 1 kg 60 g'), correctRight: 'no-borrow' },
      { id: 'line-time', left: b('3 ч 20 мин = 320 мин', '3 soat 20 min = 320 min', '3 h 20 min = 320 min'), correctRight: 'glued' },
    ],
    right: [
      { id: 'unfinished', text: b('запись не доведена до конца', 'yozuv tugallanmagan', 'the record is unfinished') },
      { id: 'no-borrow', text: b('части вычтены без займа', 'qismlar qarz olinmasdan ayirilgan', 'the parts were subtracted without borrowing') },
      { id: 'glued', text: b('цифры склеены вместо перевода', "aylantirish o'rniga raqamlar yopishtirilgan", 'the digits were glued instead of converted') },
    ],
    wrong: [b(
      'Назови, что именно сделано неверно в выбранной строке, а не просто исправь число.',
      "Tanlangan qatorda aynan nima noto'g'ri qilinganini ayting, sonni shunchaki tuzatmang.",
      'Name exactly what was done wrongly in the chosen line, rather than just fixing the number.',
    )],
    secondHint: b(
      '140 см больше метра; 40 г меньше 60 г; в одном часе 60 минут.',
      '140 cm bir metrdan katta; 40 g 60 g dan kichik; bir soatda 60 minut bor.',
      '140 cm is more than a metre; 40 g is less than 60 g; one hour has 60 minutes.',
    ),
    thirdHint: b(
      'Верные записи: 7 м 40 см; 980 г; 200 мин.',
      "To'g'ri yozuvlar: 7 m 40 cm; 980 g; 200 min.",
      'The correct records are: 7 m 40 cm; 980 g; 200 min.',
    ),
    correctText: b(
      'Верно. У каждой ошибки своё имя, поэтому её видно и можно исправить.',
      "To'g'ri. Har xatoning o'z nomi bor, shuning uchun u ko'rinadi va tuzatiladi.",
      'Correct. Each error has its own name, which makes it visible and fixable.',
    ),
    rule: b(
      'Сначала называют характер ошибки, потом проверяют признак.',
      'Avval xatoning tabiati nomlanadi, keyin belgi tekshiriladi.',
      'First name the nature of the error, then check the feature.',
    ),
  },

  {
    id: '10', level: 'red', kind: 'numpad', skillTag: 'inverse_transfer',
    answer: '335', maxLen: 4,
    visual: { type: 'wire-reel', total: 1200, cuts: [375, 490], unit: 'cm' },
    setup: b(
      'Для ограждения есть 12 м провода. От него отрезали 3 м 75 см и 4 м 90 см.',
      "Panjara uchun 12 m sim bor. Undan 3 m 75 cm va 4 m 90 cm kesib olindi.",
      'There are 12 m of wire for a fence. Pieces of 3 m 75 cm and 4 m 90 cm were cut from it.',
    ),
    prompt: b(
      'Сколько сантиметров провода осталось?',
      'Necha santimetr sim qoldi?',
      'How many centimetres of wire are left?',
    ),
    wrongAnswers: {
      865: b(
        'Это длина отрезанных кусков, а не остаток.',
        "Bu kesib olingan bo'laklarning uzunligi, qoldiq emas.",
        'That is the length of the pieces cut off, not what is left.',
      ),
      825: b(
        'Вычтен только первый кусок. Второй тоже отрезали.',
        "Faqat birinchi bo'lak ayirilgan. Ikkinchisi ham kesib olingan.",
        'Only the first piece was subtracted. The second was cut off too.',
      ),
      710: b(
        'Вычтен только второй кусок. Первый тоже отрезали.',
        "Faqat ikkinchi bo'lak ayirilgan. Birinchisi ham kesib olingan.",
        'Only the second piece was subtracted. The first was cut off too.',
      ),
      2065: b(
        'Остаток не может быть больше исходных 1200 см — здесь длины сложены.',
        "Qoldiq boshlang'ich 1200 cm dan katta bo'lolmaydi — bu yerda uzunliklar qo'shilgan.",
        'What is left cannot exceed the original 1,200 cm — the lengths were added here.',
      ),
    },
    wrong: [b(
      'Приведи все три длины к сантиметрам и вычти оба куска.',
      "Uchala uzunlikni santimetrga keltirib, ikkala bo'lakni ayiring.",
      'Convert all three lengths to centimetres and subtract both pieces.',
    )],
    secondHint: b(
      '12 м — это 1200 см; 3 м 75 см — 375 см; 4 м 90 см — 490 см.',
      '12 m — bu 1200 cm; 3 m 75 cm — 375 cm; 4 m 90 cm — 490 cm.',
      '12 m is 1,200 cm; 3 m 75 cm is 375 cm; 4 m 90 cm is 490 cm.',
    ),
    thirdHint: b(
      '1200 − 375 − 490 = 335.',
      '1200 − 375 − 490 = 335.',
      '1,200 − 375 − 490 = 335.',
    ),
    correctText: b(
      'Верно. Осталось 335 см, то есть 3 м 35 см — меньше исходных 12 м.',
      "To'g'ri. 335 cm qoldi, ya'ni 3 m 35 cm — boshlang'ich 12 m dan kichik.",
      'Correct. 335 cm are left, that is 3 m 35 cm — less than the original 12 m.',
    ),
    rule: b(
      'Ответ проверяют на разумность: остаток не бывает больше исходной величины.',
      "Javob mantiqiylikka tekshiriladi: qoldiq boshlang'ich kattalikdan katta bo'lmaydi.",
      'Check the answer for reasonableness: what is left is never more than the original amount.',
    ),
  },
];

// Uch pog'onali yordam: birinchi xatoda strategiyaga xos tahlil, keyin belgi,
// keyin bitta hisoblangan qadam. Birinchi xato tayyor yechimni ochmaydi.
const adaptive = (task, pickedOption, typed, slotWrong, attempts) => {
  if (attempts >= 3) return task.thirdHint;
  if (attempts >= 2) return task.secondHint;
  if (pickedOption?.wrong) return pickedOption.wrong;
  if (typed && task.wrongAnswers?.[typed]) return task.wrongAnswers[typed];
  if (slotWrong) return slotWrong;
  return task.wrong?.[0] || task.secondHint;
};

// ---------------------------------------------------------------------------
// CHIZMALAR. Har biri mavzuning asbobi: yozuv kartasi, uzunlik lentasi, tarozi,
// yuk ustunlari, bayonnoma varaqasi, sim g'altagi. `solved` bo'lganda natija
// chizmada yig'iladi — bundan oldin emas.
// ---------------------------------------------------------------------------
function Visual({ task, lang, solved }) {
  const visual = task.visual;
  if (!visual) return null;

  if (visual.type === 'record-cards') {
    return (
      <div className="p4-visual p4-visual-cards">
        {visual.items.map((item, index) => (
          <span className="p4-chip" key={index} style={{ animationDelay: `${index * 60}ms` }}>{tx(item, lang)}</span>
        ))}
      </div>
    );
  }

  if (visual.type === 'step-track') {
    return (
      <div className="p4-visual p4-visual-track">
        <strong>{tx(visual.text, lang)}</strong>
        <span className="p4-track">
          {Array.from({ length: visual.steps }, (_, index) => (
            <i key={index} style={{ animationDelay: `${index * 70}ms` }} />
          ))}
        </span>
      </div>
    );
  }

  if (visual.type === 'unit-bridge') {
    return (
      <div className="p4-visual p4-visual-bridge">
        <span className="p4-bridge-side">{tx(b('смешанная запись', 'aralash yozuv', 'mixed record'), lang)}</span>
        <span className="p4-bridge-arrow" aria-hidden="true">→</span>
        <span className="p4-bridge-side">{tx(b('одна единица', 'bitta birlik', 'one unit'), lang)}</span>
        <em>{tx(visual.text, lang)}</em>
      </div>
    );
  }

  if (visual.type === 'length-tape') {
    const share = Math.round((visual.cut / visual.total) * 100);
    return (
      <div className="p4-visual">
        <svg className="p4-svg" viewBox="0 0 320 96" role="img"
          aria-label={`${mixed(visual.total, visual.unit, lang)} / ${mixed(visual.cut, visual.unit, lang)}`}>
          <rect x="8" y="30" width="304" height="26" rx="7" fill={T.cyanSoft} stroke={T.cyan} strokeWidth="1.6" />
          <rect x="8" y="30" width={(304 * share) / 100} height="26" rx="7" fill={T.accentSoft} stroke={T.accent} strokeWidth="1.6" />
          <line x1={8 + (304 * share) / 100} y1="22" x2={8 + (304 * share) / 100} y2="64" stroke={T.accent} strokeWidth="2" strokeDasharray="4 3" />
          <text x="160" y="20" textAnchor="middle" className="p4-svg-top">{mixed(visual.total, visual.unit, lang)}</text>
          <text x={8 + (304 * share) / 200} y="78" textAnchor="middle" className="p4-svg-cut">{mixed(visual.cut, visual.unit, lang)}</text>
          {solved && (
            <text x={(8 + 312 + (304 * share) / 100) / 2} y="78" textAnchor="middle" className="p4-svg-reveal">
              {mixed(visual.total - visual.cut, visual.unit, lang)}
            </text>
          )}
        </svg>
      </div>
    );
  }

  if (visual.type === 'balance') {
    return (
      <div className="p4-visual">
        <svg className="p4-svg" viewBox="0 0 320 116" role="img" aria-label={tx(task.setup, lang)}>
          <line x1="30" y1="34" x2="290" y2="34" stroke={T.navy} strokeWidth="3" strokeLinecap="round" />
          <path d="M160 34 L160 96" stroke={T.navy} strokeWidth="3" strokeLinecap="round" />
          <path d="M136 100 H184" stroke={T.navy} strokeWidth="4" strokeLinecap="round" />
          {[70, 250].map((cx) => (
            <g key={cx}>
              <line x1={cx} y1="34" x2={cx} y2="54" stroke={T.ink3} strokeWidth="2" />
              <path d={`M${cx - 40} 54 H${cx + 40} L${cx + 28} 76 H${cx - 28} Z`} fill={T.paper} stroke={T.cyan} strokeWidth="1.6" />
            </g>
          ))}
          <text x="70" y="26" textAnchor="middle" className="p4-svg-top">
            {solved ? mixed(visual.total - visual.known, visual.unit, lang) : '?'}
          </text>
          <text x="70" y="70" textAnchor="middle" className="p4-svg-cut">{mixed(visual.known, visual.unit, lang)}</text>
          <text x="250" y="70" textAnchor="middle" className="p4-svg-cut">{mixed(visual.total, visual.unit, lang)}</text>
        </svg>
      </div>
    );
  }

  if (visual.type === 'load-bars') {
    const scale = Math.max(visual.limit, ...visual.bars);
    return (
      <div className="p4-visual">
        <svg className="p4-svg" viewBox="0 0 320 112" role="img" aria-label={tx(task.setup, lang)}>
          {visual.bars.map((value, index) => (
            <g key={index}>
              <rect x="12" y={16 + index * 34} width={(272 * value) / scale} height="20" rx="6"
                fill={T.cyanSoft} stroke={T.cyan} strokeWidth="1.6" />
              <text x={16 + (272 * value) / scale} y={31 + index * 34} className="p4-svg-cut">
                {mixed(value, visual.unit, lang)}
              </text>
            </g>
          ))}
          <line x1={12 + 272} y1="8" x2={12 + 272} y2="88" stroke={T.accent} strokeWidth="2" strokeDasharray="5 4" />
          <text x="296" y="102" textAnchor="end" className="p4-svg-top">
            {tx(UI.limit, lang)} {mixed(visual.limit, visual.unit, lang)}
          </text>
          {solved && (
            <text x="16" y="102" className="p4-svg-reveal">
              {mixed(visual.bars.reduce((sum, value) => sum + value, 0), visual.unit, lang)}
            </text>
          )}
        </svg>
      </div>
    );
  }

  if (visual.type === 'protocol-sheet') {
    return (
      <div className="p4-visual p4-visual-sheet">
        <strong>{tx(visual.text, lang)}</strong>
        <span className="p4-sheet">
          {Array.from({ length: visual.rows }, (_, index) => (
            <i key={index} style={{ animationDelay: `${index * 70}ms` }} />
          ))}
        </span>
      </div>
    );
  }

  if (visual.type === 'sum-record') {
    return <div className="p4-visual"><strong>{tx(visual.text, lang)}</strong></div>;
  }

  if (visual.type === 'error-console') {
    return (
      <div className="p4-visual p4-visual-console">
        {visual.items.map((item, index) => (
          <span className="p4-console-row" key={index} style={{ animationDelay: `${index * 70}ms` }}>
            <b aria-hidden="true">!</b>{tx(item, lang)}
          </span>
        ))}
      </div>
    );
  }

  if (visual.type === 'wire-reel') {
    const cutTotal = visual.cuts.reduce((sum, value) => sum + value, 0);
    return (
      <div className="p4-visual">
        <svg className="p4-svg" viewBox="0 0 320 104" role="img" aria-label={tx(task.setup, lang)}>
          <circle cx="46" cy="52" r="30" fill={T.paper} stroke={T.navy} strokeWidth="2.4" />
          <circle cx="46" cy="52" r="19" fill={T.cyanSoft} stroke={T.cyan} strokeWidth="1.6" />
          <circle cx="46" cy="52" r="6" fill={T.navy} />
          <path d="M76 52 H304" stroke={T.cyan} strokeWidth="4" strokeLinecap="round" />
          {visual.cuts.map((value, index) => {
            const x = 110 + index * 86;
            return (
              <g key={index}>
                <line x1={x} y1="34" x2={x} y2="70" stroke={T.accent} strokeWidth="2" strokeDasharray="4 3" />
                <text x={x + 4} y="30" className="p4-svg-cut">{mixed(value, visual.unit, lang)}</text>
              </g>
            );
          })}
          <text x="304" y="90" textAnchor="end" className="p4-svg-top">{mixed(visual.total, visual.unit, lang)}</text>
          {solved && (
            <text x="80" y="90" className="p4-svg-reveal">{plain(visual.total - cutTotal, visual.unit, lang)}</text>
          )}
        </svg>
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

  const cells = task.slots || task.steps || null;

  useEffect(() => {
    if (checked) window.setTimeout(() => feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 120);
  }, [checked]);

  const answerReady = (() => {
    if (task.options) return pickedId !== null;
    if (task.kind === 'numpad') return typed.length > 0;
    if (task.kind === 'match') return task.pairs.every((pair) => pairs[pair.id]);
    return cells.every((cell) => placed[cell.id]);
  })();

  const answerCorrect = () => {
    if (task.options) return task.options.find((item) => item.id === pickedId)?.correct === true;
    if (task.kind === 'numpad') return typed === task.answer;
    if (task.kind === 'match') return task.pairs.every((pair) => pairs[pair.id] === pair.correctRight);
    if (task.kind === 'slots') return task.slots.every((slot) => placed[slot.id] === slot.correct);
    return task.cards.every((card) => placed[task.steps[card.order].id] === card.id);
  };

  const clearResponse = () => {
    checkingRef.current = false;
    setChecked(false);
    setPickedId(null);
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
  const slotWrong = task.kind === 'slots'
    ? task.slots.find((slot) => placed[slot.id] !== slot.correct)?.wrong
    : null;
  const cardText = (cardId) => tx(task.cards?.find((card) => card.id === cardId)?.text, lang);

  const studentAnswer = (() => {
    if (task.options) return { optionId: pickedId, text: pickedOption?.text };
    if (task.kind === 'numpad') return { value: typed };
    if (task.kind === 'match') return { pairs };
    if (task.kind === 'slots') return { slots: placed };
    return { order: task.steps.map((step) => placed[step.id]) };
  })();

  const correctAnswer = (() => {
    if (task.options) {
      const item = task.options.find((candidate) => candidate.correct);
      return { optionId: item.id, text: item.text };
    }
    if (task.kind === 'numpad') return { value: task.answer };
    if (task.kind === 'match') {
      return { pairs: Object.fromEntries(task.pairs.map((pair) => [pair.id, pair.correctRight])) };
    }
    if (task.kind === 'slots') {
      return { slots: Object.fromEntries(task.slots.map((slot) => [slot.id, slot.correct])) };
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

      {task.kind === 'slots' && (
        <div className="p4-slots">
          <p className="p4-note">{tx(UI.slotHint, lang)}</p>
          <div className="p4-slot-list">
            {task.slots.map((slot) => (
              <button type="button" key={slot.id} disabled={solved} aria-pressed={activeCell === slot.id}
                className={`p4-slot ${activeCell === slot.id ? 'is-active' : ''} ${placed[slot.id] ? 'is-tied' : ''}`}
                onClick={() => { checkingRef.current = false; setActiveCell(slot.id); setChecked(false); }}>
                <small>{tx(slot.label, lang)}</small>
                <b>{placed[slot.id] ? cardText(placed[slot.id]) : '—'}</b>
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
          text={solved ? task.correctText : adaptive(task, pickedOption, typed, slotWrong, attempts)} />
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
                  : task.right ?? task.cards ?? null,
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

export default function Grade4Dars31Practice({ studentName, lang: langProp, onFinished }) {
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

// ---------------------------------------------------------------------------
// USLUBLAR — fayl ichida: LMS ga alohida .css bormaydi.
// Mobil: 390 px maketi, teginish maydoni 44 px dan kichik emas.
// ---------------------------------------------------------------------------
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
.p4-visual strong { text-align: center; color: ${T.navy}; font: 800 clamp(20px, 4.6vw, 30px)/1.25 'JetBrains Mono', monospace; }
.p4-visual em { color: ${T.ink3}; font-size: 12px; font-style: normal; font-weight: 700; letter-spacing: .04em; }
.p4-svg { width: 100%; max-width: 340px; height: auto; }
.p4-svg text { font: 700 12px 'JetBrains Mono', monospace; }
.p4-svg-top { fill: ${T.navy}; }
.p4-svg-cut { fill: ${T.ink2}; }
.p4-svg-reveal { fill: ${T.success}; font-weight: 800; animation: p4-rise .5s cubic-bezier(.22, 1.2, .36, 1) both; }

.p4-visual-cards { grid-auto-flow: column; grid-auto-columns: max-content; }
.p4-chip { padding: 7px 11px; border-radius: 11px; background: ${T.cyanSoft}; color: ${T.navy}; font: 800 clamp(13px, 2.6vw, 17px) 'JetBrains Mono', monospace; animation: p4-drop .5s cubic-bezier(.22, 1.2, .36, 1) both; }
.p4-visual-track, .p4-visual-sheet { gap: 10px; }
.p4-track, .p4-sheet { display: flex; gap: 7px; }
.p4-track i, .p4-sheet i { display: block; width: 46px; height: 12px; border-radius: 4px; background: rgba(23, 59, 82, .1); animation: p4-drop .5s cubic-bezier(.22, 1.2, .36, 1) both; }
.p4-sheet { flex-direction: column; }
.p4-sheet i { width: 168px; }
.p4-visual-bridge { grid-auto-flow: column; grid-auto-columns: max-content; align-items: center; }
.p4-visual-bridge > em { grid-column: 1 / -1; }
.p4-bridge-side { padding: 6px 10px; border-radius: 10px; background: ${T.cyanSoft}; color: ${T.cyan}; font: 800 12px 'Manrope', sans-serif; }
.p4-bridge-arrow { color: ${T.accent}; font-weight: 800; }
.p4-visual-console { justify-items: stretch; }
.p4-console-row { display: flex; align-items: center; gap: 8px; padding: 6px 10px; border-radius: 10px; background: ${T.warnSoft}; color: #8A5C10; font: 700 clamp(12px, 2.4vw, 14px) 'JetBrains Mono', monospace; animation: p4-drop .5s cubic-bezier(.22, 1.2, .36, 1) both; }
.p4-console-row b { display: grid; place-items: center; width: 18px; height: 18px; border-radius: 50%; background: ${T.warn}; color: #fff; font-size: 11px; }

.p4-options { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 9px; }
.p4-option { display: flex; align-items: center; gap: 9px; min-width: 44px; min-height: 56px; padding: 10px 12px; text-align: left; border: 1px solid rgba(23, 59, 82, .12); border-radius: 14px; background: ${T.paper}; color: ${T.ink}; font: 700 clamp(13px, 1.9vw, 15px)/1.35 'Manrope', sans-serif; cursor: pointer; transition: transform .16s, border-color .2s, background .2s; }
.p4-option:hover:not(:disabled) { border-color: rgba(22, 143, 163, .4); transform: translateY(-2px); }
.p4-letter { flex: 0 0 26px; display: grid; place-items: center; width: 26px; height: 26px; border-radius: 8px; background: ${T.cyanSoft}; color: ${T.cyan}; font: 800 11px 'JetBrains Mono', monospace; }
.p4-option.is-on { border-color: ${T.accent}; background: ${T.accentSoft}; }
.p4-option.is-ok { border-color: rgba(34, 122, 83, .4); background: ${T.successSoft}; color: ${T.success}; }
.p4-option.is-ok .p4-letter { background: ${T.success}; color: #fff; }
.p4-option.is-no { border-color: rgba(169, 111, 19, .4); background: ${T.warnSoft}; color: ${T.warn}; }
.p4-option.is-no .p4-letter { background: ${T.warn}; color: #fff; }

.p4-match-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 7px; }
.p4-match-col { display: grid; gap: 8px; }
.p4-match button, .p4-order button, .p4-slots button { min-width: 44px; min-height: 48px; padding: 8px 10px; border: 1px solid rgba(23, 59, 82, .12); border-radius: 12px; background: ${T.paper}; color: ${T.navy}; font: 700 clamp(12px, 1.9vw, 14px)/1.3 'Manrope', sans-serif; cursor: pointer; transition: transform .16s, border-color .2s, background .2s; }
.p4-match button:hover:not(:disabled), .p4-order button:hover:not(:disabled), .p4-slots button:hover:not(:disabled) { border-color: rgba(22, 143, 163, .4); transform: translateY(-2px); }
.p4-match button.is-active, .p4-order button.is-active, .p4-slots button.is-active { border-color: ${T.accent}; background: ${T.accentSoft}; }
.p4-match button.is-tied, .p4-slots button.is-tied { border-color: rgba(34, 122, 83, .35); }
.p4-match button small { display: block; margin-top: 3px; color: ${T.success}; font-size: 11px; }
.p4-match button.is-used, .p4-card.is-used { background: ${T.successSoft}; opacity: .62; }

.p4-order-slots, .p4-slot-list { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 7px; margin-top: 7px; }
.p4-order-slots button, .p4-slot { display: grid; gap: 3px; place-items: center; }
.p4-order-slots small, .p4-slot small { color: ${T.ink3}; font-size: 10px; }
.p4-order-slots b, .p4-slot b { font: 800 clamp(11px, 1.8vw, 13px) 'JetBrains Mono', monospace; }
.p4-card-bank { display: flex; flex-wrap: wrap; justify-content: center; gap: 7px; margin-top: 8px; }

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
  .p4-order-slots, .p4-slot-list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .p4-visual-cards { grid-auto-flow: row; grid-auto-columns: auto; }
  .p4-root > header { padding-top: 54px; }
}
@media (max-width: 640px) and (max-height: 700px) {
  .p4-root > header { padding: 40px 10px 3px !important; }
  .p4-root > main { padding: 1px 8px !important; }
  .p4-task { gap: 5px !important; }
  .p4-setup { font-size: 12px; line-height: 1.3; }
  .p4-task h2 { font-size: 16px !important; }
  .p4-visual { min-height: 76px !important; padding: 8px 10px !important; }
  .p4-visual strong { font-size: 18px; }
  .p4-options { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 5px !important; }
  .p4-option, .p4-match button, .p4-order button, .p4-slots button { min-height: 44px !important; padding: 5px 8px !important; font-size: 12px !important; }
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
