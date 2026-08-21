// ============================================================================
// 4-SINF · 17-DARS AMALIYOTI · SHKALALAR
// Dars01Practice kontrakti: 10 topshiriq, UZ/RU/EN, ovozsiz, solve-to-advance.
// ============================================================================

import { useEffect, useMemo, useRef, useState } from 'react';

const T = {
  bg: '#F5F5F0', paper: '#FFFFFF', ink: '#12212C', ink2: '#50616D', ink3: '#87949D',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', lime: '#95C93D', success: '#227A53', successSoft: '#E7F3EC',
  warn: '#A96F13', warnSoft: '#FFF5D9', shadowBase: '0 16px 36px -24px rgba(23,59,82,.34)',
};

const SUPPORTED_LANGS = ['uz', 'ru', 'en'];
const normalizeLang = (value) => SUPPORTED_LANGS.includes(value) ? value : 'uz';
const b = (ru, uz, en) => ({ ru, uz, en });
const option = (id, ru, uz, en, correct = false, wrongRu = '', wrongUz = '', wrongEn = '') => ({
  id, text: b(ru, uz, en), correct, wrong: wrongRu ? b(wrongRu, wrongUz, wrongEn) : null,
});
const tx = (value, lang) => (value && typeof value === 'object' && !Array.isArray(value) ? (value[lang] ?? '') : value);
const adaptive = (task, pickedOption, attempts) => {
  if (attempts >= 3) return task.thirdHint;
  if (attempts >= 2) return task.secondHint;
  return pickedOption?.wrong || task.wrong?.[0] || task.secondHint;
};
const shuffle = (items) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const UI = {
  title: b('Урок 17. Практика: шкалы', "17-dars. Amaliyot: shkalalar", "Lesson 17. Practice: scales"),
  task: b('Задание', 'Topshiriq', "Task"),
  level: { green: b('Базовое', 'Asosiy', "Core"), yellow: b('Применение', "Qo'llash", "Application"), red: b('Перенос', "Ko'chirish", "Transfer") },
  check: b('Проверить', 'Tekshirish', "Check"), retry: b('Исправить ответ', 'Javobni tuzatish', "Correct the answer"),
  next: b('Следующее', 'Keyingisi', "Next"), finish: b('Завершить', 'Yakunlash', "Finish"),
  again: b('Пройти заново', 'Qaytadan ishlash', "Try again"), done: b('Практика пройдена', 'Amaliyot tugadi', "Practice complete"),
  firstTry: b('верно с первой проверки', "birinchi tekshiruvda to'g'ri", "correct on the first check"),
  allSolved: b('Все 10 заданий решены.', '10 ta topshiriqning barchasi yechildi.', "All 10 tasks have been solved."),
  rule: b('Запомните', 'Eslab qoling', "Remember"), typeAnswer: b('Введите числовой ответ', 'Sonli javobni kiriting', "Enter a numerical answer"),
  clear: b('Стереть', "O'chirish", "Delete"), matchHint: b('Выберите карточку слева, затем пару справа.', "Avval chapdagi kartani, keyin o'ngdagi juftini tanlang.", "Choose a card on the left, then its match on the right."),
  orderHint: b('Выберите место, затем карточку шага.', 'Avval joyni, keyin qadam kartasini tanlang.', "Choose a position, then a step card."),
  language: b('Язык', 'Til', 'Language'), numerator: b('Числитель', 'Surat', 'Numerator'), denominator: b('Знаменатель', 'Maxraj', 'Denominator'),
};

const LESSON_META = {
  lessonId: 'num-4-17-practice', lessonTitle: UI.title, grade: 4, lessonNumber: 17,
  activityType: 'practice', taskCount: 10, resultIsUiState: true,
  progression: { green: 2, yellow: 5, red: 3 },
};

const SCREEN_META = [
  { id: 'practice-01', taskId: '01', template: 'multiple-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-02', taskId: '02', template: 'tick-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-03', taskId: '03', template: 'matching', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-04', taskId: '04', template: 'numeric-input', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-05', taskId: '05', template: 'numeric-blank', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-06', taskId: '06', template: 'numeric-input', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-07', taskId: '07', template: 'ordering', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-08', taskId: '08', template: 'multiple-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-09', taskId: '09', template: 'error-analysis', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-10', taskId: '10', template: 'strategy-transfer', type: 'practice', scored: true, scope: 'final' },
];

