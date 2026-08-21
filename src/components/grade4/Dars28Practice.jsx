// ============================================================================
// 4-SINF · 28-DARS AMALIYOTI · VAQT BIRLIKLARI
// 10 topshiriq · UZ/RU/EN · ovozsiz · solve-to-advance.
// ============================================================================

import { useEffect, useMemo, useRef, useState } from 'react';
import { PRACTICE_FIX_CSS } from './grade4PracticeFixStyles.js';

const b = (ru, uz, en) => ({ ru, uz, en });
const option = (id, ru, uz, en, correct = false, wrongRu = '', wrongUz = '', wrongEn = '') => ({
  id, text: b(ru, uz, en), correct, wrong: wrongRu ? b(wrongRu, wrongUz, wrongEn) : null,
});
const tx = (value, lang) => (value && typeof value === 'object' && !Array.isArray(value) ? value[lang] ?? '' : value);
const SUPPORTED_LANGS = ['uz', 'ru', 'en'];
const normalizeLang = (value) => SUPPORTED_LANGS.includes(value) ? value : 'uz';

const UI = {
  title: b('Урок 28. Практика: единицы времени', '28-dars. Amaliyot: vaqt birliklari', 'Lesson 28. Practice: units of time'),
  language: b('Язык', 'Til', 'Language'), task: b('Задание', 'Topshiriq', 'Task'),
  level: { green: b('Базовое', 'Asosiy', 'Core'), yellow: b('Применение', "Qo'llash", 'Application'), red: b('Перенос', "Ko'chirish", 'Transfer') },
  check: b('Проверить', 'Tekshirish', 'Check'), retry: b('Исправить ответ', 'Javobni tuzatish', 'Correct the answer'),
  next: b('Следующее', 'Keyingisi', 'Next'), finish: b('Завершить', 'Yakunlash', 'Finish'),
  again: b('Пройти заново', 'Qaytadan ishlash', 'Try again'), done: b('Практика пройдена', 'Amaliyot tugadi', 'Practice complete'),
  firstTry: b('верно с первой проверки', "birinchi tekshiruvda to'g'ri", 'correct on the first check'),
  allSolved: b('Все 10 заданий решены.', '10 ta topshiriqning barchasi yechildi.', 'All 10 tasks have been solved.'),
  rule: b('Запомните', 'Eslab qoling', 'Remember'), typeAnswer: b('Введите числовой ответ', 'Sonli javobni kiriting', 'Enter a numerical answer'),
  clear: b('Стереть', "O'chirish", 'Delete'),
  matchHint: b('Выберите карточку слева, затем пару справа.', "Avval chapdagi kartani, keyin o'ngdagi juftini tanlang.", 'Choose a card on the left, then its match on the right.'),
  orderHint: b('Выберите место, затем карточку шага.', 'Avval joyni, keyin qadam kartasini tanlang.', 'Choose a position, then a step card.'),
};

const LESSON_META = {
  lessonId: 'num-4-28-practice', lessonTitle: UI.title, grade: 4, lessonNumber: 28,
  activityType: 'practice', taskCount: 10, resultIsUiState: true,
  progression: { green: 2, yellow: 5, red: 3 },
};

