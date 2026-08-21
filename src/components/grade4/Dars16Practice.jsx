// ============================================================================
// 4-SINF · 16-DARS AMALIYOTI
// Formulalar: P=2(a+b), P=4a, S=ab · 10 topshiriq + natija · 2 / 5 / 3
// Standalone LMS component: UZ/RU/EN, ovozsiz, solve-to-advance, first-try score.
// ============================================================================

import { useEffect, useMemo, useRef, useState } from 'react';

const T = {
  bg: '#F5F5F0', paper: '#FFFFFF', ink: '#12212C', ink2: '#50616D', ink3: '#87949D',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', success: '#227A53', successSoft: '#E7F3EC', warn: '#A96F13',
  warnSoft: '#FFF5D9', shadowBase: '0 16px 36px -24px rgba(23,59,82,.34)',
};

const SUPPORTED_LANGS = ['uz', 'ru', 'en'];
const normalizeLang = (value) => SUPPORTED_LANGS.includes(value) ? value : 'uz';

const UI = {
  title: { ru: 'Урок 16. Практика: формулы периметра и площади', uz: "16-dars. Amaliyot: perimetr va yuza formulalari", en: "Lesson 16. Practice: perimeter and area formulae" },
  language: { ru: 'Язык', uz: 'Til', en: 'Language' },
  task: { ru: 'Задание', uz: "Topshiriq", en: "Task" },
  level: {
    green: { ru: 'Базовое', uz: "Asosiy", en: "Core" },
    yellow: { ru: 'Применение', uz: "Qo'llash", en: "Application" },
    red: { ru: 'Перенос', uz: "Ko'chirish", en: "Transfer" },
  },
  check: { ru: 'Проверить', uz: "Tekshirish", en: "Check" },
  retry: { ru: 'Исправить ответ', uz: "Javobni tuzatish", en: "Correct the answer" },
  next: { ru: 'Следующее', uz: "Keyingisi", en: "Next" },
  finish: { ru: 'Завершить', uz: "Yakunlash", en: "Finish" },
  again: { ru: 'Пройти заново', uz: "Qaytadan ishlash", en: "Try again" },
  done: { ru: 'Практика пройдена', uz: "Amaliyot tugadi", en: "Practice complete" },
  firstTry: { ru: 'верно с первой проверки', uz: "birinchi tekshiruvda to'g'ri", en: "correct on the first check" },
  allSolved: { ru: 'Все 10 заданий решены.', uz: "10 ta topshiriqning barchasi yechildi.", en: "All 10 tasks have been solved." },
  rule: { ru: 'Запомните', uz: "Eslab qoling", en: "Remember" },
  typeAnswer: { ru: 'Введите числовой ответ', uz: "Sonli javobni kiriting", en: "Enter a numerical answer" },
  clear: { ru: 'Стереть', uz: "O'chirish", en: "Delete" },
  matchHint: { ru: 'Выберите ситуацию слева, затем подходящую запись справа.', uz: "Avval chapdagi vaziyatni, keyin o'ngdagi mos yozuvni tanlang.", en: "Choose a situation on the left, then the matching expression on the right." },
  orderHint: { ru: 'Выберите место, затем подходящую карточку.', uz: "Avval o'rinni, keyin mos kartani tanlang.", en: "Choose a position, then the matching card." },
  threeScenes: { ru: 'Три геометрические ситуации', uz: 'Uchta geometrik vaziyat', en: 'Three geometric situations' },
  missingSidesRectangle: { ru: 'Прямоугольник с пропущенными сторонами', uz: "Yetishmayotgan tomonlar ko'rsatilgan to'g'ri to'rtburchak", en: 'Rectangle with missing sides' },
  exactSidesShape: { ru: 'Фигура с точными сторонами и клетками', uz: "Tomonlari va kataklari aniq ko'rsatilgan shakl", en: 'Shape with exact sides and squares' },
  units: { ru: 'ед.', uz: 'birlik', en: 'units' },
};

const tx = (value, lang) => (value && typeof value === 'object' && !Array.isArray(value) ? (value[lang] ?? '') : value);
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
  lessonId: 'num-4-16-practice', lessonTitle: UI.title, grade: 4, lessonNumber: 16, activityType: 'practice',
  taskCount: 10, resultIsUiState: true, progression: { green: 2, yellow: 5, red: 3 },
};

const SCREEN_META = [
  { id: 'practice-01', taskId: '01', template: 'multiple-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-02', taskId: '02', template: 'matching', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-03', taskId: '03', template: 'ordering', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-04', taskId: '04', template: 'numeric-input', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-05', taskId: '05', template: 'numeric-blank', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-06', taskId: '06', template: 'numeric-input', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-07', taskId: '07', template: 'matching', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-08', taskId: '08', template: 'quantity-unit', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-09', taskId: '09', template: 'error-analysis', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-10', taskId: '10', template: 'strategy-transfer', type: 'practice', scored: true, scope: 'final' },
];