const TASKS = [
  {
    id: '01', level: 'green', kind: 'mc', skillTag: 'division-value',
    visual: { type: 'scale', min: 0, max: 70, intervals: 7 },
    setup: b('На шкале от 0 до 70 семь равных делений.', "Shkalada 0 dan 70 gacha 7 ta teng bo'linma bor.", "There are seven equal intervals on the scale from 0 to 70."),
    prompt: b('Чему равна цена одного деления?', "Bitta bo'linma qiymati nechaga teng?", "What is the value of one interval?"),
    options: [
      option('parts', '7', '7', "7", false, 'Семь — это число делений, а не цена одного деления.', "Yetti bo'linmalar soni, bitta bo'linmaning qiymati emas.", "Seven is the number of intervals, not the value of one interval."),
      option('ticks', '8', '8', "8", false, 'Восемь — это число штрихов. Считать нужно промежутки между ними.', "Sakkiz belgilar soni. Ular orasidagi bo'linmalarni sanash kerak.", "Eight is the number of marks. You need to count the intervals between them."),
      option('correct', '10', '10', "10", true),
      option('span', '70', '70', "70", false, 'Семьдесят — значение всего промежутка. Его нужно разделить на семь.', "Yetmish butun oraliq qiymati. Uni yettiga bo'lish kerak.", "Seventy is the value of the whole span. Divide it by seven."),
    ],
    secondHint: b('Сравните число штрихов и число промежутков между ними.', "Belgilar soni bilan ular orasidagi bo'linmalar sonini solishtiring.", "Compare the number of marks with the number of intervals between them."),
    thirdHint: b('Например, 40 единиц в 4 делениях дают по 10 единиц.', "Masalan, 40 birlik 4 ta bo'linmaga ajratilsa, har biri 10 birlik bo'ladi.", "For example, 40 units across 4 intervals gives 10 units per interval."),
    correctText: b('Верно. 70 разделить на 7 равно 10.', "To'g'ri. 70 ni 7 ga bo'lsak, 10 chiqadi.", "Correct. 70 divided by 7 equals 10."),
    rule: b('Разность крайних значений делят на число делений.', "Chetdagi qiymatlar farqi bo'linmalar soniga bo'linadi.", "Divide the difference between the end values by the number of intervals."),
  },
  {
    id: '02', level: 'green', kind: 'ticks', skillTag: 'pointer-reading', answer: '42',
    tickValues: ['24', '30', '36', '42', '48'],
    visual: { type: 'scale', min: 24, max: 48, intervals: 4, markerIndex: 3, showAll: true },
    setup: b('Разность равна 24, а делений четыре. Цена деления равна 6.', "Farq 24, bo'linmalar soni 4. Bitta bo'linma qiymati 6.", "The difference is 24 and there are four intervals. Each interval has a value of 6."),
    prompt: b('Нажмите значение, на котором стоит указатель.', "Ko'rsatkich turgan qiymatni bosing.", "Choose the value indicated by the pointer."),
    wrong: [b('Посчитайте шаги от 24 до указателя.', "24 dan ko'rsatkichgacha bo'lgan qadamlarni sanang.", "Count the steps from 24 to the pointer.")],
    secondHint: b('Подсвечены три деления после 24. Каждый шаг равен 6.', "24 dan keyingi uchta bo'linma yoritildi. Har bir qadam 6 ga teng.", "The three intervals after 24 are highlighted. Each step is 6."),
    thirdHint: b('В другой шкале три шага по 5 после 20 дают 35.', "Boshqa shkalada 20 dan keyingi 5 lik uchta qadam 35 ni beradi.", "On another scale, three steps of 5 after 20 give 35."),
    correctText: b('Верно. 24 плюс три раза по 6 равно 42.', "To'g'ri. 24 ga uch karra 6 ni qo'shsak, 42 chiqadi.", "Correct. 24 plus three lots of 6 equals 42."),
    rule: b('От начального значения прибавляют цену деления нужное число раз.', "Boshlang'ich qiymatga bo'linma qiymati kerakli marta qo'shiladi.", "Add the value of one interval to the starting value the required number of times."),
  },
  {
    id: '03', level: 'yellow', kind: 'match', skillTag: 'scale-representation',
    visual: { type: 'scale-set', items: [
      { label: 'A', min: 0, max: 42, intervals: 6 }, { label: 'B', min: 80, max: 140, intervals: 4, vertical: true },
      { label: 'C', min: 300, max: 420, intervals: 6 },
    ] },
    setup: b('У каждой шкалы свои крайние значения и число делений.', "Har bir shkalaning chetdagi qiymatlari va bo'linmalar soni turlicha.", "Each scale has its own end values and number of intervals."),
    prompt: b('Соедините шкалу с ценой одного деления.', "Shkalani bitta bo'linma qiymati bilan moslashtiring.", "Match each scale to the value of one interval."),
    pairs: [
      { id: 'a', left: b('A · 0–42 · 6 делений', "A · 0–42 · 6 bo'linma", "A · 0–42 · 6 intervals"), correctRight: '7' },
      { id: 'b', left: b('B · 80–140 · 4 деления', "B · 80–140 · 4 bo'linma", "B · 80–140 · 4 intervals"), correctRight: '15' },
      { id: 'c', left: b('C · 300–420 · 6 делений', "C · 300–420 · 6 bo'linma", "C · 300–420 · 6 intervals"), correctRight: '20' },
    ],
    right: [{ id: '7', text: b('7', '7', "7") }, { id: '15', text: b('15', '15', "15") }, { id: '20', text: b('20', '20', "20") }],
    wrong: [b('Для каждой шкалы отдельно найдите разность и разделите её на число делений.', "Har bir shkala uchun farqni alohida topib, bo'linmalar soniga bo'ling.", "For each scale, find the difference separately and divide it by the number of intervals.")],
    secondHint: b('На ошибочной паре подсвечены крайние значения и число делений.', "Xato juftlikda chetdagi qiymatlar va bo'linmalar soni yoritildi.", "The end values and number of intervals are highlighted for the incorrect match."),
    thirdHint: b('Например, промежуток от 10 до 40 в пяти делениях даёт цену 6.', "Masalan, 10 dan 40 gacha bo'lgan oraliq 5 ta bo'linmada 6 lik qadam beradi.", "For example, the span from 10 to 40 across five intervals gives a value of 6."),
    correctText: b('Верно. Получились цены деления 7, 15 и 20.', "To'g'ri. Bo'linma qiymatlari 7, 15 va 20 bo'ldi.", "Correct. The interval values are 7, 15 and 20."),
    rule: b('Направление шкалы не меняет способ вычисления.', "Shkalaning yo'nalishi hisoblash usulini o'zgartirmaydi.", "The direction of the scale does not change the calculation method."),
  },
  {
    id: '04', level: 'yellow', kind: 'numpad', skillTag: 'division-value', answer: '12', maxLen: 3,
    visual: { type: 'scale', min: 135, max: 195, intervals: 5 },
    setup: b('Между 135 и 195 пять равных делений.', "135 bilan 195 orasida 5 ta teng bo'linma bor.", "There are five equal intervals between 135 and 195."),
    prompt: b('Введите цену одного деления.', "Bitta bo'linma qiymatini kiriting.", "Enter the value of one interval."),
    wrong: [b('Сначала найдите разность 195 и 135.', "Avval 195 bilan 135 ning farqini toping.", "First find the difference between 195 and 135.")],
    secondHint: b('Весь промежуток равен 60. Разделите его на пять частей.', "Butun oraliq 60 ga teng. Uni beshta qismga bo'ling.", "The whole span is 60. Divide it into five parts."),
    thirdHint: b('Пять равных частей из 50 дали бы по 10. Здесь нужно разделить 60.', "50 ni besh teng qismga ajratsak, 10 dan bo'lardi. Bu yerda 60 ni bo'lish kerak.", "Five equal parts of 50 would each be 10. Here, you need to divide 60."),
    correctText: b('Верно. 60 разделить на 5 равно 12.', "To'g'ri. 60 ni 5 ga bo'lsak, 12 chiqadi.", "Correct. 60 divided by 5 equals 12."),
    rule: b('Цена деления равна разности значений, делённой на число делений.', "Bo'linma qiymati qiymatlar farqini bo'linmalar soniga bo'lish orqali topiladi.", "The value of one interval is the difference between the values divided by the number of intervals."),
  },
  {
    id: '05', level: 'yellow', kind: 'missing', skillTag: 'missing-scale-value', answer: '90', maxLen: 3,
    visual: { type: 'sequence', values: ['75', '?', '105', '120'] },
    setup: b('Соседние штрихи шкалы расположены через одинаковый шаг.', "Shkaladagi qo'shni belgilar bir xil qadam bilan joylashgan.", "Adjacent marks on the scale are separated by equal steps."),
    prompt: b('Какое число пропущено?', "Qaysi son tushib qolgan?", "Which number is missing?"),
    wrong: [b('Разность 105 и 75 относится к двум делениям, а не к одному.', "105 bilan 75 ning farqi bitta emas, ikkita bo'linmaga tegishli.", "The difference between 105 and 75 covers two intervals, not one.")],
    secondHint: b('Между 75 и 105 два равных шага. Каждый равен 15.', "75 bilan 105 orasida ikkita teng qadam bor. Har biri 15 ga teng.", "There are two equal steps between 75 and 105. Each step is 15."),
    thirdHint: b('Если к 40 дважды прибавить 10, получатся 50 и 60. Здесь действуйте так же с шагом 15.', "40 ga ikki marta 10 qo'shilsa, 50 va 60 chiqadi. Bu yerda ham 15 lik qadamdan foydalaning.", "Adding 10 twice to 40 gives 50 and 60. Use the same method here with a step of 15."),
    correctText: b('Верно. После 75 с шагом 15 идёт 90.', "To'g'ri. 75 dan keyin 15 lik qadam bilan 90 keladi.", "Correct. With a step of 15, 90 comes after 75."),
    rule: b('На равномерной шкале соседние значения меняются на один и тот же шаг.', "Teng shkalada qo'shni qiymatlar bir xil qadamga o'zgaradi.", "On a uniform scale, adjacent values change by the same step."),
  },
  {
    id: '06', level: 'yellow', kind: 'numpad', skillTag: 'pointer-reading', answer: '280', maxLen: 3,
    visual: { type: 'scale', min: 120, max: 360, intervals: 6, markerIndex: 4, unit: 'L' },
    setup: b('Шкала бака идёт от 120 до 360 литров и имеет шесть делений.', "Bak shkalasi 120 litrdan 360 litrgacha bo'lib, 6 ta bo'linmaga ega.", "The tank scale runs from 120 to 360 litres and has six intervals."),
    prompt: b('Сколько литров показывает указатель?', "Ko'rsatkich necha litrni ko'rsatmoqda?", "How many litres does the pointer show?"),
    wrong: [b('Не используйте номер штриха как готовое значение. Сначала найдите цену деления.', "Belgi tartibini tayyor qiymat deb olmang. Avval bo'linma qiymatini toping.", "Do not use the mark number as the value. First find the value of one interval.")],
    secondHint: b('Цена деления равна 40 литрам. От 120 до указателя четыре шага.', "Bo'linma qiymati 40 litr. 120 dan ko'rsatkichgacha to'rtta qadam bor.", "Each interval represents 40 litres. There are four steps from 120 to the pointer."),
    thirdHint: b('Два шага по 30 после 100 дали бы 160. Здесь прибавьте четыре шага по 40.', "100 dan keyingi 30 lik ikki qadam 160 ni berardi. Bu yerda 40 lik to'rtta qadamni qo'shing.", "Two steps of 30 after 100 would give 160. Here, add four steps of 40."),
    correctText: b('Верно. 120 плюс четыре раза по 40 равно 280 литрам.', "To'g'ri. 120 ga to'rt karra 40 ni qo'shsak, 280 litr chiqadi.", "Correct. 120 plus four lots of 40 equals 280 litres."),
    rule: b('Сохраняйте единицу измерения вместе с найденным значением.', "Topilgan qiymat bilan o'lchov birligini birga saqlang.", "Keep the unit of measurement with the value you find."),
  },
  {
    id: '07', level: 'yellow', kind: 'order', skillTag: 'scale-strategy',
    visual: { type: 'scale', min: 260, max: 380, intervals: 6, markerIndex: 4 },
    setup: b('Нужно найти показание указателя на шкале от 260 до 380.', "260 dan 380 gacha bo'lgan shkaladagi ko'rsatkich qiymatini topish kerak.", "Find the pointer reading on the scale from 260 to 380."),
    prompt: b('Расположите шаги решения по порядку.', "Yechish qadamlarini tartib bilan joylashtiring.", "Put the solution steps in order."),
    steps: [{ id: 's1', label: b('Шаг 1', '1-qadam', "Step 1") }, { id: 's2', label: b('Шаг 2', '2-qadam', "Step 2") }, { id: 's3', label: b('Шаг 3', '3-qadam', "Step 3") }, { id: 's4', label: b('Шаг 4', '4-qadam', "Step 4") }],
    cards: [
      { id: 'difference', text: b('380 − 260 = 120', '380 − 260 = 120', "380 − 260 = 120"), order: 0 },
      { id: 'count', text: b('6 делений', "6 bo'linma", "6 intervals"), order: 1 },
      { id: 'price', text: b('120 ÷ 6 = 20', '120 ÷ 6 = 20', "120 ÷ 6 = 20"), order: 2 },
      { id: 'pointer', text: b('260 + 4 × 20 = 340', '260 + 4 × 20 = 340', "260 + 4 × 20 = 340"), order: 3 },
    ],
    wrong: [b('Сначала находят цену деления, только потом значение указателя.', "Avval bo'linma qiymati, undan keyin ko'rsatkich qiymati topiladi.", "Find the value of one interval first, then find the pointer value.")],
    secondHint: b('Первый неверно поставленный шаг выделен. Проверьте зависимость вычислений.', "Birinchi noto'g'ri joylashtirilgan qadam yoritildi. Hisoblar bog'lanishini tekshiring.", "The first incorrectly placed step is highlighted. Check how the calculations depend on one another."),
    thirdHint: b('Например, для шкалы 60–120 с тремя делениями: 120 − 60, затем 60 ÷ 3.', "Masalan, 60–120 shkaladagi 3 ta bo'linma uchun: avval 120 − 60, keyin 60 ÷ 3.", "For example, for a 60–120 scale with three intervals: calculate 120 − 60, then 60 ÷ 3."),
    correctText: b('Верно. Последовательность приводит к показанию 340.', "To'g'ri. Bu ketma-ketlik 340 qiymatiga olib keladi.", "Correct. The sequence gives a reading of 340."),
    rule: b('Разность, число делений, цена деления, показание.', "Farq, bo'linmalar soni, bo'linma qiymati, ko'rsatkich.", "Difference, number of intervals, value of one interval, reading."),
  },
  {
    id: '08', level: 'red', kind: 'mc', skillTag: 'non-zero-start',
    visual: { type: 'scale', min: 240, max: 360, intervals: 4, markerIndex: 1, vertical: true },
    setup: b('Вертикальная шкала начинается с 240, а не с нуля.', "Vertikal shkala noldan emas, 240 dan boshlanadi.", "The vertical scale starts at 240, not zero."),
    prompt: b('Какое значение показывает указатель?', "Ko'rsatkich qaysi qiymatni ko'rsatmoqda?", "Which value does the pointer show?"),
    options: [
      option('correct', '270', '270', "270", true),
      option('price', '30', '30', "30", false, 'Тридцать — цена деления, но указатель показывает значение шкалы.', "O'ttiz bo'linma qiymati, ko'rsatkich esa shkala qiymatini bildiradi.", "Thirty is the value of one interval, but the pointer shows a scale value."),
      option('zero', '90', '90', "90", false, 'Так получилось бы при неверном начале отсчёта от нуля.', "Bu natija sanashni noto'g'ri ravishda noldan boshlaganda chiqadi.", "That result comes from incorrectly starting the count at zero."),
      option('far', '330', '330', "330", false, '330 находится на третьем, а не на первом делении после 240.', "330 qiymati 240 dan keyingi birinchi emas, uchinchi bo'linmada turadi.", "330 is at the third interval after 240, not the first."),
    ],
    secondHint: b('Подсвечены начальное значение 240 и первый шаг величиной 30.', "Boshlang'ich 240 qiymati va 30 ga teng birinchi qadam yoritildi.", "The starting value 240 and the first step of 30 are highlighted."),
    thirdHint: b('Если шкала начинается с 100 и шаг равен 20, первый штрих показывает 120.', "Shkala 100 dan boshlanib, qadam 20 bo'lsa, birinchi belgi 120 ni ko'rsatadi.", "If a scale starts at 100 and the step is 20, the first mark shows 120."),
    correctText: b('Верно. 240 плюс 30 равно 270.', "To'g'ri. 240 ga 30 ni qo'shsak, 270 chiqadi.", "Correct. 240 plus 30 equals 270."),
    rule: b('Шкала не обязана начинаться с нуля.', "Shkala noldan boshlanishi shart emas.", "A scale does not have to start at zero."),
  },
  {
    id: '09', level: 'red', kind: 'mc', skillTag: 'ticks-vs-divisions',
    visual: { type: 'scale', min: 20, max: 80, intervals: 5, error: '(80 − 20) ÷ 6 = 10' },
    setup: b('На шкале шесть штрихов и пять промежутков. Получена запись (80 − 20) ÷ 6 = 10.', "Shkalada 6 ta belgi va 5 ta bo'linma bor. (80 − 20) ÷ 6 = 10 deb yozilgan.", "The scale has six marks and five intervals. The expression (80 − 20) ÷ 6 = 10 was used."),
    prompt: b('В чём ошибка рассуждения?', "Fikrlashdagi xato nimada?", "What is the error in the reasoning?"),
    options: [
      option('correct', 'Посчитали штрихи вместо делений', "Bo'linmalar o'rniga belgilar sanalgan", "The marks were counted instead of the intervals", true),
      option('subtract', 'Забыли найти разность', 'Farqni topish unutilgan', "The difference was not found", false, 'Разность 80 и 20 найдена верно и равна 60.', "80 bilan 20 ning farqi to'g'ri topilgan va 60 ga teng.", "The difference between 80 and 20 was found correctly and equals 60."),
      option('zero', 'Шкала началась не с нуля', 'Shkala noldan boshlanmagan', "The scale did not start at zero", false, 'Начало не с нуля не является ошибкой. Достаточно разности двух значений.', "Noldan boshlanmaslik xato emas. Ikki qiymatning farqi yetarli.", "Starting somewhere other than zero is not an error. The difference between the two values is enough."),
      option('pointer', 'Неверно поставили указатель', "Ko'rsatkich noto'g'ri qo'yilgan", "The pointer was placed incorrectly", false, 'В этой записи ищут цену деления, поэтому положение указателя не используется.', "Bu yozuvda bo'linma qiymati topilmoqda, shuning uchun ko'rsatkich o'rni ishlatilmaydi.", "This expression finds the value of one interval, so the pointer position is not used."),
    ],
    secondHint: b('Выделены пять промежутков между шестью штрихами.', "Oltita belgi orasidagi beshta bo'linma yoritildi.", "The five intervals between the six marks are highlighted."),
    thirdHint: b('У четырёх штрихов всегда три промежутка между ними.', "To'rtta belgi orasida har doim uchta bo'linma bo'ladi.", "Four marks always have three intervals between them."),
    correctText: b('Верно. 60 нужно разделить на 5, поэтому цена деления равна 12.', "To'g'ri. 60 ni 5 ga bo'lish kerak, shuning uchun bo'linma qiymati 12.", "Correct. Divide 60 by 5, so each interval has a value of 12."),
    rule: b('Штрихов на один больше, чем делений между ними.', "Belgilar soni ular orasidagi bo'linmalar sonidan bittaga ko'p.", "There is one more mark than there are intervals between the marks."),
  },
  {
    id: '10', level: 'red', kind: 'mc', skillTag: 'scale-strategy',
    visual: { type: 'scale', min: 250, max: 400, intervals: 5, markerIndex: 3, vertical: true },
    setup: b('Вертикальный датчик имеет пять делений от 250 до 400.', "Vertikal sensor 250 dan 400 gacha 5 ta bo'linmaga ega.", "The vertical gauge has five intervals from 250 to 400."),
    prompt: b('Какая цепочка правильно находит показание?', "Qaysi hisoblash zanjiri ko'rsatkich qiymatini to'g'ri topadi?", "Which calculation sequence correctly finds the reading?"),
    options: [
      option('correct', '(400 − 250) ÷ 5 = 30; 250 + 3 × 30 = 340', '(400 − 250) ÷ 5 = 30; 250 + 3 × 30 = 340', "(400 − 250) ÷ 5 = 30; 250 + 3 × 30 = 340", true),
      option('zero', '400 ÷ 5 = 80; 250 + 3 × 80 = 490', '400 ÷ 5 = 80; 250 + 3 × 80 = 490', "400 ÷ 5 = 80; 250 + 3 × 80 = 490", false, 'Вычисление 400 ÷ 5 игнорирует начальное значение 250.', "400 ÷ 5 hisobi boshlang'ich 250 qiymatini hisobga olmaydi.", "The calculation 400 ÷ 5 ignores the starting value 250."),
      option('ticks', '(400 − 250) ÷ 6 = 25; 250 + 3 × 25 = 325', '(400 − 250) ÷ 6 = 25; 250 + 3 × 25 = 325', "(400 − 250) ÷ 6 = 25; 250 + 3 × 25 = 325", false, 'Шесть — число штрихов. Между ними пять делений.', "Oltita belgilar soni. Ular orasida beshta bo'linma bor.", "Six is the number of marks. There are five intervals between them."),
      option('pointer', '(400 − 250) ÷ 5 = 30; 250 + 2 × 30 = 310', '(400 − 250) ÷ 5 = 30; 250 + 2 × 30 = 310', "(400 − 250) ÷ 5 = 30; 250 + 2 × 30 = 310", false, 'До указателя три деления, а не два.', "Ko'rsatkichgacha ikkita emas, uchta bo'linma bor.", "There are three intervals to the pointer, not two."),
    ],
    secondHint: b('Подсвечены пять делений и три шага от 250 до указателя.', "Beshta bo'linma va 250 dan ko'rsatkichgacha uchta qadam yoritildi.", "The five intervals and three steps from 250 to the pointer are highlighted."),
    thirdHint: b('Например, на шкале 100–220 с четырьмя делениями цена деления равна 30.', "Masalan, 100–220 shkaladagi 4 ta bo'linmaning har biri 30 ga teng.", "For example, on a 100–220 scale with four intervals, each interval has a value of 30."),
    correctText: b('Верно. Цена деления равна 30, а указатель показывает 340.', "To'g'ri. Bo'linma qiymati 30, ko'rsatkich esa 340 ni ko'rsatadi.", "Correct. Each interval has a value of 30, and the pointer shows 340."),
    rule: b('Один способ работает для горизонтальной и вертикальной шкалы.', "Bitta usul gorizontal va vertikal shkala uchun ham ishlaydi.", "The same method works for horizontal and vertical scales."),
  },
];

