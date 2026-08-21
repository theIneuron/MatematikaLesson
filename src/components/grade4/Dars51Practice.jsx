// ============================================================================
// 4-SINF · 51-DARS AMALIYOTI · YAKUNIY TAKRORLASH
// 10 topshiriq · UZ/RU/EN · ovozsiz · solve-to-advance.
//
// Skelet: src/books/grade4/AMALIYOT_41_51_SKELET.md §14.
// Mexanika raskladkasi: scripts/grade4-practice-41-51-layout.mjs
//   ticks · shade · slots · missing · numpad · mc · slots · shade · mc · numpad
//
// Infratuzilma fayl ichida: LMS lokal importni ko'tarmaydi (CLAUDE.md §5 dan
// ongli chekinish, sabab 41-dars amaliyoti shapkasida).
//
// NAZARIYADAN FARQ. Nazariy dars 305 026, 692 503 + 243 497, 240 : 4 · 3,
// 4 m 56 cm = 456 cm va 7 × 5 to'rtburchagini (P = 24, S = 35) ishlatgan;
// bu yerda boshqa sonlar.
//
// YADRO. Har topshiriq avval SAVOL NIMANI SO'RAYDI degan qadamdan boshlanadi:
// 07-topshiriq aynan model tanlashga bag'ishlangan, 08 va 09 esa perimetr va
// yuzani ajratadi — bu ikkisi chalkashishi eng ko'p uchraydigan joy.
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
  title: b('Урок 51. Практика: итоговое повторение', '51-dars. Amaliyot: yakuniy takrorlash', 'Lesson 51. Practice: final revision'),
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
  slotHint: b('Выбери место, потом карточку.', 'Avval joyni, keyin kartani tanlang.', 'Choose a place, then a card.'),
  shadeHint: b('Нажимай на клетки.', 'Kataklarni bosing.', 'Tap the cells.'),
  tickHint: b('Нажми на деление числовой оси.', "Son o'qining bo'linmasiga bosing.", 'Tap a mark on the number line.'),
};

const LESSON_META = {
  lessonId: 'final-4-51-practice',
  lessonTitle: UI.title,
  grade: 4,
  lessonNumber: 51,
  activityType: 'practice',
  taskCount: 10,
  resultIsUiState: true,
  progression: { green: 2, yellow: 5, red: 3 },
};