const TASKS = [
  {
    id: '01', level: 'green', kind: 'mc', skillTag: 'rectangle-perimeter-formula',
    visual: { type: 'rectangle', a: 6, b: 4, mode: 'border', caption: '2 · (6 + 4) = 20', generalize: true },
    thirdHint: { ru: 'Сначала сложите одну длину и одну ширину.', uz: "Avval bitta uzunlik va bitta kenglikni qo'shing.", en: "First add one length and one width." },
    setup: { ru: 'У прямоугольника длина 6, ширина 4. Его периметр равен 2 · (6 + 4) = 20.', uz: "To'g'ri to'rtburchakning uzunligi 6, kengligi 4. Uning perimetri 2 · (6 + 4) = 20.", en: "The rectangle has length 6 and width 4. Its perimeter is 2 · (6 + 4) = 20." },
    prompt: { ru: 'Какая формула подходит для любого прямоугольника?', uz: "Istalgan to'g'ri to'rtburchak uchun qaysi formula mos?", en: "Which formula works for any rectangle?" },
    options: [
      { id: 'correct', text: { ru: 'P = 2 · (a + b)', uz: "P = 2 · (a + b)", en: "P = 2 · (a + b)" }, correct: true },
      { id: 'onePair', text: { ru: 'P = a + b', uz: "P = a + b", en: "P = a + b" }, wrong: [
        { ru: 'a + b учитывает только одну длину и одну ширину.', uz: "a + b faqat bitta uzunlik va bitta kenglikni hisobga oladi.", en: "a + b includes only one length and one width." },
        { ru: 'У прямоугольника две одинаковые пары сторон.', uz: "To'g'ri to'rtburchakda ikkita bir xil tomonlar jufti bor.", en: "A rectangle has two identical pairs of sides." },
      ] },
      { id: 'area', text: { ru: 'P = a · b', uz: "P = a · b", en: "P = a · b" }, wrong: [
        { ru: 'Произведение a · b находит площадь внутренней части.', uz: "a · b ko'paytma ichki qismning yuzasini topadi.", en: "The product a · b finds the area of the inside." },
        { ru: 'Для периметра измеряют всю границу, а не число квадратов внутри.', uz: "Perimetr uchun ichki kvadratlar soni emas, butun chegara o'lchanadi.", en: "To find the perimeter, measure the entire boundary, not the number of squares inside." },
      ] },
      { id: 'concrete', text: { ru: '2 · (6 + 4) = 20', uz: "2 · (6 + 4) = 20", en: "2 · (6 + 4) = 20" }, wrong: [
        { ru: 'Эта запись верна только для данных сторон 6 и 4, но вопрос просит общую формулу.', uz: "Bu yozuv faqat berilgan 6 va 4 tomonlar uchun to'g'ri, savol esa umumiy formulani so'raydi.", en: "This expression is correct only for the given sides 6 and 4, but the question asks for a general formula." },
        { ru: 'Замените конкретные числа обозначениями длины a и ширины b.', uz: "Aniq sonlarni a uzunlik va b kenglik belgilariga almashtiring.", en: "Replace the specific numbers with a for the length and b for the width." },
      ] },
    ],
    correctText: { ru: 'Верно. P = 2 · (a + b) учитывает все четыре стороны.', uz: "To'g'ri. P = 2 · (a + b) barcha to'rtta tomonni hisobga oladi.", en: "Correct. P = 2 · (a + b) includes all four sides." },
    rule: { ru: 'Периметр прямоугольника равен удвоенной сумме длины и ширины.', uz: "To'g'ri to'rtburchak perimetri uzunlik va kenglik yig'indisining ikki baravariga teng.", en: "The perimeter of a rectangle is twice the sum of its length and width." },
  },
  {
    id: '02', level: 'green', kind: 'match', skillTag: 'formula-recognition',
    visual: { type: 'three-scenes' },
    thirdHint: { ru: 'Сначала определите: граница это или внутренняя часть.', uz: "Avval chegara yoki ichki qism ekanini aniqlang.", en: "First decide whether it is the boundary or the inside." },
    setup: { ru: 'Граница означает периметр, внутренняя часть — площадь.', uz: "Chegara perimetrni, ichki qism esa yuzani bildiradi.", en: "The boundary means perimeter; the inside means area." },
    prompt: { ru: 'Соедините каждую ситуацию с формулой.', uz: "Har bir vaziyatni formula bilan moslashtiring.", en: "Match each situation to its formula." },
    pairs: [
      { id: 'rect-border', left: { ru: 'Граница прямоугольника', uz: "To'g'ri to'rtburchak chegarasi", en: "Boundary of a rectangle" }, correctRight: 'rectP', wrong: [
        { ru: 'У прямоугольника две длины и две ширины.', uz: "To'g'ri to'rtburchakda ikkita uzunlik va ikkita kenglik bor.", en: "A rectangle has two lengths and two widths." },
        { ru: 'Для границы сложите a + b и возьмите эту пару дважды.', uz: "Chegara uchun a + b ni qo'shib, bu juftni ikki marta oling.", en: "For the boundary, add a + b and take this pair twice." },
      ] },
      { id: 'square-border', left: { ru: 'Граница квадрата', uz: "Kvadrat chegarasi", en: "Boundary of a square" }, correctRight: 'squareP', wrong: [
        { ru: 'У квадрата четыре равные стороны a.', uz: "Kvadratning a ga teng to'rtta tomoni bor.", en: "A square has four equal sides of length a." },
        { ru: 'Периметр здесь — сумма четырёх одинаковых a.', uz: "Bu yerda perimetr to'rtta bir xil a ning yig'indisi.", en: "Here, the perimeter is the sum of four identical lengths a." },
      ] },
      { id: 'rect-inside', left: { ru: 'Внутренняя часть прямоугольника', uz: "To'g'ri to'rtburchakning ichki qismi", en: "Inside of a rectangle" }, correctRight: 'area', wrong: [
        { ru: 'Внутренняя часть измеряется квадратными единицами.', uz: "Ichki qism kvadrat birliklarda o'lchanadi.", en: "The inside is measured in square units." },
        { ru: 'Число клеток равно числу рядов, умноженному на число клеток в ряду.', uz: "Kataklar soni qatorlar sonini qatordagi kataklar soniga ko'paytirishga teng.", en: "The number of squares equals the number of rows multiplied by the number of squares in each row." },
      ] },
    ],
    right: [
      { id: 'rectP', text: { ru: 'P = 2 · (a + b)', uz: "P = 2 · (a + b)", en: "P = 2 · (a + b)" } },
      { id: 'squareP', text: { ru: 'P = 4 · a', uz: "P = 4 · a", en: "P = 4 · a" } },
      { id: 'area', text: { ru: 'S = a · b', uz: "S = a · b", en: "S = a · b" } },
    ],
    correctText: { ru: 'Верно. Формула зависит и от величины, и от формы.', uz: "To'g'ri. Formula kattalik va shaklga bog'liq.", en: "Correct. The formula depends on both the measurement and the shape." },
    rule: { ru: 'Сначала различайте границу и внутреннюю часть.', uz: "Avval chegara va ichki qismni farqlang.", en: "First distinguish between the boundary and the inside." },
  },
  {
    id: '03', level: 'yellow', kind: 'order', skillTag: 'concrete-to-formula',
    visual: { type: 'rectangle', a: 13, b: 8, mode: 'border' },
    thirdHint: { ru: 'Начните с суммы всех четырёх сторон конкретного прямоугольника.', uz: "Aniq to'g'ri to'rtburchakning barcha to'rtta tomoni yig'indisidan boshlang.", en: "Start with the sum of all four sides of the specific rectangle." },
    setup: { ru: 'У прямоугольника стороны 8 и 13. Пройдите путь от сторон к общей формуле.', uz: "To'g'ri to'rtburchak tomonlari 8 va 13. Tomonlardan umumiy formulagacha bo'lgan yo'lni tuzing.", en: "The rectangle has sides 8 and 13. Work from the side lengths to the general formula." },
    prompt: { ru: 'Расположите записи в заданной цепочке.', uz: "Yozuvlarni berilgan zanjir tartibida joylashtiring.", en: "Put the expressions in the given sequence." },
    steps: [
      { id: 's1', label: { ru: 'Все стороны', uz: "Barcha tomonlar", en: "All sides" }, correct: 'sum4', wrong: [
        { ru: 'Первая запись должна перечислить четыре конкретные стороны.', uz: "Birinchi yozuv to'rtta aniq tomonni ko'rsatishi kerak.", en: "The first expression should list the four specific sides." },
        { ru: 'Используйте 8, 13, 8 и 13.', uz: "8, 13, 8 va 13 dan foydalaning.", en: "Use 8, 13, 8 and 13." },
      ] },
      { id: 's2', label: { ru: 'Две пары', uz: "Ikki juft", en: "Two pairs" }, correct: 'pairs', wrong: [
        { ru: 'Сверните четыре слагаемых в две одинаковые пары.', uz: "To'rtta qo'shiluvchini ikkita bir xil juftga birlashtiring.", en: "Group the four addends into two identical pairs." },
        { ru: 'Одна пара равна 8 + 13, таких пар две.', uz: "Bitta juft 8 + 13 ga teng, bunday juft ikkita.", en: "One pair is 8 + 13, and there are two such pairs." },
      ] },
      { id: 's3', label: { ru: 'Результат', uz: "Natija", en: "Result" }, correct: 'result', wrong: [
        { ru: 'После числового выражения нужен его результат.', uz: "Sonli ifodadan keyin uning natijasi kerak.", en: "The numerical expression should be followed by its result." },
        { ru: 'Вычислите сначала сумму в скобках, затем удвойте.', uz: "Avval qavs ichidagi yig'indini topib, keyin ikki marta oling.", en: "First calculate the sum in brackets, then double it." },
      ] },
      { id: 's4', label: { ru: 'Общая формула', uz: "Umumiy formula", en: "General formula" }, correct: 'formula', wrong: [
        { ru: 'Последняя запись должна заменить числа буквами.', uz: "Oxirgi yozuv sonlarni harflar bilan almashtirishi kerak.", en: "The last expression should replace the numbers with letters." },
        { ru: 'Сохраните структуру: две одинаковые пары длины и ширины.', uz: "Tuzilmani saqlang: uzunlik va kenglikning ikkita bir xil jufti.", en: "Keep the structure: two identical pairs of a length and a width." },
      ] },
    ],
    cards: [
      { id: 'sum4', text: { ru: '8 + 13 + 8 + 13', uz: "8 + 13 + 8 + 13", en: "8 + 13 + 8 + 13" } },
      { id: 'pairs', text: { ru: '2 · (8 + 13)', uz: "2 · (8 + 13)", en: "2 · (8 + 13)" } },
      { id: 'result', text: { ru: '42', uz: "42", en: "42" } },
      { id: 'formula', text: { ru: 'P = 2 · (a + b)', uz: "P = 2 · (a + b)", en: "P = 2 · (a + b)" } },
    ],
    correctText: { ru: 'Верно. 8 + 13 + 8 + 13 → 2 · (8 + 13) → 42 → P = 2 · (a + b).', uz: "To'g'ri. 8 + 13 + 8 + 13 → 2 · (8 + 13) → 42 → P = 2 · (a + b).", en: "Correct. 8 + 13 + 8 + 13 → 2 · (8 + 13) → 42 → P = 2 · (a + b)." },
    rule: { ru: 'Формула сохраняет устройство числового решения.', uz: "Formula sonli yechimning tuzilishini saqlaydi.", en: "The formula preserves the structure of the numerical solution." },
  },
  {
    id: '04', level: 'yellow', kind: 'numpad', skillTag: 'square-perimeter', answer: '36', maxLen: 2,
    visual: { type: 'square', a: 9, b: 9, mode: 'border', caption: 'P = 4 · a' },
    thirdHint: { ru: 'Возьмите сторону 9 четыре раза.', uz: "9 ga teng tomonni to'rt marta oling.", en: "Take the side of length 9 four times." },
    setup: { ru: 'Сторона квадрата равна 9 см.', uz: "Kvadrat tomoni 9 santimetr.", en: "The side of the square is 9 cm." },
    prompt: { ru: 'Найдите периметр квадрата в сантиметрах.', uz: "Kvadrat perimetrini santimetrda toping.", en: "Find the perimeter of the square in centimetres." },
    wrongAnswers: {
      18: [
        { ru: '18 учитывает только две стороны квадрата.', uz: "18 kvadratning faqat ikkita tomonini hisobga oladi.", en: "18 includes only two sides of the square." },
        { ru: 'У квадрата четыре стороны по 9 см.', uz: "Kvadratning 9 santimetrdan to'rtta tomoni bor.", en: "A square has four sides of 9 cm." },
      ],
      81: [
        { ru: '81 — площадь квадрата, найденная умножением 9 · 9.', uz: "81 kvadratning 9 · 9 orqali topilgan yuzasi.", en: "81 is the area of the square, found by multiplying 9 · 9." },
        { ru: 'Для периметра используйте P = 4 · a.', uz: "Perimetr uchun P = 4 · a dan foydalaning.", en: "Use P = 4 · a for the perimeter." },
      ],
      9: [
        { ru: '9 — длина только одной стороны.', uz: "9 faqat bitta tomonning uzunligi.", en: "9 is the length of only one side." },
        { ru: 'Периметр объединяет все четыре стороны.', uz: "Perimetr barcha to'rtta tomonni birlashtiradi.", en: "The perimeter includes all four sides." },
      ],
    },
    wrongText: [
      { ru: 'Проверьте формулу периметра квадрата.', uz: "Kvadrat perimetri formulasini tekshiring.", en: "Check the formula for the perimeter of a square." },
      { ru: 'Подставьте a = 9 в P = 4 · a.', uz: "P = 4 · a formulaga a = 9 ni qo'ying.", en: "Substitute a = 9 into P = 4 · a." },
    ],
    correctText: { ru: 'Верно. P = 4 · 9 = 36 см.', uz: "To'g'ri. P = 4 · 9 = 36 santimetr.", en: "Correct. P = 4 · 9 = 36 cm." },
    rule: { ru: 'Периметр квадрата измеряется единицами длины.', uz: "Kvadrat perimetri uzunlik birliklarida o'lchanadi.", en: "The perimeter of a square is measured in units of length." },
  },
  {
    id: '05', level: 'yellow', kind: 'missing', skillTag: 'rectangle-area', answer: '84', maxLen: 2,
    visual: { type: 'rectangle', a: 12, b: 7, mode: 'area', caption: 'S = 7 · 12 = □', answer: 84 },
    thirdHint: { ru: 'Умножьте число клеток в одном ряду на число рядов.', uz: "Bitta qatordagi kataklar sonini qatorlar soniga ko'paytiring.", en: "Multiply the number of squares in one row by the number of rows." },
    setup: { ru: 'Прямоугольник имеет стороны 7 см и 12 см.', uz: "To'g'ri to'rtburchak tomonlari 7 va 12 santimetr.", en: "The rectangle has sides of 7 cm and 12 cm." },
    prompt: { ru: 'Какое число нужно записать в пустую клетку?', uz: "Bo'sh katakka qaysi sonni yozish kerak?", en: "Which number should be written in the empty box?" },
    wrongAnswers: {
      38: [
        { ru: '38 см — периметр границы, но нужна площадь внутри.', uz: "38 sm chegara perimetri, ammo ichki yuza kerak.", en: "38 cm is the perimeter of the boundary, but the area inside is needed." },
        { ru: 'Для площади используйте S = a · b и квадратные единицы.', uz: "Yuza uchun S = a · b va kvadrat birliklardan foydalaning.", en: "For the area, use S = a · b and square units." },
      ],
      19: [
        { ru: 'Сумма сторон не считает все единичные квадраты внутри.', uz: "Tomonlar yig'indisi ichkaridagi barcha birlik kvadratlarni sanamaydi.", en: "Adding the sides does not count all the unit squares inside." },
        { ru: 'Нужно умножить 7 рядов на 12 клеток в каждом.', uz: "7 qatorni har qatordagi 12 katakka ko'paytirish kerak.", en: "You need to multiply 7 rows by 12 squares in each row." },
      ],
      49: [
        { ru: 'Так обе стороны стали равны 7, но в условии вторая сторона равна 12.', uz: "Bunda ikkala tomon 7 ga teng bo'lib qoldi, ammo shartda ikkinchi tomon 12.", en: "This makes both sides equal to 7, but the second side in the question is 12." },
        { ru: 'Подставьте в S = a · b оба разных значения: 7 и 12.', uz: "S = a · b formulaga ikkala turli qiymatni qo'ying: 7 va 12.", en: "Substitute both different values, 7 and 12, into S = a · b." },
      ],
    },
    wrongText: [
      { ru: 'Проверьте: пустая клетка обозначает площадь внутренней части.', uz: "Tekshiring: bo'sh katak ichki qism yuzasini bildiradi.", en: "Check: the empty box represents the area of the inside." },
      { ru: 'Используйте произведение 7 · 12, не сумму сторон.', uz: "Tomonlar yig'indisi emas, 7 · 12 ko'paytmadan foydalaning.", en: "Use the product 7 · 12, not the sum of the sides." },
    ],
    correctText: { ru: 'Верно. S = 7 · 12 = 84 см².', uz: "To'g'ri. S = 7 · 12 = 84 sm².", en: "Correct. S = 7 · 12 = 84 cm²." },
    rule: { ru: 'Площадь прямоугольника равна произведению его сторон.', uz: "To'g'ri to'rtburchak yuzasi uning tomonlari ko'paytmasiga teng.", en: "The area of a rectangle is the product of its side lengths." },
  },
  {
    id: '06', level: 'yellow', kind: 'numpad', skillTag: 'area-word-problem', answer: '154', maxLen: 3,
    visual: { type: 'rectangle', a: 14, b: 11, mode: 'area', caption: 'S = 11 · 14', solveCaption: { ru: 'S = 11 · 14 = 154 м²', uz: "S = 11 · 14 = 154 m²", en: "S = 11 · 14 = 154 m²" } },
    thirdHint: { ru: 'Для покрытия внутренней части умножьте 11 на 14.', uz: "Ichki qismni qoplash uchun 11 ni 14 ga ko'paytiring.", en: "Multiply 11 by 14 to find the area to be covered." },
    setup: { ru: 'Ковёр длиной 14 м и шириной 11 м покрывает внутреннюю часть комнаты.', uz: "Uzunligi 14 metr, kengligi 11 metr bo'lgan gilam xonaning ichki qismini qoplaydi.", en: "A carpet 14 m long and 11 m wide covers the floor area of a room." },
    prompt: { ru: 'Какова площадь ковра в квадратных метрах?', uz: "Gilamning yuzasi necha kvadrat metr?", en: "What is the area of the carpet in square metres?" },
    wrongAnswers: {
      50: [
        { ru: '50 — периметр ковра, а нужна площадь покрытия.', uz: "50 gilamning perimetri, ammo qoplama yuzasi kerak.", en: "50 is the perimeter of the carpet, but the area covered is needed." },
        { ru: 'Внутреннюю часть находим умножением сторон.', uz: "Ichki qismni tomonlarni ko'paytirib topamiz.", en: "Find the area inside by multiplying the side lengths." },
      ],
      25: [
        { ru: '25 — сумма длины и ширины, не площадь.', uz: "25 uzunlik va kenglik yig'indisi, yuza emas.", en: "25 is the sum of the length and width, not the area." },
        { ru: 'Используйте произведение 11 · 14.', uz: "11 · 14 ko'paytmadan foydalaning.", en: "Use the product 11 · 14." },
      ],
      121: [
        { ru: '121 получилось из 11 · 11, но длина равна 14.', uz: "121 soni 11 · 11 dan chiqadi, ammo uzunlik 14 ga teng.", en: "121 comes from 11 · 11, but the length is 14." },
        { ru: 'В формулу нужно подставить обе стороны: 11 и 14.', uz: "Formulaga ikkala tomonni qo'yish kerak: 11 va 14.", en: "You need to substitute both side lengths, 11 and 14, into the formula." },
      ],
    },
    wrongText: [
      { ru: 'Проверьте, что используете формулу площади, а не периметра.', uz: "Perimetr emas, yuza formulasidan foydalanayotganingizni tekshiring.", en: "Check that you are using the area formula, not the perimeter formula." },
      { ru: 'Подставьте a = 14 и b = 11 в S = a · b.', uz: "S = a · b formulaga a = 14 va b = 11 ni qo'ying.", en: "Substitute a = 14 and b = 11 into S = a · b." },
    ],
    correctText: { ru: 'Верно. S = 11 · 14 = 154 м².', uz: "To'g'ri. S = 11 · 14 = 154 m².", en: "Correct. S = 11 · 14 = 154 m²." },
    rule: { ru: 'Площадь покрытия записывается в квадратных метрах.', uz: "Qoplama yuzasi kvadrat metrlarda yoziladi.", en: "The area covered is written in square metres." },
  },
  {
    id: '07', level: 'yellow', kind: 'match', skillTag: 'quantity-discrimination',
    visual: { type: 'rectangle', a: 10, b: 6, mode: 'both' },
    thirdHint: { ru: 'Сначала определите, относится выбранная строка к границе или внутренней части.', uz: "Avval tanlangan qator chegara yoki ichki qismga tegishli ekanini aniqlang.", en: "First decide whether the selected row describes the boundary or the inside." },
    setup: { ru: 'У прямоугольника длина 10 см и ширина 6 см.', uz: "To'g'ri to'rtburchakning uzunligi 10, kengligi 6 santimetr.", en: "The rectangle has length 10 cm and width 6 cm." },
    prompt: { ru: 'Соедините величину с её значением и единицей.', uz: "Kattalikni uning qiymati va birligi bilan moslashtiring.", en: "Match the measurement to its value and unit." },
    pairs: [
      { id: 'border', left: { ru: 'Вся граница', uz: "Butun chegara", en: "The whole boundary" }, correctRight: 'p32', wrong: [
        { ru: 'Для всей границы нужны две длины и две ширины.', uz: "Butun chegara uchun ikkita uzunlik va ikkita kenglik kerak.", en: "The whole boundary needs two lengths and two widths." },
        { ru: 'Вычислите 2 · (10 + 6) и оставьте единицу длины.', uz: "2 · (10 + 6) ni hisoblab, uzunlik birligini saqlang.", en: "Calculate 2 · (10 + 6) and keep the unit of length." },
      ] },
      { id: 'inside', left: { ru: 'Внутренняя часть', uz: "Ichki qism", en: "The inside" }, correctRight: 's60', wrong: [
        { ru: 'Внутренняя часть — площадь в квадратных сантиметрах.', uz: "Ichki qism kvadrat santimetrdagi yuzadir.", en: "The inside is the area in square centimetres." },
        { ru: 'Вычислите 10 · 6 и используйте см².', uz: "10 · 6 ni hisoblab, sm² dan foydalaning.", en: "Calculate 10 · 6 and use cm²." },
      ] },
      { id: 'one-pair', left: { ru: 'Одна длина + одна ширина', uz: "Bitta uzunlik + bitta kenglik", en: "One length + one width" }, correctRight: 'pair16', wrong: [
        { ru: 'Здесь нужна только одна пара сторон, без удвоения.', uz: "Bu yerda ikki marta olmasdan faqat bitta tomonlar jufti kerak.", en: "Only one pair of sides is needed here, without doubling." },
        { ru: 'Сложите 10 и 6, единица остаётся сантиметром.', uz: "10 va 6 ni qo'shing, birlik santimetr bo'lib qoladi.", en: "Add 10 and 6; the unit remains centimetres." },
      ] },
    ],
    right: [
      { id: 'p32', text: { ru: '32 см', uz: "32 sm", en: "32 cm" } },
      { id: 's60', text: { ru: '60 см²', uz: "60 sm²", en: "60 cm²" } },
      { id: 'pair16', text: { ru: '16 см', uz: "16 sm", en: "16 cm" } },
    ],
    correctText: { ru: 'Верно: граница 32 см, внутренняя часть 60 см², одна пара 16 см.', uz: "To'g'ri: chegara 32 sm, ichki qism 60 sm², bitta juft 16 sm.", en: "Correct: the boundary is 32 cm, the inside is 60 cm², and one pair is 16 cm." },
    rule: { ru: 'Число и единица вместе определяют величину.', uz: "Son va birlik birgalikda kattalikni aniqlaydi.", en: "The number and unit together determine the measurement." },
  },
  {
    id: '08', level: 'red', kind: 'mc', skillTag: 'same-number-different-quantity',
    visual: { type: 'unit-split', a: 6, b: 3, mode: 'both' },
    thirdHint: { ru: 'Сначала вычислите периметр действием 2 · (3 + 6).', uz: "Avval perimetrni 2 · (3 + 6) amali bilan hisoblang.", en: "First calculate the perimeter using 2 · (3 + 6)." },
    setup: { ru: 'У прямоугольника стороны 3 см и 6 см.', uz: "To'g'ri to'rtburchak tomonlari 3 va 6 santimetr.", en: "The rectangle has sides of 3 cm and 6 cm." },
    prompt: { ru: 'Как верно описать результаты?', uz: "Natijalarni qanday to'g'ri izohlash mumkin?", en: "Which statement describes the results correctly?" },
    options: [
      { id: 'correct', text: { ru: 'P = 18 см, S = 18 см²: числа равны, величины и единицы различны.', uz: "P = 18 sm, S = 18 sm²: sonlar teng, kattalik va birliklar turlicha.", en: "P = 18 cm, S = 18 cm²: the numbers are equal, but the measurements and units are different." }, correct: true },
      { id: 'same', text: { ru: 'Периметр и площадь — одна величина, потому что оба числа равны 18.', uz: "Ikkala son 18 ga teng bo'lgani uchun perimetr va yuza bitta kattalik.", en: "Perimeter and area are the same measurement because both numbers equal 18." }, wrong: [
        { ru: 'Одинаковое число не делает разные величины одинаковыми.', uz: "Bir xil son turli kattaliklarni bir xil qilib qo'ymaydi.", en: "The same number does not make different measurements the same." },
        { ru: 'Периметр измеряет границу в см, площадь — внутреннюю часть в см².', uz: "Perimetr chegarani sm da, yuza ichki qismni sm² da o'lchaydi.", en: "Perimeter measures the boundary in cm; area measures the inside in cm²." },
      ] },
      { id: 'swapped', text: { ru: 'P = 18 см², S = 18 см', uz: "P = 18 sm², S = 18 sm", en: "P = 18 cm², S = 18 cm" }, wrong: [
        { ru: 'Единицы перепутаны: периметр не измеряется квадратными единицами.', uz: "Birliklar almashtirilgan: perimetr kvadrat birliklarda o'lchanmaydi.", en: "The units have been swapped: perimeter is not measured in square units." },
        { ru: 'Граница получает см, внутренняя часть — см².', uz: "Chegara sm, ichki qism esa sm² birligini oladi.", en: "The boundary is measured in cm; the inside is measured in cm²." },
      ] },
      { id: 'onlyOne', text: { ru: 'Достаточно записать просто 18 без единицы.', uz: "Birliksiz faqat 18 deb yozish yetarli.", en: "It is enough to write just 18 without a unit." }, wrong: [
        { ru: 'Без единицы непонятно, обозначает 18 границу или площадь.', uz: "Birliksiz 18 chegara yoki yuzani bildirishi noma'lum.", en: "Without a unit, it is unclear whether 18 represents the boundary or the area." },
        { ru: 'К каждому результату добавьте единицу его величины.', uz: "Har bir natijaga uning kattaligi birligini qo'shing.", en: "Add the unit of the measurement to each result." },
      ] },
    ],
    correctText: { ru: 'Верно. Совпали только числа; периметр и площадь остаются разными величинами.', uz: "To'g'ri. Faqat sonlar teng; perimetr va yuza turli kattalik bo'lib qoladi.", en: "Correct. Only the numbers are equal; perimeter and area remain different measurements." },
    rule: { ru: 'Всегда проверяйте и числовое значение, и единицу.', uz: "Har doim sonli qiymat va birlikni tekshiring.", en: "Always check both the numerical value and the unit." },
  },
  {
    id: '09', level: 'red', kind: 'mc', skillTag: 'formula-error-analysis',
    visual: { type: 'rectangle-error', a: 9, b: 4, bad: 'P = 9 + 4 = 13', good: { ru: 'P = 2 · (9 + 4) = 26 см', uz: "P = 2 · (9 + 4) = 26 sm", en: "P = 2 · (9 + 4) = 26 cm" } },
    thirdHint: { ru: 'Сохраните сумму 9 + 4, но учтите вторую такую же пару сторон.', uz: "9 + 4 yig'indini saqlang, ammo ikkinchi shunday tomonlar juftini ham hisobga oling.", en: "Keep the sum 9 + 4, but include the second identical pair of sides." },
    setup: { ru: 'Для прямоугольника 9 см на 4 см записали P = 9 + 4 = 13 см.', uz: "9 santimetrga 4 santimetr to'g'ri to'rtburchak uchun P = 9 + 4 = 13 sm deb yozildi.", en: "For a rectangle measuring 9 cm by 4 cm, P = 9 + 4 = 13 cm was written." },
    prompt: { ru: 'Как исправить ошибку?', uz: "Xatoni qanday tuzatish kerak?", en: "How should the error be corrected?" },
    options: [
      { id: 'correct', text: { ru: 'P = 2 · (9 + 4) = 26 см', uz: "P = 2 · (9 + 4) = 26 sm", en: "P = 2 · (9 + 4) = 26 cm" }, correct: true },
      { id: 'onePair', text: { ru: 'Оставить P = 9 + 4 = 13 см', uz: "P = 9 + 4 = 13 sm ni qoldirish", en: "Keep P = 9 + 4 = 13 cm" }, wrong: [
        { ru: '13 см учитывает только одну длину и одну ширину.', uz: "13 sm faqat bitta uzunlik va bitta kenglikni hisobga oladi.", en: "13 cm includes only one length and one width." },
        { ru: 'У границы есть ещё одна такая же пара сторон.', uz: "Chegarada yana bitta shunday tomonlar jufti bor.", en: "The boundary has another identical pair of sides." },
      ] },
      { id: 'area', text: { ru: 'P = 9 · 4 = 36 см²', uz: "P = 9 · 4 = 36 sm²", en: "P = 9 · 4 = 36 cm²" }, wrong: [
        { ru: '9 · 4 находит площадь, а квадратная единица подтверждает это.', uz: "9 · 4 yuzani topadi, kvadrat birlik ham buni tasdiqlaydi.", en: "9 · 4 finds the area, and the square unit confirms this." },
        { ru: 'Для периметра сложите стороны границы, не считайте клетки внутри.', uz: "Perimetr uchun chegara tomonlarini qo'shing, ichki kataklarni sanamang.", en: "To find the perimeter, add the sides of the boundary; do not count the squares inside." },
      ] },
      { id: 'threeSides', text: { ru: 'P = 2 · 9 + 4 = 22 см', uz: "P = 2 · 9 + 4 = 22 sm", en: "P = 2 · 9 + 4 = 22 cm" }, wrong: [
        { ru: 'Здесь учтены две длины, но только одна ширина.', uz: "Bu yerda ikkita uzunlik, ammo faqat bitta kenglik hisobga olingan.", en: "This includes two lengths but only one width." },
        { ru: 'Удвойте и длину, и ширину.', uz: "Uzunlikni ham, kenglikni ham ikki marta oling.", en: "Double both the length and the width." },
      ] },
    ],
    correctText: { ru: 'Верно. Вторая пара сторон даёт множитель 2: P = 26 см.', uz: "To'g'ri. Ikkinchi tomonlar jufti 2 ko'paytuvchini beradi: P = 26 sm.", en: "Correct. The second pair of sides gives the factor 2: P = 26 cm." },
    rule: { ru: 'В периметре прямоугольника участвуют все четыре стороны.', uz: "To'g'ri to'rtburchak perimetrida barcha to'rtta tomon qatnashadi.", en: "All four sides are included in the perimeter of a rectangle." },
  },
  {
    id: '10', level: 'red', kind: 'mc', skillTag: 'formula-transfer',
    visual: { type: 'rectangle', a: 15, b: 8, mode: 'both', sequence: true, solveCaption: { ru: 'P = 46 м   ·   S = 120 м²', uz: "P = 46 m   ·   S = 120 m²", en: "P = 46 m   ·   S = 120 m²" } },
    thirdHint: { ru: 'Сначала найдите длину забора действием 2 · (15 + 8).', uz: "Avval panjara uzunligini 2 · (15 + 8) amali bilan toping.", en: "First find the length of the fence using 2 · (15 + 8)." },
    setup: { ru: 'Прямоугольный сад имеет длину 15 м и ширину 8 м. Нужны забор и покрытие.', uz: "To'g'ri to'rtburchak shaklidagi bog'ning uzunligi 15 metr, kengligi 8 metr. Panjara va qoplama kerak.", en: "A rectangular garden is 15 m long and 8 m wide. It needs a fence and a covering." },
    prompt: { ru: 'Какая пара результатов верна?', uz: "Qaysi natijalar jufti to'g'ri?", en: "Which pair of results is correct?" },
    options: [
      { id: 'correct', text: { ru: 'Забор: P = 46 м; покрытие: S = 120 м²', uz: "Panjara: P = 46 m; qoplama: S = 120 m²", en: "Fence: P = 46 m; covering: S = 120 m²" }, correct: true },
      { id: 'swapped', text: { ru: 'Забор: 120 м; покрытие: 46 м²', uz: "Panjara: 120 m; qoplama: 46 m²", en: "Fence: 120 m; covering: 46 m²" }, wrong: [
        { ru: 'Произведение 15 · 8 относится к внутренней части, не к забору.', uz: "15 · 8 ko'paytma panjaraga emas, ichki qismga tegishli.", en: "The product 15 · 8 describes the inside, not the fence." },
        { ru: 'Сопоставьте забор с периметром, а покрытие с площадью.', uz: "Panjarani perimetr, qoplamani esa yuza bilan moslang.", en: "Match the fence to the perimeter and the covering to the area." },
      ] },
      { id: 'onePair', text: { ru: 'Забор: 23 м; покрытие: 120 м²', uz: "Panjara: 23 m; qoplama: 120 m²", en: "Fence: 23 m; covering: 120 m²" }, wrong: [
        { ru: '23 м — только одна длина плюс одна ширина; забор окружает весь сад.', uz: "23 m faqat bitta uzunlik va bitta kenglik; panjara butun bog'ni o'raydi.", en: "23 m is only one length plus one width; the fence surrounds the whole garden." },
        { ru: 'Для забора удвойте сумму 15 + 8.', uz: "Panjara uchun 15 + 8 yig'indini ikki marta oling.", en: "Double the sum 15 + 8 for the fence." },
      ] },
      { id: 'bothP', text: { ru: 'Забор: 46 м; покрытие: 46 м²', uz: "Panjara: 46 m; qoplama: 46 m²", en: "Fence: 46 m; covering: 46 m²" }, wrong: [
        { ru: 'Для покрытия нельзя повторять число периметра: нужна площадь внутренней части.', uz: "Qoplama uchun perimetr sonini takrorlab bo'lmaydi: ichki qism yuzasi kerak.", en: "For the covering, you cannot repeat the perimeter value; you need the area of the inside." },
        { ru: 'Площадь покрытия найдите произведением 15 · 8.', uz: "Qoplama yuzasini 15 · 8 ko'paytma bilan toping.", en: "Find the area of the covering using the product 15 · 8." },
      ] },
    ],
    correctText: { ru: 'Верно. P = 2 · (15 + 8) = 46 м, S = 15 · 8 = 120 м².', uz: "To'g'ri. P = 2 · (15 + 8) = 46 m, S = 15 · 8 = 120 m².", en: "Correct. P = 2 · (15 + 8) = 46 m, S = 15 · 8 = 120 m²." },
    rule: { ru: 'Один объект может требовать две разные величины и две формулы.', uz: "Bitta obyekt ikki xil kattalik va ikki formulani talab qilishi mumkin.", en: "One object may require two different measurements and two formulae." },
  },
];

