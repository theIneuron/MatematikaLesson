// ============================================================================
// 4-SINF · 30-DARS AMALIYOTI · KATTALIK BIRLIKLARINI AYLANTIRISH
// 10 topshiriq · UZ/RU/EN · ovozsiz · solve-to-advance.
// ============================================================================

import { useEffect, useMemo, useRef, useState } from 'react';

const b = (ru, uz, en) => ({ ru, uz, en });
const option = (id, ru, uz, en, correct = false, wrongRu = '', wrongUz = '', wrongEn = '') => ({
  id, text: b(ru, uz, en), correct, wrong: wrongRu ? b(wrongRu, wrongUz, wrongEn) : null,
});
const tx = (value, lang) => (value && typeof value === 'object' && !Array.isArray(value) ? value[lang] ?? '' : value);
const SUPPORTED_LANGS = ['uz', 'ru', 'en'];
const normalizeLang = (value) => SUPPORTED_LANGS.includes(value) ? value : 'uz';

const UI = {
  title: b('Урок 30. Практика: преобразование единиц величин', '30-dars. Amaliyot: kattalik birliklarini aylantirish', 'Lesson 30. Practice: unit conversion'),
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
  lessonId: 'num-4-30-practice', lessonTitle: UI.title, grade: 4, lessonNumber: 30,
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
    id: '01', level: 'green', kind: 'mc', skillTag: 'length_relation',
    visual: { type: 'length-chain', text: b('7 км → ? м', '7 km → ? m', '7 km → ? m'), background: '#F5F5F0', colours: ['#168FA3', '#FF5B35'] },
    setup: b('Один километр равен 1000 метрам.', 'Bir kilometr 1000 metrga teng.', 'One kilometre equals 1,000 metres.'),
    prompt: b('Сколько метров в 7 км?', '7 km necha metr?', 'How many metres are in 7 km?'),
    options: [
      option('seven-thousand', '7000 м', '7000 m', '7,000 m', true),
      option('seven-hundred', '700 м', '700 m', '700 m', false, 'Километр содержит 1000 метров, а не 100.', 'Kilometrda 100 metr emas, 1000 metr bor.', 'A kilometre contains 1,000 metres, not 100.'),
      option('seventy', '70 м', '70 m', '70 m', false, 'Множитель 10 не относится к этой паре единиц.', '10 ko‘paytuvchisi bu birliklar juftiga tegishli emas.', 'A factor of 10 does not apply to this pair of units.'),
      option('seven', '7 м', '7 m', '7 m', false, 'При переходе к меньшей единице число должно измениться.', 'Kichik birlikka o‘tganda son o‘zgarishi kerak.', 'The number must change when converting to a smaller unit.'),
    ],
    secondHint: b('Замените каждый километр тысячей метров.', 'Har bir kilometrni ming metr bilan almashtiring.', 'Replace each kilometre with one thousand metres.'),
    thirdHint: b('7 × 1000 = 7000.', '7 × 1000 = 7000.', '7 × 1,000 = 7,000.'),
    correctText: b('Верно. 7 км = 7000 м.', 'To‘g‘ri. 7 km = 7000 m.', 'Correct. 7 km = 7,000 m.'),
    rule: b('Для км→м используют отношение 1 км = 1000 м.', 'km→m uchun 1 km = 1000 m munosabati ishlatiladi.', 'For km→m, use 1 km = 1,000 m.'),
  },
  {
    id: '02', level: 'green', kind: 'match', skillTag: 'unit_relations',
    visual: { type: 'relation-map', text: b('масса · время · площадь · длина', 'massa · vaqt · yuza · uzunlik', 'mass · time · area · length'), background: '#F5F5F0', colours: ['#168FA3', '#FF5B35'] },
    setup: b('Разные величины используют разные отношения единиц.', 'Turli kattaliklar turli birlik munosabatlaridan foydalanadi.', 'Different measures use different unit relationships.'),
    prompt: b('Соедините равные величины.', 'Teng kattaliklarni moslashtiring.', 'Match the equivalent measures.'),
    pairs: [
      { id: 'eight-kg', left: b('8 кг', '8 kg', '8 kg'), correctRight: '8000-g' },
      { id: 'five-hours', left: b('5 часов', '5 soat', '5 hours'), correctRight: '300-min' },
      { id: 'nine-dm2', left: b('9 дм²', '9 dm²', '9 dm²'), correctRight: '900-cm2' },
      { id: 'eleven-m', left: b('11 м', '11 m', '11 m'), correctRight: '1100-cm' },
    ],
    right: [
      { id: '8000-g', text: b('8000 г', '8000 g', '8,000 g') }, { id: '300-min', text: b('300 минут', '300 minut', '300 minutes') },
      { id: '900-cm2', text: b('900 см²', '900 cm²', '900 cm²') }, { id: '1100-cm', text: b('1100 см', '1100 cm', '1,100 cm') },
    ],
    wrong: [b('Сначала определите вид величины, затем связь именно этой пары единиц.', 'Avval kattalik turini, keyin aynan shu birliklar jufti bog‘lanishini aniqlang.', 'Identify the kind of measure first, then the relationship for that exact pair.')],
    secondHint: b('Используйте коэффициенты 1000, 60, 100 и 100.', '1000, 60, 100 va 100 koeffitsiyentlaridan foydalaning.', 'Use factors of 1,000, 60, 100 and 100.'),
    thirdHint: b('кг→г ×1000; ч→мин ×60; дм²→см² ×100; м→см ×100.', 'kg→g ×1000; soat→min ×60; dm²→cm² ×100; m→cm ×100.', 'kg→g ×1,000; h→min ×60; dm²→cm² ×100; m→cm ×100.'),
    correctText: b('Верно. Все четыре равенства составлены по своим отношениям.', 'To‘g‘ri. To‘rtta tenglikning har biri o‘z munosabati bo‘yicha tuzildi.', 'Correct. Each equality uses its own unit relationship.'),
    rule: b('Нельзя переносить коэффициент одной величины на другую.', 'Bir kattalik koeffitsiyentini boshqasiga ko‘chirib bo‘lmaydi.', 'Do not transfer a factor from one kind of measure to another.'),
  },
  {
    id: '03', level: 'yellow', kind: 'order', skillTag: 'mixed_length_conversion',
    visual: { type: 'procedure', text: b('4 км 75 м → 4075 м', '4 km 75 m → 4075 m', '4 km 75 m → 4,075 m'), background: '#F5F5F0', colours: ['#168FA3', '#FF5B35'] },
    setup: b('Смешанную длину нужно выразить только в метрах.', 'Aralash uzunlikni faqat metrda ifodalash kerak.', 'Express the mixed length in metres only.'),
    prompt: b('Расположите шаги преобразования по порядку.', 'Aylantirish qadamlarini tartib bilan joylashtiring.', 'Put the conversion steps in order.'),
    steps: [
      { id: 'step-1', label: b('Шаг 1', '1-qadam', 'Step 1') }, { id: 'step-2', label: b('Шаг 2', '2-qadam', 'Step 2') },
      { id: 'step-3', label: b('Шаг 3', '3-qadam', 'Step 3') }, { id: 'step-4', label: b('Шаг 4', '4-qadam', 'Step 4') },
    ],
    cards: [
      { id: 'target-metres', text: b('Цель: метры', 'Maqsad: metr', 'Target: metres'), order: 0 },
      { id: 'km-to-m', text: b('4 км = 4000 м', '4 km = 4000 m', '4 km = 4,000 m'), order: 1 },
      { id: 'add-metres', text: b('4000 + 75', '4000 + 75', '4,000 + 75'), order: 2 },
      { id: 'result-4075', text: b('4075 м', '4075 m', '4,075 m'), order: 3 },
    ],
    wrong: [b('Сначала выберите целевую единицу и преобразуйте крупную часть.', 'Avval maqsad birlikni tanlang va katta qismni aylantiring.', 'Choose the target unit first and convert the larger part.')],
    secondHint: b('75 метров уже записаны в целевой единице и добавляются после 4000.', '75 metr allaqachon maqsad birlikda; u 4000 dan keyin qo‘shiladi.', 'The 75 metres are already in the target unit and are added after 4,000.'),
    thirdHint: b('Метры → 4000 м → +75 м → 4075 м.', 'Metr → 4000 m → +75 m → 4075 m.', 'Metres → 4,000 m → +75 m → 4,075 m.'),
    correctText: b('Верно. 4 км 75 м = 4075 м.', 'To‘g‘ri. 4 km 75 m = 4075 m.', 'Correct. 4 km 75 m = 4,075 m.'),
    rule: b('В смешанной записи крупную часть переводят в целевую единицу и добавляют остаток.', 'Aralash yozuvda katta qism maqsad birlikka aylantirilib, qoldiq qo‘shiladi.', 'For a mixed measure, convert the larger part to the target unit and add the remainder.'),
  },
  {
    id: '04', level: 'yellow', kind: 'numpad', skillTag: 'mixed_mass_conversion', answer: '3400', maxLen: 4,
    visual: { type: 'mass-blocks', text: b('3 т 4 ц → ? кг', '3 t 4 sr → ? kg', '3 t 4 centners → ? kg'), background: '#F5F5F0', colours: ['#168FA3', '#FF5B35'] },
    setup: b('1 тонна = 1000 кг, 1 центнер = 100 кг.', '1 tonna = 1000 kg, 1 sentner = 100 kg.', '1 tonne = 1,000 kg and 1 centner = 100 kg.'),
    prompt: b('Введите общую массу в килограммах.', 'Umumiy massani kilogrammda kiriting.', 'Enter the total mass in kilograms.'),
    wrong: [b('Преобразуйте тонны и центнеры в килограммы отдельно.', 'Tonna va sentnerni alohida kilogrammga aylantiring.', 'Convert the tonnes and centners to kilograms separately.')],
    secondHint: b('3 т = 3000 кг, 4 ц = 400 кг.', '3 t = 3000 kg, 4 sr = 400 kg.', '3 t = 3,000 kg and 4 centners = 400 kg.'),
    thirdHint: b('3000 + 400 = 3400.', '3000 + 400 = 3400.', '3,000 + 400 = 3,400.'),
    correctText: b('Верно. 3 т 4 ц = 3400 кг.', 'To‘g‘ri. 3 t 4 sr = 3400 kg.', 'Correct. 3 t 4 centners = 3,400 kg.'),
    rule: b('Каждую часть смешанной массы переводят по её собственному отношению.', 'Aralash massaning har bir qismi o‘z munosabati bo‘yicha aylantiriladi.', 'Convert each part of a mixed mass using its own relationship.'),
  },
  {
    id: '05', level: 'yellow', kind: 'missing', skillTag: 'mixed_time_conversion', answer: '158', maxLen: 3,
    visual: { type: 'mixed-time', text: b('2 ч 38 мин = □ мин', '2 soat 38 min = □ min', '2 h 38 min = □ min'), background: '#F5F5F0', colours: ['#168FA3', '#FF5B35'] },
    setup: b('Два часа составляют 120 минут.', 'Ikki soat 120 minutga teng.', 'Two hours equal 120 minutes.'),
    prompt: b('Какое число минут нужно записать?', 'Necha minut yozish kerak?', 'How many minutes should be written?'),
    wrong: [b('Сначала замените два часа минутами, затем сохраните ещё 38 минут.', 'Avval ikki soatni minutga almashtiring, keyin yana 38 minutni saqlang.', 'Replace the two hours with minutes first, then keep the extra 38 minutes.')],
    secondHint: b('2 × 60 = 120 минут.', '2 × 60 = 120 minut.', '2 × 60 = 120 minutes.'),
    thirdHint: b('120 + 38 = 158.', '120 + 38 = 158.', '120 + 38 = 158.'),
    correctText: b('Верно. 2 часа 38 минут = 158 минут.', 'To‘g‘ri. 2 soat 38 minut = 158 minut.', 'Correct. 2 hours 38 minutes = 158 minutes.'),
    rule: b('Для времени используют 60 минут в часе, а не десятичный коэффициент.', 'Vaqt uchun o‘nlik koeffitsiyent emas, bir soatdagi 60 minut ishlatiladi.', 'For time, use 60 minutes per hour, not a decimal factor.'),
  },
  {
    id: '06', level: 'yellow', kind: 'numpad', skillTag: 'mixed_area_problem', answer: '750', maxLen: 3,
    visual: { type: 'area-panels', text: b('3 м² + 450 дм² → ? дм²', '3 m² + 450 dm² → ? dm²', '3 m² + 450 dm² → ? dm²'), background: '#F5F5F0', colours: ['#168FA3', '#FF5B35'] },
    setup: b('Две группы панелей имеют площади 3 м² и 450 дм².', 'Ikki panel guruhining yuzalari 3 m² va 450 dm².', 'Two groups of panels have areas of 3 m² and 450 dm².'),
    prompt: b('Введите общую площадь в дм².', 'Umumiy yuzani dm² da kiriting.', 'Enter the total area in dm².'),
    wrong: [b('Сначала приведите обе площади к одной квадратной единице.', 'Avval ikkala yuzani bitta kvadrat birlikka keltiring.', 'Convert both areas to the same square unit first.')],
    secondHint: b('1 м² = 100 дм², поэтому 3 м² = 300 дм².', '1 m² = 100 dm², shuning uchun 3 m² = 300 dm².', '1 m² = 100 dm², so 3 m² = 300 dm².'),
    thirdHint: b('300 + 450 = 750 дм².', '300 + 450 = 750 dm².', '300 + 450 = 750 dm².'),
    correctText: b('Верно. Общая площадь равна 750 дм².', 'To‘g‘ri. Umumiy yuza 750 dm².', 'Correct. The total area is 750 dm².'),
    rule: b('Складывать измерения можно после приведения к одинаковым единицам.', 'O‘lchovlarni bir xil birlikka keltirgandan keyin qo‘shish mumkin.', 'Measurements can be added after converting them to the same unit.'),
  },
  {
    id: '07', level: 'yellow', kind: 'match', skillTag: 'conversion_strategy',
    visual: { type: 'strategy-map', text: b('запись ↔ подходящая стратегия', 'yozuv ↔ mos strategiya', 'measure ↔ suitable strategy'), background: '#F5F5F0', colours: ['#168FA3', '#FF5B35'] },
    setup: b('Стратегия зависит от пары единиц и наличия остатка.', 'Strategiya birliklar jufti va qoldiq bor-yo‘qligiga bog‘liq.', 'The strategy depends on the unit pair and whether there is a remainder.'),
    prompt: b('Соедините преобразование со стратегией.', 'Aylantirishni strategiya bilan moslashtiring.', 'Match each conversion to its strategy.'),
    pairs: [
      { id: '360-min', left: b('360 мин → 6 ч', '360 min → 6 soat', '360 min → 6 h'), correctRight: 'divide-60' },
      { id: '5600-g', left: b('5600 г → 5 кг 600 г', '5600 g → 5 kg 600 g', '5,600 g → 5 kg 600 g'), correctRight: 'divide-1000-remainder' },
      { id: '13-m2', left: b('13 м² → 1300 дм²', '13 m² → 1300 dm²', '13 m² → 1,300 dm²'), correctRight: 'multiply-100' },
      { id: '620-cm', left: b('620 см → 6 м 20 см', '620 cm → 6 m 20 cm', '620 cm → 6 m 20 cm'), correctRight: 'divide-100-remainder' },
    ],
    right: [
      { id: 'divide-60', text: b('÷ 60', '÷ 60', '÷ 60') },
      { id: 'divide-1000-remainder', text: b('÷ 1000 + остаток', '÷ 1000 + qoldiq', '÷ 1,000 + remainder') },
      { id: 'multiply-100', text: b('× 100', '× 100', '× 100') },
      { id: 'divide-100-remainder', text: b('÷ 100 + остаток', '÷ 100 + qoldiq', '÷ 100 + remainder') },
    ],
    wrong: [b('Назовите точное отношение единиц в выбранной строке.', 'Tanlangan qatordagi birliklarning aniq munosabatini ayting.', 'State the exact unit relationship in the selected row.')],
    secondHint: b('К меньшей единице переходят умножением; к крупной — делением и иногда сохраняют остаток.', 'Kichik birlikka ko‘paytirib, katta birlikka bo‘lib o‘tiladi; ba’zan qoldiq saqlanadi.', 'Convert to a smaller unit by multiplying; to a larger unit by dividing and sometimes keeping a remainder.'),
    thirdHint: b('Время: 60; масса: 1000; площадь м²→дм²: 100; длина см→м: 100.', 'Vaqt: 60; massa: 1000; yuza m²→dm²: 100; uzunlik cm→m: 100.', 'Time: 60; mass: 1,000; area m²→dm²: 100; length cm→m: 100.'),
    correctText: b('Верно. Для каждой строки выбрана подходящая стратегия.', 'To‘g‘ri. Har bir qator uchun mos strategiya tanlandi.', 'Correct. A suitable strategy has been chosen for every row.'),
    rule: b('Операцию выбирают после определения вида величины и отношения единиц.', 'Amal kattalik turi va birliklar munosabati aniqlangandan keyin tanlanadi.', 'Choose the operation after identifying the kind of measure and unit relationship.'),
  },
  {
    id: '08', level: 'red', kind: 'mc', skillTag: 'calendar_conversion_boundary',
    visual: { type: 'boundary-choice', text: b('Какое преобразование не имеет постоянного коэффициента?', 'Qaysi aylantirishda doimiy koeffitsiyent yo‘q?', 'Which conversion has no fixed factor?'), background: '#F5F5F0', colours: ['#168FA3', '#FF5B35'] },
    setup: b('Три пары единиц имеют фиксированную связь, одна зависит от календаря.', 'Uch birliklar juftida bog‘lanish doimiy, bittasi taqvimga bog‘liq.', 'Three unit pairs have fixed relationships; one depends on the calendar.'),
    prompt: b('Выберите преобразование без единственного точного коэффициента.', 'Bitta aniq koeffitsiyenti bo‘lmagan aylantirishni tanlang.', 'Choose the conversion without one exact fixed factor.'),
    options: [
      option('months-to-days', '4 месяца → дни', '4 oy → kun', '4 months → days', true),
      option('km-to-m', '4 км → м', '4 km → m', '4 km → m', false, '1 км всегда равен 1000 м.', '1 km doim 1000 m ga teng.', '1 km always equals 1,000 m.'),
      option('tonnes-to-kg', '4 т → кг', '4 t → kg', '4 t → kg', false, '1 тонна всегда равна 1000 кг.', '1 tonna doim 1000 kg ga teng.', '1 tonne always equals 1,000 kg.'),
      option('m2-to-dm2', '4 м² → дм²', '4 m² → dm²', '4 m² → dm²', false, '1 м² всегда равен 100 дм².', '1 m² doim 100 dm² ga teng.', '1 m² always equals 100 dm².'),
    ],
    secondHint: b('Продолжительность месяцев различается.', 'Oylarning davomiyligi turlicha.', 'Months have different lengths.'),
    thirdHint: b('Для месяцев нужны конкретные названия и иногда год.', 'Oylar uchun aniq nomlar va ba’zan yil kerak.', 'Months require their names and sometimes the year.'),
    correctText: b('Верно. Месяцы нельзя перевести в дни одним постоянным коэффициентом.', 'To‘g‘ri. Oylarni bitta doimiy koeffitsiyent bilan kunga aylantirib bo‘lmaydi.', 'Correct. Months cannot be converted to days with one fixed factor.'),
    rule: b('Календарные преобразования требуют проверки конкретных данных.', 'Taqvim aylantirishlari aniq ma’lumotlarni tekshirishni talab qiladi.', 'Calendar conversions require checking the particular data.'),
  },
  {
    id: '09', level: 'red', kind: 'mc', skillTag: 'universal_factor_error',
    visual: { type: 'error-console', text: b('«Для всех единиц умножаем на 10» ✕', '“Barcha birliklar uchun ×10” ✕', '“Multiply by 10 for every unit” ✕'), background: '#F5F5F0', colours: ['#168FA3', '#FF5B35'] },
    setup: b('Ученик применил ×10 к 7 м, 7 кг, 7 ч и 7 м².', 'O‘quvchi 7 m, 7 kg, 7 soat va 7 m² ning barchasiga ×10 qo‘lladi.', 'A pupil applied ×10 to 7 m, 7 kg, 7 h and 7 m².'),
    prompt: b('Какой набор исправлений верен?', 'Qaysi tuzatishlar to‘plami to‘g‘ri?', 'Which set of corrections is right?'),
    options: [
      option('family-specific-tuple', '700 см; 7000 г; 420 мин; 700 дм²', '700 cm; 7000 g; 420 min; 700 dm²', '700 cm; 7,000 g; 420 min; 700 dm²', true),
      option('all-times-ten', '70 см; 70 г; 70 мин; 70 дм²', '70 cm; 70 g; 70 min; 70 dm²', '70 cm; 70 g; 70 min; 70 dm²', false, 'Это повторяет ошибку универсального ×10.', 'Bu universal ×10 xatosini takrorlaydi.', 'This repeats the universal ×10 error.'),
      option('all-times-hundred', '700 см; 700 г; 700 мин; 700 дм²', '700 cm; 700 g; 700 min; 700 dm²', '700 cm; 700 g; 700 min; 700 dm²', false, '100 подходит двум строкам, но не массе и времени.', '100 ikki qatorga mos, ammo massa va vaqtga mos emas.', 'A factor of 100 suits two rows, but not mass or time.'),
      option('all-times-thousand', '7000 см; 7000 г; 7000 мин; 7000 дм²', '7000 cm; 7000 g; 7000 min; 7000 dm²', '7,000 cm; 7,000 g; 7,000 min; 7,000 dm²', false, '1000 подходит только кг→г.', '1000 faqat kg→g ga mos.', 'A factor of 1,000 suits only kg→g.'),
    ],
    secondHint: b('Запишите отдельно: м→см, кг→г, ч→мин, м²→дм².', 'Alohida yozing: m→cm, kg→g, soat→min, m²→dm².', 'Write each relationship separately: m→cm, kg→g, h→min, m²→dm².'),
    thirdHint: b('Коэффициенты соответственно 100, 1000, 60 и 100.', 'Koeffitsiyentlar mos ravishda 100, 1000, 60 va 100.', 'The respective factors are 100, 1,000, 60 and 100.'),
    correctText: b('Верно. Получаем 700 см, 7000 г, 420 мин и 700 дм².', 'To‘g‘ri. 700 cm, 7000 g, 420 min va 700 dm² hosil bo‘ladi.', 'Correct. The results are 700 cm, 7,000 g, 420 min and 700 dm².'),
    rule: b('Универсального умножения на 10 нет: коэффициент выбирают для конкретной пары единиц.', 'Universal ×10 yo‘q: koeffitsiyent aniq birliklar jufti uchun tanlanadi.', 'There is no universal multiply-by-ten rule: choose the factor for the exact unit pair.'),
  },
  {
    id: '10', level: 'red', kind: 'mc', skillTag: 'invariant_check_transfer',
    visual: { type: 'manifest', text: b('Маршрутный лист: длина · масса · время · площадь', 'Manifest: uzunlik · massa · vaqt · yuza', 'Manifest: length · mass · time · area'), background: '#F5F5F0', colours: ['#168FA3', '#FF5B35'] },
    setup: b('Нужно проверить четыре строки маршрутного листа, не смешивая виды величин.', 'Kattalik turlarini aralashtirmasdan manifestning to‘rt qatorini tekshirish kerak.', 'Check four manifest rows without mixing kinds of measure.'),
    prompt: b('Какой набор и обоснование верны?', 'Qaysi to‘plam va asoslash to‘g‘ri?', 'Which set and rationale are correct?'),
    options: [
      option('invariant-preserved', '3 км 40 м = 3040 м; 2 т 75 кг = 2075 кг; 1 ч 45 мин = 105 мин; 5 м² = 500 дм². Для каждой семьи — своё отношение.', '3 km 40 m = 3040 m; 2 t 75 kg = 2075 kg; 1 soat 45 min = 105 min; 5 m² = 500 dm². Har bir kattalik oilasining o‘z munosabati bor.', '3 km 40 m = 3,040 m; 2 t 75 kg = 2,075 kg; 1 h 45 min = 105 min; 5 m² = 500 dm². Each family uses its own relationship.', true),
      option('universal-ten', '304 м; 275 кг; 145 мин; 50 дм² — везде ×10', '304 m; 275 kg; 145 min; 50 dm² — hammasiga ×10', '304 m; 275 kg; 145 min; 50 dm² — ×10 throughout', false, 'Универсальный ×10 меняет сами величины и даёт неверные равенства.', 'Universal ×10 kattaliklarning o‘zini o‘zgartiradi va noto‘g‘ri tengliklar beradi.', 'Universal ×10 changes the quantities and gives false equalities.'),
      option('drop-remainders', '3000 м; 2000 кг; 60 мин; 500 дм² — остатки отброшены', '3000 m; 2000 kg; 60 min; 500 dm² — qoldiqlar tashlangan', '3,000 m; 2,000 kg; 60 min; 500 dm² — remainders discarded', false, '40 м, 75 кг и 45 минут — части исходных величин и не могут исчезнуть.', '40 m, 75 kg va 45 minut boshlang‘ich kattalik qismlari; ular yo‘qolmaydi.', 'The 40 m, 75 kg and 45 minutes are parts of the original quantities and cannot disappear.'),
      option('linear-area-factor', '3040 м; 2075 кг; 105 мин; 50 дм² — для площади ×10', '3040 m; 2075 kg; 105 min; 50 dm² — yuza uchun ×10', '3,040 m; 2,075 kg; 105 min; 50 dm² — ×10 for area', false, 'Для м²→дм² коэффициент площади равен 100.', 'm²→dm² uchun yuza koeffitsiyenti 100 ga teng.', 'For m²→dm², the area factor is 100.'),
    ],
    secondHint: b('Проверяйте отдельно длину, массу, время и площадь.', 'Uzunlik, massa, vaqt va yuzani alohida tekshiring.', 'Check length, mass, time and area separately.'),
    thirdHint: b('Используйте 1000 м/км, 1000 кг/т, 60 мин/ч и 100 дм²/м²; остатки сохраняйте.', '1000 m/km, 1000 kg/t, 60 min/soat va 100 dm²/m² dan foydalaning; qoldiqlarni saqlang.', 'Use 1,000 m/km, 1,000 kg/tonne, 60 min/h and 100 dm²/m²; preserve remainders.'),
    correctText: b('Верно. Во всех четырёх строках величина сохранилась.', 'To‘g‘ri. To‘rtta qatorda ham kattalik saqlandi.', 'Correct. The quantity is preserved in all four rows.'),
    rule: b('Итоговая проверка: вид величины, точное отношение единиц, операция, остаток и единица ответа.', 'Yakuniy tekshiruv: kattalik turi, aniq birliklar munosabati, amal, qoldiq va javob birligi.', 'Final check: kind of measure, exact unit relationship, operation, remainder and answer unit.'),
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
  // eslint-disable-next-line react-hooks/exhaustive-deps -- restart/task keys intentionally trigger a fresh shuffle
  const options = useMemo(() => shuffle(task.options || []), [shuffleSeed, task.id, task.options]);
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
  const check = () => { if (!answerReady || solved || checked || checkingRef.current) return; checkingRef.current = true; setAttempts((old) => old + 1); setChecked(true); if (answerCorrect()) setSolved(true); };
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

export default function Grade4Dars30Practice({ studentName, lang: langProp, onFinished }) {
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
  return <div className="p4-root"><style>{STYLES}</style>{preview && <div className="p4-lang" role="group" aria-label={tx(UI.language, lang)}>{SUPPORTED_LANGS.map((code) => <button type="button" key={code} aria-pressed={lang === code} className={lang === code ? 'is-active' : ''} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}<header><div className="p4-progress" role="progressbar" aria-label={tx(UI.title, lang)} aria-valuemin="0" aria-valuemax="10" aria-valuenow={finished ? 10 : index}><i style={{ width: `${percent}%` }}/></div><div><span className="p4-title">{tx(UI.title, lang)}</span><b className="p4-counter">{finished ? 10 : index + 1} / 10</b></div></header><main>{finished ? <section className="p4-done" aria-live="polite"><h2>{tx(UI.done, lang)}</h2><strong>{firstTry}<small>/ 10</small></strong><p>{tx(UI.firstTry, lang)}</p><p>{tx(UI.allSolved, lang)}</p><button type="button" className="p4-btn p4-btn-ready" onClick={restart}>{tx(UI.again, lang)}</button></section> : <Task key={`${runId}-${task.id}`} task={task} lang={lang} isLast={index === 9} onSolved={onSolved} shuffleSeed={`${LESSON_META.lessonId}:${runId}`}/>}</main></div>;
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
