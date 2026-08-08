// ============================================================================
// 4-SINF · 15-DARS AMALIYOTI
// O'rtacha arifmetik · 10 topshiriq + natija · 2 / 5 / 3 progression
// Standalone LMS component: RU/UZ, ovozsiz, solve-to-advance, first-try score.
// ============================================================================

import { useEffect, useMemo, useRef, useState } from 'react';

const T = {
  bg: '#F5F5F0', paper: '#FFFFFF', ink: '#12212C', ink2: '#50616D', ink3: '#87949D',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', success: '#227A53', successSoft: '#E7F3EC', warn: '#A96F13',
  warnSoft: '#FFF5D9', shadowBase: '0 16px 36px -24px rgba(23,59,82,.34)',
};

const UI = {
  title: { ru: 'Урок 15. Практика: среднее арифметическое', uz: "15-dars. Amaliyot: o'rtacha arifmetik" },
  task: { ru: 'Задание', uz: "Topshiriq" },
  level: {
    green: { ru: 'Базовое', uz: "Asosiy" },
    yellow: { ru: 'Применение', uz: "Qo'llash" },
    red: { ru: 'Перенос', uz: "Ko'chirish" },
  },
  check: { ru: 'Проверить', uz: "Tekshirish" },
  retry: { ru: 'Исправить ответ', uz: "Javobni tuzatish" },
  next: { ru: 'Следующее', uz: "Keyingisi" },
  finish: { ru: 'Завершить', uz: "Yakunlash" },
  again: { ru: 'Пройти заново', uz: "Qaytadan ishlash" },
  done: { ru: 'Практика пройдена', uz: "Amaliyot tugadi" },
  firstTry: { ru: 'верно с первой проверки', uz: "birinchi tekshiruvda to'g'ri" },
  allSolved: { ru: 'Все 10 заданий решены.', uz: "10 ta topshiriqning barchasi yechildi." },
  rule: { ru: 'Запомните', uz: "Eslab qoling" },
  typeAnswer: { ru: 'Введите числовой ответ', uz: "Sonli javobni kiriting" },
  clear: { ru: 'Стереть', uz: "O'chirish" },
  matchHint: { ru: 'Выберите список слева, затем его среднее справа.', uz: "Avval chapdagi ro'yxatni, keyin uning o'rtachasini tanlang." },
  orderHint: { ru: 'Выберите место, затем подходящий шаг.', uz: "Avval o'rinni, keyin mos qadamni tanlang." },
};

const tx = (value, lang) => (value && typeof value === 'object' && !Array.isArray(value) ? (value[lang] ?? value.ru) : value);
const grouped = (value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const shuffle = (items) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};
const adaptive = (value, attempt, thirdHint) => {
  if (attempt >= 3 && thirdHint) return thirdHint;
  return Array.isArray(value) ? value[Math.min(Math.max(attempt - 1, 0), value.length - 1)] : value;
};

const LESSON_META = {
  lessonId: 'num-4-15-practice', grade: 4, lessonNumber: 15, activityType: 'practice',
  taskCount: 10, resultIsUiState: true, progression: { green: 2, yellow: 5, red: 3 },
};