function ScaleModel({ visual, interactive = false, picked, onPick, hint = false, disabled = false }) {
  const { min, max, intervals, markerIndex, vertical, showAll, unit = '' } = visual;
  const values = Array.from({ length: intervals + 1 }, (_, i) => min + ((max - min) / intervals) * i);
  return <div className={`p4-scale ${vertical ? 'is-vertical' : ''} ${hint ? 'is-hint' : ''}`}>
    <div className="p4-scale-axis">
      {values.map((value, index) => {
        const pos = `${(index / intervals) * 100}%`;
        const style = vertical ? { bottom: pos } : { left: pos };
        const label = `${value}${unit ? ` ${unit}` : ''}`;
        return <div className="p4-scale-tick" style={style} key={value}>
          {interactive ? <button type="button" disabled={disabled} className={picked === String(value) ? 'is-picked' : ''} onClick={() => onPick(String(value))} aria-label={label}>{showAll ? label : value}</button> : <span>{showAll || index === 0 || index === intervals ? label : ''}</span>}
        </div>;
      })}
      {markerIndex !== undefined && <span className="p4-marker" style={vertical ? { bottom: `${(markerIndex / intervals) * 100}%` } : { left: `${(markerIndex / intervals) * 100}%` }} aria-hidden="true">▼</span>}
    </div>
    {visual.error && <del className="p4-error-formula">{visual.error}</del>}
  </div>;
}

