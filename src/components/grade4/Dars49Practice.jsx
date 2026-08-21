// ============================================================================
// 4-SINF · 49-DARS AMALIYOTI · MULOHAZALAR VA HUKMLAR
// 10 topshiriq · UZ/RU/EN · ovozsiz · solve-to-advance.
//
// Skelet: src/books/grade4/AMALIYOT_41_51_SKELET.md §12.
// Mexanika raskladkasi: scripts/grade4-practice-41-51-layout.mjs
//   sort · numpad · match · slots · numpad · missing · order · sort · mc · match
//
// Infratuzilma fayl ichida: LMS lokal importni ko'tarmaydi (CLAUDE.md §5 dan
// ongli chekinish, sabab 41-dars amaliyoti shapkasida).
//
// NAZARIYADAN FARQ. Nazariy dars 214 > 83, 56 - 48 = 18, 569 < 612,
// 657 + 203 = 650 + 203 va «1 soat = 60 minut» misollarini ishlatgan; bu yerda
// boshqa yozuvlar va boshqa gaplar.
//
// MODEL: xabar kartasi. Hukm (rost yoki yolg'on) HISOBDAN keyin chiqadi:
// model faqat gapni ko'rsatadi, javobni bermaydi.
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
  title: b('Урок 49. Практика: высказывания', '49-dars. Amaliyot: mulohazalar va hukmlar', 'Lesson 49. Practice: statements'),
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
  orderHint: b('Выбери место, потом карточку шага.', 'Avval joyni, keyin qadam kartasini tanlang.', 'Choose a position, then a step card.'),
  returnCard: b('Вернуть карточку', 'Kartani qaytarish', 'Return the card'),
};

const LESSON_META = {
  lessonId: 'logic-4-49-practice',
  lessonTitle: UI.title,
  grade: 4,
  lessonNumber: 49,
  activityType: 'practice',
  taskCount: 10,
  resultIsUiState: true,
  progression: { green: 2, yellow: 5, red: 3 },
};