function GeometryVisual({ visual, solved, lang, hintLevel, hintTarget }) {
  if (!visual) return null;
  const hasHint = hintLevel >= 2;
  const target = String(hintTarget ?? '');
  if (visual.type === 'three-scenes') return <div className="p4-visual p4-scenes" aria-label={tx(UI.threeScenes, lang)}>
    <span className={`is-rect ${hasHint && target === 'rect-border' ? 'is-hint' : ''}`} />
    <span className={`is-square ${hasHint && target === 'square-border' ? 'is-hint' : ''}`} />
    <span className={`is-area ${hasHint && target === 'rect-inside' ? 'is-hint' : ''}`} />
  </div>;

  const a = visual.a;
  const b = visual.b ?? visual.a;
  const scale = Math.min(220 / a, 110 / b);
  const width = a * scale;
  const height = b * scale;
  const x = (340 - width) / 2;
  const y = 28 + (110 - height) / 2;
  const verticals = Array.from({ length: Math.max(a - 1, 0) }, (_, index) => x + ((index + 1) * width) / a);
  const horizontals = Array.from({ length: Math.max(b - 1, 0) }, (_, index) => y + ((index + 1) * height) / b);
  const areaMode = visual.mode === 'area' || visual.mode === 'both' || visual.type === 'unit-split';
  const showGrid = areaMode && (!visual.sequence || solved);
  const caption = tx(visual.caption, lang);
  const solveCaption = tx(visual.solveCaption, lang);
  const generalized = solved && visual.generalize;
  const horizontalLabel = generalized ? 'a' : `${a} ${tx(UI.units, lang)}`;
  const verticalLabel = generalized ? 'b' : `${b} ${tx(UI.units, lang)}`;
  const edgeHint = hasHint && ['onePair', 'rect-border', 'border', 'threeSides'].includes(target);
  const areaHint = hasHint && (visual.mode === 'area' || ['area', 'rect-inside', 'inside', 'bothP', 'swapped'].includes(target));

  if (visual.type === 'rectangle-error') return <figure className={`p4-visual p4-geometry p4-rect-error ${solved ? 'is-solved' : ''}`}>
    <svg viewBox="0 0 340 160" role="img" aria-label={tx(UI.missingSidesRectangle, lang)}>
      <line className="p4-shape-edge is-counted" x1={x} y1={y} x2={x + width} y2={y} />
      <line className="p4-shape-edge is-counted" x1={x + width} y1={y} x2={x + width} y2={y + height} />
      <line className={`p4-shape-edge is-missing ${hasHint ? 'is-hint' : ''}`} x1={x + width} y1={y + height} x2={x} y2={y + height} />
      <line className={`p4-shape-edge is-missing ${hasHint ? 'is-hint' : ''}`} x1={x} y1={y + height} x2={x} y2={y} />
      <text x={x + width / 2} y={y - 7} textAnchor="middle">{a}</text><text x={x + width + 12} y={y + height / 2}>{b}</text>
    </svg>
    <figcaption className="p4-error-row"><del>{visual.bad}</del><span>→</span><b className={solved ? 'p4-result-reveal' : ''}>{solved ? tx(visual.good, lang) : '?'}</b></figcaption>
  </figure>;

  const sideClass = (name) => {
    const missingPair = edgeHint && (name === 'bottom' || name === 'left');
    const squareHint = hasHint && visual.type === 'square';
    return `p4-shape-edge p4-side side-${name} ${missingPair || squareHint ? 'is-hint' : ''}`;
  };
  const shapeSvg = <svg viewBox="0 0 340 160" role="img" aria-label={tx(UI.exactSidesShape, lang)} preserveAspectRatio="xMidYMid meet">
    <rect className={`p4-shape-fill ${areaHint ? 'is-hint' : ''}`} x={x} y={y} width={width} height={height} />
    {showGrid && <g className={`p4-grid ${areaHint ? 'is-hint' : ''}`}>{verticals.map((lineX, index) => <line key={`v-${index}`} x1={lineX} y1={y} x2={lineX} y2={y + height} />)}{horizontals.map((lineY, index) => <line key={`h-${index}`} x1={x} y1={lineY} x2={x + width} y2={lineY} />)}</g>}
    <line className={sideClass('top')} x1={x} y1={y} x2={x + width} y2={y} />
    <line className={sideClass('right')} x1={x + width} y1={y} x2={x + width} y2={y + height} />
    <line className={sideClass('bottom')} x1={x + width} y1={y + height} x2={x} y2={y + height} />
    <line className={sideClass('left')} x1={x} y1={y + height} x2={x} y2={y} />
    <text className={generalized ? 'p4-model-reveal' : ''} x={x + width / 2} y={y - 7} textAnchor="middle">{horizontalLabel}</text>
    <text className={generalized ? 'p4-model-reveal' : ''} x={x - 12} y={y + height / 2} textAnchor="middle" transform={`rotate(-90 ${x - 12} ${y + height / 2})`}>{verticalLabel}</text>
  </svg>;

  if (visual.type === 'unit-split') return <figure className={`p4-visual p4-geometry p4-unit-visual type-${visual.type} ${solved ? 'is-solved' : ''}`}>
    {shapeSvg}<figcaption className="p4-unit-cards"><span className={hasHint ? 'is-hint' : ''}><small>P</small><b className={solved ? 'p4-result-reveal' : ''}>{solved ? tx({ ru: '18 см', uz: '18 sm', en: '18 cm' }, lang) : '?'}</b></span><span className={hasHint ? 'is-hint' : ''}><small>S</small><b className={solved ? 'p4-result-reveal' : ''}>{solved ? tx({ ru: '18 см²', uz: '18 sm²', en: '18 cm²' }, lang) : '?'}</b></span></figcaption>
  </figure>;

  return <figure className={`p4-visual p4-geometry type-${visual.type} is-${visual.mode ?? 'border'} ${visual.sequence ? 'is-sequence' : ''} ${solved ? 'is-solved' : ''}`}>
    {shapeSvg}
    {caption && <figcaption className={`${hasHint && (target === 'concrete' || areaHint) ? 'is-hint' : ''} ${solved && (visual.answer || visual.generalize) ? 'p4-result-reveal' : ''}`}>{generalized ? 'P = 2 · (a + b)' : solved && visual.answer ? caption.replace('□', visual.answer) : caption}</figcaption>}
    {solved && solveCaption && <figcaption className="p4-solve-caption">{solveCaption}</figcaption>}
  </figure>;
}

