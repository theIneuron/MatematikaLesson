// ============================================================================
// 4-SINF · 29-DARS AMALIYOTI · YUZA BIRLIKLARI
// 10 topshiriq · UZ/RU/EN · ovozsiz · solve-to-advance.
// ============================================================================

import { useEffect, useMemo, useRef, useState } from 'react';

// ---- MATCH-FIX (metodist qarori 2026-08-21) --------------------------------
// Juftlashtirish uch narsani kafolatlaydi:
//   1) juftlikning ikki tomoni bir xil rang va bir xil belgi oladi — uchta
//      qator uchta rangda ko'rinadi va bola nimani nima bilan bog'laganini
//      ko'zi bilan ko'radi;
//   2) band kartochkani boshqa qatorga berish mumkin, shuning uchun hammasini
//      juftlagandan keyin ham xatoni tuzatish yo'li bor — tupik yo'q;
//   3) o'ng ustun chap ustun bilan bir qatorga tushmaydi: to'g'ri javob
//      qarshisida turib qolsa, bola o'ylamay bir qatorga bosadi.
// Blok har darsda takrorlanadi ATAYLAB: LMS avtonom fayl talab qiladi
// (scripts/build-grade4-practice-lms.mjs — lokal import yo'q).
const MATCH_TONES = 6;
// Chap ustundagi qatorlarning kaliti = `pairs` obyektining kaliti.
const matchRows = (task) => (task.pairs || []).map((pair) => pair.id);
const matchTone = (rows, key) => {
  const row = rows.findIndex((item) => String(item) === String(key));
  return row < 0 ? '' : ` p4-tone${(row % MATCH_TONES) + 1}`;
};
const matchToneLeft = (task, pairs, rowKey) => (
  pairs[rowKey] === undefined ? '' : matchTone(matchRows(task), rowKey)
);
const matchToneRight = (task, pairs, rightKey) => {
  const rows = matchRows(task);
  const owner = rows.find(
    (key) => pairs[key] !== undefined && String(pairs[key]) === String(rightKey),
  );
  return owner === undefined ? '' : matchTone(rows, owner);
};
// Kartochka band bo'lsa, eski juftlik bo'shatiladi: bitta kartochka bir vaqtda
// faqat bitta qatorga tegishli bo'ladi.
const matchTie = (pairs, rowKey, rightKey) => {
  const next = {};
  Object.keys(pairs).forEach((key) => {
    if (String(pairs[key]) !== String(rightKey)) next[key] = pairs[key];
  });
  next[rowKey] = rightKey;
  return next;
};
// O'ng ustunni shunday joylaydi, ki hech bir karta o'z juftining qarshisida
// turmaydi. Aralashtirish tasodifiy, lekin natijasi tekshiriladi.
const matchSpread = (cards, aligned) => {
  const list = Array.isArray(cards) ? [...cards] : [];
  if (list.length < 2) return list;
  const stuck = () => list.some((card, row) => aligned(card, row));
  for (let attempt = 0; attempt < 24 && stuck(); attempt += 1) {
    for (let i = list.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
  }
  for (let pass = 0; pass <= list.length && stuck(); pass += 1) {
    for (let i = 0; i < list.length; i += 1) {
      if (!aligned(list[i], i)) continue;
      const j = (i + 1) % list.length;
      [list[i], list[j]] = [list[j], list[i]];
    }
  }
  return list;
};
// ---- MATCH-FIX tugashi ----------------------------------------------------

const b = (ru, uz, en) => ({ ru, uz, en });
const option = (id, ru, uz, en, correct = false, wrongRu = '', wrongUz = '', wrongEn = '') => ({
  id, text: b(ru, uz, en), correct, wrong: wrongRu ? b(wrongRu, wrongUz, wrongEn) : null,
});
const tx = (value, lang) => (value && typeof value === 'object' && !Array.isArray(value) ? value[lang] ?? '' : value);
const SUPPORTED_LANGS = ['uz', 'ru', 'en'];
const normalizeLang = (value) => SUPPORTED_LANGS.includes(value) ? value : 'uz';

const UI = {
  title: b('Урок 29. Практика: единицы площади', '29-dars. Amaliyot: yuza birliklari', 'Lesson 29. Practice: area units'),
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
  lessonId: 'num-4-29-practice', lessonTitle: UI.title, grade: 4, lessonNumber: 29,
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
    id: '01', level: 'green', kind: 'mc', skillTag: 'cm2_to_mm2',
    visual: { type: 'square-grid', text: b('4 см² → ? мм²', '4 cm² → ? mm²', '4 cm² → ? mm²'), background: '#F5F5F0', colours: ['#168FA3', '#FF5B35'] },
    setup: b('В одном квадратном сантиметре 100 квадратных миллиметров.', 'Bir kvadrat santimetrda 100 kvadrat millimetr bor.', 'One square centimetre contains 100 square millimetres.'),
    prompt: b('Сколько квадратных миллиметров в 4 см²?', '4 cm² necha mm²?', 'How many square millimetres are in 4 cm²?'),
    options: [
      option('four-hundred', '400 мм²', '400 mm²', '400 mm²', true),
      option('forty', '40 мм²', '40 mm²', '40 mm²', false, 'Коэффициент 10 относится к длине стороны, а площадь меняется в 100 раз.', '10 koeffitsiyenti tomon uzunligiga tegishli, yuza esa 100 marta o‘zgaradi.', 'The factor 10 applies to side length; area changes by a factor of 100.'),
      option('four-thousand', '4000 мм²', '4000 mm²', '4,000 mm²', false, 'Добавлен лишний множитель 10.', 'Ortiqcha 10 ko‘paytuvchisi qo‘shilgan.', 'An extra factor of 10 has been introduced.'),
      option('four', '4 мм²', '4 mm²', '4 mm²', false, 'Число нельзя сохранить при смене квадратной единицы.', 'Kvadrat birlik o‘zgarganda sonni o‘zgartirmay qoldirib bo‘lmaydi.', 'The number cannot stay unchanged when the square unit changes.'),
    ],
    secondHint: b('Представьте квадрат 1 см × 1 см как сетку 10 × 10 мм.', '1 cm × 1 cm kvadratni 10 × 10 mm katak sifatida tasavvur qiling.', 'Picture a 1 cm by 1 cm square as a 10 by 10 mm grid.'),
    thirdHint: b('1 см² = 100 мм², поэтому четыре таких квадрата дают 400 мм².', '1 cm² = 100 mm², shuning uchun to‘rtta shunday kvadrat 400 mm² beradi.', '1 cm² = 100 mm², so four such squares make 400 mm².'),
    correctText: b('Верно. 4 см² = 400 мм².', 'To‘g‘ri. 4 cm² = 400 mm².', 'Correct. 4 cm² = 400 mm².'),
    rule: b('При уменьшении линейной единицы в 10 раз квадратная единица уменьшается в 100 раз.', 'Chiziqli birlik 10 marta kichraysa, kvadrat birlik 100 marta kichrayadi.', 'When the linear unit is ten times smaller, the square unit is one hundred times smaller.'),
  },
  {
    id: '02', level: 'green', kind: 'match', skillTag: 'area_equivalence',
    visual: { type: 'area-cards', text: b('дм² ↔ см² · м² ↔ дм² · км² ↔ м²', 'dm² ↔ cm² · m² ↔ dm² · km² ↔ m²', 'dm² ↔ cm² · m² ↔ dm² · km² ↔ m²'), background: '#F5F5F0', colours: ['#168FA3', '#FF5B35'] },
    setup: b('Для каждой пары квадратных единиц нужен свой коэффициент.', 'Har bir kvadrat birliklar jufti uchun o‘z koeffitsiyenti kerak.', 'Each pair of square units needs its own conversion factor.'),
    prompt: b('Соедините равные площади.', 'Teng yuzalarni moslashtiring.', 'Match the equivalent areas.'),
    pairs: [
      { id: 'nine-dm2', left: b('9 дм²', '9 dm²', '9 dm²'), correctRight: '900-cm2' },
      { id: 'five-m2', left: b('5 м²', '5 m²', '5 m²'), correctRight: '500-dm2' },
      { id: 'three-km2', left: b('3 км²', '3 km²', '3 km²'), correctRight: '3000000-m2' },
    ],
    right: [
      { id: '900-cm2', text: b('900 см²', '900 cm²', '900 cm²') },
      { id: '500-dm2', text: b('500 дм²', '500 dm²', '500 dm²') },
      { id: '3000000-m2', text: b('3 000 000 м²', '3 000 000 m²', '3,000,000 m²') },
    ],
    wrong: [b('Проверьте квадрат коэффициента длины для выбранной пары.', 'Tanlangan juft uchun uzunlik koeffitsiyentining kvadratini tekshiring.', 'Check the square of the length factor for the selected pair.')],
    secondHint: b('дм→см: 10²; м→дм: 10²; км→м: 1000².', 'dm→cm: 10²; m→dm: 10²; km→m: 1000².', 'dm→cm: 10²; m→dm: 10²; km→m: 1,000².'),
    thirdHint: b('Используйте коэффициенты 100, 100 и 1 000 000.', '100, 100 va 1 000 000 koeffitsiyentlaridan foydalaning.', 'Use factors of 100, 100 and 1,000,000.'),
    correctText: b('Верно. Все площади соединены с равными значениями.', 'To‘g‘ri. Barcha yuzalar teng qiymatlar bilan moslashtirildi.', 'Correct. Every area is matched to an equivalent value.'),
    rule: b('Коэффициент площади равен квадрату коэффициента длины.', 'Yuza koeffitsiyenti uzunlik koeffitsiyentining kvadratiga teng.', 'The area factor is the square of the length factor.'),
  },
  {
    id: '03', level: 'yellow', kind: 'order', skillTag: 'squared_scale_factor',
    visual: { type: 'procedure', text: b('6 м² → 60 000 см²', '6 m² → 60 000 cm²', '6 m² → 60,000 cm²'), background: '#F5F5F0', colours: ['#168FA3', '#FF5B35'] },
    setup: b('Нужно обосновать переход от квадратных метров к квадратным сантиметрам.', 'Kvadrat metrdan kvadrat santimetrga o‘tishni asoslash kerak.', 'Explain the conversion from square metres to square centimetres.'),
    prompt: b('Расположите шаги по порядку.', 'Qadamlarni tartib bilan joylashtiring.', 'Put the steps in order.'),
    steps: [
      { id: 'step-1', label: b('Шаг 1', '1-qadam', 'Step 1') }, { id: 'step-2', label: b('Шаг 2', '2-qadam', 'Step 2') },
      { id: 'step-3', label: b('Шаг 3', '3-qadam', 'Step 3') }, { id: 'step-4', label: b('Шаг 4', '4-qadam', 'Step 4') },
    ],
    cards: [
      { id: 'linear-factor', text: b('1 м = 100 см', '1 m = 100 cm', '1 m = 100 cm'), order: 0 },
      { id: 'square-factor', text: b('100 × 100 = 10 000', '100 × 100 = 10 000', '100 × 100 = 10,000'), order: 1 },
      { id: 'one-square-metre', text: b('1 м² = 10 000 см²', '1 m² = 10 000 cm²', '1 m² = 10,000 cm²'), order: 2 },
      { id: 'six-square-metres', text: b('6 м² = 60 000 см²', '6 m² = 60 000 cm²', '6 m² = 60,000 cm²'), order: 3 },
    ],
    wrong: [b('Сначала установите линейную связь, затем возведите коэффициент в квадрат.', 'Avval chiziqli bog‘lanishni aniqlang, keyin koeffitsiyentni kvadratga oshiring.', 'Establish the linear relationship first, then square the factor.')],
    secondHint: b('Квадрат имеет две стороны, поэтому коэффициент 100 используется дважды.', 'Kvadratning ikki tomoni bor, shuning uchun 100 koeffitsiyenti ikki marta ishlatiladi.', 'A square has two dimensions, so the factor 100 is used twice.'),
    thirdHint: b('1 м = 100 см → 1 м² = 10 000 см² → умножить на 6.', '1 m = 100 cm → 1 m² = 10 000 cm² → 6 ga ko‘paytirish.', '1 m = 100 cm → 1 m² = 10,000 cm² → multiply by 6.'),
    correctText: b('Верно. 6 м² = 60 000 см².', 'To‘g‘ri. 6 m² = 60 000 cm².', 'Correct. 6 m² = 60,000 cm².'),
    rule: b('Для квадратных единиц линейный коэффициент применяют по двум измерениям.', 'Kvadrat birliklarda chiziqli koeffitsiyent ikki o‘lcham bo‘yicha qo‘llanadi.', 'For square units, apply the linear factor in both dimensions.'),
  },
  {
    id: '04', level: 'yellow', kind: 'numpad', skillTag: 'area_measurement', answer: '63', maxLen: 2,
    visual: { type: 'rectangle', text: b('7 см × 9 см → ? см²', '7 cm × 9 cm → ? cm²', '7 cm × 9 cm → ? cm²'), background: '#F5F5F0', colours: ['#168FA3', '#FF5B35'] },
    setup: b('Прямоугольник имеет длину 9 см и ширину 7 см.', 'To‘g‘ri to‘rtburchakning uzunligi 9 cm, eni 7 cm.', 'A rectangle is 9 cm long and 7 cm wide.'),
    prompt: b('Введите его площадь в см².', 'Uning yuzasini cm² da kiriting.', 'Enter its area in cm².'),
    wrong: [b('Площадь прямоугольника находят произведением длины и ширины.', 'To‘g‘ri to‘rtburchak yuzasi uzunlik bilan enning ko‘paytmasidan topiladi.', 'Find a rectangle’s area by multiplying length by width.')],
    secondHint: b('Сетка содержит 7 рядов по 9 квадратов.', 'Katakda 9 tadan 7 qator bor.', 'The grid has seven rows of nine squares.'),
    thirdHint: b('7 × 9 = 63.', '7 × 9 = 63.', '7 × 9 = 63.'),
    correctText: b('Верно. Площадь прямоугольника равна 63 см².', 'To‘g‘ri. To‘g‘ri to‘rtburchak yuzasi 63 cm².', 'Correct. The rectangle has an area of 63 cm².'),
    rule: b('Площадь прямоугольника записывают в квадратных единицах.', 'To‘g‘ri to‘rtburchak yuzasi kvadrat birliklarda yoziladi.', 'Write the area of a rectangle in square units.'),
  },
  {
    id: '05', level: 'yellow', kind: 'missing', skillTag: 'area_remainder', answer: '35', maxLen: 2,
    visual: { type: 'mixed-area', text: b('835 см² = 8 дм² □ см²', '835 cm² = 8 dm² □ cm²', '835 cm² = 8 dm² □ cm²'), background: '#F5F5F0', colours: ['#168FA3', '#FF5B35'] },
    setup: b('Восьми квадратным дециметрам соответствуют 800 см².', 'Sakkiz kvadrat detsimetr 800 cm² ga teng.', 'Eight square decimetres equal 800 cm².'),
    prompt: b('Какой остаток см² нужно записать?', 'Qoldiq sifatida necha cm² yoziladi?', 'How many cm² remain?'),
    wrong: [b('В поле нужен остаток после восьми полных групп по 100 см².', 'Katakka 100 cm² lik sakkizta to‘liq guruhdan keyingi qoldiq kerak.', 'The blank needs the remainder after eight complete groups of 100 cm².')],
    secondHint: b('Отделите 800 см² от 835 см².', '835 cm² dan 800 cm² ni ajrating.', 'Separate 800 cm² from 835 cm².'),
    thirdHint: b('После 800 остаётся 35 см².', '800 dan keyin 35 cm² qoladi.', '35 cm² remain after 800 cm².'),
    correctText: b('Верно. 835 см² = 8 дм² 35 см².', 'To‘g‘ri. 835 cm² = 8 dm² 35 cm².', 'Correct. 835 cm² = 8 dm² 35 cm².'),
    rule: b('В смешанной записи остаток см² меньше 100.', 'Aralash yozuvda cm² qoldig‘i 100 dan kichik bo‘ladi.', 'In mixed form, the cm² remainder is less than 100.'),
  },
  {
    id: '06', level: 'yellow', kind: 'numpad', skillTag: 'area_word_problem', answer: '8400', maxLen: 4,
    visual: { type: 'greenhouse', text: b('12 м × 7 м = 84 м² = ? дм²', '12 m × 7 m = 84 m² = ? dm²', '12 m × 7 m = 84 m² = ? dm²'), background: '#F5F5F0', colours: ['#168FA3', '#FF5B35'] },
    setup: b('Пол теплицы — прямоугольник 12 м на 7 м.', 'Issiqxona poli 12 m ga 7 m to‘g‘ri to‘rtburchak.', 'A greenhouse floor is a 12 m by 7 m rectangle.'),
    prompt: b('Введите площадь пола в дм².', 'Pol yuzasini dm² da kiriting.', 'Enter the floor area in dm².'),
    wrong: [b('Сначала найдите площадь в м², затем используйте 1 м² = 100 дм².', 'Avval yuzani m² da toping, keyin 1 m² = 100 dm² dan foydalaning.', 'Find the area in m² first, then use 1 m² = 100 dm².')],
    secondHint: b('12 × 7 = 84 м².', '12 × 7 = 84 m².', '12 × 7 = 84 m².'),
    thirdHint: b('84 × 100 = 8400 дм².', '84 × 100 = 8400 dm².', '84 × 100 = 8,400 dm².'),
    correctText: b('Верно. Площадь пола равна 8400 дм².', 'To‘g‘ri. Pol yuzasi 8400 dm².', 'Correct. The floor area is 8,400 dm².'),
    rule: b('Сохраняйте вид величины: площадь переводят только в квадратные единицы.', 'Kattalik turini saqlang: yuza faqat kvadrat birliklarga aylantiriladi.', 'Preserve the kind of measure: convert area only to square units.'),
  },
  {
    id: '07', level: 'yellow', kind: 'match', skillTag: 'area_unit_choice',
    visual: { type: 'context-units', text: b('объект ↔ подходящая единица площади', 'obyekt ↔ mos yuza birligi', 'object ↔ suitable area unit'), background: '#F5F5F0', colours: ['#168FA3', '#FF5B35'] },
    setup: b('Единица должна быть соразмерна измеряемому объекту.', 'Birlik o‘lchanayotgan obyektga mos kattalikda bo‘lishi kerak.', 'The unit should suit the size of the object.'),
    prompt: b('Соедините объект с удобной единицей площади.', 'Obyektni qulay yuza birligi bilan moslashtiring.', 'Match each object to a convenient area unit.'),
    pairs: [
      { id: 'microchip', left: b('Поверхность микрочипа', 'Mikrochip sirti', 'Surface of a microchip'), correctRight: 'mm2' },
      { id: 'notebook', left: b('Обложка тетради', 'Daftar muqovasi', 'Notebook cover'), correctRight: 'cm2' },
      { id: 'classroom', left: b('Пол класса', 'Sinf xonasi poli', 'Classroom floor'), correctRight: 'm2' },
      { id: 'district', left: b('Территория района', 'Tuman hududi', 'District area'), correctRight: 'km2' },
    ],
    right: [
      { id: 'mm2', text: b('мм²', 'mm²', 'mm²') }, { id: 'cm2', text: b('см²', 'cm²', 'cm²') },
      { id: 'm2', text: b('м²', 'm²', 'm²') }, { id: 'km2', text: b('км²', 'km²', 'km²') },
    ],
    wrong: [b('Сопоставьте размер объекта с размером единичного квадрата.', 'Obyekt o‘lchamini birlik kvadrat o‘lchami bilan solishtiring.', 'Compare the size of the object with the unit square.')],
    secondHint: b('От самого малого к большому: микрочип, обложка, класс, район.', 'Eng kichikdan kattaga: mikrochip, muqova, sinf, tuman.', 'From smallest to largest: microchip, cover, classroom, district.'),
    thirdHint: b('Порядок единиц: мм², см², м², км².', 'Birliklar tartibi: mm², cm², m², km².', 'The unit order is mm², cm², m², km².'),
    correctText: b('Верно. Для каждого объекта выбрана удобная единица.', 'To‘g‘ri. Har bir obyekt uchun qulay birlik tanlandi.', 'Correct. A convenient unit has been chosen for each object.'),
    rule: b('Удобная единица даёт понятное число без чрезмерного количества нулей.', 'Qulay birlik ortiqcha ko‘p nollarsiz tushunarli son beradi.', 'A convenient unit gives a manageable number without excessive zeros.'),
  },
  {
    id: '08', level: 'red', kind: 'mc', skillTag: 'square_factor_boundary',
    visual: { type: 'boundary-grid', text: b('12 м² → ? см²', '12 m² → ? cm²', '12 m² → ? cm²'), background: '#F5F5F0', colours: ['#168FA3', '#FF5B35'] },
    setup: b('Между метром и сантиметром линейный коэффициент равен 100.', 'Metr bilan santimetr orasidagi chiziqli koeffitsiyent 100.', 'The linear factor between metres and centimetres is 100.'),
    prompt: b('Какая запись площади верна?', 'Yuzaning qaysi yozuvi to‘g‘ri?', 'Which area statement is correct?'),
    options: [
      option('one-hundred-twenty-thousand', '12 м² = 120 000 см²', '12 m² = 120 000 cm²', '12 m² = 120,000 cm²', true),
      option('one-thousand-two-hundred', '12 м² = 1200 см²', '12 m² = 1200 cm²', '12 m² = 1,200 cm²', false, 'Коэффициент 100 применён только один раз, как для длины.', '100 koeffitsiyenti uzunlikdagidek faqat bir marta qo‘llangan.', 'The factor 100 has been applied only once, as for length.'),
      option('twelve-thousand', '12 м² = 12 000 см²', '12 m² = 12 000 cm²', '12 m² = 12,000 cm²', false, 'Нужен коэффициент 100 × 100 = 10 000, а не 1000.', '100 × 100 = 10 000 koeffitsiyenti kerak, 1000 emas.', 'The required factor is 100 × 100 = 10,000, not 1,000.'),
      option('one-million-two-hundred', '12 м² = 1 200 000 см²', '12 m² = 1 200 000 cm²', '12 m² = 1,200,000 cm²', false, 'Добавлен лишний множитель 10.', 'Ortiqcha 10 ko‘paytuvchisi qo‘shilgan.', 'An extra factor of 10 has been added.'),
    ],
    secondHint: b('Один квадратный метр содержит 100 × 100 квадратных сантиметров.', 'Bir kvadrat metr 100 × 100 kvadrat santimetrni o‘z ichiga oladi.', 'One square metre contains 100 × 100 square centimetres.'),
    thirdHint: b('12 × 10 000 = 120 000.', '12 × 10 000 = 120 000.', '12 × 10,000 = 120,000.'),
    correctText: b('Верно. 12 м² = 120 000 см².', 'To‘g‘ri. 12 m² = 120 000 cm².', 'Correct. 12 m² = 120,000 cm².'),
    rule: b('Граница квадратных единиц требует квадрата линейного коэффициента.', 'Kvadrat birliklar chegarasi chiziqli koeffitsiyentning kvadratini talab qiladi.', 'A square-unit boundary requires the square of the linear factor.'),
  },
  {
    id: '09', level: 'red', kind: 'mc', skillTag: 'area_conversion_error',
    visual: { type: 'error-card', text: b('5 дм² = 50 см² ✕', '5 dm² = 50 cm² ✕', '5 dm² = 50 cm² ✕'), background: '#F5F5F0', colours: ['#168FA3', '#FF5B35'] },
    setup: b('Ученик использовал линейный коэффициент 10 вместо коэффициента площади.', 'O‘quvchi yuza koeffitsiyenti o‘rniga 10 chiziqli koeffitsiyentini ishlatdi.', 'A pupil used the linear factor 10 instead of the area factor.'),
    prompt: b('Как исправить равенство?', 'Tenglikni qanday tuzatish kerak?', 'How should the equality be corrected?'),
    options: [
      option('five-hundred', '5 дм² = 500 см²', '5 dm² = 500 cm²', '5 dm² = 500 cm²', true),
      option('fifty', '5 дм² = 50 см²', '5 dm² = 50 cm²', '5 dm² = 50 cm²', false, 'Это повторяет ошибку: 10 применено только по одному измерению.', 'Bu xatoni takrorlaydi: 10 faqat bitta o‘lcham bo‘yicha qo‘llangan.', 'This repeats the error: 10 has been applied in only one dimension.'),
      option('five-thousand', '5 дм² = 5000 см²', '5 dm² = 5000 cm²', '5 dm² = 5,000 cm²', false, 'Для дм²→см² коэффициент 100, а не 1000.', 'dm²→cm² uchun koeffitsiyent 100, 1000 emas.', 'The factor for dm²→cm² is 100, not 1,000.'),
      option('point-five', '5 дм² = 0,5 см²', '5 dm² = 0,5 cm²', '5 dm² = 0.5 cm²', false, 'При переходе к меньшей единице числовое значение увеличивается.', 'Kichik birlikka o‘tganda son qiymati ortadi.', 'The numerical value increases when converting to a smaller unit.'),
    ],
    secondHint: b('1 дм = 10 см, поэтому 1 дм² = 10 × 10 см².', '1 dm = 10 cm, shuning uchun 1 dm² = 10 × 10 cm².', '1 dm = 10 cm, so 1 dm² = 10 × 10 cm².'),
    thirdHint: b('5 × 100 = 500 см².', '5 × 100 = 500 cm².', '5 × 100 = 500 cm².'),
    correctText: b('Верно. Правильная запись: 5 дм² = 500 см².', 'To‘g‘ri. To‘g‘ri yozuv: 5 dm² = 500 cm².', 'Correct. The correct statement is 5 dm² = 500 cm².'),
    rule: b('Для площади коэффициент длины возводят в квадрат.', 'Yuza uchun uzunlik koeffitsiyenti kvadratga oshiriladi.', 'For area, square the length factor.'),
  },
  {
    id: '10', level: 'red', kind: 'mc', skillTag: 'area_strategy_transfer',
    visual: { type: 'solar-array', text: b('14 м × 9 м → ? дм²', '14 m × 9 m → ? dm²', '14 m × 9 m → ? dm²'), background: '#F5F5F0', colours: ['#168FA3', '#FF5B35'] },
    setup: b('Солнечная панельная площадка имеет размеры 14 м на 9 м.', 'Quyosh panellari maydoni 14 m ga 9 m.', 'A solar-panel array measures 14 m by 9 m.'),
    prompt: b('Какая стратегия и площадь верны?', 'Qaysi strategiya va yuza to‘g‘ri?', 'Which strategy and area are correct?'),
    options: [
      option('area-then-convert', '14 × 9 = 126 м²; 126 × 100 = 12 600 дм²', '14 × 9 = 126 m²; 126 × 100 = 12 600 dm²', '14 × 9 = 126 m²; 126 × 100 = 12,600 dm²', true),
      option('linear-factor-only', '14 × 9 = 126; 126 × 10 = 1260 дм²', '14 × 9 = 126; 126 × 10 = 1260 dm²', '14 × 9 = 126; 126 × 10 = 1,260 dm²', false, 'Коэффициент 10 подходит длине, но для площади нужен 100.', '10 koeffitsiyenti uzunlikka mos, yuza uchun esa 100 kerak.', 'The factor 10 suits length, but area needs 100.'),
      option('add-sides', '14 + 9 = 23 м²; 23 × 100 = 2300 дм²', '14 + 9 = 23 m²; 23 × 100 = 2300 dm²', '14 + 9 = 23 m²; 23 × 100 = 2,300 dm²', false, 'Сложение сторон не даёт площадь прямоугольника.', 'Tomonlarni qo‘shish to‘g‘ri to‘rtburchak yuzasini bermaydi.', 'Adding the sides does not give the area of a rectangle.'),
      option('no-conversion', '14 × 9 = 126 дм²', '14 × 9 = 126 dm²', '14 × 9 = 126 dm²', false, 'Произведение размеров в метрах даёт м², затем единицу нужно преобразовать.', 'Metrdagi o‘lchamlar ko‘paytmasi m² beradi, keyin birlikni aylantirish kerak.', 'Multiplying measurements in metres gives m², which must then be converted.'),
    ],
    secondHint: b('Сначала найдите площадь в м², не смешивая единицы.', 'Avval birliklarni aralashtirmasdan yuzani m² da toping.', 'First find the area in m² without mixing units.'),
    thirdHint: b('126 м² × 100 = 12 600 дм².', '126 m² × 100 = 12 600 dm².', '126 m² × 100 = 12,600 dm².'),
    correctText: b('Верно. Площадь массива равна 12 600 дм².', 'To‘g‘ri. Panellar maydoni 12 600 dm².', 'Correct. The array has an area of 12,600 dm².'),
    rule: b('Надёжная стратегия: найти площадь, записать квадратную единицу, затем преобразовать её.', 'Ishonchli strategiya: yuzani topish, kvadrat birlikni yozish, keyin uni aylantirish.', 'A reliable strategy is to find the area, write its square unit, then convert that unit.'),
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

// `platform` berilganda tugma qatori chizilmaydi: uni LMS o'zi beradi va
// tekshiruvni `registerCheck` orqali chaqiradi (LMS kontrakti).
function Task({ task, lang, isLast, onSolved, shuffleSeed ,
  platform = false, mode, onReady, registerCheck, onSubmit, playCorrect, playWrong,
}) {
  const [pickedId, setPickedId] = useState(null); const [typed, setTyped] = useState(''); const [pairs, setPairs] = useState({});
  const [activeLeft, setActiveLeft] = useState(null); const [placed, setPlaced] = useState({}); const [activeStep, setActiveStep] = useState(null);
  const [attempts, setAttempts] = useState(0); const [checked, setChecked] = useState(false); const [solved, setSolved] = useState(false); const [advancing, setAdvancing] = useState(false);
  const checkingRef = useRef(false); const advancedRef = useRef(false);
  // Xato javobdan keyin variantlar qayta aralashadi (metodist qarori 2026-08-21).
  const [wrongRound, setWrongRound] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- restart/task keys intentionally trigger a fresh shuffle
  const options = useMemo(() => shuffle(task.options || []), [shuffleSeed, task.id, task.options, wrongRound]);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- restart/task keys intentionally trigger a fresh shuffle
  const rightCards = useMemo(() => matchSpread(task.right, (card, row) => card.id === task.pairs[row]?.correctRight), [shuffleSeed, task.id, task.right]);
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
  return <section className="p4-task" aria-labelledby={`task-${task.id}`}>
    <p className={`p4-eyebrow is-${task.level}`}><span>{tx(UI.level[task.level], lang)}</span> · {tx(UI.task, lang)} {Number(task.id)}</p>
    <p className="p4-setup">{tx(task.setup, lang)}</p><Visual task={task} lang={lang}/><h2 id={`task-${task.id}`}>{tx(task.prompt, lang)}</h2>
    {task.kind === 'mc' && <div className="p4-options">{options.map((item, index) => <button type="button" key={item.id} disabled={solved} aria-pressed={pickedId === item.id} className={`p4-option ${pickedId === item.id ? checked ? item.correct ? 'is-ok' : 'is-no' : 'is-on' : ''}`} onClick={() => { checkingRef.current = false; setPickedId(item.id); setChecked(false); }}><span className="p4-letter">{'ABCD'[index]}</span>{tx(item.text, lang)}</button>)}</div>}
    {(task.kind === 'numpad' || task.kind === 'missing') && <NumPad value={typed} onChange={(value) => setResponse(setTyped, value)} max={task.maxLen || 4} disabled={solved} lang={lang}/>}
    {task.kind === 'match' && <div className="p4-match"><p>{tx(UI.matchHint, lang)}</p><div><section className="p4-match-col">{task.pairs.map((pair) => <button type="button" key={pair.id} disabled={solved} aria-pressed={activeLeft === pair.id} className={`${activeLeft === pair.id ? 'is-active' : ''} ${pairs[pair.id] ? 'is-tied' : ''}${matchToneLeft(task, pairs, pair.id)}`} onClick={() => { checkingRef.current = false; setActiveLeft(pair.id); setChecked(false); }}>{tx(pair.left, lang)}{pairs[pair.id] && <small>{tx(task.right.find((item) => item.id === pairs[pair.id])?.text, lang)}</small>}</button>)}</section><section className="p4-match-col">{rightCards.map((item) => { const used = Object.values(pairs).includes(item.id); return <button type="button" key={item.id} disabled={solved || activeLeft === null} className={`${used ? 'is-used' : ''}${matchToneRight(task, pairs, item.id)}`} onClick={() => { checkingRef.current = false; setPairs((old) => matchTie(old, activeLeft, item.id)); setActiveLeft(null); setChecked(false); }}>{tx(item.text, lang)}</button>; })}</section></div></div>}
    {task.kind === 'order' && <div className="p4-order"><p>{tx(UI.orderHint, lang)}</p><div className="p4-order-slots">{task.steps.map((step) => <button type="button" key={step.id} disabled={solved} aria-pressed={activeStep === step.id} className={activeStep === step.id ? 'is-active' : ''} onClick={() => { checkingRef.current = false; setActiveStep(step.id); setChecked(false); }}><small>{tx(step.label, lang)}</small><b>{placed[step.id] ? tx(task.cards.find((card) => card.id === placed[step.id])?.text, lang) : '—'}</b></button>)}</div><div className="p4-card-bank">{orderCards.map((card) => { const used = Object.values(placed).includes(card.id); return <button type="button" key={card.id} disabled={solved || activeStep === null || used} className={used ? 'is-used' : ''} onClick={() => { checkingRef.current = false; setPlaced((old) => ({ ...old, [activeStep]: card.id })); setActiveStep(null); setChecked(false); }}>{tx(card.text, lang)}</button>; })}</div></div>}
    {checked && <Feedback ok={solved} text={solved ? task.correctText : adaptive(task, pickedOption, attempts)} rule={task.rule} lang={lang}/>}
    {!platform && <div className="p4-actions">{!checked && !solved && <button type="button" className="p4-btn" disabled={!answerReady} onClick={check}>{tx(UI.check, lang)}</button>}{checked && !solved && <button type="button" className="p4-btn p4-btn-ghost is-ghost" onClick={clearResponse}>{tx(UI.retry, lang)}</button>}{solved && <button type="button" className="p4-btn p4-btn-ready is-ready" disabled={advancing} onClick={() => { if (advancedRef.current) return; advancedRef.current = true; checkingRef.current = false; setAdvancing(true); onSolved({ taskId: task.id, taskNumber: Number(task.id), level: task.level, kind: task.kind, skillTag: task.skillTag, attempts, firstTry: attempts === 1, correct: true, setup: task.setup, prompt: task.prompt, studentAnswer, correctAnswer, answerChoices: task.kind === 'mc' ? options.map(({ id, text, correct }) => ({ id, text, correct })) : task.right ?? task.cards ?? null, screenMeta: SCREEN_META.find((screen) => screen.taskId === task.id) }); }}>{tx(isLast ? UI.finish : UI.next, lang)}</button>}</div>}
  </section>;
}

export default function Grade4Dars29Practice({ studentName, lang: langProp, onFinished }) {
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

/* PRACTICE-FIX boshlanishi — metodist qarori 2026-08-21.
   1) Tekshirish tugmasi o'ngda (2-dars etaloni).
   2) Moslashtirishda ikki tomondagi kartochkalar bir xil o'lchamda: ustun grid
      bo'ladi va qatorlari 1fr, shuning uchun juftlar qator bo'yicha tekislanadi.
   Bu blok har darsda takrorlanadi ATAYLAB: LMS avtonom fayl talab qiladi. */
.p4-actions, .g4p-actions { justify-content: flex-end; }
.p4-match-cols, .g4p-match-cols { align-items: stretch; }
.p4-match-col, .g4p-match-col { display: grid; grid-auto-rows: 1fr; align-content: stretch; }
/* PRACTICE-FIX tugashi */

/* MATCH-FIX boshlanishi — metodist qarori 2026-08-21.
   Juftlikning ikki tomoni bir xil rang va bir xil belgi oladi: uchta qator
   uchta rangda ko'rinadi. Rang tanlangan (is-active) va band (is-used)
   holatlaridan ustun turishi kerak, shuning uchun !important. Tanlov va
   tekshiruv holatlari esa rangdan ustun: ular pastda, keyingi qatorlarda.
   Blok har darsda takrorlanadi ATAYLAB: LMS avtonom fayl talab qiladi. */
.p4-match [class*="p4-tone"],.g4p-match [class*="p4-tone"]{position:relative;opacity:1!important}
.p4-match [class*="p4-tone"]::before,.g4p-match [class*="p4-tone"]::before{position:absolute;top:2px;left:4px;font-size:9px;line-height:1;opacity:.9;pointer-events:none}
.p4-match [class*="p4-tone"] b,.g4p-match [class*="p4-tone"] b,.p4-match [class*="p4-tone"] small,.g4p-match [class*="p4-tone"] small{color:inherit!important}
.p4-match .p4-tone1,.g4p-match .p4-tone1{background:#DCF0F3!important;border-color:#0E7C8F!important;box-shadow:inset 0 0 0 2px #0E7C8F!important;color:#0B5A68!important}
.p4-match .p4-tone1::before,.g4p-match .p4-tone1::before{content:"●";color:#0E7C8F}
.p4-match .p4-tone2,.g4p-match .p4-tone2{background:#E9E4F7!important;border-color:#5E45AD!important;box-shadow:inset 0 0 0 2px #5E45AD!important;color:#3E2E75!important}
.p4-match .p4-tone2::before,.g4p-match .p4-tone2::before{content:"■";color:#5E45AD}
.p4-match .p4-tone3,.g4p-match .p4-tone3{background:#FBE2EA!important;border-color:#AE3760!important;box-shadow:inset 0 0 0 2px #AE3760!important;color:#77223F!important}
.p4-match .p4-tone3::before,.g4p-match .p4-tone3::before{content:"◆";color:#AE3760}
.p4-match .p4-tone4,.g4p-match .p4-tone4{background:#E2E8F0!important;border-color:#3C5A80!important;box-shadow:inset 0 0 0 2px #3C5A80!important;color:#27405C!important}
.p4-match .p4-tone4::before,.g4p-match .p4-tone4::before{content:"★";color:#3C5A80}
.p4-match .p4-tone5,.g4p-match .p4-tone5{background:#EFE6DA!important;border-color:#6B4A2B!important;box-shadow:inset 0 0 0 2px #6B4A2B!important;color:#4A3219!important}
.p4-match .p4-tone5::before,.g4p-match .p4-tone5::before{content:"▲";color:#6B4A2B}
.p4-match .p4-tone6,.g4p-match .p4-tone6{background:#FBEBCB!important;border-color:#A2690F!important;box-shadow:inset 0 0 0 2px #A2690F!important;color:#6E4708!important}
.p4-match .p4-tone6::before,.g4p-match .p4-tone6::before{content:"✚";color:#A2690F}
.p4-match .is-active,.g4p-match .is-active{background:#FFF0EA!important;border-color:#FF5B35!important;box-shadow:inset 0 0 0 2px #FF5B35!important;color:#12212C!important}
.p4-match .is-ok,.g4p-match .is-ok{background:#E7F3EC!important;border-color:#227A53!important;box-shadow:inset 0 0 0 2px #227A53!important;color:#1B5E40!important}
.p4-match .is-no,.g4p-match .is-no{background:#FFF5D9!important;border-color:#A96F13!important;box-shadow:inset 0 0 0 2px #A96F13!important;color:#7C5210!important}
/* MATCH-FIX tugashi */
/* NOSCROLL boshlanishi — metodist qarori 2026-08-21.
   Past ekranda (1280x720 noutbuk, 360x640 telefon) topshiriq skrollga
   ketmasligi kerak: bola «Tekshirish» tugmasini ko'rmasa, uni bosmaydi.
   Faqat BO'SH JOY qisqaradi — bosiladigan maydon 44 px dan kichraymaydi
   (MOBIL_DESKTOP_MOSLASH.md). Blok har darsda takrorlanadi ATAYLAB: LMS
   avtonom fayl talab qiladi. */
@media (max-height:820px){
.p4-root,.g4p-root{padding-bottom:12px}
.p4-head,.g4p-head{padding-top:52px;padding-bottom:4px}
.p4-task,.g4p-task{gap:8px}
.p4-eyebrow,.g4p-eyebrow{margin-top:0}
.p4-ask,.g4p-ask{margin-top:0}
.p4-note,.g4p-note{margin-top:4px}
.p4-actions,.g4p-actions{margin-top:0}
.p4-figure{padding-top:8px;padding-bottom:8px}
.p4-pad,.g4p-pad{padding:8px;gap:6px}
.p4-pad-display,.g4p-pad-display{min-height:44px}
.p4-pad-keys,.g4p-pad-keys{gap:5px}
.p4-options,.g4p-options{gap:7px}
.p4-match-cols,.g4p-match-cols{gap:8px;margin-top:4px}
.p4-match-col,.g4p-match-col{gap:6px}
.p4-header,.g4p-header{margin-bottom:4px}
.p4-header h1,.g4p-header h1{margin-top:2px}
.p4-task-top{margin-bottom:2px}
.p4-setup,.g4p-setup{line-height:1.4}
.p4-match-item,.g4p-match-item{min-height:44px;padding-top:5px;padding-bottom:5px}
.p4-match button,.g4p-match button{min-height:44px;padding-top:5px;padding-bottom:5px}
.p4-fb,.p4-feedback,.g4p-feedback{padding-top:9px;padding-bottom:9px}
.p4-rule,.g4p-rule{margin-top:6px}
.p4-cells,.p4-grid{gap:4px}
.p4-card-bank,.p4-order-slots,.p4-slot-list,.p4-sort-pool{gap:6px}
}
@media (max-height:760px){
.p4-head,.g4p-head{padding-bottom:0}
.p4-main,.g4p-main{padding-top:0;padding-bottom:0}
.p4-root,.g4p-root{padding-bottom:8px}
.p4-task,.g4p-task{gap:5px}
.p4-figure{padding-top:4px;padding-bottom:4px}
.p4-eyebrow,.g4p-eyebrow{font-size:10px}
.p4-setup,.g4p-setup{font-size:clamp(13px,1.8vw,14px)}
.p4-ask,.g4p-ask{font-size:clamp(15px,2.2vw,18px)}
.p4-pad,.g4p-pad{padding:4px;gap:4px}
.p4-pad-keys,.g4p-pad-keys{gap:4px}
.p4-pad-display,.g4p-pad-display{min-height:40px}
.p4-visual,.g4p-visual{padding-top:8px;padding-bottom:8px;min-height:0}
.p4-svg,.g4p-svg{max-height:96px}
}
@media (max-height:700px){
.p4-head,.g4p-head{padding-top:52px;padding-bottom:2px}
.p4-task,.g4p-task{gap:6px}
.p4-figure{padding-top:6px;padding-bottom:6px}
.p4-bignum,.g4p-bignum{font-size:clamp(20px,4.4vw,30px)}
.p4-pad,.g4p-pad{padding:6px;gap:5px}
.p4-match-col,.g4p-match-col{gap:5px}
}
/* NOSCROLL tugashi */
`;