function Cells({ total, filled = 0, second = 0, removed = 0, selected = [], onToggle, allowed = null, unequal = false, selectionMode = 'add', resolved = false, layout = 'bar', disabled = false }) {
  const widths = unequal ? [1.6, .7, 1.2, .8, 1.7, 1, 1, 1, 1, 1].slice(0, total) : Array(total).fill(1);
  const gridColumns = total % 5 === 0 ? 5 : total % 4 === 0 ? 4 : Math.ceil(Math.sqrt(total));
  return <div className={`p4-cells ${layout === 'grid' ? 'is-grid' : ''}`} style={{ gridTemplateColumns: layout === 'grid' ? `repeat(${gridColumns},1fr)` : widths.map((v) => `${v}fr`).join(' ') }}>
    {Array.from({ length: total }, (_, i) => {
      const successful = resolved && selectionMode !== 'remove' && (i < filled || selected.includes(i));
      const cls = [i < filled ? 'is-filled' : '', i >= filled && i < filled + second ? 'is-second' : '', i >= Math.max(0, filled - removed) && i < filled ? 'is-removed' : '', selected.includes(i) ? (selectionMode === 'remove' ? 'is-selected-remove' : 'is-selected') : '', successful ? 'is-success' : ''].filter(Boolean).join(' ');
      const enabled = onToggle && !disabled && (!allowed || allowed.includes(i));
      return enabled ? <button type="button" aria-pressed={selected.includes(i)} aria-label={String(i + 1)} className={cls} key={i} onClick={() => onToggle(i)} style={{ animationDelay: `${i * 70}ms` }} /> : <span className={cls} key={i} style={{ animationDelay: `${i * 70}ms` }} />;
    })}
  </div>;
}

function FractionModel({ model }) {
  if (model.shape === 'circle') return <div className="p4-model-card"><div className="p4-circle" style={{ background: `conic-gradient(${T.accent} 0 ${(model.filled / model.total) * 100}%, ${T.cyanSoft} ${(model.filled / model.total) * 100}% 100%)` }}>{Array.from({ length: model.total }, (_, i) => <span aria-hidden="true" key={i} style={{ transform: `rotate(${(i * 360) / model.total}deg)` }}/>)}</div><b>{model.label}</b></div>;
  if (model.shape === 'line') return <div className="p4-model-card"><div className="p4-number-line">{Array.from({ length: model.total + 1 }, (_, i) => <span key={i} className={i === model.filled ? 'is-point' : ''} />)}</div><b>{model.label}</b></div>;
  return <div className="p4-model-card"><Cells total={model.total} filled={model.filled} second={model.second} removed={model.removed} unequal={model.unequal} layout={model.shape}/><b>{model.label}</b></div>;
}