const Feedback = ({ ok, text, rule, lang, feedbackRef }) => <div ref={feedbackRef} className={`p4-fb ${ok ? 'is-ok' : 'is-no'}`} role="status" aria-live="polite"><p className="p4-fb-txt">{text}</p>{ok && rule && <p className="p4-rule"><b>{tx(UI.rule, lang)}.</b> {tx(rule, lang)}</p>}</div>;

const NumPad = ({ value, onChange, max, disabled, lang }) => <div className="p4-pad" role="group" aria-label={tx(UI.typeAnswer, lang)}><output className="p4-pad-display" aria-live="polite">{value ? grouped(value) : '—'}</output><div className="p4-pad-keys">{[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((number) => <button key={number} type="button" className="p4-key" disabled={disabled} onClick={() => onChange(value.length >= max ? value : value + number)}>{number}</button>)}<button type="button" className="p4-key p4-key-del" disabled={disabled} aria-label={tx(UI.clear, lang)} onClick={() => onChange(value.slice(0, -1))}>⌫</button></div></div>;

// `platform` berilganda tugma qatori chizilmaydi: uni LMS o'zi beradi va
// tekshiruvni `registerCheck` orqali chaqiradi (LMS kontrakti).
function Task({ task, lang, isLast, onSolved ,
  platform = false, mode, onReady, registerCheck, onSubmit, playCorrect, playWrong,
}) {
  // Xato javobdan keyin variantlar qayta aralashadi (metodist qarori 2026-08-21).
  const [wrongRound, setWrongRound] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- wrongRound ataylab yangi tartib beradi
  const options = useMemo(() => task.kind === 'mc' ? shuffle(task.options) : [], [task, wrongRound]);
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

  // Javobning to'g'riligi `checked` dan ALOHIDA hisoblanadi: tekshirishda
  // xato bo'lsa variantlar qayta aralashtiriladi.
  const answerCorrect = ((task.kind === 'mc' && picked?.correct === true)
    || ((task.kind === 'numpad' || task.kind === 'missing') && typed === task.answer)
    || (task.kind === 'match' && task.pairs.every((pair) => pairs[pair.id] === pair.correctRight))
    || (task.kind === 'order' && task.steps.every((step) => placed[step.id] === step.correct)));
  const solved = checked && answerCorrect;
  const canCheck = (task.kind === 'mc' && picked !== null)
    || ((task.kind === 'numpad' || task.kind === 'missing') && typed !== '')
    || (task.kind === 'match' && task.pairs.every((pair) => pairs[pair.id]))
    || (task.kind === 'order' && task.steps.every((step) => placed[step.id]));
  const wrongSource = (() => {
    if (task.kind === 'mc') return picked?.wrong;
    if (task.kind === 'numpad' || task.kind === 'missing') return task.wrongAnswers?.[typed] ?? task.wrongText;
    if (task.kind === 'match') return task.pairs.find((pair) => pairs[pair.id] !== pair.correctRight)?.wrong;
    if (task.kind === 'order') return task.steps.find((step) => placed[step.id] !== step.correct)?.wrong;
    return null;
  })();
  const wrongText = tx(adaptive(wrongSource, attempts, task.thirdHint), lang);
  const hintLevel = checked && !solved ? attempts : 0;
  const wrongPair = task.kind === 'match' ? task.pairs.find((pair) => pairs[pair.id] !== pair.correctRight) : null;
  const wrongStep = task.kind === 'order' ? task.steps.find((step) => placed[step.id] !== step.correct) : null;
  const hintTarget = task.kind === 'mc' ? picked?.id : task.kind === 'match' ? wrongPair?.id : task.kind === 'order' ? wrongStep?.id : typed;

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

  const retry = () => { checkingRef.current = false; setChecked(false); setPicked(null); setTyped(''); setPairs({}); setActiveLeft(null); setPlaced({}); setActiveStep(task.kind === 'order' ? task.steps[0].id : null); };
  const activateLeft = (id) => { if (solved) return; checkingRef.current = false; setPairs((old) => { const next = { ...old }; delete next[id]; return next; }); setActiveLeft(id); setChecked(false); };
  const connect = (rightId) => {
    if (activeLeft === null || solved) return;
    checkingRef.current = false;
    setPairs((old) => { const next = { ...old }; Object.keys(next).forEach((leftId) => { if (next[leftId] === rightId) delete next[leftId]; }); next[activeLeft] = rightId; return next; });
    setActiveLeft(null); setChecked(false);
  };
  const activateStep = (id) => { if (solved) return; checkingRef.current = false; setPlaced((old) => { const next = { ...old }; delete next[id]; return next; }); setActiveStep(id); setChecked(false); };
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
    if (task.kind === 'mc') return { selectedOptionId: picked?.id, selectedText: picked?.text };
    if (task.kind === 'numpad' || task.kind === 'missing') return { enteredValue: typed };
    if (task.kind === 'match') return { pairs: { ...pairs } };
    return { order: task.steps.map((step) => placed[step.id]) };
  };
  const correctSnapshot = () => {
    if (task.kind === 'mc') { const correct = task.options.find((option) => option.correct); return { optionId: correct.id, text: correct.text }; }
    if (task.kind === 'numpad' || task.kind === 'missing') return { value: task.answer };
    if (task.kind === 'match') return { pairs: Object.fromEntries(task.pairs.map((pair) => [pair.id, pair.correctRight])) };
    return { order: task.steps.map((step) => step.correct) };
  };
  const checkAnswer = () => {
    if (checkingRef.current || checked || solved || !canCheck) return;
    checkingRef.current = true;
    setAttempts((old) => old + 1);
    setChecked(true);
    if (!answerCorrect) setWrongRound((old) => old + 1);
  };

  // --- LMS platforma kontrakti ------------------------------------------
  // Mexanikaga tegilmaydi: natija mavjud holatlardan o'qiladi.
  useEffect(() => { onReady?.(Boolean(canCheck) && !solved && mode !== 'review'); },
    [canCheck, solved, mode, onReady]);
  const checkRef = useRef(checkAnswer);
  useEffect(() => { checkRef.current = checkAnswer; });
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
    <GeometryVisual visual={task.visual} solved={solved} lang={lang} hintLevel={hintLevel} hintTarget={hintTarget} />
    <h2 id={`task-${task.id}`} className="p4-ask">{tx(task.prompt, lang)}</h2>
    {task.kind === 'mc' && <div className="p4-options">{options.map((option, index) => <button key={option.id} type="button" className={`p4-option ${picked === option ? (checked ? (option.correct ? 'is-ok' : 'is-no') : 'is-on') : ''}`} aria-pressed={picked === option} disabled={solved} onClick={() => { checkingRef.current = false; setPicked(option); setChecked(false); }}><span className="p4-letter">{'ABCD'[index]}</span><span>{tx(option.text, lang)}</span></button>)}</div>}
    {(task.kind === 'numpad' || task.kind === 'missing') && <NumPad value={typed} onChange={(value) => { checkingRef.current = false; setTyped(value); setChecked(false); }} max={task.maxLen} disabled={solved} lang={lang} />}
    {task.kind === 'match' && <div className="p4-match"><p className="p4-note">{tx(UI.matchHint, lang)}</p><div className="p4-match-cols"><div className="p4-match-col">{task.pairs.map((pair) => <button key={pair.id} type="button" className={`p4-match-item ${activeLeft === pair.id ? 'is-active' : ''} ${pairs[pair.id] ? 'is-tied' : ''} ${hintLevel >= 2 && wrongPair?.id === pair.id ? 'is-hint' : ''}`} aria-pressed={activeLeft === pair.id} disabled={solved} onClick={() => activateLeft(pair.id)}><span>{tx(pair.left, lang)}</span>{pairs[pair.id] && <b className="p4-tie">{tx(task.right.find((right) => right.id === pairs[pair.id])?.text, lang)}</b>}</button>)}</div><div className="p4-match-col">{rightCards.map((right) => { const used = Object.values(pairs).includes(right.id); return <button key={right.id} type="button" className={`p4-match-item p4-match-right ${used ? 'is-used' : ''}`} aria-pressed={used} disabled={solved || activeLeft === null || used} onClick={() => connect(right.id)}>{tx(right.text, lang)}</button>; })}</div></div></div>}
    {task.kind === 'order' && <div className="p4-order"><p className="p4-note">{tx(UI.orderHint, lang)}</p><div className="p4-order-slots">{task.steps.map((step) => <button key={step.id} type="button" className={`p4-order-slot ${activeStep === step.id ? 'is-active' : ''} ${hintLevel >= 2 && wrongStep?.id === step.id ? 'is-hint' : ''}`} aria-pressed={activeStep === step.id} disabled={solved} onClick={() => activateStep(step.id)}><small>{tx(step.label, lang)}</small><b>{placed[step.id] ? tx(task.cards.find((card) => card.id === placed[step.id])?.text, lang) : '—'}</b></button>)}</div><div className="p4-card-bank">{orderCards.map((card) => { const used = Object.values(placed).includes(card.id); return <button key={card.id} type="button" className={`p4-card ${used ? 'is-used' : ''}`} aria-pressed={used} disabled={solved || !activeStep || used} onClick={() => placeStep(card.id)}>{tx(card.text, lang)}</button>; })}</div></div>}
    {checked && <Feedback feedbackRef={feedbackRef} ok={solved} text={solved ? tx(task.correctText, lang) : wrongText} rule={task.rule} lang={lang} />}
    {!platform && <div className="p4-actions">{!checked && !solved && <button type="button" className="p4-btn" disabled={!canCheck} onClick={checkAnswer}>{tx(UI.check, lang)}</button>}{checked && !solved && <button type="button" className="p4-btn p4-btn-ghost" onClick={retry}>{tx(UI.retry, lang)}</button>}{solved && <button type="button" className="p4-btn p4-btn-ready" disabled={advancing} onClick={() => { if (advancedRef.current) return; checkingRef.current = false; advancedRef.current = true; setAdvancing(true); onSolved({ taskId: task.id, taskNumber: Number(task.id), level: task.level, kind: task.kind, skillTag: task.skillTag, attempts, firstTry: attempts === 1, correct: true, setup: task.setup, prompt: task.prompt, studentAnswer: answerSnapshot(), correctAnswer: correctSnapshot(), answerChoices: task.options?.map(({ id, text, correct }) => ({ id, text, correct: Boolean(correct) })) ?? task.right ?? task.cards ?? null, screenMeta: SCREEN_META.find((screen) => screen.taskId === task.id) }); }}>{tx(isLast ? UI.finish : UI.next, lang)}</button>}</div>}
  </section>;
}