const SCREEN_META = [
  { id: 'practice-01', taskId: '01', template: 'multiple-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-02', taskId: '02', template: 'matching', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-03', taskId: '03', template: 'ordering', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-04', taskId: '04', template: 'numeric-input', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-05', taskId: '05', template: 'numeric-blank', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-06', taskId: '06', template: 'numeric-input', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-07', taskId: '07', template: 'matching', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-08', taskId: '08', template: 'boundary-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-09', taskId: '09', template: 'error-analysis', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-10', taskId: '10', template: 'strategy-transfer', type: 'practice', scored: true, scope: 'final' },
];

const TASKS = [
  {
    id: '01', level: 'green', kind: 'mc', skillTag: 'seconds_minutes',
    visual: { type: 'time-chain', text: b('420 с → ? мин', '420 s → ? min', '420 s → ? min'), background: '#F5F5F0', colours: ['#168FA3', '#FF5B35'] },
    setup: b('В одной минуте 60 секунд.', 'Bir minutda 60 soniya bor.', 'There are 60 seconds in one minute.'),
    prompt: b('Сколько минут составляют 420 секунд?', '420 soniya necha minut?', 'How many minutes are 420 seconds?'),
    options: [
      option('seven-minutes', '7 минут', '7 minut', '7 minutes', true),
      option('forty-two-minutes', '42 минуты', '42 minut', '42 minutes', false, 'Число 42 получилось бы при делении на 10, но секунд в минуте 60.', "42 soni 10 ga bo'lishdan chiqadi, ammo bir minutda 60 soniya bor.", 'Forty-two would come from dividing by 10, but a minute has 60 seconds.'),
      option('seventy-minutes', '70 минут', '70 minut', '70 minutes', false, 'Нужно найти число полных групп по 60, а не умножать цифры.', "60 talik to'liq guruhlar sonini topish kerak, raqamlarni ko'paytirish emas.", 'Find the number of complete groups of 60; do not multiply the digits.'),
      option('four-twenty-minutes', '420 минут', '420 minut', '420 minutes', false, 'Единица не меняется сама: секунды нужно сгруппировать по 60.', "Birlik o'z-o'zidan o'zgarmaydi: soniyalarni 60 tadan guruhlash kerak.", 'The unit does not change by itself: group the seconds in sixties.'),
    ],
    secondHint: b('Разделите 420 секунд на группы по 60.', '420 soniyani 60 tadan guruhlarga ajrating.', 'Split 420 seconds into groups of 60.'),
    thirdHint: b('Шесть групп дают 360 секунд, ещё одна группа — 420.', 'Olti guruh 360 soniya, yana bir guruh 420 soniya beradi.', 'Six groups make 360 seconds; one more makes 420.'),
    correctText: b('Верно. В 420 секундах семь групп по 60.', "To'g'ri. 420 soniyada 60 talik yettita guruh bor.", 'Correct. There are seven groups of 60 in 420 seconds.'),
    rule: b('Секунды переводят в минуты делением на 60.', "Soniyadan minutga o'tishda 60 ga bo'linadi.", 'Convert seconds to minutes by dividing by 60.'),
  },
  {
    id: '02', level: 'green', kind: 'match', skillTag: 'time_equivalence',
    visual: { type: 'time-cards', text: b('мин ↔ с · дни ↔ ч · недели ↔ дни', 'min ↔ s · kun ↔ soat · hafta ↔ kun', 'min ↔ s · days ↔ h · weeks ↔ days'), background: '#F5F5F0', colours: ['#168FA3', '#FF5B35'] },
    setup: b('У каждой пары единиц свой коэффициент.', "Har bir birliklar juftining o'z koeffitsiyenti bor.", 'Each pair of units has its own conversion factor.'),
    prompt: b('Соедините равные промежутки времени.', 'Teng vaqt oraliqlarini moslashtiring.', 'Match the equivalent lengths of time.'),
    pairs: [
      { id: 'six-min', left: b('6 минут', '6 minut', '6 minutes'), correctRight: '360-sec' },
      { id: 'three-days', left: b('3 суток', '3 sutka', '3 days'), correctRight: '72-hours' },
      { id: 'five-weeks', left: b('5 недель', '5 hafta', '5 weeks'), correctRight: '35-days' },
    ],
    right: [
      { id: '360-sec', text: b('360 секунд', '360 soniya', '360 seconds') },
      { id: '72-hours', text: b('72 часа', '72 soat', '72 hours') },
      { id: '35-days', text: b('35 дней', '35 kun', '35 days') },
    ],
    wrong: [b('Сначала назовите связь именно для выбранной пары единиц.', "Avval aynan tanlangan birliklar jufti bog'lanishini ayting.", 'First state the relationship for the chosen pair of units.')],
    secondHint: b('Используйте 60 секунд, 24 часа и 7 дней как одну крупную единицу.', '60 soniya, 24 soat va 7 kunni bittadan katta birlik deb oling.', 'Use 60 seconds, 24 hours and 7 days as one larger unit.'),
    thirdHint: b('6 × 60; 3 × 24; 5 × 7.', '6 × 60; 3 × 24; 5 × 7.', 'Use 6 × 60, 3 × 24 and 5 × 7.'),
    correctText: b('Верно. Все три пары показывают одинаковую длительность.', "To'g'ri. Uchala juft ham bir xil davomiylikni ko'rsatadi.", 'Correct. All three pairs show equal lengths of time.'),
    rule: b('Перед преобразованием вспоминают связь выбранной пары единиц.', "Aylantirishdan oldin tanlangan birliklar jufti bog'lanishi eslanadi.", 'Recall the relationship for the chosen pair before converting.'),
  },
  {
    id: '03', level: 'yellow', kind: 'order', skillTag: 'mixed_time_procedure',
    visual: { type: 'procedure', text: b('2 ч 45 мин → ? мин', '2 soat 45 min → ? min', '2 h 45 min → ? min'), background: '#F5F5F0', colours: ['#168FA3', '#FF5B35'] },
    setup: b('Смешанную запись нужно выразить только в минутах.', "Aralash yozuvni faqat minutda ifodalash kerak.", 'The mixed time must be expressed in minutes only.'),
    prompt: b('Расположите шаги преобразования по порядку.', 'Aylantirish qadamlarini tartib bilan joylashtiring.', 'Put the conversion steps in order.'),
    steps: [
      { id: 'step-1', label: b('Шаг 1', '1-qadam', 'Step 1') }, { id: 'step-2', label: b('Шаг 2', '2-qadam', 'Step 2') },
      { id: 'step-3', label: b('Шаг 3', '3-qadam', 'Step 3') }, { id: 'step-4', label: b('Шаг 4', '4-qadam', 'Step 4') },
    ],
    cards: [
      { id: 'target-minutes', text: b('Цель: минуты', 'Maqsad: minut', 'Target: minutes'), order: 0 },
      { id: 'hours-to-minutes', text: b('2 ч = 120 мин', '2 soat = 120 min', '2 h = 120 min'), order: 1 },
      { id: 'add-remainder', text: b('120 + 45', '120 + 45', '120 + 45'), order: 2 },
      { id: 'result-165', text: b('165 минут', '165 minut', '165 minutes'), order: 3 },
    ],
    wrong: [b('Сначала определяют целевую единицу, затем преобразуют часы.', "Avval maqsad birlik aniqlanadi, keyin soat aylantiriladi.", 'Identify the target unit first, then convert the hours.')],
    secondHint: b('Оставшиеся 45 минут добавляют только после перевода двух часов.', "Qolgan 45 minut ikki soat aylantirilgandan keyin qo'shiladi.", 'Add the remaining 45 minutes only after converting the two hours.'),
    thirdHint: b('Порядок: минуты → 120 минут → прибавить 45 → 165 минут.', "Tartib: minut → 120 minut → 45 ni qo'shish → 165 minut.", 'Order: minutes → 120 minutes → add 45 → 165 minutes.'),
    correctText: b('Верно. Два часа и 45 минут составляют 165 минут.', "To'g'ri. Ikki soat 45 minut 165 minutga teng.", 'Correct. Two hours and 45 minutes make 165 minutes.'),
    rule: b('В смешанной записи сначала преобразуют крупную часть, затем добавляют мелкую.', "Aralash yozuvda avval katta qism aylantiriladi, keyin kichik qism qo'shiladi.", 'For a mixed measure, convert the larger part, then add the smaller part.'),
  },
  {
    id: '04', level: 'yellow', kind: 'numpad', skillTag: 'week_day_conversion', answer: '46', maxLen: 2,
    visual: { type: 'calendar', text: b('6 недель 4 дня → ? дней', '6 hafta 4 kun → ? kun', '6 weeks 4 days → ? days'), background: '#F5F5F0', colours: ['#168FA3', '#FF5B35'] },
    setup: b('Одна неделя равна семи дням.', 'Bir hafta yetti kunga teng.', 'One week equals seven days.'),
    prompt: b('Введите общее число дней.', 'Kunlarning umumiy sonini kiriting.', 'Enter the total number of days.'),
    wrong: [b('Сначала найдите число дней в шести полных неделях.', "Avval oltita to'liq haftadagi kunlar sonini toping.", 'First find the number of days in six complete weeks.')],
    secondHint: b('Шесть недель — это 42 дня; ещё четыре дня сохраняются.', "Olti hafta 42 kun; yana to'rt kun saqlanadi.", 'Six weeks are 42 days; keep the extra four days.'),
    thirdHint: b('42 + 4 = 46.', '42 + 4 = 46.', '42 + 4 = 46.'),
    correctText: b('Верно. 6 недель 4 дня — это 46 дней.', "To'g'ri. 6 hafta 4 kun 46 kunga teng.", 'Correct. Six weeks and four days equal 46 days.'),
    rule: b('Недели переводят в дни по 7, затем добавляют оставшиеся дни.', "Haftalar 7 tadan kunga aylantiriladi, keyin qolgan kunlar qo'shiladi.", 'Convert weeks to days in groups of seven, then add the remaining days.'),
  },
  {
    id: '05', level: 'yellow', kind: 'missing', skillTag: 'time_remainder', answer: '17', maxLen: 2,
    visual: { type: 'mixed-time', text: b('197 мин = 3 ч □ мин', '197 min = 3 soat □ min', '197 min = 3 h □ min'), background: '#F5F5F0', colours: ['#168FA3', '#FF5B35'] },
    setup: b('Три полных часа занимают 180 минут.', "Uch to'liq soat 180 minutni egallaydi.", 'Three complete hours take 180 minutes.'),
    prompt: b('Какой остаток минут нужно записать?', 'Qoldiq sifatida necha minut yoziladi?', 'How many minutes remain?'),
    wrong: [b('В поле нужен остаток после трёх полных групп по 60.', "Katakka 60 talik uchta to'liq guruhdan keyingi qoldiq kerak.", 'The blank needs the remainder after three complete groups of 60.')],
    secondHint: b('Отделите 180 минут от 197 минут.', '197 minutdan 180 minutni ajrating.', 'Separate 180 minutes from 197 minutes.'),
    thirdHint: b('После 180 до 197 остаётся 17 минут.', '180 dan 197 gacha 17 minut qoladi.', 'There are 17 minutes left after 180.'),
    correctText: b('Верно. 197 минут = 3 часа 17 минут.', "To'g'ri. 197 minut = 3 soat 17 minut.", 'Correct. 197 minutes = 3 hours 17 minutes.'),
    rule: b('В нормальной записи остаток минут меньше 60.', "Me'yoriy yozuvda minut qoldig'i 60 dan kichik bo'ladi.", 'In normal form, the minute remainder is less than 60.'),
  },
  {
    id: '06', level: 'yellow', kind: 'numpad', skillTag: 'elapsed_time', answer: '105', maxLen: 3,
    visual: { type: 'timeline', text: b('09:35 → 11:20', '09:35 → 11:20', '09:35 → 11:20'), background: '#F5F5F0', colours: ['#168FA3', '#FF5B35'] },
    setup: b('Занятие началось в 09:35 и закончилось в 11:20.', "Mashg'ulot 09:35 da boshlandi va 11:20 da tugadi.", 'A session started at 09:35 and ended at 11:20.'),
    prompt: b('Введите длительность в минутах.', 'Davomiylikni minutlarda kiriting.', 'Enter the duration in minutes.'),
    wrong: [b('Разбейте путь времени у круглого часа.', "Vaqt yo'lini to'liq soat chegarasida bo'ling.", 'Split the time interval at a whole hour.')],
    secondHint: b('От 09:35 до 10:00 — 25 минут, затем 60 и ещё 20 минут.', "09:35 dan 10:00 gacha 25 minut, keyin 60 va yana 20 minut.", 'From 09:35 to 10:00 is 25 minutes, then 60 and another 20 minutes.'),
    thirdHint: b('25 + 60 + 20 = 105 минут = 1 час 45 минут.', '25 + 60 + 20 = 105 minut = 1 soat 45 minut.', '25 + 60 + 20 = 105 minutes = 1 hour 45 minutes.'),
    correctText: b('Верно. Занятие длилось 105 минут.', "To'g'ri. Mashg'ulot 105 minut davom etdi.", 'Correct. The session lasted 105 minutes.'),
    rule: b('Длительность можно найти частями до удобных круглых часов.', "Davomiylikni qulay to'liq soatlargacha bo'lib topish mumkin.", 'Find elapsed time in parts using convenient whole-hour boundaries.'),
  },
  {
    id: '07', level: 'yellow', kind: 'match', skillTag: 'multi_time_units',
    visual: { type: 'unit-map', text: b('сек → ч · ч → сутки · мес → годы', 's → soat · soat → sutka · oy → yil', 's → h · h → days · months → years'), background: '#F5F5F0', colours: ['#168FA3', '#FF5B35'] },
    setup: b('Преобразования проходят через разные отношения единиц.', "Aylantirishlar turli birlik munosabatlari orqali o'tadi.", 'The conversions use different unit relationships.'),
    prompt: b('Соедините равные записи.', 'Teng yozuvlarni moslashtiring.', 'Match the equivalent measures.'),
    pairs: [
      { id: '7200-sec', left: b('7200 секунд', '7200 soniya', '7200 seconds'), correctRight: 'two-hours' },
      { id: '96-hours', left: b('96 часов', '96 soat', '96 hours'), correctRight: 'four-days' },
      { id: '36-months', left: b('36 месяцев', '36 oy', '36 months'), correctRight: 'three-years' },
    ],
    right: [
      { id: 'two-hours', text: b('2 часа', '2 soat', '2 hours') },
      { id: 'four-days', text: b('4 суток', '4 sutka', '4 days') },
      { id: 'three-years', text: b('3 года', '3 yil', '3 years') },
    ],
    wrong: [b('Для каждой строки выберите собственную связь единиц.', "Har bir qator uchun o'z birliklar bog'lanishini tanlang.", 'Choose the relevant unit relationship for each row.')],
    secondHint: b('Используйте 3600 секунд в часе, 24 часа в сутках и 12 месяцев в году.', 'Bir soatda 3600 soniya, sutkada 24 soat va yilda 12 oydan foydalaning.', 'Use 3,600 seconds per hour, 24 hours per day and 12 months per year.'),
    thirdHint: b('7200 ÷ 3600; 96 ÷ 24; 36 ÷ 12.', '7200 ÷ 3600; 96 ÷ 24; 36 ÷ 12.', 'Use 7200 ÷ 3600, 96 ÷ 24 and 36 ÷ 12.'),
    correctText: b('Верно. Все три преобразования выполнены по своим отношениям.', "To'g'ri. Uchala aylantirish o'z munosabati bo'yicha bajarildi.", 'Correct. Each conversion uses its own unit relationship.'),
    rule: b('У времени нет одного общего коэффициента для всех пар единиц.', "Vaqtning barcha birliklar jufti uchun bitta umumiy koeffitsiyent yo'q.", 'There is no single conversion factor for every pair of time units.'),
  },
  {
    id: '08', level: 'red', kind: 'mc', skillTag: 'calendar_boundary',
    visual: { type: 'calendar-boundary', text: b('2 месяца → ? дней', '2 oy → ? kun', '2 months → ? days'), background: '#F5F5F0', colours: ['#168FA3', '#FF5B35'] },
    setup: b('Названия двух месяцев не указаны.', 'Ikki oyning nomi ko‘rsatilmagan.', 'The two months have not been named.'),
    prompt: b('Сколько дней в этих двух месяцах?', 'Bu ikki oyda necha kun bor?', 'How many days are in these two months?'),
    options: [
      option('not-enough-information', 'Нельзя определить без названий месяцев', "Oylar qaysiligi aytilmasa, aniqlab bo'lmaydi", 'It cannot be determined without knowing the months', true),
      option('sixty-days', '60 дней', '60 kun', '60 days', false, 'Не каждый месяц длится 30 дней.', 'Har bir oy 30 kun davom etmaydi.', 'Not every month has 30 days.'),
      option('fifty-six-days', '56 дней', '56 kun', '56 days', false, 'Два месяца не всегда состоят из четырёх недель каждый.', "Ikki oyning har biri doim to'rt haftadan iborat emas.", 'Two months do not always contain exactly four weeks each.'),
      option('sixty-two-days', '62 дня', '62 kun', '62 days', false, 'Не каждый месяц длится 31 день.', 'Har bir oy 31 kun davom etmaydi.', 'Not every month has 31 days.'),
    ],
    secondHint: b('В календаре месяцы имеют разное число дней.', 'Taqvimda oylarning kunlari soni turlicha.', 'Calendar months have different numbers of days.'),
    thirdHint: b('Нужно знать конкретные месяцы и, для февраля, год.', 'Aniq oylarni va fevral uchun yilni bilish kerak.', 'You need the particular months and, for February, the year.'),
    correctText: b('Верно. Без названий месяцев точного ответа нет.', "To'g'ri. Oylar nomisiz aniq javob yo'q.", 'Correct. There is no exact answer without knowing the months.'),
    rule: b('Месяцы нельзя переводить в дни одним постоянным коэффициентом.', "Oylarni bitta doimiy koeffitsiyent bilan kunga aylantirib bo'lmaydi.", 'Months cannot be converted to days with one fixed factor.'),
  },
  {
    id: '09', level: 'red', kind: 'mc', skillTag: 'time_normalization_error',
    visual: { type: 'error-card', text: b('2 ч 90 мин = 2 ч 30 мин ✕', '2 soat 90 min = 2 soat 30 min ✕', '2 h 90 min = 2 h 30 min ✕'), background: '#F5F5F0', colours: ['#168FA3', '#FF5B35'] },
    setup: b('Ученик заменил 90 минут на 30 минут, но не добавил полный час.', "O'quvchi 90 minutni 30 minutga almashtirdi, ammo to'liq soatni qo'shmadi.", 'A pupil replaced 90 minutes with 30 minutes but did not add the complete hour.'),
    prompt: b('Как исправить запись?', 'Yozuvni qanday tuzatish kerak?', 'How should the statement be corrected?'),
    options: [
      option('three-hours-thirty', '3 часа 30 минут', '3 soat 30 minut', '3 hours 30 minutes', true),
      option('two-hours-thirty', '2 часа 30 минут', '2 soat 30 minut', '2 hours 30 minutes', false, 'Из 90 минут выделен час, но он потерян.', '90 minutdan ajralgan bir soat yo‘qolib qolgan.', 'An hour was regrouped from the 90 minutes but then lost.'),
      option('three-hours-ninety', '3 часа 90 минут', '3 soat 90 minut', '3 hours 90 minutes', false, 'Остаток минут должен быть меньше 60.', 'Minut qoldig‘i 60 dan kichik bo‘lishi kerak.', 'The minute remainder must be less than 60.'),
      option('two-hours-nine', '2 часа 9 минут', '2 soat 9 minut', '2 hours 9 minutes', false, 'Ноль нельзя просто удалить: 90 минут — это час и 30 минут.', 'Nolni shunchaki olib tashlab bo‘lmaydi: 90 minut bir soat 30 minut.', 'You cannot simply remove the zero: 90 minutes are one hour 30 minutes.'),
    ],
    secondHint: b('Разложите 90 минут как 60 минут и ещё 30 минут.', '90 minutni 60 minut va yana 30 minutga ajrating.', 'Partition 90 minutes into 60 minutes and 30 minutes.'),
    thirdHint: b('60 минут добавляют один час к уже имеющимся двум.', '60 minut mavjud ikki soatga yana bir soat qo‘shadi.', 'The 60 minutes add one hour to the existing two hours.'),
    correctText: b('Верно. 2 часа 90 минут = 3 часа 30 минут.', "To'g'ri. 2 soat 90 minut = 3 soat 30 minut.", 'Correct. 2 hours 90 minutes = 3 hours 30 minutes.'),
    rule: b('При нормализации каждые 60 минут перегруппируют в час.', "Me'yorlashtirishda har 60 minut bir soatga qayta guruhlanadi.", 'When normalising, regroup every 60 minutes as one hour.'),
  },
  {
    id: '10', level: 'red', kind: 'mc', skillTag: 'elapsed_time_strategy',
    visual: { type: 'midnight-timeline', text: b('23:15 → 00:00 → 01:50', '23:15 → 00:00 → 01:50', '23:15 → 00:00 → 01:50'), background: '#F5F5F0', colours: ['#168FA3', '#FF5B35'] },
    setup: b('Поездка началась в 23:15 и закончилась на следующий день в 01:50.', 'Safar 23:15 da boshlandi va keyingi kuni 01:50 da tugadi.', 'A journey began at 23:15 and ended at 01:50 the next day.'),
    prompt: b('Какая стратегия и длительность верны?', "Qaysi strategiya va davomiylik to'g'ri?", 'Which strategy and duration are correct?'),
    options: [
      option('split-at-midnight', 'До полуночи 45 мин, после полуночи 110 мин; всего 155 мин = 2 ч 35 мин', "Yarim tungacha 45 min, undan keyin 110 min; jami 155 min = 2 soat 35 min", '45 min to midnight, then 110 min; total 155 min = 2 h 35 min', true),
      option('subtract-clock-readings', '01:50 − 23:15 = 21 ч 25 мин', '01:50 − 23:15 = 21 soat 25 min', '01:50 − 23:15 = 21 h 25 min', false, 'Конечное время относится к следующему дню; прямое вычитание показаний неверно.', "Tugash vaqti keyingi kunga tegishli; ko'rsatkichlarni to'g'ridan-to'g'ri ayirish noto'g'ri.", 'The end time is on the next day, so directly subtracting the readings is invalid.'),
      option('ignore-midnight', '23:15 → 01:50: 1 ч 35 мин', '23:15 → 01:50: 1 soat 35 min', '23:15 → 01:50: 1 h 35 min', false, 'Переход через полночь содержит ещё один полный час.', "Yarim tundan o'tish yana bir to'liq soatni o'z ichiga oladi.", 'Crossing midnight includes another complete hour.'),
      option('add-readings', '23 ч 15 мин + 1 ч 50 мин = 25 ч 5 мин', '23 soat 15 min + 1 soat 50 min = 25 soat 5 min', '23 h 15 min + 1 h 50 min = 25 h 5 min', false, 'Показания часов не складывают; находят пройденный промежуток.', "Soat ko'rsatkichlari qo'shilmaydi; o'tgan oraliq topiladi.", 'Clock readings are not added; find the elapsed interval.'),
    ],
    secondHint: b('Используйте полночь как удобную границу: 23:15 → 00:00 → 01:50.', 'Yarim tunni qulay chegara sifatida ishlating: 23:15 → 00:00 → 01:50.', 'Use midnight as a convenient boundary: 23:15 → 00:00 → 01:50.'),
    thirdHint: b('45 + 110 = 155 минут; 155 минут = 2 часа 35 минут.', '45 + 110 = 155 minut; 155 minut = 2 soat 35 minut.', '45 + 110 = 155 minutes; 155 minutes = 2 hours 35 minutes.'),
    correctText: b('Верно. Разбиение у полуночи даёт 155 минут.', "To'g'ri. Yarim tunda bo'lish 155 minutni beradi.", 'Correct. Splitting at midnight gives 155 minutes.'),
    rule: b('При переходе через сутки делят промежуток у полуночи и складывают части.', "Sutka chegarasidan o'tishda oraliq yarim tunda bo'linib, qismlar qo'shiladi.", 'When crossing into a new day, split at midnight and combine the parts.'),
  },
];

const shuffle = (items) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; }
  return copy;
};
const adaptive = (task, pickedOption, attempts) => attempts >= 3 ? task.thirdHint : attempts >= 2 ? task.secondHint : pickedOption?.wrong || task.wrong?.[0] || task.secondHint;