function Visual({ task, hintLevel, lang }) {
  const visual = task.visual;
  if (!visual) return null;
  if (visual.type === 'scale') return <div className="p4-visual"><ScaleModel visual={visual} hint={hintLevel >= 2}/></div>;
  if (visual.type === 'scale-set') return <div className="p4-visual p4-model-grid">{visual.items.map((item) => <div className="p4-model-card" key={item.label}><b>{item.label}</b><ScaleModel visual={item}/></div>)}</div>;
  if (visual.type === 'sequence') return <div className="p4-visual p4-sequence">{visual.values.map((value, i) => <span key={`${value}-${i}`}>{value}</span>)}</div>;
  if (visual.type === 'bar') return <div className="p4-visual"><Cells {...visual}/>{visual.label && <b className="p4-caption">{visual.label}</b>}</div>;
  if (visual.type === 'models') return <div className="p4-visual p4-model-grid">{visual.items.map((model, i) => <FractionModel model={model} key={`${model.label}-${i}`}/>)}</div>;
  if (visual.type === 'formula') return <div className="p4-visual p4-formula"><b className={visual.error ? 'is-error' : ''}>{visual.text}</b>{visual.subtext && <span>{tx(visual.subtext, lang)}</span>}</div>;
  if (visual.type === 'tanks') return <div className="p4-visual p4-model-grid">{visual.items.map((model) => <FractionModel model={{ ...model, shape: 'bar' }} key={model.label}/>)}</div>;
  return null;
}

function NumPad({ value, onChange, max, disabled, lang }) {
  return <div className="p4-pad" role="group" aria-label={tx(UI.typeAnswer, lang)}><div className="p4-pad-display">{value || '—'}</div><div className="p4-pad-keys">
    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => <button type="button" key={digit} disabled={disabled} onClick={() => onChange(value.length >= max ? value : `${value}${digit}`)}>{digit}</button>)}
    <button type="button" className="is-delete" disabled={disabled} aria-label={tx(UI.clear, lang)} onClick={() => onChange(value.slice(0, -1))}>⌫</button>
  </div></div>;
}

function Feedback({ ok, text, rule, lang, feedbackRef }) {
  return <div ref={feedbackRef} className={`p4-feedback ${ok ? 'is-ok' : 'is-no'}`} role="status" aria-live="polite"><p>{tx(text, lang)}</p>{ok && <p className="p4-rule"><b>{tx(UI.rule, lang)}.</b> {tx(rule, lang)}</p>}</div>;
}

// `platform` berilganda tugma qatori chizilmaydi: uni LMS o'zi beradi va
// tekshiruvni `registerCheck` orqali chaqiradi (LMS kontrakti).
function Task({ task, lang, isLast, onSolved ,
  platform = false, mode, onReady, registerCheck, onSubmit, playCorrect, playWrong,
}) {
  const [picked, setPicked] = useState(null);
  const [typed, setTyped] = useState('');
  const [pairs, setPairs] = useState({});
  const [activeLeft, setActiveLeft] = useState(null);
  const [placed, setPlaced] = useState({});
  const [activeStep, setActiveStep] = useState(null);
  const [selected, setSelected] = useState([]);
  const [fraction, setFraction] = useState({ n: null, d: null });
  const [checked, setChecked] = useState(false);
  const [solved, setSolved] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [advancing, setAdvancing] = useState(false);
  const checkingRef = useRef(false);
  const advancedRef = useRef(false);
  const feedbackRef = useRef(null);
  const rightCards = useMemo(() => shuffle(task.right || []), [task.right]);
  const orderCards = useMemo(() => shuffle(task.cards || []), [task.cards]);

  useEffect(() => {
    if (checked) window.setTimeout(() => feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 120);
  }, [checked]);

  const answerReady = (() => {
    if (task.kind === 'mc' || task.kind === 'ticks') return picked !== null;
    if (task.kind === 'numpad' || task.kind === 'missing') return typed !== '';
    if (task.kind === 'match') return Object.keys(pairs).length === task.pairs.length;
    if (task.kind === 'order') return Object.keys(placed).length === task.steps.length;
    if (task.kind === 'shade') return selected.length > 0;
    if (task.kind === 'fracbuild') return fraction.n !== null && fraction.d !== null;
    return false;
  })();
  // Variantlar aralashtiriladi va XATO javobdan keyin qayta aralashadi:
  // bola javobni o'rni bo'yicha eslab qolmasin (metodist qarori 2026-08-21).
  // Tanlov ID bo'yicha saqlanadi, shuning uchun tartib o'zgarsa ham javob
  // va uning izohi kartaning o'ziga bog'langan qoladi.
  const [wrongRound, setWrongRound] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- wrongRound ataylab yangi tartib beradi
  const mcOptions = useMemo(() => (task.kind === 'mc' ? shuffle(task.options) : []), [task.id, task.options, task.kind, wrongRound]);
  const mcPicked = task.kind === 'mc' ? task.options.find((item) => item.id === picked) : null;
  const answerCorrect = () => {
    if (task.kind === 'mc') return Boolean(mcPicked?.correct);
    if (task.kind === 'ticks') return picked === task.answer;
    if (task.kind === 'numpad' || task.kind === 'missing') return typed === task.answer;
    if (task.kind === 'match') return task.pairs.every((pair) => pairs[pair.id] === pair.correctRight);
    if (task.kind === 'order') return task.cards.every((card) => placed[task.steps[card.order].id] === card.id);
    if (task.kind === 'shade') return selected.length === task.selectCount;
    if (task.kind === 'fracbuild') return fraction.n === task.answer.n && fraction.d === task.answer.d;
    return false;
  };
  const answerSnapshot = () => {
    if (['mc', 'sign', 'card'].includes(task.kind)) return { optionId: task.options[picked]?.id, text: task.options[picked]?.text };
    if (task.kind === 'numpad' || task.kind === 'missing') return { value: typed };
    if (task.kind === 'ticks') return { value: picked };
    if (task.kind === 'match') return { pairs };
    if (task.kind === 'order') return { order: task.steps.map((step) => placed[step.id]) };
    if (task.kind === 'shade') return { selected: [...selected], selectedCount: selected.length };
    return { numerator: fraction.n, denominator: fraction.d };
  };
  const correctSnapshot = () => {
    if (['mc', 'sign', 'card'].includes(task.kind)) { const correct = task.options.find((item) => item.correct); return { optionId: correct.id, text: correct.text }; }
    if (task.kind === 'numpad' || task.kind === 'missing' || task.kind === 'ticks') return { value: task.answer };
    if (task.kind === 'match') return { pairs: Object.fromEntries(task.pairs.map((pair) => [pair.id, pair.correctRight])) };
    if (task.kind === 'order') return { order: task.cards.slice().sort((a, b) => a.order - b.order).map((card) => card.id) };
    if (task.kind === 'shade') {
      const numerator = task.selectionMode === 'remove' ? task.visual.filled - task.selectCount : task.visual.filled + task.selectCount;
      return { selectedCount: task.selectCount, fraction: `${numerator}/${task.visual.total}` };
    }
    return { numerator: task.answer.n, denominator: task.answer.d };
  };
  const resetResponse = () => {
    checkingRef.current = false; setChecked(false); setPicked(null); setTyped(''); setPairs({}); setActiveLeft(null); setPlaced({}); setActiveStep(null); setSelected([]); setFraction({ n: null, d: null });
  };
  const check = () => {
    if (!answerReady || solved || checked || checkingRef.current) return;
    checkingRef.current = true;
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts); setChecked(true);
    if (answerCorrect()) setSolved(true); else setWrongRound((old) => old + 1);
  };
  const hintLevel = checked && !solved ? attempts : 0;
  const wrongText = adaptive(task, mcPicked, attempts);
  const setAnswer = (setter, value) => { checkingRef.current = false; setter(value); setChecked(false); };
  const toggleSelected = (index) => setAnswer(setSelected, selected.includes(index) ? selected.filter((value) => value !== index) : [...selected, index]);

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
  return <section className={`p4-task ${hintLevel >= 2 ? 'is-hint' : ''}`} aria-labelledby={`task-${task.id}`}>
    <p className={`p4-eyebrow is-${task.level}`}><span>{tx(UI.level[task.level], lang)}</span> · {tx(UI.task, lang)} {Number(task.id)}</p>
    <p className="p4-setup">{tx(task.setup, lang)}</p>
    {task.kind === 'ticks' ? <div className="p4-visual"><ScaleModel visual={task.visual} interactive picked={picked} onPick={(value) => setAnswer(setPicked, value)} hint={hintLevel >= 2} disabled={solved}/></div> :
      task.kind === 'shade' ? <div className="p4-visual"><Cells total={task.visual.total} filled={task.visual.filled} second={task.visual.second} removed={task.visual.removed} selected={selected} allowed={task.allowed} onToggle={toggleSelected} selectionMode={task.selectionMode} resolved={solved} disabled={solved}/></div> : <Visual task={task} hintLevel={hintLevel} lang={lang}/>}
    <h2 id={`task-${task.id}`} className="p4-ask">{tx(task.prompt, lang)}</h2>

    {task.kind === 'mc' && <div className="p4-options">{mcOptions.map((item, index) => <button type="button" key={item.id} disabled={solved} aria-pressed={picked === item.id} className={`p4-option ${picked === item.id ? (checked ? (item.correct ? 'is-ok' : 'is-no') : 'is-on') : ''}`} onClick={() => setAnswer(setPicked, item.id)}><span className="p4-letter">{'ABCD'[index]}</span><span>{tx(item.text, lang)}</span></button>)}</div>}
    {(task.kind === 'numpad' || task.kind === 'missing') && <NumPad value={typed} onChange={(value) => setAnswer(setTyped, value)} max={task.maxLen || 4} disabled={solved} lang={lang}/>}
    {task.kind === 'match' && <div className="p4-match"><p className="p4-note">{tx(UI.matchHint, lang)}</p><div className="p4-match-cols"><div className="p4-match-col">{task.pairs.map((pair) => <button type="button" key={pair.id} disabled={solved} aria-pressed={activeLeft === pair.id} className={`p4-match-item ${activeLeft === pair.id ? 'is-active' : ''} ${pairs[pair.id] ? 'is-tied' : ''}`} onClick={() => { checkingRef.current = false; setActiveLeft(pair.id); setChecked(false); }}><span>{tx(pair.left, lang)}</span>{pairs[pair.id] && <b>{tx(task.right.find((right) => right.id === pairs[pair.id])?.text, lang)}</b>}</button>)}</div><div className="p4-match-col">{rightCards.map((right) => { const used = Object.values(pairs).includes(right.id); return <button type="button" key={right.id} disabled={solved || activeLeft === null || used} className={`p4-match-item ${used ? 'is-used' : ''}`} onClick={() => { checkingRef.current = false; setPairs((old) => ({ ...old, [activeLeft]: right.id })); setActiveLeft(null); setChecked(false); }}>{tx(right.text, lang)}</button>; })}</div></div></div>}
    {task.kind === 'order' && <div className="p4-order"><p className="p4-note">{tx(UI.orderHint, lang)}</p><div className="p4-order-slots">{task.steps.map((step) => <button type="button" key={step.id} disabled={solved} aria-pressed={activeStep === step.id} className={`p4-order-slot ${activeStep === step.id ? 'is-active' : ''}`} onClick={() => { checkingRef.current = false; setActiveStep(step.id); setChecked(false); }}><small>{tx(step.label, lang)}</small><b>{placed[step.id] ? tx(task.cards.find((card) => card.id === placed[step.id])?.text, lang) : '—'}</b></button>)}</div><div className="p4-card-bank">{orderCards.map((card) => { const used = Object.values(placed).includes(card.id); return <button type="button" key={card.id} disabled={solved || activeStep === null || used} className={`p4-card ${used ? 'is-used' : ''}`} onClick={() => { checkingRef.current = false; setPlaced((old) => ({ ...old, [activeStep]: card.id })); setActiveStep(null); setChecked(false); }}>{tx(card.text, lang)}</button>; })}</div></div>}
    {task.kind === 'fracbuild' && <div className="p4-frac-builder"><div><span>{tx(UI.numerator, lang)}</span>{task.nChoices.map((value) => <button type="button" key={value} disabled={solved} className={fraction.n === value ? 'is-active' : ''} onClick={() => { checkingRef.current = false; setFraction((old) => ({ ...old, n: value })); setChecked(false); }}>{value}</button>)}</div><hr/><div><span>{tx(UI.denominator, lang)}</span>{task.dChoices.map((value) => <button type="button" key={value} disabled={solved} className={fraction.d === value ? 'is-active' : ''} onClick={() => { checkingRef.current = false; setFraction((old) => ({ ...old, d: value })); setChecked(false); }}>{value}</button>)}</div></div>}

    {checked && <Feedback feedbackRef={feedbackRef} ok={solved} text={solved ? task.correctText : wrongText} rule={task.rule} lang={lang}/>}
    {!platform && <div className="p4-actions">{!checked && !solved && <button type="button" className="p4-btn" disabled={!answerReady} onClick={check}>{tx(UI.check, lang)}</button>}{checked && !solved && <button type="button" className="p4-btn p4-btn-ghost" onClick={resetResponse}>{tx(UI.retry, lang)}</button>}{solved && <button type="button" className="p4-btn p4-btn-ready" disabled={advancing} onClick={() => { if (advancedRef.current) return; advancedRef.current = true; checkingRef.current = false; setAdvancing(true); onSolved({ taskId: task.id, taskNumber: Number(task.id), level: task.level, kind: task.kind, skillTag: task.skillTag, attempts, firstTry: attempts === 1, correct: true, setup: task.setup, prompt: task.prompt, studentAnswer: answerSnapshot(), correctAnswer: correctSnapshot(), answerChoices: task.options?.map(({ id, text, correct }) => ({ id, text, correct: Boolean(correct) })) ?? task.right ?? task.cards ?? null, screenMeta: SCREEN_META.find((screen) => screen.taskId === task.id) }); }}>{tx(isLast ? UI.finish : UI.next, lang)}</button>}</div>}
  </section>;
}