export default function Grade4Dars16Practice({ lang: langProp, onFinished }) {
  const preview = langProp === undefined || langProp === null;
  const [previewLang, setPreviewLang] = useState('uz');
  const lang = normalizeLang(preview ? previewLang : langProp);
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
        lessonId: LESSON_META.lessonId, lessonTitle: tx(LESSON_META.lessonTitle, lang), lessonTitleLocalized: LESSON_META.lessonTitle, studentName: null,
        activityType: 'practice', completed: true, totalQuestions: 10, answeredQuestions: 10,
        correctAnswers: nextFirstTry, firstTryCorrect: nextFirstTry, scorePercent: Math.round((nextFirstTry / 10) * 100),
        finalScore: nextFirstTry, finalTotal: 10, passed: nextFirstTry / 10 >= 0.6,
        firstTryStats: { total: 10, firstTryCorrect: nextFirstTry, correct: nextFirstTry, answered: 10, scorePercent: Math.round((nextFirstTry / 10) * 100) },
        attemptsTotal: nextAnswers.reduce((sum, item) => sum + item.attempts, 0),
        // eslint-disable-next-line react-hooks/purity -- duration is captured when the lesson finishes
        durationSec: startedAtRef.current ? Math.max(0, Math.floor((Date.now() - startedAtRef.current) / 1000)) : 0,
        skillTags: [...new Set(TASKS.map((item) => item.skillTag))], levelBreakdown,
        lessonMeta: LESSON_META, screenMeta: SCREEN_META, answers: nextAnswers,
      });
      return;
    }
    setIndex((old) => old + 1);
  };
  const restart = () => { finishedRef.current = false; startedAtRef.current = Date.now(); setIndex(0); setFirstTry(0); setAnswers([]); setFinished(false); };

  return <div className="p4-root"><style>{STYLES}</style>
    {preview && <div className="p4-lang" role="group" aria-label={tx(UI.language, lang)}>{SUPPORTED_LANGS.map((code) => <button key={code} type="button" className={code === lang ? 'is-active' : ''} aria-pressed={code === lang} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}
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
.p4-visual{width:100%;min-height:108px;padding:8px;border:1px solid rgba(23,59,82,.08);border-radius:16px;background:${T.paper};box-shadow:${T.shadowBase}}.p4-geometry{display:flex;align-items:center;justify-content:center;gap:8px;margin:0}.p4-geometry svg{display:block;width:min(100%,420px);height:138px;overflow:hidden}.p4-shape-fill{fill:transparent;opacity:0;transition:fill .36s ease,opacity .36s ease}.p4-geometry.is-area .p4-shape-fill,.p4-geometry.is-both .p4-shape-fill,.p4-unit-visual .p4-shape-fill{fill:${T.cyanSoft};opacity:.9}.p4-shape-fill.is-hint{fill:${T.accentSoft};opacity:1}.p4-grid{stroke:${T.cyan};stroke-width:1;opacity:.38;transition:stroke .18s ease,opacity .36s ease}.p4-grid.is-hint{stroke:${T.accent};opacity:.72}.p4-shape-edge{fill:none;stroke:${T.cyan};stroke-width:5;stroke-linecap:round;transition:stroke .36s ease,stroke-width .18s ease,opacity .36s ease}.p4-shape-edge.is-hint{stroke:${T.accent};stroke-width:7}.p4-geometry.type-square.is-solved .p4-shape-edge{stroke:${T.success};stroke-width:7;animation:p4-side-reveal .36s ease both}.p4-geometry.type-square.is-solved .side-right{animation-delay:.14s}.p4-geometry.type-square.is-solved .side-bottom{animation-delay:.28s}.p4-geometry.type-square.is-solved .side-left{animation-delay:.42s}.p4-geometry.is-sequence:not(.is-solved) .p4-shape-fill{opacity:0}.p4-geometry.is-sequence.is-solved .p4-shape-edge{stroke:${T.accent}}.p4-geometry.is-sequence.is-solved .p4-shape-fill{opacity:.9;transition-delay:.16s}.p4-geometry.is-sequence.is-solved .p4-grid{animation:p4-grid-in .36s .16s both}.p4-geometry text{fill:${T.navy};font:800 12px 'JetBrains Mono',monospace}.p4-geometry figcaption{flex:0 0 auto;max-width:280px;padding:8px 10px;border-radius:11px;background:${T.accentSoft};color:${T.accent};font:800 clamp(13px,2vw,17px) 'JetBrains Mono',monospace;transition:box-shadow .18s ease}.p4-geometry figcaption.is-hint{box-shadow:inset 0 0 0 2px ${T.accent}}.p4-solve-caption{animation:p4-math-in .36s .16s both}.p4-scenes{display:grid;grid-template-columns:repeat(3,1fr);align-items:center;justify-items:center;gap:12px}.p4-scenes span{display:block;width:min(100%,120px);height:76px;border:5px solid ${T.cyan};border-radius:8px;transition:border-color .18s ease,box-shadow .18s ease}.p4-scenes span.is-hint{border-color:${T.accent};box-shadow:0 0 0 4px rgba(255,91,53,.18)}.p4-scenes .is-square{width:76px}.p4-scenes .is-area{border:2px solid ${T.cyan};background:repeating-linear-gradient(0deg,transparent 0 14px,rgba(22,143,163,.16) 14px 16px),repeating-linear-gradient(90deg,transparent 0 14px,rgba(22,143,163,.16) 14px 16px),${T.cyanSoft}}.p4-unit-cards{display:grid!important;grid-template-columns:1fr 1fr;gap:8px;background:transparent!important;padding:0!important}.p4-unit-cards span{display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:104px;min-height:62px;padding:7px;border-radius:12px;background:${T.cyanSoft};transition:box-shadow .18s ease}.p4-unit-cards span.is-hint{box-shadow:inset 0 0 0 2px ${T.accent}}.p4-unit-cards small{font-weight:800}.p4-unit-cards b{font:800 15px 'JetBrains Mono',monospace}.p4-rect-error .p4-shape-edge.is-missing{stroke-dasharray:10 7;opacity:.28}.p4-rect-error .p4-shape-edge.is-missing.is-hint{stroke:${T.accent};opacity:1}.p4-rect-error.is-solved .p4-shape-edge.is-missing{stroke:${T.success};stroke-dasharray:none;opacity:1}.p4-error-row{display:flex!important;align-items:center;gap:8px;background:transparent!important}.p4-error-row del{color:${T.warn}}.p4-error-row b{color:${T.success}}.p4-error-row span{color:${T.ink3}}
.p4-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.p4-option{display:flex;align-items:center;gap:9px;min-height:54px;padding:9px 11px;text-align:left;font-family:inherit;font-weight:700;font-size:clamp(13px,1.9vw,15px);line-height:1.35;color:${T.ink};background:${T.paper};border:1px solid rgba(23,59,82,.12);border-radius:14px;cursor:pointer;box-shadow:0 8px 18px -18px rgba(23,59,82,.5);transition:border-color .18s ease,background-color .18s ease,transform .18s ease}.p4-option:hover:not(:disabled),.p4-card:hover:not(:disabled){border-color:rgba(22,143,163,.45);transform:translateY(-1px)}.p4-letter{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:8px;background:${T.cyanSoft};color:${T.cyan};font:800 11px 'JetBrains Mono',monospace}.p4-option.is-on{border-color:${T.accent};background:${T.accentSoft}}.p4-option.is-ok{border-color:rgba(34,122,83,.45);background:${T.successSoft};color:${T.success}}.p4-option.is-no{border-color:rgba(169,111,19,.45);background:${T.warnSoft};color:${T.warn}}
.p4-match-cols{display:flex;gap:9px;margin-top:7px}.p4-match-col{display:flex;flex-direction:column;gap:7px;flex:1}.p4-match-item{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-height:48px;padding:7px 9px;border:1px solid rgba(23,59,82,.12);border-radius:12px;background:${T.paper};font:800 clamp(12px,2.2vw,15px) 'Manrope',sans-serif;color:${T.navy};cursor:pointer;transition:border-color .18s ease,background-color .18s ease}.p4-match-item.is-active{border-color:${T.accent};background:${T.accentSoft}}.p4-match-item.is-hint{border-color:${T.accent};box-shadow:inset 0 0 0 2px rgba(255,91,53,.28)}.p4-match-item.is-tied{border-color:rgba(34,122,83,.35)}.p4-match-item.is-used{background:${T.successSoft}}.p4-match-item:disabled{cursor:default;opacity:.58}.p4-tie{font-size:12px;color:${T.success}}
.p4-order-slots{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin-top:7px}.p4-order-slot{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-height:72px;padding:7px;border:1px dashed rgba(23,59,82,.3);border-radius:13px;background:${T.paper};color:${T.ink2};font-family:inherit;cursor:pointer;transition:border-color .18s ease,background-color .18s ease}.p4-order-slot.is-active{border-style:solid;border-color:${T.accent};background:${T.accentSoft}}.p4-order-slot.is-hint{border-style:solid;border-color:${T.accent};box-shadow:inset 0 0 0 2px rgba(255,91,53,.28)}.p4-order-slot small{font-weight:800}.p4-order-slot b{font:800 12px/1.25 'JetBrains Mono',monospace;color:${T.navy}}.p4-card-bank{display:flex;flex-wrap:wrap;justify-content:center;gap:7px;margin-top:8px}.p4-card{min-height:46px;padding:7px 11px;border:1px solid rgba(23,59,82,.14);border-radius:12px;background:${T.paper};font:800 13px 'JetBrains Mono',monospace;color:${T.navy};cursor:pointer;transition:border-color .18s ease,background-color .18s ease,transform .18s ease}.p4-card.is-used{background:${T.cyanSoft};border-color:${T.cyan}}
.p4-pad{display:flex;flex-direction:column;align-items:center;gap:7px;width:min(232px,100%);margin:0 auto;padding:10px;border-radius:17px;background:linear-gradient(155deg,#EDF1F3,#DDE4E8)}.p4-pad-display{display:flex;align-items:center;justify-content:center;width:100%;min-height:48px;border:2px solid ${T.accent};border-radius:13px;background:${T.paper};font:800 clamp(20px,4.4vw,26px) 'JetBrains Mono',monospace;color:${T.navy}}.p4-pad-keys{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;width:100%}.p4-key{min-width:44px;min-height:44px;border:1px solid rgba(23,59,82,.16);border-radius:11px;background:${T.paper};font:800 clamp(18px,3.6vw,22px) 'JetBrains Mono',monospace;color:${T.navy};cursor:pointer}.p4-key-del{background:${T.accentSoft};color:${T.accent}}
.p4-fb{padding:11px 13px;border-radius:14px}.p4-fb.is-ok{background:${T.successSoft};box-shadow:inset 4px 0 0 ${T.success}}.p4-fb.is-no{background:${T.warnSoft};box-shadow:inset 4px 0 0 ${T.warn}}.p4-fb-txt{margin:0;font-family:'Source Serif 4',Georgia,serif;font-size:clamp(14px,2.1vw,16px);line-height:1.42}.p4-rule{margin:7px 0 0;font-size:13px;color:${T.ink2}}
.p4-actions{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:9px;margin-top:2px}.p4-btn{min-width:44px;min-height:46px;padding:9px 20px;border:0;border-radius:12px;background:${T.paper};color:${T.accent};font-family:inherit;font-weight:800;font-size:14px;cursor:pointer;box-shadow:0 8px 20px -10px rgba(255,91,53,.5),inset 0 0 0 1px rgba(255,91,53,.2)}.p4-btn:disabled{opacity:.45;cursor:not-allowed;box-shadow:none}.p4-btn-ready{background:${T.accent};color:#fff}.p4-btn-ghost{background:transparent;color:${T.ink2};box-shadow:none}.p4-done{display:flex;flex-direction:column;align-items:center;gap:9px;padding:24px 12px;text-align:center}.p4-done h2{margin:0;font-family:'Source Serif 4',Georgia,serif}.p4-medal{display:flex;align-items:center;justify-content:center;width:72px;height:72px;border-radius:50%;background:${T.accent};color:#fff;font-size:34px;box-shadow:0 0 0 9px ${T.accentSoft}}.p4-score{display:flex;align-items:baseline;gap:5px;margin:0;font-family:'JetBrains Mono',monospace}.p4-score b{font-size:clamp(32px,7vw,44px);color:${T.success}}.p4-score span{font-size:16px;color:${T.ink3}}.p4-complete{margin:0;color:${T.ink2}}
.p4-card{min-width:44px}
.p4-result-reveal{animation:p4-math-in .36s ease both}.p4-model-reveal{animation:p4-model-in .36s ease both}
@keyframes p4-grid-in{from{opacity:0}to{opacity:.38}}@keyframes p4-math-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}@keyframes p4-model-in{from{opacity:0}to{opacity:1}}@keyframes p4-side-reveal{from{stroke:${T.cyan};stroke-width:5;filter:none}65%{stroke:${T.accent};stroke-width:8;filter:drop-shadow(0 0 4px rgba(255,91,53,.35))}to{stroke:${T.success};stroke-width:7;filter:none}}
@media(max-width:600px){.p4-head{padding-top:58px}.p4-options{grid-template-columns:1fr}.p4-order-slots{grid-template-columns:1fr 1fr}.p4-order-slot{min-height:62px;padding:5px}.p4-geometry{flex-direction:column}.p4-geometry svg{height:116px}.p4-geometry figcaption{max-width:100%}.p4-unit-cards{width:min(100%,240px)}.p4-match-cols{gap:7px}.p4-match-item{font-size:12px;padding:6px}.p4-title{max-width:75%}.p4-error-row{flex-wrap:wrap;justify-content:center}}
@media(prefers-reduced-motion:reduce){.p4-root *,.p4-root *::before,.p4-root *::after{scroll-behavior:auto!important;transition:none!important;animation:none!important}}

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