function Visual({ task, lang }) {
  return <div className="p4-visual">
    <strong>{tx(task.visual.text, lang)}</strong>
  </div>;
}

function NumPad({ value, onChange, max, disabled, lang }) {
  return <div className="p4-pad" role="group" aria-label={tx(UI.typeAnswer, lang)}><output>{value || '—'}</output><div className="p4-pad-keys">
    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => <button type="button" key={digit} disabled={disabled} onClick={() => onChange(value.length >= max ? value : `${value}${digit}`)}>{digit}</button>)}
    <button type="button" className="is-delete" disabled={disabled} aria-label={tx(UI.clear, lang)} onClick={() => onChange(value.slice(0, -1))}>⌫</button>
  </div></div>;
}

function Feedback({ ok, text, rule, lang }) {
  return <div className={`p4-feedback ${ok ? 'is-ok' : 'is-no'}`} role="status" aria-live="polite"><p>{tx(text, lang)}</p>{ok && <p><b>{tx(UI.rule, lang)}.</b> {tx(rule, lang)}</p>}</div>;
}

function Task({ task, lang, isLast, onSolved, shuffleSeed }) {
  const [pickedId, setPickedId] = useState(null); const [typed, setTyped] = useState(''); const [pairs, setPairs] = useState({});
  const [activeLeft, setActiveLeft] = useState(null); const [placed, setPlaced] = useState({}); const [activeStep, setActiveStep] = useState(null);
  const [attempts, setAttempts] = useState(0); const [checked, setChecked] = useState(false); const [solved, setSolved] = useState(false); const [advancing, setAdvancing] = useState(false);
  const checkingRef = useRef(false); const advancedRef = useRef(false);
  // Xato javobdan keyin variantlar qayta aralashadi (metodist qarori 2026-08-21).
  const [wrongRound, setWrongRound] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- restart/task keys intentionally trigger a fresh shuffle
  const options = useMemo(() => shuffle(task.options || []), [shuffleSeed, task.id, task.options, wrongRound]);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- restart/task keys intentionally trigger a fresh shuffle
  const rightCards = useMemo(() => shuffle(task.right || []), [shuffleSeed, task.id, task.right]);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- restart/task keys intentionally trigger a fresh shuffle
  const orderCards = useMemo(() => shuffle(task.cards || []), [shuffleSeed, task.id, task.cards]);
  const answerReady = task.kind === 'mc' ? pickedId !== null : task.kind === 'numpad' || task.kind === 'missing' ? typed.length > 0 : task.kind === 'match' ? task.pairs.every((pair) => pairs[pair.id]) : task.steps.every((step) => placed[step.id]);
  const answerCorrect = () => {
    if (task.kind === 'mc') return task.options.find((item) => item.id === pickedId)?.correct === true;
    if (task.kind === 'numpad' || task.kind === 'missing') return typed === task.answer;
    if (task.kind === 'match') return task.pairs.every((pair) => pairs[pair.id] === pair.correctRight);
    return task.cards.every((card) => placed[task.steps[card.order].id] === card.id);
  };
  const clearResponse = () => { checkingRef.current = false; setChecked(false); setPickedId(null); setTyped(''); setPairs({}); setActiveLeft(null); setPlaced({}); setActiveStep(null); };
  const setResponse = (setter, value) => { checkingRef.current = false; setter(value); setChecked(false); };
  const check = () => { if (!answerReady || solved || checked || checkingRef.current) return; checkingRef.current = true; setAttempts((old) => old + 1); setChecked(true); if (answerCorrect()) setSolved(true); else setWrongRound((old) => old + 1); };
  const pickedOption = task.kind === 'mc' ? task.options.find((item) => item.id === pickedId) : null;
  const studentAnswer = task.kind === 'mc' ? { optionId: pickedId, text: pickedOption?.text } : task.kind === 'numpad' || task.kind === 'missing' ? { value: typed } : task.kind === 'match' ? { pairs } : { order: task.steps.map((step) => placed[step.id]) };
  const correctAnswer = task.kind === 'mc' ? (() => { const item = task.options.find((candidate) => candidate.correct); return { optionId: item.id, text: item.text }; })() : task.kind === 'numpad' || task.kind === 'missing' ? { value: task.answer } : task.kind === 'match' ? { pairs: Object.fromEntries(task.pairs.map((pair) => [pair.id, pair.correctRight])) } : { order: task.cards.slice().sort((a, c) => a.order - c.order).map((card) => card.id) };

  return <section className="p4-task" aria-labelledby={`task-${task.id}`}>
    <p className={`p4-eyebrow is-${task.level}`}><span>{tx(UI.level[task.level], lang)}</span> · {tx(UI.task, lang)} {Number(task.id)}</p>
    <p className="p4-setup">{tx(task.setup, lang)}</p><Visual task={task} lang={lang}/><h2 id={`task-${task.id}`}>{tx(task.prompt, lang)}</h2>
    {task.kind === 'mc' && <div className="p4-options">{options.map((item, index) => <button type="button" key={item.id} disabled={solved} aria-pressed={pickedId === item.id} className={`p4-option ${pickedId === item.id ? checked ? item.correct ? 'is-ok' : 'is-no' : 'is-on' : ''}`} onClick={() => { checkingRef.current = false; setPickedId(item.id); setChecked(false); }}><span className="p4-letter">{'ABCD'[index]}</span>{tx(item.text, lang)}</button>)}</div>}
    {(task.kind === 'numpad' || task.kind === 'missing') && <NumPad value={typed} onChange={(value) => setResponse(setTyped, value)} max={task.maxLen || 4} disabled={solved} lang={lang}/>}
    {task.kind === 'match' && <div className="p4-match"><p>{tx(UI.matchHint, lang)}</p><div><section className="p4-match-col">{task.pairs.map((pair) => <button type="button" key={pair.id} disabled={solved} aria-pressed={activeLeft === pair.id} className={`${activeLeft === pair.id ? 'is-active' : ''} ${pairs[pair.id] ? 'is-tied' : ''}`} onClick={() => { checkingRef.current = false; setActiveLeft(pair.id); setChecked(false); }}>{tx(pair.left, lang)}{pairs[pair.id] && <small>{tx(task.right.find((item) => item.id === pairs[pair.id])?.text, lang)}</small>}</button>)}</section><section className="p4-match-col">{rightCards.map((item) => { const used = Object.values(pairs).includes(item.id); return <button type="button" key={item.id} disabled={solved || activeLeft === null || used} className={used ? 'is-used' : ''} onClick={() => { checkingRef.current = false; setPairs((old) => ({ ...old, [activeLeft]: item.id })); setActiveLeft(null); setChecked(false); }}>{tx(item.text, lang)}</button>; })}</section></div></div>}
    {task.kind === 'order' && <div className="p4-order"><p>{tx(UI.orderHint, lang)}</p><div className="p4-order-slots">{task.steps.map((step) => <button type="button" key={step.id} disabled={solved} aria-pressed={activeStep === step.id} className={activeStep === step.id ? 'is-active' : ''} onClick={() => { checkingRef.current = false; setActiveStep(step.id); setChecked(false); }}><small>{tx(step.label, lang)}</small><b>{placed[step.id] ? tx(task.cards.find((card) => card.id === placed[step.id])?.text, lang) : '—'}</b></button>)}</div><div className="p4-card-bank">{orderCards.map((card) => { const used = Object.values(placed).includes(card.id); return <button type="button" key={card.id} disabled={solved || activeStep === null || used} className={used ? 'is-used' : ''} onClick={() => { checkingRef.current = false; setPlaced((old) => ({ ...old, [activeStep]: card.id })); setActiveStep(null); setChecked(false); }}>{tx(card.text, lang)}</button>; })}</div></div>}
    {checked && <Feedback ok={solved} text={solved ? task.correctText : adaptive(task, pickedOption, attempts)} rule={task.rule} lang={lang}/>}
    <div className="p4-actions">{!checked && !solved && <button type="button" className="p4-btn" disabled={!answerReady} onClick={check}>{tx(UI.check, lang)}</button>}{checked && !solved && <button type="button" className="p4-btn p4-btn-ghost is-ghost" onClick={clearResponse}>{tx(UI.retry, lang)}</button>}{solved && <button type="button" className="p4-btn p4-btn-ready is-ready" disabled={advancing} onClick={() => { if (advancedRef.current) return; advancedRef.current = true; checkingRef.current = false; setAdvancing(true); onSolved({ taskId: task.id, taskNumber: Number(task.id), level: task.level, kind: task.kind, skillTag: task.skillTag, attempts, firstTry: attempts === 1, correct: true, setup: task.setup, prompt: task.prompt, studentAnswer, correctAnswer, answerChoices: task.kind === 'mc' ? options.map(({ id, text, correct }) => ({ id, text, correct })) : task.right ?? task.cards ?? null, screenMeta: SCREEN_META.find((screen) => screen.taskId === task.id) }); }}>{tx(isLast ? UI.finish : UI.next, lang)}</button>}</div>
  </section>;
}