const SCREEN_META = [
  { id: 'practice-01', taskId: '01', template: 'number-line', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-02', taskId: '02', template: 'area-shading', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-03', taskId: '03', template: 'place-value', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-04', taskId: '04', template: 'column-blank', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-05', taskId: '05', template: 'numeric-input', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-06', taskId: '06', template: 'unit-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-07', taskId: '07', template: 'model-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-08', taskId: '08', template: 'boundary-shading', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-09', taskId: '09', template: 'error-analysis', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-10', taskId: '10', template: 'strategy-transfer', type: 'practice', scored: true, scope: 'final' },
];

const TASKS = [
  {
    id: '01', level: 'green', kind: 'ticks', skillTag: 'place_value_line', answer: '450000',
    visual: { type: 'scale', min: 400000, max: 500000, intervals: 4, showAll: false },
    setup: b(
      'Главный пульт собирает отчёт. Ось подписана только по краям.',
      "Bosh pult hisobot yig'moqda. O'q faqat chetlarda imzolangan.",
      'The main console is putting a report together. The axis is labelled only at the ends.',
    ),
    prompt: b(
      'Нажми деление, которое показывает 450 000.',
      "450 000 ni ko'rsatadigan bo'linmaga bosing.",
      'Tap the mark that shows 450,000.',
    ),
    wrong: [b(
      'Сначала находят цену деления: разность краёв делят на число делений.',
      "Avval bo'linma qiymati topiladi: chetlar farqi bo'linmalar soniga bo'linadi.",
      'First find the value of one interval: divide the difference of the ends by the number of intervals.',
    )],
    secondHint: b(
      'Разность краёв равна 100 000, а делений четыре.',
      "Chetlar farqi 100 000 ga teng, bo'linmalar esa to'rtta.",
      'The difference of the ends is 100,000 and there are four intervals.',
    ),
    thirdHint: b(
      '100 000 : 4 = 25 000, значит 450 000 — это второе деление.',
      "100 000 : 4 = 25 000, demak 450 000 — ikkinchi bo'linma.",
      '100,000 : 4 = 25,000, so 450,000 is the second mark.',
    ),
    correctText: b(
      'Верно. Цена деления 25 000, и 450 000 стоит ровно посередине.',
      "To'g'ri. Bo'linma qiymati 25 000, 450 000 esa aynan o'rtada turadi.",
      'Correct. Each interval is 25,000, and 450,000 is exactly in the middle.',
    ),
    rule: b(
      'Место числа на оси находят через цену деления.',
      "Sonning o'qdagi o'rni bo'linma qiymati orqali topiladi.",
      'The place of a number on the axis is found through the value of one interval.',
    ),
  },

  {
    id: '02', level: 'green', kind: 'shade', skillTag: 'area_by_cells', selectCount: 12,
    visual: { type: 'cells', cols: 6, total: 24, filled: 0 },
    setup: b(
      'Пульт просит показать площадь прямоугольника со сторонами 4 и 3 клетки.',
      "Pult tomonlari 4 va 3 katak bo'lgan to'rtburchakning yuzasini ko'rsatishni so'radi.",
      'The console asks to show the area of a rectangle with sides of 4 and 3 cells.',
    ),
    prompt: b(
      'Закрась столько клеток, чему равна площадь.',
      "Yuza nechaga teng bo'lsa, shuncha katakni bo'yang.",
      'Shade as many cells as the area equals.',
    ),
    wrong: [b(
      'Площадь считают умножением сторон, а не их сложением.',
      "Yuza tomonlarni qo'shish bilan emas, ko'paytirish bilan hisoblanadi.",
      'Area is found by multiplying the sides, not by adding them.',
    )],
    secondHint: b(
      'В прямоугольнике три ряда по четыре клетки.',
      "To'rtburchakda to'rtta katakdan uchta qator bor.",
      'The rectangle has three rows of four cells.',
    ),
    thirdHint: b('4 × 3 = 12.', '4 × 3 = 12.', '4 × 3 = 12.'),
    correctText: b(
      'Верно. Площадь равна 12 клеткам.',
      "To'g'ri. Yuza 12 katakka teng.",
      'Correct. The area is 12 cells.',
    ),
    rule: b(
      'Площадь прямоугольника равна произведению сторон.',
      "To'rtburchakning yuzasi tomonlar ko'paytmasiga teng.",
      'The area of a rectangle equals the product of its sides.',
    ),
  },

  {
    id: '03', level: 'yellow', kind: 'slots', skillTag: 'words_to_digits',
    setup: b(
      'Диспетчер передал число словами: четыреста пять тысяч двадцать шесть.',
      "Dispetcher sonni so'z bilan aytdi: to'rt yuz besh ming yigirma olti.",
      'The dispatcher gave the number in words: four hundred five thousand twenty-six.',
    ),
    prompt: b('Собери число по классам.', 'Sonni sinflar bo\'yicha tuzing.', 'Build the number by its groups.'),
    slots: [
      {
        id: 'thousands', label: b('Класс тысяч', 'Minglar sinfi', 'Thousands group'), correct: 'four-o-five',
        wrong: b(
          'В классе тысяч стоит то, что читается перед словом «тысяч».',
          "Minglar sinfida «ming» so'zidan oldin o'qiladigan qism turadi.",
          'The thousands group holds what is read before the word thousand.',
        ),
      },
      {
        id: 'ones', label: b('Класс единиц', 'Birlar sinfi', 'Ones group'), correct: 'o-two-six',
        wrong: b(
          'В классе единиц всегда три разряда, поэтому впереди нужен нуль.',
          "Birlar sinfida har doim uchta xona bor, shuning uchun oldida nol kerak.",
          'The ones group always has three places, so a zero is needed in front.',
        ),
      },
    ],
    cards: [
      { id: 'four-o-five', text: b('405', '405', '405') },
      { id: 'o-two-six', text: b('026', '026', '026') },
      { id: 'four-fifty', text: b('450', '450', '450') },
      { id: 'two-sixty', text: b('260', '260', '260') },
      { id: 'o-four-five', text: b('045', '045', '045') },
      { id: 'six-twenty', text: b('620', '620', '620') },
    ],
    wrong: [b(
      'Читай число по классам: сначала тысячи, потом единицы.',
      "Sonni sinflar bo'yicha o'qing: avval minglar, keyin birlar.",
      'Read the number by groups: the thousands first, then the ones.',
    )],
    secondHint: b(
      'Двадцать шесть — это две цифры, а разрядов в классе три.',
      "Yigirma olti — ikki raqam, sinfda esa uchta xona bor.",
      'Twenty-six is two digits, but a group has three places.',
    ),
    thirdHint: b(
      'Пустой разряд занимает нуль: 026.',
      "Bo'sh xonani nol egallaydi: 026.",
      'A zero holds the empty place: 026.',
    ),
    correctText: b(
      'Верно. Получилось 405 026.',
      "To'g'ri. 405 026 hosil bo'ldi.",
      'Correct. The number is 405,026.',
    ),
    rule: b(
      'В классе всегда три разряда, и нуль в записи обязателен.',
      "Sinfda har doim uchta xona bor, yozuvdagi nol majburiy.",
      'A group always has three places, and the zero must be written.',
    ),
  },

  {
    id: '04', level: 'yellow', kind: 'missing', skillTag: 'column_add', answer: '8', maxLen: 1,
    visual: { type: 'record', text: '374 508 + 261 □92 = 636 400' },
    setup: b(
      'В отчёте одна цифра слагаемого стёрлась.',
      "Hisobotda qo'shiluvchining bitta raqami o'chib ketgan.",
      'One digit of an addend has been rubbed out in the report.',
    ),
    prompt: b('Какая цифра пропущена?', 'Qaysi raqam tushib qolgan?', 'Which digit is missing?'),
    wrong: [b(
      'Пропущенную цифру находят обратным действием: из суммы вычитают известное слагаемое.',
      "Tushib qolgan raqam teskari amal bilan topiladi: yig'indidan ma'lum qo'shiluvchi ayiriladi.",
      'The missing digit is found by the inverse action: subtract the known addend from the sum.',
    )],
    secondHint: b(
      '636 400 − 374 508 даёт всё второе слагаемое.',
      "636 400 − 374 508 ikkinchi qo'shiluvchining butunini beradi.",
      '636,400 − 374,508 gives the whole second addend.',
    ),
    thirdHint: b(
      '636 400 − 374 508 = 261 892, значит пропущена цифра 8.',
      "636 400 − 374 508 = 261 892, demak 8 raqami tushib qolgan.",
      '636,400 − 374,508 = 261,892, so the missing digit is 8.',
    ),
    correctText: b(
      'Верно. Второе слагаемое равно 261 892.',
      "To'g'ri. Ikkinchi qo'shiluvchi 261 892 ga teng.",
      'Correct. The second addend is 261,892.',
    ),
    rule: b(
      'Пропуск в сумме находят вычитанием.',
      "Yig'indidagi bo'shliq ayirish bilan topiladi.",
      'A gap in a sum is found by subtraction.',
    ),
  },

  {
    id: '05', level: 'yellow', kind: 'numpad', skillTag: 'part_of_number', answer: '300', maxLen: 3,
    visual: { type: 'cells', cols: 8, total: 8, filled: 5 },
    setup: b(
      'На складе 480 контейнеров, и лента разделена на восемь долей.',
      "Omborda 480 konteyner bor, lenta sakkizta ulushga bo'lingan.",
      'The store has 480 containers and the strip is divided into eight shares.',
    ),
    prompt: b(
      'Сколько контейнеров составляют пять восьмых?',
      'Besh sakkizdan qism necha konteynerni tashkil qiladi?',
      'How many containers are five eighths?',
    ),
    wrong: [b(
      'Сначала одна доля, потом столько долей, сколько в числителе.',
      "Avval bitta ulush, keyin suratdagi songa teng ulush.",
      'First one share, then as many shares as the numerator.',
    )],
    secondHint: b(
      'Одна восьмая равна 60 контейнерам.',
      "Sakkizdan bir qism 60 konteynerga teng.",
      'One eighth is 60 containers.',
    ),
    thirdHint: b('480 : 8 = 60, затем 60 × 5 = 300.', "480 : 8 = 60, keyin 60 × 5 = 300.", '480 : 8 = 60, then 60 × 5 = 300.'),
    correctText: b(
      'Верно. 480 : 8 = 60, и 60 × 5 = 300.',
      "To'g'ri. 480 : 8 = 60, va 60 × 5 = 300.",
      'Correct. 480 : 8 = 60, and 60 × 5 = 300.',
    ),
    rule: b(
      'Часть числа находят делением на знаменатель и умножением на числитель.',
      "Sonning qismi maxrajga bo'lib, suratga ko'paytirish bilan topiladi.",
      'A part of a number is found by dividing by the denominator and multiplying by the numerator.',
    ),
  },

  {
    id: '06', level: 'yellow', kind: 'mc', skillTag: 'unit_convert',
    visual: { type: 'record', text: '5 m 8 cm = ? cm' },
    setup: b(
      'Отчёт требует одну единицу измерения.',
      "Hisobot bitta o'lchov birligini talab qiladi.",
      'The report needs a single unit of measurement.',
    ),
    prompt: b('Сколько это сантиметров?', 'Bu necha santimetr?', 'How many centimetres is that?'),
    options: [
      option('508', '508 см', '508 cm', '508 cm', true),
      option('58', '58 см', '58 cm', '58 cm', false,
        'Так получилось бы, если считать метр десятью сантиметрами.',
        "Bu metrni o'n santimetr deb hisoblaganda chiqadi.",
        'That happens if a metre is counted as ten centimetres.'),
      option('580', '580 см', '580 cm', '580 cm', false,
        'Здесь восемь сантиметров превратились в восемьдесят.',
        "Bu yerda sakkiz santimetr sakson bo'lib qolgan.",
        'Here the eight centimetres have turned into eighty.'),
      option('5008', '5008 см', '5008 cm', '5,008 cm', false,
        'Метр содержит 100 сантиметров, а не 1000.',
        'Metrda 1000 emas, 100 santimetr bor.',
        'A metre contains 100 centimetres, not 1,000.'),
    ],
    secondHint: b(
      'В одном метре 100 сантиметров.',
      'Bir metrda 100 santimetr bor.',
      'There are 100 centimetres in one metre.',
    ),
    thirdHint: b('5 × 100 + 8 = 508.', '5 × 100 + 8 = 508.', '5 × 100 + 8 = 508.'),
    correctText: b(
      'Верно. 5 × 100 + 8 = 508 сантиметров.',
      "To'g'ri. 5 × 100 + 8 = 508 santimetr.",
      'Correct. 5 × 100 + 8 = 508 centimetres.',
    ),
    rule: b(
      'Каждую часть смешанной записи переводят по своему отношению.',
      "Aralash yozuvning har qismi o'z munosabati bo'yicha aylantiriladi.",
      'Each part of a mixed record is converted by its own relationship.',
    ),
  },

  {
    id: '07', level: 'yellow', kind: 'slots', skillTag: 'model_choice',
    setup: b(
      'Стороны прямоугольника обозначены буквами a и b.',
      "To'rtburchakning tomonlari a va b harflari bilan belgilangan.",
      'The sides of a rectangle are marked with the letters a and b.',
    ),
    prompt: b('Поставь формулу к своей величине.', 'Formulani o\'z kattaligiga qo\'ying.', 'Put each formula with its quantity.'),
    slots: [
      {
        id: 'perimeter', label: b('Периметр', 'Perimetr', 'Perimeter'), correct: 'p-formula',
        wrong: b(
          'Периметр — это длина границы, поэтому складывают стороны.',
          "Perimetr — chegara uzunligi, shuning uchun tomonlar qo'shiladi.",
          'The perimeter is the length of the border, so the sides are added.',
        ),
      },
      {
        id: 'area', label: b('Площадь', 'Yuza', 'Area'), correct: 's-formula',
        wrong: b(
          'Площадь — это число клеток внутри, поэтому стороны умножают.',
          "Yuza — ichidagi kataklar soni, shuning uchun tomonlar ko'paytiriladi.",
          'The area is the number of cells inside, so the sides are multiplied.',
        ),
      },
    ],
    cards: [
      { id: 'p-formula', text: b('(a + b) · 2', '(a + b) · 2', '(a + b) · 2') },
      { id: 's-formula', text: b('a · b', 'a · b', 'a · b') },
      { id: 'half-sum', text: b('a + b', 'a + b', 'a + b') },
      { id: 'square-p', text: b('a · 4', 'a · 4', 'a · 4') },
      { id: 'double', text: b('a + a', 'a + a', 'a + a') },
      { id: 'half-area', text: b('(a · b) : 2', '(a · b) : 2', '(a · b) : 2') },
    ],
    wrong: [b(
      'Сначала решают, о чём вопрос: о границе или о том, что внутри.',
      "Avval savol nima haqida ekani aniqlanadi: chegara haqidami yoki ichkarisi haqidami.",
      'First decide what the question is about: the border or what is inside.',
    )],
    secondHint: b(
      'Формула a + b даёт только половину границы.',
      "a + b formulasi chegaraning faqat yarmini beradi.",
      'The formula a + b gives only half of the border.',
    ),
    thirdHint: b(
      'Формула a · 4 подходит только квадрату.',
      "a · 4 formulasi faqat kvadratga mos keladi.",
      'The formula a · 4 suits only a square.',
    ),
    correctText: b(
      'Верно. Периметр складывает, площадь умножает.',
      "To'g'ri. Perimetr qo'shadi, yuza ko'paytiradi.",
      'Correct. The perimeter adds and the area multiplies.',
    ),
    rule: b(
      'Модель выбирают по вопросу, а не по числам.',
      'Model savolga qarab tanlanadi, sonlarga qarab emas.',
      'The model is chosen from the question, not from the numbers.',
    ),
  },

  {
    id: '08', level: 'red', kind: 'shade', skillTag: 'perimeter_equals_area', selectCount: 16,
    visual: { type: 'cells', cols: 6, total: 24, filled: 0 },
    setup: b(
      'У квадрата сторона 4 клетки. Периметр такого квадрата равен 16.',
      "Kvadratning tomoni 4 katak. Bunday kvadratning perimetri 16 ga teng.",
      'A square has a side of 4 cells. The perimeter of such a square is 16.',
    ),
    prompt: b(
      'Закрась столько клеток, чему равна площадь квадрата.',
      "Kvadratning yuzasi nechaga teng bo'lsa, shuncha katakni bo'yang.",
      'Shade as many cells as the area of the square equals.',
    ),
    wrong: [b(
      'Периметр и площадь считают разными действиями, даже если числа совпали.',
      "Perimetr va yuza turli amallar bilan hisoblanadi, hatto sonlar to'g'ri kelsa ham.",
      'Perimeter and area are found by different actions, even when the numbers coincide.',
    )],
    secondHint: b(
      'Площадь квадрата — это сторона, умноженная на сторону.',
      "Kvadratning yuzasi — tomonni tomonga ko'paytirish.",
      'The area of a square is the side multiplied by the side.',
    ),
    thirdHint: b('4 × 4 = 16.', '4 × 4 = 16.', '4 × 4 = 16.'),
    correctText: b(
      'Верно. Здесь площадь тоже 16, но это 16 клеток, а периметр — 16 сторон клеток.',
      "To'g'ri. Bu yerda yuza ham 16, lekin bu 16 katak, perimetr esa 16 katak tomoni.",
      'Correct. Here the area is 16 too, but that is 16 cells, while the perimeter is 16 cell sides.',
    ),
    rule: b(
      'Одинаковое число не делает периметр и площадь одной величиной.',
      "Bir xil son perimetr va yuzani bitta kattalik qilib qo'ymaydi.",
      'The same number does not make perimeter and area the same quantity.',
    ),
  },

  {
    id: '09', level: 'red', kind: 'mc', skillTag: 'perimeter_vs_area',
    visual: { type: 'record', text: 'P = 6 · 4 = 24', error: true },
    setup: b(
      'В отчёте записали периметр прямоугольника со сторонами 6 и 4 клетки.',
      "Hisobotda tomonlari 6 va 4 katak bo'lgan to'rtburchakning perimetri yozilgan.",
      'The report gives the perimeter of a rectangle with sides of 6 and 4 cells.',
    ),
    prompt: b('В чём ошибка?', 'Xato nimada?', 'What is the error?'),
    options: [
      option('area-formula', 'Взята формула площади, а периметр равен (6 + 4) · 2 = 20', "Yuza formulasi olingan, perimetr esa (6 + 4) · 2 = 20", 'The area formula was used; the perimeter is (6 + 4) · 2 = 20', true),
      option('arithmetic', 'Ошибка в умножении', "Ko'paytirishda xato bor", 'There is an error in the multiplication', false,
        '6 · 4 действительно равно 24: счёт верный, неверна сама формула.',
        "6 · 4 haqiqatan 24 ga teng: hisob to'g'ri, formulaning o'zi noto'g'ri.",
        '6 · 4 really is 24: the calculation is right and the formula is wrong.'),
      option('unit', 'Не написана единица измерения', "O'lchov birligi yozilmagan", 'The unit of measurement is missing', false,
        'Единица тоже нужна, но главная ошибка в выборе формулы.',
        "Birlik ham kerak, lekin asosiy xato formulani tanlashda.",
        'The unit is needed too, but the main error is in the choice of formula.'),
      option('half', 'Периметр равен 6 + 4 = 10', 'Perimetr 6 + 4 = 10 ga teng', 'The perimeter is 6 + 4 = 10', false,
        'Это только половина границы: у прямоугольника по две таких стороны.',
        "Bu chegaraning faqat yarmi: to'rtburchakda bunday tomonlar ikkitadan.",
        'That is only half of the border: a rectangle has two of each side.'),
    ],
    secondHint: b(
      'Проверь, какая формула считает границу, а какая внутреннюю часть.',
      'Qaysi formula chegarani, qaysi biri ichkarisini hisoblashini tekshiring.',
      'Check which formula counts the border and which one the inside.',
    ),
    thirdHint: b(
      'Умножение сторон даёт площадь 24 клетки, а не периметр.',
      "Tomonlarni ko'paytirish 24 katak yuzani beradi, perimetrni emas.",
      'Multiplying the sides gives an area of 24 cells, not the perimeter.',
    ),
    correctText: b(
      'Верно. Периметр равен 20, а 24 — это площадь.',
      "To'g'ri. Perimetr 20 ga teng, 24 esa yuza.",
      'Correct. The perimeter is 20 and 24 is the area.',
    ),
    rule: b(
      'Сначала выбирают величину, потом формулу, и только потом считают.',
      'Avval kattalik, keyin formula tanlanadi, va faqat keyin hisoblanadi.',
      'First choose the quantity, then the formula, and only then calculate.',
    ),
  },

  {
    id: '10', level: 'red', kind: 'numpad', skillTag: 'final_transfer', answer: '20200', maxLen: 5,
    visual: { type: 'record', text: '12 400 + 9 600 − 1 800 = ?' },
    setup: b(
      'Из первого района пришло 12 400 отчётов, из второго 9 600. Из них 1 800 оказались повторными.',
      "Birinchi hududdan 12 400 hisobot, ikkinchisidan 9 600 hisobot keldi. Ulardan 1 800 tasi takroriy chiqdi.",
      'The first district sent 12,400 reports and the second 9,600. Of these, 1,800 turned out to be duplicates.',
    ),
    prompt: b(
      'Сколько отчётов осталось в итоговом отчёте?',
      'Yakuniy hisobotda nechta hisobot qoldi?',
      'How many reports are left in the final report?',
    ),
    wrong: [b(
      'Сначала складывают оба района, и только потом убирают повторные.',
      "Avval ikki hudud qo'shiladi, keyin takroriylar olib tashlanadi.",
      'First add the two districts, and only then remove the duplicates.',
    )],
    secondHint: b(
      '12 400 + 9 600 = 22 000.',
      '12 400 + 9 600 = 22 000.',
      '12,400 + 9,600 = 22,000.',
    ),
    thirdHint: b('22 000 − 1 800 = 20 200.', '22 000 − 1 800 = 20 200.', '22,000 − 1,800 = 20,200.'),
    correctText: b(
      'Верно. 22 000 — промежуточное значение, а ответ 20 200.',
      "To'g'ri. 22 000 — oraliq qiymat, javob esa 20 200.",
      'Correct. 22,000 is the intermediate value and the answer is 20,200.',
    ),
    rule: b(
      'Итоговый отчёт собирают по порядку: сначала сумма, потом поправка.',
      "Yakuniy hisobot tartib bilan yig'iladi: avval yig'indi, keyin tuzatish.",
      'A final report is put together in order: the sum first, then the correction.',
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

// Son o'qi. Chetlar imzolangan, oraliq bo'linmalar esa nuqta bilan berilgan:
// bola bo'linma qiymatini o'zi hisoblaydi.
function ScaleModel({ visual, picked, onPick, disabled, hint }) {
  const { min, max, intervals, showAll = false } = visual;
  const step = (max - min) / intervals;
  const values = Array.from({ length: intervals + 1 }, (_, index) => min + step * index);
  // Sinf ajratkichi qo'lda qo'yiladi: toLocaleString uzilmas bo'shliq beradi.
  const label = (value) => String(value).replace(/[0-9](?=(?:[0-9]{3})+$)/g, '$& ');
  return (
    <div className={`p4-scale ${hint ? 'is-hint' : ''}`}>
      <div className="p4-scale-axis">
        {values.map((value, index) => {
          const edge = index === 0 || index === intervals;
          return (
            <div className="p4-scale-tick" style={{ left: `${(index / intervals) * 100}%` }} key={value}>
              <button
                type="button"
                disabled={disabled}
                aria-label={String(value)}
                aria-pressed={picked === String(value)}
                className={picked === String(value) ? 'is-picked' : ''}
                onClick={() => onPick(String(value))}
              >{showAll || edge ? label(value) : '·'}</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Katakli maydon: yuza sanoq bilan tekshiriladi, katakning O'RNI muhim emas.
function Cells({ visual, selected = [], onToggle, disabled = false, resolved = false }) {
  return (
    <div className="p4-cells" style={{ '--p4-cols': visual.cols }}>
      {Array.from({ length: visual.total }, (_, index) => {
        const given = index < visual.filled;
        const picked = selected.includes(index);
        const className = [
          'p4-cell',
          given ? 'is-given' : '',
          picked ? (resolved ? 'is-success' : 'is-picked') : '',
        ].filter(Boolean).join(' ');
        return onToggle && !disabled && !given
          ? (
            <button
              type="button"
              key={index}
              className={className}
              data-cell={String(index)}
              aria-pressed={picked}
              aria-label={String(index + 1)}
              onClick={() => onToggle(index)}
            />
          )
          : <span key={index} className={className} aria-hidden="true" />;
      })}
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
  const [pickedId, setPickedId] = useState(null);
  const [picked, setPicked] = useState(null);
  const [typed, setTyped] = useState('');
  const [selected, setSelected] = useState([]);
  const [filled, setFilled] = useState({});
  const [activeSlot, setActiveSlot] = useState(null);
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
  const bankCards = useMemo(() => shuffle(task.cards || []), [shuffleSeed, task.id, task.cards]);

  useEffect(() => {
    if (checked) window.setTimeout(() => feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 120);
  }, [checked]);

  const answerReady = (() => {
    if (task.kind === 'mc') return pickedId !== null;
    if (task.kind === 'ticks') return picked !== null;
    if (task.kind === 'numpad' || task.kind === 'missing') return typed.length > 0;
    if (task.kind === 'shade') return selected.length > 0;
    return task.slots.every((slot) => filled[slot.id]);
  })();

  const answerCorrect = () => {
    if (task.kind === 'mc') return task.options.find((item) => item.id === pickedId)?.correct === true;
    if (task.kind === 'ticks') return picked === task.answer;
    if (task.kind === 'numpad' || task.kind === 'missing') return typed === task.answer;
    if (task.kind === 'shade') return selected.length === task.selectCount;
    return task.slots.every((slot) => filled[slot.id] === slot.correct);
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
    setChecked(false); setPickedId(null); setPicked(null); setTyped(''); setSelected([]);
    setFilled({}); setActiveSlot(null);
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
    if (task.kind === 'numpad' || task.kind === 'missing') return { value: typed };
    if (task.kind === 'shade') return { selectedCount: selected.length, cells: [...selected].sort((a, c) => a - c) };
    return { slots: filled };
  })();

  const correctAnswer = (() => {
    if (task.kind === 'mc') {
      const item = task.options.find((candidate) => candidate.correct);
      return { optionId: item.id, text: item.text };
    }
    if (task.kind === 'ticks' || task.kind === 'numpad' || task.kind === 'missing') return { value: task.answer };
    if (task.kind === 'shade') return { selectedCount: task.selectCount };
    return { slots: Object.fromEntries(task.slots.map((slot) => [slot.id, slot.correct])) };
  })();

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

      {task.visual?.type === 'record' && <div className="p4-visual"><RecordCard visual={task.visual} /></div>}
      {task.visual?.type === 'cells' && task.kind !== 'shade' && (
        <div className="p4-visual"><Cells visual={task.visual} /></div>
      )}

      <h2 id={`task-${task.id}`} className="p4-ask">{tx(task.prompt, lang)}</h2>

      {task.kind === 'ticks' && (
        <div className="p4-visual">
          <ScaleModel
            visual={task.visual}
            picked={picked}
            onPick={(value) => setAnswer(setPicked, value)}
            disabled={solved}
            hint={hintLevel >= 2}
          />
          <p className="p4-note">{tx(UI.tickHint, lang)}</p>
        </div>
      )}

      {task.kind === 'shade' && (
        <div className="p4-visual">
          <Cells
            visual={task.visual}
            selected={selected}
            onToggle={(index) => setAnswer(setSelected, selected.includes(index) ? selected.filter((value) => value !== index) : [...selected, index])}
            disabled={solved}
            resolved={solved}
          />
          <p className="p4-note">{tx(UI.shadeHint, lang)}</p>
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

      {(task.kind === 'numpad' || task.kind === 'missing') && (
        <NumPad value={typed} onChange={(value) => setAnswer(setTyped, value)} max={task.maxLen || 5} disabled={solved} lang={lang} />
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

      {checked && (
        <Feedback
          feedbackRef={feedbackRef}
          ok={solved}
          text={solved ? task.correctText : adaptive(task, pickedOption, attempts, customWrong)}
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
                  : task.cards ?? null,
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

export default function Grade4Dars51Practice({ studentName, lang: langProp, onFinished }) {
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
.p4-scale{width:min(100%,470px);padding:14px 30px 58px}
.p4-scale.is-hint .p4-scale-axis{box-shadow:0 0 0 5px rgba(255,91,53,.16)}
.p4-scale-axis{position:relative;width:100%;height:5px;border-radius:99px;background:${T.navy}}
.p4-scale-tick{position:absolute;top:50%;transform:translate(-50%,-50%);width:3px;height:20px;border-radius:2px;background:${T.cyan}}
.p4-scale-tick button{position:absolute;top:18px;left:50%;transform:translateX(-50%);min-width:44px;min-height:44px;padding:2px;border:0;border-radius:10px;background:transparent;color:${T.navy};font:800 11px 'JetBrains Mono',monospace;white-space:nowrap;cursor:pointer}
.p4-scale-tick button:hover:not(:disabled),.p4-scale-tick button.is-picked{background:${T.accentSoft};color:${T.accent}}
.p4-cells{display:grid;grid-template-columns:repeat(var(--p4-cols),1fr);gap:4px;width:min(100%,360px)}
.p4-cell{min-width:0;aspect-ratio:1;padding:0;border:0;border-radius:7px;background:${T.cyanSoft};box-shadow:inset 0 0 0 1px rgba(22,143,163,.2)}
.p4-cells button.p4-cell{cursor:pointer;background:#FBFBF8;box-shadow:inset 0 0 0 1px rgba(23,59,82,.14)}
.p4-cells button.p4-cell:hover:not(:disabled){box-shadow:inset 0 0 0 2px rgba(22,143,163,.45)}
.p4-cells .p4-cell.is-given{background:${T.cyan};box-shadow:none}
.p4-cells .p4-cell.is-picked{background:${T.accent};box-shadow:none}
.p4-cells .p4-cell.is-success{background:${T.success};box-shadow:none}
.p4-record{text-align:center;font:800 clamp(17px,3.6vw,26px) 'JetBrains Mono',monospace;color:${T.navy}}
.p4-record.is-error{color:${T.warn};text-decoration:line-through}
.p4-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
.p4-option{display:flex;align-items:center;gap:9px;min-width:44px;min-height:56px;padding:10px 12px;text-align:left;border:1px solid rgba(23,59,82,.12);border-radius:14px;background:${T.paper};color:${T.ink};font:700 clamp(12px,1.8vw,14px)/1.35 'Manrope',sans-serif;cursor:pointer;transition:transform .16s,border-color .2s,background .2s}
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
.p4-slot-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin-top:7px}
.p4-slot{display:grid;place-items:center;gap:4px;min-width:44px;min-height:70px;padding:8px;border:1px solid rgba(23,59,82,.12);border-radius:13px;background:${T.paper};color:${T.ink2};font-family:inherit;cursor:pointer}
.p4-slot.is-active{border-color:${T.accent};background:${T.accentSoft}}
.p4-slot.is-no{border-color:${T.warn};background:${T.warnSoft}}
.p4-slot small{font-weight:800;font-size:11px;text-align:center}
.p4-slot b{font:800 15px/1.25 'JetBrains Mono',monospace;color:${T.navy}}
.p4-card-bank{display:flex;flex-wrap:wrap;justify-content:center;gap:7px;margin-top:8px}
.p4-card{min-width:44px;min-height:46px;padding:8px 11px;border:1px solid rgba(23,59,82,.12);border-radius:12px;background:${T.paper};color:${T.navy};font:800 13px/1.3 'JetBrains Mono',monospace;cursor:pointer}
.p4-card.is-used{background:${T.cyanSoft};opacity:.7}
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
  .p4-slot-list{grid-template-columns:1fr}
  .p4-slot{min-height:62px;padding:6px}
  .p4-cells{width:min(100%,300px)}
  .p4-scale{padding:12px 26px 54px}
  .p4-scale-tick button{min-width:40px;font-size:10px}
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
  .p4-cells{width:min(100%,240px)}
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