export default function Grade4Dars17Practice({ lang: langProp, onFinished }) {
  const preview = langProp === undefined || langProp === null;
  const [previewLang, setPreviewLang] = useState('uz');
  const lang = normalizeLang(preview ? previewLang : langProp);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [firstTry, setFirstTry] = useState(0);
  const [finished, setFinished] = useState(false);
  const finishedRef = useRef(false);
  const startedAtRef = useRef(0);
  useEffect(() => { if (!startedAtRef.current) startedAtRef.current = Date.now(); }, []);
  const task = TASKS[index];
  const percent = Math.round(((finished ? 10 : index) / 10) * 100);

  const onSolved = (record) => {
    const nextAnswers = [...answers, record];
    const nextFirstTry = firstTry + (record.firstTry ? 1 : 0);
    setAnswers(nextAnswers); setFirstTry(nextFirstTry);
    if (index === 9) {
      if (finishedRef.current) return;
      finishedRef.current = true; setFinished(true);
      const levelBreakdown = ['green', 'yellow', 'red'].reduce((result, level) => ({ ...result, [level]: { total: TASKS.filter((item) => item.level === level).length, firstTry: nextAnswers.filter((item) => item.level === level && item.firstTry).length } }), {});
      onFinished?.({
        lessonId: LESSON_META.lessonId, lessonTitle: tx(LESSON_META.lessonTitle, lang), lessonTitleLocalized: LESSON_META.lessonTitle,
        studentName: null, activityType: 'practice', completed: true, totalQuestions: 10, answeredQuestions: 10,
        correctAnswers: nextFirstTry, firstTryCorrect: nextFirstTry, scorePercent: Math.round((nextFirstTry / 10) * 100),
        finalScore: nextFirstTry, finalTotal: 10, passed: nextFirstTry >= 6,
        firstTryStats: { total: 10, firstTryCorrect: nextFirstTry, correct: nextFirstTry, answered: 10, scorePercent: Math.round((nextFirstTry / 10) * 100) },
        attemptsTotal: nextAnswers.reduce((sum, item) => sum + item.attempts, 0),
        // eslint-disable-next-line react-hooks/purity -- duration is captured when the lesson finishes
        durationSec: startedAtRef.current ? Math.max(0, Math.floor((Date.now() - startedAtRef.current) / 1000)) : 0,
        skillTags: [...new Set(TASKS.map((item) => item.skillTag))], levelBreakdown, lessonMeta: LESSON_META, screenMeta: SCREEN_META, answers: nextAnswers,
      });
      return;
    }
    setIndex((old) => old + 1);
  };
  const restart = () => { finishedRef.current = false; startedAtRef.current = Date.now(); setIndex(0); setAnswers([]); setFirstTry(0); setFinished(false); };

  return <div className="p4-root"><style>{STYLES}</style>
    {preview && <div className="p4-lang" role="group" aria-label={tx(UI.language, lang)}>{SUPPORTED_LANGS.map((code) => <button type="button" key={code} aria-pressed={lang === code} className={lang === code ? 'is-active' : ''} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}
    <header className="p4-head"><div className="p4-progress" role="progressbar" aria-label={tx(UI.title, lang)} aria-valuemin="0" aria-valuemax="10" aria-valuenow={finished ? 10 : index}><div className="p4-progress-bar" style={{ width: `${percent}%` }}/></div><div className="p4-head-row"><span className="p4-title">{tx(UI.title, lang)}</span><span className="p4-counter">{finished ? 10 : index + 1} / 10</span></div></header>
    <main className="p4-main">{finished ? <section className="p4-done" aria-live="polite"><span className="p4-medal" aria-hidden="true">★</span><h2>{tx(UI.done, lang)}</h2><p className="p4-score"><b>{firstTry}</b><span>/ 10</span></p><p className="p4-note">{tx(UI.firstTry, lang)}</p><p className="p4-complete">{tx(UI.allSolved, lang)}</p><button type="button" className="p4-btn p4-btn-ready" onClick={restart}>{tx(UI.again, lang)}</button></section> : <Task key={task.id} task={task} lang={lang} isLast={index === 9} onSolved={onSolved}/>}</main>
  </div>;
}

const STYLES = `
.p4-root{position:relative;display:flex;flex-direction:column;min-height:100dvh;overflow-x:hidden;padding:0 0 18px;font-family:'Manrope',system-ui,sans-serif;color:${T.ink};background:${T.bg}}
.p4-root *,.p4-root *::before,.p4-root *::after{box-sizing:border-box}.p4-root h1,.p4-root h2,.p4-root h3,.p4-root h4,.p4-root h5,.p4-root h6,.p4-root p,.p4-root ul,.p4-root ol{margin:0}.p4-root button:focus-visible{outline:3px solid rgba(22,143,163,.45);outline-offset:3px}
.p4-lang{position:fixed;top:9px;right:9px;display:flex;gap:4px;padding:3px;z-index:20;border-radius:999px;background:${T.paper};box-shadow:${T.shadowBase}}.p4-lang button{min-width:44px;min-height:44px;padding:0 12px;border:0;border-radius:999px;background:transparent;color:${T.ink2};font:800 12px 'Manrope',sans-serif;cursor:pointer}.p4-lang button.is-active{background:${T.accent};color:#fff}
.p4-head{width:100%;padding:54px clamp(12px,4vw,24px) 7px}.p4-progress,.p4-head-row{width:min(100%,936px);margin-inline:auto}.p4-progress{height:6px;border-radius:99px;background:rgba(23,59,82,.12);overflow:hidden}.p4-progress-bar{height:100%;background:linear-gradient(90deg,${T.cyan},${T.accent});box-shadow:0 0 14px rgba(255,79,40,.42);transition:width .4s ease}.p4-head-row{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-top:8px}.p4-title{font-family:'Source Serif 4',Georgia,serif;font-weight:600;font-size:clamp(15px,2.4vw,19px)}.p4-counter{white-space:nowrap;font:700 13px 'JetBrains Mono',monospace;color:${T.ink3}}
.p4-main{flex:1;width:min(100%,936px);margin:0 auto;padding:3px clamp(12px,4vw,24px)}.p4-task{display:flex;flex-direction:column;gap:10px;width:100%;max-width:820px;margin:0 auto}.p4-eyebrow{font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}.p4-eyebrow.is-green{color:${T.success}}.p4-eyebrow.is-yellow{color:${T.warn}}.p4-eyebrow.is-red{color:${T.accent}}.p4-setup{font-size:clamp(14px,2vw,16px);line-height:1.45;color:${T.ink2}}.p4-ask{font-family:'Source Serif 4',Georgia,serif;font-weight:600;font-size:clamp(17px,2.6vw,21px);line-height:1.3}.p4-note{font-size:13px;line-height:1.4;color:${T.ink3}}
.p4-visual{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;min-height:118px;padding:12px;border-radius:18px;background:${T.paper};box-shadow:${T.shadowBase};overflow:hidden}.p4-model-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));align-items:stretch}.p4-model-card{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;min-width:0;padding:8px;border-radius:14px;background:#FBFBF8}.p4-model-card>b,.p4-caption{font:800 13px 'JetBrains Mono',monospace;color:${T.navy}}
.p4-task.is-hint .p4-visual{box-shadow:inset 0 0 0 3px rgba(255,91,53,.2),${T.shadowBase}}.p4-task.is-hint .p4-formula b{color:${T.warn}}
.p4-scale{position:relative;width:min(100%,560px);height:92px;padding:30px 26px 18px}.p4-scale-axis{position:relative;width:100%;height:5px;margin-top:24px;border-radius:99px;background:${T.navy}}.p4-scale-tick{position:absolute;top:50%;transform:translate(-50%,-50%);width:3px;height:22px;border-radius:2px;background:${T.cyan}}.p4-scale-tick span,.p4-scale-tick button{position:absolute;top:25px;left:50%;transform:translateX(-50%);min-width:44px;min-height:44px;padding:4px;border:0;background:transparent;color:${T.navy};font:800 12px 'JetBrains Mono',monospace;white-space:nowrap}.p4-scale-tick button{border-radius:10px;cursor:pointer}.p4-scale-tick button:hover,.p4-scale-tick button.is-picked{background:${T.accentSoft};color:${T.accent}}.p4-marker{position:absolute;top:-34px;transform:translateX(-50%);color:${T.accent};font-size:24px;transition:left .4s ease,bottom .4s ease}.p4-scale.is-hint .p4-scale-axis{box-shadow:0 0 0 5px rgba(255,91,53,.16)}.p4-scale.is-vertical{width:150px;height:240px;padding:22px 45px}.p4-scale.is-vertical .p4-scale-axis{width:5px;height:190px;margin:0 auto}.p4-scale.is-vertical .p4-scale-tick{top:auto;left:50%;transform:translate(-50%,50%);width:24px;height:3px}.p4-scale.is-vertical .p4-scale-tick span,.p4-scale.is-vertical .p4-scale-tick button{top:50%;left:30px;transform:translateY(-50%)}.p4-scale.is-vertical .p4-marker{top:auto;left:-34px;transform:translateY(50%) rotate(-90deg)}.p4-error-formula{display:block;margin-top:13px;text-align:center;color:${T.warn};font:800 14px 'JetBrains Mono',monospace}.p4-sequence{gap:8px}.p4-sequence span{display:flex;align-items:center;justify-content:center;min-width:66px;min-height:50px;border-radius:12px;background:${T.cyanSoft};font:800 18px 'JetBrains Mono',monospace;color:${T.navy}}
.p4-cells{display:grid;width:min(100%,520px);gap:4px}.p4-cells>span,.p4-cells>button{min-width:0;min-height:62px;border:0;border-radius:8px;background:${T.cyanSoft};box-shadow:inset 0 0 0 1px rgba(22,143,163,.2);animation:p4-cell-in .28s both}.p4-cells>button{cursor:pointer}.p4-cells .is-filled{background:${T.cyan}}.p4-cells .is-second,.p4-cells .is-selected{background:${T.lime}}.p4-cells .is-removed,.p4-cells .is-selected-remove{background:${T.warnSoft};box-shadow:inset 0 0 0 2px ${T.warn}}.p4-cells .is-success{background:${T.success};box-shadow:inset 0 0 0 1px rgba(34,122,83,.34)}.p4-circle{position:relative;overflow:hidden;width:84px;height:84px;border-radius:50%;box-shadow:inset 0 0 0 2px ${T.paper},0 0 0 2px ${T.cyan}}.p4-circle>span{position:absolute;top:0;left:50%;height:50%;border-left:2px solid rgba(255,255,255,.92);transform-origin:50% 100%}.p4-number-line{position:relative;display:flex;align-items:center;width:150px;height:52px;margin-bottom:20px;border-bottom:4px solid ${T.navy}}.p4-number-line span{position:relative;flex:1;height:14px;border-left:2px solid ${T.cyan}}.p4-number-line span:last-child{flex:0}.p4-number-line span.is-point::after{content:'';position:absolute;left:-7px;bottom:-1px;width:12px;height:12px;border-radius:50%;background:${T.accent};box-shadow:0 0 0 4px ${T.accentSoft}}.p4-number-line::before,.p4-number-line::after{position:absolute;bottom:-23px;font:800 11px 'JetBrains Mono',monospace;color:${T.ink2}}.p4-number-line::before{content:'0';left:-2px}.p4-number-line::after{content:'1';right:-2px}
.p4-cells.is-grid{width:min(100%,260px)}.p4-cells.is-grid>span,.p4-cells.is-grid>button{min-height:44px}
.p4-formula{flex-direction:column}.p4-formula b{font:800 clamp(18px,4vw,27px) 'JetBrains Mono',monospace;color:${T.navy}}.p4-formula b.is-error{color:${T.warn};text-decoration:line-through}.p4-formula span{color:${T.ink2}}
.p4-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.p4-option{display:flex;align-items:center;gap:9px;min-height:54px;padding:9px 11px;text-align:left;font-family:inherit;font-weight:700;font-size:clamp(13px,1.9vw,15px);line-height:1.35;color:${T.ink};background:${T.paper};border:0;border-radius:14px;cursor:pointer;box-shadow:${T.shadowBase};transition:border-color .18s,background-color .18s,transform .18s}.p4-option:hover:not(:disabled){transform:translateY(-1px)}.p4-letter{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:8px;background:${T.cyanSoft};color:${T.cyan};font:800 11px 'JetBrains Mono',monospace}.p4-option.is-on{background:${T.accentSoft};box-shadow:inset 0 0 0 2px ${T.accent}}.p4-option.is-ok{background:${T.successSoft};color:${T.success}}.p4-option.is-no{background:${T.warnSoft};color:${T.warn};animation:p4-shake .17s ease}
.p4-match-cols{display:flex;gap:9px;margin-top:7px}.p4-match-col{display:flex;flex-direction:column;gap:7px;flex:1}.p4-match-item{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-height:48px;padding:7px 9px;border:0;border-radius:12px;background:${T.paper};font:800 clamp(12px,2.2vw,15px) 'Manrope',sans-serif;color:${T.navy};cursor:pointer;box-shadow:${T.shadowBase}}.p4-match-item.is-active{background:${T.accentSoft};box-shadow:inset 0 0 0 2px ${T.accent}}.p4-match-item.is-tied{background:${T.cyanSoft}}.p4-match-item.is-used{background:${T.successSoft}}.p4-match-item:disabled{cursor:default;opacity:.62}.p4-match-item b{font-size:12px;color:${T.success}}
.p4-order-slots{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin-top:7px}.p4-order-slot{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-height:74px;padding:7px;border:0;border-radius:13px;background:${T.paper};color:${T.ink2};font-family:inherit;cursor:pointer;box-shadow:${T.shadowBase}}.p4-order-slot.is-active{background:${T.accentSoft};box-shadow:inset 0 0 0 2px ${T.accent}}.p4-order-slot small{font-weight:800}.p4-order-slot b{font:800 12px/1.25 'JetBrains Mono',monospace;color:${T.navy}}.p4-card-bank{display:flex;flex-wrap:wrap;justify-content:center;gap:7px;margin-top:8px}.p4-card{min-width:44px;min-height:46px;padding:7px 11px;border:0;border-radius:12px;background:${T.paper};font:800 13px 'JetBrains Mono',monospace;color:${T.navy};cursor:pointer;box-shadow:${T.shadowBase}}.p4-card.is-used{background:${T.cyanSoft}}
.p4-pad{display:flex;flex-direction:column;align-items:center;gap:7px;width:min(232px,100%);margin:0 auto;padding:10px;border-radius:17px;background:linear-gradient(155deg,#EDF1F3,#DDE4E8)}.p4-pad-display{display:flex;align-items:center;justify-content:center;width:100%;min-height:48px;border-radius:13px;background:${T.paper};font:800 clamp(20px,4.4vw,26px) 'JetBrains Mono',monospace;color:${T.navy};box-shadow:inset 0 0 0 2px ${T.accent}}.p4-pad-keys{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;width:100%}.p4-pad-keys button{min-width:44px;min-height:44px;border:0;border-radius:11px;background:${T.paper};font:800 clamp(18px,3.6vw,22px) 'JetBrains Mono',monospace;color:${T.navy};cursor:pointer;box-shadow:0 5px 14px -12px rgba(23,59,82,.7)}.p4-pad-keys .is-delete{background:${T.accentSoft};color:${T.accent}}
.p4-frac-builder{display:grid;gap:8px;padding:12px;border-radius:17px;background:${T.paper};box-shadow:${T.shadowBase}}.p4-frac-builder>div{display:flex;align-items:center;justify-content:center;gap:7px;flex-wrap:wrap}.p4-frac-builder span{min-width:90px;color:${T.ink2};font-weight:800}.p4-frac-builder button{min-width:44px;min-height:44px;border:0;border-radius:11px;background:${T.cyanSoft};color:${T.cyan};font:800 17px 'JetBrains Mono',monospace;cursor:pointer}.p4-frac-builder button.is-active{background:${T.accent};color:#fff}.p4-frac-builder hr{width:180px;margin:0 auto;border:0;border-top:3px solid ${T.navy}}
.p4-feedback{padding:11px 13px;border-radius:14px;animation:p4-result .22s ease both}.p4-feedback.is-ok{background:${T.successSoft};box-shadow:inset 4px 0 0 ${T.success}}.p4-feedback.is-no{background:${T.warnSoft};box-shadow:inset 4px 0 0 ${T.warn}}.p4-feedback p{font-family:'Source Serif 4',Georgia,serif;font-size:clamp(14px,2.1vw,16px);line-height:1.42}.p4-rule{margin-top:7px!important;color:${T.ink2}}
.p4-actions{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:9px}.p4-btn{min-width:44px;min-height:46px;padding:9px 20px;border:0;border-radius:12px;background:${T.paper};color:${T.accent};font-family:inherit;font-weight:800;font-size:14px;cursor:pointer;box-shadow:0 8px 20px -10px rgba(255,91,53,.5)}.p4-btn:disabled{opacity:.45;cursor:not-allowed;box-shadow:none}.p4-btn-ready{background:${T.accent};color:#fff}.p4-btn-ghost{background:transparent;color:${T.ink2};box-shadow:none}
.p4-done{display:flex;flex-direction:column;align-items:center;gap:9px;padding:24px 12px;text-align:center}.p4-done h2{font-family:'Source Serif 4',Georgia,serif}.p4-medal{display:flex;align-items:center;justify-content:center;width:72px;height:72px;border-radius:50%;background:${T.accent};color:#fff;font-size:34px;box-shadow:0 0 0 9px ${T.accentSoft}}.p4-score{display:flex;align-items:baseline;gap:5px;font-family:'JetBrains Mono',monospace}.p4-score b{font-size:clamp(32px,7vw,44px);color:${T.success}}.p4-score span{font-size:16px;color:${T.ink3}}.p4-complete{color:${T.ink2}}
@keyframes p4-cell-in{from{opacity:.35;transform:scale(.94)}to{opacity:1;transform:none}}@keyframes p4-result{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}@keyframes p4-shake{0%,100%{transform:none}35%{transform:translateX(-4px)}70%{transform:translateX(4px)}}
@media(max-width:640px){.p4-model-grid{grid-template-columns:1fr}.p4-options{grid-template-columns:1fr}.p4-order-slots{grid-template-columns:repeat(2,minmax(0,1fr))}.p4-scale.is-vertical{height:220px}.p4-visual{min-height:104px}.p4-match-cols{gap:7px}}
@media(prefers-reduced-motion:reduce){.p4-root *,.p4-root *::before,.p4-root *::after{scroll-behavior:auto!important;animation:none!important;transition:none!important}}

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