export default function Grade4Dars28Practice({ studentName, lang: langProp, onFinished }) {
  const preview = langProp === undefined || langProp === null; const [previewLang, setPreviewLang] = useState('uz'); const lang = normalizeLang(preview ? previewLang : langProp);
  const [index, setIndex] = useState(0); const [answers, setAnswers] = useState([]); const [firstTry, setFirstTry] = useState(0); const [finished, setFinished] = useState(false); const [runId, setRunId] = useState(0);
  const finishedRef = useRef(false); const startedAtRef = useRef(0); useEffect(() => { if (!startedAtRef.current) startedAtRef.current = Date.now(); }, []);
  const task = TASKS[index]; const percent = Math.round(((finished ? 10 : index) / 10) * 100);
  const onSolved = (record) => {
    const nextAnswers = [...answers, record]; const nextFirstTry = firstTry + (record.firstTry ? 1 : 0); setAnswers(nextAnswers); setFirstTry(nextFirstTry);
    if (index !== 9) { setIndex((old) => old + 1); return; } if (finishedRef.current) return; finishedRef.current = true; setFinished(true);
    const scorePercent = Math.round((nextFirstTry / 10) * 100); const levelBreakdown = ['green', 'yellow', 'red'].reduce((result, level) => ({ ...result, [level]: { total: TASKS.filter((item) => item.level === level).length, firstTry: nextAnswers.filter((item) => item.level === level && item.firstTry).length } }), {});
    onFinished?.({ lessonId: LESSON_META.lessonId, lessonTitle: tx(LESSON_META.lessonTitle, lang), lessonTitleLocalized: LESSON_META.lessonTitle, studentName: studentName || null, activityType: 'practice', completed: true, totalQuestions: 10, answeredQuestions: 10, correctAnswers: nextFirstTry, firstTryCorrect: nextFirstTry, scorePercent, finalScore: nextFirstTry, finalTotal: 10, passed: nextFirstTry >= 6, firstTryStats: { total: 10, firstTryCorrect: nextFirstTry, correct: nextFirstTry, answered: 10, scorePercent }, attemptsTotal: nextAnswers.reduce((sum, item) => sum + item.attempts, 0),
      // eslint-disable-next-line react-hooks/purity -- duration is captured when the lesson finishes
      durationSec: startedAtRef.current ? Math.max(0, Math.floor((Date.now() - startedAtRef.current) / 1000)) : 0, skillTags: [...new Set(TASKS.map((item) => item.skillTag))], levelBreakdown, lessonMeta: LESSON_META, screenMeta: SCREEN_META, answers: nextAnswers });
  };
  const restart = () => { finishedRef.current = false; startedAtRef.current = Date.now(); setIndex(0); setAnswers([]); setFirstTry(0); setFinished(false); setRunId((old) => old + 1); };
  return <div className="p4-root"><style>{STYLES + PRACTICE_FIX_CSS}</style>{preview && <div className="p4-lang" role="group" aria-label={tx(UI.language, lang)}>{SUPPORTED_LANGS.map((code) => <button type="button" key={code} aria-pressed={lang === code} className={lang === code ? 'is-active' : ''} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}<header><div className="p4-progress" role="progressbar" aria-label={tx(UI.title, lang)} aria-valuemin="0" aria-valuemax="10" aria-valuenow={finished ? 10 : index}><i style={{ width: `${percent}%` }}/></div><div><span className="p4-title">{tx(UI.title, lang)}</span><b className="p4-counter">{finished ? 10 : index + 1} / 10</b></div></header><main>{finished ? <section className="p4-done" aria-live="polite"><h2>{tx(UI.done, lang)}</h2><strong>{firstTry}<small>/ 10</small></strong><p>{tx(UI.firstTry, lang)}</p><p>{tx(UI.allSolved, lang)}</p><button type="button" className="p4-btn p4-btn-ready" onClick={restart}>{tx(UI.again, lang)}</button></section> : <Task key={`${runId}-${task.id}`} task={task} lang={lang} isLast={index === 9} onSolved={onSolved} shuffleSeed={`${LESSON_META.lessonId}:${runId}`}/>}</main></div>;
}

const STYLES = `
.p4-root{position:relative;min-height:100dvh;overflow-x:clip;padding:0 0 24px;background:#F5F5F0!important;color:#12212C;font-family:'Manrope',system-ui,sans-serif}
.p4-root *,.p4-root *::before,.p4-root *::after{box-sizing:border-box}.p4-root p,.p4-root h2{margin:0}.p4-root button:focus-visible{outline:3px solid rgba(22,143,163,.45);outline-offset:3px}
.p4-lang{position:absolute;top:8px;right:8px;z-index:9;display:flex;gap:6px;padding:0;background:transparent;box-shadow:none}.p4-lang button{min-width:44px;min-height:44px;padding:0 10px;border:0;border-radius:99px;background:#FFFFFF;color:#50616D;font:800 11px 'Manrope',sans-serif;cursor:pointer;box-shadow:0 4px 12px -8px rgba(23,59,82,.4)}.p4-lang button.is-active{background:#FF5B35;color:#fff}
.p4-root>header{padding:46px clamp(12px,4vw,24px) 8px}.p4-root>header>div,.p4-root>main{width:min(720px,100%)!important;margin-inline:auto}.p4-progress{height:6px;border:0;border-radius:99px;background:rgba(23,59,82,.12);overflow:hidden}.p4-progress i{display:block;height:100%;background:linear-gradient(90deg,#168FA3,#FF5B35);transition:width .4s ease}.p4-root>header>div:last-child{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-top:8px;color:#12212C}.p4-title{font-family:'Source Serif 4',Georgia,serif;font-weight:600;font-size:clamp(15px,2.4vw,19px)}.p4-counter{white-space:nowrap;font:700 13px 'JetBrains Mono',monospace;color:#87949D}
.p4-root>main{padding:4px clamp(12px,4vw,24px)}.p4-task{display:grid;gap:12px}.p4-eyebrow,.p4-eyebrow.is-green,.p4-eyebrow.is-yellow,.p4-eyebrow.is-red{color:#FF5B35;font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase}.p4-setup{color:#50616D;font-size:clamp(14px,2vw,16px);line-height:1.5}.p4-task h2{font:600 clamp(17px,2.6vw,21px)/1.25 'Source Serif 4',Georgia,serif;color:#12212C}
.p4-visual{position:relative;display:grid;place-items:center;min-height:108px;padding:14px 10px;border-radius:16px;background:#FFFFFF!important;box-shadow:inset 0 0 0 1px rgba(23,59,82,.08);overflow:hidden}.p4-visual strong{text-align:center;color:#173B52;font:800 clamp(22px,5vw,34px)/1.25 'JetBrains Mono',monospace;letter-spacing:.01em}
.p4-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.p4-option{display:flex;align-items:center;gap:9px;min-width:44px;min-height:56px;padding:10px 12px;text-align:left;border:1px solid rgba(23,59,82,.12);border-radius:14px;background:#FFFFFF;color:#12212C;box-shadow:none;font:700 clamp(13px,1.9vw,15px)/1.35 'Manrope',sans-serif;cursor:pointer;transition:transform .16s,border-color .2s,background .2s}.p4-match button,.p4-order button{min-width:44px;min-height:48px;padding:8px 10px;border:1px solid rgba(23,59,82,.12);border-radius:12px;background:#FFFFFF;color:#12212C;box-shadow:none;font:700 clamp(13px,1.9vw,15px)/1.35 'Manrope',sans-serif;cursor:pointer;transition:transform .16s,border-color .2s,background .2s}.p4-option:hover:not(:disabled),.p4-match button:hover:not(:disabled),.p4-order button:hover:not(:disabled){border-color:rgba(22,143,163,.4);transform:translateY(-2px)}.p4-letter{flex:0 0 26px;width:26px;height:26px;border-radius:8px;display:grid;place-items:center;background:#E5F5F6;color:#168FA3;font:800 11px 'JetBrains Mono',monospace}.p4-option.is-on,.p4-match button.is-active,.p4-order button.is-active{border-color:#FF5B35;background:#FFF0EA;box-shadow:none}.p4-option.is-ok{border-color:rgba(34,122,83,.4);background:#E7F3EC;color:#227A53}.p4-option.is-ok .p4-letter{background:#227A53;color:#fff}.p4-option.is-no{border-color:rgba(169,111,19,.4);background:#FFF5D9;color:#A96F13}.p4-option.is-no .p4-letter{background:#A96F13;color:#fff}
.p4-match>p,.p4-order>p{margin-bottom:7px;color:#87949D;font-size:13px}.p4-match>div{display:grid;grid-template-columns:1fr 1fr;gap:10px}.p4-match section{display:grid;gap:8px}.p4-match button{display:grid;place-items:center;font-family:'JetBrains Mono',monospace;color:#173B52}.p4-match button small{display:block;color:#227A53}.p4-match button.is-tied{border-color:rgba(34,122,83,.35);background:#FFFFFF}.p4-match button.is-used,.p4-order button.is-used{background:#E7F3EC;opacity:.62}.p4-order-slots{display:grid;grid-template-columns:repeat(4,1fr);gap:7px}.p4-order-slots button{display:grid;gap:3px;place-items:center}.p4-order-slots small{color:#87949D}.p4-order-slots b{font-family:'JetBrains Mono',monospace}.p4-card-bank{display:flex;flex-wrap:wrap;justify-content:center;gap:7px;margin-top:8px}
.p4-pad{display:flex;flex-direction:column;align-items:center;gap:8px;width:min(240px,100%);margin:0 auto;padding:12px;border-radius:18px;background:linear-gradient(155deg,#EDF1F3,#DDE4E8);box-shadow:inset 0 1px rgba(255,255,255,.9)}.p4-pad output{display:flex;align-items:center;justify-content:center;width:100%;min-height:50px;padding:8px;border:2px solid #FF5B35;border-radius:13px;background:#FFFFFF;color:#173B52;font:800 clamp(20px,4.4vw,26px) 'JetBrains Mono',monospace;letter-spacing:2px}.p4-pad>div{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;width:100%}.p4-pad button{min-width:44px;min-height:44px;border:1px solid rgba(23,59,82,.16);border-radius:12px;background:#FFFFFF;color:#173B52;font:800 clamp(18px,3.6vw,22px) 'JetBrains Mono',monospace;cursor:pointer}.p4-pad button:hover:not(:disabled){border-color:#168FA3}.p4-pad button.is-delete{background:#FFF0EA;color:#FF5B35}
.p4-feedback{padding:12px 14px;border-radius:14px;line-height:1.45}.p4-feedback.is-ok{background:#E7F3EC;color:#1B6644;box-shadow:inset 4px 0 0 #227A53}.p4-feedback.is-no{background:#FFF5D9;color:#8A5C10;box-shadow:inset 4px 0 0 #A96F13}.p4-feedback p{font-family:'Source Serif 4',Georgia,serif;font-size:clamp(14px,2.1vw,16px)}.p4-feedback p+p{margin-top:5px;color:#50616D}
.p4-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:4px}.p4-actions .p4-btn,.p4-done .p4-btn{min-width:44px;min-height:46px;padding:10px 22px;border:0;border-radius:12px;background:#FFFFFF;color:#FF5B35;font:800 14px 'Manrope',sans-serif;cursor:pointer;box-shadow:0 8px 20px -10px rgba(255,91,53,.5),inset 0 0 0 1px rgba(255,91,53,.2)}.p4-actions .p4-btn:disabled{opacity:.45;cursor:not-allowed;box-shadow:none}.p4-actions button.p4-btn-ghost{background:transparent;color:#50616D;box-shadow:none}.p4-actions button.p4-btn-ready,.p4-done button.p4-btn-ready{background:#FF5B35;color:#fff}
.p4-done{min-height:0;display:flex;flex-direction:column;align-items:center;gap:10px;padding:20px 12px;text-align:center}.p4-done h2{font:600 clamp(19px,3vw,24px) 'Source Serif 4',Georgia,serif}.p4-done>strong{font:800 clamp(32px,7vw,44px) 'JetBrains Mono',monospace;color:#227A53}.p4-done>strong small{font-size:14px;color:#87949D}.p4-done p{color:#50616D}.p4-done button{margin-top:0}
@media(max-width:520px){.p4-options{grid-template-columns:1fr}.p4-order-slots{grid-template-columns:repeat(2,1fr)}.p4-match>div{gap:8px}.p4-root>header{padding-top:54px}.p4-visual{min-height:96px}}
@media(max-width:640px) and (max-height:700px){.p4-root>header{padding:40px 10px 3px!important}.p4-root>main{padding:1px 8px!important}.p4-task{gap:5px!important}.p4-setup{font-size:12px;line-height:1.3}.p4-task h2{font-size:16px!important}.p4-visual{min-height:72px!important;padding:8px 10px!important;border-radius:16px}.p4-visual strong{font-size:18px}.p4-options{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:5px!important}.p4-options button,.p4-match button,.p4-order button{min-height:44px!important;padding:5px 8px!important;font-size:12px!important}.p4-actions .p4-btn,.p4-done .p4-btn{min-height:44px!important;padding:7px 14px}.p4-feedback{padding:8px 10px}}
@media(prefers-reduced-motion:reduce){.p4-root *,.p4-root *::before,.p4-root *::after{scroll-behavior:auto!important;animation:none!important;transition:none!important}}
`;