const SCREEN_META = [
  { id: 'practice-01', taskId: '01', template: 'multiple-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-02', taskId: '02', template: 'ordering', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-03', taskId: '03', template: 'multiple-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-04', taskId: '04', template: 'numeric-input', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-05', taskId: '05', template: 'multiple-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-06', taskId: '06', template: 'numeric-input', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-07', taskId: '07', template: 'matching', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-08', taskId: '08', template: 'multiple-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-09', taskId: '09', template: 'error-analysis', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-10', taskId: '10', template: 'strategy-transfer', type: 'practice', scored: true, scope: 'final' },
];

const TASKS = [
  {
    id: '01', level: 'green', kind: 'mc', skillTag: 'mean-formula',
    thirdHint: { ru: 'Посчитайте значения, чтобы определить делитель.', uz: "Bo'luvchini aniqlash uchun qiymatlarni sanang." },
    visual: { type: 'bars', values: [16, 22, 25, 29], mean: 23 },
    setup: { ru: 'Даны результаты 16, 22, 25 и 29.', uz: "16, 22, 25 va 29 natijalari berilgan." },
    prompt: { ru: 'Какая запись верно находит среднее арифметическое?', uz: "Qaysi yozuv o'rtacha arifmetikni to'g'ri topadi?" },
    options: [
      { id: 'correct', text: { ru: '(16 + 22 + 25 + 29) : 4 = 23', uz: "(16 + 22 + 25 + 29) : 4 = 23" }, correct: true },
      { id: 'count', text: { ru: '(16 + 22 + 25 + 29) : 3', uz: "(16 + 22 + 25 + 29) : 3" }, wrong: [
        { ru: 'В списке четыре значения, поэтому делить нужно на 4.', uz: "Ro'yxatda to'rtta qiymat bor, shuning uchun 4 ga bo'lish kerak." },
        { ru: 'Сначала посчитайте все столбцы: 16, 22, 25, 29. Их четыре.', uz: "Avval barcha ustunlarni sanang: 16, 22, 25, 29. Ular to'rtta." },
      ] },
      { id: 'maximum', text: { ru: '29', uz: "29" }, wrong: [
        { ru: '29 — наибольший результат, а не среднее всех результатов.', uz: "29 eng katta natija, barcha natijalarning o'rtachasi emas." },
        { ru: 'Среднее учитывает сумму 92 и четыре значения.', uz: "O'rtacha 92 yig'indi va to'rtta qiymatni hisobga oladi." },
      ] },
      { id: 'range', text: { ru: '29 − 16 = 13', uz: "29 − 16 = 13" }, wrong: [
        { ru: 'Разность наибольшего и наименьшего показывает размах, не среднее.', uz: "Eng katta va eng kichik sonlar ayirmasi oraliqni ko'rsatadi, o'rtachani emas." },
        { ru: 'Для среднего сложите все четыре числа и разделите сумму на 4.', uz: "O'rtacha uchun to'rtta sonni qo'shib, yig'indini 4 ga bo'ling." },
      ] },
    ],
    correctText: { ru: 'Верно. Сумма равна 92, а 92 : 4 = 23.', uz: "To'g'ri. Yig'indi 92 ga teng, 92 : 4 = 23." },
    rule: { ru: 'Среднее равно сумме значений, делённой на их количество.', uz: "O'rtacha qiymatlar yig'indisini ularning soniga bo'lish orqali topiladi." },
  },
  {
    id: '02', level: 'green', kind: 'order', skillTag: 'mean-algorithm',
    thirdHint: { ru: 'Первое место занимает шаг, который создаёт общую сумму.', uz: "Birinchi o'ringa umumiy yig'indini hosil qiladigan qadam qo'yiladi." },
    setup: { ru: 'Составьте алгоритм нахождения среднего арифметического.', uz: "O'rtacha arifmetikni topish algoritmini tuzing." },
    prompt: { ru: 'Расположите три шага по порядку.', uz: "Uchta qadamni tartib bilan joylashtiring." },
    steps: [
      { id: 's1', label: { ru: 'Шаг 1', uz: "1-qadam" }, correct: 'sum', wrong: [
        { ru: 'Сначала нужно получить сумму всех значений.', uz: "Avval barcha qiymatlarning yig'indisini topish kerak." },
        { ru: 'Первый шаг: сложите все числа.', uz: "Birinchi qadam: barcha sonlarni qo'shing." },
      ] },
      { id: 's2', label: { ru: 'Шаг 2', uz: "2-qadam" }, correct: 'count', wrong: [
        { ru: 'После суммы посчитайте, сколько значений дано.', uz: "Yig'indidan keyin nechta qiymat berilganini sanang." },
        { ru: 'Делитель — это количество значений.', uz: "Bo'luvchi qiymatlar sonidir." },
      ] },
      { id: 's3', label: { ru: 'Шаг 3', uz: "3-qadam" }, correct: 'divide', wrong: [
        { ru: 'Завершите делением суммы на количество значений.', uz: "Oxirida yig'indini qiymatlar soniga bo'ling." },
        { ru: 'Деление выполняется после суммы и подсчёта значений.', uz: "Bo'lish yig'indi va qiymatlar soni topilgandan keyin bajariladi." },
      ] },
    ],
    cards: [
      { id: 'sum', text: { ru: 'Сложить все числа', uz: "Barcha sonlarni qo'shish" } },
      { id: 'count', text: { ru: 'Посчитать количество значений', uz: "Qiymatlar sonini sanash" } },
      { id: 'divide', text: { ru: 'Разделить сумму на количество значений', uz: "Yig'indini qiymatlar soniga bo'lish" } },
    ],
    correctText: { ru: 'Верно: сумма, количество значений, деление.', uz: "To'g'ri: yig'indi, qiymatlar soni, bo'lish." },
    rule: { ru: 'Порядок не меняется для списков любой длины.', uz: "Ro'yxat uzunligi qanday bo'lsa ham, tartib o'zgarmaydi." },
  },
  {
    id: '03', level: 'yellow', kind: 'mc', skillTag: 'mean-from-bars',
    thirdHint: { ru: 'Разделите сохранённую сумму 60 на количество столбцов.', uz: "Saqlangan 60 yig'indini ustunlar soniga bo'ling." },
    visual: { type: 'bars', values: [5, 8, 21, 26], mean: 15, equalize: true },
    setup: { ru: 'Столбцы показывают значения 5, 8, 21 и 26.', uz: "Ustunlar 5, 8, 21 va 26 qiymatlarini ko'rsatadi." },
    prompt: { ru: 'До какой высоты выровняются четыре столбца?', uz: "To'rtta ustun qaysi balandlikda tenglashadi?" },
    options: [
      { id: 'correct', text: { ru: '15', uz: "15" }, correct: true },
      { id: 'sum', text: { ru: '60', uz: "60" }, wrong: [
        { ru: '60 — сумма всех столбцов. Её ещё нужно разделить на 4.', uz: "60 barcha ustunlarning yig'indisi. Uni yana 4 ga bo'lish kerak." },
        { ru: 'В записи среднего оставьте действие 60 : 4 без готового результата.', uz: "O'rtacha yozuvida tayyor natijasiz 60 : 4 amalini qoldiring." },
      ] },
      { id: 'omitted', text: { ru: '13', uz: "13" }, wrong: [
        { ru: '13 получается, если потерять один столбец. Нужно учесть все четыре значения.', uz: "13 bitta ustunni yo'qotganda chiqadi. Barcha to'rtta qiymatni hisobga olish kerak." },
        { ru: 'Проверьте, что в сумме участвуют 5, 8, 21 и 26.', uz: "Yig'indida 5, 8, 21 va 26 qatnashayotganini tekshiring." },
      ] },
      { id: 'maximum', text: { ru: '26', uz: "26" }, wrong: [
        { ru: '26 — самый высокий столбец. При выравнивании часть его высоты передаётся другим.', uz: "26 eng baland ustun. Tenglashtirishda uning bir qismi boshqalarga o'tadi." },
        { ru: 'Равная высота должна сохранять общую сумму 60.', uz: "Teng balandlik umumiy 60 yig'indini saqlashi kerak." },
      ] },
    ],
    correctText: { ru: 'Верно. 5 + 8 + 21 + 26 = 60, а 60 : 4 = 15.', uz: "To'g'ri. 5 + 8 + 21 + 26 = 60, 60 : 4 = 15." },
    rule: { ru: 'При выравнивании сумма не меняется.', uz: "Tenglashtirishda yig'indi o'zgarmaydi." },
  },
  {
    id: '04', level: 'yellow', kind: 'numpad', skillTag: 'mean-computation', answer: '24', maxLen: 2,
    thirdHint: { ru: 'Распределите сумму 72 поровну между тремя значениями.', uz: "72 yig'indini uchta qiymatga teng taqsimlang." },
    visual: { type: 'chips', values: [8, 27, 37] },
    setup: { ru: 'Найдите среднее значений 8, 27 и 37.', uz: "8, 27 va 37 qiymatlarining o'rtachasini toping." },
    prompt: { ru: 'Введите среднее арифметическое.', uz: "O'rtacha arifmetikni kiriting." },
    wrongAnswers: {
      72: [
        { ru: '72 — сумма. Разделите её на три значения.', uz: "72 yig'indi. Uni uchta qiymatga bo'ling." },
        { ru: 'Используйте действие 72 : 3 и вычислите его самостоятельно.', uz: "72 : 3 amalidan foydalanib, uni mustaqil hisoblang." },
      ],
      36: [
        { ru: '36 получилось при делении суммы на 2. Значений три.', uz: "36 yig'indini 2 ga bo'lganda chiqadi. Qiymatlar uchta." },
        { ru: 'Используйте делитель, равный количеству значений.', uz: "Qiymatlar soniga teng bo'luvchidan foydalaning." },
      ],
      37: [
        { ru: '37 — наибольшее значение, а не среднее.', uz: "37 eng katta qiymat, o'rtacha emas." },
        { ru: 'Сложите 8, 27 и 37, затем разделите на 3.', uz: "8, 27 va 37 ni qo'shib, keyin 3 ga bo'ling." },
      ],
    },
    wrongText: [
      { ru: 'Проверьте сумму и количество значений.', uz: "Yig'indi va qiymatlar sonini tekshiring." },
      { ru: '8 + 27 + 37 = 72. Теперь вычислите 72 : 3.', uz: "8 + 27 + 37 = 72. Endi 72 : 3 ni hisoblang." },
    ],
    correctText: { ru: 'Верно. 72 : 3 = 24.', uz: "To'g'ri. 72 : 3 = 24." },
    rule: { ru: 'Делитель равен трём, потому что дано три значения.', uz: "Uchta qiymat berilgani uchun bo'luvchi 3 ga teng." },
  },
  {
    id: '05', level: 'yellow', kind: 'mc', skillTag: 'two-number-mean',
    thirdHint: { ru: 'Сначала найдите расстояние действием 65 − 57.', uz: "Avval 65 − 57 amali bilan masofani toping." },
    visual: { type: 'numberline', from: 57, to: 65, answer: 61 },
    setup: { ru: 'На числовой прямой отмечены 57 и 65.', uz: "Sonlar nurida 57 va 65 belgilangan." },
    prompt: { ru: 'Какое число находится ровно посередине?', uz: "Qaysi son aynan o'rtada joylashgan?" },
    options: [
      { id: 'low', text: { ru: '59', uz: "59" }, wrong: [
        { ru: 'От 57 до 59 — 2, а от 59 до 65 — 6. Расстояния не равны.', uz: "57 dan 59 gacha 2, 59 dan 65 gacha 6. Masofalar teng emas." },
        { ru: 'Середина должна находиться на одинаковом расстоянии от 57 и 65.', uz: "O'rta nuqta 57 va 65 dan teng masofada bo'lishi kerak." },
      ] },
      { id: 'correct', text: { ru: '61', uz: "61" }, correct: true },
      { id: 'high', text: { ru: '63', uz: "63" }, wrong: [
        { ru: 'От 57 до 63 — 6, а до 65 остаётся 2.', uz: "57 dan 63 gacha 6, 65 gacha esa 2 qoladi." },
        { ru: 'Середина должна находиться на одинаковом расстоянии от обоих концов.', uz: "O'rta nuqta ikkala chetdan teng masofada bo'lishi kerak." },
      ] },
    ],
    correctText: { ru: 'Верно. 61 находится на расстоянии 4 от 57 и от 65.', uz: "To'g'ri. 61 soni 57 dan ham, 65 dan ham 4 masofada." },
    rule: { ru: 'Среднее двух чисел — равноудалённая от них точка.', uz: "Ikki sonning o'rtachasi ulardan teng masofadagi nuqtadir." },
  },
  {
    id: '06', level: 'yellow', kind: 'numpad', skillTag: 'mean-word-problem', answer: '250', maxLen: 4,
    thirdHint: { ru: 'Разделите общий итог 1 000 на количество дней.', uz: "1 000 umumiy natijani kunlar soniga bo'ling." },
    visual: { type: 'bars', values: [235, 248, 257, 260], mean: 250, equalize: true },
    setup: { ru: 'За четыре дня зарегистрировали 235, 248, 257 и 260 пассажиров.', uz: "To'rt kunda 235, 248, 257 va 260 nafar yo'lovchi qayd etildi." },
    prompt: { ru: 'Сколько пассажиров было в среднем за день?', uz: "Bir kunda o'rtacha nechta yo'lovchi bo'lgan?" },
    wrongAnswers: {
      1000: [
        { ru: '1 000 — число пассажиров за все четыре дня. Найдите среднее за один день.', uz: "1 000 to'rt kunlik jami yo'lovchilar soni. Bir kunlik o'rtachani toping." },
        { ru: 'Разделите 1 000 на 4.', uz: "1 000 ni 4 ga bo'ling." },
      ],
      333: [
        { ru: 'Дней четыре, не три. Делитель должен быть равен 4.', uz: "Kunlar to'rtta, uchta emas. Bo'luvchi 4 ga teng bo'lishi kerak." },
        { ru: 'Вычислите 1 000 : 4.', uz: "1 000 : 4 ni hisoblang." },
      ],
      260: [
        { ru: '260 — наибольший дневной результат, а не среднее.', uz: "260 bir kunlik eng katta natija, o'rtacha emas." },
        { ru: 'Сумма четырёх дней равна 1 000.', uz: "To'rt kunlik yig'indi 1 000 ga teng." },
      ],
    },
    wrongText: [
      { ru: 'Сложите результаты четырёх дней и разделите сумму на 4.', uz: "To'rt kunlik natijalarni qo'shib, yig'indini 4 ga bo'ling." },
      { ru: '235 + 248 + 257 + 260 = 1 000. Найдите 1 000 : 4.', uz: "235 + 248 + 257 + 260 = 1 000. 1 000 : 4 ni toping." },
    ],
    correctText: { ru: 'Верно. 1 000 : 4 = 250 пассажиров.', uz: "To'g'ri. 1 000 : 4 = 250 nafar yo'lovchi." },
    rule: { ru: 'В задаче делим общий итог на количество дней.', uz: "Masalada umumiy natijani kunlar soniga bo'lamiz." },
  },
  {
    id: '07', level: 'yellow', kind: 'match', skillTag: 'mean-matching',
    thirdHint: { ru: 'Сначала посчитайте, сколько значений в выбранном списке.', uz: "Avval tanlangan ro'yxatda nechta qiymat borligini sanang." },
    setup: { ru: 'У каждого списка своё количество значений.', uz: "Har bir ro'yxatda qiymatlar soni turlicha." },
    prompt: { ru: 'Соедините каждый список с его средним.', uz: "Har bir ro'yxatni uning o'rtachasi bilan moslashtiring." },
    pairs: [
      { id: 'a', left: { ru: '18, 24, 30', uz: "18, 24, 30" }, correctRight: 'm24', wrong: [
        { ru: 'Не выбирайте максимум. Сумма 72 делится на 3 значения.', uz: "Eng katta sonni tanlamang. 72 yig'indi 3 ta qiymatga bo'linadi." },
        { ru: 'Запишите действие 72 : 3 и вычислите его.', uz: "72 : 3 amalini yozib, uni hisoblang." },
      ] },
      { id: 'b', left: { ru: '31, 35, 39, 43', uz: "31, 35, 39, 43" }, correctRight: 'm37', wrong: [
        { ru: 'В этом списке четыре значения, не три. Сумма равна 148.', uz: "Bu ro'yxatda uchta emas, to'rtta qiymat bor. Yig'indi 148 ga teng." },
        { ru: 'Запишите действие 148 : 4 и вычислите его.', uz: "148 : 4 amalini yozib, uni hisoblang." },
      ] },
      { id: 'c', left: { ru: '45, 55', uz: "45, 55" }, correctRight: 'm50', wrong: [
        { ru: 'Здесь два значения. Разделите их сумму 100 на 2.', uz: "Bu yerda ikkita qiymat bor. Ularning 100 yig'indisini 2 ga bo'ling." },
        { ru: 'Запишите действие 100 : 2 и вычислите его.', uz: "100 : 2 amalini yozib, uni hisoblang." },
      ] },
    ],
    right: [
      { id: 'm24', text: { ru: '24', uz: "24" } },
      { id: 'm37', text: { ru: '37', uz: "37" } },
      { id: 'm50', text: { ru: '50', uz: "50" } },
    ],
    correctText: { ru: 'Верно. Средние равны 24, 37 и 50.', uz: "To'g'ri. O'rtachalar 24, 37 va 50 ga teng." },
    rule: { ru: 'Для каждого списка заново считайте количество значений.', uz: "Har bir ro'yxat uchun qiymatlar sonini qayta sanang." },
  },
  {
    id: '08', level: 'red', kind: 'mc', skillTag: 'mean-boundary',
    thirdHint: { ru: 'Разделите сумму 30 на количество данных чисел; ответ не обязан быть в списке.', uz: "30 yig'indini berilgan sonlar soniga bo'ling; javob ro'yxatda bo'lishi shart emas." },
    visual: { type: 'bars', values: [5, 9, 16], mean: 10, equalize: true },
    setup: { ru: 'Даны числа 5, 9 и 16.', uz: "5, 9 va 16 sonlari berilgan." },
    prompt: { ru: 'Какое утверждение верно?', uz: "Qaysi fikr to'g'ri?" },
    options: [
      { id: 'correct', text: { ru: 'Среднее равно 10, хотя числа 10 нет в списке.', uz: "O'rtacha 10 ga teng, garchi ro'yxatda 10 soni bo'lmasa ham." }, correct: true },
      { id: 'mustExist', text: { ru: 'Среднее обязано быть одним из данных чисел.', uz: "O'rtacha berilgan sonlardan biri bo'lishi shart." }, wrong: [
        { ru: 'Среднее — выровненное значение. Оно может отсутствовать в исходном списке.', uz: "O'rtacha tenglashtirilgan qiymatdir. U dastlabki ro'yxatda bo'lmasligi mumkin." },
        { ru: 'После суммы 30 запишите деление на количество чисел.', uz: "30 yig'indidan keyin sonlar soniga bo'lishni yozing." },
      ] },
      { id: 'maximum', text: { ru: 'Среднее равно 16, потому что это наибольшее число.', uz: "16 eng katta son bo'lgani uchun o'rtacha 16 ga teng." }, wrong: [
        { ru: 'Наибольшее значение не заменяет среднее трёх чисел.', uz: "Eng katta qiymat uchta sonning o'rtachasini almashtirmaydi." },
        { ru: 'Разделите сумму 30 на 3.', uz: "30 yig'indini 3 ga bo'ling." },
      ] },
      { id: 'sum', text: { ru: 'Среднее равно 30.', uz: "O'rtacha 30 ga teng." }, wrong: [
        { ru: '30 — сумма. Для среднего её нужно разделить на 3.', uz: "30 yig'indi. O'rtacha uchun uni 3 ga bo'lish kerak." },
        { ru: 'Запишите действие 30 : 3 и вычислите его.', uz: "30 : 3 amalini yozib, uni hisoblang." },
      ] },
    ],
    correctText: { ru: 'Верно. 30 : 3 = 10, и 10 не обязано быть в списке.', uz: "To'g'ri. 30 : 3 = 10, 10 soni ro'yxatda bo'lishi shart emas." },
    rule: { ru: 'Среднее может не совпадать ни с одним исходным значением.', uz: "O'rtacha dastlabki qiymatlarning hech biriga teng bo'lmasligi mumkin." },
  },
  {
    id: '09', level: 'red', kind: 'mc', skillTag: 'mean-error-analysis',
    thirdHint: { ru: 'Сохраните сумму 552 и замените делитель числом данных значений.', uz: "552 yig'indini saqlab, bo'luvchini berilgan qiymatlar soniga almashtiring." },
    visual: { type: 'error', good: '552 : 4 = 138', bad: '552 : 3 = 184' },
    setup: { ru: 'Сумма четырёх чисел 120, 132, 144 и 156 равна 552. В решении её разделили на 3.', uz: "120, 132, 144 va 156 sonlarining yig'indisi 552. Yechimda u 3 ga bo'lingan." },
    prompt: { ru: 'Как исправить решение?', uz: "Yechimni qanday tuzatish kerak?" },
    options: [
      { id: 'correct', text: { ru: '552 : 4 = 138', uz: "552 : 4 = 138" }, correct: true },
      { id: 'three', text: { ru: 'Оставить 552 : 3 = 184', uz: "552 : 3 = 184 ni qoldirish" }, wrong: [
        { ru: 'Чисел четыре, поэтому делитель 3 исключает одно значение.', uz: "Sonlar to'rtta, shuning uchun 3 bo'luvchi bitta qiymatni hisobdan chiqaradi." },
        { ru: 'Пересчитайте: 120, 132, 144, 156 — четыре значения.', uz: "Qayta sanang: 120, 132, 144, 156 — to'rtta qiymat." },
      ] },
      { id: 'range', text: { ru: '156 − 120 = 36', uz: "156 − 120 = 36" }, wrong: [
        { ru: '36 — размах значений, а не их среднее.', uz: "36 qiymatlar oralig'i, ularning o'rtachasi emas." },
        { ru: 'Для среднего используйте сумму 552 и количество 4.', uz: "O'rtacha uchun 552 yig'indi va 4 ta qiymatdan foydalaning." },
      ] },
      { id: 'sum', text: { ru: 'Среднее равно 552', uz: "O'rtacha 552 ga teng" }, wrong: [
        { ru: '552 — общая сумма четырёх значений.', uz: "552 to'rtta qiymatning umumiy yig'indisi." },
        { ru: 'Разделите 552 на 4.', uz: "552 ni 4 ga bo'ling." },
      ] },
    ],
    correctText: { ru: 'Верно. Четыре значения дают делитель 4, поэтому среднее равно 138.', uz: "To'g'ri. To'rtta qiymat bo'luvchi 4 ni beradi, o'rtacha 138 ga teng." },
    rule: { ru: 'Перед делением отдельно пересчитайте все значения.', uz: "Bo'lishdan oldin barcha qiymatlarni alohida sanang." },
  },
  {
    id: '10', level: 'red', kind: 'mc', skillTag: 'mean-comparison',
    thirdHint: { ru: 'Сначала вычислите среднее команды A действием 112 : 4.', uz: "Avval A jamoaning o'rtachasini 112 : 4 amali bilan hisoblang." },
    visual: { type: 'compare', a: [19, 25, 31, 37], b: [20, 22, 29, 37], meanA: 28, meanB: 27 },
    setup: { ru: 'У обеих команд лучший результат равен 37.', uz: "Ikkala jamoaning eng yaxshi natijasi 37 ga teng." },
    prompt: { ru: 'Какая команда лучше по среднему результату?', uz: "O'rtacha natija bo'yicha qaysi jamoa yaxshiroq?" },
    options: [
      { id: 'correct', text: { ru: 'Команда A: среднее 28, у команды B — 27.', uz: "A jamoa: o'rtachasi 28, B jamoaniki 27." }, correct: true },
      { id: 'sameMax', text: { ru: 'Команды равны, потому что максимум у обеих равен 37.', uz: "Eng katta natija ikkalasida ham 37 bo'lgani uchun jamoalar teng." }, wrong: [
        { ru: 'Одинаковый максимум не учитывает остальные попытки.', uz: "Bir xil eng katta natija qolgan urinishlarni hisobga olmaydi." },
        { ru: 'Начните со среднего команды A: её сумма равна 112.', uz: "A jamoaning o'rtachasidan boshlang: uning yig'indisi 112." },
      ] },
      { id: 'closer', text: { ru: 'Команда B, потому что её значения кажутся ближе друг к другу.', uz: "B jamoa, chunki uning qiymatlari bir-biriga yaqinroq ko'rinadi." }, wrong: [
        { ru: 'Близость значений не показывает, какое среднее выше.', uz: "Qiymatlarning yaqinligi qaysi o'rtacha yuqoriligini ko'rsatmaydi." },
        { ru: 'Сначала разделите сумму команды A, равную 112, на число её результатов.', uz: "Avval A jamoaning 112 yig'indisini uning natijalari soniga bo'ling." },
      ] },
    ],
    correctText: { ru: 'Верно. У A: 112 : 4 = 28. У B: 108 : 4 = 27.', uz: "To'g'ri. A da: 112 : 4 = 28. B da: 108 : 4 = 27." },
    rule: { ru: 'Для честного сравнения учитывайте все результаты через среднее.', uz: "Adolatli taqqoslash uchun barcha natijalarni o'rtacha orqali hisobga oling." },
  },
];

function MeanVisual({ visual, solved, lang, hintLevel, hintTarget }) {
  if (!visual) return null;
  const hasHint = hintLevel >= 2;
  const target = String(hintTarget ?? '');
  if (visual.type === 'bars') {
    const BAR_BASE = 22;
    const BAR_RANGE = 72;
    const BAR_BOTTOM = 9;
    const max = Math.max(...visual.values, visual.mean ?? 0);
    const barHeight = (value) => BAR_BASE + (value / max) * BAR_RANGE;
    const min = Math.min(...visual.values);
    const total = visual.values.reduce((sum, value) => sum + value, 0);
    const numericFallback = /^\d+$/.test(target) && !['1000', '260'].includes(target);
    const hintAll = hasHint && (['count', 'omitted', 'mustExist', '333', '36'].includes(target) || numericFallback);
    const hintMax = hasHint && ['maximum', '260', '37'].includes(target);
    const hintRange = hasHint && target === 'range';
    const hintTotal = hasHint && ['sum', '72', '1000'].includes(target);
    return <div className="p4-visual p4-bars" aria-label={lang === 'uz' ? "Qiymatlar ustunlari" : 'Столбцы значений'}>
      <div className="p4-bar-field">{visual.values.map((value, index) => {
        const shown = solved && visual.equalize ? visual.mean : value;
        const barHint = hintAll || (hintMax && value === max) || (hintRange && (value === max || value === min));
        return <div key={index} className={`p4-bar-wrap ${barHint ? 'is-hint' : ''}`}>
          <b>{solved && visual.equalize ? `${value} → ${visual.mean}` : value}</b><span className="p4-bar" style={{ height: `${barHeight(shown)}px` }} />
        </div>;
      })}{solved && !visual.equalize && <span className="p4-mean-line" style={{ bottom: `${BAR_BOTTOM + barHeight(visual.mean)}px` }}><b>{visual.mean}</b></span>}</div>
      {visual.equalize && <span className={`p4-total ${hintTotal ? 'is-hint' : ''}`}>{solved ? `Σ ${total} = ${visual.mean} · ${visual.values.length}` : `Σ = ${total}`}</span>}
    </div>;
  }
  if (visual.type === 'numberline') {
    return <div className="p4-visual p4-numberline" aria-label={lang === 'uz' ? "Sonlar nuri" : 'Числовая прямая'}>
      <span>{visual.from}</span><i /><b className={`${solved ? 'is-show' : ''} ${hasHint ? 'is-hint' : ''}`}>{solved ? visual.answer : '?'}</b><i /><span>{visual.to}</span>
    </div>;
  }
  if (visual.type === 'compare') {
    return <div className="p4-visual p4-compare">{[['A', visual.a, visual.meanA], ['B', visual.b, visual.meanB]].map(([name, values, mean]) => <div key={name} className={`p4-team ${hasHint && hintTarget === 'closer' ? 'is-hint' : ''}`}>
      <b>{name}</b><div>{values.map((value) => <span key={value} className={hasHint && hintTarget === 'sameMax' && value === 37 ? 'is-hint' : ''}>{value}</span>)}</div>{solved && <em>{lang === 'uz' ? "o'rtacha" : 'среднее'}: {mean}</em>}
    </div>)}</div>;
  }
  if (visual.type === 'error') return <div className="p4-visual p4-error"><del className={hasHint ? 'is-hint' : ''}>{visual.bad}</del><span>→</span><b className={solved ? 'is-show' : ''}>{solved ? visual.good : '?'}</b></div>;
  if (visual.type === 'chips') {
    const total = visual.values.reduce((sum, value) => sum + value, 0);
    const part = total / visual.values.length;
    const hintAllValues = hasHint && target !== '37';
    return <div className={`p4-visual p4-chip-equalize ${solved ? 'is-solved' : ''}`} aria-label={lang === 'uz' ? "Qiymatlar yig'indisini teng taqsimlash" : 'Равное распределение суммы значений'}>
      <div className="p4-chip-source">{visual.values.map((value, index) => <span className={hintAllValues || (hasHint && target === '37' && value === 37) ? 'is-hint' : ''} key={value}>{index > 0 && <i>+</i>}<b>{value}</b></span>)}</div>
      {solved && <><i className="p4-flow">→</i><b className="p4-chip-pool">{total}</b><i className="p4-flow p4-flow-late">→</i><div className="p4-chip-parts">{visual.values.map((_, index) => <b key={index}>{part}</b>)}</div></>}
    </div>;
  }
  const values = visual.values ?? [];
  return <div className="p4-visual p4-chip-visual">{values.map((value, index) => <span className={hasHint && (target === '37' ? value === 37 : true) ? 'is-hint' : ''} key={`${value}-${index}`}>{value}</span>)}</div>;
}

const Feedback = ({ ok, text, rule, lang, feedbackRef }) => (
  <div ref={feedbackRef} className={`p4-fb ${ok ? 'is-ok' : 'is-no'}`} role="status" aria-live="polite">
    <p className="p4-fb-txt">{text}</p>
    {ok && rule && <p className="p4-rule"><b>{tx(UI.rule, lang)}.</b> {tx(rule, lang)}</p>}
  </div>
);

const NumPad = ({ value, onChange, max, disabled, lang }) => (
  <div className="p4-pad" role="group" aria-label={tx(UI.typeAnswer, lang)}>
    <output className="p4-pad-display" aria-live="polite">{value ? grouped(value) : '—'}</output>
    <div className="p4-pad-keys">{[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((number) => (
      <button key={number} type="button" className="p4-key" disabled={disabled} onClick={() => onChange(value.length >= max ? value : value + number)}>{number}</button>
    ))}<button type="button" className="p4-key p4-key-del" disabled={disabled} aria-label={tx(UI.clear, lang)} onClick={() => onChange(value.slice(0, -1))}>⌫</button></div>
  </div>
);

function Task({ task, lang, isLast, onSolved }) {
  const options = useMemo(() => task.kind === 'mc' ? shuffle(task.options) : [], [task]);
  const rightCards = useMemo(() => task.kind === 'match' ? shuffle(task.right) : [], [task]);
  const orderCards = useMemo(() => task.kind === 'order' ? shuffle(task.cards) : [], [task]);
  const [picked, setPicked] = useState(null);
  const [typed, setTyped] = useState('');
  const [pairs, setPairs] = useState({});
  const [activeLeft, setActiveLeft] = useState(null);
  const [placed, setPlaced] = useState({});
  const [activeStep, setActiveStep] = useState(task.kind === 'order' ? task.steps[0].id : null);
  const [checked, setChecked] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [advancing, setAdvancing] = useState(false);
  const advancedRef = useRef(false);
  const checkingRef = useRef(false);
  const feedbackRef = useRef(null);

  const solved = checked && ((task.kind === 'mc' && options[picked]?.correct === true)
    || (task.kind === 'numpad' && typed === task.answer)
    || (task.kind === 'match' && task.pairs.every((pair) => pairs[pair.id] === pair.correctRight))
    || (task.kind === 'order' && task.steps.every((step) => placed[step.id] === step.correct)));
  const canCheck = (task.kind === 'mc' && picked !== null)
    || (task.kind === 'numpad' && typed !== '')
    || (task.kind === 'match' && task.pairs.every((pair) => pairs[pair.id]))
    || (task.kind === 'order' && task.steps.every((step) => placed[step.id]));

  const wrongSource = (() => {
    if (task.kind === 'mc') return options[picked]?.wrong;
    if (task.kind === 'numpad') return task.wrongAnswers?.[typed] ?? task.wrongText;
    if (task.kind === 'match') return task.pairs.find((pair) => pairs[pair.id] !== pair.correctRight)?.wrong;
    if (task.kind === 'order') return task.steps.find((step) => placed[step.id] !== step.correct)?.wrong;
    return null;
  })();
  const wrongText = tx(adaptive(wrongSource, attempts, task.thirdHint), lang);
  const hintLevel = checked && !solved ? attempts : 0;
  const wrongPair = task.kind === 'match' ? task.pairs.find((pair) => pairs[pair.id] !== pair.correctRight) : null;
  const wrongStep = task.kind === 'order' ? task.steps.find((step) => placed[step.id] !== step.correct) : null;
  const hintTarget = task.kind === 'mc' ? options[picked]?.id : typed;

  useEffect(() => {
    if (!checked || !feedbackRef.current) return undefined;
    let timeout;
    const firstFrame = requestAnimationFrame(() => requestAnimationFrame(() => {
      timeout = setTimeout(() => {
        const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        feedbackRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest' });
      }, 180);
    }));
    return () => { cancelAnimationFrame(firstFrame); clearTimeout(timeout); };
  }, [checked]);

  const retry = () => {
    checkingRef.current = false;
    setChecked(false); setPicked(null); setTyped(''); setPairs({}); setActiveLeft(null); setPlaced({});
    setActiveStep(task.kind === 'order' ? task.steps[0].id : null);
  };
  const activateLeft = (id) => {
    if (solved) return;
    checkingRef.current = false;
    setPairs((old) => { const next = { ...old }; delete next[id]; return next; });
    setActiveLeft(id); setChecked(false);
  };
  const connect = (rightId) => {
    if (activeLeft === null || solved) return;
    checkingRef.current = false;
    setPairs((old) => {
      const next = { ...old };
      Object.keys(next).forEach((leftId) => { if (next[leftId] === rightId) delete next[leftId]; });
      next[activeLeft] = rightId;
      return next;
    });
    setActiveLeft(null); setChecked(false);
  };
  const activateStep = (id) => {
    if (solved) return;
    checkingRef.current = false;
    setPlaced((old) => { const next = { ...old }; delete next[id]; return next; });
    setActiveStep(id); setChecked(false);
  };
  const placeStep = (cardId) => {
    if (!activeStep || solved) return;
    checkingRef.current = false;
    const next = { ...placed };
    Object.keys(next).forEach((stepId) => { if (next[stepId] === cardId) delete next[stepId]; });
    next[activeStep] = cardId;
    setPlaced(next);
    const nextEmpty = task.steps.find((step) => !next[step.id]);
    setActiveStep(nextEmpty?.id ?? null);
    setChecked(false);
  };
  const answerSnapshot = () => {
    if (task.kind === 'mc') return { selectedOptionId: options[picked]?.id, selectedText: options[picked]?.text };
    if (task.kind === 'numpad') return { enteredValue: typed };
    if (task.kind === 'match') return { pairs: { ...pairs } };
    return { order: task.steps.map((step) => placed[step.id]) };
  };
  const correctSnapshot = () => {
    if (task.kind === 'mc') { const correct = task.options.find((option) => option.correct); return { optionId: correct.id, text: correct.text }; }
    if (task.kind === 'numpad') return { value: task.answer };
    if (task.kind === 'match') return { pairs: Object.fromEntries(task.pairs.map((pair) => [pair.id, pair.correctRight])) };
    return { order: task.steps.map((step) => step.correct) };
  };
  const checkAnswer = () => {
    if (checkingRef.current || checked || solved || !canCheck) return;
    checkingRef.current = true;
    setAttempts((old) => old + 1);
    setChecked(true);
  };

  return <section className={`p4-task ${hintLevel >= 2 ? 'is-hint' : ''}`} aria-labelledby={`task-${task.id}`}>
    <p className={`p4-eyebrow is-${task.level}`}><span>{tx(UI.level[task.level], lang)}</span> · {tx(UI.task, lang)} {Number(task.id)}</p>
    <p className="p4-setup">{tx(task.setup, lang)}</p>
    <MeanVisual visual={task.visual} solved={solved} lang={lang} hintLevel={hintLevel} hintTarget={hintTarget} />
    <h2 id={`task-${task.id}`} className="p4-ask">{tx(task.prompt, lang)}</h2>

    {task.kind === 'mc' && <div className="p4-options">{options.map((option, index) => <button key={option.id} type="button" className={`p4-option ${picked === index ? (checked ? (option.correct ? 'is-ok' : 'is-no') : 'is-on') : ''}`} aria-pressed={picked === index} disabled={solved} onClick={() => { checkingRef.current = false; setPicked(index); setChecked(false); }}><span className="p4-letter">{'ABCD'[index]}</span><span>{tx(option.text, lang)}</span></button>)}</div>}

    {task.kind === 'numpad' && <NumPad value={typed} onChange={(value) => { checkingRef.current = false; setTyped(value); setChecked(false); }} max={task.maxLen} disabled={solved} lang={lang} />}

    {task.kind === 'match' && <div className="p4-match"><p className="p4-note">{tx(UI.matchHint, lang)}</p><div className="p4-match-cols">
      <div className="p4-match-col">{task.pairs.map((pair) => <button key={pair.id} type="button" className={`p4-match-item ${activeLeft === pair.id ? 'is-active' : ''} ${pairs[pair.id] ? 'is-tied' : ''} ${hintLevel >= 2 && wrongPair?.id === pair.id ? 'is-hint' : ''}`} aria-pressed={activeLeft === pair.id} disabled={solved} onClick={() => activateLeft(pair.id)}><span>{tx(pair.left, lang)}</span>{pairs[pair.id] && <b className="p4-tie">{tx(task.right.find((right) => right.id === pairs[pair.id])?.text, lang)}</b>}</button>)}</div>
      <div className="p4-match-col">{rightCards.map((right) => { const used = Object.values(pairs).includes(right.id); return <button key={right.id} type="button" className={`p4-match-item p4-match-right ${used ? 'is-used' : ''}`} aria-pressed={used} disabled={solved || activeLeft === null || used} onClick={() => connect(right.id)}>{tx(right.text, lang)}</button>; })}</div>
    </div></div>}

    {task.kind === 'order' && <div className="p4-order"><p className="p4-note">{tx(UI.orderHint, lang)}</p><div className="p4-order-slots">{task.steps.map((step) => <button key={step.id} type="button" className={`p4-order-slot ${activeStep === step.id ? 'is-active' : ''} ${hintLevel >= 2 && wrongStep?.id === step.id ? 'is-hint' : ''}`} aria-pressed={activeStep === step.id} disabled={solved} onClick={() => activateStep(step.id)}><small>{tx(step.label, lang)}</small><b>{placed[step.id] ? tx(task.cards.find((card) => card.id === placed[step.id])?.text, lang) : '—'}</b></button>)}</div><div className="p4-card-bank">{orderCards.map((card) => { const used = Object.values(placed).includes(card.id); return <button key={card.id} type="button" className={`p4-card ${used ? 'is-used' : ''}`} aria-pressed={used} disabled={solved || !activeStep || used} onClick={() => placeStep(card.id)}>{tx(card.text, lang)}</button>; })}</div></div>}

    {checked && <Feedback feedbackRef={feedbackRef} ok={solved} text={solved ? tx(task.correctText, lang) : wrongText} rule={task.rule} lang={lang} />}
    <div className="p4-actions">
      {!checked && !solved && <button type="button" className="p4-btn" disabled={!canCheck} onClick={checkAnswer}>{tx(UI.check, lang)}</button>}
      {checked && !solved && <button type="button" className="p4-btn p4-btn-ghost" onClick={retry}>{tx(UI.retry, lang)}</button>}
      {solved && <button type="button" className="p4-btn p4-btn-ready" disabled={advancing} onClick={() => { if (advancedRef.current) return; checkingRef.current = false; advancedRef.current = true; setAdvancing(true); onSolved({ taskId: task.id, taskNumber: Number(task.id), level: task.level, kind: task.kind, skillTag: task.skillTag, attempts, firstTry: attempts === 1, correct: true, setup: task.setup, prompt: task.prompt, studentAnswer: answerSnapshot(), correctAnswer: correctSnapshot(), answerChoices: task.options?.map(({ id, text, correct }) => ({ id, text, correct: Boolean(correct) })) ?? task.right ?? task.cards ?? null, screenMeta: SCREEN_META.find((screen) => screen.taskId === task.id) }); }}>{tx(isLast ? UI.finish : UI.next, lang)}</button>}
    </div>
  </section>;
}

export default function Grade4Dars15Practice({ lang: langProp, onFinished }) {
  const preview = langProp === undefined || langProp === null;
  const [previewLang, setPreviewLang] = useState('uz');
  const lang = langProp || previewLang;
  const [index, setIndex] = useState(0);
  const [firstTry, setFirstTry] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const finishedRef = useRef(false);
  const startedAtRef = useRef(0);
  useEffect(() => { if (!startedAtRef.current) startedAtRef.current = Date.now(); }, []);
  const task = TASKS[index];
  const percent = Math.round(((finished ? TASKS.length : index) / TASKS.length) * 100);

  const onSolved = (record) => {
    const nextAnswers = [...answers, record];
    const nextFirstTry = firstTry + (record.firstTry ? 1 : 0);
    setAnswers(nextAnswers); setFirstTry(nextFirstTry);
    if (index + 1 === TASKS.length) {
      if (finishedRef.current) return;
      finishedRef.current = true; setFinished(true);
      const levelBreakdown = ['green', 'yellow', 'red'].reduce((result, level) => ({ ...result, [level]: { total: TASKS.filter((item) => item.level === level).length, firstTry: nextAnswers.filter((item) => item.level === level && item.firstTry).length } }), {});
      onFinished?.({
        lessonId: LESSON_META.lessonId, lessonTitle: tx(UI.title, lang), lessonTitleLocalized: UI.title, studentName: null,
        activityType: 'practice', completed: true, totalQuestions: 10, answeredQuestions: 10,
        correctAnswers: nextFirstTry, firstTryCorrect: nextFirstTry, scorePercent: Math.round((nextFirstTry / 10) * 100),
        finalScore: nextFirstTry, finalTotal: 10, passed: nextFirstTry / 10 >= 0.6,
        firstTryStats: { total: 10, firstTryCorrect: nextFirstTry, correct: nextFirstTry, answered: 10, scorePercent: Math.round((nextFirstTry / 10) * 100) },
        attemptsTotal: nextAnswers.reduce((sum, item) => sum + item.attempts, 0),
        durationSec: startedAtRef.current ? Math.max(0, Math.floor((Date.now() - startedAtRef.current) / 1000)) : 0,
        skillTags: [...new Set(TASKS.map((item) => item.skillTag))], levelBreakdown,
        lessonMeta: LESSON_META, screenMeta: SCREEN_META, answers: nextAnswers,
      });
      return;
    }
    setIndex((old) => old + 1);
  };
  const restart = () => {
    finishedRef.current = false; startedAtRef.current = Date.now(); setIndex(0); setFirstTry(0); setAnswers([]); setFinished(false);
  };

  return <div className="p4-root">
    <style>{STYLES}</style>
    {preview && <div className="p4-lang" role="group" aria-label="Language">{['ru', 'uz'].map((code) => <button key={code} type="button" className={code === lang ? 'is-active' : ''} aria-pressed={code === lang} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}
    <header className="p4-head"><div className="p4-progress" role="progressbar" aria-label={tx(UI.title, lang)} aria-valuemin="0" aria-valuemax="10" aria-valuenow={finished ? 10 : index}><div className="p4-progress-bar" style={{ width: `${percent}%` }} /></div><div className="p4-head-row"><span className="p4-title">{tx(UI.title, lang)}</span><span className="p4-counter">{finished ? 10 : index + 1} / 10</span></div></header>
    <main className="p4-main">{finished ? <section className="p4-done" aria-live="polite"><span className="p4-medal" aria-hidden="true">★</span><h2>{tx(UI.done, lang)}</h2><p className="p4-score"><b>{firstTry}</b><span>/ 10</span></p><p className="p4-note">{tx(UI.firstTry, lang)}</p><p className="p4-complete">{tx(UI.allSolved, lang)}</p><button type="button" className="p4-btn p4-btn-ready" onClick={restart}>{tx(UI.again, lang)}</button></section> : <Task key={task.id} task={task} lang={lang} isLast={index === TASKS.length - 1} onSolved={onSolved} />}</main>
  </div>;
}

const STYLES = `
.p4-root{position:relative;display:flex;flex-direction:column;min-height:100dvh;overflow-x:hidden;padding:0 0 18px;font-family:'Manrope',system-ui,sans-serif;color:${T.ink};background:${T.bg}}
.p4-root *,.p4-root *::before,.p4-root *::after{box-sizing:border-box}.p4-root button:focus-visible{outline:3px solid rgba(22,143,163,.45);outline-offset:3px}
.p4-lang{position:fixed;top:9px;right:9px;display:flex;gap:4px;padding:3px;z-index:20;border-radius:999px;background:${T.paper};box-shadow:${T.shadowBase}}.p4-lang button{min-width:44px;min-height:44px;padding:0 12px;border:0;border-radius:999px;background:transparent;color:${T.ink2};font:800 12px 'Manrope',sans-serif;cursor:pointer}.p4-lang button.is-active{background:${T.accent};color:#fff}
.p4-head{width:100%;padding:54px clamp(12px,4vw,24px) 7px}.p4-progress,.p4-head-row{width:min(100%,936px);margin-inline:auto}.p4-progress{height:6px;border-radius:99px;background:rgba(23,59,82,.12);overflow:hidden}.p4-progress-bar{height:100%;background:linear-gradient(90deg,${T.cyan},${T.accent});transition:width .4s ease}.p4-head-row{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-top:8px}.p4-title{font-family:'Source Serif 4',Georgia,serif;font-weight:600;font-size:clamp(15px,2.4vw,19px)}.p4-counter{white-space:nowrap;font:700 13px 'JetBrains Mono',monospace;color:${T.ink3}}
.p4-main{flex:1;width:min(100%,936px);margin:0 auto;padding:3px clamp(12px,4vw,24px)}.p4-task{display:flex;flex-direction:column;gap:10px;width:100%;max-width:820px;margin:0 auto}.p4-eyebrow{margin:4px 0 0;font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}.p4-eyebrow.is-green{color:${T.success}}.p4-eyebrow.is-yellow{color:${T.warn}}.p4-eyebrow.is-red{color:${T.accent}}.p4-setup{margin:0;font-size:clamp(14px,2vw,16px);line-height:1.45;color:${T.ink2}}.p4-ask{margin:1px 0 0;font-family:'Source Serif 4',Georgia,serif;font-weight:600;font-size:clamp(17px,2.6vw,21px);line-height:1.3}.p4-note{margin:0;font-size:13px;line-height:1.4;color:${T.ink3}}
.p4-visual{width:100%;min-height:92px;padding:10px;border:1px solid rgba(23,59,82,.08);border-radius:16px;background:${T.paper};box-shadow:${T.shadowBase}}.p4-bar-field{position:relative;display:flex;align-items:flex-end;justify-content:center;gap:clamp(12px,4vw,34px);min-height:128px;padding:4px 28px 6px;border-bottom:2px solid rgba(23,59,82,.18)}.p4-bar-wrap{display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:3px;height:120px;padding:3px;border-radius:9px;transition:background-color .18s ease,box-shadow .18s ease}.p4-bar-wrap.is-hint{background:${T.accentSoft};box-shadow:inset 0 0 0 2px ${T.accent}}.p4-bar-wrap b{font:800 12px 'JetBrains Mono',monospace}.p4-bar{display:block;width:clamp(30px,8vw,52px);border-radius:9px 9px 3px 3px;background:linear-gradient(180deg,${T.cyan},#77C9D1);transition:height .36s ease}.p4-total{display:block;width:max-content;margin:6px auto 0;padding:3px 8px;border-radius:8px;color:${T.ink2};font:800 12px 'JetBrains Mono',monospace;transition:background-color .18s ease,box-shadow .18s ease}.p4-total.is-hint{background:${T.accentSoft};box-shadow:inset 0 0 0 2px ${T.accent}}.p4-mean-line{position:absolute;left:18px;right:18px;border-top:2px dashed ${T.accent};animation:p4-reveal .36s ease both}.p4-mean-line b{position:absolute;right:0;top:-22px;padding:2px 6px;border-radius:7px;background:${T.accentSoft};color:${T.accent};font:800 12px 'JetBrains Mono',monospace}
.p4-chip-visual{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:9px;min-height:82px}.p4-chip-visual span,.p4-team div span{display:inline-flex;align-items:center;justify-content:center;min-width:54px;min-height:44px;padding:7px;border-radius:11px;background:${T.cyanSoft};color:${T.navy};font:800 16px 'JetBrains Mono',monospace;transition:background-color .18s ease,box-shadow .18s ease}.p4-chip-visual span.is-hint,.p4-team div span.is-hint{background:${T.accentSoft};box-shadow:inset 0 0 0 2px ${T.accent}}.p4-numberline{display:grid;grid-template-columns:auto 1fr auto 1fr auto;align-items:center;gap:8px;min-height:96px;padding-inline:clamp(15px,6vw,50px)}.p4-numberline i{height:3px;background:${T.cyan}}.p4-numberline span,.p4-numberline b{font:800 18px 'JetBrains Mono',monospace}.p4-numberline b{display:flex;align-items:center;justify-content:center;width:44px;height:44px;border:2px solid ${T.accent};border-radius:50%;color:${T.accent};transition:box-shadow .18s ease,background-color .18s ease}.p4-numberline b.is-show{background:${T.accentSoft}}.p4-numberline b.is-hint{box-shadow:0 0 0 5px rgba(255,91,53,.2)}
.p4-compare{display:grid;grid-template-columns:1fr 1fr;gap:10px}.p4-team{display:flex;flex-direction:column;align-items:center;gap:7px;padding:9px;border-radius:13px;background:${T.cyanSoft};transition:box-shadow .18s ease}.p4-team.is-hint{box-shadow:inset 0 0 0 2px ${T.accent}}.p4-team>div{display:flex;justify-content:center;flex-wrap:wrap;gap:5px}.p4-team div span{min-width:42px;min-height:38px;background:${T.paper};font-size:13px}.p4-team em{font-style:normal;font-weight:800;color:${T.success};animation:p4-reveal .36s ease both}.p4-error{display:flex;align-items:center;justify-content:center;gap:clamp(9px,3vw,22px);font:800 clamp(16px,4vw,25px) 'JetBrains Mono',monospace}.p4-error del{color:${T.warn};transition:background-color .18s ease}.p4-error del.is-hint{padding:5px;border-radius:8px;background:${T.warnSoft}}.p4-error b{color:${T.success}}
.p4-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.p4-option{display:flex;align-items:center;gap:9px;min-height:54px;padding:9px 11px;text-align:left;font-family:inherit;font-weight:700;font-size:clamp(13px,1.9vw,15px);line-height:1.35;color:${T.ink};background:${T.paper};border:1px solid rgba(23,59,82,.12);border-radius:14px;cursor:pointer;box-shadow:0 8px 18px -18px rgba(23,59,82,.5);transition:border-color .18s ease,background-color .18s ease,transform .18s ease}.p4-option:hover:not(:disabled),.p4-card:hover:not(:disabled){border-color:rgba(22,143,163,.45);transform:translateY(-1px)}.p4-letter{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:8px;background:${T.cyanSoft};color:${T.cyan};font:800 11px 'JetBrains Mono',monospace}.p4-option.is-on{border-color:${T.accent};background:${T.accentSoft}}.p4-option.is-ok{border-color:rgba(34,122,83,.45);background:${T.successSoft};color:${T.success}}.p4-option.is-no{border-color:rgba(169,111,19,.45);background:${T.warnSoft};color:${T.warn}}
.p4-match-cols{display:flex;gap:9px;margin-top:7px}.p4-match-col{display:flex;flex-direction:column;gap:7px;flex:1}.p4-match-item{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-height:48px;padding:7px 9px;border:1px solid rgba(23,59,82,.12);border-radius:12px;background:${T.paper};font:800 clamp(12px,2.2vw,15px) 'Manrope',sans-serif;color:${T.navy};cursor:pointer;transition:border-color .18s ease,background-color .18s ease}.p4-match-item.is-active{border-color:${T.accent};background:${T.accentSoft}}.p4-match-item.is-hint{border-color:${T.accent};box-shadow:inset 0 0 0 2px rgba(255,91,53,.28)}.p4-match-item.is-tied{border-color:rgba(34,122,83,.35)}.p4-match-item.is-used{background:${T.successSoft}}.p4-match-item:disabled{cursor:default;opacity:.58}.p4-tie{font-size:12px;color:${T.success}}
.p4-order-slots{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin-top:7px}.p4-order-slot{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-height:72px;padding:7px;border:1px dashed rgba(23,59,82,.3);border-radius:13px;background:${T.paper};color:${T.ink2};font-family:inherit;cursor:pointer;transition:border-color .18s ease,background-color .18s ease}.p4-order-slot.is-active{border-style:solid;border-color:${T.accent};background:${T.accentSoft}}.p4-order-slot.is-hint{border-style:solid;border-color:${T.accent};box-shadow:inset 0 0 0 2px rgba(255,91,53,.28)}.p4-order-slot small{font-weight:800}.p4-order-slot b{font-size:12px;line-height:1.25;color:${T.navy}}.p4-card-bank{display:flex;flex-wrap:wrap;justify-content:center;gap:7px;margin-top:8px}.p4-card{min-height:46px;padding:7px 11px;border:1px solid rgba(23,59,82,.14);border-radius:12px;background:${T.paper};font:800 13px 'Manrope',sans-serif;color:${T.navy};cursor:pointer;transition:border-color .18s ease,background-color .18s ease,transform .18s ease}.p4-card.is-used{background:${T.cyanSoft};border-color:${T.cyan}}
.p4-pad{display:flex;flex-direction:column;align-items:center;gap:7px;width:min(232px,100%);margin:0 auto;padding:10px;border-radius:17px;background:linear-gradient(155deg,#EDF1F3,#DDE4E8)}.p4-pad-display{display:flex;align-items:center;justify-content:center;width:100%;min-height:48px;border:2px solid ${T.accent};border-radius:13px;background:${T.paper};font:800 clamp(20px,4.4vw,26px) 'JetBrains Mono',monospace;color:${T.navy}}.p4-pad-keys{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;width:100%}.p4-key{min-width:44px;min-height:44px;border:1px solid rgba(23,59,82,.16);border-radius:11px;background:${T.paper};font:800 clamp(18px,3.6vw,22px) 'JetBrains Mono',monospace;color:${T.navy};cursor:pointer}.p4-key-del{background:${T.accentSoft};color:${T.accent}}
.p4-fb{padding:11px 13px;border-radius:14px}.p4-fb.is-ok{background:${T.successSoft};box-shadow:inset 4px 0 0 ${T.success}}.p4-fb.is-no{background:${T.warnSoft};box-shadow:inset 4px 0 0 ${T.warn}}.p4-fb-txt{margin:0;font-family:'Source Serif 4',Georgia,serif;font-size:clamp(14px,2.1vw,16px);line-height:1.42}.p4-rule{margin:7px 0 0;font-size:13px;color:${T.ink2}}
.p4-actions{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:9px;margin-top:2px}.p4-btn{min-width:44px;min-height:46px;padding:9px 20px;border:0;border-radius:12px;background:${T.paper};color:${T.accent};font-family:inherit;font-weight:800;font-size:14px;cursor:pointer;box-shadow:0 8px 20px -10px rgba(255,91,53,.5),inset 0 0 0 1px rgba(255,91,53,.2)}.p4-btn:disabled{opacity:.45;cursor:not-allowed;box-shadow:none}.p4-btn-ready{background:${T.accent};color:#fff}.p4-btn-ghost{background:transparent;color:${T.ink2};box-shadow:none}.p4-done{display:flex;flex-direction:column;align-items:center;gap:9px;padding:24px 12px;text-align:center}.p4-done h2{margin:0;font-family:'Source Serif 4',Georgia,serif}.p4-medal{display:flex;align-items:center;justify-content:center;width:72px;height:72px;border-radius:50%;background:${T.accent};color:#fff;font-size:34px;box-shadow:0 0 0 9px ${T.accentSoft}}.p4-score{display:flex;align-items:baseline;gap:5px;margin:0;font-family:'JetBrains Mono',monospace}.p4-score b{font-size:clamp(32px,7vw,44px);color:${T.success}}.p4-score span{font-size:16px;color:${T.ink3}}.p4-complete{margin:0;color:${T.ink2}}
.p4-card{min-width:44px}
.p4-bar-wrap{flex:0 0 auto;width:clamp(44px,15.5vw,66px);height:116px;padding:0 3px 3px}.p4-bar-wrap b{line-height:16px;white-space:nowrap}.p4-bar{flex:0 0 auto}.p4-chip-equalize{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:4px;min-height:82px}.p4-chip-source,.p4-chip-parts{display:flex;align-items:center;justify-content:center;gap:4px}.p4-chip-source span{display:flex;align-items:center;gap:4px}.p4-chip-source span.is-hint b{background:${T.accentSoft};box-shadow:inset 0 0 0 2px ${T.accent}}.p4-chip-source i,.p4-flow{font-style:normal;font-weight:800;color:${T.ink3}}.p4-chip-source b,.p4-chip-parts b,.p4-chip-pool{display:inline-flex;align-items:center;justify-content:center;min-width:32px;min-height:40px;padding:5px;border-radius:10px;background:${T.cyanSoft};color:${T.navy};font:800 13px 'JetBrains Mono',monospace;transition:background-color .18s ease,box-shadow .18s ease}.p4-chip-pool{min-width:40px;background:${T.accentSoft};color:${T.accent};animation:p4-math-reveal .32s .06s both}.p4-chip-parts{animation:p4-math-reveal .36s .2s both}.p4-flow{animation:p4-math-reveal .32s both}.p4-flow-late{animation-delay:.16s}.p4-numberline b.is-show,.p4-error b.is-show{animation:p4-math-reveal .36s ease both}
@keyframes p4-reveal{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}@keyframes p4-math-reveal{from{opacity:0;transform:translateY(4px) scale(.94)}to{opacity:1;transform:none}}
@media(max-width:520px){.p4-head{padding-top:58px}.p4-options{grid-template-columns:1fr}.p4-order-slots{grid-template-columns:repeat(3,minmax(0,1fr))}.p4-order-slot{min-height:60px;padding:5px}.p4-order-slot b{font-size:10px}.p4-compare{grid-template-columns:1fr}.p4-match-cols{gap:7px}.p4-match-item{font-size:12px;padding:6px}.p4-bar-field{gap:7px;padding-inline:6px}.p4-bar-wrap b{font-size:10px}.p4-visual{min-height:82px}.p4-title{max-width:75%}}
@media(prefers-reduced-motion:reduce){.p4-root *,.p4-root *::before,.p4-root *::after{scroll-behavior:auto!important;transition:none!important;animation:none!important}}
`;