const SCREEN_META = [
  { id: 'practice-01', taskId: '01', template: 'sorting', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-02', taskId: '02', template: 'numeric-input', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-03', taskId: '03', template: 'matching', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-04', taskId: '04', template: 'classification', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-05', taskId: '05', template: 'numeric-input', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-06', taskId: '06', template: 'numeric-blank', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-07', taskId: '07', template: 'ordering', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-08', taskId: '08', template: 'boundary-sorting', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-09', taskId: '09', template: 'error-analysis', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-10', taskId: '10', template: 'strategy-transfer', type: 'practice', scored: true, scope: 'final' },
];

const TASKS = [
  {
    id: '01', level: 'green', kind: 'sort', skillTag: 'statement_meaning',
    setup: b(
      'Модуль решений получил шесть сообщений.',
      'Qaror moduli olti xabar oldi.',
      'The decision module has received six messages.',
    ),
    prompt: b(
      'Разложи сообщения на высказывания и не высказывания.',
      'Xabarlarni mulohaza va mulohaza emasga ajratib joylashtiring.',
      'Sort the messages into statements and non-statements.',
    ),
    bins: [
      { id: 'statement', label: b('Высказывание', 'Mulohaza', 'A statement') },
      { id: 'other', label: b('Не высказывание', 'Mulohaza emas', 'Not a statement') },
    ],
    items: [
      { id: 'capital', bin: 'statement', text: b('Ташкент — столица Узбекистана.', "Toshkent — Uzbekistonning poytaxti.", 'Tashkent is the capital of Uzbekistan.') },
      { id: 'seven', bin: 'statement', text: b('Семь меньше двенадцати.', "Yetti o'n ikkidan kichik.", 'Seven is less than twelve.') },
      { id: 'square', bin: 'statement', text: b('У квадрата четыре равные стороны.', "Kvadratning to'rt tomoni teng.", 'A square has four equal sides.') },
      { id: 'command', bin: 'other', text: b('Открой тетрадь.', 'Daftarni oching.', 'Open your notebook.') },
      { id: 'question', bin: 'other', text: b('Какая сегодня погода?', 'Bugun havo qanday?', 'What is the weather like today?') },
      { id: 'wish', bin: 'other', text: b('Какой красивый узор!', 'Qanday chiroyli naqsh!', 'What a beautiful pattern!') },
    ],
    wrong: [b(
      'Высказыванием называют только то, о чём можно сказать «верно» или «неверно».',
      "Faqat «rost» yoki «yolg'on» deb aytish mumkin bo'lgan gap mulohaza deb ataladi.",
      'Only a sentence that can be called true or false is a statement.',
    )],
    secondHint: b(
      'Про вопрос нельзя сказать «верно» или «неверно».',
      "Savol haqida «rost» yoki «yolg'on» deb aytib bo'lmaydi.",
      'You cannot say true or false about a question.',
    ),
    thirdHint: b(
      'Приказ и восклицание тоже не оцениваются по верности.',
      "Buyruq va his-tuyg'u gapi ham rostlik bo'yicha baholanmaydi.",
      'A command and an exclamation are not judged for truth either.',
    ),
    correctText: b(
      'Верно. Высказывание — это повествовательное предложение, которое можно оценить.',
      "To'g'ri. Mulohaza — baholash mumkin bo'lgan darak gap.",
      'Correct. A statement is a declarative sentence that can be judged.',
    ),
    rule: b(
      'Высказывание можно оценить как верное или неверное.',
      "Mulohazani rost yoki yolg'on deb baholash mumkin.",
      'A statement can be judged true or false.',
    ),
  },

  {
    id: '02', level: 'green', kind: 'numpad', skillTag: 'numeric_check', answer: '47', maxLen: 3,
    visual: { type: 'record', text: '84 − 37 = ?' },
    setup: b(
      'Числовое высказывание проверяют счётом, а не догадкой.',
      'Sonli mulohaza taxmin bilan emas, hisob bilan tekshiriladi.',
      'A numerical statement is checked by calculating, not by guessing.',
    ),
    prompt: b('Чему равна разность?', 'Ayirma nechaga teng?', 'What is the difference?'),
    wrong: [b(
      'Разность считают до того, как выносят суждение.',
      'Ayirma hukm chiqarilishidan oldin hisoblanadi.',
      'The difference is calculated before the verdict is made.',
    )],
    secondHint: b(
      'Из 84 убирают 37.',
      "84 dan 37 olib tashlanadi.",
      '37 is taken from 84.',
    ),
    thirdHint: b('84 − 37 = 47.', '84 − 37 = 47.', '84 − 37 = 47.'),
    correctText: b(
      'Верно. Значит высказывание «84 − 37 = 47» истинно.',
      "To'g'ri. Demak «84 − 37 = 47» mulohazasi rost.",
      'Correct. So the statement 84 − 37 = 47 is true.',
    ),
    rule: b(
      'Числовое высказывание проверяют вычислением.',
      'Sonli mulohaza hisoblash bilan tekshiriladi.',
      'A numerical statement is checked by calculation.',
    ),
  },

  {
    id: '03', level: 'yellow', kind: 'match', skillTag: 'check_method',
    setup: b(
      'Каждое высказывание проверяют своим способом.',
      "Har mulohaza o'z usuli bilan tekshiriladi.",
      'Each statement is checked in its own way.',
    ),
    prompt: b('Соедини высказывание со способом проверки.', 'Mulohazani tekshirish usuli bilan ulang.', 'Match each statement to the way it is checked.'),
    pairs: [
      { id: 'sum', left: b('312 + 88 = 400', '312 + 88 = 400', '312 + 88 = 400'), correctRight: 'by-calculation' },
      { id: 'february', left: b('В феврале 30 дней.', 'Fevralda 30 kun bor.', 'February has 30 days.'), correctRight: 'by-calendar' },
      { id: 'square-rect', left: b('Каждый квадрат — прямоугольник.', "Har kvadrat to'g'ri to'rtburchak.", 'Every square is a rectangle.'), correctRight: 'by-rule' },
      { id: 'rect-square', left: b('Каждый прямоугольник — квадрат.', "Har to'g'ri to'rtburchak kvadrat.", 'Every rectangle is a square.'), correctRight: 'by-counterexample' },
    ],
    right: [
      { id: 'by-calculation', text: b('Вычислением', 'Hisoblash bilan', 'By calculating') },
      { id: 'by-calendar', text: b('По календарю', 'Taqvim bilan', 'By the calendar') },
      { id: 'by-rule', text: b('По определению', "Ta'rif bilan", 'By the definition') },
      { id: 'by-counterexample', text: b('Контрпримером', 'Qarshi misol bilan', 'By a counterexample') },
    ],
    wrong: [b(
      'Смотри, что нужно узнать: сумму, число дней, определение или один пример.',
      "Nima bilish kerakligiga qarang: yig'indi, kunlar soni, ta'rif yoki bitta misol.",
      'Look at what has to be found: a sum, a number of days, a definition or one example.',
    )],
    secondHint: b(
      'Общее высказывание опровергают одним примером.',
      'Umumiy mulohaza bitta misol bilan rad etiladi.',
      'A general statement is refuted by a single example.',
    ),
    thirdHint: b(
      'Про квадрат и прямоугольник спрашивают определение и обратное к нему.',
      "Kvadrat va to'g'ri to'rtburchak haqida ta'rif va uning teskarisi so'raladi.",
      'The square and rectangle pair asks about the definition and its converse.',
    ),
    correctText: b(
      'Верно. Способ проверки зависит от того, о чём высказывание.',
      "To'g'ri. Tekshirish usuli mulohaza nima haqida ekaniga bog'liq.",
      'Correct. The way of checking depends on what the statement is about.',
    ),
    rule: b(
      'Способ проверки выбирают по содержанию высказывания.',
      'Tekshirish usuli mulohazaning mazmuniga qarab tanlanadi.',
      'The way of checking is chosen from the content of the statement.',
    ),
  },

  {
    id: '04', level: 'yellow', kind: 'slots', skillTag: 'verdict_sorting',
    setup: b(
      'Четыре сообщения нужно поставить на свои места.',
      "To'rt xabarni o'z joyiga qo'yish kerak.",
      'Four messages have to be put in their places.',
    ),
    prompt: b('Поставь каждое сообщение на своё место.', 'Har xabarni o\'z joyiga qo\'ying.', 'Put each message in its place.'),
    slots: [
      {
        id: 'true', label: b('Истинное', 'Rost', 'True'), correct: 'right',
        wrong: b(
          'Проверь счётом: девять по шесть даёт пятьдесят четыре.',
          "Hisob bilan tekshiring: to'qqiz karra olti ellik to'rt beradi.",
          'Check by calculating: nine times six is fifty-four.',
        ),
      },
      {
        id: 'false', label: b('Ложное', "Yolg'on", 'False'), correct: 'wrong-record',
        wrong: b(
          'Ложное высказывание — это тоже высказывание, только неверное.',
          "Yolg'on mulohaza ham mulohaza, faqat noto'g'ri.",
          'A false statement is still a statement, only an untrue one.',
        ),
      },
      {
        id: 'question', label: b('Вопрос', 'Savol', 'A question'), correct: 'ask',
        wrong: b(
          'Вопрос заканчивается вопросительным знаком и требует ответа.',
          "Savol so'roq belgisi bilan tugaydi va javob talab qiladi.",
          'A question ends with a question mark and asks for an answer.',
        ),
      },
      {
        id: 'command', label: b('Приказ', 'Buyruq', 'A command'), correct: 'do',
        wrong: b(
          'Приказ требует действия, а не оценки.',
          'Buyruq baho emas, harakat talab qiladi.',
          'A command asks for an action, not a judgement.',
        ),
      },
    ],
    cards: [
      { id: 'right', text: b('9 · 6 = 54', '9 · 6 = 54', '9 · 6 = 54') },
      { id: 'wrong-record', text: b('9 · 6 = 56', '9 · 6 = 56', '9 · 6 = 56') },
      { id: 'ask', text: b('Чему равно 9 · 6?', '9 · 6 nechaga teng?', 'What is 9 · 6?') },
      { id: 'do', text: b('Вычисли 9 · 6.', "9 · 6 ni hisoblang.", 'Calculate 9 · 6.') },
    ],
    wrong: [b(
      'Сначала смотри на знак конца предложения, потом считай.',
      'Avval gap oxiridagi belgiga qarang, keyin hisoblang.',
      'First look at the punctuation at the end, then calculate.',
    )],
    secondHint: b(
      'Два сообщения из четырёх — высказывания.',
      "To'rt xabardan ikkitasi mulohaza.",
      'Two of the four messages are statements.',
    ),
    thirdHint: b(
      '9 · 6 = 54, поэтому вторая запись ложная.',
      "9 · 6 = 54, shuning uchun ikkinchi yozuv yolg'on.",
      '9 · 6 = 54, so the second record is false.',
    ),
    correctText: b(
      'Верно. Высказывание можно оценить, вопрос и приказ — нельзя.',
      "To'g'ri. Mulohazani baholash mumkin, savol va buyruqni esa mumkin emas.",
      'Correct. A statement can be judged; a question and a command cannot.',
    ),
    rule: b(
      'Ложное высказывание остаётся высказыванием.',
      "Yolg'on mulohaza ham mulohaza bo'lib qoladi.",
      'A false statement is still a statement.',
    ),
  },

  {
    id: '05', level: 'yellow', kind: 'numpad', skillTag: 'make_it_true', answer: '43', maxLen: 3,
    visual: { type: 'record', text: '□ + 47 = 90' },
    setup: b(
      'Сообщение придёт с пропуском, и его нужно сделать истинным.',
      "Xabar bo'sh joy bilan keladi va uni rost qilish kerak.",
      'The message arrives with a gap and has to be made true.',
    ),
    prompt: b(
      'Какое число сделает высказывание истинным?',
      'Qanday son mulohazani rost qiladi?',
      'Which number makes the statement true?',
    ),
    wrong: [b(
      'Неизвестное слагаемое находят вычитанием из суммы.',
      "Noma'lum qo'shiluvchi yig'indidan ayirish bilan topiladi.",
      'An unknown addend is found by subtracting from the sum.',
    )],
    secondHint: b(
      'Сумма равна 90, известное слагаемое 47.',
      "Yig'indi 90, ma'lum qo'shiluvchi 47.",
      'The sum is 90 and the known addend is 47.',
    ),
    thirdHint: b('90 − 47 = 43.', '90 − 47 = 43.', '90 − 47 = 43.'),
    correctText: b(
      'Верно. При 43 высказывание становится истинным.',
      "To'g'ri. 43 bo'lganda mulohaza rost bo'ladi.",
      'Correct. With 43 the statement becomes true.',
    ),
    rule: b(
      'Одно и то же высказывание может быть истинным или ложным в зависимости от числа.',
      "Bir xil mulohaza songa qarab rost yoki yolg'on bo'lishi mumkin.",
      'The same statement may be true or false depending on the number.',
    ),
  },

  {
    id: '06', level: 'yellow', kind: 'missing', skillTag: 'calendar_statement', answer: '30', maxLen: 2,
    visual: { type: 'record', text: 'Aprel — □ kun' },
    setup: b(
      'Календарное высказывание проверяют не счётом, а календарём.',
      'Taqvim mulohazasi hisob bilan emas, taqvim bilan tekshiriladi.',
      'A calendar statement is checked by the calendar, not by calculating.',
    ),
    prompt: b('Сколько дней в апреле?', 'Aprelda nechta kun bor?', 'How many days does April have?'),
    wrong: [b(
      'Месяцы бывают разной длины, и это нужно знать по календарю.',
      "Oylar turli uzunlikda bo'ladi, buni taqvimdan bilish kerak.",
      'Months have different lengths, and that has to be known from the calendar.',
    )],
    secondHint: b(
      'В апреле дней меньше, чем в марте.',
      'Aprelda kunlar martdan kam.',
      'April has fewer days than March.',
    ),
    thirdHint: b(
      'В апреле тридцать дней.',
      "Aprelda o'ttiz kun bor.",
      'April has thirty days.',
    ),
    correctText: b(
      'Верно. Высказывание «в апреле 30 дней» истинно.',
      "To'g'ri. «Aprelda 30 kun bor» mulohazasi rost.",
      'Correct. The statement April has 30 days is true.',
    ),
    rule: b(
      'Не всякое высказывание проверяют вычислением.',
      'Har mulohaza hisoblash bilan tekshirilmaydi.',
      'Not every statement is checked by calculating.',
    ),
  },

  {
    id: '07', level: 'yellow', kind: 'order', skillTag: 'check_order',
    setup: b(
      'Модуль решений работает по одному и тому же порядку.',
      'Qaror moduli har doim bir xil tartibda ishlaydi.',
      'The decision module always works in the same order.',
    ),
    prompt: b('Расставь шаги проверки по порядку.', 'Tekshirish qadamlarini tartib bilan joylashtiring.', 'Put the steps of the check in order.'),
    steps: [
      { id: 's1', label: b('Шаг 1', '1-qadam', 'Step 1') },
      { id: 's2', label: b('Шаг 2', '2-qadam', 'Step 2') },
      { id: 's3', label: b('Шаг 3', '3-qadam', 'Step 3') },
      { id: 's4', label: b('Шаг 4', '4-qadam', 'Step 4') },
    ],
    cards: [
      { id: 'read', text: b('Прочитать запись', 'Yozuvni o\'qish', 'Read the record'), order: 0 },
      { id: 'count', text: b('Вычислить', 'Hisoblash', 'Calculate'), order: 1 },
      { id: 'compare', text: b('Сравнить с правой частью', "O'ng tomon bilan solishtirish", 'Compare with the right side'), order: 2 },
      { id: 'verdict', text: b('Вынести суждение', 'Hukm chiqarish', 'Make the verdict'), order: 3 },
    ],
    wrong: [b(
      'Суждение выносят последним, а не первым.',
      'Hukm birinchi emas, oxirgi chiqariladi.',
      'The verdict comes last, not first.',
    )],
    secondHint: b(
      'Сравнивать можно только после вычисления.',
      'Solishtirish faqat hisoblashdan keyin mumkin.',
      'Comparing is possible only after calculating.',
    ),
    thirdHint: b(
      'Первым шагом читают, что именно записано.',
      'Birinchi qadamda aynan nima yozilganini o\'qiydilar.',
      'The first step is to read what exactly is written.',
    ),
    correctText: b(
      'Верно. Чтение, вычисление, сравнение, суждение.',
      "To'g'ri. O'qish, hisoblash, solishtirish, hukm.",
      'Correct. Reading, calculating, comparing, the verdict.',
    ),
    rule: b(
      'Суждение выносят только после проверки.',
      'Hukm faqat tekshiruvdan keyin chiqariladi.',
      'The verdict is made only after the check.',
    ),
  },

  {
    id: '08', level: 'red', kind: 'sort', skillTag: 'nested_negation',
    setup: b(
      'Модуль прислал сообщения вида «то, что ... , ложно».',
      "Modul «... ekani yolg'on» shaklidagi xabarlarni yubordi.",
      'The module sent messages of the form it is false that … .',
    ),
    prompt: b(
      'Разложи сообщения по их истинности.',
      'Xabarlarni rostligiga qarab guruhlarga joylashtiring.',
      'Sort the messages by whether they are true.',
    ),
    bins: [
      { id: 'true', label: b('Истинное', 'Rost', 'True') },
      { id: 'false', label: b('Ложное', "Yolg'on", 'False') },
    ],
    items: [
      { id: 'five-nine', bin: 'true', text: b('То, что 5 > 9, ложно.', "«5 > 9» ekani yolg'on.", 'It is false that 5 > 9.') },
      { id: 'all-even', bin: 'true', text: b('То, что каждое число чётное, ложно.', "«Har son juft» ekani yolg'on.", 'It is false that every number is even.') },
      { id: 'twelve', bin: 'false', text: b('То, что 12 : 4 = 3, ложно.', "«12 : 4 = 3» ekani yolg'on.", 'It is false that 12 : 4 = 3.') },
      { id: 'february', bin: 'false', text: b('То, что февраль — второй месяц, ложно.', "«Fevral yilning ikkinchi oyi» ekani yolg'on.", 'It is false that February is the second month.') },
    ],
    wrong: [b(
      'Сначала проверь внутреннюю запись, потом добавь слово «ложно».',
      "Avval ichki yozuvni tekshiring, keyin «yolg'on» so'zini qo'shing.",
      'First check the inner record, then add the word false.',
    )],
    secondHint: b(
      'Если внутренняя запись ложная, всё сообщение становится истинным.',
      "Ichki yozuv yolg'on bo'lsa, butun xabar rost bo'ladi.",
      'If the inner record is false, the whole message becomes true.',
    ),
    thirdHint: b(
      '12 : 4 = 3 верно, поэтому сообщение о его ложности неверно.',
      "12 : 4 = 3 rost, shuning uchun uning yolg'onligi haqidagi xabar noto'g'ri.",
      '12 : 4 = 3 is true, so the message about its falseness is false.',
    ),
    correctText: b(
      'Верно. Слово «ложно» переворачивает суждение внутренней записи.',
      "To'g'ri. «Yolg'on» so'zi ichki yozuvning hukmini teskari qiladi.",
      'Correct. The word false turns the verdict of the inner record around.',
    ),
    rule: b(
      'Отрицание меняет истинное на ложное и наоборот.',
      "Inkor rostni yolg'onga, yolg'onni rostga aylantiradi.",
      'A negation turns true into false and false into true.',
    ),
  },

  {
    id: '09', level: 'red', kind: 'mc', skillTag: 'converse_statement',
    visual: { type: 'record', text: 'Har kvadrat — TTB.   Har TTB — kvadrat.' },
    setup: b(
      'Два высказывания о квадрате и прямоугольнике. Сокращение ТТБ означает прямоугольник.',
      "Kvadrat va to'g'ri to'rtburchak haqida ikki mulohaza. TTB — to'g'ri to'rtburchak.",
      'Two statements about a square and a rectangle. TTB stands for rectangle.',
    ),
    prompt: b('Какое из них ложно и почему?', 'Ulardan qaysi biri yolg\'on va nima uchun?', 'Which of them is false and why?'),
    options: [
      option('second', 'Второе: есть прямоугольник со сторонами 3 и 5', "Ikkinchisi: tomonlari 3 va 5 bo'lgan to'g'ri to'rtburchak bor", 'The second: there is a rectangle with sides 3 and 5', true),
      option('first', 'Первое: у квадрата не все углы прямые', "Birinchisi: kvadratning hamma burchagi to'g'ri emas", 'The first: not all the angles of a square are right angles', false,
        'У квадрата все четыре угла прямые, поэтому первое высказывание истинно.',
        "Kvadratning to'rtta burchagi ham to'g'ri, shuning uchun birinchi mulohaza rost.",
        'All four angles of a square are right angles, so the first statement is true.'),
      option('both-true', 'Оба истинны', 'Ikkalasi ham rost', 'Both are true', false,
        'Прямоугольник со сторонами 3 и 5 не квадрат, значит второе высказывание ложно.',
        "Tomonlari 3 va 5 bo'lgan to'g'ri to'rtburchak kvadrat emas, demak ikkinchi mulohaza yolg'on.",
        'A rectangle with sides 3 and 5 is not a square, so the second statement is false.'),
      option('both-false', 'Оба ложны', 'Ikkalasi ham yolg\'on', 'Both are false', false,
        'Квадрат подходит под определение прямоугольника, поэтому первое истинно.',
        "Kvadrat to'g'ri to'rtburchak ta'rifiga mos keladi, shuning uchun birinchisi rost.",
        'A square fits the definition of a rectangle, so the first one is true.'),
    ],
    secondHint: b(
      'Попробуй найти прямоугольник, который не квадрат.',
      "Kvadrat bo'lmagan to'g'ri to'rtburchakni topishga harakat qiling.",
      'Try to find a rectangle that is not a square.',
    ),
    thirdHint: b(
      'Одного примера достаточно, чтобы общее высказывание стало ложным.',
      "Umumiy mulohazani yolg'on qilish uchun bitta misol yetadi.",
      'One example is enough to make a general statement false.',
    ),
    correctText: b(
      'Верно. Обратное высказывание не обязано быть истинным.',
      "To'g'ri. Teskari mulohaza rost bo'lishi shart emas.",
      'Correct. The converse of a statement need not be true.',
    ),
    rule: b(
      'Из истинности высказывания не следует истинность обратного.',
      "Mulohazaning rostligidan teskarisining rostligi kelib chiqmaydi.",
      'The truth of a statement does not make its converse true.',
    ),
  },

  {
    id: '10', level: 'red', kind: 'match', skillTag: 'counterexample',
    setup: b(
      'Четыре общих высказывания оказались ложными.',
      "To'rt umumiy mulohaza yolg'on chiqdi.",
      'Four general statements turned out to be false.',
    ),
    prompt: b(
      'Соедини высказывание с примером, который его опровергает.',
      'Mulohazani uni rad etadigan misol bilan ulang.',
      'Match each statement to the example that refutes it.',
    ),
    pairs: [
      { id: 'under-ten', left: b('Каждое число меньше десяти.', "Har son o'ndan kichik.", 'Every number is less than ten.'), correctRight: 'ex-25' },
      { id: 'even-four', left: b('Каждое чётное число делится на четыре.', "Har juft son to'rtga bo'linadi.", 'Every even number is divisible by four.'), correctRight: 'ex-6' },
      { id: 'quad-square', left: b('Каждый четырёхугольник — квадрат.', "Har to'rtburchak kvadrat.", 'Every quadrilateral is a square.'), correctRight: 'ex-rect' },
      { id: 'div-two', left: b('Каждое число делится на два.', "Har son ikkiga bo'linadi.", 'Every number is divisible by two.'), correctRight: 'ex-7' },
    ],
    right: [
      { id: 'ex-25', text: b('25', '25', '25') },
      { id: 'ex-6', text: b('6', '6', '6') },
      { id: 'ex-rect', text: b('Прямоугольник 3 и 5', "3 va 5 tomonli to'g'ri to'rtburchak", 'A rectangle with sides 3 and 5') },
      { id: 'ex-7', text: b('7', '7', '7') },
    ],
    wrong: [b(
      'Контрпример должен нарушать именно это высказывание.',
      'Qarshi misol aynan shu mulohazani buzishi kerak.',
      'A counterexample has to break exactly that statement.',
    )],
    secondHint: b(
      'Число 6 чётное, но на четыре не делится.',
      "6 soni juft, lekin to'rtga bo'linmaydi.",
      'The number 6 is even but not divisible by four.',
    ),
    thirdHint: b(
      'Число 7 нечётное, поэтому оно опровергает делимость на два.',
      "7 soni toq, shuning uchun u ikkiga bo'linishni rad etadi.",
      'The number 7 is odd, so it refutes divisibility by two.',
    ),
    correctText: b(
      'Верно. Одного подходящего примера достаточно.',
      "To'g'ri. Bitta mos misol yetarli.",
      'Correct. One suitable example is enough.',
    ),
    rule: b(
      'Общее высказывание опровергают одним контрпримером.',
      'Umumiy mulohaza bitta qarshi misol bilan rad etiladi.',
      'A general statement is refuted by a single counterexample.',
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
    if (task.kind === 'order') return task.steps.every((step) => placed[step.id]);
    return task.items.every((item) => assignments[item.id]);
  })();

  const answerCorrect = () => {
    if (task.kind === 'mc') return task.options.find((item) => item.id === pickedId)?.correct === true;
    if (task.kind === 'numpad' || task.kind === 'missing') return typed === task.answer;
    if (task.kind === 'match') return task.pairs.every((pair) => pairs[pair.id] === pair.correctRight);
    if (task.kind === 'slots') return task.slots.every((slot) => filled[slot.id] === slot.correct);
    if (task.kind === 'order') return task.cards.every((card) => placed[task.steps[card.order].id] === card.id);
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
    setPlaced({}); setActiveStep(null);
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
    if (task.kind === 'order') return { order: task.steps.map((step) => placed[step.id]) };
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
            {bankCards.map((card) => {
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

export default function Grade4Dars49Practice({ studentName, lang: langProp, onFinished }) {
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
.p4-order-slots{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin-top:7px}
.p4-order-slot{display:grid;place-items:center;gap:4px;min-width:44px;min-height:74px;padding:7px;border:1px solid rgba(23,59,82,.12);border-radius:13px;background:${T.paper};color:${T.ink2};font-family:inherit;cursor:pointer}
.p4-order-slot.is-active{border-color:${T.accent};background:${T.accentSoft}}
.p4-order-slot small{font-weight:800}
.p4-order-slot b{font:700 11px/1.25 'Manrope',sans-serif;color:${T.navy};text-align:center}
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
  .p4-sort-pool{display:grid;grid-template-columns:1fr 1fr;gap:5px;min-height:0}
  .p4-visual{min-height:64px!important;padding:6px!important}
  .p4-pad-display{min-height:44px}
  .p4-pad-keys{gap:5px}
  .p4-record{font-size:16px}
  .p4-pad{padding:8px;gap:6px}
  .p4-sort-token{font-size:10px;padding:4px 6px}
  .p4-slot-list{grid-template-columns:1fr 1fr!important;gap:6px}
  .p4-slot{min-height:56px!important;padding:5px!important}
  .p4-slot small{font-size:10px}
  .p4-match-item{min-height:46px;padding:6px 7px;font-size:10.5px}

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
`;
